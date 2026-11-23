import { rulesNextOn } from "./rulesNext.js";

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
const nextByDefault = () => (nextByDefault.value ??= wantsNextRules());

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
