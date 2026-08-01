// Версия кеша меняется вручную, когда нужно сбросить старый кеш или поменялась стратегия кеширования.
const CACHE_NAME = 'app-cache-v1'
const STATIC_URLS = ['/', '/vite.svg']
const CACHEABLE_RESPONSE_TYPES = ['basic', 'cors', 'opaque']

function getAssetUrlsFromText(text) {
  const assets = text.match(/\/assets\/[^"'`)<>\s]+/g) || []

  return [...new Set(assets)]
}

function isCacheableResponse(response) {
  return (
    CACHEABLE_RESPONSE_TYPES.includes(response.type) &&
    (response.status === 200 || response.type === 'opaque')
  )
}

function getPrecacheUrls() {
  return fetch('/')
    .then(response => response.text())
    .then(html => {
      const htmlAssetUrls = getAssetUrlsFromText(html)
      const scriptUrls = htmlAssetUrls.filter(url => url.endsWith('.js'))

      return Promise.all(
        scriptUrls.map(url => fetch(url).then(response => response.text()))
      ).then(scripts => {
        const scriptAssetUrls = scripts.flatMap(getAssetUrlsFromText)

        return [
          ...new Set([...STATIC_URLS, ...htmlAssetUrls, ...scriptAssetUrls]),
        ]
      })
    })
    .catch(() => STATIC_URLS)
}

function putResponseInCache(request, response) {
  if (!response || !isCacheableResponse(response)) {
    return Promise.resolve()
  }

  const responseToCache = response.clone()

  return caches.open(CACHE_NAME).then(cache => {
    return cache.put(request, responseToCache)
  })
}

this.addEventListener('install', event => {
  // console.log('install')

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => getPrecacheUrls().then(urls => cache.addAll(urls)))
      .then(() => this.skipWaiting())
  )
})

this.addEventListener('activate', event => {
  // console.log('activate')

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => caches.delete(cacheName))
        )
      )
      .then(() => this.clients.claim())
  )
})

this.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        event.waitUntil(
          putResponseInCache(event.request, response).catch(() => undefined)
        )

        return response
      })
      .catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match(event.request).then(response => {
            return response || caches.match('/')
          })
        }

        return caches.match(event.request).then(response => {
          return response || Response.error()
        })
      })
  )
})
