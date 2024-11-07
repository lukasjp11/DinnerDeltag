const CACHE_NAME = "dinnerdeltag-cache-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/css/calendarStyles.css",
    "/css/modalStyles.css",
    "/js/app.js",
    "/js/calendar.js",
    "/js/modal.js",
    "/js/firebaseInit.js",
    "/images/DinnerDeltag-logo-small.png"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
