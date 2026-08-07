import type { Request, Response } from 'express'
import * as leaderboardService from '../services/leaderboardService'
import { validateTeamName } from '../utils/validators'
import { asyncHandler } from '../middleware/errorHandler'

export const getLeaderboard = asyncHandler(
  async (_req: Request, res: Response) => {
    const leaderboard = await leaderboardService.getLeaderboard()
    res.json(leaderboard)
  }
)

export const getTeamLeaderboard = asyncHandler(
  async (req: Request, res: Response) => {
    const teamName = validateTeamName(req.params.teamName)

    const leaderboard = await leaderboardService.getTeamLeaderboard(teamName)
    res.json(leaderboard)
  }
)
