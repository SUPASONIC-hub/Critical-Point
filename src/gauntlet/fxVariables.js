/**
 * The variables the frame loop writes, and the elements that read each one.
 *
 * They are registered as not inherited, so a rule that reads one from an
 * element this table does not name reads the initial value and never moves.
 * `tests/unit/gauntlet-invariants.test.mjs` reads the stylesheets and fails
 * when a rule uses a variable on an element missing from its list.
 */
export const FX_READERS = Object.freeze({
  "--gx-heat": ".gx-hud, .gx-pot-value, .gx-active-rules, .gx-gauge-fill, .gx-situation-risk, .gx-push, .gx-fx-vignette, .gx-fx-border",
  "--gx-beat": ".gx-pot-value, .gx-clock, .gx-bpm svg, .gx-fx-vignette, .gx-fx-border",
  "--gx-shake-x": ".gx-table",
  "--gx-shake-y": ".gx-table",
  "--gx-beat-phase": ".gx-focus-reticle, .gx-beat-ring",
  "--gx-beat-live": ".gx-beat-ring",
  "--gx-beat-zone": ".gx-focus-modes button, .gx-push, .gx-focus, .gx-focus-reticle",
  "--gx-flash": ".gx-fx-flash",
  "--gx-rate": ".gx-gauge-ticks",
});

export const FX_VARIABLES = Object.freeze(Object.keys(FX_READERS));

/**
 * What the two settings that turn the body down do to a frame: the OS's
 * reduced motion, and the comfort setting (`calmEffects`), which is wider.
 * The frame loop (GauntletFx.jsx) writes what these return, so what the
 * setting does can be held without a browser (tests/unit/table-motion.test.mjs).
 *
 * Either one stills the shake and closes the approach ring. Only the comfort
 * setting stops the pulse and cuts the flash to a third.
 */
export const fxShake = (trauma, reducedMotion, calm) => (reducedMotion || calm ? 0 : trauma * trauma);
export const fxBeatValue = (beat, calm) => (calm ? "0.000" : beat.toFixed(3));
export const fxBeatPhaseValue = (phase, reducedMotion, calm) => (reducedMotion || calm ? "1" : phase.toFixed(2));
export const fxFlashValue = (flash, calm) => (calm ? flash / 3 : flash).toFixed(2);

/**
 * The tick light: how fast the pulse is, as how bright the gauge's ticks are.
 *
 * It is the heartbeat for a player who has the sound off, and neither setting
 * above reaches it. Everything else that shows the pulse is a blink at the
 * pulse's own rate -- the ring, the vignette, the heart beside the number --
 * and the comfort setting stops those, so with the sound off as well there was
 * no instrument left. This one is a level, not a beat: 0 at a resting pulse, 1
 * at the fastest the engine goes, and it drifts to where the pulse is rather
 * than jumping there. Crossing the whole range takes `RATE_SWEEP_MS`, so the
 * ticks cannot blink however the pulse moves; tests/unit/table-motion.test.mjs
 * holds that against three flashes a second with the opacity the sheet gives it.
 */
export const RATE_REST_BPM = 60;
export const RATE_TOP_BPM = 190;
export const RATE_SWEEP_MS = 2000;
export const fxRateTarget = (bpm) => Math.min(1, Math.max(0, ((Number(bpm) || 0) - RATE_REST_BPM) / (RATE_TOP_BPM - RATE_REST_BPM)));
/** One frame of the drift. A negative `rate` is a table that has not drawn yet, which starts on the pulse. */
export function fxRateStep(rate, target, deltaMs) {
  if (rate < 0) return target;
  const reach = Math.max(0, deltaMs) / RATE_SWEEP_MS;
  return Math.abs(target - rate) <= reach ? target : rate + Math.sign(target - rate) * reach;
}

const FX_LENGTHS = new Set(["--gx-shake-x", "--gx-shake-y"]);

let registered = false;

/** Registers the variables once a page. A browser without the API keeps inheriting, which is only slower. */
export function registerFxVariables() {
  if (registered || typeof globalThis.CSS?.registerProperty !== "function") return;
  registered = true;
  for (const name of FX_VARIABLES) {
    const length = FX_LENGTHS.has(name);
    try {
      // The ring rests closed, so the phase a reader sees before the first frame is 1.
      globalThis.CSS.registerProperty({ name, syntax: length ? "<length>" : "<number>", inherits: false, initialValue: length ? "0px" : name === "--gx-beat-phase" ? "1" : "0" });
    } catch {
      // Already registered by an earlier copy of this module (a hot reload).
    }
  }
}
