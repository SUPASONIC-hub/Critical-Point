import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";

import { initialResources } from "../src/gameConstants.js";
import { CASE_SEQUENCE } from "../src/gameCases.js";
import { createCaseSummary, getEndingVariant } from "../src/gameLogic.js";
import { toRowSummary } from "../src/state/useChoiceCommit.js";
import { createRunSummary, RUN_INITIAL_STATE } from "../src/gauntlet/gauntletEngine.js";
import { RELIC_IDS } from "../src/gauntlet/relics.js";
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

// No function is an RPC by accident. A function in `public` is executable by
// PUBLIC unless a migration says otherwise, and PostgREST serves every one the
// caller may execute, so a helper a trigger calls becomes an unmetered endpoint.
// The list is what the client calls and what a policy needs (20260929040000).
const CLIENT_FUNCTIONS = {
  anon: ["delete_cloud_save", "get_cloud_save", "is_season_case_id", "peek_cloud_save", "put_cloud_save"],
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
    tempoBonus: { label: "GROOVE", text: "박자 4회 · 최고 콤보 3 · 판돈 +12" },
    clueReward: null,
    threshold: {
      state: "cash", busted: false, cause: "cashed", forced: false, gauge: 63, wall: 88, pushes: 3,
      rewardMultiplier: 1.4, potMultiplier: 1.8, pot: 42, lostPot: 0,
      tempo: { hits: 4, maxCombo: 3, groovePot: 12 }, focus: { charge: 0, potMultiplier: 1, resourceMultiplier: 1 },
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
const playRun = async (runId, { backdate = true, session = rankedSession, finalSummary = null } = {}) => {
  for (const caseId of CASE_SEQUENCE) {
    const payload = casePayload({ session, runId, caseId });
    if (caseId === "final") payload.summary = { ...payload.summary, burstScore: 88, rank: "A", ...(finalSummary ?? {}) };
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
  // Twenty ranking rows a day for an address, whatever the device.
  await presetCounter(`season-ip:${await writerKey("198.51.100.20")}`, 20);
  await playRun("run-ranked-5", { session: sessionId(13) });
  await postRefused("rank a 21st run from one address in a day", "playtest_sessions", seasonPayload({ session: sessionId(13), runId: "run-ranked-5" }), /^PT429 .*limit reached/);
}
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
  check(rows.every((row) => row.case_title === "SEASON 01 COMPLETE"), "a ranking row's title is not the constant.");
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
  // A client deployed before 20260929030000 names no revision and is ordered by time.
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
