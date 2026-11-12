import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { scheduleZoneThud, THUD_ATTACK, THUD_HZ, THUD_LENGTH, THUD_LEVEL, THUD_RELEASE, ZONE_RANK, zoneThudDue } from "../../src/gauntlet/zoneThud.js";

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

test("the thud is one low sine at one pitch, set once and never moved", () => {
  const context = fakeContext();
  scheduleZoneThud({ context, destination: context.destination, multiplier: 0.82 });
  const oscillators = context.nodes.filter((n) => n.kind === "oscillator");
  assert.equal(oscillators.length, 1);
  assert.equal(oscillators[0].type, "sine");
  const pitch = context.log.filter((e) => e.name === "frequency" || e.name === "detune");
  assert.equal(pitch.length, 1, "the frequency is set once");
  assert.deepEqual(pitch[0], { owner: oscillators[0], name: "frequency", call: "setValueAtTime", args: [THUD_HZ, 3] });
  assert.ok(THUD_HZ >= 70 && THUD_HZ <= 150, `${THUD_HZ} Hz is low`);
});

test("the gain starts at 0.0001 and only ramps: in over 20 ms or more, gone inside 0.3 s", () => {
  const context = fakeContext();
  scheduleZoneThud({ context, destination: context.destination, multiplier: 0.82 });
  const gain = context.log.filter((e) => e.name === "gain");
  assert.deepEqual(
    gain.map((e) => e.call),
    ["setValueAtTime", "exponentialRampToValueAtTime", "exponentialRampToValueAtTime"],
    "no instant jump: one start, then ramps",
  );
  assert.deepEqual(gain[0].args, [0.0001, 3]);
  assert.ok(THUD_ATTACK >= 0.02, "the attack is 20 ms or more");
  assert.deepEqual(gain[1].args, [THUD_LEVEL * 0.82, 3 + THUD_ATTACK]);
  assert.deepEqual(gain[2].args, [0.0001, 3 + THUD_ATTACK + THUD_RELEASE]);
  assert.ok(THUD_ATTACK + THUD_RELEASE <= THUD_LENGTH && THUD_LENGTH <= 0.3, "the release ends before the oscillator stops, inside 0.3 s");
  const [oscillator] = context.nodes.filter((n) => n.kind === "oscillator");
  assert.equal(oscillator.started, 3);
  assert.equal(oscillator.stoppedAt, 3 + THUD_LENGTH);
  // A muted preset still ramps to a positive floor: an exponential ramp to 0 throws.
  const silent = fakeContext();
  scheduleZoneThud({ context: silent, destination: silent.destination, multiplier: 0 });
  assert.ok(silent.log.filter((e) => e.name === "gain").every((e) => e.args[0] > 0));
});

test("the thud goes straight to the destination it is handed, never through the drive", () => {
  const context = fakeContext();
  const destination = { kind: "destination" };
  scheduleZoneThud({ context, destination });
  const [oscillator] = context.nodes.filter((n) => n.kind === "oscillator");
  const [gain] = context.nodes.filter((n) => n.kind === "gain");
  assert.deepEqual(oscillator.targets, [gain]);
  assert.deepEqual(gain.targets, [destination]);
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
