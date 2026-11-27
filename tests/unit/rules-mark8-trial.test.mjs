import assert from "node:assert/strict";
import test from "node:test";

// G25 is the trial's only (rulesNext.js `rulesTrialOn`), read once a process: this file plays the trial.
process.env.RULES_TRIAL = "1";
const { getRelicDraftCost, normalizeRelicDraft, normalizeRunState, openRelicDraft, refineRelic } = await import("../../src/gauntlet/gauntletEngine.js");
const { getRefinedBoost, getRelicBoost, readRelicBoost, REFINE_COST, RELIC_BOOST_CAP, RELIC_BOOSTS } = await import("../../src/gauntlet/relicsNext.js");
const { readDraftSpend } = await import("../../src/gauntlet/draftSpend.js");

test("G25: a refined tool pays half as much bonus again, once a season, and is priced on the draft", () => {
  // FRONT PAGE ×1.2 refined to ×1.3; ×1.12 to ×1.18 from RULES_MARK 14 (G51).
  const refinedFront = getRelicBoost("frontPage") === 1.2 ? 1.3 : 1.18;
  assert.equal(getRefinedBoost("frontPage"), refinedFront);
  const cash = { gauge: 40, pushes: 2, streak: 0, move: "grow", mutations: ["overclock"], clockLeft: 0.1, afterBust: false };
  assert.equal(readRelicBoost(["frontPage"], cash, RELIC_BOOST_CAP, ["frontPage"]).factor, refinedFront);
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
