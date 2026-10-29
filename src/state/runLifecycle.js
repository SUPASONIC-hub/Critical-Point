import {
  createRunId as createRunIdDefault,
  normalizePlayerName,
  OPERATOR_ORIGIN_KEY,
  RECOVERY_CENTER_STORAGE_KEY,
  removeStoredValue,
} from "../appConfig.js";
import {
  CASE_SEQUENCE,
  initialResources,
  nodeOrders,
  seasonCasesBase,
} from "../gameData.js";
import { holdCloudCopyThroughReset } from "../cloudSave.js";
import { openCaseRun } from "../gauntlet/gauntletEngine.js";
import { getTableRules } from "../gauntlet/tableUnlocks.js";
import { pickSeasonWeekRule } from "../gauntlet/weeklyRules.js";
import { getSessionId as getSessionIdDefault, telemetryEnabled } from "../telemetry.js";
import { getAccessibility } from "./accessibilitySettings.js";
import { describeCaseOpening } from "./caseRoutes.js";
import { confirmAction } from "./confirmAction.js";
import { runTransition } from "./runState.js";
import { clearRunStorage, logStorageResetFailure } from "./runStorageReset.js";
import { appendTraceEvent } from "./trace.js";
import { leaveReplaySession } from "./useAppPersistence.js";
import { weeklyRuleNow as weeklyRuleNowDefault } from "./weeklyClock.js";
import { weekRuleChoice } from "./weeklyRuleChoice.js";
import { clearReadingTally } from "./readingTally.js";
import noticesCopy from "../copy/notices.js";
import { fill } from "../locale.js";

// The reset's question (noticesCopy.confirm.reset). Its last sentence is what
// keeps the one before it true: the online copy is not replaced by the next run
// until the player says so (cloudSave.js).

/**
 * Starting, opening, jumping, leaving and wiping a run.
 *
 * Each of these is an event handed to the run's one definition
 * (state/runState.js): the patch that comes back is the change to the run in
 * memory, and `applyRun` writes the save from that same patch. What is not the
 * run -- the trace, the keys a reset removes, the status line, the ending
 * sequence -- is done here, once per transition, in the order it always was.
 *
 * `run` is the run as the calling render holds it; the functions are made
 * again on each render, as the closures they replaced were.
 */
export function createRunLifecycle({
  run,
  applyRun,
  patchRun,
  effects,
  isOnline = true,
  createRunId = createRunIdDefault,
  getSessionId = getSessionIdDefault,
  nowMs = () => Date.now(),
  weeklyRuleNow = weeklyRuleNowDefault,
}) {
  const {
    resetEndingSequence, setNextParticipantMessage, replacePendingTelemetry, clearLocalRankingRows,
    setLocalErrorEntries, setSaveSlots, setSaveStatus, setTelemetryStatus, onSuppressSaves, resumeRuntimeSaves,
  } = effects;

  /**
   * `veteran` is NEW GAME+: the run is marked, and its table has every rule
   * from the first window. Anything else -- the start button hands this a
   * click event -- is a plain start.
   *
   * The story mark is the comfort setting as it stands at this press. The
   * season's first case is played straight from here, with no `startCaseNow`.
   *
   * `echo` is the line NEW GAME+ carries from the last season
   * (newGamePlusCarry.getSeasonCarry); it is read only with `veteran`, so a
   * plain start always opens on `OPENING_ECHO`.
   */
  // The start screen's boxes (state/weeklyRuleChoice.js: 결정 27, and E-8 for a
  // device's first season) unless the caller says. NEW GAME+ is never a first season.
  function startGame({ veteran = false, declineWeekRule, takeUpWeekRule, echo = null } = {}) {
    const choice = weekRuleChoice();
    // A run of one's own ends a replay; from here the tab writes its save again.
    leaveReplaySession();
    const story = getAccessibility().storyMode;
    const patch = runTransition(run, {
      type: "newGame",
      runId: createRunId(),
      playerName: normalizePlayerName(run.playerName) || "분석관",
      veteran: veteran === true,
      echo: veteran === true && typeof echo === "string" ? echo : null,
      story,
      // 이번 주의 규칙, read off the weekly clock (held still in test builds).
      weekRule: pickSeasonWeekRule(weeklyRuleNow(), {
        declined: typeof declineWeekRule === "boolean" ? declineWeekRule : choice.declined,
        firstSeason: veteran !== true && choice.firstSeason,
        takenUp: typeof takeUpWeekRule === "boolean" ? takeUpWeekRule : choice.takenUp,
        story,
      }),
      now: nowMs(),
    });
    removeStoredValue(RECOVERY_CENTER_STORAGE_KEY);
    // A new season reads from nothing: what the last one's open case had read is not this one's (D-11).
    clearReadingTally();
    // Written over whatever another tab held: a new run is this tab's own.
    applyRun(patch, { force: true });
  }

  function resumeSavedGame() {
    setSaveStatus("");
    applyRun(runTransition(run, { type: "resume", now: nowMs() }));
  }

  function pauseAfterRecovery() {
    setSaveStatus(noticesCopy.run.paused);
    applyRun(runTransition(run, { type: "pause" }));
  }

  function leaveToSeasonMap() {
    applyRun(runTransition(run, { type: "pause" }));
  }

  function startCaseNow(caseId) {
    const { note, ...opening } = describeCaseOpening(caseId, run);
    appendTraceEvent({
      kind: "case-start",
      caseId,
      nodeId: opening.nodeId,
      logLength: 0,
      resources: opening.resources,
      note,
    });
    resetEndingSequence();
    // Story mode is the device's setting, and a case takes it as it opens: the
    // mark is written on the run here and read from the run until the next
    // case opens. A setting changed in the middle of a case changes nothing
    // about that case -- its windows, a window put down, its record.
    const table = { ...run.gauntletRun, story: getAccessibility().storyMode };
    applyRun(runTransition(run, {
      type: "openCase",
      caseId,
      ...opening,
      // A case that already has a summary is played again as practice for the table.
      // With the case and its opening hand, for the opening snapshot (S3).
      gauntletRun: openCaseRun(table, { replayOf: run.caseResults[caseId] ?? null, rules: getTableRules(caseId, table), caseId, resources: opening.resources }),
      now: nowMs(),
    }));
  }

  /**
   * A scene entered directly. `persistRun: false` is a replay link: somebody's
   * run laid out to be looked at, under their id, and never written.
   */
  function startAtNode(
    caseIdValue,
    nodeIdValue,
    {
      echoText = noticesCopy.run.directEntry,
      persistRun = true,
    } = {},
  ) {
    const caseId = seasonCasesBase.some((caseItem) => caseItem.id === caseIdValue) ? caseIdValue : "case05";
    const nodeOptions = nodeOrders[caseId] ?? nodeOrders.case05;
    const nodeId = nodeOptions.includes(nodeIdValue) ? nodeIdValue : nodeOptions[0];
    appendTraceEvent({
      kind: "enter",
      caseId,
      nodeId,
      logLength: 0,
      resources: initialResources,
      note: persistRun ? "debug-start" : "replay",
    });
    const patch = runTransition(run, {
      type: "jumpToNode",
      caseId,
      nodeId,
      completedCases: CASE_SEQUENCE.slice(0, Math.max(0, CASE_SEQUENCE.indexOf(caseId))),
      echo: echoText,
      runId: persistRun ? createRunId() : run.runId,
      // A run of this device's own takes its setting; a replay is somebody else's table.
      story: persistRun && getAccessibility().storyMode,
      now: nowMs(),
    });
    if (persistRun) applyRun(patch);
    else patchRun(patch);
  }

  // The question names what goes and what stays (state/runStorageReset.js has
  // the list). It used to say "everything", and left six kinds of thing behind.
  async function resetRun() {
    if (!(await confirmAction(noticesCopy.confirm.reset))) return;
    onSuppressSaves();
    const failedResetKeys = clearRunStorage();
    removeStoredValue(RECOVERY_CENTER_STORAGE_KEY);
    removeStoredValue(OPERATOR_ORIGIN_KEY);
    // The copy on the server is kept, as the question said: the next run is
    // not uploaded over it until the player chooses to.
    holdCloudCopyThroughReset();
    // A new id for the next run's rows; the old one went with the keys above.
    const patch = runTransition(run, { type: "reset", runId: createRunId(), sessionId: getSessionId(), now: nowMs() });
    setNextParticipantMessage("");
    resetEndingSequence();
    // The sender's ref is emptied with the run's copy of the queue.
    replacePendingTelemetry([]);
    clearLocalRankingRows();
    setLocalErrorEntries([]);
    setSaveSlots([]);
    // Nothing is written: the save was removed, and the next run writes its own.
    patchRun(patch);
    const resetErrorLogSaved = failedResetKeys.length === 0
      || logStorageResetFailure({ source: "reset", failedStorageKeys: failedResetKeys, currentCase: run.currentCase, nodeId: run.nodeId });
    setSaveStatus(
      failedResetKeys.length === 0
        ? ""
        : fill(noticesCopy.storage.resetFailed, { keys: failedResetKeys.join(", "), logFailed: resetErrorLogSaved ? "" : noticesCopy.storage.logFailed }),
    );
    setTelemetryStatus({
      tone: telemetryEnabled && isOnline ? "ready" : "local",
      text: !isOnline
        ? noticesCopy.telemetry.offline
        : telemetryEnabled
          ? noticesCopy.telemetry.remoteReady
          : noticesCopy.telemetry.local,
    });
    resumeRuntimeSaves();
  }

  return { startGame, resumeSavedGame, pauseAfterRecovery, leaveToSeasonMap, startCaseNow, startAtNode, resetRun };
}
