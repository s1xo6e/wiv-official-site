import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { isAbsolute, join, relative, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const origin = "http://localhost";
const publicRoot = fileURLToPath(new URL("../public/", import.meta.url));
let renderedHome;

function decodeHtml(value) {
  return value.replace(/&(?:amp|quot|apos|lt|gt|#(?:x[\da-f]+|\d+));/gi, entity => {
    const named = { "&amp;": "&", "&quot;": '"', "&apos;": "'", "&lt;": "<", "&gt;": ">" };
    if (named[entity.toLowerCase()]) return named[entity.toLowerCase()];
    const numeric = entity.slice(2, -1);
    return String.fromCodePoint(numeric[0].toLowerCase() === "x" ? parseInt(numeric.slice(1), 16) : parseInt(numeric, 10));
  });
}

function attributes(tag) {
  const values = {};
  for (const match of tag.matchAll(/\s([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    values[match[1].toLowerCase()] = decodeHtml(match[2] ?? match[3] ?? match[4]);
  }
  return values;
}

async function renderHome() {
  renderedHome ??= (async () => {
    const { default: worker } = await import(new URL("../dist/server/index.js", import.meta.url).href);
    const response = await worker.fetch(
      new Request(`${origin}/`, { headers: { accept: "text/html" } }),
      { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
      { waitUntil() {}, passThroughOnException() {} },
    );
    const html = (await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "");
    return { response, html, body: html.match(/<body\b[^>]*>([\s\S]*)<\/body\s*>/i)?.[1] ?? "" };
  })();
  return renderedHome;
}

async function assertPublicFile(reference) {
  const url = new URL(reference, origin);
  assert.equal(url.origin, origin, `Expected a local asset: ${reference}`);
  const pathname = decodeURIComponent(url.pathname);
  assert.ok(!pathname.includes("\\") && !pathname.includes("\0"), `Invalid asset path: ${reference}`);
  const target = resolve(publicRoot, `.${pathname}`);
  const withinPublic = relative(publicRoot, target);
  assert.ok(withinPublic && !isAbsolute(withinPublic) && withinPublic !== ".." && !withinPublic.startsWith("../"), `Asset escapes public/: ${reference}`);

  // macOS may resolve wrong-case names successfully; directory entries must
  // still match exactly so the same URL works on case-sensitive deployments.
  let current = publicRoot;
  for (const segment of withinPublic.split("/")) {
    const names = await readdir(current);
    const actualName = names.find(name => name.normalize("NFC") === segment.normalize("NFC"));
    assert.ok(actualName, `Missing or differently-cased asset segment ${segment}: ${reference}`);
    current = join(current, actualName);
  }
  assert.ok((await stat(current)).isFile(), `Asset is not a file: ${reference}`);
  assert.ok((await readFile(current)).length > 0, `Asset is empty: ${reference}`);
}

test("server-renders the Chinese WIV homepage with public metadata", async () => {
  const { response, html, body } = await renderHome();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  assert.match(html, /<html\b[^>]*\blang=["']zh-CN["']/i);
  assert.match(html, /<title>[^<]*西部智车[^<]*<\/title>/i);
  const description = [...html.matchAll(/<meta\b[^>]*>/gi)].map(match => attributes(match[0])).find(meta => meta.name === "description");
  assert.ok(description?.content?.trim(), "The homepage needs a non-empty search description");
  assert.match(body, /<main\b/i);
  assert.equal([...body.matchAll(/<h1\b[^>]*>/gi)].length, 1, "The homepage needs one primary heading");
  assert.match(body, /<h1\b[^>]*>\s*[^<\s][\s\S]*?<\/h1>/i);
});

test("primary navigation and fragment links resolve to unique homepage targets", async () => {
  const { body } = await renderHome();
  const ids = [...body.matchAll(/<[a-z][^>]*>/gi)].map(match => attributes(match[0])).filter(attrs => Object.hasOwn(attrs, "id")).map(attrs => attrs.id);
  assert.equal(new Set(ids).size, ids.length, "Rendered element IDs must be unique");
  const navigation = [...body.matchAll(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi)].find(match => attributes(match[0].slice(0, match[0].indexOf(">") + 1))["aria-label"] === "主导航")?.[0];
  assert.ok(navigation, "The homepage needs its named primary navigation");
  const navigationLinks = [...navigation.matchAll(/<a\b[^>]*>/gi)].map(match => attributes(match[0]).href);
  for (const target of ["home", "solutions", "cases", "about", "contact"]) {
    assert.ok(navigationLinks.includes(`#${target}`), `Missing primary navigation link: #${target}`);
    assert.ok(ids.includes(target), `Missing primary navigation target: #${target}`);
  }
  for (const match of body.matchAll(/<a\b[^>]*>/gi)) {
    const href = attributes(match[0]).href;
    if (href?.startsWith("#")) {
      assert.ok(href.length > 1, "Empty fragment links are not navigation");
      assert.ok(ids.includes(decodeURIComponent(href.slice(1))), `Broken fragment link: ${href}`);
    }
  }
});

test("rendered images and icons reference readable, correctly-cased public files", async () => {
  const { html, body } = await renderHome();
  const references = new Set();
  const images = [...body.matchAll(/<(?:img|source)\b[^>]*>/gi)];
  assert.ok(images.some(match => /^<img\b/i.test(match[0])), "The homepage needs rendered media");
  for (const match of images) {
    const media = attributes(match[0]);
    if (/^<img\b/i.test(match[0])) {
      assert.ok(media.src?.trim(), "Rendered images need a source");
      assert.ok(Object.hasOwn(media, "alt"), "Rendered images need an explicit alt attribute");
    }
    if (media.src) references.add(media.src);
    for (const candidate of (media.srcset ?? "").split(",").filter(Boolean)) references.add(candidate.trim().split(/\s+/)[0]);
  }
  const icons = [...html.matchAll(/<link\b[^>]*>/gi)].map(match => attributes(match[0])).filter(link => /(?:^|\s)(?:icon|apple-touch-icon|mask-icon)(?:\s|$)/i.test(link.rel ?? ""));
  assert.ok(icons.length > 0, "The homepage needs a site icon");
  for (const icon of icons) {
    assert.ok(icon.href?.trim(), "Site icons need a source");
    references.add(icon.href);
  }
  for (const reference of references) await assertPublicFile(reference);
});

test("the production document no longer contains the starter loading screen", async () => {
  const { html, body } = await renderHome();
  assert.doesNotMatch(body, /Your site is taking shape|Building your site|sites-skeleton-|react-loading-skeleton/i);
  const meta = [...html.matchAll(/<meta\b[^>]*>/gi)].map(match => attributes(match[0]));
  assert.ok(!meta.some(item => item.name === "codex-preview"), "Development-only preview metadata must not ship");
});
