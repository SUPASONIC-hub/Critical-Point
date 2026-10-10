import { useMemo } from "react";

import { formatNumber, isResourceGain } from "../gameConstants.js";
import { BASE_SCHEMA, buildNextSchema, describeMutations, FRACTURE_MIN_BURN, getCardBurn, getEscalationWindow, HOT_CASH_MULTIPLIER, STANCE_CHARGE } from "./gauntletEngine.js";
import { advanceLogic, getLogicBonus, getLogicType } from "./logicStreak.js";
import { hasRelic } from "./relics.js";
import { HEAT_DEBT_GAUGE, INSURANCE_SHARE, LOGIC_HOLD } from "./tableRules.js";
import { directionParticle, easyCognitionLabels, objectParticle, topicParticle } from "../playerLanguage.js";
import { getTableRules } from "./tableUnlocks.js";

export { formatNumber };

/**
 * Rounded down, because the table's rules read the multiplier as a floor: the
 * chain asks for x4 and HIGH ROLLER's feat for x64. Rounded to nearest, a
 * x3.95 printed "×4.0" and a cash on it started no chain.
 */
export function formatMultiplier(value) {
  const multiplier = Number(value) || 0;
  return multiplier >= 10 ? `×${Math.floor(multiplier)}` : `×${(Math.floor(multiplier * 10 + 1e-9) / 10).toFixed(1)}`;
}

const VERDICT_CAUSE_COPY = Object.freeze({
  cash: "직접 확정했다",
  push: "한 번 더 밀었다",
  creep: "시계가 올린 열이 벽에 닿았다",
  timeout: "시계를 방치했다",
  focus: "락이 올린 열이 벽에 닿았다",
  abandon: "걸어 둔 판을 떠났다",
});

/**
 * Why the window closed, in the reveal's ledger. One sentence a cause
 * (`VERDICT_CAUSES`): the busts the player did not press for -- the clock's
 * heat creeping into the wall, and before 2026-10-10 a lock off the beat
 * heating into it -- used to fall through to the cash's line, so a BUST
 * headline sat over "직접 확정했다". A cause this table does not know says only
 * what the outcome proves.
 */
export function describeVerdictCause(verdict) {
  return VERDICT_CAUSE_COPY[verdict?.cause] ?? (verdict?.outcome === "bust" ? "열이 벽에 닿았다" : VERDICT_CAUSE_COPY.cash);
}

/** The name a card's type goes by on the table (the report's plain names). */
export const getTypeName = (type) => easyCognitionLabels[type] ?? "";

/**
 * The one word of each name a phone's card has room for. A card there is half
 * a 360px screen wide and its stats row already holds the chips and the burn,
 * so the tag prints this word and keeps the rest of the name for a screen
 * reader and for a wider card (`getTypeParts`).
 */
const TYPE_KEYWORDS = Object.freeze({ persistence: "버티기", inference: "확인", reframing: "바꾸기", risk: "위험" });

/** A type's name cut around its keyword: what comes before it, the word, and what comes after. */
export function getTypeParts(type) {
  const name = getTypeName(type);
  const word = TYPE_KEYWORDS[type] ?? name;
  const at = name.indexOf(word);
  return [name.slice(0, at), word, name.slice(at + word.length)];
}

const bonusText = (bonus) => `×${(Number(bonus) || 1).toFixed(2)}`;

/**
 * What a settled card did to the logic streak, as the reveal says it: one
 * sentence a move (`advanceLogic`). Nothing for a window the streak was not
 * in play on, or a verdict logged before the streak paid.
 */
export function describeLogicMove(logic) {
  const type = getTypeName(logic?.type);
  const streak = Number(logic?.streak) || 0;
  const paid = `논리 콤보 ${streak}, 판돈 ${bonusText(logic?.bonus)}.`;
  switch (logic?.move) {
    case "grow":
      return `${type}${objectParticle(type)} 이어 갔다. ${paid}`;
    case "build":
      return `${type} ${Math.min(LOGIC_HOLD, Number(logic.held) || 1)}/${LOGIC_HOLD}. 같은 유형 세 번째부터 콤보가 오른다. ${paid}`;
    case "switch":
      return `압박이 오른 판에서 ${type}${directionParticle(type)} 바꿨다. 전환으로 콤보가 올랐다. ${paid}`;
    case "keep":
      return `지키던 유형의 카드가 이 장면에 없었다. 콤보는 그대로다. ${paid}`;
    case "break":
      return `압박이 오르지 않았는데 ${type}${directionParticle(type)} 바꿨다. 논리 콤보는 0, 다시 1/${LOGIC_HOLD}부터 센다.`;
    case "bust":
      return streak > 0 ? `벽에 닿았지만 논리 콤보 ${streak}${topicParticle(String(streak))} 남았다.` : "벽에 닿아 논리 콤보가 끊겼다.";
    default:
      return null;
  }
}

/** The same move as the archive's one line under a logged decision. */
export function describeLogicLog(logic) {
  return logic?.pot > 0 ? { label: "LOGIC STREAK", text: `논리 콤보 ${logic.streak} · 판돈 ${bonusText(logic.bonus)} · +${formatNumber(logic.pot)}` } : null;
}

const MOVE_COPY = Object.freeze({ grow: "이어 감", build: "쌓는 중", switch: "전환", keep: "유지", break: "끊김" });

/**
 * The streak as the table shows it while a window is open: where it stands,
 * and what each card would do to it. `offered` is the types the scene has on
 * the table (`listOfferedTypes`), the same list the settlement is handed, so
 * the streak a card is shown to leave is the one its pot is paid on.
 *
 * `after` is the streak with the staked card played (the run's own with none
 * staked), and `bonus` what that pays; the pot's own line prints the bonus, as
 * it printed the groove's. `type` and `held` are the type being held and how
 * far the hold has got, and `note` what the staked card does, or that a change
 * of type would count. `line` is those in one line -- the sentence a test or a
 * wide screen reads whole -- and `spoken` the sentence the push and confirm
 * buttons are described by.
 */
export function readLogic({ logic, card, offered, relics = [] }) {
  const reach = hasRelic(relics, "metronome");
  const play = (type) => advanceLogic(logic, { type, tier: 0, offered, reach });
  const moveOf = (candidate) => play(getLogicType(candidate)).move;
  const staked = card ? play(getLogicType(card)) : null;
  const now = staked?.logic ?? logic;
  const open = logic.rose || (reach && logic.reach > 0);
  const held = `${Math.min(LOGIC_HOLD, now.held)}/${LOGIC_HOLD}`;
  const hold = now.type ? `${getTypeName(now.type)} ${held}` : "첫 카드부터 센다";
  const bonus = getLogicBonus(now.streak);
  const did = staked ? MOVE_COPY[staked.move] : null;
  const note = did ?? (open && !staked ? "전환 가능" : "");
  return {
    after: now.streak,
    bonus,
    move: staked?.move ?? null,
    moveOf,
    type: now.type,
    held,
    note,
    line: [`논리 콤보 ${now.streak}`, hold, note].filter(Boolean).join(" · "),
    spoken: `논리 콤보 ${now.streak}, 판돈 ${bonus.toFixed(2)}배. ${hold}.${did ? ` 이 카드로 ${did}.` : open && !staked ? " 압박이 올라 유형을 바꿔도 콤보가 오른다." : ""}`,
  };
}

/** What a card's tag adds for a screen reader: what picking it would do to the streak. */
export const describeCardMove = (move) => (MOVE_COPY[move] ? `(콤보 ${MOVE_COPY[move]})` : "");

/**
 * What the table says aloud about its clock, in one polite region. The timer
 * itself is silent to a screen reader, and the tick that marks the last five
 * seconds is sound, so the clock is called once at ten seconds and once at
 * five. It is also called when the reading clock ran out and opened the table
 * by itself: nothing was pressed, the briefing simply went away, and the first
 * thing a listener heard about a running clock used to be "10초 남았다".
 */
export const CLOCK_OPENED_CALL = "읽는 시간이 끝나 판이 열렸다. 시계가 흐른다";
const CLOCK_OPENED_SECONDS = 5;

export function getClockCall({ live, paused, remaining, elapsed = 0, openedByClock = false }) {
  if (!live || paused) return "";
  if (remaining <= 5) return "5초 남았다";
  if (remaining <= 10) return "10초 남았다";
  return openedByClock && elapsed < CLOCK_OPENED_SECONDS ? CLOCK_OPENED_CALL : "";
}

/**
 * The two notices about another tab. They are drawn in the same place, and
 * one is the answer to the other: 그 탭에 두기 stops this table, so the
 * question that offered it comes down as the notice goes up. It used to stay
 * -- still a modal dialog holding the focus -- with the notice on top of it.
 */
export function getTabNotices({ locked, awaitingClaim, live }) {
  return { lost: Boolean(locked && (live || awaitingClaim)), held: Boolean(awaitingClaim && !locked) };
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
 *
 * `caseId` is the case on the table. The rules it plays under (`tableUnlocks`)
 * come back as `rules`, a read-only Set, and both forecasts are dealt under
 * them: a step that has no OVERCLOCK yet is not told one is coming.
 *
 * `logic` is the streak as the table shows it (`readLogic`), and null in a
 * case that does not have the rule yet.
 */
export function useTableForecast({ schema, run, win, selectedCard, multiplier, caseId, offered }) {
  // The same frozen Set for a case from one render to the next, so it can key a memo.
  const rules = getTableRules(caseId, run);
  const mutations = useMemo(() => describeMutations(schema), [schema]);
  const relics = run?.relics;
  const streakState = run?.logic;
  const logic = useMemo(
    () => (rules.has("logic") && streakState ? readLogic({ logic: streakState, card: selectedCard, offered, relics }) : null),
    [offered, relics, rules, selectedCard, streakState],
  );
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
  // the schedule `resolveWindow` applies (`getSeasonEscalation`), which a
  // practice window does not move along (`getEscalationWindow`).
  const windowIndex = getEscalationWindow(run) + (run?.practice ? 0 : 1);

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
        rules,
      })),
    [focusMode, fractureAxis, hot, indebted, pushed, relics, rules, stanceEarned, stanceMastery, streak, windowIndex],
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
        rules,
      })),
    [fractureAxis, relics, rules, schema.wallMin, windowIndex],
  );

  return useMemo(() => {
    // REBOOT is the rules resetting, not a rule bending the board. The draft and
    // the reveal already say the case closed; a panel saying so again cost a
    // phone 92px of the table at every case's first window.
    const tableRules = mutations.filter((mutation) => mutation.id !== "reboot");
    return {
      rules,
      logic,
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
  }, [bustMutations, cashMutations, fractureAxis, hot, logic, mutations, relics, rules, run?.busts, run?.insuranceSpent, run?.runPot, schema, streak]);
}
