import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";

/**
 * Node version single-home guardrail.
 *
 * Render's build reads `.node-version`. The workflows used to name their major
 * inline instead -- `node-version: 24` in four steps while the file said
 * 22.16.0 -- so every check that gated a merge ran on a major the deploy had
 * never built with, and nothing failed, because no check ever compared the two.
 *
 * That is the shape this file exists to catch. It reads the pin, then asserts
 * that every place able to choose a Node version defers to it: each
 * `actions/setup-node` step through `node-version-file`, `render.yaml` by not
 * declaring an override, and `package.json` by not claiming a different major.
 * It also fails on a job that runs npm with no setup-node before it, which is
 * the quiet version of the same bug -- that job takes whatever the runner image
 * happens to ship.
 */

const root = process.cwd();
const PIN_FILE = ".node-version";
const failures = [];

let pin = "";
try {
  pin = readFileSync(path.join(root, PIN_FILE), "utf8").trim();
} catch {
  console.error(`${PIN_FILE} is missing: the Render build reads it, so there would be no pin at all.`);
  process.exit(1);
}

// An exact version, not a range or an alias. `lts/*` and `24` resolve to
// whatever is newest at the moment each consumer reads them, which is how the
// build environment drifts away from the one CI proved.
if (!/^\d+\.\d+\.\d+$/.test(pin)) {
  failures.push(`${PIN_FILE} holds "${pin}"; it has to be an exact x.y.z so CI and the deploy resolve the same build.`);
}
const pinnedMajor = pin.split(".")[0];

/**
 * Workflows are parsed as YAML rather than matched line by line: a step in flow
 * style (`with: { node-version: 24 }`), a quoted key, or a job at an unusual
 * indent all mean the same thing to the runner, and have to mean the same thing
 * here.
 */
const workflowDir = path.join(root, ".github", "workflows");
let workflowFiles = [];
try {
  workflowFiles = readdirSync(workflowDir).filter((entry) => entry.endsWith(".yml") || entry.endsWith(".yaml"));
} catch {
  failures.push(`.github/workflows is missing: nothing verifies the pin this file is protecting.`);
}
if (workflowFiles.length === 0 && !failures.length) {
  failures.push(`.github/workflows has no workflow files; the pin is unverified.`);
}

const isSetupNode = (step) => typeof step?.uses === "string" && /^actions\/setup-node@/.test(step.uses);
const runsNode = (step) => typeof step?.run === "string" && /\b(npm|npx|node)\b/.test(step.run);

for (const file of workflowFiles) {
  const rel = `.github/workflows/${file}`;
  let workflow;
  try {
    workflow = parseYaml(readFileSync(path.join(workflowDir, file), "utf8"));
  } catch (error) {
    failures.push(`${rel} is not valid YAML: ${String(error.message).split("\n")[0]}`);
    continue;
  }
  for (const [jobName, job] of Object.entries(workflow?.jobs ?? {})) {
    // A job that calls a reusable workflow has no steps of its own.
    const steps = Array.isArray(job?.steps) ? job.steps : [];
    for (const step of steps.filter(isSetupNode)) {
      const inline = step.with?.["node-version"];
      if (inline !== undefined) {
        failures.push(
          `${rel} job \`${jobName}\` names Node inline as \`node-version: ${inline}\`. ` +
            `Use \`node-version-file: ${PIN_FILE}\` so CI and the Render build cannot disagree.`,
        );
      }
      const fromFile = step.with?.["node-version-file"];
      if (fromFile !== PIN_FILE) {
        failures.push(
          fromFile
            ? `${rel} job \`${jobName}\` reads Node from ${fromFile}; ${PIN_FILE} is the one the Render build reads.`
            : `${rel} job \`${jobName}\` has a setup-node step that does not read ${PIN_FILE}. Every one of them has to.`,
        );
      }
    }
    const firstNode = steps.findIndex(runsNode);
    const firstSetup = steps.findIndex(isSetupNode);
    if (firstNode !== -1 && (firstSetup === -1 || firstSetup > firstNode)) {
      failures.push(
        `${rel} job \`${jobName}\` runs npm ${firstSetup === -1 ? "with no setup-node step" : "before its setup-node step"}, ` +
          `so it takes whatever Node the runner image ships.`,
      );
    }
  }
}

/**
 * Render resolves the build's Node from `.node-version` unless a `NODE_VERSION`
 * environment variable is set, which would win silently and is invisible from
 * the pin's side.
 */
try {
  const render = parseYaml(readFileSync(path.join(root, "render.yaml"), "utf8"));
  for (const service of render?.services ?? []) {
    if ((service.envVars ?? []).some((variable) => variable?.key === "NODE_VERSION")) {
      failures.push(`render.yaml declares NODE_VERSION for ${service.name}, which overrides ${PIN_FILE} for the deploy build.`);
    }
  }
} catch (error) {
  // A repository without render.yaml simply has no second place to disagree.
  if (error?.code !== "ENOENT") failures.push(`render.yaml could not be read: ${String(error.message).split("\n")[0]}`);
}

/**
 * engines.node has to admit the pinned version and no other major: `>=24 <25`
 * or `^24.20.0` pass, `>=22` does not (it would bless a Node 22 install).
 */
const packageJson = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
const engines = packageJson.engines?.node;
if (engines) {
  const majors = [...engines.matchAll(/(\d+)(?:\.\d+){0,2}/g)].map((match) => match[1]);
  const upper = engines.match(/<\s*(\d+)/)?.[1];
  const admitsOnlyPinnedMajor =
    majors.includes(pinnedMajor) &&
    (/^\s*[\^~]/.test(engines) || upper === String(Number(pinnedMajor) + 1) || /^\s*\d+(?:\.\d+){0,2}\s*$/.test(engines));
  if (!admitsOnlyPinnedMajor) {
    failures.push(
      `package.json engines.node is "${engines}" but ${PIN_FILE} pins ${pin}. ` +
        `It has to name that major and no other, e.g. ">=${pinnedMajor} <${Number(pinnedMajor) + 1}".`,
    );
  }
}

/**
 * The Node this check itself is running on. Every other assertion here is
 * about what the files say; this one is about the machine. On CI a mismatch is
 * a failure, because there `setup-node` was told to install the pin and did
 * not. On a desktop it is a warning: the checks that gate a merge run on CI's
 * Node whatever the desktop has, and failing here would turn `verify:static`
 * red on a machine that is one patch release behind.
 */
const running = process.versions.node;
const warnings = [];
if (running !== pin) {
  const message =
    `This is Node ${running}; ${PIN_FILE} pins ${pin}, which is what CI and the Render build run. ` +
    (running.split(".")[0] === pinnedMajor
      ? `Same major, so the checks here are expected to agree with CI's; install ${pin} to be certain.`
      : `That is a different major: results here do not predict CI's.`);
  if (process.env.CI) failures.push(message);
  else warnings.push(message);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Node version checks passed (${pin} from ${PIN_FILE}, ${workflowFiles.length} workflow(s) reading it).`);
  for (const warning of warnings) console.warn(`warning: ${warning}`);
}
