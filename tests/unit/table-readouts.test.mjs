import assert from "node:assert/strict";
import { test } from "node:test";

import {
  BASE_SCHEMA, createWindow, drawStep, GAUGE_MAX, getCardChips, getFocusBonus, getHandBonus, LOCK_CAP, normalizeRunState, reduceWindow, resolveWindow,
} from "../../src/gauntlet/gauntletEngine.js";
import { ALL_RULES } from "../../src/gauntlet/tableUnlocks.js";
import { readTableMeters } from "../../src/gauntlet/tableMeters.js";
import { readFileSync } from "node:fs";
import {
  describeAfterword, describeCaseRead, describeVaultPerCase, getHeatStage, getTableReaction, perCaseVault, readCaseRead, readNextPush, readSafeLine,
  readTellWall, readWindowAgainstSeer,
} from "../../src/gauntlet/tableAfterword.js";
import { AUDIT_RELIEF_HEAT } from "../../src/gauntlet/auditRisk.js";
import { AUDIT_HEAT } from "../../src/gauntlet/weeklyRules.js";
import { tableReactions } from "../../src/caseCopy.js";
import { createCaseSummary } from "../../src/gameLogic.js";
import { buildLeaderboard } from "../../src/ranking.js";
import { findBannedWords } from "../../scripts/plain-language-rules.mjs";

/**
 * The table's readouts of 2026-10-22 (improvement notes 3-4: C-1 (3), C-5,
 * C-6, C-9, C-11, C-12, C-13). Every one of them is display: these hold that
 * the numbers a window, a settlement, a case summary and the ranking come to
 * are the ones they came to before.
 */

const card = { id: "c", type: "analysis", effect: { capital: 12, trust: 6, humanCost: 4 } };
const SEEDS = Array.from({ length: 300 }, (_, index) => `readouts:${index}`);
const live = (seed, schema = BASE_SCHEMA) => reduceWindow(createWindow({ schema, seed }), { type: "SELECT", id: card.id }, ALL_RULES);
const pushTimes = (win, times) => Array.from({ length: times }).reduce((current) => reduceWindow(current, { type: "PUSH" }, ALL_RULES), win);

test("안전선까지 is the same PUSH events pressed one by one: the same window, byte for byte, and never the wall (C-5)", () => {
  let pressed = 0;
  for (const seed of SEEDS) {
    const win = live(seed);
    const safe = readSafeLine(win, win.schema.wallMin);
    // By hand: press while the largest step stays under the band's low edge.
    let byHand = win;
    while (byHand.gauge + byHand.schema.stepMax < byHand.schema.wallMin) byHand = reduceWindow(byHand, { type: "PUSH" }, ALL_RULES);
    const atOnce = pushTimes(win, safe.pushes);
    assert.equal(JSON.stringify(atOnce), JSON.stringify(byHand), seed);
    assert.equal(atOnce.status, "live", `${seed}: no wall in the band can be reached`);
    assert.equal(atOnce.gauge, safe.gauge, seed);
    // And what it settles to is the hand's, to the number.
    const cash = (window) => resolveWindow({ run: normalizeRunState({}), window: reduceWindow(window, { type: "CASH" }, ALL_RULES), card, offered: [] });
    assert.equal(JSON.stringify(cash(atOnce)), JSON.stringify(cash(byHand)), seed);
    pressed += safe.pushes;
  }
  assert.ok(pressed / SEEDS.length >= 2, `the first pushes are the ones it takes (${(pressed / SEEDS.length).toFixed(2)} a window)`);
  // The meters hand it to the stage off the band the window draws.
  const win = live("readouts:meters");
  assert.deepEqual(readTableMeters({ win, schema: win.schema, selectedCard: card }).safe, readSafeLine(win, win.schema.wallMin));
});

test("the push not made is the one the seed deals, and the heartbeat's wall is the tell (C-11)", () => {
  let both = { safe: 0, bust: 0 };
  for (const [index, seed] of SEEDS.entries()) {
    const win = pushTimes(live(seed), 3 + (index % 5));
    if (win.status !== "live") continue;
    const next = readNextPush(reduceWindow(win, { type: "CASH" }, ALL_RULES));
    const pushed = reduceWindow(win, { type: "PUSH" }, ALL_RULES);
    assert.equal(next.step, drawStep(win.schema, seed, win.pushes + 1));
    assert.equal(next.safe, pushed.status === "live", seed);
    assert.equal(next.gauge < next.wall, next.safe, `${seed}: the number printed is under the wall exactly when the push was`);
    both[next.safe ? "safe" : "bust"] += 1;
    if (pushed.status === "bust") {
      const tell = readTellWall(pushed);
      assert.equal(tell.heard, Math.max(0, Math.min(GAUGE_MAX, pushed.wall + pushed.tellOffset)));
      assert.match(describeAfterword(pushed), /^심박은 벽을 \d+쯤으로 들었다\(실제 \d+\)\.$/);
    }
  }
  assert.ok(both.safe > 0 && both.bust > 0, JSON.stringify(both));
  const cashed = reduceWindow(pushTimes(live("readouts:line"), 1), { type: "CASH" }, ALL_RULES);
  assert.ok(cashed.pushes >= 1 && cashed.status === "cashed");
  assert.match(describeAfterword(cashed), /^한 번 더 밀었다면 \+\d+ → \d+, 벽 \d+: (갈 수 있었다|BUST였다)\.$/);
  const left = createWindow({ schema: BASE_SCHEMA, seed: "x", abandoned: true });
  assert.equal(describeAfterword(left), null, "a window left was never played to its wall");
  assert.equal(readTellWall({ ...pushTimes(live("readouts:0"), 12), schema: { ...BASE_SCHEMA, sedated: true } }), null, "a sedated board's pulse heard nothing");
});

test("the seer is check:pressure's ceiling on the same board, and a bust wipes the bare hand's pot (C-12)", () => {
  for (const seed of SEEDS.slice(0, 80)) {
    const win = live(seed);
    // The ceiling's policy, played through the reducer with no clock.
    let seer = win;
    while (seer.status === "live" && seer.gauge + seer.schema.stepMax < seer.wall) seer = reduceWindow(seer, { type: "PUSH" }, ALL_RULES);
    assert.equal(seer.status, "live", `${seed}: the seer never pushes into the wall`);
    const chips = getCardChips(card);
    const cashed = reduceWindow(seer, { type: "CASH" }, ALL_RULES);
    const [bare, seen] = readWindowAgainstSeer(cashed, chips);
    assert.equal(bare, seen, `${seed}: a hand that cashes where the seer would is paid what the seer is`);
  }
  const at = (read, busted = false) => ({ threshold: { busted, read } });
  assert.equal(readCaseRead([at([100, 200]), at([50, 100])]), 50);
  assert.equal(readCaseRead([at([100, 200]), at([0, 100], true), at([60, 100])]), 15, "the bust took the 100 in the pot");
  assert.equal(readCaseRead([{ threshold: { busted: false } }]), null, "an older log has nothing to compare");
  assert.equal(describeCaseRead([at([62, 100])]), "이번 사건: 벽을 본 사람의 62%만큼 벌었습니다.");
});

test("none of it reaches a score: the case summary and the board read the same with it as without it", () => {
  const entry = (index, extra) => ({
    nodeId: `n${index}`, caseId: "case01", choiceId: `c${index}`, effect: { trust: 2 }, cognition: { persistence: 1 }, triggers: ["responsibility"],
    responseTimeSec: 9 + index, challenge: { matched: index % 2 === 0, riskDelta: -1 },
    threshold: { state: "cash", busted: false, gauge: 40 + index, wall: 70, pushes: 3, potMultiplier: 2, pot: 40, lostPot: 0, logic: { streak: index }, ...extra },
  });
  const plain = Array.from({ length: 6 }, (_, index) => entry(index));
  const read = Array.from({ length: 6 }, (_, index) => entry(index, { read: [40, 90] }));
  const summary = (log) => createCaseSummary({ responsibility: 5 }, { persistence: 4 }, log, { resources: { trust: 50 } });
  assert.deepEqual(summary(read), summary(plain));
  // The board sorts and scores as it did; the column is a reading beside it.
  const rows = [10, 80, 45].map((score, index) => ({ run_tag: `R${index}`, case_id: "season-final", score, summary: { rank: "A", gauntlet: { vault: 1000 * (index + 1) }, completedCaseCount: 10 } }));
  const board = buildLeaderboard(rows);
  assert.deepEqual(board.map((row) => row.score), [80, 45, 10], "sorted by the score alone");
  // The row's column is worked out in the screen, the way perCaseVault does it.
  const screen = readFileSync(new URL("../../src/screens/RankingScreen.jsx", import.meta.url), "utf8");
  const formula = screen.match(/const vaultPerCase = (.*);/)?.[1];
  assert.equal(formula, "Math.round(entry.summary?.gauntlet?.vault / entry.summary?.completedCaseCount)");
  const shown = (entry) => {
    const value = Math.round(entry.summary?.gauntlet?.vault / entry.summary?.completedCaseCount);
    return Number.isFinite(value) ? value : null;
  };
  assert.deepEqual(board.map(shown), [200, 300, 100]);
  for (const [vault, cases] of [[1000, 10], [1234, 7], [0, 3], [5, undefined], [undefined, 4], [5, 0]]) {
    assert.equal(shown({ summary: { gauntlet: { vault }, completedCaseCount: cases } }), perCaseVault(vault, cases), `${vault} / ${cases}`);
  }
  assert.equal(perCaseVault(5, undefined), null, "a row without its case count shows nothing");
  assert.equal(describeVaultPerCase({ case01: {}, final: { gauntlet: { vault: 24690 } } }), "사건당 금고 12,345");
  assert.equal(describeVaultPerCase({}), "");
});

test("the audit's band is drawn only where the audit counts, from its own numbers (C-9)", () => {
  const win = live("readouts:audit");
  assert.deepEqual(readTableMeters({ win, schema: win.schema, selectedCard: card, run: normalizeRunState({ weekRule: "audit" }) }).auditBand, [AUDIT_HEAT, AUDIT_RELIEF_HEAT]);
  assert.equal(readTableMeters({ win, schema: win.schema, selectedCard: card, run: normalizeRunState({}) }).auditBand, null);
});

test("LOCK at its cap: the press still pays something, so it keeps its clock (C-6)", () => {
  // Charge STEADY to the pot's cap with no streak; the next press adds nothing
  // to the pot, but still raises the resources and cools the gauge -- so the
  // button only says 상한 도달, and the press costs what it cost.
  let win = reduceWindow(pushTimes(live("readouts:lock"), 2), { type: "SET_FOCUS_MODE", mode: "steady" }, ALL_RULES);
  while (getHandBonus(0, win.focus, "steady", 0) < LOCK_CAP) win = reduceWindow(win, { type: "FOCUS" }, ALL_RULES);
  assert.equal(win.status, "live");
  assert.ok(win.focus < 100, "a charge left to fill at the cap");
  const pressed = reduceWindow(win, { type: "FOCUS" }, ALL_RULES);
  assert.equal(getHandBonus(0, pressed.focus, "steady", 0), getHandBonus(0, win.focus, "steady", 0), "the pot does not move");
  assert.ok(getFocusBonus(pressed.focus, "steady").resource > getFocusBonus(win.focus, "steady").resource, "the resources still do");
  assert.ok(pressed.elapsed > win.elapsed, "and the press still costs the clock, as it did");
});

test("the speaker's line about the last table: four heats, 20 to 30 lines, plain words, 합니다체 (C-13)", () => {
  const lines = Object.values(tableReactions).flat();
  assert.deepEqual(Object.keys(tableReactions), ["low", "mid", "hot", "bust"]);
  assert.ok(lines.length >= 20 && lines.length <= 30, `${lines.length} lines`);
  for (const line of lines) {
    assert.deepEqual(findBannedWords(line), [], line);
    assert.match(line, /(니다|니까|십시오|시다)[.?]$/, `${line}: 합니다체`);
  }
  assert.equal(getHeatStage({ busted: true, gauge: 80 }), "bust");
  assert.equal(getHeatStage({ gauge: 60 }), "hot");
  assert.equal(getHeatStage({ gauge: 59 }), "mid");
  assert.equal(getHeatStage({ gauge: 40 }), "mid");
  assert.equal(getHeatStage({ gauge: 39 }), "low");
  assert.equal(getTableReaction([], "x"), null, "a case's first scene has no table behind it");
  const line = getTableReaction([{ threshold: { busted: true } }], "scene");
  assert.ok(tableReactions.bust.includes(line));
  assert.equal(getTableReaction([{ threshold: { busted: true } }], "scene"), line, "the same scene, the same line");
});

test("a window closed without a push has no afterword; one push or more has it (Q34 (1))", () => {
  const unpushed = reduceWindow(live("readouts:line"), { type: "CASH" }, ALL_RULES);
  assert.equal(unpushed.status, "cashed");
  assert.equal(unpushed.pushes, 0);
  assert.equal(describeAfterword(unpushed), null);
  const pushedOnce = reduceWindow(pushTimes(live("readouts:line"), 1), { type: "CASH" }, ALL_RULES);
  assert.equal(pushedOnce.status, "cashed");
  assert.match(describeAfterword(pushedOnce), /^한 번 더 밀었다면 /);
});
