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
import { repairSavedState } from "../../src/state/savedState.js";
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
  assert.deepEqual(snapshot.investigatedTargets, { a: true });
  assert.deepEqual(snapshot.hypothesisDecisions, { b: "keep" });
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
