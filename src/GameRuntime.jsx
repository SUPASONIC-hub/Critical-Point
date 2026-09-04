import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  appendStoredErrorLog,
  createRunId,
  debugToolsEnabled,
  ERROR_LOG_STORAGE_KEY,
  FEEDBACK_COMMENT_MAX_LENGTH,
  formatSaveTime,
  NEW_GAME_PLUS_KEY,
  NEW_GAME_PLUS_MEMORY_KEY,
  OPERATOR_ORIGIN_KEY,
  appendSaveSlot,
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
  RECOVERY_CENTER_STORAGE_KEY,
  removeStoredValue,
  SAVE_SCHEMA_VERSION,
  SAVE_SLOT_STORAGE_KEY,
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
  cognitionLabels,
  initialResources,
  nodeOrders,
  nodes,
  getBranchDetourBypass,
  getCaseBranchNodes,
  getContinuityMemoryChoice,
  getCaseRouteLength,
  getNodeRouteIndex,
  seasonCasesBase,
  triggerLabels,
} from "./gameData.js";
import {
  applyEffect,
  addForecastUncertainty,
  applySeededEffectVariation,
  anonymizeSensitiveText,
  buildSceneBeat,
  clamp,
  createDecisionForecast,
  createCaseSummary,
  getDecisionFingerprint,
  getDecisionLedger,
  getAllDiscoveryClueIds,
  getCaseDiscoveryClue,
  getClueHypotheses,
  getAuthorityGate,
  getEndingVariant,
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
  getObserverChoicePreview,
  getObserverPattern,
  getObserverTag,
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
  telemetryEnabled,
} from "./telemetry.js";
import { getLeaderboardHeadline } from "./ranking.js";
import { easyCognitionLabels, easyRiskLabels, simplifyPlayerText } from "./playerLanguage.js";
import { GAME_TITLE } from "./appCopy.js";
import { AdaptiveMusic } from "./components/AdaptiveMusic.jsx";
import {
  appendTraceEvent,
  getReplaySeedFromLocation,
  getTraceEvents,
} from "./state/trace.js";
import {
  createReplaySavedState,
  getRouteMarker,
  normalizeSavedGameplayState,
  normalizeSavedNestedState,
  recordAppError,
  repairSavedRoute,
  reportSilentFailure,
} from "./state/savedState.js";
import { DecisionReveal } from "./components/DecisionReveal.jsx";
import { RecoveryNotice } from "./components/RecoveryNotice.jsx";
import { SaveStatus } from "./components/SaveStatus.jsx";
import { ErrorLogPanel } from "./components/ErrorLogPanel.jsx";
import { useGameSaveState } from "./state/useGameSave.js";
import { createChoiceReaders, useDecision } from "./state/useDecision.js";
import { createTelemetryQueue } from "./state/useTelemetryQueue.js";
import { useAppPersistence } from "./state/useAppPersistence.js";
import { LOCAL_RANKING_STORAGE_KEY, useLocalRanking } from "./state/useLocalRanking.js";
import { createGameEvent, reduceInvestigationState } from "./state/gameEvents.js";
import { useLeaderboard } from "./state/useLeaderboard.js";
import { buildPlaytestExport, downloadJson } from "./state/playtestExport.js";
import { createClipboardActions, useClipboardStatus } from "./state/useClipboardStatus.js";
import { createFeedbackActions, useFeedbackStatus } from "./state/useFeedback.js";
import { useEndingSequence } from "./state/useEndingSequence.js";
import { useStableEvent } from "./state/useStableEvent.js";
import {
  DECISION_PHASE_SECONDS,
  getDecisionSeconds,
  onDecisionTick,
  spendDecisionSeconds,
  startDecisionWindow,
  stopDecisionWindow,
  useDecisionPhase,
} from "./state/decisionClock.js";
import { getCharacterState, getRivalResponse } from "./characterSystems.js";
import { getAchievementProgress, getChapterTransitionBridge, getEndingEpilogue, getEvidenceRepairPuzzle, getFailureRecovery, getOperatorReveal, getOperationsSnapshot, getRivalIntervention } from "./featurePack.js";
import {
  legacyProfiles,
  nextCaseSignals,
  operatorBriefs,
  chapterRules,
  playGuideItems,
  playStyleOptions,
  resourceMeta,
  sceneVisuals,
  triggerLabSignals,
} from "./appCopy.js";
import { createPlayView, createResultView } from "./viewModels/appViewModels.js";
import { createCompletedCaseResultList, createIntroViewModel } from "./viewModels/introViewModel.js";
import { createActiveBonus, createAuthorityState, createInheritedChallenge, createPressureCascade, createQuestSteps, createSceneChallenge, createSpeakerProfile } from "./viewModels/sceneViewModels.js";
import { createAchievementBadges, createEndingProfile, createScoreBreakdown } from "./viewModels/reportViewModels.js";
import { createLocalLeaderboardRows } from "./viewModels/seasonViewModels.js";
import {
  getChapterUiModel,
  getBalanceSignals,
  getDelayedConsequences,
  getEndingSceneProfile,
  getFailureObjectives,
  getEndingVisualClass,
  getEndingPreview,
  getInterlude,
  getOperatorProfile,
  getOperatorProfiles,
  getChoiceOutcomeFeedback,
  getRelationshipGraph,
  getEvidenceCombinations,
  getHypothesisActions,
  getFailureCause,
  getEndingAtmosphere,
  getPlayReport,
  getTelemetryDashboardSnapshot,
  getOriginStartEffects,
  getAuthorityReview,
  getAutonomousSignals,
  getEvidenceMetadata,
  getHypothesisConflict,
  getInvestigationTargets,
  getTimelineStamp,
  getOriginEndingVariant,
  getCharacterMemory,
  getInvestigationOutcome,
  getEvidenceContamination,
  getHypothesisLockState,
  getResourceChain,
  getMidBoss,
  getDynamicMusicLayers,
  getAftermath,
  getRankingIntegrity,
  getReplayDiagnostics,
  getPlayStyleUnlocks,
  getPastRunMemory,
  getRelationshipScene,
  getRelationshipQuest,
  getRankingComparison,
  getSeasonGoals,
} from "./advancedSystems.js";

const RankingScreen = lazy(() => import("./screens/RankingScreen.jsx").then(({ RankingScreen }) => ({ default: RankingScreen })));
const IntroScreen = lazy(() => import("./screens/IntroScreen.jsx").then(({ IntroScreen }) => ({ default: IntroScreen })));
const ResultScreen = lazy(() => import("./screens/ResultScreen.jsx").then(({ ResultScreen }) => ({ default: ResultScreen })));
const PlayScreen = lazy(() => import("./screens/PlayScreen.jsx").then(({ PlayScreen }) => ({ default: PlayScreen })));

const speakerPortraits = {
  "한서윤": "/portrait-han-seoyun.webp",
  "반재욱": "/portrait-ban-jaeuk.webp",
  "도윤하": "/portrait-do-yunha.webp",
  "오진우": "/portrait-oh-jinwoo.webp",
  "에코": "/portrait-echo.webp",
  "반재현": "/portrait-ban-jaehyun.webp",
  "윤서": "/portrait-yunseo.webp",
};

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

/**
 * What the season has cost so far, for the closing ruling.
 *
 * Every case starts from the same resources, so the last case alone never
 * reaches the thresholds the ending is written against. This adds up the human
 * cost each case ended on and takes the highest pressure any case reached.
 */
function getSeasonStrain(caseResults = {}, pending = null) {
  const summaries = [...Object.values(caseResults ?? {}), pending].filter(Boolean);
  return {
    seasonHumanCost: summaries.reduce((sum, summary) => sum + (Number(summary.finalHumanCost) || 0), 0),
    peakRiskPressure: summaries.reduce((peak, summary) => Math.max(peak, Number(summary.peakRiskPressure) || 0), 0),
  };
}

/** The decision window, and how often overtime is billed once it closes. */
const DECISION_WINDOW_SECONDS = 45;
const OVERTIME_CHARGE_SECONDS = 15;

const DEBUG_RENDER_CRASH_KEY = "critical-point-force-render-error";
let saveSuppressed = false;
const replaySeed = getReplaySeedFromLocation();

export function suppressSaves() {
  saveSuppressed = true;
}

export function resumeSaves() {
  saveSuppressed = false;
}

export function GameRuntime({ onSuppressSaves = suppressSaves, saveControls, initialStartState = null } = {}) {
  const persistSuppressed = useCallback(() => {
    return saveControls?.isSuppressed?.() ?? saveSuppressed;
  }, [saveControls]);

  const resumeRuntimeSaves = useCallback(() => {
    if (saveControls?.resume) {
      saveControls.resume();
      return;
    }
    saveSuppressed = false;
  }, [saveControls]);

  const saved = useMemo(() => {
    const replay = createReplaySavedState(replaySeed);
    const rawSaved = readStoredValue(STORAGE_KEY, "null");
    const hasStoredSave =
      Boolean(replay) ||
      Boolean(initialStartState) ||
      (typeof rawSaved === "string" && rawSaved !== "null" && rawSaved !== "");
    const parsed = replay ?? parseCurrentSavedState(rawSaved, SAVE_SCHEMA_VERSION) ?? initialStartState;
    const repaired = normalizeSavedNestedState(normalizeSavedGameplayState(repairSavedRoute(parsed)));
    if (!isSavedStateShapeValid(repaired)) {
      // A first-time visitor simply has no save yet; only a save that exists and
      // fails validation is a real failure worth spending an error-log slot on.
      if (hasStoredSave) {
        reportSilentFailure("save-shape", {
          currentCase: repaired?.currentCase,
          nodeId: repaired?.nodeId,
          invalidKeys: getInvalidSavedStateKeys(repaired),
        });
      }
      return null;
    }
    const resumed = repaired.started && repaired.paused ? { ...repaired, paused: false } : repaired;
    if (resumed !== parsed) {
      writeStoredValue(STORAGE_KEY, JSON.stringify(resumed));
      appendSaveSlot(resumed);
    }
    return resumed;
  }, [initialStartState]);
  const sessionId = useMemo(() => getSessionId(), []);
  const sessionCode = useMemo(() => getSessionCode(sessionId), [sessionId]);
  const initialRunId = useMemo(() => saved?.runId || createRunId(), [saved?.runId]);

  const {
    pendingChoice, setPendingChoice, decisionReveal, setDecisionReveal,
  } = useDecision();
  // Coarse only: the exact count lives in the decision clock so a per-second
  // tick never reaches this render.
  const decisionPhase = useDecisionPhase();

  const {
    runId, setRunId, playerName, setPlayerName, playStyle, setPlayStyle, openingLegacy, setOpeningLegacy,
    dataConsent, setDataConsent, started, setStarted, currentCase, setCurrentCase,
    completedCases, setCompletedCases, discoveredClues, setDiscoveredClues,
    caseResults, setCaseResults, playtestFeedback, setPlaytestFeedback, nodeId, setNodeId,
    resources, setResources, log, setLog, triggers, setTriggers, cognition, setCognition,
    freeText, setFreeText, lastSavedAt, setLastSavedAt, isPausedSave, setIsPausedSave,
    pendingTelemetry, setPendingTelemetry, protocolUsed, setProtocolUsed,
    timerPenaltyCount, setTimerPenaltyCount, probeUsed, setProbeUsed,
    investigatedTargets, setInvestigatedTargets, hypothesisDecisions, setHypothesisDecisions,
  } = useGameSaveState({
    saved,
    initialRunId,
    initialResources,
    triggerDefaults: makeEmptyScores(triggerLabels),
    cognitionDefaults: makeEmptyScores(cognitionLabels),
    normalizeText: (value) => normalizeSavedText(value, FREE_TEXT_MAX_LENGTH),
  });
  const [newGamePlusUnlocked, setNewGamePlusUnlocked] = useState(
    () => readStoredValue(NEW_GAME_PLUS_KEY, "false") === "true" || Boolean(saved?.caseResults?.final),
  );
  const [newGamePlusMemory, setNewGamePlusMemory] = useState(() => {
    try { return JSON.parse(readStoredValue(NEW_GAME_PLUS_MEMORY_KEY, "{}")) ?? {}; } catch { return {}; }
  });
  const [operatorOrigin, setOperatorOriginState] = useState(() => readStoredValue(OPERATOR_ORIGIN_KEY, "courier"));
  const [selectedInvestigation, setSelectedInvestigation] = useState("");
  const [hypothesisAction, setHypothesisAction] = useState("");
  const [echo, setEcho] = useState(
    () => normalizeSavedText(saved?.echo) || "얼마나 똑똑한지는 묻지 않겠습니다. 대신 언제 생각을 멈추지 못하는지 보겠습니다.",
  );
  const [nodeEnteredAt, setNodeEnteredAt] = useState(saved?.nodeEnteredAt ?? Date.now());
  const [isAdvancing, setIsAdvancing] = useState(false);
  const { copyStatus, flashCopyStatus } = useClipboardStatus();
  const { feedbackStatus, setFeedbackStatus, isSubmittingFeedback, setIsSubmittingFeedback } = useFeedbackStatus();
  const [saveStatus, setSaveStatus] = useState("");
  const pendingTelemetryRef = useRef(saved?.pendingTelemetry ?? []);
  const [isRetryingTelemetry, setIsRetryingTelemetry] = useState(false);
  const [showTacticalDetails, setShowTacticalDetails] = useState(false);
  const [memoState, setMemoState] = useState({ nodeId: "", opened: false });
  const [showRanking, setShowRanking] = useState(false);
  const { localRankingRows, appendLocalRankingRow, clearLocalRankingRows } = useLocalRanking();
  const [isOnline, setIsOnline] = useState(() => globalThis.navigator?.onLine !== false);
  const [telemetryStatus, setTelemetryStatus] = useState({
    tone: telemetryEnabled && isOnline ? "ready" : "local",
    text:
      !isOnline
        ? "오프라인. 이 플레이는 브라우저와 JSON 로그로만 저장됩니다."
        : telemetryEnabled
          ? "원격 저장 준비됨. 데이터 제공 동의 시 케이스 완료 로그가 저장됩니다."
          : "로컬 저장. 이 플레이는 브라우저와 JSON 로그로만 저장됩니다.",
  });
  const [lastRecoveredError, setLastRecoveredError] = useState(saved?.lastError ?? null);
  const [showRecoveryCenter, setShowRecoveryCenter] = useState(() => readStoredValue(RECOVERY_CENTER_STORAGE_KEY, "") === "1");
  const [showErrorLog, setShowErrorLog] = useState(() => readStoredValue(RECOVERY_CENTER_STORAGE_KEY, "") === "1");
  const [localErrorEntries, setLocalErrorEntries] = useState(() => {
    const rawErrorLog = readStoredValue(ERROR_LOG_STORAGE_KEY, "null");
    const localErrorLog = parseErrorLog(rawErrorLog);
    if (localErrorLog && rawErrorLog !== JSON.stringify(localErrorLog)) {
      writeStoredValue(ERROR_LOG_STORAGE_KEY, JSON.stringify(localErrorLog));
    }
    return Array.isArray(localErrorLog?.entries) ? localErrorLog.entries : [];
  });
  const [saveSlots, setSaveSlots] = useState(() => {
    const localSaveSlots = parseRecoverySlots(readStoredValue(SAVE_SLOT_STORAGE_KEY, "null"));
    return Array.isArray(localSaveSlots?.slots) ? localSaveSlots.slots : [];
  });
  const [telemetryHealth, setTelemetryHealth] = useState({ status: "idle", tables: [] });
  const [telemetryRetryInfo, setTelemetryRetryInfo] = useState({ attempt: 0, nextRetryAt: "" });
  const [debugCaseId, setDebugCaseId] = useState("case05");
  const [debugNodeId, setDebugNodeId] = useState("c5_start");
  const debugCaseIdRef = useRef("case05");
  const debugNodeIdRef = useRef("c5_start");
  const debugCaseSelectRef = useRef(null);
  const debugNodeSelectRef = useRef(null);
  const telemetryRetryAttemptRef = useRef(0);
  const telemetryRetryTimerRef = useRef(null);
  const hadDecisionRevealRef = useRef(false);
  const decisionRevealRef = useRef(null);
  const choiceButtonsRef = useRef(new Map());
  const choiceHoldTimerRef = useRef(null);
  const choiceHoldTriggeredRef = useRef(false);
  const commitConsoleRef = useRef(null);
  const commitConfirmRef = useRef(null);
  const visibilityPauseRef = useRef(null);
  const freeTextSaveTimerRef = useRef(null);

  const {
    persist: persistenceApi,
    startGame: persistenceStartGame,
    resumeSavedGame: persistenceResumeSavedGame,
    pauseAfterRecovery: persistencePauseAfterRecovery,
    startFreshAfterRecovery: persistenceStartFreshAfterRecovery,
    saveCurrentGame: persistenceSaveCurrentGame,
    refreshLocalErrorLog: persistenceRefreshLocalErrorLog,
    refreshSaveSlots: persistenceRefreshSaveSlots,
    dismissRecoveryNotice: persistenceDismissRecoveryNotice,
    closeRecoveryCenter: persistenceCloseRecoveryCenter,
    clearLocalErrorLog: persistenceClearLocalErrorLog,
    deleteSaveSlot: persistenceDeleteSaveSlot,
    restoreSaveSlot: persistenceRestoreSaveSlot,
  } = useAppPersistence({
    state: {
      runId, playerName, playStyle, openingLegacy, dataConsent, started, currentCase, completedCases,
      discoveredClues, caseResults, playtestFeedback, nodeId, resources, log, triggers, cognition,
      freeText, echo, nodeEnteredAt, protocolUsed, timerPenaltyCount, probeUsed,
      investigatedTargets, hypothesisDecisions, isPausedSave, saveSlots,
    },
    refs: { pendingTelemetryRef },
    setters: {
      setRunId, setPlayerName, setStarted, setIsPausedSave, setCurrentCase, setCompletedCases,
      setDiscoveredClues, setCaseResults, setPlaytestFeedback, setResources, setLog, setTriggers,
      setCognition, setProtocolUsed, setTimerPenaltyCount, setProbeUsed, setInvestigatedTargets,
      setHypothesisDecisions, setOpeningLegacy, setDecisionReveal, setPendingChoice,
      setLastRecoveredError, setShowRecoveryCenter, setShowErrorLog, setFreeText, setNodeId,
      setNodeEnteredAt, setLastSavedAt, setSaveStatus, setLocalErrorEntries, setSaveSlots,
    },
    config: {
      normalizePlayerName, initialResources, triggerLabels, cognitionLabels, makeEmptyScores,
      persistSuppressed, onSuppressSaves, formatSaveTime,
      debugErrorKey: DEBUG_RENDER_CRASH_KEY, createRunId,
    },
  });
  const persist = persistenceApi;

  const fallbackCaseId = seasonCasesBase.some((caseItem) => caseItem.id === currentCase)
    ? currentCase
    : "case01";
  const activePlayStyle = playStyleOptions.find((style) => style.id === playStyle) ?? playStyleOptions[0];
  const operatorProfile = getOperatorProfile(operatorOrigin);
  function setOperatorOrigin(value) {
    const nextOrigin = getOperatorProfiles().some((profile) => profile.id === value) ? value : "courier";
    setOperatorOriginState(nextOrigin);
    writeStoredValue(OPERATOR_ORIGIN_KEY, nextOrigin);
  }
  const activeNodeOrder = nodeOrders[fallbackCaseId] ?? nodeOrders.case01;
  const debugNodeOptions = nodeOrders[debugCaseId] ?? nodeOrders.case05;
  const fallbackNodeId = activeNodeOrder[0] ?? "start";
  const resolvedNodeId = nodes[nodeId] ? nodeId : fallbackNodeId;
  const branchOpeningNodeIds = new Set([
    CASE_START_NODES[fallbackCaseId],
    ...Object.values(caseOpeningRoutes[fallbackCaseId] ?? {}),
  ]);
  const isOpeningNode = branchOpeningNodeIds.has(resolvedNodeId);
  const node = nodes[resolvedNodeId] ?? nodes.start;
  const isResult = Object.values(CASE_RESULT_NODES).includes(nodeId);
  const {
    endingStep,
    endingTwistIndex,
    endingQuietReady,
    nextParticipantMessage,
    setNextParticipantMessage,
    skipEndingQuietHold,
    advanceEndingStep,
    saveNextParticipantMessage,
    resetEndingSequence,
  } = useEndingSequence({ isResult, currentCase });
  const activeCaseMeta = seasonCasesBase.find((caseItem) => caseItem.id === currentCase);
  const speakerProfile = createSpeakerProfile({ node });
  const speakerPortrait = speakerPortraits[node?.speaker] ?? "/speaker-profile.webp";
  const latestBeat = log.at(-1)?.sceneBeat ?? "";
  const freeTextSignals = getFreeTextSignals(freeText);
  const activeFreeTextSignalCount = freeTextSignals.filter((signal) => signal.active).length;
  const freeTextPreview = freeText.trim() ? scoreFreeText(freeText) : null;
  const memoOpened = memoState.nodeId === resolvedNodeId && memoState.opened;
  const setMemoOpened = useStableEvent((opened) => {
    setMemoState({ nodeId: resolvedNodeId, opened });
  });
  const evidenceCount = discoveredClues.length + (memoOpened ? 1 : 0) + (probeUsed ? 1 : 0) + activeFreeTextSignalCount;
  const localSeasonLeaderboardRow = useMemo(() => caseResults.final && completedCases.includes("final")
    ? {
        local: true,
        run_id: caseResults.final.runId ?? runId,
        session_code: sessionCode,
        player_name: playerName || "현재 분석관",
        case_id: "season-final",
        case_title: "SEASON 01 COMPLETE",
        completed_at: caseResults.final.completedAt ?? "",
        summary: { ...caseResults.final, runId: caseResults.final.runId ?? runId, seasonComplete: true },
      }
    : null, [caseResults, completedCases, playerName, runId, sessionCode]);
  const privacySignals = detectPrivacySignals(freeText);
  const activePrivacySignals = privacySignals.filter((signal) => signal.active);
  const freeTextBlockedByPrivacy = activePrivacySignals.length > 0;
  const freeTextSuccessEntries = log.filter((entry) => entry.freeTextSuccess);
  const currentCaseFreeTextSuccessCount = freeTextSuccessEntries.filter(
    (entry) => entry.caseId === fallbackCaseId,
  ).length;
  const aftermathNodeId = fallbackCaseId === "final" ? "f_aftershock" : `${fallbackCaseId.replace("case", "c")}_aftershock`;
  const adaptiveChoiceUnlocked = resolvedNodeId === aftermathNodeId && currentCaseFreeTextSuccessCount >= 2;
  const adaptiveChoice = useMemo(
    () =>
      adaptiveChoiceUnlocked
        ? {
            id: `${fallbackCaseId}_adaptive_reframe`,
            label: "앞서 남긴 문장을 공개 기준으로 삼는다",
            effect: { legitimacy: 7, trust: 5, fatigue: 4 },
            next: node?.choices?.[0]?.next ?? "result",
            cognition: { reframing: 2, persistence: 1 },
            adaptive: true,
            requiredAuthority: "FIELD ACCESS",
          }
        : null,
    [adaptiveChoiceUnlocked, fallbackCaseId, node?.choices],
  );
  const speakerRelationship = log.reduce(
    (score, entry) => score + (entry.speaker === node?.speaker ? 8 : entry.speaker ? -1 : 0),
    0,
  );
  const relationshipChoice = useMemo(
    () =>
      !isResult && log.length >= 2 && speakerRelationship >= 16 && node?.choices?.[0]
        ? {
            id: `${fallbackCaseId}_relationship_bridge`,
            label: "관계의 증언을 먼저 확보한다",
            effect: { trust: 5, legitimacy: 2, fatigue: 2 },
            next: node.choices[0].next,
            cognition: { inference: 1, reframing: 1 },
            branchId: "relationship-bridge",
            requiredAuthority: "FIELD ACCESS",
          }
        : null,
    [fallbackCaseId, isResult, log.length, node?.choices, speakerRelationship],
  );
  const continuityMemoryChoice = useMemo(
    () => getContinuityMemoryChoice({ caseId: fallbackCaseId, nodeId: resolvedNodeId, log }),
    [fallbackCaseId, log, resolvedNodeId],
  );
  const fixedChoices = useMemo(
    () => [
      ...(node?.choices?.filter((choice) => choice.type !== "free") ?? []),
      ...(continuityMemoryChoice ? [continuityMemoryChoice] : []),
      ...(adaptiveChoice ? [adaptiveChoice] : []),
      ...(relationshipChoice ? [relationshipChoice] : []),
    ],
    [adaptiveChoice, continuityMemoryChoice, node?.choices, relationshipChoice],
  );
  const freeChoice = node?.choices?.find((choice) => choice.type === "free");
  const latestFreeTextSuccess = [...log].reverse().find(
    (entry) => entry.caseId === fallbackCaseId && entry.freeTextSuccess && entry.freeText,
  );
  const currentAverageResponseTime =
    log.length > 0
      ? Math.round(log.reduce((sum, entry) => sum + (entry.responseTimeSec ?? 0), 0) / log.length)
      : 0;
  const riskPressure = getRiskPressure(resources);
  const riskTier =
    riskPressure >= 60 ? "CRITICAL" : riskPressure >= 35 ? "UNSTABLE" : "CONTROLLED";
  const suspenseState = getSuspenseState({
    riskPressure,
    decisionSeconds: decisionPhase * DECISION_PHASE_SECONDS,
    log,
    currentCase,
  });
  const narrativeSpine = buildNarrativeSpine({
    caseObjective: caseObjectives[currentCase],
    node,
    log,
    triggerLabels,
    riskTier,
    suspenseState,
  });
  const primarySceneTrigger = node?.triggers?.[0] ?? "responsibility";
  const primarySceneTriggerLabel = triggerLabels[primarySceneTrigger] ?? "책임";
  const sceneDirection =
    riskTier === "CRITICAL"
      ? `${primarySceneTriggerLabel} 압박이 회의실의 말끝을 짧게 자른다. 누구도 먼저 편한 결론을 꺼내지 못한다.`
      : riskTier === "UNSTABLE"
        ? `${primarySceneTriggerLabel} 압박이 테이블 위에 얇게 깔린다. 대답은 가능하지만, 아직 비용의 이름이 다 불리지 않았다.`
        : `${primarySceneTriggerLabel} 압박은 낮게 유지된다. 그래서 지금은 결론보다 전제를 바꾸기 좋은 순간이다.`;
  const pressureCascade = useMemo(() => createPressureCascade({ log, resources, riskPressure }), [log, resources, riskPressure]);
  const gameplayStats = getGameplayStats(log, riskPressure);
  const observationLedger = getObservationLedger(log);
  const observerPattern = getObserverPattern(log);
  const relationshipScores = ["한서윤", "반재욱", "도윤하", "오진우", "에코"].map((name) => {
    const appearances = log.filter((entry) => entry.speaker === name).length;
    const recent = [...log].reverse().findIndex((entry) => entry.speaker === name);
    return {
      name,
      value: Math.min(100, appearances * 18 + (recent >= 0 ? Math.max(0, 24 - recent * 3) : 0)),
      active: node?.speaker === name,
    };
  });
  const chapterUiModel = getChapterUiModel(currentCase);
  const activeRelationshipScore = relationshipScores.find((item) => item.active)?.value ?? 0;
  const relationshipQuest = getRelationshipQuest(node?.speaker, activeRelationshipScore);
  const relationshipScene = getRelationshipScene(relationshipQuest, currentCase);
  const pastRunMemory = getPastRunMemory(newGamePlusMemory);
  const delayedConsequences = useMemo(() => getDelayedConsequences(log, caseResults), [caseResults, log]);
  const playStyleUnlocks = getPlayStyleUnlocks(playStyle, newGamePlusUnlocked);
  const seasonGoals = getSeasonGoals();
  const interlude = getInterlude(currentCase, log.at(-1)?.choice);
  const balanceSignals = useMemo(() => getBalanceSignals(log), [log]);
  const authorityState = useMemo(() => createAuthorityState({ evidence: discoveredClues.length, legitimacy: resources.legitimacy ?? 0, operatorOrigin, trust: resources.trust ?? 0 }), [discoveredClues.length, operatorOrigin, resources.legitimacy, resources.trust]);
  const clueCount = discoveredClues.length;
  const clueHypotheses = useMemo(() => getClueHypotheses(discoveredClues), [discoveredClues]);
  const relationshipGraph = getRelationshipGraph(relationshipScores);
  const evidenceCombinations = getEvidenceCombinations(discoveredClues);
  const hypothesisActions = getHypothesisActions(clueHypotheses, authorityState);
  const evidenceMetadata = getEvidenceMetadata(discoveredClues);
  const hypothesisConflict = getHypothesisConflict(clueHypotheses);
  const investigationTargets = getInvestigationTargets(fallbackCaseId, authorityState);
  const autonomousSignal = getAutonomousSignals(fallbackCaseId, log);
  const timelineStamp = getTimelineStamp(fallbackCaseId, log.length);
  const evidenceContamination = getEvidenceContamination(discoveredClues, log);
  const hypothesisLockState = getHypothesisLockState(clueHypotheses, hypothesisAction);
  const resourceChain = getResourceChain(resources);
  const midBoss = getMidBoss(fallbackCaseId, log);
  const dynamicMusicLayers = getDynamicMusicLayers(riskTier, fallbackCaseId);
  const characterState = getCharacterState(speakerProfile?.name ?? speakerProfile?.id ?? "", log);
  const rivalResponse = getRivalResponse(fallbackCaseId, log, resources);
  const [evidenceRepaired, setEvidenceRepaired] = useState(false);
  const evidenceRepairPuzzle = getEvidenceRepairPuzzle(discoveredClues, evidenceRepaired);
  const rivalIntervention = getRivalIntervention({ caseId: fallbackCaseId, log, resources });
  const operatorReveal = getOperatorReveal({ origin: operatorOrigin, completedCases, caseResults });
  const chapterTransitionBridge = getChapterTransitionBridge(caseSequence[caseSequence.indexOf(fallbackCaseId) - 1], fallbackCaseId, caseResults[caseSequence[caseSequence.indexOf(fallbackCaseId) - 1]]);
  const achievementProgress = getAchievementProgress({ log, completedCases, caseResults });
  const operationsSnapshot = getOperationsSnapshot({ errors: localErrorEntries, pending: pendingTelemetry, rankings: localRankingRows, caseResults });
  const selectedInvestigationOutcome = getInvestigationOutcome(investigationTargets.find((target) => target.id === selectedInvestigation), log.length);
  // What this run left shut: clues never surfaced, and the far side of every fork.
  const unopenedClueCount = Math.max(0, getAllDiscoveryClueIds().length - clueCount);
  const visitedNodeIds = new Set(log.map((entry) => entry.nodeId));
  const unopenedBranchCount = getCaseBranchNodes().reduce(
    (total, branch) => total + branch.nextIds.filter((nodeId) => !visitedNodeIds.has(nodeId)).length,
    0,
  );
  const unopenedRecordCount = unopenedClueCount + unopenedBranchCount;
  // The quiet beat shows the player their own words: a free-text line that
  // cleared the privacy check, otherwise the last thing they chose to say.
  const endingQuietLine =
    [...log].reverse().find((entry) => entry.freeTextSuccess && entry.freeText)?.freeText ??
    [...log].reverse().find((entry) => entry.spokenChoice)?.spokenChoice ??
    "";
  const decisionLedger = getDecisionLedger(log, resources);
  const decisionFingerprint = getDecisionFingerprint({
    triggerScores: triggers,
    cognitionScores: cognition,
    entries: log,
    resources,
  });
  const counterfactualReport = useMemo(
    () => getCounterfactualReport(log, nodes),
    [log],
  );
  const {
    freeCount: freeTextCombo,
    reducedRiskCount,
    challengeClearCount,
    currentChallengeStreak,
    rhythmScore,
    cognitionScore,
    pressureAdaptScore,
    reflectionScore,
    consistencyScore,
    exploitPenalty,
    momentumScore,
    momentumTier,
    rank: gameplayRank,
  } = gameplayStats;
  const activeBonus = createActiveBonus({ currentAverageResponseTime, currentChallengeStreak, freeTextCombo, log });
  // Memoised as a chain: the readers and the forecasts below are only worth
  // memoising if the objects they key off keep their identity between renders.
  const inheritedChallenge = useMemo(
    () => createInheritedChallenge({ isOpeningNode, openingLegacy }),
    [isOpeningNode, openingLegacy],
  );
  const sceneChallenge = useMemo(
    () => createSceneChallenge({ freeChoice, freeTextCombo, inheritedChallenge, node, riskPressure }),
    [freeChoice, freeTextCombo, inheritedChallenge, node, riskPressure],
  );
  const echoProbeHint = {
    "protect-trust": "힌트: 이번 장면에서는 가장 큰 성과보다 관계를 회복하는 말이 지난 사건의 신뢰를 이어갑니다.",
    "repair-legitimacy": "힌트: 정당성을 올리는 선택을 먼저 골라야 지난 사건의 균열이 다음 장면을 삼키지 않습니다.",
    "lower-risk": "힌트: 지금은 가장 큰 이득보다 위험 압력을 실제로 낮추는 선택이 오래 버팁니다.",
    "use-reframe": "힌트: 사람, 조건, 순서 중 두 가지 이상을 다시 설계하면 선택지 밖 계획으로 인정됩니다.",
    "avoid-risk": "힌트: 경쟁자의 속도를 따라가는 대신 위험을 유지하거나 낮추는 선택이 다음 장면을 엽니다.",
    "find-cost": "힌트: 가장 좋아 보이는 선택이 누구에게 비용을 넘기는지 먼저 찾으십시오.",
  }[sceneChallenge.id];
  const echoProbeCost = playStyle === "mediator" ? "결정 시간 4초와 신뢰 1" : "결정 시간 8초와 피로 1";
  const {
    getChallengeMatch,
    mergeEffects,
    getClueReveal,
    getEffectiveChoiceRead,
  } = useMemo(
    () =>
      createChoiceReaders({
        sceneChallenge,
        resources,
        log,
        riskPressure,
        discoveredClues,
        currentCase,
        freeText,
        currentChallengeStreak,
        resourceMeta,
      }),
    [currentCase, currentChallengeStreak, discoveredClues, freeText, log, resources, riskPressure, sceneChallenge],
  );

  const riskPressureDrivers = useMemo(() => getRiskPressureDrivers(resources), [resources]);
  const decisionForecasts = useMemo(
    () =>
      fixedChoices.map((choice) => {
        const read = getEffectiveChoiceRead(choice, choice.effect, choice.cognition);
        const forecast = addForecastUncertainty(
          createDecisionForecast({ ...choice, effect: read.finalEffect }, resources),
          evidenceCount,
        );
        return {
          choice,
          read,
          forecast,
          tacticalRead: read.tacticalRead,
          observerPreview: getObserverChoicePreview({
            choice,
            read,
            resources,
            observerPattern,
            responseTimeSec: Math.max(1, DECISION_WINDOW_SECONDS - getDecisionSeconds()),
          }),
        };
      }),
    [evidenceCount, fixedChoices, getEffectiveChoiceRead, observerPattern, resources],
  );
  const pressureLeader = riskPressureDrivers[0];
  const formatRiskDelta = (value) =>
    value > 0 ? `+${value}` : value < 0 ? `${value}` : "유지";
  const pendingChoiceRead = pendingChoice
    ? getEffectiveChoiceRead(pendingChoice, pendingChoice.effect, pendingChoice.cognition)
    : null;
  const pendingChoiceForecast = pendingChoiceRead
    ? addForecastUncertainty(
        createDecisionForecast({ ...pendingChoice, effect: pendingChoiceRead.finalEffect }, resources),
        evidenceCount,
      )
    : null;

  const formatForecastRisk = (forecast) => {
    if (!forecast) return "NO FORECAST";
    if (forecast.forecastPrecision === "precise") return formatRiskDelta(forecast.riskDelta);
    return `${formatRiskDelta(forecast.riskDeltaMin)} ~ ${formatRiskDelta(forecast.riskDeltaMax)}`;
  };

  const questSteps = createQuestSteps({ challengeClearCount, currentChallengeStreak, freeTextCombo, log, reducedRiskCount });
  const turnBriefItems = [
    { label: "챌린지", value: sceneChallenge.title },
    { label: "압력", value: `${riskTier} ${riskPressure}` },
    { label: "버스트", value: `${momentumTier} ${momentumScore}` },
    { label: "보너스", value: activeBonus },
  ];
  const currentFeedback = normalizeFeedback(playtestFeedback[currentCase]);
  const firstRenderRef = useRef(true);
  const sceneTitleRef = useRef(null);
  const hasResumableSave =
    !started &&
    currentCase &&
    nodeId &&
    (isPausedSave || Boolean(saveStatus) || Boolean(lastSavedAt && (log.length > 0 || completedCases.length > 0)));
  const localLeaderboardRows = useMemo(
    () => createLocalLeaderboardRows({ caseResults, localRankingRows, playerName, runId, seasonCasesBase, sessionCode }),
    [caseResults, localRankingRows, playerName, runId, sessionCode],
  );
  const nextCaseSignal = nextCaseSignals[currentCase];
  const resumeSavedGame = persistenceResumeSavedGame;
  const pauseAfterRecovery = persistencePauseAfterRecovery;
  const startFreshAfterRecovery = persistenceStartFreshAfterRecovery;
  const saveCurrentGame = persistenceSaveCurrentGame;
  const refreshLocalErrorLog = persistenceRefreshLocalErrorLog;
  const refreshSaveSlots = persistenceRefreshSaveSlots;
  const dismissRecoveryNotice = persistenceDismissRecoveryNotice;
  const closeRecoveryCenter = persistenceCloseRecoveryCenter;
  const clearLocalErrorLog = persistenceClearLocalErrorLog;
  const deleteSaveSlot = persistenceDeleteSaveSlot;
  const restoreSaveSlot = persistenceRestoreSaveSlot;
  const { queueTelemetry, retryPendingTelemetry, scheduleTelemetryRetry } = createTelemetryQueue({
    pendingTelemetryRef,
    setPendingTelemetry,
    setTelemetryStatus,
    setIsRetryingTelemetry,
    setTelemetryRetryInfo,
    telemetryRetryTimerRef,
    isOnline,
    dataConsent,
    telemetryEnabled,
    isRetryingTelemetry,
    telemetryRetryAttemptRef,
    setSaveStatus,
    setLastSavedAt,
  });
  const scheduleTelemetryRetryEvent = useStableEvent(scheduleTelemetryRetry);
  const refreshLocalErrorLogEvent = useStableEvent(refreshLocalErrorLog);
  const closeRecoveryCenterEvent = useStableEvent(closeRecoveryCenter);
  const saveCurrentGameEvent = useStableEvent(saveCurrentGame);
  const setPendingChoiceEvent = useStableEvent(setPendingChoice);
  const startCaseEvent = useStableEvent(startCase);
  const chooseEvent = useStableEvent(choose);
  const previewChoiceEvent = useStableEvent(previewChoice);
  useEffect(() => {
    const updateNetworkStatus = () => {
      const online = globalThis.navigator?.onLine !== false;
      setIsOnline(online);
      if (!online) {
        setTelemetryStatus({
          tone: "local",
          text: "오프라인. 이 플레이는 브라우저와 JSON 로그로만 저장됩니다.",
        });
        return;
      }
      setTelemetryStatus({
        tone: telemetryEnabled ? "ready" : "local",
        text: telemetryEnabled
          ? "네트워크 연결됨. 데이터 제공 동의 시 케이스 완료 로그가 저장됩니다."
          : "로컬 저장. 이 플레이는 브라우저와 JSON 로그로만 저장됩니다.",
      });
    };
    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);
    return () => {
      window.removeEventListener("online", updateNetworkStatus);
      window.removeEventListener("offline", updateNetworkStatus);
    };
  }, []);
  useEffect(() => {
    if (!telemetryEnabled || !dataConsent || !isOnline || pendingTelemetry.length === 0) return undefined;
    scheduleTelemetryRetryEvent({ immediate: telemetryRetryAttemptRef.current === 0 });
    return () => {
      if (telemetryRetryTimerRef.current) {
        window.clearTimeout(telemetryRetryTimerRef.current);
        telemetryRetryTimerRef.current = null;
      }
    };
  }, [dataConsent, isOnline, pendingTelemetry.length, scheduleTelemetryRetryEvent]);
  useEffect(() => {
    if (!debugToolsEnabled) return undefined;
    let cancelled = false;
    if (!telemetryEnabled || !isOnline) {
      queueMicrotask(() => {
        if (!cancelled) setTelemetryHealth({ status: telemetryEnabled ? "offline" : "disabled", tables: [] });
      });
      return () => {
        cancelled = true;
      };
    }
    queueMicrotask(() => {
      if (!cancelled) setTelemetryHealth({ status: "checking", tables: [] });
    });
    checkTelemetryHealth()
      .then((health) => {
        if (cancelled) return;
        setTelemetryHealth({
          status: health.ok ? "ok" : "error",
          tables: health.tables ?? [],
        });
      })
      .catch((error) => {
        if (cancelled) return;
        setTelemetryHealth({
          status: "error",
          tables: [{ table: "healthcheck", ok: false, status: 0, message: error instanceof Error ? error.message : "failed" }],
        });
      });
    return () => {
      cancelled = true;
    };
  }, [isOnline]);
  useEffect(() => {
    const handleWindowError = (event) => {
      const entry = recordAppError(event.error ?? event.message, {}, "window-error");
      setLastRecoveredError({
        id: entry.id,
        occurredAt: entry.occurredAt,
        source: entry.context.source,
        message: entry.error.message,
        currentCase: entry.context.currentCase,
        nodeId: entry.context.nodeId,
      });
      refreshLocalErrorLogEvent();
    };
    const handleUnhandledRejection = (event) => {
      const entry = recordAppError(event.reason, {}, "unhandled-rejection");
      setLastRecoveredError({
        id: entry.id,
        occurredAt: entry.occurredAt,
        source: entry.context.source,
        message: entry.error.message,
        currentCase: entry.context.currentCase,
        nodeId: entry.context.nodeId,
      });
      refreshLocalErrorLogEvent();
    };
    const originalConsoleError = console.error;
    console.error = (...args) => {
      originalConsoleError.apply(console, args);
      if (consoleErrorHookBusy) return;
      const text = args
        .map((arg) => (arg instanceof Error ? arg.message : typeof arg === "string" ? arg : safeStringify(arg)))
        .join(" ")
        .trim();
      if (!text || isAlreadyRecordedConsoleError(text)) return;
      consoleErrorHookBusy = true;
      try {
        const consoleError = args.find((arg) => arg instanceof Error) ?? new Error(limitText(text, 400));
        consoleError.name = "ConsoleError";
        recordAppError(consoleError, {}, "console-error");
        refreshLocalErrorLogEvent();
      } catch {
        // Never let diagnostics break the console itself.
      } finally {
        consoleErrorHookBusy = false;
      }
    };
    window.addEventListener("error", handleWindowError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    return () => {
      console.error = originalConsoleError;
      window.removeEventListener("error", handleWindowError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, [refreshLocalErrorLogEvent]);
  useEffect(() => {
    const closeOverlay = (event) => {
      if (event.key !== "Escape") return;
      if (decisionReveal) {
        setDecisionReveal(null);
      } else if (showRanking) {
        setShowRanking(false);
      } else if (showErrorLog) {
        closeRecoveryCenterEvent();
      }
    };
    window.addEventListener("keydown", closeOverlay);
    return () => window.removeEventListener("keydown", closeOverlay);
  }, [closeRecoveryCenterEvent, decisionReveal, setDecisionReveal, showErrorLog, showRanking]);
  useEffect(() => {
    const handleChoiceShortcut = (event) => {
      if (!started || decisionReveal || isAdvancing) return;
      if (event.repeat) return;
      const target = event.target;
      if (target instanceof HTMLElement && target.matches("input, textarea, select, [contenteditable='true']")) return;
      if (isResult) {
        if (event.key.toLowerCase() === "r") {
          event.preventDefault();
          startCaseEvent(currentCase);
        } else if (event.key.toLowerCase() === "n" && nextCaseSignal) {
          event.preventDefault();
          startCaseEvent(nextCaseSignal.caseId);
        }
        return;
      }
      if (event.key.toLowerCase() === "p") {
        event.preventDefault();
        saveCurrentGameEvent({ exit: event.shiftKey });
        return;
      }
      if (event.key === "Escape" && pendingChoice) {
        event.preventDefault();
        setPendingChoiceEvent(null);
        return;
      }
      if ((event.key === "Enter" || event.key === " ") && pendingChoice) {
        event.preventDefault();
        chooseEvent(pendingChoice);
        return;
      }
      if (fixedChoices.length > 1 && ["ArrowDown", "ArrowRight", "j", "J", "ArrowUp", "ArrowLeft", "k", "K"].includes(event.key)) {
        event.preventDefault();
        const currentIndex = pendingChoice ? fixedChoices.findIndex((choice) => choice.id === pendingChoice.id) : -1;
        const direction = ["ArrowUp", "ArrowLeft", "k", "K"].includes(event.key) ? -1 : 1;
        const nextIndex = (currentIndex + direction + fixedChoices.length) % fixedChoices.length;
        previewChoiceEvent(fixedChoices[nextIndex]);
        return;
      }
      const choiceIndex = Number(event.key) - 1;
      if (!Number.isInteger(choiceIndex) || choiceIndex < 0 || !fixedChoices[choiceIndex]) return;
      event.preventDefault();
      previewChoiceEvent(fixedChoices[choiceIndex]);
    };
    window.addEventListener("keydown", handleChoiceShortcut);
    return () => window.removeEventListener("keydown", handleChoiceShortcut);
  }, [
    chooseEvent,
    currentCase,
    decisionReveal,
    fixedChoices,
    isAdvancing,
    isResult,
    nextCaseSignal,
    pendingChoice,
    previewChoiceEvent,
    saveCurrentGameEvent,
    setPendingChoiceEvent,
    startCaseEvent,
    started,
  ]);
  useEffect(() => {
    if (!pendingChoice) return;
    window.requestAnimationFrame(() => {
      // On a phone the console is fixed to the viewport, so there is nothing to
      // scroll to; scrolling there was what made confirming feel slow.
      if (!window.matchMedia?.("(max-width: 768px)").matches) {
        commitConsoleRef.current?.scrollIntoView({ behavior: getScrollBehavior(), block: "nearest" });
      }
      commitConfirmRef.current?.focus({ preventScroll: true });
    });
  }, [pendingChoice]);
  useEffect(() => {
    if (decisionReveal) {
      hadDecisionRevealRef.current = true;
      return;
    }
    if (!hadDecisionRevealRef.current) return;
    hadDecisionRevealRef.current = false;
    window.requestAnimationFrame(() => sceneTitleRef.current?.focus({ preventScroll: true }));
  }, [decisionReveal]);
  useEffect(() => () => {
    window.clearTimeout(freeTextSaveTimerRef.current);
    window.clearTimeout(choiceHoldTimerRef.current);
  }, []);

  const musicModeKey = useMemo(() => {
    if (!started) return "intro:menu";
    if (isResult) return currentCase === "final" ? `result:final:${endingStep}` : `result:${currentCase}`;
    const musicRouteIndex = getNodeRouteIndex(fallbackCaseId, resolvedNodeId);
    const phaseKey = String(node?.phase ?? node?.speaker ?? "scene")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "scene";
      return `${riskTier.toLowerCase()}:${currentCase}:${phaseKey}:${node?.speaker ?? "voice"}:${musicRouteIndex}:${operatorOrigin}`;
  }, [currentCase, endingStep, fallbackCaseId, isResult, node?.phase, node?.speaker, operatorOrigin, resolvedNodeId, riskTier, started]);

  useEffect(() => {
    if (!started || isResult) return undefined;
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setTimerPenaltyCount(0);
      setProbeUsed(false);
    });
    startDecisionWindow(DECISION_WINDOW_SECONDS);
    return () => {
      cancelled = true;
      stopDecisionWindow();
    };
  }, [currentCase, isResult, resolvedNodeId, setProbeUsed, setTimerPenaltyCount, started]);

  useEffect(() => {
    if (!started || isResult) return undefined;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        visibilityPauseRef.current ??= Date.now();
        return;
      }
      if (visibilityPauseRef.current === null) return;
      const pausedForMs = Date.now() - visibilityPauseRef.current;
      visibilityPauseRef.current = null;
      const adjustedNodeEnteredAt = nodeEnteredAt + pausedForMs;
      setNodeEnteredAt(adjustedNodeEnteredAt);
      persist({ nodeEnteredAt: adjustedNodeEnteredAt });
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isResult, nodeEnteredAt, persist, started]);

  useEffect(() => {
    const handlePageHide = () => {
      if (!started || persistSuppressed()) return;
      if (readStoredValue(STORAGE_KEY, null) === null) return;
      persist({ paused: true });
    };
    const handlePageShow = (event) => {
      if (!started || !event.persisted) return;
      setIsPausedSave(false);
      persist({ paused: false });
    };
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("pageshow", handlePageShow);
    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [persist, persistSuppressed, setIsPausedSave, started]);

  // Overtime keeps charging. The window used to bill once and then let the
  // player think for free, which staged pressure without ever applying it.
  const chargeOvertime = useStableEvent(() => {
    const decisionSeconds = getDecisionSeconds();
    if (!started || isResult || decisionSeconds > 0) return;
    const chargesDue = 1 + Math.floor(-decisionSeconds / OVERTIME_CHARGE_SECONDS);
    if (chargesDue <= timerPenaltyCount) return;
    const chargeIndex = timerPenaltyCount + 1;
    const overtimeSeconds = -decisionSeconds;
    const timeoutEffect = { time: -2 - chargeIndex, fatigue: 2 + chargeIndex };
    const nextResources = applyEffect(resources, timeoutEffect);
    const entry = {
      nodeId: resolvedNodeId,
      title: "TIMEOUT PRESSURE",
      choice: chargeIndex === 1 ? "결정 윈도우 초과" : `결정 윈도우 초과 ${chargeIndex}차`,
      spokenChoice: "잠깐. 늦어진 만큼의 비용도 기록하겠습니다.",
      freeText: "",
      effect: timeoutEffect,
      triggers: ["fear", "responsibility"],
      echo:
        chargeIndex === 1
          ? "결정을 늦추는 것도 하나의 결정입니다. 이제 줄어든 시간과 늘어난 피로를 감안하십시오."
          : `${OVERTIME_CHARGE_SECONDS}초가 더 지났습니다. 기다리는 비용은 회차마다 커집니다.`,
      sceneBeat: "에코: 결정 윈도우가 닫혔습니다.\n회의실: 아무도 당신을 대신해 결론을 내리지 않았지만, 기다린 비용은 이미 숫자로 남았습니다.",
      challenge: { title: "시간 압박 버티기", matched: false, riskDelta: getRiskPressure(nextResources) - riskPressure },
      tactical: null,
      flowSurge: null,
      tempoBonus: null,
      instinctSurge: null,
      note: `결정 윈도우 초과 비용 ${chargeIndex}차`,
      responseTimeSec: 45 + overtimeSeconds,
      resourcesBefore: resources,
      resourcesAfter: nextResources,
      isSystemEvent: true,
    };
    const nextLog = [...log, entry];
    queueMicrotask(() => {
      setTimerPenaltyCount(chargeIndex);
      setResources(nextResources);
      setLog(nextLog);
      setEcho(entry.echo);
      setSaveStatus(`결정 윈도우 초과 비용 ${chargeIndex}차 적용됨`);
    });
    persist({
      timerPenaltyCount: chargeIndex,
      resources: nextResources,
      log: nextLog,
      echo: entry.echo,
    });
  });

  useEffect(() => {
    if (!started || isResult) return undefined;
    return onDecisionTick(chargeOvertime);
  }, [chargeOvertime, isResult, started]);

  function getScrollBehavior() {
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  }

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: getScrollBehavior() });
      sceneTitleRef.current?.focus({ preventScroll: true });
      setIsAdvancing(false);
      setShowTacticalDetails(false);
      setPendingChoiceEvent(null);
    });
  }, [currentCase, isResult, nodeId, setPendingChoiceEvent, started]);

  // Persistence, save slots and error-log state are owned by useAppPersistence.
  const startGame = persistenceStartGame;
  function startNewGamePlus() {
    if (!newGamePlusUnlocked) return;
    const memory = caseResults;
    writeStoredValue(NEW_GAME_PLUS_KEY, "true");
    writeStoredValue(NEW_GAME_PLUS_MEMORY_KEY, JSON.stringify(memory));
    setNewGamePlusMemory(memory);
    setSaveStatus("NEW GAME+ 기록 모드로 시작합니다. 숨겨진 권한과 추가 단서를 추적하세요.");
    startGame();
  }
  function startRecoveryRoute() {
    setSaveStatus("복구 루트로 다시 시작합니다. 이번 목표는 피해를 줄이고 기록을 보존하는 것입니다.");
    startCase(currentCase);
  }
  function resolveHypothesisAction(action) {
    if (!action?.effect) return;
    const nextResources = applyEffect(resources, action.effect);
    const entry = {
      isSystemEvent: true,
      nodeId: resolvedNodeId,
      caseId: fallbackCaseId,
      choiceId: `hypothesis-${action.id}`,
      title: "HYPOTHESIS REVIEW",
      choice: action.label,
      effect: action.effect,
      resourcesBefore: resources,
      resourcesAfter: nextResources,
    };
    const event = createGameEvent("HYPOTHESIS_ACTION", { id: action.id, action: action.id });
    const nextDecisions = reduceInvestigationState(hypothesisDecisions, event);
    const nextLog = [...log, { ...entry, event }];
    setHypothesisAction(action.id);
    setHypothesisDecisions(nextDecisions);
    setResources(nextResources);
    setLog(nextLog);
    persist({ resources: nextResources, log: nextLog, hypothesisDecisions: nextDecisions });
    setSaveStatus(`${action.label}: ${action.text}`);
  }
  function investigateTarget(target) {
    if (!target || target.locked) {
      setSaveStatus("현재 권한으로는 이 조사 대상을 열 수 없습니다.");
      return;
    }
    const outcome = getInvestigationOutcome(target, log.length);
    const event = createGameEvent("INVESTIGATE", { id: target.id, result: outcome?.outcome });
    const nextInvestigations = reduceInvestigationState(investigatedTargets, event);
    setSelectedInvestigation(target.id);
    setInvestigatedTargets(nextInvestigations);
    const nextResources = applyEffect(resources, target.effect);
    setResources(nextResources);
    persist({ resources: nextResources, investigatedTargets: nextInvestigations });
    setSaveStatus(`${target.label}: 조사가 기록되었습니다.`);
  }
  function repairEvidence() {
    if (!evidenceRepairPuzzle || evidenceRepaired) return;
    const nextResources = applyEffect(resources, evidenceRepairPuzzle.reward);
    const nextLog = [...log, { isSystemEvent: true, choiceId: "evidence-repair", caseId: fallbackCaseId, resourcesBefore: resources, resourcesAfter: nextResources }];
    setEvidenceRepaired(true);
    setResources(nextResources);
    setLog(nextLog);
    persist({ resources: nextResources, log: nextLog });
    setSaveStatus("증거 원본이 복구되었습니다.");
  }
  function counterRival(option) {
    if (!option?.effect) return;
    const nextResources = applyEffect(resources, option.effect);
    const nextLog = [...log, { isSystemEvent: true, choiceId: `rival-${option.id}`, caseId: fallbackCaseId, resourcesBefore: resources, resourcesAfter: nextResources }];
    setResources(nextResources);
    setLog(nextLog);
    persist({ resources: nextResources, log: nextLog });
    setSaveStatus(`${option.label}: 라이벌 개입에 대응했습니다.`);
  }
  function startCase(caseId) {
    const baseStartNode = CASE_START_NODES[caseId];
    const introEcho =
      caseId === "final"
        ? "마지막 사건입니다. 에코는 더 이상 조언자처럼 말하지 않습니다. 당신의 조건이 어떻게 사용됐는지 직접 묻습니다."
        : caseId === "case05"
        ? "이번 사건의 핵심은 악인이 없는 실패입니다. 에코는 책임자를 찾고 싶은 충동과 구조를 끝까지 보려는 사고를 분리해 묻습니다."
        : caseId === "case04"
        ? "이번 사건의 핵심은 명분 있는 위반입니다. 에코는 좋은 결과가 규칙 훼손을 어디까지 정당화하는지 묻습니다."
        : caseId === "case03"
        ? "이번 사건의 핵심은 경쟁 압박입니다. 에코는 당신이 이기려는 순간 무엇을 덜 검증하는지 추적합니다."
        : caseId === "case02"
          ? "이번 사건의 핵심은 증거와 신뢰의 충돌입니다. 에코는 당신이 무엇을 믿고 싶은지와 무엇을 증명할 수 있는지를 분리해서 묻습니다."
          : "얼마나 똑똑한지는 묻지 않겠습니다. 대신 언제 생각을 멈추지 못하는지 보겠습니다.";
    const previousCaseId = caseSequence[caseSequence.indexOf(caseId) - 1];
    const previousResult = previousCaseId ? caseResults[previousCaseId] : null;
    const startNode = caseOpeningRoutes[caseId]?.[previousResult?.outcomeChoiceId] ?? baseStartNode;
    const previousOutcome = previousResult?.outcomeChoiceId
      ? getCaseOutcome({ caseId: previousCaseId, choiceId: previousResult.outcomeChoiceId })
      : null;
    const continuityChallenge = previousResult?.outcomeChoiceId
      ? getContinuityChallenge({ caseId: previousCaseId, choiceId: previousResult.outcomeChoiceId })
      : null;
    const carryoverEffect = previousResult?.outcomeChoiceId
      ? getOutcomeCarryover({ caseId: previousCaseId, choiceId: previousResult.outcomeChoiceId })
      : {};
    const baseLegacy = previousResult ? legacyProfiles[previousResult.rank] ?? legacyProfiles.C : null;
    const openingEffect = { ...(baseLegacy?.effect ?? {}) };
    Object.entries(carryoverEffect).forEach(([key, value]) => {
      openingEffect[key] = (openingEffect[key] ?? 0) + value;
    });
    const legacy = previousResult
      ? {
          ...baseLegacy,
          effect: openingEffect,
          continuity: previousOutcome,
          continuityChallenge,
        }
      : null;
    const openingEcho = previousOutcome
      ? `${introEcho} 직전 사건의 결과는 '${previousOutcome.title}'로 기록됐습니다. 이번 사건은 그 선택의 비용을 이어받습니다.`
      : introEcho;
    const originEffect = caseId === "case01" && !previousResult ? getOriginStartEffects(operatorOrigin) : {};
    const openingResources = applyEffect(previousResult ? applyEffect(initialResources, openingEffect) : initialResources, originEffect);
    appendTraceEvent({
      kind: "case-start",
      caseId,
      nodeId: startNode,
      logLength: 0,
      resources: openingResources,
      note: previousResult?.outcomeChoiceId ?? "season-start",
    });
    setStarted(true);
    setIsPausedSave(false);
    setCurrentCase(caseId);
    setNodeId(startNode);
    setResources(openingResources);
    setLog([]);
    setTriggers(makeEmptyScores(triggerLabels));
    setCognition(makeEmptyScores(cognitionLabels));
    setProtocolUsed(false);
    setTimerPenaltyCount(0);
    setProbeUsed(false);
    setInvestigatedTargets({});
    setHypothesisDecisions({});
    setOpeningLegacy(legacy);
    setDecisionReveal(null);
    resetEndingSequence();
    setEcho(openingEcho);
    setFreeText("");
    setNodeEnteredAt(Date.now());
    persist({
      started: true,
      paused: false,
      currentCase: caseId,
      nodeId: startNode,
      resources: openingResources,
      log: [],
      triggers: makeEmptyScores(triggerLabels),
      cognition: makeEmptyScores(cognitionLabels),
      freeText: "",
      protocolUsed: false,
      timerPenaltyCount: 0,
      probeUsed: false,
      openingLegacy: legacy,
      echo: openingEcho,
      nodeEnteredAt: Date.now(),
    });
  }

  function anonymizeFreeText() {
    updateFreeText(anonymizeSensitiveText(freeText));
  }

  function updateFreeText(value) {
    const nextText = limitText(value, FREE_TEXT_MAX_LENGTH);
    setFreeText(nextText);
    window.clearTimeout(freeTextSaveTimerRef.current);
    freeTextSaveTimerRef.current = window.setTimeout(() => {
      persist({ freeText: nextText });
      freeTextSaveTimerRef.current = null;
    }, 400);
  }

  function requestEchoProbe() {
    if (probeUsed || isAdvancing || !echoProbeHint) return;
    const probeSeconds = playStyle === "mediator" ? 4 : 8;
    const probeEffect = playStyle === "mediator"
      ? { time: -1, trust: 1 }
      : { time: -1, fatigue: 1 };
    const nextResources = applyEffect(resources, probeEffect);
    const probeLine = `${echoProbeHint} 단, 힌트를 얻는 대가로 결정 시간 ${probeSeconds}초를 지불합니다.`;
    const entry = {
      nodeId: resolvedNodeId,
      title: "ECHO PROBE",
      choice: "에코에게 힌트 요청",
      spokenChoice: "판단을 대신하지 말고, 어느 방향을 더 봐야 하는지만 말해.",
      freeText: "",
      effect: probeEffect,
      triggers: ["curiosity", "inference"],
      echo: probeLine,
      sceneBeat: `당신: 에코에게 한 번 더 묻는다.\n에코: ${echoProbeHint}`,
      challenge: null,
      tactical: null,
      flowSurge: null,
      tempoBonus: null,
      instinctSurge: null,
      note: "장면당 1회 힌트 요청",
      responseTimeSec: probeSeconds,
      resourcesBefore: resources,
      resourcesAfter: nextResources,
      isSystemEvent: true,
    };
    const nextLog = [...log, entry];
    setProbeUsed(true);
    setResources(nextResources);
    setLog(nextLog);
    setEcho(probeLine);
    spendDecisionSeconds(probeSeconds);
    setSaveStatus(`에코 힌트 확보됨 · 결정 시간 ${probeSeconds}초 사용`);
    persist({
      probeUsed: true,
      resources: nextResources,
      log: nextLog,
      echo: probeLine,
    });
  }

  function activateCrisisProtocol() {
    if (protocolUsed || riskPressure < 60 || isAdvancing) return;
    const protocolEffect = { time: -4, capital: -2, legitimacy: 3, fatigue: 4 };
    const nextResources = applyEffect(resources, protocolEffect);
    const entry = {
      nodeId: resolvedNodeId,
      title: "CRISIS PROTOCOL",
      choice: "위기 프로토콜 발동",
      spokenChoice: "지금 구조를 바꾸고, 그 비용을 기록하겠습니다.",
      freeText: "",
      effect: protocolEffect,
      triggers: ["responsibility", "order"],
      echo: "프로토콜은 시간을 구하지 않습니다. 대신 누구에게 어떤 기준으로 개입했는지 남깁니다.",
      sceneBeat: `에코: 위험 압력 ${riskPressure}에서 일반 절차를 유지할 여유가 사라졌습니다.\n당신: 위기 프로토콜을 발동한다. 시간과 현금을 더 내놓고, 판단 기준을 공개된 절차로 묶는다.`,
      challenge: { title: "위기 압력 버티기", matched: true, riskDelta: getRiskPressure(nextResources) - riskPressure },
      tactical: { grade: "A", gradeText: "공략 후보", reward: "구조 개입", cost: "TIME -4 · CAPITAL -2", gain: "LEGITIMACY +3" },
      flowSurge: null,
      tempoBonus: null,
      note: "케이스당 1회 사용 가능한 구조 개입",
      responseTimeSec: Math.max(1, Math.round((Date.now() - nodeEnteredAt) / 1000)),
      isSystemEvent: true,
      resourcesBefore: resources,
      resourcesAfter: nextResources,
    };
    const nextLog = [...log, entry];
    setProtocolUsed(true);
    setResources(nextResources);
    setLog(nextLog);
    setEcho(entry.echo);
    setNodeEnteredAt(Date.now());
    startDecisionWindow(DECISION_WINDOW_SECONDS);
    setSaveStatus("위기 프로토콜 발동됨");
    persist({
      protocolUsed: true,
      resources: nextResources,
      log: nextLog,
      echo: entry.echo,
      nodeEnteredAt: Date.now(),
    });
  }

  function buildCaseSummary(nextTriggers, nextCognition, nextLog, nextResources = resources) {
    return createCaseSummary(nextTriggers, nextCognition, nextLog, {
      resources: nextResources,
      schemaVersion: SAVE_SCHEMA_VERSION,
    });
  }


  function getFreeTextBranchTarget(caseId, fromNodeId) {
    const dramaticFreeRoutes = {
      case01: "c1_route_system",
      case02: "c2_route_system",
      case03: "c3_route_system",
      case04: "c4_route_system",
      case05: "c5_route_system",
      final: "f_route_system",
    };
    const dramaticRoute = dramaticFreeRoutes[caseId];
    if (dramaticRoute && fromNodeId !== dramaticRoute && nodes[dramaticRoute]) {
      return dramaticRoute;
    }
    const branch = getCaseBranchNodes().find((item) => item.caseId === caseId);
    if (!branch || branch.nodeId === fromNodeId) return null;
    return branch.detourIds[0] ?? branch.nextIds[0] ?? null;
  }

  function choose(choice) {
    if (isAdvancing) return;
    const authorityGate = getAuthorityGate(choice, { clueCount, trust: resources.trust, legitimacy: resources.legitimacy });
    if (!authorityGate.unlocked) {
      setSaveStatus(`Choice locked: ${authorityGate.reason}`);
      return;
    }
    if (!nodes[choice.next] && !Object.values(CASE_RESULT_NODES).includes(choice.next)) {
      reportSilentFailure("bad-next", { from: resolvedNodeId, choiceId: choice.id, next: choice.next });
      return;
    }
    window.clearTimeout(freeTextSaveTimerRef.current);
    freeTextSaveTimerRef.current = null;
    setIsAdvancing(true);
    setPendingChoice(null);
    const responseTimeSec = Math.max(1, Math.round((Date.now() - nodeEnteredAt) / 1000));
    const free = choice.type === "free";
    const freeResult = free ? scoreFreeText(freeText) : null;
    const submittedFreeText = free ? freeText.trim() : "";
    const submittedSignals = free ? getFreeTextSignals(submittedFreeText) : [];
    const submittedSignalCount = submittedSignals.filter((signal) => signal.active).length;
    const submittedPrivacySignals = free ? detectPrivacySignals(submittedFreeText) : [];
    const freeTextSuccess =
      free &&
      submittedSignalCount >= 3 &&
      !submittedPrivacySignals.some((signal) => signal.active);
    const freeTextBranchTarget = free && freeTextSuccess && currentCaseFreeTextSuccessCount === 0
      ? getFreeTextBranchTarget(currentCase, resolvedNodeId)
      : null;
    const baseEffect = free ? freeResult.effect : choice.effect;
    const cognitiveEffect = free ? freeResult.cognition : choice.cognition;
    const {
      challengeMatch,
      tacticalRead,
      flowSurge,
      finalEffect: effect,
      finalRiskDelta: challengeRiskDelta,
    } = getEffectiveChoiceRead(choice, baseEffect, cognitiveEffect);
    const instinctChoice = playStyle === "instinct" && !showTacticalDetails;
    const instinctSurge = instinctChoice && challengeMatch
      ? {
          label: "INSTINCT SURGE",
          text: "정보를 더 열어보지 않고 장면의 핵심 압박을 읽었습니다.",
          effect: { trust: 3, fatigue: -2 },
        }
      : null;
    const auditSurge = playStyle === "auditor" && showTacticalDetails && challengeMatch
      ? {
          label: "AUDIT SURGE",
          text: "비용과 위험을 확인한 뒤, 설명 가능한 챌린지 선택을 완수했습니다.",
          effect: { legitimacy: 2, fatigue: -1 },
        }
      : null;
    const quickRead = responseTimeSec <= 12 && challengeMatch;
    const tempoBonus = quickRead
      ? {
          label: "QUICK READ",
          text: "장면의 핵심 압박을 빠르게 읽고, 망설임 없이 챌린지를 맞혔습니다.",
        effect: { trust: 1, fatigue: -1 },
      }
      : null;
    const streakBreak = currentChallengeStreak > 0 && !challengeMatch
      ? {
          label: "STREAK BROKEN",
          text: `${currentChallengeStreak}연속 장면 목표가 끊겼습니다. 다음 장면부터 다시 흐름을 쌓을 수 있습니다.`,
          tone: "break",
        }
      : null;
    const clue = getClueReveal(challengeMatch, challengeRiskDelta, responseTimeSec, freeTextSuccess);
    const clueReward = clue
      ? {
          label: "EVIDENCE BONUS",
          text: "숨은 단서를 확보해 정당성이 오르고 판단 피로가 줄었습니다.",
          effect: { legitimacy: 2, fatigue: -1 },
        }
      : null;
    const choiceSearchText = `${choice.id} ${choice.label}`.toLowerCase();
    const prematureHypothesis =
      clueHypotheses.length > 0 &&
      clueHypotheses.some((hypothesis) => Number(hypothesis.confidence) < 75) &&
      /expose|public|report|disclosure|공개|폭로|보고/.test(choiceSearchText)
      ? {
          label: "HYPOTHESIS CHALLENGED",
          text: "증거가 덜 모인 가설을 공개선에 올렸습니다. 다음 장면에서 신뢰와 정당성이 흔들립니다.",
          effect: { trust: -3, legitimacy: -2, fatigue: 3 },
        }
      : null;
    const mergedEffect = mergeEffects(
      effect,
      ...(tempoBonus ? [tempoBonus.effect] : []),
      ...(instinctSurge ? [instinctSurge.effect] : []),
      ...(auditSurge ? [auditSurge.effect] : []),
      ...(clueReward ? [clueReward.effect] : []),
      ...(prematureHypothesis ? [prematureHypothesis.effect] : []),
    );
    const finalEffect = applySeededEffectVariation(
      mergedEffect,
      `${sessionId}:${resolvedNodeId}:${choice.id}`,
    );
    const finalResourcesWithTempo = applyEffect(resources, finalEffect);
    const nextDiscoveredClues = clue ? [...discoveredClues, clue] : discoveredClues;
    const suspenseEvent = getSuspenseEvent({
      riskBefore: riskPressure,
      riskAfter: getRiskPressure(finalResourcesWithTempo),
      currentCase,
      logLength: log.length,
    });
    const nextTriggers = { ...triggers };
    const nextCognition = { ...cognition };

    node.triggers.forEach((trigger) => {
      nextTriggers[trigger] = (nextTriggers[trigger] ?? 0) + (free ? 10 : 6);
    });
    Object.entries(cognitiveEffect ?? {}).forEach(([key, value]) => {
      nextCognition[key] = (nextCognition[key] ?? 0) + value;
    });

    const entryBase = {
      nodeId: resolvedNodeId,
      caseId: fallbackCaseId,
      speaker: node.speaker,
      choiceId: choice.id,
      title: node.title,
      chapterRule: chapterRules[currentCase]?.label ?? "",
      choice: choice.label,
      spokenChoice: getDramaticChoiceLabel(choice),
      freeText: submittedFreeText,
      freeTextSignalCount: submittedSignalCount,
      freeTextSuccess,
      freeTextBranchId: freeTextBranchTarget,
      effect: finalEffect,
      cognition: cognitiveEffect ?? {},
      triggers: node.triggers,
      echo: getEcho(choice.id, free ? freeText : ""),
      sceneBeat: buildSceneBeat(node, choice, free ? freeText : "", finalEffect),
      challenge: {
        title: sceneChallenge.title,
        matched: challengeMatch,
        riskDelta: challengeRiskDelta,
      },
      tactical: tacticalRead,
      flowSurge,
      tempoBonus,
      instinctSurge,
      auditSurge,
      clueReward,
      prematureHypothesis,
      streakBreak,
      suspenseEvent,
      clue,
      note: freeResult?.note ?? "",
      responseTimeSec,
      resourcesBefore: resources,
      resourcesAfter: finalResourcesWithTempo,
    };
    const entry = {
      ...entryBase,
      observerTag: getObserverTag(entryBase),
    };

    const nextLog = [...log, entry];
    const safeQuote = freeTextSuccess ? limitText(submittedFreeText, 140) : "";
    const nextEcho = safeQuote
      ? `${entry.echo} 다음 장면은 당신이 남긴 문장 \u201c${safeQuote}\u201d을 기준으로 이어집니다.`
      : entry.echo;
    const previousCaseId = caseSequence[caseSequence.indexOf(currentCase) - 1];
    const branchBypass = getBranchDetourBypass(choice, {
      resources,
      previousOutcomeChoiceId: previousCaseId ? caseResults[previousCaseId]?.outcomeChoiceId : undefined,
    });
    const nextNode = freeTextBranchTarget ?? branchBypass ?? choice.next;
    appendTraceEvent({
      kind: "choose",
      caseId: currentCase,
      nodeId: resolvedNodeId,
      choiceId: choice.id,
      nextNodeId: nextNode,
      logLength: nextLog.length,
      resources: finalResourcesWithTempo,
    });
    const nextCompletedCases = CASE_RESULT_NODES[currentCase] === nextNode
      ? Array.from(new Set([...completedCases, currentCase]))
      : completedCases;
    const completedNow = nextCompletedCases !== completedCases;
    const caseSummaryDraft = completedNow
      ? buildCaseSummary(nextTriggers, nextCognition, nextLog, finalResourcesWithTempo)
      : null;
    const caseSummary = completedNow
      ? {
          ...caseSummaryDraft,
          endingVariant: getEndingVariant({
            resources: finalResourcesWithTempo,
            discoveredClues: nextDiscoveredClues,
            log: nextLog,
            ...getSeasonStrain(caseResults, caseSummaryDraft),
          }),
          runId,
          outcomeChoiceId: entry.choiceId,
          outcomeNodeId: entry.nodeId,
          completedAt: new Date().toISOString(),
        }
      : null;
    const nextCaseResults = completedNow
      ? {
          ...caseResults,
          [currentCase]: caseSummary,
        }
      : caseResults;

    if (completedNow && caseSummary) {
      if (currentCase === "final") {
        setNewGamePlusUnlocked(true);
        writeStoredValue(NEW_GAME_PLUS_KEY, "true");
      }
      const localRankingRow = {
        local: true,
        run_id: runId,
        session_code: sessionCode,
        player_name: playerName || "현재 분석관",
        case_id: currentCase,
        case_title: activeCaseMeta?.title ?? currentCase,
        completed_at: caseSummary.completedAt,
        summary: caseSummary,
      };
      const { saved: localRankingSaved } = appendLocalRankingRow(localRankingRow);
      if (!localRankingSaved) {
        setSaveStatus("Local ranking save failed: browser storage is unavailable.");
        recordAppError(new Error("Local ranking save failed because browser storage could not be written."), {}, "local-ranking-save");
      }
    }

    if (completedNow && caseSummary) {
      if (!telemetryEnabled) {
        setTelemetryStatus({
          tone: "local",
          text: "원격 저장 미설정. 이 케이스 로그는 로컬과 JSON 내보내기에만 남습니다.",
        });
      } else if (!dataConsent) {
        setTelemetryStatus({
          tone: "local",
          text: "데이터 제공 동의가 없어 원격 저장을 건너뛰었습니다.",
        });
      } else {
        const caseTelemetryPayload = {
          session_id: sessionId,
          run_id: runId,
          session_code: sessionCode,
          player_name: "익명 분석관",
          case_id: currentCase,
          case_title: activeCaseMeta?.title ?? currentCase,
          completed_at: new Date().toISOString(),
          summary: caseSummary,
          resources: finalResourcesWithTempo,
          triggers: nextTriggers,
          cognition: nextCognition,
          decision_log: nextLog,
        };
        setTelemetryStatus({
          tone: "pending",
          text: "케이스 로그를 원격 저장하는 중입니다.",
        });
        saveCaseTelemetry(caseTelemetryPayload)
          .then(() => {
            setTelemetryStatus({
              tone: "success",
              text: "케이스 로그가 원격 저장됐습니다.",
            });
          })
          .catch((error) => {
            console.warn(error);
            queueTelemetry({
              id: `case-${currentCase}-${Date.now()}`,
              type: "case",
              label: `${activeCaseMeta?.label ?? currentCase} 케이스 로그`,
              payload: caseTelemetryPayload,
            });
            setTelemetryStatus({
              tone: "error",
              text: "원격 저장에 실패했습니다. 로컬 대기열에 보관했으니 결과 화면에서 재시도할 수 있습니다.",
            });
          });
      }
    }

    if (completedNow && caseSummary && currentCase === "final" && nextCompletedCases.length === CASE_SEQUENCE.length) {
      const seasonTelemetryPayload = {
        session_id: sessionId,
        run_id: runId,
        session_code: sessionCode,
        player_name: "익명 분석관",
        case_id: "season-final",
        case_title: "SEASON 01 COMPLETE",
        completed_at: new Date().toISOString(),
        summary: { ...caseSummary, seasonComplete: true, completedCaseCount: nextCompletedCases.length },
        resources: finalResourcesWithTempo,
        triggers: nextTriggers,
        cognition: nextCognition,
        decision_log: nextLog,
      };
      const seasonLocalRankingRow = {
        local: true,
        run_id: runId,
        session_code: sessionCode,
        player_name: playerName || "현재 분석관",
        case_id: "season-final",
        case_title: "SEASON 01 COMPLETE",
        completed_at: caseSummary.completedAt,
        summary: { ...caseSummary, seasonComplete: true, completedCaseCount: nextCompletedCases.length },
      };
      const { saved: seasonRankingSaved } = appendLocalRankingRow(seasonLocalRankingRow);
      if (!seasonRankingSaved) {
        setSaveStatus("Season ranking save failed: browser storage is unavailable.");
        recordAppError(new Error("Season ranking save failed because browser storage could not be written."), {}, "local-ranking-save");
      }
      if (telemetryEnabled && dataConsent) {
        saveCaseTelemetry(seasonTelemetryPayload).catch(() => {
          queueTelemetry({
            id: `season-final-${runId}`,
            type: "case",
            label: "SEASON 01 COMPLETE",
            payload: seasonTelemetryPayload,
          });
        });
      }
    }

    setResources(finalResourcesWithTempo);
    setTriggers(nextTriggers);
    setCognition(nextCognition);
    setLog(nextLog);
    setEcho(nextEcho);
    setFreeText("");
    setNodeId(nextNode);
    setCompletedCases(nextCompletedCases);
    setCaseResults(nextCaseResults);
    setDiscoveredClues(nextDiscoveredClues);
    setNodeEnteredAt(Date.now());
    const strongestCost = Object.entries(finalEffect)
      .filter(([, value]) => value < 0)
      .sort((a, b) => a[1] - b[1])[0];
    // The moment a case closes is the only moment its hidden record can still
    // be named. Leaving without one used to be silent.
    const caseClue = getCaseDiscoveryClue(fallbackCaseId);
    const closedCaseClue =
      Object.values(CASE_RESULT_NODES).includes(nextNode) &&
      caseClue &&
      !nextDiscoveredClues.some((item) => item.id === caseClue.id)
        ? caseClue
        : null;
    const cascade = finalResourcesWithTempo.humanCost >= 28 || getRiskPressure(finalResourcesWithTempo) >= 72;
    setDecisionReveal({
      title: suspenseEvent?.title ?? (cascade ? "선택이 연쇄 반응을 일으켰습니다." : "선택의 잔향"),
      label: suspenseEvent?.label ?? (cascade ? "CASCADE DETECTED" : "DECISION AFTERIMAGE"),
      spokenChoice: entry.spokenChoice,
      beat: entry.sceneBeat,
      effect: finalEffect,
      consequence: suspenseEvent
        ? suspenseEvent.text
        : clue
        ? `${clue.title}를 발견했습니다. 다음 사건에서 이 단서를 잊지 마십시오.`
        : closedCaseClue
        ? `이번 사건의 기록 하나가 닫혔습니다: ${closedCaseClue.title}. 마지막 사건에서 한 번은 다시 열 수 있습니다.`
        : cascade
        ? "당신의 말은 실행안으로 끝나지 않았습니다. 누군가의 행동을 바꾸고, 다음 장면의 압박을 앞당겼습니다."
        : strongestCost
          ? `${resourceMeta[strongestCost[0]]?.label ?? strongestCost[0]}의 감소분이 다음 장면의 숨은 질문으로 남습니다.`
          : entry.challenge?.matched
            ? "장면의 핵심을 읽어낸 대가로, 회의실은 당신의 기준을 기억하기 시작합니다."
            : "결론은 닫혔지만, 말하지 않은 비용은 아직 닫히지 않았습니다.",
      nextTitle: nodes[nextNode]?.title ?? "결과 화면",
      nextNode,
      cascade,
      observerTag: entry.observerTag,
      streakBreak,
          suspenseEvent,
          clue,
          bonuses: [flowSurge, tempoBonus, instinctSurge, auditSurge, clueReward, streakBreak]
            .filter(Boolean)
            .map(({ label, text, effect, tone }) => ({ label, text, effect, tone })),
        });
    persist({
      resources: finalResourcesWithTempo,
      triggers: nextTriggers,
      cognition: nextCognition,
      log: nextLog,
      echo: nextEcho,
      nodeId: nextNode,
      completedCases: nextCompletedCases,
      caseResults: nextCaseResults,
      discoveredClues: nextDiscoveredClues,
      freeText: "",
      timerPenaltyCount: 0,
      probeUsed: false,
      nodeEnteredAt: Date.now(),
    });
  }

  function previewChoice(choice) {
    if (isAdvancing || choice.type === "free") return;
    setPendingChoice(choice);
  }

  function beginChoiceHold(choice) {
    if (isAdvancing || choice.type === "free") return;
    window.clearTimeout(choiceHoldTimerRef.current);
    choiceHoldTriggeredRef.current = false;
    choiceHoldTimerRef.current = window.setTimeout(() => {
      choiceHoldTriggeredRef.current = true;
      choose(choice);
      choiceHoldTimerRef.current = null;
    }, 600);
  }

  function endChoiceHold() {
    window.clearTimeout(choiceHoldTimerRef.current);
    choiceHoldTimerRef.current = null;
  }

  function handleChoiceClick(choice) {
    if (choiceHoldTriggeredRef.current) {
      choiceHoldTriggeredRef.current = false;
      return;
    }
    previewChoice(choice);
  }

  function reset() {
    if (
      typeof globalThis.confirm === "function" &&
      !globalThis.confirm("저장된 진행과 현재 플레이 기록을 모두 지울까요?")
    ) {
      return;
    }
    onSuppressSaves();
    const resetStorageResults = [
      ["trigger-prototype", removeStoredValue("trigger-prototype")],
      [STORAGE_KEY, removeStoredValue(STORAGE_KEY)],
      [ERROR_LOG_STORAGE_KEY, removeStoredValue(ERROR_LOG_STORAGE_KEY)],
      [SAVE_SLOT_STORAGE_KEY, removeStoredValue(SAVE_SLOT_STORAGE_KEY)],
      [LOCAL_RANKING_STORAGE_KEY, removeStoredValue(LOCAL_RANKING_STORAGE_KEY)],
    ];
    removeStoredValue(RECOVERY_CENTER_STORAGE_KEY);
    const failedResetKeys = resetStorageResults.filter(([, removed]) => !removed).map(([key]) => key);
    setPlayerName("");
    setOperatorOriginState("courier");
    removeStoredValue(OPERATOR_ORIGIN_KEY);
    setRunId(createRunId());
    setPlayStyle("instinct");
    setDataConsent(false);
    setStarted(false);
    setCurrentCase("case01");
    setCompletedCases([]);
    setOpeningLegacy(null);
    setCaseResults({});
    setDiscoveredClues([]);
    setPlaytestFeedback({});
    pendingTelemetryRef.current = [];
    setPendingTelemetry([]);
    clearLocalRankingRows();
    setLocalErrorEntries([]);
    setSaveSlots([]);
    setLastRecoveredError(null);
    setNodeId("start");
    setResources(initialResources);
    setLog([]);
    setTriggers(makeEmptyScores(triggerLabels));
    setCognition(makeEmptyScores(cognitionLabels));
    setProtocolUsed(false);
    setTimerPenaltyCount(0);
    setProbeUsed(false);
    setInvestigatedTargets({});
    setHypothesisDecisions({});
    setDecisionReveal(null);
    setEcho("얼마나 똑똑한지는 묻지 않겠습니다. 대신 언제 생각을 멈추지 못하는지 보겠습니다.");
    setFreeText("");
    let resetErrorLogSaved = true;
    if (failedResetKeys.length > 0) {
      resetErrorLogSaved = appendStoredErrorLog({
        id: `reset-failed-${Date.now()}`,
        occurredAt: new Date().toISOString(),
        error: {
          name: "StorageResetError",
          message: "Some browser storage keys could not be removed during reset.",
          stack: "",
        },
        context: {
          source: "reset",
          currentCase,
          nodeId,
          failedStorageKeys: failedResetKeys,
        },
      });
    }
    setSaveStatus(
      failedResetKeys.length === 0
        ? ""
        : `일부 브라우저 저장소를 지우지 못했습니다: ${failedResetKeys.join(", ")}${resetErrorLogSaved ? "" : " · 진단 로그 저장도 실패했습니다."}`,
    );
    setLastSavedAt("");
    setIsPausedSave(false);
    setNodeEnteredAt(Date.now());
    setTelemetryStatus({
      tone: telemetryEnabled && isOnline ? "ready" : "local",
      text: !isOnline
        ? "오프라인. 이 플레이는 브라우저와 JSON 로그로만 저장됩니다."
        : telemetryEnabled
          ? "원격 저장 준비됨. 데이터 제공 동의 시 케이스 완료 로그가 저장됩니다."
          : "로컬 저장. 이 플레이는 브라우저와 JSON 로그로만 저장됩니다.",
    });
    resumeRuntimeSaves();
  }

  function retryStorageCleanup() {
    const cleanupResults = [
      ["trigger-prototype", removeStoredValue("trigger-prototype")],
      [STORAGE_KEY, removeStoredValue(STORAGE_KEY)],
      [ERROR_LOG_STORAGE_KEY, removeStoredValue(ERROR_LOG_STORAGE_KEY)],
      [SAVE_SLOT_STORAGE_KEY, removeStoredValue(SAVE_SLOT_STORAGE_KEY)],
      [LOCAL_RANKING_STORAGE_KEY, removeStoredValue(LOCAL_RANKING_STORAGE_KEY)],
    ];
    const failedKeys = cleanupResults.filter(([, removed]) => !removed).map(([key]) => key);
    if (failedKeys.length === 0) {
      setLocalErrorEntries([]);
      clearLocalRankingRows();
      setSaveSlots([]);
      setLastRecoveredError(null);
      setSaveStatus("브라우저 저장소 정리를 완료했습니다.");
      return;
    }
    const retryLogSaved = appendStoredErrorLog({
      id: `reset-retry-failed-${Date.now()}`,
      occurredAt: new Date().toISOString(),
      error: {
        name: "StorageResetRetryError",
        message: "Some browser storage keys could not be removed during reset retry.",
        stack: "",
      },
      context: {
        source: "reset-retry",
        currentCase,
        nodeId,
        failedStorageKeys: failedKeys,
      },
    });
    setSaveStatus(`저장소 정리 재시도 실패: ${failedKeys.join(", ")}${retryLogSaved ? "" : " · 진단 로그 저장도 실패했습니다."}`);
  }

  function showSeasonMap() {
    setStarted(false);
    setIsPausedSave(true);
    persist({ started: false, paused: true });
  }

  function unlockAllCasesForTest() {
    const allPlayableCases = ["case01", "case02", "case03", "case04", "case05"];
    setCompletedCases(allPlayableCases);
    persist({ completedCases: allPlayableCases });
  }

  function startAtNode(
    caseIdValue,
    nodeIdValue,
    {
      echoText = "디버그 진입입니다. 이 장면부터 선택 흐름을 재현합니다.",
      persistRun = true,
    } = {},
  ) {
    const caseId = seasonCasesBase.some((caseItem) => caseItem.id === caseIdValue) ? caseIdValue : "case05";
    const nodeOptions = nodeOrders[caseId] ?? nodeOrders.case05;
    const nextNodeId = nodeOptions.includes(nodeIdValue) ? nodeIdValue : nodeOptions[0];
    appendTraceEvent({
      kind: "enter",
      caseId,
      nodeId: nextNodeId,
      logLength: 0,
      resources: initialResources,
      note: persistRun ? "debug-start" : "replay",
    });
    const allPreviousCases = caseSequence.slice(0, Math.max(0, caseSequence.indexOf(caseId)));
    const now = Date.now();
    const nextRunId = persistRun ? createRunId() : runId;
    if (persistRun) setRunId(nextRunId);
    setStarted(true);
    setIsPausedSave(false);
    setCurrentCase(caseId);
    setCompletedCases(allPreviousCases);
    setNodeId(nextNodeId);
    setResources(initialResources);
    setLog([]);
    setTriggers(makeEmptyScores(triggerLabels));
    setCognition(makeEmptyScores(cognitionLabels));
    setProtocolUsed(false);
    setTimerPenaltyCount(0);
    setProbeUsed(false);
    setOpeningLegacy(null);
    setDecisionReveal(null);
    setPendingChoice(null);
    setFreeText("");
    setEcho(echoText);
    setShowErrorLog(false);
    setNodeEnteredAt(now);
    if (persistRun) {
      persist({
        runId: nextRunId,
        started: true,
        paused: false,
        currentCase: caseId,
        completedCases: allPreviousCases,
        nodeId: nextNodeId,
        resources: initialResources,
        log: [],
        triggers: makeEmptyScores(triggerLabels),
        cognition: makeEmptyScores(cognitionLabels),
        freeText: "",
        echo: echoText,
        protocolUsed: false,
        timerPenaltyCount: 0,
        probeUsed: false,
        openingLegacy: null,
        nodeEnteredAt: now,
      });
    }
  }

  function startDebugNode() {
    const selectedCaseId = debugCaseSelectRef.current?.value ?? debugCaseIdRef.current;
    const selectedNodeId = debugNodeSelectRef.current?.value ?? debugNodeIdRef.current;
    startAtNode(selectedCaseId, selectedNodeId);
  }

  function exportPlaytestLog({ includeDiagnostics = false } = {}) {
    const payload = buildPlaytestExport({
      includeDiagnostics,
      run: {
        currentCase,
        openingLegacy,
        completedCases,
        caseResults,
        resources,
        triggers,
        cognition,
        summary: result,
        fingerprint: decisionFingerprint,
        ledger: decisionLedger,
        counterfactuals: counterfactualReport,
        telemetryEnabled,
        dataConsent,
        sessionCode,
      },
      gameplay: {
        rank: resultRank,
        momentumScore,
        momentumTier,
        rhythmScore,
        cognitionScore,
        pressureAdaptScore,
        reflectionScore,
        consistencyScore,
        exploitPenalty,
        challengeClearCount,
        reducedRiskCount,
        currentChallengeStreak,
        freeTextCombo,
        riskPressure,
        riskTier,
        activeBonus,
        protocolUsed,
      },
      diagnostics: {
        playerName,
        playtestFeedback,
        log,
        sessionId,
        pendingTelemetry,
      },
    });
    const prefix = includeDiagnostics ? "trigger-diagnostic" : "trigger-summary";
    downloadJson(payload, `${prefix}-${Date.now()}.json`);
  }

  const { leaderboard, leaderboardStatus, leaderboardError } = useLeaderboard({
    showRanking,
    isOnline,
    localLeaderboardRows,
    localSeasonLeaderboardRow,
  });

  const { copySessionCode, copyDiagnosticTrace, copyReplayLink } = createClipboardActions({
    flashCopyStatus,
    sessionCode,
    buildReplaySeed: () => ({
      currentCase: fallbackCaseId,
      nodeId: resolvedNodeId,
      resources,
      log: routeTimeline.map((entry) => ({ nodeId: entry.nodeId, choiceId: entry.choiceId })),
    }),
  });

  const result = useMemo(() => {
    return createCaseSummary(triggers, cognition, log, {
      resources,
      schemaVersion: SAVE_SCHEMA_VERSION,
      includeLongestDecision: true,
    });
  }, [triggers, cognition, log, resources]);
  const endingVariant = useMemo(
    () => getEndingVariant({ resources, discoveredClues, log, ...getSeasonStrain(caseResults) }),
    [caseResults, discoveredClues, log, resources],
  );
  const latestChoiceFeedback = getChoiceOutcomeFeedback(log.at(-1));
  const endingPreview = getEndingPreview(endingVariant);
  const failureRecovery = getFailureRecovery(endingVariant, resources);
  const endingCause = getFailureCause(endingVariant, resources);
  const endingAtmosphere = getEndingAtmosphere(endingVariant.id);
  const originEndingVariant = getOriginEndingVariant(operatorOrigin, endingVariant.id);
  const aftermath = getAftermath(endingVariant.id, operatorOrigin);
  const playReport = getPlayReport(result, log);
  const telemetryDashboard = getTelemetryDashboardSnapshot({ errors: localErrorEntries, pending: pendingTelemetry, rankings: localRankingRows, caseResults });
  const authorityReview = getAuthorityReview(operatorProfile, authorityState.level, result);
  const rankingIntegrity = getRankingIntegrity({ runId, completedAt: result.completedAt ?? new Date().toISOString(), summary: result });
  const replayDiagnostics = getReplayDiagnostics({ runId, caseId: fallbackCaseId, nodeId: resolvedNodeId, choiceId: log.at(-1)?.choiceId, pending: pendingTelemetry.length });
  const rankingComparison = useMemo(() => getRankingComparison(result), [result]);
  const routeTimeline = useMemo(
    () => log
      .filter((entry) => entry && typeof entry === "object" && !entry.isSystemEvent)
      .map((entry, index) => ({ ...entry, index, marker: getRouteMarker(entry) })),
    [log],
  );
  const finalEndingEntry = [...log].reverse().find((entry) => entry.nodeId === "f_choice");
  const finalAftermathEntry = [...log].reverse().find((entry) => entry.nodeId === "f_aftershock");
  const outcomeNodeId = currentCase === "final" ? "f_aftershock" : `${currentCase}_aftershock`;
  const outcomeEntry = [...log].reverse().find((entry) => entry.nodeId === outcomeNodeId);
  const caseOutcome = getCaseOutcome({ caseId: currentCase, choiceId: outcomeEntry?.choiceId });
  const endingProfile = createEndingProfile({ finalEndingEntry });

  const routeLength = getCaseRouteLength(fallbackCaseId);
  const routeIndex = getNodeRouteIndex(fallbackCaseId, resolvedNodeId);
  const debugTrace = getTraceEvents();
  const silentFailureCount = debugTrace.filter((event) => event.kind === "error" && String(event.note ?? "").startsWith("silent-")).length;
  const progress = isResult
    ? 100
    : Math.round(((Math.max(0, routeIndex) + 1) / Math.max(1, routeLength)) * 100);
  const completedCaseResultList = createCompletedCaseResultList(caseResults);
  const seasonJourney = completedCaseResultList.map((caseItem) => ({
    ...caseItem,
    outcome: getCaseOutcome({ caseId: caseItem.id, choiceId: caseItem.result.outcomeChoiceId }),
    carryover: getOutcomeCarryover({ caseId: caseItem.id, choiceId: caseItem.result.outcomeChoiceId }),
  }));
  const resultBridge =
    result.longestDecision
      ? `${triggerLabels[result.primary[0]]} 압박이 가장 오래 남았고, "${result.longestDecision.title}"에서 판단 시간이 길어졌습니다.`
      : `${triggerLabels[result.primary[0]]} 압박이 다음 사건의 시작 조건으로 기록됩니다.`;
  const resultRank = gameplayRank;
  const rankingHeadline = getLeaderboardHeadline(leaderboard);
  const flowSurgeCount = log.filter((entry) => entry.flowSurge).length;
  const streakGoal = currentChallengeStreak < 3 ? 3 : 5;
  const streakRemaining = Math.max(0, streakGoal - currentChallengeStreak);
  const feedbackPrivacySignals = detectPrivacySignals(currentFeedback.comment);
  const activeFeedbackPrivacySignals = feedbackPrivacySignals.filter((signal) => signal.active);

  const { updateCurrentFeedback, anonymizeFeedbackComment, submitCurrentFeedback } = createFeedbackActions({
    currentCase,
    currentFeedback,
    playtestFeedback,
    setPlaytestFeedback,
    persist,
    activeFeedbackPrivacySignals,
    isSubmittingFeedback,
    setIsSubmittingFeedback,
    setFeedbackStatus,
    dataConsent,
    sessionId,
    sessionCode,
    activeCaseMeta,
    queueTelemetry,
  });
  const screenReaderStatus = isResult
    ? `${activeCaseMeta?.label ?? "현재 케이스"} 결과 화면입니다. 랭크 ${resultRank}, 버스트 ${momentumScore}점, 주요 트리거는 ${triggerLabels[result.primary[0]]}입니다.`
    : `${activeCaseMeta?.label ?? "현재 케이스"} ${node.title} 장면입니다. 진행률 ${progress}퍼센트, 챌린지는 ${sceneChallenge.title}, 위험 압력은 ${riskTier} ${riskPressure}입니다.`;
  const rankLine =
    resultRank === "S"
      ? "사고 리듬, 관점 전환, 압박 회복이 동시에 솟았습니다."
      : resultRank === "A"
        ? "정답을 고른 것이 아니라, 압박 속에서 판단 패턴이 선명하게 드러났습니다."
        : resultRank === "B"
          ? "사건은 통과했습니다. 다음 플레이에서는 다른 사고 방식으로 흔들어볼 여지가 있습니다."
          : "사건은 통과했지만 버스트 신호는 아직 약합니다. 즉답보다 근거, 비용, 회복 경로를 더 남겨보세요.";
  const scoreBreakdown = createScoreBreakdown({ cognitionScore, consistencyScore, exploitPenalty, pressureAdaptScore, reflectionScore, rhythmScore });
  const achievementBadges = createAchievementBadges({ challengeClearCount, currentChallengeStreak, flowSurgeCount, momentumScore, momentumTier, reducedRiskCount, result, riskTier });
  const feedbackPrompts = [
    `${result.longestDecision?.title ?? "가장 오래 머문 장면"}에서 실제로 멈칫한 이유가 있었나요?`,
    result.freeCount > 0
      ? "구조 재설계 입력이 선택지 밖의 계획처럼 느껴졌나요?"
      : "구조 재설계를 쓰지 않았다면, 기존 선택지가 충분히 답처럼 보였나요?",
    nextCaseSignal
      ? `${nextCaseSignal.title}로 넘어가고 싶은 이유가 생겼나요?`
      : "최종 선택이 트리거랩의 실험 구조와 자연스럽게 연결됐나요?",
  ];
  function getSceneLineType(line) {
    if (line.startsWith("'")) return "thought-line";
    if (line.startsWith('"')) return "spoken-line";
    return "narration-line";
  }

  function renderSceneLines(text) {
    return text.split("\n").map((line, index) => (
      <p className={getSceneLineType(line)} key={`${index}-${line.slice(0, 12)}`}>
        {line}
      </p>
    ));
  }

  function getEchoChecks(currentNode) {
    const memoChecks = (currentNode?.memo ?? []).slice(0, 2);
    const triggerCheck = currentNode?.triggers?.[0]
      ? `${triggerLabels[currentNode.triggers[0]]} 압박 때문에 생략한 근거가 있는지 확인`
      : "방금 판단에서 빠진 이해관계자 확인";
    return [...memoChecks, triggerCheck];
  }

  function trapDecisionRevealFocus(event) {
    if (event.key !== "Tab") return;
    const focusable = Array.from(
      decisionRevealRef.current?.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])") ?? [],
    ).filter((element) => !element.disabled);
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  const decisionRevealView = { decisionReveal, decisionRevealRef, trapDecisionRevealFocus, renderSceneLines, simplifyPlayerText, setDecisionReveal, resourceMeta };
  function renderDecisionReveal() {
    return <DecisionReveal view={decisionRevealView} />;
  }

  const recoveryNoticeView = { lastRecoveredError, started, pauseAfterRecovery, startFreshAfterRecovery, showErrorLog, setShowRecoveryCenter, setShowErrorLog, dismissRecoveryNotice };
  function renderRecoveryNotice() {
    return <RecoveryNotice view={recoveryNoticeView} />;
  }

  const saveStatusView = { saveStatus, retryStorageCleanup };
  function renderSaveStatus() {
    return <SaveStatus view={saveStatusView} />;
  }

  const errorLogPanelView = { showErrorLog, debugToolsEnabled, showRecoveryCenter, copyDiagnosticTrace, exportPlaytestLog, refreshLocalErrorLog, clearLocalErrorLog, closeRecoveryCenter, telemetryHealth, pendingTelemetry, telemetryRetryInfo, formatSaveTime, localErrorEntries, startAtNode, saveSlots, refreshSaveSlots, restoreSaveSlot, deleteSaveSlot };
  function renderErrorLogPanel() {
    return <ErrorLogPanel view={errorLogPanelView} />;
  }

  if (showRanking && !started) {
    return (
      <Suspense fallback={<main className="shell screen-loading" aria-busy="true" />}>
      <RankingScreen
        Music={AdaptiveMusic}
        gameTitle={GAME_TITLE}
        leaderboardStatus={leaderboardStatus}
        rankingHeadline={rankingHeadline}
        leaderboardError={leaderboardError}
        leaderboard={leaderboard}
        runId={runId}
        sessionCode={sessionCode}
        triggerLabels={triggerLabels}
        onClose={() => setShowRanking(false)}
      />
      </Suspense>
    );
  }
  const introView = createIntroViewModel({
    AdaptiveMusic,
    playerName, setPlayerName, playStyle, setPlayStyle, dataConsent, setDataConsent,
    operatorOrigin, setOperatorOrigin, sessionCode, isOnline,
    hasResumableSave, lastSavedAt, log, caseResults, completedCases, currentCase,
    newGamePlusUnlocked, newGamePlusMemory, nextParticipantMessage,
    startGame, startCase, startNewGamePlus, resumeSavedGame, persist, setShowRanking,
    setSaveStatus, setPendingTelemetry, setTelemetryStatus, pendingTelemetryRef,
    renderSaveStatus, renderRecoveryNotice, renderErrorLogPanel,
    // The graph is loaded by the time the runtime shows the intro, so it fills
    // in everything the pre-start shell has to leave out.
    runtime: {
      node, progress, seasonJourney, nodes, nodeOrders,
      showErrorLog, setShowErrorLog, unlockAllCasesForTest,
      debugCaseSelectRef, debugCaseId, debugCaseIdRef, debugNodeOptions,
      debugNodeId, debugNodeIdRef, debugNodeSelectRef,
      setDebugCaseId, setDebugNodeId, startDebugNode,
    },
  });
  if (!started) {
    return <Suspense fallback={<main className="shell screen-loading" aria-busy="true" />}><IntroScreen view={introView} /></Suspense>;
  }
  const resultView = createResultView(
    { AdaptiveMusic, musicModeKey, renderDecisionReveal, renderRecoveryNotice, renderErrorLogPanel, screenReaderStatus, currentCase, endingStep, endingTwistIndex, finalAftermathEntry, finalEndingEntry, caseResults, decisionFingerprint, observationLedger, observerPattern, endingProfile, endingVariant, advanceEndingStep, endingQuietReady, nextParticipantMessage, setNextParticipantMessage, saveNextParticipantMessage, unopenedRecordCount, unopenedClueCount, unopenedBranchCount, endingQuietLine, skipEndingQuietHold, GAME_TITLE, startCase, setStarted, setShowRanking, showSeasonMap, debugToolsEnabled, showErrorLog, setShowErrorLog, exportPlaytestLog, copyReplayLink, reset, playerName, activeCaseMeta, sceneTitleRef, triggerLabels, triggers, result, caseOutcome, resultRank, momentumTier, momentumScore, rankLine, scoreBreakdown, clamp, easyCognitionLabels, cognitionLabels, formatRiskDelta, counterfactualReport, sessionCode, telemetryStatus, pendingTelemetry, retryPendingTelemetry, scheduleTelemetryRetry, telemetryEnabled, dataConsent, isOnline, isRetryingTelemetry, copySessionCode, copyStatus, nextCaseSignal, resultBridge, achievementBadges, feedbackPrompts, currentFeedback, updateCurrentFeedback, FEEDBACK_COMMENT_MAX_LENGTH, activeFeedbackPrivacySignals, anonymizeFeedbackComment, submitCurrentFeedback, isSubmittingFeedback, feedbackStatus, routeTimeline, resourceMeta, explainResourceTradeoff, log, clueCount, clueHypotheses, renderSceneLines, operatorProfile, authorityState, latestChoiceFeedback, endingPreview },
    { chapterUiModel, endingSceneProfile: getEndingSceneProfile(endingVariant.id), endingVisualClass: getEndingVisualClass(endingVariant.id), failureObjectives: getFailureObjectives(endingVariant), delayedConsequences, rankingComparison, seasonGoals, balanceSignals, startRecoveryRoute, endingCause, authorityReview, endingAtmosphere, originEndingVariant, aftermath, rankingIntegrity, replayDiagnostics, playReport, endingEpilogue: getEndingEpilogue(endingVariant.id), failureRecovery, achievementProgress, operatorReveal, operationsSnapshot, telemetryDashboard },
  );
  if (isResult) {
    return <Suspense fallback={<main className="shell screen-loading" aria-busy="true" />}><ResultScreen view={resultView} /></Suspense>;
  }

  const playView = createPlayView(
    { suspenseState, AdaptiveMusic, musicModeKey, renderDecisionReveal, renderRecoveryNotice, renderErrorLogPanel, screenReaderStatus, simplifyPlayerText, caseObjectives, currentCase, node, triggerLabels, openingLegacy, operatorBriefs, chapterRules, relationshipScores, authorityState, pressureCascade, riskPressure, playGuideItems, sceneTitleRef, saveCurrentGame, reset, renderSaveStatus, progress, easyRiskLabels, riskTier, activeBonus, freeTextCombo, currentAverageResponseTime, log, observerPattern, clueCount, discoveredClues, currentChallengeStreak, momentumTier, streakGoal, streakRemaining, momentumScore, protocolUsed, isAdvancing, activateCrisisProtocol, decisionFingerprint, decisionLedger, resourceMeta, sceneChallenge, triggerLabSignals, narrativeSpine, questSteps, sceneVisuals, speakerProfile, speakerPortrait, latestFreeTextSuccess, resolvedNodeId, sceneDirection, latestBeat, renderSceneLines, setMemoOpened, echo, probeUsed, echoProbeCost, requestEchoProbe, getEchoChecks, pendingChoice, showTacticalDetails, setShowTacticalDetails, decisionForecasts, pressureLeader, previewChoice, evidenceCount, pendingChoiceRead, pendingChoiceForecast, commitConsoleRef, formatRiskDelta, formatForecastRisk, setPendingChoice, commitConfirmRef, choose, fixedChoices, getEffectiveChoiceRead, getRiskPressure, getChallengeMatch, choiceButtonsRef, handleChoiceClick, beginChoiceHold, endChoiceHold, speechifyChoice, getChoiceSubtext, getDramaticChoiceLabel, explainResourceTradeoff, easyCognitionLabels, cognitionLabels, freeChoice, boardChangePrompts, updateFreeText, freeText, FREE_TEXT_MAX_LENGTH, freeTextBlockedByPrivacy, activePrivacySignals, anonymizeFreeText, activeFreeTextSignalCount, freeTextPreview, applyEffect, resources, playerName, activePlayStyle, turnBriefItems, completedCases, activeCaseMeta, debugToolsEnabled, fallbackCaseId, routeIndex, routeLength, silentFailureCount, copyReplayLink, copyDiagnosticTrace, operatorProfile, latestChoiceFeedback },
    { clueHypotheses, chapterUiModel, relationshipQuest, relationshipGraph, autonomousSignal, timelineStamp, evidenceMetadata, hypothesisConflict, investigationTargets, investigateTarget, selectedInvestigationOutcome, evidenceContamination, hypothesisLockState, characterState, rivalResponse, evidenceRepairPuzzle, repairEvidence, rivalIntervention, counterRival, chapterTransitionBridge, operatorReveal, achievementProgress, resourceChain, midBoss, dynamicMusicLayers, characterMemory: getCharacterMemory(node?.speaker, log), evidenceCombinations, hypothesisActions, resolveHypothesisAction, delayedConsequences, playStyleUnlocks, interlude, balanceSignals, relationshipScene, pastRunMemory },
  );
  return <Suspense fallback={<main className="shell screen-loading" aria-busy="true" />}><PlayScreen view={playView} /></Suspense>;

}
