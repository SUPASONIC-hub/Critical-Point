import assert from "node:assert/strict";

import {
  anonymizeSensitiveText,
  applyEffect,
  createCaseSummary,
  detectPrivacySignals,
  getGameplayStats,
  getRiskPressure,
  speechifyChoice,
} from "../src/gameLogic.js";
import { SAVE_SCHEMA_VERSION, STORAGE_KEY } from "../src/appConfig.js";
import { initialResources } from "../src/gameData.js";

assert.equal(STORAGE_KEY, "trigger-prototype-v2", "storage key should stay on the v2 namespace");
assert.equal(SAVE_SCHEMA_VERSION, 2, "save schema version should match exported log format");

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
  applyEffect({ ...initialResources, time: 70, fatigue: 98 }, { time: 10, fatigue: 8 }),
  { ...initialResources, time: 72, fatigue: 100 },
  "resource effects should clamp to resource caps",
);

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

console.log("Smoke tests passed");
