import { characterProfiles, choiceSubtexts, choiceVoiceLines, echoReplies } from "./gameData.js";

export const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value));

export function applyEffect(resources, effect = {}) {
  const next = { ...resources };
  Object.entries(effect).forEach(([key, value]) => {
    const max = key === "time" ? 72 : 100;
    next[key] = clamp((next[key] ?? 0) + value, 0, max);
  });
  return next;
}

const riskDefaults = {
  time: 72,
  capital: 100,
  humanCost: 0,
  fatigue: 0,
};

export function getRiskPressure(resources = {}) {
  const nextResources = { ...riskDefaults, ...resources };
  return Math.round(
    Math.max(0, 72 - nextResources.time) * 0.3 +
      (100 - nextResources.capital) * 0.25 +
      nextResources.humanCost * 0.25 +
      nextResources.fatigue * 0.2,
  );
}

export function getRiskPressureDrivers(resources = {}) {
  const nextResources = { ...riskDefaults, ...resources };
  const drivers = [
    {
      id: "time",
      label: "시간 부족",
      value: Math.max(0, 72 - nextResources.time),
      pressure: Math.max(0, 72 - nextResources.time) * 0.3,
    },
    {
      id: "capital",
      label: "현금 압박",
      value: Math.max(0, 100 - nextResources.capital),
      pressure: Math.max(0, 100 - nextResources.capital) * 0.25,
    },
    {
      id: "humanCost",
      label: "인적 비용",
      value: nextResources.humanCost,
      pressure: nextResources.humanCost * 0.25,
    },
    {
      id: "fatigue",
      label: "판단 피로",
      value: nextResources.fatigue,
      pressure: nextResources.fatigue * 0.2,
    },
  ];

  return drivers
    .map((driver) => ({ ...driver, pressure: Math.round(driver.pressure) }))
    .sort((a, b) => b.pressure - a.pressure);
}

export function getSuspenseState({ riskPressure = 0, decisionSeconds = 45, log = [], currentCase = "case01" } = {}) {
  const urgency = Math.round(clamp((45 - decisionSeconds) * 0.7, 0, 32));
  const accumulated = Math.min(20, log.length * 4);
  const score = clamp(Math.round(riskPressure + urgency + accumulated), 0, 100);
  const tier = score >= 78 ? "REDLINE" : score >= 52 ? "UNSTABLE" : score >= 28 ? "WATCH" : "QUIET";
  const signals = {
    QUIET: {
      label: "SIGNAL QUIET",
      title: "아직 아무도 먼저 움직이지 않았습니다.",
      text: "조용한 장면은 안전한 장면이 아닙니다. 누군가는 이미 다음 기록을 열고 있습니다.",
      cue: "마지막으로 확인할 수 있는 전제",
    },
    WATCH: {
      label: "SIGNAL WATCH",
      title: "방 안의 숫자와 방 밖의 움직임이 어긋납니다.",
      text: "당신이 고르는 순간, 공개되지 않은 이해관계자가 다음 장면의 조건을 바꿀 수 있습니다.",
      cue: "누가 아직 말하지 않았는가",
    },
    UNSTABLE: {
      label: "SIGNAL UNSTABLE",
      title: "사건이 당신의 결정을 기다리지 않고 진행됩니다.",
      text: "한 번의 선택이 비용을 옮기는 동시에, 누군가에게 당신의 기준을 알려줍니다.",
      cue: "기록되는 것은 결과가 아니라 허용선",
    },
    REDLINE: {
      label: "SIGNAL REDLINE",
      title: "숨겨진 프로토콜이 깨어났습니다.",
      text: "이제 선택은 사건을 해결하는 명령이 아니라, 당신을 시험하는 신호로 읽힙니다.",
      cue: "다음 화면을 믿기 전에 기록을 의심할 것",
    },
  }[tier];
  const caseCode = currentCase === "final" ? "F" : currentCase.replace("case", "");
  return { score, tier, caseCode, ...signals };
}

export function getSuspenseEvent({ riskBefore = 0, riskAfter = 0, currentCase = "case01", logLength = 0 } = {}) {
  if (riskBefore < 70 && riskAfter >= 70) {
    return {
      id: "protocol-awake",
      label: "HIDDEN PROTOCOL",
      title: "당신이 임계선을 넘긴 순간, 다른 화면이 켜졌습니다.",
      text: "트리거랩은 이제 사건의 결과보다 당신이 어디까지 감수하는지를 측정합니다.",
      tone: "redline",
    };
  }
  if (riskBefore < 50 && riskAfter >= 50) {
    return {
      id: "observer-awake",
      label: "OBSERVER ONLINE",
      title: "누군가 당신의 판단을 실시간으로 읽기 시작했습니다.",
      text: "다음 장면부터는 선택지의 비용뿐 아니라, 당신이 비용을 부르는 방식까지 기록됩니다.",
      tone: "unstable",
    };
  }
  if (logLength >= 3 && riskAfter >= 42 && currentCase !== "case01") {
    return {
      id: "pattern-lock",
      label: "PATTERN LOCK",
      title: "당신의 반복 패턴이 사건의 다음 조건으로 고정됐습니다.",
      text: "방금 선택은 새 사건을 연 것이 아니라, 이미 관찰된 당신의 반응을 다시 호출했습니다.",
      tone: "watch",
    };
  }
  return null;
}

export function buildNarrativeSpine({
  caseObjective = "",
  node = {},
  log = [],
  triggerLabels = {},
  riskTier = "CONTROLLED",
  suspenseState = {},
} = {}) {
  const last = log.at(-1);
  const pressure = (node.triggers ?? []).map((trigger) => triggerLabels[trigger] ?? trigger).join(" / ");
  const previous = last
    ? `직전 장면에서 “${last.spokenChoice || last.choice || "판단"}”를 남겼습니다.`
    : caseObjective || "첫 번째 사건의 문이 열렸습니다.";
  const conflict = pressure
    ? `${pressure}이(가) ${node.phase ?? "현재 국면"}에서 충돌합니다.`
    : `${node.phase ?? "현재 국면"}의 전제가 흔들립니다.`;
  const question = node.title
    ? `${node.title}: 지금 무엇을 먼저 지킬지 결정해야 합니다.`
    : "지금 무엇을 먼저 지킬지 결정해야 합니다.";
  const consequence = suspenseState.tier === "REDLINE"
    ? "다음 선택은 사건의 결말이 아니라 당신의 허용선을 기록합니다."
    : riskTier === "CRITICAL"
      ? "비용을 숨길 수 없는 단계입니다. 한쪽을 구하면 다른 쪽이 즉시 반응합니다."
      : "이번 선택의 비용은 다음 장면의 첫 번째 질문이 됩니다.";

  return {
    turn: log.length + 1,
    previous,
    conflict,
    question,
    consequence,
  };
}

export function createDecisionForecast(choice = {}, resources = {}) {
  const beforeRisk = getRiskPressure(resources);
  const afterResources = applyEffect(resources, choice.effect);
  const afterRisk = getRiskPressure(afterResources);
  const riskDelta = afterRisk - beforeRisk;
  const effectEntries = Object.entries(choice.effect ?? {}).filter(([, value]) => value !== 0);
  const scoreDelta = ([key, value]) => (key === "humanCost" || key === "fatigue" ? -value : value);
  const biggestGain = effectEntries
    .filter((entry) => scoreDelta(entry) > 0)
    .sort((a, b) => scoreDelta(b) - scoreDelta(a))[0];
  const biggestCost = effectEntries
    .filter((entry) => scoreDelta(entry) < 0)
    .sort((a, b) => scoreDelta(a) - scoreDelta(b))[0];
  const cognitionGain = Object.values(choice.cognition ?? {}).reduce((sum, value) => sum + value, 0);

  return {
    choiceId: choice.id,
    beforeRisk,
    afterRisk,
    riskDelta,
    afterResources,
    biggestGain,
    biggestCost,
    cognitionGain,
    pressureDrivers: getRiskPressureDrivers(afterResources).slice(0, 2),
  };
}

export function getGameplayStats(entries = [], fallbackRiskPressure = 0) {
  const freeCount = entries.filter((entry) => entry.freeText).length;
  const reducedRiskCount = entries.filter(
    (entry) =>
      entry.resourcesBefore &&
      entry.resourcesAfter &&
      getRiskPressure(entry.resourcesAfter) < getRiskPressure(entry.resourcesBefore),
  ).length;
  const challengeClearCount = entries.filter((entry) => entry.challenge?.matched).length;
  const streakBreakIndex = [...entries].reverse().findIndex((entry) => !entry.challenge?.matched);
  const currentChallengeStreak =
    streakBreakIndex === -1 ? entries.length : Math.max(0, streakBreakIndex);
  const finalRiskPressure = entries.at(-1)?.resourcesAfter
    ? getRiskPressure(entries.at(-1).resourcesAfter)
    : fallbackRiskPressure;
  const momentumScore = Math.round(
    clamp(
      challengeClearCount * 16 +
        reducedRiskCount * 14 +
        freeCount * 12 +
        Math.min(entries.length, 5) * 6 -
        Math.max(0, finalRiskPressure - 35) * 0.4,
      0,
      100,
    ),
  );

  return {
    freeCount,
    reducedRiskCount,
    challengeClearCount,
    currentChallengeStreak,
    momentumScore,
    momentumTier: momentumScore >= 70 ? "FLOW" : momentumScore >= 40 ? "READY" : "BUILDING",
    rank: momentumScore >= 85 ? "S" : momentumScore >= 70 ? "A" : momentumScore >= 50 ? "B" : "C",
  };
}

export function getDiscoveryClue({
  currentCase = "case01",
  challengeMatch = false,
  riskDelta = 0,
  responseTimeSec = 45,
  logLength = 0,
} = {}) {
  const clues = {
    case01: {
      id: "c1-hidden-ledger",
      title: "숨은 급여표",
      text: "공식 보고서보다 먼저 움직인 돈의 흔적이 있습니다. 누군가는 이미 다음 사건을 알고 있었습니다.",
    },
    case02: {
      id: "c2-false-timestamp",
      title: "어긋난 시간",
      text: "유출 기록의 시간이 서로 맞지 않습니다. 범인보다 기록을 만든 사람이 더 중요할 수 있습니다.",
    },
    case03: {
      id: "c3-second-scoreboard",
      title: "두 번째 점수판",
      text: "공개 점수판 뒤에 다른 평가표가 있습니다. 경쟁자는 당신의 답뿐 아니라 망설임도 보고 있습니다.",
    },
    case04: {
      id: "c4-exception-file",
      title: "예외 파일",
      text: "이번 규칙 위반은 처음이 아닙니다. 누군가는 오래전부터 예외를 정상처럼 기록해 왔습니다.",
    },
    case05: {
      id: "c5-empty-seat",
      title: "비어 있는 자리",
      text: "실패 보고서에는 이름이 하나 빠져 있습니다. 말하지 못한 사람이 시스템의 가장 큰 비용을 떠안았습니다.",
    },
    final: {
      id: "final-observer-key",
      title: "관찰자의 열쇠",
      text: "당신의 선택 습관을 모은 폴더가 이미 완성되어 있습니다. 마지막 질문은 실험을 끝낼지 이용할지입니다.",
    },
  };
  const clue = clues[currentCase];
  const qualifies = challengeMatch && (riskDelta >= 2 || responseTimeSec <= 12) && logLength >= 1;
  return qualifies ? clue : null;
}

export function getCaseOutcome({ caseId = "case01", choiceId = "" } = {}) {
  const outcomes = {
    case01: {
      c1_after_people: { tag: "사람을 먼저 세운 결말", title: "급여명세서보다 먼저 이름을 불렀다", text: "직원과 협력사는 당신의 결정을 완전히 믿지는 않지만, 적어도 누가 비용을 떠안는지 알게 됐습니다. 다음 사건은 사람을 보호한 대가로 더 느리게 시작됩니다." },
      c1_after_numbers: { tag: "숫자를 공개한 결말", title: "현금 흐름표가 약속이 되었다", text: "회사는 더 많은 질문을 받게 됐지만, 숨겨진 손실은 줄었습니다. 다음 사건은 기록을 믿을지 사람을 믿을지 묻습니다." },
      c1_after_silence: { tag: "침묵을 택한 결말", title: "조용한 하루를 샀다", text: "자금은 하루를 벌었지만 직원들의 믿음은 늦게 회복됩니다. 다음 사건에는 설명되지 않은 비용이 따라옵니다." },
    },
    case02: {
      c2_after_audit: { tag: "기록을 복원한 결말", title: "사라진 11초가 증거가 되었다", text: "범인을 바로 정하지 않고 기록의 흐름을 복원했습니다. 진실은 느려졌지만, 누군가의 이름을 성급히 고정하지 않았습니다." },
      c2_after_person: { tag: "사람을 만난 결말", title: "보호는 의심받을 권리도 남겼다", text: "이민서는 스스로 말할 수 있었고 사건은 더 복잡해졌습니다. 대신 다음 판단은 사람의 맥락을 지우기 어려워집니다." },
      c2_after_public: { tag: "즉시 공개한 결말", title: "경보가 사건보다 먼저 퍼졌다", text: "외부의 눈이 사건을 감시하기 시작했습니다. 책임은 분명해졌지만, 아직 확인되지 않은 사실도 함께 퍼졌습니다." },
    },
    case03: {
      c3_after_share: { tag: "공동 설계 결말", title: "승부를 공동 작업으로 바꾸었다", text: "오진우와의 경쟁은 사라지지 않았지만, 고객에게는 두 사람이 책임지는 안이 남았습니다." },
      c3_after_proof: { tag: "증거를 택한 결말", title: "점수판보다 결함을 먼저 보여주었다", text: "당장 얻을 점수는 줄었지만, 숨겨진 보안 위험이 다음 사건의 공개 기록이 됐습니다." },
      c3_after_win: { tag: "승리를 확정한 결말", title: "가장 빠른 답이 가장 오래 남았다", text: "당신은 이겼지만, 경쟁자가 숨긴 빈틈까지 함께 가져왔습니다. 다음 사건은 그 승리의 비용을 청구합니다." },
    },
    case04: {
      c4_after_rule: { tag: "기준을 다시 만든 결말", title: "예외가 규칙의 시작이 되었다", text: "예외를 숨기지 않고 공개 조건으로 묶었습니다. 더 느려졌지만 다음 기관이 같은 문을 몰래 열 수 없게 됐습니다." },
      c4_after_service: { tag: "서비스를 지킨 결말", title: "한 번 더 넘어간 선", text: "사람들은 도움을 받았지만 예외는 기록으로 남았습니다. 다음 사건에서 누군가는 그 기록을 이용하려 합니다." },
      c4_after_stop: { tag: "감사를 택한 결말", title: "멈춤도 결정이라는 증거", text: "서비스는 흔들렸지만 심사 기준은 처음으로 공개 검토 대상이 됐습니다." },
    },
    case05: {
      c5_after_owner: { tag: "책임을 맡은 결말", title: "내 이름부터 보고서에 올렸다", text: "단독 책임은 문제를 즉시 해결하지 못했지만, 사람들이 숨지 않고 실패를 말할 공간을 만들었습니다." },
      c5_after_system: { tag: "구조를 고친 결말", title: "범인 대신 반복을 멈추었다", text: "누구도 영웅이 되지 못했지만 같은 실패가 다시 일어날 길은 좁아졌습니다." },
      c5_after_name: { tag: "책임자를 지목한 결말", title: "한 사람의 이름으로 실패를 닫았다", text: "회의는 빨리 끝났지만, 말하지 못한 사람들의 기록은 아직 남아 있습니다." },
    },
    final: {
      f_after_witness: { tag: "증언을 남긴 결말", title: "첫 참가자의 목소리가 마지막 기록이 되었다", text: "실험을 끝내는 대신 진실을 함께 보존했습니다. 다음 사람은 적어도 자신이 무엇에 참여하는지 알 수 있습니다." },
      f_after_control: { tag: "규칙을 바꾼 결말", title: "실험은 남았지만 혼자 결정할 수 없게 되었다", text: "트리거를 없애지는 않았습니다. 대신 동의와 감시가 없는 선택은 더 이상 실행되지 않습니다." },
      f_after_burn: { tag: "폐기한 결말", title: "모든 기록을 태우고 빈 화면을 남겼다", text: "누구도 다시 이용할 수 없게 했지만, 무엇을 잃었는지 증명할 기록도 사라졌습니다." },
    },
  };
  return outcomes[caseId]?.[choiceId] ?? { tag: "기록되지 않은 결말", title: "아직 닫히지 않은 결과", text: "이번 선택의 파장은 다음 기록에 남아 있습니다." };
}

export function getOutcomeCarryover({ caseId = "case01", choiceId = "" } = {}) {
  const carryovers = {
    case01: {
      c1_after_people: { trust: 6, humanCost: -3, fatigue: 4 },
      c1_after_numbers: { capital: -4, legitimacy: 5, fatigue: 2 },
      c1_after_silence: { capital: 5, trust: -7, legitimacy: -4 },
    },
    case02: {
      c2_after_audit: { time: -5, legitimacy: 6, fatigue: 3 },
      c2_after_person: { trust: 6, humanCost: -2, fatigue: 5 },
      c2_after_public: { capital: -5, legitimacy: 8, trust: -3, fatigue: 4 },
    },
    case03: {
      c3_after_share: { trust: 7, fatigue: 5, legitimacy: 3 },
      c3_after_proof: { capital: -5, legitimacy: 8, time: -4 },
      c3_after_win: { capital: 7, trust: -8, fatigue: 2 },
    },
    case04: {
      c4_after_rule: { legitimacy: 8, trust: 4, time: -4 },
      c4_after_service: { humanCost: -4, legitimacy: -8, trust: -3 },
      c4_after_stop: { capital: -7, legitimacy: 7, humanCost: 8 },
    },
    case05: {
      c5_after_owner: { trust: 7, legitimacy: 5, fatigue: 6 },
      c5_after_system: { legitimacy: 8, capital: -4, fatigue: 5 },
      c5_after_name: { trust: -9, humanCost: 7, fatigue: 2 },
    },
  };
  return carryovers[caseId]?.[choiceId] ?? {};
}

export function getDecisionLedger(entries = [], resources = {}) {
  const totals = {};
  entries.forEach((entry) => {
    Object.entries(entry.effect ?? {}).forEach(([key, value]) => {
      totals[key] = (totals[key] ?? 0) + value;
    });
  });

  const riskDeltas = entries
    .map((entry) => {
      if (entry.resourcesBefore && entry.resourcesAfter) {
        return getRiskPressure(entry.resourcesAfter) - getRiskPressure(entry.resourcesBefore);
      }
      return entry.challenge?.riskDelta ?? 0;
    });
  const riskRises = riskDeltas.filter((value) => value > 0).length;
  const riskDrops = riskDeltas.filter((value) => value < 0).length;
  const strongestCost = Object.entries(totals)
    .filter(([, value]) => value < 0)
    .sort((a, b) => a[1] - b[1])[0] ?? null;
  const strongestRecovery = Object.entries(totals)
    .filter(([key, value]) => (key === "humanCost" || key === "fatigue" ? value < 0 : value > 0))
    .sort((a, b) => {
      const score = ([key, value]) => key === "humanCost" || key === "fatigue" ? -value : value;
      return score(b) - score(a);
    })[0] ?? null;

  return {
    totals,
    riskDeltas,
    riskRises,
    riskDrops,
    strongestCost,
    strongestRecovery,
    netRiskDelta: getRiskPressure(resources) - (riskDeltas.length > 0 ? getRiskPressure(entries[0]?.resourcesBefore ?? resources) : getRiskPressure(resources)),
    lastRiskDelta: riskDeltas.at(-1) ?? 0,
  };
}

export function getDecisionFingerprint({ triggerScores = {}, cognitionScores = {}, entries = [], resources = {} } = {}) {
  const sortedTriggers = Object.entries(triggerScores).sort((a, b) => b[1] - a[1]);
  const sortedCognition = Object.entries(cognitionScores).sort((a, b) => b[1] - a[1]);
  const ledger = getDecisionLedger(entries, resources);
  const freeCount = entries.filter((entry) => entry.freeText).length;
  const challengeCount = entries.filter((entry) => entry.challenge?.matched).length;
  const dominantTrigger = sortedTriggers[0] ?? ["responsibility", 0];
  const dominantCognition = sortedCognition[0] ?? ["persistence", 0];
  const guardianScore = Math.max(0, -(ledger.totals.humanCost ?? 0)) + challengeCount * 2;
  const disruptorScore = freeCount * 4 + Math.max(0, ledger.totals.legitimacy ?? 0) * 0.2;
  const stabilizerScore = ledger.riskDrops * 3 - ledger.riskRises + (ledger.totals.fatigue ?? 0) < 0 ? 6 : ledger.riskDrops * 3 - ledger.riskRises;
  const mode = guardianScore >= Math.max(disruptorScore, stabilizerScore)
    ? "GUARDIAN"
    : disruptorScore >= stabilizerScore
      ? "RE-FRAMER"
      : "PRESSURE PILOT";
  const modeMeta = {
    GUARDIAN: {
      title: "피해의 이동을 먼저 막는 사람",
      text: "결과의 크기보다 누가 비용을 떠안는지 확인하며 판단을 오래 유지합니다.",
    },
    "RE-FRAMER": {
      title: "판 자체를 다시 짜는 사람",
      text: "주어진 선택지의 균형을 따르기보다 이해관계자와 조건을 다시 배치합니다.",
    },
    "PRESSURE PILOT": {
      title: "압박 안에서 방향을 조정하는 사람",
      text: "위험이 커져도 결정을 멈추지 않고, 다음 장면으로 넘길 비용을 선택합니다.",
    },
  }[mode];

  return {
    mode,
    modeTitle: modeMeta.title,
    modeText: modeMeta.text,
    primaryTrigger: dominantTrigger,
    primaryCognition: dominantCognition,
    pressureShare: sortedTriggers.length > 0
      ? Math.round((dominantTrigger[1] / Math.max(1, sortedTriggers.reduce((sum, [, value]) => sum + value, 0))) * 100)
      : 0,
    signature: [dominantTrigger[0], dominantCognition[0], mode.toLowerCase().replace("-", "_")],
    ledger,
  };
}

export function getCounterfactualReport(entries = [], sceneMap = {}) {
  return entries
    .map((entry) => {
      const scene = sceneMap[entry.nodeId];
      const choices = scene?.choices?.filter((choice) => choice.type !== "free" && choice.effect) ?? [];
      if (choices.length < 2) return null;
      const beforeResources = entry.resourcesBefore ?? {};
      const forecasts = choices
        .map((choice) => ({
          choice,
          forecast: createDecisionForecast(choice, beforeResources),
        }))
        .sort((a, b) => a.forecast.riskDelta - b.forecast.riskDelta);
      const actual = forecasts.find(({ choice }) => choice.id === entry.choiceId) ?? null;
      const safest = forecasts[0];
      const costliest = [...forecasts].sort((a, b) => b.forecast.riskDelta - a.forecast.riskDelta)[0];
      return {
        nodeId: entry.nodeId,
        title: entry.title,
        actual: actual?.choice ?? { id: entry.choiceId, label: entry.choice },
        actualForecast: actual?.forecast ?? null,
        safest: safest.choice,
        safestForecast: safest.forecast,
        costliest: costliest.choice,
        costliestForecast: costliest.forecast,
        actualWasSafest: actual?.choice.id === safest.choice.id,
        riskGap: actual ? actual.forecast.riskDelta - safest.forecast.riskDelta : null,
      };
    })
    .filter(Boolean);
}

export function createCaseSummary(
  triggerScores = {},
  cognitionScores = {},
  entries = [],
  { resources = {}, schemaVersion = 1, includeLongestDecision = false } = {},
) {
  const sortedTriggers = Object.entries(triggerScores).sort((a, b) => b[1] - a[1]);
  const sortedCognition = Object.entries(cognitionScores).sort((a, b) => b[1] - a[1]);
  const stats = getGameplayStats(entries, getRiskPressure(resources));
  const summary = {
    schemaVersion,
    primary: sortedTriggers[0] ?? ["responsibility", 0],
    secondary: sortedTriggers[1] ?? ["protection", 0],
    thinking: sortedCognition[0] ?? ["persistence", 0],
    freeCount: stats.freeCount,
    averageResponseTime:
      entries.length > 0
        ? Math.round(
            entries.reduce((sum, entry) => sum + (entry.responseTimeSec ?? 0), 0) /
              entries.length,
          )
        : 0,
    challengeClearCount: stats.challengeClearCount,
    reducedRiskCount: stats.reducedRiskCount,
    momentumScore: stats.momentumScore,
    momentumTier: stats.momentumTier,
    rank: stats.rank,
  };

  if (includeLongestDecision) {
    summary.longestDecision = [...entries].sort(
      (a, b) => (b.responseTimeSec ?? 0) - (a.responseTimeSec ?? 0),
    )[0];
  }

  return summary;
}

const emailPatternSource = String.raw`[^\s@,.;:!?]+@[^\s@,.;:!?]+\.[^\s@,.;:!?]+`;
const phonePatternSource = String.raw`01[016789][-\s.]?\d{3,4}[-\s.]?\d{4}`;
const organizationPatternSource = String.raw`((주식회사|\(주\))\s*[가-힣A-Za-z0-9]+?(?=(과|와|에|에서|에게|으로|로|은|는|이|가|을|를|,|\.|\s|$))|[가-힣A-Za-z0-9]+(회사|그룹|은행|전자|건설|테크|랩스|코퍼레이션|inc\.?|llc))`;

const emailPattern = new RegExp(emailPatternSource);
const phonePattern = new RegExp(phonePatternSource);
const organizationPattern = new RegExp(organizationPatternSource, "i");

export function detectPrivacySignals(text = "") {
  return [
    { label: "이메일", active: emailPattern.test(text) },
    { label: "전화번호", active: phonePattern.test(text) },
    { label: "회사·조직명", active: organizationPattern.test(text) },
  ];
}

export function anonymizeSensitiveText(text = "") {
  return text
    .replace(new RegExp(emailPatternSource, "g"), "익명 이메일")
    .replace(new RegExp(phonePatternSource, "g"), "익명 연락처")
    .replace(new RegExp(organizationPatternSource, "gi"), "익명 조직");
}

export function limitText(text = "", maxLength = 0) {
  if (!Number.isFinite(maxLength) || maxLength <= 0) return "";
  return String(text).slice(0, maxLength);
}

export function getEcho(choiceId, freeText) {
  if (freeText) {
    const text = freeText.toLowerCase();
    if (text.includes("협상") || text.includes("분할") || text.includes("조건")) {
      return "조건을 나누는 방식은 유효합니다. 다만 각 이해관계자가 왜 그 조건을 받아들여야 하는지까지 설계해야 합니다.";
    }
    if (text.includes("직원") || text.includes("급여") || text.includes("보호")) {
      return "보호 대상을 명확히 본 점은 좋습니다. 같은 기준을 협력사 직원에게도 적용하면 비용은 어디로 이동합니까?";
    }
    if (text.includes("공개") || text.includes("책임") || text.includes("회계")) {
      return "책임을 전면에 세우면 정당성은 올라갑니다. 그러나 당장 회사가 무너지면 책임 규명의 실익도 줄어들 수 있습니다.";
    }
    return "선택지 밖의 제안은 판을 넓힙니다. 이제 그 방법의 비용, 반대자, 실패 조건을 구체화해야 합니다.";
  }
  return echoReplies[choiceId] ?? echoReplies.default;
}

export function getDramaticChoiceLabel(choice) {
  if (choice.type === "free") return choice.label;
  return choiceVoiceLines[choice.id] ?? choice.label;
}

export function getChoiceSubtext(choice) {
  const strongestCognition = Object.entries(choice.cognition ?? {}).sort((a, b) => b[1] - a[1])[0]?.[0];
  return choiceSubtexts[strongestCognition] ?? choiceSubtexts.default;
}

function getStrongestDelta(effect = {}) {
  return Object.entries(effect).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))[0] ?? null;
}

function describeDelta(delta) {
  if (!delta) return "상황판의 숫자는 크게 움직이지 않지만, 회의실의 침묵은 조금 길어진다.";
  const [key, value] = delta;
  const labels = {
    time: "남은 시간",
    capital: "현금 여력",
    trust: "신뢰",
    legitimacy: "정당성",
    humanCost: "사람에게 옮겨간 비용",
    fatigue: "피로",
  };
  const label = labels[key] ?? key;
  if (value > 0) return `${label}이 올라간다. 하지만 그 숫자가 공짜로 생긴 것은 아니다.`;
  return `${label}이 줄어든다. 누군가는 그 감소분을 자기 몫으로 떠안게 된다.`;
}

export function explainResourceTradeoff(effect = {}) {
  const entries = Object.entries(effect).filter(([, value]) => value !== 0);
  if (entries.length === 0) return "숫자는 거의 움직이지 않았지만, 이 선택은 판단의 기준을 남겼습니다.";

  const gains = entries.filter(([, value]) => value > 0).sort((a, b) => b[1] - a[1]);
  const losses = entries.filter(([, value]) => value < 0).sort((a, b) => a[1] - b[1]);
  const labels = {
    time: "시간",
    capital: "현금",
    trust: "신뢰",
    legitimacy: "정당성",
    humanCost: "사람에게 옮겨간 비용",
    fatigue: "피로",
  };
  const format = ([key, value]) => `${labels[key] ?? key} ${value > 0 ? "+" : ""}${value}`;
  const gainText = gains.length > 0 ? gains.slice(0, 2).map(format).join(", ") : "즉시 얻은 것은 적고";
  const lossText = losses.length > 0 ? losses.slice(0, 2).map(format).join(", ") : "눈에 보이는 손실은 작습니다";

  if (gains.length > 0 && losses.length > 0) {
    return `${gainText}을 얻는 대신 ${lossText}을 감수했습니다.`;
  }
  if (gains.length > 0) return `${gainText}이 올라갔지만, 그 이득이 다음 장면의 압박으로 남습니다.`;
  return `${lossText}이 줄었습니다. 선택의 명분은 남았지만 여력이 깎였습니다.`;
}

function getSubjectParticle(name = "상대") {
  const lastChar = name.at(-1);
  if (!lastChar) return "가";
  const code = lastChar.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return "가";
  return (code - 0xac00) % 28 === 0 ? "가" : "이";
}

export function speechifyChoice(choice) {
  const label = choice.label ?? "그 판단을 밀고 가겠습니다";
  const endings = [
    ["제안한다", "제안하겠습니다."],
    ["선택한다", "선택하겠습니다."],
    ["검토한다", "검토하겠습니다."],
    ["집중한다", "집중하겠습니다."],
    ["요청한다", "요청하겠습니다."],
    ["공식화한다", "공식화하겠습니다."],
    ["공개한다", "공개하겠습니다."],
    ["조사한다", "조사하겠습니다."],
    ["전환한다", "전환하겠습니다."],
    ["발표한다", "발표하겠습니다."],
    ["추적한다", "추적하겠습니다."],
    ["준비한다", "준비하겠습니다."],
    ["요구한다", "요구하겠습니다."],
    ["설계한다", "설계하겠습니다."],
    ["봉인한다", "봉인하겠습니다."],
    ["폭로한다", "폭로하겠습니다."],
    ["알린다", "알리겠습니다."],
    ["미룬다", "미루겠습니다."],
    ["올린다", "올리겠습니다."],
    ["넘긴다", "넘기겠습니다."],
    ["높인다", "높이겠습니다."],
    ["찾는다", "찾겠습니다."],
    ["묻는다", "묻겠습니다."],
    ["바꾼다", "바꾸겠습니다."],
    ["묶는다", "묶겠습니다."],
    ["연다", "열겠습니다."],
    ["둔다", "두겠습니다."],
  ];
  const matchedEnding = endings.find(([ending]) => label.endsWith(ending));
  if (matchedEnding) return `${label.slice(0, -matchedEnding[0].length)}${matchedEnding[1]}`;
  if (label.endsWith("한다")) return `${label.slice(0, -2)}하겠습니다.`;
  return `${label}. 이 방향으로 가겠습니다.`;
}

export function buildSceneBeat(node, choice, freeText, effect = {}) {
  const profile = characterProfiles[node?.speaker] ?? {
    appearance: "정돈되지 않은 자료 더미 앞에 사건 관계자가 앉아 있다.",
    thought: "이 선택은 아직 끝나지 않았다.",
    gesture: "상대는 잠시 말을 고른다.",
    voice: "상황을 확인하는 말투로 반응한다.",
    line: "그 판단을 계속 밀고 갈 수 있습니까?",
  };
  const said = choice.type === "free"
    ? `"${freeText.trim()}"`
    : `"${speechifyChoice(choice)}"`;
  const deltaLine = describeDelta(getStrongestDelta(effect));
  const speakerName = node?.speaker ?? "상대";

  return [
    `${profile.appearance} ${profile.gesture}`,
    `'${profile.thought}'`,
    `당신은 준비된 대응안의 이름 대신, 결론만 남겨 이렇게 말한다. ${said}`,
    `${speakerName}${getSubjectParticle(speakerName)} 시선을 든다. ${profile.voice}`,
    `"${profile.line}"`,
    deltaLine,
  ].join("\n");
}

export function scoreFreeText(value) {
  const text = value.trim();
  if (!text) return { effect: {}, cognition: {}, note: "" };
  const signals = getFreeTextSignals(text);
  const hasStakeholder = signals.some((signal) => signal.id === "stakeholder" && signal.active);
  const hasTradeoff = signals.some((signal) => signal.id === "tradeoff" && signal.active);
  const hasInfo = signals.some((signal) => signal.id === "info" && signal.active);
  const hasRisk = signals.some((signal) => signal.id === "risk" && signal.active);
  const depth = Math.min(3, Math.floor(text.length / 45));

  return {
    effect: {
      time: hasInfo ? -4 : -2,
      trust: hasStakeholder ? 4 : 1,
      legitimacy: hasRisk ? 4 : 1,
      capital: hasTradeoff ? 5 : 0,
      fatigue: 5,
    },
    cognition: {
      reframing: 1 + (hasTradeoff ? 2 : 0),
      inference: (hasInfo ? 2 : 0) + (hasStakeholder ? 1 : 0),
      risk: hasRisk ? 2 : 0,
      persistence: depth,
    },
    note:
      "자유입력은 새로운 이해관계자, 조건 재구성, 추가 정보 요청, 위험 명시 여부를 기준으로 반영했습니다.",
  };
}

export function getFreeTextSignals(value) {
  const text = value.trim();
  return [
    {
      id: "stakeholder",
      label: "이해관계자",
      active: /(직원|협력사|투자자|경쟁사|고객|CFO|임원|피해자|기자|보안팀|현장)/i.test(text),
      hint: "누가 영향을 받는지",
    },
    {
      id: "tradeoff",
      label: "교환 조건",
      active: /(대신|하지만|조건|분할|우선|동시에|단계|교환|협상|묶어|연기|승계)/i.test(text),
      hint: "무엇을 얻고 잃는지",
    },
    {
      id: "info",
      label: "근거 확인",
      active: /(확인|조사|자료|공시|계약|근거|회의록|숫자|로그|원본|검증)/i.test(text),
      hint: "무엇을 더 확인할지",
    },
    {
      id: "risk",
      label: "위험 명시",
      active: /(위험|손실|비용|실패|법적|평판|시간|유출|무고|중단|이탈)/i.test(text),
      hint: "실패하면 어디가 무너지는지",
    },
  ];
}

export function makeEmptyScores(labels) {
  return Object.fromEntries(Object.keys(labels).map((key) => [key, 0]));
}
