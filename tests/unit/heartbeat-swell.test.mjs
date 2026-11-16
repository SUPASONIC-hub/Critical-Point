import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import {
  HESITATE_AFTER_MS,
  HESITATE_MAX,
  HESITATE_RAMP_MS,
  HESITATION_IDLE,
  hesitationKey,
  hesitationSwell,
  scheduleHeartbeat,
  stepHesitation,
} from "../../src/gauntlet/heartbeat.js";

/**
 * A1-2 (2026-11-12): a staked card held with nothing else pressed swells the
 * heartbeat -- volume only, +20% at most, over 8 s after 3 s. The count, the
 * tempo and the pitch stay as they were.
 */

/** A context that records every AudioParam call and every connection (the style of zone-thud.test.mjs). */
function fakeContext(now = 3) {
  const log = [];
  const nodes = [];
  const param = (owner, name) => {
    const record = (call) => (...args) => log.push({ owner, name, call, args });
    return {
      setValueAtTime: record("setValueAtTime"),
      setTargetAtTime: record("setTargetAtTime"),
      linearRampToValueAtTime: record("linearRampToValueAtTime"),
      exponentialRampToValueAtTime: record("exponentialRampToValueAtTime"),
      cancelScheduledValues: record("cancelScheduledValues"),
    };
  };
  const node = (kind) => {
    const n = { kind, targets: [] };
    n.connect = (target) => {
      n.targets.push(target);
      return target;
    };
    nodes.push(n);
    return n;
  };
  return {
    destination: { kind: "destination" },
    currentTime: now,
    log,
    nodes,
    createGain() {
      const n = node("gain");
      n.gain = param(n, "gain");
      return n;
    },
    createBiquadFilter() {
      const n = node("filter");
      n.frequency = param(n, "frequency");
      return n;
    },
    createOscillator() {
      const n = node("oscillator");
      n.frequency = param(n, "frequency");
      n.start = (at) => {
        n.started = at;
      };
      n.stop = (at) => {
        n.stoppedAt = at;
      };
      return n;
    },
  };
}

const beat = (swell, closeness = 0.4, tier = 1) => {
  const context = fakeContext();
  scheduleHeartbeat({ context, destination: context.destination, multiplier: 0.82 }, closeness, tier, swell);
  return context;
};
const gainCalls = (context) => context.log.filter((e) => e.name === "gain").map(({ call, args }) => ({ call, args }));
const pitchCalls = (context) => context.log.filter((e) => e.name === "frequency").map((e) => [e.owner.kind, e.call, e.args]);
const starts = (context) => context.nodes.filter((n) => n.kind === "oscillator").map((n) => [n.started, n.stoppedAt]);

const live = { selectedId: "card-a", pushes: 2, focusHits: 0, scouted: false, focusMode: "steady" };

test("the constants are the decision: after 3 s, over 8 s, at most +20%", () => {
  assert.equal(HESITATE_AFTER_MS, 3000);
  assert.equal(HESITATE_RAMP_MS, 8000);
  assert.equal(HESITATE_MAX, 1.2);
});

test("for 3 s or less nothing changes", () => {
  const clock = stepHesitation(HESITATION_IDLE, hesitationKey(live), true, 1000);
  for (const at of [1000, 2000, 3500, 4000]) assert.equal(hesitationSwell(clock, at), 1, `${at - 1000} ms held`);
  assert.equal(hesitationSwell(HESITATION_IDLE, 99999), 1, "nothing held, nothing swells");
  assert.deepEqual(gainCalls(beat(1)), gainCalls(beat(undefined)), "a swell of 1 is the beat as it was");
});

test("past 3 s it ramps evenly over 8 s to 1.2 and stays there", () => {
  const clock = stepHesitation(HESITATION_IDLE, hesitationKey(live), true, 0);
  const at = (ms) => hesitationSwell(clock, ms);
  assert.ok(Math.abs(at(3000 + 2000) - 1.05) < 1e-9);
  assert.ok(Math.abs(at(3000 + 4000) - 1.1) < 1e-9);
  assert.equal(at(3000 + 8000), HESITATE_MAX);
  assert.equal(at(60000), HESITATE_MAX, "it never passes +20%");
  // At the fastest pulse (190 a minute) one beat is at most 1% louder than the last.
  let previous = 1;
  for (let ms = 0; ms <= 15000; ms += 60000 / 190) {
    const now = at(ms);
    assert.ok(now >= previous && now - previous < 0.01, `${ms} ms: ${previous} -> ${now}`);
    previous = now;
  }
});

test("the swell is volume only: the same oscillators, the same pitch, the same times, gain x1.2 at most", () => {
  const plain = beat(1);
  const grown = beat(HESITATE_MAX);
  assert.deepEqual(pitchCalls(grown), pitchCalls(plain), "no frequency moves");
  assert.deepEqual(starts(grown), starts(plain), "the beats start and stop where they did");
  const plainGain = gainCalls(plain);
  const grownGain = gainCalls(grown);
  assert.deepEqual(grownGain.map((e) => e.call), plainGain.map((e) => e.call), "start at 0.0001, then ramps: no instant jump");
  assert.equal(grownGain.length, 6);
  for (const [index, entry] of grownGain.entries()) {
    const [value, when] = entry.args;
    const [plainValue, plainWhen] = plainGain[index].args;
    assert.equal(when, plainWhen);
    if (plainValue <= 0.0001) assert.equal(value, plainValue, "the floor is the floor");
    else assert.ok(Math.abs(value / plainValue - HESITATE_MAX) < 1e-9, `peak ${index} grows by 20%`);
  }
  assert.deepEqual(gainCalls(beat(5)), grownGain, "a swell is held to +20% whatever is passed");
  assert.deepEqual(gainCalls(beat(0.5)), plainGain, "and never turns the beat down");
  // The beat goes to the destination it is handed, not into the score's drive.
  for (const gain of grown.nodes.filter((n) => n.kind === "gain")) assert.deepEqual(gain.targets, [grown.destination]);
});

test("any other press resets the count; no card staked or a window not live holds nothing", () => {
  let clock = stepHesitation(HESITATION_IDLE, hesitationKey(live), true, 0);
  assert.equal(hesitationSwell(clock, 11000), HESITATE_MAX);
  assert.equal(stepHesitation(clock, hesitationKey(live), true, 11000), clock, "a frame with nothing pressed keeps the count");
  for (const [press, next] of [
    ["another card", { ...live, selectedId: "card-b" }],
    ["a push", { ...live, pushes: 3 }],
    ["a lock", { ...live, focusHits: 1 }],
    ["a look", { ...live, scouted: true }],
    ["a stance", { ...live, focusMode: "strike" }],
  ]) {
    const after = stepHesitation(clock, hesitationKey(next), true, 11000);
    assert.equal(hesitationSwell(after, 11000), 1, press);
    assert.equal(hesitationSwell(after, 14000), 1, `${press}: 3 s again before anything`);
  }
  const holding = stepHesitation(clock, hesitationKey(live, "holding"), true, 11000);
  assert.equal(hesitationSwell(holding, 11000), 1, "a hold on 확정 is a press");
  assert.equal(hesitationKey({ ...live, selectedId: null }), "", "no card, nothing to hesitate over");
  clock = stepHesitation(clock, hesitationKey(live), false, 11000);
  assert.equal(hesitationSwell(clock, 30000), 1, "a paused or closed window holds nothing");
  clock = stepHesitation(clock, hesitationKey(live), true, 30000);
  assert.equal(hesitationSwell(clock, 33000), 1, "live again, the count starts over");
});

test("the frame loop: the swell reaches the beat's level only -- never the tempo, the count or the screen", () => {
  const fx = readFileSync("src/gauntlet/GauntletFx.jsx", "utf8");
  const frame = fx.slice(fx.indexOf("const loop = "), fx.lastIndexOf("requestAnimationFrame(loop)"));
  assert.match(frame, /held = stepHesitation\(held, hesitationKey\(win, hold\), live, now\);/);
  assert.match(frame, /if \(!quiet\) playHeartbeat\(heat, tier, hesitationSwell\(held, now\)\);\s+nextBeat = time \+ 60000 \/ bpm;/);
  assert.equal(frame.match(/hesitationSwell/g).length, 1, "read in one place: the beat's level");
  assert.match(frame, /const bpm = getHeartbeatBpm\(win\.gauge, tellWall, win\.schema\.sedated, win\.elapsed \/ getWindowSeconds\(win\)\);/);
  assert.equal(/write\([^)]*held/.test(frame), false, "no CSS variable reads it");
  // Hover is not an input: a phone has none.
  assert.equal(/mouse(enter|over|move)|pointer(enter|over|move)|:hover/i.test(fx), false);
  const stage = readFileSync("src/gauntlet/GauntletStage.jsx", "utf8");
  assert.match(stage, /<GauntletFx[^>]*hold=\{cashHold\.phase\}/s);
  const audio = readFileSync("src/gauntlet/gauntletAudio.js", "utf8");
  assert.match(audio, /export function playHeartbeat\(closeness = 0, tier = 0, swell = 1\) \{\s+withRuntime\(\(runtime\) => scheduleHeartbeat\(runtime, closeness, tier, swell\)\);\s+\}/);
});
