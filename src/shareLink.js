/**
 * The address the result card's copied line ends on, and what the start page
 * reads back from it (N3, 2026-11-12).
 *
 *   /?from=card&h=<habit id>
 *
 * `from=card` marks a visit that came from a shared card, so Google Analytics
 * (whose page view carries the address) can count them. `h` is the season's
 * 판단 습관 by its id (judgementHabit.js: `moth`, `one-track`, ...), never its
 * words: the start page prints 「친구의 결과: …」 with the name it looks the
 * id up under in its own language (src/copy/habits.js), so the line can only
 * ever say one of the eleven names. An id that is not one of them, or
 * anything with characters an id never has, prints nothing. A season without
 * a habit shares `/?from=card` alone.
 *
 * The path stays `/`: the page's canonical is `/` whatever the query (index.html),
 * and the service worker answers `/` from its shell whatever the query
 * (serviceWorker/worker.js strategyFor), so the marked address is the same page.
 */
export const SHARE_SOURCE = "card";

// The shape every habit id has: lower-case words joined by hyphens.
const HABIT_ID = /^[a-z]+(?:-[a-z]+)*$/;
const isHabitId = (id) => typeof id === "string" && id.length <= 24 && HABIT_ID.test(id);

/** `origin` + `/?from=card`, with `&h=<id>` for a season with a habit; "" without an origin. */
export function shareAddress(origin, habitId = "") {
  const address = String(origin ?? "").trim().replace(/\/+$/, "");
  if (!address) return "";
  return `${address}/?from=${SHARE_SOURCE}${isHabitId(habitId) ? `&h=${habitId}` : ""}`;
}

/** The habit id a shared address carries (`location.search`), or "" when it carries none or not one shaped like an id. */
export function readSharedHabitId(search = "") {
  const query = new URLSearchParams(String(search ?? ""));
  if (query.get("from") !== SHARE_SOURCE) return "";
  const id = query.get("h") ?? "";
  return isHabitId(id) ? id : "";
}

/**
 * The habit's name for `id` in a habits table (src/copy/habits.js), or "" when
 * the table has no habit by that id: its other keys (`cardLine`,
 * `friendLine`) are strings, not habits, and an inherited key is never one.
 */
export function sharedHabitTitle(table, id) {
  if (!table || !isHabitId(id) || !Object.hasOwn(table, id)) return "";
  const title = table[id]?.title;
  return typeof title === "string" ? title : "";
}

/**
 * N32 (2026-11-16 결정 Q9 (1)): the season's best burst rides on the shared
 * address as `&s=<1..100>`, so a friend who opens it has a number to beat
 * (「친구 기록 넘기기」, friendTarget.js). Display only: the start page and the
 * friend's own ending say it, and nothing that ranks or sends reads it, so an
 * address edited by hand changes what one screen says and nothing else. A
 * score of 0 is nothing to beat and is not written.
 */
const SCORE_TEXT = /^(?:100|[1-9]\d?)$/;

/** `address` with `&s=<score>` for a whole score from 1 to 100; the address as it was otherwise. */
export function withSharedScore(address, score) {
  const text = String(address ?? "");
  if (!text) return "";
  const value = Number(score);
  return Number.isInteger(value) && value >= 1 && value <= 100 ? `${text}&s=${value}` : text;
}

/** The best burst a shared address carries (`location.search`), or 0 when it carries none or not one written as `withSharedScore` writes it. */
export function readSharedScore(search = "") {
  const query = new URLSearchParams(String(search ?? ""));
  if (query.get("from") !== SHARE_SOURCE) return 0;
  const text = query.get("s") ?? "";
  return SCORE_TEXT.test(text) ? Number(text) : 0;
}
