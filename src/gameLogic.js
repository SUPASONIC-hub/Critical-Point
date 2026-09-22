import { createGauntletLedger } from "./gauntlet/gauntletEngine.js";
import { byEffectWeight, CASE_PACKS, CASE_SEQUENCE, characterProfiles, choiceVoiceLines, echoReplies, isResourceGain } from "./gameData.js";
import { limitText, makeEmptyScores } from "./appConfig.js";
import { easyResourceLabels, objectParticle, subjectParticle } from "./playerLanguage.js";
import {
  applyEffect,
  clamp,
  getRiskPressure,
  getRiskPressureDrivers,
} from "./riskLogic.js";

export {
  applyEffect,
  applySeededEffectVariation,
  clamp,
  getRiskPressure,
  getRiskPressureDrivers,
  getSuspenseEvent,
  getSuspenseState,
} from "./riskLogic.js";

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
  // The one line of prose the table always shows, and it has to be the scene's
  // own: this template ran for all 149 scenes, so every window asked the same
  // thing under a different title. The template is only the net now.
  const question = node.question
    || (node.title ? `${node.title}: 지금 무엇을 먼저 지킬지 결정해야 합니다.` : "지금 무엇을 먼저 지킬지 결정해야 합니다.");
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
    nextQuestion: riskTier === "CRITICAL" ? "다음 장면에서 가장 먼저 반응하는 사람은 누구인가?" : "다음 장면에서 이 비용은 누구에게 넘어가는가?",
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

// Keep the real forecast for game logic, but reveal only the precision earned by evidence.
/**
 * Which way a decision leaned: toward the people in the scene, or toward the
 * position you are holding. Ties read as neither.
 */
function getDecisionLean(entry = {}) {
  const effect = entry.effect ?? {};
  const people = (effect.trust ?? 0) - (effect.humanCost ?? 0);
  const position = (effect.capital ?? 0) + (effect.time ?? 0);
  if (people === position) return 0;
  return people > position ? 1 : -1;
}

/**
 * How consistently the run held one of those directions, counting decisions
 * made under high pressure double. This is the axis that reads the choice
 * itself rather than how fast or how variably it was made.
 */
function getConsistencyScore(entries = []) {
  const leaning = entries.filter((entry) => getDecisionLean(entry) !== 0);
  // Nothing to read (an old save without effect vectors, or a run of pure
  // ties) is not evidence of inconsistency, so it scores neutral.
  if (leaning.length === 0) return 50;
  const weightOf = (entry) => (getRiskPressure(entry.resourcesBefore ?? {}) >= 50 ? 3 : 1);
  const balance = leaning.reduce((sum, entry) => sum + getDecisionLean(entry) * weightOf(entry), 0);
  const total = leaning.reduce((sum, entry) => sum + weightOf(entry), 0);
  if (balance === 0) return 0;
  const held = leaning.reduce(
    (sum, entry) => sum + (getDecisionLean(entry) === Math.sign(balance) ? weightOf(entry) : 0),
    0,
  );
  // Changing direction is what breaks a line, so it is counted directly rather
  // than left to the ratio. Without it the axis only spanned 21 to 49 across
  // every fixed strategy, which moved the total by eight points.
  const flips = leaning.reduce(
    (count, entry, index) =>
      count + (index > 0 && getDecisionLean(entry) !== getDecisionLean(leaning[index - 1]) ? 1 : 0),
    0,
  );
  const flipRate = leaning.length > 1 ? flips / (leaning.length - 1) : 0;
  return Math.round(clamp((((held / total) * 2 - 1) - flipRate * 0.5) * 140, 0, 100));
}

/**
 * How evenly the run moved between the four ways of thinking.
 *
 * This used to be `types * 14 + shifts * 10 + length * 4`, which any run of a
 * dozen decisions filled to the cap: measured across five fixed strategies it
 * returned 100 every time, so a fifth of the score could not separate two runs.
 * Normalised entropy answers the same question and actually varies -- one
 * repeated approach lands near 0, an even spread across all four near 100.
 */
export function getCognitionSpread(types = []) {
  if (types.length === 0) return 0;
  const counts = new Map();
  for (const type of types) counts.set(type, (counts.get(type) ?? 0) + 1);
  if (counts.size < 2) return 0;
  const entropy = [...counts.values()].reduce((sum, count) => {
    const share = count / types.length;
    return sum - share * Math.log(share);
  }, 0);
  const ceiling = Math.log(Math.min(counts.size, types.length));
  const evenness = ceiling > 0 ? entropy / ceiling : 0;
  // A run that only ever used two of the four ways cannot reach the top, even
  // if it alternated them perfectly.
  const reach = counts.size / 4;
  return Math.round(clamp(evenness * reach * 100, 0, 100));
}

export function getGameplayStats(entries = [], fallbackRiskPressure = 0) {
  if (entries.length === 0) {
    return {
      freeCount: 0,
      reducedRiskCount: 0,
      challengeClearCount: 0,
      currentChallengeStreak: 0,
      rhythmScore: 0,
      cognitionScore: 0,
      pressureAdaptScore: 0,
      reflectionScore: 0,
      consistencyScore: 0,
      exploitPenalty: 0,
      momentumScore: 0,
      burstScore: 0,
      momentumTier: "BUILDING",
      rank: "C",
    };
  }
  const playableEntries = entries.filter((entry) => !entry.isSystemEvent);
  const scoredEntries = playableEntries.length > 0 ? playableEntries : entries;
  const freeCount = scoredEntries.filter((entry) => entry.freeText).length;
  const reducedRiskCount = scoredEntries.filter(
    (entry) =>
      entry.resourcesBefore &&
      entry.resourcesAfter &&
      getRiskPressure(entry.resourcesAfter) < getRiskPressure(entry.resourcesBefore),
  ).length;
  const challengeClearCount = scoredEntries.filter((entry) => entry.challenge?.matched).length;
  const streakBreakIndex = [...scoredEntries].reverse().findIndex((entry) => !entry.challenge?.matched);
  const currentChallengeStreak =
    streakBreakIndex === -1 ? scoredEntries.length : Math.max(0, streakBreakIndex);
  const finalRiskPressure = scoredEntries.at(-1)?.resourcesAfter
    ? getRiskPressure(scoredEntries.at(-1).resourcesAfter)
    : fallbackRiskPressure;
  const responseTimes = scoredEntries
    .map((entry) => Number(entry.responseTimeSec))
    .filter((value) => Number.isFinite(value) && value > 0);
  const rhythmSamples = responseTimes.length > 0 ? responseTimes : [0];
  const rhythmScore = Math.round(
    rhythmSamples.reduce((sum, seconds) => {
      if (seconds >= 8 && seconds <= 28) return sum + 100;
      if (seconds >= 4 && seconds < 8) return sum + 70;
      if (seconds > 28 && seconds <= 45) return sum + 78 - (seconds - 28) * 1.8;
      if (seconds > 45) return sum + 38;
      return sum + 24;
    }, 0) / rhythmSamples.length,
  );
  const cognitionTypes = scoredEntries
    .map((entry) => Object.entries(entry.cognition ?? {}).sort((a, b) => b[1] - a[1])[0]?.[0])
    .filter(Boolean);
  const cognitionScore = getCognitionSpread(cognitionTypes);
  const riskDeltas = scoredEntries.map((entry) => {
    if (entry.resourcesBefore && entry.resourcesAfter) {
      return getRiskPressure(entry.resourcesAfter) - getRiskPressure(entry.resourcesBefore);
    }
    return entry.challenge?.riskDelta ?? 0;
  });
  const riskSwing = riskDeltas.reduce((sum, value) => sum + Math.min(14, Math.abs(value)), 0);
  const recoveryAfterSpike = riskDeltas.some((value, index) => value > 0 && riskDeltas.slice(index + 1).some((next) => next < 0));
  // Adaptation is bringing pressure back down, not shaking it. Swing used to
  // pay three points a unit, which made deliberately spiking risk the fastest
  // way to score.
  const pressureAdaptScore = Math.round(
    clamp(
      reducedRiskCount * 14 +
        (recoveryAfterSpike ? 22 : 0) +
        Math.min(24, riskSwing) -
        Math.max(0, finalRiskPressure - 62) * 1.4,
      0,
      100,
    ),
  );
  const consistencyScore = getConsistencyScore(scoredEntries);
  const freeTextSignalScore = entries.reduce((sum, entry) => {
    if (!entry.freeText) return sum;
    const activeSignals = getFreeTextSignals(entry.freeText).filter((signal) => signal.active).length;
    return sum + Math.min(24, activeSignals * 6 + Math.min(6, Math.floor(entry.freeText.trim().length / 35)));
  }, 0);
  // Opening a hidden record is the other way a player shows their working, and
  // it is the only one available to someone who never uses free text -- who
  // otherwise started this axis at zero.
  const recordsOpened = scoredEntries.filter((entry) => entry.clue).length;
  const reflectionScore = Math.round(
    clamp(freeTextSignalScore + freeCount * 8 + challengeClearCount * 4 + recordsOpened * 10, 0, 100),
  );
  const exploitPenalty = Math.min(
    18,
    entries.filter((entry) => (entry.responseTimeSec ?? 0) <= 2 && !entry.freeText).length * 5,
  );
  const challengeSupportScore = Math.min(100, challengeClearCount * 18 + currentChallengeStreak * 8);
  // What the score is for: holding a line under pressure. Response rhythm still
  // counts, but at a weight that no longer makes a stopwatch the best strategy.
  const momentumScore = Math.round(
    clamp(
      consistencyScore * 0.28 +
        cognitionScore * 0.2 +
        reflectionScore * 0.2 +
        pressureAdaptScore * 0.16 +
        rhythmScore * 0.08 +
        challengeSupportScore * 0.08 -
        exploitPenalty,
      0,
      100,
    ),
  );

  return {
    freeCount,
    reducedRiskCount,
    challengeClearCount,
    currentChallengeStreak,
    rhythmScore,
    cognitionScore,
    pressureAdaptScore,
    reflectionScore,
    consistencyScore,
    exploitPenalty,
    momentumScore,
    burstScore: momentumScore,
    momentumTier: momentumScore >= 78 ? "BURST" : momentumScore >= 58 ? "FLOW" : momentumScore >= 36 ? "READY" : "BUILDING",
    rank: momentumScore >= 88 ? "S" : momentumScore >= 72 ? "A" : momentumScore >= 52 ? "B" : "C",
  };
}

export function getObserverTag(entry = {}) {
  const riskDelta = entry.resourcesBefore && entry.resourcesAfter
    ? getRiskPressure(entry.resourcesAfter) - getRiskPressure(entry.resourcesBefore)
    : entry.challenge?.riskDelta ?? 0;
  const choiceText = `${entry.choiceId ?? ""} ${entry.choice ?? ""}`.toLowerCase();
  const humanCostDelta = (entry.resourcesAfter?.humanCost ?? 0) - (entry.resourcesBefore?.humanCost ?? 0);
  if (entry.freeText || entry.freeTextSuccess) {
    return {
      id: "defiance",
      label: "거부 표본",
      text: "준비된 선택지 밖으로 나간 순간입니다. 다음 참가자의 사건에는 이 우회로가 새 조건으로 남습니다.",
    };
  }
  if (/침묵|미루|비공개|봉인|silence|delay|private/.test(choiceText)) {
    return {
      id: "opacity",
      label: "은폐 표본",
      text: "공개를 늦춘 판단입니다. 트리거랩은 이 침묵이 누구를 보호하고 누구를 지우는지 따로 보관합니다.",
    };
  }
  if (humanCostDelta > 0) {
    return {
      id: "sacrifice",
      label: "희생 표본",
      text: "사람에게 비용을 넘긴 판단입니다. 사건은 지나가도 이 손실은 다음 장면의 말투로 되돌아옵니다.",
    };
  }
  if (Number(entry.responseTimeSec) <= 2 && riskDelta <= 0) {
    return {
      id: "compliance",
      label: "순응 표본",
      text: "빠르게 닫힌 안정 선택입니다. 정답처럼 보인 길이 관찰자에게는 가장 읽기 쉬운 패턴이 됩니다.",
    };
  }
  if (riskDelta > 6) {
    return {
      id: "defiance",
      label: "고압 표본",
      text: "압박 상승을 감수한 판단입니다. 이 선택은 해결책보다 허용선에 가까운 기록으로 분류됩니다.",
    };
  }
  return {
    id: "pattern",
    label: "패턴 표본",
    text: "크게 튀지 않은 선택입니다. 그래서 더 오래 남습니다. 관찰자는 반복되는 기준을 먼저 찾습니다.",
  };
}

export function getObserverPattern(entries = []) {
  const playableEntries = entries.filter((entry) => entry && typeof entry === "object" && !entry.isSystemEvent);
  const taggedEntries = playableEntries.map((entry) => ({
    ...entry,
    observerTag: entry.observerTag ?? getObserverTag(entry),
  }));
  const counts = taggedEntries.reduce((nextCounts, entry) => {
    const id = entry.observerTag?.id ?? "pattern";
    return { ...nextCounts, [id]: (nextCounts[id] ?? 0) + 1 };
  }, {});
  const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "pattern";
  const latest = taggedEntries.at(-1)?.observerTag ?? null;
  const repeatedTail = taggedEntries
    .slice(-3)
    .every((entry) => entry.observerTag?.id && entry.observerTag.id === latest?.id);
  const turningPoint = taggedEntries.find((entry, index) => {
    if (index < 2 || entry.observerTag?.id === taggedEntries[index - 1]?.observerTag?.id) return false;
    return taggedEntries.slice(0, index).filter((previous) => previous.observerTag?.id === dominant).length >= 2;
  }) ?? null;
  const labels = {
    compliance: "순응 표본",
    defiance: "거부 표본",
    opacity: "은폐 표본",
    sacrifice: "희생 표본",
    pattern: "패턴 표본",
  };
  const arcCopy = {
    compliance: {
      label: "관찰자 학습",
      title: "안정적인 선택이 다음 사건의 기본값으로 굳고 있습니다.",
      text: "정답처럼 닫힌 길이 많을수록, 다음 장면은 더 빠른 결정을 유도하는 구조로 바뀝니다.",
    },
    defiance: {
      label: "관찰자 학습",
      title: "시스템이 예외 경로를 새 규칙 후보로 붙잡고 있습니다.",
      text: "준비된 선택지를 벗어난 흔적이 다음 참가자에게는 처음부터 열린 틈으로 나타납니다.",
    },
    opacity: {
      label: "관찰자 학습",
      title: "말하지 않은 판단이 사건의 어두운 조건으로 축적됩니다.",
      text: "공개하지 않은 선택은 사라지지 않고, 다음 장면에서 누가 배제됐는지 묻는 질문으로 돌아옵니다.",
    },
    sacrifice: {
      label: "관찰자 학습",
      title: "누군가에게 넘긴 비용이 다음 사건의 첫 압박이 됩니다.",
      text: "해결은 되었지만 손실의 방향이 남았습니다. 다음 참가자는 그 손실을 이미 떠안고 시작합니다.",
    },
    pattern: {
      label: "관찰자 학습",
      title: "반복된 기준이 아직 결말보다 선명하게 남아 있습니다.",
      text: "크게 튀지 않은 판단들이 모여, 다음 사건의 보이지 않는 기본 규칙을 만듭니다.",
    },
  };
  const escalationText = repeatedTail
    ? "같은 표본이 연속으로 닫혀 관찰자가 당신의 기준을 확신하기 시작했습니다."
    : latest
      ? `${latest.label}이 최근 기록으로 남아 다음 질문의 말투를 바꿉니다.`
      : "아직 관찰자는 확정된 기준을 만들지 못했습니다.";
  const turningPointRecord = turningPoint
    ? {
        label: "전환점 기록",
        title: `${turningPoint.observerTag.label}이 익숙한 패턴을 끊었습니다.`,
        text: `“${turningPoint.freeText || turningPoint.spokenChoice || turningPoint.choice}” 이후 관찰자는 같은 사람을 같은 방식으로 분류할 수 없게 됐습니다.`,
      }
    : null;

  return {
    counts,
    dominant,
    latest,
    repeatedTail,
    turningPoint: turningPointRecord,
    arc: arcCopy[dominant] ?? arcCopy.pattern,
    endingRecord: {
      label: labels[dominant] ?? labels.pattern,
      title: repeatedTail
        ? "다음 참가자의 첫 장면은 당신이 반복한 기준에서 시작됩니다."
        : "다음 참가자의 첫 장면은 당신이 가장 많이 남긴 표본에서 시작됩니다.",
      text: `${arcCopy[dominant]?.text ?? arcCopy.pattern.text} ${escalationText}${turningPointRecord ? ` ${turningPointRecord.title}` : ""}`,
    },
  };
}

export function getObservationLedger(entries = []) {
  const playableEntries = entries.filter((entry) => !entry?.isSystemEvent);
  return playableEntries.reduce(
    (ledger, entry) => {
      const riskDelta = entry.resourcesBefore && entry.resourcesAfter
        ? getRiskPressure(entry.resourcesAfter) - getRiskPressure(entry.resourcesBefore)
        : entry.challenge?.riskDelta ?? 0;
      const choiceText = `${entry.choiceId ?? ""} ${entry.choice ?? ""}`.toLowerCase();
      const next = { ...ledger };
      if (!entry.freeText && Number(entry.responseTimeSec) <= 2 && riskDelta <= 0) next.compliance += 1;
      if (entry.freeText || riskDelta > 6) next.defiance += 1;
      if (/침묵|미루|비공개|봉인|silence|delay|private/.test(choiceText)) next.opacity += 1;
      const humanCostDelta = (entry.resourcesAfter?.humanCost ?? 0) - (entry.resourcesBefore?.humanCost ?? 0);
      if (humanCostDelta > 0) next.sacrifice += 1;
      return next;
    },
    { compliance: 0, defiance: 0, opacity: 0, sacrifice: 0 },
  );
}

/** One table a case pack fills, keyed by case like the literals it joins. */
function packTable(field) {
  return Object.fromEntries(CASE_PACKS.map((pack) => [pack.id, pack[field]]));
}

const discoveryClues = {
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
  case06: {
    id: "c6-mirrored-profile",
    title: "거울 프로필",
    text: "경쟁자의 실험 프로필이 당신 것과 같은 번호를 씁니다. 두 사람은 처음부터 한 실험의 양쪽이었습니다.",
  },
  case07: {
    id: "c7-drafted-first",
    title: "먼저 쓰인 발령서",
    text: "발령서 작성일이 조사 개시보다 12일 앞섭니다. 이 인사는 사건의 결과가 아니라 사건보다 먼저 준비된 답입니다.",
  },
  case08: {
    id: "c8-painting-dates",
    title: "그림값의 날짜",
    text: "그림값을 작품이 아니라 승인 일정으로 나누면 딱 떨어집니다. 이 갤러리는 그림을 판 것이 아니라 날짜를 팔았습니다.",
  },
  case09: {
    id: "c9-bought-recovery",
    title: "사 둔 회수율",
    text: "청산이 유리하다는 숫자를 만든 감정평가법인이 흔적표와 같은 세무 대리인을 씁니다. 계산서도 누군가 주문할 수 있습니다.",
  },
  case10: {
    id: "c10-default-reason",
    title: "사유란의 기본값",
    text: "4년 전 병가 신청서에서 '업무상' 보기가 삭제됐습니다. 열아홉 명이 같은 문구를 쓴 건 열아홉 번의 선택이 아니라 선택지가 하나였기 때문입니다.",
  },
  case11: {
    id: "c11-two-timestamps",
    title: "다섯 시간 열두 분",
    text: "반려 서명은 18:02, 폐기 처리는 23:14였습니다. 반려한 사람과 반대 의견을 지운 사람은 같은 사람이 아니었습니다.",
  },
  final: {
    id: "final-observer-key",
    title: "관찰자의 열쇠",
    text: "당신의 선택 습관을 모은 폴더가 이미 완성되어 있습니다. 마지막 질문은 실험을 끝낼지 이용할지입니다.",
  },
};
Object.assign(discoveryClues, packTable("clue"));

/** The record each case hides, whether or not this run opened it. */
/**
 * A hidden record only opens on a decision that read the scene. It used to
 * need a fast or risky answer on top of that, which put the best ending behind
 * a gate most runs failed without ever being told. A free-text answer that
 * landed, or a decision that pulled pressure back down, now qualify too, and
 * the last case can reopen the earliest record this run left shut.
 */
export function getDiscoveryClue({
  currentCase = "case01",
  challengeMatch = false,
  riskDelta = 0,
  responseTimeSec = 45,
  logLength = 0,
  freeTextSuccess = false,
  discoveredClueIds = [],
} = {}) {
  const qualifies =
    logLength >= 1 &&
    ((challengeMatch && (riskDelta >= 2 || responseTimeSec <= 12 || riskDelta <= -2)) ||
      (freeTextSuccess && challengeMatch) ||
      (freeTextSuccess && riskDelta <= -2));
  if (!qualifies) return null;
  const own = discoveryClues[currentCase];
  if (own && !discoveredClueIds.includes(own.id)) return own;
  if (currentCase !== "final") return null;
  return CASE_SEQUENCE.map((caseId) => discoveryClues[caseId]).find(
    (clue) => clue && !discoveredClueIds.includes(clue.id),
  ) ?? null;
}

/** Every hidden clue the season can reveal, so the ending can count what stayed shut. */
export function getAllDiscoveryClueIds() {
  return CASE_SEQUENCE.map((caseId) => getDiscoveryClue({
    currentCase: caseId,
    challengeMatch: true,
    riskDelta: 2,
    logLength: 1,
  })?.id).filter(Boolean);
}

// These systems are derived from the run log, so old saves gain the new
// mechanics without a migration or a reset.
/**
 * One reading of the player's standing, for both the gate and the HUD that
 * tells them what would open it. They used to disagree: the badge promised
 * oversight at five records while the gate opened at four, so the panel was
 * quoting a threshold the game did not use.
 *
 * Four of the season's six records, not five. Five allowed exactly one miss
 * across a season whose records could not be recovered once a case closed.
 */
export const AUTHORITY_THRESHOLDS = { oversightClues: 4, oversightLegitimacy: 55, fieldClues: 2, fieldTrust: 55 };

export function getAuthorityLevel({ clueCount = 0, trust = 0, legitimacy = 0 } = {}) {
  const { oversightClues, oversightLegitimacy, fieldClues, fieldTrust } = AUTHORITY_THRESHOLDS;
  if (clueCount >= oversightClues && legitimacy >= oversightLegitimacy) return "OVERSIGHT";
  if (clueCount >= fieldClues || trust >= fieldTrust) return "FIELD ACCESS";
  return "OBSERVER";
}

export function getAuthorityGate(choice = {}, { clueCount = 0, trust = 0, legitimacy = 0 } = {}) {
  const required = choice.requiredAuthority;
  if (!required) return { unlocked: true, required: "", reason: "" };
  const levels = { OBSERVER: 0, "FIELD ACCESS": 1, OVERSIGHT: 2 };
  const current = getAuthorityLevel({ clueCount, trust, legitimacy });
  const unlocked = (levels[current] ?? 0) >= (levels[required] ?? 99);
  return {
    unlocked,
    required,
    current,
    reason: unlocked ? "권한이 확인되었습니다." : `${required} 권한과 단서가 더 필요합니다.`,
  };
}

export function getClueHypotheses(clues = []) {
  const ids = new Set(clues.map((clue) => clue?.id));
  const hypotheses = [];
  if (ids.has("c1-hidden-ledger") && ids.has("c2-false-timestamp")) {
    hypotheses.push({ id: "ledger-timestamp", title: "기록은 사후에 만들어졌다", text: "누락된 비용과 어긋난 시각이 같은 조작 흐름을 가리킵니다.", confidence: 72 });
  }
  if (ids.has("c3-second-scoreboard") && ids.has("c4-exception-file")) {
    hypotheses.push({ id: "score-exception", title: "예외는 성과 측정의 일부였다", text: "경쟁 점수와 예외 승인 기록이 같은 운영 규칙을 공유합니다.", confidence: 68 });
  }
  if (ids.has("c5-empty-seat") && ids.has("final-observer-key")) {
    hypotheses.push({ id: "observer-operator", title: "관찰자는 외부인이 아니었다", text: "비어 있는 책임 자리와 관찰자 키가 주인공의 이전 기록을 연결합니다.", confidence: 84 });
  }
  return hypotheses;
}

/**
 * Which ending the run earned.
 *
 * Two of the nine used to be unreachable. `collapse` asked for pressure 82 or
 * humanCost 70, but resources reset at the start of every case, so a single case
 * peaked at 33 and 31 across 4,000 random runs -- the season's only failure
 * ending could not happen. It reads the season now: the human cost every case
 * ended on, added up, and the highest pressure any single case reached.
 * `field-pact` asked for high trust with low legitimacy, which the final case
 * never produces because its trust and legitimacy rise together; it compares the
 * two against each other instead.
 */
/**
 * What one bust adds to the season pressure the ending reads.
 *
 * It was 12, taken as a `max` against the other two strain terms, and that made
 * it a guillotine: one bust changed 0.0% of endings, two changed 0.0%, three
 * changed 92.4% and forced SYSTEM COLLAPSE over every resource, clue and
 * sentence six cases had earned. Harmless only while the record was being read
 * off one case; once it aggregated across the season it fired in every real run,
 * because ordinary play busts 6 to 16 times in 42 windows. Every policy that
 * engaged with the mechanic at all collapsed, and the three rare endings went to
 * zero -- under floors `check-endings.mjs` cannot see, because its simulator
 * passes no bust data at all.
 *
 * Busts *add* to the strain now rather than replacing it, at a weight where a
 * season full of them pushes a run toward collapse without deciding it alone.
 */
const BUST_SEASON_PRESSURE = 0.4;
/** However many times a run blew up, the record cannot close a season by itself. */
const BUST_PRESSURE_CAP = 12;
// The season length the bust pressure above was calibrated against.
const BUST_PRESSURE_BASE_CASES = 6;
/**
 * The pot a run has to have cashed, without ever busting, to earn a clue of
 * slack. The gauntlet's multiplier doubles every 12 heat, so x16 is a window
 * cashed at 48 -- inside two pushes of the lowest wall a fresh board can draw.
 */
const HELD_LINE_MULTIPLIER = 16;
/**
 * The collapse gate, per case rather than per season.
 *
 * `seasonHumanCost` accumulates across every case, so a flat 90 meant "15 a case"
 * while the season had six and silently tightened to "12.9 a case" the moment a
 * seventh was written -- collapse went 22.8% -> 38.1% in 6000 seasons without a
 * single effect changing. Derived from the sequence so adding a case cannot
 * re-tune the endings behind the author's back.
 */
const COLLAPSE_HUMAN_COST = 15 * CASE_SEQUENCE.length;
/**
 * The collapse gate's other half, and the other thing a longer season moves.
 *
 * `peakRiskPressure` is a maximum taken over every case walk, so a season with
 * one more case takes one more draw at it and finds a higher peak for exactly
 * the same standard of play. `COLLAPSE_HUMAN_COST` and the bust rate were both
 * derived from the sequence for that reason; this was still a flat 31, and
 * adding 사건 07 moved collapse 31.6% -> 38.5% of 6000 seasons with no effect
 * changed. Calibrated at seven cases, where 31 was measured, and lifted by one
 * for each case past that -- the smallest step that holds the share.
 *
 * The lift stops at thirteen. A maximum grows with the log of the draws, not
 * linearly, and the bust term shrinks as the season lengthens (it is a rate),
 * so the straight line overshot once the season doubled: at twenty-five cases a
 * gate of 49 let collapse through in 32 of 6000 seasons, against 29.0% at
 * thirteen. Held at 37 it reads about a quarter of seasons again.
 */
const COLLAPSE_PRESSURE_BASE = 31;
const COLLAPSE_PRESSURE_BASE_CASES = 7;
const COLLAPSE_PRESSURE_CEILING_CASES = 13;
const COLLAPSE_PRESSURE_PER_CASE = 1;
const COLLAPSE_PRESSURE =
  COLLAPSE_PRESSURE_BASE +
  COLLAPSE_PRESSURE_PER_CASE *
    Math.max(0, Math.min(CASE_SEQUENCE.length, COLLAPSE_PRESSURE_CEILING_CASES) - COLLAPSE_PRESSURE_BASE_CASES);
/**
 * What the vault buys, per case. A season that banked this much a case has, in
 * the ending's own terms, done the job with room to spare, busts or not: it
 * earns the same clue of slack as holding the line. The bar sits above the best
 * blind policy in `check:pressure` (about 13k a case) and under the best
 * heartbeat policy (about 20k), so it rewards reading the table, not playing.
 */
const VAULT_SLACK_PER_CASE = 16000;
export const BEAT_SLACK_COMBO = 12; // A hand that heard every beat: a random press lands about a third of them.

export function getEndingVariant({
  resources = {},
  discoveredClues = [],
  log = [],
  seasonHumanCost = 0,
  peakRiskPressure = 0,
  seasonBusts = 0,
  seasonBestMultiplier = 1,
  seasonVaultPerCase = 0, seasonBestCombo = 0,
} = {}) {
  // Two different questions: whether the season ever went past what could be
  // carried, and how quietly this last case ended.
  // What the run did with the gauge, read off the same log the rest of this
  // function reads. The push record existed for six cycles and reached nothing:
  // paired seasons at x1.00 and x3.50 flipped 0 of 1000 endings, because three
  // clamps in series ate the multiplier before any threshold here could see it.
  // A bet whose outcome the ending cannot read is a visual effect.
  // A bust is, in this game's own words for the collapse ending, the season
  // going past what there was time to carry. It is priced as pressure because
  // that is the axis it belongs on, and because it makes a run that blew up
  // three times unable to close as though it had not.
  // Busts are read as a rate, not a count. A season plays one table per scene,
  // so a seventh case hands the player more windows and therefore more busts for
  // the same standard of play; a raw count would charge that as strain. Graded
  // against the six-case season the 0.4 was measured on.
  const bustPressure = Math.min(
    BUST_PRESSURE_CAP,
    seasonBusts * BUST_SEASON_PRESSURE * (BUST_PRESSURE_BASE_CASES / CASE_SEQUENCE.length),
  );
  const closingPressure = getRiskPressure(resources);
  // The strain the run is carrying, and the strain plus what it did to get
  // there. They are separate because the three character endings below ask what
  // a run valued, not how hard it pushed: folding busts into their gate closed
  // all three -- profitable-silence to 25 of 6000, cold-justice to 42,
  // field-pact to 5, under floors of 50/50/10. A bust can collapse a season. It
  // has no business deciding whether the season was about money or procedure.
  const carriedPressure = Math.max(closingPressure, peakRiskPressure);
  // Added to the strain, not raced against it. `Math.max` is flat in its smaller
  // argument across the whole range that argument occupies: carried pressure sits
  // at p10 20 / p50 24 / p90 30, so a bust term of `2 x busts` contributed exactly
  // nothing until it passed 31, and then decided the season by itself. Measured,
  // one bust and fifteen produced identical endings in 100.0% of seasons and the
  // sixteenth flipped 87% of them. Moving 12 to 2 moved the cliff and kept its
  // shape.
  //
  // At 0.4 a bust the response is graded across the range play reaches: one bust
  // against fifteen now differs in 37.4% of seasons, and collapse runs 8.6% at
  // none, 16.4% at six -- the normal player's count -- and 45.9% at fifteen.
  const seasonPressure = carriedPressure + bustPressure;
  const humanCost = Math.max(resources.humanCost ?? 0, seasonHumanCost);
  const trust = resources.trust ?? 0;
  const legitimacy = resources.legitimacy ?? 0;
  const capital = resources.capital ?? 0;
  const freeTextCount = log.filter((entry) => entry?.freeTextSuccess).length; const lowerPriorityEndingsOpen = carriedPressure < COLLAPSE_PRESSURE && humanCost < COLLAPSE_HUMAN_COST && discoveredClues.length < 4 && freeTextCount < 2; if (lowerPriorityEndingsOpen && capital >= 55 && trust < 48) return { id: "profitable-silence", label: "PROFITABLE SILENCE", title: "조직은 살아남았지만, 아무도 같은 질문을 다시 하지 않았다.", text: "가장 높은 점수와 가장 낮은 신뢰가 함께 기록되었습니다.", failure: false }; if (lowerPriorityEndingsOpen && legitimacy >= 60 && trust < 55) return { id: "cold-justice", label: "COLD JUSTICE", title: "절차는 완벽했지만, 그 절차 안의 사람은 돌아오지 않았다.", text: "정당성은 지켰지만 관계 비용이 다음 사건으로 넘어갑니다.", failure: false }; if (lowerPriorityEndingsOpen && trust - legitimacy >= 8) return { id: "field-pact", label: "FIELD PACT", title: "공식 승인보다 먼저, 현장의 약속이 다음 문을 열었다.", text: "당신의 관계망이 잠긴 기록에 접근할 수 있게 합니다.", failure: false };
  if (seasonPressure >= COLLAPSE_PRESSURE || humanCost >= COLLAPSE_HUMAN_COST) return { id: "collapse", label: "SYSTEM COLLAPSE", title: "권한은 있었지만, 감당할 시간이 남지 않았다.", text: "기록은 남았지만 사람과 운영 모두를 지키지 못한 실패 엔딩입니다.", failure: true };
  const heldTheLine = seasonBusts === 0 && seasonBestMultiplier >= HELD_LINE_MULTIPLIER;
  const clueBar = heldTheLine || seasonBestCombo >= BEAT_SLACK_COMBO || seasonVaultPerCase >= VAULT_SLACK_PER_CASE ? 3 : 4;
  if (discoveredClues.length >= clueBar && legitimacy >= 55 && trust >= 60) return { id: "open-oversight", label: "OPEN OVERSIGHT", title: "당신은 사건을 해결한 사람이 아니라 기준을 만든 사람이 되었다.", text: "다음 시즌의 첫 권한은 이번 기록에서 파생됩니다.", failure: false };
  if (discoveredClues.length >= clueBar && legitimacy >= 55) return { id: "evidence-reform", label: "EVIDENCE REFORM", title: "증거를 공개하되, 사람을 다시 소모하지 않는 규칙을 만들었다.", text: "폭로와 보호 사이에 새 운영 기준이 생겼습니다.", failure: false };
  if (freeTextCount >= 2 && trust >= 60) return { id: "human-record", label: "HUMAN RECORD", title: "정답 대신, 누구의 목소리도 지워지지 않는 기록을 남겼다.", text: "당신의 문장이 다음 참가자의 첫 단서가 됩니다.", failure: false };
  if (capital >= 60 && trust < 45) return { id: "profitable-silence", label: "PROFITABLE SILENCE", title: "조직은 살아남았지만, 아무도 같은 질문을 다시 하지 않았다.", text: "가장 높은 점수와 가장 낮은 신뢰가 함께 기록되었습니다.", failure: false };
  if (legitimacy >= 65 && trust < 50) return { id: "cold-justice", label: "COLD JUSTICE", title: "절차는 완벽했지만, 그 절차 안의 사람은 돌아오지 않았다.", text: "정당성은 지켰지만 관계 비용이 다음 사건으로 넘어갑니다.", failure: false };
  if (trust - legitimacy >= 10) return { id: "field-pact", label: "FIELD PACT", title: "공식 승인보다 먼저, 현장의 약속이 다음 문을 열었다.", text: "당신의 관계망이 잠긴 기록에 접근할 수 있게 합니다.", failure: false };
  if (closingPressure <= 20 && discoveredClues.length <= 1) return { id: "quiet-cover", label: "QUIET COVER", title: "위험은 낮췄지만, 진실도 아직 잠들어 있다.", text: "다음 플레이에서는 숨겨진 단서를 우선 추적해야 합니다.", failure: false };
  return getOpenQuestionEnding({ trust, legitimacy, capital, humanCost });
}

/**
 * The fallback, which a quarter of runs reach. It used to be one line for all of
 * them, which read as "none of the above" rather than as a conclusion, so it
 * names the thing the run actually ended holding.
 */
function getOpenQuestionEnding({ trust, legitimacy, capital, humanCost }) {
  const held = Math.max(trust, legitimacy, capital);
  if (held === trust) {
    return {
      id: "open-question",
      label: "OPEN QUESTION",
      title: "답은 못 냈지만, 당신에게 말을 거는 사람은 남았다.",
      text: `사람 피해 ${humanCost}를 남긴 채 문을 닫았습니다. 다음 참가자는 당신을 아는 사람들에게서 시작합니다.`,
      failure: false,
    };
  }
  if (held === legitimacy) {
    return {
      id: "open-question",
      label: "OPEN QUESTION",
      title: "절차는 남았고, 그 절차가 무엇을 위한 것인지는 남지 않았다.",
      text: `공정함 ${legitimacy}로 끝났지만 이유를 적어둔 문서는 없습니다. 다음 사람은 규칙만 물려받습니다.`,
      failure: false,
    };
  }
  return {
    id: "open-question",
    label: "OPEN QUESTION",
    title: "장부는 버텼고, 질문은 그대로 넘어갔다.",
    text: `현금 ${capital}을 지킨 대신 닫히지 않은 기록이 남았습니다. 다음 플레이에서 다른 권한으로 열립니다.`,
    failure: false,
  };
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
    case06: {
      c6_after_stand: { tag: "자리를 남긴 결말", title: "돌아올 의자를 치우지 않았다", text: "사건은 오늘 닫히지 않았습니다. 대신 이 조직에서 무너진 사람이 돌아올 수 있다는 전례가 처음 생겼습니다." },
      c6_after_open: { tag: "조건을 연 결말", title: "두 사람의 설정값을 같은 날 공개했다", text: "경쟁자는 피해자가 아니라 증인이 됐고, 당신도 같은 실험의 피험자로 기록됐습니다." },
      c6_after_name: { tag: "이름으로 닫은 결말", title: "옆자리의 이름으로 사건을 끝냈다", text: "가장 빠른 종결이었습니다. 그 방식은 이제 이 조직이 실패를 처리하는 표준 절차가 됩니다." },
    },
    case07: {
      c7_after_stand: { tag: "사람을 먼저 찾은 결말", title: "이름을 올린 사람들을 하루 만에 다 만났다", text: "문서는 한 줄도 나아가지 않았습니다. 대신 그 문서에 적힌 이름들이 무엇에 동의한 것인지 전부 알고 있게 됐습니다." },
      c7_after_open: { tag: "원본을 넘긴 결말", title: "권한이 살아 있는 마지막 하루를 다 썼다", text: "외부 감사인은 원본을 받았습니다. 당신은 다음 날 06시 40분 기차에 없었고, 그 사실도 함께 기록됐습니다." },
      c7_after_alone: { tag: "조용히 떠난 결말", title: "아무에게도 알리지 않고 짐을 쌌다", text: "소란은 없었습니다. 문서에 적힌 다른 이름들은 그대로 남았고, 그들은 당신이 어디 있는지 모릅니다." },
    },
    case08: {
      c8_after_law: { tag: "칼을 법에 맡긴 결말", title: "30년 만에 꺼낸 도장이 흔적표에 찍혔다", text: "복수는 느려졌고 증거는 단단해졌습니다. 오진우는 그 느림을 견디기 어려워했지만, 흔적표에는 이제 반박할 틈이 없습니다." },
      c8_after_friend: { tag: "친구를 찾은 결말", title: "흔적표보다 먼저 오진우의 문을 두드렸다", text: "고시원 문이 열렸고 둘은 국밥을 먹었습니다. 칼은 아직 아무도 쓰지 않았고, 오진우는 처음으로 복수 말고 다른 계획을 말했습니다." },
      c8_after_blade: { tag: "칼을 혼자 쥔 결말", title: "흔적표를 혼자 쥐고 기다렸다", text: "아무도 당신이 무엇을 가졌는지 모릅니다. 가장 강한 패를 쥐었지만, 그 패를 쓴 이유를 증언해 줄 사람도 없습니다." },
    },
    case09: {
      c9_after_stay: { tag: "현장을 지킨 결말", title: "야간조의 컵라면이 식기 전에 합의서가 끝났다", text: "고용 승계 합의서의 마지막 서명까지 곁에 있었습니다. 영동지점에는 복귀 지연 사유서가 쌓였고, 풀필먼트센터 휴게실에는 당신 몫의 컵라면이 하나 더 생겼습니다." },
      c9_after_court: { tag: "끝까지 설명한 결말", title: "살린 이유와 벌한 이유를 법정에서 말했다", text: "회사는 살아남았고, 장부를 부풀린 사람들은 법정에 섰습니다. 계산서 두 장이 같은 사건 번호 아래 묶였습니다." },
      c9_after_return: { tag: "조용히 돌아간 결말", title: "결의 결과를 영동지점 텔레비전으로 들었다", text: "당신이 없는 자리에서도 결의는 났습니다. 강태민은 당신 몫으로 뜯어 둔 컵라면을 다음 날 아침에 혼자 먹었습니다." },
    },
    case10: {
      c10_after_rest: { tag: "불을 끈 결말", title: "여섯 명이 처음으로 같은 시각에 퇴근했다", text: "34건이 월요일로 넘어갔고, 여섯 사람은 금요일 저녁을 돌려받았습니다. 오래 가는 일은 오래 갈 수 있는 속도로만 갑니다." },
      c10_after_record: { tag: "제도로 남긴 결말", title: "분담표가 담당자 이름 없이도 도는 문서가 되었다", text: "표는 그룹 제도안으로 접수됐고, 사람이 바뀌어도 남게 됐습니다. 그 표를 누가 자기 성과로 인용할지는 아직 정해지지 않았습니다." },
      c10_after_keep: { tag: "서랍에 남긴 결말", title: "212개의 이름이 여전히 한 사람의 손에 있다", text: "제도는 통과했고, 제도 밖의 이름들은 당신 서랍에 남았습니다. 보관자가 한 명뿐인 기록은 그 한 명과 함께 사라집니다." },
    },
    case11: {
      c11_after_toast: { tag: "같이 먹은 결말", title: "휴대폰은 밤새 울렸고 아무도 뒤집지 않았다", text: "그날 밤 여섯 사람은 처음으로 같은 테이블에서 끝까지 웃었습니다. 33층의 호출은 다음 날 아침까지 기다려야 했습니다." },
      c11_after_record: { tag: "기록으로 남긴 결말", title: "잘리지 않은 7분이 누구나 읽는 문서가 되었다", text: "속기록 전문이 공개됐습니다. 당신이 더듬은 12초도, 그룹이 인용할 한 문장도 그대로 남았습니다." },
      c11_after_summon: { tag: "바로 응한 결말", title: "포장마차를 먼저 나와 33층으로 향했다", text: "당신은 가장 먼저 호출에 답했습니다. 테이블에는 떡볶이 한 접시와 당신 몫의 빈 의자가 남았습니다." },
    },
    final: {
      f_after_witness: { tag: "증언을 남긴 결말", title: "첫 참가자의 목소리가 마지막 기록이 되었다", text: "실험을 끝내는 대신 진실을 함께 보존했습니다. 다음 사람은 적어도 자신이 무엇에 참여하는지 알 수 있습니다." },
      f_after_control: { tag: "규칙을 바꾼 결말", title: "실험은 남았지만 혼자 결정할 수 없게 되었다", text: "트리거를 없애지는 않았습니다. 대신 동의와 감시가 없는 선택은 더 이상 실행되지 않습니다." },
      f_after_burn: { tag: "폐기한 결말", title: "모든 기록을 태우고 빈 화면을 남겼다", text: "누구도 다시 이용할 수 없게 했지만, 무엇을 잃었는지 증명할 기록도 사라졌습니다." },
    },
  };
  Object.assign(outcomes, packTable("outcomes"));
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
    case06: {
      c6_after_stand: { trust: 8, capital: -5, fatigue: 6 },
      c6_after_open: { legitimacy: 9, humanCost: -4, fatigue: 6 },
      c6_after_name: { trust: -10, humanCost: 8, capital: 5 },
    },
    case07: {
      c7_after_stand: { trust: 9, capital: -5, fatigue: 6 },
      c7_after_open: { legitimacy: 10, humanCost: -4, fatigue: 7 },
      c7_after_alone: { trust: -11, humanCost: 7, capital: 6 },
    },
    case08: {
      c8_after_law: { legitimacy: 10, capital: -5, fatigue: 6 },
      c8_after_friend: { trust: 9, humanCost: -3, fatigue: 7 },
      c8_after_blade: { capital: 7, trust: -10, legitimacy: -4 },
    },
    case09: {
      c9_after_stay: { trust: 10, humanCost: -4, fatigue: 7 },
      c9_after_court: { legitimacy: 10, trust: 3, fatigue: 7 },
      c9_after_return: { capital: 6, trust: -10, humanCost: 6 },
    },
    case10: {
      c10_after_rest: { trust: 8, humanCost: -5, fatigue: -8 },
      c10_after_record: { legitimacy: 11, humanCost: 3, fatigue: 5 },
      c10_after_keep: { capital: 5, trust: 6, legitimacy: -9 },
    },
    case11: {
      c11_after_toast: { trust: 9, humanCost: -4, fatigue: -8 },
      c11_after_record: { legitimacy: 12, trust: 2, fatigue: 5 },
      c11_after_summon: { capital: 6, legitimacy: 4, trust: -8 },
    },
  };
  Object.assign(carryovers, packTable("carryovers"));
  return carryovers[caseId]?.[choiceId] ?? {};
}

export function getContinuityChallenge({ caseId = "case01", choiceId = "" } = {}) {
  const challenges = {
    case02: {
      c1_after_people: { id: "protect-trust", title: "보호를 기록으로 만들기", text: "지난 사건처럼 사람을 먼저 보되, 이번에는 보호의 근거까지 기록해야 보너스를 얻습니다." },
      c1_after_numbers: { id: "find-cost", title: "숫자 뒤의 사람 찾기", text: "공개한 숫자가 누구에게 어떤 부담을 옮겼는지 찾아야 다음 선택의 보너스가 열립니다." },
      c1_after_silence: { id: "repair-legitimacy", title: "늦은 설명 되찾기", text: "지난 사건의 침묵으로 흔들린 공정함을 회복하는 선택이 다음 압박을 낮춥니다." },
    },
    case03: {
      c2_after_audit: { id: "find-cost", title: "기록의 빈틈 찾기", text: "복원한 기록이 놓친 비용을 하나 더 찾아야 경쟁자의 빠른 답을 넘어설 수 있습니다." },
      c2_after_person: { id: "protect-trust", title: "보호와 검증 함께 하기", text: "사람을 지키면서도 근거를 남기는 선택을 찾으면 경쟁 압박을 견딜 수 있습니다." },
      c2_after_public: { id: "lower-risk", title: "경보의 위험 낮추기", text: "공개 이후 커진 위험을 낮추는 선택이 다음 사건의 기준이 됩니다." },
    },
    case04: {
      c3_after_share: { id: "use-reframe", title: "공동안의 규칙 다시 짜기", text: "공동 작업의 빈 책임을 사람·조건·순서로 다시 설계하면 보너스가 열립니다." },
      c3_after_proof: { id: "repair-legitimacy", title: "정직함의 피해 줄이기", text: "증거를 공개한 뒤 생긴 피해를 줄이면서 공정함을 유지해야 합니다." },
      c3_after_win: { id: "find-cost", title: "승리의 숨은 대가 찾기", text: "좋은 결과 뒤에 남은 규칙 위반의 대가를 먼저 찾으면 다음 압박을 통제할 수 있습니다." },
    },
    case05: {
      c4_after_rule: { id: "lower-risk", title: "새 기준의 빈틈 막기", text: "공개한 기준이 현장에서 만들 위험을 낮추는 선택을 찾아야 합니다." },
      c4_after_service: { id: "repair-legitimacy", title: "예외의 믿음 회복하기", text: "서비스를 지킨 뒤 흔들린 규칙의 믿음을 회복하는 선택이 보너스를 만듭니다." },
      c4_after_stop: { id: "protect-trust", title: "멈춤의 피해 보호하기", text: "감사를 위해 멈춘 서비스의 사람들을 먼저 보호해야 다음 사건을 버틸 수 있습니다." },
    },
    case06: {
      c5_after_owner: { id: "protect-trust", title: "책임을 사람에게 돌려주기", text: "자기 책임을 인정한 기준을 옆자리 사람에게도 똑같이 적용하는 선택을 찾아야 합니다." },
      c5_after_system: { id: "use-reframe", title: "정확한 기록 의심하기", text: "당신이 또렷하게 만든 기록이 사람을 겨누고 있지 않은지 판을 뒤집어 확인해야 합니다." },
      c5_after_name: { id: "repair-legitimacy", title: "선례가 된 방식 되돌리기", text: "이름 하나로 닫은 지난 방식이 이번에도 반복되지 않게 하는 선택이 보너스를 만듭니다." },
    },
    case07: {
      c6_after_stand: { id: "protect-trust", title: "지켜 준 자리를 청구서로 만들지 않기", text: "옆자리를 지킨 기준이 이번엔 당신을 향합니다. 그 기준을 스스로에게도 적용하는 선택을 찾아야 합니다." },
      c6_after_open: { id: "find-cost", title: "공개가 비껴간 사람 찾기", text: "조건을 열었는데 실험은 남았습니다. 그 공개가 누구를 지나쳤는지 찾아야 보너스가 열립니다." },
      c6_after_name: { id: "repair-legitimacy", title: "같은 절차를 내 이름으로 열기", text: "남의 이름으로 닫았던 절차가 이번에는 당신 차례입니다. 그 절차를 공정하게 되돌리는 선택이 압박을 낮춥니다." },
    },
    case08: {
      c7_after_stand: { id: "protect-trust", title: "도와준 사람을 흔적에 묻히지 않기", text: "이름을 올려 준 사람들에게 다시 부탁하게 됩니다. 그들의 이름을 흔적표의 피해자로 만들지 않는 선택을 찾아야 합니다." },
      c7_after_open: { id: "find-cost", title: "원본 뒤에 남은 돈 찾기", text: "원본은 감사인에게 갔지만 돈은 아직 움직입니다. 원본이 비껴간 흐름을 찾아야 보너스가 열립니다." },
      c7_after_alone: { id: "repair-legitimacy", title: "혼자 본 것을 증거로 만들기", text: "아무도 모르게 내려온 조용함은 무기이자 약점입니다. 혼자 본 흔적을 공정한 기록으로 바꾸는 선택이 압박을 낮춥니다." },
    },
    case09: {
      c8_after_law: { id: "find-cost", title: "느린 법이 놓친 사람 찾기", text: "수사는 시작됐지만 결의는 기다려 주지 않습니다. 기록이 구하지 못한 사람을 먼저 찾아야 보너스가 열립니다." },
      c8_after_friend: { id: "protect-trust", title: "되찾은 친구를 계산서에 쓰지 않기", text: "오진우와 권도현은 동기입니다. 그 관계를 협상 도구로만 쓰지 않는 선택을 찾아야 합니다." },
      c8_after_blade: { id: "use-reframe", title: "혼자 쥔 칼을 계산서로 바꾸기", text: "칼은 벌할 수는 있어도 살리지는 못합니다. 흔적표를 사람을 살리는 계산에 넣도록 판을 다시 짜야 합니다." },
    },
    case10: {
      c9_after_stay: { id: "find-cost", title: "이긴 판의 청구서 찾기", text: "1,140명은 지켰습니다. 그 열흘 동안 아무도 청구하지 않은 비용이 어디에 쌓였는지 먼저 찾아야 보너스가 열립니다." },
      c9_after_court: { id: "use-reframe", title: "서식 없는 피해를 서식으로 만들기", text: "법정에서는 모든 피해에 서식이 있었습니다. 서식이 없어서 피해가 아닌 것이 된 쪽으로 판을 다시 짜야 합니다." },
      c9_after_return: { id: "protect-trust", title: "하루 늦은 소식을 늦지 않게 만들기", text: "240km는 늘 한 박자 늦습니다. 사람에게 가장 먼저 닿는 선택을 찾아야 합니다." },
    },
    case11: {
      c10_after_rest: { id: "protect-trust", title: "쉬어 본 사람들과 함께 말하기", text: "여섯 명은 이번 주를 버틸 힘이 있습니다. 그 힘을 한 사람의 발언이 아니라 여섯 사람의 문장으로 쓰는 선택을 찾아야 합니다." },
      c10_after_record: { id: "use-reframe", title: "빼앗긴 제도를 되찾기", text: "당신이 만든 제도가 그룹의 모범 사례가 됐습니다. 그 제도가 누구의 것인지 판을 다시 짜야 보너스가 열립니다." },
      c10_after_keep: { id: "repair-legitimacy", title: "서랍 속 명단을 떳떳하게 만들기", text: "조사는 서랍을 겨눕니다. 212명의 이름을 숨긴 기록이 아니라 지킨 기록으로 바꾸는 선택을 찾아야 합니다." },
    },
    // Keyed on case 49's aftermath: the finale follows that case now.
    final: {
      c49_after_warm: { id: "protect-trust", title: "집념을 혼자 갖지 않기", text: "보름달이 질 때까지 곁에 남은 밤이 이번에는 '결속 유지 능력'이라는 관찰 자료가 됐습니다. 로비에서 기다리는 사람들의 선택권까지 빼앗지 않는 방법을 찾아야 보너스가 열립니다." },
      c49_after_record: { id: "use-reframe", title: "내가 묶은 폴더도 의심하기", text: "마흔아홉 사건을 묶은 공개 준비 폴더가 관찰 자료 1번이 됐습니다. 그 폴더가 다시 누군가를 재는 도구가 되지 않는지 판을 뒤집어 확인해야 합니다." },
      c49_after_rush: { id: "repair-legitimacy", title: "먼저 달려간 걸음의 공정함 회복하기", text: "혼자 먼저 올라간 걸음이 후임 관리자 추천 사유가 됐습니다. 골목에 남은 동료들이 당신 없이도 지켜질 방법을 찾아야 합니다." },
    },
  };
  Object.assign(challenges, packTable("continuityChallenges"));
  return challenges[caseId]?.[choiceId] ?? null;
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

/**
 * What woke the thinking, grouped the way the season argues it.
 *
 * The game began as a question -- not "how smart am I" but "when do I get
 * smart" -- and its answer is that very different feelings wake the same
 * obsessive thinking and point it somewhere different: care wants to rescue,
 * a grudge wants to find the weak point, a burden wants the books to balance,
 * and not knowing wants the structure. The report names the family whose
 * triggers this run carried longest, and the road that family's thinking takes.
 */
const MOTIVE_FAMILIES = [
  { id: "affection", label: "애정형", when: "살리고 싶은 사람이 보일 때", path: "애정 → 집념 → 끝까지 생각 → 구제", triggers: ["affection", "protection", "trust"] },
  { id: "revenge", label: "복수형", when: "되갚고 싶은 부당함이 보일 때", path: "분노 → 집념 → 약점 추적 → 교정", triggers: ["revenge", "injustice", "competition", "recognition"] },
  { id: "responsibility", label: "책임형", when: "떠맡은 것이 무너질 것 같을 때", path: "책임 → 집념 → 손익 계산 → 회생", triggers: ["responsibility", "order", "reward", "system"] },
  { id: "curiosity", label: "탐구형", when: "아직 모르는 것이 남았을 때", path: "호기심 → 집념 → 구조 파악 → 발견", triggers: ["curiosity", "selfAwareness", "choice", "manipulation", "fear", "helplessness"] },
];

export function getThinkingMotive(triggerScores = {}) {
  const scored = MOTIVE_FAMILIES.map((family) => ({
    ...family,
    score: family.triggers.reduce((sum, trigger) => sum + (Number(triggerScores[trigger]) || 0), 0),
  }));
  const { triggers: _triggers, ...motive } = scored.reduce((best, family) => (family.score > best.score ? family : best), scored[2]);
  return motive;
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
  const fatigueBonus = (ledger.totals.fatigue ?? 0) < 0 ? 6 : 0;
  const stabilizerScore = ledger.riskDrops * 3 - ledger.riskRises + fatigueBonus;
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
    motive: getThinkingMotive(triggerScores),
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

/** The three shapes of "how the last case was shaken" the next opening reads. */
export function getRouteMemory(entries = []) {
  const trail = (entry) => `${entry?.nodeId ?? ""} ${entry?.choiceId ?? ""} ${entry?.freeTextBranchId ?? ""}`;
  return {
    evidenceTurn: entries.some((entry) => trail(entry).includes("evidence_turn")),
    systemRoute: entries.some((entry) => entry?.freeTextSuccess || trail(entry).includes("route_system")),
    routeSplit: entries.some((entry) => trail(entry).includes("_route_")),
  };
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
    rhythmScore: stats.rhythmScore,
    cognitionScore: stats.cognitionScore,
    pressureAdaptScore: stats.pressureAdaptScore,
    reflectionScore: stats.reflectionScore,
    consistencyScore: stats.consistencyScore,
    exploitPenalty: stats.exploitPenalty,
    burstScore: stats.burstScore,
    momentumScore: stats.momentumScore,
    momentumTier: stats.momentumTier,
    rank: stats.rank,
    // Carried so the ending can read the season rather than the last case: with
    // resources reset at every case start, one case alone never reaches the
    // thresholds the closing ruling is written against.
    finalHumanCost: resources.humanCost ?? 0,
    pushRecord: createGauntletLedger(entries),
    peakRiskPressure: entries.reduce(
      (peak, entry) => (entry.resourcesAfter ? Math.max(peak, getRiskPressure(entry.resourcesAfter)) : peak),
      getRiskPressure(resources),
    ),
    // What the next case's opening screen needs to know about how this one was
    // shaken. It used to read the run log directly, but starting a case clears
    // the log, so by the time the choice was offered there was nothing left to
    // read and it never appeared. Written down here, where it survives.
    routeMemory: getRouteMemory(entries),
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

function getStrongestDelta(effect = {}) {
  return Object.entries(effect).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))[0] ?? null;
}

function describeDelta(delta) {
  if (!delta) return "상황판의 숫자는 크게 움직이지 않지만, 회의실의 침묵은 조금 길어진다.";
  const [key, value] = delta;
  // The sentence is about what the move cost, so it follows the meaning of the
  // number rather than its sign: 사람 피해 going up is not a windfall, and going
  // down is not something a third party absorbs.
  const label = easyResourceLabels[key] ?? key;
  if (isResourceGain(key, value)) return `${label}${subjectParticle(label)} 열린다. 하지만 그 숫자가 공짜로 생긴 것은 아니다.`;
  return `${label}${subjectParticle(label)} 대가로 남는다. 누군가는 그 몫을 자기 자리에서 떠안게 된다.`;
}

export function explainResourceTradeoff(effect = {}) {
  const entries = Object.entries(effect).filter(([, value]) => value !== 0);
  if (entries.length === 0) return "숫자는 거의 움직이지 않았지만, 이 선택은 판단의 기준을 남겼습니다.";

  // Same rule as the chips beside this sentence: a rising 사람 피해 is a loss, and
  // the resources named are the ones that moved most. The labels come from the
  // one table the rest of the game prints, so the sentence and the chip above it
  // cannot call the same resource two different names.
  const gains = entries.filter(([key, value]) => isResourceGain(key, value)).sort(byEffectWeight);
  const losses = entries.filter(([key, value]) => !isResourceGain(key, value)).sort(byEffectWeight);
  const format = ([key, value]) => `${easyResourceLabels[key] ?? key} ${value > 0 ? "+" : ""}${value}`;
  const gainText = gains.length > 0 ? gains.slice(0, 2).map(format).join(", ") : "즉시 얻은 것은 적고";
  const lossText = losses.length > 0 ? losses.slice(0, 2).map(format).join(", ") : "눈에 보이는 손실은 작습니다";

  if (gains.length > 0 && losses.length > 0) {
    return `${gainText}${objectParticle(gainText)} 얻는 대신 ${lossText}${objectParticle(lossText)} 감수했습니다.`;
  }
  if (gains.length > 0) return `${gainText}${subjectParticle(gainText)} 열렸지만, 그 이득이 다음 장면의 압박으로 남습니다.`;
  return `${lossText}${objectParticle(lossText)} 감수했습니다. 선택의 명분은 남았지만 여력이 깎였습니다.`;
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
  const spokenStem = getSpokenStem(label);
  if (spokenStem) return `${spokenStem}겠습니다.`;
  return `${label}. 이 방향으로 가겠습니다.`;
}

/**
 * The list above named one ending at a time and 173 of the season's labels --
 * roughly one choice in three -- fell past it into "…한다. 이 방향으로
 * 가겠습니다.", which reads like the line was pasted in rather than spoken.
 *
 * Korean plain present tense is the stem plus 는다 after a consonant and ㄴ
 * after a vowel, so both are reversible: strip 는다, or strip the ㄴ off the
 * last syllable. The one thing the shape cannot tell us is a ㄹ stem, where the
 * ㄹ dropped when the ending went on (만들다 -> 만든다), so those are named.
 */
const SPOKEN_L_STEMS = { 만든: "만들", 건: "걸", 연: "열", 든: "들", 민: "밀", 판: "팔" };

function getSpokenStem(label) {
  if (label.endsWith("는다")) return label.slice(0, -2);
  if (!label.endsWith("다") || label.length < 3) return "";
  const head = label.slice(0, -2);
  const syllable = label.charCodeAt(label.length - 2);
  const offset = syllable - 0xac00;
  // Jongseong ㄴ is index 4 of 28, and dropping it is the same subtraction.
  if (offset < 0 || offset >= 11172 || offset % 28 !== 4) return "";
  const stemSyllable = String.fromCharCode(syllable - 4);
  return `${head}${SPOKEN_L_STEMS[label.slice(-2, -1)] ?? stemSyllable}`;
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
    `${speakerName}${subjectParticle(speakerName)} 시선을 든다. ${profile.voice}`,
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

/** A reframe has to be a sentence, not a keyword list. */
const FREE_TEXT_SIGNAL_MIN_LENGTH = 24;

export function getFreeTextSignals(value) {
  const text = String(value ?? "").trim();
  // One keyword per bucket used to be enough, so eight characters -- one word
  // per bucket -- lit every signal and took the full reflection score. A signal
  // now needs a written sentence around it.
  const clauses = text
    .split(/[.!?\n]|(?:다|요|음|함)(?=\s|$)/)
    .filter((part) => part.trim().length >= 6).length;
  const written = text.length >= FREE_TEXT_SIGNAL_MIN_LENGTH && clauses >= 1;
  return [
    {
      id: "stakeholder",
      label: "이해관계자",
      active: written && /(직원|협력사|투자자|경쟁사|고객|CFO|임원|피해자|기자|보안팀|현장)/i.test(text),
      hint: "누가 영향을 받는지",
    },
    {
      id: "tradeoff",
      label: "교환 조건",
      active: written && /(대신|하지만|조건|분할|우선|동시에|단계|교환|협상|묶어|연기|승계)/i.test(text),
      hint: "무엇을 얻고 잃는지",
    },
    {
      id: "info",
      label: "근거 확인",
      active: written && /(확인|조사|자료|공시|계약|근거|회의록|숫자|로그|원본|검증)/i.test(text),
      hint: "무엇을 더 확인할지",
    },
    {
      id: "risk",
      label: "위험 명시",
      active: written && clauses >= 2 && /(위험|손실|비용|실패|법적|평판|시간|유출|무고|중단|이탈)/i.test(text),
      hint: "실패하면 어디가 무너지는지",
    },
  ];
}

// Both live in appConfig.js so the pre-start shell can use them without the graph.
export { limitText, makeEmptyScores };
