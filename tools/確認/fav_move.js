const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const U=process.argv[2];
const c1=await b.newContext({viewport:{width:390,height:844},acceptDownloads:true});const p=await c1.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(U,{waitUntil:'load'});await p.waitForTimeout(1500);
await p.evaluate(()=>showPage('gloss'));await p.waitForTimeout(400);
console.log('gloss stars',await p.evaluate(()=>document.querySelectorAll('#gList .favb').length),await p.evaluate(()=>GLOSS.length));
await p.evaluate(()=>{document.querySelector('.favb[data-fav="g:PEEP"]').click();showPage('know');});await p.waitForTimeout(300);
await p.evaluate(()=>{document.querySelector('.favb[data-fav="k:ami"]').click();localStorage.setItem('kmemo',JSON.stringify({'k:敗血症':'当院の目標 MAP 65'}));localStorage.setItem('fs','2');localStorage.setItem('ivsheet',JSON.stringify({bed:'3'}));});
await p.evaluate(()=>document.querySelector('#favBar [data-f="g:PEEP"]').click());await p.waitForTimeout(400);
console.log('open gloss',await p.evaluate(()=>({page:document.querySelector('.page.on').id,q:document.getElementById('gSearch').value,n:document.querySelectorAll('#gList .gitem').length})));
await p.screenshot({path:'/home/claude/fv/gloss.png'});
await p.evaluate(()=>window.__favOpen());
const [dl]=await Promise.all([p.waitForEvent('download'),p.evaluate(()=>document.getElementById('fvExp').click())]);
const path='/home/claude/fv/move.json';await dl.saveAs(path);console.log('file',dl.suggestedFilename(),fs.statSync(path).size,Object.keys(JSON.parse(fs.readFileSync(path,'utf8')).data),await p.evaluate(()=>document.getElementById('fvMsg').textContent));
await p.screenshot({path:'/home/claude/fv/move.png',fullPage:false});
// new device
const c2=await b.newContext({viewport:{width:390,height:844}});const q=await c2.newPage();q.on('pageerror',e=>errs.push(e.message));q.on('dialog',d=>d.accept());
await q.goto(U,{waitUntil:'load'});await q.waitForTimeout(1500);
console.log('new device before',await q.evaluate(()=>window.__favList()));
await q.evaluate(()=>window.__favOpen());await q.setInputFiles('#fvFile',path);await q.waitForTimeout(2600);
console.log('new device after',await q.evaluate(()=>({fav:window.__favList(),memo:localStorage.getItem('kmemo'),fs:localStorage.getItem('fs'),iv:localStorage.getItem('ivsheet'),bar:[...document.querySelectorAll('#favBar .fvc')].map(x=>x.textContent)})));
// bad file
fs.writeFileSync('/home/claude/fv/bad.json','{"x":1}');await q.evaluate(()=>window.__favOpen());await q.setInputFiles('#fvFile','/home/claude/fv/bad.json');await q.waitForTimeout(400);
console.log('bad',await q.evaluate(()=>document.getElementById('fvMsg').textContent));
console.log(errs);await b.close();})();
