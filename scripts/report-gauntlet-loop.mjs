import assert from "node:assert/strict";
import {
  BASE_SCHEMA,
  createWindow,
  FOCUS_MAX,
  FOCUS_MODES,
  getCardChips,
  getCloseness,
  getHeartbeatBpm,
  getSealedCardId,
  getTableSchema,
  judgeBeat,
  GROOVE_CAP,
  HAND_CAP,
  openCaseRun,
  reduceWindow,
  resolveWindow,
} from "../src/gauntlet/gauntletEngine.js";
import { getLogicBonus, getLogicType } from "../src/gauntlet/logicStreak.js";
import { hasRelic, RELIC_IDS } from "../src/gauntlet/relics.js";
import { ALL_RULES, MUTATION_RULES, STORY_OFF_RULES, STORY_RULES, UNLOCK_LADDER } from "../src/gauntlet/tableUnlocks.js";
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
 *
 * All of that is measured with every rule on. The players take the rules a
 * case plays under as their last argument (`tableUnlocks`; a Set, everything
 * when left out) and hand them to the reducer and the settlement, and the
 * prologues' steps are measured at the end by passing each step's rules: the
 * bet, the heartbeat and the skip have to hold on the smallest table too.
 *
 * Story mode is measured last, and held to different properties on purpose: it
 * is the table stepping back, so what is asked of it is that it does step back
 * (see the story tier at the end).
 *
 * The logic streak is measured after that, with its switch forced on for its
 * own rows only (`LOGIC` in tableRules.js ships off): every row above is played
 * with the switch as shipped.
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

/**
 * `story` plays the case as a story run: the run carries the mark, so its
 * windows are dealt from the far wall (`getTableSchema`), and a bust skips no
 * scene (useChoiceCommit). It is `true`, or the run the case opens from -- a
 * season far along, say. The rules a story run plays under are the caller's to
 * pass, as everywhere here.
 */
function playCase(caseIndex, decide, grade = null, relics = [], lock = null, rules = ALL_RULES, story = false) {
  let run = openCaseRun(story ? { relics, ...(story === true ? {} : story), story: true } : { relics }, { rules });
  let busts = 0;
  let midCaseBusts = 0;
  let mutatedAfterBust = 0;
  let nextTableRules = 0;
  let played = 0;
  for (let windowIndex = 0; windowIndex < WINDOWS_PER_CASE; windowIndex += 1) {
    played += 1;
    // The run's own board for every run but a story one, whose wall stands far.
    let win = createWindow({ schema: getTableSchema(run), seed: `sim:${caseIndex}:${windowIndex}`, beatCombo: run.beatCombo });
    win = reduceWindow(win, { type: "SELECT", id: card.id }, rules);
    if (lock) {
      // Charged to the full on the beat, before the first push.
      win = reduceWindow(win, { type: "SET_FOCUS_MODE", mode: lock.mode }, rules);
      for (let press = 0; press < 8 && win.status === "live" && win.focus < FOCUS_MAX; press += 1) {
        win = reduceWindow(win, { type: "FOCUS", grade: "perfect" }, rules);
        win = reduceWindow(win, { type: "TICK", delta: LOCK_SECONDS }, rules);
      }
    }
    for (let press = 0; press < 30 && win.status === "live"; press += 1) {
      if (!decide(win, run)) break;
      win = reduceWindow(win, { type: "PUSH", grade }, rules);
      win = reduceWindow(win, { type: "TICK", delta: 0.6 }, rules);
    }
    if (lock?.cashAs && win.status === "live") win = reduceWindow(win, { type: "SET_FOCUS_MODE", mode: lock.cashAs }, rules);
    if (win.status === "live") win = reduceWindow(win, { type: "CASH" }, rules);
    const caseClosed = windowIndex === WINDOWS_PER_CASE - 1;
    const { verdict, nextRun } = resolveWindow({ run, window: win, card, caseClosed, rules });
    if (verdict.outcome === "bust") {
      busts += 1;
      if (!caseClosed) midCaseBusts += 1;
      // Broken is the blackout the bust files on the next board. A bare hand
      // also has to find it face down and already hot; a mastered lock may turn
      // the board back over (`applyStanceMastery`), which is the lock working.
      const broken = nextRun.schema.mutations.includes("blackout") && (lock ? true : nextRun.schema.faceDown && nextRun.schema.startGauge > 0);
      if (!caseClosed && broken) mutatedAfterBust += 1;
      // The blackout skip: the room plays the next scene without the player. It
      // never skips onto the result, so the case's last window is always played.
      // A story run is skipped past nothing.
      if (!story && windowIndex < WINDOWS_PER_CASE - 2) windowIndex += 1;
    }
    // A board that carries one of the seven next-table rules, whatever dealt it.
    if (nextRun.schema.mutations.some((id) => STORY_OFF_RULES.includes(MUTATION_RULES[id]))) nextTableRules += 1;
    run = nextRun;
  }
  return { vault: run.vault, busts, midCaseBusts, mutatedAfterBust, nextTableRules, played };
}

function measure(label, decide, grade = null, relics = [], cases = CASES, lock = null, rules = ALL_RULES, story = false) {
  let vault = 0;
  let busts = 0;
  let midCase = 0;
  let mutated = 0;
  let nextTableRules = 0;
  let played = 0;
  for (let caseIndex = 0; caseIndex < cases; caseIndex += 1) {
    const result = playCase(caseIndex, decide, grade, relics, lock, rules, story);
    vault += result.vault;
    busts += result.busts;
    midCase += result.midCaseBusts;
    mutated += result.mutatedAfterBust;
    nextTableRules += result.nextTableRules;
    played += result.played;
  }
  return {
    label,
    meanVault: Math.round(vault / cases),
    bustRate: Number((busts / Math.max(1, played)).toFixed(3)),
    meanWindows: Number((played / cases).toFixed(2)),
    busts,
    midCase,
    mutated,
    nextTableRules,
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
// The listening hand is compared with the untimed one above, so it plays the
// same cases; the blind and wall-seeing hands are only its brackets.
const BRACKET_CASES = 500;
const locking = (label, decide, lock, cases = CASES) => measure(label, decide, "perfect", [], cases, lock);
const lockReport = FOCUS_MODES.map((mode) => ({
  mode,
  blind: bestOfRows([40, 50, 60].map((target) => locking(`${mode} lock, heat ${target}`, (win) => win.gauge < target, { mode }, BRACKET_CASES))),
  listen: locking(`${mode} lock, listening`, listening, { mode }),
  sees: locking(`${mode} lock, sees the wall`, (win) => win.gauge + win.schema.stepMax < win.wall, { mode }, BRACKET_CASES),
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

function playHandCase(caseIndex, decide, relics, stanceMastery, rules = ALL_RULES) {
  let run = openCaseRun({ relics, stanceMastery }, { rules });
  let played = 0;
  for (let windowIndex = 0; windowIndex < WINDOWS_PER_CASE; windowIndex += 1) {
    played += 1;
    const seed = `hand:${caseIndex}:${windowIndex}`;
    let win = createWindow({ schema: run.schema, seed, beatCombo: run.beatCombo });
    // The richest card is the one a COLD FEET board seals, and the one a hand
    // wants most; otherwise the hand works through its cards in turn.
    const sealedId = getSealedCardId(HAND, run.schema);
    const card = HAND.find((candidate) => candidate.id === sealedId) ?? HAND[windowIndex % HAND.length];
    win = reduceWindow(win, { type: "SET_FOCUS_MODE", mode: STANCES[caseIndex % STANCES.length] }, rules);
    win = reduceWindow(win, { type: "SELECT", id: card.id }, rules);
    for (let lock = 0; lock < 3 && win.status === "live"; lock += 1) {
      win = reduceWindow(win, { type: "FOCUS", grade: gradePress(win, relics, `${seed}:focus:${lock}`) }, rules);
    }
    const mood = handUnit(`${seed}:mood`);
    if (mood < 0.04) {
      // Walked away from the table: the clock runs out.
      while (win.status === "live") win = reduceWindow(win, { type: "TICK", delta: 1 }, rules);
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
      win = reduceWindow(win, { type: "PUSH", grade: gradePress(win, relics, `${seed}:push:${press}`) }, rules);
      win = reduceWindow(win, { type: "TICK", delta: 0.6 }, rules);
    }
    if (win.status === "live") win = reduceWindow(win, { type: "CASH" }, rules);
    const caseClosed = windowIndex === WINDOWS_PER_CASE - 1;
    const { verdict, nextRun } = resolveWindow({ run, window: win, card, caseClosed, rules });
    if (verdict.outcome === "bust" && windowIndex < WINDOWS_PER_CASE - 2) windowIndex += 1;
    run = nextRun;
  }
  return { vault: run.vault, played, stanceMastery: run.stanceMastery };
}

function measureHand(label, decide, relics, rules = ALL_RULES) {
  let vault = 0;
  let played = 0;
  // A stance only reshapes a board once it is mastered, three charged cashes
  // in, so each case carries on from the last one's mastery the way a season
  // does, for HAND_SEASON cases at a time.
  let stanceMastery;
  for (let caseIndex = 0; caseIndex < RELIC_CASES; caseIndex += 1) {
    if (caseIndex % HAND_SEASON === 0) stanceMastery = undefined;
    const result = playHandCase(caseIndex, decide, relics, stanceMastery, rules);
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
const lateSeason = (label, decide, rules = ALL_RULES) => {
  let vault = 0;
  for (let caseIndex = 0; caseIndex < RELIC_CASES; caseIndex += 1) {
    let run = openCaseRun({ windowIndex: 450 }, { rules });
    for (let windowIndex = 0; windowIndex < WINDOWS_PER_CASE; windowIndex += 1) {
      let win = createWindow({ schema: run.schema, seed: `late:${caseIndex}:${windowIndex}`, beatCombo: run.beatCombo });
      win = reduceWindow(win, { type: "SELECT", id: card.id }, rules);
      for (let press = 0; press < 30 && win.status === "live" && decide(win); press += 1) {
        win = reduceWindow(win, { type: "PUSH" }, rules);
        win = reduceWindow(win, { type: "TICK", delta: 0.6 }, rules);
      }
      if (win.status === "live") win = reduceWindow(win, { type: "CASH" }, rules);
      const caseClosed = windowIndex === WINDOWS_PER_CASE - 1;
      const { verdict, nextRun } = resolveWindow({ run, window: win, card, caseClosed, rules });
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

// "Always" is every one of them. This asked each row for one broken board, so
// the rule could have held for a single bust in three hundred and passed.
const bustRows = rows.filter((row) => row.midCase > 0);
assert.ok(bustRows.length > 0, "no row bust mid-case, so the broken board was never measured");
for (const row of bustRows) {
  assert.equal(row.mutated, row.midCase, `a bust mid-case always deals a broken board next (${row.label}: ${row.mutated} of ${row.midCase})`);
}
assert.equal(BASE_SCHEMA.stepMin > 0, true);
assert.ok(getCloseness(0, 90) === 0);

/**
 * The prologues, a step at a time (`UNLOCK_LADDER`).
 *
 * A new player's first tables are the smallest ones, so the properties above
 * are asked of each step under its own rules: the bet is still a bet, the
 * heartbeat is still worth hearing and still not the answer, and busting to
 * skip is still a loss. Two numbers differ by design. Before OVERCLOCK no board
 * doubles the chips, so a step banks about two thirds of the whole table; and
 * the best blind policy busts less there (0.05-0.06 against 0.09), so the
 * floor on its bust rate is STEP_BUST_FLOOR, not the whole table's 0.08.
 *
 * What a bust deals follows the step: a broken board wherever BLACKOUT is on,
 * and the plain board where it is not -- 프롤로그 01 has no way to break one.
 * The beat and LOCK are held to what the step gives them: ungraded where the
 * beat is off, STRIKE whatever the hand asks for until the stances open.
 */
const STEP_BUST_FLOOR = 0.04;
const wholeTable = UNLOCK_LADDER.at(-1);
assert.deepEqual([...wholeTable.rules].sort(), [...ALL_RULES].sort(), `${wholeTable.caseId} is the whole table, which is everything measured above`);
const stepReport = UNLOCK_LADDER.slice(0, -1).map((step) => {
  const { caseId, rules } = step;
  const under = (label, decide, grade = null, lock = null, cases = CASES) => measure(`${caseId} ${label}`, decide, grade, [], cases, lock, rules);
  // Fewer rows than the whole table's sweep: the ends that must not win, and the middle where the best one is.
  const blindRows = [0, 30, 40, 50, 60, 90].map((target) => under(`heat ${target}`, (win) => win.gauge < target));
  const listenRows = [90, 100, 110, 120].map((threshold) =>
    under(`heartbeat < ${threshold}`, (win) => getHeartbeatBpm(win.gauge, win.wall + win.tellOffset, win.schema.sedated) < threshold),
  );
  const blind = bestOfRows(blindRows);
  const listen = bestOfRows(listenRows);
  const stepListening = (win) => getHeartbeatBpm(win.gauge, win.wall + win.tellOffset, win.schema.sedated) < heartbeatThreshold(listen.label);
  return {
    caseId,
    rules,
    blindRows,
    blind,
    listen,
    sees: under("sees the wall", (win) => win.gauge + win.schema.stepMax < win.wall),
    skip: under("bust to skip", (win) => (win.seed.endsWith(`:${WINDOWS_PER_CASE - 1}`) ? win.gauge < 50 : true)),
    onBeat: under("on every beat", stepListening, "perfect"),
    offBeat: under("off every beat", stepListening, "miss"),
    // The locking hands play fewer cases, so the untimed hand they are held to plays the same ones.
    unlocked: under("listening (bracket)", stepListening, null, null, BRACKET_CASES),
    strike: under("strike lock", stepListening, "perfect", { mode: "strike" }, BRACKET_CASES),
    steady: under("steady lock", stepListening, "perfect", { mode: "steady" }, BRACKET_CASES),
  };
});
for (const row of stepReport) {
  const { caseId, rules, blind, listen, sees, skip, onBeat, offBeat, unlocked, strike, steady } = row;
  console.log(
    `step ${caseId}  blind ${blind.meanVault} (${blind.label.slice(caseId.length + 1)}, bust ${(blind.bustRate * 100).toFixed(1)}%)  heartbeat ${listen.meanVault} (${listen.label.slice(caseId.length + 1)})  sees ${sees.meanVault} (${(listen.meanVault / sees.meanVault).toFixed(3)})  skip ${skip.meanVault} (${(skip.meanVault / blind.meanVault).toFixed(3)})${rules.has("beat") ? `  on the beat ${onBeat.meanVault}` : ""}${rules.has("lock") ? `  LOCK ${strike.meanVault} against ${unlocked.meanVault}` : ""}`,
  );
  assert.notEqual(blind.label, row.blindRows[0].label, `${caseId}: never pushing cannot be the best blind policy, or there is no bet`);
  assert.notEqual(blind.label, row.blindRows.at(-1).label, `${caseId}: pushing as far as possible cannot be the best blind policy either`);
  assert.ok(blind.bustRate >= STEP_BUST_FLOOR && blind.bustRate <= 0.5, `${caseId}: the best blind policy should bust sometimes, not constantly (got ${blind.bustRate})`);
  assert.ok(listen.meanVault > blind.meanVault, `${caseId}: listening to the heartbeat should be worth something`);
  assert.ok(listen.meanVault < sees.meanVault * 0.6, `${caseId}: the heartbeat must not be an answer key: best ${listen.meanVault} against a wall-seeing ${sees.meanVault}`);
  assert.ok(skip.meanWindows < WINDOWS_PER_CASE, `${caseId}: busting on purpose does shorten a case`);
  assert.ok(skip.meanVault < blind.meanVault * 0.25, `${caseId}: the skip must not be a shortcut: busting to skip banks ${skip.meanVault} against ${blind.meanVault}`);
  assert.ok(blind.meanVault <= bestFixed.meanVault, `${caseId}: a step must not bank more than the whole table (${blind.meanVault} against ${bestFixed.meanVault})`);

  // A bust: broken wherever the step can break a board, untouched where it cannot.
  const bust = [...row.blindRows, skip].filter((played) => played.midCase > 0);
  assert.ok(bust.length > 0, `${caseId}: no row bust mid-case`);
  for (const played of bust) {
    assert.equal(played.mutated, rules.has("blackout") ? played.midCase : 0, `${caseId}: a bust mid-case deals ${rules.has("blackout") ? "a broken board" : "the plain board"} next (${played.label}: ${played.mutated} of ${played.midCase})`);
  }

  // The beat, where the step has it; a press that is not graded, where it does not.
  assert.equal(onBeat.busts, listen.busts, `${caseId}: timing must not move the wall`);
  if (rules.has("beat")) {
    assert.ok(onBeat.meanVault > listen.meanVault, `${caseId}: pushing on the beat should pay`);
    assert.ok(onBeat.meanVault <= Math.ceil(listen.meanVault * (1 + GROOVE_CAP)) + 1, `${caseId}: the groove cannot pay past its cap: ${onBeat.meanVault} against ${listen.meanVault}`);
    assert.ok(offBeat.meanVault <= listen.meanVault, `${caseId}: slipping every push must never pay better than not being graded`);
  } else {
    assert.equal(onBeat.meanVault, listen.meanVault, `${caseId}: with no beat, a press on it is paid as any press`);
    assert.equal(offBeat.meanVault, listen.meanVault, `${caseId}: and a press off it costs nothing`);
  }
  // LOCK, where the step has it, is STRIKE until the stances open.
  if (rules.has("lock")) {
    assert.ok(strike.meanVault > unlocked.meanVault, `${caseId}: a charged LOCK should pay`);
    assert.ok(strike.meanVault <= Math.ceil(unlocked.meanVault * HAND_CAP) + 1, `${caseId}: the hand is paid past its cap: ${strike.meanVault} against ${unlocked.meanVault}`);
    assert.ok(strike.meanVault < sees.meanVault, `${caseId}: the hand must never be worth more than seeing the wall`);
  }
  if (!rules.has("stance")) assert.equal(steady.meanVault, strike.meanVault, `${caseId}: a hand that asks for STEADY is ${rules.has("lock") ? "locking in STRIKE" : "not locking at all"}`);
}

/**
 * Story mode (스토리 모드), the table stepping back so the story can be read.
 *
 * A story run's wall is dealt at 88-98 whatever its board says, it plays
 * without the seven next-table rules, and a bust skips no scene. None of the
 * properties above is asked of it -- there is no bet to speak of at heat 70
 * under a wall that starts at 88 -- and three others are:
 *
 * - a hand that pushes to heat 70 and stops does not bust: under one window in
 *   a hundred, on the whole table, on every prologue's step, with every relic
 *   and late in the season where the clock's heat is at its steepest;
 * - the wall is still a wall: a hand that never stops still busts every time;
 * - no window deals a next-table rule, whatever the hand did -- a bust, a cold
 *   cash, a hot one, a chain of them.
 *
 * It also banks several times what the table pays anyone else, which is why a
 * season with a story case is kept off the public ranking: the ratio is
 * printed, against the best blind policy and against the same hand.
 */
const STORY_SAFE_HEAT = 70;
const STORY_BUST_CEILING = 0.01;
const storyHand = (label, decide, { rules = STORY_RULES, relics = [], cases = CASES, from = true } = {}) =>
  measure(`story ${label}`, decide, null, relics, cases, null, rules, from);
const storyHeat = [50, 60, STORY_SAFE_HEAT, 80, 90].map((target) => storyHand(`heat ${target}`, (win) => win.gauge < target));
const storySafe = storyHeat.find((row) => row.label === `story heat ${STORY_SAFE_HEAT}`);
const storyMash = storyHand("mash", () => true);
const storyCold = storyHand("never pushes", () => false);
const storyTiers = [
  ...UNLOCK_LADDER.slice(0, -1).map((step) => ({ name: step.caseId, options: { rules: step.storyRules, cases: BRACKET_CASES } })),
  { name: "every relic", options: { relics: RELIC_IDS, cases: BRACKET_CASES } },
  { name: "late season", options: { from: { windowIndex: 450 }, cases: BRACKET_CASES } },
].map(({ name, options }) => ({
  name,
  safe: storyHand(`${name}, heat ${STORY_SAFE_HEAT}`, (win) => win.gauge < STORY_SAFE_HEAT, options),
  mash: storyHand(`${name}, mash`, () => true, options),
}));
const storyRows = [...storyHeat, storyMash, storyCold, ...storyTiers.flatMap((tier) => [tier.safe, tier.mash])];
for (const row of storyRows) {
  console.log(
    `${row.label.padEnd(30)} vault ${String(row.meanVault).padStart(8)}  bust ${(row.bustRate * 100).toFixed(1).padStart(5)}%  windows ${row.meanWindows}`,
  );
  assert.equal(row.nextTableRules, 0, `${row.label}: a story run was dealt a next-table rule on ${row.nextTableRules} boards`);
  assert.equal(row.meanWindows, WINDOWS_PER_CASE, `${row.label}: a story run is skipped past nothing, so it plays every window`);
}
assert.deepEqual([...STORY_RULES].sort(), [...ALL_RULES].filter((rule) => !STORY_OFF_RULES.includes(rule)).sort(), "a story run plays under everything but the seven next-table rules");
for (const safe of [storySafe, ...storyTiers.map((tier) => tier.safe)]) {
  assert.ok(safe.bustRate < STORY_BUST_CEILING, `${safe.label}: a hand that stops at heat ${STORY_SAFE_HEAT} busts ${(safe.bustRate * 100).toFixed(1)}% of its windows`);
}
for (const mash of [storyMash, ...storyTiers.map((tier) => tier.mash)]) {
  assert.ok(mash.bustRate > 0.99, `${mash.label}: the wall is still a wall, and a hand that never stops must bust (got ${mash.bustRate})`);
  assert.equal(mash.meanVault, 0, `${mash.label}: and bank nothing`);
}
// The table's own rows, for the ratio. A normal hand at the same heat is the row above.
const sameHand = fixed.find((row) => row.label === `heat ${STORY_SAFE_HEAT}`);
const storyBest = bestOfRows(storyHeat);
console.log(
  `story mode       best blind ${storyBest.meanVault} (${storyBest.label.slice("story ".length)}, bust ${(storyBest.bustRate * 100).toFixed(1)}%), ${(storyBest.meanVault / bestFixed.meanVault).toFixed(1)}x the table's best blind ${bestFixed.meanVault} and ${(storyBest.meanVault / oracle.meanVault).toFixed(2)}x a player who sees its wall (${oracle.meanVault}); the same hand at heat ${STORY_SAFE_HEAT}: ${storySafe.meanVault} against ${sameHand.meanVault} (${(storySafe.meanVault / sameHand.meanVault).toFixed(1)}x)`,
);
assert.ok(
  storySafe.meanVault > bestFixed.meanVault,
  `a story run is expected to out-bank the table (${storySafe.meanVault} against ${bestFixed.meanVault}); if it no longer does, the reason it is kept off the public ranking has gone and the exclusion should be looked at again`,
);

/**
 * The logic streak, with its switch forced on (it ships off: `LOGIC`).
 *
 * The streak is to take the beat's place in the pot, so it is held to the
 * beat's place in the table: a hand skill that pays up to the hand's cap,
 * moves no wall, and pays a hand that plays for it about what a hand that
 * landed every push on the beat was paid -- and a hand that does not, next to
 * nothing.
 *
 * Five hands play the best listening policy, ungraded and unlocked, on the
 * same seeded windows as the untimed hand above, with the one simulated card
 * given a type. What types a window has on the table is a scene of the real
 * season, drawn by seed from every scene that deals cards (the scene's own
 * cards and its wild card; not a walk of the graph, so a case here is nine
 * scenes from anywhere in the season). The streak carries from case to case
 * for a season's length, as the run carries it.
 *
 *   holds one type        위험 다루기 whenever the table has it, and back to it after a scene that did not
 *   holds, follows table  its type while the table has it, and whatever it had to take from then on
 *   switches on a rise    the same, and leaves its type when the pressure rose
 *   random type           the type of a card drawn at random
 *   richest card          the type of the scene's richest card
 *
 * Decided tolerances: the holder's mean pot bonus over its cashed windows is
 * in [1.28, 1.40] (the beat paid a human hand 1.285 and an all-PERFECT one
 * 1.394); the random hand's is at most 1.10; the holder busts exactly as often
 * as the untimed hand; and it banks no more than that hand times the cap. The
 * share of cashed windows paid at the cap is printed, not asserted.
 *
 * The second hand is the best holding play there is -- going back to a type
 * the table took away ends the streak, and it never goes back -- and it is
 * printed beside the holder, held to the cap and to nothing else: 1.420 when
 * this was written, above the band the plain holder is held to.
 */
const SCENES = Object.values(nodes)
  .map((node) => (node.choices ?? []).map((choice) => ({ type: getLogicType(choice), chips: choice.type === "reframe" ? 0 : getCardChips(choice) })).filter((offer) => offer.type))
  .filter((offers) => offers.some((offer) => offer.chips > 0));
const sceneFor = (caseIndex, windowIndex) => SCENES[Math.floor(handUnit(`scene:${caseIndex}:${windowIndex}`) * SCENES.length)];
const SEASON_CASES = CASE_SEQUENCE.length;
const LOGIC_HANDS = {
  "holds one type": (offers) => (offers.some((offer) => offer.type === "risk") ? "risk" : offers[0].type),
  "holds, follows table": (offers, logic) => (offers.some((offer) => offer.type === (logic.type ?? "risk")) ? logic.type ?? "risk" : offers[0].type),
  "switches on a rise": (offers, logic) => {
    const held = logic.type ?? "risk";
    const other = offers.find((offer) => offer.type !== held)?.type;
    if (logic.rose && other) return other;
    return offers.some((offer) => offer.type === held) ? held : offers[0].type;
  },
  "random type": (offers, _logic, seed) => offers[Math.floor(handUnit(`${seed}:type`) * offers.length)].type,
  "richest card": (offers) => offers.reduce((best, offer) => (offer.chips > best.chips ? offer : best)).type,
};

/**
 * One case with the switch on. `pickType` gives the simulated card its type
 * (left out, the card has none and no streak is in play); `lock` charges a
 * stance to the full before the first push, a press at a time and nothing
 * else -- with the switch on the press itself is what costs the clock.
 */
function playSwitchedCase(caseIndex, decide, { pickType = null, lock = null, logic = undefined } = {}) {
  let run = openCaseRun(logic ? { logic } : {});
  const result = { busts: 0, played: 0, cashed: 0, bonus: 0, capped: 0 };
  for (let windowIndex = 0; windowIndex < WINDOWS_PER_CASE; windowIndex += 1) {
    result.played += 1;
    const seed = `sim:${caseIndex}:${windowIndex}`;
    const offers = sceneFor(caseIndex, windowIndex);
    const staked = pickType ? { ...card, cognition: { [pickType(offers, run.logic, seed)]: 1 } } : card;
    let win = createWindow({ schema: run.schema, seed, beatCombo: run.beatCombo });
    win = reduceWindow(win, { type: "SELECT", id: card.id }, ALL_RULES, true);
    if (lock) {
      win = reduceWindow(win, { type: "SET_FOCUS_MODE", mode: lock.mode }, ALL_RULES, true);
      for (let press = 0; press < 8 && win.status === "live" && win.focus < FOCUS_MAX; press += 1) {
        win = reduceWindow(win, { type: "FOCUS" }, ALL_RULES, true);
      }
    }
    for (let press = 0; press < 30 && win.status === "live"; press += 1) {
      if (!decide(win, run)) break;
      win = reduceWindow(win, { type: "PUSH" }, ALL_RULES, true);
      win = reduceWindow(win, { type: "TICK", delta: 0.6 }, ALL_RULES, true);
    }
    if (win.status === "live") win = reduceWindow(win, { type: "CASH" }, ALL_RULES, true);
    const caseClosed = windowIndex === WINDOWS_PER_CASE - 1;
    const { verdict, nextRun } = resolveWindow({ run, window: win, card: staked, offered: [...new Set(offers.map((offer) => offer.type))], caseClosed, logic: true });
    if (verdict.outcome === "bust") {
      result.busts += 1;
      if (windowIndex < WINDOWS_PER_CASE - 2) windowIndex += 1;
    } else {
      // What the streak paid this pot, before LOCK and under the cap.
      const bonus = Math.min(HAND_CAP, getLogicBonus(verdict.logic.streak));
      result.cashed += 1;
      result.bonus += bonus;
      if (bonus >= HAND_CAP) result.capped += 1;
    }
    run = nextRun;
  }
  return { ...result, vault: run.vault, logic: run.logic };
}

function measureSwitched(label, decide, options = {}, cases = CASES) {
  const total = { vault: 0, busts: 0, played: 0, cashed: 0, bonus: 0, capped: 0, best: 0 };
  let logic;
  for (let caseIndex = 0; caseIndex < cases; caseIndex += 1) {
    // A new season: the streak starts again, as a new run's does.
    if (caseIndex % SEASON_CASES === 0) logic = undefined;
    const result = playSwitchedCase(caseIndex, decide, { ...options, logic });
    logic = result.logic;
    for (const key of ["vault", "busts", "played", "cashed", "bonus", "capped"]) total[key] += result[key];
    total.best = Math.max(total.best, result.logic.best);
  }
  return {
    label,
    meanVault: Math.round(total.vault / cases),
    busts: total.busts,
    bustRate: Number((total.busts / Math.max(1, total.played)).toFixed(3)),
    meanBonus: Number((total.bonus / Math.max(1, total.cashed)).toFixed(3)),
    capShare: Number((total.capped / Math.max(1, total.cashed)).toFixed(3)),
    best: total.best,
  };
}

const offerShare = (type) => ((SCENES.filter((offers) => offers.some((offer) => offer.type === type)).length / SCENES.length) * 100).toFixed(0);
console.log(
  `logic streak     switch forced on for the rows below; offers from ${SCENES.length} scenes of the season (on the table: ${["risk", "inference", "persistence", "reframing"].map((type) => `${type} ${offerShare(type)}%`).join(", ")})`,
);
const logicRows = Object.entries(LOGIC_HANDS).map(([name, pickType]) => measureSwitched(name, listening, { pickType }));
for (const row of logicRows) {
  console.log(
    `logic ${row.label.padEnd(20)} vault ${String(row.meanVault).padStart(8)}  bust ${(row.bustRate * 100).toFixed(1).padStart(5)}%  pot bonus ${row.meanBonus.toFixed(3)}  at the cap ${(row.capShare * 100).toFixed(0).padStart(3)}%  best streak ${row.best}`,
  );
  assert.equal(row.busts, bestHeartbeatSoFar.busts, `${row.label}: the streak must not move the wall: it busts exactly as often as the untimed hand`);
  assert.ok(row.meanVault <= Math.ceil(bestHeartbeatSoFar.meanVault * HAND_CAP) + 1, `${row.label}: the streak cannot pay past the hand's cap: ${row.meanVault} against ${bestHeartbeatSoFar.meanVault}`);
}
const holder = logicRows.find((row) => row.label === "holds one type");
const randomType = logicRows.find((row) => row.label === "random type");
assert.ok(holder.meanBonus >= 1.28 && holder.meanBonus <= 1.4, `a hand that holds a type should be paid about what the beat paid a good hand (1.28 to 1.40): ${holder.meanBonus}`);
assert.ok(randomType.meanBonus <= 1.1, `a hand that picks a type at random must be paid next to nothing by the streak: ${randomType.meanBonus}`);
assert.ok(holder.meanVault > bestHeartbeatSoFar.meanVault, "holding a type should pay");

/**
 * LOCK with the switch on: every press charges as a GOOD lock did and costs
 * 1.5 seconds of clock, with no beat to judge it. It replaces a LOCK landed on
 * every beat (the rows "lock, listening" above), so it has to bank about what
 * that banked: within LOCK_SHIFT of it for each stance. No streak is in play
 * here -- the card has no type -- so the pot is LOCK's alone, as it is there.
 */
const LOCK_SHIFT = 0.06;
const switchedLocks = lockReport.map((row) => ({ mode: row.mode, was: row.listen.meanVault, now: measureSwitched(`${row.mode} lock, pressed`, listening, { lock: { mode: row.mode } }).meanVault }));
console.log(`logic LOCK         a press charges and costs clock: ${switchedLocks.map((row) => `${row.mode} ${row.now} against ${row.was} on the beat (${((row.now / row.was - 1) * 100).toFixed(1)}%)`).join(", ")}`);
for (const row of switchedLocks) {
  assert.ok(Math.abs(row.now / row.was - 1) <= LOCK_SHIFT, `a pressed ${row.mode} LOCK banks ${row.now} against ${row.was} for one landed on every beat, more than ${LOCK_SHIFT * 100}% away`);
}

console.log(
  `Gauntlet loop checks passed (${WINDOWS_PER_CASE} windows a case, measured ${MEASURED_WINDOWS_PER_CASE.toFixed(2)}; best blind: ${bestFixed.label}, ${bestFixed.meanVault}; best heartbeat: ${bestHeartbeat.label}, ${bestHeartbeat.meanVault}; ceiling ${oracle.meanVault}; bust to skip: ${skipper.meanVault} over ${skipper.meanWindows} windows; on the beat: ${onBeat.meanVault}, off it: ${offBeat.meanVault}; locked and on the beat: ${lockReport.map((row) => `${row.mode} ${row.listen.meanVault}`).join(", ")}).`,
);
