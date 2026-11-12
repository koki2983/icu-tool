const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/claude/icu-tool/index.html');await p.waitForTimeout(800);
await p.evaluate(()=>showPage('know'));await p.waitForTimeout(300);
const before=await p.evaluate(()=>{document.querySelectorAll('#kList details').forEach(d=>d.open=true);return document.querySelectorAll('#kList details').length;});
await p.waitForTimeout(1500);
const t0=Date.now();
const res=await p.evaluate(()=>{const G=window.__drugPairs;const out={};const samples=[];
  document.querySelectorAll('#kList li, #kList td, #kList summary, #kList h3').forEach(el=>{const t=el.textContent;
    G.forEach(x=>{[x.g+'（'+x.d, ...x.bs.map(b=>b+'（'+x.g)].forEach(s=>{if(t.includes(s)){out[s]=(out[s]||0)+1;if(samples.length<400&&Math.random()<0.08)samples.push(t.slice(Math.max(0,t.indexOf(s)-12),t.indexOf(s)+s.length+14));}});});});
  const odd=[];document.querySelectorAll('#kList li,#kList td').forEach(el=>{const t=el.textContent;if(/）（|（[^）]{0,30}（[^）]*）[^）]{0,30}）/.test(t)){const m=t.match(/.{0,25}(）（|（[^）]{0,30}（).{0,30}/);if(m)odd.push(m[0]);}});
  return {n:Object.keys(out).length,tot:Object.values(out).reduce((a,b)=>a+b,0),out,samples:samples.slice(0,45),odd:[...new Set(odd)].slice(0,60)};});
console.log('topics',before,'kinds',res.n,'total',res.tot);console.log(res.samples.join('\n'));console.log('--ODD');console.log(res.odd.join('\n'));
// search
for(const q of ['ソルコーテフ','ソル・コーテフ','ボスミン','ラシックス']){await p.fill('#kSearch',q);await p.dispatchEvent('#kSearch','input');await p.waitForTimeout(400);console.log(q,await p.evaluate(()=>document.querySelectorAll('#kList details').length));}
await p.fill('#kSearch','');await p.dispatchEvent('#kSearch','input');
// steroid
await p.evaluate(()=>{openCalc('steroid');window.__stCalc('psl',10,'long','major');});await p.waitForTimeout(500);
console.log(await p.evaluate(()=>document.getElementById('stCover').innerText.slice(0,200)));console.log(await p.evaluate(()=>document.getElementById('stSub').innerText));
await p.evaluate(()=>showPage('drug'));await p.waitForTimeout(500);console.log(await p.evaluate(()=>[...document.querySelectorAll('#drugList .item .t')].map(x=>x.innerText.replace(/\n/g,' ')).join(' | ')));
await p.evaluate(()=>showPage('gloss'));await p.waitForTimeout(800);console.log(await p.evaluate(()=>[...document.querySelectorAll('#gList .gitem')].filter(x=>/ヒドロコルチゾン|フサン|ボスミン/.test(x.innerText)).slice(0,5).map(x=>x.innerText.slice(0,90).replace(/\n/g,' ')).join('\n')));
console.log('ERR',errs);await b.close();})();
