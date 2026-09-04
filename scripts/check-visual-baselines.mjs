import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

/**
 * Visual baseline coverage guardrail.
 *
 * `toHaveScreenshot` writes and reads `<name>{-project}-{platform}.png`, so a
 * baseline recorded on one platform is invisible to a run on another: Playwright
 * reports the snapshot as missing and, under CI, fails. The repository held only
 * the `win32` set while the Visual Regression workflow ran on `ubuntu-latest`,
 * so that job could not have passed once -- and nothing said so, because the
 * screenshots themselves were never the thing being compared.
 *
 * This walks the same three inputs Playwright does -- the screenshot names in
 * the spec, the projects the npm script selects, and the platforms CI runs on --
 * and fails when a combination has no committed file. It also fails on a
 * baseline no screenshot call names any more, which is how a renamed test leaves
 * a stale PNG behind.
 *
 * The Linux set was recorded on 2026-09-04 by the workflow's `update_baselines`
 * dispatch, from the same commit the Windows set was recorded on; the artifact
 * carried the Windows files back byte-identical, which is what proves the run
 * only added to them. This check joined `verify:static` at that point.
 */

const root = process.cwd();

// The platforms the workflows record baselines on. `linux` is the Playwright
// container the Visual Regression job runs in; `win32` is where they are
// authored today. Adding a runner here without committing its baselines is
// exactly the failure this file exists to catch, so the list is the contract.
const CI_PLATFORMS = ["linux"];
const KNOWN_PLATFORMS = ["darwin", "linux", "win32"];

const packageJson = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
const visualScript = packageJson.scripts?.["test:visual"] ?? "";

const specPath = visualScript.match(/(tests\/[\w.-]+\.spec\.js)/)?.[1];
if (!specPath) {
  console.error("check:visual-baselines could not find a spec path in the `test:visual` script.");
  process.exit(1);
}

const projects = [...visualScript.matchAll(/--project=([\w-]+)/g)].map((match) => match[1]);
if (projects.length === 0) {
  console.error(`check:visual-baselines found no --project in \`test:visual\`; baseline names depend on it.`);
  process.exit(1);
}

const specSource = readFileSync(path.join(root, specPath), "utf8");
const screenshotNames = [...specSource.matchAll(/toHaveScreenshot\(\s*"([^"]+)"/g)].map((match) => match[1]);
if (screenshotNames.length === 0) {
  console.error(`check:visual-baselines found no toHaveScreenshot() calls in ${specPath}.`);
  process.exit(1);
}

const snapshotDir = path.join(root, `${specPath}-snapshots`);
let committed;
try {
  committed = new Set(readdirSync(snapshotDir).filter((entry) => entry.endsWith(".png")));
} catch {
  console.error(`check:visual-baselines could not read ${path.relative(root, snapshotDir)}.`);
  process.exit(1);
}

function baselineName(screenshot, project, platform) {
  const extension = path.extname(screenshot);
  const stem = screenshot.slice(0, -extension.length);
  return `${stem}-${project}-${platform}${extension}`;
}

const expected = new Set();
for (const screenshot of screenshotNames) {
  for (const project of projects) {
    for (const platform of KNOWN_PLATFORMS) expected.add(baselineName(screenshot, project, platform));
  }
}

const failures = [];

/**
 * The comparison only means anything if the browser that records the baseline
 * is the browser that reads it, so the workflow pins a Playwright container tag
 * and package.json pins the matching library version. A caret on either side
 * lets them drift apart, and the symptom would be a screenshot diff nobody can
 * explain.
 */
const workflowPath = ".github/workflows/visual-regression.yml";
let workflowSource = "";
try {
  workflowSource = readFileSync(path.join(root, workflowPath), "utf8");
} catch {
  failures.push(`${workflowPath} is missing: nothing records the baselines this file requires.`);
}
if (workflowSource) {
  const containerVersion = workflowSource.match(/mcr\.microsoft\.com\/playwright:v([\d.]+)/)?.[1];
  const lockVersion = JSON.parse(readFileSync(path.join(root, "package-lock.json"), "utf8"))
    .packages?.["node_modules/@playwright/test"]?.version;
  if (!containerVersion) {
    failures.push(`${workflowPath} names no Playwright container image; the runner's fonts would be unpinned.`);
  } else if (containerVersion !== lockVersion) {
    failures.push(
      `${workflowPath} runs playwright:v${containerVersion} but package-lock.json has ${lockVersion}. ` +
        `The recorded and compared browsers have to be the same build.`,
    );
  }
  const declaredPlatforms = /container:\s*mcr\.microsoft\.com\/playwright:/.test(workflowSource) ? ["linux"] : [];
  for (const platform of CI_PLATFORMS) {
    if (!declaredPlatforms.includes(platform)) {
      failures.push(`CI_PLATFORMS names ${platform}, but ${workflowPath} does not run on it.`);
    }
  }
}

for (const screenshot of screenshotNames) {
  for (const project of projects) {
    for (const platform of CI_PLATFORMS) {
      const name = baselineName(screenshot, project, platform);
      if (!committed.has(name)) {
        failures.push(
          `${path.relative(root, path.join(snapshotDir, name))} is missing: ` +
            `the Visual Regression workflow runs on ${platform} and will report this screenshot as absent. ` +
            `Record it with the workflow's \`update_baselines\` dispatch input.`,
        );
      }
    }
  }
}

for (const file of committed) {
  if (!expected.has(file)) {
    failures.push(`${path.relative(root, path.join(snapshotDir, file))} is not produced by any screenshot in ${specPath}.`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Visual baseline checks passed (${screenshotNames.length} screenshots x ${projects.length} project(s) x ${CI_PLATFORMS.length} CI platform(s)).`,
  );
}
