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
});

export const FX_VARIABLES = Object.freeze(Object.keys(FX_READERS));

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
