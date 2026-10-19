import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { createStorage } from "./helpers/browser.mjs";

/**
 * What the table says aloud (`tableVoice.js`, E3): the sentences, and when a
 * change of the table makes one. The region itself is drawn in the browser;
 * here is everything about it that can be held without one.
 */
globalThis.localStorage = createStorage();

const voice = await import("../../src/gauntlet/tableVoice.js");
const { CLOCK_OPENED_CALL } = await import("../../src/gauntlet/tableReadout.js");
const { HOLD_ARMED_CALL, describePush, describeStanceCarry, describeBank, findBank, findStanceCarry, listTableCalls, queueCalls, readTableFacts } = voice;

const STRIKE_WAKE = { id: "strikeWake", label: "STRIKE WAKE", title: "다음 판이 더 두껍게 깨어난다" };
const STEADY_LINE = { id: "steadyLine", label: "STEADY LINE", title: "다음 판이 식은 채 열린다" };
const OVERCLOCK = { id: "overclock", label: "OVERCLOCK", title: "칩 2배" };

const tableWindow = (patch = {}) => ({ gauge: 30, wall: 77, pushes: 0, focus: 0, elapsed: 10, ...patch });
const facts = ({ win = tableWindow(), live = true, dangerLine = "벽까지 최소 22", cashMutations = [], remaining = 30, openedByClock = false } = {}) =>
  readTableFacts({ win, live, dangerLine, cashMutations, clock: { remaining, elapsed: win.elapsed, openedByClock } });

test("the sentences say only what the table shows", () => {
  assert.equal(describePush({ gauge: 41.6, dangerLine: "벽까지 최소 3" }), "열기 42 · 벽까지 최소 3");
  assert.equal(describeStanceCarry({ focus: 70.4, carry: STRIKE_WAKE }), "충전 70 · 확정하면 다음 판 STRIKE WAKE · 다음 판이 더 두껍게 깨어난다");
  assert.equal(describeBank({ runPot: 1250, vault: 4800 }), "판돈 1,250 · 금고 4,800");
  // The wall this window drew is never in what is said: only the board's danger line.
  const pushed = facts({ win: tableWindow({ gauge: 52, wall: 77, pushes: 1 }) });
  assert.equal(pushed.push, "열기 52 · 벽까지 최소 22");
  assert.ok(!JSON.stringify(pushed).includes("77"), "the drawn wall is not in the facts");
});

test("a push is said after it lands; the heat the clock adds is not", () => {
  const before = facts();
  assert.deepEqual(listTableCalls(before, facts({ win: tableWindow({ gauge: 38, pushes: 1 }), dangerLine: "벽까지 최소 14" })), [
    { kind: "push", text: "열기 38 · 벽까지 최소 14" },
  ]);
  assert.deepEqual(listTableCalls(before, facts({ win: tableWindow({ gauge: 31 }) })), [], "creep moves the heat with no push");
  assert.deepEqual(listTableCalls(before, facts({ win: tableWindow({ gauge: 90, pushes: 1 }), live: false })), [], "a push into the wall is the slam's");
  assert.deepEqual(listTableCalls(null, facts()), [], "a table's first render has nothing to compare");
});

test("the charge is said when it starts to count for the stance, and when the stance it counts for changes", () => {
  const loose = facts({ win: tableWindow({ focus: 52 }), cashMutations: [OVERCLOCK] });
  const charged = facts({ win: tableWindow({ focus: 70 }), cashMutations: [OVERCLOCK, STRIKE_WAKE] });
  assert.equal(findStanceCarry([OVERCLOCK]), null);
  assert.deepEqual(listTableCalls(loose, charged), [{ kind: "stance", text: describeStanceCarry({ focus: 70, carry: STRIKE_WAKE }) }]);
  const more = facts({ win: tableWindow({ focus: 85 }), cashMutations: [OVERCLOCK, STRIKE_WAKE] });
  assert.deepEqual(listTableCalls(charged, more), [], "more charge under the same stance means nothing new");
  const steady = facts({ win: tableWindow({ focus: 85 }), cashMutations: [STEADY_LINE] });
  assert.deepEqual(listTableCalls(more, steady).map((call) => call.kind), ["stance"]);
  assert.deepEqual(listTableCalls(steady, loose), [], "no charge to count is not news");
});

test("the clock is said at ten and at five, once each, and a pause is not a second ten", () => {
  const at = (remaining, patch = {}) => facts({ remaining, ...patch });
  assert.deepEqual(listTableCalls(at(11), at(10)), [{ kind: "clock", text: "10초 남았다" }]);
  assert.deepEqual(listTableCalls(at(10), at(9)), []);
  assert.deepEqual(listTableCalls(at(6), at(5)), [{ kind: "clock", text: "5초 남았다" }]);
  // `readTableFacts` reads the clock as running whatever the pause says, so
  // the call does not go blank under a pause and come back as new.
  assert.equal(readTableFacts({ win: tableWindow(), live: true, dangerLine: "", cashMutations: [], clock: { remaining: 8, paused: true } }).clock, "10초 남았다");
  const opened = at(45, { openedByClock: true, win: tableWindow({ elapsed: 0 }) });
  assert.deepEqual(listTableCalls(at(45, { win: tableWindow({ elapsed: 0 }) }), opened), [{ kind: "clock", text: CLOCK_OPENED_CALL }]);
});

test("an armed 확정 is said through the table's voice, once, and ahead of anything waiting", () => {
  const armed = (on, win = tableWindow()) => readTableFacts({ win, live: true, dangerLine: "", cashMutations: [], clock: { remaining: 30, elapsed: win.elapsed }, armed: on });
  assert.deepEqual(listTableCalls(armed(false), armed(true)), [{ kind: "hold", text: HOLD_ARMED_CALL }]);
  assert.deepEqual(listTableCalls(armed(true), armed(true)), [], "still armed is not news");
  assert.deepEqual(listTableCalls(armed(true), armed(false)), [], "the arm lapsing is not said");
  assert.equal(facts().hold, "", "a table no press armed says nothing of it");
  const queue = queueCalls([{ kind: "clock", text: "10초 남았다" }], [{ kind: "hold", text: HOLD_ARMED_CALL }]);
  assert.deepEqual(queue.map((call) => call.kind), ["hold", "clock"], "it lapses in three seconds, so it goes first");
});

test("a call waiting its turn is replaced by a newer one of its kind, and the clock goes first", () => {
  const queue = queueCalls([], [{ kind: "push", text: "열기 38 · 벽까지 최소 14" }]);
  const next = queueCalls(queue, [{ kind: "push", text: "열기 47 · 벽까지 최소 5" }, { kind: "clock", text: "10초 남았다" }]);
  assert.deepEqual(next, [
    { kind: "clock", text: "10초 남았다" },
    { kind: "push", text: "열기 47 · 벽까지 최소 5" },
  ]);
});

test("a bank is the case pot or the vault growing between one window and the next, and nothing else", () => {
  const dealt = (windowIndex, runPot, vault) => ({ windowIndex, runPot, vault });
  assert.deepEqual(findBank(dealt(4, 0, 0), dealt(5, 1250, 0)), { windowIndex: 5, text: "판돈 1,250 · 금고 0" }, "a cash banked into the case pot");
  assert.deepEqual(findBank(dealt(4, 1250, 0), dealt(5, 0, 1250)), { windowIndex: 5, text: "판돈 0 · 금고 1,250" }, "a closed case moved it to the vault");
  assert.equal(findBank(null, dealt(5, 1250, 0)), null, "the first table after a load has nothing to compare");
  assert.equal(findBank(dealt(4, 1250, 0), dealt(5, 0, 0)), null, "a bust is the slam's");
  assert.equal(findBank(dealt(2, 0, 0), dealt(5, 1250, 0)), null, "a save loaded from elsewhere");
  assert.equal(findBank(dealt(5, 0, 0), dealt(5, 1250, 0)), null, "the same window mounted twice");
});

test("the table has one voice: the clock is said there and not in a region of its own", () => {
  const notices = readFileSync(new URL("../../src/gauntlet/TableNotices.jsx", import.meta.url), "utf8");
  assert.equal((notices.match(/className="sr-only" role="status"/g) ?? []).length, 1);
  assert.ok(!notices.includes("getClockCall"), "the clock's calls come through the voice");
  const stage = readFileSync(new URL("../../src/gauntlet/GauntletStage.jsx", import.meta.url), "utf8");
  assert.ok(!/aria-live="(polite|assertive)"/.test(stage), "the stage adds no live region of its own");
  assert.ok(stage.includes('className="gx-bpm"') && !/gx-bpm"[^>]*role=/.test(stage), "the heartbeat is read when asked for, never announced");
});
