import assert from "node:assert/strict";
import { test } from "node:test";

import { getFinalVerdict } from "../../src/endingCopy.js";
import { getEndingVariant, ENDING_IDS } from "../../src/gameLogic.js";
import { ALL_RULES, differsForVeteran, rulesFor, UNLOCK_LADDER, VETERAN_TABLE_CASES } from "../../src/gauntlet/tableUnlocks.js";
import { CASE_SEQUENCE } from "../../src/gameCases.js";
import {
  getOpeningEcho,
  getSeasonCarry,
  newGamePlusMark,
  normalizeSeasonRecord,
  recordFinishedSeason,
  SEASON_RECORD_KEY,
  VERDICT_NAMES,
} from "../../src/state/newGamePlusCarry.js";
import { OPENING_ECHO } from "../../src/state/openingState.js";
import { findFinalChoiceEntry, getVerdictKey, VERDICT_ENDINGS } from "../../src/verdictBranch.js";

/**
 * NEW GAME+ carries the record and the story, not the table: the first piece
 * is the pure functions that pick what is carried. Nothing in the game calls
 * them yet.
 */

const ending = (id, extra = {}) => ({ id, label: id.toUpperCase().replace("-", " "), failure: false, ...extra });
const collapse = { id: "collapse", label: "SYSTEM COLLAPSE", failure: true };
const finale = (endingVariant, tableRules = 2) => ({ outcomeChoiceId: "f_after_witness", endingVariant, gauntlet: { tableRules } });

test("the verdict is judged once: the report's ruling and the carried verdict read the same rule", () => {
  const endings = [...ENDING_IDS.map((id) => ending(id, { failure: id === "collapse" })), ending("open-question")];
  for (const endingVariant of endings) {
    for (const finalChoiceId of [...Object.keys(VERDICT_ENDINGS), "f_choice_adaptive_reframe", undefined]) {
      const key = getVerdictKey({ endingVariant, finalChoiceId });
      const printed = getFinalVerdict({ endingVariant, finalChoiceId, endingSceneChoice: "x" });
      if (key === "collapse") assert.equal(printed.title, "트리거랩의 운영은 붕괴합니다.");
      else if (key === "open") assert.equal(printed.title, endingVariant.title, `${endingVariant.id} / ${finalChoiceId} is the open verdict`);
      else assert.notEqual(printed.title, endingVariant.title, `${endingVariant.id} / ${finalChoiceId} prints ${key}`);
    }
  }
  assert.equal(getVerdictKey({ endingVariant: ending("quiet-cover"), finalChoiceId: "ending_expose" }), "open", "폭로 does not stand beside QUIET COVER");
  assert.equal(getVerdictKey({ endingVariant: ending("quiet-cover"), finalChoiceId: "ending_seal" }), "ending_seal");
  assert.equal(getVerdictKey({ endingVariant: collapse, finalChoiceId: "ending_seal" }), "collapse");
  assert.equal(getVerdictKey({ endingVariant: ending("human-record"), finalChoiceId: "toString" }), "open", "an inherited name is not a verdict");
  assert.equal(getVerdictKey(), "open");
});

test("the finale's verdict choice is the last answer to its last question, not the card it closed on", () => {
  const log = [
    { nodeId: "f_choice", choiceId: "ending_reform" },
    { nodeId: "f_choice", choiceId: "ending_seal" },
    { nodeId: "f_aftershock", choiceId: "f_after_burn" },
  ];
  assert.equal(findFinalChoiceEntry(log).choiceId, "ending_seal");
  assert.equal(findFinalChoiceEntry([{ nodeId: "c1_open", choiceId: "x" }]), null);
  assert.equal(findFinalChoiceEntry(null), null);
});

test("a run is counted once, however often its finale closes, and the last ruling is the latest", () => {
  let record = normalizeSeasonRecord(null);
  assert.deepEqual(record, { seasons: 0, countedRuns: [], last: null });
  record = recordFinishedSeason(record, { runId: "run-a", finalSummary: finale(ending("human-record")), finalChoiceId: "ending_reform" });
  assert.equal(record.seasons, 1);
  assert.deepEqual(record.last, { runId: "run-a", endingId: "human-record", endingLabel: "HUMAN RECORD", verdict: "ending_reform", verdictName: "개혁", tableRules: 2 });
  // The finale played again in the same run, to another ending.
  record = recordFinishedSeason(record, { runId: "run-a", finalSummary: finale(collapse), finalChoiceId: "ending_reform" });
  assert.equal(record.seasons, 1, "a replayed finale is not another season");
  assert.equal(record.last.verdict, "collapse");
  record = recordFinishedSeason(record, { runId: "run-b", finalSummary: finale(ending("quiet-cover"), 3), finalChoiceId: "ending_seal" });
  assert.equal(record.seasons, 2);
  assert.deepEqual(record.countedRuns, ["run-a", "run-b"]);
  assert.equal(record.last.tableRules, 3);
});

test("what is not a closed finale leaves the record as it was, and a stored record is read safely", () => {
  const record = recordFinishedSeason(null, { runId: "run-a", finalSummary: finale(ending("field-pact")), finalChoiceId: "ending_expose" });
  for (const input of [{}, { runId: "run-b" }, { runId: "", finalSummary: finale(ending("field-pact")) }, { runId: "run-b", finalSummary: { endingVariant: "field-pact" } }]) {
    assert.deepEqual(recordFinishedSeason(record, input), record);
  }
  assert.deepEqual(normalizeSeasonRecord(JSON.stringify(record)), record, "the stored string reads back");
  for (const broken of ["{", "[]", "null", 7, { seasons: -3, countedRuns: "run-a", last: { endingId: 4 } }]) {
    const read = normalizeSeasonRecord(broken);
    assert.equal(read.seasons, 0);
    assert.deepEqual(read.countedRuns, []);
    assert.equal(read.last, null);
  }
  assert.equal(normalizeSeasonRecord({ seasons: 1, last: { endingId: "x", verdict: "hasOwnProperty" } }).last.verdict, null);
  let many = null;
  for (let index = 0; index < 12; index += 1) many = recordFinishedSeason(many, { runId: `run-${index}`, finalSummary: finale(ending("cold-justice")) });
  assert.equal(many.seasons, 12);
  assert.equal(many.countedRuns.length, 8, "only the last few runs are remembered");
  assert.equal(SEASON_RECORD_KEY, "critical-point-season-record-v1");
});

test("the next season is handed its number, the last ending and the line its first scene opens on", () => {
  assert.equal(getSeasonCarry(null), null, "nothing before a season has finished");
  const record = recordFinishedSeason(null, { runId: "run-a", finalSummary: finale(ending("quiet-cover")), finalChoiceId: "ending_seal" });
  const carry = getSeasonCarry(record);
  assert.equal(carry.round, 2);
  assert.equal(carry.endingLabel, "QUIET COVER");
  assert.equal(carry.verdictName, "봉인");
  assert.equal(carry.echo, getOpeningEcho("ending_seal"));
  // A device that finished a season before the record existed.
  const memory = { case01: {}, final: { runId: "old", endingVariant: ending("human-record"), gauntlet: { tableRules: 2 } } };
  const fromMemory = getSeasonCarry(null, memory);
  assert.equal(fromMemory.round, 2);
  assert.equal(fromMemory.endingId, "human-record");
  assert.equal(fromMemory.verdict, null, "the memory keeps no finale choice");
  assert.equal(fromMemory.echo, OPENING_ECHO);
  assert.equal(getSeasonCarry(null, { final: { endingVariant: collapse } }).echo, getOpeningEcho("collapse"));
  assert.equal(getSeasonCarry(record, memory).endingId, "quiet-cover", "the record wins over the memory");
});

test("four rulings have a line of their own; the open verdict and anything else keep the opening line", () => {
  const lines = ["ending_seal", "ending_reform", "ending_expose", "collapse"].map(getOpeningEcho);
  assert.equal(new Set(lines).size, 4);
  for (const line of lines) {
    assert.notEqual(line, OPENING_ECHO);
    // Close to OPENING_ECHO's length, so the line keeps to three lines at 360px.
    assert.ok(line.length <= OPENING_ECHO.length + 12, `${line.length}: ${line}`);
    assert.doesNotMatch(line, /\d{2}/, "numbers of 10 and over are written as digits (#209); none is needed here");
  }
  for (const other of ["open", null, undefined, "toString", "ending_unknown"]) assert.equal(getOpeningEcho(other), OPENING_ECHO);
  assert.deepEqual(Object.keys(VERDICT_NAMES).sort(), ["collapse", "ending_expose", "ending_reform", "ending_seal", "open"]);
});

test("every case of a NEW GAME+ run is marked, and no case of any other run", () => {
  assert.deepEqual(newGamePlusMark({ veteran: true }), { newGamePlus: true });
  for (const run of [{ veteran: false }, { veteran: "true" }, {}, null, undefined]) assert.deepEqual(newGamePlusMark(run), {});
  // Spread like assistStory: a plain summary is left exactly as it was.
  assert.deepEqual({ caseId: "case01", ...newGamePlusMark({ veteran: false }) }, { caseId: "case01" });
});

test("the cases a NEW GAME+ run plays under a different table are the prologues whose step is short of everything", () => {
  assert.deepEqual(VETERAN_TABLE_CASES, ["prologue01", "prologue02", "prologue03", "prologue04"]);
  for (const caseId of CASE_SEQUENCE) {
    const plain = rulesFor(caseId, {});
    assert.equal(differsForVeteran(caseId), plain.size < ALL_RULES.size, caseId);
    assert.equal(VETERAN_TABLE_CASES.includes(caseId), differsForVeteran(caseId), caseId);
  }
  for (const step of UNLOCK_LADDER) assert.equal(differsForVeteran(step.caseId, false), false, "with the switch off nothing differs");
  // The finale is the same table for both: the reason the season is ranked with every other.
  assert.equal(differsForVeteran("final"), false);
});

test("the ending ids the record keeps are the ruling's own", () => {
  const variant = getEndingVariant({});
  assert.ok(ENDING_IDS.includes(variant.id) || variant.id === "open-question");
  const record = recordFinishedSeason(null, { runId: "run-a", finalSummary: { endingVariant: variant } });
  assert.equal(record.last.endingId, variant.id);
  assert.equal(record.last.tableRules, null);
});
