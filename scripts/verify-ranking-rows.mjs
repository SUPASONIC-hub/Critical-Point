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
 *   node scripts/verify-ranking-rows.mjs --runs-sql [--limit=100] [--always=20] [--cap=150] [--all] [--weeks=2026-W47,2026-W46] [--per-board=10]
 *       prints the one read-only SELECT that lists the runs to read: on the
 *       ordinary board and on each named week's board (default this week and
 *       last, in Korean time), the top `limit` the page shows (fetchLeaderboard
 *       reads 100), of them every run the checker has not read yet
 *       (`recheck_seen_at` null: what the page shows as 「확인 중」) and the top
 *       `always` again whatever was read before (a fix to the checker reaches
 *       them the next night), new runs first, `cap` at most (--all: every one
 *       of the top `limit`, read before or not). Beside them, each open hall
 *       of fame board's first `per-board` seasons that could stand in it
 *       (src/hallOfFame.js: complete, no mark but the checker's own; a week's
 *       board until it is settled), read every night within the same `cap`;
 *       --per-board=0 lists the page's boards alone. Its JSON output is
 *       runs.json (run_id, the board, whether it is new, its place: no score,
 *       no name).
 *   node scripts/verify-ranking-rows.mjs --run-count runs.json
 *       prints how many runs runs.json lists.
 *   node scripts/verify-ranking-rows.mjs --runs-summary runs.json
 *       prints, for the public log, how many runs of each board were listed
 *       and how many of them are new (no run id).
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

import { CHAIN_MARK, recheckChain, SETTLED_INSIDE, UNCHECKED } from "../src/chainRecheck.js";
import { isoWeekKey } from "../src/gauntlet/weeklyCalendar.js";
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
import { RECHECK_MARKS, recheckRun, RELIC_DRAFT_MARK } from "../src/rankingRecheck.js";
import { recheckCaseSettlement, recheckOpeningRoute } from "../src/settlementRecheck.js";

/**
 * The marks ranking_set_recheck_marks takes (20261023000000, then 20261103020000).
 * The draft's mark (RELIC_DRAFT_MARK, C9) is among them from the 11-12 ranking
 * wipe (supabase/migrations/20261112000000_ranking_reset_rules_mark4_relic_draft.sql),
 * which adds it to the function's list: the function raises on a mark it does
 * not know, and one run's would stop the whole write.
 */
export const DB_MARKS = Object.freeze([...RECHECK_MARKS, CHAIN_MARK, RELIC_DRAFT_MARK]);

/**
 * The marks that take a ranking row off the public ranking once the owner turns
 * the switch on (`ranking_hide_marked` = 1 in private_settings; the policy of
 * supabase/migrations/*_ranking_hide_switch.sql lists the same ones, and
 * check:grants holds the two together). Every checker mark, and the insert
 * trigger's marks for values no table deals. Not on it, so never hidden:
 * `time-over-gap` (a season delivered late, after playing offline) and
 * `unchecked` (the server's own check failed), the two an honest season can earn.
 * The switch is off until the checker has marked no honest season for 14 days.
 */
export const TRIGGER_HIDE_MARKS = Object.freeze(["part-out-of-range", "wall-out-of-range", "rank-off-score", "tier-off-score", "score-twins-differ", "score-not-whole"]);
export const HIDE_MARKS = Object.freeze([...DB_MARKS, ...TRIGGER_HIDE_MARKS]);

/** The marks of `result` (its checker marks and its row's trigger marks) the switch would hide it for. */
export const hiddenFor = (result) => [...new Set([...(result?.marks ?? []), ...(result?.triggerMarks ?? [])])].filter((mark) => HIDE_MARKS.includes(mark)).sort();

// `suspicion` is the insert trigger's marks on the ranking row: the hall of
// fame (src/hallOfFame.js) takes a season the trigger did not mark either.
const SELECT = "run_id,run_tag,case_id,summary,decision_log,resources,dynamics,completed_at,suspicion";
const JSON_COLUMNS = ["summary", "decision_log", "resources", "dynamics"];

const quote = (text) => `'${String(text).replace(/'/g, "''")}'`;

const WEEK_KEY = /^\d{4}-W(0[1-9]|[1-4]\d|5[0-3])$/;
const DAY_MS = 24 * 60 * 60 * 1000;
/** A whole number from 1 to `max`; `fallback` for anything else. */
const whole = (value, fallback, max) => Math.min(max, Math.max(1, Math.trunc(Number(value)) || fallback));

/**
 * The week boards the read covers by default: this week's and last week's, in
 * Korean time (isoWeekKey, the server's kst_iso_week). The page shows this
 * week's board; last week's is read too, so that the first run after Monday
 * 00:00 KST, when the page's board has turned over, still checks the week
 * that just ended.
 */
export function recheckWeeks(now = Date.now()) {
  return [...new Set([isoWeekKey(now), isoWeekKey(now - 7 * DAY_MS)])];
}

/**
 * The CI read's first half, for `supabase db query`: one SELECT and nothing
 * else. Each board -- the ordinary one (`week` null) and each of `weeks` --
 * is ranked as the page ranks it (fetchLeaderboard: complete seasons, score
 * desc, the earlier first on a tie), and of each board's top `limit` the
 * list keeps the runs the checker has not read yet (`recheck_seen_at` null,
 * the rows the page shows as 「확인 중」) and the top `always` whatever, new
 * runs first, `cap` at most. `all` keeps every one of the top `limit`. Each
 * answer row is a run id, its board ('' for the ordinary one), whether it is
 * new, and its place on the board: no score, no name.
 *
 * With `perBoard` (D2) the same SELECT keeps, beside those, each hall of fame
 * board's first `perBoard` candidates (src/hallOfFame.js): the board is the
 * season's week, or the table's when it has none; a candidate is a complete
 * season with no mark but the checker's own (today's check states those
 * again), on a board not yet settled (hall_of_fame_boards). A candidate is
 * read every night, read before or not, and counts against `cap` like any
 * other run. The count the threshold needs is read apart, over the whole
 * board (HALL_OF_FAME_COUNTS_SQL), so only what may take a place is replayed.
 */
export function rankingRunsSql({ limit = 100, always = 20, cap = 150, all = false, weeks = recheckWeeks(), perBoard = 0 } = {}) {
  const top = whole(limit, 100, 500);
  const again = Math.min(top, whole(always, 20, 500));
  const most = whole(cap, 150, 1000);
  const each = Math.min(100, Math.max(0, Math.trunc(Number(perBoard)) || 0));
  const keys = [...new Set(weeks)];
  if (!keys.every((week) => WEEK_KEY.test(String(week)))) throw new TypeError(`A week is a key like 2026-W47: ${keys.join(", ")}.`);
  const boards = keys.length ? `(summary->>'week' is null or summary->>'week' in (${keys.map(quote).join(", ")}))` : "summary->>'week' is null";
  const shown = all ? `place <= ${top}` : `place <= ${top} and (fresh or place <= ${again})`;
  if (!each) {
    return [
      "select run_id, board, fresh, place from (",
      "  select run_id, coalesce(summary->>'week', '') as board, recheck_seen_at is null as fresh,",
      "         row_number() over (partition by summary->>'week' order by score desc, completed_at asc) as place",
      "    from public.playtest_sessions",
      "   where case_id = 'season-final' and score is not null and run_id is not null",
      "     and summary->>'seasonComplete' = 'true'",
      `     and ${boards}`,
      ") as ranked",
      ` where ${shown}`,
      ` order by fresh desc, place, board limit ${most};`,
    ].join("\n");
  }
  // The page's boards (`shown`) are ranked whole, as above; another board
  // holds only its candidates, so its `place` ranks those alone.
  const onPage = boards.replace(/summary->>/g, "s.summary->>");
  const checkerMarks = `array[${CHECKER_MARK_LIST.map(quote).join(", ")}]::text[]`;
  return [
    "select run_id, board, fresh, place from (",
    "  select s.run_id, coalesce(s.summary->>'week', '') as board, s.recheck_seen_at is null as fresh,",
    `         ${onPage} as shown,`,
    "         row_number() over (partition by s.summary->>'week' order by s.score desc, s.completed_at asc) as place,",
    "         row_number() over (partition by k.board, c.candidate order by s.score desc, s.completed_at asc) as on_board,",
    "         c.candidate",
    "    from public.playtest_sessions s",
    "   cross join lateral (select case when s.summary->>'week' ~ '^[0-9]{4}-W(0[1-9]|[1-4][0-9]|5[0-3])$' then s.summary->>'week' else 'table' end as board) k",
    `   cross join lateral (select coalesce(s.suspicion <@ ${checkerMarks}`,
    "                              and not exists (select 1 from public.hall_of_fame_boards h where h.board = k.board and h.settled_at is not null), false) as candidate) c",
    "   where s.case_id = 'season-final' and s.score is not null and s.run_id is not null",
    "     and s.summary->>'seasonComplete' = 'true'",
    `     and (${onPage} or c.candidate)`,
    ") as ranked",
    ` where (shown and ${shown}) or (candidate and on_board <= ${each})`,
    ` order by fresh desc, place, board limit ${most};`,
  ].join("\n");
}

/** The public log's line for a run list (runs.json): how many runs of each board, how many of them new. Names no run. */
export function runsSummary(text) {
  const boards = new Map();
  for (const row of readRows(text)) {
    if (typeof row?.run_id !== "string" || !row.run_id) continue;
    const board = typeof row.board === "string" && row.board ? row.board : "ordinary";
    const tally = boards.get(board) ?? { runs: 0, fresh: 0 };
    tally.runs += 1;
    if (row.fresh === true || row.fresh === "true" || row.fresh === "t") tally.fresh += 1;
    boards.set(board, tally);
  }
  if (!boards.size) return "No run to read.";
  return [...boards].map(([board, tally]) => `${board} ${tally.runs} (${tally.fresh} new)`).join(", ");
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
    // F1 step 1: the settlement inside each case played again (the next scene, `resourcesAfter`);
    // F1 step 2: the route each case opened on played again from the case before.
    const chain = recheck.status === "unverified" ? null : recheckChain(runRows, { settle: recheckCaseSettlement, opening: recheckOpeningRoute });
    const marks = [...recheck.marks, ...(chain?.marks ?? [])];
    // The insert trigger's marks on the ranking row (its `suspicion` less the checker's, which `marks` states again).
    const triggerMarks = Array.isArray(ranking.suspicion) ? ranking.suspicion.filter((mark) => typeof mark === "string" && !DB_MARKS.includes(mark)) : [];
    results.push({ runId, runTag: ranking.run_tag ?? null, score: ranking.summary?.burstScore ?? null, caseRows: runRows.length - 1, ...recheck, marks, triggerMarks, chain });
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
      for (const finding of entry.drafts?.findings ?? []) lines.push(`  ${entry.caseId} #${finding.index}: draft off ${finding.differs.join(", ")} (shown, not written: ${RELIC_DRAFT_MARK})`);
    }
    if (unrecorded) lines.push(`  ${unrecorded} windows carry no replay record`);
    if (seedTails) lines.push(`  ${seedTails} windows were dealt again (a seed with a ~n tail: a rolled-back save, or a wall shopped for)`);
    if (result.chain) lines.push(...formatChain(result.chain));
    const hidden = hiddenFor(result);
    // The 14 days before the switch goes on are read off these lines: one on an honest season is a false flag.
    if (hidden.length) lines.push(`  hide switch: hidden once on (${hidden.join(", ")})`);
  }
  const checked = results.filter((result) => result.status !== "unverified");
  const hiding = checked.filter((result) => hiddenFor(result).length).length;
  lines.push(`Hide switch (ranking_hide_marked, off until 14 days without a false flag): would hide ${hiding} of ${checked.length} checked runs.`);
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
  // The board, the audit and the link (UNCHECKED.inside less what settlementRecheck.js plays again).
  const settled = unchecked.fields[UNCHECKED.inside[0]] ?? 0;
  if (settled) notChecked.push(`the board, audit and link of ${settled} cases`);
  const routed = SETTLED_INSIDE.map((field) => `${field} ${unchecked.fields[field] ?? 0}`).filter((text) => !text.endsWith(" 0"));
  if (routed.length) notChecked.push(`entries not read again (cases): ${routed.join(", ")}`);
  // A row from a build before the snapshot (UNCHECKED.open); LOCK's carry and
  // the route a case opened on where they could not be read (UNCHECKED.between:
  // a build before F1 step 2, a replay, a window between).
  const opened = unchecked.fields[UNCHECKED.open[0]] ?? 0;
  if (opened) notChecked.push(`the opening state of ${opened} cases (no opening snapshot)`);
  const [carry, route] = UNCHECKED.between.map((field) => unchecked.fields[field] ?? 0);
  if (carry) notChecked.push(`LOCK's carry ${carry} cases opened on`);
  if (route) notChecked.push(`the route ${route} cases opened on`);
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
  const values = checked.map((result) => `(${quote(result.runId)}, array[${result.marks.filter((mark) => DB_MARKS.includes(mark)).map(quote).join(", ")}]::text[], ${result.status === "checked"})`).join(",\n       ");
  return [
    "select count(*) filter (where marks is not null) as marked_rows",
    "  from (select public.ranking_set_recheck_marks(r.run_id, r.marks, r.replayed) as marks",
    `          from (values ${values}) as r(run_id, marks, replayed)) as written;`,
  ].join("\n");
}

async function main(argv) {
  const json = argv.includes("--json");
  const option = (name) => argv.find((arg) => arg.startsWith(`--${name}=`))?.slice(name.length + 3);
  const limit = Number(option("limit")) || 20;
  const perBoardArg = option("per-board");
  const perBoard = perBoardArg === undefined ? HALL_OF_FAME_CANDIDATES : Number(perBoardArg);
  const countsFile = option("counts");
  const files = argv.filter((arg) => !arg.startsWith("--"));
  if (argv.includes("--runs-sql")) {
    const weeks = option("weeks");
    console.log(rankingRunsSql({ limit: option("limit"), always: option("always"), cap: option("cap"), all: argv.includes("--all"), perBoard, ...(weeks === undefined ? {} : { weeks: weeks ? weeks.split(",") : [] }) }));
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
    if (argv.includes("--runs-summary")) {
      if (files.length !== 1) throw new Error("Name the one runs.json the run list was read into.");
      console.log(runsSummary(readFileSync(files[0], "utf8")));
      return 0;
    }
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
