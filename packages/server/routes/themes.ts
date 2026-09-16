import { Router } from 'express'
import * as controller from '../controllers/themeController'
import { asyncHandler } from '../middleware/errorHandler'

export const themesRouter = Router()
export const userThemeRouter = Router()

themesRouter.get('/', asyncHandler(controller.list))
userThemeRouter.get('/', asyncHandler(controller.getCurrent))
userThemeRouter.put('/', asyncHandler(controller.setCurrent))
