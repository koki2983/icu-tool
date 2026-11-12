/* ICU ツール：オフライン用 Service Worker
   方針：
   1) 本体（index.html）は「ネットワーク優先」。つながれば必ず最新を取り、取れたものを保存する。
      圏外・電波が弱い（3 秒で応答なし）ときだけ、保存してある版を出し、裏で最新を保存する。
      新しい版が保存できたら画面に知らせ、画面が「更新する」ボタンを出す。→ 古い版を見続ける事故を防ぐため
   2) 画像などは「保存してあるものを先に出し、裏で更新」。
   3) 患者データは扱わない。保存するのはアプリのファイルだけ。 */
const CACHE='icu-tool-v1';
const SWV=2;
const SHELL='./';
const ASSETS=["img/apple-touch-icon.png", "img/ards.jpg", "img/atel.jpg", "img/bgh.jpg", "img/brain.jpg", "img/cabg3.jpg", "img/cad.jpg", "img/chf.jpg", "img/cond.jpg", "img/cor2.jpg", "img/couinaud.jpg", "img/derm.jpg", "img/ecg_af.jpg", "img/ecg_afl.jpg", "img/ecg_cavb.jpg", "img/ecg_m1.jpg", "img/ecg_m2.jpg", "img/ecg_svt.jpg", "img/ecg_tdp2.jpg", "img/ecg_vf.jpg", "img/ecg_vt2.jpg", "img/fact.jpg", "img/fax.jpg", "img/heartint.jpg", "img/heartsec.jpg", "img/heartval.jpg", "img/heartwall.jpg", "img/hydro.jpg", "img/icon-192.png", "img/icon-512.png", "img/ivc.jpg", "img/ivh.jpg", "img/kerley.jpg", "img/kidflow.jpg", "img/kidney.jpg", "img/legart.jpg", "img/lobes.jpg", "img/lungs.jpg", "img/mi.jpg", "img/neckv.jpg", "img/nephron.jpg", "img/norm.jpg", "img/pe.jpg", "img/peff.jpg", "img/ptx.jpg", "img/ptxct.jpg", "img/pulm.jpg", "img/sah.jpg", "img/sdh.jpg", "img/spine.jpg", "img/stem.jpg", "img/sysart.jpg", "img/thorabd.jpg", "img/thorv.jpg", "img/valves.jpg", "img/ventr.jpg", "manifest.webmanifest"];
self.addEventListener('install',e=>{
  e.waitUntil((async()=>{
    const c=await caches.open(CACHE);
    await c.add(new Request(SHELL,{cache:'reload'}));
    // 画像は 1 枚失敗しても全体を止めない
    await Promise.all(ASSETS.map(u=>c.add(u).catch(()=>{})));
    self.skipWaiting();
  })());
});
self.addEventListener('activate',e=>{
  e.waitUntil((async()=>{
    const ks=await caches.keys();
    await Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});
const isShell=req=>{
  if(req.mode==='navigate')return true;
  const u=new URL(req.url);
  return u.pathname.endsWith('/')||u.pathname.endsWith('/index.html');
};
async function shell(e){
  const c=await caches.open(CACHE);
  const old=await c.match(SHELL);
  const sig=r=>r?(r.headers.get('etag')||r.headers.get('last-modified')||''):'';
  let changed=false;
  const notify=async()=>{const cs=await self.clients.matchAll({type:'window',includeUncontrolled:true});cs.forEach(x=>x.postMessage({type:'icu-updated'}));};
  const net=fetch(new Request(SHELL,{cache:'no-cache'})).then(async r=>{
    if(r&&r.ok){changed=!!(old&&sig(old)&&sig(r)&&sig(old)!==sig(r));await c.put(SHELL,r.clone());}
    return r;
  });
  const nav=e.request.mode==='navigate';
  // 画面からの「最新を確認」（ページ読み込みではない取得）で新しい版が見つかったら知らせる
  if(!nav)e.waitUntil(net.then(()=>{if(changed)return notify();}).catch(()=>{}));
  const timeout=new Promise(res=>setTimeout(()=>res(null),3000));
  try{
    const r=await Promise.race([net,timeout]);
    if(r&&r.ok)return r;            // 最新をそのまま表示できた
  }catch(_){}
  if(old){
    // 保存版を表示した。あとから新しい版が保存できたら、画面に「更新する」を出してもらう
    if(nav)e.waitUntil(net.then(()=>{if(changed)return notify();}).catch(()=>{}));
    return old;
  }
  return net; // 保存がまだ無いときは待つ
}
async function asset(e){
  const c=await caches.open(CACHE);
  const hit=await c.match(e.request,{ignoreSearch:true});
  const net=fetch(e.request).then(r=>{if(r&&r.ok)c.put(e.request,r.clone());return r;});
  if(hit){e.waitUntil(net.catch(()=>{}));return hit;}
  return net;
}
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  const u=new URL(req.url);
  if(u.origin!==location.origin)return;           // 外部（動画など）は触らない
  if(u.pathname.endsWith('/sw.js'))return;
  if(u.pathname.includes('/docs/'))return;          // 発表資料は保存しない
  e.respondWith(isShell(req)?shell(e):asset(e));
});
