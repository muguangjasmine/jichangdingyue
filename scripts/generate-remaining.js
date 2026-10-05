const fs = require('fs');
const path = require('path');
const contentDir = 'C:/Users/USER/Desktop/博客域名/jichangdingyue.xyz/content';

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeArticle(relPath, frontmatter, mdBody) {
  const fullPath = path.join(contentDir, relPath);
  ensureDir(path.dirname(fullPath));
  const lines = ['---'];
  for (const [k, v] of Object.entries(frontmatter)) {
    if (Array.isArray(v)) {
      lines.push(`${k}: [${v.map(x => JSON.stringify(x)).join(', ')}]`);
    } else {
      lines.push(`${k}: ${JSON.stringify(v)}`);
    }
  }
  lines.push('layout: "single"');
  lines.push('---');
  lines.push('');
  lines.push(mdBody.trim());
  lines.push('');
  fs.writeFileSync(fullPath, lines.join('\n'), 'utf-8');
  console.log('Wrote:', relPath);
}

// 1. hk-jp-sg-nodes.md
const mdHK = `# 香港、日本、新加坡节点怎么选？热门地区节点特性对比与使用场景推荐

在将机场订阅导入客户端后，新手打开节点列表往往会看到几十上百个节点：**香港 01、日本 02、新加坡 03、美国 04…**

很多用户不知道该选哪一个，或者长期只挂着香港节点。实际上，**不同节点的物理延迟、网络带宽、IP 纯净度以及流媒体/AI 解锁能力存在显著差异**。究竟**香港、日本、新加坡节点怎么选**？本文带你一文搞懂各大热门地区节点的核心特性与最佳适用场景。

---

## 一、热门地区节点核心特性速查表

| 节点地区 | 物理延迟 (Ping) | 主要优势 | 潜在短板 | 最佳适用场景 |
| :--- | :--- | :--- | :--- | :--- |
| **中国香港 (HK)** | **极低 (15–40ms)** | 离大陆最近，网页加载最快，国内互联首选 | 晚高峰容易拥堵，部分 AI 平台（如 ChatGPT）限制访问 | 日常网页浏览、查阅文献、YouTube 4K 秒开、微信国内直连分流 |
| **日本 (JP)** | **适中 (45–70ms)** | 国际带宽充裕，解锁日本流媒体（Abema/Netflix 日区）极佳 | 极端高峰期骨干网偶尔波动 | 动漫流媒体、二次元游戏加速、学术科研、日常兼顾 |
| **新加坡 (SG)** | **平稳 (40–60ms)** | 亚太金融互联网中心，IP 纯净度高，东南亚访问极佳 | 华南地区延迟略高于香港 | ChatGPT/Claude 等 AI 工具对话、TikTok 运营、晚高峰香港分流备用 |
| **美国 (US)** | **较高 (130–180ms)** | 资源最全，全功能原生解锁各类海外服务与冷门站点 | 物理距离远导致 Ping 延迟高 | 账号注册、重度跨境电商、冷门平台访问、大带宽下载 |

---

## 二、各大主流节点深度场景解析

### 1. 香港节点（Hong Kong）：追求极速响应的首选
- **特点**：由于地理位置紧邻中国大陆，香港节点拥有全网最低的物理延迟。
- **优势**：打开 Google 搜索、Twitter、GitHub 时几乎感受不到延迟，体验与国内网站无异。
- **注意事项**：由于使用人数最多，在 [机场晚高峰](/lines/peak-hours-slow/)（20:00–23:00）最容易发生拥堵；此外 OpenAI 官方对部分香港 IP 存在限制，访问 ChatGPT 时可能需要切换至新加坡或美国节点。

### 2. 日本节点（Japan）：亚太综合体验万金油
- **特点**：日本机房带宽储备极其充沛，与中国东部沿海（上海、青岛、大连等）海缆直达。
- **优势**：不仅日常浏览流畅，而且对 Netflix 日区独播番剧、Pixiv、DMM 等平台拥有完美的解锁支持。
- **搭配建议**：华东和华北用户如果觉得香港节点拥挤，日常可长期连接日本节点。

### 3. 新加坡节点（Singapore）：AI 工具与避开拥堵的绝佳选择
- **特点**：作为东南亚网络枢纽，新加坡机房管理规范，IP 被列入黑名单的概率极低。
- **优势**：
  - 完美支持 **ChatGPT、Claude、Midjourney** 等前沿 AI 生产力工具；
  - 在晚高峰香港节点变慢时，切换到新加坡节点往往能立刻获得平稳流畅的网速。
- **配置参考**：在 [Clash Verge Rev 教程](/tutorials/clash-verge-tutorial/) 或 [Shadowrocket 小火箭](/tutorials/shadowrocket-import-subscription/) 中可将新加坡节点设为自动回退备用组。

### 4. 台湾与美国节点（TW / US）：专项功能补充
- **台湾节点 (TW)**：适合观看动画疯（巴哈姆特）、KKTV 等台湾本土流媒体，延迟通常在 40–70ms 之间。
- **美国节点 (US)**：虽然 Ping 延迟在 150ms 左右，但访问美国本土大学数据库、支付网关及特定云服务时兼容性最高。

---

## 三、新手日常节点选择的 3 大黄金法则

1. **“日常浏览连香港，遇到拥堵切狮城”**：白天办公首选香港低延迟，晚高峰或连不上 ChatGPT 时一键切换新加坡。
2. **“看剧根据区服挑，打游戏选专线”**：看日区 Netflix 选日本，看动画疯选台湾；玩海外服游戏优先选择延迟稳定的 [IEPL/IPLC 专线](/lines/iepl-vs-iplc/)。
3. **“善用客户端延迟测速”**：不要只看节点名称，在客户端中点击测速按钮，挑选绿色低延迟且未超时的节点使用。详见 [机场节点怎么选择](/guide/how-to-choose-nodes/)。

---

## 四、本篇常见问题 (Q&A)

### Q1：为什么用香港节点打开 ChatGPT 会提示“Access Denied”？
**答**：OpenAI 官方目前未在香港地区开放服务，因此会对来自香港 IP 的访问进行拦截。只需将客户端代理节点切换为 **新加坡 (SG)、日本 (JP) 或美国 (US)** 刷新网页即可正常使用。

### Q2：节点测速延迟很低，但为什么看视频还是卡顿？
**答**：Ping 延迟只代表响应速度，视频播放更依赖于**节点实际带宽与丢包率**。若节点发生严重丢包（常见于普通公网直连），即便延迟仅 30ms 也会频繁缓冲。建议选用 [IEPL 专线机场](/lines/direct-vs-relay/) 以保障晚高峰画质。

### Q3：有哪些亚太节点覆盖全、解锁稳定的机场推荐？
**答**：推荐参考 [2026 机场订阅推荐：新手怎么选](/recommend/best-airport-subscriptions/) 中的优质服务商（如 [梯子云](https://varnexa.ladderaff.com/#/?code=7cjKUmW6)、[暮光网络](https://varnexa.twilightaff.com/#/?code=9wp1Pt82) 等），节点均标明地区倍率并提供流媒体解锁标识。
`;

writeArticle(
  'guide/hk-jp-sg-nodes.md',
  {
    title: '香港、日本、新加坡节点怎么选？热门地区节点特性对比与使用场景推荐',
    seo_title: '香港、日本、新加坡节点怎么选｜热门地区节点延迟、流媒体解锁与场景全对比',
    description: '使用机场订阅时，香港、日本、新加坡和美国节点各有什么区别？本文深度对比各大热门地区节点的延迟高低、流媒体解锁、ChatGPT/AI支持与日常办公场景推荐。',
    keywords: ['香港日本新加坡节点怎么选', '机场节点选择', '香港节点延迟', '日本节点解锁', '新加坡节点速度', '美国节点ChatGPT', '科学上网节点'],
    date: '2026-10-01',
    last_verified: '2026-10-01',
    author: '机场订阅网编辑部'
  },
  mdHK
);

// 2. first-time-buying-checklist.md
const mdChecklist = `# 新手第一次买机场注意什么？避坑清单与正确姿势全指南

对于刚刚接触科学上网的小白用户，第一次挑选和购买机场订阅时，往往会被五花八门的广告宣传搞得眼花缭乱。

很多新手因为缺乏基础认知，一上来就贪图便宜购买了所谓的“超低价永久套餐”或“百元年付大包”，结果没用几天服务商就跑路失联，或者晚高峰卡到怀疑人生。

为了帮助新手少走弯路、保护财产安全，本文特意整理了一份**新手第一次买机场必看的避坑清单与正确姿势**。

---

## 一、新手第一次买机场的“5 要 5 不要”原则

### 5 要（正确选购姿势）
1. **要优先选择“月付”试水**：单月支出仅需十几元，即使体验不佳损失也完全可控。
2. **要优先选择“IEPL/IPLC 内网专线”**：晚高峰抗封锁与抗拥堵能力远超普通公网直连。详见 [IEPL和IPLC有什么区别](/lines/iepl-vs-iplc/)。
3. **要确认支持主流现代客户端**：确保提供 [Clash Verge](/tutorials/clash-verge-tutorial/)、[Shadowrocket 小火箭](/tutorials/shadowrocket-import-subscription/) 或 Sing-box 订阅链接。
4. **要关注官方公告与沟通渠道**：拥有活跃的 Telegram 交流群或维护频道，说明商家具备持续运维态度。
5. **要测试晚高峰真实网络表现**：购买后在 20:00–23:00 集中测试网页秒开与 4K 视频加载情况。详见 [怎么判断机场是否稳定](/guide/how-to-judge-stability/)。

---

### 5 不要（必须警惕的陷阱）
1. **不要一上来就买“超长年付”或“永久套餐”**：世界上没有永动机，所谓永久免费或终身订阅 99% 是资金链即将断裂的跑路盘。详见 [机场跑路前有什么征兆](/guide/airport-exit-scam-signs/)。
2. **不要迷信“万兆带宽/全网最快”等夸大口号**：服务器带宽是共享资源，超低价宣称万兆往往存在严重超卖。
3. **不要购买无任何售后渠道的三无小作坊**：网站连工单系统都没有、无法联系客服的平台随时可能失联。
4. **不要在不受信任的渠道泄露真实个人敏感信息**：注册时尽量使用常用的独立邮箱，密码切勿与重要银行/社交账号相同。
5. **不要盲目追求海量冷门国家节点**：日常 95% 的时间都在使用香港、日本、新加坡和美国节点，几十个冷门小国节点通常只是噱头。详见 [香港、日本、新加坡节点怎么选](/guide/hk-jp-sg-nodes/)。

---

## 二、新手购买机场全流程对照清单 (Checklist)

- [x] **步骤 1**：明确自身预算与流量需求（普通个人 50G-100G/月完全够用）。
- [x] **步骤 2**：挑选具备 IEPL 专线或 BGP 多线中转的成熟服务商。
- [x] **步骤 3**：选择最低档位的【单月付款】套餐完成结算。
- [x] **步骤 4**：在用户后台复制订阅链接（如 Clash 订阅地址）。
- [x] **步骤 5**：下载对应系统客户端（Win 用 Clash Verge，iOS 用 Shadowrocket）。
- [x] **步骤 6**：导入订阅并开启【规则模式 (Rule)】，避免消耗国内直连流量。
- [x] **步骤 7**：在晚上 8-11 点晚高峰实测 YouTube 4K 和日常网页流畅度。
- [x] **步骤 8**：若体验满意且连续使用 1-2 个月稳定，再按需考虑季度付或年付。

---

## 三、常见套餐类型与性价比分析

新手在选购套餐时，建议根据自身实际使用习惯进行匹配：

- **轻量日常型 (¥15–¥20/月，约 50GB–100GB)**：适合日常查阅资料、看推特、与好友 Telegram 聊天、偶尔看视频。详见 [100G 机场流量够不够](/plans/100g-plan-guide/)。
- **重度影音型 (¥25–¥40/月，约 200GB–500GB)**：适合长期观看 Netflix 4K、YouTube 高清长视频、大文件跨国传输。
- **按量不限时型 (¥50–¥100 一次性购买流量包)**：适合偶尔临时备用或出门旅游使用的备用梯子。
- 更多对比请参考 [机场套餐怎么选](/plans/how-to-choose-plan/) 与 [机场月付还是年付好](/plans/monthly-vs-yearly/)。

---

## 四、本篇常见问题 (Q&A)

### Q1：为什么不建议新手直接使用免费机场或免费节点？
**答**：免费节点往往公开发布在网络上，使用者成千上万，不仅连接速度极其缓慢、延迟高达几千毫秒，而且公共节点存在中间人窃听与数据泄露的严重安全隐患。每月花费十几元购买正规月付机场，体验与安全性都有本质保障。

### Q2：购买后发现连不上、打不开网页怎么办？
**答**：绝大多数情况并非机场问题，而是本地时间未同步或客户端未开启系统代理。请参考 [机场订阅链接打不开排查](/troubleshooting/subscription-link-failed/) 与 [机场节点全部超时排查指南](/troubleshooting/nodes-timeout/)。

### Q3：有哪些适合第一次尝试的低门槛月付机场？
**答**：推荐参考 [2026 机场订阅推荐：新手怎么选](/recommend/best-airport-subscriptions/) 中的精选商家（如 [梯子云](https://varnexa.ladderaff.com/#/?code=7cjKUmW6)、[暮光网络](https://varnexa.twilightaff.com/#/?code=9wp1Pt82) 等），支持快捷月付与一键客户端导入。
`;

writeArticle(
  'guide/first-time-buying-checklist.md',
  {
    title: '新手第一次买机场注意什么？避坑清单与正确姿势全指南',
    seo_title: '新手第一次买机场注意什么｜避坑清单、防骗防跑路与正确选购指南',
    description: '刚接触科学上网，第一次购买机场订阅需要注意什么？本文从警惕低价年付陷阱、认准IEPL专线、选择月付试水到客户端兼容性，整理一份完整的新手购买避坑清单。',
    keywords: ['新手第一次买机场注意什么', '买机场注意事项', '第一次买机场', '机场避坑指南', '新手机场推荐', '机场订阅怎么买'],
    date: '2026-10-01',
    last_verified: '2026-10-01',
    author: '机场订阅网编辑部'
  },
  mdChecklist
);

console.log('Successfully wrote hk-jp-sg-nodes.md and first-time-buying-checklist.md');
