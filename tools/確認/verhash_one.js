const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const f='/home/claude/icu-tool/index.html';const b=await chromium.launch();const p=await b.newPage();await p.goto('file://'+f,{waitUntil:'load'});await p.waitForTimeout(1200);
const ids=process.argv.slice(2);const h=await p.evaluate(ids=>Object.fromEntries(ids.map(i=>[i,window.__verHash(i)])),ids);await b.close();
let s=fs.readFileSync(f,'utf8');const m=s.match(/^const VERH=(\{.*\});$/m);const o=JSON.parse(m[1]);Object.assign(o,h);s=s.replace(/^const VERH=\{.*\};$/m,()=>'const VERH='+JSON.stringify(o)+';');fs.writeFileSync(f,s);console.log(h);})();
