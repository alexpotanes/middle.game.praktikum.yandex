import type { RefObject } from 'react'

import { CONTROL_MARKERS_PER_PLAYER } from '@warchest/shared'
import type { MatchState, PlayerIndex } from '@warchest/shared'

import { Button } from '../button'
import {
  Actions,
  Canvas,
  ErrorText,
  Hint,
  Hud,
} from '../../pages/GamePage.styles'

interface GameScreenProps {
  matchState: MatchState
  you: PlayerIndex
  error: string | null
  canvasRef: RefObject<HTMLCanvasElement | null>
  onResign: () => void
}

export const GameScreen = ({
  matchState,
  you,
  error,
  canvasRef,
  onResign,
}: GameScreenProps) => {
  const me = matchState.players[you]
  const opponent = matchState.players[you === 0 ? 1 : 0]
  const yourTurn = matchState.activePlayer === you
  const placed = (markersLeft: number) =>
    CONTROL_MARKERS_PER_PLAYER - markersLeft
  return (
    <>
      <Hud>
        <span>Раунд {matchState.round}</span>
        <span>{yourTurn ? 'Ваш ход' : `Ход: ${opponent.login}`}</span>
        <span>
          {me.login} (вы): {placed(me.controlMarkersLeft)}/
          {CONTROL_MARKERS_PER_PLAYER}
          {matchState.initiative === you ? ' · инициатива' : ''}
        </span>
        <span>
          {opponent.login}: {placed(opponent.controlMarkersLeft)}/
          {CONTROL_MARKERS_PER_PLAYER}
          {matchState.initiative !== you ? ' · инициатива' : ''}
        </span>
      </Hud>
      <Canvas ref={canvasRef} />
      {error && <ErrorText>{error}</ErrorText>}
      <Actions>
        <Button onClick={onResign}>Сдаться</Button>
      </Actions>
      <Hint>
        Клик по монете или юниту — выбор действия, клик по резерву — рекрут.
        Клавиши: P — пас, I — инициатива, R — рекрут, Esc — отмена. Раунд: 3
        монеты из мешка идут в руку, использованные — в сброс; когда мешок пуст,
        сброс перемешивается в новый мешок.
      </Hint>
    </>
  )
}
