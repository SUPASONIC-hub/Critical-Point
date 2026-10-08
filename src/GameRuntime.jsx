import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  createRunId,
  debugToolsEnabled,
  DEBUG_RENDER_CRASH_KEY,
  ERROR_LOG_STORAGE_KEY,
  FEEDBACK_COMMENT_MAX_LENGTH,
  formatSaveTime,
  OPERATOR_ORIGIN_KEY,
  normalizeFeedback,
  parseErrorLog,
  parseRecoverySlots,
  readStoredValue,
  RECOVERY_CENTER_STORAGE_KEY,
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
  nodeOrders,
  nodes,
  getContinuityMemoryChoice,
  getCaseRouteLength,
  getNodeRouteIndex,
  seasonCasesBase,
  triggerLabels,
} from "./gameData.js";
import {
  clamp,
  getLeadChoice,
  detectPrivacySignals,
  explainResourceTradeoff,
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
import { confirmAction } from "./state/confirmAction.js";
import { focusSceneTitle } from "./state/sceneFocus.js";
import { useRunState } from "./state/useRunState.js";
import { createChoiceReaders } from "./state/useDecision.js";
import { useChoiceCommit } from "./state/useChoiceCommit.js";
import { useRunReadout } from "./state/useRunReadout.js";
import { clearRunStorage, logStorageResetFailure } from "./state/runStorageReset.js";
import {
  normalizeRunState,
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
import { useNewGamePlus } from "./state/useNewGamePlus.js";
import { createRunLifecycle } from "./state/runLifecycle.js";
import { getEndingEpilogue } from "./featurePack.js";
import { resourceMeta } from "./appCopy.js";
import { nextCaseSignals } from "./caseCopy.js";
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
import { whenCaseReady } from "./state/caseArrival.js";
import { retryableLazy } from "./state/retryableLazy.js";
export { prepareGameRuntime } from "./state/caseArrival.js";

const RankingScreen = retryableLazy(() => import("./screens/RankingScreen.jsx").then(loadedChunk).then(({ RankingScreen }) => ({ default: RankingScreen })));
const BoardScreen = retryableLazy(() => import("./screens/BoardScreen.jsx").then(loadedChunk).then(({ BoardScreen }) => ({ default: BoardScreen })));
const IntroScreen = retryableLazy(() => import("./screens/IntroScreen.jsx").then(loadedChunk).then(({ IntroScreen }) => ({ default: IntroScreen })));
const ResultScreen = retryableLazy(() => import("./screens/ResultScreen.jsx").then(loadedChunk).then(({ ResultScreen }) => ({ default: ResultScreen })));
const PlayScreen = retryableLazy(() => import("./screens/PlayScreen.jsx").then(loadedChunk).then(({ PlayScreen }) => ({ default: PlayScreen })));
const nowMs = () => Date.now();
const speakerPortraits = {
  "한서윤": "/portrait-han-seoyun.webp",
  "반재욱": "/portrait-ban-jaeuk.webp",
  "도윤하": "/portrait-do-yunha.webp",
  "오진우": "/portrait-oh-jinwoo.webp",
  "에코": "/portrait-echo.webp",
};

// Save suppression has one owner, `AppContent`, which always passes both
// `onSuppressSaves` and `saveControls`. This file used to keep a second flag and
// a second pair of functions as defaults that no render path could reach.
export function GameRuntime({ onSuppressSaves, saveControls, initialStartState = null } = {}) {
  const persistSuppressed = useCallback(() => saveControls?.isSuppressed?.() ?? false, [saveControls]);

  const resumeRuntimeSaves = useCallback(() => {
    saveControls?.resume?.();
  }, [saveControls]);

  const { saved, recoverUnreadableSave } = useRuntimeSavedState(initialStartState);
  // The run: every field the save holds and the few kept beside them, with
  // what each transition does to each (state/runState.js).
  const { run, setters, patchRun } = useRunState(saved, () => ({
    runId: createRunId(),
    operatorOrigin: readStoredValue(OPERATOR_ORIGIN_KEY, "courier"),
    sessionId: getSessionId(),
    now: nowMs(),
    // Asked for by the last page (a reset that reloaded), or by a save that could not be read.
    openRecovery: recoverUnreadableSave || readStoredValue(RECOVERY_CENTER_STORAGE_KEY, "") === "1",
  }));
  const {
    runId, playerName, playStyle, openingLegacy, dataConsent, started, currentCase, completedCases,
    discoveredClues, caseResults, playtestFeedback, nodeId, resources, log, triggers, cognition,
    lastSavedAt, isPausedSave, pendingTelemetry, gauntletRun, staleSave, operatorOrigin, nodeEnteredAt,
    sessionId, decisionReveal, lastRecoveredError, showRecoveryCenter, showErrorLog,
  } = run;
  const {
    setPlayerName, setPlayStyle, setDataConsent, setStarted, setPlaytestFeedback, setPendingTelemetry,
    setLastSavedAt, setDecisionReveal, setLastRecoveredError, setShowRecoveryCenter, setShowErrorLog,
  } = setters;
  const sessionCode = useMemo(() => getSessionCode(sessionId), [sessionId]);
  const relicTable = useRelicTable();
  const { newGamePlusUnlocked, newGamePlusMemory, unlockNewGamePlus, rememberSeason } = useNewGamePlus(saved);
  const { copyStatus, flashCopyStatus } = useClipboardStatus();
  const { feedbackStatus, setFeedbackStatus, isSubmittingFeedback, setIsSubmittingFeedback } = useFeedbackStatus(currentCase);
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
    persist, applyRun, startFreshAfterRecovery, saveCurrentGame: saveRun, refreshLocalErrorLog, refreshSaveSlots,
    dismissRecoveryNotice, closeRecoveryCenter, clearLocalErrorLog, deleteSaveSlot, restoreSaveSlot, restoreSaveBackup,
  } = useAppPersistence({
    run,
    patchRun,
    refs: { pendingTelemetryRef },
    setters: { setSaveStatus, setLocalErrorEntries, setSaveSlots, setPendingTelemetry },
    config: {
      persistSuppressed, onSuppressSaves, onResumeSaves: resumeRuntimeSaves, formatSaveTime,
      debugErrorKey: DEBUG_RENDER_CRASH_KEY,
    },
  });

  const fallbackCaseId = seasonCasesBase.some((caseItem) => caseItem.id === currentCase)
    ? currentCase
    : SEASON_ENTRY_CASE;
  const operatorProfile = getOperatorProfile(operatorOrigin);
  function setOperatorOrigin(value) {
    const nextOrigin = getOperatorProfiles().some((profile) => profile.id === value) ? value : "courier";
    patchRun({ operatorOrigin: nextOrigin });
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
  const leadChoice = getLeadChoice(node);
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
  const introLandingRef = useRef(null);
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
  const replaceQueueEvent = useStableEvent(replacePendingTelemetry);
  // Starting, opening, jumping, leaving and wiping the run: each an event the
  // run's definition answers with a patch, applied and saved in one step.
  const lifecycle = createRunLifecycle({
    run,
    applyRun,
    patchRun,
    isOnline,
    effects: {
      resetEndingSequence, setNextParticipantMessage, replacePendingTelemetry: replaceQueueEvent, clearLocalRankingRows,
      setLocalErrorEntries, setSaveSlots, setSaveStatus, setTelemetryStatus, onSuppressSaves,
      resumeRuntimeSaves,
    },
  });
  // The page going away, coming back, or being hidden; see useWindowSuspension.
  // One write per event, carrying everything that event changed.
  const suspension = useWindowSuspension({
    started,
    active: started && !isResult && !staleSave,
    getRun: () => gauntletRun,
    commit: ({ run: heldRun = null, pausedForMs = 0, paused } = {}) => {
      const patch = {};
      if (heldRun) patch.gauntletRun = heldRun;
      if (pausedForMs > 0) patch.nodeEnteredAt = nodeEnteredAt + pausedForMs;
      // A page going away is saved as paused and the run in memory is not
      // told: it is about to be gone, and a page that comes back says so below.
      const leaving = paused && !persistSuppressed() && readStoredValue(STORAGE_KEY, null) !== null;
      if (Object.keys(patch).length > 0 || leaving) applyRun(patch, { saveOnly: leaving ? { paused: true } : {} });
    },
    onPageShow: () => {
      applyRun({ isPausedSave: false });
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
    return saveRun(suspendedRun ? { ...options, heldRun: suspendedRun } : options);
  }
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
    readers: choiceReaders, applyRun, appendLocalRankingRow, queueTelemetry, setSaveStatus, setTelemetryStatus,
    onSeasonFinal: unlockNewGamePlus,
  });
  const scheduleTelemetryRetryEvent = useStableEvent(scheduleTelemetryRetry);
  const refreshLocalErrorLogEvent = useStableEvent(refreshLocalErrorLog);
  const closeRecoveryCenterEvent = useStableEvent(closeRecoveryCenter);
  const saveCurrentGameEvent = useStableEvent(saveCurrentGame);
  const startCaseEvent = useStableEvent(startCase), openCaseEvent = useStableEvent(openCase);
  const resolveGauntletEvent = useStableEvent(resolveGauntlet);
  const resetEvent = useStableEvent(lifecycle.resetRun), retryStorageCleanupEvent = useStableEvent(retryStorageCleanup);
  const startAtNodeEvent = useStableEvent(lifecycle.startAtNode), exportPlaytestLogEvent = useStableEvent(exportPlaytestLog);
  const showSeasonMapEvent = useStableEvent(showSeasonMap);
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
  const shortcutHints = useRuntimeChoiceShortcuts({
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
    // Now, not a frame later: the scene behind the reveal is already mounted,
    // and on a slow frame the wait was long enough for Tab to move focus to a
    // control and for the title to take it back.
    focusSceneTitle(sceneTitleRef);
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
    // 시즌 로드맵 enters the intro at the roadmap, not at the top of the page.
    const roadmap = !started && introLandingRef.current === "roadmap";
    introLandingRef.current = null;
    window.requestAnimationFrame(() => {
      if (!roadmap) window.scrollTo({ top: 0, left: 0, behavior: getScrollBehavior() });
      if (!revealOpen) focusSceneTitle(sceneTitleRef, { roadmap, behavior: getScrollBehavior() });
      releaseAdvance();
    });
    // Keyed on where the player is, not on the reveal: the reveal is read once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCase, isResult, nodeId, started]);

  function startNewGamePlus() {
    if (!newGamePlusUnlocked) return;
    unlockNewGamePlus();
    // Kept only when this season reached its finale (state/useNewGamePlus.js).
    rememberSeason(caseResults);
    // What NEW GAME+ is: the season again, with the last one's record on the
    // intro. The line used to promise hidden authority and extra clues.
    setSaveStatus("NEW GAME+로 시작합니다. 지난 시즌의 기록은 시작 화면에 남아 있습니다.");
    lifecycle.startGame();
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
  // A case the season has not fetched yet is opened when it lands (caseArrival.js).
  // One that cannot be fetched and did not reload the page -- no connection, or
  // the page already reloaded for it once -- used to end in a dropped promise:
  // the button did nothing and said nothing.
  function startCase(caseId) {
    whenCaseReady(caseId, () => lifecycle.startCaseNow(caseId), {
      unavailable: ({ offline }) =>
        setSaveStatus(
          offline
            ? "연결이 끊겨 이 사건을 받지 못했습니다. 연결을 확인한 뒤 다시 눌러 주세요. 저장은 그대로 있습니다."
            : "이 사건을 받지 못했습니다. 다시 눌러 보고, 계속 안 되면 새로고침해 주세요. 저장은 그대로 있습니다.",
        ),
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
    applyRun({ gauntletRun: pickedRun });
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
    applyRun({ gauntletRun: touchedRun });
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
    introLandingRef.current = "roadmap";
    lifecycle.leaveToSeasonMap();
  }

  function unlockAllCasesForTest() {
    const allPlayableCases = CASE_SEQUENCE.filter((caseId) => caseId !== "final");
    applyRun({ completedCases: allPlayableCases });
  }

  function replacePendingTelemetry(queue) {
    pendingTelemetryRef.current = queue;
    setPendingTelemetry(queue);
  }

  function startDebugNode() {
    whenCaseReady(debugCaseId, () => lifecycle.startAtNode(debugCaseId, debugNodeId));
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
    lastRecoveredError, started, pauseAfterRecovery: lifecycle.pauseAfterRecovery, startFreshAfterRecovery, showRecoveryCenter, showErrorLog,
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
    hasResumableSave, lastSavedAt, log, caseResults, completedCases, currentCase, nodeId,
    newGamePlusUnlocked, newGamePlusMemory, nextParticipantMessage,
    startGame: lifecycle.startGame, startCase: startCaseEvent, startNewGamePlus, resumeSavedGame: lifecycle.resumeSavedGame, persist, setShowRanking,
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
    { AdaptiveMusic, musicModeKey, screenReaderStatus, currentCase, endingStep, endingTwistIndex, finalAftermathEntry, finalEndingEntry, caseResults, decisionFingerprint, observationLedger, observerPattern, endingProfile, endingVariant, advanceEndingStep, endingQuietReady, nextParticipantMessage, setNextParticipantMessage, saveNextParticipantMessage, unopenedRecordCount, unopenedClueCount, unopenedBranchCount, endingQuietLine, skipEndingQuietHold, GAME_TITLE, startCase: openCaseEvent, setStarted, setShowRanking, showSeasonMap: showSeasonMapEvent, debugToolsEnabled, showErrorLog, setShowErrorLog, exportPlaytestLog: exportPlaytestLogEvent, copyReplayLink, reset: resetEvent, playerName, activeCaseMeta, triggerLabels, triggers, result, caseOutcome, resultRank, momentumTier, momentumScore, rankLine, scoreBreakdown, clamp, easyCognitionLabels, cognitionLabels, formatRiskDelta, counterfactualReport, sessionCode, telemetryStatus, pendingTelemetry, retryPendingTelemetry, scheduleTelemetryRetry, telemetryEnabled, dataConsent, isOnline, isRetryingTelemetry, copySessionCode, copyStatus, nextCaseSignal, resultBridge, achievementBadges, feedbackPrompts, currentFeedback, updateCurrentFeedback, FEEDBACK_COMMENT_MAX_LENGTH, activeFeedbackPrivacySignals, anonymizeFeedbackComment, submitCurrentFeedback, isSubmittingFeedback, feedbackStatus, routeTimeline, resourceMeta, explainResourceTradeoff, log, clueCount, renderSceneLines, endingPreview },
    { endingSceneProfile: getEndingSceneProfile(endingVariant.id), endingVisualClass: getEndingVisualClass(endingVariant.id), failureObjectives: getFailureObjectives(endingVariant), delayedConsequences, rankingComparison, seasonGoals, balanceSignals, startRecoveryRoute, endingCause, authorityReview, endingAtmosphere, originEndingVariant, aftermath, rankingIntegrity, replayDiagnostics, playReport, endingEpilogue: getEndingEpilogue(endingVariant.id), failureRecovery, achievementProgress, operatorReveal, operationsSnapshot, telemetryDashboard, telemetryStats },
  );
  if (isResult) {
    return <LazyScreen quiet><ResultScreen view={resultView} renderers={{ renderDecisionReveal, renderRecoveryNotice, renderErrorLogPanel }} sceneTitleRef={sceneTitleRef} shortcuts={shortcutHints} /></LazyScreen>;
  }

  const playView = createPlayView({
    AdaptiveMusic, musicModeKey, screenReaderStatus, simplifyPlayerText, currentCase,
    node, speakerProfile, speakerPortrait, narrativeSpine, resolvedNodeId,
    gauntletRun, gauntletSeed, isAdvancing, decisionRevealOpen: Boolean(decisionReveal), staleSave,
    fixedChoices, clueCount, casesOpened, reframeChoice,
    resources, resourceMeta, progress, routeIndex, routeLength,
    debugToolsEnabled, fallbackCaseId, silentFailureCount,
  });
  return <LazyScreen quiet><PlayScreen view={playView} renderers={{ renderDecisionReveal, renderRecoveryNotice, renderErrorLogPanel, renderSaveStatus }} sceneTitleRef={sceneTitleRef} actions={{ saveCurrentGame, resolveGauntlet: resolveGauntletEvent, markWindowTouched, pickRelic, onSuspendable: suspension.recordSuspendable, reloadFromStorage, reset: resetEvent, copyReplayLink, copyDiagnosticTrace }} /></LazyScreen>;

}
