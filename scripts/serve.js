const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 1314;
const PUBLIC_DIR = path.join(__dirname, '../public');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath.endsWith('/')) {
    reqPath += 'index.html';
  } else if (!path.extname(reqPath)) {
    const tryDir = path.join(PUBLIC_DIR, reqPath, 'index.html');
    if (fs.existsSync(tryDir)) {
      reqPath += '/index.html';
    }
  }

  let filePath = path.join(PUBLIC_DIR, reqPath);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(PUBLIC_DIR, '404.html');
    if (!fs.existsSync(filePath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }
  }

  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Server Error');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🌐 机场Review (jichangreview.cfd) 本地网页服务已启动！`);
  console.log(`🔗 首页入口:       http://localhost:${PORT}/`);
  console.log(`👉 28家机场资料库: http://localhost:${PORT}/airports/`);
  console.log(`👉 新手怎么选:     http://localhost:${PORT}/choose/`);
  console.log(`👉 常见问题50问:   http://localhost:${PORT}/faq/`);
  console.log(`==================================================\n`);
});
