import { useEffect } from "react";
import { DecisionReveal } from "../components/DecisionReveal.jsx";
import { Prose } from "../components/Prose.jsx";
import { ErrorLogPanel } from "../components/ErrorLogPanel.jsx";
import { RecoveryNotice } from "../components/RecoveryNotice.jsx";
import { SaveStatus } from "../components/SaveStatus.jsx";
import { SceneMinutes } from "../components/SceneMinutes.jsx";
import { whenCaseReady } from "../state/caseArrival.js";

function getSceneLineType(line) {
  if (line.startsWith("'")) return "thought-line";
  if (line.startsWith('"')) return "spoken-line";
  return "narration-line";
}

function renderSceneLines(text = "") {
  return text.split("\n").map((line, index) => (
    <p className={getSceneLineType(line)} key={`${index}-${line.slice(0, 12)}`}>
      <Prose text={line} />
    </p>
  ));
}

export function useRuntimeRenderers({
  decisionReveal, decisionRevealRef, trapDecisionRevealFocus, simplifyPlayerText, setDecisionReveal, resourceMeta,
  lastRecoveredError, started, pauseAfterRecovery, startFreshAfterRecovery, showRecoveryCenter, showErrorLog,
  setShowRecoveryCenter, setShowErrorLog, dismissRecoveryNotice, saveStatus, retryStorageCleanup,
  debugToolsEnabled, copyDiagnosticTrace, exportPlaytestLog, refreshLocalErrorLog, clearLocalErrorLog,
  closeRecoveryCenter, telemetryHealth, pendingTelemetry, telemetryRetryInfo, formatSaveTime, localErrorEntries,
  startAtNode, saveSlots, refreshSaveSlots, restoreSaveSlot, deleteSaveSlot, restoreSaveBackup,
}) {
  // The layout sweep's narrow mode (LAYOUT_SCENES=hand5, tests/layout-sweep.spec.js)
  // walks one scene after another on one page. The debug jump on the start
  // screen is only reachable again after a reload, and a reload per scene is
  // what made a sweep in another language take ten minutes a case. Debug
  // builds only; it lives here and not in GameRuntime, which is at its budget.
  useEffect(() => {
    if (!__CP_DEBUG_BUILD__ || !debugToolsEnabled) return undefined;
    window.__cpDebugJump = (caseId, nodeId) => whenCaseReady(caseId, () => startAtNode(caseId, nodeId));
    return () => {
      delete window.__cpDebugJump;
    };
  }, [debugToolsEnabled, startAtNode]);
  const decisionRevealView = { decisionReveal, decisionRevealRef, trapDecisionRevealFocus, renderSceneLines, simplifyPlayerText, setDecisionReveal, resourceMeta };
  const recoveryNoticeView = { lastRecoveredError, started, pauseAfterRecovery, startFreshAfterRecovery, showErrorLog, setShowRecoveryCenter, setShowErrorLog, refreshLocalErrorLog, dismissRecoveryNotice };
  const saveStatusView = { saveStatus, retryStorageCleanup };
  const errorLogPanelView = { showErrorLog, debugToolsEnabled, showRecoveryCenter, copyDiagnosticTrace, exportPlaytestLog, refreshLocalErrorLog, clearLocalErrorLog, closeRecoveryCenter, telemetryHealth, pendingTelemetry, telemetryRetryInfo, formatSaveTime, localErrorEntries, startAtNode, saveSlots, refreshSaveSlots, restoreSaveSlot, deleteSaveSlot, restoreSaveBackup };
  return {
    renderSceneLines,
    renderSceneMinutes: (nodeId) => <SceneMinutes nodeId={nodeId} />,
    renderDecisionReveal: () => <DecisionReveal view={decisionRevealView} />,
    renderRecoveryNotice: () => <RecoveryNotice view={recoveryNoticeView} />,
    renderSaveStatus: () => <SaveStatus view={saveStatusView} />,
    renderErrorLogPanel: () => <ErrorLogPanel view={errorLogPanelView} />,
  };
}
