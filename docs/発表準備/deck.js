const pptxgen=require('pptxgenjs');
const {applyTheme}=require('/root/.claude/skills/synced/58fdf45c-bd4e-479f-b69f-e9a20c732b84_05e49e53-d50a-4bde-9e46-47256105d7bc/pptx/scripts/apply_theme.js');
const THEME={name:'ICU Tool',headFontFace:'Yu Gothic',bodyFontFace:'Yu Gothic',colors:{dk1:'1F2A30',lt1:'FFFFFF',dk2:'12414C',lt2:'EAF3F5',accent1:'1F7A8C',accent2:'E0A030',accent3:'C0392B',accent4:'2E7D32',accent5:'6B7A80',accent6:'8E44AD',hlink:'1F7A8C',folHlink:'6B7A80'}};
const pres=new pptxgen();pres.layout='LAYOUT_16x9';pres.theme={headFontFace:THEME.headFontFace,bodyFontFace:THEME.bodyFontFace};
pres.author='小山田 光希';pres.title='ICU 看護師のためのベッドサイド支援 Web アプリの開発と導入';
const C=pres.SchemeColor;
const FOOT=(dark)=>[{text:'熊本労災病院 ICU　小山田',options:{x:0.5,y:5.2,w:5,h:0.3,fontSize:9,color:dark?C.background2:C.accent5,margin:0,isTextBox:true}}];
pres.defineSlideMaster({title:'DARK',background:{color:THEME.colors.dk2},objects:[{text:FOOT(true)[0]}],slideNumber:{x:9.2,y:5.2,w:0.4,h:0.3,fontSize:9,color:THEME.colors.lt2}});
pres.defineSlideMaster({title:'LIGHT',background:{color:THEME.colors.lt1},objects:[{text:FOOT(false)[0]},{placeholder:{options:{name:'title',type:'title',x:0.5,y:0.35,w:9,h:0.7,fontSize:26,bold:true,color:THEME.colors.dk2,margin:0,valign:'middle',align:'left'},text:''}}],slideNumber:{x:9.2,y:5.2,w:0.4,h:0.3,fontSize:9,color:THEME.colors.accent5}});
const sec=(t)=>pres.addSection({title:t});
const tx=(s,t,o)=>s.addText(t,Object.assign({isTextBox:true,margin:0,fontSize:14,color:C.text1},o));
const card=(s,x,y,w,h,title,body,col,fs)=>{s.addShape(pres.ShapeType.roundRect,{x,y,w,h,fill:{color:C.background2},line:{color:C.background2},rectRadius:0.08});
  tx(s,title,{x:x+0.2,y:y+0.12,w:w-0.4,h:0.4,fontSize:14,bold:true,color:col||C.accent1});
  tx(s,body,{x:x+0.2,y:y+0.5,w:w-0.4,h:h-0.6,fontSize:fs||11.5,color:C.text1,valign:'top'});};
const stat=(s,x,y,w,n,l,col)=>{tx(s,n,{x,y,w,h:0.75,fontSize:40,bold:true,color:col||C.accent1,align:'center'});tx(s,l,{x,y:y+0.75,w,h:0.35,fontSize:11,color:C.accent5,align:'center'});};
const tag=(s,t)=>tx(s,t,{x:6.3,y:0.08,w:3.4,h:0.28,fontSize:9,color:C.accent3,align:'right'});
const IMG=n=>`/home/claude/kit/s_${n}.png`;
// 1 title
sec('導入');
let s=pres.addSlide({masterName:'DARK',sectionTitle:'導入'});
tx(s,'ICU 看護師のための\nベッドサイド支援 Web アプリの開発と導入',{x:0.6,y:1.1,w:8.8,h:1.7,fontSize:30,bold:true,color:C.background1,valign:'top'});
tx(s,'計算・スコア・知識・当院の運用を、スマホ 1 つに',{x:0.6,y:2.9,w:8.8,h:0.5,fontSize:16,color:C.background2});
tx(s,'熊本労災病院　ICU　小山田 光希',{x:0.6,y:3.9,w:6,h:0.4,fontSize:14,color:C.background1});
tx(s,'看護部 ○○発表会　2026 年 ○月 ○日',{x:0.6,y:4.3,w:6,h:0.4,fontSize:12,color:C.background2});
s.addImage({path:'/home/claude/kit/qr.png',x:8.0,y:3.5,w:1.4,h:1.4});
tx(s,'koki2983.github.io/icu-tool/',{x:7.3,y:4.95,w:2.5,h:0.25,fontSize:8,color:C.background2,align:'center'});
s.addNotes('タイトル。発表会名と日付は差し替え。');
// 2 background
s=pres.addSlide({masterName:'LIGHT',sectionTitle:'導入'});s.addText('背景：ICU の「その場で調べる」は散らばっている',{placeholder:'title'});
const rows=[['📚','根拠が 4 か所に散在','書籍・紙マニュアル・先輩の記憶・個人のメモ。同じ質問に人によって答えが違う'],['🧮','計算と判定はベッドサイドで','γ 計算、配合変化、P/F 比、スコア判定。急ぐときほど電卓とメモになる'],['🌱','新卒 ICU 配属が始まった','「何を・どこで調べればいいか」で止まる。先輩に聞く回数が増え、双方の負担になる']];
rows.forEach((r,i)=>{const y=1.3+i*1.2;s.addShape(pres.ShapeType.ellipse,{x:0.6,y:y+0.1,w:0.7,h:0.7,fill:{color:C.accent1},line:{color:C.accent1}});tx(s,r[0],{x:0.6,y:y+0.1,w:0.7,h:0.7,fontSize:20,align:'center',valign:'middle',color:C.background1});tx(s,r[1],{x:1.5,y,w:4.3,h:0.4,fontSize:16,bold:true,color:C.text2});tx(s,r[2],{x:1.5,y:y+0.42,w:4.3,h:0.7,fontSize:12,color:C.text1,valign:'top'});});
s.addShape(pres.ShapeType.roundRect,{x:6.3,y:1.3,w:3.2,h:3.5,fill:{color:C.background2},line:{color:C.background2},rectRadius:0.08});
tx(s,'事前アンケートより（仮）',{x:6.5,y:1.45,w:2.9,h:0.35,fontSize:12,bold:true,color:C.accent1});
stat(s,6.5,1.9,2.9,'○ 回','1 勤務あたり調べる回数');
stat(s,6.5,3.1,2.9,'○ 分','1 回にかかる時間');
tx(s,'【仮置き：集計後に差し替え】',{x:6.5,y:4.35,w:2.9,h:0.3,fontSize:9,color:C.accent3,align:'center'});
s.addNotes('背景。右の数字は事前アンケートの集計で差し替える。');
// 3 purpose
s=pres.addSlide({masterName:'LIGHT',sectionTitle:'導入'});s.addText('目的',{placeholder:'title'});
s.addShape(pres.ShapeType.roundRect,{x:0.6,y:1.3,w:8.8,h:1.5,fill:{color:C.accent1},line:{color:C.accent1},rectRadius:0.1});
tx(s,'ICU で必要な「計算・スコア・知識・当院の運用」を 1 つにまとめた Web アプリを作り、\nICU 看護師全員で 4 週間試用して、調べものの実態と自信の変化、使いやすさと課題を評価する',{x:0.9,y:1.45,w:8.2,h:1.2,fontSize:15,bold:true,color:C.background1,valign:'middle'});
card(s,0.6,3.1,2.8,1.7,'① 作る','スマホで開ける、ログイン不要、患者情報を扱わない。内容はガイドラインと公開文献、当院の基準を反映');
card(s,3.6,3.1,2.8,1.7,'② 配る','ICU 看護師 26 名に QR カードで配布。ホーム画面に追加して「アプリのように」使う');
card(s,6.6,3.1,2.8,1.7,'③ 評価する','配布の前後でアンケート（調べる回数・時間・手段・自信）＋アプリ内の利用の記録');
s.addNotes('目的と、方法の 3 本柱。');
// 4 method: app overview
sec('方法');
s=pres.addSlide({masterName:'LIGHT',sectionTitle:'方法'});s.addText('方法①　作ったもの：ICU ツール（Web アプリ）',{placeholder:'title'});
[['calc',0.5],['know',2.45],['score',4.4]].forEach(([n,x])=>s.addImage({path:IMG(n),x,y:1.2,w:1.8,h:3.7,rounding:false}));
tx(s,'計算（γ・配合変化・P/F ほか）',{x:0.5,y:4.93,w:1.8,h:0.25,fontSize:8,color:C.accent5,align:'center'});
tx(s,'知識（図つき・当院の運用）',{x:2.45,y:4.93,w:1.8,h:0.25,fontSize:8,color:C.accent5,align:'center'});
tx(s,'スコア（基準を選ぶだけ）',{x:4.4,y:4.93,w:1.8,h:0.25,fontSize:8,color:C.accent5,align:'center'});
stat(s,6.4,1.25,1.6,'20','計算ツール');stat(s,8.0,1.25,1.6,'8','スコア');
stat(s,6.4,2.5,1.6,'71','知識メモ');stat(s,8.0,2.5,1.6,'399','用語集');
tx(s,'当院の運用 6 項目：心外帰室の流れ、TTM、配合変化表（46 剤）、抗菌薬 × 輸液、嚥下スクリーニング、ECMO 画面',{x:6.4,y:3.8,w:3.2,h:0.7,fontSize:10.5,color:C.text1});
tx(s,'ほかに：輸液シート、by system 申し送りシート、全文検索、各項目への直リンク',{x:6.4,y:4.5,w:3.2,h:0.6,fontSize:10.5,color:C.text1});
s.addNotes('アプリの中身。数字は発表時点のものに更新する。');
// 5 method: how built
s=pres.addSlide({masterName:'LIGHT',sectionTitle:'方法'});s.addText('方法②　作り方と、内容の担保',{placeholder:'title'});
card(s,0.5,1.25,2.9,1.85,'仕組み','1 枚の HTML ファイル。GitHub Pages で公開（無料）。iPhone・Android のブラウザで動き、ホーム画面に追加するとアプリのように使える。サーバーなし');
card(s,3.55,1.25,2.9,1.85,'内容の根拠','ガイドライン（JSICM・JCS・BTF・NICE ほか）と公開文献、JACCN クイックガイド。当院の基準は薬剤部の表・院内プロトコルを反映');
card(s,6.6,1.25,2.9,1.85,'生成 AI の使い方','コードと文章の下書きに生成 AI（Claude）を使用。内容は作成者が確認し、試用者からの指摘で修正。出典を各項目に明記');
card(s,0.5,3.3,2.9,1.75,'安全への配慮','患者が特定できる情報は入力しない設計（入力欄はベッド番号まで）。保存は端末内のみ。数値は「目安」で、当院の基準と医師の指示が優先と各所に明記',C.accent3);
s.addShape(pres.ShapeType.roundRect,{x:3.55,y:3.3,w:5.95,h:1.75,fill:{color:C.background2},line:{color:C.background2},rectRadius:0.08});
tx(s,'開発の流れ',{x:3.75,y:3.42,w:3,h:0.35,fontSize:14,bold:true,color:C.accent1});
const tl=[['9 月','第 1 版（γ 計算・希釈・スコア）'],['9〜10 月','公開、知識 70 項目、8 名が試用'],['10 月','当院の運用・配合変化表を反映'],['11 月','ICU 全員に配布・評価'],['12 月','集計・発表']];
tl.forEach((t,i)=>{const x=3.75+i*1.15;s.addShape(pres.ShapeType.ellipse,{x:x+0.35,y:3.9,w:0.3,h:0.3,fill:{color:C.accent1},line:{color:C.accent1}});if(i<tl.length-1)s.addShape(pres.ShapeType.line,{x:x+0.65,y:4.05,w:0.85,h:0,line:{color:C.accent1,width:1.5}});tx(s,t[0],{x,y:4.25,w:1.0,h:0.25,fontSize:9,bold:true,color:C.text2,align:'center'});tx(s,t[1],{x:x-0.05,y:4.5,w:1.1,h:0.5,fontSize:8,color:C.text1,align:'center',valign:'top'});});
s.addNotes('作り方。生成 AI を使ったことは隠さず、内容の担保の方法とセットで説明する。');
// 6 method: evaluation
s=pres.addSlide({masterName:'LIGHT',sectionTitle:'方法'});s.addText('方法③　評価の方法',{placeholder:'title'});
card(s,0.5,1.25,4.4,1.6,'対象と期間','当院 ICU の看護師 26 名（1 年目〜）。2026 年 ○月 ○日に配布し、4 週間試用');
card(s,5.1,1.25,4.4,1.6,'倫理的配慮','無記名（経験年数のみ）。回答は任意で、評価・勤務に影響しないことを明記。所属長の了承を得て実施。患者情報は扱わない');
s.addShape(pres.ShapeType.roundRect,{x:0.5,y:3.05,w:9,h:2.0,fill:{color:C.background2},line:{color:C.background2},rectRadius:0.08});
tx(s,'前後比較（事前 → 4 週間後に同じ設問）',{x:0.7,y:3.15,w:6,h:0.35,fontSize:14,bold:true,color:C.accent1});
const ev=[['調べる回数','1 勤務あたり'],['調べる時間','1 回あたり'],['調べる手段','先輩に聞く／アプリ'],['自信（10 項目）','5 段階'],['あいまいなまま進めた','直近 1 か月'],['利用の記録','端末内の回数']];
ev.forEach((e,i)=>{const x=0.7+i*1.47;s.addShape(pres.ShapeType.roundRect,{x,y:3.6,w:1.35,h:1.25,fill:{color:C.background1},line:{color:C.background1},rectRadius:0.06});tx(s,e[0],{x:x+0.08,y:3.68,w:1.2,h:0.6,fontSize:10.5,bold:true,color:C.text2,align:'center',valign:'middle'});tx(s,e[1],{x:x+0.08,y:4.3,w:1.2,h:0.45,fontSize:9,color:C.accent5,align:'center'});});
s.addNotes('評価方法。配布日は決まり次第入れる。');
// 7 results usage
sec('結果');
s=pres.addSlide({masterName:'LIGHT',sectionTitle:'結果'});s.addText('結果①　利用状況',{placeholder:'title'});tag(s,'【仮置き：集計後に差し替え】');
s.addChart(pres.ChartType.bar,[{name:'人数',labels:['ほぼ毎勤務','週 2〜3 回','週 1 回','数回だけ','使わなかった'],values:[8,9,4,3,2]}],{x:0.5,y:1.2,w:4.4,h:3.9,barDir:'bar',catAxisOrientation:'maxMin',showTitle:true,title:'使った頻度（n＝26・仮）',titleFontSize:12,titleColor:THEME.colors.dk2,titleFontFace:'+mn-lt',chartColors:[THEME.colors.accent1],showValue:true,dataLabelPosition:'outEnd',dataLabelFontSize:10,dataLabelColor:THEME.colors.dk1,dataLabelFontFace:'+mn-lt',catAxisLabelColor:THEME.colors.dk1,catAxisLabelFontSize:10,catAxisLabelFontFace:'+mn-lt',valAxisLabelColor:THEME.colors.accent5,valAxisLabelFontSize:9,valAxisLabelFontFace:'+mn-lt',valGridLine:{color:THEME.colors.lt2,size:0.5},catGridLine:{style:'none'},showLegend:false,valAxisHidden:true});
s.addChart(pres.ChartType.bar,[{name:'人数',labels:['γ 計算','配合変化','知識メモ','スコア','P/F・血ガス','輸液シート','検索','by system'],values:[20,18,15,14,10,6,9,5]}],{x:5.1,y:1.2,w:4.4,h:3.9,barDir:'bar',catAxisOrientation:'maxMin',showTitle:true,title:'よく使った機能（複数回答・仮）',titleFontSize:12,titleColor:THEME.colors.dk2,titleFontFace:'+mn-lt',chartColors:[THEME.colors.accent2],showValue:true,dataLabelPosition:'outEnd',dataLabelFontSize:10,dataLabelColor:THEME.colors.dk1,dataLabelFontFace:'+mn-lt',catAxisLabelColor:THEME.colors.dk1,catAxisLabelFontSize:10,catAxisLabelFontFace:'+mn-lt',valAxisLabelColor:THEME.colors.accent5,valAxisLabelFontSize:9,valAxisLabelFontFace:'+mn-lt',valGridLine:{color:THEME.colors.lt2,size:0.5},catGridLine:{style:'none'},showLegend:false,valAxisHidden:true});
s.addNotes('事後アンケート Q3・Q5 と利用の記録を集計して差し替える。');
// 8 results before/after
s=pres.addSlide({masterName:'LIGHT',sectionTitle:'結果'});s.addText('結果②　配布の前後で変わったこと',{placeholder:'title'});tag(s,'【仮置き：集計後に差し替え】');
s.addChart(pres.ChartType.bar,[{name:'事前',labels:['γ 計算','配合変化','血ガス','P/F','スコア','IN/OUT','人工呼吸器','補助循環','人を呼ぶ判断','by system'],values:[3.1,2.4,2.8,3.0,3.4,3.2,2.6,2.2,3.0,2.5]},{name:'4 週間後',labels:['γ 計算','配合変化','血ガス','P/F','スコア','IN/OUT','人工呼吸器','補助循環','人を呼ぶ判断','by system'],values:[3.9,3.5,3.3,3.6,3.9,3.6,3.2,2.7,3.5,3.2]}],{x:0.5,y:1.2,w:6.0,h:3.9,barDir:'col',showTitle:true,title:'自信の平均点（1〜5・仮）',titleFontSize:12,titleColor:THEME.colors.dk2,titleFontFace:'+mn-lt',chartColors:[THEME.colors.accent5,THEME.colors.accent1],showValue:false,catAxisLabelColor:THEME.colors.dk1,catAxisLabelFontSize:8,catAxisLabelFontFace:'+mn-lt',valAxisLabelColor:THEME.colors.accent5,valAxisLabelFontSize:9,valAxisLabelFontFace:'+mn-lt',valAxisMinVal:1,valAxisMaxVal:5,valGridLine:{color:THEME.colors.lt2,size:0.5},catGridLine:{style:'none'},showLegend:true,legendPos:'t',legendFontSize:10,legendFontFace:'+mn-lt',legendColor:THEME.colors.dk1});
card(s,6.7,1.2,2.8,1.2,'調べる回数','○ 回 → ○ 回／勤務');
card(s,6.7,2.55,2.8,1.2,'1 回の時間','○ 分 → ○ 分');
card(s,6.7,3.9,2.8,1.2,'先輩に聞く','○ 人 → ○ 人（手段として選択）');
s.addNotes('事前・事後の★設問を比較。経験年数別の内訳は補足スライドか口頭で。');
// 9 results voices
s=pres.addSlide({masterName:'LIGHT',sectionTitle:'結果'});s.addText('結果③　役に立った場面・課題（自由記述）',{placeholder:'title'});tag(s,'【仮置き：引用可の回答から選ぶ】');
const q=[['「ノルアドの流量変更のとき、γ をその場で確認できて、桁の間違いに気づけた」','（3 年目・仮）'],['「配合変化表を見て、薬剤部に電話せずに側管の可否を判断できた」','（6 年目以上・仮）'],['「人工呼吸器の図を 1 年目に見せながら説明した。自分の説明が整理された」','（4〜6 年目・仮）'],['「夜勤で“いつ人を呼ぶか”の目安を見て、早めに報告できた」','（1 年目・仮）']];
q.forEach((e,i)=>{const y=1.25+i*0.78;s.addShape(pres.ShapeType.roundRect,{x:0.5,y,w:5.9,h:0.68,fill:{color:C.background2},line:{color:C.background2},rectRadius:0.06});tx(s,e[0],{x:0.7,y:y+0.06,w:5.5,h:0.4,fontSize:11.5,color:C.text1,valign:'middle'});tx(s,e[1],{x:0.7,y:y+0.42,w:5.5,h:0.22,fontSize:9,color:C.accent5,align:'right'});});
card(s,6.6,1.25,2.9,1.5,'使いにくかった点（仮）','・開くまでの手順が分かりにくい\n・知識が多くて目当てに届きにくい',C.accent3);
card(s,6.6,2.9,2.9,1.5,'追加の要望（仮）','・当院の希釈表の全薬剤\n・病棟ごとの運用\n・画像をもっと');
s.addNotes('自由記述。Q17 で引用可と答えた人のものだけを使う。');
// 10 discussion
sec('考察');
s=pres.addSlide({masterName:'LIGHT',sectionTitle:'考察'});s.addText('考察',{placeholder:'title'});
const dc=[['根拠が 1 か所に集まった','調べる時間と「先輩に聞く」回数が減り、聞かれる側の負担も減った。答えが人によって違う、が減る'],['新人に効いた','自信の上昇幅は経験年数が浅いほど大きい（仮）。「調べ方の型」を持てることが、知識そのものより大きい'],['当院の運用を載せられた','配合変化表・嚥下スクリーニング・帰室の流れ。ガイドラインと当院の決まりを同じ画面で見られる'],['内容の責任は人が持つ','生成 AI は下書きの道具。出典の明記、試用者の指摘、当院基準優先の注記で担保した。それでも誤りはありうる']];
dc.forEach((d,i)=>{const x=0.5+(i%2)*4.6,y=1.25+Math.floor(i/2)*1.95;s.addShape(pres.ShapeType.roundRect,{x,y,w:4.4,h:1.8,fill:{color:C.background2},line:{color:C.background2},rectRadius:0.08});s.addShape(pres.ShapeType.ellipse,{x:x+0.2,y:y+0.2,w:0.5,h:0.5,fill:{color:C.accent1},line:{color:C.accent1}});tx(s,String(i+1),{x:x+0.2,y:y+0.2,w:0.5,h:0.5,fontSize:14,bold:true,color:C.background1,align:'center',valign:'middle'});tx(s,d[0],{x:x+0.85,y:y+0.22,w:3.4,h:0.45,fontSize:14,bold:true,color:C.text2,valign:'middle'});tx(s,d[1],{x:x+0.2,y:y+0.8,w:4.0,h:0.95,fontSize:11,color:C.text1,valign:'top'});});
s.addNotes('考察。結果が出たら「仮」を外し、数字で言い換える。');
// 11 limitations & next
s=pres.addSlide({masterName:'LIGHT',sectionTitle:'考察'});s.addText('限界と今後',{placeholder:'title'});
card(s,0.5,1.25,4.4,3.8,'限界','・1 部署・26 名・4 週間の前後比較で、対照群はない\n・自己申告の変化で、インシデントや記録の質は測っていない\n・内容の更新と責任が作成者 1 人に集中している\n・患者情報を扱えないので、電子カルテの代わりにはならない\n・端末ごとの保存で、データの共有はできない',C.accent3,13);
card(s,5.1,1.25,4.4,3.8,'今後','・教育チェックリストと知識を連動（項目から該当ページへ直リンク）\n・効果の測定：インシデント件数、スコアの記録率、新人の到達度\n・院内の公式ツールとして承認を得る（内容の確認体制、更新の手順）\n・看護部全体への展開：部署ごとの運用ページ、共有の仕組み\n・院内手順との整合（ナーシング・スキルとの照合）',C.accent4,13);
s.addNotes('限界と今後。質疑で聞かれそうな点を先に言う。');
// 12 conclusion
sec('結論');
s=pres.addSlide({masterName:'DARK',sectionTitle:'結論'});
tx(s,'結論',{x:0.6,y:0.5,w:3,h:0.5,fontSize:18,bold:true,color:C.background2});
tx(s,'ICU で必要な計算・スコア・知識・当院の運用を 1 つにまとめた Web アプリを作り、ICU 全員で試用した。',{x:0.6,y:1.2,w:8.8,h:0.9,fontSize:18,bold:true,color:C.background1});
tx(s,'調べる時間と「先輩に聞く」回数が減り、自信は特に経験の浅い看護師で上がった（仮）。',{x:0.6,y:2.2,w:8.8,h:0.8,fontSize:16,color:C.background1});
tx(s,'内容の責任と更新の体制を整え、教育チェックリストとの連動と看護部全体への展開を進める。',{x:0.6,y:3.1,w:8.8,h:0.8,fontSize:16,color:C.background1});
s.addImage({path:'/home/claude/kit/qr.png',x:8.0,y:3.6,w:1.4,h:1.4});
tx(s,'今日から使えます →',{x:5.8,y:4.1,w:2.1,h:0.4,fontSize:12,color:C.background2,align:'right'});
s.addNotes('結論。QR を出して終わる。');
(async()=>{await pres.writeFile({fileName:'/home/claude/kit/ICUツール_発表スライド_叩き台.pptx'});await applyTheme('/home/claude/kit/ICUツール_発表スライド_叩き台.pptx',THEME);console.log('done');})();
