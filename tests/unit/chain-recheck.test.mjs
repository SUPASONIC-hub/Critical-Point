import assert from "node:assert/strict";
import { test } from "node:test";

import { CASE_SEQUENCE } from "../../src/gameCases.js";
import { CHAIN_MARK, recheckCaseGap, recheckCaseLinks, recheckChain, UNCHECKED } from "../../src/chainRecheck.js";
import { STAGED } from "../../src/gauntlet/tableUnlocks.js";
import { createSeasonBot } from "../../scripts/sim/season-bot.mjs";

/**
 * A run's case rows as the server stores them, made by the season bot: one
 * row per closed case, its `dynamics` the run summary the close wrote and its
 * `decision_log` the case's log. Fixed seeds, so the rows are the same on
 * every run of the test.
 */
function seasonRows(seed, archetype) {
  const bot = createSeasonBot({ seed, staged: STAGED });
  const season = bot.playSeason(0, archetype);
  return CASE_SEQUENCE.map((caseId) => ({
    run_id: `bot-${seed}`,
    case_id: caseId,
    dynamics: season.caseResults[caseId].gauntlet,
    decision_log: season.caseLogs[caseId],
  }));
}

const honest = [seasonRows(20261021, "balanced"), seasonRows(20261022, "money"), seasonRows(20261023, "random")];
const copy = (rows) => structuredClone(rows);

test("an honest season chains with no mark, and says what it did not check", () => {
  for (const rows of honest) {
    const report = recheckChain(rows);
    assert.deepEqual(report.breaks, [], `${rows[0].run_id}: ${JSON.stringify(report.breaks.slice(0, 3))}`);
    assert.equal(report.status, "linked");
    assert.deepEqual(report.marks, []);
    assert.equal(report.cases.length, CASE_SEQUENCE.length);
    assert.equal(report.unchecked.links, 0);
    // What waits for S2 and S3 is counted on every case, never passed.
    for (const field of [...UNCHECKED.inside, ...UNCHECKED.between]) assert.equal(report.unchecked.fields[field], CASE_SEQUENCE.length, field);
  }
});

test("the rows' order does not matter, and the season row is left out", () => {
  const rows = copy(honest[0]).reverse();
  rows.push({ run_id: rows[0].run_id, case_id: "season-final", dynamics: null, decision_log: [] });
  assert.deepEqual(recheckChain(rows).marks, []);
});

test("a state edited between two cases is marked", () => {
  const edits = {
    "a vault taken down": (rows) => { rows[20].dynamics.vault = rows[19].dynamics.vault - 1; },
    "a window count wound back": (rows) => { rows[30].dynamics.windowIndex = rows[29].dynamics.windowIndex; },
    "busts wiped": (rows) => {
      const index = rows.findIndex((row, at) => at > 0 && row.decision_log.some((entry) => entry.threshold?.busted));
      rows[index].dynamics.busts = rows[index - 1].dynamics.busts;
    },
    "a week stamp changed mid-run": (rows) => { rows[10].dynamics.weekRule = "made-up"; },
  };
  for (const [name, edit] of Object.entries(edits)) {
    const rows = copy(honest[0]);
    edit(rows);
    const report = recheckChain(rows);
    assert.deepEqual(report.marks, [CHAIN_MARK], name);
    assert.ok(report.breaks.some((found) => found.where === "between"), name);
  }
});

test("resources edited between two decisions of a case are marked, with where", () => {
  const rows = copy(honest[1]);
  const index = rows.findIndex((row) => row.decision_log.length > 2);
  rows[index].decision_log[2].resourcesBefore = { ...rows[index].decision_log[2].resourcesBefore, capital: 999 };
  const report = recheckChain(rows);
  assert.deepEqual(report.marks, [CHAIN_MARK]);
  assert.deepEqual(report.breaks.map(({ case: caseId, where, entry, field }) => ({ caseId, where, entry, field })), [{ caseId: rows[index].case_id, where: "inside", entry: 2, field: "resourcesBefore" }]);
});

test("a decision moved into another case is marked", () => {
  const rows = copy(honest[2]);
  rows[5].decision_log[0].caseId = rows[4].case_id;
  assert.deepEqual(recheckChain(rows).marks, [CHAIN_MARK]);
});

test("a case delivered twice is marked", () => {
  const rows = copy(honest[0]);
  rows.push(copy(rows[7]));
  assert.deepEqual(recheckChain(rows).marks, [CHAIN_MARK]);
});

test("a gap in the rows breaks nothing: the links beside it are not checked", () => {
  const rows = copy(honest[0]).filter((row) => row.case_id !== "case10");
  const report = recheckChain(rows);
  assert.deepEqual(report.marks, []);
  assert.equal(report.unchecked.links, 1);
  assert.equal(report.cases.find((found) => found.caseId === "case11").link, "unchecked");
  const late = recheckChain(copy(honest[0]).slice(3));
  assert.deepEqual(late.marks, []);
  assert.equal(late.unchecked.links, 1, "a run read from its middle checks no start");
});

test("practice windows between two cases are not a break", () => {
  const rows = copy(honest[0]);
  // A closed case played again: windows, a bust and a cash with no row of their own.
  for (const row of rows.slice(12)) {
    row.dynamics.windowIndex += 3;
    row.dynamics.busts += 1;
    row.dynamics.cashes += 2;
  }
  assert.deepEqual(recheckChain(rows).marks, []);
});

test("a row that cannot be read is counted as not checked, never passed or marked", () => {
  assert.equal(recheckCaseLinks({ case_id: "case01", decision_log: null }).status, "unchecked");
  assert.equal(recheckCaseGap({ dynamics: null }, { dynamics: {}, decision_log: [] }).status, "unchecked");
  const rows = copy(honest[0]);
  delete rows[8].dynamics.handVault;
  const report = recheckChain(rows);
  assert.deepEqual(report.marks, []);
  assert.equal(report.unchecked.fields.handVault, 2, "the link into it and the link out of it");
  assert.deepEqual(recheckChain([]), { status: "unchecked", marks: [], breaks: [], cases: [], unchecked: { cases: 0, links: 0, fields: {} } });
});
