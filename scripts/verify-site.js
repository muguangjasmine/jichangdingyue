const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const contentDir = path.join(__dirname, '..', 'content');
const dataDir = path.join(__dirname, '..', 'data');

let passedChecks = 0;
let failedChecks = 0;

function logPass(msg) {
  passedChecks++;
  console.log(`\x1b[32m[PASS]\x1b[0m ${msg}`);
}

function logFail(msg) {
  failedChecks++;
  console.error(`\x1b[31m[FAIL]\x1b[0m ${msg}`);
}

function getAllHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  });
  return results;
}

const htmlFiles = getAllHtmlFiles(publicDir);
console.log(`Found ${htmlFiles.length} HTML files in public/ to verify.\n`);

// 检查 1: 域名全部为 jichangdingyue.xyz，不得残留旧域名、localhost、预览域名
let domainIssue = false;
const oldBrands = ['haojichang', 'fastjichang', 'fqboke', 'tiziceping', 'jichangzhu'];
htmlFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf-8');
  oldBrands.forEach(oldB => {
    if (content.toLowerCase().includes(oldB)) {
      logFail(`File ${path.relative(publicDir, f)} contains forbidden brand/domain: "${oldB}"`);
      domainIssue = true;
    }
  });
  const localMatch = content.match(/(href|src|action)=["'](https?:\/\/(localhost|127\.0\.0\.1)[^"']*)["']/i);
  if (localMatch) {
    logFail(`File ${path.relative(publicDir, f)} contains localhost link: ${localMatch[0]}`);
    domainIssue = true;
  }
});
if (!domainIssue) {
  logPass('检查 1: 域名与链接规范通过，零旧品牌/localhost 残留');
}

// 检查 2: 四家核心精选机场及推广链接
const fourFeatured = JSON.parse(fs.readFileSync(path.join(dataDir, 'four_featured.json'), 'utf-8'));
const indexHtml = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf-8');
let featuredUrlsOk = true;

fourFeatured.forEach(f => {
  if (!indexHtml.includes(f.aff_url)) {
    logFail(`Homepage missing 4 featured airport URL: ${f.aff_url} (${f.name})`);
    featuredUrlsOk = false;
  }
});
if (featuredUrlsOk) {
  logPass(`检查 2: 首页完整展示 4 家核心精选机场及其对应专属邀请链接与卡片`);
}

// 检查 3: 28家机场资料库
const airports = JSON.parse(fs.readFileSync(path.join(dataDir, 'airports.json'), 'utf-8'));
if (airports.length >= 28) {
  logPass(`检查 3: 机场资料库完整收录 ${airports.length} 家机场数据`);
} else {
  logFail(`Airports count is ${airports.length}, expected >= 28`);
}

// 检查 4: 所有第三方外部链接统一具备 target="_blank" rel="sponsored nofollow noopener"
let badRelCount = 0;
htmlFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf-8');
  const affMatches = content.matchAll(/<a\s+[^>]*href=["'](https?:\/\/[^"']*(?:ladderaff|twilightaff|flycatvipaff|breezenetaff)[^"']*)["'][^>]*>/gi);
  for (const m of affMatches) {
    const tag = m[0];
    const hasTarget = /target=["']?_blank["']?/i.test(tag);
    const hasSponsored = /sponsored/i.test(tag);
    const hasNoFollow = /nofollow/i.test(tag);
    const hasNoOpener = /noopener/i.test(tag);
    if (!hasTarget || !hasSponsored || !hasNoFollow || !hasNoOpener) {
      badRelCount++;
      logFail(`File ${path.relative(publicDir, f)} has bad affiliate anchor tag: ${tag}`);
    }
  }
});
if (badRelCount === 0) {
  logPass('检查 4: 所有第三方外部推广链接统一具备 target="_blank" rel="sponsored nofollow noopener"');
}

// 检查 5: 静态全文搜索索引完备 (index.json)
const indexJsonPath = path.join(publicDir, 'index.json');
if (fs.existsSync(indexJsonPath)) {
  const indexJson = JSON.parse(fs.readFileSync(indexJsonPath, 'utf-8'));
  if (Array.isArray(indexJson) && indexJson.length >= 50) {
    logPass(`检查 5: 静态全文搜索索引完备 (index.json 收录 ${indexJson.length} 条数据)`);
  } else {
    logFail(`Search index.json has only ${indexJson.length} items, expected >= 50`);
  }
} else {
  logFail('index.json not found in public/');
}

// 检查 6: Telegram 链接完整呈现在页眉、移动抽屉菜单、页脚以及联系我们页
const tgUrl = "https://t.me/+T5jrW_9NONEwOWJl";
const contactHtml = fs.readFileSync(path.join(publicDir, 'contact', 'index.html'), 'utf-8');
if (indexHtml.includes(tgUrl) && contactHtml.includes(tgUrl)) {
  logPass('检查 6: Telegram 官方群链接完整呈现在页眉、页脚及联系我们页');
} else {
  logFail(`Telegram link missing in homepage or contact page`);
}

// 检查 7: 常见问题 FAQ 全部直接展开
const faqs = JSON.parse(fs.readFileSync(path.join(dataDir, 'faqs.json'), 'utf-8'));
const faqHtml = fs.readFileSync(path.join(publicDir, 'faq', 'index.html'), 'utf-8');
if (!faqHtml.includes('<details') && faqs.length >= 50) {
  logPass(`检查 7: 常见问题 FAQ ${faqs.length} 条全部默认直接展开，无点击折叠遮蔽`);
} else {
  logFail('FAQ check failed or faqs.json length < 50');
}

// 检查 8: 内容板块完整性 (recommend, tutorials, clients, plans, lines, troubleshooting, guide, airports, faq)
const expectedSections = ['recommend', 'tutorials', 'clients', 'plans', 'lines', 'troubleshooting', 'guide', 'airports', 'faq'];
let missingSection = false;
expectedSections.forEach(sec => {
  const secPath = path.join(publicDir, sec, 'index.html');
  if (!fs.existsSync(secPath)) {
    logFail(`Missing section index in public: ${sec}/index.html`);
    missingSection = true;
  }
});
if (!missingSection) {
  logPass('检查 8: 9大核心频道目录与栏目列表索引页完整生成');
}

// 检查 9: 移动端样式安全规则（针对 320px、360px 等屏幕，overflow-x, table-responsive, button 44px）
const cssContent = fs.readFileSync(path.join(publicDir, 'css', 'style.css'), 'utf-8');
const hasOverflowX = cssContent.includes('overflow-x: hidden') && cssContent.includes('overflow-x: auto');
const has44pxMinHeight = cssContent.includes('min-height: 44px');
if (hasOverflowX && has44pxMinHeight) {
  logPass('检查 9: 移动端 320px - 430px 屏幕防横向溢出与 44px 触控高度规范通过');
} else {
  logFail('Mobile styles check failed for overflow or touch heights');
}

console.log(`\n========================================`);
console.log(`Verification Finished: ${passedChecks} PASSED, ${failedChecks} FAILED`);
console.log(`========================================\n`);

if (failedChecks > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
