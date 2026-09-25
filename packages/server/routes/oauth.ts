import { Router } from 'express'
import * as oauthController from '../controllers/oauthController'

export const oauthRouter = Router()

oauthRouter.get('/yandex/service-id', oauthController.getServiceId)
oauthRouter.post('/yandex', oauthController.signInWithYandex)
