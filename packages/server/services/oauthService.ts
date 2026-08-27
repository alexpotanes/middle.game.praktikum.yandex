import {
  jsonHeaders,
  praktikumFetch,
  readPraktikumResult,
} from './praktikumApi'

export const getYandexServiceId = async (redirectUri: string) =>
  readPraktikumResult(
    await praktikumFetch(
      `/oauth/yandex/service-id?redirect_uri=${encodeURIComponent(redirectUri)}`
    )
  )

export const signInWithYandex = async (body: unknown) =>
  readPraktikumResult(
    await praktikumFetch('/oauth/yandex', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: jsonHeaders(),
    })
  )
