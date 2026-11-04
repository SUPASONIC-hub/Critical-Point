import { readFileSync } from "node:fs";

/**
 * Time-balanced shards for the default e2e list on CI.
 *
 * Playwright's own `--shard=i/N` cuts the ordered list into N runs of equal
 * test count, so the slow tests that sit next to each other in one file land
 * on one shard: on 2026-11-03 (run 41561249153) the five shards took 15.1,
 * 12.0, 14.4, 14.9 and 15.2 minutes. tests/e2e-shards.json instead holds the
 * measured seconds of each project and spec file -- a "unit", `[project] ›
 * file` -- and which shard each unit goes to, laid out by
 * `npm run e2e:rebalance` from CI logs. scripts/run-e2e.mjs turns the shard
 * it is asked for into a Playwright `--test-list` of those units.
 *
 * A unit is a whole file in one project, not a test: a renamed test then
 * changes nothing here, and the largest unit (table-keys in chromium, about
 * six minutes) still fits under the shard time with room to spare.
 */

export const SHARD_PLAN_PATH = "tests/e2e-shards.json";

/** `[chromium] › table-keys.spec.js`: the form a `--test-list` line takes. */
export function unitId(project, file) {
  return `[${project}] › ${file.replace(/^tests\//, "")}`;
}

/** Every unit a run covers: each spec in each project. */
export function unitsOf(specs, projects) {
  return projects.flatMap((project) => specs.map((spec) => unitId(project, spec)));
}

export function readShardPlan(path = SHARD_PLAN_PATH) {
  return JSON.parse(readFileSync(path, "utf8"));
}

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0;
};

/**
 * Longest first, each to the lightest shard so far (LPT). Ties go to the lower
 * shard, and units of equal time are taken in name order, so the same seconds
 * always give the same plan.
 */
export function balance(seconds, shardCount) {
  if (!Number.isInteger(shardCount) || shardCount < 1) throw new Error(`shard count must be a positive integer, not ${shardCount}`);
  const shards = Array.from({ length: shardCount }, () => ({ seconds: 0, units: [] }));
  const order = Object.entries(seconds).sort(([a, x], [b, y]) => y - x || a.localeCompare(b));
  for (const [unit, unitSeconds] of order) {
    const lightest = shards.reduce((best, shard) => (shard.seconds < best.seconds ? shard : best), shards[0]);
    lightest.seconds += unitSeconds;
    lightest.units.push(unit);
  }
  return shards.map((shard) => ({ seconds: Math.round(shard.seconds), units: [...shard.units].sort() }));
}

/**
 * The units of shard `index` (1-based) out of `total`, for a run that covers
 * `units`. A unit the plan does not know -- a spec added since the last
 * rebalance -- goes to the lightest shard, one unit at a time, counted at the
 * plan's median unit time; a unit the plan names that the run does not cover
 * is dropped. Every shard computes the same assignment from the same inputs, so
 * the shards together cover every unit exactly once, and that is checked here
 * rather than trusted: a unit on no shard is a spec that is green because it
 * never started.
 */
export function shardUnits(plan, units, index, total) {
  return assignUnits(plan, units, total)[index - 1];
}

export function assignUnits(plan, units, total) {
  if (total !== plan.shardCount) {
    throw new Error(`${SHARD_PLAN_PATH} is laid out for ${plan.shardCount} shards, and this run asks for ${total}. Run \`npm run e2e:rebalance -- --shards=${total}\`.`);
  }
  const covered = new Set(units);
  const shards = plan.shards.map((shard) => ({
    seconds: shard.units.filter((unit) => covered.has(unit)).reduce((sum, unit) => sum + (plan.seconds[unit] ?? 0), 0),
    units: shard.units.filter((unit) => covered.has(unit)),
  }));
  const planned = new Set(shards.flatMap((shard) => shard.units));
  const estimate = median(Object.values(plan.seconds));
  for (const unit of [...covered].filter((unit) => !planned.has(unit)).sort()) {
    const lightest = shards.reduce((best, shard) => (shard.seconds < best.seconds ? shard : best), shards[0]);
    lightest.seconds += estimate;
    lightest.units.push(unit);
  }
  const placed = shards.flatMap((shard) => shard.units);
  const twice = placed.filter((unit, i) => placed.indexOf(unit) !== i);
  const missing = [...covered].filter((unit) => !placed.includes(unit));
  if (twice.length || missing.length || placed.length !== covered.size) {
    throw new Error(`the e2e shards do not cover each unit once: ${[...twice.map((u) => `${u} twice`), ...missing.map((u) => `${u} on no shard`)].join(", ")}`);
  }
  return shards.map((shard) => shard.units);
}

/**
 * `--shard=i/N` or `--shard i/N` out of the arguments for Playwright: the
 * shard, and the arguments without it. Null when there is none, or when it is
 * not a shard Playwright would take either, which is then left to Playwright
 * to refuse.
 */
export function takeShardArg(args) {
  const at = args.findIndex((arg) => arg === "--shard" || arg.startsWith("--shard="));
  if (at < 0) return null;
  const spaced = args[at] === "--shard";
  const [index, total] = String(spaced ? args[at + 1] : args[at].slice("--shard=".length))
    .split("/")
    .map(Number);
  if (!Number.isInteger(index) || !Number.isInteger(total) || index < 1 || index > total) return null;
  return { index, total, rest: args.filter((_, i) => i !== at && !(spaced && i === at + 1)) };
}

/** The `--test-list` file for some units: one `[project] › file` line each. */
export function testListText(units) {
  return `${units.join("\n")}\n`;
}

/**
 * Seconds per unit from Playwright's `list` reporter, as `gh run view --log`
 * prints it: `✓  12 [chromium] › tests/table-keys.spec.js:851:1 › title (1.8m)`.
 * A retried test counts both tries; that is the time the shard spent on it.
 * A whole run's log has every job in it, each line led by the job's name and
 * a tab; only the lines of `job` are read, since verify-quick and
 * verify-season run some of the same specs on other terms. Returns
 * { unit: seconds } for the log.
 */
export function unitSecondsFromLog(text, job = "verify-e2e") {
  const seconds = {};
  const line = /[✓✘-]\s+\d+ \[([\w-]+)\] › (tests\/[\w.-]+\.spec\.js):\d+:\d+ › .*\((\d+(?:\.\d+)?)(ms|s|m)\)\s*$/;
  for (const row of text.split(/\r?\n/)) {
    const jobName = row.match(/^([^\t]+)\t/)?.[1];
    if (jobName !== undefined && jobName !== job && !jobName.startsWith(`${job} (`)) continue;
    const match = row.match(line);
    if (!match) continue;
    const [, project, file, amount, unit] = match;
    const value = Number(amount) * (unit === "m" ? 60 : unit === "ms" ? 0.001 : 1);
    const id = unitId(project, file);
    seconds[id] = (seconds[id] ?? 0) + value;
  }
  return seconds;
}

/**
 * One run's seconds per unit from several runs' logs: the median across the
 * runs that ran the unit. A runner on a slow day shifts every unit alike, and
 * the median keeps one slow retry from moving a unit to another shard.
 */
export function medianSeconds(runs) {
  const samples = {};
  for (const run of runs) for (const [unit, value] of Object.entries(run)) (samples[unit] ??= []).push(value);
  return Object.fromEntries(Object.entries(samples).sort(([a], [b]) => a.localeCompare(b)).map(([unit, values]) => [unit, Math.round(median(values) * 10) / 10]));
}

/** The JSON tests/e2e-shards.json holds. */
export function shardPlan(seconds, shardCount, source) {
  return { source, shardCount, seconds, shards: balance(seconds, shardCount) };
}
