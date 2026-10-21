import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";

import { initialResources } from "../src/gameConstants.js";
import { CASE_SEQUENCE } from "../src/gameCases.js";
import { createCaseSummary, getEndingVariant } from "../src/gameLogic.js";
import { classifyTelemetryFailure, isBeatTableRefusal, isUnrankableRefusal } from "../src/state/telemetryBatch.js";
import { toRowSummary } from "../src/state/useChoiceCommit.js";
import { createRunSummary, RULES_MARK, RULES_MARK_KEY, RUN_INITIAL_STATE } from "../src/gauntlet/gauntletEngine.js";
import { RELIC_IDS } from "../src/gauntlet/relics.js";
import { isoWeekKey, WEEK_RULE_CATALOGUE, WEEK_RULE_ID_MAX, WEEKLY_RULES } from "../src/gauntlet/weeklyRules.js";
import { createSeasonTelemetryPayload } from "../src/viewModels/seasonViewModels.js";
import { funnelQuery, readFunnel } from "./report-funnel.mjs";
import { readTestWeek, testWeekQuery } from "./report-test-week.mjs";
import { marksSql, rankingRowsSql } from "./verify-ranking-rows.mjs";

/**
 * Data API grants guardrail.
 *
 * From 2026-10-30 Supabase stops granting anon, authenticated and service_role
 * privileges on a table the moment it is created in `public`. The live
 * database keeps what it already has, so the day passes without a symptom --
 * the break shows up later, on a `supabase db reset`, a preview branch or a new
 * project, all of which replay `supabase/migrations/` from nothing. Four
 * telemetry tables used to have an anon insert policy and no insert grant,
 * which on such a database means every write is refused with 42501 and the
 * telemetry queue swallows it.
 *
 * So this replays every migration into an in-process Postgres (PGlite) set up
 * the way a project is after that date: the API roles exist and can use the
 * schema, functions and sequences keep their default grants, and tables get
 * none. Then it asserts eight things.
 *
 *   1. Rules that hold for any table, so a new one cannot slip through: RLS is
 *      on, service_role can read and write it, and every policy aimed at anon
 *      or authenticated has the privilege it filters -- a policy without its
 *      grant is never consulted, which is exactly the bug above. And for any
 *      function and any view: no function is an RPC unless it is listed, a
 *      SECURITY DEFINER function pins its search_path, and a view reads as
 *      the role asking (`security_invoker`).
 *   2. The contract the client actually relies on, by running it as anon with
 *      the payloads the client actually builds, inserted the way PostgREST
 *      inserts them (only the keys present, `on conflict (event_id) do
 *      nothing`). A simplified payload is how a 400 on every feedback row went
 *      unnoticed: the check sent columns that existed, the client did not.
 *   3. The refusals the server is there for: forged times, a ranking row for a
 *      run nobody played, a second one, a board flood, a spoofed forwarding
 *      header, a cloud save dated in the future, a stale device writing over
 *      a newer save, and every privilege 20260928 revoked.
 *   4. The limits themselves: each hourly and daily budget is driven to its
 *      edge, because a limit nobody has run is a number in a comment.
 *   5. What a migration that deletes leaves behind. The ranking reset of
 *      2026-10-15 (the day-ten table, 20261020010000) is replayed over a
 *      database with a row in every table, and every row but the ranking
 *      rows has to come out of it as it went in.
 *   6. That the telemetry trigger function in parts (20261014000000) is the
 *      function it was: each part is run by nobody but the service role, the
 *      triggers are wired as before, and one row for every refusal, sent to
 *      both definitions, is refused or stored the same way by each.
 *   7. This week's rule (20261021000000): the server's calendar and week are
 *      the client's, a season ranks on the board of the week its first case
 *      row arrived in when every row names that week's rule, and one whose
 *      rows disagree, or name a rule that week does not have, is refused. The
 *      test week's report (report-test-week.mjs) runs its one SELECT here and
 *      counts the seasons with the rule, without it and their devices; the
 *      weekly drop-off report (report-funnel.mjs) runs its one SELECT too.
 *   8. The checker's marks (F1 phase 2, *_ranking_recheck_marks): only the
 *      service role may set them; a call states the two recheck marks whole,
 *      keeps the insert trigger's and touches no other row; the checker's
 *      own read (verify-ranking-rows --sql) runs on the replayed schema.
 *
 * Needs no Docker and no network, which is what lets it sit in
 * `verify:static`.
 */

const root = process.cwd();
const MIGRATIONS = path.join(root, "supabase", "migrations");
const API_ROLES = ["anon", "authenticated", "service_role"];
const failures = [];

const db = new PGlite();
await db.exec(`
  create role anon nologin;
  create role authenticated nologin;
  create role service_role nologin bypassrls;
  grant usage on schema public to anon, authenticated, service_role;
  alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
  alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
`);

// The newest ranking reset (20261020010000, the day-ten table; the one of
// 2026-10-11 before it was held to the same seed) deletes rows, and a delete is
// judged by what it leaves. So the database it meets here is not empty: just
// before that file is replayed, every table gets a row, and `playtest_sessions` gets a run's
// case rows and two ranking rows -- one the public ranking shows and one it
// does not (no score), since the reset takes both. The tables are read before
// and after, and the seeded rows are taken out again, so the rest of this
// check runs on the database it always had.
const RANKING_RESET = "20261020010000_rules_day10_ranking_reset.sql";
const RESET_SEED = "grants-check-reset";
/** Every row of every table in `public` but the ranking rows, as text: what the reset must leave as it found it. */
async function readEverythingButRanking() {
  const { rows: seen } = await db.query(`
    select c.relname as name from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind in ('r', 'p') order by 1
  `);
  const state = {};
  for (const { name } of seen) {
    const { rows } = await db.query(
      `select to_jsonb(t)::text as row from public.${name} t ${name === "playtest_sessions" ? "where case_id <> 'season-final'" : ""} order by 1`,
    );
    state[name] = rows.map(({ row }) => row);
  }
  return state;
}
async function seedBeforeRankingReset() {
  // Rows put in place as stored rows, past the insert triggers: what the reset
  // meets is rows written under older rules, not rows today's trigger admits.
  await db.exec(`set session_replication_role = replica`);
  try {
    const session = (summary, caseId, dynamics = null) =>
      db.query(
        `insert into public.playtest_sessions (session_id, run_id, session_code, player_name, case_id, case_title, summary, dynamics)
         values ($1, $2, 'RESETSEED', '익명 분석관', $3, $4, $5::jsonb, $6::jsonb)`,
        [`${RESET_SEED}-session`, summary.runId, caseId, caseId === "season-final" ? "SEASON 01 COMPLETE" : "수습 딱지", JSON.stringify({ ...summary, runId: undefined }), dynamics === null ? null : JSON.stringify(dynamics)],
      );
    const beatTable = { windowIndex: 6, runPot: 0, vault: 320, streak: 2, busts: 1, cashes: 5, bestMultiplier: 2.4, lastGauge: 61, lastOutcome: "cash", mutations: [], responseTimeSec: 7.4, beatCombo: 3, bestCombo: 9, grooveVault: 40 };
    // A run the beat table closed: two of its case rows and its ranking row.
    await session({ runId: `${RESET_SEED}-run-1`, burstScore: 71 }, "case01", beatTable);
    await session({ runId: `${RESET_SEED}-run-1`, burstScore: 91, rank: "S" }, "final", beatTable);
    await session({ runId: `${RESET_SEED}-run-1`, burstScore: 91, rank: "S", seasonComplete: true }, "season-final");
    // A ranking row the public ranking does not show: it has no score.
    await session({ runId: `${RESET_SEED}-run-2`, burstScore: 64 }, "final", beatTable);
    await session({ runId: `${RESET_SEED}-run-2`, seasonComplete: true }, "season-final");
    // A stored case row the new constraint would refuse, were it sent today:
    // the table's mark, present and not a number (20261020010000).
    await session({ runId: `${RESET_SEED}-run-3`, burstScore: 50 }, "case02", { ...beatTable, tableRules: "two" });
    await db.query(`insert into public.playtest_feedback (session_id, session_code, case_id, feedback) values ($1, 'RESETSEED', 'case01', '{"clarity": 4}')`, [`${RESET_SEED}-session`]);
    await db.query(`insert into public.app_error_logs (session_id, session_code, occurred_at, source, error_name) values ($1, 'RESETSEED', now(), 'window-error', 'TypeError')`, [`${RESET_SEED}-session`]);
    await db.query(`insert into public.free_text_analyses (session_id, case_id, node_id, analysis) values ($1, 'case01', 'n1', '{}')`, [`${RESET_SEED}-session`]);
    await db.query(`insert into public.board_posts (session_id, nickname, body, actor_key) values ($1, '점검', '랭킹을 비우기 전에 쓴 글', 'board:${RESET_SEED}')`, [`${RESET_SEED}-session`]);
    await db.query(`insert into public.cloud_saves (code_hash, saved_at, payload) values ($1, now(), '{"save": {}}')`, [RESET_SEED]);
    await db.query(`insert into public.telemetry_rate_limits (actor_key, request_count) values ($1, 7)`, [RESET_SEED]);
    await db.query(`insert into public.private_settings (name, value) values ($1, 'kept')`, [RESET_SEED]);
  } finally {
    await db.exec(`set session_replication_role = origin`);
  }
}
/** Takes the seeded rows out again; the tables are named, so one added later is caught by the count below. */
async function removeRankingResetSeed() {
  let removed = 0;
  for (const [table, column, value] of [
    ["playtest_sessions", "session_id", `${RESET_SEED}-session`],
    ["playtest_feedback", "session_id", `${RESET_SEED}-session`],
    ["app_error_logs", "session_id", `${RESET_SEED}-session`],
    ["free_text_analyses", "session_id", `${RESET_SEED}-session`],
    ["board_posts", "session_id", `${RESET_SEED}-session`],
    ["cloud_saves", "code_hash", RESET_SEED],
    ["telemetry_rate_limits", "actor_key", RESET_SEED],
    ["private_settings", "name", RESET_SEED],
  ]) {
    removed += (await db.query(`delete from public.${table} where ${column} = $1`, [value])).affectedRows ?? 0;
  }
  return removed;
}
let beforeReset = null;
let afterReset = null;
let rankingBeforeReset = null;
let rankingAfterReset = null;
const countRanking = async () =>
  (await db.query(
    `select count(*)::int as n, (count(*) filter (where summary->>'seasonComplete' = 'true' and score is not null))::int as shown
       from public.playtest_sessions where case_id = 'season-final'`,
  )).rows[0];

const files = readdirSync(MIGRATIONS).filter((file) => file.endsWith(".sql")).sort();
if (!files.includes(RANKING_RESET)) failures.push(`supabase/migrations/${RANKING_RESET} is gone; the check of what the ranking reset leaves ran against nothing.`);
// The ranking's suspicion marks (`*_ranking_suspicion_marks.sql`, drafted on
// 2026-10-14). Their checks below run once the migration is among the files,
// and from then on they must pass; while it is still a `.sql.draft` they are
// skipped and said to be.
const SUSPICION_MARKS = files.some((file) => file.endsWith("_ranking_suspicion_marks.sql"));
for (const file of files) {
  if (file === RANKING_RESET) {
    await seedBeforeRankingReset();
    beforeReset = await readEverythingButRanking();
    rankingBeforeReset = await countRanking();
  }
  try {
    await db.exec(readFileSync(path.join(MIGRATIONS, file), "utf8"));
  } catch (error) {
    console.error(`supabase/migrations/${file} does not apply to a fresh database: ${error.message}`);
    process.exit(1);
  }
  if (file === RANKING_RESET) {
    afterReset = await readEverythingButRanking();
    rankingAfterReset = await countRanking();
  }
}

// The checker's marks (F1 phase 2, `*_ranking_recheck_marks.sql`): the cases
// below run once the migration is among the files.
const RECHECK_MARKS = files.some((file) => file.endsWith("_ranking_recheck_marks.sql"));

// What the ranking reset removed, and what it left (20261020010000).
if (beforeReset && afterReset) {
  if (rankingBeforeReset.n !== 2 || rankingBeforeReset.shown !== 1) {
    failures.push(`the ranking reset met ${rankingBeforeReset.n} ranking rows, ${rankingBeforeReset.shown} of them shown; the check seeds two, one shown and one not.`);
  }
  if (rankingAfterReset.n !== 0) failures.push(`the ranking reset left ${rankingAfterReset.n} season-final rows; it has to leave none, shown or not.`);
  const names = Object.keys(beforeReset);
  if (JSON.stringify(names) !== JSON.stringify(Object.keys(afterReset))) {
    failures.push(`the ranking reset changed the tables in public: ${names.join(", ")} before, ${Object.keys(afterReset).join(", ")} after.`);
  }
  for (const name of names) {
    // A table with no row before the reset proves nothing by having none after it.
    if (beforeReset[name].length === 0) {
      failures.push(`public.${name} held no row when the ranking reset ran, so nothing shows the reset leaves it alone. Seed one in seedBeforeRankingReset in scripts/check-grants.mjs.`);
    }
    if (JSON.stringify(beforeReset[name]) !== JSON.stringify(afterReset[name] ?? null)) {
      failures.push(
        `the ranking reset changed public.${name}: ${beforeReset[name].length} rows before${name === "playtest_sessions" ? " (ranking rows aside)" : ""}, ` +
          `${afterReset[name]?.length ?? 0} after, or a row among them was rewritten. It may delete season-final rows and nothing else.`,
      );
    }
  }
  // The run's own case rows are among what stayed, the `final` one with them,
  // and so is a stored row the new constraint would refuse: NOT VALID re-reads nothing.
  const kept = (await db.query(
    `select run_id, case_id, dynamics->>'tableRules' as hand from public.playtest_sessions where session_id = $1 order by run_id, case_id`,
    [`${RESET_SEED}-session`],
  )).rows.map((row) => `${row.run_id.slice(RESET_SEED.length + 1)}:${row.case_id}${row.hand ? `:${row.hand}` : ""}`);
  if (JSON.stringify(kept) !== JSON.stringify(["run-1:case01", "run-1:final", "run-2:final", "run-3:case02:two"])) {
    failures.push(`after the ranking reset the seeded runs hold ${JSON.stringify(kept)}; expected their case rows and no ranking row.`);
  }
  const removed = await removeRankingResetSeed();
  if (removed !== 11) failures.push(`the ranking-reset seed took ${removed} rows out again; it put in 13 and the reset deletes 2.`);
  const left = await readEverythingButRanking();
  const stray = Object.entries(left).filter(([, rows]) => rows.some((row) => row.includes(RESET_SEED))).map(([name]) => name);
  if (stray.length) failures.push(`the ranking-reset seed is still in public.${stray.join(", public.")}; everything after this would run beside it.`);
}

// The reset restates one part of the trigger function, not the function:
// 20261014000000 split `validate_telemetry_insert`, and a change of table
// restates `ranking_check_run_marks` alone. The last file to write the
// function out whole is WHOLE_VALIDATOR; the comparison of the function in
// parts with the whole one reads it from there, not from RANKING_RESET.
const WHOLE_VALIDATOR = "20261011010000_logic_table_ranking_reset.sql";
{
  const restates = (file, name) =>
    files.includes(file) && new RegExp(`^create or replace function public\\.${name}\\(`, "m").test(readFileSync(path.join(MIGRATIONS, file), "utf8"));
  if (!restates(WHOLE_VALIDATOR, "validate_telemetry_insert")) {
    failures.push(`supabase/migrations/${WHOLE_VALIDATOR} no longer writes validate_telemetry_insert out whole; the function in parts would be compared with nothing.`);
  }
  if (restates(RANKING_RESET, "validate_telemetry_insert")) {
    failures.push(`supabase/migrations/${RANKING_RESET} restates validate_telemetry_insert; since 20261014000000 a change of table restates ranking_check_run_marks alone.`);
  }
  if (!restates(RANKING_RESET, "ranking_check_run_marks")) {
    failures.push(`supabase/migrations/${RANKING_RESET} does not restate ranking_check_run_marks; the older-table refusal is in no function the trigger calls.`);
  }
}

// ------------------------------------------------------------------ 1. rules

const { rows: tables } = await db.query(`
  select c.relname as name, c.relrowsecurity as rls
  from pg_class c join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relkind in ('r', 'p')
  order by 1
`);

for (const { name, rls } of tables) {
  if (!rls) {
    failures.push(`public.${name} has row level security off. With explicit grants that is the only filter left.`);
  }
  const { rows } = await db.query(
    `select ${["select", "insert", "update", "delete"]
      .map((priv) => `has_table_privilege('service_role', $1, '${priv}') as ${priv}`)
      .join(", ")}`,
    [`public.${name}`],
  );
  const missing = Object.entries(rows[0])
    .filter(([, granted]) => !granted)
    .map(([priv]) => priv);
  if (missing.length) {
    failures.push(
      `public.${name}: service_role lacks ${missing.join(", ")}. ` +
        `Add \`grant all on public.${name} to service_role;\` in the migration that creates it.`,
    );
  }
  // Nothing the client may do is table-wide: anon's writes and reads are
  // column grants, and update/delete/truncate belong to nobody but service_role.
  for (const role of ["anon", "authenticated"]) {
    const { rows: wide } = await db.query(
      `select ${["select", "insert", "update", "delete", "truncate", "references", "trigger"]
        .map((priv) => `has_table_privilege('${role}', $1, '${priv}') as ${priv}`)
        .join(", ")}`,
      [`public.${name}`],
    );
    const held = Object.entries(wide[0]).filter(([, granted]) => granted).map(([priv]) => priv);
    if (held.length) {
      failures.push(`public.${name}: ${role} holds table-wide ${held.join(", ")}. Grant the columns the client uses instead.`);
    }
  }
}

const { rows: policies } = await db.query(`
  select tablename, policyname, cmd, roles::text[] as roles
  from pg_policies where schemaname = 'public'
`);
const PRIVS_BY_CMD = { SELECT: ["select"], INSERT: ["insert"], UPDATE: ["update"], DELETE: ["delete"] };
for (const { tablename, policyname, cmd, roles } of policies) {
  const targets = roles.includes("public") ? ["anon", "authenticated"] : roles.filter((role) => API_ROLES.includes(role));
  const privs = PRIVS_BY_CMD[cmd] ?? ["select", "insert", "update", "delete"];
  for (const role of targets) {
    if (role === "service_role") continue;
    // A column grant is enough for select/insert/update; delete has no column form.
    const checks = privs.map((priv) =>
      priv === "delete"
        ? `has_table_privilege('${role}', $1, 'delete')`
        : `has_any_column_privilege('${role}', $1, '${priv}')`,
    );
    const { rows } = await db.query(`select (${checks.join(" or ")}) as ok`, [`public.${tablename}`]);
    if (!rows[0].ok) {
      failures.push(
        `public.${tablename}: policy "${policyname}" lets ${role} ${cmd.toLowerCase()}, but ${role} has no ` +
          `${privs.join("/")} grant, so the request is refused before the policy is read. ` +
          `Grant it in the migration that creates the table.`,
      );
    }
  }
}

// No function is an RPC by accident. A function in `public` is executable by
// PUBLIC unless a migration says otherwise, and PostgREST serves every one the
// caller may execute, so a helper a trigger calls becomes an unmetered endpoint.
// The list is what the client calls and what a policy needs (20260929040000).
const CLIENT_FUNCTIONS = {
  anon: [
    "delete_cloud_save", "get_cloud_save", "is_season_case_id", "logic_hold_cutoffs", "peek_cloud_save", "put_cloud_save",
    "scene_bust_rates",
    // The ranking policy calls it as anon: whether marked rows are hidden.
    ...(SUSPICION_MARKS ? ["ranking_hides_marked"] : []),
  ],
  authenticated: [],
};
{
  const { rows } = await db.query(`
    select p.proname as name, pg_get_function_identity_arguments(p.oid) as args,
           has_function_privilege('anon', p.oid, 'execute') as anon,
           has_function_privilege('authenticated', p.oid, 'execute') as authenticated,
           has_function_privilege('service_role', p.oid, 'execute') as service_role
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
    order by 1, 2
  `);
  if (rows.length === 0) failures.push("no functions were found in public; the execute rule checked nothing.");
  for (const fn of rows) {
    for (const role of ["anon", "authenticated"]) {
      const listed = CLIENT_FUNCTIONS[role].includes(fn.name);
      if (fn[role] && !listed) {
        failures.push(
          `public.${fn.name}(${fn.args}) is executable by ${role}, so it is an RPC anyone can call. ` +
            `Add \`revoke all on function public.${fn.name}(${fn.args}) from public, anon, authenticated;\` to the migration that creates it.`,
        );
      }
      if (!fn[role] && listed) {
        failures.push(`public.${fn.name}(${fn.args}) is not executable by ${role}, and the client or a policy calls it.`);
      }
    }
    if (!fn.service_role) failures.push(`public.${fn.name}(${fn.args}) is not executable by service_role.`);
  }
  for (const name of CLIENT_FUNCTIONS.anon) {
    const overloads = rows.filter((fn) => fn.name === name).length;
    if (overloads !== 1) failures.push(`public.${name} has ${overloads} overloads; PostgREST needs exactly one to resolve a call by argument names.`);
  }
}

// A SECURITY DEFINER function runs as its owner, with the owner's rights, and
// resolves every unqualified name through the caller's search_path unless it
// pins one of its own: a caller who can create a `public.now()`-shaped object
// in a schema ahead of `public` would have it run as the owner. Every definer
// function here pins `search_path`; this is the rule, so the next one cannot
// be written without it. An empty setting (`set search_path = ''`) pins it too.
{
  const { rows } = await db.query(`
    select p.proname as name, pg_get_function_identity_arguments(p.oid) as args,
           coalesce(p.proconfig, '{}') as config
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.prosecdef
    order by 1, 2
  `);
  if (rows.length === 0) failures.push("no SECURITY DEFINER function was found in public; the search_path rule checked nothing.");
  for (const fn of rows) {
    if (!fn.config.some((setting) => /^search_path=/i.test(setting))) {
      failures.push(
        `public.${fn.name}(${fn.args}) is SECURITY DEFINER and does not pin search_path. ` +
          "Add `set search_path = public` to its definition.",
      );
    }
  }
}

// A view runs as its owner unless it says otherwise, so a plain view over a
// table reads past that table's RLS and past the column grants anon was given:
// whatever the view selects is public. `security_invoker = true` makes it read
// as the role asking. Both views here set it; this holds the next one to it.
{
  const { rows } = await db.query(`
    select c.relname as name, coalesce(c.reloptions, '{}') as options
    from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind in ('v', 'm')
    order by 1
  `);
  if (rows.length === 0) failures.push("no view was found in public; the security_invoker rule checked nothing.");
  for (const view of rows) {
    if (!view.options.some((option) => /^security_invoker=(true|on|1)$/i.test(option))) {
      failures.push(
        `public.${view.name} is a view without security_invoker, so it reads as its owner and bypasses RLS. ` +
          `Create it \`with (security_invoker = true)\`.`,
      );
    }
  }
}

// The season the database proves a ranking row against is the season the
// client plays.
{
  const { rows } = await db.query(`select public.season_case_ids() as ids`);
  if (JSON.stringify(rows[0].ids) !== JSON.stringify(CASE_SEQUENCE)) {
    failures.push(
      "public.season_case_ids() does not match CASE_SEQUENCE in src/gameCases.js. Add a migration that redefines it " +
        "with the new season, or no season-final row can be accepted.",
    );
  }
}

// --------------------------------------------------------------- 2. contract

let requestHeaders = null;
/** Headers PostgREST would expose as `request.headers` for the next statements. */
const withHeaders = (headers) => {
  requestHeaders = headers;
};

async function run(role, sql, params = []) {
  await db.exec(`set role ${role}`);
  try {
    if (requestHeaders) await db.query(`select set_config('request.headers', $1, false)`, [JSON.stringify(requestHeaders)]);
    return await db.query(sql, params);
  } finally {
    await db.exec(`reset role; select set_config('request.headers', '', false);`);
  }
}

async function expect(label, role, sql, { params = [], refusedWith = null, succeed = true } = {}) {
  try {
    const result = await run(role, sql, params);
    if (!succeed) failures.push(`${role} could ${label}; it has to be refused.`);
    return result;
  } catch (error) {
    if (succeed) failures.push(`${role} cannot ${label}: [${error.code}] ${error.message}`);
    else if (refusedWith && !refusedWith.test(`${error.code} ${error.message}`)) {
      failures.push(`${role} ${label} failed for the wrong reason: [${error.code}] ${error.message}`);
    }
    return null;
  }
}
const allowed = (label, role, sql, params) => expect(label, role, sql, { params });
const refused = (label, role, sql, refusedWith = /^42501 /) => expect(label, role, sql, { succeed: false, refusedWith });
const raises = (label, role, sql, params, pattern) =>
  expect(label, role, sql, { params, succeed: false, refusedWith: pattern });
const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const one = async (sql, params = []) => (await db.query(sql, params)).rows[0] ?? null;

/**
 * An insert the way PostgREST writes one for `POST /rest/v1/<table>` with
 * `Prefer: return=minimal`: the columns are the payload's keys, nothing else,
 * so a key the client sends and anon may not write is a 42501 here exactly as
 * it is live.
 *
 * Deliberately no ON CONFLICT. An arbiter column needs SELECT, and anon must
 * not read `event_id` (on the board it used to embed the session id, and on a
 * ranking row an old queue id embeds the run id). A replay is a 23505, which
 * PostgREST answers 409 and `insertRow` counts as delivered.
 */
function postgrestInsert(table, payload) {
  const columns = Object.keys(payload).map((key) => `"${key}"`).join(", ");
  return {
    sql: `insert into public.${table} (${columns}) select ${columns} from jsonb_populate_record(null::public.${table}, $1::jsonb)`,
    params: [JSON.stringify(payload)],
  };
}
const post = (label, table, payload) => {
  const { sql, params } = postgrestInsert(table, payload);
  return allowed(label, "anon", sql, params);
};
const postRefused = (label, table, payload, pattern) => {
  const { sql, params } = postgrestInsert(table, payload);
  return raises(label, "anon", sql, params, pattern);
};

let uuidCounter = 0;
const uuid = () => `00000000-0000-4000-8000-${String(++uuidCounter).padStart(12, "0")}`;
const sessionId = (n) => `grants-check-session-${n}`;
const sessionCodeOf = (id) => id.replace(/[^a-z0-9]/gi, "").slice(-8).toUpperCase();

// A decision-log entry with every key the commit in src/state/useChoiceCommit.js
// writes (`entryBase` there, plus `observerTag`), at realistic sizes. There is
// no shared builder for it -- the entry is assembled inline there -- so the keys
// are read off that file below and held to this object's.
//
// `story` is an entry of a case played in story mode, the one key such an
// entry adds (`assistStory`). The runs below are played without it: a season
// with a story case is one the client does not send for ranking.
function decisionEntry(caseId, index, { story = false } = {}) {
  const resources = { ...initialResources };
  return {
    caseId,
    nodeId: `${caseId}_scene_${index}`,
    speaker: "한서윤",
    choiceId: `${caseId}_choice_${index}`,
    title: "현장 판단 — 서류가 먼저 도착한 날",
    chapterRule: "기록이 먼저, 해명은 나중",
    choice: "책임자를 먼저 부르고 기록을 봉인한다",
    spokenChoice: "지금 부르겠습니다. 기록은 손대지 마세요.",
    reframe: false,
    reframeOpenedRoute: false,
    reframeBranchId: null,
    continuityMemory: false,
    // A bust that skipped a scene: the two keys only such an entry carries.
    routeChangeKind: "blackout-skip",
    skippedNodeId: `${caseId}_scene_${index}_skipped`,
    effect: { time: -4, capital: -6, trust: 3, legitimacy: 2, humanCost: 1, fatigue: 2 },
    riskRewardEffect: { time: -1, capital: 2 },
    cognition: { persistence: 2, reflection: 1 },
    triggers: ["responsibility", "protection"],
    echo: "기록이 봉인되자 복도가 조용해졌다. 누군가는 이 결정을 오래 기억할 것이다.".repeat(2),
    sceneBeat: { tone: "pressure", line: "시계가 두 번 울렸다.".repeat(4) },
    challenge: { title: "책임의 순서", matched: true, riskDelta: -2 },
    tactical: { read: "압박이 한쪽으로 쏠린다", advice: "속도를 늦춘다" },
    // The hand's line under a logged decision (useChoiceCommit's `describeHand`).
    handLine: { label: "LOGIC STREAK", text: "논리 콤보 12 · 판돈 ×1.60 · +14" },
    clueReward: null,
    threshold: {
      state: "cash", busted: false, cause: "cashed", forced: false, gauge: 63, wall: 88, pushes: 3,
      rewardMultiplier: 1.4, potMultiplier: 1.8, pot: 42, lostPot: 0,
      focus: { charge: 0, potMultiplier: 1, resourceMultiplier: 1 },
      // The logic streak's line (gauntletEngine's `verdict.logic`); the case summary's `logicRecord` is built from it.
      logic: { type: "persistence", tier: 2, rose: index % 2 === 1, move: index % 3 === 2 ? "switch" : "grow", streak: 12 + index, held: 4, bonus: 1.6, pot: 14 },
    },
    environmentMode: "stable",
    assistTime: 1.5,
    ...(story ? { assistStory: true } : {}),
    suspenseEvent: null,
    clue: null,
    responseTimeSec: 7.4,
    resourcesBefore: resources,
    resourcesAfter: { ...resources, time: 68, capital: 94 },
    observerTag: "steady-hand",
  };
}

const triggers = { responsibility: 12, protection: 8, recognition: 4, autonomy: 3 };
const cognition = { persistence: 9, reflection: 7, reframing: 3 };

// The keys of `entryBase` as the client's source spells them: one per line of
// that literal, a conditional spread counted by the key inside it.
{
  const source = readFileSync(path.join(root, "src", "state", "useChoiceCommit.js"), "utf8").replace(/\r\n/g, "\n");
  const literal = source.match(/\n( *)const entryBase = \{\n([\s\S]*?)\n\1\};/);
  const keyLine = literal ? new RegExp(`^${literal[1]}  (?:([A-Za-z]\\w*)[:,]|\\.\\.\\.\\(.*\\{ (\\w+) \\})`) : null;
  const clientKeys = literal
    ? literal[2].split("\n").map((line) => line.match(keyLine)).filter(Boolean).map((match) => match[1] ?? match[2])
    : [];
  const probeKeys = Object.keys(decisionEntry("case01", 0, { story: true }));
  if (clientKeys.length < 20) {
    failures.push(
      "could not read the decision-log entry's keys from src/state/useChoiceCommit.js (`const entryBase = {`); " +
        "the entry this check sends can no longer be held to the client's.",
    );
  } else {
    const expected = [...clientKeys, "observerTag"];
    const differences = [
      ...expected.filter((key) => !probeKeys.includes(key)).map((key) => `${key} is missing`),
      ...probeKeys.filter((key) => !expected.includes(key)).map((key) => `${key} is not the client's`),
    ];
    if (differences.length) {
      failures.push(
        `the decision-log entry this check sends is not the one the client builds: ${differences.join(", ")}. ` +
          "Bring decisionEntry in scripts/check-grants.mjs in step with entryBase in src/state/useChoiceCommit.js.",
      );
    }
  }
}

/**
 * `caseTelemetryPayload` in src/state/useChoiceCommit.js, key for key. The
 * client sends no `completed_at`: the column's default and the insert trigger
 * date the row. The probes that forge a date add the key themselves.
 */
function casePayload({ session, runId, caseId, completedAt = new Date().toISOString(), story = false }) {
  const log = Array.from({ length: 6 }, (_, index) => decisionEntry(caseId, index, { story }));
  const summary = {
    ...createCaseSummary(triggers, cognition, log, { resources: initialResources, schemaVersion: 7 }),
    // The ending as the runtime puts it in a row: its id, not the record the
    // report prints. A literal here once hid that the client sent the record.
    endingVariant: toRowSummary({ endingVariant: getEndingVariant({ resources: initialResources }) }).endingVariant,
    gauntlet: createRunSummary(RUN_INITIAL_STATE),
    runId,
    outcomeChoiceId: log.at(-1).choiceId,
    outcomeNodeId: log.at(-1).nodeId,
    completedAt,
  };
  return {
    event_id: uuid(),
    session_id: session,
    run_id: runId,
    session_code: sessionCodeOf(session),
    player_name: "익명 분석관",
    case_id: caseId,
    case_title: "수습 딱지",
    summary,
    resources: initialResources,
    triggers,
    cognition,
    decision_log: log,
    dynamics: { ...createRunSummary(RUN_INITIAL_STATE), responseTimeSec: 7.4 },
  };
}

/** The shared builder the runtime calls for the ranking row. */
function seasonPayload({ session, runId, seasonComplete = true }) {
  const final = casePayload({ session, runId, caseId: "final" });
  const payload = createSeasonTelemetryPayload({
    caseSummary: { ...final.summary, burstScore: 88, rank: "A" },
    completedCaseCount: CASE_SEQUENCE.length,
    cognition,
    decisionLog: final.decision_log,
    resources: initialResources,
    runId,
    sessionCode: sessionCodeOf(session),
    sessionId: session,
    triggers,
  });
  return { event_id: uuid(), ...payload, summary: { ...payload.summary, seasonComplete } };
}

/** `feedbackTelemetryPayload` in src/state/useFeedback.js, as the client now sends it. */
function feedbackPayload(session) {
  return {
    event_id: uuid(),
    session_id: session,
    session_code: sessionCodeOf(session),
    case_id: "case01",
    feedback: {
      caseTitle: "수습 딱지",
      submittedAt: new Date().toISOString(),
      clarity: 4,
      difficulty: 3,
      comment: "선택지가 무엇을 걸고 있는지는 분명했습니다.".repeat(10),
    },
  };
}

/** `createErrorTelemetryPayload` in src/state/errorRecovery.js. */
function errorPayload(session, overrides = {}) {
  return {
    event_id: uuid(),
    session_id: session,
    session_code: sessionCodeOf(session),
    occurred_at: new Date().toISOString(),
    source: "window-error",
    current_case: "case01",
    node_id: "c1_start",
    error_name: "TypeError",
    error_message: "Cannot read properties of undefined (reading 'effect')",
    error_stack: "TypeError: Cannot read properties of undefined\n    at choose (GameRuntime.jsx:1040:7)\n".repeat(40),
    component_stack: "\n    at GameRuntime\n    at AppContent".repeat(20),
    dom_snapshot: "main.play-screen > section.gauntlet-stage > button.choice-card".repeat(20),
    viewport: { width: 390, height: 844, devicePixelRatio: 3 },
    context: { source: "window-error", currentCase: "case01", nodeId: "c1_start", started: true },
    ...overrides,
  };
}

// ---- telemetry writes, exact shapes

withHeaders({ "x-forwarded-for": "198.51.100.7" });
const caseRow = casePayload({ session: sessionId(1), runId: "run-contract-1", caseId: "case01" });
check(!Object.hasOwn(caseRow, "completed_at"), "the case row this check sends has a completed_at; the client's has none.");
await post("insert the case row the runtime builds", "playtest_sessions", caseRow);
// The run/case dedupe drops it silently before the event_id constraint is reached.
await post("replay the same case row (same event_id)", "playtest_sessions", caseRow);
await post("send the same run/case under a new event_id", "playtest_sessions", { ...caseRow, event_id: uuid() });
{
  const row = await one(
    `select count(*)::int as n, max(completed_at) <= now() as clamped, max(player_name) as name
     from public.playtest_sessions where run_id = 'run-contract-1'`,
  );
  check(row?.n === 1, `a replayed or re-sent case row was stored ${row?.n} times; event_id and (run_id, case_id) must dedupe.`);
  check(row?.clamped === true, "a case row sent without a date was not given the server's now().");
}
await post("insert a case row dated 2099", "playtest_sessions", {
  ...casePayload({ session: sessionId(1), runId: "run-contract-1b", caseId: "case01" }),
  completed_at: "2099-01-01T00:00:00Z",
});
check(
  (await one(`select completed_at <= now() as clamped from public.playtest_sessions where run_id = 'run-contract-1b'`))?.clamped === true,
  "a case row dated 2099 kept its date; completed_at must be the server's now().",
);
await post("insert a case row dated 'infinity'", "playtest_sessions", {
  ...casePayload({ session: sessionId(1), runId: "run-contract-2", caseId: "case02" }),
  completed_at: "infinity",
});
check(
  (await one(`select isfinite(completed_at) as ok from public.playtest_sessions where run_id = 'run-contract-2'`))?.ok === true,
  "a case row dated 'infinity' was stored as infinity, so retention could never delete it.",
);

const feedbackRow = feedbackPayload(sessionId(2));
await post("insert the feedback row useFeedback builds", "playtest_feedback", feedbackRow);
await postRefused("replay a feedback row (a 409 the client counts as delivered)", "playtest_feedback", feedbackRow, /^23505 /);
await post("insert the error log errorRecovery builds", "app_error_logs", errorPayload(sessionId(3), {
  occurred_at: "2099-01-01T00:00:00Z",
  error_stack: "x".repeat(200000),
}));
{
  const row = await one(
    `select occurred_at <= now() as clamped, length(error_stack) as stack from public.app_error_logs where session_id = $1`,
    [sessionId(3)],
  );
  check(row?.clamped === true, "an error log dated 2099 kept its date.");
  check(row?.stack <= 8000, `an error stack was stored at ${row?.stack} characters; the trigger must truncate it.`);
}

// Columns the server owns.
await postRefused("choose the id of a case row", "playtest_sessions", { ...casePayload({ session: sessionId(1), runId: "run-contract-3", caseId: "case03" }), id: 1 }, /^42501 /);
await postRefused("choose created_at on feedback", "playtest_feedback", { ...feedbackPayload(sessionId(2)), created_at: "2099-01-01" }, /^42501 /);
await postRefused("choose created_at on an error log", "app_error_logs", { ...errorPayload(sessionId(3)), created_at: "2099-01-01" }, /^42501 /);
await postRefused("write a ranking score directly", "playtest_sessions", { ...casePayload({ session: sessionId(1), runId: "run-contract-4", caseId: "case04" }), score: 100 }, /^(42501|428C9) /);
await postRefused("write a free-text analysis", "free_text_analyses", {
  event_id: uuid(), session_id: sessionId(4), case_id: "case01", node_id: "n1", analysis: {},
}, /^42501 /);

// Sizes.
await postRefused("send an oversized summary", "playtest_sessions", {
  ...casePayload({ session: sessionId(1), runId: "run-contract-5", caseId: "case05" }),
  summary: { note: "x".repeat(70000) },
}, /too large/);
await postRefused("send an oversized decision entry", "playtest_sessions", {
  ...casePayload({ session: sessionId(1), runId: "run-contract-6", caseId: "case06" }),
  decision_log: [{ echo: "x".repeat(20000) }],
}, /too large/);
await postRefused("send an oversized session code", "playtest_feedback", { ...feedbackPayload(sessionId(2)), session_code: "X".repeat(40) }, /session code/);

// Rate-limit key: the hop the gateway appended, or the edge's own header.
withHeaders({ "x-forwarded-for": "6.6.6.6, 203.0.113.9" });
await post("insert an error log behind a proxy", "app_error_logs", errorPayload(sessionId(5)));
withHeaders({ "x-forwarded-for": "7.7.7.7, 10.0.0.1", "cf-connecting-ip": "192.0.2.44" });
await post("insert an error log through the edge", "app_error_logs", errorPayload(sessionId(5)));
withHeaders(null);

/** The key the pace rules file an address under: normalised, then hashed with the database's salt. */
const writerKey = async (address) =>
  (await one(`select public.hash_client_address(public.normalize_client_address($1)) as key`, [address]))?.key ?? null;
/** Sets a counter to `count` inside a window that opened just now, so the next request is the one that decides. */
const presetCounter = (key, count) =>
  db.query(
    `insert into public.telemetry_rate_limits (actor_key, window_started_at, request_count) values ($1, now(), $2)
     on conflict (actor_key) do update set window_started_at = now(), request_count = excluded.request_count`,
    [key, count],
  );

{
  const { rows } = await db.query(`select actor_key from public.telemetry_rate_limits`);
  const keys = rows.map((row) => row.actor_key);
  check(keys.includes(`tele-ip:${await writerKey("203.0.113.9")}`), `the right-most forwarded hop was not the rate-limit key: ${keys.join(", ")}`);
  check(keys.includes(`tele-ip:${await writerKey("192.0.2.44")}`), `cf-connecting-ip was not preferred: ${keys.join(", ")}`);
  for (const written of ["6.6.6.6", "7.7.7.7"]) {
    check(!keys.includes(`tele-ip:${await writerKey(written)}`), `a client-written forwarded address (${written}) became a rate-limit key.`);
  }
  // Nothing stored is an address: every key's writer part is the keyed hash.
  check(
    !keys.some((key) => /(^|[:|])[0-9]{1,3}(\.[0-9]{1,3}){3}($|[|/])/.test(key) || /[0-9a-f]{1,4}:[0-9a-f:]*:/i.test(key.replace(/^[a-z-]+:/, ""))),
    `a rate-limit key still holds an address: ${keys.join(", ")}`,
  );
}

// One IPv6 customer is one writer, whichever host address the request came
// from, and an IPv4 address is itself however it is spelled.
{
  const normalize = async (address) => (await one(`select public.normalize_client_address($1) as a`, [address]))?.a ?? null;
  const cases = [
    ["2001:db8:12:34:aaaa:bbbb:cccc:dddd", "2001:db8:12:34::/64"],
    ["2001:DB8:12:34::1", "2001:db8:12:34::/64"],
    ["2001:db8:12:35::1", "2001:db8:12:35::/64"],
    ["::ffff:203.0.113.9", "203.0.113.9"],
    ["::ffff:cb00:7109", "203.0.113.9"],
    ["203.0.113.9", "203.0.113.9"],
    ["203.0.113.9:51234", "203.0.113.9"],
    ["[2001:db8:12:34::1]:443", "2001:db8:12:34::/64"],
    ["not-an-address", null],
    ["999.1.1.1", null],
    ["", null],
  ];
  for (const [address, expected] of cases) {
    const actual = await normalize(address);
    check(actual === expected, `normalize_client_address('${address}') is ${actual}; expected ${expected}.`);
  }
  check(
    (await writerKey("2001:db8:12:34::1")) === (await writerKey("2001:db8:12:34:ffff:ffff:ffff:ffff")),
    "two addresses in one IPv6 /64 are two writers; every per-address limit resets on demand.",
  );
  check((await writerKey("2001:db8:12:34::1")) !== (await writerKey("2001:db8:12:35::1")), "two IPv6 /64s share one writer key.");
  check(/^[0-9a-f]{32}$/.test((await writerKey("203.0.113.9")) ?? ""), "the writer key is not a 32-character hash.");
  await db.query(`delete from public.private_settings where name = 'address_salt'`);
  await raises("key a writer with no salt", "service_role", `select public.hash_client_address('203.0.113.9')`, [], /salt is missing/);
  await db.query(`insert into public.private_settings (name, value) values ('address_salt', repeat('ab', 32))`);
}

// ---- telemetry limits, each driven to its edge

withHeaders({ "x-forwarded-for": "198.51.100.70" });
{
  // 240 an hour for one device on one address.
  const deviceKey = `tele:${await writerKey("198.51.100.70")}|${sessionId(6)}`;
  await presetCounter(deviceKey, 239);
  await post("send a device's 240th telemetry row of the hour", "app_error_logs", errorPayload(sessionId(6)));
  await postRefused("send a device's 241st telemetry row of the hour", "app_error_logs", errorPayload(sessionId(6)), /^PT429 .*rate limit/);
  // 1,200 an hour for an address, whatever the device.
  await presetCounter(`tele-ip:${await writerKey("198.51.100.70")}`, 1199);
  await post("send an address's 1,200th telemetry row of the hour", "app_error_logs", errorPayload(sessionId(7)));
  await postRefused("send an address's 1,201st telemetry row of the hour", "app_error_logs", errorPayload(sessionId(8)), /^PT429 .*rate limit/);
}
withHeaders({ "x-forwarded-for": "198.51.100.71" });
{
  // A replay is dropped for free 600 times an hour, then refused.
  const replay = casePayload({ session: sessionId(9), runId: "run-replay-1", caseId: "case01" });
  await post("insert a case row to replay", "playtest_sessions", replay);
  await presetCounter(`tele-replay:${await writerKey("198.51.100.71")}`, 599);
  await post("replay a case row for the 600th time in an hour", "playtest_sessions", { ...replay, event_id: uuid() });
  await postRefused("replay a case row for the 601st time in an hour", "playtest_sessions", { ...replay, event_id: uuid() }, /^PT429 .*rate limit/);

  // Everyone together: a day's bytes, and it fails closed.
  await db.query(`insert into public.private_settings (name, value) values ('telemetry_daily_bytes', '1000')
                  on conflict (name) do update set value = excluded.value`);
  await postRefused("write telemetry past the daily ceiling", "app_error_logs", errorPayload(sessionId(9)), /^PT429 .*daily ceiling/);
  await db.query(`delete from public.private_settings where name = 'telemetry_daily_bytes'`);
  await post("write telemetry under the default daily ceiling", "app_error_logs", errorPayload(sessionId(9)));
}
withHeaders({ "x-forwarded-for": "198.51.100.72" });
{
  // One address: a day's bytes of its own, 32 MB, below everyone's 200 MB
  // (20261006000000). The counter is set one byte short of the limit, so the
  // next row, whatever its size, is the one that goes over.
  const address = await writerKey("198.51.100.72");
  const everyone = async () => (await one(`select request_count as n from public.telemetry_rate_limits where actor_key = 'global:telemetry-bytes'`))?.n ?? 0;
  await post("write telemetry from an address under its daily bytes", "app_error_logs", errorPayload(sessionId(40)));
  const charged = (await one(`select request_count as n from public.telemetry_rate_limits where actor_key = $1`, [`tele-bytes-ip:${address}`]))?.n ?? 0;
  check(charged > 200 && charged < 196608, `a telemetry row charged its address ${charged} bytes; expected the size of the row.`);
  await presetCounter(`tele-bytes-ip:${address}`, 33554432 - 1);
  const before = await everyone();
  await postRefused("write telemetry past an address's daily bytes", "app_error_logs", errorPayload(sessionId(40)), /^PT429 .*address daily budget/);
  await postRefused("write a case row past an address's daily bytes", "playtest_sessions", casePayload({ session: sessionId(41), runId: "run-bytes-1", caseId: "case01" }), /^PT429 .*address daily budget/);
  await postRefused("write feedback past an address's daily bytes", "playtest_feedback", feedbackPayload(sessionId(41)), /^PT429 .*address daily budget/);
  // The refusal rolls back what the same insert charged everyone: an address
  // at its limit does not spend the day's ceiling for the others.
  check((await everyone()) === before, "a row refused for its address's bytes was still charged to the global daily ceiling.");
  // The owner's number wins over the default, in either direction.
  await db.query(`insert into public.private_settings (name, value) values ('telemetry_address_daily_bytes', '67108864')
                  on conflict (name) do update set value = excluded.value`);
  await post("write telemetry under a raised address budget", "app_error_logs", errorPayload(sessionId(40)));
  await db.query(`delete from public.private_settings where name = 'telemetry_address_daily_bytes'`);
}
withHeaders({ "x-forwarded-for": "198.51.100.73" });
// Another address is not held by the first one's counter.
await post("write telemetry from a second address while the first is at its limit", "app_error_logs", errorPayload(sessionId(42)));
withHeaders({ "x-forwarded-for": "198.51.100.74" });
{
  // A ceiling set above what the counter can count to is still a ceiling. The
  // counter stops at two billion, and `count <= limit` was true for ever after
  // (20261007010000): the rule that fails closed had stopped failing.
  const counter = async () => (await one(`select request_count as n, window_started_at as at from public.telemetry_rate_limits where actor_key = 'global:telemetry-bytes'`)) ?? null;
  const before = await counter();
  await db.query(`insert into public.private_settings (name, value) values ('telemetry_daily_bytes', '3000000000')
                  on conflict (name) do update set value = excluded.value`);
  await post("write telemetry under a ceiling set past two billion", "app_error_logs", errorPayload(sessionId(43)));
  await presetCounter("global:telemetry-bytes", 1999999999);
  await postRefused("write telemetry once the counter can count no further", "app_error_logs", errorPayload(sessionId(43)), /^PT429 .*daily ceiling/);
  await db.query(`delete from public.private_settings where name = 'telemetry_daily_bytes'`);
  // The day's count goes back to what the checks before this one had written.
  if (before) await db.query(`update public.telemetry_rate_limits set request_count = $1, window_started_at = $2 where actor_key = 'global:telemetry-bytes'`, [before.n, before.at]);
  else await db.query(`delete from public.telemetry_rate_limits where actor_key = 'global:telemetry-bytes'`);
}
withHeaders(null);

// Sizes, at the caps the measured payloads set (20260929010000). The largest
// honest shapes pass; one step past each cap does not.
{
  const honest = casePayload({ session: sessionId(1), runId: "run-size-1", caseId: "case07" });
  const fullLog = Array.from({ length: 30 }, (_, index) => decisionEntry("case07", index));
  await post("send a case row with a thirty-scene log", "playtest_sessions", { ...honest, decision_log: fullLog });
  const oversize = (runId, caseId, patch) => ({ ...casePayload({ session: sessionId(1), runId, caseId }), ...patch });
  await postRefused("send a 61-entry decision log", "playtest_sessions",
    oversize("run-size-2", "case08", { decision_log: Array.from({ length: 61 }, () => ({ nodeId: "n" })) }), /invalid playtest session payload/);
  await postRefused("send a 9 KB decision entry", "playtest_sessions",
    oversize("run-size-3", "case08", { decision_log: [{ echo: "x".repeat(9000) }] }), /too large/);
  await postRefused("send a 5 KB summary", "playtest_sessions",
    oversize("run-size-4", "case08", { summary: { note: "x".repeat(5000) } }), /too large/);
  await postRefused("send 2 KB of triggers", "playtest_sessions",
    oversize("run-size-5", "case08", { triggers: { note: "x".repeat(2000) } }), /too large/);
  await postRefused("send 3 KB of dynamics", "playtest_sessions",
    oversize("run-size-6", "case08", { dynamics: { note: "x".repeat(3000) } }), /too large/);
  await postRefused("send a 200 KB row", "playtest_sessions",
    oversize("run-size-7", "case08", { decision_log: Array.from({ length: 30 }, () => ({ echo: "x".repeat(7000) })) }), /too large/);
}

// Relics: a run may hold every relic the client has, and the server takes that
// many. The cap was 9 while the table had twelve, with nothing here to tie the
// two together, so a run's tenth relic cost it every case row after it and its
// place in the ranking (20261007000000). The honest row is built from a run
// that holds all of them, by the builder the runtime uses.
{
  const SERVER_RELIC_LIMIT = 16;
  const withRelics = (runId, caseId, relics) => {
    const payload = casePayload({ session: sessionId(1), runId, caseId });
    return { ...payload, dynamics: { ...payload.dynamics, relics } };
  };
  const everyRelic = createRunSummary({ ...RUN_INITIAL_STATE, relics: [...RELIC_IDS] }).relics;
  check(everyRelic.length === RELIC_IDS.length, `a run holding every relic summarises ${everyRelic.length} of ${RELIC_IDS.length}.`);
  check(
    RELIC_IDS.length <= SERVER_RELIC_LIMIT,
    `src/gauntlet/relics.js has ${RELIC_IDS.length} relics and playtest_sessions_dynamics_shape takes ${SERVER_RELIC_LIMIT}. ` +
      "Add a migration that raises the limit before the relics ship, or a full run loses its case rows.",
  );
  await post("send a case row from a run holding every relic", "playtest_sessions", withRelics("run-relics-1", "case09", everyRelic));
  const filler = (count) => Array.from({ length: count }, (_, index) => RELIC_IDS[index] ?? `relic${index}`);
  await post(`send a case row with ${SERVER_RELIC_LIMIT} relics`, "playtest_sessions", withRelics("run-relics-2", "case09", filler(SERVER_RELIC_LIMIT)));
  await postRefused(`send a case row with ${SERVER_RELIC_LIMIT + 1} relics`, "playtest_sessions", withRelics("run-relics-3", "case09", filler(SERVER_RELIC_LIMIT + 1)), /^23514 /);
}

// The hand's keys in `dynamics` (20261011010000): the logic streak's two and
// the hand's share of the vault are numbers when they are there, and a row
// without them -- a client from before the streak -- is taken as it was. The
// three keys of the beat table keep the same rule for the tabs and queues that
// still send them.
{
  const built = createRunSummary(RUN_INITIAL_STATE);
  const NEW_KEYS = ["logicStreak", "bestLogic", "handVault"];
  const RETIRED_KEYS = ["beatCombo", "bestCombo", "grooveVault"];
  check(
    NEW_KEYS.every((key) => typeof built[key] === "number") && RETIRED_KEYS.every((key) => !(key in built)),
    `the run summary the client builds no longer has the hand's keys this check types: ${JSON.stringify(Object.keys(built))}. ` +
      "Bring playtest_sessions_dynamics_shape and this block in step with createRunSummary in src/gauntlet/gauntletEngine.js.",
  );
  let shapeRun = 0;
  const withDynamics = (patch, drop = []) => {
    const payload = casePayload({ session: sessionId(1), runId: `run-shape-${++shapeRun}`, caseId: "case10" });
    const dynamics = { ...payload.dynamics, ...patch };
    for (const key of drop) delete dynamics[key];
    return { ...payload, dynamics };
  };
  // A run summary as a save can hold it: a streak and a share of the vault that are not zero.
  await post("send a case row whose hand holds a streak and a share of the vault", "playtest_sessions", withDynamics({ logicStreak: 12, bestLogic: 17, handVault: 140, vault: 320 }));
  await post("send a case row with none of the hand's keys", "playtest_sessions", withDynamics({}, [...NEW_KEYS]));
  await post("send the case row a beat-table build sends", "playtest_sessions", withDynamics({ beatCombo: 3, bestCombo: 9, grooveVault: 40 }, [...NEW_KEYS]));
  for (const key of [...NEW_KEYS, ...RETIRED_KEYS]) {
    await post(`send a case row with ${key} as a number`, "playtest_sessions", withDynamics({ [key]: 5 }));    for (const [kind, value] of [["a string", "5"], ["null", null], ["an object", { value: 5 }], ["an array", [5]], ["a boolean", true]]) {
      await postRefused(`send a case row with ${key} as ${kind}`, "playtest_sessions", withDynamics({ [key]: value }), /^23514 .*playtest_sessions_dynamics_shape/);
    }
  }
  // The table's mark (20261020010000): a number when it is there, and a row without it is taken.
  await post(`send a case row without ${RULES_MARK_KEY}`, "playtest_sessions", withDynamics({}, [RULES_MARK_KEY]));
  await post(`send a case row with ${RULES_MARK_KEY} as a number`, "playtest_sessions", withDynamics({ [RULES_MARK_KEY]: RULES_MARK }));
  for (const [kind, value] of [["a string", String(RULES_MARK)], ["null", null], ["an object", { value: RULES_MARK }], ["an array", [RULES_MARK]], ["a boolean", true]]) {
    await postRefused(`send a case row with ${RULES_MARK_KEY} as ${kind}`, "playtest_sessions", withDynamics({ [RULES_MARK_KEY]: value }), /^23514 .*playtest_sessions_dynamics_shape/);
  }
  const shape = await one(`select convalidated as validated from pg_constraint where conname = 'playtest_sessions_dynamics_shape' and conrelid = 'public.playtest_sessions'::regclass`);
  check(shape?.validated === false, "playtest_sessions_dynamics_shape is validated: adding it re-read every stored row, and a row written under an older shape would have stopped the migration.");
}

// ---- the ranking

const rankedSession = sessionId(10);
/** Dates a run's case rows as if it had been played: the first two hours ago, one every `stepSeconds` after it. */
const spreadRun = (runId, stepSeconds = 60) =>
  db.query(
    `update public.playtest_sessions s
        set completed_at = now() - interval '2 hours' + (t.position * $2::int) * interval '1 second'
       from (select id, row_number() over (order by id) - 1 as position
               from public.playtest_sessions where run_id = $1 and case_id <> 'season-final') t
      where s.id = t.id`,
    [runId, stepSeconds],
  );
/** The run summary a build of the beat table sent as `dynamics`: its three keys, and none of the hand's. */
const beatTableDynamics = ({ logicStreak: _streak, bestLogic: _best, handVault: _hand, ...rest }) => ({ ...rest, beatCombo: 3, bestCombo: 9, grooveVault: 40 });
// `dynamicsOf(caseId, dynamics)` answers with what that case row carries in place of the client's own.
const playRun = async (runId, { backdate = true, session = rankedSession, finalSummary = null, storyCases = [], dynamicsOf = null } = {}) => {
  for (const caseId of CASE_SEQUENCE) {
    const payload = casePayload({ session, runId, caseId, story: storyCases.includes(caseId) });
    if (dynamicsOf) payload.dynamics = dynamicsOf(caseId, payload.dynamics);
    // The finale as the client sends it: the season's two logic numbers ride on its summary (useChoiceCommit).
    if (caseId === "final") payload.summary = { ...payload.summary, burstScore: 88, rank: "A", logicHold: 82, bestLogic: 17, ...(finalSummary ?? {}) };
    const { sql, params } = postgrestInsert("playtest_sessions", payload);
    await db.query(sql, params);
  }
  if (backdate) await spreadRun(runId);
};

withHeaders({ "x-forwarded-for": "198.51.100.20" });
await postRefused("rank a run with no case rows", "playtest_sessions", seasonPayload({ session: rankedSession, runId: "run-ranked-1" }), /^PT425 .*every case of the run/);
await playRun("run-ranked-1", { backdate: false });
await postRefused("rank a run played in under ten minutes", "playtest_sessions", seasonPayload({ session: rankedSession, runId: "run-ranked-1" }), /^PT425 .*implausibly short/);
// Every row two hours old and none of them apart: a season flushed in one burst.
await db.query(`update public.playtest_sessions set completed_at = now() - interval '2 hours' where run_id = 'run-ranked-1'`);
await postRefused("rank a run whose rows all arrived together", "playtest_sessions", seasonPayload({ session: rankedSession, runId: "run-ranked-1" }), /^P0001 .*watch it/);
await spreadRun("run-ranked-1", 10);
await postRefused("rank a run played in nine minutes", "playtest_sessions", seasonPayload({ session: rankedSession, runId: "run-ranked-1" }), /^P0001 .*watch it/);
await spreadRun("run-ranked-1");
await postRefused("rank the run from a device that did not play its final case", "playtest_sessions", seasonPayload({ session: sessionId(11), runId: "run-ranked-1" }), /^PT425 .*every case of the run/);
{
  // What the client puts in a ranking row is not what is published. The title,
  // the score and every summary key come from the server's own copy of the run.
  const forged = seasonPayload({ session: rankedSession, runId: "run-ranked-1" });
  forged.case_title = "읽어 보세요 spam.example";
  forged.summary = {
    ...forged.summary,
    burstScore: 100,
    rank: "S",
    primary: [{ toString: "x" }, "y"],
    note: "여기에 아무 글이나 실을 수 있었다",
    trigger: { nested: true },
  };
  await post("rank a run the server watched being played", "playtest_sessions", forged);
  const row = await one(`select case_title, summary, score from public.playtest_sessions where case_id = 'season-final' and run_id = 'run-ranked-1'`);
  check(row?.case_title === "SEASON 01 COMPLETE", `a ranking row kept the client's title (${row?.case_title}).`);
  check(Number(row?.score) === 88 && row?.summary?.rank === "A", `a ranking row took its score from the request (${row?.score}, ${row?.summary?.rank}), not from the run's final case.`);
  check(!("note" in (row?.summary ?? {})) && !("trigger" in (row?.summary ?? {})), "a ranking summary published a key that is not on the whitelist.");
  // The season's two logic numbers ride on the final case row's summary, and
  // the whitelist publishes them from there (20261011000000). The per-case
  // record they were made from is an object and stays on the case row.
  const finalRow = await one(`select summary from public.playtest_sessions where case_id = 'final' and run_id = 'run-ranked-1'`);
  check(finalRow?.summary?.logicHold === 82 && finalRow?.summary?.bestLogic === 17 && finalRow?.summary?.logicRecord?.windows === 6, `the final case row did not keep the logic record it was sent: ${JSON.stringify(finalRow?.summary?.logicRecord)}`);
  check(
    row?.summary?.logicHold === 82 && row?.summary?.bestLogic === 17,
    `a ranking summary does not carry the logic numbers of the run's final case row: ${JSON.stringify([row?.summary?.logicHold, row?.summary?.bestLogic])}`,
  );
  check(!("logicRecord" in (row?.summary ?? {})), "a ranking summary published the final case's logic record.");
  check(
    Array.isArray(row?.summary?.primary) && typeof row.summary.primary[0] === "string" && typeof row.summary.primary[1] === "number",
    `a ranking summary's primary is not [name, number]: ${JSON.stringify(row?.summary?.primary)}`,
  );
  check(row?.summary?.seasonComplete === true && row?.summary?.completedCaseCount === CASE_SEQUENCE.length, "a ranking summary lost seasonComplete or the case count.");
  check(
    typeof row?.summary?.endingVariant === "string" && row.summary.endingVariant === getEndingVariant({ resources: initialResources }).id,
    `a ranking summary does not carry the ending the run's final case row named: ${JSON.stringify(row?.summary?.endingVariant)}`,
  );
  check(
    Object.values(row?.summary ?? {}).every((value) => ["string", "number", "boolean"].includes(typeof value) || Array.isArray(value)),
    `a ranking summary carries an object: ${JSON.stringify(row?.summary)}`,
  );
}
await post("send a second ranking row for the same run", "playtest_sessions", seasonPayload({ session: rankedSession, runId: "run-ranked-1" }));
check(
  (await one(`select count(*)::int as n from public.playtest_sessions where case_id = 'season-final' and run_id = 'run-ranked-1'`))?.n === 1,
  "a run has two ranking rows; one run must rank once.",
);
await playRun("run-ranked-2");
await post("rank a second run with seasonComplete '1'", "playtest_sessions", seasonPayload({ session: rankedSession, runId: "run-ranked-2", seasonComplete: "1" }));
await playRun("run-ranked-3");
await postRefused("rank a third run from one device in a day", "playtest_sessions", seasonPayload({ session: rankedSession, runId: "run-ranked-3" }), /^PT429 .*limit reached/);
{
  // A final case whose summary carries no usable score cannot rank at all.
  await playRun("run-ranked-4", { session: sessionId(12), finalSummary: { burstScore: "100", rank: "S" } });
  await postRefused("rank a run whose final case has no numeric score", "playtest_sessions", seasonPayload({ session: sessionId(12), runId: "run-ranked-4" }), /invalid season ranking score/);
  // Story mode (20261010000000): one case closed in it keeps the season off
  // the ranking. The client sends no ranking row for such a season; this is a
  // client that sends one anyway. The run is whole, watched and well spaced --
  // run-ranked-1 above is the same run without the mark, and it ranked -- so
  // the mark on one case row in the middle is all there is to refuse, and the
  // refusal is a plain one (400), which the client's queue lets go.
  const storyCase = CASE_SEQUENCE[Math.floor(CASE_SEQUENCE.length / 2)];
  await playRun("run-ranked-story", { session: sessionId(14), storyCases: [storyCase] });
  const marked = await one(
    `select count(*) filter (where summary->'assistStory' = 'true'::jsonb)::int as story, count(*)::int as n
       from public.playtest_sessions where run_id = 'run-ranked-story'`,
  );
  check(
    marked?.story === 1 && marked?.n === CASE_SEQUENCE.length,
    `a story run's case rows did not land as sent: ${marked?.story} of ${marked?.n} carry assistStory, expected 1 of ${CASE_SEQUENCE.length}.`,
  );
  await postRefused("rank a season with one case closed in story mode", "playtest_sessions", seasonPayload({ session: sessionId(14), runId: "run-ranked-story" }), /^P0001 story-mode runs are not ranked$/);
  check(
    (await one(`select count(*)::int as n from public.playtest_sessions where case_id = 'season-final' and run_id = 'run-ranked-story'`))?.n === 0,
    "a season with a story case has a ranking row.",
  );
  // Twenty ranking rows a day for an address, whatever the device.
  await presetCounter(`season-ip:${await writerKey("198.51.100.20")}`, 20);
  await playRun("run-ranked-5", { session: sessionId(13) });
  await postRefused("rank a 21st run from one address in a day", "playtest_sessions", seasonPayload({ session: sessionId(13), runId: "run-ranked-5" }), /^PT429 .*limit reached/);
}
withHeaders(null);

// ---- a season from the beat table stays out (20261011010000)
//
// The reset deleted the row that said "this run is ranked already", so a run
// whose case rows are all stored could ask again. Each run below is whole,
// watched and well spaced, like run-ranked-1, which ranked: what its case rows
// carry in `dynamics` is all there is to refuse.
withHeaders({ "x-forwarded-for": "198.51.100.21" });
{
  const BEAT_REFUSAL = /^P0001 beat-table runs are not ranked$/;
  const rankingRows = async (runId) => (await one(`select count(*)::int as n from public.playtest_sessions where case_id = 'season-final' and run_id = $1`, [runId]))?.n;
  const marked = (runId) => one(
    `select (count(*) filter (where jsonb_typeof(dynamics->'logicStreak') = 'number'))::int as logic, count(*)::int as n
       from public.playtest_sessions where run_id = $1 and case_id <> 'season-final'`,
    [runId],
  );
  const refusedRun = async (label, runId, session, expected, pattern = BEAT_REFUSAL) => {
    const rows = await marked(runId);
    check(rows?.n === CASE_SEQUENCE.length && rows?.logic === expected, `${runId}'s case rows did not land as sent: ${rows?.logic} of ${rows?.n} carry logicStreak, expected ${expected} of ${CASE_SEQUENCE.length}.`);
    await postRefused(label, "playtest_sessions", seasonPayload({ session, runId }), pattern);
    check((await rankingRows(runId)) === 0, `${runId} has a ranking row; a season with a case from the beat table must have none.`);
  };

  // The run that ranked is the one every case row of which carries the mark,
  // and it is the run summary the client builds that carries it.
  check(typeof createRunSummary(RUN_INITIAL_STATE).logicStreak === "number", "the run summary the client builds has no numeric logicStreak; every season would be refused as one from the beat table.");
  const ranked = await marked("run-ranked-1");
  check(
    ranked?.logic === CASE_SEQUENCE.length && (await rankingRows("run-ranked-1")) === 1,
    `run-ranked-1 has ${await rankingRows("run-ranked-1")} ranking rows with ${ranked?.logic} of ${ranked?.n} case rows carrying logicStreak; the run that ranks is the one with all of them.`,
  );

  // A season finished at the beat table, as the reset leaves it: every case
  // row stored, three days old, its ranking row gone. It was ranked once --
  // the row is put in place and deleted the way the migration deletes it.
  await playRun("run-beat-1", { session: sessionId(15), dynamicsOf: (_caseId, dynamics) => beatTableDynamics(dynamics) });
  await db.query(`update public.playtest_sessions set completed_at = completed_at - interval '3 days' where run_id = 'run-beat-1'`);
  await db.exec(`set session_replication_role = replica`);
  try {
    await db.query(
      `insert into public.playtest_sessions (session_id, run_id, session_code, case_id, case_title, summary)
       values ($1, 'run-beat-1', 'BEAT', 'season-final', 'SEASON 01 COMPLETE', '{"seasonComplete": true, "burstScore": 88, "rank": "A"}')`,
      [sessionId(15)],
    );
  } finally {
    await db.exec(`set session_replication_role = origin`);
  }
  check((await rankingRows("run-beat-1")) === 1, "the beat-table run's old ranking row was not put in place.");
  await post("send the ranking row of a ranked beat-table run again before the reset", "playtest_sessions", seasonPayload({ session: sessionId(15), runId: "run-beat-1" }));
  await db.query(`delete from public.playtest_sessions where case_id = 'season-final' and run_id = 'run-beat-1'`);
  await refusedRun("rank a season finished at the beat table again after the reset", "run-beat-1", sessionId(15), 0);

  // Begun at the beat table and finished at this one: the first ten cases are the old build's.
  const early = CASE_SEQUENCE.slice(0, 10);
  await playRun("run-beat-2", { session: sessionId(16), dynamicsOf: (caseId, dynamics) => (early.includes(caseId) ? beatTableDynamics(dynamics) : dynamics) });
  await refusedRun("rank a season begun at the beat table and finished at the logic table", "run-beat-2", sessionId(16), CASE_SEQUENCE.length - 10);

  // One case row with no `dynamics` at all is not a logic-table row either:
  // the client sends the run summary with every case row.
  const middle = CASE_SEQUENCE[Math.floor(CASE_SEQUENCE.length / 2)];
  check(casePayload({ session: sessionId(17), runId: "run-beat-probe", caseId: middle }).dynamics?.logicStreak === 0, "the case row this check builds carries no logicStreak in dynamics.");
  await playRun("run-beat-3", { session: sessionId(17), dynamicsOf: (caseId, dynamics) => (caseId === middle ? null : dynamics) });
  await refusedRun("rank a season with one case row that carries no dynamics", "run-beat-3", sessionId(17), CASE_SEQUENCE.length - 1);

  // Both a story season and a beat-table one: the story check stands first, so it is told that.
  await playRun("run-beat-story", { session: sessionId(19), storyCases: [middle], dynamicsOf: (_caseId, dynamics) => beatTableDynamics(dynamics) });
  await refusedRun("rank a story season from the beat table", "run-beat-story", sessionId(19), 0, /^P0001 story-mode runs are not ranked$/);

  // What the client's queue makes of the refusal: PostgREST answers a plain
  // exception 400, and the row is dropped -- not sent again, and not read as a
  // run that is missing a case.
  const refusal = { status: 400, serverMessage: "beat-table runs are not ranked" };
  check(classifyTelemetryFailure(refusal) === "permanent", `the client's queue reads the beat-table refusal as "${classifyTelemetryFailure(refusal)}"; it has to let the row go.`);
  check(!isUnrankableRefusal({ type: "case", payload: { case_id: "season-final" } }, refusal), "the client's queue reads the beat-table refusal as a run missing a case row.");
}
withHeaders(null);

// ---- a season from the table before 2026-10-20 stays out (20261020010000)
//
// The day-ten table (fracture 8, LOGIC_CAP x1.6 and LOCK_CAP x1.5, five tool
// slots, SCOUT). The key is RULES_MARK_KEY (gauntletEngine.js) and the message
// below is the migration's.
// The same four runs as the beat-table block above, one table later: each is
// whole, watched and well spaced, and what its case rows carry in `dynamics`
// is all there is to refuse.
withHeaders({ "x-forwarded-for": "198.51.100.22" });
{
  const OLDER_MESSAGE = "older-table runs are not ranked";
  const OLDER_REFUSAL = new RegExp(`^P0001 ${OLDER_MESSAGE}$`);
  /** The run summary a build of the table before sent as `dynamics`: this one's, without the mark. */
  const olderTableDynamics = ({ [RULES_MARK_KEY]: _mark, ...rest }) => rest;
  const rankingRows = async (runId) => (await one(`select count(*)::int as n from public.playtest_sessions where case_id = 'season-final' and run_id = $1`, [runId]))?.n;
  const marked = (runId) => one(
    `select (count(*) filter (where jsonb_typeof(dynamics->'${RULES_MARK_KEY}') = 'number' and (dynamics->>'${RULES_MARK_KEY}')::numeric >= ${RULES_MARK}))::int as mark, count(*)::int as n
       from public.playtest_sessions where run_id = $1 and case_id <> 'season-final'`,
    [runId],
  );
  const refusedRun = async (label, runId, session, expected, pattern = OLDER_REFUSAL) => {
    const rows = await marked(runId);
    check(rows?.n === CASE_SEQUENCE.length && rows?.mark === expected, `${runId}'s case rows did not land as sent: ${rows?.mark} of ${rows?.n} carry ${RULES_MARK_KEY}, expected ${expected} of ${CASE_SEQUENCE.length}.`);
    await postRefused(label, "playtest_sessions", seasonPayload({ session, runId }), pattern);
    check((await rankingRows(runId)) === 0, `${runId} has a ranking row; a season with a case from the table before must have none.`);
  };

  // The run that ranked carries the mark on every case row, from the run summary the client builds.
  check(createRunSummary(RUN_INITIAL_STATE)[RULES_MARK_KEY] === RULES_MARK, `the run summary the client builds has no ${RULES_MARK_KEY} of ${RULES_MARK}; every season would be refused as one from the table before.`);
  const ranked = await marked("run-ranked-1");
  check(
    ranked?.mark === CASE_SEQUENCE.length && (await rankingRows("run-ranked-1")) === 1,
    `run-ranked-1 has ${await rankingRows("run-ranked-1")} ranking rows with ${ranked?.mark} of ${ranked?.n} case rows carrying ${RULES_MARK_KEY}; the run that ranks is the one with all of them.`,
  );

  // A season finished at the table before, as the reset leaves it: ranked once, its ranking row deleted.
  await playRun("run-older-1", { session: sessionId(50), dynamicsOf: (_caseId, dynamics) => olderTableDynamics(dynamics) });
  await db.query(`update public.playtest_sessions set completed_at = completed_at - interval '3 days' where run_id = 'run-older-1'`);
  await db.exec(`set session_replication_role = replica`);
  try {
    await db.query(
      `insert into public.playtest_sessions (session_id, run_id, session_code, case_id, case_title, summary)
       values ($1, 'run-older-1', 'OLDER', 'season-final', 'SEASON 01 COMPLETE', '{"seasonComplete": true, "burstScore": 88, "rank": "A"}')`,
      [sessionId(50)],
    );
  } finally {
    await db.exec(`set session_replication_role = origin`);
  }
  check((await rankingRows("run-older-1")) === 1, "the older-table run's old ranking row was not put in place.");
  await post("send the ranking row of a ranked older-table run again before the reset", "playtest_sessions", seasonPayload({ session: sessionId(50), runId: "run-older-1" }));
  await db.query(`delete from public.playtest_sessions where case_id = 'season-final' and run_id = 'run-older-1'`);
  await refusedRun("rank a season finished at the table before again after the reset", "run-older-1", sessionId(50), 0);

  // Begun at the table before and finished at this one: the first ten cases are the old build's.
  const early = CASE_SEQUENCE.slice(0, 10);
  await playRun("run-older-2", { session: sessionId(51), dynamicsOf: (caseId, dynamics) => (early.includes(caseId) ? olderTableDynamics(dynamics) : dynamics) });
  await refusedRun("rank a season begun at the table before and finished at this one", "run-older-2", sessionId(51), CASE_SEQUENCE.length - 10);

  // One case row whose mark is a number below this table's: a smaller number is an older table.
  const middle = CASE_SEQUENCE[Math.floor(CASE_SEQUENCE.length / 2)];
  await playRun("run-older-3", { session: sessionId(52), dynamicsOf: (caseId, dynamics) => (caseId === middle ? { ...dynamics, [RULES_MARK_KEY]: RULES_MARK - 1 } : dynamics) });
  await refusedRun("rank a season with one case row that carries an older mark", "run-older-3", sessionId(52), CASE_SEQUENCE.length - 1);

  // Both a beat-table season and one from the table before: the beat check stands first, so it is told that.
  await playRun("run-older-beat", { session: sessionId(53), dynamicsOf: (_caseId, dynamics) => olderTableDynamics(beatTableDynamics(dynamics)) });
  await refusedRun("rank a beat-table season with no table mark", "run-older-beat", sessionId(53), 0, /^P0001 beat-table runs are not ranked$/);

  // What the client's queue makes of the refusal: dropped, and told as a season that will not rank.
  const refusal = { status: 400, serverMessage: OLDER_MESSAGE };
  const seasonItem = { type: "case", payload: { case_id: "season-final" } };
  check(classifyTelemetryFailure(refusal) === "permanent", `the client's queue reads the older-table refusal as "${classifyTelemetryFailure(refusal)}"; it has to let the row go.`);
  check(!isUnrankableRefusal(seasonItem, refusal), "the client's queue reads the older-table refusal as a run missing a case row.");
  check(isBeatTableRefusal(seasonItem, refusal), "the client's queue does not tell the older-table refusal as a season that will not rank (BEAT_TABLE_REFUSAL in src/state/telemetryBatch.js).");
}
withHeaders(null);

{
  const result = await allowed(
    "read the ranking the way the client does",
    "anon",
    `select run_tag, player_name, case_id, case_title, completed_at, summary, score, week
     from public.public_rankings where week is null order by score desc nulls last, completed_at asc limit 100`,
  );
  const rows = result?.rows ?? [];
  check(rows.length === 2, `the ranking shows ${rows.length} rows; expected the two accepted runs (the '1' one normalised to true).`);
  check(rows.every((row) => new Date(row.completed_at) <= new Date()), "a ranking row is dated in the future.");
  check(rows.every((row) => !("runId" in row.summary)), "a ranking summary still carries the full runId.");
  check(rows.every((row) => /^[A-Z0-9]{1,8}$/.test(row.run_tag)), "run_tag is not the short tag the ranking prints.");
  check(rows.every((row) => row.case_title === "SEASON 01 COMPLETE"), "a ranking row's title is not the constant.");
  check(rows.every((row) => row.week === null), "a season played without a rule is not on the ordinary board (week is null).");
}
await refused("read a ranking row's full run_id", "anon", `select run_id from public.playtest_sessions`);
await refused("read a ranking row's session_code", "anon", `select session_code from public.public_rankings`, /^42(501|703) /);
await allowed("read telemetry health", "anon", `select * from public.telemetry_health limit 1`);

// ---- the ranking's suspicion marks (*_ranking_suspicion_marks.sql)
//
// Every run below is whole, watched and well spaced, like run-ranked-1, so the
// validator takes each one. What differs is what the marks are for, and the
// rule is that none of it is refused: every ranking row is stored, and only
// its `suspicion` says what failed. The runs are taken out again at the end,
// so the hold-rate pool below is the one it always was.
if (!SUSPICION_MARKS) {
  console.log("Suspicion marks: skipped, the migration is still a draft (supabase/migrations/*_ranking_suspicion_marks.sql.draft).");
} else {
  // The thresholds are written twice, once in gameLogic.js and once in SQL.
  const logicSource = readFileSync(path.join(root, "src", "gameLogic.js"), "utf8");
  const rankLine = logicSource.match(/rank: momentumScore >= (\d+) \? "S" : momentumScore >= (\d+) \? "A" : momentumScore >= (\d+) \? "B" : "C"/);
  const tierLine = logicSource.match(/momentumTier: momentumScore >= (\d+) \? "BURST" : momentumScore >= (\d+) \? "FLOW" : momentumScore >= (\d+) \? "READY" : "BUILDING"/);
  if (!rankLine || !tierLine) {
    failures.push("could not read the rank and tier thresholds from src/gameLogic.js (getGameplayStats); the marks' copies can no longer be held to them.");
  } else {
    const [s, a, b] = rankLine.slice(1).map(Number);
    const [burst, flow, ready] = tierLine.slice(1).map(Number);
    const { rows } = await db.query(
      `select n, public.ranking_rank_for(n) as rank, public.ranking_tier_for(n) as tier from generate_series(0, 100) n`,
    );
    const off = rows.filter(({ n, rank, tier }) =>
      rank !== (n >= s ? "S" : n >= a ? "A" : n >= b ? "B" : "C") || tier !== (n >= burst ? "BURST" : n >= flow ? "FLOW" : n >= ready ? "READY" : "BUILDING"));
    check(off.length === 0, `ranking_rank_for / ranking_tier_for disagree with gameLogic.js at ${off.map(({ n }) => n).join(", ")}; bring the migration's thresholds in step.`);
  }

  withHeaders({ "x-forwarded-for": "198.51.100.22" });
  const honest = { burstScore: 88, momentumScore: 88, rank: "S", momentumTier: "BURST" };
  const marksOf = async (runId) =>
    (await one(`select suspicion from public.playtest_sessions where case_id = 'season-final' and run_id = $1`, [runId]))?.suspicion ?? null;
  let n = 40;
  const markedRun = async (label, runId, expected, { finalSummary = honest, stepSeconds = 60, after = null } = {}) => {
    const session = sessionId(n++);
    await playRun(runId, { session, finalSummary });
    if (stepSeconds !== 60) await spreadRun(runId, stepSeconds);
    if (after) await after(runId);
    await post(`rank ${label}`, "playtest_sessions", seasonPayload({ session, runId }));
    const marks = await marksOf(runId);
    check(
      Array.isArray(marks) && JSON.stringify([...marks].sort()) === JSON.stringify([...expected].sort()),
      `${label}: the ranking row's marks are ${JSON.stringify(marks)}, expected ${JSON.stringify(expected)}.`,
    );
  };

  await markedRun("an honest season", "run-marks-honest", []);
  await markedRun("a season whose rank is not the letter its score earns", "run-marks-rank", ["rank-off-score"], { finalSummary: { ...honest, rank: "A" } });
  await markedRun("a season whose tier is not the one its score earns", "run-marks-tier", ["tier-off-score"], { finalSummary: { ...honest, momentumTier: "READY" } });
  await markedRun("a season with a broken, two-faced score", "run-marks-score", ["score-twins-differ", "score-not-whole"], { finalSummary: { ...honest, burstScore: 99.5 } });
  await markedRun("a season with a part above 100", "run-marks-part", ["part-out-of-range"], { finalSummary: { ...honest, consistencyScore: 140 } });
  // 54 gaps of 20 seconds is 18 minutes, past the validator's fifteen; the
  // decisions of those cases claim 40 (6 of 7.4 seconds a case).
  await markedRun("a season whose decisions took longer than the server saw pass", "run-marks-time", ["time-over-gap"], { stepSeconds: 20 });
  await markedRun("a season with a wall no table deals", "run-marks-wall", ["wall-out-of-range"], {
    after: (runId) =>
      db.query(
        `update public.playtest_sessions set decision_log = jsonb_set(decision_log, '{0,threshold,wall}', '140'::jsonb)
          where run_id = $1 and case_id = $2`,
        [runId, CASE_SEQUENCE[3]],
      ),
  });
  // The fixture's own finale (88 ranked "A") is one the marks catch. It sets
  // burstScore and rank only, so momentumScore and momentumTier stay the case
  // summary's own, and those are caught too.
  const fixtureMarks = ["rank-off-score", "score-twins-differ", "tier-off-score"];
  check(JSON.stringify([...((await marksOf("run-ranked-1")) ?? [])].sort()) === JSON.stringify(fixtureMarks), `run-ranked-1 (88 ranked "A") carries ${JSON.stringify(await marksOf("run-ranked-1"))}, expected ${JSON.stringify(fixtureMarks)}.`);
  check(
    (await one(`select count(*)::int as n from public.playtest_sessions where case_id <> 'season-final' and suspicion is not null`))?.n === 0,
    "a case row carries suspicion marks; only ranking rows are marked.",
  );

  // Not published, and not the client's to write.
  await refused("read a ranking row's suspicion marks", "anon", `select suspicion from public.playtest_sessions`);
  await postRefused("send a case row with its own suspicion marks", "playtest_sessions", { ...casePayload({ session: sessionId(39), runId: "run-marks-self", caseId: "case01" }), suspicion: [] }, /^42501 /);

  // The switch: off by default, so the ranking shows every row; on, it shows only the unmarked ones.
  const shown = async () =>
    ((await allowed("read the ranking with marked rows", "anon", `select run_tag from public.public_rankings where case_id = 'season-final'`))?.rows ?? []).length;
  const counts = await one(
    `select count(*)::int as all_rows, (count(*) filter (where coalesce(cardinality(suspicion), 0) = 0))::int as clean
       from public.playtest_sessions where case_id = 'season-final' and summary->>'seasonComplete' = 'true' and score is not null`,
  );
  check((await shown()) === counts.all_rows, `with the switch off the ranking shows ${await shown()} of ${counts.all_rows} rows; marked rows have to stay on it.`);
  await db.query(`insert into public.private_settings (name, value) values ('ranking_hide_marked', '1')`);
  const hidden = await shown();
  check(hidden === counts.clean && hidden >= 1, `with the switch on the ranking shows ${hidden} rows; expected the ${counts.clean} unmarked ones.`);
  await db.query(`delete from public.private_settings where name = 'ranking_hide_marked'`);
  check((await shown()) === counts.all_rows, "the ranking did not come back whole when the switch was turned off.");

  withHeaders(null);
  await db.query(`delete from public.playtest_sessions where run_id like 'run-marks-%'`);
}

// ---- the checker's marks (*_ranking_recheck_marks.sql)
//
// scripts/verify-ranking-rows.mjs names at most two marks for a ranking run;
// ranking_set_recheck_marks writes them into the suspicion column beside the
// insert trigger's. Nobody but the service role may call it. Each call states
// the run's two recheck marks whole and keeps every other mark, and it touches
// the run's ranking row and nothing else.
if (!RECHECK_MARKS || !SUSPICION_MARKS) {
  failures.push("supabase/migrations/*_ranking_recheck_marks.sql is gone, or the suspicion marks are; the checker's marks were checked against nothing.");
} else {
  const call = (runId, marks) => `select public.ranking_set_recheck_marks('${runId}', ${marks === null ? "null" : `array[${marks.map((mark) => `'${mark}'`).join(", ")}]::text[]`}) as marks`;
  await refused("set a ranking row's checker marks", "anon", call("run-recheck-1", ["score-off-log"]));
  await refused("set a ranking row's checker marks", "authenticated", call("run-recheck-1", ["score-off-log"]));

  // Rows put in place with the insert triggers off for these statements only:
  // two ranked runs, one already marked by the trigger, and the first run's final case row.
  await db.exec(`set session_replication_role = replica`);
  try {
    for (const [runId, caseId, suspicion] of [
      ["run-recheck-1", "season-final", ["time-over-gap"]],
      ["run-recheck-1", "final", null],
      ["run-recheck-2", "season-final", ["rank-off-score"]],
    ]) {
      await db.query(
        `insert into public.playtest_sessions (session_id, run_id, session_code, player_name, case_id, case_title, summary, suspicion)
         values ('grants-check-recheck', $1, 'RECHECK', '익명 분석관', $2, 'SEASON 01 COMPLETE', '{"seasonComplete": true, "burstScore": 70, "rank": "B"}'::jsonb, $3)`,
        [runId, caseId, suspicion],
      );
    }
  } finally {
    await db.exec(`set session_replication_role = origin`);
  }
  const marksOf = async (runId, caseId = "season-final") =>
    (await one(`select suspicion from public.playtest_sessions where run_id = $1 and case_id = $2`, [runId, caseId]))?.suspicion ?? null;
  const setMarks = async (label, marks, expected) => {
    const answer = (await allowed(label, "service_role", call("run-recheck-1", marks)))?.rows[0]?.marks ?? null;
    const stored = await marksOf("run-recheck-1");
    check(JSON.stringify(answer) === JSON.stringify(expected) && JSON.stringify(stored) === JSON.stringify(expected), `${label}: answered ${JSON.stringify(answer)}, stored ${JSON.stringify(stored)}, expected ${JSON.stringify(expected)}.`);
  };
  await setMarks("add score-off-log beside the trigger's mark", ["score-off-log"], ["score-off-log", "time-over-gap"]);
  await setMarks("state both checker marks", ["window-off-replay", "score-off-log"], ["score-off-log", "time-over-gap", "window-off-replay"]);
  await setMarks("drop a checker mark the run no longer earns", ["window-off-replay"], ["time-over-gap", "window-off-replay"]);
  await setMarks("clear the checker marks, keeping the trigger's", [], ["time-over-gap"]);
  await raises("set a mark the checker does not own", "service_role", call("run-recheck-1", ["rank-off-score"]), [], /^22023 /);
  await raises("set marks from null", "service_role", call("run-recheck-1", null), [], /^22023 /);
  check(JSON.stringify(await marksOf("run-recheck-1")) === JSON.stringify(["time-over-gap"]), "a refused call changed the ranking row's marks.");
  const none = (await allowed("set marks on a run with no ranking row", "service_role", call("run-recheck-none", ["score-off-log"])))?.rows[0];
  check(none && none.marks === null, `a run with no ranking row answered ${JSON.stringify(none)}; expected null.`);
  check(JSON.stringify(await marksOf("run-recheck-2")) === JSON.stringify(["rank-off-score"]), "setting one run's checker marks changed another run's.");
  check((await marksOf("run-recheck-1", "final")) === null, "setting a run's checker marks marked its case row; only the ranking row is marked.");
  // The checker's write (verify-ranking-rows --marks-sql), as the CI job runs
  // it over the Management API: one statement for every checked run, an empty
  // list for a run that earns nothing, and a run not checked left out.
  const write = marksSql([
    { status: "checked", runId: "run-recheck-1", marks: ["score-off-log"] },
    { status: "checked", runId: "run-recheck-2", marks: [] },
    { status: "unverified", runId: "run-recheck-none", marks: [] },
  ]);
  const wrote = (await one(write))?.marked_rows;
  check(Number(wrote) === 2, `the checker's write marked ${wrote} ranking rows; expected the two checked runs.`);
  check(JSON.stringify(await marksOf("run-recheck-1")) === JSON.stringify(["score-off-log", "time-over-gap"]), `the checker's write left run-recheck-1 with ${JSON.stringify(await marksOf("run-recheck-1"))}.`);
  check(JSON.stringify(await marksOf("run-recheck-2")) === JSON.stringify(["rank-off-score"]), "the checker's write took a trigger's mark from a run that earned none of its own.");
  // The checker's own read (verify-ranking-rows --sql) runs on this schema and
  // brings each ranked run whole: here the top one, every row of it.
  const read = (await allowed("run the checker's read", "service_role", rankingRowsSql({ limit: 1 })))?.rows ?? [];
  const topRun = await one(`select run_id from public.playtest_sessions where case_id = 'season-final' and score is not null order by score desc limit 1`);
  const runRows = (await one(`select count(*)::int as n from public.playtest_sessions where run_id = $1`, [topRun?.run_id]))?.n;
  check(
    read.length > 1 && read.length === runRows && read.every((row) => row.run_id === topRun.run_id && "decision_log" in row && "run_tag" in row) && read.some((row) => row.case_id === "season-final"),
    `the checker's read of the top ranked run brought ${read.length} rows of ${JSON.stringify([...new Set(read.map((row) => row.run_id))])}; expected the ${runRows} rows of ${topRun?.run_id}.`,
  );
  await db.query(`delete from public.playtest_sessions where run_id like 'run-recheck-%'`);
}

// ---- the hold rate's cut points (20261011000000)

{
  // What the client calls: `rpc/logic_hold_cutoffs` with no argument, as anon.
  const cutoffs = async (label) => (await allowed(label, "anon", `select public.logic_hold_cutoffs() as c`))?.rows[0]?.c ?? null;
  // percentile_disc: the first value at or past that share of the ordered pool.
  const cutAt = (values, share) => [...values].sort((a, b) => a - b)[Math.ceil(share * values.length) - 1];
  // Ranking rows put in place without playing fifty seasons: the insert
  // trigger is switched off for these statements only, and `score` is still
  // the column's own reading of `burstScore`.
  let seeded = 0;
  const seed = async (summary) => {
    seeded += 1;
    await db.exec(`set session_replication_role = replica`);
    try {
      await db.query(
        `insert into public.playtest_sessions (session_id, run_id, session_code, player_name, case_id, case_title, summary)
         values ($1, $2, 'CUTOFFS', '익명 분석관', $3, 'SEASON 01 COMPLETE', $4::jsonb)`,
        [`grants-check-cutoffs-${seeded}`, `run-cutoffs-${seeded}`, summary.caseId ?? "season-final", JSON.stringify({ seasonComplete: true, burstScore: 50, rank: "B", ...summary, caseId: undefined })],
      );
    } finally {
      await db.exec(`set session_replication_role = origin`);
    }
  };

  // The two runs ranked above each carry a hold rate of 82.
  const pool = [82, 82];
  const few = await cutoffs("read the hold rate's cut points with two seasons ranked");
  check(few?.n === 2 && Object.keys(few).length === 1, `with two seasons the cut points answered ${JSON.stringify(few)}; expected the count alone.`);

  // Rows that are no part of the pool, whatever their number: a hold rate that
  // is not a number, one outside 0 to 100, a season with no score, one not
  // marked complete, and a case row. None of them may count or move a cut.
  for (const summary of [
    { logicHold: "100" },
    { logicHold: "not a number" },
    { logicHold: null },
    { logicHold: true },
    { logicHold: [100] },
    { logicHold: { value: 100 } },
    { logicHold: 101 },
    { logicHold: -1 },
    { logicHold: 1e9 },
    { bestLogic: 40 },
    { logicHold: 100, burstScore: null },
    { logicHold: 100, burstScore: 101 },
    { logicHold: 100, seasonComplete: "1" },
    { logicHold: 100, seasonComplete: false },
    { logicHold: 100, caseId: "final" },
  ]) await seed(summary);
  const ignored = await cutoffs("read the cut points beside rows that carry no usable hold rate");
  check(ignored?.n === 2 && Object.keys(ignored).length === 1, `rows with no usable hold rate were counted: ${JSON.stringify(ignored)}`);

  // Forty-nine seasons is still the count alone; the fiftieth brings the cuts.
  for (let value = 1; pool.length < 49; value += 2) {
    await seed({ logicHold: value, bestLogic: value });
    pool.push(value);
  }
  const under = await cutoffs("read the cut points with forty-nine seasons");
  check(under?.n === 49 && !("cuts" in (under ?? {})), `with forty-nine seasons the cut points answered ${JSON.stringify(under)}; expected the count alone.`);
  await seed({ logicHold: 100, bestLogic: 3 });
  pool.push(100);
  const full = await cutoffs("read the cut points with fifty seasons");
  const expected = { n: 50, cuts: { 50: cutAt(pool, 0.5), 25: cutAt(pool, 0.75), 10: cutAt(pool, 0.9) } };
  check(JSON.stringify(Object.keys(full ?? {}).sort()) === '["cuts","n"]' && JSON.stringify(Object.keys(full?.cuts ?? {}).sort()) === '["10","25","50"]',
    `the cut points have keys the client does not read, or lack one it does: ${JSON.stringify(full)}`);
  check(
    full?.n === expected.n && [50, 25, 10].every((band) => full?.cuts?.[band] === expected.cuts[band]),
    `with fifty seasons the cut points answered ${JSON.stringify(full)}; expected ${JSON.stringify(expected)}.`,
  );
  check(
    [50, 25, 10].every((band) => Number.isFinite(full?.cuts?.[band]) && full.cuts[band] >= 0 && full.cuts[band] <= 100) && full.cuts[50] <= full.cuts[25] && full.cuts[25] <= full.cuts[10],
    `the cut points are not three ordered numbers from 0 to 100: ${JSON.stringify(full?.cuts)}`,
  );
  // The count and the cuts are of the rows anon can read in the ranking, and
  // the answer does not depend on who asks.
  const visible = await allowed("count the ranking's seasons that carry a hold rate", "anon",
    `select count(*)::int as n from public.public_rankings where jsonb_typeof(summary->'logicHold') = 'number' and (summary->>'logicHold')::numeric between 0 and 100`);
  check(visible?.rows[0]?.n === full?.n, `the cut points were read from ${full?.n} seasons and the ranking shows ${visible?.rows[0]?.n} with a hold rate.`);
  const asService = await allowed("read the cut points", "service_role", `select public.logic_hold_cutoffs() as c`);
  check(JSON.stringify(asService?.rows[0]?.c) === JSON.stringify(full), "the cut points differ for the service role, which reads past the ranking's policy.");

  // Who may ask: anon and the service role, by name. Not PUBLIC, and not
  // `authenticated`, which the app never is.
  await refused("read the hold rate's cut points", "authenticated", `select public.logic_hold_cutoffs()`);
  const fn = await one(
    `select p.prosecdef as definer, p.provolatile as volatility, coalesce(p.proconfig, '{}') as config,
            (select coalesce(array_agg(case a.grantee when 0 then 'public' else a.grantee::regrole::text end), '{}')
               from aclexplode(p.proacl) a where a.privilege_type = 'EXECUTE' and a.grantee <> p.proowner) as grantees
       from pg_proc p where p.oid = 'public.logic_hold_cutoffs()'::regprocedure`,
  );
  check(JSON.stringify([...(fn?.grantees ?? [])].sort()) === '["anon","service_role"]', `logic_hold_cutoffs is executable by ${JSON.stringify(fn?.grantees)}; expected anon and service_role only.`);
  check(fn?.definer === false, "logic_hold_cutoffs is SECURITY DEFINER; it reads what its caller may read and needs no more.");
  check(fn?.volatility === "s" && fn.config.some((setting) => /^search_path=(""|)$/.test(setting)), "logic_hold_cutoffs is not STABLE with an empty search_path.");

  // The whitelist takes the two numbers as numbers and nothing else under those names.
  const published = await allowed("build a public summary", "service_role",
    `select public.ranking_public_summary($1::jsonb) as kept, public.ranking_public_summary($2::jsonb) as dropped`,
    [JSON.stringify({ logicHold: 82.4567, bestLogic: 17 }), JSON.stringify({ logicHold: "82", bestLogic: { best: 17 }, logicRecord: { windows: 6 } })]);
  check(JSON.stringify(published?.rows[0]?.kept) === JSON.stringify({ bestLogic: 17, logicHold: 82.457 }), `the whitelist published ${JSON.stringify(published?.rows[0]?.kept)} for two numeric logic keys.`);
  check(JSON.stringify(published?.rows[0]?.dropped) === "{}", `the whitelist published a logic key that is not a number: ${JSON.stringify(published?.rows[0]?.dropped)}`);

  // The seeded rows go, so everything after this sees the two ranked runs.
  await db.query(`delete from public.playtest_sessions where run_id like 'run-cutoffs-%'`);
  check((await one(`select count(*)::int as n from public.playtest_sessions where case_id = 'season-final'`))?.n === 2, "the cut-point check left ranking rows behind.");
}

// ---- this week's rule (20261021000000_weekly_rule_event.sql)
//
// A season stamps the rule of the week it began in on every case row
// (`dynamics.weekRule`, createRunSummary), and the server, not the device,
// says which week that was: the week of the first case row it received (D1,
// 결정 29, strict). Every run below is whole, watched and well spaced, like
// run-ranked-1, so what its case rows say about the week is all there is to
// take or refuse. The server's calendar is set for the weeks these runs were
// played in -- they are played now, whatever week that is -- and put back to
// the client's at the end, and the runs are taken out again, so the board and
// everything after it see the two ordinary runs ranked above.
{
  const WEEK_MIGRATION = "20261021000000_weekly_rule_event.sql";
  if (!files.includes(WEEK_MIGRATION)) failures.push(`supabase/migrations/${WEEK_MIGRATION} is gone; this week's rule was checked against nothing.`);
  const calendarRows = async () => (await db.query(`select week, rule_id from public.weekly_rules order by week`)).rows.map(({ week, rule_id }) => [week, rule_id]);
  const clientCalendar = WEEKLY_RULES.map(({ week, id }) => [week, id]).sort(([a], [b]) => a.localeCompare(b));
  const serverCalendar = await calendarRows();
  check(JSON.stringify(serverCalendar) === JSON.stringify(clientCalendar), `the server's weekly_rules holds ${JSON.stringify(serverCalendar)}; the client's calendar (src/gauntlet/weeklyCalendar.js) is ${JSON.stringify(clientCalendar)}.`);

  // The server's week is the client's, on the edges that matter: Monday 00:00
  // KST (Sunday 15:00 UTC), and 2026's fifty-third week into 2027.
  for (const at of [
    "2026-11-08T14:59:59.999Z", "2026-11-08T15:00:00Z", "2026-11-15T14:59:59Z",
    "2026-12-27T15:00:00Z", "2026-12-31T15:00:00Z", "2027-01-03T14:59:59Z", "2027-01-03T15:00:00Z",
    "2025-12-28T14:59:59Z", "2025-12-28T15:00:00Z",
  ]) {
    const server = (await one(`select public.kst_iso_week($1::timestamptz) as week`, [at]))?.week;
    check(server === isoWeekKey(Date.parse(at)), `at ${at} the server reads week ${server} and the client ${isoWeekKey(Date.parse(at))}; the two have to name one week.`);
  }
  for (const [label, sql] of [
    ["read the server's calendar", `select * from public.weekly_rules`],
    ["change the server's calendar", `insert into public.weekly_rules (week, rule_id) values ('2026-W47', 'near-wall')`],
    ["ask which week a run is in", `select public.ranking_run_week('run-ranked-1')`],
  ]) {
    await refused(label, "anon", sql);
    await refused(label, "authenticated", sql);
  }

  withHeaders({ "x-forwarded-for": "198.51.100.23" });
  const [EVENT, OTHER] = Object.keys(WEEK_RULE_CATALOGUE);
  const rankingRow = (runId) => one(`select summary->>'week' as week from public.playtest_sessions where case_id = 'season-final' and run_id = $1`, [runId]);
  const setWeek = (week, ruleId) =>
    db.query(`insert into public.weekly_rules (week, rule_id) values ($1, $2) on conflict (week) do update set rule_id = excluded.rule_id`, [week, ruleId]);
  /** The KST week of the run's first case row. */
  const firstWeek = async (runId) =>
    (await one(`select public.kst_iso_week(min(completed_at)) as week from public.playtest_sessions where run_id = $1 and case_id <> 'season-final'`, [runId]))?.week;
  let n = 60;
  /** A season whose case rows carry `ruleOf(caseId)` as their stamp. */
  const weekRun = async (runId, ruleOf, { session = sessionId(n++) } = {}) => {
    await playRun(runId, { session, dynamicsOf: (caseId, dynamics) => ({ ...dynamics, weekRule: ruleOf(caseId) }) });
    return session;
  };
  const refusedWeekRun = async (label, runId, session, pattern) => {
    await postRefused(label, "playtest_sessions", seasonPayload({ session, runId }), pattern);
    check(!(await rankingRow(runId)), `${runId} has a ranking row after the refusal to ${label}.`);
  };
  const CHANGED = /^P0001 week rule changed within the run$/;
  const NOT_THE_WEEK = /^P0001 week rule does not match the week the run began$/;

  // The season the client builds stamps its rule on every row.
  check(Object.hasOwn(createRunSummary(RUN_INITIAL_STATE), "weekRule"), "the run summary the client builds has no weekRule; the server would read every season as the ordinary table's.");
  check(createRunSummary({ ...RUN_INITIAL_STATE, weekRule: EVENT }).weekRule === EVENT, "the run summary does not carry the season's rule.");

  // Taken: every row says the rule, and the server's calendar has it for the week the first row came in.
  const takenSession = await weekRun("run-week-taken", () => EVENT);
  const week = await firstWeek("run-week-taken");
  await setWeek(week, EVENT);
  await post("rank a season played under this week's rule", "playtest_sessions", seasonPayload({ session: takenSession, runId: "run-week-taken" }));
  const taken = await rankingRow("run-week-taken");
  check(taken?.week === week, `a season played under ${week}'s rule ranked with week ${JSON.stringify(taken?.week)}; the server writes the week it judged.`);
  check((await rankingRow("run-ranked-1"))?.week === null, "an ordinary season's ranking row carries a week.");

  // Taken, across a week's end (D3): the season keeps the rule of the week it
  // began in, and ranks on that week's board though its last rows came after.
  const acrossSession = await weekRun("run-week-across", () => EVENT);
  await db.query(
    `update public.playtest_sessions set completed_at = completed_at - interval '7 days'
      where id = (select id from public.playtest_sessions where run_id = 'run-week-across' order by completed_at, id limit 1)`,
  );
  const weekBefore = await firstWeek("run-week-across");
  check(weekBefore !== week, `the season moved a week back still began in ${weekBefore}.`);
  await setWeek(weekBefore, EVENT);
  await post("rank a season begun under last week's rule and ended this week", "playtest_sessions", seasonPayload({ session: acrossSession, runId: "run-week-across" }));
  const across = await rankingRow("run-week-across");
  check(across?.week === weekBefore, `a season begun in ${weekBefore} ranked in ${JSON.stringify(across?.week)}; it belongs to the week it began in.`);

  // Refused: rows that do not all say the same (D3: the stamp is the season's, set once).
  const early = CASE_SEQUENCE.slice(0, 10);
  const middle = CASE_SEQUENCE[Math.floor(CASE_SEQUENCE.length / 2)];
  await refusedWeekRun("rank a season begun without the rule and finished under it", "run-week-mixed", await weekRun("run-week-mixed", (caseId) => (early.includes(caseId) ? null : EVENT)), CHANGED);
  await refusedWeekRun("rank a season whose rows name two rules", "run-week-two", await weekRun("run-week-two", (caseId) => (early.includes(caseId) ? OTHER : EVENT)), CHANGED);
  await refusedWeekRun("rank a season with one row under the rule", "run-week-one", await weekRun("run-week-one", (caseId) => (caseId === middle ? EVENT : null)), CHANGED);

  // Refused: a rule the server's calendar does not have for the week the first row came in (D1).
  await refusedWeekRun("rank a season under another rule than the week's", "run-week-other", await weekRun("run-week-other", () => OTHER), NOT_THE_WEEK);
  await refusedWeekRun("rank a season under a rule no calendar has", "run-week-unknown", await weekRun("run-week-unknown", () => "made-up-rule"), NOT_THE_WEEK);
  // A device clock set to an event week, or a season begun offline and sent a
  // week late (결정 29: strict, no grace): the rule is right, the week is not.
  const driftSession = await weekRun("run-week-drift", () => EVENT);
  await db.query(`update public.playtest_sessions set completed_at = completed_at - interval '14 days' where run_id = 'run-week-drift'`);
  const driftWeek = await firstWeek("run-week-drift");
  check(driftWeek !== week && driftWeek !== weekBefore, `the season moved two weeks back began in ${driftWeek}, a week the check has a rule for.`);
  await db.query(`delete from public.weekly_rules where week = $1`, [driftWeek]);
  await refusedWeekRun("rank a season stamped with a rule in a week that has none", "run-week-drift", driftSession, NOT_THE_WEEK);

  // Refused at the row: a stamp that is not a rule id the client writes.
  const stampOf = (weekRule) => ({
    ...casePayload({ session: sessionId(59), runId: "run-week-stamp", caseId: "case01" }),
    dynamics: { ...createRunSummary(RUN_INITIAL_STATE), responseTimeSec: 7.4, weekRule },
  });
  await postRefused("send a case row whose weekRule is a number", "playtest_sessions", stampOf(46), /^23514 .*playtest_sessions_dynamics_shape/);
  await postRefused(`send a case row whose weekRule is longer than ${WEEK_RULE_ID_MAX}`, "playtest_sessions", stampOf("x".repeat(WEEK_RULE_ID_MAX + 1)), /^23514 .*playtest_sessions_dynamics_shape/);
  await post(`send a case row whose weekRule is ${WEEK_RULE_ID_MAX} long`, "playtest_sessions", stampOf("x".repeat(WEEK_RULE_ID_MAX)));

  // One device, two a day, whichever board (결정 30): an ordinary season and an event one, and the third is refused.
  const shared = sessionId(n++);
  await weekRun("run-week-limit-1", () => null, { session: shared });
  await post("rank an ordinary season from the device", "playtest_sessions", seasonPayload({ session: shared, runId: "run-week-limit-1" }));
  await weekRun("run-week-limit-2", () => EVENT, { session: shared });
  await setWeek(await firstWeek("run-week-limit-2"), EVENT);
  await post("rank an event season from the same device", "playtest_sessions", seasonPayload({ session: shared, runId: "run-week-limit-2" }));
  await weekRun("run-week-limit-3", () => EVENT, { session: shared });
  await setWeek(await firstWeek("run-week-limit-3"), EVENT);
  await postRefused("rank a third season from one device in a day, on the event's board", "playtest_sessions", seasonPayload({ session: shared, runId: "run-week-limit-3" }), /^PT429 .*limit reached/);

  // The two boards, read the way the client reads them (fetchLeaderboard).
  const boardRows = async (filter, params = []) =>
    (await allowed(`read the ranking where ${filter}`, "anon",
      `select run_tag, player_name, case_id, case_title, completed_at, summary, score, week from public.public_rankings
        where ${filter} order by score desc nulls last, completed_at asc limit 100`, params))?.rows ?? [];
  const ordinary = await boardRows("week is null");
  check(ordinary.length === 3 && ordinary.every((row) => row.week === null && !("week" in row.summary)),
    `the ordinary board shows ${ordinary.length} rows (${JSON.stringify(ordinary.map((row) => row.week))}); expected the three seasons played without a rule.`);
  const eventBoard = await boardRows("week = $1", [week]);
  check(eventBoard.length === 2 && eventBoard.every((row) => row.week === week && row.summary?.week === week),
    `the board of ${week} shows ${JSON.stringify(eventBoard.map((row) => row.week))}; expected its two seasons and only those.`);
  check((await boardRows("week = $1", [weekBefore])).length === 1, `the board of ${weekBefore} does not show the one season that began in it.`);

  // The hold rate's cut points read the ordinary board only (결정 30): the
  // event seasons carry a hold rate too, and are not counted.
  const cut = (await allowed("read the cut points beside an event week", "anon", `select public.logic_hold_cutoffs() as c`))?.rows[0]?.c;
  check(cut?.n === ordinary.length, `the hold rate's cut points counted ${cut?.n} seasons; the ordinary board has ${ordinary.length}, and an event week's seasons are not among them.`);

  // What the client's queue makes of the two refusals: let go, and not read as a run missing a case.
  const seasonItem = { type: "case", payload: { case_id: "season-final" } };
  for (const serverMessage of ["week rule changed within the run", "week rule does not match the week the run began"]) {
    const refusal = { status: 400, serverMessage };
    check(classifyTelemetryFailure(refusal) === "permanent", `the client's queue reads "${serverMessage}" as "${classifyTelemetryFailure(refusal)}"; it has to let the row go.`);
    check(!isUnrankableRefusal(seasonItem, refusal), `the client's queue reads "${serverMessage}" as a run missing a case row.`);
  }

  // The test week's report (scripts/report-test-week.mjs, .github/workflows/test-week.yml)
  // runs its one SELECT over the seasons of a week long past, so the runs
  // above are not in it: three under the rule from two devices, one without it
  // (the box turned it down), one in story mode and one under another rule.
  {
    const REPORT_WEEK = "2026-W30";
    const reportRuns = [
      ["run-week-report-on-1", EVENT, sessionId(n), false],
      ["run-week-report-on-2", EVENT, sessionId(n), false],
      ["run-week-report-on-3", EVENT, sessionId(n + 1), false],
      ["run-week-report-off", null, sessionId(n + 1), false],
      ["run-week-report-story", null, sessionId(n + 2), true],
      ["run-week-report-other", OTHER, sessionId(n + 3), false],
    ];
    n += 4;
    let minute = 0;
    for (const [runId, rule, session, story] of reportRuns) {
      for (const caseId of CASE_SEQUENCE.slice(0, 2)) {
        const payload = casePayload({ session, runId, caseId, story });
        payload.dynamics = { ...payload.dynamics, weekRule: rule };
        const { sql, params } = postgrestInsert("playtest_sessions", payload);
        await db.query(sql, params);
      }
      await db.query(
        `update public.playtest_sessions set completed_at = '2026-07-22T03:00:00Z'::timestamptz + ($2::int + (id % 2)) * interval '1 minute' where run_id = $1`,
        [runId, (minute += 5)],
      );
    }
    const reportRows = (await allowed("run the test week's report", "service_role", testWeekQuery(REPORT_WEEK, EVENT)))?.rows ?? [];
    const report = readTestWeek(reportRows);
    check(
      report.seasons === 3 && report.turnedDown === 1 && report.devicesOn === 2 && report.devicesOff === 1 && report.devices === 2 && report.caseRows === 6,
      `the test week's report read ${JSON.stringify({ seasons: report.seasons, turnedDown: report.turnedDown, devicesOn: report.devicesOn, devicesOff: report.devicesOff, devices: report.devices, caseRows: report.caseRows })}; expected 3 seasons under the rule from 2 devices, 1 without it, story mode and another rule left out.`,
    );
    check(reportRows.every((row) => !Object.values(row).some((value) => typeof value === "string" && value.startsWith("grants-check-session-"))), "the test week's report fetched a device's session id.");
  }

  // The weekly drop-off report (scripts/report-funnel.mjs, .github/workflows/funnel.yml)
  // runs its one SELECT over the runs begun after a day no other row reaches:
  // two runs from one device (the second marked NEW GAME+) and one from
  // another that came back two days later.
  {
    const SINCE_DAY = "2030-01-01";
    const funnelRuns = [
      ["run-week-funnel-1", sessionId(n), 3, 0, false, 0],
      ["run-week-funnel-2", sessionId(n), 1, 3, true, 0],
      ["run-week-funnel-3", sessionId(n + 1), 2, 1, false, 2],
    ];
    n += 2;
    for (const [runId, session, cases, startDay, newGamePlus, breakDays] of funnelRuns) {
      for (const caseId of CASE_SEQUENCE.slice(0, cases)) {
        const payload = casePayload({ session, runId, caseId });
        if (newGamePlus) payload.summary = { ...payload.summary, newGamePlus: true };
        const { sql, params } = postgrestInsert("playtest_sessions", payload);
        await db.query(sql, params);
      }
      await db.query(
        `update public.playtest_sessions p
            set completed_at = $2::timestamptz + $3::int * interval '1 day'
                             + (o.k - 1) * interval '10 minutes' + (case when o.k > 1 then $4::int else 0 end) * interval '1 day'
           from (select id, row_number() over (order by id) as k from public.playtest_sessions where run_id = $1) o
          where p.id = o.id`,
        [runId, `${SINCE_DAY}T03:00:00Z`, startDay, breakDays],
      );
    }
    const funnelRows = (await allowed("run the drop-off report", "service_role", funnelQuery(SINCE_DAY)))?.rows ?? [];
    const funnel = readFunnel(funnelRows, Date.parse(`${SINCE_DAY}T00:00:00Z`) / 1000 + 10 * 86400);
    check(
      funnel.runs === 3 && funnel.devices === 2 && JSON.stringify(funnel.reach.slice(0, 3)) === "[3,2,1]" && funnel.markedRuns === 1 && funnel.breaks === 1 && funnel.gaps === 3,
      `the drop-off report read ${JSON.stringify({ runs: funnel.runs, devices: funnel.devices, reach: funnel.reach.slice(0, 3), markedRuns: funnel.markedRuns, breaks: funnel.breaks, gaps: funnel.gaps })}; expected 3 runs from 2 devices reaching 프롤로그 01/02/03 as 3/2/1, one NEW GAME+ run and one break among three gaps.`,
    );
    check(funnelRows.every((row) => !JSON.stringify(row).includes("grants-check-session-") && !JSON.stringify(row).includes("run-week-funnel")), "the drop-off report fetched a run or device id.");
  }

  withHeaders(null);
  await db.query(`delete from public.playtest_sessions where run_id like 'run-week-%'`);
  await db.query(`delete from public.weekly_rules`);
  for (const [calendarWeek, ruleId] of clientCalendar) await setWeek(calendarWeek, ruleId);
  check(JSON.stringify(await calendarRows()) === JSON.stringify(clientCalendar), "the weekly rule's check did not put the server's calendar back.");
  check((await one(`select count(*)::int as n from public.playtest_sessions where case_id = 'season-final'`))?.n === 2, "the weekly rule's check left ranking rows behind.");
}

// ---- the board

const board = (session, nickname, body) =>
  postgrestInsert("board_posts", { event_id: uuid(), session_id: session, nickname, body });
const boardPost = (label, session, nickname, body) => {
  const { sql, params } = board(session, nickname, body);
  return allowed(label, "anon", sql, params);
};
const boardRefused = (label, session, nickname, body, pattern) => {
  const { sql, params } = board(session, nickname, body);
  return raises(label, "anon", sql, params, pattern);
};

withHeaders({ "x-forwarded-for": "198.51.100.30" });
await boardPost("post to the board", sessionId(20), "점검", "새 데이터베이스 쓰기 확인");
await boardRefused("post twice inside 30 seconds", sessionId(20), "점검", "두 번째 글입니다", /30 seconds/);
await boardPost("post from a second device on the same address", sessionId(21), "교실", "같은 교실의 다른 사람입니다");
// The same words from another device are refused out loud -- the writer is
// told -- rather than answered with the success a retry gets.
await boardRefused("post another device's words from the same address", sessionId(22), "교실", "같은 교실의 다른 사람입니다", /^P0001 .*repeats a recent post/);
check(
  (await one(`select count(*)::int as n from public.board_posts where body = '같은 교실의 다른 사람입니다'`))?.n === 1,
  "the same body from one address was stored twice by rotating session_id.",
);
await boardPost("post from a third device on the same address", sessionId(23), "교실셋", "세 번째 사람의 글");
await boardRefused("flood from one address with rotating session ids", sessionId(24), "봇봇", "네 번째 글", /^PT429 .*30 seconds/);
{
  // A retry of a post that landed: accepted, dropped, and counted.
  const key = (await one(`select actor_key from public.board_posts where session_id = $1`, [sessionId(21)]))?.actor_key;
  check(/^board:[0-9a-f]{32}$/.test(key ?? ""), `a board post's writer key is not a hash: ${key}`);
  await boardPost("retry a post that already landed", sessionId(21), "교실", "같은 교실의 다른 사람입니다");
  check(
    (await one(`select count(*)::int as n from public.board_posts where body = '같은 교실의 다른 사람입니다'`))?.n === 1,
    "a retried post was stored twice.",
  );
  await presetCounter(`${key}|replay`, 60);
  await boardRefused("retry a landed post for the 61st time in an hour", sessionId(21), "교실", "같은 교실의 다른 사람입니다", /^PT429 .*rate limit/);
}
withHeaders(null);

// Hourly caps: ten for a device, thirty for an address. The posts are aged past
// the thirty-second rule so only the hourly counters decide.
{
  const ageBoard = () => db.query(`update public.board_posts set created_at = created_at - interval '5 minutes'`);
  withHeaders({ "x-forwarded-for": "198.51.100.35" });
  const addressKey = `board:${await writerKey("198.51.100.35")}`;
  for (let index = 1; index <= 10; index += 1) {
    await ageBoard();
    await boardPost(`post a device's post ${index} of the hour`, sessionId(25), "열번", `한 시간 안의 글 ${index}`);
  }
  await ageBoard();
  await boardRefused("post a device's 11th post of the hour", sessionId(25), "열번", "한 시간 안의 글 11", /^PT429 .*rate limit/);
  await presetCounter(addressKey, 29);
  await boardPost("post an address's 30th post of the hour", sessionId(26), "서른", "주소의 서른 번째 글");
  await ageBoard();
  await boardRefused("post an address's 31st post of the hour", sessionId(27), "서른", "주소의 서른한 번째 글", /^PT429 .*rate limit/);
  withHeaders(null);
}

// Length bounds: 2-24 for the name, 2-300 for the post.
{
  let boundIp = 120;
  const bound = async (label, nickname, body, pattern) => {
    withHeaders({ "x-forwarded-for": `198.51.100.${boundIp++}` });
    if (pattern) await boardRefused(label, sessionId(200 + boundIp), nickname, body, pattern);
    else await boardPost(label, sessionId(200 + boundIp), nickname, body);
  };
  await bound("post under a 24-character name", "가".repeat(24), "이름 길이의 위쪽 끝");
  await bound("post under a 25-character name", "가".repeat(25), "이름이 한 글자 길다", /nickname must be 2-24/);
  await bound("post under a one-character name", "가", "이름이 한 글자 짧다", /nickname must be 2-24/);
  await bound("post a 300-character post", "점검", "나".repeat(300));
  await bound("post a 301-character post", "점검", "다".repeat(301), /post must be 2-300/);
  withHeaders(null);
}

// One list of what the filters refuse, shared with the browser's copy of them
// (tests/unit/board-filter.test.mjs), so the two cannot drift apart unseen.
const boardFilterCases = JSON.parse(readFileSync(path.join(root, "tests", "fixtures", "board-filter-cases.json"), "utf8"));
check(boardFilterCases.refused.length >= 10 && boardFilterCases.accepted.length >= 3, "the board filter fixture is nearly empty; the filters were checked against nothing.");
const FILTER_REASON = { link: /must not contain a link/, contact: /contact details/, characters: /must be 2-/ };
let filterIp = 40;
for (const { label, nickname, body, reason } of boardFilterCases.refused) {
  withHeaders({ "x-forwarded-for": `203.0.113.${filterIp++}` });
  check(FILTER_REASON[reason], `board filter case "${label}" names an unknown reason: ${reason}`);
  await boardRefused(`post ${label}`, sessionId(300 + filterIp), nickname, body, FILTER_REASON[reason] ?? /./);
}
for (const { label, nickname, body } of boardFilterCases.accepted) {
  withHeaders({ "x-forwarded-for": `203.0.113.${filterIp++}` });
  await boardPost(`post ${label}`, sessionId(300 + filterIp), nickname, body);
}
withHeaders(null);

await allowed("read the board", "anon", `select id, nickname, body, created_at from public.board_posts`);
await refused("read board post session ids", "anon", `select session_id from public.board_posts`);
await refused("read board post writer keys", "anon", `select actor_key from public.board_posts`);
await refused("hide a board post", "anon", `select public.moderate_board_post(1)`);
await allowed("hide a board post", "service_role", `select public.moderate_board_post((select min(id) from public.board_posts))`);
{
  const hidden = await one(`select min(id) as id from public.board_posts`);
  const result = await allowed("read the board after moderation", "anon", `select id from public.board_posts`);
  check(!(result?.rows ?? []).some((row) => row.id === hidden.id), "a hidden board post is still readable by anon.");
  await refused("restore a board post", "anon", `select public.moderate_board_post(${Number(hidden.id)}, false)`);
  await allowed("restore a board post", "service_role", `select public.moderate_board_post($1, false)`, [hidden.id]);
  const restored = await allowed("read the board after a post is restored", "anon", `select id from public.board_posts`);
  check((restored?.rows ?? []).some((row) => row.id === hidden.id), "a restored board post is not readable by anon.");
  const missing = await allowed("moderate a post that does not exist", "service_role", `select public.moderate_board_post(-1) as found`);
  check(missing?.rows[0]?.found !== true, "moderating a missing post reported success.");
}

// ---- cloud saves

/** The payload `flushCloudSave` sends: the save and the settled-window list, and nothing else. */
const cloudPayload = (marker, extra = {}) => JSON.stringify({ save: { runId: `cloud-${marker}`, log: [] }, settledWindows: [`cloud-${marker}:1:n1`], ...extra });
const putCloud = (label, code, { savedAt = "now()", payload = cloudPayload(label), expected } = {}) =>
  allowed(
    label,
    "anon",
    expected === undefined
      ? `select public.put_cloud_save($1, ${savedAt}, $2::jsonb) as r`
      : `select public.put_cloud_save(p_code => $1, p_saved_at => ${savedAt}, p_payload => $2::jsonb, p_expected_revision => $3) as r`,
    expected === undefined ? [code, payload] : [code, payload, expected],
  );
const putCloudRefused = (label, code, payload, pattern) =>
  raises(label, "anon", `select public.put_cloud_save($1, now(), $2::jsonb)`, [code, payload], pattern);

withHeaders({ "x-forwarded-for": "198.51.100.60" });
await putCloud("put a cloud save dated next week", "ABCDEFGH2345", { savedAt: "now() + interval '6 days'" });
{
  const result = await allowed("get a cloud save", "anon", `select public.get_cloud_save('ABCDEFGH2345') as save`);
  const savedAt = result?.rows[0]?.save?.saved_at;
  check(savedAt && new Date(savedAt) <= new Date(Date.now() + 1000), `a cloud save kept a future saved_at (${savedAt}); it must be clamped to now().`);
}
{
  // A put that names no revision is ordered by time: the client sends one when
  // the server could not tell it what it holds and it has no revision on record.
  const result = await putCloud("put an honest save after a future-dated one", "ABCDEFGH2345");
  check(result?.rows[0]?.r?.accepted === true, "an honest save was locked out by a future-dated one.");
  const stale = await putCloud("put a save older than the stored one", "ABCDEFGH2345", { savedAt: "now() - interval '1 day'" });
  check(stale?.rows[0]?.r?.accepted === false && stale?.rows[0]?.r?.reason === "older", "a stale device overwrote a newer cloud save.");
}
{
  // Lineage: device A and device B both hold revision 1. B uploads; A -- whose
  // save is *newer by the clock* -- must be refused, because it was not built
  // on what the server now holds.
  const first = await putCloud("start a code", "LLLLLLLL2345");
  const base = first?.rows[0]?.r?.revision;
  check(base === 1, `a new code starts at revision ${base}; expected 1.`);
  const fromB = await putCloud("upload from the second device", "LLLLLLLL2345", { expected: base });
  check(fromB?.rows[0]?.r?.accepted === true && fromB?.rows[0]?.r?.revision === 2, "an upload built on the stored revision was refused.");
  const fromA = await putCloud("upload from the device that fell behind", "LLLLLLLL2345", { expected: base, savedAt: "now()" });
  const refusal = fromA?.rows[0]?.r ?? {};
  check(refusal.accepted === false && refusal.reason === "revision" && refusal.revision === 2,
    `a device that fell behind overwrote newer play by stamping a later time: ${JSON.stringify(refusal)}`);
  const stored = await allowed("read the code after the refusal", "anon", `select public.get_cloud_save('LLLLLLLL2345') as save`);
  check(stored?.rows[0]?.save?.payload?.save?.runId === "cloud-upload from the second device", "the refused upload still replaced the stored save.");
  // Choosing to overwrite is naming the revision that is there.
  const overwrite = await putCloud("overwrite on purpose", "LLLLLLLL2345", { expected: 2, savedAt: "now() - interval '1 day'" });
  check(overwrite?.rows[0]?.r?.accepted === true && overwrite?.rows[0]?.r?.revision === 3, "an explicit overwrite naming the stored revision was refused.");

  const peek = await allowed("peek at a cloud save", "anon", `select public.peek_cloud_save('LLLLLLLL2345') as p`);
  check(peek?.rows[0]?.p?.revision === 3 && !("payload" in (peek?.rows[0]?.p ?? {})), `peek_cloud_save returned ${JSON.stringify(peek?.rows[0]?.p)}; expected the revision and no payload.`);
  const unknown = await allowed("peek at a code nobody has used", "anon", `select public.peek_cloud_save('MMMMMMMM2345') as p`);
  check(unknown?.rows[0]?.p === null, "peeking at an unknown code returned something.");
  const missing = await allowed("get a code nobody has used", "anon", `select public.get_cloud_save('MMMMMMMM2345') as save`);
  check(missing?.rows[0]?.save === null, "getting an unknown code returned something.");

  const removed = await allowed("delete a cloud save", "anon", `select public.delete_cloud_save('LLLLLLLL2345') as gone`);
  check(removed?.rows[0]?.gone === true, "deleting a stored cloud save reported nothing to delete.");
  const again = await allowed("delete it again", "anon", `select public.delete_cloud_save('LLLLLLLL2345') as gone`);
  check(again?.rows[0]?.gone === false, "deleting a code with no save reported a deletion.");
  const after = await allowed("peek after the delete", "anon", `select public.peek_cloud_save('LLLLLLLL2345') as p`);
  check(after?.rows[0]?.p === null, "a deleted cloud save can still be read.");
}
for (const fn of ["put_cloud_save($1, now(), '{\"save\":{}}'::jsonb)", "get_cloud_save($1)", "peek_cloud_save($1)", "delete_cloud_save($1)"]) {
  for (const code of ["ABCDEFGH234", "ABCDEFGH2340", "abcdefgh2345", "ABCD-EFGH-2345", "", null]) {
    await raises(`call ${fn.split("(")[0]} with the malformed code ${JSON.stringify(code)}`, "anon", `select public.${fn}`, [code], /invalid cloud save code/);
  }
}
// The payload is the shape the client sends, at the size a save is.
await putCloudRefused("store an arbitrary object under a code", "NNNNNNNN2345", JSON.stringify({ v: 1 }), /invalid cloud save payload/);
await putCloudRefused("store an extra key beside the save", "NNNNNNNN2345", cloudPayload("x", { note: "anything" }), /invalid cloud save payload/);
await putCloudRefused("store a save that is not an object", "NNNNNNNN2345", JSON.stringify({ save: "text" }), /invalid cloud save payload/);
await putCloudRefused("store 401 settled windows", "NNNNNNNN2345", JSON.stringify({ save: {}, settledWindows: Array.from({ length: 401 }, (_, index) => `w${index}`) }), /invalid cloud save payload/);
await putCloudRefused("store a settled window that is not a string", "NNNNNNNN2345", JSON.stringify({ save: {}, settledWindows: [{ a: 1 }] }), /invalid cloud save payload/);
await putCloudRefused("store a 400 KB save", "NNNNNNNN2345", JSON.stringify({ save: { log: "x".repeat(400000) } }), /invalid cloud save payload/);
await putCloud("store a 300 KB save", "NNNNNNNN2345", { payload: JSON.stringify({ save: { log: "x".repeat(300000) } }) });
check((await one(`select count(*)::int as n from public.cloud_saves`))?.n === 2, "a refused cloud save left a row behind.");
{
  let refusedAt = 0;
  for (let attempt = 1; attempt <= 260 && !refusedAt; attempt += 1) {
    try {
      await run("anon", `select public.put_cloud_save('ZZZZZZZZ2345', now(), $1::jsonb)`, [cloudPayload("pace")]);
    } catch (error) {
      if (error.code === "PT429" && /rate limit/.test(error.message)) refusedAt = attempt;
      else throw error;
    }
  }
  check(refusedAt === 241, `cloud saves for one code were refused at put ${refusedAt || "never"}; expected 241.`);
}
withHeaders({ "x-forwarded-for": "198.51.100.61" });
{
  // An address starts five codes a day; a code it already has goes on saving.
  const codes = ["PPPPPPPP2345", "QQQQQQQQ2345", "RRRRRRRR2345", "SSSSSSSS2345", "TTTTTTTT2345"];
  for (const code of codes) await putCloud(`start code ${code}`, code);
  await putCloudRefused("start a sixth code from one address in a day", "UUUUUUUU2345", cloudPayload("sixth"), /^PT429 .*code limit/);
  await putCloud("save again under a code the address already has", codes[0]);
  // 600 puts an hour and 120 reads an hour for an address, 30 deletes.
  const address = await writerKey("198.51.100.61");
  await presetCounter(`cloud-put-ip:${address}`, 600);
  await putCloudRefused("put an address's 601st cloud save of the hour", codes[1], cloudPayload("pace"), /^PT429 .*rate limit/);
  await presetCounter(`cloud-get-ip:${address}`, 119);
  await allowed("read an address's 120th cloud save of the hour", "anon", `select public.get_cloud_save($1)`, [codes[1]]);
  await raises("read an address's 121st cloud save of the hour", "anon", `select public.get_cloud_save($1)`, [codes[1]], /^PT429 .*rate limit/);
  await raises("peek past an address's read budget", "anon", `select public.peek_cloud_save($1)`, [codes[1]], /^PT429 .*rate limit/);
  await presetCounter(`cloud-delete-ip:${address}`, 30);
  await raises("delete past an address's budget", "anon", `select public.delete_cloud_save($1)`, [codes[1]], /^PT429 .*rate limit/);
}
withHeaders({ "x-forwarded-for": "198.51.100.62" });
{
  // Everyone together: new codes in a day, and it fails closed.
  await db.query(`insert into public.private_settings (name, value) values ('cloud_daily_new_codes', '0')
                  on conflict (name) do update set value = excluded.value`);
  await putCloudRefused("start a code past the daily ceiling", "VVVVVVVV2345", cloudPayload("ceiling"), /^PT429 .*code limit/);
  await db.query(`delete from public.private_settings where name = 'cloud_daily_new_codes'`);
  await putCloud("start a code under the default ceiling", "VVVVVVVV2345");
  // The default itself: 1,000 a day (20261006010000), driven from one short.
  // Each new code needs an address of its own, since an address starts five.
  await presetCounter("global:cloud-new", 999);
  await putCloud("start the day's 1,000th code", "WWWWWWWW2345");
  withHeaders({ "x-forwarded-for": "198.51.100.63" });
  await putCloudRefused("start the day's 1,001st code", "XXXXXXXX2345", cloudPayload("thousand"), /^PT429 .*code limit/);
  await putCloud("save under an existing code while new ones are refused", "VVVVVVVV2345");
  await db.query(`delete from public.telemetry_rate_limits where actor_key = 'global:cloud-new'`);
  // The owner's number, as large as they care to make it, is still a limit and
  // not an error: it was cast to integer, and 2^31 failed every new code (20261007010000).
  await db.query(`insert into public.private_settings (name, value) values ('cloud_daily_new_codes', '3000000000')
                  on conflict (name) do update set value = excluded.value`);
  await putCloud("start a code under a ceiling set past the integer range", "YYYYYYYY2345");
  await db.query(`delete from public.private_settings where name = 'cloud_daily_new_codes'`);
}
withHeaders(null);

// ---- write-only stays write-only, and nothing else is granted

const UPDATE_PROBE = {
  playtest_sessions: "event_id = event_id",
  playtest_feedback: "event_id = event_id",
  app_error_logs: "event_id = event_id",
  free_text_analyses: "event_id = event_id",
  board_posts: "hidden = true",
  cloud_saves: "payload = payload",
  telemetry_rate_limits: "request_count = 0",
  private_settings: "value = value",
  scene_bust_stats: "windows = windows",
  weekly_rules: "rule_id = rule_id",
};
// The list is typed out because each table needs an assignment of its own, and
// the rules in part 1 only see table-wide privileges: a new table given a
// column-level update would be tried by nothing unless it has a line here.
{
  const known = tables.map(({ name }) => name);
  const unprobed = known.filter((name) => !Object.hasOwn(UPDATE_PROBE, name));
  const gone = Object.keys(UPDATE_PROBE).filter((name) => !known.includes(name));
  if (unprobed.length) {
    failures.push(`nothing tries to update, delete from or truncate public.${unprobed.join(", public.")} as anon. Add a line to UPDATE_PROBE in scripts/check-grants.mjs.`);
  }
  if (gone.length) failures.push(`UPDATE_PROBE names ${gone.join(", ")}, which the migrations no longer create.`);
}
for (const [table, assignment] of Object.entries(UPDATE_PROBE)) {
  await refused(`update ${table}`, "anon", `update public.${table} set ${assignment}`);
  await refused(`delete from ${table}`, "anon", `delete from public.${table}`);
  await refused(`truncate ${table}`, "anon", `truncate public.${table}`);
  await refused(`read ${table} as authenticated`, "authenticated", `select 1 from public.${table} limit 1`);
}
await refused("read feedback", "anon", `select * from public.playtest_feedback`);
await refused("read free-text analyses", "anon", `select * from public.free_text_analyses`);
await refused("read error logs", "anon", `select * from public.app_error_logs`);
await refused("read a raw decision_log", "anon", `select decision_log from public.playtest_sessions`);
await refused("read cloud saves directly", "anon", `select * from public.cloud_saves`);
await refused("read rate limits", "anon", `select * from public.telemetry_rate_limits`);
await refused("read the scene snapshot directly", "anon", `select * from public.scene_bust_stats`);
await allowed("read the scene wall rates", "anon", `select public.scene_bust_rates()`);
await refused("rebuild the scene snapshot", "anon", `select public.refresh_scene_bust_stats()`);
await refused("read the address salt", "anon", `select * from public.private_settings`);
await refused("read a private setting through its helper", "anon", `select public.private_setting_int('telemetry_daily_bytes', 0)`);
await refused("hash an address", "anon", `select public.hash_client_address('203.0.113.9')`);
await refused("ask the link filter what it lets through", "anon", `select public.board_text_has_link('spam.com')`);
await refused("read the season's case list over RPC", "anon", `select public.season_case_ids()`);
await refused("peek at a cloud save", "authenticated", `select public.peek_cloud_save('ABCDEFGH2345')`);
await refused("delete a cloud save", "authenticated", `select public.delete_cloud_save('ABCDEFGH2345')`);
await refused("insert a case row", "authenticated", postgrestInsert("playtest_sessions", casePayload({ session: sessionId(99), runId: "run-auth", caseId: "case01" })).sql.replace("$1::jsonb", `'{"session_id":"x"}'::jsonb`));
await refused("run purge_old_telemetry", "anon", `select * from public.purge_old_telemetry('180 days')`);
await refused("bump a rate limit", "anon", `select public.bump_rate_limit('x', '1 hour', 1)`);
await refused("put a cloud save", "authenticated", `select public.put_cloud_save('ABCDEFGH2345', now(), '{}'::jsonb)`);

// The trigger's last branch still serves the one table only service_role writes.
await allowed("record a free-text analysis", "service_role",
  `insert into public.free_text_analyses (session_id, case_id, node_id, analysis) values ('${sessionId(98)}', 'case01', 'n1', '{}')`);

// ---- the telemetry trigger function and its parts (20261014000000)
//
// `validate_telemetry_insert` was one function restated whole at every rule
// change; it is now a short one that calls nine parts. Three things are held
// here. Who may run each part: the rule in part 1 already refuses any function
// anon can execute, and this names the nine, so one that is dropped, renamed
// or given another signature is noticed too. That the trigger function still
// calls every one of them: a later migration that pastes the whole function
// back would leave the parts in place and unused, and a rule changed in a part
// after that would change nothing. And that the function is still wired to the
// four tables, before the address budget's trigger, as it has been.
const VALIDATOR_PARTS = {
  telemetry_check_envelope: ["text, text, text, text, integer", "void"],
  telemetry_check_session_row: ["text, jsonb, jsonb, text, text, jsonb, jsonb, jsonb, jsonb", "void"],
  telemetry_case_is_replay: ["text, text, text, text", "boolean"],
  ranking_check_request: ["jsonb, jsonb, text", "void"],
  ranking_check_run_marks: ["text", "void"],
  ranking_check_run: ["text, text", "void"],
  ranking_run_summary: ["text, text", "jsonb"],
  ranking_charge_limits: ["text, text", "void"],
  telemetry_charge_pace: ["text, text, integer", "void"],
};
{
  const describeFunction = (signature) => one(
    `select p.prosecdef as definer, p.provolatile as volatility, coalesce(p.proconfig, '{}') as config,
            p.prorettype::regtype::text as returns, p.prosrc as source,
            (select coalesce(array_agg(case a.grantee when 0 then 'public' else a.grantee::regrole::text end), '{}')
               from aclexplode(p.proacl) a where a.privilege_type = 'EXECUTE' and a.grantee <> p.proowner) as grantees
       from pg_proc p where p.oid = to_regprocedure($1)`,
    [signature],
  );
  const pinsPublic = (fn) => (fn?.config ?? []).some((setting) => /^search_path=public$/.test(setting));
  const onlyServiceRole = (fn) => JSON.stringify([...(fn?.grantees ?? [])].sort()) === '["service_role"]';

  const validator = await describeFunction("public.validate_telemetry_insert()");
  check(validator !== null, "public.validate_telemetry_insert() is gone; the telemetry tables have no insert trigger function.");
  check(validator?.definer === true && pinsPublic(validator), "validate_telemetry_insert is no longer SECURITY DEFINER with search_path = public; its parts run as its owner and read that path.");
  check(validator?.returns === "trigger", `validate_telemetry_insert returns ${validator?.returns}; expected trigger.`);
  check(onlyServiceRole(validator), `validate_telemetry_insert is executable by ${JSON.stringify(validator?.grantees)}; expected service_role only.`);

  // A part is called by the trigger function or by another part
  // (ranking_check_run calls ranking_check_run_marks).
  const parts = {};
  for (const [name, [args]] of Object.entries(VALIDATOR_PARTS)) parts[name] = await describeFunction(`public.${name}(${args})`);
  const callers = (name) => [validator?.source, ...Object.entries(parts).filter(([other]) => other !== name).map(([, fn]) => fn?.source)];

  for (const [name, [args, returns]] of Object.entries(VALIDATOR_PARTS)) {
    const part = parts[name];
    if (!part) {
      failures.push(`public.${name}(${args}) does not exist; validate_telemetry_insert calls it (20261014000000).`);
      continue;
    }
    const overloads = (await one(
      `select count(*)::int as n from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.proname = $1`,
      [name],
    ))?.n;
    check(overloads === 1, `public.${name} has ${overloads} overloads; the trigger function's call has to mean one of them.`);
    check(onlyServiceRole(part), `public.${name} is executable by ${JSON.stringify(part.grantees)}; expected service_role only, like every helper a trigger calls.`);
    check(part.definer === false, `public.${name} is SECURITY DEFINER; it is called by the trigger function alone and runs as that function's owner already.`);
    check(pinsPublic(part), `public.${name} does not pin search_path = public, the trigger function's own.`);
    check(part.volatility === "v", `public.${name} is not VOLATILE; a part marked stable reads the table as it was before the advisory lock was waited for.`);
    check(part.returns === returns, `public.${name} returns ${part.returns}; expected ${returns}.`);
    check(
      callers(name).some((source) => source?.includes(`public.${name}(`) === true),
      `neither validate_telemetry_insert nor another of its parts calls public.${name}; a migration restated the whole function, and a rule changed in that part would now change nothing.`,
    );
    for (const role of ["anon", "authenticated"]) {
      await refused(`call the trigger function's part ${name}`, role, `select public.${name}(${args.split(", ").map((type) => `null::${type}`).join(", ")})`);
    }
  }

  // Wiring: BEFORE INSERT, for each row, enabled, on the four tables; the
  // address budget (20261006000000) sorts after it on the three anon writes.
  const { rows: wired } = await db.query(`
    select c.relname as "table", t.tgname as name, p.proname as fn, t.tgtype::int as type, t.tgenabled::text as enabled
    from pg_trigger t
    join pg_class c on c.oid = t.tgrelid
    join pg_namespace n on n.oid = c.relnamespace
    join pg_proc p on p.oid = t.tgfoid
    where n.nspname = 'public' and not t.tgisinternal
      and p.proname in ('validate_telemetry_insert', 'charge_telemetry_address_bytes')
  `);
  // tgtype: 1 for each row, 2 before, 4 insert.
  const wiring = wired.map((row) => `${row.table}.${row.name}>${row.fn}:${row.type}:${row.enabled}`).sort();
  const expectedWiring = [
    "app_error_logs.validate_app_error_log_insert>validate_telemetry_insert:7:O",
    "app_error_logs.zz_charge_address_bytes>charge_telemetry_address_bytes:7:O",
    "free_text_analyses.validate_free_text_analyses_insert>validate_telemetry_insert:7:O",
    "playtest_feedback.validate_playtest_feedback_insert>validate_telemetry_insert:7:O",
    "playtest_feedback.zz_charge_address_bytes>charge_telemetry_address_bytes:7:O",
    "playtest_sessions.validate_playtest_session_insert>validate_telemetry_insert:7:O",
    "playtest_sessions.zz_charge_address_bytes>charge_telemetry_address_bytes:7:O",
  ];
  check(
    JSON.stringify(wiring) === JSON.stringify(expectedWiring),
    `the telemetry triggers are wired as ${JSON.stringify(wiring)}; expected ${JSON.stringify(expectedWiring)}.`,
  );
}

// ---- in parts, the trigger function refuses and stores what the whole one did
//
// 20261014000000 is a refactor: for any row, the function in parts has to do
// what the function 20261011010000 wrote out whole did. That is tried here on
// one row for each refusal the function has, and on the rows it takes, drops
// and rewrites. Each row is sent twice, in a transaction that is rolled back
// both times, so both definitions meet the same database: once with the
// function as the migrations leave it, once with the whole one put back in
// its place. What has to match is the refusal, code and message, or else the
// row as it was stored (a date that is the transaction's own reads "now") and
// every rate-limit counter after it.
//
// A probe also says which outcome it expects, so a row that is refused for
// another reason than its label's by both definitions is not a match.
//
// On the day a rule does change -- a part is restated -- the rows that part
// decides stop matching, which is this check doing its work: give those
// probes the new expectation and move them out of this comparison, or retire
// the comparison with the whole function it compares against.
{
  const definitionIn = (file) =>
    readFileSync(path.join(MIGRATIONS, file), "utf8").match(/^create or replace function public\.validate_telemetry_insert\(\)[\s\S]*?^\$\$;/m)?.[0] ?? null;
  const whole = files.includes(WHOLE_VALIDATOR) ? definitionIn(WHOLE_VALIDATOR) : null;
  const installed = async () =>
    one(`select p.prosrc as source, pg_get_functiondef(p.oid) as definition from pg_proc p where p.oid = 'public.validate_telemetry_insert()'::regprocedure`);
  const before = await installed();
  check(whole !== null, `could not read validate_telemetry_insert out of supabase/migrations/${WHOLE_VALIDATOR}; the function in parts was compared with nothing.`);

  const address = "198.51.100.90";
  const headers = { "x-forwarded-for": address };
  const writer = await writerKey(address);
  const device = sessionId(60);
  const RUN = "run-parts-1";
  const middle = CASE_SEQUENCE[Math.floor(CASE_SEQUENCE.length / 2)];
  const without = (object, key) => Object.fromEntries(Object.entries(object).filter(([name]) => name !== key));

  // A season whole, watched and well spaced, and not ranked: every ranking
  // probe starts from it and changes one thing inside its own transaction.
  await playRun(RUN, { session: device });
  // A case row that is stored, for the probes that send it again.
  const landed = casePayload({ session: device, runId: "run-parts-replay", caseId: "case01" });
  {
    const { sql, params } = postgrestInsert("playtest_sessions", landed);
    await db.query(sql, params);
  }

  let partsRun = 0;
  const sessionRow = (patch = {}, options = {}) => ({ ...casePayload({ session: device, runId: `run-parts-row-${++partsRun}`, caseId: "case02", ...options }), ...patch });
  const season = (patch = {}, options = {}) => ({ ...seasonPayload({ session: device, runId: RUN, ...options }), ...patch });
  const feedback = (patch = {}) => ({ ...feedbackPayload(device), ...patch });
  const errorLog = (patch = {}) => errorPayload(device, patch);
  const doing = (...statements) => async () => {
    for (const [text, params = []] of statements) await db.query(text, params);
  };
  const counterAt = (key, count) => () => presetCounter(key, count);
  const ofCase = (assignment, caseId = middle) => [`update public.playtest_sessions set ${assignment} where run_id = $1 and case_id = $2`, [RUN, caseId]];
  const ofRun = (assignment) => [`update public.playtest_sessions set ${assignment} where run_id = $1`, [RUN]];
  const dropCase = [`delete from public.playtest_sessions where run_id = $1 and case_id = $2`, [RUN, CASE_SEQUENCE[2]]];
  const STORY = ofCase(`summary = summary || '{"assistStory": true}'::jsonb`);
  const BEAT = ofCase(`dynamics = dynamics - 'logicStreak'`);
  const twoRankedToday = async () => {
    await db.exec(`set local session_replication_role = replica`);
    await db.query(
      `insert into public.playtest_sessions (session_id, run_id, session_code, case_id, case_title, summary)
       values ($1, 'run-parts-old-1', 'PARTS', 'season-final', 'SEASON 01 COMPLETE', '{"seasonComplete": true}'),
              ($1, 'run-parts-old-2', 'PARTS', 'season-final', 'SEASON 01 COMPLETE', '{"seasonComplete": true}')`,
      [device],
    );
    await db.exec(`set local session_replication_role = origin`);
  };

  const P = (message) => new RegExp(`^P0001 ${message}$`);
  const LATER = (message) => new RegExp(`^PT425 ${message}$`);
  const PACE = (message) => new RegExp(`^PT429 ${message}$`);
  const EVERY_CASE = LATER("season ranking requires every case of the run");
  const FIELD = P("playtest session field too large");
  const SHAPE = P("invalid playtest session payload");
  const RANK_LIMIT = PACE("season ranking limit reached");
  const RATE = PACE("telemetry rate limit exceeded");
  const STORED = "stored";
  const DROPPED = "dropped";

  // [what is sent, what has to happen, the table, the row, and what else the probe needs]
  const probes = [
    // The envelope: session id, session code, event id, the row's bytes.
    ["a feedback row with a five-character session id", P("invalid telemetry session id"), "playtest_feedback", feedback({ session_id: "short" })],
    ["a case row with a 129-character session id", P("invalid telemetry session id"), "playtest_sessions", sessionRow({ session_id: "s".repeat(129) })],
    ["an error log with no session id", P("invalid telemetry session id"), "app_error_logs", without(errorLog(), "session_id")],
    ["a case row with a 33-character session code", P("invalid telemetry session code"), "playtest_sessions", sessionRow({ session_code: "X".repeat(33) })],
    ["a feedback row with an empty event id", P("invalid telemetry event id"), "playtest_feedback", feedback({ event_id: "" })],
    ["an error log with a 129-character event id", P("invalid telemetry event id"), "app_error_logs", errorLog({ event_id: "e".repeat(129) })],
    ["a 200 KB case row", P("telemetry payload too large"), "playtest_sessions", sessionRow({ decision_log: Array.from({ length: 30 }, () => ({ echo: "x".repeat(7000) })) })],
    ["a 600 KB error log", P("telemetry payload too large"), "app_error_logs", errorLog({ error_stack: "x".repeat(600000) })],
    ["a 300 KB error log, which is cut and kept", STORED, "app_error_logs", errorLog({ error_stack: "x".repeat(300000) })],

    // A case row: its shape and its caps.
    ["a case row for a case that does not exist", SHAPE, "playtest_sessions", sessionRow({}, { caseId: "bogus" })],
    ["a case row whose summary is an array", SHAPE, "playtest_sessions", sessionRow({ summary: [] })],
    ["a case row whose decision log is an object", SHAPE, "playtest_sessions", sessionRow({ decision_log: {} })],
    ["a case row with a 61-entry decision log", SHAPE, "playtest_sessions", sessionRow({ decision_log: Array.from({ length: 61 }, () => ({ nodeId: "n" })) })],
    // The function lets a null log through; the column does not.
    ["a case row whose decision log is null", /^(23502|42501) /, "playtest_sessions", sessionRow({ decision_log: null })],
    ["a case row with a 129-character run id", FIELD, "playtest_sessions", sessionRow({ run_id: "r".repeat(129) })],
    ["a case row with an 81-character title", FIELD, "playtest_sessions", sessionRow({ case_title: "가".repeat(81) })],
    ["a case row with a 5 KB summary", FIELD, "playtest_sessions", sessionRow({ summary: { note: "x".repeat(5000) } })],
    ["a case row with 2 KB of resources", FIELD, "playtest_sessions", sessionRow({ resources: { note: "x".repeat(2000) } })],
    ["a case row with 2 KB of triggers", FIELD, "playtest_sessions", sessionRow({ triggers: { note: "x".repeat(2000) } })],
    ["a case row with 2 KB of cognition", FIELD, "playtest_sessions", sessionRow({ cognition: { note: "x".repeat(2000) } })],
    ["a case row with 3 KB of dynamics", FIELD, "playtest_sessions", sessionRow({ dynamics: { note: "x".repeat(3000) } })],
    ["a case row with a 9 KB decision entry", P("decision log entry too large"), "playtest_sessions", sessionRow({ decision_log: [{ echo: "x".repeat(9000) }] })],
    ["a case row", STORED, "playtest_sessions", sessionRow()],
    ["a case row from a request with no address", STORED, "playtest_sessions", sessionRow(), { headers: null }],
    ["a case row with an empty run id", STORED, "playtest_sessions", sessionRow({ run_id: "" })],

    // One row per run and case.
    ["a case row that is stored already", DROPPED, "playtest_sessions", { ...landed, event_id: uuid() }],
    ["a stored case row again from a request with no address", DROPPED, "playtest_sessions", { ...landed, event_id: uuid() }, { headers: null }],
    ["a stored case row again past the hour's replays", RATE, "playtest_sessions", { ...landed, event_id: uuid() }, { setup: counterAt(`tele-replay:${writer}`, 600) }],

    // The ranking row: what the request says, then the run, then what is published, then the limits.
    ["the ranking row of a watched season", STORED, "playtest_sessions", season()],
    ["a ranking row that says the season is not complete", P("season ranking requires a completed summary"), "playtest_sessions", season({}, { seasonComplete: false })],
    ["a ranking row with seasonComplete '1'", STORED, "playtest_sessions", season({}, { seasonComplete: "1" })],
    // `null not in (...)` is null, and the function has always let that pass.
    ["a ranking row that does not say whether the season is complete", STORED, "playtest_sessions", (() => { const row = season(); return { ...row, summary: without(row.summary, "seasonComplete") }; })()],
    ["a ranking row with no decisions", P("season ranking requires decisions"), "playtest_sessions", season({ decision_log: [] })],
    ["a ranking row with an empty run id", P("season ranking requires a run id"), "playtest_sessions", season({ run_id: "" })],
    ["a ranking row for a run nobody played", EVERY_CASE, "playtest_sessions", season({}, { runId: "run-parts-none" })],
    ["a ranking row for a run missing a case", EVERY_CASE, "playtest_sessions", season(), { setup: doing(dropCase) }],
    ["a ranking row from a device that did not play the final case", EVERY_CASE, "playtest_sessions", season({}, { session: sessionId(61) })],
    ["a ranking row for a season with a story case", P("story-mode runs are not ranked"), "playtest_sessions", season(), { setup: doing(STORY) }],
    ["a ranking row for a season with a beat-table case", P("beat-table runs are not ranked"), "playtest_sessions", season(), { setup: doing(BEAT) }],
    ["a ranking row for a season with a case that has no dynamics", P("beat-table runs are not ranked"), "playtest_sessions", season(), { setup: doing(ofCase("dynamics = null")) }],
    ["a ranking row for a season played in no time", LATER("season ranking run is implausibly short"), "playtest_sessions", season(), { setup: doing(ofRun("completed_at = now()")) }],
    ["a ranking row for a season whose rows arrived together", P("season ranking run was not played where the server could watch it"), "playtest_sessions", season(), { setup: doing(ofRun("completed_at = now() - interval '2 hours'")) }],
    ["a ranking row whose final case has a text score", P("invalid season ranking score"), "playtest_sessions", season(), { setup: doing(ofCase(`summary = summary || '{"burstScore": "100"}'::jsonb`, "final")) }],
    ["a ranking row whose final case scored 101", P("invalid season ranking score"), "playtest_sessions", season(), { setup: doing(ofCase(`summary = summary || '{"burstScore": 101}'::jsonb`, "final")) }],
    ["a ranking row whose final case has rank Z", P("invalid season ranking rank"), "playtest_sessions", season(), { setup: doing(ofCase(`summary = summary || '{"rank": "Z"}'::jsonb`, "final")) }],
    ["a device's third ranking row of the day", RANK_LIMIT, "playtest_sessions", season(), { setup: twoRankedToday }],
    ["an address's 21st ranking row of the day", RANK_LIMIT, "playtest_sessions", season(), { setup: counterAt(`season-ip:${writer}`, 20) }],
    // Two reasons at once: the one that stood first is the one that is told.
    ["a ranking row for a run missing a case, with a story case", EVERY_CASE, "playtest_sessions", season(), { setup: doing(dropCase, STORY) }],
    ["a ranking row for a story season from the beat table", P("story-mode runs are not ranked"), "playtest_sessions", season(), { setup: doing(STORY, BEAT) }],
    ["a ranking row for a story season played in no time", P("story-mode runs are not ranked"), "playtest_sessions", season(), { setup: doing(STORY, ofRun("completed_at = now()")) }],
    ["a ranking row for a beat-table season whose rows arrived together", P("beat-table runs are not ranked"), "playtest_sessions", season(), { setup: doing(BEAT, ofRun("completed_at = now() - interval '2 hours'")) }],
    ["a ranking row with a text score and rank Z", P("invalid season ranking score"), "playtest_sessions", season(), { setup: doing(ofCase(`summary = summary || '{"burstScore": "100", "rank": "Z"}'::jsonb`, "final")) }],
    ["a third ranking row of the day with rank Z", P("invalid season ranking rank"), "playtest_sessions", season(), { setup: async () => { await doing(ofCase(`summary = summary || '{"rank": "Z"}'::jsonb`, "final"))(); await twoRankedToday(); } }],

    // Feedback, error logs, and the table only the service role writes.
    ["a feedback row", STORED, "playtest_feedback", feedback()],
    ["a feedback row about no case", STORED, "playtest_feedback", feedback({ case_id: null })],
    ["a feedback row for a case that does not exist", P("invalid feedback case"), "playtest_feedback", feedback({ case_id: "bogus" })],
    ["a feedback row for the ranking row's case id", P("invalid feedback case"), "playtest_feedback", feedback({ case_id: "season-final" })],
    ["a feedback row whose feedback is an array", P("invalid feedback payload"), "playtest_feedback", feedback({ feedback: [] })],
    ["a feedback row with 9 KB of feedback", P("invalid feedback payload"), "playtest_feedback", feedback({ feedback: { comment: "x".repeat(9000) } })],
    ["an error log", STORED, "app_error_logs", errorLog()],
    ["an error log for a case that does not exist", P("invalid error log case"), "app_error_logs", errorLog({ current_case: "bogus" })],
    ["an error log for an unknown case", STORED, "app_error_logs", errorLog({ current_case: "unknown" })],
    ["an error log dated 2099", STORED, "app_error_logs", errorLog({ occurred_at: "2099-01-01T00:00:00Z" })],
    ["an error log dated forty days ago", STORED, "app_error_logs", errorLog({ occurred_at: new Date(Date.now() - 40 * 86400000).toISOString() })],
    ["an error log dated yesterday", STORED, "app_error_logs", errorLog({ occurred_at: new Date(Date.now() - 86400000).toISOString() })],
    ["an error log with an oversized viewport and context", STORED, "app_error_logs", errorLog({ viewport: { note: "x".repeat(3000) }, context: { note: "x".repeat(9000) } })],
    ["a free-text analysis from the service role", STORED, "free_text_analyses", { event_id: uuid(), session_id: device, case_id: "case01", node_id: "n1", analysis: {} }, { role: "service_role" }],
    ["a free-text analysis with a five-character session id", P("invalid telemetry session id"), "free_text_analyses", { event_id: uuid(), session_id: "short", case_id: "case01", node_id: "n1", analysis: {} }, { role: "service_role" }],

    // Pace: the device, the address, everyone.
    ["a device's 241st telemetry row of the hour", RATE, "app_error_logs", errorLog(), { setup: counterAt(`tele:${writer}|${device}`, 240) }],
    ["a device's 241st row of the hour from a request with no address", RATE, "app_error_logs", errorLog(), { headers: null, setup: counterAt(`tele:-|${device}`, 240) }],
    ["an address's 1,201st telemetry row of the hour", RATE, "app_error_logs", errorLog(), { setup: counterAt(`tele-ip:${writer}`, 1200) }],
    ["a telemetry row past the day's ceiling", PACE("telemetry daily ceiling reached"), "playtest_feedback", feedback(), {
      setup: doing([`insert into public.private_settings (name, value) values ('telemetry_daily_bytes', '1000') on conflict (name) do update set value = excluded.value`]),
    }],
  ];

  /** What one definition does with one probe: the refusal, or the stored row and every counter. Nothing it writes is kept. */
  const outcomeOf = async ([, , table, payload, { headers: sentWith = headers, role = "anon", setup = null } = {}]) => {
    await db.exec(`begin`);
    try {
      try {
        if (setup) await setup();
      } catch (error) {
        return { setupFailed: `${error.code} ${error.message}` };
      }
      await db.query(`select set_config('request.headers', $1, true)`, [sentWith ? JSON.stringify(sentWith) : ""]);
      const insert = postgrestInsert(table, payload);
      try {
        await db.exec(`set local role ${role}`);
        await db.query(insert.sql, insert.params);
      } catch (error) {
        return { refused: `${error.code} ${error.message}` };
      }
      await db.exec(`reset role`);
      // The byte counters less the row's own size. The second pass gets later
      // ids from the sequence, which no rollback winds back, and a row whose id
      // has one digit more charges one byte more. The global ceiling and the
      // address's budget each charged the row with its id in it (the global one
      // before the trigger rewrote it, which is the same in both passes), and
      // the address's only for a request with an address to a table the anon
      // role writes.
      const charged = ["global:telemetry-bytes"];
      if (sentWith && table !== "free_text_analyses") charged.push(`tele-bytes-ip:${writer}`);
      await db.query(
        `update public.telemetry_rate_limits r set request_count = r.request_count - s.bytes
           from (select octet_length(to_jsonb(t)::text) as bytes from public.${table} t where t.event_id = $1) s
          where r.actor_key = any($2::text[])`,
        [payload.event_id ?? null, charged],
      );
      // The row as stored, but for its id; a date equal to the transaction's now() reads "now".
      const stored = await one(
        `select (
           select jsonb_object_agg(e.key, case
             when e.key in ('completed_at', 'created_at', 'occurred_at') and jsonb_typeof(e.value) = 'string'
               then case when (e.value #>> '{}')::timestamptz = now() then '"now"'::jsonb else e.value end
             else e.value end)
           from jsonb_each(to_jsonb(t) - 'id') e
         )::text as row
         from public.${table} t where t.event_id = $1`,
        [payload.event_id ?? null],
      );
      const counters = await one(
        `select coalesce(jsonb_agg(jsonb_build_array(actor_key, request_count) order by actor_key), '[]'::jsonb)::text as counters from public.telemetry_rate_limits`,
      );
      return { stored: stored?.row ?? null, counters: counters?.counters ?? null };
    } finally {
      await db.exec(`rollback`);
    }
  };
  const outcomes = async () => {
    const seen = [];
    for (const probe of probes) seen.push(await outcomeOf(probe));
    return seen;
  };

  if (whole && before) {
    const inParts = await outcomes();
    await db.exec(whole);
    let asWhole = null;
    let comparedWith;
    try {
      comparedWith = (await installed())?.source ?? null;
      asWhole = await outcomes();
    } finally {
      // The function the migrations ended on goes back, whatever happened above.
      await db.exec(before.definition);
    }
    check((await installed())?.source === before.source, "the trigger function was not put back as the migrations left it; everything after this ran on another definition.");
    check(
      comparedWith !== null && comparedWith !== before.source && !comparedWith.includes("public.telemetry_check_envelope("),
      `the function 20261011010000 wrote out whole was not the one the second pass ran; the function in parts was compared with itself.`,
    );
    probes.forEach(([label, expected], index) => {
      const now = inParts[index];
      const then = asWhole?.[index] ?? null;
      const said = now.setupFailed ? `could not be set up (${now.setupFailed})` : now.refused ? `was refused: ${now.refused}` : now.stored ? "was stored" : "was dropped";
      const asExpected =
        expected === STORED ? Boolean(now.stored) && !now.refused && !now.setupFailed
        : expected === DROPPED ? now.stored === null && !now.refused && !now.setupFailed && now.counters !== null
        : Boolean(now.refused) && expected.test(now.refused);
      check(asExpected, `${label} ${said}; expected ${expected instanceof RegExp ? `a refusal matching ${expected}` : `it to be ${expected}`}.`);
      check(
        JSON.stringify(now) === JSON.stringify(then),
        `${label}: validate_telemetry_insert in parts and the whole function of 20261011010000 disagree. ` +
          `In parts: ${JSON.stringify(now).slice(0, 400)}. Whole: ${JSON.stringify(then).slice(0, 400)}.`,
      );
    });
    // Nothing a probe wrote is left: the run it borrowed is still whole and still unranked.
    const left = await one(
      `select (count(*) filter (where case_id <> 'season-final'))::int as cases, (count(*) filter (where case_id = 'season-final'))::int as ranked
         from public.playtest_sessions where run_id = $1`,
      [RUN],
    );
    check(left?.cases === CASE_SEQUENCE.length && left?.ranked === 0, `the probes left ${RUN} with ${left?.cases} case rows and ${left?.ranked} ranking rows; each was to be rolled back.`);
  }
}

// ---- retention runs as the service role and reaches every table

await db.query(`update public.playtest_feedback set created_at = 'infinity'`);
{
  const result = await allowed("run purge_old_telemetry", "service_role", `select * from public.purge_old_telemetry('180 days')`);
  const counts = result?.rows[0] ?? {};
  for (const column of ["sessions_deleted", "feedback_deleted", "errors_deleted", "board_posts_deleted", "analyses_deleted", "cloud_saves_deleted", "rate_limits_deleted"]) {
    check(column in counts, `purge_old_telemetry no longer reports ${column}.`);
  }
  check(Number(counts.feedback_deleted) >= 1, "a feedback row dated 'infinity' survived retention.");
}

await db.close();

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Grant checks passed (${files.length} migrations replayed with no automatic table grants, ${tables.length} tables, ${policies.length} policies).`,
  );
}
