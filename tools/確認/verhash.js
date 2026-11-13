// 確認の印（VER）が付いている項目の、今の本文の指紋を出す。
// 使い方： node tools/確認/verhash.js            … 指紋と、変わった項目の一覧を出すだけ
//          node tools/確認/verhash.js --write    … index.html の VERH を今の指紋で書きかえる
// --write は、確認の印を付けた・付け直したときだけ使う。理由：ふだんの直しで使うと、「確認のあとに直した」ことが画面から消えるから。
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
(async()=>{const f=path.join(__dirname,'..','..','index.html');const b=await chromium.launch();const p=await b.newPage();
await p.goto('file://'+f,{waitUntil:'load'});await p.waitForTimeout(1200);
const r=await p.evaluate(()=>{const o={},chg=[];Object.keys(window.VER||{}).forEach(id=>{if((VER[id][0]||0)>=1&&KID[id]){o[id]=window.__verHash(id);if(window.__verChanged(id))chg.push(id);}});return {o,chg};});
await b.close();
console.log('印のある項目',Object.keys(r.o).length,'／確認のあとに変わっている項目',r.chg.length,r.chg.join(' '));
if(process.argv.includes('--write')){let s=fs.readFileSync(f,'utf8');const line='const VERH='+JSON.stringify(r.o)+';';
  const n=(s.match(/^const VERH=\{.*\};$/m)||[]).length;if(n!==1){console.log('VERH の行が見つかりません');process.exit(1);}
  s=s.replace(/^const VERH=\{.*\};$/m,()=>line);fs.writeFileSync(f,s);console.log('VERH を書きかえました');}
})();
