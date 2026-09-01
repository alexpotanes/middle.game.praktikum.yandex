import { NextFunction, Request, Response } from 'express'
import * as oauthService from '../services/oauthService'
import { UpstreamResult } from '../services/praktikumApi'
import { AppError } from '../utils/errors'
import {
  validateYandexOAuthBody,
  validateYandexServiceIdQuery,
} from '../utils/validators'

const relay = (res: Response, result: UpstreamResult) => {
  if (result.setCookie.length) {
    res.setHeader('set-cookie', result.setCookie)
  }

  res.status(result.status).json(result.data)
}

const handle =
  (fn: (req: Request) => Promise<UpstreamResult>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      relay(res, await fn(req))
    } catch (error) {
      if (error instanceof AppError) {
        next(error)
        return
      }

      res.status(502).json({ reason: 'Ошибка обращения к API Практикума' })
    }
  }

export const getServiceId = handle(req => {
  const redirectUri = validateYandexServiceIdQuery(req.query)
  return oauthService.getYandexServiceId(redirectUri)
})

export const signInWithYandex = handle(req => {
  const body = validateYandexOAuthBody(req.body)
  return oauthService.signInWithYandex(body)
})
