import assert from "node:assert/strict";

import {
  anonymizeSensitiveText,
  applyEffect,
  createDecisionForecast,
  createCaseSummary,
  getCounterfactualReport,
  getDecisionFingerprint,
  getDecisionLedger,
  getDiscoveryClue,
  getCaseOutcome,
  getOutcomeCarryover,
  getContinuityChallenge,
  detectPrivacySignals,
  getGameplayStats,
  getRiskPressure,
  getRiskPressureDrivers,
  buildNarrativeSpine,
  getSuspenseEvent,
  getSuspenseState,
  limitText,
  speechifyChoice,
} from "../src/gameLogic.js";
import {
  FEEDBACK_COMMENT_MAX_LENGTH,
  copyText,
  FREE_TEXT_MAX_LENGTH,
  isSavedStateShapeValid,
  parseSavedState,
  readStoredValue,
  removeStoredValue,
  SAVE_SCHEMA_VERSION,
  STORAGE_KEY,
  writeStoredValue,
} from "../src/appConfig.js";
import { caseOpeningRoutes, initialResources, nodeOrders, nodes } from "../src/gameData.js";
import { buildLeaderboard, getLeaderboardHeadline } from "../src/ranking.js";
import { easyResourceLabels, simplifyPlayerText } from "../src/playerLanguage.js";

assert.equal(STORAGE_KEY, "trigger-prototype-v2", "storage key should stay on the v2 namespace");
assert.equal(SAVE_SCHEMA_VERSION, 2, "save schema version should match exported log format");
assert.equal(FREE_TEXT_MAX_LENGTH, 600, "free text should keep a bounded log length");
assert.equal(FEEDBACK_COMMENT_MAX_LENGTH, 600, "feedback comments should keep a bounded log length");
assert.deepEqual(
  parseSavedState(JSON.stringify({ saveSchemaVersion: SAVE_SCHEMA_VERSION, started: false }), SAVE_SCHEMA_VERSION),
  { saveSchemaVersion: SAVE_SCHEMA_VERSION, started: false },
  "matching save schemas should be restored",
);
assert.equal(parseSavedState('{"saveSchemaVersion":1}', SAVE_SCHEMA_VERSION), null, "old save schemas should be ignored");
assert.equal(parseSavedState("not-json", SAVE_SCHEMA_VERSION), null, "corrupt saves should be ignored");
assert.equal(
  isSavedStateShapeValid({
    currentCase: "case01",
    nodeId: "start",
    completedCases: [],
    discoveredClues: [],
    log: [],
    pendingTelemetry: [],
    caseResults: {},
    playtestFeedback: {},
    resources: {},
    triggers: {},
    cognition: {},
  }),
  true,
  "valid save shapes should be restorable",
);
assert.equal(
  isSavedStateShapeValid({ currentCase: "case01", nodeId: "start", completedCases: {} }),
  false,
  "invalid save shapes should be ignored",
);
assert.equal(readStoredValue("missing-key", "fallback"), "fallback", "storage reads should degrade gracefully");
assert.equal(writeStoredValue("test-key", "value"), false, "storage writes should report unavailable browser storage");
removeStoredValue("test-key");
assert.equal(await copyText("test"), false, "clipboard fallback should fail safely without a browser");
assert.equal(easyResourceLabels.capital, "현금", "player language should use an intuitive resource label");
assert.equal(
  simplifyPlayerText("CASE 02 / LEGITIMACY / HIDDEN PROTOCOL"),
  "사건 2 / 공정함 / 숨은 긴급 절차",
  "player language should translate visible system terms",
);
assert.ok(nodes.c1_aftershock?.choices?.length === 3, "case 01 should include a post-decision branch scene");
assert.ok(nodes.f_aftershock?.choices?.length === 3, "the final act should include a final branch scene");
assert.equal(nodeOrders.case01.at(-1), "c1_aftershock", "case 01 order should include its aftermath scene");
assert.equal(nodeOrders.final.at(-1), "f_aftershock", "the final order should include its aftermath scene");
assert.ok(nodes.c1_witness && nodes.c1_verdict, "case 01 should include connective witness and verdict scenes");
assert.ok(nodes.c2_trace && nodes.c3_signal && nodes.c4_public && nodes.c5_voice, "every middle case should include a new evidence scene");
assert.equal(nodeOrders.case01.length, 15, "case 01 should have expanded to fifteen playable scenes");
assert.equal(nodeOrders.final.length, 12, "the final act should have expanded to twelve playable scenes");
assert.ok(nodes.c1_witness_reaction && nodes.c2_trace_reaction && nodes.c3_signal_reaction, "early cases should include reaction scenes");
assert.ok(nodes.c4_public_reaction && nodes.c5_voice_reaction && nodes.f_dilemma_reaction, "late cases should include reaction scenes");
assert.ok(nodeOrders.case01.length > 14, "case 01 should include a second layer of reaction scenes");
assert.ok(nodeOrders.final.length > 8, "the final act should include a second layer of reaction scenes");
assert.equal(
  getDiscoveryClue({ currentCase: "case01", challengeMatch: true, riskDelta: 4, responseTimeSec: 20, logLength: 1 }).id,
  "c1-hidden-ledger",
  "a risky successful choice should reveal a case clue",
);
assert.equal(
  getDiscoveryClue({ currentCase: "case01", challengeMatch: false, riskDelta: 8, responseTimeSec: 20, logLength: 1 }),
  null,
  "a risky choice without a challenge should not reveal a clue",
);
assert.equal(
  getCaseOutcome({ caseId: "case04", choiceId: "c4_after_service" }).tag,
  "서비스를 지킨 결말",
  "case outcomes should reflect the selected aftermath branch",
);
assert.equal(caseOpeningRoutes.case02.c1_after_people, "c2_start_people", "case 02 should have a people-led opening route");
assert.equal(caseOpeningRoutes.final.c5_after_system, "f_start_system", "the final act should have a system-led opening route");
assert.equal(nodes.c4_start_proof.phase, "BRANCH BRIEFING", "branch openings should be real playable nodes");
assert.equal(getOutcomeCarryover({ caseId: "case01", choiceId: "c1_after_people" }).trust, 6, "outcome effects should carry into the next case");
assert.equal(getContinuityChallenge({ caseId: "case02", choiceId: "c1_after_people" }).id, "protect-trust", "outcome branches should create a custom next-case challenge");
assert.equal(Object.values(caseOpeningRoutes.case02).length, 3, "all case 02 opening branches should be addressable");

const riskyResources = {
  time: 40,
  capital: 60,
  trust: 50,
  legitimacy: 50,
  humanCost: 40,
  fatigue: 40,
};
const recoveredResources = {
  time: 55,
  capital: 70,
  trust: 50,
  legitimacy: 50,
  humanCost: 25,
  fatigue: 20,
};

assert.equal(getRiskPressure(initialResources), 2, "initial risk pressure should stay low");
assert.equal(getRiskPressure({ fatigue: 10 }), 2, "partial resources should use safe defaults");
assert.ok(
  getRiskPressure(recoveredResources) < getRiskPressure(riskyResources),
  "recovered resources should reduce risk pressure",
);
assert.deepEqual(
  getRiskPressureDrivers(riskyResources)
    .slice(0, 2)
    .map((driver) => driver.id),
  ["time", "capital"],
  "risk pressure drivers should be sorted by pressure contribution",
);

const suspenseWatch = getSuspenseState({ riskPressure: 20, decisionSeconds: 35, log: [{}, {}], currentCase: "case02" });
assert.equal(suspenseWatch.tier, "WATCH", "suspense state should escalate into watch tier");
assert.equal(suspenseWatch.caseCode, "02", "suspense state should expose compact case code");
const observerEvent = getSuspenseEvent({ riskBefore: 42, riskAfter: 54, currentCase: "case02", logLength: 1 });
assert.equal(observerEvent.id, "observer-awake", "suspense event should reveal observer at the unstable threshold");
const protocolEvent = getSuspenseEvent({ riskBefore: 68, riskAfter: 74, currentCase: "case03", logLength: 2 });
assert.equal(protocolEvent.tone, "redline", "suspense event should use redline tone at critical threshold");
const narrativeSpine = buildNarrativeSpine({
  caseObjective: "72시간 안에 손실 구조를 선택한다",
  node: { phase: "BOARD", title: "누가 비용을 내는가", triggers: ["responsibility", "protection"] },
  log: [{ choice: "기록을 남긴다" }],
  triggerLabels: { responsibility: "책임", protection: "보호" },
  riskTier: "UNSTABLE",
  suspenseState: { tier: "UNSTABLE" },
});
assert.equal(narrativeSpine.turn, 2, "narrative spine should number the current turn");
assert.match(narrativeSpine.previous, /기록을 남긴다/, "narrative spine should carry the previous decision");
assert.match(narrativeSpine.conflict, /책임 \/ 보호/, "narrative spine should summarize current conflict");

assert.deepEqual(
  applyEffect({ ...initialResources, time: 70, fatigue: 98 }, { time: 10, fatigue: 8 }),
  { ...initialResources, time: 72, fatigue: 100 },
  "resource effects should clamp to resource caps",
);

const decisionForecast = createDecisionForecast(
  {
    id: "recover",
    effect: { time: 8, capital: 10, fatigue: -12 },
    cognition: { inference: 2, risk: 1 },
  },
  riskyResources,
);

assert.equal(decisionForecast.choiceId, "recover", "decision forecast should keep the choice id");
assert.ok(decisionForecast.riskDelta < 0, "decision forecast should calculate risk reduction");
assert.deepEqual(decisionForecast.biggestGain, ["fatigue", -12], "decision forecast should identify biggest gain");
assert.deepEqual(decisionForecast.biggestCost, undefined, "decision forecast should allow choices without costs");
assert.equal(decisionForecast.cognitionGain, 3, "decision forecast should sum cognition gain");

const ledger = getDecisionLedger(
  [
    { effect: { time: -8, capital: -4 }, resourcesBefore: initialResources, resourcesAfter: riskyResources },
    { effect: { trust: 2, humanCost: -8 }, resourcesBefore: riskyResources, resourcesAfter: recoveredResources },
  ],
  recoveredResources,
);
assert.equal(ledger.riskRises, 1, "decision ledger should count rising pressure turns");
assert.equal(ledger.riskDrops, 1, "decision ledger should count recovery turns");
assert.deepEqual(ledger.strongestRecovery, ["humanCost", -8], "decision ledger should identify recovery effects");

const fingerprint = getDecisionFingerprint({
  triggerScores: { responsibility: 12, protection: 8, curiosity: 2 },
  cognitionScores: { reframing: 4, inference: 2 },
  entries: [
    { freeText: "조건을 다시 설계한다", challenge: { matched: true }, effect: { humanCost: -6 }, resourcesBefore: riskyResources, resourcesAfter: recoveredResources },
  ],
  resources: recoveredResources,
});
assert.equal(fingerprint.mode, "GUARDIAN", "decision fingerprint should classify recovery-led play");
assert.deepEqual(fingerprint.primaryTrigger, ["responsibility", 12], "decision fingerprint should expose primary pressure");
assert.equal(fingerprint.pressureShare, 55, "decision fingerprint should calculate pressure share");

const counterfactuals = getCounterfactualReport(
  [{
    nodeId: "briefing",
    choiceId: "slow",
    title: "브리핑",
    choice: "느린 선택",
    resourcesBefore: riskyResources,
  }],
  {
    briefing: {
      choices: [
        { id: "slow", label: "느린 선택", effect: { time: 8, capital: 4 } },
        { id: "fast", label: "빠른 선택", effect: { time: -12, capital: 10, fatigue: 8 } },
      ],
    },
  },
);
assert.equal(counterfactuals.length, 1, "counterfactual report should include comparable scenes");
assert.equal(counterfactuals[0].actual.id, "slow", "counterfactual report should identify the actual choice");
assert.equal(counterfactuals[0].safest.id, "slow", "counterfactual report should identify the safest alternative");
assert.equal(counterfactuals[0].actualWasSafest, true, "counterfactual report should flag safest actual choices");

const leaderboard = buildLeaderboard([
  {
    session_code: "ALPHA",
    player_name: "첫 분석관",
    case_id: "case01",
    case_title: "CASE 01",
    summary: { rank: "A", momentumScore: 72, primary: ["responsibility", 4], averageResponseTime: 18, freeCount: 1 },
  },
  {
    session_code: "ALPHA",
    player_name: "첫 분석관",
    case_id: "final",
    case_title: "FINAL",
    summary: { rank: "S", momentumScore: 88, primary: ["curiosity", 5], averageResponseTime: 21, freeCount: 2 },
  },
  {
    session_code: "BETA",
    player_name: "두 번째 분석관",
    case_id: "case02",
    case_title: "CASE 02",
    summary: { rank: "A", momentumScore: 80, primary: ["trust", 4], averageResponseTime: 15, freeCount: 0 },
  },
]);
assert.equal(leaderboard.length, 2, "leaderboard should keep one best run per session");
assert.equal(leaderboard[0].sessionCode, "ALPHA", "leaderboard should sort by momentum score");
assert.equal(leaderboard[0].position, 1, "leaderboard should assign positions");
assert.match(getLeaderboardHeadline(leaderboard).title, /첫 분석관/, "leaderboard headline should name the leader");

const gameplayStats = getGameplayStats(
  [
    {
      freeText: "",
      challenge: { matched: true },
      resourcesBefore: riskyResources,
      resourcesAfter: recoveredResources,
    },
    {
      freeText: "이해관계자를 다시 묶어 조건부 협상안을 제안한다.",
      challenge: { matched: true },
      resourcesBefore: recoveredResources,
      resourcesAfter: { ...recoveredResources, fatigue: 24 },
    },
    {
      freeText: "",
      challenge: { matched: false },
      resourcesBefore: initialResources,
      resourcesAfter: initialResources,
    },
  ],
  getRiskPressure(initialResources),
);

assert.equal(gameplayStats.freeCount, 1, "free text count should be tracked");
assert.equal(gameplayStats.reducedRiskCount, 1, "risk reductions should be tracked");
assert.equal(gameplayStats.challengeClearCount, 2, "cleared scene challenges should be tracked");
assert.equal(gameplayStats.currentChallengeStreak, 0, "failed latest challenge should reset streak");
assert.equal(gameplayStats.momentumTier, "FLOW", "sample gameplay should reach FLOW momentum");
assert.equal(gameplayStats.rank, "A", "sample gameplay should map to A rank");

const caseSummary = createCaseSummary(
  { responsibility: 3, protection: 1 },
  { persistence: 2, risk: 5 },
  [
    {
      title: "빠른 결정",
      responseTimeSec: 8,
      freeText: "",
      challenge: { matched: false },
      resourcesBefore: initialResources,
      resourcesAfter: initialResources,
    },
    {
      title: "오래 고민한 결정",
      responseTimeSec: 24,
      freeText: "조건부 협상으로 이해관계자를 다시 묶는다.",
      challenge: { matched: true },
      resourcesBefore: riskyResources,
      resourcesAfter: recoveredResources,
    },
  ],
  { resources: recoveredResources, schemaVersion: SAVE_SCHEMA_VERSION, includeLongestDecision: true },
);

assert.equal(caseSummary.schemaVersion, SAVE_SCHEMA_VERSION, "case summary should keep schema version");
assert.deepEqual(caseSummary.primary, ["responsibility", 3], "case summary should track primary trigger");
assert.deepEqual(caseSummary.thinking, ["risk", 5], "case summary should track strongest cognition");
assert.equal(caseSummary.freeCount, 1, "case summary should include gameplay stats");
assert.equal(caseSummary.averageResponseTime, 16, "case summary should average response time");
assert.equal(
  caseSummary.longestDecision.title,
  "오래 고민한 결정",
  "case summary should optionally include longest decision",
);

assert.deepEqual(
  getGameplayStats(),
  {
    freeCount: 0,
    reducedRiskCount: 0,
    challengeClearCount: 0,
    currentChallengeStreak: 0,
    momentumScore: 0,
    momentumTier: "BUILDING",
    rank: "C",
  },
  "empty gameplay stats should stay stable",
);

assert.equal(
  speechifyChoice({ label: "조건을 다시 설계한다" }),
  "조건을 다시 설계하겠습니다.",
  "choice labels should be converted into spoken lines",
);

const sensitiveText = "담당자는 test@example.com, 010-1234-5678, 플로우온테크에 공유한다.";
assert.deepEqual(
  detectPrivacySignals(sensitiveText)
    .filter((signal) => signal.active)
    .map((signal) => signal.label),
  ["이메일", "전화번호", "회사·조직명"],
  "privacy detector should flag direct identifiers",
);
assert.equal(
  anonymizeSensitiveText(sensitiveText),
  "담당자는 익명 이메일, 익명 연락처, 익명 조직에 공유한다.",
  "privacy anonymizer should replace direct identifiers",
);
assert.equal(
  anonymizeSensitiveText("주식회사 세림과 (주)하람에 확인한다."),
  "익명 조직과 익명 조직에 확인한다.",
  "privacy anonymizer should remove organization names after company prefixes",
);
assert.deepEqual(
  detectPrivacySignals("주식회사 세림과 회의했다.")
    .filter((signal) => signal.active)
    .map((signal) => signal.label),
  ["회사·조직명"],
  "privacy detector should flag prefixed organization names",
);
assert.deepEqual(
  detectPrivacySignals("회사 정책과 전자 문서를 다시 검토한다.")
    .filter((signal) => signal.active)
    .map((signal) => signal.label),
  [],
  "privacy detector should not flag generic business terms as organizations",
);
assert.equal(
  anonymizeSensitiveText("회사 정책과 전자 문서를 다시 검토한다."),
  "회사 정책과 전자 문서를 다시 검토한다.",
  "privacy anonymizer should keep generic business terms unchanged",
);
assert.equal(limitText("abcdef", 3), "abc", "text limiter should truncate long input");
assert.equal(limitText("abcdef", 0), "", "text limiter should return empty text for invalid limits");

console.log("Smoke tests passed");
