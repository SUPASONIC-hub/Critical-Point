import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { musicModes, revealTracks } from "../../src/components/musicData.js";
import {
  BARS_PER_PHRASE,
  BUS_LOWPASS_HZ,
  counterLine,
  createSceneMode,
  DRIVE_CEILING,
  driveMix,
  leadFilterFrequency,
  REVEAL_OUTCOME_MARGIN,
  REVEAL_OUTCOME_RATIO,
  revealOutcome,
  leadForBar,
  pulseLine,
  shadowNote,
  STAKE_LAYER_GAUGES,
  stakeLayerCount,
  STEPS_PER_BAR,
} from "../../src/components/musicScore.js";

const A4 = 440;
/** The pitch class of a frequency, 0-11 with A as 0, to a cent's tolerance. */
const pitchClass = (frequency) => ((Math.round(12 * Math.log2(frequency / A4)) % 12) + 12) % 12;

/** The pitch classes the mode's bass and pad already sound: the harmony a lead must stay inside. */
function harmonyOf(mode) {
  const classes = new Set();
  for (const note of mode.bass) if (note) classes.add(pitchClass(note));
  for (const chord of mode.pad) if (chord) for (const note of chord) classes.add(pitchClass(note));
  return classes;
}

test("every mode has three or four sixteen-step leads, the first being the lead it always had", () => {
  for (const [key, mode] of Object.entries(musicModes)) {
    assert.ok(mode.leads.length >= 3 && mode.leads.length <= 4, `${key} has ${mode.leads.length} leads`);
    assert.equal(mode.lead, undefined, `${key} still carries a single lead`);
    for (const lead of mode.leads) {
      assert.equal(lead.length, STEPS_PER_BAR, `${key}: a lead is one bar`);
      assert.ok(lead.filter(Boolean).length >= 4, `${key}: a lead is a tune, not a note`);
    }
    const distinct = new Set(mode.leads.map((lead) => JSON.stringify(lead)));
    assert.equal(distinct.size, mode.leads.length, `${key}: no two leads are the same`);
  }
  // The intro's lead as it was before 2026-11-02.
  assert.deepEqual(musicModes.intro.leads[0], [220, null, null, 277.18, null, null, 196, null, null, 246.94, null, null, 220, null, null, null]);
});

test("a new lead keeps to the mode's key: its notes are the harmony's tones or a step off them", () => {
  for (const [key, mode] of Object.entries(musicModes)) {
    const harmony = harmonyOf(mode);
    // The mode's own scale, as its first lead and its harmony spell it.
    const scale = new Set([...harmony, ...mode.leads[0].filter(Boolean).map(pitchClass)]);
    for (const [index, lead] of mode.leads.entries()) {
      let onChord = 0;
      for (const note of lead.filter(Boolean)) {
        const pc = pitchClass(note);
        const nearest = Math.min(...[...scale].map((tone) => Math.min((pc - tone + 12) % 12, (tone - pc + 12) % 12)));
        assert.ok(nearest <= 2, `${key} lead ${index}: ${note}Hz is ${nearest} semitones from the mode`);
        if (harmony.has(pc)) onChord += 1;
      }
      assert.ok(onChord >= 2, `${key} lead ${index} lands on the harmony at least twice (${onChord})`);
    }
  }
});

test("the leads take turns every few bars, in order, from a start the scene's key picks", () => {
  const mode = createSceneMode("controlled:case03:briefing:반재욱:4:lab");
  assert.equal(mode.leads.length, musicModes.controlled.leads.length);
  const turns = Array.from({ length: mode.leads.length * BARS_PER_PHRASE }, (_, bar) => leadForBar(mode, bar));
  for (let bar = 0; bar < turns.length; bar += 1) {
    const phrase = Math.floor(bar / BARS_PER_PHRASE);
    assert.equal(turns[bar], mode.leads[(phrase + mode.leadOffset) % mode.leads.length], `bar ${bar}`);
  }
  // A phrase holds for its bars, and every lead gets its turn before one repeats.
  assert.equal(new Set(turns).size, mode.leads.length);
  assert.equal(leadForBar(mode, BARS_PER_PHRASE - 1), leadForBar(mode, 0));
  assert.notEqual(leadForBar(mode, BARS_PER_PHRASE), leadForBar(mode, 0));
  assert.equal(leadForBar(mode, mode.leads.length * BARS_PER_PHRASE), leadForBar(mode, 0), "and the cycle comes round");

  // Deterministic: the same key builds the same score.
  const again = createSceneMode("controlled:case03:briefing:반재욱:4:lab");
  assert.deepEqual(again.leads, mode.leads);
  assert.equal(again.leadOffset, mode.leadOffset);

  // Scenes do not all open on the same lead.
  const starts = new Set(Array.from({ length: 24 }, (_, index) => createSceneMode(`unstable:case0${(index % 9) + 1}:scene:voice:${index}`).leadOffset));
  assert.ok(starts.size >= 3, `scene starts spread over ${starts.size} leads`);
});

test("a scene's leads move with its key and its groove as the single lead did", () => {
  // 오진우 is five semitones down; scene index 3 is the groove that rotates the lead by two.
  const mode = createSceneMode("critical:case05:scene:오진우:3");
  const base = musicModes.critical.leads;
  const bassShift = Math.round(12 * Math.log2(mode.bass[0] / musicModes.critical.bass[0]));
  for (const [index, lead] of mode.leads.entries()) {
    const sounding = lead.findIndex(Boolean);
    const source = base[index][(sounding - 2 + STEPS_PER_BAR) % STEPS_PER_BAR];
    assert.ok(source, "the rotated step came from a sounding step");
    const semitones = Math.round(12 * Math.log2(lead[sounding] / source));
    assert.equal(semitones, bassShift, `lead ${index} moved with the bass`);
  }
});

test("the stake brings in a layer at each gauge threshold, and none below the first", () => {
  assert.deepEqual(STAKE_LAYER_GAUGES, [...STAKE_LAYER_GAUGES].sort((a, b) => a - b));
  assert.equal(stakeLayerCount(0), 0);
  assert.equal(stakeLayerCount(undefined), 0);
  assert.equal(stakeLayerCount(STAKE_LAYER_GAUGES[0] - 1), 0);
  STAKE_LAYER_GAUGES.forEach((gauge, index) => {
    assert.equal(stakeLayerCount(gauge), index + 1, `gauge ${gauge}`);
  });
  assert.equal(stakeLayerCount(100), 3);
});

test("the layers are built from the mode's own bass, pad and lead", () => {
  const mode = createSceneMode("intro:menu");
  // The counter breaks the sounding chord an octave up, on the off-beat eighths.
  assert.equal(mode.counter.length, STEPS_PER_BAR);
  mode.counter.forEach((note, step) => {
    if (step % 4 !== 2) return assert.equal(note, null, `step ${step} is not a counter step`);
    const chord = step < 8 ? mode.pad[0] : mode.pad[8];
    assert.ok(chord.map((tone) => tone * 2).includes(note), `step ${step}: ${note} is a chord tone an octave up`);
  });
  assert.deepEqual(counterLine([[100, 150], null, null, null]), [null, null, 200, null]);

  // The pulse is the bass held through its rests, an octave up, every eighth.
  assert.deepEqual(pulseLine([50, null, null, null, 60, null, null, null]), [100, null, 100, null, 120, null, 120, null]);
  assert.deepEqual(pulseLine([null, null, 40, null]), [80, null, 80, null], "a bar opening on a rest holds the note from the bar before");
  assert.equal(mode.pulse.length, STEPS_PER_BAR);

  // The shadow is the lead a step late, an octave up.
  const lead = leadForBar(mode, 0);
  lead.forEach((note, step) => {
    assert.equal(shadowNote(lead, (step + 1) % STEPS_PER_BAR), note ? note * 2 : null);
  });
});

test("the layers sit under the lead, and the table hands the score only what it draws", () => {
  const score = readFileSync(new URL("../../src/components/AdaptiveMusic.jsx", import.meta.url), "utf8");
  const gain = (name) => Number(score.match(new RegExp(`const ${name} = ([0-9.]+);`))[1]);
  const lead = gain("LEAD_GAIN");
  const layers = ["COUNTER_GAIN", "PULSE_GAIN", "SHADOW_GAIN"].map(gain);
  for (const level of layers) assert.ok(level < lead, `a layer at ${level} is under the lead at ${lead}`);
  assert.deepEqual(layers, [...layers].sort((a, b) => b - a), "each layer quieter than the one before it");

  const fx = readFileSync(new URL("../../src/gauntlet/GauntletFx.jsx", import.meta.url), "utf8");
  assert.match(fx, /setMusicStake\(live && !quiet \? win\.gauge : 0\)/, "the gauge the table shows, and nothing at a quiet table");
  assert.match(fx, /drone\.stop\(\);\s*setMusicStake\(0\);/, "a window that closes takes the layers with it");
});

const music = readFileSync(new URL("../../src/components/AdaptiveMusic.jsx", import.meta.url), "utf8");
const runtime = readFileSync(new URL("../../src/GameRuntime.jsx", import.meta.url), "utf8");

/** A spread of scene keys: every mode, chapter, speaker and origin a key can carry. */
function sceneKeys() {
  const keys = [];
  for (const mode of Object.keys(musicModes)) {
    for (const chapter of ["prologue01", "case03", "case08", "case32", "case49", "final"]) {
      for (const speaker of ["voice", "오진우", "도윤하"]) {
        for (let index = 0; index < 6; index += 1) keys.push(`${mode}:${chapter}:scene:${speaker}:${index}:courier`);
      }
    }
  }
  return keys;
}

test("the drive is a seasoning: no mode over 0.15, and no scene pushes past it", () => {
  assert.equal(DRIVE_CEILING, 0.15);
  for (const [key, mode] of Object.entries(musicModes)) assert.ok(mode.drive <= DRIVE_CEILING, `${key} drive ${mode.drive}`);
  // The loudest stays the loudest, as before (critical > final > unstable > controlled).
  const { controlled, unstable, critical, final } = musicModes;
  assert.ok(critical.drive > final.drive && final.drive > unstable.drive && unstable.drive > controlled.drive);
  assert.equal(critical.drive, DRIVE_CEILING);
  for (const key of sceneKeys()) assert.ok(createSceneMode(key).drive <= DRIVE_CEILING, key);
});

test("the drive crossfades on one fixed curve, at one level, ramped", () => {
  assert.deepEqual(driveMix(0), { dry: 1, wet: 0 });
  const full = driveMix(DRIVE_CEILING);
  assert.equal(full.dry, 0);
  // Trimmed by the curve's small-signal gain, so dry and wet are at one level.
  assert.equal(full.wet, Number((1 / (1 + DRIVE_CEILING * 60)).toFixed(4)));
  assert.deepEqual(driveMix(5), full, "clamped to the ceiling");
  assert.deepEqual(driveMix(-1), driveMix(0));
  const half = driveMix(DRIVE_CEILING / 2);
  assert.equal(half.dry, 0.5);

  assert.equal(BUS_LOWPASS_HZ, 7000);
  assert.ok(music.includes("lowpass.frequency.value = BUS_LOWPASS_HZ;"));
  assert.ok(music.includes("shaper.curve = makeDriveCurve(DRIVE_CEILING);"), "the curve is built once");
  assert.equal(music.match(/shaper.curve =/g).length, 1, "and never swapped");
  assert.ok(music.includes("drive.dry.gain.setTargetAtTime("));
  assert.ok(music.includes("drive.wet.gain.setTargetAtTime("));
});

test("a sawtooth or square lead is filtered lower than a soft wave", () => {
  for (const lift of [0, 400, 760, 1320]) {
    const soft = leadFilterFrequency({ wave: "triangle", filterLift: lift });
    assert.equal(soft, 1500 + lift);
    assert.ok(leadFilterFrequency({ wave: "sawtooth", filterLift: lift }) <= Math.min(2200, soft));
    assert.ok(leadFilterFrequency({ wave: "square", filterLift: lift }) <= Math.min(2400, soft));
  }
  assert.ok(music.includes("filterFrequency: leadFilterFrequency(currentMode)"));
});

test("the reveal's track is chosen by what the choice received against what it paid", () => {
  assert.equal(REVEAL_OUTCOME_RATIO, 2);
  assert.equal(REVEAL_OUTCOME_MARGIN, 5);
  assert.equal(revealOutcome({ trust: 7, legitimacy: 5 }), "gain");
  assert.equal(revealOutcome({ trust: 13, capital: -5, legitimacy: 5, fatigue: 2 }), "gain", "18 against 7");
  // humanCost and fatigue cost when they rise, and pay when they fall.
  assert.equal(revealOutcome({ fatigue: -6 }), "gain");
  assert.equal(revealOutcome({ humanCost: 8 }), "cost");
  assert.equal(revealOutcome({ time: -8, legitimacy: -3, trust: 2 }), "cost", "11 against 2");
  assert.equal(revealOutcome({ trust: 4, legitimacy: 3 }), "gain", "7, nothing paid");
  assert.equal(revealOutcome({ trust: 3 }), "even", "a small gain is not a windfall");
  assert.equal(revealOutcome({ trust: 4, fatigue: 3 }), "even");
  assert.equal(revealOutcome({ capital: 18, trust: -14, humanCost: 18, fatigue: 3 }), "even", "18 against 35 is under twice");
  assert.equal(revealOutcome({}), "even");
  assert.equal(revealOutcome(undefined), "even");
  // A bust is the somber track whatever the card was.
  assert.equal(revealOutcome({ trust: 30 }, { busted: true }), "cost");
});

test("the reveal has exactly three fixed tracks, one lead each, the same under every scene", () => {
  assert.deepEqual(Object.keys(revealTracks).sort(), ["cost", "even", "gain"]);
  for (const [name, track] of Object.entries(revealTracks)) {
    assert.equal(track.leads.length, 1, `${name}: one lead, no turns`);
    assert.equal(track.leads[0].length, STEPS_PER_BAR);
    assert.equal(track.drive, 0);
    const mode = createSceneMode(`reveal:${name}`);
    assert.equal(mode.interval, track.stepMs, "no scene tempo");
    assert.deepEqual(mode.bass, track.bass, "no transposition");
    assert.deepEqual(mode.kick, track.kick, "no groove rotation");
    for (let bar = 0; bar < BARS_PER_PHRASE * 5; bar += 1) assert.deepEqual(leadForBar(mode, bar), track.leads[0], `${name} bar ${bar}`);
    // Called again, called with another mix: the same notes.
    assert.deepEqual(createSceneMode(`reveal:${name}`).leads, mode.leads);
  }
  // The table and story scenes still take turns between four leads.
  const scene = createSceneMode("critical:case08:scene:voice:2:courier");
  assert.equal(scene.leads.length, 4);
  assert.notDeepEqual(leadForBar(scene, 0), leadForBar(scene, BARS_PER_PHRASE));
  // An unknown outcome is the neutral track.
  assert.deepEqual(createSceneMode("reveal:other").bass, revealTracks.even.bass);
});

test("each reveal track has its mood: major for received, minor and slower for paid, between for even", () => {
  const { gain, even, cost } = revealTracks;
  const pcs = (track) => new Set(track.pad.filter(Boolean).flat().map(pitchClass));
  // C major's E (pitch class 7 from A) in the gain pad, A minor's C (3) and no C# in the cost pad.
  assert.ok(pcs(gain).has(7) && pcs(gain).has(3), "C - E: a major third");
  assert.ok(pcs(cost).has(0) && pcs(cost).has(3) && !pcs(cost).has(4), "A - C: a minor third");
  // Even: open fifths, no chord with a third over its root (Dsus2 and Csus2).
  for (const chord of even.pad.filter(Boolean)) {
    const above = chord.slice(1).map((note) => (pitchClass(note) - pitchClass(chord[0]) + 12) % 12);
    assert.ok(above.includes(7) && !above.includes(3) && !above.includes(4), `${chord}: a fifth, no third`);
  }
  assert.ok(cost.stepMs > even.stepMs && even.stepMs > gain.stepMs, "paid is the slowest, received the quickest");
  const lead = (track) => track.leads[0].filter(Boolean);
  assert.ok(lead(gain).at(-1) > lead(gain)[0], "received climbs");
  assert.ok(lead(cost).at(-1) < lead(cost)[0], "paid falls");
});

test("the reveal's sheet sets the music while it is open", () => {
  assert.ok(runtime.includes("revealOutcome(decisionReveal.effect, { busted: decisionReveal.verdict?.outcome === \"bust\" })"));
  assert.ok(runtime.includes("if (revealMusic) return revealMusic;"));
});
