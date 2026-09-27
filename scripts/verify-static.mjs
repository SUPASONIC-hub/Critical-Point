/**
 * `npm run verify:static`: every check that needs no browser, run side by side.
 *
 * It used to be one `&&` chain of twenty-two `npm run` hops. Each hop paid for
 * its own npm start-up, the chain stopped at the first failure (so a red lint
 * hid a red balance check behind it), and the checks -- which read files and
 * share nothing -- waited on each other for no reason. Here they run in a small
 * pool, each one's output is held back and printed as a block when it finishes,
 * and the run fails if any of them failed, after all of them have reported.
 *
 * CHECKS is the list. Each entry is an npm script name, and the script in
 * package.json stays the single definition of what the check runs, so
 * `npm run check:x` on its own does exactly what it does here. Add a check by
 * adding its name; order only decides who starts first, so the slow ones lead.
 */
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

export const CHECKS = [
  "test",
  "lint",
  "check:pressure",
  "check:endings",
  "check:balance",
  "check:types",
  "check:dialogue",
  "check:graph",
  "check:runtime-budget",
  "check:views",
  "check:constants",
  "check:text",
  "check:plain-language",
  "check:encoding",
  "check:css",
  "check:css-structure",
  "format:check",
  "check:art",
  "check:export-schema",
  "check:test-storage",
  "check:visual-baselines",
  "check:node",
  "check:grants",
];

const root = process.cwd();
const scripts = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8")).scripts ?? {};
const missing = CHECKS.filter((name) => !scripts[name]);
if (missing.length) {
  console.error(`verify:static names checks package.json does not define: ${missing.join(", ")}`);
  process.exit(1);
}

const argv = process.argv.slice(2);
const only = argv.filter((arg) => !arg.startsWith("--"));
const selected = only.length ? CHECKS.filter((name) => only.includes(name)) : CHECKS;
const jobsArg = argv.find((arg) => arg.startsWith("--jobs="));
const poolSize = Math.max(1, Number(jobsArg?.slice(7)) || Math.min(selected.length, os.availableParallelism?.() ?? os.cpus().length));
const inCi = Boolean(process.env.CI);

// What `npm run` would add: the local binaries first on PATH. The key is looked
// up case-insensitively because Windows spells it `Path`.
const pathKey = Object.keys(process.env).find((key) => key.toUpperCase() === "PATH") ?? "PATH";
const env = {
  ...process.env,
  [pathKey]: [path.join(root, "node_modules", ".bin"), process.env[pathKey]].join(path.delimiter),
  FORCE_COLOR: process.env.FORCE_COLOR ?? (process.stdout.isTTY ? "1" : "0"),
};

function run(name) {
  return new Promise((resolve) => {
    const startedAt = Date.now();
    const chunks = [];
    const child = spawn(scripts[name], { cwd: root, env, shell: true, stdio: ["ignore", "pipe", "pipe"] });
    child.stdout.on("data", (chunk) => chunks.push(chunk));
    child.stderr.on("data", (chunk) => chunks.push(chunk));
    const finish = (code) =>
      resolve({ name, code, output: Buffer.concat(chunks).toString("utf8").trimEnd(), ms: Date.now() - startedAt });
    child.on("error", (error) => {
      chunks.push(Buffer.from(String(error)));
      finish(1);
    });
    child.on("close", (code) => finish(code ?? 1));
  });
}

function report(result) {
  const status = result.code === 0 ? "ok  " : "FAIL";
  const header = `${status} ${result.name} (${(result.ms / 1000).toFixed(1)}s)`;
  // A passing check is one line; its output is only worth reading when it failed
  // or when asked for.
  const showBody = result.code !== 0 || process.env.VERIFY_VERBOSE;
  if (inCi) {
    console.log(`::group::${header}`);
    if (result.output) console.log(result.output);
    console.log("::endgroup::");
    if (result.code !== 0) console.log(`::error title=verify:static::${result.name} failed (exit ${result.code})`);
    return;
  }
  console.log(header);
  if (showBody && result.output) console.log(result.output.replace(/^/gm, "  | "));
}

const startedAt = Date.now();
const queue = [...selected];
const results = [];
async function worker() {
  while (queue.length) {
    const result = await run(queue.shift());
    results.push(result);
    report(result);
  }
}
await Promise.all(Array.from({ length: Math.min(poolSize, selected.length) }, worker));

const failed = results.filter((result) => result.code !== 0);
const seconds = ((Date.now() - startedAt) / 1000).toFixed(1);
console.log(
  `\nverify:static: ${results.length - failed.length}/${results.length} passed in ${seconds}s ` +
    `(${poolSize} at a time).${failed.length ? ` Failed: ${failed.map((result) => result.name).join(", ")}.` : ""}`,
);
process.exitCode = failed.length ? 1 : 0;
