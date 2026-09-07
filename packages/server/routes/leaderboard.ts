import { Router } from 'express'
import * as leaderboardController from '../controllers/leaderboardController'

export const leaderboardRoutes = Router()

leaderboardRoutes.post('/', leaderboardController.submitResult)
leaderboardRoutes.post('/:teamName', leaderboardController.getLeaderboard)
