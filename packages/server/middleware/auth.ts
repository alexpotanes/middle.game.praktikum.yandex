import type { NextFunction, Request, Response } from 'express'
import {
  AppError,
  InternalServerError,
  UnauthorizedError,
} from '../utils/errors'

export type SessionInfo = { id: number } & Record<string, unknown>
export type SessionVerifier = (cookie?: string) => Promise<SessionInfo | null>

export const requireAuth =
  (verifySession: SessionVerifier) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await verifySession(req.headers.cookie)

      if (!session) {
        throw new UnauthorizedError('Сессия не найдена или истекла')
      }

      res.locals.user = session

      next()
    } catch (err) {
      next(
        err instanceof AppError
          ? err
          : new InternalServerError('Не удалось проверить авторизацию')
      )
    }
  }
