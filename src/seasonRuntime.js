import { CASE_SEQUENCE } from "./gameCases.js";
import {
  createRouteReaders,
  getBranchDetourBypass,
  readCharacterProfile,
  readContinuityMemoryChoice,
} from "./seasonRules.js";

/**
 * The season as the app will read it once cases arrive one at a time (the
 * per-case chunk split, docs/work-status.md). Step 2b: the store, not yet
 * wired to the build or read by the app.
 *
 * `index` is what every case needs from the start (scripts/season-split.mjs
 * builds it); `loadCaseData(caseId)` returns, or resolves to, one case's
 * scenes, replies and voice lines. The store answers every name the app reads
 * from `gameData.js` and `gameDialogue.js` -- the same objects, filled as
 * cases arrive, so a reader stays synchronous and only the code that opens a
 * case has to `await ensureCase(caseId)` first. The rules are the same code
 * `gameData.js` uses (src/seasonRules.js).
 *
 * tests/unit/season-runtime.test.mjs loads every case and holds each table
 * and each rule's answers to what `gameData.js` gives.
 */
export function createSeasonRuntime(index, loadCaseData) {
  const nodes = {};
  const echoReplies = { ...index.sharedEcho };
  const choiceVoiceLines = {};
  const arriving = new Map();
  const loaded = new Set();

  function ensureCase(caseId) {
    if (!arriving.has(caseId)) {
      const arrival = Promise.resolve()
        .then(() => loadCaseData(caseId))
        .then((data) => {
          Object.assign(nodes, data.nodes);
          Object.assign(echoReplies, data.echoReplies);
          Object.assign(choiceVoiceLines, data.choiceVoiceLines);
          loaded.add(caseId);
        })
        .catch((error) => {
          // A failed fetch is asked again next time, not remembered as failed.
          arriving.delete(caseId);
          throw error;
        });
      arriving.set(caseId, arrival);
    }
    return arriving.get(caseId);
  }

  const { getCaseRouteLength, getNodeRouteIndex } = createRouteReaders(nodes, index.caseOpeningRoutes);
  const characterTables = { profiles: index.characterProfiles, roleSpans: index.roleSpans, overrides: index.characterOverrides };

  return {
    ensureCase,
    ensureAllCases: () => Promise.all(CASE_SEQUENCE.map((caseId) => ensureCase(caseId))),
    isCaseLoaded: (caseId) => loaded.has(caseId),
    nodes,
    echoReplies,
    choiceVoiceLines,
    nodeOrders: index.nodeOrders,
    caseOpeningRoutes: index.caseOpeningRoutes,
    reframeRouteNodes: index.reframeRouteNodes,
    characterProfiles: index.characterProfiles,
    CASE_PACKS: index.packs,
    getCaseRouteLength,
    getNodeRouteIndex,
    getCaseBranchNodes: () => index.caseBranchNodes,
    getBranchDetourBypass,
    getContinuityMemoryChoice: (args) => readContinuityMemoryChoice({ plans: index.memoryPlans, openingRoutes: index.caseOpeningRoutes }, args),
    getCharacterProfile: (name, caseId) => readCharacterProfile(characterTables, name, caseId),
  };
}
