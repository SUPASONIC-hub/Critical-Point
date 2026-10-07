import { createHash } from "node:crypto";

/**
 * How `/sw.js` is put together, as pure functions: `serviceWorker()` in
 * vite.config.js calls them with the built page and the list of files, and
 * `check-deploy.mjs` reads the result back. No filesystem and no network here.
 *
 * The worker's code is src/serviceWorker/worker.js, which says what it does.
 * What the build adds is the three things only a build knows:
 *
 *   release   the commit the build came from (`RENDER_GIT_COMMIT`, the same
 *             one the page carries as `build-sha`) and a hash of the files
 *             the page names; for a build that has no commit, a hash of the
 *             built page. Either moves when anything the page loads does,
 *             because every entry file is named by its own hash. The commit
 *             alone did not: the same commit deployed again with another
 *             backend address, which is how a release built without one is
 *             mended, was a new worker writing into the old one's cache.
 *   precache  what the intro needs, read off the built page itself: every
 *             script, stylesheet, font, icon and image the page names. The
 *             worker does not install without all of them.
 *   warm      every other file the build emitted under assets/ -- the cases
 *             and the screens -- and, from the root, the portraits, the
 *             credit's picture and each piece of art at 960px, fetched once
 *             a table is up. One size of the art, not three: the worker
 *             gives it to a screen that asked for another (`artVariants`).
 */
export const WORKER_FILE = "sw.js";
const CONFIG_LINE = /^const WORKER_CONFIG = (\{.*\});$/m;

const shortHash = (text, length) => createHash("sha256").update(text).digest("hex").slice(0, length);

/**
 * The names, not the page's text, beside a commit: the live check works this
 * out again from the page as it was served, and a host that touched the
 * markup on the way would otherwise make every release disagree with itself.
 */
export function releaseIdFor({ sha = "", html }) {
  const commit = String(sha).trim();
  if (/^[0-9a-f]{7,40}$/.test(commit)) return `${commit}-${shortHash(precacheFromHtml(html).join("\n"), 8)}`;
  return `local-${shortHash(html, 12)}`;
}

const WARM_ROOT = /^\/(?:portrait-[a-z0-9-]+\.webp|[a-z0-9-]+-960\.webp|profile\.jpg)$/;

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

/** What the worker is told: `files` are the build's own, as paths from the root (`/assets/x.js`). */
export function workerConfigFor({ sha, html, files }) {
  const entry = entryFromHtml(html);
  if (!entry) throw new Error("The built page has no module script, so the service worker cannot tell its release's page from another's.");
  const precache = precacheFromHtml(html);
  const first = new Set(precache);
  const warm = files.filter((file) => !first.has(file) && (file.startsWith("/assets/") || WARM_ROOT.test(file))).sort();
  return { release: releaseIdFor({ sha, html }), entry, precache, warm };
}

/** `worker.js` as a classic script: its `export` keywords gone, the config in front, the call behind. */
export function buildWorkerSource(template, config) {
  // Its comments are for whoever reads the source, and are a third of the
  // file: block comments and whole-line `//` ones go. Nothing else is
  // minified -- a worker somebody has to read in a browser's inspector on a
  // bad day should be readable there.
  const body = String(template)
    .replace(/^export /gm, "")
    .replace(/^[ \t]*\/\*\*?[\s\S]*?\*\/[ \t]*\r?\n/gm, "")
    .replace(/^[ \t]*\/\/.*\r?\n/gm, "");
  if (/^\s*import\s/m.test(body)) throw new Error("src/serviceWorker/worker.js imports something; a classic worker cannot.");
  return `const WORKER_CONFIG = ${JSON.stringify(config)};\n${body}\ninstallWorker(self, WORKER_CONFIG);\n`;
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
 * `hasFile(path)` answers whether the build holds that file; leave it out for
 * the live site, where each file would be a request.
 */
export function workerProblems({ source, html, hasFile = null }) {
  const config = readWorkerConfig(source);
  if (!config) return ["sw.js carries no WORKER_CONFIG line, so it is not the worker the build writes"];
  // Switched off on purpose: there is nothing for it to agree with. Not a
  // problem, and not nothing either: `describeWorker` is how a check says so.
  if (config.release === "off") return [];
  const problems = [];
  const sha = buildShaFromHtml(html);
  const expected = releaseIdFor({ sha: sha ?? "", html });
  if (config.release !== expected) {
    problems.push(
      sha
        ? `sw.js is release ${config.release} and the page is ${expected}: the worker would keep one release's page with another's files`
        : `sw.js is release ${config.release} and the page hashes to ${expected}: it was not built from this page`,
    );
  }
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
