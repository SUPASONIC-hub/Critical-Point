import assert from "node:assert/strict";
import { test } from "node:test";

const { CASE_SEQUENCE } = await import("../../src/gameCases.js");
const { ANALYST_TITLE_STEPS, getAnalystTitle, readFurthestCase } = await import("../../src/analystTitle.js");

const closedThrough = (caseId) => Object.fromEntries(CASE_SEQUENCE.slice(0, CASE_SEQUENCE.indexOf(caseId) + 1).map((id) => [id, {}]));

test("five steps: four start at a case the season has, in season order, and the last past the finale", () => {
  assert.equal(ANALYST_TITLE_STEPS.length, 5);
  const cases = ANALYST_TITLE_STEPS.slice(0, -1).map((step) => CASE_SEQUENCE.indexOf(step.from));
  assert.ok(cases.every((index) => index >= 0), `a step starts at a case the season does not have: ${cases}`);
  assert.equal(cases[0], 0, "the first step has to start at the first case, or a new run has no title");
  assert.deepEqual([...cases].sort((a, b) => a - b), cases);
  assert.equal(ANALYST_TITLE_STEPS.at(-1).from, null, "the last step is the finished season, not a case");
  assert.equal(new Set(ANALYST_TITLE_STEPS.map((step) => step.title)).size, ANALYST_TITLE_STEPS.length);
  assert.deepEqual(ANALYST_TITLE_STEPS.map((step) => step.title), ["수습 분석관", "분석관", "선임 분석관", "책임 분석관", "수석 분석관"]);
});

test("the title for the case in play, at each boundary", () => {
  const at = (currentCase) => getAnalystTitle({ currentCase });
  // 수습 holds for 프롤로그 01 alone: the traineeship ends with it (docs/canon.md, 2022-10-21).
  assert.equal(at("prologue01"), "수습 분석관");
  assert.equal(at("prologue02"), "분석관");
  assert.equal(at("prologue05"), "분석관");
  assert.equal(at("case01"), "선임 분석관");
  assert.equal(at("case24"), "선임 분석관");
  assert.equal(at("case25"), "책임 분석관");
  assert.equal(at("case49"), "책임 분석관");
  // The finale in play is not the finale closed.
  assert.equal(at("final"), "책임 분석관");
});

test("the fifth step takes a finished season: the finale closed, or NEW GAME+ open on the device", () => {
  assert.equal(getAnalystTitle({ currentCase: "final", caseResults: { final: {} } }), "수석 분석관");
  assert.equal(getAnalystTitle({ caseResults: closedThrough("final") }), "수석 분석관");
  // A second season starts at 프롤로그 01 with nothing closed and keeps the title.
  assert.equal(getAnalystTitle({ currentCase: "prologue01", caseResults: {}, finishedSeason: true }), "수석 분석관");
  assert.equal(getAnalystTitle({ finishedSeason: true }), "수석 분석관");
  assert.equal(getAnalystTitle({ currentCase: "prologue01", finishedSeason: false }), "수습 분석관");
});

test("the title never falls as the season goes on", () => {
  const order = ANALYST_TITLE_STEPS.map((step) => step.title);
  let last = 0;
  for (const currentCase of CASE_SEQUENCE) {
    const rank = order.indexOf(getAnalystTitle({ currentCase }));
    assert.ok(rank >= last, `${currentCase} reads ${order[rank]} after ${order[last]}`);
    last = rank;
  }
  assert.equal(order.indexOf(getAnalystTitle({ caseResults: closedThrough("final") })), order.length - 1);
});

test("a case replayed from the roadmap keeps the title the closed cases earned", () => {
  const caseResults = closedThrough("case24");
  // case24 closed reaches case25, so replaying 사건 03 still reads 책임.
  assert.equal(readFurthestCase({ currentCase: "case03", caseResults }), CASE_SEQUENCE.indexOf("case25"));
  assert.equal(getAnalystTitle({ currentCase: "case03", caseResults }), "책임 분석관");
  assert.equal(getAnalystTitle({ currentCase: "case03", caseResults: closedThrough("case23") }), "선임 분석관");
  // A closed finale reaches one past the end of the season: the finished season.
  assert.equal(readFurthestCase({ caseResults: { final: {} } }), CASE_SEQUENCE.length);
  assert.equal(readFurthestCase({ finishedSeason: true }), CASE_SEQUENCE.length);
});

test("a run that has reached nothing the season knows has no title", () => {
  assert.equal(getAnalystTitle(), "");
  assert.equal(getAnalystTitle({ currentCase: null, caseResults: null }), "");
  assert.equal(getAnalystTitle({ currentCase: "case99", caseResults: { nope: {} } }), "");
  assert.equal(readFurthestCase(), -1);
});
