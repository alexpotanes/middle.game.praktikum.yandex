import {
  jsonHeaders,
  praktikumFetch,
  readPraktikumResult,
  withCookie,
} from './praktikumApi'

export const signin = async (body: unknown, cookie?: string) =>
  readPraktikumResult(
    await praktikumFetch('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: jsonHeaders(withCookie(cookie)),
    })
  )

export const signup = async (body: unknown, cookie?: string) =>
  readPraktikumResult(
    await praktikumFetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: jsonHeaders(withCookie(cookie)),
    })
  )

export const logout = async (cookie?: string) =>
  readPraktikumResult(
    await praktikumFetch('/auth/logout', {
      method: 'POST',
      headers: withCookie(cookie),
    })
  )

export const getUser = async (cookie?: string) =>
  readPraktikumResult(
    await praktikumFetch('/auth/user', {
      method: 'GET',
      headers: withCookie(cookie),
    })
  )
