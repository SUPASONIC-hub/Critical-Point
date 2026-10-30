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
 * The list of what each step turns on: the five prologues and, since C-4
 * (2026-10-25), 사건 01 to 03. The staged table is asked for by passing the
 * flag: the shipped switch is read once, at the bottom, and whatever it says
 * these hold. `PROLOGUES` keeps its name; it is every step of the ladder.
 */

const staged = { staged: true };
const PROLOGUES = ["prologue01", "prologue02", "prologue03", "prologue04", "prologue05", "case01", "case02", "case03"];

test("the ladder is the five prologues and 사건 01 to 03 in the season's order, each step holding the one before it, and it ends in everything", () => {
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
  assert.deepEqual(rules("prologue02"), ["aftershock", "blackout", "logic", "silence"]);
  assert.deepEqual(rules("prologue03"), ["aftershock", "blackout", "coldFeet", "heatDebt", "logic", "scout", "silence"]);
  // 프롤로그 04 opens two rules, FRACTURE and LOCK (C-4, the user's answer of 2026-10-25, (1)); it
  // opened five at RULES_MARK 3, OVERCLOCK and the audit and the links with them.
  assert.deepEqual(rules("prologue04"), ["aftershock", "blackout", "coldFeet", "fracture", "heatDebt", "lock", "logic", "scout", "silence"]);
  // The stance and the draft: a draft in 05 is the offer made as 04 closes.
  assert.deepEqual(rules("prologue05"), ["aftershock", "blackout", "coldFeet", "fracture", "heatDebt", "lock", "logic", "relics", "scout", "silence", "stance"]);
  assert.ok(!rulesFor("prologue04", staged).has("relics") && !rulesFor("prologue04", staged).has("stance"));
  // Then one rule a case: OVERCLOCK in 사건 01, the audit in 사건 02, the links in 사건 03, the whole table.
  const added = (caseId) => [...rulesFor(caseId, staged)].filter((rule) => !rulesFor(CASE_SEQUENCE[CASE_SEQUENCE.indexOf(caseId) - 1], staged).has(rule));
  assert.deepEqual(["case01", "case02", "case03"].map(added), [["overclock"], ["audit"], ["cascade"]]);
  assert.deepEqual(rules("case03"), [...TABLE_RULES].sort());
  // No step opens five any more, as 프롤로그 04 did: what C-4 was about. (프롤로그 02 opens four.)
  for (const step of UNLOCK_LADDER) assert.ok(step.adds.length <= 4, `${step.caseId} opens ${step.adds.length}`);
  assert.ok(rulesFor("prologue04", staged).size - rulesFor("prologue03", staged).size <= 3, "프롤로그 04 opens two or three");
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
    // Only the mark itself: a run that is merely far along is not a veteran's. (사건 03, the step
    // that completes the table, is the whole table either way.)
    if (caseId !== "case03") assert.notEqual(getTableRules(caseId, { veteran: "yes", windowIndex: 400 }, true), ALL_RULES);
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
    assert.throws(() => rules.delete("logic"), TypeError);
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
  // The lines that opened in 프롤로그 04 open with their rules: LOCK's stays, OVERCLOCK's is 사건 01's.
  assert.deepEqual(UNLOCK_LADDER[3].intro.slice(1), ["카드를 건 뒤 LOCK을 누르면 자원 배율이 오르고, 칩 배율은 1.5배까지 오릅니다. 누를 때마다 시간이 줄어듭니다."]);
  assert.deepEqual(introFor("case01", staged), ["×4 이상으로 두 번 잇달아 확정하면 다음 판의 칩이 2배가 되고, 밀 때 오르는 열기도 커집니다."]);
  // 프롤로그 02 teaches the logic streak where it taught the beat, and no line says a press is timed.
  // Since C-3 the streak is held on a direction, and the line says 관점 전환 can be had inside one.
  assert.equal(UNLOCK_LADDER[1].intro[0], "같은 방향(사람 쪽 또는 자리 쪽)의 카드를 세 번 잇달아 고르면 논리 콤보가 쌓이고 배율이 커집니다. 지난 판을 더 뜨겁게 닫았다면 방향을 바꿔도 콤보가 이어집니다. '관점 전환' 점수는 생각 유형을 고르게 쓸수록 오르니, 방향은 지키고 유형은 바꿔도 됩니다.");
  for (const step of UNLOCK_LADDER) {
    for (const line of step.intro) assert.doesNotMatch(line, /박자|심박에 맞춰/, `${step.caseId}: "${line}"`);
  }
});

// B2's CASCADE has been a rule of the ladder since RULES_MARK 3 (프롤로그 04).
test("every next-table mutation but REBOOT belongs to a rule", () => {
  assert.deepEqual(Object.keys(MUTATION_RULES).sort(), Object.keys(MUTATIONS).filter((id) => id !== "reboot").sort());
  for (const [mutation, rule] of Object.entries(MUTATION_RULES)) assert.ok(ALL_RULES.has(rule), `${mutation} -> ${rule}`);
});

// C-4: the audit and the links have a line of their own in 사건 02 and 03, with the numbers they act
// on written out, as SCOUT's are; these hold them to the constants.
test("사건 02 and 03 tell the audit and the links by their own numbers", async () => {
  const { AUDIT_HEAT, AUDIT_LIMIT, AUDIT_RELIEF, AUDIT_RELIEF_HEAT, AUDIT_SHARE } = await import("../../src/gauntlet/auditRisk.js");
  const { LINK_BURN, LINK_SPAN_MAX, LINK_SPAN_MIN, LINK_WALL } = await import("../../src/gauntlet/cascadeRisk.js");
  const [audit] = introFor("case02", staged);
  assert.equal(audit, `이번 사건부터 감사가 판에 붙습니다. 한 번이라도 밀고 열기 ${AUDIT_HEAT} 아래에서 확정하면 한 칸 차고, ${AUDIT_RELIEF_HEAT} 이상에서 확정하면 ${AUDIT_RELIEF}칸 줄어듭니다. 사건이 닫힐 때 ${AUDIT_LIMIT}칸이 차 있으면 금고로 갈 몫의 ${AUDIT_SHARE}분의 1을 잃습니다.`);
  const [links] = introFor("case03", staged);
  assert.equal(links, `이번 사건부터 연결이 판에 붙습니다. 한 자원을 ${LINK_BURN} 이상 태운 카드로 확정하면, ${LINK_SPAN_MIN}~${LINK_SPAN_MAX}판 뒤의 한 판에서 벽이 ${LINK_WALL} 가까워집니다.`);
  // A story run plays without all three of 사건 01 to 03's rules, and is told none of them.
  for (const caseId of ["case01", "case02", "case03"]) assert.deepEqual(introFor(caseId, { staged: true, story: true }), [], caseId);
});
