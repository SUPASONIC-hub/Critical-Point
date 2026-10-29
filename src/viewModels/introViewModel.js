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
import { CASE_SEQUENCE, RESULT_NODE_IDS, TYPICAL_CASE_MINUTES, caseObjectives, seasonCasesBase } from "../gameCases.js";
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
import introCopy from "../copy/intro.js";

/** Both callers show the same screen, so they play the same cue. */
const INTRO_MUSIC_MODE = "intro:menu";

function getCaseStatusText(status) {
  const { status: words } = introCopy;
  if (status === "PLAYING") return words.playing;
  if (status === "OPEN") return words.open;
  if (status === "COMPLETE") return words.complete;
  return words.locked;
}

/** The cases already closed, with their stored summary read back in full. */
export function createCompletedCaseResultList(caseResults = {}) {
  return seasonCasesBase
    .filter((caseItem) => caseResults[caseItem.id])
    .map((caseItem) => ({ ...caseItem, result: normalizeCaseSummary(caseResults[caseItem.id]) }));
}

/**
 * 「지난 이야기」 on the resume card (improvement notes D-9 = B-6(1)): the
 * last case's ending title, then what this case is about -- the premise the
 * last case's close announced, or, once this case has a decision, the line
 * that decision left. Read from the save alone (`openingLegacy`, written when
 * the case opened, and the log), so the shell draws it without the case copy.
 */
export function getStoryRecap({ openingLegacy, log = [] }) {
  // Short on purpose: this is in the entry chunk, which has no room (check:bundle).
  const echo = [...log].reverse().find((entry) => entry?.echo)?.echo;
  return [openingLegacy?.continuity?.title, echo ?? openingLegacy?.premise].filter(Boolean);
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
  // The scene the save stands on. Only whether it is a report is read here.
  nodeId,
  // What the case opened with (state/caseRoutes.js), for the resume card's recap.
  openingLegacy = null,
  newGamePlusUnlocked,
  newGamePlusMemory,
  // The season record (state/seasonRecord.js) and the saved run's id: the memory panel's season number.
  seasonRecord = null,
  runId = null,
  nextParticipantMessage,
  // What the intro can do.
  startGame,
  startCase,
  startNewGamePlus,
  resumeSavedGame,
  persist,
  setShowRanking,
  setShowBoard,
  pendingTelemetry = [],
  setPendingTelemetry = () => {},
  setTelemetryStatus = () => {},
  renderSaveStatus = () => null,
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
    setShowBoard,
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
    // The save's decision count and its 지난 이야기, one field: the bag is at its budget (check:runtime-budget).
    savedStory: { decisions: log.length, recap: getStoryRecap({ openingLegacy, log }) },
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
    pendingTelemetry,
    setTelemetryStatus,
    telemetryEnabled,
    isOnline,
    telemetrySummary: createTelemetrySummary({ dataConsent, isOnline, telemetryEnabled }),
    sessionCode,
    setPendingTelemetry,

    // The shell never draws the console: it hands the whole screen to the
    // runtime when debug tooling is on, so the console is always the runtime's.
    debugToolsEnabled: Boolean(runtime) && debugToolsEnabled,
    caseSequence: CASE_SEQUENCE,

    seasonCasesBase,
    caseObjectives,
    triggerLabSignals,
    completedCaseResultList: createCompletedCaseResultList(caseResults),
    resourceMeta,
    seasonCases: createSeasonCases({ seasonCasesBase, completedCases, currentCase, hasRun: Boolean(hasResumableSave) }),
    caseResults,
    completedCases,
    currentCase,
    atReport: RESULT_NODE_IDS.has(nodeId),
    startCase,
    getCaseStatusText,
    normalizeCaseSummary,
    caseMinutes: TYPICAL_CASE_MINUTES,

    playGuideItems,
    operatorProfiles: getOperatorProfiles(),
    operatorOrigin,
    setOperatorOrigin,
    operatorProfile: getOperatorProfile(operatorOrigin),
    originPrologue: getOriginPrologue(operatorOrigin),
    tutorialSteps: getTutorialSteps(),
    playStyleUnlocks: getPlayStyleUnlocks(playStyle, newGamePlusUnlocked),
    pastRunMemory: getPastRunMemory(newGamePlusMemory, seasonRecord, runId),
    seasonGoals: getSeasonGoals(),

    node: supplied("node"),
    progress: supplied("progress"),
    seasonJourney: supplied("seasonJourney"),
    nodes: supplied("nodes"),
    nodeOrders: supplied("nodeOrders"),
    showErrorLog: supplied("showErrorLog"),
    setShowErrorLog: supplied("setShowErrorLog"),
    unlockAllCasesForTest: supplied("unlockAllCasesForTest"),
    debugCaseId: supplied("debugCaseId"),
    debugNodeOptions: supplied("debugNodeOptions"),
    debugNodeId: supplied("debugNodeId"),
    setDebugCaseId: supplied("setDebugCaseId"),
    setDebugNodeId: supplied("setDebugNodeId"),
    startDebugNode: supplied("startDebugNode"),
  });
}
