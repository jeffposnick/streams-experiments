importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.0.0-rc.2/workbox-sw.js');

// Make this a debug build
workbox.setConfig({
  debug: true,
});

// Place holder for precached assets
workbox.precaching.precacheAndRoute([]);

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
