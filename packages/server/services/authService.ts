import { praktikumFetch } from './praktikumApi'

export type UpstreamResult = {
  status: number
  data: unknown
  setCookie: string[]
}

const rewriteSetCookie = (cookies: string[]): string[] =>
  cookies.map(raw => {
    const [nameValue, ...attrs] = raw.split(';').map(part => part.trim())
    const kept = attrs.filter(attr => {
      const key = attr.split('=')[0].toLowerCase()
      return !['domain', 'secure', 'samesite', 'path'].includes(key)
    })
    return [nameValue, ...kept, 'Path=/', 'SameSite=Lax'].join('; ')
  })

const readResult = async (res: Response): Promise<UpstreamResult> => {
  const setCookie = res.headers.getSetCookie?.() ?? []
  const text = await res.text()
  let data: unknown = text || null
  try {
    if (text) {
      data = JSON.parse(text)
    }
  } catch {
    data = text
  }
  return { status: res.status, data, setCookie: rewriteSetCookie(setCookie) }
}

const withCookie = (cookie?: string): Record<string, string> =>
  cookie ? { Cookie: cookie } : {}

export const signin = async (body: unknown, cookie?: string) =>
  readResult(
    await praktikumFetch('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: withCookie(cookie),
    }),
  )

export const signup = async (body: unknown, cookie?: string) =>
  readResult(
    await praktikumFetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: withCookie(cookie),
    }),
  )

export const logout = async (cookie?: string) =>
  readResult(
    await praktikumFetch('/auth/logout', {
      method: 'POST',
      headers: withCookie(cookie),
    }),
  )

export const getUser = async (cookie?: string) =>
  readResult(
    await praktikumFetch('/auth/user', {
      method: 'GET',
      headers: withCookie(cookie),
    }),
  )
