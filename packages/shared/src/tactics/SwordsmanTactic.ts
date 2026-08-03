import type { AxialCoord } from '../hex'
import type { MatchState, PlayerIndex } from '../types'
import { UnitTactic } from './UnitTactic'
import { adjacentEnemies, damageUnit } from './helpers'

export class SwordsmanTactic extends UnitTactic {
  readonly unitId = 'swordsman' as const
  readonly name = 'Двойной удар'
  readonly description = 'Атака соседнего вражеского юнита: снимает 2 монеты'

  activeTargets(
    state: MatchState,
    playerIndex: PlayerIndex,
    at: AxialCoord
  ): AxialCoord[] {
    return adjacentEnemies(state, playerIndex, at)
  }

  applyActive(
    state: MatchState,
    _playerIndex: PlayerIndex,
    _at: AxialCoord,
    target: AxialCoord
  ): void {
    damageUnit(state, target)
    damageUnit(state, target)
  }
}
