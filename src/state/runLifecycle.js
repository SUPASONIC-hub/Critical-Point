import {
  createRunId as createRunIdDefault,
  normalizePlayerName,
  OPERATOR_ORIGIN_KEY,
  RECOVERY_CENTER_STORAGE_KEY,
  removeStoredValue,
} from "../appConfig.js";
import {
  CASE_SEQUENCE,
  CASE_START_NODES,
  SEASON_ENTRY_CASE,
  caseOpeningRoutes,
  initialResources,
  nodeOrders,
  seasonCasesBase,
} from "../gameData.js";
import { applyEffect, getCaseOutcome, getContinuityChallenge, getOutcomeCarryover, getSeasonWear } from "../gameLogic.js";
import { caseIntroEchoes, legacyProfiles } from "../caseCopy.js";
import { holdCloudCopyThroughReset } from "../cloudSave.js";
import { openCaseRun } from "../gauntlet/gauntletEngine.js";
import { getSessionId as getSessionIdDefault, telemetryEnabled } from "../telemetry.js";
import { confirmAction } from "./confirmAction.js";
import { createOpeningResources } from "./openingState.js";
import { runTransition } from "./runState.js";
import { clearRunStorage, logStorageResetFailure } from "./runStorageReset.js";
import { appendTraceEvent } from "./trace.js";
import { leaveReplaySession } from "./useAppPersistence.js";

// The last sentence is what keeps the one before it true: the online copy is
// not replaced by the next run until the player says so (cloudSave.js).
const CONFIRM_RESET =
  "저장된 진행, 순위 기록, 복구 지점, 오류 기록을 모두 지울까요? 화면과 소리 설정, 도구 도감, NEW GAME+ 기록, 게시판 이름, 이어하기 코드와 온라인에 올린 저장은 남습니다. 온라인 저장은 새 진행을 올리기 전에 시작 화면에서 어느 쪽을 남길지 묻습니다.";

/**
 * What a case opens with, worked out from how the one before it closed: the
 * scene, the hand, the legacy the table shows, and the line under the scene.
 */
export function describeCaseOpening(caseId, { caseResults, operatorOrigin }) {
  const baseStartNode = CASE_START_NODES[caseId];
  const introEcho = caseIntroEchoes[caseId] ?? caseIntroEchoes[SEASON_ENTRY_CASE];
  const previousCaseId = CASE_SEQUENCE[CASE_SEQUENCE.indexOf(caseId) - 1];
  const previousResult = previousCaseId ? caseResults[previousCaseId] : null;
  const nodeId = caseOpeningRoutes[caseId]?.[previousResult?.outcomeChoiceId] ?? baseStartNode;
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
  const openingLegacy = previousResult
    ? {
        ...baseLegacy,
        effect: openingEffect,
        continuity: previousOutcome,
        continuityChallenge,
      }
    : null;
  const echo = previousOutcome
    ? `${introEcho} 직전 사건의 결과는 '${previousOutcome.title}'로 기록됐습니다. 이번 사건은 그 선택의 비용을 이어받습니다.`
    : introEcho;
  // The origin bonus is the run's opening hand, so it belongs to the season's
  // first case -- which is the 프롤로그 now, not 사건 01.
  const seasonOpening = caseId === SEASON_ENTRY_CASE && !previousResult;
  const resources = seasonOpening
    ? createOpeningResources(operatorOrigin)
    : previousResult ? applyEffect(initialResources, openingEffect) : initialResources;
  return { nodeId, resources, openingLegacy, echo, note: previousResult?.outcomeChoiceId ?? "season-start" };
}

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
}) {
  const {
    resetEndingSequence, setNextParticipantMessage, replacePendingTelemetry, clearLocalRankingRows,
    setLocalErrorEntries, setSaveSlots, setSaveStatus, setTelemetryStatus, onSuppressSaves, resumeRuntimeSaves,
  } = effects;

  function startGame() {
    // A run of one's own ends a replay; from here the tab writes its save again.
    leaveReplaySession();
    const patch = runTransition(run, {
      type: "newGame",
      runId: createRunId(),
      playerName: normalizePlayerName(run.playerName) || "분석관",
      now: nowMs(),
    });
    removeStoredValue(RECOVERY_CENTER_STORAGE_KEY);
    // Written over whatever another tab held: a new run is this tab's own.
    applyRun(patch, { force: true });
  }

  function resumeSavedGame() {
    setSaveStatus("");
    applyRun(runTransition(run, { type: "resume", now: nowMs() }));
  }

  function pauseAfterRecovery() {
    setSaveStatus("현재 지점을 일시정지했습니다.");
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
    applyRun(runTransition(run, {
      type: "openCase",
      caseId,
      ...opening,
      // A case that already has a summary is played again as practice for the table.
      gauntletRun: openCaseRun(run.gauntletRun, { replayOf: run.caseResults[caseId] ?? null }),
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
      echoText = "디버그 진입입니다. 이 장면부터 선택 흐름을 재현합니다.",
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
      now: nowMs(),
    });
    if (persistRun) applyRun(patch);
    else patchRun(patch);
  }

  // The question names what goes and what stays (state/runStorageReset.js has
  // the list). It used to say "everything", and left six kinds of thing behind.
  function resetRun() {
    if (!confirmAction(CONFIRM_RESET)) return;
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
        : `일부 브라우저 저장소를 지우지 못했습니다: ${failedResetKeys.join(", ")}${resetErrorLogSaved ? "" : " · 진단 로그 저장도 실패했습니다."}`,
    );
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

  return { startGame, resumeSavedGame, pauseAfterRecovery, leaveToSeasonMap, startCaseNow, startAtNode, resetRun };
}
