import { UnitTactic } from './UnitTactic'

export class ScoutTactic extends UnitTactic {
  readonly unitId = 'scout' as const
  readonly name = 'Дозор'
  readonly description =
    'Пассивно: развёртывается на любую пустую локацию, даже без контроля'
  readonly kind = 'passive' as const

  deployAnywhere(): boolean {
    return true
  }
}
