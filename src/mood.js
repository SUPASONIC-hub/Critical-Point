/**
 * The page's mood: one of MOODS, written on `<html data-mood="…">` for the
 * stylesheet and told to whoever listens (메모-20261105/design-mood.md).
 *
 * The mood travels with the scene: scripts/season-split.mjs reads the tag
 * table (src/sceneMoods.js) at build time and writes `mood` on each tagged
 * scene in its case's file, so the table reads `scene.mood` and the tag table
 * itself is never shipped. src/state/sceneMood.js applies the shown scene's
 * mood on the table and neutral on every other screen. Neutral is no
 * attribute at all, so the start screen is neutral before any script runs.
 *
 * Nothing here is React, and nothing needs a document: without one (a unit
 * test, a server) the mood is still kept and the listeners still told.
 *
 * The music subscribes here once, where src/components/AdaptiveMusic.jsx is
 * set up (`onMoodChange(setMusicMood)`, and `currentMood()` read once for a
 * table that opened before it woke). A change is a 4-6 second crossfade there,
 * never a jump (#388). Nothing in audio is touched here.
 */
export const MOODS = ["neutral", "bright", "tense", "dread", "sorrow"];

const listeners = new Set();
let mood = "neutral";

/** An unknown or missing value is neutral. */
export const normalizeMood = (value) => (MOODS.includes(value) ? value : "neutral");

export function currentMood() {
  return mood;
}

/**
 * Sets the mood, writes it on the document and tells the listeners; the same
 * mood again does nothing. Returns the mood as applied.
 */
export function applyMood(value) {
  const next = normalizeMood(value);
  if (next === mood) return mood;
  mood = next;
  if (typeof document !== "undefined") {
    const dataset = document.documentElement.dataset;
    if (next === "neutral") delete dataset.mood;
    else dataset.mood = next;
  }
  for (const listener of [...listeners]) listener(next);
  return next;
}

/** Calls `fn(mood)` on every change; returns the unsubscribe. */
export function onMoodChange(fn) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
