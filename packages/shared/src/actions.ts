import type { AxialCoord } from './hex'
import type { UnitId } from './units'

export type GameAction =
  | { type: 'deploy'; coinId: number; to: AxialCoord }
  | { type: 'bolster'; coinId: number; to: AxialCoord }
  | { type: 'move'; coinId: number; from: AxialCoord; to: AxialCoord }
  | { type: 'attack'; coinId: number; target: AxialCoord }
  | { type: 'control'; coinId: number; at: AxialCoord }
  | { type: 'recruit'; coinId: number; unitId: UnitId }
  | { type: 'pass'; coinId: number }
  | { type: 'claimInitiative'; coinId: number }
  | { type: 'tactic'; coinId: number; target: AxialCoord }

export type RuleErrorCode =
  | 'NOT_YOUR_TURN'
  | 'COIN_NOT_IN_HAND'
  | 'ILLEGAL_TARGET'
  | 'UNIT_TYPE_ON_FIELD'
  | 'NO_MATCHING_UNIT'
  | 'SUPPLY_EMPTY'
  | 'ALREADY_PASSED'
  | 'GAME_FINISHED'
  | 'NOT_IMPLEMENTED'

export interface RuleError {
  code: RuleErrorCode
  message: string
}
