import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { cspProblems, inlineScriptProblems, readRenderYamlCsp } from "./deploy-policy.mjs";

/**
 * Two modes.
 *
 *   node scripts/check-deploy.mjs            (npm run check:deploy)
 *     Fetches DEPLOY_URL and checks what the live site actually sends: the
 *     page, the security headers, the CSP *value* (see deploy-policy.mjs), and
 *     that the served HTML has no inline script the CSP would block.
 *
 *   node scripts/check-deploy.mjs --offline
 *     No network. Checks the CSP `render.yaml` declares, and `dist/index.html`
 *     when a build exists. The dashboard headers are copied from render.yaml by
 *     hand, so this is the half that can run before a deploy.
 */

const root = process.cwd();

function checkOffline() {
  const problems = [];
  const csp = readRenderYamlCsp(readFileSync(path.join(root, "render.yaml"), "utf8"));
  if (!csp) problems.push("render.yaml declares no Content-Security-Policy");
  else problems.push(...cspProblems(csp).map((problem) => `render.yaml CSP: ${problem}`));

  const built = path.join(root, "dist", "index.html");
  if (existsSync(built)) {
    problems.push(...inlineScriptProblems(readFileSync(built, "utf8")).map((problem) => `dist/index.html: ${problem}`));
  } else {
    console.log("No dist/index.html; run `npm run build` first to check the built page too.");
  }

  if (problems.length) {
    console.error(`Offline deploy check failed:\n${problems.join("\n")}`);
    process.exit(1);
  }
  console.log("Offline deploy check passed: render.yaml CSP" + (existsSync(built) ? " and dist/index.html" : ""));
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

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const response = await fetch(url, {
      redirect: "error",
      signal: controller.signal,
      headers: { Accept: "text/html" },
    });
    const body = await response.text();

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    if (!body.includes("<title>") || !body.includes("/assets/")) {
      throw new Error("response does not look like the built app");
    }

    const requiredHeaders = ["x-content-type-options", "referrer-policy", "content-security-policy"];
    const missingHeaders = requiredHeaders.filter((name) => !response.headers.get(name));
    if (missingHeaders.length) {
      throw new Error(`missing security headers: ${missingHeaders.join(", ")}`);
    }

    const problems = [
      ...cspProblems(response.headers.get("content-security-policy")).map((problem) => `CSP: ${problem}`),
      ...inlineScriptProblems(body),
    ];
    if (problems.length) throw new Error(`\n${problems.join("\n")}`);

    console.log(`Deployment smoke check passed: ${url.origin}`);
  } catch (error) {
    console.error(`Deployment smoke check failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  } finally {
    clearTimeout(timeout);
  }
}

if (process.argv.includes("--offline")) checkOffline();
else await checkLive();
