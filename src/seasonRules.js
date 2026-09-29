import { CASE_SEQUENCE, CASE_START_NODES } from "./gameCases.js";

/**
 * The season's rules that read its tables rather than build them: which
 * memory card an opening deals, where a gated detour goes, and which scene of
 * each case forks. They sat in gameData.js beside the tables they read. They
 * are here, taking those tables as arguments, so the runtime can answer them
 * from tables that arrive a case at a time (the per-case chunk split,
 * docs/work-status.md) with the same code `gameData.js` answers them with.
 * Keep this module free of the scene graph: it is imported by both.
 */

export const branchConditions = {
  costAlreadyPaid: {
    // Two disjuncts read "someone was hurt" and "the record slipped", which is
    // the harm-first and the procedure-first way of paying. A player who
    // protects people and follows procedure pays in hours instead, and had no
    // way in: case 04's detour was unreachable for exactly the run that plays
    // the case as written. The third disjunct is that run's receipt.
    label: "이미 누군가 비용을 치른 뒤에만 열립니다 (사람 피해, 공정함, 또는 남은 시간)",
    test: ({ resources } = {}) =>
      (resources?.humanCost ?? 0) >= 6 ||
      (resources?.legitimacy ?? 100) <= 45 ||
      (resources?.time ?? 100) <= 44,
  },
  ruleNotYetClosed: {
    label: "직전 사건을 규칙으로 닫지 않았을 때만 열립니다",
    test: ({ previousOutcomeChoiceId } = {}) => previousOutcomeChoiceId !== "c4_after_rule",
  },
};

/**
 * Where a gated detour choice actually goes on this run. Returns the bypass
 * route when the condition does not hold, and null when the choice routes
 * normally, so callers can write `detour ?? choice.next`.
 */
export function getBranchDetourBypass(choice = {}, context = {}) {
  const condition = branchConditions[choice.branchCondition];
  if (!condition || !choice.branchBypass) return null;
  return condition.test(context) ? null : choice.branchBypass;
}

/**
 * Reads the previous case's recorded route memory, not the run log: a case
 * start clears the log, so the log-based version of this could never find
 * anything and the choice never once appeared in a played season.
 */
export function readContinuityMemoryChoice({ plans, openingRoutes }, { caseId = CASE_SEQUENCE[0], nodeId = "", caseResults = {} } = {}) {
  const plan = plans[caseId];
  if (!plan) return null;
  const openingNodes = new Set([CASE_START_NODES[caseId], ...Object.values(openingRoutes[caseId] ?? {})]);
  if (!openingNodes.has(nodeId)) return null;
  const previousCaseId = CASE_SEQUENCE[CASE_SEQUENCE.indexOf(caseId) - 1];
  const memory = previousCaseId ? caseResults?.[previousCaseId]?.routeMemory : null;
  if (!memory) return null;
  if (memory.evidenceTurn) {
    return {
      id: `${caseId}_memory_evidence`,
      label: plan.evidenceLabel,
      effect: { legitimacy: 6, trust: 3, time: -5, fatigue: 5 },
      cognition: { inference: 2, reframing: 1 },
      next: plan.evidenceNext,
      // No authority check here. This choice only exists because the previous
      // case's turnaround was actually walked, and that is the credential --
      // asking for FIELD ACCESS on top of it locked the case 02 opening behind
      // two clues the player could not yet hold.
      continuityMemory: true,
    };
  }
  if (memory.systemRoute) {
    return {
      id: `${caseId}_memory_system`,
      label: plan.systemLabel,
      effect: { legitimacy: 5, trust: 2, time: -4, fatigue: 4 },
      cognition: { reframing: 2 },
      next: plan.systemNext,
      continuityMemory: true,
    };
  }
  // Only 사건 02-06 write a route card: a route split is a walk down a route
  // that is not the hidden one, and only 사건 01-05 have such routes.
  if (!memory.routeSplit || !plan.routeLabel) return null;
  return {
    id: `${caseId}_memory_route`,
    label: plan.routeLabel,
    effect: { trust: 5, legitimacy: 4, time: -3, fatigue: 4 },
    cognition: { persistence: 1, inference: 1 },
    next: plan.routeNext,
    continuityMemory: true,
  };
}

/**
 * The one authored mid-case fork per case, with the scenes each side leads to.
 * Derived from the graph so adding a branch needs no second list.
 */
export function readCaseBranchNodes(nodes, nodeOrders) {
  return CASE_SEQUENCE.map((caseId) => {
    const nodeId = [...new Set(nodeOrders[caseId])].find((id) => {
      const scene = nodes[id];
      if (!scene) return false;
      return scene.choices.some((choice) => choice.branchId);
    });
    if (!nodeId) return null;
    return {
      caseId,
      nodeId,
      nextIds: [...new Set(nodes[nodeId].choices.map((choice) => choice.next))],
      // Named separately from nextIds: the detour is no longer always the first
      // route out of the fork, because it is no longer always on the first column.
      detourIds: [...new Set(nodes[nodeId].choices.map((choice) => choice.branchId).filter(Boolean))],
    };
  }).filter(Boolean);
}
