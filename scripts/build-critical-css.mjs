import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";
import { STYLESHEET_HASH_PREFIX, parseRules } from "./critical-css-rules.mjs";

/**
 * Regenerate the intro's critical CSS.
 *
 * `index.css` is 157KB (27.7KB gzipped) and every byte of it blocks the first
 * paint, though the intro is the only screen a first-time visitor sees. Two
 * earlier passes (P-2, P-3) measured splitting the file per screen and said no,
 * for a reason that still holds: the five source files are a cascade, the media
 * blocks group selectors across screens on purpose, and moving a rule between
 * files changes what wins.
 *
 * Inlining sidesteps all of that because it adds rather than moves. The full
 * sheet still loads, in the same order with the same contents, so the settled
 * computed styles are unchanged by construction. What changes is only what the
 * browser can paint before the sheet arrives -- which means a miss here is a
 * flash of unstyled intro, never a wrong intro, and the verification pass below
 * is what measures the flash.
 *
 * The browser is the measuring instrument, as it is for the art variants, and
 * the output is committed for the same reason: the deploy environment has no
 * Playwright browser. `vite.config.js` inlines the file and fails the build when
 * it has gone stale.
 *
 * Runs three builds: one without inlining to measure against, one with the fresh
 * file to verify, and it leaves the second in place.
 */

const DIST = "dist";
const OUTPUT = "src/styles/critical.generated.css";
const VIEWPORTS = [
  { name: "desktop", width: 1366, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

// A missed rule shows as a flash, so the intro's own frame is measured against
// the full sheet and has to match it exactly.
const PROBE_SELECTORS = [
  "body",
  ".intro",
  ".intro h1",
  ".intro p",
  ".brand-row",
  ".start-input-row",
  ".start-input-row button",
  ".start-input-row input",
  ".topbar",
  ".top-actions",
  ".eyebrow",
];
const PROBE_PROPERTIES = [
  "color",
  "background-color",
  "font-size",
  "font-weight",
  "line-height",
  "display",
  "padding",
  "margin",
  "border-radius",
  "width",
  "max-width",
  "flex-direction",
  "gap",
  "text-align",
];

function run(args, env = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { stdio: "ignore", env: { ...process.env, ...env } });
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`${args.join(" ")} exited ${code}`))));
    child.on("error", reject);
  });
}

async function findFreePort() {
  return new Promise((resolve, reject) => {
    const probe = createServer();
    probe.unref();
    probe.on("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const { port } = probe.address();
      probe.close(() => resolve(port));
    });
  });
}

function intersects(span, ranges) {
  return ranges.some((range) => range.start < span.end && span.start < range.end);
}

/**
 * Coverage reports the rules that matched an element, which leaves out the ones
 * that only define values other rules read. Custom properties and the page frame
 * have to be there before anything can paint correctly.
 */
function alwaysKeep(prelude) {
  const selector = prelude.trim();
  if (selector.startsWith("@font-face") || selector.startsWith("@charset") || selector.startsWith("@import")) return true;
  return selector.split(",").some((part) => {
    const single = part.trim();
    return single === ":root" || single === "html" || single === "body" || single === "*" || single.startsWith("*,");
  });
}

function buildCritical(css, ranges) {
  const parts = [];
  const walk = (items, emit) => {
    for (const item of items) {
      if (item.kind === "statement") {
        if (alwaysKeep(item.prelude)) emit(`${item.prelude};`);
        continue;
      }
      if (item.kind === "group") {
        const inner = [];
        walk(item.children, (text) => inner.push(text));
        if (inner.length) emit(`${item.prelude}{${inner.join("")}}`);
        continue;
      }
      if (alwaysKeep(item.prelude) || intersects(item, ranges)) emit(css.slice(item.start, item.end));
    }
  };
  walk(parseRules(css), (text) => parts.push(text));
  return parts.join("");
}

async function readComputed(page) {
  return page.evaluate(
    ([selectors, properties]) => {
      const out = {};
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (!element) continue;
        const computed = getComputedStyle(element);
        out[selector] = Object.fromEntries(properties.map((property) => [property, computed.getPropertyValue(property)]));
      }
      return out;
    },
    [PROBE_SELECTORS, PROBE_PROPERTIES],
  );
}

async function withPreview(work) {
  const port = await findFreePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const server = spawn(
    process.execPath,
    ["node_modules/vite/bin/vite.js", "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
    { stdio: "ignore" },
  );
  try {
    for (let attempt = 0; attempt < 100; attempt += 1) {
      try {
        if ((await fetch(baseUrl)).ok) break;
      } catch {
        // preview is still starting
      }
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    return await work(baseUrl);
  } finally {
    server.kill();
  }
}

function builtStylesheet() {
  const file = readdirSync(`${DIST}/assets`).find((name) => name.endsWith(".css"));
  if (!file) throw new Error("dist/assets holds no stylesheet.");
  return { file, css: readFileSync(`${DIST}/assets/${file}`, "utf8") };
}

let exitCode = 0;
let browser;
try {
  browser = await chromium.launch();

  // 1. A build with the plugin switched off, so the sheet is a normal blocking
  //    stylesheet that coverage can report on.
  await run(["node_modules/vite/bin/vite.js", "build"], { SKIP_CRITICAL_CSS: "true" });
  const measured = builtStylesheet();

  const { usedRanges, fullStyles } = await withPreview(async (baseUrl) => {
    const ranges = [];
    const styles = {};
    for (const viewport of VIEWPORTS) {
      const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
      await page.coverage.startCSSCoverage();
      await page.goto(baseUrl);
      await page.locator(".intro").waitFor();
      styles[viewport.name] = await readComputed(page);
      for (const entry of await page.coverage.stopCSSCoverage()) {
        if (entry.url.endsWith(measured.file)) ranges.push(...entry.ranges);
      }
      await page.close();
    }
    return { usedRanges: ranges, fullStyles: styles };
  });

  const critical = buildCritical(measured.css, usedRanges);
  // The hash of the sheet this was cut from. A rule added to the intro leaves
  // every existing rule intact, so comparing rules alone cannot see it; the hash
  // makes any stylesheet change at all ask for a regeneration.
  const sourceHash = createHash("sha256").update(measured.css).digest("hex");
  writeFileSync(OUTPUT, `${STYLESHEET_HASH_PREFIX}${sourceHash} */\n${critical}\n`, "utf8");

  // 2. A normal build, which inlines what was just written.
  await run(["node_modules/vite/bin/vite.js", "build"]);
  const shipped = builtStylesheet();

  // 3. With the deferred sheet never arriving, the intro has to compute the same.
  const failures = await withPreview(async (baseUrl) => {
    const found = [];
    for (const viewport of VIEWPORTS) {
      const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
      await page.route(`**/${shipped.file}`, (route) => route.abort());
      await page.goto(baseUrl);
      await page.locator(".intro").waitFor();
      const criticalOnly = await readComputed(page);
      for (const [selector, properties] of Object.entries(fullStyles[viewport.name])) {
        for (const [property, value] of Object.entries(properties)) {
          const actual = criticalOnly[selector]?.[property];
          if (actual !== value) {
            found.push(`${viewport.name} ${selector}: ${property} is ${actual}, the full sheet computes ${value}`);
          }
        }
      }
      await page.close();
    }
    return found;
  });

  if (failures.length) {
    console.error(`Critical CSS is incomplete; the intro would flash before the sheet lands:\n${failures.join("\n")}`);
    exitCode = 1;
  } else {
    console.log(
      `Wrote ${OUTPUT}: ${(critical.length / 1024).toFixed(1)}KB of ${(measured.css.length / 1024).toFixed(1)}KB. ` +
        `${PROBE_SELECTORS.length} intro elements compute identically without the deferred sheet, at ${VIEWPORTS.length} viewports.`,
    );
  }
} finally {
  await browser?.close();
}

process.exit(exitCode);
