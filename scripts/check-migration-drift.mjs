import { appendFileSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { compareMigrations, describeCliFailure, describeDrift, localMigrationVersions, parseMigrationList } from "./migration-drift.mjs";

/**
 * Compares `supabase/migrations/` with what the live project says it has
 * applied.
 *
 *   npx supabase migration list --linked --output-format json > list.json
 *   node scripts/check-migration-drift.mjs --from list.json
 *
 * This script does not talk to the database: the listing is made by the CLI,
 * which is what holds the access token, and handed over as a file. The
 * Migration Drift workflow does both halves once a day
 * (.github/workflows/migration-drift.yml); by hand, link the project first
 * (`npx supabase link --project-ref <ref>`).
 *
 * Exit 0 in step, 1 out of step, 2 when the listing could not be read -- which
 * is a question that went unanswered, not an answer, and is kept apart from
 * drift so nobody is told to push migrations because a token expired.
 *
 * In a workflow it also writes `verdict` (in-step | drift | unreadable) and
 * `summary` to the step's outputs.
 *
 *   node scripts/check-migration-drift.mjs --say-failure <stdout file> <stderr file>
 *
 * prints what a failed CLI left on both streams, with anything that could be a
 * credential taken out (migration-drift.mjs, `redactCliOutput`), and exits 0:
 * it reports a failure, it is not one.
 */

const root = process.cwd();
const args = process.argv.slice(2);

const failureIndex = args.indexOf("--say-failure");
if (failureIndex !== -1) {
  const read = (file) => {
    try {
      return file ? readFileSync(path.resolve(root, file), "utf8") : "";
    } catch {
      return "";
    }
  };
  console.log(describeCliFailure({ stdout: read(args[failureIndex + 1]), stderr: read(args[failureIndex + 2]) }));
  process.exit(0);
}
const fromIndex = args.indexOf("--from");
const from = fromIndex === -1 ? null : args[fromIndex + 1];

function finish(verdict, summary, code) {
  if (process.env.GITHUB_OUTPUT) {
    // A delimiter the summary cannot contain: it is made of digits, file
    // names and fixed sentences.
    appendFileSync(process.env.GITHUB_OUTPUT, `verdict=${verdict}\nsummary<<MIGRATION_DRIFT_EOF\n${summary}\nMIGRATION_DRIFT_EOF\n`);
  }
  (code === 0 ? console.log : console.error)(summary);
  process.exit(code);
}

if (!from) {
  console.error("Usage: node scripts/check-migration-drift.mjs --from <file holding the output of `supabase migration list`>");
  process.exit(2);
}

let listing;
try {
  listing = readFileSync(path.resolve(root, from), "utf8");
} catch (error) {
  finish("unreadable", `The migration listing could not be read from ${from}: ${String(error.message).split("\n")[0]}`, 2);
}

const directory = path.join(root, "supabase", "migrations");
const files = readdirSync(directory).filter((entry) => entry.endsWith(".sql"));
const local = localMigrationVersions(files);
if (local.length === 0) finish("unreadable", "supabase/migrations holds no migration files; there is nothing to compare.", 2);
if (local.length !== files.length) {
  const odd = files.filter((entry) => !/^\d{14}_/.test(entry));
  finish("unreadable", `supabase/migrations holds files that are not named <14 digits>_<name>.sql: ${odd.join(", ")}`, 2);
}

const listed = parseMigrationList(listing);
if (listed === null) {
  finish(
    "unreadable",
    "`supabase migration list` printed neither its JSON nor its table, so nothing was compared. " +
      `What it printed begins: ${JSON.stringify(listing.trim().slice(0, 300))}`,
    2,
  );
}

const result = compareMigrations(local, listed);
const names = new Map(files.map((entry) => [entry.slice(0, 14), `supabase/migrations/${entry}`]));
const drift = result.notApplied.length > 0 || result.notInRepository.length > 0;
finish(drift ? "drift" : "in-step", describeDrift(result, names), drift ? 1 : 0);
