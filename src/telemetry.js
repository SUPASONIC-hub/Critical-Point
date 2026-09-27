import { readStoredValue, writeStoredValue } from "./appConfig.js";

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

async function fetchWithTimeout(url, options = {}) {
  if (globalThis.navigator?.onLine === false) {
    throw new Error("Network unavailable");
  }
  const controller = typeof AbortController === "function" ? new AbortController() : null;
  const timeoutId = setTimeout(() => controller?.abort(), TELEMETRY_TIMEOUT_MS);
  try {
    return await fetch(url, {
      ...options,
      ...(controller ? { signal: controller.signal } : {}),
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function createTelemetryError(response, fallbackMessage) {
  let detail = "";
  try {
    detail = (await response.text()).slice(0, 500);
  } catch {
    // A body is optional; fall back to the status code alone.
  }
  const suffix = detail ? `: ${detail}` : "";
  const error = new Error(`${fallbackMessage}: ${response.status}${suffix}`);
  error.status = response.status;
  return error;
}

export function getSessionId() {
  const key = "critical-point-session-id";
  const existing = readStoredValue(key);
  if (existing) return existing;

  const next =
    globalThis.crypto?.randomUUID?.() ??
    `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  writeStoredValue(key, next);
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
 */
async function postOnce(table, body, failureLabel) {
  const response = await fetchWithTimeout(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: restHeaders({ "Content-Type": "application/json", Prefer: "return=minimal" }),
    body: JSON.stringify(body),
  });
  if (response.status === 409) return { saved: true, duplicate: true };
  if (!response.ok) throw await createTelemetryError(response, failureLabel);
  return { saved: true };
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

  if (!response.ok) throw new Error(`Board fetch failed: ${response.status}`);

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

  if (!response.ok) {
    throw new Error(`Leaderboard fetch failed: ${response.status}`);
  }

  return { rows: await response.json() };
}
