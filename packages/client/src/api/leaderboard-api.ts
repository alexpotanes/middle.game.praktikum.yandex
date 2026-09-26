import { SERVER_HOST } from '../constants'

export const TEAM_NAME = __TEAM_NAME__ || 'default-team'

export const RATING_FIELD = 'rating'

const API_BASE = `${SERVER_HOST}/api`

export type PraktikumLeaderboardRequest = {
  data: {
    playerName: string
    avatar: string | null
    wins: number
    losses: number
    rating: number
    [key: string]: string | number | null
  }
  ratingFieldName: string
  teamName: string
}

export type PraktikumLeaderboardGetRequest = {
  ratingFieldName: string
  cursor: number
  limit: number
}

export type PraktikumLeaderboardResponse = Array<{
  data: {
    playerName: string
    avatar: string | null
    wins: number
    losses: number
    rating: number
    [key: string]: unknown
  }
}>

export const submitGameResult = async (
  playerName: string,
  avatar: string | null,
  wins: number,
  losses: number,
  rating: number
): Promise<void> => {
  const response = await fetch(`${API_BASE}/leaderboard`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      data: {
        playerName,
        avatar,
        wins,
        losses,
        rating,
      },
      ratingFieldName: RATING_FIELD,
      teamName: TEAM_NAME,
    } as PraktikumLeaderboardRequest),
  })

  if (!response.ok) {
    throw new Error('Failed to submit game result to leaderboard')
  }
}

export const getTeamLeaderboard = async (
  cursor = 0,
  limit = 100
): Promise<PraktikumLeaderboardResponse> => {
  const response = await fetch(`${API_BASE}/leaderboard/${TEAM_NAME}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      ratingFieldName: RATING_FIELD,
      cursor,
      limit,
    } as PraktikumLeaderboardGetRequest),
  })

  if (!response.ok) {
    throw new Error('Failed to fetch team leaderboard')
  }

  return response.json()
}
