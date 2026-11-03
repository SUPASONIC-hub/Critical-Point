import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import { localePreloadFileName, localePreloadMap, localePreloadSource, readLocaleKey, withLocalePreloadTag } from "../../scripts/locale-preload.mjs";

/**
 * scripts/locale-preload.mjs: what a page in another language asks for from
 * the head of index.html. The language it picks has to be the one
 * src/locale.js picks, or a page would download a dictionary it never uses.
 */
const chunk = (fileName, moduleIds, imports = [], isEntry = false) => ({ type: "chunk", fileName, facadeModuleId: moduleIds[0] ?? null, moduleIds, imports, isEntry });
const BUNDLE = {
  "assets/index-a.js": chunk("assets/index-a.js", ["/r/src/main.jsx"], ["assets/react-vendor-b.js", "assets/shared-c.js"], true),
  "assets/react-vendor-b.js": chunk("assets/react-vendor-b.js", ["/r/node_modules/react/index.js"]),
  "assets/shared-c.js": chunk("assets/shared-c.js", ["/r/src/appCopy.js"]),
  "assets/locale-overlay-d.js": chunk("assets/locale-overlay-d.js", ["/r/src/locales/overlay.js"], ["assets/shared-c.js"]),
  "assets/locale-en-index-e.js": chunk("assets/locale-en-index-e.js", ["/r/src/locales/en/index.js"], ["assets/en-extra-f.js"]),
  "assets/en-extra-f.js": chunk("assets/en-extra-f.js", ["/r/src/locales/en/extra.js"]),
  "assets/locale-en-between-case11-20-g.js": chunk("assets/locale-en-between-case11-20-g.js", ["/r/src/locales/en/between/case11-20.js"]),
  "assets/locale-ja-index-h.js": chunk("assets/locale-ja-index-h.js", ["C:\\r\\src\\locales\\ja\\index.js"]),
  "assets/locale-en-case01-i.js": chunk("assets/locale-en-case01-i.js", ["/r/src/locales/en/nodes/case01.js"]),
  "index.html": { type: "asset", fileName: "index.html", source: "" },
};

test("each language gets its overlay, index, between-cases copy and their imports, minus what the entry loads", () => {
  assert.deepEqual(localePreloadMap(BUNDLE), {
    en: ["assets/en-extra-f.js", "assets/locale-en-between-case11-20-g.js", "assets/locale-en-index-e.js", "assets/locale-overlay-d.js"],
    ja: ["assets/locale-ja-index-h.js", "assets/locale-overlay-d.js"],
  });
});

test("a bundle without the overlay or any dictionary fails the build instead of shipping nothing", () => {
  const { "assets/locale-overlay-d.js": _overlay, ...noOverlay } = BUNDLE;
  assert.throws(() => localePreloadMap(noOverlay), /overlay/);
  assert.throws(() => localePreloadMap({ "assets/index-a.js": BUNDLE["assets/index-a.js"], "assets/locale-overlay-d.js": BUNDLE["assets/locale-overlay-d.js"] }), /index\.js/);
});

function run(source, { stored = null, search = "", storageThrows = false } = {}) {
  const links = [];
  const context = {
    localStorage: {
      getItem: (key) => {
        if (storageThrows) throw new Error("denied");
        return key === "critical-point-locale-v1" ? stored : null;
      },
    },
    location: { search },
    URLSearchParams,
    document: { createElement: () => ({}), head: { appendChild: (link) => links.push(link) } },
  };
  vm.runInNewContext(source, context);
  return links;
}

test("the script picks the language as src/locale.js does: stored, else ?lang=, else Korean", () => {
  const source = localePreloadSource({ map: localePreloadMap(BUNDLE), localeKey: "critical-point-locale-v1" });
  assert.deepEqual(run(source).length, 0, "a Korean page asks for nothing");
  const en = run(source, { search: "?lang=en" });
  assert.deepEqual(en.map((link) => link.href), ["/assets/en-extra-f.js", "/assets/locale-en-between-case11-20-g.js", "/assets/locale-en-index-e.js", "/assets/locale-overlay-d.js"]);
  assert.ok(en.every((link) => link.rel === "modulepreload" && link.crossOrigin === ""));
  assert.equal(run(source, { stored: "ja", search: "?lang=en" })[0].href, "/assets/locale-ja-index-h.js", "the kept choice wins over the address");
  assert.equal(run(source, { stored: "ko", search: "?lang=en" }).length, 0, "a kept Korean wins too");
  assert.equal(run(source, { stored: "xx", search: "?lang=en" }).length, 4, "a kept value that is no language falls to the address");
  assert.equal(run(source, { storageThrows: true, search: "?lang=ja" }).length, 2, "no storage: the address");
  assert.equal(run(source, { search: "?lang=fr" }).length, 0);
});

test("the key is the one src/appConfig.js exports, and the file is named for its contents", () => {
  assert.equal(readLocaleKey(readFileSync("src/appConfig.js", "utf8")), "critical-point-locale-v1");
  assert.throws(() => readLocaleKey("export const OTHER = 1;"));
  const a = localePreloadSource({ map: { en: ["assets/x.js"] }, localeKey: "k" });
  const b = localePreloadSource({ map: { en: ["assets/y.js"] }, localeKey: "k" });
  assert.match(localePreloadFileName(a), /^assets\/locale-preload-[0-9a-f]{8}\.js$/);
  assert.notEqual(localePreloadFileName(a), localePreloadFileName(b));
});

test("the tag goes right after <meta charset>, async, from the page's own origin", () => {
  const html = '<!doctype html>\n<html>\n  <head>\n    <meta charset="UTF-8" />\n    <title>x</title>\n  </head>\n</html>';
  const out = withLocalePreloadTag(html, "/assets/locale-preload-1.js");
  assert.match(out, /<meta charset="UTF-8" \/>\n {4}<script src="\/assets\/locale-preload-1\.js" async><\/script>\n {4}<title>/);
  assert.throws(() => withLocalePreloadTag("<html><head></head></html>", "/x.js"));
});
