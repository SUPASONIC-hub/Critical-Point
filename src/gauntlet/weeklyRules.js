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
 * One exception, by name: a rule may switch on a device the table does not
 * otherwise have (`rules`), from `WEEK_RULE_DEVICES` and nothing else (B3
 * decision 8, widened to two by B2 decision 11). There is no general frame;
 * the engine asks `weekRuleHasDevice` for the one it means.
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

/**
 * The devices a week may switch on: B3's AUDIT (auditRisk.js) and B2's
 * CASCADE (cascadeRisk.js). A device a rule names outside this list is not on.
 */
export const WEEK_RULE_DEVICES = Object.freeze(["audit", "cascade"]);

/** NEAR WALL: how much closer the wall's band stands. */
export const NEAR_WALL_SHIFT = 4;
/**
 * AUDIT (B3, the `audit` device, auditRisk.js): a cash pushed at least once
 * and closed below `AUDIT_HEAT` adds one to the case's audit, a cash at
 * HEAT DEBT's heat or more takes `AUDIT_RELIEF` off it. When the case closes
 * with `AUDIT_LIMIT` or more, one part in `AUDIT_SHARE` of what it moves to
 * the vault is lost. Set B of the design's three (40 / 4 / -2 / one in four),
 * decided by the user on 2026-10-20 after the A/B/C measurement of PR #201:
 * A never caught a season bot, C broke a check:pressure assertion and caught
 * the hand that watches the wall. Here, beside the other
 * week's numbers, while it is a week's device: imported from tableRules.js
 * this chunk took the whole of that module (check:bundle, 2026-10-19); it
 * moves there when it becomes a rule of the table.
 */
export const AUDIT_HEAT = 40;
export const AUDIT_LIMIT = 4;
export const AUDIT_RELIEF = 2;
export const AUDIT_SHARE = 4;
/** HEAVY FRACTURE: what FRACTURE bills the cracked axis that week. */
export const HEAVY_FRACTURE_RATE = 1.75;

/** The audit's line and the links', each week's that has the device. */
const AUDIT_LINE = `한 번 이상 밀고 열기 ${AUDIT_HEAT} 미만에서 확정하면 감사 +1. ${AUDIT_LIMIT}칸이 찬 채 사건이 닫히면 금고로 갈 몫의 ${AUDIT_SHARE}분의 1을 잃는다.`;
const CASCADE_LINE = "한 자원을 8 이상 태운 카드를 확정하면 2~4판 안에 한 판의 벽이 6 가까워진다. 사건이 닫힐 때 남은 연결은 다음 사건으로 넘어간다.";

/**
 * The rules a week can carry, by id. `schema` is relative for the wall
 * (`wallShift`, negative = closer) and absolute for the rest.
 */
export const WEEK_RULE_CATALOGUE = Object.freeze({
  "near-wall": Object.freeze({
    label: "NEAR WALL",
    title: "벽이 가깝다",
    text: `이번 주는 벽 띠가 열기 ${NEAR_WALL_SHIFT}만큼 앞당겨 선다. 같은 열기로 더 빨리 벽에 닿는다.`,
    schema: Object.freeze({ wallShift: -NEAR_WALL_SHIFT }),
  }),
  "heavy-fracture": Object.freeze({
    label: "HEAVY FRACTURE",
    title: "균열이 깊다",
    text: `이번 주는 FRACTURE가 금 간 자원을 ${HEAVY_FRACTURE_RATE}배로 청구한다.`,
    schema: Object.freeze({ fractureRate: HEAVY_FRACTURE_RATE }),
  }),
  // B3's test week: a device; no number on the board moves.
  "audit": Object.freeze({
    label: "AUDIT WEEK",
    // 초안 문구 (B3 decision 11 asks for the line by number).
    title: "감사 주간",
    text: AUDIT_LINE,
    rules: Object.freeze(["audit"]),
  }),
  // B2's test week: a device; no number on the board moves. Its numbers are
  // cascadeRisk.js's, written out because that chunk imports this one (a
  // unit test holds the line to them). In no week of the calendar; a
  // development build plays it with `?week=cascade` (weeklyCalendar.js).
  "cascade": Object.freeze({
    label: "CASCADE WEEK",
    // 초안 문구.
    title: "연쇄 주간",
    text: CASCADE_LINE,
    rules: Object.freeze(["cascade"]),
  }),
  // The test week of 2026-W44 (user, 2026-10-21): both devices at once, told
  // in the two weeks' own lines and one that ties them: a cash on a CASCADE
  // board is not counted by the audit (B2 decision 10, auditRisk.js), so the
  // ranking of that week is the one table B3 and B2 will be judged on.
  "audit-cascade": Object.freeze({
    label: "AUDIT & CASCADE",
    title: "감사와 연쇄",
    text: `이번 주는 감사와 연쇄가 함께 선다. ${AUDIT_LINE} ${CASCADE_LINE} CASCADE 판의 확정은 감사에 세지 않는다.`,
    rules: Object.freeze(["audit", "cascade"]),
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
  if (!rule?.schema || !schema) return null;
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

/** Whether the rule `id` switches on `device`, which has to be one `WEEK_RULE_DEVICES` allows. */
export function weekRuleHasDevice(id, device) {
  return WEEK_RULE_DEVICES.includes(device) && Boolean(getWeekRule(id)?.rules?.includes(device));
}
