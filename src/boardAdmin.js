import { authStorageKey } from "./boardAdminEntry.js";
import { BOARD_NOTICE_LANGS, BOARD_NOTICE_MAX_LENGTH } from "./boardNotice.js";
import { supabaseTarget } from "./telemetry.js";

/**
 * The board's admin tools, for the game's two makers only (2026-11-16).
 *
 * Sign-in is Supabase Auth's Google provider, spoken to over its REST API
 * rather than through supabase-js: the page needs three requests of it
 * (authorize, refresh, logout), and the library would be the largest chunk on
 * a screen no player opens. The session is stored as supabase-js stores one --
 * the same object under the same key (`sb-<ref>-auth-token`) -- so the library
 * could take over later without signing anyone out.
 *
 * The real gate is the server's: every admin RPC refuses a caller
 * `is_board_admin()` does not name (20261118000000_board_admins.sql), whatever
 * this file decides. The address list here only spares a stranger who signed
 * in a request that would be refused anyway, and says so at once.
 *
 * Nothing here runs on a player's page: src/boardAdminEntry.js decides from
 * the address and storage whether this chunk is fetched at all.
 */

/** The two creator addresses the credits print; the server's `board_admins` holds the same two. */
export const BOARD_ADMIN_EMAILS = Object.freeze(["from.logic.to.magic@gmail.com", "goeun.nam@gmail.com"]);

export function isBoardAdminEmail(email) {
  return BOARD_ADMIN_EMAILS.includes(String(email ?? "").trim().toLowerCase());
}

const REQUEST_TIMEOUT_MS = 10000;
/** A token this close to its end is refreshed before it is sent. */
const REFRESH_MARGIN_SECONDS = 60;
export const ADMIN_PAGE_SIZE = 30;
/** The report queue's rows and the admin log's rows the bar asks for at once (20261118010000). */
export const ADMIN_QUEUE_SIZE = 50;
export const ADMIN_LOG_SIZE = 50;

/** Where Google sends the page back to: this page, with the sheet asked for. */
export function adminRedirectUrl(location) {
  return `${location.origin}${location.pathname}?admin`;
}

/** Supabase Auth's Google sign-in (implicit flow: the session comes back in the hash). */
export function googleSignInUrl(url, redirectTo) {
  const query = new URLSearchParams({ provider: "google", redirect_to: redirectTo });
  return `${url}/auth/v1/authorize?${query.toString()}`;
}

/** A JWT's claims, or null. Read for the address and the expiry only; the server checks the signature. */
export function decodeJwtPayload(token) {
  try {
    const part = String(token).split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(part + "===".slice((part.length + 3) % 4));
    return JSON.parse(new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0))));
  } catch {
    return null;
  }
}

/** A session in supabase-js's shape, from a redirect's hash or a refresh's answer. */
export function toSession(raw, now = Date.now()) {
  const claims = decodeJwtPayload(raw.access_token) ?? {};
  const expiresIn = Number(raw.expires_in) || 3600;
  return {
    access_token: raw.access_token,
    refresh_token: raw.refresh_token,
    token_type: raw.token_type || "bearer",
    expires_in: expiresIn,
    expires_at: Number(raw.expires_at) || Number(claims.exp) || Math.floor(now / 1000) + expiresIn,
    user: raw.user ?? { id: claims.sub ?? "", email: claims.email ?? "", app_metadata: claims.app_metadata ?? {} },
  };
}

/**
 * What Google's round trip left in the hash: `{ session }`, `{ error }`, or
 * null when the hash is not an auth answer.
 */
export function readAuthRedirect(hash, now = Date.now()) {
  const text = String(hash ?? "").replace(/^#/, "");
  if (!/(^|&)(access_token|error)=/.test(text)) return null;
  const params = new URLSearchParams(text);
  if (params.get("error")) return { error: params.get("error_description") || params.get("error") };
  const access = params.get("access_token");
  const refresh = params.get("refresh_token");
  if (!access || !refresh) return { error: "no session in the answer" };
  return {
    session: toSession(
      {
        access_token: access,
        refresh_token: refresh,
        token_type: params.get("token_type"),
        expires_in: params.get("expires_in"),
        expires_at: params.get("expires_at"),
      },
      now,
    ),
  };
}

/** The address without the auth answer in its hash (the tokens must not stay in history). */
export function stripAuthHash(href) {
  const url = new URL(href);
  if (/(^#|&)(access_token|error)=/.test(url.hash)) url.hash = "";
  return url.toString();
}

export function sessionEmail(session) {
  return String(session?.user?.email || decodeJwtPayload(session?.access_token)?.email || "").toLowerCase();
}

export function sessionExpiring(session, now = Date.now()) {
  return !(Number(session?.expires_at) > now / 1000 + REFRESH_MARGIN_SECONDS);
}

export function readSession(storage, key) {
  try {
    const value = JSON.parse(storage?.getItem(key) ?? "null");
    return value?.access_token && value?.refresh_token ? value : null;
  } catch {
    return null;
  }
}

export function writeSession(storage, key, session) {
  try {
    storage?.setItem(key, JSON.stringify(session));
  } catch {
    // Storage refused: the session lasts as long as this page does.
  }
}

export function clearSession(storage, key) {
  try {
    storage?.removeItem(key);
  } catch {
    // Nothing to clear.
  }
}

/** One admin row as the board's admin bar reads it. The writer key is never in it. */
export function toAdminPost(row) {
  return {
    id: Number(row.id),
    nickname: String(row.nickname ?? ""),
    body: String(row.body ?? ""),
    createdAt: row.created_at ?? null,
    hidden: row.hidden === true,
    autoHidden: Boolean(row.auto_hidden_at),
    kept: Boolean(row.kept_at),
    reports: Number(row.report_count) || 0,
    sameWriter: Number(row.same_writer_count) || 1,
  };
}

/**
 * One post of the report queue: an admin row, plus how many writers reported
 * it, the reasons they picked and when its first report came. No writer key.
 */
export function toQueuePost(row) {
  return {
    ...toAdminPost(row),
    writers: Number(row.writer_count) || 0,
    reasons: Array.isArray(row.reasons) ? row.reasons.map(String) : [],
    firstReportAt: row.first_report_at ?? null,
  };
}

/** One row of board_admin_log as the bar's 관리 기록 reads it. */
export function toLogRow(row) {
  return {
    id: Number(row.id),
    at: row.at ?? null,
    email: String(row.admin_email ?? ""),
    action: String(row.action ?? ""),
    postId: Number(row.post_id),
  };
}

/**
 * The makers' notice as the admin bar's form reads it back
 * (`admin_board_notice_get`, 20261202010000): ended or not, with who posted
 * it. Null when there is none.
 */
export function toAdminNotice(row, now = Date.now()) {
  if (!row || typeof row !== "object") return null;
  const expiresAt = row.expires_at ?? null;
  return {
    ko: String(row.body_ko ?? ""),
    en: String(row.body_en ?? ""),
    ja: String(row.body_ja ?? ""),
    postedAt: row.posted_at ?? null,
    expiresAt,
    ended: Boolean(expiresAt) && Date.parse(expiresAt) <= now,
    postedBy: String(row.posted_by ?? ""),
  };
}

/** An ISO time as a `datetime-local` field holds it, in this device's time zone; "" for none. */
export function toLocalInput(iso) {
  const at = new Date(iso ?? Number.NaN);
  if (!iso || Number.isNaN(at.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${at.getFullYear()}-${pad(at.getMonth() + 1)}-${pad(at.getDate())}T${pad(at.getHours())}:${pad(at.getMinutes())}`;
}

/**
 * The form's draft as `admin_board_notice_set`'s arguments, or the problem the
 * server would refuse it for, said first here: `{ error: "ko" | "long" |
 * "ended" }`. Blank English or Japanese is sent as none (the page shows the
 * Korean); the end is a `datetime-local` value in this device's time zone.
 */
export function noticeArgs({ ko = "", en = "", ja = "", expiresAt = "" } = {}, now = Date.now()) {
  const texts = { ko: String(ko).trim(), en: String(en).trim(), ja: String(ja).trim() };
  if (!texts.ko) return { error: "ko" };
  if (BOARD_NOTICE_LANGS.some((lang) => texts[lang].length > BOARD_NOTICE_MAX_LENGTH)) return { error: "long" };
  let ends = null;
  if (expiresAt) {
    const at = new Date(expiresAt).getTime();
    if (!(at > now)) return { error: "ended" };
    ends = new Date(at).toISOString();
  }
  return { args: { p_body_ko: texts.ko, p_body_en: texts.en || null, p_body_ja: texts.ja || null, p_expires_at: ends } };
}

async function request(fetchImpl, url, options) {
  const controller = typeof AbortController === "function" ? new AbortController() : null;
  const timer = setTimeout(() => controller?.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetchImpl(url, { ...options, ...(controller ? { signal: controller.signal } : {}) });
    const text = await response.text();
    let body = null;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      // Not JSON: the status decides.
    }
    if (!response.ok) {
      const message = body?.message || body?.msg || body?.error_description || `${response.status}`;
      throw Object.assign(new Error(message), { status: response.status, code: body?.code ?? "" });
    }
    return body;
  } finally {
    clearTimeout(timer);
  }
}

async function refreshSession({ target, fetch: fetchImpl }, session, now = Date.now()) {
  const body = await request(fetchImpl, `${target.url}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: { apikey: target.key, "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  });
  return toSession(body, now);
}

function callAdminRpc({ target, fetch: fetchImpl }, session, name, args = {}) {
  return request(fetchImpl, `${target.url}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: { apikey: target.key, Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
}

function signOutRemote({ target, fetch: fetchImpl }, session) {
  return request(fetchImpl, `${target.url}/auth/v1/logout?scope=local`, {
    method: "POST",
    headers: { apikey: target.key, Authorization: `Bearer ${session.access_token}` },
  }).catch(() => null);
}

/**
 * The admin state one page shares between the sign-in sheet and the board's
 * admin bar. `status`: idle (not asked yet), checking, signed-out, refused
 * (signed in, not one of the two), admin, error.
 */
export function createBoardAdmin({
  target = supabaseTarget(),
  fetch: fetchImpl = globalThis.fetch?.bind(globalThis),
  storage = globalThis.localStorage,
  location = globalThis.location,
  history = globalThis.history,
  now = () => Date.now(),
} = {}) {
  const deps = { target, fetch: fetchImpl };
  const key = target ? authStorageKey(target.url) : "";
  const listeners = new Set();
  let state = { status: "idle", email: "", message: "" };
  let started = null;

  const set = (next) => {
    state = { ...state, ...next };
    listeners.forEach((listener) => listener());
  };

  async function freshSession() {
    const session = readSession(storage, key);
    if (!session || !sessionExpiring(session, now())) return session;
    try {
      const next = await refreshSession(deps, session, now());
      writeSession(storage, key, next);
      return next;
    } catch (error) {
      // The server said no (revoked, expired for good): signed out. A network
      // failure is not an answer, and the session is kept for a retry.
      if (error.status >= 400 && error.status < 500) {
        clearSession(storage, key);
        return null;
      }
      throw error;
    }
  }

  async function check() {
    if (!target) return set({ status: "signed-out", email: "" });
    const redirect = readAuthRedirect(location?.hash, now());
    if (redirect) {
      history?.replaceState?.(history.state, "", stripAuthHash(location.href));
      if (redirect.error) return set({ status: "error", email: "", message: redirect.error });
      const email = sessionEmail(redirect.session);
      if (!isBoardAdminEmail(email)) {
        await signOutRemote(deps, redirect.session);
        return set({ status: "refused", email, message: "" });
      }
      writeSession(storage, key, redirect.session);
    }
    set({ status: "checking", message: "" });
    try {
      const session = await freshSession();
      if (!session) return set({ status: "signed-out", email: "" });
      const email = sessionEmail(session);
      if (!isBoardAdminEmail(email)) {
        clearSession(storage, key);
        return set({ status: "refused", email });
      }
      const admin = await callAdminRpc(deps, session, "admin_board_me");
      return set({ status: admin === true ? "admin" : "refused", email });
    } catch (error) {
      return set({ status: "error", message: error.message });
    }
  }

  async function rpc(name, args = {}) {
    let session = await freshSession();
    if (!session) {
      set({ status: "signed-out", email: "" });
      throw new Error("signed out");
    }
    try {
      return await callAdminRpc(deps, session, name, args);
    } catch (error) {
      if (error.status !== 401) throw error;
      // A token the server no longer takes, though its clock said it would: once more, refreshed.
      session = await refreshSession(deps, session, now());
      writeSession(storage, key, session);
      return callAdminRpc(deps, session, name, args);
    }
  }

  return {
    getState: () => state,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    /** Reads the redirect or the stored session and asks the server once; later calls share the answer. */
    start() {
      started ??= check();
      return started;
    },
    signIn() {
      location.assign(googleSignInUrl(target.url, adminRedirectUrl(location)));
    },
    async signOut() {
      const session = readSession(storage, key);
      clearSession(storage, key);
      started = null;
      set({ status: "signed-out", email: "", message: "" });
      if (session) await signOutRemote(deps, session);
    },
    async search({ query = "", includeHidden = true, beforeId = null } = {}) {
      const rows = await rpc("admin_board_search", {
        p_query: query.trim() || null,
        p_include_hidden: includeHidden,
        p_limit: ADMIN_PAGE_SIZE,
        p_before_id: beforeId,
      });
      return (rows ?? []).map(toAdminPost);
    },
    async sameWriter(postId) {
      return ((await rpc("admin_board_same_writer", { p_post_id: postId })) ?? []).map(toAdminPost);
    },
    async setHidden(postId, hidden) {
      return (await rpc("admin_board_set_hidden", { p_post_id: postId, p_hidden: hidden })) === true;
    },
    async remove(postId) {
      return (await rpc("admin_board_delete", { p_post_id: postId })) === true;
    },
    /** The posts waiting for a person: reported, or hidden by the reports themselves. */
    async queue() {
      return ((await rpc("admin_board_queue", { p_limit: ADMIN_QUEUE_SIZE })) ?? []).map(toQueuePost);
    },
    async queueCount() {
      return Number(await rpc("admin_board_queue_count")) || 0;
    },
    async log() {
      return ((await rpc("admin_board_log", { p_limit: ADMIN_LOG_SIZE })) ?? []).map(toLogRow);
    },
    /** The makers' notice, ended or not, or null (20261202010000_board_notice.sql). */
    async notice() {
      const rows = await rpc("admin_board_notice_get");
      return toAdminNotice(Array.isArray(rows) ? rows[0] : null, now());
    },
    /** Writes (or replaces) the notice from `noticeArgs(...).args`; the server's posting time back. */
    async setNotice(args) {
      return rpc("admin_board_notice_set", args);
    },
    /** Takes the notice down; false when there was none. */
    async clearNotice() {
      return (await rpc("admin_board_notice_clear")) === true;
    },
  };
}

let shared = null;

/** The page's one admin state. */
export function boardAdmin() {
  shared ??= createBoardAdmin();
  return shared;
}
