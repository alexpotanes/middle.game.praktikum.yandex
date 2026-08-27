import { Request, Response } from 'express'
import * as oauthService from '../services/oauthService'
import { UpstreamResult } from '../services/praktikumApi'

const relay = (res: Response, result: UpstreamResult) => {
  if (result.setCookie.length) {
    res.setHeader('set-cookie', result.setCookie)
  }

  res.status(result.status).json(result.data)
}

const handle =
  (fn: (req: Request) => Promise<UpstreamResult>) =>
  async (req: Request, res: Response) => {
    try {
      relay(res, await fn(req))
    } catch {
      res.status(502).json({ reason: 'Ошибка обращения к API Практикума' })
    }
  }

export const getServiceId = handle(req =>
  oauthService.getYandexServiceId(String(req.query.redirect_uri ?? ''))
)

export const signInWithYandex = handle(req =>
  oauthService.signInWithYandex(req.body)
)
