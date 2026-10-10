import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { getCloseness, getHeartbeatBpm, getRemainingSeconds } from "./gauntletEngine.js";
import { playClockTick, playHeartbeat, startTensionDrone } from "./gauntletAudio.js";
import { FX_READERS, FX_VARIABLES, fxBeatValue, fxFlashValue, fxRateStep, fxRateTarget, fxShake, monotonicNow, registerFxVariables } from "./fxVariables.js";
import { getAccessibility } from "../state/accessibilitySettings.js";

/**
 * The body of the window: vignette, heartbeat, drone and shake.
 *
 * Everything is driven from one animation frame that reads the live window
 * through a ref and writes CSS variables, so the overlay and the table read
 * the same numbers without a React render per frame.
 *
 * Each variable is written on the elements that read it (`FX_READERS`) and on the
 * stage, where the tests and the harness look for it, and is registered as not
 * inherited. An unregistered custom property inherits, so writing eight of
 * them a frame on the stage root restyled everything under it -- the hand, the
 * HUD and the several hundred nodes of the scene plate -- whether or not it
 * read one. They used to be on the document root, which restyled the whole
 * page. Registered from here rather than with `@property` in the sheet, which
 * would have cost the play sheet fifty lines of its budget for eight names.
 *
 * The heartbeat is pressure and nothing else: no press is graded against it.
 * The pulse keeps its tempo -- the tempo is the instrument -- in the sound, the
 * number, the vignette and the tick light.
 *
 * What floods the screen pulses under three times a second. The pulse races to
 * 190 a minute next to the wall, and at that rate the vignette was a
 * full-screen red flash at 3.2Hz. The sound keeps every beat; the screen-wide
 * pulse takes every other one once the beat is faster than `PULSE_MIN_MS`.
 *
 * Reduced motion removes travel -- the shake -- and nothing else. The red
 * closes in, the beat still thumps the vignette's opacity, the bust still
 * floods the screen: colour and sound are not motion. The preference is
 * followed live, not read once at mount.
 *
 * The comfort setting (`calmEffects`) turns the body down whatever the OS
 * says: no shake, the press flash at a third, and no beat pulse on the pot,
 * the clock and the heart.
 *
 * One thing neither setting touches: --gx-rate, how fast the pulse is, which
 * lights the gauge's ticks. It is a level that drifts, not a beat (see
 * `fxRateStep`), so a player with the sound off and the comfort setting on
 * still has the heartbeat as something to read.
 *
 * The loop allocates nothing per frame: numbers are formatted only when they
 * change, and `write` skips a style write when the string is the same.
 */
const SHAKE_PX = 11;
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
/** 2.9 a second: the fastest anything screen-wide may pulse. */
const PULSE_MIN_MS = 345;
/** How often the loop looks for readers that mounted since it last looked. */
const READERS_REFRESH_MS = 400;
export function GauntletFx({ window: liveWindow, paused, impact, flash, stageRef }) {
  const stateRef = useRef({ window: liveWindow, paused });
  const impactRef = useRef(0);
  const flashRef = useRef(0);
  const flashedAt = useRef(0);
  const overlayRef = useRef(null);

  useEffect(() => {
    stateRef.current = { window: liveWindow, paused };
  }, [liveWindow, paused]);

  useEffect(() => {
    if (!impact) return;
    impactRef.current = Math.min(1, impactRef.current + impact.amount);
  }, [impact]);

  useEffect(() => {
    if (!flash) return;
    const now = monotonicNow();
    if (now - flashedAt.current < PULSE_MIN_MS) return;
    flashedAt.current = now;
    flashRef.current = Math.min(1, flashRef.current + flash.amount);
  }, [flash]);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    registerFxVariables();
    const motionQuery = globalThis.matchMedia?.(REDUCED_MOTION) ?? null;
    let reducedMotion = motionQuery?.matches ?? false;
    const onMotionChange = (event) => {
      reducedMotion = event.matches;
    };
    motionQuery?.addEventListener?.("change", onMotionChange);
    const drone = startTensionDrone();
    const written = {};
    const readers = new Map(FX_VARIABLES.map((name) => [name, []]));
    const roots = () => [stageRef?.current, overlayRef.current].filter(Boolean);
    // The stage re-renders under the loop -- a rules panel mounts, the active
    // stance moves -- so the readers are looked up again a few times a second,
    // and one that was not there last time is given what the others hold.
    const findReaders = () => {
      for (const name of FX_VARIABLES) {
        const found = roots().flatMap((root) => [...root.querySelectorAll(FX_READERS[name])]);
        const stage = stageRef?.current;
        const next = stage ? [stage, ...found] : found;
        const known = new Set(readers.get(name));
        if (written[name] !== undefined) {
          for (const element of next) if (!known.has(element)) element.style.setProperty(name, written[name]);
        }
        readers.set(name, next);
      }
    };
    const write = (name, value) => {
      if (written[name] === value) return;
      written[name] = value;
      for (const element of readers.get(name)) element.style.setProperty(name, value);
    };
    let frame = 0;
    let last = 0;
    let nextBeat = 0;
    let beat = 0;
    let pulsedAt = 0;
    // The tick light's level; under 0 until the first frame has read the pulse.
    let rate = -1;
    let lastTickSecond = -1;
    let droneAt = 0;
    let readersAt = 0;

    const loop = (time) => {
      const { window: win, paused: isPaused } = stateRef.current;
      const delta = last ? Math.min(64, time - last) : 16;
      last = time;
      if (time >= readersAt) {
        findReaders();
        readersAt = time + READERS_REFRESH_MS;
      }
      const live = win.status === "live" && !isPaused;
      const tellWall = win.wall + (win.tellOffset ?? 0);
      // Same shape as the pulse: the tell on top of a floor built from the heat
      // the gauge already shows, so a hot gauge always reads red.
      const visibleHeat = Math.pow(Math.min(1, win.gauge / 100), 2);
      const closeness = win.status === "bust" ? 1 : Math.max(visibleHeat, getCloseness(win.gauge, tellWall));
      const heat = win.schema.sedated ? Math.max(0.35, visibleHeat) : closeness;
      // SILENCE takes the wall out of everything the body feels. The shake read
      // the tell directly, so on a silenced board the table still trembled
      // harder the nearer the wall was.
      const felt = win.schema.sedated ? visibleHeat : closeness;
      const now = monotonicNow();
      // The number the stage prints, read here whether the table is live or
      // not: the tick light shows it, and is on screen for as long as it is.
      const bpm = getHeartbeatBpm(win.gauge, tellWall, win.schema.sedated, win.elapsed / win.schema.seconds);
      rate = fxRateStep(rate, fxRateTarget(bpm), delta);
      if (live) {
        if (time >= nextBeat) {
          playHeartbeat(heat);
          nextBeat = time + 60000 / bpm;
          if (now - pulsedAt >= PULSE_MIN_MS) {
            pulsedAt = now;
            beat = 1;
            impactRef.current = Math.min(1, impactRef.current + 0.04 + heat * 0.12);
          }
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
      flashRef.current = Math.max(0, flashRef.current - delta / 240);
      const trauma = Math.min(1, impactRef.current + (live ? Math.pow(felt, 3) * 0.45 : 0));
      const calm = getAccessibility().calmEffects;
      const shake = fxShake(trauma, reducedMotion, calm);
      const x = (Math.sin(time * 0.071) + Math.sin(time * 0.137)) * 0.5 * shake * SHAKE_PX;
      const y = (Math.sin(time * 0.089) + Math.sin(time * 0.173)) * 0.5 * shake * SHAKE_PX * 0.6;

      write("--gx-heat", heat.toFixed(3));
      write("--gx-beat", fxBeatValue(beat, calm));
      write("--gx-shake-x", `${x.toFixed(2)}px`);
      write("--gx-shake-y", `${y.toFixed(2)}px`);
      write("--gx-flash", fxFlashValue(flashRef.current, calm));
      write("--gx-rate", rate.toFixed(2));
      frame = globalThis.requestAnimationFrame(loop);
    };
    frame = globalThis.requestAnimationFrame(loop);

    return () => {
      globalThis.cancelAnimationFrame(frame);
      motionQuery?.removeEventListener?.("change", onMotionChange);
      drone.stop();
      for (const name of FX_VARIABLES) {
        for (const element of readers.get(name)) element.style.removeProperty(name);
      }
    };
    // The loop reads everything live through refs; it mounts once per window.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (typeof document === "undefined") return null;
  return createPortal(
    <div
      ref={overlayRef}
      className={`gx-fx gx-fx-${liveWindow.status}`}
      aria-hidden="true"
    >
      <div className="gx-fx-vignette" />
      <div className="gx-fx-border" />
      <div className="gx-fx-flash" />
    </div>,
    document.body,
  );
}
