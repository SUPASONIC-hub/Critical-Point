import assert from "node:assert/strict";
import {
  BASE_SCHEMA,
  createWindow,
  getCloseness,
  getHeartbeatBpm,
  GROOVE_CAP,
  openCaseRun,
  reduceWindow,
  resolveWindow,
} from "../src/gauntlet/gauntletEngine.js";
import { RELIC_IDS } from "../src/gauntlet/relics.js";

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
 * - a relic bends a rule, it does not break the table: with every relic alone
 *   and all of them together, the heartbeat still beats playing blind and still
 *   stays far under a player who could see the wall, busting to skip still
 *   loses, and no single relic lifts the best play by more than RELIC_LIFT_CAP.
 */

const CASES = 1500;
const WINDOWS_PER_CASE = 7;
const card = { id: "sim", label: "sim", effect: { capital: 12, trust: 6, humanCost: 4 } };

function playCase(caseIndex, decide, grade = null, relics = []) {
  let run = openCaseRun({ relics });
  let busts = 0;
  let mutatedAfterBust = 0;
  let played = 0;
  for (let windowIndex = 0; windowIndex < WINDOWS_PER_CASE; windowIndex += 1) {
    played += 1;
    let win = createWindow({ schema: run.schema, seed: `sim:${caseIndex}:${windowIndex}`, beatCombo: run.beatCombo });
    win = reduceWindow(win, { type: "SELECT", id: card.id });
    for (let press = 0; press < 30 && win.status === "live"; press += 1) {
      if (!decide(win, run)) break;
      win = reduceWindow(win, { type: "PUSH", grade });
      win = reduceWindow(win, { type: "TICK", delta: 0.6 });
    }
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

function measure(label, decide, grade = null, relics = [], cases = CASES) {
  let vault = 0;
  let busts = 0;
  let mutated = 0;
  let played = 0;
  for (let caseIndex = 0; caseIndex < cases; caseIndex += 1) {
    const result = playCase(caseIndex, decide, grade, relics);
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

// The same best heartbeat policy, played by three hands: one on every beat, one
// off every beat, and the untimed simulation above.
const heartbeatThreshold = (label) => Number(label.split("< ")[1]);
const bestHeartbeatSoFar = heartbeat.reduce((best, row) => (row.meanVault > best.meanVault ? row : best));
const listening = (win) => getHeartbeatBpm(win.gauge, win.wall + win.tellOffset, win.schema.sedated) < heartbeatThreshold(bestHeartbeatSoFar.label);
const onBeat = measure("on every beat", listening, "perfect");
const offBeat = measure("off every beat", listening, "miss");

const rows = [...fixed, ...heartbeat, oracle, skipper, onBeat, offBeat];
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
// Relics. Each set replays the policies that matter near the optimum on fewer
// cases, and the invariants above are asserted again under it.
const RELIC_CASES = 600;
const RELIC_LIFT_CAP = 1.35;
const relicSets = [[], ...RELIC_IDS.map((id) => [id]), RELIC_IDS];
const bestOf = (list) => list.reduce((best, row) => (row.meanVault > best.meanVault ? row : best));
const relicReport = relicSets.map((relics) => {
  const name = relics.length === 0 ? "none" : relics.length === RELIC_IDS.length ? "all" : relics[0];
  const blind = bestOf([40, 50, 60].map((target) => measure(`${name} heat ${target}`, (win) => win.gauge < target, null, relics, RELIC_CASES)));
  const listen = bestOf([90, 100, 110].map((threshold) =>
    measure(`${name} heartbeat < ${threshold}`, (win) => getHeartbeatBpm(win.gauge, win.wall + win.tellOffset, win.schema.sedated) < threshold, null, relics, RELIC_CASES),
  ));
  const sees = measure(`${name} sees the wall`, (win) => win.gauge + win.schema.stepMax < win.wall, null, relics, RELIC_CASES);
  const skip = measure(`${name} bust to skip`, (win) => (win.seed.endsWith(`:${WINDOWS_PER_CASE - 1}`) ? win.gauge < 50 : true), null, relics, RELIC_CASES);
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

const bustRows = rows.filter((row) => row.busts > 0);
assert.ok(
  bustRows.every((row) => row.mutated > 0),
  "a bust mid-case always deals a broken board next",
);
assert.equal(BASE_SCHEMA.stepMin > 0, true);
assert.ok(getCloseness(0, 90) === 0);

console.log(
  `Gauntlet loop checks passed (best blind: ${bestFixed.label}, ${bestFixed.meanVault}; best heartbeat: ${bestHeartbeat.label}, ${bestHeartbeat.meanVault}; ceiling ${oracle.meanVault}; bust to skip: ${skipper.meanVault} over ${skipper.meanWindows} windows; on the beat: ${onBeat.meanVault}, off it: ${offBeat.meanVault}).`,
);
