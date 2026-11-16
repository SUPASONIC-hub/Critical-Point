import assert from "node:assert/strict";
import { test } from "node:test";

import { CASE_SEQUENCE } from "../../src/gameCases.js";
import { caseOpeningRoutes } from "../../src/gameData.js";
import { CHAIN_MARK, recheckChain, UNCHECKED } from "../../src/chainRecheck.js";
import { STAGED } from "../../src/gauntlet/tableUnlocks.js";
import { recheckCaseSettlement, recheckOpeningRoute } from "../../src/settlementRecheck.js";
import { createSeasonBot } from "../../scripts/sim/season-bot.mjs";

/**
 * F1 step 2 (설계-남은-우선항목-20261111 F1-2 (1)): the night's checker reads
 * the two records the case-open snapshot carries, LOCK's carry (`focusCarry`,
 * chainRecheck.js) and the route a case opened on (`openingRoute`,
 * settlementRecheck.js `recheckOpeningRoute`), against what the case before
 * closed on. A season the bot plays is what the page records, so "the hook's
 * result = the result played again" on every seed, and an edit is marked.
 */
function seasonRows(seed, archetype, story = false) {
  const season = createSeasonBot({ seed, staged: STAGED }).playSeason(0, archetype, story);
  return CASE_SEQUENCE.map((caseId) => ({
    run_id: `bot-${seed}-${archetype}${story ? "-story" : ""}`,
    case_id: caseId,
    summary: season.caseResults[caseId],
    dynamics: season.caseDynamics[caseId],
    decision_log: season.caseLogs[caseId],
  }));
}

const check = (rows) => recheckChain(rows, { settle: recheckCaseSettlement, opening: recheckOpeningRoute });
const ARCHETYPES = ["balanced", "money", "random", "procedure"];
const SEEDS = Array.from({ length: 10 }, (_, index) => 20261112 + index * 7919);
const honest = seasonRows(20261112, "balanced");
const copy = () => structuredClone(honest);
/** The open snapshot of the case at `index`. */
const openOf = (rows, index) => rows[index].dynamics.open;
const opening = (field) => (breaks) => breaks.some((found) => found.where === "between" && found.field === field);

test("bot seasons: the carry and the route played again are the ones recorded, on every seed (no false mark)", () => {
  let seasons = 0;
  let falseMarks = 0;
  for (const archetype of ARCHETYPES) {
    for (const [index, seed] of SEEDS.entries()) {
      const rows = seasonRows(seed, archetype, index % 5 === 4);
      const report = check(rows);
      seasons += 1;
      if (report.marks.length) falseMarks += 1;
      assert.deepEqual(report.breaks, [], `${rows[0].run_id}: ${JSON.stringify(report.breaks.slice(0, 3))}`);
      // Both read on every case: nothing of the two is left not checked.
      for (const field of UNCHECKED.between) assert.equal(report.unchecked.fields[field], undefined, `${rows[0].run_id} ${field}`);
      // Each case after the first opened on the REBOOT board its case before closed on.
      for (const row of rows.slice(1)) assert.equal(row.dynamics.open.focusCarry.rebooted, true, row.case_id);
    }
  }
  assert.equal(seasons, ARCHETYPES.length * SEEDS.length);
  assert.equal(falseMarks, 0);
});

test("the route played again names the case before's outcome and rank, and leads where the first decision was made", () => {
  for (const [index, row] of honest.entries()) {
    const before = honest[index - 1] ?? null;
    assert.deepEqual(recheckOpeningRoute(row, before), { breaks: [], unchecked: [] }, row.case_id);
    const route = row.dynamics.open.openingRoute;
    assert.equal(route.nodeId, row.decision_log[0].nodeId);
    assert.equal(route.after, before?.summary.outcomeChoiceId ?? null);
  }
});

test("LOCK's carry edited is marked", () => {
  const edits = {
    "a REBOOT board said to be fresh": (rows) => { openOf(rows, 10).focusCarry.rebooted = false; },
    "a stance carry the close never held": (rows) => { openOf(rows, 20).focusCarry.stance = "strikeWake"; },
    "the season's first case on a REBOOT board": (rows) => { openOf(rows, 0).focusCarry.rebooted = true; },
    "a kept board that is not the close's": (rows) => { openOf(rows, 30).schema.mutations.push("overclock"); },
    "a board laid fresh that holds a stance carry": (rows) => { openOf(rows, 0).schema.mutations.push("steadyLine"); },
  };
  for (const [name, edit] of Object.entries(edits)) {
    const rows = copy();
    edit(rows);
    const report = check(rows);
    assert.deepEqual(report.marks, [CHAIN_MARK], name);
    assert.ok(opening("open.focusCarry")(report.breaks) || opening("open.schema")(report.breaks), `${name}: ${JSON.stringify(report.breaks)}`);
  }
});

test("the route edited is marked, and the hand it dealt", () => {
  const otherOutcome = (rows, index) => {
    const before = rows[index - 1].summary.outcomeChoiceId;
    return Object.keys(caseOpeningRoutes[rows[index].case_id] ?? {}).find((id) => id !== before) ?? "c_other";
  };
  const edits = {
    "another outcome before": (rows) => { openOf(rows, 12).openingRoute.after = otherOutcome(rows, 12); },
    "another rank before": (rows) => { openOf(rows, 14).openingRoute.rank = rows[13].summary.rank === "S" ? "C" : "S"; },
    "another opening scene": (rows) => { openOf(rows, 16).openingRoute.nodeId = "c99_nowhere"; },
    "a route before the season's first case": (rows) => { openOf(rows, 0).openingRoute.after = "p0_after"; },
    // The first decision started from it too, so only the route reads it.
    "a richer opening hand": (rows) => {
      openOf(rows, 18).resources.capital += 10;
      rows[18].decision_log[0].resourcesBefore.capital += 10;
    },
  };
  for (const [name, edit] of Object.entries(edits)) {
    const rows = copy();
    edit(rows);
    const report = check(rows);
    assert.deepEqual(report.marks, [CHAIN_MARK], name);
    assert.ok(opening("open.openingRoute")(report.breaks) || opening("open.resources")(report.breaks), `${name}: ${JSON.stringify(report.breaks)}`);
  }
  // The richer hand passes the chain alone (the first decision says the same); the route is what catches it.
  const richer = copy();
  openOf(richer, 18).resources.capital += 10;
  richer[18].decision_log[0].resourcesBefore.capital += 10;
  assert.deepEqual(recheckChain(richer, { settle: recheckCaseSettlement }).breaks.filter((found) => found.case === richer[18].case_id && found.where === "between"), []);
});

test("a row from a build before the two records, a replay or a missing case before is not checked, never marked", () => {
  // A build before F1 step 2: both null.
  const older = copy();
  for (const row of older) Object.assign(row.dynamics.open, { focusCarry: null, openingRoute: null });
  const report = check(older);
  assert.deepEqual(report.marks, []);
  for (const field of UNCHECKED.between) assert.equal(report.unchecked.fields[field], CASE_SEQUENCE.length, field);
  // No `opening` checker handed in: the route is counted, the carry still read.
  const plain = recheckChain(copy(), { settle: recheckCaseSettlement });
  assert.equal(plain.unchecked.fields.openingRoute, CASE_SEQUENCE.length);
  assert.equal(plain.unchecked.fields.focusCarry, undefined);
  // A replay's opening, and a case after a case before sent from a replay.
  const replay = copy();
  openOf(replay, 5).practice = true;
  assert.deepEqual(recheckOpeningRoute(replay[5], replay[4]).unchecked, ["openingRoute"]);
  assert.deepEqual(recheckOpeningRoute(replay[6], replay[5]).unchecked, ["openingRoute"]);
  // A case before that is not here, or names no outcome.
  assert.deepEqual(recheckOpeningRoute(honest[8], null).unchecked, ["openingRoute"]);
  assert.deepEqual(recheckOpeningRoute(honest[8], { ...honest[7], summary: {} }).unchecked, ["openingRoute"]);
  // A table stamped from a save that named no case before (runState's seasonRoute).
  const stamped = copy();
  openOf(stamped, 9).openingRoute = { after: null, rank: null, nodeId: stamped[9].decision_log[0].nodeId };
  assert.deepEqual(check(stamped).marks, []);
  // A window between the close and the opening (left half way, opened again): the carry is not read.
  const gap = copy();
  const reopened = recheckChain(gap.map((row, index) => (index === 0 ? { ...row, dynamics: { ...row.dynamics, open: { ...row.dynamics.open, windowIndex: 2, busts: 0, cashes: 0 } } } : row)), { settle: recheckCaseSettlement, opening: recheckOpeningRoute });
  assert.equal(reopened.unchecked.fields.focusCarry, 1);
});
