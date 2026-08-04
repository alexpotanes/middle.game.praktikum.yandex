import type { GameAction } from './actions'
import type { DraftState } from './draft'
import type { MatchState, PlayerIndex, WinReason } from './types'
import type { UnitId } from './units'

export type ClientMessage =
  | { type: 'queue.join'; login: string }
  | { type: 'queue.leave' }
  | { type: 'draft.pick'; unit: UnitId }
  | { type: 'match.action'; seq: number; action: GameAction }
  | { type: 'match.resign' }

export type ServerMessage =
  | { type: 'queue.waiting' }
  | { type: 'draft.state'; you: PlayerIndex; state: DraftState }
  | {
      type: 'match.start'
      matchId: string
      you: PlayerIndex
      state: MatchState
    }
  | {
      type: 'match.state'
      seq: number
      state: MatchState
      lastAction: GameAction
    }
  | { type: 'match.error'; seq: number | null; code: string; message: string }
  | { type: 'match.opponentLeft' }
  | { type: 'match.end'; winner: PlayerIndex; reason: WinReason }
