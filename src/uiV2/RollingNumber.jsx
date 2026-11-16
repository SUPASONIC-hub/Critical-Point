import { useEffect, useRef, useState } from "react";
import { motionAllowed, rollValue } from "./motion.js";

const ROLL_MS = 420;

/**
 * A number that rolls up when it rises: the stake counting into place rather
 * than jumping. A fall, a first value, and reduced motion print it at once.
 * What it prints at rest is exactly `format(value)`.
 */
export function RollingNumber({ value, format = String }) {
  const last = useRef(value);
  const [roll, setRoll] = useState(null);

  useEffect(() => {
    const from = last.current;
    last.current = value;
    if (!(typeof value === "number" && typeof from === "number" && value > from) || !motionAllowed()) return undefined;
    let frame = 0;
    const start = globalThis.performance?.now?.() ?? Date.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / ROLL_MS);
      setRoll(t < 1 ? { to: value, shown: rollValue(from, value, t) } : null);
      if (t < 1) frame = globalThis.requestAnimationFrame(tick);
    };
    frame = globalThis.requestAnimationFrame(tick);
    return () => globalThis.cancelAnimationFrame(frame);
  }, [value]);

  const rolling = roll && roll.to === value;
  return <span className={`v2-roll${rolling ? " is-rolling" : ""}`}>{format(rolling ? roll.shown : value)}</span>;
}
