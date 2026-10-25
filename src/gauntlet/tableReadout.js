import { useMemo } from "react";

import { formatNumber, isResourceGain } from "../gameConstants.js";
import { BASE_SCHEMA, buildNextSchema, describeMutations, FRACTURE_MIN_BURN, getCardBurn, getClockHeatRate, getEscalationWindow, HOT_CASH_MULTIPLIER, isPenaltyMutation, STANCE_CHARGE } from "./gauntletEngine.js";
import { advanceLogic, getLogicBonus, getLogicType } from "./logicStreak.js";
import { hasRelic } from "./relics.js";
import { HEAT_DEBT_GAUGE, INSURANCE_SHARE, LOGIC_HOLD } from "./tableRules.js";
import { directionParticle, easyCognitionLabels, objectParticle, topicParticle } from "../playerLanguage.js";
import { getTableRules } from "./tableUnlocks.js";

export { formatNumber };

/**
 * Rounded down, because the table's rules read the multiplier as a floor: the
 * chain asks for x4 (and once asked x64 of HIGH ROLLER's feat). Rounded to nearest, a
 * x3.95 printed "×4.0" and a cash on it started no chain.
 */
export function formatMultiplier(value) {
  const multiplier = Number(value) || 0;
  return multiplier >= 10 ? `×${Math.floor(multiplier)}` : `×${(Math.floor(multiplier * 10 + 1e-9) / 10).toFixed(1)}`;
}

/**
 * How much faster the clock heats the gauge after this many pushes
 * (`getClockHeatRate`), for the bank rail: nothing before the first push, then
 * `×1.12`, `×1.24`... Two decimals, because a step is 0.12 and the table's
 * one-decimal floor (`formatMultiplier`) would print ×1.12 and ×1.19 alike.
 * The spoken name says what grows -- the heat, not the seconds.
 */
export function describeClockHeat(pushes) {
  const rate = getClockHeatRate(pushes);
  if (!(rate > 1)) return null;
  const value = (Math.round(rate * 100) / 100).toFixed(2);
  return { text: `×${value}`, spoken: `시계가 올리는 열기 ${value}배` };
}

/**
 * The reveal's sentence about the next board, read off what that board was
 * actually dealt (`verdict.nextMutations`). The line used to follow the bust
 * and the push count alone, so a prologue table with no rule to break yet --
 * and every story run -- was told "기본 규칙으로 복귀" and, in the same breath,
 * that the room had broken a rule or that a card might be sealed for stopping
 * early. COLD FEET says a card is locked only while the seal stands: EXPOSE
 * mastery lifts it and leaves the id (`lifted`).
 */
export function describeNextTable(nextMutations = [], busted = false) {
  if (nextMutations.length === 0) return "";
  if (busted) return "다음 판은 벽에 닿은 대가로 바뀐 규칙으로 시작한다.";
  return nextMutations.some((mutation) => mutation.id === "coldFeet" && !mutation.lifted)
    ? "한 번도 밀지 않고 멈춘 대가로 다음 판의 가장 비싼 카드가 봉인된다."
    : "이번 열기와 소모가 다음 판의 환경을 다시 계산한다.";
}

const VERDICT_CAUSE_COPY = Object.freeze({
  cash: "직접 확정했다",
  push: "한 번 더 밀었다",
  creep: "시계가 올린 열기가 벽에 닿았다",
  timeout: "시계를 방치했다",
  abandon: "걸어 둔 판을 떠났다",
  // Not one of `VERDICT_CAUSES`: no press heats the gauge now. A verdict logged
  // before 2026-10-10 can name it, and still reads as it did.
  focus: "LOCK이 올린 열기가 벽에 닿았다",
});

/**
 * Why the window closed, in the reveal's ledger. One sentence a cause
 * (`VERDICT_CAUSES`): the bust the player did not press for -- the clock's
 * heat creeping into the wall -- used to fall through to the cash's line, so a
 * BUST headline sat over "직접 확정했다". A cause this table does not know says
 * only what the outcome proves.
 */
export function describeVerdictCause(verdict) {
  return VERDICT_CAUSE_COPY[verdict?.cause] ?? (verdict?.outcome === "bust" ? "열기가 벽에 닿았다" : VERDICT_CAUSE_COPY.cash);
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
  const paid = `논리 콤보 ${streak}, 배율 ${bonusText(logic?.bonus)}.`;
  // FIELD NOTES holds a type one window shorter; the verdict says which hold it read.
  const hold = Number(logic?.hold) || LOGIC_HOLD;
  switch (logic?.move) {
    case "grow":
      return `${type}${objectParticle(type)} 이어 갔다. ${paid}`;
    case "build":
      return `${type} ${Math.min(hold, Number(logic.held) || 1)}/${hold}. 같은 유형 ${hold === LOGIC_HOLD ? "세" : "두"} 번째부터 콤보가 오른다. ${paid}`;
    case "switch":
      return `열기가 오른 판에서 ${type}${directionParticle(type)} 바꿨다. 전환으로 콤보가 올랐다. ${paid}`;
    case "keep":
      return `지키던 유형의 카드가 이 장면에 없었다. 콤보는 그대로다. ${paid}`;
    case "break":
      return `열기가 오르지 않았는데 ${type}${directionParticle(type)} 바꿨다. 논리 콤보는 0, 다시 1/${hold}부터 센다.`;
    case "bust":
      return streak > 0 ? `벽에 닿았지만 논리 콤보 ${streak}${topicParticle(String(streak))} 남았다.` : "벽에 닿아 논리 콤보가 끊겼다.";
    default:
      return null;
  }
}

/** The same move as the archive's one line under a logged decision. */
export function describeLogicLog(logic) {
  return logic?.pot > 0 ? { label: "LOGIC STREAK", text: `논리 콤보 ${logic.streak} · 배율 ${bonusText(logic.bonus)} · +${formatNumber(logic.pot)}` } : null;
}

const MOVE_COPY = Object.freeze({ grow: "이어 감", build: "쌓는 중", switch: "전환", keep: "유지", break: "끊김" });

/**
 * The streak as the table shows it while a window is open: where it stands,
 * and what each card would do to it. `offered` is the types the scene has on
 * the table (`listOfferedTypes`), the same list the settlement is handed, so
 * the streak a card is shown to leave is the one its pot is paid on.
 *
 * `after` is the streak with the staked card played (the run's own with none
 * staked), and `bonus` what that pays; the pot's own line prints the bonus.
 * `type` and `held` are the type being held and how
 * far the hold has got, and `note` what the staked card does, or that a change
 * of type would count. `line` is those in one line -- the sentence a test or a
 * wide screen reads whole -- and `spoken` the sentence the push and confirm
 * buttons are described by.
 */
export function readLogic({ logic, card, offered, relics = [] }) {
  const reach = hasRelic(relics, "metronome");
  const holdAt = hasRelic(relics, "fieldNote") ? LOGIC_HOLD - 1 : LOGIC_HOLD;
  const play = (type) => advanceLogic(logic, { type, tier: 0, offered, reach, hold: holdAt });
  const moveOf = (candidate) => play(getLogicType(candidate)).move;
  const staked = card ? play(getLogicType(card)) : null;
  const now = staked?.logic ?? logic;
  const open = logic.rose || (reach && logic.reach > 0);
  const held = `${Math.min(holdAt, now.held)}/${holdAt}`;
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
    spoken: `논리 콤보 ${now.streak}, 배율 ${bonus.toFixed(2)}배. ${hold}.${did ? ` 이 카드로 ${did}.` : open && !staked ? " 열기가 올라 유형을 바꿔도 콤보가 오른다." : ""}`,
  };
}

/** What a card's tag adds for a screen reader: what picking it would do to the streak. */
export const describeCardMove = (move) => (MOVE_COPY[move] ? `(콤보 ${MOVE_COPY[move]})` : "");

/**
 * The same, as the one sign the tag prints for the eye. The tag's colour said
 * only "ends the streak or not", and colour alone says nothing to a player who
 * cannot tell cyan from grey (WCAG 1.4.1): the sign is what the streak's number
 * would do. Up for a card that raises it, the two-way arrow for one that
 * raises it by changing type, level for one that leaves it where it is, and a
 * cross for the one that ends it. All four are glyphs the game's face draws
 * (the heavy cross U+2715 is on the charset list and not in Pretendard).
 */
const MOVE_MARKS = Object.freeze({ grow: "▲", switch: "↔", build: "=", keep: "=", break: "×" });

export const getMoveMark = (move) => MOVE_MARKS[move] ?? "";

/**
 * What the wild card is called. The guide and the scene's challenge send the
 * player to "'판을 다시 짠다' 카드", and the card printed only the label its
 * scene wrote (다른 방법을 제안한다 on 354 of the 427 scenes that deal it) over
 * an English "WILD": nothing on the table had the name the help used.
 */
export const REFRAME_CARD_NAME = "판을 다시 짠다";

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

/**
 * The run's six numbers and the clues it holds, as one line of the folded
 * briefing. A locked card states its condition in these ("지금 믿음 N, 단서
 * N개", `getAuthorityGate`) and the table printed none of them: the HUD is the
 * pot, the heat and the clock. The values are printed as the gate reads them,
 * so the line and a locked card's sentence never disagree.
 */
export function describeStanding(resources = {}, resourceMeta = {}, clueCount = 0) {
  return [
    ...Object.entries(resourceMeta).map(([key, meta]) => `${meta.label} ${Number(resources?.[key]) || 0}${meta.suffix ?? ""}`),
    `단서 ${Number(clueCount) || 0}개`,
  ].join(" · ");
}

/**
 * The same six across the case just closed: what its first logged decision
 * started from and what its last one left. The log is emptied when a case
 * opens (`RUN_FIELDS.log`) and only a commit moves the resources, so the two
 * ends of the log are the two ends of the case. `labels` is the six names in
 * the order they are printed (`easyResourceLabels`).
 *
 * An entry saved without them, or rebuilt from a replay seed, holds `{}`
 * for both (`savedState.js`), so each end is the nearest entry with numbers;
 * a resource either end lacks is left out rather than printed as 0, and a log
 * with no numbers at all lists nothing. `gain` is null for a value that did
 * not move: it is neither a gain nor a loss.
 */
export function describeCaseChange(log = [], labels = {}) {
  const held = (value) => Boolean(value) && Object.keys(value).length > 0;
  const before = log.find((entry) => held(entry?.resourcesBefore))?.resourcesBefore;
  const after = log.findLast((entry) => held(entry?.resourcesAfter))?.resourcesAfter;
  if (!before || !after) return [];
  return Object.entries(labels)
    .filter(([key]) => typeof before[key] === "number" && typeof after[key] === "number")
    .map(([key, label]) => ({
      key,
      text: `${label} ${before[key]} → ${after[key]}`,
      gain: before[key] === after[key] ? null : isResourceGain(key, after[key] - before[key]),
    }));
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
  if (willOverdrive) return { id: "ready", label: "오버클럭 준비", text: "지금 확정하면 다음 판은 칩 2배, 밀기 폭 증가", progress: 100 };
  if (streak > 0 && hot) return { id: "live", label: "이어짐", text: "한 번 더 ×4+ 확정하면 오버클럭", progress: 75 };
  if (streak > 0) return { id: "held", label: "유지", text: "이번 판도 ×4 이상으로 확정해야 이어진다", progress: 50 };
  if (hot) return { id: "ignition", label: "점화", text: "확정하면 오버클럭 연속 1단계", progress: 35 };
  return { id: "dormant", label: "꺼짐", text: "×4 이상 확정부터 연속이 켜진다", progress: 12 };
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
  const { pushes } = win;
  const pushed = pushes > 0;
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
      // The ones the last decision cost the player: what the briefing's alarm
      // sounds for. It used to sound for every entry, a reward and REBOOT too.
      breach: tableRules.filter(isPenaltyMutation),
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
      clockHeat: describeClockHeat(pushes),
      runTension: Math.min(100, (run?.busts ?? 0) * 24 + streak * 16 + Math.min(40, Math.log10(Math.max(1, run?.runPot ?? 0)) * 11)),
    };
  }, [bustMutations, cashMutations, fractureAxis, hot, logic, mutations, pushes, relics, rules, run?.busts, run?.insuranceSpent, run?.runPot, schema, streak]);
}
