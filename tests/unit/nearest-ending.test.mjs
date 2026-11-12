import assert from "node:assert/strict";
import { test } from "node:test";

import { ENDING_THRESHOLDS, getEndingVariant } from "../../src/gameLogic.js";
import { endingLabelOf, nearestEnding } from "../../src/nearestEnding.js";
import reportLinesCopy from "../../src/copy/reportLines.js";
import enScreens from "../../src/locales/en/screens/index.js";
import jaScreens from "../../src/locales/ja/screens/index.js";
import { createSeasonStandingReadout, describeNearestEnding } from "../../src/viewModels/reportViewModels.js";

/**
 * C2-1 (1), 2026-11-11: the finale's 「가장 가까웠던 다른 결말」 line. It is
 * display only, so what is held here is that it agrees with the ruling: a
 * season one step under an ending's gate names that ending and that step, and
 * the same season with the step taken is ruled that ending by
 * `getEndingVariant` itself.
 */
const CASES = 10;
function season({ trust = 60, legitimacy = 60, capital = 80, clues = 0, reframes = 0, finale = "witness", ...extra } = {}) {
  return {
    resources: { time: 0, capital, trust, legitimacy, humanCost: 0, fatigue: 0 },
    seasonResources: { capital, trust, legitimacy },
    discoveredClues: Array.from({ length: clues }, (_, index) => `clue-${index}`),
    log: finale ? [{ nodeId: "f_aftershock", choiceId: `f_after_${finale}` }] : [],
    seasonHumanCost: 0,
    casesPlayed: CASES,
    seasonBusts: 0,
    seasonWindows: 0,
    sustainedPressure: 20,
    seasonReframeRoutes: reframes,
    ...extra,
  };
}
const ruled = (input) => getEndingVariant(input).id;
const nearest = (input) => nearestEnding({ ...input, endingId: ruled(input) });

// Each ending, a season one step under one of its gates, and the step.
const ROWS = [
  { ending: "evidence-reform", below: { finale: "control", legitimacy: 85, trust: 60, clues: 9 }, gap: { key: "legitimacy", value: 1 }, at: { legitimacy: 86 } },
  { ending: "open-oversight", below: { legitimacy: 82, trust: 84, clues: 9 }, gap: { key: "trust", value: 1 }, at: { trust: 85 } },
  { ending: "human-record", below: { trust: 75, clues: 10, reframes: 6 }, gap: { key: "reframes", value: 1 }, at: { reframes: 7 } },
  { ending: "cold-justice", below: { legitimacy: 88, trust: 77 }, gap: { key: "coldGap", value: 1 }, at: { trust: 76 } },
  { ending: "profitable-silence", below: { capital: 96, trust: 44, legitimacy: 50 }, gap: { key: "capital", value: 1 }, at: { capital: 97 } },
  { ending: "profitable-silence", below: { capital: 97, trust: 45, legitimacy: 50 }, gap: { key: "trustOver", value: 1 }, at: { trust: 44 } },
  { ending: "field-pact", below: { trust: 74, legitimacy: 60 }, gap: { key: "pactGap", value: 1 }, at: { trust: 75 } },
];

test("a season one step under an ending's gate names that ending and that step, and the step taken reaches it", () => {
  for (const row of ROWS) {
    const below = season(row.below);
    assert.notEqual(ruled(below), row.ending, `${row.ending}: under its gate it is not reached`);
    assert.deepEqual(nearest(below), { id: row.ending, label: endingLabelOf(row.ending), gaps: [row.gap] }, row.ending);
    assert.equal(ruled(season({ ...row.below, ...row.at })), row.ending, `${row.ending}: the step taken is the ending the ruling gives`);
  }
});

test("the gates it reads are the ruling's own", () => {
  assert.equal(ENDING_THRESHOLDS.reformLegitimacy, 86);
  assert.equal(ENDING_THRESHOLDS.oversightTrust, 85);
  assert.equal(ENDING_THRESHOLDS.clueRate, 0.9);
  assert.ok(Object.isFrozen(ENDING_THRESHOLDS));
});

test("records are counted as the ruling divides them: the fewest that reach the share of the season's cases", () => {
  // Seven cases at nine in ten need all seven records (6 / 7 is 0.857); five found leaves two.
  const input = season({ finale: "control", legitimacy: 86, trust: 60, clues: 5, casesPlayed: 7, capital: 20 });
  const near = nearestEnding({ ...input, endingId: "cold-justice" });
  assert.deepEqual(near, { id: "evidence-reform", label: "EVIDENCE REFORM", gaps: [{ key: "clues", value: 2 }] });
  assert.equal(ruled({ ...input, discoveredClues: Array.from({ length: 7 }, (_, index) => `clue-${index}`) }), "evidence-reform");
  // Table slack lowers the bar the records are counted against (0.8 of 20 is 16, 0.9 is 18).
  const slack = season({ finale: "control", legitimacy: 86, trust: 80, clues: 15, casesPlayed: 20, seasonBestLogic: ENDING_THRESHOLDS.logicSlackStreak });
  assert.deepEqual(nearestEnding({ ...slack, endingId: ruled(slack) }).gaps, [{ key: "clues", value: 1 }]);
});

test("the ending the season reached is never offered, nor the collapse, the open question or the quiet cover", () => {
  for (const row of ROWS) {
    const at = season({ ...row.below, ...row.at });
    const near = nearest(at);
    assert.ok(near && near.id !== row.ending, `${row.ending}: another ending is named`);
    assert.ok(!["collapse", "open-question", "quiet-cover"].includes(near.id));
    assert.ok(near.gaps.length > 0 && near.gaps.every((gap) => Number.isInteger(gap.value) && gap.value > 0));
  }
});

test("a collapsed season has no line, a burned finale has the closed-records line, and no ending yet has none", () => {
  const collapsed = season({ seasonHumanCost: 30 * CASES });
  assert.equal(ruled(collapsed), "collapse");
  assert.equal(nearest(collapsed), null);
  const burned = season({ finale: "burn", legitimacy: 85, clues: 9 });
  assert.deepEqual(nearest(burned), { burn: true });
  assert.equal(nearestEnding({ ...season(), endingId: "" }), null);
  assert.equal(nearestEnding(), null);
});

test("the line says the ending and each step in the page's words", () => {
  const { nearest: words } = reportLinesCopy;
  assert.equal(
    describeNearestEnding({ id: "evidence-reform", label: "EVIDENCE REFORM", gaps: [{ key: "legitimacy", value: 2 }] }),
    "가장 가까웠던 다른 결말: EVIDENCE REFORM까지 공정함 2 모자람",
  );
  assert.equal(
    describeNearestEnding({ id: "human-record", label: "HUMAN RECORD", gaps: [{ key: "reframes", value: 1 }, { key: "clues", value: 2 }, { key: "trust", value: 3 }] }),
    "가장 가까웠던 다른 결말: HUMAN RECORD까지 판 다시 짜기 1번 모자람 · 단서 2개 모자람 · 믿음 3 모자람",
  );
  assert.equal(describeNearestEnding({ id: "cold-justice", label: "COLD JUSTICE", gaps: [{ key: "coldGap", value: 4 }] }), "가장 가까웠던 다른 결말: COLD JUSTICE까지 공정함이 믿음보다 4 더 높아야 함");
  assert.equal(describeNearestEnding({ id: "field-pact", label: "FIELD PACT", gaps: [{ key: "pactGap", value: 1 }] }), "가장 가까웠던 다른 결말: FIELD PACT까지 믿음이 공정함보다 1 더 높아야 함");
  assert.equal(describeNearestEnding({ id: "profitable-silence", label: "PROFITABLE SILENCE", gaps: [{ key: "trustOver", value: 5 }] }), "가장 가까웠던 다른 결말: PROFITABLE SILENCE까지 믿음 5 넘침");
  assert.equal(describeNearestEnding({ burn: true }), words.burn);
  assert.equal(describeNearestEnding(null), null);
  // Every gap a season can lack has words, in every language.
  const keys = ["trust", "legitimacy", "capital", "trustOver", "clues", "reframes", "coldGap", "pactGap"];
  for (const table of [words, enScreens.reportLines.nearest, jaScreens.reportLines.nearest]) {
    assert.deepEqual(Object.keys(table.gaps).sort(), [...keys].sort());
    for (const key of ["line", "burn"]) assert.equal(typeof table[key], "string");
    assert.match(table.line, /\{ending\}/);
    assert.match(table.line, /\{gaps\}/);
  }
});

test("C3-4: the 폭로 paragraph follows the ending on a held season whose last answer was 폭로, and on no other", () => {
  const caseResults = { case01: { finalHumanCost: 0, pushRecord: { busts: 0, cashes: 0 } } };
  const lost = { capital: 40, trust: 60, legitimacy: 60 };
  const readout = (extra) => createSeasonStandingReadout({ caseResults, closing: lost, endingId: "quiet-cover", ...extra });
  assert.equal(readout({ finale: "witness" }).endingWitness, reportLinesCopy.witnessHeld);
  assert.equal(readout({ finale: "control" }).endingWitness, null);
  assert.equal(readout({ finale: null }).endingWitness, null);
  assert.equal(readout({ finale: "witness", closing: { ...lost, capital: 90 } }).endingWitness, null, "a season that kept its cash");
  assert.equal(readout({ finale: "witness", caseResults: { case01: { finalHumanCost: 40 } } }).endingWitness, null, "a season over the line");
  assert.equal(readout({ finale: "witness", endingId: "" }).endingWitness, null);
  // The ending's words grow; the readout's other lines are as they were.
  const before = createSeasonStandingReadout({ caseResults, closing: lost, endingId: "quiet-cover" });
  const after = readout({ finale: "witness" });
  for (const key of ["level", "text", "held", "endingHeld"]) assert.deepEqual(after[key], before[key], key);
  assert.equal(before.endingNearest, null);
  assert.equal(enScreens.reportLines.witnessHeld.length > 0 && jaScreens.reportLines.witnessHeld.length > 0, true);
});
