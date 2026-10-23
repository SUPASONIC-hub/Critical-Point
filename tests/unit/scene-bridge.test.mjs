import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { getSceneBridge } from "../../src/viewModels/sceneBridge.js";
import { getCaseOutcome } from "../../src/gameLogic.js";
import { getReadingSeconds } from "../../src/gauntlet/gauntletEngine.js";

// The line over the briefing's first box (improvement notes D-7, 2026-10-22).
test("the bridge is the last decision's echo, or the ending of the case before on a case's first scene", () => {
  assert.equal(getSceneBridge({ log: [{ echo: "한지우가 받아 적습니다." }], currentCase: "case03" }), "지난 장면에서 — 한지우가 받아 적습니다.");
  // A logged decision with no echo (a bust, an old save) leaves no line rather than the case's ending.
  assert.equal(getSceneBridge({ log: [{ echo: null }], caseResults: { case02: { outcomeChoiceId: "x" } }, currentCase: "case03" }), null);
  const outcome = getCaseOutcome({ caseId: "prologue04", choiceId: "p4_after_warn" });
  assert.equal(
    getSceneBridge({ log: [], caseResults: { prologue04: { outcomeChoiceId: "p4_after_warn" } }, currentCase: "prologue05" }),
    `지난 사건에서 — ${outcome.title}`,
  );
  assert.equal(getSceneBridge({ log: [], caseResults: {}, currentCase: "prologue05" }), null, "a case reached without its predecessor closed");
  assert.equal(getSceneBridge({ log: [], caseResults: {}, currentCase: "prologue01" }), null, "the season's first scene");
});

test("the bridge is printed over the first box and counted on the reading clock", () => {
  const briefing = readFileSync(new globalThis.URL("../../src/gauntlet/SceneBriefing.jsx", import.meta.url), "utf8");
  const story = briefing.indexOf('className="gx-panel gx-panel-story"');
  assert.ok(story > 0 && briefing.indexOf('data-testid="scene-bridge"') > story && briefing.indexOf('data-testid="scene-bridge"') < briefing.indexOf("<ProseCaptions"));
  assert.match(briefing, /\.\.\.weekRules, \{ text: bridge \}[,\]]/);
  const node = { text: "가".repeat(200) };
  assert.ok(getReadingSeconds(node, [{ text: "지난 장면에서 — " + "나".repeat(40) }]) > getReadingSeconds(node));
});
