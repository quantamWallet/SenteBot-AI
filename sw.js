const CACHE = "sentebot-v2";

const ASSETS = [
"/SenteBot-AI/",
"/SenteBot-AI/index.html",
"/SenteBot-AI/manifest.json",
"/SenteBot-AI/icon-512.png"
];

self.addEventListener("install", event => {
event.waitUntil(
caches.open(CACHE).then(cache =>
cache.addAll(ASSETS)
).then(() => self.skipWaiting())
);
});

self.addEventListener("activate", event => {
event.waitUntil(
caches.keys().then(keys =>
Promise.all(
keys
.filter(key => key.startsWith("sentebot-") && key !== CACHE)
.map(key => caches.delete(key))
)
).then(() => self.clients.claim())
);
});

self.addEventListener("fetch", event => {
const request = event.request;
const url = new URL(request.url);

// Only handle requests from this website.
if (url.origin !== self.location.origin) return;

// Do not interfere with non-GET requests.
if (request.method !== "GET") return;

// Always try the network first for HTML pages.
if (
request.mode === "navigate" ||
request.destination === "document" ||
url.pathname.endsWith(".html") ||
url.pathname === "/SenteBot-AI/"
) {
event.respondWith(
fetch(request).catch(async () => {
const cached = await caches.match(request);
if (cached) return cached;

    const fallback = await caches.match("/SenteBot-AI/index.html");
    if (fallback) return fallback;

    return Response.error();
  })
);
return;

}

// Cache first for static files, then use the network.
event.respondWith(
caches.match(request).then(cached => {
if (cached) return cached;

  return fetch(request).then(response => {
    if (response.ok && response.type === "basic") {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(request, copy));
    }

    return response;
  });
})

);
});
