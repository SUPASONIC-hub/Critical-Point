import { COLD_OPENING_SEEN_KEY, readStoredValue, writeStoredValue } from "../appConfig.js";
import { isFirstSeason } from "./weeklyRuleChoice.js";
import { COLD_OPENING_ENABLED } from "../coldOpeningSwitch.js";

export { COLD_OPENING_ENABLED };

/**
 * B-3(1) 냉정한 오프닝 (draft, 2026-11-06): a first-time player's 시작 opens a
 * short page with no table first -- the 2025 basement, 72 hours, loan number
 * 2023-0412, the dissent nobody can find -- and only then, under 「3년 전」, the
 * prologue's first scene. The five prologue cases become a flashback towards an
 * answer the player has already been shown (분석 문서 B-3(1)).
 *
 * The switch (src/coldOpeningSwitch.js). It is decided after the E-4 funnel (주간 Funnel 워크플로,
 * scripts/report-funnel.mjs) has shown the prologue's drop-off through W47
 * (20261103 미반영 계획 D절). Off, nothing of this reaches a player: the start
 * button is the button it was, and the bundler drops the page and its words
 * (IntroScreen's branch reads the switch, as `__CP_COLD_OPENING__`, before
 * anything else).
 *
 * Nothing here touches the run. The page sits in front of `startGame`, which
 * is called afterwards exactly as the button calls it without the page: the
 * same save, the same resources, the same first scene and clock. Nothing a
 * replay or the ranking checks is read or written.
 */
/**
 * A dev or e2e build (`__CP_DEBUG_BUILD__`) can turn the page on for one visit
 * with `?coldOpening=1`, so the draft can be played and timed while the switch
 * is off. A release build never reads it (IntroScreen puts the build constant
 * in front of the call).
 */
export const COLD_OPENING_QUERY = "coldOpening";

export function coldOpeningForced(search = globalThis.location?.search ?? "") {
  return new URLSearchParams(search).get(COLD_OPENING_QUERY) === "1";
}

/**
 * Whether this press of 시작 plays the page first: only a season started with
 * no run to lose, on a device that has finished no season and has not seen the
 * page already (seen or skipped is the same: it is shown once).
 */
export function shouldPlayColdOpening({ enabled, hasResumableSave, firstSeason, seen }) {
  return enabled === true && hasResumableSave !== true && firstSeason === true && seen !== true;
}

export function coldOpeningSeen() {
  return readStoredValue(COLD_OPENING_SEEN_KEY) === "1";
}

export function markColdOpeningSeen() {
  return writeStoredValue(COLD_OPENING_SEEN_KEY, "1");
}

/** `shouldPlayColdOpening` with this device's answers. */
export function playsColdOpening({ enabled, hasResumableSave }) {
  return shouldPlayColdOpening({ enabled, hasResumableSave, firstSeason: isFirstSeason(), seen: coldOpeningSeen() });
}

/**
 * How long a panel holds a reader, in seconds, on the table's own scale
 * (gauntletEngine's READING_CHARS_PER_SECOND, 10 Korean characters a second)
 * plus a beat to find and press the button. Used to time the page against the
 * 60~90 second budget (tests/unit/cold-opening.test.mjs, the timed walk in
 * tests/cold-opening.spec.js); the page itself has no clock.
 */
export const COLD_OPENING_PRESS_SECONDS = 1.5;
export function panelReadingSeconds(panel) {
  const words = [panel?.caption, panel?.text].filter(Boolean).join("");
  return words.length / 10 + COLD_OPENING_PRESS_SECONDS;
}
