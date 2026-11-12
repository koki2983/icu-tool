/* ===== 照合の印と、最近追加した項目（2026-11-13） =====
   目的：読む人が、その項目をどこまで信用してよいかを、画面で判断できるようにする。
   段階は 3 つ。0＝原本と未照合（AI の知識から書いたまま）／1＝AI が原本と照合（ウェブ上の添付文書・ガイドラインと主な数字を見比べた。専門家の確認ではない）／2＝専門家が確認。
   書き方：VER[固定 ID]=[段階,'日付','何と見比べたか・誰が見たか']。書いていない項目は 0。
   専門家に見てもらったら、ここに 2 と職種・日付を書く（個人名は書かない）。 */
(function(){
  const VER=window.VER=window.VER||{};
  const LV=[['原本と未照合','#6B7A80','#EEF1F3','AI の知識から書いたままです。数字は、添付文書・当院の基準で確かめてから使ってください'],
            ['AI が原本と照合','#2F6FB0','#E3EEF9','主な数字を、ウェブ上の添付文書・ガイドラインと見比べました。専門家の確認はまだです'],
            ['専門家が確認','#2E7D32','#E6F4EA','当院の専門職が内容を確認しました']];
  const st=document.createElement('style');st.textContent=`
.verline{font-size:11.5px;line-height:1.5;margin:8px 0 2px;padding:6px 9px;border-radius:8px;background:var(--vs);color:#333;border-left:4px solid var(--vc)}
.verline b{color:var(--vc)}
.vdot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-left:6px;vertical-align:middle;background:var(--vc);opacity:.85}
.vdot.v0{background:transparent;border:1.5px solid #9AA7AD}
#kNew .drc{font-size:12.5px}#kNew .nd{font-size:11px;color:#6B7A80;margin:2px 0 4px}
`;document.head.appendChild(st);
  const get=title=>{const id=KID_R[title];const v=id&&VER[id];return v||[0,'',''];};
  window.__verOf=get;
  const line=title=>{const v=get(title),L=LV[v[0]]||LV[0];
    return `<div class="verline" data-nopair="1" style="--vc:${L[1]};--vs:${L[2]}"><b>${L[0]}</b>${v[1]?'（'+esc(v[1])+'）':''}　${esc(v[2]||L[3])}</div>`;};
  const sweep=()=>{
    document.querySelectorAll('#kList details[data-key]>.body:not([data-ver])').forEach(b=>{b.dataset.ver=1;const t=b.parentElement.dataset.key.slice(2);if(!KID_R[t])return;
      const kb=b.querySelector('.keybox');(kb||b).insertAdjacentHTML(kb?'afterend':'afterbegin',line(t));});
    document.querySelectorAll('.dkpanel>.body:not([data-ver])').forEach(b=>{b.dataset.ver=1;const r=b.querySelector('[data-rep]');const t=r&&r.dataset.rep;if(!t||!KID_R[t])return;
      const kb=b.querySelector('.keybox');(kb||b).insertAdjacentHTML(kb?'afterend':'afterbegin',line(t));});
    document.querySelectorAll('#kList details[data-key]>summary:not([data-vd])').forEach(s=>{s.dataset.vd=1;const t=s.parentElement.dataset.key.slice(2);if(!KID_R[t])return;
      const v=get(t),L=LV[v[0]]||LV[0];const d=document.createElement('span');d.className='vdot v'+v[0];d.style.setProperty('--vc',L[1]);d.title=L[0];s.appendChild(d);});
  };
  let tm=null;new MutationObserver(()=>{if(tm)return;tm=setTimeout(()=>{tm=null;try{sweep();}catch(e){}},60);}).observe(document.body,{childList:true,subtree:true});
  /* 最近追加した項目：新しい順に、日付ごと。RECENT に足すだけで出る */
  const RECENT=window.RECENT=[
   ['2026-11-13',['exfix','orif','abd_trauma','meropenem','tazopipe','vancomycin','ali','upper_airway']],
   ['2026-11-12',['bowel_ischemia','peritonitis','iah','cholangitis','hepatectomy','craniotomy','sodium','nsti','pics','hip_fx','diltiazem','nicorandil','osmotic','magnesium']]
  ];
  const box=$('kNew');
  if(box){const day=RECENT[0];const short=t=>t.replace(/^薬剤各論：/,'').replace(/（.*?）/g,'');
    const chips=l=>l.filter(id=>KID[id]).map(id=>`<button type="button" class="drc" data-new="${id}">${esc(short(KID[id]))}</button>`).join('');
    box.innerHTML=`<details style="margin:0 0 10px"><summary style="cursor:pointer;font-size:13px"><b style="color:var(--brand,#0F6E7C)">最近追加した項目</b> <span class="muted">（${esc(day[0])}：${day[1].filter(id=>KID[id]).length} 件）</span></summary>`
      +RECENT.map(d=>`<div class="nd" style="margin-top:6px">${esc(d[0])}</div><div class="drchips">${chips(d[1])}</div>`).join('')+'</details>';
    box.querySelectorAll('[data-new]').forEach(b=>b.onclick=()=>openTopic(b.dataset.new));}
  /* 印の説明を、版の表示の下に足す */
  const rv=$('kRev');if(rv)rv.insertAdjacentHTML('beforeend','<br>項目の右の丸：<span class="vdot v0"></span> 原本と未照合　<span class="vdot" style="--vc:#2F6FB0"></span> AI が原本と照合　<span class="vdot" style="--vc:#2E7D32"></span> 専門家が確認');
  sweep();
})();
