import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { installBrowser } from "./helpers/browser.mjs";
import { PIN, replayEngine } from "./helpers/engineReplay.mjs";

/**
 * The logic streak, as a shadow.
 *
 * The streak is counted on every settled window, saved with the run and
 * written into the log and the case summary, and it pays nothing: the switch
 * (`LOGIC` in tableRules.js) is off. Everything the switch turns on is written
 * and is tested here by passing the switch as an argument, never by reading
 * the shipped constant -- so these tests say the same thing on the day it is
 * flipped. The one test that reads the constant says what the build ships.
 */
installBrowser();
const { createElement } = await import("react");
const { renderToStaticMarkup } = await import("react-dom/server");
const { parseCurrentSavedState, isSavedStateShapeValid, SAVE_SCHEMA_VERSION } = await import("../../src/appConfig.js");
const { CASE_RESULT_NODES, CASE_SEQUENCE } = await import("../../src/gameCases.js");
const { nodes } = await import("../../src/gameData.js");
const { createCaseSummary, createLogicRecord, getRiskPressure, getSeasonLogic } = await import("../../src/gameLogic.js");
const engine = await import("../../src/gauntlet/gauntletEngine.js");
const {
  BASE_SCHEMA, carryTableRecordIntoRestore, createWindow, getFocusBonus, getHandBonus, HAND_CAP, normalizeRunState,
  openCaseRun, reduceWindow, resolveWindow, RUN_INITIAL_STATE, scoreFocus, serializeRunState, STANCE_CHARGE, VERDICT_CAUSES,
} = engine;
const { advanceLogic, getHeatTier, getLogicBonus, getLogicType, LOGIC_INITIAL, normalizeLogic } = await import("../../src/gauntlet/logicStreak.js");
const { HEAT_DEBT_GAUGE, LOCK_PRESS_SECONDS, LOGIC, LOGIC_CAP, LOGIC_HOLD, LOGIC_RATE, SEAL_BREAK_GAUGE } = await import("../../src/gauntlet/tableRules.js");
const { ALL_RULES, rulesFor, STORY_RULES } = await import("../../src/gauntlet/tableUnlocks.js");
const { addToRelicCodex, settleAgainstCodex } = await import("../../src/gauntlet/useRelicTable.js");
const { resourceMeta } = await import("../../src/appCopy.js");
const { initialRunState } = await import("../../src/state/runState.js");
const { repairSavedState } = await import("../../src/state/savedState.js");
const { getOfferedTypes, useChoiceCommit } = await import("../../src/state/useChoiceCommit.js");
const { createChoiceReaders } = await import("../../src/state/useDecision.js");
const { createSceneChallenge } = await import("../../src/viewModels/sceneViewModels.js");

const step = (caseId) => rulesFor(caseId, { staged: true });
const card = (type, extra = {}) => ({ id: `card-${type}`, label: type, effect: { capital: 6 }, cognition: { [type]: 2 }, next: "x", ...extra });
const WILD = { id: "__reframe__", type: "reframe", label: "다른 방법" };
/** A closed window at this heat: cashed, or bust. */
const closed = (gauge = 20, status = "cashed", extra = {}) => ({ status, cause: status === "cashed" ? "cash" : "push", gauge, wall: 90, pushes: 2, elapsed: 5, seed: `logic-${gauge}`, selectedId: "a", ...extra });
const COLD = 10;
const WARM = SEAL_BREAK_GAUGE;
const HOT = HEAT_DEBT_GAUGE;

/** Plays a string of settlements and hands back each verdict's line and the run after it. */
function play(moves, { run = RUN_INITIAL_STATE, rules = ALL_RULES, logic = false } = {}) {
  const lines = [];
  for (const move of moves) {
    const settled = resolveWindow({ run, window: move.window ?? closed(move.gauge ?? COLD), card: move.card, forced: move.forced, offered: move.offered, rules: move.rules ?? rules, logic });
    lines.push(settled.verdict.logic);
    run = settled.nextRun;
  }
  return { lines, run };
}

test("the build ships the streak as a shadow", () => {
  assert.equal(LOGIC, false, "the pot still reads the beat; day 6 flips this with the stage");
  assert.deepEqual(RUN_INITIAL_STATE.logic, { streak: 0, best: 0, type: null, held: 0, heat: 0, rose: false });
  assert.equal(RUN_INITIAL_STATE.logic, LOGIC_INITIAL);
  assert.ok(Object.isFrozen(LOGIC_INITIAL));
  assert.deepEqual([LOGIC_RATE, LOGIC_CAP, LOGIC_HOLD, LOCK_PRESS_SECONDS], [0.0625, 0.5, 3, 1.5]);
});

test("a card's type is the largest key of its cognition, and the wild card is 판 바꾸기", () => {
  assert.equal(getLogicType({ cognition: { inference: 1, risk: 3, persistence: 2 } }), "risk");
  assert.equal(getLogicType({ cognition: { inference: 2, reframing: 2 } }), "inference", "the earlier key on a tie, as the score reads it");
  assert.equal(getLogicType(WILD), "reframing");
  assert.equal(getLogicType({ type: "reframe", cognition: { risk: 9 } }), "reframing", "whatever a wild card carries");
  for (const none of [null, undefined, {}, { cognition: {} }, { cognition: null }]) assert.equal(getLogicType(none), null);
  // The same read the burst score takes of a logged entry (gameLogic's getGameplayStats).
  for (const cognition of [{ persistence: 1, inference: 1 }, { risk: 2, reframing: 3 }, { inference: 2, reframing: 1 }]) {
    assert.equal(getLogicType({ cognition }), Object.entries(cognition).sort((a, b) => b[1] - a[1])[0][0]);
  }
  // Every card of the season has a type, so no scene is one the streak cannot read.
  const untyped = Object.values(nodes).flatMap((node) => node.choices ?? []).filter((choice) => !getLogicType(choice));
  assert.deepEqual(untyped.map((choice) => choice.id), []);
});

test("the heat a window closed in is a tier: under 30, from 30, from 60, and a bust", () => {
  assert.deepEqual([SEAL_BREAK_GAUGE, HEAT_DEBT_GAUGE], [30, 60], "the engine's own two lines");
  assert.deepEqual([0, 29.99, 30, 59.99, 60, 100].map((gauge) => getHeatTier("cash", gauge)), [0, 0, 1, 1, 2, 2]);
  for (const gauge of [0, 45, 100]) assert.equal(getHeatTier("bust", gauge), 3);
});

test("the first card builds, a held type grows the streak from the third window", () => {
  const { lines, run } = play([{ card: card("risk") }, { card: card("risk") }, { card: card("risk") }, { card: card("risk") }]);
  assert.deepEqual(lines.map((line) => line.move), ["build", "build", "grow", "grow"]);
  assert.deepEqual(lines.map((line) => line.streak), [0, 0, 1, 2]);
  assert.deepEqual(lines.map((line) => line.type), ["risk", "risk", "risk", "risk"]);
  assert.deepEqual(run.logic, { streak: 2, best: 2, type: "risk", held: 4, heat: 0, rose: false });
});

test("changing type when the pressure rose is a switch: the streak grows and the hold starts again", () => {
  // Cold, cold, then a warm close: the pressure has risen going into the fourth window.
  const { lines, run } = play([{ card: card("risk") }, { card: card("risk") }, { card: card("risk"), gauge: WARM }, { card: card("inference"), gauge: WARM }]);
  assert.deepEqual(lines.map((line) => line.rose), [false, false, false, true], "`rose` is what the window was played under");
  assert.deepEqual(lines.at(-1), { type: "inference", tier: 1, rose: true, move: "switch", streak: 2 });
  assert.deepEqual(run.logic, { streak: 2, best: 2, type: "inference", held: 1, heat: 1, rose: false });
  // Holding through the same rise grows it as any held window does.
  const held = play([{ card: card("risk") }, { card: card("risk") }, { card: card("risk"), gauge: WARM }, { card: card("risk"), gauge: WARM }]);
  assert.deepEqual(held.lines.at(-1), { type: "risk", tier: 1, rose: true, move: "grow", streak: 2 });
});

test("changing type because the held one was not on the table keeps the streak; changing for no reason ends it", () => {
  const grown = play([{ card: card("risk") }, { card: card("risk") }, { card: card("risk") }, { card: card("risk") }]).run;
  assert.equal(grown.logic.streak, 2);
  const kept = play([{ card: card("inference"), offered: ["inference", "persistence"] }], { run: grown });
  assert.deepEqual(kept.lines[0], { type: "inference", tier: 0, rose: false, move: "keep", streak: 2 });
  assert.deepEqual(kept.run.logic, { streak: 2, best: 2, type: "inference", held: 1, heat: 0, rose: false });
  const broken = play([{ card: card("inference"), offered: ["inference", "risk"] }], { run: grown });
  assert.deepEqual(broken.lines[0], { type: "inference", tier: 0, rose: false, move: "break", streak: 0 });
  assert.deepEqual(broken.run.logic, { streak: 0, best: 2, type: "inference", held: 1, heat: 0, rose: false });
  // A caller that does not say what was on the table cannot claim the type was missing.
  assert.equal(play([{ card: card("inference") }], { run: grown }).lines[0].move, "break");
  // When the pressure rose the change is a switch whatever was on the table.
  const risen = { ...grown, logic: { ...grown.logic, rose: true } };
  assert.equal(play([{ card: card("inference"), offered: ["inference"] }], { run: risen }).lines[0].move, "switch");
});

test("a bust ends the streak, and the hold follows the card that was played", () => {
  const grown = play([{ card: card("risk") }, { card: card("risk") }, { card: card("risk") }]).run;
  const bust = play([{ card: card("risk"), window: closed(70, "bust") }], { run: grown });
  assert.deepEqual(bust.lines[0], { type: "risk", tier: 3, rose: false, move: "bust", streak: 0 });
  assert.deepEqual(bust.run.logic, { streak: 0, best: 1, type: "risk", held: 4, heat: 3, rose: true });
  const other = play([{ card: card("inference"), window: closed(70, "bust") }], { run: grown });
  assert.deepEqual(other.run.logic, { streak: 0, best: 1, type: "inference", held: 1, heat: 3, rose: true });
  // 앙코르 does not hold it yet: the relic is given that meaning on day 6, through `bustHolds`.
  const encore = play([{ card: card("risk"), window: closed(70, "bust") }], { run: { ...grown, relics: ["encore"] } });
  assert.equal(encore.lines[0].streak, 0);
  const seam = advanceLogic(grown.logic, { type: "risk", tier: 3, bustHolds: true });
  assert.deepEqual([seam.move, seam.logic.streak], ["bust", 1], "the seam: a bust that is held leaves the streak standing");
});

test("a window run out with nothing staked is a bust like any other, and the room's card is not the hand's pick", () => {
  const grown = play([{ card: card("risk") }, { card: card("risk") }, { card: card("risk") }, { card: card("risk") }]).run;
  assert.deepEqual([grown.logic.streak, grown.logic.held], [2, 4]);
  const timeout = closed(50, "bust", { cause: "timeout", selectedId: null });
  const forced = play([{ card: card("inference"), forced: true, window: timeout }], { run: grown });
  assert.deepEqual(forced.lines[0], { type: null, tier: 3, rose: false, move: "bust", streak: 0 }, "letting the clock run out does not spare the streak");
  assert.deepEqual(forced.run.logic, { ...grown.logic, streak: 0, heat: 3, rose: true }, "and what the hand was holding is left as it was");
  // So the hand picks up its hold where it left it: the next card of its type grows at once.
  assert.deepEqual(play([{ card: card("risk") }], { run: forced.run }).lines[0], { type: "risk", tier: 0, rose: true, move: "grow", streak: 1 });
  // The same for a bust with no card at all, and for a hand that had not picked anything yet.
  assert.deepEqual(play([{ card: undefined, window: timeout }], { run: grown }).run.logic, forced.run.logic);
  const first = play([{ card: card("risk"), forced: true, window: timeout }]);
  assert.deepEqual([first.lines[0].move, first.run.logic.type, first.run.logic.held], ["bust", null, 0]);
  // 앙코르's seam spares the streak on this bust as on any.
  const held = advanceLogic(grown.logic, { type: null, tier: 3, bustHolds: true });
  assert.deepEqual([held.move, held.logic.streak, held.logic.held], ["bust", 2, 4]);
  // The room only ever plays a card on a bust. A window settled with no pick and no bust -- nothing
  // the game does, but the function is asked -- is nothing the hand did.
  const cardless = play([{ card: undefined }, { card: { id: "bare", effect: { capital: 3 } } }, { card: card("inference"), forced: true }], { run: grown });
  assert.deepEqual(cardless.lines.map((line) => [line.type, line.move, line.streak]), [[null, "none", 2], [null, "none", 2], [null, "none", 2]]);
  assert.deepEqual(cardless.run.logic, grown.logic);
});

test("the wild card is played as 판 바꾸기", () => {
  const { lines, run } = play([{ card: WILD }, { card: card("reframing") }, { card: WILD }]);
  assert.deepEqual(lines.map((line) => [line.type, line.move]), [["reframing", "build"], ["reframing", "build"], ["reframing", "grow"]]);
  assert.equal(run.logic.streak, 1);
});

test("in a case that does not have the rule yet the streak is neither added to nor taken", () => {
  assert.equal(step("prologue01").has("beat"), false, "프롤로그 01 is before the step the streak lives on");
  assert.equal(step("prologue02").has("beat"), true);
  const grown = play([{ card: card("risk") }, { card: card("risk") }, { card: card("risk") }]).run;
  const off = play([{ card: card("inference") }, { card: card("risk"), window: closed(70, "bust") }, { card: card("risk"), gauge: HOT }], { run: grown, rules: step("prologue01") });
  assert.deepEqual(off.lines.map((line) => [line.type, line.move, line.streak]), [[null, "none", 1], [null, "none", 1], [null, "none", 1]]);
  assert.deepEqual(off.lines.map((line) => line.tier), [0, 3, 2], "the heat is the table's and is read under any rules");
  assert.deepEqual(off.run.logic, { ...grown.logic, heat: 2, rose: false });
  // Story mode and every later step have the rule.
  for (const rules of [STORY_RULES, step("prologue02"), step("prologue04"), ALL_RULES]) {
    assert.equal(play([{ card: card("risk") }], { run: grown, rules }).lines[0].move, "grow");
  }
});

test("the pressure rose when the last window closed in a higher tier than the one before it", () => {
  const gauges = [COLD, WARM, WARM, HOT, COLD, WARM];
  const { lines, run } = play(gauges.map((gauge) => ({ card: card("risk"), gauge })));
  assert.deepEqual(lines.map((line) => line.tier), [0, 1, 1, 2, 0, 1]);
  assert.deepEqual(lines.map((line) => line.rose), [false, false, true, false, true, false]);
  assert.deepEqual([run.logic.heat, run.logic.rose], [1, true], "and the run says so to the window about to be played");
  // A bust is the highest tier, so the window after one is always played under a rise -- unless it follows another.
  const busts = play([{ card: card("risk"), window: closed(40, "bust") }, { card: card("risk"), window: closed(40, "bust") }, { card: card("risk") }, { card: card("risk") }]);
  assert.deepEqual(busts.lines.map((line) => line.rose), [false, true, false, false]);
});

test("the streak and the heat carry across a case boundary", () => {
  let run = openCaseRun(RUN_INITIAL_STATE, { rules: ALL_RULES });
  run = play([{ card: card("risk") }, { card: card("risk") }, { card: card("risk") }], { run }).run;
  const closing = resolveWindow({ run, window: closed(WARM), card: card("risk"), caseClosed: true });
  assert.deepEqual(closing.verdict.logic, { type: "risk", tier: 1, rose: false, move: "grow", streak: 2 });
  const next = openCaseRun(closing.nextRun, { rules: ALL_RULES });
  assert.deepEqual(next.logic, { streak: 2, best: 2, type: "risk", held: 4, heat: 1, rose: true });
  assert.equal(next.runPot, 0, "the pot is the case's; the streak is the season's, as the beat's combo is");
  const first = resolveWindow({ run: next, window: closed(COLD), card: card("inference") });
  assert.deepEqual(first.verdict.logic, { type: "inference", tier: 0, rose: true, move: "switch", streak: 3 });
  // A case abandoned and opened again, and a run written out and read back, hold it too.
  assert.deepEqual(openCaseRun(serializeRunState(run), { rules: step("prologue03") }).logic, run.logic);
  assert.deepEqual(normalizeRunState(JSON.parse(JSON.stringify(serializeRunState(closing.nextRun)))).logic, closing.nextRun.logic);
});

test("a replayed case borrows the streak and hands it back", () => {
  const season = play([{ card: card("risk") }, { card: card("risk") }, { card: card("risk") }, { card: card("risk"), gauge: WARM }]).run;
  const held = { ...season.logic };
  const practice = openCaseRun(season, { replayOf: { pushRecord: { busts: 1, cashes: 5 } }, rules: ALL_RULES });
  assert.deepEqual(practice.practice.logic, held, "the streak as it stood when the replay opened");
  assert.deepEqual(practice.logic, held, "and the replay plays on from it");
  const played = play([{ card: card("risk") }, { card: card("inference") }, { card: card("inference"), window: closed(60, "bust") }], { run: practice });
  assert.deepEqual(played.lines.map((line) => line.move), ["grow", "break", "bust"], "the replay's windows are settled like any");
  assert.notDeepEqual(played.run.logic, held);
  const closing = resolveWindow({ run: played.run, window: closed(COLD), card: card("persistence"), caseClosed: true });
  assert.equal(closing.verdict.practice, true);
  assert.deepEqual(closing.nextRun.logic, held, "handed back when the replay closes");
  assert.equal(closing.nextRun.practice, null);
  // And when it is left half way for another case.
  assert.deepEqual(openCaseRun(played.run, { rules: ALL_RULES }).logic, held);
  // A replay saved before the streak existed has none to hand back, and takes nothing.
  const { logic: _none, ...oldPractice } = practice.practice;
  const old = normalizeRunState({ ...played.run, practice: oldPractice });
  assert.equal("logic" in old.practice, false);
  assert.deepEqual(openCaseRun(old, { rules: ALL_RULES }).logic, played.run.logic);
});

test("a slot restored after a bust takes the streak and keeps the longest it has been", () => {
  const atSlot = play([{ card: card("risk") }, { card: card("risk") }, { card: card("risk") }, { card: card("risk") }]).run;
  const save = (run, log = []) => ({ runId: "run-a", currentCase: "case01", log, resources: {}, dynamics: serializeRunState(run) });
  const grownOn = play([{ card: card("risk") }, { card: card("risk") }], { run: atSlot }).run;
  assert.equal(grownOn.logic.best, 4);
  // No bust since the slot: the slot's streak stands, the record is the longest either saw.
  const clean = carryTableRecordIntoRestore(save(atSlot), save(grownOn)).dynamics;
  assert.deepEqual(clean.logic, { ...atSlot.logic, best: 4 });
  // A bust since: the streak is gone, as the pot and the beat's combo are.
  const bust = play([{ card: card("risk"), window: closed(70, "bust") }], { run: grownOn }).run;
  const restored = carryTableRecordIntoRestore(save(atSlot), save(bust)).dynamics;
  assert.deepEqual(restored.logic, { ...atSlot.logic, streak: 0, best: 4 });
  assert.equal(restored.beatCombo, 0);
  // Another run's save, or one that is not ahead, is left alone.
  assert.deepEqual(carryTableRecordIntoRestore(save(atSlot), { ...save(bust), runId: "run-b" }).dynamics.logic, atSlot.logic);
});

test("a saved streak is read back whole, and anything else reads as none", () => {
  const logic = { streak: 5, best: 9, type: "risk", held: 3, heat: 2, rose: true };
  assert.deepEqual(normalizeLogic(logic), logic);
  assert.deepEqual(normalizeRunState({ logic }).logic, logic);
  for (const none of [undefined, null, "streak", 7, []]) assert.deepEqual(normalizeLogic(none), LOGIC_INITIAL);
  assert.deepEqual(normalizeLogic({ streak: -3, best: "x", type: 4, held: 2.9, heat: 9, rose: "yes" }), { streak: 0, best: 0, type: null, held: 2, heat: 3, rose: false });
});

/* ------------------------------------------------------------ old saves */

const SAVES = new URL("./fixtures/saves/", import.meta.url);
const load = (save) => {
  const parsed = parseCurrentSavedState(JSON.stringify(save), SAVE_SCHEMA_VERSION);
  const { state, repaired } = repairSavedState(parsed);
  return { state, repaired, valid: isSavedStateShapeValid(state) };
};

for (const name of readdirSync(SAVES).filter((file) => file.endsWith(".json")).sort()) {
  test(`${name}, written before the streak, loads with one not yet begun and no new repair`, () => {
    const fixture = JSON.parse(readFileSync(new URL(name, SAVES), "utf8"));
    assert.equal(JSON.stringify(fixture.save).includes('"logic"'), false, "the fixture is a save from before the streak");
    const { state, repaired, valid } = load(fixture.save);
    assert.equal(valid, true);
    if ("repaired" in fixture.expect) assert.equal(repaired, fixture.expect.repaired, "the streak adds no repair of its own");
    assert.deepEqual(normalizeRunState(state.dynamics).logic, LOGIC_INITIAL);
    if (fixture.save.dynamics && !repaired) {
      assert.deepEqual(state.dynamics.logic, { ...LOGIC_INITIAL });
      // Every key the save held is written back as it was: the beat's among them.
      for (const key of ["beatCombo", "bestCombo", "runGroove", "grooveVault"]) {
        if (key in fixture.save.dynamics) assert.equal(state.dynamics[key], fixture.save.dynamics[key], key);
      }
      if (fixture.save.dynamics.suspended) assert.deepEqual(state.dynamics.suspended, fixture.save.dynamics.suspended);
    }
    // Loaded, saved and loaded again, it is the same save and still not a repair.
    const again = load(JSON.parse(JSON.stringify({ ...state, lastError: undefined, paused: false })));
    assert.equal(again.repaired, false);
    assert.deepEqual(again.state.dynamics, state.dynamics);
  });
}

test("a save that carries a streak is not called repaired, with or without a replay in it", () => {
  const current = JSON.parse(readFileSync(new URL("v2-current.json", SAVES), "utf8")).save;
  const logic = { streak: 4, best: 11, type: "persistence", held: 6, heat: 2, rose: true };
  const run = normalizeRunState({ ...current.dynamics, logic });
  const saved = load({ ...current, dynamics: serializeRunState(run) });
  assert.equal(saved.repaired, false);
  assert.deepEqual(saved.state.dynamics.logic, logic);
  const replay = openCaseRun(run, { replayOf: { pushRecord: { busts: 0 } }, rules: ALL_RULES });
  const midReplay = load({ ...current, dynamics: JSON.parse(JSON.stringify(serializeRunState(replay))) });
  assert.equal(midReplay.repaired, false);
  assert.deepEqual(midReplay.state.dynamics.practice.logic, logic);
});

/* ------------------------------------------------------- the commit */

function sceneContext(nodeId, overrides = {}) {
  const node = nodes[nodeId];
  const run = initialRunState(null, { runId: "run-logic", operatorOrigin: "courier", sessionId: "logic-session", now: 1_760_000_000_000, openRecovery: false });
  const did = { patches: [], rankingRows: [], queued: [] };
  let codex = { unlocked: [] };
  const context = {
    currentCase: node.caseId, fallbackCaseId: node.caseId, resolvedNodeId: nodeId, node,
    resources: run.resources, triggers: run.triggers, cognition: run.cognition, log: [], caseResults: {}, completedCases: [],
    discoveredClues: [], gauntletRun: run.gauntletRun,
    relicTable: { settle: (settlement) => settleAgainstCodex(settlement, codex.unlocked), keepUnlocks: (unlocked) => { codex = addToRelicCodex(codex, unlocked); } },
    nodeEnteredAt: Date.now() - 9_000, currentCaseReframeCount: 0, runId: "run-logic", sessionId: "logic-session", sessionCode: "LOGIC1",
    playerName: "분석관", activeCaseMeta: null, dataConsent: false, staleSave: false, clueCount: 0, casesOpened: 0,
    applyRun: (patch) => { did.patches.push(patch); return { saved: true }; },
    appendLocalRankingRow: (row) => { did.rankingRows.push(row); return { rows: did.rankingRows, saved: true }; },
    queueTelemetry: (item) => did.queued.push(item), setSaveStatus: () => {}, setTelemetryStatus: () => {}, onSeasonFinal: () => {},
    ...overrides,
  };
  context.riskPressure = getRiskPressure(context.resources);
  context.sceneChallenge = createSceneChallenge({ reframeChoice: null, reframeCombo: 0, inheritedChallenge: null, node, riskPressure: context.riskPressure });
  context.readers = createChoiceReaders({ sceneChallenge: context.sceneChallenge, resources: context.resources, log: context.log, riskPressure: context.riskPressure, discoveredClues: [], currentCase: context.currentCase, resourceMeta });
  return { context, did };
}

function commit(context, ...args) {
  let api = null;
  const Probe = () => {
    api = useChoiceCommit(context);
    return null;
  };
  renderToStaticMarkup(createElement(Probe));
  api.choose(...args);
}

const cashed = (seed, gauge = 30) => reduceWindow({ ...createWindow({ schema: BASE_SCHEMA, seed }), selectedId: "a", gauge, pushes: 3, elapsed: 6 }, { type: "CASH" });

test("the commit copies the verdict's line onto the log entry, under the case's own rules", () => {
  // 프롤로그 02 is the first case with the rule; the run opens there with a type already held.
  const sceneId = Object.keys(nodes).find((id) => nodes[id].caseId === "prologue02" && (nodes[id].choices ?? []).filter((choice) => choice.type !== "reframe").length >= 2);
  const scene = nodes[sceneId];
  const picked = scene.choices.find((choice) => choice.type !== "reframe");
  const type = getLogicType(picked);
  const holding = (logic) => ({ gauntletRun: normalizeRunState({ ...RUN_INITIAL_STATE, logic: { ...LOGIC_INITIAL, ...logic } }) });

  const { context, did } = sceneContext(sceneId, holding({ type, held: 2, streak: 3, best: 3 }));
  commit(context, picked, cashed("commit-grow"));
  const [patch] = did.patches;
  const entry = patch.log[0];
  assert.deepEqual(entry.threshold.logic, { type, tier: 1, rose: false, move: "grow", streak: 4 });
  assert.deepEqual(entry.threshold.logic, patch.decisionReveal.verdict.logic);
  assert.deepEqual(patch.gauntletRun.logic, { streak: 4, best: 4, type, held: 3, heat: 1, rose: true });
  assert.equal(entry.threshold.tempo.groove, 0, "and everything the entry held before is still on it");

  // A type the scene does not deal is one the hand could not have held: the streak is kept.
  const offered = getOfferedTypes(scene, { clueCount: 0, trust: 50, legitimacy: 50, casesOpened: 0 });
  const absent = ["persistence", "inference", "risk", "reframing"].find((candidate) => !offered.includes(candidate));
  if (absent) {
    const kept = sceneContext(sceneId, holding({ type: absent, held: 5, streak: 3, best: 3 }));
    commit(kept.context, picked, cashed("commit-keep"));
    assert.equal(kept.did.patches[0].log[0].threshold.logic.move, "keep");
  }
  // One it does deal, left for no reason: the streak ends.
  const other = offered.find((candidate) => candidate !== type);
  const broke = sceneContext(sceneId, holding({ type: other, held: 5, streak: 3, best: 3 }));
  commit(broke.context, picked, cashed("commit-break"));
  assert.deepEqual([broke.did.patches[0].log[0].threshold.logic.move, broke.did.patches[0].gauntletRun.logic.streak], ["break", 0]);

  // A card the room played is not the hand's pick.
  const forced = sceneContext(sceneId, holding({ type: other, held: 5, streak: 3, best: 3 }));
  commit(forced.context, picked, { ...cashed("commit-forced"), status: "bust", cause: "timeout" }, true);
  assert.deepEqual(forced.did.patches[0].log[0].threshold.logic, { type: null, tier: 3, rose: false, move: "bust", streak: 0 });
  assert.deepEqual([forced.did.patches[0].gauntletRun.logic.type, forced.did.patches[0].gauntletRun.logic.held], [other, 5], "what the hand was holding is left as it was");

  // 프롤로그 01 does not have the rule: its entries say so and its summary carries no record.
  const first = sceneContext("p1_start", holding({ type: "risk", held: 2, streak: 3, best: 3 }));
  commit(first.context, first.context.node.choices[0], cashed("commit-off"));
  assert.deepEqual(first.did.patches[0].log[0].threshold.logic, { type: null, tier: 1, rose: false, move: "none", streak: 3 });
});

test("what a scene has on the table is its cards' types, the wild one among them, less any card the player cannot play", () => {
  const scene = { choices: [card("risk"), card("inference"), card("risk"), WILD] };
  const standing = { clueCount: 0, trust: 50, legitimacy: 50, casesOpened: 9 };
  assert.deepEqual(getOfferedTypes(scene, standing), ["risk", "inference", "reframing"]);
  const gated = Object.values(nodes).flatMap((node) => node.choices ?? []).find((choice) => choice.requiredAuthority);
  assert.ok(gated, "the season still deals a card behind an authority gate");
  const newcomer = { clueCount: 0, trust: 0, legitimacy: 0, casesOpened: 0 };
  assert.deepEqual(getOfferedTypes({ choices: [card("risk"), { ...gated, cognition: { persistence: 3 } }] }, newcomer), ["risk"]);
  assert.deepEqual(getOfferedTypes(null, standing), []);
  assert.deepEqual(getOfferedTypes({}, standing), []);
});

/* ------------------------------------------------------ the record */

const entry = (logic, extra = {}) => ({ caseId: "case07", threshold: { busted: logic?.move === "bust", ...(logic ? { logic } : {}) }, ...extra });
const CASE_LOG = [
  entry({ type: "risk", tier: 0, rose: false, move: "build", streak: 0 }),
  entry({ type: "risk", tier: 1, rose: false, move: "build", streak: 0 }),
  entry({ type: "risk", tier: 1, rose: true, move: "grow", streak: 1 }),
  entry({ type: "inference", tier: 2, rose: false, move: "keep", streak: 1 }),
  entry({ type: null, tier: 3, rose: true, move: "none", streak: 1 }),
  entry({ type: "inference", tier: 0, rose: true, move: "build", streak: 1 }),
  entry({ type: "persistence", tier: 2, rose: false, move: "break", streak: 0 }),
  entry({ type: "risk", tier: 2, rose: true, move: "switch", streak: 1 }),
  entry({ type: "risk", tier: 3, rose: false, move: "bust", streak: 0 }),
];

test("the case's logic record is built from its log", () => {
  assert.deepEqual(createLogicRecord(CASE_LOG), { windows: 8, heat: 11, peak: 3, top: ["risk", 5], grows: 1, switches: 1, breaks: 1, busts: 1, keeps: 1, best: 1 });
  // A window whose verdict made no move is not one of the record's windows.
  assert.equal(createLogicRecord([entry({ type: null, tier: 3, rose: false, move: "none", streak: 4 })]), null);
  // A window run out with nothing staked is: a bust, with no type to count.
  assert.deepEqual(
    createLogicRecord([entry({ type: "risk", tier: 1, rose: false, move: "grow", streak: 3 }), entry({ type: null, tier: 3, rose: false, move: "bust", streak: 0 })]),
    { windows: 2, heat: 4, peak: 3, top: ["risk", 1], grows: 1, switches: 0, breaks: 0, busts: 1, keeps: 0, best: 3 },
  );
  assert.deepEqual(createLogicRecord([entry({ type: null, tier: 3, rose: false, move: "bust", streak: 0 })]), { windows: 1, heat: 3, peak: 3, top: null, grows: 0, switches: 0, breaks: 0, busts: 1, keeps: 0, best: 0 });
  // Ties in the most-picked type go to the one that got there first.
  assert.deepEqual(createLogicRecord([entry({ type: "risk", tier: 0, move: "build", streak: 0 }), entry({ type: "inference", tier: 0, move: "break", streak: 0 })]).top, ["risk", 1]);
  // A log from before the streak, a move this build does not know, and no log at all are no record.
  for (const log of [[], undefined, [{ threshold: { busted: false, tempo: {} } }, { isSystemEvent: true }, null], [entry({ type: "risk", tier: 1, move: "leap", streak: 2 })], [entry("grow")]]) {
    assert.equal(createLogicRecord(log), null);
  }
  const summary = createCaseSummary({}, {}, CASE_LOG, { resources: {} });
  assert.deepEqual(summary.logicRecord, createLogicRecord(CASE_LOG));
  assert.equal("logicRecord" in createCaseSummary({}, {}, [{ caseId: "old", threshold: { busted: false } }], { resources: {} }), false, "an old case reads as no record");
});

test("a replayed case keeps the record of its first close", () => {
  const first = { logicRecord: { windows: 6, heat: 4, peak: 2, top: ["inference", 4], grows: 2, switches: 0, breaks: 1, busts: 0, keeps: 0, best: 2 } };
  assert.deepEqual(createCaseSummary({}, {}, CASE_LOG, { resources: {}, replayOf: first }).logicRecord, first.logicRecord);
  // A first close from before the streak had none, and the replay does not write one over it.
  assert.equal("logicRecord" in createCaseSummary({}, {}, CASE_LOG, { resources: {}, replayOf: { rank: "B" } }), false);
  assert.deepEqual(createCaseSummary({}, {}, CASE_LOG, { resources: {}, replayOf: null }).logicRecord, createLogicRecord(CASE_LOG));
});

test("the season's two numbers: the share of windows where the streak could have ended and did not, and the longest streak", () => {
  const record = (values) => ({ logicRecord: { windows: 0, heat: 0, peak: 0, top: null, grows: 0, switches: 0, breaks: 0, busts: 0, keeps: 0, best: 0, ...values } });
  const season = { a: record({ windows: 10, keeps: 2, breaks: 1, busts: 1, best: 7 }), b: record({ windows: 8, keeps: 0, breaks: 2, busts: 0, best: 12 }), old: { rank: "A" }, gone: null };
  // (18 - 2 keeps - 3 breaks - 1 bust) of (18 - 2 keeps): 12 of 16.
  assert.deepEqual(getSeasonLogic(season), { logicHold: 75, bestLogic: 12 });
  assert.deepEqual(getSeasonLogic({ a: record({ windows: 3, keeps: 0, breaks: 0, busts: 0, best: 1 }) }), { logicHold: 100, bestLogic: 1 });
  assert.deepEqual(getSeasonLogic({ a: record({ windows: 4, breaks: 3, busts: 1 }) }), { logicHold: 0, bestLogic: 0 });
  assert.deepEqual(getSeasonLogic({ a: record({ windows: 3, breaks: 2 }) }), { logicHold: 33, bestLogic: 0 }, "rounded to a whole point");
  // No window that could have ended a streak: no hold, and the best streak still stands.
  assert.deepEqual(getSeasonLogic({ a: record({ windows: 2, keeps: 2, best: 5 }) }), { bestLogic: 5 });
  // No record anywhere -- a season from before the streak -- carries neither.
  for (const none of [{}, undefined, null, { old: { rank: "A" }, older: { logicRecord: "x" } }]) assert.deepEqual(getSeasonLogic(none), {});
  // A record that says more broke than there were windows cannot take the number out of its range.
  assert.equal(getSeasonLogic({ a: record({ windows: 2, breaks: 9 }) }).logicHold, 0);
});

test("the finale's summary carries the season's numbers, and a season without records carries none", () => {
  const finaleId = Object.keys(nodes).find((id) => nodes[id].caseId === "final" && nodes[id].choices?.some((choice) => choice.next === CASE_RESULT_NODES.final));
  const closing = nodes[finaleId].choices.find((choice) => choice.next === CASE_RESULT_NODES.final);
  const earlier = CASE_SEQUENCE.filter((caseId) => caseId !== "final");
  const type = getLogicType(closing);
  const recorded = Object.fromEntries(earlier.map((caseId, index) => [caseId, {
    burstScore: 60, rank: "B",
    ...(index % 2 ? { logicRecord: { windows: 8, heat: 6, peak: 2, top: ["risk", 5], grows: 4, switches: 1, breaks: 1, busts: 1, keeps: 1, best: 3 + index } } : {}),
  }]));
  const holding = normalizeRunState({ ...RUN_INITIAL_STATE, logic: { ...LOGIC_INITIAL, type, held: 4, streak: 2, best: 2 } });
  const season = sceneContext(finaleId, { completedCases: earlier, caseResults: recorded, gauntletRun: holding });
  commit(season.context, closing, cashed("finale"));
  const summary = season.did.patches[0].caseResults.final;
  assert.deepEqual(summary.logicRecord, { windows: 1, heat: 1, peak: 1, top: [type, 1], grows: 1, switches: 0, breaks: 0, busts: 0, keeps: 0, best: 3 });
  const records = Object.values({ ...recorded, final: summary }).filter((result) => result.logicRecord).length;
  const windows = (records - 1) * 8 + 1;
  const keeps = records - 1;
  assert.equal(summary.logicHold, Math.round((100 * (windows - keeps - 2 * (records - 1))) / (windows - keeps)));
  assert.equal(summary.bestLogic, 3 + (earlier.length - 1 - ((earlier.length - 1) % 2 ? 0 : 1)));
  assert.ok(summary.logicHold >= 0 && summary.logicHold <= 100);
  // The row this device ranks the season with carries them at the top level, as numbers.
  const row = season.did.rankingRows.find((ranked) => ranked.case_id === "season-final");
  assert.deepEqual([typeof row.summary.logicHold, typeof row.summary.bestLogic], ["number", "number"]);

  // A season whose cases were all closed before the streak: only the finale has a record.
  const plain = Object.fromEntries(earlier.map((caseId) => [caseId, { burstScore: 60, rank: "B" }]));
  const old = sceneContext(finaleId, { completedCases: earlier, caseResults: plain, gauntletRun: holding });
  commit(old.context, closing, cashed("finale-old"));
  assert.deepEqual([old.did.patches[0].caseResults.final.logicHold, old.did.patches[0].caseResults.final.bestLogic], [100, 3]);
  // And one with no record at all -- the finale itself replayed over a summary from before -- carries neither key.
  const replayed = sceneContext(finaleId, { completedCases: [...earlier, "final"], caseResults: { ...plain, final: { burstScore: 70, rank: "A" } }, gauntletRun: holding });
  commit(replayed.context, closing, cashed("finale-replayed"));
  const again = replayed.did.patches[0].caseResults.final;
  assert.deepEqual(["logicRecord" in again, "logicHold" in again, "bestLogic" in again], [false, false, false]);
});

/* ------------------------------------------- behind the switch: on */

test("with the switch on, the streak pays 1 + min(0.5, streak x 0.0625) and the hand is capped as it was", () => {
  assert.deepEqual([0, 1, 4, 8, 9, 40].map(getLogicBonus), [1, 1.0625, 1.25, 1.5, 1.5, 1.5]);
  assert.deepEqual([-2, null, undefined, "x"].map(getLogicBonus), [1, 1, 1, 1]);
  assert.equal(HAND_CAP, 1.5);
  for (let streak = 0; streak <= 12; streak += 1) {
    for (const mode of ["strike", "steady", "expose"]) {
      for (const focus of [0, 35, 70, 100]) {
        const expected = Math.round(Math.min(HAND_CAP, getLogicBonus(streak) * getFocusBonus(focus, mode).pot) * 100) / 100;
        assert.equal(getHandBonus(0, focus, mode, streak), expected, `streak ${streak}, ${mode} at ${focus}`);
        assert.ok(getHandBonus(0, focus, mode, streak) <= HAND_CAP);
      }
    }
  }
  // Left out, the hand is the groove's, as it has always been called.
  assert.equal(getHandBonus(10, 0, "strike"), 1.3);
  assert.equal(getHandBonus(0, 0, "strike"), 1);
});

test("with the switch on, the pot is paid on the streak the card made; with it off, the same streak pays nothing", () => {
  const run = normalizeRunState({ ...RUN_INITIAL_STATE, logic: { ...LOGIC_INITIAL, type: "risk", held: 5, streak: 3, best: 3 } });
  const window = closed(44);
  const off = resolveWindow({ run, window, card: card("risk"), logic: false });
  const on = resolveWindow({ run, window, card: card("risk"), logic: true });
  const base = Math.round(off.verdict.chips * off.verdict.multiplier);
  assert.equal(off.verdict.pot, base, "off: the streak is counted and the pot does not read it");
  assert.equal(on.verdict.logic.streak, 4);
  assert.equal(on.verdict.pot, Math.round(off.verdict.chips * off.verdict.multiplier * 1.25), "on: 1 + 4 x 0.0625");
  assert.deepEqual(on.verdict.logic, off.verdict.logic, "the line of the verdict is the same either way");
  assert.deepEqual(on.nextRun.logic, off.nextRun.logic);
  assert.equal(on.verdict.tempo.groovePot, on.verdict.pot - base, "the hand's share is told apart as the groove's was");
  assert.equal(on.nextRun.runGroove, on.verdict.pot - base);
  assert.equal(on.verdict.focus.potMultiplier, 1);
  // A card that ends the streak is paid as a bare one, and a bust pays nothing either way.
  assert.equal(resolveWindow({ run, window, card: card("inference"), offered: ["risk", "inference"], logic: true }).verdict.pot, base);
  assert.equal(resolveWindow({ run, window: closed(44, "bust"), card: card("risk"), logic: true }).verdict.pot, 0);
  // At a streak of 8 and past it the pot is at the cap, with or without a full LOCK.
  const capped = normalizeRunState({ ...run, logic: { ...run.logic, streak: 30, best: 30 } });
  assert.equal(resolveWindow({ run: capped, window, card: card("risk"), logic: true }).verdict.pot, Math.round(base * HAND_CAP));
  const locked = resolveWindow({ run: capped, window: { ...window, focus: 100, focusHits: 5 }, card: card("risk"), logic: true });
  assert.equal(locked.verdict.pot, Math.round(base * HAND_CAP));
  assert.equal(locked.verdict.focus.pot, 0, "LOCK adds nothing over a streak already at the cap");
  // In a case without the rule the streak neither moves nor pays more than it stood at.
  const prologue = resolveWindow({ run, window, card: card("inference"), rules: step("prologue01"), logic: true });
  assert.deepEqual([prologue.verdict.logic.move, prologue.nextRun.logic.streak], ["none", 3]);
});

test("a window saved in the middle of a beat and picked up after the flip is paid the larger of the two", () => {
  const window = closed(44, "cashed", { groove: 10, beatCombo: 4, maxCombo: 4, beatHits: 4 });
  const run = (streak) => normalizeRunState({ ...RUN_INITIAL_STATE, logic: { ...LOGIC_INITIAL, type: "risk", held: 5, streak, best: streak } });
  const base = (settled) => Math.round(settled.verdict.chips * settled.verdict.multiplier);
  // Groove 10 is x1.3; a streak of 2 (after this card) is x1.125: the pot the player saw stands.
  const low = resolveWindow({ run: run(1), window, card: card("risk"), logic: true });
  assert.equal(low.verdict.pot, Math.round(base(low) * 1.3));
  // A streak of 7 (after this card) is x1.4375: the streak is the larger.
  const high = resolveWindow({ run: run(6), window, card: card("risk"), logic: true });
  assert.equal(high.verdict.pot, Math.round(base(high) * 1.44));
  assert.equal(getHandBonus(10, 0, "strike", 2), 1.3);
  assert.equal(getHandBonus(10, 0, "strike", 7), 1.44);
  assert.equal(getHandBonus(40, 0, "strike", 0), 1.5);
});

test("with the switch on, a push is not graded and a LOCK press charges for clock", () => {
  const open = (seed = "lock-a") => reduceWindow(createWindow({ seed }), { type: "SELECT", id: "a" });
  const on = (window, event, rules = ALL_RULES) => reduceWindow(window, event, rules, true);
  const ungraded = reduceWindow(open(), { type: "PUSH" });
  for (const grade of ["perfect", "good", "miss", null]) {
    assert.deepEqual(on(open(), { type: "PUSH", grade }), ungraded, `${grade}: a push is a push`);
  }

  for (const mode of ["strike", "steady", "expose"]) {
    let window = reduceWindow(open(`lock-${mode}`), { type: "SET_FOCUS_MODE", mode });
    const wall = window.wall;
    for (let press = 1; press <= 6; press += 1) {
      const before = window;
      const good = scoreFocus(before, "good");
      // Whatever the stage sends as a grade, the press is the same press.
      const pressed = on(before, { type: "FOCUS", grade: ["miss", "perfect", null, "good", "miss", undefined][press - 1] });
      assert.equal(pressed.focus, good.focus, `${mode} press ${press}: the charge a GOOD lock took`);
      assert.equal(pressed.focusCombo, press);
      assert.equal(pressed.focusHits, press);
      assert.deepEqual([pressed.focusPerfects, pressed.focusMisses, pressed.jammed, pressed.lastFocusGrade], [0, 0, false, null], "no PERFECT, no miss, no JAM");
      assert.equal(pressed.elapsed, before.elapsed + LOCK_PRESS_SECONDS, "and 1.5 seconds of table clock");
      // No heat of its own: the gauge moves only by what the stance cools and what the clock creeps.
      const expected = reduceWindow({ ...before, gauge: Math.max(0, before.gauge - good.focusRelief), elapsed: before.elapsed }, { type: "TICK", delta: 1 });
      const crept = reduceWindow(expected, { type: "TICK", delta: LOCK_PRESS_SECONDS - 1 });
      assert.equal(pressed.gauge, crept.gauge);
      assert.equal(pressed.wall, wall);
      assert.notEqual(pressed.cause, "focus");
      window = pressed;
    }
    assert.equal(window.status, "live");
  }

  // The switch off: the beat-graded LOCK, exactly.
  const miss = reduceWindow(open(), { type: "FOCUS", grade: "miss" });
  assert.deepEqual([miss.jammed, miss.focusMisses, miss.gauge > 0], [true, 1, true]);
  assert.deepEqual(reduceWindow(open(), { type: "FOCUS", grade: "miss" }, ALL_RULES, false), miss);
  assert.equal(reduceWindow(open(), { type: "FOCUS", grade: null }).focus, 0, "and an ungraded press does nothing");

  // Without `lock`, or with no card staked, the press is still refused.
  const bare = createWindow({ seed: "lock-bare" });
  assert.equal(on(bare, { type: "FOCUS" }), bare);
  assert.equal(on(open(), { type: "FOCUS" }, step("prologue03")).focus, 0);
});

test("with the switch on, a LOCK press cannot bust on its own, and the clock it spends can only close a window the clock's way", () => {
  const on = (window, event) => reduceWindow(window, event, ALL_RULES, true);
  const fresh = reduceWindow(createWindow({ seed: "lock-wall" }), { type: "SELECT", id: "a" });
  // Just under the wall, before the grace has run: a beat-graded miss busts here, a press does not.
  const brink = { ...fresh, gauge: fresh.wall - 0.5 };
  assert.deepEqual([reduceWindow(brink, { type: "FOCUS", grade: "miss" }).status, reduceWindow(brink, { type: "FOCUS", grade: "miss" }).cause], ["bust", "focus"]);
  const pressed = on(brink, { type: "FOCUS", grade: "miss" });
  assert.deepEqual([pressed.status, pressed.cause, pressed.gauge], ["live", null, brink.gauge]);
  // Late in the window the clock it costs creeps heat, and that can reach the wall or the end of the clock.
  const late = on({ ...brink, elapsed: 20 }, { type: "FOCUS" });
  assert.deepEqual([late.status, late.cause], ["bust", "creep"]);
  const last = on({ ...fresh, elapsed: fresh.schema.seconds - 1, schema: { ...fresh.schema, creep: 0 } }, { type: "FOCUS" });
  assert.deepEqual([last.status, last.cause], ["bust", "timeout"]);
  assert.ok(VERDICT_CAUSES.includes("focus"), "the cause stays in the list for the logs that hold it");
});

test("with the switch on, the stances, mastery and the boards they carry are what they were", () => {
  for (const mode of ["strike", "steady", "expose"]) {
    let window = reduceWindow(reduceWindow(createWindow({ seed: `carry-${mode}` }), { type: "SELECT", id: "a" }), { type: "SET_FOCUS_MODE", mode });
    while (window.focus < STANCE_CHARGE) window = reduceWindow(window, { type: "FOCUS" }, ALL_RULES, true);
    window = reduceWindow(reduceWindow(window, { type: "PUSH" }, ALL_RULES, true), { type: "CASH" }, ALL_RULES, true);
    assert.equal(window.status, "cashed");
    const on = resolveWindow({ run: RUN_INITIAL_STATE, window, card: card("risk"), logic: true });
    const off = resolveWindow({ run: RUN_INITIAL_STATE, window, card: card("risk"), logic: false });
    assert.equal(on.verdict.focus.stanceEarned, true, mode);
    assert.equal(on.nextRun.stanceMastery[mode], 1);
    assert.deepEqual(on.nextRun.stanceMastery, off.nextRun.stanceMastery);
    assert.deepEqual(on.nextRun.schema, off.nextRun.schema, "the board the stance carries forward");
    assert.deepEqual(on.verdict.nextMutations, off.verdict.nextMutations);
    assert.deepEqual(on.verdict.focus.resourceMultiplier, off.verdict.focus.resourceMultiplier);
    assert.equal(on.verdict.pot, off.verdict.pot, "with no streak and no groove the LOCK pot is the same pot");
  }
});

/* ------------------------------------------ behind the switch: off */

test("with the switch off, a seeded batch of windows settles exactly as it did before the streak", async () => {
  const pinned = JSON.parse(readFileSync(fileURLToPath(PIN), "utf8"));
  const digests = await replayEngine();
  assert.equal(digests.length, pinned.windows, "the batch is the one that was pinned");
  assert.ok(digests.length >= 400);
  const moved = digests.map((digest, index) => (digest === pinned.digests[index] ? null : index)).filter((index) => index !== null);
  assert.deepEqual(moved, [], "windows, verdicts and runs are the pinned ones, apart from the `logic` fields the digest leaves out");
});

test("with the switch off, the verdict and the run gain the streak's fields and nothing else changes", () => {
  const run = normalizeRunState({ ...RUN_INITIAL_STATE, logic: { ...LOGIC_INITIAL, type: "risk", held: 9, streak: 30, best: 30 } });
  const bare = normalizeRunState(RUN_INITIAL_STATE);
  for (const window of [closed(44, "cashed", { groove: 7, beatCombo: 3, maxCombo: 3, beatHits: 3, focus: 80, focusHits: 4 }), closed(61), closed(50, "bust")]) {
    const withStreak = resolveWindow({ run, window, card: card("risk") });
    const without = resolveWindow({ run: bare, window, card: { ...card("risk"), cognition: undefined } });
    const { logic: _line, ...verdict } = withStreak.verdict;
    const { logic: _other, ...plainVerdict } = without.verdict;
    assert.deepEqual(verdict, plainVerdict, "a streak of thirty moves no number of the verdict");
    const { logic: _state, ...nextRun } = withStreak.nextRun;
    const { logic: _plain, ...plainRun } = without.nextRun;
    assert.deepEqual(nextRun, plainRun);
  }
  // The default is the shipped switch.
  const window = closed(44);
  assert.deepEqual(resolveWindow({ run, window, card: card("risk") }), resolveWindow({ run, window, card: card("risk"), logic: LOGIC }));
  const live = reduceWindow(createWindow({ seed: "default" }), { type: "SELECT", id: "a" });
  assert.deepEqual(reduceWindow(live, { type: "FOCUS", grade: "good" }), reduceWindow(live, { type: "FOCUS", grade: "good" }, ALL_RULES, LOGIC));
});

test("every settlement carries the streak's line", () => {
  const moves = new Set(["grow", "build", "switch", "keep", "break", "bust", "none"]);
  const settlements = [
    { run: RUN_INITIAL_STATE, window: closed(10), card: card("risk") },
    { run: RUN_INITIAL_STATE, window: closed(10, "bust"), card: card("risk"), forced: true },
    { run: RUN_INITIAL_STATE, window: null, card: null },
    { run: RUN_INITIAL_STATE, window: closed(65), card: WILD, caseClosed: true, rules: STORY_RULES },
    { run: openCaseRun(RUN_INITIAL_STATE, { replayOf: { pushRecord: {} } }), window: closed(31), card: card("inference"), caseClosed: true },
    { run: RUN_INITIAL_STATE, window: closed(10), card: card("risk"), rules: step("prologue01") },
  ];
  for (const settlement of settlements) {
    for (const logic of [false, true]) {
      const { verdict, nextRun } = resolveWindow({ ...settlement, logic });
      assert.deepEqual(Object.keys(verdict.logic), ["type", "tier", "rose", "move", "streak"]);
      assert.ok(moves.has(verdict.logic.move));
      assert.ok([0, 1, 2, 3].includes(verdict.logic.tier));
      assert.equal(typeof verdict.logic.rose, "boolean");
      assert.ok(Number.isInteger(verdict.logic.streak));
      assert.deepEqual(Object.keys(nextRun.logic), ["streak", "best", "type", "held", "heat", "rose"]);
    }
  }
});
