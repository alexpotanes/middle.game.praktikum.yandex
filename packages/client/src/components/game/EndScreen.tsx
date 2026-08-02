import { Button } from '../button'
import { Actions, StatusText } from '../../pages/GamePage.styles'

const REASON_LABELS: Record<string, string> = {
  control: 'все маркеры контроля размещены',
  elimination: 'все фишки противника уничтожены',
  resign: 'противник сдался',
  disconnect: 'противник отключился',
}

interface EndScreenProps {
  won: boolean
  reason: string
  onPlayAgain: () => void
}

export const EndScreen = ({ won, reason, onPlayAgain }: EndScreenProps) => (
  <>
    <StatusText>
      {won ? 'Победа!' : 'Поражение.'} {REASON_LABELS[reason]}.
    </StatusText>
    <Actions>
      <Button onClick={onPlayAgain}>Сыграть ещё</Button>
    </Actions>
  </>
)
