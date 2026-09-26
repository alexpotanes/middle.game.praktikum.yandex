import type { PraktikumLeaderboardResponse } from '../api/leaderboard-api'

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

export const mapPraktikumToLeaderboard = (
  data: PraktikumLeaderboardResponse
): LeaderboardEntry[] => {
  return data.map((item, index) => ({
    id: index + 1,
    rank: index + 1,
    playerName: item.data.playerName,
    avatar: item.data.avatar,
    wins: Number(item.data.wins) || 0,
    losses: Number(item.data.losses) || 0,
    totalGames: Number(item.data.wins || 0) + Number(item.data.losses || 0),
    winRate:
      Number(item.data.wins || 0) + Number(item.data.losses || 0) > 0
        ? (Number(item.data.wins || 0) /
            (Number(item.data.wins || 0) + Number(item.data.losses || 0))) *
          100
        : 0,
    rating: Number(item.data.rating) || 0,
  }))
}
