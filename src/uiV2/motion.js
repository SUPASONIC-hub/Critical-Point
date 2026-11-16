/**
 * Whether the redesign may move or buzz: not under prefers-reduced-motion and
 * not when the player turned the effects down (calmEffects puts
 * `data-calm-effects` on <html>, state/accessibilitySettings.js).
 */
export function motionAllowed(root = globalThis.document?.documentElement, media = globalThis.matchMedia) {
  if (root?.hasAttribute?.("data-calm-effects")) return false;
  try {
    return !media?.("(prefers-reduced-motion: reduce)")?.matches;
  } catch {
    return true;
  }
}

/** A short buzz where the device has one and motion is allowed (a card played). */
export function buzz(ms = 12, nav = globalThis.navigator) {
  if (!motionAllowed() || typeof nav?.vibrate !== "function") return false;
  try {
    return nav.vibrate(ms);
  } catch {
    return false;
  }
}

/** Ease-out cubic: fast start, soft landing. */
export function easeOut(t) {
  const clamped = Math.max(0, Math.min(1, t));
  return 1 - (1 - clamped) ** 3;
}

/** The value a roll from `from` to `to` shows `t` of the way through (whole numbers). */
export function rollValue(from, to, t) {
  return Math.round(from + (to - from) * easeOut(t));
}
