import { costWhenRising } from "../gameData.js";

export function isChoiceEffectGain(key, value) {
  return costWhenRising.has(key) ? value < 0 : value > 0;
}

/**
 * What confirming this choice locks in, in words rather than numbers.
 *
 * The commit console already prints a risk forecast; the three rows here answer
 * the questions the forecast cannot -- does this hit the scene objective, what
 * happens to the streak that pays out at 3 and 5, and can it open hidden
 * evidence. Deliberately free of signed numbers: a second number column next to
 * the forecast reads as a second forecast.
 *
 * Each row carries a two-character label and a verdict short enough that all
 * three fit one line on a phone; the sentence is the long form the console
 * keeps behind its disclosure, because on mobile every visible row of the
 * console is a choice card it covers.
 */
export function createDecisionTargetLock({
  pendingChoiceRead,
  sceneChallenge,
  currentChallengeStreak = 0,
  hiddenEvidenceCandidate = null,
} = {}) {
  if (!pendingChoiceRead || !sceneChallenge) return null;

  const objectiveMatched = Boolean(pendingChoiceRead.challengeMatch);
  const nextStreak = objectiveMatched ? currentChallengeStreak + 1 : 0;
  const rewardArmed = objectiveMatched && (nextStreak === 3 || nextStreak === 5);
  const chasingFullRun = currentChallengeStreak >= 3;

  return {
    objective: {
      tone: objectiveMatched ? "locked" : "miss",
      label: "목표",
      value: objectiveMatched ? "LOCKED" : "OFF TARGET",
      text: objectiveMatched
        ? `${sceneChallenge.title} 방향과 맞습니다.`
        : `${sceneChallenge.title} 방향을 벗어납니다.`,
    },
    streak: {
      tone: rewardArmed ? "reward" : objectiveMatched ? "locked" : currentChallengeStreak > 0 ? "miss" : "neutral",
      label: "연속",
      value: rewardArmed ? "PAYOUT READY" : objectiveMatched ? "CHAIN HOLDS" : currentChallengeStreak > 0 ? "CHAIN BREAKS" : "NO CHAIN",
      text: rewardArmed
        ? "확정하면 연속 보상이 즉시 붙습니다."
        : objectiveMatched
          ? `보상 궤도 유지, ${chasingFullRun ? "완주 목표" : "다음 목표"}까지 이어집니다.`
          : currentChallengeStreak > 0
            ? "확정하면 현재 연속 목표가 끊깁니다."
            : "아직 이어지는 연속 목표가 없습니다.",
    },
    evidence: {
      tone: hiddenEvidenceCandidate ? "reward" : objectiveMatched ? "locked" : "neutral",
      label: "증거",
      value: hiddenEvidenceCandidate ? "CAN OPEN" : objectiveMatched ? "ELIGIBLE" : "NO SIGNAL",
      text: hiddenEvidenceCandidate
        ? "숨은 단서 발견 조건을 충족합니다."
        : objectiveMatched
          ? "숨은 단서 발견에 기여할 수 있습니다."
          : "숨은 단서 발견 신호는 없습니다.",
    },
  };
}

export function formatChoiceEffectChip([key, value], resourceMeta) {
  const steps = Math.abs(value) >= 8 ? 3 : Math.abs(value) >= 4 ? 2 : 1;
  const mark = (isChoiceEffectGain(key, value) ? "▲" : "▼").repeat(steps);
  return `${resourceMeta[key]?.label ?? key} ${value > 0 ? "상승" : "소모"} ${mark}`;
}

export function getChoiceAuthorityImpact(choice) {
  const choiceText = `${choice.id} ${choice.label}`;
  if (/protect|people|witness|person|사람|보호|증언/.test(choiceText)) {
    return "권한 영향: 보호 절차를 열고 현장의 발언권을 넓힙니다.";
  }
  if (/expose|public|report|disclosure|공개|폭로|보고/.test(choiceText)) {
    return "권한 영향: 기록 공개 범위를 넓히지만 조직의 반발을 부릅니다.";
  }
  if (/isolate|stop|seal|destroy|차단|중단|폐기|잠금/.test(choiceText)) {
    return "권한 영향: 접근을 줄여 피해를 막지만 확인되지 않은 목소리도 닫힙니다.";
  }
  if (/system|redesign|reform|구조|개편|재설계/.test(choiceText)) {
    return "권한 영향: 당장의 결론보다 다음 운영 기준에 개입합니다.";
  }
  return "권한 영향: 이 선택의 흔적이 다음 챕터의 조사 기준으로 남습니다.";
}

export function getChoiceRouteBadge(choice) {
  if (choice.continuityMemory) {
    return { label: "MEMORY ROUTE", text: "이전 사건의 선택 로그가 만든 추가 선택지" };
  }
  if (String(choice.id ?? "").includes("evidence_turn")) {
    return { label: "EVIDENCE TURN", text: "발견한 증거가 질문의 전제를 바꾸는 선택지" };
  }
  if (choice.requiredAuthority === "OVERSIGHT") {
    return { label: "OVERSIGHT", text: "감독 권한으로만 열리는 선택지" };
  }
  if (choice.requiredAuthority === "FIELD ACCESS") {
    return { label: "FIELD ACCESS", text: "증거 또는 신뢰가 충분해야 열리는 선택지" };
  }
  if (choice.adaptive) {
    return { label: "ADAPTIVE", text: "자유응답 기록이 만든 추가 선택지" };
  }
  if (choice.routeSplit || choice.branchId) {
    return { label: "ROUTE SPLIT", text: "다른 질문 경로로 갈라지는 선택지" };
  }
  return null;
}
