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
