import type { AxialCoord } from '../hex'
import type { MatchState, PlayerIndex } from '../types'
import { UnitTactic } from './UnitTactic'
import { adjacentAllies, cellAt } from './helpers'

export class MarshalTactic extends UnitTactic {
  readonly unitId = 'marshal' as const
  readonly name = 'Перегруппировка'
  readonly description = 'Меняется местами с соседним союзным юнитом'

  activeTargets(
    state: MatchState,
    playerIndex: PlayerIndex,
    at: AxialCoord
  ): AxialCoord[] {
    return adjacentAllies(state, playerIndex, at)
  }

  applyActive(
    state: MatchState,
    _playerIndex: PlayerIndex,
    at: AxialCoord,
    target: AxialCoord
  ): void {
    const from = cellAt(state, at)
    const to = cellAt(state, target)
    if (!from?.unit || !to?.unit) {
      return
    }
    const unit = from.unit
    from.unit = to.unit
    to.unit = unit
  }
}
