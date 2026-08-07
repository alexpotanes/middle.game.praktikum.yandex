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
