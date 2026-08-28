import { spawn } from "node:child_process";

const baseUrl = "http://127.0.0.1:5197";
const runFullCoverage = process.argv.includes("--full");
const forwardedArgs = process.argv.slice(2).filter((arg) => arg !== "--full");

function spawnCommand(command, args, options = {}) {
  const useWindowsShell = process.platform === "win32";
  const executable = useWindowsShell ? [command, ...args].join(" ") : command;
  return spawn(executable, useWindowsShell ? [] : args, {
    stdio: options.stdio ?? "inherit",
    shell: useWindowsShell,
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
  if (!child || child.killed) return;
  if (process.platform === "win32") {
    spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
    return;
  }
  child.kill("SIGTERM");
}

const server = spawnCommand("npx", ["vite", "--host", "127.0.0.1", "--port", "5197", "--strictPort"], {
  stdio: "ignore",
});

let exitCode = 1;
try {
  await waitForServer(baseUrl);
  exitCode = await new Promise((resolve) => {
    const testArgs = runFullCoverage
      ? ["playwright", "test", "tests/full-coverage.spec.js", ...forwardedArgs]
      : ["playwright", "test", "--grep-invert", "@full", ...forwardedArgs];
    const runner = spawnCommand("npx", testArgs, {
      env: { E2E_BASE_URL: baseUrl },
    });
    runner.on("exit", (code) => resolve(code ?? 1));
  });
} finally {
  stopProcess(server);
}

process.exit(exitCode);
