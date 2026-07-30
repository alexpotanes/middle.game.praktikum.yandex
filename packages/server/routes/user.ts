import { Router } from 'express'
import * as userController from '../controllers/userController'

export const userRouter = Router()

userRouter.put('/profile', userController.updateProfile)
userRouter.put('/password', userController.changePassword)
userRouter.put('/profile/avatar', userController.updateAvatar)
