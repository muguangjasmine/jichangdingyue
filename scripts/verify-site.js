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

// 检查 1: 域名全部为 jichangdingyue.xyz，不得残留旧域名 jichangreview.cfd、localhost、预览域名
let domainIssue = false;
const oldBrands = ['jichangreview.cfd', 'haojichang', 'fastjichang', 'fqboke', 'tiziceping', 'jichangzhu'];
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
  logPass('检查 1: 全站彻底清理旧域名，零 jichangreview.cfd / localhost 残留');
}

// 检查 2: sitemap.xml 正确性
const sitemapPath = path.join(publicDir, 'sitemap.xml');
let sitemapOk = true;
if (fs.existsSync(sitemapPath)) {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
  if (sitemapContent.includes('jichangreview.cfd')) {
    logFail('sitemap.xml contains old domain jichangreview.cfd');
    sitemapOk = false;
  }
  if (sitemapContent.includes('/404.html')) {
    logFail('sitemap.xml contains 404.html');
    sitemapOk = false;
  }
  if (!sitemapContent.includes('https://jichangdingyue.xyz/')) {
    logFail('sitemap.xml missing homepage URL https://jichangdingyue.xyz/');
    sitemapOk = false;
  }
} else {
  logFail('sitemap.xml not found');
  sitemapOk = false;
}
if (sitemapOk) {
  logPass('检查 2: Sitemap 格式与域名完全正确，无 404 与不存在页面');
}

// 检查 3: robots.txt 正确性
const robotsPath = path.join(publicDir, 'robots.txt');
let robotsOk = true;
if (fs.existsSync(robotsPath)) {
  const robotsContent = fs.readFileSync(robotsPath, 'utf-8');
  if (robotsContent.includes('jichangreview.cfd')) {
    logFail('robots.txt contains old domain jichangreview.cfd');
    robotsOk = false;
  }
  if (!robotsContent.includes('Sitemap: https://jichangdingyue.xyz/sitemap.xml')) {
    logFail('robots.txt missing correct Sitemap directive');
    robotsOk = false;
  }
} else {
  logFail('robots.txt not found');
  robotsOk = false;
}
if (robotsOk) {
  logPass('检查 3: robots.txt 正确声明 Sitemap 并指向 https://jichangdingyue.xyz/sitemap.xml');
}

// 检查 4: 全站零 /reviews/ 与 /choose/ 错误内链
let badInternalLinks = 0;
htmlFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf-8');
  const reviewMatch = content.match(/href=["'](\/reviews\/?[^"']*)["']/i);
  if (reviewMatch) {
    badInternalLinks++;
    logFail(`File ${path.relative(publicDir, f)} has bad /reviews/ link: ${reviewMatch[0]}`);
  }
  const chooseMatch = content.match(/href=["'](\/choose\/?[^"']*)["']/i);
  if (chooseMatch) {
    badInternalLinks++;
    logFail(`File ${path.relative(publicDir, f)} has bad /choose/ link: ${chooseMatch[0]}`);
  }
});
if (badInternalLinks === 0) {
  logPass('检查 4: 修复全部 /reviews/ 与 /choose/ 错误内链，零 404 死链');
}

// 检查 5: 404 页面 noindex
const f404Path = path.join(publicDir, '404.html');
let f404Ok = false;
if (fs.existsSync(f404Path)) {
  const f404Content = fs.readFileSync(f404Path, 'utf-8');
  const hasNoIndex = /<meta[^>]*robots[^>]*noindex/i.test(f404Content);
  const hasIndex = /<meta[^>]*robots[^>]*content=["']?index,\s*follow/i.test(f404Content);
  if (hasNoIndex && !hasIndex) {
    f404Ok = true;
    logPass('检查 5: 404 页面已严格设置 noindex, follow，禁止搜索引擎收录 404');
  } else {
    logFail('404.html does not have proper noindex tag or has index, follow');
  }
} else {
  logFail('404.html not found');
}

// 检查 6: 全站单页面唯一 H1 检查
let duplicateH1Count = 0;
htmlFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf-8');
  const h1Matches = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  if (h1Matches.length !== 1) {
    duplicateH1Count++;
    logFail(`File ${path.relative(publicDir, f)} has ${h1Matches.length} H1 tags (expected exactly 1)`);
  }
});
if (duplicateH1Count === 0) {
  logPass(`检查 6: 全站 ${htmlFiles.length} 个页面全部具有且仅有 1 个主 H1，无重复堆叠`);
}

// 检查 7: 彻底删除 AI 与影音相关主题词汇
let aiTermsCount = 0;
const forbiddenAiTerms = ['ChatGPT', 'Claude', 'Netflix', 'Disney+', 'AI特化', 'AI生产力', 'AI解锁', '流媒体解锁'];
htmlFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf-8');
  forbiddenAiTerms.forEach(term => {
    if (content.includes(term)) {
      aiTermsCount++;
      logFail(`File ${path.relative(publicDir, f)} contains forbidden AI/streaming term: "${term}"`);
    }
  });
});
if (aiTermsCount === 0) {
  logPass('检查 7: 彻底清理 AI、ChatGPT、Claude、Netflix、流媒体解锁等无关主题');
}

// 检查 8: 第三方外部链接统一具备 target="_blank" rel="sponsored nofollow noopener"
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
  logPass('检查 8: 所有第三方外部推广链接统一具备 target="_blank" rel="sponsored nofollow noopener"');
}

// 检查 9: Canonical 规范性
let badCanonicalCount = 0;
htmlFiles.forEach(f => {
  if (path.basename(f) === '404.html') return;
  const content = fs.readFileSync(f, 'utf-8');
  const canMatches = content.match(/<link\s+rel=["']?canonical["']?\s+href=["']?([^"'>]+)["']?[^>]*>/gi) || [];
  if (canMatches.length !== 1) {
    badCanonicalCount++;
    logFail(`File ${path.relative(publicDir, f)} has ${canMatches.length} canonical tags (expected 1)`);
  } else {
    const url = canMatches[0];
    if (!url.includes('https://jichangdingyue.xyz/')) {
      badCanonicalCount++;
      logFail(`File ${path.relative(publicDir, f)} has invalid canonical domain: ${url}`);
    }
  }
});
if (badRelCount === 0 && badCanonicalCount === 0) {
  logPass('检查 9: 所有内容页面具备唯一且正确的 Canonical 链接 (https://jichangdingyue.xyz/...)');
}

// 检查 10: JSON-LD 结构化数据完备与格式正确
let badSchemaCount = 0;
htmlFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf-8');
  const scriptMatches = content.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi);
  for (const m of scriptMatches) {
    try {
      const parsed = JSON.parse(m[1]);
      if (JSON.stringify(parsed).includes('jichangreview.cfd')) {
        badSchemaCount++;
        logFail(`File ${path.relative(publicDir, f)} Schema contains old domain`);
      }
    } catch (e) {
      badSchemaCount++;
      logFail(`File ${path.relative(publicDir, f)} Schema JSON parse error: ${e.message}`);
    }
  }
});
if (badSchemaCount === 0) {
  logPass('检查 10: Schema 结构化数据 (JSON-LD) 语法完全有效，域名与结构规范');
}

// 检查 11: Telegram 与 28家机场库
const fourFeatured = JSON.parse(fs.readFileSync(path.join(dataDir, 'four_featured.json'), 'utf-8'));
const airports = JSON.parse(fs.readFileSync(path.join(dataDir, 'airports.json'), 'utf-8'));
const tgUrl = "https://t.me/+T5jrW_9NONEwOWJl";
const indexHtml = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf-8');
const contactHtml = fs.readFileSync(path.join(publicDir, 'contact', 'index.html'), 'utf-8');

if (indexHtml.includes(tgUrl) && contactHtml.includes(tgUrl) && airports.length >= 28 && fourFeatured.length === 4) {
  logPass('检查 11: 4家精选与28家机场数据库完备，Telegram 官方链接全站统一');
} else {
  logFail('Check 11 failed for airports or Telegram');
}

console.log(`\n========================================`);
console.log(`Verification Finished: ${passedChecks} PASSED, ${failedChecks} FAILED`);
console.log(`========================================\n`);

if (failedChecks > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
