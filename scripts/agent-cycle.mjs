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

const codexCommand = process.env.CODEX_CLI || (process.platform === "win32" ? join(process.env.APPDATA || "", "npm", "codex.ps1") : "codex");
const codexScript = process.platform === "win32" ? join(resolve(codexCommand, ".."), "node_modules", "@openai", "codex", "bin", "codex.js") : codexCommand;
if (!dryRun && process.platform === "win32" && !existsSync(codexScript)) {
  fail(`Codex CLI was not found at ${codexScript}. Set CODEX_CLI to its executable path.`);
}

for (let cycle = 1; cycle <= cycleCount; cycle += 1) {
  const runId = `${timestamp()}-cycle-${cycle}`;
  const runDir = join(root, ".agents", "runs", runId);
  mkdirSync(runDir, { recursive: true });
  writeFileSync(join(runDir, "00-manifest.md"), createManifest(runId, cycle), "utf8");

  console.log(`\nAgent cycle ${cycle}/${cycleCount}: ${runId}`);
  for (let index = startIndex; index < roles.length; index += 1) {
    const role = roles[index];
    const reportPath = join(runDir, role.report);
    const prompt = createPrompt(role, reportPath, runDir, cycle);
    console.log(`- ${role.id}`);

    if (dryRun) {
      writeFileSync(join(runDir, `${String(index + 1).padStart(2, "0")}-${role.id}.prompt.md`), prompt, "utf8");
      continue;
    }

    await runCodex(prompt, reportPath);
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

function runCodex(prompt, reportPath) {
  return new Promise((resolvePromise, reject) => {
    const commandArgs = process.platform === "win32"
      ? ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", codexCommand, "exec", "-s", "workspace-write", "-a", "never", "--ephemeral", "-C", root, "-o", reportPath, "-"]
      : ["exec", "-s", "workspace-write", "-a", "never", "--ephemeral", "-C", root, "-o", reportPath, "-"];
    const child = spawn(process.platform === "win32" ? process.execPath : codexCommand, process.platform === "win32" ? [codexScript, ...commandArgs.slice(5)] : commandArgs, {
      cwd: root,
      stdio: ["pipe", "inherit", "inherit"],
      windowsHide: true,
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolvePromise();
      else reject(new Error(`codex exec exited with code ${code}`));
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
