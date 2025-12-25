const cacheName = "messenger-cache-v1";
const assets = ["/index.html","/register.html","/users.html","/chat.html","/style.css","/app.js","/manifest.json","/icon-192.png","/icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(cacheName).then(c => c.addAll(assets))); });
self.addEventListener("fetch", e => { e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))); });
