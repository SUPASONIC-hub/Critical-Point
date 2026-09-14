import assert from "node:assert/strict";
import { getEndingVariant } from "../src/gameLogic.js";
import { readFileSync } from "node:fs";

import {
  appendLocalRankingRowToRows,
  parseLocalRankingRows,
} from "../src/state/useLocalRanking.js";
import {
  applyGauntletEffect,
  BASE_SCHEMA,
  createGauntletLedger,
  createWindow,
  drawStep,
  drawTellOffset,
  drawWall,
  getCardBurn,
  getForcedCard,
  getHeartbeatBpm,
  getMultiplier,
  getResourceMultiplier,
  getSealedCardId,
  normalizeRunState,
  reduceWindow,
  resolveWindow,
  RUN_INITIAL_STATE,
  SEAL_BREAK_GAUGE,
  serializeRunState,
  TELL_ERROR,
  FRACTURE_MIN_BURN,
  splitOpenSeed,
} from "../src/gauntlet/gauntletEngine.js";
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
  adoptSaveRevision,
  readSettledWindowSeeds,
  recordSettledWindowSeed,
  writeSaveState,
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
    () => createPlayView({ AdaptiveMusic() {}, renderDecisionReveal() {}, renderRecoveryNotice() {}, currentCase: "case01", node: {}, fixedChoices: [], resolveGauntlet() {} }, {}),
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
test("the play screen is the gauntlet table and nothing in front of it", () => {
  assert.match(playScreenSource, /<GauntletStage\b/, "the table is the play screen");
  assert.doesNotMatch(playScreenSource, /CommitConsole|RecordRoom|ChoiceList|FreeTextReframeBox/, "none of the old board's panels come back");
});

const gauntletStageSource = readFileSync("src/gauntlet/GauntletStage.jsx", "utf8");
test("the table never prints the odds of the next push", () => {
  // A bust probability on screen turns the bet into a lookup: press until the
  // number is not zero. The band and the heartbeat are the only instruments.
  assert.doesNotMatch(gauntletStageSource, /bustChance|probability|wall-cross|%\s*</i);
  assert.match(gauntletStageSource, /win\.status === "bust" && win\.cause !== "abandon" && \(\s*<span className="gx-gauge-wall"/, "the wall is drawn only once it has been hit, never for an abandoned window");
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

const card = (id, effect, extra = {}) => ({ id, label: id, effect, next: "x", ...extra });
const liveWindow = (overrides = {}) => ({ ...createWindow({ schema: BASE_SCHEMA, seed: "unit" }), ...overrides });

test("every push is worth at least x1.5, and the pot compounds", () => {
  for (let gauge = 0; gauge <= 90; gauge += 1) {
    const ratio = getMultiplier(gauge + BASE_SCHEMA.stepMin) / getMultiplier(gauge);
    assert.ok(ratio >= 1.5, `a minimum push from ${gauge} should multiply the pot by at least 1.5, got ${ratio.toFixed(3)}`);
  }
  assert.equal(getMultiplier(0), 1);
  assert.ok(getMultiplier(60) > 40);
  assert.ok(getMultiplier(84) >= 128, "the hot end of the gauge is where the money is");
});

test("the same seed deals the same wall, the same steps and the same tell", () => {
  const a = createWindow({ schema: BASE_SCHEMA, seed: "run:3:accounting" });
  const b = createWindow({ schema: BASE_SCHEMA, seed: "run:3:accounting" });
  assert.equal(a.wall, b.wall);
  assert.equal(a.tellOffset, b.tellOffset);
  assert.equal(drawStep(BASE_SCHEMA, "run:3:accounting", 2), drawStep(BASE_SCHEMA, "run:3:accounting", 2));
  const walls = new Set(Array.from({ length: 200 }, (_, index) => drawWall(BASE_SCHEMA, `seed-${index}`)));
  assert.ok(walls.size > 20, "walls are spread across the band, not parked on one value");
  for (const wall of walls) assert.ok(wall >= BASE_SCHEMA.wallMin && wall <= BASE_SCHEMA.wallMax);
});

test("the heartbeat is an instrument, not an answer key", () => {
  for (let index = 0; index < 300; index += 1) {
    const offset = drawTellOffset(`tell-${index}`);
    assert.ok(Math.abs(offset) <= TELL_ERROR, "the tell errs by at most the declared amount");
  }
  const offsets = new Set(Array.from({ length: 300 }, (_, index) => drawTellOffset(`tell-${index}`)));
  assert.ok(offsets.size > 8, "and it does err: the offset is not a constant the player can subtract");
  assert.ok(getHeartbeatBpm(80, 86) >= 120, "a gauge six under the wall races past 120");
  assert.ok(getHeartbeatBpm(10, 86) < 75, "a cold gauge is a resting pulse");
  assert.equal(getHeartbeatBpm(40, 45, true), getHeartbeatBpm(40, 95, true), "SILENCE takes the wall out of the pulse completely");
});

test("pushing into the wall busts on the press, and the press is the player's", () => {
  let win = liveWindow({ wall: 40, gauge: 30 });
  win = reduceWindow(win, { type: "PUSH" });
  assert.equal(win.status, "bust");
  assert.equal(win.cause, "push");
  assert.equal(reduceWindow(win, { type: "PUSH" }), win, "a closed window ignores further input");
});

test("the clock creeps heat in after the read, and running it out is a bust", () => {
  let win = liveWindow({ wall: 90 });
  win = reduceWindow(win, { type: "TICK", delta: 1 });
  assert.equal(win.gauge, 0, "the first seconds are for reading");
  for (let second = 0; second < 10; second += 1) win = reduceWindow(win, { type: "TICK", delta: 1 });
  assert.ok(win.gauge > 0, "then waiting costs heat");
  for (let second = 0; second < 60 && win.status === "live"; second += 1) win = reduceWindow(win, { type: "TICK", delta: 1 });
  assert.equal(win.status, "bust");
  assert.equal(win.cause, "timeout");
});

test("cashing needs a staked card and an open seal", () => {
  let win = liveWindow();
  assert.equal(reduceWindow(win, { type: "CASH" }).status, "live", "nothing staked, nothing cashed");
  win = reduceWindow(win, { type: "SELECT", id: "a" });
  assert.equal(reduceWindow(win, { type: "CASH", locked: true }).status, "live", "a sealed card cannot be cashed");
  assert.equal(reduceWindow(win, { type: "CASH" }).status, "cashed");
});

test("a bust strips every gain, keeps every cost, and wipes the case pot", () => {
  const layoff = card("layoff", { capital: 18, trust: -14, humanCost: 18 });
  assert.deepEqual(applyGauntletEffect(layoff.effect, { outcome: "bust" }), { capital: 0, trust: -14, humanCost: 18 });
  assert.deepEqual(applyGauntletEffect({ humanCost: -6, fatigue: 4 }, { outcome: "bust" }), { humanCost: 0, fatigue: 4 }, "a falling humanCost is a gain, and it goes too");
  const hot = applyGauntletEffect(layoff.effect, { outcome: "cash", gauge: 80 });
  assert.equal(hot.capital, Math.round(18 * getResourceMultiplier(80)), "heat multiplies what the card gains");
  assert.equal(hot.trust, -14, "and never what it costs");

  const run = normalizeRunState({ runPot: 4800, vault: 900 });
  const { verdict, nextRun } = resolveWindow({ run, window: { status: "bust", cause: "push", gauge: 71, wall: 70, pushes: 5 }, card: layoff });
  assert.equal(verdict.pot, 0);
  assert.equal(verdict.lostPot, 4800);
  assert.equal(nextRun.runPot, 0, "everything since the last vault is gone");
  assert.equal(nextRun.vault, 900, "the vault is the one thing a wall cannot reach");
  assert.equal(nextRun.busts, 1);
});

test("a bust breaks the next board: face down, closer wall, heat carried in", () => {
  const { nextRun } = resolveWindow({
    run: RUN_INITIAL_STATE,
    window: { status: "bust", cause: "push", gauge: 80, wall: 78, pushes: 4 },
    card: card("a", { capital: 10, trust: -12 }),
  });
  const schema = nextRun.schema;
  assert.equal(schema.faceDown, true);
  assert.equal(schema.wallMin, BASE_SCHEMA.wallMin - 6);
  assert.equal(schema.startGauge, 22);
  assert.equal(schema.fracturedAxis, "trust");
  assert.deepEqual(schema.mutations, ["blackout", "aftershock", "fracture"]);
  const next = createWindow({ schema, seed: "next" });
  assert.equal(next.gauge, 22, "the next window opens hot");
});

test("running out the clock also takes the heartbeat and fifteen seconds", () => {
  const { nextRun } = resolveWindow({ run: RUN_INITIAL_STATE, window: { status: "bust", cause: "timeout", gauge: 20, wall: 80 }, card: card("a", { time: -5 }) });
  assert.equal(nextRun.schema.sedated, true);
  assert.equal(nextRun.schema.seconds, 30);
  assert.ok(nextRun.schema.mutations.includes("silence"));
});

test("greed carries heat, timidity seals the best card, a streak overclocks", () => {
  const rich = card("rich", { capital: 30, trust: -5 });
  const greedy = resolveWindow({ run: RUN_INITIAL_STATE, window: { status: "cashed", gauge: 66, wall: 80, pushes: 5 }, card: rich });
  assert.equal(greedy.nextRun.schema.seconds, BASE_SCHEMA.seconds - 12);
  assert.equal(greedy.nextRun.schema.startGauge, 22);
  assert.ok(greedy.nextRun.schema.mutations.includes("heatDebt"));

  const timid = resolveWindow({ run: RUN_INITIAL_STATE, window: { status: "cashed", gauge: 3, wall: 80, pushes: 0 }, card: rich });
  assert.equal(timid.nextRun.schema.sealHighest, true);
  const hand = [card("small", { trust: 2, time: -1 }), card("big", { capital: 25, trust: -3 })];
  assert.equal(getSealedCardId(hand, timid.nextRun.schema), "big", "the richest card is the one the cold feet lock");

  let run = RUN_INITIAL_STATE;
  for (let window = 0; window < 2; window += 1) {
    run = resolveWindow({ run, window: { status: "cashed", gauge: 30, wall: 80, pushes: 3 }, card: rich }).nextRun;
  }
  assert.equal(run.streak, 2);
  assert.ok(run.schema.mutations.includes("overclock"));
  assert.equal(run.schema.chipsScale, 2);
});

test("the axis a card burned hardest is billed half again on the next board", () => {
  const { nextRun } = resolveWindow({ run: RUN_INITIAL_STATE, window: { status: "cashed", gauge: 20, pushes: 1 }, card: card("a", { capital: 8, legitimacy: -10 }) });
  const hurts = card("b", { trust: 4, legitimacy: -8 });
  assert.deepEqual(getCardBurn(hurts, nextRun.schema), { key: "legitimacy", value: -12, fractured: true });
  assert.equal(applyGauntletEffect(hurts.effect, { outcome: "cash", gauge: 0, fracturedAxis: "legitimacy" }).legitimacy, -12);
});

test("closing a case moves the pot into the vault and reboots the rules", () => {
  const run = normalizeRunState({ runPot: 1200, vault: 50, schema: { ...BASE_SCHEMA, faceDown: true, mutations: ["blackout"] } });
  const { verdict, nextRun } = resolveWindow({ run, window: { status: "cashed", gauge: 24, pushes: 2 }, card: card("a", { capital: 10 }), caseClosed: true });
  assert.equal(verdict.secured, 1200 + verdict.pot);
  assert.equal(nextRun.vault, 50 + verdict.secured);
  assert.equal(nextRun.runPot, 0);
  assert.equal(nextRun.schema.faceDown, false);
  assert.deepEqual(nextRun.schema.mutations, ["reboot"]);
});

test("a sealed card can always be opened without busting on a board that did not just bust", () => {
  for (const window of [
    { status: "cashed", gauge: 3, pushes: 0 },
    { status: "cashed", gauge: 70, pushes: 6 },
  ]) {
    const { nextRun } = resolveWindow({ run: normalizeRunState({ streak: 5 }), window, card: card("a", { capital: 9, trust: -2 }) });
    const { schema } = nextRun;
    assert.ok(SEAL_BREAK_GAUGE - 1 + schema.stepMax < schema.wallMin, "one push from just under the seal cannot reach the lowest wall");
  }
});

test("a window touched and left is settled as a bust when the table reopens", () => {
  const abandoned = createWindow({ schema: BASE_SCHEMA, seed: "left", abandoned: true });
  const fresh = createWindow({ schema: BASE_SCHEMA, seed: "left" });
  assert.equal(abandoned.status, "bust");
  assert.equal(abandoned.cause, "abandon");
  assert.equal(abandoned.wall, fresh.wall, "it is the same window, not a new draw");
  assert.equal(abandoned.gauge, fresh.gauge, "and the gauge does not jump to the wall, which would print it");
  assert.deepEqual(splitOpenSeed("run:3:start#tab-a"), { seed: "run:3:start", token: "tab-a" });
  assert.equal(normalizeRunState({ openCardId: "x" }).openCardId, null, "a staked card is only kept alongside the window it was staked in");
  const { verdict, nextRun } = resolveWindow({ run: normalizeRunState({ runPot: 700, openSeed: "left" }), window: abandoned, card: card("a", { trust: -11 }) });
  assert.equal(verdict.lostPot, 700, "leaving the table costs what busting costs");
  assert.equal(nextRun.openSeed, null, "and settling it closes the seed");
  assert.ok(nextRun.schema.mutations.includes("blackout"));
});

test("the pulse always races on a hot gauge or a late clock, whatever the tell says", () => {
  assert.ok(getHeartbeatBpm(80, 140) >= 120, "heat 80 is at least 120 even with the tell pointing far away");
  assert.ok(getHeartbeatBpm(80, 140, true) >= 120, "and SILENCE cannot flatten what the gauge already shows");
  assert.ok(getHeartbeatBpm(0, 90, false, 0.95) > 100, "an idle window running out is not a resting pulse");
  assert.equal(getHeartbeatBpm(0, 90, false, 0), 60);
});

test("a scratch is not a fracture", () => {
  const scratch = resolveWindow({ run: RUN_INITIAL_STATE, window: { status: "cashed", gauge: 20, pushes: 1 }, card: card("a", { capital: 8, trust: -(FRACTURE_MIN_BURN - 1) }) });
  assert.equal(scratch.nextRun.schema.fracturedAxis, null);
  assert.ok(!scratch.nextRun.schema.mutations.includes("fracture"));
});

test("a vault big enough buys the ending the same slack as holding the line", () => {
  const base = {
    resources: { trust: 62, legitimacy: 58, capital: 70, humanCost: 20, fatigue: 30, time: 40 },
    discoveredClues: [{ id: "c1" }, { id: "c2" }, { id: "c3" }],
    seasonHumanCost: 20,
    peakRiskPressure: 18,
    seasonBusts: 3,
    seasonBestMultiplier: 64,
  };
  assert.equal(getEndingVariant(base).id, "open-question", "busts close the held-the-line door");
  assert.equal(getEndingVariant({ ...base, seasonVaultPerCase: 9000 }).id, "open-question", "a vault any steady player fills does not");
  assert.equal(getEndingVariant({ ...base, seasonVaultPerCase: 17000 }).id, "open-oversight", "a vault only a reader of the table fills opens it anyway");
});

test("a tab whose run is older than the save cannot write it back", () => {
  const store = new Map();
  const previous = globalThis.localStorage;
  globalThis.localStorage = {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
  };
  try {
    // Tab A loads the run.
    assert.equal(writeSaveState({ runId: "r", dynamics: { busts: 0 } }, { force: true }).saved, true);
    adoptSaveRevision();
    // Tab B, in the same storage, settles a bust on top of it.
    const bRevision = JSON.parse(store.get("trigger-prototype-v2")).saveRevision + 1;
    store.set("trigger-prototype-v2", JSON.stringify({ runId: "r", dynamics: { busts: 1 }, saveRevision: bRevision }));
    // Tab A's old copy -- a pagehide, a resume from the intro -- is refused.
    const stale = writeSaveState({ runId: "r", dynamics: { busts: 0 } });
    assert.equal(stale.stale, true);
    assert.equal(JSON.parse(store.get("trigger-prototype-v2")).dynamics.busts, 1, "the other tab's bust survives");
    // After reloading from storage, A writes again.
    adoptSaveRevision();
    assert.equal(writeSaveState({ runId: "r", dynamics: { busts: 1 } }).saved, true);

    recordSettledWindowSeed("r:0:start");
    recordSettledWindowSeed("r:0:start");
    assert.deepEqual(readSettledWindowSeeds(), ["r:0:start"], "a settled window is recorded once, outside the save");
  } finally {
    globalThis.localStorage = previous;
  }
});

test("the forced card is the one that costs the most", () => {
  const hand = [card("mild", { trust: 3, time: -2 }), card("brutal", { capital: 10, humanCost: 20 }), { id: "free", type: "free" }];
  assert.equal(getForcedCard(hand, BASE_SCHEMA).id, "brutal");
});

test("run state survives a save round trip and old saves normalise cleanly", () => {
  const { nextRun } = resolveWindow({ run: RUN_INITIAL_STATE, window: { status: "bust", cause: "timeout", gauge: 40, wall: 60 }, card: card("a", { trust: -4 }) });
  assert.deepEqual(normalizeRunState(JSON.parse(JSON.stringify(serializeRunState(nextRun)))), nextRun);
  const legacy = normalizeRunState({ combo: 2, stressLevel: 88, bustFloor: 72, environmentMode: "fracture" });
  assert.deepEqual(legacy, normalizeRunState(RUN_INITIAL_STATE), "a pre-gauntlet dynamics blob opens a clean table");
});

test("the table ledger rebuilds pot, busts and best multiplier from the log", () => {
  const ledger = createGauntletLedger([
    { threshold: { busted: false, potMultiplier: 32, pot: 1500, pushes: 4 } },
    { threshold: { busted: true, potMultiplier: 0, lostPot: 1500, pushes: 6 } },
    { isSystemEvent: true },
  ]);
  assert.deepEqual(ledger, { busts: 1, cashes: 1, bestMultiplier: 32, potBanked: 1500, potLost: 1500, pushes: 10 });
});

test("the ending reads what the run did at the table", () => {
  const resources = { trust: 62, legitimacy: 58, capital: 70, humanCost: 20, fatigue: 30, time: 40 };
  const discoveredClues = [{ id: "c1" }, { id: "c2" }, { id: "c3" }];
  const entry = (potMultiplier, busted) => ({ threshold: { potMultiplier: busted ? 0 : potMultiplier, busted } });
  const strainOf = (log) => {
    const record = createGauntletLedger(log);
    return { seasonBusts: record.busts, seasonBestMultiplier: record.bestMultiplier };
  };
  const endingFor = (log) =>
    getEndingVariant({ resources, discoveredClues, seasonHumanCost: 20, peakRiskPressure: 18, ...strainOf(log) }).id;

  assert.equal(endingFor([entry(1, false), entry(1.5, false)]), "open-question", "a run that never pushed lands where it always did");
  assert.equal(endingFor([entry(32, false), entry(8, false)]), "open-oversight", "a clean season that cashed hot earns a clue of slack");
  assert.equal(endingFor([entry(64, true), entry(32, false)]), "open-question", "one bust takes that slack back");
  const wrecked = getEndingVariant({ resources, discoveredClues, seasonHumanCost: 20, peakRiskPressure: 18, seasonBusts: 16, seasonBestMultiplier: 32 });
  assert.equal(wrecked.id, "collapse");
  assert.equal(wrecked.failure, true);
});

test("the ending answers busts across the range play reaches, not at one step", () => {
  const base = {
    resources: { trust: 58, legitimacy: 54, capital: 62, humanCost: 22, fatigue: 24, time: 46 },
    discoveredClues: [{ id: "a" }, { id: "b" }],
    seasonHumanCost: 30,
    seasonBestMultiplier: 4,
  };
  const pressureAt = (seasonBusts, peakRiskPressure) => getEndingVariant({ ...base, peakRiskPressure, seasonBusts }).id;
  assert.notEqual(pressureAt(0, 28), "collapse", "a clean season at this strain does not collapse");
  assert.equal(pressureAt(10, 28), "collapse", "ten busts on top of it does");
  assert.ok(new Set([0, 2, 4, 6, 8, 10].map((busts) => pressureAt(busts, 28))).size > 1);
});
