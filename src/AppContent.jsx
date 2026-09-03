import { Suspense, lazy, useMemo, useState } from "react";

import {
  PLAYER_NAME_MAX_LENGTH,
  RECOVERY_CENTER_STORAGE_KEY,
  SAVE_SCHEMA_VERSION,
  STORAGE_KEY,
  normalizePlayerName,
  getInvalidSavedStateKeys,
  isSavedStateShapeValid,
  parseCurrentSavedState,
  readStoredValue,
  removeStoredValue,
  writeStoredValue,
} from "./appConfig.js";
import { CASE_RESULT_NODES, CASE_SEQUENCE, CASE_START_NODES, caseObjectives, seasonCasesBase } from "./gameCases.js";
import { cognitionLabels, initialResources, triggerLabels } from "./gameConstants.js";
import { getLeaderboardHeadline } from "./ranking.js";
import { AdaptiveMusic } from "./components/AdaptiveMusic.jsx";
import { createIntroView, createTelemetrySummary } from "./viewModels/appViewModels.js";
import { createSeasonCases } from "./viewModels/seasonViewModels.js";
import { useLocalRanking } from "./state/useLocalRanking.js";
import { useLeaderboard } from "./state/useLeaderboard.js";
import { getReplaySeedFromLocation } from "./state/trace.js";
import {
  getOperatorProfile,
  getOperatorProfiles,
  getOriginPrologue,
  getPastRunMemory,
  getPlayStyleUnlocks,
  getSeasonGoals,
  getTutorialSteps,
} from "./advancedSystems.js";
import { playGuideItems, playStyleOptions, resourceMeta, triggerLabSignals } from "./appCopy.js";
import { getSessionCode, getSessionId, telemetryEnabled } from "./telemetry.js";
import { simplifyPlayerText } from "./playerLanguage.js";
import { recordAppError } from "./state/errorRecovery.js";

const GameRuntime = lazy(() => import("./GameRuntime.jsx").then(({ GameRuntime }) => ({ default: GameRuntime })));
const IntroScreen = lazy(() => import("./screens/IntroScreen.jsx").then(({ IntroScreen }) => ({ default: IntroScreen })));
const RankingScreen = lazy(() => import("./screens/RankingScreen.jsx").then(({ RankingScreen }) => ({ default: RankingScreen })));

const GAME_TITLE = "CRITICAL POINT";
const GAME_TITLE_READING = "임계점";
const GAME_SUBTITLE = "판단이 깊어지는 순간";
const NEW_GAME_PLUS_KEY = "critical-point-new-game-plus-unlocked";
const OPERATOR_ORIGIN_KEY = "critical-point-operator-origin";

let saveSuppressed = false;

export function suppressSaves() {
  saveSuppressed = true;
}

export function resumeSaves() {
  saveSuppressed = false;
}

function createRunId() {
  return globalThis.crypto?.randomUUID?.() ?? `run-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function makeEmptyScores(labels) {
  return Object.fromEntries(Object.keys(labels).map((key) => [key, 0]));
}

function limitText(value, maxLength) {
  return typeof value === "string" ? value.slice(0, maxLength) : "";
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

function readCurrentSave() {
  const saved = parseCurrentSavedState(readStoredValue(STORAGE_KEY, "null"), SAVE_SCHEMA_VERSION);
  if (!saved?.currentCase || !saved?.nodeId) return saved;
  const casePrefixes = {
    case01: /^(start|accounting|payday|competitor|board|final|result|c1_)/,
    case02: /^c2_/,
    case03: /^c3_/,
    case04: /^c4_/,
    case05: /^c5_/,
    final: /^f_/,
  };
  const nodeMatchesCase =
    saved.nodeId === CASE_RESULT_NODES[saved.currentCase] ||
    Boolean(casePrefixes[saved.currentCase]?.test(saved.nodeId));
  if (nodeMatchesCase) return saved;
  const repaired = {
    ...saved,
    nodeId: CASE_START_NODES[saved.currentCase] ?? "start",
    paused: true,
    lastError: {
      id: `repair-${Date.now()}`,
      occurredAt: new Date().toISOString(),
      source: "save-integrity",
      message: "Saved route was repaired before resume.",
      currentCase: saved.currentCase,
      nodeId: CASE_START_NODES[saved.currentCase] ?? "start",
    },
  };
  writeStoredValue(STORAGE_KEY, JSON.stringify(repaired));
  return repaired;
}

function reportInvalidShellSave(saved) {
  if (!saved || isSavedStateShapeValid(saved)) return;
  const error = new Error(`[silent:save-shape] ${JSON.stringify({
    currentCase: saved?.currentCase,
    nodeId: saved?.nodeId,
    invalidKeys: getInvalidSavedStateKeys(saved),
  })}`);
  error.name = "SilentRouteFailure";
  recordAppError(error, {}, "silent-save-shape");
}

function readShellSave() {
  const saved = readCurrentSave();
  reportInvalidShellSave(saved);
  return saved;
}

function createStartSave({ playerName, playStyle, dataConsent }) {
  const now = Date.now();
  return {
    saveSchemaVersion: SAVE_SCHEMA_VERSION,
    runId: createRunId(),
    playerName: normalizePlayerName(playerName) || "분석관",
    playStyle,
    openingLegacy: null,
    dataConsent,
    started: true,
    currentCase: "case01",
    completedCases: [],
    discoveredClues: [],
    caseResults: {},
    playtestFeedback: {},
    nodeId: "start",
    resources: initialResources,
    log: [],
    triggers: makeEmptyScores(triggerLabels),
    cognition: makeEmptyScores(cognitionLabels),
    freeText: "",
    echo: "",
    nodeEnteredAt: now,
    pendingTelemetry: [],
    protocolUsed: false,
    timerPenaltyCount: 0,
    probeUsed: false,
    investigatedTargets: {},
    hypothesisDecisions: {},
    paused: false,
    savedAt: new Date(now).toISOString(),
  };
}

const debugToolsEnabled =
  import.meta.env.VITE_ENABLE_DEBUG_TOOLS === "true" ||
  (import.meta.env.DEV && new URLSearchParams(globalThis.location?.search ?? "").get("debug") === "1");

export function AppContent({ onSuppressSaves = suppressSaves }) {
  const replaySeed = useMemo(() => getReplaySeedFromLocation(), []);
  const saved = useMemo(() => readShellSave(), []);
  const recoveryCenterRequested = readStoredValue(RECOVERY_CENTER_STORAGE_KEY, "") === "1";
  const [runtimeActive, setRuntimeActive] = useState(
    () =>
      debugToolsEnabled ||
      recoveryCenterRequested ||
      Boolean(replaySeed) ||
      Boolean(saved?.started) ||
      Boolean(saved?.lastError) ||
      Boolean(saved?.dataConsent && saved?.pendingTelemetry?.length > 0),
  );
  const [initialStartState, setInitialStartState] = useState(null);
  const [showRanking, setShowRanking] = useState(false);
  const [playerName, setPlayerName] = useState(() => normalizePlayerName(saved?.playerName));
  const [playStyle, setPlayStyle] = useState(saved?.playStyle ?? "instinct");
  const [dataConsent, setDataConsent] = useState(Boolean(saved?.dataConsent));
  const [saveStatus, setSaveStatus] = useState("");
  const [operatorOrigin, setOperatorOriginState] = useState(() => readStoredValue(OPERATOR_ORIGIN_KEY, "courier"));
  const sessionId = useMemo(() => getSessionId(), []);
  const sessionCode = useMemo(() => getSessionCode(sessionId), [sessionId]);
  const pendingTelemetryRef = useMemo(() => ({ current: saved?.pendingTelemetry ?? [] }), [saved?.pendingTelemetry]);
  const { localRankingRows } = useLocalRanking();
  const isOnline = globalThis.navigator?.onLine !== false;
  const { leaderboard, leaderboardStatus, leaderboardError } = useLeaderboard({
    showRanking,
    isOnline,
    localLeaderboardRows: localRankingRows,
    localSeasonLeaderboardRow: null,
  });

  const saveControls = useMemo(
    () => ({
      suppress: suppressSaves,
      resume: resumeSaves,
      isSuppressed: () => saveSuppressed,
    }),
    [],
  );

  if (runtimeActive) {
    return (
      <Suspense fallback={<main className="shell screen-loading" aria-busy="true" />}>
        <GameRuntime
          onSuppressSaves={onSuppressSaves}
          saveControls={saveControls}
          initialStartState={initialStartState}
        />
      </Suspense>
    );
  }

  if (showRanking) {
    return (
      <Suspense fallback={<main className="shell screen-loading" aria-busy="true" />}>
        <RankingScreen
          Music={AdaptiveMusic}
          gameTitle={GAME_TITLE}
          leaderboardStatus={leaderboardStatus}
          rankingHeadline={getLeaderboardHeadline(leaderboard)}
          leaderboardError={leaderboardError}
          leaderboard={leaderboard}
          runId={saved?.runId ?? ""}
          sessionCode={sessionCode}
          triggerLabels={triggerLabels}
          onClose={() => setShowRanking(false)}
        />
      </Suspense>
    );
  }

  function persist(nextState) {
    const current = readCurrentSave() ?? createStartSave({ playerName, playStyle, dataConsent });
    const payload = { ...current, ...nextState, started: false, savedAt: new Date().toISOString() };
    const storageSaved = writeStoredValue(STORAGE_KEY, JSON.stringify(payload));
    if (!storageSaved) setSaveStatus("브라우저 저장소를 사용할 수 없어 현재 상태만 진행합니다.");
    return { ...payload, storageSaved };
  }

  function startGame() {
    const payload = createStartSave({ playerName, playStyle, dataConsent });
    removeStoredValue(RECOVERY_CENTER_STORAGE_KEY);
    if (!writeStoredValue(STORAGE_KEY, JSON.stringify(payload))) {
      setSaveStatus("브라우저 저장소를 사용할 수 없어 현재 상태만 진행합니다.");
      setInitialStartState(payload);
    }
    resumeSaves();
    setRuntimeActive(true);
  }

  function resumeSavedGame() {
    resumeSaves();
    setRuntimeActive(true);
  }

  function setOperatorOrigin(value) {
    const nextOrigin = getOperatorProfiles().some((profile) => profile.id === value) ? value : "courier";
    setOperatorOriginState(nextOrigin);
    writeStoredValue(OPERATOR_ORIGIN_KEY, nextOrigin);
  }

  const activeCaseMeta = seasonCasesBase.find((caseItem) => caseItem.id === (saved?.currentCase ?? "case01"));
  const activePlayStyle = playStyleOptions.find((style) => style.id === playStyle) ?? playStyleOptions[0];
  const operatorProfile = getOperatorProfile(operatorOrigin);
  const introView = createIntroView(
    {
      AdaptiveMusic,
      musicModeKey: "intro",
      triggerLabels,
      renderRecoveryNotice: () => null,
      renderErrorLogPanel: () => null,
      renderSaveStatus: () => (saveStatus ? <p className="save-status">{saveStatus}</p> : null),
      setShowRanking,
      GAME_TITLE,
      GAME_TITLE_READING,
      simplifyPlayerText,
      activeCaseMeta,
      nextParticipantMessage: "",
      GAME_SUBTITLE,
      playStyleOptions,
      playStyle,
      setPlayStyle,
      persist,
      seasonCasesBase,
      caseObjectives,
      triggerLabSignals,
      hasResumableSave: Boolean(saved?.currentCase && saved?.nodeId),
      node: { title: saved?.nodeId ?? "start" },
      formatSaveTime,
      lastSavedAt: saved?.savedAt ?? "",
      log: Array.isArray(saved?.log) ? saved.log : [],
      progress: 0,
      playerName,
      PLAYER_NAME_MAX_LENGTH,
      setPlayerName,
      limitText,
      startGame,
      dataConsent,
      setDataConsent,
      pendingTelemetryRef,
      setTelemetryStatus: () => {},
      telemetryEnabled,
      isOnline,
      telemetrySummary: createTelemetrySummary({ dataConsent, isOnline, telemetryEnabled }),
      sessionCode,
      debugToolsEnabled: false,
      showErrorLog: false,
      setShowErrorLog: () => {},
      unlockAllCasesForTest: () => setRuntimeActive(true),
      debugCaseSelectRef: null,
      debugCaseId: "case01",
      debugCaseIdRef: null,
      debugNodeOptions: [],
      debugNodeId: "start",
      debugNodeIdRef: null,
      debugNodeSelectRef: null,
      caseSequence: CASE_SEQUENCE,
      nodes: {},
      setDebugCaseId: () => {},
      setDebugNodeId: () => {},
      startDebugNode: () => setRuntimeActive(true),
      playGuideItems,
      completedCaseResultList: [],
      seasonJourney: [],
      resourceMeta,
      seasonCases: createSeasonCases({ seasonCasesBase, completedCases: [], currentCase: "case01" }),
      caseResults: saved?.caseResults ?? {},
      completedCases: saved?.completedCases ?? [],
      currentCase: saved?.currentCase ?? "case01",
      startCase: startGame,
      getCaseStatusText: (status) =>
        status === "PLAYING" ? "진행 중" : status === "OPEN" ? "시작 가능" : status === "COMPLETE" ? "완료됨" : "이전 케이스 필요",
      resumeSavedGame,
      activePlayStyle,
      setPendingTelemetry: () => {},
      setSaveStatus,
      nodeOrders: {},
      normalizeCaseSummary: (summary) => summary,
      operatorOrigin,
      setOperatorOrigin,
      operatorProfile,
      operatorProfiles: getOperatorProfiles(),
      originPrologue: getOriginPrologue(operatorOrigin),
    },
    {
      startNewGamePlus: startGame,
      newGamePlusUnlocked: readStoredValue(NEW_GAME_PLUS_KEY, "false") === "true",
      tutorialSteps: getTutorialSteps(),
      playStyleUnlocks: getPlayStyleUnlocks(playStyle, false),
      seasonGoals: getSeasonGoals(),
      pastRunMemory: getPastRunMemory({}),
    },
  );

  return (
    <Suspense fallback={<main className="shell screen-loading" aria-busy="true" />}>
      <IntroScreen view={introView} />
    </Suspense>
  );
}
