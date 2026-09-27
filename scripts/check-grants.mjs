import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";

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
 * none. Then it asserts two things.
 *
 *   1. Rules that hold for any table, so a new one cannot slip through: RLS is
 *      on, service_role can read and write it, and every policy aimed at anon
 *      or authenticated has the privilege it filters -- a policy without its
 *      grant is never consulted, which is exactly the bug above.
 *   2. The contract the client actually relies on, by running it as anon: each
 *      write `src/telemetry.js` makes, each read and RPC it calls, and the
 *      reads that must stay refused because the tables are write-only.
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

// --------------------------------------------------------------- 2. contract

async function expect(label, role, sql, shouldSucceed) {
  await db.exec(`set role ${role}`);
  try {
    await db.query(sql);
    if (!shouldSucceed) failures.push(`${role} could ${label}; it has to be refused.`);
  } catch (error) {
    if (shouldSucceed) failures.push(`${role} cannot ${label}: [${error.code}] ${error.message}`);
    else if (error.code !== "42501") failures.push(`${role} ${label} failed for the wrong reason: [${error.code}] ${error.message}`);
  } finally {
    await db.exec("reset role");
  }
}
const allowed = (label, role, sql) => expect(label, role, sql, true);
const refused = (label, role, sql) => expect(label, role, sql, false);
const session = (n) => `grants-check-${n}`;

// The writes `insertRow` and `postBoardPost` make.
await allowed("insert a case row", "anon",
  `insert into public.playtest_sessions (session_id, session_code, case_id, summary) values ('${session(1)}', 'CODE01', 'case01', '{}')`);
await allowed("insert feedback", "anon",
  `insert into public.playtest_feedback (session_id, case_id, feedback) values ('${session(2)}', 'case01', '{}')`);
await allowed("insert an error log", "anon",
  `insert into public.app_error_logs (session_id, current_case, error_message) values ('${session(3)}', 'case01', 'check')`);
await allowed("insert a free-text analysis", "anon",
  `insert into public.free_text_analyses (session_id, case_id, node_id, analysis) values ('${session(4)}', 'case01', 'n1', '{}')`);
await allowed("post to the board", "anon",
  `insert into public.board_posts (session_id, nickname, body) values ('${session(5)}', '점검', '새 데이터베이스 쓰기 확인')`);

// The reads and RPCs.
await allowed("read the board", "anon", `select id, nickname, body, created_at from public.board_posts`);
await allowed("read the ranking", "anon", `select * from public.public_rankings limit 1`);
await allowed("read telemetry health", "anon", `select * from public.telemetry_health limit 1`);
await allowed("put a cloud save", "anon", `select public.put_cloud_save('ABCDEFGH2345', now(), '{"v":1}'::jsonb)`);
await allowed("get a cloud save", "anon", `select public.get_cloud_save('ABCDEFGH2345')`);

// Write-only stays write-only.
await refused("read feedback", "anon", `select * from public.playtest_feedback`);
await refused("read free-text analyses", "anon", `select * from public.free_text_analyses`);
await refused("read error logs", "anon", `select * from public.app_error_logs`);
await refused("read a raw decision_log", "anon", `select decision_log from public.playtest_sessions`);
await refused("read board post session ids", "anon", `select session_id from public.board_posts`);
await refused("update a case row", "anon", `update public.playtest_sessions set player_name = 'x'`);
await refused("read cloud saves directly", "anon", `select * from public.cloud_saves`);
await refused("read rate limits", "anon", `select * from public.telemetry_rate_limits`);
await refused("read the board", "authenticated", `select * from public.board_posts`);

// Moderation and retention run as the service role.
await allowed("hide a board post", "service_role", `update public.board_posts set hidden = true`);
await allowed("run purge_old_telemetry", "service_role", `select * from public.purge_old_telemetry('180 days')`);

await db.close();

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Grant checks passed (${files.length} migrations replayed with no automatic table grants, ${tables.length} tables, ${policies.length} policies).`,
  );
}
