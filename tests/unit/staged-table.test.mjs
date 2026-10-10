import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { parseCurrentSavedState, SAVE_SCHEMA_VERSION } from "../../src/appConfig.js";
import { CASE_SEQUENCE } from "../../src/gameCases.js";
import {
  createWindow,
  equipRelic,
  HOT_CASH_MULTIPLIER,
  getMultiplier,
  normalizeRunState,
  openCaseRun,
  reduceWindow,
  resolveWindow,
  RUN_INITIAL_STATE,
  serializeRunState,
} from "../../src/gauntlet/gauntletEngine.js";
import { LOGIC_INITIAL } from "../../src/gauntlet/logicStreak.js";
import { RELIC_IDS } from "../../src/gauntlet/relics.js";
import { ALL_RULES, getTableRules, MUTATION_RULES, rulesFor, STAGED } from "../../src/gauntlet/tableUnlocks.js";
import { settleAgainstCodex } from "../../src/gauntlet/useRelicTable.js";
import { repairSavedState } from "../../src/state/savedState.js";
import { getSettlementRules } from "../../src/state/useChoiceCommit.js";

/**
 * The table as the prologues play it: what the reducer does with a press for
 * a rule the case does not have, what a window is worth there, and what a run
 * that was already under way keeps.
 *
 * The staged rules are asked for by name of case with the flag passed, never
 * through the shipped switch; the last two tests are the ones that read it.
 */

const step = (caseId) => rulesFor(caseId, { staged: true });
const card = (id, effect) => ({ id, label: id, effect, next: "x" });
const staked = card("a", { capital: 9, trust: -12 });
const open = (seed = "staged") => reduceWindow(createWindow({ seed }), { type: "SELECT", id: "a" });
/** A gauge under the lowest wall a base board can draw, hot enough for the chain. */
const HOT_GAUGE = 30;
assert.ok(getMultiplier(HOT_GAUGE) >= HOT_CASH_MULTIPLIER);

test("without the beat, a push is a push: its grade is not read, and a miss costs no clock", () => {
  const ungraded = reduceWindow(open(), { type: "PUSH" });
  for (const grade of ["perfect", "good", "miss", null]) {
    const pushed = reduceWindow(open(), { type: "PUSH", grade }, step("prologue01"));
    assert.deepEqual(pushed, ungraded, `${grade}: exactly the ungraded push`);
    assert.deepEqual([pushed.beatCombo, pushed.groove, pushed.beatHits, pushed.perfects, pushed.slips, pushed.lastGrade, pushed.elapsed], [0, 0, 0, 0, 0, null, 0]);
  }
  // With the beat the same presses are graded, as they always were.
  const beat = step("prologue02");
  assert.equal(reduceWindow(open(), { type: "PUSH", grade: "perfect" }, beat).beatCombo, 1);
  assert.ok(reduceWindow(open(), { type: "PUSH", grade: "miss" }, beat).elapsed > 0, "and a slip is paid in clock");
  assert.deepEqual(reduceWindow(open(), { type: "PUSH", grade: "good" }, beat), reduceWindow(open(), { type: "PUSH", grade: "good" }));
});

test("a LOCK press before LOCK, and a stance change before the stances, leave the window as it was", () => {
  for (const caseId of ["prologue01", "prologue02", "prologue03"]) {
    const rules = step(caseId);
    const window = open();
    for (const grade of ["perfect", "good", "miss", null]) {
      assert.equal(reduceWindow(window, { type: "FOCUS", grade }, rules), window, `${caseId}: FOCUS ${grade} is ignored`);
    }
    for (const mode of ["steady", "expose", "strike"]) {
      assert.equal(reduceWindow(window, { type: "SET_FOCUS_MODE", mode }, rules), window, `${caseId}: ${mode} is ignored`);
    }
  }
  // 프롤로그 04 has LOCK, in STRIKE: the press charges, the stance does not move.
  const four = step("prologue04");
  const locked = reduceWindow(open(), { type: "FOCUS", grade: "perfect" }, four);
  assert.ok(locked.focus > 0 && locked.focusMode === "strike");
  assert.deepEqual(locked, reduceWindow(open(), { type: "FOCUS", grade: "perfect" }), "exactly the STRIKE lock");
  assert.equal(reduceWindow(locked, { type: "SET_FOCUS_MODE", mode: "steady" }, four), locked, "and its charge is not thrown away by a stance it cannot take");
  assert.ok(reduceWindow(open(), { type: "FOCUS", grade: "miss" }, four).gauge > open().gauge, "a missed lock still heats");
  // 프롤로그 05 has the choice.
  assert.equal(reduceWindow(open(), { type: "SET_FOCUS_MODE", mode: "steady" }, step("prologue05")).focusMode, "steady");
});

test("the rest of the window is the same at every step: select, tick, push, cash and re-deal", () => {
  const play = (rules) => {
    let window = createWindow({ seed: "same" });
    const events = [
      { type: "SELECT", id: "a" },
      { type: "TICK", delta: 1 },
      { type: "PUSH" },
      { type: "TICK", delta: 0.6, scale: 2 },
      { type: "PUSH" },
      { type: "CASH" },
    ];
    for (const event of events) window = rules ? reduceWindow(window, event, rules) : reduceWindow(window, event);
    return window;
  };
  const plain = play(null);
  assert.equal(plain.status, "cashed");
  for (const caseId of CASE_SEQUENCE.slice(0, 6)) assert.deepEqual(play(step(caseId)), plain, caseId);
  const fresh = createWindow({ seed: "same" });
  assert.deepEqual(reduceWindow(fresh, { type: "REDEAL", schema: fresh.schema }, step("prologue01")), reduceWindow(fresh, { type: "REDEAL", schema: fresh.schema }));
});

test("the OVERCLOCK chain is only counted once the step has it, so the first hot cash of 프롤로그 04 starts one and does not finish one", () => {
  const hot = { status: "cashed", cause: "cash", gauge: HOT_GAUGE, wall: 80, pushes: 3 };
  let run = RUN_INITIAL_STATE;
  // Three prologues of nothing but hot cashes.
  for (const caseId of ["prologue01", "prologue02", "prologue03"]) {
    for (let window = 0; window < 4; window += 1) {
      run = resolveWindow({ run, window: hot, card: staked, rules: step(caseId) }).nextRun;
      assert.equal(run.streak, 0, `${caseId}: no chain`);
      assert.ok(!run.schema.mutations.includes("overclock"));
    }
  }
  const first = resolveWindow({ run, window: hot, card: staked, rules: step("prologue04") }).nextRun;
  assert.equal(first.streak, 1);
  assert.ok(!first.schema.mutations.includes("overclock"), "one hot cash is the first link");
  const second = resolveWindow({ run: first, window: hot, card: staked, rules: step("prologue04") }).nextRun;
  assert.ok(second.schema.mutations.includes("overclock"), "two in a row is OVERCLOCK");
  // Counted from 프롤로그 01, as it was, the same first cash of 04 would have dealt it.
  let counted = RUN_INITIAL_STATE;
  for (let window = 0; window < 12; window += 1) counted = resolveWindow({ run: counted, window: hot, card: staked }).nextRun;
  assert.ok(counted.streak >= 2 && counted.schema.mutations.includes("overclock"));
});

test("LOCK in 프롤로그 04 pays as STRIKE and carries nothing; the stance carries and mastery start in 프롤로그 05", () => {
  const charged = (focusMode) => ({ status: "cashed", cause: "cash", gauge: 24, wall: 80, pushes: 2, focus: 90, focusMode, focusHits: 4, focusCombo: 4, maxFocusCombo: 4 });
  const plainStrike = resolveWindow({ run: RUN_INITIAL_STATE, window: charged("strike"), card: staked });
  const four = resolveWindow({ run: RUN_INITIAL_STATE, window: charged("strike"), card: staked, rules: step("prologue04") });
  assert.equal(four.verdict.pot, plainStrike.verdict.pot, "the pot LOCK adds is the STRIKE pot");
  assert.ok(four.verdict.focus.pot > 0);
  assert.equal(four.verdict.focus.stanceEarned, false);
  assert.deepEqual(four.nextRun.stanceMastery, RUN_INITIAL_STATE.stanceMastery, "no mastery yet");
  assert.ok(!four.nextRun.schema.mutations.includes("strikeWake"), "and no STRIKE WAKE");
  assert.equal(four.nextRun.focusHits, 4, "the presses are still the run's record");
  // A window that somehow holds another stance is read as STRIKE there.
  const strayStance = resolveWindow({ run: RUN_INITIAL_STATE, window: charged("steady"), card: staked, rules: step("prologue04") });
  assert.deepEqual(strayStance.verdict, four.verdict);
  // Before LOCK there is no charge to pay at all.
  const three = resolveWindow({ run: RUN_INITIAL_STATE, window: charged("strike"), card: staked, rules: step("prologue03") });
  assert.equal(three.verdict.pot, Math.round(three.verdict.chips * three.verdict.multiplier));
  assert.equal(three.nextRun.focusHits, 0);

  const five = step("prologue05");
  for (const [mode, carry] of [["strike", "strikeWake"], ["steady", "steadyLine"], ["expose", "exposedHand"]]) {
    const settled = resolveWindow({ run: RUN_INITIAL_STATE, window: charged(mode), card: staked, rules: five });
    assert.deepEqual(settled, resolveWindow({ run: RUN_INITIAL_STATE, window: charged(mode), card: staked }), `${mode}: 프롤로그 05 is the whole table`);
    assert.ok(settled.nextRun.schema.mutations.includes(carry));
    assert.equal(settled.nextRun.stanceMastery[mode], 1);
  }
});

test("the relic draft is withheld as 프롤로그 03 closes and first offered as 프롤로그 04 closes", () => {
  const closing = { status: "cashed", cause: "cash", gauge: 24, wall: 80, pushes: 2, seed: "close" };
  const close = (caseId, run = RUN_INITIAL_STATE) => {
    const settlementRules = getSettlementRules({ caseId, run, caseClosed: true }, true);
    return { ...settleAgainstCodex({ run, window: closing, card: staked, caseClosed: true, offerRelics: caseId !== "final", ...settlementRules }, []), settlementRules };
  };
  for (const caseId of ["prologue01", "prologue02", "prologue03"]) {
    const closed = close(caseId);
    assert.deepEqual(closed.nextRun.relicOffer, [], `${caseId}: no draft`);
    assert.deepEqual(closed.verdict.relicOffer, []);
    assert.deepEqual(closed.nextRun.schema.mutations, ["reboot"], "the case still closes onto a REBOOT board");
    assert.ok(closed.nextRun.vault > 0, "and its pot still moves to the vault");
  }
  const four = close("prologue04");
  assert.equal(four.settlementRules.rules, step("prologue04"));
  assert.equal(four.settlementRules.nextRules, step("prologue05"), "the closing board and its draft are the next case's");
  assert.equal(four.nextRun.relicOffer.length, 3, "the first draft");
  assert.deepEqual(four.nextRun.relicOffer, close("prologue04").nextRun.relicOffer, "seeded by the window, as ever");
  assert.equal(close("prologue05").nextRun.relicOffer.length, 3);
  assert.equal(close("case01").nextRun.relicOffer.length, 3);
  assert.deepEqual(close("final").nextRun.relicOffer, [], "the finale offers none, as before");
  // A window that does not close a case is settled and dealt under the case's own rules.
  const mid = getSettlementRules({ caseId: "prologue04", run: RUN_INITIAL_STATE, caseClosed: false }, true);
  assert.equal(mid.nextRules, mid.rules);
  // A run begun with NEW GAME+ is offered one from the first case.
  const veteran = normalizeRunState({ veteran: true });
  assert.equal(close("prologue01", veteran).nextRun.relicOffer.length, 3);
  assert.equal(close("prologue01", veteran).nextRun.veteran, true, "and the mark is carried through every settlement");
  assert.equal(resolveWindow({ run: veteran, window: { ...closing, status: "bust", cause: "push" }, card: staked }).nextRun.veteran, true);
  assert.equal(equipRelic(close("prologue01", veteran).nextRun, null).veteran, true);
  assert.equal(openCaseRun(veteran, { replayOf: { pushRecord: null } }).veteran, true);
});

test("a replay of a prologue hands back what the run held, draft and all, and closes onto the whole table", () => {
  const held = normalizeRunState({ windowIndex: 40, vault: 9000, relics: ["metronome"], stanceMastery: { steady: 4 }, relicOffer: ["lockpick", "heatSink", "coldBlood"], schema: { mutations: ["reboot"] } });
  const replay = openCaseRun(held, { replayOf: { pushRecord: null }, rules: step("prologue02") });
  assert.ok(replay.practice);
  const rules = getSettlementRules({ caseId: "prologue02", run: replay, caseClosed: true }, true);
  assert.equal(rules.rules, step("prologue02"), "the replay itself plays under the case's own step");
  assert.equal(rules.nextRules, ALL_RULES);
  const { nextRun } = settleAgainstCodex({ run: replay, window: { status: "cashed", cause: "cash", gauge: 24, pushes: 2, seed: "replay" }, card: staked, caseClosed: true, offerRelics: true, ...rules }, []);
  assert.deepEqual(nextRun.relicOffer, held.relicOffer);
  assert.deepEqual(nextRun.relics, held.relics);
  assert.deepEqual(nextRun.stanceMastery, held.stanceMastery);
  assert.equal(nextRun.vault, held.vault);
  assert.ok(nextRun.schema.mutations.includes("steadyMastery"), "the board it leaves is the one the season would have dealt");
});

test("a feat is only counted toward the codex in a case that has relics", () => {
  // HIGH ROLLER's feat: a cash at x64 or better.
  const feat = { status: "cashed", cause: "cash", gauge: 70, wall: 90, pushes: 6, seed: "feat" };
  const settle = (rules) => settleAgainstCodex({ run: RUN_INITIAL_STATE, window: feat, card: staked, ...(rules ? { rules } : null) }, []);
  const everywhere = settle(null).unlockedRelics;
  assert.ok(everywhere.length > 0, "the window proves a feat");
  for (const id of everywhere) assert.ok(RELIC_IDS.includes(id));
  for (const caseId of ["prologue01", "prologue02", "prologue03", "prologue04"]) {
    assert.deepEqual(settle(step(caseId)).unlockedRelics, [], caseId);
    const { unlockedRelics: _none, ...settled } = settle(step(caseId));
    assert.deepEqual(settled, resolveWindow({ run: RUN_INITIAL_STATE, window: feat, card: staked, rules: step(caseId) }), "the settlement itself is untouched");
  }
  assert.deepEqual(settle(step("prologue05")).unlockedRelics, everywhere);
  assert.deepEqual(settle(ALL_RULES).unlockedRelics, everywhere);
});

/** `useRuntimeSavedState`'s pipeline: parse and migrate, then repair. */
function load(save) {
  return repairSavedState(parseCurrentSavedState(JSON.stringify(save), SAVE_SCHEMA_VERSION));
}

test("a run saved mid-prologue before the steps keeps everything it held, with no recovery notice", () => {
  const fixture = JSON.parse(readFileSync(fileURLToPath(new URL("./fixtures/saves/v2-pre-unlocks.json", import.meta.url)), "utf8"));
  const before = fixture.save.dynamics;
  // What that build's player is holding in 프롤로그 03, none of which the step would deal.
  assert.equal(fixture.save.currentCase, "prologue03");
  assert.ok(before.relics.length > 0 && before.relicOffer.length === 3 && before.streak >= 2 && before.beatCombo > 0);
  assert.ok(before.stanceMastery.strike >= 3 && before.schema.mutations.includes("strikeMastery"));
  assert.ok(!("veteran" in before) && !("story" in before), "the save has neither mark: it was written before there was one");

  const { state, repaired } = load(fixture.save);
  assert.equal(repaired, false, "filling in the marks is not a repair");
  assert.equal(state.lastError, undefined, "so there is no 복구됨 notice");
  assert.equal(state.paused, fixture.save.paused);
  assert.deepEqual(state.dynamics, { ...before, veteran: false, story: false, logic: { ...LOGIC_INITIAL } }, "the table record is the save's, plus the marks that say it is a plain run at the table and a logic streak not yet begun");
  const run = normalizeRunState(state.dynamics);
  assert.deepEqual(serializeRunState(run), state.dynamics, "and it is written back the same");
  assert.equal(run.veteran, false);
  assert.equal(run.story, false);

  // The same holds when the prologues are staged: nothing is stripped on load,
  // and reopening the case leaves the board and the draft where they were.
  const rules = getTableRules(state.currentCase, run, true);
  assert.equal(rules, step("prologue03"));
  const reopened = openCaseRun(run, { rules });
  assert.deepEqual(reopened.schema, run.schema, "the stored board is the one the next window is played on");
  assert.deepEqual(reopened.relicOffer, run.relicOffer, "the draft is still there to be answered");
  const drafted = equipRelic(reopened, run.relicOffer[0]);
  assert.deepEqual(drafted.relics, [...run.relics, run.relicOffer[0]]);

  // The next window is settled under the step: what it newly produces follows
  // the step, what the run held is still held.
  const cashed = { status: "cashed", cause: "cash", gauge: HOT_GAUGE, wall: 80, pushes: 0, seed: "after", groove: 5, beatCombo: 9, maxCombo: 9, beatHits: 2 };
  const { verdict, nextRun } = resolveWindow({ run: drafted, window: cashed, card: staked, ...getSettlementRules({ caseId: state.currentCase, run: drafted, caseClosed: false }, true) });
  assert.deepEqual(nextRun.relics, drafted.relics);
  assert.deepEqual(nextRun.stanceMastery, drafted.stanceMastery);
  assert.equal(nextRun.vault, drafted.vault);
  assert.equal(nextRun.grooveVault, drafted.grooveVault);
  assert.ok(verdict.tempo.groovePot > 0, "프롤로그 03 has the beat, so the groove is paid");
  assert.equal(nextRun.beatCombo, 9);
  assert.equal(nextRun.streak, 0, "the chain it was holding is not counted before OVERCLOCK");
  assert.deepEqual(nextRun.schema.mutations, ["coldFeet"], "and the next board is dealt from the step's rules alone");
  for (const id of nextRun.schema.mutations) assert.ok(rules.has(MUTATION_RULES[id]));
  assert.deepEqual(nextRun.schema.relics.slice().sort(), drafted.relics.slice().sort(), "with the relics the run carries");

  // With the switch as shipped, the settlement is whatever `getTableRules` says for it.
  const shipped = getSettlementRules({ caseId: state.currentCase, run: drafted, caseClosed: false });
  assert.equal(shipped.rules, rulesFor(state.currentCase, { staged: STAGED }));
});

test("with the switch off, every case is settled under everything, exactly as before", () => {
  for (const caseId of CASE_SEQUENCE) {
    for (const caseClosed of [false, true]) {
      assert.deepEqual(getSettlementRules({ caseId, run: RUN_INITIAL_STATE, caseClosed }, false), { rules: ALL_RULES, nextRules: ALL_RULES }, caseId);
    }
  }
  const closing = { status: "cashed", cause: "cash", gauge: 24, wall: 80, pushes: 2, seed: "close" };
  const settlement = { run: RUN_INITIAL_STATE, window: closing, card: staked, caseClosed: true, offerRelics: true };
  assert.deepEqual(
    settleAgainstCodex({ ...settlement, ...getSettlementRules({ caseId: "prologue01", run: RUN_INITIAL_STATE, caseClosed: true }, false) }, []),
    settleAgainstCodex(settlement, []),
    "프롤로그 01 closes onto a draft, as it did",
  );
});

test("as shipped, a plain run's prologues are settled under their steps and a NEW GAME+ run's under everything", () => {
  const veteran = normalizeRunState({ veteran: true });
  for (const caseId of CASE_SEQUENCE.slice(0, 5)) {
    assert.equal(getSettlementRules({ caseId, run: RUN_INITIAL_STATE, caseClosed: false }).rules, step(caseId), caseId);
    assert.deepEqual(getSettlementRules({ caseId, run: veteran, caseClosed: true }), { rules: ALL_RULES, nextRules: ALL_RULES }, caseId);
  }
  assert.equal(getSettlementRules({ caseId: "prologue05", run: RUN_INITIAL_STATE, caseClosed: true }).nextRules, ALL_RULES, "사건 01 is the whole table");
});
