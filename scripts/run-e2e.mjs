import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
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

const MODE_FLAGS = ["--full", "--runtime", "--preview", "--season", "--docker"];
const argv = process.argv.slice(2);
const has = (flag) => argv.includes(flag);
const runFullCoverage = has("--full");
const runRuntimeSmoke = has("--runtime");
const usePreview = has("--preview");
const runSeasonWalk = has("--season");
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
      throw new Error(
        `The server exited before it served ${url}. ` +
          `Something else is probably holding that port -- \`--strictPort\` makes vite exit instead of moving.`,
      );
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
  "tests/recovery.spec.js",
  "tests/save-integrity.spec.js",
  "tests/save-resume.spec.js",
  "tests/season-flow.spec.js",
  "tests/visual-regression.spec.js",
];

function playwrightArgs() {
  if (runFullCoverage) {
    return ["test", "tests/full-coverage.spec.js", "tests/layout-sweep.spec.js", "--project=chromium", "--workers=4", ...forwardedArgs];
  }
  if (runSeasonWalk) {
    // One uninterrupted walk, case 1 to the ending, carrying every resource
    // and flag across all the cases. The per-segment walks that run on every
    // push start each segment from a fresh save, so this is the only test that
    // proves the season holds together end to end. Weekly (Full Coverage).
    return ["test", "tests/season-flow.spec.js", "--grep", "@season-full", "--project=chromium", ...forwardedArgs];
  }
  const selection = hasExplicitTestTarget
    ? []
    : usePreview
      ? [...DEFAULT_SPECS, "tests/performance.spec.js", "--grep", "@prod"]
      : // Raster comparison stays in its own workflow and the continuous season
        // walk in the weekly one; the default run takes the measurements and
        // the per-segment walks.
        [...DEFAULT_SPECS, "--grep-invert", "@visual|@season-full"];
  return ["test", ...selection, ...(process.env.CI ? ["--workers=1", "--retries=1"] : []), ...forwardedArgs];
}

const server = usePreview
  ? spawnCommand("npx", ["vite", "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], { stdio: "ignore" })
  : spawnCommand("npx", ["vite", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], { stdio: "ignore" });
let serverRunning = true;
server.on("exit", () => {
  serverRunning = false;
});
server.on("error", () => {
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
} finally {
  await stopProcess(server);
}

process.exit(exitCode);
