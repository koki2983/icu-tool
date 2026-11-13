const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},acceptDownloads:true});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('dialog',d=>d.accept());
const U=process.argv[2];
await p.goto(U,{waitUntil:'load'});await p.waitForTimeout(1500);
console.log('off: btns visible',await p.evaluate(()=>[...document.querySelectorAll('.rvb')].filter(x=>x.offsetParent).length),'fab',await p.evaluate(()=>getComputedStyle(document.getElementById('rvFab')).display));
await p.goto(U+'#review',{waitUntil:'load'});await p.waitForTimeout(1800);
console.log('on',await p.evaluate(()=>({rev:document.documentElement.classList.contains('rev'),page:document.querySelector('.page.on').id,hash:location.hash,fab:document.getElementById('rvFab').textContent})));
await p.evaluate(()=>openTopic('sodium'));await p.waitForTimeout(1200);
console.log('know',await p.evaluate(()=>{const d=document.querySelector('#kList details[open]');return {btns:d.querySelectorAll('.rvb').length,lis:d.querySelectorAll('.body li').length,top:d.querySelectorAll('.rvtop').length};}));
// 指摘 on 3rd li of a section
await p.evaluate(()=>{const d=document.querySelector('#kList details[open]');const hs=[...d.querySelectorAll('h3')];window.__openSec&&hs.forEach(h=>window.__openSec(h));const li=[...d.querySelectorAll('.body li')].filter(x=>x._rv&&x._rv.h)[5];li.querySelector('.rvb').click();li.querySelector('.rved textarea').value='上限は 10 ではなく 8 にしたい（当院）';li.querySelector('[data-a="s"]').click();window.__li=li;li.scrollIntoView({block:'center'});});
await p.waitForTimeout(400);await p.screenshot({path:'/home/claude/fv/rv1.png'});
console.log('item',await p.evaluate(()=>JSON.parse(localStorage.getItem('review')).items.map(i=>[i.id,i.h,i.x.slice(0,30),i.c])));
// drug panel
await p.evaluate(()=>{showPage('drug');window.__drugDetail('nad',null,true);});await p.waitForTimeout(1200);
console.log('drug',await p.evaluate(()=>{const d=document.querySelector('.dkpanel');const li=[...d.querySelectorAll('li')].filter(x=>x._rv)[2];li.querySelector('.rvb').click();li.querySelector('.rved textarea').value='開始量の書き方';li.querySelector('[data-a="s"]').click();d.querySelector('.rvtop [data-ok]');return {btns:d.querySelectorAll('.rvb').length,w:li._rv.id+'|'+li._rv.h};}));
await p.evaluate(()=>{showPage('know');openTopic('abg');});await p.waitForTimeout(1200);
await p.evaluate(()=>document.querySelector('#kList details[open] .rvtop [data-ok]').click());
// reload: persistence & highlight
await p.reload({waitUntil:'load'});await p.waitForTimeout(1500);await p.evaluate(()=>openTopic('sodium'));await p.waitForTimeout(1500);
console.log('after reload',await p.evaluate(()=>({rev:document.documentElement.classList.contains('rev'),hit:document.querySelectorAll('li.rvhit').length,fab:document.getElementById('rvFab').textContent})));
await p.evaluate(()=>{document.getElementById('rvFab').click();document.getElementById('rvWho').value='麻酔科 テスト';document.getElementById('rvWho').dispatchEvent(new Event('input'));});await p.waitForTimeout(300);await p.screenshot({path:'/home/claude/fv/rv2.png'});
console.log(await p.evaluate(()=>window.__reviewText()));
const [dl]=await Promise.all([p.waitForEvent('download'),p.evaluate(()=>document.getElementById('rvFile').click())]);console.log('file',dl.suggestedFilename());
await p.evaluate(()=>document.getElementById('rvEnd').click());await p.waitForTimeout(300);
console.log('ended',await p.evaluate(()=>({rev:document.documentElement.classList.contains('rev'),vis:[...document.querySelectorAll('.rvb,.rvtop,.rvnote')].filter(x=>x.offsetParent).length})));
console.log('hscroll',await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),errs);await b.close();})();
