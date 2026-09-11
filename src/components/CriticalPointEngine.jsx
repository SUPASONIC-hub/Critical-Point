import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { playJuiceCue } from "./juiceAudio.js";
import { usePressure } from "../state/decisionDynamics.js";

/**
 * The screen's half of the decision window.
 *
 * Everything painted here comes from the reducer's published pressure snapshot,
 * never from a second reading of the clock, so what the player sees and what
 * the state machine busts on cannot drift apart.
 *
 * Two things about where it writes matter more than what it writes.
 *
 * The custom properties go on the document element, not on `.game-shell`. The
 * overlays that read them -- the vignette and the stress border -- are
 * `position: fixed`, and a transform or a filter on an ancestor makes that
 * ancestor their containing block instead of the viewport. Shaking the shell
 * used to drag both overlays around with it, and the fix at the time was
 * `.game-shell{transform:none!important;filter:none!important}` at the top of
 * app.css: one line that silently discarded the jitter, the tilt, the critical
 * saturation, the slow-motion wash and the bust desaturation, all of which this
 * loop went on computing sixty times a second for nothing. The overlays now
 * live in the body-level portal below, the variables live at the root where
 * both subtrees inherit them, and the shell is free to move.
 *
 * The frame writes CSS variables rather than React state, and diffs every write
 * against the last string it wrote: `setProperty` with an unchanged value still
 * costs a style invalidation, and building those strings sixty times a second
 * is most of what this component allocates.
 */

const CRITICAL_FLOOR = 90;
const GLITCH_FLOOR = 80;

/**
 * Trauma, not a sine.
 *
 * A single sine is a wobble with a period the eye locks onto within two cycles.
 * Impacts add trauma, trauma decays on its own, and the offset is trauma
 * *squared* against a value that changes every frame -- so the same amplitude
 * reads as a hit rather than a hum, and the tail comes off quickly enough that
 * a run at high pressure is still readable.
 */
function createShaker() {
  let trauma = 0;
  let seedX = Math.random() * 1000;
  let seedY = Math.random() * 1000;
  return {
    add(amount) {
      trauma = Math.min(1, trauma + amount);
    },
    sample(sustained, deltaMs) {
      trauma = Math.max(0, trauma - deltaMs / 520);
      const level = Math.min(1, Math.max(trauma, sustained));
      const shake = level * level;
      seedX += deltaMs * 0.021;
      seedY += deltaMs * 0.017;
      // Two incommensurable sines per axis stand in for noise: cheap, and the
      // pattern does not repeat inside a decision window.
      const x = (Math.sin(seedX) + Math.sin(seedX * 2.37)) * 0.5;
      const y = (Math.sin(seedY * 1.13) + Math.sin(seedY * 2.91)) * 0.5;
      return { x: x * shake, y: y * shake, level };
    },
  };
}

/** Peak travel in pixels at full trauma, and the tilt that rides with it. */
const SHAKE_TRAVEL_PX = 14;
const SHAKE_TILT_DEG = 0.55;

export function CriticalPointEngine({ active }) {
  const pressure = usePressure();
  const pressureRef = useRef(pressure);
  const previousStress = useRef(pressure.stressLevel);
  const shaker = useRef(null);

  useEffect(() => {
    pressureRef.current = pressure;
  }, [pressure]);

  useEffect(() => {
    if (!active || typeof document === "undefined") return undefined;
    const shell = document.querySelector(".game-shell");
    if (!shell) return undefined;
    const root = document.documentElement;

    const reducedMotion = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    shaker.current = createShaker();

    const written = { stress: "", vignette: "", shake: "", jitter: "", lift: "", tilt: "" };
    const write = (name, key, value) => {
      if (written[key] === value) return;
      written[key] = value;
      root.style.setProperty(name, value);
    };

    let frameId = 0;
    let lastFrame = 0;
    let paintedTone = "";
    // The heartbeat is scheduled against the audio clock, which is sample
    // accurate and does not stall when the compositor drops frames. Driving it
    // off `requestAnimationFrame` timestamps made the pulse stutter under
    // exactly the load the pulse exists to dramatise.
    let nextBeatAt = 0;

    const animate = (time) => {
      const state = pressureRef.current;
      const deltaMs = lastFrame ? Math.min(64, time - lastFrame) : 16;
      lastFrame = time;

      const stress = state.stressLevel;
      const sustained = state.isBlind ? 1 : Math.min(1, (state.shakeIntensity / 9) * 0.55);
      const { x, y, level } = reducedMotion ? { x: 0, y: 0, level: 0 } : shaker.current.sample(sustained, deltaMs);

      if (stress >= 18) {
        const gap = 60000 / Math.max(40, state.heartbeatBpm);
        if (time >= nextBeatAt) {
          playJuiceCue("heartbeat", stress);
          // Land the beat on the shell as well as in the ear.
          if (!reducedMotion) shaker.current.add(0.05 + (stress / 100) * 0.16);
          nextBeatAt = time + gap;
        }
      } else {
        nextBeatAt = time;
      }

      write("--decision-stress", "stress", (stress / 100).toFixed(2));
      write("--decision-vignette", "vignette", state.vignette.toFixed(3));
      write("--decision-shake", "shake", level.toFixed(3));
      write("--decision-jitter", "jitter", `${(x * SHAKE_TRAVEL_PX).toFixed(2)}px`);
      write("--decision-lift", "lift", `${(y * SHAKE_TRAVEL_PX * 0.45).toFixed(2)}px`);
      write("--decision-tilt", "tilt", `${(x * SHAKE_TILT_DEG).toFixed(3)}deg`);

      const tone = state.isBlind
        ? "is-bust"
        : state.isSlowMotion
          ? "is-slowmo"
          : stress >= CRITICAL_FLOOR
            ? "is-critical"
            : stress >= GLITCH_FLOOR
              ? "is-glitching"
              : "";
      if (tone !== paintedTone) {
        if (paintedTone) shell.classList.remove(paintedTone);
        if (tone && !reducedMotion) shell.classList.add(tone);
        paintedTone = tone;
      }

      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);

    const onInteraction = (event) => {
      const target = event.target.closest?.("[data-juice]");
      if (!target || target.disabled) return;
      const stress = pressureRef.current.stressLevel;
      if (event.type === "pointerover") playJuiceCue("hover", stress);
      if (event.type === "click") {
        playJuiceCue("click", stress);
        // Trauma instead of a class toggle. Re-triggering a CSS animation needs
        // a forced reflow (`void offsetWidth`) on every press; adding to the
        // shaker lands the same kick inside the frame loop that is already
        // running, and two presses in a row stack rather than cancel.
        if (!reducedMotion) shaker.current.add(0.42);
      }
    };

    shell.addEventListener("pointerover", onInteraction);
    shell.addEventListener("click", onInteraction);

    return () => {
      window.cancelAnimationFrame(frameId);
      shell.removeEventListener("pointerover", onInteraction);
      shell.removeEventListener("click", onInteraction);
      for (const name of [
        "--decision-stress",
        "--decision-vignette",
        "--decision-shake",
        "--decision-jitter",
        "--decision-lift",
        "--decision-tilt",
      ]) {
        root.style.removeProperty(name);
      }
      shell.classList.remove("is-bust", "is-slowmo", "is-critical", "is-glitching");
    };
  }, [active]);

  useEffect(() => {
    if (pressure.stressLevel >= GLITCH_FLOOR && previousStress.current < GLITCH_FLOOR) {
      playJuiceCue("threshold", pressure.stressLevel);
      shaker.current?.add(0.6);
    }
    previousStress.current = pressure.stressLevel;
  }, [pressure.stressLevel]);

  const thresholdLabel = pressure.isBlind
    ? "BUST"
    : pressure.stressLevel >= CRITICAL_FLOOR
      ? "CRITICAL"
      : pressure.overdrive
        ? "OVERDRIVE"
        : "BUILDING";

  if (typeof document === "undefined") return null;
  // Portaled to the body on purpose, and now for two reasons. A `position:fixed`
  // overlay rendered inside the choice panel counts as a standing number on the
  // play board, and it is one ancestor transform away from being laid out
  // somewhere else entirely -- which is the trap the shell's own `:before` and
  // `:after` fell into. Both overlays hang off this element instead.
  return createPortal(
    <div className="decision-feedback-layer" aria-hidden="true">
      {pressure.combo > 0 && <span className="decision-combo">COMBO x{pressure.combo}</span>}
      <span className="decision-push">
        PUSH {pressure.rewardMultiplier.toFixed(2)}x · {thresholdLabel}
      </span>
      <span className="decision-stress">STRESS {pressure.stressLevel}%</span>
    </div>,
    document.body,
  );
}
