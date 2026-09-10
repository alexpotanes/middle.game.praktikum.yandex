import { request } from './http'
import { YandexOAuthRequest, YandexServiceIdResponse } from './types'

export const getYandexServiceId = (redirectUri: string) =>
  request<YandexServiceIdResponse>(
    `/oauth/yandex/service-id?redirect_uri=${encodeURIComponent(redirectUri)}`
  )

export const signInWithYandexCode = (data: YandexOAuthRequest) =>
  request<string>('/oauth/yandex', {
    method: 'POST',
    body: JSON.stringify(data),
  })
