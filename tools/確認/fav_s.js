const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(process.argv[2],{waitUntil:'load'});await p.waitForTimeout(1500);
await p.evaluate(()=>showPage('score'));await p.waitForTimeout(300);
const segs=await p.evaluate(()=>[...document.querySelectorAll('#scoreSeg button')].map(b=>b.dataset.s));console.log(segs);
for(const s of segs){await p.evaluate(s=>document.querySelector(`#scoreSeg [data-s="${s}"]`).click(),s);await p.waitForTimeout(150);
 const f=await p.evaluate(()=>document.querySelector('#favScore .favb').dataset.fav);if(f!=='s:'+s)console.log('MISMATCH',s,f);}
await p.evaluate(()=>{document.querySelector('#scoreSeg [data-s="rass"]').click();});await p.waitForTimeout(150);
await p.evaluate(()=>document.querySelector('#favScore .favb').click());
await p.evaluate(()=>{document.querySelector('#scoreSeg [data-s="nihss"]').click();});await p.waitForTimeout(150);
await p.evaluate(()=>document.querySelector('#favScore .favb').click());
await p.screenshot({path:'/home/claude/fv/score.png'});
await p.reload({waitUntil:'load'});await p.waitForTimeout(1500);
console.log(await p.evaluate(()=>[...document.querySelectorAll('#favBar .fvc')].map(x=>x.textContent)));
await p.evaluate(()=>document.querySelector('#favBar [data-f="s:nihss"]').click());await p.waitForTimeout(400);
console.log(await p.evaluate(()=>({page:document.querySelector('.page.on').id,on:document.querySelector('#scoreSeg .on').dataset.s,vis:getComputedStyle(document.getElementById('s-nihss')).display,star:document.querySelector('#favScore .favb').textContent})));
console.log('hscroll',await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),errs);await b.close();})();
