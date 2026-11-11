import assert from "node:assert/strict";
import { test } from "node:test";

import { CASE_SEQUENCE } from "../../src/gameCases.js";
import { createCaseSummary, getGameplayStats } from "../../src/gameLogic.js";
import { getCaseRead, getCognitionMix, getCognitionSpread, getReadingScore, getSeasonScore } from "../../src/seasonScore.js";

/**
 * The season's 관점 전환 read off the whole season (사용자 2026-10-23 Q25 (1)):
 * the season's score is still the mean of its cases' scores, with each case's
 * own 관점 전환 (weight 0.16 since the 판 읽기 axis, C-1(1); 0.2 before)
 * swapped for the one the season's decisions make together. check:grants
 * holds the server's ranking_run_summary to the same numbers.
 */
const [first, second, third] = CASE_SEQUENCE;
const decision = (cognition, extra = {}) => ({ cognition, responseTimeSec: 12, ...extra });

test("a case's count of ways of thinking: one a decision, the heaviest, system events aside", () => {
  assert.deepEqual(getCognitionMix([]), {});
  assert.deepEqual(
    getCognitionMix([
      decision({ risk: 2, inference: 1 }),
      decision({ inference: 1, reframing: 1 }),
      decision({ persistence: 3 }, { isSystemEvent: true }),
      decision({}),
      decision({ risk: 1 }),
    ]),
    { risk: 2, inference: 1 },
    "a tie goes to the first written, and a decision with none counts for none",
  );
  assert.deepEqual(getCognitionMix([decision({ persistence: 1 }, { isSystemEvent: true })]), { persistence: 1 }, "a case of system events only counts them");
});

test("the 관점 전환 spread reads a list of types and a count of them alike", () => {
  assert.equal(getCognitionSpread({}), 0);
  assert.equal(getCognitionSpread({ risk: 6 }), 0);
  assert.equal(getCognitionSpread({ risk: 6, inference: 0 }), 0, "a kind counted zero times is not a kind");
  assert.equal(getCognitionSpread({ risk: 2, inference: 2 }), getCognitionSpread(["risk", "inference", "risk", "inference"]));
  assert.equal(getCognitionSpread({ risk: 1, inference: 1, reframing: 1, persistence: 1 }), 100);
  const entries = [decision({ risk: 1 }), decision({ risk: 1 }), decision({ inference: 1 }), decision({ reframing: 2, risk: 1 })];
  assert.equal(getGameplayStats(entries).cognitionScore, getCognitionSpread(getCognitionMix(entries)), "the case's own score is its count's spread");
});

test("a case summary keeps its count, and a replay the count of its first close", () => {
  const entries = [decision({ risk: 1 }), decision({ inference: 1 })];
  const closed = createCaseSummary({}, {}, entries);
  assert.deepEqual(closed.cognitionMix, { risk: 1, inference: 1 });
  assert.equal("firstCognitionMix" in closed, false);
  const replay = createCaseSummary({}, {}, [decision({ persistence: 1 })], { replayOf: closed });
  assert.deepEqual(replay.cognitionMix, { persistence: 1 });
  assert.deepEqual(replay.firstCognitionMix, { risk: 1, inference: 1 });
  assert.deepEqual(createCaseSummary({}, {}, entries, { replayOf: replay }).firstCognitionMix, { risk: 1, inference: 1 }, "a second replay still counts the first close");
  assert.equal(createCaseSummary({}, {}, entries, { replayOf: { burstScore: 50 } }).firstCognitionMix, null, "a first close with no count leaves the replay with none");
});

test("the season's score swaps each case's 관점 전환 for the season's", () => {
  // Two cases of one way each (spread 0 apiece), two ways in all (spread 50):
  // each case gains 0.16 * 50 = 8, so 60.5 + 8 = 68.5, rounded half up.
  const oneWayEach = { [first]: { burstScore: 60, cognitionMix: { risk: 4 } }, [second]: { burstScore: 61, cognitionMix: { inference: 4 } } };
  assert.deepEqual(getSeasonScore(oneWayEach), { momentumScore: 69, burstScore: 69, momentumTier: "FLOW", rank: "B" });
  // Already even within each case: the season's spread is the cases' own, and the score the plain mean.
  assert.equal(getSeasonScore({ [first]: { burstScore: 60, cognitionMix: { risk: 2, inference: 2 } }, [second]: { burstScore: 61, cognitionMix: { risk: 1, inference: 1 } } }).burstScore, 61);
  // Kept within 0 to 100.
  assert.equal(getSeasonScore({ [first]: { burstScore: 99, cognitionMix: { risk: 4 } }, [second]: { burstScore: 99, cognitionMix: { inference: 4, reframing: 4, persistence: 4 } } }).burstScore, 100);
  assert.equal(getSeasonScore({ [first]: { burstScore: 0, cognitionMix: { risk: 1, inference: 1, reframing: 1, persistence: 1 } }, [second]: { burstScore: 0, cognitionMix: { risk: 1, inference: 1, reframing: 1, persistence: 1 } }, [third]: { burstScore: 0, cognitionMix: { risk: 30 } } }).burstScore, 0);
  // A replay counts its first close's count, as it counts its first close's score.
  assert.equal(getSeasonScore({ ...oneWayEach, [first]: { burstScore: 10, firstBurstScore: 60, cognitionMix: { inference: 4 }, firstCognitionMix: { risk: 4 } } }).burstScore, 69);
});

test("a season with a case that has no count, or one that is not a count, keeps the plain mean", () => {
  const withSecond = (mix) => getSeasonScore({ [first]: { burstScore: 60, cognitionMix: { risk: 4 } }, [second]: { burstScore: 61, cognitionMix: mix } }).burstScore;
  for (const notCount of [undefined, null, "risk", [4], { inference: "4" }, { inference: 1.5 }, { inference: -1 }, { inference: 1_000_000 }, Object.fromEntries("abcdefghi".split("").map((kind) => [kind, 1]))]) {
    assert.equal(withSecond(notCount), 61, JSON.stringify(notCount));
  }
  assert.equal(getSeasonScore({ [first]: { burstScore: 60, cognitionMix: { risk: 4 }, firstCognitionMix: null }, [second]: { burstScore: 61, cognitionMix: { inference: 4 } } }).burstScore, 61, "a replay whose first close had no count");
  // Each count in range, but the season's sum past it; and nine kinds across the season.
  assert.equal(getSeasonScore({ [first]: { burstScore: 60, cognitionMix: { risk: 999_999 } }, [second]: { burstScore: 61, cognitionMix: { risk: 1, inference: 4 } } }).burstScore, 61);
  const kinds = "abcdefghi".split("");
  assert.equal(getSeasonScore({ [first]: { burstScore: 60, cognitionMix: Object.fromEntries(kinds.slice(0, 5).map((kind) => [kind, 1])) }, [second]: { burstScore: 61, cognitionMix: Object.fromEntries(kinds.slice(5).map((kind) => [kind, 1])) } }).burstScore, 61);
});

test("판 읽기 (C-1(1)): the C-12 index, kept within 0 to 100, weighs 0.2 of a case's score", () => {
  const at = (read, busted = false) => ({ threshold: { busted, read } });
  assert.equal(getCaseRead([at([100, 200]), at([0, 100], true), at([60, 100])]), 15, "a bust wipes the pot the bare hand had");
  assert.equal(getCaseRead([{ threshold: { busted: false } }]), null);
  assert.equal(getReadingScore([at([100, 200]), at([50, 100])]), 50);
  assert.equal(getReadingScore([at([150, 100])]), 100, "a hand that pushed past the seer and lived stops at 100");
  assert.equal(getReadingScore([{ threshold: { busted: false } }]), 0, "nothing to compare reads 0");
  assert.equal(getReadingScore([]), 0);
  // The same decisions, read once at 0% and once at 100% of the seer: 0.2 * 100 = 20 points.
  const log = (bare) => [0, 1, 2, 3].map((index) => decision({ [["risk", "inference", "reframing", "persistence"][index]]: 1 }, { threshold: { busted: false, read: [bare, 90] } }));
  const none = getGameplayStats(log(0));
  const all = getGameplayStats(log(90));
  assert.equal(none.readingScore, 0);
  assert.equal(all.readingScore, 100);
  assert.equal(all.momentumScore - none.momentumScore, 20);
  // And the six axes before it at 0.8 of their weights: a case of 100 everywhere but 판 읽기 scores 80.
  const axes = { consistencyScore: 0.224, cognitionScore: 0.16, reflectionScore: 0.16, pressureAdaptScore: 0.128, rhythmScore: 0.064, challengeSupportScore: 0.064 };
  assert.equal(Math.round(Object.values(axes).reduce((sum, weight) => sum + weight, 0) * 1000), 800);
  assert.equal(createCaseSummary({}, {}, log(45)).readingScore, 50, "the case summary carries it");
});
