export const getYandexRedirectUri = () => window.location.origin

export const extractYandexOAuthCode = (search: string): string | null =>
  new URLSearchParams(search).get('code')

export const removeYandexOAuthCodeFromUrl = async () => {
  const url = new URL(window.location.href)
  url.searchParams.delete('code')

  const { router } = await import('../router/browserRouter')
  await router.navigate(`${url.pathname}${url.search}`, { replace: true })
}
