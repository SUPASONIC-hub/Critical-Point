import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles/tokens.css";
import "./styles/app.css";
import {
  appendStoredErrorLog,
  ERROR_LOG_STORAGE_KEY,
  FEEDBACK_COMMENT_MAX_LENGTH,
  PLAYER_NAME_MAX_LENGTH,
  appendSaveSlot,
  copyText,
  FREE_TEXT_MAX_LENGTH,
  getInvalidSavedStateKeys,
  isSavedStateShapeValid,
  normalizeFeedback,
  normalizePlayerName,
  normalizeSavedText,
  parseErrorLog,
  parseCurrentSavedState,
  parseRecoverySlots,
  readStoredValue,
  RECOVERY_SLOT_SCHEMA_VERSION,
  RECOVERY_CENTER_STORAGE_KEY,
  removeStoredValue,
  SAVE_SCHEMA_VERSION,
  SAVE_STATE_KEYS,
  SAVE_SLOT_STORAGE_KEY,
  TELEMETRY_QUEUE_TYPES,
  restoreRecoverySnapshot,
  createSafeErrorContext,
  serializeError,
  STORAGE_KEY,
  writeStoredValue,
} from "./appConfig.js";
import {
  boardChangePrompts,
  CASE_RESULT_NODES,
  CASE_SEQUENCE,
  CASE_START_NODES,
  caseObjectives,
  caseOpeningRoutes,
  characterProfiles,
  cognitionLabels,
  initialResources,
  nodeOrders,
  nodes,
  getCaseBranchNodes,
  getCaseRouteLength,
  getNodeRouteIndex,
  seasonCasesBase,
  triggerLabels,
} from "./gameData.js";
import {
  applyEffect,
  applySeededEffectVariation,
  anonymizeSensitiveText,
  buildSceneBeat,
  clamp,
  createDecisionForecast,
  createCaseSummary,
  getDecisionFingerprint,
  getDecisionLedger,
  getAllDiscoveryClueIds,
  getDiscoveryClue,
  getCaseOutcome,
  getOutcomeCarryover,
  getContinuityChallenge,
  detectPrivacySignals,
  explainResourceTradeoff,
  getChoiceSubtext,
  getCounterfactualReport,
  getDramaticChoiceLabel,
  getEcho,
  getFreeTextSignals,
  getGameplayStats,
  getObservationLedger,
  buildNarrativeSpine,
  getRiskPressure,
  getRiskPressureDrivers,
  getSuspenseEvent,
  getSuspenseState,
  limitText,
  makeEmptyScores,
  scoreFreeText,
  speechifyChoice,
} from "./gameLogic.js";
import {
  getSessionId,
  getSessionCode,
  saveCaseTelemetry,
  checkTelemetryHealth,
  saveErrorTelemetry,
  saveFeedbackTelemetry,
  fetchLeaderboard,
  telemetryEnabled,
} from "./telemetry.js";
import { buildLeaderboard, getLeaderboardHeadline } from "./ranking.js";
import { easyCognitionLabels, easyResourceLabels, easyRiskLabels, simplifyPlayerText } from "./playerLanguage.js";
import { DecisionRail } from "./components/DecisionRail.jsx";
import { DecisionDock } from "./components/DecisionDock.jsx";
import { MemoPanel } from "./components/MemoPanel.jsx";
import { StatusBoard } from "./components/StatusBoard.jsx";
import { GameMetricsDrawer } from "./components/GameMetricsDrawer.jsx";
import { GameHeader } from "./components/GameHeader.jsx";
import { AdaptiveMusic } from "./components/AdaptiveMusic.jsx";
import {
  appendTraceEvent,
  encodeReplaySeed,
  getReplaySeedFromLocation,
  getTraceEvents,
  TRACE_STORAGE_KEY,
} from "./state/trace.js";
import {
  createErrorRecoveryEntry,
  createReplaySavedState,
  getRouteMarker,
  getSavedRecoveryState,
  isKnownCaseId,
  isNodeValidForCase,
  normalizeSavedCaseSummaryShape,
  normalizeSavedGameplayState,
  normalizeSavedNestedState,
  recordAppError,
  repairSavedRoute,
  reportSilentFailure,
  shouldCaptureSaveSlot,
} from "./state/savedState.js";
import { DecisionReveal } from "./components/DecisionReveal.jsx";
import { RecoveryNotice } from "./components/RecoveryNotice.jsx";
import { SaveStatus } from "./components/SaveStatus.jsx";
import { ErrorLogPanel } from "./components/ErrorLogPanel.jsx";
import { RankingScreen } from "./screens/RankingScreen.jsx";
import { IntroScreen } from "./screens/IntroScreen.jsx";
import { ResultScreen } from "./screens/ResultScreen.jsx";
import { PlayScreen } from "./screens/PlayScreen.jsx";
import { useGameSaveState } from "./state/useGameSave.js";
import { createChoiceReaders, useDecision } from "./state/useDecision.js";
import { createTelemetryQueue } from "./state/useTelemetryQueue.js";
import { AppContent } from "./AppContent.jsx";
import {
  legacyProfiles,
  nextCaseSignals,
  playGuideItems,
  playStyleOptions,
  resourceMeta,
  sceneVisuals,
  triggerLabSignals,
} from "./appContent.js";

const GAME_TITLE = "임계점";
const GAME_SUBTITLE = "판단이 깊어지는 순간";
const GAME_LABEL = "CRITICAL POINT";
const NEXT_PARTICIPANT_MESSAGE_KEY = "critical-point-next-participant-message";

let consoleErrorHookBusy = false;

function safeStringify(value) {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

// The error boundary and reportSilentFailure already write their own entries,
// so skip their console output instead of logging the same failure twice.
function isAlreadyRecordedConsoleError(text) {
  return text.startsWith("Critical Point render error") || text.includes("[silent:");
}

export
const caseSequence = CASE_SEQUENCE;

const debugToolsEnabled =
  import.meta.env.VITE_ENABLE_DEBUG_TOOLS === "true" ||
  (import.meta.env.DEV && new URLSearchParams(globalThis.location?.search ?? "").get("debug") === "1");
const DEBUG_RENDER_CRASH_KEY = "critical-point-force-render-error";
let saveSuppressed = false;
const replaySeed = getReplaySeedFromLocation();

export function suppressSaves() {
  saveSuppressed = true;
}

export function App() {
  return <AppContent onSuppressSaves={suppressSaves} />;
}

export class AppErrorBoundary extends React.Component {
  state = { hasError: false, recoveryMessage: "" };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Critical Point render error", error);
    try {
      recordAppError(error, errorInfo, "react-render");
    } catch (recoveryError) {
      console.warn("Critical Point recovery logging failed", recoveryError);
    }
  }

  reload({ clearSave = false } = {}) {
    const retryCount = Number(getSavedRecoveryState()?.lastError?.retryCount) || 0;
    if (!clearSave && retryCount >= 2) {
      this.setState({
        recoveryMessage: "같은 저장 지점에서 오류가 반복되어 재시도를 중단했습니다. 저장본을 초기화하고 새 게임으로 시작하거나 복구 슬롯을 선택하세요.",
      });
      return;
    }
    if (clearSave) suppressSaves();
    if (clearSave && !removeStoredValue(STORAGE_KEY)) {
      saveSuppressed = false;
      this.setState({
        recoveryMessage: "현재 저장본을 삭제하지 못했습니다. 브라우저 저장소 권한을 확인한 뒤 다시 시도하세요.",
      });
      return;
    }
    if (clearSave) writeStoredValue(RECOVERY_CENTER_STORAGE_KEY, "1");
    removeStoredValue(DEBUG_RENDER_CRASH_KEY);
    window.location.reload();
  }

  render() {
    const forcedDebugError = debugToolsEnabled && readStoredValue(DEBUG_RENDER_CRASH_KEY) === "1";
    const retryCount = Number(getSavedRecoveryState()?.lastError?.retryCount) || 0;
    if (!this.state.hasError && !forcedDebugError) return this.props.children;

    return (
      <main className="error-screen">
        <section className="error-panel" role="alert">
          <span className="eyebrow">CRITICAL POINT / RECOVERY</span>
          <h1>장면을 불러오지 못했습니다.</h1>
          <p>오류 지점은 자동 저장됐습니다. 수정 후 다시 열면 저장된 장면에서 이어서 진행할 수 있습니다.</p>
          {this.state.recoveryMessage && (
            <p className="error-recovery-message" role="status">
              {this.state.recoveryMessage}
            </p>
          )}
          {retryCount >= 2 && (
            <p className="error-retry-blocked" role="status">
              같은 저장 지점에서 오류가 반복되어 재시도를 중단했습니다. 저장본을 초기화하면 복구 슬롯과 로그를 보존한 채 새 게임으로 시작할 수 있습니다.
            </p>
          )}
          <div className="error-actions">
            <button type="button" className="ghost" data-testid="error-start-fresh" aria-label="현재 저장본만 초기화" onClick={() => this.reload({ clearSave: true })}>
              저장본을 초기화하고 새 게임
            </button>
            <button type="button" data-testid="error-retry" disabled={retryCount >= 2} onClick={() => this.reload()}>
              저장된 지점에서 다시 시도
            </button>
          </div>
          <p className="error-recovery-hint">복구 슬롯과 에러 로그는 보존됩니다. 같은 지점에서 계속 실패하면 저장본을 초기화하고 새 게임으로 진입하세요.</p>
        </section>
      </main>
    );
  }
}
