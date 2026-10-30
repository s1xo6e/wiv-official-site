import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { isAbsolute, join, relative, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const origin = "http://localhost";
const publicRoot = fileURLToPath(new URL("../public/", import.meta.url));
const chapterRoutes = ["/", "/solutions", "/cases", "/about", "/contact"];
// Product names and routes are independent expectations from PRD §3.1 and the
// supplied handbook, rather than importing the application's own product data.
const expectedModules = {
  xil: [
    { id: "xil-vehicle", name: "整车在环模块", slug: "vehicle", concepts: [/负载/, /动力学/] },
    { id: "xil-driving", name: "智驾在环模块", slug: "driving", concepts: [/域控制器/, /场景/] },
    { id: "xil-chassis", name: "底盘在环模块", slug: "chassis", concepts: [/EMB/, /故障/] },
    { id: "xil-cockpit", name: "座舱在环模块", slug: "cockpit", concepts: [/触控/, /语音/] },
    { id: "xil-driver", name: "驾驶员在环模块", slug: "driver", concepts: [/驾驶舱/, /人机|交互/] },
  ],
  "real-car": [
    { id: "real-car-v2x", name: "车路云模块", slug: "v2x", concepts: [/云控/, /V2X/] },
    { id: "real-car-driving", name: "智能驾驶模块", slug: "driving", concepts: [/线控/, /标定/] },
    { id: "real-car-virtual", name: "智能驾驶虚拟测试模块", slug: "virtual", concepts: [/传感器/, /自动化/] },
    { id: "real-car-data", name: "数据采集模块", slug: "data", concepts: [/多模态/, /数据采集/] },
    { id: "real-car-energy", name: "能量管理模块", slug: "energy", concepts: [/能量/, /策略/] },
    { id: "real-car-chassis", name: "智能底盘模块", slug: "chassis", concepts: [/定位/, /控制/] },
  ],
  srif: [
    { id: "srif-in-loop", name: "SRIF在环模块" },
    { id: "srif-prototype", name: "SRIF模块" },
  ],
};
const detailProducts = Object.entries(expectedModules).flatMap(([series, products]) =>
  products.filter(product => product.slug).map(product => ({ ...product, series, path: `/solutions/${series}/${product.slug}` })),
);
const routes = [...chapterRoutes, ...detailProducts.map(product => product.path)];
let renderedPages;
let workerPromise;

async function renderRoute(path) {
  workerPromise ??= import(new URL("../dist/server/index.js", import.meta.url).href).then(module => module.default);
  const worker = await workerPromise;
  const response = await worker.fetch(
    new Request(`${origin}${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  const html = (await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "");
  const body = html.match(/<body\b[^>]*>([\s\S]*)<\/body\s*>/i)?.[1] ?? "";
  const ids = [...body.matchAll(/<[a-z][^>]*>/gi)]
    .map(match => attributes(match[0]))
    .filter(attrs => Object.hasOwn(attrs, "id"))
    .map(attrs => attrs.id);
  return { response, html, body, ids };
}

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

async function renderPages() {
  renderedPages ??= (async () => {
    const pages = new Map();
    for (const path of routes) {
      pages.set(path, await renderRoute(path));
    }
    return pages;
  })();
  return renderedPages;
}

function primaryNavigation(body) {
  return [...body.matchAll(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi)]
    .find(match => attributes(match[0].slice(0, match[0].indexOf(">") + 1))["aria-label"] === "主导航")?.[0];
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

test("server-renders five chapters and eleven product details with distinct metadata and headings", async () => {
  const titles = new Set();
  const descriptions = new Set();
  const headings = new Set();
  for (const [path, { response, html, body }] of await renderPages()) {
    assert.equal(response.status, 200, path);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i, path);
    assert.match(html, /<html\b[^>]*\blang=["']zh-CN["']/i, path);
    assert.match(html, /<title>[^<]*西部智车[^<]*<\/title>/i, path);
    titles.add(html.match(/<title>([^<]*)<\/title>/i)?.[1]);
    const description = [...html.matchAll(/<meta\b[^>]*>/gi)].map(match => attributes(match[0])).find(meta => meta.name === "description");
    assert.ok(description?.content?.trim(), `${path} needs a non-empty search description`);
    descriptions.add(description.content);
    assert.match(body, /<main\b/i, path);
    assert.equal([...body.matchAll(/<h1\b[^>]*>/gi)].length, 1, `${path} needs one primary heading`);
    const heading = body.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1].replace(/<[^>]*>/g, "").trim();
    assert.ok(heading, `${path} needs a non-empty primary heading`);
    headings.add(heading);
  }
  assert.equal(titles.size, routes.length, "Each chapter needs its own page title");
  assert.equal(descriptions.size, routes.length, "Each chapter needs its own description");
  assert.equal(headings.size, routes.length, "Each chapter needs its own primary heading");
});

test("chapters and product details provide five page links, two expandable sections, and one current entry", async () => {
  for (const [path, { body, ids }] of await renderPages()) {
    const navigation = primaryNavigation(body);
    assert.ok(navigation, `${path} needs its named primary navigation`);
    const links = [...navigation.matchAll(/<a\b[^>]*>/gi)].map(match => attributes(match[0]));
    for (const target of chapterRoutes) {
      assert.ok(links.some(link => link.href === target), `${path} is missing the chapter link ${target}`);
    }
    const active = links.filter(link => link["aria-current"] === "page");
    assert.equal(active.length, 1, `${path} needs exactly one current chapter`);
    assert.equal(active[0].href, path.startsWith("/solutions/") ? "/solutions" : path, `${path} marks the wrong chapter`);
    const submenuButtons = [...navigation.matchAll(/<button\b[^>]*>/gi)].map(match => attributes(match[0]));
    assert.deepEqual(
      submenuButtons.map(button => button["aria-controls"]).sort(),
      ["submenu-cases", "submenu-solutions"],
      `${path} must offer expansion only for products and cases`,
    );
    for (const button of submenuButtons) {
      assert.ok(ids.includes(button["aria-controls"]), `Missing menu panel ${button["aria-controls"]} on ${path}`);
      assert.match(button["aria-expanded"] ?? "", /^(?:true|false)$/, `Missing expansion state on ${path}`);
    }
    for (const [id, href] of [["home", "/"], ["about", "/about"], ["contact", "/contact"]]) {
      assert.ok(!ids.includes(`submenu-${id}`), `${path} must not render a submenu for ${href}`);
      for (const link of links.filter(item => item.href === href)) {
        for (const attribute of ["aria-controls", "aria-expanded", "aria-haspopup"]) {
          assert.ok(!Object.hasOwn(link, attribute), `${href} must remain a direct page link on ${path}`);
        }
      }
    }
  }
});

test("all rendered internal links reach an implemented page or an existing unique fragment", async () => {
  const pages = await renderPages();
  for (const [path, { body, ids }] of pages) {
    assert.equal(new Set(ids).size, ids.length, `${path} contains duplicate element IDs`);
    for (const match of body.matchAll(/<a\b[^>]*>/gi)) {
      const href = attributes(match[0]).href;
      assert.ok(href?.trim(), `${path} contains a link without a destination`);
      assert.notEqual(href, "#", `${path} contains an empty fragment link`);
      const target = new URL(href, `${origin}${path}`);
      if (target.origin !== origin) continue;
      const destination = pages.get(target.pathname);
      assert.ok(destination, `Unknown internal page ${href} on ${path}`);
      if (target.hash) {
        assert.ok(destination.ids.includes(decodeURIComponent(target.hash.slice(1))), `Broken fragment ${href} on ${path}`);
      }
    }
  }
});

test("product and case navigation retain three independent product lines and all thirteen modules", async () => {
  const pages = await renderPages();
  const solutions = pages.get("/solutions");
  const cases = pages.get("/cases");
  const navigation = primaryNavigation(pages.get("/").body);
  const navigationTargets = new Set([...navigation.matchAll(/<a\b[^>]*>/gi)].map(match => attributes(match[0]).href));
  const modules = new Set();
  for (const [line, expectedProducts] of Object.entries(expectedModules)) {
    assert.ok(navigationTargets.has(`/solutions#${line}`), `Missing product series link: ${line}`);
    assert.ok(navigationTargets.has(`/cases#${line}`), `Missing case direction link: ${line}`);
    assert.ok(cases.ids.includes(line), `Missing case direction: ${line}`);
    const section = [...solutions.body.matchAll(/<section\b[^>]*>[\s\S]*?<\/section>/gi)]
      .find(match => attributes(match[0].slice(0, match[0].indexOf(">") + 1)).id === line)?.[0];
    assert.ok(section, `Missing independent product series: ${line}`);
    const products = [...section.matchAll(/<article\b[^>]*>/gi)].map(match => attributes(match[0]).id);
    assert.equal(products.length, expectedProducts.length, `${line} has the wrong module count`);
    const renderedNames = [...section.matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>/gi)]
      .map(match => decodeHtml(match[1].replace(/<[^>]*>/g, "")).trim());
    assert.deepEqual(renderedNames.sort(), expectedProducts.map(product => product.name).sort(), `${line} contains the wrong product modules`);
    assert.deepEqual(products.sort(), expectedProducts.map(product => product.id).sort(), `${line} must preserve its module fragments`);
    for (const product of expectedProducts) {
      const destination = product.slug ? `/solutions/${line}/${product.slug}` : `/solutions#${product.id}`;
      assert.ok(navigationTargets.has(destination), `Missing product navigation link: ${destination}`);
      modules.add(product.id);
    }
  }
  assert.equal(modules.size, 13, "The three product lines must expose thirteen distinct modules");
  assert.doesNotMatch(navigation, /远程驾驶|xil-remote/, "The removed remote-driving product must not appear in navigation");
  assert.doesNotMatch(solutions.body, /远程驾驶|xil-remote/, "The removed product must not remain in the overview or series copy");
});

test("product details explain their own system and testing scope with return and sibling paths", async () => {
  const pages = await renderPages();
  const navigation = primaryNavigation(pages.get("/").body);
  const navigationLinks = [...navigation.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/gi)];
  for (const product of detailProducts) {
    const { body } = pages.get(product.path);
    const main = body.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
    assert.ok(main, `${product.path} needs its own main content`);
    const heading = decodeHtml(main.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1].replace(/<[^>]*>/g, "").trim() ?? "");
    assert.equal(heading, product.name, `${product.path} must use the handbook product name`);
    const headings = [...main.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)].map(match => decodeHtml(match[1].replace(/<[^>]*>/g, "")));
    for (const required of [/系统组成/, /研发.*测试|测试.*研发/, /应用方向/]) {
      assert.ok(headings.some(headingText => required.test(headingText)), `${product.path} needs a ${required} content section`);
    }
    const text = decodeHtml(main.replace(/<[^>]*>/g, " "));
    for (const concept of product.concepts) assert.match(text, concept, `${product.path} omits a product-specific research concept`);
    const links = [...main.matchAll(/<a\b[^>]*>/gi)].map(match => attributes(match[0]).href);
    assert.ok(links.includes(`/solutions#${product.series}`), `${product.path} needs a way back to its series`);
    assert.ok(links.some(href => href === "/contact" || href === "/contact#brief"), `${product.path} needs a real requirement-discussion destination`);
    assert.ok(detailProducts.some(sibling => sibling.series === product.series && sibling.path !== product.path && links.includes(sibling.path)), `${product.path} needs a related product path`);
    const menuLink = navigationLinks.find(match => attributes(match[0].slice(0, match[0].indexOf(">") + 1)).href === product.path)?.[0];
    assert.ok(menuLink, `${product.path} is not reachable from the product directory`);
    assert.equal(decodeHtml(menuLink.replace(/<[^>]*>/g, "")).trim(), product.name, `${product.path} directory label is abbreviated`);
  }
});

test("unknown products and mismatched product-series routes return 404 instead of empty details", async () => {
  for (const path of [
    "/solutions/unknown/vehicle",
    "/solutions/xil/unknown",
    "/solutions/real-car/vehicle",
    "/solutions/xil/v2x",
    "/solutions/xil/remote",
    "/solutions/srif/in-loop",
  ]) {
    const { response } = await renderRoute(path);
    assert.equal(response.status, 404, `${path} must not render another product or an unfinished detail`);
  }
});

test("images and icons on all chapters and product details reference readable, correctly-cased public files", async () => {
  const references = new Set();
  for (const [path, { html, body }] of await renderPages()) {
    const images = [...body.matchAll(/<(?:img|source)\b[^>]*>/gi)];
    assert.ok(images.some(match => /^<img\b/i.test(match[0])), `${path} needs rendered media`);
    for (const match of images) {
      const media = attributes(match[0]);
      if (/^<img\b/i.test(match[0])) {
        assert.ok(media.src?.trim(), `An image on ${path} needs a source`);
        assert.ok(Object.hasOwn(media, "alt"), `An image on ${path} needs an explicit alt attribute`);
      }
      if (media.src) references.add(media.src);
      for (const candidate of (media.srcset ?? "").split(",").filter(Boolean)) references.add(candidate.trim().split(/\s+/)[0]);
    }
    const icons = [...html.matchAll(/<link\b[^>]*>/gi)].map(match => attributes(match[0])).filter(link => /(?:^|\s)(?:icon|apple-touch-icon|mask-icon)(?:\s|$)/i.test(link.rel ?? ""));
    assert.ok(icons.length > 0, `${path} needs a site icon`);
    for (const icon of icons) {
      assert.ok(icon.href?.trim(), `A site icon on ${path} needs a source`);
      references.add(icon.href);
    }
  }
  for (const reference of references) await assertPublicFile(reference);
});

test("chapter documents exclude the starter skeleton and obsolete product diagram", async () => {
  for (const [path, { html, body }] of await renderPages()) {
    assert.doesNotMatch(body, /Your site is taking shape|Building your site|sites-skeleton-|react-loading-skeleton/i, path);
    assert.doesNotMatch(body, /\/assets\/products\/architecture\.png/i, `${path} still exposes the obsolete product diagram`);
    const meta = [...html.matchAll(/<meta\b[^>]*>/gi)].map(match => attributes(match[0]));
    assert.ok(!meta.some(item => item.name === "codex-preview"), `Development-only preview metadata must not ship on ${path}`);
  }
});
