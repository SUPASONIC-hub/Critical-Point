import { caseIntroEchoes, legacyProfiles } from "../caseCopy.js";
import { RESULT_NODE_IDS } from "../gameCases.js";
import {
  CASE_SEQUENCE,
  CASE_START_NODES,
  SEASON_ENTRY_CASE,
  caseOpeningRoutes,
  getCaseBranchNodes,
  initialResources,
  nodes,
  reframeRouteNodes,
} from "../gameData.js";
import { applyEffect, getCaseOutcome, getContinuityChallenge, getOutcomeCarryover, getSeasonWear, getUnattendedNext } from "../gameLogic.js";
import { runsInto } from "../seasonRules.js";
import { createOpeningResources } from "./openingState.js";

/**
 * Where a case opens, and where a committed card sends the run when it is not
 * where the card says: the three rules `scripts/check-endings.mjs` replays a
 * season with. They sat un-exported in `runLifecycle.js` and
 * `useChoiceCommit.js`, and the script kept a copy of each written by hand --
 * the kind of copy that had it hand the clue roll a field the runtime never
 * sets. They are here so the runtime and the script run the same code.
 *
 * Node imports this file as it is, so it imports no React and reads nothing of
 * the browser.
 */

/**
 * What a case opens with, worked out from how the one before it closed: the
 * scene, the hand, the legacy the table shows, and the line under the scene.
 */
export function describeCaseOpening(caseId, { caseResults, operatorOrigin }) {
  const baseStartNode = CASE_START_NODES[caseId];
  const introEcho = caseIntroEchoes[caseId] ?? caseIntroEchoes[SEASON_ENTRY_CASE];
  const previousCaseId = CASE_SEQUENCE[CASE_SEQUENCE.indexOf(caseId) - 1];
  const previousResult = previousCaseId ? caseResults[previousCaseId] : null;
  const nodeId = caseOpeningRoutes[caseId]?.[previousResult?.outcomeChoiceId] ?? baseStartNode;
  const previousOutcome = previousResult?.outcomeChoiceId
    ? getCaseOutcome({ caseId: previousCaseId, choiceId: previousResult.outcomeChoiceId })
    : null;
  // The outcome and carryover tables are keyed by the case that produced the
  // outcome; the continuity challenges are keyed by the case they open
  // (`case01: { p5_after_hold, ... }`). Looking them up under the previous
  // case found nothing, so no authored challenge ever reached a table.
  const continuityChallenge = previousResult?.outcomeChoiceId
    ? getContinuityChallenge({ caseId, choiceId: previousResult.outcomeChoiceId })
    : null;
  const carryoverEffect = previousResult?.outcomeChoiceId
    ? getOutcomeCarryover({ caseId: previousCaseId, choiceId: previousResult.outcomeChoiceId })
    : {};
  const baseLegacy = previousResult ? legacyProfiles[previousResult.rank] ?? legacyProfiles.C : null;
  // What the season has worn down is added on top.
  const openingEffect = { ...(baseLegacy?.effect ?? {}) };
  [carryoverEffect, getSeasonWear(caseId)].forEach((effect) => Object.entries(effect).forEach(([key, value]) => {
    openingEffect[key] = (openingEffect[key] ?? 0) + value;
  }));
  const openingLegacy = previousResult
    ? {
        ...baseLegacy,
        effect: openingEffect,
        continuity: previousOutcome,
        continuityChallenge,
      }
    : null;
  const echo = previousOutcome
    ? `${introEcho} 직전 사건의 결과는 '${previousOutcome.title}'로 기록됐습니다. 이번 사건은 그 선택의 비용을 이어받습니다.`
    : introEcho;
  // The origin bonus is the run's opening hand, so it belongs to the season's
  // first case -- which is the 프롤로그 now, not 사건 01.
  const seasonOpening = caseId === SEASON_ENTRY_CASE && !previousResult;
  const resources = seasonOpening
    ? createOpeningResources(operatorOrigin)
    : previousResult ? applyEffect(initialResources, openingEffect) : initialResources;
  return { nodeId, resources, openingLegacy, echo, note: previousResult?.outcomeChoiceId ?? "season-start" };
}

/**
 * Where 판을 다시 짠다 leads: the case's authored hidden route, once per case,
 * or the far side of the case's first fork when it has none. Nowhere, from a
 * scene the hidden route itself runs into: the card goes where it says.
 */
export function getReframeTarget(caseId, fromNodeId) {
  const dramaticRoute = reframeRouteNodes[caseId];
  if (dramaticRoute && runsInto(nodes, dramaticRoute, fromNodeId)) return null;
  if (dramaticRoute && fromNodeId !== dramaticRoute && nodes[dramaticRoute]) return dramaticRoute;
  const branch = getCaseBranchNodes().find((item) => item.caseId === caseId);
  if (!branch || branch.nodeId === fromNodeId) return null;
  return branch.detourIds[0] ?? branch.nextIds[0] ?? null;
}

/**
 * What a bust costs the story, not just the score. The room does not wait for
 * an analyst who blew up: the scene the card led to plays out without them,
 * and the table deals the one after it. Never onto a result -- a bust does not
 * close a case -- and never off the authored graph.
 *
 * The room goes where the skipped scene's lead card would have taken it
 * (gameLogic.getUnattendedNext), through the same gate a played card passes.
 * It used to follow the first card dealt, which the shuffled deal made a
 * different route on forty fork scenes, and it walked into gated detours.
 *
 * A story run is not skipped past anything (the caller does not ask): the
 * mode is there so the story can be read, and a scene played without the
 * player is a scene they did not read. The bust still costs what a bust costs.
 *
 * And in any run, a scene marked `attended` (its scene context says so; the
 * finale's two decisions are, the 33rd floor and the last choice in B2) is
 * not played without the analyst either: the run lands on it.
 */
export function getBlackoutSkip(fromNodeId, branchContext) {
  const skippedNode = nodes[fromNodeId];
  if (!skippedNode || skippedNode.attended || RESULT_NODE_IDS.has(fromNodeId)) return null;
  const onward = getUnattendedNext(skippedNode, branchContext);
  if (!onward || !nodes[onward] || RESULT_NODE_IDS.has(onward)) return null;
  return { nodeId: onward, skippedNodeId: fromNodeId, skippedTitle: skippedNode.title };
}
