import { expect, test } from "@playwright/test";

const STORAGE_KEY = "trigger-prototype-v2";
const EMPTY_TRIGGERS = {
  protection: 0,
  injustice: 0,
  responsibility: 0,
  competition: 0,
  reward: 0,
  curiosity: 0,
  order: 0,
  trust: 0,
  affection: 0,
  recognition: 0,
  fear: 0,
  system: 0,
  helplessness: 0,
  selfAwareness: 0,
  manipulation: 0,
  choice: 0,
};
const EMPTY_COGNITION = {
  persistence: 0,
  inference: 0,
  reframing: 0,
  risk: 0,
};

async function startDebugNode(page, caseId, nodeId) {
  await page.getByTestId("debug-case-select").selectOption(caseId);
  await page.getByTestId("debug-node-select").selectOption(nodeId);
  await expect(page.getByTestId("debug-case-select")).toHaveValue(caseId);
  await expect(page.getByTestId("debug-node-select")).toHaveValue(nodeId);
  await page.getByTestId("debug-start-node").click();
  await expect
    .poll(async () => page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2") || "null")?.nodeId))
    .toBe(nodeId);
  await expect(page.locator(".game-shell")).toBeVisible();
}

function validSavedState(patch = {}) {
  return {
    saveSchemaVersion: 2,
    playerName: "E2E",
    playStyle: "instinct",
    openingLegacy: null,
    dataConsent: false,
    started: true,
    paused: false,
    currentCase: "case05",
    nodeId: "c5_voice",
    completedCases: ["case01", "case02", "case03", "case04"],
    discoveredClues: [],
    caseResults: {},
    playtestFeedback: {},
    resources: { time: 72, capital: 100, trust: 50, legitimacy: 50, humanCost: 0, fatigue: 10 },
    triggers: EMPTY_TRIGGERS,
    cognition: EMPTY_COGNITION,
    log: [],
    freeText: "",
    echo: "E2E",
    nodeEnteredAt: Date.now(),
    pendingTelemetry: [],
    protocolUsed: false,
    timerPenaltyApplied: false,
    probeUsed: false,
    savedAt: new Date().toISOString(),
    ...patch,
  };
}

test("ordinary save keeps discovered clues and does not create recovery metadata", async ({ page }) => {
  await page.addInitScript((saved) => {
    if (sessionStorage.getItem("save-integrity-seeded")) return;
    sessionStorage.setItem("save-integrity-seeded", "1");
    localStorage.setItem("trigger-prototype-v2", JSON.stringify(saved));
  }, validSavedState({
    currentCase: "case01",
    nodeId: "start",
    completedCases: [],
    discoveredClues: [{ id: "c1-hidden-ledger", title: "hidden ledger", text: "x" }],
  }));
  await page.goto("/?debug=1");
  await expect(page.locator(".game-shell")).toBeVisible();
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pagehide", { persisted: false })));
  await page.reload();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")));
  expect(saved.discoveredClues).toHaveLength(1);
  expect(saved.lastError).toBeFalsy();
});

test("clearing the saved run before navigation does not resurrect it", async ({ page }) => {
  await page.goto("/?debug=1");
  await startDebugNode(page, "case02", "c2_logs");
  await page.evaluate(() => localStorage.clear());
  await page.goto("/?debug=1");
  expect(await page.evaluate(() => localStorage.getItem("trigger-prototype-v2"))).toBeNull();
  await expect(page.locator(".intro-shell")).toBeVisible();
});

test("start fresh from recovery clears the saved run and returns to intro", async ({ page }) => {
  await page.addInitScript((saved) => {
    if (sessionStorage.getItem("save-integrity-seeded")) return;
    sessionStorage.setItem("save-integrity-seeded", "1");
    localStorage.setItem("trigger-prototype-v2", JSON.stringify(saved));
  }, validSavedState({
    paused: true,
    lastError: {
      id: "recovery-start-fresh",
      occurredAt: new Date().toISOString(),
      source: "save-integrity",
      message: "Synthetic recovery notice",
      currentCase: "case05",
      nodeId: "c5_voice",
    },
  }));
  await page.goto("/?debug=1");
  await expect(page.locator(".recovery-notice")).toBeVisible();
  await page.getByTestId("start-fresh-after-recovery").evaluate((button) => button.click());
  await expect
    .poll(async () => page.evaluate(() => localStorage.getItem("trigger-prototype-v2")).catch(() => "navigating"))
    .toBeNull();
  await expect(page.locator(".intro-shell")).toBeVisible();
});
