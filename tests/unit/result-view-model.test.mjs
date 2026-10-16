import assert from "node:assert/strict";
import { test } from "node:test";

import { installBrowser } from "./helpers/browser.mjs";

/**
 * The result screen's field bag (`createResultViewModel`), which GameRuntime.jsx
 * used to write inline as two lines of 1,448 and 589 characters.
 *
 * Three kinds of field go in: what the report hook derived (`report`, unpacked
 * here), what only the runtime knows (passed by name), and constants and copy
 * helpers the module imports itself. What is held here is that each lands under
 * its own name and that the four ending fields are read from the ending's id.
 *
 * `src/telemetry.js` reads its server at import, so the module is loaded after
 * the browser stand-ins are installed.
 */
installBrowser();
const { FEEDBACK_COMMENT_MAX_LENGTH } = await import("../../src/appConfig.js");
const { GAME_TITLE } = await import("../../src/appCopy.js");
const { getEndingEpilogue } = await import("../../src/featurePack.js");
const { getEndingSceneProfile, getEndingVisualClass } = await import("../../src/runtimeSystems.js");
const { createResultViewModel } = await import("../../src/viewModels/resultViewModel.js");

const REPORT_FIELDS = [
  "achievementBadges", "aftermath", "authorityReview", "beatSeason", "caseChange", "caseOutcome", "endingAtmosphere",
  "endingCause", "endingPreview", "endingProfile", "failureRecovery", "feedbackPrompts", "finalAftermathEntry",
  "finalEndingEntry", "logicReport", "originEndingVariant", "playReport", "rankLine", "rankingComparison",
  "rankingIntegrity", "replayDiagnostics", "result", "resultBridge", "resultRank", "routeTimeline", "scoreBreakdown",
  "seasonStanding", "telemetryDashboard", "telemetryStats",
];

const reportWith = (endingVariant) => ({
  ...Object.fromEntries(REPORT_FIELDS.map((field) => [field, { fromReport: field }])),
  endingVariant,
});

/** Every runtime argument, each a value naming itself, whatever names the module reads. */
const runtime = () => new Proxy({}, { get: (_target, field) => ({ fromRuntime: field }) });

test("each report field and each runtime argument lands under its own name", () => {
  const view = createResultViewModel(reportWith({ id: "open-oversight" }), runtime());
  for (const field of REPORT_FIELDS) {
    assert.deepEqual(view[field], { fromReport: field }, `${field} is the report's`);
  }
  const runtimeFields = Object.entries(view).filter(([, value]) => value?.fromRuntime);
  assert.ok(runtimeFields.length > 40, "the runtime passes its state and handlers by name");
  for (const [field, value] of runtimeFields) {
    assert.equal(value.fromRuntime, field, `${field} is the runtime's ${field}`);
  }
});

test("the ending fields are read from the ending's id, and the constants are the module's own", () => {
  const view = createResultViewModel(reportWith({ id: "evidence-reform" }), runtime());
  assert.equal(view.endingSceneProfile, getEndingSceneProfile("evidence-reform"));
  assert.equal(view.endingVisualClass, getEndingVisualClass("evidence-reform"));
  assert.equal(view.endingEpilogue, getEndingEpilogue("evidence-reform"));
  assert.deepEqual(view.failureObjectives, [], "an ending that is not a failure names no objectives");
  assert.equal(view.GAME_TITLE, GAME_TITLE);
  assert.equal(view.FEEDBACK_COMMENT_MAX_LENGTH, FEEDBACK_COMMENT_MAX_LENGTH);
  assert.equal(typeof view.clamp, "function");
});

test("a failure ending carries the two objectives that would have avoided it", () => {
  const view = createResultViewModel(reportWith({ id: "collapse", failure: true }), runtime());
  assert.equal(view.failureObjectives.length, 2);
});
