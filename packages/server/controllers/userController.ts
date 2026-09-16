import { Request, Response } from 'express'
import * as userService from '../services/userService'
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

export const updateProfile = handle(req =>
  userService.updateProfile(req.body, req.headers.cookie)
)

export const changePassword = handle(req =>
  userService.changePassword(req.body, req.headers.cookie)
)

export const updateAvatar = handle(req =>
  userService.updateAvatar(req, req.headers, req.headers.cookie)
)
