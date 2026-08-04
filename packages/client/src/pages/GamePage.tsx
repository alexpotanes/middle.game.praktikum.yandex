import { useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet'

import { Layout } from '../components/Layout'
import { DraftScreen } from '../components/game/DraftScreen'
import { EndScreen } from '../components/game/EndScreen'
import { GameScreen } from '../components/game/GameScreen'
import { IdleScreen } from '../components/game/IdleScreen'
import { SearchingScreen } from '../components/game/SearchingScreen'
import { usePage } from '../hooks/usePage'
import { useDispatch, useSelector } from '../store'
import { selectUserLogin } from '../slices/userSlice'
import {
  draftStarted,
  matchEnded,
  matchStarted,
  resetMatch,
  setError,
  setSearching,
  stateUpdated,
} from '../slices/matchSlice'
import { SERVER_HOST } from '../constants'
import { Game } from '../game'
import { GameClient } from '../game/net/GameClient'
import { WarChestScene } from '../game/scenes/WarChestScene'
import { GameWrapper, Title } from './GamePage.styles'

const WS_URL = `${SERVER_HOST.replace(/^http/, 'ws')}/ws`

export const GamePage = () => {
  usePage({ initPage: initGamePage })
  const dispatch = useDispatch()
  const login = useSelector(selectUserLogin)
  const {
    status,
    you,
    draft,
    state: matchState,
    endResult,
    error,
  } = useSelector(state => state.match)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const clientRef = useRef<GameClient | null>(null)
  const sceneRef = useRef<WarChestScene | null>(null)

  useEffect(() => {
    const client = new GameClient({
      onQueueWaiting: () => dispatch(setSearching()),
      onDraftState: (youIndex, state) =>
        dispatch(draftStarted({ you: youIndex, state })),
      onMatchStart: (matchId, youIndex, state) =>
        dispatch(matchStarted({ matchId, you: youIndex, state })),
      onState: state => dispatch(stateUpdated(state)),
      onError: (_code, message) => dispatch(setError(message)),
      onEnd: (winner, reason) => dispatch(matchEnded({ winner, reason })),
      onDisconnect: () => undefined,
    })
    client.connect(WS_URL)
    clientRef.current = client
    return () => {
      client.disconnect()
      clientRef.current = null
      dispatch(resetMatch())
    }
  }, [dispatch])

  useEffect(() => {
    const canvas = canvasRef.current
    if (status !== 'playing' || !canvas || you === null) {
      return
    }
    const game = new Game(canvas, {
      width: 800,
      height: 600,
      background: '#fcf5e5',
    })
    const scene = new WarChestScene(you, {
      sendAction: action => clientRef.current?.sendAction(action),
    })
    game.setScene(scene)
    game.start()
    sceneRef.current = scene
    return () => {
      game.destroy()
      sceneRef.current = null
    }
  }, [status, you])

  useEffect(() => {
    if (matchState) {
      sceneRef.current?.setMatchState(matchState)
    }
  }, [matchState])

  const findGame = () => {
    clientRef.current?.joinQueue(login ?? 'player')
  }

  const cancelSearch = () => {
    clientRef.current?.leaveQueue()
    dispatch(resetMatch())
  }

  const resign = () => {
    clientRef.current?.resign()
  }

  const playAgain = () => {
    dispatch(resetMatch())
  }

  const renderContent = () => {
    switch (status) {
      case 'idle':
        return <IdleScreen onFind={findGame} />
      case 'searching':
        return <SearchingScreen onCancel={cancelSearch} />
      case 'draft':
        if (!draft || you === null) {
          return null
        }
        return (
          <DraftScreen
            draft={draft}
            you={you}
            error={error}
            onPick={unit => clientRef.current?.pickDraftUnit(unit)}
          />
        )
      case 'ended':
        if (!endResult) {
          return null
        }
        return (
          <EndScreen
            won={endResult.winner === you}
            reason={endResult.reason}
            onPlayAgain={playAgain}
          />
        )
      case 'playing':
        if (!matchState || you === null) {
          return null
        }
        return (
          <GameScreen
            matchState={matchState}
            you={you}
            error={error}
            canvasRef={canvasRef}
            onResign={resign}
          />
        )
    }
  }

  return (
    <Layout>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Игра</title>
        <meta name="description" content="Страница игры" />
      </Helmet>
      <GameWrapper>
        <Title>War Chest</Title>
        {renderContent()}
      </GameWrapper>
    </Layout>
  )
}

export const initGamePage = () => Promise.resolve()
