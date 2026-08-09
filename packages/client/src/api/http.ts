import { SERVER_HOST } from '../constants'
import { ApiError } from './types'

const isFormDataBody = (body: RequestInit['body']) =>
  typeof FormData !== 'undefined' && body instanceof FormData

const isApiError = (value: unknown): value is ApiError =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as Record<string, unknown>).reason === 'string'

export const request = async <T>(
  path: string,
  init: RequestInit = {},
  isValid?: (data: unknown) => data is T
): Promise<T> => {
  const headers = {
    ...(isFormDataBody(init.body)
      ? {}
      : { 'Content-Type': 'application/json' }),
    ...init.headers,
  }

  const res = await fetch(`${SERVER_HOST}${path}`, {
    ...init,
    credentials: 'include',
    headers,
  })

  const text = await res.text()
  let data: unknown = text || null

  try {
    if (text) {
      data = JSON.parse(text)
    }
  } catch {
    data = text
  }

  if (!res.ok) {
    const reason = isApiError(data) ? data.reason : 'Что-то пошло не так'
    throw { reason }
  }

  if (isValid) {
    if (!isValid(data)) {
      throw { reason: 'Некорректный ответ сервера' }
    }
    return data
  }

  return data as T
}
