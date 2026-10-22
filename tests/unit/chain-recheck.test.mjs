import assert from "node:assert/strict";
import { test } from "node:test";

import { CASE_SEQUENCE } from "../../src/gameCases.js";
import { CHAIN_MARK, recheckCaseGap, recheckCaseLinks, recheckChain, UNCHECKED } from "../../src/chainRecheck.js";
import { RELIC_IDS } from "../../src/gauntlet/relics.js";
import { STAGED } from "../../src/gauntlet/tableUnlocks.js";
import { createSeasonBot } from "../../scripts/sim/season-bot.mjs";

/**
 * A run's case rows as the server stores them, made by the season bot: one
 * row per closed case, its `dynamics` what the close wrote (the run summary,
 * the close's links and draft, and the case's opening snapshot, S3) and its
 * `decision_log` the case's log. Fixed seeds, so the rows are the same on
 * every run of the test.
 */
function seasonRows(seed, archetype) {
  const bot = createSeasonBot({ seed, staged: STAGED });
  const season = bot.playSeason(0, archetype);
  return CASE_SEQUENCE.map((caseId) => ({
    run_id: `bot-${seed}`,
    case_id: caseId,
    dynamics: season.caseDynamics[caseId],
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
    // What waits for S2, and what the opening snapshot cannot answer, is counted on every case, never passed.
    for (const field of [...UNCHECKED.inside, ...UNCHECKED.between]) assert.equal(report.unchecked.fields[field], CASE_SEQUENCE.length, field);
    // Every row carries its opening snapshot, so none of the opening is left unchecked.
    for (const field of [...UNCHECKED.open, "reopened", "practice", "links", "relics"]) assert.equal(report.unchecked.fields[field], undefined, field);
    assert.ok(rows.every((row) => row.dynamics.open?.caseId === row.case_id));
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
    for (const counts of [row.dynamics, row.dynamics.open]) {
      counts.windowIndex += 3;
      counts.practiceWindows += 3;
      counts.busts += 1;
      counts.cashes += 2;
    }
  }
  const report = recheckChain(rows);
  assert.deepEqual(report.marks, []);
  assert.equal(report.unchecked.fields.reopened, undefined, "a replay hands its table back, so the opening is still read whole");
});

test("a case left half way and opened again: the opening is read for what cannot move, the rest is not checked", () => {
  const rows = copy(honest[0]);
  // Three windows of a first try at case 12, which leave no row, before it was opened again.
  for (const row of rows.slice(12)) {
    for (const counts of [row.dynamics, row.dynamics.open]) counts.windowIndex += 3;
  }
  rows[12].dynamics.open.logic = { ...rows[12].dynamics.open.logic, streak: rows[12].dynamics.open.logic.streak + 2 };
  let report = recheckChain(rows);
  assert.deepEqual(report.marks, []);
  assert.equal(report.unchecked.fields.reopened, 1);
  // The vault does not move without a close, first try or not.
  rows[12].dynamics.open.vault += 50;
  report = recheckChain(rows);
  assert.deepEqual(report.marks, [CHAIN_MARK]);
  assert.ok(report.breaks.some((found) => found.field === "open.vault" && found.case === rows[12].case_id));
});

test("an opening edited away from the close before it is marked, with where (S3)", () => {
  const offered = honest.flatMap((rows) => rows.map((row, index) => ({ rows, index }))).find(({ rows, index }) => index > 0 && rows[index - 1].dynamics.relicOffer.length > 0);
  const notOffered = (rows, index) => RELIC_IDS.find((id) => !rows[index - 1].dynamics.relics.includes(id) && !rows[index - 1].dynamics.relicOffer.includes(id) && !rows[index].dynamics.open.relics.includes(id));
  const edits = {
    "open.vault": (rows) => { rows[20].dynamics.open.vault += 100; },
    "open.handVault": (rows) => { rows[20].dynamics.open.handVault += 1; rows[20].dynamics.open.vault += 1; },
    "open.stanceMastery": (rows) => { rows[25].dynamics.open.stanceMastery.strike += 1; },
    "open.logic": (rows) => { rows[30].dynamics.open.logic.best += 5; },
    "open.linksIn": (rows) => { rows[18].dynamics.open.linksIn = [{ from: 0, due: 2 }]; },
    "open.windowIndex": (rows) => { rows[22].dynamics.open.windowIndex = rows[21].dynamics.windowIndex - 1; },
    "open.caseId": (rows) => { rows[9].dynamics.open.caseId = rows[8].case_id; },
    "open.veteran": (rows) => { rows[14].dynamics.open.veteran = true; },
    "resourcesBefore": (rows) => { rows[16].dynamics.open.resources = { ...rows[16].dynamics.open.resources, capital: rows[16].dynamics.open.resources.capital + 30 }; },
  };
  for (const [field, edit] of Object.entries(edits)) {
    const rows = copy(honest[0]);
    edit(rows);
    const report = recheckChain(rows);
    assert.deepEqual(report.marks, [CHAIN_MARK], field);
    assert.ok(report.breaks.some((found) => found.field === field), `${field}: ${JSON.stringify(report.breaks)}`);
  }
  // A tool that was neither held nor offered at the close.
  assert.ok(offered, "the bot seasons take a draft");
  const rows = copy(offered.rows);
  const stranger = notOffered(rows, offered.index);
  assert.ok(stranger);
  rows[offered.index].dynamics.open.relics = [...rows[offered.index].dynamics.open.relics, stranger];
  assert.ok(recheckChain(rows).breaks.some((found) => found.field === "open.relics"));
});

test("the season's first case opens empty", () => {
  for (const [field, edit] of Object.entries({
    "open.vault": (open) => { open.vault = 40; },
    "open.relics": (open) => { open.relics = [RELIC_IDS[0]]; },
    "open.busts": (open) => { open.busts = 1; },
    "open.logic": (open) => { open.logic.best = 3; },
  })) {
    const rows = copy(honest[1]);
    edit(rows[0].dynamics.open);
    const report = recheckChain(rows);
    assert.deepEqual(report.marks, [CHAIN_MARK], field);
    assert.ok(report.breaks.some((found) => found.field === field && found.case === CASE_SEQUENCE[0]), field);
  }
});

test("rows from a build before the snapshot leave the opening not checked, never marked", () => {
  const rows = copy(honest[2]);
  for (const row of rows) {
    delete row.dynamics.open;
    delete row.dynamics.linksOut;
    delete row.dynamics.relicOffer;
    delete row.dynamics.practiceWindows;
  }
  const report = recheckChain(rows);
  assert.deepEqual(report.marks, []);
  for (const field of UNCHECKED.open) assert.equal(report.unchecked.fields[field], CASE_SEQUENCE.length, field);
  // A close from before the snapshot, followed by a case with one: what the close cannot say is not checked.
  const mixed = copy(honest[2]);
  const index = mixed.findIndex((row, at) => at > 0 && row.dynamics.open.relics.some((id) => !mixed[at - 1].dynamics.relics.includes(id)));
  if (index > 0) {
    delete mixed[index - 1].dynamics.relicOffer;
    const found = recheckChain(mixed);
    assert.deepEqual(found.marks, []);
    assert.equal(found.unchecked.fields.relics, 1);
  }
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

test("what the snapshot or the close cannot say is counted, not marked", () => {
  const unchecked = (edit) => {
    const rows = copy(honest[0]);
    edit(rows);
    const report = recheckChain(rows);
    assert.deepEqual(report.marks, [], JSON.stringify(report.breaks));
    return report.unchecked.fields;
  };
  // A first close sent from a replay is the replay's table.
  assert.equal(unchecked((rows) => { rows[6].dynamics.open.practice = true; }).practice, 1);
  // A close from before `linksOut`.
  assert.equal(unchecked((rows) => { delete rows[6].dynamics.linksOut; }).links, 1);
  // The season's first case left half way and opened again.
  assert.equal(unchecked((rows) => { for (const row of rows) for (const counts of [row.dynamics, row.dynamics.open]) counts.windowIndex += 2; }).reopened, 1);
  // A close without its window count cannot say what lay between.
  assert.equal(unchecked((rows) => { delete rows[6].dynamics.windowIndex; }).reopened, 1);
  // A snapshot with no list of tools is a break.
  const rows = copy(honest[0]);
  rows[6].dynamics.open.relics = null;
  assert.ok(recheckChain(rows).breaks.some((found) => found.field === "open.relics"));
});
