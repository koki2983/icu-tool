const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
const got=[];await p.route(/powerplatform\.com/,async r=>{got.push(JSON.parse(r.request().postData()));r.fulfill({status:202,body:''});});
await p.goto(process.argv[2]+'#review&r=d07',{waitUntil:'load'});await p.waitForTimeout(1800);
console.log('url',await p.evaluate(()=>location.href.split('/').pop()),'| rev',await p.evaluate(()=>document.documentElement.classList.contains('rev')),'| toasts',await p.evaluate(()=>[...document.querySelectorAll('.toast,#toast')].map(x=>x.textContent).join('/')));
await p.evaluate(()=>openTopic('sodium'));await p.waitForTimeout(2800);
await p.evaluate(()=>{const li=[...document.querySelectorAll('#kList details[open] li')].find(l=>l.querySelector(':scope>.rvb')&&l.offsetParent);li.querySelector(':scope>.rvb').click();li.querySelector('.rved textarea').value='記号のテスト';li.querySelector('.rved [data-a="s"]').click();});await p.waitForTimeout(800);
await p.evaluate(()=>window.__reviewOpen());await p.waitForTimeout(300);
console.log('sheet',await p.evaluate(()=>document.getElementById('rvCode').textContent));
const j=got[0];console.log('rv.code',j&&j.rv.code,'| fact',j&&JSON.stringify(j.attachments[0].content.body.find(x=>x.type==='FactSet').facts[1]));
// bad code ignored, reload keeps code
await p.goto(process.argv[2]+'#review&r=<x>',{waitUntil:'load'});await p.waitForTimeout(1500);
console.log('after bad',await p.evaluate(()=>JSON.parse(localStorage.getItem('review')).code));
console.log(errs);await b.close();})();
