import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import {
  assetCacheProblems,
  cspProblems,
  firstAssetPath,
  inlineScriptProblems,
  readRenderYamlCsp,
  renderYamlHeaderProblems,
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
 *     the page and one fingerprinted asset are cached, and that the served HTML
 *     has no inline script the CSP would block.
 *
 *   node scripts/check-deploy.mjs --offline
 *     No network. Checks the headers `render.yaml` declares, and
 *     `dist/index.html` when a build exists. The dashboard headers are copied
 *     from render.yaml by hand, so this is the half that can run before a deploy.
 *
 * The live half is the one that catches the dashboard drifting from the file:
 * on 2026-09-28 the file said `immutable` for `/assets/*` and `no-cache` for the
 * page, and the site served `max-age=0, s-maxage=300` for both.
 */

const root = process.cwd();

function checkOffline() {
  const problems = [];
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

    if (problems.length) throw new Error(`\n${problems.join("\n")}`);

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
