import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { authoredNodeOrders, CASE_SEQUENCE, CASE_START_NODES } from "../../src/gameCases.js";
import { caseOpeningRoutes, nodeOrders, nodes } from "../../src/gameData.js";
import { getReadingSeconds, READING_MAX_SECONDS } from "../../src/gauntlet/gauntletEngine.js";
import { getBriefingIntro } from "../../src/gauntlet/tableStaging.js";
import { STAGED, UNLOCK_LADDER } from "../../src/gauntlet/tableUnlocks.js";

/**
 * What the briefing asks of the unlock ladder. The staged table is asked for
 * by passing the flag, as in table-unlocks.test.mjs: whatever the shipped
 * switch says, these hold.
 */

/** The scenes a case can open on: its written first scene, and one for each way the case before it closes. */
const openingsOf = (caseId) => [CASE_START_NODES[caseId], ...Object.values(caseOpeningRoutes[caseId] ?? {})];

test("a case's introduction is on the briefing of the scene it opens on and on no other", () => {
  for (const step of UNLOCK_LADDER) {
    const first = CASE_START_NODES[step.caseId];
    assert.ok(first, `${step.caseId} has a first scene`);
    assert.equal(getBriefingIntro(nodes[first], first, {}, true), step.intro, `${step.caseId} opens with its lines`);
    assert.ok(step.intro.length > 0);
    assert.deepEqual(getBriefingIntro(nodes[first], first, { veteran: true }, true), [], "a NEW GAME+ run is told nothing");
    assert.deepEqual(getBriefingIntro(nodes[first], first, {}, false), [], "nothing while the switch is off");
    const later = (authoredNodeOrders[step.caseId] ?? []).filter((nodeId) => nodeId !== first);
    assert.ok(later.length > 0, `${step.caseId} has later scenes`);
    for (const nodeId of later) {
      assert.deepEqual(getBriefingIntro(nodes[nodeId], nodeId, {}, true), [], `${nodeId} has nothing new to say`);
    }
  }
  const case01 = CASE_START_NODES.case01;
  assert.deepEqual(getBriefingIntro(nodes[case01], case01, {}, true), [], "사건 01 turns nothing on");
  assert.deepEqual(getBriefingIntro(undefined, undefined, {}, true), [], "a scene with no case has no introduction");
  const second = CASE_START_NODES.prologue02;
  assert.deepEqual(getBriefingIntro(nodes[second], second, {}), STAGED ? [...UNLOCK_LADDER[1].intro] : [], "the shipped switch decides by default");
});

// A played run does not enter 프롤로그 02 on `p2_start`. It enters on the
// opening the close of 프롤로그 01 picked, and every close picks one -- so an
// introduction tied to the written first scene alone was only ever seen by the
// debug jump.
test("a case entered through any of its openings is introduced, whichever way the case before it closed", () => {
  for (const step of UNLOCK_LADDER) {
    const openings = openingsOf(step.caseId);
    for (const nodeId of openings) {
      assert.equal(nodes[nodeId].caseId, step.caseId, `${nodeId} is ${step.caseId}'s`);
      assert.equal(getBriefingIntro(nodes[nodeId], nodeId, {}, true), step.intro, `${nodeId} opens ${step.caseId} with its lines`);
      assert.deepEqual(getBriefingIntro(nodes[nodeId], nodeId, { veteran: true }, true), []);
    }
    for (const nodeId of nodeOrders[step.caseId].filter((id) => !openings.includes(id))) {
      assert.deepEqual(getBriefingIntro(nodes[nodeId], nodeId, {}, true), [], `${nodeId} is not an opening`);
    }
  }
  assert.ok(openingsOf("prologue02").length > 1, "프롤로그 02 has openings beside its written first scene");
  // The mark the introduction reads is the graph's, on every opening and on nothing else.
  for (const caseId of CASE_SEQUENCE) {
    const routed = new Set(Object.values(caseOpeningRoutes[caseId] ?? {}));
    for (const nodeId of nodeOrders[caseId]) {
      assert.equal(nodes[nodeId].kind === "opening", routed.has(nodeId), `${nodeId}: kind "${nodes[nodeId].kind}"`);
    }
  }
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
  assert.match(briefing, /const intro = getBriefingIntro\(node, nodeId, run\);/);
});

test("the introduction is written straight after the speaker, and the breach panel stays last", () => {
  // The order the panels are written in is the order a phone stacks them and
  // a screen reader reads them; the grid places them in the same order by line.
  const briefing = readFileSync("src/gauntlet/SceneBriefing.jsx", "utf8");
  const order = ["gx-panel-splash", "gx-panel-speaker", 'data-testid="unlock-intro"', "gx-panel-story", "gx-panel-file", 'data-testid="protocol-breach"'].map((mark) => briefing.indexOf(mark));
  assert.ok(order.every((index) => index > 0));
  assert.deepEqual(order, [...order].sort((a, b) => a - b));
  const rows = [...briefing.matchAll(/style=\{at\("(\d+) \/ /g)].map((match) => Number(match[1]));
  assert.deepEqual(rows, [1, 1, 2, 3, 3, 4], "picture and speaker, the introduction, story and file, the breach");
  // The page is still named by its scene title, not by the panel.
  assert.match(briefing, /aria-labelledby="gx-comic-title"/);
  assert.match(briefing, /<p className="gx-breach-kicker">\{getUnlockKicker\(node\.caseId\)\}<\/p>/);
});

test("the stage draws under the rules the engine plays under, with no second answer of its own", () => {
  // Until the switch was on, a debug address (`?staged=1`) drew each case
  // under its step while the engine went on playing every rule. The stage now
  // takes its rules from the forecast alone, and nothing reads the address.
  const stage = readFileSync("src/gauntlet/GauntletStage.jsx", "utf8");
  assert.match(stage, /bustKeeps, runTension, rules,\s*\} = useTableForecast\(/);
  assert.doesNotMatch(stage, /tableStaging/);
  assert.doesNotMatch(readFileSync("src/gauntlet/tableStaging.js", "utf8"), /location|URLSearchParams/);
});
