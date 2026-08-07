import { NotFoundError } from '../utils/errors'

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

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 1,
    rank: 1,
    playerName: 'Александр Великий',
    avatar: null,
    wins: 127,
    losses: 23,
    totalGames: 150,
    winRate: 84.7,
    rating: 2450,
  },
  {
    id: 2,
    rank: 2,
    playerName: 'Чингисхан',
    avatar: null,
    wins: 98,
    losses: 32,
    totalGames: 130,
    winRate: 75.4,
    rating: 2320,
  },
  {
    id: 3,
    rank: 3,
    playerName: 'Наполеон Бонапарт',
    avatar: null,
    wins: 85,
    losses: 28,
    totalGames: 113,
    winRate: 75.2,
    rating: 2280,
  },
  {
    id: 4,
    rank: 4,
    playerName: 'Юлий Цезарь',
    avatar: null,
    wins: 76,
    losses: 34,
    totalGames: 110,
    winRate: 69.1,
    rating: 2150,
  },
  {
    id: 5,
    rank: 5,
    playerName: 'Ганнибал Барка',
    avatar: null,
    wins: 67,
    losses: 28,
    totalGames: 95,
    winRate: 70.5,
    rating: 2100,
  },
  {
    id: 6,
    rank: 6,
    playerName: 'Саладин',
    avatar: null,
    wins: 54,
    losses: 31,
    totalGames: 85,
    winRate: 63.5,
    rating: 1980,
  },
  {
    id: 7,
    rank: 7,
    playerName: 'Сунь Цзы',
    avatar: null,
    wins: 48,
    losses: 27,
    totalGames: 75,
    winRate: 64.0,
    rating: 1920,
  },
  {
    id: 8,
    rank: 8,
    playerName: 'Ричард Львиное Сердце',
    avatar: null,
    wins: 42,
    losses: 23,
    totalGames: 65,
    winRate: 64.6,
    rating: 1850,
  },
]

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  await new Promise(resolve => setTimeout(resolve, 100))
  return MOCK_LEADERBOARD
}

export const getTeamLeaderboard = async (
  teamName: string
): Promise<LeaderboardEntry[]> => {
  await new Promise(resolve => setTimeout(resolve, 100))

  const teamData = MOCK_LEADERBOARD.slice(0, 5)

  if (teamData.length === 0) {
    throw new NotFoundError(`Team "${teamName}" not found`)
  }

  return teamData
}
