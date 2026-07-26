import { SERVER_HOST } from '../constants'
import { ApiError } from './types'

const isFormDataBody = (body: RequestInit['body']) =>
  typeof FormData !== 'undefined' && body instanceof FormData

export const request = async <T>(
  path: string,
  init: RequestInit = {}
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
    const reason = (data as ApiError)?.reason ?? 'Что-то пошло не так'
    throw { reason } as ApiError
  }

  return data as T
}
