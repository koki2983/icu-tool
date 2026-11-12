const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('file:///home/claude/icu-tool/index.html');await p.waitForTimeout(900);
const data=await p.evaluate(()=>Object.keys(KID).map(id=>{const k=KNOW.find(x=>x.t===KID[id]);if(!k)return null;const m=META[k.t]||{};return {id,t:k.t,cat:m.cat,hosp:!!m.hosp,key:m.key||[],s:k.s.map(s=>({h:s.h,b:s.b}))};}).filter(Boolean));
fs.writeFileSync('/home/claude/all.json',JSON.stringify(data));console.log(data.length);await b.close();})();
