import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
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
  getClueHypotheses,
  getDiscoveryClue,
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
import { useGameSaveState } from "./state/useGameSave.js";
import { createChoiceReaders, useDecision } from "./state/useDecision.js";
import { createTelemetryQueue } from "./state/useTelemetryQueue.js";
import { useAppPersistence } from "./state/useAppPersistence.js";
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
} from "./appContent.js";
import {
  getChapterUiModel,
  getBalanceSignals,
  getDelayedConsequences,
  getEndingSceneProfile,
  getFailureObjectives,
  getEndingVisualClass,
  getEndingPreview,
  getAuthorityProfile,
  getInterlude,
  getOperatorProfile,
  getOperatorProfiles,
  getChoiceOutcomeFeedback,
  getPlayStyleUnlocks,
  getPastRunMemory,
  getRelationshipScene,
  getRelationshipQuest,
  getRankingComparison,
  getSeasonGoals,
  getTutorialSteps,
} from "./advancedSystems.js";

const RankingScreen = lazy(() => import("./screens/RankingScreen.jsx").then(({ RankingScreen }) => ({ default: RankingScreen })));
const IntroScreen = lazy(() => import("./screens/IntroScreen.jsx").then(({ IntroScreen }) => ({ default: IntroScreen })));
const ResultScreen = lazy(() => import("./screens/ResultScreen.jsx").then(({ ResultScreen }) => ({ default: ResultScreen })));
const PlayScreen = lazy(() => import("./screens/PlayScreen.jsx").then(({ PlayScreen }) => ({ default: PlayScreen })));

const GAME_TITLE = "임계점";
const GAME_SUBTITLE = "판단이 깊어지는 순간";
const GAME_LABEL = "CRITICAL POINT";
const NEXT_PARTICIPANT_MESSAGE_KEY = "critical-point-next-participant-message";
const LOCAL_RANKING_STORAGE_KEY = "critical-point-local-ranking-v1";

function parseLocalRankingRows(rawValue) {
  try {
    const parsed = JSON.parse(rawValue || "[]");
    return Array.isArray(parsed)
      ? parsed.filter((row) => row && typeof row === "object" && row.case_id && row.summary).slice(-100)
      : [];
  } catch {
    return [];
  }
}

function appendLocalRankingRow(row) {
  const nextRows = [
    ...parseLocalRankingRows(readStoredValue(LOCAL_RANKING_STORAGE_KEY, "[]")),
    row,
  ].slice(-100);
  return {
    rows: nextRows,
    saved: writeStoredValue(LOCAL_RANKING_STORAGE_KEY, JSON.stringify(nextRows)),
  };
}

function createRunId() {
  return globalThis.crypto?.randomUUID?.() ?? `run-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

const speakerPortraits = {
  "한서윤": "/portrait-han-seoyun.png",
  "반재욱": "/portrait-ban-jaeuk.png",
  "도윤하": "/portrait-do-yunha.png",
  "오진우": "/portrait-oh-jinwoo.png",
  "에코": "/portrait-echo.png",
  "반재현": "/portrait-ban-jaehyun.png",
  "윤서": "/portrait-yunseo.png",
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

const debugToolsEnabled =
  import.meta.env.VITE_ENABLE_DEBUG_TOOLS === "true" ||
  (import.meta.env.DEV && new URLSearchParams(globalThis.location?.search ?? "").get("debug") === "1");
const DEBUG_RENDER_CRASH_KEY = "critical-point-force-render-error";
const NEW_GAME_PLUS_KEY = "critical-point-new-game-plus-unlocked";
const NEW_GAME_PLUS_MEMORY_KEY = "critical-point-new-game-plus-memory";
const OPERATOR_ORIGIN_KEY = "critical-point-operator-origin";
let saveSuppressed = false;
const replaySeed = getReplaySeedFromLocation();

export function suppressSaves() {
  saveSuppressed = true;
}

export function AppContent({ onSuppressSaves }) {
  const saved = useMemo(() => {
    const replay = createReplaySavedState(replaySeed);
    const rawSaved = readStoredValue(STORAGE_KEY, "null");
    const hasStoredSave = Boolean(replay) || (typeof rawSaved === "string" && rawSaved !== "null" && rawSaved !== "");
    const parsed = replay ?? parseCurrentSavedState(rawSaved, SAVE_SCHEMA_VERSION);
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
  }, []);
  const sessionId = useMemo(() => getSessionId(), []);
  const sessionCode = useMemo(() => getSessionCode(sessionId), [sessionId]);
  const initialRunId = useMemo(() => saved?.runId || createRunId(), [saved?.runId]);

  const {
    pendingChoice, setPendingChoice, decisionReveal, setDecisionReveal,
    decisionSeconds, setDecisionSeconds,
  } = useDecision();

  const {
    runId, setRunId, playerName, setPlayerName, playStyle, setPlayStyle, openingLegacy, setOpeningLegacy,
    dataConsent, setDataConsent, started, setStarted, currentCase, setCurrentCase,
    completedCases, setCompletedCases, discoveredClues, setDiscoveredClues,
    caseResults, setCaseResults, playtestFeedback, setPlaytestFeedback, nodeId, setNodeId,
    resources, setResources, log, setLog, triggers, setTriggers, cognition, setCognition,
    freeText, setFreeText, lastSavedAt, setLastSavedAt, isPausedSave, setIsPausedSave,
    pendingTelemetry, setPendingTelemetry, protocolUsed, setProtocolUsed,
    timerPenaltyApplied, setTimerPenaltyApplied, probeUsed, setProbeUsed,
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
  const [endingStep, setEndingStep] = useState(0);
  const [endingTwistIndex, setEndingTwistIndex] = useState(0);
  const [endingQuietReady, setEndingQuietReady] = useState(
    () => globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false,
  );
  const [nextParticipantMessage, setNextParticipantMessage] = useState(() => readStoredValue(NEXT_PARTICIPANT_MESSAGE_KEY, ""));
  const [echo, setEcho] = useState(
    () => normalizeSavedText(saved?.echo) || "얼마나 똑똑한지는 묻지 않겠습니다. 대신 언제 생각을 멈추지 못하는지 보겠습니다.",
  );
  const [nodeEnteredAt, setNodeEnteredAt] = useState(saved?.nodeEnteredAt ?? Date.now());
  const [copyStatus, setCopyStatus] = useState("");
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const pendingTelemetryRef = useRef(saved?.pendingTelemetry ?? []);
  const [isRetryingTelemetry, setIsRetryingTelemetry] = useState(false);
  const [showTacticalDetails, setShowTacticalDetails] = useState(false);
  const [memoOpened, setMemoOpened] = useState(false);
  const [showRanking, setShowRanking] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [localRankingRows, setLocalRankingRows] = useState(() =>
    parseLocalRankingRows(readStoredValue(LOCAL_RANKING_STORAGE_KEY, "[]")),
  );
  const [leaderboardStatus, setLeaderboardStatus] = useState("idle");
  const [leaderboardError, setLeaderboardError] = useState("");
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
    runId, playerName, playStyle, openingLegacy, dataConsent, started, currentCase, completedCases,
    discoveredClues, caseResults, playtestFeedback, nodeId, resources, log, triggers, cognition,
    freeText, echo, nodeEnteredAt, pendingTelemetryRef, protocolUsed, timerPenaltyApplied, probeUsed,
    isPausedSave, setRunId, setPlayerName, setStarted, setIsPausedSave, setCurrentCase, setCompletedCases,
    setDiscoveredClues, setCaseResults, setPlaytestFeedback, setResources, setLog, setTriggers,
    setCognition, setProtocolUsed, setTimerPenaltyApplied, setProbeUsed, setOpeningLegacy,
    setDecisionReveal, setPendingChoice, setLastRecoveredError, setShowRecoveryCenter, setShowErrorLog,
    setFreeText, setNodeId, setNodeEnteredAt, setLastSavedAt, setSaveStatus, setLocalErrorEntries,
    setSaveSlots, saveSlots, normalizePlayerName, initialResources, triggerLabels, cognitionLabels,
    makeEmptyScores, normalizeSavedText, persistSuppressed: () => saveSuppressed,
    onSuppressSaves, formatSaveTime, debugErrorKey: DEBUG_RENDER_CRASH_KEY,
    createRunId,
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
  const activeCaseMeta = seasonCasesBase.find((caseItem) => caseItem.id === currentCase);
  const seasonCases = seasonCasesBase.map((caseItem) => {
    const isCompleted = completedCases.includes(caseItem.id);
    const isCurrent = caseItem.id === currentCase;
    const isUnlocked =
      caseItem.id === "case01" ||
      caseItem.id === "case02" && completedCases.includes("case01") ||
      caseItem.id === "case03" && completedCases.includes("case02") ||
      caseItem.id === "case04" && completedCases.includes("case03") ||
      caseItem.id === "case05" && completedCases.includes("case04") ||
      caseItem.id === "final" && completedCases.includes("case05") ||
      isCurrent;
    return {
      ...caseItem,
      status: isCompleted ? "COMPLETE" : isCurrent ? "PLAYING" : isUnlocked ? "OPEN" : "LOCKED",
    };
  });
  const speakerProfile = characterProfiles[node?.speaker] ?? {
    role: "사건 관계자",
    stance: "상황 설명",
    job: "현재 국면의 핵심 정보를 전달한다.",
    appearance: "정돈되지 않은 자료 더미 앞에 사건 관계자가 앉아 있다.",
    thought: "이 장면에서 놓친 전제가 있는지 다시 확인한다.",
    gesture: "사건 관계자는 잠깐 말을 멈추고, 테이블 위 자료를 다시 바라본다.",
    voice: "상황을 과장하지 않고 필요한 정보만 전달한다.",
    line: "지금 결정하면, 무엇이 다음 장면으로 넘어갑니까?",
  };
  const speakerPortrait = speakerPortraits[node?.speaker] ?? "/speaker-profile.png";
  const latestBeat = log.at(-1)?.sceneBeat ?? "";
  const freeTextSignals = getFreeTextSignals(freeText);
  const activeFreeTextSignalCount = freeTextSignals.filter((signal) => signal.active).length;
  const freeTextPreview = freeText.trim() ? scoreFreeText(freeText) : null;
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
  useEffect(() => {
    setMemoOpened(false);
  }, [resolvedNodeId]);
  const privacySignals = detectPrivacySignals(freeText);
  const activePrivacySignals = privacySignals.filter((signal) => signal.active);
  const freeTextBlockedByPrivacy = activePrivacySignals.length > 0;
  const freeTextSuccessEntries = log.filter((entry) => entry.freeTextSuccess);
  const currentCaseFreeTextSuccessCount = freeTextSuccessEntries.filter(
    (entry) => entry.caseId === fallbackCaseId,
  ).length;
  const aftermathNodeId = fallbackCaseId === "final" ? "f_aftershock" : `${fallbackCaseId.replace("case", "c")}_aftershock`;
  const adaptiveChoiceUnlocked = resolvedNodeId === aftermathNodeId && currentCaseFreeTextSuccessCount >= 2;
  const adaptiveChoice = adaptiveChoiceUnlocked
    ? {
        id: `${fallbackCaseId}_adaptive_reframe`,
        label: "앞서 남긴 문장을 공개 기준으로 삼는다",
        effect: { legitimacy: 7, trust: 5, fatigue: 4 },
        next: node?.choices?.[0]?.next ?? "result",
        cognition: { reframing: 2, persistence: 1 },
        adaptive: true,
        requiredAuthority: "FIELD ACCESS",
      }
    : null;
  const speakerRelationship = log.reduce(
    (score, entry) => score + (entry.speaker === node?.speaker ? 8 : entry.speaker ? -1 : 0),
    0,
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
    ...(adaptiveChoice ? [adaptiveChoice] : []),
    ...(relationshipChoice ? [relationshipChoice] : []),
  ];
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
    decisionSeconds,
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
  const pressureCascade = useMemo(() => {
    const latest = log.at(-1);
    const humanCost = resources.humanCost ?? 0;
    const fatigue = resources.fatigue ?? 0;
    const pressure = riskPressure;
    if (pressure >= 72 || humanCost >= 28) {
      return {
        tone: "critical",
        label: "PRESSURE CASCADE",
        title: "숫자로 막던 문제가 사람의 반응으로 새고 있습니다.",
        text: "다음 선택은 자원 하나만 움직이지 않습니다. 침묵한 사람, 떠날 사람, 기록을 들고 있는 사람이 동시에 반응합니다.",
        cue: "가장 큰 성과보다 피해가 어디로 이동하는지 먼저 말해야 합니다.",
      };
    }
    if (pressure >= 48 || fatigue >= 32) {
      return {
        tone: "unstable",
        label: "AFTERSHOCK",
        title: "직전 판단의 비용이 아직 회의실에 남아 있습니다.",
        text: "다음 결론을 서두르면 방금 줄인 비용이 다른 이해관계자에게 옮겨갈 수 있습니다.",
        cue: latest?.challenge?.matched
          ? "챌린지를 맞혔어도, 남겨둔 비용까지 사라진 것은 아닙니다."
          : "이번 장면은 정답보다 비용의 이동 경로를 확인해야 합니다.",
      };
    }
    return {
      tone: "stable",
      label: "LOW SIGNAL",
      title: "아직 방향을 바꿀 여지가 있습니다.",
      text: "압박이 낮을 때는 빠른 결론보다 다음 사건에 남길 기준을 설계할 수 있습니다.",
      cue: "지금 남기는 문장이 다음 장면의 출발점이 됩니다.",
    };
  }, [log, resources, riskPressure]);
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
  const tutorialSteps = getTutorialSteps();
  const seasonGoals = getSeasonGoals();
  const interlude = getInterlude(currentCase, log.at(-1)?.choice);
  const balanceSignals = useMemo(() => getBalanceSignals(log), [log]);
  const authorityState = useMemo(() => {
    const evidence = discoveredClues.length;
    const trust = resources.trust ?? 0;
    const legitimacy = resources.legitimacy ?? 0;
    const level = evidence >= 5 && legitimacy >= 55 ? "OVERSIGHT" : evidence >= 2 || trust >= 55 ? "FIELD ACCESS" : "OBSERVER";
    const authorityProfile = getAuthorityProfile(operatorOrigin, level);
    return {
      level,
      evidence,
      permissions: authorityProfile.permissions,
      origin: authorityProfile,
      locked: level === "OBSERVER" ? "단서 2개 또는 신뢰 55가 필요합니다." : level === "FIELD ACCESS" ? "정당성 55와 단서 5개를 모으면 감독 권한이 열립니다." : "감독 권한이 열려 최종 종료 조건을 제안할 수 있습니다.",
    };
  }, [discoveredClues.length, operatorOrigin, resources.legitimacy, resources.trust]);
  const clueCount = discoveredClues.length;
  const clueHypotheses = useMemo(() => getClueHypotheses(discoveredClues), [discoveredClues]);
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
    exploitPenalty,
    momentumScore,
    momentumTier,
    rank: gameplayRank,
  } = gameplayStats;
  const activeBonus =
    log.at(-1)?.title === "CRISIS PROTOCOL"
      ? "구조 개입"
      : log.at(-1)?.instinctSurge
        ? "INSTINCT SURGE"
        : log.at(-1)?.auditSurge
          ? "AUDIT SURGE"
        : log.at(-1)?.tempoBonus
          ? "QUICK READ"
          : freeTextCombo >= 2
            ? "판 바꾸기 보너스"
            : currentChallengeStreak >= 2
              ? "연속 챌린지 보너스"
              : currentAverageResponseTime >= 20
                ? "숙고 보너스"
                : log.length >= 3
                  ? "연속 판단 보너스"
                  : "보너스 대기";
  const inheritedChallenge =
    openingLegacy && isOpeningNode
      ? (openingLegacy.continuityChallenge ?? {
          id:
            openingLegacy.label === "CLEAR SIGNAL"
              ? "protect-trust"
              : openingLegacy.label === "OPEN WOUND"
                ? "repair-legitimacy"
                : openingLegacy.label === "UNFINISHED COST"
                  ? "lower-risk"
                  : "find-cost",
          title:
            openingLegacy.label === "CLEAR SIGNAL"
              ? "신뢰를 다음 장면에 넘기기"
              : openingLegacy.label === "OPEN WOUND"
                ? "정당성 균열 봉합하기"
                : openingLegacy.label === "UNFINISHED COST"
                  ? "남은 비용 줄이기"
                  : "이전 판단의 비용 확인하기",
          text:
            openingLegacy.label === "CLEAR SIGNAL"
              ? "이전 케이스에서 얻은 신뢰를 잃지 않는 선택이 다음 압박의 문을 엽니다."
              : openingLegacy.label === "OPEN WOUND"
                ? "정당성을 회복하는 선택으로 지난 사건의 균열을 먼저 봉합해야 합니다."
                : openingLegacy.label === "UNFINISHED COST"
                  ? "지난 사건에서 넘어온 비용을 줄이면 이번 장면의 회복 보너스가 붙습니다."
                  : "이전 판단이 남긴 숨은 비용을 찾아야 다음 사건의 기준을 다시 세울 수 있습니다.",
        })
      : null;
  const sceneChallenge =
    inheritedChallenge ??
    (riskPressure >= 35
      ? {
          id: "lower-risk",
          title: "위험 압력 낮추기",
          text: "예상 위험이 내려가는 선택을 찾으면 압박 관리 보너스가 붙습니다.",
        }
      : freeTextCombo === 0 && freeChoice
        ? {
            id: "use-reframe",
            title: "판 바꾸기 시도",
            text: "구조 재설계에서 반영 기준 2개 이상을 채우면 보너스 조건이 열립니다.",
          }
        : (node?.triggers ?? []).includes("competition")
          ? {
              id: "avoid-risk",
              title: "속도에 말리지 않기",
              text: "위험 상승을 감수하지 않고 경쟁 압박을 통과하는 선택을 찾습니다.",
            }
          : {
              id: "find-cost",
              title: "숨은 비용 찾기",
              text: "가장 좋아 보이는 선택의 반대 비용을 확인하고 고릅니다.",
            });
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
    getTacticalRead,
    describeForecast,
    mergeEffects,
    getFlowSurge,
    getClueReveal,
    getEffectiveChoiceRead,
  } = createChoiceReaders({
    sceneChallenge,
    resources,
    log,
    riskPressure,
    discoveredClues,
    currentCase,
    cognition,
    freeText,
    currentChallengeStreak,
    evidenceCount,
    resourceMeta,
  });

  const riskPressureDrivers = getRiskPressureDrivers(resources);
  const decisionForecasts = fixedChoices
    .map((choice) => {
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
          responseTimeSec: Math.max(1, 45 - decisionSeconds),
        }),
      };
    });
  const pressureLensForecast = [...decisionForecasts].sort((a, b) => {
    if (a.forecast.riskDelta !== b.forecast.riskDelta) {
      return a.forecast.riskDelta - b.forecast.riskDelta;
    }
    return b.forecast.cognitionGain - a.forecast.cognitionGain;
  })[0];
  const tradeoffLensForecast = [...decisionForecasts].sort((a, b) => {
    const aCost = Math.abs(a.forecast.biggestCost?.[1] ?? 0);
    const bCost = Math.abs(b.forecast.biggestCost?.[1] ?? 0);
    return bCost - aCost;
  })[0];
  const pressureLeader = riskPressureDrivers[0];
  const formatResourceDelta = (delta) => {
    if (!delta) return "즉시 비용 낮음";
    const [key, value] = delta;
    return `${resourceMeta[key]?.label ?? key} ${value > 0 ? "+" : ""}${value}`;
  };
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
    if (!forecast) return "?��?";
    if (forecast.forecastPrecision === "precise") return formatRiskDelta(forecast.riskDelta);
    return `${formatRiskDelta(forecast.riskDeltaMin)} ~ ${formatRiskDelta(forecast.riskDeltaMax)}`;
  };

  const questSteps = [
    {
      title: "장면 챌린지",
      value: `${challengeClearCount}/${Math.max(1, log.length)}`,
      text: currentChallengeStreak > 0 ? `${currentChallengeStreak}연속 유지 중` : "이번 장면에서 다시 시작",
      complete: currentChallengeStreak > 0,
    },
    {
      title: "위험 압력 제어",
      value: `${reducedRiskCount}`,
      text: reducedRiskCount > 0 ? "하락 선택 기록됨" : "위험 하락 선택을 찾아야 함",
      complete: reducedRiskCount > 0,
    },
    {
      title: "판 바꾸기",
      value: `${freeTextCombo}`,
      text: freeTextCombo > 0 ? "선택지 밖 계획이 남음" : "구조 재설계 미사용",
      complete: freeTextCombo > 0,
    },
  ];
  const turnBriefItems = [
    { label: "챌린지", value: sceneChallenge.title },
    { label: "압력", value: `${riskTier} ${riskPressure}` },
    { label: "버스트", value: `${momentumTier} ${momentumScore}` },
    { label: "보너스", value: activeBonus },
    { label: "남은 시간", value: `${decisionSeconds}초` },
  ];
  const currentFeedback = normalizeFeedback(playtestFeedback[currentCase]);
  const [feedbackStatus, setFeedbackStatus] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const firstRenderRef = useRef(true);
  const sceneTitleRef = useRef(null);
  const hasResumableSave =
    !started &&
    currentCase &&
    nodeId &&
    (isPausedSave || Boolean(saveStatus) || Boolean(lastSavedAt && (log.length > 0 || completedCases.length > 0)));
  const telemetrySummary = !isOnline
    ? {
        tone: "local",
        title: "오프라인",
        text: "연결이 복구되면 원격 저장을 다시 사용할 수 있습니다. 현재 기록은 브라우저에 저장됩니다.",
      }
    : telemetryEnabled
    ? dataConsent
      ? {
          tone: "ready",
          title: "원격 저장 준비됨",
          text: "케이스 완료와 피드백 제출 시 동의한 기록만 원격 저장합니다.",
        }
      : {
          tone: "pending",
          title: "원격 저장 준비됨 · 동의 대기",
          text: "체크박스에 동의하면 이 세션의 완료 로그와 피드백을 원격 저장합니다.",
        }
    : {
        tone: "local",
        title: "로컬 저장",
        text: "원격 저장 설정이 없어 브라우저 저장과 JSON 내보내기만 사용합니다.",
    };
  const localLeaderboardRows = useMemo(
    () => [
      ...localRankingRows,
      ...Object.entries(caseResults).map(([caseId, summary]) => ({
        local: true,
        run_id: summary?.runId ?? runId,
        session_code: sessionCode,
        player_name: playerName || "현재 분석관",
        case_id: caseId,
        case_title: seasonCasesBase.find((caseItem) => caseItem.id === caseId)?.title ?? caseId,
        completed_at: summary?.completedAt ?? "",
        summary,
      })),
    ],
    [caseResults, localRankingRows, playerName, runId, sessionCode],
  );
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
    scheduleTelemetryRetry({ immediate: telemetryRetryAttemptRef.current === 0 });
    return () => {
      if (telemetryRetryTimerRef.current) {
        window.clearTimeout(telemetryRetryTimerRef.current);
        telemetryRetryTimerRef.current = null;
      }
    };
  }, [dataConsent, isOnline, pendingTelemetry.length]);
  useEffect(() => {
    if (!debugToolsEnabled) return undefined;
    if (!telemetryEnabled || !isOnline) {
      setTelemetryHealth({ status: telemetryEnabled ? "offline" : "disabled", tables: [] });
      return undefined;
    }
    let cancelled = false;
    setTelemetryHealth({ status: "checking", tables: [] });
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
      refreshLocalErrorLog();
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
      refreshLocalErrorLog();
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
        refreshLocalErrorLog();
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
  }, []);
  useEffect(() => {
    const closeOverlay = (event) => {
      if (event.key !== "Escape") return;
      if (decisionReveal) {
        setDecisionReveal(null);
      } else if (showRanking) {
        setShowRanking(false);
      } else if (showErrorLog) {
        closeRecoveryCenter();
      }
    };
    window.addEventListener("keydown", closeOverlay);
    return () => window.removeEventListener("keydown", closeOverlay);
  }, [decisionReveal, showErrorLog, showRanking]);
  useEffect(() => {
    const handleChoiceShortcut = (event) => {
      if (!started || decisionReveal || isAdvancing) return;
      if (event.repeat) return;
      const target = event.target;
      if (target instanceof HTMLElement && target.matches("input, textarea, select, [contenteditable='true']")) return;
      if (isResult) {
        if (event.key.toLowerCase() === "r") {
          event.preventDefault();
          startCase(currentCase);
        } else if (event.key.toLowerCase() === "n" && nextCaseSignal) {
          event.preventDefault();
          startCase(nextCaseSignal.caseId);
        }
        return;
      }
      if (event.key.toLowerCase() === "p") {
        event.preventDefault();
        saveCurrentGame({ exit: event.shiftKey });
        return;
      }
      if (event.key === "Escape" && pendingChoice) {
        event.preventDefault();
        setPendingChoice(null);
        return;
      }
      if ((event.key === "Enter" || event.key === " ") && pendingChoice) {
        event.preventDefault();
        choose(pendingChoice);
        return;
      }
      if (fixedChoices.length > 1 && ["ArrowDown", "ArrowRight", "j", "J", "ArrowUp", "ArrowLeft", "k", "K"].includes(event.key)) {
        event.preventDefault();
        const currentIndex = pendingChoice ? fixedChoices.findIndex((choice) => choice.id === pendingChoice.id) : -1;
        const direction = ["ArrowUp", "ArrowLeft", "k", "K"].includes(event.key) ? -1 : 1;
        const nextIndex = (currentIndex + direction + fixedChoices.length) % fixedChoices.length;
        previewChoice(fixedChoices[nextIndex]);
        return;
      }
      const choiceIndex = Number(event.key) - 1;
      if (!Number.isInteger(choiceIndex) || choiceIndex < 0 || !fixedChoices[choiceIndex]) return;
      event.preventDefault();
      previewChoice(fixedChoices[choiceIndex]);
    };
    window.addEventListener("keydown", handleChoiceShortcut);
    return () => window.removeEventListener("keydown", handleChoiceShortcut);
  }, [currentCase, decisionReveal, fixedChoices, isAdvancing, isResult, pendingChoice, started]);
  useEffect(() => {
    if (!pendingChoice) return;
    window.requestAnimationFrame(() => {
      commitConsoleRef.current?.scrollIntoView({ behavior: getScrollBehavior(), block: "center" });
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
  useEffect(() => {
    if (!showRanking) return undefined;
    let cancelled = false;
    setLeaderboardStatus("loading");
    setLeaderboardError("");
    fetchLeaderboard()
      .then(({ rows = [], skipped = false }) => {
        if (cancelled) return;
        setLeaderboard(buildLeaderboard([...rows, ...localLeaderboardRows, ...(localSeasonLeaderboardRow ? [localSeasonLeaderboardRow] : [])]));
        setLeaderboardStatus(skipped ? "local" : "ready");
      })
      .catch((error) => {
        if (cancelled) return;
        console.warn(error);
        setLeaderboard(buildLeaderboard([...localLeaderboardRows, ...(localSeasonLeaderboardRow ? [localSeasonLeaderboardRow] : [])]));
        setLeaderboardStatus(isOnline ? "error" : "local");
        setLeaderboardError(
          isOnline
            ? "원격 기록을 불러오지 못해 이 브라우저의 완료 기록만 표시합니다."
            : "오프라인이라 이 브라우저의 완료 기록만 표시합니다.",
        );
      });
    return () => {
      cancelled = true;
    };
  }, [isOnline, localLeaderboardRows, localSeasonLeaderboardRow, showRanking]);
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

  function skipEndingQuietHold() {
    setEndingQuietReady(true);
  }

  useEffect(() => {
    if (!isResult || currentCase !== "final" || endingStep !== 1) return undefined;
    const reducedMotion = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reducedMotion) {
      setEndingQuietReady(true);
      return undefined;
    }
    setEndingQuietReady(false);
    const timer = window.setTimeout(() => setEndingQuietReady(true), 8000);
    return () => window.clearTimeout(timer);
  }, [currentCase, endingStep, isResult]);

  useEffect(() => {
    if (!started || isResult) return undefined;
    setDecisionSeconds(45);
    setTimerPenaltyApplied(false);
    setProbeUsed(false);
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      setDecisionSeconds((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [started, currentCase, resolvedNodeId, isResult]);

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
      if (!started || saveSuppressed) return;
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
  }, [persist, started]);

  useEffect(() => {
    if (!started || isResult || decisionSeconds > 0 || timerPenaltyApplied) return;
    const timeoutEffect = { time: -2, fatigue: 3 };
    const nextResources = applyEffect(resources, timeoutEffect);
    const entry = {
      nodeId: resolvedNodeId,
      title: "TIMEOUT PRESSURE",
      choice: "결정 윈도우 초과",
      spokenChoice: "잠깐. 늦어진 만큼의 비용도 기록하겠습니다.",
      freeText: "",
      effect: timeoutEffect,
      triggers: ["fear", "responsibility"],
      echo: "결정을 늦추는 것도 하나의 결정입니다. 이제 줄어든 시간과 늘어난 피로를 감안하십시오.",
      sceneBeat: "에코: 결정 윈도우가 닫혔습니다.\n회의실: 아무도 당신을 대신해 결론을 내리지 않았지만, 기다린 비용은 이미 숫자로 남았습니다.",
      challenge: { title: "시간 압박 버티기", matched: false, riskDelta: getRiskPressure(nextResources) - riskPressure },
      tactical: null,
      flowSurge: null,
      tempoBonus: null,
      instinctSurge: null,
      note: "결정 윈도우 초과 비용",
      responseTimeSec: 45,
      resourcesBefore: resources,
      resourcesAfter: nextResources,
      isSystemEvent: true,
    };
    const nextLog = [...log, entry];
    setTimerPenaltyApplied(true);
    setResources(nextResources);
    setLog(nextLog);
    setEcho(entry.echo);
    setNodeEnteredAt(Date.now());
    setSaveStatus("결정 윈도우 초과 비용 적용됨");
    persist({
      timerPenaltyApplied: true,
      resources: nextResources,
      log: nextLog,
      echo: entry.echo,
      nodeEnteredAt: Date.now(),
    });
  }, [decisionSeconds, isResult, log, nodeEnteredAt, persist, resources, resolvedNodeId, riskPressure, started, timerPenaltyApplied]);

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
      setPendingChoice(null);
    });
  }, [started, currentCase, nodeId, isResult]);

  function legacyPersist(nextState) {
    if (saveSuppressed) return { storageSaved: false };
    const baseState = {
        saveSchemaVersion: SAVE_SCHEMA_VERSION,
        playerName,
        playStyle,
        openingLegacy,
        dataConsent,
        started,
        currentCase,
        completedCases,
        discoveredClues,
        caseResults,
        playtestFeedback,
        nodeId,
        resources,
        log,
        triggers,
        cognition,
        freeText,
        echo,
        nodeEnteredAt,
        pendingTelemetry: pendingTelemetryRef.current,
        protocolUsed,
        timerPenaltyApplied,
        probeUsed,
        paused: isPausedSave,
        savedAt: new Date().toISOString(),
      };
    const missingKeys = SAVE_STATE_KEYS.filter((key) => !Object.hasOwn(baseState, key));
    if (missingKeys.length > 0 && import.meta.env.DEV) {
      throw new Error(`Save payload missing keys: ${missingKeys.join(", ")}`);
    }
    const payload = {
      ...SAVE_STATE_KEYS.reduce((state, key) => {
        state[key] = baseState[key];
        return state;
      }, {}),
      ...nextState,
    };
    const previousState = {
      started,
      currentCase,
      nodeId,
      completedCases,
    };
    const storageSaved = writeStoredValue(STORAGE_KEY, JSON.stringify(payload));
    if (storageSaved && shouldCaptureSaveSlot(previousState, payload)) {
      appendSaveSlot(payload);
    }
    if (!storageSaved) {
      setSaveStatus("브라우저 저장소를 사용할 수 없어 현재 탭에서만 진행됩니다.");
    }
    return { ...payload, storageSaved };
  }

  function legacyStartGame() {
    const name = normalizePlayerName(playerName) || "분석관";
    setPlayerName(name);
    setStarted(true);
    setIsPausedSave(false);
    setCurrentCase("case01");
    setCompletedCases([]);
    setDiscoveredClues([]);
    setCaseResults({});
    setPlaytestFeedback({});
    setResources(initialResources);
    setLog([]);
    setTriggers(makeEmptyScores(triggerLabels));
    setCognition(makeEmptyScores(cognitionLabels));
    setProtocolUsed(false);
    setTimerPenaltyApplied(false);
    setProbeUsed(false);
    setOpeningLegacy(null);
    setDecisionReveal(null);
    setPendingChoice(null);
    setLastRecoveredError(null);
    setShowRecoveryCenter(false);
    setShowErrorLog(false);
    removeStoredValue(RECOVERY_CENTER_STORAGE_KEY);
    setFreeText("");
    setNodeId("start");
    setNodeEnteredAt(Date.now());
    persist({
      playerName: name,
      playStyle,
      openingLegacy: null,
      dataConsent,
      started: true,
      currentCase: "case01",
      completedCases: [],
      discoveredClues: [],
      caseResults: {},
      playtestFeedback: {},
      resources: initialResources,
      log: [],
      triggers: makeEmptyScores(triggerLabels),
      cognition: makeEmptyScores(cognitionLabels),
      nodeId: "start",
      freeText: "",
      nodeEnteredAt: Date.now(),
      protocolUsed: false,
      timerPenaltyApplied: false,
      probeUsed: false,
      paused: false,
      lastError: null,
    });
  }

  function legacyResumeSavedGame() {
    setStarted(true);
    setIsPausedSave(false);
    setNodeEnteredAt(Date.now());
    setSaveStatus("");
    setDecisionReveal(null);
    persist({
      started: true,
      paused: false,
      nodeEnteredAt: Date.now(),
    });
  }

  function legacyPauseAfterRecovery() {
    setStarted(false);
    setIsPausedSave(true);
    setSaveStatus("저장 지점을 일시정지했습니다. 같은 오류가 반복되면 새로 시작하거나 복구 슬롯을 선택하세요.");
    persist({ started: false, paused: true });
  }

  function legacyStartFreshAfterRecovery() {
    onSuppressSaves();
    const removed = removeStoredValue(STORAGE_KEY);
    if (!removed) {
      saveSuppressed = false;
      setSaveStatus("저장본을 초기화하지 못했습니다. 브라우저 저장소 권한을 확인하세요.");
      return;
    }
    writeStoredValue(RECOVERY_CENTER_STORAGE_KEY, "1");
    removeStoredValue(DEBUG_RENDER_CRASH_KEY);
    window.location.reload();
  }

  function legacySaveCurrentGame({ exit = false } = {}) {
    const nextStarted = exit ? false : started;
    const nextNodeEnteredAt = exit ? nodeEnteredAt : Date.now();
    const payload = persist({
      started: nextStarted,
      paused: exit,
      nodeEnteredAt: nextNodeEnteredAt,
    });
    if (payload.storageSaved) {
      setLastSavedAt(payload.savedAt);
    }
    setIsPausedSave(exit);
    setSaveStatus(
      payload.storageSaved
        ? `저장됨 ${formatSaveTime(payload.savedAt)}`
        : "브라우저 저장소를 사용할 수 없어 현재 탭에서만 진행됩니다.",
    );
    if (exit) {
      setStarted(false);
    } else {
      setNodeEnteredAt(nextNodeEnteredAt);
    }
  }

  function legacyRefreshLocalErrorLog() {
    const rawErrorLog = readStoredValue(ERROR_LOG_STORAGE_KEY, "null");
    const localErrorLog = parseErrorLog(rawErrorLog);
    if (localErrorLog && rawErrorLog !== JSON.stringify(localErrorLog)) {
      writeStoredValue(ERROR_LOG_STORAGE_KEY, JSON.stringify(localErrorLog));
    }
    setLocalErrorEntries(Array.isArray(localErrorLog?.entries) ? localErrorLog.entries : []);
    refreshSaveSlots();
  }

  function legacyRefreshSaveSlots() {
    const localSaveSlots = parseRecoverySlots(readStoredValue(SAVE_SLOT_STORAGE_KEY, "null"));
    setSaveSlots(Array.isArray(localSaveSlots?.slots) ? localSaveSlots.slots : []);
  }

  function legacyDismissRecoveryNotice() {
    setLastRecoveredError(null);
    persist({ lastError: null });
  }

  function legacyCloseRecoveryCenter() {
    setShowErrorLog(false);
    setShowRecoveryCenter(false);
    removeStoredValue(RECOVERY_CENTER_STORAGE_KEY);
  }

  function legacyClearLocalErrorLog() {
    const cleared = removeStoredValue(ERROR_LOG_STORAGE_KEY);
    if (!cleared) {
      recordAppError(new Error("Error log clear failed because local storage could not be written."), {}, "error-log-clear");
      setSaveStatus("Error log clear failed: browser storage is unavailable.");
      refreshLocalErrorLog();
      return;
    }
    setLocalErrorEntries([]);
    setLastRecoveredError(null);
    persist({ lastError: null });
  }

  function legacyDeleteSaveSlot(slotId) {
    const nextSlots = saveSlots.filter((slot) => slot.id !== slotId);
    const deleteSaved = writeStoredValue(
      SAVE_SLOT_STORAGE_KEY,
      JSON.stringify({
        recoverySlotSchemaVersion: RECOVERY_SLOT_SCHEMA_VERSION,
        slots: nextSlots,
      }),
    );
    if (!deleteSaved) {
      recordAppError(new Error("Save slot delete failed because local storage could not be written."), {}, "save-slot-delete");
      setSaveStatus("Delete failed: browser storage is unavailable.");
      return;
    }
    setSaveSlots(nextSlots);
  }

  function legacyRestoreSaveSlot(slot) {
    const restored = restoreRecoverySnapshot(slot?.snapshot);
    const repaired = normalizeSavedNestedState(normalizeSavedGameplayState(repairSavedRoute(restored)));
    if (!repaired || !isSavedStateShapeValid(repaired)) return;
    const nextState = normalizeSavedGameplayState({
      ...repaired,
      paused: true,
      started: false,
      savedAt: new Date().toISOString(),
    });
    const savedRestore = writeStoredValue(STORAGE_KEY, JSON.stringify(nextState));
    if (!savedRestore) {
      recordAppError(new Error("Save slot restore failed because local storage could not be written."), {}, "save-slot-restore");
      setSaveStatus("Restore failed: browser storage is unavailable.");
      return;
    }
    window.location.reload();
  }

  // Persistence is owned by the extracted lifecycle hook. Keep the old
  // implementations above available for rollback during this migration.
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
    const openingResources = previousResult ? applyEffect(initialResources, openingEffect) : initialResources;
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
    setTimerPenaltyApplied(false);
    setProbeUsed(false);
    setOpeningLegacy(legacy);
    setDecisionReveal(null);
    setEndingStep(0);
    setEndingTwistIndex(0);
    setEndingStep(0);
    setEndingTwistIndex(0);
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
      timerPenaltyApplied: false,
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
    setDecisionSeconds((value) => Math.max(0, value - probeSeconds));
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
    setDecisionSeconds(45);
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

  function normalizeCaseSummary(summary) {
    return {
      schemaVersion: summary?.schemaVersion ?? 1,
      primary: summary?.primary ?? ["responsibility", 0],
      secondary: summary?.secondary ?? ["protection", 0],
      thinking: summary?.thinking ?? ["persistence", 0],
      freeCount: summary?.freeCount ?? 0,
      averageResponseTime: summary?.averageResponseTime ?? 0,
      challengeClearCount: summary?.challengeClearCount ?? 0,
      reducedRiskCount: summary?.reducedRiskCount ?? 0,
      rhythmScore: summary?.rhythmScore ?? 0,
      cognitionScore: summary?.cognitionScore ?? 0,
      pressureAdaptScore: summary?.pressureAdaptScore ?? 0,
      reflectionScore: summary?.reflectionScore ?? 0,
      exploitPenalty: summary?.exploitPenalty ?? 0,
      burstScore: summary?.burstScore ?? summary?.momentumScore ?? 0,
      momentumScore: summary?.momentumScore ?? 0,
      momentumTier: summary?.momentumTier ?? "BUILDING",
      rank: summary?.rank ?? "C",
      outcomeChoiceId: summary?.outcomeChoiceId ?? null,
      outcomeNodeId: summary?.outcomeNodeId ?? null,
      runId: typeof summary?.runId === "string" ? summary.runId : "",
    };
  }

  const { queueTelemetry, commitPendingTelemetryQueue, retryPendingTelemetry, scheduleTelemetryRetry } = createTelemetryQueue({
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

  function getFreeTextBranchTarget(caseId, fromNodeId) {
    const branch = getCaseBranchNodes().find((item) => item.caseId === caseId);
    if (!branch || branch.nodeId === fromNodeId) return null;
    return branch.nextIds[0] ?? null;
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
      finalResources: nextResources,
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
    const clue = getClueReveal(challengeMatch, challengeRiskDelta, responseTimeSec);
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
    const nextNode = freeTextBranchTarget ?? choice.next;
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
    const caseSummary = completedNow
      ? {
          ...buildCaseSummary(nextTriggers, nextCognition, nextLog, finalResourcesWithTempo),
          endingVariant: getEndingVariant({ resources: finalResourcesWithTempo, discoveredClues: nextDiscoveredClues, log: nextLog }),
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
      const { rows: nextLocalRankingRows, saved: localRankingSaved } = appendLocalRankingRow(localRankingRow);
      setLocalRankingRows(nextLocalRankingRows);
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
      const { rows: nextLocalRankingRows, saved: seasonRankingSaved } = appendLocalRankingRow(seasonLocalRankingRow);
      setLocalRankingRows(nextLocalRankingRows);
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
      timerPenaltyApplied: false,
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
    setLocalRankingRows([]);
    setLocalErrorEntries([]);
    setSaveSlots([]);
    setLastRecoveredError(null);
    setNodeId("start");
    setResources(initialResources);
    setLog([]);
    setTriggers(makeEmptyScores(triggerLabels));
    setCognition(makeEmptyScores(cognitionLabels));
    setProtocolUsed(false);
    setTimerPenaltyApplied(false);
    setProbeUsed(false);
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
    saveSuppressed = false;
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
      setLocalRankingRows([]);
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
    setTimerPenaltyApplied(false);
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
        timerPenaltyApplied: false,
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
    const localErrorLog = parseErrorLog(readStoredValue(ERROR_LOG_STORAGE_KEY, "null"));
    const localSaveSlots = parseRecoverySlots(readStoredValue(SAVE_SLOT_STORAGE_KEY, "null"));
    const payload = {
      saveSchemaVersion: SAVE_SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      exportMode: includeDiagnostics ? "diagnostic" : "summary",
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
      gameplay: {
        rank: resultRank,
        momentumScore,
        momentumTier,
        rhythmScore,
        cognitionScore,
        pressureAdaptScore,
        reflectionScore,
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
      telemetryEnabled,
      dataConsent,
      sessionCode,
    };
    if (includeDiagnostics) {
      payload.playerName = playerName;
      payload.playtestFeedback = playtestFeedback;
      payload.log = log;
      payload.sessionId = sessionId;
      payload.pendingTelemetry = pendingTelemetry;
      payload.errorLog = Array.isArray(localErrorLog?.entries) ? localErrorLog.entries : [];
      payload.saveSlots = Array.isArray(localSaveSlots?.slots) ? localSaveSlots.slots : [];
      payload.trace = getTraceEvents();
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = includeDiagnostics ? `trigger-diagnostic-${Date.now()}.json` : `trigger-summary-${Date.now()}.json`;
    anchor.type = "application/json";
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    window.setTimeout(() => {
      anchor.remove();
      URL.revokeObjectURL(url);
    }, 1000);
  }

  async function copySessionCode() {
    if (await copyText(sessionCode)) {
      setCopyStatus("복사됨");
    } else {
      setCopyStatus("복사 실패");
    }
    window.setTimeout(() => setCopyStatus(""), 1600);
  }

  async function copyDiagnosticTrace() {
    const copied = await copyText(JSON.stringify(getTraceEvents(), null, 2));
    setCopyStatus(copied ? "Trace copied" : "Copy failed");
    window.setTimeout(() => setCopyStatus(""), 1600);
  }

  async function copyReplayLink() {
    const seed = {
      currentCase: fallbackCaseId,
      nodeId: resolvedNodeId,
      resources,
      log: routeTimeline.map((entry) => ({ nodeId: entry.nodeId, choiceId: entry.choiceId })),
    };
    const encoded = encodeReplaySeed(seed);
    const replayUrl = encoded
      ? `${window.location.origin}${window.location.pathname}?${REPLAY_QUERY_KEY}=${encoded}`
      : "";
    const copied = replayUrl ? await copyText(replayUrl) : false;
    setCopyStatus(copied ? "Replay link copied" : "Copy failed");
    window.setTimeout(() => setCopyStatus(""), 1600);
  }

  const result = useMemo(() => {
    return createCaseSummary(triggers, cognition, log, {
      resources,
      schemaVersion: SAVE_SCHEMA_VERSION,
      includeLongestDecision: true,
    });
  }, [triggers, cognition, log, resources]);
  const endingVariant = useMemo(
    () => getEndingVariant({ resources, discoveredClues, log }),
    [discoveredClues, log, resources],
  );
  const latestChoiceFeedback = getChoiceOutcomeFeedback(log.at(-1));
  const endingPreview = getEndingPreview(endingVariant);
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
  const endingProfile = {
    ending_seal: {
      tag: "봉인",
      title: "당신은 문을 닫았지만, 흔적은 남겼다.",
      text: "데이터를 봉인해 다시 이용되지 않게 했습니다. 그러나 마지막 후폭풍에서 고른 태도는 당신이 지키려는 것이 침묵인지 안전인지 드러냈습니다.",
    },
    ending_reform: {
      tag: "개혁",
      title: "당신은 실험을 규칙으로 바꾸었다.",
      text: "트리거를 없애는 대신 동의와 감시를 붙였습니다. 사람을 읽는 힘을 누가, 언제, 어디까지 쓸 수 있는지 직접 정했습니다.",
    },
    ending_expose: {
      tag: "폭로",
      title: "당신은 관찰자를 세상 밖으로 끌어냈다.",
      text: "실험의 구조를 공개했습니다. 혼란은 시작됐지만, 적어도 다음 참가자는 자신이 관찰당하고 있다는 사실을 알고 선택할 수 있습니다.",
    },
  }[finalEndingEntry?.choiceId] ?? {
    tag: "미확정",
    title: "당신의 마지막 선택은 아직 기록 중이다.",
    text: "마지막 폴더의 문장이 완전히 닫히지 않았습니다. 다음 플레이에서는 다른 결말의 조건을 시험해 보십시오.",
  };

  function updateCurrentFeedback(patch) {
    const normalizedPatch =
      typeof patch.comment === "string"
        ? { ...patch, comment: limitText(patch.comment, FEEDBACK_COMMENT_MAX_LENGTH) }
        : patch;
    const nextFeedback = {
      ...playtestFeedback,
      [currentCase]: {
        ...currentFeedback,
        ...normalizedPatch,
      },
    };
    setPlaytestFeedback(nextFeedback);
    setFeedbackStatus("");
    persist({ playtestFeedback: nextFeedback });
  }

  async function submitCurrentFeedback() {
    if (isSubmittingFeedback) return;
    if (activeFeedbackPrivacySignals.length > 0) {
      setFeedbackStatus("식별 정보로 보일 수 있는 표현을 익명화한 뒤 저장해 주세요.");
      return;
    }

    setIsSubmittingFeedback(true);
    const savedAt = new Date().toISOString();
    const feedback = {
      ...currentFeedback,
      comment: limitText(currentFeedback.comment, FEEDBACK_COMMENT_MAX_LENGTH),
      savedAt,
    };
    const nextFeedback = {
      ...playtestFeedback,
      [currentCase]: feedback,
    };
    setPlaytestFeedback(nextFeedback);
    persist({ playtestFeedback: nextFeedback });

    if (!telemetryEnabled || !dataConsent) {
      setFeedbackStatus(
        telemetryEnabled
          ? "로컬에 저장했습니다. 데이터 제공 동의가 없어 원격 저장은 건너뛰었습니다."
          : "로컬에 저장했습니다. 원격 저장 미설정 상태라 원격 저장은 건너뛰었습니다.",
      );
      setIsSubmittingFeedback(false);
      return;
    }

    const feedbackTelemetryPayload = {
        session_id: sessionId,
        session_code: sessionCode,
        case_id: currentCase,
        case_title: activeCaseMeta?.title ?? currentCase,
        submitted_at: savedAt,
        clarity_score: Number(feedback.clarity) || null,
        difficulty_score: Number(feedback.difficulty) || null,
        comment: feedback.comment.trim() || null,
      };

    try {
      await saveFeedbackTelemetry(feedbackTelemetryPayload);
      setFeedbackStatus("피드백을 저장했습니다.");
    } catch (error) {
      console.warn(error);
      queueTelemetry({
        id: `feedback-${currentCase}-${Date.now()}`,
        type: "feedback",
        label: `${activeCaseMeta?.label ?? currentCase} 피드백`,
        payload: feedbackTelemetryPayload,
      });
      setFeedbackStatus("로컬에는 저장했습니다. 원격 저장 실패분은 대기열에 보관했습니다.");
    } finally {
      setIsSubmittingFeedback(false);
    }
  }

  function anonymizeFeedbackComment() {
    updateCurrentFeedback({
      comment: limitText(
        anonymizeSensitiveText(currentFeedback.comment),
        FEEDBACK_COMMENT_MAX_LENGTH,
      ),
    });
  }

  const routeLength = getCaseRouteLength(fallbackCaseId);
  const routeIndex = getNodeRouteIndex(fallbackCaseId, resolvedNodeId);
  const debugTrace = getTraceEvents();
  const silentFailureCount = debugTrace.filter((event) => event.kind === "error" && String(event.note ?? "").startsWith("silent-")).length;
  const progress = isResult
    ? 100
    : Math.round(((Math.max(0, routeIndex) + 1) / Math.max(1, routeLength)) * 100);
  const completedCaseResultList = seasonCasesBase
    .filter((caseItem) => caseResults[caseItem.id])
    .map((caseItem) => ({ ...caseItem, result: normalizeCaseSummary(caseResults[caseItem.id]) }));
  const seasonJourney = completedCaseResultList.map((caseItem) => ({
    ...caseItem,
    outcome: getCaseOutcome({ caseId: caseItem.id, choiceId: caseItem.result.outcomeChoiceId }),
    carryover: getOutcomeCarryover({ caseId: caseItem.id, choiceId: caseItem.result.outcomeChoiceId }),
  }));
  const nextCaseSignal = nextCaseSignals[currentCase];
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
  const scoreBreakdown = [
    {
      label: "사고 리듬",
      value: rhythmScore,
      text: `${rhythmScore}점`,
      note: "즉답이나 방치가 아니라, 압박을 읽고 결론까지 밀어낸 시간대입니다.",
    },
    {
      label: "관점 전환",
      value: cognitionScore,
      text: `${cognitionScore}점`,
      note: "같은 방식만 반복하지 않고 추론, 위험, 재구성, 버티기 사이를 오간 흔적입니다.",
    },
    {
      label: "압박 대응",
      value: pressureAdaptScore,
      text: `${pressureAdaptScore}점`,
      note: "위험을 무조건 피한 점수가 아니라, 상승한 압박을 다시 회수한 능력입니다.",
    },
    {
      label: "구조 재설계",
      value: reflectionScore,
      text: `${reflectionScore}점`,
      note: "선택지 밖에서 이해관계자, 조건, 근거, 실패 가능성을 구체화한 정도입니다.",
    },
    {
      label: "즉답 패널티",
      value: exploitPenalty,
      text: exploitPenalty > 0 ? `-${exploitPenalty}점` : "없음",
      note: "표시된 정보만 따라 빠르게 누르는 플레이가 반복될 때만 감점됩니다.",
    },
  ];
  const achievementBadges = [
    { title: `Burst ${momentumTier}`, text: `사고 버스트 ${momentumScore}점을 기록했습니다.` },
    result.freeCount > 0
      ? { title: "Board Breaker", text: "선택지 밖에서 판을 다시 짰습니다." }
      : { title: "Route Follower", text: "주어진 선택지 안에서 비용을 비교했습니다." },
    result.averageResponseTime >= 20
      ? { title: "Slow Thinker", text: "한 장면 이상에서 판단을 오래 붙잡았습니다." }
      : { title: "Fast Closer", text: "빠르게 결론을 닫는 플레이를 보였습니다." },
    reducedRiskCount > 0
      ? { title: "Risk Cutter", text: `${reducedRiskCount}번 위험 압력을 낮췄습니다.` }
      : { title: "Heat Taker", text: "위험을 낮추기보다 다른 목표를 우선했습니다." },
    challengeClearCount > 0
      ? { title: "Challenge Clear", text: `${challengeClearCount}개 장면 도전을 달성했습니다.` }
      : { title: "Open Quest", text: "장면 도전은 남았고, 선택 로그만 기록됐습니다." },
    currentChallengeStreak >= 5
      ? { title: "Perfect Run", text: `${currentChallengeStreak}연속 장면 목표를 맞혀 최고 보상을 열었습니다.` }
      : currentChallengeStreak >= 3
      ? { title: "Streak Breakthrough", text: `${currentChallengeStreak}연속 장면 목표를 맞혀 추가 보상을 열었습니다.` }
      : { title: "Chain Starter", text: "장면 목표를 연속으로 맞히면 추가 보상이 열립니다." },
    flowSurgeCount > 0
      ? { title: "Flow Surge", text: `${flowSurgeCount}번 보너스 자원 회복을 만들었습니다.` }
      : { title: "No Surge", text: "챌린지와 위험 제어가 아직 보너스로 이어지지 않았습니다." },
    riskTier === "CRITICAL"
      ? { title: "Crisis Runner", text: "높은 압력 상태로 케이스를 통과했습니다." }
      : { title: "Pressure Keeper", text: "위험 압력을 통제 가능한 범위에 묶었습니다." },
  ];
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

  function getCaseStatusText(status) {
    if (status === "PLAYING") return "진행 중";
    if (status === "OPEN") return "시작 가능";
    if (status === "COMPLETE") return "완료됨";
    return "이전 케이스 필요";
  }

  function formatSaveTime(value) {
    if (!value) return "";
    try {
      return new Intl.DateTimeFormat("ko-KR", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(value));
    } catch {
      return "";
    }
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
  const introView = { AdaptiveMusic, musicModeKey, renderRecoveryNotice, renderErrorLogPanel, renderSaveStatus, setShowRanking, GAME_TITLE, simplifyPlayerText, activeCaseMeta, nextParticipantMessage, GAME_SUBTITLE, playStyleOptions, playStyle, setPlayStyle, persist, seasonCasesBase, caseObjectives, triggerLabSignals, hasResumableSave, node, formatSaveTime, lastSavedAt, log, progress, playerName, PLAYER_NAME_MAX_LENGTH, setPlayerName, limitText, startGame, dataConsent, setDataConsent, pendingTelemetryRef, setTelemetryStatus, telemetryEnabled, isOnline, telemetrySummary, sessionCode, debugToolsEnabled, showErrorLog, setShowErrorLog, unlockAllCasesForTest, debugCaseSelectRef, debugCaseId, debugCaseIdRef, debugNodeOptions, debugNodeId, debugNodeIdRef, debugNodeSelectRef, caseSequence, nodes, setDebugCaseId, setDebugNodeId, startDebugNode, playGuideItems, completedCaseResultList, seasonJourney, resourceMeta, seasonCases, caseResults, completedCases, currentCase, startCase, getCaseStatusText, resumeSavedGame, activePlayStyle, setPendingTelemetry, setSaveStatus, nodeOrders, normalizeCaseSummary, operatorOrigin, setOperatorOrigin, operatorProfile, operatorProfiles: getOperatorProfiles() };
  if (!started) {
    introView.startNewGamePlus = startNewGamePlus;
    introView.newGamePlusUnlocked = newGamePlusUnlocked;
    introView.tutorialSteps = tutorialSteps;
    introView.playStyleUnlocks = playStyleUnlocks;
    introView.seasonGoals = seasonGoals;
    introView.pastRunMemory = pastRunMemory;
    return <Suspense fallback={<main className="shell screen-loading" aria-busy="true" />}><IntroScreen view={introView} /></Suspense>;
  }
  function advanceEndingStep() {
    if (endingStep === 0 && endingTwistIndex < 2) {
      setEndingTwistIndex((index) => index + 1);
      return;
    }
    setEndingStep((step) => Math.min(3, step + 1));
  }

  function saveNextParticipantMessage() {
    const message = limitText(nextParticipantMessage.trim(), 180);
    setNextParticipantMessage(message);
    writeStoredValue(NEXT_PARTICIPANT_MESSAGE_KEY, message);
    setEndingStep(3);
  }

  const resultView = { AdaptiveMusic, musicModeKey, renderDecisionReveal, renderRecoveryNotice, renderErrorLogPanel, screenReaderStatus, currentCase, endingStep, endingTwistIndex, finalAftermathEntry, finalEndingEntry, caseResults, decisionFingerprint, observationLedger, observerPattern, endingProfile, endingVariant, advanceEndingStep, endingQuietReady, nextParticipantMessage, setNextParticipantMessage, saveNextParticipantMessage, unopenedRecordCount, unopenedClueCount, unopenedBranchCount, endingQuietLine, skipEndingQuietHold, GAME_TITLE, startCase, setStarted, setShowRanking, showSeasonMap, debugToolsEnabled, showErrorLog, setShowErrorLog, exportPlaytestLog, reset, playerName, activeCaseMeta, sceneTitleRef, triggerLabels, triggers, result, caseOutcome, resultRank, momentumTier, momentumScore, rankLine, scoreBreakdown, clamp, easyCognitionLabels, cognitionLabels, formatRiskDelta, counterfactualReport, sessionCode, telemetryStatus, pendingTelemetry, retryPendingTelemetry, scheduleTelemetryRetry, telemetryEnabled, dataConsent, isOnline, isRetryingTelemetry, copySessionCode, copyStatus, nextCaseSignal, resultBridge, achievementBadges, feedbackPrompts, currentFeedback, updateCurrentFeedback, FEEDBACK_COMMENT_MAX_LENGTH, activeFeedbackPrivacySignals, anonymizeFeedbackComment, submitCurrentFeedback, isSubmittingFeedback, feedbackStatus, routeTimeline, resourceMeta, explainResourceTradeoff, log, clueCount, clueHypotheses, renderSceneLines, operatorProfile, authorityState, latestChoiceFeedback, endingPreview };
  resultView.chapterUiModel = chapterUiModel;
  resultView.endingSceneProfile = getEndingSceneProfile(endingVariant.id);
  resultView.endingVisualClass = getEndingVisualClass(endingVariant.id);
  resultView.failureObjectives = getFailureObjectives(endingVariant);
  resultView.delayedConsequences = delayedConsequences;
  resultView.rankingComparison = rankingComparison;
  resultView.seasonGoals = seasonGoals;
  resultView.balanceSignals = balanceSignals;
  resultView.startRecoveryRoute = startRecoveryRoute;
  if (isResult) {
    return <Suspense fallback={<main className="shell screen-loading" aria-busy="true" />}><ResultScreen view={resultView} /></Suspense>;
  }

  const playView = { suspenseState, AdaptiveMusic, musicModeKey, renderDecisionReveal, renderRecoveryNotice, renderErrorLogPanel, screenReaderStatus, simplifyPlayerText, caseObjectives, currentCase, node, triggerLabels, openingLegacy, operatorBriefs, chapterRules, relationshipScores, authorityState, pressureCascade, riskPressure, playGuideItems, sceneTitleRef, saveCurrentGame, reset, renderSaveStatus, progress, easyRiskLabels, riskTier, activeBonus, freeTextCombo, currentAverageResponseTime, log, observerPattern, clueCount, discoveredClues, currentChallengeStreak, momentumTier, streakGoal, streakRemaining, momentumScore, decisionSeconds, protocolUsed, isAdvancing, decisionFingerprint, decisionLedger, resourceMeta, sceneChallenge, triggerLabSignals, narrativeSpine, questSteps, sceneVisuals, speakerProfile, speakerPortrait, latestFreeTextSuccess, resolvedNodeId, sceneDirection, latestBeat, renderSceneLines, setMemoOpened, echo, probeUsed, echoProbeCost, requestEchoProbe, getEchoChecks, pendingChoice, showTacticalDetails, setShowTacticalDetails, decisionForecasts, pressureLeader, pressureLensForecast, tradeoffLensForecast, previewChoice, describeForecast, evidenceCount, pendingChoiceRead, pendingChoiceForecast, commitConsoleRef, formatRiskDelta, formatForecastRisk, setPendingChoice, commitConfirmRef, choose, fixedChoices, getEffectiveChoiceRead, getRiskPressure, getChallengeMatch, choiceButtonsRef, handleChoiceClick, beginChoiceHold, endChoiceHold, speechifyChoice, getChoiceSubtext, getDramaticChoiceLabel, explainResourceTradeoff, easyCognitionLabels, cognitionLabels, freeChoice, boardChangePrompts, updateFreeText, freeText, FREE_TEXT_MAX_LENGTH, freeTextBlockedByPrivacy, activePrivacySignals, anonymizeFreeText, activeFreeTextSignalCount, freeTextSignals, freeTextPreview, applyEffect, resources, playerName, activePlayStyle, turnBriefItems, completedCases, activeCaseMeta, debugToolsEnabled, fallbackCaseId, routeIndex, routeLength, silentFailureCount, copyReplayLink, copyDiagnosticTrace, operatorProfile, latestChoiceFeedback };
  playView.clueHypotheses = clueHypotheses;
  playView.chapterUiModel = chapterUiModel;
  playView.relationshipQuest = relationshipQuest;
  playView.delayedConsequences = delayedConsequences;
  playView.playStyleUnlocks = playStyleUnlocks;
  playView.interlude = interlude;
  playView.balanceSignals = balanceSignals;
  playView.relationshipScene = relationshipScene;
  playView.pastRunMemory = pastRunMemory;
  return <Suspense fallback={<main className="shell screen-loading" aria-busy="true" />}><PlayScreen view={playView} /></Suspense>;

}
