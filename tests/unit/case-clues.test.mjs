import assert from "node:assert/strict";
import { test } from "node:test";

import { describeCaseClues } from "../../src/gauntlet/tableReadout.js";

/**
 * The clue count across the case just closed, for the result's 사건 전 → 후
 * line. The save records no count from before the case; the case's log holds
 * every clue it found, and the run's list holds every clue so far.
 */

const clue = (id) => ({ id, title: id, text: "" });

test("the count before is the run's count less the clues the case's own entries found", () => {
  const log = [{ clue: null }, { clue: clue("c2") }, {}];
  assert.deepEqual(describeCaseClues(log, 3), [{ key: "clues", text: "단서 2 → 3개", gain: true }]);
});

test("a case that found no clue reads the same on both ends and is neither a gain nor a loss", () => {
  assert.deepEqual(describeCaseClues([{ clue: null }, { clue: null }], 4), [{ key: "clues", text: "단서 4 → 4개", gain: null }]);
});

test("the finale can find several earlier cases' clues, and each is counted", () => {
  const log = [{ clue: clue("a") }, { clue: clue("b") }, { clue: clue("final") }];
  assert.equal(describeCaseClues(log, 5)[0].text, "단서 2 → 5개");
});

test("a log with no entries lists nothing, and a count never goes under zero", () => {
  assert.deepEqual(describeCaseClues([], 3), []);
  assert.deepEqual(describeCaseClues(), []);
  assert.equal(describeCaseClues([{ clue: clue("x") }, { clue: clue("y") }], 1)[0].text, "단서 0 → 1개");
});
