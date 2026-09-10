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

    if (result.status === 200 && isPracticumUser(result.data)) {
      req.user = result.data
      next()
      return
    }

    if (result.status === 401 || result.status === 403) {
      throw new ForbiddenError('Необходима авторизация')
    }

    if (result.status === 429) {
      throw new AppError(
        429,
        'API Практикума ограничило количество запросов, попробуйте позже',
        'UPSTREAM_RATE_LIMIT'
      )
    }

    throw new AppError(
      502,
      'Ошибка обращения к API Практикума',
      'UPSTREAM_ERROR'
    )
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
