import assert from "node:assert/strict";
import { test } from "node:test";

import { installBrowser } from "./helpers/browser.mjs";

/**
 * The local ranking as the runtime holds it (state/useLocalRanking.js): the
 * rows read from this device's v11 key when the hook first renders, a row
 * appended through the hook written back under the same key, and the rows
 * cleared from the view. The retired keys are personalBests.js's (its own test).
 */
const row = (runId, caseId, burstScore) => ({ run_id: runId, case_id: caseId, summary: { burstScore } });
const browser = installBrowser({
  storage: {
    "critical-point-local-ranking-v11": JSON.stringify([row("run-1", "season-final", 61), { case_id: "season-final" }]),
  },
});
const { createElement } = await import("react");
const { renderToStaticMarkup } = await import("react-dom/server");
const { LOCAL_RANKING_STORAGE_KEY, useLocalRanking } = await import("../../src/state/useLocalRanking.js");

test("the hook reads this table's rows, appends a run's row in place of its earlier one, and writes it back", () => {
  assert.equal(LOCAL_RANKING_STORAGE_KEY, "critical-point-local-ranking-v11");
  let api = null;
  const Probe = () => {
    api = useLocalRanking();
    return null;
  };
  renderToStaticMarkup(createElement(Probe));
  assert.deepEqual(api.localRankingRows, [row("run-1", "season-final", 61)], "a row with no summary is dropped");

  const { rows, saved } = api.appendLocalRankingRow(row("run-1", "season-final", 70));
  assert.equal(saved, true);
  assert.deepEqual(rows, [row("run-1", "season-final", 70)], "the run's earlier season row is replaced");
  assert.deepEqual(JSON.parse(browser.storage.getItem(LOCAL_RANKING_STORAGE_KEY)), rows);

  api.clearLocalRankingRows();
  assert.deepEqual(JSON.parse(browser.storage.getItem(LOCAL_RANKING_STORAGE_KEY)), rows, "clearing the view leaves the stored rows");
});
