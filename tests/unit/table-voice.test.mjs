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
const { getHoldArmedCall, getHoldCall, describeStatus, describePush, describeWall, describeScout, describeStanceCarry, describeBank, describeAct, findBank, findActStart, findStanceCarry, listTableCalls, queueCalls, readTableFacts } = voice;
const { dangerZoneOf, readDangerZone } = await import("../../src/gauntlet/tableMeters.js");

const STRIKE_WAKE = { id: "strikeWake", label: "STRIKE WAKE", title: "다음 판이 더 두껍게 깨어난다" };
const STEADY_LINE = { id: "steadyLine", label: "STEADY LINE", title: "다음 판이 식은 채 열린다" };
const OVERCLOCK = { id: "overclock", label: "OVERCLOCK", title: "칩 2배" };

const tableWindow = (patch = {}) => ({ gauge: 30, wall: 77, pushes: 0, focus: 0, elapsed: 10, ...patch });
const facts = ({ win = tableWindow(), live = true, dangerLine = "벽까지 최소 22", cashMutations = [], remaining = 30, openedByClock = false, asked = 0, runPot = 0, pulse = "" } = {}) =>
  readTableFacts({ win, live, dangerLine, cashMutations, clock: { remaining, elapsed: win.elapsed, openedByClock }, asked, runPot, pulse });

test("the sentences say only what the table shows", () => {
  assert.equal(describePush({ gauge: 41.6, dangerLine: "벽까지 최소 3" }), "열기 42 · 벽까지 최소 3");
  assert.equal(describeStanceCarry({ focus: 70.4, carry: STRIKE_WAKE }), "충전 70 · 확정하면 다음 판 STRIKE WAKE · 다음 판이 더 두껍게 깨어난다");
  assert.equal(describeBank({ hand: 1250, runPot: 1250, vault: 4800 }), "이번 판 +1,250 · 판돈 1,250 · 금고 4,800");
  assert.equal(describeBank({ hand: -900, runPot: 0, vault: 4800 }), "이번 판 −900 · 판돈 0 · 금고 4,800");
  assert.equal(describeAct({ act: 2, caseId: "case08" }), "2막 시작 · 사건 08");
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

test("the clock's creep is said once it crosses a step of the danger line, and a push's crossing is the push's", () => {
  assert.equal(readDangerZone({ gauge: 30, nextHigh: 48, wallMin: 60 }), "distance");
  assert.equal(readDangerZone({ gauge: 42, nextHigh: 60, wallMin: 60 }), "inReach");
  assert.equal(readDangerZone({ gauge: 60, nextHigh: 78, wallMin: 60 }), "inBand");
  assert.deepEqual(["벽까지 최소 12", "밀면 벽 사정권", "벽 구간 안", ""].map(dangerZoneOf), ["distance", "inReach", "inBand", ""], "the step is read back off the line");
  assert.equal(describeWall({ gauge: 42.4, dangerLine: "밀면 벽 사정권" }), "지금 열기 42 · 밀면 벽 사정권");
  const far = facts({ win: tableWindow({ gauge: 30 }), dangerLine: "벽까지 최소 12" });
  const nearer = facts({ win: tableWindow({ gauge: 33 }), dangerLine: "벽까지 최소 9" });
  assert.deepEqual(listTableCalls(far, nearer), [], "the number the creep moves is not said");
  const reach = facts({ win: tableWindow({ gauge: 42 }), dangerLine: "밀면 벽 사정권" });
  assert.deepEqual(listTableCalls(nearer, reach), [{ kind: "wall", text: "지금 열기 42 · 밀면 벽 사정권" }]);
  assert.deepEqual(listTableCalls(reach, facts({ win: tableWindow({ gauge: 44 }), dangerLine: "밀면 벽 사정권" })), [], "the same step is not news");
  const inBand = facts({ win: tableWindow({ gauge: 60 }), dangerLine: "벽 구간 안" });
  assert.deepEqual(listTableCalls(reach, inBand), [{ kind: "wall", text: "지금 열기 60 · 벽 구간 안" }]);
  // A cooling press (STEADY's relief) that steps the line back down is said the same way.
  assert.deepEqual(listTableCalls(inBand, reach), [{ kind: "wall", text: "지금 열기 42 · 밀면 벽 사정권" }]);
  const pushedIn = facts({ win: tableWindow({ gauge: 60, pushes: 1 }), dangerLine: "벽 구간 안" });
  assert.deepEqual(listTableCalls(reach, pushedIn), [{ kind: "push", text: "열기 60 · 벽 구간 안" }], "a push that crosses is one call, the push's");
  assert.deepEqual(listTableCalls(facts({ dangerLine: "" }), reach), [], "a table that hands no line over says nothing of it");
  assert.deepEqual(queueCalls([{ kind: "wall", text: "지금 열기 42 · 밀면 벽 사정권" }], [{ kind: "push", text: "열기 38 · 벽까지 최소 14" }]).map((call) => call.kind), ["push", "wall"], "a waiting crossing is said after the push");
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

test("the held 확정's hint and arm are said through the table's voice, once, and ahead of anything waiting", () => {
  const held = (phase, win = tableWindow()) => readTableFacts({ win, live: true, dangerLine: "", cashMutations: [], clock: { remaining: 30, elapsed: win.elapsed }, hold: phase });
  assert.deepEqual(listTableCalls(held("idle"), held("armed")), [{ kind: "hold", text: getHoldArmedCall() }]);
  assert.deepEqual(listTableCalls(held("idle"), held("hinted")), [{ kind: "hold", text: "길게 눌러야 확정된다" }], "a press that let go early is told to hold");
  assert.equal(getHoldCall("hinted"), "길게 눌러야 확정된다");
  assert.deepEqual(listTableCalls(held("armed"), held("armed")), [], "still armed is not news");
  assert.deepEqual(listTableCalls(held("armed"), held("idle")), [], "the arm lapsing is not said");
  assert.deepEqual(listTableCalls(held("idle"), held("holding")), [], "a hold under way says nothing: the gauge shows it");
  assert.equal(facts().hold, "", "a table no press touched says nothing of it");
  const queue = queueCalls([{ kind: "clock", text: "10초 남았다" }], [{ kind: "hold", text: getHoldArmedCall() }]);
  assert.deepEqual(queue.map((call) => call.kind), ["hold", "clock"], "it lapses in three seconds, so it goes first");
});

test("a look is said once, through the voice, as the band it bought", () => {
  const looked = (band) => readTableFacts({ win: tableWindow(), live: true, dangerLine: "", cashMutations: [], clock: { remaining: 30, elapsed: 10 }, band });
  const board = { wallMin: 60, wallMax: 98, scouted: false };
  const scouted = { wallMin: 70, wallMax: 90, scouted: true };
  assert.equal(describeScout(scouted), "조회했다. 믿음 1을 썼다. 벽은 70에서 90 사이 어딘가");
  assert.deepEqual(listTableCalls(looked(board), looked(scouted)), [{ kind: "scout", text: describeScout(scouted) }]);
  assert.deepEqual(listTableCalls(looked(scouted), looked(scouted)), [], "a spent look is not news");
  assert.equal(looked(board).scout, "", "the board's own band is not a look");
  assert.equal(facts().scout, "", "a table with no band handed over says nothing of it");
});

test("a call waiting its turn is replaced by a newer one of its kind, and the clock goes first", () => {
  const queue = queueCalls([], [{ kind: "push", text: "열기 38 · 벽까지 최소 14" }]);
  const next = queueCalls(queue, [{ kind: "push", text: "열기 47 · 벽까지 최소 5" }, { kind: "clock", text: "10초 남았다" }]);
  assert.deepEqual(next, [
    { kind: "clock", text: "10초 남았다" },
    { kind: "push", text: "열기 47 · 벽까지 최소 5" },
  ]);
});

test("the settlement is said once, as the next window's table opens: the hand's ±N, the case pot and the vault", () => {
  const dealt = (windowIndex, runPot, vault, caseId = "case01") => ({ windowIndex, runPot, vault, caseId });
  assert.deepEqual(findBank(dealt(4, 0, 0), dealt(5, 1250, 0)), { windowIndex: 5, text: "이번 판 +1,250 · 판돈 1,250 · 금고 0" }, "a cash banked into the case pot");
  assert.deepEqual(findBank(dealt(4, 1250, 0), dealt(5, 0, 1250, "case02")), { windowIndex: 5, text: "이번 판 0 · 판돈 0 · 금고 1,250" }, "a closed case moved the pot to the vault: the money did not move");
  assert.deepEqual(findBank(dealt(4, 1250, 0), dealt(5, 0, 2000, "case02")), { windowIndex: 5, text: "이번 판 +750 · 판돈 0 · 금고 2,000" }, "the closing hand's own cash, net of what the audit took");
  assert.deepEqual(findBank(dealt(4, 1250, 0), dealt(5, 0, 0)), { windowIndex: 5, text: "이번 판 −1,250 · 판돈 0 · 금고 0" }, "a bust: the slam said the pot it took; this is the settlement's line after it");
  assert.equal(findBank(null, dealt(5, 1250, 0)), null, "the first table after a load has nothing to compare");
  assert.equal(findBank(dealt(2, 0, 0), dealt(5, 1250, 0)), null, "a save loaded from elsewhere");
  assert.equal(findBank(dealt(5, 0, 0), dealt(5, 1250, 0)), null, "the same window mounted twice");
});

test("an act is said to begin on the first table of the case that opens it, once, and after the settlement", () => {
  const dealt = (windowIndex, caseId) => ({ windowIndex, runPot: 0, vault: 0, caseId });
  assert.deepEqual(findActStart(dealt(40, "case07"), dealt(41, "case08")), { windowIndex: 41, text: "2막 시작 · 사건 08" });
  assert.deepEqual(findActStart(dealt(9, "prologue05"), dealt(10, "case01")), { windowIndex: 10, text: "1막 시작 · 사건 01" });
  assert.deepEqual(findActStart(dealt(200, "case42"), dealt(201, "case43")), { windowIndex: 201, text: "8막 시작 · 사건 43" }, "the last act");
  assert.equal(findActStart(dealt(41, "case08"), dealt(42, "case08")), null, "the case's second table is not a start");
  assert.equal(findActStart(dealt(45, "case08"), dealt(46, "case09")), null, "a case that opens no act");
  assert.equal(findActStart(null, dealt(41, "case08")), null, "a load or a debug jump into the case has no last table");
  assert.equal(findActStart(dealt(30, "case07"), dealt(41, "case08")), null, "a save loaded from elsewhere");
  const queue = queueCalls([{ kind: "act", text: "2막 시작 · 사건 08" }, { kind: "audit", text: "감사" }], [{ kind: "bank", text: "이번 판 +750 · 판돈 0 · 금고 2,000" }]);
  assert.deepEqual(queue.map((call) => call.kind), ["bank", "act", "audit"], "the last hand's money, then the act, then the table's own lines");
});

test("the table has one voice: the clock is said there and not in a region of its own", () => {
  const notices = readFileSync(new URL("../../src/gauntlet/TableNotices.jsx", import.meta.url), "utf8");
  assert.equal((notices.match(/className="sr-only" role="status"/g) ?? []).length, 1);
  assert.ok(!notices.includes("getClockCall"), "the clock's calls come through the voice");
  const stage = readFileSync(new URL("../../src/gauntlet/GauntletStage.jsx", import.meta.url), "utf8");
  assert.ok(!/aria-live="(polite|assertive)"/.test(stage), "the stage adds no live region of its own");
  assert.ok(stage.includes('className="gx-bpm"') && !/gx-bpm"[^>]*role=/.test(stage), "the heartbeat is read when asked for, never announced");
  // E3 2단계 (b): a case's close is said where the listener is, by the result
  // screen's own one polite line -- the rank it already said, and the standing.
  const result = readFileSync(new URL("../../src/screens/ResultScreen.jsx", import.meta.url), "utf8");
  assert.equal((result.match(/aria-live="polite"/g) ?? []).length, 1, "the result screen keeps its one line");
  assert.ok(result.includes("{screenReaderStatus} {view.seasonStanding.label} · {view.seasonStanding.text}"), "the standing is in that line");
});

test("지금 상황 듣기: asked, the table says the numbers it shows in one line, first, and never the wall", () => {
  assert.equal(
    describeStatus({ gauge: 41.6, dangerLine: "밀면 벽 사정권", runPot: 1250, remaining: 17.2, pulse: 120 }),
    "열기 42 · 밀면 벽 사정권 · 판돈 1,250 · 남은 18초 · 심박 120",
  );
  assert.equal(describeStatus({ gauge: 0, dangerLine: "벽까지 최소 40", runPot: 0, remaining: -0.4, pulse: "교란" }), "열기 0 · 벽까지 최소 40 · 판돈 0 · 남은 0초 · 심박 교란", "a sedated board's word, and no negative clock");
  // The drawn wall is 77 and the band 62-81: neither number is in the line, whatever is asked.
  const before = facts({ win: tableWindow({ gauge: 52, wall: 77 }), dangerLine: "벽까지 최소 10", runPot: 300, pulse: 104 });
  const asked = facts({ win: tableWindow({ gauge: 52, wall: 77 }), dangerLine: "벽까지 최소 10", runPot: 300, pulse: 104, asked: 1 });
  const calls = listTableCalls(before, asked);
  assert.deepEqual(calls, [{ kind: "status", text: "열기 52 · 벽까지 최소 10 · 판돈 300 · 남은 30초 · 심박 104" }]);
  assert.ok(!JSON.stringify(asked).includes("77"), "the drawn wall is not in the facts");
  assert.deepEqual(listTableCalls(asked, asked), [], "no new ask, no line");
  assert.deepEqual(listTableCalls(before, { ...asked, live: false }), [], "a closed window's ask is the slam's silence");
  // At the front of what waits: it answers the key just pressed.
  const queue = queueCalls([{ kind: "hold", text: "길게 눌러야 확정된다" }, { kind: "push", text: "열기 38 · 벽까지 최소 14" }], calls);
  assert.deepEqual(queue.map((call) => call.kind), ["status", "hold", "push"]);
  // A second ask before the first is said replaces it with the newer numbers.
  assert.deepEqual(queueCalls(queue, [{ kind: "status", text: "newer" }]).map((call) => call.text)[0], "newer");
});
