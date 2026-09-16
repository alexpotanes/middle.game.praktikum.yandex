import type { AxialCoord } from '../hex'
import type { MatchState, PlayerIndex } from '../types'
import { UnitTactic } from './UnitTactic'
import { damageUnit, rangedEnemies } from './helpers'

export class ArcherTactic extends UnitTactic {
  readonly unitId = 'archer' as const
  readonly name = 'Выстрел'
  readonly description = 'Атака вражеского юнита ровно на расстоянии 2'

  activeTargets(
    state: MatchState,
    playerIndex: PlayerIndex,
    at: AxialCoord
  ): AxialCoord[] {
    return rangedEnemies(state, playerIndex, at, { distances: [2] })
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
