import { request } from './http'

export type ThemeName = 'light' | 'dark'
export type ThemeResponse = {
  id: number
  theme: ThemeName
  description: string
}

const isTheme = (data: unknown): data is ThemeResponse => {
  if (!data || typeof data !== 'object') return false
  const value = data as Record<string, unknown>
  return (
    typeof value.id === 'number' &&
    (value.theme === 'light' || value.theme === 'dark') &&
    typeof value.description === 'string'
  )
}

export const getCurrentTheme = (signal: AbortSignal) =>
  request('/user/theme', { signal }, isTheme)

export const setCurrentTheme = (theme: ThemeName) =>
  request(
    '/user/theme',
    { method: 'PUT', body: JSON.stringify({ theme }) },
    isTheme
  )
