import { rulesNextOn, rulesTrialOn } from "./rulesNext.js";
import { HOT_CASH_MULTIPLIER } from "./tableRules.js";

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

/* ------------------------------------------- RULES_MARK 9 (2027-04-05) */

/**
 * G29~G37 (게임성 개선점 4차, the user's 「전부 1」 of 2026-11-25): rules that
 * ship as RULES_MARK 9. A row is rechecked under them only when its mark is
 * `RULES_NINE_MARK` or later (rankingRecheck.js `getRowRules`), so a row of 5
 * to 8 is played again as it was. They ride on RULES_MARK 8's: a set that
 * plays those off plays none of these. `NINE_RULE` in a set plays them,
 * `BEFORE_NINE_RULE` the rules of 8, and a set with neither what this page
 * plays. `RULES_MARK9=0` turns them off in a script.
 */
export const RULES_NINE_MARK = 9;
export const NINE_RULE = "mark9";
export const BEFORE_NINE_RULE = "before9";

/** Whether this page (or this script) plays RULES_MARK 9's rules: `RULES_MARK9=0` turns them off in a script. */
export function wantsMarkNine(scope = globalThis) {
  return scope.process?.env?.RULES_MARK9 !== "0";
}

/** What a rule set that names neither plays: this page's (or script's) choice, read once. */
let nineChoice;
export const nineByDefault = () => (nineChoice ??= wantsMarkNine());

/** Whether `rules` plays RULES_MARK 9's rules (and so 8's too). */
export function isMarkNineOn(rules) {
  if (!isMarkEightOn(rules)) return false;
  if (rules?.has?.(BEFORE_NINE_RULE)) return false;
  if (rules?.has?.(NINE_RULE)) return true;
  return nineByDefault();
}

const nineSets = new WeakMap();
const beforeNineSets = new WeakMap();
/** `rules` playing RULES_MARK 9's rules (`on`) or those of 8; the same set back when it already does. */
export function withMarkNine(rules, on = nineByDefault()) {
  if (!rules || typeof rules.has !== "function") return rules;
  if (isMarkNineOn(rules) === Boolean(on) || (on && !isMarkEightOn(rules))) return rules;
  const mark = on ? NINE_RULE : BEFORE_NINE_RULE;
  const drop = on ? BEFORE_NINE_RULE : NINE_RULE;
  if (!(rules instanceof Set)) return { has: (id) => id === mark || (id !== drop && rules.has(id)) };
  const cache = on ? nineSets : beforeNineSets;
  if (!cache.has(rules)) cache.set(rules, Object.freeze(new Set([...[...rules].filter((id) => id !== drop), mark])));
  return cache.get(rules);
}

/**
 * G29 돈 쪽 유혹 (RULES_MARK 9): a card's 자본 and 시간 gains weigh this much
 * in its chips; every other gain (사람 피해 down, 믿음, 정당성, 피로 down) keeps
 * ×2. Before, a 사람 card out-paid a 자리 card in 72% of the scenes that dealt
 * both (게임성 개선점 4차 G29); the 사람 피해 a money card brings is paid in
 * the story, at the collapse gate.
 */
// 2.75, the top of the notes' 2.5~2.75: mixed scenes 67.7% money-richer (target 55~70%); 2.5 left the money hand's vault at 0.75 of people-first's.
export const COIN_GAIN_WEIGHT = 2.75;
export const COIN_GAIN_KEYS = Object.freeze(["capital", "time"]);

/**
 * G30 벽 앞 확정 (RULES_MARK 9): a cash this close to the real wall or closer
 * pays its pot EDGE_CASH_BONUS times. Unknown at the press (the heartbeat
 * hears the wall within its error), told on the slam and the reveal. It
 * multiplies whatever the tools paid (G11c's cap is the tools' own): laid
 * under that cap it turned FRONT PAGE (×1.2 -> ×1.5) into every hand's best,
 * and as the bigger of the two it took the worth out of the draft's 「one
 * more」 (check:pressure, measured 11-25; 게임성 4차 G30).
 */
export const EDGE_CASH_REACH = 3;
export const EDGE_CASH_BONUS = 1.25;
/** How far under the wall a cashed window closed, when that is EDGE_CASH_REACH or less; null otherwise. */
export function readEdgeCash(win) {
  if (win?.status !== "cashed") return null;
  const gap = Number(win.wall) - Number(win.gauge);
  return Number.isFinite(gap) && gap >= 0 && gap <= EDGE_CASH_REACH ? Math.floor(gap) : null;
}
/** The pot factor of a cash with the tools' `boost` (readRelicBoost) and, when `edge`, G30's on top of it. */
export function withEdgeBonus(boost, edge) {
  return edge ? boost.factor * EDGE_CASH_BONUS : boost.factor;
}

/* ------------------------------------------------------ RULES_MARK 10 */

/**
 * G40, G41 and G42 (게임성 개선점 5차, the user's 「전부 1」 of 2026-11-26):
 * rules that ship as RULES_MARK 10. A row is rechecked under them only when
 * its mark is `RULES_TEN_MARK` or later (rankingRecheck.js `getRowRules`), so
 * a row of 5 to 9 is played again as it was. They ride on RULES_MARK 9's: a
 * set that plays those off plays none of these. `TEN_RULE` in a set plays
 * them, `BEFORE_TEN_RULE` the rules of 9, and a set with neither what this
 * page plays. `RULES_MARK10=0` turns them off in a script.
 */
export const RULES_TEN_MARK = 10;
export const TEN_RULE = "mark10";
export const BEFORE_TEN_RULE = "before10";

/** Whether this page (or this script) plays RULES_MARK 10's rules: `RULES_MARK10=0` turns them off in a script. */
export function wantsMarkTen(scope = globalThis) {
  return scope.process?.env?.RULES_MARK10 !== "0";
}

/** What a rule set that names neither plays: this page's (or script's) choice, read once. */
let tenChoice;
export const tenByDefault = () => (tenChoice ??= wantsMarkTen());

/** Whether `rules` plays RULES_MARK 10's rules (and so 9's too). */
export function isMarkTenOn(rules) {
  if (!isMarkNineOn(rules)) return false;
  if (rules?.has?.(BEFORE_TEN_RULE)) return false;
  if (rules?.has?.(TEN_RULE)) return true;
  return tenByDefault();
}

const tenSets = new WeakMap();
const beforeTenSets = new WeakMap();
/** `rules` playing RULES_MARK 10's rules (`on`) or those of 9; the same set back when it already does. */
export function withMarkTen(rules, on = tenByDefault()) {
  if (!rules || typeof rules.has !== "function") return rules;
  if (isMarkTenOn(rules) === Boolean(on) || (on && !isMarkNineOn(rules))) return rules;
  const mark = on ? TEN_RULE : BEFORE_TEN_RULE;
  const drop = on ? BEFORE_TEN_RULE : TEN_RULE;
  if (!(rules instanceof Set)) return { has: (id) => id === mark || (id !== drop && rules.has(id)) };
  const cache = on ? tenSets : beforeTenSets;
  if (!cache.has(rules)) cache.set(rules, Object.freeze(new Set([...[...rules].filter((id) => id !== drop), mark])));
  return cache.get(rules);
}

/**
 * G42 OVERCLOCK 문턱 (RULES_MARK 10): the cash that builds the chain is ×32 or
 * better, not ×4 -- every cash had reached ×4 (p50 ×32.7), so OVERCLOCK was on
 * 63.6% of boards and paid 84.4% of the pot (게임성 5차 G42). Two in a row
 * still OVERCLOCK the board (OVERCLOCK_STREAK); its chips and push stay.
 */
export const HOT_CASH_TEN = 32;
/** The multiplier a cash needs to build the OVERCLOCK chain under `rules`. */
export const getHotCashMultiplier = (rules) => (isMarkTenOn(rules) ? HOT_CASH_TEN : HOT_CASH_MULTIPLIER);

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

/* ------------------------------------------ RULES_MARK 11 (게임성 5차 B) */

/**
 * G38·G39 (게임성 개선점 5차, the user's 「전부 1」 of 2026-11-26): rules that
 * ship as RULES_MARK 11. A row is rechecked under them only when its mark is
 * `RULES_ELEVEN_MARK` or later (rankingRecheck.js `getRowRules`), so a row
 * of 5 to 10 is played again as it was. They ride on the marks before: a set
 * that plays those off plays none of these. `ELEVEN_RULE` in a set plays
 * them, `BEFORE_ELEVEN_RULE` the rules before, and a set with neither what
 * this page plays. `RULES_MARK11=0` turns them off in a script.
 */
export const RULES_ELEVEN_MARK = 11;
export const ELEVEN_RULE = "mark11";
export const BEFORE_ELEVEN_RULE = "before11";

/** Whether this page (or this script) plays RULES_MARK 11's rules: `RULES_MARK11=0` turns them off in a script. */
export function wantsMarkEleven(scope = globalThis) {
  return scope.process?.env?.RULES_MARK11 !== "0";
}

/** What a rule set that names neither plays: this page's (or script's) choice, read once. */
let elevenChoice;
export const elevenByDefault = () => (elevenChoice ??= wantsMarkEleven());

/** The mark RULES_MARK 11 rides on (whether `rules` plays the rules before it). */
const isMarkBeforeElevenOn = (rules) => isMarkTenOn(rules);

/** Whether `rules` plays RULES_MARK 11's rules (and so those before it too). */
export function isMarkElevenOn(rules) {
  if (!isMarkBeforeElevenOn(rules)) return false;
  if (rules?.has?.(BEFORE_ELEVEN_RULE)) return false;
  if (rules?.has?.(ELEVEN_RULE)) return true;
  return elevenByDefault();
}

const elevenSets = new WeakMap();
const beforeElevenSets = new WeakMap();
/** `rules` playing RULES_MARK 11's rules (`on`) or those before; the same set back when it already does. */
export function withMarkEleven(rules, on = elevenByDefault()) {
  if (!rules || typeof rules.has !== "function") return rules;
  if (isMarkElevenOn(rules) === Boolean(on) || (on && !isMarkBeforeElevenOn(rules))) return rules;
  const mark = on ? ELEVEN_RULE : BEFORE_ELEVEN_RULE;
  const drop = on ? BEFORE_ELEVEN_RULE : ELEVEN_RULE;
  if (!(rules instanceof Set)) return { has: (id) => id === mark || (id !== drop && rules.has(id)) };
  const cache = on ? elevenSets : beforeElevenSets;
  if (!cache.has(rules)) cache.set(rules, Object.freeze(new Set([...[...rules].filter((id) => id !== drop), mark])));
  return cache.get(rules);
}

/**
 * G38 유지비: a case opens with a third of what 믿음, 공정함 and 돈 stand over
 * `UPKEEP_FROM` taken off (100 opens at 93). What it takes, as an effect
 * (empty when nothing stands over it).
 */
export const UPKEEP_FROM = 80;
export const UPKEEP_KEYS = Object.freeze(["trust", "legitimacy", "capital"]);
export function getUpkeep(resources = {}) {
  return Object.fromEntries(UPKEEP_KEYS.map((key) => [key, -Math.round(Math.max(0, (Number(resources?.[key]) || 0) - UPKEEP_FROM) / 3)]).filter(([, cut]) => Number(cut) < 0));
}

/** G39: a scene's record opens only on a table cashed at this multiplier or more. */
export const CLUE_CASH_MULTIPLIER = 32;
/** Whether a table cashed at `multiplier` can open its scene's record. */
export const cashOpensClue = (multiplier) => (Number(multiplier) || 0) >= CLUE_CASH_MULTIPLIER;

/* ------------------------------------------ RULES_MARK 12 (게임성 6차 A) */

/**
 * G46 (게임성 개선점 6차, the user's 「전부 1」 of 2026-11-27): the rule that
 * ships as RULES_MARK 12. A row is rechecked under it only when its mark is
 * `RULES_TWELVE_MARK` or later (rankingRecheck.js `getRowRules`), so a row of
 * 5 to 11 is played again as it was. It rides on the marks before: a set that
 * plays those off plays none of it. `TWELVE_RULE` in a set plays it,
 * `BEFORE_TWELVE_RULE` the rules before, and a set with neither what this page
 * plays. `RULES_MARK12=0` turns it off in a script.
 */
export const RULES_TWELVE_MARK = 12;
export const TWELVE_RULE = "mark12";
export const BEFORE_TWELVE_RULE = "before12";

/** Whether this page (or this script) plays RULES_MARK 12's rules: `RULES_MARK12=0` turns them off in a script. */
export function wantsMarkTwelve(scope = globalThis) {
  return scope.process?.env?.RULES_MARK12 !== "0";
}

/** What a rule set that names neither plays: this page's (or script's) choice, read once. */
let twelveChoice;
export const twelveByDefault = () => (twelveChoice ??= wantsMarkTwelve());

/** The mark RULES_MARK 12 rides on (whether `rules` plays the rules before it). */
const isMarkBeforeTwelveOn = (rules) => isMarkElevenOn(rules);

/** Whether `rules` plays RULES_MARK 12's rules (and so those before it too). */
export function isMarkTwelveOn(rules) {
  if (!isMarkBeforeTwelveOn(rules)) return false;
  if (rules?.has?.(BEFORE_TWELVE_RULE)) return false;
  if (rules?.has?.(TWELVE_RULE)) return true;
  return twelveByDefault();
}

const twelveSets = new WeakMap();
const beforeTwelveSets = new WeakMap();
/** `rules` playing RULES_MARK 12's rules (`on`) or those before; the same set back when it already does. */
export function withMarkTwelve(rules, on = twelveByDefault()) {
  if (!rules || typeof rules.has !== "function") return rules;
  if (isMarkTwelveOn(rules) === Boolean(on) || (on && !isMarkBeforeTwelveOn(rules))) return rules;
  const mark = on ? TWELVE_RULE : BEFORE_TWELVE_RULE;
  const drop = on ? BEFORE_TWELVE_RULE : TWELVE_RULE;
  if (!(rules instanceof Set)) return { has: (id) => id === mark || (id !== drop && rules.has(id)) };
  const cache = on ? twelveSets : beforeTwelveSets;
  if (!cache.has(rules)) cache.set(rules, Object.freeze(new Set([...[...rules].filter((id) => id !== drop), mark])));
  return cache.get(rules);
}

/**
 * G46 OVERCLOCK 심박 (RULES_MARK 12): the cash that builds the chain is one
 * made with the heartbeat at HOT_CASH_BPM or over, not ×32 or better. ×32
 * (heat about 55) was reached only on boards whose wall stood far, so it paid
 * the luck of a far wall and the hand that sees the wall; the hand that reads
 * the heartbeat cashes about 25 under the wall and lost 29.5% of its vault to
 * G42 (게임성 6차 G46: the listening hand's best -17.9% instead, boards played
 * OVERCLOCKed 32.5%). The heartbeat is the wall's tell (`getHeartbeatBpm` on
 * the wall the window tells, its error in), without the clock's late rise, so
 * a board waited out does not build it. Two in a row still OVERCLOCK the board.
 */
export const HOT_CASH_BPM = 110;

/**
 * Whether a cash at `multiplier`, closed at `gauge` on `window`, builds the
 * OVERCLOCK chain under `rules`. `bpmOf(gauge, wall, sedated)` is the engine's
 * getHeartbeatBpm (passed in: this file does not import the engine).
 */
export function isHotCash({ multiplier, gauge, window, rules, bpmOf }) {
  if (!isMarkTwelveOn(rules)) return (Number(multiplier) || 0) >= getHotCashMultiplier(rules);
  return readCashBpm(gauge, window, bpmOf) >= HOT_CASH_BPM;
}

/** The heartbeat a cash at `gauge` on `window` is read at for the chain (G46). */
export function readCashBpm(gauge, window, bpmOf) {
  return bpmOf(Number(gauge) || 0, (Number(window?.wall) || 100) + (Number(window?.tellOffset) || 0), window?.schema?.sedated === true);
}

/* ------------------------------------------ RULES_MARK 13 (게임성 6차 B) */

/**
 * G44, G47 and G45 (게임성 개선점 6차, the user's 「전부 1」 of 2026-11-27):
 * rules that ship as RULES_MARK 13. A row is rechecked under them only when
 * its mark is `RULES_THIRTEEN_MARK` or later (rankingRecheck.js
 * `getRowRules`), so a row of 5 to 12 is played again as it was. They ride on
 * the marks before: a set that plays those off plays none of these.
 * `THIRTEEN_RULE` in a set plays them, `BEFORE_THIRTEEN_RULE` the rules
 * before, and a set with neither what this page plays. `RULES_MARK13=0` turns
 * them off in a script.
 */
export const RULES_THIRTEEN_MARK = 13;
export const THIRTEEN_RULE = "mark13";
export const BEFORE_THIRTEEN_RULE = "before13";

/** Whether this page (or this script) plays RULES_MARK 13's rules: `RULES_MARK13=0` turns them off in a script. */
export function wantsMarkThirteen(scope = globalThis) {
  return scope.process?.env?.RULES_MARK13 !== "0";
}

/** What a rule set that names neither plays: this page's (or script's) choice, read once. */
let thirteenChoice;
export const thirteenByDefault = () => (thirteenChoice ??= wantsMarkThirteen());

/** The mark RULES_MARK 13 rides on (whether `rules` plays the rules before it). */
const isMarkBeforeThirteenOn = (rules) => isMarkTwelveOn(rules);

/** Whether `rules` plays RULES_MARK 13's rules (and so those before it too). */
export function isMarkThirteenOn(rules) {
  if (!isMarkBeforeThirteenOn(rules)) return false;
  if (rules?.has?.(BEFORE_THIRTEEN_RULE)) return false;
  if (rules?.has?.(THIRTEEN_RULE)) return true;
  return thirteenByDefault();
}

const thirteenSets = new WeakMap();
const beforeThirteenSets = new WeakMap();
/** `rules` playing RULES_MARK 13's rules (`on`) or those before; the same set back when it already does. */
export function withMarkThirteen(rules, on = thirteenByDefault()) {
  if (!rules || typeof rules.has !== "function") return rules;
  if (isMarkThirteenOn(rules) === Boolean(on) || (on && !isMarkBeforeThirteenOn(rules))) return rules;
  const mark = on ? THIRTEEN_RULE : BEFORE_THIRTEEN_RULE;
  const drop = on ? BEFORE_THIRTEEN_RULE : THIRTEEN_RULE;
  if (!(rules instanceof Set)) return { has: (id) => id === mark || (id !== drop && rules.has(id)) };
  const cache = on ? thirteenSets : beforeThirteenSets;
  if (!cache.has(rules)) cache.set(rules, Object.freeze(new Set([...[...rules].filter((id) => id !== drop), mark])));
  return cache.get(rules);
}

/**
 * G44 운영비 (RULES_MARK 13): every case opens with 돈 at OPEN_CAPITAL_MOST or
 * less. 돈 opened at 100 (93 after G38's 유지비), so 67% of the decisions that
 * raised it raised nothing (게임성 6차 G44).
 */
export const OPEN_CAPITAL_MOST = 70;
/** The opening 돈 under RULES_MARK 13: `capital` or OPEN_CAPITAL_MOST, the lower. */
export const capOpeningCapital = (capital) => Math.min(Number(capital) || 0, OPEN_CAPITAL_MOST);

/**
 * G44 덜 오르기 (RULES_MARK 13): over SOFT_STEPS' lines 돈·믿음·공정함 rise
 * less -- half over 70, a third over 85, read point by point -- and a gain
 * over 0 still moves at least 1. A cut is paid in full. With the 운영비 it
 * took the decisions that raise nothing 22.6% -> 5.7% and the cases closed at
 * 100 from 96.4% to 54.3% at most (600 seasons, 게임성 6차 G44).
 */
export const SOFT_KEYS = Object.freeze(["capital", "trust", "legitimacy"]);
export const SOFT_STEPS = Object.freeze([Object.freeze([85, 1 / 3]), Object.freeze([70, 0.5]), Object.freeze([-Infinity, 1])]);
const SOFT_TOP = 100;
/** What `value` stands at after a gain of `gain` (a positive number) under the steps. */
export function softGain(value, gain) {
  const from = Number(value) || 0;
  let at = from;
  for (let step = 0; step < gain && at < SOFT_TOP; step += 1) at += SOFT_STEPS.find(([line]) => at >= line)[1];
  const moved = Math.round(at) - from;
  return Math.min(SOFT_TOP, Math.max(0, from + Math.max(moved, at > from ? 1 : 0)));
}
/**
 * `resources` after `effect`, with G44's softer gains: `apply` is the plain
 * effect (riskLogic.js applyEffect, passed in: this file imports no game logic).
 */
export function applySoftEffect(resources, effect, apply) {
  const plain = Object.fromEntries(Object.entries(effect ?? {}).filter(([key, value]) => !(SOFT_KEYS.includes(key) && Number(value) > 0)));
  const after = apply(resources, plain);
  for (const key of SOFT_KEYS) if (Number(effect?.[key]) > 0) after[key] = softGain(after[key], Number(effect[key]));
  return after;
}
/**
 * The same curve read back: what a soft `value` stands for on the plain scale.
 * The ending reads the season's means this way, which is the gates moved by
 * the same curve (게임성 6차 G44 Q2 (1)).
 */
export function readSoft(value) {
  const v = Number(value) || 0;
  const [[high, highRate], [low, lowRate]] = SOFT_STEPS;
  if (v <= low) return v;
  if (v <= high) return low + (v - low) / lowRate;
  return Math.min(SOFT_TOP, low + (high - low) / lowRate + (v - high) / highRate);
}

/**
 * G47 (RULES_MARK 13): a scene whose table cashed at SKILL_HARM_MULTIPLIER or
 * more takes half its 사람 피해 (rounded down); the collapse gate moves from 20
 * to COLLAPSE_HARM_THIRTEEN a case to keep the season's collapses. The notes
 * measured 15 with G44 alone (18.5% of 600); with G45's paying bot and G46's
 * chain on it, 15 collapsed 15.8% and 14 17.0% (check:endings 11-27), so 14,
 * the user's (1) of 2026-11-27 (Q4 (2)).
 */
export const SKILL_HARM_MULTIPLIER = 32;
export const COLLAPSE_HARM_THIRTEEN = 14;
/** `effect` with G47's half harm when its table cashed at `multiplier` (null: no table, as before). */
export function halveSkilledHarm(effect, multiplier) {
  const harm = Number(effect?.humanCost) || 0;
  if (harm <= 0 || !((Number(multiplier) || 0) >= SKILL_HARM_MULTIPLIER)) return effect;
  return { ...effect, humanCost: Math.floor(harm / 2) };
}

/** G45 (RULES_MARK 13): a burned season that paid this many covers (the whole ladder, settlementPay.js PAY_MOST) closes on QUIET COVER, not PROFITABLE SILENCE. */
export const BURN_COVER_QUIET = 10;
