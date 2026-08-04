import type { AxialCoord } from '../hex'
import type { MatchState, PlayerIndex } from '../types'
import { UnitTactic } from './UnitTactic'
import { damageUnit, rangedEnemies } from './helpers'

export class LongbowmanTactic extends UnitTactic {
  readonly unitId = 'longbowman' as const
  readonly name = 'Дальний выстрел'
  readonly description = 'Атака вражеского юнита ровно на расстоянии 3'

  activeTargets(
    state: MatchState,
    playerIndex: PlayerIndex,
    at: AxialCoord
  ): AxialCoord[] {
    return rangedEnemies(state, playerIndex, at, { distances: [3] })
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
