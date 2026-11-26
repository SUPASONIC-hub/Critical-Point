import assert from "node:assert/strict";
import { test } from "node:test";

import { createStorage } from "./helpers/browser.mjs";

globalThis.localStorage = createStorage();

const { CASE_RESULT_NODES, CASE_SEQUENCE } = await import("../../src/gameCases.js");
const { nodes } = await import("../../src/gameData.js");
const { getWindowResponseTime } = await import("../../src/gameLogic.js");
const { BASE_SCHEMA, createWindow, getTableSchema, openCaseRun, resolveWindow, RUN_INITIAL_STATE, STORY_WALL_MIN } = await import("../../src/gauntlet/gauntletEngine.js");
const { getTableRules } = await import("../../src/gauntlet/tableUnlocks.js");
const { openTraced, recordClosedWindow, reduceTraced } = await import("../../src/gauntlet/windowTrail.js");
const { recheckWindow } = await import("../../src/gauntlet/windowReplay.js");
const { isTimeOffClock } = await import("../../src/rankingRecheck.js");
const { isSignScene } = await import("../../src/state/settleChoice.js");
const { isAutoCashTable, isSignNode, planAutoCash, STORY_AUTO_HEAT } = await import("../../src/gauntlet/storyAutoCash.js");

const storyRun = (caseId) => openCaseRun({ ...RUN_INITIAL_STATE, story: true }, { rules: getTableRules(caseId, { story: true }), caseId });
const boardRun = (caseId) => openCaseRun({ ...RUN_INITIAL_STATE }, { rules: getTableRules(caseId, {}), caseId });

test("G43: the 결재 판 is G6's -- the scene every card of which closes the case -- and every case closes through one", () => {
  for (const [nodeId, node] of Object.entries(nodes)) {
    assert.equal(isSignNode(node.caseId, node), isSignScene(node.caseId, nodeId), `${nodeId}: one rule for G6 and G43`);
  }
  for (const [caseId, result] of Object.entries(CASE_RESULT_NODES)) {
    const inCase = Object.entries(nodes).filter(([, node]) => node.caseId === caseId);
    assert.ok(inCase.some(([, node]) => isSignNode(caseId, node)), `${caseId} has a 결재 판`);
    // No other scene closes the case: a season is played by hand once a case, on every route.
    const closers = inCase.filter(([, node]) => node.choices?.some((choice) => choice.type !== "reframe" && choice.next === result));
    for (const [nodeId, node] of closers) assert.ok(isSignNode(caseId, node), `${caseId}/${nodeId} closes the case only as its 결재 판`);
  }
});

test("G43: only a story run's tables other than the 결재 판 are cashed for the player, and the setting plays them all", () => {
  const caseId = CASE_SEQUENCE[3];
  const inCase = Object.values(nodes).filter((node) => node.caseId === caseId);
  const sign = inCase.find((node) => isSignNode(caseId, node));
  const plain = inCase.find((node) => node.choices?.length && !isSignNode(caseId, node));
  assert.ok(sign && plain);
  assert.equal(isAutoCashTable({ run: { story: true }, caseId, node: plain }), true);
  assert.equal(isAutoCashTable({ run: { story: true }, caseId, node: sign }), false, "the 결재 판 is played by hand");
  assert.equal(isAutoCashTable({ run: { story: true }, caseId, node: plain, playAll: true }), false, "판 모두 직접 치기");
  assert.equal(isAutoCashTable({ run: {}, caseId, node: plain }), false, "board mode is never cashed for the player");
  assert.equal(isAutoCashTable({ run: { story: false }, caseId, node: plain }), false);
  assert.equal(isAutoCashTable({ run: null, caseId, node: plain }), false);
});

test("G43: the auto table cashes at heat 70 under the story wall, never busts, and replays as the hand it was", () => {
  let windows = 0;
  for (const caseId of CASE_SEQUENCE) {
    const run = storyRun(caseId);
    const rules = getTableRules(caseId, run);
    for (let index = 0; index < 12; index += 1) {
      const seed = `g43:${caseId}:${index}`;
      const dealt = createWindow({ schema: getTableSchema(run), seed });
      assert.ok(dealt.schema.wallMin >= STORY_WALL_MIN);
      const plan = planAutoCash(dealt, "card", { rules });
      const { window } = plan;
      assert.equal(window.status, "cashed", `${seed}: cashed`);
      assert.ok(window.gauge >= STORY_AUTO_HEAT || window.gauge + window.schema.stepMax >= window.schema.wallMin, `${seed}: pushed to 70 (${window.gauge})`);
      assert.ok(window.gauge < window.schema.wallMin, `${seed}: under the band`);
      assert.deepEqual(plan.events[0], { type: "SELECT", id: "card" });
      assert.equal(plan.events.at(-1).type, "CASH");
      assert.equal(plan.events.filter((event) => event.type === "PUSH").length, window.pushes);

      // The stage dispatches the same events to its traced reducer: the same window, with a trail that replays.
      const traced = plan.events.reduce((win, event) => reduceTraced(win, event, rules), openTraced({ schema: getTableSchema(run), seed }));
      assert.equal(traced.gauge, window.gauge);
      assert.equal(traced.status, "cashed");
      const record = recordClosedWindow(traced);
      assert.ok(record, "a replay record, as a hand's");
      const { verdict } = resolveWindow({ run, window: traced, card: { id: "card", effect: {} }, rules });
      const threshold = { busted: false, cause: verdict.cause, gauge: verdict.gauge, wall: verdict.wall, pushes: verdict.pushes, scouted: verdict.scouted, focus: verdict.focus };
      assert.equal(recheckWindow(record, threshold, rules).status, "match", `${seed}: the server's replay matches`);
      // The time logged is the window's clock, which the recheck holds it to.
      const responseTimeSec = getWindowResponseTime({ elapsed: traced.elapsed });
      assert.equal(isTimeOffClock({ responseTimeSec }, record), false);
      assert.ok(responseTimeSec <= 12, "a quick hand, as a story player's");
      windows += 1;
    }
  }
  assert.ok(windows > 100);
});

test("G43: a sealed card is pushed until its seal breaks, and a closed window is left alone", () => {
  const schema = { ...BASE_SCHEMA, wallMin: 90, wallMax: 98, sealBreak: 80 };
  const dealt = createWindow({ schema, seed: "g43:seal" });
  const sealedPlan = planAutoCash(dealt, "sealed", { rules: getTableRules("final", {}), sealedId: "sealed" });
  // Pushed until the seal (as the board keeps it, under the band's reach) breaks.
  assert.equal(sealedPlan.window.status, "cashed");
  assert.ok(sealedPlan.window.gauge >= dealt.schema.sealBreak);
  const closed = { ...dealt, status: "bust" };
  assert.deepEqual(planAutoCash(closed, "card", {}).events, []);
  assert.equal(planAutoCash(closed, "card", {}).window, closed);
});

test("G43: no table of a board-mode run is cashed for the player", () => {
  for (const caseId of CASE_SEQUENCE) {
    const run = boardRun(caseId);
    for (const node of Object.values(nodes).filter((candidate) => candidate.caseId === caseId)) {
      assert.equal(isAutoCashTable({ run, caseId, node }), false, `${caseId}/${node.title}`);
    }
  }
});
