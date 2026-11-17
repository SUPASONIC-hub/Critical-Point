import assert from "node:assert/strict";
import { createECDH } from "node:crypto";
import { test } from "node:test";

import { WEEKLY_REMINDER_KEY, WEEKLY_REMINDER_SYNC_KEY } from "../../src/appConfig.js";
import { getWeekRule } from "../../src/gauntlet/weeklyRules.js";
import { installWorker, pushNotice, REMINDER_TAG } from "../../src/serviceWorker/worker.js";
import { reminderAvailability, reminderOn, VAPID_PUBLIC_KEY } from "../../src/state/weeklyReminder.js";
import { keyBytes, refreshReminderOnOpen, subscriptionRow, turnReminderOff, turnReminderOn } from "../../src/state/weeklyReminderPush.js";
import {
  afterSql,
  describeRun,
  notificationFor,
  PUSH_TTL_SECONDS,
  readSubscriptions,
  ruleOfWeek,
  sendAll,
  subscriptionsQuery,
  vapidSender,
} from "../../scripts/send-weekly-push.mjs";

/**
 * 주 1회 알림 (N25, Web Push): the switch (state/weeklyReminder.js), the
 * subscription it hands the server (state/weeklyReminderPush.js), the
 * worker's `push` and `notificationclick` (serviceWorker/worker.js) and the
 * weekly sender (scripts/send-weekly-push.mjs). Off until turned on; what
 * leaves the device is the subscription and the language.
 */

const memory = new Map();
globalThis.localStorage = {
  getItem: (key) => (memory.has(key) ? memory.get(key) : null),
  setItem: (key, value) => void memory.set(key, String(value)),
  removeItem: (key) => void memory.delete(key),
};

// Inside 2026-W49 (CRISIS WEEK, 11-30 ~ 12-06), a Tuesday morning in Korea, and the week after (W50, SHORT CLOCK).
const W49 = Date.parse("2026-12-01T08:00:00+09:00");
const W50 = Date.parse("2026-12-08T08:00:00+09:00");
// An ordinary week: W51 has no rule.
const W51 = Date.parse("2026-12-15T08:00:00+09:00");

const ecdh = createECDH("prime256v1");
ecdh.generateKeys();
const KEY = ecdh.getPublicKey().toString("base64url");
const ENDPOINT = "https://fcm.googleapis.com/fcm/send/device-1";
const KEYS = { p256dh: `B${"A".repeat(86)}`, auth: "QUJDREVGR0hJSktMTU5PUA" };

/** A browser subscription as the push manager hands it. */
function fakeSubscription(endpoint = ENDPOINT, { failUnsubscribe = false } = {}) {
  const subscription = {
    endpoint,
    dropped: 0,
    toJSON: () => ({ endpoint, keys: KEYS }),
    unsubscribe: async () => {
      if (failUnsubscribe) throw new Error("gone");
      subscription.dropped += 1;
      return true;
    },
  };
  return subscription;
}

/** A page that can be asked everything the switch asks. */
function pageScope({ standalone = true, permission = "default", answer = "granted", push = true, worker = true, ready = true, existing = null, subscribeFails = false } = {}) {
  const subscribed = [];
  const state = { subscription: existing };
  const registration = worker
    ? {
        pushManager: {
          getSubscription: async () => state.subscription,
          subscribe: async (options) => {
            if (subscribeFails) throw new Error("NotAllowedError");
            subscribed.push(options);
            state.subscription = fakeSubscription();
            return state.subscription;
          },
        },
      }
    : null;
  function Notification() {}
  Notification.permission = permission;
  Notification.requestPermission = async () => {
    if (answer instanceof Error) throw answer;
    Notification.permission = answer;
    return answer;
  };
  return {
    state,
    subscribed,
    registration,
    Notification,
    ...(push ? { PushManager: function PushManager() {} } : {}),
    matchMedia: () => ({ matches: standalone }),
    navigator: { serviceWorker: { ready: ready ? Promise.resolve(registration) : new Promise(() => {}) } },
    setTimeout: (work) => setTimeout(work, 5),
    clearTimeout,
  };
}

/** A server call that records what it was asked, and answers or fails. */
function fakeRpc({ fail = false, skipped = false } = {}) {
  const calls = [];
  const rpc = async (name, body) => {
    calls.push([name, body]);
    if (fail) throw new Error("offline");
    return skipped ? { skipped: true, data: null } : { data: true };
  };
  rpc.calls = calls;
  return rpc;
}

test("the switch is offered only in an installed copy that can be pushed to, in a build with a key", () => {
  assert.equal(VAPID_PUBLIC_KEY, "", "Node has no build key");
  assert.equal(reminderAvailability(pageScope()), "unsupported", "no key: hidden");
  assert.equal(reminderAvailability(pageScope(), KEY), "ok");
  assert.equal(reminderAvailability(pageScope({ standalone: false }), KEY), "not-installed");
  assert.equal(reminderAvailability(pageScope({ permission: "denied" }), KEY), "denied");
  assert.equal(reminderAvailability(pageScope({ push: false }), KEY), "unsupported", "no Web Push");
  assert.equal(reminderAvailability({ navigator: {} }, KEY), "unsupported");
  assert.equal(reminderAvailability({ Notification() {}, PushManager() {}, navigator: {} }, KEY), "unsupported", "no service worker");
  assert.equal(reminderAvailability(undefined, KEY), "unsupported");
});

test("the key and the subscription as the server takes them", () => {
  const bytes = keyBytes(KEY);
  assert.equal(bytes.length, 65);
  assert.equal(bytes[0], 4, "an uncompressed P-256 point");
  assert.deepEqual(subscriptionRow(fakeSubscription(), "en"), { p_endpoint: ENDPOINT, p_p256dh: KEYS.p256dh, p_auth: KEYS.auth, p_language: "en" });
  assert.equal(subscriptionRow({ endpoint: ENDPOINT, keys: KEYS }, "fr").p_language, "ko", "a language the server has not: Korean");
  assert.equal(subscriptionRow(fakeSubscription("http://fcm.googleapis.com/x")), null);
  assert.equal(subscriptionRow({ endpoint: ENDPOINT, keys: {} }), null);
  assert.equal(subscriptionRow(null), null);
});

test("off by default: opening the app sends nothing until the player turns it on", async () => {
  memory.clear();
  assert.equal(reminderOn(), false);
  const rpc = fakeRpc();
  assert.equal(await refreshReminderOnOpen({ scope: pageScope({ permission: "granted" }), key: KEY, rpc, now: W49 }), "off");
  assert.deepEqual(rpc.calls, []);
});

test("turning it on asks permission from the tap, and a refusal leaves it off with nothing sent", async () => {
  memory.clear();
  const rpc = fakeRpc();
  assert.deepEqual(await turnReminderOn({ scope: pageScope({ answer: "denied" }), key: KEY, rpc }), { permission: "denied", on: false });
  assert.deepEqual(await turnReminderOn({ scope: pageScope({ answer: "default" }), key: KEY, rpc }), { permission: "default", on: false });
  assert.deepEqual(await turnReminderOn({ scope: pageScope({ answer: new Error("blocked") }), key: KEY, rpc }), { permission: "default", on: false });
  assert.deepEqual(rpc.calls, []);
  assert.equal(memory.get(WEEKLY_REMINDER_KEY), undefined);
});

test("turning it on subscribes and hands the subscription and language to the server", async () => {
  memory.clear();
  const scope = pageScope();
  const rpc = fakeRpc();
  assert.deepEqual(await turnReminderOn({ scope, key: KEY, language: "ja", rpc, now: W49 }), { permission: "granted", on: true });
  assert.equal(reminderOn(), true);
  assert.equal(scope.subscribed.length, 1);
  assert.equal(scope.subscribed[0].userVisibleOnly, true);
  assert.deepEqual([...scope.subscribed[0].applicationServerKey], [...keyBytes(KEY)]);
  assert.deepEqual(rpc.calls, [["push_subscribe", { p_endpoint: ENDPOINT, p_p256dh: KEYS.p256dh, p_auth: KEYS.auth, p_language: "ja" }]]);
  assert.deepEqual(JSON.parse(memory.get(WEEKLY_REMINDER_SYNC_KEY)), { endpoint: ENDPOINT, language: "ja", week: "2026-W49" });

  // A subscription the browser already has is used as it is.
  const existing = fakeSubscription("https://web.push.apple.com/device-2");
  const again = pageScope({ existing });
  assert.equal((await turnReminderOn({ scope: again, key: KEY, rpc: fakeRpc(), now: W49 })).on, true);
  assert.equal(again.subscribed.length, 0);
});

test("a subscription the server could not store leaves it off and is dropped", async () => {
  for (const [why, scope, rpc] of [
    ["the server refused", pageScope(), fakeRpc({ fail: true })],
    ["a build without a server", pageScope(), fakeRpc({ skipped: true })],
    ["push refused to subscribe", pageScope({ subscribeFails: true }), fakeRpc()],
    ["no worker in charge", pageScope({ worker: false }), fakeRpc()],
    ["a worker that never gets ready", pageScope({ ready: false }), fakeRpc()],
  ]) {
    memory.clear();
    assert.deepEqual(await turnReminderOn({ scope, key: KEY, rpc, now: W49 }), { permission: "granted", on: false }, why);
    assert.equal(reminderOn(), false, why);
    if (scope.state.subscription) assert.equal(scope.state.subscription.dropped, 1, `${why}: the browser's subscription is dropped`);
  }
  const stubborn = pageScope({ existing: fakeSubscription(ENDPOINT, { failUnsubscribe: true }) });
  assert.equal((await turnReminderOn({ scope: stubborn, key: KEY, rpc: fakeRpc({ fail: true }) })).on, false);
  const rejecting = pageScope();
  rejecting.navigator.serviceWorker.ready = Promise.reject(new Error("registration failed"));
  assert.equal((await turnReminderOn({ scope: rejecting, key: KEY, rpc: fakeRpc() })).on, false);
});

test("turning it off is stored at once, the server's row deleted and the subscription dropped", async () => {
  memory.set(WEEKLY_REMINDER_KEY, "1");
  const existing = fakeSubscription();
  const rpc = fakeRpc();
  assert.equal(await turnReminderOff({ scope: pageScope({ existing }), rpc }), true);
  assert.equal(reminderOn(), false);
  assert.equal(memory.get(WEEKLY_REMINDER_SYNC_KEY), "null");
  assert.deepEqual(rpc.calls, [["push_unsubscribe", { p_endpoint: ENDPOINT }]]);
  assert.equal(existing.dropped, 1);

  // Offline: still off, the subscription still dropped (the sender deletes the row on 410).
  const offline = fakeSubscription();
  assert.equal(await turnReminderOff({ scope: pageScope({ existing: offline }), rpc: fakeRpc({ fail: true }) }), true);
  assert.equal(offline.dropped, 1);
  assert.equal(await turnReminderOff({ scope: pageScope({ existing: fakeSubscription(ENDPOINT, { failUnsubscribe: true }) }), rpc: fakeRpc() }), true);
  const none = fakeRpc();
  assert.equal(await turnReminderOff({ scope: pageScope(), rpc: none }), true);
  assert.deepEqual(none.calls, [], "no subscription: nothing to delete");
  assert.equal(await turnReminderOff({ scope: pageScope({ worker: false }), rpc: none }), true);
  const broken = pageScope();
  broken.registration.pushManager.getSubscription = async () => {
    throw new Error("InvalidStateError");
  };
  assert.equal(await turnReminderOff({ scope: broken, rpc: none }), true);
});

test("opening the app hands the subscription over again only when it, the language or the week changed", async () => {
  memory.clear();
  memory.set(WEEKLY_REMINDER_KEY, "1");
  const scope = pageScope({ permission: "granted", existing: fakeSubscription() });
  const rpc = fakeRpc();
  assert.equal(await refreshReminderOnOpen({ scope, key: KEY, language: "ko", rpc, now: W49 }), "sent");
  assert.equal(await refreshReminderOnOpen({ scope, key: KEY, language: "ko", rpc, now: W49 }), "kept");
  assert.equal(await refreshReminderOnOpen({ scope, key: KEY, language: "en", rpc, now: W49 }), "sent", "another language");
  assert.equal(await refreshReminderOnOpen({ scope, key: KEY, language: "en", rpc, now: W50 }), "sent", "a new week");
  assert.equal(rpc.calls.length, 3);
  // The push service moved the subscription: the new endpoint is handed over.
  scope.state.subscription = fakeSubscription(`${ENDPOINT}-moved`);
  assert.equal(await refreshReminderOnOpen({ scope, key: KEY, language: "en", rpc, now: W50 }), "sent");
  // The browser dropped it: subscribed again, and handed over (the server last heard of the moved one).
  scope.state.subscription = null;
  assert.equal(await refreshReminderOnOpen({ scope, key: KEY, language: "en", rpc, now: W50 }), "sent");
  assert.equal(scope.subscribed.length, 1);

  assert.equal(await refreshReminderOnOpen({ scope: pageScope({ permission: "granted", subscribeFails: true }), key: KEY, rpc, now: W50 }), "failed");
  memory.set(WEEKLY_REMINDER_SYNC_KEY, "null");
  assert.equal(await refreshReminderOnOpen({ scope, key: KEY, rpc: fakeRpc({ fail: true }), now: W50 }), "failed");
  memory.set(WEEKLY_REMINDER_SYNC_KEY, "{not json");
  assert.equal(await refreshReminderOnOpen({ scope, key: KEY, language: "en", rpc, now: W50 }), "sent");
  assert.equal(await refreshReminderOnOpen({ scope: pageScope({ permission: "default" }), key: KEY, rpc, now: W50 }), "off", "permission taken back");
  assert.equal(await refreshReminderOnOpen({ scope: pageScope({ permission: "granted", standalone: false }), key: KEY, rpc, now: W50 }), "off");
  assert.equal(await refreshReminderOnOpen({ scope, key: "", rpc, now: W50 }), "off", "a build without a key");
});

/** A worker scope with what a push needs: a registration that notifies, clients. */
function workerScope({ windows = [] } = {}) {
  const listeners = new Map();
  const shown = [];
  const opened = [];
  return {
    shown,
    opened,
    location: { origin: "https://game.example" },
    addEventListener: (type, listener) => listeners.set(type, listener),
    dispatch: async (type, event) => {
      const waits = [];
      listeners.get(type)?.({ ...event, waitUntil: (work) => waits.push(work), respondWith: () => {} });
      await Promise.all(waits);
    },
    caches: { keys: async () => [], delete: async () => true, open: async () => ({ match: async () => undefined, put: async () => {} }) },
    registration: { showNotification: async (title, options) => void shown.push({ title, ...options }) },
    clients: {
      claim: async () => {},
      matchAll: async () => windows,
      openWindow: async (url) => void opened.push(url),
    },
  };
}

const CONFIG = { release: "test", precache: [], warm: [], shell: "/index.html" };
const pushData = (value) => ({ json: () => (value instanceof Error ? (() => { throw value; })() : value), text: () => "plain words" });

test("the worker shows every push, in the words the sender wrote", async () => {
  const scope = workerScope();
  installWorker(scope, CONFIG);
  const sent = notificationFor(getWeekRule("crisis-week"), "en");
  await scope.dispatch("push", { data: pushData(sent) });
  assert.equal(scope.shown.length, 1);
  assert.equal(scope.shown[0].title, sent.title);
  assert.equal(scope.shown[0].body, sent.body);
  assert.equal(scope.shown[0].tag, REMINDER_TAG);
  assert.deepEqual(scope.shown[0].data, { url: "/en/" });

  // Never silent (iOS takes back a subscription whose pushes show nothing).
  await scope.dispatch("push", { data: null });
  await scope.dispatch("push", { data: pushData(new SyntaxError("not JSON")) });
  assert.deepEqual(scope.shown.slice(1).map((shown) => [shown.title, shown.body]), [["CRITICAL POINT", ""], ["CRITICAL POINT", "plain words"]]);

  assert.equal(pushNotice({ title: "x", url: "https://elsewhere.example/" }).options.data.url, "/", "only the game's own start pages");
  assert.equal(pushNotice({ title: "t".repeat(500), body: "b".repeat(900) }).title.length, 120);
  assert.equal(pushNotice({ title: "t", body: "b".repeat(900) }).options.body.length, 400);
  assert.equal(pushNotice({ title: "   " }).title, "CRITICAL POINT");
});

test("a tap on the reminder opens the game: the open window if there is one", async () => {
  let focused = 0;
  const open = workerScope({ windows: [{ url: "https://game.example/?lang=en", focus: async () => void (focused += 1) }] });
  installWorker(open, CONFIG);
  let closed = 0;
  await open.dispatch("notificationclick", { notification: { tag: REMINDER_TAG, data: { url: "/ja/" }, close: () => void (closed += 1) } });
  assert.equal(focused, 1);
  assert.equal(closed, 1);

  const none = workerScope({ windows: [{ url: "https://elsewhere.example/" }] });
  installWorker(none, CONFIG);
  await none.dispatch("notificationclick", { notification: { tag: REMINDER_TAG, data: { url: "/ja/" }, close: () => {} } });
  await none.dispatch("notificationclick", { notification: { tag: REMINDER_TAG, close: () => {} } });
  assert.deepEqual(none.opened, ["/ja/", "/"]);
  await none.dispatch("notificationclick", { notification: { tag: "another", close: () => assert.fail("not ours") } });
  assert.deepEqual(none.opened, ["/ja/", "/"]);
});

test("the sender: only a week with a rule, written in each subscriber's language", () => {
  assert.equal(ruleOfWeek(W49)?.id, "crisis-week");
  assert.equal(ruleOfWeek(W51), null, "an ordinary week sends nothing");
  const rule = ruleOfWeek(W49);
  const ko = notificationFor(rule, "ko");
  assert.equal(ko.title, "이번 주의 규칙: CRISIS WEEK");
  assert.equal(ko.body, `${rule.title}\n${rule.world}`);
  assert.equal(ko.url, "/");
  const en = notificationFor(rule, "en");
  assert.equal(en.title, "Rule of the Week: CRISIS WEEK");
  assert.match(en.body, /^Crisis week\nThis week the market shook/);
  assert.equal(en.url, "/en/");
  const ja = notificationFor(rule, "ja");
  assert.equal(ja.title, "今週のルール: CRISIS WEEK");
  assert.match(ja.body, /^危機の週\n/);
  assert.equal(notificationFor(rule, "fr").url, "/", "an unknown language reads Korean");
  // A rule with no line in the story says its title alone.
  assert.equal(notificationFor(getWeekRule("audit-cascade"), "ko").body, getWeekRule("audit-cascade").title);
  for (const lang of ["ko", "en", "ja"]) {
    const { title, options } = pushNotice(notificationFor(rule, lang));
    assert.equal(title, notificationFor(rule, lang).title, "what the sender writes, the worker shows");
    assert.ok(options.body.length > 0);
  }
});

test("the sender's read starts at this week's Monday, and its rows are read safely", () => {
  assert.match(subscriptionsQuery(W49), /last_sent_at < '2026-11-29T15:00:00\.000Z'::timestamptz/);
  assert.match(subscriptionsQuery(W51), /from public\.push_subscriptions/);
  const rows = readSubscriptions({ rows: [{ id: "3", endpoint: ENDPOINT, ...KEYS, language: "en" }, { id: 4, endpoint: "http://x", ...KEYS }, { id: "x" }, null] });
  assert.deepEqual(rows, [{ id: 3, endpoint: ENDPOINT, ...KEYS, language: "en" }]);
  assert.deepEqual(readSubscriptions([{ id: 5, endpoint: ENDPOINT, ...KEYS, language: "ko" }]).map((row) => row.id), [5]);
  assert.deepEqual(readSubscriptions("nothing"), []);
});

test("the sender sends to every row, deletes the gone and keeps the failed", async () => {
  const rule = ruleOfWeek(W49);
  const rows = [1, 2, 3, 4, 5].map((id) => ({ id, endpoint: `${ENDPOINT}-${id}`, ...KEYS, language: id === 2 ? "ja" : "ko" }));
  const asked = [];
  const send = async (subscription, payload, options) => {
    asked.push({ subscription, payload: JSON.parse(payload), options });
    const id = Number(subscription.endpoint.split("-").pop());
    if (id === 3) throw Object.assign(new Error("Gone"), { statusCode: 410 });
    if (id === 4) throw Object.assign(new Error("Not found"), { statusCode: 404 });
    if (id === 5) throw Object.assign(new Error("Too many"), { statusCode: 429 });
  };
  const result = await sendAll(rows, rule, send, { concurrency: 2 });
  assert.deepEqual(result, { sent: [1, 2], gone: [3, 4], failed: 1 });
  assert.equal(asked.length, 5);
  assert.deepEqual(asked.find((call) => call.subscription.endpoint.endsWith("-2")).payload, notificationFor(rule, "ja"));
  assert.deepEqual(asked[0].subscription.keys, KEYS);
  assert.deepEqual(asked[0].options, { TTL: PUSH_TTL_SECONDS, urgency: "normal" });

  const sql = afterSql(result, W49);
  assert.match(sql, /update public\.push_subscriptions set last_sent_at = '2026-11-30T23:00:00\.000Z'::timestamptz where id in \(1, 2\);/);
  assert.match(sql, /delete from public\.push_subscriptions where id in \(3, 4\);/);
  assert.equal(afterSql({ sent: [], gone: [Number.NaN] }, W49), "select 1 as done;\n", "nothing to write, and never anything but an integer id");

  const summary = describeRun(rule, rows, result, false);
  assert.match(summary, /2026-W49 CRISIS WEEK/);
  assert.match(summary, /대상 구독: 5 \(ko 4, en 0, ja 1\)/);
  assert.match(summary, /보냄: 2 · 사라진 구독 삭제: 2 · 실패\(다음 실행에 다시\): 1/);
  assert.doesNotMatch(summary, /https:/, "never an endpoint in the public log");
  assert.match(describeRun(rule, rows, { sent: [], gone: [], failed: 0 }, true), /dry run/);
  assert.deepEqual(await sendAll([], rule, send, { concurrency: 0 }), { sent: [], gone: [], failed: 0 });
});

test("the sender needs all three VAPID values", async () => {
  await assert.rejects(vapidSender({}), /VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY and VAPID_SUBJECT/);
  await assert.rejects(vapidSender({ VAPID_PUBLIC_KEY: KEY, VAPID_PRIVATE_KEY: "x" }), /VAPID_SUBJECT/);
});
