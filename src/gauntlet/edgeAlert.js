/**
 * 위기 가장자리 알림 (A5, 2026-11-13, user choice 1): a switch of the comfort
 * panel (`crisisEdge`, off unless turned on) that frames the screen's edges as
 * the table nears the wall. It reads the 현재 위험 line's step -- the one the
 * step marker's thud hears (zoneThud.js, A1-1) and the table's voice says --
 * so it tells a player nothing the line does not: within a push of the band
 * (`inReach`) the frame is amber and slow, inside it (`inBand`) red and a
 * little quicker. A line at a distance, a table that is not live and a held
 * clock draw none.
 *
 * The frame is a shadow on the fixed overlay GauntletFx portals to the page
 * (comfort.css `.gx-fx-edge`): a few pixels at the screen's edge, nothing over
 * a card or a line of text, and no box that takes room, so nothing moves.
 * It breathes -- an opacity between two levels, never off and on -- at under
 * three times a second (`EDGE_ALERT_MAX_HZ`). Reduced motion, the calm-effects
 * setting and a quiet table hold it still at its level; it still shows, as a
 * colour, because it is information and not motion.
 */

/** The fastest the frame may breathe, in full cycles a second (WCAG 2.3.1 is three). */
export const EDGE_ALERT_MAX_HZ = 3;

/** One breath, in milliseconds, at each step of the line. */
export const EDGE_ALERT_PERIOD_MS = Object.freeze({ inReach: 1600, inBand: 900 });

/**
 * The frame a frame of the table draws: "" for none, else the line's step.
 * `enabled` is the switch; `live` is the window running with its clock not held.
 */
export function edgeAlertLevel({ enabled, zone, live }) {
  if (!enabled || !live) return "";
  return Object.hasOwn(EDGE_ALERT_PERIOD_MS, zone) ? zone : "";
}

/** Whether the frame breathes or stands still. */
export function edgeAlertPulses({ reducedMotion = false, calm = false, quiet = false } = {}) {
  return !(reducedMotion || calm || quiet);
}
