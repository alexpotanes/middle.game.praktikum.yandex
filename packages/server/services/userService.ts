import { IncomingHttpHeaders } from 'http'
import {
  jsonHeaders,
  praktikumFetch,
  readPraktikumResult,
  withCookie,
} from './praktikumApi'

const multipartHeaders = (
  headers: IncomingHttpHeaders,
  cookie?: string
): Record<string, string> => {
  const forwardHeaders = withCookie(cookie)
  const contentType = headers['content-type']
  const contentLength = headers['content-length']

  if (typeof contentType === 'string') {
    forwardHeaders['Content-Type'] = contentType
  }

  if (typeof contentLength === 'string') {
    forwardHeaders['Content-Length'] = contentLength
  }

  return forwardHeaders
}

export const updateProfile = async (body: unknown, cookie?: string) =>
  readPraktikumResult(
    await praktikumFetch('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: jsonHeaders(withCookie(cookie)),
    })
  )

export const changePassword = async (body: unknown, cookie?: string) =>
  readPraktikumResult(
    await praktikumFetch('/user/password', {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: jsonHeaders(withCookie(cookie)),
    })
  )

export const updateAvatar = async (
  body: NodeJS.ReadableStream,
  headers: IncomingHttpHeaders,
  cookie?: string
) =>
  readPraktikumResult(
    await praktikumFetch('/user/profile/avatar', {
      method: 'PUT',
      body: body as RequestInit['body'],
      duplex: 'half',
      headers: multipartHeaders(headers, cookie),
    } as RequestInit & { duplex: 'half' })
  )
