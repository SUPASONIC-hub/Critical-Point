import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

import { FX_READERS, FX_VARIABLES, fxBeatValue, fxFlashValue, fxRateStep, fxRateTarget, fxShake, fxTier, RATE_REST_BPM, RATE_SWEEP_MS, RATE_TOP_BPM } from "../../src/gauntlet/fxVariables.js";
import { BASE_SCHEMA, getHeartbeatBpm } from "../../src/gauntlet/gauntletEngine.js";
import { dangerZoneOf, readTableMeters } from "../../src/gauntlet/tableMeters.js";
import { zoneThudDue } from "../../src/gauntlet/zoneThud.js";

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

test("the tension steps read the gauge the table draws, and either setting takes them away", () => {
  // The lowest wall 56 and a step of up to 15: hot from 41, critical from 56.
  const at = (gauge, wall) => ({ gauge, wall, schema: { wallMin: 56, wallMax: 70, stepMax: 15 } });
  assert.equal(fxTier(at(40, 57), true, false, false), 0);
  assert.equal(fxTier(at(41, 57), true, false, false), 1);
  assert.equal(fxTier(at(56, 57), true, false, false), 2);
  // The wall itself is never read: a gauge a point under it is as cold as one far from it.
  assert.equal(fxTier(at(40, 41), true, false, false), fxTier(at(40, 70), true, false, false));
  // Off a live table, and under either setting, there is no step.
  for (const [live, reducedMotion, calm] of [[false, false, false], [true, true, false], [true, false, true]]) {
    assert.equal(fxTier(at(60, 61), live, reducedMotion, calm), 0);
  }
  const loop = readFileSync("src/gauntlet/GauntletFx.jsx", "utf8");
  const frame = loop.slice(loop.indexOf("const loop = "), loop.lastIndexOf("requestAnimationFrame(loop)"));
  assert.match(frame, /const tier = fxTier\(win, live, reducedMotion, calm\);/);
  assert.equal(frame.split('write("--gx-tier",').length - 1, 1, "written once a frame");
  assert.equal(FX_READERS["--gx-tier"], ".gx-gauge-track");
});

test("the step marker stays under either setting, where the steps go, and a quiet table has none (A1-1, E3)", () => {
  // The lowest wall 56 and a step of up to 15, as above; the 현재 위험 line the stage prints at each gauge.
  const schema = { ...BASE_SCHEMA, seconds: 45, wallMin: 56, wallMax: 70, stepMax: 15 };
  const zoneAt = (gauge) => {
    const win = { status: "live", gauge, wall: 60, tellOffset: 0, focus: 0, focusMode: "steady", elapsed: 0, schema };
    return dangerZoneOf(readTableMeters({ win, schema, selectedCard: null }).dangerLine);
  };
  assert.deepEqual([30, 41, 56].map(zoneAt), ["distance", "inReach", "inBand"]);
  for (const [reducedMotion, calm] of [[true, false], [false, true], [true, true]]) {
    // Under either setting the screen's step is gone...
    assert.equal(fxTier({ gauge: 60, schema }, true, reducedMotion, calm), 0);
    // ...and the marker, which asks neither, still sounds each step up.
    assert.equal(zoneThudDue(zoneAt(30), zoneAt(41)), true);
    assert.equal(zoneThudDue(zoneAt(41), zoneAt(56)), true);
  }
  assert.equal(zoneThudDue(zoneAt(56), zoneAt(41)), false, "nothing on the way down");
  assert.equal(zoneThudDue(zoneAt(30), zoneAt(56), true), false, "a quiet table has none");

  // The loop hands it the line's step and the quiet flag -- no setting -- and only while the table is live.
  const loop = readFileSync("src/gauntlet/GauntletFx.jsx", "utf8");
  const frame = loop.slice(loop.indexOf("const loop = "), loop.lastIndexOf("requestAnimationFrame(loop)"));
  const live = frame.slice(frame.indexOf("if (live) {"), frame.indexOf("} else {"));
  assert.match(live, /if \(zoneThudDue\(zoneSeen, zone, quiet\)\) playZoneThud\(\);\s+zoneSeen = zone;/);
  assert.equal(frame.split("playZoneThud(").length - 1, 1);
  assert.match(readFileSync("src/gauntlet/GauntletStage.jsx", "utf8"), /<GauntletFx[^>]*zone=\{dangerZoneOf\(dangerLine\)\}/s);
});

test("the frame loop reads the setting every frame and writes what those three return", () => {
  const loop = readFileSync("src/gauntlet/GauntletFx.jsx", "utf8");
  const frame = loop.slice(loop.indexOf("const loop = "), loop.lastIndexOf("requestAnimationFrame(loop)"));
  assert.ok(frame.length > 500, "the loop's body was found");
  // Inside the loop, so a setting changed mid-window takes hold on the next frame.
  assert.match(frame, /const calm = quiet \|\| getAccessibility\(\)\.calmEffects;/);
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
  assert.deepEqual(FX_VARIABLES, ["--gx-heat", "--gx-beat", "--gx-shake-x", "--gx-shake-y", "--gx-flash", "--gx-rate", "--gx-tier"]);
  const loop = readFileSync("src/gauntlet/GauntletFx.jsx", "utf8");
  for (const gone of ["--gx-beat-phase", "--gx-beat-live", "--gx-beat-zone", "beatClock", "getGoodWindowMs", "pending", "LATENCY"]) {
    assert.equal(loop.includes(gone), false, `the frame loop no longer has ${gone}`);
  }
  // The heart still sounds on its own tempo, and the vignette still takes the beat.
  const frame = loop.slice(loop.indexOf("const loop = "), loop.lastIndexOf("requestAnimationFrame(loop)"));
  assert.match(frame, /playHeartbeat\(heat, tier, hesitationSwell\(held, now\)\);\s+nextBeat = time \+ 60000 \/ bpm;/);
  assert.match(frame, /if \(now - pulsedAt >= PULSE_MIN_MS\)/, "under three screen-wide pulses a second, as before");
  assert.match(FX_READERS["--gx-beat"], /\.gx-fx-vignette/);
  const css = ["play", "responsive", "comfort", "plate", "relics", "briefing", "result", "base-intro-ranking", "recovery"].map((name) => readFileSync(`src/styles/app/${name}.css`, "utf8")).join(" ");
  const source = ["GauntletStage.jsx", "GauntletFx.jsx", "GauntletHand.jsx", "TableNotices.jsx", "StanceRow.jsx"].map((name) => readFileSync(`src/gauntlet/${name}`, "utf8")).join(" ");
  for (const gone of ["gx-beat-ring", "gx-grade", "gx-combo", "is-fever", "gx-fx-fever", "gx-fx-grade", "is-jammed", "gx-focus-reticle", "gx-groove", "--gx-beat-zone", "--gx-beat-phase", "--gx-beat-live"]) {
    assert.equal(css.includes(gone), false, `no sheet styles ${gone}`);
    assert.equal(source.includes(gone), false, `and nothing on the table draws ${gone}`);
  }
  assert.equal(existsSync("src/gauntlet/timing.js"), false, "the module that graded a press is gone, and its clock is the frame loop's");
  assert.match(loop, /monotonicNow, registerFxVariables \} from "\.\/fxVariables\.js"/);
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

/*
 * The collapse (A2, 2026-11-05): a bust stops the heart on the frame the slam
 * lands. The tick light goes dark at once rather than drifting down over the
 * sweep, the number beside the gauge reads "—", the drone is let down over
 * 0.6 s instead of 0.25 (a slower gain curve and nothing else: no new voice,
 * no pitch move, nothing summed into the drive), the table stands on its last
 * frame for a quarter second before it greys, and one line under the pot
 * says the moment in each language.
 */
test("a bust stops the heart: the light goes dark on that frame and the number reads —", () => {
  for (const bpm of [RATE_REST_BPM, 125, RATE_TOP_BPM]) assert.equal(fxRateTarget(bpm, "bust"), 0, `dark at ${bpm}`);
  assert.equal(fxRateTarget(125, "live"), 0.5, "a live table reads the pulse as before");
  assert.equal(fxRateTarget(125), 0.5, "and so does a call that names no status");
  assert.equal(fxRateStep(1, 0, 16, "bust"), 0, "no drift: dark on the frame");
  assert.equal(fxRateStep(0.3, 0, 16, "bust"), 0);
  assert.ok(fxRateStep(1, 0, 16, "live") > 0.9, "a live table still drifts");
  const win = { status: "bust", gauge: 72, wall: 70, tellOffset: 0, focus: 0, focusMode: "steady", elapsed: 12, schema: { ...BASE_SCHEMA, seconds: 45 } };
  assert.equal(readTableMeters({ win, schema: win.schema, selectedCard: null }).bpm, "—");
  assert.equal(typeof readTableMeters({ win: { ...win, status: "live" }, schema: win.schema, selectedCard: null }).bpm, "number");
});

test("a bust lets the drone down over 0.6 s, through the same gain and nothing new", () => {
  // The drone lives in tensionDrone.js since the mood voicings (#458).
  const audio = readFileSync("src/gauntlet/tensionDrone.js", "utf8");
  assert.match(audio, /export const DRONE_FADE_S = 0\.25;/);
  assert.match(audio, /export const DRONE_STILL_FADE_S = 0\.6;/);
  const drone = audio.slice(audio.indexOf("set(closeness = 0"), audio.indexOf("    stop() {"));
  assert.match(drone, /set\(closeness = 0, sedated = false, still = false\) \{/);
  assert.match(drone, /master\.gain\.setTargetAtTime\(level, now, still \? DRONE_STILL_FADE_S : DRONE_FADE_S\);/, "the fade is the gain's time constant, the level is the same");
  // The filter and the detune follow as they did: no pitch move on the bust.
  assert.match(drone, /entry\.filter\.frequency\.setTargetAtTime\(entry\.voicing\.floor \+ read \* 1400, now, 0\.3\);/);
  assert.match(drone, /current\.voices\.at\(-1\)\.detune\.setTargetAtTime\(read \* 60, now, 0\.4\);/);
  assert.equal((drone.match(/still/g) ?? []).length, 2, "the bust reaches only the signature and the master's time constant");
  assert.doesNotMatch(drone, /createOscillator\(\)/, "no voice is added for the bust");
  // The frame loop names the bust when it drives the drone.
  const loop = readFileSync("src/gauntlet/GauntletFx.jsx", "utf8");
  assert.match(loop, /drone\.set\(live && !quiet \? closeness : 0, win\.schema\.sedated, win\.status === "bust"\);/);
});

test("the table stands on its last frame for a quarter second before it greys, and the moment has one line", () => {
  const rule = sheet("play").match(/\.gauntlet-stage\.is-bust \.gx-table \{([^}]*)\}/)?.[1] ?? "";
  assert.match(rule, /filter: grayscale\(0\.9\) brightness\(0\.6\);/);
  assert.match(rule, /transition: filter 0\.25s 0\.25s;/, "a quarter second still, then a quarter second to grey");
  // Reduced motion collapses both quarters with every transition on the page.
  const reduced = reducedMotionBlock(sheet("responsive"));
  assert.match(reduced, /transition-duration: 1ms !important;/);
  assert.match(reduced, /transition-delay: 0s !important;/);
  // The line: plain text under the pot's pill, with no rule of its own (the
  // sheet is at its budget; `small` and the inherited paper are the look), in
  // the three languages.
  assert.doesNotMatch(sheet("play"), /\.gx-slam small/);
  assert.match(readFileSync("src/gauntlet/TableNotices.jsx", "utf8"), /<small>\{say\.slamStill\}<\/small>/);
  assert.match(readFileSync("src/copy/table.js", "utf8"), /slamStill: "심장이 멈춘 자리에서 벽이 드러났다\."/);
  assert.match(readFileSync("src/locales/en/screens/table.js", "utf8"), /slamStill: "The wall showed where the heartbeat stopped\."/);
  assert.match(readFileSync("src/locales/ja/screens/table.js", "utf8"), /slamStill: "鼓動が止まった場所に、壁が現れた。"/);
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
  assert.match(frame, /rate = fxRateStep\(rate, fxRateTarget\(bpm, win\.status\), delta, win\.status\);/);
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

test("the cases where the season rests play a quiet table, and the table is the same table (B-13, C-10)", async () => {
  const { QUIET_TABLE_CASES, isQuietTable } = await import("../../src/gauntlet/fxVariables.js");
  const { CASE_SEQUENCE } = await import("../../src/gameCases.js");
  // B-13: the night off at 경포, the funeral, the 추석 kitchen -- and no other case.
  // C-10: and each act's first case (B-11's act cards), where an act opens at rest after the last one's peak.
  const { ACT_START_CASES } = await import("../../src/gauntlet/actCardGate.js");
  const { PEAK_CASES } = await import("../../src/gauntlet/tableUnlocks.js");
  const rests = ["case42", "case45", "case47"];
  assert.deepEqual(CASE_SEQUENCE.filter(isQuietTable), CASE_SEQUENCE.filter((caseId) => rests.includes(caseId) || ACT_START_CASES.includes(caseId)));
  assert.equal(QUIET_TABLE_CASES.length, rests.length + ACT_START_CASES.length);
  assert.ok(!PEAK_CASES.some(isQuietTable), "no case is both a peak and a rest");
  assert.equal(isQuietTable(undefined), false);

  // The frame loop plays it as the comfort setting, and keeps the heartbeat and the drone out of the ear.
  const fx = readFileSync("src/gauntlet/GauntletFx.jsx", "utf8");
  assert.match(fx, /const calm = quiet \|\| getAccessibility\(\)\.calmEffects;/);
  assert.match(fx, /if \(!quiet\) playHeartbeat\(heat, tier, hesitationSwell\(held, now\)\);/);
  assert.match(fx, /drone\.set\(live && !quiet \? closeness : 0, win\.schema\.sedated, win\.status === "bust"\);/);
  assert.match(readFileSync("src/gauntlet/GauntletStage.jsx", "utf8"), /<GauntletFx[^>]*caseId=\{scene\.node\.caseId\}/s);

  // Nothing else reads it: the wall, the pot and the verdict of a quiet table are
  // the bytes they were, because no rule, no engine step and no state knows it.
  const { readdirSync } = await import("node:fs");
  const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => (entry.isDirectory() ? walk(`${dir}/${entry.name}`) : [`${dir}/${entry.name}`]));
  const readers = walk("src").filter((file) => /\.(js|jsx)$/.test(file) && /isQuietTable|QUIET_TABLE_CASES/.test(readFileSync(file, "utf8")));
  assert.deepEqual(readers.sort(), ["src/gauntlet/GauntletFx.jsx", "src/gauntlet/fxVariables.js"]);
});
