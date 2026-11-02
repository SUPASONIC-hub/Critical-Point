import { caseDisplayCode, SEASON_ENTRY_CASE } from "./gameCases.js";
import { clamp, initialResources } from "./gameConstants.js";
import { easyResourceLabels } from "./playerLanguage.js";
import playReads from "./copy/playReads.js";

export { clamp };

/**
 * Adds an effect to the six resources. A key that is not one of them is left
 * out rather than added: a misspelt resource used to become a seventh one
 * that nothing printed, and a value that is not a number would have made
 * that resource NaN for the rest of the run. check:graph catches both in the
 * authored data; this keeps a run whole when something slips past it.
 */
export function applyEffect(resources, effect = {}) {
  const next = { ...resources };
  Object.entries(effect ?? {}).forEach(([key, value]) => {
    if (!Object.hasOwn(initialResources, key) || !Number.isFinite(value)) return;
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

// Named with the labels the rest of the game prints (rule 9): these said
// 현금 압박 / 인적 비용 / 판단 피로 beside chips that say 현금 / 사람 피해 / 피로.
export function getRiskPressureDrivers(resources = {}) {
  const nextResources = { ...riskDefaults, ...resources };
  const drivers = [
    {
      id: "time",
      label: easyResourceLabels.time,
      value: Math.max(0, 72 - nextResources.time),
      pressure: Math.max(0, 72 - nextResources.time) * 0.3,
    },
    {
      id: "capital",
      label: easyResourceLabels.capital,
      value: Math.max(0, 100 - nextResources.capital),
      pressure: Math.max(0, 100 - nextResources.capital) * 0.25,
    },
    {
      id: "humanCost",
      label: easyResourceLabels.humanCost,
      value: nextResources.humanCost,
      pressure: nextResources.humanCost * 0.25,
    },
    {
      id: "fatigue",
      label: easyResourceLabels.fatigue,
      value: nextResources.fatigue,
      pressure: nextResources.fatigue * 0.2,
    },
  ];

  return drivers
    .map((driver) => ({ ...driver, pressure: Math.round(driver.pressure) }))
    .sort((a, b) => b.pressure - a.pressure);
}

// The clock used to add urgency here, read off `decisionSeconds`. The one caller
// passed the table's full 45 every time -- the window's clock lives in the stage
// and never reaches the runtime -- so the term was always zero.
export function getSuspenseState({ riskPressure = 0, log = [], currentCase = SEASON_ENTRY_CASE } = {}) {
  const accumulated = Math.min(20, log.length * 4);
  const score = clamp(Math.round(riskPressure + accumulated), 0, 100);
  const tier = score >= 78 ? "REDLINE" : score >= 52 ? "UNSTABLE" : score >= 28 ? "WATCH" : "QUIET";
  const signals = {
    QUIET: {
      label: "SIGNAL QUIET",
    },
    WATCH: {
      label: "SIGNAL WATCH",
    },
    UNSTABLE: {
      label: "SIGNAL UNSTABLE",
    },
    REDLINE: {
      label: "SIGNAL REDLINE",
    },
  }[tier];
  const caseCode = caseDisplayCode(currentCase);
  // The words are src/copy/playReads.js's, read now so they are the page's language.
  return { score, tier, caseCode, ...signals, ...playReads.signals[tier] };
}

export function getSuspenseEvent({ riskBefore = 0, riskAfter = 0, currentCase = SEASON_ENTRY_CASE, logLength = 0 } = {}) {
  if (riskBefore < 70 && riskAfter >= 70) {
    return {
      id: "protocol-awake",
      ...playReads.events["protocol-awake"],
      label: "HIDDEN PROTOCOL",
      tone: "redline",
    };
  }
  if (riskBefore < 50 && riskAfter >= 50) {
    return {
      id: "observer-awake",
      ...playReads.events["observer-awake"],
      label: "OBSERVER ONLINE",
      tone: "unstable",
    };
  }
  // Not in the season's first case: there is no earlier pattern yet to lock.
  if (logLength >= 3 && riskAfter >= 42 && currentCase !== SEASON_ENTRY_CASE) {
    return {
      id: "pattern-lock",
      ...playReads.events["pattern-lock"],
      label: "PATTERN LOCK",
      tone: "watch",
    };
  }
  return null;
}
