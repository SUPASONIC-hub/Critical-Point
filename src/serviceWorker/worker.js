/**
 * The service worker: what lets a copy of the game that was opened once open
 * again with no connection.
 *
 * The manifest says `display: standalone`, and a save needs no server -- but
 * the page did, so an installed copy launched on the subway was the browser's
 * own error page. This keeps the release it was installed from, whole, and
 * answers from it when the network does not.
 *
 * It is not a module of the app. The build strips the `export` keywords, puts
 * the release's constants in front and `installWorker(self, WORKER_CONFIG)`
 * behind, and writes the result to `/sw.js` (scripts/service-worker-build.mjs,
 * `serviceWorker()` in vite.config.js). It is written as functions of a scope
 * so the unit tests can hand it one (tests/unit/service-worker.test.mjs); it
 * imports nothing, because a classic worker cannot.
 *
 * Four rules, by what is being asked for (`strategyFor`):
 *
 *   the page       network first, and the kept page only when the network
 *                  fails or says nothing for three seconds. A player with a
 *                  connection is never held on an old release, and nothing
 *                  that reads the page from outside a browser (the deploy
 *                  workflow) sees a worker at all.
 *   /assets/*      kept first. A fingerprinted file never changes behind its
 *                  name, so the kept copy is the file. A miss goes to the
 *                  network and is kept on the way back.
 *   root images    the kept copy now, and a fresh one fetched behind it: their
 *                  names do not change when the picture does. With no
 *                  connection and no kept copy, the same picture at another
 *                  size if one is kept (`artVariants`).
 *   anything else  not touched: another origin (the backend), a request that
 *                  is not a GET, `/sw.js` itself.
 *
 * A request for a chunk is never answered with the page. A tab left open
 * across a deploy asks for a file the server no longer has; that has to fail
 * as it always did, because the failure is what `state/chunkReload.js` turns
 * into a reload.
 *
 * One cache per release, named for it. A new release installs beside the old
 * one, takes over at once (`skipWaiting`, `clients.claim`) and deletes every
 * other release's cache: with the page network-first and the assets named by
 * hash, there is no moment where an old page is fed a new file.
 */
export const CACHE_PREFIX = "critical-point-";
export const SHELL_URL = "/index.html";
export const NAVIGATION_TIMEOUT_MS = 3000;
// How many files the warm-up asks for at once: behind a table in play, not
// in front of it.
export const WARM_CONCURRENCY = 3;

const ROOT_STATIC = /^\/(?:icons\/)?[A-Za-z0-9._-]+\.(?:webp|jpe?g|png|webmanifest)$/;

export function cacheNameFor(release) {
  return `${CACHE_PREFIX}${release}`;
}

/** The caches of every release but this one. Another site's caches on the origin are not ours to delete. */
export function staleCaches(names, release) {
  const current = cacheNameFor(release);
  return names.filter((name) => name.startsWith(CACHE_PREFIX) && name !== current);
}

/**
 * The same picture at its other sizes, likeliest first. The art ships at 480,
 * 960 and full width (src/responsiveArt.js) and each screen asks for the one
 * that fits; the warm-up keeps the 960. Offline, a phone that would have
 * taken the 480 is given the 960 rather than a broken image.
 */
export function artVariants(pathname) {
  const base = /^\/([a-z0-9-]+?)(?:-(?:480|960))?\.webp$/.exec(pathname)?.[1];
  if (!base) return [];
  return [`/${base}-960.webp`, `/${base}.webp`, `/${base}-480.webp`].filter((variant) => variant !== pathname);
}

/** `shell`, `immutable`, `revalidate`, or `none` for a request the worker leaves alone. */
export function strategyFor({ method, url, mode }, origin) {
  if (method !== "GET") return "none";
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return "none";
  }
  if (parsed.origin !== origin) return "none";
  if (mode === "navigate") return parsed.pathname === "/" || parsed.pathname === SHELL_URL ? "shell" : "none";
  if (parsed.pathname.startsWith("/assets/")) return "immutable";
  if (ROOT_STATIC.test(parsed.pathname)) return "revalidate";
  return "none";
}

/**
 * Whether an answer may be kept. Only a plain 200 from this origin, and never
 * a page under a file's name: a host that answers a missing file with its
 * fallback page would otherwise have that page kept as the script.
 */
export function isStorable(response, { allowHtml = false } = {}) {
  if (!response || response.status !== 200 || response.type !== "basic") return false;
  return allowHtml || !/text\/html/i.test(response.headers.get("content-type") ?? "");
}

export function installWorker(scope, config) {
  const cacheName = cacheNameFor(config.release);
  const openCache = () => scope.caches.open(cacheName);
  const kept = (cache, url) => cache.match(url, { ignoreVary: true });

  /**
   * The page this release was built with, asked for past every HTTP cache. A
   * deploy can land between the worker and the page: a page that does not
   * name this release's entry script belongs to another release, and keeping
   * it would pair it offline with files it never asks for. The install fails
   * instead, and the next release's worker is the one that installs.
   */
  async function keepShell(cache) {
    const response = await scope.fetch("/", { cache: "no-cache" });
    if (!isStorable(response, { allowHtml: true })) throw new Error(`The page answered ${response.status}.`);
    const html = await response.text();
    if (!html.includes(config.entry)) throw new Error("The page being served is not this release's.");
    // Rebuilt from its text and its own headers: a navigation may not be
    // answered with a redirected response, and the page keeps the policy
    // headers it was served with when it is opened from here.
    await cache.put(SHELL_URL, new Response(html, { status: 200, headers: response.headers }));
  }

  async function install() {
    const cache = await openCache();
    await keepShell(cache);
    await cache.addAll(config.precache);
    await scope.skipWaiting();
  }

  async function activate() {
    const names = await scope.caches.keys();
    await Promise.all(staleCaches(names, config.release).map((name) => scope.caches.delete(name)));
    await scope.clients.claim();
  }

  async function answerShell(request) {
    const cache = await openCache();
    const network = scope.fetch(request);
    // Handled here too: when the kept page has already been given, a network
    // that fails afterwards has nobody else listening.
    network.catch(() => {});
    let timer;
    const quiet = new Promise((resolve) => {
      timer = scope.setTimeout(() => resolve(null), NAVIGATION_TIMEOUT_MS);
    });
    try {
      const response = await Promise.race([network, quiet]);
      if (response) return response;
    } catch {
      // No connection: the kept page, below.
    } finally {
      scope.clearTimeout(timer);
    }
    // Slow, or gone. With nothing kept the network's own answer is all there is.
    return (await kept(cache, SHELL_URL)) ?? network;
  }

  async function answerImmutable(request, keep) {
    const cache = await openCache();
    const hit = await kept(cache, request.url);
    if (hit) return hit;
    const response = await scope.fetch(request);
    if (isStorable(response)) keep(cache.put(request.url, response.clone()));
    return response;
  }

  async function answerRevalidated(request, keep) {
    const cache = await openCache();
    const hit = await kept(cache, request.url);
    const fresh = scope.fetch(request).then((response) => {
      if (isStorable(response)) return cache.put(request.url, response.clone()).then(() => response);
      return response;
    });
    if (hit) {
      keep(fresh.catch(() => {}));
      return hit;
    }
    try {
      return await fresh;
    } catch (error) {
      for (const variant of artVariants(new URL(request.url).pathname)) {
        const other = await kept(cache, variant);
        if (other) return other;
      }
      throw error;
    }
  }

  /**
   * Fetches what this release has that the device has not asked for yet: the
   * cases further down the season and the screens not opened. The page asks
   * for it once the first table is up (serviceWorker/register.js). The first
   * file that cannot be fetched ends it -- the connection went, and the page
   * asks again when it comes back. Resolves to whether everything is kept.
   */
  async function warm() {
    const cache = await openCache();
    const queue = [...config.warm];
    let failed = false;
    async function take() {
      while (queue.length && !failed) {
        const url = queue.shift();
        if (await kept(cache, url)) continue;
        try {
          const response = await scope.fetch(url);
          if (isStorable(response)) await cache.put(url, response);
          else failed = true;
        } catch {
          failed = true;
        }
      }
    }
    await Promise.all(Array.from({ length: WARM_CONCURRENCY }, take));
    return !failed;
  }

  scope.addEventListener("install", (event) => event.waitUntil(install()));
  scope.addEventListener("activate", (event) => event.waitUntil(activate()));
  scope.addEventListener("fetch", (event) => {
    const strategy = strategyFor(event.request, scope.location.origin);
    if (strategy === "none") return;
    const keep = (work) => event.waitUntil(Promise.resolve(work).catch(() => {}));
    if (strategy === "shell") event.respondWith(answerShell(event.request));
    else if (strategy === "immutable") event.respondWith(answerImmutable(event.request, keep));
    else event.respondWith(answerRevalidated(event.request, keep));
  });
  scope.addEventListener("message", (event) => {
    if (event.data?.type !== "warm") return;
    event.waitUntil(
      warm().then((complete) => {
        event.source?.postMessage({ type: "warmed", complete, release: config.release });
      }),
    );
  });

  return { install, activate, warm };
}
