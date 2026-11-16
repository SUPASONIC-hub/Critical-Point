import { CASE_SEQUENCE } from "./gameCases.js";

/**
 * The first hour as Google Analytics counts it (N2, 2026-11-12), and the
 * phone speed sample (N12). Only names and whole numbers go: no player name,
 * no save, no session code, no choice. Nothing at all goes from a build
 * without Google's tag -- the dev server, the e2e build, a debug build, or a
 * release with no GA_MEASUREMENT_ID (scripts/analytics-config.mjs) -- because
 * the game's code never learns the ID: it only asks whether the page's
 * `gtag` is there. The privacy policy's opt-outs (section 2 (5)/(e): the
 * Google Analytics opt-out add-on, blocked cookies) are Google's tag's own,
 * and hold for these events as they do for the page view.
 */
export const GAME_EVENTS = Object.freeze({
  /** 프롤로그 시작 (or a new season over a save, once asked) pressed on the start screen. */
  start: "cp_start_pressed",
  /** The first table of the season's first case opened: the briefing closed, the clock running. */
  firstTable: "cp_first_table_open",
  /** The season's first case closed for the first time. */
  prologueDone: "cp_prologue01_done",
  /** Largest Contentful Paint of the start page, in ms (N12). */
  lcp: "cp_lcp",
  /** Interaction to Next Paint over the page's life, in ms (N12). */
  inp: "cp_inp",
});

/** The case the first-hour events are about: the season's first, 프롤로그 01. */
export const FIRST_CASE = CASE_SEQUENCE[0];

/** One in twenty page loads measures its speed (N12: 1 to 5%). */
export const VITALS_SAMPLE_RATE = 0.05;

const NAMES = new Set(Object.values(GAME_EVENTS));
const sentOnce = new Set();

/**
 * An event to Google's tag, when the page has one. Only a name of
 * GAME_EVENTS, and only whole numbers as parameters: whatever else a caller
 * hands over is left behind. Returns whether it went.
 */
export function sendGameEvent(name, params = {}, scope = globalThis) {
  const gtag = scope?.gtag;
  if (typeof gtag !== "function" || !NAMES.has(name)) return false;
  const safe = {};
  for (const [key, value] of Object.entries(params ?? {})) {
    if (/^[a-z_]{1,40}$/.test(key) && Number.isInteger(value) && value >= 0) safe[key] = value;
  }
  // The speed events go as the page is hidden or closed: by beacon, which outlives it.
  if (name === GAME_EVENTS.lcp || name === GAME_EVENTS.inp) safe.transport_type = "beacon";
  try {
    gtag("event", name, safe);
    return true;
  } catch {
    return false;
  }
}

/** The same, once per page: a second press of start, or a second table, is not a second first. */
export function sendGameEventOnce(name, params = {}, scope = globalThis) {
  if (sentOnce.has(name)) return false;
  const sent = sendGameEvent(name, params, scope);
  if (sent) sentOnce.add(name);
  return sent;
}

/** A table opened (GauntletStage openTable): the first one of 프롤로그 01 on this page is counted. */
export function noteTableOpened(caseId, scope = globalThis) {
  return caseId === FIRST_CASE && sendGameEventOnce(GAME_EVENTS.firstTable, {}, scope);
}

/** A case closed (useChoiceCommit): 프롤로그 01 closed for the first time is counted. */
export function noteCaseClosed(caseId, closedBefore, scope = globalThis) {
  return caseId === FIRST_CASE && !closedBefore && sendGameEventOnce(GAME_EVENTS.prologueDone, {}, scope);
}

/**
 * N12: on one page load in twenty, and only with Google's tag on the page,
 * fetches the small speed watcher (webVitals.js) and starts it. The other
 * nineteen never download it. Returns whether this load was sampled.
 */
export function startVitalsSample({ scope = globalThis, random = Math.random, load = () => import("./webVitals.js") } = {}) {
  if (typeof scope?.gtag !== "function" || !(random() < VITALS_SAMPLE_RATE)) return false;
  Promise.resolve()
    .then(load)
    .then((module) => module.watchVitals({ scope }))
    .catch(() => {});
  return true;
}

/** Test seam: forget what was sent once. */
export function resetGameEventsForTest() {
  sentOnce.clear();
}
