import { createTableRecord } from "./gauntlet/gauntletEngine.js";
import { byEffectWeight, CASE_PACKS, CASE_SEQUENCE, characterProfiles, choiceVoiceLines, echoReplies, isResourceGain } from "./gameData.js";
import { ENDING_GATES } from "./gameConstants.js";
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
    ? `${pressure}${subjectParticle(pressure)} ${node.phase ?? "현재 국면"}에서 충돌합니다.`
    : `${node.phase ?? "현재 국면"}의 전제가 흔들립니다.`;
  // The one line of prose the table always shows, and it has to be the scene's
  // own: this template ran for every scene there was (149 then), so every window asked the same
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
  const scoreDelta = ([key, value]) => (isResourceGain(key, value) ? Math.abs(value) : -Math.abs(value));
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
      reframeCount: 0,
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
  const reframeCount = scoredEntries.filter((entry) => entry.reframe).length;
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
  // Showing your working, on the three surfaces that show it. A reframe that
  // actually opened the case's hidden route counts double the one that was
  // taken and lost to the wall, because the route is the reading the card was
  // for. This axis used to be scored from the keywords in a typed sentence,
  // which rewarded writing the four magic words over making the decision.
  const routesOpened = scoredEntries.filter((entry) => entry.reframeOpenedRoute).length;
  const recordsOpened = scoredEntries.filter((entry) => entry.clue).length;
  const reflectionScore = Math.round(
    clamp(reframeCount * 10 + routesOpened * 12 + challengeClearCount * 4 + recordsOpened * 10, 0, 100),
  );
  // Scored decisions only: a TABLE RECORD entry a slot restore carried in has no
  // response time, and each one used to read as a two-second click.
  const exploitPenalty = Math.min(
    18,
    scoredEntries.filter((entry) => (entry.responseTimeSec ?? 0) <= 2 && !entry.reframe).length * 5,
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
    reframeCount,
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
  if (entry.reframe) {
    return {
      id: "defiance",
      label: "거부 표본",
      text: "준비된 선택지 밖으로 나간 순간입니다. 다음 참가자의 사건에는 이 우회로가 새 조건으로 남습니다.",
    };
  }
  // 미루다 as it is actually conjugated on the cards: 미루고, 미룬다, 미룰, 미뤄, 미뤘다.
  if (/침묵|미[루룬룰뤄뤘]|비공개|봉인|silence|delay|private/.test(choiceText)) {
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
  // `every` is true of an empty list: a run with nothing decided was told the
  // observer had grown sure of it, and the line for that run was never reached.
  const repeatedTail = taggedEntries.length > 0 && taggedEntries
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
      ? `${latest.label}${subjectParticle(latest.label)} 최근 기록으로 남아 다음 질문의 말투를 바꿉니다.`
      : "아직 관찰자는 확정된 기준을 만들지 못했습니다.";
  const turningPointRecord = turningPoint
    ? {
        label: "전환점 기록",
        title: `${turningPoint.observerTag.label}${subjectParticle(turningPoint.observerTag.label)} 익숙한 패턴을 끊었습니다.`,
        text: `“${turningPoint.spokenChoice || turningPoint.choice}” 이후 관찰자는 같은 사람을 같은 방식으로 분류할 수 없게 됐습니다.`,
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
      if (!entry.reframe && Number(entry.responseTimeSec) <= 2 && riskDelta <= 0) next.compliance += 1;
      if (entry.reframe || riskDelta > 6) next.defiance += 1;
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

const discoveryClues = packTable("clue");

/**
 * The record each case hides, whether or not this run opened it.
 *
 * A hidden record only opens on a decision that read the scene. It used to
 * need a fast or risky answer on top of that, which put the best ending behind
 * a gate most runs failed without ever being told. A 판을 다시 짠다 that opened
 * the case's hidden route, or a decision that pulled pressure back down, now
 * qualify too, and the last case can reopen the earliest record this run left
 * shut.
 */
export function getDiscoveryClue({
  currentCase = CASE_SEQUENCE[0],
  challengeMatch = false,
  riskDelta = 0,
  responseTimeSec = 45,
  logLength = 0,
  reframeOpenedRoute = false,
  discoveredClueIds = [],
} = {}) {
  const qualifies =
    logLength >= 1 &&
    ((challengeMatch && (riskDelta >= 2 || responseTimeSec <= 12 || riskDelta <= -2)) ||
      (reframeOpenedRoute && challengeMatch) ||
      (reframeOpenedRoute && riskDelta <= -2));
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

/// These systems are derived from the run log, so old saves gain the new
// mechanics without a migration or a reset.
/**
 * One reading of the player's standing, for both the gate and the HUD that
 * tells them what would open it. They used to disagree: the badge promised
 * oversight at five records while the gate opened at four, so the panel was
 * quoting a threshold the game did not use.
 *
 * The counts were written for a season of six records ("four of six"). The
 * season has one record per case now -- 55 of them -- so four was met in the
 * 프롤로그 and never meant anything again. Given how many cases the run has
 * opened, oversight asks for a share of them (`oversightClueRate`), never fewer
 * than the old four; without it, the counts stand as a floor.
 */
export const AUTHORITY_THRESHOLDS = { oversightClues: 4, oversightClueRate: 0.6, oversightLegitimacy: 55, fieldClues: 2, fieldTrust: 55 };

/** How many cases the run has opened once `caseId` is on the table: its place in the season, from one. */
export const getCasesOpened = (caseId = "") => CASE_SEQUENCE.indexOf(caseId) + 1;

/** The clue counts the gate actually asks for, once the run has opened `casesOpened` cases. */
export function getAuthorityClueThresholds(casesOpened = 0) {
  const { oversightClues, oversightClueRate, fieldClues } = AUTHORITY_THRESHOLDS;
  const opened = Math.max(0, Math.trunc(Number(casesOpened) || 0));
  return { oversightClues: Math.max(oversightClues, Math.ceil(opened * oversightClueRate)), fieldClues };
}

export function getAuthorityLevel({ clueCount = 0, trust = 0, legitimacy = 0, casesOpened = 0 } = {}) {
  const { oversightLegitimacy, fieldTrust } = AUTHORITY_THRESHOLDS;
  const { oversightClues, fieldClues } = getAuthorityClueThresholds(casesOpened);
  if (clueCount >= oversightClues && legitimacy >= oversightLegitimacy) return "OVERSIGHT";
  if (clueCount >= fieldClues || trust >= fieldTrust) return "FIELD ACCESS";
  return "OBSERVER";
}

// A scene's lead card, the id a case closes on, and where a scene goes with
// nobody there to choose: rules that read one scene, kept with the season's
// other rules.
export { getLeadChoice, getOutcomeChoiceId, getUnattendedNext } from "./seasonRules.js";

export function getAuthorityGate(choice = {}, { clueCount = 0, trust = 0, legitimacy = 0, casesOpened = 0 } = {}) {
  const required = choice.requiredAuthority;
  if (!required) return { unlocked: true, required: "", reason: "" };
  const levels = { OBSERVER: 0, "FIELD ACCESS": 1, OVERSIGHT: 2 };
  const current = getAuthorityLevel({ clueCount, trust, legitimacy, casesOpened });
  const unlocked = (levels[current] ?? 0) >= (levels[required] ?? 99);
  return {
    unlocked,
    required,
    current,
    reason: unlocked ? "권한이 확인되었습니다." : `${required} 권한과 단서가 더 필요합니다.`,
  };
}

/**
 * Which ending the run earned, read off the season rather than its last case.
 *
 * Replayed through the runtime's own resolve path (`check:endings`), the gates
 * tuned for six cases closed 55 as SYSTEM COLLAPSE 67% of the time and OPEN
 * OVERSIGHT 30%, and five endings never: every season held more than four
 * records, so "fewer than four" was always shut; putting people first peaked
 * over the collapse line in 96% of seasons, because paying for people in time
 * and fatigue raises pressure; the finale's legitimacy closed at 100 and its
 * capital over 55 almost always; and burning every record could still close
 * as OPEN OVERSIGHT. So the ending reads the season's mean standing
 * (`seasonResources`), rates rather than counts, collapse as harm rather than
 * heat, and the finale's own answer.
 */
// The rest of the gates, on the season's mean closing values (p50s: trust 77,
// legitimacy 78, capital 93; legitimacy stays over 95 only chasing procedure,
// capital at 100 only chasing money). Slack at the table buys the lower record
// bar: no bust and a x16 cash (heat 44 at DOUBLING_HEAT 11), a combo of 12, or
// 19,500 a case banked -- between the best blind (15.4k) and heartbeat (24.6k)
// play check:pressure measures at nine windows a case (16,000 when it was 7).
const { collapseHarmPerCase: COLLAPSE_HARM_PER_CASE, collapseBustRate: COLLAPSE_BUST_RATE, collapseOverreachHarm: COLLAPSE_OVERREACH_HARM, clueRate: CLUE_RATE_BAR, oversightTrust: OVERSIGHT_TRUST } = ENDING_GATES;
const CLUE_RATE_SLACK_BAR = 0.8;
const QUIET_CLUE_RATE = 0.5; // under half the records the truth is still asleep,
const QUIET_SUSTAINED_PRESSURE = 12; // as it is when cases typically peak under 12 (p25 13)
const HUMAN_RECORD_REFRAME_RATE = 0.7; // a reframed route in seven cases of ten (p75 0.75)
const [OVERSIGHT_LEGITIMACY, REFORM_LEGITIMACY, RECORD_TRUST, SILENCE_CAPITAL, SILENCE_TRUST, COLD_LEGITIMACY] = [82, 86, 75, 97, 45, 88];
const COLD_GAP = 12; // legitimacy this far ahead of trust left its people behind;
const PACT_GAP = 15; // trust this far ahead of legitimacy made a pact outside it
const [HELD_LINE_MULTIPLIER, VAULT_SLACK_PER_CASE] = [16, 19500];
export const BEAT_SLACK_COMBO = 12;

const RESOURCE_KEYS = ["time", "capital", "trust", "legitimacy", "humanCost", "fatigue"];

/**
 * A decision that put the people in the scene first: the largest thing it
 * gained, by size, was their trust or a smaller human cost. Read from the
 * effect, never from the choice id -- generated scenes are `<scene>_choice_N`,
 * so an id pattern counted every choice in a scene called `c1_witness`.
 */
export function isPeopleFirstEffect(effect = {}) {
  const [largest] = Object.entries(effect ?? {})
    .filter(([key, value]) => Number.isFinite(value) && isResourceGain(key, value))
    .sort(byEffectWeight);
  return Boolean(largest) && (largest[0] === "trust" || largest[0] === "humanCost");
}

const mean = (values) => (values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0);
const quantile = (values, share) => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(share * sorted.length))];
};

/**
 * The season so far, for the closing ruling: one reading of the case summaries
 * that the runtime, the report and `check:endings` share. The last six fields
 * are the record the ending always read; the rest read cases and windows, the
 * pressure cases *typically* peaked at (p75, not the one worst walk), reframed
 * routes, and the mean standing cases closed on. Older summaries contribute
 * nothing to fields they lack, and the ending falls back to the last case.
 */
export function getSeasonStrain(caseResults = {}, pending = null) {
  // A replayed case is in both: the summary it is about to replace, and the one pending.
  const closed = Object.entries(caseResults ?? {}).filter(([caseId]) => caseId !== pending?.caseId).map(([, summary]) => summary);
  const summaries = [...closed, pending].filter(Boolean);
  const peaks = summaries.map((summary) => Number(summary.peakRiskPressure)).filter(Number.isFinite);
  const closings = summaries.map((summary) => summary.finalResources).filter((value) => value && typeof value === "object");
  const seasonResources = closings.length
    ? Object.fromEntries(RESOURCE_KEYS.map((key) => [key, Math.round(mean(closings.map((closing) => Number(closing[key]) || 0)))]))
    : null;
  return {
    casesPlayed: summaries.length,
    seasonWindows: summaries.reduce((sum, summary) => sum + (Number(summary.pushRecord?.busts) || 0) + (Number(summary.pushRecord?.cashes) || 0), 0),
    sustainedPressure: Math.round(quantile(peaks, 0.75)),
    seasonReframeRoutes: summaries.reduce(
      (sum, summary) => sum + (Number(summary.reframeRouteCount ?? summary.reframeCount) || 0),
      0,
    ),
    seasonResources,
    seasonHumanCost: summaries.reduce((sum, summary) => sum + (Number(summary.finalHumanCost) || 0), 0),
    peakRiskPressure: summaries.reduce((peak, summary) => Math.max(peak, Number(summary.peakRiskPressure) || 0), 0),
    seasonBusts: summaries.reduce((sum, summary) => sum + (Number(summary.pushRecord?.busts) || 0), 0),
    seasonBestMultiplier: summaries.reduce((best, summary) => Math.max(best, Number(summary.pushRecord?.bestMultiplier) || 1), 1),
    // The vault is cumulative across the season, so the largest summary holds it,
    // and it is read per case: a season total rises with every case played. The
    // groove the beat added is taken back out -- the vault's slack rewards
    // reading the table, and the beat has its own door.
    seasonVaultPerCase: summaries.length
      ? summaries.reduce(
        (vault, summary) => Math.max(vault, (Number(summary.gauntlet?.vault) || 0) - (Number(summary.gauntlet?.grooveVault) || 0)),
        0,
      ) / summaries.length
      : 0,
    seasonBestCombo: summaries.reduce(
      (best, summary) => Math.max(best, Number(summary.pushRecord?.bestCombo) || 0, Number(summary.gauntlet?.bestCombo) || 0),
      0,
    ),
  };
}

/** The finale's own answer, read off its log: "witness", "control", "burn", or null before it. */
export function getFinaleOutcome(log = []) {
  const entry = [...(log ?? [])].reverse().find((item) => /^f_after_(witness|control|burn)$/.test(item?.choiceId ?? ""));
  return entry ? entry.choiceId.slice("f_after_".length) : null;
}

const ENDINGS = {
  collapse: { id: "collapse", label: "SYSTEM COLLAPSE", title: "권한은 있었지만, 감당할 시간이 남지 않았다.", text: "기록은 남았지만 사람과 운영 모두를 지키지 못한 실패 엔딩입니다.", failure: true },
  "open-oversight": { id: "open-oversight", label: "OPEN OVERSIGHT", title: "당신은 사건을 해결한 사람이 아니라 기준을 만든 사람이 되었다.", text: "다음 시즌의 첫 권한은 이번 기록에서 파생됩니다.", failure: false },
  "evidence-reform": { id: "evidence-reform", label: "EVIDENCE REFORM", title: "증거를 공개하되, 사람을 다시 소모하지 않는 규칙을 만들었다.", text: "폭로와 보호 사이에 새 운영 기준이 생겼습니다.", failure: false },
  "human-record": { id: "human-record", label: "HUMAN RECORD", title: "정답 대신, 누구의 목소리도 지워지지 않는 기록을 남겼다.", text: "당신이 다시 짠 판이 다음 참가자의 첫 단서가 됩니다.", failure: false },
  "profitable-silence": { id: "profitable-silence", label: "PROFITABLE SILENCE", title: "조직은 살아남았지만, 아무도 같은 질문을 다시 하지 않았다.", text: "가장 높은 점수와 가장 낮은 믿음이 함께 기록되었습니다.", failure: false },
  "cold-justice": { id: "cold-justice", label: "COLD JUSTICE", title: "절차는 완벽했지만, 그 절차 안의 사람은 돌아오지 않았다.", text: "공정함은 지켰지만 관계 비용이 다음 사건으로 넘어갑니다.", failure: false },
  "field-pact": { id: "field-pact", label: "FIELD PACT", title: "공식 승인보다 먼저, 현장의 약속이 다음 문을 열었다.", text: "당신의 관계망이 잠긴 기록에 접근할 수 있게 합니다.", failure: false },
  "quiet-cover": { id: "quiet-cover", label: "QUIET COVER", title: "위험은 낮췄지만, 진실도 아직 잠들어 있다.", text: "다음 플레이에서는 숨겨진 단서를 우선 추적해야 합니다.", failure: false },
};

/** Every ending's id: what a telemetry row names its ending by, and the server's ranking takes. */
export const ENDING_IDS = Object.freeze(Object.keys(ENDINGS));

export function getEndingVariant({
  resources = {},
  discoveredClues = [],
  log = [],
  seasonHumanCost = 0,
  peakRiskPressure = 0,
  seasonBusts = 0,
  seasonBestMultiplier = 1,
  seasonVaultPerCase = 0,
  seasonBestCombo = 0,
  casesPlayed = 0,
  seasonWindows = 0,
  sustainedPressure,
  seasonReframeRoutes,
  seasonResources = null,
} = {}) {
  // A caller that still passes only the old six fields (a report built before
  // `getSeasonStrain` moved here) reads as a whole season with the last case
  // standing in for its closing values.
  const cases = Math.max(1, Number(casesPlayed) || CASE_SEQUENCE.length);
  const standing = seasonResources ?? resources;
  const trust = Number(standing.trust) || 0;
  const legitimacy = Number(standing.legitimacy) || 0;
  const capital = Number(standing.capital) || 0;
  const harm = Math.max(Number(seasonHumanCost) || 0, Number(resources.humanCost) || 0) / cases;
  const bustRate = seasonWindows > 0 ? seasonBusts / seasonWindows : 0;
  const sustained = Number.isFinite(sustainedPressure) ? sustainedPressure : Math.max(Number(peakRiskPressure) || 0, getRiskPressure(resources));
  const reframeRoutes = Number.isFinite(seasonReframeRoutes)
    ? seasonReframeRoutes
    : log.filter((entry) => entry?.reframeOpenedRoute).length;
  const reframeRate = reframeRoutes / cases;
  const clueRate = discoveredClues.length / cases;
  const finale = getFinaleOutcome(log);

  // The collapse says which door it came through, so the report's advice can
  // quote the gate that closed rather than a number of its own.
  const overreach = harm >= COLLAPSE_OVERREACH_HARM && bustRate >= COLLAPSE_BUST_RATE;
  if (harm >= COLLAPSE_HARM_PER_CASE || overreach) return { ...ENDINGS.collapse, cause: { id: harm >= COLLAPSE_HARM_PER_CASE ? "harm" : "overreach", harmPerCase: Math.round(harm), bustRate: Math.round(bustRate * 100) / 100 } };

  const cold = legitimacy >= COLD_LEGITIMACY && legitimacy - trust >= COLD_GAP;
  const silent = capital >= SILENCE_CAPITAL && trust < SILENCE_TRUST;
  const pact = trust - legitimacy >= PACT_GAP;
  // Burning every record closes the endings made of records. What is left is
  // what the season valued, or a quiet it bought by burning.
  if (finale === "burn") {
    if (silent) return ENDINGS["profitable-silence"];
    if (cold) return ENDINGS["cold-justice"];
    if (pact) return ENDINGS["field-pact"];
    return ENDINGS["quiet-cover"];
  }

  const heldTheLine = seasonBusts === 0 && seasonBestMultiplier >= HELD_LINE_MULTIPLIER;
  const slack = heldTheLine || seasonBestCombo >= BEAT_SLACK_COMBO || seasonVaultPerCase >= VAULT_SLACK_PER_CASE;
  const recordsOpen = clueRate >= (slack ? CLUE_RATE_SLACK_BAR : CLUE_RATE_BAR);
  if (reframeRate >= HUMAN_RECORD_REFRAME_RATE && trust >= RECORD_TRUST) return ENDINGS["human-record"];
  if (recordsOpen && legitimacy >= OVERSIGHT_LEGITIMACY && trust >= OVERSIGHT_TRUST) return ENDINGS["open-oversight"];
  if (cold) return ENDINGS["cold-justice"];
  if (recordsOpen && legitimacy >= REFORM_LEGITIMACY) return ENDINGS["evidence-reform"];
  if (silent) return ENDINGS["profitable-silence"];
  if (pact) return ENDINGS["field-pact"];
  if (sustained <= QUIET_SUSTAINED_PRESSURE || clueRate < QUIET_CLUE_RATE) return ENDINGS["quiet-cover"];
  return getOpenQuestionEnding({ trust, legitimacy, capital, humanCost: Math.round(harm) });
}

/**
 * The fallback. It used to be one line for all of its runs, which read as "none
 * of the above", so it names what the run ended holding. The numbers are the
 * season's means, and a particle after a number is chosen for it (rule 10).
 */
function getOpenQuestionEnding({ trust, legitimacy, capital, humanCost }) {
  const held = Math.max(trust, legitimacy, capital);
  const open = (title, text) => ({ id: "open-question", label: "OPEN QUESTION", title, text, failure: false });
  if (held === trust) return open("답은 못 냈지만, 당신에게 말을 거는 사람은 남았다.", `사건마다 사람 피해 ${humanCost}${objectParticle(String(humanCost))} 남긴 채 문을 닫았습니다. 다음 참가자는 당신을 아는 사람들에게서 시작합니다.`);
  if (held === legitimacy) return open("절차는 남았고, 그 절차가 무엇을 위한 것인지는 남지 않았다.", `공정함은 ${legitimacy}에서 멈췄고 이유를 적어둔 문서는 없습니다. 다음 사람은 규칙만 물려받습니다.`);
  return open("장부는 버텼고, 질문은 그대로 넘어갔다.", `현금 ${capital}${objectParticle(String(capital))} 지킨 대신 닫히지 않은 기록이 남았습니다. 다음 플레이에서 다른 권한으로 열립니다.`);
}

export function getCaseOutcome({ caseId = CASE_SEQUENCE[0], choiceId = "" } = {}) {
  const outcomes = packTable("outcomes");
  return outcomes[caseId]?.[choiceId] ?? { tag: "기록되지 않은 결말", title: "아직 닫히지 않은 결과", text: "이번 선택의 파장은 다음 기록에 남아 있습니다." };
}

export function getOutcomeCarryover({ caseId = CASE_SEQUENCE[0], choiceId = "" } = {}) {
  const carryovers = packTable("carryovers");
  return carryovers[caseId]?.[choiceId] ?? {};
}

/**
 * What the season has worn down by the time a case opens. Every case opened on
 * the same resources, and later cases move numbers a little less (a choice's
 * summed effect drifts 28 -> 25), so per-case peak pressure fell from 15-18 in
 * 1-2막 to 12-14 from 사건 20 on. The opening now carries wear linear in the
 * case's place in the sequence -- none for the first, `SEASON_WEAR` for the
 * finale -- in the two axes a long season spends. The table leans in on the
 * same schedule (`getSeasonEscalation`).
 */
export const SEASON_WEAR = Object.freeze({ fatigue: 14, time: -8 });

export function getSeasonWear(caseId = "") {
  const index = CASE_SEQUENCE.indexOf(caseId);
  if (index <= 0) return {};
  const share = index / Math.max(1, CASE_SEQUENCE.length - 1);
  return Object.fromEntries(
    Object.entries(SEASON_WEAR)
      .map(([key, value]) => [key, Math.round(value * share)])
      .filter(([, value]) => value !== 0),
  );
}

export function getContinuityChallenge({ caseId = CASE_SEQUENCE[0], choiceId = "" } = {}) {
  const challenges = packTable("continuityChallenges");
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
  // Direction comes from `isResourceGain`, never the sign: a falling human cost
  // is a recovery, and it used to be reported as the run's strongest cost.
  const strongestCost = Object.entries(totals)
    .filter(([key, value]) => value !== 0 && !isResourceGain(key, value))
    .sort(byEffectWeight)[0] ?? null;
  const strongestRecovery = Object.entries(totals)
    .filter(([key, value]) => isResourceGain(key, value))
    .sort(byEffectWeight)[0] ?? null;

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

/**
 * No one family carried the run: an empty record, or two families tied at the
 * top. The reduce used to start from 책임형 and only move on a strictly higher
 * score, so every tie and every empty run was named 책임형 -- a verdict the run
 * never gave.
 */
const MIXED_MOTIVE = { id: "mixed", label: "복합형", when: "한 가지 감정이 혼자 생각을 깨우지 않았을 때", path: "여러 감정 → 집념 → 끝까지 생각 → 다시 읽기" };

export function getThinkingMotive(triggerScores = {}) {
  const scored = MOTIVE_FAMILIES.map((family) => ({
    ...family,
    score: family.triggers.reduce((sum, trigger) => sum + (Number(triggerScores[trigger]) || 0), 0),
  }));
  const top = Math.max(...scored.map((family) => family.score));
  const leaders = scored.filter((family) => family.score === top);
  if (top <= 0 || leaders.length > 1) return { ...MIXED_MOTIVE, score: Math.max(0, top) };
  const { triggers: _triggers, ...motive } = leaders[0];
  return motive;
}

export function getDecisionFingerprint({ triggerScores = {}, cognitionScores = {}, entries = [], resources = {} } = {}) {
  const sortedTriggers = Object.entries(triggerScores).sort((a, b) => b[1] - a[1]);
  const sortedCognition = Object.entries(cognitionScores).sort((a, b) => b[1] - a[1]);
  const ledger = getDecisionLedger(entries, resources);
  const reframeCount = entries.filter((entry) => entry.reframe).length;
  const challengeCount = entries.filter((entry) => entry.challenge?.matched).length;
  const dominantTrigger = sortedTriggers[0] ?? ["responsibility", 0];
  const dominantCognition = sortedCognition[0] ?? ["persistence", 0];
  const guardianScore = Math.max(0, -(ledger.totals.humanCost ?? 0)) + challengeCount * 2;
  const disruptorScore = reframeCount * 4 + Math.max(0, ledger.totals.legitimacy ?? 0) * 0.2;
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
      const choices = scene?.choices?.filter((choice) => choice.type !== "reframe" && choice.effect) ?? [];
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
  const trail = (entry) => `${entry?.nodeId ?? ""} ${entry?.choiceId ?? ""} ${entry?.reframeBranchId ?? ""}`;
  return {
    evidenceTurn: entries.some((entry) => trail(entry).includes("evidence_turn")),
    systemRoute: entries.some((entry) => entry?.reframeOpenedRoute || trail(entry).includes("route_system")),
    routeSplit: entries.some((entry) => trail(entry).includes("_route_")),
  };
}

/**
 * The mean seconds a decision took, over the decisions the player made. A
 * system entry (a bust carried across a restore, an abandoned window the table
 * closed) is not one: it has no response time, and counting it as zero pulled
 * the average down in the summary, the ranking row and the telemetry, while
 * `getGameplayStats` already left those entries out.
 */
export function getAverageResponseTime(entries = []) {
  const decisions = (Array.isArray(entries) ? entries : []).filter((entry) => entry && typeof entry === "object" && !entry.isSystemEvent);
  if (decisions.length === 0) return 0;
  return Math.round(decisions.reduce((sum, entry) => sum + (Number(entry.responseTimeSec) || 0), 0) / decisions.length);
}

/**
 * What a window with no clock reading of its own took, in seconds. An
 * abandoned window carries no `elapsed`, and what stood in for it was the wall
 * clock since the scene was entered -- which a reload does not restart, so a
 * tab closed overnight logged thirty thousand seconds for one decision. No
 * window runs longer than its board's clock, so that is the most it can be.
 */
export function getWindowResponseTime({ elapsed = 0, enteredAt = 0, now = Date.now(), clockSeconds = 0 } = {}) {
  const measured = Number(elapsed);
  if (Number.isFinite(measured) && measured > 0) return Math.max(1, Math.round(measured));
  const sinceEntry = (Number(now) - Number(enteredAt)) / 1000;
  const cap = Number(clockSeconds) > 0 ? Number(clockSeconds) : Infinity;
  return Math.max(1, Math.round(Math.min(Number.isFinite(sinceEntry) ? Math.max(0, sinceEntry) : 0, cap)));
}

/** What a logic verdict's move adds one to in the case's record; "build" is counted as a window only. */
const LOGIC_RECORD_KEYS = { grow: "grows", switch: "switches", break: "breaks", bust: "busts", keep: "keeps", build: null };

/**
 * The case's logic streak, as the report will read it once the log is gone:
 * the windows in which the streak was in play, the heat they closed in (the
 * tiers summed, and the highest), the type picked most with how many windows
 * picked it, what became of the streak window by window, and the longest it
 * stood in this case.
 *
 * A window whose verdict made no move ("none": the room played the card, or
 * the case does not have the rule yet) is not one of them -- nothing was asked
 * of the hand there, and counting it would call it a streak held. A case with
 * no window left is no record (null), and so is every log written before the
 * streak was.
 */
export function createLogicRecord(entries = []) {
  const record = { windows: 0, heat: 0, peak: 0, top: null, grows: 0, switches: 0, breaks: 0, busts: 0, keeps: 0, best: 0 };
  const picked = {};
  for (const entry of entries) {
    const logic = entry?.threshold?.logic;
    if (!logic || !Object.hasOwn(LOGIC_RECORD_KEYS, logic.move)) continue;
    const tier = Number(logic.tier) || 0;
    record.windows += 1;
    record.heat += tier;
    record.peak = Math.max(record.peak, tier);
    record.best = Math.max(record.best, Number(logic.streak) || 0);
    if (LOGIC_RECORD_KEYS[logic.move]) record[LOGIC_RECORD_KEYS[logic.move]] += 1;
    if (typeof logic.type === "string") {
      picked[logic.type] = (picked[logic.type] ?? 0) + 1;
      if (!record.top || picked[logic.type] > record.top[1]) record.top = [logic.type, picked[logic.type]];
    }
  }
  return record.windows > 0 ? record : null;
}

/**
 * The season's two logic numbers, from its cases' records. `logicHold` is, of
 * the windows where the streak could have ended, the share where it did not:
 * a window that kept the streak because the held type was not on the table
 * could not have ended it, so it is in neither count. `bestLogic` is the
 * longest streak any case reached. A season with no record carries neither,
 * and one with no window that could have ended a streak carries no hold.
 */
export function getSeasonLogic(caseResults = {}) {
  const records = Object.values(caseResults ?? {}).map((result) => result?.logicRecord).filter((record) => record && typeof record === "object");
  if (!records.length) return {};
  const sum = (key) => records.reduce((total, record) => total + (Number(record[key]) || 0), 0);
  const open = sum("windows") - sum("keeps");
  return {
    ...(open > 0 ? { logicHold: clamp(Math.round((100 * (open - sum("breaks") - sum("busts"))) / open), 0, 100) } : {}),
    bestLogic: records.reduce((best, record) => Math.max(best, Number(record.best) || 0), 0),
  };
}

/**
 * `replayOf` is the summary the case already has, when it is being played
 * again: the replay is practice, and the record of its first close stands.
 */
export function createCaseSummary(
  triggerScores = {},
  cognitionScores = {},
  entries = [],
  { resources = {}, schemaVersion = 1, includeLongestDecision = false, replayOf = null } = {},
) {
  const sortedTriggers = Object.entries(triggerScores).sort((a, b) => b[1] - a[1]);
  const sortedCognition = Object.entries(cognitionScores).sort((a, b) => b[1] - a[1]);
  const stats = getGameplayStats(entries, getRiskPressure(resources));
  const assistTime = entries.reduce((slowest, entry) => Math.max(slowest, Number(entry?.assistTime) || 1), 1);
  const logicRecord = replayOf ? replayOf.logicRecord : createLogicRecord(entries);
  const summary = {
    schemaVersion,
    caseId: entries.find((entry) => entry?.caseId)?.caseId ?? null,
    primary: sortedTriggers[0] ?? ["responsibility", 0],
    secondary: sortedTriggers[1] ?? ["protection", 0],
    thinking: sortedCognition[0] ?? ["persistence", 0],
    reframeCount: stats.reframeCount,
    averageResponseTime: getAverageResponseTime(entries),
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
    // The slowest table clock any decision of the case was played on, when the
    // comfort setting slowed it; absent on a case played at the table's pace.
    ...(assistTime > 1 ? { assistTime } : {}),
    // Any decision of the case was played in story mode (a far wall, no
    // next-table rules); absent otherwise. The finale's summary carries the
    // season's, and a season that has it is kept off the public ranking.
    ...(entries.some((entry) => entry?.assistStory === true) ? { assistStory: true } : {}),
    // Carried so the ending can read the season rather than the last case: with
    // resources reset at every case start, one case alone never reaches the
    // thresholds the closing ruling is written against.
    finalHumanCost: resources.humanCost ?? 0,
    // What the case closed on, so the ending can read the season's standing
    // rather than only the finale's, which starts from the same resources as
    // every other case.
    finalResources: Object.fromEntries(RESOURCE_KEYS.map((key) => [key, Number(resources[key]) || 0])),
    // Reframes that opened the case's hidden route, and decisions whose largest
    // gain went to the people in the scene. Both used to be read off the last
    // case's log only, which the next case clears.
    reframeRouteCount: entries.filter((entry) => entry?.reframeOpenedRoute).length,
    peopleFirstCount: entries.filter((entry) => !entry?.isSystemEvent && isPeopleFirstEffect(entry?.effect)).length,
    pushRecord: createTableRecord(entries),
    // The logic streak's record of the case, when it has one (`createLogicRecord`);
    // a replayed case keeps its first, as the table record above does.
    ...(logicRecord ? { logicRecord } : {}),
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

export function getEcho(choiceId) {
  return echoReplies[choiceId] ?? echoReplies.default;
}

export function getDramaticChoiceLabel(choice) {
  if (choice.type === "reframe") return choice.label;
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
 * ㄹ dropped when the ending went on (만들다 -> 만든다), so those are named, by
 * the syllable before 다 -- the only thing the lookup reads (a two-syllable key
 * such as 만든 never matched; 든 covers it). 연다 has its own row above.
 *
 * Only syllables that are a ㄹ stem in every label the season has are listed:
 * 안다 is 알다 (알겠습니다, not 아겠습니다), 번다 벌다, 돈다 돌다, 몬다 몰다,
 * 단다 달다, 푼다 풀다, 썬다 썰다. 판 is not: the one label that ends on it
 * ("한 곳만 판다") is 파다, which the ㄹ row turned into 팔겠습니다. 산다 (사다 /
 * 살다) and 운다 (메우다 / 울다) are ambiguous and read as vowel stems.
 */
const SPOKEN_L_STEMS = { 건: "걸", 든: "들", 민: "밀", 안: "알", 번: "벌", 돈: "돌", 몬: "몰", 단: "달", 푼: "풀", 썬: "썰" };

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

export function buildSceneBeat(node, choice, effect = {}) {
  const profile = characterProfiles[node?.speaker] ?? {
    appearance: "정돈되지 않은 자료 더미 앞에 사건 관계자가 앉아 있다.",
    thought: "이 선택은 아직 끝나지 않았다.",
    gesture: "상대는 잠시 말을 고른다.",
    voice: "상황을 확인하는 말투로 반응한다.",
    line: "그 판단을 계속 밀고 갈 수 있습니까?",
  };
  const said = `"${speechifyChoice(choice)}"`;
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

/**
 * What 판을 다시 짠다 costs and what it sharpens.
 *
 * It used to be computed from the sentence the player typed: four keyword
 * buckets decided the resources and the cognition, which meant a card's price
 * was a regex the player could not read. The card is one card now, so it has
 * one price -- paid in the two axes a reframe actually spends, time and the
 * fatigue of doing the thinking, against the standing it buys.
 */
export const REFRAME_EFFECT = { time: -6, trust: 3, legitimacy: 3, fatigue: 5 };
export const REFRAME_COGNITION = { reframing: 3, inference: 1 };

// Both live in appConfig.js, and the privacy patterns in privacyText.js, so the
// pre-start shell can use them without pulling in the scene graph.
export { limitText, makeEmptyScores };
export { anonymizeSensitiveText, detectPrivacySignals } from "./privacyText.js";
