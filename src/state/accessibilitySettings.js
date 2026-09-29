import { useSyncExternalStore } from "react";
import { ACCESSIBILITY_SETTINGS_KEY, readStoredValue, writeStoredValue } from "../appConfig.js";

/**
 * What the player asked the game to turn down, set once on the intro and read
 * wherever it applies. A leaf module: the shell loads it before the first
 * paint (the intro's motion is one of the settings), so it imports nothing
 * that would pull the scene graph into the entry chunk.
 *
 *   tableTime        the table's clock runs this many times slower (1, 1.5, 2).
 *                    A run that used it carries `assistTime` into its case
 *                    summaries and its ranking row says so.
 *   holdReadingClock the briefing page's reading clock starts held, not counting.
 *   calmEffects      the red vignette, the bust flash and the shake, turned down
 *                    whatever the operating system says (it already follows
 *                    prefers-reduced-motion).
 *   letterKeys       the single-key shortcuts: 1-9, W, E, Q, P, R, N
 *                    (WCAG 2.1.4). Space, Enter and Escape stay.
 *   stillIntro       the intro's ticker, drifting art and blinking wordmark
 *                    stop (WCAG 2.2.2).
 */
export const TABLE_TIME_SCALES = Object.freeze([1, 1.5, 2]);

export const DEFAULT_ACCESSIBILITY = Object.freeze({
  tableTime: 1,
  holdReadingClock: false,
  calmEffects: false,
  letterKeys: true,
  stillIntro: false,
});

export function normalizeAccessibility(value) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const settings = { ...DEFAULT_ACCESSIBILITY };
  if (TABLE_TIME_SCALES.includes(source.tableTime)) settings.tableTime = source.tableTime;
  for (const key of ["holdReadingClock", "calmEffects", "letterKeys", "stillIntro"]) {
    if (typeof source[key] === "boolean") settings[key] = source[key];
  }
  return Object.freeze(settings);
}

let current = null;
const listeners = new Set();

function read() {
  try {
    return normalizeAccessibility(JSON.parse(readStoredValue(ACCESSIBILITY_SETTINGS_KEY, "null")));
  } catch {
    return normalizeAccessibility(null);
  }
}

export function getAccessibility() {
  current ??= read();
  return current;
}

/** The document carries the two settings CSS answers to, as the OS preference does. */
export function applyAccessibilityToDocument(settings = getAccessibility(), root = globalThis.document?.documentElement) {
  if (!root) return;
  root.toggleAttribute("data-calm-effects", settings.calmEffects);
  root.toggleAttribute("data-still-intro", settings.stillIntro);
}

export function setAccessibility(patch) {
  const next = normalizeAccessibility({ ...getAccessibility(), ...patch });
  current = next;
  writeStoredValue(ACCESSIBILITY_SETTINGS_KEY, JSON.stringify(next));
  applyAccessibilityToDocument(next);
  for (const listener of listeners) listener();
  return next;
}

export function subscribeAccessibility(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useAccessibility() {
  return useSyncExternalStore(subscribeAccessibility, getAccessibility, getAccessibility);
}

/** For tests: forget the cached settings so the next read goes to storage. */
export function resetAccessibilityCache() {
  current = null;
}
