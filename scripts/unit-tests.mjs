import assert from "node:assert/strict";

import {
  appendLocalRankingRowToRows,
  parseLocalRankingRows,
} from "../src/state/useLocalRanking.js";
import {
  createIntroView,
  createPlayView,
  createResultView,
} from "../src/viewModels/appViewModels.js";
import {
  createRecoverySnapshot,
  isSavedStateShapeValid,
  migrateSavedState,
  parseCurrentSavedState,
  parseRecoverySlots,
  restoreRecoverySnapshot,
} from "../src/appConfig.js";

const validRanking = { case_id: "case01", summary: { rank: "A", momentumScore: 72 } };
assert.deepEqual(parseLocalRankingRows("not json"), [], "local ranking parser should ignore corrupt JSON");
assert.deepEqual(parseLocalRankingRows(JSON.stringify([validRanking, null, { case_id: "case02" }])) , [validRanking], "local ranking parser should keep only complete rows");
assert.equal(
  appendLocalRankingRowToRows(Array.from({ length: 100 }, (_, index) => ({ case_id: `case-${index}`, summary: {} })), validRanking).length,
  100,
  "local ranking history should stay bounded",
);
assert.equal(
  appendLocalRankingRowToRows(Array.from({ length: 100 }, (_, index) => ({ case_id: `case-${index}`, summary: {} })), validRanking).at(-1),
  validRanking,
  "local ranking append should keep the newest row",
);

assert.throws(() => createIntroView({}, {}), /intro view is missing required field/, "intro view should fail fast");
assert.throws(
  () => createPlayView({ AdaptiveMusic() {}, renderDecisionReveal() {}, renderRecoveryNotice() {}, currentCase: "case01", node: {}, fixedChoices: [], choose() {}, handleChoiceClick() {} }, {}),
  /resources/,
  "play view should require resource ownership",
);
assert.throws(
  () => createResultView({ AdaptiveMusic() {}, GAME_TITLE: "Critical Point", renderDecisionReveal() {}, renderRecoveryNotice() {}, currentCase: "case01", result: {}, resultRank: "A", reset() {} }, {}),
  /startCase/,
  "result view should require transition actions",
);

const migrated = migrateSavedState({ saveSchemaVersion: 1, currentCase: "case01", nodeId: "start", completedCases: [], log: [] });
assert.equal(migrated.saveSchemaVersion, 2, "old saves should migrate to the current schema");
assert.deepEqual(migrated.pendingTelemetry, [], "save migration should add a telemetry queue");
assert.equal(parseCurrentSavedState(JSON.stringify({ saveSchemaVersion: 99 })), null, "future saves should not restore");
assert.equal(
  isSavedStateShapeValid({ currentCase: "case01", nodeId: "start", completedCases: [], discoveredClues: [], log: [], pendingTelemetry: [], caseResults: {}, playtestFeedback: {}, resources: {}, triggers: {}, cognition: {} }),
  true,
  "valid save shape should pass",
);
assert.equal(
  isSavedStateShapeValid({ currentCase: "case01", nodeId: "start", completedCases: [], discoveredClues: [], log: [], pendingTelemetry: [{ id: "bad", type: "unknown", label: "bad", payload: {} }], caseResults: {}, playtestFeedback: {}, resources: {}, triggers: {}, cognition: {} }),
  false,
  "unknown telemetry types should fail save shape validation",
);

const snapshot = createRecoverySnapshot({
  saveSchemaVersion: 2,
  currentCase: "case01",
  nodeId: "start",
  log: [{ nodeId: "start", freeText: "private", spokenChoice: "private" }],
  pendingTelemetry: [{ id: "pending", type: "case", label: "pending", payload: {} }],
});
assert.equal(snapshot.pendingTelemetry.length, 0, "recovery snapshots should omit telemetry queues");
assert.equal("freeText" in snapshot.log[0], false, "recovery snapshots should omit free text");
assert.equal(restoreRecoverySnapshot(snapshot).freeText, "", "restored recovery saves should start with empty free text");
assert.equal(
  parseRecoverySlots(JSON.stringify({ recoverySlotSchemaVersion: 1, slots: [{ id: "slot", savedAt: "now", currentCase: "case01", nodeId: "start", snapshot }] })).slots.length,
  1,
  "valid recovery slots should restore",
);

console.log("Unit tests passed");
