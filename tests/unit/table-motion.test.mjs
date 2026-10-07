import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { getGoodWindowMs } from "../../src/gauntlet/gauntletEngine.js";
import { createLightGate } from "../../src/gauntlet/timing.js";

/**
 * What the table may flash and what it must leave on screen, as far as that
 * can be held without a browser: how often the hit zone lights, and that a
 * fade standing in for a motion is not shortened to nothing by the rule that
 * shortens every animation (the 2026-10-07 audit, B1 findings 1, 2 and 9).
 */

test("the hit zone lights under three times a second at any tempo", () => {
  const FLOOR_MS = 345;
  const simulate = (bpm, beats = 24) => {
    const period = 60000 / bpm;
    const good = getGoodWindowMs(period);
    const gate = createLightGate(FLOOR_MS);
    const onsets = [];
    let lit = false;
    let shortest = Infinity;
    let litSince = 0;
    // Starts between two beats, so the first window is a whole one.
    for (let now = Math.round(period / 2); now < period * beats; now += 4) {
      const phase = now % period;
      const wanted = Math.min(phase, period - phase) <= good;
      const next = gate(wanted, now);
      if (next && !lit) {
        onsets.push(now);
        litSince = now;
      }
      if (!next && lit) shortest = Math.min(shortest, now - litSince);
      assert.ok(!next || wanted, "the zone never lights outside the window it marks");
      lit = next;
    }
    return { period, good, onsets, shortest };
  };

  // 190 a minute is 3.17 beats a second: the zone takes every other beat.
  const fast = simulate(190);
  const fastGaps = fast.onsets.slice(1).map((at, index) => at - fast.onsets[index]);
  assert.ok(fast.onsets.length >= 10);
  assert.ok(Math.min(...fastGaps) >= FLOOR_MS, `lit ${Math.min(...fastGaps)}ms apart at 190bpm`);
  assert.ok(Math.max(...fastGaps) <= fast.period * 2 + 8, "and no slower than every other beat");
  // A turn that is lit is lit whole, never cut short by the gate.
  assert.ok(fast.shortest >= fast.good * 2 - 8);

  // At 150 a minute a beat is 400ms: every beat lights, as before.
  const slow = simulate(150);
  const slowGaps = slow.onsets.slice(1).map((at, index) => at - slow.onsets[index]);
  assert.ok(slowGaps.every((gap) => Math.abs(gap - slow.period) <= 8), "every beat lights at 150bpm");

  for (const bpm of [181, 185, 200, 240]) {
    const { onsets } = simulate(bpm);
    const gaps = onsets.slice(1).map((at, index) => at - onsets[index]);
    assert.ok(Math.min(...gaps) >= FLOOR_MS, `${bpm}bpm lit ${Math.min(...gaps)}ms apart`);
  }
});

const sheet = (name) => readFileSync(`src/styles/app/${name}.css`, "utf8");
const reducedMotionBlock = (css) => css.slice(css.lastIndexOf("@media (prefers-reduced-motion: reduce)"));

test("a fade that stands in for a motion keeps its length under reduced motion and the calm setting", () => {
  // responsive.css gives every animation 1ms under reduced motion. A fade that
  // is the element's whole time on screen has to say its own length, louder.
  assert.match(sheet("responsive"), /animation-duration: 1ms !important/, "the rule these two answer is still there");
  const grade = reducedMotionBlock(sheet("play")).match(/\.gx-grade \{([^}]*)\}/)?.[1] ?? "";
  assert.match(grade, /animation-name: gx-grade-fade/);
  assert.match(grade, /animation-duration: 0\.7s !important/);
  const toast = reducedMotionBlock(sheet("relics")).match(/\.gx-equip-toast \{([^}]*)\}/)?.[1] ?? "";
  assert.match(toast, /animation: gx-relic-fade 1\.4s both !important/);

  // The calm setting stops the table's keyframes with `animation: none`, which
  // would zero a duration too: the two fades are left out of it and renamed.
  const comfort = sheet("comfort");
  const stopped = comfort.match(/([^{}]*)\{\s*animation: none;\s*\}/g)?.find((rule) => rule.includes(".gauntlet-stage")) ?? "";
  assert.match(stopped, /:root\[data-calm-effects\] \.gauntlet-stage :not\([^)]*\.gx-grade[^)]*\.gx-equip-toast[^)]*\)/);
  assert.match(comfort, /:root\[data-calm-effects\] :is\(\.gx-grade, \.gx-equip-toast\) \{\s*animation-name: gx-relic-fade;\s*\}/);
  assert.match(sheet("relics"), /@keyframes gx-relic-fade/);
  assert.doesNotMatch(sheet("play"), /animation: (clue-stamp|reveal-in)/, "no animation names a keyframe that does not exist");
});
