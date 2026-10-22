# 西部智车官网

面向高校与科研院所，展示 wivSPACE 产品、研发测试方案和真实案例，并承接咨询。当前代码为早期单页 Demo，接近生产的旧代码尚未恢复。

## 项目文档

日常只维护四份文件：

- 本 README：启动方式、最新进度和下一步。
- [PRD](docs/PRD.md)：受众、需求范围、业务/视觉要求、任务与验收。
- [技术设计](docs/TECH_DESIGN.md)：架构、实现、配置、验证和换机恢复。
- [AGENTS](AGENTS.md)：简短的 AI 协作规则。

每类信息只在对应文件维护。用户提供的原件和资产数据保留作参考；旧生成文档已收进[历史快照](docs/archive/docs-before-simplification-2026-10-22.zip)，不再日常维护。

## 启动

需要 Node.js >=22.13.0。首次安装：

```bash
npm ci
npm run dev
```

本机访问 <http://localhost:3000/>；内网协作使用：

```bash
npm run dev:lan
```

同一局域网设备访问启动日志中的 Network 地址。2026-10-22 此电脑地址为 <http://192.168.1.86:3000/>，换网络后可能变化；端口以日志为准。电脑和开发进程需保持运行，第二台设备可达性仍待实测。

## 最新接续状态

更新：2026-10-22。以下是工作快照，不代替实时 Git 核验。

- 最近完成：三份历史资料接入、资产核对、四份日常文档，以及WIV-001的官网冒烟测试和Cloudflare类型修复。
- 下一步：按WIV-002/003打磨页头与首屏，一轮一个主要板块。
- 质量检查：`npm run verify` 通过，包含类型生成/检查、Lint、文档检查、构建和全部9项测试。Lint无错误，保留9条现有图片性能提醒。
- 跨设备：2026-10-22本机和内网地址均返回HTTP 200，用户确认另一设备可正常打开。
- 已知页面问题：窄屏统计条遮挡、移动导航缺失、表单未接通、内部制作文案、旧体系图产品归属过时。按PRD对应任务处理。
- 保存分支与交接入口：`codex/wiv-001-foundation`；默认 `main` 仍保留原Demo。本轮成果从该任务分支接续，当前提交及远端同步状态用 `repo:status` / `repo:check` 实时核验。
- 恢复演练：2026-10-22从GitHub独立clone该分支的基础提交 `2f91176`，`npm ci` 和 `npm run verify` 均通过，工作区保持干净；恢复出的本地生产服务首页、Hero、中文路径产品图和图标均返回HTTP 200。
- 来源缺项：原信息架构V1.1、完整素材包及近生产旧代码可继续找回；先独立保存和比对，避免覆盖当前工作。

```bash
npm run docs:check
npm run verify
npm run repo:status
npm run repo:check
```

`docs:check` 核对原件、资产和文档；`repo:status` 只看本地；`repo:check` 实时核验当前上游分支。提交/推送依据当轮授权执行，成功后再记录远端结果。换机前另做独立 clone 恢复演练，详见技术设计。

换设备获取本轮版本时，显式选择分支，避免只下载默认分支上的早期Demo：

```bash
git clone --branch codex/wiv-001-foundation https://github.com/s1xo6e/wiv-official-site.git
cd wiv-official-site
npm ci
npm run verify
```

## 分板块新对话

可直接这样开始，无需依赖本聊天历史：

```text
继续 /Users/iyoul/Desktop/wiv-official-site，只处理 PRD 中的【任务ID/板块】。
读取 AGENTS.md、README最新状态和PRD对应要求；按需查看技术设计与原始素材。
先核对并保留已有修改，实现本轮范围、完成相关验证，更新任务和最新状态。
收工报告分支/提交、未提交/未推送内容；保存和发布按本次会话的明确授权执行。
```

每轮收工只需更新PRD的任务状态和本页最新接续信息；需求或架构有变化时才修改对应正文。正式发布与本地预览、Git同步分别验收。
