import type { AxialCoord } from '../hex'
import { hexDistance, hexKey, hexNeighbors, isStraightLine } from '../hex'
import type { CellState, MatchState, PlayerIndex } from '../types'
import type { BoardUnit } from '../types'
import type { UnitId } from '../units'

export const unitTypeOf = (unit: BoardUnit): UnitId => unit.coins[0].unit

export const cellAt = (
  state: MatchState,
  coord: AxialCoord
): CellState | undefined => state.board[hexKey(coord)]

export const findUnitCell = (
  state: MatchState,
  owner: PlayerIndex,
  unit: UnitId
): CellState | undefined =>
  Object.values(state.board).find(
    cell =>
      cell.unit && cell.unit.owner === owner && unitTypeOf(cell.unit) === unit
  )

export const damageUnit = (
  state: MatchState,
  coord: AxialCoord
): { destroyed: boolean } => {
  const cell = cellAt(state, coord)
  if (!cell?.unit) {
    return { destroyed: false }
  }
  cell.unit.coins.pop()
  if (cell.unit.coins.length === 0) {
    delete cell.unit
    return { destroyed: true }
  }
  return { destroyed: false }
}

export const adjacentEnemies = (
  state: MatchState,
  playerIndex: PlayerIndex,
  at: AxialCoord
): AxialCoord[] =>
  hexNeighbors(at).filter(coord => {
    const cell = cellAt(state, coord)
    return cell?.unit && cell.unit.owner !== playerIndex
  })

export const adjacentAllies = (
  state: MatchState,
  playerIndex: PlayerIndex,
  at: AxialCoord
): AxialCoord[] =>
  hexNeighbors(at).filter(coord => {
    const cell = cellAt(state, coord)
    return cell?.unit && cell.unit.owner === playerIndex
  })

export const emptyNeighbors = (
  state: MatchState,
  at: AxialCoord
): AxialCoord[] =>
  hexNeighbors(at).filter(coord => {
    const cell = cellAt(state, coord)
    return cell && !cell.unit
  })

export interface RangedOptions {
  distances: number[]
  straightOnly?: boolean
}

export const rangedEnemies = (
  state: MatchState,
  playerIndex: PlayerIndex,
  at: AxialCoord,
  options: RangedOptions
): AxialCoord[] =>
  Object.values(state.board)
    .filter(cell => cell.unit && cell.unit.owner !== playerIndex)
    .filter(cell => options.distances.includes(hexDistance(at, cell.coord)))
    .filter(cell => !options.straightOnly || isStraightLine(at, cell.coord))
    .map(cell => cell.coord)

export const moveUnit = (
  state: MatchState,
  from: AxialCoord,
  to: AxialCoord
): void => {
  const fromCell = cellAt(state, from)
  const toCell = cellAt(state, to)
  if (!fromCell?.unit || !toCell || toCell.unit) {
    return
  }
  toCell.unit = fromCell.unit
  delete fromCell.unit
}

export const findAdjacentAttacker = (
  state: MatchState,
  playerIndex: PlayerIndex,
  unit: UnitId,
  target: AxialCoord
): CellState | undefined =>
  hexNeighbors(target)
    .map(coord => cellAt(state, coord))
    .find((cell): cell is CellState =>
      Boolean(
        cell?.unit &&
        cell.unit.owner === playerIndex &&
        unitTypeOf(cell.unit) === unit
      )
    )
