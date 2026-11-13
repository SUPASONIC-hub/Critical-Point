import assert from "node:assert/strict";
import { test } from "node:test";

import { CASE_SEQUENCE } from "../../src/gameCases.js";
import { recheckChain } from "../../src/chainRecheck.js";
import { countCaseBoards, describeMutations, drawShockSwing, isPenaltyMutation, isShockDue, normalizeRunState, openCaseRun, resolveWindow } from "../../src/gauntlet/gauntletEngine.js";
import { STAGED } from "../../src/gauntlet/tableUnlocks.js";
import { fill } from "../../src/locale.js";
import { MARKET_SHOCK_BOARD, MARKET_SHOCK_WALL, MARKET_SHOCK_WOBBLE, WEEK_RULE_CATALOGUE, WEEK_RULE_DEVICES, WEEKLY_RULES, weekRuleHasDevice } from "../../src/gauntlet/weeklyRules.js";
import { createSeasonBot } from "../../scripts/sim/season-bot.mjs";

/**
 * MARKET SHOCK (금융 소재 기획 (c) c2): once a case, mid-case, the wall moves
 * closer and the pot stacked so far moves up or down. A week's device, in the
 * catalogue only.
 */
const card = { id: "a", label: "a", effect: { capital: 9, trust: -12 }, next: "x" };
const cash = (index) => ({ status: "cashed", cause: "cash", gauge: 50, wall: 95, pushes: 2, seed: `shock:${index}` });
const bust = (index) => ({ status: "bust", cause: "push", gauge: 70, wall: 69, pushes: 4, seed: `shock-bust:${index}` });

/** Plays `windows` of one case from a fresh run under `weekRule`; every verdict and the boards dealt. */
function playCase(weekRule, windows, extra = {}) {
  let run = openCaseRun(normalizeRunState({ weekRule, ...extra }));
  const verdicts = [];
  const boards = [run.schema];
  windows.forEach((window, index) => {
    const caseClosed = index === windows.length - 1;
    const { verdict, nextRun } = resolveWindow({ run, window, card, caseClosed, shock: isShockDue(run, index, caseClosed) });
    verdicts.push(verdict);
    boards.push(nextRun.schema);
    run = nextRun;
  });
  return { verdicts, boards, run };
}

test("MARKET SHOCK is a catalogue device, booked in no week, with its words in three languages", async () => {
  const rule = WEEK_RULE_CATALOGUE["market-shock"];
  assert.equal(rule.label, "MARKET SHOCK");
  assert.deepEqual([...rule.rules], ["shock"]);
  assert.equal(rule.schema, undefined);
  assert.ok(WEEK_RULE_DEVICES.includes("shock"));
  assert.equal(weekRuleHasDevice("market-shock", "shock"), true);
  assert.deepEqual(WEEKLY_RULES.filter((entry) => entry.id === "market-shock"), [], "no week books it before the user picks its numbers");
  for (const value of [MARKET_SHOCK_BOARD + 1, MARKET_SHOCK_WALL, MARKET_SHOCK_WOBBLE]) assert.ok(rule.text.includes(String(value)), rule.text);
  assert.ok(rule.world.length > 0 && rule.world.length <= 40);
  const values = { shockBoard: MARKET_SHOCK_BOARD + 1, shockWall: MARKET_SHOCK_WALL, shockSwing: MARKET_SHOCK_WOBBLE };
  for (const language of ["en", "ja"]) {
    const words = (await import(`../../src/locales/${language}/screens/weekRules.js`)).default.rules["market-shock"];
    assert.ok(words.title && words.world, language);
    assert.doesNotMatch(fill(words.text, values), /\{/, language);
    const mutation = (await import(`../../src/locales/${language}/screens/mutations.js`)).default.rules.shock;
    assert.ok(mutation.title && mutation.text, language);
  }
  // No line of it tells anyone to invest (금융 소재 기획 원칙 6).
  for (const line of [rule.text, rule.world]) assert.doesNotMatch(line, /투자|수익률|주식|코인|매수|매도/);
});

test("once a case, on board MARKET_SHOCK_BOARD: the wall band closer, told as a board rule, the pot moved by the seed's swing", () => {
  const windows = Array.from({ length: 7 }, (_, index) => cash(index));
  const { verdicts, boards } = playCase("market-shock", windows);
  const shocked = verdicts.map((verdict, index) => (verdict.shock ? index : -1)).filter((index) => index >= 0);
  assert.deepEqual(shocked, [MARKET_SHOCK_BOARD - 1], "the window before the shock board deals it, once");
  const board = boards[MARKET_SHOCK_BOARD];
  assert.ok(board.mutations.includes("shock"));
  const plain = playCase(null, windows).boards[MARKET_SHOCK_BOARD];
  assert.equal(board.wallMax, plain.wallMax - MARKET_SHOCK_WALL, "the band is the shock's closer than the same board without the week");
  assert.equal(board.wallMin, plain.wallMin - MARKET_SHOCK_WALL);
  assert.equal(boards.filter((schema) => schema.mutations.includes("shock")).length, 1);
  const described = describeMutations(board).find((entry) => entry.id === "shock");
  assert.equal(described.label, "MARKET SHOCK");
  assert.ok(described.text.includes(String(MARKET_SHOCK_WALL)));
  assert.equal(isPenaltyMutation("shock"), false, "no decision of the player's broke it");
  const { pot } = verdicts[MARKET_SHOCK_BOARD - 1].shock;
  const stacked = verdicts.slice(0, MARKET_SHOCK_BOARD).reduce((sum, verdict) => sum + verdict.pot, 0);
  assert.equal(pot, drawShockSwing(`shock:${MARKET_SHOCK_BOARD - 1}`, stacked));
  assert.ok(Math.abs(pot) <= Math.ceil((stacked * MARKET_SHOCK_WOBBLE) / 100));
});

test("the swing is the seed's, both ways, within the wobble", () => {
  const swings = Array.from({ length: 400 }, (_, index) => drawShockSwing(`s${index}`, 1000));
  assert.ok(swings.some((swing) => swing > 0) && swings.some((swing) => swing < 0), "up and down");
  assert.ok(swings.every((swing) => Math.abs(swing) <= MARKET_SHOCK_WOBBLE * 10));
  assert.equal(drawShockSwing("s1", 1000), drawShockSwing("s1", 1000), "the same window moves it the same");
  assert.equal(drawShockSwing("s1", 0), 0, "an empty pot does not move");
});

test("no shock without the week, in story mode, in a replay, or on the board a close deals", () => {
  const windows = Array.from({ length: 6 }, (_, index) => cash(index));
  for (const weekRule of [null, "near-wall", "crisis-week"]) {
    const { verdicts, boards } = playCase(weekRule, windows);
    assert.ok(verdicts.every((verdict) => !verdict.shock), String(weekRule));
    assert.ok(boards.every((schema) => !schema.mutations.includes("shock")));
  }
  assert.ok(playCase("market-shock", windows, { story: true }).verdicts.every((verdict) => !verdict.shock), "story");
  const run = normalizeRunState({ weekRule: "market-shock" });
  assert.equal(isShockDue(run, MARKET_SHOCK_BOARD - 1), true);
  assert.equal(isShockDue(run, MARKET_SHOCK_BOARD), false, "once a case");
  assert.equal(isShockDue(run, MARKET_SHOCK_BOARD - 1, true), false, "a close deals REBOOT, never the shock");
  assert.equal(isShockDue({ ...run, practice: { vault: 0 } }, MARKET_SHOCK_BOARD - 1), false, "a replay");
  assert.equal(isShockDue({ ...run, story: true }, MARKET_SHOCK_BOARD - 1), false, "story mode");
  // The engine deals it only when told, and never on a replay's or a story run's board even then.
  const told = resolveWindow({ run: normalizeRunState({ weekRule: "market-shock", story: true }), window: cash(9), card, shock: true });
  assert.equal(told.verdict.shock, undefined);
  // The count is the case's log: each entry with a window is one board.
  assert.equal(countCaseBoards([{ threshold: {} }, { reframe: true }, { threshold: {} }]), 2);
  assert.equal(countCaseBoards(null), 0);
});

test("a bust on the window that deals it: BLACKOUT and the shock both, the pot already gone", () => {
  const windows = [cash(0), cash(1), bust(2), cash(3), cash(4)];
  const { verdicts, boards } = playCase("market-shock", windows);
  assert.equal(verdicts[2].shock.pot, 0, "nothing stacked to move");
  assert.ok(boards[3].mutations.includes("shock") && boards[3].mutations.includes("blackout"));
});

test("a season under MARKET SHOCK chains with no mark", () => {
  const bot = createSeasonBot({ seed: 20261113, staged: STAGED, weekRule: "market-shock" });
  let shocks = 0;
  const season = bot.playSeason(0, "balanced", false, ({ verdict }) => {
    if (verdict.shock) shocks += 1;
  });
  assert.ok(shocks > 0, "the season met the shock");
  const rows = CASE_SEQUENCE.map((caseId) => ({ run_id: "bot-shock", case_id: caseId, dynamics: season.caseDynamics[caseId], decision_log: season.caseLogs[caseId] }));
  const report = recheckChain(rows);
  assert.deepEqual(report.breaks, [], JSON.stringify(report.breaks.slice(0, 3)));
  assert.deepEqual(report.marks, []);
});
