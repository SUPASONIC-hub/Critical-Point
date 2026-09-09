import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { execFileSync, spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const cycleCount = readNumberFlag("--cycles", 1);
const fromRole = readStringFlag("--from", "pm");
const taskBrief = readStringFlag("--brief", "");
const provider = readStringFlag("--provider", process.env.AGENT_PROVIDER || "codex");
const agentModel = readStringFlag("--model", process.env.AGENT_MODEL || "");
const codexSandbox = process.env.CODEX_SANDBOX || "workspace-write";

const roles = [
  { id: "pm", file: "pm.md", report: "01-pm.md" },
  { id: "planner", file: "planner.md", report: "02-planner.md" },
  { id: "design", file: "design.md", report: "03-design.md" },
  { id: "sound", file: "sound.md", report: "04-sound.md" },
  { id: "dba", file: "dba.md", report: "05-dba.md" },
  { id: "developer", file: "developer.md", report: "06-developer.md" },
  { id: "qa", file: "qa.md", report: "07-qa.md" },
];

const startIndex = roles.findIndex(({ id }) => id === fromRole);
if (startIndex < 0) fail(`Unknown role "${fromRole}". Use: ${roles.map(({ id }) => id).join(", ")}`);
if (!Number.isInteger(cycleCount) || cycleCount < 1 || cycleCount > 10) {
  fail("--cycles must be an integer from 1 to 10");
}

const initialStatus = gitStatus();
if (initialStatus && !dryRun) {
  fail("working tree is not clean; review or stash existing changes before starting an agent cycle");
}

const runners = { codex: resolveCodexRunner, claude: resolveClaudeRunner };
if (!Object.hasOwn(runners, provider)) {
  fail(`Unknown provider "${provider}". Use: ${Object.keys(runners).join(", ")}`);
}
const runner = runners[provider]();

for (let cycle = 1; cycle <= cycleCount; cycle += 1) {
  const runId = `${timestamp()}-cycle-${cycle}`;
  const runDir = join(root, ".agents", "runs", runId);
  mkdirSync(runDir, { recursive: true });
  writeFileSync(join(runDir, "00-manifest.md"), createManifest(runId, cycle), "utf8");

  console.log(`\nAgent cycle ${cycle}/${cycleCount}: ${runId} (${provider})`);
  for (let index = startIndex; index < roles.length; index += 1) {
    const role = roles[index];
    const reportPath = join(runDir, role.report);
    const prompt = createPrompt(role, reportPath, runDir, cycle);
    console.log(`- ${role.id}`);

    if (dryRun) {
      writeFileSync(join(runDir, `${String(index + 1).padStart(2, "0")}-${role.id}.prompt.md`), prompt, "utf8");
      continue;
    }

    await runAgent(prompt, reportPath);
    if (!existsSync(reportPath)) {
      fail(`${role.id} did not produce ${role.report}`);
    }

    if (role.id !== "developer" && role.id !== "qa" && gitStatus() !== initialStatus) {
      fail(`${role.id} changed the working tree; read-only roles may only write inside ${runDir}`);
    }

    if (role.id === "qa") {
      const qa = readFileSync(reportPath, "utf8").trimStart();
      if (qa.startsWith("FAIL")) {
        console.error(`QA failed. Review ${reportPath}`);
        process.exitCode = 2;
        break;
      }
    }
  }
  if (dryRun) console.log(`Dry run artifacts: ${runDir}`);
}

function createManifest(runId, cycle) {
  return `# Agent Cycle ${runId}\n\n- cycle: ${cycle}\n- created: ${new Date().toISOString()}\n- policy: .agents/AGENTS.md\n- task brief: ${taskBrief || "PM selects the next improvement"}\n- result: review 07-qa.md before committing\n`;
}

function createPrompt(role, reportPath, runDir, cycle) {
  const upstream = roles
    .filter(({ report }) => existsSync(join(runDir, report)))
    .map(({ report }) => join(runDir, report))
    .join("\n");
  return `You are the ${role.id} agent in improvement cycle ${cycle} for this repository.\n\n` +
    `Read .agents/AGENTS.md and .agents/roles/${role.file} first.\n` +
    `Repository: ${root}\nRun directory: ${runDir}\nYour report must be written to: ${reportPath}\n` +
    `Task brief from the user: ${taskBrief || "No explicit brief; PM should select one measurable improvement."}\n` +
    (upstream ? `Read these upstream reports before acting:\n${upstream}\n` : "") +
    "Do not ask the user for routine choices. Make conservative assumptions and record them. " +
    "Do not commit, push, reset, checkout, install packages, apply remote migrations, or access secrets. " +
    "When your role is complete, write the report to the exact path above and summarize the result in your final response.";
}

function resolveCodexRunner() {
  const command = process.env.CODEX_CLI || (process.platform === "win32" ? join(process.env.APPDATA || "", "npm", "codex.ps1") : "codex");
  const script = process.platform === "win32" ? join(resolve(command, ".."), "node_modules", "@openai", "codex", "bin", "codex.js") : command;
  if (!dryRun && process.platform === "win32" && !existsSync(script)) {
    fail(`Codex CLI was not found at ${script}. Set CODEX_CLI to its executable path.`);
  }
  return {
    file: process.platform === "win32" ? process.execPath : command,
    buildArgs: (reportPath) => [
      ...(process.platform === "win32" ? [script] : []),
      "--ask-for-approval",
      "never",
      "exec",
      "-s",
      codexSandbox,
      "--ephemeral",
      "-C",
      root,
      ...(agentModel ? ["-m", agentModel] : []),
      "-o",
      reportPath,
      "-",
    ],
    capturesReport: false,
  };
}

function resolveClaudeRunner() {
  const command = process.env.CLAUDE_CLI || (process.platform === "win32"
    ? join(process.env.APPDATA || "", "npm", "node_modules", "@anthropic-ai", "claude-code", "bin", "claude.exe")
    : "claude");
  if (!dryRun && process.platform === "win32" && !existsSync(command)) {
    fail(`Claude CLI was not found at ${command}. Set CLAUDE_CLI to its executable path.`);
  }
  return {
    file: command,
    buildArgs: () => ["-p", "--permission-mode", "bypassPermissions", ...(agentModel ? ["--model", agentModel] : [])],
    capturesReport: true,
  };
}

function runAgent(prompt, reportPath) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(runner.file, runner.buildArgs(reportPath), {
      cwd: root,
      stdio: ["pipe", runner.capturesReport ? "pipe" : "inherit", "inherit"],
      windowsHide: true,
    });
    let transcript = "";
    if (runner.capturesReport) {
      child.stdout.setEncoding("utf8");
      child.stdout.on("data", (chunk) => {
        transcript += chunk;
        process.stdout.write(chunk);
      });
    }
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`${provider} exec exited with code ${code}`));
        return;
      }
      if (runner.capturesReport && transcript.trim() && !existsSync(reportPath)) {
        writeFileSync(reportPath, `${transcript.trim()}\n`, "utf8");
      }
      resolvePromise();
    });
    child.stdin.end(prompt);
  });
}

function gitStatus() {
  const result = spawnSyncGit(["status", "--porcelain"]);
  return result.trim();
}

function spawnSyncGit(commandArgs) {

  return execFileSync("git", commandArgs, { cwd: root, encoding: "utf8" });
}

function readNumberFlag(name, fallback) {
  const value = readStringFlag(name, String(fallback));
  return Number(value);
}

function readStringFlag(name, fallback) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] || "" : fallback;
}

function timestamp() {
  return new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
}

function fail(message) {
  console.error(`agent-cycle: ${message}`);
  process.exit(1);
}
