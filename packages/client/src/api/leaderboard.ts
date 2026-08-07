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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002'

export const getLeaderboardApi = async (): Promise<LeaderboardEntry[]> => {
  const response = await fetch(`${API_URL}/leaderboard`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch leaderboard')
  }

  return response.json()
}
