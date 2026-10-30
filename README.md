# 西部智车官网 · 项目交接

面向高校与科研院所的西部智车官网早期Demo，展示wivSPACE产品、研发测试方向与案例。当前已实现五个章节页、三条产品线的13个模块及11个产品详情页；内容与视觉仍有待验收项，尚未完成真实咨询和正式上线闭环。

**接手版本：[`codex/project-handoff`](https://github.com/s1xo6e/wiv-official-site/tree/codex/project-handoff)。默认 `main` 仍是早期版本，请按下面的分支命令获取。** 本轮整理与上传日期为2026-10-30；GitHub保存、官网部署、业务验收分别处理。

## 先把项目跑起来

需要Node.js `>=22.13.0`、npm及此私有GitHub仓库的访问权限。当前命令按macOS/Linux/WSL编写，本轮在macOS验证；Windows原生命令行未验证。使用仓库的lockfile安装依赖：

```bash
git clone --branch codex/project-handoff https://github.com/s1xo6e/wiv-official-site.git
cd wiv-official-site
npm ci
npm run dev
```

打开 [本地预览](http://localhost:3000/)，实际端口以启动日志为准。本地开发不需要业务 `.env` 或Cloudflare账号；保留仓库内 `.openai/hosting.json` 即可。不要将本机开发地址作为正式官网地址。

```bash
npm run verify       # 类型、Lint、文档/素材、构建、全部测试
npm run dev:lan      # 同一局域网协作，使用日志中的Network地址
```

检查生产构建时先运行 `npm run build`，再运行 `npm run start`。全部命令、环境解释和恢复步骤见 [技术设计](docs/TECH_DESIGN.md)。

## 接手先读这三处

- [PRD](docs/PRD.md)：项目目标、当前产品口径、视觉要求、待确认材料、WIV任务及验收标准。需求和任务只在这里维护。
- [技术设计](docs/TECH_DESIGN.md)：代码定位、路由/内容模型、配置、保留集成、验证、Git同步与独立恢复。实现和操作流程只在这里维护。
- [AGENTS](AGENTS.md)：协作约束，人工或AI接手都应保留已有修改、尊重资料和发布边界。

本README负责启动与交接摘要。`docs/reference-materials/`用于追溯依据，`docs/assets/asset-registry.json`维护素材对应关系，`docs/archive/`只用于历史恢复；不要把历史原件再当作另一套现行需求。

## 目前交付了什么

- 首页 `/`、产品 `/solutions`、案例 `/cases`、关于 `/about`、联系 `/contact` 均有独立页面，共用页头、页脚与当前章节标识。
- 产品和案例有三列文字目录，手机有折叠菜单；一级标题可直接进入章节，支持键盘、Escape和减少动效。四个非首页章节共用公司外景图片首屏。
- 产品按X-IL 5、REAL CAR 6、SRIF 2组织，共13模块。X-IL和REAL CAR共11个详情，覆盖产品定位、组成、研发测试、应用方向和同系列链接；SRIF保持总览。现行全称与后续要求以PRD为准。
- 原产品图保留，11张WebP用于网页；来源、哈希、尺寸、派生关系和缺图项记录在资产台账。旧架构图、远程驾驶入口及无依据统计已撤下。
- 已有类型/Lint/文档检查、SSR页面与资源测试、Git同步检查工具，继续使用现有Vinext + Vite + React和Sites/Worker集成。

## 接手后仍需完成什么

以下事项没有因为交接或代码上传而完成，任务状态与详细验收集中在 [PRD第6节](docs/PRD.md#6-任务与验收)：

- **已实现、待验收**：导航目录、章节图片首屏、产品总览与11个详情的内容/视觉，以及真实手机触摸体验（WIV-002/005/006/012）。
- **待用户确认**：首页定位与统计依据、真实电话/邮箱/公众号及接收人、四个案例的事实与公开范围、公司/团队能力口径（WIV-003/004/007/008）。
- **尚未接通**：有效表单收件及完整咨询闭环；没有官网CMS、管理后台或登录业务（WIV-009）。
- **上线前处理**：依赖安全评估、素材公开授权、发布目标和账号权限、访问范围、回退版本、咨询及跨设备回归（WIV-010）。本轮未部署网站，既有线上版本未核验。

建议先由接手者启动并验收现有页面，再与内容负责人确认首页、联系渠道和案例，最后安排收件服务与上线。不要从历史规范直接复制待确认的联系方式、客户或性能主张。

## 去哪里改

```text
app/                    五章路由、产品详情模板、全局布局与样式
components/site/        导航、共用首屏/页脚和页面组件
content/                产品/案例目录、详情正文与导航数据
public/assets/          品牌、公司、产品及案例图片
worker/、build/、.openai/  既有运行与Sites构建集成
scripts/、tests/         文档/仓库检查与官网SSR测试
docs/                   PRD、技术设计、来源与资产台账、历史归档
```

产品名称、简介和图在 `content/site-content.ts`，详情文案在 `content/product-details.ts`；其他定位和修改约定见技术设计。`db/`、`drizzle/`、`examples/d1/`及认证辅助文件属于未接入的预留能力，不是已完成的官网业务。

## 资料交接边界

GitHub包含源码、lockfile、四份主要文档、已归档参考资料、当前图片和资产台账。仓库目前为私有；此状态不代表已获得照片、案例或客户材料的公开授权。

以下内容需要原持有人另行提供或确认：

- 约179MB的 `wivSPACE_8.19.pptx` 原件；仓库只有相关页文字摘录与来源哈希，本机来源路径不能供接手者下载。
- 未找回的信息架构V1.1、完整素材包及近生产旧代码；找到后独立保存并比对。
- GitHub协作者权限及Site/Cloudflare等托管账号访问、正式发布配置和联系收件服务；代码上传不自动转移账号或仓库所有权。
- 忽略目录 `project-inputs/` 内的本地资料、真实 `.env` 与凭据（若有）。这些不随Git推送备份，不能写入普通文档或公开资源。

## 最近核验与版本同步

2026-10-30本机 `npm run verify` 通过：类型检查、Lint、四份来源/39项资产/34媒体核对、构建及全部13项测试通过。Lint为0错误、9条既有原生图片性能提醒；Vinext构建仍有部分路由静态分类为Unknown的提示，构建与实际SSR响应测试均通过。

独立从GitHub克隆代码提交 `2c8dd0d` 后，`npm ci`、完整 `verify` 和 `repo:check` 均通过；本地生产预览的五章、X-IL/REAL CAR代表详情、中文路径原图、WebP、公司图和图标返回HTTP 200，未知详情返回404。之后仅补记交接验证与依赖审计结果，未改代码或lockfile。

**已知依赖风险**：本轮全量 `npm audit` 报告27项（18 high、8 moderate、1 low）；`npm audit --omit=dev` 为0。Vinext、RSC及构建工具列在开发依赖中但参与构建/运行，后者不能代表上线安全结论。接手者应在WIV-010中评估受影响路径、修复与兼容性回归；本轮未升级依赖。

本轮只整理文档并保存既有成果，未新增页面设计；电脑/平板/模拟手机、键盘与减少动效沿用PRD中已注明日期的浏览器检查记录，未重新做真实手机验收。交接成果已提交至本分支；最终提交和实时同步状态可用下方命令核验，默认 `main` 尚未合并。

查看当前磁盘和远端是否一致：

```bash
git branch --show-current
git rev-parse HEAD
npm run repo:status
npm run repo:check
```

`repo:status`只看本地；`repo:check`实时查询当前上游分支，要求工作区干净且远端SHA与HEAD一致，不自动提交或推送。它不检测编辑器未保存内容、忽略资料或外部服务。

交接分支用于保存本轮全部现有成果，默认分支尚未合并；提交、推送与网站部署分别核验。更换设备或正式接手前，按 [独立恢复流程](docs/TECH_DESIGN.md#6-git同步与独立恢复) 在新目录clone、比对SHA、安装依赖并运行检查，原项目副本继续保留。
