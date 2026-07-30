const BASE_URL =
  process.env.PRAKTIKUM_API_URL || 'https://ya-praktikum.tech/api/v2'

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

export const readPraktikumResult = async (
  res: Response
): Promise<UpstreamResult> => {
  const headers = res.headers as Headers & { getSetCookie?: () => string[] }
  const setCookie = headers.getSetCookie?.() ?? []
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

export const withCookie = (cookie?: string): Record<string, string> =>
  cookie ? { Cookie: cookie } : {}

export const jsonHeaders = (
  headers: Record<string, string> = {}
): Record<string, string> => ({
  'Content-Type': 'application/json',
  ...headers,
})

export const praktikumFetch = (path: string, init: RequestInit = {}) =>
  fetch(`${BASE_URL}${path}`, init)
