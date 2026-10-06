import { BOARD_WRITER_ID_KEY, readStoredValue, SESSION_ID_STORAGE_KEY, writeStoredValue } from "./appConfig.js";

/** @type {Partial<ImportMetaEnv>} */
const viteEnv = import.meta.env ?? {};
const localTelemetryConfigEnabled = viteEnv.DEV || viteEnv.VITE_ENABLE_DEBUG_TOOLS === "true";
const localTelemetryUrl = localTelemetryConfigEnabled ? readStoredValue("critical-point-telemetry-url", "") : "";
const localTelemetryKey = localTelemetryConfigEnabled ? readStoredValue("critical-point-telemetry-key", "") : "";
const SUPABASE_URL = viteEnv.VITE_SUPABASE_URL || localTelemetryUrl;
const SUPABASE_ANON_KEY = viteEnv.VITE_SUPABASE_ANON_KEY || localTelemetryKey;
const TELEMETRY_TIMEOUT_MS = 10000;
const telemetryStats = { attempted: 0, saved: 0, failed: 0 };
const telemetryStatsListeners = new Set();
let telemetryStatsSnapshot = Object.freeze({ ...telemetryStats });

function publishTelemetryStats() {
  telemetryStatsSnapshot = Object.freeze({ ...telemetryStats });
  telemetryStatsListeners.forEach((listener) => listener());
}

export const telemetryEnabled = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/**
 * One request under one deadline, body included. The answer comes back with
 * its body already read: the timer used to be cleared as soon as the headers
 * arrived, so a server that sent headers and then stalled left `json()` or
 * `text()` waiting with nothing to end the wait -- a ranking or a board that
 * never finished loading, an online save that never answered.
 */
async function fetchWithTimeout(url, options = {}) {
  if (globalThis.navigator?.onLine === false) {
    throw new Error("Network unavailable");
  }
  const controller = typeof AbortController === "function" ? new AbortController() : null;
  const timeoutId = setTimeout(() => controller?.abort(), TELEMETRY_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      ...options,
      ...(controller ? { signal: controller.signal } : {}),
    });
    const body = await response.text();
    return {
      ok: response.ok,
      status: response.status,
      text: async () => body,
      json: async () => JSON.parse(body),
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * A refusal, with the parts a caller decides on kept apart from the sentence:
 * `status` is the HTTP status, `code` is PostgREST's or Postgres's own
 * (`PGRST202`, `P0001`, `PT429`), and `serverMessage` is the text the trigger
 * raised. The message still carries all of it for the console.
 */
async function createTelemetryError(response, fallbackMessage) {
  let detail = "";
  try {
    detail = (await response.text()).slice(0, 500);
  } catch {
    // A body is optional; fall back to the status code alone.
  }
  let body = null;
  try {
    body = detail ? JSON.parse(detail) : null;
  } catch {
    // Not JSON (a gateway's page, a truncated body): the status decides.
  }
  const suffix = detail ? `: ${detail}` : "";
  return Object.assign(new Error(`${fallbackMessage}: ${response.status}${suffix}`), {
    status: response.status,
    code: typeof body?.code === "string" ? body.code : "",
    serverMessage: typeof body?.message === "string" ? body.message : "",
  });
}

/**
 * Whether the server has no such function, or none that takes those arguments.
 * The client ships before the migration it was written for, so a new RPC is
 * called with a fallback for the database that has not got it yet.
 */
export function isMissingRpc(error) {
  return (
    error?.code === "PGRST202" ||
    (Number(error?.status) === 404 && /could not find the function/i.test(String(error?.serverMessage ?? error?.message ?? "")))
  );
}

function createRandomId(prefix) {
  return globalThis.crypto?.randomUUID?.() ?? `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

// With storage unavailable every call used to mint a new id, so the shell, the
// runtime and each error row carried different ones and the per-session limits
// counted every request as a new device. One id per page load at the least.
let fallbackSessionId = null;

export function getSessionId() {
  const key = SESSION_ID_STORAGE_KEY;
  const existing = readStoredValue(key);
  if (existing) return existing;

  // The same id is offered to storage again each time, so it is kept once
  // storage comes back.
  const next = fallbackSessionId ?? createRandomId("session");
  fallbackSessionId = writeStoredValue(key, next) ? null : next;
  return next;
}

/**
 * The id a board post is written under. The board publishes a nickname, so it
 * does not share the id telemetry and the ranking use: with one id for both,
 * whoever reads the tables can put a name to a device's anonymous rows.
 */
let fallbackBoardWriterId = null;

export function getBoardWriterId() {
  const existing = readStoredValue(BOARD_WRITER_ID_KEY);
  if (existing) return existing;

  const next = fallbackBoardWriterId ?? createRandomId("board");
  fallbackBoardWriterId = writeStoredValue(BOARD_WRITER_ID_KEY, next) ? null : next;
  return next;
}

export function getSessionCode(sessionId) {
  return sessionId.replace(/[^a-z0-9]/gi, "").slice(-8).toUpperCase();
}

function restHeaders(extra = {}) {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    ...extra,
  };
}

/**
 * One POST, idempotent on `event_id`.
 *
 * Every table here has `unique (event_id)`, so a retry of a row that already
 * landed is refused with 23505, which PostgREST answers 409 -- and that is the
 * answer a retry was hoping for, so it counts as delivered. The write carries
 * no `on_conflict`/`resolution` preference on purpose: an ON CONFLICT target
 * needs SELECT on its column, and anon may not read `event_id` (see
 * 20260928030000_converge_data_api_grants.sql).
 *
 * Only that 409. PostgREST answers 409 for a foreign-key violation (23503)
 * too, and for other conflicts; every one of them used to be counted as
 * delivered, so a row the database had refused left the queue as if it had
 * landed. Those are thrown like any other refusal.
 */
const UNIQUE_VIOLATION = "23505";

async function postOnce(table, body, failureLabel) {
  const response = await fetchWithTimeout(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: restHeaders({ "Content-Type": "application/json", Prefer: "return=minimal" }),
    body: JSON.stringify(body),
  });
  if (response.ok) return { saved: true };
  const error = await createTelemetryError(response, failureLabel);
  if (response.status === 409 && error.code === UNIQUE_VIOLATION) return { saved: true, duplicate: true };
  throw error;
}

async function insertRow(table, payload, failureLabel, eventId = null) {
  if (!telemetryEnabled) return { skipped: true };
  telemetryStats.attempted += 1;
  publishTelemetryStats();

  try {
    const result = await postOnce(table, buildTelemetryPayload(payload, eventId), failureLabel);
    telemetryStats.saved += 1;
    publishTelemetryStats();
    return result;
  } catch (error) {
    telemetryStats.failed += 1;
    publishTelemetryStats();
    throw error;
  }
}

/**
 * The payload as posted. A caller that stamped its own `event_id` when it built
 * the payload keeps it; otherwise the queue item's id is the identity, so a row
 * queued by an older build still dedupes on retry.
 */
export function buildTelemetryPayload(payload, eventId = null) {
  const identity = payload?.event_id ?? eventId;
  return identity ? { ...payload, event_id: identity } : payload;
}

export function getTelemetryStats() {
  return telemetryStatsSnapshot;
}

export function subscribeTelemetryStats(listener) {
  telemetryStatsListeners.add(listener);
  return () => telemetryStatsListeners.delete(listener);
}

export function saveCaseTelemetry(payload, eventId = null) {
  return insertRow("playtest_sessions", payload, "Telemetry save failed", eventId);
}

export function saveFeedbackTelemetry(payload, eventId = null) {
  return insertRow("playtest_feedback", payload, "Feedback save failed", eventId);
}

export function saveErrorTelemetry(payload, eventId = null) {
  return insertRow("app_error_logs", payload, "Error log save failed", eventId);
}

async function checkTelemetryTable(tableName) {
  if (!telemetryEnabled) return { table: tableName, ok: false, skipped: true };

  const readTableName = tableName === "playtest_sessions" ? "public_rankings" : "telemetry_health";
  const query = new URLSearchParams(
    tableName === "playtest_sessions"
      ? { select: "*", limit: "1" }
      : { select: "table_name", table_name: `eq.${tableName}`, limit: "1" },
  );
  const response = await fetchWithTimeout(`${SUPABASE_URL}/rest/v1/${readTableName}?${query.toString()}`, {
    headers: restHeaders(),
  });

  return {
    table: tableName,
    endpoint: readTableName,
    ok: response.ok,
    status: response.status,
    message: response.ok ? "" : (await response.text()).slice(0, 240),
  };
}

export async function checkTelemetryHealth() {
  if (!telemetryEnabled) return { skipped: true, tables: [] };
  const tables = await Promise.all(
    ["playtest_sessions", "playtest_feedback", "app_error_logs"].map((tableName) =>
      checkTelemetryTable(tableName).catch((error) => ({
        table: tableName,
        ok: false,
        status: 0,
        message: error instanceof Error ? error.message : "Healthcheck failed",
      })),
    ),
  );
  return {
    ok: tables.every((table) => table.ok),
    tables,
  };
}

/** One call to a Postgres function exposed through PostgREST. */
export async function callSupabaseRpc(name, body = {}) {
  if (!telemetryEnabled) return { skipped: true, data: null };
  const response = await fetchWithTimeout(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: restHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(body),
  });
  if (!response.ok) throw await createTelemetryError(response, `${name} failed`);
  return { data: await response.json() };
}

/**
 * A post on the 참가자 게시판.
 *
 * Every other write here is telemetry the player never reads back, so it goes
 * through `insertRow` and its delivery counters. A board post is the opposite:
 * the writer wants to see it appear, and the server can refuse it for reasons
 * the writer can fix (too fast, a link, too short). So it skips the counters,
 * the error carries the server's raise message, and the caller prints it.
 */
export async function saveBoardPost(payload, eventId = null) {
  if (!telemetryEnabled) return { skipped: true };
  return postOnce("board_posts", buildTelemetryPayload(payload, eventId), "Board post failed");
}

export async function fetchBoardPosts(limit = 50) {
  if (!telemetryEnabled) return { skipped: true, rows: [] };

  const query = new URLSearchParams({
    select: "id,nickname,body,created_at",
    order: "created_at.desc",
    limit: String(limit),
  });
  const response = await fetchWithTimeout(`${SUPABASE_URL}/rest/v1/board_posts?${query.toString()}`, {
    headers: restHeaders(),
  });

  if (!response.ok) throw await createTelemetryError(response, "Board fetch failed");

  return { rows: await response.json() };
}

/**
 * The best completed seasons, best first. The server orders by its own `score`
 * column, so what reaches the client is the top of the table -- not the most
 * recent rows, which a flood of fresh ones could fill. `run_tag` is the short
 * run label; the full run id and the session code are not public.
 */
export async function fetchLeaderboard(limit = 100) {
  if (!telemetryEnabled) return { skipped: true, rows: [] };

  const query = new URLSearchParams({
    select: "run_tag,player_name,case_id,case_title,completed_at,summary,score",
    order: "score.desc.nullslast,completed_at.asc",
    limit: String(limit),
  });
  const response = await fetchWithTimeout(`${SUPABASE_URL}/rest/v1/public_rankings?${query.toString()}`, {
    headers: restHeaders(),
  });

  if (!response.ok) throw await createTelemetryError(response, "Leaderboard fetch failed");

  return { rows: await response.json() };
}
