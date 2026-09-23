import {
  FREE_TEXT_MAX_LENGTH,
  normalizeFeedback,
  normalizeSavedText,
  SAVE_SCHEMA_VERSION,
  TELEMETRY_QUEUE_TYPES,
} from "../appConfig.js";
import {
  CASE_RESULT_NODES,
  CASE_SEQUENCE,
  CASE_START_NODES,
  SEASON_ENTRY_CASE,
  cognitionLabels,
  initialResources,
  nodeOrders,
  nodes,
  triggerLabels,
} from "../gameData.js";
import { makeEmptyScores } from "../gameLogic.js";
import { recordAppError } from "./errorRecovery.js";

// The error log, its telemetry and the recovery save have one implementation,
// in `errorRecovery.js`, which the intro shell can load without the scene graph.
// This file used to carry a second copy of all eight functions.
export { recordAppError };

const caseSequence = CASE_SEQUENCE;

function isKnownCaseId(caseId) {
  return caseSequence.includes(caseId);
}

function isNodeValidForCase(caseId, nodeId) {
  if (!isKnownCaseId(caseId) || typeof nodeId !== "string") return false;
  return Boolean(nodeOrders[caseId]?.includes(nodeId) || CASE_RESULT_NODES[caseId] === nodeId);
}

export function repairSavedRoute(state) {
  if (!state || typeof state !== "object" || Array.isArray(state)) return null;
  const currentCase = isKnownCaseId(state.currentCase) ? state.currentCase : SEASON_ENTRY_CASE;
  const nodeId = isNodeValidForCase(currentCase, state.nodeId) ? state.nodeId : CASE_START_NODES[currentCase];
  if (currentCase === state.currentCase && nodeId === state.nodeId) return state;
  reportSilentFailure("route-repair", { from: state.nodeId, to: nodeId, currentCase });
  return {
    ...state,
    currentCase,
    nodeId,
    paused: true,
    lastError: {
      id: `repair-${Date.now()}`,
      occurredAt: new Date().toISOString(),
      source: "save-integrity",
      message: "Saved route was repaired before resume.",
      currentCase,
      nodeId,
    },
  };
}

function normalizeNumberMap(value, defaults) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { value: { ...defaults }, changed: true };
  }

  const allowedKeys = Object.keys(defaults);
  const sourceKeys = Object.keys(value);
  let changed = sourceKeys.length !== allowedKeys.length;
  const next = {};

  allowedKeys.forEach((key) => {
    const candidate = value[key];
    if (Number.isFinite(candidate)) {
      next[key] = candidate;
      return;
    }
    next[key] = defaults[key];
    changed = true;
  });

  return { value: next, changed };
}

export function normalizeSavedGameplayState(state) {
  if (!state || typeof state !== "object" || Array.isArray(state)) return null;

  const normalizedResources = normalizeNumberMap(state.resources, initialResources);
  const normalizedTriggers = normalizeNumberMap(state.triggers, makeEmptyScores(triggerLabels));
  const normalizedCognition = normalizeNumberMap(state.cognition, makeEmptyScores(cognitionLabels));

  if (!normalizedResources.changed && !normalizedTriggers.changed && !normalizedCognition.changed) {
    return state;
  }

  return {
    ...state,
    resources: normalizedResources.value,
    triggers: normalizedTriggers.value,
    cognition: normalizedCognition.value,
    paused: true,
    lastError: state.lastError ?? {
      id: `repair-${Date.now()}`,
      occurredAt: new Date().toISOString(),
      source: "save-integrity",
      message: "Saved gameplay metrics were repaired before resume.",
      currentCase: state.currentCase,
      nodeId: state.nodeId,
    },
  };
}

function areSavedValuesEquivalent(left, right) {
  try {
    return JSON.stringify(left) === JSON.stringify(right);
  } catch {
    return left === right;
  }
}

function normalizeSavedArray(value, normalizeItem) {
  if (!Array.isArray(value)) return { value: [], changed: true };
  let changed = false;
  const next = value
    .map((item) => {
      const normalized = normalizeItem(item);
      if (!areSavedValuesEquivalent(normalized, item)) changed = true;
      return normalized;
    })
    .filter((item) => {
      const keep = item !== null;
      if (!keep) changed = true;
      return keep;
    });
  if (next.length !== value.length) changed = true;
  return { value: next, changed };
}

function normalizeSavedPlainObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function normalizeSavedEffect(value) {
  const source = normalizeSavedPlainObject(value);
  return Object.fromEntries(
    Object.entries(source).filter(([, effectValue]) => Number.isFinite(effectValue)),
  );
}

function normalizeSavedLogEntry(entry) {
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
    reportSilentFailure("log-entry-drop", { nodeId: entry?.nodeId, reason: "invalid-entry" });
    return null;
  }
  const nodeId = typeof entry.nodeId === "string" ? entry.nodeId : "";
  if (!nodeId || (!nodes[nodeId] && !Object.values(CASE_RESULT_NODES).includes(nodeId))) {
    reportSilentFailure("log-entry-drop", { nodeId, reason: "unknown-node" });
    return null;
  }
  return {
    ...entry,
    nodeId,
    title: typeof entry.title === "string" ? entry.title : nodes[nodeId]?.title ?? "",
    choiceId: typeof entry.choiceId === "string" ? entry.choiceId : "",
    choice: typeof entry.choice === "string" ? entry.choice : "",
    spokenChoice: typeof entry.spokenChoice === "string" ? entry.spokenChoice : "",
    freeText: normalizeSavedText(entry.freeText, FREE_TEXT_MAX_LENGTH),
    freeTextBranchId: typeof entry.freeTextBranchId === "string" ? entry.freeTextBranchId : "",
    continuityMemory: Boolean(entry.continuityMemory),
    routeChangeKind: ["memory", "evidence-turn", "free-text"].includes(entry.routeChangeKind) ? entry.routeChangeKind : "",
    effect: normalizeSavedEffect(entry.effect),
    cognition: normalizeSavedEffect(entry.cognition),
    triggers: Array.isArray(entry.triggers) ? entry.triggers.filter((trigger) => typeof trigger === "string") : [],
    responseTimeSec: Number.isFinite(entry.responseTimeSec) ? entry.responseTimeSec : 0,
    resourcesBefore: normalizeSavedPlainObject(entry.resourcesBefore),
    resourcesAfter: normalizeSavedPlainObject(entry.resourcesAfter),
    isSystemEvent: Boolean(entry.isSystemEvent),
  };
}

function normalizeSavedClue(clue) {
  if (!clue || typeof clue !== "object" || Array.isArray(clue) || typeof clue.id !== "string") return null;
  return {
    ...clue,
    title: typeof clue.title === "string" ? clue.title : clue.id,
    text: typeof clue.text === "string" ? clue.text : "",
  };
}

function normalizeSavedCaseSummaryShape(summary) {
  if (!summary || typeof summary !== "object" || Array.isArray(summary)) return null;
  const tuple = (value, fallback) => (
    Array.isArray(value) && typeof value[0] === "string" && Number.isFinite(value[1]) ? value : fallback
  );
  return {
    ...summary,
    schemaVersion: Number.isFinite(summary.schemaVersion) ? summary.schemaVersion : SAVE_SCHEMA_VERSION,
    primary: tuple(summary.primary, ["responsibility", 0]),
    secondary: tuple(summary.secondary, ["protection", 0]),
    thinking: tuple(summary.thinking, ["persistence", 0]),
    freeCount: Number.isFinite(summary.freeCount) ? summary.freeCount : 0,
    averageResponseTime: Number.isFinite(summary.averageResponseTime) ? summary.averageResponseTime : 0,
    challengeClearCount: Number.isFinite(summary.challengeClearCount) ? summary.challengeClearCount : 0,
    reducedRiskCount: Number.isFinite(summary.reducedRiskCount) ? summary.reducedRiskCount : 0,
    rhythmScore: Number.isFinite(summary.rhythmScore) ? summary.rhythmScore : 0,
    cognitionScore: Number.isFinite(summary.cognitionScore) ? summary.cognitionScore : 0,
    pressureAdaptScore: Number.isFinite(summary.pressureAdaptScore) ? summary.pressureAdaptScore : 0,
    reflectionScore: Number.isFinite(summary.reflectionScore) ? summary.reflectionScore : 0,
    exploitPenalty: Number.isFinite(summary.exploitPenalty) ? summary.exploitPenalty : 0,
    burstScore: Number.isFinite(summary.burstScore) ? summary.burstScore : Number.isFinite(summary.momentumScore) ? summary.momentumScore : 0,
    momentumScore: Number.isFinite(summary.momentumScore) ? summary.momentumScore : 0,
    momentumTier: typeof summary.momentumTier === "string" ? summary.momentumTier : "BUILDING",
    rank: typeof summary.rank === "string" ? summary.rank : "C",
    outcomeChoiceId: typeof summary.outcomeChoiceId === "string" ? summary.outcomeChoiceId : null,
    outcomeNodeId: typeof summary.outcomeNodeId === "string" ? summary.outcomeNodeId : null,
    // The next case's opening reads this to decide which memory choice to
    // offer, so a corrupted value must not reach the choice builder. A save
    // written before the field existed simply offers no memory choice.
    routeMemory: {
      evidenceTurn: Boolean(summary.routeMemory?.evidenceTurn),
      systemRoute: Boolean(summary.routeMemory?.systemRoute),
      routeSplit: Boolean(summary.routeMemory?.routeSplit),
    },
  };
}

function normalizeSavedObjectMap(value, normalizeItem) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return { value: {}, changed: true };
  let changed = false;
  const next = {};
  Object.entries(value).forEach(([key, item]) => {
    const normalized = normalizeItem(item, key);
    if (!areSavedValuesEquivalent(normalized, item)) changed = true;
    if (normalized !== null) next[key] = normalized;
  });
  if (Object.keys(next).length !== Object.keys(value).length) changed = true;
  return { value: next, changed };
}

function normalizeSavedTelemetryQueue(value) {
  if (!Array.isArray(value)) return { value: [], changed: true };
  const next = value.filter(
    (item) =>
      item &&
      typeof item === "object" &&
      !Array.isArray(item) &&
      typeof item.id === "string" &&
      TELEMETRY_QUEUE_TYPES.includes(item.type) &&
      typeof item.label === "string" &&
      item.payload &&
      typeof item.payload === "object" &&
      !Array.isArray(item.payload),
  );
  return { value: next, changed: next.length !== value.length };
}

export function normalizeSavedNestedState(state) {
  if (!state || typeof state !== "object" || Array.isArray(state)) return null;

  const normalizedCompletedCases = normalizeSavedArray(
    state.completedCases,
    (caseId) => (isKnownCaseId(caseId) ? caseId : null),
  );
  const normalizedDiscoveredClues = normalizeSavedArray(state.discoveredClues, normalizeSavedClue);
  const normalizedLog = normalizeSavedArray(state.log, normalizeSavedLogEntry);
  const normalizedCaseResults = normalizeSavedObjectMap(
    state.caseResults,
    (summary, caseId) => (isKnownCaseId(caseId) ? normalizeSavedCaseSummaryShape(summary) : null),
  );
  const normalizedFeedback = normalizeSavedObjectMap(
    state.playtestFeedback,
    (feedback, caseId) => (isKnownCaseId(caseId) ? normalizeFeedback(feedback) : null),
  );
  const normalizedTelemetry = normalizeSavedTelemetryQueue(state.pendingTelemetry);
  const changed =
    normalizedCompletedCases.changed ||
    normalizedDiscoveredClues.changed ||
    normalizedLog.changed ||
    normalizedCaseResults.changed ||
    normalizedFeedback.changed ||
    normalizedTelemetry.changed;

  if (!changed) return state;
  return {
    ...state,
    completedCases: normalizedCompletedCases.value,
    discoveredClues: normalizedDiscoveredClues.value,
    log: normalizedLog.value,
    caseResults: normalizedCaseResults.value,
    playtestFeedback: normalizedFeedback.value,
    pendingTelemetry: normalizedTelemetry.value,
    paused: true,
    lastError: state.lastError ?? {
      id: `repair-${Date.now()}`,
      occurredAt: new Date().toISOString(),
      source: "save-integrity",
      message: "Saved nested gameplay data was repaired before resume.",
      currentCase: state.currentCase,
      nodeId: state.nodeId,
    },
  };
}

export function createReplaySavedState(seed) {
  if (!seed || !isKnownCaseId(seed.currentCase) || !isNodeValidForCase(seed.currentCase, seed.nodeId)) return null;
  const replayLog = (Array.isArray(seed.log) ? seed.log : [])
    .filter((entry) => entry && typeof entry.nodeId === "string" && nodes[entry.nodeId])
    .map((entry) => {
      const choice = nodes[entry.nodeId]?.choices?.find((item) => item.id === entry.choiceId);
      return {
        nodeId: entry.nodeId,
        title: nodes[entry.nodeId]?.title ?? "",
        choiceId: typeof entry.choiceId === "string" ? entry.choiceId : "",
        choice: choice?.label ?? "",
        freeText: "",
        effect: {},
        cognition: {},
        triggers: [],
        responseTimeSec: 0,
        resourcesBefore: {},
        resourcesAfter: {},
        isSystemEvent: false,
      };
    });
  return {
    schemaVersion: SAVE_SCHEMA_VERSION,
    playerName: "",
    playStyle: "instinct",
    dataConsent: false,
    started: true,
    paused: false,
    currentCase: seed.currentCase,
    completedCases: [],
    discoveredClues: [],
    caseResults: {},
    playtestFeedback: {},
    nodeId: seed.nodeId,
    resources: normalizeNumberMap(seed.resources, initialResources).value,
    log: replayLog,
    triggers: makeEmptyScores(triggerLabels),
    cognition: makeEmptyScores(cognitionLabels),
    freeText: "",
    echo: "재현 링크로 복원된 장면입니다.",
    nodeEnteredAt: Date.now(),
    pendingTelemetry: [],
    protocolUsed: false,
    timerPenaltyCount: 0,
    probeUsed: false,
  };
}

export function shouldCaptureSaveSlot(previousState, nextState) {
  if (!nextState?.saveSchemaVersion) return false;
  if (nextState.lastError) return true;
  if (!previousState?.started && nextState.started) return true;
  if (previousState?.currentCase !== nextState.currentCase) return true;
  if (previousState?.nodeId !== nextState.nodeId) return true;
  const previousCompletedCount = Array.isArray(previousState?.completedCases) ? previousState.completedCases.length : 0;
  const nextCompletedCount = Array.isArray(nextState.completedCases) ? nextState.completedCases.length : 0;
  return previousCompletedCount !== nextCompletedCount;
}

export function getRouteMarker(entry) {
  const nodeId = typeof entry?.nodeId === "string" ? entry.nodeId : "";
  const scene = nodes[nodeId];
  if (entry?.routeChangeKind === "memory" || entry?.continuityMemory) return { label: "이전 선택 귀환", tone: "memory" };
  if (entry?.routeChangeKind === "evidence-turn" || nodeId.includes("evidence_turn") || String(entry?.choiceId ?? "").includes("evidence_turn")) return { label: "단서 역전", tone: "turnaround" };
  if (entry?.routeChangeKind === "free-text" || entry?.freeTextBranchId) return { label: "문장 분기", tone: "system" };
  if (scene?.phase === "BRANCH BRIEFING") return { label: "분기 시작", tone: "branch" };
  if (nodeId.includes("aftershock")) return { label: "후폭풍", tone: "aftermath" };
  if (nodeId.includes("reaction")) return { label: "즉시 반응", tone: "reaction" };
  if (["WITNESS", "TRACE", "ASSEMBLY", "BARGAIN", "AUDIT", "PUBLIC", "PATTERN", "VOICE", "DILEMMA"].some((phase) => scene?.phase?.includes(phase))) {
    return { label: "증거 추적", tone: "evidence" };
  }
  return { label: "핵심 판단", tone: "decision" };
}

export function reportSilentFailure(code, detail = {}) {
  const error = new Error(`[silent:${code}] ${JSON.stringify(detail)}`);
  error.name = "SilentRouteFailure";
  recordAppError(error, {}, `silent-${code}`);
  if ((import.meta.env ?? {}).DEV) console.warn(error);
  return error;
}
