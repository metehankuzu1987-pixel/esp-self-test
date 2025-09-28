// sw.js - basit cache-first offline
const CACHE = "tabirly-esp-v1";
const ASSETS = [
  "./",
  "./index.html"
  // Tek dosyalı olduğu için bu kadarı yeterli. İleride og.png vb. eklersen buraya da yaz.
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  // sadece GET istekleri
  if (req.method !== "GET") return;
  e.respondWith(
    caches.match(req).then(cached => 
      cached || fetch(req).then(res => {
        // aynı origin ise cache'e koy
        const copy = res.clone();
        if (req.url.startsWith(self.location.origin)) {
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => caches.match("./index.html"))
    )
  );
});
