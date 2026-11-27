// RULES_MARK 8's audit, links and chips (G35, G32, G29 are rules-mark9.test.mjs's).
import "./helpers/markEight.mjs";
import assert from "node:assert/strict";
import test from "node:test";
import {
  applyGauntletEffect,
  BASE_SCHEMA,
  buildNextSchema,
  canBreathe,
  createWindow,
  getBoardMark,
  getBreathGauge,
  getFocusBonus,
  getLockCap,
  getWindowBand,
  LOCK_CAP,
  normalizeRunState,
  openCaseRun,
  reduceWindow,
  resolveWindow,
  RUN_INITIAL_STATE,
  suspendWindow,
} from "../../src/gauntlet/gauntletEngine.js";
import { countAudit } from "../../src/gauntlet/auditRisk.js";
import {
  BREATH_GAUGE,
  BREATH_HOT_FROM,
  BREATH_HOT_GAUGE, BREATH_HOT_WALL,
  BREATH_WALL,
  countNarrows,
  EXPOSURE_FROM,
  EXPOSURE_HEAT,
  EXPOSURE_STEPS,
  getCatchChance,
  getExposure,
  isNextOn,
  narrowTrustAt,
  NEXT_RULE,
  OLD_RULE,
  RULES_NEXT_MARK,
  SIGN_CHIPS,
  STRIKE_HOT_CAP,
  STRIKE_HOT_GAUGE,
  wantsNextRules,
  withNextRules,
} from "../../src/gauntlet/nextTableRules.js";
import { RULES_NEXT_DEFAULT, rulesNextOn } from "../../src/gauntlet/rulesNext.js";
import { readExposure } from "../../src/gauntlet/tableReadout.js";
import { readTableMeters } from "../../src/gauntlet/tableMeters.js";
import { ALL_RULES } from "../../src/gauntlet/tableUnlocks.js";
import { compareReplay } from "../../src/gauntlet/windowReplay.js";
import { getRowRules } from "../../src/rankingRecheck.js";
import { isSignScene } from "../../src/state/settleChoice.js";
import { CASE_RESULT_NODES } from "../../src/gameCases.js";
import { nodes } from "../../src/gameData.js";

/**
 * G1·G2·G3·G6·G7 (2026-11-19): the next table rules, on by default. What they
 * are worth is check:pressure's (the `next G` rows); here, what they do.
 */
const OLD = withNextRules(ALL_RULES, false);
const NEXT = withNextRules(ALL_RULES, true);
const card = (effect) => ({ id: "c", label: "c", effect });
const people = card({ trust: 10, capital: -4 });
const position = card({ capital: 10, trust: -4 });

test("the next rules are the default, and a rule set can name either", () => {
  assert.equal(RULES_NEXT_DEFAULT, true);
  assert.equal(rulesNextOn({}), true);
  assert.equal(wantsNextRules({ process: { env: { RULES_NEXT: "0" } } }), false);
  assert.equal(wantsNextRules({ process: { env: { RULES_NEXT: "1" } } }), true);
  assert.equal(isNextOn(ALL_RULES), true, "a case's own set plays what the page plays");
  assert.equal(isNextOn(OLD), false);
  assert.equal(isNextOn(NEXT), true);
  assert.equal(withNextRules(ALL_RULES, true), ALL_RULES, "already so: the same set");
  assert.equal(withNextRules(ALL_RULES, false), OLD, "the same old set each time");
  assert.ok(OLD.has(OLD_RULE) && !OLD.has(NEXT_RULE) && OLD.has("lock"));
  assert.equal(isNextOn(withNextRules(OLD, true)), true);
  assert.equal(isNextOn(withNextRules({ has: () => true }, false)), false, "a stand-in that is not a Set is wrapped");
});

test("G1: holding one direction builds 눈에 띔, a cold cash can be caught, and a change of direction halves the streak", () => {
  assert.equal(getExposure(EXPOSURE_FROM), 0);
  assert.equal(getExposure(EXPOSURE_FROM + 3), 3);
  assert.ok(getCatchChance(EXPOSURE_STEPS + 5) === getCatchChance(EXPOSURE_STEPS), "the chance stops growing");
  const held = normalizeRunState({ logic: { streak: 8, best: 8, type: "people", held: EXPOSURE_FROM + EXPOSURE_STEPS } });
  let caught = 0;
  let cashes = 0;
  for (let index = 0; index < 200; index += 1) {
    const { verdict, nextRun } = resolveWindow({ run: held, window: { status: "cashed", gauge: EXPOSURE_HEAT - 5, wall: 90, pushes: 2, seed: `g1:${index}` }, card: people, rules: NEXT });
    assert.ok(verdict.exposure.points > 0);
    cashes += 1;
    if (verdict.exposure.caught) {
      caught += 1;
      assert.equal(verdict.pot, 0, "a caught board pays no pot");
      assert.equal(nextRun.logic.streak, Math.floor((held.logic.streak + 1) / 2), "and halves the streak");
    } else assert.ok(verdict.pot > 0);
  }
  assert.ok(caught > 0 && caught < cashes, `some cold cashes are caught, not all: ${caught}/${cashes}`);
  const hot = resolveWindow({ run: held, window: { status: "cashed", gauge: EXPOSURE_HEAT, wall: 90, pushes: 2, seed: "g1:hot" }, card: people, rules: NEXT }).verdict;
  assert.equal(hot.exposure.caught, false, "a cash at the line is never caught");
  const old = resolveWindow({ run: held, window: { status: "cashed", gauge: 10, wall: 90, pushes: 2, seed: "g1:0" }, card: people, rules: OLD }).verdict;
  assert.equal(old.exposure, undefined, "the old rules watch nothing");
  // A change of direction: halved under the next rules, ended under the old.
  const switched = resolveWindow({ run: held, window: { status: "cashed", gauge: 50, wall: 90, pushes: 2, seed: "g1:s" }, card: position, rules: NEXT });
  assert.equal(switched.verdict.logic.move, "break");
  assert.equal(switched.nextRun.logic.streak, 4);
  assert.equal(switched.verdict.exposure, undefined, "and 눈에 띔 is gone");
  assert.equal(resolveWindow({ run: held, window: { status: "cashed", gauge: 50, wall: 90, pushes: 2 }, card: position, rules: OLD }).nextRun.logic.streak, 0);
  // A charged EXPOSE cash is never caught (G3).
  for (let index = 0; index < 50; index += 1) {
    const shielded = resolveWindow({ run: held, window: { status: "cashed", gauge: 10, wall: 90, pushes: 2, seed: `g1:${index}`, focus: 100, focusMode: "expose", focusHits: 5 }, card: people, rules: NEXT }).verdict;
    assert.equal(shielded.exposure.caught, false);
    assert.equal(shielded.auditShield, true);
  }
  // As the table says it: the step, never a percentage.
  assert.equal(readExposure(0, 0), null);
  assert.equal(readExposure(2, 0).cleared, true);
  assert.doesNotMatch(readExposure(0, 3).spoken, /%/);
});

test("G2: the case's second looks climb in price, and the settle bills the price the verdict carries", () => {
  assert.deepEqual([0, 1, 2, 3, 4, 5].map(narrowTrustAt), [2, 2, 3, 3, 4, 4]);
  assert.equal(countNarrows([{ threshold: { narrowed: true } }, { threshold: {} }, { threshold: { narrowed: true } }, {}]), 2);
  const narrowed = { status: "cashed", gauge: 50, wall: 90, pushes: 2, scouted: true, narrowed: true };
  const verdict = resolveWindow({ run: RUN_INITIAL_STATE, window: narrowed, card: people, rules: NEXT, narrows: 4 }).verdict;
  assert.equal(verdict.narrowTrust, 4);
  assert.equal(resolveWindow({ run: RUN_INITIAL_STATE, window: narrowed, card: people, rules: OLD, narrows: 4 }).verdict.narrowTrust, undefined);
  const billed = applyGauntletEffect({ trust: 0 }, { outcome: "cash", gauge: 50, scouted: true, narrowed: true, narrowTrust: verdict.narrowTrust });
  assert.equal(billed.trust, -5, "the look's 1 and this narrow's 4");
  assert.equal(applyGauntletEffect({ trust: 0 }, { outcome: "cash", gauge: 50, scouted: true, narrowed: true }).trust, -3, "an older entry: the old price");
});

test("G3: LOCK is shut where the carried streak fills its cap, STRIKE pays more hot, EXPOSE adds no audit mark", () => {
  assert.equal(getLockCap("strike", STRIKE_HOT_GAUGE, true), STRIKE_HOT_CAP);
  assert.equal(getLockCap("strike", STRIKE_HOT_GAUGE - 1, true), LOCK_CAP);
  assert.equal(getLockCap("steady", 90, true), LOCK_CAP);
  assert.equal(getLockCap("strike", 90, false), LOCK_CAP);
  const capped = openCaseRun(normalizeRunState({ logic: { streak: 8, best: 8, type: "people", held: 3 } }), { rules: NEXT });
  assert.equal(capped.schema.lockShut, true);
  assert.equal(openCaseRun(normalizeRunState({ logic: { streak: 7, type: "people", held: 3 } }), { rules: NEXT }).schema.lockShut, undefined);
  assert.equal(openCaseRun(normalizeRunState({ logic: { streak: 8, type: "people", held: 3 } }), { rules: OLD }).schema.lockShut, undefined);
  let win = reduceWindow(createWindow({ schema: capped.schema, seed: "g3" }), { type: "SELECT", id: "c" }, NEXT);
  assert.equal(reduceWindow(win, { type: "FOCUS" }, NEXT), win, "refused: it would add nothing");
  assert.notEqual(reduceWindow(win, { type: "FOCUS" }, OLD), win, "the old rules let it charge");
  // A dealt board carries it from the streak the settle left.
  const next = buildNextSchema({ outcome: "cash", gauge: 40, pushes: 2, streak: 0, rules: NEXT, logicStreak: 9 });
  assert.equal(next.lockShut, true);
  // EXPOSE's shield, read back off the log.
  assert.equal(countAudit([{ threshold: { gauge: 20, pushes: 2 } }, { threshold: { gauge: 20, pushes: 2, auditShield: true } }]), 1);
  // The HUD under them (on by default): STEADY's weaker profile, and `note`, what the LOCK button's description adds.
  // table-meters.test.mjs holds the same readout on the old table.
  const hud = { gauge: 30, wall: 70, tellOffset: 4, focus: 40, focusMode: "steady", elapsed: 12, schema: { ...BASE_SCHEMA, seconds: 45 } };
  const { note, ...focusBonus } = readTableMeters({ win: hud, schema: hud.schema, selectedCard: null }).focusBonus;
  assert.deepEqual(focusBonus, getFocusBonus(hud.focus, hud.focusMode, true));
  assert.equal(typeof note, "string");
  assert.ok(note.length > 0, "STRIKE's hotter cap is said on the button");
});

test("G6: the case's last board is its 결재 판: the stake ×1.5, one cell of the band shown", () => {
  const plain = buildNextSchema({ outcome: "cash", gauge: 40, pushes: 2, streak: 0, rules: NEXT });
  const sign = buildNextSchema({ outcome: "cash", gauge: 40, pushes: 2, streak: 0, rules: NEXT, sign: true });
  assert.equal(sign.chipsScale, plain.chipsScale * SIGN_CHIPS);
  assert.equal(getBoardMark(sign), "sign");
  assert.equal(buildNextSchema({ outcome: "cash", gauge: 40, pushes: 2, streak: 0, rules: OLD, sign: true }).mutations.includes("sign"), false);
  assert.equal(buildNextSchema({ outcome: "cash", gauge: 40, pushes: 2, streak: 0, rules: NEXT, sign: true, caseClosed: true }).mutations.includes("sign"), false);
  for (let index = 0; index < 100; index += 1) {
    const win = createWindow({ schema: sign, seed: `g6:${index}` });
    const band = getWindowBand(win);
    assert.ok(band.shown >= sign.wallMin && band.shown <= win.wall, "the cell is at or under the wall");
    assert.equal(band.wallMin, band.shown);
    assert.equal(getWindowBand(createWindow({ schema: plain, seed: `g6:${index}` })).shown, undefined);
  }
  // In the season: a scene whose every card closes the case.
  const [caseId, result] = Object.entries(CASE_RESULT_NODES)[0];
  const last = Object.entries(nodes).find(([, node]) => node.choices?.length && node.choices.filter((choice) => choice.type !== "reframe").every((choice) => choice.next === result));
  assert.ok(last, `${caseId} has a last scene`);
  assert.equal(isSignScene(caseId, last[0]), true);
  assert.equal(isSignScene(caseId, "no-such-scene"), false);
});

test("G7: 숨 고르기, once, on the board after a BUST and before its first push", () => {
  const after = buildNextSchema({ outcome: "bust", cause: "push", gauge: 70, pushes: 3, streak: 0, rules: NEXT });
  const win = createWindow({ schema: after, seed: "g7" });
  assert.equal(canBreathe(win, NEXT), true);
  assert.equal(canBreathe(win, OLD), false);
  assert.equal(canBreathe(createWindow({ schema: BASE_SCHEMA, seed: "g7" }), NEXT), false, "a fresh board has nothing to ease");
  const breathed = reduceWindow(win, { type: "BREATHE" }, NEXT);
  assert.equal(breathed.breathed, true);
  // G15 (11-20): a BUST at BREATH_HOT_FROM or over is eased BREATH_HOT_GAUGE, one under it BREATH_GAUGE.
  assert.equal(after.bustHeat, 70);
  assert.equal(getBreathGauge(win.schema), BREATH_HOT_GAUGE);
  assert.equal(breathed.gauge, Math.max(0, win.gauge - BREATH_HOT_GAUGE));
  const cool = createWindow({ schema: buildNextSchema({ outcome: "bust", cause: "push", gauge: BREATH_HOT_FROM - 1, pushes: 3, streak: 0, rules: NEXT }), seed: "g7" });
  assert.equal(reduceWindow(cool, { type: "BREATHE" }, NEXT).gauge, Math.max(0, cool.gauge - BREATH_GAUGE));
  assert.equal(buildNextSchema({ outcome: "bust", cause: "push", gauge: 70, pushes: 3, streak: 0, rules: OLD }).bustHeat, undefined, "the old table writes none");
  // G22 (RULES_MARK 8): this board's BUST went at 70, so the wall moves BREATH_HOT_WALL.
  assert.equal(breathed.wall, win.wall + BREATH_HOT_WALL);
  assert.equal(reduceWindow(cool, { type: "BREATHE" }, NEXT).wall, cool.wall + BREATH_WALL, "under BREATH_HOT_FROM it moves BREATH_WALL");
  assert.equal(breathed.elapsed, 2);
  assert.equal(reduceWindow(breathed, { type: "BREATHE" }, NEXT), breathed, "once");
  assert.equal(reduceWindow(reduceWindow(win, { type: "PUSH" }, NEXT), { type: "BREATHE" }, NEXT).breathed, undefined, "not after a push");
  // Put down and picked up, it keeps the wall it moved back.
  const resumed = createWindow({ schema: after, seed: "g7", resume: suspendWindow(breathed, 3).window });
  assert.equal(resumed.wall, breathed.wall);
  assert.equal(resumed.breathed, true);
  // The replay holds a log to it.
  assert.deepEqual(compareReplay({ busted: false, cause: "cash", gauge: Math.round(breathed.gauge), wall: breathed.wall, pushes: 0 }, { ...breathed, status: "cashed", cause: "cash" }), ["breath"]);
  assert.deepEqual(compareReplay({ busted: false, cause: "cash", gauge: Math.round(breathed.gauge), wall: breathed.wall, pushes: 0, breathed: true }, { ...breathed, status: "cashed", cause: "cash" }), []);
});

test("the recheck plays a row under the rules its RULES_MARK says", () => {
  assert.equal(isNextOn(getRowRules("case10", {}, RULES_NEXT_MARK)), true);
  assert.equal(isNextOn(getRowRules("case10", {}, RULES_NEXT_MARK - 1)), false);
  assert.equal(getRowRules("case10", {}), getRowRules("case10", {}, undefined), "no mark: the page's own");
});

test("a rule's chips are paid as dealt: the window's board, not the run's bare one (11-20 hotfix)", async () => {
  const engine = await import("../../src/gauntlet/gauntletEngine.js");
  const card = { id: "c", effect: { capital: 7, trust: 11, humanCost: 4 } };
  for (const caseId of ["case15", "case09"]) {
    const run = engine.stampCaseOpen(engine.normalizeRunState({}), { caseId });
    const board = engine.getTableSchema(run);
    assert.ok(board.chipsScale > run.schema.chipsScale, `${caseId} deals thicker chips`);
    const win = { ...engine.createWindow({ schema: board, seed: caseId }), status: "cashed", cause: "cash", gauge: 40, pushes: 2 };
    assert.equal(engine.resolveWindow({ run, window: win, card }).verdict.chips, engine.getCardChips(card, board), caseId);
  }
});
