import { isMarkNineOn } from "./nextTableRules.js";

/**
 * G31 (게임성 개선점 4차, the user's 「전부 1」 of 2026-11-25; RULES_MARK 9):
 * the story reaches the table. What a case opens on (`open.resources`, the
 * snapshot the case-open stamp keeps and the server's recheck reads) tilts
 * its boards, so nothing moves in the middle of a case:
 *
 * - 피로 in the top third of what cases open on: the heartbeat lies by up to
 *   TILT_TELL.high (TELL_ERROR is 18); in the bottom third, TILT_TELL.low.
 * - 시간 in the bottom third: every board's clock TILT_CLOCK seconds shorter;
 *   in the top third, that much longer.
 * - 정당성 in the bottom third: the audit's limit TILT_AUDIT lower; in the
 *   top third, that much higher.
 *
 * Both ends move, so a season already worn down is not only punished: a rested,
 * unhurried, clean one plays an easier table. The thirds are those of the
 * values bot seasons open their cases on (cp-archive 메모-20261125 g4b,
 * g31-open-resources.mjs: 피로 6..33, p33 15, p67 21; 시간 64..72, p33 67,
 * p67 69; 정당성 39..65, p33 50, p67 54). Never in story mode, whose wall
 * and clock are its own, and never before RULES_MARK 9 (a row of 8 or less is
 * replayed as it was).
 */
export const TILT_THIRDS = Object.freeze({
  fatigue: Object.freeze({ low: 14, high: 21 }),
  time: Object.freeze({ low: 66, high: 70 }),
  legitimacy: Object.freeze({ low: 49, high: 55 }),
});
export const TILT_TELL = Object.freeze({ high: 20, low: 16 });
export const TILT_CLOCK = 2;
export const TILT_AUDIT = 1;

const thirdOf = (value, { low, high }) => {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return number <= low ? "low" : number >= high ? "high" : null;
};

/** The tilt a case opened on `resources` plays, or null when none of the three is in a third that moves the table. */
export function readStoryTilt(resources) {
  if (!resources || typeof resources !== "object") return null;
  const fatigue = thirdOf(resources.fatigue, TILT_THIRDS.fatigue);
  const time = thirdOf(resources.time, TILT_THIRDS.time);
  const legitimacy = thirdOf(resources.legitimacy, TILT_THIRDS.legitimacy);
  if (!fatigue && !time && !legitimacy) return null;
  return {
    ...(fatigue ? { fatigue, tellError: TILT_TELL[fatigue] } : null),
    ...(time ? { time, clock: time === "low" ? -TILT_CLOCK : TILT_CLOCK } : null),
    ...(legitimacy ? { legitimacy, audit: legitimacy === "low" ? -TILT_AUDIT : TILT_AUDIT } : null),
  };
}

/**
 * The briefing's line for the case open on `run` (SceneBriefing.jsx): one
 * entry a tilt, `[key, values]` for its sentence in briefing copy's `tilt`,
 * on the case's first page only; empty otherwise.
 */
export function listStoryTilt(run) {
  const tilt = getStoryTilt(run);
  if (!tilt || Number(run.windowIndex) !== Number(run.open?.windowIndex)) return [];
  const value = (key) => Math.round(Number(run.open.resources[key]));
  return [
    ...(tilt.fatigue ? [[tilt.fatigue === "high" ? "fatigueHigh" : "fatigueLow", { value: value("fatigue"), error: tilt.tellError }]] : []),
    ...(tilt.time ? [[tilt.time === "low" ? "timeLow" : "timeHigh", { value: value("time"), seconds: TILT_CLOCK }]] : []),
    ...(tilt.legitimacy ? [[tilt.legitimacy === "low" ? "legitimacyLow" : "legitimacyHigh", { value: value("legitimacy"), limit: TILT_AUDIT }]] : []),
  ];
}

/** The tilt the case open on `run` plays under `rules` (the page's when not given), or null. */
export function getStoryTilt(run, rules = undefined) {
  if (!run || run.story === true || !isMarkNineOn(rules)) return null;
  return readStoryTilt(run.open?.resources);
}
