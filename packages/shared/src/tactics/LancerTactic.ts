import type { AxialCoord } from '../hex'
import type { MatchState, PlayerIndex } from '../types'
import { UnitTactic } from './UnitTactic'
import { moveUnit } from './helpers'

export class LancerTactic extends UnitTactic {
  readonly unitId = 'lancer' as const
  readonly name = 'Преследование'
  readonly description =
    'Пассивно: уничтожив юнит атакой, улан встаёт на его клетку'
  readonly kind = 'passive' as const

  onAttackKilled(
    state: MatchState,
    _owner: PlayerIndex,
    from: AxialCoord,
    to: AxialCoord
  ): void {
    moveUnit(state, from, to)
  }
}
