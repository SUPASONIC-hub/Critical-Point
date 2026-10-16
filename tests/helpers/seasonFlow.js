// Helpers that more than one of season-flow, season-recovery and
// season-telemetry spec files use. Moved here from season-flow.spec.js.
import { startDebugNode as startDebugNodeFromHelper } from "./gameFlow.js";

export async function startDebugNode(page, caseId, nodeId) {
  await startDebugNodeFromHelper(page, caseId, nodeId, {
    navigate: false,
    resetStorage: false,
    expectGameShell: false,
  });
}
