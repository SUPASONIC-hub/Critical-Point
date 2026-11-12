import assert from "node:assert/strict";
import { test } from "node:test";

import {
  FIRST_CASE,
  GAME_EVENTS,
  noteCaseClosed,
  noteTableOpened,
  resetGameEventsForTest,
  sendGameEvent,
  sendGameEventOnce,
  startVitalsSample,
  VITALS_SAMPLE_RATE,
} from "../../src/gameEvents.js";
import { readInteractionToNextPaint, watchVitals } from "../../src/webVitals.js";
import { readSharedHabitId, shareAddress, sharedHabitTitle, SHARE_SOURCE } from "../../src/shareLink.js";
import { CASE_SEQUENCE } from "../../src/gameCases.js";
import { JUDGEMENT_HABITS } from "../../src/judgementHabit.js";
import { fill } from "../../src/locale.js";
import habitsKo from "../../src/copy/habits.js";
import habitsEn from "../../src/locales/en/screens/habits.js";
import habitsJa from "../../src/locales/ja/screens/habits.js";
import { buildResultCardModel, buildShareText } from "../../src/resultCardModel.js";

/**
 * N2, N3 and N12 (2026-11-12): the first-hour events Google Analytics is
 * sent, the shared card's address and what the start page reads back from
 * it, and the one-in-twenty speed sample.
 */

const pageWithTag = () => {
  const calls = [];
  return { calls, scope: { gtag: (...args) => calls.push(args) } };
};

// ------------------------------------------------------------ N2 events

test("an event goes only to a page with Google's tag, by a known name, with whole numbers only", () => {
  resetGameEventsForTest();
  assert.equal(sendGameEvent(GAME_EVENTS.start, {}, {}), false, "no tag: the dev server, the e2e build, a release without GA");
  assert.equal(sendGameEvent(GAME_EVENTS.start, {}, null), false);
  const { calls, scope } = pageWithTag();
  assert.equal(sendGameEvent("player_name", {}, scope), false, "a name that is not one of GAME_EVENTS");
  assert.equal(sendGameEvent(GAME_EVENTS.start, { name: "홍길동", session: "ABC", count: 3, half: 1.5, minus: -1, "Bad-Key": 2 }, scope), true);
  assert.deepEqual(calls, [["event", "cp_start_pressed", { count: 3 }]], "text, fractions, negatives and odd keys are left behind");
  const broken = { gtag: () => { throw new Error("blocked"); } };
  assert.equal(sendGameEvent(GAME_EVENTS.start, {}, broken), false, "a tag that throws does not reach the game");
});

test("every event name is one GA4 accepts and none says who played", () => {
  for (const name of Object.values(GAME_EVENTS)) {
    assert.match(name, /^cp_[a-z0-9_]{1,37}$/);
  }
  assert.deepEqual(Object.keys(GAME_EVENTS).sort(), ["firstTable", "inp", "lcp", "prologueDone", "start"]);
});

test("start, the first table and the prologue's end are each counted once per page", () => {
  resetGameEventsForTest();
  const { calls, scope } = pageWithTag();
  assert.equal(FIRST_CASE, CASE_SEQUENCE[0]);
  assert.equal(FIRST_CASE, "prologue01");
  assert.equal(sendGameEventOnce(GAME_EVENTS.start, {}, scope), true);
  assert.equal(sendGameEventOnce(GAME_EVENTS.start, {}, scope), false);

  assert.equal(noteTableOpened("prologue02", scope), false, "another case's table is not the first");
  assert.equal(noteTableOpened(FIRST_CASE, scope), true);
  assert.equal(noteTableOpened(FIRST_CASE, scope), false, "the case's next table is not the first");

  assert.equal(noteCaseClosed("case01", false, scope), false);
  assert.equal(noteCaseClosed(FIRST_CASE, true, scope), false, "a prologue played again is not its first close");
  assert.equal(noteCaseClosed(FIRST_CASE, false, scope), true);
  assert.equal(noteCaseClosed(FIRST_CASE, false, scope), false);
  assert.deepEqual(calls.map((call) => call[1]), ["cp_start_pressed", "cp_first_table_open", "cp_prologue01_done"]);
  for (const call of calls) assert.deepEqual(call[2], {});
});

test("an event sent before the tag was there is still sent once it is", () => {
  resetGameEventsForTest();
  assert.equal(sendGameEventOnce(GAME_EVENTS.start, {}, {}), false);
  const { calls, scope } = pageWithTag();
  assert.equal(sendGameEventOnce(GAME_EVENTS.start, {}, scope), true);
  assert.equal(calls.length, 1);
});

// ------------------------------------------------------------ N12 speed

test("one page in twenty with Google's tag fetches the speed watcher; the rest never do", async () => {
  assert.ok(VITALS_SAMPLE_RATE >= 0.01 && VITALS_SAMPLE_RATE <= 0.05, "the owner's 1 to 5%");
  let loads = 0;
  const load = async () => {
    loads += 1;
    return { watchVitals: () => true };
  };
  assert.equal(startVitalsSample({ scope: {}, random: () => 0, load }), false, "no tag, no sample");
  assert.equal(startVitalsSample({ scope: { gtag() {} }, random: () => VITALS_SAMPLE_RATE, load }), false);
  assert.equal(startVitalsSample({ scope: { gtag() {} }, random: () => 0.99, load }), false);
  assert.equal(startVitalsSample({ scope: { gtag() {} }, random: () => 0.01, load }), true);
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(loads, 1);
  // A watcher that cannot be fetched is not an error on the page.
  assert.equal(startVitalsSample({ scope: { gtag() {} }, random: () => 0, load: () => Promise.reject(new Error("offline")) }), true);
  await new Promise((resolve) => setTimeout(resolve, 0));
});

test("INP is the longest interaction, past one outlier in fifty", () => {
  assert.equal(readInteractionToNextPaint([]), null);
  assert.equal(readInteractionToNextPaint([40, 120, 80]), 120);
  const many = Array.from({ length: 100 }, (_, index) => index + 1);
  assert.equal(readInteractionToNextPaint(many), 98, "the third longest of a hundred");
  assert.equal(readInteractionToNextPaint([NaN, -1, 60]), 60);
});

function fakeBrowser({ types = ["largest-contentful-paint", "event"] } = {}) {
  const observers = [];
  const listeners = {};
  const doc = {
    visibilityState: "visible",
    addEventListener: (type, fn) => (listeners[`doc:${type}`] ??= []).push(fn),
  };
  class Observer {
    constructor(callback) {
      this.callback = callback;
      this.disconnected = false;
    }
    observe({ type, buffered }) {
      if (!types.includes(type)) throw new TypeError(type);
      assert.equal(buffered, true);
      this.type = type;
      observers.push(this);
    }
    disconnect() {
      this.disconnected = true;
    }
  }
  const scope = {
    document: doc,
    PerformanceObserver: Observer,
    addEventListener: (type, fn) => (listeners[type] ??= []).push(fn),
  };
  const emit = (type, entries) => {
    for (const observer of observers) if (observer.type === type && !observer.disconnected) observer.callback({ getEntries: () => entries });
  };
  const fire = (name, event = { type: name }) => {
    for (const fn of listeners[name] ?? []) fn(event);
  };
  return { scope, doc, emit, fire, observers };
}

test("LCP and INP go once, as whole milliseconds, when the page is first hidden", () => {
  const browser = fakeBrowser();
  const sent = [];
  assert.equal(watchVitals({ scope: browser.scope, send: (name, params) => sent.push([name, params]) }), true);
  browser.emit("largest-contentful-paint", [{ startTime: 800.4 }, { startTime: 1520.6 }]);
  browser.emit("event", [
    { interactionId: 0, duration: 900 },
    { interactionId: 7, duration: 64 },
    { interactionId: 7, duration: 112 },
    { interactionId: 9, duration: 48 },
  ]);
  // The first press ends LCP: a paint after it is not the page's.
  browser.fire("pointerdown");
  browser.emit("largest-contentful-paint", [{ startTime: 4000 }]);
  browser.fire("doc:visibilitychange");
  assert.deepEqual(sent, [], "still visible: nothing yet");
  browser.doc.visibilityState = "hidden";
  browser.fire("doc:visibilitychange");
  browser.fire("pagehide");
  assert.deepEqual(sent, [
    ["cp_lcp", { value: 1521 }],
    ["cp_inp", { value: 112 }],
  ]);
  assert.ok(browser.observers.every((observer) => observer.disconnected));
});

test("a page closed without being hidden still reports, and a browser without event timing sends LCP alone", () => {
  const browser = fakeBrowser({ types: ["largest-contentful-paint"] });
  const sent = [];
  watchVitals({ scope: browser.scope, send: (name, params) => sent.push([name, params]) });
  browser.emit("largest-contentful-paint", [{ renderTime: 0, startTime: 950 }]);
  browser.fire("pagehide");
  assert.deepEqual(sent, [["cp_lcp", { value: 950 }]]);
});

test("the speed events reach the tag as beacons", () => {
  const { calls, scope } = pageWithTag();
  sendGameEvent(GAME_EVENTS.lcp, { value: 1200 }, scope);
  sendGameEvent(GAME_EVENTS.start, {}, scope);
  assert.deepEqual(calls, [
    ["event", "cp_lcp", { value: 1200, transport_type: "beacon" }],
    ["event", "cp_start_pressed", {}],
  ]);
});

test("without PerformanceObserver there is nothing to watch", () => {
  assert.equal(watchVitals({ scope: {} }), false);
  assert.equal(watchVitals({ scope: { PerformanceObserver: class {} } }), false, "and no document");
});

// ------------------------------------------------------------ N3 shared address

test("the shared address marks the card and names the habit by its id", () => {
  assert.equal(SHARE_SOURCE, "card");
  assert.equal(shareAddress("https://a.example", "moth"), "https://a.example/?from=card&h=moth");
  assert.equal(shareAddress("https://a.example//", "one-track"), "https://a.example/?from=card&h=one-track");
  assert.equal(shareAddress("https://a.example", ""), "https://a.example/?from=card");
  assert.equal(shareAddress("https://a.example", "<b>x</b>"), "https://a.example/?from=card", "only an id's shape is ever written");
  assert.equal(shareAddress("", "moth"), "");
  assert.equal(shareAddress(undefined), "");
});

test("the start page reads back only an id-shaped habit from a card's address", () => {
  assert.equal(readSharedHabitId("?from=card&h=moth"), "moth");
  assert.equal(readSharedHabitId("?h=stepping-stone&from=card"), "stepping-stone");
  assert.equal(readSharedHabitId("?h=moth"), "", "without the card's mark");
  assert.equal(readSharedHabitId("?from=board&h=moth"), "");
  assert.equal(readSharedHabitId("?from=card"), "");
  for (const bad of ["%3Cscript%3E", "Moth", "moth%20", "moth-", "-moth", "a".repeat(25), "moth&h=shield", "__proto__", "1moth"]) {
    assert.equal(readSharedHabitId(`?from=card&h=${bad}`), bad === "moth&h=shield" ? "moth" : "", bad);
  }
  assert.equal(readSharedHabitId(undefined), "");
  assert.equal(readSharedHabitId(""), "");
});

test("only one of the eleven habits gives a name, in every language", () => {
  const tables = { ko: habitsKo, en: { ...habitsKo, ...habitsEn }, ja: { ...habitsKo, ...habitsJa } };
  for (const [language, table] of Object.entries(tables)) {
    assert.match(table.friendLine, /\{habit\}/, `${language} friendLine has the blank`);
    for (const habit of JUDGEMENT_HABITS) {
      assert.equal(readSharedHabitId(`?from=card&h=${habit.id}`), habit.id, `${habit.id} round-trips`);
      const title = sharedHabitTitle(table, habit.id);
      assert.ok(title, `${language} ${habit.id}`);
      assert.equal(title, table[habit.id].title);
    }
    for (const notAHabit of ["cardLine", "friendLine", "constructor", "toString", "hasOwnProperty", "nobody"]) {
      assert.equal(sharedHabitTitle(table, notAHabit), "", `${language} ${notAHabit}`);
    }
  }
  assert.equal(sharedHabitTitle(null, "moth"), "");
  assert.equal(fill(habitsKo.friendLine, { habit: habitsKo.moth.title }), "친구의 결과: 하이리스크 불나방형");
  assert.equal(fill(habitsEn.friendLine, { habit: habitsEn.moth.title }), "Your friend's result: High-Risk Moth");
  assert.equal(fill(habitsJa.friendLine, { habit: habitsJa.moth.title }), "友だちの結果：ハイリスク夏の虫型");
});

test("the copied line ends on the marked address with the season's habit id, and the card draws no id", () => {
  const habit = JUDGEMENT_HABITS.find((item) => item.id === "shield");
  const model = buildResultCardModel({ fingerprint: { modeTitle: "DNA", habit: { id: habit.id, title: habit.title, card: "문장." } }, endingName: "결말", caseResults: {} });
  assert.equal(model.habitId, "shield");
  assert.ok(buildShareText(model, "https://a.example").endsWith(" 문장. https://a.example/?from=card&h=shield"));
  assert.ok(buildShareText(model).endsWith("문장."), "no origin, no address");
  const none = buildResultCardModel({ fingerprint: { modeTitle: "DNA", habit: null }, endingName: "결말", caseResults: {} });
  assert.equal(none.habitId, "");
  assert.ok(buildShareText(none, "https://a.example").endsWith(" https://a.example/?from=card"));
});
