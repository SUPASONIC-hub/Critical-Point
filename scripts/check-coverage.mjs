import { spawn } from "node:child_process";
import { globSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

/**
 * `npm run test:coverage`: the unit tests, with a floor under what they cover.
 *
 * The floor used to be two flags on the `node --test` line -- 90% of lines, 70%
 * of functions -- and it measured the wrong thing twice over.
 *
 * It counted the authored scenes. 38,000 of the 46,000 lines the tests load are
 * case packs and the tables in gameData.js, which are "covered" the moment they
 * are imported, so the 8,000 lines of logic could have sat near 40% with the
 * total still over 90.
 *
 * And it only counted what was loaded. V8 reports the files a test imported; a
 * module no test imports is not in the report at 0%, it is simply absent. 29
 * modules were absent.
 *
 * So this reads the per-file numbers instead (lcov), leaves the authored data
 * out of the sum, holds every measured module to its own floor, and keeps a
 * list of the modules no test loads. All of it is in `coverage-floors.json`,
 * and all of it is a ratchet: a module may rise above its floor, a module may
 * leave the unloaded list, and nothing moves the other way without the file
 * being edited where a reviewer can see it. `--update` rewrites the file from
 * what was just measured, and refuses to lower anything unless `--allow-lower`
 * is passed too.
 *
 * `.jsx` is not measured: Node cannot import it. The browser tiers are what
 * run the components.
 *
 * Each test file is measured on its own and the reports are added up here
 * (2026-10-08). One `node --test` over all of them left the adding-up to
 * Node, which merges the processes' reports in the order it finds their files
 * on disk -- named by process id -- and whose merge keeps an unexecuted range
 * only when the next report happens to hold the same one. payloadSchemas.js
 * line 126, which no test runs, read "covered" or "0" from one run to the
 * next (143 or 144 lines of 145), and a block no process ran could be
 * reported as run. A run of one file has one process that loads `src/`, so
 * nothing is merged before this script sees it, and what this script does
 * with the reports is a sum: the same answer in any order.
 */

const root = process.cwd();
const FLOORS_FILE = "scripts/coverage-floors.json";
const REPORT_DIR = path.join(root, "coverage");
const REPORT_FILE = path.join(REPORT_DIR, "lcov.info");
const PARTS_DIR = path.join(REPORT_DIR, "parts");
const TEST_FILES = ["scripts/unit-tests.mjs", "scripts/smoke-test.mjs", "tests/unit/**/*.test.mjs"];

// Authored copy and tables: prose, scene graphs, music rows. A line of these is
// executed by being imported, which says nothing about whether it is right; the
// content checks (check:graph, check:dialogue, check:balance ...) are what
// read them.
const DATA_MODULES = [
  /^src\/nodes\//,
  /^src\/gameData\.js$/,
  /^src\/gameDialogue\.js$/,
  /^src\/gameCases\.js$/,
  /^src\/caseCopy\.js$/,
  /^src\/appCopy\.js$/,
  /^src\/components\/musicData\.js$/,
];
const isData = (file) => DATA_MODULES.some((pattern) => pattern.test(file));

const argv = process.argv.slice(2);
const update = argv.includes("--update");
const allowLower = argv.includes("--allow-lower");

function sourceModules(directory = "src") {
  const found = [];
  for (const entry of readdirSync(path.join(root, directory), { withFileTypes: true })) {
    const relative = `${directory}/${entry.name}`;
    if (entry.isDirectory()) found.push(...sourceModules(relative));
    else if (entry.name.endsWith(".js")) found.push(relative);
  }
  return found;
}

// Sorted, so a part's number is the same file on every machine.
const testFiles = [...new Set(TEST_FILES.flatMap((pattern) => globSync(pattern, { cwd: root })))].map((file) => file.replace(/\\/g, "/")).sort();
if (testFiles.length < TEST_FILES.length) {
  console.error(`The test patterns matched ${testFiles.length} files (${TEST_FILES.join(", ")}); nothing was measured.`);
  process.exit(1);
}

/** One test file, in a `node --test` of its own, with its coverage written to `report`. */
function runTestFile(testFile, report) {
  return new Promise((resolve) => {
    const child = spawn(
      process.execPath,
      [
        "--test",
        "--experimental-test-coverage",
        "--test-coverage-include=src/**/*.js",
        "--test-reporter=lcov",
        `--test-reporter-destination=${report}`,
        "--test-reporter=spec",
        "--test-reporter-destination=stdout",
        testFile,
      ],
      { cwd: root, stdio: ["ignore", "pipe", "pipe"] },
    );
    let output = "";
    child.stdout.on("data", (chunk) => (output += chunk));
    child.stderr.on("data", (chunk) => (output += chunk));
    child.on("error", (error) => resolve({ testFile, status: 1, output: `${output}\n${error.message}` }));
    child.on("close", (status) => resolve({ testFile, status: status ?? 1, output }));
  });
}

rmSync(PARTS_DIR, { recursive: true, force: true });
mkdirSync(PARTS_DIR, { recursive: true });
const parts = testFiles.map((testFile, index) => ({ testFile, report: path.join(PARTS_DIR, `${String(index).padStart(3, "0")}.info`) }));
const results = [];
{
  const queue = [...parts];
  const workers = Array.from({ length: Math.min(queue.length, Math.max(1, os.availableParallelism?.() ?? 4)) }, async () => {
    for (let next = queue.shift(); next; next = queue.shift()) results.push(await runTestFile(next.testFile, next.report));
  });
  await Promise.all(workers);
}
const failed = results.filter((result) => result.status !== 0).sort((a, b) => a.testFile.localeCompare(b.testFile));
if (failed.length) {
  // The tests themselves failed; their output is the message.
  for (const result of failed) process.stdout.write(`${result.testFile}\n${result.output}\n`);
  process.exit(1);
}
const counted = { tests: 0, pass: 0, fail: 0, skipped: 0 };
for (const result of results) {
  for (const match of result.output.matchAll(/^ℹ (tests|pass|fail|skipped) (\d+)/gm)) counted[match[1]] += Number(match[2]);
}
console.log(`${Object.entries(counted).map(([name, count]) => `${name} ${count}`).join(", ")} in ${testFiles.length} files`);

const percent = (hit, found) => (found === 0 ? 100 : (hit / found) * 100);
// One record is one process's account of one module. A line, function or
// branch counts as covered when any process covered it, so the records are
// added, and adding does not care which is read first.
//
// What a record calls a function or a branch has to mean the same thing in
// the next record for that to work. Node numbers them by their place in its
// own list (`anonymous_12`, branch 12), and the list is as long as what that
// process happened to run. So a function is known here by the line it starts
// on and its name, and a branch by the line it starts on -- with a count
// behind it for the second and third on the same line.
const hits = new Map();
const entries = (record, key) => [...record.matchAll(new RegExp(`^${key}:(.+)$`, "gm"))].map((match) => match[1].trim());
const allRecords = parts.map((part) => readFileSync(part.report, "utf8"));
// The whole of it in one file as before, for anything else that reads lcov.
writeFileSync(REPORT_FILE, allRecords.join(""), "utf8");
for (const record of allRecords.flatMap((report) => report.split("end_of_record"))) {
  const file = record.match(/^SF:(.+)$/m)?.[1]?.trim().replace(/\\/g, "/");
  if (!file) continue;
  if (!hits.has(file)) hits.set(file, { lines: new Map(), functions: new Map(), branches: new Map() });
  const merged = hits.get(file);
  const note = (table, key, count) => table.set(key, (table.get(key) ?? 0) + (Number(count) || 0));
  const seen = new Map();
  const nth = (key) => {
    seen.set(key, (seen.get(key) ?? 0) + 1);
    return `${key}#${seen.get(key)}`;
  };
  for (const entry of entries(record, "DA")) {
    const [line, count] = entry.split(",");
    note(merged.lines, line, count);
  }
  // FN and FNDA are written in the same order: where it starts, then how often it ran.
  const started = entries(record, "FN").map((entry) => entry.slice(0, entry.indexOf(",")));
  entries(record, "FNDA").forEach((entry, index) => {
    const comma = entry.indexOf(",");
    const name = entry.slice(comma + 1).replace(/^anonymous_\d+$/, "anonymous");
    note(merged.functions, nth(`fn ${started[index]} ${name}`), entry.slice(0, comma));
  });
  for (const entry of entries(record, "BRDA")) {
    const parts = entry.split(",");
    note(merged.branches, nth(`br ${parts[0]}`), parts[3] === "-" ? 0 : parts[3]);
  }
}
const covered = (table) => [[...table.values()].filter((count) => count > 0).length, table.size];
const measured = new Map(
  [...hits].map(([file, merged]) => [file, { lines: covered(merged.lines), functions: covered(merged.functions), branches: covered(merged.branches) }]),
);

const logic = sourceModules().filter((file) => !isData(file)).sort();
const loaded = logic.filter((file) => measured.has(file));
const unloaded = logic.filter((file) => !measured.has(file));
if (loaded.length === 0) {
  console.error(`${REPORT_FILE} names no module under src/; the coverage report measured nothing.`);
  process.exit(1);
}

const sum = (key) => loaded.reduce(([hit, found], file) => [hit + measured.get(file)[key][0], found + measured.get(file)[key][1]], [0, 0]);
const total = {
  lines: percent(...sum("lines")),
  functions: percent(...sum("functions")),
  branches: percent(...sum("branches")),
};
const perFile = Object.fromEntries(loaded.map((file) => [file, Math.floor(percent(...measured.get(file).lines))]));

let floors;
try {
  floors = JSON.parse(readFileSync(path.join(root, FLOORS_FILE), "utf8"));
} catch {
  floors = null;
}

if (update) {
  const next = {
    "//": "npm run test:coverage. Floors under the unit tests, as measured; they only rise. Rewrite with `node scripts/check-coverage.mjs --update`.",
    total: {
      lines: Math.floor(total.lines),
      functions: Math.floor(total.functions),
      branches: Math.floor(total.branches),
    },
    files: perFile,
    unloaded,
  };
  const lowered = [];
  if (floors && !allowLower) {
    for (const key of Object.keys(next.total)) {
      if (next.total[key] < (floors.total?.[key] ?? 0)) lowered.push(`total ${key} ${floors.total[key]} -> ${next.total[key]}`);
    }
    for (const [file, floor] of Object.entries(floors.files ?? {})) {
      if (file in next.files && next.files[file] < floor) lowered.push(`${file} ${floor} -> ${next.files[file]}`);
    }
    for (const file of next.unloaded) {
      if (!(floors.unloaded ?? []).includes(file) && logicExisted(file, floors)) lowered.push(`${file} is no longer loaded by any test`);
    }
  }
  if (lowered.length) {
    console.error(`--update would lower these floors:\n  ${lowered.join("\n  ")}\nAdd the test, or pass --allow-lower and say why in the commit.`);
    process.exit(1);
  }
  writeFileSync(path.join(root, FLOORS_FILE), `${JSON.stringify(next, null, 2)}\n`, "utf8");
  console.log(`Wrote ${FLOORS_FILE}: ${loaded.length} measured modules, ${unloaded.length} that no test loads.`);
  process.exit(0);
}

function logicExisted(file, previous) {
  return file in (previous.files ?? {});
}

if (!floors) {
  console.error(`${FLOORS_FILE} is missing. Run \`node scripts/check-coverage.mjs --update\` and commit it.`);
  process.exit(1);
}

const failures = [];
const stale = [];
for (const key of ["lines", "functions", "branches"]) {
  const floor = floors.total?.[key];
  if (typeof floor !== "number") failures.push(`${FLOORS_FILE} has no total.${key} floor.`);
  else if (total[key] < floor) failures.push(`${key} covered across the logic modules: ${total[key].toFixed(2)}%, under the ${floor}% floor.`);
  else if (Math.floor(total[key]) > floor) stale.push(`total ${key} ${floor} -> ${Math.floor(total[key])}`);
}
for (const file of loaded) {
  const floor = floors.files?.[file];
  if (typeof floor !== "number") {
    if ((floors.unloaded ?? []).includes(file)) stale.push(`${file} is tested now (${perFile[file]}%); it can leave the unloaded list`);
    else failures.push(`${file} has no floor in ${FLOORS_FILE} (it measures ${perFile[file]}%).`);
    continue;
  }
  const lines = percent(...measured.get(file).lines);
  if (lines < floor) failures.push(`${file}: ${lines.toFixed(2)}% of lines, under its ${floor}% floor.`);
  else if (perFile[file] > floor) stale.push(`${file} ${floor} -> ${perFile[file]}`);
}
for (const file of unloaded) {
  if (!(floors.unloaded ?? []).includes(file)) {
    failures.push(
      file in (floors.files ?? {})
        ? `${file} had a ${floors.files[file]}% floor and no test loads it any more.`
        : `${file} is loaded by no unit test and is not on the unloaded list. Test it, or add it to ${FLOORS_FILE} where that shows in review.`,
    );
  }
}
for (const file of [...Object.keys(floors.files ?? {}), ...(floors.unloaded ?? [])]) {
  if (!logic.includes(file)) stale.push(`${file} is gone from src/`);
}

console.log(
  `Logic modules (authored data left out): ${total.lines.toFixed(2)}% lines, ${total.functions.toFixed(2)}% functions, ` +
    `${total.branches.toFixed(2)}% branches over ${loaded.length} modules; ${unloaded.length} modules are loaded by no unit test.`,
);
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
if (stale.length) {
  // Not a failure: the numbers went the right way. Left unrecorded, though, the
  // floor sits where it was and the gain can be lost without anyone noticing.
  console.log(`Floors that can rise (node scripts/check-coverage.mjs --update):\n  ${stale.join("\n  ")}`);
}
