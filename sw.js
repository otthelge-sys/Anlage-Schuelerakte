// Offline-Zwischenspeicher: Seite funktioniert nach dem ersten Aufruf auch ohne Internet.
// Es werden nur die Programmdateien gespeichert, keine eingegebenen Daten.
const CACHE = 'akte-v5';
const DATEIEN = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(DATEIEN)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Netz zuerst (damit Updates sofort ankommen), sonst Zwischenspeicher
  e.respondWith(fetch(e.request).then(r => { const k = r.clone(); caches.open(CACHE).then(c => c.put(e.request, k)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
});
