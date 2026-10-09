import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { isSavedStateShapeValid, parseCurrentSavedState, SAVE_SCHEMA_VERSION } from "../../src/appConfig.js";
import { normalizeRunState, serializeRunState } from "../../src/gauntlet/gauntletEngine.js";
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
    ["v1-prototype.json", "v2-current.json", "v2-pre-gauntlet.json", "v2-pre-prologue.json", "v2-pre-relic.json", "v2-pre-unlocks.json"],
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
