import assert from "node:assert/strict";
import { test } from "node:test";

import { WEEKLY_REMINDER_KEY } from "../../src/appConfig.js";
import { isoWeekKey, weekStartMs } from "../../src/gauntlet/weeklyCalendar.js";
import { getWeekRule } from "../../src/gauntlet/weeklyRules.js";
import { dueReminder, installWorker, nextReminderState, REMINDER_CACHE, REMINDER_TAG as WORKER_TAG, REMINDER_URL } from "../../src/serviceWorker/worker.js";
import { canCheckClosed, disableReminder, enableReminder, REMINDER_MIN_INTERVAL_MS, REMINDER_TAG, reminderAvailability, reminderOn, syncReminder } from "../../src/state/weeklyReminder.js";
import { buildReminderPlan, PLAN_WEEKS, reminderMessage, syncReminderOnOpen, turnReminderOff, turnReminderOn } from "../../src/state/weeklyReminderPlan.js";

/**
 * 주 1회 알림 (N25): the switch (state/weeklyReminder.js), the plan the page
 * writes (state/weeklyReminderPlan.js) and the worker's half
 * (serviceWorker/worker.js). Off until turned on; nothing leaves the device.
 */

const memory = new Map();
globalThis.localStorage = {
  getItem: (key) => (memory.has(key) ? memory.get(key) : null),
  setItem: (key, value) => void memory.set(key, String(value)),
  removeItem: (key) => void memory.delete(key),
};

// Inside 2026-W49 (CRISIS WEEK, 11-30 ~ 12-06), a Wednesday noon in Korea.
const W49 = Date.parse("2026-12-02T12:00:00+09:00");

/** A page that can be asked everything the switch asks. */
function pageScope({ standalone = true, permission = "default", answer = "granted", periodic = "granted", periodicSync = true, worker = true, ready = true } = {}) {
  const posted = [];
  const registered = [];
  const unregistered = [];
  const registration = {
    active: worker ? { postMessage: (message) => posted.push(message) } : null,
    ...(periodicSync
      ? {
          periodicSync: {
            register: async (tag, options) => void registered.push([tag, options]),
            unregister: async (tag) => void unregistered.push(tag),
          },
        }
      : {}),
  };
  function Notification() {}
  Notification.permission = permission;
  Notification.requestPermission = async () => {
    if (answer instanceof Error) throw answer;
    Notification.permission = answer;
    return answer;
  };
  return {
    posted,
    registered,
    unregistered,
    Notification,
    matchMedia: () => ({ matches: standalone }),
    navigator: {
      serviceWorker: { ready: ready ? Promise.resolve(registration) : new Promise(() => {}) },
      permissions: { query: async ({ name }) => ({ state: name === "periodic-background-sync" ? periodic : "prompt" }) },
    },
    setTimeout: (work) => setTimeout(work, 5),
    clearTimeout,
  };
}

test("the switch is offered only in an installed copy that can notify", () => {
  assert.equal(reminderAvailability(pageScope()), "ok");
  assert.equal(reminderAvailability(pageScope({ standalone: false })), "not-installed");
  assert.equal(reminderAvailability(pageScope({ permission: "denied" })), "denied");
  assert.equal(reminderAvailability({ navigator: {} }), "unsupported");
  assert.equal(reminderAvailability({ Notification() {}, navigator: {} }), "unsupported", "no service worker");
  assert.equal(reminderAvailability(undefined), "unsupported");
});

test("the plan: only weeks with a rule, from this week on, in the page's words", () => {
  const plan = buildReminderPlan(W49);
  assert.ok(plan.length > 0 && plan.length <= PLAN_WEEKS + 1);
  const [first] = plan;
  assert.equal(first.week, "2026-W49");
  assert.equal(first.startMs, weekStartMs("2026-W49"));
  const rule = getWeekRule("crisis-week");
  assert.equal(first.title, `이번 주의 규칙: ${rule.label}`);
  assert.equal(first.body, `${rule.title}\n${rule.world}`);
  assert.ok(plan.every((entry) => entry.startMs >= weekStartMs("2026-W49")));
  assert.ok(plan.every((entry, index) => index === 0 || entry.startMs > plan[index - 1].startMs));
  // An ordinary week is not in it: W51 has no rule.
  assert.equal(plan.some((entry) => entry.week === "2026-W51"), false);
  // A calendar with a rule that has no line in the story says its title alone.
  const [bare] = buildReminderPlan(W49, [{ week: "2026-W49", id: "audit-cascade" }]);
  assert.equal(bare.body, getWeekRule("audit-cascade").title);
  assert.deepEqual(buildReminderPlan(W49, []), []);
  assert.deepEqual(buildReminderPlan(W49, [{ week: "2026-W49", id: "no-such-rule" }]), []);
  assert.equal(reminderMessage(W49).week, isoWeekKey(W49));
});

test("off by default: opening the app does nothing until the player turns it on", async () => {
  memory.clear();
  assert.equal(reminderOn(), false);
  const scope = pageScope();
  assert.equal(await syncReminderOnOpen(scope, W49), "off");
  assert.deepEqual(scope.posted, []);
});

test("turning it on asks permission once, from the tap, and a refusal leaves it off", async () => {
  memory.clear();
  const refused = pageScope({ answer: "denied" });
  assert.deepEqual(await turnReminderOn(refused, W49), { permission: "denied", mode: "off" });
  assert.equal(reminderOn(), false);
  assert.deepEqual(refused.posted, []);
  assert.deepEqual(await enableReminder({ scope: pageScope({ answer: "default" }) }), { permission: "default", mode: "off" });
  assert.deepEqual(await enableReminder({ scope: pageScope({ answer: new Error("blocked") }) }), { permission: "default", mode: "off" });
  assert.equal(memory.get(WEEKLY_REMINDER_KEY), undefined);

  const scope = pageScope();
  assert.deepEqual(await turnReminderOn(scope, W49), { permission: "granted", mode: "periodic" });
  assert.equal(reminderOn(), true);
  assert.equal(scope.posted.length, 1);
  assert.equal(scope.posted[0].type, "reminder-plan");
  assert.equal(scope.posted[0].seen, "2026-W49", "the week it was turned on in counts as seen");
  assert.equal(scope.posted[0].plan[0].week, "2026-W49");
  assert.deepEqual(scope.registered, [[REMINDER_TAG, { minInterval: REMINDER_MIN_INTERVAL_MS }]]);
});

test("where the browser will not wake the worker, it still syncs and says so", async () => {
  memory.set(WEEKLY_REMINDER_KEY, "1");
  assert.equal(await syncReminder({ scope: pageScope({ periodic: "prompt" }) }), "open-only");
  assert.equal(await syncReminder({ scope: pageScope({ periodicSync: false }) }), "open-only", "no periodic sync at all (iOS, Firefox)");
  const failing = pageScope();
  failing.navigator.permissions.query = async () => {
    throw new TypeError("unknown permission");
  };
  assert.equal(await canCheckClosed(failing, { periodicSync: {} }), false);
  assert.equal(await canCheckClosed(failing, null), false);
  const refusing = pageScope();
  const registration = await refusing.navigator.serviceWorker.ready;
  registration.periodicSync.register = async () => {
    throw new Error("NotAllowedError");
  };
  assert.equal(await syncReminder({ scope: refusing }), "open-only");
  assert.equal(await syncReminder({ scope: pageScope({ worker: false }) }), "off", "no worker in charge");
  assert.equal(await syncReminder({ scope: pageScope({ ready: false }) }), "off", "a worker that never gets ready");
  assert.equal(await syncReminder({ scope: pageScope({ standalone: false }) }), "off", "a browser tab");
  assert.equal(await syncReminder({ scope: { ...pageScope(), navigator: { serviceWorker: {} } } }), "off");
});

test("turning it off is stored at once and the worker forgets its plan", async () => {
  memory.set(WEEKLY_REMINDER_KEY, "1");
  const scope = pageScope();
  assert.equal(await turnReminderOff(scope), true);
  assert.equal(reminderOn(), false);
  assert.deepEqual(scope.posted, [{ type: "reminder-plan", plan: [], seen: null }]);
  assert.deepEqual(scope.unregistered, [REMINDER_TAG]);
  const refusing = pageScope();
  (await refusing.navigator.serviceWorker.ready).periodicSync.unregister = async () => {
    throw new Error("never registered");
  };
  assert.equal(await disableReminder({ scope: refusing }), true);
  assert.equal(await disableReminder({ scope: pageScope({ worker: false, periodicSync: false }) }), true);
});

test("the worker reminds once a week, never for a week the app was opened in", () => {
  const plan = buildReminderPlan(W49);
  const state = { plan, seen: "2026-W48", shown: null };
  assert.equal(dueReminder(state, W49)?.week, "2026-W49");
  assert.equal(dueReminder({ ...state, seen: "2026-W49" }, W49), null, "opened this week");
  assert.equal(dueReminder({ ...state, shown: "2026-W49" }, W49), null, "already reminded");
  assert.equal(dueReminder(state, weekStartMs("2026-W49") - 1), null, "not before Monday 00:00 KST");
  assert.equal(dueReminder(state, Date.parse("2026-12-16T12:00:00+09:00")), null, "an ordinary week");
  assert.equal(dueReminder(null, W49), null);
  assert.equal(dueReminder({ plan: [{ week: "2026-W49", startMs: weekStartMs("2026-W49"), title: "" }] }, W49), null);
  assert.equal(REMINDER_TAG, WORKER_TAG, "the page and the worker name the same check");
});

test("a page's message replaces the plan and keeps what was shown; turning off forgets everything", () => {
  const kept = { plan: [{ week: "2026-W49" }], seen: "2026-W48", shown: "2026-W48" };
  assert.deepEqual(nextReminderState(kept, { plan: [{ week: "2026-W50" }], seen: "2026-W49" }), { plan: [{ week: "2026-W50" }], seen: "2026-W49", shown: "2026-W48" });
  assert.deepEqual(nextReminderState(null, { plan: [{ week: "2026-W50" }], seen: 7 }), { plan: [{ week: "2026-W50" }], seen: null, shown: null });
  assert.deepEqual(nextReminderState(kept, { plan: [], seen: null }), { plan: [], seen: null, shown: null });
  assert.deepEqual(nextReminderState(kept, {}), { plan: [], seen: null, shown: null });
  assert.equal(nextReminderState(null, { plan: Array.from({ length: 40 }, (_, week) => ({ week })), seen: "x" }).plan.length, 20);
});

/** A worker scope with what the reminder needs: caches, a registration that notifies, clients. */
function workerScope({ windows = [], notify = true } = {}) {
  const stores = new Map();
  const listeners = new Map();
  const shown = [];
  const opened = [];
  const scope = {
    shown,
    opened,
    stores,
    location: { origin: "https://game.example" },
    addEventListener: (type, listener) => listeners.set(type, listener),
    dispatch: async (type, event) => {
      const waits = [];
      listeners.get(type)?.({ ...event, waitUntil: (work) => waits.push(work), respondWith: () => {} });
      await Promise.all(waits);
    },
    caches: {
      keys: async () => [...stores.keys()],
      delete: async (name) => stores.delete(name),
      open: async (name) => {
        if (!stores.has(name)) stores.set(name, new Map());
        const store = stores.get(name);
        const key = (request) => new URL(typeof request === "string" ? request : request.url, "https://game.example").pathname;
        return { match: async (request) => store.get(key(request))?.clone(), put: async (request, value) => void store.set(key(request), value) };
      },
    },
    registration: notify ? { showNotification: async (title, options) => void shown.push({ title, ...options }) } : {},
    clients: {
      claim: async () => {},
      matchAll: async () => windows,
      openWindow: async (url) => void opened.push(url),
    },
  };
  return scope;
}

const CONFIG = { release: "test", precache: [], warm: [], shell: "/index.html" };

test("the worker keeps the plan in a cache a new release does not delete, and shows one notification", async () => {
  const scope = workerScope();
  const worker = installWorker(scope, CONFIG);
  const plan = buildReminderPlan(W49);
  await scope.dispatch("message", { data: { type: "reminder-plan", plan, seen: "2026-W48" } });
  assert.ok(scope.stores.get(REMINDER_CACHE)?.has(REMINDER_URL));
  assert.equal(REMINDER_CACHE.startsWith("critical-point-"), false, "not a release's cache");

  await scope.dispatch("periodicsync", { tag: "something-else" });
  assert.equal(scope.shown.length, 0);
  // The browser decides when it wakes the worker; `remind` is what the wake-up runs.
  assert.equal(await worker.remind(W49), true);
  assert.equal(scope.shown.length, 1);
  assert.equal(scope.shown[0].title, plan[0].title);
  assert.equal(scope.shown[0].body, plan[0].body);
  assert.equal(scope.shown[0].tag, WORKER_TAG);
  assert.equal(await worker.remind(W49), false, "once a week");
  await scope.dispatch("periodicsync", { tag: WORKER_TAG });
  assert.equal(scope.shown.length, 1);

  // Opening the app in a new week counts it as seen; turning off forgets the plan.
  await scope.dispatch("message", { data: { type: "reminder-plan", plan: [], seen: null } });
  assert.equal(await worker.remind(W49), false);
});

test("a worker that cannot notify or read its plan does nothing", async () => {
  const mute = workerScope({ notify: false });
  const worker = installWorker(mute, CONFIG);
  await mute.dispatch("message", { data: { type: "reminder-plan", plan: buildReminderPlan(W49), seen: null } });
  assert.equal(await worker.remind(W49), false);
  const broken = workerScope();
  broken.caches.open = async () => {
    throw new Error("quota");
  };
  assert.equal(await installWorker(broken, CONFIG).remind(W49), false);
  await broken.dispatch("message", { data: { type: "reminder-plan", plan: [], seen: null } });
});

test("a tap on the reminder opens the game: the open window if there is one", async () => {
  let focused = 0;
  const open = workerScope({ windows: [{ url: "https://game.example/?lang=en", focus: async () => void (focused += 1) }] });
  installWorker(open, CONFIG);
  let closed = 0;
  const notification = { tag: WORKER_TAG, data: { url: "/" }, close: () => void (closed += 1) };
  await open.dispatch("notificationclick", { notification });
  assert.equal(focused, 1);
  assert.equal(closed, 1);

  const none = workerScope({ windows: [{ url: "https://elsewhere.example/" }] });
  installWorker(none, CONFIG);
  await none.dispatch("notificationclick", { notification: { tag: WORKER_TAG, close: () => {} } });
  assert.deepEqual(none.opened, ["/"]);

  await none.dispatch("notificationclick", { notification: { tag: "another", close: () => assert.fail("not ours") } });
  assert.deepEqual(none.opened, ["/"]);
});
