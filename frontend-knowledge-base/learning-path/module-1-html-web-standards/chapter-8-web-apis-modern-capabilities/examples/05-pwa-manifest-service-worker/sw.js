const CACHE_NAME = "chapter-8-pwa-demo-v1";
const ASSETS_TO_CACHE = [
	"./",
	"./index.html",
	"./offline.html",
	"./style.css",
	"./app.js",
	"./manifest.json",
	"./icons/icon-192.svg",
	"./icons/icon-512.svg"
];

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
	);
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((keys) => Promise.all(
			keys.map((key) => key !== CACHE_NAME ? caches.delete(key) : Promise.resolve())
		))
	);
	self.clients.claim();
});

self.addEventListener("fetch", (event) => {
	if (event.request.mode === "navigate") {
		event.respondWith(
			fetch(event.request).catch(() => caches.match("./offline.html"))
		);
		return;
	}

	event.respondWith(
		caches.match(event.request).then((cachedResponse) => cachedResponse || fetch(event.request))
	);
});