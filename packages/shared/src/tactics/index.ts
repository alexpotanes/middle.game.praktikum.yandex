import type { UnitId } from '../units'
import { ArcherTactic } from './ArcherTactic'
import { BerserkerTactic } from './BerserkerTactic'
import { CavalryTactic } from './CavalryTactic'
import { CrossbowmanTactic } from './CrossbowmanTactic'
import { GuardTactic } from './GuardTactic'
import { KnightTactic } from './KnightTactic'
import { LancerTactic } from './LancerTactic'
import { LongbowmanTactic } from './LongbowmanTactic'
import { ManatarmsTactic } from './ManatarmsTactic'
import { MarshalTactic } from './MarshalTactic'
import { MercenaryTactic } from './MercenaryTactic'
import { PikemanTactic } from './PikemanTactic'
import { ScoutTactic } from './ScoutTactic'
import { SpearmanTactic } from './SpearmanTactic'
import { SwordsmanTactic } from './SwordsmanTactic'
import type { UnitTactic } from './UnitTactic'

const TACTICS: Partial<Record<UnitId, UnitTactic>> = {
  swordsman: new SwordsmanTactic(),
  archer: new ArcherTactic(),
  cavalry: new CavalryTactic(),
  spearman: new SpearmanTactic(),
  crossbowman: new CrossbowmanTactic(),
  knight: new KnightTactic(),
  berserker: new BerserkerTactic(),
  scout: new ScoutTactic(),
  lancer: new LancerTactic(),
  longbowman: new LongbowmanTactic(),
  manatarms: new ManatarmsTactic(),
  mercenary: new MercenaryTactic(),
  pikeman: new PikemanTactic(),
  guard: new GuardTactic(),
  marshal: new MarshalTactic(),
}

export const getTactic = (unitId: UnitId): UnitTactic | undefined =>
  TACTICS[unitId]

export { UnitTactic } from './UnitTactic'
