import { normalizeFeedback, SAVE_SCHEMA_VERSION } from "../appConfig.js";
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
import { getOutcomeChoiceId, makeEmptyScores } from "../gameLogic.js";
import { serializeRunState } from "../gauntlet/gauntletEngine.js";
import { recordAppError } from "./errorRecovery.js";
import { sanitizeTelemetryQueue } from "./payloadSchemas.js";

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

/**
 * A key the save never wrote reads as its default, so filling one in is not a
 * repair. Comparing whole entries as JSON called every ordinary reload a
 * repair: `choose()` writes `routeChangeKind: undefined`, which JSON drops, and
 * the normalizer answered with "" -- so each mid-run reload raised the recovery
 * notice, forced a save write and spent a recovery slot. A value that is present
 * and gets replaced or dropped is a repair; nothing else is.
 */
function isMissingSavedValue(value) {
  return value === undefined || value === null;
}

function isSavedValueRepaired(original, normalized) {
  if (isMissingSavedValue(original)) return false;
  if (Array.isArray(normalized)) {
    if (!Array.isArray(original) || original.length !== normalized.length) return true;
    return normalized.some((item, index) => isSavedValueRepaired(original[index], item));
  }
  if (normalized && typeof normalized === "object") {
    if (!original || typeof original !== "object" || Array.isArray(original)) return true;
    const dropped = Object.keys(original).some(
      (key) => !isMissingSavedValue(original[key]) && !Object.hasOwn(normalized, key),
    );
    return dropped || Object.keys(normalized).some((key) => isSavedValueRepaired(original[key], normalized[key]));
  }
  return !Object.is(original, normalized);
}

function normalizeSavedArray(value, normalizeItem) {
  if (!Array.isArray(value)) return { value: [], changed: true };
  let changed = false;
  let copied = false;
  const next = [];
  value.forEach((item) => {
    const normalized = normalizeItem(item);
    if (normalized === null) {
      changed = true;
      return;
    }
    if (normalized !== item) {
      copied = true;
      if (isSavedValueRepaired(item, normalized)) changed = true;
    }
    next.push(normalized);
  });
  return { value: changed || copied ? next : value, changed };
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

// Every kind `choose()` in GameRuntime.jsx writes. "blackout-skip" was missing,
// so a bust that skipped a scene lost its marker on the next reload.
const ROUTE_CHANGE_KINDS = ["memory", "evidence-turn", "reframe", "blackout-skip"];

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
    reframe: Boolean(entry.reframe),
    reframeOpenedRoute: Boolean(entry.reframeOpenedRoute),
    reframeBranchId: typeof entry.reframeBranchId === "string" ? entry.reframeBranchId : "",
    continuityMemory: Boolean(entry.continuityMemory),
    routeChangeKind: ROUTE_CHANGE_KINDS.includes(entry.routeChangeKind) ? entry.routeChangeKind : "",
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
    reframeCount: Number.isFinite(summary.reframeCount) ? summary.reframeCount : 0,
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
    // A save written before bridge closings were mapped still names the bridge.
    outcomeChoiceId: typeof summary.outcomeChoiceId === "string" ? getOutcomeChoiceId(summary.outcomeChoiceId, nodes[summary.outcomeNodeId]) : null,
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
  let copied = false;
  Object.entries(value).forEach(([key, item]) => {
    const normalized = normalizeItem(item, key);
    if (normalized === null) {
      changed = true;
      return;
    }
    if (normalized !== item) {
      copied = true;
      if (isSavedValueRepaired(item, normalized)) changed = true;
    }
    next[key] = normalized;
  });
  return { value: changed || copied ? next : value, changed };
}

/**
 * Items that can never be sent are dropped, not held against the save: a queue
 * is the network's backlog, and losing one row of it is not a damaged run.
 */
function normalizeSavedTelemetryQueue(value) {
  if (!Array.isArray(value)) return { value: [], changed: true };
  const next = sanitizeTelemetryQueue(value);
  const unchanged = next.length === value.length && next.every((item, index) => item === value[index]);
  return { value: unchanged ? value : next, changed: false };
}

/**
 * The nested half of a save, normalised. Returns the same object when nothing
 * was repaired and nothing needed filling, a copy with defaults filled in when
 * something was only missing, and a paused copy carrying `lastError` when a
 * present value had to be replaced or dropped.
 */
function normalizeNestedState(state) {
  if (!state || typeof state !== "object" || Array.isArray(state)) return { value: null, repaired: false };

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
  const fields = {
    completedCases: normalizedCompletedCases,
    discoveredClues: normalizedDiscoveredClues,
    log: normalizedLog,
    caseResults: normalizedCaseResults,
    playtestFeedback: normalizedFeedback,
    pendingTelemetry: normalizedTelemetry,
  };
  const repaired = Object.values(fields).some((field) => field.changed);
  const filled = Object.entries(fields).some(([key, field]) => field.value !== state[key]);
  if (!repaired && !filled) return { value: state, repaired: false };
  const next = { ...state };
  Object.entries(fields).forEach(([key, field]) => {
    next[key] = field.value;
  });
  if (!repaired) return { value: next, repaired: false };
  return {
    value: {
      ...next,
      paused: true,
      lastError: state.lastError ?? {
        id: `repair-${Date.now()}`,
        occurredAt: new Date().toISOString(),
        source: "save-integrity",
        message: "Saved nested gameplay data was repaired before resume.",
        currentCase: state.currentCase,
        nodeId: state.nodeId,
      },
    },
    repaired: true,
  };
}

export function normalizeSavedNestedState(state) {
  return normalizeNestedState(state).value;
}

/**
 * The table's record, brought to the shape this build deals from. The save
 * validator asks for the current fields, so a run saved before one of them
 * existed -- the decision board's blob from before the gauntlet, a table from
 * before relics -- failed validation and the whole save was discarded on load:
 * a returning player found a fresh intro. `normalizeRunState` is the engine's
 * own reading of an older record, and the runtime already ran it; it ran after
 * the validator had thrown the save away.
 *
 * Filling in a field the record never had is not a repair (see
 * `isMissingSavedValue`). Replacing or dropping one it did have is.
 */
function normalizeSavedDynamics(state) {
  if (!state || typeof state !== "object" || Array.isArray(state)) return { value: state, repaired: false };
  const saved = state.dynamics;
  if (isMissingSavedValue(saved)) return { value: state, repaired: false };
  const current = serializeRunState(saved);
  if (JSON.stringify(current) === JSON.stringify(saved)) return { value: state, repaired: false };
  if (!isSavedValueRepaired(saved, current)) return { value: { ...state, dynamics: current }, repaired: false };
  return {
    value: {
      ...state,
      dynamics: current,
      paused: true,
      lastError: state.lastError ?? {
        id: `repair-${Date.now()}`,
        occurredAt: new Date().toISOString(),
        source: "save-integrity",
        message: "이전 버전에서 저장한 판 기록을 지금 형식으로 고쳐서 불러왔습니다.",
        currentCase: state.currentCase,
        nodeId: state.nodeId,
      },
    },
    repaired: true,
  };
}

/**
 * The one repair every reader of the save runs: route, metrics, nested data,
 * then the table's record. `repaired` is true only when a present value was
 * replaced or dropped, which is what earns a recovery notice, a write and a
 * recovery slot.
 */
export function repairSavedState(state) {
  const routed = repairSavedRoute(state);
  const measured = normalizeSavedGameplayState(routed);
  const nested = normalizeNestedState(measured);
  const dealt = normalizeSavedDynamics(nested.value);
  return {
    state: dealt.value,
    repaired: routed !== state || measured !== routed || nested.repaired || dealt.repaired,
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
    saveSchemaVersion: SAVE_SCHEMA_VERSION,
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
  if (entry?.routeChangeKind === "reframe" || entry?.reframeBranchId) return { label: "판 다시 짜기", tone: "system" };
  // A scene is read by its kind; the id is the fallback for a log entry whose
  // scene has since left the graph.
  if (scene?.kind === "opening") return { label: "분기 시작", tone: "branch" };
  if (scene?.kind === "aftermath" || nodeId.includes("aftershock")) return { label: "후폭풍", tone: "aftermath" };
  if (scene?.kind === "reaction" || nodeId.includes("reaction")) return { label: "즉시 반응", tone: "reaction" };
  if (scene?.kind === "connective") return { label: "증거 추적", tone: "evidence" };
  return { label: "핵심 판단", tone: "decision" };
}

/**
 * Reading a save must not write one. `recordAppError` writes the error log, the
 * save's `lastError` and a recovery slot, so a normaliser that reports while a
 * component derives its state would write storage from inside a render. The
 * reports made during `collectSilentFailures` are held and handed back, and the
 * caller sends them with `reportSilentFailures` from an effect.
 */
let deferredSilentFailures = null;

export function collectSilentFailures(run) {
  const previous = deferredSilentFailures;
  const failures = [];
  deferredSilentFailures = failures;
  try {
    return { value: run(), failures };
  } finally {
    deferredSilentFailures = previous;
  }
}

export function reportSilentFailures(failures = []) {
  failures.forEach(({ code, detail }) => reportSilentFailure(code, detail));
}

export function reportSilentFailure(code, detail = {}) {
  if (deferredSilentFailures) {
    deferredSilentFailures.push({ code, detail });
    return null;
  }
  const error = new Error(`[silent:${code}] ${JSON.stringify(detail)}`);
  error.name = "SilentRouteFailure";
  recordAppError(error, {}, `silent-${code}`);
  if ((import.meta.env ?? {}).DEV) console.warn(error);
  return error;
}
