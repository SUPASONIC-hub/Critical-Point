import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { getCloseness, getHeartbeatBpm, getRemainingSeconds } from "./gauntletEngine.js";
import { playClockTick, playHeartbeat, startTensionDrone } from "./gauntletAudio.js";

/**
 * The body of the window: vignette, heartbeat, drone, shake.
 *
 * Everything is driven from one animation frame that reads the live window
 * through a ref and writes CSS variables on the document root, so the overlay
 * and the table inherit the same numbers without a React render per frame.
 *
 * Reduced motion removes travel -- the shake -- and nothing else. The red
 * closes in, the beat still thumps the vignette's opacity, the bust still
 * floods the screen: colour and sound are not motion.
 */
const SHAKE_PX = 11;

export function GauntletFx({ window: liveWindow, paused, impact }) {
  const stateRef = useRef({ window: liveWindow, paused });
  const impactRef = useRef(0);

  useEffect(() => {
    stateRef.current = { window: liveWindow, paused };
  }, [liveWindow, paused]);

  useEffect(() => {
    if (!impact) return;
    impactRef.current = Math.min(1, impactRef.current + impact.amount);
  }, [impact]);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const root = document.documentElement;
    const reducedMotion = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const drone = startTensionDrone();
    const written = {};
    const write = (name, value) => {
      if (written[name] === value) return;
      written[name] = value;
      root.style.setProperty(name, value);
    };
    let frame = 0;
    let last = 0;
    let nextBeat = 0;
    let beat = 0;
    let lastTickSecond = -1;
    let droneAt = 0;

    const loop = (time) => {
      const { window: win, paused: isPaused } = stateRef.current;
      const delta = last ? Math.min(64, time - last) : 16;
      last = time;
      const live = win.status === "live" && !isPaused;
      const tellWall = win.wall + (win.tellOffset ?? 0);
      // Same shape as the pulse: the tell on top of a floor built from the heat
      // the gauge already shows, so a hot gauge always reads red.
      const visibleHeat = Math.pow(Math.min(1, win.gauge / 100), 2);
      const closeness = win.status === "bust" ? 1 : Math.max(visibleHeat, getCloseness(win.gauge, tellWall));
      const heat = win.schema.sedated ? Math.max(0.35, visibleHeat) : closeness;

      if (live) {
        const bpm = getHeartbeatBpm(win.gauge, tellWall, win.schema.sedated, win.elapsed / win.schema.seconds);
        if (time >= nextBeat) {
          playHeartbeat(heat);
          beat = 1;
          impactRef.current = Math.min(1, impactRef.current + 0.04 + heat * 0.12);
          nextBeat = time + 60000 / bpm;
        }
        const remaining = Math.ceil(getRemainingSeconds(win));
        if (remaining <= 5 && remaining !== lastTickSecond) {
          lastTickSecond = remaining;
          playClockTick(remaining);
        }
      } else {
        nextBeat = time + 120;
      }
      if (time >= droneAt) {
        drone.set(live ? closeness : 0, win.schema.sedated);
        droneAt = time + 100;
      }

      beat = Math.max(0, beat - delta / 260);
      impactRef.current = Math.max(0, impactRef.current - delta / 480);
      const trauma = Math.min(1, impactRef.current + (live ? Math.pow(closeness, 3) * 0.45 : 0));
      const shake = reducedMotion ? 0 : trauma * trauma;
      const x = (Math.sin(time * 0.071) + Math.sin(time * 0.137)) * 0.5 * shake * SHAKE_PX;
      const y = (Math.sin(time * 0.089) + Math.sin(time * 0.173)) * 0.5 * shake * SHAKE_PX * 0.6;

      write("--gx-heat", heat.toFixed(3));
      write("--gx-beat", beat.toFixed(3));
      write("--gx-shake-x", `${x.toFixed(2)}px`);
      write("--gx-shake-y", `${y.toFixed(2)}px`);
      frame = globalThis.requestAnimationFrame(loop);
    };
    frame = globalThis.requestAnimationFrame(loop);

    return () => {
      globalThis.cancelAnimationFrame(frame);
      drone.stop();
      for (const name of ["--gx-heat", "--gx-beat", "--gx-shake-x", "--gx-shake-y"]) root.style.removeProperty(name);
    };
  }, []);

  if (typeof document === "undefined") return null;
  return createPortal(
    <div className={`gx-fx gx-fx-${liveWindow.status}`} aria-hidden="true">
      <div className="gx-fx-vignette" />
      <div className="gx-fx-border" />
    </div>,
    document.body,
  );
}
