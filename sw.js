/* S2gold-webapp service worker v0.5.0
 * Scope: this GitHub Pages project only.
 * No caching of GOG EXE, ZIP archives, WASM, or third-party emulator resources.
 */
const VERSION = '0.5.0';
const CACHE_NAME = 's2gold-shell-' + VERSION;
const SHELL = ['./', './index.html', './installer-check.js?v=' + VERSION, './updater.js?v=' + VERSION, './version.json'];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(SHELL.map(s => new Request(s, {cache: 'reload'})));
    // Activation is controlled by the explicit update confirmation in the page.
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('s2gold-shell-') && k !== CACHE_NAME).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data && event.data.type === 'GET_VERSION') event.source?.postMessage({type:'SW_VERSION',version:VERSION});
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
  if (request.mode === 'navigate' || url.pathname.endsWith('/version.json')) {
    event.respondWith((async () => {
      try { return await fetch(new Request(request, {cache:'no-store'})); }
      catch (error) {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(request.mode === 'navigate' ? './index.html' : request);
        if (cached) return cached;
        throw error;
      }
    })());
    return;
  }
  if (!/\/(installer-check\.js|updater\.js)$/.test(url.pathname)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    return await cache.match(request) || await fetch(request);
  })());
});
