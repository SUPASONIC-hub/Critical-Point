// The app build's gameData.js (scripts/vite-season-data.mjs swaps it in): the
// same names, answered by a store that cases arrive in one at a time. Node --
// the checks, the unit tests, the generators -- reads src/gameData.js itself.
// tests/unit/season-runtime.test.mjs holds the store to it.
import { season } from "virtual:season";

export { byEffectWeight, cognitionLabels, costWhenRising, initialResources, isResourceGain, triggerLabels } from "../gameConstants.js";
export {
  CASE_RESULT_NODES,
  CASE_SEQUENCE,
  CASE_START_NODES,
  SEASON_ENTRY_CASE,
  SEASON_ENTRY_NODE,
  caseAftermathNodeId,
  caseDisplayCode,
  caseNodePrefix,
  caseObjectives,
  seasonCasesBase,
} from "../gameCases.js";

export const {
  nodes,
  echoReplies,
  choiceVoiceLines,
  characterProfiles,
  nodeOrders,
  caseOpeningRoutes,
  reframeRouteNodes,
  CASE_PACKS,
  getCaseRouteLength,
  getNodeRouteIndex,
  getCaseBranchNodes,
  getBranchDetourBypass,
  getContinuityMemoryChoice,
  ensureCase,
  ensureAllCases,
  isCaseLoaded,
} = season;
