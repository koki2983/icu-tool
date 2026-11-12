/* ===== 病態関連図と、時期の図（2026-11-13） =====
   目的：文字だけでは流れがつかみにくい項目に、「原因 → 体の中で起きること → 症状 → 看護・治療」のつながりと、
         「いつ、何が起きやすいか」を、図で見せる。
   P(題, 段[]) ＝病態関連図。段は上から下へ流れる。箱は '種類:文' で書く。種類は c＝原因・きっかけ、m＝体の中で起きること、s＝症状・所見、n＝看護・治療。
     文は箱の幅で自動的に折り返す。'|' で強制的に改行。段と段の間の矢印は自動（同じ数なら 1 対 1、1 つなら全部へ・全部から）。
   TL(題, 列の名前[], 行[[名前, 始まりの列, 終わりの列, 種類]], 注)＝時期の図。種類は r＝命にかかわる、y＝注意、b＝そのほか。
   SF(固定 ID, 見出しの番号, 図)＝その見出しの下に図を出す。すでに図がある見出しには足さない。 */
(function(){
const W=340,M=6,GAP=6,FS=8.3,LH=10.8;
const cw=c=>/[ -~]/.test(c)?0.56:(/[₀-₉⁰-⁹]/.test(c)?0.5:1);
const tw=(s,z)=>[...s].reduce((a,c)=>a+cw(c),0)*(z||FS);
const greedy=(part,maxw,z)=>{const out=[];let cur='';[...part].forEach(c=>{
  if(cur&&tw(cur+c,z)>maxw){if('、。）」'.includes(c)){cur+=c;return;}out.push(cur);cur=c;}else cur+=c;});if(cur)out.push(cur);return out;};
/* 折り返したとき、最後の行に 1〜2 文字だけ残らないよう、行の長さをそろえる */
const wrap=(s,maxw,z)=>{const out=[];String(s).split('|').forEach(part=>{let ls=greedy(part,maxw,z);
  if(ls.length>1){const n=ls.length;for(let t=tw(part,z)/n+(z||FS)*0.5;t<maxw;t+=(z||FS)*0.5){const l2=greedy(part,t,z);if(l2.length<=n){ls=l2;break;}}}
  ls.forEach(l=>out.push(l));});return out;};
const E=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const COL={c:['#E8F1FA','#3B8BD0','#1E3A5F'],m:['#FFF7E6','#E0A030','#5E4300'],s:['#FDECEA','#C0392B','#8E2A20'],n:['#E6F4EA','#2E7D32','#1B5E20']};
const LEG=[['c','原因・きっかけ'],['m','体の中で起きること'],['s','症状・所見'],['n','看護・治療']];
const P=(ttl,rows,links)=>{links=links||{};
  let y=24;const pos=[];let body='';
  rows.forEach((row,ri)=>{const n=row.length,w=(W-2*M-(n-1)*GAP)/n;
    const cells=row.map(t=>{const k=t[1]===':'?t[0]:'m';const txt=t[1]===':'?t.slice(2):t;return {k,lines:wrap(txt,w-9)};});
    const h=Math.max(...cells.map(c=>c.lines.length))*LH+9;
    pos.push(cells.map((c,i)=>({x:M+i*(w+GAP),w,y,h})));
    cells.forEach((c,i)=>{const x=M+i*(w+GAP),col=COL[c.k]||COL.m;const ty=y+(h-c.lines.length*LH)/2+LH-2.6;
      body+=`<rect x="${x.toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="5" fill="${col[0]}" stroke="${col[1]}" stroke-width="1.3"/>`
        +c.lines.map((l,j)=>`<text x="${(x+w/2).toFixed(1)}" y="${(ty+j*LH).toFixed(1)}" text-anchor="middle" fill="${col[2]}"${j===0&&c.lines.length>1?'':''}>${E(l)}</text>`).join('');});
    y+=h+15;});
  let ar='';
  for(let i=0;i<rows.length-1;i++){const a=pos[i],b=pos[i+1];let pr=[];
    if(links[i])pr=links[i].split(',').map(s=>s.split('>').map(Number));
    else if(a.length===b.length)pr=a.map((_,j)=>[j,j]);
    else if(a.length===1)pr=b.map((_,j)=>[0,j]);
    else if(b.length===1)pr=a.map((_,j)=>[j,0]);
    else{const set=new Set();b.forEach((_,j)=>set.add(Math.min(a.length-1,Math.floor(j*a.length/b.length))+'>'+j));a.forEach((_,j)=>set.add(j+'>'+Math.min(b.length-1,Math.floor(j*b.length/a.length))));pr=[...set].map(s=>s.split('>').map(Number));}
    pr.forEach(([f,t])=>{const s=a[f],d=b[t];if(!s||!d)return;const x1=s.x+s.w/2,x2=d.x+d.w/2;
      /* 斜めの線が長くなりすぎないよう、出発点と到着点を相手のほうへ少し寄せる */
      const sx=x1+Math.max(-s.w*0.3,Math.min(s.w*0.3,(x2-x1)*0.35)),dx=x2-Math.max(-d.w*0.3,Math.min(d.w*0.3,(x2-x1)*0.35));
      ar+=`<path d="M${sx.toFixed(1)} ${(s.y+s.h).toFixed(1)} L${dx.toFixed(1)} ${(d.y-2).toFixed(1)}" stroke="#6B7A80" stroke-width="1.1" fill="none" marker-end="url(#pfa)"/>`;});}
  const ly=y-4;let lx=M,leg='';
  LEG.forEach(([k,t])=>{leg+=`<rect x="${lx}" y="${ly}" width="9" height="9" rx="2" fill="${COL[k][0]}" stroke="${COL[k][1]}"/><text x="${lx+12}" y="${ly+7.6}" font-size="7.4" fill="#55666e">${t}</text>`;lx+=14+tw(t,7.4)+8;});
  const H=ly+16;
  return `<svg viewBox="0 0 ${W} ${H.toFixed(0)}" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="${FS}"><defs><marker id="pfa" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5.5" markerHeight="5.5" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#6B7A80"/></marker></defs>`
    +`<text x="170" y="14" text-anchor="middle" font-size="10.5" font-weight="700" fill="#1F2A30">${E(ttl)}</text>`+ar+body+leg+`</svg>`;};
const TC={r:['#E57368','#C0392B'],y:['#F0C060','#B37A00'],b:['#7FB2E0','#2F6FB0'],g:['#8CCB9A','#2E7D32']};
const TL=(ttl,cols,rows,note)=>{const x0=116,gw=W-M-x0,c=gw/cols.length,y0=40,rh=17;let s='';
  cols.forEach((t,i)=>{s+=`<text x="${(x0+i*c+c/2).toFixed(1)}" y="33" text-anchor="middle" font-size="7.3" fill="#55666e">${E(t)}</text>`;
    s+=`<path d="M${(x0+i*c).toFixed(1)} 37 V${y0+rows.length*rh}" stroke="#DCE4E8" stroke-width="1"/>`;});
  s+=`<path d="M${x0+gw} 37 V${y0+rows.length*rh}" stroke="#DCE4E8" stroke-width="1"/>`;
  rows.forEach((r,i)=>{const y=y0+i*rh,col=TC[r[3]||'y'];
    if(i%2===0)s+=`<rect x="${M}" y="${y}" width="${W-2*M}" height="${rh}" fill="#F6F9FA"/>`;
    s+=`<text x="${x0-5}" y="${y+11.6}" text-anchor="end" font-size="8" fill="#1F2A30">${E(r[0])}</text>`;
    s+=`<rect x="${(x0+r[1]*c+1.5).toFixed(1)}" y="${y+3.5}" width="${((r[2]-r[1]+1)*c-3).toFixed(1)}" height="${rh-7}" rx="4" fill="${col[0]}" stroke="${col[1]}" stroke-width="1"/>`;});
  let y=y0+rows.length*rh+12;let lx=M;
  [['r','命にかかわる'],['y','よく起きる・注意'],['b','そのほか']].forEach(([k,t])=>{s+=`<rect x="${lx}" y="${y-8}" width="14" height="8" rx="3" fill="${TC[k][0]}" stroke="${TC[k][1]}"/><text x="${lx+18}" y="${y-1}" font-size="7.4" fill="#55666e">${t}</text>`;lx+=22+tw(t,7.4)+8;});
  if(note){wrap(note,W-2*M-4,7.8).forEach(l=>{y+=11;s+=`<text x="${M+2}" y="${y}" font-size="7.8" fill="#8A4B00">${E(l)}</text>`;});}
  return `<svg viewBox="0 0 ${W} ${y+8}" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="8">`
    +`<text x="170" y="14" text-anchor="middle" font-size="10.5" font-weight="700" fill="#1F2A30">${E(ttl)}</text>`+s+`</svg>`;};
let nf=0;
const SF=(id,idx,svg)=>{const t=KID[id];const k=t&&KNOW.find(x=>x.t===t);if(!k||!k.s[idx])return;const m=META[t]||{};
  if(k.s[idx].f||(m.secfig&&m.secfig[idx]!=null))return;const key='pf_'+id+'_'+idx;FIG[key]=svg;k.s[idx].f=key;nf++;};
window.__pfig=P;window.__tfig=TL;window.__secfig=SF;
window.__figCount=()=>nf;
/*FIGSPECS*/
})();
