import { Router } from 'express'
import * as authController from '../controllers/authController'
import { requireAuth } from '../middleware/auth'
import { verifyPraktikumSession } from '../services/sessionVerifier'

const auth = requireAuth(verifyPraktikumSession)

export const authRouter = Router()

authRouter.post('/signin', authController.signin)
authRouter.post('/signup', authController.signup)
authRouter.post('/logout', authController.logout)
authRouter.get('/user', auth, authController.getUser)
