import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { isSavedStateShapeValid, parseCurrentSavedState, SAVE_SCHEMA_VERSION } from "../../src/appConfig.js";
import { getEndingVariant, getSeasonStrain } from "../../src/gameLogic.js";
import { createGauntletLedger, createTableRecord, createWindow, getHandBonus, normalizeRunState, reduceWindow, resolveWindow, serializeRunState } from "../../src/gauntlet/gauntletEngine.js";
import { describeVerdictCause } from "../../src/gauntlet/tableReadout.js";
import { validateSavedStatePayload } from "../../src/state/payloadSchemas.js";
import { repairSavedState } from "../../src/state/savedState.js";

/**
 * Saves as older builds wrote them, loaded the way the runtime loads one.
 *
 * Every fixture here is a shape a real build put into players' browsers; the
 * `writtenBy` line in each file names the commit it was read out of. A save
 * that stops loading is a season somebody loses, and nothing else in the suite
 * would notice: the other tests build their saves from the current shape.
 *
 * Adding a field the validator requires? Add the fixture for the build before
 * it, and this file says whether that build's players can still resume.
 */
const FIXTURES = path.join(path.dirname(fileURLToPath(import.meta.url)), "fixtures", "saves");

const fixtures = readdirSync(FIXTURES)
  .filter((name) => name.endsWith(".json"))
  .sort()
  .map((name) => ({ name, ...JSON.parse(readFileSync(path.join(FIXTURES, name), "utf8")) }));

/** `useRuntimeSavedState`'s own pipeline: parse and migrate, repair, validate. */
function load(save) {
  const parsed = parseCurrentSavedState(JSON.stringify(save), SAVE_SCHEMA_VERSION);
  const { state, repaired } = repairSavedState(parsed);
  return { parsed, state, repaired, valid: isSavedStateShapeValid(state) };
}

test("every era of save has a fixture", () => {
  assert.deepEqual(
    fixtures.map((fixture) => fixture.name),
    ["v1-prototype.json", "v2-current.json", "v2-pre-33f-at-confront.json", "v2-pre-33f-at-dilemma.json", "v2-pre-33f-in-branch.json", "v2-pre-gauntlet.json", "v2-pre-hand-names.json", "v2-pre-prologue.json", "v2-pre-relic.json", "v2-pre-unlocks.json"],
  );
});

for (const fixture of fixtures) {
  test(`${fixture.name} loads and can be resumed`, () => {
    const { parsed, state, repaired, valid } = load(fixture.save);
    assert.ok(parsed, "the save parses and migrates to the current schema");
    assert.equal(valid, true, "the repaired save passes validation, so the runtime keeps it");
    assert.equal(state.saveSchemaVersion, SAVE_SCHEMA_VERSION);
    assert.equal(state.currentCase, fixture.expect.currentCase, "the run resumes in the case it was left in");
    assert.equal(state.nodeId, fixture.expect.nodeId, "and at the scene it was left at");
    assert.equal(state.log.length, fixture.expect.logLength, "with its decisions");
    if ("repaired" in fixture.expect) assert.equal(repaired, fixture.expect.repaired);

    // What the runtime deals the table from, and what it writes back.
    const run = normalizeRunState(state.dynamics);
    if ("windowIndex" in fixture.expect) assert.equal(run.windowIndex, fixture.expect.windowIndex, "the window count never goes backwards");
    if ("vault" in fixture.expect) assert.equal(run.vault, fixture.expect.vault, "the vault is carried");
    if (fixture.expect.suspended) assert.equal(run.suspended?.window.selectedId, fixture.save.dynamics.suspended.window.selectedId);

    // A save that has been loaded once loads the same way the second time.
    const again = load(JSON.parse(JSON.stringify({ ...state, lastError: undefined, paused: false })));
    assert.equal(again.valid, true);
    assert.equal(again.repaired, false, "a repaired save is not repaired again on the next reload");
  });
}

test("the save this build writes is not called repaired", () => {
  const current = fixtures.find((fixture) => fixture.name === "v2-current.json");
  const { state, repaired } = load(current.save);
  assert.equal(repaired, false);
  assert.equal(state.lastError, undefined, "no recovery notice on an ordinary resume");
  assert.deepEqual(state.dynamics, serializeRunState(current.save.dynamics), "and its table record is unchanged");
});

/**
 * The table until 2026-10-10 graded each press against the heartbeat (the
 * beat), and the builds of that day still wrote what it had counted. This
 * build writes none of it and names the hand's share for what it is. A save
 * from either must come back whole and unannounced: what is read is read as it
 * was, what nothing reads is dropped without being called a repair.
 */
test("a save from the table that graded a press loads without a notice, under the names this build reads", () => {
  const fixture = fixtures.find((entry) => entry.name === "v2-pre-hand-names.json");
  const saved = fixture.save.dynamics;
  const { state, repaired, valid } = load(fixture.save);
  assert.deepEqual([valid, repaired, state.paused], [true, false, fixture.save.paused], "no 복구됨 notice, no pause it did not have");
  assert.equal(state.lastError, undefined);
  const run = state.dynamics;

  // The hand's share, under its own names; the counts nothing reads are gone, at every depth.
  assert.deepEqual([run.runHand, run.handVault, run.practice.handVault], [saved.runGroove, saved.grooveVault, saved.practice.grooveVault]);
  const gone = ["beatCombo", "bestCombo", "maxCombo", "beatHits", "perfects", "slips", "focusPerfects", "focusMisses", "runGroove", "grooveVault"];
  for (const record of [run, run.suspended.window, run.practice, run.practice.record]) {
    for (const key of gone) assert.equal(key in record, false, key);
  }
  // Everything else the record held is as it was saved.
  const { beatCombo: _a, bestCombo: _b, focusPerfects: _c, focusMisses: _d, runGroove, grooveVault: _e, suspended, practice, ...rest } = saved;
  const { suspended: _window, practice: _practice, runHand: _f, handVault: _g, ...kept } = run;
  assert.deepEqual(kept, rest);
  assert.deepEqual([run.practice.logic, run.practice.vault, run.practice.record.grooveBanked], [practice.logic, practice.vault, practice.record.grooveBanked]);
  assert.deepEqual(run.logic, saved.logic, "the streak is the save's");

  // The window put down with a groove is still paid on it: x1.36, with the streak at none.
  const table = normalizeRunState(run);
  const resumed = createWindow({ schema: table.schema, seed: table.suspended.seed, resume: table.suspended.window });
  assert.deepEqual([resumed.status, resumed.groove, resumed.gauge, resumed.focus, resumed.selectedId], ["live", 12, 33, 37, suspended.window.selectedId]);
  const { verdict, nextRun } = resolveWindow({ run: table, window: reduceWindow(resumed, { type: "CASH" }), card: { id: suspended.window.selectedId, effect: {} } });
  assert.equal(verdict.logic.bonus, getHandBonus(12, 0, "strike", 0));
  assert.equal(verdict.logic.bonus, 1.36);
  assert.ok(verdict.pot > Math.round(verdict.chips * verdict.multiplier));
  assert.equal(nextRun.runHand, runGroove + verdict.logic.pot + verdict.focus.pot, "and the share it had banked is added to, not started over");

  // The log is the save's own: the line the archive prints, and the share and the cause its ledger reads.
  const [entry] = state.log;
  assert.deepEqual(entry, fixture.save.log[0]);
  assert.equal(entry.tempoBonus.label, "FEVER");
  assert.equal(createGauntletLedger(state.log).grooveBanked, 180, "the ledger still counts what that entry banked");
  assert.equal(describeVerdictCause({ outcome: "bust", cause: "focus" }), "락이 올린 열이 벽에 닿았다", "a verdict of that table still reads as it did");

  // The first close's summary: its record is handed back when the replay closes, and the vault slack leaves its share out.
  const summary = state.caseResults.prologue02;
  assert.deepEqual(summary.pushRecord, fixture.save.caseResults.prologue02.pushRecord, "a summary is not rewritten");
  const closing = resolveWindow({ run: table, window: reduceWindow(resumed, { type: "CASH" }), card: { id: "a", effect: {} }, caseClosed: true });
  assert.deepEqual([closing.verdict.practice, closing.verdict.firstRecord.busts, closing.verdict.firstRecord.grooveBanked], [true, 1, 260]);
  assert.deepEqual(createTableRecord([{ threshold: { ...entry.threshold, firstRecord: closing.verdict.firstRecord } }]).busts, 1);
  assert.deepEqual([closing.nextRun.vault, closing.nextRun.handVault], [7300, 520], "the replay hands the vault and the share back");
  const strain = getSeasonStrain(state.caseResults);
  assert.equal(strain.seasonVaultPerCase, 7300 - 520);
  // Decided for this build: the combo of pushes that summary holds (11, under the old door's 12 or over it) opens nothing.
  const season = { ...strain, resources: { trust: 80, legitimacy: 90, capital: 60 }, seasonResources: { trust: 80, legitimacy: 90, capital: 60 }, discoveredClues: [], log: [] };
  assert.equal(getEndingVariant(season).id, getEndingVariant({ ...season, seasonBestCombo: 99 }).id);
});

test("a table record missing one field is filled in without a recovery notice", () => {
  const current = fixtures.find((fixture) => fixture.name === "v2-current.json").save;
  const partial = { ...current.dynamics };
  delete partial.lastGauge;
  const { state, repaired, valid } = load({ ...current, dynamics: partial });
  assert.equal(valid, true, "the validator asks for lastGauge, and used to discard the save for want of it");
  assert.equal(repaired, false, "a missing key that reads as its default is not a repair");
  assert.equal(state.dynamics.lastGauge, 0);
  assert.equal(state.dynamics.vault, current.dynamics.vault);
});

test("a table record that is not a record at all is replaced, and says so", () => {
  const current = fixtures.find((fixture) => fixture.name === "v2-current.json").save;
  for (const broken of ["corrupt", ["a", "b"], 42]) {
    const { state, repaired, valid } = load({ ...current, dynamics: broken });
    assert.equal(valid, true);
    assert.equal(repaired, true);
    assert.equal(state.lastError.source, "save-integrity");
    assert.equal(state.dynamics.windowIndex, 0);
  }
  const empty = load({ ...current, dynamics: {} });
  assert.equal(empty.valid, true, "an empty record is every field missing");
  assert.equal(empty.repaired, false);
});

test("the validator itself refuses a table record that is not a record", () => {
  // The test above goes through the repair, which replaces such a record
  // before the validator sees it; nothing handed the validator one, so the
  // line that refuses it was run by no test and its coverage came and went
  // with the order the test processes were merged in (the 2026-10-07 audit,
  // B4 finding 1).
  const current = fixtures.find((fixture) => fixture.name === "v2-current.json").save;
  assert.deepEqual(validateSavedStatePayload(current), []);
  for (const broken of ["corrupt", ["a", "b"], 42, true]) {
    assert.deepEqual(validateSavedStatePayload({ ...current, dynamics: broken }), ["invalid dynamics"], JSON.stringify(broken));
    assert.equal(isSavedStateShapeValid({ ...current, dynamics: broken }), false);
    assert.deepEqual(validateSavedStatePayload({ ...current, dynamics: broken }, { dynamics: false }), [], "a check that leaves the table out does not read it");
  }
  // No record at all is a save from before the table, not a broken one.
  assert.deepEqual(validateSavedStatePayload({ ...current, dynamics: null }), []);
  assert.deepEqual(validateSavedStatePayload({ ...current, dynamics: undefined }), []);
});

test("the decision board's record is brought up to date, not thrown away with the run", () => {
  const board = fixtures.find((fixture) => fixture.name === "v2-pre-gauntlet.json").save;
  assert.equal(isSavedStateShapeValid(parseCurrentSavedState(JSON.stringify(board))), false, "as written, it fails the validator");
  const { state, repaired } = load(board);
  assert.equal(repaired, true, "fields the table no longer has were dropped");
  assert.equal(state.paused, true);
  assert.equal(state.lastError.source, "save-integrity");
  assert.equal(state.completedCases.length, 1, "the season's progress is what the player gets back");
  assert.equal(state.dynamics.combo, undefined);
  assert.equal(state.dynamics.schema.mutations.length, 0);
});
