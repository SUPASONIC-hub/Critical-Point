import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";

import {
  ADMIN_PAGE_SIZE,
  BOARD_ADMIN_EMAILS,
  adminRedirectUrl,
  boardAdmin,
  clearSession,
  createBoardAdmin,
  decodeJwtPayload,
  googleSignInUrl,
  isBoardAdminEmail,
  readAuthRedirect,
  readSession,
  sessionEmail,
  sessionExpiring,
  stripAuthHash,
  toAdminPost,
  toSession,
  writeSession,
} from "../../src/boardAdmin.js";
import { adminSheetAsked, adminSheetWanted, adminWanted, authStorageKey } from "../../src/boardAdminEntry.js";
import { supabaseTarget } from "../../src/telemetry.js";

/**
 * The board's admin sign-in (src/boardAdmin.js, src/boardAdminEntry.js): what
 * opens it, what a Google round trip leaves, how a session is kept, and which
 * requests the admin bar sends. The server's gate is held by check:grants.
 */
const TARGET = { url: "https://e2e.supabase.co", key: "anon-key" };
// The specs' stub project (tests/helpers/network.js), whose key check:test-storage declares.
const KEY = "sb-e2e-auth-token";
const NOW = Date.UTC(2026, 10, 16, 9, 0, 0);

const b64url = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
const jwt = (claims) => `${b64url({ alg: "HS256" })}.${b64url(claims)}.signature`;
const token = (email, exp = NOW / 1000 + 3600) => jwt({ sub: "user-1", email, exp, app_metadata: { provider: "google", providers: ["google"] } });

function memoryStorage(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
    map,
  };
}

function fakeLocation(href) {
  const url = new URL(href);
  return {
    href: url.href,
    origin: url.origin,
    pathname: url.pathname,
    search: url.search,
    hash: url.hash,
    assigned: null,
    assign(next) {
      this.assigned = next;
    },
  };
}

/** A fetch that answers from a table of `METHOD path` -> [status, body], and records each call. */
function fakeFetch(answers) {
  const calls = [];
  const fetchImpl = async (url, options = {}) => {
    const parsed = new URL(url);
    const name = `${options.method ?? "GET"} ${parsed.pathname}`;
    calls.push({ name, url, headers: options.headers ?? {}, body: options.body ? JSON.parse(options.body) : null });
    const answer = typeof answers[name] === "function" ? answers[name](calls.at(-1)) : answers[name];
    if (!answer) throw new TypeError(`no answer for ${name}`);
    const [status, body] = answer;
    return { ok: status >= 200 && status < 300, status, text: async () => (body === undefined ? "" : JSON.stringify(body)) };
  };
  return { fetchImpl, calls };
}

function makeAdmin({ href = "https://game.example/?admin", stored = null, answers = {}, now = NOW } = {}) {
  const storage = memoryStorage(stored ? { [KEY]: JSON.stringify(stored) } : {});
  const location = fakeLocation(href);
  const replaced = [];
  const history = { state: null, replaceState: (_state, _title, next) => replaced.push(next) };
  const { fetchImpl, calls } = fakeFetch(answers);
  const admin = createBoardAdmin({ target: TARGET, fetch: fetchImpl, storage, location, history, now: () => now });
  return { admin, storage, location, replaced, calls };
}

const storedSession = (email = "goeun.nam@gmail.com", exp = NOW / 1000 + 3600) =>
  toSession({ access_token: token(email, exp), refresh_token: "refresh-1", expires_in: 3600, expires_at: exp });

test("the two addresses are the credits' creators, matched in any case", () => {
  assert.deepEqual([...BOARD_ADMIN_EMAILS], ["from.logic.to.magic@gmail.com", "goeun.nam@gmail.com"]);
  assert.equal(isBoardAdminEmail(" From.Logic.To.Magic@Gmail.com "), true);
  assert.equal(isBoardAdminEmail("goeun.nam@gmail.com"), true);
  assert.equal(isBoardAdminEmail("someone@example.com"), false);
  assert.equal(isBoardAdminEmail(null), false);
});

test("the server's list is the same two addresses", () => {
  const migrations = new globalThis.URL("../../supabase/migrations/", import.meta.url);
  const file = readdirSync(migrations).find((name) => name.endsWith("_board_admins.sql"));
  const sql = readFileSync(new globalThis.URL(file, migrations), "utf8");
  for (const email of BOARD_ADMIN_EMAILS) assert.match(sql, new RegExp(`'${email.replace(/\./g, "\\.")}'`));
});

test("only ?admin or #admin opens the sheet, and only on a page with a backend", () => {
  for (const [search, hash, asked] of [
    ["?admin", "", true],
    ["?admin=1", "", true],
    ["?lang=en&admin", "", true],
    ["", "#admin", true],
    ["?administrator", "", false],
    ["?lang=en", "", false],
    ["", "#admins", false],
    ["", "", false],
  ]) {
    assert.equal(adminSheetAsked({ search, hash }), asked, `${search}${hash}`);
  }
  assert.equal(adminSheetWanted({ location: { search: "?admin", hash: "" }, target: TARGET }), true);
  assert.equal(adminSheetWanted({ location: { search: "?admin", hash: "" }, target: null }), false);
  assert.equal(supabaseTarget(), null, "the unit tests run with no backend configured");
  assert.equal(adminSheetWanted({ location: { search: "?admin", hash: "" } }), false);
});

test("a player's page loads no admin code; a stored sign-in does", () => {
  const player = { search: "", hash: "" };
  assert.equal(adminWanted({ location: player, storage: memoryStorage(), target: TARGET }), false);
  assert.equal(adminWanted({ location: player, storage: memoryStorage({ [KEY]: "{}" }), target: TARGET }), true);
  assert.equal(adminWanted({ location: { search: "?admin", hash: "" }, storage: memoryStorage(), target: TARGET }), true);
  assert.equal(adminWanted({ location: { search: "?admin", hash: "" }, storage: memoryStorage(), target: null }), false);
  const throwing = { getItem: () => { throw new Error("blocked"); } };
  assert.equal(adminWanted({ location: player, storage: throwing, target: TARGET }), false);
  assert.equal(adminWanted({ location: player, storage: memoryStorage() }), false);
});

test("the session key is supabase-js's own", () => {
  assert.equal(authStorageKey(TARGET.url), KEY);
  assert.equal(authStorageKey("not a url"), "");
});

test("Google sign-in goes to Supabase's authorize endpoint and back to ?admin", () => {
  const location = fakeLocation("https://critical-point.example/play/?lang=en#top");
  assert.equal(adminRedirectUrl(location), "https://critical-point.example/play/?admin");
  const url = new URL(googleSignInUrl(TARGET.url, adminRedirectUrl(location)));
  assert.equal(url.origin + url.pathname, `${TARGET.url}/auth/v1/authorize`);
  assert.equal(url.searchParams.get("provider"), "google");
  assert.equal(url.searchParams.get("redirect_to"), "https://critical-point.example/play/?admin");
});

test("a JWT's claims are read, and a broken one is null", () => {
  assert.equal(decodeJwtPayload(jwt({ email: "가나@example.com" })).email, "가나@example.com");
  assert.equal(decodeJwtPayload("nope"), null);
  assert.equal(decodeJwtPayload(undefined), null);
});

test("the redirect's hash becomes a session, an error, or nothing", () => {
  assert.equal(readAuthRedirect("#admin"), null);
  assert.equal(readAuthRedirect(""), null);
  assert.deepEqual(readAuthRedirect("#error=access_denied&error_description=Signups+not+allowed"), { error: "Signups not allowed" });
  assert.deepEqual(readAuthRedirect("#error=server_error"), { error: "server_error" });
  assert.deepEqual(readAuthRedirect("#access_token=abc"), { error: "no session in the answer" });
  const access = token("goeun.nam@gmail.com");
  const { session } = readAuthRedirect(`#access_token=${access}&refresh_token=r1&expires_in=3600&token_type=bearer`, NOW);
  assert.equal(session.access_token, access);
  assert.equal(session.refresh_token, "r1");
  assert.equal(session.expires_at, NOW / 1000 + 3600);
  assert.equal(sessionEmail(session), "goeun.nam@gmail.com");
  assert.equal(session.user.app_metadata.provider, "google");
  // No exp in the token, no expires_at: counted from now.
  const bare = toSession({ access_token: jwt({ email: "a@b.c" }), refresh_token: "r" }, NOW);
  assert.equal(bare.expires_at, NOW / 1000 + 3600);
  assert.equal(bare.token_type, "bearer");
});

test("the tokens leave the address; ?admin and other hashes stay", () => {
  assert.equal(stripAuthHash("https://g.example/?admin#access_token=a&refresh_token=b"), "https://g.example/?admin");
  assert.equal(stripAuthHash("https://g.example/?admin#error=x"), "https://g.example/?admin");
  assert.equal(stripAuthHash("https://g.example/?admin#admin"), "https://g.example/?admin#admin");
});

test("a session is kept, read back, refreshed near its end and cleared", () => {
  const storage = memoryStorage();
  const session = storedSession();
  writeSession(storage, KEY, session);
  assert.deepEqual(readSession(storage, KEY), session);
  assert.equal(sessionExpiring(session, NOW), false);
  assert.equal(sessionExpiring(session, NOW + 3550 * 1000), true);
  assert.equal(sessionExpiring(null, NOW), true);
  clearSession(storage, KEY);
  assert.equal(readSession(storage, KEY), null);
  storage.setItem(KEY, "{broken");
  assert.equal(readSession(storage, KEY), null);
  storage.setItem(KEY, JSON.stringify({ access_token: "a" }));
  assert.equal(readSession(storage, KEY), null);
  const refusing = { getItem: () => null, setItem: () => { throw new Error("full"); }, removeItem: () => { throw new Error("blocked"); } };
  assert.doesNotThrow(() => writeSession(refusing, KEY, session));
  assert.doesNotThrow(() => clearSession(refusing, KEY));
  assert.equal(sessionEmail(null), "");
});

test("an admin row never carries the writer key", () => {
  const post = toAdminPost({ id: "7", nickname: "닉", body: "글", created_at: "2026-11-16T00:00:00Z", hidden: true, auto_hidden_at: "x", kept_at: null, report_count: 3, same_writer_count: 2, actor_key: "board:secret" });
  assert.deepEqual(post, { id: 7, nickname: "닉", body: "글", createdAt: "2026-11-16T00:00:00Z", hidden: true, autoHidden: true, kept: false, reports: 3, sameWriter: 2 });
  assert.deepEqual(toAdminPost({ id: 1 }), { id: 1, nickname: "", body: "", createdAt: null, hidden: false, autoHidden: false, kept: false, reports: 0, sameWriter: 1 });
});

test("Google's answer is stored, the hash cleaned, and the server asked once", async () => {
  const access = token("from.logic.to.magic@gmail.com");
  const { admin, storage, replaced, calls } = makeAdmin({
    href: `https://game.example/?admin#access_token=${access}&refresh_token=r1&expires_in=3600`,
    answers: { "POST /rest/v1/rpc/admin_board_me": [200, true] },
  });
  assert.equal(admin.getState().status, "idle");
  const seen = [];
  const stop = admin.subscribe(() => seen.push(admin.getState().status));
  await Promise.all([admin.start(), admin.start()]);
  stop();
  assert.deepEqual(admin.getState(), { status: "admin", email: "from.logic.to.magic@gmail.com", message: "" });
  assert.deepEqual(seen, ["checking", "admin"]);
  assert.deepEqual(replaced, ["https://game.example/?admin"]);
  assert.equal(readSession(storage, KEY).access_token, access);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].headers.Authorization, `Bearer ${access}`);
  assert.equal(calls[0].headers.apikey, "anon-key");
});

test("a stranger's Google answer is refused before the server, and signed out", async () => {
  const { admin, storage, calls } = makeAdmin({
    href: `https://game.example/?admin#access_token=${token("someone@example.com")}&refresh_token=r1`,
    answers: { "POST /auth/v1/logout": [204] },
  });
  await admin.start();
  assert.equal(admin.getState().status, "refused");
  assert.equal(admin.getState().email, "someone@example.com");
  assert.equal(readSession(storage, KEY), null);
  assert.deepEqual(calls.map((call) => call.name), ["POST /auth/v1/logout"]);
});

test("an error in the redirect is shown", async () => {
  const { admin } = makeAdmin({ href: "https://game.example/?admin#error=access_denied&error_description=Signups+not+allowed+for+this+instance" });
  await admin.start();
  assert.equal(admin.getState().status, "error");
  assert.equal(admin.getState().message, "Signups not allowed for this instance");
});

test("no session is signed out; a stored one the server does not name is refused", async () => {
  const empty = makeAdmin();
  await empty.admin.start();
  assert.equal(empty.admin.getState().status, "signed-out");

  const notListed = makeAdmin({ stored: storedSession("someone@example.com") });
  await notListed.admin.start();
  assert.equal(notListed.admin.getState().status, "refused");
  assert.equal(readSession(notListed.storage, KEY), null);

  const serverSaysNo = makeAdmin({ stored: storedSession(), answers: { "POST /rest/v1/rpc/admin_board_me": [200, false] } });
  await serverSaysNo.admin.start();
  assert.equal(serverSaysNo.admin.getState().status, "refused");

  const offline = makeAdmin({ stored: storedSession(), answers: {} });
  await offline.admin.start();
  assert.equal(offline.admin.getState().status, "error");

  const noBackend = createBoardAdmin({ target: null, storage: memoryStorage(), location: fakeLocation("https://g.example/?admin") });
  await noBackend.start();
  assert.equal(noBackend.getState().status, "signed-out");
});

test("a session near its end is refreshed first; one the server refuses is dropped", async () => {
  const fresh = token("goeun.nam@gmail.com", NOW / 1000 + 7200);
  const refreshed = makeAdmin({
    stored: storedSession("goeun.nam@gmail.com", NOW / 1000 + 30),
    answers: {
      "POST /auth/v1/token": (call) => {
        assert.equal(call.body.refresh_token, "refresh-1");
        assert.match(call.url, /grant_type=refresh_token/);
        return [200, { access_token: fresh, refresh_token: "refresh-2", expires_in: 7200, user: { email: "goeun.nam@gmail.com" } }];
      },
      "POST /rest/v1/rpc/admin_board_me": [200, true],
    },
  });
  await refreshed.admin.start();
  assert.equal(refreshed.admin.getState().status, "admin");
  assert.equal(readSession(refreshed.storage, KEY).refresh_token, "refresh-2");
  assert.equal(refreshed.calls.at(-1).headers.Authorization, `Bearer ${fresh}`);

  const revoked = makeAdmin({
    stored: storedSession("goeun.nam@gmail.com", NOW / 1000 + 30),
    answers: { "POST /auth/v1/token": [400, { error_description: "Invalid Refresh Token" }] },
  });
  await revoked.admin.start();
  assert.equal(revoked.admin.getState().status, "signed-out");
  assert.equal(readSession(revoked.storage, KEY), null);
});

test("the admin bar's calls name the RPCs and their arguments", async () => {
  const row = { id: 9, nickname: "n", body: "b", created_at: null, hidden: false, auto_hidden_at: null, kept_at: null, report_count: 1, same_writer_count: 2 };
  const { admin, calls } = makeAdmin({
    stored: storedSession(),
    answers: {
      "POST /rest/v1/rpc/admin_board_search": [200, [row]],
      "POST /rest/v1/rpc/admin_board_same_writer": [200, [row, { ...row, id: 8 }]],
      "POST /rest/v1/rpc/admin_board_set_hidden": [200, true],
      "POST /rest/v1/rpc/admin_board_delete": [200, false],
    },
  });
  assert.deepEqual(await admin.search({ query: "  닉  ", includeHidden: false, beforeId: 20 }), [toAdminPost(row)]);
  assert.deepEqual(calls.at(-1).body, { p_query: "닉", p_include_hidden: false, p_limit: ADMIN_PAGE_SIZE, p_before_id: 20 });
  await admin.search();
  assert.deepEqual(calls.at(-1).body, { p_query: null, p_include_hidden: true, p_limit: ADMIN_PAGE_SIZE, p_before_id: null });
  assert.equal((await admin.sameWriter(9)).length, 2);
  assert.deepEqual(calls.at(-1).body, { p_post_id: 9 });
  assert.equal(await admin.setHidden(9, true), true);
  assert.deepEqual(calls.at(-1).body, { p_post_id: 9, p_hidden: true });
  assert.equal(await admin.remove(9), false);
  assert.deepEqual(calls.at(-1).body, { p_post_id: 9 });
});

test("a refused token is refreshed once; a server error is passed on", async () => {
  let first = true;
  const { admin, calls } = makeAdmin({
    stored: storedSession(),
    answers: {
      "POST /rest/v1/rpc/admin_board_delete": () => {
        if (first) {
          first = false;
          return [401, { message: "JWT expired" }];
        }
        return [200, true];
      },
      "POST /auth/v1/token": [200, { access_token: token("goeun.nam@gmail.com"), refresh_token: "refresh-2", expires_in: 3600 }],
      "POST /rest/v1/rpc/admin_board_set_hidden": [403, { code: "42501", message: "board admin only" }],
    },
  });
  assert.equal(await admin.remove(3), true);
  assert.deepEqual(calls.map((call) => call.name), ["POST /rest/v1/rpc/admin_board_delete", "POST /auth/v1/token", "POST /rest/v1/rpc/admin_board_delete"]);
  await assert.rejects(admin.setHidden(3, true), (error) => error.message === "board admin only" && error.status === 403 && error.code === "42501");
});

test("a call with no session signs the bar out", async () => {
  const { admin } = makeAdmin({ answers: {} });
  await assert.rejects(admin.search(), /signed out/);
  assert.equal(admin.getState().status, "signed-out");
});

test("sign-in leaves for Google; sign-out forgets the session and tells the server", async () => {
  const { admin, storage, location, calls } = makeAdmin({ stored: storedSession(), answers: { "POST /auth/v1/logout": [500, "oops"] } });
  admin.signIn();
  assert.match(location.assigned, /\/auth\/v1\/authorize\?provider=google&redirect_to=https%3A%2F%2Fgame\.example%2F%3Fadmin$/);
  await admin.signOut();
  assert.equal(readSession(storage, KEY), null);
  assert.equal(admin.getState().status, "signed-out");
  assert.equal(calls.at(-1).name, "POST /auth/v1/logout");
  assert.match(calls.at(-1).url, /scope=local/);
  await admin.signOut();
  assert.equal(calls.length, 1, "no session, no request");
});

test("the page shares one admin state", () => {
  assert.equal(boardAdmin(), boardAdmin());
});
