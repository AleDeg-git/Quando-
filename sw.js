const V='quando-v1';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// Apre subito dalla copia salvata e intanto aggiorna in background (funziona anche per i font di Google)
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const run=caches.open(V).then(async c=>{
    const hit=await c.match(e.request);
    const net=fetch(e.request).then(r=>{if(r&&(r.ok||r.type==='opaque'))c.put(e.request,r.clone());return r}).catch(()=>null);
    e.waitUntil(net);
    return hit||(await net)||(await c.match('./index.html'))||Response.error();
  });
  e.respondWith(run);
});
