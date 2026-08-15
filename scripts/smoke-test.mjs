import assert from "node:assert/strict";

import {
  anonymizeSensitiveText,
  applyEffect,
  createDecisionForecast,
  createCaseSummary,
  getCounterfactualReport,
  getDecisionFingerprint,
  getDecisionLedger,
  detectPrivacySignals,
  getGameplayStats,
  getRiskPressure,
  getRiskPressureDrivers,
  limitText,
  speechifyChoice,
} from "../src/gameLogic.js";
import {
  FEEDBACK_COMMENT_MAX_LENGTH,
  FREE_TEXT_MAX_LENGTH,
  SAVE_SCHEMA_VERSION,
  STORAGE_KEY,
} from "../src/appConfig.js";
import { initialResources } from "../src/gameData.js";

assert.equal(STORAGE_KEY, "trigger-prototype-v2", "storage key should stay on the v2 namespace");
assert.equal(SAVE_SCHEMA_VERSION, 2, "save schema version should match exported log format");
assert.equal(FREE_TEXT_MAX_LENGTH, 600, "free text should keep a bounded log length");
assert.equal(FEEDBACK_COMMENT_MAX_LENGTH, 600, "feedback comments should keep a bounded log length");

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
