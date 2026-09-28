import { useMemo } from "react";

import { isResourceGain } from "../gameConstants.js";
import { BASE_SCHEMA, buildNextSchema, describeMutations, FRACTURE_MIN_BURN, getCardBurn, HOT_CASH_MULTIPLIER, STANCE_CHARGE } from "./gauntletEngine.js";
import { hasRelic } from "./relics.js";
import { HEAT_DEBT_GAUGE, INSURANCE_SHARE } from "./tableRules.js";

export function formatNumber(value) {
  return Math.round(Number(value) || 0).toLocaleString("en-US");
}

/**
 * Rounded down, because the table's rules read the multiplier as a floor: the
 * chain asks for x4 and HIGH ROLLER's feat for x64. Rounded to nearest, a
 * x3.95 printed "×4.0" and a cash on it started no chain.
 */
export function formatMultiplier(value) {
  const multiplier = Number(value) || 0;
  return multiplier >= 10 ? `×${Math.floor(multiplier)}` : `×${(Math.floor(multiplier * 10 + 1e-9) / 10).toFixed(1)}`;
}

export function describeEffect(effect = {}, resourceMeta = {}) {
  return Object.entries(effect)
    .filter(([, value]) => Number(value) !== 0)
    .map(([key, value]) => ({
      key,
      value: Number(value),
      label: resourceMeta[key]?.label ?? key,
      // Priority 9: whether it was good for the run, never the sign.
      gain: isResourceGain(key, Number(value)),
    }))
    .sort((left, right) => Math.abs(right.value) - Math.abs(left.value));
}

export function joinRules(items) {
  if (!items.length) return "기본 규칙";
  return items.map((item) => item.label).join(" / ");
}

function getRuleHeat({ mutations, schema }) {
  return Math.min(
    100,
    mutations.length * 24
      + (schema.faceDown ? 18 : 0)
      + (schema.sedated ? 14 : 0)
      + (schema.sealHighest ? 12 : 0)
      + (schema.fracturedAxis ? 16 : 0)
      + (schema.stepMin > BASE_SCHEMA.stepMin ? 16 : 0),
  );
}

function getRuleObjective(mutations) {
  if (!mutations.length) return "규칙 안정. 지금은 판돈과 벽만 읽으면 된다.";
  const labels = mutations.map((mutation) => mutation.label).join(" / ");
  return `${labels} 해제 조건: 사건 결과까지 살아남아 판돈을 금고로 넘겨라.`;
}

function getOverdriveCopy({ streak, hot, cashMutations }) {
  const willOverdrive = cashMutations.some((mutation) => mutation.id === "overclock");
  if (willOverdrive) return { label: "OVERCLOCK READY", text: "지금 확정하면 다음 판은 칩 2배, 푸시 폭 증가", progress: 100 };
  if (streak > 0 && hot) return { label: "CHAIN LIVE", text: "한 번 더 x4+ 확정하면 오버클럭", progress: 75 };
  if (streak > 0) return { label: "CHAIN HELD", text: "이번 판도 x4 이상으로 확정해야 이어진다", progress: 50 };
  if (hot) return { label: "IGNITION", text: "확정하면 오버클럭 체인 1단계", progress: 35 };
  return { label: "DORMANT", text: "x4 이상 확정부터 체인이 켜진다", progress: 12 };
}

/**
 * The rules on the table now, and the rules the next table would be dealt
 * under if this one were cashed or busted.
 *
 * The stage renders ten times a second while the clock runs, and it used to
 * build both next boards and describe both of their mutation lists on every
 * one of those renders. The clock is not an input to any of it, and neither is
 * the gauge as a number -- creep moves that every tick, which is what kept
 * rebuilding both boards ten times a second after this was first memoised. The
 * next board asks three things of the heat: is the cash hot enough for the
 * chain, is it hot enough to carry a debt, and has the stance been charged.
 */
export function useTableForecast({ schema, run, win, selectedCard, multiplier }) {
  const mutations = useMemo(() => describeMutations(schema), [schema]);
  const relics = run?.relics;
  const selectedBurn = useMemo(() => (selectedCard ? getCardBurn(selectedCard, schema) : null), [schema, selectedCard]);
  const fractureAxis = selectedBurn && Math.abs(selectedBurn.value) >= FRACTURE_MIN_BURN ? selectedBurn.key : null;
  const hot = multiplier >= HOT_CASH_MULTIPLIER;
  const streak = run?.streak ?? 0;
  const { focusMode } = win;
  const indebted = win.gauge >= HEAT_DEBT_GAUGE;
  const pushed = win.pushes > 0;
  const stanceEarned = win.focus >= STANCE_CHARGE && win.focusHits > 0;
  const stanceMastery = run?.stanceMastery;
  // The board after this window is the season's next one, and it leans in on
  // the schedule `resolveWindow` applies (`getSeasonEscalation`).
  const windowIndex = (Number(run?.windowIndex) || 0) + 1;

  const cashMutations = useMemo(
    () =>
      describeMutations(buildNextSchema({
        outcome: "cash",
        cause: "cash",
        gauge: indebted ? HEAT_DEBT_GAUGE : 0,
        pushes: pushed ? 1 : 0,
        streak: hot ? streak + 1 : 0,
        burnAxis: fractureAxis,
        caseClosed: false,
        relics: relics ?? [],
        focusMode,
        focusCharge: stanceEarned ? STANCE_CHARGE : 0,
        focusHits: stanceEarned ? 1 : 0,
        stanceMastery,
        windowIndex,
      })),
    [focusMode, fractureAxis, hot, indebted, pushed, relics, stanceEarned, stanceMastery, streak, windowIndex],
  );
  const bustMutations = useMemo(
    () =>
      describeMutations(buildNextSchema({
        outcome: "bust",
        cause: "push",
        gauge: schema.wallMin,
        pushes: 1,
        streak: 0,
        burnAxis: fractureAxis,
        caseClosed: false,
        relics: relics ?? [],
        windowIndex,
      })),
    [fractureAxis, relics, schema.wallMin, windowIndex],
  );

  return useMemo(() => {
    // REBOOT is the rules resetting, not a rule bending the board. The draft and
    // the reveal already say the case closed; a panel saying so again cost a
    // phone 92px of the table at every case's first window.
    const tableRules = mutations.filter((mutation) => mutation.id !== "reboot");
    return {
      mutations,
      tableRules,
      ruleHeat: getRuleHeat({ mutations: tableRules, schema }),
      ruleObjective: getRuleObjective(tableRules),
      currentRules: mutations.length
        ? `${joinRules(mutations)} 적용 중`
        : schema.faceDown || schema.sedated || schema.sealHighest || schema.fracturedAxis
          ? "숨은 규칙 적용 중"
          : "규칙 안정",
      fractureAxis,
      cashMutations,
      bustMutations,
      overdrive: getOverdriveCopy({ streak, hot, cashMutations }),
      // What a bust would leave of the case pot: nothing, or a third with INSURANCE unspent.
      bustKeeps: hasRelic(relics ?? [], "insurance") && !run?.insuranceSpent ? Math.floor((run?.runPot ?? 0) / INSURANCE_SHARE) : 0,
      runTension: Math.min(100, (run?.busts ?? 0) * 24 + streak * 16 + Math.min(40, Math.log10(Math.max(1, run?.runPot ?? 0)) * 11)),
    };
  }, [bustMutations, cashMutations, fractureAxis, hot, mutations, relics, run?.busts, run?.insuranceSpent, run?.runPot, schema, streak]);
}
