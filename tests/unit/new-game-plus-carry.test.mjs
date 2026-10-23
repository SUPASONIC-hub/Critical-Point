import assert from "node:assert/strict";
import { test } from "node:test";

import { getFinalVerdict } from "../../src/endingCopy.js";
import { getEndingVariant, ENDING_IDS } from "../../src/gameLogic.js";
import { ALL_RULES, differsForVeteran, rulesFor, UNLOCK_LADDER, VETERAN_TABLE_CASES } from "../../src/gauntlet/tableUnlocks.js";
import { CASE_SEQUENCE } from "../../src/gameCases.js";
import {
  getOpeningEcho,
  getSeasonCarry,
  getSeasonOpening,
  getSeasonRound,
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
      if (key === "collapse") assert.equal(printed.title, "이 시즌은 무너졌습니다.");
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
  assert.deepEqual(record, { seasons: 0, countedRuns: [], last: null, previous: null });
  record = recordFinishedSeason(record, { runId: "run-a", finalSummary: finale(ending("human-record")), finalChoiceId: "ending_reform" });
  assert.equal(record.seasons, 1);
  assert.deepEqual(record.last, { runId: "run-a", endingId: "human-record", endingLabel: "HUMAN RECORD", verdict: "ending_reform", verdictName: "개혁", tableRules: 2, line: "지난 시즌: 개혁 · HUMAN RECORD. NEW\u00a0GAME+로 시작하면 첫 장면에 이 기록이 돌아옵니다." });
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
    // Two sentences, as OPENING_ECHO is, and within three lines on a phone (문구 질문 1: 49-62).
    assert.equal(line.split(". ").length, 2, line);
    assert.ok(line.length <= 62, `${line.length}: ${line}`);
    assert.match(line, /^지난 시즌/, "the last season is a season, not a session (문구 질문 2)");
    assert.doesNotMatch(line, /이 방/, "프롤로그 01 is a bank office, before the lab existed");
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

test("the season before survives this season's finale, for the comparison line", () => {
  let record = recordFinishedSeason(null, { runId: "run-a", finalSummary: finale(ending("quiet-cover")), finalChoiceId: "ending_seal" });
  assert.equal(record.previous, null, "a first season has nothing before it");
  record = recordFinishedSeason(record, { runId: "run-b", finalSummary: finale(ending("human-record"), 3), finalChoiceId: "ending_reform" });
  assert.equal(record.last.endingId, "human-record");
  assert.equal(record.previous.endingId, "quiet-cover", "the finale's result still has the season before to compare with");
  assert.equal(record.previous.tableRules, 2);
  // Replaying run-b's finale keeps the season before as it was.
  record = recordFinishedSeason(record, { runId: "run-b", finalSummary: finale(collapse, 3), finalChoiceId: "ending_reform" });
  assert.equal(record.previous.endingId, "quiet-cover");
  assert.equal(record.last.endingId, "collapse");
  assert.deepEqual(normalizeSeasonRecord(JSON.stringify(record)), record);
});

test("a run's season number does not move when its own finale closes", () => {
  assert.equal(getSeasonRound(null, "run-a"), 1);
  const first = recordFinishedSeason(null, { runId: "run-a", finalSummary: finale(ending("quiet-cover")) });
  assert.equal(getSeasonRound(first, "run-a"), 1, "the first season, closed, is still the first");
  assert.equal(getSeasonRound(first, "run-b"), 2, "the season after it is the second");
  const second = recordFinishedSeason(first, { runId: "run-b", finalSummary: finale(ending("field-pact")) });
  assert.equal(getSeasonRound(second, "run-b"), 2, "the second season's finale closed: still 2회차, not 3회차");
  assert.equal(getSeasonRound(second, "run-c"), 3);
  assert.equal(getSeasonRound(second, null), 3);
  // A device with the memory and no record.
  const memory = { final: { runId: "old", endingVariant: ending("cold-justice") } };
  assert.equal(getSeasonRound(null, "old", memory), 1);
  assert.equal(getSeasonRound(null, "new", memory), 2);
});

test("the carried line is shown on a NEW GAME+ season's first page, and nowhere else", () => {
  const echo = getOpeningEcho("ending_expose");
  const first = { gauntletRun: { veteran: true }, currentCase: "prologue01", log: [], caseResults: {}, echo };
  assert.equal(getSeasonOpening(first), echo);
  assert.equal(getSeasonOpening({ ...first, echo: OPENING_ECHO }), OPENING_ECHO, "an open verdict's season still has its NEW GAME+ line");
  assert.equal(getSeasonOpening({ ...first, gauntletRun: { veteran: false } }), null, "a plain season has none");
  assert.equal(getSeasonOpening({ ...first, currentCase: "prologue02" }), null);
  assert.equal(getSeasonOpening({ ...first, log: [{ nodeId: "p1_start" }] }), null, "after the first answer the run's echo is that answer's");
  assert.equal(getSeasonOpening({ ...first, caseResults: { prologue01: {} } }), null, "a replayed 프롤로그 01 opens on its own line");
  assert.equal(getSeasonOpening({ ...first, echo: "  " }), null);
  assert.equal(getSeasonOpening({ ...first, gauntletRun: null }), null);
});

test("the start screen's panel names the last season's ending, and its season number on the head and the continue card", async () => {
  const { getPastRunMemory, getPlayStyleUnlocks } = await import("../../src/advancedSystems.js");
  const record = (verdict, label, extra = {}) => recordFinishedSeason(null, { runId: "run-a", finalSummary: finale(ending(label.toLowerCase().replace(" ", "-"), extra)), finalChoiceId: verdict });
  // Every panel ends on what a NEW GAME+ table is (문구 질문 17, 2026-10-21 evening): a fact, not "harder".
  const TABLE_LINE = " NEW\u00a0GAME+는 프롤로그 01부터 모든 규칙이 켜지고, 도구도 더 일찍 받습니다.";
  const reform = getPastRunMemory({}, record("ending_reform", "HUMAN RECORD"), "run-b");
    assert.equal(reform.round, 2);
  assert.equal(reform.text, "지난 시즌: 개혁 · HUMAN RECORD. NEW\u00a0GAME+로 시작하면 첫 장면에 이 기록이 돌아옵니다." + TABLE_LINE);
  const fallen = recordFinishedSeason(null, { runId: "run-a", finalSummary: finale(collapse) });
  assert.equal(getPastRunMemory({}, fallen, null).text, "지난 시즌: SYSTEM COLLAPSE. NEW\u00a0GAME+로 시작하면 첫 장면에 이 기록이 돌아옵니다." + TABLE_LINE);
  const open = recordFinishedSeason(null, { runId: "run-a", finalSummary: finale(ending("profitable-silence")), finalChoiceId: "ending_seal" });
  assert.equal(getPastRunMemory({}, open, null).text, "지난 시즌: PROFITABLE SILENCE." + TABLE_LINE, "an open verdict: the ending alone, no promise");
  // The finished run itself, reopened from its save: still its own season, not the next.
  assert.equal(getPastRunMemory({}, record("ending_reform", "HUMAN RECORD"), "run-a").round, 1);
  // A memory from before the record keeps the old line (the entry chunk reads only the record's stored line), and is the second season.
  const memory = { case01: { outcomeChoiceId: "c1" }, final: { outcomeChoiceId: "f_after_burn", runId: "old", endingVariant: { id: "quiet-cover", label: "QUIET COVER", failure: false } } };
  assert.match(getPastRunMemory(memory, null, "new").text, /^이전 기록에서 CASE .+ 도구도 더 일찍 받습니다\.$/);
  assert.equal(getPastRunMemory(memory, null, "new").round, 2);
  // As stored: the panel reads the raw record, not a normalized one.
  assert.equal(getPastRunMemory({}, JSON.parse(JSON.stringify(record("ending_expose", "FIELD PACT"))), "run-b").text, "지난 시즌: 폭로 · FIELD PACT. NEW\u00a0GAME+로 시작하면 첫 장면에 이 기록이 돌아옵니다." + TABLE_LINE);
  // A memory with no ending in it keeps the old line.
  assert.match(getPastRunMemory({ case01: { outcomeChoiceId: "c1" } }).text, /^이전 기록에서 CASE 01/);
  assert.equal(getPastRunMemory({}, null, null), null);
  assert.equal(getPlayStyleUnlocks("instinct", true).newGamePlus, "지난 시즌의 결말을 이 화면에서 다시 볼 수 있습니다");
});

test("the finale's comparison line sets this season's ending beside the one before", async () => {
  const { getSeasonComparison } = await import("../../src/state/newGamePlusCarry.js");
  const first = recordFinishedSeason(null, { runId: "run-a", finalSummary: finale(ending("quiet-cover"), 2), finalChoiceId: "ending_seal" });
  assert.equal(getSeasonComparison(first, "run-a"), null, "a first season has nothing to compare with");
  const other = recordFinishedSeason(first, { runId: "run-b", finalSummary: finale({ id: "human-record", label: "HUMAN RECORD" }, 2) });
  assert.equal(getSeasonComparison(other, "run-b"), "지난 시즌 QUIET COVER · 이번 시즌 HUMAN RECORD");
  assert.equal(getSeasonComparison(other, "run-c"), null, "only on the run whose finale was counted last");
  const same = recordFinishedSeason(first, { runId: "run-b", finalSummary: finale(ending("quiet-cover"), 2) });
  assert.equal(getSeasonComparison(same, "run-b"), "지난 시즌과 같은 결말 QUIET COVER에 다시 닿았습니다.");
  const newRules = recordFinishedSeason(first, { runId: "run-b", finalSummary: finale({ id: "human-record", label: "HUMAN RECORD" }, 3) });
  assert.equal(getSeasonComparison(newRules, "run-b"), "지난 시즌 QUIET COVER · 이번 시즌 HUMAN RECORD · 판 규칙이 바뀐 뒤의 첫 시즌");
  const sameNewRules = recordFinishedSeason(first, { runId: "run-b", finalSummary: finale(ending("quiet-cover"), 3) });
  assert.equal(getSeasonComparison(sameNewRules, "run-b"), "지난 시즌과 같은 결말 QUIET COVER에 다시 닿았습니다 · 판 규칙이 바뀐 뒤의 첫 시즌");
  const unknownRules = recordFinishedSeason(first, { runId: "run-b", finalSummary: { endingVariant: { id: "human-record", label: "HUMAN RECORD" } } });
  assert.equal(getSeasonComparison(unknownRules, "run-b"), "지난 시즌 QUIET COVER · 이번 시즌 HUMAN RECORD", "no rules mark, no claim that they changed");
});
