const fs = require('fs');
const path = require('path');

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const mdFiles = getAllFiles('content');
const linkRegex = /\[([^\]]+)\]\(([^)#?]+)\)/g;
const linksFound = [];

mdFiles.forEach(file => {
  const text = fs.readFileSync(file, 'utf-8');
  let match;
  while ((match = linkRegex.exec(text)) !== null) {
    if (match[2].startsWith('/')) {
      linksFound.push({ file: path.relative('content', file), text: match[1], url: match[2] });
    }
  }
});

const missingLinks = [];
linksFound.forEach(item => {
  let cleanUrl = item.url.replace(/^\//, '').replace(/\/$/, '');
  let found = false;
  if (!cleanUrl) {
    found = true;
  } else {
    const p1 = path.join('content', cleanUrl + '.md');
    const p2 = path.join('content', cleanUrl, '_index.md');
    const p3 = path.join('content', cleanUrl, 'index.md');
    if (fs.existsSync(p1) || fs.existsSync(p2) || fs.existsSync(p3)) {
      found = true;
    }
  }
  if (!found) {
    missingLinks.push(item);
  }
});

console.log('Total internal links:', linksFound.length);
console.log('Missing target links count:', missingLinks.length);
if (missingLinks.length > 0) {
  console.log(JSON.stringify(missingLinks, null, 2));
}
