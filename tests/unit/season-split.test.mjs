import assert from "node:assert/strict";
import { test } from "node:test";

import { buildRuntimeData, findSharedReferences, loadSeasonTables, mergeSeason, SPLIT_TABLES, splitSeason } from "../../scripts/season-split.mjs";
import { MOODS, SCENE_MOODS } from "../../src/sceneMoods.js";

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

test("the shipped scenes carry `mood` where the tag table says, and nothing on an untagged scene", () => {
  assert.ok(Object.keys(season.moods).length > 0, "loadSeasonTables carries the tag table");
  assert.equal(season.moods, SCENE_MOODS);
  const shipped = buildRuntimeData(season);
  let tagged = 0;
  for (const [caseId, bucket] of Object.entries(shipped.cases)) {
    for (const [nodeId, scene] of Object.entries(bucket.nodes)) {
      const mood = SCENE_MOODS[nodeId];
      if (mood) {
        tagged += 1;
        assert.equal(scene.mood, mood, `${caseId}/${nodeId}`);
        assert.ok(MOODS.includes(mood) && mood !== "neutral", `${nodeId}: ${mood}`);
        // The graph's own scene is left alone; the shipped one is a copy with the mood on it.
        assert.ok(!("mood" in season.tables.nodes[nodeId]), `${nodeId}: the graph's scene was written to`);
        const { mood: written, ...rest } = scene;
        assert.equal(written, mood);
        assert.deepEqual(rest, season.tables.nodes[nodeId]);
      } else {
        assert.ok(!("mood" in scene), `${caseId}/${nodeId} ships a mood it is not tagged with`);
        assert.equal(scene, season.tables.nodes[nodeId], `${nodeId}: an untagged scene is the graph's own object`);
      }
    }
  }
  assert.equal(tagged, Object.keys(SCENE_MOODS).length, "every tagged scene ships its mood");
  // Without the tag table nothing is written.
  const bare = buildRuntimeData({ ...season, moods: undefined });
  for (const bucket of Object.values(bare.cases)) for (const scene of Object.values(bucket.nodes)) assert.ok(!("mood" in scene));
});
