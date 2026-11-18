const fs=require('fs');
const {Document,Packer,Paragraph,TextRun,Table,TableRow,TableCell,WidthType,AlignmentType,BorderStyle,ShadingType}=require('docx');
const F={ascii:'Arial',eastAsia:'游ゴシック',hAnsi:'Arial'};
const T=(t,o={})=>new TextRun(Object.assign({text:t,font:F,size:19},o));
const P=(r,o={})=>new Paragraph(Object.assign({children:Array.isArray(r)?r:[r],spacing:{before:0,after:40,line:260,lineRule:'auto'}},o));
const rows=fs.readFileSync('all_map.txt','utf8').trim().split('\n').map(l=>l.split('\t'));
const title=fs.existsSync('titles.json')?JSON.parse(fs.readFileSync('titles.json','utf8')):{}; /* 記号 → 役職（make_inputs.py が作る） */
const file=c=>(/^[DN]99$/.test(c)?'共通の紙':0)||({D:'先生方',N:'看護部',P:'薬剤部',E:'臨床工学部',R:'研修医',T:'テスト用'})[c[0]];
const LN={style:BorderStyle.SINGLE,size:4,color:'9AA8B2'};const box={top:LN,bottom:LN,left:LN,right:LN};
const W=[1000,2300,3000,1500,1100,1100];const TW=W.reduce((a,b)=>a+b,0);
const cell=(t,w,o={})=>new TableCell({children:[P(T(t,o.run||{}),{spacing:{before:0,after:0,line:240,lineRule:'auto'},alignment:o.align})],width:{size:w,type:WidthType.DXA},margins:{top:40,bottom:40,left:80,right:80},borders:box,shading:o.fill?{type:ShadingType.CLEAR,fill:o.fill,color:'auto'}:undefined});
const head=new TableRow({tableHeader:true,children:['記号','名前','所属','ファイル','送った日','返事'].map((h,i)=>cell(h,W[i],{fill:'0F6E7C',run:{bold:true,color:'FFFFFF'},align:AlignmentType.CENTER}))});
let prev='';const body=rows.map(r=>{const [c,n,d]=r;const g=c[0];const fill=g!==prev&&prev?undefined:undefined;prev=g;
  const nm=n+(title[c]?'（'+title[c]+'）':'');
  return new TableRow({cantSplit:true,children:[cell(c,W[0],{align:AlignmentType.CENTER,run:{bold:true}}),cell(nm,W[1]),cell(d,W[2]),cell(file(c),W[3]),cell('　／　',W[4],{align:AlignmentType.CENTER}),cell('□',W[5],{align:AlignmentType.CENTER})]});});
const doc=new Document({styles:{default:{document:{run:{font:F,size:19}}}},sections:[{properties:{page:{size:{width:11906,height:16838},margin:{top:800,bottom:700,left:1000,right:1000}}},children:[
 P(T('ICU ツール　内容確認　記号と名前の対応表',{bold:true,size:30}),{spacing:{before:0,after:60}}),
 P(T('作成：'+new Date().toISOString().slice(0,10)+'　ICU 小山田',{size:18,color:'444444'})),
 P([T('この表は小山田の手元だけに置く。配らない・掲示しない。',{bold:true,color:'B25E00'}),T('理由：Teams と Excel には記号しか届かないので、この表があれば誰の指摘か分かる一方、外に出ると記号の意味が知られてしまうため。')],{spacing:{before:60,after:60}}),
 P(T('仕分けのときは、Excel のファイルと一緒に、この表の中身（記号・名前・所属）を Claude に渡す。',{size:18})),
 P(T('記号の頭の文字：D 医師／N 看護師／P 薬剤師／E 臨床工学技士／R 研修医（共通）／T テスト用（仕分けで外す）。D99・N99 は誰にでも渡せる共通の紙',{size:18}),{spacing:{before:0,after:120}}),
 new Table({width:{size:TW,type:WidthType.DXA},columnWidths:W,rows:[head,...body]}),
 P(T('全 '+rows.length+' 件（うち 共通の紙 3〈医師・看護師・研修医〉、テスト用 1）',{size:17,color:'444444'}),{spacing:{before:80,after:0}})]}]});
Packer.toBuffer(doc).then(b=>{fs.writeFileSync('ICUツール_記号と名前の対応表.docx',b);console.log('ok',rows.length);});
