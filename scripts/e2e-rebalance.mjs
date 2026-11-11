import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { medianSeconds, readShardPlan, SHARD_PLAN_PATH, shardPlan, unitSecondsFromLog } from "./e2e-shards.mjs";

/**
 * Lays tests/e2e-shards.json out again from the times CI measured.
 *
 *   npm run e2e:rebalance                       the last 4 green pushes to main
 *   npm run e2e:rebalance -- --runs=41560900359,41561249153
 *   npm run e2e:rebalance -- --log=run.log      a saved `gh run view <id> --log`
 *   npm run e2e:rebalance -- --shards=7         another shard count; the
 *                                               verify-e2e matrix has to match
 *
 * Only the verify-e2e jobs' lines are read. Each run counts once, and a unit's
 * time is its median over the runs. Nothing is fetched with --log.
 */

const argv = process.argv.slice(2);
const value = (name) => argv.find((arg) => arg.startsWith(`--${name}=`))?.slice(name.length + 3);
const logs = argv.filter((arg) => arg.startsWith("--log=")).map((arg) => arg.slice("--log=".length));

const gh = (args) => execFileSync("gh", args, { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });

let sources;
if (logs.length) {
  // A log saved as <run id>.log is named by its run.
  sources = logs.map((file) => ({ name: path.basename(file).replace(/^(\d+)\.log$/, "run $1"), text: readFileSync(file, "utf8") }));
} else {
  const runs = value("runs")
    ? value("runs").split(",").filter(Boolean)
    : JSON.parse(gh(["run", "list", "--workflow", "verify.yml", "--branch", "main", "--event", "push", "--status", "success", "--limit", "4", "--json", "databaseId"])).map((run) => String(run.databaseId));
  if (!runs.length) {
    console.error("No runs to read. Name them with --runs=<id>,<id>, or a saved log with --log=<file>.");
    process.exit(1);
  }
  sources = runs.map((run) => ({ name: `run ${run}`, text: gh(["run", "view", run, "--log"]) }));
}

const perRun = sources.map((source) => ({ ...source, seconds: unitSecondsFromLog(source.text) }));
for (const run of perRun) {
  if (!Object.keys(run.seconds).length) {
    console.error(`${run.name} has no verify-e2e test lines in it. Is it a Verify run that ran the e2e shards?`);
    process.exit(1);
  }
}

const previous = existsSync(SHARD_PLAN_PATH) ? readShardPlan() : null;
const shardCount = Number(value("shards") ?? previous?.shardCount ?? 7);
const seconds = medianSeconds(perRun.map((run) => run.seconds));
const plan = shardPlan(seconds, shardCount, perRun.map((run) => run.name).join(", "));
writeFileSync(SHARD_PLAN_PATH, `${JSON.stringify(plan, null, 2)}\n`);

const minutes = (s) => `${(s / 60).toFixed(1)}m`;
const total = Object.values(seconds).reduce((sum, s) => sum + s, 0);
console.log(`${SHARD_PLAN_PATH}: ${Object.keys(seconds).length} units, ${minutes(total)} in all, from ${plan.source}.`);
console.log(`${shardCount} shards: ${plan.shards.map((shard) => minutes(shard.seconds)).join(" ")}`);
if (previous && previous.shardCount !== shardCount) {
  console.log(`The shard count changed from ${previous.shardCount}: set verify-e2e's matrix in .github/workflows/verify.yml to ${shardCount} shards.`);
}
