// ex.js と同じ中身を、Playwright なしで（jsdom で）書き出す。使い方： node ex2.js index.html out.json
const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');
const html=fs.readFileSync(process.argv[2],'utf8');const vc=new VirtualConsole();const errs=[];vc.on('jsdomError',e=>errs.push(String(e.message||e)));
const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'https://koki2983.github.io/icu-tool/',virtualConsole:vc});
setTimeout(()=>{const w=dom.window;
const data=w.eval(`Object.keys(KID).map(id=>{const k=KNOW.find(x=>x.t===KID[id]);if(!k)return null;const m=META[k.t]||{};return {id,t:k.t,cat:m.cat,hosp:!!m.hosp,key:m.key||[],lv:(typeof VER!=='undefined'&&VER[id]?VER[id][0]:0),s:k.s.map(s=>({h:s.h,b:s.b}))};}).filter(Boolean)`);
const extra=w.eval(`({build:APP_BUILD,gloss:(typeof GLOSS!=='undefined'?GLOSS.length:0),nver:Object.keys(VER).filter(i=>(VER[i][0]||0)>=1).length,nkid:Object.keys(KID).length})`);
fs.writeFileSync(process.argv[3],JSON.stringify({extra,data}));console.log('errs',errs.length,data.length,JSON.stringify(extra));process.exit(0)},1500);
