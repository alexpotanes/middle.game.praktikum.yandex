export type UnitId =
  | 'swordsman'
  | 'archer'
  | 'cavalry'
  | 'spearman'
  | 'crossbowman'
  | 'knight'
  | 'berserker'
  | 'scout'
  | 'lancer'
  | 'longbowman'
  | 'manatarms'
  | 'mercenary'
  | 'pikeman'
  | 'guard'
  | 'marshal'
  | 'royal'

export interface UnitDef {
  id: UnitId
  name: string
  color: string
  letter: string
}

export const UNIT_DEFS: Record<UnitId, UnitDef> = {
  swordsman: { id: 'swordsman', name: 'Мечник', color: '#c9a24c', letter: 'М' },
  archer: { id: 'archer', name: 'Лучник', color: '#7a9b57', letter: 'Л' },
  cavalry: { id: 'cavalry', name: 'Кавалерия', color: '#7c2626', letter: 'К' },
  spearman: { id: 'spearman', name: 'Копейщик', color: '#4c6a8a', letter: 'П' },
  crossbowman: {
    id: 'crossbowman',
    name: 'Арбалетчик',
    color: '#8a5a2b',
    letter: 'А',
  },
  knight: { id: 'knight', name: 'Рыцарь', color: '#5b4a8a', letter: 'Р' },
  berserker: {
    id: 'berserker',
    name: 'Берсерк',
    color: '#a03a30',
    letter: 'Б',
  },
  scout: { id: 'scout', name: 'Следопыт', color: '#3f7a6a', letter: 'С' },
  lancer: { id: 'lancer', name: 'Улан', color: '#2b6a8a', letter: 'У' },
  longbowman: {
    id: 'longbowman',
    name: 'Дальнобойщик',
    color: '#6a8a2b',
    letter: 'Д',
  },
  manatarms: { id: 'manatarms', name: 'Вояка', color: '#8a2b5b', letter: 'В' },
  mercenary: {
    id: 'mercenary',
    name: 'Наёмник',
    color: '#666666',
    letter: 'Н',
  },
  pikeman: { id: 'pikeman', name: 'Пикинёр', color: '#946b2d', letter: 'Пк' },
  guard: { id: 'guard', name: 'Гвардеец', color: '#2d4a94', letter: 'Г' },
  marshal: { id: 'marshal', name: 'Маршал', color: '#94412d', letter: 'Мш' },
  royal: { id: 'royal', name: 'Королевская', color: '#564844', letter: 'R' },
}

export const UNITS_PER_PLAYER = 4

export const PLAYABLE_UNITS: readonly UnitId[] = [
  'swordsman',
  'archer',
  'cavalry',
  'spearman',
  'crossbowman',
  'knight',
  'berserker',
  'scout',
  'lancer',
  'longbowman',
  'manatarms',
  'mercenary',
  'pikeman',
  'guard',
  'marshal',
]

export const ROYAL: UnitId = 'royal'

export interface Coin {
  id: number
  unit: UnitId
}

export const COINS_PER_UNIT_TOTAL = 4
export const COINS_PER_UNIT_IN_BAG = 2
export const CONTROL_MARKERS_PER_PLAYER = 6
export const HAND_SIZE = 3
