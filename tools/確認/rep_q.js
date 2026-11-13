const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];
for(const id of ['abg','nad','avr','tolvaptan']){const p=await b.newPage({viewport:{width:390,height:844}});p.on('pageerror',e=>errs.push(e.message));
await p.goto(process.argv[2]+'#k='+id,{waitUntil:'load'});await p.waitForTimeout(1700);
console.log(id,await p.evaluate(()=>{const q=[...document.querySelectorAll('.quickrep')].filter(x=>x.offsetParent);return q.length+' | '+(q[0]?q[0].innerText.slice(0,70):'')}));await p.close();}
const p=await b.newPage({viewport:{width:390,height:844}});await p.goto(process.argv[2],{waitUntil:'load'});await p.waitForTimeout(800);
console.log('list rows',await p.evaluate(()=>{window.__reportListOpen();return document.querySelectorAll('#rpSheet li, #rpSheet .rprow, #rpSheet .item').length+' / '+document.getElementById('rpSheet').innerText.length}));
console.log(errs);await b.close();})();
