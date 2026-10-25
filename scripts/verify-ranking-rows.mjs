/**
 * Server checks, phase 2: the read-only checker (서버검증-설계안.md, the 10-21
 * answers). It reads ranking runs -- each `season-final` row with the run's
 * case rows -- and works out again what the page claimed (src/rankingRecheck.js):
 * the score from the decision log, every window that carries a replay record,
 * a sealed card cashed below its seal, and a response time off the window
 * clock. Phase 3 (S6) adds the chain (src/chainRecheck.js): each case's
 * decisions and the run's counters from one case to the next. It prints the
 * marks it would add to each ranking row (`score-off-log`, `window-off-replay`,
 * `window-no-replay`, `chain-off-log`) and why. It writes nothing itself.
 *
 *   node scripts/verify-ranking-rows.mjs rows.json [more.json ...] [--json]
 *       each file is an array of playtest_sessions rows (or `{ "rows": [...] }`),
 *       as the Supabase table editor or SQL editor exports them: `run_id`,
 *       `case_id`, `summary`, `decision_log`, `resources`, `dynamics`. The
 *       files are read as one list (the CI job reads one file per run).
 *
 *   The CI read (.github/workflows/verify-ranking.yml) goes through
 *   `supabase db query --linked` (the Management API, with the
 *   SUPABASE_ACCESS_TOKEN Migration Drift uses: the way the test week reads
 *   the live data), split so that no answer holds more than one run (a run is
 *   up to 55 case rows with their logs; 서버검증-설계안.md, S6):
 *   node scripts/verify-ranking-rows.mjs --runs-sql [--limit=20] [--per-board=10]
 *       prints the one read-only SELECT that lists the top `limit` ranked
 *       runs (run_id only) and, beside them, each open hall of fame board's
 *       first `per-board` seasons that could stand in it (src/hallOfFame.js:
 *       complete, no mark but the checker's own; a week's board until it is
 *       settled). Its JSON output is runs.json. --per-board=0 lists the top
 *       `limit` alone.
 *   node scripts/verify-ranking-rows.mjs --run-count runs.json
 *       prints how many runs runs.json lists.
 *   node scripts/verify-ranking-rows.mjs --run-sql runs.json --at=N
 *       prints the one read-only SELECT that fetches every row of the N-th
 *       run (from 1) runs.json lists. Its JSON output is a rows file. The run
 *       id goes from file to file and is never printed to the log.
 *   node scripts/verify-ranking-rows.mjs --remote [--limit=20] [--json]
 *       the same read by REST, GET only, with SUPABASE_URL and
 *       SUPABASE_SERVICE_ROLE_KEY from the environment. The case rows are not
 *       public (anon reads only public_rankings, which has no decision log), so
 *       this needs the service key, which is not on this machine. It reads
 *       the top `limit` alone, not each board's candidates.
 *
 *   node scripts/verify-ranking-rows.mjs rows.json --marks-sql
 *       prints the one statement that writes each checked run's marks
 *       (ranking_set_recheck_marks), for the CI job to run the same way;
 *       nothing when no run was checked. It names run ids: never printed in CI.
 *
 * The hall of fame (D2, src/hallOfFame.js), from the same check:
 *   node scripts/verify-ranking-rows.mjs --hall-of-fame-counts-sql
 *       prints the one read-only SELECT of each board's count of seasons with
 *       no mark, over the whole board (hall_of_fame_counts), for the CI job to
 *       run after the marks. Its JSON output is counts.json.
 *   node scripts/verify-ranking-rows.mjs rows.json --hall-of-fame --counts=counts.json
 *       prints the day's boards and why each run left out was left out, by
 *       run tag only (for the Job Summary). Without --counts every board
 *       counts 0 and keeps no place.
 *   node scripts/verify-ranking-rows.mjs rows.json --hall-of-fame-sql --counts=counts.json
 *       prints the one statement that writes them (hall_of_fame_settle), for
 *       the CI job to run right after the marks. Run tags only.
 *   node scripts/verify-ranking-rows.mjs --hall-of-fame-read-sql
 *       prints the one read-only SELECT of public_hall_of_fame.
 *   node scripts/verify-ranking-rows.mjs --hall-of-fame-md view.json
 *       prints the page for the `hall-of-fame` branch from that SELECT's answer.
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

import { recheckChain, UNCHECKED } from "../src/chainRecheck.js";
import { RULES_MARK } from "../src/gauntlet/gauntletEngine.js";
import {
  CHECKER_MARK_LIST,
  formatHallOfFameMarkdown,
  HALL_OF_FAME_CANDIDATES,
  HALL_OF_FAME_COUNTS_SQL,
  HALL_OF_FAME_READ_SQL,
  hallOfFameBoardLabel,
  hallOfFameSql,
  pickHallOfFame,
  readHallOfFame,
  readHallOfFameCounts,
} from "../src/hallOfFame.js";
import { recheckRun } from "../src/rankingRecheck.js";

// `suspicion` is the insert trigger's marks on the ranking row: the hall of
// fame (src/hallOfFame.js) takes a season the trigger did not mark either.
const SELECT = "run_id,run_tag,case_id,summary,decision_log,resources,dynamics,completed_at,suspicion";
const JSON_COLUMNS = ["summary", "decision_log", "resources", "dynamics"];

const quote = (text) => `'${String(text).replace(/'/g, "''")}'`;

/**
 * The CI read's first half, for `supabase db query`: one SELECT and nothing
 * else -- the top `limit` ranked runs, by the ranking's own score, and with
 * `perBoard` each hall of fame board's first `perBoard` candidates
 * (src/hallOfFame.js): the board is the season's week, or the table's when it
 * has none; a candidate is a complete season with no mark but the checker's
 * own (today's check states those again), on a board not yet settled
 * (hall_of_fame_boards). The count the threshold needs is read apart, over
 * the whole board (HALL_OF_FAME_COUNTS_SQL), so only what may take a place is
 * replayed.
 */
export function rankingRunsSql({ limit = 20, perBoard = 0 } = {}) {
  const top = Math.min(500, Math.max(1, Math.trunc(Number(limit)) || 20));
  const each = Math.min(100, Math.max(0, Math.trunc(Number(perBoard)) || 0));
  if (!each) {
    return [
      "select run_id from public.playtest_sessions",
      " where case_id = 'season-final' and score is not null and run_id is not null",
      ` order by score desc limit ${top};`,
    ].join("\n");
  }
  const checkerMarks = `array[${CHECKER_MARK_LIST.map(quote).join(", ")}]::text[]`;
  return [
    "select run_id from (",
    "  select s.run_id, s.score,",
    "         row_number() over (order by s.score desc) as overall,",
    "         row_number() over (partition by k.board, c.candidate order by s.score desc, s.completed_at) as on_board,",
    "         c.candidate",
    "    from public.playtest_sessions s",
    "   cross join lateral (select case when s.summary->>'week' ~ '^[0-9]{4}-W(0[1-9]|[1-4][0-9]|5[0-3])$' then s.summary->>'week' else 'table' end as board) k",
    "   cross join lateral (select coalesce(s.summary->>'seasonComplete' = 'true'",
    `                              and s.suspicion <@ ${checkerMarks}`,
    "                              and not exists (select 1 from public.hall_of_fame_boards h where h.board = k.board and h.settled_at is not null), false) as candidate) c",
    "   where s.case_id = 'season-final' and s.score is not null and s.run_id is not null",
    ") ranked",
    ` where overall <= ${top} or (candidate and on_board <= ${each})`,
    " order by score desc;",
  ].join("\n");
}

/** The second half, once per run: one SELECT of every row of `runId`. */
export function runRowsSql(runId) {
  if (typeof runId !== "string" || !runId) throw new TypeError("A run id is a non-empty string.");
  return [
    `select ${SELECT.split(",").join(", ")}`,
    "  from public.playtest_sessions",
    ` where run_id = ${quote(runId)}`,
    " order by case_id;",
  ].join("\n");
}

/** The run ids of the first half's answer (runs.json), each once, in its order. */
export function readRunIds(text) {
  return [...new Set(readRows(text).map((row) => row?.run_id).filter((id) => typeof id === "string" && id))];
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

/**
 * Every ranked run among `rows` (one with a `season-final` row), checked:
 * worked out again (recheckRun, phase 2) and chained (recheckChain, phase 3).
 * The run's `marks` are both checkers' together, because
 * ranking_set_recheck_marks states the four checker marks whole and drops one
 * not passed: the chain's mark has to travel in the same call as phase 2's
 * (marksSql writes one tuple per run). A run under other table rules is
 * neither worked out nor chained, and not written.
 */
export function verifyRows(rows) {
  const results = [];
  for (const [runId, runRows] of groupByRun(rows)) {
    const ranking = runRows.find((row) => row.case_id === "season-final");
    if (!ranking) continue;
    const recheck = recheckRun(runRows);
    const chain = recheck.status === "unverified" ? null : recheckChain(runRows);
    const marks = [...recheck.marks, ...(chain?.marks ?? [])];
    results.push({ runId, runTag: ranking.run_tag ?? null, score: ranking.summary?.burstScore ?? null, caseRows: runRows.length - 1, ...recheck, marks, chain });
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
    if (result.status === "unrecorded") lines.push(`${head}  not replayed: no window carries a record (a build before the record); scores read`);
    // A run not replayed shows its scores' marks here; the chain's own line follows.
    const shown = result.status === "unrecorded" ? result.marks.filter((mark) => !result.chain?.marks.includes(mark)) : result.marks;
    lines.push(`${result.status === "unrecorded" ? "  scores:" : head}  ${shown.length ? `marks: ${shown.join(", ")}` : "no marks"}`);
    if (result.rankingDiffers.length) lines.push(`  ranking row differs from the case rows (score: their mean; the rest: the final case row): ${result.rankingDiffers.join(", ")}`);
    let unrecorded = 0;
    let seedTails = 0;
    for (const entry of result.cases) {
      unrecorded += entry.windows.counts.unrecorded;
      seedTails += entry.windows.seedTails ?? 0;
      if (entry.score.status !== "match") lines.push(`  ${entry.caseId}: score ${entry.score.status}${entry.score.differs.length ? ` (${entry.score.differs.join(", ")})` : ""}`);
      for (const finding of entry.windows.findings) {
        lines.push(`  ${entry.caseId} #${finding.index}: window ${finding.status} ${[...finding.differs, finding.problem].filter(Boolean).join(", ")}`);
      }
    }
    if (unrecorded) lines.push(`  ${unrecorded} windows carry no replay record`);
    if (seedTails) lines.push(`  ${seedTails} windows were dealt again (a seed with a ~n tail: a rolled-back save, or a wall shopped for)`);
    if (result.chain) lines.push(...formatChain(result.chain));
  }
  return lines;
}

/**
 * The chain's lines of a run's block. What the chain could not check is said,
 * never passed: the settlement inside a case waits for S2 to be played here,
 * and a case whose opening state has no snapshot to be read against (S3,
 * `dynamics.open`) is counted as not checked ("사슬 검증 안 함").
 */
export function formatChain(chain) {
  const { cases, unchecked } = chain;
  if (chain.status === "unchecked") return ["  chain: not checked (no case row to chain)"];
  const lines = [`  chain: ${chain.status}, ${cases.length} cases, ${cases.length - unchecked.links} links read${chain.marks.length ? `  marks: ${chain.marks.join(", ")}` : ""}`];
  for (const found of chain.breaks.slice(0, 10)) {
    const where = found.where === "inside" ? `${found.case} entry ${found.entry}` : found.where === "between" ? `${found.after ?? "start"} -> ${found.case}` : found.case;
    const values = found.expected === undefined ? (found.found === undefined ? "" : ` (${JSON.stringify(found.found)})`) : ` (expected ${JSON.stringify(found.expected)}, found ${JSON.stringify(found.found)})`;
    lines.push(`  chain break: ${where} ${found.field}${values}`);
  }
  if (chain.breaks.length > 10) lines.push(`  ... and ${chain.breaks.length - 10} more chain breaks`);
  const notChecked = [];
  if (unchecked.cases) notChecked.push(`${unchecked.cases} cases with no readable log`);
  if (unchecked.links) notChecked.push(`${unchecked.links} links (a gap in the rows, or the counters missing)`);
  const settled = unchecked.fields[UNCHECKED.inside[0]] ?? 0;
  if (settled) notChecked.push(`the settlement of ${settled} cases`);
  // A row from a build before the snapshot (UNCHECKED.open); the board and the
  // route a case opened on wait for the settlement (UNCHECKED.between, S2).
  const opened = unchecked.fields[UNCHECKED.open[0]] ?? 0;
  if (opened) notChecked.push(`the opening state of ${opened} cases (no opening snapshot)`);
  const carried = unchecked.fields[UNCHECKED.between[0]] ?? 0;
  if (carried) notChecked.push(`the board and route ${carried} cases opened on`);
  if (notChecked.length) lines.push(`  chain not checked: ${notChecked.join("; ")}`);
  return lines;
}

/** The day's boards as lines for the Job Summary: run tags only. */
export function formatHallOfFamePick({ boards, left }) {
  const lines = [];
  for (const board of boards) {
    const places = board.places.map((place, index) => `${index + 1}. RUN ${place.run_tag} ${place.score}${place.tags.length ? ` (${place.tags.join(", ")})` : ""}`);
    lines.push(`${hallOfFameBoardLabel(board.board)}: ${board.checked} checked seasons; ${places.length ? places.join("  ") : "표본 부족"}`);
  }
  for (const { runTag, refusal } of left) lines.push(`  left out ${runTag ? `RUN ${runTag}` : "a run"}: ${refusal}`);
  return lines;
}

/**
 * The write that states each run's marks (ranking_set_recheck_marks,
 * 20261023000000): one statement, every run read with the marks it earned,
 * none included, so a run that no longer earns a mark loses it, and whether it
 * was replayed whole (`checked`: its `rechecked_at` is set; `unrecorded`: its
 * scores were read but it is not "checked", so the time is cleared). A run
 * under other table rules is left as it is. Null when there is nothing to write.
 * The function drops every checker mark not passed, so the chain check's mark
 * (CHAIN_MARK, src/chainRecheck.js) travels in each run's marks here, in this
 * one statement, never in a call of its own: verifyRows puts recheckRun's and
 * recheckChain's marks in the same `marks` (S6).
 */
export function marksSql(results) {
  const checked = results.filter((result) => (result.status === "checked" || result.status === "unrecorded") && typeof result.runId === "string" && result.runId);
  if (!checked.length) return null;
  const values = checked.map((result) => `(${quote(result.runId)}, array[${result.marks.map(quote).join(", ")}]::text[], ${result.status === "checked"})`).join(",\n       ");
  return [
    "select count(*) filter (where marks is not null) as marked_rows",
    "  from (select public.ranking_set_recheck_marks(r.run_id, r.marks, r.replayed) as marks",
    `          from (values ${values}) as r(run_id, marks, replayed)) as written;`,
  ].join("\n");
}

async function main(argv) {
  const json = argv.includes("--json");
  const limit = Number(argv.find((arg) => arg.startsWith("--limit="))?.slice(8)) || 20;
  const perBoardArg = argv.find((arg) => arg.startsWith("--per-board="))?.slice(12);
  const perBoard = perBoardArg === undefined ? HALL_OF_FAME_CANDIDATES : Number(perBoardArg);
  const countsFile = argv.find((arg) => arg.startsWith("--counts="))?.slice(9);
  const files = argv.filter((arg) => !arg.startsWith("--"));
  if (argv.includes("--runs-sql")) {
    console.log(rankingRunsSql({ limit, perBoard }));
    return 0;
  }
  if (argv.includes("--hall-of-fame-counts-sql")) {
    console.log(HALL_OF_FAME_COUNTS_SQL);
    return 0;
  }
  if (argv.includes("--hall-of-fame-read-sql")) {
    console.log(HALL_OF_FAME_READ_SQL);
    return 0;
  }
  if (argv.includes("--hall-of-fame-md")) {
    try {
      if (files.length !== 1) throw new Error("Name the one file public_hall_of_fame was read into.");
      process.stdout.write(formatHallOfFameMarkdown(readHallOfFame(readRows(readFileSync(files[0], "utf8")))));
    } catch (error) {
      console.error(error.message);
      return 1;
    }
    return 0;
  }
  let rows;
  let counts = new Map();
  try {
    if (countsFile) counts = readHallOfFameCounts(readRows(readFileSync(countsFile, "utf8")));
    if (argv.includes("--run-count") || argv.includes("--run-sql")) {
      if (files.length !== 1) throw new Error("Name the one runs.json the run list was read into.");
      const runIds = readRunIds(readFileSync(files[0], "utf8"));
      if (argv.includes("--run-count")) {
        console.log(runIds.length);
        return 0;
      }
      const at = Number(argv.find((arg) => arg.startsWith("--at="))?.slice(5));
      if (!Number.isInteger(at) || at < 1 || at > runIds.length) throw new Error(`--at= is a place from 1 to ${runIds.length}.`);
      console.log(runRowsSql(runIds[at - 1]));
      return 0;
    }
    if (argv.includes("--remote")) {
      rows = await fetchRunRows({ url: process.env.SUPABASE_URL, key: process.env.SUPABASE_SERVICE_ROLE_KEY, limit });
    } else {
      if (!files.length) throw new Error("Name a rows.json file, or pass --remote.");
      rows = files.flatMap((file) => readRows(readFileSync(file, "utf8")));
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
  if (argv.includes("--hall-of-fame-sql") || argv.includes("--hall-of-fame")) {
    const picked = pickHallOfFame({ results, rows, rulesMark: RULES_MARK, counts });
    console.log(argv.includes("--hall-of-fame-sql") ? hallOfFameSql(picked.boards) : formatHallOfFamePick(picked).join("\n"));
    return 0;
  }
  console.log(json ? JSON.stringify(results, null, 2) : formatReport(results, { redact: argv.includes("--redact") }).join("\n"));
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = await main(process.argv.slice(2));
}
