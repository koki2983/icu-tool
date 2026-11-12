const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));
const U=process.argv[2]||'file:///home/claude/icu-tool/index.html';
await p.goto(U+'#k=peritonitis');await p.waitForTimeout(1800);
console.log(await p.evaluate(()=>{const d=[...document.querySelectorAll('#kList details[open]')].pop();return {sech:d.querySelectorAll('h3.sech').length,open:d.querySelectorAll('h3.sech.open').length,visUl:[...d.querySelectorAll('.body>ul')].filter(u=>u.offsetParent).length,quick:d.querySelector('.quickrep')?.innerText.slice(0,40),figsVis:[...d.querySelectorAll('.fig')].filter(u=>u.offsetParent).length}}));
await p.evaluate(()=>{const d=[...document.querySelectorAll('#kList details[open]')].pop();d.querySelector('summary').scrollIntoView();window.scrollBy(0,-60)});await p.waitForTimeout(300);await p.screenshot({path:'f1a.png',fullPage:false});
// 見出しを押す
await p.evaluate(()=>{const d=[...document.querySelectorAll('#kList details[open]')].pop();d.querySelectorAll('h3.sech')[1].click()});await p.waitForTimeout(200);
console.log('after click',await p.evaluate(()=>{const d=[...document.querySelectorAll('#kList details[open]')].pop();return [...d.querySelectorAll('.body>ul')].filter(u=>u.offsetParent).length}));
// 見出しつきの直接リンク
const p2=await b.newPage({viewport:{width:390,height:844}});p2.on('pageerror',e=>errs.push(e.message));await p2.goto(U+'#k=peritonitis&s='+encodeURIComponent('ICU での看護'));await p2.waitForTimeout(2000);
console.log('deeplink',await p2.evaluate(()=>{const d=[...document.querySelectorAll('#kList details[open]')].pop();return [...d.querySelectorAll('h3.sech.open')].map(h=>h.textContent)}));
// すぐ報告の一覧
await p2.evaluate(()=>window.__reportListOpen());await p2.waitForTimeout(300);console.log('rows',await p2.evaluate(()=>document.querySelectorAll('#rpList .rpi').length));
await p2.fill('#rpQ','尿量');await p2.waitForTimeout(300);console.log('尿量',await p2.evaluate(()=>document.querySelectorAll('#rpList .rpi').length));await p2.screenshot({path:'f1b.png'});
await p2.click('#rpList .rpi button');await p2.waitForTimeout(1200);
// 利用の記録
await p2.evaluate(()=>{showPage('drug');window.__drugDetail('vancomycin',null,true);window.__usageOpen();});await p2.waitForTimeout(500);console.log(await p2.evaluate(()=>document.getElementById('usTxt').value));
console.log('ERR',errs);await b.close();})();
