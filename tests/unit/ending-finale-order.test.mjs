import assert from "node:assert/strict";
import { test } from "node:test";

import { CASE_SEQUENCE } from "../../src/gameCases.js";
import { ENDING_GATES } from "../../src/gameConstants.js";
import { getEndingVariant } from "../../src/gameLogic.js";

/**
 * The order the finale's answer reads the record endings in (src/gameLogic.js,
 * `getEndingVariant`). Burning every record has closed the record endings since
 * the endings were written; since improvement note C2 (2026-11-05) answering
 * 개혁 (`f_after_control`) opens the one named for it: EVIDENCE REFORM is read
 * before OPEN OVERSIGHT, which at a legitimacy over 86 and a trust over 85 took
 * nearly every reform season. The gates themselves do not move: 개혁 under the
 * reform bar, or with its records closed, still closes where it did, and HUMAN
 * RECORD and the collapse gate are read before either answer.
 */
const CASES = CASE_SEQUENCE.length;
const finale = (answer) => (answer ? [{ nodeId: "f_aftershock", choiceId: `f_after_${answer}` }] : []);
const season = ({ trust = 90, legitimacy = 90, capital = 50, clueRate = 1, answer = null, ...rest } = {}) =>
  getEndingVariant({
    resources: { trust, legitimacy, capital, humanCost: 0 },
    discoveredClues: Array.from({ length: Math.round(clueRate * CASES) }, (_, index) => `clue-${index}`),
    log: finale(answer),
    casesPlayed: CASES,
    seasonWindows: 100,
    seasonBusts: 0,
    sustainedPressure: 40,
    seasonReframeRoutes: 0,
    ...rest,
  });

test("개혁 reads EVIDENCE REFORM before OPEN OVERSIGHT; 폭로 and no answer keep the old order", () => {
  const standing = { trust: 90, legitimacy: 90 };
  assert.ok(standing.trust >= ENDING_GATES.oversightTrust, "the season stands where OPEN OVERSIGHT used to take it");
  assert.equal(season({ ...standing, answer: "control" }).id, "evidence-reform");
  assert.equal(season({ ...standing, answer: "witness" }).id, "open-oversight");
  assert.equal(season({ ...standing }).id, "open-oversight", "no finale answer: the order before C2");
});

test("개혁 moves the order, not the gates", () => {
  // Legitimacy over OPEN OVERSIGHT's 82 but under EVIDENCE REFORM's 86: 개혁 does not lower the bar.
  assert.equal(season({ legitimacy: 84, answer: "control" }).id, "open-oversight");
  // Records closed (half the clues): neither record ending, whatever the answer.
  for (const answer of ["control", "witness", null]) {
    const ending = season({ clueRate: 0.5, answer });
    assert.ok(!["evidence-reform", "open-oversight"].includes(ending.id), `${answer}: ${ending.id}`);
  }
  // With the trust under oversight's bar, 개혁 and 폭로 both read EVIDENCE REFORM, as before.
  assert.equal(season({ trust: 80, answer: "control" }).id, "evidence-reform");
  assert.equal(season({ trust: 80, answer: "witness" }).id, "evidence-reform");
});

test("HUMAN RECORD, the collapse gate and 봉인 are read before 개혁's order", () => {
  const record = { seasonReframeRoutes: CASES, trust: 90, legitimacy: 90 };
  assert.equal(season({ ...record, answer: "control" }).id, "human-record");
  assert.equal(season({ ...record, answer: "witness" }).id, "human-record");
  assert.equal(season({ answer: "control", seasonHumanCost: ENDING_GATES.collapseHarmPerCase * CASES }).id, "collapse");
  assert.equal(season({ answer: "burn" }).id, "quiet-cover", "burning closes the record endings, 개혁 or not");
});
