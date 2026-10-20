/**
 * 이번 주의 규칙: the calendar, shipped in the bundle (D5).
 *
 * One rule may stand for one ISO week, counted in Korean time. A season takes
 * the rule of the week it starts in and keeps it to its end (D2, D3): the id is
 * stamped on the table at `newGame` (state/runState.js) and nothing here is
 * read again for that season. The ranking does not trust the stamp's week; the
 * server reads the week off the time it received the run's first case row
 * (`supabase/migrations/*_weekly_rule_event.sql`), and its table of weeks
 * has to say the same as `WEEKLY_RULES`.
 *
 * Only the numbers `normalizeSchema` clamps may move (D4): the wall, the
 * FRACTURE bill, the seal, the clock, the chips. A rule is laid over the board
 * where the story wall is (`getTableSchema`), never written into it.
 *
 * A leaf module, like tableRules.js: pure functions of a time in milliseconds.
 * What "now" is lives in state/weeklyClock.js, so a test can hold it still.
 *
 * Announced = merged: a week is added at least `WEEKLY_NOTICE_DAYS` before it
 * starts (the unit test holds every entry to it against the day it was added).
 */

import { DAY_MS, isoWeekKey, KST_OFFSET_MS, WEEKLY_RULES, weekStartMs } from "./weeklyCalendar.js";

// The calendar and the week arithmetic are a module of their own, so the
// start screen can ask whether there is anything to say without the
// catalogue's words in the entry chunk (components/WeeklyRuleNotice.jsx).
export { isoWeekKey, KST_OFFSET_MS, WEEKLY_RULES, weekStartMs };

export const WEEKLY_NOTICE_DAYS = 7;
/** A rule id is stored on the run and checked by the server: at most this long. */
export const WEEK_RULE_ID_MAX = 32;

/** NEAR WALL: how much closer the wall's band stands. */
export const NEAR_WALL_SHIFT = 4;
/** HEAVY FRACTURE: what FRACTURE bills the cracked axis that week. */
export const HEAVY_FRACTURE_RATE = 1.75;

/**
 * The rules a week can carry, by id. `schema` is relative for the wall
 * (`wallShift`, negative = closer) and absolute for the rest.
 */
export const WEEK_RULE_CATALOGUE = Object.freeze({
  "near-wall": Object.freeze({
    label: "NEAR WALL",
    // 초안 문구.
    title: "벽이 가깝다",
    text: `이번 주는 벽이 ${NEAR_WALL_SHIFT} 가까이 선다. 같은 열기로 더 빨리 벽에 닿는다.`,
    schema: Object.freeze({ wallShift: -NEAR_WALL_SHIFT }),
  }),
  "heavy-fracture": Object.freeze({
    label: "HEAVY FRACTURE",
    title: "균열이 깊다",
    text: `이번 주는 FRACTURE가 금 간 자원을 ${HEAVY_FRACTURE_RATE}배로 청구한다.`,
    schema: Object.freeze({ fractureRate: HEAVY_FRACTURE_RATE }),
  }),
});

/** The catalogue entry for an id, or null. */
export function getWeekRule(id) {
  return typeof id === "string" && Object.hasOwn(WEEK_RULE_CATALOGUE, id) ? { id, ...WEEK_RULE_CATALOGUE[id] } : null;
}

/** What a saved stamp is: a known id, or null. */
export function normalizeWeekRuleId(value) {
  return getWeekRule(value) ? value : null;
}

/** The week's rule at a moment, with its week key; null in a week without one. */
export function weekRuleAt(ms, calendar = WEEKLY_RULES) {
  const week = isoWeekKey(ms);
  const entry = week ? calendar.find((item) => item.week === week) : null;
  const rule = entry ? getWeekRule(entry.id) : null;
  return rule ? { ...rule, week } : null;
}

/** The rule of the week after the one at `ms`, for the notice "다음 주의 규칙". */
export function nextWeekRuleAt(ms, calendar = WEEKLY_RULES) {
  return Number.isFinite(Number(ms)) ? weekRuleAt(Number(ms) + 7 * DAY_MS, calendar) : null;
}

/**
 * The id a season takes when it starts: the week's rule unless the player
 * turned it down (D2) or the season is played in story mode, which is outside
 * every ranking already.
 */
export function pickSeasonWeekRule(ms, { declined = false, story = false, calendar = WEEKLY_RULES } = {}) {
  if (declined === true || story === true) return null;
  return weekRuleAt(ms, calendar)?.id ?? null;
}

/**
 * The numbers a rule moves on a board, before clamping: the caller hands the
 * result to `normalizeSchema` (the engine; this module does not import it).
 */
export function weekRuleOverlay(id, schema) {
  const rule = getWeekRule(id);
  if (!rule || !schema) return null;
  const overlay = {};
  for (const [key, value] of Object.entries(rule.schema)) {
    if (key === "wallShift") {
      overlay.wallMin = Number(schema.wallMin) + value;
      overlay.wallMax = Number(schema.wallMax) + value;
    } else {
      overlay[key] = value;
    }
  }
  return overlay;
}
