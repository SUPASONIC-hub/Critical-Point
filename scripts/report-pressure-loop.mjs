import assert from "node:assert/strict";
import { CASE_SEQUENCE, getCaseRouteLength } from "../src/gameData.js";
import {
  DYNAMICS_INITIAL_STATE,
  reduceDecisionDynamics,
} from "../src/state/decisionDynamics.js";

const STYLE_PROFILES = {
  cautious: {
    seconds: [24, 41],
    pushWeights: [0.62, 0.28, 0.08, 0.02, 0, 0],
    challengeChance: 0.7,
    riskDelta: [-2, 3],
  },
  balanced: {
    seconds: [12, 34],
    pushWeights: [0.18, 0.34, 0.27, 0.14, 0.05, 0.02],
    challengeChance: 0.58,
    riskDelta: [-1, 5],
  },
  aggressive: {
    seconds: [8, 30],
    pushWeights: [0.08, 0.2, 0.31, 0.23, 0.13, 0.05],
    challengeChance: 0.46,
    riskDelta: [0, 8],
  },
  erratic: {
    seconds: [0, 42],
    pushWeights: [0.22, 0.2, 0.19, 0.16, 0.13, 0.1],
    challengeChance: 0.5,
    riskDelta: [-3, 9],
  },
};

const SEASONS_PER_STYLE = 900;
const seasonWindows = CASE_SEQUENCE.reduce((total, caseId) => total + getCaseRouteLength(caseId), 0);

function createRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value = Math.imul(value, 1664525) + 1013904223 >>> 0;
    return value / 0x100000000;
  };
}

function pickWeighted(random, weights) {
  const roll = random();
  let cursor = 0;
  for (let index = 0; index < weights.length; index += 1) {
    cursor += weights[index];
    if (roll <= cursor) return index;
  }
  return weights.length - 1;
}

function integerBetween(random, [min, max]) {
  return Math.round(min + random() * (max - min));
}

function percentile(values, ratio) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.floor((sorted.length - 1) * ratio)));
  return sorted[index];
}

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
}

function summarize(values) {
  return {
    avg: Number(average(values).toFixed(2)),
    p50: Number(percentile(values, 0.5).toFixed(2)),
    p90: Number(percentile(values, 0.9).toFixed(2)),
    p95: Number(percentile(values, 0.95).toFixed(2)),
  };
}

function simulateStyle(styleName, profile) {
  const windows = [];
  const seasons = [];
  for (let season = 0; season < SEASONS_PER_STYLE; season += 1) {
    const random = createRandom((season + 1) * 2654435761 ^ styleName.length * 8191);
    let state = DYNAMICS_INITIAL_STATE;
    let seasonBusts = 0;
    let seasonBestMultiplier = 1;
    let seasonBanked = 0;

    for (let window = 0; window < seasonWindows; window += 1) {
      state = reduceDecisionDynamics(state, { type: "DECISION_STARTED", score: state.score });
      const seconds = integerBetween(random, profile.seconds);
      state = reduceDecisionDynamics(state, { type: "DECISION_TICK", seconds });
      const pushes = pickWeighted(random, profile.pushWeights);
      for (let press = 0; press < pushes; press += 1) {
        state = reduceDecisionDynamics(state, { type: "PUSH_HELD" });
      }

      const stressBeforeCommit = state.stressLevel;
      const multiplierBeforeCommit = state.rewardMultiplier;
      const challengeMatch = random() < profile.challengeChance;
      const riskDelta = integerBetween(random, profile.riskDelta);
      state = reduceDecisionDynamics(state, {
        type: "CHOICE_COMMITTED",
        challengeMatch,
        riskDelta,
        seconds,
        score: state.score,
      });

      if (state.thresholdState === "bust") seasonBusts += 1;
      seasonBestMultiplier = Math.max(seasonBestMultiplier, multiplierBeforeCommit, state.rewardMultiplier);
      seasonBanked = state.banked;
      windows.push({
        stressBeforeCommit,
        multiplierBeforeCommit,
        busted: state.thresholdState === "bust",
        combo: state.combo,
        wallDebt: state.wallDebt,
        pushes,
        seconds,
      });
    }

    seasons.push({
      busts: seasonBusts,
      bestMultiplier: seasonBestMultiplier,
      banked: seasonBanked,
      finalWallDebt: state.wallDebt,
      finalCombo: state.combo,
      rebootCount: state.rebootCount,
    });
  }

  const bustRate = windows.filter((window) => window.busted).length / windows.length;
  const criticalRate = windows.filter((window) => window.stressBeforeCommit >= 70).length / windows.length;
  const overheatRate = windows.filter((window) => window.stressBeforeCommit >= 90).length / windows.length;
  return {
    styleName,
    windows: windows.length,
    bustRate,
    criticalRate,
    overheatRate,
    stress: summarize(windows.map((window) => window.stressBeforeCommit)),
    multiplier: summarize(windows.map((window) => window.multiplierBeforeCommit)),
    combo: summarize(windows.map((window) => window.combo)),
    wallDebt: summarize(windows.map((window) => window.wallDebt)),
    pushes: summarize(windows.map((window) => window.pushes)),
    seasonBusts: summarize(seasons.map((season) => season.busts)),
    seasonBestMultiplier: summarize(seasons.map((season) => season.bestMultiplier)),
    seasonBanked: summarize(seasons.map((season) => season.banked)),
    finalWallDebt: summarize(seasons.map((season) => season.finalWallDebt)),
  };
}

function percent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function printReport(results) {
  console.log(`Pressure loop report: ${SEASONS_PER_STYLE} seasons/style, ${seasonWindows} windows/season`);
  for (const result of results) {
    console.log(`\n${result.styleName.toUpperCase()}`);
    console.log(`  bust rate: ${percent(result.bustRate)} | critical: ${percent(result.criticalRate)} | overheat: ${percent(result.overheatRate)}`);
    console.log(`  stress avg/p50/p90/p95: ${result.stress.avg}/${result.stress.p50}/${result.stress.p90}/${result.stress.p95}`);
    console.log(`  multiplier avg/p50/p90/p95: ${result.multiplier.avg}/${result.multiplier.p50}/${result.multiplier.p90}/${result.multiplier.p95}`);
    console.log(`  combo avg/p50/p90/p95: ${result.combo.avg}/${result.combo.p50}/${result.combo.p90}/${result.combo.p95}`);
    console.log(`  season busts avg/p50/p90/p95: ${result.seasonBusts.avg}/${result.seasonBusts.p50}/${result.seasonBusts.p90}/${result.seasonBusts.p95}`);
    console.log(`  season banked avg/p50/p90/p95: ${result.seasonBanked.avg}/${result.seasonBanked.p50}/${result.seasonBanked.p90}/${result.seasonBanked.p95}`);
    console.log(`  final wall debt avg/p50/p90/p95: ${result.finalWallDebt.avg}/${result.finalWallDebt.p50}/${result.finalWallDebt.p90}/${result.finalWallDebt.p95}`);
  }
}

function assertGuardrails(results) {
  const byStyle = Object.fromEntries(results.map((result) => [result.styleName, result]));
  assert.ok(byStyle.cautious.bustRate < byStyle.balanced.bustRate, "cautious play should bust less often than balanced play");
  assert.ok(byStyle.balanced.bustRate < byStyle.aggressive.bustRate, "balanced play should bust less often than aggressive play");
  assert.ok(byStyle.aggressive.bustRate < 0.42, "aggressive play should stay risky, not unwinnable");
  assert.ok(byStyle.cautious.bustRate > 0.005, "cautious play should still feel the wall sometimes");
  assert.ok(byStyle.balanced.criticalRate > 0.08, "balanced play should reach visible critical pressure");
  assert.ok(byStyle.balanced.criticalRate < 0.45, "balanced play should not live in critical pressure");
  assert.ok(byStyle.aggressive.multiplier.p90 > byStyle.balanced.multiplier.p90, "aggressive play should buy a larger pot");
  assert.ok(byStyle.erratic.finalWallDebt.p50 <= 3, "erratic play should not pin most seasons at fatal debt");
}

const results = Object.entries(STYLE_PROFILES).map(([styleName, profile]) => simulateStyle(styleName, profile));
printReport(results);
assertGuardrails(results);
console.log("\nPressure loop guardrails passed.");
