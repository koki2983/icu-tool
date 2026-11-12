// テスト用サーバー：?slow があると index を 5 秒遅らせる。ETag つき
const http=require('http'),fs=require('fs'),path=require('path'),crypto=require('crypto');
let slow=false;
http.createServer((q,r)=>{let u=decodeURIComponent(q.url.split('?')[0]);
  if(u==='/__slow'){slow=true;return r.end('ok');} if(u==='/__fast'){slow=false;return r.end('ok');}
  if(u==='/')u='/index.html';const f=path.join('/home/claude/srv',u);
  fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);return r.end();}
    const et='"'+crypto.createHash('md5').update(d).digest('hex')+'"';
    const send=()=>{if(q.headers['if-none-match']===et){r.writeHead(304,{etag:et});return r.end();}
      r.writeHead(200,{etag:et,'content-type':u.endsWith('.html')?'text/html; charset=utf-8':u.endsWith('.js')?'text/javascript':u.endsWith('.png')?'image/png':'application/octet-stream'});r.end(d);};
    if(slow&&u==='/index.html')setTimeout(send,5000);else send();});
}).listen(8770,'127.0.0.1');
