import { useEffect, useRef } from "react";
import { useDecisionSeconds } from "../state/decisionClock.js";
import { playDecisionTick } from "./AdaptiveMusic.jsx";

/**
 * The decision window, made physical.
 *
 * The game is called 임계점 and the window is its only real clock, but it used
 * to be one line of text in the header -- so incidental that the visual suite
 * masks it. This is the bar that drains above the choices: it subscribes to the
 * clock itself, so a per-second change never rebuilds the choice list under it.
 *
 * Tiers are read, not computed twice: `hold` above 20s, `press` from 20 to 11,
 * `critical` at 10 and below, `overtime` once the window has closed and the
 * overtime charge has started billing.
 */
const WINDOW_SECONDS = 45;

function tierOf(seconds) {
  if (seconds <= 0) return "overtime";
  if (seconds <= 10) return "critical";
  if (seconds <= 20) return "press";
  return "hold";
}

const TIER_COPY = {
  hold: "아직 읽을 시간이 있습니다",
  press: "결정을 좁힐 시간",
  critical: "닫히기 전",
  overtime: "초과 · 15초마다 시간·피로 비용이 다시 붙습니다",
};

export function DecisionClock() {
  const seconds = useDecisionSeconds();
  const remaining = Math.max(0, seconds);
  const overtime = Math.max(0, -seconds);
  const tier = tierOf(seconds);
  const lastTick = useRef(null);

  // One cue per second inside the last ten, and one when the window closes.
  // Anything more often than that reads as a rattle rather than a pulse.
  useEffect(() => {
    if (tier !== "critical" && tier !== "overtime") {
      lastTick.current = null;
      return;
    }
    if (lastTick.current === seconds) return;
    lastTick.current = seconds;
    playDecisionTick(tier === "overtime" ? "overtime" : remaining);
  }, [tier, seconds, remaining]);

  return (
    <div
      className={`decision-clock ${tier}`}
      role="timer"
      aria-live="off"
      aria-label={overtime > 0 ? `결정 시간 초과 ${overtime}초` : `남은 결정 시간 ${remaining}초`}
    >
      <div className="decision-clock-track">
        <i style={{ width: `${Math.min(100, (remaining / WINDOW_SECONDS) * 100)}%` }} />
      </div>
      <div className="decision-clock-read">
        <b>{overtime > 0 ? `+${overtime}` : remaining}</b>
        <span>{TIER_COPY[tier]}</span>
      </div>
    </div>
  );
}
