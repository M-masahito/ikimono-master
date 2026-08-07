const CACHE_NAME = "ikimono-master-v8";

const APP_SHELL = [
    "./",
    "./index.html",
    "./manifest.webmanifest",
    "./icon-192.png",
    "./icon-512.png"
];

// インストール
self.addEventListener("install", event => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then(cache => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

// 古いキャッシュを削除
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

// 基本はネットから最新版を取得
// 通信できない時だけキャッシュを使用
self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(
        fetch(event.request, {
            cache: "no-store"
        })
            .then(response => {

                const requestUrl =
                    new URL(event.request.url);

                // 自分のアプリ内ファイルだけキャッシュ
                if (
                    response.ok &&
                    requestUrl.origin === self.location.origin
                ) {
                    const copy = response.clone();

                    caches
                        .open(CACHE_NAME)
                        .then(cache => {
                            cache.put(
                                event.request,
                                copy
                            );
                        });
                }

                return response;
            })
            .catch(() =>
                caches.match(event.request)
            )
    );
});