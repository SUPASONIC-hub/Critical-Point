import {
  createRunId as createRunIdDefault,
  OPERATOR_ORIGIN_KEY,
  RECOVERY_CENTER_STORAGE_KEY,
  removeStoredValue,
} from "../appConfig.js";
import {
  CASE_SEQUENCE,
  CASE_START_NODES,
  SEASON_ENTRY_CASE,
  SEASON_ENTRY_NODE,
  caseOpeningRoutes,
  cognitionLabels,
  initialResources,
  nodeOrders,
  seasonCasesBase,
  triggerLabels,
} from "../gameData.js";
import {
  applyEffect,
  getCaseOutcome,
  getContinuityChallenge,
  getOutcomeCarryover,
  getSeasonWear,
  makeEmptyScores,
} from "../gameLogic.js";
import { caseIntroEchoes, legacyProfiles } from "../caseCopy.js";
import { openCaseRun, RUN_INITIAL_STATE, serializeRunState } from "../gauntlet/gauntletEngine.js";
import { getSessionId as getSessionIdDefault, telemetryEnabled } from "../telemetry.js";
import { confirmAction } from "./confirmAction.js";
import { createOpeningResources } from "./openingState.js";
import { clearRunStorage, logStorageResetFailure } from "./runStorageReset.js";
import { appendTraceEvent } from "./trace.js";

const CONFIRM_RESET =
  "저장된 진행, 순위 기록, 복구 지점, 오류 기록을 모두 지울까요? 화면과 소리 설정, 도구 도감, NEW GAME+ 기록, 게시판 이름, 이어하기 코드와 온라인에 올린 저장은 남습니다.";
// The line under a season's first scene, before any choice has been answered.
export const OPENING_ECHO = "얼마나 똑똑한지는 묻지 않겠습니다. 대신 언제 생각을 멈추지 못하는지 보겠습니다.";

/**
 * Opening a case, jumping to a scene, leaving for the season map and wiping
 * the run: the four things `GameRuntime` did to a run with a list of setters
 * and a save payload of its own each. Moved here as they were, so they can be
 * run without a browser (tests/unit/run-lifecycle.test.mjs).
 */
export function createRunLifecycle({
  state,
  setters,
  persist,
  effects,
  createRunId = createRunIdDefault,
  getSessionId = getSessionIdDefault,
  nowMs = () => Date.now(),
}) {
  const { caseResults, operatorOrigin, gauntletRun, runId, currentCase, nodeId, isOnline } = state;
  const {
    setRunId, setPlayerName, setPlayStyle, setOpeningLegacy, setDataConsent, setStarted, setCurrentCase,
    setCompletedCases, setDiscoveredClues, setCaseResults, setPlaytestFeedback, setNodeId, setResources,
    setLog, setTriggers, setCognition, setLastSavedAt, setIsPausedSave, setDecisionReveal, setGauntletRun,
    setStaleSave, setOperatorOriginState, setEcho, setNodeEnteredAt, setLastRecoveredError,
    setShowRecoveryCenter, setShowErrorLog, setSessionId,
  } = setters;
  const {
    resetEndingSequence, setNextParticipantMessage, replacePendingTelemetry, clearLocalRankingRows,
    setLocalErrorEntries, setSaveSlots, setSaveStatus, setTelemetryStatus, onSuppressSaves, resumeRuntimeSaves,
  } = effects;

  function startCaseNow(caseId) {
    const baseStartNode = CASE_START_NODES[caseId];
    const introEcho = caseIntroEchoes[caseId] ?? caseIntroEchoes[SEASON_ENTRY_CASE];
    const previousCaseId = CASE_SEQUENCE[CASE_SEQUENCE.indexOf(caseId) - 1];
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
      openingLegacy: legacy,
      echo: openingEcho,
      dynamics: serializeRunState(openingRun),
      nodeEnteredAt: nowMs(),
    });
  }

  // The question names what goes and what stays (state/runStorageReset.js has
  // the list). It used to say "everything", and left six kinds of thing behind.
  function resetRun() {
    if (!confirmAction(CONFIRM_RESET)) return;
    onSuppressSaves();
    const failedResetKeys = clearRunStorage();
    removeStoredValue(RECOVERY_CENTER_STORAGE_KEY);
    // A new id for the next run's rows; the old one went with the keys above.
    setSessionId(getSessionId());
    setNextParticipantMessage("");
    resetEndingSequence();
    // The tab is its own again: storage holds nothing another tab is ahead in.
    setStaleSave(false);
    setShowRecoveryCenter(false);
    setShowErrorLog(false);
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
    setDecisionReveal(null);
    setGauntletRun(RUN_INITIAL_STATE);
    setEcho(OPENING_ECHO);
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

  function leaveToSeasonMap() {
    setStarted(false);
    setIsPausedSave(true);
    persist({ started: false, paused: true });
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
    const allPreviousCases = CASE_SEQUENCE.slice(0, Math.max(0, CASE_SEQUENCE.indexOf(caseId)));
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
        openingLegacy: null,
        dynamics: serializeRunState(RUN_INITIAL_STATE),
        nodeEnteredAt: now,
      });
    }
  }

  return { startCaseNow, resetRun, leaveToSeasonMap, startAtNode };
}
