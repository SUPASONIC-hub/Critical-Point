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
 * Inline the intro's own CSS and stop the rest blocking the first paint.
 *
 * `npm run build:critical` measures which rules the intro paints with and writes
 * them to `src/styles/critical.generated.css`, which is committed. This inlines
 * that file and drops the full stylesheet to `media="print"` so it loads without
 * blocking, then swaps it back on load. The full sheet still arrives, in the
 * same order with the same contents, so nothing about the settled cascade
 * changes -- which is what makes this safe where splitting the file per screen
 * was not (see P-2 and P-3 in docs/work-status.md).
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
  return {
    name: "critical-css",
    apply: "build",
    enforce: "post",
    transformIndexHtml: {
      order: "post",
      handler(html, context) {
        if (process.env.SKIP_CRITICAL_CSS === "true") return html;

        let generated;
        try {
          generated = readGeneratedCritical(readFileSync(CRITICAL_CSS_FILE, "utf8"));
        } catch {
          throw new Error(`${CRITICAL_CSS_FILE} is missing. Run \`npm run build:critical\` to generate it.`);
        }
        const critical = generated.css;
        if (!critical) return html;

        const linkStart = html.indexOf('<link rel="stylesheet"');
        if (linkStart === -1) return html;
        const linkEnd = html.indexOf(">", linkStart) + 1;
        const link = html.slice(linkStart, linkEnd);
        const hrefStart = link.indexOf('href="') + 6;
        const href = link.slice(hrefStart, link.indexOf('"', hrefStart));

        const bundled = Object.values(context.bundle ?? {}).find(
          (asset) => asset.type === "asset" && asset.fileName === href.replace(/^\//, ""),
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

        return (
          html.slice(0, linkStart) +
          `<style id="critical-css">${critical}</style>` +
          `<link rel="stylesheet" href="${href}" media="print" onload="this.media='all';this.onload=null">` +
          `<noscript><link rel="stylesheet" href="${href}"></noscript>` +
          html.slice(linkEnd)
        );
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), criticalCss()],
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
