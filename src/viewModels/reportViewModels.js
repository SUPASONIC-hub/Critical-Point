/**
 * Derived report state: the ending framing, the score rows, the badges and the
 * storage banner. All of it is a pure read of a finished run.
 */

export function createEndingProfile({ finalEndingEntry }) {
  return {
  ending_seal: {
    tag: "봉인",
    title: "당신은 문을 닫았지만, 흔적은 남겼다.",
    text: "데이터를 봉인해 다시 이용되지 않게 했습니다. 그러나 마지막 후폭풍에서 고른 태도는 당신이 지키려는 것이 침묵인지 안전인지 드러냈습니다.",
  },
  ending_reform: {
    tag: "개혁",
    title: "당신은 실험을 규칙으로 바꾸었다.",
    text: "트리거를 없애는 대신 동의와 감시를 붙였습니다. 사람을 읽는 힘을 누가, 언제, 어디까지 쓸 수 있는지 직접 정했습니다.",
  },
  ending_expose: {
    tag: "폭로",
    title: "당신은 관찰자를 세상 밖으로 끌어냈다.",
    text: "실험의 구조를 공개했습니다. 혼란은 시작됐지만, 적어도 다음 참가자는 자신이 관찰당하고 있다는 사실을 알고 선택할 수 있습니다.",
  },
  }[finalEndingEntry?.choiceId] ?? {
  tag: "미확정",
  title: "당신의 마지막 선택은 아직 기록 중이다.",
  text: "마지막 폴더의 문장이 완전히 닫히지 않았습니다. 다음 플레이에서는 다른 결말의 조건을 시험해 보십시오.",
  };
}

export function createScoreBreakdown({ cognitionScore, consistencyScore, exploitPenalty, pressureAdaptScore, reflectionScore, rhythmScore }) {
  return [
  {
    label: "기준 유지",
    value: consistencyScore,
    text: `${consistencyScore}점`,
    note: "압박이 올라간 장면에서도 같은 방향을 지켰는지 봅니다. 버스트 점수에서 가장 큰 몫입니다.",
  },
  {
    label: "사고 리듬",
    value: rhythmScore,
    text: `${rhythmScore}점`,
    note: "즉답이나 방치가 아니라, 압박을 읽고 결론까지 밀어낸 시간대입니다. 점수 비중은 가장 작습니다.",
  },
  {
    label: "관점 전환",
    value: cognitionScore,
    text: `${cognitionScore}점`,
    note: "같은 방식만 반복하지 않고 추론, 위험, 재구성, 버티기 사이를 오간 흔적입니다.",
  },
  {
    label: "압박 대응",
    value: pressureAdaptScore,
    text: `${pressureAdaptScore}점`,
    note: "위험을 무조건 피한 점수가 아니라, 상승한 압박을 다시 회수한 능력입니다.",
  },
  {
    label: "구조 재설계",
    value: reflectionScore,
    text: `${reflectionScore}점`,
    note: "선택지 밖에서 이해관계자, 조건, 근거, 실패 가능성을 구체화한 정도입니다.",
  },
  {
    label: "즉답 패널티",
    value: exploitPenalty,
    text: exploitPenalty > 0 ? `-${exploitPenalty}점` : "없음",
    note: "표시된 정보만 따라 빠르게 누르는 플레이가 반복될 때만 감점됩니다.",
  },
  ];
}

export function createAchievementBadges({ challengeClearCount, currentChallengeStreak, flowSurgeCount, momentumScore, momentumTier, reducedRiskCount, result, riskTier }) {
  return [
  { title: `Burst ${momentumTier}`, text: `사고 버스트 ${momentumScore}점을 기록했습니다.` },
  result.freeCount > 0
    ? { title: "Board Breaker", text: "선택지 밖에서 판을 다시 짰습니다." }
    : { title: "Route Follower", text: "주어진 선택지 안에서 비용을 비교했습니다." },
  result.averageResponseTime >= 20
    ? { title: "Slow Thinker", text: "한 장면 이상에서 판단을 오래 붙잡았습니다." }
    : { title: "Fast Closer", text: "빠르게 결론을 닫는 플레이를 보였습니다." },
  reducedRiskCount > 0
    ? { title: "Risk Cutter", text: `${reducedRiskCount}번 위험 압력을 낮췄습니다.` }
    : { title: "Heat Taker", text: "위험을 낮추기보다 다른 목표를 우선했습니다." },
  challengeClearCount > 0
    ? { title: "Challenge Clear", text: `${challengeClearCount}개 장면 도전을 달성했습니다.` }
    : { title: "Open Quest", text: "장면 도전은 남았고, 선택 로그만 기록됐습니다." },
  currentChallengeStreak >= 5
    ? { title: "Perfect Run", text: `${currentChallengeStreak}연속 장면 목표를 맞혀 최고 보상을 열었습니다.` }
    : currentChallengeStreak >= 3
    ? { title: "Streak Breakthrough", text: `${currentChallengeStreak}연속 장면 목표를 맞혀 추가 보상을 열었습니다.` }
    : { title: "Chain Starter", text: "장면 목표를 연속으로 맞히면 추가 보상이 열립니다." },
  flowSurgeCount > 0
    ? { title: "Flow Surge", text: `${flowSurgeCount}번 보너스 자원 회복을 만들었습니다.` }
    : { title: "No Surge", text: "챌린지와 위험 제어가 아직 보너스로 이어지지 않았습니다." },
  riskTier === "CRITICAL"
    ? { title: "Crisis Runner", text: "높은 압력 상태로 케이스를 통과했습니다." }
    : { title: "Pressure Keeper", text: "위험 압력을 통제 가능한 범위에 묶었습니다." },
  ];
}

export function createTelemetrySummary({ dataConsent, isOnline, telemetryEnabled }) {
  return !isOnline
  ? {
      tone: "local",
      title: "오프라인",
      text: "연결이 복구되면 원격 저장을 다시 사용할 수 있습니다. 현재 기록은 브라우저에 저장됩니다.",
    }
  : telemetryEnabled
  ? dataConsent
    ? {
        tone: "ready",
        title: "원격 저장 준비됨",
        text: "케이스 완료와 피드백 제출 시 동의한 기록만 원격 저장합니다.",
      }
    : {
        tone: "pending",
        title: "원격 저장 준비됨 · 동의 대기",
        text: "체크박스에 동의하면 이 세션의 완료 로그와 피드백을 원격 저장합니다.",
      }
  : {
      tone: "local",
      title: "로컬 저장",
      text: "원격 저장 설정이 없어 브라우저 저장과 JSON 내보내기만 사용합니다.",
  };
}
