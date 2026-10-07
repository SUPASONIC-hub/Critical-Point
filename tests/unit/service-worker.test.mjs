import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import {
  buildKillSource,
  buildShaFromHtml,
  buildWorkerSource,
  describeWorker,
  entryFromHtml,
  precacheFromHtml,
  readWorkerConfig,
  releaseIdFor,
  workerConfigFor,
  workerProblems,
} from "../../scripts/service-worker-build.mjs";
import { installServiceWorker, mayWarm, OFFLINE_READY_ATTRIBUTE, serviceWorkerWanted } from "../../src/serviceWorker/register.js";
import {
  artVariants,
  CACHE_PREFIX,
  cacheNameFor,
  installWorker,
  isStorable,
  NAVIGATION_TIMEOUT_MS,
  SHELL_URL,
  staleCaches,
  strategyFor,
} from "../../src/serviceWorker/worker.js";
import { chunkPanelFor } from "../../src/state/chunkReload.js";
import { noteCasesArrived } from "../../src/state/loadProgress.js";

/**
 * The service worker: which request gets which answer
 * (src/serviceWorker/worker.js), how `/sw.js` is put together from a built
 * page (scripts/service-worker-build.mjs), and when the page registers it and
 * asks for the rest of the release (src/serviceWorker/register.js).
 */
const ORIGIN = "https://game.example";
const get = (path, mode = "cors") => ({ method: "GET", url: `${ORIGIN}${path}`, mode });

test("each request gets the rule for what it asks for", () => {
  assert.equal(strategyFor(get("/", "navigate"), ORIGIN), "shell");
  assert.equal(strategyFor(get("/?sw=1", "navigate"), ORIGIN), "shell");
  assert.equal(strategyFor(get("/index.html", "navigate"), ORIGIN), "shell");
  assert.equal(strategyFor(get("/assets/case07-_SYmirFn.js"), ORIGIN), "immutable");
  assert.equal(strategyFor(get("/assets/pretendard-cp-Ck2guAuE.woff2"), ORIGIN), "immutable");
  assert.equal(strategyFor(get("/scene-case01-960.webp", "no-cors"), ORIGIN), "revalidate");
  assert.equal(strategyFor(get("/icons/icon-192.png", "no-cors"), ORIGIN), "revalidate");
  assert.equal(strategyFor(get("/manifest.webmanifest"), ORIGIN), "revalidate");
});

test("the worker leaves alone what is not its to answer", () => {
  assert.equal(strategyFor({ method: "POST", url: `${ORIGIN}/assets/x.js`, mode: "cors" }, ORIGIN), "none", "not a GET");
  assert.equal(strategyFor(get("/sw.js"), ORIGIN), "none", "the worker's own file");
  assert.equal(strategyFor({ method: "GET", url: "https://ref.supabase.co/rest/v1/playtest_sessions", mode: "cors" }, ORIGIN), "none", "the backend");
  assert.equal(strategyFor({ method: "GET", url: "not a url", mode: "cors" }, ORIGIN), "none");
  // A chunk is never answered with the page: a navigation is the only request
  // the shell rule takes, and only for the page's own address.
  assert.equal(strategyFor(get("/assets/ResultScreen-gone.js", "navigate"), ORIGIN), "none");
  assert.equal(strategyFor(get("/somewhere/else", "navigate"), ORIGIN), "none");
});

test("a release's cache is its own, and only this site's other releases are stale", () => {
  assert.equal(cacheNameFor("abc1234"), `${CACHE_PREFIX}abc1234`);
  assert.deepEqual(staleCaches([`${CACHE_PREFIX}old`, `${CACHE_PREFIX}abc1234`, "someone-elses"], "abc1234"), [`${CACHE_PREFIX}old`]);
});

const response = (body, { status = 200, type = "basic", contentType = "application/javascript" } = {}) => {
  const made = new Response(body, { status, headers: { "content-type": contentType } });
  Object.defineProperty(made, "type", { value: type });
  return made;
};

test("only a plain 200 from this origin is kept, and never a page under a file's name", () => {
  assert.equal(isStorable(response("x")), true);
  assert.equal(isStorable(response("x", { status: 404 })), false);
  assert.equal(isStorable(response("x", { type: "opaque" })), false);
  assert.equal(isStorable(response("<html>", { contentType: "text/html; charset=utf-8" })), false);
  assert.equal(isStorable(response("<html>", { contentType: "text/html" }), { allowHtml: true }), true);
  assert.equal(isStorable(null), false);
});

/** A worker scope with a network that answers from `site` and caches that are maps. */
function fakeScope(site, { offline = false } = {}) {
  const stores = new Map();
  const listeners = new Map();
  const asked = [];
  const urlOf = (request) => new URL(typeof request === "string" ? request : request.url, ORIGIN).pathname;
  const scope = {
    offline,
    asked,
    stores,
    location: { origin: ORIGIN },
    setTimeout: (work, ms) => setTimeout(work, ms === NAVIGATION_TIMEOUT_MS ? 20 : ms),
    clearTimeout,
    skipped: false,
    claimed: false,
    skipWaiting: async () => {
      scope.skipped = true;
    },
    clients: {
      claim: async () => {
        scope.claimed = true;
      },
    },
    fetch: async (request) => {
      const path = urlOf(request);
      asked.push(path);
      if (scope.offline) throw new TypeError("Failed to fetch");
      const entry = site[path];
      if (entry === "hang") return new Promise(() => {});
      if (entry === undefined) return response("missing", { status: 404, contentType: "text/plain" });
      return typeof entry === "function" ? entry() : response(entry, { contentType: path === "/" ? "text/html" : "application/javascript" });
    },
    caches: {
      keys: async () => [...stores.keys()],
      delete: async (name) => stores.delete(name),
      open: async (name) => {
        if (!stores.has(name)) stores.set(name, new Map());
        const store = stores.get(name);
        return {
          match: async (request) => store.get(urlOf(request))?.clone(),
          put: async (request, value) => void store.set(urlOf(request), value),
          addAll: async (urls) => {
            const answers = await Promise.all(urls.map((url) => scope.fetch(url)));
            if (answers.some((answer) => answer.status !== 200)) throw new TypeError("Request failed");
            urls.forEach((url, index) => store.set(url, answers[index]));
          },
        };
      },
    },
    addEventListener: (type, listener) => listeners.set(type, listener),
    dispatch(type, event = {}) {
      const waits = [];
      let answer;
      listeners.get(type)({ ...event, waitUntil: (work) => waits.push(work), respondWith: (work) => (answer = work) });
      return { answer, settled: () => Promise.all(waits) };
    },
  };
  return scope;
}

const ENTRY = "/assets/index-abc12345.js";
const CONFIG = { release: "abc1234", entry: ENTRY, precache: [ENTRY, "/assets/index-abc12345.css"], warm: ["/assets/case02-def67890.js", "/assets/RankingScreen-0a1b2c3d.js"] };
const SITE = {
  "/": `<html><script type="module" src="${ENTRY}"></script></html>`,
  [ENTRY]: "entry",
  "/assets/index-abc12345.css": "css",
  "/assets/case02-def67890.js": "case02",
  "/assets/RankingScreen-0a1b2c3d.js": "ranking",
  "/scene-case01.webp": "art v1",
};
// A `Request` cannot be constructed with the mode "navigate"; the worker reads three fields.
const plainRequest = (path, mode) => ({ request: { method: "GET", url: `${ORIGIN}${path}`, mode } });
const fetchEvent = (path, mode = "cors") => plainRequest(path, mode);

async function installed(site = SITE, options) {
  const scope = fakeScope(site, options);
  installWorker(scope, CONFIG);
  await scope.dispatch("install").settled();
  await scope.dispatch("activate").settled();
  return scope;
}

test("install keeps the page and everything it names, then takes over", async () => {
  const scope = await installed();
  const store = scope.stores.get(cacheNameFor("abc1234"));
  assert.deepEqual([...store.keys()].sort(), [ENTRY, "/assets/index-abc12345.css", SHELL_URL].sort());
  assert.equal(await store.get(SHELL_URL).clone().text(), SITE["/"]);
  assert.equal(scope.skipped, true);
  assert.equal(scope.claimed, true);
});

test("install fails when the page being served belongs to another release", async () => {
  const scope = fakeScope({ ...SITE, "/": '<html><script type="module" src="/assets/index-newer000.js"></script></html>' });
  installWorker(scope, CONFIG);
  await assert.rejects(scope.dispatch("install").settled(), /not this release's/);
  assert.equal(scope.skipped, false);
});

test("install fails when a file the intro needs is missing", async () => {
  const { [ENTRY]: _gone, ...site } = SITE;
  const scope = fakeScope(site);
  installWorker(scope, CONFIG);
  await assert.rejects(scope.dispatch("install").settled());
  assert.equal(scope.skipped, false);
});

test("install fails on a page served under a file's name, and writes nothing", async () => {
  // A host that answers a missing file with its fallback page, and a 200.
  const scope = fakeScope({ ...SITE, [ENTRY]: () => response("<html>", { contentType: "text/html" }) });
  installWorker(scope, CONFIG);
  await assert.rejects(scope.dispatch("install").settled(), /index-abc12345\.js answered 200, or with a page/);
  assert.equal(scope.skipped, false);
  // Not the page either: a worker still in charge may be answering from this cache.
  assert.deepEqual([...(scope.stores.get(cacheNameFor("abc1234"))?.keys() ?? [])], []);
});

test("activate deletes the other releases' caches and no one else's", async () => {
  const scope = fakeScope(SITE);
  scope.stores.set(`${CACHE_PREFIX}older`, new Map());
  scope.stores.set("unrelated", new Map());
  installWorker(scope, CONFIG);
  await scope.dispatch("install").settled();
  await scope.dispatch("activate").settled();
  assert.deepEqual([...scope.stores.keys()].sort(), [cacheNameFor("abc1234"), "unrelated"].sort());
});

test("the page comes from the network while there is one", async () => {
  const scope = await installed();
  const { answer } = scope.dispatch("fetch", plainRequest("/", "navigate"));
  assert.equal(await (await answer).text(), SITE["/"]);
  assert.equal(scope.asked.at(-1), "/");
});

test("the page comes from the kept copy when the network is gone, or says nothing", async () => {
  const offline = await installed();
  offline.offline = true;
  const gone = offline.dispatch("fetch", plainRequest("/?sw=1", "navigate"));
  assert.equal(await (await gone.answer).text(), SITE["/"]);

  const slow = await installed();
  slow.fetch = () => new Promise(() => {});
  const quiet = slow.dispatch("fetch", plainRequest("/", "navigate"));
  assert.equal(await (await quiet.answer).text(), SITE["/"]);
});

test("the page comes from the kept copy when the host answers with an error of its own", async () => {
  const site = { ...SITE };
  const scope = await installed(site);
  site["/"] = () => response("Bad Gateway", { status: 502, contentType: "text/html" });
  const down = scope.dispatch("fetch", plainRequest("/", "navigate"));
  assert.equal(await (await down.answer).text(), SITE["/"], "the kept page, not the host's error page");
  site["/"] = () => response("Not Found", { status: 404, contentType: "text/html" });
  assert.equal(await (await scope.dispatch("fetch", plainRequest("/", "navigate")).answer).text(), SITE["/"]);
});

test("with nothing kept, a failed navigation fails as the network did", async () => {
  const scope = fakeScope(SITE, { offline: true });
  installWorker(scope, CONFIG);
  await assert.rejects(scope.dispatch("fetch", plainRequest("/", "navigate")).answer, /Failed to fetch/);

  const failing = fakeScope({ ...SITE, "/": () => response("Bad Gateway", { status: 502, contentType: "text/html" }) });
  installWorker(failing, CONFIG);
  assert.equal((await failing.dispatch("fetch", plainRequest("/", "navigate")).answer).status, 502, "the host's own answer is all there is");
});

test("a fingerprinted file is answered from the cache without asking, and kept on a miss", async () => {
  const scope = await installed();
  const before = scope.asked.length;
  const hit = scope.dispatch("fetch", fetchEvent(ENTRY));
  assert.equal(await (await hit.answer).text(), "entry");
  assert.equal(scope.asked.length, before, "no request for a file already kept");

  const miss = scope.dispatch("fetch", fetchEvent("/assets/case02-def67890.js"));
  assert.equal(await (await miss.answer).text(), "case02");
  await miss.settled();
  scope.offline = true;
  const again = scope.dispatch("fetch", fetchEvent("/assets/case02-def67890.js"));
  assert.equal(await (await again.answer).text(), "case02", "kept on the way back");
});

test("a chunk the server no longer has fails as it always did, and is not kept", async () => {
  const scope = await installed();
  const gone = scope.dispatch("fetch", fetchEvent("/assets/ResultScreen-oldold00.js"));
  assert.equal((await gone.answer).status, 404);
  await gone.settled();
  assert.equal(scope.stores.get(cacheNameFor("abc1234")).has("/assets/ResultScreen-oldold00.js"), false);

  scope.offline = true;
  await assert.rejects(scope.dispatch("fetch", fetchEvent("/assets/RankingScreen-0a1b2c3d.js")).answer, /Failed to fetch/, "offline and not kept: the import fails, and the page shows its panel");
});

test("a page served under a file's name is not kept as that file", async () => {
  const scope = await installed({ ...SITE, "/assets/Fallback-11111111.js": () => response("<html>", { contentType: "text/html" }) });
  const answered = scope.dispatch("fetch", fetchEvent("/assets/Fallback-11111111.js"));
  await answered.answer;
  await answered.settled();
  assert.equal(scope.stores.get(cacheNameFor("abc1234")).has("/assets/Fallback-11111111.js"), false);
});

test("a root image is answered from the kept copy and refreshed behind it", async () => {
  const site = { ...SITE };
  const scope = await installed(site);
  const first = scope.dispatch("fetch", fetchEvent("/scene-case01.webp", "no-cors"));
  assert.equal(await (await first.answer).text(), "art v1");
  await first.settled();

  site["/scene-case01.webp"] = "art v2";
  const second = scope.dispatch("fetch", fetchEvent("/scene-case01.webp", "no-cors"));
  assert.equal(await (await second.answer).text(), "art v1", "the kept copy now");
  await second.settled();
  scope.offline = true;
  const third = scope.dispatch("fetch", fetchEvent("/scene-case01.webp", "no-cors"));
  assert.equal(await (await third.answer).text(), "art v2", "the fresh one next time, and with no connection");
  await third.settled();
});

test("offline, a picture not kept at the size asked for is given at a size that is", async () => {
  assert.deepEqual(artVariants("/scene-case01-480.webp"), ["/scene-case01-960.webp", "/scene-case01.webp"]);
  assert.deepEqual(artVariants("/scene-case01.webp"), ["/scene-case01-960.webp", "/scene-case01-480.webp"]);
  assert.deepEqual(artVariants("/ending-final-archive-960.webp"), ["/ending-final-archive.webp", "/ending-final-archive-480.webp"]);
  assert.deepEqual(artVariants("/profile.jpg"), []);
  assert.deepEqual(artVariants("/icons/icon-192.png"), []);

  const scope = await installed({ ...SITE, "/scene-case02-960.webp": "case02 at 960" });
  const warmed = scope.dispatch("fetch", fetchEvent("/scene-case02-960.webp", "no-cors"));
  await warmed.answer;
  await warmed.settled();
  scope.offline = true;
  const phone = scope.dispatch("fetch", fetchEvent("/scene-case02-480.webp", "no-cors"));
  assert.equal(await (await phone.answer).text(), "case02 at 960");
  await assert.rejects(scope.dispatch("fetch", fetchEvent("/scene-case03-480.webp", "no-cors")).answer, /Failed to fetch/, "nothing kept at any size: the image fails as it would have");
});

test("a request the worker leaves alone is not answered at all", async () => {
  const scope = await installed();
  assert.equal(scope.dispatch("fetch", plainRequest("/sw.js", "same-origin")).answer, undefined);
  assert.equal(scope.dispatch("fetch", { request: { method: "POST", url: `${ORIGIN}/assets/x.js`, mode: "cors" } }).answer, undefined);
});

test("the warm-up fetches what is not kept yet and says when the release is whole", async () => {
  const scope = await installed();
  const told = [];
  const event = scope.dispatch("message", { data: { type: "warm" }, source: { postMessage: (message) => told.push(message) } });
  await event.settled();
  const store = scope.stores.get(cacheNameFor("abc1234"));
  assert.equal(store.has("/assets/case02-def67890.js"), true);
  assert.equal(store.has("/assets/RankingScreen-0a1b2c3d.js"), true);
  assert.deepEqual(told, [{ type: "warmed", complete: true, release: "abc1234" }]);

  // Asked again, it has nothing to fetch.
  const before = scope.asked.length;
  await scope.dispatch("message", { data: { type: "warm" }, source: null }).settled();
  assert.equal(scope.asked.length, before);
  // Another message is not a warm-up.
  assert.equal((await scope.dispatch("message", { data: { type: "hello" } }).settled()).length, 0);
});

test("a warm-up the connection cuts short stops and says it is not whole", async () => {
  const scope = await installed();
  scope.offline = true;
  const told = [];
  await scope.dispatch("message", { data: { type: "warm" }, source: { postMessage: (message) => told.push(message) } }).settled();
  assert.equal(told[0].complete, false);
  assert.ok(scope.asked.filter((path) => CONFIG.warm.includes(path)).length <= 3, "it does not go on asking for the whole season");

  const missing = await installed({ ...SITE, "/assets/case02-def67890.js": undefined });
  const heard = [];
  await missing.dispatch("message", { data: { type: "warm" }, source: { postMessage: (message) => heard.push(message) } }).settled();
  assert.equal(heard[0].complete, false, "a file the server does not have leaves the release unfinished");
});

// --- scripts/service-worker-build.mjs ---

const PAGE = `<!doctype html><html><head>
<link rel="canonical" href="/" />
<meta property="og:image" content="/triggerlab-key-visual.jpg" />
<link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32.png" />
<link rel="manifest" href="/manifest.webmanifest" />
<link rel="preload" as="image" imagesrcset="/triggerlab-key-visual-480.webp 1x, /triggerlab-key-visual-960.webp 2x" media="(max-width: 700px)" />
<link rel="preload" as="image" imagesrcset="/triggerlab-key-visual-960.webp 960w, /triggerlab-key-visual.webp 1672w" imagesizes="100vw" />
<link rel="preload" as="font" href="/assets/pretendard-cp-Ck2guAuE.woff2" crossorigin />
<script type="module" crossorigin src="/assets/index-FZxcMdNV.js"></script>
<link rel="modulepreload" crossorigin href="/assets/react-vendor-DJzcuUew.js">
<link rel="stylesheet" crossorigin href="/assets/index-ClVpZWiL.css" media="print" data-deferred-style><noscript><link rel="stylesheet" crossorigin href="/assets/index-ClVpZWiL.css"></noscript>
<script src="/assets/deferred-styles-ae3dcf14.js" defer></script>
<link rel="preconnect" href="https://elsewhere.example/x.js" />
</head><body></body></html>`;

test("the precache list is what the built page names, each file once", () => {
  assert.deepEqual(precacheFromHtml(PAGE), [
    "/icons/favicon-32.png",
    "/manifest.webmanifest",
    "/triggerlab-key-visual-480.webp",
    "/triggerlab-key-visual-960.webp",
    "/triggerlab-key-visual.webp",
    "/assets/pretendard-cp-Ck2guAuE.woff2",
    "/assets/index-FZxcMdNV.js",
    "/assets/react-vendor-DJzcuUew.js",
    "/assets/index-ClVpZWiL.css",
    "/assets/deferred-styles-ae3dcf14.js",
  ]);
  assert.equal(entryFromHtml(PAGE), "/assets/index-FZxcMdNV.js");
  assert.equal(entryFromHtml("<html></html>"), null);
});

test("a release is named for its commit, or for its page when it has none", () => {
  const sha = "3c114e616a6e8626a85a92e91075b0451a96a442";
  const named = releaseIdFor({ sha, html: PAGE });
  assert.match(named, new RegExp(`^${sha}-[0-9a-f]{8}$`));
  // The same commit built again with another backend address has another
  // entry script, and has to be another release: it used to share the cache.
  assert.notEqual(releaseIdFor({ sha, html: PAGE.replace("FZxcMdNV", "Changed0") }), named);
  // The names decide, not the markup around them: the live check works the
  // release out from the page as it was served.
  assert.equal(releaseIdFor({ sha, html: PAGE.replaceAll("\n", "\n  ") }), named);
  const local = releaseIdFor({ sha: "", html: PAGE });
  assert.match(local, /^local-[0-9a-f]{12}$/);
  assert.equal(releaseIdFor({ html: PAGE }), local);
  assert.notEqual(releaseIdFor({ html: PAGE.replace("FZxcMdNV", "Changed0") }), local, "a page that names another entry is another release");
  assert.equal(releaseIdFor({ sha: "not a commit", html: PAGE }), local);
});

const FILES = [
  "/index.html",
  "/assets/index-FZxcMdNV.js",
  "/assets/react-vendor-DJzcuUew.js",
  "/assets/case02-CN_k66fr.js",
  "/assets/RankingScreen-BHGTYjZL.js",
  "/portrait-echo.webp",
  "/profile.jpg",
  "/scene-case01.webp",
  "/scene-case01-480.webp",
  "/scene-case01-960.webp",
  "/triggerlab-key-visual-960.webp",
  "/sw.js",
];

test("the warm list is every other build file, the portraits and the art at one size, and nothing twice", () => {
  const config = workerConfigFor({ sha: "", html: PAGE, files: FILES });
  assert.deepEqual(config.warm, ["/assets/RankingScreen-BHGTYjZL.js", "/assets/case02-CN_k66fr.js", "/portrait-echo.webp", "/profile.jpg", "/scene-case01-960.webp"]);
  assert.equal(config.warm.includes("/triggerlab-key-visual-960.webp"), false, "already in the precache");
  assert.equal(config.entry, "/assets/index-FZxcMdNV.js");
  assert.equal(config.precache.includes("/assets/index-FZxcMdNV.js"), true);
  assert.throws(() => workerConfigFor({ html: "<html></html>", files: FILES }), /no module script/);
});

test("the built worker is the source without its exports, and says what it was built with", () => {
  const template = readFileSync("src/serviceWorker/worker.js", "utf8");
  const config = workerConfigFor({ sha: "abc1234", html: PAGE, files: FILES });
  const source = buildWorkerSource(template, config);
  assert.equal(/^export /m.test(source), false);
  assert.match(source, /installWorker\(self, WORKER_CONFIG\);\n$/);
  assert.deepEqual(readWorkerConfig(source), config);
  // It runs as a classic script against a scope, and registers its listeners.
  const heard = [];
  new Function("self", source)({ addEventListener: (type) => heard.push(type), location: { origin: ORIGIN } });
  assert.deepEqual(heard, ["install", "activate", "fetch", "message"]);
  assert.throws(() => buildWorkerSource('import x from "./y.js";\n', config), /classic worker/);
});

test("a worker is held to the page beside it", () => {
  const config = workerConfigFor({ sha: "", html: PAGE, files: FILES });
  const source = buildWorkerSource("export function installWorker() {}\n", config);
  const hasFile = (file) => FILES.includes(file) || config.precache.includes(file);
  assert.deepEqual(workerProblems({ source, html: PAGE, hasFile }), []);
  assert.match(workerProblems({ source, html: PAGE.replace("FZxcMdNV", "Changed0"), hasFile }).join("\n"), /not built from this page[\s\S]*expects the entry script/);
  assert.match(workerProblems({ source, html: PAGE, hasFile: (file) => file !== "/assets/case02-CN_k66fr.js" }).join("\n"), /lists \/assets\/case02-CN_k66fr\.js/);
  assert.match(workerProblems({ source: "console.log(1)", html: PAGE })[0], /no WORKER_CONFIG/);
  assert.equal(readWorkerConfig("const WORKER_CONFIG = {broken};"), null);

  const stamped = PAGE.replace("</head>", '<meta name="build-sha" content="abc1234abc1234" /></head>');
  assert.equal(buildShaFromHtml(stamped), "abc1234abc1234");
  assert.equal(buildShaFromHtml(PAGE), null);
  const other = buildWorkerSource("", { ...config, release: "fff0000fff0000" });
  assert.match(workerProblems({ source: other, html: stamped })[0], /release fff0000fff0000 and the page is abc1234abc1234/);
  const empty = buildWorkerSource("", { ...workerConfigFor({ sha: "", html: PAGE, files: FILES }), precache: [] });
  assert.match(workerProblems({ source: empty, html: PAGE }).join("\n"), /precaches nothing/);
});

test("a check can say which worker it found, and the kill switch is not found in silence", () => {
  const config = workerConfigFor({ sha: "abc1234", html: PAGE, files: FILES });
  const release = describeWorker(buildWorkerSource("", config));
  assert.equal(release.killed, false);
  assert.match(release.text, new RegExp(`^sw\\.js is release ${config.release}: 10 files kept at install, 5 more`));
  // It passes `workerProblems` by having nothing to disagree with, so every
  // deploy after a forgotten SERVICE_WORKER=off was green with offline play off.
  const killed = describeWorker(buildKillSource(CACHE_PREFIX));
  assert.equal(killed.killed, true);
  assert.match(killed.text, /kill switch[\s\S]*SERVICE_WORKER/);
  assert.equal(describeWorker("console.log(1)"), null);
});

test("the kill switch is a worker that removes its caches and itself, and is not a problem", async () => {
  const source = buildKillSource(CACHE_PREFIX);
  assert.deepEqual(workerProblems({ source, html: PAGE }), []);
  const listeners = {};
  const stores = new Map([[`${CACHE_PREFIX}abc`, 1], ["unrelated", 1]]);
  let unregistered = false;
  let skipped = false;
  const self = {
    addEventListener: (type, listener) => (listeners[type] = listener),
    skipWaiting: () => (skipped = true),
    registration: { unregister: async () => (unregistered = true) },
  };
  const caches = { keys: async () => [...stores.keys()], delete: async (name) => stores.delete(name) };
  new Function("self", "caches", source)(self, caches);
  assert.equal(listeners.fetch, undefined, "it answers nothing");
  listeners.install();
  let work;
  listeners.activate({ waitUntil: (promise) => (work = promise) });
  await work;
  assert.equal(skipped, true);
  assert.equal(unregistered, true);
  assert.deepEqual([...stores.keys()], ["unrelated"]);
});

// --- src/serviceWorker/register.js ---

test("a release registers, the e2e build only when asked, the dev server never", () => {
  assert.equal(serviceWorkerWanted("on", ""), true);
  assert.equal(serviceWorkerWanted("ask", ""), false);
  assert.equal(serviceWorkerWanted("ask", "?sw=1"), true);
  assert.equal(serviceWorkerWanted("ask", "?debug=1&sw=1"), true);
  assert.equal(serviceWorkerWanted("ask", "?sw=10"), false);
  assert.equal(serviceWorkerWanted("off", "?sw=1"), false);
  assert.equal(serviceWorkerWanted(undefined), false);
});

test("the rest of the release is not asked for offline or against a data-saving reader", () => {
  assert.equal(mayWarm({ online: true, saveData: undefined }), true);
  assert.equal(mayWarm({ online: undefined, saveData: false }), true);
  assert.equal(mayWarm({ online: false }), false);
  assert.equal(mayWarm({ online: true, saveData: true }), false);
});

function fakePage({ readyState = "complete", onLine = true, saveData = false, search = "", controlled = false } = {}) {
  const listeners = new Map();
  const containerListeners = new Map();
  const posted = [];
  const attributes = new Map();
  const registered = [];
  const worker = (name) => ({ name, postMessage: (message) => posted.push({ ...message, to: name }) });
  const registration = { active: worker("first") };
  const scope = {
    posted,
    attributes,
    registered,
    registration,
    location: { search },
    document: {
      readyState,
      documentElement: { setAttribute: (name, value) => attributes.set(name, value), removeAttribute: (name) => attributes.delete(name) },
    },
    navigator: {
      onLine,
      connection: { saveData },
      serviceWorker: {
        controller: controlled ? registration.active : null,
        register: async (url) => void registered.push(url),
        ready: Promise.resolve(registration),
        addEventListener: (type, listener) => containerListeners.set(type, listener),
      },
    },
    requestIdleCallback: (work) => work(),
    addEventListener: (type, listener) => listeners.set(type, listener),
    fire: (type) => listeners.get(type)?.(),
    hear: (data, source) => containerListeners.get("message")?.({ data, source }),
    /** The active worker takes the page over (`clients.claim`). */
    claim: () => containerListeners.get("controllerchange")?.(),
    /** A new release's worker activates and claims the page. */
    replaceWorker(name) {
      registration.active = worker(name);
      scope.claim();
      return registration.active;
    },
  };
  return scope;
}
const warmAsked = (page) => page.posted.map((message) => message.to);
const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

test("nothing registers where it is not wanted, or where there is no worker to register", () => {
  assert.equal(installServiceWorker({ setting: "off", scope: fakePage() }), false);
  assert.equal(installServiceWorker({ setting: "ask", scope: fakePage() }), false);
  assert.equal(installServiceWorker({ setting: "on", scope: { navigator: {} } }), false);
  assert.equal(installServiceWorker({ scope: fakePage() }), false, "under Node the bundler's constant is absent, which is off");
});

test("registration waits for load, and the warm-up for the first case", async () => {
  noteCasesArrived(0, 0);
  const page = fakePage({ readyState: "loading" });
  assert.equal(installServiceWorker({ setting: "on", scope: page }), true);
  assert.deepEqual(page.registered, [], "not before load");
  page.fire("load");
  await settle();
  assert.deepEqual(page.registered, ["/sw.js"]);
  assert.deepEqual(page.posted, [], "no table yet");

  noteCasesArrived(1, 55);
  assert.deepEqual(page.posted, [{ type: "warm", to: "first" }]);
  noteCasesArrived(2, 55);
  assert.equal(page.posted.length, 1, "asked once");

  page.hear({ type: "warmed", complete: false });
  assert.equal(page.attributes.has(OFFLINE_READY_ATTRIBUTE), false);
  page.fire("online");
  assert.equal(page.posted.length, 2, "a warm-up cut short is asked for again when the connection is back");
  page.hear({ type: "warmed", complete: true });
  assert.equal(page.attributes.get(OFFLINE_READY_ATTRIBUTE), "ready");
  page.fire("online");
  assert.equal(page.posted.length, 2, "and not once the release is whole");
  page.hear({ type: "something else" });
  noteCasesArrived(0, 0);
});

test("a device that already has a table up asks at once, unless it should not", async () => {
  noteCasesArrived(55, 55);
  const ready = fakePage({ search: "?sw=1" });
  installServiceWorker({ setting: "ask", scope: ready });
  await settle();
  assert.deepEqual(ready.posted, [{ type: "warm", to: "first" }]);

  const saving = fakePage({ saveData: true });
  installServiceWorker({ setting: "on", scope: saving });
  await settle();
  assert.deepEqual(saving.posted, []);

  const offline = fakePage({ onLine: false });
  installServiceWorker({ setting: "on", scope: offline });
  await settle();
  assert.deepEqual(offline.posted, []);

  // No idle callback (Safari): a timer stands in.
  const timed = fakePage();
  delete timed.requestIdleCallback;
  timed.setTimeout = (work) => work();
  installServiceWorker({ setting: "on", scope: timed });
  await settle();
  assert.deepEqual(timed.posted, [{ type: "warm", to: "first" }]);
  noteCasesArrived(0, 0);
});

test("the last release's worker saying it is whole does not stand for the one that replaces it", async () => {
  // The visit after a deploy: the old worker is active when the page asks,
  // has everything, and says so. The new one then deletes that cache.
  noteCasesArrived(55, 55);
  assert.equal(chunkPanelFor({ offline: true }), "retry", "no worker has been replaced under a page yet");
  const page = fakePage({ controlled: true });
  const old = page.registration.active;
  installServiceWorker({ setting: "on", scope: page });
  await settle();
  assert.deepEqual(warmAsked(page), ["first"]);
  page.hear({ type: "warmed", complete: true, release: "old" }, old);
  assert.equal(page.attributes.get(OFFLINE_READY_ATTRIBUTE), "ready", "true of the release in charge at the time");

  const next = page.replaceWorker("second");
  assert.equal(page.attributes.has(OFFLINE_READY_ATTRIBUTE), false, "the cache that was whole is gone");
  assert.deepEqual(warmAsked(page), ["first", "second"], "the worker in charge now is asked");
  // An answer the old worker sent on its way out is about the deleted cache.
  page.hear({ type: "warmed", complete: true, release: "old" }, old);
  assert.equal(page.attributes.has(OFFLINE_READY_ATTRIBUTE), false);
  page.hear({ type: "warmed", complete: true, release: "new" }, next);
  assert.equal(page.attributes.get(OFFLINE_READY_ATTRIBUTE), "ready");
  page.fire("online");
  assert.deepEqual(warmAsked(page), ["first", "second"], "and not asked again once it is whole");
  // The page's own files went with the old cache, and the panel is told.
  assert.equal(chunkPanelFor({ offline: true }), "reload-offline");
  noteCasesArrived(0, 0);
});

test("the first worker a device installs taking the page over is not a release replaced", async () => {
  noteCasesArrived(55, 55);
  const page = fakePage();
  installServiceWorker({ setting: "on", scope: page });
  await settle();
  assert.deepEqual(warmAsked(page), ["first"]);
  // `clients.claim` from the worker that was just asked: nothing to repeat.
  page.claim();
  assert.deepEqual(warmAsked(page), ["first"]);
  assert.equal(page.attributes.has(OFFLINE_READY_ATTRIBUTE), false);
  page.hear({ type: "warmed", complete: true }, page.registration.active);
  assert.equal(page.attributes.get(OFFLINE_READY_ATTRIBUTE), "ready");
  noteCasesArrived(0, 0);
});

test("a worker replaced before the first table is up is simply the one asked", async () => {
  noteCasesArrived(0, 0);
  const page = fakePage({ controlled: true });
  installServiceWorker({ setting: "on", scope: page });
  await settle();
  page.replaceWorker("second");
  assert.deepEqual(warmAsked(page), [], "nothing was asked, so nothing is asked again");
  noteCasesArrived(1, 55);
  assert.deepEqual(warmAsked(page), ["second"]);
  noteCasesArrived(0, 0);
});

test("a registration that fails is not an error the page has to answer", async () => {
  const page = fakePage();
  page.navigator.serviceWorker.register = async () => {
    throw new Error("SecurityError");
  };
  installServiceWorker({ setting: "on", scope: page });
  await settle();
  assert.deepEqual(page.posted, []);
});
