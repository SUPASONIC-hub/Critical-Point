import assert from "node:assert/strict";
import { test } from "node:test";

import { describeDecisionPace, getDecisionPace } from "../../src/viewModels/reportViewModels.js";

/**
 * The report's mirror of how the player's pace moved through a case
 * (ReportArchive's Avg Time): the first decisions against the last.
 */
const decisions = (...seconds) => seconds.map((responseTimeSec, index) => ({ nodeId: `n${index}`, responseTimeSec }));

test("each end is the same number of decisions, at most half the log and at most ten", () => {
  assert.deepEqual(getDecisionPace(decisions(9, 12, 6, 30, 4, 3, 2)), { count: 3, first: 9, last: 3 }, "seven decisions: three from each end, the middle one in neither");
  const long = getDecisionPace(decisions(...Array(12).fill(8), ...Array(12).fill(3)));
  assert.deepEqual(long, { count: 10, first: 8, last: 3 });
  assert.deepEqual(getDecisionPace(decisions(1, 2, 4, 5), { min: 2 }), { count: 2, first: 2, last: 5 }, "averages are whole seconds");
});

test("too few decisions make no comparison", () => {
  assert.equal(getDecisionPace(decisions(5, 6, 7, 8, 9)), null, "two at each end is under the floor of three");
  assert.equal(getDecisionPace([]), null);
  assert.equal(getDecisionPace(null), null);
  assert.equal(getDecisionPace(decisions(4), { min: 0 }), null, "a floor of none still needs one at each end");
});

test("what the table clock cannot be compared on is left out", () => {
  const log = [
    ...decisions(10, 10, 10),
    { nodeId: "slow", responseTimeSec: 2, assistTime: 2 },
    { nodeId: "story", responseTimeSec: 2, assistStory: true },
    { nodeId: "dealt", responseTimeSec: 45, threshold: { forced: true } },
    { nodeId: "record", isSystemEvent: true, responseTimeSec: 0 },
    { nodeId: "old", responseTimeSec: 0 },
    { nodeId: "broken", responseTimeSec: "x" },
    null,
    ...decisions(4, 4, 4),
  ];
  assert.deepEqual(getDecisionPace(log), { count: 3, first: 10, last: 4 });
  assert.deepEqual(getDecisionPace([...decisions(6, 6, 6, 6, 6, 6)].map((entry) => ({ ...entry, assistTime: 1 }))), { count: 3, first: 6, last: 6 }, "a clock at its own pace is counted");
  assert.equal(getDecisionPace(decisions(3, 3, 3, 3, 3, 3).map((entry) => ({ ...entry, assistStory: true }))), null, "a case read in story mode has no pace");
});

test("the line says which end was faster without judging it", () => {
  assert.equal(describeDecisionPace({ count: 3, first: 9, last: 3 }), "뒤의 3번은 평균 3초 만에 골랐습니다. 앞의 3번은 9초였습니다.");
  assert.equal(describeDecisionPace({ count: 10, first: 4, last: 11 }), "뒤의 10번은 평균 11초를 들여 골랐습니다. 앞의 10번은 4초였습니다.");
  assert.equal(describeDecisionPace({ count: 5, first: 6, last: 6 }), "앞의 5번도 뒤의 5번도 평균 6초 만에 골랐습니다.");
  assert.equal(describeDecisionPace(null), "");
});
