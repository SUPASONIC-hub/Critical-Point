import { lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  createRunId,
  debugToolsEnabled,
  DEBUG_RENDER_CRASH_KEY,
  ERROR_LOG_STORAGE_KEY,
  FEEDBACK_COMMENT_MAX_LENGTH,
  formatSaveTime,
  NEW_GAME_PLUS_KEY,
  NEW_GAME_PLUS_MEMORY_KEY,
  OPERATOR_ORIGIN_KEY,
  normalizeFeedback,
  normalizePlayerName,
  normalizeSavedText,
  parseErrorLog,
  parseRecoverySlots,
  readStoredValue,
  RECOVERY_CENTER_STORAGE_KEY,
  removeStoredValue,
  SAVE_SLOT_STORAGE_KEY,
  STORAGE_KEY,
  writeStoredValue,
} from "./appConfig.js";
import {
  CASE_RESULT_NODES,
  CASE_SEQUENCE,
  CASE_START_NODES,
  SEASON_ENTRY_CASE,
  SEASON_ENTRY_NODE,
  caseAftermathNodeId,
  caseOpeningRoutes,
  cognitionLabels,
  initialResources,
  nodeOrders,
  nodes,
  getContinuityMemoryChoice,
  getCaseRouteLength,
  getNodeRouteIndex,
  seasonCasesBase,
  triggerLabels,
} from "./gameData.js";
import {
  applyEffect,
  clamp,
  getCaseOutcome,
  getOutcomeCarryover,
  getContinuityChallenge,
  getSeasonWear,
  detectPrivacySignals,
  explainResourceTradeoff,
  makeEmptyScores,
} from "./gameLogic.js";
import {
  getSessionId,
  getSessionCode,
  checkTelemetryHealth,
  getTelemetryStats,
  telemetryEnabled,
} from "./telemetry.js";
import { getLeaderboardHeadline } from "./ranking.js";
import { easyCognitionLabels, simplifyPlayerText } from "./playerLanguage.js";
import { GAME_TITLE } from "./appCopy.js";
import { AdaptiveMusic } from "./components/AdaptiveMusic.jsx";
import { LazyScreen } from "./components/LazyScreen.jsx";
import { appendTraceEvent } from "./state/trace.js";
import { confirmAction } from "./state/confirmAction.js";
import { createOpeningResources } from "./state/openingState.js";
import { focusSceneTitle } from "./state/sceneFocus.js";
import { useGameSaveState } from "./state/useGameSave.js";
import { createChoiceReaders } from "./state/useDecision.js";
import { useChoiceCommit } from "./state/useChoiceCommit.js";
import { useRunReadout } from "./state/useRunReadout.js";
import { clearRunStorage, logStorageResetFailure } from "./state/runStorageReset.js";
import {
  normalizeRunState,
  openCaseRun,
  RUN_INITIAL_STATE,
  serializeRunState,
} from "./gauntlet/gauntletEngine.js";
import { useRelicTable } from "./gauntlet/useRelicTable.js";
import { useTelemetryQueue } from "./state/useTelemetryQueue.js";
import { useAppPersistence } from "./state/useAppPersistence.js";
import { useLocalRanking } from "./state/useLocalRanking.js";
import { useLeaderboard } from "./state/useLeaderboard.js";
import { useBoard } from "./state/useBoard.js";
import { buildPlaytestExport, downloadJson } from "./state/playtestExport.js";
import { createClipboardActions, useClipboardStatus } from "./state/useClipboardStatus.js";
import { createFeedbackActions, useFeedbackStatus } from "./state/useFeedback.js";
import { useEndingSequence } from "./state/useEndingSequence.js";
import { useStableEvent } from "./state/useStableEvent.js";
import { useCaseSystems } from "./state/useCaseSystems.js";
import { useResultReport } from "./state/useResultReport.js";
import { useRuntimeSavedState } from "./state/useRuntimeSavedState.js";
import { useWindowSuspension } from "./state/useWindowSuspension.js";
import { usePendingTelemetryRef, useRuntimeChoiceShortcuts, useRuntimeOverlayShortcuts } from "./state/useRuntimeShortcuts.js";
import { useOverlayScreens } from "./state/useOverlayScreens.js";
import { useRuntimeErrorCapture } from "./state/useRuntimeErrorCapture.js";
import { getEndingEpilogue } from "./featurePack.js";
import { resourceMeta } from "./appCopy.js";
import { caseIntroEchoes, legacyProfiles, nextCaseSignals } from "./caseCopy.js";
import { createPlayView, createResultView } from "./viewModels/appViewModels.js";
import { createIntroViewModel } from "./viewModels/introViewModel.js";
import { useRuntimeRenderers } from "./viewModels/runtimeRenderers.jsx";
import { createActiveBonus, createInheritedChallenge, createSceneChallenge, createSpeakerProfile } from "./viewModels/sceneViewModels.js";
import * as seasonViewModels from "./viewModels/seasonViewModels.js";
import {
  getEndingSceneProfile,
  getFailureObjectives,
  getEndingVisualClass,
  getOperatorProfile,
  getOperatorProfiles,
} from "./advancedSystems.js";
import { loadedChunk } from "./state/chunkReload.js";

const RankingScreen = lazy(() => import("./screens/RankingScreen.jsx").then(loadedChunk).then(({ RankingScreen }) => ({ default: RankingScreen })));
const BoardScreen = lazy(() => import("./screens/BoardScreen.jsx").then(loadedChunk).then(({ BoardScreen }) => ({ default: BoardScreen })));
const IntroScreen = lazy(() => import("./screens/IntroScreen.jsx").then(loadedChunk).then(({ IntroScreen }) => ({ default: IntroScreen })));
const ResultScreen = lazy(() => import("./screens/ResultScreen.jsx").then(loadedChunk).then(({ ResultScreen }) => ({ default: ResultScreen })));
const PlayScreen = lazy(() => import("./screens/PlayScreen.jsx").then(loadedChunk).then(({ PlayScreen }) => ({ default: PlayScreen })));
const nowMs = () => Date.now();
const renderNothing = () => null;

const speakerPortraits = {
  "한서윤": "/portrait-han-seoyun.webp",
  "반재욱": "/portrait-ban-jaeuk.webp",
  "도윤하": "/portrait-do-yunha.webp",
  "오진우": "/portrait-oh-jinwoo.webp",
  "에코": "/portrait-echo.webp",
};

const caseSequence = CASE_SEQUENCE;

// Save suppression has one owner, `AppContent`, which always passes both
// `onSuppressSaves` and `saveControls`. This file used to keep a second flag and
// a second pair of functions as defaults that no render path could reach.
export function GameRuntime({ onSuppressSaves, saveControls, initialStartState = null } = {}) {
  const persistSuppressed = useCallback(() => saveControls?.isSuppressed?.() ?? false, [saveControls]);

  const resumeRuntimeSaves = useCallback(() => {
    saveControls?.resume?.();
  }, [saveControls]);

  const { saved, recoverUnreadableSave } = useRuntimeSavedState(initialStartState);
  const sessionId = useMemo(() => getSessionId(), []);
  const sessionCode = useMemo(() => getSessionCode(sessionId), [sessionId]);
  const initialRunId = useMemo(() => saved?.runId || createRunId(), [saved?.runId]);

  const {
    runId, setRunId, playerName, setPlayerName, playStyle, setPlayStyle, openingLegacy, setOpeningLegacy,
    dataConsent, setDataConsent, started, setStarted, currentCase, setCurrentCase,
    completedCases, setCompletedCases, discoveredClues, setDiscoveredClues,
    caseResults, setCaseResults, playtestFeedback, setPlaytestFeedback, nodeId, setNodeId,
    resources, setResources, log, setLog, triggers, setTriggers, cognition, setCognition,
    lastSavedAt, setLastSavedAt, isPausedSave, setIsPausedSave,
    pendingTelemetry, setPendingTelemetry, protocolUsed, setProtocolUsed,
    timerPenaltyCount, setTimerPenaltyCount, probeUsed, setProbeUsed,
    investigatedTargets, setInvestigatedTargets, hypothesisDecisions, setHypothesisDecisions,
  } = useGameSaveState({
    saved,
    initialRunId,
    initialResources,
    triggerDefaults: makeEmptyScores(triggerLabels),
    cognitionDefaults: makeEmptyScores(cognitionLabels),
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
  const { copyStatus, flashCopyStatus } = useClipboardStatus();
  const { feedbackStatus, setFeedbackStatus, isSubmittingFeedback, setIsSubmittingFeedback } = useFeedbackStatus();
  const [saveStatus, setSaveStatus] = useState("");
  const [isRetryingTelemetry, setIsRetryingTelemetry] = useState(false);
  const { showRanking, showBoard, setShowRanking, setShowBoard } = useOverlayScreens();
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
  // Asked for by the last page (a reset that reloaded), or by a save that could not be read.
  const openOnRecovery = () => recoverUnreadableSave || readStoredValue(RECOVERY_CENTER_STORAGE_KEY, "") === "1";
  const [showRecoveryCenter, setShowRecoveryCenter] = useState(openOnRecovery);
  const [showErrorLog, setShowErrorLog] = useState(openOnRecovery);
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
    restoreSaveBackup,
  } = useAppPersistence({
    state: {
      runId, playerName, playStyle, openingLegacy, dataConsent, started, currentCase, completedCases,
      discoveredClues, caseResults, playtestFeedback, nodeId, resources, log, triggers, cognition,
      echo, nodeEnteredAt, protocolUsed, timerPenaltyCount, probeUsed,
      investigatedTargets, hypothesisDecisions, dynamics: serializeRunState(gauntletRun),
      isPausedSave, saveSlots,
    },
    refs: { pendingTelemetryRef },
    setters: {
      setRunId, setPlayerName, setStarted, setIsPausedSave, setCurrentCase, setCompletedCases,
      setDiscoveredClues, setCaseResults, setPlaytestFeedback, setResources, setLog, setTriggers,
      setCognition, setProtocolUsed, setTimerPenaltyCount, setProbeUsed, setInvestigatedTargets,
      setHypothesisDecisions, setOpeningLegacy, setDecisionReveal,
      setLastRecoveredError, setShowRecoveryCenter, setShowErrorLog, setNodeId,
      setNodeEnteredAt, setLastSavedAt, setSaveStatus, setLocalErrorEntries, setSaveSlots, setPendingTelemetry,
    },
    config: {
      normalizePlayerName, operatorOrigin, triggerLabels, cognitionLabels, makeEmptyScores,
      persistSuppressed, onSuppressSaves, onResumeSaves: resumeRuntimeSaves, formatSaveTime,
      debugErrorKey: DEBUG_RENDER_CRASH_KEY, createRunId,
      initialDynamics: RUN_INITIAL_STATE,
      resetDecisionDynamics: () => setGauntletRun(RUN_INITIAL_STATE),
      onStaleSave: () => setStaleSave(true),
    },
  });
  const persist = persistenceApi;

  const fallbackCaseId = seasonCasesBase.some((caseItem) => caseItem.id === currentCase)
    ? currentCase
    : SEASON_ENTRY_CASE;
  const operatorProfile = getOperatorProfile(operatorOrigin);
  function setOperatorOrigin(value) {
    const nextOrigin = getOperatorProfiles().some((profile) => profile.id === value) ? value : "courier";
    setOperatorOriginState(nextOrigin);
    writeStoredValue(OPERATOR_ORIGIN_KEY, nextOrigin);
  }
  const activeNodeOrder = nodeOrders[fallbackCaseId] ?? nodeOrders[SEASON_ENTRY_CASE];
  const debugNodeOptions = nodeOrders[debugCaseId] ?? nodeOrders.case05;
  const fallbackNodeId = activeNodeOrder[0] ?? SEASON_ENTRY_NODE;
  const resolvedNodeId = nodes[nodeId] ? nodeId : fallbackNodeId;
  const branchOpeningNodeIds = new Set([
    CASE_START_NODES[fallbackCaseId],
    ...Object.values(caseOpeningRoutes[fallbackCaseId] ?? {}),
  ]);
  const isOpeningNode = branchOpeningNodeIds.has(resolvedNodeId);
  const node = nodes[resolvedNodeId] ?? nodes[SEASON_ENTRY_NODE];
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
  const speakerPortrait = speakerPortraits[node?.speaker] ?? null; // unpainted speakers are drawn by SpeakerPortrait
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
  const {
    achievementProgress,
    authorityState,
    balanceSignals,
    casesOpened,
    clueCount,
    clueHypotheses,
    delayedConsequences,
    operationsSnapshot,
    operatorReveal,
    seasonGoals,
  } = useCaseSystems({
    caseId: fallbackCaseId,
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
  const {
    counterfactualReport,
    currentAverageResponseTime,
    decisionFingerprint,
    decisionLedger,
    endingQuietLine,
    gameplayStats,
    gauntletSeed,
    narrativeSpine,
    observationLedger,
    observerPattern,
    reframeEntries,
    riskPressure,
    riskTier,
    silentFailureCount,
    unopenedBranchCount,
    unopenedClueCount,
    unopenedRecordCount,
  } = useRunReadout({
    log,
    resources,
    triggers,
    cognition,
    node,
    currentCase,
    clueCount,
    seedBase: started && !isResult ? `${runId}:${gauntletRun.windowIndex}:${resolvedNodeId}` : null,
    debugTools: debugToolsEnabled,
  });
  const currentCaseReframeCount = reframeEntries.filter(
    (entry) => entry.caseId === fallbackCaseId,
  ).length;
  const aftermathNodeId = caseAftermathNodeId(fallbackCaseId);
  const adaptiveChoiceUnlocked = resolvedNodeId === aftermathNodeId && currentCaseReframeCount >= 2;
  // The card the scene was written to lead with, wherever the deal put it.
  const leadChoice = node?.choices?.find((choice) => choice.id === node.leadChoiceId) ?? node?.choices?.[0];
  const adaptiveChoice = useMemo(
    () =>
      adaptiveChoiceUnlocked
        ? {
            id: `${fallbackCaseId}_adaptive_reframe`,
            label: "앞서 다시 짠 판을 공개 기준으로 삼는다",
            effect: { legitimacy: 7, trust: 5, fatigue: 4 },
            next: leadChoice?.next ?? "result",
            cognition: { reframing: 2, persistence: 1 },
            adaptive: true,
            requiredAuthority: "FIELD ACCESS",
          }
        : null,
    [adaptiveChoiceUnlocked, fallbackCaseId, leadChoice?.next],
  );
  const speakerRelationship = log.reduce(
    (score, entry) => score + (entry.speaker === node?.speaker ? 8 : entry.speaker ? -1 : 0),
    0,
  );
  const continuityMemoryChoice = useMemo(
    () => getContinuityMemoryChoice({ caseId: fallbackCaseId, nodeId: resolvedNodeId, caseResults }),
    [caseResults, fallbackCaseId, resolvedNodeId],
  );
  const relationshipChoice = !isResult && log.length >= 2 && speakerRelationship >= 16 && leadChoice
    ? {
        id: `${fallbackCaseId}_relationship_bridge`,
        label: "관계의 증언을 먼저 확보한다",
        effect: { trust: 5, legitimacy: 2, fatigue: 2 },
        next: leadChoice.next,
        cognition: { inference: 1, reframing: 1 },
        branchId: "relationship-bridge",
        requiredAuthority: "FIELD ACCESS",
      }
    : null;
  const fixedChoices = [
    ...(node?.choices?.filter((choice) => choice.type !== "reframe") ?? []),
    ...(continuityMemoryChoice ? [continuityMemoryChoice] : []),
    ...(adaptiveChoice ? [adaptiveChoice] : []),
    ...(relationshipChoice ? [relationshipChoice] : []),
  ];
  const reframeChoice = node?.choices?.find((choice) => choice.type === "reframe");
  const {
    reframeCount: reframeCombo,
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
  } = gameplayStats;
  const activeBonus = createActiveBonus({ currentAverageResponseTime, currentChallengeStreak, reframeCombo, log });
  const inheritedChallenge = useMemo(
    () => createInheritedChallenge({ isOpeningNode, openingLegacy }),
    [isOpeningNode, openingLegacy],
  );
  const sceneChallenge = createSceneChallenge({ reframeChoice, reframeCombo, inheritedChallenge, node, riskPressure });
  const choiceReaders = createChoiceReaders({
    sceneChallenge,
    resources,
    log,
    riskPressure,
    discoveredClues,
    currentCase,
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
    (isPausedSave || Boolean(lastSavedAt && (log.length > 0 || completedCases.length > 0)));
  const localLeaderboardRows = useMemo(
    () => seasonViewModels.createLocalLeaderboardRows({ caseResults, localRankingRows, playerName, runId, seasonCasesBase, sessionCode }),
    [caseResults, localRankingRows, playerName, runId, sessionCode],
  );
  const nextCaseSignal = nextCaseSignals[currentCase];
  const resumeSavedGame = persistenceResumeSavedGame;
  const pauseAfterRecovery = persistencePauseAfterRecovery;
  const startFreshAfterRecovery = persistenceStartFreshAfterRecovery;
  // The page going away, coming back, or being hidden; see useWindowSuspension.
  // One write per event, carrying everything that event changed.
  const suspension = useWindowSuspension({
    started,
    active: started && !isResult && !staleSave,
    getRun: () => gauntletRun,
    commit: ({ run = null, pausedForMs = 0, paused } = {}) => {
      const patch = {};
      if (run) {
        setGauntletRun(run);
        patch.dynamics = serializeRunState(run);
      }
      if (pausedForMs > 0) {
        patch.nodeEnteredAt = nodeEnteredAt + pausedForMs;
        setNodeEnteredAt(patch.nodeEnteredAt);
      }
      if (paused && !persistSuppressed() && readStoredValue(STORAGE_KEY, null) !== null) patch.paused = true;
      if (Object.keys(patch).length > 0) persist(patch);
    },
    onPageShow: () => {
      setIsPausedSave(false);
      persist({ paused: false });
    },
  });
  // Leaving on purpose keeps the table as it stands. A window that has closed
  // and is still on its slam has not been handed to the runtime yet: leaving
  // then would drop the verdict and bring the hold back as a bust, so the
  // table has to settle first.
  function saveCurrentGame(options = {}) {
    if (options.exit && suspension.isSettling()) {
      setSaveStatus("판정이 끝나는 중입니다. 결과가 나온 뒤에 나갈 수 있습니다.");
      return null;
    }
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
  const { choose, isAdvancing, releaseAdvance } = useChoiceCommit({
    currentCase, fallbackCaseId, resolvedNodeId, node, resources, triggers, cognition, log,
    caseResults, completedCases, discoveredClues, gauntletRun, relicTable, riskPressure,
    sceneChallenge, nodeEnteredAt, currentCaseReframeCount, runId, sessionId, sessionCode,
    playerName, activeCaseMeta, dataConsent, staleSave, clueCount, casesOpened,
    readers: choiceReaders, persist, appendLocalRankingRow, queueTelemetry, setSaveStatus, setTelemetryStatus,
    onSeasonFinal: () => {
      setNewGamePlusUnlocked(true);
      writeStoredValue(NEW_GAME_PLUS_KEY, "true");
    },
    setters: {
      setGauntletRun, setResources, setTriggers, setCognition, setLog, setEcho, setNodeId,
      setCompletedCases, setCaseResults, setDiscoveredClues, setNodeEnteredAt, setDecisionReveal,
    },
  });
  const scheduleTelemetryRetryEvent = useStableEvent(scheduleTelemetryRetry);
  const refreshLocalErrorLogEvent = useStableEvent(refreshLocalErrorLog);
  const closeRecoveryCenterEvent = useStableEvent(closeRecoveryCenter);
  const saveCurrentGameEvent = useStableEvent(saveCurrentGame);
  const startCaseEvent = useStableEvent(startCase), openCaseEvent = useStableEvent(openCase);
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
  useRuntimeErrorCapture({ onRecovered: setLastRecoveredError, onLogged: refreshLocalErrorLogEvent });
  useRuntimeOverlayShortcuts({
    decisionReveal,
    setDecisionReveal,
    screenOpen: showRanking || showBoard,
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
    startCase: openCaseEvent,
    started,
  });
  useEffect(() => {
    if (decisionReveal) {
      hadDecisionRevealRef.current = true;
      return;
    }
    if (!hadDecisionRevealRef.current) return;
    hadDecisionRevealRef.current = false;
    // A commit whose next scene is the scene it left never re-runs the scene
    // effect below, so the reveal closing is what hands the table back.
    releaseAdvance();
    window.requestAnimationFrame(() => focusSceneTitle(sceneTitleRef));
  }, [decisionReveal, releaseAdvance]);

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

  function getScrollBehavior() {
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  }

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    // A commit sets the next scene and opens the reveal in one render. The
    // reveal is a modal that takes focus; the scene title behind it waits for
    // the reveal to close (the effect above) instead of stealing focus now.
    const revealOpen = Boolean(decisionReveal);
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: getScrollBehavior() });
      if (!revealOpen) focusSceneTitle(sceneTitleRef);
      releaseAdvance();
    });
    // Keyed on where the player is, not on the reveal: the reveal is read once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  /**
   * A case opened from the result page, by button or by key. Opening the one
   * that just closed starts it over and throws its record away, so that asks
   * first: `R` did it on one keypress, while the report was being read.
   */
  function openCase(caseId) {
    if (caseId === currentCase && !confirmAction("이 사건을 처음부터 다시 시작할까요? 방금 끝낸 판의 선택 기록은 지워집니다.")) return false;
    startCase(caseId);
    return true;
  }
  function startRecoveryRoute() {
    if (openCase(currentCase)) setSaveStatus("복구 루트로 다시 시작합니다. 이번 목표는 피해를 줄이고 기록을 보존하는 것입니다.");
  }
  function startCase(caseId) {
    const baseStartNode = CASE_START_NODES[caseId];
    const introEcho = caseIntroEchoes[caseId] ?? caseIntroEchoes[SEASON_ENTRY_CASE];
    const previousCaseId = caseSequence[caseSequence.indexOf(caseId) - 1];
    const previousResult = previousCaseId ? caseResults[previousCaseId] : null;
    const startNode = caseOpeningRoutes[caseId]?.[previousResult?.outcomeChoiceId] ?? baseStartNode;
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
    // What the season has worn down is added on top, as check:endings replays it.
    const openingEffect = { ...(baseLegacy?.effect ?? {}) };
    [carryoverEffect, getSeasonWear(caseId)].forEach((effect) => Object.entries(effect).forEach(([key, value]) => {
      openingEffect[key] = (openingEffect[key] ?? 0) + value;
    }));
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
    // The origin bonus is the run's opening hand, so it belongs to the season's
    // first case -- which is the 프롤로그 now, not 사건 01.
    const seasonOpening = caseId === SEASON_ENTRY_CASE && !previousResult;
    const openingResources = seasonOpening
      ? createOpeningResources(operatorOrigin)
      : previousResult ? applyEffect(initialResources, openingEffect) : initialResources;
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
    // A case that already has a summary is played again as practice for the table.
    const openingRun = openCaseRun(gauntletRun, { replayOf: caseResults[caseId] ?? null });
    setGauntletRun(openingRun);
    resetEndingSequence();
    setEcho(openingEcho);
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
      protocolUsed: false,
      timerPenaltyCount: 0,
      probeUsed: false,
      openingLegacy: legacy,
      echo: openingEcho,
      dynamics: serializeRunState(openingRun),
      nodeEnteredAt: nowMs(),
    });
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

  /** Another tab moved the run on: this tab stops writing and reloads what storage holds. */
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

  /**
   * The first touch on a window is saved before the window can be won or lost:
   * a reload that finds this seed still open settles it as a bust. Without it,
   * F5 during the bust slam put the player back at the same wall -- which the
   * slam had just printed.
   */
  function markWindowTouched(openSeed, cardId = null) {
    if (staleSave) return;
    // Touching a window is also the end of any suspension it was resumed from.
    const touchedRun = normalizeRunState({ ...gauntletRun, openSeed, openCardId: cardId, suspended: null });
    setGauntletRun(touchedRun);
    persist({ dynamics: serializeRunState(touchedRun) });
  }

  function reset() {
    if (
      typeof globalThis.confirm === "function" &&
      !globalThis.confirm("저장된 진행과 현재 플레이 기록을 모두 지울까요?")
    ) {
      return;
    }
    onSuppressSaves();
    const failedResetKeys = clearRunStorage();
    removeStoredValue(RECOVERY_CENTER_STORAGE_KEY);
    setPlayerName("");
    setOperatorOriginState("courier");
    removeStoredValue(OPERATOR_ORIGIN_KEY);
    setRunId(createRunId());
    setPlayStyle("instinct");
    setDataConsent(false);
    setStarted(false);
    setCurrentCase(SEASON_ENTRY_CASE);
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
    setNodeId(SEASON_ENTRY_NODE);
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
    const resetErrorLogSaved = failedResetKeys.length === 0
      || logStorageResetFailure({ source: "reset", failedStorageKeys: failedResetKeys, currentCase, nodeId });
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
    const failedKeys = clearRunStorage();
    if (failedKeys.length === 0) {
      setLocalErrorEntries([]);
      clearLocalRankingRows();
      setSaveSlots([]);
      setLastRecoveredError(null);
      setSaveStatus("브라우저 저장소 정리를 완료했습니다.");
      return;
    }
    const retryLogSaved = logStorageResetFailure({ source: "reset-retry", failedStorageKeys: failedKeys, currentCase, nodeId });
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
        reframeCombo,
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
  const board = useBoard({ showBoard, isOnline });

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
    achievementBadges,
    aftermath,
    authorityReview,
    caseOutcome,
    endingAtmosphere,
    endingCause,
    endingPreview,
    endingProfile,
    endingVariant,
    failureRecovery,
    feedbackPrompts,
    finalAftermathEntry,
    finalEndingEntry,
    latestChoiceFeedback,
    originEndingVariant,
    playReport,
    rankLine,
    rankingComparison,
    rankingIntegrity,
    replayDiagnostics,
    result,
    resultBridge,
    resultRank,
    routeTimeline,
    scoreBreakdown,
    seasonJourney,
    telemetryDashboard,
    telemetryStats,
  } = useResultReport({
    authorityState,
    caseResults,
    cognition,
    currentCase,
    discoveredClues,
    fallbackCaseId,
    gameplayStats,
    localErrorEntries,
    localRankingRows,
    log,
    nextCaseSignal,
    operatorOrigin,
    operatorProfile,
    pendingTelemetry,
    resolvedNodeId,
    resources,
    riskTier,
    runId,
    triggers,
  });

  const routeLength = getCaseRouteLength(fallbackCaseId);
  const routeIndex = getNodeRouteIndex(fallbackCaseId, resolvedNodeId);
  const progress = isResult
    ? 100
    : Math.round(((Math.max(0, routeIndex) + 1) / Math.max(1, routeLength)) * 100);
  const rankingHeadline = getLeaderboardHeadline(leaderboard);
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
    startAtNode: startAtNodeEvent, saveSlots, refreshSaveSlots, restoreSaveSlot, deleteSaveSlot, restoreSaveBackup,
  });

  if (showRanking && !started) {
    return (
      <LazyScreen quiet>
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
      </LazyScreen>
    );
  }

  if (showBoard && !started) {
    return (
      <LazyScreen quiet>
        <BoardScreen {...board} Music={AdaptiveMusic} gameTitle={GAME_TITLE} onClose={() => setShowBoard(false)} />
      </LazyScreen>
    );
  }
  const introView = createIntroViewModel({
    AdaptiveMusic,
    playerName, setPlayerName, playStyle, setPlayStyle, dataConsent, setDataConsent,
    operatorOrigin, setOperatorOrigin, sessionCode, isOnline,
    hasResumableSave, lastSavedAt, log, caseResults, completedCases, currentCase,
    newGamePlusUnlocked, newGamePlusMemory, nextParticipantMessage,
    startGame, startCase: startCaseEvent, startNewGamePlus, resumeSavedGame, persist, setShowRanking,
    setShowBoard,
    setSaveStatus, pendingTelemetry, setPendingTelemetry: replacePendingTelemetry, setTelemetryStatus,
    runtime: {
      node, progress, seasonJourney, nodes, nodeOrders,
      showErrorLog, setShowErrorLog, unlockAllCasesForTest,
      debugCaseId, debugNodeOptions, debugNodeId,
      setDebugCaseId, setDebugNodeId, startDebugNode,
    },
  });
  if (!started) {
    return <LazyScreen quiet><IntroScreen view={introView} renderers={{ renderSaveStatus, renderRecoveryNotice, renderErrorLogPanel }} /></LazyScreen>;
  }
  const resultView = createResultView(
    { AdaptiveMusic, musicModeKey, renderDecisionReveal: renderNothing, renderRecoveryNotice: renderNothing, renderErrorLogPanel: renderNothing, screenReaderStatus, currentCase, endingStep, endingTwistIndex, finalAftermathEntry, finalEndingEntry, caseResults, decisionFingerprint, observationLedger, observerPattern, endingProfile, endingVariant, advanceEndingStep, endingQuietReady, nextParticipantMessage, setNextParticipantMessage, saveNextParticipantMessage, unopenedRecordCount, unopenedClueCount, unopenedBranchCount, endingQuietLine, skipEndingQuietHold, GAME_TITLE, startCase: openCaseEvent, setStarted, setShowRanking, showSeasonMap, debugToolsEnabled, showErrorLog, setShowErrorLog, exportPlaytestLog: exportPlaytestLogEvent, copyReplayLink, reset: resetEvent, playerName, activeCaseMeta, sceneTitleRef: null, triggerLabels, triggers, result, caseOutcome, resultRank, momentumTier, momentumScore, rankLine, scoreBreakdown, clamp, easyCognitionLabels, cognitionLabels, formatRiskDelta, counterfactualReport, sessionCode, telemetryStatus, pendingTelemetry, retryPendingTelemetry, scheduleTelemetryRetry, telemetryEnabled, dataConsent, isOnline, isRetryingTelemetry, copySessionCode, copyStatus, nextCaseSignal, resultBridge, achievementBadges, feedbackPrompts, currentFeedback, updateCurrentFeedback, FEEDBACK_COMMENT_MAX_LENGTH, activeFeedbackPrivacySignals, anonymizeFeedbackComment, submitCurrentFeedback, isSubmittingFeedback, feedbackStatus, routeTimeline, resourceMeta, explainResourceTradeoff, log, clueCount, clueHypotheses, renderSceneLines, operatorProfile, authorityState, latestChoiceFeedback, endingPreview },
    { endingSceneProfile: getEndingSceneProfile(endingVariant.id), endingVisualClass: getEndingVisualClass(endingVariant.id), failureObjectives: getFailureObjectives(endingVariant), delayedConsequences, rankingComparison, seasonGoals, balanceSignals, startRecoveryRoute, endingCause, authorityReview, endingAtmosphere, originEndingVariant, aftermath, rankingIntegrity, replayDiagnostics, playReport, endingEpilogue: getEndingEpilogue(endingVariant.id), failureRecovery, achievementProgress, operatorReveal, operationsSnapshot, telemetryDashboard, telemetryStats },
  );
  if (isResult) {
    return <LazyScreen quiet><ResultScreen view={resultView} renderers={{ renderDecisionReveal, renderRecoveryNotice, renderErrorLogPanel }} sceneTitleRef={sceneTitleRef} /></LazyScreen>;
  }

  const playView = createPlayView({
    AdaptiveMusic, musicModeKey, renderDecisionReveal: renderNothing, renderRecoveryNotice: renderNothing, renderErrorLogPanel: renderNothing, renderSaveStatus: renderNothing,
    screenReaderStatus, simplifyPlayerText, currentCase, sceneTitleRef: null,
    node, speakerProfile, speakerPortrait, narrativeSpine, resolvedNodeId,
    gauntletRun, gauntletSeed, resolveGauntlet: renderNothing,
    isAdvancing, markWindowTouched: renderNothing, decisionRevealOpen: Boolean(decisionReveal), staleSave, reloadFromStorage: renderNothing,
    fixedChoices, clueCount, casesOpened, reframeChoice,
    resources, resourceMeta, progress, saveCurrentGame: renderNothing, reset: renderNothing, routeIndex, routeLength,
    debugToolsEnabled, fallbackCaseId, silentFailureCount, copyReplayLink: renderNothing, copyDiagnosticTrace: renderNothing,
  });
  return <LazyScreen quiet><PlayScreen view={playView} renderers={{ renderDecisionReveal, renderRecoveryNotice, renderErrorLogPanel, renderSaveStatus }} sceneTitleRef={sceneTitleRef} actions={{ saveCurrentGame, resolveGauntlet: resolveGauntletEvent, markWindowTouched, pickRelic, onSuspendable: suspension.recordSuspendable, reloadFromStorage, reset: resetEvent, copyReplayLink, copyDiagnosticTrace }} /></LazyScreen>;

}
