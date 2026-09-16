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
