const YANDEX_AUTHORIZE_URL = 'https://oauth.yandex.ru/authorize'

export const getYandexRedirectUri = () => window.location.origin

export const getYandexAuthUrl = (serviceId: string, redirectUri: string) =>
  `${YANDEX_AUTHORIZE_URL}?response_type=code&client_id=${serviceId}&redirect_uri=${encodeURIComponent(redirectUri)}`

export const extractYandexOAuthCode = (search: string): string | null =>
  new URLSearchParams(search).get('code')

export const removeYandexOAuthCodeFromUrl = () => {
  const url = new URL(window.location.href)
  url.searchParams.delete('code')
  window.history.replaceState({}, '', url)
}
