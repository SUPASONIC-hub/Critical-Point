import assert from "node:assert/strict";
import {
  BASE_SCHEMA,
  createWindow,
  FOCUS_MODES,
  getCardChips,
  getCloseness,
  getHeartbeatBpm,
  HAND_CAP,
  openCaseRun,
  reduceWindow,
  resolveWindow,
  STANCE_CHARGE,
} from "../src/gauntlet/gauntletEngine.js";
import { getLogicType } from "../src/gauntlet/logicStreak.js";
import { DEFAULT_RELIC_POOL, RELIC_IDS, RELIC_SLOTS, RELICS } from "../src/gauntlet/relics.js";
import { SEAL_BREAK_GAUGE } from "../src/gauntlet/tableRules.js";
import { ALL_RULES, STORY_OFF_RULES, STORY_RULES, UNLOCK_LADDER } from "../src/gauntlet/tableUnlocks.js";
import { CASE_RESULT_NODES, CASE_SEQUENCE, CASE_START_NODES, nodes } from "../src/gameData.js";
import { createCaseBot, handUnit, newSeen, RELIC_DROP_ORDER } from "./sim/season-bot.mjs";

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
 * - the logic streak is a hand skill, not a second instrument: a hand that
 *   holds one type of card busts exactly as often as one whose card has no
 *   type at all, is paid more but never more than the hand's cap, and a hand
 *   that picks its type at random is paid next to nothing (until 2026-10-10
 *   this was the beat: a push landed on the heartbeat, measured the same way);
 * - LOCK is the same hand: a hand that charges a stance to the full is paid
 *   under one cap for both, reads the heartbeat no better for it, and cannot
 *   charge one stance and cash another. What a stance carries into the next
 *   board is a rule like a relic's and is held to the relic's cap;
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
// The one simulated card. It has no type, so a hand that plays it bare has no
// logic streak in play: the rows that measure the bet, the heartbeat and the
// skip are the table without the hand's share.
const card = { id: "sim", label: "sim", effect: { capital: 12, trust: 6, humanCost: 4 } };

/**
 * What types a window has on the table: a scene of the real season, drawn by
 * seed from every scene that deals cards (the scene's own cards and its wild
 * card; not a walk of the graph, so a case here is nine scenes from anywhere
 * in the season).
 */
const SCENES = Object.values(nodes)
  .map((node) => (node.choices ?? []).map((choice) => ({ type: getLogicType(choice), chips: choice.type === "reframe" ? 0 : getCardChips(choice) })).filter((offer) => offer.type))
  .filter((offers) => offers.some((offer) => offer.chips > 0));
/** The counts of `newSeen` (scripts/sim/season-bot.mjs), added up. */
function addSeen(total, part) {
  for (const [key, value] of Object.entries(part)) {
    if (typeof value === "number") total[key] += value;
    else for (const [inner, amount] of Object.entries(value)) total[key][inner] = (total[key][inner] ?? 0) + amount;
  }
  return total;
}
const sceneFor = (caseIndex, windowIndex) => SCENES[Math.floor(handUnit(`scene:${caseIndex}:${windowIndex}`) * SCENES.length)];
const SEASON_CASES = CASE_SEQUENCE.length;

// The two players are `scripts/sim/season-bot.mjs`: `playCase` stakes the
// simulated card above, `playHandCase` the relic hand's three cards (`HAND`
// there; the hand is described with the relic rows below).
const { playCase, playHandCase } = createCaseBot({ windowsPerCase: WINDOWS_PER_CASE, card, sceneFor });

function measure(label, decide, hand = null, relics = [], cases = CASES, lock = null, rules = ALL_RULES, story = false) {
  const paid = { cashed: 0, bonus: 0, capped: 0, best: 0 };
  let logic;
  let vault = 0;
  let busts = 0;
  let midCase = 0;
  let mutated = 0;
  let nextTableRules = 0;
  let played = 0;
  const seen = newSeen();
  for (let caseIndex = 0; caseIndex < cases; caseIndex += 1) {
    // A hand that plays for the streak carries it from case to case for a
    // season's length, and starts again with the next season.
    if (caseIndex % SEASON_CASES === 0) logic = undefined;
    const result = playCase(caseIndex, decide, hand ? { pickType: hand, logic } : undefined, relics, lock, rules, story);
    if (hand) logic = result.logic;
    for (const key of ["cashed", "bonus", "capped"]) paid[key] += result[key];
    paid.best = Math.max(paid.best, result.logic.best);
    vault += result.vault;
    busts += result.busts;
    midCase += result.midCaseBusts;
    mutated += result.mutatedAfterBust;
    nextTableRules += result.nextTableRules;
    played += result.played;
    addSeen(seen, result.seen);
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
    // The streak's pay over the cashed windows: its mean, and the share at the cap.
    meanBonus: Number((paid.bonus / Math.max(1, paid.cashed)).toFixed(3)),
    capShare: Number((paid.capped / Math.max(1, paid.cashed)).toFixed(3)),
    best: paid.best,
    // For the measurements at the end of this file; no row above reads it.
    seen,
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

// The best heartbeat policy, which every hand below plays.
const heartbeatThreshold = (label) => Number(label.split("< ")[1]);
const bestHeartbeatSoFar = heartbeat.reduce((best, row) => (row.meanVault > best.meanVault ? row : best));
const listening = (win) => getHeartbeatBpm(win.gauge, win.wall + win.tellOffset, win.schema.sedated) < heartbeatThreshold(bestHeartbeatSoFar.label);

/**
 * The logic streak: five hands that play the best listening policy on the same
 * seeded windows as the untyped hand above, each giving the card a type its
 * own way. The streak carries from case to case for a season's length.
 *
 *   holds one type        위험 다루기 whenever the table has it, and back to it after a scene that did not
 *   holds, follows table  its type while the table has it, and whatever it had to take from then on
 *   switches on a rise    the same, and leaves its type when the pressure rose
 *   random type           the type of a card drawn at random
 *   richest card          the type of the scene's richest card
 *
 * Decided tolerances (2026-10-09): the holder's mean pot bonus over its cashed
 * windows is in [1.28, 1.40] (the beat paid a human hand 1.285 and an
 * all-PERFECT one 1.394); the random hand's is at most 1.10; every hand busts
 * exactly as often as the untyped one; and none banks more than that hand
 * times the cap. The share of cashed windows paid at the cap is printed, not
 * asserted.
 *
 * The second hand is the best holding play there is -- going back to a type
 * the table took away ends the streak, and it never goes back -- and it is
 * printed beside the holder, held to the cap and to nothing else: 1.420 when
 * this was written, above the band the plain holder is held to.
 */
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
const logicRows = Object.entries(LOGIC_HANDS).map(([name, pickType]) => measure(name, listening, pickType));
const holder = logicRows.find((row) => row.label === "holds one type");
const randomType = logicRows.find((row) => row.label === "random type");

// The whole hand's other half: a stance charged to the full, a press at a
// time, each press paid for in clock. Each stance is played blind, listening
// and seeing the wall, so the heartbeat is compared like for like, and once
// more by a hand that charges STEADY -- the stance that cools the gauge -- and
// changes to STRIKE to cash. No streak is in play: the card has no type, so
// the pot is LOCK's alone.
// The listening hand is compared with the unlocked one above, so it plays the
// same cases; the blind and wall-seeing hands are only its brackets.
const BRACKET_CASES = 500;
const locking = (label, decide, lock, cases = CASES) => measure(label, decide, null, [], cases, lock);
const lockReport = FOCUS_MODES.map((mode) => ({
  mode,
  blind: bestOfRows([40, 50, 60].map((target) => locking(`${mode} lock, heat ${target}`, (win) => win.gauge < target, { mode }, BRACKET_CASES))),
  listen: locking(`${mode} lock, listening`, listening, { mode }),
  sees: locking(`${mode} lock, sees the wall`, (win) => win.gauge + win.schema.stepMax < win.wall, { mode }, BRACKET_CASES),
}));
const swapped = locking("steady lock, cashed as strike", listening, { mode: "steady", cashAs: "strike" });

const rows = [...fixed, ...heartbeat, oracle, skipper, ...lockReport.flatMap((row) => [row.blind, row.listen, row.sees]), swapped];
for (const row of rows) {
  console.log(
    `${row.label.padEnd(16)} vault ${String(row.meanVault).padStart(8)}  bust ${(row.bustRate * 100).toFixed(1).padStart(5)}%  windows ${row.meanWindows}`,
  );
}
const offerShare = (type) => ((SCENES.filter((offers) => offers.some((offer) => offer.type === type)).length / SCENES.length) * 100).toFixed(0);
console.log(
  `logic streak     offers from ${SCENES.length} scenes of the season (on the table: ${["risk", "inference", "persistence", "reframing"].map((type) => `${type} ${offerShare(type)}%`).join(", ")})`,
);
for (const row of logicRows) {
  console.log(
    `logic ${row.label.padEnd(20)} vault ${String(row.meanVault).padStart(8)}  bust ${(row.bustRate * 100).toFixed(1).padStart(5)}%  pot bonus ${row.meanBonus.toFixed(3)}  at the cap ${(row.capShare * 100).toFixed(0).padStart(3)}%  best streak ${row.best}`,
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
const listeningOverBlind = bestHeartbeatSoFar.meanVault / Math.max(1, bestFixed.meanVault);
for (const row of logicRows) {
  assert.equal(row.busts, bestHeartbeatSoFar.busts, `${row.label}: the streak must not move the wall: it busts exactly as often as the untyped hand`);
  assert.ok(row.meanVault <= Math.ceil(bestHeartbeatSoFar.meanVault * HAND_CAP) + 1, `${row.label}: the streak cannot pay past the hand's cap: ${row.meanVault} against ${bestHeartbeatSoFar.meanVault}`);
  assert.ok(row.meanVault >= bestHeartbeatSoFar.meanVault, `${row.label}: a card with a type must never bank less than one without`);
  assert.ok(
    row.meanVault / bestHeartbeatSoFar.meanVault < listeningOverBlind,
    `${row.label}: the streak must pay less than listening does: the type is the spice, reading the table is the game`,
  );
}
// The band's top was 1.40 while the streak's cap was x1.5 (the hand measured
// 1.376); the cap rose to x1.6 on 2026-10-16 so that it is worth more than one
// push, and the same hand measured 1.429.
assert.ok(holder.meanBonus >= 1.28 && holder.meanBonus <= 1.45, `a hand that holds a type should be paid about what the beat paid a good hand, and a little more since the cap rose past one push (1.28 to 1.45): ${holder.meanBonus}`);
assert.ok(randomType.meanBonus <= 1.1, `a hand that picks a type at random must be paid next to nothing by the streak: ${randomType.meanBonus}`);
assert.ok(holder.meanVault > bestHeartbeatSoFar.meanVault, "holding a type should pay");
/**
 * LOCK, held to the hand's ratchets. Until 2026-09-28 no hand here ever locked,
 * and LOCK multiplied the pot outside the hand's cap: STRIKE at full charge
 * paid x2.15, a hand that locked banked 3.5 times the best listening policy
 * and 1.9 times a player who could see the wall, and charging STEADY to cash
 * as STRIKE banked more than either stance alone.
 *
 * Until 2026-10-10 a LOCK was landed on the beat. A press now charges what a
 * GOOD one did and costs 1.5 seconds of clock; it replaced a LOCK landed on
 * every beat, so it has to bank about what that banked (`LOCK_ON_THE_BEAT`,
 * the last measurement of it): within LOCK_SHIFT for each stance.
 */
const LOCK_ON_THE_BEAT = { strike: 43849, steady: 43633, expose: 36660 };
const LOCK_SHIFT = 0.06;
for (const row of lockReport) {
  assert.ok(
    Math.abs(row.listen.meanVault / LOCK_ON_THE_BEAT[row.mode] - 1) <= LOCK_SHIFT,
    `a pressed ${row.mode} LOCK banks ${row.listen.meanVault} against ${LOCK_ON_THE_BEAT[row.mode]} for one landed on every beat, more than ${LOCK_SHIFT * 100}% away`,
  );
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
  "the hand must pay less than listening does: LOCK is still the spice",
);
assert.ok(
  swapped.meanVault <= Math.max(...lockReport.map((row) => row.listen.meanVault)),
  `a charge belongs to its stance: charging STEADY to cash as STRIKE banked ${swapped.meanVault}`,
);

/**
 * Relics, played by a hand that can trip them.
 *
 * The policies above stake one card and (but for the lock rows) never lock a
 * stance -- which is right for the rules they hold, and meant eight of the
 * thirteen relics could not change a single number: METRONOME needs a type
 * changed after the pressure rose, LOCKPICK a sealed card, SPLINT a fractured
 * axis, ENCORE a streak to keep through a bust, STETHOSCOPE a silenced board,
 * and the three stance relics a mastered stance. A relic the simulation cannot
 * trip is a relic the lift cap cannot catch.
 *
 * So each relic set is replayed by a hand that does all of it: three cards of
 * three types (one burns legitimacy past the fracture line); the card of the
 * type it is holding, except that it takes the sealed card when the board
 * seals one and, one window in five, the next card along because the scene
 * asked for it (a change of type METRONOME can turn into a switch, and a
 * streak ENCORE can carry through the wall); one window in two, FOCUS presses
 * until the stance is charged, in a stance that rotates by case (the other
 * windows are paid by the streak alone); and one window in twenty-five left to run
 * out the clock. The streak carries from case to case as the stance mastery
 * does. The invariants above are asserted again under every relic, and no
 * single relic may lift best play by more than RELIC_LIFT_CAP.
 *
 * Until 2026-10-10 this hand worked through its cards in turn and timed its
 * presses against the heartbeat with a human spread, which is what METRONOME
 * (a wider beat window) and ENCORE (the beat's combo) then bent.
 */
const RELIC_CASES = 300;
/** Cases a stance mastery is carried through before the hand starts a new season. */
const HAND_SEASON = 10;

function measureHand(label, decide, relics, rules = ALL_RULES) {
  let vault = 0;
  let played = 0;
  // A stance only reshapes a board once it is mastered, three charged cashes
  // in, so each case carries on from the last one's mastery the way a season
  // does, for HAND_SEASON cases at a time. The logic streak goes with it.
  let carried;
  for (let caseIndex = 0; caseIndex < RELIC_CASES; caseIndex += 1) {
    if (caseIndex % HAND_SEASON === 0) carried = undefined;
    const result = playHandCase(caseIndex, decide, relics, carried, rules);
    carried = { stanceMastery: result.stanceMastery, logic: result.logic };
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

/**
 * The two relics that bend the logic streak, played by the hands that play
 * for it. The relic hand above changes type often and holds short streaks, so
 * it trips both and stresses neither: ENCORE is worth most to a hand with a
 * long streak to lose, and METRONOME to one that changes type. Each of the
 * five streak hands plays the same cases with each relic, and is held to the
 * same cap on a relic's lift and to the hand's cap on the pot.
 */
for (const relic of ["encore", "metronome"]) {
  const lifts = logicRows.map((bare) => {
    const row = measure(`${bare.label} + ${relic}`, listening, LOGIC_HANDS[bare.label], [relic]);
    assert.equal(row.busts, bare.busts, `${row.label}: a relic that bends the streak must not move the wall`);
    assert.ok(row.meanVault >= bare.meanVault, `${row.label}: the relic must never cost the hand (${row.meanVault} against ${bare.meanVault})`);
    assert.ok(row.meanVault <= bare.meanVault * RELIC_LIFT_CAP, `${relic} is a win button for a hand that ${bare.label}: ${row.meanVault} against ${bare.meanVault}`);
    assert.ok(row.meanVault <= Math.ceil(bestHeartbeatSoFar.meanVault * HAND_CAP) + 1, `${row.label}: the streak cannot pay past the hand's cap`);
    return `${bare.label} ${bare.meanVault} -> ${row.meanVault} (pot bonus ${bare.meanBonus.toFixed(3)} -> ${row.meanBonus.toFixed(3)})`;
  });
  console.log(`logic + ${relic.padEnd(10)} ${lifts.join("; ")}`);
}

// Late in the season the board leans in (`getSeasonEscalation`). The table's
// rules have to hold there too, not only on a fresh run.
const lateSeason = (label, decide, rules = ALL_RULES) => {
  let vault = 0;
  for (let caseIndex = 0; caseIndex < RELIC_CASES; caseIndex += 1) {
    let run = openCaseRun({ windowIndex: 450 }, { rules });
    for (let windowIndex = 0; windowIndex < WINDOWS_PER_CASE; windowIndex += 1) {
      let win = createWindow({ schema: run.schema, seed: `late:${caseIndex}:${windowIndex}` });
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
 * The streak and LOCK are held to what the step gives them: a card's type is
 * paid nothing where the streak is off, and LOCK is STRIKE whatever the hand
 * asks for until the stances open.
 */
const STEP_BUST_FLOOR = 0.04;
const wholeTable = UNLOCK_LADDER.at(-1);
assert.deepEqual([...wholeTable.rules].sort(), [...ALL_RULES].sort(), `${wholeTable.caseId} is the whole table, which is everything measured above`);
const stepReport = UNLOCK_LADDER.slice(0, -1).map((step) => {
  const { caseId, rules } = step;
  const under = (label, decide, hand = null, lock = null, cases = CASES) => measure(`${caseId} ${label}`, decide, hand, [], cases, lock, rules);
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
    holds: under("holds one type", stepListening, LOGIC_HANDS["holds one type"]),
    wanders: under("random type", stepListening, LOGIC_HANDS["random type"]),
    // The locking hands play fewer cases, so the unlocked hand they are held to plays the same ones.
    unlocked: under("listening (bracket)", stepListening, null, null, BRACKET_CASES),
    // A press costs clock, and the clock creeps heat into the gauge: the pot a
    // LOCK is capped against is the one a hand banks on the same clock without it.
    waited: under("listening, waits a LOCK's clock", stepListening, null, { mode: "strike", idle: true }, BRACKET_CASES),
    strike: under("strike lock", stepListening, null, { mode: "strike" }, BRACKET_CASES),
    steady: under("steady lock", stepListening, null, { mode: "steady" }, BRACKET_CASES),
  };
});
for (const row of stepReport) {
  const { caseId, rules, blind, listen, sees, skip, holds, wanders, unlocked, waited, strike, steady } = row;
  console.log(
    `step ${caseId}  blind ${blind.meanVault} (${blind.label.slice(caseId.length + 1)}, bust ${(blind.bustRate * 100).toFixed(1)}%)  heartbeat ${listen.meanVault} (${listen.label.slice(caseId.length + 1)})  sees ${sees.meanVault} (${(listen.meanVault / sees.meanVault).toFixed(3)})  skip ${skip.meanVault} (${(skip.meanVault / blind.meanVault).toFixed(3)})${rules.has("logic") ? `  holding a type ${holds.meanVault}` : ""}${rules.has("lock") ? `  LOCK ${strike.meanVault} against ${unlocked.meanVault} (${waited.meanVault} on the same clock)` : ""}`,
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

  // The streak, where the step has it; a card's type that is paid nothing, where it does not.
  assert.equal(holds.busts, listen.busts, `${caseId}: the streak must not move the wall`);
  if (rules.has("logic")) {
    assert.ok(holds.meanVault > listen.meanVault, `${caseId}: holding a type should pay`);
    assert.ok(holds.meanVault <= Math.ceil(listen.meanVault * HAND_CAP) + 1, `${caseId}: the streak cannot pay past the hand's cap: ${holds.meanVault} against ${listen.meanVault}`);
    assert.ok(wanders.meanVault <= holds.meanVault, `${caseId}: picking a type at random must never pay better than holding one`);
  } else {
    assert.equal(holds.meanVault, listen.meanVault, `${caseId}: with no streak, a card with a type is paid as any card`);
    assert.equal(wanders.meanVault, listen.meanVault, `${caseId}: whichever type it is`);
  }
  // LOCK, where the step has it, is STRIKE until the stances open.
  if (rules.has("lock")) {
    assert.ok(strike.meanVault > unlocked.meanVault, `${caseId}: a charged LOCK should pay`);
    assert.ok(strike.meanVault <= Math.ceil(waited.meanVault * HAND_CAP) + 1, `${caseId}: the hand is paid past its cap: ${strike.meanVault} against ${waited.meanVault} for the same clock without a LOCK`);
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
 * Measured, not judged (2026-10-13, the plan's "규칙 측정"). Nothing below is
 * asserted, and it is played after every row above, on seeds of its own or on
 * rows already measured, so no number, tolerance or exit code above moves.
 *
 * The wild card. 판을 다시 짠다 is on the table of some scenes and has a type of
 * its own (`getLogicType`: 판 바꾸기, "reframing"), so the suspicion that a hand
 * staking nothing else can never lose its streak is two hands here: one stakes
 * the wild card whenever a scene deals it and otherwise picks as the random
 * hand does (the same draw), and one holds 판 바꾸기 as "holds one type" holds
 * 위험 다루기 -- the wild card or a written card of that type, whichever the
 * scene has. Both play the listening policy on the windows the five hands
 * above play. The staked card here is the one simulated card with a type
 * given to it, so what is compared is the streak, not the wild card's chips
 * (`check-endings.mjs --report` plays the card itself).
 */
const perCent = (part, whole, digits = 1) => ((100 * part) / Math.max(1, whole)).toFixed(digits);
const isWild = (offer) => offer.chips === 0 && offer.type === "reframing";
const WILD_HANDS = {
  "stakes the wild card": (offers, logic, seed) => (offers.some(isWild) ? "reframing" : LOGIC_HANDS["random type"](offers, logic, seed)),
  "holds 판 바꾸기": (offers) => (offers.some((offer) => offer.type === "reframing") ? "reframing" : offers[0].type),
};
const streakLine = (row) =>
  `${row.label.padEnd(20)} vault ${String(row.meanVault).padStart(8)}  bust ${(row.bustRate * 100).toFixed(1).padStart(5)}%  pot bonus ${row.meanBonus.toFixed(3)}  at the cap ${(row.capShare * 100).toFixed(0).padStart(3)}%  best streak ${String(row.best).padStart(3)}  mean streak ${(row.seen.streakSum / row.seen.windows).toFixed(2).padStart(5)}  ended by a change of type ${perCent(row.seen.moves.break ?? 0, row.seen.windows).padStart(4)}% of windows, by a bust ${perCent(row.seen.moves.bust ?? 0, row.seen.windows).padStart(4)}%  kept off the table ${perCent(row.seen.moves.keep ?? 0, row.seen.windows).padStart(4)}%`;
console.log(
  `measured: wild card (not asserted; on the table of ${SCENES.filter((offers) => offers.some(isWild)).length} of ${SCENES.length} scenes, a written 판 바꾸기 card on ${SCENES.filter((offers) => offers.some((offer) => offer.type === "reframing" && !isWild(offer))).length})`,
);
for (const row of Object.entries(WILD_HANDS).map(([name, pickType]) => measure(name, listening, pickType))) console.log(`measured wild  ${streakLine(row)}`);
for (const row of logicRows) console.log(`measured hand  ${streakLine(row)}`);

/**
 * LOCK on top of a streak, and STEADY's cooling. The lock rows above stake a
 * card with no type, so they cannot say what a LOCK is worth to a hand that
 * already holds a streak: the best holding hand plays the same cases bare and
 * with each stance charged to the full. "LOCK added nothing" is the share of
 * cashes holding a charge whose pot LOCK did not move (the streak had already
 * filled the hand's cap).
 *
 * STEADY cools the gauge by its relief a press and the press costs clock,
 * which creeps heat in. Measured on the plain board: charged to the stance
 * line before the first push (where the gauge has nothing to cool), and after
 * pushing to the seal's heat, against STRIKE on the same presses, which is the
 * creep alone.
 */
const stacked = [null, ...FOCUS_MODES].map((mode) => measure(`holds, follows table${mode ? ` + ${mode} lock` : ""}`, listening, LOGIC_HANDS["holds, follows table"], [], BRACKET_CASES, mode ? { mode } : null));
for (const row of stacked) {
  console.log(
    `measured lock  ${row.label.padEnd(34)} vault ${String(row.meanVault).padStart(8)}  bust ${(row.bustRate * 100).toFixed(1).padStart(5)}%  streak's share of the pots ${perCent(row.seen.logicPot, row.seen.pot).padStart(4)}%  LOCK's ${perCent(row.seen.focusPot, row.seen.pot).padStart(4)}%  LOCK added nothing on ${row.seen.lockUnpaid} of ${row.seen.lockCashed} charged cashes (${perCent(row.seen.lockUnpaid, row.seen.lockCashed)}%)`,
  );
}
for (const mode of ["strike", "steady"]) {
  const idle = measure(`listening, waits a ${mode} lock's clock`, listening, null, [], BRACKET_CASES, { mode, idle: true });
  const bare = lockReport.find((row) => row.mode === mode).listen;
  console.log(`measured lock  no streak: ${bare.label} ${bare.meanVault} (bust ${(bare.bustRate * 100).toFixed(1)}%, ${CASES} cases) against ${idle.meanVault} for the same clock with no press (bust ${(idle.bustRate * 100).toFixed(1)}%, ${BRACKET_CASES} cases) and ${bestHeartbeatSoFar.meanVault} with no clock spent (bust ${(bestHeartbeatSoFar.bustRate * 100).toFixed(1)}%)`);
}
const coolingOf = (mode, heat) => {
  const sum = { windows: 0, presses: 0, change: 0, seconds: 0 };
  for (let index = 0; index < CASES; index += 1) {
    let win = createWindow({ schema: BASE_SCHEMA, seed: `cooling:${index}` });
    win = reduceWindow(win, { type: "SELECT", id: card.id });
    win = reduceWindow(win, { type: "SET_FOCUS_MODE", mode });
    for (let press = 0; press < 30 && win.status === "live" && win.gauge < heat; press += 1) {
      win = reduceWindow(win, { type: "PUSH" });
      win = reduceWindow(win, { type: "TICK", delta: 0.6 });
    }
    if (win.status !== "live") continue;
    const before = win;
    for (let press = 0; press < 8 && win.status === "live" && win.focus < STANCE_CHARGE; press += 1) win = reduceWindow(win, { type: "FOCUS" });
    if (win.status !== "live") continue;
    sum.windows += 1;
    sum.presses += win.focusHits;
    sum.change += win.gauge - before.gauge;
    sum.seconds += win.elapsed - before.elapsed;
  }
  return { presses: sum.presses / sum.windows, change: sum.change / sum.windows, seconds: sum.seconds / sum.windows, windows: sum.windows };
};
for (const heat of [0, SEAL_BREAK_GAUGE, 45]) {
  const [strike, steady] = ["strike", "steady"].map((mode) => coolingOf(mode, heat));
  console.log(
    `measured cool  charged to the stance line ${heat ? `after pushing to heat ${heat}` : "before the first push"}: STEADY ${steady.presses.toFixed(1)} presses over ${steady.seconds.toFixed(1)}s, gauge ${steady.change >= 0 ? "+" : ""}${steady.change.toFixed(2)} (${steady.windows} windows); STRIKE ${strike.presses.toFixed(1)} presses over ${strike.seconds.toFixed(1)}s, gauge +${strike.change.toFixed(2)} (the creep alone)`,
  );
}

/**
 * Which push a bust happens on. A plain board's wall stands at 56 or more and
 * a push is 15 at most, so three pushes from cold cannot reach it; the boards
 * a bust or a hot cash deals are not plain (a start already hot, a wall pulled
 * closer), and the clock creeps heat in.
 */
for (const row of [bestFixed, fixed.find((entry) => entry.label === "heat 60"), bestHeartbeatSoFar, heartbeat.find((entry) => entry.label === "heartbeat < 120")]) {
  const { bustAt, pushed } = row.seen;
  const reached = (push) => Object.entries(pushed).reduce((sum, [pushes, windows]) => sum + (Number(pushes) >= push ? windows : 0), 0);
  const early = [1, 2, 3].reduce((sum, push) => sum + (bustAt[push] ?? 0), 0);
  console.log(
    `measured bust  ${row.label.padEnd(16)} ${row.busts} busts in ${row.seen.windows} windows; on push 1-3: ${early} (${perCent(early, row.busts)}% of busts); ${[1, 2, 3, 4, 5, 6].map((push) => `push ${push}: ${bustAt[push] ?? 0} of ${reached(push)} (${perCent(bustAt[push] ?? 0, reached(push))}%)`).join(", ")}; by the clock ${(bustAt.creep ?? 0) + (bustAt.timeout ?? 0)}`,
  );
}

/**
 * Tools together (2026-10-13, the plan's question of a cap on tools). The
 * relic rows above play each tool alone and all twelve at once; a cap asks
 * about the sets between. The same hand on the same cases holds the five
 * tools that need no unlock (a first season), the seven a feat unlocks, and
 * the builds a cap of 3 or 5 slots would leave a player who keeps the
 * tools that lift best play most when held alone (the rows above, so the
 * order is read, not written here). "Of the whole lift" is the share of what
 * all twelve add to listening play that the set keeps. Since day 11 the table
 * holds `RELIC_SLOTS` (5) and a full hand swaps; "the swap keeps" is the five
 * the season bot's swap ends with once everything is unlocked
 * (`RELIC_DROP_ORDER`, written there and not read from here).
 */
const liftOf = (row) => row.listen.meanVault / relicBaseline.listen.meanVault;
const everyTool = relicReport[relicReport.length - 1];
const ranked = relicReport.filter((row) => row.relics.length === 1).sort((left, right) => right.listen.meanVault - left.listen.meanVault);
console.log(`measured tools one at a time, by what it adds to listening play: ${ranked.map((row) => `${row.name} ${liftOf(row) >= 1 ? "+" : ""}${((liftOf(row) - 1) * 100).toFixed(1)}%${RELICS[row.name].unlock ? " (unlocked)" : ""}`).join(", ")}; all ${RELIC_IDS.length} together +${((liftOf(everyTool) - 1) * 100).toFixed(1)}%`);
const toolSets = [
  ["the 5 from the start", DEFAULT_RELIC_POOL],
  [`the ${RELIC_IDS.length - DEFAULT_RELIC_POOL.length} a feat unlocks`, RELIC_IDS.filter((id) => RELICS[id].unlock)],
  ...[3, 5].map((slots) => [`best ${slots} alone`, ranked.slice(0, slots).map((row) => row.name)]),
  ["the swap keeps", RELIC_DROP_ORDER.slice(-RELIC_SLOTS)],
  ...[3, 5].map((slots) => [`worst ${slots} alone`, ranked.slice(-slots).map((row) => row.name)]),
];
for (const [name, relics] of toolSets) {
  const blind = bestOf([40, 50, 60].map((target) => measureHand(`${name} heat ${target}`, (win) => win.gauge < target, relics)));
  const listen = bestOf([90, 100, 110].map((threshold) => measureHand(`${name} heartbeat < ${threshold}`, (win) => getHeartbeatBpm(win.gauge, win.wall + win.tellOffset, win.schema.sedated) < threshold, relics)));
  const kept = (listen.meanVault - relicBaseline.listen.meanVault) / Math.max(1, everyTool.listen.meanVault - relicBaseline.listen.meanVault);
  console.log(
    `measured tools ${name.padEnd(22)} blind ${String(blind.meanVault).padStart(6)}  heartbeat ${String(listen.meanVault).padStart(6)} (x${liftOf({ listen }).toFixed(3)} of none, ${(kept * 100).toFixed(0)}% of the whole lift; none ${relicBaseline.listen.meanVault}, all ${everyTool.listen.meanVault})  ${relics.join("+")}`,
  );
}

console.log(
  `Gauntlet loop checks passed (${WINDOWS_PER_CASE} windows a case, measured ${MEASURED_WINDOWS_PER_CASE.toFixed(2)}; best blind: ${bestFixed.label}, ${bestFixed.meanVault}; best heartbeat: ${bestHeartbeat.label}, ${bestHeartbeat.meanVault}; ceiling ${oracle.meanVault}; bust to skip: ${skipper.meanVault} over ${skipper.meanWindows} windows; holding a type: ${holder.meanVault} (pot bonus ${holder.meanBonus.toFixed(3)}), a random type: ${randomType.meanVault}; locked: ${lockReport.map((row) => `${row.mode} ${row.listen.meanVault}`).join(", ")}).`,
);
