const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();let ok=0,ng=0;
for(let i=0;i<12;i++){const id=['ntg','dex','heparin','nad'][i%4];const p=await b.newPage({viewport:{width:390,height:844}});
  await p.goto(process.argv[2]+'#k='+id,{waitUntil:'load'});await p.waitForTimeout(1500);
  const r=await p.evaluate(()=>{const dk=document.querySelector('.dkpanel');return (dk?'OK':'NONE')+' page='+(document.querySelector('nav button.on')||{dataset:{}}).dataset.p+' hash='+location.hash;});
  if(r.startsWith('OK'))ok++;else{ng++;console.log(id,r);}await p.close();}
console.log('ok',ok,'ng',ng);await b.close();})();
