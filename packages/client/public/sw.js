/* global importScripts */

importScripts('/precache-manifest.js')

// Версия кеша меняется вручную, когда нужно сбросить старый кеш или поменялась стратегия кеширования.
const CACHE_NAME = 'app-cache-v1'
const PRECACHE_NAME = `${CACHE_NAME}-precache`
const RUNTIME_NAME = `${CACHE_NAME}-runtime`
const APP_SHELL_URL = '/'
const BUILD_ASSET_URLS = self.__PRECACHE_MANIFEST__ || []
const PRECACHE_URLS = [...new Set([APP_SHELL_URL, ...BUILD_ASSET_URLS])]
const RUNTIME_CACHE_LIMIT = 50
const MAX_RUNTIME_RESPONSE_SIZE = 5 * 1024 * 1024

function isSameOrigin(url) {
  return url.origin === location.origin
}

function isSuccessfulBasicResponse(response) {
  return response && response.ok && response.type === 'basic'
}

function isRuntimeResponseSizeAllowed(response) {
  const contentLength = response.headers.get('content-length')

  return !contentLength || Number(contentLength) <= MAX_RUNTIME_RESPONSE_SIZE
}

function isPrecacheUrl(url) {
  return PRECACHE_URLS.includes(url.pathname)
}

function isStaticAssetRequest(request) {
  const url = new URL(request.url)
  const allowedDestinations = ['script', 'style', 'image', 'font']

  return (
    isSameOrigin(url) &&
    allowedDestinations.includes(request.destination) &&
    (url.pathname.startsWith('/assets/') || isPrecacheUrl(url))
  )
}

function trimRuntimeCache() {
  return caches.open(RUNTIME_NAME).then(cache => {
    return cache.keys().then(keys => {
      if (keys.length <= RUNTIME_CACHE_LIMIT) {
        return undefined
      }

      return cache.delete(keys[0]).then(trimRuntimeCache)
    })
  })
}

function precacheUrl(cache, url) {
  return fetch(url).then(response => {
    if (!isSuccessfulBasicResponse(response)) {
      throw new Error(`Precache failed for ${url}`)
    }

    return cache.put(url, response)
  })
}

function handleNavigation(request) {
  return fetch(request).catch(() => {
    return caches.match(APP_SHELL_URL).then(response => {
      return response || Response.error()
    })
  })
}

function handleStaticAsset(request) {
  return caches.match(request).then(cachedResponse => {
    if (cachedResponse) {
      return cachedResponse
    }

    return fetch(request).then(response => {
      if (
        isSuccessfulBasicResponse(response) &&
        isRuntimeResponseSizeAllowed(response)
      ) {
        const responseToCache = response.clone()

        caches
          .open(RUNTIME_NAME)
          .then(cache => cache.put(request, responseToCache))
          .then(trimRuntimeCache)
          .catch(() => undefined)
      }

      return response
    })
  })
}

this.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(PRECACHE_NAME)
      .then(cache =>
        Promise.all(PRECACHE_URLS.map(url => precacheUrl(cache, url)))
      )
      .then(() => this.skipWaiting())
  )
})

this.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames
            .filter(
              cacheName =>
                cacheName !== PRECACHE_NAME && cacheName !== RUNTIME_NAME
            )
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

  if (event.request.mode === 'navigate') {
    event.respondWith(handleNavigation(event.request))
    return
  }

  if (isStaticAssetRequest(event.request)) {
    event.respondWith(handleStaticAsset(event.request))
  }
})
