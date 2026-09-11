import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

/**
 * Visual baseline coverage and freshness guardrail.
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
 * a stale PNG behind, and -- further down -- on a CI baseline that a later commit
 * re-recorded on one platform but not on this one.
 *
 * The Linux set was first recorded on 2026-09-04 by the workflow's
 * `update_baselines` dispatch, and this check joined `verify:static` then. It
 * drifted anyway: by 2026-09-11 all six Linux baselines sat behind their Windows
 * twins and the coverage loop still passed, so the visual job had been failing
 * for a week with nothing upstream of it saying a word. That is the gap the
 * freshness comparison at the bottom of this file closes.
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

/**
 * Coverage is not freshness, and this directory can be fully covered while the
 * comparison job still fails. The two platform sets are recorded by different
 * hands: `win32` by whoever changed the UI, `linux` only by the workflow's
 * `update_baselines` dispatch. So a commit that redraws a screen and re-records
 * the Windows PNGs leaves the Linux PNGs describing the screen as it used to
 * be, and the existence loop above waves it through -- which is exactly how the
 * intro reached main with a Linux baseline several commits behind its Windows
 * twin, and a green `verify:static` in front of a red visual job.
 *
 * Git history is the only evidence available here: the PNGs cannot be compared
 * to each other (different renderers draw the same screen differently, which is
 * the whole reason there are two sets) and cannot be compared to the source. So
 * the rule is the weakest one that still holds: a CI baseline whose last commit
 * is a *strict ancestor* of another platform's last commit for the same
 * screenshot was left behind by that commit. Nothing here can catch a change
 * that re-recorded neither platform -- that one is the comparison job's job.
 */
function git(...args) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
}

let historyDepth = "full";
try {
  git("rev-parse", "--git-dir");
  if (git("rev-parse", "--is-shallow-repository") === "true") historyDepth = "shallow";
} catch {
  historyDepth = "none";
}

if (historyDepth !== "full") {
  // `actions/checkout` clones one commit deep unless told otherwise, and on a
  // shallow clone every file's last commit is the tip: the comparison below
  // would find no ancestors and report a clean bill of health it never earned.
  // Saying so is the point -- a guardrail that quietly no-ops is worse than one
  // that is absent, because the absent one is not on the checklist.
  console.log(
    `check:visual-baselines: freshness comparison skipped (git history is ${historyDepth} here). ` +
      `Give the checkout \`fetch-depth: 0\` to run it.`,
  );
} else {
  // A baseline being re-recorded right now is not stale, whatever its last
  // commit says. This is the state the repository is in between the dispatch
  // landing its PNGs and the commit that carries them.
  const dirty = new Set(
    git("status", "--porcelain", "--", path.relative(root, snapshotDir))
      .split("\n")
      .map((line) => line.slice(3).trim().replace(/^"|"$/g, ""))
      .filter(Boolean)
      .map((relative) => path.basename(relative)),
  );

  const lastCommit = new Map();
  const commitOf = (name) => {
    if (!lastCommit.has(name)) {
      lastCommit.set(name, git("log", "-1", "--format=%H", "--", path.join(snapshotDir, name)));
    }
    return lastCommit.get(name);
  };

  const isAncestor = (older, newer) => {
    if (!older || !newer || older === newer) return false;
    try {
      git("merge-base", "--is-ancestor", older, newer);
      return true;
    } catch {
      return false;
    }
  };

  for (const screenshot of screenshotNames) {
    for (const project of projects) {
      const recorded = KNOWN_PLATFORMS.map((platform) => ({
        platform,
        name: baselineName(screenshot, project, platform),
      })).filter(({ name }) => committed.has(name) && !dirty.has(name));

      for (const { platform, name } of recorded) {
        if (!CI_PLATFORMS.includes(platform)) continue;
        const behind = recorded.find((other) => other.name !== name && isAncestor(commitOf(name), commitOf(other.name)));
        if (!behind) continue;
        failures.push(
          `${path.relative(root, path.join(snapshotDir, name))} is stale: ` +
            `${behind.name} was re-recorded in a later commit (${commitOf(behind.name).slice(0, 7)}) ` +
            `than this one (${commitOf(name).slice(0, 7)}), so the ${platform} run is comparing against the old screen. ` +
            `Re-record it with the Visual Regression workflow's \`update_baselines\` dispatch input.`,
        );
      }
    }
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
