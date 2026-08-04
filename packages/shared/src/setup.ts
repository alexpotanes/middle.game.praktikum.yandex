import { hexagonCoords, hexKey } from './hex'
import type { AxialCoord } from './hex'
import { shuffleWithSeed } from './rng'
import type { CellState, MatchState, PlayerState } from './types'
import {
  COINS_PER_UNIT_IN_BAG,
  COINS_PER_UNIT_TOTAL,
  CONTROL_MARKERS_PER_PLAYER,
  HAND_SIZE,
  ROYAL,
} from './units'
import type { Coin, UnitId } from './units'

export const BOARD_RADIUS = 4

const START_LOCATIONS: Record<0 | 1, AxialCoord[]> = {
  0: [
    { q: -4, r: 2 },
    { q: -3, r: -1 },
  ],
  1: [
    { q: 4, r: -2 },
    { q: 3, r: 1 },
  ],
}

const NEUTRAL_CONTROL_POINTS: AxialCoord[] = [
  { q: 0, r: 0 },
  { q: 2, r: -2 },
  { q: -2, r: 2 },
  { q: 1, r: 1 },
]

const createBoard = (): Record<string, CellState> => {
  const board: Record<string, CellState> = {}
  for (const coord of hexagonCoords(BOARD_RADIUS)) {
    board[hexKey(coord)] = { coord, isLocation: false }
  }
  for (const player of [0, 1] as const) {
    for (const coord of START_LOCATIONS[player]) {
      const cell = board[hexKey(coord)]
      cell.isLocation = true
      cell.isStart = player
      cell.control = player
    }
  }
  for (const coord of NEUTRAL_CONTROL_POINTS) {
    board[hexKey(coord)].isLocation = true
  }
  return board
}

const createCoins = (
  units: UnitId[],
  startId: number
): { bag: Coin[]; supply: Coin[] } => {
  let id = startId
  const bag: Coin[] = []
  const supply: Coin[] = []
  for (const unit of units) {
    for (let i = 0; i < COINS_PER_UNIT_TOTAL; i++) {
      const coin = { id: id++, unit }
      if (i < COINS_PER_UNIT_IN_BAG) {
        bag.push(coin)
      } else {
        supply.push(coin)
      }
    }
  }
  bag.push({ id: id++, unit: ROYAL })
  return { bag, supply }
}

const createPlayer = (
  login: string,
  units: UnitId[],
  startId: number,
  rngState: number
): { player: PlayerState; rngState: number } => {
  const { bag, supply } = createCoins(units, startId)
  const shuffled = shuffleWithSeed(bag, rngState)
  const hand = shuffled.items.slice(0, HAND_SIZE)
  const rest = shuffled.items.slice(HAND_SIZE)
  return {
    player: {
      login,
      units,
      hand,
      bag: rest,
      discard: [],
      supply,
      controlMarkersLeft:
        CONTROL_MARKERS_PER_PLAYER - START_LOCATIONS[0].length,
      passed: false,
    },
    rngState: shuffled.rngState,
  }
}

export const createInitialMatch = (
  loginA: string,
  unitsA: UnitId[],
  loginB: string,
  unitsB: UnitId[],
  seed: number
): MatchState => {
  let rngState = seed
  const first = createPlayer(loginA, unitsA, 0, rngState)
  rngState = first.rngState
  const second = createPlayer(loginB, unitsB, 1000, rngState)
  rngState = second.rngState

  const initiativeRoll = shuffleWithSeed([0, 1], rngState)
  rngState = initiativeRoll.rngState
  const initiative = initiativeRoll.items[0] as 0 | 1

  return {
    board: createBoard(),
    players: [first.player, second.player],
    activePlayer: initiative,
    initiative,
    round: 1,
    winner: null,
    winReason: null,
    rngState,
  }
}
