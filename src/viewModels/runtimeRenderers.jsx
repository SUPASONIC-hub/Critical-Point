import { DecisionReveal } from "../components/DecisionReveal.jsx";
import { ErrorLogPanel } from "../components/ErrorLogPanel.jsx";
import { RecoveryNotice } from "../components/RecoveryNotice.jsx";
import { SaveStatus } from "../components/SaveStatus.jsx";

function getSceneLineType(line) {
  if (line.startsWith("'")) return "thought-line";
  if (line.startsWith('"')) return "spoken-line";
  return "narration-line";
}

function renderSceneLines(text = "") {
  return text.split("\n").map((line, index) => (
    <p className={getSceneLineType(line)} key={`${index}-${line.slice(0, 12)}`}>
      {line}
    </p>
  ));
}

export function createRuntimeRenderers({
  decisionReveal, decisionRevealRef, trapDecisionRevealFocus, simplifyPlayerText, setDecisionReveal, resourceMeta,
  lastRecoveredError, started, pauseAfterRecovery, startFreshAfterRecovery, showRecoveryCenter, showErrorLog,
  setShowRecoveryCenter, setShowErrorLog, dismissRecoveryNotice, saveStatus, retryStorageCleanup,
  debugToolsEnabled, copyDiagnosticTrace, exportPlaytestLog, refreshLocalErrorLog, clearLocalErrorLog,
  closeRecoveryCenter, telemetryHealth, pendingTelemetry, telemetryRetryInfo, formatSaveTime, localErrorEntries,
  startAtNode, saveSlots, refreshSaveSlots, restoreSaveSlot, deleteSaveSlot,
}) {
  const decisionRevealView = { decisionReveal, decisionRevealRef, trapDecisionRevealFocus, renderSceneLines, simplifyPlayerText, setDecisionReveal, resourceMeta };
  const recoveryNoticeView = { lastRecoveredError, started, pauseAfterRecovery, startFreshAfterRecovery, showErrorLog, setShowRecoveryCenter, setShowErrorLog, dismissRecoveryNotice };
  const saveStatusView = { saveStatus, retryStorageCleanup };
  const errorLogPanelView = { showErrorLog, debugToolsEnabled, showRecoveryCenter, copyDiagnosticTrace, exportPlaytestLog, refreshLocalErrorLog, clearLocalErrorLog, closeRecoveryCenter, telemetryHealth, pendingTelemetry, telemetryRetryInfo, formatSaveTime, localErrorEntries, startAtNode, saveSlots, refreshSaveSlots, restoreSaveSlot, deleteSaveSlot };
  return {
    renderSceneLines,
    renderDecisionReveal: () => <DecisionReveal view={decisionRevealView} />,
    renderRecoveryNotice: () => <RecoveryNotice view={recoveryNoticeView} />,
    renderSaveStatus: () => <SaveStatus view={saveStatusView} />,
    renderErrorLogPanel: () => <ErrorLogPanel view={errorLogPanelView} />,
  };
}
