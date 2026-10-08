import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { getCloseness, getGoodWindowMs, getHeartbeatBpm, getRemainingSeconds } from "./gauntletEngine.js";
import { playClockTick, playHeartbeat, startTensionDrone } from "./gauntletAudio.js";
import { FX_READERS, FX_VARIABLES, fxBeatPhaseValue, fxBeatValue, fxFlashValue, fxShake, registerFxVariables } from "./fxVariables.js";
import { createLightGate, monotonicNow } from "./timing.js";
import { getAccessibility } from "../state/accessibilitySettings.js";

/**
 * The body of the window: vignette, heartbeat, drone, shake -- and the beat.
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
 * The heartbeat is also the table's rhythm. This loop owns when each beat
 * lands and writes it into `beatClock` -- a ref the stage reads when a push is
 * pressed, so a press is graded against the beat the player heard and saw, not
 * against a second clock that could drift from it. A beat is stamped when it
 * reaches the ear: the output path's latency is added to the moment it was
 * scheduled (`playHeartbeat` reports it), which on a Bluetooth speaker is a
 * fifth of a second, more than the whole GOOD window. The approach ring, the
 * hit zone and the grade flash are CSS variables like the rest:
 * --gx-beat-phase (0 at a beat, 1 at the next), --gx-beat-live, --gx-beat-zone
 * (1 inside the GOOD window) and --gx-flash.
 *
 * What floods the screen pulses under three times a second. The pulse races to
 * 190 a minute next to the wall, and at that rate the vignette and the grade
 * flash were a full-screen red flash at 3.2Hz. The sound, the ring on the push
 * button and the grading keep every beat; the screen-wide pulse takes every
 * other one once the beat is faster than `PULSE_MIN_MS`. The hit zone is under
 * the same floor: it is a hard on and off -- a cyan ring and glow on four
 * buttons -- and it had been left out, so past 180 a minute it blinked faster
 * than three times a second for everyone, whatever they had turned down. It
 * lights on every other beat there, and a press on the unlit one grades the
 * same.
 *
 * Reduced motion removes travel -- the shake and the ring's closing scale --
 * and nothing else. The red closes in, the beat still thumps the vignette's
 * opacity, the bust still floods the screen: colour and sound are not motion.
 * The preference is followed live, not read once at mount.
 *
 * The comfort setting (`calmEffects`) turns the body down whatever the OS
 * says: no shake, the grade flash at a third, no beat pulse on the pot, the
 * clock and the heart, and the ring held closed as reduced motion holds it,
 * because a ring that snaps open on every beat is a blink at the beat's rate.
 *
 * The loop allocates nothing per frame: numbers are formatted only when they
 * change, and `write` skips a style write when the string is the same.
 */
const SHAKE_PX = 11;
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
/** 2.9 a second: the fastest anything screen-wide may pulse. */
const PULSE_MIN_MS = 345;
/** The most output latency a beat is moved by; past this the report is not believed. */
const LATENCY_MAX_MS = 400;
/** How often the loop looks for readers that mounted since it last looked. */
const READERS_REFRESH_MS = 400;
export function GauntletFx({ window: liveWindow, paused, impact, flash, beatClock, stageRef, grade = null, fever = false, wideBeat = false }) {
  const stateRef = useRef({ window: liveWindow, paused, wideBeat });
  const impactRef = useRef(0);
  const flashRef = useRef(0);
  const flashedAt = useRef(0);
  const overlayRef = useRef(null);

  useEffect(() => {
    stateRef.current = { window: liveWindow, paused, wideBeat };
  }, [liveWindow, paused, wideBeat]);

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
    const clock = beatClock?.current ?? { at: 0, period: 0 };
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
    // Beats that have been scheduled and not yet heard, oldest first. It was
    // one slot, overwritten by each new beat: with more output latency than
    // one beat lasts -- a Bluetooth speaker near the wall -- every beat was
    // replaced before its moment came, the clock was never stamped again, and
    // presses were graded against a beat long gone.
    const pending = [];
    const zoneGate = createLightGate(PULSE_MIN_MS);
    let lastTickSecond = -1;
    let droneAt = 0;
    let readersAt = 0;

    const loop = (time) => {
      const { window: win, paused: isPaused, wideBeat: wide } = stateRef.current;
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
      // The window's clock does not run in a hidden tab, so neither does the
      // rhythm a push is graded against.
      const beating = live && !document.hidden;

      // The beat is stamped when it actually sounds, not at the frame's nominal
      // start: on a starved main thread the callback runs well after `time`, and
      // a press on the beat the player heard would be graded early.
      const now = monotonicNow();
      if (live) {
        const bpm = getHeartbeatBpm(win.gauge, tellWall, win.schema.sedated, win.elapsed / win.schema.seconds);
        if (time >= nextBeat) {
          const latency = Math.min(LATENCY_MAX_MS, Math.max(0, playHeartbeat(heat)));
          nextBeat = time + 60000 / bpm;
          pending.push({ at: now + latency, period: 60000 / bpm, heat });
        }
        const remaining = Math.ceil(getRemainingSeconds(win));
        if (remaining <= 5 && remaining !== lastTickSecond) {
          lastTickSecond = remaining;
          playClockTick(remaining);
        }
      } else {
        nextBeat = time + 120;
        pending.length = 0;
      }
      while (pending.length > 0 && now >= pending[0].at) {
        const heard = pending.shift();
        clock.at = heard.at;
        clock.period = heard.period;
        if (now - pulsedAt >= PULSE_MIN_MS) {
          pulsedAt = now;
          beat = 1;
          impactRef.current = Math.min(1, impactRef.current + 0.04 + heard.heat * 0.12);
        }
      }
      if (!beating) clock.period = 0;
      if (time >= droneAt) {
        drone.set(live ? closeness : 0, win.schema.sedated);
        droneAt = time + 100;
      }

      let phase = 0;
      let inWindow = false;
      if (beating && clock.period > 0) {
        const since = Math.max(0, now - clock.at);
        phase = Math.min(1, since / clock.period);
        const offset = Math.min(since, Math.max(0, clock.period - since));
        inWindow = offset <= getGoodWindowMs(clock.period, wide);
      }
      const zone = zoneGate(inWindow, now);

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
      write("--gx-beat-phase", fxBeatPhaseValue(phase, reducedMotion, calm));
      write("--gx-beat-live", beating ? "1" : "0");
      write("--gx-beat-zone", zone ? "1" : "0");
      write("--gx-flash", fxFlashValue(flashRef.current, calm));
      frame = globalThis.requestAnimationFrame(loop);
    };
    frame = globalThis.requestAnimationFrame(loop);

    return () => {
      globalThis.cancelAnimationFrame(frame);
      motionQuery?.removeEventListener?.("change", onMotionChange);
      drone.stop();
      clock.period = 0;
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
      className={`gx-fx gx-fx-${liveWindow.status}${grade ? ` gx-fx-grade-${grade}` : ""}${fever ? " gx-fx-fever" : ""}`}
      aria-hidden="true"
    >
      <div className="gx-fx-vignette" />
      <div className="gx-fx-border" />
      <div className="gx-fx-flash" />
    </div>,
    document.body,
  );
}
