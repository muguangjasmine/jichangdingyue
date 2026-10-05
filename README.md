# 机场检测站 (jichangdingyue.xyz)

> 客观数据核验｜机场测评与新手选择指南  
> 官方线上访问网址：**https://jichangdingyue.xyz**

---

## 📌 项目特性

1. **客观数据收录**：收录 28 家主流机场真实套餐价格、月流量、底层线路资料与 AI 工具（ChatGPT/Claude/Gemini）可用性核验；
2. **纯静态极速架构**：基于 Hugo Extended 深度定制，全站 55+ 静态 HTML 页面毫秒级响应；
3. **SEO 与结构化数据**：完整接入 `WebSite`, `CollectionPage`, `Article`, `FAQPage`, `BreadcrumbList` 等 JSON-LD Schema；
4. **全站全文搜索**：基于 `index.json` 静态搜索索引，无后端数据库依赖；
5. **合规外链规范**：全站第三方注册与外部链接统一具备 `target="_blank" rel="sponsored nofollow noopener"`；
6. **响应式设计**：完美适配 PC、平板与手机端（320px - 430px），保证 44px 移动端安全触控。

---

## 🛠️ 本地开发与维护

### 1. 运行环境
- Node.js 18+
- Hugo Extended v0.140.0+ (Windows 预置脚本 `.\hugo.cmd`)

### 2. 常用开发命令
```bash
# 启动本地开发服务 (端口 1314)
node scripts/serve.js

# 同步数据并重新生成所有文章与 JSON
npm run generate

# 生产环境 Hugo 编译与压缩
npm run build

# 运行 17 项全站指标自动化核验
npm run verify

# 一键执行数据生成 + 编译 + 核验 + 打包生产 zip
npm run zip
```

---

## 🚀 部署指引

### 方式一：Cloudflare Pages 部署（推荐）
1. 在 Cloudflare 控制台新建 **Pages** 项目，绑定本 GitHub 仓库 `muguangjasmine/jichangview`；
2. **构建设置**：
   - **框架预设**：选择 `None` 或 `Hugo`；
   - **构建命令**：若选 `None` 则留空（直接使用已生成的 `public` 目录）；若选 `Hugo` 填入 `hugo --minify`；
   - **构建输出目录**：`public`；
   - **环境变量**（若使用 Hugo 构建）：`HUGO_VERSION = 0.145.0`；
3. 绑定自定义域名 `jichangdingyue.xyz` 并开启自动 HTTPS。

### 方式二：GitHub Pages 部署
1. 仓库已内置 `.github/workflows/deploy.yml` 自动化工作流；
2. 进入 GitHub 仓库设置 `Settings` -> `Pages`；
3. 将 **Source** 改为 **GitHub Actions**，推送到 `main` 分支即可自动构建上线。
