import type { AxialCoord } from '../hex'
import type { MatchState, PlayerIndex } from '../types'
import { UnitTactic } from './UnitTactic'
import { adjacentEnemies, damageUnit } from './helpers'

export class BerserkerTactic extends UnitTactic {
  readonly unitId = 'berserker' as const
  readonly name = 'Ярость'
  readonly description = 'Снимает по 1 монете со всех соседних вражеских юнитов'

  activeTargets(
    state: MatchState,
    playerIndex: PlayerIndex,
    at: AxialCoord
  ): AxialCoord[] {
    return adjacentEnemies(state, playerIndex, at).length > 0 ? [at] : []
  }

  applyActive(
    state: MatchState,
    playerIndex: PlayerIndex,
    at: AxialCoord
  ): void {
    for (const coord of adjacentEnemies(state, playerIndex, at)) {
      damageUnit(state, coord)
    }
  }
}
