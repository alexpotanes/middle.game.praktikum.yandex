import type { RuleError } from '../actions'
import type { AxialCoord } from '../hex'
import { hexEquals } from '../hex'
import type { MatchState, PlayerIndex } from '../types'
import type { UnitId } from '../units'

export abstract class UnitTactic {
  abstract readonly unitId: UnitId
  abstract readonly name: string
  abstract readonly description: string
  readonly kind: 'active' | 'passive' = 'active'

  moveRange(): number {
    return 1
  }

  deployAnywhere(): boolean {
    return false
  }

  protectsAdjacentAllies(): boolean {
    return false
  }

  counterattacks(): boolean {
    return false
  }

  onAttackKilled?(
    state: MatchState,
    owner: PlayerIndex,
    from: AxialCoord,
    to: AxialCoord
  ): void

  activeTargets(
    _state: MatchState,
    _playerIndex: PlayerIndex,
    _at: AxialCoord
  ): AxialCoord[] {
    return []
  }

  validateActive(
    state: MatchState,
    playerIndex: PlayerIndex,
    at: AxialCoord,
    target: AxialCoord
  ): RuleError | null {
    const legal = this.activeTargets(state, playerIndex, at).some(coord =>
      hexEquals(coord, target)
    )
    return legal
      ? null
      : { code: 'ILLEGAL_TARGET', message: 'Недопустимая цель тактики' }
  }

  applyActive(
    _state: MatchState,
    _playerIndex: PlayerIndex,
    _at: AxialCoord,
    _target: AxialCoord
  ): void {
    // пассивные тактики не применяются
  }
}
