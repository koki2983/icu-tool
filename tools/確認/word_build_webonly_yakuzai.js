const fs=require('fs');const QR=require('qrcode');
const {Document,Packer,Paragraph,TextRun,Table,TableRow,TableCell,WidthType,AlignmentType,BorderStyle,ShadingType,ImageRun,VerticalAlign}=require('docx');
const URL='https://koki2983.github.io/icu-tool/#review';
const F={ascii:'Arial',eastAsia:'游ゴシック',hAnsi:'Arial'};
const T=(t,o={})=>new TextRun(Object.assign({text:t,font:F,size:19},o));
const P=(runs,o={})=>new Paragraph(Object.assign({children:Array.isArray(runs)?runs:[runs],spacing:{before:0,after:30,line:248,lineRule:'auto'}},o));
const NB={style:BorderStyle.NONE,size:0,color:'FFFFFF'};const none={top:NB,bottom:NB,left:NB,right:NB};
const LN={style:BorderStyle.SINGLE,size:6,color:'9AA8B2'};const box={top:LN,bottom:LN,left:LN,right:LN};
const W=9638;
const cell=(children,w,o={})=>new TableCell(Object.assign({children,width:{size:w,type:WidthType.DXA},margins:{top:45,bottom:45,left:140,right:140},borders:box},o));
const H=t=>P(T(t,{bold:true,size:24,color:'0F6E7C'}),{spacing:{before:130,after:60,line:280,lineRule:'auto'},border:{bottom:{style:BorderStyle.SINGLE,size:8,color:'0F6E7C',space:2}},keepNext:true});
(async()=>{
 const png=await QR.toBuffer(URL,{width:520,margin:1,errorCorrectionLevel:'M',color:{dark:'#000000',light:'#FFFFFF'}});
 const step=(n,t,d)=>new TableRow({cantSplit:true,children:[
   cell([P(T(String(n),{bold:true,size:30,color:'FFFFFF'}),{alignment:AlignmentType.CENTER,spacing:{before:0,after:0}})],700,{shading:{type:ShadingType.CLEAR,fill:'0F6E7C',color:'auto'},verticalAlign:VerticalAlign.CENTER}),
   cell([P(T(t,{bold:true,size:21}),{spacing:{before:0,after:16,line:270,lineRule:'auto'}}),P(T(d,{size:18,color:'444444'}),{spacing:{before:0,after:0,line:246,lineRule:'auto'}})],W-700)]});
 const doc=new Document({styles:{default:{document:{run:{font:F,size:21}}}},
  sections:[{properties:{page:{size:{width:11906,height:16838},margin:{top:600,bottom:540,left:1134,right:1134}}},children:[
   P(T('薬剤部の皆様へ',{size:20,color:'444444'}),{spacing:{before:0,after:20}}),
   P(T('ICU 看護師向けツール　内容確認のお願い',{bold:true,size:30}),{spacing:{before:0,after:20,line:330,lineRule:'auto'}}),P(T('スマホ・パソコンで見る方法（確認モード）',{bold:true,size:22,color:'0F6E7C'}),{spacing:{before:0,after:40}}),
   P(T('ICU　小山田 光希',{size:19,color:'444444'}),{spacing:{before:0,after:90}}),
   new Table({width:{size:W,type:WidthType.DXA},columnWidths:[W-2700,2700],rows:[new TableRow({children:[
     cell([
       P(T('お願いしたいこと',{bold:true,size:23,color:'0F6E7C'}),{spacing:{before:0,after:60}}),
       P(T('ICU の看護師が勤務中にスマホで引くツールの中身に、誤りや、当院のやり方と違う所がないかを見てください。')),
       P([T('全部を見ていただく必要はありません。',{bold:true}),T('薬剤各論と配合変化など、薬に関わる所だけで十分です。')]),
       P(T('右の QR コードを読むと、「確認モード」で開きます。アプリを入れる作業や、登録は要りません。')),
       P([T('期限の目安：11 月 30 日ごろ',{bold:true})],{spacing:{before:50,after:20}}),
       P(T('※ あくまで暫定の期限です。ICU の看護師の間では、12 月から正式に使い始める予定です。これ以降も、改善点は随時受け付け、すぐに直していきます。',{size:17,color:'444444'}),{spacing:{before:0,after:0,line:240,lineRule:'auto'}}),
     ],W-2700,{borders:{top:LN,bottom:LN,left:LN,right:NB},shading:{type:ShadingType.CLEAR,fill:'F1F7F8',color:'auto'}}),
     cell([
       P(new ImageRun({type:'png',data:png,transformation:{width:128,height:128}}),{alignment:AlignmentType.CENTER,spacing:{before:0,after:20,line:240,lineRule:'auto'}}),
       P(T('確認モードで開く',{bold:true,size:19}),{alignment:AlignmentType.CENTER,spacing:{before:0,after:0}}),
     ],2700,{borders:{top:LN,bottom:LN,left:NB,right:LN},shading:{type:ShadingType.CLEAR,fill:'F1F7F8',color:'auto'},verticalAlign:VerticalAlign.CENTER}),
   ]})]}),
   P(T('パソコンで開くとき：'+URL,{size:18,color:'444444'}),{spacing:{before:50,after:0,line:240,lineRule:'auto'}}),
   P(T('URL の送付をご希望の方は、ICU 小山田へお申し付けください。Teams でお送りします。',{size:18,color:'444444'}),{spacing:{before:0,after:0,line:240,lineRule:'auto'}}),
   H('使い方（5 つ）'),
   new Table({width:{size:W,type:WidthType.DXA},columnWidths:[700,W-700],rows:[
     step(1,'QR コードを読む','アプリが開き、左下にオレンジ色の「確認モード」のボタンが出ます。'),
     step(2,'見たい項目を開く','薬剤各論（30）は、下の「薬剤」のタブで、薬の「作用・副作用・使い方」を押すと開きます。配合変化は「計算」のタブです。'),
     step(3,'気になる行の「指摘する」を押して、書く','どこがどう違うか、正しい内容、分かれば根拠を書いてください。短い言葉で構いません。'),
     step(4,'問題がなければ「この項目は問題なし」を押す','項目のいちばん上にあります。見ていただいた範囲が、こちらに伝わります。'),
     step(5,'送る操作は要りません','押すたびに、自動で小山田に届きます。左下のボタンで職種・お名前を書くと、どなたの指摘か分かります（任意）。'),
   ]}),
   P([T('ご注意：',{bold:true}),T('指摘と職種・お名前（任意）は、病院の Teams に送られます。指摘の欄に、患者さんの情報は書かないでください。')],{spacing:{before:80,after:0}}),
   H('見ていただきたい点'),
   P([T('1. 量・速さ・濃度・希釈の誤り',{bold:true}),T('　用法・用量、溶かし方、速さ、TDM の値、禁忌')]),
   P([T('2. 当院の採用薬・決まりと違う所',{bold:true}),T('　採用品の名前と規格、当院の希釈・配合変化表との食い違い')]),
   P([T('3. 配合変化・ルートの書き方',{bold:true}),T('　誤り、言い切りすぎ、「薬剤師に確認」と書くべき所')]),
   P([T('4. 抜けている大事な注意',{bold:true}),T('　これは必ず書いておくべき、という点')]),
   H('このツールについて'),
   P(T('・看護師の観察と報告を助けるためのもので、治療を決めるものではありません（各項目に「当院の基準と医師の指示が優先」と明記）。患者さんの氏名や ID は入れない作りです。')),
   P(T('・本文は、小山田が AI（Claude）を使って作りました。AI による資料との照合と点検は行いましたが、専門家の確認はまだ受けていません。誤りが残っている前提で見ていただけると助かります。')),
   P(T('・いただいた指摘は小山田が直し、確認していただいた項目には「専門家が確認（職種・日付）」の印を付けます。お名前は出しません。')),
   new Table({width:{size:W,type:WidthType.DXA},columnWidths:[W],rows:[new TableRow({children:[cell([
     P([T('連絡先',{bold:true}),T('　ICU　小山田 光希の Teams、または直接ご連絡ください。')],{spacing:{before:0,after:0}})],W,{shading:{type:ShadingType.CLEAR,fill:'FFF6E5',color:'auto'}})]})]}),
  ]}]});
 fs.writeFileSync('ICUツール_内容確認のお願い_確認モード版_薬剤部.docx',await Packer.toBuffer(doc));console.log('ok');
})();
