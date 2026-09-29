import assert from "node:assert/strict";
import { test } from "node:test";

import { createStorage } from "./helpers/browser.mjs";

globalThis.localStorage = createStorage();

const { ACCESSIBILITY_SETTINGS_KEY } = await import("../../src/appConfig.js");
const settings = await import("../../src/state/accessibilitySettings.js");
const { createCaseSummary } = await import("../../src/gameLogic.js");
const { buildLeaderboard } = await import("../../src/ranking.js");

test("the settings read back what was stored, and only values the game offers", () => {
  settings.resetAccessibilityCache();
  assert.deepEqual({ ...settings.getAccessibility() }, { ...settings.DEFAULT_ACCESSIBILITY });

  localStorage.setItem(ACCESSIBILITY_SETTINGS_KEY, JSON.stringify({ tableTime: 3, letterKeys: "no", calmEffects: true, extra: 1 }));
  settings.resetAccessibilityCache();
  assert.deepEqual({ ...settings.getAccessibility() }, { ...settings.DEFAULT_ACCESSIBILITY, calmEffects: true });

  localStorage.setItem(ACCESSIBILITY_SETTINGS_KEY, "{broken");
  settings.resetAccessibilityCache();
  assert.equal(settings.getAccessibility().tableTime, 1);
});

test("a change is stored, told to subscribers and put on the document", () => {
  settings.resetAccessibilityCache();
  const attributes = new Map();
  globalThis.document = { documentElement: { toggleAttribute: (name, on) => attributes.set(name, on) } };
  let told = 0;
  const unsubscribe = settings.subscribeAccessibility(() => told++);
  try {
    const next = settings.setAccessibility({ tableTime: 1.5, stillIntro: true });
    assert.equal(next.tableTime, 1.5);
    assert.equal(told, 1);
    assert.equal(JSON.parse(localStorage.getItem(ACCESSIBILITY_SETTINGS_KEY)).stillIntro, true);
    assert.equal(attributes.get("data-still-intro"), true);
    assert.equal(attributes.get("data-calm-effects"), false);
    settings.setAccessibility({ tableTime: 7 });
    assert.equal(settings.getAccessibility().tableTime, 1, "a scale the game does not offer falls back to 1");
  } finally {
    unsubscribe();
    delete globalThis.document;
  }
});

test("a case played on a slowed clock says so in its summary, and one played at pace does not", () => {
  const entry = (extra = {}) => ({ caseId: "case02", nodeId: "c2_start", choiceId: "x", responseTimeSec: 10, effect: {}, ...extra });
  assert.equal("assistTime" in createCaseSummary({}, {}, [entry(), entry()]), false);
  assert.equal(createCaseSummary({}, {}, [entry(), entry({ assistTime: 1.5 }), entry({ assistTime: 2 })]).assistTime, 2);
});

test("a ranking row shows the slowed clock only for a value the game offers", () => {
  const row = (assistTime) => ({ case_id: "season-final", run_id: `run-${assistTime}`, completed_at: "2026-09-29T00:00:00Z", summary: { rank: "A", burstScore: 10, assistTime } });
  const [slowed] = buildLeaderboard([row(1.5)]);
  assert.equal(slowed.assistTime, 1.5);
  assert.equal(buildLeaderboard([row(9)])[0].assistTime, 1);
  assert.equal(buildLeaderboard([row(undefined)])[0].assistTime, 1);
});
