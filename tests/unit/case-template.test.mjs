/**
 * The writing guide's samples (docs/writing-a-case.md, F3-1 (1) of 2026-11-12).
 *
 * docs/examples/case-template.js is not in the season, so check:graph never
 * reads it. This test holds it to the rules a real case meets, through the
 * same tables and readers the checks use (gameConstants' keys, check:canon's
 * findCanonViolations, the plain-language rules, check:card-labels' lengths,
 * the authored-cognition range of validate-game-graph), and holds chapter 4's
 * three code blocks to src/nodes/case12.js letter by letter, so neither sample
 * can drift from the code it shows.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import { test } from "node:test";

import { case50 } from "../../docs/examples/case-template.js";
import { findCanonViolations } from "../../scripts/check-canon.mjs";
import { findBannedWords, findRetiredPhrases } from "../../scripts/plain-language-rules.mjs";
import { cognitionLabels, initialResources, triggerLabels } from "../../src/gameConstants.js";
import { case49 } from "../../src/nodes/case49.js";

const TEMPLATE = "docs/examples/case-template.js";
const read = (file) => fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
// check-card-labels.mjs MAX_LABEL / MAX_TEXT, and validate-game-graph.mjs's authored cognition.
const MAX_LABEL = 30;
const MAX_TEXT = 420;
const CONTINUITY_IDS = new Set(["protect-trust", "repair-legitimacy", "find-cost", "use-reframe", "lower-risk", "avoid-risk"]);

const scenes = { ...case50.nodes, ...case50.aftermath };
const cards = Object.entries(scenes).flatMap(([sceneId, scene]) => scene.choices.map((card) => ({ sceneId, card })));

test("the template has every field a real case has, and no other", () => {
  assert.deepEqual(Object.keys(case50).sort(), Object.keys(case49).sort());
});

test("scenes and cards use only the season's keys, ids and lengths", () => {
  const resources = new Set(Object.keys(initialResources));
  const ways = new Set(Object.keys(cognitionLabels));
  const triggers = new Set(Object.keys(triggerLabels));
  for (const [id, scene] of Object.entries(scenes)) {
    assert.match(id, /^c50_/);
    for (const field of ["phase", "title", "speaker", "text"]) assert.ok(scene[field], `${id}.${field}`);
    assert.ok(scene.text.length <= MAX_TEXT, `${id} text ${scene.text.length} > ${MAX_TEXT}`);
    for (const trigger of scene.triggers) assert.ok(triggers.has(trigger), `${id} trigger ${trigger}`);
    assert.ok(case50.sceneContext[id]?.place, `${id} has no sceneContext place`);
  }
  for (const { sceneId, card } of cards) {
    assert.ok(card.label.length <= MAX_LABEL, `${card.id} label ${card.label.length} > ${MAX_LABEL}`);
    if (card.type === "reframe") {
      assert.equal(card.id, "reframe");
      assert.equal(card.cognition, undefined);
      continue;
    }
    assert.match(card.id, new RegExp(`^${sceneId.replace("aftershock", "after")}_`));
    assert.ok(card.voice && card.echo, `${card.id} needs voice and echo`);
    for (const key of Object.keys(card.effect)) assert.ok(resources.has(key), `${card.id} effect ${key}`);
    const named = Object.entries(card.cognition);
    assert.ok(named.length >= 1 && named.length <= 2, `${card.id} cognition`);
    for (const [key, weight] of named) assert.ok(ways.has(key) && Number.isInteger(weight) && weight >= 1 && weight <= 3, `${card.id} cognition ${key}`);
    if (card.next) assert.ok(scenes[card.next] || card.next === "case50_result", `${card.id} next ${card.next}`);
  }
});

test("endings, carryovers and the next case's hooks line up", () => {
  const endings = case50.aftermath.c50_aftershock.choices.map((card) => card.id).sort();
  assert.deepEqual(Object.keys(case50.outcomes).sort(), endings);
  assert.deepEqual(Object.keys(case50.carryovers).sort(), endings);
  const previous = case49.aftermath.c49_aftershock.choices.map((card) => card.id).sort();
  assert.deepEqual(Object.keys(case50.openingRoutes).sort(), previous);
  assert.deepEqual(Object.keys(case50.continuityChallenges).sort(), previous);
  for (const challenge of Object.values(case50.continuityChallenges)) assert.ok(CONTINUITY_IDS.has(challenge.id), challenge.id);
  assert.deepEqual(case50.aftermathRoute, ["c50_final", "c50_aftershock"]);
});

test("the template's words pass check:canon and the plain-language rules", () => {
  const text = read(TEMPLATE);
  assert.deepEqual(findCanonViolations(text, "src/nodes/case50.js"), []);
  const written = Object.values(scenes).flatMap((scene) => [scene.text, ...scene.memo, ...scene.choices.flatMap((card) => [card.label, card.voice ?? "", card.echo ?? ""])]).join("\n");
  assert.deepEqual(findBannedWords(written), []);
  assert.deepEqual(findRetiredPhrases(written), []);
});

test("the files the template and the guide point at exist", () => {
  for (const file of ["src/nodes/casePacks.js", "scripts/vite-season-data.mjs", "src/nodes/case49.js", "src/scenePlate.js", "docs/writing-a-case.md"]) {
    assert.ok(fs.existsSync(file), file);
    assert.ok(read(TEMPLATE).includes(file), `${TEMPLATE} no longer names ${file}`);
  }
  assert.ok(read("docs/writing-a-case.md").includes("docs/examples/case-template.js"));
});

test("chapter 4's code blocks are copied from src/nodes/case12.js unchanged", () => {
  const doc = read("docs/writing-a-case.md");
  const chapter = doc.slice(doc.indexOf("## 4. 견본"), doc.indexOf("## 5. "));
  const blocks = [...chapter.matchAll(/```js\n([\s\S]*?)\n```/g)].map((match) => match[1]);
  assert.equal(blocks.length, 3);
  const source = read("src/nodes/case12.js");
  for (const block of blocks) assert.ok(source.includes(block), `not in case12.js:\n${block.split("\n").slice(0, 3).join("\n")}`);
});
