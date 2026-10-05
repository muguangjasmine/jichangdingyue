const fs = require('fs');
const path = require('path');

const contentDir = 'C:/Users/USER/Desktop/博客域名/jichangdingyue.xyz/content';

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Section Index Files
const sectionIndexes = [
  {
    path: 'recommend/_index.md',
    title: '2026 机场订阅推荐与精选指南',
    seo_title: '2026机场订阅推荐与精选指南｜稳定专线与高性价比月付机场订阅',
    description: '机场订阅网精选2026稳定好用的机场订阅服务商，涵盖IEPL专线、月付低门槛、轻量年付与大流量套餐，助新手避开跑路与卡顿陷阱。',
    content: `# 2026 机场订阅推荐与精选指南

欢迎来到**机场订阅网**的机场订阅推荐专区。在选择机场订阅时，新手最关心的核心问题通常是：**哪家机场订阅稳定不卡顿？哪家支持便宜月付？如何避免遇到跑路盘？**

本专区基于**网络稳定性、晚高峰表现、节点覆盖、月付门槛及客服售后**等客观指标，为你系统梳理2026年值得考虑的高性价比机场订阅服务。

---

## 挑选机场订阅的核心维度

1. **坚持月付试水**：第一次使用任何机场订阅，优先选择月付（约 ¥15–¥25/月），在晚高峰（20:00–23:00）实测本地网络速度满意后再考虑长周期。
2. **认准专线与优质中转**：优先选择提供 **IEPL / IPLC 专线** 或多线 BGP 中转的订阅，能够有效避开公网拥堵。
3. **全平台客户端兼容**：确保机场订阅支持 **Clash Verge Rev、Shadowrocket（小火箭）、v2rayN、Sing-box** 等主流客户端一键导入。

---

## 推荐阅读与快速导航

- [2026 机场订阅推荐：新手怎么选](/recommend/best-airport-subscriptions/)
- [机场套餐怎么选：月付、年付与不限时流量包对比](/plans/how-to-choose-plan/)
- [机场订阅导入 Clash Verge 图文教程](/tutorials/clash-verge-tutorial/)
- [Shadowrocket 小火箭导入订阅教程](/tutorials/shadowrocket-import-subscription/)
- [怎么买机场不容易踩坑：新手避坑指南](/guide/how-to-avoid-pitfalls/)
`
  },
  {
    path: 'tutorials/_index.md',
    title: '机场订阅使用教程与客户端导入指南',
    seo_title: '机场订阅使用教程大全｜Clash、Clash Verge与Shadowrocket小火箭订阅导入',
    description: '整理全平台机场订阅使用教程，手把手教你如何复制订阅链接、导入Clash Verge Rev、配置Shadowrocket小火箭以及开启规则模式。',
    content: `# 机场订阅使用教程与客户端导入指南

在购买机场套餐后，很多新手常常卡在**“如何把订阅链接导入软件”**这一步。本专区提供详尽的图文使用教程，覆盖 Windows、macOS、iOS、Android 全平台主流客户端。

---

## 核心客户端教程直达

- **Clash Verge Rev 教程**：[机场订阅怎么导入 Clash Verge](/tutorials/clash-verge-tutorial/)
- **Shadowrocket 小火箭教程**：[机场订阅怎么导入 Shadowrocket](/tutorials/shadowrocket-import-subscription/)
- **Clash 经典导入流程**：[机场订阅怎么导入 Clash](/tutorials/clash-import-subscription/)

---

## 订阅基础知识与排障

- [机场订阅链接是什么：格式与原理详解](/guide/what-is-subscription-link/)
- [机场订阅地址怎么使用：从复制到上网](/guide/how-to-use-subscription-url/)
- [机场订阅链接打不开怎么办：域名污染与故障排查](/troubleshooting/subscription-link-failed/)
- [机场订阅更新失败怎么办：超时与报错修复](/troubleshooting/subscription-update-error/)
`
  },
  {
    path: 'clients/_index.md',
    title: '全平台机场客户端使用教程与下载',
    seo_title: '全平台机场客户端教程｜Windows、Mac、iPhone与安卓代理软件下载与配置',
    description: '提供Windows、macOS、iOS苹果与Android安卓各系统的主流机场客户端对比、下载指引与配置教程，助你快速搞定多设备上网。',
    content: `# 全平台机场客户端使用教程与下载

不同操作系统对应不同的代理客户端。为了获得最佳的使用体验与网络分流效果，建议根据你的设备选择最稳定、更新维护积极的现代客户端。

---

## 各设备客户端指南

- **电脑 Windows**：[Windows 机场使用教程与客户端配置](/clients/windows/)
- **手机 Android**：[安卓手机机场使用教程与后台保活](/clients/android/)
- **苹果 iPhone / iPad**：[iPhone 小火箭 Shadowrocket 安装与配置](/clients/iphone/)
- **苹果电脑 Mac**：[Mac 机场使用教程与 Clash Verge 配置](/clients/mac/)
- **客户端横向对比**：[主流机场客户端有哪些：优缺点与选择指南](/clients/client-overview/)

---

## 相关阅读

- [2026 机场订阅推荐：新手怎么选](/recommend/best-airport-subscriptions/)
- [机场节点怎么选择：延迟与地区适配](/guide/how-to-choose-nodes/)
- [怎么判断机场是否稳定：新手选购指标](/guide/how-to-judge-stability/)
`
  },
  {
    path: 'plans/_index.md',
    title: '机场套餐怎么选与流量购买指南',
    seo_title: '机场套餐怎么选｜100G流量够不够、月付年付对比与低价避坑指南',
    description: '深度解析机场套餐选择策略，对比月付、年付与不限时流量包优劣势，测算100G月流量实际消耗，帮助新手花最少的钱买到最适合的套餐。',
    content: `# 机场套餐怎么选与流量购买指南

购买机场套餐不是越贵越好，也不是越便宜越划算。新手在选购套餐时，需要综合考虑自身的**月度流量消耗、使用频次、设备数量以及预算承受能力**。

---

## 套餐专题深度文章

- [机场套餐怎么选：月付、年付与不限时流量包全对比](/plans/how-to-choose-plan/)
- [100G 机场流量够不够：日常网页、视频与社交消耗测算](/plans/100g-plan-guide/)
- [机场月付还是年付好：新手避免资金沉没的付款策略](/plans/monthly-vs-yearly/)

---

## 选购核心建议

1. **首单必选月付**：实测晚高峰网络满意后再做长期规划。
2. **流量合理预估**：普通个人查资料与社交，每月 50GB–100GB 完全够用。
3. **警惕超低价陷阱**：远离几块钱包年或永久无限流量的套路盘，详见 [怎么买机场不容易踩坑](/guide/how-to-avoid-pitfalls/)。
`
  },
  {
    path: 'lines/_index.md',
    title: '机场线路类型与专线知识解析',
    seo_title: '机场线路类型解析｜直连、中转、IEPL与IPLC专线区别与晚高峰解析',
    description: '通俗易懂解释直连、中转、BGP多线与IEPL/IPLC内网专线区别，揭秘为什么机场晚高峰会变慢以及如何挑选抗拥堵线路。',
    content: `# 机场线路类型与专线知识解析

很多新手在看机场介绍时，常常被 **直连、BGP 中转、IEPL 专线、IPLC 专线** 等专业术语搞得一头雾水。本专区用通俗易懂的大白话，带你搞懂这些线路的核心差异。

---

## 线路专题文章

- [机场直连和中转有什么区别：速度、稳定与晚高峰解析](/lines/direct-vs-relay/)
- [IEPL 和 IPLC 有什么区别：内网专线与跨境传输对比](/lines/iepl-vs-iplc/)
- [机场晚高峰为什么变慢：带宽拥堵与线路瓶颈真相](/lines/peak-hours-slow/)

---

## 实用知识速查

- **直连**：电脑直接连国外机房，成本极低但晚高峰容易卡顿。
- **中转**：国内服务器转发流量，网络抖动减少，性价比高。
- **IEPL/IPLC 专线**：不过公网防火墙的企业内网光纤，晚高峰表现最平稳。
- **进一步了解**：[怎么判断机场是否稳定](/guide/how-to-judge-stability/)
`
  },
  {
    path: 'troubleshooting/_index.md',
    title: '机场订阅与节点故障排查自救指南',
    seo_title: '机场订阅故障排查指南｜订阅打不开、更新失败与节点超时自救教程',
    description: '汇集机场订阅使用中最常见的网络故障，提供订阅链接打不开、更新订阅失败、节点全部变红超时的黄金四步排障法。',
    content: `# 机场订阅与节点故障排查自救指南

遇到订阅无法导入、节点全部超时变红、或者网页打不开？别慌！绝大多数机场故障并不是服务器跑路，而是由于**系统时间偏差、订阅域名污染或客户端模式设置错误**导致的。

---

## 常见故障解决方案

- [机场订阅链接打不开怎么办：域名污染与网络排查](/troubleshooting/subscription-link-failed/)
- [机场订阅更新失败怎么办：常见报错与修复步骤](/troubleshooting/subscription-update-error/)
- [机场节点全部超时怎么办：无法连接与不可用排查](/troubleshooting/nodes-timeout/)

---

## 黄金排障 4 步法

1. **【对时】**：同步电脑/手机系统时间到北京标准时间（误差不能超 60 秒）。
2. **【查量】**：登录机场后台确认套餐未过期、流量未耗尽。
3. **【更新】**：在客户端中右键点击订阅执行“更新”。
4. **【重启】**：关闭系统代理，彻底退出客户端重新打开。
`
  },
  {
    path: 'guide/_index.md',
    title: '机场订阅新手入门指南与认知专题',
    seo_title: '机场订阅新手入门指南｜订阅原理、节点选择、防坑与防跑路全攻略',
    description: '专为零基础新手打造的机场订阅入门知识库，涵盖订阅原理、节点选择、更新频率、稳定度判断、避坑法则与跑路识别。',
    content: `# 机场订阅新手入门指南与认知专题

如果你是第一次接触科学上网与机场订阅，本专区为你提供体系化、零门槛的入门指导，让你在几分钟内理清所有核心概念。

---

## 新手必读基础文章

- [机场订阅是什么意思：新手必读的入门解析](/guide/what-is-airport-subscription/)
- [机场订阅链接是什么：订阅地址原理与格式详解](/guide/what-is-subscription-link/)
- [机场订阅地址怎么使用：从复制链接到一键连接](/guide/how-to-use-subscription-url/)
- [机场订阅多久更新一次：更新机制与自动更新设置](/guide/subscription-update-frequency/)
- [新手第一次买机场注意什么：避坑清单与正确姿势](/guide/first-time-buying-checklist/)

---

## 节点选择与避坑防跑路

- [机场节点怎么选择：延迟、倍率与场景适配指南](/guide/how-to-choose-nodes/)
- [香港、日本、新加坡节点怎么选：热门地区节点特性对比](/guide/hk-jp-sg-nodes/)
- [怎么判断机场是否稳定：新手选购防坑核心指标](/guide/how-to-judge-stability/)
- [怎么买机场不容易踩坑：避开虚标、套路与低质商家](/guide/how-to-avoid-pitfalls/)
- [机场跑路前有什么征兆：新手防跑路自救指南](/guide/airport-exit-scam-signs/)
`
  }
];

sectionIndexes.forEach(s => {
  const fullPath = path.join(contentDir, s.path);
  ensureDir(path.dirname(fullPath));
  const md = `---
title: "${s.title}"
seo_title: "${s.seo_title}"
description: "${s.description}"
date: "2026-10-01"
last_verified: "2026-10-01"
layout: "list"
---

${s.content}
`;
  fs.writeFileSync(fullPath, md, 'utf-8');
});

console.log('Successfully wrote section indexes');
