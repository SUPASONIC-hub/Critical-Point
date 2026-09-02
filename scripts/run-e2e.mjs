import { spawn } from "node:child_process";

const baseUrl = "http://127.0.0.1:5197";
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

async function waitForServer(url, timeoutMs = 30_000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
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

const server = spawnCommand("npx", ["vite", "--host", "127.0.0.1", "--port", "5197", "--strictPort"], {
  stdio: "ignore",
});

let exitCode;
try {
  await waitForServer(baseUrl);
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
