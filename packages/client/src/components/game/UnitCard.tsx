import { UNIT_DEFS, getTactic } from '@warchest/shared'
import type { UnitId } from '@warchest/shared'

import {
  Card,
  Portrait,
  TakenBadge,
  TacticName,
  TacticText,
  UnitName,
} from './DraftScreen.styles'

export type CardState = 'available' | 'mine' | 'theirs'

interface UnitCardProps {
  unit: UnitId
  state: CardState
  clickable: boolean
  onPick: (unit: UnitId) => void
}

export const UnitCard = ({ unit, state, clickable, onPick }: UnitCardProps) => {
  const def = UNIT_DEFS[unit]
  const tactic = getTactic(unit)
  return (
    <Card
      type="button"
      $border={def.color}
      $taken={state !== 'available'}
      $clickable={clickable}
      disabled={!clickable}
      onClick={() => onPick(unit)}>
      {state !== 'available' && (
        <TakenBadge $mine={state === 'mine'}>
          {state === 'mine' ? 'вы' : 'соперник'}
        </TakenBadge>
      )}
      <Portrait $color={def.color}>{def.letter}</Portrait>
      <UnitName>{def.name}</UnitName>
      {tactic && (
        <>
          <TacticName>
            «{tactic.name}»{tactic.kind === 'passive' ? ' · пассивная' : ''}
          </TacticName>
          <TacticText>{tactic.description}</TacticText>
        </>
      )}
    </Card>
  )
}
