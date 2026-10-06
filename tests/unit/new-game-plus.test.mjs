import assert from "node:assert/strict";
import { test } from "node:test";

import { seasonToRemember } from "../../src/state/useNewGamePlus.js";

/**
 * NEW GAME+ keeps the season that was finished. The button can be pressed in
 * the middle of the next one, and what it keeps then must still be that.
 */
test("only a season that reached its finale is remembered", () => {
  const finished = { case01: { outcomeChoiceId: "c1_after_people" }, final: { outcomeChoiceId: "f_seal" } };
  assert.equal(seasonToRemember(finished), finished);
  assert.equal(seasonToRemember({ case01: { outcomeChoiceId: "c1_after_people" } }), null, "half a season is not written over a whole one");
  assert.equal(seasonToRemember({}), null);
  assert.equal(seasonToRemember(null), null);
  assert.equal(seasonToRemember(["final"]), null);
});
