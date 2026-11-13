const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(process.argv[2]+'#k=tolvaptan',{waitUntil:'load'});await p.waitForTimeout(1800);
const t=await p.evaluate(()=>{const pn=document.querySelector('.dkpanel');pn.querySelectorAll('.secb').forEach(x=>x.style.display='');return pn.innerText;});
const bad=t.split('\n').filter(l=>/）（|（サムスカ）（|トルバプタン（サムスカ）リン酸|サムスカ（トルバプタン）（/.test(l));
console.log('len',t.length,'BAD',bad);
console.log(t.split('\n').filter(l=>/サムタス|トルバプタン/.test(l)).slice(0,14).join('\n').slice(0,1800));
console.log('ver',await p.evaluate(()=>document.querySelector('.dkpanel .verline')?.innerText));
console.log('list',await p.evaluate(()=>[...document.querySelectorAll('#drugList .item .t')].map(x=>x.innerText).filter(x=>/サム/.test(x))));
// compat
await p.evaluate(()=>{showPage&&showPage('calc');});await p.waitForTimeout(300);
console.log(await p.evaluate(()=>{const A=document.getElementById('cpA'),B=document.getElementById('cpB');const f=(s,n)=>{const o=[...s.options].find(o=>o.text.startsWith(n));s.value=o.value;s.onchange();};const out=[];
 f(A,'トルバプタン');out.push(document.getElementById('cpRes').textContent+' // '+document.getElementById('cpList').textContent);
 for(const n of['ドブタミン','ロクロニウム','フロセミド','ノルアドレナリン','セフトリアキソン']){f(B,n);out.push(n+': '+document.getElementById('cpRes').textContent.replace(/\n/g,' | ').slice(0,90));}
 return out.join('\n');}));
console.log('ERRS',errs);await b.close();})();
