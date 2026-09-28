import { expect, test } from "@playwright/test";
import { cashStakedCard, completeCurrentCase, dismissProtocolBreach, startDebugNode } from "./helpers/gameFlow.js";
import { readJsonStorage, TEST_STORAGE_KEYS } from "./helpers/storage.js";

/**
 * Getting a run back: a recovery slot restored in the middle of play, a crash
 * that is counted once, a screen whose file is gone, a save this build cannot
 * read -- and the smaller things that lose progress or focus on the way.
 */

const EMPTY_TRIGGERS = Object.fromEntries(
  [
    "protection", "injustice", "revenge", "responsibility", "competition", "reward", "curiosity", "order", "trust",
    "affection", "recognition", "fear", "system", "helplessness", "selfAwareness", "manipulation", "choice",
  ].map((key) => [key, 0]),
);
const EMPTY_COGNITION = { persistence: 0, inference: 0, reframing: 0, risk: 0 };

function savedRun(patch = {}) {
  return {
    saveSchemaVersion: 2,
    runId: "run-recovery-e2e",
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
    echo: "E2E",
    nodeEnteredAt: Date.now(),
    pendingTelemetry: [],
    protocolUsed: false,
    timerPenaltyCount: 0,
    probeUsed: false,
    savedAt: new Date().toISOString(),
    ...patch,
  };
}

/** Seeds storage once per tab, so the reload a test causes reads what the app wrote. */
async function seedOnce(page, { save = null, slots = null, errorLog = null }) {
  await page.addInitScript(
    ({ saveKey, slotsKey, errorLogKey, seeded }) => {
      if (sessionStorage.getItem("recovery-spec-seeded")) return;
      sessionStorage.setItem("recovery-spec-seeded", "1");
      const text = (value) => (typeof value === "string" ? value : JSON.stringify(value));
      if (seeded.save !== null) localStorage.setItem(saveKey, text(seeded.save));
      if (seeded.slots !== null) localStorage.setItem(slotsKey, text(seeded.slots));
      if (seeded.errorLog !== null) localStorage.setItem(errorLogKey, text(seeded.errorLog));
    },
    {
      saveKey: TEST_STORAGE_KEYS.save,
      slotsKey: TEST_STORAGE_KEYS.saveSlots,
      errorLogKey: TEST_STORAGE_KEYS.errorLog,
      seeded: { save, slots, errorLog },
    },
  );
}

/** Two frames on: past anything the app scheduled with requestAnimationFrame. */
async function settleFrames(page) {
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

const focusIsInside = (page, selector) =>
  page.evaluate((target) => Boolean(document.querySelector(target)?.contains(document.activeElement)), selector);

test("a recovery slot restored in the middle of play is the run that comes back", async ({ page }) => {
  page.on("dialog", (dialog) => dialog.accept());
  const slotSnapshot = savedRun({ nodeId: "c5_start", started: true, runId: "run-recovery-e2e" });
  await seedOnce(page, {
    save: savedRun({
      lastError: {
        id: "restore-in-play",
        occurredAt: new Date().toISOString(),
        source: "window-error",
        message: "Synthetic failure at the scene",
        currentCase: "case05",
        nodeId: "c5_voice",
      },
    }),
    slots: {
      recoverySlotSchemaVersion: 1,
      slots: [{
        id: "slot-before",
        savedAt: "2026-09-27T10:00:00.000Z",
        currentCase: "case05",
        nodeId: "c5_start",
        completedCases: ["case01", "case02", "case03", "case04"],
        snapshot: slotSnapshot,
      }],
    },
  });
  await page.goto("/?debug=1");
  await page.waitForSelector(".game-shell");
  await page.getByTestId("open-error-log-from-notice").click();
  await page.getByTestId("restore-save-slot-slot-before").click();

  // The restore reloads; the page that went away must not have saved over it.
  await page.waitForSelector(".intro");
  const restored = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  expect(restored.nodeId).toBe("c5_start");
  expect(restored.started).toBe(false);
  expect(restored.paused).toBe(true);
});

test("declining the question leaves the slot, the log and the run as they were", async ({ page }) => {
  page.on("dialog", (dialog) => dialog.dismiss());
  await seedOnce(page, {
    save: savedRun({ started: false, paused: true }),
    errorLog: {
      saveSchemaVersion: 1,
      entries: [{ id: "kept", occurredAt: new Date().toISOString(), error: { message: "Kept entry" }, context: {} }],
    },
    slots: {
      recoverySlotSchemaVersion: 1,
      slots: [{
        id: "slot-kept",
        savedAt: "2026-09-27T10:00:00.000Z",
        currentCase: "case05",
        nodeId: "c5_start",
        completedCases: [],
        snapshot: savedRun({ nodeId: "c5_start" }),
      }],
    },
  });
  await page.goto("/?debug=1");
  await page.getByTestId("open-error-log-from-header").click();
  const panel = page.getByTestId("error-log-panel");
  await panel.getByRole("button", { name: /로그 비우기/ }).click();
  await panel.getByRole("button", { name: "삭제" }).click();
  await page.getByTestId("restore-save-slot-slot-kept").click();

  await expect(panel.getByText("Kept entry")).toBeVisible();
  await expect(page.getByTestId("restore-save-slot-slot-kept")).toBeVisible();
  expect((await readJsonStorage(page, TEST_STORAGE_KEYS.save)).nodeId).toBe("c5_voice");
  expect((await readJsonStorage(page, TEST_STORAGE_KEYS.errorLog)).entries).toHaveLength(1);
});

test("one render crash is one failed attempt, and the retry is still offered", async ({ page }) => {
  await seedOnce(page, { save: savedRun() });
  // The play screen's module, replaced by one that cannot draw.
  await page.route(/\/src\/screens\/PlayScreen\.jsx/, (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: 'export function PlayScreen() { throw new Error("render crash e2e"); }',
    }),
  );
  await page.goto("/?debug=1");
  await page.waitForSelector("[data-testid=error-retry]");
  await expect(page.getByTestId("error-retry")).toBeEnabled();

  const saved = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  expect(saved.lastError.retryCount).toBe(1);
  expect(saved.lastError.source).toBe("react-render");
  const log = await readJsonStorage(page, TEST_STORAGE_KEYS.errorLog);
  expect(log.entries.filter((entry) => entry.error.message === "render crash e2e")).toHaveLength(1);
  const slots = await readJsonStorage(page, TEST_STORAGE_KEYS.saveSlots);
  expect(slots.slots.filter((slot) => slot.nodeId === "c5_voice")).toHaveLength(1);

  // The second failure from the same save is where retrying stops.
  await page.getByTestId("error-retry").click();
  await page.waitForSelector("[data-testid=error-retry][disabled]");
  expect((await readJsonStorage(page, TEST_STORAGE_KEYS.save)).lastError.retryCount).toBe(2);
  const slotsAfter = await readJsonStorage(page, TEST_STORAGE_KEYS.saveSlots);
  expect(slotsAfter.slots.filter((slot) => slot.nodeId === "c5_voice")).toHaveLength(1);
});

test("a screen whose file is gone offers a reload and charges nothing to the save", async ({ page }) => {
  await seedOnce(page, { save: savedRun({ started: false, paused: true }) });
  let blocked = true;
  await page.route(/\/src\/screens\/RankingScreen\.jsx/, (route) => (blocked ? route.abort() : route.continue()));
  await page.goto("/?debug=1");
  await page.locator(".intro-ranking-button").first().click();
  await expect(page.getByTestId("chunk-reload-panel")).toBeVisible();

  const saved = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  expect(saved.lastError).toBeFalsy();
  expect(await readJsonStorage(page, TEST_STORAGE_KEYS.errorLog)).toBeNull();

  blocked = false;
  await page.getByTestId("chunk-reload").click();
  await page.waitForSelector(".intro");
  await page.locator(".intro-ranking-button").first().click();
  await expect(page.getByRole("heading", { level: 1, name: "어디서 생각이 가장 크게 확장됐는가" })).toBeVisible();
  await expect(page.getByTestId("chunk-reload-panel")).toHaveCount(0);
});

test("a save this build cannot read is kept, and the recovery centre opens on the slots", { tag: "@prod" }, async ({ page }) => {
  const fromANewerBuild = JSON.stringify({ ...savedRun(), saveSchemaVersion: 99 });
  await seedOnce(page, {
    save: fromANewerBuild,
    slots: {
      recoverySlotSchemaVersion: 1,
      slots: [{
        id: "slot-readable",
        savedAt: "2026-09-27T10:00:00.000Z",
        currentCase: "case05",
        nodeId: "c5_start",
        completedCases: ["case01"],
        snapshot: savedRun({ nodeId: "c5_start" }),
      }],
    },
  });
  // No debug flag: this is what a player sees.
  await page.goto("/");
  await page.waitForSelector("[data-testid=error-log-panel]");
  await expect(page.getByTestId("restore-save-slot-slot-readable")).toBeVisible();
  await expect(page.getByTestId("save-backup")).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("critical-point-unreadable-save-v1")))
    .toBe(fromANewerBuild);
});

test("focus stays inside the briefing page that opens on the next scene", async ({ page }) => {
  await startDebugNode(page, "case01", "start");
  await page.locator(".choices .choice:not([aria-disabled='true'])").first().click();
  await cashStakedCard(page);
  await page.getByTestId("decision-next").click();
  await expect(page.locator(".decision-reveal-backdrop")).toHaveCount(0);

  const briefing = page.getByTestId("scene-briefing");
  await expect(briefing).toBeVisible();
  await settleFrames(page);
  expect(await focusIsInside(page, "[data-testid='scene-briefing']")).toBe(true);

  // Tab walks the page, not the table it covers.
  for (let press = 0; press < 12; press += 1) {
    await page.keyboard.press("Tab");
    expect(await focusIsInside(page, "[data-testid='scene-briefing']")).toBe(true);
  }
});

test("focus stays inside the briefing page a fresh scene opens on", async ({ page }) => {
  await startDebugNode(page, "case01", "start", { openTable: false });
  await expect(page.getByTestId("scene-briefing")).toBeVisible();
  await settleFrames(page);
  expect(await focusIsInside(page, "[data-testid='scene-briefing']")).toBe(true);
});

test("Escape closes 랭킹 and 게시판 and gives focus back to what opened them", { tag: "@prod" }, async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector(".intro");
  for (const opener of [".intro-ranking-button:not(.intro-board-button)", ".intro-board-button"]) {
    await page.locator(opener).click();
    await expect(page.locator(".intro")).toHaveCount(0);
    await page.keyboard.press("Escape");
    await page.waitForSelector(".intro");
    await expect(page.locator(opener)).toBeFocused();
  }
});

test("replaying a closed case asks first, by key and by button", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  let answer = "dismiss";
  const asked = [];
  page.on("dialog", (dialog) => {
    asked.push(dialog.message());
    return answer === "accept" ? dialog.accept() : dialog.dismiss();
  });
  await startDebugNode(page, "case02", "c2_aftershock");
  await completeCurrentCase(page);
  await expect(page.locator(".result-page")).toBeVisible();
  const closed = await readJsonStorage(page, TEST_STORAGE_KEYS.save);

  await page.keyboard.press("r");
  await page.locator(".replay-case-button").click();
  expect(asked).toHaveLength(2);
  await expect(page.locator(".result-page")).toBeVisible();
  expect((await readJsonStorage(page, TEST_STORAGE_KEYS.save)).log).toEqual(closed.log);

  answer = "accept";
  await page.keyboard.press("r");
  await page.waitForSelector(".game-shell");
  await dismissProtocolBreach(page);
  expect((await readJsonStorage(page, TEST_STORAGE_KEYS.save)).log).toEqual([]);
});

test("the intro's start button deals the origin's opening hand", { tag: "@prod" }, async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("critical-point-operator-origin", "public"));
  await page.goto("/");
  await page.getByTestId("start-first-case").click();
  await page.waitForSelector(".game-shell");
  const opened = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  // 공공 출신: legitimacy +8, capital -2, fatigue +3.
  expect(opened.resources).toMatchObject({ legitimacy: 58, capital: 98, fatigue: 13, trust: 50 });
});

test("a tab opened from this one takes a table token of its own", async ({ page, context }) => {
  await page.goto("/?debug=1");
  await page.waitForSelector(".intro");
  const original = await page.evaluate(() => {
    const key = "critical-point-tab-token-v1";
    if (!sessionStorage.getItem(key)) sessionStorage.setItem(key, "token-of-the-original-tab");
    sessionStorage.setItem("recovery-spec-copied", "1");
    return sessionStorage.getItem(key);
  });
  // A window opened from a page starts with a copy of its sessionStorage, the
  // way a duplicated tab does.
  const [copy] = await Promise.all([
    context.waitForEvent("page"),
    page.evaluate(() => {
      window.open(`${location.origin}/?debug=1`, "_blank");
    }),
  ]);
  await copy.waitForLoadState("domcontentloaded");
  await copy.waitForSelector(".intro");
  // It did start as a copy: what the original had in sessionStorage is here.
  expect(await copy.evaluate(() => sessionStorage.getItem("recovery-spec-copied"))).toBe("1");
  await expect
    .poll(() => copy.evaluate(() => sessionStorage.getItem("critical-point-tab-token-v1")))
    .not.toBe(original);
  expect(await copy.evaluate(() => sessionStorage.getItem("critical-point-tab-token-v1"))).toBeTruthy();
  expect(await page.evaluate(() => sessionStorage.getItem("critical-point-tab-token-v1"))).toBe(original);

  // A reload of the original is still the original.
  await page.reload();
  await page.waitForSelector(".intro");
  expect(await page.evaluate(() => sessionStorage.getItem("critical-point-tab-token-v1"))).toBe(original);
});
