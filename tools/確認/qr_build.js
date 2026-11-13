// チェック表に入れる QR コードの画像を作る。使い方： node tools/確認/qr_build.js data.json 出力フォルダ（qr/）
// 作るもの：項目ごと（#k=ID）、確認モード（_review）、ふつうに開く（_top）。要るもの： npm install qrcode
const QR=require('qrcode'),fs=require('fs'),path=require('path');
const G=JSON.parse(fs.readFileSync(process.argv[2],'utf8')),out=process.argv[3];fs.mkdirSync(out,{recursive:true});
const URL='https://koki2983.github.io/icu-tool/';
(async()=>{const list=[['_review',URL+'#review'],['_top',URL]];G.parts.forEach(p=>p.tops.forEach(t=>list.push([t.id,URL+'#k='+t.id])));
for(const [id,u] of list) await QR.toFile(path.join(out,id+'.png'),u,{margin:1,width:300,errorCorrectionLevel:'M'});console.log('QR',list.length);})();
