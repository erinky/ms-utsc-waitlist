// 로컬 테스트용 정적 서버: node ms-utsc-waitlist/serve.js → http://localhost:4330
const http = require('http');
const fs = require('fs');
const path = require('path');
http.createServer((req, res) => {
  fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
    if (err) { res.writeHead(500); return res.end('error'); }
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(data);
  });
}).listen(4330, () => console.log('listening on 4330'));
