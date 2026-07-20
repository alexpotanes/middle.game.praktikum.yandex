const BASE_URL =
  process.env.PRAKTIKUM_API_URL || 'https://ya-praktikum.tech/api/v2'

export const praktikumFetch = (path: string, init: RequestInit = {}) =>
  fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
  })
