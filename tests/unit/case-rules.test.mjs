import assert from "node:assert/strict";
import test from "node:test";

import { CASE_START_NODES } from "../../src/gameCases.js";
import { caseOpeningRoutes, nodes } from "../../src/gameData.js";
import { CASE_RULES, CASE_RULES_ON, caseRuleFor } from "../../src/gauntlet/caseRules.js";
import { BASE_SCHEMA, getTableSchema, openCaseRun, RUN_INITIAL_STATE } from "../../src/gauntlet/gauntletEngine.js";
import { getBriefingCaseRuleCase, getBriefingWeekRuleId } from "../../src/gauntlet/tableStaging.js";
import { ACT_START_CASES } from "../../src/gauntlet/actCardGate.js";
import { PEAK_CASES, UNLOCK_LADDER } from "../../src/gauntlet/tableUnlocks.js";
import { getCaseRule, getWeekRule, NEAR_WALL_SHIFT, WEEK_RULE_CATALOGUE, WEEK_RULE_DEVICES } from "../../src/gauntlet/weeklyRules.js";

/**
 * 「이번 사건만」 (N26): four cases in 사건 08-17 play under a rule the weekly
 * catalogue already has, for themselves, and only in a season without a
 * week's rule.
 */

const STRETCH = ["case08", "case09", "case10", "case11", "case12", "case13", "case14", "case15", "case16", "case17"];
const opened = (caseId, run = {}) => openCaseRun({ ...RUN_INITIAL_STATE, ...run }, { caseId });

test("the four cases are in 사건 08-17, which turn no rule on, and none is a peak or an act's first case", () => {
  const cases = Object.keys(CASE_RULES);
  assert.equal(cases.length, 4);
  const laddered = new Set(UNLOCK_LADDER.map((step) => step.caseId));
  for (const caseId of STRETCH) assert.equal(laddered.has(caseId), false, `${caseId} turns no rule on (the ladder ends at 사건 03)`);
  for (const caseId of cases) {
    assert.ok(STRETCH.includes(caseId), `${caseId} is in 사건 08-17`);
    assert.equal(PEAK_CASES.includes(caseId), false, `${caseId} is not a peak`);
    assert.equal(ACT_START_CASES.includes(caseId), false, `${caseId} is not a quiet first case`);
    const rule = WEEK_RULE_CATALOGUE[CASE_RULES[caseId]];
    assert.ok(rule?.schema, `${caseId} plays a rule of the board's numbers`);
    assert.equal(rule.rules, undefined, `${caseId} switches on no device`);
  }
  assert.equal(new Set(Object.values(CASE_RULES)).size, 4, "four different rules");
  for (const id of WEEK_RULE_DEVICES) assert.equal(Object.values(CASE_RULES).includes(id), false);
});

test("a case's rule stands aside for the week's, the story and the switch", () => {
  assert.equal(caseRuleFor("case11", {}), CASE_RULES_ON ? "near-wall" : null);
  assert.equal(caseRuleFor("case11", {}, true), "near-wall");
  assert.equal(caseRuleFor("case11", { veteran: true }, true), "near-wall", "NEW GAME+ has it too");
  assert.equal(caseRuleFor("case11", { weekRule: "short-clock" }, true), null, "a week's rule season");
  assert.equal(caseRuleFor("case11", { weekRule: "audit-cascade" }, true), null, "even one that moves no number");
  assert.equal(caseRuleFor("case11", { weekRule: null }, true), "near-wall");
  assert.equal(caseRuleFor("case11", { story: true }, true), null, "a story run");
  assert.equal(caseRuleFor("case11", {}, false), null, "the switch off");
  assert.equal(caseRuleFor("case10", {}, true), null, "a case with none");
  assert.equal(caseRuleFor("constructor", {}, true), null);
  assert.equal(caseRuleFor(undefined, undefined, true), null);
  assert.equal(caseRuleFor(null, null, true), null);
});

test("the board a rule case deals is the week's board for that rule, and the case after it is ordinary", { skip: !CASE_RULES_ON }, () => {
  const plain = getTableSchema(opened("case10"));
  assert.equal(plain.wallMin, BASE_SCHEMA.wallMin);
  const near = getTableSchema(opened("case11"));
  assert.equal(near.wallMin, plain.wallMin - NEAR_WALL_SHIFT);
  assert.equal(near.wallMax, plain.wallMax - NEAR_WALL_SHIFT);
  const week = getTableSchema({ ...opened("case10"), weekRule: "near-wall" });
  assert.deepEqual(near, week, "the same board a NEAR WALL week deals");
  assert.equal(getTableSchema(opened("case12")).wallMin, opened("case12").schema.wallMin, "the peak is laid on the board, not here");
  // Only the week's: a short-clock season's 사건 11 is a short-clock board, not both.
  const both = getTableSchema({ ...opened("case11"), weekRule: "short-clock" });
  assert.equal(both.wallMin, plain.wallMin, "no NEAR WALL under a week's rule");
  assert.ok(both.seconds < plain.seconds);
  // A story case deals the story wall and nothing else.
  const story = getTableSchema({ ...opened("case11"), story: true });
  assert.equal(story.wallMax, getTableSchema({ ...opened("case10"), story: true }).wallMax);
  // A run with no case open (a side case, a test table) has none.
  assert.equal(getTableSchema(RUN_INITIAL_STATE).wallMin, BASE_SCHEMA.wallMin);
});

test("every rule case's opening pages print its rule under the case kicker, and only those", { skip: !CASE_RULES_ON }, () => {
  for (const caseId of STRETCH) {
    const openings = [CASE_START_NODES[caseId], ...Object.values(caseOpeningRoutes[caseId] ?? {})];
    for (const nodeId of openings) {
      assert.equal(getBriefingCaseRuleCase(nodes[nodeId], nodeId, {}), CASE_RULES[caseId] ? caseId : null, nodeId);
      assert.equal(getBriefingCaseRuleCase(nodes[nodeId], nodeId, { weekRule: "near-wall" }), null, `${nodeId}: the week's panel instead`);
      assert.equal(getBriefingWeekRuleId(nodes[nodeId], nodeId, { weekRule: "near-wall" }), "near-wall");
      assert.equal(getBriefingCaseRuleCase(nodes[nodeId], nodeId, { story: true }), null);
    }
  }
  const later = Object.keys(nodes).find((nodeId) => nodes[nodeId].caseId === "case11" && nodeId !== CASE_START_NODES.case11 && nodes[nodeId].kind !== "opening");
  assert.equal(getBriefingCaseRuleCase(nodes[later], later, {}), null, "a later page has no panel");
  assert.equal(getBriefingCaseRuleCase(undefined, undefined, {}), null);
});

test("a case's words: the catalogue's rule with the case's line and its numbers filled", () => {
  for (const [caseId, id] of Object.entries(CASE_RULES)) {
    const rule = getCaseRule(caseId, id);
    const week = getWeekRule(id);
    assert.equal(rule.id, id);
    assert.equal(rule.label, week.label);
    assert.equal(rule.title, week.title);
    assert.match(rule.text, /^이번 사건은 /, `${caseId} speaks of the case, not the week`);
    assert.doesNotMatch(rule.text, /[{}]/, `${caseId}: every blank filled`);
    assert.ok(rule.world && !rule.world.includes("이번 주"), `${caseId} has its own line in the story`);
    assert.deepEqual(rule.schema, week.schema);
  }
  assert.match(getCaseRule("case11", "near-wall").text, new RegExp(`열기 ${NEAR_WALL_SHIFT}만큼`));
  assert.equal(getCaseRule("case10", "near-wall"), null, "a case with no words");
  assert.equal(getCaseRule("case11", "no-such-rule"), null);
  assert.equal(getCaseRule(undefined, "near-wall"), null);
  assert.equal(getCaseRule("constructor", "near-wall"), null);
});
