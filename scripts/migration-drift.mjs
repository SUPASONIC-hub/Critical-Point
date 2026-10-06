/**
 * Which migrations the repository has and the live database does not, and the
 * other way round, as pure functions: `check-migration-drift.mjs` applies them
 * to `supabase/migrations/` and to what `supabase migration list` printed, and
 * `tests/unit/migration-drift.test.mjs` pins the parsing. No network and no
 * filesystem here.
 *
 * The client deploys by itself when Verify goes green; a migration is applied
 * at the merge by Supabase's GitHub integration, or by a person running
 * `npx supabase db push` (README, 원격 랭킹). Nothing compared the two, so a
 * migration the integration failed on or was switched off for looked exactly
 * like one that was applied: the client ran against the old schema until
 * something it relied on was refused.
 */

/** `20260929010000_telemetry_caps_and_ranking.sql` -> `20260929010000`. Files that are not migrations are left out. */
export function localMigrationVersions(fileNames) {
  return [...fileNames]
    .map((name) => /^(\d{14})_[^/\\]+\.sql$/.exec(String(name))?.[1] ?? null)
    .filter(Boolean)
    .sort();
}

const VERSION = /^\d{14}$/;
const version = (value) => {
  const text = String(value ?? "").trim();
  return VERSION.test(text) ? text : null;
};

/**
 * What `supabase migration list` printed, as `[{ local, remote }]` with a
 * missing side as null. Returns null when the output is neither shape, which
 * is not the same as an empty history: the caller has to stop, not report
 * that every migration is missing.
 *
 * Two shapes are read. With `--output-format json` (CLI 2.118 and later) it is
 * one object, `{"migrations":[{"local":"...","remote":"...","time":"..."}]}`,
 * where a side that is absent is an empty string or a missing key; anything
 * the CLI logged before it is skipped. Without it, it is a table:
 *
 *      Local          | Remote         | Time (UTC)
 *     ----------------|----------------|---------------------
 *      20260902055713 | 20260902055713 | 2026-09-02 05:57:13
 *      20260929050000 |                | 2026-09-29 05:00:00
 */
export function parseMigrationList(output) {
  const text = String(output ?? "");
  for (let start = text.indexOf("{"); start !== -1; start = text.indexOf("{", start + 1)) {
    let parsed;
    try {
      parsed = JSON.parse(text.slice(start));
    } catch {
      // A log line with a brace in it, or text after the object: try the
      // object alone, up to its last closing brace.
      try {
        parsed = JSON.parse(text.slice(start, text.lastIndexOf("}") + 1));
      } catch {
        continue;
      }
    }
    if (Array.isArray(parsed?.migrations)) {
      return parsed.migrations
        .map((row) => ({ local: version(row?.local), remote: version(row?.remote) }))
        .filter((row) => row.local || row.remote);
    }
  }
  const lines = text.split(/\r?\n/);
  if (!lines.some((line) => /\bLocal\b.*[|│].*\bRemote\b/i.test(line))) return null;
  const rows = [];
  for (const line of lines) {
    const cells = line.split(/[|│]/).map((cell) => cell.trim());
    if (cells.length < 2) continue;
    const row = { local: version(cells[0]), remote: version(cells[1]) };
    if (row.local || row.remote) rows.push(row);
  }
  return rows;
}

/**
 * The two ways to be out of step. `notApplied` is in the repository and not in
 * the database's history: merged, never pushed. `notInRepository` is in the
 * database's history and not in the repository: applied from another checkout
 * or from the dashboard's SQL editor, which the README forbids because the
 * next `db push` then refuses to run.
 *
 * The remote side is read from the listing alone; the local side from the
 * directory, not from the listing's own `local` column, so a CLI that looked
 * in the wrong folder cannot make the two agree.
 */
export function compareMigrations(localVersions, listed) {
  const local = new Set(localVersions);
  const remote = new Set(listed.map((row) => row.remote).filter(Boolean));
  return {
    notApplied: [...local].filter((entry) => !remote.has(entry)).sort(),
    notInRepository: [...remote].filter((entry) => !local.has(entry)).sort(),
    applied: [...local].filter((entry) => remote.has(entry)).length,
  };
}

/** One paragraph a person can act on, for the log and for the issue. */
export function describeDrift({ notApplied, notInRepository, applied }, names = new Map()) {
  if (notApplied.length === 0 && notInRepository.length === 0) {
    return `In step: all ${applied} migrations in supabase/migrations are in the database's history, and it has no other.`;
  }
  const lines = [];
  if (notApplied.length) {
    lines.push(`In the repository and not applied to the database (${notApplied.length}); run \`npx supabase db push\`:`);
    for (const entry of notApplied) lines.push(`- ${names.get(entry) ?? entry}`);
  }
  if (notInRepository.length) {
    if (lines.length) lines.push("");
    lines.push(
      `Applied to the database and not in the repository (${notInRepository.length}); ` +
        "something was run from another checkout or the SQL editor, and the next `db push` will stop on it:",
    );
    for (const entry of notInRepository) lines.push(`- ${entry}`);
  }
  return lines.join("\n");
}

/**
 * What the CLI printed when it failed, made safe to leave in a public run's
 * log. Until 2026-10-06 the workflow printed the CLI's stderr only, and the
 * CLI writes its progress there and the error itself, as JSON, to stdout: a
 * token without the permission to create the login role left one line,
 * "Initialising login role...", and no reason.
 *
 * An error from a database client is the kind of text that carries a
 * connection string, so these go before anything is printed: the userinfo of
 * any URL, a `password=` in a key-value string, a Supabase token, and a JWT.
 * GitHub masks the secrets it knows; this is for the ones it was never given,
 * such as the password of the login role the CLI makes for itself.
 */
export function redactCliOutput(text) {
  return String(text ?? "")
    .replace(/\b([a-z][a-z0-9+.-]*:\/\/)[^\s/@"']+@/gi, "$1***@")
    .replace(/\b(password|pwd|passwd|secret|token|apikey|api_key)(["']?\s*[=:]\s*["']?)[^\s"'&,;}]+/gi, "$1$2***")
    .replace(/\bsb[a-z]_[A-Za-z0-9_-]{8,}/g, "***")
    .replace(/\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/g, "***");
}

/** The last lines of each stream, redacted, under a line saying which it was. Empty streams are left out. */
export function describeCliFailure({ stdout = "", stderr = "" }, lines = 20) {
  const tail = (text) => redactCliOutput(text).trimEnd().split("\n").slice(-lines).join("\n");
  const parts = [];
  if (stderr.trim()) parts.push(`stderr:\n${tail(stderr)}`);
  if (stdout.trim()) parts.push(`stdout:\n${tail(stdout)}`);
  return parts.length ? parts.join("\n\n") : "The CLI printed nothing on either stream.";
}
