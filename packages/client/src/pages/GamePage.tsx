import { useCallback, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'

import { Layout } from '../components/Layout'
import { usePage } from '../hooks/usePage'
import { useDispatch, useSelector } from '../store'
import { Game, PlayScene } from '../game'
import { Button } from '../components/button'
import { StartOverlay } from '../components/Game/StartOverlay'
import { GameOverOverlay } from '../components/Game/GameOverOverlay'
import {
  startGame,
  endGame,
  resetGame,
  selectGameScreen,
  selectGameScore,
} from '../slices/gameSlice'
import {
  Stage,
  CanvasFrame,
  PlayingControls,
  TimerBadge,
} from './GamePage.styles'

const GAME_WIDTH = 720
const GAME_HEIGHT = 480

export const GamePage = () => {
  usePage({ initPage: initGamePage })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const screen = useSelector(selectGameScreen)
  const score = useSelector(selectGameScore)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const gameRef = useRef<Game | null>(null)
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null)

  const handleGameOver = useCallback(
    (finalScore: number) => {
      gameRef.current?.stop()
      dispatch(endGame(finalScore))
    },
    [dispatch]
  )

  const beginRound = useCallback(() => {
    dispatch(startGame())
    gameRef.current?.setScene(
      new PlayScene({ onGameOver: handleGameOver, onTick: setSecondsLeft })
    )
    gameRef.current?.start()
  }, [dispatch, handleGameOver])

  const handleExit = useCallback(() => {
    gameRef.current?.stop()
    dispatch(resetGame())
    navigate('/')
  }, [dispatch, navigate])

  useEffect(() => {
    if (!canvasRef.current) {
      return
    }
    gameRef.current = new Game(canvasRef.current, {
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      background: '#1b1b1b',
    })

    return () => {
      gameRef.current?.destroy()
      gameRef.current = null
    }
  }, [])

  return (
    <Layout>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Игры</title>
        <meta name="description" content="Страница игр" />
      </Helmet>
      <h1>Игры</h1>
      <Stage>
        <CanvasFrame ref={canvasRef} />
        {screen === 'start' && <StartOverlay onStart={beginRound} />}
        {screen === 'playing' && (
          <PlayingControls>
            {secondsLeft !== null && <TimerBadge>{secondsLeft} с</TimerBadge>}
            <Button onClick={handleExit}>Выйти</Button>
          </PlayingControls>
        )}
        {screen === 'gameover' && (
          <GameOverOverlay
            score={score}
            onPlayAgain={beginRound}
            onExit={handleExit}
          />
        )}
      </Stage>
    </Layout>
  )
}

export const initGamePage = () => Promise.resolve()
