import assert from "node:assert/strict";
import { test } from "node:test";

import { CASE_SEQUENCE, CASE_START_NODES } from "../../src/gameCases.js";
import { branchConditions, getBranchDetourBypass, readCaseBranchNodes, readContinuityMemoryChoice } from "../../src/seasonRules.js";

/**
 * The rules that read the season's tables (src/seasonRules.js), on tables of
 * the test's own: the per-case chunk split will answer them from tables that
 * arrive a case at a time, so they must not reach for the built graph.
 */
const CASE = CASE_SEQUENCE[2];
const PREVIOUS = CASE_SEQUENCE[1];
const START = CASE_START_NODES[CASE];
const plan = {
  evidenceLabel: "E", evidenceNext: "e_next",
  systemLabel: "S", systemNext: "s_next",
  routeLabel: "R", routeNext: "r_next",
};
const tables = { plans: { [CASE]: plan }, openingRoutes: { [CASE]: { [`${PREVIOUS}_after_x`]: "opening_x" } } };
const withMemory = (routeMemory) => ({ caseId: CASE, nodeId: START, caseResults: { [PREVIOUS]: { routeMemory } } });

test("a memory card is dealt on an opening, by the strongest memory the previous case left", () => {
  assert.equal(readContinuityMemoryChoice(tables, withMemory({ evidenceTurn: true, systemRoute: true, routeSplit: true })).id, `${CASE}_memory_evidence`);
  assert.equal(readContinuityMemoryChoice(tables, withMemory({ systemRoute: true, routeSplit: true })).next, "s_next");
  const route = readContinuityMemoryChoice(tables, { ...withMemory({ routeSplit: true }), nodeId: "opening_x" });
  assert.equal(route.label, "R");
  assert.equal(route.continuityMemory, true);
});

test("no card: no plan, not an opening, no memory, or a route split with no route card written", () => {
  assert.equal(readContinuityMemoryChoice(tables, { ...withMemory({ evidenceTurn: true }), caseId: CASE_SEQUENCE[3] }), null);
  assert.equal(readContinuityMemoryChoice(tables, { ...withMemory({ evidenceTurn: true }), nodeId: "somewhere_else" }), null);
  assert.equal(readContinuityMemoryChoice(tables, { caseId: CASE, nodeId: START, caseResults: {} }), null);
  assert.equal(readContinuityMemoryChoice(tables, withMemory({})), null);
  const noRoute = { ...tables, plans: { [CASE]: { ...plan, routeLabel: undefined } } };
  assert.equal(readContinuityMemoryChoice(noRoute, withMemory({ routeSplit: true })), null);
  // The season's first case has no previous case to remember.
  const first = { plans: { [CASE_SEQUENCE[0]]: plan }, openingRoutes: {} };
  assert.equal(readContinuityMemoryChoice(first, { caseId: CASE_SEQUENCE[0], nodeId: CASE_START_NODES[CASE_SEQUENCE[0]] }), null);
});

test("a gated detour goes round when its condition does not hold", () => {
  const choice = { branchCondition: "costAlreadyPaid", branchBypass: "bypass" };
  assert.equal(getBranchDetourBypass(choice, { resources: { humanCost: 6 } }), null);
  assert.equal(getBranchDetourBypass(choice, { resources: { legitimacy: 45 } }), null);
  assert.equal(getBranchDetourBypass(choice, { resources: { time: 44 } }), null);
  assert.equal(getBranchDetourBypass(choice, { resources: { humanCost: 0, legitimacy: 80, time: 60 } }), "bypass");
  assert.equal(getBranchDetourBypass(choice, {}), "bypass");
  const rule = { branchCondition: "ruleNotYetClosed", branchBypass: "round" };
  assert.equal(getBranchDetourBypass(rule, { previousOutcomeChoiceId: "c4_after_rule" }), "round");
  assert.equal(getBranchDetourBypass(rule, { previousOutcomeChoiceId: "c4_after_service" }), null);
  assert.equal(getBranchDetourBypass({ branchBypass: "x" }), null, "no condition: routes normally");
  assert.equal(getBranchDetourBypass({ branchCondition: "costAlreadyPaid" }), null, "no bypass: routes normally");
  assert.equal(getBranchDetourBypass(), null);
  for (const condition of Object.values(branchConditions)) assert.ok(condition.label);
  assert.equal(branchConditions.costAlreadyPaid.test(), false);
  assert.equal(branchConditions.ruleNotYetClosed.test(), true);
});

test("each case's fork is the first scene in its order that deals a detour", () => {
  const nodes = {
    a: { choices: [{ next: "b" }] },
    b: { choices: [{ next: "c", branchId: "d1" }, { next: "c" }, { next: "e", branchId: "d1" }] },
  };
  const orders = { [CASE_SEQUENCE[0]]: ["a", "b", "missing"], [CASE_SEQUENCE[1]]: ["a"] };
  assert.deepEqual(readCaseBranchNodes(nodes, orders), [{ caseId: CASE_SEQUENCE[0], nodeId: "b", nextIds: ["c", "e"], detourIds: ["d1"] }]);
});
