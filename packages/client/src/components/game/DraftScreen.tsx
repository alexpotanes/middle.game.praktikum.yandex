import { PLAYABLE_UNITS, UNIT_DEFS, UNITS_PER_PLAYER } from '@warchest/shared'
import type { DraftState, PlayerIndex, UnitId } from '@warchest/shared'

import { ErrorText, StatusText } from '../../pages/GamePage.styles'
import { CardGrid, PickChip, PicksRow } from './DraftScreen.styles'
import { UnitCard } from './UnitCard'

interface DraftScreenProps {
  draft: DraftState
  you: PlayerIndex
  error: string | null
  onPick: (unit: UnitId) => void
}

export const DraftScreen = ({
  draft,
  you,
  error,
  onPick,
}: DraftScreenProps) => {
  const myTurn = draft.activePicker === you
  const myPicks = draft.picks[you]
  const opponentPicks = draft.picks[you === 0 ? 1 : 0]

  const cardState = (unit: UnitId) => {
    if (myPicks.includes(unit)) {
      return 'mine' as const
    }
    if (opponentPicks.includes(unit)) {
      return 'theirs' as const
    }
    return 'available' as const
  }

  return (
    <>
      <StatusText>
        {myTurn
          ? `Ваш выбор: кликните по карточке (${myPicks.length}/${UNITS_PER_PLAYER})`
          : 'Ждём выбор противника…'}
      </StatusText>
      {error && <ErrorText>{error}</ErrorText>}
      <PicksRow>
        <span>Ваши юниты:</span>
        {myPicks.length === 0 && <span>пока нет</span>}
        {myPicks.map(unit => (
          <PickChip key={unit} $color={UNIT_DEFS[unit].color}>
            {UNIT_DEFS[unit].letter}
          </PickChip>
        ))}
      </PicksRow>
      <CardGrid>
        {PLAYABLE_UNITS.map(unit => (
          <UnitCard
            key={unit}
            unit={unit}
            state={cardState(unit)}
            clickable={myTurn && cardState(unit) === 'available'}
            onPick={onPick}
          />
        ))}
      </CardGrid>
    </>
  )
}
