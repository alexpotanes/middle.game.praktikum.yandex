export type LeaderboardEntry = {
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

export const validateLeaderboardResponse = (
  data: unknown
): LeaderboardEntry[] => {
  if (!Array.isArray(data)) {
    console.error('Invalid leaderboard response: not an array', data)
    throw new Error('Invalid leaderboard data: expected array')
  }

  if (data.length === 0) {
    return []
  }

  const first = data[0]
  if (
    !first ||
    typeof first !== 'object' ||
    typeof first.id !== 'number' ||
    typeof first.playerName !== 'string'
  ) {
    console.error('Invalid leaderboard entry structure:', first)
    throw new Error('Invalid leaderboard entry structure')
  }

  return data as LeaderboardEntry[]
}
