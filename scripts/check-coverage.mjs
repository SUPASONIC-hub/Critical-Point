import { spawnSync } from "node:child_process";
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
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
 */

const root = process.cwd();
const FLOORS_FILE = "scripts/coverage-floors.json";
const REPORT_DIR = path.join(root, "coverage");
const REPORT_FILE = path.join(REPORT_DIR, "lcov.info");
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

mkdirSync(REPORT_DIR, { recursive: true });
const run = spawnSync(
  process.execPath,
  [
    "--test",
    "--experimental-test-coverage",
    "--test-coverage-include=src/**/*.js",
    "--test-reporter=lcov",
    `--test-reporter-destination=${REPORT_FILE}`,
    "--test-reporter=spec",
    "--test-reporter-destination=stdout",
    ...TEST_FILES,
  ],
  { cwd: root, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
);
if (run.status !== 0) {
  // The tests themselves failed; their output is the message.
  process.stdout.write(run.stdout ?? "");
  process.stderr.write(run.stderr ?? "");
  process.exit(run.status ?? 1);
}
const summary = (run.stdout ?? "").split(/\r?\n/).filter((line) => /^ℹ (tests|pass|fail|skipped) /.test(line));
console.log(summary.map((line) => line.replace(/^ℹ /, "")).join(", "));

const percent = (hit, found) => (found === 0 ? 100 : (hit / found) * 100);
const measured = new Map();
for (const record of readFileSync(REPORT_FILE, "utf8").split("end_of_record")) {
  const file = record.match(/^SF:(.+)$/m)?.[1]?.trim().replace(/\\/g, "/");
  if (!file) continue;
  const count = (key) => Number(record.match(new RegExp(`^${key}:(\\d+)$`, "m"))?.[1] ?? 0);
  measured.set(file, {
    lines: [count("LH"), count("LF")],
    functions: [count("FNH"), count("FNF")],
    branches: [count("BRH"), count("BRF")],
  });
}

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
