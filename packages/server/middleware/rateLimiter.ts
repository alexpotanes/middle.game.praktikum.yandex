import rateLimit from 'express-rate-limit'

const TOO_MANY_REQUESTS_MESSAGE = {
  reason: 'Слишком много запросов, попробуйте позже',
}

export const oauthRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: TOO_MANY_REQUESTS_MESSAGE,
})

export const forumReadRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: TOO_MANY_REQUESTS_MESSAGE,
})

export const forumWriteRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: TOO_MANY_REQUESTS_MESSAGE,
})
