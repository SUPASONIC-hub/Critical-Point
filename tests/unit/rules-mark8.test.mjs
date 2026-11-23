import assert from "node:assert/strict";
import test from "node:test";
import {
  asksOpening,
  BASE_SCHEMA,
  buildNextSchema,
  createWindow,
  getBreathWall,
  getNarrowReach,
  getRelicDraftCost,
  getTableSchema,
  normalizeCaseOpen,
  normalizeRelicDraft,
  normalizeRunState,
  openRelicDraft,
  reduceWindow,
  refineRelic,
  RULES_MARK,
  signCase,
  stampCaseOpen,
} from "../../src/gauntlet/gauntletEngine.js";
import { BREATH_HOT_WALL, BREATH_WALL, CHARGE_LEAK_GRACE, CHARGE_LEAK_STEP, isMarkEightOn, isOpeningCase, OPEN_BIG_CHIPS, OPEN_BIG_WALL, RULES_EIGHT_MARK, withMarkEight, withMarkSeven, withNextRules } from "../../src/gauntlet/nextTableRules.js";
import { getRefinedBoost, readRelicBoost, REFINE_COST, RELIC_BOOST_CAP, RELIC_BOOSTS } from "../../src/gauntlet/relicsNext.js";
import { rulesTrialOn } from "../../src/gauntlet/rulesNext.js";
import { readDraftSpend } from "../../src/gauntlet/draftSpend.js";
import { getRowRules } from "../../src/rankingRecheck.js";
import { getSlackGates } from "../../src/seasonStanding.js";
import { ALL_RULES } from "../../src/gauntlet/tableUnlocks.js";

const EIGHT = withMarkEight(ALL_RULES, true);
const SEVEN = withMarkEight(ALL_RULES, false);

test("RULES_MARK 8: the engine's mark, on by default, and a row of 5 to 7 played without it", () => {
  assert.equal(RULES_MARK, 8);
  assert.equal(RULES_EIGHT_MARK, 8);
  assert.equal(isMarkEightOn(ALL_RULES), true);
  assert.equal(isMarkEightOn(SEVEN), false);
  assert.equal(isMarkEightOn(withMarkSeven(ALL_RULES, false)), false, "a set without 7's rules has none of 8's");
  assert.equal(isMarkEightOn(withNextRules(ALL_RULES, false)), false);
  for (const mark of [5, 6, 7]) assert.equal(isMarkEightOn(getRowRules("case20", {}, mark)), false, `mark ${mark}`);
  assert.equal(isMarkEightOn(getRowRules("case20", {}, 8)), true);
});

test("G19: the late bill asks for all the heat from 66, and a plain board's start cap (wall low end - 8) still holds it", () => {
  const dealt = (gauge, rules) => buildNextSchema({ outcome: "cash", cause: "cash", gauge, pushes: 4, streak: 0, rules, twist: "lateBill" }).startGauge;
  assert.equal(dealt(60, EIGHT), 45, "under 66, three quarters");
  // Measured 11-23: three quarters of 66 is already over the cap of 48, so on a plain board 8 deals what 7 dealt.
  assert.equal(dealt(70, EIGHT), 48);
  assert.equal(dealt(70, SEVEN), 48);
});

test("G21: METRONOME pays on a switch and on the first board past six in a row", () => {
  const cash = { gauge: 40, pushes: 2, streak: 3, mutations: [], clockLeft: 0.2, move: "grow", afterBust: false };
  assert.deepEqual(readRelicBoost(["metronome"], cash).fired, []);
  assert.deepEqual(readRelicBoost(["metronome"], { ...cash, heldPast: true }).fired, ["metronome"]);
  assert.deepEqual(readRelicBoost(["metronome"], { ...cash, move: "switch" }).fired, ["metronome"]);
});

test("G22: only a BUST at 60 or over deals the further 숨 고르기", () => {
  const board = (gauge, rules) => buildNextSchema({ outcome: "bust", cause: "push", gauge, pushes: 3, streak: 0, rules });
  assert.equal(getBreathWall(board(60, EIGHT)), BREATH_HOT_WALL);
  assert.equal(getBreathWall(board(59, EIGHT)), BREATH_WALL);
  assert.equal(getBreathWall(board(70, SEVEN)), BREATH_WALL);
});

test("G23: 사건 08 to 42 ask how to open, and opening big pays more on a nearer wall", () => {
  assert.deepEqual(["case07", "case08", "case42", "case43", "case49", "final"].map(isOpeningCase), [false, true, true, false, false, false]);
  const open = (caseId, extra = {}) => stampCaseOpen(normalizeRunState({ windowIndex: 70, ...extra }), { caseId });
  assert.equal(asksOpening(open("case07")), false);
  assert.equal(asksOpening(open("case44")), false, "8막 signs in the same place");
  assert.equal(asksOpening(open("case20", { story: true })), false);
  const run = open("case20");
  assert.equal(asksOpening(run), true);
  assert.equal(asksOpening({ ...run, windowIndex: 71 }), false, "once the first board is played");
  assert.equal(getTableSchema(run).openBig, undefined, "not choosing is 보통");
  const big = signCase(run, "big");
  const board = getTableSchema(big);
  assert.equal(board.wallMin, OPEN_BIG_WALL);
  assert.ok(Math.abs(board.chipsScale - getTableSchema(run).chipsScale * OPEN_BIG_CHIPS) < 1e-9);
  assert.equal(getTableSchema(big), board, "one object per board");
  assert.equal(createWindow({ schema: board, seed: "g23" }).schema.wallMin, OPEN_BIG_WALL, "the deal keeps the band under the floor");
  assert.equal(normalizeCaseOpen(big.open).opening, "big", "the open snapshot keeps it");
  assert.equal(signCase(open("case07"), "big").open.opening, undefined);
});

test("G25: a refined tool pays half as much bonus again, once a season, and is priced on the draft", () => {
  assert.equal(getRefinedBoost("frontPage"), 1.3);
  const cash = { gauge: 40, pushes: 2, streak: 0, move: "grow", mutations: ["overclock"], clockLeft: 0.1, afterBust: false };
  assert.equal(readRelicBoost(["frontPage"], cash, RELIC_BOOST_CAP, ["frontPage"]).factor, 1.3);
  // Together they stay under the cap, or the biggest alone: a second tool never takes from the first.
  const both = { ...cash, gauge: 80, clockLeft: 0.9 };
  const held = readRelicBoost(["frontPage", "heatSink", "testimony"], both, RELIC_BOOST_CAP, ["heatSink"]);
  assert.equal(held.factor, getRefinedBoost("heatSink"));
  assert.equal(held.capped, true);
  assert.ok(held.factor > RELIC_BOOSTS.heatSink.boost);
  const run = normalizeRunState({ vault: REFINE_COST + 100, relics: ["frontPage", "insurance"], ...openRelicDraft("g25", ["heatSink", "encore", "testimony", "coldBlood"], ["frontPage", "insurance"]) });
  assert.deepEqual(readDraftSpend(run).refine.targets, ["frontPage"], "a tool with no condition has nothing to refine");
  const paid = refineRelic(run, "frontPage");
  assert.equal(paid.vault, 100);
  assert.deepEqual(paid.refined, ["frontPage"]);
  assert.equal(paid.relicDraft.cost, REFINE_COST);
  assert.equal(getRelicDraftCost(normalizeRelicDraft(paid.relicDraft)), REFINE_COST);
  assert.equal(readDraftSpend(paid).refine.reason, "used");
  assert.equal(refineRelic(run, "insurance").vault, run.vault);
  assert.equal(refineRelic({ ...run, vault: REFINE_COST - 1 }, "frontPage").vault, REFINE_COST - 1);
  assert.equal(refineRelic({ ...run, story: true }, "frontPage").vault, run.vault);
});

test("G26: an open slack door lowers the record bar to 0.7 and OPEN OVERSIGHT's legitimacy by 3", () => {
  assert.deepEqual(getSlackGates(0.8), { clueRate: 0.7, oversight: 3 });
});

test("G24 and G27 stay behind the trial, which the public site cannot turn on", () => {
  assert.equal(getNarrowReach(), 7, "14 cells unless the trial says otherwise");
  const page = (hostname, search) => ({ location: { hostname, search } });
  assert.equal(rulesTrialOn(page("localhost", "?rules=next")), true);
  assert.equal(rulesTrialOn(page("127.0.0.1", "?rules=next")), true);
  assert.equal(rulesTrialOn(page("localhost", "")), false);
  assert.equal(rulesTrialOn(page("critical-point.example", "?rules=next")), false);
  assert.equal(getTableSchema({}).chargeLeak, undefined);
});

test("G27: a full charge holds, then leaks a step a second of table clock, and a stopped clock leaks nothing", () => {
  const schema = { ...BASE_SCHEMA, creep: 0, seconds: 40, chargeLeak: true };
  let win = reduceWindow(createWindow({ schema, seed: "g27" }), { type: "SELECT", id: "card" });
  for (let press = 0; press < 8 && win.focus < 70; press += 1) win = reduceWindow(win, { type: "FOCUS" });
  const full = win.focus;
  assert.ok(full >= 70);
  const tick = (from, seconds) => {
    let at = from;
    for (let left = seconds; left > 0; left -= 1) at = reduceWindow(at, { type: "TICK", delta: 1 });
    return at;
  };
  assert.equal(tick(win, CHARGE_LEAK_GRACE).focus, full, "held through the grace");
  assert.equal(tick(win, CHARGE_LEAK_GRACE + 2).focus, full - 2 * CHARGE_LEAK_STEP);
  // A slow frame and a fast one land the same.
  let fine = win;
  for (let step = 0; step < (CHARGE_LEAK_GRACE + 2) * 10; step += 1) fine = reduceWindow(fine, { type: "TICK", delta: 0.1 });
  assert.ok(Math.abs(fine.elapsed - tick(win, CHARGE_LEAK_GRACE + 2).elapsed) < 1e-6);
  assert.ok(Math.abs(fine.focus - (full - 2 * CHARGE_LEAK_STEP)) <= CHARGE_LEAK_STEP);
  // No tick is what a stopped clock is: the comfort dialog and a hidden tab send none.
  assert.equal(win.focus, full);
  const plain = reduceWindow(createWindow({ schema: { ...schema, chargeLeak: false }, seed: "g27" }), { type: "SELECT", id: "card" });
  let charged = plain;
  for (let press = 0; press < 8 && charged.focus < 70; press += 1) charged = reduceWindow(charged, { type: "FOCUS" });
  assert.equal(tick(charged, 10).focus, charged.focus, "a board without the trial never leaks");
});
