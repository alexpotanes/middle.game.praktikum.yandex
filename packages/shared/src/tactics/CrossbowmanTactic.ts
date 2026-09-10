import type { AxialCoord } from '../hex'
import type { MatchState, PlayerIndex } from '../types'
import { UnitTactic } from './UnitTactic'
import { damageUnit, rangedEnemies } from './helpers'

export class CrossbowmanTactic extends UnitTactic {
  readonly unitId = 'crossbowman' as const
  readonly name = 'Болт'
  readonly description = 'Атака врага на расстоянии 2–3 по прямой линии'

  activeTargets(
    state: MatchState,
    playerIndex: PlayerIndex,
    at: AxialCoord
  ): AxialCoord[] {
    return rangedEnemies(state, playerIndex, at, {
      distances: [2, 3],
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
