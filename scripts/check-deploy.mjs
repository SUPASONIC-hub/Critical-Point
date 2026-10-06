import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import {
  assetCacheProblems,
  backendOriginProblems,
  cspProblems,
  entryScriptPath,
  firstAssetPath,
  firstRootImagePath,
  inlineScriptProblems,
  readRenderYamlCsp,
  renderYamlHeaderProblems,
  rootImageCacheProblems,
  shellCacheProblems,
  siteHeaderProblems,
  wildcardHostProblems,
} from "./deploy-policy.mjs";

/**
 * Two modes.
 *
 *   node scripts/check-deploy.mjs            (npm run check:deploy)
 *     Fetches DEPLOY_URL and checks what the live site actually sends: the
 *     page, the security headers, the CSP *value* (see deploy-policy.mjs), how
 *     the page and one fingerprinted asset are cached, that the served HTML
 *     has no inline script the CSP would block, and that the entry script
 *     names the backend the CSP lets it call -- a release built without
 *     VITE_SUPABASE_URL serves every header correctly and has no ranking.
 *     How one image from the root is cached is reported and not failed: it is
 *     a slower visit, not a broken one.
 *
 *   node scripts/check-deploy.mjs --offline
 *     No network. Checks the headers `render.yaml` declares, and
 *     `dist/index.html` and its entry script when a build exists. The
 *     dashboard headers are copied from render.yaml by hand, so this is the
 *     half that can run before a deploy.
 *
 * The live half is the one that catches the dashboard drifting from the file:
 * on 2026-09-28 the file said `immutable` for `/assets/*` and `no-cache` for the
 * page, and the site served `max-age=0, s-maxage=300` for both.
 */

const root = process.cwd();

function checkOffline() {
  const problems = [];
  const notes = [];
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
      // Said, not failed: `npm run build` on a desktop with no .env.local is a
      // build without a backend, and a correct one. `npm run build:e2e`, which
      // is what verify:quick checks, names its placeholder.
      const script = readFileSync(path.join(root, "dist", entry), "utf8");
      for (const note of csp ? backendOriginProblems(script, csp) : []) notes.push(`dist${entry}: ${note}`);
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
  console.log("Offline deploy check passed: render.yaml headers" + (existsSync(built) ? " and dist/index.html" : ""));
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    return await fetch(url, { redirect: "error", signal: controller.signal, ...options });
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
    const body = await response.text();

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
      else problems.push(...backendOriginProblems(await entry.text(), response.headers.get("content-security-policy")).map((problem) => `backend: ${problem} [${entryPath}]`));
    }

    if (problems.length) throw new Error(`\n${problems.join("\n")}`);

    // Reported, not failed, and as an annotation when a workflow is reading:
    // an image asked about on every visit is a slower page, and the rule that
    // fixes it is one somebody has to type into the dashboard.
    const imagePath = firstRootImagePath(body);
    if (imagePath) {
      const image = await fetchWithTimeout(new URL(imagePath, url.origin), { method: "HEAD" }).catch(() => null);
      const imageProblems = image?.ok ? rootImageCacheProblems(image.headers.get("cache-control")) : [`${imagePath} answered ${image ? `HTTP ${image.status}` : "nothing"}`];
      for (const problem of imageProblems) {
        const text = `${problem} [${imagePath}]. render.yaml declares the rule; add it in the Render dashboard under Settings -> Headers`;
        console.log(process.env.GITHUB_ACTIONS ? `::warning title=Root images are not cached::${text}` : `Note: ${text}.`);
      }
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
