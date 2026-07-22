const CACHE_NAME = "ikimono-master-v23";
const FILES = ["./","./index.html","./styles.css","./app.js","./data.js","./config.js","./manifest.webmanifest","./spirit-evolution-guide.png"];
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(FILES))));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key))))));
self.addEventListener("fetch",event=>event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request))));
