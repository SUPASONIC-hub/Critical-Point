import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import {
  assetCacheProblems,
  backendOriginProblems,
  backendPlacementProblems,
  cspProblems,
  entryScriptPath,
  firstAssetPath,
  firstRootImagePath,
  inlineScriptProblems,
  readRenderYamlCsp,
  renderYamlHeaderProblems,
  rootImageCacheProblems,
  rootImageSamples,
  shellCacheProblems,
  siteHeaderProblems,
  wildcardHostProblems,
  WORKER_PATH,
  workerCacheProblems,
} from "./deploy-policy.mjs";
import { buildShaFromHtml, describeWorker, releaseIdFor, workerProblems } from "./service-worker-build.mjs";

/**
 * Two modes.
 *
 *   node scripts/check-deploy.mjs            (npm run check:deploy)
 *     Fetches DEPLOY_URL and checks what the live site actually sends: the
 *     page, the security headers, the CSP *value* (see deploy-policy.mjs), how
 *     the page and one fingerprinted asset are cached, that the served HTML
 *     has no inline script the CSP would block, that the entry script names
 *     the backend the CSP lets it call -- a release built without
 *     VITE_SUPABASE_URL serves every header correctly and has no ranking --
 *     and that `/sw.js` is there and was built with the page beside it: a
 *     worker of one release keeping the page of another is an installed copy
 *     that opens to nothing offline. How the images from the root are cached
 *     (one file for each rule render.yaml has for them), and how the worker's
 *     file is, are reported and not failed: a slower visit and a slower
 *     update, not a broken one.
 *
 *   node scripts/check-deploy.mjs --offline
 *     No network. Checks the headers `render.yaml` declares, and
 *     `dist/index.html`, its scripts and `dist/sw.js` -- every file the
 *     worker lists has to be in the build -- when a build exists. The
 *     dashboard headers are copied from render.yaml by hand, so this is the
 *     half that can run before a deploy.
 *
 * Both say which worker they found, and warn when it is the kill switch
 * (`describeWorker`, service-worker-build.mjs).
 *
 * The live half is the one that catches the dashboard drifting from the file:
 * on 2026-09-28 the file said `immutable` for `/assets/*` and `no-cache` for the
 * page, and the site served `max-age=0, s-maxage=300` for both.
 */

const root = process.cwd();

/** Something to be read and not failed: an annotation when a workflow is reading, a line otherwise. */
function report(title, text, label = "Note") {
  console.log(process.env.GITHUB_ACTIONS ? `::warning title=${title}::${text}` : `${label}: ${text}.`);
}

/** Says which worker `source` is. The kill switch is a warning wherever this runs: it is never the usual state. */
function sayWorker(source) {
  const found = describeWorker(source);
  if (!found) return;
  if (found.killed) report("The service worker is switched off", found.text, "WARNING");
  else console.log(`Service worker: ${found.text}.`);
}

function checkOffline() {
  const problems = [];
  const notes = [];
  let workerSource = null;
  const yaml = readFileSync(path.join(root, "render.yaml"), "utf8");
  const csp = readRenderYamlCsp(yaml);
  if (!csp) problems.push("render.yaml declares no Content-Security-Policy");
  else problems.push(...cspProblems(csp).map((problem) => `render.yaml CSP: ${problem}`));
  problems.push(...renderYamlHeaderProblems(yaml).map((problem) => `render.yaml headers ${problem}`));

  const built = path.join(root, "dist", "index.html");
  if (existsSync(built)) {
    const html = readFileSync(built, "utf8");
    problems.push(...inlineScriptProblems(html).map((problem) => `dist/index.html: ${problem}`));
    if (!firstAssetPath(html)) problems.push("dist/index.html links no fingerprinted asset, so the live check has nothing to read a cache policy from");
    if (!firstRootImagePath(html)) problems.push("dist/index.html names no image at the root, so the live check has nothing to read the image cache policy from");
    const entry = entryScriptPath(html);
    if (!entry) {
      problems.push("dist/index.html has no module script, so the live check cannot tell which backend the release was built for");
    } else {
      // A build that names no backend is said, not failed: `npm run build` on
      // a desktop with no .env.local is a build without one, and a correct
      // one. `npm run build:e2e`, which is what verify:quick checks, names
      // its placeholder. A build that names its backend in some other chunk
      // is failed: that is the release the live check, which reads the entry
      // script alone, would turn red after the merge.
      const assets = path.join(root, "dist", "assets");
      const scripts = (existsSync(assets) ? readdirSync(assets) : [])
        .filter((file) => file.endsWith(".js"))
        .map((file) => [`/assets/${file}`, readFileSync(path.join(assets, file), "utf8")]);
      const misplaced = csp ? backendPlacementProblems(entry, scripts, csp) : [];
      problems.push(...misplaced.map((problem) => `dist: ${problem}`));
      if (misplaced.length === 0) {
        const script = readFileSync(path.join(root, "dist", entry), "utf8");
        for (const note of csp ? backendOriginProblems(script, csp) : []) notes.push(`dist${entry}: ${note}`);
      }
    }
    const worker = path.join(root, "dist", WORKER_PATH);
    if (!existsSync(worker)) {
      problems.push(`dist${WORKER_PATH} is missing: the build writes it (serviceWorker() in vite.config.js), and without it an installed copy cannot open offline`);
    } else {
      const hasFile = (file) => existsSync(path.join(root, "dist", file));
      workerSource = readFileSync(worker, "utf8");
      problems.push(...workerProblems({ source: workerSource, html, hasFile }).map((problem) => `dist${WORKER_PATH}: ${problem}`));
    }
  } else {
    console.log("No dist/index.html; run `npm run build` first to check the built page too.");
  }

  if (problems.length) {
    console.error(`Offline deploy check failed:\n${problems.join("\n")}`);
    process.exit(1);
  }
  // The file cannot name the project, so it is only said, not failed: the live
  // check is where a wildcard host is refused.
  for (const note of wildcardHostProblems(csp)) console.log(`Note (render.yaml CSP): ${note} when setting it in the dashboard.`);
  for (const note of notes) console.log(`Note: ${note}.`);
  sayWorker(workerSource);
  console.log("Offline deploy check passed: render.yaml headers" + (existsSync(built) ? ", dist/index.html and dist/sw.js" : ""));
}

/**
 * One request, answered within fifteen seconds or not at all: `{ ok, status,
 * headers, text }`. The limit covers the body. It used to stop at the
 * headers, so a response that began and then stalled held the job until the
 * job's own timeout, thirty-five minutes later. A HEAD has no body to read.
 */
async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const response = await fetch(url, { redirect: "error", signal: controller.signal, ...options });
    const text = options.method === "HEAD" ? "" : await response.text();
    return { ok: response.ok, status: response.status, headers: response.headers, text };
  } finally {
    clearTimeout(timeout);
  }
}

async function checkLive() {
  const rawUrl = process.env.DEPLOY_URL;
  if (!rawUrl) {
    console.error("DEPLOY_URL is required, for example https://<your-service>.onrender.com (or pass --offline)");
    process.exit(1);
  }

  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    console.error(`Invalid DEPLOY_URL: ${rawUrl}`);
    process.exit(1);
  }

  if (url.protocol !== "https:") {
    console.error("DEPLOY_URL must use https");
    process.exit(1);
  }

  try {
    const response = await fetchWithTimeout(url, { headers: { Accept: "text/html" } });
    const body = response.text;

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    if (!body.includes("<title>") || !body.includes("/assets/")) {
      throw new Error("response does not look like the built app");
    }

    const problems = [
      ...siteHeaderProblems((name) => response.headers.get(name)).map((problem) => `header ${problem}`),
      ...cspProblems(response.headers.get("content-security-policy")).map((problem) => `CSP: ${problem}`),
      ...wildcardHostProblems(response.headers.get("content-security-policy")).map((problem) => `CSP: ${problem}`),
      ...shellCacheProblems(response.headers.get("cache-control")).map((problem) => `cache: ${problem}`),
      ...inlineScriptProblems(body),
    ];

    const assetPath = firstAssetPath(body);
    if (!assetPath) {
      problems.push("the page links no fingerprinted asset");
    } else {
      const asset = await fetchWithTimeout(new URL(assetPath, url.origin), { method: "HEAD" });
      if (!asset.ok) problems.push(`${assetPath} answered HTTP ${asset.status}`);
      else problems.push(...assetCacheProblems(asset.headers.get("cache-control")).map((problem) => `cache: ${problem} [${assetPath}]`));
    }

    const entryPath = entryScriptPath(body);
    if (!entryPath) {
      problems.push("the page has no module script");
    } else {
      const entry = await fetchWithTimeout(new URL(entryPath, url.origin));
      if (!entry.ok) problems.push(`${entryPath} answered HTTP ${entry.status}`);
      else problems.push(...backendOriginProblems(entry.text, response.headers.get("content-security-policy")).map((problem) => `backend: ${problem} [${entryPath}]`));
    }

    // Asked for under the release's own name, so a cache in front of the site
    // that still holds the last release's worker is not what answers. The
    // name is the one the worker carries, not the commit alone: the same
    // commit deployed twice is two releases, and the second must not be
    // answered with the first's file.
    const workerUrl = new URL(WORKER_PATH, url.origin);
    workerUrl.searchParams.set("release", releaseIdFor({ sha: buildShaFromHtml(body) ?? "", html: body }));
    const worker = await fetchWithTimeout(workerUrl).catch(() => null);
    if (!worker?.ok) problems.push(`${WORKER_PATH} answered ${worker ? `HTTP ${worker.status}` : "nothing"}`);
    else problems.push(...workerProblems({ source: worker.text, html: body }).map((problem) => `worker: ${problem}`));

    if (problems.length) throw new Error(`\n${problems.join("\n")}`);

    // Which worker is live, for whoever pressed the deploy: a release's, or
    // the kill switch, which passes everything above by having nothing to
    // disagree with.
    sayWorker(worker.text);

    // Reported, not failed: a browser passes its HTTP cache for a worker's
    // file by itself, so a held copy delays an update and breaks nothing.
    const dashboard = "render.yaml declares the rule; add it in the Render dashboard under Settings -> Headers";
    const plainWorker = await fetchWithTimeout(new URL(WORKER_PATH, url.origin), { method: "HEAD" }).catch(() => null);
    for (const problem of plainWorker?.ok ? workerCacheProblems(plainWorker.headers.get("cache-control")) : []) {
      report("The service worker is cached in between", `${problem} [${WORKER_PATH}]. ${dashboard}`);
    }

    // Reported, not failed, and as an annotation when a workflow is reading:
    // an image asked about on every visit is a slower page, and the rule that
    // fixes it is one somebody has to type into the dashboard. One file for
    // each rule, so each rule's absence has a warning that goes away when it
    // is typed in.
    for (const { rule, path: imagePath } of rootImageSamples(body)) {
      if (!imagePath) {
        console.log(`Note: the page names no file under ${rule}, so how that rule is served was not read.`);
        continue;
      }
      const image = await fetchWithTimeout(new URL(imagePath, url.origin), { method: "HEAD" }).catch(() => null);
      const imageProblems = image?.ok ? rootImageCacheProblems(image.headers.get("cache-control")) : [`${imagePath} answered ${image ? `HTTP ${image.status}` : "nothing"}`];
      for (const problem of imageProblems) report("Root images are not cached", `${problem} [${imagePath}, the rule for ${rule}]. ${dashboard}`);
    }

    // Reported, not failed: whether the host lets a static site name a file's
    // type is the host's to say, and a browser installs from either.
    const manifest = await fetchWithTimeout(new URL("/manifest.webmanifest", url.origin), { method: "HEAD" }).catch(() => null);
    const manifestType = manifest?.headers.get("content-type") ?? "";
    if (manifest?.ok && !/^application\/(manifest\+)?json/i.test(manifestType)) {
      console.log(`Note: /manifest.webmanifest is served as "${manifestType}"; application/manifest+json is what render.yaml asks for.`);
    }

    console.log(`Deployment smoke check passed: ${url.origin}`);
  } catch (error) {
    console.error(`Deployment smoke check failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

if (process.argv.includes("--offline")) checkOffline();
else await checkLive();
