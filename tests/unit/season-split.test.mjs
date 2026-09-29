import assert from "node:assert/strict";
import { test } from "node:test";

import { findSharedReferences, loadSeasonTables, mergeSeason, SPLIT_TABLES, splitSeason } from "../../scripts/season-split.mjs";

/**
 * Step 1 of the per-case chunk split: the four tables cut by case must put
 * back together into exactly what they were cut from, and survive being
 * written as data. See scripts/season-split.mjs.
 */
const season = await loadSeasonTables();
const split = splitSeason(season);

test("merging the split gives back the season's four tables exactly", () => {
  const merged = mergeSeason(split);
  for (const table of SPLIT_TABLES) {
    assert.deepEqual(merged[table], season.tables[table], `${table} changed in the round trip`);
  }
});

test("every case gets its own scenes, and only the shared reply belongs to none", () => {
  for (const caseId of season.caseSequence) {
    const bucket = split.cases[caseId];
    assert.ok(Object.keys(bucket.nodes).length > 0, `${caseId} has no scenes`);
    for (const [nodeId, scene] of Object.entries(bucket.nodes)) assert.equal(scene.caseId, caseId, `${nodeId} was filed under ${caseId}`);
    for (const key of Object.keys(bucket.sceneContext)) assert.ok(bucket.nodes[key], `${caseId} carries the context of ${key} without the scene`);
  }
  // `default` is the reply every card without its own falls back on.
  assert.deepEqual(Object.keys(split.shared.echoReplies), ["default"]);
  for (const table of ["nodes", "choiceVoiceLines", "sceneContext"]) assert.deepEqual(split.shared[table], {}, `${table} has keys no case owns`);
});

test("a card's reply and voice travel with the case that deals it", () => {
  for (const [caseId, bucket] of Object.entries(split.cases)) {
    for (const scene of Object.values(bucket.nodes)) {
      for (const choice of scene.choices) {
        if (season.tables.echoReplies[choice.id] !== undefined && !(choice.id in bucket.echoReplies)) {
          // A card id two cases deal (none today) is filed with the first.
          assert.fail(`${caseId}/${choice.id}: its reply is in another case's file`);
        }
      }
    }
  }
});

// A data file copies what the built graph shares. The generators share value
// objects only; anything else shared (a choice, a scene) would be one object
// the runtime could change in one place and see in another.
const SHARED_VALUE_OBJECTS = new Set(["cognition", "effect", "triggers"]);

test("every value survives JSON, and only value objects are shared between keys", () => {
  for (const table of SPLIT_TABLES) {
    assert.deepEqual(JSON.parse(JSON.stringify(season.tables[table])), season.tables[table], `${table} holds something JSON drops (a function, undefined, NaN)`);
    const shared = findSharedReferences(season.tables[table]).filter((property) => !SHARED_VALUE_OBJECTS.has(property));
    assert.deepEqual(shared, [], `${table} shares more than value objects between keys; a data file would copy them`);
  }
});
