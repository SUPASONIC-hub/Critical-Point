import assert from "node:assert/strict";
import { test } from "node:test";

import { CASE_SEQUENCE } from "../../src/gameCases.js";
import { recheckCaseGap, recheckChain } from "../../src/chainRecheck.js";
import { getIdleErosion, normalizeRunState, resolveWindow } from "../../src/gauntlet/gauntletEngine.js";
import { STAGED } from "../../src/gauntlet/tableUnlocks.js";
import { fill } from "../../src/locale.js";
import { getWeekRule, IDLE_EROSION_PERCENT, WEEK_RULE_CATALOGUE, WEEK_RULE_DEVICES, WEEKLY_RULES, weekRuleHasDevice } from "../../src/gauntlet/weeklyRules.js";
import { createSeasonBot } from "../../scripts/sim/season-bot.mjs";

/**
 * B4, IDLE MONEY (개선 포인트 2026-11-13): a week's device that takes a share
 * of the vault held through a case when the case closes. In the catalogue
 * only, booked in no week.
 */
const card = { id: "a", label: "a", effect: { capital: 9, trust: -12 }, next: "x" };
const cash = { status: "cashed", cause: "cash", gauge: 60, wall: 95, pushes: 2, seed: "erosion:cash" };
const bust = { status: "bust", cause: "push", gauge: 70, wall: 69, pushes: 4, seed: "erosion:bust" };
const settle = (run, window, caseClosed = true) => resolveWindow({ run: normalizeRunState(run), window, card, caseClosed });

test("IDLE MONEY is a catalogue device, booked in no week, with its words in three languages", async () => {
  const rule = WEEK_RULE_CATALOGUE["idle-erosion"];
  assert.equal(rule.label, "IDLE MONEY");
  assert.deepEqual([...rule.rules], ["erosion"]);
  assert.equal(rule.schema, undefined, "no number of the board moves");
  assert.ok(WEEK_RULE_DEVICES.includes("erosion"));
  assert.equal(weekRuleHasDevice("idle-erosion", "erosion"), true);
  assert.equal(weekRuleHasDevice("near-wall", "erosion"), false);
  assert.deepEqual(WEEKLY_RULES.filter((entry) => entry.id === "idle-erosion"), [], "no week books it before the user picks its number");
  assert.equal(rule.title, "묵힌 돈은 준다");
  assert.ok(rule.text.includes(`${IDLE_EROSION_PERCENT}%`), rule.text);
  assert.ok(rule.world.length > 0 && rule.world.length <= 40);
  for (const language of ["en", "ja"]) {
    const words = (await import(`../../src/locales/${language}/screens/weekRules.js`)).default.rules["idle-erosion"];
    assert.ok(words.title && words.world, language);
    assert.ok(fill(words.text, { erosion: IDLE_EROSION_PERCENT }).includes(`${IDLE_EROSION_PERCENT}%`), language);
  }
  // No line of it tells anyone to invest (금융 소재 기획 원칙 6).
  for (const line of [rule.text, rule.world]) assert.doesNotMatch(line, /투자|수익률|주식|코인/);
  assert.equal(getWeekRule("idle-erosion").id, "idle-erosion");
});

test("a close under IDLE MONEY takes its share of the vault held through the case, before the pot is banked", () => {
  const held = { vault: 1000, handVault: 200, runPot: 300, weekRule: "idle-erosion" };
  const share = Math.floor((1000 * IDLE_EROSION_PERCENT) / 100);
  const { verdict, nextRun } = settle(held, cash);
  assert.equal(verdict.eroded, share);
  assert.equal(nextRun.vault, 1000 - share + verdict.secured, "the pot banked on the close is not eroded");
  assert.equal(nextRun.handVault, 200 - Math.floor((200 * IDLE_EROSION_PERCENT) / 100), "the hand's share shrinks by its own share (no hand pot this case)");
  assert.ok(nextRun.handVault <= nextRun.vault);
  assert.equal(nextRun.seasonLost, share, "the season counts it lost");
  // A bust on the close loses the pot and the share both.
  const busted = settle(held, bust);
  assert.equal(busted.verdict.eroded, share);
  assert.equal(busted.nextRun.vault, 1000 - share);
  // Mid-case, nothing.
  assert.equal(settle(held, cash, false).verdict.eroded, undefined);
  assert.equal(settle(held, cash, false).nextRun.vault, 1000);
});

test("no other week, no story run and no replay erodes", () => {
  const base = { vault: 1000, handVault: 0, runPot: 300 };
  assert.equal(settle({ ...base, weekRule: null }, cash).verdict.eroded, undefined);
  assert.equal(settle({ ...base, weekRule: "near-wall" }, cash).verdict.eroded, undefined);
  assert.equal(settle({ ...base, weekRule: "idle-erosion", story: true }, cash).verdict.eroded, undefined);
  assert.equal(getIdleErosion("idle-erosion", 0), 0);
  assert.equal(getIdleErosion("idle-erosion", Math.floor(100 / IDLE_EROSION_PERCENT) - 1), 0, "a vault under 100/percent loses nothing: whole units, rounded down");
  assert.equal(getIdleErosion(null, 5000), 0);
});

test("a season under IDLE MONEY chains with no mark, and a vault down past the share still breaks", () => {
  const bot = createSeasonBot({ seed: 20261113, staged: STAGED, weekRule: "idle-erosion" });
  const season = bot.playSeason(0, "balanced");
  assert.ok(season.eroded > 0, "the season lost something to it");
  const rows = CASE_SEQUENCE.map((caseId) => ({ run_id: "bot-erosion", case_id: caseId, dynamics: season.caseDynamics[caseId], decision_log: season.caseLogs[caseId] }));
  const report = recheckChain(rows);
  assert.deepEqual(report.breaks, [], JSON.stringify(report.breaks.slice(0, 3)));
  assert.deepEqual(report.marks, []);
  // The same gap with the week's stamp taken off both rows: the drop is now off the log.
  const index = rows.findIndex((row, at) => at > 0 && row.dynamics.vault < rows[at - 1].dynamics.vault);
  assert.ok(index > 0, "some close left the vault lower than the one before");
  {
    const strip = (row) => ({ ...row, dynamics: { ...row.dynamics, weekRule: null } });
    const gap = recheckCaseGap(strip(rows[index - 1]), strip(rows[index]));
    assert.ok(gap.breaks.some((entry) => entry.field === "vault"), JSON.stringify(gap.breaks));
  }
  // And a drop larger than the share breaks under the week too.
  const before = rows[3];
  const after = structuredClone(rows[4]);
  after.dynamics.vault = before.dynamics.vault - getIdleErosion("idle-erosion", before.dynamics.vault) - 1 - 10_000;
  assert.ok(recheckCaseGap(before, after).breaks.some((entry) => entry.field === "vault"));
});
