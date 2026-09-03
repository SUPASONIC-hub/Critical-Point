import { Suspense, lazy, useMemo, useState } from "react";

import {
  NEW_GAME_PLUS_KEY,
  NEW_GAME_PLUS_MEMORY_KEY,
  NEXT_PARTICIPANT_MESSAGE_KEY,
  OPERATOR_ORIGIN_KEY,
  RECOVERY_CENTER_STORAGE_KEY,
  SAVE_SCHEMA_VERSION,
  STORAGE_KEY,
  createRunId,
  debugToolsEnabled,
  makeEmptyScores,
  normalizePlayerName,
  getInvalidSavedStateKeys,
  isSavedStateShapeValid,
  parseCurrentSavedState,
  readStoredValue,
  removeStoredValue,
  writeStoredValue,
} from "./appConfig.js";
import { CASE_RESULT_NODES, CASE_START_NODES } from "./gameCases.js";
import { cognitionLabels, initialResources, triggerLabels } from "./gameConstants.js";
import { getLeaderboardHeadline } from "./ranking.js";
import { AdaptiveMusic } from "./components/AdaptiveMusic.jsx";
import { createIntroViewModel } from "./viewModels/introViewModel.js";
import { useLocalRanking } from "./state/useLocalRanking.js";
import { useLeaderboard } from "./state/useLeaderboard.js";
import { getReplaySeedFromLocation } from "./state/trace.js";
import { getOperatorProfiles } from "./advancedSystems.js";
import { GAME_TITLE } from "./appCopy.js";
import { getSessionCode, getSessionId } from "./telemetry.js";
import { recordAppError } from "./state/errorRecovery.js";

const GameRuntime = lazy(() => import("./GameRuntime.jsx").then(({ GameRuntime }) => ({ default: GameRuntime })));
const IntroScreen = lazy(() => import("./screens/IntroScreen.jsx").then(({ IntroScreen }) => ({ default: IntroScreen })));
const RankingScreen = lazy(() => import("./screens/RankingScreen.jsx").then(({ RankingScreen }) => ({ default: RankingScreen })));

let saveSuppressed = false;

export function suppressSaves() {
  saveSuppressed = true;
}

export function resumeSaves() {
  saveSuppressed = false;
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

function readNewGamePlusMemory() {
  try {
    return JSON.parse(readStoredValue(NEW_GAME_PLUS_MEMORY_KEY, "{}")) ?? {};
  } catch {
    return {};
  }
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

  const introView = createIntroViewModel({
    AdaptiveMusic,
    playerName,
    setPlayerName,
    playStyle,
    setPlayStyle,
    dataConsent,
    setDataConsent,
    operatorOrigin,
    setOperatorOrigin,
    sessionCode,
    isOnline,
    hasResumableSave: Boolean(saved?.currentCase && saved?.nodeId),
    lastSavedAt: saved?.savedAt ?? "",
    log: Array.isArray(saved?.log) ? saved.log : [],
    caseResults: saved?.caseResults ?? {},
    completedCases: saved?.completedCases ?? [],
    currentCase: saved?.currentCase ?? "case01",
    newGamePlusUnlocked: readStoredValue(NEW_GAME_PLUS_KEY, "false") === "true",
    newGamePlusMemory: readNewGamePlusMemory(),
    nextParticipantMessage: readStoredValue(NEXT_PARTICIPANT_MESSAGE_KEY, ""),
    startGame,
    startCase: startGame,
    startNewGamePlus: startGame,
    resumeSavedGame,
    persist,
    setShowRanking,
    setSaveStatus,
    pendingTelemetryRef,
    renderSaveStatus: () => (saveStatus ? <p className="save-status">{saveStatus}</p> : null),
  });

  return (
    <Suspense fallback={<main className="shell screen-loading" aria-busy="true" />}>
      <IntroScreen view={introView} />
    </Suspense>
  );
}
