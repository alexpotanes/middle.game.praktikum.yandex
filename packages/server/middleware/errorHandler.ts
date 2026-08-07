import type { Request, Response, NextFunction } from 'express'
import { AppError, ValidationError } from '../utils/errors'

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Error:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
  })

  if (err instanceof AppError) {
    const responsePayload: {
      code?: string
      message: string
      details?: unknown
    } = {
      code: err.code,
      message: err.message,
    }

    if (err instanceof ValidationError && err.details) {
      responsePayload.details = err.details
    }

    return res.status(err.statusCode).json({
      error: responsePayload,
    })
  }

  return res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message:
        process.env.NODE_ENV === 'production'
          ? 'Internal server error'
          : err.message,
    },
  })
}

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
