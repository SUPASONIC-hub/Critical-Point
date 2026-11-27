import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { createStorage } from "./helpers/browser.mjs";

globalThis.localStorage = createStorage();

const log = await import("../../src/firstHourLog.js");
const { readHadSavedData } = await import("../../src/firstVisitProbe.js");
const { STORAGE_KEY } = await import("../../src/appConfig.js");
const report = await import("../../scripts/report-first-hour.mjs");

const MIGRATION = readFileSync("supabase/migrations/20261202020000_first_hour_runs.sql", "utf8");

/** A page: a clock to move, a store, the sends it made, and the listeners it was given. */
function page({ hadSavedData = false, consent = true, telemetryOn = true, width = 390, stored = "" } = {}) {
  let now = 1_000_000;
  let kept = stored;
  const sent = [];
  const listeners = {};
  const on = (type, fn) => (listeners[type] = fn);
  const scope = { innerWidth: width, addEventListener: on, document: { documentElement: { lang: "ko" }, visibilityState: "visible", addEventListener: on } };
  const record = log.startFirstHour({
    loadedAt: null,
    telemetryOn,
    hadSavedData,
    read: () => kept,
    write: (text) => ((kept = text), true),
    consent: () => consent,
    send: async (id, payload, options) => sent.push({ id, payload, options }),
    now: () => now,
    scope,
  });
  return {
    record,
    sent,
    listeners,
    kept: () => JSON.parse(kept || "null"),
    tick: (ms) => (now += ms),
    settle: () => new Promise((resolve) => setTimeout(resolve, 0)),
  };
}

/** Storage as the browser has it: keys by index. */
const keyed = (entries = {}) => {
  const keys = Object.keys(entries);
  return { length: keys.length, key: (index) => keys[index] ?? null };
};

test("first visit is a device with none of the game's keys; the debug backend keys do not count", () => {
  assert.equal(readHadSavedData(keyed()), false);
  assert.equal(readHadSavedData(keyed({ "critical-point-telemetry-url": "x", "critical-point-telemetry-key": "y", "someone-else": "1" })), false);
  for (const key of [STORAGE_KEY, "critical-point-session-id", "critical-point-cold-opening-seen-v1"]) {
    assert.equal(readHadSavedData(keyed({ [key]: "1" })), true, key);
  }
  assert.equal(readHadSavedData(null), true, "no storage: nothing counts as first");
  assert.equal(readHadSavedData({ get length() { throw new Error("blocked"); } }), true);
});

test("no record without a backend, or on a device that had data", () => {
  assert.equal(page({ telemetryOn: false }).record, null);
  assert.equal(page({ hadSavedData: true }).record, null);
  const back = page({ hadSavedData: true, stored: JSON.stringify({ id: "x", t0: 999_000, v: 1, first: true }) });
  assert.equal(back.record.id, "x", "a record already kept goes on after a reload");
});

test("the first half hour, field by field, and only listed fields are sent", async () => {
  const p = page();
  assert.equal(p.record.dev, "phone");
  p.tick(4_000);
  log.noteControl("briefing");
  p.tick(8_000);
  log.noteControl("prologue");
  log.noteControl("cold-next");
  log.noteControl("cold-next");
  log.noteControl("cold-skip");
  log.noteScene("prologue01", "p1_start");
  log.noteTable("p1_start");
  log.noteHoldHint();
  log.noteHandClosed("p1_start", { status: "bust", cause: "timeout", pushes: 1 });
  log.noteHandClosed("p1_start", { status: "cashed", cause: "cash", pushes: 3, scouted: true });
  log.noteControl("file");
  log.noteHandClosed("p1_start", { status: "cashed", cause: "cash", pushes: "x", narrowed: true });
  log.noteScene("prologue01", "p1_next");
  log.noteHoldHint();
  log.noteHandClosed("p1_next", { status: "bust", cause: "push", pushes: 6 });
  await p.settle();
  const kept = p.kept();
  assert.deepEqual(
    { btn: kept.btn, btnS: kept.btnS, startS: kept.startS, cold: kept.cold, coldPages: kept.coldPages, t1: kept.t1, t1Push: kept.t1Push, t1Hint: kept.t1Hint, t1Timeout: kept.t1Timeout },
    { btn: "briefing", btnS: 4, startS: 12, cold: "skip", coldPages: 2, t1: "p1_start", t1Push: 4, t1Hint: 1, t1Timeout: 1 },
  );
  assert.deepEqual({ bustS: kept.bustS, bustNode: kept.bustNode, file: kept.file, scout: kept.scout, narrow: kept.narrow, far: kept.far, farCase: kept.farCase }, { bustS: 12, bustNode: "p1_start", file: true, scout: true, narrow: true, far: "p1_next", farCase: 1 });
  assert.equal(p.sent.length, 1, "the first BUST is sent, the second is not a first");
  for (const { payload } of p.sent) {
    assert.deepEqual(Object.keys(payload).filter((key) => !log.FIRST_HOUR_FIELDS.includes(key)), [], "t0 and the local marks stay home");
    assert.equal(payload.first, true);
  }
});

test("the page hidden sends where the player was, by keepalive, and only with consent", async () => {
  const p = page();
  log.noteScene("prologue01", "p1_start");
  p.tick(61_000);
  p.listeners.pagehide({ type: "pagehide" });
  await p.settle();
  assert.equal(p.sent.at(-1).options.keepalive, true);
  assert.deepEqual([p.sent.at(-1).payload.lastAt, p.sent.at(-1).payload.lastS], ["p1_start", 61]);
  p.listeners.visibilitychange({ type: "visibilitychange" });
  await p.settle();
  assert.equal(p.sent.length, 1, "visible is not hidden, and an unchanged record is not sent again");

  const no = page({ consent: false });
  log.noteScene("prologue01", "p1_start");
  no.listeners.pagehide({ type: "pagehide" });
  log.noteCaseDone();
  await no.settle();
  assert.equal(no.sent.length, 0);
});

test("past 30 minutes the next note closes the record as past30, and nothing more is counted", async () => {
  const p = page({ width: 1280 });
  assert.equal(p.record.dev, "pc");
  log.noteScene("prologue01", "p1_start");
  p.tick(log.FIRST_HOUR_WINDOW_MS);
  log.noteScene("prologue02", "p2_start");
  log.noteHandClosed("p2_start", { status: "bust", cause: "push" });
  await p.settle();
  const kept = p.kept();
  assert.equal(kept.past30, true);
  assert.equal(kept.far, "p1_start");
  assert.equal(kept.bustS, undefined);
  assert.equal(p.sent.at(-1).payload.past30, true);
  assert.equal(log.canAsk("lost"), false, "no first BUST in the half hour, no question about it");
  assert.equal(log.canAsk("again"), true, "the report's question is still asked");
});

test("each question once: shown, then answered or skipped; nothing else is an answer", async () => {
  const p = page();
  assert.equal(log.canAsk("lost"), false, "not before a BUST");
  log.noteHandClosed("p1_start", { status: "bust", cause: "abandon" });
  assert.equal(log.canAsk("lost"), false, "a hand left behind is not a BUST seen");
  log.noteHandClosed("p1_start", { status: "bust", cause: "push" });
  assert.equal(log.canAsk("lost"), true);
  log.markAsked("lost");
  assert.equal(log.canAsk("lost"), false);
  assert.equal(log.answer("lost", "free text"), false);
  assert.equal(log.answer("lost", "next"), true);
  assert.equal(log.answer("again", 11), false);
  assert.equal(log.answer("again", "skip"), true);
  await p.settle();
  assert.deepEqual([p.sent.at(-1).payload.lost, p.sent.at(-1).payload.again], ["next", "skip"]);
  assert.equal(log.canAsk("again"), false);
  assert.equal(page({ consent: false }).record !== null && log.canAsk("again"), false, "not asked where it cannot be sent");
});

test("the server allows exactly the fields the client sends", () => {
  const listed = MIGRATION.match(/array\[([\s\S]*?)\]/)[1].match(/'([a-zA-Z0-9]+)'/g).map((word) => word.slice(1, -1));
  assert.deepEqual(listed, [...log.FIRST_HOUR_FIELDS]);
  assert.match(MIGRATION, /revoke all on public\.first_hour_runs from public, anon, authenticated;/);
  assert.match(MIGRATION, /grant execute on function public\.first_hour_record\(uuid, jsonb\) to anon, service_role;/);
  assert.doesNotMatch(MIGRATION, /request_client_key|request_client_ip|session_id/, "no address and no session joins a record");
});

test("the report is one read-only SELECT with no id or time, and prints aggregates only", () => {
  assert.match(report.QUERY, /^select record from public\.first_hour_runs /);
  assert.equal(report.QUERY.split(";").filter((part) => part.trim()).length, 1);
  assert.doesNotMatch(report.QUERY, /\b(insert|update|delete|drop|alter|grant|truncate)\b|record_id|created_at/i);
  const rows = [
    { record: { v: 1, first: true, dev: "phone", lang: "ko", btn: "prologue", btnS: 10, startS: 10, cold: "skip", coldPages: 1, t1: "p1_start", t1Push: 3, t1Hint: 2, t1Timeout: 1, bustS: 120, bustNode: "p1_start", file: true, lastAt: "p1_start", lastS: 200, far: "p1_start", farCase: 1, lost: "stake", again: 7 } },
    { record: JSON.stringify({ v: 1, first: true, dev: "pc", lang: "en", btn: "briefing", btnS: 30, startS: 50, t1: "p1_start", t1Push: 5, t1Hint: 0, t1Timeout: 0, bustS: 300, bustNode: "p1_start", scout: true, lastAt: "p1_start", far: "p2_start", farCase: 2, lost: "skip", again: "shown" }) },
    { record: { v: 1, first: true, dev: "phone", lang: "ko", btn: "prologue", btnS: 5, startS: 5, cold: "done", coldPages: 3, t1: "p1_start", t1Push: 1, bustS: 90, bustNode: "p1_start", past30: true, lastAt: "p3_x", far: "p3_x", farCase: 3, again: 9 } },
    { record: { v: 1, first: false } },
    { record: "not json" },
  ];
  const read = report.readFirstHour(rows);
  assert.equal(read.records, 3);
  assert.deepEqual(read.devices, { phone: 2, pc: 1 });
  assert.equal(read.startSec, 10);
  assert.deepEqual(read.firstTable, { opened: 3, pushes: 3, hinted: 1, hints: 2, timedOut: 1 });
  assert.deepEqual(read.bust.scenes, [["p1_start", 3]]);
  assert.deepEqual(read.leftAt, [], "two records leaving at one scene are under the floor");
  assert.deepEqual(read.again, { answered: 2, median: 8, mean: 8, spread: [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0], skipped: 0, unanswered: 1 });
  const summary = report.describeFirstHour(read);
  assert.match(summary, /기록 3개 — 휴대폰 2 · PC 1/);
  assert.match(summary, /\| 첫 버튼 \| 프롤로그 시작 2 · 브리핑 먼저 보기 1 \(중앙값 10초\) \|/);
  assert.match(summary, /\| 「무엇을 잃었나요\?」 \| 건너뜀 1 · 판돈 1 \|/);
  assert.doesNotMatch(summary, /p3_x|record_id/);
  assert.match(report.describeFirstHour(report.readFirstHour([])), /아직 기록이 없습니다/);
});

test("the start screen's presses are read off the click, the report screen is a place to leave from", async () => {
  const p = page({ stored: "not json" });
  assert.ok(p.record, "a record that cannot be read is started again on a first visit");
  const press = (selector) => p.listeners.click({ target: { closest: (query) => (query === selector ? {} : null) } });
  press('[data-testid="language-picker"] button');
  press('[data-testid="start-story-mode"]');
  press(".gx-brief > summary");
  p.listeners.click({ target: null });
  p.listeners.click({ target: { closest: () => null } });
  log.noteCaseDone("prologue01");
  const kept = p.kept();
  assert.deepEqual([kept.btn, kept.startS, kept.file, kept.lastAt], ["language", 0, true, "result:prologue01"]);
  assert.equal(log.readFirstHourForTest().id, kept.id);
});

test("hidden by a switch of tab is a leave too; consent is read from the save when not given", async () => {
  globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify({ dataConsent: true }));
  let kept = "";
  const sent = [];
  const listeners = {};
  const scope = { innerWidth: 0, addEventListener: (type, fn) => (listeners[type] = fn), document: { visibilityState: "hidden", addEventListener: (type, fn) => (listeners[type] = fn) } };
  log.startFirstHour({ loadedAt: null, telemetryOn: true, hadSavedData: false, read: () => kept, write: (text) => ((kept = text), true), send: async (id, payload) => sent.push(payload), scope });
  listeners.visibilitychange({ type: "visibilitychange" });
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(sent.length, 1);
  assert.equal(sent[0].dev, "pc", "no width read is not a phone");
  globalThis.localStorage.setItem(STORAGE_KEY, "{broken");
  log.answer("again", 3);
  assert.equal(sent.length, 1, "a save that cannot be read is no consent");
  globalThis.localStorage.removeItem(STORAGE_KEY);
});

test("presses before the module loaded count at their own time, and the entry's notes reach the record", async () => {
  const events = await import("../../src/gameEvents.js");
  let kept = "";
  const target = { closest: (query) => (query === '[data-testid="start-first-case"]' ? {} : null) };
  log.startFirstHour({
    loadedAt: 1_000,
    now: () => 60_000,
    telemetryOn: true,
    hadSavedData: false,
    consent: () => false,
    read: () => kept,
    write: (text) => ((kept = text), true),
    earlyClicks: () => [{ target, at: 6_000 }],
    scope: {},
  });
  events.noteTableOpened("prologue01", {}, "p1_start");
  events.noteSceneShown("prologue01", "p1_start", { consent: false, scope: {} });
  events.noteCaseClosed("prologue01", true, {});
  const record = JSON.parse(kept);
  assert.deepEqual([record.btn, record.btnS, record.startS, record.t1, record.far, record.lastAt], ["prologue", 5, 5, "p1_start", "p1_start", "result:prologue01"]);
});
