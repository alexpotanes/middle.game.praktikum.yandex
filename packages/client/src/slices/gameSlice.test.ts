import reducer, {
  startGame,
  endGame,
  resetGame,
  selectGameScreen,
  selectGameScore,
  GameState,
} from './gameSlice'
import { RootState } from '../store'

describe('gameSlice', () => {
  it('returns the initial state', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual({
      screen: 'start',
      score: 0,
    })
  })

  it('startGame switches to playing and resets score', () => {
    const state: GameState = { screen: 'gameover', score: 42 }
    expect(reducer(state, startGame())).toEqual({ screen: 'playing', score: 0 })
  })

  it('endGame switches to gameover with the final score', () => {
    const state: GameState = { screen: 'playing', score: 0 }
    expect(reducer(state, endGame(17))).toEqual({
      screen: 'gameover',
      score: 17,
    })
  })

  it('resetGame switches back to start and resets score', () => {
    const state: GameState = { screen: 'gameover', score: 17 }
    expect(reducer(state, resetGame())).toEqual({ screen: 'start', score: 0 })
  })

  it('selectors read the game slice from RootState', () => {
    const rootState = { game: { screen: 'playing', score: 5 } } as RootState

    expect(selectGameScreen(rootState)).toBe('playing')
    expect(selectGameScore(rootState)).toBe(5)
  })
})
