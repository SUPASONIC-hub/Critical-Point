import { applyEffect, getDiscoveryClue, getFreeTextSignals, getRiskPressure } from "../gameLogic.js";
import { useState } from "react";

export function useDecision() {
  const [pendingChoice, setPendingChoice] = useState(null);
  const [decisionReveal, setDecisionReveal] = useState(null);
  const [decisionSeconds, setDecisionSeconds] = useState(45);

  return {
    pendingChoice,
    setPendingChoice,
    decisionReveal,
    setDecisionReveal,
    decisionSeconds,
    setDecisionSeconds,
  };
}

/**
 * Builds the per-render readers that score a choice before it is committed:
 * challenge match, tactical read, flow surge, clue reveal and the combined
 * "effective read" the play screen and the commit console both use.
 *
 * These were inline closures in App(); the behaviour is unchanged, the state
 * they read is now passed in explicitly instead of captured.
 */
export function createChoiceReaders({
  sceneChallenge,
  resources,
  log,
  riskPressure,
  discoveredClues,
  currentCase,
  cognition,
  freeText,
  currentChallengeStreak,
  evidenceCount,
  resourceMeta,
}) {
  function getChallengeMatch(choice, riskDelta) {
    if (sceneChallenge.id === "protect-trust" && (choice.effect?.trust ?? 0) > 0) return "신뢰 회복 후보";
    if (sceneChallenge.id === "repair-legitimacy" && (choice.effect?.legitimacy ?? 0) > 0) return "정당성 회복 후보";
    if (sceneChallenge.id === "lower-risk" && riskDelta < 0) return "챌린지 후보";
    if (sceneChallenge.id === "avoid-risk" && riskDelta <= 0) return "챌린지 후보";
    if (sceneChallenge.id === "find-cost" && Object.values(choice.effect ?? {}).some((value) => value < 0)) {
      return "비용 확인됨";
    }
    return "";
  }

  function getTacticalRead(choice, riskDelta, challengeMatch) {
    const effectEntries = Object.entries(choice.effect ?? {}).filter(([, value]) => value !== 0);
    const biggestCost = effectEntries
      .filter(([, value]) => value < 0)
      .sort((a, b) => a[1] - b[1])[0];
    const biggestGain = effectEntries
      .filter(([, value]) => value > 0)
      .sort((a, b) => b[1] - a[1])[0];
    const cognitionGain = Object.values(choice.cognition ?? {}).reduce((sum, value) => sum + value, 0);
    const grade =
      challengeMatch && riskDelta < 0
        ? "S"
        : challengeMatch || riskDelta < 0
          ? "A"
          : riskDelta === 0 && cognitionGain >= 2
            ? "B"
            : riskDelta <= 6
              ? "C"
              : "D";
    const gradeText = {
      S: "브레이크스루",
      A: "공략 후보",
      B: "안정 전개",
      C: "대가 있는 선택",
      D: "고위험 도박",
    }[grade];
    const reward =
      challengeMatch
        ? "챌린지 적중"
        : riskDelta < 0
          ? "위험 압력 하락"
          : riskDelta === 0
            ? "압력 유지"
            : `위험 압력 +${riskDelta}`;
    const cost = biggestCost
      ? `${resourceMeta[biggestCost[0]]?.label ?? biggestCost[0]} ${biggestCost[1]}`
      : "즉시 손실 낮음";
    const gain = biggestGain
      ? `${resourceMeta[biggestGain[0]]?.label ?? biggestGain[0]} +${biggestGain[1]}`
      : cognitionGain > 0
        ? `사고 가속 +${cognitionGain}`
        : "관망";

    return { grade, gradeText, reward, cost, gain };
  }

  function describeForecast(forecast) {
    if (evidenceCount === 0) return "??";
    const direction = forecast.riskDelta > 0 ? "위험 ↑" : forecast.riskDelta < 0 ? "위험 ↓" : "위험 유지";
    if (evidenceCount < 3) return direction;
    return `${direction} · ${formatResourceDelta(forecast.biggestGain)} / ${formatResourceDelta(forecast.biggestCost)}`;
  }

  function mergeEffects(...effects) {
    return effects.reduce((merged, effect = {}) => {
      Object.entries(effect).forEach(([key, value]) => {
        merged[key] = (merged[key] ?? 0) + value;
      });
      return merged;
    }, {});
  }

  function getFlowSurge(tacticalRead, challengeMatch, riskDelta) {
    if (currentChallengeStreak >= 4 && challengeMatch) {
      return {
        label: "PERFECT RUN",
        text: "다섯 번째 연속 공략이 맞물렸습니다. 팀의 신뢰와 정당성이 최고 흐름에 들어갑니다.",
        effect: { trust: 3, legitimacy: 3, fatigue: -3 },
      };
    }
    if (currentChallengeStreak >= 2 && challengeMatch) {
      return {
        label: "STREAK BREAKTHROUGH",
        text: "세 번째 연속 공략이 맞물렸습니다. 팀의 신뢰가 붙고 판단 피로가 회복됩니다.",
        effect: { trust: 2, legitimacy: 2, fatigue: -2 },
      };
    }
    if (tacticalRead.grade === "S") {
      return {
        label: "FLOW SURGE",
        text: "챌린지와 위험 제어가 동시에 맞물려 회의실의 지지가 붙었습니다.",
        effect: { trust: 2, legitimacy: 2, fatigue: -3 },
      };
    }
    if (tacticalRead.grade === "A" && challengeMatch) {
      return {
        label: "CHALLENGE SURGE",
        text: "장면 목표를 정확히 찔러 다음 선택의 피로가 줄었습니다.",
        effect: { trust: 1, legitimacy: 1, fatigue: -2 },
      };
    }
    if (riskDelta < 0) {
      return {
        label: "PRESSURE DROP",
        text: "위험 압력을 낮춘 덕분에 판단 여력이 조금 회복됐습니다.",
        effect: { fatigue: -1 },
      };
    }
    return null;
  }

  function getClueReveal(challengeMatch, riskDelta, responseTimeSec) {
    const clue = getDiscoveryClue({
      currentCase,
      challengeMatch,
      riskDelta,
      responseTimeSec,
      logLength: log.length,
    });
    return clue && !discoveredClues.some((item) => item.id === clue.id) ? clue : null;
  }

  function getEffectiveChoiceRead(choice, baseEffect, cognitiveEffect) {
    const baseResources = applyEffect(resources, baseEffect);
    const baseRiskDelta = getRiskPressure(baseResources) - riskPressure;
    const challengeMatch =
      choice.type === "free"
        ? sceneChallenge.id === "use-reframe" && getFreeTextSignals(freeText).filter((signal) => signal.active).length >= 2
        : Boolean(getChallengeMatch(choice, baseRiskDelta));
    const tacticalRead = getTacticalRead(
      { ...choice, effect: baseEffect, cognition: cognitiveEffect },
      baseRiskDelta,
      challengeMatch,
    );
    const flowSurge = getFlowSurge(tacticalRead, challengeMatch, baseRiskDelta);
    const finalEffect = flowSurge ? mergeEffects(baseEffect, flowSurge.effect) : baseEffect;
    const finalResources = applyEffect(resources, finalEffect);
    const finalRiskDelta = getRiskPressure(finalResources) - riskPressure;

    return {
      baseRiskDelta,
      challengeMatch,
      tacticalRead,
      flowSurge,
      finalEffect,
      finalResources,
      finalRiskDelta,
    };
  }

  return {
    getChallengeMatch,
    getTacticalRead,
    describeForecast,
    mergeEffects,
    getFlowSurge,
    getClueReveal,
    getEffectiveChoiceRead,
  };
}
