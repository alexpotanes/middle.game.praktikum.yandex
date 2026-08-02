import type { WebSocket } from 'ws'
import {
  applyAction,
  applyDraftPick,
  createDraft,
  createInitialMatch,
  isDraftComplete,
} from '@warchest/shared'
import type {
  DraftState,
  GameAction,
  MatchState,
  PlayerIndex,
  ServerMessage,
  UnitId,
  WinReason,
} from '@warchest/shared'

let nextMatchId = 1

export class MatchSession {
  readonly id = `match-${nextMatchId++}`

  private draft: DraftState | null = null
  private state: MatchState | null = null
  private finished = false

  constructor(
    private readonly logins: [string, string],
    private readonly sockets: [WebSocket, WebSocket]
  ) {
    this.draft = createDraft(Date.now() % 2147483647)
  }

  start(): void {
    this.broadcastDraft()
  }

  playerIndexOf(socket: WebSocket): PlayerIndex | null {
    if (this.sockets[0] === socket) {
      return 0
    }
    if (this.sockets[1] === socket) {
      return 1
    }
    return null
  }

  handleDraftPick(socket: WebSocket, unit: UnitId): void {
    if (this.finished || !this.draft) {
      return
    }
    const playerIndex = this.playerIndexOf(socket)
    if (playerIndex === null) {
      return
    }
    const result = applyDraftPick(this.draft, playerIndex, unit)
    if ('error' in result) {
      this.send(socket, {
        type: 'match.error',
        seq: null,
        code: 'DRAFT',
        message: result.error,
      })
      return
    }
    this.draft = result.draft
    if (!isDraftComplete(this.draft)) {
      this.broadcastDraft()
      return
    }
    const [unitsA, unitsB] = this.draft.picks
    this.state = createInitialMatch(
      this.logins[0],
      unitsA,
      this.logins[1],
      unitsB,
      this.draft.rngState
    )
    this.draft = null
    this.sockets.forEach((socket, index) => {
      this.send(socket, {
        type: 'match.start',
        matchId: this.id,
        you: index as PlayerIndex,
        state: this.state as MatchState,
      })
    })
  }

  handleAction(socket: WebSocket, seq: number, action: GameAction): void {
    if (this.finished || !this.state) {
      return
    }
    const playerIndex = this.playerIndexOf(socket)
    if (playerIndex === null) {
      return
    }
    const result = applyAction(this.state, playerIndex, action)
    if ('error' in result) {
      this.send(socket, {
        type: 'match.error',
        seq,
        code: result.error.code,
        message: result.error.message,
      })
      return
    }
    this.state = result.state
    this.broadcast({
      type: 'match.state',
      seq,
      state: this.state,
      lastAction: action,
    })
    if (this.state.winner !== null) {
      this.finish(this.state.winner, this.state.winReason ?? 'control')
    }
  }

  handleResign(socket: WebSocket): void {
    const playerIndex = this.playerIndexOf(socket)
    if (playerIndex === null || this.finished) {
      return
    }
    this.finish(playerIndex === 0 ? 1 : 0, 'resign')
  }

  handleDisconnect(socket: WebSocket): void {
    const playerIndex = this.playerIndexOf(socket)
    if (playerIndex === null || this.finished) {
      return
    }
    this.finish(playerIndex === 0 ? 1 : 0, 'disconnect')
  }

  private broadcastDraft(): void {
    if (!this.draft) {
      return
    }
    this.sockets.forEach((socket, index) => {
      this.send(socket, {
        type: 'draft.state',
        you: index as PlayerIndex,
        state: this.draft as DraftState,
      })
    })
  }

  private finish(winner: PlayerIndex, reason: WinReason): void {
    this.finished = true
    this.broadcast({ type: 'match.end', winner, reason })
    for (const socket of this.sockets) {
      socket.close()
    }
  }

  private broadcast(message: ServerMessage): void {
    for (const socket of this.sockets) {
      this.send(socket, message)
    }
  }

  private send(socket: WebSocket, message: ServerMessage): void {
    if (socket.readyState === socket.OPEN) {
      socket.send(JSON.stringify(message))
    }
  }
}
