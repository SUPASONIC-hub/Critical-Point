import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { authoredNodeOrders, CASE_START_NODES } from "../../src/gameCases.js";
import { getReadingSeconds, READING_MAX_SECONDS } from "../../src/gauntlet/gauntletEngine.js";
import { getBriefingIntro, getStageRules } from "../../src/gauntlet/tableStaging.js";
import { ALL_RULES, STAGED, UNLOCK_LADDER } from "../../src/gauntlet/tableUnlocks.js";

/**
 * What the stage and the briefing ask of the unlock ladder. The staged table
 * is asked for by passing the flag, as in table-unlocks.test.mjs: whatever the
 * shipped switch says, these hold.
 */

const PROLOGUES = UNLOCK_LADDER.map((step) => step.caseId);

test("the stage draws under the rules it was dealt, and under the case's own step when the staged table is previewed", () => {
  const dealt = new Set(["beat"]);
  for (const caseId of [...PROLOGUES, "case01", undefined]) {
    assert.equal(getStageRules(caseId, {}, dealt, false), dealt, `${caseId}: the forecast's rules, untouched`);
  }
  for (const step of UNLOCK_LADDER) {
    assert.equal(getStageRules(step.caseId, {}, ALL_RULES, true), step.rules, `${step.caseId} is drawn under its step`);
    assert.equal(getStageRules(step.caseId, { veteran: true }, ALL_RULES, true), ALL_RULES, "a NEW GAME+ run is drawn whole");
  }
  assert.equal(getStageRules("case01", {}, ALL_RULES, true), ALL_RULES, "사건 01 is drawn whole");
  assert.equal(getStageRules("prologue01", {}, dealt), dealt, "nothing is previewed where there is no debug console");
});

test("a case's introduction is on the briefing of its first scene and on no other", () => {
  for (const step of UNLOCK_LADDER) {
    const first = CASE_START_NODES[step.caseId];
    assert.ok(first, `${step.caseId} has a first scene`);
    assert.equal(getBriefingIntro(step.caseId, first, {}, true), step.intro, `${step.caseId} opens with its lines`);
    assert.ok(step.intro.length > 0);
    assert.deepEqual(getBriefingIntro(step.caseId, first, { veteran: true }, true), [], "a NEW GAME+ run is told nothing");
    assert.deepEqual(getBriefingIntro(step.caseId, first, {}, false), [], "nothing while the switch is off");
    const later = (authoredNodeOrders[step.caseId] ?? []).filter((nodeId) => nodeId !== first);
    assert.ok(later.length > 0, `${step.caseId} has later scenes`);
    for (const nodeId of later) {
      assert.deepEqual(getBriefingIntro(step.caseId, nodeId, {}, true), [], `${nodeId} has nothing new to say`);
    }
  }
  assert.deepEqual(getBriefingIntro("case01", CASE_START_NODES.case01, {}, true), [], "사건 01 turns nothing on");
  assert.deepEqual(getBriefingIntro(undefined, undefined, {}, true), [], "a scene with no case has no introduction");
  assert.deepEqual(getBriefingIntro("prologue02", CASE_START_NODES.prologue02, {}), STAGED ? [...UNLOCK_LADDER[1].intro] : [], "the shipped switch decides by default");
});

test("the introduction is read against the briefing's clock, a line counted as a changed rule's sentence is", () => {
  const node = { text: "가".repeat(200) };
  for (const step of UNLOCK_LADDER) {
    const chars = step.intro.join("").replace(/\s+/g, "").length;
    const seconds = getReadingSeconds(node, step.intro.map((text) => ({ text })));
    assert.equal(seconds, Math.min(READING_MAX_SECONDS, Math.round(6 + (200 + chars) / 16)), `${step.caseId}'s lines count`);
    assert.ok(seconds > getReadingSeconds(node));
  }
  // The page that counts them is the page that prints them.
  const briefing = readFileSync("src/gauntlet/SceneBriefing.jsx", "utf8");
  assert.match(briefing, /getReadingSeconds\(\{ \.\.\.node, question \}, \[\.\.\.mutations, \.\.\.intro\.map\(\(text\) => \(\{ text \}\)\)\]\)/);
});

test("a release ships no way to preview the staged table", () => {
  // The preview reads the address bar, so it sits behind the constant the
  // bundler folds to false in a release -- in front of everything else.
  const source = readFileSync("src/gauntlet/tableStaging.js", "utf8");
  assert.match(source, /const PREVIEW =\s*\(typeof __CP_DEBUG_BUILD__ === "undefined" \? false : __CP_DEBUG_BUILD__\) &&\s*debugToolsEnabled &&/);
});
