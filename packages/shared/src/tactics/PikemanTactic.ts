import { UnitTactic } from './UnitTactic'

export class PikemanTactic extends UnitTactic {
  readonly unitId = 'pikeman' as const
  readonly name = 'Стена пик'
  readonly description =
    'Пассивно: атакующий пикинёра в ближнем бою теряет монету'
  readonly kind = 'passive' as const

  counterattacks(): boolean {
    return true
  }
}
