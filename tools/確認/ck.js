const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const e=[];p.on('pageerror',x=>e.push(x.message));
await p.goto('https://koki2983.github.io/icu-tool/#p=check');await p.waitForTimeout(2500);
console.log(JSON.stringify(await p.evaluate(()=>({n:CHECK.length,bad:CHECK.flatMap(c=>(c.k||[]).map(x=>x.split('#')[0]).filter(id=>!KID[id])),badc:CHECK.flatMap(c=>(c.c||[]).filter(id=>!CALC_ID[id])),page:[...document.querySelectorAll('.page')].filter(x=>x.offsetParent).map(x=>x.id)}))),e);await b.close();})();
