// Static Shell Cache™ — a deliberately narrow service worker. It only
// ever answers GET requests for immutable, content-hashed Next.js build
// assets (/_next/static/**, which changes URL on every deploy — a cache
// hit is always byte-identical, never stale) and a small fixed list of
// branding assets (favicon/icons/manifest). It NEVER intercepts page
// navigations, RSC payloads, or /api/** — those always go straight to
// the network untouched, so no personalized or per-user data is ever
// cached here, and no authenticated response can leak between users on
// a shared device. This is purely a "make repeat visits' static assets
// load instantly, even offline" layer, not an offline-app or stale-while-
// revalidate cache for anything dynamic.
const CACHE_NAME = 'qm-static-shell-v2'

const SHELL_ASSETS = ['/manifest.json', '/favicon.ico', '/apple-icon.png', '/icon.svg']

function isCacheableStaticAsset(url) {
  if (url.origin !== self.location.origin) return false
  if (url.pathname.startsWith('/_next/static/')) return true
  return SHELL_ASSETS.includes(url.pathname)
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  const url = new URL(event.request.url)
  if (!isCacheableStaticAsset(url)) return

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(event.request)
      if (cached) return cached

      const response = await fetch(event.request)
      if (response.ok) cache.put(event.request, response.clone())
      return response
    }),
  )
})

// Daily reminders (Phase 3) — phone notifications. The server sends one
// short reminder a day; showing it and opening the app on a tap are the only
// things this does. No data is cached or stored here.
self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch {
    data = { body: event.data ? event.data.text() : '' }
  }
  const title = typeof data.title === 'string' ? data.title : 'Mind Ur Mind'
  event.waitUntil(
    self.registration.showNotification(title, {
      body: typeof data.body === 'string' ? data.body : '',
      icon: '/apple-icon.png',
      badge: '/apple-icon.png',
      tag: typeof data.tag === 'string' ? data.tag : 'mind-ur-mind-reminder',
      data: { url: typeof data.url === 'string' && data.url.startsWith('/') ? data.url : '/dashboard' },
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const target = new URL(event.notification.data && event.notification.data.url ? event.notification.data.url : '/dashboard', self.location.origin).href
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
      for (const client of windows) {
        if (client.url.startsWith(self.location.origin) && 'focus' in client) {
          client.navigate(target)
          return client.focus()
        }
      }
      return self.clients.openWindow(target)
    }),
  )
})
