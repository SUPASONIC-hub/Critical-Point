import { CASE_SEQUENCE, CASE_START_NODES, RESULT_NODE_IDS } from "./gameCases.js";

/**
 * The season's rules that read its tables rather than build them: which
 * memory card an opening deals, where a gated detour goes, which scene of
 * each case forks, how deep into its case a scene sits, and whose card a
 * speaker shows in a given case. They sat in gameData.js beside the tables they read. They
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
 * The card a scene was written to lead with, wherever the deal put it
 * (`leadChoiceId`, nodes/sceneBuild.js). A scene built without one leads with
 * the first card it deals.
 */
export function getLeadChoice(node = null) {
  const dealt = (node?.choices ?? []).filter((choice) => choice.type !== "reframe");
  return dealt.find((choice) => choice.id === node.leadChoiceId) ?? dealt[0] ?? null;
}

/**
 * The id a case closes on. The runtime builds two choices of its own on a
 * case's closing scene -- `<case>_adaptive_reframe` and
 * `<case>_relationship_bridge` -- and both go where the scene's lead card
 * goes. No outcome, carryover, continuity or opening table knows their ids, so
 * a case they close records the card they stand in for, and the next case
 * opens as if it had been taken.
 *
 * That card is the lead card, the one whose `next` they were built from. This
 * used to read the first card the scene deals, which was the same card until
 * the deal was shuffled: in 39 of the 55 cases the two then differed, and a
 * case closed toward one outcome was recorded, and carried over, as another.
 */
export function getOutcomeChoiceId(choiceId = "", node = null) {
  if (!/_(adaptive_reframe|relationship_bridge)$/.test(choiceId ?? "")) return choiceId;
  return getLeadChoice(node)?.id ?? choiceId;
}

/**
 * Where a scene goes when nobody is there to choose (a bust skips the scene
 * the card led to, useChoiceCommit.getBlackoutSkip): where its lead card goes
 * on this run, a gated detour taking its bypass when its condition does not
 * hold. `null` for a scene that deals nothing.
 */
export function getUnattendedNext(node = null, context = {}) {
  const lead = getLeadChoice(node);
  if (!lead) return null;
  return getBranchDetourBypass(lead, context) ?? lead.next ?? null;
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
 * Whether some run of cards leads from the scene `fromId` to the scene `toId`.
 * 판을 다시 짠다 asks it before it opens a case's hidden route: a scene that
 * route itself runs into would be dealt a second time. Today that is the
 * finale's closing decision alone -- the hidden route's final goes up to the
 * 33rd floor and comes back down to `f_choice` -- and there the card goes
 * where it says instead.
 */
export function runsInto(nodes, fromId, toId) {
  const seen = new Set([fromId]);
  const queue = [fromId];
  while (queue.length > 0) {
    for (const { next } of nodes[queue.shift()]?.choices ?? []) {
      if (next === toId) return true;
      if (seen.has(next)) continue;
      seen.add(next);
      queue.push(next);
    }
  }
  return false;
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

/**
 * How far into its case a scene sits, walked from the graph rather than read
 * off the order: a case opens on any of its openings and forks from there, so
 * a scene's depth is the shortest way to it.
 */
export function createRouteReaders(nodes, caseOpeningRoutes) {
  function getPlayableRoute(caseId) {
    const route = new Map();
    const queue = [
      CASE_START_NODES[caseId],
      ...Object.values(caseOpeningRoutes[caseId] ?? {}),
    ].filter(Boolean).map((nodeId) => ({ nodeId, depth: 0 }));
    const seen = new Set();
    while (queue.length > 0) {
      const { nodeId, depth } = queue.shift();
      if (!nodeId || seen.has(nodeId) || RESULT_NODE_IDS.has(nodeId)) continue;
      seen.add(nodeId);
      route.set(nodeId, depth);
      for (const choice of nodes[nodeId]?.choices ?? []) {
        if (choice.next && !seen.has(choice.next) && !RESULT_NODE_IDS.has(choice.next)) {
          queue.push({ nodeId: choice.next, depth: depth + 1 });
        }
      }
    }
    return route;
  }

  return {
    getCaseRouteLength(caseId) {
      return Math.max(1, ...getPlayableRoute(caseId).values()) + 1;
    },
    getNodeRouteIndex(caseId, nodeId) {
      const branchStartIds = new Set(Object.values(caseOpeningRoutes[caseId] ?? {}));
      if (branchStartIds.has(nodeId)) return 0;
      return getPlayableRoute(caseId).get(nodeId) ?? -1;
    },
  };
}

/**
 * Someone's card in one case: the profile, the role the season's spans give
 * them by then, and whatever the case's own pack says about them.
 */
export function readCharacterProfile({ profiles, roleSpans, overrides }, name, caseId) {
  const profile = profiles[name];
  if (!profile) return null;
  const position = CASE_SEQUENCE.indexOf(caseId);
  if (position < 0) return profile;
  const role = roleSpans.reduce(
    (current, span) =>
      span.roles[name] && position >= CASE_SEQUENCE.indexOf(span.from) && position <= CASE_SEQUENCE.indexOf(span.to) ? span.roles[name] : current,
    profile.role,
  );
  return { ...profile, role, ...overrides[caseId]?.[name] };
}

/**
 * Files what each memory card answers under the id the card is dealt with
 * (`caseNN_memory_route`, `_system`, `_evidence`). The card is dealt at run
 * time, so it is no scene's choice and the authored echo table -- which is
 * checked against the graph -- cannot hold its reply; the plan carries it.
 */
export function fileMemoryEchoes(memoryPlans, echoReplies) {
  Object.entries(memoryPlans).forEach(([caseId, plan]) => {
    for (const kind of ["route", "system", "evidence"]) {
      if (plan?.[`${kind}Echo`]) echoReplies[`${caseId}_memory_${kind}`] = plan[`${kind}Echo`];
    }
  });
}
