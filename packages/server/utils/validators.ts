import { ValidationError } from './errors'

export const validateTeamName = (teamName: unknown): string => {
  if (typeof teamName !== 'string') {
    throw new ValidationError('Team name must be a string')
  }

  const trimmed = teamName.trim()

  if (trimmed.length === 0) {
    throw new ValidationError('Team name cannot be empty')
  }

  if (trimmed.length > 100) {
    throw new ValidationError('Team name is too long (max 100 characters)')
  }

  if (!/^[a-zA-Z0-9а-яА-ЯёЁ\s\-_]+$/.test(trimmed)) {
    throw new ValidationError(
      'Team name contains invalid characters (allowed: letters, numbers, spaces, hyphens, underscores)'
    )
  }

  return trimmed
}

export const validatePaginationParams = (params: {
  limit?: unknown
  offset?: unknown
}): { limit: number; offset: number } => {
  const limit =
    typeof params.limit === 'string' ? parseInt(params.limit, 10) : 10
  const offset =
    typeof params.offset === 'string' ? parseInt(params.offset, 10) : 0

  if (isNaN(limit) || limit < 1 || limit > 100) {
    throw new ValidationError('Invalid limit parameter (must be 1-100)')
  }

  if (isNaN(offset) || offset < 0) {
    throw new ValidationError('Invalid offset parameter (must be >= 0)')
  }

  return { limit, offset }
}

const getAllowedYandexRedirectOrigins = (): string[] => {
  const configured = (process.env.OAUTH_ALLOWED_REDIRECT_ORIGINS ?? '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean)

  if (configured.length > 0) {
    return configured
  }

  return [`http://localhost:${process.env.CLIENT_PORT || 3000}`]
}

const validateYandexRedirectUri = (value: unknown): string => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new ValidationError(
      'redirect_uri is required and must be a non-empty string'
    )
  }

  const redirectUri = value.trim()
  let origin: string

  try {
    origin = new URL(redirectUri).origin
  } catch {
    throw new ValidationError('redirect_uri must be a valid absolute URL')
  }

  if (!getAllowedYandexRedirectOrigins().includes(origin)) {
    throw new ValidationError(
      `redirect_uri origin "${origin}" is not in the OAuth allow-list`
    )
  }

  return redirectUri
}

export const validateYandexServiceIdQuery = (query: unknown): string =>
  validateYandexRedirectUri(
    (query as Record<string, unknown> | null)?.redirect_uri
  )

export const validateYandexOAuthBody = (
  body: unknown
): { code: string; redirect_uri: string } => {
  if (typeof body !== 'object' || body === null) {
    throw new ValidationError('Request body must be a JSON object')
  }

  const { code, redirect_uri } = body as Record<string, unknown>

  if (typeof code !== 'string' || code.trim().length === 0) {
    throw new ValidationError('code is required and must be a non-empty string')
  }

  return {
    code: code.trim(),
    redirect_uri: validateYandexRedirectUri(redirect_uri),
  }
}
