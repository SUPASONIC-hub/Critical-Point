import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { test } from "node:test";

import { compareMigrations, describeCliFailure, describeDrift, localMigrationVersions, parseMigrationList, redactCliOutput } from "../../scripts/migration-drift.mjs";

// What `supabase migration list --linked --output-format json` prints (CLI
// 2.118/2.119), cut down to three rows: one applied, one in the repository
// only, one in the database only.
const JSON_LISTING = JSON.stringify({
  migrations: [
    { local: "20260902055713", remote: "20260902055713", time: "2026-09-02 05:57:13" },
    { local: "20260929050000", remote: "", time: "2026-09-29 05:00:00" },
    { remote: "20260930120000", time: "2026-09-30 12:00:00" },
  ],
  message: "Migrations listed",
});

const TABLE_LISTING = [
  "Connecting to remote database...",
  "",
  "   Local          | Remote         | Time (UTC)          ",
  "  ----------------|----------------|---------------------",
  "   20260902055713 | 20260902055713 | 2026-09-02 05:57:13 ",
  "   20260929050000 |                | 2026-09-29 05:00:00 ",
  "                  | 20260930120000 | 2026-09-30 12:00:00 ",
].join("\n");

const EXPECTED_ROWS = [
  { local: "20260902055713", remote: "20260902055713" },
  { local: "20260929050000", remote: null },
  { local: null, remote: "20260930120000" },
];

test("the JSON listing is read, with a missing side as an empty string or an absent key", () => {
  assert.deepEqual(parseMigrationList(JSON_LISTING), EXPECTED_ROWS);
  // The CLI logs before it answers.
  assert.deepEqual(parseMigrationList(`Initialising login role...\nConnecting {pooler}\n${JSON_LISTING}\n`), EXPECTED_ROWS);
  assert.deepEqual(parseMigrationList('{"migrations":[],"message":"Migrations listed"}'), []);
});

test("the table listing is read the same way", () => {
  assert.deepEqual(parseMigrationList(TABLE_LISTING), EXPECTED_ROWS);
  assert.deepEqual(parseMigrationList(TABLE_LISTING.replaceAll("|", "│")), EXPECTED_ROWS);
});

test("output that is neither shape is not an empty history", () => {
  assert.equal(parseMigrationList(""), null);
  assert.equal(parseMigrationList("Access token not provided. Supply an access token by running supabase login."), null);
  assert.equal(parseMigrationList('{"error":"unauthorized"}'), null);
  assert.equal(parseMigrationList(null), null);
});

test("a migration is named by its fourteen digits, and other files are not migrations", () => {
  assert.deepEqual(localMigrationVersions(["20260929010000_b.sql", "20260902055713_baseline.sql", "README.md", "seed.sql", "2026_short.sql"]), [
    "20260902055713",
    "20260929010000",
  ]);
});

test("both directions of drift are reported, from the directory and the remote column", () => {
  const result = compareMigrations(["20260902055713", "20260929050000"], EXPECTED_ROWS);
  assert.deepEqual(result, { notApplied: ["20260929050000"], notInRepository: ["20260930120000"], applied: 1 });
  const text = describeDrift(result, new Map([["20260929050000", "supabase/migrations/20260929050000_ranking_assist_time.sql"]]));
  assert.match(text, /not applied to the database \(1\)/);
  assert.match(text, /supabase\/migrations\/20260929050000_ranking_assist_time\.sql/);
  assert.match(text, /not in the repository \(1\)/);
  assert.match(text, /- 20260930120000/);
});

test("the listing's own local column is not trusted over the directory", () => {
  // A CLI run from the wrong folder lists no local files; the remote history
  // still decides.
  const listed = [{ local: null, remote: "20260902055713" }];
  assert.deepEqual(compareMigrations(["20260902055713"], listed), { notApplied: [], notInRepository: [], applied: 1 });
  assert.match(describeDrift(compareMigrations(["20260902055713"], listed)), /^In step: all 1 migrations/);
});

test("every file in supabase/migrations is one the comparison can name", () => {
  const files = readdirSync("supabase/migrations").filter((entry) => entry.endsWith(".sql"));
  const versions = localMigrationVersions(files);
  assert.equal(versions.length, files.length, "a migration file is not named <14 digits>_<name>.sql");
  assert.equal(new Set(versions).size, versions.length, "two migration files share a version");
});

test("what a failed CLI printed is shown from both streams", () => {
  // 2026-10-06: the reason was on stdout and only stderr was printed.
  const text = describeCliFailure({
    stdout: '{"_tag":"Error","error":{"code":"Forbidden","message":"missing permission to create a login role"}}',
    stderr: "Initialising login role...\n",
  });
  assert.match(text, /stderr:\nInitialising login role\.\.\./);
  assert.match(text, /stdout:\n.*missing permission to create a login role/);
  assert.equal(describeCliFailure({ stdout: "  \n", stderr: "" }), "The CLI printed nothing on either stream.");
});

test("only the last lines of a long stream are kept", () => {
  const stderr = Array.from({ length: 50 }, (_, index) => `line ${index + 1}`).join("\n");
  assert.equal(describeCliFailure({ stderr }, 3), "stderr:\nline 48\nline 49\nline 50");
});

test("nothing that could be a credential is left in what is printed", () => {
  const jwt = ["eyJhbGciOiJIUzI1NiJ9", "eyJyb2xlIjoiYW5vbiJ9", "c2lnbmF0dXJlLXZhbHVl"].join(".");
  const secrets = [
    ["failed to connect to `postgresql://cli_login_postgres:s3cr3t-Pw@db.example.supabase.co:5432/postgres`", "s3cr3t-Pw"],
    ["host=db.example.supabase.co user=postgres password=hunter2hunter2 dbname=postgres", "hunter2hunter2"],
    ['{"password": "p4ss-in-json", "role": "cli_login"}', "p4ss-in-json"],
    [`Authorization failed for ${"sbp"}_0123456789abcdef0123456789abcdef01234567`, "0123456789abcdef"],
    [`apikey=${jwt}`, "eyJyb2xlIjoiYW5vbiJ9"],
    [`rejected bearer ${jwt} here`, "c2lnbmF0dXJlLXZhbHVl"],
  ];
  for (const [line, secret] of secrets) {
    const out = redactCliOutput(line);
    assert.ok(!out.includes(secret), `${secret} survived in: ${out}`);
    assert.match(out, /\*\*\*/);
  }
  // What explains the failure is kept: the host, the database, the message.
  const kept = redactCliOutput("failed to connect to `postgresql://cli_login_postgres:s3cr3t-Pw@db.example.supabase.co:5432/postgres`: permission denied");
  assert.match(kept, /db\.example\.supabase\.co:5432\/postgres/);
  assert.match(kept, /permission denied/);
  assert.equal(redactCliOutput("Initialising login role..."), "Initialising login role...");
});
