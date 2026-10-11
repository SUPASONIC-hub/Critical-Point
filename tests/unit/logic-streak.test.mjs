import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";

import { installBrowser } from "./helpers/browser.mjs";

/**
 * The logic streak.
 *
 * The streak is counted on every settled window, saved with the run, written
 * into the log and the case summary, and paid: it is the hand's share of the
 * pot, where the beat's groove was until 2026-10-10. For the five days before
 * that it was counted as a shadow behind a switch (`LOGIC`) and paid nothing;
 * the switch and the beat it switched to are gone, and what is left of the
 * beat is what an older save or log still holds.
 */
installBrowser();
const { createElement } = await import("react");
const { renderToStaticMarkup } = await import("react-dom/server");
const { parseCurrentSavedState, isSavedStateShapeValid, SAVE_SCHEMA_VERSION } = await import("../../src/appConfig.js");
const { CASE_RESULT_NODES, CASE_SEQUENCE } = await import("../../src/gameCases.js");
const { nodes } = await import("../../src/gameData.js");
const { createCaseSummary, createLogicRecord, getRiskPressure, getSeasonLogic, REFRAME_COGNITION } = await import("../../src/gameLogic.js");
const engine = await import("../../src/gauntlet/gauntletEngine.js");
const {
  BASE_SCHEMA, carryTableRecordIntoRestore, createRunSummary, createTableRecord, createWindow, getFocusBonus, getHandBonus, HAND_CAP, normalizeRunState,
  createOpenSeed, openCaseRun, reduceWindow, resolveWindow, RUN_INITIAL_STATE, scoreFocus, serializeRunState, splitOpenSeed, STANCE_CHARGE, suspendWindow, upgradeRunRecord, VERDICT_CAUSES,
} = engine;
const { advanceLogic, getHeatTier, getLogicBonus, getLogicType, listOfferedTypes, LOGIC_INITIAL, normalizeLogic } = await import("../../src/gauntlet/logicStreak.js");
const { getRelicUnlocks, RELICS } = await import("../../src/gauntlet/relics.js");
const { describeCardMove, describeLogicLog, describeLogicMove, getTypeName, getTypeParts, readLogic } = await import("../../src/gauntlet/tableReadout.js");
const { HEAT_DEBT_GAUGE, LOCK_PRESS_SECONDS, LOGIC_CAP, LOGIC_HOLD, LOGIC_RATE, METRONOME_REACH, SEAL_BREAK_GAUGE } = await import("../../src/gauntlet/tableRules.js");
const { ALL_RULES, rulesFor, STORY_RULES } = await import("../../src/gauntlet/tableUnlocks.js");
const { addToRelicCodex, parseRelicCodex, settleAgainstCodex } = await import("../../src/gauntlet/useRelicTable.js");
const { easyCognitionLabels } = await import("../../src/playerLanguage.js");
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

/** The five things a verdict's line says about the streak itself; what it paid is `bonus` and `pot`, beside them. */
const move = ({ type, tier, rose, move: made, streak }) => ({ type, tier, rose, move: made, streak });
/** The streak as the run holds it, less `reach`, which only METRONOME reads. */
const six = ({ reach: _reach, ...logic }) => logic;

/** Plays a string of settlements and hands back each verdict's line and the run after it. */
function play(moves, { run = RUN_INITIAL_STATE, rules = ALL_RULES } = {}) {
  const lines = [];
  const paid = [];
  for (const played of moves) {
    const settled = resolveWindow({ run, window: played.window ?? closed(played.gauge ?? COLD), card: played.card, forced: played.forced, offered: played.offered, rules: played.rules ?? rules });
    lines.push(move(settled.verdict.logic));
    paid.push(settled.verdict.logic);
    run = settled.nextRun;
  }
  return { lines, paid, run };
}

test("the build ships the streak, and it is what the hand is paid on", () => {
  assert.deepEqual(RUN_INITIAL_STATE.logic, { streak: 0, best: 0, type: null, held: 0, heat: 0, rose: false, reach: 0 });
  assert.equal(RUN_INITIAL_STATE.logic, LOGIC_INITIAL);
  assert.ok(Object.isFrozen(LOGIC_INITIAL));
  assert.deepEqual([LOGIC_RATE, LOGIC_CAP, LOGIC_HOLD, LOCK_PRESS_SECONDS, METRONOME_REACH], [0.0625, 0.5, 3, 1.5, 2]);
  const tableRules = readFileSync(new URL("../../src/gauntlet/tableRules.js", import.meta.url), "utf8");
  assert.equal(/export const LOGIC\b/.test(tableRules), false, "the switch went with the beat it switched to");
  for (const gone of ["judgeBeat", "scoreBeat", "getGoodWindowMs", "getGrooveBonus", "SLIP_SECONDS", "FEVER_BONUS", "COMBO_POINT_CAP", "GROOVE_CAP"]) {
    assert.equal(gone in engine, false, `the engine no longer exports ${gone}`);
  }
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

test("every card in the built graph has a tag to print: one of the four plain names, and the wild card's is 판 바꾸기", () => {
  const names = Object.values(easyCognitionLabels);
  assert.deepEqual(names, ["끝까지 버티기", "꼼꼼히 확인하기", "판 바꾸기", "위험 다루기"]);
  const cards = Object.values(nodes).flatMap((node) => node.choices ?? []);
  assert.ok(cards.length > 3000, "the whole season's hand");
  const untagged = cards.filter((choice) => !names.includes(getTypeName(getLogicType(choice))));
  assert.deepEqual(untagged.map((choice) => choice.id), [], "no card without a tag");
  const wild = cards.filter((choice) => choice.type === "reframe");
  assert.ok(wild.length > 0);
  for (const choice of wild) assert.equal(getTypeName(getLogicType(choice)), "판 바꾸기", choice.id);
  // The commit scores the wild card with this map, and its largest key is the same type.
  assert.equal(getLogicType({ cognition: REFRAME_COGNITION }), "reframing");
  assert.equal(getTypeName("nothing"), "");
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
  assert.deepEqual(six(run.logic), { streak: 2, best: 2, type: "risk", held: 4, heat: 0, rose: false });
});

test("changing type when the pressure rose is a switch: the streak grows and the hold starts again", () => {
  // Cold, cold, then a warm close: the pressure has risen going into the fourth window.
  const { lines, run } = play([{ card: card("risk") }, { card: card("risk") }, { card: card("risk"), gauge: WARM }, { card: card("inference"), gauge: WARM }]);
  assert.deepEqual(lines.map((line) => line.rose), [false, false, false, true], "`rose` is what the window was played under");
  assert.deepEqual(lines.at(-1), { type: "inference", tier: 1, rose: true, move: "switch", streak: 2 });
  assert.deepEqual(six(run.logic), { streak: 2, best: 2, type: "inference", held: 1, heat: 1, rose: false });
  // Holding through the same rise grows it as any held window does.
  const held = play([{ card: card("risk") }, { card: card("risk") }, { card: card("risk"), gauge: WARM }, { card: card("risk"), gauge: WARM }]);
  assert.deepEqual(held.lines.at(-1), { type: "risk", tier: 1, rose: true, move: "grow", streak: 2 });
});

test("changing type because the held one was not on the table keeps the streak; changing for no reason ends it", () => {
  const grown = play([{ card: card("risk") }, { card: card("risk") }, { card: card("risk") }, { card: card("risk") }]).run;
  assert.equal(grown.logic.streak, 2);
  const kept = play([{ card: card("inference"), offered: ["inference", "persistence"] }], { run: grown });
  assert.deepEqual(kept.lines[0], { type: "inference", tier: 0, rose: false, move: "keep", streak: 2 });
  assert.deepEqual(six(kept.run.logic), { streak: 2, best: 2, type: "inference", held: 1, heat: 0, rose: false });
  const broken = play([{ card: card("inference"), offered: ["inference", "risk"] }], { run: grown });
  assert.deepEqual(broken.lines[0], { type: "inference", tier: 0, rose: false, move: "break", streak: 0 });
  assert.deepEqual(six(broken.run.logic), { streak: 0, best: 2, type: "inference", held: 1, heat: 0, rose: false });
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
  assert.deepEqual(six(bust.run.logic), { streak: 0, best: 1, type: "risk", held: 4, heat: 3, rose: true });
  const other = play([{ card: card("inference"), window: closed(70, "bust") }], { run: grown });
  assert.deepEqual(six(other.run.logic), { streak: 0, best: 1, type: "inference", held: 1, heat: 3, rose: true });
  const held = advanceLogic(grown.logic, { type: "risk", tier: 3, bustHolds: true });
  assert.deepEqual([held.move, held.logic.streak], ["bust", 1], "a bust that is held (앙코르) leaves the streak standing");
});

test("앙코르 holds the streak through a bust, every bust, and nothing else", () => {
  assert.equal(RELICS.encore.text, "BUST가 판돈은 가져가도 논리 콤보는 남겨 둔다.");
  assert.equal(RELICS.encore.unlock.text, "논리 콤보 8 달성");
  const grown = play(Array.from({ length: 6 }, () => ({ card: card("risk") }))).run;
  assert.equal(grown.logic.streak, 4);
  const holding = { ...grown, relics: ["encore"], runPot: 1200 };
  const bust = resolveWindow({ run: holding, window: closed(70, "bust"), card: card("risk") });
  assert.deepEqual([bust.verdict.logic.move, bust.verdict.logic.streak, bust.nextRun.logic.streak], ["bust", 4, 4]);
  assert.equal(bust.nextRun.runPot, 0, "the pot is still the wall's");
  assert.deepEqual(bust.verdict.relicProcs, ["encore"]);
  // No limit a case, which is the limit it had over the beat's combo: the second and the third are held too.
  let run = bust.nextRun;
  for (const window of [closed(40, "bust"), closed(50, "bust", { cause: "timeout", selectedId: null })]) {
    const again = resolveWindow({ run, window, card: card("inference"), forced: window.cause === "timeout" });
    assert.equal(again.nextRun.logic.streak, 4);
    assert.ok(again.verdict.relicProcs.includes("encore"));
    run = again.nextRun;
  }
  // The streak it kept is paid on the next cash, and grows from where it stood.
  const next = resolveWindow({ run: bust.nextRun, window: closed(COLD), card: card("risk") });
  assert.deepEqual([next.verdict.logic.move, next.verdict.logic.streak, next.verdict.logic.bonus], ["grow", 5, 1.31]);
  // It is not a way to change type for free, and with no streak to hold it does not say it held one.
  assert.equal(play([{ card: card("inference"), offered: ["risk", "inference"] }], { run: holding }).run.logic.streak, 0);
  assert.deepEqual(resolveWindow({ run: normalizeRunState({ relics: ["encore"] }), window: closed(70, "bust"), card: card("risk") }).verdict.relicProcs, []);
  // Without the relic the same bust takes it.
  assert.equal(resolveWindow({ run: grown, window: closed(70, "bust"), card: card("risk") }).nextRun.logic.streak, 0);
  // In a case that does not have the rule the streak is not in play, and the relic has nothing to say.
  const off = resolveWindow({ run: holding, window: closed(70, "bust"), card: card("risk"), rules: step("prologue01") });
  assert.deepEqual([off.verdict.logic.move, off.nextRun.logic.streak, off.verdict.relicProcs], ["none", 4, []]);
});

test("앙코르 is unlocked by a logic streak of 8, and a codex that already holds it keeps it", () => {
  const unlocks = (verdict, nextRun = {}) => getRelicUnlocks({ verdict, nextRun }, []);
  assert.deepEqual(unlocks({ outcome: "cash", logic: { streak: 7 }, nextMutations: [] }, { logic: { best: 7 } }), []);
  assert.deepEqual(unlocks({ outcome: "cash", logic: { streak: 8 }, nextMutations: [] }), ["encore"]);
  // The codex is a list of ids under its own key, so what a player unlocked on the beat is still theirs.
  const saved = JSON.stringify({ unlocked: ["encore", "metronome", "insurance", "gone-relic"] });
  assert.deepEqual(parseRelicCodex(saved), { unlocked: ["encore", "metronome", "insurance"] });
  assert.deepEqual(addToRelicCodex(parseRelicCodex(saved), ["encore"]), parseRelicCodex(saved), "and proving it again adds nothing");
});

test("메트로놈: after the pressure rose, a change of type counts as a switch on that scene and on the next", () => {
  assert.equal(RELICS.metronome.text, "압박이 오른 다음 장면까지, 유형을 바꿔도 전환으로 인정된다.");
  assert.equal(RELICS.metronome.proc, "전환을 붙잡았다");
  assert.equal(RELICS.metronome.unlock, null, "still in the pool every season can draft from");
  const offered = ["risk", "inference", "persistence"];
  // Three cold windows build a streak of 1, then a warm close: the pressure has risen.
  const risen = (relics) => play([{ card: card("risk") }, { card: card("risk") }, { card: card("risk") }, { card: card("risk"), gauge: WARM }], { run: normalizeRunState({ relics }) }).run;
  const bare = risen([]);
  const held = risen(["metronome"]);
  assert.deepEqual([bare.logic.rose, bare.logic.reach, bare.logic.streak], [true, METRONOME_REACH, 2]);
  // The scene the pressure rose into: a switch for anyone.
  for (const run of [bare, held]) {
    const now = resolveWindow({ run, window: closed(WARM), card: card("inference"), offered });
    assert.deepEqual([now.verdict.logic.move, now.verdict.logic.streak], ["switch", 3]);
    assert.deepEqual(now.verdict.relicProcs, [], "nothing the relic did");
  }
  // The scene after it, with the type held through the first: a break without the relic, a switch with it.
  const after = (run) => resolveWindow({ run: resolveWindow({ run, window: closed(WARM), card: card("risk"), offered }).nextRun, window: closed(WARM), card: card("inference"), offered });
  assert.deepEqual([after(bare).verdict.logic.move, after(bare).nextRun.logic.streak], ["break", 0]);
  const caught = after(held);
  assert.deepEqual([caught.verdict.logic.move, caught.verdict.logic.streak, caught.verdict.logic.rose], ["switch", 4, false]);
  assert.deepEqual(caught.verdict.relicProcs, ["metronome"], "and the reveal says the relic caught it");
  // Both scenes can be switched on, one after the other.
  const twice = resolveWindow({ run: resolveWindow({ run: held, window: closed(WARM), card: card("inference"), offered }).nextRun, window: closed(WARM), card: card("persistence"), offered });
  assert.deepEqual([twice.verdict.logic.move, twice.verdict.logic.streak], ["switch", 4]);
  // And the third scene is past it.
  let run = held;
  for (let index = 0; index < 2; index += 1) run = resolveWindow({ run, window: closed(WARM), card: card("risk"), offered }).nextRun;
  assert.equal(run.logic.reach, 0);
  assert.equal(resolveWindow({ run, window: closed(WARM), card: card("inference"), offered }).verdict.logic.move, "break");
  // A rise inside the allowance starts it again.
  const again = advanceLogic({ ...LOGIC_INITIAL, heat: 0, rose: false, reach: 1 }, { type: "risk", tier: 2 });
  assert.deepEqual([again.logic.rose, again.logic.reach], [true, METRONOME_REACH]);
  // A save from before the relic's new meaning reads as no allowance left.
  assert.equal(normalizeLogic({ streak: 3, rose: true }).reach, 0);
});

test("a window run out with nothing staked is a bust like any other, and the room's card is not the hand's pick", () => {
  const grown = play([{ card: card("risk") }, { card: card("risk") }, { card: card("risk") }, { card: card("risk") }]).run;
  assert.deepEqual([grown.logic.streak, grown.logic.held], [2, 4]);
  const timeout = closed(50, "bust", { cause: "timeout", selectedId: null });
  const forced = play([{ card: card("inference"), forced: true, window: timeout }], { run: grown });
  assert.deepEqual(forced.lines[0], { type: null, tier: 3, rose: false, move: "bust", streak: 0 }, "letting the clock run out does not spare the streak");
  assert.deepEqual(forced.run.logic, { ...grown.logic, streak: 0, heat: 3, rose: true, reach: METRONOME_REACH }, "and what the hand was holding is left as it was");
  // So the hand picks up its hold where it left it: the next card of its type grows at once.
  assert.deepEqual(play([{ card: card("risk") }], { run: forced.run }).lines[0], { type: "risk", tier: 0, rose: true, move: "grow", streak: 1 });
  // The same for a bust with no card at all, and for a hand that had not picked anything yet.
  assert.deepEqual(play([{ card: undefined, window: timeout }], { run: grown }).run.logic, forced.run.logic);
  const first = play([{ card: card("risk"), forced: true, window: timeout }]);
  assert.deepEqual([first.lines[0].move, first.run.logic.type, first.run.logic.held], ["bust", null, 0]);
  // 앙코르 spares the streak on this bust as on any.
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
  assert.equal(step("prologue01").has("logic"), false, "프롤로그 01 is before the step the streak lives on");
  assert.equal(step("prologue02").has("logic"), true);
  assert.equal(ALL_RULES.has("beat"), false, "the rule was the beat's until 2026-10-10 and is named for the streak now");
  const grown = play([{ card: card("risk") }, { card: card("risk") }, { card: card("risk") }]).run;
  const off = play([{ card: card("inference") }, { card: card("risk"), window: closed(70, "bust") }, { card: card("risk"), gauge: HOT }], { run: grown, rules: step("prologue01") });
  assert.deepEqual(off.lines.map((line) => [line.type, line.move, line.streak]), [[null, "none", 1], [null, "none", 1], [null, "none", 1]]);
  assert.deepEqual(off.lines.map((line) => line.tier), [0, 3, 2], "the heat is the table's and is read under any rules");
  assert.deepEqual(six(off.run.logic), { ...six(grown.logic), heat: 2, rose: false });
  assert.deepEqual(off.paid.map((line) => [line.bonus, line.pot]), [[1, 0], [1, 0], [1, 0]], "and it pays nothing there, whatever the run carries in");
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
  assert.deepEqual(move(closing.verdict.logic), { type: "risk", tier: 1, rose: false, move: "grow", streak: 2 });
  const next = openCaseRun(closing.nextRun, { rules: ALL_RULES });
  assert.deepEqual(six(next.logic), { streak: 2, best: 2, type: "risk", held: 4, heat: 1, rose: true });
  assert.equal(next.runPot, 0, "the pot is the case's; the streak is the season's, as the beat's combo was");
  const first = resolveWindow({ run: next, window: closed(COLD), card: card("inference") });
  assert.deepEqual(move(first.verdict.logic), { type: "inference", tier: 0, rose: true, move: "switch", streak: 3 });
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
  // A bust since: the streak is gone, as the pot is.
  const bust = play([{ card: card("risk"), window: closed(70, "bust") }], { run: grownOn }).run;
  const restored = carryTableRecordIntoRestore(save(atSlot), save(bust)).dynamics;
  assert.deepEqual(restored.logic, { ...atSlot.logic, streak: 0, best: 4 });
  // A slot written before 2026-10-11 names the hand's share as that build did, and counts a combo of pushes.
  const { runHand: _hand, handVault: _vault, ...slot } = serializeRunState(atSlot);
  const older = { ...save(atSlot), dynamics: { ...slot, runPot: 500, runGroove: 40, vault: 900, grooveVault: 120, beatCombo: 5, bestCombo: 9 } };
  const kept = carryTableRecordIntoRestore(older, save(grownOn)).dynamics;
  assert.deepEqual([kept.runHand, kept.handVault], [40, 120]);
  assert.equal(["beatCombo", "bestCombo", "runGroove", "grooveVault"].some((key) => key in kept), false);
  // Another run's save, or one that is not ahead, is left alone.
  assert.deepEqual(carryTableRecordIntoRestore(save(atSlot), { ...save(bust), runId: "run-b" }).dynamics.logic, atSlot.logic);
});

test("a saved streak is read back whole, and anything else reads as none", () => {
  const logic = { streak: 5, best: 9, type: "risk", held: 3, heat: 2, rose: true, reach: 2 };
  assert.deepEqual(normalizeLogic(logic), logic);
  assert.deepEqual(normalizeRunState({ logic }).logic, logic);
  for (const none of [undefined, null, "streak", 7, []]) assert.deepEqual(normalizeLogic(none), LOGIC_INITIAL);
  assert.deepEqual(normalizeLogic({ streak: -3, best: "x", type: 4, held: 2.9, heat: 9, rose: "yes", reach: 7 }), { streak: 0, best: 0, type: null, held: 2, heat: 3, rose: false, reach: 2 });
});

/* ------------------------------------------------------------ old saves */

const SAVES = new URL("./fixtures/saves/", import.meta.url);
const load = (save) => {
  const parsed = parseCurrentSavedState(JSON.stringify(save), SAVE_SCHEMA_VERSION);
  const { state, repaired } = repairSavedState(parsed);
  return { state, repaired, valid: isSavedStateShapeValid(state) };
};

const savedBeforeTheStreak = (name) => !JSON.stringify(JSON.parse(readFileSync(new URL(name, SAVES), "utf8")).save.dynamics ?? {}).includes('"logic"');

for (const name of readdirSync(SAVES).filter((file) => file.endsWith(".json")).sort().filter(savedBeforeTheStreak)) {
  test(`${name}, written before the streak, loads with one not yet begun and no new repair`, () => {
    const fixture = JSON.parse(readFileSync(new URL(name, SAVES), "utf8"));
    const { state, repaired, valid } = load(fixture.save);
    assert.equal(valid, true);
    if ("repaired" in fixture.expect) assert.equal(repaired, fixture.expect.repaired, "the streak adds no repair of its own");
    assert.deepEqual(normalizeRunState(state.dynamics).logic, LOGIC_INITIAL);
    if (fixture.save.dynamics && !repaired) {
      assert.deepEqual(state.dynamics.logic, { ...LOGIC_INITIAL });
      // What the save held is written back under the names this build reads; the counts nothing reads are not.
      for (const [old, name] of [["runGroove", "runHand"], ["grooveVault", "handVault"]]) {
        if (old in fixture.save.dynamics) assert.equal(state.dynamics[name], fixture.save.dynamics[old], name);
      }
      for (const gone of ["beatCombo", "bestCombo", "runGroove", "grooveVault", "focusPerfects", "focusMisses"]) assert.equal(gone in state.dynamics, false, gone);
      if (fixture.save.dynamics.suspended) assert.deepEqual(state.dynamics.suspended, upgradeRunRecord(fixture.save.dynamics).suspended);
    }
    // Loaded, saved and loaded again, it is the same save and still not a repair.
    const again = load(JSON.parse(JSON.stringify({ ...state, lastError: undefined, paused: false })));
    assert.equal(again.repaired, false);
    assert.deepEqual(again.state.dynamics, state.dynamics);
  });
}

test("a save that carries a streak is not called repaired, with or without a replay in it", () => {
  const current = JSON.parse(readFileSync(new URL("v2-current.json", SAVES), "utf8")).save;
  const logic = { streak: 4, best: 11, type: "persistence", held: 6, heat: 2, rose: true, reach: 2 };
  const run = normalizeRunState({ ...current.dynamics, logic });
  const saved = load({ ...current, dynamics: serializeRunState(run) });
  assert.equal(saved.repaired, false);
  assert.deepEqual(saved.state.dynamics.logic, logic);
  const replay = openCaseRun(run, { replayOf: { pushRecord: { busts: 0 } }, rules: ALL_RULES });
  const midReplay = load({ ...current, dynamics: JSON.parse(JSON.stringify(serializeRunState(replay))) });
  assert.equal(midReplay.repaired, false);
  assert.deepEqual(midReplay.state.dynamics.practice.logic, logic);
  // A save written while the streak was a shadow (2026-10-10, before `reach`) is filled in, not repaired.
  const { reach: _reach, ...shadow } = logic;
  const older = load({ ...current, dynamics: { ...serializeRunState(run), logic: shadow } });
  assert.equal(older.repaired, false);
  assert.deepEqual(older.state.dynamics.logic, { ...shadow, reach: 0 });
});

test("a save with a window put down before 2026-10-10 resumes with no repair, holds its groove, and is paid at least what it showed", () => {
  const fixture = JSON.parse(readFileSync(new URL("v2-current.json", SAVES), "utf8")).save;
  // As a build before 2026-10-10 wrote it: a combo carried, a groove earned in the window, a LOCK graded.
  assert.ok("beatCombo" in fixture.dynamics && "grooveVault" in fixture.dynamics, "the fixture is a save of that build");
  const beat = { beatCombo: 6, maxCombo: 7, groove: 12, beatHits: 5, perfects: 3, slips: 1 };
  const window = { ...fixture.dynamics.suspended.window, ...beat, gauge: 33, pushes: 4, elapsed: 9, focus: 37, focusCombo: 2, maxFocusCombo: 2, focusHits: 2, focusPerfects: 1, focusMisses: 1 };
  const dynamics = { ...fixture.dynamics, beatCombo: 6, bestCombo: 11, runGroove: 0, grooveVault: 260, suspended: { ...fixture.dynamics.suspended, window } };
  const { state, repaired, valid } = load({ ...fixture, dynamics });
  assert.deepEqual([valid, repaired], [true, false], "no 복구됨 notice");
  assert.equal(state.lastError, undefined);
  const { beatCombo: _combo, maxCombo: _longest, beatHits: _hits, perfects: _perfects, slips: _slips, focusPerfects: _locked, focusMisses: _jammed, ...held } = window;
  assert.deepEqual(state.dynamics.suspended.window, held, "the window is written back with its progress and its groove, without the counts nothing reads");
  assert.deepEqual([state.dynamics.runHand, state.dynamics.handVault], [0, 260], "the hand's share is carried under its new names");
  for (const key of ["beatCombo", "bestCombo", "runGroove", "grooveVault", "focusPerfects", "focusMisses"]) assert.equal(key in state.dynamics, false, key);
  assert.equal(load(JSON.parse(JSON.stringify(state))).repaired, false, "and the save it is written back as loads clean");

  // Picked up: the window is live with its groove, and what the stage shows is what the settlement pays.
  const run = normalizeRunState(state.dynamics);
  const resumed = createWindow({ schema: run.schema, seed: run.suspended.seed, resume: run.suspended.window });
  assert.deepEqual([resumed.status, resumed.groove, resumed.gauge, resumed.focus], ["live", 12, 33, 37]);
  assert.equal(getHandBonus(resumed.groove, 0, "strike", 0), 1.36, "groove 12 was x1.36");
  const cashed = reduceWindow(resumed, { type: "CASH" });
  const staked = card("risk");
  const { verdict, nextRun } = resolveWindow({ run, window: cashed, card: staked, rules: step("prologue02") });
  const base = Math.round(verdict.chips * verdict.multiplier);
  assert.equal(verdict.logic.bonus, 1.36, "the streak is at none, so the groove is the larger and is paid");
  assert.equal(verdict.pot, Math.round(verdict.chips * verdict.multiplier * 1.36), "what the window showed its player");
  assert.ok(verdict.pot > base);
  // 프롤로그 02 has no LOCK, so the charge is not settled there; on the whole table it is, on top and under the cap.
  const whole = resolveWindow({ run, window: cashed, card: staked }).verdict;
  assert.equal(whole.pot, Math.round(whole.chips * whole.multiplier * getHandBonus(12, 37, "strike", 0)));
  assert.ok(whole.pot >= verdict.pot);
  assert.equal("beatCombo" in nextRun || "bestCombo" in nextRun, false, "the run's old combo is not carried");
  // Put down again before it is cashed, it holds everything it held (and the clock scale a window now keeps).
  const again = suspendWindow(resumed, run.windowIndex).window;
  for (const [key, value] of Object.entries(run.suspended.window)) assert.equal(again[key], value, key);
  // A streak that would pay more is what is paid.
  const streaking = normalizeRunState({ ...run, logic: { ...LOGIC_INITIAL, type: "risk", held: 9, streak: 7, best: 7 } });
  assert.equal(resolveWindow({ run: streaking, window: cashed, card: staked, rules: step("prologue02") }).verdict.logic.bonus, 1.5);
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
  assert.deepEqual(move(entry.threshold.logic), { type, tier: 1, rose: false, move: "grow", streak: 4 });
  assert.deepEqual([entry.threshold.logic.held, entry.threshold.logic.bonus], [3, 1.25], "with the hold it reached and what it paid");
  assert.equal(entry.threshold.logic.pot, entry.threshold.pot - Math.round(patch.decisionReveal.verdict.chips * patch.decisionReveal.verdict.multiplier));
  assert.deepEqual(entry.threshold.logic, patch.decisionReveal.verdict.logic);
  assert.deepEqual(six(patch.gauntletRun.logic), { streak: 4, best: 4, type, held: 3, heat: 1, rose: true });
  assert.equal("tempo" in entry.threshold || "tempoBonus" in entry, false, "neither line a build before 2026-10-11 wrote is written");
  assert.deepEqual(entry.handLine, describeLogicLog(entry.threshold.logic), "and the archive's line is the streak's");
  assert.match(entry.handLine.text, /^논리 콤보 4 · 판돈 ×1\.25 · \+\d/);

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
  assert.deepEqual(move(forced.did.patches[0].log[0].threshold.logic), { type: null, tier: 3, rose: false, move: "bust", streak: 0 });
  assert.deepEqual([forced.did.patches[0].gauntletRun.logic.type, forced.did.patches[0].gauntletRun.logic.held], [other, 5], "what the hand was holding is left as it was");

  // 프롤로그 01 does not have the rule: its entries say so and its summary carries no record.
  const first = sceneContext("p1_start", holding({ type: "risk", held: 2, streak: 3, best: 3 }));
  commit(first.context, first.context.node.choices[0], cashed("commit-off"));
  assert.deepEqual(move(first.did.patches[0].log[0].threshold.logic), { type: null, tier: 1, rose: false, move: "none", streak: 3 });
  assert.equal(first.did.patches[0].log[0].threshold.logic.bonus, 1, "and the streak it carried in pays nothing there");
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
  // The table asks the same function with its own gate, so the two cannot disagree.
  assert.deepEqual(listOfferedTypes(scene.choices), getOfferedTypes(scene, standing));
  assert.deepEqual(listOfferedTypes(scene.choices, (choice) => choice !== WILD), ["risk", "inference"]);
  assert.deepEqual(listOfferedTypes(undefined), []);
});

/* ------------------------------------------------- what the table shows */

test("the streak the table shows a card leaving is the streak its pot is paid on", () => {
  const types = ["risk", "inference", "persistence", "reframing"];
  let seed = 7;
  const next = (count) => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed % count; };
  for (let round = 0; round < 400; round += 1) {
    const relics = [[], ["metronome"], ["encore"], ["metronome", "encore"]][next(4)];
    const logic = normalizeLogic({ streak: next(12), best: 20, type: [null, ...types][next(5)], held: next(6), heat: next(4), rose: next(2) === 1, reach: next(3) });
    const offered = types.filter(() => next(3) > 0);
    const staked = card(types[next(4)]);
    const run = normalizeRunState({ logic, relics });
    const shown = readLogic({ logic: run.logic, card: staked, offered, relics });
    const { verdict } = resolveWindow({ run, window: closed(next(90)), card: staked, offered });
    assert.equal(shown.after, verdict.logic.streak, `round ${round}`);
    assert.equal(shown.move, verdict.logic.move);
    assert.equal(Math.round(shown.bonus * 100) / 100, verdict.logic.bonus);
    assert.equal(shown.moveOf(staked), verdict.logic.move, "and the card's own tag says the same");
  }
});

test("the HUD's line: the streak, the type held and how far, and when a change of type would count; what it pays is the pot's", () => {
  const idle = readLogic({ logic: LOGIC_INITIAL, card: null, offered: ["risk"] });
  assert.equal(idle.line, "논리 콤보 0 · 첫 카드부터 센다");
  assert.deepEqual([idle.after, idle.bonus, idle.move, idle.type, idle.note], [0, 1, null, null, ""]);
  const holding = normalizeLogic({ streak: 4, best: 4, type: "risk", held: 2, rose: false });
  const waiting = readLogic({ logic: holding, card: null, offered: ["risk", "inference"] });
  assert.equal(waiting.line, "논리 콤보 4 · 위험 다루기 2/3");
  assert.deepEqual([waiting.after, waiting.bonus, waiting.type, waiting.held, waiting.note], [4, 1.25, "risk", "2/3", ""]);
  assert.equal(readLogic({ logic: { ...holding, rose: true }, card: null, offered: [] }).line, "논리 콤보 4 · 위험 다루기 2/3 · 전환 가능");
  assert.equal(readLogic({ logic: { ...holding, reach: 1 }, card: null, offered: [] }).line, "논리 콤보 4 · 위험 다루기 2/3", "the second scene of a rise is METRONOME's alone");
  assert.equal(readLogic({ logic: { ...holding, reach: 1 }, card: null, offered: [], relics: ["metronome"] }).line, "논리 콤보 4 · 위험 다루기 2/3 · 전환 가능");
  // With a card staked, the line is the streak as that card leaves it.
  const lines = (logic, type, offered = ["risk", "inference"]) => readLogic({ logic, card: card(type), offered }).line;
  assert.equal(lines(holding, "risk"), "논리 콤보 5 · 위험 다루기 3/3 · 이어 감");
  assert.equal(lines({ ...holding, held: 1 }, "risk"), "논리 콤보 4 · 위험 다루기 2/3 · 쌓는 중");
  assert.equal(lines(holding, "inference"), "논리 콤보 0 · 꼼꼼히 확인하기 1/3 · 끊김");
  assert.equal(lines({ ...holding, rose: true }, "inference"), "논리 콤보 5 · 꼼꼼히 확인하기 1/3 · 전환");
  assert.equal(lines(holding, "persistence", ["persistence", "inference"]), "논리 콤보 4 · 끝까지 버티기 1/3 · 유지");
  assert.equal(lines({ ...holding, held: 40 }, "risk"), "논리 콤보 5 · 위험 다루기 3/3 · 이어 감", "the hold is shown to three and no further");
  assert.equal(readLogic({ logic: holding, card: card("risk"), offered: [] }).bonus, 1.3125, "and the pot's own line prints what it pays");
  // The sentence the push and confirm buttons are described by says all of it.
  assert.equal(readLogic({ logic: holding, card: card("risk"), offered: [] }).spoken, "논리 콤보 5, 판돈 1.31배. 위험 다루기 3/3. 이 카드로 이어 감.");
  assert.equal(readLogic({ logic: { ...holding, rose: true }, card: null, offered: [] }).spoken, "논리 콤보 4, 판돈 1.25배. 위험 다루기 2/3. 압박이 올라 유형을 바꿔도 콤보가 오른다.");
});

test("a type's name is cut around one word, which is what a phone's card prints, and put back whole for a reader", () => {
  assert.deepEqual(getTypeParts("risk"), ["", "위험", " 다루기"]);
  assert.deepEqual(getTypeParts("inference"), ["꼼꼼히 ", "확인", "하기"]);
  assert.deepEqual(getTypeParts("persistence"), ["끝까지 ", "버티기", ""]);
  assert.deepEqual(getTypeParts("reframing"), ["판 ", "바꾸기", ""]);
  for (const type of Object.keys(easyCognitionLabels)) {
    assert.equal(getTypeParts(type).join(""), easyCognitionLabels[type], "the three pieces are the name");
    assert.ok(getTypeParts(type)[1].length >= 2 && getTypeParts(type)[1].length <= 3);
  }
  assert.equal(new Set(Object.keys(easyCognitionLabels).map((type) => getTypeParts(type)[1])).size, 4, "no two types print the same word");
  assert.deepEqual(getTypeParts("nothing"), ["", "", ""]);
  assert.deepEqual(getTypeParts(null), ["", "", ""]);

  // What a card's tag adds for a screen reader once the streak is in play (the tag itself is drawn in GauntletHand.jsx).
  assert.deepEqual(["grow", "build", "switch", "keep", "break", "none", undefined].map(describeCardMove), ["(콤보 이어 감)", "(콤보 쌓는 중)", "(콤보 전환)", "(콤보 유지)", "(콤보 끊김)", "", ""]);
});

test("the reveal says what the card did to the streak, one sentence a move", () => {
  const line = (made, extra = {}) => describeLogicMove({ type: "risk", tier: 1, rose: false, move: made, streak: 4, held: 3, bonus: 1.25, pot: 120, ...extra });
  assert.equal(line("grow"), "위험 다루기를 이어 갔다. 논리 콤보 4, 판돈 ×1.25.");
  assert.equal(line("build", { held: 2, streak: 0, bonus: 1 }), "위험 다루기 2/3. 같은 유형 세 번째부터 콤보가 오른다. 논리 콤보 0, 판돈 ×1.00.");
  assert.equal(line("switch", { type: "inference", rose: true }), "압박이 오른 판에서 꼼꼼히 확인하기로 바꿨다. 전환으로 콤보가 올랐다. 논리 콤보 4, 판돈 ×1.25.");
  assert.equal(line("keep", { type: "reframing" }), "지키던 유형의 카드가 이 장면에 없었다. 콤보는 그대로다. 논리 콤보 4, 판돈 ×1.25.");
  assert.equal(line("break", { type: "persistence", streak: 0 }), "압박이 오르지 않았는데 끝까지 버티기로 바꿨다. 논리 콤보는 0, 다시 1/3부터 센다.");
  assert.equal(line("bust", { streak: 0 }), "벽에 닿아 논리 콤보가 끊겼다.");
  assert.equal(line("bust", { streak: 6 }), "벽에 닿았지만 논리 콤보 6은 남았다.");
  assert.equal(line("bust", { streak: 5 }), "벽에 닿았지만 논리 콤보 5는 남았다.");
  for (const none of [line("none"), describeLogicMove(null), describeLogicMove(undefined), describeLogicMove({ move: "leap" })]) assert.equal(none, null);
  // The archive's one line is only written when the streak paid.
  assert.deepEqual(describeLogicLog({ streak: 4, bonus: 1.25, pot: 1200 }), { label: "LOGIC STREAK", text: "논리 콤보 4 · 판돈 ×1.25 · +1,200" });
  for (const unpaid of [{ streak: 0, bonus: 1, pot: 0 }, { streak: 3 }, null]) assert.equal(describeLogicLog(unpaid), null);
});

test("the run summary a telemetry row carries has the streak and the hand's share, and none of the keys a graded press wrote", () => {
  // The record of a run begun before 2026-10-11: its keys are read, and the row is written in this build's.
  const run = normalizeRunState({ beatCombo: 3, bestCombo: 9, focusPerfects: 2, focusMisses: 1, grooveVault: 120, vault: 900, logic: { streak: 5, best: 12, type: "risk", held: 7 } });
  const summary = createRunSummary(run);
  assert.deepEqual([summary.logicStreak, summary.bestLogic], [5, 12]);
  assert.equal(summary.handVault, 120);
  // The server asks for none of the keys left out: it types `beatCombo`, `bestCombo` and `grooveVault` only when a row has them.
  assert.deepEqual(Object.keys(summary), ["windowIndex", "runPot", "vault", "streak", "busts", "cashes", "bestMultiplier", "lastOutcome", "lastGauge", "logicStreak", "bestLogic", "bestFocusCombo", "focusHits", "stanceMastery", "handVault", "relics", "mutations"]);
  assert.deepEqual([createRunSummary({}).logicStreak, createRunSummary({}).bestLogic], [0, 0]);
});

test("a replayed case's first record is read from an entry logged before or after 2026-10-10", () => {
  const first = { busts: 2, cashes: 6, bestMultiplier: 8, potBanked: 900, potLost: 300, pushes: 14, bestCombo: 7, beatHits: 9, perfects: 4, slips: 2, grooveBanked: 80 };
  const before = createTableRecord([{ threshold: { busted: false, pot: 10, tempo: { firstRecord: first } } }]);
  const after = createTableRecord([{ threshold: { busted: false, pot: 10, firstRecord: first } }]);
  assert.deepEqual(before, after);
  assert.deepEqual([after.busts, after.bestCombo, after.bestLogic], [2, 7, 0]);
  const practice = openCaseRun(RUN_INITIAL_STATE, { replayOf: { pushRecord: first } });
  const closing = resolveWindow({ run: practice, window: closed(COLD), card: card("risk"), caseClosed: true });
  const { bestCombo: _combo, beatHits: _hits, perfects: _perfects, slips: _slips, ...kept } = first;
  assert.deepEqual(closing.verdict.firstRecord, kept, "the verdict that closes a replay carries it, with the keys the table record has");
  assert.equal("firstRecord" in resolveWindow({ run: RUN_INITIAL_STATE, window: closed(COLD), card: card("risk"), caseClosed: true }).verdict, false);
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

/* --------------------------------------------------------- what it pays */

test("the streak pays 1 + min(0.5, streak x 0.0625) and the hand is capped as it was", () => {
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
  // A groove is only ever one a window put down before 2026-10-10 held, and is paid as it was.
  assert.equal(getHandBonus(10, 0, "strike"), 1.3);
  assert.equal(getHandBonus(0, 0, "strike"), 1);
});

test("the pot is paid on the streak the card made", () => {
  const run = normalizeRunState({ ...RUN_INITIAL_STATE, logic: { ...LOGIC_INITIAL, type: "risk", held: 5, streak: 3, best: 3 } });
  const window = closed(44);
  const paid = resolveWindow({ run, window, card: card("risk") });
  const base = Math.round(paid.verdict.chips * paid.verdict.multiplier);
  assert.equal(paid.verdict.logic.streak, 4);
  assert.equal(paid.verdict.pot, Math.round(paid.verdict.chips * paid.verdict.multiplier * 1.25), "1 + 4 x 0.0625");
  assert.deepEqual([paid.verdict.logic.bonus, paid.verdict.logic.pot], [1.25, paid.verdict.pot - base], "the hand's share is told apart");
  assert.equal(paid.nextRun.runHand, paid.verdict.pot - base);
  assert.equal(paid.verdict.focus.potMultiplier, 1);
  assert.equal("tempo" in paid.verdict, false, "the verdict has no line for a graded press");
  // A card with no type is paid bare, whatever the run carries: no streak moved for it.
  assert.equal(resolveWindow({ run, window, card: { ...card("risk"), cognition: undefined } }).verdict.pot, Math.round(base * 1.19), "the streak it stood at");
  // A card that ends the streak is paid as a bare one, and a bust pays nothing.
  assert.equal(resolveWindow({ run, window, card: card("inference"), offered: ["risk", "inference"] }).verdict.pot, base);
  assert.equal(resolveWindow({ run, window: closed(44, "bust"), card: card("risk") }).verdict.pot, 0);
  // At a streak of 8 and past it the pot is at the cap, with or without a full LOCK.
  const capped = normalizeRunState({ ...run, logic: { ...run.logic, streak: 30, best: 30 } });
  assert.equal(resolveWindow({ run: capped, window, card: card("risk") }).verdict.pot, Math.round(base * HAND_CAP));
  const locked = resolveWindow({ run: capped, window: { ...window, focus: 100, focusHits: 5 }, card: card("risk") });
  assert.equal(locked.verdict.pot, Math.round(base * HAND_CAP));
  assert.equal(locked.verdict.focus.pot, 0, "LOCK adds nothing over a streak already at the cap");
  // In a case without the rule the streak neither moves nor pays.
  const prologue = resolveWindow({ run, window, card: card("inference"), rules: step("prologue01") });
  assert.deepEqual([prologue.verdict.logic.move, prologue.nextRun.logic.streak, prologue.verdict.pot], ["none", 3, base]);
});

test("a window put down before 2026-10-10 with a groove, and picked up after, is paid the larger of the two", () => {
  const window = closed(44, "cashed", { groove: 10, beatCombo: 4, maxCombo: 4, beatHits: 4 });
  const run = (streak) => normalizeRunState({ ...RUN_INITIAL_STATE, logic: { ...LOGIC_INITIAL, type: "risk", held: 5, streak, best: streak } });
  const base = (settled) => Math.round(settled.verdict.chips * settled.verdict.multiplier);
  // Groove 10 is x1.3; a streak of 2 (after this card) is x1.125: the pot the player saw stands.
  const low = resolveWindow({ run: run(1), window, card: card("risk") });
  assert.equal(low.verdict.pot, Math.round(base(low) * 1.3));
  // A streak of 7 (after this card) is x1.4375: the streak is the larger.
  const high = resolveWindow({ run: run(6), window, card: card("risk") });
  assert.equal(high.verdict.pot, Math.round(base(high) * 1.44));
  assert.equal(getHandBonus(10, 0, "strike", 2), 1.3);
  assert.equal(getHandBonus(10, 0, "strike", 7), 1.44);
  assert.equal(getHandBonus(40, 0, "strike", 0), 1.5);
  // In a case without the rule that groove is not there to be settled, as it never was.
  const off = resolveWindow({ run: run(1), window, card: card("risk"), rules: step("prologue01") });
  assert.equal(off.verdict.pot, base(off));
});

test("a push is not graded and a LOCK press charges for clock", () => {
  const open = (seed = "lock-a") => reduceWindow(createWindow({ seed }), { type: "SELECT", id: "a" });
  const ungraded = reduceWindow(open(), { type: "PUSH" });
  for (const grade of ["perfect", "good", "miss", null]) {
    assert.deepEqual(reduceWindow(open(), { type: "PUSH", grade }), ungraded, `${grade}: a push is a push`);
  }

  for (const mode of ["strike", "steady", "expose"]) {
    let window = reduceWindow(open(`lock-${mode}`), { type: "SET_FOCUS_MODE", mode });
    const wall = window.wall;
    for (let press = 1; press <= 6; press += 1) {
      const before = window;
      const scored = scoreFocus(before);
      // Whatever a caller sends as a grade, the press is the same press.
      const pressed = reduceWindow(before, { type: "FOCUS", grade: ["miss", "perfect", null, "good", "miss", undefined][press - 1] });
      assert.equal(pressed.focus, scored.focus, `${mode} press ${press}`);
      assert.equal(pressed.focusCombo, press);
      assert.equal(pressed.focusHits, press);
      assert.equal(pressed.elapsed, before.elapsed + LOCK_PRESS_SECONDS, "and 1.5 seconds of table clock");
      // No heat of its own: the gauge moves only by what the stance cools and what the clock creeps.
      const expected = reduceWindow({ ...before, gauge: Math.max(0, before.gauge - scored.focusRelief), elapsed: before.elapsed }, { type: "TICK", delta: 1 });
      const crept = reduceWindow(expected, { type: "TICK", delta: LOCK_PRESS_SECONDS - 1 });
      assert.equal(pressed.gauge, crept.gauge);
      assert.equal(pressed.wall, wall);
      assert.notEqual(pressed.cause, "focus");
      window = pressed;
    }
    assert.equal(window.status, "live");
  }
  // The decided charge: 13 and 2 a press before it, by the stance's scale.
  assert.deepEqual(["strike", "steady", "expose"].map((focusMode) => [0, 1, 2, 3, 4].map((focusCombo) => scoreFocus({ focus: 0, focusCombo, focusMode }).focus)), [[17, 20, 22, 24, 26], [14, 15, 17, 19, 21], [15, 17, 19, 21, 23]]);
  assert.deepEqual(["strike", "steady", "expose"].map((focusMode) => scoreFocus({ focusMode }).focusRelief), [0, 2, 0]);

  // Without `lock`, or with no card staked, the press is still refused.
  const bare = createWindow({ seed: "lock-bare" });
  assert.equal(reduceWindow(bare, { type: "FOCUS" }), bare);
  assert.equal(reduceWindow(open(), { type: "FOCUS" }, step("prologue03")).focus, 0);
});

test("a LOCK press cannot bust on its own, and the clock it spends can only close a window the clock's way", () => {
  const fresh = reduceWindow(createWindow({ seed: "lock-wall" }), { type: "SELECT", id: "a" });
  // Just under the wall, before the grace has run: a press does not heat the gauge.
  const brink = { ...fresh, gauge: fresh.wall - 0.5 };
  const pressed = reduceWindow(brink, { type: "FOCUS", grade: "miss" });
  assert.deepEqual([pressed.status, pressed.cause, pressed.gauge], ["live", null, brink.gauge]);
  // Late in the window the clock it costs creeps heat, and that can reach the wall or the end of the clock.
  const late = reduceWindow({ ...brink, elapsed: 20 }, { type: "FOCUS" });
  assert.deepEqual([late.status, late.cause], ["bust", "creep"]);
  const last = reduceWindow({ ...fresh, elapsed: fresh.schema.seconds - 1, schema: { ...fresh.schema, creep: 0 } }, { type: "FOCUS" });
  assert.deepEqual([last.status, last.cause], ["bust", "timeout"]);
  assert.equal(VERDICT_CAUSES.includes("focus"), false, "so no window closes as a LOCK's own bust");
  // A hold a build before 2026-10-10 wrote under the slam of one is a bust all the same: a window left.
  const held = createWindow({ seed: "lock-held", abandoned: true, closedAs: "focus" });
  const settled = resolveWindow({ run: RUN_INITIAL_STATE, window: held, card: card("risk") }).verdict;
  assert.deepEqual([settled.outcome, settled.cause, settled.pot], ["bust", "abandon", 0]);
  assert.equal(splitOpenSeed(createOpenSeed("seed", "tab", "focus")).closedAs, null);
  assert.equal(splitOpenSeed("seed#tab~focus").closedAs, null);
});

test("the stances, mastery and the boards they carry are what they were", () => {
  for (const mode of ["strike", "steady", "expose"]) {
    let window = reduceWindow(reduceWindow(createWindow({ seed: `carry-${mode}` }), { type: "SELECT", id: "a" }), { type: "SET_FOCUS_MODE", mode });
    while (window.focus < STANCE_CHARGE) window = reduceWindow(window, { type: "FOCUS" });
    window = reduceWindow(reduceWindow(window, { type: "PUSH" }), { type: "CASH" });
    assert.equal(window.status, "cashed");
    const settled = resolveWindow({ run: RUN_INITIAL_STATE, window, card: card("risk") });
    assert.equal(settled.verdict.focus.stanceEarned, true, mode);
    assert.equal(settled.nextRun.stanceMastery[mode], 1);
    assert.ok(settled.verdict.nextMutations.some((mutation) => mutation.id === { strike: "strikeWake", steady: "steadyLine", expose: "exposedHand" }[mode]), "the board the stance carries forward");
    assert.ok(settled.verdict.focus.resourceMultiplier > 1);
    assert.ok(settled.verdict.focus.pot > 0, "with no streak the LOCK pot is LOCK's");
  }
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
    const { verdict, nextRun } = resolveWindow(settlement);
    assert.deepEqual(Object.keys(verdict.logic), ["type", "tier", "rose", "move", "streak", "held", "bonus", "pot"]);
    assert.ok(moves.has(verdict.logic.move));
    assert.ok([0, 1, 2, 3].includes(verdict.logic.tier));
    assert.equal(typeof verdict.logic.rose, "boolean");
    assert.ok(Number.isInteger(verdict.logic.streak) && Number.isInteger(verdict.logic.held) && Number.isInteger(verdict.logic.pot));
    assert.ok(verdict.logic.bonus >= 1 && verdict.logic.bonus <= HAND_CAP);
    assert.deepEqual(Object.keys(nextRun.logic), ["streak", "best", "type", "held", "heat", "rose", "reach"]);
  }
});
