import assert from "node:assert/strict";
import { test } from "node:test";

import { nodes } from "../../src/gameData.js";
import { BASE_SCHEMA, createWindow, normalizeRunState, reduceWindow } from "../../src/gauntlet/gauntletEngine.js";
import { carryChoiceLinks, settleChoice } from "../../src/state/settleChoice.js";

/**
 * F1 phase 3, S2 (서버검증-설계안.md): a decision's settlement outside React.
 * This file loads it with no browser stood in (no `installBrowser`), as a
 * server check would, and settles the same press twice.
 */
test("settleChoice runs in node with no browser, and the same state and press settle the same twice", () => {
  const node = nodes.p1_start;
  const run = normalizeRunState({ weekRule: "audit-cascade" });
  const fresh = createWindow({ schema: BASE_SCHEMA, seed: "settle-node" });
  const window = reduceWindow({ ...fresh, selectedId: "a", gauge: 30, pushes: 3, elapsed: 6 }, { type: "CASH" });
  const state = { caseId: node.caseId, nodeId: "p1_start", node, resources: { trust: 50, legitimacy: 50, fatigue: 20 }, log: [], caseResults: {}, run, runId: "run-node" };
  const press = { choice: node.choices[0], window };
  const first = settleChoice(state, press);
  const second = settleChoice(structuredClone(state), press);
  assert.deepEqual(first, second);
  assert.equal(first.nextNode, node.choices[0].next);
  assert.equal(first.verdict.outcome, "cash");
  assert.deepEqual(carryChoiceLinks(first, { run, nextLog: [], runId: "run-node", caseId: node.caseId }), first.settledRun, "an open case hands nothing on");
});

/**
 * N21 (the owner's answer of 2026-11-16, (1), for the reset of 11-25): a bust
 * in 프롤로그 01 or 02 costs the stake and not the next scene; from 프롤로그 03
 * the room plays it without the analyst, as before.
 */
test("a bust in 프롤로그 01 and 02 keeps the next scene; from 프롤로그 03 it skips it", async () => {
  const { routeChoice } = await import("../../src/state/settleChoice.js");
  const { getBlackoutSkip, keepsSceneOnBust, SCENE_KEPT_CASES } = await import("../../src/state/caseRoutes.js");
  assert.deepEqual(SCENE_KEPT_CASES, ["prologue01", "prologue02"]);
  const bust = { status: "bust" };
  const resources = { trust: 50, legitimacy: 50, fatigue: 20 };
  const skippable = (caseId) =>
    Object.entries(nodes)
      .filter(([, node]) => node.caseId === caseId)
      .flatMap(([nodeId, node]) => (node.choices ?? []).map((choice) => ({ nodeId, choice })))
      .find(({ choice }) => getBlackoutSkip(choice.next, { resources }));
  for (const caseId of ["prologue01", "prologue02", "prologue03"]) {
    const found = skippable(caseId);
    assert.ok(found, `${caseId} has a scene a bust could skip`);
    const route = routeChoice({ caseId, nodeId: found.nodeId, resources, run: {} }, { choice: found.choice, window: bust });
    if (keepsSceneOnBust(caseId)) {
      assert.equal(route.blackoutSkip, null, `${caseId}: the next scene is kept`);
      assert.equal(route.nextNode, found.choice.next, `${caseId}: the run goes where the card leads`);
    } else {
      assert.ok(route.blackoutSkip, `${caseId}: the scene is skipped`);
      assert.notEqual(route.nextNode, found.choice.next);
    }
  }
});
