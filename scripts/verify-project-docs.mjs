import { createHash } from "node:crypto";
import { readFile, readdir, stat } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const errors = [];
const requireThat = (condition, message) => { if (!condition) errors.push(message); };
const digest = bytes => createHash("sha256").update(bytes).digest("hex");
const readJson = async path => JSON.parse(await readFile(join(root, path), "utf8"));
const counts = (items, field) => items.reduce((out, item) => ({ ...out, [item[field]]: (out[item[field]] ?? 0) + 1 }), {});
const sameCounts = (a, b) => JSON.stringify(Object.entries(a).sort()) === JSON.stringify(Object.entries(b).sort());

function webpDimensions(bytes) {
  if (bytes.toString("ascii", 0, 4) !== "RIFF" || bytes.toString("ascii", 8, 12) !== "WEBP") return null;
  for (let offset = 12; offset + 8 <= bytes.length;) {
    const type = bytes.toString("ascii", offset, offset + 4);
    const length = bytes.readUInt32LE(offset + 4);
    const start = offset + 8;
    if (start + length > bytes.length) return null;
    if (type === "VP8 " && length >= 10) return [bytes.readUInt16LE(start + 6) & 0x3fff, bytes.readUInt16LE(start + 8) & 0x3fff];
    if (type === "VP8X" && length >= 10) return [bytes.readUIntLE(start + 4, 3) + 1, bytes.readUIntLE(start + 7, 3) + 1];
    if (type === "VP8L" && length >= 5 && bytes[start] === 0x2f) {
      const dimensions = bytes.readUInt32LE(start + 1);
      return [(dimensions & 0x3fff) + 1, ((dimensions >>> 14) & 0x3fff) + 1];
    }
    offset = start + length + (length % 2);
  }
  return null;
}

async function walk(path) {
  const files = [];
  for (const entry of await readdir(path, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const next = join(path, entry.name);
    if (entry.isDirectory()) files.push(...await walk(next));
    else if (entry.isFile()) files.push(next);
  }
  return files;
}

try {
  const sources = await readJson("docs/reference-materials/source-register.json");
  for (const source of sources.sources) {
    const bytes = await readFile(join(root, source.archivedPath));
    requireThat(digest(bytes) === source.sha256, `来源归档哈希不一致：${source.archivedPath}`);
    requireThat(bytes.length === source.bytes, `来源归档大小不一致：${source.archivedPath}`);
  }

  const registry = await readJson("docs/assets/asset-registry.json");
  requireThat(digest(await readFile(join(root, registry.sourceWorkbook))) === registry.sourceSha256, "资产台账来源工作簿哈希不一致");
  requireThat(registry.assets.length === registry.summary.sourceAssetCount, "来源资产总数不一致");
  requireThat(new Set(registry.assets.map(a => a.assetId)).size === registry.assets.length, "资产ID重复");
  requireThat(sameCounts(counts(registry.assets, "category"), registry.summary.sourceCategoryCounts), "来源分类汇总不一致");
  requireThat(sameCounts(counts(registry.assets, "technicalStatus"), registry.summary.sourceTechnicalStatusCounts), "技术状态汇总不一致");
  requireThat(sameCounts(counts(registry.assets, "sourcePublicStatus"), registry.summary.sourcePublicStatusCounts), "来源公开状态汇总不一致");
  requireThat(sameCounts(counts(registry.assets, "matchType"), registry.summary.matchTypeCounts), "匹配类型汇总不一致");
  requireThat(registry.pageMappings.length === registry.summary.pageMappingCount, "页面映射汇总不一致");
  requireThat(registry.gaps.length === registry.summary.gapCount, "待补项汇总不一致");
  const missing = registry.assets.filter(a => a.matchType === "not-found").map(a => a.assetId).sort();
  requireThat(JSON.stringify(missing) === JSON.stringify([...registry.summary.missingAssetIds].sort()), "缺失资产ID汇总不一致");

  const mapped = new Set();
  for (const asset of registry.assets) {
    if (!asset.localPath) {
      requireThat(asset.matchType === "not-found", `${asset.assetId} 缺少本地路径但未标缺失`);
      requireThat(!asset.webDerivative, `${asset.assetId} 缺少原图却登记了网页派生图`);
      continue;
    }
    requireThat(asset.matchType !== "not-found", `${asset.assetId} 本地路径与缺失标记矛盾`);
    const localPath = resolve(root, asset.localPath);
    const insideAssets = relative(join(root, "public/assets"), localPath);
    requireThat(insideAssets && !insideAssets.startsWith(".."), `${asset.assetId} 路径不在公共素材目录`);
    const bytes = await readFile(localPath);
    requireThat(digest(bytes) === asset.localSha256, `${asset.assetId} 文件变化，需刷新台账哈希`);
    requireThat(bytes.length === asset.localBytes, `${asset.assetId} 文件大小变化，需刷新台账`);
    mapped.add(localPath);
    if (asset.webDerivative) {
      const derivative = asset.webDerivative;
      const derivativePath = resolve(root, derivative.path);
      const withinWeb = relative(join(root, "public/assets/products/web"), derivativePath);
      requireThat(withinWeb && !withinWeb.startsWith("..") && extname(derivativePath) === ".webp", `${asset.assetId} 派生图路径不在产品网页素材目录`);
      requireThat(derivative.derivedFrom === asset.localPath, `${asset.assetId} 派生图原图对应不一致`);
      const webBytes = await readFile(derivativePath);
      requireThat(digest(webBytes) === derivative.sha256, `${asset.assetId} 派生图变化，需刷新台账哈希`);
      requireThat(webBytes.length === derivative.bytes, `${asset.assetId} 派生图大小变化，需刷新台账`);
      const dimensions = webpDimensions(webBytes);
      requireThat(dimensions && dimensions[0] === derivative.width && dimensions[1] === derivative.height, `${asset.assetId} 派生图实际尺寸与台账不一致`);
      mapped.add(derivativePath);
    }
  }
  const extensions = new Set([".png", ".jpg", ".jpeg", ".svg", ".webp", ".avif", ".gif", ".mp4", ".webm", ".mov", ".m4v"]);
  const media = (await walk(join(root, "public/assets"))).filter(path => extensions.has(extname(path).toLowerCase()));
  requireThat(media.length === registry.summary.currentMediaCount, "当前媒体数量变化，需刷新台账");
  for (const path of media) requireThat(mapped.has(path), `本地素材未登记：${relative(root, path)}`);

  const referenceRoots = ["reference-materials", "archive"].map(name => join(root, "docs", name) + "/");
  const docs = (await walk(join(root, "docs"))).filter(path => path.endsWith(".md") && !referenceRoots.some(prefix => path.startsWith(prefix)));
  docs.push(join(root, "README.md"), join(root, "AGENTS.md"));
  for (const path of docs) {
    const text = (await readFile(path, "utf8")).replace(/```[\s\S]*?```/g, "");
    for (const match of text.matchAll(/\[[^\]]+\]\((?:<([^>]+)>|([^\s)]+))\)/g)) {
      const href = match[1] ?? match[2];
      if (href.startsWith("#") || /^[a-z][a-z\d+.-]*:/i.test(href)) continue;
      const target = resolve(dirname(path), decodeURIComponent(href.split("#")[0]));
      try { await stat(target); } catch { errors.push(`链接不存在：${relative(root, path)} → ${href}`); }
    }
  }
  const scopedRules = (await walk(join(root, "docs"))).filter(path => /\/(AGENTS|AGENTS\.override)\.md$/.test(path));
  requireThat(scopedRules.length === 0, "docs 内出现会自动生效的 AGENTS 文件，请确认来源资料未误命名");

  if (errors.length) {
    console.error(`文档检查失败（${errors.length} 项）：`);
    errors.forEach(error => console.error(`- ${error}`));
    process.exitCode = 1;
  } else {
    console.log(`文档检查通过：${sources.sources.length}份来源归档哈希、${registry.assets.length}项资产记录、${media.length}个媒体文件、${docs.length}份有效文档链接。`);
    console.log("此检查不证明素材已获公开授权，也不代替官网功能检查或 Git 远端同步。");
  }
} catch (error) {
  console.error(`无法完成文档检查：${error.message}`);
  process.exitCode = 1;
}
