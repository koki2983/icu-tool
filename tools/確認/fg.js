const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(process.argv[2]||'file:///home/claude/icu-tool/index.html');await p.waitForTimeout(900);
const info=await p.evaluate(()=>{const out=[];Object.keys(FIG).filter(k=>k.startsWith('pf_')).forEach(k=>{const m=k.match(/^pf_(.*)_(\d+)$/);const t=KID[m[1]];const kn=KNOW.find(x=>x.t===t);out.push([k,m[1],kn.s[+m[2]].h]);});return out;});
console.log('count',info.length);console.log(info.map(x=>x[1]+':'+x[2]).join(' | '));
// 図を 1 枚のページに並べて、はみ出しを調べる
const res=await p.evaluate(()=>{const host=document.createElement('div');host.id='figtest';host.style.cssText='position:absolute;left:0;top:0;width:358px;background:#fff;z-index:99';document.body.appendChild(host);
  const bad=[];Object.keys(FIG).filter(k=>k.startsWith('pf_')).forEach(k=>{const d=document.createElement('div');d.className='fig';d.dataset.k=k;d.innerHTML=FIG[k];host.appendChild(d);
    const svg=d.querySelector('svg');const vb=svg.viewBox.baseVal;const rects=[...svg.querySelectorAll('rect')].map(r=>r.getBBox());
    svg.querySelectorAll('text').forEach(t=>{const bb=t.getBBox();if(bb.x<1||bb.x+bb.width>vb.width-1){bad.push(k+' EDGE '+t.textContent);return;}
      const cx=bb.x+bb.width/2,cy=bb.y+bb.height/2;const r=rects.filter(r=>r.width<vb.width-14&&r.height>12&&cx>r.x&&cx<r.x+r.width&&cy>r.y&&cy<r.y+r.height).sort((a,b)=>a.width-b.width)[0];
      if(r&&(bb.x<r.x+1.5||bb.x+bb.width>r.x+r.width-1.5))bad.push(k+' BOX '+t.textContent);});});return bad;});
console.log('OVERFLOW',res.length);console.log(res.join('\n'));
const els=await p.$$('#figtest .fig');let i=0;for(const e of els){const k=await e.getAttribute('data-k');await e.screenshot({path:'/home/claude/pf/'+String(i++).padStart(2,'0')+'_'+k+'.png'});}
console.log('ERR',errs);await b.close();})();
