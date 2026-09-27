import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { leafRuleTexts, readGeneratedCritical } from "./scripts/critical-css-rules.mjs";

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
 */
const DEFERRED_STYLES_SOURCE =
  'for(const l of document.querySelectorAll("link[data-deferred-style]")){' +
  'const a=()=>{l.media="all"};l.sheet?a():l.addEventListener("load",a,{once:true})}\n';
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
        const bundledCss = typeof bundled?.source === "string" ? bundled.source : "";
        if (bundledCss) {
          // The hash is the authority: a rule *added* to the intro leaves every
          // previously inlined rule intact, so a rule-by-rule comparison cannot
          // see it, and the intro would flash the part that is missing. The
          // rule list is only here to say what changed.
          const built = createHash("sha256").update(bundledCss).digest("hex");
          if (generated.sourceHash && generated.sourceHash !== built) {
            const missing = leafRuleTexts(critical).filter((rule) => !bundledCss.includes(rule));
            throw new Error(
              `${CRITICAL_CSS_FILE} was cut from a different stylesheet than this build produced. ` +
                `Run \`npm run build:critical\` and commit the result.\n` +
                (missing.length
                  ? `${missing.length} inlined rules no longer appear at all; first: ${missing[0].slice(0, 120)}`
                  : `Every inlined rule is still present, so the stylesheet gained rules the intro may paint with.`),
            );
          }
        }

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

export default defineConfig({
  plugins: [react(), criticalCss(), absoluteSiteUrls()],
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
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          return vendorChunkFor(id);
        },
      },
    },
  },
});
