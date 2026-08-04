import { useNavigate } from 'react-router-dom'

import { CONTROL_MARKERS_PER_PLAYER, otherPlayer } from '@warchest/shared'
import type { MatchState, PlayerIndex } from '@warchest/shared'

import { GameIcon } from '../../shared/icons'
import {
  PrimaryAction,
  ResultActions,
  ResultBadge,
  ResultGlow,
  ResultHero,
  ResultReason,
  ResultTitle,
  ResultStats,
  RoundLabel,
  SecondaryAction,
  StatDivider,
  StatItem,
  StatLabel,
  StatValue,
} from './EndScreen.styles'

const REASON_LABELS: Record<string, { won: string; lost: string }> = {
  control: {
    won: 'Вы разместили все маркеры контроля',
    lost: 'Противник разместил все маркеры контроля',
  },
  elimination: {
    won: 'Все фишки противника уничтожены',
    lost: 'Все ваши фишки уничтожены',
  },
  resign: { won: 'Противник сдался', lost: 'Вы сдались' },
  disconnect: { won: 'Противник отключился', lost: 'Вы отключились' },
}

interface EndScreenProps {
  won: boolean
  reason: string
  matchState: MatchState | null
  you: PlayerIndex | null
  onPlayAgain: () => void
}

const markersPlaced = (markersLeft: number) =>
  CONTROL_MARKERS_PER_PLAYER - markersLeft

export const EndScreen = ({
  won,
  reason,
  matchState,
  you,
  onPlayAgain,
}: EndScreenProps) => {
  const navigate = useNavigate()
  const me = you !== null ? matchState?.players[you] : undefined
  const opponent =
    you !== null ? matchState?.players[otherPlayer(you)] : undefined

  return (
    <ResultHero $won={won}>
      <ResultGlow $won={won} />
      <ResultBadge $won={won}>
        <GameIcon width={32} height={32} />
      </ResultBadge>
      <ResultTitle>{won ? 'Победа!' : 'Поражение'}</ResultTitle>
      <ResultReason>
        {REASON_LABELS[reason]?.[won ? 'won' : 'lost']}.
      </ResultReason>
      {me && opponent && (
        <>
          <ResultStats>
            <StatItem>
              <StatLabel>Вы</StatLabel>
              <StatValue>
                {markersPlaced(me.controlMarkersLeft)}/
                {CONTROL_MARKERS_PER_PLAYER}
              </StatValue>
            </StatItem>
            <StatDivider />
            <StatItem>
              <StatLabel>{opponent.login}</StatLabel>
              <StatValue>
                {markersPlaced(opponent.controlMarkersLeft)}/
                {CONTROL_MARKERS_PER_PLAYER}
              </StatValue>
            </StatItem>
          </ResultStats>
          {matchState && <RoundLabel>Раунд {matchState.round}</RoundLabel>}
        </>
      )}
      <ResultActions>
        <PrimaryAction onClick={onPlayAgain}>Сыграть ещё</PrimaryAction>
        <SecondaryAction type="button" onClick={() => navigate('/')}>
          Вернуться в главное меню
        </SecondaryAction>
      </ResultActions>
    </ResultHero>
  )
}
