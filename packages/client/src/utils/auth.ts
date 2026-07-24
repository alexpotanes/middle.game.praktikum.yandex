const getCookie = (name: string) => {
  if (typeof document === 'undefined') {
    return undefined
  }

  const matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        // eslint-disable-next-line
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)'
    )
  )

  return matches ? decodeURIComponent(matches[1]) : undefined
}

export const getAuthToken = () => getCookie('token')
