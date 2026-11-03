/**
 * The first files a page in another language needs, asked for from the head
 * of index.html instead of after the entry chunk has run.
 *
 * An English or Japanese page paints only once its dictionary is in
 * (src/main.jsx, src/locale.js): the overlay (src/locales/overlay.js), then
 * the language's index, then its copy between cases. Each of those used to be
 * found by the module before it, so on a phone's slow connection the page
 * waited for the entry chunk, then three round trips more, before its first
 * paint (perf-first-visit, 2026-11-03). This file is a tiny script beside the
 * bundle that reads the language the way src/locale.js does -- the one kept
 * on this device, else `?lang=`, else Korean -- and adds a
 * `<link rel="modulepreload">` for each of those files, so they download
 * alongside the entry chunk. A Korean page adds nothing.
 *
 * A file and not an inline script: the CSP's `script-src` has no
 * 'unsafe-inline' and no hash (render.yaml), like analytics-config.mjs's tag.
 * Its name carries a hash of its contents, like every other file in /assets.
 */
import { createHash } from "node:crypto";

const LOCALE_INDEX = /(?:^|[\\/])src[\\/]locales[\\/]([a-z]{2,3})[\\/]index\.js$/;
const LOCALE_BETWEEN = /(?:^|[\\/])src[\\/]locales[\\/]([a-z]{2,3})[\\/]between[\\/][^\\/]+\.js$/;
const OVERLAY = /(?:^|[\\/])src[\\/]locales[\\/]overlay\.js$/;

/** Every chunk `fileName` reaches by static imports, itself included. */
function reach(chunks, fileName, seen = new Set()) {
  if (seen.has(fileName)) return seen;
  seen.add(fileName);
  for (const next of chunks.get(fileName)?.imports ?? []) reach(chunks, next, seen);
  return seen;
}

/**
 * The files each language needs before its first paint, minus what the
 * entry already loads. `bundle` is Rollup's output bundle (or any list of
 * `{ type, fileName, facadeModuleId, moduleIds, imports, isEntry }`).
 */
export function localePreloadMap(bundle) {
  const chunks = new Map(Object.values(bundle).filter((item) => item.type === "chunk").map((chunk) => [chunk.fileName, chunk]));
  const ids = (chunk) => [chunk.facadeModuleId, ...(chunk.moduleIds ?? [])].filter(Boolean);
  const entry = [...chunks.values()].find((chunk) => chunk.isEntry);
  if (!entry) throw new Error("The bundle has no entry chunk.");
  const loaded = reach(chunks, entry.fileName);
  const overlay = [...chunks.values()].find((chunk) => ids(chunk).some((id) => OVERLAY.test(id)));
  if (!overlay) throw new Error("No chunk holds src/locales/overlay.js.");
  const map = {};
  for (const chunk of chunks.values()) {
    const lang = ids(chunk).map((id) => LOCALE_INDEX.exec(id)?.[1]).find(Boolean);
    if (lang) (map[lang] ??= new Set()).add(chunk.fileName);
  }
  if (!Object.keys(map).length) throw new Error("No chunk holds a src/locales/<lang>/index.js.");
  for (const chunk of chunks.values()) {
    const lang = ids(chunk).map((id) => LOCALE_BETWEEN.exec(id)?.[1]).find(Boolean);
    if (lang && map[lang]) map[lang].add(chunk.fileName);
  }
  const result = {};
  for (const [lang, files] of Object.entries(map).sort(([a], [b]) => a.localeCompare(b))) {
    const all = new Set();
    for (const file of [overlay.fileName, ...files]) for (const reached of reach(chunks, file)) all.add(reached);
    result[lang] = [...all].filter((file) => !loaded.has(file)).sort();
  }
  return result;
}

/** The script: plain ES5, no module, so it runs as soon as it arrives. */
export function localePreloadSource({ map, base = "/", localeKey, sourceLocale = "ko" }) {
  if (!localeKey) throw new Error("localePreloadSource needs the storage key src/locale.js reads.");
  const hrefs = Object.fromEntries(Object.entries(map).map(([lang, files]) => [lang, files.map((file) => `${base}${file}`)]));
  const codes = [sourceLocale, ...Object.keys(hrefs)];
  return (
    "(function(){" +
    `var m=${JSON.stringify(hrefs)},c=${JSON.stringify(codes)},l=null,s=null;` +
    `try{s=localStorage.getItem(${JSON.stringify(localeKey)})}catch(e){}` +
    "if(c.indexOf(s)>=0)l=s;else{try{l=new URLSearchParams(location.search).get(\"lang\")}catch(e){}}" +
    "var f=m[l];if(!f)return;" +
    "for(var i=0;i<f.length;i++){var k=document.createElement(\"link\");k.rel=\"modulepreload\";k.crossOrigin=\"\";k.href=f[i];document.head.appendChild(k)}" +
    "})();\n"
  );
}

export function localePreloadFileName(source) {
  return `assets/locale-preload-${createHash("sha256").update(source).digest("hex").slice(0, 8)}.js`;
}

/** The tag, right after `<meta charset>` so the preload scanner meets it first. */
export function withLocalePreloadTag(html, href) {
  const tag = `<script src="${href}" async></script>`;
  const charset = html.match(/<meta charset="[^"]*"\s*\/?>/i);
  if (!charset) throw new Error("index.html has no <meta charset>; nowhere to put the locale preload.");
  const at = charset.index + charset[0].length;
  return `${html.slice(0, at)}\n    ${tag}${html.slice(at)}`;
}

/** LOCALE_KEY as src/appConfig.js writes it. */
export function readLocaleKey(appConfigSource) {
  const key = appConfigSource.match(/export const LOCALE_KEY = "([^"]+)";/)?.[1];
  if (!key) throw new Error("src/appConfig.js has no `export const LOCALE_KEY = \"...\";` line.");
  return key;
}
