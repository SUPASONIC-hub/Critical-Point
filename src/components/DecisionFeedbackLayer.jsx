import { useEffect, useRef } from "react";
import { playJuiceCue } from "./juiceAudio.js";
import { usePressure } from "../state/decisionDynamics.js";

/**
 * The screen's half of the decision window.
 *
 * This used to compute its own stress from `1 - seconds / 45`, which meant the
 * vignette and the heartbeat were reading a different curve than the reducer that
 * actually busts the run: the gauge could say 40% while the state machine was
 * already blind. Everything painted here now comes from the reducer's published
 * pressure snapshot, so what the player sees is what the state machine did.
 *
 * The animation frame writes CSS variables rather than React state. Every write
 * is diffed against the last string written, because setProperty with an
 * unchanged value still costs a style invalidation, and building those strings
 * sixty times a second is most of what this component allocates.
 */

const CRITICAL_FLOOR = 90;
const GLITCH_FLOOR = 80;

export function DecisionFeedbackLayer({ active }) {
  const pressure = usePressure();
  const pressureRef = useRef(pressure);
  const previousStress = useRef(pressure.stressLevel);
  const lastHeartbeat = useRef(0);

  useEffect(() => {
    pressureRef.current = pressure;
  }, [pressure]);

  useEffect(() => {
    if (!active || typeof document === "undefined") return undefined;
    const root = document.querySelector(".game-shell");
    if (!root) return undefined;

    const reducedMotion = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const written = { stress: "", vignette: "", shake: "", jitter: "", tilt: "" };
    let frameId = 0;
    let paintedTone = "";

    const write = (name, key, value) => {
      if (written[key] === value) return;
      written[key] = value;
      root.style.setProperty(name, value);
    };

    const animate = (time) => {
      const state = pressureRef.current;
      const stress = state.stressLevel;
      const shake = state.isBlind ? state.shakeIntensity : state.shakeIntensity * 0.35;
      // One sine drives jitter and tilt so the shell tips with the shove rather
      // than fighting it; amplitude is the reducer's shake, not the raw gauge.
      const wave = reducedMotion ? 0 : Math.sin(time / (state.isSlowMotion ? 190 : 95)) * shake * 0.12;

      const gap = 60000 / Math.max(40, state.heartbeatBpm);
      if (stress >= 35 && time - lastHeartbeat.current >= gap) {
        playJuiceCue("heartbeat", stress);
        lastHeartbeat.current = time;
      }

      write("--decision-stress", "stress", (stress / 100).toFixed(2));
      write("--decision-vignette", "vignette", state.vignette.toFixed(2));
      write("--decision-shake", "shake", `${state.shakeIntensity}`);
      write("--decision-jitter", "jitter", `${wave.toFixed(2)}px`);
      write("--decision-tilt", "tilt", `${(wave * 0.18).toFixed(3)}deg`);

      const tone = state.isBlind ? "is-bust" : state.isSlowMotion ? "is-slowmo" : stress >= CRITICAL_FLOOR ? "is-critical" : stress >= GLITCH_FLOOR ? "is-glitching" : "";
      if (tone !== paintedTone) {
        if (paintedTone) root.classList.remove(paintedTone);
        if (tone && !reducedMotion) root.classList.add(tone);
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
        if (!reducedMotion) {
          root.classList.remove("screen-shake");
          void root.offsetWidth;
          root.classList.add("screen-shake");
        }
      }
    };

    root.addEventListener("pointerover", onInteraction);
    root.addEventListener("click", onInteraction);

    return () => {
      window.cancelAnimationFrame(frameId);
      root.removeEventListener("pointerover", onInteraction);
      root.removeEventListener("click", onInteraction);
      for (const name of ["--decision-stress", "--decision-vignette", "--decision-shake", "--decision-jitter", "--decision-tilt"]) {
        root.style.removeProperty(name);
      }
      root.classList.remove("screen-shake", "is-bust", "is-slowmo", "is-critical", "is-glitching");
    };
  }, [active]);

  useEffect(() => {
    if (pressure.stressLevel >= GLITCH_FLOOR && previousStress.current < GLITCH_FLOOR) {
      playJuiceCue("threshold", pressure.stressLevel);
    }
    previousStress.current = pressure.stressLevel;
  }, [pressure.stressLevel]);

  const thresholdLabel = pressure.isBlind ? "BUST" : pressure.stressLevel >= CRITICAL_FLOOR ? "CRITICAL" : pressure.overdrive ? "OVERDRIVE" : "BUILDING";

  return (
    <div className="decision-feedback-layer" aria-hidden="true">
      {pressure.combo > 0 && <span className="decision-combo">COMBO x{pressure.combo}</span>}
      <span className="decision-push">PUSH {pressure.rewardMultiplier.toFixed(2)}x · {thresholdLabel}</span>
      <span className="decision-stress">STRESS {pressure.stressLevel}%</span>
    </div>
  );
}
