import assert from "node:assert/strict";
import { test } from "node:test";

import { installBrowser } from "./helpers/browser.mjs";

/**
 * The intro screen's field bag, as the pre-start shell and the runtime both
 * build it (`createIntroViewModel`).
 *
 * The bag was written once because two copies of it had drifted: the shell
 * printed the wrong storage sentence in three of its four states. So what is
 * held here is what the two callers must agree on -- the banner, the roadmap's
 * statuses, the fallbacks -- and the one place they differ: the fields only
 * the runtime can supply, which the shell shows as nothing at all.
 *
 * `src/telemetry.js` reads its server at import, so the module is loaded after
 * the browser stand-ins are installed.
 */
installBrowser();
const { playStyleOptions } = await import("../../src/appCopy.js");
const { RESULT_NODE_IDS, seasonCasesBase } = await import("../../src/gameCases.js");
const { telemetryEnabled } = await import("../../src/telemetry.js");
const { createTelemetrySummary, INTRO_FIELDS_WITHOUT_RUNTIME } = await import("../../src/viewModels/appViewModels.js");
const { createCompletedCaseResultList, createIntroViewModel } = await import("../../src/viewModels/introViewModel.js");

const [FIRST, SECOND, THIRD] = seasonCasesBase.map((caseItem) => caseItem.id);

/** The bag for a browser that has never played, with whatever a test changes. */
const intro = (extra = {}) => createIntroViewModel({
  playerName: "", playStyle: playStyleOptions[0].id, dataConsent: false, operatorOrigin: "courier", sessionCode: "UNIT", isOnline: true,
  hasResumableSave: false, lastSavedAt: null, log: [], caseResults: {}, completedCases: [], currentCase: FIRST, nodeId: "start",
  newGamePlusUnlocked: false, newGamePlusMemory: {}, ...extra,
});

/** Everything the runtime supplies, each with a value the shell's stand-in could not be mistaken for. */
const runtimeFields = () => Object.fromEntries(Object.keys(INTRO_FIELDS_WITHOUT_RUNTIME).map((field) => [field, { suppliedAs: field }]));

test("the shell's intro shows nothing for each field only the runtime can supply", () => {
  const view = intro();
  for (const [field, nothing] of Object.entries(INTRO_FIELDS_WITHOUT_RUNTIME)) {
    assert.equal(view[field], nothing, `${field} is the stand-in that renders nothing`);
  }
  assert.equal(view.node, null, "no scene title before the graph is loaded");
  assert.deepEqual(view.seasonJourney, []);
  assert.equal(view.debugToolsEnabled, false, "and the shell never draws the debug console");
});

test("the runtime's intro carries the runtime's own values for those fields", () => {
  const runtime = runtimeFields();
  const view = intro({ runtime });
  for (const field of Object.keys(INTRO_FIELDS_WITHOUT_RUNTIME)) {
    assert.equal(view[field], runtime[field], `${field} is the runtime's`);
  }
});

test("a runtime that leaves a field out is refused by name rather than shown as undefined", () => {
  const { progress: _progress, debugNodeId: _debugNodeId, ...partial } = runtimeFields();
  assert.throws(() => intro({ runtime: partial }), (error) => {
    assert.match(error.message, /intro runtime fields missing/);
    assert.match(error.message, /progress/);
    assert.match(error.message, /debugNodeId/);
    assert.doesNotMatch(error.message, /seasonJourney/, "only the missing ones are named");
    return true;
  });
  assert.doesNotThrow(() => intro({ runtime: { ...runtimeFields(), progress: undefined } }), "a field supplied as undefined was supplied");
});

test("the storage banner is the shared one in every state of consent and connection", () => {
  assert.equal(telemetryEnabled, true, "the unit environment has a server, so all three online states can be reached");
  const titles = new Set();
  for (const isOnline of [true, false]) {
    for (const dataConsent of [true, false]) {
      const view = intro({ isOnline, dataConsent });
      assert.deepEqual(view.telemetrySummary, createTelemetrySummary({ dataConsent, isOnline, telemetryEnabled }), `online ${isOnline}, consent ${dataConsent}`);
      titles.add(view.telemetrySummary.title);
    }
  }
  assert.equal(titles.size, 3, "ready, waiting for consent, and offline are three different banners");
  assert.equal(intro({ isOnline: false, dataConsent: true }).telemetrySummary.title, "오프라인", "offline is said first, whatever was consented to");
  assert.equal(intro({ isOnline: true, dataConsent: false }).telemetrySummary.tone, "pending");
  assert.equal(intro({ isOnline: true, dataConsent: true }).telemetrySummary.tone, "ready");
});

test("the way of playing shown is the saved one, or the first when the save names none the game has", () => {
  const last = playStyleOptions.at(-1);
  assert.equal(intro({ playStyle: last.id }).activePlayStyle, last);
  assert.equal(intro({ playStyle: "a-style-removed-since" }).activePlayStyle, playStyleOptions[0]);
  assert.equal(intro({ playStyle: undefined }).activePlayStyle, playStyleOptions[0]);
});

test("the case in the header is the save's current case", () => {
  assert.equal(intro({ currentCase: SECOND }).activeCaseMeta.id, SECOND);
  assert.equal(intro({ currentCase: "no-such-case" }).activeCaseMeta, undefined, "a case the season does not have is no case, not the first one");
});

test("the save stands on a report only when its scene is a case's result", () => {
  const [resultNode] = RESULT_NODE_IDS;
  assert.equal(intro({ nodeId: resultNode }).atReport, true);
  assert.equal(intro({ nodeId: "start" }).atReport, false);
  assert.equal(intro({ nodeId: undefined }).atReport, false);
});

test("the roadmap calls the current case in progress only when there is a run to go back to", () => {
  const status = (view, id) => view.seasonCases.find((caseItem) => caseItem.id === id).status;
  const fresh = intro({ currentCase: FIRST, hasResumableSave: false });
  assert.equal(status(fresh, FIRST), "OPEN", "a browser that has never played is not in the middle of the first case");
  assert.equal(status(fresh, SECOND), "LOCKED");

  const midway = intro({ currentCase: SECOND, completedCases: [FIRST], hasResumableSave: true });
  assert.deepEqual([FIRST, SECOND, THIRD].map((id) => status(midway, id)), ["COMPLETE", "PLAYING", "LOCKED"]);
  assert.equal(midway.seasonCases.length, seasonCasesBase.length, "every case of the season has a card");

  const truthy = intro({ currentCase: FIRST, hasResumableSave: "2026-10-12T00:00:00Z" });
  assert.equal(status(truthy, FIRST), "PLAYING", "whatever the caller's flag is, it is read as yes or no");
});

test("each roadmap status has its own words, and one the screen does not know reads as locked", () => {
  const { getCaseStatusText } = intro();
  const texts = ["PLAYING", "OPEN", "COMPLETE", "LOCKED"].map(getCaseStatusText);
  assert.deepEqual(texts, ["진행 중", "시작 가능", "완료됨", "이전 케이스 필요"]);
  assert.equal(getCaseStatusText(undefined), getCaseStatusText("LOCKED"));
});

test("the closed cases are listed in the season's order with their summaries read back in full", () => {
  const list = createCompletedCaseResultList({ [THIRD]: { rank: "S", burstScore: 91 }, [FIRST]: { momentumScore: 40 }, "not-a-case": { rank: "A" } });
  assert.deepEqual(list.map((caseItem) => caseItem.id), [FIRST, THIRD], "by the season, not by the order they were stored in, and only cases the season has");
  const [first, third] = list;
  assert.equal(third.title, seasonCasesBase.find((caseItem) => caseItem.id === THIRD).title, "each keeps its case's own card");
  assert.deepEqual([third.result.rank, third.result.burstScore], ["S", 91]);
  assert.equal(first.result.burstScore, 40, "a summary stored before the burst score reads its momentum as one");
  assert.equal(first.result.rank, "C", "and a field it never stored has a value to print");
  assert.deepEqual(createCompletedCaseResultList(), [], "no results, no list");
  assert.deepEqual(createCompletedCaseResultList({ [FIRST]: null }), [], "a case with nothing stored is not closed");
});

test("the intro's list of closed cases is the save's", () => {
  const view = intro({ caseResults: { [FIRST]: { rank: "A" } }, completedCases: [FIRST], currentCase: SECOND });
  assert.deepEqual(view.completedCaseResultList.map((caseItem) => [caseItem.id, caseItem.result.rank]), [[FIRST, "A"]]);
  assert.deepEqual(intro().completedCaseResultList, []);
});

test("the shell can leave out the telemetry queue and the three panels, and nothing is drawn for them", () => {
  const view = intro();
  assert.deepEqual(view.pendingTelemetry, []);
  for (const render of ["renderSaveStatus", "renderRecoveryNotice", "renderErrorLogPanel"]) {
    assert.equal(view[render](), null, `${render} renders nothing`);
  }
  assert.doesNotThrow(() => { view.setPendingTelemetry([]); view.setTelemetryStatus("sent"); });
  assert.equal(view.musicModeKey, intro({ runtime: runtimeFields() }).musicModeKey, "both callers play the same cue");
});
