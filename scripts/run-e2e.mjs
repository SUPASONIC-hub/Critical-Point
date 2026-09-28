import { spawn } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { createServer } from "node:net";
import path from "node:path";

/**
 * Starts a server for this working tree on a free port, runs Playwright (or the
 * runtime smoke) against it, and stops the server.
 *
 *   (default)   the vite dev server, and the default e2e list
 *   --preview   `vite preview` over `dist/` -- the production build, which is
 *               what deploys. `npm run build` first. Debug tools are compiled
 *               out of that build, so without an explicit spec it runs only
 *               the tests tagged @prod, the ones that play from the intro.
 *   --runtime   scripts/runtime-smoke.mjs instead of Playwright
 *   --full      the weekly full-coverage and layout-sweep specs
 *   --season    the continuous season walk (@season-full), case 1 to the ending
 *   --segments  only the season walk in segments (@season-segment), split
 *               test by test so `--shard` spreads them
 *   --skip-segments  the default list without those segments; CI runs the two
 *               halves as separate jobs
 *   --webkit    the WebKit project (iPhone 14) instead of the two Chromium
 *               ones. It is not part of a default run yet: see the note on
 *               DEFAULT_PROJECTS
 *   --list      load every spec and list its tests, against no server. A spec
 *               that cannot be loaded fails here, on the push, instead of in
 *               the weekly tier where nobody is looking
 *   --docker    re-run this command inside the pinned Playwright container, so
 *               screenshots are rendered by the same fonts and browser build
 *               that CI records baselines with. Needs Docker.
 *
 * Everything else is handed to `playwright test`, so `--shard=1/3`,
 * `--update-snapshots`, `--project=chromium` and spec paths all work.
 */

// The one Playwright image the visual baselines are recorded and compared in.
// `npm run check:visual-baselines` fails when its version is not the locked
// @playwright/test version, and the Visual Regression workflow pins the same tag.
const PLAYWRIGHT_IMAGE =
  "mcr.microsoft.com/playwright:v1.62.1-noble@sha256:dcc5531e97840b9b5e794f2814476b21571c5124a3fca2267d73041f56e7580e";

const MODE_FLAGS = ["--full", "--runtime", "--preview", "--season", "--docker", "--segments", "--skip-segments", "--list", "--webkit"];
const argv = process.argv.slice(2);
const has = (flag) => argv.includes(flag);
const runFullCoverage = has("--full");
const runRuntimeSmoke = has("--runtime");
const usePreview = has("--preview");
const runSeasonWalk = has("--season");
const runSegments = has("--segments");
const skipSegments = has("--skip-segments");
const forwardedArgs = argv.filter((arg) => !MODE_FLAGS.includes(arg));
const hasExplicitTestTarget = forwardedArgs.some((arg) => arg.endsWith(".spec.js") || arg.startsWith("tests/"));
const root = process.cwd();

function spawnCommand(command, args, options = {}) {
  let executable = command;
  let nextArgs = args;
  if (command === "npx" && args[0] === "vite") {
    executable = process.execPath;
    nextArgs = ["node_modules/vite/bin/vite.js", ...args.slice(1)];
  } else if (command === "npx" && args[0] === "playwright") {
    executable = process.execPath;
    nextArgs = ["node_modules/@playwright/test/cli.js", ...args.slice(1)];
  }
  return spawn(executable, nextArgs, {
    stdio: options.stdio ?? "inherit",
    shell: false,
    env: { ...process.env, ...options.env },
  });
}

function exitCodeOf(child) {
  return new Promise((resolve) => {
    child.on("exit", (code) => resolve(code ?? 1));
    child.on("error", (error) => {
      console.error(String(error));
      resolve(1);
    });
  });
}

if (has("--list")) {
  // Every spec in tests/, not the default list: the specs outside it are the
  // ones this exists for. `full-coverage.spec.js` failed to load for four
  // weekly runs in a row, and took the layout sweep in the same invocation
  // down with it, while every push stayed green.
  const listing = spawnCommand("npx", ["playwright", "test", "--list", ...forwardedArgs], { stdio: ["ignore", "pipe", "pipe"] });
  let output = "";
  listing.stdout.on("data", (chunk) => (output += chunk));
  listing.stderr.on("data", (chunk) => (output += chunk));
  const code = await exitCodeOf(listing);
  const total = output.match(/Total: (\d+) tests? in (\d+) files?/);
  const specs = readdirSync(path.join(root, "tests")).filter((entry) => entry.endsWith(".spec.js"));
  if (code !== 0 || !total || Number(total[2]) !== specs.length) {
    // Playwright prints the listing and the load errors together; the listing
    // is a thousand lines and the error is the five that matter.
    const listed = new Set([...output.matchAll(/› ([\w.-]+\.spec\.js):/g)].map((match) => match[1]));
    const unloaded = specs.filter((spec) => !listed.has(spec));
    console.error(output.split(/\r?\n/).filter((line) => !/^\s+\[[\w-]+\] ›/.test(line)).join("\n").trim());
    console.error(
      `\nplaywright --list: ${total ? `${total[2]} of ${specs.length} spec files loaded` : "no listing"}` +
        `${unloaded.length ? `; not loaded: ${unloaded.join(", ")}` : ""}.`,
    );
    process.exit(code || 1);
  }
  console.log(`Every spec loads: ${total[1]} tests in ${total[2]} files.`);
  process.exit(0);
}

if (has("--docker")) {
  // The working tree is mounted as it is; node_modules is not, because the
  // host's native binaries (esbuild, rollup) are the wrong platform inside the
  // container. A named volume keeps the Linux install between runs.
  const inner = ["node", "scripts/run-e2e.mjs", ...argv.filter((arg) => arg !== "--docker")]
    .map((arg) => `'${arg.replace(/'/g, "'\\''")}'`)
    .join(" ");
  const docker = spawn(
    "docker",
    [
      "run",
      "--rm",
      "--ipc=host",
      "-e",
      "CI",
      "-v",
      `${root}:/work`,
      "-v",
      "critical-point-e2e-node-modules:/work/node_modules",
      "-w",
      "/work",
      PLAYWRIGHT_IMAGE,
      "bash",
      "-c",
      `set -euo pipefail; npm ci --ignore-scripts --no-audit --no-fund; ${inner}`,
    ],
    { stdio: "inherit", shell: false },
  );
  process.exit(await exitCodeOf(docker));
}

/**
 * The suite used to pin 5197. `--strictPort` then made our own vite exit when
 * something already held it, and `waitForServer` attached to whatever was
 * answering -- which, when the squatter was another checkout's dev server,
 * passed the identity probe below and served that checkout's code to the whole
 * run. A pass then meant nothing about this working tree.
 *
 * Asking the OS for a free port removes the collision instead of detecting it,
 * so two checkouts on one machine can both run verification without agreeing on
 * anything. `E2E_PORT` still pins it for the cases that need a known address --
 * attaching a debugger, or pointing a browser at the run by hand.
 *
 * The probe stays as the second line of defence, for the race between releasing
 * this socket and vite binding it.
 */
async function findFreePort() {
  return new Promise((resolve, reject) => {
    const probe = createServer();
    probe.unref();
    probe.on("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const { port } = probe.address();
      probe.close(() => resolve(port));
    });
  });
}

const port = process.env.E2E_PORT ?? (await findFreePort());
const baseUrl = `http://127.0.0.1:${port}`;

const distIndex = path.join(root, "dist", "index.html");
if (usePreview && !existsSync(distIndex)) {
  console.error("--preview serves dist/, and there is no dist/index.html. Run `npm run build` first.");
  process.exit(1);
}

/**
 * Is the server on this port the one this run started? A dev server answers
 * /@vite/client with a JavaScript module; anything else -- a `vite preview`
 * left running, another checkout's server -- answers the SPA fallback instead,
 * and the suite would then test a build that has no debug tools in it. A
 * preview server has no such endpoint, so it is asked for index.html and has
 * to hand back this tree's dist/index.html byte for byte: the hashed asset
 * names in it are unique to one build.
 */
async function servesThisTree(url) {
  try {
    if (usePreview) {
      const response = await fetch(`${url}/`);
      return response.ok && (await response.text()) === readFileSync(distIndex, "utf8");
    }
    const response = await fetch(`${url}/@vite/client`);
    if (!response.ok) return false;
    return (response.headers.get("content-type") ?? "").includes("javascript");
  } catch {
    return false;
  }
}

async function waitForServer(url, isRunning, timeoutMs = 30_000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (!isRunning()) {
      throw new Error(`The server exited before it served ${url}. What it said on the way out is below.`);
    }
    try {
      const response = await fetch(url);
      if (response.ok) {
        if (await servesThisTree(url)) return;
        throw new Error(
          `${url} is being served by something that is not this run's ${usePreview ? "preview" : "dev"} server. ` +
            `The port was free a moment ago, so something raced us onto it; run this again.`,
        );
      }
    } catch (error) {
      if (error instanceof Error && error.message.startsWith(url)) throw error;
      // Vite is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

function stopProcess(child) {
  if (!child || child.killed) return Promise.resolve();
  if (process.platform === "win32") {
    return new Promise((resolve) => {
      const killer = spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
      const timeout = setTimeout(resolve, 3_000);
      timeout.unref?.();
      killer.on("exit", resolve);
      killer.on("error", resolve);
    });
  }
  return new Promise((resolve) => {
    child.on("exit", resolve);
    child.on("error", resolve);
    setTimeout(resolve, 3_000).unref?.();
    child.kill("SIGTERM");
  });
}

// The default list. The layout ratchets in visual-regression.spec.js are
// measurements, not screenshots; leaving the whole spec to `test:visual` --
// which only greps @visual -- meant nothing ran them.
const DEFAULT_SPECS = [
  "tests/accessibility.spec.js",
  "tests/audio-preference.spec.js",
  "tests/contrast.spec.js",
  "tests/gauntlet-loop.spec.js",
  "tests/save-integrity.spec.js",
  "tests/save-resume.spec.js",
  "tests/season-flow.spec.js",
  "tests/visual-regression.spec.js",
];

// The specs the production build can run: everything tagged @prod, which
// enters from the intro or from a seeded save rather than the debug jump. The
// performance budgets are not in this list: they are timings, and a timing
// taken while two other workers play the game measures the other workers.
// `npm run test:performance` runs them alone.
const PREVIEW_SPECS = [...DEFAULT_SPECS, "tests/production-build.spec.js"];

/**
 * A default run is the two Chromium projects. The WebKit project was added on
 * 2026-09-28 and has only been run on a desktop that was busy with other work,
 * where it could not be told apart from a slow machine: until it has a clean
 * run behind it, it is asked for by name (`--webkit`, `npm run
 * test:e2e:webkit`) and runs in the weekly workflow, so that an unproven
 * browser cannot hold a deploy. An explicit `--project` is taken as given.
 */
const hasExplicitProject = forwardedArgs.some((arg) => arg === "--project" || arg.startsWith("--project="));
const DEFAULT_PROJECTS = hasExplicitProject
  ? []
  : has("--webkit")
    ? ["--project=webkit"]
    : ["--project=chromium", "--project=mobile-chromium"];

// A test that passed on its retry is a test that failed once. `--retries=1`
// alone reports it green; the reporter names it in the log, in an annotation
// and in the job summary.
const REPORTERS = process.env.CI
  ? ["--reporter=html,github,list,./tests/helpers/flaky-reporter.js"]
  : ["--reporter=list,./tests/helpers/flaky-reporter.js"];

function playwrightArgs() {
  if (runFullCoverage) {
    // Test by test, so `--shard` spreads the per-case walks: a shard by file
    // would hand one runner all of full-coverage.spec.js.
    return ["test", "tests/full-coverage.spec.js", "tests/layout-sweep.spec.js", "--project=chromium", "--workers=4", "--fully-parallel", ...REPORTERS, ...forwardedArgs];
  }
  if (runSeasonWalk) {
    // One uninterrupted walk, case 1 to the ending, carrying every resource
    // and flag across all the cases. The per-segment walks that run on every
    // push start each segment from a fresh save, so this is the only test that
    // proves the season holds together end to end. Weekly (Full Coverage).
    return ["test", "tests/season-flow.spec.js", "--grep", "@season-full", "--project=chromium", ...REPORTERS, ...forwardedArgs];
  }
  if (runSegments) {
    // Playwright shards by file unless the run is fully parallel, and the
    // segments are one file: all eight landed on one of three shards and that
    // shard took 17 minutes of a 24-minute suite.
    return [
      "test", "tests/season-flow.spec.js", "--grep", "@season-segment", "--project=chromium", "--fully-parallel",
      ...(process.env.CI ? ["--workers=1", "--retries=1"] : []), ...REPORTERS, ...forwardedArgs,
    ];
  }
  const selection = hasExplicitTestTarget
    ? []
    : usePreview
      ? [...PREVIEW_SPECS, "--grep", "@prod"]
      : // Raster comparison stays in its own workflow and the continuous season
        // walk in the weekly one; the default run takes the measurements and
        // the per-segment walks.
        [...DEFAULT_SPECS, "--grep-invert", skipSegments ? "@visual|@season-full|@season-segment" : "@visual|@season-full"];
  return ["test", ...selection, ...DEFAULT_PROJECTS, ...(process.env.CI ? ["--workers=1", "--retries=1", "--fully-parallel"] : []), ...REPORTERS, ...forwardedArgs];
}

/**
 * The server's own output is held, not shown: a passing run has nothing in it
 * worth reading. It used to be thrown away (`stdio: "ignore"`), so a vite that
 * died on a config error was reported as "something else is probably holding
 * that port", which it never was.
 */
const serverLog = [];
function holdOutput(stream) {
  stream?.on("data", (chunk) => {
    serverLog.push(chunk.toString("utf8"));
    if (serverLog.length > 400) serverLog.splice(0, serverLog.length - 400);
  });
}

// The server this run starts never talks to a real backend. A developer's
// `.env.local` naming the live project would otherwise win over the address
// the specs stub (src/telemetry.js reads VITE_SUPABASE_URL first), and the
// telemetry, ranking and board tests would write to the production database.
// The dev server reads .env files at start, and an empty variable in the
// environment takes precedence over them.
const serverEnv = { VITE_SUPABASE_URL: "", VITE_SUPABASE_ANON_KEY: "", VITE_ENABLE_DEBUG_TOOLS: "" };

const server = usePreview
  ? spawnCommand("npx", ["vite", "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], { stdio: ["ignore", "pipe", "pipe"], env: serverEnv })
  : spawnCommand("npx", ["vite", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], { stdio: ["ignore", "pipe", "pipe"], env: serverEnv });
holdOutput(server.stdout);
holdOutput(server.stderr);
let serverRunning = true;
server.on("exit", () => {
  serverRunning = false;
});
server.on("error", (error) => {
  serverLog.push(String(error));
  serverRunning = false;
});

let exitCode = 1;
try {
  await waitForServer(baseUrl, () => serverRunning);
  const child = runRuntimeSmoke
    ? spawnCommand("node", ["scripts/runtime-smoke.mjs"], { env: { BASE_URL: baseUrl } })
    : spawnCommand("npx", ["playwright", ...playwrightArgs()], {
        env: { E2E_BASE_URL: baseUrl, E2E_SERVER: usePreview ? "preview" : "dev" },
      });
  exitCode = await exitCodeOf(child);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  const said = serverLog.join("").trim();
  console.error(said ? `--- ${usePreview ? "vite preview" : "vite"} output ---\n${said}` : "The server printed nothing before it stopped.");
} finally {
  await stopProcess(server);
}

process.exit(exitCode);
