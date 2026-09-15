import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { BEAT_GOOD, BEAT_GOOD_FLOOR_MS, getCloseness, getHeartbeatBpm, getRemainingSeconds } from "./gauntletEngine.js";
import { playClockTick, playHeartbeat, startTensionDrone } from "./gauntletAudio.js";

/**
 * The body of the window: vignette, heartbeat, drone, shake -- and the beat.
 *
 * Everything is driven from one animation frame that reads the live window
 * through a ref and writes CSS variables on the document root, so the overlay
 * and the table inherit the same numbers without a React render per frame.
 *
 * The heartbeat is also the table's rhythm. This loop owns when each beat
 * lands and writes it into `beatClock` -- a ref the stage reads when a push is
 * pressed, so a press is graded against the beat the player heard and saw, not
 * against a second clock that could drift from it. The approach ring, the hit
 * zone and the grade flash are CSS variables like the rest:
 * --gx-beat-phase (0 at a beat, 1 at the next), --gx-beat-live, --gx-beat-zone
 * (1 inside the GOOD window) and --gx-flash.
 *
 * Reduced motion removes travel -- the shake and the ring's closing scale --
 * and nothing else. The red closes in, the beat still thumps the vignette's
 * opacity, the bust still floods the screen: colour and sound are not motion.
 *
 * The loop allocates nothing per frame: numbers are formatted only when they
 * change, and `write` skips a style write when the string is the same.
 */
const SHAKE_PX = 11;
const FX_VARIABLES = ["--gx-heat", "--gx-beat", "--gx-shake-x", "--gx-shake-y", "--gx-beat-phase", "--gx-beat-live", "--gx-beat-zone", "--gx-flash"];

export function GauntletFx({ window: liveWindow, paused, impact, flash, beatClock, grade = null, fever = false }) {
  const stateRef = useRef({ window: liveWindow, paused });
  const impactRef = useRef(0);
  const flashRef = useRef(0);

  useEffect(() => {
    stateRef.current = { window: liveWindow, paused };
  }, [liveWindow, paused]);

  useEffect(() => {
    if (!impact) return;
    impactRef.current = Math.min(1, impactRef.current + impact.amount);
  }, [impact]);

  useEffect(() => {
    if (!flash) return;
    flashRef.current = Math.min(1, flashRef.current + flash.amount);
  }, [flash]);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const root = document.documentElement;
    const reducedMotion = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const drone = startTensionDrone();
    const clock = beatClock?.current ?? { at: 0, period: 0 };
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
      // The window's clock does not run in a hidden tab, so neither does the
      // rhythm a push is graded against.
      const beating = live && !document.hidden;

      // The beat is stamped when it actually sounds, not at the frame's nominal
      // start: on a starved main thread the callback runs well after `time`, and
      // a press on the beat the player heard would be graded early.
      const now = globalThis.performance?.now?.() ?? time;
      if (live) {
        const bpm = getHeartbeatBpm(win.gauge, tellWall, win.schema.sedated, win.elapsed / win.schema.seconds);
        if (time >= nextBeat) {
          playHeartbeat(heat);
          beat = 1;
          impactRef.current = Math.min(1, impactRef.current + 0.04 + heat * 0.12);
          nextBeat = time + 60000 / bpm;
          clock.at = now;
          clock.period = 60000 / bpm;
        }
        const remaining = Math.ceil(getRemainingSeconds(win));
        if (remaining <= 5 && remaining !== lastTickSecond) {
          lastTickSecond = remaining;
          playClockTick(remaining);
        }
      } else {
        nextBeat = time + 120;
      }
      if (!beating) clock.period = 0;
      if (time >= droneAt) {
        drone.set(live ? closeness : 0, win.schema.sedated);
        droneAt = time + 100;
      }

      let phase = 0;
      let zone = 0;
      if (beating && clock.period > 0) {
        const since = Math.max(0, now - clock.at);
        phase = Math.min(1, since / clock.period);
        const offset = Math.min(since, Math.max(0, clock.period - since));
        zone = offset <= Math.max(clock.period * BEAT_GOOD, BEAT_GOOD_FLOOR_MS) ? 1 : 0;
      }

      beat = Math.max(0, beat - delta / 260);
      impactRef.current = Math.max(0, impactRef.current - delta / 480);
      flashRef.current = Math.max(0, flashRef.current - delta / 240);
      const trauma = Math.min(1, impactRef.current + (live ? Math.pow(closeness, 3) * 0.45 : 0));
      const shake = reducedMotion ? 0 : trauma * trauma;
      const x = (Math.sin(time * 0.071) + Math.sin(time * 0.137)) * 0.5 * shake * SHAKE_PX;
      const y = (Math.sin(time * 0.089) + Math.sin(time * 0.173)) * 0.5 * shake * SHAKE_PX * 0.6;

      write("--gx-heat", heat.toFixed(3));
      write("--gx-beat", beat.toFixed(3));
      write("--gx-shake-x", `${x.toFixed(2)}px`);
      write("--gx-shake-y", `${y.toFixed(2)}px`);
      write("--gx-beat-phase", reducedMotion ? "1" : phase.toFixed(2));
      write("--gx-beat-live", beating ? "1" : "0");
      write("--gx-beat-zone", zone ? "1" : "0");
      write("--gx-flash", flashRef.current.toFixed(2));
      frame = globalThis.requestAnimationFrame(loop);
    };
    frame = globalThis.requestAnimationFrame(loop);

    return () => {
      globalThis.cancelAnimationFrame(frame);
      drone.stop();
      clock.period = 0;
      for (const name of FX_VARIABLES) root.style.removeProperty(name);
    };
    // The loop reads everything live through refs; it mounts once per window.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (typeof document === "undefined") return null;
  return createPortal(
    <div className={`gx-fx gx-fx-${liveWindow.status}${grade ? ` gx-fx-grade-${grade}` : ""}${fever ? " gx-fx-fever" : ""}`} aria-hidden="true">
      <div className="gx-fx-vignette" />
      <div className="gx-fx-border" />
      <div className="gx-fx-flash" />
    </div>,
    document.body,
  );
}
