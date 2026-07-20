import { SERVER_HOST } from '../constants'
import { ApiError } from './types'

export const request = async <T>(
  path: string,
  init: RequestInit = {},
): Promise<T> => {
  const res = await fetch(`${SERVER_HOST}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
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
    const reason = (data as ApiError)?.reason ?? 'Что-то пошло не так'
    throw { reason } as ApiError
  }

  return data as T
}
