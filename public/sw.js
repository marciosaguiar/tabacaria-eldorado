const CACHE = 'eldorado-v1'

// Assets to pre-cache on install
const PRECACHE = [
  '/',
  '/varejo',
  '/atacado',
  '/site.webmanifest',
  '/favicon.ico',
  '/icon-192.png',
  '/icon-512.png',
]

// ─── Install: pre-cache shell ─────────────────────────────────────────────────
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE))
  )
  self.skipWaiting()
})

// ─── Activate: clean old caches ───────────────────────────────────────────────
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// ─── Fetch strategy ───────────────────────────────────────────────────────────
self.addEventListener('fetch', (e) => {
  const { request } = e
  const url = new URL(request.url)

  // Skip non-GET, cross-origin, admin routes, API mutating calls
  if (
    request.method !== 'GET' ||
    url.origin !== self.location.origin ||
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/api/upload') ||
    url.pathname.startsWith('/api/settings')
  ) {
    return
  }

  // API /api/products → Network first, cache fallback (keeps data fresh)
  if (url.pathname.startsWith('/api/products')) {
    e.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone()
          caches.open(CACHE).then((c) => c.put(request, clone))
          return res
        })
        .catch(() => caches.match(request))
    )
    return
  }

  // Static assets (_next/static, images, fonts) → Cache first
  if (
    url.pathname.startsWith('/_next/static') ||
    url.pathname.startsWith('/images') ||
    url.pathname.match(/\.(png|jpg|jpeg|webp|svg|woff2?|ico)$/)
  ) {
    e.respondWith(
      caches.match(request).then(
        (cached) => cached || fetch(request).then((res) => {
          caches.open(CACHE).then((c) => c.put(request, res.clone()))
          return res
        })
      )
    )
    return
  }

  // Pages (varejo, atacado, /) → Network first, cache fallback
  e.respondWith(
    fetch(request)
      .then((res) => {
        caches.open(CACHE).then((c) => c.put(request, res.clone()))
        return res
      })
      .catch(() => caches.match(request))
  )
})
