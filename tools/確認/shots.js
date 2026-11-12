const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:802},deviceScaleFactor:3});
await p.goto('file:///home/claude/icu-tool/index.html',{waitUntil:'load'});await p.waitForTimeout(1200);
await p.evaluate(()=>showPage('calc'));await p.waitForTimeout(400);await p.screenshot({path:'/home/claude/kit/s_calc.png'});
await p.evaluate(()=>openTopic('vent_first'));await p.waitForTimeout(900);await p.screenshot({path:'/home/claude/kit/s_know.png'});
await p.evaluate(()=>{showPage('score');window.scrollTo(0,0);});await p.waitForTimeout(500);await p.screenshot({path:'/home/claude/kit/s_score.png'});
await b.close();})();
