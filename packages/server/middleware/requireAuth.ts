import type { Request, Response, NextFunction } from 'express'
import * as authService from '../services/authService'
import type { PracticumUser } from '../types/requestUser'
import { AppError, ForbiddenError } from '../utils/errors'

const isPracticumUser = (value: unknown): value is PracticumUser =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as Record<string, unknown>).id === 'number' &&
  typeof (value as Record<string, unknown>).login === 'string'

export const requireAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await authService.getUser(req.headers.cookie)

    if (result.status !== 200 || !isPracticumUser(result.data)) {
      throw new ForbiddenError('Необходима авторизация')
    }

    req.user = result.data
    next()
  } catch (error) {
    if (error instanceof AppError) {
      next(error)
      return
    }

    next(
      new AppError(502, 'Ошибка обращения к API Практикума', 'UPSTREAM_ERROR')
    )
  }
}
