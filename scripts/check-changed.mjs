/**
 * `npm run check:changed`: before a push, the checks this branch's changes
 * can break, and no others.
 *
 *   npm run check:changed                     # against origin/main
 *   npm run check:changed -- origin/some-base # another base
 *   npm run check:changed -- --dry-run        # print the plan, run nothing
 *   npm run check:changed -- --no-build       # skip build:e2e and check:bundle
 *   --jobs=N --timeout=S                      # as verify:static
 *
 * The changed files are `git diff --name-only <base>...HEAD` plus whatever is
 * uncommitted or untracked in the worktree. scripts/check-changed-rules.mjs
 * decides what they need; this prints each pick with its reason and runs them
 * in verify:static's pool (scripts/check-pool.mjs). A file the rules do not
 * know runs the whole of verify:static.
 *
 * A build, when one is needed, is `npm run build:e2e`, which reuses a cached
 * dist/ for a clean tree it has built before (scripts/build-cache.mjs), then
 * check:bundle and check:deploy:offline on it. A build that has to run takes
 * the build lock the way any build does: run this under the lock wrapper.
 *
 * CI still runs all of verify:quick on the pull request. This is the local
 * pass that keeps a reworded scene from waiting on the season simulations.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { CHECKS } from "./verify-static.mjs";
import { importClosure, isTextOnlyChange, planChecks } from "./check-changed-rules.mjs";
import { poolOptions, readScripts, runPool } from "./check-pool.mjs";

const root = process.cwd();
const argv = process.argv.slice(2);
const dryRun = argv.includes("--dry-run");
const noBuild = argv.includes("--no-build");
const base = argv.find((arg) => !arg.startsWith("--")) ?? "origin/main";

function git(args, { allowFail = false } = {}) {
  const result = spawnSync("git", args, { cwd: root, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (result.status !== 0) {
    if (allowFail) return null;
    console.error(`git ${args.join(" ")} failed: ${result.stderr.trim()}`);
    process.exit(2);
  }
  return result.stdout;
}

const lines = (text) => (text ?? "").split("\n").map((line) => line.trim()).filter(Boolean);
const mergeBase = lines(git(["merge-base", base, "HEAD"]))[0];
const committed = lines(git(["diff", "--name-only", "--no-renames", `${base}...HEAD`]));
const uncommitted = [...lines(git(["diff", "--name-only", "--no-renames", "HEAD"])), ...lines(git(["ls-files", "--others", "--exclude-standard"]))];
const files = [...new Set([...committed, ...uncommitted])].sort();

const readRepo = (file) => {
  try {
    return readFileSync(path.join(root, file), "utf8");
  } catch {
    return null;
  }
};
const isFile = (file) => {
  try {
    return statSync(path.join(root, file)).isFile();
  } catch {
    return false;
  }
};
const atBase = (file) => git(["show", `${mergeBase}:${file}`], { allowFail: true });
const textOnly = (file) => isTextOnlyChange(atBase(file), readRepo(file));

// Each check's script, followed through its imports.
const scripts = readScripts(root);
const memo = new Map();
const closures = new Map();
for (const name of CHECKS) {
  const entry = scripts[name]?.match(/^node\s+(scripts\/[\w./-]+\.mjs)/)?.[1];
  if (entry) closures.set(name, importClosure(entry, { read: readRepo, exists: isFile, memo }));
}

// The files `npm test` runs: scripts/unit-tests.mjs, scripts/smoke-test.mjs and tests/unit/**/*.test.mjs.
function walk(dir) {
  if (!existsSync(path.join(root, dir))) return [];
  return readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap((item) => {
    const file = `${dir}/${item.name}`;
    return item.isDirectory() ? walk(file) : [file];
  });
}
const testFiles = ["scripts/unit-tests.mjs", "scripts/smoke-test.mjs", ...walk("tests/unit").filter((file) => file.endsWith(".test.mjs")).sort()];
const outsideTests = (file) => !file.startsWith("tests/");
const unitTests = testFiles.map((file) => ({
  file,
  closure: importClosure(file, { read: readRepo, exists: isFile, memo }),
  near: importClosure(file, { read: readRepo, exists: isFile, memo, stopAt: outsideTests }),
  text: readRepo(file) ?? "",
}));

const plan = planChecks({ files, textOnly, checks: CHECKS, closures, unitTests });

// --- what will run, and why ---------------------------------------------------

console.log(`check:changed: ${files.length} file(s) changed against ${base} (merge base ${mergeBase.slice(0, 8)})${uncommitted.length ? `, ${uncommitted.length} of them uncommitted` : ""}.`);
for (const { file, area, importers } of plan.areas) {
  console.log(`  ${file}  [${area ?? "no area"}${importers.length ? `; imported by ${importers.length} check(s)` : ""}]`);
}
if (!files.length) {
  console.log("Nothing changed; nothing to check.");
  process.exit(0);
}
if (plan.full) console.log(`\nRunning all of verify:static: ${plan.fullReasons.join("; ")}.`);
console.log("\nChecks:");
for (const name of CHECKS.filter((check) => plan.checks.has(check))) {
  const reasons = [...plan.checks.get(name)];
  console.log(`  ${name.padEnd(22)} ${reasons.slice(0, 2).join("; ")}${reasons.length > 2 ? `; +${reasons.length - 2} more` : ""}`);
}
const skipped = CHECKS.filter((check) => !plan.checks.has(check));
if (skipped.length) console.log(`  skipped: ${skipped.join(", ")}`);

const testTask =
  plan.tests.mode === "full"
    ? { name: "test", command: scripts.test }
    : plan.tests.mode === "related"
      ? { name: `test (${plan.tests.files.size} related)`, command: `node --test ${[...plan.tests.files].map((file) => `"${file}"`).join(" ")}` }
      : null;
console.log(`\nUnit tests: ${plan.tests.mode}${plan.tests.reasons.length ? ` -- ${plan.tests.reasons.slice(0, 3).join("; ")}` : ""}`);
if (plan.tests.mode === "related") console.log(`  ${[...plan.tests.files].join("\n  ")}`);

const buildTask = plan.build.length && !noBuild
  ? { name: "build:e2e + check:bundle + check:deploy:offline", command: "npm run build:e2e && npm run check:bundle && npm run check:deploy:offline", timeoutMs: 900_000 }
  : null;
console.log(`\nBuild: ${plan.build.length ? `${noBuild ? "skipped (--no-build) " : ""}for ${plan.build.slice(0, 4).join(", ")}${plan.build.length > 4 ? ` and ${plan.build.length - 4} more` : ""}` : "not needed"}`);

const specsTask = plan.specs.length ? { name: "check:specs", command: scripts["check:specs"] } : null;
const actionlintFound = spawnSync(process.platform === "win32" ? "where" : "which", ["actionlint"], { stdio: "ignore" }).status === 0;
const actionlintTask = plan.actionlint.length && actionlintFound ? { name: "actionlint", command: "actionlint" } : null;
if (plan.specs.length) console.log(`check:specs: for ${plan.specs.slice(0, 3).join(", ")}`);
if (plan.actionlint.length) console.log(`actionlint: ${actionlintFound ? "for the workflows" : "not installed here; skipped"}`);

const tasks = [
  ...(buildTask ? [buildTask] : []),
  ...CHECKS.filter((check) => plan.checks.has(check)).map((name) => ({ name, command: scripts[name] })),
  ...(testTask ? [testTask] : []),
  ...(specsTask ? [specsTask] : []),
  ...(actionlintTask ? [actionlintTask] : []),
];

if (dryRun) {
  console.log(`\n--dry-run: ${tasks.length} task(s) would run: ${tasks.map((task) => task.name).join(", ")}.`);
  process.exit(0);
}
console.log("");
const { jobs, timeoutMs } = poolOptions(argv, tasks.length);
const failed = await runPool(tasks, { root, jobs, timeoutMs, label: "check:changed" });
process.exitCode = failed.length ? 1 : 0;
