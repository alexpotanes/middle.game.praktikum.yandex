import type { AxialCoord } from '../hex'
import type { MatchState, PlayerIndex } from '../types'
import { shuffleWithSeed } from '../rng'
import { UnitTactic } from './UnitTactic'
import { adjacentEnemies, emptyNeighbors, moveUnit } from './helpers'

export class MercenaryTactic extends UnitTactic {
  readonly unitId = 'mercenary' as const
  readonly name = 'Подкуп'
  readonly description =
    'Соседний вражеский юнит сдвигается на случайную соседнюю пустую клетку'

  activeTargets(
    state: MatchState,
    playerIndex: PlayerIndex,
    at: AxialCoord
  ): AxialCoord[] {
    return adjacentEnemies(state, playerIndex, at).filter(
      coord => emptyNeighbors(state, coord).length > 0
    )
  }

  applyActive(
    state: MatchState,
    _playerIndex: PlayerIndex,
    _at: AxialCoord,
    target: AxialCoord
  ): void {
    const options = emptyNeighbors(state, target)
    if (options.length === 0) {
      return
    }
    const shuffled = shuffleWithSeed(options, state.rngState)
    state.rngState = shuffled.rngState
    moveUnit(state, target, shuffled.items[0])
  }
}
