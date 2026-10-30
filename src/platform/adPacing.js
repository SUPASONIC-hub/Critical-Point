/**
 * When the store apps show an interstitial ad (app-launch memo B, the user's
 * answers of 2026-10-25, all (1)). Pure: the counts in, the counts and the
 * answer out; src/platform/ads.js keeps them and asks the native side.
 *
 * - Only after a case has closed, when the player presses on to the next one:
 *   never on the table, during a round, or over a score (B-1 (2)). ads.js is
 *   called from the result page's 「다음 사건」 (GameRuntime.openCase), and the
 *   native side covers the page before the ad opens.
 * - None before 사건 01 has closed: the five prologues and 사건 01 are the
 *   first ten minutes (B-1 (3)). 사건 01 closing is where the consent questions
 *   are asked (B-4), and it is the first case the count starts at.
 * - One every three cases closed, at most four a day, at least eight minutes
 *   apart (B-2 and B-7 (3)). A case that was due but fell on the daily cap or
 *   the eight minutes stays due for the next case, not lost.
 * - None in a week the kill switch names (B-1 (4); 2026-W47 is the test week).
 * - None for a player who bought Remove Ads (memo C-6 (2)).
 */

export const AD_RULES = Object.freeze({
  everyCases: 3,
  dailyMax: 4,
  minMinutesBetween: 8,
  firstCase: "case01",
  killSwitchWeeks: Object.freeze(["2026-W47"]),
});

/** The empty count, and what a stored count reads as when it is anything else. */
export function readPacing(value) {
  const number = (key) => (Number.isFinite(value?.[key]) && value[key] >= 0 ? value[key] : 0);
  return {
    closed: number("closed"),
    day: typeof value?.day === "string" ? value.day : "",
    shownToday: number("shownToday"),
    lastShownAt: number("lastShownAt"),
  };
}

/** The local calendar day, 2026-10-25: the daily cap is the player's day. */
export function localDay(time) {
  const date = new Date(time);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

/** The ISO week, 2026-W47, as the kill switch names weeks. */
export function isoWeek(time) {
  const date = new Date(time);
  const day = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const weekday = day.getUTCDay() || 7;
  day.setUTCDate(day.getUTCDate() + 4 - weekday);
  const yearStart = Date.UTC(day.getUTCFullYear(), 0, 1);
  const week = Math.ceil(((day.getTime() - yearStart) / 86_400_000 + 1) / 7);
  return `${day.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

/**
 * Whether the case that just closed counts: 사건 01 and every case after it,
 * in the season's order.
 */
export function countsForAds(caseId, caseOrder, rules = AD_RULES) {
  const first = caseOrder.indexOf(rules.firstCase);
  const at = caseOrder.indexOf(caseId);
  return first >= 0 && at >= first;
}

/**
 * A case closed and the player pressed on. Returns the new count and whether
 * an interstitial is due now. Nothing counts before 사건 01 or for a buyer.
 */
export function closeCase(pacing, { caseId, caseOrder, now, removeAds = false, rules = AD_RULES }) {
  const current = readPacing(pacing);
  if (removeAds || !countsForAds(caseId, caseOrder, rules)) return { pacing: current, show: false };
  const today = localDay(now);
  const next = {
    ...current,
    closed: current.closed + 1,
    day: today,
    shownToday: current.day === today ? current.shownToday : 0,
  };
  const show =
    next.closed >= rules.everyCases &&
    next.shownToday < rules.dailyMax &&
    now - next.lastShownAt >= rules.minMinutesBetween * 60_000 &&
    !rules.killSwitchWeeks.includes(isoWeek(now));
  return { pacing: next, show };
}

/** An interstitial was shown: the three-case count starts over. */
export function interstitialShown(pacing, now) {
  const current = readPacing(pacing);
  const today = localDay(now);
  return {
    closed: 0,
    day: today,
    shownToday: (current.day === today ? current.shownToday : 0) + 1,
    lastShownAt: now,
  };
}
