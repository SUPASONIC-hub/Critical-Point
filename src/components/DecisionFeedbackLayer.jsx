import { useEffect, useRef } from "react";
import { playJuiceCue } from "./juiceAudio.js";
import { useDecisionSeconds } from "../state/decisionClock.js";

export function DecisionFeedbackLayer({ active }) {
  const seconds = useDecisionSeconds();
  const stressLevel = Math.min(100, Math.max(0, Math.round((1 - seconds / 45) * 100)));
  const rewardMultiplier = (1 + Math.pow(stressLevel / 100, 2) * 2.5).toFixed(2);
  const thresholdLabel = stressLevel >= 92 ? "BUST RISK" : stressLevel >= 78 ? "CRITICAL" : "BUILDING";
  const stressRef = useRef(stressLevel);
  const previousStress = useRef(stressLevel);
  const lastHeartbeat = useRef(0);
  useEffect(() => {
    stressRef.current = stressLevel;
  }, [stressLevel]);
  useEffect(() => {
    if (!active || typeof document === "undefined") return undefined;
    const root = document.querySelector(".game-shell");
    if (!root) return undefined;
    let frameId = 0;
    const reducedMotion = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const animate = (time) => {
      const pulse = reducedMotion ? 0 : Math.sin(time / 95) * stressRef.current * 0.012;
      const heartbeatGap = Math.max(360, 820 - stressRef.current * 4);
      if (stressRef.current >= 35 && time - lastHeartbeat.current >= heartbeatGap) {
        playJuiceCue("heartbeat", stressRef.current);
        lastHeartbeat.current = time;
      }
      root.style.setProperty("--decision-stress", String(stressRef.current / 100));
      root.style.setProperty("--decision-jitter", `${pulse.toFixed(3)}px`);
      root.style.setProperty("--decision-tilt", `${(pulse * 0.18).toFixed(3)}deg`);
      frameId = window.requestAnimationFrame(animate);
    };
    frameId = window.requestAnimationFrame(animate);
    const onInteraction = (event) => {
      const target = event.target.closest?.("[data-juice]");
      if (!target || target.disabled) return;
      if (event.type === "pointerover") playJuiceCue("hover", stressRef.current);
      if (event.type === "click") {
        playJuiceCue("click", stressRef.current);
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
      root.style.removeProperty("--decision-stress");
      root.style.removeProperty("--decision-jitter");
      root.style.removeProperty("--decision-tilt");
      root.classList.remove("screen-shake");
    };
  }, [active]);

  useEffect(() => {
    if (stressLevel >= 80 && previousStress.current < 80) playJuiceCue("threshold", stressLevel);
    previousStress.current = stressLevel;
  }, [stressLevel]);

  return (
    <div className="decision-feedback-layer" aria-hidden="true">
      <span className="decision-push">PUSH {rewardMultiplier}x · {thresholdLabel}</span>
      <span className="decision-stress">STRESS {Math.round(stressLevel)}%</span>
    </div>
  );
}
