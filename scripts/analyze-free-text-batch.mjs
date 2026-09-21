/**
 * Offline free-input analysis.
 *
 * The live path in `supabase/functions/analyze-free-text` needs an Anthropic
 * key the project does not have. This runs the same reading over collected play
 * data instead, on a machine that already has Claude Code -- no API key, no
 * production dependency. What it gives up is the in-game reaction; what it
 * keeps is everything the prompt was written to learn: which 집념 the sentences
 * carry, how often players actually reframe, and whether the prompt is any
 * good.
 *
 * It reads the same `prompt.js` the edge function reads and validates with the
 * same `normalizeAnalysis` the browser uses, so a number here means what it
 * would mean in production.
 *
 *   npm run analyze:free-text -- --limit 50
 *   npm run analyze:free-text -- --input playtest-export.json
 */

import { execFile, spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

import { buildUserMessage, SYSTEM_PROMPT } from "../supabase/functions/analyze-free-text/prompt.js";
import { normalizeAnalysis, parseAnalysisJson } from "../src/freeTextAnalysis.js";

const execFileAsync = promisify(execFile);
const PROJECT_REF = "kiazzdbpkazwqhhimdib";
const OUT_DIR = "analysis-out";

function parseArgs(argv) {
  const args = { limit: 100, input: "", out: OUT_DIR };
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    if (flag === "--limit") args.limit = Number(argv[index + 1]) || args.limit;
    if (flag === "--input") args.input = argv[index + 1] ?? "";
    if (flag === "--out") args.out = argv[index + 1] ?? args.out;
  }
  return args;
}

/**
 * The service-role key is never stored. It is asked for at run time through the
 * CLI's own login, which `supabase/.env.local` holds and `.gitignore` keeps out
 * of the repository.
 */
async function getServiceKey() {
  const { stdout } = await execFileAsync(
    "npx",
    ["--yes", "supabase", "projects", "api-keys", "--project-ref", PROJECT_REF, "--output", "json"],
    { shell: true, maxBuffer: 1024 * 1024 },
  );
  const key = JSON.parse(stdout).find((entry) => entry.name === "service_role");
  if (!key) throw new Error("no service_role key on this project");
  return key.api_key;
}

async function fetchSessions(limit) {
  const key = await getServiceKey();
  const query = `select=run_id,case_id,completed_at,decision_log&order=completed_at.desc&limit=${limit}`;
  const response = await fetch(`https://${PROJECT_REF}.supabase.co/rest/v1/playtest_sessions?${query}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!response.ok) throw new Error(`playtest_sessions read failed: ${response.status}`);
  return response.json();
}

/**
 * One card per analysed row. A card already carrying `analysis` was read live
 * and is skipped -- re-reading it would spend a call to learn nothing.
 */
function collectCards(rows) {
  const cards = [];
  for (const row of rows) {
    const log = Array.isArray(row.decision_log) ? row.decision_log : [];
    for (const entry of log) {
      if (!entry?.freeText || entry.analysis) continue;
      cards.push({
        runId: row.run_id ?? "",
        caseId: entry.caseId ?? row.case_id ?? "",
        nodeId: entry.nodeId ?? "",
        choiceId: entry.choiceId ?? "",
        freeText: entry.freeText,
        effect: entry.effect ?? {},
        resources: entry.resourcesBefore ?? {},
      });
    }
  }
  return cards;
}

/**
 * No shell. On Windows the npm `claude` shim is a `.ps1`/`.cmd` pair that
 * cmd.exe cannot always find from a POSIX-style PATH, and reaching for
 * `shell: true` to fix that would put a player's sentence on a command line --
 * an injection waiting for the player who notices. The published bin is a
 * native executable, so spawn it directly and send the prompt over stdin.
 */
function resolveClaude() {
  if (process.env.CLAUDE_CLI) return process.env.CLAUDE_CLI;
  if (process.platform === "win32" && process.env.APPDATA) {
    const bundled = path.join(process.env.APPDATA, "npm/node_modules/@anthropic-ai/claude-code/bin/claude.exe");
    if (existsSync(bundled)) return bundled;
  }
  return "claude";
}

function runClaude(prompt) {
  return new Promise((resolve, reject) => {
    const child = spawn(resolveClaude(), ["-p"], { shell: false });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve(stdout);
      else reject(new Error(stderr.trim().slice(0, 200) || `claude exited ${code}`));
    });
    child.stdin.end(prompt, "utf8");
  });
}

/**
 * Claude Code in headless mode is the runner, because it authenticates as the
 * person at the keyboard rather than as a key the project would have to own.
 */
async function analyse(card) {
  const userMessage = buildUserMessage({
    player_input: card.freeText,
    case_id: card.caseId,
    stage_name: "",
    presented_options: [],
    current_resources: card.resources,
    applied_effect: card.effect,
  });
  const stdout = await runClaude(`${SYSTEM_PROMPT}\n\n---\n\n${userMessage}`);
  return normalizeAnalysis(parseAnalysisJson(stdout));
}

function summarise(results) {
  const scored = results.filter((row) => row.analysis);
  const triggers = {};
  let reframeSum = 0;
  let reframeCount = 0;
  for (const row of scored) {
    const { trigger, reframe } = row.analysis;
    if (trigger) triggers[trigger] = (triggers[trigger] ?? 0) + 1;
    if (typeof reframe === "number") {
      reframeSum += reframe;
      reframeCount += 1;
    }
  }
  return {
    cards: results.length,
    analysed: scored.length,
    failed: results.length - scored.length,
    averageReframe: reframeCount > 0 ? Math.round(reframeSum / reframeCount) : null,
    triggers,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const rows = args.input
    ? [JSON.parse(readFileSync(args.input, "utf8"))].flat()
    : await fetchSessions(args.limit);
  const cards = collectCards(rows);
  if (cards.length === 0) {
    console.log("No unanalysed free-input cards found.");
    return;
  }
  console.log(`Analysing ${cards.length} card(s) with Claude Code...`);

  const results = [];
  for (const [index, card] of cards.entries()) {
    let analysis = null;
    try {
      analysis = await analyse(card);
    } catch (error) {
      console.error(`  ${index + 1}/${cards.length} failed: ${error.message}`);
    }
    results.push({ ...card, analysis });
    process.stdout.write(`\r  ${index + 1}/${cards.length}`);
  }
  process.stdout.write("\n");

  mkdirSync(args.out, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const detail = path.join(args.out, `analysis-${stamp}.jsonl`);
  writeFileSync(detail, results.map((row) => JSON.stringify(row)).join("\n") + "\n", "utf8");

  const summary = summarise(results);
  writeFileSync(path.join(args.out, `summary-${stamp}.json`), JSON.stringify(summary, null, 2), "utf8");
  console.log(`\n${detail}`);
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
