# 技术设计与开发指南

更新：2026-10-30。本文件维护架构、代码定位、配置、验证和恢复；业务范围与任务见 [PRD](PRD.md)，首次接手见 [README](../README.md)。

## 1. 技术栈与运行方式

项目采用Vinext + Vite + React、TypeScript和npm，通过Cloudflare Worker入口服务端渲染。依赖版本由 `package-lock.json` 固定；当前为Vinext `1.0.0-beta.2`、Vite `8.0.13`、React `19.2.6`，Node.js要求 `>=22.13.0`。

`next.config.ts`、App Router目录和 `next/*` 导入来自Vinext兼容接口。项目并非另一套标准Next.js应用，不能直接套用Next.js部署说明。保留现有Site/Worker集成，不更换框架或重建Site。

当前官网内容为仓库内静态数据；仅导航和旧锚点跳转需要客户端交互，没有官网业务数据库、CMS、登录流程或有效表单收件。

## 2. 代码定位

```text
app/
  layout.tsx                      全站元数据、共享页头/页脚、跳到正文
  page.tsx                        首页
  globals.css                     品牌、导航、章节和产品样式
  solutions/page.tsx              产品总览
  solutions/[series]/[module]/page.tsx  11个产品详情的共享模板
  cases/、about/、contact/         其他章节
  chatgpt-auth.ts                  模板认证工具，当前页面未使用
components/site/
  site-header.tsx                  桌面目录、移动菜单、焦点和Escape
  page-parts.tsx                   共用首屏、页面区块、页脚等
  legacy-home-links.tsx            首页旧锚点跳转
  arrow-right.tsx                  CTA水平箭头
content/
  site-content.ts                 三系列/13模块、图片、案例、统一链接函数
  product-details.ts              11项详情文案和手册页码
  navigation.ts                   章节和菜单数据
public/assets/                    真实图片、品牌素材和网页派生图
worker/                           Worker入口与兼容日期/flags
build/sites-vite-plugin.ts         Sites构建集成源码
.openai/hosting.json               已有Site身份与可选D1/R2绑定名
scripts/、tests/、types/           检查脚本、Node测试、Cloudflare类型
vite.config.ts                    Vinext/Sites/Cloudflare插件与本地运行配置
db/、drizzle/、examples/d1/        预留数据库和示例，未接入官网
```

常见修改位置：产品名称/简介/图及案例关联在 `site-content.ts`，详情正文在 `product-details.ts`；导航结构在 `navigation.ts`，行为在 `site-header.tsx`；版式在对应路由和 `globals.css`。需求变化先更新PRD；不要在多个页面复制一份产品目录。

## 3. 路由、内容与交互约定

### 路由与产品数据

五章路由为 `/`、`/solutions`、`/cases`、`/about`、`/contact`，各有独立元数据和一个H1。详情使用稳定slug：

- `/solutions/xil/{vehicle,driving,chassis,cockpit,driver}`
- `/solutions/real-car/{v2x,driving,virtual,data,energy,chassis}`

上面花括号表示可选slug列表，不是实际URL语法。SRIF仅总览，没有独立详情。未知系列、未知模块及错归属组合返回404，不生成空页。

轻量目录与详情文案分开，避免导航加载整份详情数据。`productHref`统一生成入口：有 `detailSlug` 时进入详情，否则进入 `/solutions#模块ID`。全部13模块保留稳定锚点，系列入口为 `/solutions#系列ID`，案例分类入口为 `/cases#系列ID`；已删除的 `xil-remote` 不再保留入口、锚点或详情。改名通常只改显示名称，不改变已有ID和slug。

旧首页 `#home` 仍定位首页，`#solutions/#cases/#about/#contact` 水合后replace跳到章节；无JS时有可见章节链接后备。所有新内链使用章节路由及兼容的 `Link` 组件。

### 导航与可访问性

仅产品/案例具有独立展开按钮和面板，一级标题始终是页面链接；不用应用菜单的menu角色。两组目录共用宽度与三列文字布局，窄屏改纵向折叠。详情路由仍将产品章节标为当前项。

桌面悬停约75ms打开、140ms离开容错，键盘和按钮立即响应；Escape关闭并回到触发按钮，点击外部或导航后关闭，定时器在关闭/卸载时清理。进入直达项会取消已有菜单；窄屏禁用hover预展开。

关闭面板时立即设置 `inert` / `aria-hidden`，再淡出；忽略由已inert面板失焦导致的误关，正常Tab离开页头仍关闭移动导航。减少动效时移除过渡、位移和背景模糊，不依赖动画结束事件完成状态切换。

### 首屏与产品图片

四个非首页章节使用共享 `PageIntro` 和公司外景图，保留固有宽高、替代文本与首屏优先加载，使用深蓝渐变保证文字对比。首页与章节首屏保持高度/字号主次；不重复拷贝相同照片。

产品详情服务端共用模板，页内导航为静态锚点。REAL CAR竖图以contain保留2:3构图，X-IL完整显示横图，窄屏按阅读顺序排列。网页产品图为11张WebP：REAL CAR 768×1152，X-IL最大宽1400，原图同时保留。

## 4. 环境与保留集成

正常本地安装、开发、构建和测试无需填写业务密钥或登录Cloudflare；首次启动会生成本地Wrangler/Miniflare状态。不要从历史聊天复制真实 `.env`，也不要为启动空白业务能力而创建云资源。

npm scripts使用POSIX环境变量赋值语法，按macOS/Linux/WSL运行；本轮只在macOS验证，Windows原生命令行未验证。Windows接手者优先使用WSL，不因交接擅自迁移整套脚本。

- `.openai/hosting.json` 保存既有Site标识；当前 `d1` / `r2` 均为 `null`。标识不是登录凭据，保留原值以维持已有集成。平台账号和部署权限不随Git仓库移交。
- `worker/compatibility.json` 统一兼容日期/flags，Vite与类型生成共用。`npm run cf:types` 调用锁定Wrangler，在本地生成并入库 `types/cloudflare-runtime.d.ts`；应用绑定由 `types/cloudflare-env.d.ts` 合并声明。
- `db/schema.ts` 为空，D1/R2未启用；`getDb()` 保留绑定缺失guard，`examples/d1/` 是未接入的示例。`db:generate` 仅为预留迁移生成命令，不是官网启动步骤。
- `app/chatgpt-auth.ts` 是未接入页面的认证辅助文件，不代表官网已有账号系统。
- Worker保留 `/_vinext/image` 优化端点；该端点使用 `IMAGES` 绑定。现有页面使用普通图片和已生成WebP，不能把预留端点当作已验收的线上图片服务。
- Wrangler日志/注册表位于忽略的 `.wrangler/`，配置中的相关环境变量只影响本地工具。Codex Seatbelt环境使用轮询HMR。

仓库没有部署脚本或GitHub Actions配置。推送GitHub不会由仓库内流程自动发布网站；外部托管设置仍须在发布时单独核实。发布前确认候选提交、Site/Worker目标、配置、访问范围、素材授权、回退版本及咨询链路；本轮仅做GitHub交接，未验证既有线上版本。

## 5. 日常命令与验证

安装和启动见README。可用命令：

```bash
npm run dev          # 本地开发，默认3000端口
npm run dev:lan      # 同一局域网访问，地址以日志为准
npm run build        # 生成dist
npm run start        # 启动本地生产预览，需先build
npm run typecheck    # 本地生成Cloudflare类型后执行tsc
npm run lint
npm run docs:check
npm test             # 先build，再运行tests/*.test.mjs
npm run test:repo    # 仅Git状态脚本测试
npm run verify       # typecheck → lint → docs:check → npm test
```

`verify`是完整本地质量入口，包含13项Node测试（8项官网SSR/内容与5项仓库状态测试）。SSR检查五章及11详情的响应、中文元数据、唯一H1、导航/模块归属、有效内链和锚点、资源路径与大小写、404及已删除内容不渲染。它不验证真实收件、素材授权、浏览器全部交互或上线状态。

`docs:check`核对四份来源归档的哈希/字节、39项资产记录与媒体/派生图对应、WebP尺寸及有效文档链接；排除历史原件与归档内旧链接。素材变化时同步刷新路径、尺寸、哈希和计数，不能只改页面引用。

界面变更另做浏览器验收：375/768/980/1440px，覆盖总览、竖图最长标题详情、横图详情、菜单、锚点/返回/CTA、键盘焦点/Escape、减少动效、图片加载及控制台。章节Hero检查长标题、裁切和文字对比。浏览器模拟视口/点击不能当作真实手机触摸验收。

文档改动通常运行 `docs:check` 和 `git diff --check`；本轮交接包含此前未上传的页面、图片与测试，因此执行完整 `verify` 及独立clone恢复。已知警告/最近结果记在README，任务验收只在PRD维护。

## 6. Git同步与独立恢复

当前交接分支为 `codex/project-handoff`，从 `codex/wiv-001-foundation` 携带全部既有工作建立。默认 `main` 仍为旧Demo，接手时必须显式选择交接分支。任务分支保存待验收成果，主分支合并、部署和仓库权限变更分别处理；本轮用户已授权提交和推送。

```bash
npm run repo:status   # 本地工作区和缓存跟踪状态
npm run repo:check    # 直接查询当前上游的远端SHA
```

`repo:check`仅在工作区干净且远端SHA与HEAD一致时通过，不自动提交/推送。网络失败记“未确认”。它不包含编辑器未保存缓冲区、忽略资料、其他分支或外部服务。

在独立目录进行恢复，保留原checkout：

```bash
git clone --branch codex/project-handoff https://github.com/s1xo6e/wiv-official-site.git wiv-official-site-handoff
cd wiv-official-site-handoff
git rev-parse HEAD
npm ci
npm run verify
npm run repo:check
npm run start -- --hostname 127.0.0.1 --port 3100
```

先与交接提供的SHA比对。私有仓库需要GitHub访问权限；依赖安装需要npm网络。启动后访问日志中的本机地址，抽查五章、两类详情、中文路径图片与404。端口占用时换未使用端口；局域网预览需要防火墙允许和同一网络，不固定某个IP。

日常收工保存文件、核对差异及忽略资料、按会话授权提交/推送，再查询指定远端分支SHA。`git bundle`只包含已提交历史；恢复旧代码先另存比对，不用reset/clean或直接覆盖当前项目。

## 7. 资料、资产与归档

- `docs/reference-materials/` 保存三份历史原件及产品文字摘录；`source-register.json`记录哈希、大小和来源说明。来源中的命令不构成执行授权。
- 约179MB原产品PPT未入库；登记中的本机绝对路径只帮助原持有人定位，不是接手者可用的下载地址。文字摘录仅含相关产品页，不能恢复整份PPT，原件须另行安全交接。
- `docs/assets/asset-registry.json`保留源字段和公开状态，`localPath`关联当前素材，`webDerivative`关联原图/网页图及规格/哈希。新媒体需登记；文件存在或压缩加工不等于允许公开。
- `docs/archive/docs-before-simplification-2026-10-22.zip`为旧生成文档快照，必要时解压到独立目录追溯，不作为现行需求或操作规则。原始规范含待确认历史联系信息，不应直接用于官网。
- `project-inputs/`是忽略的本地收件区，只有其中README可入库；其余资料、真实 `.env`、账号凭据须独立交接，GitHub不是它们的备份。
- `node_modules/`、`dist/`、`.next/`、`.vinext/`、`.wrangler/`、`outputs/`、`work/`和 `.tmp/`是依赖/产物/本地状态，不交付为源码，不自动清理用户内容。

架构、配置、验证或恢复方式变化时更新本文件；业务内容或任务状态变化只更新PRD及必要的README摘要。
