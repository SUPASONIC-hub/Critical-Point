import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { getCloseness, getHeartbeatBpm, getRemainingSeconds, getWindowSeconds } from "./gauntletEngine.js";
import { playClockTick, playHeartbeat, playZoneThud, startTensionDrone } from "./gauntletAudio.js";
import { zoneThudDue } from "./zoneThud.js";
import { HESITATION_IDLE, hesitationKey, hesitationSwell, stepHesitation } from "./heartbeat.js";
import { FX_READERS, FX_VARIABLES, fxBeatValue, fxFlashValue, fxRateStep, fxRateTarget, fxShake, fxTier, isQuietTable, monotonicNow, registerFxVariables } from "./fxVariables.js";
import { getAccessibility, useAccessibility } from "../state/accessibilitySettings.js";
import { edgeAlertLevel, edgeAlertPulses } from "./edgeAlert.js";
import { setMusicStake } from "../components/AdaptiveMusic.jsx";

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
 * Reduced motion removes travel -- the shake -- and, since 2026-10-14, the
 * tension steps below, and nothing else. The red
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
 * The steps (`fxTier`, 2026-10-14): as the gauge the table shows comes
 * within a push of the band, and again inside it, the gauge's glow steps up
 * (--gx-tier), the heartbeat lifts a little in pitch and its second beat comes
 * a little sooner, and in the band the table trembles by `TREMOR_PX`. The
 * tempo -- the number beside the gauge -- is the engine's and is not touched.
 * All three are read off what is drawn, never the wall, and both settings
 * take all three away; the sound goes only where the heartbeat already goes.
 *
 * A quiet table (`isQuietTable`, B-13) is a case where the season rests -- a
 * night off, a funeral, a holiday. Its tables play as the comfort setting does
 * and without the heartbeat or the drone in the ear: no shake, no pulse, no
 * steps. The tick light and the clock stay, and the table is the same table:
 * nothing here reaches the engine, so the wall, the pot and the verdict of a
 * quiet table are what they were (tests/unit/table-motion.test.mjs).
 *
 * The step marker (zoneThud.js, A1-1 · E3, 2026-11-12): as the 현재 위험 line
 * the stage prints steps up (`zone`, tableMeters.js `dangerZoneOf`), one low
 * thud, once. It reads the line, not `fxTier`, so neither setting reaches it;
 * a quiet table keeps it out of the ear as it keeps the heartbeat out.
 *
 * The hesitation swell (heartbeat.js, A1-2, 2026-11-12): a card staked and
 * nothing else pressed for over 3 s, and the heartbeat grows in volume only,
 * over 8 s, to +20%. `hold` is the held 확정's phase, so a press on 확정 that
 * has not finished is a press too. The beat's count, its tempo and every
 * number drawn stay as they were.
 *
 * The score hears the table too (`setMusicStake`, 2026-11-02): as the gauge
 * the table shows climbs, AdaptiveMusic brings in up to three layers over
 * the mode's own lead (musicScore.js, `STAKE_LAYER_GAUGES`), and lets them go
 * when the window closes. Like the steps it reads what is drawn, not the wall.
 *
 * The crisis edge (edgeAlert.js, A5, 2026-11-13): with its comfort switch
 * on, the screen's edges breathe as the same line steps up. It is drawn by
 * React off `zone`, not by the loop: the line changes a few times a window.
 * Reduced motion is CSS's to answer; the comfort setting and a quiet table
 * hold it still here.
 *
 * The loop allocates nothing per frame: numbers are formatted only when they
 * change, and `write` skips a style write when the string is the same.
 */
const SHAKE_PX = 11;
/** The critical tier's tremor: felt, and too small to lose a line of text to. */
const TREMOR_PX = 1.5;
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
/** 2.9 a second: the fastest anything screen-wide may pulse. */
const PULSE_MIN_MS = 345;
/** How often the loop looks for readers that mounted since it last looked. */
const READERS_REFRESH_MS = 400;
export function GauntletFx({ window: liveWindow, paused, impact, flash, stageRef, caseId, zone = "", hold = "" }) {
  const stateRef = useRef({ window: liveWindow, paused, quiet: isQuietTable(caseId), zone, hold });
  const impactRef = useRef(0);
  const flashRef = useRef(0);
  const flashedAt = useRef(0);
  const overlayRef = useRef(null);
  const { crisisEdge, calmEffects } = useAccessibility();
  const edge = edgeAlertLevel({ enabled: crisisEdge, zone, live: liveWindow.status === "live" && !paused });

  useEffect(() => {
    stateRef.current = { window: liveWindow, paused, quiet: isQuietTable(caseId), zone, hold };
  }, [liveWindow, paused, caseId, zone, hold]);

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
    // The 현재 위험 step the last live frame stood on; "" until the first one.
    let zoneSeen = "";
    // How long the staked card has been held with nothing else pressed.
    let held = HESITATION_IDLE;
    let readersAt = 0;

    const loop = (time) => {
      const { window: win, paused: isPaused, quiet, zone, hold } = stateRef.current;
      const delta = last ? Math.min(64, time - last) : 16;
      last = time;
      if (time >= readersAt) {
        findReaders();
        readersAt = time + READERS_REFRESH_MS;
      }
      const live = win.status === "live" && !isPaused;
      const calm = quiet || getAccessibility().calmEffects;
      const tier = fxTier(win, live, reducedMotion, calm);
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
      const bpm = getHeartbeatBpm(win.gauge, tellWall, win.schema.sedated, win.elapsed / getWindowSeconds(win));
      rate = fxRateStep(rate, fxRateTarget(bpm, win.status), delta, win.status);
      held = stepHesitation(held, hesitationKey(win, hold), live, now);
      if (live) {
        if (time >= nextBeat) {
          if (!quiet) playHeartbeat(heat, tier, hesitationSwell(held, now));
          nextBeat = time + 60000 / bpm;
          if (now - pulsedAt >= PULSE_MIN_MS) {
            pulsedAt = now;
            beat = 1;
            impactRef.current = Math.min(1, impactRef.current + 0.04 + heat * 0.12);
          }
        }
        if (zoneThudDue(zoneSeen, zone, quiet)) playZoneThud();
        zoneSeen = zone;
        const remaining = Math.ceil(getRemainingSeconds(win));
        if (remaining <= 5 && remaining !== lastTickSecond) {
          lastTickSecond = remaining;
          playClockTick(remaining);
        }
      } else {
        nextBeat = time + 120;
      }
      if (time >= droneAt) {
        // A bust lets the drone down slowly (A2): the room tone fades over 0.6 s, not 0.25.
        drone.set(live && !quiet ? closeness : 0, win.schema.sedated, win.status === "bust");
        // The score's layers follow the gauge the table shows, never the
        // wall, and a quiet table keeps them out as it keeps the drone out.
        setMusicStake(live && !quiet ? win.gauge : 0);
        droneAt = time + 100;
      }

      beat = Math.max(0, beat - delta / 260);
      impactRef.current = Math.max(0, impactRef.current - delta / 480);
      flashRef.current = Math.max(0, flashRef.current - delta / 240);
      const trauma = Math.min(1, impactRef.current + (live ? Math.pow(felt, 3) * 0.45 : 0));
      const shake = fxShake(trauma, reducedMotion, calm);
      const x = (Math.sin(time * 0.071) + Math.sin(time * 0.137)) * 0.5 * shake * SHAKE_PX;
      const y = (Math.sin(time * 0.089) + Math.sin(time * 0.173)) * 0.5 * shake * SHAKE_PX * 0.6;

      write("--gx-heat", heat.toFixed(3));
      write("--gx-beat", fxBeatValue(beat, calm));
      const tremor = tier === 2 ? TREMOR_PX : 0;
      write("--gx-shake-x", `${(x + Math.sin(time * 0.031) * tremor).toFixed(2)}px`);
      write("--gx-shake-y", `${(y + Math.sin(time * 0.043) * tremor * 0.6).toFixed(2)}px`);
      write("--gx-flash", fxFlashValue(flashRef.current, calm));
      write("--gx-rate", rate.toFixed(2));
      write("--gx-tier", String(tier));
      frame = globalThis.requestAnimationFrame(loop);
    };
    frame = globalThis.requestAnimationFrame(loop);

    return () => {
      globalThis.cancelAnimationFrame(frame);
      motionQuery?.removeEventListener?.("change", onMotionChange);
      drone.stop();
      setMusicStake(0);
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
      {edge ? (
        <div
          className={`gx-fx-edge${edgeAlertPulses({ calm: calmEffects, quiet: isQuietTable(caseId) }) ? " is-pulsing" : ""}`}
          data-level={edge}
          data-testid="crisis-edge"
        />
      ) : null}
    </div>,
    document.body,
  );
}
