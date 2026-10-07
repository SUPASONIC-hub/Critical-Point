import assert from "node:assert/strict";
import { test } from "node:test";

import { seasonCasesBase } from "../../src/gameCases.js";
import { createSeasonCases, decideCaseCardPress } from "../../src/viewModels/seasonViewModels.js";

/**
 * What a roadmap card says and what pressing it does. Opening a case starts it
 * at its first scene with an empty choice log, and every open card used to do
 * exactly that -- including the one labelled "진행 중", which restarted the
 * case it named without a question.
 */
const [first, second, third] = seasonCasesBase.map((caseItem) => caseItem.id);

/** The roadmap as the intro builds it, and the press on one of its cards. */
function pressOn(caseId, { currentCase, completedCases = [], hasResumableSave = true, logLength = 0 }) {
  const cards = createSeasonCases({ seasonCasesBase, completedCases, currentCase, hasRun: hasResumableSave });
  const { status } = cards.find((card) => card.id === caseId);
  return decideCaseCardPress({ caseId, status, currentCase, completedCases, hasResumableSave, logLength });
}

test("a visitor with no run is not told the first case is in progress", () => {
  const statusOf = (hasRun) =>
    createSeasonCases({ seasonCasesBase, completedCases: [], currentCase: first, hasRun }).find((card) => card.id === first).status;
  assert.equal(statusOf(false), "OPEN");
  assert.equal(statusOf(true), "PLAYING");
  // A caller that does not say is a caller with a run, as it was before.
  assert.equal(createSeasonCases({ seasonCasesBase, completedCases: [], currentCase: first })[0].status, "PLAYING");
});

test("the first card opens the season for a visitor with no run", () => {
  assert.equal(pressOn(first, { currentCase: first, hasResumableSave: false }), "open");
});

test("the card of the case in progress resumes it", () => {
  assert.equal(pressOn(second, { currentCase: second, completedCases: [first], logLength: 4 }), "resume");
  // Paused on its first scene, with nothing chosen yet: still a resume.
  assert.equal(pressOn(second, { currentCase: second, completedCases: [first], logLength: 0 }), "resume");
});

test("another card asks before it throws the case in progress away", () => {
  assert.equal(pressOn(first, { currentCase: second, completedCases: [first], logLength: 4 }), "replace");
});

test("another card opens without a question when nothing has been chosen yet", () => {
  assert.equal(pressOn(first, { currentCase: second, completedCases: [first], logLength: 0 }), "open");
});

test("the next case opens without a question from a closed one", () => {
  // The run stands on the report of the case it just closed; its record is kept in the summary.
  assert.equal(pressOn(third, { currentCase: second, completedCases: [first, second], logLength: 9 }), "open");
});

test("the card of the closed case the run stands on asks before starting it over", () => {
  assert.equal(pressOn(second, { currentCase: second, completedCases: [first, second], logLength: 9 }), "restart");
});

test("a card the season has not reached does nothing", () => {
  assert.equal(pressOn(third, { currentCase: first, logLength: 2 }), "locked");
  assert.equal(pressOn(third, { currentCase: first, hasResumableSave: false }), "locked");
});
