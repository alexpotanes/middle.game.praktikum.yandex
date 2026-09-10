import { Request, Response } from 'express'
import * as leaderboardService from '../services/leaderboardService'
import { UpstreamResult } from '../services/praktikumApi'

const relay = (res: Response, result: UpstreamResult) => {
  if (result.setCookie.length) {
    res.setHeader('set-cookie', result.setCookie)
  }
  res.status(result.status).json(result.data)
}

export const submitResult = async (req: Request, res: Response) => {
  try {
    const cookie = req.headers.cookie
    const result = await leaderboardService.submitLeaderboardResult(
      cookie,
      req.body
    )
    relay(res, result)
  } catch (error) {
    res.status(502).json({ reason: 'Ошибка обращения к API Практикума' })
  }
}

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const cookie = req.headers.cookie
    const { teamName } = req.params
    const result = await leaderboardService.getLeaderboard(
      cookie,
      teamName,
      req.body
    )
    relay(res, result)
  } catch (error) {
    res.status(502).json({ reason: 'Ошибка обращения к API Практикума' })
  }
}
