/**
 * 「지난번 이후」 (N24, 2026-11-16 결정 Q1 (1)): whether this visit is a
 * return after `SINCE_LAST_DAYS` days or more, read once per page from the
 * stamp the start screen leaves (`LAST_VISIT_KEY`, this device only: nothing
 * is sent, nothing is counted).
 *
 * The stamp is `{ at, sides }`: when the start screen was last opened and the
 * side cases this build listed then, so the card can name the ones that came
 * out since. A device's first visit (or its first since this shipped) has no
 * stamp and is not a return; it gets one. A stamp from the future (a clock
 * moved back) or one that cannot be read counts as no stamp.
 *
 * Here, in the entry chunk, is only the read and the write: the card and its
 * words are a chunk of their own (SinceLastCard.jsx), fetched on a return.
 */
import { LAST_VISIT_KEY, readStoredValue, writeStoredValue } from "../appConfig.js";

export const SINCE_LAST_DAYS = 3;
export const DAY_MS = 24 * 60 * 60 * 1000;
const SIDE_ID = /^side\d{2}$/;

/** A stored stamp, or null for anything that is not one. */
export function readVisitStamp(raw) {
  let value;
  try {
    value = JSON.parse(String(raw ?? ""));
  } catch {
    return null;
  }
  const at = Number(value?.at);
  if (!Number.isFinite(at) || at <= 0) return null;
  const sides = Array.isArray(value.sides) ? value.sides.filter((id) => typeof id === "string" && SIDE_ID.test(id)) : [];
  return { at, sides };
}

/**
 * This visit against the stamp before it: `due` on a return after
 * `SINCE_LAST_DAYS` days or more, with the whole days away and the side cases
 * listed last time. Null without a stamp to read.
 */
export function returnAfter(previous, now) {
  if (!previous || !Number.isFinite(now) || previous.at > now) return null;
  const days = Math.floor((now - previous.at) / DAY_MS);
  return { due: days >= SINCE_LAST_DAYS, days, since: previous.at, sides: previous.sides };
}

let taken;

/**
 * Reads the stamp and leaves this visit's in its place, once per page: the
 * same answer however often the start screen mounts (a strict-mode double
 * mount, a return from the board). `sides` is the build's side case ids.
 */
export function takeVisit({ now = Date.now(), sides = [] } = {}) {
  if (taken !== undefined) return taken;
  taken = returnAfter(readVisitStamp(readStoredValue(LAST_VISIT_KEY, null)), now);
  writeStoredValue(LAST_VISIT_KEY, JSON.stringify({ at: now, sides: sides.filter((id) => SIDE_ID.test(id)) }));
  return taken;
}

/** For the tests: forget this page's answer. */
export function resetVisitForTests() {
  taken = undefined;
}
