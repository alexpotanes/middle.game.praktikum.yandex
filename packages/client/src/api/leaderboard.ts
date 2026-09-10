import { getTeamLeaderboard } from './leaderboard-api'
import { mapPraktikumToLeaderboard } from '../types/leaderboard'
import type { LeaderboardEntry } from '../types/leaderboard'

export const getLeaderboardApi = async (): Promise<LeaderboardEntry[]> => {
  try {
    const data = await getTeamLeaderboard(0, 100)
    return mapPraktikumToLeaderboard(data)
  } catch (error) {
    console.error('Failed to fetch leaderboard from Praktikum API:', error)
    throw new Error('Failed to fetch leaderboard')
  }
}
