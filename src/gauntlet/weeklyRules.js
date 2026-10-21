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
 * the engine asks `weekRuleHasDevice` for the one it means. Since RULES_MARK 3
 * the list is empty: the two devices it held are rules of the table.
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
 * The devices a week may switch on. B3's AUDIT and B2's CASCADE were the two
 * (B3 decision 8, widened by B2 decision 11) until RULES_MARK 3 made them
 * rules of the table (tableUnlocks.js); the list is kept, empty, for the next
 * device a week tries out first (the rule switch's question 2, user
 * 2026-10-20). A device a rule names outside it is not on.
 */
export const WEEK_RULE_DEVICES = Object.freeze([]);

/** NEAR WALL: how much closer the wall's band stands. */
export const NEAR_WALL_SHIFT = 4;
/** HEAVY FRACTURE: what FRACTURE bills the cracked axis that week. */
const HEAVY_FRACTURE_RATE = 1.75;
/**
 * SHORT CLOCK (E-9 (c), 사용자 확인 후보): every board's clock this many
 * seconds shorter, and every card's chips this many times more. Both are laid
 * over what the board already has (relics and marks move both), never put in
 * its place: `secondsShift` adds, `chipsFactor` multiplies, and
 * `normalizeSchema` clamps the result (12-60 seconds, chips 0.25-4).
 */
export const SHORT_CLOCK_SECONDS = 8;
export const SHORT_CLOCK_CHIPS = 1.25;

/**
 * The rules a week can carry, by id. `schema` is relative for the wall
 * (`wallShift`, negative = closer), the clock (`secondsShift`) and the chips
 * (`chipsFactor`), and absolute for the rest.
 *
 * `world` is the rule's one line inside the story (E-9 (b)): what the group
 * did this week that the table feels. The start screen and the briefing's
 * panel print it before the rule. The event weeks' three have one each
 * (사용자 확인 후보 문구); the test weeks' devices do not need one.
 */
export const WEEK_RULE_CATALOGUE = Object.freeze({
  "near-wall": Object.freeze({
    label: "NEAR WALL",
    title: "벽이 가깝다",
    text: `이번 주는 벽 띠가 열기 ${NEAR_WALL_SHIFT}만큼 앞당겨 선다. 같은 열기로 더 빨리 벽에 닿는다.`,
    world: "이번 주 그룹은 감사를 앞당겼다.",
    schema: Object.freeze({ wallShift: -NEAR_WALL_SHIFT }),
  }),
  "heavy-fracture": Object.freeze({
    label: "HEAVY FRACTURE",
    title: "균열이 깊다",
    text: `이번 주는 FRACTURE가 금 간 자원을 ${HEAVY_FRACTURE_RATE}배로 청구한다.`,
    world: "이번 주 회계팀은 금 간 장부를 한 번 더 넘겨 본다.",
    schema: Object.freeze({ fractureRate: HEAVY_FRACTURE_RATE }),
  }),
  // E-9 (c): the third event rule, two numbers normalizeSchema clamps at once.
  "short-clock": Object.freeze({
    label: "SHORT CLOCK",
    title: "시간이 짧다",
    text: `이번 주는 판마다 시간이 ${SHORT_CLOCK_SECONDS}초 짧고, 모든 카드의 칩이 ${SHORT_CLOCK_CHIPS}배다.`,
    world: "이번 주 이사회는 보고 시간을 줄이고 보고서 값을 올렸다.",
    schema: Object.freeze({ secondsShift: -SHORT_CLOCK_SECONDS, chipsFactor: SHORT_CLOCK_CHIPS }),
  }),
  // The test week, 2026-W47 (user, 2026-10-21; moved from W44 on 10-22,
  // 11-16 to 11-22): both devices at once, which RULES_MARK 3 then made rules
  // of the table from 프롤로그 04. A week gone by, kept because the calendar
  // and the server's weekly_rules name it and a season begun in it carries the
  // stamp; its line is the one that week showed, numbers written out
  // (auditRisk.js and cascadeRisk.js have them now), and `rules` is what it
  // switched on, which nothing switches any more (`WEEK_RULE_DEVICES` is
  // empty; the table record reads it, auditRisk.js).
  "audit-cascade": Object.freeze({
    label: "AUDIT & CASCADE",
    title: "감사와 연쇄",
    text: "이번 주는 감사와 연쇄가 함께 선다. 한 번 이상 밀고 열기 40 미만에서 확정하면 감사 +1. 4칸이 찬 채 사건이 닫히면 금고로 갈 몫의 4분의 1을 잃는다. 한 자원을 8 이상 태운 카드를 확정하면 2~4판 안에 한 판의 벽이 6 가까워진다. 사건이 닫힐 때 남은 연결은 다음 사건으로 넘어간다. CASCADE 판의 확정은 감사에 세지 않는다.",
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
 *
 * A device's first season (`firstSeason`, no season finished yet) takes it
 * only when the player asked for it (`takenUp`, E-8, 결정 Q6 b (1)): the
 * event is for the analyst who came back. From the second season on it is on
 * unless turned down, as before (state/weeklyRuleChoice.js reads the device).
 */
export function pickSeasonWeekRule(ms, { declined = false, story = false, firstSeason = false, takenUp = false, calendar = WEEKLY_RULES } = {}) {
  if (story === true) return null;
  if (firstSeason === true ? takenUp !== true : declined === true) return null;
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
    } else if (key === "secondsShift") {
      overlay.seconds = Number(schema.seconds) + value;
    } else if (key === "chipsFactor") {
      overlay.chipsScale = Number(schema.chipsScale) * value;
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
