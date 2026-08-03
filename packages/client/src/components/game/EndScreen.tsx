import { Button } from '../button'
import { Actions, StatusText } from '../../pages/GamePage.styles'

const REASON_LABELS: Record<string, { won: string; lost: string }> = {
  control: {
    won: 'вы разместили все маркеры контроля',
    lost: 'противник разместил все маркеры контроля',
  },
  elimination: {
    won: 'все фишки противника уничтожены',
    lost: 'все ваши фишки уничтожены',
  },
  resign: { won: 'противник сдался', lost: 'вы сдались' },
  disconnect: { won: 'противник отключился', lost: 'вы отключились' },
}

interface EndScreenProps {
  won: boolean
  reason: string
  onPlayAgain: () => void
}

export const EndScreen = ({ won, reason, onPlayAgain }: EndScreenProps) => (
  <>
    <StatusText>
      {won ? 'Победа!' : 'Поражение.'}{' '}
      {REASON_LABELS[reason]?.[won ? 'won' : 'lost']}.
    </StatusText>
    <Actions>
      <Button onClick={onPlayAgain}>Сыграть ещё</Button>
    </Actions>
  </>
)
