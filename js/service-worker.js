self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('v1').then((cache) => {
        return cache.addAll([
          '/',
          '/index.html',
          '/css/calendarStyles.css',
          '/css/modalStyles.css',
          '/js/app.js',
          '/images/DinnerDeltag-logo-full.png',
          '/images/DinnerDeltag-logo-small.png'
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });
  