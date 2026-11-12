/* ===== 30 秒で読む版（本文の折りたたみ）・すぐ報告の一覧・利用の記録の追加（2026-11-13） =====
   目的：1 項目が長く、勤務中に読み切れない。開いたときは「要点 3 つ・図・すぐ報告する所見」だけを見せ、
         詳しい文章は、見出しを押したときに開く。図は、たたんでいても見える（図だけ追えば流れが分かるようにする）。
   元に戻したい人のために、「全部開く」を押すと、その端末では次からも開いたままになる（localStorage の kfold）。
   ほかの機能（目次・直接リンク・検索）が見出しへ飛ぶときは、その見出しを自動で開く。 */
(function(){
  const st=document.createElement('style');st.textContent=`
#kList .body h3.sech{cursor:pointer;position:relative;padding-right:28px;-webkit-tap-highlight-color:transparent}
#kList .body h3.sech::after{content:'＋';position:absolute;right:4px;top:50%;transform:translateY(-50%);font-size:15px;color:var(--brand,#0F6E7C);font-weight:700}
#kList .body h3.sech.open::after{content:'−'}
#kList .body .secb{display:none}
#kList .body h3.sech.open~.secb.on{display:block}
#kList .body ul.secb.on{display:block}
.foldbar{display:flex;gap:8px;align-items:center;margin:8px 0 2px;font-size:12px;color:#55666e;flex-wrap:wrap}
.foldbar button{font-size:12px;padding:5px 10px;border-radius:999px;border:1px solid var(--line,#d5dde2);background:var(--card,#fff)}
.quickrep{margin:8px 0 4px;padding:8px 10px;border-radius:10px;background:#FDECEA;border-left:5px solid #C0392B;font-size:14px;line-height:1.6;color:#7A1F17}
.quickrep b{color:#C0392B}
#rpSheet{display:none;position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:33;align-items:flex-end}
#rpSheet .sheet{background:var(--card,#fff);width:100%;max-height:90vh;overflow:auto;border-radius:16px 16px 0 0;padding:12px 14px calc(16px + env(safe-area-inset-bottom))}
#rpSheet .rpi{padding:9px 2px;border-bottom:1px solid var(--line,#e3e9ec)}
#rpSheet .rpi button{display:block;width:100%;text-align:left;border:0;background:none;padding:0;font-size:14.5px;font-weight:700;color:var(--brand,#0F6E7C)}
#rpSheet .rpi div{font-size:13.5px;line-height:1.6;color:var(--text,#222);margin-top:3px}
#rpSheet .rpc{font-size:12px;font-weight:700;color:#55666e;margin:12px 0 2px}
#rpSheet mark{background:#FFE9A8}
`;document.head.appendChild(st);
  const KEY='kfold';const isOff=()=>{try{return localStorage.getItem(KEY)==='0';}catch(e){return false;}};
  const setOff=v=>{try{if(v)localStorage.setItem(KEY,'0');else localStorage.removeItem(KEY);}catch(e){}};
  const openSec=(h,on)=>{h.classList.toggle('open',on);let n=h.nextElementSibling;while(n&&n.tagName!=='H3'&&!n.classList.contains('rel')&&!n.classList.contains('memo')){if(n.classList.contains('secb'))n.classList.toggle('on',on);n=n.nextElementSibling;}};
  const prep=body=>{if(body.dataset.fold)return;const hs=[...body.children].filter(c=>c.tagName==='H3');if(hs.length<2)return;body.dataset.fold=1;
    const q=($('kSearch')&&$('kSearch').value||'').trim();const allOpen=isOff()||!!q;
    hs.forEach(h=>{h.classList.add('sech');let n=h.nextElementSibling;while(n&&n.tagName!=='H3'&&!n.classList.contains('rel')&&!n.classList.contains('memo')){if(n.tagName==='UL'||n.tagName==='OL'||n.tagName==='TABLE'||n.tagName==='P')n.classList.add('secb');n=n.nextElementSibling;}
      h.addEventListener('click',()=>{openSec(h,!h.classList.contains('open'));if(window.__useInc)window.__useInc('f','見出しを開く');});
      if(allOpen)openSec(h,true);});
    /* すぐ報告：本文の中の「すぐ報告：」の行を、いちばん上に出す */
    const rep=[...body.querySelectorAll('li')].find(li=>/^(すぐ)?報告：/.test(li.textContent.trim()));
    const bar=document.createElement('div');bar.className='foldbar';bar.dataset.nopair='1';
    bar.innerHTML='<span>見出しを押すと、詳しい説明が開きます</span><button type="button" data-fa="1">全部開く</button><button type="button" data-fa="0">全部閉じる</button>';
    bar.querySelector('[data-fa="1"]').onclick=()=>{hs.forEach(h=>openSec(h,true));setOff(true);toast('次からも、開いたままで表示します');};
    bar.querySelector('[data-fa="0"]').onclick=()=>{hs.forEach(h=>openSec(h,false));setOff(false);};
    body.insertBefore(bar,hs[0]);
    if(rep){const d=document.createElement('div');d.className='quickrep';d.innerHTML='<b>すぐ報告</b>　'+esc(rep.textContent.trim().replace(/^(すぐ)?報告：/,''));body.insertBefore(d,bar);}
  };
  const sweep=()=>document.querySelectorAll('#kList details[data-key]>.body:not([data-fold])').forEach(prep);
  let tm=null;new MutationObserver(()=>{if(tm)return;tm=setTimeout(()=>{tm=null;try{sweep();}catch(e){console.error(e);}},40);}).observe(document.body,{childList:true,subtree:true});
  /* 見出しや、たたまれた行へ飛ぶときは、先に開く */
  const siv=Element.prototype.scrollIntoView;
  Element.prototype.scrollIntoView=function(){try{let h=null;
      if(this.classList&&this.classList.contains('sech'))h=this;
      else{const b=this.closest&&this.closest('.secb');if(b&&!b.classList.contains('on')){h=b.previousElementSibling;while(h&&h.tagName!=='H3')h=h.previousElementSibling;}}
      if(h&&!h.classList.contains('open'))openSec(h,true);}catch(e){}
    return siv.apply(this,arguments);};
  window.__openAllSec=()=>document.querySelectorAll('#kList h3.sech:not(.open)').forEach(h=>openSec(h,true));
  sweep();

  /* ---------- すぐ報告の一覧 ---------- */
  const rows=[];KNOW.forEach(k=>{const m=META[k.t]||{};if(m.cat==='薬剤詳細'||!KID_R[k.t])return;
    k.s.forEach(s=>(s.b||[]).forEach(x=>{const t=String(x).replace(/^!/,'');if(/^(すぐ)?報告：/.test(t))rows.push({t:k.t,cat:m.cat||'',x:t.replace(/^(すぐ)?報告：/,'')});}));});
  const sheet=document.createElement('div');sheet.id='rpSheet';
  sheet.innerHTML='<div class="sheet"><div class="sheet-h"><b>すぐ報告する所見の一覧</b><button class="small" id="rpClose">閉じる</button></div><p class="muted" style="font-size:12px;margin:4px 0 8px">各項目の「すぐ報告」の行を集めたものです。症状の言葉で絞りこめます。当院の報告の基準と医師の指示が優先です。</p><input id="rpQ" type="search" placeholder="例：尿量、SpO₂、しびれ、発熱" style="width:100%"><div id="rpList"></div></div>';
  document.body.appendChild(sheet);
  const draw=()=>{const q=$('rpQ').value.trim();const L=$('rpList');const order=(window.CATS||[]);
    const hit=rows.filter(r=>!q||[q].concat(window.__qAlt?window.__qAlt(q):[]).some(z=>r.x.includes(z)||r.t.includes(z)));
    hit.sort((a,b)=>order.indexOf(a.cat)-order.indexOf(b.cat));
    let cur=null,h='';hit.forEach(r=>{if(r.cat!==cur){cur=r.cat;h+=`<div class="rpc">${esc(cur)}</div>`;}
      let x=esc(r.x);if(q){x=x.split(esc(q)).join('<mark>'+esc(q)+'</mark>');}
      h+=`<div class="rpi"><button type="button" data-rt="${esc(r.t)}">${esc(r.t)}</button><div>${x}</div></div>`;});
    L.innerHTML=h||'<p class="muted">当てはまる項目がありません</p>';
    L.querySelectorAll('[data-rt]').forEach(b=>b.onclick=()=>{sheet.style.display='none';openTopic(b.dataset.rt);});};
  const openRp=()=>{sheet.style.display='flex';draw();if(window.__useInc)window.__useInc('f','すぐ報告の一覧');};
  window.__reportListOpen=openRp;
  $('rpClose').onclick=()=>sheet.style.display='none';sheet.addEventListener('click',e=>{if(e.target===sheet)sheet.style.display='none';});
  $('rpQ').addEventListener('input',draw);
  const kn=$('kNew');if(kn){const b=document.createElement('button');b.type='button';b.className='small';b.style.cssText='margin:0 0 10px;border-color:#C0392B;color:#C0392B;font-weight:700';b.textContent='すぐ報告する所見の一覧（'+new Set(rows.map(r=>r.t)).size+' 項目）';b.onclick=openRp;kn.parentElement.insertBefore(b,kn);}
})();
