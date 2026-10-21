/**
 * Server checks, phase 2: the read-only checker (서버검증-설계안.md, the 10-21
 * answers). It reads ranking runs -- each `season-final` row with the run's
 * case rows -- and works out again what the page claimed (src/rankingRecheck.js):
 * the score from the decision log, every window that carries a replay record,
 * a sealed card cashed below its seal, and a response time off the window
 * clock. It prints the marks it would add to each ranking row
 * (`score-off-log`, `window-off-replay`) and why. It writes nothing itself.
 *
 *   node scripts/verify-ranking-rows.mjs rows.json [--json]
 *       rows.json is an array of playtest_sessions rows (or `{ "rows": [...] }`),
 *       as the Supabase table editor or SQL editor exports them: `run_id`,
 *       `case_id`, `summary`, `decision_log`, `resources`, `dynamics`.
 *   node scripts/verify-ranking-rows.mjs --sql [--limit=20]
 *       prints the one read-only SELECT that fetches the top `limit` ranked
 *       runs with all their rows, for `supabase db query --linked` (the
 *       Management API, with the SUPABASE_ACCESS_TOKEN Migration Drift uses:
 *       the way the test week reads the live data, and the CI job's way,
 *       .github/workflows/verify-ranking.yml). Its JSON output is a rows.json.
 *   node scripts/verify-ranking-rows.mjs --remote [--limit=20] [--json]
 *       the same read by REST, GET only, with SUPABASE_URL and
 *       SUPABASE_SERVICE_ROLE_KEY from the environment. The case rows are not
 *       public (anon reads only public_rankings, which has no decision log), so
 *       this needs the service key, which is not on this machine.
 *
 *   node scripts/verify-ranking-rows.mjs rows.json --marks-sql
 *       prints the one statement that writes each checked run's marks
 *       (ranking_set_recheck_marks), for the CI job to run the same way;
 *       nothing when no run was checked. It names run ids: never printed in CI.
 *
 * --redact names each run by its public tag (`run_tag`, what the ranking
 * shows) instead of its run id, for a log anyone can read (the CI job).
 *
 * Exit code: 0 when the report printed, whatever it found; 1 when the input
 * could not be read.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { recheckRun } from "../src/rankingRecheck.js";

const SELECT = "run_id,run_tag,case_id,summary,decision_log,resources,dynamics,completed_at";
const JSON_COLUMNS = ["summary", "decision_log", "resources", "dynamics"];

/**
 * The read for `supabase db query`: one SELECT and nothing else -- the top
 * `limit` ranked runs (by the ranking's own score) and every row of each.
 */
export function rankingRowsSql({ limit = 20 } = {}) {
  const top = Math.min(500, Math.max(1, Math.trunc(Number(limit)) || 20));
  return [
    "with top_runs as (",
    "  select run_id from public.playtest_sessions",
    "   where case_id = 'season-final' and score is not null and run_id is not null",
    `   order by score desc limit ${top}`,
    ")",
    `select ${SELECT.split(",").join(", ")}`,
    "  from public.playtest_sessions",
    " where run_id in (select run_id from top_runs)",
    " order by run_id, case_id;",
  ].join("\n");
}

/** The rows grouped by run, in the order each run first appears. Rows without a run cannot be ranked and are left out. */
export function groupByRun(rows) {
  const runs = new Map();
  for (const row of rows) {
    if (!row || typeof row.run_id !== "string" || !row.run_id) continue;
    if (!runs.has(row.run_id)) runs.set(row.run_id, []);
    runs.get(row.run_id).push(row);
  }
  return runs;
}

/** Every ranked run among `rows` (one with a `season-final` row), checked. */
export function verifyRows(rows) {
  const results = [];
  for (const [runId, runRows] of groupByRun(rows)) {
    const ranking = runRows.find((row) => row.case_id === "season-final");
    if (!ranking) continue;
    results.push({ runId, runTag: ranking.run_tag ?? null, score: ranking.summary?.burstScore ?? null, caseRows: runRows.length - 1, ...recheckRun(runRows) });
  }
  return results;
}

/** The rows of a JSON export: an array, or an object holding one under `rows`. */
export function readRows(text) {
  const parsed = JSON.parse(text);
  const rows = Array.isArray(parsed) ? parsed : parsed?.rows;
  if (!Array.isArray(rows)) throw new TypeError("The file holds no array of rows (an array, or { rows: [...] }).");
  // A client that writes a jsonb column out as text is read the same.
  const parseText = (value) => (typeof value === "string" ? JSON.parse(value) : value);
  return rows.map((row) => (row && typeof row === "object" ? { ...row, ...Object.fromEntries(JSON_COLUMNS.filter((key) => key in row).map((key) => [key, parseText(row[key])])) } : row));
}

/**
 * The top `limit` ranking runs from the project, by REST, GET only. `fetchFn`
 * is the global fetch outside the tests.
 */
export async function fetchRunRows({ url, key, limit = 20, fetchFn = globalThis.fetch }) {
  if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are not set: the case rows are readable with the service key only.");
  const headers = { apikey: key, Authorization: `Bearer ${key}`, Accept: "application/json" };
  const base = `${url.replace(/\/+$/, "")}/rest/v1/playtest_sessions`;
  const get = async (query) => {
    const response = await fetchFn(`${base}?${query}`, { method: "GET", headers });
    if (!response.ok) throw new Error(`GET playtest_sessions answered ${response.status}.`);
    return response.json();
  };
  const top = await get(`select=run_id&case_id=eq.season-final&order=score.desc.nullslast&limit=${Math.max(1, Math.trunc(limit) || 20)}`);
  const runIds = [...new Set(top.map((row) => row.run_id).filter((id) => typeof id === "string" && id))];
  if (!runIds.length) return [];
  const list = runIds.map((id) => `"${id.replace(/"/g, "")}"`).join(",");
  return get(`select=${SELECT}&run_id=in.(${encodeURIComponent(list)})`);
}

/** The report as lines, one run a block. `redact` names a run by its public tag, or its place. */
export function formatReport(results, { redact = false } = {}) {
  if (!results.length) return ["No ranked run among the rows (none has a season-final row)."];
  const lines = [];
  for (const [place, result] of results.entries()) {
    const name = redact ? (result.runTag ?? `run ${place + 1}`) : result.runId;
    const head = `${name}  score ${result.score ?? "?"}  ${result.caseRows} case rows`;
    if (result.status === "unverified") {
      lines.push(`${head}  not checked: played under other table rules than this engine's`);
      continue;
    }
    lines.push(`${head}  ${result.marks.length ? `marks: ${result.marks.join(", ")}` : "no marks"}`);
    if (result.rankingDiffers.length) lines.push(`  ranking row differs from the final case row: ${result.rankingDiffers.join(", ")}`);
    let unrecorded = 0;
    for (const entry of result.cases) {
      unrecorded += entry.windows.counts.unrecorded;
      if (entry.score.status !== "match") lines.push(`  ${entry.caseId}: score ${entry.score.status}${entry.score.differs.length ? ` (${entry.score.differs.join(", ")})` : ""}`);
      for (const finding of entry.windows.findings) {
        lines.push(`  ${entry.caseId} #${finding.index}: window ${finding.status} ${[...finding.differs, finding.problem].filter(Boolean).join(", ")}`);
      }
    }
    if (unrecorded) lines.push(`  ${unrecorded} windows carry no replay record (written by a build before the record)`);
  }
  return lines;
}

/**
 * The write that states each checked run's marks (ranking_set_recheck_marks,
 * 20261021020000): one statement, every checked run with the marks it earned,
 * none included, so a run that no longer earns a mark loses it. A run not
 * checked (other table rules) is left as it is. Null when there is nothing to write.
 */
export function marksSql(results) {
  const checked = results.filter((result) => result.status === "checked" && typeof result.runId === "string" && result.runId);
  if (!checked.length) return null;
  const quote = (text) => `'${String(text).replace(/'/g, "''")}'`;
  const values = checked.map((result) => `(${quote(result.runId)}, array[${result.marks.map(quote).join(", ")}]::text[])`).join(",\n       ");
  return [
    "select count(*) filter (where marks is not null) as marked_rows",
    "  from (select public.ranking_set_recheck_marks(r.run_id, r.marks) as marks",
    `          from (values ${values}) as r(run_id, marks)) as written;`,
  ].join("\n");
}

async function main(argv) {
  const json = argv.includes("--json");
  const limit = Number(argv.find((arg) => arg.startsWith("--limit="))?.slice(8)) || 20;
  if (argv.includes("--sql")) {
    console.log(rankingRowsSql({ limit }));
    return 0;
  }
  let rows;
  try {
    if (argv.includes("--remote")) {
      rows = await fetchRunRows({ url: process.env.SUPABASE_URL, key: process.env.SUPABASE_SERVICE_ROLE_KEY, limit });
    } else {
      const file = argv.find((arg) => !arg.startsWith("--"));
      if (!file) throw new Error("Name a rows.json file, or pass --remote.");
      rows = readRows(readFileSync(file, "utf8"));
    }
  } catch (error) {
    console.error(error.message);
    return 1;
  }
  const results = verifyRows(rows);
  if (argv.includes("--marks-sql")) {
    const sql = marksSql(results);
    if (sql) console.log(sql);
    return 0;
  }
  console.log(json ? JSON.stringify(results, null, 2) : formatReport(results, { redact: argv.includes("--redact") }).join("\n"));
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = await main(process.argv.slice(2));
}
