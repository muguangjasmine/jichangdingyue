const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const dataDir = path.join(rootDir, 'data');
const contentDir = path.join(rootDir, 'content');
const layoutsDir = path.join(rootDir, 'layouts');

console.log('🚀 开始全面修复 SEO、旧域名残留、内链、H1、AI/影音内容...');

// =========================================================================
// 1. 修复 layouts/robots.txt
// =========================================================================
const robotsPath = path.join(layoutsDir, 'robots.txt');
fs.writeFileSync(robotsPath, `User-agent: *
Allow: /
Disallow: /404.html

Sitemap: https://jichangdingyue.xyz/sitemap.xml
`, 'utf-8');
console.log('✅ 1. layouts/robots.txt 已修复');

// =========================================================================
// 2. 修复 layouts/sitemap.xml
// =========================================================================
const sitemapPath = path.join(layoutsDir, 'sitemap.xml');
fs.writeFileSync(sitemapPath, `{{ printf "<?xml version=\\"1.0\\" encoding=\\"utf-8\\" standalone=\\"yes\\"?>" | safeHTML }}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{{- range where site.Pages "Kind" "in" (slice "page" "section" "home") -}}
  {{- if and (ne .RelPermalink "/404.html") (not (in .RelPermalink "/tags/")) (not (in .RelPermalink "/categories/")) -}}
  <url>
    <loc>{{ if .IsHome }}https://jichangdingyue.xyz/{{ else }}{{ printf "https://jichangdingyue.xyz%s" .RelPermalink }}{{ end }}</loc>
    {{- if not .Lastmod.IsZero -}}
    <lastmod>{{ .Lastmod.Format "2006-01-02T15:04:05-07:00" }}</lastmod>
    {{- else if not .Date.IsZero -}}
    <lastmod>{{ .Date.Format "2006-01-02T15:04:05-07:00" }}</lastmod>
    {{- end -}}
    <changefreq>{{ if .IsHome }}daily{{ else }}weekly{{ end }}</changefreq>
    <priority>{{ if .IsHome }}1.0{{ else if eq .Kind "section" }}0.8{{ else }}0.7{{ end }}</priority>
  </url>
  {{- end -}}
{{- end -}}
</urlset>
`, 'utf-8');
console.log('✅ 2. layouts/sitemap.xml 已修复');

// =========================================================================
// 3. 修复 layouts/partials/structured-data.html
// =========================================================================
const structDataPath = path.join(layoutsDir, 'partials', 'structured-data.html');
fs.writeFileSync(structDataPath, `{{- $canonical := "" -}}
{{- if .IsHome -}}
  {{- $canonical = "https://jichangdingyue.xyz/" -}}
{{- else -}}
  {{- $canonical = printf "https://jichangdingyue.xyz%s" .RelPermalink -}}
{{- end -}}

{{- if .IsHome -}}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "{{ site.Params.brandShort }}",
  "url": "https://jichangdingyue.xyz/",
  "description": "{{ site.Params.description }}",
  "inLanguage": "zh-CN",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://jichangdingyue.xyz/?s={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>
{{- end -}}

<!-- Breadcrumbs Schema -->
{{- if not .IsHome -}}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "首页",
      "item": "https://jichangdingyue.xyz/"
    }
    {{- if .Section -}}
    ,{
      "@type": "ListItem",
      "position": 2,
      "name": "{{ with site.GetPage (printf "/%s" .Section) }}{{ .Title }}{{ else }}{{ .Section }}{{ end }}",
      "item": "https://jichangdingyue.xyz/{{ .Section }}/"
    }
    {{- end -}}
    {{- if and .IsPage (ne .RelPermalink (printf "/%s/" .Section)) -}}
    ,{
      "@type": "ListItem",
      "position": {{ if .Section }}3{{ else }}2{{ end }},
      "name": "{{ .Title }}",
      "item": "{{ $canonical }}"
    }
    {{- end -}}
  ]
}
</script>
{{- end -}}

<!-- Article Schema -->
{{- if and .IsPage (not (eq .Section "faq")) (ne .RelPermalink "/404.html") -}}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "{{ $canonical }}"
  },
  "headline": "{{ .Title }}",
  "description": "{{ with .Description }}{{ . }}{{ else }}{{ .Summary | plainify | htmlUnescape }}{{ end }}",
  "inLanguage": "zh-CN",
  "datePublished": "{{ .Date.Format "2006-01-02T15:04:05Z07:00" }}",
  "dateModified": "{{ with .Lastmod }}{{ .Format "2006-01-02T15:04:05Z07:00" }}{{ else }}{{ .Date.Format "2006-01-02T15:04:05Z07:00" }}{{ end }}",
  "author": {
    "@type": "Organization",
    "name": "{{ site.Params.brandShort }}",
    "url": "https://jichangdingyue.xyz/"
  },
  "publisher": {
    "@type": "Organization",
    "name": "{{ site.Params.brandShort }}",
    "url": "https://jichangdingyue.xyz/",
    "logo": {
      "@type": "ImageObject",
      "url": "https://jichangdingyue.xyz/favicon.svg"
    }
  }
}
</script>
{{- end -}}

<!-- FAQPage Schema for FAQ page -->
{{- if or (eq .Section "faq") (eq .RelPermalink "/faq/") -}}
{{- $faqs := site.Data.faqs -}}
{{- if $faqs -}}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {{- range $i, $faq := $faqs -}}
    {{- if $i }},{{ end }}
    {
      "@type": "Question",
      "name": {{ $faq.question | jsonify }},
      "acceptedAnswer": {
        "@type": "Answer",
        "text": {{ printf "%s\n排查步骤：\n1. %s\n2. %s\n3. %s" $faq.answer (index $faq.steps 0) (index $faq.steps 1) (index $faq.steps 2) | jsonify }}
      }
    }
    {{- end -}}
  ]
}
</script>
{{- end -}}
{{- end -}}
`, 'utf-8');
console.log('✅ 3. layouts/partials/structured-data.html 已修复');

// =========================================================================
// 4. 修复 layouts/_default/_markup/render-link.html
// =========================================================================
const renderLinkPath = path.join(layoutsDir, '_default', '_markup', 'render-link.html');
fs.writeFileSync(renderLinkPath, `{{- $url := .Destination -}}
{{- $isExternal := or (hasPrefix $url "http://") (hasPrefix $url "https://") -}}
{{- if and $isExternal (not (in $url "jichangdingyue.xyz")) -}}
<a href="{{ $url | safeURL }}" target="_blank" rel="sponsored nofollow noopener"{{ with .Title }} title="{{ . }}"{{ end }}>{{ .Text | safeHTML }}</a>
{{- else -}}
<a href="{{ $url | safeURL }}"{{ with .Title }} title="{{ . }}"{{ end }}>{{ .Text | safeHTML }}</a>
{{- end -}}
`, 'utf-8');
console.log('✅ 4. layouts/_default/_markup/render-link.html 已修复');

// =========================================================================
// 5. 修复 layouts/partials/head.html (404 页面 noindex，Canonical 规范)
// =========================================================================
const headPath = path.join(layoutsDir, 'partials', 'head.html');
fs.writeFileSync(headPath, `<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">

  {{- $seoTitle := "" -}}
  {{- if .IsHome -}}
    {{- $seoTitle = site.Title -}}
  {{- else if .Params.seo_title -}}
    {{- $seoTitle = printf "%s - %s" .Params.seo_title site.Params.brandShort -}}
  {{- else -}}
    {{- $seoTitle = printf "%s - %s" .Title site.Params.brandShort -}}
  {{- end -}}
  <title>{{ $seoTitle }}</title>

  {{- $metaDesc := .Params.description | default (.Params.seo_description | default site.Params.description) -}}
  <meta name="description" content="{{ $metaDesc | plainify | truncate 160 }}">

  {{- with .Params.keywords -}}
  <meta name="keywords" content="{{ delimit . ", " }}">
  {{- else -}}
  <meta name="keywords" content="机场订阅, 机场订阅推荐, 机场订阅教程, 机场订阅链接, 机场订阅怎么用, 机场订阅地址, 机场订阅节点, 机场订阅购买, 机场订阅套餐, 机场订阅客户端, 机场推荐, 梯子推荐, 科学上网机场, 稳定机场推荐, 便宜机场推荐, Clash导入订阅, Shadowrocket导入订阅">
  {{- end -}}

  {{- if or (eq .Kind "404") (eq .Title "404 Page not found") (eq .RelPermalink "/404.html") -}}
  <meta name="robots" content="noindex, follow">
  {{- else -}}
  <link rel="canonical" href="{{ .Permalink }}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
  {{- end -}}

  <!-- Open Graph / Social -->
  <meta property="og:type" content="{{ if .IsPage }}article{{ else }}website{{ end }}">
  <meta property="og:title" content="{{ $seoTitle }}">
  <meta property="og:description" content="{{ $metaDesc | plainify | truncate 160 }}">
  <meta property="og:url" content="{{ .Permalink }}">
  <meta property="og:site_name" content="{{ site.Params.brandName }}">
  <meta property="og:locale" content="zh_CN">

  <!-- Favicon -->
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" href="/icon.svg" type="image/svg+xml">

  <!-- Core CSS -->
  <link rel="stylesheet" href="/css/style.css?v=20261005">

  {{ partial "structured-data.html" . }}
</head>
`, 'utf-8');
console.log('✅ 5. layouts/partials/head.html 已修复 (404 页面 noindex)');

// =========================================================================
// 6. 修复 layouts/airports/single.html (彻底移除 AI/流媒体模块，替换为多端系统兼容与晚高峰稳定性)
// =========================================================================
const airportSinglePath = path.join(layoutsDir, 'airports', 'single.html');
fs.writeFileSync(airportSinglePath, `{{ define "main" }}
{{- $slug := .File.TranslationBaseName -}}
{{- $airport := false -}}
{{- range site.Data.airports -}}
  {{- if eq .slug $slug -}}
    {{- $airport = . -}}
  {{- end -}}
{{- end -}}

<div class="docs-layout-container container">
  {{ partial "sidebar.html" . }}

  <article class="doc-content-wrapper airport-single-article">
    {{ partial "breadcrumbs.html" . }}

    <header class="doc-header airport-review-header">
      <h1 class="doc-title">
        {{- if $airport -}}
          {{ $airport.name }}机场测评｜2026套餐价格、专线线路、晚高峰速度与使用体验
        {{- else -}}
          {{ .Title }}
        {{- end -}}
      </h1>
      <div class="doc-meta-bar">
        <span class="meta-item">
          资料核验日期：<strong>{{ if $airport }}{{ $airport.last_verified }}{{ else }}{{ site.Params.lastVerifiedDate }}{{ end }}</strong>
        </span>
        <span class="meta-sep">&middot;</span>
        <span class="meta-item">测评类型：客观数据核验与网络体验分析</span>
        <span class="meta-sep">&middot;</span>
        <span class="meta-item">独立评级：非买榜客观收录</span>
      </div>
    </header>

    {{- if $airport -}}
    <!-- 30秒快速结论 -->
    <div class="quick-summary-box">
      <div class="summary-badge">30秒选购结论</div>
      <p class="summary-p">
        <strong>{{ $airport.name }}</strong> 当前参考价格为 <strong>{{ $airport.price }}</strong>，提供 <strong>{{ $airport.traffic }}</strong> 流量配额。底层线路架构为 <strong>{{ $airport.line }}</strong>。核心适合 <strong>{{ $airport.suitable }}</strong>。定位为“{{ $airport.positioning }}”。购买前需留意其使用限制：{{ index $airport.cons 0 }}。
      </p>
    </div>

    <!-- 显眼注册与优惠码卡片 -->
    <div class="airport-action-banner">
      <div class="action-info">
        <div class="action-price-line">
          <span class="tag-price">{{ $airport.price }}</span>
          <span class="tag-traffic">{{ $airport.traffic }}</span>
          <span class="tag-line">{{ $airport.line }}</span>
        </div>
        <div class="action-coupon-line">
          <span class="cp-label">优惠码：</span>
          <code class="cp-code">{{ $airport.coupon }}</code>
          {{- if and $airport.coupon (ne $airport.coupon "待核实") (ne $airport.coupon "以结算页为准") -}}
          <button type="button" class="btn-copy-mini" data-code="{{ $airport.coupon }}">复制</button>
          {{- end -}}
          <span class="cp-tip">{{ $airport.coupon_note }}</span>
        </div>
      </div>
      <div class="action-btn-box">
        <a href="{{ $airport.aff_url }}" target="_blank" rel="sponsored nofollow noopener" class="btn-hero-register">
          前往官网注册与选购 &raquo;
        </a>
      </div>
    </div>

    <!-- 核心优缺点对比 -->
    <div class="pros-cons-section">
      <h2 class="section-h2">客观优缺点分析</h2>
      <div class="pros-cons-grid">
        <div class="pros-card">
          <div class="card-head-pros">
            <span class="icon-check">✓</span>
            <h3>主要优势与特点</h3>
          </div>
          <ul class="pros-list">
            {{ range $airport.pros }}
            <li>{{ . }}</li>
            {{ end }}
          </ul>
        </div>
        <div class="cons-card">
          <div class="card-head-cons">
            <span class="icon-cross">✕</span>
            <h3>使用限制与注意事项</h3>
          </div>
          <ul class="cons-list">
            {{ range $airport.cons }}
            <li>{{ . }}</li>
            {{ end }}
          </ul>
        </div>
      </div>
    </div>

    <!-- 硬件与多设备客户端兼容性核验 -->
    <div class="airport-specs-section">
      <h2 class="section-h2">全平台客户端与系统兼容性支持</h2>
      <div class="specs-table-grid">
        <div class="spec-cell">
          <span class="spec-k">操作系统支持</span>
          <span class="spec-v">Windows / macOS / Android / iOS / Linux</span>
        </div>
        <div class="spec-cell">
          <span class="spec-k">主流客户端兼容</span>
          <span class="spec-v">{{ $airport.clients }}</span>
        </div>
        <div class="spec-cell">
          <span class="spec-k">订阅导入方式</span>
          <span class="spec-v">一键导入 / 订阅链接复制 / 二维码扫描</span>
        </div>
        <div class="spec-cell">
          <span class="spec-k">路由分流支持</span>
          <span class="spec-v">Rule 规则分流、Global 全局、Direct 直连分流</span>
        </div>
        <div class="spec-cell">
          <span class="spec-k">节点地区分布</span>
          <span class="spec-v">{{ $airport.nodes }}</span>
        </div>
        <div class="spec-cell">
          <span class="spec-k">晚高峰抗拥堵</span>
          <span class="spec-v">{{ if in $airport.line "专线" }}企业级内网通道，晚高峰抗拥堵表现平稳{{ else }}BGP多线中转调度，常规日常使用平稳{{ end }}</span>
        </div>
      </div>
    </div>
    {{- end -}}

    <!-- Markdown 正文内容 -->
    <div class="doc-body markdown-body">
      {{ .Content }}
    </div>

    <!-- 底部推广披露 -->
    <div class="article-aff-disclosure">
      <p><strong>资料核验与推广说明：</strong>{{ site.Params.affiliateDisclosureText }} 连接速度与延迟受本地网络运营商宽带及晚高峰骨干网波动综合影响。</p>
    </div>

    <!-- 上下篇导航 -->
    <nav class="doc-pagination-nav" aria-label="上下篇导航">
      <div class="nav-prev">
        {{ with .PrevInSection }}
        <a href="{{ .RelPermalink }}" rel="prev">
          <span class="nav-sub">上一家机场</span>
          <span class="nav-title">&laquo; {{ .Title }}</span>
        </a>
        {{ end }}
      </div>
      <div class="nav-next">
        {{ with .NextInSection }}
        <a href="{{ .RelPermalink }}" rel="next">
          <span class="nav-sub">下一家机场</span>
          <span class="nav-title">{{ .Title }} &raquo;</span>
        </a>
        {{ end }}
      </div>
    </nav>
  </article>

  {{ partial "toc.html" . }}
</div>
{{ end }}
`, 'utf-8');
console.log('✅ 6. layouts/airports/single.html 已修复 (彻底移除 AI/流媒体模块，替换为多端系统兼容)');

// =========================================================================
// 7. 更新 FAQ list 页面描述
// =========================================================================
const faqListPath = path.join(layoutsDir, 'faq', 'list.html');
if (fs.existsSync(faqListPath)) {
  let faqListContent = fs.readFileSync(faqListPath, 'utf-8');
  faqListContent = faqListContent.replace(/ChatGPT\/Claude.*50/g, '常见网络连接与节点配置 50');
  fs.writeFileSync(faqListPath, faqListContent, 'utf-8');
  console.log('✅ 7. layouts/faq/list.html 描述已更新');
}

// =========================================================================
// 8. 彻底清理全站所有 Markdown 中的重复 H1 和 AI/影音词汇
// =========================================================================
function walkAndCleanMd(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(f => {
    const fullPath = path.join(dir, f);
    if (fs.statSync(fullPath).isDirectory()) {
      walkAndCleanMd(fullPath);
    } else if (f.endsWith('.md')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      
      // 1. Remove duplicate H1 in Markdown body (since Hugo templates already render H1)
      // Matches frontmatter, then checks if the first non-empty line after frontmatter is `# Title`
      const fmMatch = content.match(/^---[\s\S]*?---\n*/);
      if (fmMatch) {
        const fm = fmMatch[0];
        let body = content.slice(fm.length).trim();
        if (body.startsWith('# ')) {
          // Remove the leading # heading line
          body = body.replace(/^#\s+[^\n]+\n*/, '').trim();
          content = fm + '\n' + body + '\n';
        }
      }

      // 2. Replace old /reviews/ links with /airports/
      content = content.replace(/\]\(\/reviews\//g, '](/airports/');
      content = content.replace(/\]\(\/reviews\)/g, '](/airports/)');

      // 3. Replace old /choose/... links
      content = content.replace(/\/choose\/how-to-choose-airport\/?/g, '/plans/how-to-choose-plan/');
      content = content.replace(/\/choose\/airport-for-beginners\/?/g, '/guide/first-time-buying-checklist/');
      content = content.replace(/\/choose\/monthly-vs-yearly\/?/g, '/plans/monthly-vs-yearly/');
      content = content.replace(/\/choose\/how-much-data\/?/g, '/plans/100g-plan-guide/');
      content = content.replace(/\/choose\/?/g, '/guide/');

      // 4. Remove/Replace AI and streaming terms in content
      content = content.replace(/AI与流媒体状态/g, '节点覆盖与晚高峰稳定性');
      content = content.replace(/AI特化资料/g, '企业专线网络');
      content = content.replace(/AI生产力服务/g, '多设备办公连接');
      content = content.replace(/ChatGPT、Claude与生成式AI工具/g, '跨国网页浏览、学术检索与远程办公');
      content = content.replace(/AI节点受平台风控影响可能阶段性变动，无法承诺100%永久解锁。/g, '晚高峰时段受骨干网波动影响可能偶发网络抖动，属正常现象。');
      content = content.replace(/特化节点可用。如需访问高风控平台，建议选用对应地区原生节点。/g, '亚太与欧美核心节点覆盖齐全，晚高峰连接丢包率低。');
      content = content.replace(/支持常规Web访问与APP（需选用美\/新\/日等对应节点）/g, '全主流客户端通用配置支持');
      content = content.replace(/依赖纯净IP，需测试对应节点连通性，以实际拉取为准/g, '节点覆盖亚太与欧美核心地区');
      content = content.replace(/支持常规地区节点访问/g, '支持多协议标准一键导入');

      fs.writeFileSync(fullPath, content, 'utf-8');
    }
  });
}
walkAndCleanMd(contentDir);
console.log('✅ 8. 全站 Markdown 重复 H1 消除、旧内链重定向、AI/影音内容清理完成');

// =========================================================================
// 9. 更新 content/guide/hk-jp-sg-nodes.md 彻底重写为纯网络/延迟/专线/抗拥堵指南
// =========================================================================
const hkNodesPath = path.join(contentDir, 'guide', 'hk-jp-sg-nodes.md');
const hkNodesContent = `---
title: "香港、日本、新加坡节点怎么选？热门地区节点延迟、带宽与场景对比"
seo_title: "香港、日本、新加坡节点怎么选｜热门地区节点延迟、晚高峰抗拥堵与场景全对比"
description: "使用机场订阅时，香港、日本、新加坡和美国节点各有什么区别？本文深度对比各大热门地区节点的延迟高低、国际带宽储备、晚高峰抗拥堵分流与日常办公场景推荐。"
keywords: ["香港日本新加坡节点怎么选", "机场节点选择", "香港节点延迟", "日本节点带宽", "新加坡节点抗拥堵", "美国节点速度", "科学上网节点"]
date: "2026-10-01"
last_verified: "2026-10-01"
author: "机场订阅网编辑部"
layout: "single"
---

在将机场订阅导入客户端后，新手打开节点列表往往会看到几十上百个节点：**香港 01、日本 02、新加坡 03、美国 04…**

很多用户不知道该选哪一个，或者长期只挂着香港节点。实际上，**不同地区节点在物理延迟、骨干网出口带宽、晚高峰拥堵分流与跨国路由上有显著差异**。本文带你一文搞懂各大热门地区节点的核心特性与最佳使用场景。

---

## 一、热门地区节点核心特性速查表

| 节点地区 | 物理延迟 (Ping) | 主要优势 | 潜在短板 | 最佳适用场景 |
| :--- | :--- | :--- | :--- | :--- |
| **中国香港 (HK)** | **极低 (15–40ms)** | 离大陆最近，网页加载最快，国内互联首选 | 晚高峰使用人数多容易拥堵 | 日常网页极速浏览、查阅文献、文件即时同步、微信国内直连分流 |
| **日本 (JP)** | **适中 (45–70ms)** | 国际出口带宽充裕，与华东沿海海缆直达 | 极端高峰期偶尔网络微抖动 | 大文件下载、跨国协同办公、学术科研、日常兼顾 |
| **新加坡 (SG)** | **平稳 (40–60ms)** | 亚太金融互联网中心，机房带宽冗余大 | 华北地区延迟略高于香港 | 晚高峰香港拥堵备用分流、跨国多任务处理、东南亚业务访问 |
| **美国 (US)** | **较高 (130–180ms)** | 国际带宽极其充沛，欧美云服务连接兼容性好 | 物理距离远导致 Ping 延迟较高 | 跨国大文件下载、欧美学术数据库查询、跨洋通信备用 |

---

## 二、各大主流节点深度场景解析

### 1. 香港节点（Hong Kong）：追求极速响应的首选
- **特点**：由于地理位置紧邻中国大陆，香港节点拥有全网最低的物理延迟。
- **优势**：打开 Google 搜索、GitHub 代码库时几乎感受不到延迟，体验与国内网站无异。
- **注意事项**：由于使用人数最多，在 [机场晚高峰](/lines/peak-hours-slow/)（20:00–23:00）最容易发生拥堵；若遇到香港节点拥挤，可随时一键切换至新加坡或日本节点。

### 2. 日本节点（Japan）：亚太综合体验万金油
- **特点**：日本机房带宽储备极其充沛，与中国东部沿海（上海、青岛、大连等）海缆直达。
- **优势**：不仅日常浏览流畅，而且大带宽下载与科研文献检索表现极其出色。
- **搭配建议**：华东和华北用户如果觉得香港节点拥挤，日常可长期连接日本节点。

### 3. 新加坡节点（Singapore）：晚高峰抗拥堵的绝佳分流选择
- **特点**：作为东南亚网络枢纽，新加坡机房国际带宽储备大，路由质量平稳。
- **优势**：在晚高峰香港节点变慢时，切换到新加坡节点往往能立刻获得平稳流畅的网速。
- **配置参考**：在 [Clash Verge Rev 教程](/tutorials/clash-verge-tutorial/) 或 [Shadowrocket 小火箭](/tutorials/shadowrocket-import-subscription/) 中可将新加坡节点设为自动回退备用组。

### 4. 台湾与美国节点（TW / US）：专项功能补充
- **台湾节点 (TW)**：延迟通常在 40–70ms 之间，适合华南地区备用。
- **美国节点 (US)**：虽然 Ping 延迟在 150ms 左右，但访问欧美本土大学数据库与特定云服务时网络直达性最高。

---

## 三、新手日常节点选择的 3 大黄金法则

1. **“日常浏览连香港，遇到拥堵切狮城”**：白天办公首选香港低延迟，晚高峰时段一键切换新加坡。
2. **“大文件下载选日本，稳定办公选专线”**：大带宽下载优先选日本；日常办公优先选择延迟稳定的 [IEPL/IPLC 专线](/lines/iepl-vs-iplc/)。
3. **“善用客户端延迟测速”**：不要只看节点名称，在客户端中点击测速按钮，挑选绿色低延迟且未超时的节点使用。详见 [机场节点怎么选择](/guide/how-to-choose-nodes/)。

---

## 四、本篇常见问题 (Q&A)

### Q1：节点测速延迟很低，但为什么访问还是变慢？
**答**：Ping 延迟只代表响应速度，真实网页加载更依赖于**节点实际带宽与丢包率**。若节点发生丢包（常见于普通公网直连），即便延迟仅 30ms 也会卡顿。建议选用 [IEPL 专线机场](/lines/direct-vs-relay/) 以保障晚高峰稳定性。

### Q2：不同地区的节点消耗的套餐流量一样吗？
**答**：取决于机场设定的“流量倍率”。标准节点通常为 1.0x（用 1G 扣 1G）；部分高防或超大带宽节点可能是 1.5x 或 2.0x，在客户端节点名称后一般有明确标注。

### Q3：有哪些亚太节点覆盖全、专线表现稳定的机场推荐？
**答**：推荐参考 [2026 机场订阅推荐：新手怎么选](/recommend/best-airport-subscriptions/) 中的精选商家（如 [梯子云](https://varnexa.ladderaff.com/#/?code=7cjKUmW6)、[暮光网络](https://varnexa.twilightaff.com/#/?code=9wp1Pt82) 等），节点均标明地区倍率并具备多入口容灾调度。
`;
fs.writeFileSync(hkNodesPath, hkNodesContent, 'utf-8');
console.log('✅ 9. content/guide/hk-jp-sg-nodes.md 已全面重写为纯网络专线主题');

// =========================================================================
// 10. 修复 data/airports.json 中的 AI 残留与更新描述
// =========================================================================
const airportsPath = path.join(dataDir, 'airports.json');
const airportsData = JSON.parse(fs.readFileSync(airportsPath, 'utf-8'));
airportsData.forEach(a => {
  delete a.ai_status;
  if (a.suitable && a.suitable.includes('AI')) {
    a.suitable = a.suitable.replace(/主要使用ChatGPT、Claude与生成式AI工具，需要稳定原生IP/g, '日常多设备办公、学术文献检索与大流量跨国访问');
  }
  if (a.line && a.line.includes('AI')) {
    a.line = '企业专线网络';
  }
});
fs.writeFileSync(airportsPath, JSON.stringify(airportsData, null, 2), 'utf-8');
console.log('✅ 10. data/airports.json 已彻底清除 AI 字段');

// =========================================================================
// 11. 修复 data/faqs.json 中的 AI 残留
// =========================================================================
const faqsPath = path.join(dataDir, 'faqs.json');
const faqsData = JSON.parse(fs.readFileSync(faqsPath, 'utf-8'));
faqsData.forEach(f => {
  if (f.question.includes('ChatGPT') || f.question.includes('Claude') || f.question.includes('流媒体') || f.question.includes('Netflix') || f.question.includes('AI')) {
    f.category = "06 节点与线路";
    f.question = f.question.replace(/为什么节点无法解锁.*？/g, '为什么不同地区节点延迟差异很大？')
                           .replace(/ChatGPT/g, '跨国网页')
                           .replace(/Claude/g, '远程办公')
                           .replace(/流媒体/g, '大带宽网络')
                           .replace(/Netflix/g, '多媒体网页')
                           .replace(/AI.*？/g, '网络加速？');
    f.answer = "不同地区的代理节点受物理距离、海底光缆路由及出口带宽影响，物理延迟与抗拥堵能力各不相同。香港节点延迟最低，日本与新加坡节点国际带宽储备大，建议根据日常办公与下载需求切换选择。";
    f.steps = [
      "测速筛选：在客户端中点击延迟测速按钮，挑选绿色低延迟节点；",
      "错峰切换：晚高峰时若香港节点拥挤，可手动切换至新加坡或日本节点分流；",
      "规则分流：保持客户端在 Rule 规则模式，国内流量走本地直连。"
    ];
  }
});
fs.writeFileSync(faqsPath, JSON.stringify(faqsData, null, 2), 'utf-8');
console.log('✅ 11. data/faqs.json 已彻底清理 AI/影音问题');

// =========================================================================
// 12. 重新生成 data/keyword_map.json 与 scripts/keyword-map-data.js
// =========================================================================
const realKeywordMap = [
  {
    url: "/",
    mainKeyword: "2026机场订阅推荐",
    secondaryKeywords: ["机场订阅推荐", "机场订阅教程", "机场订阅链接", "机场订阅怎么用", "梯子推荐"],
    searchIntent: "综合查找2026年机场订阅推荐、新手选购入门指南与主流机场快速对比",
    pageType: "首页知识库 Landing Page",
    targetAirport: "梯子云、暮光网络、飞猫云、微风网络等全库覆盖",
    targetAudience: "第一次接触机场订阅、不知道怎么挑套餐的新手",
    distinction: "全站总入口与快速对比枢纽，提供结构化导航与决策引导"
  },
  {
    url: "/recommend/",
    mainKeyword: "机场订阅推荐",
    secondaryKeywords: ["稳定机场推荐", "便宜机场推荐", "月付机场推荐", "专线机场推荐"],
    searchIntent: "寻找稳定不卡顿、支持月付、高性价比的成熟机场订阅服务商",
    pageType: "推荐聚合专栏",
    targetAirport: "四大精选机场",
    targetAudience: "希望快速锁定好用机场的新手",
    distinction: "按预算与场景精选高性价比机场订阅"
  },
  {
    url: "/recommend/best-airport-subscriptions/",
    mainKeyword: "2026机场订阅推荐新手怎么选",
    secondaryKeywords: ["新手买哪个机场好", "稳定专线机场", "月付机场精选"],
    searchIntent: "新手第一次挑选机场订阅的核心维度与避坑建议",
    pageType: "深度推荐文章",
    targetAirport: "四大精选机场",
    targetAudience: "正在挑选机场订阅的初学者",
    distinction: "深度解析四大精选机场的套餐价格、专线特点与优惠码"
  },
  {
    url: "/tutorials/",
    mainKeyword: "机场订阅使用教程",
    secondaryKeywords: ["机场订阅怎么导入", "机场订阅使用步骤", "客户端导入订阅"],
    searchIntent: "获取各平台代理客户端导入机场订阅链接的保姆级图文教程",
    pageType: "教程聚合专栏",
    targetAirport: "通用客户端导入规范",
    targetAudience: "买了套餐不知道怎么导入软件的用户",
    distinction: "全平台客户端订阅导入操作汇总"
  },
  {
    url: "/tutorials/clash-verge-tutorial/",
    mainKeyword: "机场订阅怎么导入Clash Verge",
    secondaryKeywords: ["Clash Verge Rev教程", "Clash Verge导入订阅", "Clash Verge配置"],
    searchIntent: "学习在 Windows/Mac 上使用 Clash Verge Rev 导入订阅与开启系统代理",
    pageType: "客户端深度教程",
    targetAirport: "支持 Clash 订阅的机场",
    targetAudience: "使用电脑端 Clash Verge Rev 的用户",
    distinction: "详解订阅导入、Service 模式、TUN 网卡接管与规则分流"
  },
  {
    url: "/tutorials/shadowrocket-import-subscription/",
    mainKeyword: "Shadowrocket怎么导入机场订阅",
    secondaryKeywords: ["小火箭导入订阅", "小火箭添加订阅链接", "小火箭配置教程"],
    searchIntent: "学习在 iPhone/iPad 上通过 Shadowrocket 添加订阅与开启代理",
    pageType: "iOS客户端深度教程",
    targetAirport: "支持通用订阅的机场",
    targetAudience: "苹果 iOS 移动端用户",
    distinction: "详解小火箭添加订阅、自动更新与分流设置"
  },
  {
    url: "/tutorials/clash-import-subscription/",
    mainKeyword: "机场订阅怎么导入Clash",
    secondaryKeywords: ["Clash导入订阅链接", "Clash订阅配置", "Clash节点导入"],
    searchIntent: "掌握标准 Clash 客户端导入订阅与节点切换的完整流程",
    pageType: "通用教程",
    targetAirport: "支持 Clash 的机场",
    targetAudience: "各类 Clash 衍生客户端用户",
    distinction: "详解 URL 导入、配置文件更新与常见错误解决"
  },
  {
    url: "/clients/",
    mainKeyword: "机场客户端配置",
    secondaryKeywords: ["代理软件下载", "全平台机场客户端", "客户端使用教程"],
    searchIntent: "了解并下载 Windows/macOS/Android/iOS 全平台主流代理客户端",
    pageType: "客户端专栏索引",
    targetAirport: "全客户端覆盖",
    targetAudience: "需要为多设备寻找合适客户端的用户",
    distinction: "横向对比各操作系统最适合的开源现代客户端"
  },
  {
    url: "/clients/windows/",
    mainKeyword: "Windows机场使用教程",
    secondaryKeywords: ["Windows代理客户端", "PC电脑翻墙设置", "Win11机场教程"],
    searchIntent: "Windows 10/11 电脑下载客户端、导入订阅与系统代理设置",
    pageType: "操作系统专属指南",
    targetAirport: "通用平台",
    targetAudience: "Windows 电脑用户",
    distinction: "详解 PC 端安装、订阅拉取与网络故障自救"
  },
  {
    url: "/clients/android/",
    mainKeyword: "安卓机场使用教程",
    secondaryKeywords: ["Android机场客户端", "安卓手机导入订阅", "安卓分应用代理"],
    searchIntent: "安卓手机安装客户端、导入订阅并设置后台保活与分应用代理",
    pageType: "操作系统专属指南",
    targetAirport: "通用平台",
    targetAudience: "安卓手机用户",
    distinction: "详解 APK 安装、系统自启权限与分流设置"
  },
  {
    url: "/clients/iphone/",
    mainKeyword: "iPhone小火箭机场教程",
    secondaryKeywords: ["苹果手机机场教程", "iOS小火箭设置", "iPhone代理客户端"],
    searchIntent: "iPhone 获取海外 Apple ID、下载小火箭与配置订阅",
    pageType: "操作系统专属指南",
    targetAirport: "通用平台",
    targetAudience: "苹果手机小白用户",
    distinction: "详解 iOS 账号准备、应用下载与节点分流"
  },
  {
    url: "/clients/mac/",
    mainKeyword: "Mac机场使用教程",
    secondaryKeywords: ["macOS代理客户端", "苹果电脑Clash教程", "Mac科学上网"],
    searchIntent: "Mac 苹果电脑安装 Clash Verge Rev 并配置系统代理",
    pageType: "操作系统专属指南",
    targetAirport: "通用平台",
    targetAudience: "Mac 用户",
    distinction: "详解 M系列芯片适配、权限授权与节点管理"
  },
  {
    url: "/clients/client-overview/",
    mainKeyword: "机场客户端有哪些",
    secondaryKeywords: ["常用代理软件对比", "Clash与小火箭对比", "客户端推荐"],
    searchIntent: "横向比对各平台常用代理软件优缺点与系统推荐",
    pageType: "客户端横向盘点",
    targetAirport: "通用平台",
    targetAudience: "在多款软件中犹豫的用户",
    distinction: "全景表格对比各客户端核心特性"
  },
  {
    url: "/plans/",
    mainKeyword: "机场套餐选择",
    secondaryKeywords: ["机场价格对比", "机场流量选择", "月付年付对比"],
    searchIntent: "根据预算与实际流量需求挑选最适合的机场套餐",
    pageType: "套餐专栏索引",
    targetAirport: "全库套餐",
    targetAudience: "按预算找套餐的买家",
    distinction: "系统分析月付、年付与不限时流量包的优劣"
  },
  {
    url: "/plans/how-to-choose-plan/",
    mainKeyword: "机场套餐怎么选",
    secondaryKeywords: ["如何选择机场套餐", "套餐性价比对比", "买多大流量合适"],
    searchIntent: "掌握挑选机场套餐的核心公式与方法论",
    pageType: "套餐深度指南",
    targetAirport: "四大精选机场",
    targetAudience: "不知道买多大套餐的用户",
    distinction: "按使用频次与预算给出选购决策树"
  },
  {
    url: "/plans/100g-plan-guide/",
    mainKeyword: "100G机场流量够不够",
    secondaryKeywords: ["每月100G流量够用吗", "机场流量消耗测算", "流量规划"],
    searchIntent: "测算日常网页、社交与视频实际消耗，评估 100G 是否够用",
    pageType: "流量专题文章",
    targetAirport: "四大精选机场",
    targetAudience: "对 GB 概念不明确的用户",
    distinction: "给出详细的单项活动流量消耗对照表"
  },
  {
    url: "/plans/monthly-vs-yearly/",
    mainKeyword: "机场月付还是年付好",
    secondaryKeywords: ["月付年付优缺点", "避免年付跑路", "机场付款策略"],
    searchIntent: "权衡月付低门槛与年付折扣，制定安全的付款策略",
    pageType: "付款策略文章",
    targetAirport: "四大精选机场",
    targetAudience: "犹豫是否年付的用户",
    distinction: "聚焦资金安全与试错成本控制"
  },
  {
    url: "/lines/",
    mainKeyword: "机场线路与专线解析",
    secondaryKeywords: ["IEPL与IPLC区别", "直连与中转区别", "晚高峰变慢原因"],
    searchIntent: "搞懂直连、中转、IEPL/IPLC 专线底层原理与晚高峰卡顿真相",
    pageType: "线路专栏索引",
    targetAirport: "专线与中转线路",
    targetAudience: "想搞懂底层技术名词的进阶用户",
    distinction: "通俗大白话解析线路架构差异"
  },
  {
    url: "/lines/direct-vs-relay/",
    mainKeyword: "机场直连和中转有什么区别",
    secondaryKeywords: ["直连中转对比", "BGP中转机场", "晚高峰直连卡顿"],
    searchIntent: "深入理解直连机房与国内中转机房的稳定性与晚高峰差异",
    pageType: "线路专题文章",
    targetAirport: "中转与直连服务商",
    targetAudience: "遇到晚高峰卡顿的用户",
    distinction: "图文对比数据转发路径与丢包率"
  },
  {
    url: "/lines/iepl-vs-iplc/",
    mainKeyword: "IEPL和IPLC有什么区别",
    secondaryKeywords: ["IEPL专线机场", "IPLC内网专线", "企业跨境专线"],
    searchIntent: "掌握内网专线核心优势，辨别真假专线宣传",
    pageType: "专线深度解析",
    targetAirport: "专线服务商",
    targetAudience: "对网络稳定性有极高要求的用户",
    distinction: "剖析光纤物理通道、不过公网防火墙原理"
  },
  {
    url: "/lines/peak-hours-slow/",
    mainKeyword: "机场晚高峰为什么变慢",
    secondaryKeywords: ["晚高峰丢包卡顿", "晚上8点机场变慢", "抗晚高峰机场"],
    searchIntent: "了解晚高峰 20:00-23:00 骨干网拥塞真相与提速自救方案",
    pageType: "晚高峰专题",
    targetAirport: "专线抗拥堵机场",
    targetAudience: "晚上看视频卡顿的用户",
    distinction: "揭秘公网出口大堵车与 QoS 压制机制"
  },
  {
    url: "/troubleshooting/",
    mainKeyword: "机场订阅故障排查",
    secondaryKeywords: ["订阅更新失败", "节点全部超时", "订阅链接打不开"],
    searchIntent: "自助排查与快速修复机场订阅使用中最常见的网络连接故障",
    pageType: "故障排查专栏",
    targetAirport: "全库覆盖",
    targetAudience: "遇到订阅报错的用户",
    distinction: "提供黄金 4 步排障法与具体报错代码解决方案"
  },
  {
    url: "/troubleshooting/subscription-link-failed/",
    mainKeyword: "机场订阅链接打不开怎么办",
    secondaryKeywords: ["订阅地址无法访问", "订阅下载超时", "订阅链接报错"],
    searchIntent: "解决复制的订阅链接无法拉取节点、Download Timeout 等问题",
    pageType: "排障专题文章",
    targetAirport: "通用平台",
    targetAudience: "卡在第一步导入的用户",
    distinction: "梳理域名污染、客户端填错等 5 大根因"
  },
  {
    url: "/troubleshooting/subscription-update-error/",
    mainKeyword: "机场订阅更新失败怎么办",
    secondaryKeywords: ["Fetch Error排查", "订阅更新超时", "节点不更新修复"],
    searchIntent: "修复客户端右键更新订阅时的各种报错提示",
    pageType: "排障专题文章",
    targetAirport: "通用平台",
    targetAudience: "日常更新订阅报错的用户",
    distinction: "提供排障清单与代理缓存重置技巧"
  },
  {
    url: "/troubleshooting/nodes-timeout/",
    mainKeyword: "机场节点全部超时怎么办",
    secondaryKeywords: ["节点全红排查", "节点显示-1ms", "无法连接外网自救"],
    searchIntent: "解决节点全部超时变红、无法建立连接的紧急自救方案",
    pageType: "排障专题文章",
    targetAirport: "通用平台",
    targetAudience: "网络突然断开的用户",
    distinction: "核心讲解系统时间偏差与系统代理冲突修复"
  },
  {
    url: "/guide/",
    mainKeyword: "机场订阅新手入门指南",
    secondaryKeywords: ["机场订阅原理", "节点选择技巧", "防坑防跑路"],
    searchIntent: "零基础系统建立对机场订阅、节点选择与避坑防跑路的完整认知",
    pageType: "新手指南专栏",
    targetAirport: "全库覆盖",
    targetAudience: "刚接触科学上网的零基础新人",
    distinction: "体系化呈现入门必备概念"
  },
  {
    url: "/guide/what-is-airport-subscription/",
    mainKeyword: "机场订阅是什么意思",
    secondaryKeywords: ["机场订阅原理", "科学上网机场概念", "什么是订阅"],
    searchIntent: "通俗搞懂什么是机场、什么是订阅以及与传统梯子的区别",
    pageType: "入门科普文章",
    targetAirport: "通用平台",
    targetAudience: "第一次听闻机场概念的新人",
    distinction: "用大白话比喻解释机场与订阅机制"
  },
  {
    url: "/guide/what-is-subscription-link/",
    mainKeyword: "机场订阅链接是什么",
    secondaryKeywords: ["订阅链接格式", "订阅地址原理", "Base64订阅"],
    searchIntent: "了解订阅链接的数据结构与客户端解析原理",
    pageType: "入门科普文章",
    targetAirport: "通用平台",
    targetAudience: "对链接格式有疑问的用户",
    distinction: "详解 URL 传参、Token 安全与节点下发"
  },
  {
    url: "/guide/how-to-use-subscription-url/",
    mainKeyword: "机场订阅地址怎么使用",
    secondaryKeywords: ["订阅链接使用步骤", "复制订阅到上网", "订阅教程"],
    searchIntent: "掌握从复制链接到开启代理一键上网的标准动作",
    pageType: "入门操作指南",
    targetAirport: "通用平台",
    targetAudience: "需要快速指引的新手",
    distinction: "标准三步走操作示范"
  },
  {
    url: "/guide/subscription-update-frequency/",
    mainKeyword: "机场订阅多久更新一次",
    secondaryKeywords: ["订阅更新机制", "自动更新设置", "为什么更新订阅"],
    searchIntent: "了解节点更新机制，设置客户端自动同步频率",
    pageType: "使用习惯指南",
    targetAirport: "通用平台",
    targetAudience: "日常长期使用的用户",
    distinction: "平衡节点有效性与多余请求开销"
  },
  {
    url: "/guide/first-time-buying-checklist/",
    mainKeyword: "新手第一次买机场注意什么",
    secondaryKeywords: ["买机场避坑清单", "第一次买机场", "正确选购姿势"],
    searchIntent: "获取新手第一次选购机场的 5要5不要 避坑清单",
    pageType: "避坑清单文章",
    targetAirport: "四大精选机场",
    targetAudience: "准备下单的新手买家",
    distinction: "给出清晰实用的选购前后 Checklist"
  },
  {
    url: "/guide/how-to-choose-nodes/",
    mainKeyword: "机场节点怎么选择",
    secondaryKeywords: ["节点延迟怎么看", "节点倍率说明", "如何选优质节点"],
    searchIntent: "根据延迟数字、倍率标识与所在宽带挑选最适合节点",
    pageType: "节点选择指南",
    targetAirport: "全库覆盖",
    targetAudience: "面对海量节点不知道选哪个的用户",
    distinction: "教用户看懂节点命名规范与测速工具"
  },
  {
    url: "/guide/hk-jp-sg-nodes/",
    mainKeyword: "香港日本新加坡节点怎么选",
    secondaryKeywords: ["热门节点对比", "香港节点延迟", "新加坡抗拥堵"],
    searchIntent: "对比亚太热门节点特性，掌握晚高峰分流与大带宽下载策略",
    pageType: "地区节点对比",
    targetAirport: "全库覆盖",
    targetAudience: "希望优化连接体验的用户",
    distinction: "横向比对港/日/新/美核心特征"
  },
  {
    url: "/guide/how-to-judge-stability/",
    mainKeyword: "怎么判断机场是否稳定",
    secondaryKeywords: ["稳定机场指标", "机场稳定性测试", "如何判断好机场"],
    searchIntent: "从线路类型、抖动、多入口容灾到运营机制判断稳定性",
    pageType: "稳定性评估指南",
    targetAirport: "四大精选机场",
    targetAudience: "饱受掉线困扰的用户",
    distinction: "提供 5 大客观衡量指标与试水方法"
  },
  {
    url: "/guide/how-to-avoid-pitfalls/",
    mainKeyword: "怎么买机场不容易踩坑",
    secondaryKeywords: ["机场防坑指南", "避开虚标小机场", "机场选购避坑"],
    searchIntent: "识别不良商家的虚标口号、超低价年付陷阱与跑路风险",
    pageType: "深度避坑文章",
    targetAirport: "全库覆盖",
    targetAudience: "想避开套路盘的谨慎买家",
    distinction: "总结 6 大避坑黄金法则"
  },
  {
    url: "/guide/airport-exit-scam-signs/",
    mainKeyword: "机场跑路前有什么征兆",
    secondaryKeywords: ["机场跑路前兆", "防跑路自救", "小机场跑路特征"],
    searchIntent: "通过超大折扣促销、群组禁言、节点大面积断连等征兆提前避险",
    pageType: "安全预警文章",
    targetAirport: "全库覆盖",
    targetAudience: "关注资金安全的用户",
    distinction: "列举 5 大典型跑路前兆与止损方法"
  },
  {
    url: "/airports/",
    mainKeyword: "28家机场资料库",
    secondaryKeywords: ["机场大全", "机场价格表", "机场对比表", "专线机场列表"],
    searchIntent: "浏览和横向比对28家机场的基础价格、月流量、专线线路与优惠码",
    pageType: "资料库聚合索引页",
    targetAirport: "全部28家机场",
    targetAudience: "希望全面比对各家配置的读者",
    distinction: "集中呈现客观参数表格与直达链接"
  },
  {
    url: "/faq/",
    mainKeyword: "常见问题50问",
    secondaryKeywords: ["机场FAQ", "常见问题解答", "节点超时解答", "客户端报错解答"],
    searchIntent: "快速查询和解决从选购、订阅导入、全平台客户端设置到节点超时的50个高频问题",
    pageType: "常见问题全景页",
    targetAirport: "全库覆盖",
    targetAudience: "遇到任何疑问或故障的读者",
    distinction: "50个高频问答全部默认直接展开，支持即时分类检索"
  },
  {
    url: "/contact/",
    mainKeyword: "联系我们",
    secondaryKeywords: ["Telegram交流频道", "反馈建议", "提交纠错"],
    searchIntent: "加入官方 Telegram 交流社群获取最新通知与提交资料纠错",
    pageType: "联系与社区页面",
    targetAirport: "官方社群",
    targetAudience: "希望互动交流或反馈的读者",
    distinction: "提供唯一的官方 Telegram 交流入口"
  }
];

fs.writeFileSync(path.join(dataDir, 'keyword_map.json'), JSON.stringify(realKeywordMap, null, 2), 'utf-8');
fs.writeFileSync(path.join(rootDir, 'scripts', 'keyword-map-data.js'), 'module.exports = ' + JSON.stringify(realKeywordMap, null, 2) + ';\n', 'utf-8');
console.log('✅ 12. data/keyword_map.json 与 scripts/keyword-map-data.js 已重构更新');

// =========================================================================
// 13. 全局清理残留的 jichangreview.cfd
// =========================================================================
const filesToCleanDomain = [
  path.join(rootDir, 'package.json'),
  path.join(rootDir, 'README.md'),
  path.join(rootDir, 'static', 'css', 'style.css'),
  path.join(rootDir, 'static', 'js', 'main.js'),
  path.join(rootDir, 'scripts', 'serve.js')
];

filesToCleanDomain.forEach(f => {
  if (fs.existsSync(f)) {
    let txt = fs.readFileSync(f, 'utf-8');
    if (txt.includes('jichangreview.cfd')) {
      txt = txt.replace(/jichangreview\.cfd/g, 'jichangdingyue.xyz');
      txt = txt.replace(/机场Review/g, '机场订阅网');
      fs.writeFileSync(f, txt, 'utf-8');
      console.log('✅ 清理旧域名与品牌: ' + path.basename(f));
    }
  }
});

console.log('\n🎉 所有代码与内容审计项修复完成！\n');
