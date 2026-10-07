import assert from "node:assert/strict";
import { test } from "node:test";

import { createStorage } from "./helpers/browser.mjs";

globalThis.localStorage = createStorage();
const { NEW_GAME_PLUS_MEMORY_KEY, readNewGamePlusMemory } = await import("../../src/appConfig.js");
const { seasonToRemember, storeSeasonMemory } = await import("../../src/state/useNewGamePlus.js");

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

test("the season is kept when its finale closes, and a later half season does not replace it", () => {
  // The finale's commit hands over the case results with the finale in them
  // (useChoiceCommit -> unlockNewGamePlus). Nothing has to be pressed.
  const finished = { case01: { outcomeChoiceId: "c1_after_people" }, final: { outcomeChoiceId: "f_seal" } };
  assert.equal(storeSeasonMemory(finished), finished);
  assert.deepEqual(readNewGamePlusMemory(), finished);
  // A reset, a new game, then NEW GAME+ pressed two cases in: still that season.
  assert.equal(storeSeasonMemory({ case01: { outcomeChoiceId: "c1_after_rule" } }), null);
  assert.equal(storeSeasonMemory(null), null);
  assert.deepEqual(JSON.parse(globalThis.localStorage.getItem(NEW_GAME_PLUS_MEMORY_KEY)), finished);
});
