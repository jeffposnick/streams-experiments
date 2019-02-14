importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.0.0-rc.2/workbox-sw.js');

// Make this a debug build
workbox.setConfig({
  debug: true,
});

// Place holder for precached assets
workbox.precaching.precacheAndRoute([
  {
    "url": "css/index.css",
    "revision": "ed2bcbb36fdc49e336b6b89f86737047"
  },
  {
    "url": "js/zenscroll.min.js",
    "revision": "b6075f76c2f71bae72e7a544f61a0919"
  },
  {
    "url": "partials/404.html",
    "revision": "40acdc63b1e48c67fd1e32be262d6cc4"
  },
  {
    "url": "partials/offline.html",
    "revision": "f761dd08b66768c2d9a20131b080f457"
  },
  {
    "url": "partials/page-start.html",
    "revision": "b2d55c544f57af1e102eafc080b28cad"
  },
  {
    "url": "partials/page-end.html",
    "revision": "6ad262a4a8d8cd439510bcaa4a9c3c31"
  }
]);

const HEAD = workbox.precaching.getCacheKeyForURL('partials/page-start.html');
const FOOT = workbox.precaching.getCacheKeyForURL('partials/page-end.html');
const ERROR = workbox.precaching.getCacheKeyForURL('partials/404.html');

const cacheStrategy = new workbox.strategies.CacheFirst({
  cacheName: workbox.core.cacheNames.precache,
});

const networkStrategy = new workbox.strategies.StaleWhileRevalidate({
  cacheName: 'content',
  plugins: [
    new workbox.expiration.Plugin({
      maxEntries: 50,
    }),
  ],
});

workbox.routing.registerRoute(
    new RegExp('\\.html$'),
    workbox.streams.strategy([
      () => cacheStrategy.makeRequest({
        request: HEAD,
      }),
      async ({event}) => {
        try {
          const contentResponse = networkStrategy.makeRequest({
            request: event.request.url,
          });
          const contentData = await contentResponse.text();
          return contentData;
        } catch (error) {
          return cacheStrategy.makeRequest({
            request: ERROR,
          });
        }
      },
      () => cacheStrategy.makeRequest({
        request: FOOT,
      }),
    ])
);
