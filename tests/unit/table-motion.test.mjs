import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { FX_READERS, FX_VARIABLES, fxBeatValue, fxFlashValue, fxRateStep, fxRateTarget, fxShake, RATE_REST_BPM, RATE_SWEEP_MS, RATE_TOP_BPM } from "../../src/gauntlet/fxVariables.js";
import { getHeartbeatBpm } from "../../src/gauntlet/gauntletEngine.js";

test("the comfort setting stills the shake and the pulse, and leaves a third of the flash", () => {
  // Trauma at its ceiling, a beat just struck, a bust's flash.
  const [trauma, beat, flash] = [1, 1, 0.9];

  // Neither setting: the frame is what the loop measured.
  assert.equal(fxShake(trauma, false, false), 1);
  assert.equal(fxShake(0.5, false, false), 0.25, "the shake is the square of what was felt");
  assert.equal(fxBeatValue(beat, false), "1.000");
  assert.equal(fxFlashValue(flash, false), "0.90");

  // The comfort setting: nothing moves and nothing pulses, and the flash is a third.
  assert.equal(fxShake(trauma, false, true), 0);
  assert.equal(fxBeatValue(beat, true), "0.000");
  assert.equal(fxFlashValue(flash, true), "0.30");
  assert.equal(fxFlashValue(0, true), "0.00");

  // The OS's reduced motion alone stills what moves, and leaves light as it was.
  assert.equal(fxShake(trauma, true, false), 0);
  assert.equal(fxBeatValue(beat, false), "1.000");
  assert.equal(fxFlashValue(flash, false), "0.90");
});

test("the frame loop reads the setting every frame and writes what those three return", () => {
  const loop = readFileSync("src/gauntlet/GauntletFx.jsx", "utf8");
  const frame = loop.slice(loop.indexOf("const loop = "), loop.lastIndexOf("requestAnimationFrame(loop)"));
  assert.ok(frame.length > 500, "the loop's body was found");
  // Inside the loop, so a setting changed mid-window takes hold on the next frame.
  assert.match(frame, /const calm = getAccessibility\(\)\.calmEffects;/);
  assert.match(frame, /const shake = fxShake\(trauma, reducedMotion, calm\);/);
  assert.match(frame, /write\("--gx-beat", fxBeatValue\(beat, calm\)\);/);
  assert.match(frame, /write\("--gx-flash", fxFlashValue\(flashRef\.current, calm\)\);/);
  // Both axes of the shake are that one number, so a still shake is still on both.
  assert.match(frame, /0\.5 \* shake \* SHAKE_PX;/);
  assert.match(frame, /0\.5 \* shake \* SHAKE_PX \* 0\.6;/);
  // And none of them is also written raw, past the setting.
  for (const name of ["--gx-beat", "--gx-flash", "--gx-shake-x", "--gx-shake-y"]) {
    assert.equal(frame.split(`write("${name}",`).length - 1, 1, `${name} is written once a frame`);
  }
});

/**
 * The beat is gone from the table, and with it everything that judged a press
 * or showed where one would land: the approach ring, the hit zone, the grade
 * that rose off the button, the combo and its fever. The heartbeat is left as
 * pressure -- the sound, the number, the vignette and the tick light.
 */

test("nothing on the table marks a beat to press on, and the pulse is still written", () => {
  assert.deepEqual(FX_VARIABLES, ["--gx-heat", "--gx-beat", "--gx-shake-x", "--gx-shake-y", "--gx-flash", "--gx-rate"]);
  const loop = readFileSync("src/gauntlet/GauntletFx.jsx", "utf8");
  for (const gone of ["--gx-beat-phase", "--gx-beat-live", "--gx-beat-zone", "beatClock", "getGoodWindowMs", "pending", "LATENCY"]) {
    assert.equal(loop.includes(gone), false, `the frame loop no longer has ${gone}`);
  }
  // The heart still sounds on its own tempo, and the vignette still takes the beat.
  const frame = loop.slice(loop.indexOf("const loop = "), loop.lastIndexOf("requestAnimationFrame(loop)"));
  assert.match(frame, /playHeartbeat\(heat\);\s+nextBeat = time \+ 60000 \/ bpm;/);
  assert.match(frame, /if \(now - pulsedAt >= PULSE_MIN_MS\)/, "under three screen-wide pulses a second, as before");
  assert.match(FX_READERS["--gx-beat"], /\.gx-fx-vignette/);
  const css = ["play", "responsive", "comfort", "plate", "relics", "briefing", "result", "base-intro-ranking", "recovery"].map((name) => readFileSync(`src/styles/app/${name}.css`, "utf8")).join(" ");
  const source = ["GauntletStage.jsx", "GauntletFx.jsx", "GauntletHand.jsx", "TableNotices.jsx", "StanceRow.jsx"].map((name) => readFileSync(`src/gauntlet/${name}`, "utf8")).join(" ");
  for (const gone of ["gx-beat-ring", "gx-grade", "gx-combo", "is-fever", "gx-fx-fever", "gx-fx-grade", "is-jammed", "gx-focus-reticle", "gx-groove", "--gx-beat-zone", "--gx-beat-phase", "--gx-beat-live"]) {
    assert.equal(css.includes(gone), false, `no sheet styles ${gone}`);
    assert.equal(source.includes(gone), false, `and nothing on the table draws ${gone}`);
  }
  const timing = readFileSync("src/gauntlet/timing.js", "utf8");
  assert.deepEqual(timing.match(/export const (\w+)/g), ["export const monotonicNow"], "the module that graded a press is left with the clock");
});

const sheet = (name) => readFileSync(`src/styles/app/${name}.css`, "utf8");
const reducedMotionBlock = (css) => css.slice(css.lastIndexOf("@media (prefers-reduced-motion: reduce)"));

/**
 * The heartbeat with the sound off and the comfort setting on: the number
 * beside the gauge, and the gauge's ticks, which are lit by how fast the pulse
 * is. Neither is a pulse. The light is a level that moves slowly, so it stays
 * when everything that blinks has been turned down.
 */

test("the tick light reads the pulse's whole range, from rest to the fastest it goes", () => {
  assert.equal(fxRateTarget(RATE_REST_BPM), 0);
  assert.equal(fxRateTarget(RATE_TOP_BPM), 1);
  assert.equal(fxRateTarget(125), 0.5);
  assert.equal(fxRateTarget(30), 0, "never under dark");
  assert.equal(fxRateTarget(400), 1, "never over full");
  assert.equal(fxRateTarget(Number.NaN), 0);
  for (let bpm = RATE_REST_BPM; bpm < RATE_TOP_BPM; bpm += 1) assert.ok(fxRateTarget(bpm + 1) > fxRateTarget(bpm), `brighter at ${bpm + 1} than at ${bpm}`);
  // The two ends are the engine's own: an idle window at the start, and the wall touched.
  assert.equal(getHeartbeatBpm(0, 100, false, 0), RATE_REST_BPM);
  assert.equal(getHeartbeatBpm(100, 100, false, 1), RATE_TOP_BPM);
  // SILENCE hides the number and keeps a pulse, which the light follows as the sound does.
  assert.ok(fxRateTarget(getHeartbeatBpm(0, 100, true, 0)) > 0);
});

test("the tick light starts where the pulse is and then only drifts", () => {
  assert.equal(fxRateStep(-1, 0.4, 16), 0.4, "a table that has just opened is not faded in");
  assert.equal(fxRateStep(0.4, 0.4, 16), 0.4);
  const step = 16 / RATE_SWEEP_MS;
  assert.ok(Math.abs(fxRateStep(0, 1, 16) - step) < 1e-12);
  assert.ok(Math.abs(fxRateStep(1, 0, 16) - (1 - step)) < 1e-12);
  assert.equal(fxRateStep(0.5, 0.5 + step / 2, 16), 0.5 + step / 2, "it stops on the pulse, never past it");
  assert.equal(fxRateStep(0.5, 1, 0), 0.5);
  assert.equal(fxRateStep(0.5, 1, -40), 0.5, "a clock that ran backwards moves nothing");
  // From dark to full takes the whole sweep, however far the pulse jumped.
  let rate = 0;
  let elapsed = 0;
  while (rate < 1) {
    rate = fxRateStep(rate, 1, 16);
    elapsed += 16;
  }
  assert.ok(elapsed >= RATE_SWEEP_MS && elapsed <= RATE_SWEEP_MS + 16, `full after ${elapsed}ms`);
});

test("the tick light cannot flash, whatever the pulse does", () => {
  const rule = sheet("play").match(/\.gx-gauge-ticks \{([^}]*)\}/)?.[1] ?? "";
  const brightest = Number(rule.match(/opacity: calc\(var\(--gx-rate, 0\) \* ([\d.]+)\);/)?.[1]);
  assert.ok(brightest > 0 && brightest <= 0.5, `the ticks are a faint light at their brightest: ${brightest}`);
  assert.doesNotMatch(rule, /animation|transition/, "the frame loop is the only thing that moves it");

  // A flash is a pair of opposing changes of a tenth of full brightness or
  // more, and three a second is the line (WCAG 2.3.1). The worst pulse there
  // could be -- one that jumps from rest to full and back, at any rate -- is
  // fed to the light, and the most its brightness travels in any one second is
  // measured. Under three tenths, there is no room in a second for three
  // changes of a tenth: at most one flash, where three would be the limit.
  let worst = 0;
  for (const flipMs of [16, 48, 100, 166, 250, 345, 500, 1000, 2000]) {
    let rate = 0;
    const travelled = [];
    for (let time = 0; time < 12_000; time += 16) {
      const next = fxRateStep(rate, Math.floor(time / flipMs) % 2 === 0 ? 1 : 0, 16);
      travelled.push(Math.abs(next - rate) * brightest);
      rate = next;
    }
    const perSecond = Math.ceil(1000 / 16);
    for (let start = 0; start + perSecond <= travelled.length; start += 1) {
      let sum = 0;
      for (let index = start; index < start + perSecond; index += 1) sum += travelled[index];
      worst = Math.max(worst, sum);
    }
  }
  assert.ok(worst > 0.1, `the pulse was able to move the light: ${worst.toFixed(3)}`);
  assert.ok(worst < 0.3, `the light travelled ${worst.toFixed(3)} of full brightness in one second`);
});

test("neither setting reaches the tick light or the number", () => {
  const loop = readFileSync("src/gauntlet/GauntletFx.jsx", "utf8");
  const frame = loop.slice(loop.indexOf("const loop = "), loop.lastIndexOf("requestAnimationFrame(loop)"));
  // The pulse is read on every frame, live or not, as the number beside it is.
  assert.match(frame, /rate = fxRateStep\(rate, fxRateTarget\(bpm\), delta\);/);
  assert.match(frame, /write\("--gx-rate", rate\.toFixed\(2\)\);/);
  assert.equal(frame.split('write("--gx-rate",').length - 1, 1, "written once a frame");
  assert.equal(FX_READERS["--gx-rate"], ".gx-gauge-ticks");
  // The comfort sheet and the reduced-motion blocks leave both alone.
  assert.doesNotMatch(sheet("comfort"), /gx-gauge-ticks|gx-bpm|gx-gauge-read/);
  for (const name of ["play", "responsive"]) {
    assert.doesNotMatch(reducedMotionBlock(sheet(name)).split(/\n\}\n/)[0], /gx-gauge-ticks|\.gx-bpm(?! svg)|gx-gauge-read/, `${name}.css, under reduced motion`);
  }
  // The stage prints the number in a row of its own, outside the meter: a
  // meter's children are not read out, and the row is no live region.
  const stage = readFileSync("src/gauntlet/GauntletStage.jsx", "utf8");
  const meter = stage.slice(stage.indexOf('role="meter"'), stage.indexOf('className="gx-gauge-read"'));
  assert.match(meter, /className="gx-gauge-ticks" aria-hidden="true"/);
  assert.doesNotMatch(meter, /gx-bpm/);
  const row = stage.slice(stage.indexOf('className="gx-gauge-read"'), stage.indexOf('<header className="gx-scene">'));
  assert.match(row, /className="gx-bpm" data-testid="gauntlet-bpm"/);
  assert.doesNotMatch(row, /aria-live|role="(status|timer|alert|log)"/);
});

test("a fade that stands in for a motion keeps its length under reduced motion and the calm setting", () => {
  // responsive.css gives every animation 1ms under reduced motion. A fade that
  // is the element's whole time on screen has to say its own length, louder.
  assert.match(sheet("responsive"), /animation-duration: 1ms !important/, "the rule these two answer is still there");
  const toast = reducedMotionBlock(sheet("relics")).match(/\.gx-equip-toast \{([^}]*)\}/)?.[1] ?? "";
  assert.match(toast, /animation: gx-relic-fade 1\.4s both !important/);

  // The calm setting stops the table's keyframes with `animation: none`, which
  // would zero a duration too: the fade is left out of it and renamed.
  const comfort = sheet("comfort");
  const stopped = comfort.match(/([^{}]*)\{\s*animation: none;\s*\}/g)?.find((rule) => rule.includes(".gauntlet-stage")) ?? "";
  assert.match(stopped, /:root\[data-calm-effects\] \.gauntlet-stage :not\([^)]*\.gx-equip-toast[^)]*\)/);
  assert.match(comfort, /:root\[data-calm-effects\] \.gx-equip-toast \{\s*animation-name: gx-relic-fade;\s*\}/);
  assert.match(sheet("relics"), /@keyframes gx-relic-fade/);
  assert.doesNotMatch(sheet("play"), /animation: (clue-stamp|reveal-in)/, "no animation names a keyframe that does not exist");
});
