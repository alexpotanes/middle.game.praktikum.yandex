import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

export type GameScreen = 'start' | 'playing' | 'gameover'

export interface GameState {
  screen: GameScreen
  score: number
}

const initialState: GameState = {
  screen: 'start',
  score: 0,
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startGame(state) {
      state.screen = 'playing'
      state.score = 0
    },
    endGame(state, { payload }: PayloadAction<number>) {
      state.screen = 'gameover'
      state.score = payload
    },
    resetGame(state) {
      state.screen = 'start'
      state.score = 0
    },
  },
})

export const { startGame, endGame, resetGame } = gameSlice.actions

export const selectGameScreen = (state: RootState) => state.game.screen
export const selectGameScore = (state: RootState) => state.game.score

export default gameSlice.reducer
