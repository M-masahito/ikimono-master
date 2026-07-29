const CACHE_NAME = "ikimono-master-v7";

const APP_SHELL = [
    "./",
    "./index.html",
    "./manifest.webmanifest",
    "./icon-192.png",
    "./icon-512.png"
];

// 新しいService Workerをすぐ待機解除
self.addEventListener("install", event => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then(cache => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

// 古いキャッシュを全部削除
self.addEventListener("activate", event => {
    event.waitUntil(
        caches
            .keys()
            .then(keys =>
                Promise.all(
                    keys
                        .filter(key => key !== CACHE_NAME)
                        .map(key => caches.delete(key))
                )
            )
            .then(() => self.clients.claim())
    );
});

// オンラインなら必ず最新版を取得
self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(
        fetch(event.request, {
            cache: "no-store"
        })
            .then(response => {
                const requestUrl = new URL(event.request.url);

                // 自分のアプリ内ファイルだけ保存
                if (
                    response.ok &&
                    requestUrl.origin === self.location.origin
                ) {
                    const copy = response.clone();

                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, copy);
                    });
                }

                return response;
            })
            .catch(() => caches.match(event.request))
    );
});