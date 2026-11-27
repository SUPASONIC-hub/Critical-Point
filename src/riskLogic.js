import { caseDisplayCode, SEASON_ENTRY_CASE } from "./gameCases.js";
import { clamp, initialResources } from "./gameConstants.js";
import { easyResourceLabels } from "./playerLanguage.js";
import playReads from "./copy/playReads.js";
import { marksOnByDefault } from "./gauntlet/rulesSwitch.js";

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

/**
 * G49 (RULES_MARK 15, 게임성 7차, the user's 「전부 1」 of 2026-11-27): what one
 * point of 사람 피해 weighs in the pressure. 0.25 read a card of 돈 +6 and
 * 사람 피해 +5 as one that lowered the risk (with 돈 opened at 70 its gap stood
 * at 30), so the hand that followed 「현재 위험」 spent people: 16.3 harm a case,
 * collapsing 10.7% (paired 12.5 / 0.0). 0.35 took it to 0.0% (1.3 / 0.0) and kept
 * its four endings. A story season keeps 0.25 (Q8 (1): its QUIET COVER fell
 * under check:endings' 2% at 0.35). Read from the switches (rulesSwitch.js), as
 * the start screen loads this file without nextTableRules.js.
 */
export const RISK_HARM_WEIGHT = 0.25;
export const RISK_HARM_WEIGHT_FIFTEEN = 0.35;
/** The weight a season under `mark`'s rules (15 or later: G49) reads, a story season (`story`) 0.25. */
export const riskHarmWeightFor = (fifteen, story = false) => (fifteen && !story ? RISK_HARM_WEIGHT_FIFTEEN : RISK_HARM_WEIGHT);
let pageWeight;
let heldWeight = null;
/** The weight the pressure reads now: one held by `withRiskHarmWeight` or `holdRiskStory`, else this page's rules. */
export const getRiskHarmWeight = () => heldWeight ?? (pageWeight ??= riskHarmWeightFor(marksOnByDefault(15)));
/** `read()` with the pressure reading `weight` (a recheck's row, a story season played by a script); null: the page's. */
export function withRiskHarmWeight(weight, read) {
  const was = heldWeight;
  heldWeight = weight;
  try {
    return read();
  } finally {
    heldWeight = was;
  }
}
/** The play screen's run: a story run reads 0.25 until the next run says otherwise (useRunReadout.js). */
export function holdRiskStory(story) {
  heldWeight = story ? RISK_HARM_WEIGHT : null;
}

export function getRiskPressure(resources = {}) {
  const nextResources = { ...riskDefaults, ...resources };
  return Math.round(
    Math.max(0, 72 - nextResources.time) * 0.3 +
      (100 - nextResources.capital) * 0.25 +
      nextResources.humanCost * getRiskHarmWeight() +
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
      pressure: nextResources.humanCost * getRiskHarmWeight(),
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
