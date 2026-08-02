import { Button } from '../button'
import {
  Overlay,
  OverlayCard,
  OverlayTitle,
  OverlayActions,
  ScoreDisplay,
  ScoreLabel,
  ScoreValue,
} from './styles'

type GameOverOverlayProps = {
  score: number
  onPlayAgain: () => void
  onExit: () => void
}

export const GameOverOverlay = ({
  score,
  onPlayAgain,
  onExit,
}: GameOverOverlayProps) => (
  <Overlay>
    <OverlayCard>
      <OverlayTitle>Игра окончена</OverlayTitle>
      <ScoreDisplay>
        <ScoreLabel>Ваш счёт</ScoreLabel>
        <ScoreValue>{score}</ScoreValue>
      </ScoreDisplay>
      <OverlayActions>
        <Button onClick={onPlayAgain}>Играть ещё</Button>
        <Button onClick={onExit}>Выйти в меню</Button>
      </OverlayActions>
    </OverlayCard>
  </Overlay>
)
