import { spawn } from "node:child_process";

// The runner already refuses to test against a server that is not its own, but
// until now it had no way out of a taken port: a second checkout of this repo on
// the same machine could only wait for the first to stop. E2E_PORT moves it.
const port = process.env.E2E_PORT ?? "5197";
const baseUrl = `http://127.0.0.1:${port}`;
const runFullCoverage = process.argv.includes("--full");
const runRuntimeSmoke = process.argv.includes("--runtime");
const forwardedArgs = process.argv.slice(2).filter((arg) => arg !== "--full" && arg !== "--runtime");
const hasExplicitTestTarget = forwardedArgs.some((arg) => arg.endsWith(".spec.js") || arg.startsWith("tests/"));

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

/**
 * A dev server answers /@vite/client with a JavaScript module. Anything else
 * listening on the port -- a `vite preview` left running, another checkout's dev
 * server -- answers the SPA fallback instead, and the suite would then test a
 * build that has no debug tools in it. `--strictPort` makes our own vite exit
 * rather than move, so the only way to tell the two apart is to ask.
 */
async function servesViteDevClient(url) {
  try {
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
        `The dev server exited before it served ${url}. ` +
          `Something else is probably holding that port -- \`--strictPort\` makes vite exit instead of moving.`,
      );
    }
    try {
      const response = await fetch(url);
      if (response.ok) {
        if (await servesViteDevClient(url)) return;
        throw new Error(
          `${url} is being served by something that is not our dev server. ` +
            `Stop whatever is listening on that port (a leftover \`vite preview\` answers here too) and run this again.`,
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

const server = spawnCommand("npx", ["vite", "--host", "127.0.0.1", "--port", port, "--strictPort"], {
  stdio: "ignore",
});
let serverRunning = true;
server.on("exit", () => {
  serverRunning = false;
});
server.on("error", () => {
  serverRunning = false;
});

let exitCode;
try {
  await waitForServer(baseUrl, () => serverRunning);
  exitCode = await new Promise((resolve) => {
    if (runRuntimeSmoke) {
      const smoke = spawnCommand("node", ["scripts/runtime-smoke.mjs"], {
        env: { BASE_URL: baseUrl },
      });
      smoke.on("exit", (code) => resolve(code ?? 1));
      return;
    }
    const testArgs = runFullCoverage
      ? ["playwright", "test", "tests/full-coverage.spec.js", "--project=chromium", "--workers=4", ...forwardedArgs]
      : [
          "playwright",
          "test",
          ...(
            hasExplicitTestTarget
              ? []
              : ["tests/accessibility.spec.js", "tests/contrast.spec.js", "tests/save-integrity.spec.js", "tests/season-flow.spec.js"]
          ),
          ...(process.env.CI ? ["--workers=1", "--retries=1"] : []),
          ...forwardedArgs,
        ];
    const runner = spawnCommand("npx", testArgs, {
      env: { E2E_BASE_URL: baseUrl },
    });
    runner.on("exit", (code) => resolve(code ?? 1));
  });
} finally {
  await stopProcess(server);
}

process.exit(exitCode);
