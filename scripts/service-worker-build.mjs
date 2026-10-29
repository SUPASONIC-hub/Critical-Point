import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { DOCUMENT_PAGE } from "../src/serviceWorker/worker.js";

/**
 * How `/sw.js` is put together: `serviceWorker()` in vite.config.js calls
 * these with the built page and the files beside it, and `check-deploy.mjs`
 * reads the result back. Pure functions and no network; `shippedFiles` is the
 * one that reads a disk, and it reads the build's own directory.
 *
 * The worker's code is src/serviceWorker/worker.js, which says what it does.
 * What the build adds is the three things only a build knows:
 *
 *   release   what is shipped, and nothing else: `<8 hex>-<12 hex>`. The
 *             first is a hash of the file names the page names, which the
 *             live check can work out again from the page as it was served.
 *             The second is a hash of every file of the build -- its path and
 *             its bytes, the page without the commit it carries, and the
 *             worker's own code. Two builds that ship the same files are the
 *             same release whatever commit they came from, so a merge that
 *             changes no shipped file leaves `sw.js` the same to the byte and
 *             no device throws its cache away. Any file that does change --
 *             a portrait at the root, the manifest, the page's own text --
 *             is another release: those names carry no hash of their own.
 *             The commit used to be part of the name, and every merge, a
 *             line of documentation included, made every device download
 *             everything again. The commit is still on the page, as
 *             `build-sha`, for the deploy workflow to read.
 *   precache  what the intro needs, read off the built page itself: every
 *             script, stylesheet, font, icon and image the page names. The
 *             worker does not install without all of them.
 *   warm      every other file the build emitted under assets/ -- the cases
 *             and the screens -- and, from the root, the first five portraits, the
 *             credit's picture and each piece of art at 960px, fetched once
 *             a table is up. One size of the art, not three: the worker
 *             gives it to a screen that asked for another (`artVariants`).
 *             And the privacy policy and the terms (`DOCUMENT_PAGE`), so
 *             a device offline can still read what it agreed to.
 */
export const WORKER_FILE = "sw.js";
const PAGE_PATH = "/index.html";
const WORKER_PATH = `/${WORKER_FILE}`;
const CONFIG_LINE = /^const WORKER_CONFIG = (\{.*\});$/m;
// The line `buildShaMeta` (vite.config.js) writes, with the indent in front
// of it and the line end behind: taken out, a page built from a commit is the
// page built from none.
const BUILD_SHA_LINE = /[ \t]*<meta\s+name="build-sha"\s+content="[^"]*"\s*\/?>[ \t]*\r?\n?/gi;

const digest = (content) => createHash("sha256").update(content).digest("hex");
const byName = ([a], [b]) => (a < b ? -1 : a > b ? 1 : 0);

/** The built page without the commit it says it came from: the part of it that is shipped to be drawn. */
export function pageWithoutCommit(html) {
  return String(html ?? "").replace(BUILD_SHA_LINE, "");
}

/**
 * Every file under `dir` but the page and the worker, as `[path, sha256]`
 * with the path from the root (`/assets/x.js`), sorted. The bytes and not the
 * names alone: a file under assets/ is named by its hash, but nothing from
 * `public/` is, and one rule for all of them has no list to keep.
 */
export function shippedFiles(dir) {
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(entry.parentPath ?? entry.path, entry.name))
    .map((file) => [`/${path.relative(dir, file).replace(/\\/g, "/")}`, file])
    .filter(([name]) => name !== PAGE_PATH && name !== WORKER_PATH)
    .map(([name, file]) => [name, digest(readFileSync(file))])
    .sort(byName);
}

/**
 * The half of a release's name the live check can work out again. The names,
 * not the page's text: a host that touched the markup on the way would
 * otherwise make every release disagree with itself.
 */
export function pageKeyFor(html) {
  return digest(precacheFromHtml(html).join("\n")).slice(0, 8);
}

/**
 * A release's name. `files` is `shippedFiles()` of the build and `logic` the
 * worker's code (`workerBody`, or `workerLogic` of a built one); the page goes
 * in without its commit. No commit anywhere: the same files are the same name.
 */
export function releaseIdFor({ html, files = [], logic = "" }) {
  const shipped = new Map(files);
  shipped.set(PAGE_PATH, digest(pageWithoutCommit(html)));
  shipped.set(WORKER_PATH, digest(logic));
  const lines = [...shipped].sort(byName).map(([name, hash]) => `${name}\t${hash}`);
  return `${pageKeyFor(html)}-${digest(lines.join("\n")).slice(0, 12)}`;
}

// The portraits the warm-up fetches are the five that shipped first, by name.
// A portrait added after them is fetched when its case opens -- every speaker
// of the case at once (warmCasePortraits, src/speakerPortraits.js, since
// 2026-10-22) -- and kept from then on (the root-image rule in worker.js);
// offline before its case was ever opened, SpeakerPortrait draws the
// silhouette in its place. Every name in the warm
// list is bytes in `sw.js`, whose budget had room for one more.
const WARM_ROOT = /^\/(?:portrait-(?:ban-jaeuk|do-yunha|echo|han-seoyun|oh-jinwoo)\.webp|[a-z0-9-]+-960\.webp|profile\.jpg)$/;

// The other languages' chunks (vite.config.js names them `locale-*`): only a
// `?lang=<code>` page asks for them, so a Korean device is not made to fetch
// them in the warm-up. A page in that language fetches them as it goes.
const OTHER_LANGUAGES = /^\/assets\/locale-/;

const sameOriginPath = (value) => (/^\/[^/]/.test(value) ? value.split(/[?#]/)[0] : null);

/**
 * Every file the built page names on its own origin, in the order it names
 * them. `<link>` and `<script>` only: the `og:image` in a `<meta>` is for a
 * crawler, and the page never loads it. `rel="canonical"` is the page itself.
 */
export function precacheFromHtml(html) {
  const paths = new Set();
  for (const match of String(html ?? "").matchAll(/<(link|script)\b([^>]*)>/gi)) {
    const attributes = match[2];
    if (/\brel\s*=\s*["']canonical["']/i.test(attributes)) continue;
    const single = /\b(?:href|src)\s*=\s*["']([^"']+)["']/i.exec(attributes)?.[1];
    const set = /\bimagesrcset\s*=\s*["']([^"']+)["']/i.exec(attributes)?.[1];
    const named = [single, ...(set ?? "").split(",").map((entry) => entry.trim().split(/\s+/)[0])];
    for (const value of named) {
      const path = value ? sameOriginPath(value) : null;
      if (path) paths.add(path);
    }
  }
  return [...paths];
}

/** The page's module script: the one file a page of this release cannot be without. */
export function entryFromHtml(html) {
  for (const match of String(html ?? "").matchAll(/<script\b([^>]*)>/gi)) {
    if (!/\btype\s*=\s*["']?module/i.test(match[1])) continue;
    const src = /\bsrc\s*=\s*["']([^"']+)["']/i.exec(match[1])?.[1];
    if (src) return sameOriginPath(src);
  }
  return null;
}

/**
 * What the worker is told. `files` is `shippedFiles()` of the build, each
 * file's path from the root and a hash of its bytes; `logic` is `workerBody`
 * of the worker's source.
 */
export function workerConfigFor({ html, files, logic = "" }) {
  const entry = entryFromHtml(html);
  if (!entry) throw new Error("The built page has no module script, so the service worker cannot tell its release's page from another's.");
  const precache = precacheFromHtml(html);
  const first = new Set(precache);
  const warm = files
    .map(([file]) => file)
    .filter((file) => !first.has(file) && !OTHER_LANGUAGES.test(file) && (file.startsWith("/assets/") || WARM_ROOT.test(file) || DOCUMENT_PAGE.test(file)))
    .sort();
  return { release: releaseIdFor({ html, files, logic }), entry, precache, warm };
}

/**
 * `worker.js` as a classic script, without the line that says which release
 * it is: its `export` keywords gone and the call behind. This is the worker's
 * code as it is shipped, and part of what a release is named for.
 */
export function workerBody(template) {
  // Its comments are for whoever reads the source, and are a third of the
  // file: block comments and whole-line `//` ones go. Nothing else is
  // minified -- a worker somebody has to read in a browser's inspector on a
  // bad day should be readable there.
  const body = String(template)
    .replace(/^export /gm, "")
    .replace(/^[ \t]*\/\*\*?[\s\S]*?\*\/[ \t]*\r?\n/gm, "")
    .replace(/^[ \t]*\/\/.*\r?\n/gm, "");
  if (/^\s*import\s/m.test(body)) throw new Error("src/serviceWorker/worker.js imports something; a classic worker cannot.");
  return `${body}\ninstallWorker(self, WORKER_CONFIG);\n`;
}

/** The built worker: the config in front of `workerBody`. */
export function buildWorkerSource(template, config) {
  return `const WORKER_CONFIG = ${JSON.stringify(config)};\n${workerBody(template)}`;
}

/** A built worker's code without its config line: `workerBody` of the source it was built from. */
export function workerLogic(source) {
  return String(source ?? "").replace(/^const WORKER_CONFIG = \{.*\};\r?\n/m, "");
}

/**
 * The kill switch (`SERVICE_WORKER=off npm run build`): a worker that answers
 * nothing, deletes every release's cache and takes itself off the device. A
 * browser that has the old worker asks for `/sw.js` again on its next visit,
 * gets this, and is back to the plain network from the visit after.
 */
export function buildKillSource(prefix) {
  return [
    `const WORKER_CONFIG = ${JSON.stringify({ release: "off", entry: null, precache: [], warm: [] })};`,
    'self.addEventListener("install", () => self.skipWaiting());',
    'self.addEventListener("activate", (event) => {',
    "  event.waitUntil(",
    "    (async () => {",
    `      for (const name of await caches.keys()) if (name.startsWith(${JSON.stringify(prefix)})) await caches.delete(name);`,
    "      await self.registration.unregister();",
    "    })(),",
    "  );",
    "});",
    "",
  ].join("\n");
}

/** The config a built `sw.js` carries, or null when the text is not one. */
export function readWorkerConfig(source) {
  const match = CONFIG_LINE.exec(String(source ?? ""));
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

/**
 * Which worker a `sw.js` is, for a check to say out loud: `{ killed, text }`,
 * or null when the text is not one the build writes.
 *
 * `workerProblems` below has nothing to hold the kill switch to, so it passes
 * it -- rightly, and until this was added, silently: a `SERVICE_WORKER=off`
 * left behind in the host's environment made every later deploy green with
 * offline play switched off, and a deploy meant to switch it off could not be
 * told from one that had not.
 */
export function describeWorker(source) {
  const config = readWorkerConfig(source);
  if (!config) return null;
  if (config.release === "off") {
    return {
      killed: true,
      text:
        "sw.js is the kill switch (a build with SERVICE_WORKER=off): the page registers no worker, a device that has one loses it " +
        "and its kept files on the next visit, and nothing opens offline. If that is not what this release is for, " +
        "take SERVICE_WORKER out of the host's environment and deploy again",
    };
  }
  const count = (list) => (Array.isArray(list) ? list.length : 0);
  return {
    killed: false,
    text: `sw.js is release ${config.release}: ${count(config.precache)} files kept at install, ${count(config.warm)} more once a table is up`,
  };
}

/** The commit a built page says it came from (`build-sha`, vite.config.js), or null. */
export function buildShaFromHtml(html) {
  return /<meta\s+name="build-sha"\s+content="([0-9a-f]{7,40})"/i.exec(String(html ?? ""))?.[1] ?? null;
}

/**
 * Every way a built or served worker disagrees with the page beside it.
 * `hasFile(path)` answers whether the build holds that file and `files` is
 * `shippedFiles()` of it; leave both out for the live site, where each file
 * would be a request. There the name is held to the half of it the page
 * alone decides (`pageKeyFor`); with the build in hand, to all of it.
 */
export function workerProblems({ source, html, hasFile = null, files = null }) {
  const config = readWorkerConfig(source);
  if (!config) return ["sw.js carries no WORKER_CONFIG line, so it is not the worker the build writes"];
  // Switched off on purpose: there is nothing for it to agree with. Not a
  // problem, and not nothing either: `describeWorker` is how a check says so.
  if (config.release === "off") return [];
  const problems = [];
  const release = String(config.release);
  if (files) {
    const expected = releaseIdFor({ html, files, logic: workerLogic(source) });
    if (release !== expected) problems.push(`sw.js is release ${release} and the build beside it is ${expected}: it was not built from these files`);
  } else if (!release.startsWith(`${pageKeyFor(html)}-`)) {
    problems.push(`sw.js is release ${release} and the page's files are ${pageKeyFor(html)}: the worker would keep one release's page with another's files`);
  }
  // The page says its commit and the worker does not: a worker that did
  // would differ from the last one after every merge, and each device would
  // download the whole release again for a line of documentation.
  const sha = buildShaFromHtml(html);
  if (sha && String(source).includes(sha)) problems.push(`sw.js names the commit ${sha}: a release is named for the files it ships, so that the same files are the same worker`);
  const entry = entryFromHtml(html);
  if (config.entry !== entry) problems.push(`sw.js expects the entry script ${config.entry} and the page loads ${entry}`);
  if (!Array.isArray(config.precache) || config.precache.length === 0) problems.push("sw.js precaches nothing, so an offline launch has no page to draw");
  if (hasFile) {
    for (const file of [...(config.precache ?? []), ...(config.warm ?? [])]) {
      if (!hasFile(file)) problems.push(`sw.js lists ${file}, which the build does not hold; the worker would never finish installing`);
    }
  }
  return problems;
}
