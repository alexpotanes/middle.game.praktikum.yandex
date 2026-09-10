import type { AxialCoord } from '../hex'
import type { MatchState, PlayerIndex } from '../types'
import { UnitTactic } from './UnitTactic'
import { damageUnit, rangedEnemies } from './helpers'

export class SpearmanTactic extends UnitTactic {
  readonly unitId = 'spearman' as const
  readonly name = 'Укол'
  readonly description =
    'Атака врага ровно на расстоянии 2 по прямой, даже сквозь занятые гексы'

  activeTargets(
    state: MatchState,
    playerIndex: PlayerIndex,
    at: AxialCoord
  ): AxialCoord[] {
    return rangedEnemies(state, playerIndex, at, {
      distances: [2],
      straightOnly: true,
    })
  }

  applyActive(
    state: MatchState,
    _playerIndex: PlayerIndex,
    _at: AxialCoord,
    target: AxialCoord
  ): void {
    damageUnit(state, target)
  }
}
