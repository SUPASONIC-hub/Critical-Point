import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  appendStoredErrorLog,
  createRunId,
  debugToolsEnabled,
  DEBUG_RENDER_CRASH_KEY,
  ERROR_LOG_STORAGE_KEY,
  FEEDBACK_COMMENT_MAX_LENGTH,
  formatSaveTime,
  NEW_GAME_PLUS_KEY,
  NEW_GAME_PLUS_MEMORY_KEY,
  OPERATOR_ORIGIN_KEY,
  FREE_TEXT_MAX_LENGTH,
  normalizeFeedback,
  normalizePlayerName,
  normalizeSavedText,
  parseErrorLog,
  parseRecoverySlots,
  readSettledWindowSeeds,
  readStoredValue,
  recordSettledWindowSeed,
  RECOVERY_CENTER_STORAGE_KEY,
  removeStoredValue,
  SAVE_SCHEMA_VERSION,
  SAVE_SLOT_STORAGE_KEY,
  STORAGE_KEY,
  writeStoredValue,
} from "./appConfig.js";
import {
  CASE_RESULT_NODES,
  CASE_SEQUENCE,
  CASE_START_NODES,
  caseObjectives,
  caseOpeningRoutes,
  cognitionLabels,
  freeTextRouteNodes,
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
  anonymizeSensitiveText,
  buildSceneBeat,
  clamp,
  createCaseSummary,
  getDecisionFingerprint,
  getDecisionLedger,
  getAllDiscoveryClueIds,
  getAuthorityGate,
  getEndingVariant,
  getCaseOutcome,
  getOutcomeCarryover,
  getContinuityChallenge,
  detectPrivacySignals,
  explainResourceTradeoff,
  getCounterfactualReport,
  getDramaticChoiceLabel,
  getEcho,
  getFreeTextSignals,
  getGameplayStats,
  getObservationLedger,
  getObserverPattern,
  getObserverTag,
  buildNarrativeSpine,
  getRiskPressure,
  getSuspenseEvent,
  getSuspenseState,
  limitText,
  makeEmptyScores,
  scoreFreeText,
} from "./gameLogic.js";
import {
  getSessionId,
  getSessionCode,
  saveCaseTelemetry,
  checkTelemetryHealth,
  getTelemetryStats,
  telemetryEnabled,
} from "./telemetry.js";
import { getLeaderboardHeadline } from "./ranking.js";
import { easyCognitionLabels, simplifyPlayerText } from "./playerLanguage.js";
import { GAME_TITLE } from "./appCopy.js";
import { AdaptiveMusic } from "./components/AdaptiveMusic.jsx";
import {
  appendTraceEvent,
  getTraceEvents,
} from "./state/trace.js";
import {
  recordAppError,
  reportSilentFailure,
} from "./state/savedState.js";
import { useGameSaveState } from "./state/useGameSave.js";
import { createChoiceReaders } from "./state/useDecision.js";
import {
  applyGauntletEffect,
  BUST_EFFECT,
  createRunSummary,
  normalizeRunState,
  openCaseRun,
  RUN_INITIAL_STATE,
  serializeRunState,
} from "./gauntlet/gauntletEngine.js";
import { useRelicTable } from "./gauntlet/useRelicTable.js";
import { useTelemetryQueue } from "./state/useTelemetryQueue.js";
import { useAppPersistence } from "./state/useAppPersistence.js";
import { LOCAL_RANKING_STORAGE_KEY, useLocalRanking } from "./state/useLocalRanking.js";
import { useLeaderboard } from "./state/useLeaderboard.js";
import { buildPlaytestExport, downloadJson } from "./state/playtestExport.js";
import { createClipboardActions, useClipboardStatus } from "./state/useClipboardStatus.js";
import { createFeedbackActions, useFeedbackStatus } from "./state/useFeedback.js";
import { useEndingSequence } from "./state/useEndingSequence.js";
import { useStableEvent } from "./state/useStableEvent.js";
import { useCaseSystems } from "./state/useCaseSystems.js";
import { getSeasonStrain, useResultReport } from "./state/useResultReport.js";
import { useRuntimeSavedState } from "./state/useRuntimeSavedState.js";
import { useWindowSuspension } from "./state/useWindowSuspension.js";
import { usePendingTelemetryRef, useRuntimeChoiceShortcuts, useRuntimeOverlayShortcuts } from "./state/useRuntimeShortcuts.js";
import { safeStringify } from "./state/diagnosticUtils.js";
import { getEndingEpilogue } from "./featurePack.js";
import {
  caseIntroEchoes,
  legacyProfiles,
  nextCaseSignals,
  chapterRules,
  resourceMeta,
} from "./appCopy.js";
import { createPlayView, createResultView } from "./viewModels/appViewModels.js";
import { createCompletedCaseResultList, createIntroViewModel } from "./viewModels/introViewModel.js";
import { useRuntimeRenderers } from "./viewModels/runtimeRenderers.jsx";
import { createActiveBonus, createInheritedChallenge, createSceneChallenge, createSpeakerProfile } from "./viewModels/sceneViewModels.js";
import { createAchievementBadges, createScoreBreakdown } from "./viewModels/reportViewModels.js";
import * as seasonViewModels from "./viewModels/seasonViewModels.js";
import {
  getEndingSceneProfile,
  getFailureObjectives,
  getEndingVisualClass,
  getOperatorProfile,
  getOperatorProfiles,
  getOriginStartEffects,
} from "./advancedSystems.js";

const RankingScreen = lazy(() => import("./screens/RankingScreen.jsx").then(({ RankingScreen }) => ({ default: RankingScreen })));
const IntroScreen = lazy(() => import("./screens/IntroScreen.jsx").then(({ IntroScreen }) => ({ default: IntroScreen })));
const ResultScreen = lazy(() => import("./screens/ResultScreen.jsx").then(({ ResultScreen }) => ({ default: ResultScreen })));
const PlayScreen = lazy(() => import("./screens/PlayScreen.jsx").then(({ PlayScreen }) => ({ default: PlayScreen })));
const nowMs = () => Date.now();
const renderNothing = () => null;

const speakerPortraits = {
  "한서윤": "/portrait-han-seoyun.webp",
  "반재욱": "/portrait-ban-jaeuk.webp",
  "도윤하": "/portrait-do-yunha.webp",
  "오진우": "/portrait-oh-jinwoo.webp",
  "에코": "/portrait-echo.webp",
};

let consoleErrorHookBusy = false;

// The error boundary and reportSilentFailure already write their own entries,
// so skip their console output instead of logging the same failure twice.
function isAlreadyRecordedConsoleError(text) {
  return text.startsWith("Critical Point render error") || text.includes("[silent:");
}

const caseSequence = CASE_SEQUENCE;

// Save suppression has one owner, `AppContent`, which always passes both
// `onSuppressSaves` and `saveControls`. This file used to keep a second flag and
// a second pair of functions as defaults that no render path could reach.
export function GameRuntime({ onSuppressSaves, saveControls, initialStartState = null } = {}) {
  const persistSuppressed = useCallback(() => saveControls?.isSuppressed?.() ?? false, [saveControls]);

  const resumeRuntimeSaves = useCallback(() => {
    saveControls?.resume?.();
  }, [saveControls]);

  const saved = useRuntimeSavedState(initialStartState);
  const sessionId = useMemo(() => getSessionId(), []);
  const sessionCode = useMemo(() => getSessionCode(sessionId), [sessionId]);
  const initialRunId = useMemo(() => saved?.runId || createRunId(), [saved?.runId]);

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
  const [decisionReveal, setDecisionReveal] = useState(null);
  // The run's gauntlet: pot, vault, and the rules the next window is dealt from.
  // Saved under `dynamics`, the key the save format already reserves for it.
  const [gauntletRun, setGauntletRun] = useState(() => normalizeRunState(saved?.dynamics));
  const relicTable = useRelicTable();
  // Set when this tab's run is older than the save: another tab moved on. The
  // tab stops -- no table, no writes -- until it reloads from storage.
  const [staleSave, setStaleSave] = useState(false);
  const [newGamePlusUnlocked, setNewGamePlusUnlocked] = useState(
    () => readStoredValue(NEW_GAME_PLUS_KEY, "false") === "true" || Boolean(saved?.caseResults?.final),
  );
  const [newGamePlusMemory, setNewGamePlusMemory] = useState(() => {
    try { return JSON.parse(readStoredValue(NEW_GAME_PLUS_MEMORY_KEY, "{}")) ?? {}; } catch { return {}; }
  });
  const [operatorOrigin, setOperatorOriginState] = useState(() => readStoredValue(OPERATOR_ORIGIN_KEY, "courier"));
  const [echo, setEcho] = useState(
    () => normalizeSavedText(saved?.echo) || "얼마나 똑똑한지는 묻지 않겠습니다. 대신 언제 생각을 멈추지 못하는지 보겠습니다.",
  );
  const [nodeEnteredAt, setNodeEnteredAt] = useState(() => saved?.nodeEnteredAt ?? nowMs());
  const [isAdvancing, setIsAdvancing] = useState(false);
  const { copyStatus, flashCopyStatus } = useClipboardStatus();
  const { feedbackStatus, setFeedbackStatus, isSubmittingFeedback, setIsSubmittingFeedback } = useFeedbackStatus();
  const [saveStatus, setSaveStatus] = useState("");
  const [isRetryingTelemetry, setIsRetryingTelemetry] = useState(false);
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
  const pendingTelemetryRef = usePendingTelemetryRef(saved);
  const telemetryRetryAttemptRef = useRef(0);
  const telemetryRetryTimerRef = useRef(null);
  const hadDecisionRevealRef = useRef(false);
  const decisionRevealRef = useRef(null);
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
      investigatedTargets, hypothesisDecisions, dynamics: serializeRunState(gauntletRun),
      isPausedSave, saveSlots,
    },
    refs: { pendingTelemetryRef },
    setters: {
      setRunId, setPlayerName, setStarted, setIsPausedSave, setCurrentCase, setCompletedCases,
      setDiscoveredClues, setCaseResults, setPlaytestFeedback, setResources, setLog, setTriggers,
      setCognition, setProtocolUsed, setTimerPenaltyCount, setProbeUsed, setInvestigatedTargets,
      setHypothesisDecisions, setOpeningLegacy, setDecisionReveal,
      setLastRecoveredError, setShowRecoveryCenter, setShowErrorLog, setFreeText, setNodeId,
      setNodeEnteredAt, setLastSavedAt, setSaveStatus, setLocalErrorEntries, setSaveSlots,
    },
    config: {
      normalizePlayerName, initialResources, triggerLabels, cognitionLabels, makeEmptyScores,
      persistSuppressed, onSuppressSaves, formatSaveTime,
      debugErrorKey: DEBUG_RENDER_CRASH_KEY, createRunId,
      initialDynamics: RUN_INITIAL_STATE,
      resetDecisionDynamics: () => setGauntletRun(RUN_INITIAL_STATE),
      onStaleSave: () => setStaleSave(true),
    },
  });
  const persist = persistenceApi;

  const fallbackCaseId = seasonCasesBase.some((caseItem) => caseItem.id === currentCase)
    ? currentCase
    : "case01";
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
  const localSeasonLeaderboardRow = useMemo(
    () =>
      caseResults.final && completedCases.includes("final")
        ? seasonViewModels.createSeasonLeaderboardRow({
            caseSummary: caseResults.final,
            completedCaseCount: completedCases.length,
            playerName,
            runId,
            sessionCode,
          })
        : null,
    [caseResults.final, completedCases, playerName, runId, sessionCode],
  );
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
  const continuityMemoryChoice = useMemo(
    () => getContinuityMemoryChoice({ caseId: fallbackCaseId, nodeId: resolvedNodeId, caseResults }),
    [caseResults, fallbackCaseId, resolvedNodeId],
  );
  const relationshipChoice = !isResult && log.length >= 2 && speakerRelationship >= 16 && node?.choices?.[0]
    ? {
        id: `${fallbackCaseId}_relationship_bridge`,
        label: "관계의 증언을 먼저 확보한다",
        effect: { trust: 5, legitimacy: 2, fatigue: 2 },
        next: node.choices[0].next,
        cognition: { inference: 1, reframing: 1 },
        branchId: "relationship-bridge",
        requiredAuthority: "FIELD ACCESS",
      }
    : null;
  const fixedChoices = [
    ...(node?.choices?.filter((choice) => choice.type !== "free") ?? []),
    ...(continuityMemoryChoice ? [continuityMemoryChoice] : []),
    ...(adaptiveChoice ? [adaptiveChoice] : []),
    ...(relationshipChoice ? [relationshipChoice] : []),
  ];
  const freeChoice = node?.choices?.find((choice) => choice.type === "free");
  const currentAverageResponseTime =
    log.length > 0
      ? Math.round(log.reduce((sum, entry) => sum + (entry.responseTimeSec ?? 0), 0) / log.length)
      : 0;
  const riskPressure = getRiskPressure(resources);
  const riskTier =
    riskPressure >= 60 ? "CRITICAL" : riskPressure >= 35 ? "UNSTABLE" : "CONTROLLED";
  const suspenseState = getSuspenseState({
    riskPressure,
    decisionSeconds: 45,
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
  const gameplayStats = getGameplayStats(log, riskPressure);
  const observationLedger = getObservationLedger(log);
  const observerPattern = getObserverPattern(log);
  const {
    achievementProgress,
    authorityState,
    balanceSignals,
    clueCount,
    clueHypotheses,
    delayedConsequences,
    operationsSnapshot,
    operatorReveal,
    seasonGoals,
  } = useCaseSystems({
    caseResults,
    completedCases,
    discoveredClues,
    localErrorEntries,
    localRankingRows,
    log,
    operatorOrigin,
    pendingTelemetry,
    resources,
  });
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
  const inheritedChallenge = useMemo(
    () => createInheritedChallenge({ isOpeningNode, openingLegacy }),
    [isOpeningNode, openingLegacy],
  );
  const sceneChallenge = createSceneChallenge({ freeChoice, freeTextCombo, inheritedChallenge, node, riskPressure });
  const {
    mergeEffects,
    getClueReveal,
    getEffectiveChoiceRead,
  } = createChoiceReaders({
    sceneChallenge,
    resources,
    log,
    riskPressure,
    discoveredClues,
    currentCase,
    freeText,
    currentChallengeStreak,
    resourceMeta,
  });

  const formatRiskDelta = (value) =>
    value > 0 ? `+${value}` : value < 0 ? `${value}` : "유지";

  const currentFeedback = normalizeFeedback(playtestFeedback[currentCase]);
  const firstRenderRef = useRef(true);
  const sceneTitleRef = useRef(null);
  const hasResumableSave =
    !started &&
    currentCase &&
    nodeId &&
    (isPausedSave || Boolean(saveStatus) || Boolean(lastSavedAt && (log.length > 0 || completedCases.length > 0)));
  const localLeaderboardRows = useMemo(
    () => seasonViewModels.createLocalLeaderboardRows({ caseResults, localRankingRows, playerName, runId, seasonCasesBase, sessionCode }),
    [caseResults, localRankingRows, playerName, runId, sessionCode],
  );
  const nextCaseSignal = nextCaseSignals[currentCase];
  const resumeSavedGame = persistenceResumeSavedGame;
  const pauseAfterRecovery = persistencePauseAfterRecovery;
  const startFreshAfterRecovery = persistenceStartFreshAfterRecovery;
  const suspension = useWindowSuspension({
    active: started && !isResult && !staleSave,
    getRun: () => gauntletRun,
    commitRun: (run) => {
      setGauntletRun(run);
      persist({ dynamics: serializeRunState(run) });
    },
  });
  // Leaving on purpose keeps the table as it stands; see useWindowSuspension.
  function saveCurrentGame(options = {}) {
    const suspendedRun = options.exit ? suspension.suspendNow() : null;
    if (!suspendedRun) return persistenceSaveCurrentGame(options);
    setGauntletRun(suspendedRun);
    return persistenceSaveCurrentGame({ ...options, dynamics: serializeRunState(suspendedRun) });
  }
  const refreshLocalErrorLog = persistenceRefreshLocalErrorLog;
  const refreshSaveSlots = persistenceRefreshSaveSlots;
  const dismissRecoveryNotice = persistenceDismissRecoveryNotice;
  const closeRecoveryCenter = persistenceCloseRecoveryCenter;
  const clearLocalErrorLog = persistenceClearLocalErrorLog;
  const deleteSaveSlot = persistenceDeleteSaveSlot;
  const restoreSaveSlot = persistenceRestoreSaveSlot;
  const { queueTelemetry, retryPendingTelemetry, scheduleTelemetryRetry } = useTelemetryQueue({
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
  const startCaseEvent = useStableEvent(startCase);
  const resolveGauntletEvent = useStableEvent(resolveGauntlet);
  const resetEvent = useStableEvent(reset), retryStorageCleanupEvent = useStableEvent(retryStorageCleanup);
  const startAtNodeEvent = useStableEvent(startAtNode), exportPlaytestLogEvent = useStableEvent(exportPlaytestLog);
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
  useRuntimeOverlayShortcuts({
    decisionReveal,
    setDecisionReveal,
    showRanking,
    setShowRanking,
    showErrorLog,
    closeRecoveryCenter: closeRecoveryCenterEvent,
  });
  useRuntimeChoiceShortcuts({
    currentCase,
    decisionReveal,
    isAdvancing,
    isResult,
    nextCaseSignal,
    saveCurrentGame: saveCurrentGameEvent,
    startCase: startCaseEvent,
    started,
  });
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
    const handleVisibilityChange = () => {
      if (document.hidden) {
        visibilityPauseRef.current ??= nowMs();
        return;
      }
      if (visibilityPauseRef.current === null) return;
      const pausedForMs = nowMs() - visibilityPauseRef.current;
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
    });
  }, [currentCase, isResult, nodeId, started]);

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
    startCaseEvent(currentCase);
  }
  function startCase(caseId) {
    const baseStartNode = CASE_START_NODES[caseId];
    const introEcho = caseIntroEchoes[caseId] ?? caseIntroEchoes.case01;
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
    // A closed case keeps its REBOOT board and its relic draft; an abandoned one forfeits its pot.
    const openingRun = openCaseRun(gauntletRun);
    setGauntletRun(openingRun);
    resetEndingSequence();
    setEcho(openingEcho);
    setFreeText("");
    setNodeEnteredAt(nowMs());
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
      dynamics: serializeRunState(openingRun),
      nodeEnteredAt: nowMs(),
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

  function buildCaseSummary(nextTriggers, nextCognition, nextLog, nextResources = resources) {
    return createCaseSummary(nextTriggers, nextCognition, nextLog, {
      resources: nextResources,
      schemaVersion: SAVE_SCHEMA_VERSION,
    });
  }


  function getFreeTextBranchTarget(caseId, fromNodeId) {
    const dramaticRoute = freeTextRouteNodes[caseId];
    if (dramaticRoute && fromNodeId !== dramaticRoute && nodes[dramaticRoute]) {
      return dramaticRoute;
    }
    const branch = getCaseBranchNodes().find((item) => item.caseId === caseId);
    if (!branch || branch.nodeId === fromNodeId) return null;
    return branch.detourIds[0] ?? branch.nextIds[0] ?? null;
  }

  /**
   * The table closed a window: settle it. `closedWindow` is the stage's final
   * window -- cashed or bust -- and the verdict it produces is the only thing
   * that prices the card. There are no side bonuses stacked on top: what the
   * player sees on the table is what the resources receive.
   */
  function resolveGauntlet({ card, window: closedWindow, forced = false }) {
    if (!card) return;
    choose(card, closedWindow, forced);
  }

  /**
   * The first touch on a window is saved before the window can be won or lost:
   * a reload that finds this seed still open settles it as a bust. Without it,
   * F5 during the bust slam put the player back at the same wall -- which the
   * slam had just printed.
   */
  function reloadFromStorage() {
    onSuppressSaves();
    window.location.reload();
  }

  /** The relic a closed case drafted, or null to pass. The board on the table is re-dealt with it. */
  function pickRelic(relicId = null) {
    if (staleSave) return;
    const pickedRun = relicTable.equip(gauntletRun, relicId);
    setGauntletRun(pickedRun);
    persist({ dynamics: serializeRunState(pickedRun) });
  }

  function markWindowTouched(openSeed, cardId = null) {
    if (staleSave) return;
    // Touching a window is also the end of any suspension it was resumed from.
    const touchedRun = normalizeRunState({ ...gauntletRun, openSeed, openCardId: cardId, suspended: null });
    setGauntletRun(touchedRun);
    persist({ dynamics: serializeRunState(touchedRun) });
  }

  /**
   * What a bust costs the story, not just the score. The room does not wait for
   * an analyst who blew up: the scene the card led to plays out without them,
   * and the table deals the one after it. Never onto a result -- a bust does not
   * close a case -- and never off the authored graph.
   */
  function getBlackoutSkip(fromNodeId) {
    const skippedNode = nodes[fromNodeId];
    if (!skippedNode || Object.values(CASE_RESULT_NODES).includes(fromNodeId)) return null;
    const onward = skippedNode.choices?.find((candidate) => candidate.type !== "free")?.next;
    if (!onward || !nodes[onward] || Object.values(CASE_RESULT_NODES).includes(onward)) return null;
    return { nodeId: onward, skippedNodeId: fromNodeId, skippedTitle: skippedNode.title };
  }

  function choose(choice, closedWindow = null, forced = false) {
    if (isAdvancing || staleSave) return;
    const authorityGate = getAuthorityGate(choice, { clueCount, trust: resources.trust, legitimacy: resources.legitimacy });
    if (!authorityGate.unlocked && !forced) {
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
    const windowState = closedWindow ?? { status: "cashed", cause: "cash", gauge: 0, wall: 0, pushes: 0, elapsed: 0 };
    const responseTimeSec = Math.max(1, Math.round(Number(windowState.elapsed) || (nowMs() - nodeEnteredAt) / 1000));
    const free = choice.type === "free";
    const freeResult = free ? scoreFreeText(freeText) : null;
    const submittedFreeText = free ? freeText.trim() : "";
    const submittedSignals = free ? getFreeTextSignals(submittedFreeText) : [];
    const submittedSignalCount = submittedSignals.filter((signal) => signal.active).length;
    const submittedPrivacySignals = free ? detectPrivacySignals(submittedFreeText) : [];
    const freeTextSuccess =
      free &&
      windowState.status === "cashed" &&
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
      finalRiskDelta: challengeRiskDelta,
    } = getEffectiveChoiceRead(choice, baseEffect, cognitiveEffect);

    const previousCaseId = caseSequence[caseSequence.indexOf(currentCase) - 1];
    const branchBypass = getBranchDetourBypass(choice, {
      resources,
      previousOutcomeChoiceId: previousCaseId ? caseResults[previousCaseId]?.outcomeChoiceId : undefined,
    });
    const plannedNode = freeTextBranchTarget ?? branchBypass ?? choice.next;
    const blackoutSkip = windowState.status === "bust" ? getBlackoutSkip(plannedNode) : null;
    const nextNode = blackoutSkip?.nodeId ?? plannedNode;
    const caseClosed = CASE_RESULT_NODES[currentCase] === nextNode;
    const { verdict, nextRun, unlockedRelics } = relicTable.settle({ run: gauntletRun, window: windowState, card: choice, caseClosed, offerRelics: currentCase !== "final" });
    if (windowState.seed) recordSettledWindowSeed(windowState.seed);
    const busted = verdict.outcome === "bust";

    const gauntletEffect = applyGauntletEffect(baseEffect, {
      outcome: verdict.outcome,
      gauge: verdict.gauge,
      fracturedAxis: verdict.fracturedAxis,
      fractureRate: verdict.fractureRate,
      focusMultiplier: verdict.focus?.resourceMultiplier,
    });
    const clue = busted ? null : getClueReveal(challengeMatch, challengeRiskDelta, responseTimeSec, freeTextSuccess);
    const clueReward = clue
      ? { label: "EVIDENCE BONUS", text: "숨은 단서를 확보했다.", effect: { legitimacy: 2, fatigue: -1 } }
      : null;
    const finalEffect = mergeEffects(gauntletEffect, clueReward?.effect ?? {}, busted ? BUST_EFFECT : {});
    const finalResources = applyEffect(resources, finalEffect);
    const nextDiscoveredClues = clue ? [...discoveredClues, clue] : discoveredClues;
    const suspenseEvent = getSuspenseEvent({
      riskBefore: riskPressure,
      riskAfter: getRiskPressure(finalResources),
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
      continuityMemory: Boolean(choice.continuityMemory),
      routeChangeKind: choice.continuityMemory
        ? "memory"
        : String(choice.id ?? "").includes("evidence_turn")
          ? "evidence-turn"
          : freeTextBranchTarget
            ? "free-text"
            : blackoutSkip
              ? "blackout-skip"
              : undefined,
      skippedNodeId: blackoutSkip?.skippedNodeId,
      effect: finalEffect,
      riskRewardEffect: gauntletEffect,
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
      flowSurge: null,
      tempoBonus: verdict.tempo.groovePot > 0
        ? { label: "GROOVE", text: `박자 ${verdict.tempo.hits}회 · 최고 콤보 ${verdict.tempo.maxCombo} · 판돈 +${verdict.tempo.groovePot}` }
        : verdict.focus?.charge > 0
          ? { label: "FOCUS", text: `LOCK ${verdict.focus.charge} · 보상 ${verdict.focus.potMultiplier}x · 자원 ${verdict.focus.resourceMultiplier}x` }
          : null,
      clueReward,
      threshold: {
        state: busted ? "bust" : "cash",
        busted,
        cause: verdict.cause,
        forced,
        gauge: verdict.gauge,
        wall: verdict.wall,
        pushes: verdict.pushes,
        rewardMultiplier: busted ? 1 : verdict.resourceMultiplier * (verdict.focus?.resourceMultiplier ?? 1),
        potMultiplier: verdict.multiplier,
        pot: verdict.pot,
        lostPot: verdict.lostPot,
        tempo: verdict.tempo,
        focus: verdict.focus,
      },
      environmentMode: verdict.nextMutations.map((mutation) => mutation.id).join("+") || "stable",
      suspenseEvent,
      clue,
      note: freeResult?.note ?? "",
      responseTimeSec,
      resourcesBefore: resources,
      resourcesAfter: finalResources,
    };
    const entry = {
      ...entryBase,
      observerTag: getObserverTag(entryBase),
    };

    const nextLog = [...log, entry];
    const safeQuote = freeTextSuccess ? limitText(submittedFreeText, 140) : "";
    const nextEcho = safeQuote
      ? `${entry.echo} 다음 장면은 당신이 남긴 문장 “${safeQuote}”을 기준으로 이어집니다.`
      : entry.echo;
    appendTraceEvent({
      kind: "choose",
      caseId: currentCase,
      nodeId: resolvedNodeId,
      choiceId: choice.id,
      nextNodeId: nextNode,
      logLength: nextLog.length,
      resources: finalResources,
    });
    const nextCompletedCases = caseClosed
      ? Array.from(new Set([...completedCases, currentCase]))
      : completedCases;
    const completedNow = nextCompletedCases !== completedCases;
    const caseSummaryDraft = completedNow
      ? buildCaseSummary(nextTriggers, nextCognition, nextLog, finalResources)
      : null;
    const caseSummary = completedNow
      ? {
          ...caseSummaryDraft,
          endingVariant: getEndingVariant({
            resources: finalResources,
            discoveredClues: nextDiscoveredClues,
            log: nextLog,
            ...getSeasonStrain(caseResults, caseSummaryDraft),
          }),
          gauntlet: createRunSummary(nextRun),
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
          resources: finalResources,
          triggers: nextTriggers,
          cognition: nextCognition,
          decision_log: nextLog,
          dynamics: { ...createRunSummary(nextRun), responseTimeSec },
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
              id: `case-${currentCase}-${nowMs()}`,
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
      const seasonTelemetryPayload = seasonViewModels.createSeasonTelemetryPayload({
        caseSummary,
        completedCaseCount: nextCompletedCases.length,
        cognition: nextCognition,
        decisionLog: nextLog,
        resources: finalResources,
        runId,
        sessionCode,
        sessionId,
        triggers: nextTriggers,
      });
      const seasonLocalRankingRow = seasonViewModels.createSeasonLeaderboardRow({
        caseSummary,
        completedCaseCount: nextCompletedCases.length,
        playerName,
        runId,
        sessionCode,
      });
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

    setGauntletRun(nextRun);
    setResources(finalResources);
    setTriggers(nextTriggers);
    setCognition(nextCognition);
    setLog(nextLog);
    setEcho(nextEcho);
    setFreeText("");
    setNodeId(nextNode);
    setCompletedCases(nextCompletedCases);
    setCaseResults(nextCaseResults);
    setDiscoveredClues(nextDiscoveredClues);
    setNodeEnteredAt(nowMs());
    setDecisionReveal({
      verdict,
      forced,
      caseClosed,
      runPot: nextRun.runPot,
      vault: nextRun.vault,
      spokenChoice: entry.spokenChoice,
      beat: entry.sceneBeat,
      effect: finalEffect,
      clue,
      skippedTitle: blackoutSkip?.skippedTitle ?? null,
      nextTitle: nodes[nextNode]?.title ?? "결과 화면",
      nextNode,
      unlockedRelics,
    });
    persist({
      resources: finalResources,
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
      dynamics: serializeRunState(nextRun),
      nodeEnteredAt: nowMs(),
    });
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
    replacePendingTelemetry([]);
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
    setGauntletRun(RUN_INITIAL_STATE);
    setEcho("얼마나 똑똑한지는 묻지 않겠습니다. 대신 언제 생각을 멈추지 못하는지 보겠습니다.");
    setFreeText("");
    let resetErrorLogSaved = true;
    if (failedResetKeys.length > 0) {
      resetErrorLogSaved = appendStoredErrorLog({
        id: `reset-failed-${nowMs()}`,
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
    setNodeEnteredAt(nowMs());
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
      id: `reset-retry-failed-${nowMs()}`,
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
    const allPlayableCases = CASE_SEQUENCE.filter((caseId) => caseId !== "final");
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
    const now = nowMs();
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
    setGauntletRun(RUN_INITIAL_STATE);
    setOpeningLegacy(null);
    setDecisionReveal(null);
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
        dynamics: serializeRunState(RUN_INITIAL_STATE),
        nodeEnteredAt: now,
      });
    }
  }

  function replacePendingTelemetry(queue) {
    pendingTelemetryRef.current = queue;
    setPendingTelemetry(queue);
  }

  function startDebugNode() {
    startAtNode(debugCaseId, debugNodeId);
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
        telemetryStats: getTelemetryStats(),
      },
    });
    const prefix = includeDiagnostics ? "trigger-diagnostic" : "trigger-summary";
    downloadJson(payload, `${prefix}-${nowMs()}.json`);
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

  const {
    aftermath,
    authorityReview,
    caseOutcome,
    endingAtmosphere,
    endingCause,
    endingPreview,
    endingProfile,
    endingVariant,
    failureRecovery,
    finalAftermathEntry,
    finalEndingEntry,
    latestChoiceFeedback,
    originEndingVariant,
    playReport,
    rankingComparison,
    rankingIntegrity,
    replayDiagnostics,
    result,
    routeTimeline,
    telemetryDashboard,
    telemetryStats,
  } = useResultReport({
    authorityState,
    caseResults,
    cognition,
    currentCase,
    discoveredClues,
    fallbackCaseId,
    localErrorEntries,
    localRankingRows,
    log,
    operatorOrigin,
    operatorProfile,
    pendingTelemetry,
    resolvedNodeId,
    resources,
    runId,
    triggers,
  });

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

  const {
    renderSceneLines,
    renderDecisionReveal,
    renderRecoveryNotice,
    renderSaveStatus,
    renderErrorLogPanel,
  } = useRuntimeRenderers({
    decisionReveal, decisionRevealRef, trapDecisionRevealFocus, simplifyPlayerText, setDecisionReveal, resourceMeta,
    lastRecoveredError, started, pauseAfterRecovery, startFreshAfterRecovery, showRecoveryCenter, showErrorLog,
    setShowRecoveryCenter, setShowErrorLog, dismissRecoveryNotice, saveStatus, retryStorageCleanup: retryStorageCleanupEvent,
    debugToolsEnabled, copyDiagnosticTrace, exportPlaytestLog: exportPlaytestLogEvent, refreshLocalErrorLog, clearLocalErrorLog,
    closeRecoveryCenter, telemetryHealth, pendingTelemetry, telemetryRetryInfo, formatSaveTime, localErrorEntries,
    startAtNode: startAtNodeEvent, saveSlots, refreshSaveSlots, restoreSaveSlot, deleteSaveSlot,
  });

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
    startGame, startCase: startCaseEvent, startNewGamePlus, resumeSavedGame, persist, setShowRanking,
    setSaveStatus, pendingTelemetry, setPendingTelemetry: replacePendingTelemetry, setTelemetryStatus,
    runtime: {
      node, progress, seasonJourney, nodes, nodeOrders,
      showErrorLog, setShowErrorLog, unlockAllCasesForTest,
      debugCaseId, debugNodeOptions, debugNodeId,
      setDebugCaseId, setDebugNodeId, startDebugNode,
    },
  });
  if (!started) {
    return <Suspense fallback={<main className="shell screen-loading" aria-busy="true" />}><IntroScreen view={introView} renderers={{ renderSaveStatus, renderRecoveryNotice, renderErrorLogPanel }} /></Suspense>;
  }
  const resultView = createResultView(
    { AdaptiveMusic, musicModeKey, renderDecisionReveal: renderNothing, renderRecoveryNotice: renderNothing, renderErrorLogPanel: renderNothing, screenReaderStatus, currentCase, endingStep, endingTwistIndex, finalAftermathEntry, finalEndingEntry, caseResults, decisionFingerprint, observationLedger, observerPattern, endingProfile, endingVariant, advanceEndingStep, endingQuietReady, nextParticipantMessage, setNextParticipantMessage, saveNextParticipantMessage, unopenedRecordCount, unopenedClueCount, unopenedBranchCount, endingQuietLine, skipEndingQuietHold, GAME_TITLE, startCase: startCaseEvent, setStarted, setShowRanking, showSeasonMap, debugToolsEnabled, showErrorLog, setShowErrorLog, exportPlaytestLog: exportPlaytestLogEvent, copyReplayLink, reset: resetEvent, playerName, activeCaseMeta, sceneTitleRef: null, triggerLabels, triggers, result, caseOutcome, resultRank, momentumTier, momentumScore, rankLine, scoreBreakdown, clamp, easyCognitionLabels, cognitionLabels, formatRiskDelta, counterfactualReport, sessionCode, telemetryStatus, pendingTelemetry, retryPendingTelemetry, scheduleTelemetryRetry, telemetryEnabled, dataConsent, isOnline, isRetryingTelemetry, copySessionCode, copyStatus, nextCaseSignal, resultBridge, achievementBadges, feedbackPrompts, currentFeedback, updateCurrentFeedback, FEEDBACK_COMMENT_MAX_LENGTH, activeFeedbackPrivacySignals, anonymizeFeedbackComment, submitCurrentFeedback, isSubmittingFeedback, feedbackStatus, routeTimeline, resourceMeta, explainResourceTradeoff, log, clueCount, clueHypotheses, renderSceneLines, operatorProfile, authorityState, latestChoiceFeedback, endingPreview },
    { endingSceneProfile: getEndingSceneProfile(endingVariant.id), endingVisualClass: getEndingVisualClass(endingVariant.id), failureObjectives: getFailureObjectives(endingVariant), delayedConsequences, rankingComparison, seasonGoals, balanceSignals, startRecoveryRoute, endingCause, authorityReview, endingAtmosphere, originEndingVariant, aftermath, rankingIntegrity, replayDiagnostics, playReport, endingEpilogue: getEndingEpilogue(endingVariant.id), failureRecovery, achievementProgress, operatorReveal, operationsSnapshot, telemetryDashboard, telemetryStats },
  );
  if (isResult) {
    return <Suspense fallback={<main className="shell screen-loading" aria-busy="true" />}><ResultScreen view={resultView} renderers={{ renderDecisionReveal, renderRecoveryNotice, renderErrorLogPanel }} sceneTitleRef={sceneTitleRef} /></Suspense>;
  }

  // A window already settled under this seed -- a rolled-back save brought it
  // back -- is dealt again under a fresh draw, so its seen wall is not its wall.
  function dealGauntletSeed(baseSeed) {
    const settled = new Set(readSettledWindowSeeds());
    let seed = baseSeed;
    for (let redeal = 1; settled.has(seed) && redeal < 50; redeal += 1) seed = `${baseSeed}~${redeal}`;
    return seed;
  }
  const playView = createPlayView({
    AdaptiveMusic, musicModeKey, renderDecisionReveal: renderNothing, renderRecoveryNotice: renderNothing, renderErrorLogPanel: renderNothing, renderSaveStatus: renderNothing,
    screenReaderStatus, simplifyPlayerText, currentCase, sceneTitleRef: null,
    node, speakerProfile, speakerPortrait, narrativeSpine, resolvedNodeId,
    gauntletRun, gauntletSeed: dealGauntletSeed(`${runId}:${gauntletRun.windowIndex}:${resolvedNodeId}`), resolveGauntlet: renderNothing,
    isAdvancing, markWindowTouched: renderNothing, decisionRevealOpen: Boolean(decisionReveal), staleSave, reloadFromStorage: renderNothing,
    fixedChoices, clueCount,
    freeChoice, freeText, updateFreeText: renderNothing, FREE_TEXT_MAX_LENGTH, freeTextBlockedByPrivacy, activePrivacySignals,
    anonymizeFreeText: renderNothing,
    resources, resourceMeta, progress, saveCurrentGame: renderNothing, reset: renderNothing, routeIndex, routeLength,
    debugToolsEnabled, fallbackCaseId, silentFailureCount, copyReplayLink: renderNothing, copyDiagnosticTrace: renderNothing,
  });
  return <Suspense fallback={<main className="shell screen-loading" aria-busy="true" />}><PlayScreen view={playView} renderers={{ renderDecisionReveal, renderRecoveryNotice, renderErrorLogPanel, renderSaveStatus }} sceneTitleRef={sceneTitleRef} actions={{ saveCurrentGame, resolveGauntlet: resolveGauntletEvent, markWindowTouched, pickRelic, onSuspendable: suspension.recordSuspendable, reloadFromStorage, updateFreeText, anonymizeFreeText, reset: resetEvent, copyReplayLink, copyDiagnosticTrace }} /></Suspense>;

}
