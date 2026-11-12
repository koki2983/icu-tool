const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('file:///home/claude/icu-tool/index.html');await p.waitForTimeout(800);
const ids=['exfix','orif'];
fs.writeFileSync('/home/claude/secs5.json',JSON.stringify(await p.evaluate(ids=>ids.map(id=>{const k=KNOW.find(x=>x.t===KID[id]);const m=META[k.t];return [id,k.t,m.cat==='薬剤詳細'?'薬剤（薬剤タブ）':m.cat,k.s.map(s=>s.h).join('／')];}),ids)));await b.close();})();
