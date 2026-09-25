import type { AxialCoord } from '../hex'
import { hexBetween } from '../hex'
import type { MatchState, PlayerIndex } from '../types'
import { UnitTactic } from './UnitTactic'
import { cellAt, damageUnit, moveUnit, rangedEnemies } from './helpers'

export class KnightTactic extends UnitTactic {
  readonly unitId = 'knight' as const
  readonly name = 'Выпад'
  readonly description =
    'Атака врага на расстоянии 2 по прямой через пустой гекс; рыцарь встаёт на промежуточный гекс'

  activeTargets(
    state: MatchState,
    playerIndex: PlayerIndex,
    at: AxialCoord
  ): AxialCoord[] {
    return rangedEnemies(state, playerIndex, at, {
      distances: [2],
      straightOnly: true,
    }).filter(coord => {
      const between = cellAt(state, hexBetween(at, coord))
      return between && !between.unit
    })
  }

  applyActive(
    state: MatchState,
    _playerIndex: PlayerIndex,
    at: AxialCoord,
    target: AxialCoord
  ): void {
    damageUnit(state, target)
    moveUnit(state, at, hexBetween(at, target))
  }
}
