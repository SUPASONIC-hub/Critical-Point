import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import { parse as parseYaml } from "yaml";
import react from "@vitejs/plugin-react";
import { criticalFreshnessProblem, readGeneratedCritical } from "./scripts/critical-css-rules.mjs";
import { buildKillSource, buildWorkerSource, workerConfigFor, WORKER_FILE } from "./scripts/service-worker-build.mjs";
import { seasonData } from "./scripts/vite-season-data.mjs";
import { CACHE_PREFIX } from "./src/serviceWorker/worker.js";

const WINDOWS_SEPARATOR = /\\/g;

// Match on the package directory boundary so that a package whose name merely
// contains another package's name (lucide-react) is not misrouted.
function vendorChunkFor(id) {
  const normalized = id.replace(WINDOWS_SEPARATOR, "/");
  if (/\/node_modules\/lucide-react\//.test(normalized)) return "icons-vendor";
  if (/\/node_modules\/(react|react-dom|scheduler)\//.test(normalized)) return "react-vendor";
  return "vendor";
}

const CRITICAL_CSS_FILE = "src/styles/critical.generated.css";

/**
 * Flips every deferred stylesheet from `media="print"` to `all` once it has
 * loaded. It is a file rather than an `onload` attribute because the CSP gives
 * scripts `'self'` and nothing inline: an inline handler is exactly what that
 * policy exists to refuse. `defer` runs it after the document is parsed, which
 * on this page is one `<div>` later; a sheet that has already landed by then has
 * a `.sheet`, one that has not gets a listener.
 *
 * And a second listener, for the sheet that does not land. It used to be
 * left as it was, `media="print"` for good: the intro looked right, because
 * its rules are inlined, and the first table came up with no styles at all
 * and nothing to press. A link that fails is replaced by a copy of itself,
 * which the browser fetches again, this time as an ordinary stylesheet. Once:
 * the copy has no listener, so a server that is really down is asked twice
 * and not forever. What this cannot see is a sheet that failed before the
 * script ran -- there is no event left to hear -- and the reload a player
 * reaches for is what answers that.
 *
 * The file has a budget of 200 bytes (scripts/check-bundle-size.mjs), which
 * is why it is written the way it is. Exported for its unit test
 * (tests/unit/critical-css.test.mjs), which runs it against a page.
 */
export const DEFERRED_STYLES_SOURCE =
  'for(const l of document.querySelectorAll("link[data-deferred-style]")){' +
  'const a=()=>{l.media="all"};' +
  'l.sheet?a():(l.onload=a,l.onerror=()=>{const n=l.cloneNode();n.media="all";l.replaceWith(n)})}\n';
const DEFERRED_STYLES_FILE = `assets/deferred-styles-${createHash("sha256")
  .update(DEFERRED_STYLES_SOURCE)
  .digest("hex")
  .slice(0, 8)}.js`;

const STYLESHEET_LINK = /<link\b[^>]*\brel="stylesheet"[^>]*>/g;

/**
 * Inline the intro's own CSS and stop every stylesheet blocking the first paint.
 *
 * `npm run build:critical` measures which rules the intro paints with and writes
 * them to `src/styles/critical.generated.css`, which is committed. This inlines
 * that file and drops each emitted stylesheet to `media="print"` so it loads
 * without blocking, then `DEFERRED_STYLES_SOURCE` swaps it back on load. The
 * full sheet still arrives, in the same order with the same contents, so
 * nothing about the settled cascade changes -- which is what makes this safe
 * where splitting the file per screen was not: a per-screen split has to decide
 * which sheet each shared selector belongs to, and the cascade answers that
 * differently depending on which screen loaded first. This was measured twice
 * before it was adopted.
 *
 * Every `<link rel="stylesheet">` is deferred, not only the first: a second
 * sheet (a vendor chunk's CSS, which is how the old font stylesheet shipped)
 * stayed render-blocking while the app's own sheet was deferred, and held the
 * first paint for itself.
 *
 * Generated-and-committed, like the responsive art variants, because the deploy
 * environment has no Playwright browser to measure with. The staleness guard
 * below is the price of that: the generated file records the hash of the sheet
 * it was cut from, and the build fails when this one hashes differently. A
 * looser guard that compared the inlined rules against the sheet was tried
 * first and could not see a rule being *added*, which is the change that
 * reintroduces the flash while leaving every inlined rule intact.
 */
function criticalCss() {
  const skipped = () => process.env.SKIP_CRITICAL_CSS === "true";
  return {
    name: "critical-css",
    apply: "build",
    enforce: "post",
    buildStart() {
      if (skipped()) return;
      this.emitFile({ type: "asset", fileName: DEFERRED_STYLES_FILE, source: DEFERRED_STYLES_SOURCE });
    },
    transformIndexHtml: {
      order: "post",
      handler(html, context) {
        if (skipped()) return html;

        let generated;
        try {
          generated = readGeneratedCritical(readFileSync(CRITICAL_CSS_FILE, "utf8"));
        } catch {
          throw new Error(`${CRITICAL_CSS_FILE} is missing. Run \`npm run build:critical\` to generate it.`);
        }
        const critical = generated.css;
        if (!critical) return html;

        const links = [...html.matchAll(STYLESHEET_LINK)].map((match) => {
          const tag = match[0];
          const href = tag.match(/\bhref="([^"]+)"/)?.[1] ?? "";
          return { tag, href, start: match.index, end: match.index + tag.length };
        });
        if (!links.length) return html;

        // The app's own sheet is the entry chunk's; the critical file was cut
        // from it (see build-critical-css.mjs).
        const appSheet = links.find((link) => /\/assets\/index-[^/]*\.css$/.test(link.href)) ?? links[0];
        const bundled = Object.values(context.bundle ?? {}).find(
          (asset) => asset.type === "asset" && asset.fileName === appSheet.href.replace(/^\//, ""),
        );
        // A bundler may hold an asset as text or as bytes; either is the sheet.
        const source = bundled?.source;
        const bundledCss = typeof source === "string" ? source : source instanceof Uint8Array ? Buffer.from(source).toString("utf8") : "";
        const stale = criticalFreshnessProblem({ generated, bundledCss, file: CRITICAL_CSS_FILE });
        if (stale) throw new Error(stale);

        let out = "";
        let cursor = 0;
        for (const [index, link] of links.entries()) {
          out += html.slice(cursor, link.start);
          if (index === 0) out += `<style id="critical-css">${critical}</style>`;
          const deferred = link.tag.replace(/\s*\bmedia="[^"]*"/, "").replace(/\s*\/?>$/, ' media="print" data-deferred-style>');
          out += `${deferred}<noscript>${link.tag}</noscript>`;
          cursor = link.end;
        }
        out += `<script src="/${DEFERRED_STYLES_FILE}" defer></script>`;
        return out + html.slice(cursor);
      },
    },
  };
}

/**
 * Make the page's own URLs absolute in the social and canonical tags.
 *
 * A crawler reading `og:image` does not resolve it against the page, so a
 * root-relative path there is a card with no picture. The origin is not in the
 * repository -- the service was created by hand in the Render dashboard -- so it
 * comes from the build environment: `SITE_URL` when set (a custom domain), else
 * `RENDER_EXTERNAL_URL`, which Render sets on every build. A local build has
 * neither and keeps the relative paths.
 */
function absoluteSiteUrls() {
  return {
    name: "absolute-site-urls",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(html) {
        const origin = (process.env.SITE_URL || process.env.RENDER_EXTERNAL_URL || "").trim().replace(/\/+$/, "");
        if (!origin) return html;
        if (!/^https:\/\//.test(origin)) throw new Error(`SITE_URL must be an https origin, got ${origin}`);
        return html
          .replace(/(<meta\s+(?:property="og:(?:url|image)"|name="twitter:image")\s+content=")\//g, `$1${origin}/`)
          .replace(/(<link\s+rel="canonical"\s+href=")\//g, `$1${origin}/`);
      },
    },
  };
}

/**
 * Name the commit a build came from, so the deploy smoke job can wait for the
 * release it pressed rather than check whichever one is still live. Render sets
 * `RENDER_GIT_COMMIT` on every build; a local build has none and writes nothing,
 * which keeps `dist/index.html` byte-identical for the e2e preview probe.
 */
function buildShaMeta() {
  return {
    name: "build-sha-meta",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(html) {
        const sha = (process.env.RENDER_GIT_COMMIT || "").trim();
        if (!/^[0-9a-f]{7,40}$/.test(sha)) return html;
        return html.replace("</head>", `    <meta name="build-sha" content="${sha}" />
  </head>`);
      },
    },
  };
}

/**
 * `vite preview` sends what `render.yaml` says the site sends.
 *
 * The production build is tested through `vite preview`, which on its own sends
 * no Content-Security-Policy at all -- so a page that the live policy would
 * block (an inline script a plugin added, a fetch to an origin `connect-src`
 * does not name) passed every tier and first failed in a player's browser.
 * The headers are read from `render.yaml` rather than written down again here:
 * that file is the record the dashboard is copied from, and a second copy is a
 * second thing to forget.
 *
 * Render matches a header's `path` as a glob, and its `/index.html` rule is
 * meant for the page however it was asked for, so `/` takes it too.
 *
 * One value differs, on purpose. `connect-src` names the project's own
 * Supabase origin; the e2e build has none, and talks to the address the specs
 * stub (`E2E_BACKEND_ORIGIN`, `.env.e2e`). Any `*.supabase.co` source is
 * replaced by exactly that origin, so the tests run under a policy as narrow
 * as the narrowest one the dashboard can hold.
 */
const E2E_BACKEND_ORIGIN = "https://e2e.supabase.co";

function readRenderHeaders() {
  const spec = parseYaml(readFileSync("render.yaml", "utf8"));
  const rules = (spec?.services ?? []).flatMap((service) => service?.headers ?? []);
  return rules
    .filter((rule) => typeof rule?.path === "string" && typeof rule?.name === "string")
    .map((rule) => ({
      name: rule.name,
      value: String(rule.value ?? ""),
      matches: new RegExp(`^${rule.path.split("*").map((part) => part.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*")}$`),
    }));
}

function renderHeaders() {
  return {
    name: "render-headers",
    configurePreviewServer(server) {
      const rules = readRenderHeaders();
      if (!rules.some((rule) => rule.name.toLowerCase() === "content-security-policy")) {
        throw new Error("render.yaml declares no Content-Security-Policy, so the preview would test the build without one.");
      }
      server.middlewares.use((request, response, next) => {
        const pathname = new URL(request.url ?? "/", "http://preview.invalid").pathname;
        const asked = pathname === "/" ? "/index.html" : pathname;
        for (const rule of rules) {
          if (!rule.matches.test(asked)) continue;
          const value =
            rule.name.toLowerCase() === "content-security-policy"
              ? rule.value.replace(/https:\/\/[^\s;]*\.supabase\.co/g, E2E_BACKEND_ORIGIN)
              : rule.value;
          response.setHeader(rule.name, value);
        }
        next();
      });
    },
  };
}

/**
 * Writes `/sw.js`, the service worker (src/serviceWorker/worker.js says what
 * it does; scripts/service-worker-build.mjs how the file is put together).
 *
 * After the bundle is on disk, because what the worker keeps is read off the
 * finished page: the files `index.html` names once every other plugin here has
 * had its turn with it, and the commit `buildShaMeta` wrote into it. The name
 * has no hash -- a browser asks for a worker by one fixed address -- so
 * render.yaml serves it `no-cache`, like the page.
 *
 * `SERVICE_WORKER=off` is the kill switch: the build writes a worker that
 * removes itself and its caches, and the page stops registering one
 * (`serviceWorkerSetting` below). The README's 오프라인 section says when.
 */
const serviceWorkerKilled = () => (process.env.SERVICE_WORKER || "").trim().toLowerCase() === "off";

function serviceWorker() {
  return {
    name: "service-worker",
    apply: "build",
    writeBundle(options, bundle) {
      const outDir = options.dir ?? "dist";
      const target = path.join(outDir, WORKER_FILE);
      if (serviceWorkerKilled()) {
        writeFileSync(target, buildKillSource(CACHE_PREFIX));
        return;
      }
      const html = readFileSync(path.join(outDir, "index.html"), "utf8");
      // The bundle's own files, and what `public/` put at the root.
      const files = [...Object.keys(bundle), ...readdirSync(outDir)].map((file) => `/${file.replace(WINDOWS_SEPARATOR, "/")}`);
      const config = workerConfigFor({ sha: process.env.RENDER_GIT_COMMIT, html, files: [...new Set(files)] });
      writeFileSync(target, buildWorkerSource(readFileSync("src/serviceWorker/worker.js", "utf8"), config));
    },
  };
}

/** What the page is told about registering (src/serviceWorker/register.js). */
function serviceWorkerSetting(command, mode) {
  if (command !== "build" || serviceWorkerKilled()) return "off";
  return mode === "e2e" ? "ask" : "on";
}

export default defineConfig(({ command, mode }) => ({
  plugins: [seasonData(), react(), criticalCss(), absoluteSiteUrls(), buildShaMeta(), serviceWorker(), renderHeaders()],
  // The debug console -- the case jump, unlock-all, the forced render error --
  // is dead code in a release, and this constant is how the bundler is told.
  // `debugToolsEnabled` used to read `(import.meta.env ?? {}).DEV`, which
  // nothing can fold: the expression and every panel behind it shipped to
  // players, switched off by a runtime check. A build that asks for the tools
  // (`VITE_ENABLE_DEBUG_TOOLS=true`) still gets them.
  define: {
    __CP_DEBUG_BUILD__: JSON.stringify(
      command === "serve" || loadEnv(mode, process.cwd(), "VITE_").VITE_ENABLE_DEBUG_TOOLS === "true",
    ),
    __CP_SERVICE_WORKER__: JSON.stringify(serviceWorkerSetting(command, mode)),
  },
  // The dev server compiles a module the first time it is asked for. Fifty
  // cases are fifty large data modules, and compiling them on the first scene
  // made that scene take 4.7s to open against 0.7s warm -- a cost the bundle
  // never has, landing inside the e2e render budgets. They are compiled when
  // the server starts instead.
  server: {
    warmup: {
      clientFiles: ["./src/GameRuntime.jsx", "./src/gameData.js", "./src/nodes/*.js"],
    },
  },
  build: {
    // A lazy import is written with the list of files to preload beside it.
    // The result card's chunk leans only on files the ending screen has
    // already run, so its list is left out: writing it cost the report's chunk
    // about 120 gzip bytes it did not have (scripts/check-bundle-size.mjs).
    modulePreload: {
      resolveDependencies: (filename, deps) => (/\/ResultCardShare-/.test(filename) ? [] : deps),
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          return vendorChunkFor(id);
        },
      },
    },
  },
}));
