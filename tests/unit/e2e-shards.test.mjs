import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";

import { parse as parseYaml } from "yaml";

import {
  assignUnits,
  balance,
  medianSeconds,
  readShardPlan,
  shardPlan,
  shardUnits,
  takeShardArg,
  testListText,
  unitId,
  unitSecondsFromLog,
  unitsOf,
} from "../../scripts/e2e-shards.mjs";

// run-e2e.mjs starts a server when it is imported, so its list is read as text.
const runE2e = readFileSync("scripts/run-e2e.mjs", "utf8");
const DEFAULT_SPECS = [...runE2e.match(/const DEFAULT_SPECS = \[([\s\S]*?)\];/)[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]);
const PROJECTS = ["chromium", "mobile-chromium"];
const plan = readShardPlan();

const everyShard = (p, units, total) => Array.from({ length: total }, (_, i) => shardUnits(p, units, i + 1, total));

test("every default spec, in each project, runs on exactly one shard of the committed plan", () => {
  assert.ok(DEFAULT_SPECS.length > 10, "the default list was read from scripts/run-e2e.mjs");
  const units = unitsOf(DEFAULT_SPECS, PROJECTS);
  const placed = everyShard(plan, units, plan.shardCount).flat();
  assert.equal(placed.length, units.length);
  assert.deepEqual([...placed].sort(), [...units].sort());
  for (const shard of everyShard(plan, units, plan.shardCount)) assert.ok(shard.length > 0, "no shard is empty");
});

test("the committed plan names each unit it measured on one shard, and the shards are within a minute of each other", () => {
  assert.equal(plan.shards.length, plan.shardCount);
  const listed = plan.shards.flatMap((shard) => shard.units);
  assert.deepEqual([...listed].sort(), Object.keys(plan.seconds).sort());
  const times = plan.shards.map((shard) => shard.seconds);
  assert.ok(Math.max(...times) - Math.min(...times) <= 60, `shard times ${times.join(", ")}`);
});

test("the verify-e2e matrix runs as many shards as the plan is laid out for", () => {
  const job = parseYaml(readFileSync(".github/workflows/verify.yml", "utf8")).jobs["verify-e2e"];
  assert.deepEqual(job.strategy.matrix.shard, Array.from({ length: plan.shardCount }, (_, i) => i + 1));
  const run = job.steps.map((step) => step.run ?? "").find((line) => line.includes("--shard="));
  assert.ok(run.endsWith(`--shard=\${{ matrix.shard }}/${plan.shardCount}`), run);
});

const small = shardPlan({ "[chromium] › a.spec.js": 300, "[chromium] › b.spec.js": 200, "[chromium] › c.spec.js": 100, "[chromium] › d.spec.js": 90 }, 2, "fixture");

test("a spec the plan does not know goes to the lightest shard, and nothing is left out", () => {
  // a(300) | b(200)+c(100)... LPT: a; b; c -> b's shard (200 < 300); d -> a's (300 = 300, lower shard)
  assert.deepEqual(
    small.shards.map((shard) => shard.units),
    [["[chromium] › a.spec.js", "[chromium] › d.spec.js"], ["[chromium] › b.spec.js", "[chromium] › c.spec.js"]],
  );
  const units = [...Object.keys(small.seconds), "[chromium] › new.spec.js", "[mobile-chromium] › new.spec.js"];
  const shards = assignUnits(small, units, 2);
  assert.deepEqual(shards.flat().sort(), [...units].sort());
  // 390 against 300: the first new unit goes to shard 2, counted at the plan's
  // median unit (200) to 500, and the second then to shard 1.
  assert.ok(shards[1].includes("[chromium] › new.spec.js"));
  assert.ok(shards[0].includes("[mobile-chromium] › new.spec.js"));
});

test("a spec the plan names and the run no longer has is dropped", () => {
  const units = ["[chromium] › a.spec.js", "[chromium] › c.spec.js"];
  assert.deepEqual(assignUnits(small, units, 2), [["[chromium] › a.spec.js"], ["[chromium] › c.spec.js"]]);
});

test("a shard count the plan is not laid out for is refused, not guessed", () => {
  assert.throws(() => assignUnits(small, Object.keys(small.seconds), 3), /laid out for 2 shards.*--shards=3/);
});

test("balance is deterministic and longest first", () => {
  const seconds = { "[x] › e.spec.js": 5, "[x] › f.spec.js": 5, "[x] › g.spec.js": 10 };
  assert.deepEqual(balance(seconds, 2), balance({ ...seconds }, 2));
  assert.deepEqual(balance(seconds, 2), [
    { seconds: 10, units: ["[x] › g.spec.js"] },
    { seconds: 10, units: ["[x] › e.spec.js", "[x] › f.spec.js"] },
  ]);
  assert.throws(() => balance(seconds, 0), /positive integer/);
});

test("a test list line is a project and a spec file, which Playwright reads as every test of that file in that project", () => {
  assert.equal(unitId("mobile-chromium", "tests/table-keys.spec.js"), "[mobile-chromium] › table-keys.spec.js");
  assert.equal(testListText(["[chromium] › a.spec.js", "[chromium] › b.spec.js"]), "[chromium] › a.spec.js\n[chromium] › b.spec.js\n");
});

const LOG = [
  "verify-e2e (1)\tRun npm run test:e2e\t2026-11-03T02:08:10.3Z   ✓   19 [chromium] › tests/a.spec.js:429:1 › fits @layout (13.3s)",
  "verify-e2e (1)\tRun npm run test:e2e\t2026-11-03T02:08:11.3Z   ✘   20 [chromium] › tests/a.spec.js:500:1 › flakes (1.0m)",
  "verify-e2e (1)\tRun npm run test:e2e\t2026-11-03T02:09:11.3Z   ✓   21 [chromium] › tests/a.spec.js:500:1 › flakes (retry #1) (30.0s)",
  "verify-e2e (2)\tRun npm run test:e2e\t2026-11-03T02:09:12.3Z   ✓   1 [mobile-chromium] › tests/b.spec.js:12:1 › a › b (500ms)",
  "verify-season (2)\tRun npm run test:e2e\t2026-11-03T02:09:12.3Z   ✓   1 [chromium] › tests/a.spec.js:12:1 › segment (9.0m)",
  "verify-quick\tRun npm run test:e2e\t2026-11-03T02:09:12.3Z   ✓   1 [chromium] › tests/b.spec.js:12:1 › prod (9.0s)",
  "verify-e2e (2)\tRun npm run test:e2e\t2026-11-03T02:09:12.3Z   12 passed (12.0m)",
].join("\n");

test("the log reader takes only verify-e2e's test lines, retries included", () => {
  const seconds = unitSecondsFromLog(LOG);
  assert.deepEqual(Object.keys(seconds).sort(), ["[chromium] › a.spec.js", "[mobile-chromium] › b.spec.js"]);
  assert.ok(Math.abs(seconds["[chromium] › a.spec.js"] - (13.3 + 60 + 30)) < 1e-9);
  assert.ok(Math.abs(seconds["[mobile-chromium] › b.spec.js"] - 0.5) < 1e-9);
  assert.deepEqual(medianSeconds([{ u: 10 }, { u: 30 }, { u: 20, v: 4 }]), { u: 20, v: 4 });
});

test("npm run e2e:rebalance lays the plan out again from the durations in the logs", () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), "e2e-rebalance-"));
  mkdirSync(path.join(dir, "tests"));
  const logs = [LOG, LOG.replace("(13.3s)", "(33.3s)"), LOG.replace("(13.3s)", "(23.3s)")].map((text, i) => {
    const file = path.join(dir, `${41000000000 + i}.log`);
    writeFileSync(file, text);
    return `--log=${file}`;
  });
  const out = execFileSync(process.execPath, [path.resolve("scripts/e2e-rebalance.mjs"), "--shards=2", ...logs], { cwd: dir, encoding: "utf8" });
  assert.match(out, /2 units/);
  const written = JSON.parse(readFileSync(path.join(dir, "tests/e2e-shards.json"), "utf8"));
  assert.equal(written.shardCount, 2);
  assert.equal(written.source, "run 41000000000, run 41000000001, run 41000000002");
  assert.equal(written.seconds["[chromium] › a.spec.js"], 113.3, "the median run");
  assert.deepEqual(written.shards, balance(written.seconds, 2));
  // Run again with no --shards: the count already in the file is kept.
  execFileSync(process.execPath, [path.resolve("scripts/e2e-rebalance.mjs"), ...logs], { cwd: dir, encoding: "utf8" });
  assert.equal(JSON.parse(readFileSync(path.join(dir, "tests/e2e-shards.json"), "utf8")).shardCount, 2);
});

test("the shard argument is taken out in either spelling, and one Playwright would refuse is left to it", () => {
  assert.deepEqual(takeShardArg(["--skip-segments", "--shard=3/7", "-x"]), { index: 3, total: 7, rest: ["--skip-segments", "-x"] });
  assert.deepEqual(takeShardArg(["--shard", "7/7"]), { index: 7, total: 7, rest: [] });
  assert.equal(takeShardArg(["--project=chromium"]), null);
  assert.equal(takeShardArg(["--shard=8/7"]), null);
  assert.equal(takeShardArg(["--shard=a/b"]), null);
});

test("run-e2e balances only the default list: a spec, a grep, a project, the preview and WebKit keep Playwright's shard", () => {
  const body = runE2e.match(/function balancedShard\(\) \{([\s\S]*?)\n\}/)[1];
  for (const flag of ["usePreview", "hasExplicitTestTarget", "hasExplicitGrep", "hasExplicitProject", 'has("--webkit")']) assert.ok(body.includes(flag), flag);
  assert.ok(runE2e.includes("...(balanced ? [...balanced.args, ...balanced.forwarded] : forwardedArgs)"));
});
