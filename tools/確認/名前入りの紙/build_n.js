const fs=require('fs');const QR=require('qrcode');
const {Document,Packer,Paragraph,TextRun,Table,TableRow,TableCell,WidthType,AlignmentType,BorderStyle,ShadingType,ImageRun,VerticalAlign,PageBreak}=require('docx');
const D=JSON.parse(fs.readFileSync(process.argv[2]||'nurses.json','utf8'));
const BASE='https://koki2983.github.io/icu-tool/#review&r=';
const F={ascii:'Arial',eastAsia:'游ゴシック',hAnsi:'Arial'};
const T=(t,o={})=>new TextRun(Object.assign({text:t,font:F,size:19},o));
const P=(r,o={})=>new Paragraph(Object.assign({children:Array.isArray(r)?r:[r],spacing:{before:0,after:30,line:250,lineRule:'auto'}},o));
const NB={style:BorderStyle.NONE,size:0,color:'FFFFFF'};const LN={style:BorderStyle.SINGLE,size:6,color:'9AA8B2'};const box={top:LN,bottom:LN,left:LN,right:LN};
const W=9638;
const cell=(c,w,o={})=>new TableCell(Object.assign({children:c,width:{size:w,type:WidthType.DXA},margins:{top:50,bottom:50,left:130,right:130},borders:box},o));
const H=t=>P(T(t,{bold:true,size:22,color:'0F6E7C'}),{spacing:{before:110,after:50,line:260,lineRule:'auto'},border:{bottom:{style:BorderStyle.SINGLE,size:8,color:'0F6E7C',space:2}},keepNext:true});
(async()=>{const kids=[];const map=[];
 for(let i=0;i<D.people.length;i++){const [name,hon,dept,key,cd]=D.people[i];const code=cd||('N'+String(i+1).padStart(2,'0'));map.push([code,name,dept]);
  const png=await QR.toBuffer(BASE+code,{width:520,margin:1,errorCorrectionLevel:'M'});
  if(i>0)kids.push(new Paragraph({children:[new PageBreak()]}));
  kids.push(P([T(name+' '+hon,{bold:true,size:34})],{alignment:AlignmentType.RIGHT,spacing:{before:0,after:0}}));
  kids.push(P(T(dept?'（'+dept+'）':'',{size:19,color:'444444'}),{alignment:AlignmentType.RIGHT,spacing:{before:0,after:80}}));
  kids.push(P(T('ICU 看護師向けツール　内容確認のお願い',{bold:true,size:30}),{spacing:{before:0,after:20,line:320,lineRule:'auto'}}));
  kids.push(P(T('ICU　小山田 光希',{size:19,color:'444444'}),{spacing:{before:0,after:80}}));
  kids.push(new Table({width:{size:W,type:WidthType.DXA},columnWidths:[W-2500,2500],rows:[new TableRow({children:[
   cell([P(T('お願いしたいこと',{bold:true,size:22,color:'0F6E7C'}),{spacing:{before:0,after:40}}),
     P(T('ICU の看護師が勤務中にスマホで引くツールの中身に、誤りや、当院のやり方と違う所がないかを見ていただけないでしょうか。')),
     P([T('全部を見ていただく必要はありません。',{bold:true}),T('下の「見ていただきたい点」のうち、気になった所だけで十分です。')]),
     P(T('右の QR コードを読むと「確認モード」で開きます。アプリを入れる作業や登録は要りません。')),
     P([T('期限の目安：11 月 30 日ごろ',{bold:true})],{spacing:{before:40,after:10}}),
     P(T('※ あくまで暫定の期限です。ICU の看護師の間では 12 月から正式に使い始める予定です。これ以降も、改善点は随時受け付け、すぐに直していきます。',{size:16,color:'444444'}),{spacing:{before:0,after:0,line:230,lineRule:'auto'}}),
   ],W-2500,{borders:{top:LN,bottom:LN,left:LN,right:NB},shading:{type:ShadingType.CLEAR,fill:'F1F7F8',color:'auto'}}),
   cell([P(new ImageRun({type:'png',data:png,transformation:{width:132,height:132}}),{alignment:AlignmentType.CENTER,spacing:{before:0,after:10,line:240,lineRule:'auto'}}),
     P(T('専用の QR コード',{bold:true,size:17}),{alignment:AlignmentType.CENTER,spacing:{before:0,after:0}})],
    2500,{borders:{top:LN,bottom:LN,left:NB,right:LN},shading:{type:ShadingType.CLEAR,fill:'F1F7F8',color:'auto'},verticalAlign:VerticalAlign.CENTER})]})]}));
  kids.push(P(T('この QR コードで開くと、お名前を書かなくても、どなたからの指摘か分かるようになっています。ほかの方には渡さないでください。URL の送付をご希望の場合は、ICU 小山田へお申し付けください。Teams でお送りします。',{size:17,color:'444444'}),{spacing:{before:50,after:0,line:240,lineRule:'auto'}}));
  kids.push(H('見ていただきたい点（ほかのご指摘も歓迎です）'));
  (D.depts[key]||[]).forEach(x=>kids.push(P(T('・'+x),{indent:{left:200,hanging:200}})));
  if(false)kids.push(P(T('紙に書きこむほうが楽な場合は、分野別の紙のチェック表（A〜G）もお渡しします。',{size:17,color:'444444'}),{spacing:{before:30,after:0}}));
  kids.push(H('使い方'));
  [['QR コードを読む','アプリが開き、左下にオレンジ色の「確認モード」のボタンが出ます。'],
   ['項目を開く','「知識」のタブは診療科ごとに並んでいます。右上の「検索」でも探せます。薬は「薬剤」のタブです。'],
   ['気になる行の「指摘する」を押して書く','どこがどう違うか、正しい内容、分かれば根拠を、短い言葉で。問題がなければ、項目の上の「この項目は問題なし」を押してください。'],
   ['送る操作は要りません','押すたびに、自動で小山田に届きます。']].forEach((s,j)=>kids.push(P([T((j+1)+'. '+s[0],{bold:true}),T('　'+s[1],{size:18,color:'333333'})],{indent:{left:260,hanging:260}})));
  kids.push(P([T('ご注意：',{bold:true}),T('指摘の欄に、患者さんの情報は書かないでください。指摘は病院の Teams に届きます。')],{spacing:{before:50,after:20}}));
  kids.push(H('このツールについて'));
  kids.push(P(T('・看護師の観察と報告を助けるためのもので、治療を決めるものではありません（各項目に「当院の基準と医師の指示が優先」と明記）。患者さんの氏名や ID は入れない作りです。')));
  kids.push(P(T('・本文は、小山田が AI（Claude）を使って作りました。資料との照合と点検は行いましたが、専門家の確認はまだ受けていません。誤りが残っている前提で見ていただけると助かります。')));
  kids.push(P(T('・いただいた指摘は小山田が直し、確認していただいた項目には「専門家が確認（職種・日付）」の印を付けます。お名前は出しません。')));
  kids.push(new Table({width:{size:W,type:WidthType.DXA},columnWidths:[W],rows:[new TableRow({children:[cell([P([T('連絡先',{bold:true}),T('　ICU　小山田 光希の Teams、または直接ご連絡ください。')],{spacing:{before:0,after:0}})],W,{shading:{type:ShadingType.CLEAR,fill:'FFF6E5',color:'auto'}})]})]}));
  kids.push(P(T('記号 '+code,{size:14,color:'888888'}),{alignment:AlignmentType.RIGHT,spacing:{before:30,after:0}}));
 }
 const doc=new Document({styles:{default:{document:{run:{font:F,size:19}}}},sections:[{properties:{page:{size:{width:11906,height:16838},margin:{top:620,bottom:560,left:1134,right:1134}}},children:kids}]});
 fs.writeFileSync(process.argv[3]||'ICUツール_内容確認のお願い_看護部_名前入り.docx',await Packer.toBuffer(doc)); require('child_process').execFileSync('python3',['fixlines.py',process.argv[3]||'ICUツール_内容確認のお願い_看護部_名前入り.docx']);
 if(!process.argv[3])fs.writeFileSync('map_n.txt',map.map(m=>m.join('\t')).join('\n'));console.log('ok',map.length);
})();
