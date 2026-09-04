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
import { buildPlaytestExport } from "../src/state/playtestExport.js";
import { buildLeaderboard } from "../src/ranking.js";
import {
  createRecoverySnapshot,
  isSavedStateShapeValid,
  migrateSavedState,
  parseCurrentSavedState,
  parseRecoverySlots,
  restoreRecoverySnapshot,
} from "../src/appConfig.js";
import { test } from "node:test";
import { describeChoiceDilemma, explainResourceTradeoff } from "../src/gameLogic.js";
import { endsOnConsonant, objectParticle, subjectParticle } from "../src/playerLanguage.js";
import { nodes } from "../src/gameData.js";


const validRanking = { case_id: "case01", summary: { rank: "A", momentumScore: 72 } };
test("local ranking parser should ignore corrupt JSON", () => {
  assert.deepEqual(parseLocalRankingRows("not json"), [], "local ranking parser should ignore corrupt JSON");
});
test("local ranking parser should keep only complete rows", () => {
  assert.deepEqual(parseLocalRankingRows(JSON.stringify([validRanking, null, { case_id: "case02" }])) , [validRanking], "local ranking parser should keep only complete rows");
});
test("local ranking history should stay bounded", () => {
  assert.equal(
    appendLocalRankingRowToRows(Array.from({ length: 100 }, (_, index) => ({ case_id: `case-${index}`, summary: {} })), validRanking).length,
    100,
    "local ranking history should stay bounded",
  );
});
test("local ranking append should keep the newest row", () => {
  assert.equal(
    appendLocalRankingRowToRows(Array.from({ length: 100 }, (_, index) => ({ case_id: `case-${index}`, summary: {} })), validRanking).at(-1),
    validRanking,
    "local ranking append should keep the newest row",
  );
});

test("intro view should fail fast", () => {
  assert.throws(
    () => createIntroView({}, {}),
    /intro view contract broken: missing common\.AdaptiveMusic/,
    "intro view should fail fast",
  );
});
test("a field nobody grouped should fail rather than ride along unread", () => {
  assert.throws(
    () => createIntroView({ strayField: 1 }, {}),
    /ungrouped strayField/,
    "a field nobody grouped should fail rather than ride along unread",
  );
});
test("play view should require resource ownership", () => {
  assert.throws(
    () => createPlayView({ AdaptiveMusic() {}, renderDecisionReveal() {}, renderRecoveryNotice() {}, currentCase: "case01", node: {}, fixedChoices: [], choose() {}, handleChoiceClick() {} }, {}),
    /resources/,
    "play view should require resource ownership",
  );
});
test("result view should require transition actions", () => {
  assert.throws(
    () => createResultView({ AdaptiveMusic() {}, GAME_TITLE: "Critical Point", renderDecisionReveal() {}, renderRecoveryNotice() {}, currentCase: "case01", result: {}, resultRank: "A", reset() {} }, {}),
    /startCase/,
    "result view should require transition actions",
  );
});

const migrated = migrateSavedState({ saveSchemaVersion: 1, currentCase: "case01", nodeId: "start", completedCases: [], log: [] });
test("old saves should migrate to the current schema", () => {
  assert.equal(migrated.saveSchemaVersion, 2, "old saves should migrate to the current schema");
});
test("save migration should add a telemetry queue", () => {
  assert.deepEqual(migrated.pendingTelemetry, [], "save migration should add a telemetry queue");
});
test("future saves should not restore", () => {
  assert.equal(parseCurrentSavedState(JSON.stringify({ saveSchemaVersion: 99 })), null, "future saves should not restore");
});
test("valid save shape should pass", () => {
  assert.equal(
    isSavedStateShapeValid({ currentCase: "case01", nodeId: "start", completedCases: [], discoveredClues: [], log: [], pendingTelemetry: [], caseResults: {}, playtestFeedback: {}, resources: {}, triggers: {}, cognition: {} }),
    true,
    "valid save shape should pass",
  );
});
test("unknown telemetry types should fail save shape validation", () => {
  assert.equal(
    isSavedStateShapeValid({ currentCase: "case01", nodeId: "start", completedCases: [], discoveredClues: [], log: [], pendingTelemetry: [{ id: "bad", type: "unknown", label: "bad", payload: {} }], caseResults: {}, playtestFeedback: {}, resources: {}, triggers: {}, cognition: {} }),
    false,
    "unknown telemetry types should fail save shape validation",
  );
});

const snapshot = createRecoverySnapshot({
  saveSchemaVersion: 2,
  currentCase: "case01",
  nodeId: "start",
  log: [{ nodeId: "start", freeText: "private", spokenChoice: "private" }],
  pendingTelemetry: [{ id: "pending", type: "case", label: "pending", payload: {} }],
});
test("recovery snapshots should omit telemetry queues", () => {
  assert.equal(snapshot.pendingTelemetry.length, 0, "recovery snapshots should omit telemetry queues");
});
test("recovery snapshots should omit free text", () => {
  assert.equal("freeText" in snapshot.log[0], false, "recovery snapshots should omit free text");
});
test("restored recovery saves should start with empty free text", () => {
  assert.equal(restoreRecoverySnapshot(snapshot).freeText, "", "restored recovery saves should start with empty free text");
});
test("valid recovery slots should restore", () => {
  assert.equal(
    parseRecoverySlots(JSON.stringify({ recoverySlotSchemaVersion: 1, slots: [{ id: "slot", savedAt: "now", currentCase: "case01", nodeId: "start", snapshot }] })).slots.length,
    1,
    "valid recovery slots should restore",
  );
});

const exportInput = {
  run: { currentCase: "case01", summary: { rank: "A" } },
  gameplay: { rank: "A", momentumScore: 71 },
  diagnostics: { playerName: "tester", log: [{ freeText: "private" }], sessionId: "session-1" },
};
const summaryExport = buildPlaytestExport({ ...exportInput, includeDiagnostics: false });
test("default export should be the shareable summary", () => {
  assert.equal(summaryExport.exportMode, "summary", "default export should be the shareable summary");
});
test("summary export should keep run fields", () => {
  assert.equal(summaryExport.currentCase, "case01", "summary export should keep run fields");
});
for (const key of ["playerName", "log", "sessionId", "errorLog", "saveSlots", "trace"]) {
  assert.equal(key in summaryExport, false, `summary export must not carry ${key}`);
}
const diagnosticExport = buildPlaytestExport({ ...exportInput, includeDiagnostics: true });
test("diagnostic export should be labelled", () => {
  assert.equal(diagnosticExport.exportMode, "diagnostic", "diagnostic export should be labelled");
});
test("diagnostic export should carry the session id", () => {
  assert.equal(diagnosticExport.sessionId, "session-1", "diagnostic export should carry the session id");
});
test("diagnostic export should include an error log array", () => {
  assert.deepEqual(diagnosticExport.errorLog, [], "diagnostic export should include an error log array");
});

const seasonRow = (score, completedAt) => ({
  run_id: "run-1",
  case_id: "season-final",
  completed_at: completedAt,
  summary: { rank: "A", burstScore: score, seasonComplete: true },
});
test("a second completed-season row for one run should win on score, not arrival order", () => {
  assert.equal(
    buildLeaderboard([seasonRow(60, "2026-01-01"), seasonRow(90, "2026-01-02")])[0].score,
    90,
    "a second completed-season row for one run should win on score, not arrival order",
  );
});

// A Korean particle agrees with the sound before it, and the sentences the game
// builds at runtime kept baking one in: the play screen printed "사람 피해을"
// under every choice that moved it.
test("object particles agree with the label in front of them", () => {
  assert.equal(objectParticle("사람 피해"), "를", "a vowel-final label takes 를");
  assert.equal(objectParticle("믿음"), "을", "a consonant-final label takes 을");
});
test("subject particles agree with the label in front of them", () => {
  assert.equal(subjectParticle("신뢰"), "가", "신뢰 ends on a vowel");
  assert.equal(subjectParticle("현금"), "이", "현금 ends on a consonant");
});
// Numbers are spoken, so the agreement follows the reading of the last digit.
test("particles follow the reading of a trailing digit", () => {
  assert.equal(objectParticle("현금 +2"), "를", "2 is read 이, which ends on a vowel");
  assert.equal(objectParticle("현금 +7"), "을", "7 is read 칠, which ends on a consonant");
  assert.equal(endsOnConsonant("믿음 -10"), true, "anything ending in 0 is read 십/백/천/만");
});

// The trade-off line sits directly above the effect chips and used to disagree
// with them: it split the effect by sign, so a rising 사람 피해 was announced as
// something the choice won.
test("rising 사람 피해 is what the choice costs, and it is the biggest cost here", () => {
  assert.equal(
    describeChoiceDilemma({ capital: 24, humanCost: 11, trust: -6 }),
    "현금을 얻는 대신 사람 피해를 키웁니다.",
    "rising 사람 피해 is what the choice costs, and it is the biggest cost here",
  );
});
test("falling 사람 피해 is a gain, so the cost named is the rising 지침", () => {
  assert.equal(
    describeChoiceDilemma({ trust: 8, humanCost: -4, fatigue: 2 }),
    "믿음을 얻는 대신 지침을 키웁니다.",
    "falling 사람 피해 is a gain, so the cost named is the rising 지침",
  );
});
test("cutting a cost is described as cutting it, not as winning it", () => {
  assert.equal(
    describeChoiceDilemma({ humanCost: -9, capital: -2 }),
    "사람 피해를 줄이는 대신 현금을 닫습니다.",
    "cutting a cost is described as cutting it, not as winning it",
  );
});
test("the sentence names what moved most, not whichever key was typed first", () => {
  assert.equal(
    describeChoiceDilemma({ trust: 2, capital: 9, legitimacy: -1, time: -8 }),
    "현금을 얻는 대신 남은 시간을 닫습니다.",
    "the sentence names what moved most, not whichever key was typed first",
  );
});

// The result ledger's sentence reads the same numbers the same way.
test("rising 사람 피해 belongs on the cost side, and the particles follow the digits", () => {
  assert.match(
    explainResourceTradeoff({ capital: 12, humanCost: 5 }),
    /^현금 \+12를 얻는 대신 사람 피해 \+5를 감수했습니다\.$/u,
    "rising 사람 피해 belongs on the cost side, and the particles follow the digits",
  );
});
test("falling 지침 is a gain, so it is not listed as something the run gave up", () => {
  assert.match(
    explainResourceTradeoff({ trust: 6, fatigue: -3 }),
    /지침 -3/u,
    "falling 지침 is a gain, so it is not listed as something the run gave up",
  );
});

// Nothing in the graph may produce a particle that disagrees with the word in
// front of it. The pairs below are the only ones these sentences can build.
test("no choice in the graph builds a disagreeing particle", () => {
  const WRONG_PARTICLES = /(피해을|지침를|현금를|믿음를|공정함를|시간를|신뢰이|피로이)/u;
  for (const node of Object.values(nodes)) {
    for (const choice of node.choices ?? []) {
      const line = describeChoiceDilemma(choice.effect ?? {});
      assert.doesNotMatch(line, WRONG_PARTICLES, `${node.title}/${choice.id}: "${line}"`);
      assert.doesNotMatch(explainResourceTradeoff(choice.effect ?? {}), WRONG_PARTICLES, `${choice.id} ledger line`);
    }
  }
});
