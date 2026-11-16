import assert from "node:assert/strict";
import { test } from "node:test";

import { GAME_EVENTS, noteSceneShown, resetGameEventsForTest, SCENE_EVENT_CASES } from "../../src/gameEvents.js";
import { authoredNodeOrders } from "../../src/gameCases.js";

/**
 * N16 (2026-11-16): 프롤로그 01·02's written scenes as one GA event,
 * `cp_scene`, with two whole numbers and nothing else, once per scene per
 * page, and only on a device that left the play record on.
 */

const pageWithTag = () => {
  const calls = [];
  return { calls, scope: { gtag: (...args) => calls.push(args) } };
};

test("each written scene of 프롤로그 01 and 02 goes once, as two whole numbers", () => {
  resetGameEventsForTest();
  const { calls, scope } = pageWithTag();
  for (const caseId of ["prologue01", "prologue02"]) {
    authoredNodeOrders[caseId].forEach((nodeId) => {
      assert.equal(noteSceneShown(caseId, nodeId, { consent: true, scope }), true, `${caseId} ${nodeId}`);
      assert.equal(noteSceneShown(caseId, nodeId, { consent: true, scope }), false, "a scene shown again on the same page");
    });
  }
  assert.equal(calls.length, authoredNodeOrders.prologue01.length + authoredNodeOrders.prologue02.length);
  assert.deepEqual(calls[0], ["event", GAME_EVENTS.scene, { case_no: 1, scene_no: 1 }]);
  assert.deepEqual(calls.at(-1), ["event", "cp_scene", { case_no: 2, scene_no: authoredNodeOrders.prologue02.length }]);
  for (const [, , params] of calls) {
    assert.deepEqual(Object.keys(params).sort(), ["case_no", "scene_no"]);
    assert.ok(Object.values(params).every((value) => Number.isInteger(value) && value > 0));
  }
});

test("no consent, no tag, another case or an in-between scene sends nothing", () => {
  resetGameEventsForTest();
  const { calls, scope } = pageWithTag();
  const first = authoredNodeOrders.prologue01[0];
  assert.equal(noteSceneShown("prologue01", first, { consent: false, scope }), false, "the start page's 기록 보내기 unchecked");
  assert.equal(noteSceneShown("prologue01", first, { scope }), false, "consent unknown counts as no");
  assert.equal(noteSceneShown("prologue01", first, { consent: true, scope: {} }), false, "no Google tag on the page");
  assert.equal(noteSceneShown("prologue03", authoredNodeOrders.prologue03[0], { consent: true, scope }), false);
  assert.equal(noteSceneShown("case01", authoredNodeOrders.case01[0], { consent: true, scope }), false);
  assert.equal(noteSceneShown("prologue01", "p1_ledger_reaction", { consent: true, scope }), false, "a scene the graph adds has no fixed number");
  assert.equal(noteSceneShown("prologue01", "prologue01_result", { consent: true, scope }), false);
  assert.deepEqual(calls, []);
  // Refused once is not spent: the same scene still goes when the record is on.
  assert.equal(noteSceneShown("prologue01", first, { consent: true, scope }), true);
});

test("only 프롤로그 01 and 02 are counted scene by scene, with their own numbers", () => {
  assert.deepEqual(SCENE_EVENT_CASES, { prologue01: 1, prologue02: 2 });
  assert.ok(authoredNodeOrders.prologue01.length <= 9 && authoredNodeOrders.prologue02.length <= 9);
});
