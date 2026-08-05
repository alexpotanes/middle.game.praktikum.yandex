import { Router } from 'express'
import * as leaderboardController from '../controllers/leaderboardController'

export const leaderboardRouter = Router()

leaderboardRouter.get('/', leaderboardController.getLeaderboard)
leaderboardRouter.get(
  '/team/:teamName',
  leaderboardController.getTeamLeaderboard
)
