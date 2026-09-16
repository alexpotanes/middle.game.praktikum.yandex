import type { AxialCoord } from './hex'
import type { Coin, UnitId } from './units'

export type PlayerIndex = 0 | 1

export interface BoardUnit {
  owner: PlayerIndex
  coins: Coin[]
}

export interface CellState {
  coord: AxialCoord
  isLocation: boolean
  isStart?: PlayerIndex
  control?: PlayerIndex
  unit?: BoardUnit
}

export interface PlayerState {
  login: string
  units: UnitId[]
  hand: Coin[]
  bag: Coin[]
  discard: Coin[]
  supply: Coin[]
  controlMarkersLeft: number
  passed: boolean
}

export type WinReason = 'control' | 'elimination' | 'resign' | 'disconnect'

export interface MatchState {
  board: Record<string, CellState>
  players: [PlayerState, PlayerState]
  activePlayer: PlayerIndex
  initiative: PlayerIndex
  round: number
  winner: PlayerIndex | null
  winReason: WinReason | null
  rngState: number
}

export const otherPlayer = (index: PlayerIndex): PlayerIndex =>
  index === 0 ? 1 : 0
