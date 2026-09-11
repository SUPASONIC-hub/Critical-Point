import { useEffect, useRef } from "react";
import { useDecisionSeconds } from "../state/decisionClock.js";
import { usePressure } from "../state/decisionDynamics.js";
import { playDecisionTick } from "./AdaptiveMusic.jsx";

/**
 * The decision window, made physical.
 *
 * The game is called 임계점 and the window is its only real clock, but it used
 * to be one line of text in the header -- so incidental that the visual suite
 * masks it. This is the bar that drains above the choices: it subscribes to the
 * clock itself, so a per-second change never rebuilds the choice list under it.
 *
 * Tiers used to be a second ladder written in seconds -- press at 20, critical
 * at 10 -- which put the clock on its own curve while the reducer's burn ran
 * exponentially underneath it. They are read off that burn now, at the fractions
 * the old ladder happened to sit at, so the copy still turns where it always did
 * and follows the curve if the curve ever moves. `overtime` still belongs to the
 * clock: the window has closed and the charge has started billing.
 *
 * The curve did move -- twice -- and these did not follow it, because a fraction
 * of the burn is not a fixed point on the clock when the burn itself is
 * reshaped. At k=0.045 they solved to 6.3s and 19.9s elapsed, so `마지막 10초`
 * printed for twenty-five seconds of a forty-five second window and the reading
 * tier shrank from twenty-six seconds to seven. They are recalibrated to the
 * ladder they are named for: press at twenty seconds remaining, critical at ten.
 * Whoever moves the curve next has to move these with it, and the arithmetic is
 * `burn(45 - t)` against the current k.
 */
const WINDOW_SECONDS = 45;
const PRESS_BURN = 0.15;
const CRITICAL_BURN = 0.4;

function tierOf(seconds, burn, blind) {
  if (seconds <= 0 || blind) return "overtime";
  if (burn >= CRITICAL_BURN) return "critical";
  if (burn >= PRESS_BURN) return "press";
  return "hold";
}

const TIER_COPY = {
  hold: "읽을수록 조건이 남습니다",
  press: "이제 기준을 골라야 합니다",
  critical: "마지막 10초 · 관찰자가 반응합니다",
  overtime: "초과 · 망설임도 선택으로 기록됩니다",
};

export function DecisionClock() {
  const seconds = useDecisionSeconds();
  const pressure = usePressure();
  const remaining = Math.max(0, seconds);
  const overtime = Math.max(0, -seconds);
  const tier = tierOf(seconds, pressure.timeDecay, pressure.isBlind);
  const tempoRead = tier === "hold" ? "ANALYSIS WINDOW" : tier === "press" ? "COMMIT WINDOW" : tier === "critical" ? "PANIC SIGNAL" : "SILENCE CHARGED";
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

  // The pot the player is sitting on. It is the whole reason to hold, and it
  // was only ever legible in a HUD chip in the corner; the digit that makes
  // people hold or fold belongs next to the digit counting down.
  //
  // It used to hide below x1.15, which the death curve does not reach until
  // 35.6s of a 45s window have gone -- so the one element in this game shaped
  // like a growing pot was absent for 79% of every decision and arrived only
  // once the answer was obvious. Watching it climb from x1.00 is the thing
  // being bought here; a number that appears already large is a notification,
  // not a temptation. It still goes away on a bust, where it means nothing.
  const cashMultiplier = pressure.rewardMultiplier;
  const showCash = !pressure.isBlind;

  return (
    <div
      className={`decision-clock ${tier}${pressure.overdrive ? " overdrive" : ""}${pressure.isSlowMotion ? " slowmo" : ""}`}
      style={{ "--clock-pressure": (pressure.stressLevel / 100).toFixed(2) }}
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
        {showCash && (
          <strong className="decision-clock-cash" aria-hidden="true">
            지금 지르면 ×{cashMultiplier.toFixed(2)}
          </strong>
        )}
        <em>{tempoRead}</em>
      </div>
    </div>
  );
}
