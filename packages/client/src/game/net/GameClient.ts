import type {
  ClientMessage,
  DraftState,
  GameAction,
  MatchState,
  PlayerIndex,
  ServerMessage,
  UnitId,
  WinReason,
} from '@warchest/shared'

export interface GameClientEvents {
  onQueueWaiting: () => void
  onDraftState: (you: PlayerIndex, state: DraftState) => void
  onMatchStart: (matchId: string, you: PlayerIndex, state: MatchState) => void
  onState: (state: MatchState, lastAction: GameAction) => void
  onError: (code: string, message: string) => void
  onEnd: (winner: PlayerIndex, reason: WinReason) => void
  onDisconnect: () => void
}

export class GameClient {
  private socket: WebSocket | null = null
  private url: string | null = null
  private seq = 0
  private readonly openQueue: Array<() => void> = []

  constructor(private readonly events: GameClientEvents) {}

  connect(url: string): void {
    this.url = url
    this.openSocket()
  }

  joinQueue(login: string): void {
    this.whenOpen(() => this.send({ type: 'queue.join', login }))
  }

  leaveQueue(): void {
    this.send({ type: 'queue.leave' })
  }

  pickDraftUnit(unit: UnitId): void {
    this.send({ type: 'draft.pick', unit })
  }

  sendAction(action: GameAction): number {
    this.seq += 1
    this.send({ type: 'match.action', seq: this.seq, action })
    return this.seq
  }

  resign(): void {
    this.send({ type: 'match.resign' })
  }

  disconnect(): void {
    this.url = null
    this.openQueue.length = 0
    this.socket?.close()
    this.socket = null
  }

  private openSocket(): void {
    if (
      !this.url ||
      (this.socket && this.socket.readyState !== WebSocket.CLOSED)
    ) {
      return
    }
    const socket = new WebSocket(this.url)
    this.socket = socket
    socket.onopen = () => {
      const pending = this.openQueue.splice(0)
      for (const fn of pending) {
        fn()
      }
    }
    socket.onmessage = event => this.handleMessage(event.data as string)
    socket.onclose = () => {
      this.socket = null
      this.events.onDisconnect()
      if (this.openQueue.length > 0) {
        this.openSocket()
      }
    }
  }

  private whenOpen(fn: () => void): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      fn()
      return
    }
    this.openQueue.push(fn)
    this.openSocket()
  }

  private send(message: ClientMessage): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message))
    }
  }

  private handleMessage(raw: string): void {
    let message: ServerMessage
    try {
      message = JSON.parse(raw) as ServerMessage
    } catch {
      return
    }
    switch (message.type) {
      case 'queue.waiting':
        this.events.onQueueWaiting()
        break
      case 'draft.state':
        this.events.onDraftState(message.you, message.state)
        break
      case 'match.start':
        this.events.onMatchStart(message.matchId, message.you, message.state)
        break
      case 'match.state':
        this.events.onState(message.state, message.lastAction)
        break
      case 'match.error':
        this.events.onError(message.code, message.message)
        break
      case 'match.end':
        this.events.onEnd(message.winner, message.reason)
        break
      case 'match.opponentLeft':
        break
    }
  }
}
