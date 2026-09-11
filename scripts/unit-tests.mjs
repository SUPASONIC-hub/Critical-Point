import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  appendLocalRankingRowToRows,
  parseLocalRankingRows,
} from "../src/state/useLocalRanking.js";
import {
  applyRiskReward,
  createPressureLedger,
  DYNAMICS_INITIAL_STATE,
  getPermanentMultiplier,
  PUSH_STEP,
  reduceDecisionDynamics,
} from "../src/state/decisionDynamics.js";
import {
  createIntroView,
  createPlayView,
  createResultView,
} from "../src/viewModels/appViewModels.js";
import {
  createSeasonLeaderboardRow,
  createSeasonTelemetryPayload,
} from "../src/viewModels/seasonViewModels.js";
import { buildPlaytestExport } from "../src/state/playtestExport.js";
import { safeStringify } from "../src/state/diagnosticUtils.js";
import { validatePlaytestExport, validateSavedStatePayload, validateTelemetryItem } from "../src/state/payloadSchemas.js";
import { buildTelemetryPayload, getTelemetryStats, subscribeTelemetryStats } from "../src/telemetry.js";
import { pruneTelemetryQueue, TELEMETRY_QUEUE_MAX_ITEMS } from "../src/state/telemetryQueuePolicy.js";
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
import { createStreakReward } from "../src/viewModels/sceneViewModels.js";
import { getChoiceOutcomeFeedback } from "../src/advancedSystems.js";
import { createDecisionTargetLock } from "../src/viewModels/playChoiceViewModel.js";


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

const playScreenSource = readFileSync("src/screens/PlayScreen.jsx", "utf8");
test("fixed choices should use CommitConsole as the only confirmation surface", () => {
  assert.match(playScreenSource, /<CommitConsole\b/, "the fixed-choice confirmation surface should remain CommitConsole");
  assert.doesNotMatch(playScreenSource, /DecisionDock/, "the duplicate DecisionDock confirmation path should stay out of PlayScreen");
  assert.doesNotMatch(playScreenSource, /<\/h2>`n\s*<p className="choice-question">/, "the choice heading should not print a literal `n artifact");
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
test("playtest exports should omit private text and names", () => {
  const serializedSummary = JSON.stringify(summaryExport);
  const serializedDiagnostics = JSON.stringify(diagnosticExport);
  assert.equal(serializedSummary.includes("private"), false, "summary export must not contain free text");
  assert.equal(serializedDiagnostics.includes("private"), false, "diagnostic export must not contain free text");
  assert.equal(serializedDiagnostics.includes("tester"), false, "diagnostic export must not contain player names");
});
test("diagnostic stringify should fall back for circular values", () => {
  const circular = {};
  circular.self = circular;
  assert.equal(safeStringify(circular), "[object Object]");
});
test("playtest export schema should reject missing and private summary fields", () => {
  assert.deepEqual(validatePlaytestExport({ exportMode: "summary" }), [
    "missing saveSchemaVersion", "missing exportedAt", "missing currentCase", "missing summary", "missing gameplay",
  ]);
  assert.deepEqual(validatePlaytestExport({ saveSchemaVersion: 2, exportedAt: "now", exportMode: "summary", currentCase: "case01", summary: {}, gameplay: {}, playerName: "private" }), ["private field playerName"]);
  assert.deepEqual(validatePlaytestExport({ saveSchemaVersion: 2, exportedAt: "now", exportMode: "diagnostic", currentCase: "case01", summary: {}, gameplay: {}, sessionId: "session" }, { includeDiagnostics: true }), []);
});
test("telemetry schema should reject private fields and unknown types", () => {
  assert.deepEqual(validateTelemetryItem({ type: "unknown", payload: {} }), ["invalid type unknown"]);
  assert.deepEqual(validateTelemetryItem({ type: "case", payload: { nested: { freeText: "private" } } }), ["payload contains private fields"]);
  assert.deepEqual(validateTelemetryItem({ type: "error", payload: { source: "test" } }), []);
});
test("telemetry queue policy should expire old items and cap retained items", () => {
  const now = Date.parse("2026-09-07T00:00:00.000Z");
  const oldItem = { id: "old", queuedAt: "2026-08-01T00:00:00.000Z" };
  const recentItems = Array.from({ length: TELEMETRY_QUEUE_MAX_ITEMS + 1 }, (_, index) => ({
    id: `item-${index}`,
    queuedAt: "2026-09-06T00:00:00.000Z",
  }));
  const retained = pruneTelemetryQueue([oldItem, ...recentItems], now);
  assert.equal(retained.length, TELEMETRY_QUEUE_MAX_ITEMS);
  assert.equal(retained.some((item) => item.id === "old"), false);
  assert.equal(retained[0].id, "item-1");
});
test("telemetry queue items should have stable identities for retry deduplication", () => {
  const item = { id: "case-case01-123", type: "case", payload: { case_id: "case01" } };
  assert.equal(validateTelemetryItem(item).length, 0);
  assert.equal(item.id, "case-case01-123", "the queue id is the retry idempotency key");
});
test("telemetry payload should carry the queue identity without mutating the source", () => {
  const payload = { case_id: "case01" };
  assert.deepEqual(buildTelemetryPayload(payload, "event-1"), { case_id: "case01", event_id: "event-1" });
  assert.deepEqual(payload, { case_id: "case01" });
});
test("telemetry stats subscriptions should unsubscribe cleanly", () => {
  let notifications = 0;
  const unsubscribe = subscribeTelemetryStats(() => { notifications += 1; });
  assert.equal(typeof unsubscribe, "function");
  unsubscribe();
  assert.deepEqual(Object.keys(getTelemetryStats()).sort(), ["attempted", "failed", "saved"]);
  assert.equal(notifications, 0);
});
test("saved state validation should use the shared payload schema", () => {
  const state = { currentCase: "case01", nodeId: "start", completedCases: [], discoveredClues: [], log: [], pendingTelemetry: [], caseResults: {}, playtestFeedback: {}, resources: {}, triggers: {}, cognition: {} };
  assert.deepEqual(validateSavedStatePayload(state), []);
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
test("season leaderboard rows should be marked as a full-season completion", () => {
  const row = createSeasonLeaderboardRow({
    caseSummary: { rank: "A", momentumScore: 81, completedAt: "2026-01-03" },
    completedCaseCount: 6,
    playerName: "tester",
    runId: "run-season",
    sessionCode: "ABC123",
  });
  assert.equal(row.case_id, "season-final", "season leaderboard row should use the aggregate case id");
  assert.equal(row.summary.seasonComplete, true, "season leaderboard row should carry the aggregate completion flag");
  assert.equal(row.summary.completedCaseCount, 6, "season leaderboard row should carry the completed case count");
});
test("season telemetry payloads should reuse the aggregate season summary shape", () => {
  const payload = createSeasonTelemetryPayload({
    caseSummary: { rank: "S", momentumScore: 95 },
    completedCaseCount: 6,
    cognition: { inference: 2 },
    decisionLog: [{ choiceId: "final" }],
    resources: { trust: 20 },
    runId: "run-season",
    sessionCode: "ABC123",
    sessionId: "session-season",
    triggers: { protection: 1 },
  });
  assert.equal(payload.case_id, "season-final", "season telemetry payload should use the aggregate case id");
  assert.equal(payload.summary.seasonComplete, true, "season telemetry payload should carry the aggregate completion flag");
  assert.equal(payload.decision_log.length, 1, "season telemetry payload should keep the decision log");
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

test("streak rewards trigger only at the 3 and 5 milestones", () => {
  assert.equal(createStreakReward({ previousStreak: 1, challengeMatch: true }), null);
  assert.deepEqual(createStreakReward({ previousStreak: 2, challengeMatch: true }), {
    label: "STREAK PAYOUT",
    text: "3연속 장면 목표를 맞혔습니다. 다음 판단을 위한 신뢰가 올라가고 피로가 줄어듭니다.",
    effect: { trust: 2, fatigue: -2 },
  });
  assert.deepEqual(createStreakReward({ previousStreak: 4, challengeMatch: true }), {
    label: "PERFECT PAYOUT",
    text: "5연속 장면 목표를 맞혔습니다. 신뢰와 정당성을 회복하고 피로를 덜어냅니다.",
    effect: { trust: 2, legitimacy: 2, fatigue: -3 },
  });
  assert.equal(createStreakReward({ previousStreak: 2, challengeMatch: false }), null);
});
test("streak rewards take priority in immediate choice feedback", () => {
  const feedback = getChoiceOutcomeFeedback({
    choiceId: "choice",
    effect: { trust: 2 },
    streakReward: { label: "STREAK PAYOUT", text: "연속 보상" },
  });
  assert.equal(feedback.label, "STREAK PAYOUT");
  assert.equal(feedback.text, "연속 보상");
});

test("decision target lock summarizes objective, streak, and evidence without numeric forecasts", () => {
  const lock = createDecisionTargetLock({
    pendingChoiceRead: { challengeMatch: true },
    sceneChallenge: { title: "Lower risk pressure" },
    currentChallengeStreak: 2,
    hiddenEvidenceCandidate: { id: "clue" },
  });
  assert.equal(lock.objective.value, "LOCKED");
  assert.equal(lock.streak.value, "PAYOUT READY");
  assert.equal(lock.evidence.value, "CAN OPEN");
  assert.doesNotMatch(JSON.stringify(lock), /[+-]\d/);
});

test("decision target lock marks a choice that misses the scene objective", () => {
  const lock = createDecisionTargetLock({
    pendingChoiceRead: { challengeMatch: false },
    sceneChallenge: { title: "Find hidden cost" },
    currentChallengeStreak: 1,
  });
  assert.equal(lock.objective.value, "OFF TARGET");
  assert.equal(lock.streak.value, "CHAIN BREAKS");
  assert.equal(lock.evidence.value, "NO SIGNAL");
});

test("pressure ledger rebuilds the run's push record from the decision log", () => {
  const ledger = createPressureLedger([
    { threshold: { rewardMultiplier: 1, busted: false }, environmentMode: "stable", riskRewardEffect: { trust: 4, time: -3 } },
    { threshold: { rewardMultiplier: 2, busted: false }, environmentMode: "stable", riskRewardEffect: { trust: 12, time: -3 } },
    { threshold: { rewardMultiplier: 2.85, busted: true }, environmentMode: "blackout", riskRewardEffect: { trust: 17 } },
    { threshold: { rewardMultiplier: 1.2, busted: false }, environmentMode: "reboot", riskRewardEffect: { trust: 6 } },
  ]);
  assert.equal(ledger.busts, 1);
  assert.equal(ledger.reboots, 1);
  assert.equal(ledger.bestMultiplier, 2.85);
  assert.equal(ledger.pushedDecisions, 3);
  // 12 - round(12/2) = 6, 17 - round(17/2.85) = 11, 6 - round(6/1.2) = 1.
  assert.equal(ledger.bonusPoints, 18);
  assert.equal(ledger.permanentMultiplier, 1.2);
});

test("pressure ledger and the reducer agree on what a reboot is worth", () => {
  let state = reduceDecisionDynamics(DYNAMICS_INITIAL_STATE, { type: "DECISION_STARTED" });
  const log = [];
  for (let run = 0; run < 3; run += 1) {
    state = { ...state, thresholdState: "bust", environmentMode: "blackout" };
    state = reduceDecisionDynamics(state, { type: "DECISION_STARTED" });
    log.push({ threshold: { rewardMultiplier: 1, busted: true }, environmentMode: "reboot", riskRewardEffect: {} });
  }
  assert.equal(state.rebootCount, 3);
  assert.equal(createPressureLedger(log).permanentMultiplier, state.permanentMultiplier);
  assert.equal(state.permanentMultiplier, getPermanentMultiplier(3));
});

test("pressure ledger reads an empty log as a run that has not pushed yet", () => {
  const ledger = createPressureLedger([]);
  assert.deepEqual(ledger, { busts: 0, reboots: 0, bestMultiplier: 1, bonusPoints: 0, pushedDecisions: 0, permanentMultiplier: 1 });
});

test("the pot multiplies what the player gains, never what a choice costs them", () => {
  // case01's accounting branch, the shape 255 of the 379 authored effects share:
  // two resources rising as a gain, two rising as a cost.
  const effect = { capital: 18, trust: -14, humanCost: 18, fatigue: 3 };
  const pushed = applyRiskReward(effect, 3.3);

  assert.equal(pushed.capital, 59, "a gain scales with the gauge the player held");
  assert.equal(pushed.trust, -14, "a loss written negative is not discounted");
  // The two that read backwards from the sign. Holding the gauge to 3.3x used to
  // turn 18 dead into 59 -- the bet paying out in bodies on the one axis the
  // story is about, while the comment above the function promised it could not.
  assert.equal(pushed.humanCost, 18, "humanCost rising is the cost, so the pot does not raise it");
  assert.equal(pushed.fatigue, 3, "fatigue rising is the cost, so the pot does not raise it");
});

test("a negative humanCost is the gain the pot is allowed to multiply", () => {
  // Spending a turn protecting someone reads as humanCost below zero, and that
  // is the payout a held gauge is supposed to enlarge.
  const pushed = applyRiskReward({ humanCost: -6, fatigue: -2, capital: -10 }, 2);
  assert.equal(pushed.humanCost, -12);
  assert.equal(pushed.fatigue, -4);
  assert.equal(pushed.capital, -10, "capital falling is still a cost and stays whole");
});

test("pushing raises the gauge and the pot the player is holding", () => {
  const started = reduceDecisionDynamics(DYNAMICS_INITIAL_STATE, { type: "DECISION_STARTED" });
  const once = reduceDecisionDynamics(started, { type: "PUSH_HELD" });
  const twice = reduceDecisionDynamics(once, { type: "PUSH_HELD" });

  assert.equal(once.stressLevel, started.stressLevel + PUSH_STEP);
  assert.equal(twice.stressLevel, started.stressLevel + PUSH_STEP * 2);
  // The pot is priced off the gauge, so the press has to be worth something the
  // moment it lands -- the reason the button exists is that the number moves.
  assert.ok(twice.rewardMultiplier > once.rewardMultiplier, "a second press pays more than the first");
  assert.ok(once.rewardMultiplier > started.rewardMultiplier, "the first press pays more than not pressing");
  assert.ok(twice.heartbeatBpm > started.heartbeatBpm, "and the window gets louder with it");
});

test("pushing cannot bust on its own; the commit is still what settles the bet", () => {
  let state = reduceDecisionDynamics(DYNAMICS_INITIAL_STATE, { type: "DECISION_STARTED" });
  for (let press = 0; press < 12; press++) state = reduceDecisionDynamics(state, { type: "PUSH_HELD" });

  assert.equal(state.stressLevel, 100, "twelve presses saturate the gauge");
  assert.equal(state.isBlind, false, "and none of them resolve anything");
});
