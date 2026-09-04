import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

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
 * It also fails on a job that runs npm with no setup-node at all, which is the
 * quiet version of the same bug -- that job takes whatever the runner image
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
 * Workflow steps are matched by line rather than parsed: the repository has no
 * YAML dependency, and the two keys this cares about are unambiguous in a file
 * that `actions/setup-node` already has to keep flat.
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

/** The `jobs:` entries of one workflow, as `{ name, body }`, by indentation. */
function splitJobs(source) {
  const lines = source.split(/\r?\n/);
  const start = lines.findIndex((line) => /^jobs:\s*$/.test(line));
  if (start === -1) return [];
  const jobs = [];
  let current = null;
  for (const line of lines.slice(start + 1)) {
    const header = line.match(/^ {2}([\w-]+):\s*$/);
    if (header) {
      current = { name: header[1], body: [] };
      jobs.push(current);
      continue;
    }
    // A line back at column zero has left the `jobs:` block entirely.
    if (/^\S/.test(line)) break;
    current?.body.push(line);
  }
  return jobs.map((job) => ({ name: job.name, body: job.body.join("\n") }));
}

for (const file of workflowFiles) {
  const rel = `.github/workflows/${file}`;
  const source = readFileSync(path.join(workflowDir, file), "utf8");

  for (const line of source.split(/\r?\n/)) {
    const inline = line.match(/^\s*node-version:\s*(.+?)\s*$/);
    if (inline) {
      failures.push(
        `${rel} names Node inline as \`node-version: ${inline[1]}\`. ` +
          `Use \`node-version-file: ${PIN_FILE}\` so CI and the Render build cannot disagree.`,
      );
    }
    const fromFile = line.match(/^\s*node-version-file:\s*(.+?)\s*$/);
    if (fromFile && fromFile[1] !== PIN_FILE) {
      failures.push(`${rel} reads Node from ${fromFile[1]}; ${PIN_FILE} is the one the Render build reads.`);
    }
  }

  const setupSteps = source.match(/uses:\s*actions\/setup-node@/g)?.length ?? 0;
  const pinnedSteps = source.match(new RegExp(`node-version-file:\\s*${PIN_FILE.replace(".", "\\.")}`, "g"))?.length ?? 0;
  if (setupSteps !== pinnedSteps) {
    failures.push(
      `${rel} has ${setupSteps} setup-node step(s) but ${pinnedSteps} reading ${PIN_FILE}. Every one of them has to.`,
    );
  }

  for (const job of splitJobs(source)) {
    const runsNode = /^\s*(-\s*)?run:.*\b(npm|npx|node)\b/m.test(job.body);
    if (runsNode && !/uses:\s*actions\/setup-node@/.test(job.body)) {
      failures.push(
        `${rel} job \`${job.name}\` runs npm without a setup-node step, so it takes whatever Node the runner image ships.`,
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
  const renderYaml = readFileSync(path.join(root, "render.yaml"), "utf8");
  if (/^\s*-?\s*key:\s*NODE_VERSION\s*$/m.test(renderYaml)) {
    failures.push(`render.yaml declares NODE_VERSION, which overrides ${PIN_FILE} for the deploy build.`);
  }
} catch {
  // A repository without render.yaml simply has no second place to disagree.
}

const packageJson = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
const engines = packageJson.engines?.node;
if (engines && !engines.includes(pinnedMajor)) {
  failures.push(`package.json engines.node is "${engines}" but ${PIN_FILE} pins ${pin}. They have to name the same major.`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Node version checks passed (${pin} from ${PIN_FILE}, ${workflowFiles.length} workflow(s) reading it).`);
}
