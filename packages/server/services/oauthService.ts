import {
  jsonHeaders,
  praktikumFetch,
  readPraktikumResult,
  UpstreamResult,
} from './praktikumApi'

const YANDEX_AUTHORIZE_URL = 'https://oauth.yandex.ru/authorize'

const buildYandexAuthUrl = (serviceId: string, redirectUri: string) => {
  const url = new URL(YANDEX_AUTHORIZE_URL)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('client_id', serviceId)
  url.searchParams.set('redirect_uri', redirectUri)
  return url.toString()
}

const isServiceIdPayload = (data: unknown): data is { service_id: string } =>
  typeof data === 'object' &&
  data !== null &&
  typeof (data as { service_id?: unknown }).service_id === 'string'

export const getYandexServiceId = async (
  redirectUri: string
): Promise<UpstreamResult> => {
  const result = await readPraktikumResult(
    await praktikumFetch(
      `/oauth/yandex/service-id?redirect_uri=${encodeURIComponent(redirectUri)}`
    )
  )

  if (!isServiceIdPayload(result.data)) {
    return result
  }

  return {
    ...result,
    data: {
      ...result.data,
      auth_url: buildYandexAuthUrl(result.data.service_id, redirectUri),
    },
  }
}

export const signInWithYandex = async (body: {
  code: string
  redirect_uri: string
}): Promise<UpstreamResult> =>
  readPraktikumResult(
    await praktikumFetch('/oauth/yandex', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: jsonHeaders(),
    })
  )
