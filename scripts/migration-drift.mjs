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
 * What the database's history holds in a row, for the comparison: a version,
 * or whatever else is written there, or null for nothing. A remote version
 * that is not fourteen digits used to be read as nothing, and a migration
 * applied under such a name -- which no file here can ever match -- was
 * reported as in step. It is kept as it is written and comes out of the
 * comparison as applied and not in the repository, which is what it is. On
 * the local side the same thing was already a failure
 * (check-migration-drift.mjs).
 */
const remoteVersion = (value, isVersionLike = () => true) => {
  const text = String(value ?? "").trim();
  if (!text) return null;
  return VERSION.test(text) || isVersionLike(text) ? text : null;
};

const tableCells = (line) => line.split(/[|│]/).map((cell) => cell.trim());

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
 *
 * The columns are found by their headings, not by counting from the left: a
 * table drawn with a border (`│ Local │ Remote │`) has an empty cell in front
 * of every row, and read by position its Local column was taken for Remote --
 * a migration that had not been applied was reported as applied.
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
        .map((row) => ({ local: version(row?.local), remote: remoteVersion(row?.remote) }))
        .filter((row) => row.local || row.remote);
    }
  }
  const lines = text.split(/\r?\n/);
  const headingCells = (line) => tableCells(line).map((cell) => cell.toLowerCase());
  const heading = lines.find((line) => headingCells(line).includes("local") && headingCells(line).includes("remote"));
  if (!heading) return null;
  const headings = headingCells(heading);
  const localAt = headings.indexOf("local");
  const remoteAt = headings.indexOf("remote");
  // In a table a cell is also a heading or a rule of dashes, so only digits
  // stand for a version there.
  const digits = (cell) => /^\d+$/.test(cell);
  const rows = [];
  for (const line of lines) {
    const cells = tableCells(line);
    if (cells.length < 2) continue;
    if (cells.length !== headings.length) {
      // A row that is not laid out like the heading cannot be put in its
      // columns. If it holds a version, the table is not one this reads.
      if (cells.some((cell) => /^\d{8,}$/.test(cell))) return null;
      continue;
    }
    const row = { local: version(cells[localAt]), remote: remoteVersion(cells[remoteAt], digits) };
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
    for (const entry of notInRepository) {
      // Written by whoever applied it, and about to be printed in an issue:
      // cut short, with nothing in it that could end the line or the code span.
      if (VERSION.test(entry)) lines.push(`- ${entry}`);
      else lines.push(`- \`${entry.replace(/[`\r\n]/g, " ").slice(0, 60)}\` (not a fourteen-digit version, so no file here can match it)`);
    }
  }
  return lines.join("\n");
}

// What `redactCliOutput` looks for. A host is what an `@` has to be followed
// by to be the end of a userinfo and not a character in a password.
const HOST_AHEAD = "(?=[A-Za-z0-9.-]+(?::\\d+)?(?:[/?#\\s\"'`,;)\\]}]|$))";
const URL_USERINFO = new RegExp(`\\b([a-z][a-z0-9+.-]*://)\\S*@${HOST_AHEAD}`, "gim");
const BARE_USERINFO = new RegExp(`(^|[\\s"'\`=(\\[{,])[A-Za-z0-9._-]+:(?!//)\\S+@${HOST_AHEAD}`, "gm");
const SECRET_NAME = "[A-Za-z0-9_.-]*(?:password|passwd|pwd|secret|token|apikey|api[_-]key)[A-Za-z0-9_-]*";
const NAMED_VALUE = new RegExp(`(["']?)(${SECRET_NAME})(["']?)(\\s*[=:]\\s*)(?:(["'])(?:\\\\.|(?!\\5)[^\\n])*\\5|[^\\s&]+)`, "gi");

/** Whether `name: value` is a sentence giving a reason (`token: Unauthorized`) and not a setting holding a secret. */
function isReason({ quoted, name, separator, value, before }) {
  if (quoted || !separator.includes(":") || !/^[A-Za-z]+$/.test(name)) return false;
  // At the start of a line it is a setting (`password: hunter`), not a sentence.
  if (/(?:^|\n)[ \t-]*$/.test(before)) return false;
  return /^[A-Z]?[a-z]+[.,;:!?)"'}\]]*$/.test(value);
}

/**
 * What the CLI printed when it failed, made safe to leave in a public run's
 * log. Until 2026-10-06 the workflow printed the CLI's stderr only, and the
 * CLI writes its progress there and the error itself, as JSON, to stdout: a
 * token without the permission to create the login role left one line,
 * "Initialising login role...", and no reason.
 *
 * An error from a database client is the kind of text that carries a
 * connection string, so these go before anything is printed. GitHub masks the
 * secrets it knows; this is for the ones it was never given, such as the
 * password of the login role the CLI makes for itself.
 *
 *   - the userinfo of a URL, up to the last `@` that has a host after it, so
 *     a password with `@`, `/` or a quote in it goes whole;
 *   - `user:password@host` with no scheme in front;
 *   - the value after any name with password, secret, token or apikey in it
 *     (`PGPASSWORD=`, `SUPABASE_DB_PASSWORD=`, `db_password:`, `"token":`),
 *     to the closing quote when it is quoted, spaces and all;
 *   - what follows `Authorization: Bearer`, or `Bearer` anywhere;
 *   - a Supabase key (`sbp_`, `sb_secret_`, `sb_publishable_`) and a JWT.
 *
 * It errs towards taking too much, with one exception. `Invalid access
 * token: Unauthorized` is a sentence, and the first version of this erased
 * the one word that said why the run failed. A plain word after a colon, in
 * the middle of a line, after a name that is itself a plain word, is kept
 * (`isReason`).
 */
export function redactCliOutput(text) {
  return String(text ?? "")
    .replace(URL_USERINFO, "$1***@")
    .replace(BARE_USERINFO, "$1***@")
    .replace(NAMED_VALUE, (match, nameOpen, name, nameClose, separator, valueQuote, offset, whole) => {
      const head = `${nameOpen}${name}${nameClose}${separator}`;
      if (valueQuote) return `${head}${valueQuote}***${valueQuote}`;
      const reason = isReason({ quoted: Boolean(nameOpen || nameClose), name, separator, value: match.slice(head.length), before: whole.slice(Math.max(0, offset - 80), offset) });
      return reason ? match : `${head}***`;
    })
    .replace(/\b(authorization\s*[:=]\s*(?:bearer|basic)\s+)\S+/gi, "$1***")
    .replace(/\b(bearer|basic)\s+(?=\S*[0-9._~+/=-])[A-Za-z0-9._~+/=-]{8,}/gi, "$1 ***")
    .replace(/\bsb[a-z]?_[A-Za-z0-9_-]{8,}/g, "***")
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
