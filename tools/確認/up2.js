const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://127.0.0.1:8770/',{waitUntil:'load'});await p.evaluate(()=>navigator.serviceWorker.ready);await p.waitForTimeout(2500);
await p.evaluate(()=>showPage('know'));await p.waitForTimeout(300);
console.log('kRev:',await p.evaluate(()=>document.getElementById('kRev').innerText.slice(0,40)));
// サーバーを更新 → 手動ボタン
let h=fs.readFileSync('/home/claude/srv/index.html','utf8');fs.writeFileSync('/home/claude/srv/index.html',h.replace(/const APP_BUILD='[^']*'/,"const APP_BUILD='TEST-NEW'"));
await Promise.all([p.waitForNavigation({waitUntil:'load'}),p.evaluate(()=>window.__forceUpdate())]);await p.waitForTimeout(800);
console.log('after manual:',await p.evaluate(()=>APP_BUILD));
// サーバーを更新 → 開きっぱなしで focus → バー
h=fs.readFileSync('/home/claude/srv/index.html','utf8');fs.writeFileSync('/home/claude/srv/index.html',h.replace("const APP_BUILD='TEST-NEW'","const APP_BUILD='TEST-NEW2'"));
await p.evaluate(()=>{const o=Date.now;Date.now=()=>o()+70000;window.dispatchEvent(new Event('focus'));});await p.waitForTimeout(2000);
console.log('bar after focus:',await p.evaluate(()=>getComputedStyle(document.getElementById('updBar')).display));
await Promise.all([p.waitForNavigation({waitUntil:'load'}),p.click('#updGo')]);await p.waitForTimeout(600);console.log('after 更新する:',await p.evaluate(()=>APP_BUILD));
console.log('ERRS',errs);await b.close();process.exit(0);})();
