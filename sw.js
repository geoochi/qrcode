const CACHE_NAME = 'ultraqr.codes'
self.addEventListener('install', () => {
  self.skipWaiting()
})
self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => Promise.all([self.clients.claim(), ...cacheNames.filter(e => e.startsWith(a) && e !== CACHE_NAME).map(e => caches.delete(e))]))
  )
})
self.addEventListener('fetch', event => {
  if (event.request.url.includes('/api/')) return
  const s = new URL(event.request.url)
  ;(!/(?:\.css|\.js|\.svg)$/i.test(s.pathname) && s.origin !== self.location.origin) ||
    event.respondWith(
      caches
        .match(event.request)
        .then(e => e || caches.open(CACHE_NAME).then(h => fetch(event.request).then(n => (n.status !== 200 || h.put(event.request, n.clone()), n))))
    )
})
