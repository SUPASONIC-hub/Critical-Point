import { expect, test } from "@playwright/test";
import { dismissProtocolBreach, resumeSavedRun, startDebugNode } from "./helpers/gameFlow.js";
import { readJsonStorage, readStorage, TEST_STORAGE_KEYS } from "./helpers/storage.js";

/**
 * Stopping mid-season and picking it up again: on the same device with a bet
 * still on the table, while offline, and on another device by code.
 */

const SUPABASE = "https://e2e.supabase.co";

async function useMockSupabase(page) {
  await page.addInitScript((url) => {
    localStorage.setItem("critical-point-telemetry-url", url);
    localStorage.setItem("critical-point-telemetry-key", "anon");
  }, SUPABASE);
}

async function stakeAndPush(page) {
  await dismissProtocolBreach(page);
  await page.locator(".choices .choice:not([aria-disabled='true'])").first().click();
  await page.getByTestId("commit-push").click();
  await expect(page.getByTestId("gauntlet-stage")).toHaveAttribute("data-status", "live");
}

test("leaving with a bet on the table keeps the table as it stood", async ({ page }) => {
  await startDebugNode(page, "case02", "c2_logs");
  await stakeAndPush(page);
  await page.getByRole("button", { name: "저장 후 나가기" }).click();

  const saved = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  const suspended = saved.dynamics.suspended;
  expect(suspended, "the live window is written into the run").toBeTruthy();
  expect(suspended.window.pushes).toBe(1);
  expect(suspended.window.selectedId).toBeTruthy();

  await resumeSavedRun(page);
  const stage = page.getByTestId("gauntlet-stage");
  await expect(stage).toHaveAttribute("data-status", "live");
  expect(Number(await stage.getAttribute("data-gauge"))).toBeGreaterThanOrEqual(Math.round(suspended.window.gauge));
  await expect(page.locator(".gx-card.selected")).toHaveCount(1);
  await expect
    .poll(async () => (await readJsonStorage(page, TEST_STORAGE_KEYS.save)).dynamics.suspended, { timeout: 5_000 })
    .toBeNull();
});

// The page going away (a reload, a phone reclaiming the tab) keeps a live
// table too. What it can never keep is a table that already hit the wall: a
// closed window is not suspended, so the bust stands (unit-tests.mjs).
test("a reload keeps a live table on the same wall", async ({ page }) => {
  await startDebugNode(page, "case02", "c2_logs");
  await stakeAndPush(page);
  const before = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  await page.reload();
  const stage = page.getByTestId("gauntlet-stage");
  await expect(stage).toHaveAttribute("data-status", "live");
  await expect(page.locator(".gx-card.selected")).toHaveCount(1);
  const after = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  expect(after.dynamics.windowIndex).toBe(before.dynamics.windowIndex);
});

test("a save made offline is uploaded when the connection comes back", async ({ page, context }) => {
  const uploads = [];
  // Playwright tries the most recently added route first, so the catch-all goes in first.
  await page.route(`${SUPABASE}/**`, (route) => route.fulfill({ status: 201, contentType: "application/json", body: "{}" }));
  await page.route(`${SUPABASE}/rest/v1/rpc/put_cloud_save`, async (route) => {
    uploads.push(route.request().postDataJSON());
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ accepted: true }) });
  });
  await useMockSupabase(page);
  await startDebugNode(page, "case02", "c2_logs");
  await context.setOffline(true);
  const offlineUploads = uploads.length;
  await page.getByRole("button", { name: "저장", exact: true }).click();
  await page.waitForTimeout(3_500);
  expect(uploads.length, "nothing leaves the device while offline").toBe(offlineUploads);
  const sync = await readJsonStorage(page, TEST_STORAGE_KEYS.cloudSync);
  expect(sync.pending, "the device remembers a save is waiting").toBeTruthy();

  await context.setOffline(false);
  await page.evaluate(() => globalThis.dispatchEvent(new Event("online")));
  await expect.poll(() => uploads.length, { timeout: 10_000 }).toBeGreaterThan(offlineUploads);
  const upload = uploads.at(-1);
  expect(upload.p_code).toMatch(/^[23456789A-HJ-NP-Z]{12}$/);
  expect(upload.p_payload.save.currentCase).toBe("case02");
  await expect.poll(async () => (await readJsonStorage(page, TEST_STORAGE_KEYS.cloudSync)).pending, { timeout: 5_000 }).toBe("");
});

test("another device picks the run up from its code", async ({ page }) => {
  const remoteSave = {
    saveSchemaVersion: 2,
    runId: "cloud-run",
    playerName: "이동 중",
    started: true,
    paused: false,
    currentCase: "case04",
    nodeId: "c4_offer",
    completedCases: ["case01", "case02", "case03"],
    discoveredClues: [],
    log: [{ nodeId: "c4_start", choiceId: "c4_start_split", caseId: "case04" }],
    caseResults: {},
    playtestFeedback: {},
    resources: { time: 60, capital: 70, trust: 55, legitimacy: 52, humanCost: 8, fatigue: 20 },
    triggers: {},
    cognition: {},
    pendingTelemetry: [],
    savedAt: new Date().toISOString(),
  };
  await page.route(`${SUPABASE}/**`, (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ accepted: true }) }));
  await page.route(`${SUPABASE}/rest/v1/rpc/get_cloud_save`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ saved_at: remoteSave.savedAt, payload: { save: remoteSave, settledWindows: ["seed-a"] } }),
    }),
  );
  await useMockSupabase(page);
  await page.goto("/");
  const panel = page.getByTestId("cloud-save-panel");
  await panel.locator("summary").click();
  await panel.getByLabel("다른 기기의 코드").fill("ABCD-EFGH-JKLM");
  await panel.getByRole("button", { name: "불러와서 이어하기" }).click();
  await expect(page.getByTestId("resume-save")).toBeVisible({ timeout: 10_000 });
  const local = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  expect(local.runId).toBe("cloud-run");
  expect(local.currentCase).toBe("case04");
  expect(await readStorage(page, TEST_STORAGE_KEYS.cloudCode)).toBe("ABCDEFGHJKLM");
  expect(await readJsonStorage(page, TEST_STORAGE_KEYS.settledWindows)).toContain("seed-a");
});
