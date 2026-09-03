/**
 * The intro screen's field bag, written once.
 *
 * Two components show the intro. The pre-start shell in AppContent.jsx shows it
 * before the scene graph is loaded, and GameRuntime.jsx shows it again when a run
 * pauses back to the menu, by which point the graph is in memory. They used to
 * assemble the bag separately, and the copies drifted: the shell built its own
 * storage banner from a single boolean and printed the wrong sentence in three of
 * its four states.
 *
 * So the bag is assembled here. Constants are imported once, shared values are
 * derived once, and the fields only the runtime can supply are listed in
 * INTRO_FIELDS_WITHOUT_RUNTIME with the value the shell shows instead. That value
 * is always "nothing to render" -- never a stand-in for something the shell cannot
 * actually know.
 */
import {
  PLAYER_NAME_MAX_LENGTH,
  debugToolsEnabled,
  formatSaveTime,
  limitText,
} from "../appConfig.js";
import {
  GAME_SUBTITLE,
  GAME_TITLE,
  GAME_TITLE_READING,
  playGuideItems,
  playStyleOptions,
  resourceMeta,
  triggerLabSignals,
} from "../appCopy.js";
import { CASE_SEQUENCE, caseObjectives, seasonCasesBase } from "../gameCases.js";
import { triggerLabels } from "../gameConstants.js";
import {
  getOperatorProfile,
  getOperatorProfiles,
  getOriginPrologue,
  getPastRunMemory,
  getPlayStyleUnlocks,
  getSeasonGoals,
  getTutorialSteps,
} from "../advancedSystems.js";
import { simplifyPlayerText } from "../playerLanguage.js";
import { telemetryEnabled } from "../telemetry.js";
import { INTRO_FIELDS_WITHOUT_RUNTIME, createIntroView, createTelemetrySummary } from "./appViewModels.js";
import { createSeasonCases, normalizeCaseSummary } from "./seasonViewModels.js";

/** Both callers show the same screen, so they play the same cue. */
const INTRO_MUSIC_MODE = "intro:menu";

export function getCaseStatusText(status) {
  if (status === "PLAYING") return "진행 중";
  if (status === "OPEN") return "시작 가능";
  if (status === "COMPLETE") return "완료됨";
  return "이전 케이스 필요";
}

/** The cases already closed, with their stored summary read back in full. */
export function createCompletedCaseResultList(caseResults = {}) {
  return seasonCasesBase
    .filter((caseItem) => caseResults[caseItem.id])
    .map((caseItem) => ({ ...caseItem, result: normalizeCaseSummary(caseResults[caseItem.id]) }));
}

export function createIntroViewModel({
  // The music component. It is the one React piece in the bag, and it stays an
  // argument so this module holds no JSX and can be exercised from Node.
  AdaptiveMusic,
  // Who is playing, and what they have consented to.
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
  // What the save says.
  hasResumableSave,
  lastSavedAt,
  log,
  caseResults,
  completedCases,
  currentCase,
  newGamePlusUnlocked,
  newGamePlusMemory,
  nextParticipantMessage,
  // What the intro can do.
  startGame,
  startCase,
  startNewGamePlus,
  resumeSavedGame,
  persist,
  setShowRanking,
  setSaveStatus,
  setPendingTelemetry = () => {},
  setTelemetryStatus = () => {},
  pendingTelemetryRef,
  renderSaveStatus,
  renderRecoveryNotice = () => null,
  renderErrorLogPanel = () => null,
  // Everything the graph is needed for. Absent in the pre-start shell.
  runtime = null,
}) {
  if (runtime) {
    const unsupplied = Object.keys(INTRO_FIELDS_WITHOUT_RUNTIME).filter((field) => !(field in runtime));
    if (unsupplied.length > 0) {
      throw new Error(`intro runtime fields missing: ${unsupplied.join(", ")}`);
    }
  }
  const supplied = (field) => (runtime ? runtime[field] : INTRO_FIELDS_WITHOUT_RUNTIME[field]);
  return createIntroView({
    AdaptiveMusic,
    musicModeKey: INTRO_MUSIC_MODE,
    renderRecoveryNotice,
    renderErrorLogPanel,
    renderSaveStatus,
    setShowRanking,
    GAME_TITLE,
    GAME_TITLE_READING,
    GAME_SUBTITLE,
    simplifyPlayerText,
    activeCaseMeta: seasonCasesBase.find((caseItem) => caseItem.id === currentCase),
    nextParticipantMessage,
    triggerLabels,

    hasResumableSave,
    formatSaveTime,
    lastSavedAt,
    log,
    playerName,
    PLAYER_NAME_MAX_LENGTH,
    setPlayerName,
    limitText,
    startGame,
    resumeSavedGame,
    activePlayStyle: playStyleOptions.find((style) => style.id === playStyle) ?? playStyleOptions[0],
    playStyleOptions,
    playStyle,
    setPlayStyle,
    persist,
    newGamePlusUnlocked,
    startNewGamePlus,

    dataConsent,
    setDataConsent,
    pendingTelemetryRef,
    setTelemetryStatus,
    telemetryEnabled,
    isOnline,
    telemetrySummary: createTelemetrySummary({ dataConsent, isOnline, telemetryEnabled }),
    sessionCode,
    setPendingTelemetry,
    setSaveStatus,

    // The shell never draws the console: it hands the whole screen to the
    // runtime when debug tooling is on, so the console is always the runtime's.
    debugToolsEnabled: Boolean(runtime) && debugToolsEnabled,
    caseSequence: CASE_SEQUENCE,

    seasonCasesBase,
    caseObjectives,
    triggerLabSignals,
    completedCaseResultList: createCompletedCaseResultList(caseResults),
    resourceMeta,
    seasonCases: createSeasonCases({ seasonCasesBase, completedCases, currentCase }),
    caseResults,
    completedCases,
    currentCase,
    startCase,
    getCaseStatusText,
    normalizeCaseSummary,

    playGuideItems,
    operatorProfiles: getOperatorProfiles(),
    operatorOrigin,
    setOperatorOrigin,
    operatorProfile: getOperatorProfile(operatorOrigin),
    originPrologue: getOriginPrologue(operatorOrigin),
    tutorialSteps: getTutorialSteps(),
    playStyleUnlocks: getPlayStyleUnlocks(playStyle, newGamePlusUnlocked),
    pastRunMemory: getPastRunMemory(newGamePlusMemory),
    seasonGoals: getSeasonGoals(),

    node: supplied("node"),
    progress: supplied("progress"),
    seasonJourney: supplied("seasonJourney"),
    nodes: supplied("nodes"),
    nodeOrders: supplied("nodeOrders"),
    showErrorLog: supplied("showErrorLog"),
    setShowErrorLog: supplied("setShowErrorLog"),
    unlockAllCasesForTest: supplied("unlockAllCasesForTest"),
    debugCaseSelectRef: supplied("debugCaseSelectRef"),
    debugCaseId: supplied("debugCaseId"),
    debugCaseIdRef: supplied("debugCaseIdRef"),
    debugNodeOptions: supplied("debugNodeOptions"),
    debugNodeId: supplied("debugNodeId"),
    debugNodeIdRef: supplied("debugNodeIdRef"),
    debugNodeSelectRef: supplied("debugNodeSelectRef"),
    setDebugCaseId: supplied("setDebugCaseId"),
    setDebugNodeId: supplied("setDebugNodeId"),
    startDebugNode: supplied("startDebugNode"),
  });
}
