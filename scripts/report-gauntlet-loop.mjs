import assert from "node:assert/strict";
import {
  BASE_SCHEMA,
  createWindow,
  FOCUS_MAX,
  FOCUS_MODES,
  getCloseness,
  getHeartbeatBpm,
  getSealedCardId,
  judgeBeat,
  GROOVE_CAP,
  HAND_CAP,
  openCaseRun,
  reduceWindow,
  resolveWindow,
} from "../src/gauntlet/gauntletEngine.js";
import { hasRelic, RELIC_IDS } from "../src/gauntlet/relics.js";
import { CASE_RESULT_NODES, CASE_SEQUENCE, CASE_START_NODES, nodes } from "../src/gameData.js";

/**
 * The gauntlet's balance, measured.
 *
 * A case is a string of windows against one pot that a bust wipes. Every policy
 * below plays the same seeded cases, so the numbers compare like for like. The
 * assertions are the properties the loop is built on:
 *
 * - the bet is a bet: the best blind policy pushes some, not zero and not all
 *   the way, and it busts often enough to matter;
 * - the heartbeat is worth listening to, but it is not the answer: the best
 *   heartbeat policy beats the best blind one, and stays far below a player who
 *   could see the wall;
 * - a bust changes what the next window is, not just what the score is;
 * - a bust skips the next scene, which shortens the case. That must never be a
 *   shortcut: busting on purpose to reach the case's end sooner has to bank far
 *   less than playing the table;
 * - the beat is a hand skill, not a second instrument: pushing on every beat
 *   busts exactly as often as not being graded at all, pays more but never more
 *   than the groove cap, and a player who slips every push banks no more than
 *   one who is never graded;
 * - LOCK is the same hand: a hand that charges a stance to the full and pushes
 *   on every beat is paid under one cap for both, reads the heartbeat no better
 *   for it, and cannot charge one stance and cash another. What a stance
 *   carries into the next board is a rule like a relic's and is held to the
 *   relic's cap;
 * - a relic bends a rule, it does not break the table: with every relic alone
 *   and all of them together, the heartbeat still beats playing blind and still
 *   stays far under a player who could see the wall, busting to skip still
 *   loses, and no single relic lifts the best play by more than RELIC_LIFT_CAP.
 */

const CASES = 1500;
/** The most one relic may lift best play. */
const RELIC_LIFT_CAP = 1.35;
/** What a charged stance carries into the next board is a rule too, and is held to the same. */
const STANCE_LIFT_CAP = RELIC_LIFT_CAP;
/**
 * Windows per case, measured from the graph rather than assumed. It was a flat
 * 7, which was the length of a case when the first six were written; the
 * season's cases now walk 7 to 10 scenes, and a case is a string of windows
 * against one pot, so the length moves both what a case banks and what a skip
 * saves. Seeded walks of every case, rounded to the nearest window.
 */
function measureWindowsPerCase(walksPerCase = 40) {
  let seed = 20260927;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const results = new Set(Object.values(CASE_RESULT_NODES));
  let scenes = 0;
  let walks = 0;
  for (const caseId of CASE_SEQUENCE) {
    for (let walk = 0; walk < walksPerCase; walk += 1) {
      let nodeId = CASE_START_NODES[caseId];
      for (let step = 0; step < 60 && nodeId && !results.has(nodeId); step += 1) {
        const choices = (nodes[nodeId]?.choices ?? []).filter((choice) => choice.type !== "reframe");
        if (!choices.length) break;
        scenes += 1;
        nodeId = choices[Math.floor(random() * choices.length)].next;
      }
      walks += 1;
    }
  }
  return scenes / walks;
}
const MEASURED_WINDOWS_PER_CASE = measureWindowsPerCase();
const WINDOWS_PER_CASE = Math.round(MEASURED_WINDOWS_PER_CASE);
const card = { id: "sim", label: "sim", effect: { capital: 12, trust: 6, humanCost: 4 } };

/** A lock waits for a beat, and the clock runs while it does. */
const LOCK_SECONDS = 0.6;

function playCase(caseIndex, decide, grade = null, relics = [], lock = null) {
  let run = openCaseRun({ relics });
  let busts = 0;
  let mutatedAfterBust = 0;
  let played = 0;
  for (let windowIndex = 0; windowIndex < WINDOWS_PER_CASE; windowIndex += 1) {
    played += 1;
    let win = createWindow({ schema: run.schema, seed: `sim:${caseIndex}:${windowIndex}`, beatCombo: run.beatCombo });
    win = reduceWindow(win, { type: "SELECT", id: card.id });
    if (lock) {
      // Charged to the full on the beat, before the first push.
      win = reduceWindow(win, { type: "SET_FOCUS_MODE", mode: lock.mode });
      for (let press = 0; press < 8 && win.status === "live" && win.focus < FOCUS_MAX; press += 1) {
        win = reduceWindow(win, { type: "FOCUS", grade: "perfect" });
        win = reduceWindow(win, { type: "TICK", delta: LOCK_SECONDS });
      }
    }
    for (let press = 0; press < 30 && win.status === "live"; press += 1) {
      if (!decide(win, run)) break;
      win = reduceWindow(win, { type: "PUSH", grade });
      win = reduceWindow(win, { type: "TICK", delta: 0.6 });
    }
    if (lock?.cashAs && win.status === "live") win = reduceWindow(win, { type: "SET_FOCUS_MODE", mode: lock.cashAs });
    if (win.status === "live") win = reduceWindow(win, { type: "CASH" });
    const caseClosed = windowIndex === WINDOWS_PER_CASE - 1;
    const { verdict, nextRun } = resolveWindow({ run, window: win, card, caseClosed });
    if (verdict.outcome === "bust") {
      busts += 1;
      if (!caseClosed && nextRun.schema.faceDown && nextRun.schema.startGauge > 0) mutatedAfterBust += 1;
      // The blackout skip: the room plays the next scene without the player. It
      // never skips onto the result, so the case's last window is always played.
      if (windowIndex < WINDOWS_PER_CASE - 2) windowIndex += 1;
    }
    run = nextRun;
  }
  return { vault: run.vault, busts, mutatedAfterBust, played };
}

function measure(label, decide, grade = null, relics = [], cases = CASES, lock = null) {
  let vault = 0;
  let busts = 0;
  let mutated = 0;
  let played = 0;
  for (let caseIndex = 0; caseIndex < cases; caseIndex += 1) {
    const result = playCase(caseIndex, decide, grade, relics, lock);
    vault += result.vault;
    busts += result.busts;
    mutated += result.mutatedAfterBust;
    played += result.played;
  }
  return {
    label,
    meanVault: Math.round(vault / cases),
    bustRate: Number((busts / Math.max(1, played)).toFixed(3)),
    meanWindows: Number((played / cases).toFixed(2)),
    busts,
    mutated,
  };
}

// Blind: the gauge and the band are on screen, so the natural blind policy is a
// target heat -- keep pushing until the gauge reads at least this much.
const fixed = [0, 20, 30, 40, 50, 60, 70, 80, 90].map((target) =>
  measure(`heat ${target}`, (win) => win.gauge < target),
);
const heartbeat = [80, 90, 100, 110, 120, 130, 140, 150, 160].map((threshold) =>
  measure(`heartbeat < ${threshold}`, (win) =>
    getHeartbeatBpm(win.gauge, win.wall + win.tellOffset, win.schema.sedated) < threshold,
  ),
);
// A player who can see the wall and never presses into it. Nobody can play this
// way; it is the ceiling the other policies are measured against.
const oracle = measure("sees the wall", (win) => win.gauge + win.schema.stepMax < win.wall);
// Blows up every window it can to reach the end of the case sooner, and plays the
// last window (which a skip can never jump over) the way the best blind policy does.
const skipper = measure("bust to skip", (win) =>
  win.seed.endsWith(`:${WINDOWS_PER_CASE - 1}`) ? win.gauge < 50 : true,
);

function bestOfRows(list) {
  return list.reduce((best, row) => (row.meanVault > best.meanVault ? row : best));
}

// The same best heartbeat policy, played by three hands: one on every beat, one
// off every beat, and the untimed simulation above.
const heartbeatThreshold = (label) => Number(label.split("< ")[1]);
const bestHeartbeatSoFar = heartbeat.reduce((best, row) => (row.meanVault > best.meanVault ? row : best));
const listening = (win) => getHeartbeatBpm(win.gauge, win.wall + win.tellOffset, win.schema.sedated) < heartbeatThreshold(bestHeartbeatSoFar.label);
const onBeat = measure("on every beat", listening, "perfect");
const offBeat = measure("off every beat", listening, "miss");

// The whole hand: a stance charged to the full, then every push on the beat.
// Each stance is played blind, listening and seeing the wall, so the heartbeat
// is compared like for like, and once more by a hand that charges STEADY -- the
// stance that cools the gauge -- and changes to STRIKE to cash.
const locking = (label, decide, lock) => measure(label, decide, "perfect", [], CASES, lock);
const lockReport = FOCUS_MODES.map((mode) => ({
  mode,
  blind: bestOfRows([40, 50, 60].map((target) => locking(`${mode} lock, heat ${target}`, (win) => win.gauge < target, { mode }))),
  listen: locking(`${mode} lock, listening`, listening, { mode }),
  sees: locking(`${mode} lock, sees the wall`, (win) => win.gauge + win.schema.stepMax < win.wall, { mode }),
}));
const swapped = locking("steady lock, cashed as strike", listening, { mode: "steady", cashAs: "strike" });

const rows = [...fixed, ...heartbeat, oracle, skipper, onBeat, offBeat, ...lockReport.flatMap((row) => [row.blind, row.listen, row.sees]), swapped];
for (const row of rows) {
  console.log(
    `${row.label.padEnd(16)} vault ${String(row.meanVault).padStart(8)}  bust ${(row.bustRate * 100).toFixed(1).padStart(5)}%  windows ${row.meanWindows}`,
  );
}

const bestFixed = fixed.reduce((best, row) => (row.meanVault > best.meanVault ? row : best));
const bestHeartbeat = heartbeat.reduce((best, row) => (row.meanVault > best.meanVault ? row : best));

assert.notEqual(bestFixed.label, "heat 0", "never pushing cannot be the best blind policy, or there is no bet");
assert.notEqual(bestFixed.label, fixed.at(-1).label, "pushing as far as possible cannot be the best blind policy either");
assert.ok(bestFixed.bustRate >= 0.08 && bestFixed.bustRate <= 0.5, `the best blind policy should bust sometimes, not constantly (got ${bestFixed.bustRate})`);
assert.ok(bestHeartbeat.meanVault > bestFixed.meanVault, "listening to the heartbeat should be worth something");
assert.ok(
  bestHeartbeat.meanVault < oracle.meanVault * 0.6,
  `the heartbeat must not be an answer key: best ${bestHeartbeat.meanVault} against a wall-seeing ${oracle.meanVault}`,
);
assert.ok(skipper.meanWindows < WINDOWS_PER_CASE, "busting on purpose does shorten a case");
assert.ok(
  skipper.meanVault < bestFixed.meanVault * 0.25,
  `the skip must not be a shortcut: busting to skip banks ${skipper.meanVault} against ${bestFixed.meanVault} for the best blind policy`,
);
assert.equal(onBeat.busts, bestHeartbeatSoFar.busts, "timing must not move the wall: a perfectly timed hand busts exactly as often");
assert.ok(onBeat.meanVault > bestHeartbeatSoFar.meanVault, "pushing on the beat should pay");
assert.ok(
  onBeat.meanVault <= Math.ceil(bestHeartbeatSoFar.meanVault * (1 + GROOVE_CAP)) + 1,
  `the groove cannot pay past its cap: ${onBeat.meanVault} against ${bestHeartbeatSoFar.meanVault}`,
);
assert.ok(offBeat.meanVault <= bestHeartbeatSoFar.meanVault, "slipping every push must never pay better than not being graded");
assert.ok(
  onBeat.meanVault / bestHeartbeatSoFar.meanVault < bestHeartbeatSoFar.meanVault / Math.max(1, fixed.reduce((best, row) => Math.max(best, row.meanVault), 0)),
  "the beat must pay less than listening does: timing is the spice, reading the table is the game",
);
/**
 * LOCK, held to the beat's ratchets. Until 2026-09-28 no hand here ever locked,
 * and LOCK multiplied the pot outside the groove's cap: STRIKE at full charge
 * and a full groove paid x3.2, a hand that did both banked 3.5 times the best
 * listening policy and 1.9 times a player who could see the wall, and charging
 * STEADY to cash as STRIKE banked more than either stance alone.
 */
const listeningOverBlind = bestHeartbeatSoFar.meanVault / Math.max(1, bestFixed.meanVault);
for (const row of lockReport) {
  assert.ok(row.listen.meanVault > bestHeartbeatSoFar.meanVault, `a charged ${row.mode} LOCK should pay`);
  assert.ok(row.listen.meanVault > row.blind.meanVault, `with a ${row.mode} LOCK, listening must still beat playing blind`);
  assert.ok(
    row.listen.meanVault < row.sees.meanVault * 0.6,
    `with a ${row.mode} LOCK, the heartbeat must not become an answer key: ${row.listen.meanVault} against ${row.sees.meanVault}`,
  );
  assert.ok(
    row.listen.meanVault <= Math.ceil(bestHeartbeatSoFar.meanVault * HAND_CAP * STANCE_LIFT_CAP) + 1,
    `the ${row.mode} hand is paid past its cap: ${row.listen.meanVault} against ${bestHeartbeatSoFar.meanVault}`,
  );
  assert.ok(
    row.listen.meanVault < oracle.meanVault,
    `the ${row.mode} hand must never be worth more than seeing the wall: ${row.listen.meanVault} against ${oracle.meanVault}`,
  );
}
// EXPOSE carries nothing into the next board that the pot can see, so it is the
// hand's pay and nothing else: under the cap, and less than listening is worth.
const exposeHand = lockReport.find((row) => row.mode === "expose").listen;
assert.ok(
  exposeHand.meanVault <= Math.ceil(bestHeartbeatSoFar.meanVault * HAND_CAP) + 1,
  `the hand cannot pay past its cap: ${exposeHand.meanVault} against ${bestHeartbeatSoFar.meanVault}`,
);
assert.ok(
  exposeHand.meanVault / bestHeartbeatSoFar.meanVault < listeningOverBlind,
  "the hand must pay less than listening does: the beat and LOCK together are still the spice",
);
assert.ok(
  swapped.meanVault <= Math.max(...lockReport.map((row) => row.listen.meanVault)),
  `a charge belongs to its stance: charging STEADY to cash as STRIKE banked ${swapped.meanVault}`,
);

/**
 * Relics, played by a hand that can trip them.
 *
 * The policies above stake one card, press ungraded and never lock a stance --
 * which is right for the rules they hold, and meant eight of the thirteen relics
 * could not change a single number: METRONOME needs graded presses, LOCKPICK a
 * sealed card, SPLINT a fractured axis, ENCORE a combo to keep, STETHOSCOPE a
 * silenced board, and the three stance relics a mastered stance. A relic the
 * simulation cannot trip is a relic the lift cap cannot catch.
 *
 * So each relic set is replayed by a hand that does all of it: three cards
 * (one burns legitimacy past the fracture line), a card chosen in turn and
 * pushed to the seal when it is sealed, presses timed against the heartbeat's
 * own period with a human spread (METRONOME widens the windows it is judged
 * in), three FOCUS locks a window in a stance that rotates by case, and one
 * window in twenty-five left to run out the clock. The invariants above are
 * asserted again under every relic, and no single relic may lift best play by
 * more than RELIC_LIFT_CAP.
 */
const RELIC_CASES = 300;
const HAND = [
  { id: "people", label: "people", effect: { trust: 10, humanCost: -4, time: -6, capital: -3, fatigue: 5 } },
  { id: "record", label: "record", effect: { legitimacy: 10, time: -5, trust: -3, humanCost: 3, fatigue: 3 } },
  { id: "fast", label: "fast", effect: { capital: 8, time: 5, legitimacy: -12, trust: -3, humanCost: 3 } },
];
// Most hands lean on one or two stances; EXPOSE, which clears seals for good
// once mastered, is the one they reach for least.
const STANCES = ["strike", "steady", "strike", "steady", "expose"];
/** Cases a stance mastery is carried through before the hand starts a new season. */
const HAND_SEASON = 10;
/** How far a human press lands from the beat, as a share of the beat. */
const HAND_SPREAD = 0.14;

function handUnit(seed) {
  let value = 2166136261;
  for (const character of seed) value = Math.imul(value ^ character.charCodeAt(0), 16777619);
  value = (Math.imul(value >>> 0, 1664525) + 1013904223) >>> 0;
  value ^= value >>> 15;
  return (Math.imul(value, 2246822519) >>> 0) / 4294967296;
}

/** A press against the beat the stage would be sounding at this heat. */
function gradePress(win, relics, seed) {
  const bpm = getHeartbeatBpm(win.gauge, win.wall + win.tellOffset, win.schema.sedated);
  const period = 60000 / bpm;
  // Two uniforms make a rough bell: most presses land near the beat, a few far off.
  const offset = Math.abs(handUnit(`${seed}:a`) + handUnit(`${seed}:b`) - 1) * HAND_SPREAD * 2 * period;
  return judgeBeat(offset, period, hasRelic(relics, "metronome"));
}

function playHandCase(caseIndex, decide, relics, stanceMastery) {
  let run = openCaseRun({ relics, stanceMastery });
  let played = 0;
  for (let windowIndex = 0; windowIndex < WINDOWS_PER_CASE; windowIndex += 1) {
    played += 1;
    const seed = `hand:${caseIndex}:${windowIndex}`;
    let win = createWindow({ schema: run.schema, seed, beatCombo: run.beatCombo });
    // The richest card is the one a COLD FEET board seals, and the one a hand
    // wants most; otherwise the hand works through its cards in turn.
    const sealedId = getSealedCardId(HAND, run.schema);
    const card = HAND.find((candidate) => candidate.id === sealedId) ?? HAND[windowIndex % HAND.length];
    win = reduceWindow(win, { type: "SET_FOCUS_MODE", mode: STANCES[caseIndex % STANCES.length] });
    win = reduceWindow(win, { type: "SELECT", id: card.id });
    for (let lock = 0; lock < 3 && win.status === "live"; lock += 1) {
      win = reduceWindow(win, { type: "FOCUS", grade: gradePress(win, relics, `${seed}:focus:${lock}`) });
    }
    const mood = handUnit(`${seed}:mood`);
    if (mood < 0.04) {
      // Walked away from the table: the clock runs out.
      while (win.status === "live") win = reduceWindow(win, { type: "TICK", delta: 1 });
    }
    const sealed = card.id === sealedId;
    // One window in eight is cashed cold, as early as the table allows: COLD
    // FEET seals the next hand's richest card, and a sealed card has to be
    // pushed to the seal before it cashes -- which is what LOCKPICK and GLASS
    // LENS bend.
    const cold = mood >= 0.04 && mood < 0.165;
    for (let press = 0; press < 30 && win.status === "live"; press += 1) {
      const mustOpen = sealed && win.gauge < win.schema.sealBreak;
      if (!mustOpen && (cold || !decide(win, run))) break;
      win = reduceWindow(win, { type: "PUSH", grade: gradePress(win, relics, `${seed}:push:${press}`) });
      win = reduceWindow(win, { type: "TICK", delta: 0.6 });
    }
    if (win.status === "live") win = reduceWindow(win, { type: "CASH" });
    const caseClosed = windowIndex === WINDOWS_PER_CASE - 1;
    const { verdict, nextRun } = resolveWindow({ run, window: win, card, caseClosed });
    if (verdict.outcome === "bust" && windowIndex < WINDOWS_PER_CASE - 2) windowIndex += 1;
    run = nextRun;
  }
  return { vault: run.vault, played, stanceMastery: run.stanceMastery };
}

function measureHand(label, decide, relics) {
  let vault = 0;
  let played = 0;
  // A stance only reshapes a board once it is mastered, three charged cashes
  // in, so each case carries on from the last one's mastery the way a season
  // does, for HAND_SEASON cases at a time.
  let stanceMastery;
  for (let caseIndex = 0; caseIndex < RELIC_CASES; caseIndex += 1) {
    if (caseIndex % HAND_SEASON === 0) stanceMastery = undefined;
    const result = playHandCase(caseIndex, decide, relics, stanceMastery);
    stanceMastery = result.stanceMastery;
    vault += result.vault;
    played += result.played;
  }
  return { label, meanVault: Math.round(vault / RELIC_CASES), meanWindows: Number((played / RELIC_CASES).toFixed(2)) };
}

const relicSets = [[], ...RELIC_IDS.map((id) => [id]), RELIC_IDS];
const bestOf = bestOfRows;
const relicReport = relicSets.map((relics) => {
  const name = relics.length === 0 ? "none" : relics.length === RELIC_IDS.length ? "all" : relics[0];
  const blind = bestOf([40, 50, 60].map((target) => measureHand(`${name} heat ${target}`, (win) => win.gauge < target, relics)));
  const listen = bestOf([90, 100, 110].map((threshold) =>
    measureHand(`${name} heartbeat < ${threshold}`, (win) => getHeartbeatBpm(win.gauge, win.wall + win.tellOffset, win.schema.sedated) < threshold, relics),
  ));
  const sees = measureHand(`${name} sees the wall`, (win) => win.gauge + win.schema.stepMax < win.wall, relics);
  const skip = measureHand(`${name} bust to skip`, (win) => (win.seed.endsWith(`:${WINDOWS_PER_CASE - 1}`) ? win.gauge < 50 : true), relics);
  return { name, relics, blind, listen, sees, skip };
});
const relicBaseline = relicReport[0];
for (const row of relicReport) {
  console.log(
    `relic ${row.name.padEnd(12)} blind ${String(row.blind.meanVault).padStart(6)}  heartbeat ${String(row.listen.meanVault).padStart(6)}  sees ${String(row.sees.meanVault).padStart(6)}  skip ${String(row.skip.meanVault).padStart(5)}`,
  );
  assert.ok(row.listen.meanVault > row.blind.meanVault, `with ${row.name}, listening to the heartbeat must still beat playing blind`);
  assert.ok(row.listen.meanVault < row.sees.meanVault * 0.6, `with ${row.name}, the heartbeat must not become an answer key: ${row.listen.meanVault} against ${row.sees.meanVault}`);
  assert.ok(row.skip.meanVault < row.blind.meanVault * 0.25, `with ${row.name}, busting to skip must stay a loss: ${row.skip.meanVault} against ${row.blind.meanVault}`);
  if (row.relics.length === 1) {
    assert.ok(
      row.listen.meanVault <= relicBaseline.listen.meanVault * RELIC_LIFT_CAP,
      `${row.name} is a win button: best play banks ${row.listen.meanVault} against ${relicBaseline.listen.meanVault} without it`,
    );
  }
}
// Every relic has to be something the simulation can trip, or the cap above is
// guarding nothing for it. SPLINT is the one exception by design: it bends what
// a fracture bills a card's costs, which is a resource on the report, never the
// pot, so no vault can show it (the unit tests hold what it does).
const RESOURCE_ONLY_RELICS = new Set(["splint"]);
const inert = relicReport
  .filter((row) => row.relics.length === 1 && !RESOURCE_ONLY_RELICS.has(row.name))
  .filter((row) => ["blind", "listen", "sees", "skip"].every((key) => row[key].meanVault === relicBaseline[key].meanVault))
  .map((row) => row.name);
assert.deepEqual(inert, [], `relics the simulation never trips: ${inert.join(", ")}`);

// Late in the season the board leans in (`getSeasonEscalation`). The table's
// rules have to hold there too, not only on a fresh run.
const lateSeason = (label, decide) => {
  let vault = 0;
  for (let caseIndex = 0; caseIndex < RELIC_CASES; caseIndex += 1) {
    let run = openCaseRun({ windowIndex: 450 });
    for (let windowIndex = 0; windowIndex < WINDOWS_PER_CASE; windowIndex += 1) {
      let win = createWindow({ schema: run.schema, seed: `late:${caseIndex}:${windowIndex}`, beatCombo: run.beatCombo });
      win = reduceWindow(win, { type: "SELECT", id: card.id });
      for (let press = 0; press < 30 && win.status === "live" && decide(win); press += 1) {
        win = reduceWindow(win, { type: "PUSH" });
        win = reduceWindow(win, { type: "TICK", delta: 0.6 });
      }
      if (win.status === "live") win = reduceWindow(win, { type: "CASH" });
      const caseClosed = windowIndex === WINDOWS_PER_CASE - 1;
      const { verdict, nextRun } = resolveWindow({ run, window: win, card, caseClosed });
      if (verdict.outcome === "bust" && windowIndex < WINDOWS_PER_CASE - 2) windowIndex += 1;
      run = nextRun;
    }
    vault += run.vault;
  }
  return { label, meanVault: Math.round(vault / RELIC_CASES) };
};
const lateBlind = bestOf([30, 40, 50].map((target) => lateSeason(`late heat ${target}`, (win) => win.gauge < target)));
const lateListen = bestOf([80, 90, 100].map((threshold) => lateSeason(`late heartbeat < ${threshold}`, (win) => getHeartbeatBpm(win.gauge, win.wall + win.tellOffset, win.schema.sedated) < threshold)));
const lateSees = lateSeason("late sees the wall", (win) => win.gauge + win.schema.stepMax < win.wall);
console.log(`late season      blind ${lateBlind.meanVault} (${lateBlind.label})  heartbeat ${lateListen.meanVault} (${lateListen.label})  sees ${lateSees.meanVault}`);
assert.ok(lateListen.meanVault > lateBlind.meanVault, "late in the season, listening must still beat playing blind");
assert.ok(lateListen.meanVault < lateSees.meanVault * 0.6, "late in the season, the heartbeat must still not be an answer key");

const bustRows = rows.filter((row) => row.busts > 0);
assert.ok(
  bustRows.every((row) => row.mutated > 0),
  "a bust mid-case always deals a broken board next",
);
assert.equal(BASE_SCHEMA.stepMin > 0, true);
assert.ok(getCloseness(0, 90) === 0);

console.log(
  `Gauntlet loop checks passed (${WINDOWS_PER_CASE} windows a case, measured ${MEASURED_WINDOWS_PER_CASE.toFixed(2)}; best blind: ${bestFixed.label}, ${bestFixed.meanVault}; best heartbeat: ${bestHeartbeat.label}, ${bestHeartbeat.meanVault}; ceiling ${oracle.meanVault}; bust to skip: ${skipper.meanVault} over ${skipper.meanWindows} windows; on the beat: ${onBeat.meanVault}, off it: ${offBeat.meanVault}; locked and on the beat: ${lockReport.map((row) => `${row.mode} ${row.listen.meanVault}`).join(", ")}).`,
);
