import {
  praktikumFetch,
  readPraktikumResult,
  jsonHeaders,
  withCookie,
  UpstreamResult,
} from './praktikumApi'

export const submitLeaderboardResult = async (
  cookie: string | undefined,
  body: {
    data: Record<string, unknown>
    ratingFieldName: string
    teamName: string
  }
): Promise<UpstreamResult> =>
  readPraktikumResult(
    await praktikumFetch('/leaderboard', {
      method: 'POST',
      headers: jsonHeaders(withCookie(cookie)),
      body: JSON.stringify(body),
    })
  )

export const getLeaderboard = async (
  cookie: string | undefined,
  teamName: string,
  body: {
    ratingFieldName: string
    cursor: number
    limit: number
  }
): Promise<UpstreamResult> =>
  readPraktikumResult(
    await praktikumFetch(`/leaderboard/${teamName}`, {
      method: 'POST',
      headers: jsonHeaders(withCookie(cookie)),
      body: JSON.stringify(body),
    })
  )
