const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(process.argv[2],{waitUntil:'load'});await p.waitForTimeout(1500);
await p.evaluate(()=>showPage('know'));await p.waitForTimeout(400);
const types=await p.evaluate(()=>[...document.querySelectorAll('#kType [data-t]')].map(x=>x.dataset.t));
let bad=0,n=0;
for(const t of types.slice(0,+process.env.LIM||99)){await p.evaluate(t=>[...document.querySelectorAll('#kType [data-t]')].find(x=>x.dataset.t===t).click(),t);await p.waitForTimeout(100);
 const items=await p.evaluate(()=>[...document.querySelectorAll('#kPick [data-go2]')].map(x=>x.dataset.go2));
 for(const it of items){n++;await p.evaluate(it=>[...document.querySelectorAll('#kPick [data-go2]')].find(x=>x.dataset.go2===it).click(),it);await p.waitForTimeout(2700);
  const r=await p.evaluate(()=>{const o=[...document.querySelectorAll('#kList details[open]')];const vis=o.filter(d=>{const r=d.getBoundingClientRect();return r.top<innerHeight&&r.bottom>0});
   const top=o.map(d=>({t:d.dataset.key,y:Math.round(d.getBoundingClientRect().top)}));return {open:top,first:vis[0]?vis[0].dataset.key:null,sy:Math.round(scrollY)};});
  const want='k:'+it;const hit=r.open.find(x=>x.t===want);
  if(!hit||Math.abs(hit.y)>220){bad++;console.log('NG',t,'|',it.slice(0,22),'| open:',JSON.stringify(r.open).slice(0,200),'sy',r.sy);}
 }}
console.log('checked',n,'bad',bad,errs);await b.close();})();
