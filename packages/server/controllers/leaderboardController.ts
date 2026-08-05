import type { Request, Response } from 'express'
import * as leaderboardService from '../services/leaderboardService'

export const getLeaderboard = async (_req: Request, res: Response) => {
  try {
    const leaderboard = await leaderboardService.getLeaderboard()
    res.json(leaderboard)
  } catch (error) {
    res.status(500).json({ reason: 'Failed to fetch leaderboard' })
  }
}

export const getTeamLeaderboard = async (req: Request, res: Response) => {
  try {
    const { teamName } = req.params
    const leaderboard = await leaderboardService.getTeamLeaderboard(teamName)
    res.json(leaderboard)
  } catch (error) {
    res.status(500).json({ reason: 'Failed to fetch team leaderboard' })
  }
}
