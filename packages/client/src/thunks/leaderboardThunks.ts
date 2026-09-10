import type { AppDispatch } from '../store'
import {
  setLeaderboard,
  setLeaderboardError,
  setLeaderboardLoading,
} from '../slices/leaderboardSlice'
import { getLeaderboardApi } from '../api/leaderboard'
import { submitGameResult } from '../api/leaderboard-api'

export const fetchLeaderboardThunk = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLeaderboardLoading())
    const data = await getLeaderboardApi()
    dispatch(setLeaderboard(data))
  } catch (error) {
    dispatch(
      setLeaderboardError(
        error instanceof Error ? error.message : 'Failed to fetch leaderboard'
      )
    )
  }
}

export const submitGameResultThunk =
  (
    playerName: string,
    avatar: string | null,
    wins: number,
    losses: number,
    rating: number
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      await submitGameResult(playerName, avatar, wins, losses, rating)
      dispatch(fetchLeaderboardThunk())
    } catch (error) {
      console.error('Failed to submit game result:', error)
    }
  }
