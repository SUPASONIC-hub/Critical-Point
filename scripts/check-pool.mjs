/**
 * The pool `verify:static` and `check:changed` run their checks in.
 *
 * Each check is a shell command (an npm script's body, read from package.json,
 * so `npm run check:x` on its own does exactly what it does here). They run a
 * few at a time, each one's output is held back and printed as a block when it
 * finishes, and the run fails if any of them failed, after all of them have
 * reported.
 */
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

export function readScripts(root) {
  return JSON.parse(readFileSync(path.join(root, "package.json"), "utf8")).scripts ?? {};
}

/** `--jobs=N` and `--timeout=S` as `verify:static` has always read them. */
export function poolOptions(argv, count) {
  const jobsArg = argv.find((arg) => arg.startsWith("--jobs="));
  const jobs = Math.max(1, Number(jobsArg?.slice(7)) || Math.min(Math.max(count, 1), os.availableParallelism?.() ?? os.cpus().length));
  // The slowest check takes about half a minute on a quiet machine. One that
  // has not finished in five has hung, and without a limit it held the whole
  // run until the job's own timeout, with nothing in the log to say which.
  const timeoutArg = argv.find((arg) => arg.startsWith("--timeout="));
  const timeoutMs = Math.max(1, Number(timeoutArg?.slice(10)) || 300) * 1000;
  return { jobs, timeoutMs };
}

function childEnv(root) {
  // What `npm run` would add: the local binaries first on PATH. The key is
  // looked up case-insensitively because Windows spells it `Path`.
  const pathKey = Object.keys(process.env).find((key) => key.toUpperCase() === "PATH") ?? "PATH";
  return {
    ...process.env,
    [pathKey]: [path.join(root, "node_modules", ".bin"), process.env[pathKey]].join(path.delimiter),
    FORCE_COLOR: process.env.FORCE_COLOR ?? (process.stdout.isTTY ? "1" : "0"),
  };
}

// `shell: true` makes the child a shell, and the check its grandchild; killing
// the shell alone leaves the check running on Windows.
function stop(child) {
  if (process.platform === "win32") spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
  else child.kill("SIGKILL");
}

function run({ name, command, timeoutMs }, { root, env }) {
  return new Promise((resolve) => {
    const startedAt = Date.now();
    const chunks = [];
    const child = spawn(command, { cwd: root, env, shell: true, stdio: ["ignore", "pipe", "pipe"] });
    child.stdout.on("data", (chunk) => chunks.push(chunk));
    child.stderr.on("data", (chunk) => chunks.push(chunk));
    let settled = false;
    const timer = setTimeout(() => {
      chunks.push(Buffer.from(`\n${name} did not finish within ${timeoutMs / 1000}s and was stopped.`));
      stop(child);
      finish(124);
    }, timeoutMs);
    const finish = (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({
        name,
        code,
        output: Buffer.concat(chunks).toString("utf8").replace(/\r\n?/g, "\n").trimEnd(),
        ms: Date.now() - startedAt,
      });
    };
    child.on("error", (error) => {
      chunks.push(Buffer.from(String(error)));
      finish(1);
    });
    child.on("close", (code) => finish(code ?? 1));
  });
}

function report(result, label) {
  const inCi = Boolean(process.env.CI);
  const status = result.code === 0 ? "ok  " : "FAIL";
  const header = `${status} ${result.name} (${(result.ms / 1000).toFixed(1)}s)`;
  // A passing check is one line; its output is only worth reading when it
  // failed or when asked for.
  const showBody = result.code !== 0 || process.env.VERIFY_VERBOSE;
  if (inCi) {
    console.log(`::group::${header}`);
    if (result.output) console.log(result.output);
    console.log("::endgroup::");
    if (result.code !== 0) console.log(`::error title=${label}::${result.name} failed (exit ${result.code})`);
    return;
  }
  console.log(header);
  if (showBody && result.output) console.log(result.output.replace(/^/gm, "  | "));
  // A check that passed with something to say still says it: a line it printed
  // as `warning:` is shown, where the rest of a passing check's output is not.
  else if (/^warning:/im.test(result.output)) {
    console.log(result.output.split("\n").filter((line) => /^warning:/i.test(line)).join("\n").replace(/^/gm, "  | "));
  }
}

/**
 * Run `tasks` ({ name, command, timeoutMs? }) `jobs` at a time and print the
 * summary line. Resolves to the failed results; sets no exit code itself.
 */
export async function runPool(tasks, { root, jobs, timeoutMs, label }) {
  const env = childEnv(root);
  const startedAt = Date.now();
  const queue = tasks.map((task) => ({ timeoutMs, ...task }));
  const results = [];
  async function worker() {
    while (queue.length) {
      const result = await run(queue.shift(), { root, env });
      results.push(result);
      report(result, label);
    }
  }
  await Promise.all(Array.from({ length: Math.min(jobs, tasks.length) }, worker));
  const failed = results.filter((result) => result.code !== 0);
  const seconds = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log(
    `\n${label}: ${results.length - failed.length}/${results.length} passed in ${seconds}s ` +
      `(${jobs} at a time).${failed.length ? ` Failed: ${failed.map((result) => result.name).join(", ")}.` : ""}`,
  );
  return failed;
}
