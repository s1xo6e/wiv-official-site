import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// This is a local type-generation configuration, never a deployment config.
const root = fileURLToPath(new URL("../", import.meta.url));
process.chdir(root);
process.env.WRANGLER_WRITE_LOGS = "false";
process.env.WRANGLER_LOG_PATH = ".wrangler/logs";
process.env.MINIFLARE_REGISTRY_PATH = ".wrangler/registry";
const compatibility = JSON.parse(await readFile(join(root, "worker/compatibility.json"), "utf8"));
const configPath = ".wrangler/typegen/wrangler.json";
const outputPath = "types/cloudflare-runtime.d.ts";

await mkdir(dirname(join(root, configPath)), { recursive: true });
await mkdir(dirname(join(root, outputPath)), { recursive: true });
await writeFile(join(root, configPath), JSON.stringify({
  name: "wiv-official-site-local-types",
  ...compatibility,
}, null, 2) + "\n");

// Runtime-only generation reads no .env/.dev.vars and declares no bindings.
// The API uses the same generator as `wrangler types` without writing for us.
const { experimental_generateTypes } = await import("wrangler");
const result = await experimental_generateTypes({
  config: configPath,
  path: outputPath,
  includeEnv: false,
  includeRuntime: true,
  envFile: [],
});
let previous;
try {
  previous = await readFile(join(root, outputPath), "utf8");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
if (previous !== result.content) await writeFile(join(root, outputPath), result.content);
console.log(`Cloudflare runtime types ${previous === result.content ? "verified" : "generated"}: ${outputPath}`);
