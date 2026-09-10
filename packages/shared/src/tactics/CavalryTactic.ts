import { UnitTactic } from './UnitTactic'

export class CavalryTactic extends UnitTactic {
  readonly unitId = 'cavalry' as const
  readonly name = 'Марш'
  readonly description = 'Пассивно: кавалерия ходит на 2 гекса'
  readonly kind = 'passive' as const

  moveRange(): number {
    return 2
  }
}
