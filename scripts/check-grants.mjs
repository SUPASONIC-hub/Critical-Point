import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";

import { initialResources } from "../src/gameConstants.js";
import { CASE_SEQUENCE } from "../src/gameCases.js";
import { createCaseSummary } from "../src/gameLogic.js";
import { createRunSummary, RUN_INITIAL_STATE } from "../src/gauntlet/gauntletEngine.js";
import { createSeasonTelemetryPayload } from "../src/viewModels/seasonViewModels.js";

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
 * none. Then it asserts three things.
 *
 *   1. Rules that hold for any table, so a new one cannot slip through: RLS is
 *      on, service_role can read and write it, and every policy aimed at anon
 *      or authenticated has the privilege it filters -- a policy without its
 *      grant is never consulted, which is exactly the bug above.
 *   2. The contract the client actually relies on, by running it as anon with
 *      the payloads the client actually builds, inserted the way PostgREST
 *      inserts them (only the keys present, `on conflict (event_id) do
 *      nothing`). A simplified payload is how a 400 on every feedback row went
 *      unnoticed: the check sent columns that existed, the client did not.
 *   3. The refusals the server is there for: forged times, a ranking row for a
 *      run nobody played, a second one, a board flood, a spoofed forwarding
 *      header, a cloud save dated in the future, and every privilege 20260928
 *      revoked.
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

const files = readdirSync(MIGRATIONS).filter((file) => file.endsWith(".sql")).sort();
for (const file of files) {
  try {
    await db.exec(readFileSync(path.join(MIGRATIONS, file), "utf8"));
  } catch (error) {
    console.error(`supabase/migrations/${file} does not apply to a fresh database: ${error.message}`);
    process.exit(1);
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

// A decision-log entry with every key `choose` in src/GameRuntime.jsx writes,
// at realistic sizes. There is no shared builder for it -- the entry is
// assembled inline there -- so keep this in step when that object grows.
function decisionEntry(caseId, index) {
  const resources = { ...initialResources };
  return {
    caseId,
    nodeId: `${caseId}_scene_${index}`,
    choiceId: `${caseId}_choice_${index}`,
    title: "현장 판단 — 서류가 먼저 도착한 날",
    chapterRule: "기록이 먼저, 해명은 나중",
    choice: "책임자를 먼저 부르고 기록을 봉인한다",
    spokenChoice: "지금 부르겠습니다. 기록은 손대지 마세요.",
    reframe: false,
    reframeOpenedRoute: false,
    continuityMemory: false,
    effect: { time: -4, capital: -6, trust: 3, legitimacy: 2, humanCost: 1, fatigue: 2 },
    riskRewardEffect: { time: -1, capital: 2 },
    cognition: { persistence: 2, reflection: 1 },
    triggers: ["responsibility", "protection"],
    echo: "기록이 봉인되자 복도가 조용해졌다. 누군가는 이 결정을 오래 기억할 것이다.".repeat(2),
    sceneBeat: { tone: "pressure", line: "시계가 두 번 울렸다.".repeat(4) },
    challenge: { title: "책임의 순서", matched: true, riskDelta: -2 },
    tactical: { read: "압박이 한쪽으로 쏠린다", advice: "속도를 늦춘다" },
    flowSurge: null,
    tempoBonus: { label: "GROOVE", text: "박자 4회 · 최고 콤보 3 · 판돈 +12" },
    clueReward: null,
    threshold: {
      state: "cash", busted: false, cause: "cashed", forced: false, gauge: 63, wall: 88, pushes: 3,
      rewardMultiplier: 1.4, potMultiplier: 1.8, pot: 42, lostPot: 0,
      tempo: { hits: 4, maxCombo: 3, groovePot: 12 }, focus: { charge: 0, potMultiplier: 1, resourceMultiplier: 1 },
    },
    environmentMode: "stable",
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

/** `caseTelemetryPayload` in src/GameRuntime.jsx, key for key. */
function casePayload({ session, runId, caseId, completedAt = new Date().toISOString() }) {
  const log = Array.from({ length: 6 }, (_, index) => decisionEntry(caseId, index));
  const summary = {
    ...createCaseSummary(triggers, cognition, log, { resources: initialResources, schemaVersion: 7 }),
    endingVariant: "steady",
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
    completed_at: completedAt,
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
const caseRow = casePayload({ session: sessionId(1), runId: "run-contract-1", caseId: "case01", completedAt: "2099-01-01T00:00:00Z" });
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
  check(row?.clamped === true, "a case row dated 2099 kept its date; completed_at must be the server's now().");
}
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
{
  const { rows } = await db.query(`select actor_key from public.telemetry_rate_limits where actor_key like 'tele-ip:%'`);
  const keys = rows.map((row) => row.actor_key);
  check(keys.includes("tele-ip:203.0.113.9"), `the right-most forwarded hop was not the rate-limit key: ${keys.join(", ")}`);
  check(keys.includes("tele-ip:192.0.2.44"), `cf-connecting-ip was not preferred: ${keys.join(", ")}`);
  check(!keys.some((key) => /6\.6\.6\.6|7\.7\.7\.7/.test(key)), "a client-written forwarded address became a rate-limit key.");
}

// ---- the ranking

const rankedSession = sessionId(10);
const playRun = async (runId, { backdate = true } = {}) => {
  for (const caseId of CASE_SEQUENCE) {
    const { sql, params } = postgrestInsert("playtest_sessions", casePayload({ session: rankedSession, runId, caseId }));
    await db.query(sql, params);
  }
  if (backdate) {
    await db.query(`update public.playtest_sessions set completed_at = now() - interval '2 hours' where run_id = $1`, [runId]);
  }
};

withHeaders({ "x-forwarded-for": "198.51.100.20" });
await postRefused("rank a run with no case rows", "playtest_sessions", seasonPayload({ session: rankedSession, runId: "run-ranked-1" }), /every case of the run/);
await playRun("run-ranked-1", { backdate: false });
await postRefused("rank a run played in under ten minutes", "playtest_sessions", seasonPayload({ session: rankedSession, runId: "run-ranked-1" }), /implausibly short/);
await db.query(`update public.playtest_sessions set completed_at = now() - interval '2 hours' where run_id = 'run-ranked-1'`);
await postRefused("rank the run from a device that did not play its final case", "playtest_sessions", seasonPayload({ session: sessionId(11), runId: "run-ranked-1" }), /every case of the run/);
await post("rank a run the server watched being played", "playtest_sessions", seasonPayload({ session: rankedSession, runId: "run-ranked-1" }));
await post("send a second ranking row for the same run", "playtest_sessions", seasonPayload({ session: rankedSession, runId: "run-ranked-1" }));
check(
  (await one(`select count(*)::int as n from public.playtest_sessions where case_id = 'season-final' and run_id = 'run-ranked-1'`))?.n === 1,
  "a run has two ranking rows; one run must rank once.",
);
await playRun("run-ranked-2");
await post("rank a second run with seasonComplete '1'", "playtest_sessions", seasonPayload({ session: rankedSession, runId: "run-ranked-2", seasonComplete: "1" }));
await playRun("run-ranked-3");
await postRefused("rank a third run from one device in a day", "playtest_sessions", seasonPayload({ session: rankedSession, runId: "run-ranked-3" }), /limit reached/);
withHeaders(null);

{
  const result = await allowed(
    "read the ranking the way the client does",
    "anon",
    `select run_tag, player_name, case_id, case_title, completed_at, summary, score
     from public.public_rankings order by score desc nulls last, completed_at asc limit 100`,
  );
  const rows = result?.rows ?? [];
  check(rows.length === 2, `the ranking shows ${rows.length} rows; expected the two accepted runs (the '1' one normalised to true).`);
  check(rows.every((row) => new Date(row.completed_at) <= new Date()), "a ranking row is dated in the future.");
  check(rows.every((row) => !("runId" in row.summary)), "a ranking summary still carries the full runId.");
  check(rows.every((row) => /^[A-Z0-9]{1,8}$/.test(row.run_tag)), "run_tag is not the short tag the ranking prints.");
}
await refused("read a ranking row's full run_id", "anon", `select run_id from public.playtest_sessions`);
await refused("read a ranking row's session_code", "anon", `select session_code from public.public_rankings`, /^42(501|703) /);
await allowed("read telemetry health", "anon", `select * from public.telemetry_health limit 1`);

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
await boardPost("post the same body again from a new session id", sessionId(22), "교실", "같은 교실의 다른 사람입니다");
check(
  (await one(`select count(*)::int as n from public.board_posts where body = '같은 교실의 다른 사람입니다'`))?.n === 1,
  "the same body from one address was stored twice by rotating session_id.",
);
await boardPost("post from a third device on the same address", sessionId(23), "교실셋", "세 번째 사람의 글");
await boardRefused("flood from one address with rotating session ids", sessionId(24), "봇봇", "네 번째 글", /30 seconds/);
withHeaders(null);

const filters = [
  ["a link in the nickname", "spam-site.xyz", "평범한 본문입니다"],
  ["a bare domain", "점검", "visit spam.com now"],
  ["a spaced dot", "점검", "example . com 으로 오세요"],
  ["a bracketed dot", "점검", "example[.]me 로 오세요"],
  ["a .gg link", "점검", "discord.gg/abc 들어오세요"],
  ["닷컴", "점검", "스팸닷컴 으로 오세요"],
  ["a Korean mobile number", "점검", "연락주세요 010-1234-5678"],
  ["an e-mail address", "점검", "메일 someone@example.org"],
  ["a whitespace-only body", "점검", "\u3000\u200B\n\t\u00A0"],
  ["a zero-width nickname", "\u200B\u200B\u200B", "평범한 본문입니다"],
];
let filterIp = 40;
for (const [label, nickname, body] of filters) {
  withHeaders({ "x-forwarded-for": `198.51.100.${filterIp++}` });
  await boardRefused(`post ${label}`, sessionId(30 + filterIp), nickname, body, /link|contact|characters/);
}
withHeaders({ "x-forwarded-for": `198.51.100.${filterIp}` });
await boardPost("post ordinary prose with a sentence break", sessionId(90), "점검", "Thanks. Me too. 3.5점 정도였어요.");
withHeaders(null);

await allowed("read the board", "anon", `select id, nickname, body, created_at from public.board_posts`);
await refused("read board post session ids", "anon", `select session_id from public.board_posts`);
await refused("read board post writer keys", "anon", `select actor_key from public.board_posts`);
await refused("hide a board post", "anon", `select public.moderate_board_post(1)`);
await allowed("hide a board post", "service_role", `select public.moderate_board_post((select min(id) from public.board_posts))`);
{
  const result = await allowed("read the board after moderation", "anon", `select id from public.board_posts`);
  const hidden = await one(`select min(id) as id from public.board_posts`);
  check(!(result?.rows ?? []).some((row) => row.id === hidden.id), "a hidden board post is still readable by anon.");
}

// ---- cloud saves

withHeaders({ "x-forwarded-for": "198.51.100.60" });
await allowed("put a cloud save dated next week", "anon", `select public.put_cloud_save('ABCDEFGH2345', now() + interval '6 days', '{"v":1}'::jsonb)`);
{
  const result = await allowed("get a cloud save", "anon", `select public.get_cloud_save('ABCDEFGH2345') as save`);
  const savedAt = result?.rows[0]?.save?.saved_at;
  check(savedAt && new Date(savedAt) <= new Date(Date.now() + 1000), `a cloud save kept a future saved_at (${savedAt}); it must be clamped to now().`);
}
{
  const result = await allowed("put an honest save after a future-dated one", "anon", `select public.put_cloud_save('ABCDEFGH2345', now(), '{"v":2}'::jsonb) as r`);
  check(result?.rows[0]?.r?.accepted === true, "an honest save was locked out by a future-dated one.");
  const stale = await allowed("put a save older than the stored one", "anon", `select public.put_cloud_save('ABCDEFGH2345', now() - interval '1 day', '{"v":0}'::jsonb) as r`);
  check(stale?.rows[0]?.r?.accepted === false, "a stale device overwrote a newer cloud save.");
}
{
  let refusedAt = 0;
  for (let attempt = 1; attempt <= 260 && !refusedAt; attempt += 1) {
    try {
      await run("anon", `select public.put_cloud_save('ZZZZZZZZ2345', now(), '{"v":1}'::jsonb)`);
    } catch (error) {
      if (/rate limit/.test(error.message)) refusedAt = attempt;
      else throw error;
    }
  }
  check(refusedAt === 241, `cloud saves for one code were refused at put ${refusedAt || "never"}; expected 241.`);
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
};
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
await refused("insert a case row", "authenticated", postgrestInsert("playtest_sessions", casePayload({ session: sessionId(99), runId: "run-auth", caseId: "case01" })).sql.replace("$1::jsonb", `'{"session_id":"x"}'::jsonb`));
await refused("run purge_old_telemetry", "anon", `select * from public.purge_old_telemetry('180 days')`);
await refused("bump a rate limit", "anon", `select public.bump_rate_limit('x', '1 hour', 1)`);
await refused("put a cloud save", "authenticated", `select public.put_cloud_save('ABCDEFGH2345', now(), '{}'::jsonb)`);

// The trigger's last branch still serves the one table only service_role writes.
await allowed("record a free-text analysis", "service_role",
  `insert into public.free_text_analyses (session_id, case_id, node_id, analysis) values ('${sessionId(98)}', 'case01', 'n1', '{}')`);

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
