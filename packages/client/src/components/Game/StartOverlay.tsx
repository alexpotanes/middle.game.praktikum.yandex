import { Button } from '../button'
import {
  Overlay,
  OverlayCard,
  OverlayTitle,
  OverlayText,
  OverlayActions,
} from './styles'

type StartOverlayProps = {
  onStart: () => void
}

export const StartOverlay = ({ onStart }: StartOverlayProps) => (
  <Overlay>
    <OverlayCard>
      <OverlayTitle>Готовы сыграть?</OverlayTitle>
      <OverlayText>
        Нажмите «Начать игру», чтобы приступить к партии.
      </OverlayText>
      <OverlayActions>
        <Button onClick={onStart}>Начать игру</Button>
      </OverlayActions>
    </OverlayCard>
  </Overlay>
)
