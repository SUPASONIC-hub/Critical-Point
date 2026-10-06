import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { getAftermath, getOriginEndingVariant } from "../../src/advancedSystems.js";
import { getOperatorReveal } from "../../src/featurePack.js";
import { nodes } from "../../src/gameData.js";
import { createCaseSummary, getGameplayStats, getSeasonStrain } from "../../src/gameLogic.js";
import { FX_READERS, FX_VARIABLES } from "../../src/gauntlet/fxVariables.js";
import {
  applyGauntletEffect,
  applyRelics,
  BASE_SCHEMA,
  buildNextSchema,
  createOpenSeed,
  createTableRecord,
  createWindow,
  ESCALATION_STEP_WINDOWS,
  FOCUS_MODES,
  getEscalationWindow,
  getFocusBonus,
  getGrooveBonus,
  getHandBonus,
  getMultiplier,
  getReadingSeconds,
  HAND_CAP,
  HOT_CASH_MULTIPLIER,
  judgeBeat,
  MUTATIONS,
  normalizeRunState,
  normalizeSchema,
  openCaseRun,
  READING_MAX_SECONDS,
  reduceWindow,
  resolveWindow,
  RUN_INITIAL_STATE,
  SEAL_BREAK_GAUGE,
  seededUnit,
  serializeRunState,
  splitOpenSeed,
  suspendWindow,
} from "../../src/gauntlet/gauntletEngine.js";
import { RELIC_IDS, RELICS } from "../../src/gauntlet/relics.js";
import { formatMultiplier } from "../../src/gauntlet/tableReadout.js";

/**
 * The table's invariants, held over every board the rules can deal rather than
 * over the two or three a test author thought of. The example this replaces
 * tried two windows against five relic sets in the default stance and called
 * it "every relic set a season can hold"; the board that broke the sealed-card
 * rule needed one relic, a streak, a charged STRIKE and a cold cash at once.
 */

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const card = (id, effect) => ({ id, label: id, effect, next: "x" });
const staked = card("a", { capital: 9, trust: -12 });

/** Every subset of the relics that change a board's numbers, and all thirteen together. */
const BOARD_RELICS = ["highRoller", "lockpick", "heatSink", "coldBlood", "kineticGrip", "steadyAnchor", "glassLens"];
const RELIC_SETS = [
  ...Array.from({ length: 2 ** BOARD_RELICS.length }, (_, mask) => BOARD_RELICS.filter((_id, bit) => mask & (1 << bit))),
  [...RELIC_IDS],
];
const MASTERIES = [{}, { strike: 3, steady: 3, expose: 3 }, { strike: 9, steady: 9, expose: 9 }];
const CLOSURES = [
  { outcome: "cash", cause: "cash" },
  { outcome: "bust", cause: "push" },
  { outcome: "bust", cause: "timeout" },
];

/** Every closure the rules can build a board from: about a hundred thousand. */
function* everyClosure() {
  for (const relics of RELIC_SETS) {
    for (const streak of [0, 1, 5]) {
      for (const windowIndex of [0, 460]) {
        for (const stanceMastery of MASTERIES) {
          for (const focusMode of FOCUS_MODES) {
            for (const focusCharge of [0, 100]) {
              for (const gauge of [3, 72]) {
                for (const pushes of [0, 4]) {
                  for (const { outcome, cause } of CLOSURES) {
                    for (const caseClosed of [false, true]) {
                      yield { outcome, cause, gauge, pushes, streak, burnAxis: "trust", caseClosed, relics, focusMode, focusCharge, focusHits: focusCharge ? 4 : 0, stanceMastery, windowIndex };
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

/** What is wrong with a board, or null. A message is only built for a board that fails. */
function faultOf(schema) {
  if (schema.sealBreak > SEAL_BREAK_GAUGE) return `the seal opens later than ${SEAL_BREAK_GAUGE}`;
  if (schema.sealBreak - 1 + schema.stepMax >= schema.wallMin) {
    return `one push from just under the seal reaches the lowest wall (seal ${schema.sealBreak}, step ${schema.stepMax}, wall ${schema.wallMin})`;
  }
  if (schema.startGauge > schema.wallMin - 8) return `it opens at ${schema.startGauge}, within 8 of a wall at ${schema.wallMin}`;
  if (schema.wallMin > schema.wallMax || schema.stepMin > schema.stepMax) return "a band is upside down";
  return null;
}

function assertBoard(schema, describe) {
  const fault = faultOf(schema);
  if (fault) assert.fail(`${typeof describe === "function" ? describe() : describe}: ${fault}`);
}

test("every board the rules can deal keeps the sealed-card rule and its start under the wall", () => {
  let boards = 0;
  let sealed = 0;
  let tightened = 0;
  for (const closure of everyClosure()) {
    const schema = buildNextSchema(closure);
    assertBoard(schema, () => JSON.stringify(closure));
    boards += 1;
    if (schema.sealHighest) sealed += 1;
    if (schema.sealHighest && schema.sealBreak < SEAL_BREAK_GAUGE && !closure.relics.some((id) => id === "lockpick" || id === "glassLens") && closure.focusMode !== "expose") tightened += 1;
    if (boards % 499 === 0) assert.deepEqual(normalizeSchema(schema), schema, "a dealt board is already normal");
  }
  assert.ok(boards > 100_000, `the enumeration is the point: ${boards} boards`);
  assert.ok(sealed > 10_000, `and it has to reach sealed boards: ${sealed}`);
  assert.ok(tightened > 0, "including the ones the rule had to make room on");
  // The board that broke it: HIGH ROLLER alone, a streak, a charged STRIKE, a cold cash.
  const { nextRun } = resolveWindow({
    run: normalizeRunState({ relics: ["highRoller"], streak: 2 }),
    window: { status: "cashed", gauge: 22, pushes: 0, focus: 80, focusMode: "strike", focusHits: 3 },
    card: staked,
  });
  assert.deepEqual([nextRun.schema.stepMax, nextRun.schema.wallMin], [24, 52], "the push and the wall are what their rules made them");
  assert.ok(nextRun.schema.sealHighest && nextRun.schema.sealBreak < SEAL_BREAK_GAUGE, "and the seal opens earlier to make room");
});

test("a board opened, abandoned or re-dealt by a relic keeps the same rules", () => {
  for (const relics of RELIC_SETS) {
    for (const stanceMastery of MASTERIES) {
      for (const windowIndex of [0, 460]) {
        const opened = openCaseRun({ relics, stanceMastery, windowIndex });
        assertBoard(opened.schema, () => `opened with ${relics.join("+") || "nothing"}`);
        for (const id of RELIC_IDS) assertBoard(applyRelics(opened.schema, [...relics, id]), () => `${id} on top of ${relics.join("+") || "nothing"}`);
      }
    }
  }
  const mastered = openCaseRun({ stanceMastery: { strike: 3 } });
  assert.ok(mastered.schema.mutations.includes("strikeMastery"), "an abandoned case reopens with the stances the season has mastered");
});

test("a run survives any number of save round trips unchanged", () => {
  let checked = 0;
  for (const closure of everyClosure()) {
    if ((checked += 1) % 997) continue;
    const { relics, streak, windowIndex, stanceMastery, outcome, cause, gauge, pushes, focusMode, focusCharge, focusHits, caseClosed } = closure;
    const run = normalizeRunState({ relics, streak, windowIndex, stanceMastery, runPot: 1200, vault: 300 });
    const window = { status: outcome === "cash" ? "cashed" : "bust", cause, gauge, wall: 90, pushes, focus: focusCharge, focusMode, focusHits, groove: 6, beatCombo: 3, seed: `trip:${checked}` };
    const { nextRun } = resolveWindow({ run, window, card: staked, caseClosed, offerRelics: true });
    const once = normalizeRunState(JSON.parse(JSON.stringify(serializeRunState(nextRun))));
    assert.deepEqual(once, nextRun);
    assert.deepEqual(normalizeRunState(JSON.parse(JSON.stringify(serializeRunState(once)))), once);
  }
  const practising = openCaseRun({ vault: 900, relics: ["splint"], stanceMastery: { steady: 2 } }, { replayOf: { pushRecord: { busts: 1, cashes: 8 } } });
  assert.deepEqual(normalizeRunState(JSON.parse(JSON.stringify(serializeRunState(practising)))), practising, "a practice run too");
});

test("a bust never pays: no effect it applies is a gain", () => {
  const keys = ["time", "capital", "trust", "legitimacy", "humanCost", "fatigue"];
  for (let sample = 0; sample < 4000; sample += 1) {
    const effect = Object.fromEntries(keys.map((key) => [key, Math.round((seededUnit(`effect:${sample}:${key}`) * 2 - 1) * 24)]));
    const axis = keys[sample % keys.length];
    const bust = applyGauntletEffect(effect, { outcome: "bust", gauge: 80, fracturedAxis: axis });
    for (const [key, value] of Object.entries(bust)) {
      const rising = key === "humanCost" || key === "fatigue";
      assert.ok(rising ? value >= 0 : value <= 0, `${key} ${value} from ${JSON.stringify(effect)}`);
    }
    const cash = applyGauntletEffect(effect, { outcome: "cash", gauge: 80, fracturedAxis: axis });
    for (const key of keys) {
      if (bust[key] !== 0) assert.equal(cash[key], bust[key], "and a cash bills exactly the costs a bust does");
    }
  }
});

test("halves round the same way on both sides of zero", () => {
  assert.equal(applyGauntletEffect({ trust: -5 }, { outcome: "cash", fracturedAxis: "trust" }).trust, -8, "a fractured -5 is billed 8, like a +5");
  assert.equal(applyGauntletEffect({ fatigue: 5 }, { outcome: "cash", fracturedAxis: "fatigue" }).fatigue, 8);
  // x1.3 at gauge 20: a falling 사람 피해 rides the heat exactly as a rising 믿음 does.
  const hot = applyGauntletEffect({ humanCost: -5, trust: 5 }, { outcome: "cash", gauge: 20 });
  assert.equal(hot.humanCost, -hot.trust);
});

test("a closed window ignores every input", () => {
  const events = [
    { type: "TICK", delta: 1 },
    { type: "PUSH", grade: "perfect" },
    { type: "FOCUS", grade: "perfect" },
    { type: "SET_FOCUS_MODE", mode: "steady" },
    { type: "SELECT", id: "b" },
    { type: "CASH" },
    { type: "REDEAL", schema: BASE_SCHEMA },
  ];
  const live = reduceWindow(createWindow({ seed: "closed" }), { type: "SELECT", id: "a" });
  const closed = [
    reduceWindow(live, { type: "CASH" }),
    { ...live, status: "bust", cause: "push" },
    createWindow({ seed: "closed", abandoned: true }),
    createWindow({ seed: "closed", abandoned: true, closedAs: "timeout" }),
  ];
  for (const window of closed) {
    assert.notEqual(window.status, "live");
    for (const event of events) assert.equal(reduceWindow(window, event), window, `${window.status}/${window.cause} took ${event.type}`);
  }
});

test("a resumed window is live, under its wall and inside its clock, whatever the save says", () => {
  for (let sample = 0; sample < 600; sample += 1) {
    const seed = `resume:${sample}`;
    const schema = sample % 3 ? BASE_SCHEMA : applyRelics({ ...BASE_SCHEMA, startGauge: 22, wallMin: 50, wallMax: 86 }, ["highRoller"]);
    const tampered = { gauge: seededUnit(`${seed}:g`) * 400 - 50, elapsed: seededUnit(`${seed}:e`) * 400 - 50, pushes: 3.7, selectedId: "a", focusMode: "nope", wall: 1, status: "cashed" };
    const resumed = createWindow({ schema, seed, resume: tampered });
    const fresh = createWindow({ schema, seed });
    assert.equal(resumed.status, "live");
    assert.equal(resumed.wall, fresh.wall, "the wall is dealt from the seed, never read from the save");
    assert.equal(resumed.tellOffset, fresh.tellOffset);
    assert.ok(resumed.gauge >= 0 && resumed.gauge < resumed.wall);
    assert.ok(resumed.elapsed >= 0 && resumed.elapsed < resumed.schema.seconds);
    assert.equal(resumed.focusMode, "strike");
    assert.ok(Number.isInteger(resumed.pushes));
  }
  assert.equal(suspendWindow({ ...createWindow({ seed: "s" }), status: "bust" }, 0), null, "only a live window is put down");
});

test("a bust reloaded under its slam stays closed, and breaks the board it would have", () => {
  assert.equal(createOpenSeed("run:3:start", "tab-a"), "run:3:start#tab-a");
  assert.deepEqual(splitOpenSeed(createOpenSeed("run:3:start", "tab-a", "timeout")), { seed: "run:3:start", token: "tab-a", closedAs: "timeout" });
  assert.equal(splitOpenSeed(createOpenSeed("run:3:start", "tab-a", "cash")).closedAs, null, "only a bust is a closure");
  assert.equal(splitOpenSeed("run:3:start#tab-a~made-up").closedAs, null);
  assert.equal(splitOpenSeed("run:3:start~1#tab-a").seed, "run:3:start~1", "a re-dealt seed keeps its own mark");

  const back = createWindow({ seed: "slam", abandoned: true, closedAs: "timeout" });
  assert.deepEqual([back.status, back.cause, back.closedAs], ["bust", "abandon", "timeout"]);
  assert.equal(back.gauge, BASE_SCHEMA.startGauge, "and it still does not print the wall");
  const { verdict, nextRun } = resolveWindow({ run: normalizeRunState({ runPot: 500 }), window: back, card: staked });
  assert.equal(verdict.cause, "timeout");
  assert.ok(nextRun.schema.mutations.includes("silence"), "running out the clock deals SILENCE, reload or not");
  assert.equal(nextRun.runPot, 0);
  const left = resolveWindow({ run: RUN_INITIAL_STATE, window: createWindow({ seed: "slam", abandoned: true }), card: staked });
  assert.equal(left.verdict.cause, "abandon");
  assert.ok(!left.nextRun.schema.mutations.includes("silence"));
});

test("an early press is graded against the beat it was aimed at", () => {
  assert.equal(judgeBeat(-20, 600), "perfect", "20ms ahead of the stamp");
  assert.equal(judgeBeat(-90, 600), "good");
  assert.equal(judgeBeat(-300, 600), "miss", "half a beat early is a slip");
  assert.equal(judgeBeat(-601, 600), null, "further back than a beat there was no beat to aim at");
  for (let since = -600; since <= 1800; since += 7) assert.equal(judgeBeat(since, 600), judgeBeat(since + 600, 600), "the grade repeats with the beat");
});

test("the beat and LOCK are paid under one cap, and their shares add up", () => {
  for (const mode of FOCUS_MODES) {
    for (let focus = 0; focus <= 100; focus += 5) {
      for (let groove = 0; groove <= 40; groove += 2) {
        const hand = getHandBonus(groove, focus, mode);
        assert.ok(hand >= 1 && hand <= HAND_CAP, `${mode} ${focus}/${groove}: x${hand}`);
        assert.ok(hand >= getGrooveBonus(groove), "LOCK never takes the groove away");
        assert.ok(hand <= getGrooveBonus(groove) * getFocusBonus(focus, mode).pot + 0.006, "and the cap only ever takes away");
        const window = { status: "cashed", gauge: 44, pushes: 3, focus, focusMode: mode, focusHits: focus ? 3 : 0, groove, beatHits: groove ? 3 : 0 };
        const { verdict, nextRun } = resolveWindow({ run: RUN_INITIAL_STATE, window, card: staked });
        const base = Math.round(verdict.chips * verdict.multiplier);
        assert.equal(verdict.pot, base + verdict.tempo.groovePot + verdict.focus.pot, "base, groove and focus are the whole pot");
        assert.ok(verdict.pot <= Math.round(base * HAND_CAP) + 1);
        assert.ok(verdict.tempo.groovePot >= 0 && verdict.focus.pot >= 0);
        if (groove === 0) assert.equal(verdict.tempo.groovePot, 0, "no beat, no groove line");
        if (focus === 0) assert.equal(verdict.focus.pot, 0);
        assert.equal(nextRun.runGroove, verdict.tempo.groovePot + verdict.focus.pot, "the hand's whole share is what the vault slack leaves out");
      }
    }
  }
});

test("a charge belongs to the stance that built it", () => {
  let window = reduceWindow(createWindow({ seed: "stance" }), { type: "SELECT", id: "a" });
  window = reduceWindow(window, { type: "SET_FOCUS_MODE", mode: "steady" });
  for (let lock = 0; lock < 4; lock += 1) window = reduceWindow(window, { type: "FOCUS", grade: "perfect" });
  assert.ok(window.focus > 70);
  assert.equal(reduceWindow(window, { type: "SET_FOCUS_MODE", mode: "steady" }), window, "choosing the stance already held changes nothing");
  const swapped = reduceWindow(window, { type: "SET_FOCUS_MODE", mode: "strike" });
  assert.deepEqual([swapped.focusMode, swapped.focus, swapped.focusCombo], ["strike", 0, 0]);
  const { verdict, nextRun } = resolveWindow({ run: RUN_INITIAL_STATE, window: reduceWindow(swapped, { type: "CASH" }), card: staked });
  assert.equal(verdict.focus.stanceEarned, false);
  assert.ok(!nextRun.schema.mutations.includes("strikeWake"));
  assert.deepEqual(nextRun.stanceMastery, { strike: 0, steady: 0, expose: 0 });
});

test("the multiplier on the HUD never claims a threshold the rules refuse", () => {
  for (let tenth = 0; tenth <= 1000; tenth += 1) {
    const multiplier = getMultiplier(tenth / 10);
    const printed = Number(formatMultiplier(multiplier).slice(1));
    assert.ok(printed <= multiplier, `gauge ${tenth / 10}: prints ×${printed} for ${multiplier}`);
    if (printed >= HOT_CASH_MULTIPLIER) assert.ok(multiplier >= HOT_CASH_MULTIPLIER);
  }
  assert.equal(formatMultiplier(3.97), "×3.9");
  assert.equal(formatMultiplier(4), "×4.0");
  assert.equal(formatMultiplier(1.1), "×1.1");
});

test("a window remembers the slowest its clock was run, across being put down", () => {
  let window = createWindow({ schema: BASE_SCHEMA, seed: "slow-clock" });
  assert.equal(window.timeScale, 1);
  window = reduceWindow(window, { type: "TICK", delta: 0.05, scale: 2 });
  window = reduceWindow(window, { type: "TICK", delta: 0.1, scale: 1 });
  assert.equal(window.timeScale, 2, "putting the setting back does not take the mark off");
  assert.equal(reduceWindow(window, { type: "TICK", delta: 0.1, scale: "fast" }).timeScale, 2);
  assert.equal(reduceWindow(window, { type: "TICK", delta: 0.1 }).timeScale, 2);

  // Saved and left at ×2, resumed after the setting was set back to ×1 on the intro.
  const run = normalizeRunState({ windowIndex: 7, suspended: { seed: "slow-clock", windowIndex: 7, window } });
  const resumed = createWindow({ schema: BASE_SCHEMA, seed: "slow-clock", resume: run.suspended.window });
  assert.equal(resumed.timeScale, 2);
  assert.equal(createWindow({ schema: BASE_SCHEMA, seed: "slow-clock", resume: { timeScale: 0 } }).timeScale, 1);
});

test("practice windows do not walk the wall down", () => {
  const played = { windowIndex: ESCALATION_STEP_WINDOWS * 2, schema: { ...BASE_SCHEMA, mutations: [] } };
  const leaned = openCaseRun(played);
  const practised = openCaseRun({ ...played, practiceWindows: ESCALATION_STEP_WINDOWS * 2 });
  assert.ok(leaned.schema.wallMax < BASE_SCHEMA.wallMax, "two hundred windows of the season lean the table in");
  assert.equal(practised.schema.wallMax, BASE_SCHEMA.wallMax, "two hundred windows of practice do not");
  assert.equal(normalizeRunState({ windowIndex: 3, practiceWindows: 9 }).practiceWindows, 3, "never more practice than windows");
  assert.equal(normalizeRunState({ windowIndex: 3 }).practiceWindows, 0, "a save from before the count has none");
});

test("a rule or a count the save holds as null takes the default, not zero", () => {
  assert.equal(normalizeSchema({ ...BASE_SCHEMA, seconds: null }).seconds, BASE_SCHEMA.seconds);
  assert.equal(normalizeSchema({ ...BASE_SCHEMA, wallMin: null }).wallMin, BASE_SCHEMA.wallMin);
  assert.equal(normalizeRunState({ bestMultiplier: null }).bestMultiplier, RUN_INITIAL_STATE.bestMultiplier);
  assert.equal(normalizeRunState({ windowIndex: null }).windowIndex, 0);
});

test("a replayed case is practice: the table plays, and the season keeps nothing from it", () => {
  const first = { pushRecord: { ...createTableRecord([]), busts: 2, cashes: 6, bestMultiplier: 8 } };
  let run = normalizeRunState({ vault: 5000, grooveVault: 400, relics: ["splint"], relicOffer: ["encore"], stanceMastery: { strike: 2 }, bestMultiplier: 8, schema: { ...BASE_SCHEMA, mutations: ["reboot"] } });
  run = openCaseRun(run, { replayOf: first });
  assert.ok(run.practice);
  assert.deepEqual(run.relicOffer, [], "no draft is dealt at a replay's first table");
  const log = [];
  for (let index = 0; index < 4; index += 1) {
    const caseClosed = index === 3;
    const window = { status: "cashed", gauge: 72, pushes: 5, focus: 100, focusMode: "strike", focusHits: 4, seed: `replay:${index}` };
    const settled = resolveWindow({ run, window, card: staked, caseClosed, offerRelics: true });
    log.push({ caseId: "case01", threshold: { busted: false, potMultiplier: settled.verdict.multiplier, pot: settled.verdict.pot, pushes: 5, tempo: settled.verdict.tempo, focus: settled.verdict.focus } });
    assert.equal(settled.verdict.focus.stanceEarned, false);
    run = settled.nextRun;
    if (!caseClosed) assert.ok(run.runPot > 0, "the pot on the table is real while it is played");
    else assert.deepEqual([settled.verdict.practice, settled.verdict.secured], [true, 0]);
  }
  assert.equal(run.practice, null);
  assert.deepEqual([run.vault, run.grooveVault, run.relics, run.relicOffer], [5000, 400, ["splint"], ["encore"]], "the vault, the relics and the waiting draft are as they were");
  assert.deepEqual(run.stanceMastery, { strike: 2, steady: 0, expose: 0 });
  assert.equal(run.bestMultiplier, 8);
  assert.deepEqual(createTableRecord(log), first.pushRecord, "the summary keeps the record of the first close");
  assert.equal(createCaseSummary({}, {}, log, {}).pushRecord.busts, 2);

  assert.deepEqual([run.windowIndex, run.practiceWindows], [4, 4], "the windows are counted, and counted as practice");
  assert.equal(getEscalationWindow(run), 0, "so the season has not leaned in for them");

  const left = openCaseRun(openCaseRun({ vault: 5000, relicOffer: ["encore"], schema: { ...BASE_SCHEMA, mutations: ["reboot"] } }, { replayOf: first }));
  assert.deepEqual([left.vault, left.relicOffer, left.practice], [5000, ["encore"], null], "a replay left half way hands everything back");

  const closed = { case01: { caseId: "case01", finalHumanCost: 4, pushRecord: { busts: 1, cashes: 8 } }, case02: { caseId: "case02", finalHumanCost: 6, pushRecord: { busts: 0, cashes: 9 } } };
  const strain = getSeasonStrain(closed, { caseId: "case01", finalHumanCost: 10, pushRecord: { busts: 1, cashes: 8 } });
  assert.deepEqual([strain.casesPlayed, strain.seasonHumanCost, strain.seasonWindows], [2, 16, 18], "the replayed case is counted once, as it now stands");
  assert.equal(getSeasonStrain(closed, { caseId: "case03", finalHumanCost: 1 }).casesPlayed, 3);
});

test("a carried table record costs the score nothing", () => {
  const played = { responseTimeSec: 14, effect: { trust: 4 }, resourcesBefore: {}, resourcesAfter: {}, cognition: { inference: 1 } };
  const carried = { isSystemEvent: true, choiceId: "table-record-carry", threshold: { busted: true }, effect: {} };
  assert.equal(getGameplayStats([played, carried, carried, carried]).exploitPenalty, 0);
  assert.equal(getGameplayStats([played, { ...played, responseTimeSec: 1 }]).exploitPenalty, 5, "a two-second click still does");
});

test("the rules a sentence quotes are the rules the table applies", () => {
  const bust = resolveWindow({ run: RUN_INITIAL_STATE, window: { status: "bust", cause: "timeout", gauge: 60 }, card: staked }).nextRun.schema;
  assert.ok(MUTATIONS.aftershock.text.includes(`${bust.startGauge}에서`));
  assert.ok(MUTATIONS.silence.text.includes(`${bust.seconds}초`));
  assert.ok(MUTATIONS.blackout.text.includes(`${BASE_SCHEMA.wallMin - bust.wallMin} 가까워진다`));
  assert.ok(MUTATIONS.coldFeet.text.includes(`게이지 ${SEAL_BREAK_GAUGE}을`));
  assert.ok(RELICS.lockpick.text.includes(`${applyRelics(BASE_SCHEMA, ["lockpick"]).sealBreak}에서 열린다`));
  assert.ok(RELICS.coldBlood.text.includes("22가 아니라 11에서"));
  assert.ok(RELICS.steadyAnchor.text.includes("열기 4를 더"));
  for (const text of [...Object.values(MUTATIONS), ...Object.values(RELICS)].map((item) => item.text)) {
    assert.doesNotMatch(text, /\$\{|undefined|NaN/, text);
  }
});

test("the report prints names, never keys", () => {
  const texts = [
    ...["courier", "lab", "public", "made-up"].flatMap((origin) => [
      getAftermath("open-question", origin).text,
      getAftermath("collapse", origin).text,
      getOriginEndingVariant(origin, "field-pact").text,
      getOperatorReveal({ origin, completedCases: ["a", "b"] }).text,
    ]),
    getAftermath("made-up").text,
  ];
  for (const text of texts) assert.doesNotMatch(text, /[a-z]{3,}/, text);
});

test("no scene is cut short by the reading clock", () => {
  let longest = 0;
  for (const [id, node] of Object.entries(nodes)) {
    if (!node.choices?.length) continue;
    const chars = [node.lead, node.text, node.question, ...(node.memo ?? [])].filter(Boolean).join("").replace(/\s+/g, "").length;
    const needs = Math.round(6 + chars / 16);
    longest = Math.max(longest, needs);
    assert.ok(getReadingSeconds(node) >= Math.min(needs, READING_MAX_SECONDS));
    assert.ok(needs <= READING_MAX_SECONDS, `${id} needs ${needs}s and the page closes at ${READING_MAX_SECONDS}`);
  }
  assert.ok(READING_MAX_SECONDS - longest <= 5, `the ceiling stays a ceiling: longest scene ${longest}s`);
});

/**
 * The frame loop's variables are registered as not inherited, so a rule that
 * reads one on an element `FX_READERS` does not name reads the initial value
 * for ever -- silently. A pseudo-element cannot be written to at all.
 */
test("every rule that reads a frame-loop variable is on an element the loop writes to", () => {
  const sheets = path.join(root, "src/styles/app");
  const compounds = (selector) => selector.trim().split(/\s*[>+~]\s*|\s+/).filter(Boolean);
  const covers = (reader, selector) => {
    const want = compounds(reader);
    const have = compounds(selector);
    const last = have.at(-1);
    if (!last.replace(/:[\w-]+(\([^)]*\))?/g, "").includes(want.at(-1).replace(/^(?=[a-z])/, ""))) return false;
    const tail = want.at(-1);
    const subject = last.replace(/:[\w-]+(\([^)]*\))?/g, "");
    const names = tail.startsWith(".") ? subject.split(/(?=[.#])/).includes(tail) : subject.split(/(?=[.#])/)[0] === tail;
    return names && want.slice(0, -1).every((ancestor) => have.slice(0, -1).some((part) => part.split(/(?=[.#:])/).includes(ancestor)));
  };
  let uses = 0;
  for (const file of readdirSync(sheets).filter((name) => name.endsWith(".css"))) {
    const css = readFileSync(path.join(sheets, file), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    for (const [, selectors, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      for (const name of FX_VARIABLES) {
        if (!new RegExp(`var\\(${name}[,)]`).test(body)) continue;
        for (const selector of selectors.split(",").map((part) => part.trim()).filter(Boolean)) {
          uses += 1;
          assert.doesNotMatch(selector, /::/, `${file}: ${selector} reads ${name} on a pseudo-element`);
          const readers = FX_READERS[name].split(",").map((part) => part.trim());
          assert.ok(readers.some((reader) => covers(reader, selector)), `${file}: ${selector} reads ${name}, which the loop does not write there`);
        }
      }
    }
  }
  assert.ok(uses >= 20, `the scan has to find the readers it guards: ${uses}`);
});
