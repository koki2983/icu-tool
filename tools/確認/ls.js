const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('file:///home/claude/icu-tool/index.html');await p.waitForTimeout(800);
console.log(await p.evaluate(()=>Object.keys(KID).map(id=>{const k=KNOW.find(x=>x.t===KID[id]);if(!k)return id+' ?';const m=META[k.t]||{};const sf=new Set(Object.keys(m.secfig||{}).map(Number));return id+'｜'+(m.cat||'').slice(0,5)+'｜'+(k.fig?'F':'-')+'｜'+k.s.map((s,i)=>i+(s.f||sf.has(i)?'*':'')+(s.h||'').slice(0,12)).join('/');}).join('\n')));await b.close();})();
