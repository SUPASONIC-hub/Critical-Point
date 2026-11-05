import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { musicModes, revealTracks } from "../../src/components/musicData.js";
import {
  createSceneMode,
  DEFAULT_MOOD,
  getMusicMood,
  leadForBar,
  MOOD_FADE_SECONDS,
  moodCrossfade,
  moodLeadForBar,
  moodLeads,
  MUSIC_MOODS,
  normalizeMood,
  setMusicMood,
} from "../../src/components/musicScore.js";
import { createTensionDrone, DRONE_FADE_SECONDS, DRONE_FADE_TAU, DRONE_VOICINGS, droneVoicing } from "../../src/gauntlet/tensionDrone.js";
import { applyMood, currentMood, onMoodChange } from "../../src/mood.js";

const notes = (lead) => lead.filter(Boolean).length;
const register = (lead) => {
  const sounded = lead.filter(Boolean);
  return sounded.reduce((sum, f) => sum + Math.log2(f), 0) / sounded.length;
};
const pitchClass = (frequency) => ((Math.round(12 * Math.log2(frequency / 440)) % 12) + 12) % 12;
const sceneKey = (mode) => `${mode === "final" ? "result:final" : mode}:case01:scene:voice:0:public`;

/* The table ------------------------------------------------------------ */

test("five moods; an unknown or missing one is neutral", () => {
  assert.deepEqual(MUSIC_MOODS, ["neutral", "bright", "tense", "dread", "sorrow"]);
  assert.equal(DEFAULT_MOOD, "neutral");
  for (const value of [undefined, null, "", "angry", "TENSE", 3]) assert.equal(normalizeMood(value), "neutral", String(value));
  for (const mood of MUSIC_MOODS) assert.equal(normalizeMood(mood), mood);
});

test("tense is the score as it was: every mode's four leads in their order, bar for bar", () => {
  for (const key of ["intro:menu", "controlled:case03:briefing:반재욱:4:lab", "critical:case08:scene:오진우:2:public", "result:final:3"]) {
    const mode = createSceneMode(key);
    assert.equal(moodLeads(mode, "tense"), mode.leads, key);
    for (let bar = 0; bar < 20; bar += 1) assert.equal(moodLeadForBar(mode, bar, "tense"), leadForBar(mode, bar), `${key} bar ${bar}`);
  }
});

test("mood -> lead: bright the two lightest, dread the two lowest, neutral the middle two, sorrow one slow minor line", () => {
  for (const key of Object.keys(musicModes)) {
    const mode = createSceneMode(sceneKey(key));
    const { leads } = mode;
    const byRegister = [...leads].sort((a, b) => register(a) - register(b));

    const bright = moodLeads(mode, "bright");
    assert.equal(bright.length, 2, `${key} bright`);
    const [first, second] = bright;
    assert.equal(notes(first), Math.min(...leads.map(notes)), `${key}: the brightest lead has the fewest notes`);
    assert.ok(notes(first) < notes(second) || register(first) >= register(second), `${key}: bright's first is the lighter`);
    for (const other of leads) {
      if (bright.includes(other)) continue;
      const lighter = notes(other) < notes(second) || (notes(other) === notes(second) && register(other) > register(second));
      assert.ok(!lighter, `${key}: lead ${leads.indexOf(other)} is lighter than bright's second`);
    }

    assert.deepEqual(moodLeads(mode, "dread"), byRegister.slice(0, 2), `${key} dread is the two lowest in register`);

    const neutral = moodLeads(mode, "neutral");
    assert.equal(neutral.length, 2, `${key} neutral`);
    assert.deepEqual(new Set(neutral), new Set(byRegister.slice(1, 3)), `${key} neutral is the middle two`);
    assert.ok(leads.indexOf(neutral[0]) < leads.indexOf(neutral[1]), `${key} neutral keeps the mode's order`);

    const sorrow = moodLeads(mode, "sorrow");
    assert.equal(sorrow.length, 1, `${key} sorrow holds one lead`);
    assert.equal(sorrow[0], mode.sorrowLead);
    assert.ok(!leads.includes(sorrow[0]), `${key} sorrow is not one of the four`);
    const line = sorrow[0].filter(Boolean);
    assert.equal(line.length, notes(revealTracks.cost.leads[0]), `${key}: the reveal's 많이 치름 line`);
    for (let index = 1; index < line.length; index += 1) assert.ok(line[index] < line[index - 1], `${key}: the sorrow lead falls`);
    // The reveal's intervals whatever the key, and within an octave of where the mode's own leads sit.
    const steps = (lead) => lead.filter(Boolean).map(pitchClass).map((pc, i, all) => (i ? (pc - all[i - 1] + 12) % 12 : 0));
    assert.deepEqual(steps(sorrow[0]), steps(revealTracks.cost.leads[0]), `${key}: the same intervals`);
    const modeRegister = leads.reduce((sum, lead) => sum + register(lead), 0) / leads.length;
    assert.ok(Math.abs(register(sorrow[0]) - modeRegister) <= 1, `${key}: sorrow sits with the mode's leads`);
  }
});

test("the sorrow line sits in each mode's minor: the mode's root, or the relative minor of a major mode", () => {
  const names = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
  const expected = { intro: "A", controlled: "A", unstable: "D", critical: "G", result: "A", final: "F" };
  for (const [key, root] of Object.entries(expected)) {
    const mode = createSceneMode(sceneKey(key));
    // The scene's own transpose moved the pad root and the sorrow lead alike; compare them to the base pad.
    const padRoot = pitchClass(mode.pad.find(Boolean)[0]);
    const baseRoot = pitchClass(musicModes[key].pad.find(Boolean)[0]);
    const first = pitchClass(mode.sorrowLead.find(Boolean));
    assert.equal(names[(first - padRoot + baseRoot + 24) % 12], root, key);
  }
});

test("a reveal track has one lead and every mood plays it", () => {
  for (const outcome of ["gain", "even", "cost"]) {
    const mode = createSceneMode(`reveal:${outcome}`);
    for (const mood of MUSIC_MOODS) assert.deepEqual(moodLeads(mode, mood), mode.leads, `${outcome} ${mood}`);
  }
});

test("neutral, bright and dread still take turns by phrase, from the scene's own offset", () => {
  const mode = createSceneMode("controlled:case05:scene:한서윤:1:lab");
  for (const mood of ["neutral", "bright", "dread"]) {
    const leads = moodLeads(mode, mood);
    const turns = Array.from({ length: 8 }, (_, bar) => moodLeadForBar(mode, bar, mood));
    assert.equal(new Set(turns).size, 2, mood);
    assert.equal(turns[0], leads[mode.leadOffset % 2], mood);
    assert.equal(turns[3], turns[0], `${mood}: a phrase holds`);
    assert.notEqual(turns[4], turns[0], `${mood}: the next phrase turns`);
  }
});

/* The change ------------------------------------------------------------ */

test("setMusicMood: normalised, timed, and a crossfade of MOOD_FADE_SECONDS that weighs the two leads", () => {
  assert.equal(getMusicMood(), "neutral");
  assert.equal(setMusicMood("tense", 10), "tense");
  assert.equal(getMusicMood(), "tense");
  assert.deepEqual(moodCrossfade(10), { to: "tense", from: "neutral", blend: 0 });
  assert.deepEqual(moodCrossfade(10 + MOOD_FADE_SECONDS / 2), { to: "tense", from: "neutral", blend: 0.5 });
  assert.deepEqual(moodCrossfade(10 + MOOD_FADE_SECONDS), { to: "tense", from: null, blend: 1 });
  // The same mood again does not restart the fade.
  setMusicMood("tense", 12);
  assert.equal(moodCrossfade(12).blend, 0.4);
  // An unknown mood is neutral; a change mid-fade starts from the mood that was coming in.
  assert.equal(setMusicMood("??", 13), "neutral");
  assert.deepEqual(moodCrossfade(13), { to: "neutral", from: "tense", blend: 0 });
  assert.ok(MOOD_FADE_SECONDS >= 4 && MOOD_FADE_SECONDS <= 6);
  setMusicMood("neutral", -Infinity);
});

/* The drone -------------------------------------------------------------- */

/** A context that records every AudioParam call and every `.value =` write, and never ramps anything. */
function fakeContext() {
  const log = [];
  const nodes = [];
  let time = 0;
  const param = (owner, name) => {
    const record = (call) => (...args) => log.push({ owner, name, call, args, at: time });
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
    const n = { kind, id: nodes.length, connect: (target) => target };
    nodes.push(n);
    return n;
  };
  return {
    destination: { kind: "destination" },
    get currentTime() {
      return time;
    },
    advance(seconds) {
      time += seconds;
    },
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
      n.Q = param(n, "Q");
      return n;
    },
    createOscillator() {
      const n = node("oscillator");
      n.frequency = param(n, "frequency");
      n.detune = param(n, "detune");
      n.started = null;
      n.stoppedAt = null;
      n.start = (at = time) => {
        n.started = at;
      };
      n.stop = (at = time) => {
        if (n.stoppedAt !== null) throw new Error("stop() twice");
        n.stoppedAt = at;
      };
      return n;
    },
  };
}

function drone(mood = "neutral") {
  const context = fakeContext();
  const state = { mood, muted: false, level: 0.82 };
  const controller = createTensionDrone(
    { context, destination: context.destination, multiplier: 0.82 },
    { isMuted: () => state.muted, level: () => state.level, mood: () => state.mood },
  );
  return { context, state, controller };
}

const oscillatorsOf = (context) => context.nodes.filter((n) => n.kind === "oscillator");
const tuning = (context, oscillator) => context.log.find((e) => e.owner === oscillator && e.name === "frequency").args[0];

test("mood -> drone voicing: tense is today's three voices at full level; the others thin, lean low, or go minor", () => {
  assert.deepEqual(Object.keys(DRONE_VOICINGS).sort(), [...MUSIC_MOODS].sort());
  assert.deepEqual(DRONE_VOICINGS.tense, { voices: [55, 55 * 1.007, 82.4], level: 1, floor: 120 });
  assert.ok(DRONE_VOICINGS.bright.voices.length < DRONE_VOICINGS.tense.voices.length && DRONE_VOICINGS.bright.level < 1, "bright is thinner");
  assert.ok(DRONE_VOICINGS.bright.floor > DRONE_VOICINGS.tense.floor);
  assert.ok(Math.min(...DRONE_VOICINGS.dread.voices) < 55 && DRONE_VOICINGS.dread.level > 1 && DRONE_VOICINGS.dread.floor < 120, "dread leans on the low end");
  assert.deepEqual(DRONE_VOICINGS.sorrow.voices, [55, 65.41], "sorrow: the minor third");
  assert.ok(DRONE_VOICINGS.neutral.level < 1 && DRONE_VOICINGS.neutral.level > DRONE_VOICINGS.bright.level, "neutral sits between");
  assert.equal(droneVoicing("whatever"), DRONE_VOICINGS.neutral);
  // The drone's loudest level was 0.082 x the preset; dread's share keeps it under 0.1, straight to the destination, never the drive.
  assert.ok(0.082 * DRONE_VOICINGS.dread.level <= 0.1);
  for (const voicing of Object.values(DRONE_VOICINGS)) for (const hz of voicing.voices) assert.ok(hz >= 40 && hz <= 90, `${hz} Hz is a drone`);
});

test("the drone starts in the mood it is given, and under a mute it idles as before", () => {
  const { context, controller, state } = drone("dread");
  assert.equal(controller.mood, "dread");
  const oscillators = oscillatorsOf(context);
  assert.deepEqual(oscillators.map((n) => tuning(context, n)), DRONE_VOICINGS.dread.voices);
  assert.ok(oscillators.every((n) => n.started !== null));
  controller.set(0.5);
  state.muted = true;
  context.advance(1.5);
  controller.set(0.5);
  const master = context.nodes.find((n) => n.kind === "gain");
  assert.deepEqual(context.log.filter((e) => e.owner === master && e.name === "gain").at(-1).args, [0.0001, 1.5, 0.25]);
  controller.stop();
  assert.ok(oscillators.every((n) => n.stoppedAt === 2), "stop releases the voices half a second on");
});

test("a mood change builds the new voicing at its pitches and only ramps gains: no value jumps, no retuning, old voices stop once silent", () => {
  const { context, controller, state } = drone("neutral");
  controller.set(0.3);
  context.advance(2);
  const before = context.nodes.length;
  const logBefore = context.log.length;
  state.mood = "dread";
  controller.set(0.3);
  assert.equal(controller.mood, "dread");
  const since = context.log.slice(logBefore);
  const added = context.nodes.slice(before);
  const oldOscillators = oscillatorsOf(context).filter((n) => n.id < before);
  const newOscillators = added.filter((n) => n.kind === "oscillator");
  assert.equal(newOscillators.length, DRONE_VOICINGS.dread.voices.length);
  // The new voices are tuned before they start, and nothing already sounding is retuned.
  for (const [index, oscillator] of newOscillators.entries()) {
    assert.deepEqual(since.find((e) => e.owner === oscillator && e.name === "frequency").args, [DRONE_VOICINGS.dread.voices[index], 2]);
    assert.equal(oscillator.started, 2);
  }
  assert.ok(!since.some((e) => e.name === "frequency" && oldOscillators.includes(e.owner)), "an old voice keeps its pitch");
  assert.ok(!since.some((e) => e.name === "detune" && oldOscillators.includes(e.owner)), "an old voice keeps its detune");
  // No param anywhere is assigned a value: the new voicing's gain is set once before its voices start, then only ramped; the old one is only ramped.
  assert.ok(!since.some((e) => e.call === "value="), "no gain or frequency is assigned a value");
  const [master, oldGain] = context.nodes.filter((n) => n.kind === "gain");
  const newGain = added.find((n) => n.kind === "gain");
  const newGainCalls = since.filter((e) => e.owner === newGain);
  assert.deepEqual(
    newGainCalls.map((e) => [e.call, ...e.args]),
    [
      ["setValueAtTime", 0.0001, 2],
      ["setTargetAtTime", DRONE_VOICINGS.dread.level, 2, DRONE_FADE_TAU],
    ],
  );
  assert.deepEqual(
    since.filter((e) => e.owner === oldGain).map((e) => [e.call, ...e.args]),
    [["setTargetAtTime", 0.0001, 2, DRONE_FADE_TAU]],
  );
  assert.ok(since.filter((e) => e.owner === master).every((e) => e.call === "setTargetAtTime"), "the master is only ramped");
  // The crossfade is 4-6 s: the time constant brings it 97% over by then, and the old voices stop a second after.
  assert.ok(DRONE_FADE_SECONDS >= 4 && DRONE_FADE_SECONDS <= 6);
  assert.ok(1 - Math.exp(-DRONE_FADE_SECONDS / DRONE_FADE_TAU) > 0.96);
  for (const oscillator of oldOscillators) assert.equal(oscillator.stoppedAt, 2 + DRONE_FADE_SECONDS + 1);
  // Both voicings' filters keep following the table until the old one is gone; the detune rides the new top voice.
  assert.ok(since.some((e) => e.name === "frequency" && e.owner.kind === "filter" && e.owner.id < before));
  assert.ok(since.some((e) => e.name === "detune" && e.owner === newOscillators.at(-1)));
  // A stop during the fade does not stop the old voices twice.
  context.advance(1);
  controller.set(0.3);
  assert.doesNotThrow(() => controller.stop());
  assert.ok(newOscillators.every((n) => n.stoppedAt === 3.5));
});

test("an unknown mood voices the drone as neutral, and the same mood again builds nothing", () => {
  const { context, controller, state } = drone("sorrow");
  const count = context.nodes.length;
  controller.set(0.1);
  controller.set(0.1);
  assert.equal(context.nodes.length, count);
  state.mood = "spooky";
  controller.set(0.1);
  assert.equal(controller.mood, "neutral");
  assert.equal(oscillatorsOf(context).length, DRONE_VOICINGS.sorrow.voices.length + DRONE_VOICINGS.neutral.voices.length);
});

/* The wiring ------------------------------------------------------------ */

test("AdaptiveMusic plays the mood's lead and shares the gain across a change; the table's drone and the dev page read the mood", () => {
  const music = readFileSync(new URL("../../src/components/AdaptiveMusic.jsx", import.meta.url), "utf8");
  assert.match(music, /export function setMusicMood\(mood\)/);
  assert.match(music, /moodLeadForBar\(currentMode, bar, to\)/);
  assert.match(music, /strikeLead\(leadLine, crossing \? blend : 1\)/);
  assert.match(music, /if \(crossing\) strikeLead\(oldLine, 1 - blend\)/);
  assert.match(music, /export \{ getMusicMood, MUSIC_MOODS \} from "\.\/musicScore\.js"/);
  // The page's mood reaches the score through one subscription made as the module loads, and the mood already applied is read once.
  assert.match(music, /import \{ currentMood, onMoodChange \} from "\.\.\/mood\.js"/);
  assert.match(music, /^onMoodChange\(setMusicMood\);\n^setMusicMood\(currentMood\(\)\);/m);
  const audio = readFileSync(new URL("../../src/gauntlet/gauntletAudio.js", import.meta.url), "utf8");
  assert.match(audio, /createTensionDrone\(runtime, \{ isMuted: isSoundMuted, level: getSoundLevel, mood: getMusicMood \}\)/);
  const lab = readFileSync(new URL("../../src/dev/musicLab.jsx", import.meta.url), "utf8");
  assert.match(lab, /setMusicMood\(mood\)/);
  assert.match(lab, /startTensionDrone\(\)/);
});

test("a mood applied on the page (src/mood.js) reaches getMusicMood through that subscription, timed on the context, and the one applied before the music woke is read once", () => {
  // AdaptiveMusic.jsx is JSX, so the same two lines it runs at load are run here against the same hub and score.
  const context = fakeContext();
  const musicSetMood = (mood) => setMusicMood(mood, context.currentTime);
  try {
    applyMood("dread");
    assert.equal(getMusicMood(), "neutral", "before the music wakes the score is untouched");
    const stop = onMoodChange(musicSetMood);
    musicSetMood(currentMood());
    assert.equal(getMusicMood(), "dread", "the mood applied before the music woke is read once");
    context.advance(3);
    assert.equal(applyMood("sorrow"), "sorrow");
    assert.equal(getMusicMood(), "sorrow");
    assert.deepEqual(moodCrossfade(3), { to: "sorrow", from: "dread", blend: 0 }, "the change is a crossfade from the context's clock, not a jump");
    applyMood("neutral");
    assert.equal(getMusicMood(), "neutral", "an untagged scene takes the music back to neutral");
    stop();
    applyMood("tense");
    assert.equal(getMusicMood(), "neutral", "after the unsubscribe the score no longer follows");
  } finally {
    applyMood("neutral");
    setMusicMood("neutral", -Infinity);
  }
});
