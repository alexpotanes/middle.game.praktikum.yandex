import { UnitTactic } from './UnitTactic'

export class GuardTactic extends UnitTactic {
  readonly unitId = 'guard' as const
  readonly name = 'Охрана'
  readonly description =
    'Пассивно: союзных юнитов рядом с гвардейцем нельзя атаковать'
  readonly kind = 'passive' as const

  protectsAdjacentAllies(): boolean {
    return true
  }
}
