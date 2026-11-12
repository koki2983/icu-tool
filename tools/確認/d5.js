const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const errs=[];const U=process.argv[2];
const ids=[];
const dids=['tazopipe','vancomycin','magnesium','diltiazem'];
const ovf=`(svg)=>{if(!svg)return['NOFIG'];const vb=svg.viewBox.baseVal;const rects=[...svg.querySelectorAll('rect')].map(r=>r.getBBox());return [...svg.querySelectorAll('text')].filter(t=>{const bb=t.getBBox();if(bb.x<vb.x+1||bb.x+bb.width>vb.x+vb.width-1)return true;const cx=bb.x+bb.width/2,cy=bb.y+bb.height/2;const r=rects.filter(r=>r.width<vb.width-4&&cx>r.x&&cx<r.x+r.width&&cy>r.y&&cy<r.y+r.height).sort((a,b)=>a.width-b.width)[0];return r&&(bb.x<r.x+1||bb.x+bb.width>r.x+r.width-1);}).map(t=>t.textContent)}`;
for(const id of ids){const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});p.on('pageerror',e=>errs.push(id+' '+e.message));
  await p.goto(U+'#k='+id,{waitUntil:'load'});await p.waitForTimeout(1400);
  console.log(id,await p.evaluate(()=>{const d=[...document.querySelectorAll('#kList details[open]')].pop();return d?d.querySelector('summary').innerText.replace(/\n/g,' ').slice(0,40)+' | secs '+d.querySelectorAll('h3').length+' li '+d.querySelectorAll('li').length:'NONE'}));
  const ov=await p.evaluate(`(${ovf})([...document.querySelectorAll('#kList details[open]')].pop().querySelector('svg'))`);if(ov.length)console.log('  OVERFLOW',ov);
  const hs=await p.$$('#kList details[open]');const s=await hs[hs.length-1].$('svg');if(s)await s.screenshot({path:'/home/claude/x_'+id+'.png'});await p.close();}
for(const id of dids){const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});p.on('pageerror',e=>errs.push(id+' '+e.message));
  await p.goto(U+'#k='+id,{waitUntil:'load'});await p.waitForTimeout(1600);
  const r=await p.evaluate(`(()=>{const pn=document.querySelector('.dkpanel');if(!pn)return {t:'NOPANEL '+document.querySelector('nav button.on')?.textContent};const svg=pn.querySelector('svg');return {t:pn.previousElementSibling.querySelector('.t').innerText.replace(/\\n/g,' ')+' | h3 '+pn.querySelectorAll('h3').length,ov:(${ovf})(svg)};})()`);
  console.log(id,r.t);if(r.ov&&r.ov.length)console.log('  OVERFLOW',r.ov);
  const s=await p.$('.dkpanel svg');if(s)await s.screenshot({path:'/home/claude/x_'+id+'.png'});await p.close();}
const p=await b.newPage({viewport:{width:390,height:844}});p.on('pageerror',e=>errs.push(e.message));await p.goto(U,{waitUntil:'load'});await p.waitForTimeout(800);
console.log('KNOW',await p.evaluate(()=>KNOW.length),'mono',await p.evaluate(()=>KNOW.filter(k=>(META[k.t]||{}).cat==='薬剤詳細').length),'GLOSS',await p.evaluate(()=>GLOSS.length),'orphans',await p.evaluate(()=>KNOW.filter(k=>!CATS.includes((META[k.t]||{}).cat)&&(META[k.t]||{}).cat!=='薬剤詳細').map(k=>k.t)));
console.log(await p.evaluate(()=>['消化器外科','消化器内科','脳神経外科','整形外科','救急・集中治療','全身管理'].map(c=>c+': '+ORDER[c].join(' / ')).join('\n')));
console.log('badlinks',await p.evaluate(()=>{const bad=[];GLOSS.forEach(g=>{if(g[3]&&!KNOW.some(k=>k.t===g[3]))bad.push(g[0]+'→'+g[3]);});return bad;}));
fs.writeFileSync('/home/claude/idcat.json',JSON.stringify(await p.evaluate(()=>{const o={};Object.keys(KID).forEach(id=>{const m=META[KID[id]]||{};o[id]=[KID[id],m.cat+(m.hosp?'・当院':'')];});return o;})));
console.log('ERRS',errs);await b.close();})();
