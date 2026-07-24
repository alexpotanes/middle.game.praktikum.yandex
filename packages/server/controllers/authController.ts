import { Request, Response } from 'express'
import * as authService from '../services/authService'
import { UpstreamResult } from '../services/authService'

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

export const signin = handle(req =>
  authService.signin(req.body, req.headers.cookie)
)
export const signup = handle(req =>
  authService.signup(req.body, req.headers.cookie)
)
export const logout = handle(req => authService.logout(req.headers.cookie))
export const getUser = handle(req => authService.getUser(req.headers.cookie))
