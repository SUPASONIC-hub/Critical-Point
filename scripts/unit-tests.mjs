import assert from "node:assert/strict";
import { getEndingVariant } from "../src/gameLogic.js";
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
  drawBustFloor,
  drawPushStep,
  getPushYourLuckOutcome,
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

  // A press buys a drawn amount, not a constant one, so the assertion is on the
  // band rather than on a number: a fixed step put the gauge on a grid of six
  // rungs and left the moving wall between two of them for most of a window.
  const first = once.stressLevel - started.stressLevel;
  const second = twice.stressLevel - once.stressLevel;
  for (const step of [first, second]) {
    assert.ok(step >= 11 && step <= 21, `${step} sits inside the press band`);
  }
  assert.ok(twice.stressLevel > once.stressLevel, "and each press moves the gauge further");
  // The pot is priced off the gauge, so the press has to be worth something the
  // moment it lands -- the reason the button exists is that the number moves.
  assert.ok(twice.rewardMultiplier > once.rewardMultiplier, "a second press pays more than the first");
  assert.ok(once.rewardMultiplier > started.rewardMultiplier, "the first press pays more than not pressing");
  assert.ok(twice.heartbeatBpm > started.heartbeatBpm, "and the window gets louder with it");
});

test("a push survives the next tick, which is the whole point of pressing it", () => {
  // The sequence that cannot happen in a test that presses consecutively, and is
  // the only sequence that happens in play: the clock ticks once per second, so
  // every press is followed by one within 999ms. DECISION_TICK used to *assign*
  // stressLevel from the burn curve with no term for what the player had bought,
  // so four presses worth x2.16 became x1.00 on the next tick and the verb had a
  // sub-second half-life.
  let state = reduceDecisionDynamics(DYNAMICS_INITIAL_STATE, { type: "DECISION_STARTED" });
  state = reduceDecisionDynamics(state, { type: "DECISION_TICK", seconds: 25 });
  const clockOnly = state.stressLevel;

  for (let press = 0; press < 4; press++) state = reduceDecisionDynamics(state, { type: "PUSH_HELD" });
  const pushed = state.stressLevel;
  assert.ok(pushed >= clockOnly + 11 * 4 && pushed <= clockOnly + 21 * 4, "four presses buy four steps");

  state = reduceDecisionDynamics(state, { type: "DECISION_TICK", seconds: 24 });
  assert.ok(state.stressLevel >= pushed, "and the tick may add to them, never erase them");
  assert.ok(state.rewardMultiplier > 1, "so the pot the player bought is still there to cash");
});

test("the clock is a floor under the gauge, not the gauge itself", () => {
  let held = reduceDecisionDynamics(DYNAMICS_INITIAL_STATE, { type: "DECISION_STARTED" });
  held = reduceDecisionDynamics(held, { type: "DECISION_TICK", seconds: 40 });
  held = reduceDecisionDynamics(held, { type: "PUSH_HELD" });

  let idle = reduceDecisionDynamics(DYNAMICS_INITIAL_STATE, { type: "DECISION_STARTED" });
  idle = reduceDecisionDynamics(idle, { type: "DECISION_TICK", seconds: 40 });

  // Late in the window the burn is climbing on its own. A player who pressed has
  // to stay ahead of one who did not, at every point on the curve, or pressing is
  // a decoration on a countdown.
  for (const seconds of [30, 20, 10, 3]) {
    held = reduceDecisionDynamics(held, { type: "DECISION_TICK", seconds });
    idle = reduceDecisionDynamics(idle, { type: "DECISION_TICK", seconds });
    assert.ok(held.stressLevel > idle.stressLevel, `pressing still shows at ${seconds}s remaining`);
  }
});

test("pressing far enough busts the run, and the bust is the player's own", () => {
  let state = reduceDecisionDynamics(DYNAMICS_INITIAL_STATE, { type: "DECISION_STARTED" });
  state = reduceDecisionDynamics(state, { type: "DECISION_TICK", seconds: 30 });
  assert.equal(state.isBlind, false, "the clock alone is nowhere near the line here");

  for (let press = 0; press < 7; press++) state = reduceDecisionDynamics(state, { type: "PUSH_HELD" });
  state = reduceDecisionDynamics(state, { type: "DECISION_TICK", seconds: 29 });

  // Seven presses at 30 seconds remaining. Nothing about the clock did this.
  assert.equal(state.isBlind, true, "greed reaches the line long before the deadline does");
  // The window freezes rather than empties: the gauge, the multiplier and the
  // vignette hold at the reading that busted, so the screen is not quietly
  // recovering underneath the word BUST.
  assert.ok(state.stressLevel >= state.bustFloor, "and the readout holds at the value that busted");
});

test("a challenge match is safer because it vents, not because the wall moves", () => {
  // It used to pay twice: vent 12 points off the gauge *and* push the wall 6
  // further away. Across 21,600 matched commits at every reboot count, press
  // count and commit time, that came to a bust rate of 0.0% against 16-18% on a
  // miss -- and the card prints 목표 LOCKED before the player presses anything,
  // so the free pass was announced in advance. The vent is the reward. The wall
  // is the wall, for everyone.
  const atWall = getPushYourLuckOutcome({ stressLevel: 90, bustFloor: 88 });
  assert.equal(atWall.busted, true, "past the wall is past the wall");

  const staged = reduceDecisionDynamics(DYNAMICS_INITIAL_STATE, { type: "DECISION_STARTED" });
  const ticked = reduceDecisionDynamics(staged, { type: "DECISION_TICK", seconds: 12 });
  const matched = reduceDecisionDynamics(ticked, { type: "CHOICE_COMMITTED", challengeMatch: true, riskDelta: 0, seconds: 12 });
  const missed = reduceDecisionDynamics(ticked, { type: "CHOICE_COMMITTED", challengeMatch: false, riskDelta: 4, seconds: 12 });
  assert.ok(matched.stressLevel < missed.stressLevel, "reading the objective right buys gauge back");
  assert.ok(matched.heldGauge <= ticked.heldGauge, "and it is the gauge that moves, not the line");
});

test("a winning commit does not bust on the tick that follows it", () => {
  // Five presses at ten seconds left, committed on a challenge match: the payout
  // lands, and one second later the run used to blow up and halve the score it
  // had just banked. CHOICE_COMMITTED adjusted `stressLevel` and left
  // `heldGauge` untouched, so the next tick recomputed `clockStress + heldGauge`
  // and threw the relief away -- punishing the correct read, after the fact.
  let state = reduceDecisionDynamics(DYNAMICS_INITIAL_STATE, { type: "DECISION_STARTED" });
  state = reduceDecisionDynamics(state, { type: "DECISION_TICK", seconds: 10 });
  for (let press = 0; press < 5; press++) state = reduceDecisionDynamics(state, { type: "PUSH_HELD" });

  const committed = reduceDecisionDynamics(state, { type: "CHOICE_COMMITTED", riskDelta: 2, challengeMatch: true, seconds: 10 });
  assert.equal(committed.isBlind, false, "a match at this gauge is a win, not a bust");
  const bankedScore = committed.score;

  const afterTick = reduceDecisionDynamics(committed, { type: "DECISION_TICK", seconds: 9 });
  assert.equal(afterTick.isBlind, false, "and it is still a win one second later");
  assert.equal(afterTick.score, bankedScore, "with the score it banked still banked");
});

test("relief earned on a commit survives the clock, the way a press does", () => {
  let state = reduceDecisionDynamics(DYNAMICS_INITIAL_STATE, { type: "DECISION_STARTED" });
  state = reduceDecisionDynamics(state, { type: "DECISION_TICK", seconds: 20 });
  for (let press = 0; press < 4; press++) state = reduceDecisionDynamics(state, { type: "PUSH_HELD" });
  const held = state.heldGauge;

  const committed = reduceDecisionDynamics(state, { type: "CHOICE_COMMITTED", riskDelta: 1, challengeMatch: true, seconds: 20 });
  assert.ok(committed.heldGauge < held, "a match buys the gauge back down");
  const afterTick = reduceDecisionDynamics(committed, { type: "DECISION_TICK", seconds: 19 });
  assert.ok(afterTick.heldGauge <= committed.heldGauge, "and the tick does not hand it back");
});

test("each window draws its own wall, and the same seed draws the same one", () => {
  let state = DYNAMICS_INITIAL_STATE;
  const floors = [];
  for (let window = 0; window < 8; window++) {
    state = reduceDecisionDynamics(state, { type: "DECISION_STARTED" });
    floors.push(state.bustFloor);
  }
  // A fixed wall next to a gauge printed every frame and a constant PUSH_STEP is
  // arithmetic: stop one press short, every time, forever. The band is a press
  // wide, so standing at 88 is a real question.
  assert.ok(new Set(floors).size > 1, "the wall is not in the same place every window");
  for (const floor of floors) {
    assert.ok(floor >= 80 && floor <= 96, `${floor} sits inside the band`);
  }
  // Seeded, not random: replay links restore a scene from a seed and the balance
  // suite replays thousands of seasons. Both need the same wall twice.
  assert.deepEqual(floors, [1, 2, 3, 4, 5, 6, 7, 8].map((index) => drawBustFloor(`0:${index}:0`)));
});

test("a bust holds until the window ends instead of healing on the next tick", () => {
  let state = reduceDecisionDynamics(DYNAMICS_INITIAL_STATE, { type: "DECISION_STARTED" });
  state = reduceDecisionDynamics(state, { type: "DECISION_TICK", seconds: 12 });
  for (let press = 0; press < 6; press++) state = reduceDecisionDynamics(state, { type: "PUSH_HELD" });
  state = reduceDecisionDynamics(state, { type: "DECISION_TICK", seconds: 11 });
  assert.equal(state.isBlind, true, "six presses at twelve seconds reach the ceiling");

  // Busting clears heldGauge, so the tick after it used to recompute from the
  // clock alone and find nothing wrong -- the 420ms bust keyframe and the
  // grayscale were gone before the player finished reading the word.
  for (const seconds of [10, 9, 8]) {
    state = reduceDecisionDynamics(state, { type: "DECISION_TICK", seconds });
    assert.equal(state.isBlind, true, `still busted at ${seconds}s remaining`);
    assert.equal(state.thresholdState, "bust");
  }

  const next = reduceDecisionDynamics(state, { type: "DECISION_STARTED" });
  assert.equal(next.isBlind, false, "and a new window is a clean one");
});

test("no two presses in a window are worth the same, and the run replays them", () => {
  const steps = [1, 2, 3, 4, 5, 6].map((press) => drawPushStep(`0:1:${press}`));
  assert.ok(new Set(steps).size > 1, "a press is drawn, not a constant");
  for (const step of steps) assert.ok(step >= 11 && step <= 21, `${step} sits inside the band`);
  // The wall only mattered at one rung while the step was fixed at 16: the gauge
  // could land on clockStress + 16n and nowhere else, and an 80-96 band sits
  // between two of those rungs for most of a window.
  assert.deepEqual(steps, [1, 2, 3, 4, 5, 6].map((press) => drawPushStep(`0:1:${press}`)), "and the same seed draws the same press twice");
  assert.notDeepEqual(steps, [1, 2, 3, 4, 5, 6].map((press) => drawPushStep(`0:2:${press}`)), "while the next window draws its own");
});

test("a reboot buys a multiplier and pays for it with room", () => {
  const seed = "2:7:400";
  const fresh = drawBustFloor(seed, 0);
  const once = drawBustFloor(seed, 1);
  const thrice = drawBustFloor(seed, 3);

  // REBOOT_PERMANENT_BONUS hands a rebooted run +0.2x forever. Measured over
  // forty windows with that bonus free, busting every fourth window banked
  // 22,114 against 13,587 for never busting -- 63% more, because the multiplier
  // compounds and the bill is one window. The bonus stays; what it costs now is
  // the room to use it.
  assert.ok(once < fresh, "one reboot walks the wall closer");
  assert.ok(thrice < once, "and each one after that walks it closer again");
  assert.ok(thrice >= 52, "but it never comes closer than the fatal floor");
});

test("the wall cannot be walked below the point a run stops being playable", () => {
  for (const reboots of [4, 8, 20, 100]) {
    for (const window of [1, 5, 9]) {
      const floor = drawBustFloor(`${reboots}:${window}:0`, reboots);
      assert.ok(floor >= 52, `${reboots} reboots still leaves a wall at ${floor}`);
    }
  }
});

test("the ledger reports the reboots the reducer actually granted", () => {
  // `permanentMultiplier` is the whole reward for busting, and the panel built to
  // price it counted `entry.environmentMode === "reboot"` -- a value no commit
  // can write, because DECISION_STARTED turns blackout into reboot before the
  // next commit runs. A player two busts deep read x1, "리부트 0회", and a
  // sentence telling them they had never blown up.
  const log = [
    { threshold: { rewardMultiplier: 2.4, busted: true }, environmentMode: "blackout", riskRewardEffect: {} },
    { threshold: { rewardMultiplier: 1.2, busted: false }, environmentMode: "stable", riskRewardEffect: { trust: 6 } },
    { threshold: { rewardMultiplier: 3.1, busted: true }, environmentMode: "blackout", riskRewardEffect: {} },
  ];
  const ledger = createPressureLedger(log);
  assert.equal(ledger.busts, 2);
  assert.equal(ledger.reboots, 2, "a reboot is what a bust becomes at the top of the next window");
  assert.equal(ledger.permanentMultiplier, getPermanentMultiplier(2));
  assert.ok(ledger.permanentMultiplier > 1, "and the panel can finally say the buff exists");
});

test("the warning lights sit under the wall, wherever the wall has moved to", () => {
  // They were constants -- CRITICAL at 90, OVERDRIVE at 78 -- while the wall is
  // drawn in 80..96 and walks down 8 a reboot to 52. From one reboot on, 100% of
  // windows had their wall below the OVERDRIVE band, so the gauge read BUILDING
  // and 61% and then the run ended. A light wired above the thing it warns about
  // does not merely fail to warn; it says safe.
  let state = DYNAMICS_INITIAL_STATE;
  for (let reboot = 0; reboot < 6; reboot++) {
    state = reduceDecisionDynamics(state, { type: "DECISION_STARTED", reboot: reboot > 0 });
    const ticked = reduceDecisionDynamics(state, { type: "DECISION_TICK", seconds: 30 });
    assert.ok(ticked.criticalFloor < state.bustFloor, `critical fires under a wall of ${state.bustFloor}`);
    assert.ok(ticked.overdriveFloor < ticked.criticalFloor, "and overdrive fires under critical");
  }
});

test("a streak survives the scene that earned it", () => {
  // DECISION_STARTED spread the initial state over `combo`, so it was 0 in every
  // tick and every commit: getComboBacklash returned 0 forever, COMBO_BACKLASH_K
  // was inert, `heat` was multiplied by zero, and the COMBO chip could only read
  // x1. A new scene is not what breaks a streak.
  let state = reduceDecisionDynamics(DYNAMICS_INITIAL_STATE, { type: "DECISION_STARTED" });
  const combos = [];
  for (let window = 0; window < 4; window++) {
    state = reduceDecisionDynamics(state, { type: "DECISION_TICK", seconds: 20 });
    state = reduceDecisionDynamics(state, { type: "CHOICE_COMMITTED", challengeMatch: true, riskDelta: 0, seconds: 20 });
    combos.push(state.combo);
    state = reduceDecisionDynamics(state, { type: "DECISION_STARTED" });
  }
  assert.deepEqual(combos, [1, 2, 3, 4], "each matched window adds to the streak");
  assert.ok(state.combo > 0, "and the next window opens still holding it");
  // `heat` is derived per tick from the streak, so it is the first tick of the
  // new window that prices what the streak borrowed.
  const carried = reduceDecisionDynamics(state, { type: "DECISION_TICK", seconds: 20 });
  assert.ok(carried.heat > 0, "so the backlash the streak borrowed against is real");
  assert.ok(carried.stressLevel > 0, "and it rides into the next window as gauge");
});

test("the ending reads what the run did with the gauge", () => {
  // Six cycles built a bet the ending could not see. Paired seasons at x1.00 and
  // x3.50 flipped 0 of 1000 endings, because `applyEffect` clamps at 100,
  // `pressureAdaptScore` is already pinned in 71% of cases, and the season
  // pressure is a max over 150 nodes -- three clamps in series, and the
  // multiplier died in all of them. Same resources, same clues, below; only the
  // push record differs.
  const resources = { trust: 62, legitimacy: 58, capital: 70, humanCost: 20, fatigue: 30, time: 40 };
  const discoveredClues = [{ id: "c1" }, { id: "c2" }, { id: "c3" }];
  const entry = (rewardMultiplier, busted) => ({
    threshold: { rewardMultiplier, busted },
    environmentMode: busted ? "blackout" : "stable",
    riskRewardEffect: {},
  });
  // The ending reads the *season*, not the last case: the run log is cleared at
  // every case start, so a record derived there would have counted one case of
  // pressure history and called it a season -- five busts in cases one to five
  // paying nothing, a clean season losing its grip only at the end collapsing.
  // The strain arrives already aggregated, the way human cost and peak pressure
  // already did.
  const strainOf = (log) => {
    const record = createPressureLedger(log);
    return { seasonBusts: record.busts, seasonBestMultiplier: record.bestMultiplier };
  };
  const endingFor = (log) =>
    getEndingVariant({ resources, discoveredClues, seasonHumanCost: 20, peakRiskPressure: 18, ...strainOf(log) }).id;

  assert.equal(endingFor([entry(1, false), entry(1, false)]), "open-question", "a run that never pushed lands where it always did");
  // Holding a high pot across a season without once crossing the wall is the
  // thing this system asks for, and it buys a clue of slack on the ending that
  // reads as having done the job properly.
  assert.equal(endingFor([entry(2.8, false), entry(2.2, false)]), "open-oversight");
  // And blowing up repeatedly is, in the collapse ending's own words, the season
  // going past what there was time to carry.
  assert.equal(endingFor([entry(3.1, true), entry(2, false), entry(2.9, true)]), "open-question", "two busts is not yet a collapse");
  // Busts are a peer of the other strain terms at 2 apiece, so it takes sixteen
  // of them in a season to close one on their own -- past every policy but the
  // greediest. At 12 apiece three were enough, which forced SYSTEM COLLAPSE on
  // ordinary play and took the three character endings under their floors.
  const wrecked = getEndingVariant({
    resources,
    discoveredClues,
    seasonHumanCost: 20,
    peakRiskPressure: 18,
    seasonBusts: 16,
    seasonBestMultiplier: 3.1,
  });
  assert.equal(wrecked.id, "collapse");
  assert.equal(wrecked.failure, true, "three busts closes the season as a failure");
});
