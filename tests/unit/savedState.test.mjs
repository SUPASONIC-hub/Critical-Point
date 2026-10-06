import assert from "node:assert/strict";
import { test } from "node:test";

import {
  createRecoverySnapshot,
  isSavedStateShapeValid,
  makeEmptyScores,
  parseCurrentSavedState,
  SAVE_SCHEMA_VERSION,
  setReplaySession,
  writeSaveState,
} from "../../src/appConfig.js";
import { createCloudSavePayload } from "../../src/cloudSave.js";
import { cognitionLabels, initialResources, triggerLabels } from "../../src/gameData.js";
import { repairSavedState, shouldCaptureSaveSlot } from "../../src/state/savedState.js";
import { sanitizeTelemetryQueue, validateTelemetryItem } from "../../src/state/payloadSchemas.js";

/** A log entry shaped the way `choose()` in GameRuntime.jsx writes one. */
function choiceEntry(overrides = {}) {
  return {
    nodeId: "c3_start",
    caseId: "case03",
    speaker: "한서윤",
    choiceId: "c3_start_fast",
    title: "경쟁사 앞의 결정",
    chapterRule: "",
    choice: "빠르게 간다",
    spokenChoice: "지금 바로 갑니다.",
    reframe: false,
    reframeOpenedRoute: false,
    reframeBranchId: null,
    continuityMemory: false,
    routeChangeKind: undefined,
    skippedNodeId: undefined,
    effect: { time: -4, capital: 3 },
    riskRewardEffect: { time: -4, capital: 3 },
    cognition: { persistence: 2 },
    triggers: ["competition", "recognition"],
    threshold: { state: "cash", busted: false, gauge: 41, wall: 70, pushes: 2 },
    responseTimeSec: 12.5,
    resourcesBefore: { ...initialResources },
    resourcesAfter: { ...initialResources, time: initialResources.time - 4 },
    ...overrides,
  };
}

function midRunSave(log) {
  return {
    saveSchemaVersion: SAVE_SCHEMA_VERSION,
    runId: "run-1",
    playerName: "분석관",
    started: true,
    paused: true,
    currentCase: "case03",
    nodeId: "c3_start",
    completedCases: ["case01", "case02"],
    discoveredClues: [{ id: "clue-1", title: "장부", text: "빠진 한 줄" }],
    caseResults: {},
    playtestFeedback: { case02: { clarity: "4", difficulty: "3", comment: "", savedAt: "2026-09-27T00:00:00.000Z" } },
    resources: { ...initialResources },
    triggers: makeEmptyScores(triggerLabels),
    cognition: makeEmptyScores(cognitionLabels),
    log,
    pendingTelemetry: [],
  };
}

/** What a reload reads: the save after a trip through JSON, which drops `undefined`. */
const reloaded = (save) => JSON.parse(JSON.stringify(save));

test("an ordinary mid-run save reloads without being called repaired", () => {
  const save = reloaded(midRunSave([choiceEntry(), choiceEntry({ nodeId: "c3_start", routeChangeKind: "reframe", reframe: true })]));
  const { state, repaired } = repairSavedState(save);
  assert.equal(repaired, false, "a missing default is not a repair");
  assert.equal(state.lastError, undefined, "no recovery notice for a normal reload");
  assert.equal(state.log.length, 2);
  assert.equal(state.log[0].routeChangeKind, "", "the missing kind reads as its default");
  assert.equal(state.log[0].threshold.gauge, 41, "fields the normaliser does not know are kept");
});

test("a bust that skipped a scene keeps its marker across a reload", () => {
  const save = reloaded(midRunSave([choiceEntry({ routeChangeKind: "blackout-skip", skippedNodeId: "c3_route_system" })]));
  const { state, repaired } = repairSavedState(save);
  assert.equal(repaired, false);
  assert.equal(state.log[0].routeChangeKind, "blackout-skip");
});

test("a present value that has to be replaced is still a repair", () => {
  const save = reloaded(midRunSave([choiceEntry({ effect: { time: "broken", capital: 3 } })]));
  const { state, repaired } = repairSavedState(save);
  assert.equal(repaired, true);
  assert.deepEqual(state.log[0].effect, { capital: 3 });
  assert.equal(state.lastError.source, "save-integrity");
});

test("authored lines are not private telemetry; typed text and names are", () => {
  const decisionLog = [choiceEntry()];
  assert.deepEqual(validateTelemetryItem({ type: "case", payload: { decision_log: decisionLog } }), [], "spokenChoice is the card's line");
  assert.deepEqual(validateTelemetryItem({ type: "case", payload: { summary: { comment: "" } } }), [], "an empty value discloses nothing");
  assert.deepEqual(validateTelemetryItem({ type: "case", payload: { summary: { comment: "hello" } } }), ["payload contains private fields"]);
  assert.deepEqual(validateTelemetryItem({ type: "error", payload: { context: { playerName: "홍길동" } } }), ["payload contains private fields"]);
  assert.deepEqual(
    validateTelemetryItem({ type: "feedback", payload: { event_id: "e-1", feedback: { comment: "좋았어요" } } }),
    [],
    "a feedback row exists to carry the comment",
  );
  assert.deepEqual(validateTelemetryItem({ type: "feedback", payload: { feedback: { playerName: "홍길동" } } }), ["payload contains private fields"]);
  assert.deepEqual(validateTelemetryItem({ type: "case", payload: { event_id: 7 } }), ["invalid event_id"]);
});

test("a queue item that can never be sent is dropped, not held against the save", () => {
  const raw = JSON.stringify({
    ...midRunSave([]),
    pendingTelemetry: [
      { id: "good", type: "case", label: "case", payload: { event_id: "e-good", decision_log: [choiceEntry()] } },
      { id: "bad", type: "case", label: "case", payload: { playerName: "홍길동" } },
      { id: "unknown", type: "analysis", label: "x", payload: {} },
    ],
  });
  const parsed = parseCurrentSavedState(raw);
  assert.ok(isSavedStateShapeValid(parsed), "the run survives its queue");
  assert.deepEqual(parsed.pendingTelemetry.map((item) => item.id), ["good"]);
});

test("a feedback row queued in the old column shape becomes the row the table takes", () => {
  const [item] = sanitizeTelemetryQueue([
    {
      id: "feedback-case02-1",
      type: "feedback",
      label: "피드백",
      payload: {
        session_id: "s",
        session_code: "CODE",
        case_id: "case02",
        case_title: "제목",
        submitted_at: "2026-09-27T00:00:00.000Z",
        clarity_score: 4,
        difficulty_score: 2,
        comment: "좋았어요",
      },
    },
  ]);
  assert.deepEqual(item.payload, {
    event_id: "feedback-case02-1",
    session_id: "s",
    session_code: "CODE",
    case_id: "case02",
    feedback: { caseTitle: "제목", submittedAt: "2026-09-27T00:00:00.000Z", clarity: 4, difficulty: 2, comment: "좋았어요" },
  });
});

test("a recovery slot keeps the whole log, fields and all", () => {
  const log = Array.from({ length: 30 }, (_, index) => choiceEntry({ responseTimeSec: index }));
  const snapshot = createRecoverySnapshot({ ...midRunSave(log), investigatedTargets: { a: true }, hypothesisDecisions: { b: "keep" } });
  assert.equal(snapshot.log.length, 30);
  assert.deepEqual(snapshot.log[29], log[29]);
  // The decision board's five fields, which no rule read, are not copied on.
  for (const key of ["investigatedTargets", "hypothesisDecisions", "protocolUsed", "timerPenaltyCount", "probeUsed"]) {
    assert.equal(Object.hasOwn(snapshot, key), false, key);
  }
});

test("a save that still carries the decision board's fields loads, and is not called repaired", () => {
  const save = { ...midRunSave([]), protocolUsed: true, timerPenaltyCount: 2, probeUsed: true, investigatedTargets: { a: true }, hypothesisDecisions: { b: "keep" } };
  const { state, repaired } = repairSavedState(save);
  assert.equal(repaired, false);
  assert.equal(isSavedStateShapeValid(state), true);
});

test("a save from before a trigger or a thinking label existed is filled in, not repaired", () => {
  const { protection: _dropped, ...olderTriggers } = makeEmptyScores(triggerLabels);
  const { state, repaired } = repairSavedState({ ...midRunSave([]), paused: false, triggers: olderTriggers });
  assert.equal(repaired, false, "a label added since the save is a default to fill in");
  assert.equal(state.triggers.protection, 0);
  assert.equal(state.paused, false, "and the run is not paused for it");
  assert.equal(state.lastError ?? null, null);

  const broken = repairSavedState({ ...midRunSave([]), resources: { ...initialResources, trust: "many" } });
  assert.equal(broken.repaired, true, "a value that is there and is not a number still is");
  assert.equal(broken.state.resources.trust, initialResources.trust);
  const unknown = repairSavedState({ ...midRunSave([]), cognition: { ...makeEmptyScores(cognitionLabels), telepathy: 3 } });
  assert.equal(unknown.repaired, true, "and so is a key this build does not know");
  assert.equal(Object.hasOwn(unknown.state.cognition, "telepathy"), false);
});

test("a recovery slot is kept at a run's start, a case's opening and its close, not at every scene", () => {
  const at = (patch) => ({ saveSchemaVersion: SAVE_SCHEMA_VERSION, started: true, currentCase: "case03", nodeId: "c3_start", completedCases: ["case01", "case02"], ...patch });
  assert.equal(shouldCaptureSaveSlot(at({}), at({ nodeId: "c3_next" })), false, "the next scene of the same case");
  assert.equal(shouldCaptureSaveSlot(at({ started: false }), at({})), true, "a run started or picked up again");
  assert.equal(shouldCaptureSaveSlot(at({}), at({ currentCase: "case04", nodeId: "c4_start" })), true, "a case opened");
  assert.equal(shouldCaptureSaveSlot(at({}), at({ nodeId: "result", completedCases: ["case01", "case02", "case03"] })), true, "a case closed");
  assert.equal(shouldCaptureSaveSlot(at({}), at({ nodeId: "c3_next", lastError: { id: "x" } })), true, "a save that carries an error");
  assert.equal(shouldCaptureSaveSlot(at({}), { nodeId: "c3_next" }), false, "not a save at all");
});

test("a consent, a time or a name the save holds as the wrong kind of thing is not taken as written", () => {
  const { state } = repairSavedState({ ...midRunSave([]), dataConsent: "false", nodeEnteredAt: "yesterday", playerName: { toString: () => "x" }, started: "yes", playStyle: 7, openingLegacy: "legacy" });
  assert.equal(state.dataConsent, false, 'the string "false" is not consent');
  assert.equal(Number.isFinite(state.nodeEnteredAt), true);
  assert.equal(state.playerName, "");
  assert.equal(state.started, false);
  assert.equal(state.playStyle, "instinct");
  assert.equal(state.openingLegacy, null);
  assert.equal(repairSavedState({ ...midRunSave([]), dataConsent: 1 }).state.dataConsent, false, "only true is consent");

  const whole = { ...midRunSave([]), dataConsent: true, nodeEnteredAt: 1_700_000_000_000, playStyle: "auditor", openingLegacy: null };
  const kept = repairSavedState(whole).state;
  assert.deepEqual(
    [kept.dataConsent, kept.nodeEnteredAt, kept.playStyle, kept.playerName, kept.started],
    [true, 1_700_000_000_000, "auditor", "분석관", true],
    "values of the right kind are left as they are",
  );
});

test("the cloud copy leaves out the name, the comments and the telemetry queue", () => {
  const save = {
    ...midRunSave([choiceEntry()]),
    playtestFeedback: { case02: { clarity: "4", difficulty: "3", comment: "제 이름은 홍길동", savedAt: "now" } },
    pendingTelemetry: [{ id: "x", type: "case", label: "x", payload: {} }],
  };
  const uploaded = createCloudSavePayload(save);
  assert.equal("playerName" in uploaded, false);
  assert.equal("pendingTelemetry" in uploaded, false);
  assert.equal(uploaded.playtestFeedback.case02.comment, "");
  assert.equal(uploaded.playtestFeedback.case02.clarity, "4");
  assert.equal(uploaded.log.length, 1);
  assert.equal(save.playerName, "분석관", "the local save is untouched");
});

test("a replay link never writes the save", () => {
  setReplaySession(true);
  try {
    const result = writeSaveState(midRunSave([]), { force: true });
    assert.equal(result.saved, false);
    assert.equal(result.replay, true);
  } finally {
    setReplaySession(false);
  }
});
