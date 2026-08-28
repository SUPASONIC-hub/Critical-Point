import { CASE_START_NODES, cognitionLabels, initialResources, nodes, triggerLabels } from "../gameData.js";
import { makeEmptyScores } from "../gameLogic.js";
import { SAVE_SCHEMA_VERSION } from "../appConfig.js";

export const TRACE_STORAGE_KEY = "critical-point-trace-v1";
const TRACE_MAX_ITEMS = 200;
export const REPLAY_QUERY_KEY = "replay";

export function encodeReplaySeed(seed) {
  try {
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(seed))));
    return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  } catch {
    return "";
  }
}

export function decodeReplaySeed(value) {
  if (!value) return null;
  try {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
    return JSON.parse(decodeURIComponent(escape(atob(padded))));
  } catch {
    return null;
  }
}

export function getReplaySeedFromLocation() {
  try {
    return decodeReplaySeed(new URLSearchParams(globalThis.location?.search ?? "").get(REPLAY_QUERY_KEY));
  } catch {
    return null;
  }
}

export function getTraceEvents() {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(TRACE_STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function appendTraceEvent(event = {}) {
  try {
    const next = [
      ...getTraceEvents(),
      { t: Date.now(), ...event },
    ].slice(-TRACE_MAX_ITEMS);
    sessionStorage.setItem(TRACE_STORAGE_KEY, JSON.stringify(next));
    return next;
  } catch {
    return getTraceEvents();
  }
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
    timerPenaltyApplied: false,
    probeUsed: false,
  };
}
