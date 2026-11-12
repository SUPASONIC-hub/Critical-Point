import assert from "node:assert/strict";
import { test } from "node:test";

import { CASE_SEQUENCE } from "../../src/gameCases.js";
import { ENDING_GATES, initialResources } from "../../src/gameConstants.js";
import { getSeasonStrain } from "../../src/gameLogic.js";
import { readSeasonStandingMark, SEASON_STANDING_MARKS } from "../../src/seasonStanding.js";
import { sanitizeTelemetryQueue, validateSeasonStanding, validateTelemetryItem } from "../../src/state/payloadSchemas.js";
import { createSeasonStandingReadout, HELD_LINE_CAPITAL_SHARE, readHeldLine } from "../../src/viewModels/reportViewModels.js";
import { createSeasonTelemetryPayload } from "../../src/viewModels/seasonViewModels.js";

/**
 * The season-final row's `seasonStanding` (decision T3): the finale's report
 * reads "held" -- cash lost, people kept under the collapse line -- and the
 * row now says so, so report:judgment counts it rather than guessing it from
 * the ending.
 */
const { collapseHarmPerCase: HARM_GATE } = ENDING_GATES;
const LOST = initialResources.capital * HELD_LINE_CAPITAL_SHARE - 10;
const KEPT = initialResources.capital;

/** Ten closed cases, each closing on `capital` cash, the first carrying all of `harmTotal`. */
function season(harmTotal, capital) {
  return Object.fromEntries(CASE_SEQUENCE.slice(0, 10).map((caseId, index) => [caseId, {
    finalHumanCost: index === 0 ? harmTotal : 0,
    pushRecord: { busts: 0, cashes: 4 },
    finalResources: { ...initialResources, capital, humanCost: index === 0 ? harmTotal : 0 },
  }]));
}

const mark = (caseResults) => readSeasonStandingMark({ caseResults, resources: {}, closing: getSeasonStrain(caseResults).seasonResources });

test("the mark is the finale report's own reading: held exactly where the held sentence prints", () => {
  const cases = [
    [season(0, LOST), "held"],
    [season(0, KEPT), "clear"],
    [season(HARM_GATE * 10 * 0.9, LOST), "near"],
    [season(HARM_GATE * 10, LOST), "over"],
  ];
  for (const [caseResults, expected] of cases) {
    assert.equal(mark(caseResults), expected);
    const readout = createSeasonStandingReadout({ caseResults, resources: {}, closing: getSeasonStrain(caseResults).seasonResources, endingId: "field-pact" });
    assert.equal(readout.held !== null, expected === "held", `held sentence for ${expected}`);
    if (expected !== "held") assert.equal(readout.level, expected);
  }
  // Before any case closed there is no closing cash, and nothing is held.
  assert.equal(readSeasonStandingMark(), "clear");
  assert.equal(readHeldLine({ level: "clear", closing: null }), null);
});

test("the row's check takes the four marks and nothing else, and the two lists are one", () => {
  for (const value of SEASON_STANDING_MARKS) assert.deepEqual(validateSeasonStanding({ seasonStanding: value }), []);
  assert.deepEqual(validateSeasonStanding({}), [], "a row from before the field is a row as before");
  assert.deepEqual(validateSeasonStanding(undefined), []);
  for (const bad of ["HELD", "", null, 1, { level: "held" }]) assert.deepEqual(validateSeasonStanding({ seasonStanding: bad }), ["invalid summary.seasonStanding"]);
  const caseItem = (summary) => ({ id: "season-final-run", label: "SEASON 01 COMPLETE", type: "case", payload: { event_id: "e", summary } });
  assert.deepEqual(validateTelemetryItem(caseItem({ seasonStanding: "held" })), []);
  assert.deepEqual(validateTelemetryItem(caseItem({ seasonStanding: "lost" })), ["invalid summary.seasonStanding"]);
  // A queued row restored from the save goes through the same check.
  assert.equal(sanitizeTelemetryQueue([caseItem({ seasonStanding: "held" }), caseItem({ seasonStanding: "lost" })]).length, 1);
});

test("the season row carries the mark in its summary, a few bytes under the server's 4,096", () => {
  const without = createSeasonTelemetryPayload({ caseSummary: { burstScore: 61 }, completedCaseCount: 10, runId: "run" });
  const withMark = createSeasonTelemetryPayload({ caseSummary: { burstScore: 61, seasonStanding: "clear" }, completedCaseCount: 10, runId: "run" });
  assert.equal(withMark.summary.seasonStanding, "clear");
  assert.equal(withMark.summary.seasonComplete, true);
  const added = Math.max(...SEASON_STANDING_MARKS.map((value) => JSON.stringify({ ...without.summary, seasonStanding: value }).length)) - JSON.stringify(without.summary).length;
  assert.ok(added <= 26, `the mark adds ${added} bytes`);
});
