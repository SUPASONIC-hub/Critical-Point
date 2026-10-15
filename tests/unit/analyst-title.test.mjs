import assert from "node:assert/strict";
import { test } from "node:test";

const { CASE_SEQUENCE } = await import("../../src/gameCases.js");
const { ANALYST_TITLE_STEPS, getAnalystTitle, readFurthestCase } = await import("../../src/analystTitle.js");

test("every step starts at a case the season has, in season order", () => {
  const starts = ANALYST_TITLE_STEPS.map((step) => CASE_SEQUENCE.indexOf(step.from));
  assert.ok(starts.every((index) => index >= 0), `a step starts at a case the season does not have: ${starts}`);
  assert.equal(starts[0], 0, "the first step has to start at the first case, or a new run has no title");
  assert.deepEqual([...starts].sort((a, b) => a - b), starts);
  assert.equal(new Set(ANALYST_TITLE_STEPS.map((step) => step.title)).size, ANALYST_TITLE_STEPS.length);
});

test("the title for the case in play, at each boundary", () => {
  const at = (currentCase) => getAnalystTitle({ currentCase });
  assert.equal(at("prologue01"), "수습 분석관");
  assert.equal(at("prologue05"), "수습 분석관");
  assert.equal(at("case01"), "분석관");
  assert.equal(at("case17"), "분석관");
  assert.equal(at("case18"), "선임 분석관");
  assert.equal(at("case35"), "선임 분석관");
  assert.equal(at("case36"), "수석 분석관");
  assert.equal(at("case49"), "수석 분석관");
  assert.equal(at("final"), "수석 분석관");
});

test("the title never falls as the season goes on", () => {
  const order = ANALYST_TITLE_STEPS.map((step) => step.title);
  let last = 0;
  for (const currentCase of CASE_SEQUENCE) {
    const rank = order.indexOf(getAnalystTitle({ currentCase }));
    assert.ok(rank >= last, `${currentCase} reads ${order[rank]} after ${order[last]}`);
    last = rank;
  }
});

test("a case replayed from the roadmap keeps the title the closed cases earned", () => {
  const caseResults = Object.fromEntries(CASE_SEQUENCE.slice(0, CASE_SEQUENCE.indexOf("case18")).map((caseId) => [caseId, {}]));
  // case17 closed reaches case18, so replaying 사건 03 still reads 선임.
  assert.equal(readFurthestCase({ currentCase: "case03", caseResults }), CASE_SEQUENCE.indexOf("case18"));
  assert.equal(getAnalystTitle({ currentCase: "case03", caseResults }), "선임 분석관");
  // A closed finale does not reach past the end of the season.
  assert.equal(readFurthestCase({ caseResults: { final: {} } }), CASE_SEQUENCE.length - 1);
});

test("a run that has reached nothing the season knows has no title", () => {
  assert.equal(getAnalystTitle(), "");
  assert.equal(getAnalystTitle({ currentCase: null, caseResults: null }), "");
  assert.equal(getAnalystTitle({ currentCase: "case99", caseResults: { nope: {} } }), "");
});
