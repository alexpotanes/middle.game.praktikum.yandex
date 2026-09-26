import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { STATUS } from './constants'
import type { Status } from './constants'

type LeaderboardEntry = {
  id: number
  rank: number
  playerName: string
  avatar: string | null
  wins: number
  losses: number
  totalGames: number
  winRate: number
  rating: number
}

type LeaderboardState = {
  entries: LeaderboardEntry[]
  status: Status
  error: string | null
}

const initialState: LeaderboardState = {
  entries: [],
  status: STATUS.IDLE,
  error: null,
}

export const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    setLeaderboard(state, action: PayloadAction<LeaderboardEntry[]>) {
      state.entries = action.payload
      state.status = STATUS.SUCCEEDED
    },
    setLeaderboardLoading(state) {
      state.status = STATUS.LOADING
    },
    setLeaderboardError(state, action: PayloadAction<string>) {
      state.error = action.payload
      state.status = STATUS.FAILED
    },
  },
})

export const { setLeaderboard, setLeaderboardLoading, setLeaderboardError } =
  leaderboardSlice.actions

export const selectLeaderboard = (state: RootState) => state.leaderboard.entries
export const selectLeaderboardStatus = (state: RootState) =>
  state.leaderboard.status
export const selectLeaderboardError = (state: RootState) =>
  state.leaderboard.error

export default leaderboardSlice.reducer
