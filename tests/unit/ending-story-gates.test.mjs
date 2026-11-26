import assert from "node:assert/strict";
import { test } from "node:test";

import { CASE_SEQUENCE } from "../../src/gameCases.js";
import { ENDING_THRESHOLDS, getEndingVariant, getSeasonStrain } from "../../src/gameLogic.js";
import { nearestEnding } from "../../src/nearestEnding.js";

/**
 * G37 (2026-11-25, the user's 「전부 1」): story mode moves two gates, for a
 * story season only (`storySeason`, read off the case summaries' `assistStory`).
 * A table season is ruled as it was: the ranking and its rules mark never see it.
 */
const CASES = CASE_SEQUENCE.length;
const season = ({ trust = 80, legitimacy = 91, capital = 90, answer = null, ...rest } = {}) => ({
  resources: { trust, legitimacy, capital, humanCost: 0 },
  discoveredClues: Array.from({ length: CASES }, (_, index) => `clue-${index}`),
  log: answer ? [{ nodeId: "f_aftershock", choiceId: `f_after_${answer}` }] : [],
  casesPlayed: CASES,
  seasonWindows: 100,
  seasonBusts: 0,
  sustainedPressure: 20,
  seasonReframeRoutes: 0,
  ...rest,
});

test("story mode: the cold gap is 9 (G43; 10 under G37), the table's stays 12", () => {
  assert.equal(ENDING_THRESHOLDS.coldGap, 12);
  assert.equal(ENDING_THRESHOLDS.storyColdGap, 9);
  assert.equal(ENDING_THRESHOLDS.storyOpenTrust, 87);
  const eleven = season({ trust: 80, legitimacy: 91, answer: "burn" });
  assert.equal(getEndingVariant(eleven).id, "quiet-cover");
  assert.equal(getEndingVariant({ ...eleven, storySeason: true }).id, "cold-justice");
});

test("story mode: a burned season that kept storyOpenTrust leaves the question open", () => {
  const kept = season({ trust: ENDING_THRESHOLDS.storyOpenTrust, legitimacy: 90, answer: "burn" });
  assert.equal(getEndingVariant(kept).id, "quiet-cover", "the table's burn still covers");
  assert.equal(getEndingVariant({ ...kept, storySeason: true }).id, "open-question");
  const lost = season({ trust: ENDING_THRESHOLDS.storyOpenTrust - 1, legitimacy: 90, answer: "burn" });
  assert.equal(getEndingVariant({ ...lost, storySeason: true }).id, "quiet-cover");
});

test("the season strain says whether a case was played in story mode", () => {
  const summary = { finalHumanCost: 0, finalResources: { trust: 50 } };
  assert.equal(getSeasonStrain({ case01: summary }).storySeason, false);
  assert.equal(getSeasonStrain({ case01: summary, case02: { ...summary, assistStory: true } }).storySeason, true);
});

test("the finale's nearest line reads story mode's cold gap", () => {
  const input = { ...season({ trust: 80, legitimacy: 88, answer: "witness" }), endingId: "evidence-reform" };
  const gapOf = (result) => result?.gaps.find((gap) => gap.key === "coldGap")?.value ?? 0;
  const table = nearestEnding(input);
  const story = nearestEnding({ ...input, storySeason: true });
  assert.equal(table?.id, "cold-justice");
  assert.equal(gapOf(table), 4);
  assert.equal(story?.id, "cold-justice");
  assert.equal(gapOf(story), 1);
});
