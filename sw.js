const CACHE = "sentebot-v1";
const ASSETS = [
  "/SenteBot-AI/",
  "/SenteBot-AI/index.html",
  "/SenteBot-AI/manifest.json",
  "/SenteBot-AI/icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
