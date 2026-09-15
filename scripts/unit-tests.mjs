import assert from "node:assert/strict";
import { BEAT_SLACK_COMBO, getEndingVariant } from "../src/gameLogic.js";
import { getSeasonStrain } from "../src/state/useResultReport.js";
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
  isSaveAheadOf,
  carryTableRecordIntoRestore,
  COMBO_POINT_CAP,
  FEVER_BONUS,
  getGrooveBonus,
  GROOVE_CAP,
  judgeBeat,
  scoreBeat,
  SLIP_SECONDS,
  applyRelics,
  drawRelicOffer,
  equipRelic,
  openCaseRun,
} from "../src/gauntlet/gauntletEngine.js";
import {
  DEFAULT_RELIC_POOL,
  getRelicPool,
  getRelicUnlocks,
  INSURANCE_UNLOCK_LOSS,
  normalizeRelicIds,
  RELIC_IDS,
  RELIC_OFFER_SIZE,
  RELICS,
  STANCE_RELIC_UNLOCK_COUNT,
} from "../src/gauntlet/relics.js";
import { parseRelicCodex } from "../src/gauntlet/useRelicTable.js";
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
    // Every relic set a season can hold, including the one that pulls the wall closer.
    for (const relics of [[], ["highRoller"], ["lockpick"], ["highRoller", "lockpick"], RELIC_IDS]) {
      const { nextRun } = resolveWindow({ run: normalizeRunState({ streak: 5, relics }), window, card: card("a", { capital: 9, trust: -2 }) });
      const { schema } = nextRun;
      assert.ok(schema.sealBreak <= SEAL_BREAK_GAUGE);
      assert.ok(schema.sealBreak - 1 + schema.stepMax < schema.wallMin, `one push from just under the seal cannot reach the lowest wall (${relics.join("+") || "no relics"})`);
    }
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

test("only play this tab has not seen counts as a newer save", () => {
  const mine = { runId: "r", dynamics: { windowIndex: 3, openSeed: "r:3:start#tab-a" } };
  assert.equal(isSaveAheadOf({ runId: "r", dynamics: { windowIndex: 3, openSeed: "r:3:start#tab-a" } }, mine, "tab-a"), false, "another tab that only opened the game");
  assert.equal(isSaveAheadOf({ runId: "r", dynamics: { windowIndex: 4 } }, mine, "tab-a"), true, "a window settled past this one");
  assert.equal(isSaveAheadOf({ runId: "r", dynamics: { windowIndex: 3, openSeed: "r:3:start#tab-b" } }, mine, "tab-a"), true, "a window another tab has taken hold of");
  assert.equal(isSaveAheadOf({ runId: "other", dynamics: { windowIndex: 0 } }, mine, "tab-a"), true, "a different run");
  assert.equal(isSaveAheadOf({ runId: "r", dynamics: { windowIndex: 2 } }, mine, "tab-a"), false, "a save behind this tab is this tab's to write");
});

test("restoring a recovery slot keeps the busts settled since the slot", () => {
  const bust = { nodeId: "payday", caseId: "case01", threshold: { busted: true, potMultiplier: 0, lostPot: 900, pushes: 5 } };
  const cash = { nodeId: "accounting", caseId: "case01", threshold: { busted: false, potMultiplier: 12, pot: 900, pushes: 3 } };
  const slot = { runId: "r", currentCase: "case01", log: [cash], resources: { trust: 50 }, dynamics: { windowIndex: 1, runPot: 900, busts: 0, cashes: 1 } };
  const current = {
    runId: "r",
    currentCase: "case01",
    log: [cash, bust],
    dynamics: { windowIndex: 2, runPot: 0, busts: 1, cashes: 1, schema: { ...BASE_SCHEMA, faceDown: true, mutations: ["blackout"] } },
  };
  const restored = carryTableRecordIntoRestore(slot, current);
  assert.equal(restored.dynamics.windowIndex, 2, "the window count never goes backwards, so the next wall is a new draw");
  assert.equal(restored.dynamics.busts, 1);
  assert.equal(restored.dynamics.runPot, 0, "the pot the bust wiped stays wiped");
  assert.equal(restored.dynamics.schema.faceDown, true, "and the board it broke stays broken");
  assert.equal(createGauntletLedger(restored.log).busts, 1, "the ledger the ending reads still sees the bust");
  assert.equal(carryTableRecordIntoRestore(slot, { ...current, runId: "other" }), slot, "a slot from another run is left alone");
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
  assert.deepEqual(ledger, {
    busts: 1,
    cashes: 1,
    bestMultiplier: 32,
    potBanked: 1500,
    potLost: 1500,
    pushes: 10,
    bestCombo: 0,
    beatHits: 0,
    perfects: 0,
    slips: 0,
    grooveBanked: 0,
    focusHits: 0,
    focusPerfects: 0,
    focusMisses: 0,
    bestFocusCombo: 0,
    focusModes: { strike: 0, steady: 0, expose: 0 },
    stanceMastery: { strike: 0, steady: 0, expose: 0 },
  });
});

test("the table ledger rebuilds focus locks from the log", () => {
  const ledger = createGauntletLedger([
    { threshold: { busted: false, focus: { mode: "expose", hits: 2, perfects: 1, misses: 0, maxCombo: 2 } } },
    { threshold: { busted: true, focus: { mode: "steady", hits: 0, perfects: 0, misses: 1, maxCombo: 0 } } },
  ]);
  assert.equal(ledger.focusHits, 2);
  assert.equal(ledger.focusPerfects, 1);
  assert.equal(ledger.focusMisses, 1);
  assert.equal(ledger.bestFocusCombo, 2);
  assert.deepEqual(ledger.focusModes, { strike: 0, steady: 1, expose: 2 });
  assert.deepEqual(ledger.stanceMastery, { strike: 0, steady: 0, expose: 0 });
});

test("focus modes change the lock outcome and steady cools the gauge", () => {
  const selected = reduceWindow(createWindow({ seed: "focus-mode" }), { type: "SELECT", id: "a" });
  const steady = reduceWindow(reduceWindow({ ...selected, gauge: 20 }, { type: "SET_FOCUS_MODE", mode: "steady" }), { type: "FOCUS", grade: "perfect" });
  const strike = reduceWindow(reduceWindow({ ...selected, gauge: 20 }, { type: "SET_FOCUS_MODE", mode: "strike" }), { type: "FOCUS", grade: "perfect" });
  assert.equal(steady.focusMode, "steady");
  assert.ok(steady.gauge < 20, "steady turns a clean lock into heat relief");
  assert.ok(strike.focus > steady.focus, "strike charges faster than steady");
});

test("charged focus modes carry their stance into the next board", () => {
  const rich = card("rich", { capital: 30, trust: -5 });
  const strike = resolveWindow({
    run: RUN_INITIAL_STATE,
    window: { status: "cashed", gauge: 35, wall: 80, pushes: 2, focus: 80, focusMode: "strike", focusHits: 2 },
    card: rich,
  }).nextRun.schema;
  assert.ok(strike.mutations.includes("strikeWake"));
  assert.ok(strike.chipsScale > BASE_SCHEMA.chipsScale);
  assert.ok(strike.stepMax > BASE_SCHEMA.stepMax);

  const steady = resolveWindow({
    run: RUN_INITIAL_STATE,
    window: { status: "cashed", gauge: 72, wall: 90, pushes: 5, focus: 90, focusMode: "steady", focusHits: 3 },
    card: rich,
  }).nextRun.schema;
  assert.ok(steady.mutations.includes("steadyLine"));
  assert.ok(steady.startGauge < Math.round(72 / 3), "steady cools heat debt before the next board opens");
  assert.ok(steady.wallMin > BASE_SCHEMA.wallMin);

  const expose = resolveWindow({
    run: RUN_INITIAL_STATE,
    window: { status: "cashed", gauge: 4, wall: 80, pushes: 0, focus: 75, focusMode: "expose", focusHits: 2 },
    card: rich,
  }).nextRun.schema;
  assert.ok(expose.mutations.includes("exposedHand"));
  assert.equal(expose.sealHighest, false);
  assert.ok(!expose.mutations.includes("coldFeet"));
});

test("stance mastery survives saves and reshapes future boards", () => {
  const rich = card("rich", { capital: 30, trust: -5 });
  let run = RUN_INITIAL_STATE;
  for (let index = 0; index < 3; index += 1) {
    run = resolveWindow({
      run,
      window: { status: "cashed", gauge: 35, wall: 80, pushes: 2, focus: 80, focusMode: "strike", focusHits: 2 },
      card: rich,
    }).nextRun;
  }

  assert.deepEqual(run.stanceMastery, { strike: 3, steady: 0, expose: 0 });
  assert.ok(run.schema.mutations.includes("strikeMastery"));
  assert.ok(run.schema.chipsScale > BASE_SCHEMA.chipsScale * 1.25, "mastery stacks on top of the active stance carry");

  const roundTrip = normalizeRunState(JSON.parse(JSON.stringify(serializeRunState(run))));
  assert.deepEqual(roundTrip.stanceMastery, run.stanceMastery);

  const ledger = createGauntletLedger([
    { threshold: { busted: false, focus: { mode: "strike", charge: 80, hits: 2, perfects: 1, misses: 0, maxCombo: 2 } } },
    { threshold: { busted: false, focus: { mode: "steady", charge: 90, hits: 3, perfects: 2, misses: 0, maxCombo: 3 } } },
    { threshold: { busted: true, focus: { mode: "expose", charge: 90, hits: 3, perfects: 2, misses: 0, maxCombo: 3 } } },
  ]);
  assert.deepEqual(ledger.stanceMastery, { strike: 1, steady: 1, expose: 0 }, "only charged cashes build season mastery");
});

/* ---------------------------------------------------------------- tempo */

test("a press is graded against the beat it was closest to, with a floor for a racing pulse", () => {
  assert.equal(judgeBeat(0, 1000), "perfect", "on the beat");
  assert.equal(judgeBeat(960, 1000), "perfect", "just ahead of the next beat counts too");
  assert.equal(judgeBeat(150, 1000), "good");
  assert.equal(judgeBeat(500, 1000), "miss", "between beats is a slip");
  assert.equal(judgeBeat(30, 316), "perfect", "at 190 bpm the perfect window keeps its millisecond floor");
  assert.equal(judgeBeat(55, 316), "good");
  assert.equal(judgeBeat(2150, 1000), "good", "a late frame still reads the beat it is nearest");
  assert.equal(judgeBeat(100, 0), null, "no beat on screen, no grade");
  assert.equal(judgeBeat(Number.NaN, 1000), null);
});

test("a combo earns groove, a slip breaks the combo and keeps the groove", () => {
  let state = { beatCombo: 0, groove: 0 };
  const earned = [];
  for (const grade of ["good", "perfect", "perfect", "perfect", "perfect", "perfect"]) {
    state = scoreBeat(state, grade);
    earned.push(state.points);
  }
  assert.deepEqual(earned, [1, 3, 4, COMBO_POINT_CAP + 1, COMBO_POINT_CAP + 1, COMBO_POINT_CAP + 1], "points follow the combo up to the cap");
  const slipped = scoreBeat(state, "miss");
  assert.equal(slipped.beatCombo, 0);
  assert.equal(slipped.groove, state.groove, "the pot on the table never shrinks mid-window");
  assert.deepEqual(scoreBeat(state, null), { ...state, points: 0 }, "an ungraded press changes nothing");
  assert.equal(getGrooveBonus(0), 1);
  assert.equal(getGrooveBonus(10_000), 1 + GROOVE_CAP, "the groove is capped");
  assert.ok(FEVER_BONUS > 1 && FEVER_BONUS <= 1 + GROOVE_CAP, "fever is reachable");
});

test("timing never moves the wall or the step, and a slip is paid in clock and creep", () => {
  const base = liveWindow({ wall: 95, elapsed: 10 });
  const plain = reduceWindow(base, { type: "PUSH" });
  const perfect = reduceWindow(base, { type: "PUSH", grade: "perfect" });
  const slip = reduceWindow(base, { type: "PUSH", grade: "miss" });
  assert.equal(perfect.gauge, plain.gauge, "a perfect press draws the same step");
  assert.equal(perfect.elapsed, plain.elapsed);
  assert.equal(perfect.beatCombo, 1);
  assert.equal(slip.elapsed, plain.elapsed + SLIP_SECONDS, "a slip costs clock");
  assert.ok(slip.gauge > plain.gauge, "and the clock creeps heat while it runs, so a slip is never a way around creep");
  assert.equal(slip.slips, 1);
  const late = liveWindow({ wall: 95, elapsed: BASE_SCHEMA.seconds - 0.5 });
  const timedOut = reduceWindow(late, { type: "PUSH", grade: "miss" });
  assert.equal(timedOut.status, "bust");
  assert.equal(timedOut.cause, "timeout", "a slip that runs the clock out is a timeout");
  assert.equal(reduceWindow(liveWindow({ wall: 10, gauge: 5 }), { type: "PUSH", grade: "perfect" }).cause, "push", "the beat does not save a press into the wall");
});

test("the groove pays the pot, the combo rides a cash, and the wall takes both", () => {
  const staked = card("a", { capital: 10, trust: -4 });
  let win = reduceWindow(liveWindow({ wall: 95 }), { type: "SELECT", id: "a" });
  for (const grade of ["perfect", "perfect", "good"]) win = reduceWindow(win, { type: "PUSH", grade });
  const cashed = reduceWindow(win, { type: "CASH" });
  const { verdict, nextRun } = resolveWindow({ run: RUN_INITIAL_STATE, window: cashed, card: staked });
  const untimed = resolveWindow({ run: RUN_INITIAL_STATE, window: { ...cashed, groove: 0 }, card: staked }).verdict;
  assert.ok(verdict.pot > untimed.pot, "the groove shows up in the pot");
  assert.equal(verdict.tempo.groovePot, verdict.pot - untimed.pot);
  assert.equal(verdict.multiplier, untimed.multiplier, "the heat multiplier belongs to the heat alone");
  assert.equal(nextRun.beatCombo, 3, "a cash carries the combo into the next window");
  assert.equal(nextRun.bestCombo, 3);
  assert.equal(nextRun.runGroove, verdict.tempo.groovePot);
  assert.equal(createWindow({ seed: "next", beatCombo: nextRun.beatCombo }).beatCombo, 3);

  const busted = resolveWindow({ run: nextRun, window: { ...cashed, status: "bust", cause: "push" }, card: staked });
  assert.equal(busted.nextRun.beatCombo, 0, "a bust takes the combo with the pot");
  assert.equal(busted.nextRun.runGroove, 0);
  assert.equal(busted.nextRun.bestCombo, 3, "the record of the combo stays");
  assert.equal(busted.verdict.tempo.lostCombo, 3);

  const closed = resolveWindow({ run: nextRun, window: cashed, card: staked, caseClosed: true });
  assert.equal(closed.nextRun.grooveVault, nextRun.runGroove + closed.verdict.tempo.groovePot, "a closed case moves the groove share into the vault with the pot");
  assert.ok(closed.nextRun.grooveVault <= closed.nextRun.vault);
  const roundTrip = normalizeRunState(JSON.parse(JSON.stringify(serializeRunState(closed.nextRun))));
  assert.deepEqual(roundTrip, closed.nextRun, "the tempo record survives a save");
});

test("the ledger and the ending read the beat, and the vault slack does not count the groove", () => {
  const ledger = createGauntletLedger([
    { threshold: { busted: false, potMultiplier: 4, pot: 900, pushes: 3, tempo: { maxCombo: 5, hits: 3, perfects: 2, slips: 0, groovePot: 240 } } },
    { threshold: { busted: true, potMultiplier: 0, lostPot: 900, pushes: 4, tempo: { maxCombo: 7, hits: 2, perfects: 1, slips: 2, groovePot: 0 } } },
  ]);
  assert.equal(ledger.bestCombo, 7);
  assert.equal(ledger.beatHits, 5);
  assert.equal(ledger.perfects, 3);
  assert.equal(ledger.slips, 2);
  assert.equal(ledger.grooveBanked, 240);

  const base = {
    resources: { trust: 62, legitimacy: 58, capital: 70, humanCost: 20, fatigue: 30, time: 40 },
    discoveredClues: [{ id: "c1" }, { id: "c2" }, { id: "c3" }],
    seasonHumanCost: 20,
    peakRiskPressure: 18,
    seasonBusts: 3,
    seasonBestMultiplier: 64,
  };
  assert.equal(getEndingVariant({ ...base, seasonBestCombo: BEAT_SLACK_COMBO - 1 }).id, "open-question", "a combo a mashing hand can stumble into opens nothing");
  assert.equal(getEndingVariant({ ...base, seasonBestCombo: BEAT_SLACK_COMBO }).id, "open-oversight", "a season that stayed on the beat earns the clue of slack");

  const strain = getSeasonStrain({ case01: { gauntlet: { vault: 20000, grooveVault: 6000, bestCombo: 4 }, pushRecord: { bestCombo: 9, busts: 3, bestMultiplier: 64 } } });
  assert.equal(strain.seasonVaultPerCase, 14000, "the vault slack is read without the groove");
  assert.equal(strain.seasonBestCombo, 9);
  assert.equal(getEndingVariant({ ...base, ...strain, seasonHumanCost: 20, peakRiskPressure: 18 }).id, "open-question", "groove alone cannot buy the vault door");
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

/* --------------------------------------------------------------- relics */

test("every relic has copy, the default pool needs no unlock, and ids normalise", () => {
  for (const id of RELIC_IDS) {
    const relic = RELICS[id];
    assert.ok(relic.label && relic.name && relic.text && relic.proc && relic.icon, `${id} is fully written`);
    if (relic.softens) assert.ok(relic.softens.text && relic.softens.mutation, `${id} names what it softens`);
    assert.doesNotMatch(relic.text, /%|확률/, `${id} never prints odds`);
  }
  assert.ok(DEFAULT_RELIC_POOL.length >= RELIC_OFFER_SIZE, "a first season can fill a draft");
  assert.ok(DEFAULT_RELIC_POOL.every((id) => !RELICS[id].unlock));
  assert.deepEqual(normalizeRelicIds(["splint", "nope", "splint", 4, "encore"]), ["splint", "encore"]);
  assert.deepEqual(getRelicPool(["encore"]), [...DEFAULT_RELIC_POOL, "encore"], "the codex adds to the defaults");
  assert.deepEqual(parseRelicCodex("{broken"), { unlocked: [] });
  assert.deepEqual(parseRelicCodex(JSON.stringify({ unlocked: ["insurance", "made-up"] })), { unlocked: ["insurance"] });
});

test("relics bend the next board once, and equipping one never double-applies", () => {
  const bust = (relics, cause = "push") =>
    resolveWindow({ run: normalizeRunState({ relics }), window: { status: "bust", cause, gauge: 60 }, card: card("a", { capital: 9, trust: -12 }) });
  assert.equal(bust([]).nextRun.schema.startGauge, 22);
  assert.equal(bust(["coldBlood"]).nextRun.schema.startGauge, 11, "COLD BLOOD halves the aftershock");
  assert.equal(bust([], "timeout").nextRun.schema.sedated, true);
  assert.equal(bust(["stethoscope"], "timeout").nextRun.schema.sedated, false, "STETHOSCOPE keeps the heartbeat through SILENCE");
  assert.equal(bust(["stethoscope"], "timeout").nextRun.schema.seconds, 30, "but not the time");
  assert.deepEqual(bust(["coldBlood", "stethoscope"], "timeout").verdict.relicProcs, ["coldBlood", "stethoscope"]);
  assert.equal(
    bust(["coldBlood"]).verdict.nextMutations.find((mutation) => mutation.id === "aftershock").softenedBy,
    "coldBlood",
    "the breach can say which relic softened a rule",
  );

  const hot = (relics) => resolveWindow({ run: normalizeRunState({ relics }), window: { status: "cashed", gauge: 72, pushes: 5 }, card: card("a", { capital: 9 }) }).nextRun.schema;
  assert.deepEqual([hot([]).startGauge, hot([]).seconds], [24, 33]);
  assert.deepEqual([hot(["heatSink"]).startGauge, hot(["heatSink"]).seconds], [12, 39], "HEAT SINK halves the debt");

  const once = applyRelics(BASE_SCHEMA, ["highRoller"]);
  assert.equal(once.wallMin, BASE_SCHEMA.wallMin - 4);
  assert.equal(applyRelics(once, ["highRoller"]).wallMin, once.wallMin, "a board that carries a relic is not dealt it twice");
  assert.equal(applyRelics(once, ["highRoller"]).chipsScale, once.chipsScale);
  assert.equal(applyRelics(BASE_SCHEMA, ["lockpick"]).sealBreak, 15);
  const hurts = card("h", { trust: -8 });
  assert.equal(getCardBurn(hurts, { ...applyRelics(BASE_SCHEMA, ["splint"]), fracturedAxis: "trust" }).value, -10, "SPLINT bills 1.25x");
  assert.equal(getCardBurn(hurts, { ...BASE_SCHEMA, fracturedAxis: "trust" }).value, -12);
  assert.equal(applyGauntletEffect({ trust: -8 }, { outcome: "cash", fracturedAxis: "trust", fractureRate: 1.25 }).trust, -10);
});

test("stance relics unlock from mastery and bend their mastered board", () => {
  const mastery = { strike: STANCE_RELIC_UNLOCK_COUNT, steady: STANCE_RELIC_UNLOCK_COUNT, expose: STANCE_RELIC_UNLOCK_COUNT };
  const unlocks = getRelicUnlocks({ verdict: { outcome: "cash", multiplier: 1, tempo: {}, nextMutations: [] }, nextRun: { stanceMastery: mastery } }, []);
  assert.deepEqual(unlocks.slice(-3), ["kineticGrip", "steadyAnchor", "glassLens"]);

  const struck = resolveWindow({
    run: normalizeRunState({ stanceMastery: { strike: STANCE_RELIC_UNLOCK_COUNT }, relics: ["kineticGrip"] }),
    window: { status: "cashed", gauge: 35, wall: 80, pushes: 2, focus: 80, focusMode: "strike", focusHits: 2 },
    card: card("a", { capital: 9 }),
  }).nextRun.schema;
  assert.ok(struck.mutations.includes("strikeMastery"));
  assert.equal(struck.stepMin, BASE_SCHEMA.stepMin + 2, "KINETIC GRIP removes only the mastery tax, not STRIKE WAKE");

  const steady = resolveWindow({
    run: normalizeRunState({ stanceMastery: { steady: STANCE_RELIC_UNLOCK_COUNT }, relics: ["steadyAnchor"] }),
    window: { status: "cashed", gauge: 20, wall: 80, pushes: 2 },
    card: card("a", { capital: 9 }),
  }).nextRun.schema;
  assert.ok(steady.mutations.includes("steadyMastery"));
  assert.equal(steady.startGauge, 0);
  assert.equal(steady.seconds, BASE_SCHEMA.seconds + STANCE_RELIC_UNLOCK_COUNT + 2);

  const exposed = resolveWindow({
    run: normalizeRunState({ stanceMastery: { expose: STANCE_RELIC_UNLOCK_COUNT }, relics: ["glassLens"] }),
    window: { status: "bust", cause: "push", gauge: 60 },
    card: card("a", { capital: 9 }),
  }).nextRun.schema;
  assert.ok(exposed.mutations.includes("exposeMastery"));
  assert.equal(exposed.faceDown, false);
  assert.equal(exposed.sealHighest, false);
  assert.equal(exposed.sealBreak, 8);
});

test("INSURANCE keeps a third of the pot once a case, and ENCORE keeps the combo", () => {
  const run = normalizeRunState({ relics: ["insurance", "encore"], runPot: 900, runGroove: 90 });
  const first = resolveWindow({ run, window: { status: "bust", cause: "push", gauge: 60, beatCombo: 5 }, card: card("a", { capital: 9 }) });
  assert.equal(first.verdict.insuredPot, 300);
  assert.equal(first.verdict.lostPot, 600);
  assert.equal(first.nextRun.runPot, 300);
  assert.equal(first.nextRun.runGroove, 30);
  assert.equal(first.nextRun.beatCombo, 5, "ENCORE: the wall takes the pot, not the combo");
  assert.equal(first.verdict.tempo.lostCombo, 0);
  assert.deepEqual(first.verdict.relicProcs.slice(0, 2), ["insurance", "encore"]);
  const second = resolveWindow({ run: first.nextRun, window: { status: "bust", cause: "push", gauge: 60 }, card: card("a", { capital: 9 }) });
  assert.equal(second.verdict.insuredPot, 0, "once a case");
  assert.equal(second.nextRun.runPot, 0);
  const closed = resolveWindow({ run: first.nextRun, window: { status: "cashed", gauge: 20, pushes: 2 }, card: card("a", { capital: 9 }), caseClosed: true });
  assert.equal(closed.nextRun.insuranceSpent, false, "a closed case renews it");
  const bare = resolveWindow({ run: normalizeRunState({ runPot: 900 }), window: { status: "bust", cause: "push", gauge: 60, beatCombo: 5 }, card: card("a", { capital: 9 }) });
  assert.deepEqual([bare.nextRun.runPot, bare.nextRun.beatCombo, bare.verdict.insuredPot], [0, 0, 0], "without relics a bust still takes everything");
});

test("a closed case drafts three relics it cannot reroll, and equipping takes only what was offered", () => {
  const settle = (relics, relicPool) =>
    resolveWindow({
      run: normalizeRunState({ relics }),
      window: { status: "cashed", gauge: 20, pushes: 2, seed: "case01:9" },
      card: card("a", { capital: 9 }),
      caseClosed: true,
      offerRelics: true,
      relicPool,
    });
  const offered = settle([], DEFAULT_RELIC_POOL).nextRun.relicOffer;
  assert.equal(offered.length, RELIC_OFFER_SIZE);
  assert.deepEqual(settle([], DEFAULT_RELIC_POOL).nextRun.relicOffer, offered, "the same closed window deals the same draft");
  assert.deepEqual(drawRelicOffer("case01:9", DEFAULT_RELIC_POOL, []), offered);
  assert.ok(settle(["metronome", "coldBlood"], DEFAULT_RELIC_POOL).nextRun.relicOffer.every((id) => !["metronome", "coldBlood"].includes(id)), "never offers what is carried");
  assert.ok(settle([], ["encore"]).nextRun.relicOffer.every((id) => id === "encore"), "the pool is the codex");
  assert.deepEqual(resolveWindow({ run: RUN_INITIAL_STATE, window: { status: "cashed", gauge: 20, pushes: 2 }, card: card("a", { capital: 9 }), caseClosed: true }).nextRun.relicOffer, [], "no draft unless asked");

  const drafted = settle([], DEFAULT_RELIC_POOL).nextRun;
  const opened = openCaseRun(drafted);
  assert.deepEqual(opened.relicOffer, offered, "the draft survives into the next case's first table");
  assert.deepEqual(openCaseRun({ ...drafted, schema: BASE_SCHEMA }).relicOffer, [], "an abandoned case deals no draft");
  const picked = equipRelic(opened, offered[0]);
  assert.deepEqual(picked.relics, [offered[0]]);
  assert.deepEqual(picked.relicOffer, []);
  assert.deepEqual(picked.schema.relics, [offered[0]], "the board on the table is re-dealt with it");
  assert.deepEqual(equipRelic(picked, "encore").relics, picked.relics, "a relic that was not offered cannot be taken");
  const passed = equipRelic(opened, null);
  assert.deepEqual([passed.relics, passed.relicOffer], [[], []]);
  const roundTrip = normalizeRunState(JSON.parse(JSON.stringify(serializeRunState(picked))));
  assert.deepEqual(roundTrip, picked, "relics survive a save");
});

test("a window is re-dealt by a relic only while nobody has touched it", () => {
  const board = applyRelics(BASE_SCHEMA, ["highRoller"]);
  const fresh = createWindow({ schema: BASE_SCHEMA, seed: "redeal", beatCombo: 3 });
  const redealt = reduceWindow(fresh, { type: "REDEAL", schema: board });
  assert.equal(redealt.schema.wallMin, board.wallMin);
  assert.equal(redealt.beatCombo, 3, "the carried combo stays");
  for (const touched of [{ pushes: 1 }, { selectedId: "a" }, { elapsed: 0.2 }]) {
    const window = { ...fresh, ...touched };
    assert.equal(reduceWindow(window, { type: "REDEAL", schema: board }), window, `no re-deal after ${Object.keys(touched)[0]}`);
  }
});

test("relics are unlocked by feats, and a restore cannot hand an INSURANCE payout back", () => {
  const unlocks = (verdict, nextRun = {}, unlocked = []) => getRelicUnlocks({ verdict, nextRun }, unlocked);
  assert.deepEqual(unlocks({ outcome: "cash", multiplier: 8, tempo: { maxCombo: 3 }, nextMutations: [] }), []);
  assert.deepEqual(unlocks({ outcome: "cash", multiplier: 64, tempo: { maxCombo: 8 }, nextMutations: [] }), ["encore", "highRoller"]);
  assert.deepEqual(unlocks({ outcome: "bust", lostPot: INSURANCE_UNLOCK_LOSS, nextMutations: [{ id: "silence" }] }), ["insurance", "stethoscope"]);
  assert.deepEqual(unlocks({ outcome: "bust", lostPot: INSURANCE_UNLOCK_LOSS, nextMutations: [] }, {}, ["insurance"]), [], "an unlock happens once");

  const current = {
    runId: "r",
    currentCase: "case01",
    log: [],
    resources: {},
    dynamics: serializeRunState(normalizeRunState({ windowIndex: 6, relics: ["insurance", "splint"], insuranceSpent: true, relicOffer: ["encore"] })),
  };
  const restored = { ...current, dynamics: serializeRunState(normalizeRunState({ windowIndex: 3, relics: ["insurance"] })) };
  const carried = normalizeRunState(carryTableRecordIntoRestore(restored, current).dynamics);
  assert.deepEqual(carried.relics, ["insurance", "splint"]);
  assert.equal(carried.insuranceSpent, true);
  assert.deepEqual(carried.relicOffer, []);
});
