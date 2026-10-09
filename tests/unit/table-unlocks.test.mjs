import assert from "node:assert/strict";
import test from "node:test";

import { CASE_SEQUENCE } from "../../src/gameCases.js";
import { MUTATIONS } from "../../src/gauntlet/gauntletEngine.js";
import {
  ALL_RULES,
  getTableRules,
  getUnlockIntro,
  getUnlockKicker,
  introFor,
  MUTATION_RULES,
  rulesFor,
  STAGED,
  TABLE_RULES,
  UNLOCK_INTRO_KICKER,
  UNLOCK_LADDER,
} from "../../src/gauntlet/tableUnlocks.js";

/**
 * The list of what each prologue turns on. The staged table is asked for by
 * passing the flag: the shipped switch is read once, at the bottom, and
 * whatever it says these hold.
 */

const staged = { staged: true };
const PROLOGUES = ["prologue01", "prologue02", "prologue03", "prologue04", "prologue05"];

test("the ladder is the five prologues in the season's order, each step holding the one before it, and it ends in everything", () => {
  assert.deepEqual(UNLOCK_LADDER.map((step) => step.caseId), PROLOGUES);
  assert.deepEqual(CASE_SEQUENCE.slice(0, PROLOGUES.length), PROLOGUES, "the season opens on them, in this order");
  let before = new Set();
  const turnedOn = [];
  for (const step of UNLOCK_LADDER) {
    for (const rule of before) assert.ok(step.rules.has(rule), `${step.caseId} keeps ${rule}`);
    assert.deepEqual([...step.rules].filter((rule) => !before.has(rule)), [...step.adds], `${step.caseId} adds what it says it adds`);
    for (const rule of step.adds) assert.ok(TABLE_RULES.includes(rule), `${rule} is a rule of the table`);
    turnedOn.push(...step.adds);
    before = step.rules;
  }
  assert.deepEqual([...turnedOn].sort(), [...TABLE_RULES].sort(), "every rule is turned on exactly once");
  assert.deepEqual([...before].sort(), [...ALL_RULES].sort(), "the last step is the whole table");
});

test("each step is the one the author decided", () => {
  const rules = (caseId) => [...rulesFor(caseId, staged)].sort();
  assert.deepEqual(rules("prologue01"), []);
  assert.deepEqual(rules("prologue02"), ["aftershock", "beat", "blackout", "silence"]);
  assert.deepEqual(rules("prologue03"), ["aftershock", "beat", "blackout", "coldFeet", "heatDebt", "silence"]);
  assert.deepEqual(rules("prologue04"), ["aftershock", "beat", "blackout", "coldFeet", "fracture", "heatDebt", "lock", "overclock", "silence"]);
  // The stance and the draft come last: a draft in 05 is the offer made as 04 closes.
  assert.deepEqual(rules("prologue05"), [...TABLE_RULES].sort());
  assert.ok(!rulesFor("prologue04", staged).has("relics") && !rulesFor("prologue04", staged).has("stance"));
});

test("a case the ladder does not name, and a run begun with NEW GAME+, play under everything", () => {
  for (const caseId of [...CASE_SEQUENCE.slice(PROLOGUES.length), "no-such-case", undefined, null]) {
    assert.equal(rulesFor(caseId, staged), ALL_RULES, `${caseId}`);
    assert.deepEqual(introFor(caseId, staged), []);
  }
  for (const caseId of PROLOGUES) {
    assert.equal(rulesFor(caseId, { staged: true, veteran: true }), ALL_RULES);
    assert.equal(getTableRules(caseId, { veteran: true }, true), ALL_RULES);
    assert.deepEqual(getUnlockIntro(caseId, { veteran: true }, true), []);
    // Only the mark itself: a run that is merely far along is not a veteran's.
    assert.notEqual(getTableRules(caseId, { veteran: "yes", windowIndex: 400 }, true), ALL_RULES);
    assert.equal(getTableRules(caseId, {}, true), rulesFor(caseId, staged), "a plain run takes the case's step");
    assert.equal(getTableRules(caseId, null, true), rulesFor(caseId, staged), "and so does no run at all");
  }
});

test("with the switch off every case plays under everything and has nothing to introduce", () => {
  for (const caseId of [...CASE_SEQUENCE, undefined]) {
    assert.equal(rulesFor(caseId, { staged: false }), ALL_RULES);
    assert.equal(getTableRules(caseId, {}, false), ALL_RULES);
    assert.deepEqual(introFor(caseId, { staged: false }), []);
    assert.deepEqual(getUnlockIntro(caseId, {}, false), []);
  }
});

test("the switch is on, and the functions asked without a flag answer for it", () => {
  assert.equal(STAGED, true, "the prologues ship staged");
  for (const caseId of CASE_SEQUENCE) {
    assert.equal(getTableRules(caseId, {}), rulesFor(caseId, { staged: STAGED }));
    assert.equal(rulesFor(caseId), rulesFor(caseId, { staged: STAGED }));
    assert.equal(getUnlockIntro(caseId, {}), introFor(caseId, { staged: STAGED }));
  }
});

test("a rule set is the same object every time it is asked for, and nothing can change it", () => {
  for (const caseId of PROLOGUES) {
    const rules = getTableRules(caseId, {}, true);
    assert.equal(getTableRules(caseId, {}, true), rules, "so it can key a memo");
    assert.throws(() => rules.add("relics"), TypeError);
    assert.throws(() => rules.delete("beat"), TypeError);
    assert.throws(() => rules.clear(), TypeError);
  }
  assert.throws(() => ALL_RULES.clear(), TypeError);
  assert.equal(ALL_RULES.size, TABLE_RULES.length);
  assert.ok(Object.isFrozen(UNLOCK_LADDER) && UNLOCK_LADDER.every((step) => Object.isFrozen(step) && Object.isFrozen(step.intro) && Object.isFrozen(step.adds)));
});

test("every step says something, in 합니다체, and the first one explains the table itself", () => {
  assert.ok(UNLOCK_INTRO_KICKER.length > 0);
  for (const step of UNLOCK_LADDER) {
    const lines = introFor(step.caseId, staged);
    assert.ok(lines.length > 0, `${step.caseId} has a line`);
    assert.equal(getUnlockIntro(step.caseId, {}, true), lines);
    for (const line of lines) {
      assert.equal(line, line.trim());
      for (const sentence of line.split(/(?<=\.)\s+/)) assert.match(sentence, /(니다|십시오)\.$/, `"${sentence}" is 합니다체`);
    }
  }
  assert.deepEqual(UNLOCK_LADDER[0].adds, [], "프롤로그 01 turns nothing on");
  assert.match(introFor("prologue01", staged)[0], /밀면.*확정.*심박/, "and says how to push, cash and listen");
});

test("the line over an introduction says the rules have grown, except over the first table, where nothing has", () => {
  assert.equal(UNLOCK_INTRO_KICKER, "NEW PROTOCOL · 이번 사건부터 규칙이 늘어납니다");
  assert.equal(getUnlockKicker("prologue01"), "FIRST TABLE · 이 판은 이렇게 합니다");
  assert.equal(UNLOCK_LADDER[0].kicker, getUnlockKicker("prologue01"));
  for (const step of UNLOCK_LADDER.slice(1)) {
    assert.equal(step.kicker, UNLOCK_INTRO_KICKER, step.caseId);
    assert.equal(getUnlockKicker(step.caseId), UNLOCK_INTRO_KICKER);
  }
  assert.equal(getUnlockKicker("case01"), UNLOCK_INTRO_KICKER, "a case with no step has the shared line, and no introduction to put it over");
  assert.equal(getUnlockKicker(undefined), UNLOCK_INTRO_KICKER);
});

test("heat is 열기 in every line, as the table's own gauge is labelled", () => {
  for (const step of UNLOCK_LADDER) {
    for (const line of step.intro) assert.doesNotMatch(line, /열(?!기)/, `${step.caseId}: "${line}"`);
  }
  assert.deepEqual(UNLOCK_LADDER[3].intro.slice(1), [
    "×4 이상으로 두 번 잇달아 확정하면 다음 판의 칩이 2배가 되고, 밀 때 오르는 열기도 커집니다.",
    "카드를 건 뒤 심박에 맞춰 LOCK을 누르면 판돈과 자원 배율이 오릅니다. 박자를 놓치면 열기가 오릅니다.",
  ]);
});

test("every next-table mutation but REBOOT belongs to a rule", () => {
  assert.deepEqual(Object.keys(MUTATION_RULES).sort(), Object.keys(MUTATIONS).filter((id) => id !== "reboot").sort());
  for (const [mutation, rule] of Object.entries(MUTATION_RULES)) assert.ok(ALL_RULES.has(rule), `${mutation} -> ${rule}`);
});
