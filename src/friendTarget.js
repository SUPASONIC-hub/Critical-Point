/**
 * 「친구 기록 넘기기」 (N32, 2026-11-16 결정 Q9 (1)): a visit from a shared
 * card's address (`?from=card&h=<habit>&s=<score>`, shareLink.js) gets the
 * friend's best burst as a goal. The start page says it under 「친구의 결과」,
 * and the ending of this device's own season says whether it was beaten.
 *
 * Display only, and on this device only: the target is kept in localStorage
 * (`FRIEND_TARGET_KEY`) so the ending, hours and visits later, still knows it,
 * and nothing about it is sent anywhere or read by the ranking. An address
 * edited by hand changes what these two lines say and nothing else.
 *
 * A target is kept `FRIEND_TARGET_DAYS` days from the visit that brought it;
 * a newer shared address replaces it. A visit with a habit and no score (a
 * card shared before N32) keeps nothing: there is no number to beat.
 */
import { FRIEND_TARGET_KEY, readStoredValue, removeStoredValue, writeStoredValue } from "./appConfig.js";
import { readSharedHabitId, readSharedScore } from "./shareLink.js";

export const FRIEND_TARGET_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

/** The target a shared address carries, stamped `now`, or null when it carries no score. */
function friendTargetFrom(search, now = Date.now()) {
  const score = readSharedScore(search);
  if (!score) return null;
  return { habit: readSharedHabitId(search), score, at: now };
}

/** A stored target as `friendTargetFrom` made it, or null for anything else or one older than the days it is kept. */
export function readFriendTarget(raw, now = Date.now()) {
  let value;
  try {
    value = JSON.parse(String(raw ?? ""));
  } catch {
    return null;
  }
  if (!value || typeof value !== "object") return null;
  // Re-read through the address reader, so a stored target is held to the same shapes.
  const query = `?from=card&s=${encodeURIComponent(String(value.score))}&h=${encodeURIComponent(String(value.habit ?? ""))}`;
  const score = readSharedScore(query);
  const at = Number(value.at);
  if (!score || !Number.isFinite(at) || at > now || now - at > FRIEND_TARGET_DAYS * DAY_MS) return null;
  return { habit: readSharedHabitId(query), score, at };
}

/**
 * The target for this page: a shared address's, kept for later; otherwise the
 * one kept from an earlier visit while it lasts (an expired one is removed).
 */
export function takeFriendTarget(search, now = Date.now()) {
  const fresh = friendTargetFrom(search, now);
  if (fresh) {
    writeStoredValue(FRIEND_TARGET_KEY, JSON.stringify(fresh));
    return fresh;
  }
  const raw = readStoredValue(FRIEND_TARGET_KEY, null);
  if (raw === null) return null;
  const kept = readFriendTarget(raw, now);
  if (!kept) removeStoredValue(FRIEND_TARGET_KEY);
  return kept;
}

/** The kept target without touching it, for the ending: null when there is none or it ran out. */
export function keptFriendTarget(now = Date.now()) {
  return readFriendTarget(readStoredValue(FRIEND_TARGET_KEY, null), now);
}

/**
 * How this season's best burst stands against the target: `beaten` when it
 * is higher (a tie is not beaten), with the gap otherwise. Null without a target.
 */
export function friendTargetStanding(target, bestBurst) {
  if (!target?.score) return null;
  const mine = Number.isFinite(Number(bestBurst)) ? Math.max(0, Math.round(Number(bestBurst))) : 0;
  const beaten = mine > target.score;
  return { score: target.score, mine, beaten, gap: beaten ? 0 : target.score - mine + 1 };
}
