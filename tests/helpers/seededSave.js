import { CASE_SEQUENCE } from "../../src/gameData.js";
import { TEST_STORAGE_KEYS } from "./storage.js";

/**
 * Into the game without the debug jump.
 *
 * The production build has no debug console (it is compiled out), so a test of
 * that build cannot ask for a scene by name. It can do what a returning player
 * does: arrive with a save and press 이어하기. These build that save.
 */

/** A paused run standing on `nodeId`, with every case before `caseId` closed. */
export function savedRunAt(caseId, nodeId, overrides = {}) {
  return {
    saveSchemaVersion: 2,
    runId: "e2e-seeded-run",
    playerName: "E2E",
    started: false,
    paused: true,
    currentCase: caseId,
    nodeId,
    completedCases: CASE_SEQUENCE.slice(0, CASE_SEQUENCE.indexOf(caseId)),
    discoveredClues: [],
    log: [],
    pendingTelemetry: [],
    caseResults: {},
    playtestFeedback: {},
    resources: { time: 72, capital: 100, trust: 50, legitimacy: 50, humanCost: 0, fatigue: 10 },
    triggers: {},
    cognition: {},
    ...overrides,
  };
}

/** One decision from the report: the scene every way through 사건 01 closes on. */
export function savedAtLastScene(overrides = {}) {
  return savedRunAt("case01", "c1_aftershock", overrides);
}

/**
 * Writes the save before the app boots, once. An init script runs on every
 * navigation, so without the guard a reload would put the seed back over
 * whatever the run had saved since.
 */
export async function seedSave(page, save) {
  await page.addInitScript(
    ({ key, value }) => {
      if (sessionStorage.getItem("e2e-save-seeded")) return;
      sessionStorage.setItem("e2e-save-seeded", "1");
      localStorage.clear();
      localStorage.setItem(key, JSON.stringify(value));
    },
    { key: TEST_STORAGE_KEYS.save, value: save },
  );
}
