import { rulesNextOn, rulesTrialOn } from "./rulesNext.js";

/**
 * G1·G2·G3·G6·G7 (2026-11-19, 「전부 1」): the numbers of the next table rules
 * and the switch that carries them. A rule set plays them unless it says
 * otherwise: `OLD_RULE` in it plays the rules before them, `NEXT_RULE` the
 * next ones, and a set with neither -- every case's own, as tableUnlocks.js
 * deals them -- what this page plays (`wantsNextRules`). Everything that
 * already takes the case's rules -- the reducer, the settlement, the replay,
 * the server's recheck -- reads it the same way, so a row can be checked
 * under the rules it was played under.
 *
 * Bot measurement behind each number: check:pressure (`RULES_NEXT=0` plays
 * the old rules beside it) and cp-archive/메모-20261119/gameplay/표-core.md.
 */
export const NEXT_RULE = "next";
export const OLD_RULE = "old";
/**
 * The RULES_MARK a row played under these rules carries. The recheck plays a
 * row under them when its mark is this or later (rankingRecheck.js), so the
 * bundle that raises RULES_MARK to 5 switches the page and the check together.
 */
export const RULES_NEXT_MARK = 5;

/** Whether this page (or this script) plays the next rules: `RULES_NEXT=0` turns them off in a script. */
export function wantsNextRules(scope = globalThis) {
  const env = scope.process?.env?.RULES_NEXT;
  if (env === "0") return false;
  if (env === "1") return true;
  return rulesNextOn(scope);
}

/** What a rule set that names neither plays: this page's (or script's) choice, read once. */
let nextChoice;
const nextByDefault = () => (nextChoice ??= wantsNextRules());

/** Whether `rules` plays the next rules. */
export function isNextOn(rules) {
  if (rules?.has?.(OLD_RULE)) return false;
  if (rules?.has?.(NEXT_RULE)) return true;
  return nextByDefault();
}

const withSets = new WeakMap();
const withoutSets = new WeakMap();
/** `rules` playing the next rules (`on`) or the old ones; the same set back when it already does. */
export function withNextRules(rules, on = nextByDefault()) {
  if (!rules || typeof rules.has !== "function") return rules;
  if (isNextOn(rules) === Boolean(on)) return rules;
  const mark = on ? NEXT_RULE : OLD_RULE;
  const drop = on ? OLD_RULE : NEXT_RULE;
  if (!(rules instanceof Set)) return { has: (id) => id === mark || (id !== drop && rules.has(id)) };
  const cache = on ? withSets : withoutSets;
  if (!cache.has(rules)) cache.set(rules, Object.freeze(new Set([...[...rules].filter((id) => id !== drop), mark])));
  return cache.get(rules);
}

/* ------------------------------------------------- G1 눈에 띔 (exposure) */

/**
 * Holding one direction builds 눈에 띔: every window past `EXPOSURE_FROM` in
 * a row on the same direction adds a point. On a board with points a cash
 * below `EXPOSURE_HEAT` can be caught, with `EXPOSURE_STEP` chance a point up
 * to `EXPOSURE_MAX`, drawn from the window's seed. A caught board pays no pot
 * and halves the streak. Changing direction clears the points and halves the
 * streak (instead of ending it). A charged EXPOSE cash is never caught (G3).
 */
export const EXPOSURE_FROM = 4;
const EXPOSURE_STEP = 0.05;
const EXPOSURE_MAX = 0.3;
export const EXPOSURE_HEAT = 50;

/** 눈에 띔 after `held` windows in a row on one direction. */
export const getExposure = (held) => Math.max(0, Math.trunc(Number(held) || 0) - EXPOSURE_FROM);
/** The points past which the chance stops growing (the table shows the points out of it). */
export const EXPOSURE_STEPS = Math.round(EXPOSURE_MAX / EXPOSURE_STEP);
export const getCatchChance = (exposure) => Math.min(EXPOSURE_MAX, Math.max(0, Number(exposure) || 0) * EXPOSURE_STEP);

/* ------------------------------------------------ G2 둘째 조회 값 사다리 */

/**
 * The 믿음 the case's nth second look costs (n from 0): 2, 2, 3, 3, 4, 4, ...
 * The first two at the old price, then one more every two. Measured: for the
 * 믿음 the old narrow-every-board hand paid in a case, the best hand now
 * narrows on about two pushed boards in three.
 */
export const narrowTrustAt = (count) => 2 + Math.floor(Math.max(0, Math.trunc(Number(count) || 0)) / 2);

/** How many second looks a case's log has bought (each entry's `threshold.narrowed`). */
export function countNarrows(log = []) {
  return (Array.isArray(log) ? log : []).filter((entry) => entry?.threshold?.narrowed === true).length;
}

/* ------------------------------------------------------- G3 stances */

/** STRIKE cashed at or past this heat may lift LOCK's pot to `STRIKE_HOT_CAP` (the hand's own cap) instead of LOCK_CAP. */
export const STRIKE_HOT_GAUGE = 60;
export const STRIKE_HOT_CAP = 1.55;
/** STEADY, a little weaker: its pot rate and the heat a press cools. */
export const STEADY_NEXT = Object.freeze({ potRate: 0.55, relief: 1 });
/** A charged EXPOSE cash also thickens the next board's chips this much (EXPOSED HAND), as STRIKE WAKE does by STRIKE_WAKE_CHIPS. */
// G14 (11-20, 게임성 개선점 Q8 (1)): 1.25 -> 1.3.
export const EXPOSE_CARRY_CHIPS = 1.3;

/* --------------------------------------------------------- G6 결재 판 */

/** The last board of a case: its stake this many times, and one cell of the wall's band shown. */
export const SIGN_CHIPS = 1.5;
export const SIGN_MARK = "sign";

/* ------------------------------------------------------ G7 숨 고르기 */

/** Once, on the board right after a BUST and before its first push: this much clock, AFTERSHOCK one step down. */
export const BREATH_SECONDS = 2;
export const BREATH_GAUGE = 11;
export const BREATH_WALL = 3;
/** G15 (11-20, 게임성 개선점 Q9 (1)): after a BUST at this heat or over, 숨 고르기 cools this much instead. */
export const BREATH_HOT_FROM = 60;
export const BREATH_HOT_GAUGE = 14;

/* ------------------------------------------- RULES_MARK 7 (11-25 묶음) */

/**
 * G11b·c, G13, G16 and G18 (게임성 개선점 2026-11-20, the user's 「1 나눠서 두
 * 번」): rules that ship with the wipe of 2026-11-25 as RULES_MARK 7. A row is
 * rechecked under them only when its mark is `RULES_SEVEN_MARK` or later
 * (rankingRecheck.js `getRowRules`), so a row of 5 or 6 is played again as it
 * was. They ride on the next rules: a set that plays the old ones plays none
 * of these either. `SEVEN_RULE` in a set plays them, `BEFORE_SEVEN_RULE` the
 * rules of RULES_MARK 6, and a set with neither what this page plays.
 * `RULES_MARK7=0` turns them off in a script (check:pressure's before and after).
 */
export const RULES_SEVEN_MARK = 7;
export const SEVEN_RULE = "mark7";
export const BEFORE_SEVEN_RULE = "before7";

/** Whether this page (or this script) plays RULES_MARK 7's rules: `RULES_MARK7=0` turns them off in a script. */
export function wantsMarkSeven(scope = globalThis) {
  return scope.process?.env?.RULES_MARK7 !== "0";
}

/** What a rule set that names neither plays: this page's (or script's) choice, read once. */
let sevenChoice;
export const sevenByDefault = () => (sevenChoice ??= wantsMarkSeven());

/** Whether `rules` plays RULES_MARK 7's rules (and so the next rules too). */
export function isMarkSevenOn(rules) {
  if (!isNextOn(rules)) return false;
  if (rules?.has?.(BEFORE_SEVEN_RULE)) return false;
  if (rules?.has?.(SEVEN_RULE)) return true;
  return sevenByDefault();
}

const sevenSets = new WeakMap();
const beforeSevenSets = new WeakMap();
/** `rules` playing RULES_MARK 7's rules (`on`) or those of 6; the same set back when it already does. */
export function withMarkSeven(rules, on = sevenByDefault()) {
  if (!rules || typeof rules.has !== "function") return rules;
  if (isMarkSevenOn(rules) === Boolean(on) || (on && !isNextOn(rules))) return rules;
  const mark = on ? SEVEN_RULE : BEFORE_SEVEN_RULE;
  const drop = on ? BEFORE_SEVEN_RULE : SEVEN_RULE;
  if (!(rules instanceof Set)) return { has: (id) => id === mark || (id !== drop && rules.has(id)) };
  const cache = on ? sevenSets : beforeSevenSets;
  if (!cache.has(rules)) cache.set(rules, Object.freeze(new Set([...[...rules].filter((id) => id !== drop), mark])));
  return cache.get(rules);
}

/**
 * G13 첫 조회 사다리: the 믿음 the case's nth first look costs (n from 0):
 * 1, 1, 1, 2, 2, 3, 3, ... The first three at today's price (SCOUT_TRUST),
 * then one more every two, as G2 did for the second look.
 */
export const scoutTrustAt = (count) => {
  const n = Math.max(0, Math.trunc(Number(count) || 0));
  return n < 3 ? 1 : 2 + Math.floor((n - 3) / 2);
};

/** How many first looks a case's log has bought (each entry's `threshold.scouted`). */
export function countScouts(log = []) {
  return (Array.isArray(log) ? log : []).filter((entry) => entry?.threshold?.scouted === true).length;
}

/* ------------------------------------------- RULES_MARK 8 (after bundle R) */

/**
 * G19~G26 (게임성 개선점 3차, the user's 「전부 1」 of 2026-11-23): rules that
 * ship right after bundle R as RULES_MARK 8. A row is rechecked under
 * them only when its mark is `RULES_EIGHT_MARK` or later (rankingRecheck.js
 * `getRowRules`), so a row of 5 to 7 is played again as it was. They ride on
 * RULES_MARK 7's: a set that plays those off plays none of these. `EIGHT_RULE`
 * in a set plays them, `BEFORE_EIGHT_RULE` the rules of 7, and a set with
 * neither what this page plays. `RULES_MARK8=0` turns them off in a script.
 */
export const RULES_EIGHT_MARK = 8;
export const EIGHT_RULE = "mark8";
export const BEFORE_EIGHT_RULE = "before8";

/** Whether this page (or this script) plays RULES_MARK 8's rules: `RULES_MARK8=0` turns them off in a script. */
export function wantsMarkEight(scope = globalThis) {
  return scope.process?.env?.RULES_MARK8 !== "0";
}

/** What a rule set that names neither plays: this page's (or script's) choice, read once. */
let eightChoice;
export const eightByDefault = () => (eightChoice ??= wantsMarkEight());

/** Whether `rules` plays RULES_MARK 8's rules (and so 7's too). */
export function isMarkEightOn(rules) {
  if (!isMarkSevenOn(rules)) return false;
  if (rules?.has?.(BEFORE_EIGHT_RULE)) return false;
  if (rules?.has?.(EIGHT_RULE)) return true;
  return eightByDefault();
}

const eightSets = new WeakMap();
const beforeEightSets = new WeakMap();
/** `rules` playing RULES_MARK 8's rules (`on`) or those of 7; the same set back when it already does. */
export function withMarkEight(rules, on = eightByDefault()) {
  if (!rules || typeof rules.has !== "function") return rules;
  if (isMarkEightOn(rules) === Boolean(on) || (on && !isMarkSevenOn(rules))) return rules;
  const mark = on ? EIGHT_RULE : BEFORE_EIGHT_RULE;
  const drop = on ? BEFORE_EIGHT_RULE : EIGHT_RULE;
  if (!(rules instanceof Set)) return { has: (id) => id === mark || (id !== drop && rules.has(id)) };
  const cache = on ? eightSets : beforeEightSets;
  if (!cache.has(rules)) cache.set(rules, Object.freeze(new Set([...[...rules].filter((id) => id !== drop), mark])));
  return cache.get(rules);
}

/** G21: METRONOME also pays on the first board after this many in a row on one direction. */
export const METRONOME_HOLD = 6;
/** G22: 숨 고르기 after a BUST at BREATH_HOT_FROM or over moves the wall this far instead of BREATH_WALL. */
export const BREATH_HOT_WALL = 5;
/** The page's trial switch comes next: G27's leak and G25's refining, neither of which is the table's yet. */
/** The page's trial switch (rulesNext.js), read once. */
let trialChoice;
export const trialByDefault = () => (trialChoice ??= rulesTrialOn());
/** G25 도구 다듬기: on the trial only. Three prices and shares moved the hand -0.2 to +0.1% against a +3% target. */
export const isRefineOn = () => isMarkEightOn() && trialByDefault();

/** G23 여는 판돈: 크게 연다 pays every card this much in the case, and the band's near end stands here (a board already nearer keeps its own). */
export const OPEN_BIG_CHIPS = 1.2;
export const OPEN_BIG_WALL = 48;
export const OPEN_WAYS = Object.freeze(["normal", "big"]);
/** The cases that ask: 사건 08 to 42 (the first hour plays as it does, and 8막 has its signature in the same place). */
export function isOpeningCase(caseId) {
  const number = /^case(\d{2})$/.exec(String(caseId))?.[1];
  return Boolean(number) && Number(number) >= 8 && Number(number) <= 42;
}

/** G27 (trial only): this long after a full charge it starts to leak, one step a second of table clock. A stopped clock leaks nothing. */
export const CHARGE_LEAK_GRACE = 4;
export const CHARGE_LEAK_STEP = 10;
