import { lazy, useEffect, useMemo, useState } from "react";

import {
  NEW_GAME_PLUS_KEY,
  NEW_GAME_PLUS_MEMORY_KEY,
  NEXT_PARTICIPANT_MESSAGE_KEY,
  OPERATOR_ORIGIN_KEY,
  RECOVERY_CENTER_STORAGE_KEY,
  SAVE_SCHEMA_VERSION,
  STORAGE_KEY,
  backUpUnreadableSave,
  claimTabToken,
  createRunId,
  debugToolsEnabled,
  makeEmptyScores,
  normalizePlayerName,
  getInvalidSavedStateKeys,
  hasRecoverySlots,
  isSavedStateShapeValid,
  parseCurrentSavedState,
  readStoredValue,
  readUnreadableSave,
  removeStoredValue,
  writeSaveState,
  writeStoredValue,
} from "./appConfig.js";
import { SEASON_ENTRY_CASE, SEASON_ENTRY_NODE } from "./gameCases.js";
import { cognitionLabels, triggerLabels } from "./gameConstants.js";
import { getLeaderboardHeadline } from "./ranking.js";
import { AdaptiveMusic } from "./components/AdaptiveMusic.jsx";
import { LazyScreen } from "./components/LazyScreen.jsx";
import { IntroScreen, loadGameRuntime, prefetchGameRuntime, queueRuntimeStartAction } from "./screens/IntroScreen.jsx";
import { createIntroViewModel } from "./viewModels/introViewModel.js";
import { useLocalRanking } from "./state/useLocalRanking.js";
import { useLeaderboard } from "./state/useLeaderboard.js";
import { useBoard } from "./state/useBoard.js";
import { useOverlayScreens } from "./state/useOverlayScreens.js";
import { createOpeningResources } from "./state/openingState.js";
import { getReplaySeedFromLocation } from "./state/trace.js";
import { getOperatorProfiles } from "./advancedSystems.js";
import { GAME_TITLE } from "./appCopy.js";
import { getSessionCode, getSessionId } from "./telemetry.js";
import { recordAppError } from "./state/errorRecovery.js";
import { loadedChunk } from "./state/chunkReload.js";

// The intro is the first thing painted, so it ships in the entry chunk: lazy()
// put a second round trip between the page and its first screen. The runtime
// stays lazy and starts downloading while the intro is read (see below).
// The runtime is what deals the table, and the table reads this tab's token, so
// it mounts once the token is known to be this tab's own (appConfig.claimTabToken).
// A first visit mounts once the season's first case has arrived; a device with
// a save, or a page opened from a replay link, once every case has
// (state/caseArrival.js): both name scenes anywhere in the season.
const GameRuntime = lazy(() =>
  Promise.all([loadGameRuntime(), claimTabToken()]).then(async ([runtime]) => {
    await runtime.prepareGameRuntime({
      hasSave: readStoredValue(STORAGE_KEY, null) !== null || Boolean(getReplaySeedFromLocation()),
    });
    return { default: runtime.GameRuntime };
  }),
);
const RankingScreen = lazy(() => import("./screens/RankingScreen.jsx").then(loadedChunk).then(({ RankingScreen }) => ({ default: RankingScreen })));
const BoardScreen = lazy(() => import("./screens/BoardScreen.jsx").then(loadedChunk).then(({ BoardScreen }) => ({ default: BoardScreen })));

// How long the intro waits for an idle moment before it fetches the runtime anyway.
const RUNTIME_PREFETCH_TIMEOUT_MS = 4000;

let saveSuppressed = false;

export function suppressSaves() {
  saveSuppressed = true;
}

export function resumeSaves() {
  saveSuppressed = false;
}

/**
 * The save as the shell reads it. It repairs nothing: which scene a case may
 * resume at is a question for the scene graph, and the runtime's
 * `repairSavedState` answers it when the run is opened. The shell used to keep
 * a second, looser rule of its own and write its answer back.
 */
function readShellSave() {
  return parseCurrentSavedState(readStoredValue(STORAGE_KEY, "null"), SAVE_SCHEMA_VERSION);
}

// The table's record is left out: an older one is brought up to date by the
// runtime's repair, and is not a fault until that has been tried.
const isShellSaveValid = (saved) => isSavedStateShapeValid(saved, { dynamics: false });

function reportInvalidShellSave(saved) {
  if (!saved || isShellSaveValid(saved)) return;
  const error = new Error(`[silent:save-shape] ${JSON.stringify({
    currentCase: saved?.currentCase,
    nodeId: saved?.nodeId,
    invalidKeys: getInvalidSavedStateKeys(saved),
  })}`);
  error.name = "SilentRouteFailure";
  recordAppError(error, {}, "silent-save-shape");
}

function readNewGamePlusMemory() {
  try {
    return JSON.parse(readStoredValue(NEW_GAME_PLUS_MEMORY_KEY, "{}")) ?? {};
  } catch {
    return {};
  }
}

/**
 * Whether the save in storage is one the player should be shown the recovery
 * centre for: it is there, this build cannot use it as it stands, and there are
 * slots to go back to. The shell has no recovery centre of its own, so it hands
 * over to the runtime, which keeps a copy of the save before anything writes
 * over it (useRuntimeSavedState).
 */
function needsRecovery(saved) {
  const unusable = saved ? !isShellSaveValid(saved) : readUnreadableSave() !== null;
  return unusable && hasRecoverySlots();
}

function createStartSave({ playerName, playStyle, dataConsent, operatorOrigin }) {
  const now = Date.now();
  return {
    saveSchemaVersion: SAVE_SCHEMA_VERSION,
    runId: createRunId(),
    playerName: normalizePlayerName(playerName) || "분석관",
    playStyle,
    openingLegacy: null,
    dataConsent,
    started: true,
    currentCase: SEASON_ENTRY_CASE,
    completedCases: [],
    discoveredClues: [],
    caseResults: {},
    playtestFeedback: {},
    nodeId: SEASON_ENTRY_NODE,
    resources: createOpeningResources(operatorOrigin),
    log: [],
    triggers: makeEmptyScores(triggerLabels),
    cognition: makeEmptyScores(cognitionLabels),
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

/** The three fields the runtime's own resume flips, over an existing save. */
function createResumedSave(current) {
  const now = Date.now();
  return {
    ...current,
    started: true,
    paused: false,
    nodeEnteredAt: now,
    savedAt: new Date(now).toISOString(),
  };
}

/** Whether the browser says it is online, kept current by its events. */
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(() => globalThis.navigator?.onLine !== false);
  useEffect(() => {
    const update = () => setIsOnline(globalThis.navigator?.onLine !== false);
    globalThis.addEventListener("online", update);
    globalThis.addEventListener("offline", update);
    return () => {
      globalThis.removeEventListener("online", update);
      globalThis.removeEventListener("offline", update);
    };
  }, []);
  return isOnline;
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
      Boolean(saved?.dataConsent && saved?.pendingTelemetry?.length > 0) ||
      needsRecovery(saved),
  );
  const [initialStartState, setInitialStartState] = useState(null);
  const { showRanking, showBoard, setShowRanking, setShowBoard } = useOverlayScreens();
  const newGamePlusMemory = useMemo(() => readNewGamePlusMemory(), []);
  const [playerName, setPlayerName] = useState(() => normalizePlayerName(saved?.playerName));
  const [playStyle, setPlayStyle] = useState(saved?.playStyle ?? "instinct");
  const [dataConsent, setDataConsent] = useState(Boolean(saved?.dataConsent));
  const [saveStatus, setSaveStatus] = useState("");
  const [operatorOrigin, setOperatorOriginState] = useState(() => readStoredValue(OPERATOR_ORIGIN_KEY, "courier"));
  const sessionId = useMemo(() => getSessionId(), []);
  const sessionCode = useMemo(() => getSessionCode(sessionId), [sessionId]);
  const [pendingTelemetry, setPendingTelemetry] = useState(() => saved?.pendingTelemetry ?? []);
  const { localRankingRows } = useLocalRanking();
  const isOnline = useOnlineStatus();
  const { leaderboard, leaderboardStatus, leaderboardError } = useLeaderboard({
    showRanking,
    isOnline,
    localLeaderboardRows: localRankingRows,
    localSeasonLeaderboardRow: null,
  });
  const board = useBoard({ showBoard, isOnline });

  const saveControls = useMemo(
    () => ({
      suppress: suppressSaves,
      resume: resumeSaves,
      isSuppressed: () => saveSuppressed,
    }),
    [],
  );

  // Reported once, after the first paint, rather than from inside a render.
  useEffect(() => {
    reportInvalidShellSave(saved);
    // A save that would not read is kept before a preference typed on this
    // screen, or a new run started from it, is written in its place.
    if (!saved) backUpUnreadableSave(readUnreadableSave());
  }, [saved]);

  // The intro is up; fetch the runtime while the player reads it.
  useEffect(() => {
    if (runtimeActive) return undefined;
    if (typeof globalThis.requestIdleCallback === "function") {
      const handle = globalThis.requestIdleCallback(prefetchGameRuntime, { timeout: RUNTIME_PREFETCH_TIMEOUT_MS });
      return () => globalThis.cancelIdleCallback?.(handle);
    }
    const handle = globalThis.setTimeout(prefetchGameRuntime, RUNTIME_PREFETCH_TIMEOUT_MS / 2);
    return () => globalThis.clearTimeout(handle);
  }, [runtimeActive]);

  if (runtimeActive) {
    return (
      <LazyScreen>
        <GameRuntime
          onSuppressSaves={onSuppressSaves}
          saveControls={saveControls}
          initialStartState={initialStartState}
        />
      </LazyScreen>
    );
  }

  if (showRanking) {
    return (
      <LazyScreen>
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
      </LazyScreen>
    );
  }

  if (showBoard) {
    return (
      <LazyScreen>
        <BoardScreen
          {...board}
          Music={AdaptiveMusic}
          gameTitle={GAME_TITLE}
          onClose={() => setShowBoard(false)}
        />
      </LazyScreen>
    );
  }

  function persist(nextState) {
    const current = readShellSave() ?? createStartSave({ playerName, playStyle, dataConsent, operatorOrigin });
    const payload = { ...current, ...nextState, started: false, savedAt: new Date().toISOString() };
    const storageSaved = writeSaveState(payload, { force: true }).saved;
    if (!storageSaved) setSaveStatus("브라우저 저장소를 사용할 수 없어 현재 상태만 진행합니다.");
    return { ...payload, storageSaved };
  }

  function startGame() {
    const payload = createStartSave({ playerName, playStyle, dataConsent, operatorOrigin });
    removeStoredValue(RECOVERY_CENTER_STORAGE_KEY);
    if (!writeSaveState(payload, { force: true }).saved) {
      setSaveStatus("브라우저 저장소를 사용할 수 없어 현재 상태만 진행합니다.");
      setInitialStartState(payload);
    }
    resumeSaves();
    setRuntimeActive(true);
  }

  // A case card and NEW GAME+ keep the season they were pressed on. The shell
  // writes the preferences typed here into the save (without starting it), then
  // hands the press to the runtime, which performs it with the scene graph.
  function handOverToRuntime(action) {
    const name = normalizePlayerName(playerName);
    persist({ ...(name ? { playerName: name } : {}), playStyle, dataConsent });
    queueRuntimeStartAction(action);
    resumeSaves();
    setRuntimeActive(true);
  }

  function startCase(caseId) {
    handOverToRuntime({ type: "case", caseId });
  }

  function startNewGamePlus() {
    handOverToRuntime({ type: "new-game-plus" });
  }

  // GameRuntime reads `started` from the save, so a paused save handed to it
  // unchanged renders the intro a second time and 이어하기 takes two clicks.
  // The shell has to write the resume itself, the way the runtime's own
  // resumeSavedGame does. persist() cannot be reused: it clamps started to
  // false, which is the whole point of that clamp for preference writes.
  function persistResumedRun() {
    const current = readShellSave();
    if (!current) return;
    if (!writeSaveState(createResumedSave(current), { force: true }).saved) {
      setSaveStatus("브라우저 저장소를 사용할 수 없어 현재 상태만 진행합니다.");
    }
  }

  function resumeSavedGame() {
    persistResumedRun();
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
    // A preference write goes through persist(), which materialises a full save
    // when none exists -- so currentCase and nodeId alone are also true for a
    // player who only ticked a box. The hero shows 이어하기 for a resumable run,
    // so the branch has to ask for evidence of an actual run, the way the
    // runtime's own hasResumableSave does (GameRuntime.jsx).
    hasResumableSave: Boolean(
      saved?.currentCase &&
        saved?.nodeId &&
        (saved.paused ||
          (Array.isArray(saved.log) && saved.log.length > 0) ||
          (Array.isArray(saved.completedCases) && saved.completedCases.length > 0)),
    ),
    lastSavedAt: saved?.savedAt ?? "",
    log: Array.isArray(saved?.log) ? saved.log : [],
    caseResults: saved?.caseResults ?? {},
    completedCases: saved?.completedCases ?? [],
    currentCase: saved?.currentCase ?? SEASON_ENTRY_CASE,
    newGamePlusUnlocked: readStoredValue(NEW_GAME_PLUS_KEY, "false") === "true",
    // Read once: it is every case summary of a finished season, and this
    // object is rebuilt on each keystroke in the name field.
    newGamePlusMemory,
    nextParticipantMessage: readStoredValue(NEXT_PARTICIPANT_MESSAGE_KEY, ""),
    startGame,
    startCase,
    startNewGamePlus,
    resumeSavedGame,
    persist,
    setShowRanking,
    setShowBoard,
    setSaveStatus,
    pendingTelemetry,
    setPendingTelemetry,
    renderSaveStatus: () => (saveStatus ? <p className="save-status">{saveStatus}</p> : null),
  });

  return <IntroScreen view={introView} />;
}
