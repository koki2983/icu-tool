const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
const U=process.argv[2];await p.goto(U,{waitUntil:'load'});await p.waitForTimeout(1500);
const cnt=async()=>p.evaluate(()=>({know:document.querySelectorAll('#kList .favb').length,drug:document.querySelectorAll('#drugList .favb').length,calc:document.querySelectorAll('#p-calc .favb').length,bar:getComputedStyle(document.getElementById('favBar')).display,btn:!!document.getElementById('favBtn')}));
await p.evaluate(()=>showPage('know'));await p.waitForTimeout(400);
console.log('stars',await cnt());
// add: know ami, drug nad, calc pf, gamma
await p.evaluate(()=>{const c=s=>document.querySelector(`.favb[data-fav="${s}"]`).click();c('k:ami');c('d:nad');c('c:pf');c('c:gamma');c('k:sepsis');});
console.log('opened by star?',await p.evaluate(()=>document.querySelectorAll('#kList details[open]').length),await p.evaluate(()=>window.__favList()));
await p.screenshot({path:'/home/claude/fv/know.png'});
// reload = update
await p.reload({waitUntil:'load'});await p.waitForTimeout(1500);
console.log('after reload',await p.evaluate(()=>window.__favList()),await p.evaluate(()=>[...document.querySelectorAll('#favBar .fvc')].map(x=>x.textContent)));
await p.screenshot({path:'/home/claude/fv/home.png'});
// open each from bar
for(const f of ['k:ami','d:nad','c:pf','c:gamma']){await p.evaluate(f=>document.querySelector(`#favBar [data-f="${f}"]`).click(),f);await p.waitForTimeout(900);
 console.log(f,await p.evaluate(()=>({page:document.querySelector('.page.on').id,kopen:[...document.querySelectorAll('#kList details[open] summary')].map(x=>x.textContent.slice(0,20)),dk:document.querySelectorAll('.dkpanel').length,copen:[...document.querySelectorAll('#p-calc details[open]')].filter(x=>x.offsetParent).map(x=>x.querySelector('summary').textContent.slice(0,14))})));}
// sheet: reorder & delete
await p.evaluate(()=>window.__favOpen());await p.waitForTimeout(200);await p.screenshot({path:'/home/claude/fv/sheet.png'});
await p.evaluate(()=>{document.querySelector('#fvList [data-d="0"]').click();});await p.evaluate(()=>{document.querySelector('#fvList [data-x="4"]').click();});
console.log('after edit',await p.evaluate(()=>window.__favList()),await p.evaluate(()=>document.querySelector('.favb[data-fav="k:sepsis"]')?.textContent));
// search filter redraw keeps stars
await p.evaluate(()=>{document.getElementById('fvClose').click();showPage('know');const s=document.getElementById('kSearch');s.value='心筋';s.dispatchEvent(new Event('input'));});await p.waitForTimeout(400);
console.log('search',await p.evaluate(()=>[...document.querySelectorAll('#kList .favb')].length+' on:'+document.querySelectorAll('#kList .favb.on').length));
// overflow check
console.log('hscroll',await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
console.log('ERRS',errs);await b.close();})();
