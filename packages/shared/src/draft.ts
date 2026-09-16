import { shuffleWithSeed } from './rng'
import type { PlayerIndex } from './types'
import { PLAYABLE_UNITS, UNITS_PER_PLAYER } from './units'
import type { UnitId } from './units'

export interface DraftState {
  pool: UnitId[]
  picks: [UnitId[], UnitId[]]
  activePicker: PlayerIndex
  rngState: number
}

export const createDraft = (seed: number): DraftState => {
  const shuffled = shuffleWithSeed([...PLAYABLE_UNITS], seed)
  const firstRoll = shuffleWithSeed([0, 1], shuffled.rngState)
  return {
    pool: shuffled.items,
    picks: [[], []],
    activePicker: firstRoll.items[0] as PlayerIndex,
    rngState: firstRoll.rngState,
  }
}

export const isDraftComplete = (draft: DraftState): boolean =>
  draft.picks[0].length >= UNITS_PER_PLAYER &&
  draft.picks[1].length >= UNITS_PER_PLAYER

export const applyDraftPick = (
  source: DraftState,
  playerIndex: PlayerIndex,
  unit: UnitId
): { draft: DraftState } | { error: string } => {
  if (source.activePicker !== playerIndex) {
    return { error: 'Сейчас выбирает противник' }
  }
  if (!source.pool.includes(unit)) {
    return { error: 'Этот юнит уже выбран' }
  }
  const draft: DraftState = JSON.parse(JSON.stringify(source)) as DraftState
  draft.pool = draft.pool.filter(item => item !== unit)
  draft.picks[playerIndex].push(unit)
  draft.activePicker = playerIndex === 0 ? 1 : 0
  return { draft }
}
