# 技术设计与开发约定

更新：2026-10-22。记录当前架构、实施方向、验证和恢复方式；产品范围及任务状态以 [PRD](PRD.md) 为准。

## 1. 当前架构

项目采用 Vinext + Vite + React，使用Next兼容的App Router接口，包管理器为npm。当前首页是服务端渲染的静态展示，尚无官网业务数据库或有效表单收件。

```text
app/                  路由、布局、首页与样式
public/assets/        网页媒体，URL为 /assets/...
worker/               Cloudflare Worker运行入口
build/                Sites构建集成源码，保留
.openai/hosting.json   既有Site标识与可选绑定，保留
db/、drizzle/         备用数据库能力，当前D1/R2未启用
examples/d1/          未接入官网的示例
tests/、scripts/      验证与本地协作工具
docs/PRD.md           需求、任务和验收
docs/TECH_DESIGN.md   本文件
docs/reference-materials/  不改写的历史原件与来源哈希
docs/assets/          资产映射数据
docs/archive/         不再维护的历史压缩快照
```

`next.config.ts` 和 `next/*` 导入属于兼容接口，不是另一套独立应用。`dist/`、`.next/`、`.vinext/`、`.wrangler/`、`node_modules/` 为依赖或生成状态，不作为交付源码编辑。

## 2. 渐进实施

- 当前 `app/page.tsx` 混放数据和首页板块，`globals.css` 包含所有样式；先保持可运行，每改一个板块再提取对应组件、结构化数据和局部样式。
- 共享页头/页脚可归 `components/site/`，首页板块归 `components/home/`，产品/案例内容归 `content/`；这些目录按实际需求创建，不铺空壳。
- `app/` 负责路由组装；产品与案例用稳定ID/slug，内容充足并确定路由后实现可复用详情模板。
- 页面拆分任务同时确定链接迁移和锚点兼容，不提前宣称目标页面已存在。
- 图片保留原件，网页输出做合适尺寸/格式、固有宽高和非首屏懒加载；改动时更新资产数据的路径、规格与哈希。
- 素材的源字段保留原文；后续公开确认记录确认人、日期和证据，不以文件存在替代批准。
- 表单接入时才确定字段、接收服务、数据去向及处理责任，实现校验、加载/成功/失败、重复提交保护和必要说明；不提前接数据库或CRM。
- Worker兼容日期/flags统一放在 `worker/compatibility.json`，Vite运行与本地类型生成共用。`cf:types` 使用已锁定Wrangler生成 `types/cloudflare-runtime.d.ts`，不读取真实环境值或操作云资源；生成文件入库便于接续，应用绑定通过 `types/cloudflare-env.d.ts` 声明合并，DB可选且保留运行时guard。

类型生成方式参考[Cloudflare TypeScript官方说明](https://developers.cloudflare.com/workers/languages/typescript/)；使用的Wrangler版本由lockfile固定。

## 3. 验证

启动命令见根README。按变更运行适用检查：

```bash
npm run build
npm run typecheck
npm test
npm run lint
npm run test:repo
npm run docs:check
npm run verify
```

不为纯文档整理重复运行全部官网构建；页面和功能改动应验证相关行为。当前已知失败与下一步统一记录在README，任务状态在PRD维护，避免多份状态漂移。

`verify` 是完整本地质量入口：类型生成/检查、Lint、文档核对、构建和全部Node测试。官网冒烟覆盖中文SSR/元数据、导航锚点、图片/图标真实文件与路径大小写，以及无旧模板骨架；另有仓库同步状态测试。它不把表单收件或未实施页面功能算作已验证。

`docs:check` 只读核对三份原件哈希、资产汇总与本地媒体、有效文档链接；历史快照及原件内的旧链接不作为现行链接检查。它不证明素材已获公开授权或官网功能通过。

界面检查覆盖375/768/980/1440px、锚点/返回/CTA、键盘焦点、减少动效、图片加载及控制台错误。只验收实际实现的路由与交互。

## 4. 版本、同步与换机

每个可验收单元关联WIV任务ID，使用 `codex/` 任务分支。未完成工作也可在获授权后提交并推送到任务分支，不必等整站完成；`main` 承载验收后的成果。

```bash
npm run repo:status
npm run repo:check
```

前者只看本地和缓存；后者直接读取当前上游分支远端SHA，只有工作区干净且与HEAD一致才通过，不自动stage/commit/push。网络失败记录“未确认”。它不检测编辑器未保存缓冲区，也不覆盖忽略资料、其他分支或外部服务数据。

每轮收工：保存编辑器文件 → 核对差异和资料 → 按当轮授权commit/push → 核验远端指定分支SHA → 在README更新最新进度与接续步骤。是否发布另行记录，不能用提交或推送代替部署。

换机前在独立目录clone交接分支，核对SHA、恢复依赖、启动并执行适用检查；原素材、必要配置和凭据另作可恢复备份，成功前保留旧副本。`git bundle`不包含未提交工作区。恢复旧代码时先另存比对，不覆盖当前修改。

## 5. 环境与发布

保留既有Site身份、Worker和构建集成；不擅自换框架、重建Site或变更访问范围。新增配置记录键名/用途/恢复方式，真实值放在适当的密钥管理或独立安全备份，不能进入普通文档或Git。

发布时核对候选提交、目标环境、配置、访问范围与回退版本；记录部署结果并检查实际页面与咨询链路。近生产旧版的代码和部署来源尚未恢复/核对，本次文档整理不表示线上版本已验证。

## 6. 参考与归档

用户提供的三份原件保持在 `reference-materials/`，`source-register.json` 保留来源哈希；实际素材对应在 `assets/asset-registry.json`，不是另一套任务表。

精简前的生成文档保存在 [历史快照](archive/docs-before-simplification-2026-10-22.zip)，不再维护、不作为现行规则。需要追溯时解压到独立目录；当前入口只有根README、本文件、PRD和AGENTS。

架构、配置、数据模型、恢复或发布方式变化时更新本文件；普通文案调整不需要修改技术设计。
