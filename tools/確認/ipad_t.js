// iPad など広い画面の見た目の点検：本文の幅、浮いているボタン・下のタブが本文の幅に収まっているか、スマホ幅は今までどおりか
// 使い方：node tools/確認/ipad_t.js file:///…/index.html
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();let bad=0;
 for(const [w,h,mw] of [[390,844,560],[820,1180,760],[1180,820,880],[1366,1024,880]]){
  const p=await b.newPage({viewport:{width:w,height:h}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto(process.argv[2]);await p.waitForTimeout(1200);await p.evaluate(()=>showPage('know'));await p.waitForTimeout(300);
  const r=await p.evaluate(()=>{const m=document.querySelector('main').getBoundingClientRect();const f=[...document.querySelectorAll('.fab')].filter(x=>x.offsetParent).map(x=>x.getBoundingClientRect());
   const nb=[...document.querySelectorAll('nav button')].map(x=>x.getBoundingClientRect());
   return {mw:Math.round(m.width),ml:Math.round(m.left),mr:Math.round(m.right),fab:f.map(x=>[Math.round(x.left),Math.round(x.right)]),nav:[Math.round(nb[0].left),Math.round(nb[nb.length-1].right)],sx:document.documentElement.scrollWidth>innerWidth};});
  const okW=r.mw<=mw&&(w<mw||r.mw>=Math.min(mw,w)-1);
  const okF=r.fab.every(([l,rr])=>l>=r.ml-2&&rr<=r.mr+2);
  const okN=w<mw||(r.nav[0]>=r.ml-2&&r.nav[1]<=r.mr+2);
  const ok=okW&&okF&&okN&&!r.sx&&!errs.length;if(!ok)bad++;
  console.log(ok?'OK':'NG',w+'x'+h,JSON.stringify(r),errs);await p.close();}
 console.log('bad',bad);await b.close();})();
