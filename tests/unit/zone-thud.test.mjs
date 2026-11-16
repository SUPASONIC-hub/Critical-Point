import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import {
  scheduleZoneThud,
  THUD_ATTACK,
  THUD_FROM_HZ,
  THUD_GLIDE,
  THUD_LEVEL,
  THUD_OCTAVE_LEVEL,
  THUD_OCTAVE_TAIL,
  THUD_TAIL,
  THUD_TO_HZ,
  ZONE_RANK,
  zoneThudDue,
} from "../../src/gauntlet/zoneThud.js";

/** A context that records every AudioParam call and every connection (the style of mood-music.test.mjs). */
function fakeContext(now = 3) {
  const log = [];
  const nodes = [];
  const param = (owner, name) => {
    const record = (call) => (...args) => log.push({ owner, name, call, args });
    const p = {
      setValueAtTime: record("setValueAtTime"),
      setTargetAtTime: record("setTargetAtTime"),
      linearRampToValueAtTime: record("linearRampToValueAtTime"),
      exponentialRampToValueAtTime: record("exponentialRampToValueAtTime"),
      cancelScheduledValues: record("cancelScheduledValues"),
    };
    Object.defineProperty(p, "value", { set: record("value="), get: () => undefined });
    return p;
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
    createOscillator() {
      const n = node("oscillator");
      n.frequency = param(n, "frequency");
      n.detune = param(n, "detune");
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

test("the thud is a low sine body gliding down, with its octave for earbuds; pitch only glides", () => {
  const context = fakeContext();
  scheduleZoneThud({ context, destination: context.destination, multiplier: 0.82 });
  const oscillators = context.nodes.filter((n) => n.kind === "oscillator");
  assert.equal(oscillators.length, 2);
  assert.ok(oscillators.every((o) => o.type === "sine"));
  for (const [index, oscillator] of oscillators.entries()) {
    const octave = index + 1;
    const pitch = context.log.filter((e) => e.owner === oscillator && (e.name === "frequency" || e.name === "detune"));
    assert.deepEqual(
      pitch.map((e) => [e.call, ...e.args]),
      [
        ["setValueAtTime", THUD_FROM_HZ * octave, 3],
        ["exponentialRampToValueAtTime", THUD_TO_HZ * octave, 3 + THUD_GLIDE],
      ],
      "set once, then one smooth glide down: never a step",
    );
  }
  assert.ok(THUD_TO_HZ < THUD_FROM_HZ && THUD_FROM_HZ <= 150 && THUD_TO_HZ >= 30, "low, and falling");
});

test("every gain starts at 0.0001 and only ramps; the body lingers longer than its octave", () => {
  const context = fakeContext();
  scheduleZoneThud({ context, destination: context.destination, multiplier: 0.82 });
  const [body, octave] = context.nodes.filter((n) => n.kind === "gain");
  for (const [gain, level, tail] of [
    [body, THUD_LEVEL, THUD_TAIL],
    [octave, THUD_OCTAVE_LEVEL, THUD_OCTAVE_TAIL],
  ]) {
    const calls = context.log.filter((e) => e.owner === gain && e.name === "gain");
    assert.deepEqual(
      calls.map((e) => e.call),
      ["setValueAtTime", "exponentialRampToValueAtTime", "exponentialRampToValueAtTime", "exponentialRampToValueAtTime"],
      "no instant jump: one start, then ramps",
    );
    assert.deepEqual(calls[0].args, [0.0001, 3]);
    assert.deepEqual(calls[1].args, [level * 0.82, 3 + THUD_ATTACK]);
    assert.deepEqual(calls[3].args, [0.0001, 3 + tail]);
  }
  assert.ok(THUD_ATTACK >= 0.01, "the attack is 10 ms or more: no click");
  assert.ok(THUD_OCTAVE_TAIL < THUD_TAIL);
  const [first, second] = context.nodes.filter((n) => n.kind === "oscillator");
  assert.equal(first.started, 3);
  assert.ok(first.stoppedAt > 3 + THUD_TAIL && second.stoppedAt > 3 + THUD_OCTAVE_TAIL, "each stops after its release ends");
  // A muted preset still ramps to a positive floor: an exponential ramp to 0 throws.
  const silent = fakeContext();
  scheduleZoneThud({ context: silent, destination: silent.destination, multiplier: 0 });
  assert.ok(silent.log.filter((e) => e.name === "gain").every((e) => e.args[0] > 0));
});

test("the thud goes straight to the destination it is handed, never through the drive", () => {
  const context = fakeContext();
  const destination = { kind: "destination" };
  scheduleZoneThud({ context, destination });
  const oscillators = context.nodes.filter((n) => n.kind === "oscillator");
  const gains = context.nodes.filter((n) => n.kind === "gain");
  for (const [index, oscillator] of oscillators.entries()) {
    assert.deepEqual(oscillator.targets, [gains[index]]);
    assert.deepEqual(gains[index].targets, [destination]);
  }
  // gauntletAudio hands every cue the context's destination, not the music bus.
  const audio = readFileSync("src/gauntlet/gauntletAudio.js", "utf8");
  assert.match(audio, /destination: runtime\.context\.destination/);
  assert.match(audio, /export function playZoneThud\(\) \{\s+withRuntime\(scheduleZoneThud\);\s+\}/);
});

test("only a step up sounds; a step down, standing still and the first frame say nothing", () => {
  assert.deepEqual(ZONE_RANK, { distance: 0, inReach: 1, inBand: 2 });
  assert.equal(zoneThudDue("distance", "inReach"), true);
  assert.equal(zoneThudDue("inReach", "inBand"), true);
  assert.equal(zoneThudDue("distance", "inBand"), true, "a push past both steps sounds once");
  assert.equal(zoneThudDue("inBand", "inReach"), false);
  assert.equal(zoneThudDue("inReach", "distance"), false);
  for (const zone of Object.keys(ZONE_RANK)) assert.equal(zoneThudDue(zone, zone), false, `${zone} again`);
  assert.equal(zoneThudDue("", "inBand"), false, "the window's first frame takes the line as it finds it");
  assert.equal(zoneThudDue("inReach", ""), false);

  // A line walked up, held, cooled and climbed again: the climb back sounds again.
  const walk = ["distance", "distance", "inReach", "inReach", "inBand", "inBand", "inReach", "distance", "inReach", "inBand"];
  let seen = "";
  const sounded = [];
  for (const [index, zone] of walk.entries()) {
    if (zoneThudDue(seen, zone)) sounded.push(index);
    seen = zone;
  }
  assert.deepEqual(sounded, [2, 4, 8, 9]);
});

test("a quiet table never sounds the thud", () => {
  for (const [before, after] of [
    ["distance", "inReach"],
    ["inReach", "inBand"],
    ["distance", "inBand"],
  ]) {
    assert.equal(zoneThudDue(before, after, true), false);
  }
});
