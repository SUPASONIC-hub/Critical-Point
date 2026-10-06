import assert from "node:assert/strict";
import { test } from "node:test";

import { createCaseSummary, getAverageResponseTime, getWindowResponseTime } from "../../src/gameLogic.js";

/**
 * How long a decision took, as the log, the case summary, the ranking row and
 * the telemetry carry it (useChoiceCommit, gameLogic.createCaseSummary).
 */
test("a window that kept its own clock is what that clock read", () => {
  assert.equal(getWindowResponseTime({ elapsed: 17.4, enteredAt: 0, now: 9_000_000, clockSeconds: 45 }), 17);
  assert.equal(getWindowResponseTime({ elapsed: 0.2, enteredAt: 0, now: 1_000, clockSeconds: 45 }), 1, "never less than a second");
});

test("a window with no reading is the time since the scene, and no longer than its board's clock", () => {
  const enteredAt = 1_000_000;
  assert.equal(getWindowResponseTime({ elapsed: 0, enteredAt, now: enteredAt + 12_000, clockSeconds: 45 }), 12);
  // The tab was closed overnight and the window abandoned on the way back in.
  assert.equal(getWindowResponseTime({ elapsed: 0, enteredAt, now: enteredAt + 30_000_000, clockSeconds: 45 }), 45);
  assert.equal(getWindowResponseTime({ elapsed: 0, enteredAt: enteredAt + 5_000, now: enteredAt, clockSeconds: 45 }), 1, "a clock set back is not a negative time");
  assert.equal(getWindowResponseTime({ elapsed: Number.NaN, enteredAt: undefined, now: enteredAt, clockSeconds: 45 }), 45);
});

test("the average is over the decisions the player made, not the entries the table wrote", () => {
  const log = [
    { caseId: "case01", responseTimeSec: 10 },
    { caseId: "case01", responseTimeSec: 20 },
    { caseId: "case01", isSystemEvent: true, choiceId: "table-record-carry" },
    { caseId: "case01", isSystemEvent: true, choiceId: "table-record-carry" },
  ];
  assert.equal(getAverageResponseTime(log), 15, "it read 8 when the two system entries counted as zero");
  assert.equal(createCaseSummary({}, {}, log, {}).averageResponseTime, 15);
  assert.equal(getAverageResponseTime([]), 0);
  assert.equal(getAverageResponseTime([{ isSystemEvent: true }]), 0);
  assert.equal(getAverageResponseTime(null), 0);
});
