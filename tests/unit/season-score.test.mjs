import assert from "node:assert/strict";
import { test } from "node:test";

import { CASE_SEQUENCE } from "../../src/gameCases.js";
import { createCaseSummary, getGameplayStats } from "../../src/gameLogic.js";
import { getCognitionMix, getCognitionSpread, getSeasonScore } from "../../src/seasonScore.js";

/**
 * The season's 관점 전환 read off the whole season (사용자 2026-10-23 Q25 (1)):
 * the season's score is still the mean of its cases' scores, with each case's
 * own 관점 전환 (weight 0.2) swapped for the one the season's decisions make
 * together. check:grants holds the server's ranking_run_summary to the same
 * numbers.
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
  // each case gains 0.2 * 50 = 10.
  const oneWayEach = { [first]: { burstScore: 60, cognitionMix: { risk: 4 } }, [second]: { burstScore: 61, cognitionMix: { inference: 4 } } };
  assert.deepEqual(getSeasonScore(oneWayEach), { momentumScore: 71, burstScore: 71, momentumTier: "FLOW", rank: "B" });
  // Already even within each case: the season's spread is the cases' own, and the score the plain mean.
  assert.equal(getSeasonScore({ [first]: { burstScore: 60, cognitionMix: { risk: 2, inference: 2 } }, [second]: { burstScore: 61, cognitionMix: { risk: 1, inference: 1 } } }).burstScore, 61);
  // Kept within 0 to 100.
  assert.equal(getSeasonScore({ [first]: { burstScore: 99, cognitionMix: { risk: 4 } }, [second]: { burstScore: 99, cognitionMix: { inference: 4, reframing: 4, persistence: 4 } } }).burstScore, 100);
  assert.equal(getSeasonScore({ [first]: { burstScore: 0, cognitionMix: { risk: 1, inference: 1, reframing: 1, persistence: 1 } }, [second]: { burstScore: 0, cognitionMix: { risk: 1, inference: 1, reframing: 1, persistence: 1 } }, [third]: { burstScore: 0, cognitionMix: { risk: 30 } } }).burstScore, 0);
  // A replay counts its first close's count, as it counts its first close's score.
  assert.equal(getSeasonScore({ ...oneWayEach, [first]: { burstScore: 10, firstBurstScore: 60, cognitionMix: { inference: 4 }, firstCognitionMix: { risk: 4 } } }).burstScore, 71);
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
