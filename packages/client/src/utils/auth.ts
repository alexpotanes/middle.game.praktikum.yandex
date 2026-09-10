import Cookies from 'js-cookie'

export const AUTH_TOKEN_COOKIE_NAME = 'token'

export const getAuthToken = (): string | undefined => {
  return Cookies.get(AUTH_TOKEN_COOKIE_NAME)
}

export const setAuthToken = (token: string): void => {
  Cookies.set(AUTH_TOKEN_COOKIE_NAME, token, {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  })
}

export const removeAuthToken = (): void => {
  Cookies.remove(AUTH_TOKEN_COOKIE_NAME, { path: '/' })
}

export const hasAuthToken = (): boolean => {
  return Boolean(getAuthToken())
}
