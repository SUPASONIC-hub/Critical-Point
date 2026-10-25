import assert from "node:assert/strict";
import { test } from "node:test";

import { createAchievementBadges, createEndingProfile, createScoreBreakdown } from "../../src/viewModels/reportViewModels.js";

/**
 * The report's derived copy: how the last choice is framed, the six rows of
 * the score, and the eight badges. Each is a pure read of a finished run, so
 * what is held is which answer a given run gets -- the lines the thresholds
 * are drawn on -- and that a run with nothing to show still gets a full report.
 */

const SCORES = { consistencyScore: 31, rhythmScore: 7, cognitionScore: 18, pressureAdaptScore: 12, reflectionScore: 9, readingScore: 23, exploitPenalty: 0 };

/** A run that earned nothing: every badge takes its second answer. */
const QUIET_RUN = {
  challengeClearCount: 0, currentChallengeStreak: 0, flowSurgeCount: 0, momentumScore: 12, momentumTier: "BUILDING",
  reducedRiskCount: 0, result: { reframeCount: 0, averageResponseTime: 0 }, riskTier: "STABLE",
};
const titles = (extra = {}) => createAchievementBadges({ ...QUIET_RUN, ...extra }).map((badge) => badge.title);

test("each of the three last choices has its own framing", () => {
  const profiles = ["ending_seal", "ending_reform", "ending_expose"].map((choiceId) => createEndingProfile({ finalEndingEntry: { choiceId } }));
  assert.deepEqual(profiles.map((profile) => profile.tag), ["봉인", "개혁", "폭로"]);
  assert.equal(new Set(profiles.map((profile) => profile.title)).size, 3);
  assert.equal(new Set(profiles.map((profile) => profile.text)).size, 3);
});

test("a run with no last choice on record is framed as undecided, not as one of the endings", () => {
  const undecided = createEndingProfile({ finalEndingEntry: null });
  assert.equal(undecided.tag, "미확정");
  assert.ok(undecided.title && undecided.text, "it still has a title and a sentence to print");
  assert.deepEqual(createEndingProfile({ finalEndingEntry: undefined }), undecided);
  assert.deepEqual(createEndingProfile({ finalEndingEntry: {} }), undecided, "an entry that names no choice");
  assert.deepEqual(createEndingProfile({ finalEndingEntry: { choiceId: "ending_unwritten" } }), undecided, "or a choice the report has no framing for");
});

// The framings are looked up by an id read from the saved log's `f_choice`
// entry (useResultReport.js). No card the game writes is named "toString" or
// "constructor", but a damaged save could be, and the lookup must not find
// Object.prototype's member under that name: the report would be handed a
// function with no tag, title or text.
test("a last choice named like a built-in is framed as undecided too", () => {
  const undecided = createEndingProfile({ finalEndingEntry: null });
  for (const choiceId of ["toString", "constructor", "hasOwnProperty", "valueOf", "__proto__"]) {
    assert.deepEqual(createEndingProfile({ finalEndingEntry: { choiceId } }), undecided, `${choiceId} is not one of the endings`);
  }
});

test("the score is seven rows, each printing the value it was handed", () => {
  const rows = createScoreBreakdown(SCORES);
  assert.equal(rows.length, 7);
  assert.equal(new Set(rows.map((row) => row.label)).size, 7, "no two rows share a name");
  assert.deepEqual(rows.map((row) => row.value), [SCORES.consistencyScore, SCORES.rhythmScore, SCORES.cognitionScore, SCORES.pressureAdaptScore, SCORES.readingScore, SCORES.reflectionScore, SCORES.exploitPenalty], "consistency first, the penalty last");
  for (const row of rows.slice(0, 6)) {
    assert.equal(row.text, `${row.value}점`, `${row.label} prints its own score`);
    assert.ok(row.note.length > 0, `${row.label} says what it measures`);
  }
});

test("the penalty row prints a deduction as one, and no deduction as none", () => {
  const penalty = (exploitPenalty) => createScoreBreakdown({ ...SCORES, exploitPenalty }).at(-1);
  assert.equal(penalty(0).text, "없음", "a clean run is not shown '-0점'");
  assert.equal(penalty(8).text, "-8점");
  assert.equal(penalty(8).value, 8, "the value stays the size of the deduction, the sign is only printed");
});

test("a run that earned nothing still gets all eight badges", () => {
  const badges = createAchievementBadges(QUIET_RUN);
  assert.equal(badges.length, 8);
  assert.equal(new Set(badges.map((badge) => badge.title)).size, 8);
  for (const badge of badges) assert.ok(badge.text.length > 0, `${badge.title} has a sentence`);
  assert.deepEqual(titles(), ["Burst BUILDING", "Route Follower", "Fast Closer", "Heat Taker", "Open Quest", "Chain Starter", "No Surge", "Pressure Keeper"]);
});

test("the first badge names the burst tier and its score", () => {
  const [burst] = createAchievementBadges({ ...QUIET_RUN, momentumTier: "CRITICAL", momentumScore: 88 });
  assert.equal(burst.title, "Burst CRITICAL");
  assert.match(burst.text, /88점/);
});

test("each badge turns on the one fact of the run it is about", () => {
  const changed = (extra) => {
    const quiet = titles();
    return titles(extra).map((title, index) => (title === quiet[index] ? null : title)).filter(Boolean);
  };
  assert.deepEqual(changed({ result: { reframeCount: 1, averageResponseTime: 0 } }), ["Board Breaker"]);
  assert.deepEqual(changed({ result: { reframeCount: 0, averageResponseTime: 20 } }), ["Slow Thinker"]);
  assert.deepEqual(changed({ result: { reframeCount: 0, averageResponseTime: 19.9 } }), [], "just under twenty seconds is still a fast close");
  assert.deepEqual(changed({ reducedRiskCount: 1 }), ["Risk Cutter"]);
  assert.deepEqual(changed({ challengeClearCount: 1 }), ["Challenge Clear"]);
  assert.deepEqual(changed({ flowSurgeCount: 1 }), ["Flow Surge"]);
  assert.deepEqual(changed({ riskTier: "CRITICAL" }), ["Crisis Runner"]);
  assert.deepEqual(changed({ riskTier: "HIGH" }), [], "only the top tier of risk is a crisis");
});

test("the streak badge has three steps, at three and at five in a row", () => {
  const streak = (currentChallengeStreak) => createAchievementBadges({ ...QUIET_RUN, currentChallengeStreak })[5];
  assert.deepEqual([0, 2, 3, 4, 5, 9].map((count) => streak(count).title), ["Chain Starter", "Chain Starter", "Streak Breakthrough", "Streak Breakthrough", "Perfect Run", "Perfect Run"]);
  assert.match(streak(4).text, /^4연속/, "the badge quotes the streak it was earned on");
  assert.match(streak(7).text, /^7연속/);
  assert.doesNotMatch(streak(2).text, /\d/, "and quotes none before there is one");
});

test("a badge that counts something quotes the count", () => {
  const text = (extra, title) => createAchievementBadges({ ...QUIET_RUN, ...extra }).find((badge) => badge.title === title).text;
  assert.match(text({ reducedRiskCount: 3 }, "Risk Cutter"), /^3번/);
  assert.match(text({ challengeClearCount: 4 }, "Challenge Clear"), /^4개/);
  assert.match(text({ flowSurgeCount: 2 }, "Flow Surge"), /^2번/);
});
