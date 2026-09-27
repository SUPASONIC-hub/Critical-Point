import { applyEffect, getDiscoveryClue, getRiskPressure } from "../gameLogic.js";
import { byEffectWeight, isResourceGain } from "../gameConstants.js";

/**
 * Builds the per-render readers that score a choice before it is committed:
 * whether it answers the scene's challenge, the tactical grade the report
 * prints beside it, and the clue it may surface.
 *
 * The read used to fold a "flow surge" bonus into the risk it reported while
 * the commit never applied that bonus, so the logged risk delta and the clue
 * roll were computed from resources the player never received. The read is now
 * the card's own effect and nothing else.
 */
export function createChoiceReaders({
  sceneChallenge,
  resources,
  log,
  riskPressure,
  discoveredClues,
  currentCase,
  resourceMeta,
}) {
  // Gains and costs are read with `isResourceGain`, never by sign: fatigue and
  // human cost rising is a cost (maintenance priority 9).
  function splitEffect(effect = {}) {
    const entries = Object.entries(effect).filter(([, value]) => Number(value) !== 0);
    return {
      gains: entries.filter(([key, value]) => isResourceGain(key, value)).sort(byEffectWeight),
      costs: entries.filter(([key, value]) => !isResourceGain(key, value)).sort(byEffectWeight),
    };
  }

  function matchesChallenge(effect, riskDelta) {
    if (sceneChallenge.id === "protect-trust") return isResourceGain("trust", effect.trust ?? 0);
    if (sceneChallenge.id === "repair-legitimacy") return isResourceGain("legitimacy", effect.legitimacy ?? 0);
    if (sceneChallenge.id === "lower-risk") return riskDelta < 0;
    if (sceneChallenge.id === "avoid-risk") return riskDelta <= 0;
    if (sceneChallenge.id === "find-cost") return splitEffect(effect).costs.length > 0;
    return false;
  }

  function getTacticalRead(effect, cognition, riskDelta, challengeMatch) {
    const { gains, costs } = splitEffect(effect);
    const cognitionGain = Object.values(cognition ?? {}).reduce((sum, value) => sum + value, 0);
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
    const formatEntry = ([key, value]) => `${resourceMeta[key]?.label ?? key} ${value > 0 ? "+" : ""}${value}`;
    const cost = costs[0] ? formatEntry(costs[0]) : "즉시 손실 낮음";
    const gain = gains[0]
      ? formatEntry(gains[0])
      : cognitionGain > 0
        ? `생각 가속 +${cognitionGain}`
        : "관망";

    return { grade, gradeText, reward, cost, gain };
  }

  function mergeEffects(...effects) {
    return effects.reduce((merged, effect = {}) => {
      Object.entries(effect).forEach(([key, value]) => {
        merged[key] = (merged[key] ?? 0) + value;
      });
      return merged;
    }, {});
  }

  function getClueReveal(challengeMatch, riskDelta, responseTimeSec, reframeOpenedRoute = false) {
    const clue = getDiscoveryClue({
      currentCase,
      challengeMatch,
      riskDelta,
      responseTimeSec,
      reframeOpenedRoute,
      logLength: log.length,
      discoveredClueIds: discoveredClues.map((item) => item.id),
    });
    return clue && !discoveredClues.some((item) => item.id === clue.id) ? clue : null;
  }

  /** The card's own effect, read against the scene's challenge. `riskDelta` is what the log and the clue roll use. */
  function getEffectiveChoiceRead(choice, baseEffect = {}, cognitiveEffect = {}) {
    const riskDelta = getRiskPressure(applyEffect(resources, baseEffect)) - riskPressure;
    const challengeMatch =
      choice.type === "reframe" ? sceneChallenge.id === "use-reframe" : matchesChallenge(baseEffect, riskDelta);
    const tacticalRead = getTacticalRead(baseEffect, cognitiveEffect, riskDelta, challengeMatch);
    return { challengeMatch, tacticalRead, riskDelta };
  }

  return { mergeEffects, getClueReveal, getEffectiveChoiceRead };
}
