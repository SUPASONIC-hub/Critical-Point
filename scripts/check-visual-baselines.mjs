import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { parse } from "espree";

/**
 * Visual baseline coverage guardrail.
 *
 * `toHaveScreenshot` writes and reads `<name>{-project}-{platform}.png`, so a
 * baseline recorded on one platform is invisible to a run on another. Baselines
 * are recorded and compared in one place only: the pinned Playwright container
 * (`mcr.microsoft.com/playwright:vX.Y.Z-noble`), which is Linux. The Visual
 * Regression workflow runs in it, and `npm run test:visual:docker` runs the
 * same image on a desktop. So the committed set is `linux` and nothing else.
 *
 * There used to be a `win32` set as well, recorded on whichever Windows desktop
 * changed the UI. Nothing ever compared it -- CI only runs Linux -- and a
 * freshness rule then failed `verify:static` whenever it was re-recorded ahead
 * of the Linux set. One platform removes both the dead weight and the rule.
 *
 * This walks the same three inputs Playwright does -- the screenshot names in
 * the spec, the projects the npm script selects, and the platform -- and fails
 * when a combination has no committed file, when a committed file is not
 * produced by any screenshot (a renamed test leaves one behind), and when a
 * baseline for another platform is sitting in the directory.
 */

const root = process.cwd();
const PLATFORM = "linux";
const IMAGE = /mcr\.microsoft\.com\/playwright:v(\d+\.\d+\.\d+)(?:-[a-z]+)?(?:@sha256:[0-9a-f]{64})?/;

const failures = [];
const packageJson = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
const lockVersion = JSON.parse(readFileSync(path.join(root, "package-lock.json"), "utf8")).packages?.[
  "node_modules/@playwright/test"
]?.version;

/** The spec path and the `--project` names an npm script selects, in either `--project x` or `--project=x` form. */
function readScript(name) {
  const script = packageJson.scripts?.[name] ?? "";
  const tokens = script.match(/"[^"]*"|'[^']*'|\S+/g)?.map((token) => token.replace(/^["']|["']$/g, "")) ?? [];
  const spec = tokens.find((token) => /^tests\/[\w./-]+\.spec\.js$/.test(token));
  const projects = [];
  tokens.forEach((token, index) => {
    if (token.startsWith("--project=")) projects.push(token.slice("--project=".length));
    else if (token === "--project" && tokens[index + 1]) projects.push(tokens[index + 1]);
  });
  return { script, spec, projects };
}

const visual = readScript("test:visual");
if (!visual.spec) {
  console.error("check:visual-baselines could not find a spec path in the `test:visual` script.");
  process.exit(1);
}
if (visual.projects.length === 0) {
  console.error("check:visual-baselines found no --project in `test:visual`; baseline names depend on it.");
  process.exit(1);
}
const docker = readScript("test:visual:docker");
if (!docker.script) {
  failures.push("package.json has no `test:visual:docker` script, so baselines cannot be recorded off CI in the pinned image.");
} else if (docker.spec !== visual.spec || docker.projects.join() !== visual.projects.join()) {
  failures.push("`test:visual:docker` must select the same spec and projects as `test:visual`.");
}

/**
 * Screenshot names come from the spec's syntax tree, not a regex over its text,
 * so single quotes, backticks without substitutions, and line breaks inside the
 * call all read the same. A name built at run time cannot be checked here and
 * is reported rather than skipped.
 */
const specSource = readFileSync(path.join(root, visual.spec), "utf8");
const screenshotNames = [];
function visit(node) {
  if (!node || typeof node.type !== "string") return;
  if (
    node.type === "CallExpression" &&
    node.callee.type === "MemberExpression" &&
    !node.callee.computed &&
    node.callee.property.name === "toHaveScreenshot"
  ) {
    const [first] = node.arguments;
    if (first?.type === "Literal" && typeof first.value === "string") screenshotNames.push(first.value);
    else if (first?.type === "TemplateLiteral" && first.expressions.length === 0) screenshotNames.push(first.quasis[0].value.cooked);
    else if (first && first.type !== "ObjectExpression") {
      failures.push(`${visual.spec}:${node.loc.start.line} names its screenshot at run time; give it a literal name.`);
    }
  }
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) value.forEach(visit);
    else if (value && typeof value === "object" && value !== node.loc) visit(value);
  }
}
visit(parse(specSource, { ecmaVersion: "latest", sourceType: "module", loc: true }));
if (screenshotNames.length === 0) {
  console.error(`check:visual-baselines found no toHaveScreenshot() calls in ${visual.spec}.`);
  process.exit(1);
}

const snapshotDir = path.join(root, `${visual.spec}-snapshots`);
let committed;
try {
  committed = new Set(readdirSync(snapshotDir).filter((entry) => entry.endsWith(".png")));
} catch {
  console.error(`check:visual-baselines could not read ${path.relative(root, snapshotDir)}.`);
  process.exit(1);
}

function baselineName(screenshot, project) {
  const extension = path.extname(screenshot);
  return `${screenshot.slice(0, -extension.length)}-${project}-${PLATFORM}${extension}`;
}

/**
 * The recording browser has to be the comparing browser: the workflow's
 * container tag, the docker script's tag and the locked library all name one
 * Playwright version.
 */
const workflowPath = ".github/workflows/visual-regression.yml";
let workflowSource = "";
try {
  workflowSource = readFileSync(path.join(root, workflowPath), "utf8");
} catch {
  failures.push(`${workflowPath} is missing: nothing records the baselines this file requires.`);
}
// The docker script hands its arguments to the e2e runner, which owns the image name.
const runnerPath = "scripts/run-e2e.mjs";
const dockerSource = /run-e2e\.mjs/.test(docker.script) ? readFileSync(path.join(root, runnerPath), "utf8") : docker.script;
for (const [where, source] of [
  [workflowPath, workflowSource],
  [/run-e2e\.mjs/.test(docker.script) ? `${runnerPath} (--docker)` : "the test:visual:docker script", dockerSource],
]) {
  if (!source) continue;
  const version = source.match(IMAGE)?.[1];
  if (!version) {
    failures.push(`${where} names no mcr.microsoft.com/playwright image; the renderer's fonts would be unpinned.`);
  } else if (version !== lockVersion) {
    failures.push(
      `${where} runs playwright:v${version} but package-lock.json has ${lockVersion}. ` +
        `The recorded and compared browsers have to be the same build.`,
    );
  }
}
if (workflowSource && !/^\s*container:\s*(?:image:\s*)?mcr\.microsoft\.com\/playwright:/m.test(workflowSource)) {
  failures.push(`${workflowPath} does not run its jobs in the Playwright container, so it would not render on ${PLATFORM}.`);
}

/**
 * The pull requests the workflow compares without being asked. Its `scope` job
 * holds one pattern of paths, and a file missing from it is a screenshot that
 * changes on main with no pull request attached: `src/caseCopy.js`, which the
 * intro's roadmap prints, was missing until 2026-10-08. The pattern is read out
 * of the workflow and held to the files the three pictures are made of, and to
 * a few they are not, so it cannot be widened into "everything" either.
 */
const COMPARED = [
  "src/styles/app/play.css",
  "index.html",
  "src/screens/IntroScreen.jsx",
  "src/nodes/case01.js",
  "src/nodes/case05.js",
  "src/caseCopy.js",
  "src/gameCases.js",
  "src/appCopy.js",
  "src/endingCopy.js",
  "src/playerLanguage.js",
  "src/gameLogic.js",
  "src/viewModels/reportViewModels.js",
  "src/gauntlet/relics.js",
  "src/gauntlet/gauntletEngine.js",
  "public/triggerlab-key-visual.webp",
  "tests/visual-regression.spec.js",
  "tests/helpers/gameFlow.js",
];
const NOT_COMPARED = ["src/nodes/case30.js", "README.md", "docs/canon.md", "supabase/migrations/x.sql", "tests/offline.spec.js"];
if (workflowSource) {
  const scopePattern = workflowSource.match(/^\s*pattern='([^']+)'\s*$/m)?.[1];
  if (!scopePattern) {
    failures.push(`${workflowPath} has no \`pattern='...'\` line: nothing says which pull requests are compared.`);
  } else {
    const scope = new RegExp(scopePattern);
    for (const file of COMPARED) {
      if (!scope.test(file)) failures.push(`${workflowPath} does not compare a pull request that changes ${file}, which a screenshot is made of.`);
    }
    for (const file of NOT_COMPARED) {
      if (scope.test(file)) failures.push(`${workflowPath} compares a pull request that changes only ${file}; the pattern has been widened past what the screenshots are made of.`);
    }
  }
}

const expected = new Set();
for (const screenshot of screenshotNames) {
  for (const project of visual.projects) {
    const name = baselineName(screenshot, project);
    expected.add(name);
    if (!committed.has(name)) {
      failures.push(
        `${path.relative(root, path.join(snapshotDir, name))} is missing. Record it in the pinned image: ` +
          "`npm run test:visual:docker -- --update-snapshots`, or the Visual Regression workflow's `update_baselines` dispatch.",
      );
    }
  }
}

for (const file of committed) {
  if (expected.has(file)) continue;
  if (/-(?:win32|darwin)\.png$/.test(file)) {
    failures.push(
      `${path.relative(root, path.join(snapshotDir, file))} was rendered outside the Playwright container. ` +
        `Only ${PLATFORM} baselines are compared; delete it (it is gitignored) and record with \`npm run test:visual:docker\`.`,
    );
  } else {
    failures.push(`${path.relative(root, path.join(snapshotDir, file))} is not produced by any screenshot in ${visual.spec}.`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Visual baseline checks passed (${screenshotNames.length} screenshots x ${visual.projects.length} project(s), ${PLATFORM} only).`,
  );
}
