import type { AppDispatch } from '../store'
import {
  setLeaderboard,
  setLeaderboardError,
  setLeaderboardLoading,
} from '../slices/leaderboardSlice'
import { getLeaderboardApi } from '../api/leaderboard'

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
