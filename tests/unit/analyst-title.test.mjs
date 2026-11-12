import assert from "node:assert/strict";
import { test } from "node:test";

const { CASE_SEQUENCE } = await import("../../src/gameCases.js");
const { ANALYST_TITLE_STEPS, getAnalystTitle, getAnalystTitleRise, getAnalystTitleStep, readFurthestCase } = await import("../../src/analystTitle.js");

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

/**
 * C1-1 (2026-11-12): the result of a case that raised the record title says so
 * in one line. useResultReport holds the step as it stood while the case was
 * played and compares it with the step once the case has closed; these are the
 * two reads it makes, for every case of a season played in order and for the
 * runs that must announce nothing.
 */
const closeCase = (caseId, { before = {}, finishedBefore = false, finishedAfter = finishedBefore } = {}) => {
  const played = getAnalystTitleStep({ currentCase: caseId, caseResults: before, finishedSeason: finishedBefore });
  const closed = getAnalystTitleStep({ currentCase: caseId, caseResults: { ...before, [caseId]: {} }, finishedSeason: finishedAfter });
  return getAnalystTitleRise(played, closed);
};
const closedBefore = (caseId) => Object.fromEntries(CASE_SEQUENCE.slice(0, CASE_SEQUENCE.indexOf(caseId)).map((id) => [id, {}]));

test("a season played in order announces each of the four rises once, at the case that reaches it", () => {
  const rises = CASE_SEQUENCE.map((caseId) => [caseId, closeCase(caseId, { before: closedBefore(caseId) })]).filter(([, title]) => title);
  assert.deepEqual(rises, [
    ["prologue01", "분석관"],
    ["prologue05", "선임 분석관"],
    ["case24", "책임 분석관"],
    ["final", "수석 분석관"],
  ]);
  // The first finale also opens NEW GAME+, which the result may read already.
  assert.equal(closeCase("final", { before: closedBefore("final"), finishedAfter: true }), "수석 분석관");
});

test("a case played again, a finished season and a record with no step announce nothing", () => {
  // 사건 24 played again from the roadmap: it was closed, so the step it reached is already held.
  assert.equal(closeCase("case24", { before: closedThrough("case24") }), "");
  assert.equal(closeCase("prologue01", { before: closedThrough("case03") }), "");
  // A device that finished a season holds 수석 from the first page of the next.
  assert.equal(closeCase("prologue01", { finishedBefore: true }), "");
  assert.equal(closeCase("final", { before: closedBefore("final"), finishedBefore: true }), "");
  assert.equal(getAnalystTitleRise(-1, 0), "");
  assert.equal(getAnalystTitleRise(undefined, 2), "");
  assert.equal(getAnalystTitleRise(2, 2), "");
  assert.equal(getAnalystTitleRise(3, 2), "");
  assert.equal(getAnalystTitleRise(1, 9), "");
  assert.equal(getAnalystTitleStep(), -1);
  assert.equal(getAnalystTitleStep({ finishedSeason: true }), ANALYST_TITLE_STEPS.length - 1);
});
