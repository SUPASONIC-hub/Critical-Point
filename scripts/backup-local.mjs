/**
 * A local backup of the ranking and cloud-save tables (N13 of the 2026-11-12
 * next-improvements note). Run by the owner on their own PC, never in a
 * workflow: this repository is public, and so would be any artifact.
 *
 *   SUPABASE_URL=https://<ref>.supabase.co SUPABASE_SERVICE_ROLE_KEY=... node scripts/backup-local.mjs [outRoot]
 *
 * Read only: every request is a GET of PostgREST (`select=*`, paged with
 * Range), so nothing in the database changes. Each table goes to
 * `<outRoot>/<YYYY-MM-DD>/<table>.json` (outRoot defaults to
 * D:\DevData\critical-point-backup, or BACKUP_ROOT), with a manifest of the
 * row counts. The files hold player data (cloud saves): keep them off the
 * repository and off any shared folder.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

export const DEFAULT_ROOT = "D:\\DevData\\critical-point-backup";
/** Rankings (season-final rows through the public view), the hall of fame and the cloud saves. */
export const TABLES = ["public_rankings", "hall_of_fame_boards", "hall_of_fame", "cloud_saves"];
export const PAGE = 1000;

/** The day the backup is filed under, in KST. */
export const backupDay = (now = new Date()) => new Date(now.getTime() + 9 * 3600000).toISOString().slice(0, 10);

export function readConfig(env = process.env) {
  const url = String(env.SUPABASE_URL ?? env.VITE_SUPABASE_URL ?? "").replace(/\/+$/, "");
  const key = String(env.SUPABASE_SERVICE_ROLE_KEY ?? "");
  if (!/^https:\/\//.test(url)) throw new Error("SUPABASE_URL (https://<ref>.supabase.co) is not set");
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  return { url, key, root: env.BACKUP_ROOT || DEFAULT_ROOT };
}

/** Every row of one table, a page at a time, with GET only. */
export async function fetchTable(table, { url, key }, fetchImpl = fetch) {
  const rows = [];
  for (let from = 0; ; from += PAGE) {
    const response = await fetchImpl(`${url}/rest/v1/${table}?select=*`, {
      method: "GET",
      headers: { apikey: key, Authorization: `Bearer ${key}`, Range: `${from}-${from + PAGE - 1}`, "Range-Unit": "items", Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`${table}: HTTP ${response.status}`);
    const page = await response.json();
    if (!Array.isArray(page)) throw new Error(`${table}: not a list`);
    rows.push(...page);
    if (page.length < PAGE) return rows;
  }
}

export async function backup({ config, now = new Date(), fetchImpl = fetch, write = writeFileSync, mkdir = mkdirSync, log = console.log } = {}) {
  const dir = join(config.root, backupDay(now));
  mkdir(dir, { recursive: true });
  const counts = {};
  for (const table of TABLES) {
    const rows = await fetchTable(table, config, fetchImpl);
    write(join(dir, `${table}.json`), `${JSON.stringify(rows, null, 2)}\n`);
    counts[table] = rows.length;
    log(`${table}: ${rows.length}`);
  }
  write(join(dir, "manifest.json"), `${JSON.stringify({ takenAt: now.toISOString(), tables: counts }, null, 2)}\n`);
  return { dir, counts };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const config = readConfig();
  if (process.argv[2]) config.root = process.argv[2];
  backup({ config }).then(
    ({ dir }) => console.log(`saved to ${dir}`),
    (error) => {
      console.error(error.message);
      process.exitCode = 1;
    },
  );
}
