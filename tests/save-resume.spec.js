import { expect, test } from "./helpers/network.js";
import { acceptConfirms } from "./helpers/dialogs.js";
import { cashStakedCard, dismissProtocolBreach, openIntroDrawer, resumeSavedRun, startDebugNode } from "./helpers/gameFlow.js";
import { readJsonStorage, readStorage, TEST_STORAGE_KEYS } from "./helpers/storage.js";
import { ACCESSIBILITY_SETTINGS_KEY } from "../src/appConfig.js";
import { createWindow, getTableSchema, normalizeSchema } from "../src/gauntlet/gauntletEngine.js";

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

// A window that has closed is on its slam for most of a second before the
// verdict is committed. Leaving then used to drop the verdict and bring the
// hold back as a bust, so a cash became a BUST; the exit now waits.
test("leaving during the verdict slam keeps the verdict", async ({ page }) => {
  await startDebugNode(page, "case02", "c2_logs");
  await stakeAndPush(page);
  const cash = page.getByTestId("commit-confirm");
  for (let press = 0; press < 8 && !(await cash.isEnabled()); press += 1) {
    await page.getByTestId("commit-push").evaluate((button) => button.click());
  }
  await page.evaluate(async () => {
    document.querySelector("[data-testid='commit-confirm']").click();
    // Let the closed window render and report itself before leaving.
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(resolve, 30))));
    [...document.querySelectorAll("button")].find((button) => button.getAttribute("aria-label") === "저장 후 나가기")?.click();
  });
  await expect(page.getByTestId("decision-next")).toBeVisible();
  const saved = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  expect(saved.dynamics.busts).toBe(0);
  expect(saved.dynamics.suspended ?? null).toBeNull();
});

// The page going away (a reload, a phone reclaiming the tab) keeps a live
// table too. What it can never keep is a table that already hit the wall: a
// closed window is not suspended, so the bust stands (unit-tests.mjs).
test("a reload keeps a live table on the same wall", async ({ page }) => {
  await startDebugNode(page, "case02", "c2_logs");
  await stakeAndPush(page);
  const stage = page.getByTestId("gauntlet-stage");
  const before = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  const gaugeBefore = Number(await stage.getAttribute("data-gauge"));
  // The wall this window was dealt, from the engine: the save holds the seed
  // and the board, and never the wall.
  const seed = String(before.dynamics.openSeed).split("#")[0];
  const dealt = createWindow({ schema: normalizeSchema(before.dynamics.schema), seed });

  await page.reload();
  await expect(stage).toHaveAttribute("data-status", "live");
  await expect(page.locator(".gx-card.selected")).toHaveCount(1);
  const after = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  expect(after.dynamics.windowIndex).toBe(before.dynamics.windowIndex);
  // The table as it stood: the gauge where it was (creep only ever adds), and
  // under the wall.
  const gaugeAfter = Number(await stage.getAttribute("data-gauge"));
  expect(gaugeAfter).toBeGreaterThanOrEqual(gaugeBefore);
  expect(gaugeAfter).toBeLessThan(dealt.wall);

  // And the same wall: pushed into, it is where the seed put it, and the
  // push from before the reload is still counted.
  let pushes = 1;
  for (let press = 0; press < 20 && (await stage.getAttribute("data-status")) === "live"; press += 1) {
    await page.getByTestId("commit-push").click();
    pushes += 1;
  }
  await expect(stage).toHaveAttribute("data-status", "bust");
  const marker = await page.locator(".gx-gauge-wall").evaluate((element) => Number.parseFloat(element.style.left));
  expect(marker).toBeCloseTo(dealt.wall, 1);
  await expect(page.getByTestId("decision-next")).toBeVisible();
  const settled = (await readJsonStorage(page, TEST_STORAGE_KEYS.save)).log.at(-1).threshold;
  expect(settled.busted).toBe(true);
  expect(settled.wall).toBeCloseTo(dealt.wall, 1);
  expect(settled.pushes).toBe(pushes);
});

// 스토리 모드 is read when a case opens and written on the run, so what is on
// the table does not change with the switch. A story case put down mid-table,
// the switch turned off on the intro, the page loaded again: the table comes
// back on its far wall, and the case closes as the story case it was.
test("a story case put down mid-table is still a story case after the setting is turned off", async ({ page }) => {
  test.setTimeout(120_000);
  const settings = () => page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "null"), ACCESSIBILITY_SETTINGS_KEY);
  // Turned on the way a player turns it on, so no init script puts it back on the reload below.
  await page.goto("/?debug=1");
  await openIntroDrawer(page, ".accessibility-panel");
  const toggle = page.getByRole("region", { name: "편의 설정" }).getByLabel(/스토리 모드/);
  await toggle.check();
  expect((await settings()).storyMode).toBe(true);

  // 사건 01's last scene: one decision from its report.
  await startDebugNode(page, "case01", "c1_aftershock", { navigate: false, resetStorage: false });
  await page.addStyleTag({ content: ".debug-overlay { display: none !important; }" });
  const band = page.locator(".gx-band-label");
  await expect(band).toHaveText("벽 88–98");
  await stakeAndPush(page);
  await page.getByRole("button", { name: "저장 후 나가기" }).click();
  const before = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  expect(before.dynamics.story).toBe(true);
  expect(before.dynamics.suspended, "the live window is written into the run").toBeTruthy();
  // The wall this window was dealt, from the engine and the run's own mark.
  const seed = String(before.dynamics.openSeed).split("#")[0];
  const dealt = createWindow({ schema: getTableSchema({ story: true, schema: normalizeSchema(before.dynamics.schema) }), seed });
  expect(dealt.wall).toBeGreaterThanOrEqual(88);
  expect(normalizeSchema(before.dynamics.schema).wallMin, "the board in the save is the table's own: the far wall is not written into it").toBeLessThan(88);

  // Off, on the intro the exit lands on.
  await expect(page.locator(".intro")).toBeVisible();
  await openIntroDrawer(page, ".accessibility-panel");
  await expect(toggle).toBeChecked();
  await toggle.uncheck();
  expect((await settings()).storyMode).toBe(false);

  await page.reload();
  expect((await settings()).storyMode, "the reload did not turn it back on").toBe(false);
  await resumeSavedRun(page);
  const stage = page.getByTestId("gauntlet-stage");
  await expect(stage).toHaveAttribute("data-status", "live");
  await expect(page.locator(".gx-card.selected")).toHaveCount(1);
  await expect(band).toHaveText("벽 88–98");
  const resumed = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  expect(resumed.dynamics.story).toBe(true);
  expect(resumed.dynamics.windowIndex).toBe(before.dynamics.windowIndex);

  // The verdict reads the wall the window drew before it was put down.
  await cashStakedCard(page);
  await expect(page.getByTestId("decision-next")).toBeVisible();
  const settled = (await readJsonStorage(page, TEST_STORAGE_KEYS.save)).log.at(-1);
  expect(settled.threshold.busted).toBe(false);
  expect(settled.threshold.wall).toBeCloseTo(dealt.wall, 1);
  expect(settled.assistStory).toBe(true);
  expect(settled.assistTime).toBe(2);

  await page.getByTestId("decision-next").click();
  await expect(page.locator(".result-page")).toBeVisible({ timeout: 30_000 });
  await expect(page.locator(".rank-mark small")).toContainText(" · 스토리 모드 · 공개 랭킹 제외");
  const closed = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  expect(closed.caseResults.case01.assistStory).toBe(true);
  expect((await settings()).storyMode, "and the setting is still off").toBe(false);
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
  // Online save is opt-in: this device turned it on before the run.
  await page.addInitScript((key) => localStorage.setItem(key, "1"), TEST_STORAGE_KEYS.cloudEnabled);
  // A controlled clock, so "nothing was sent" is proved over a known span of
  // the page's own timers rather than 3.5 wall-clock seconds of hoping.
  await page.clock.install();
  await startDebugNode(page, "case02", "c2_logs");
  await context.setOffline(true);
  const offlineUploads = uploads.length;
  await page.getByRole("button", { name: "저장", exact: true }).click();
  await page.clock.runFor(10_000);
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
  // Asks first when this device already holds a run; this one does not, but
  // an unanswered question would turn the import into a silent no-op.
  acceptConfirms(page);
  await panel.getByRole("button", { name: "불러와서 이어하기" }).click();
  await expect(page.getByTestId("resume-save")).toBeVisible({ timeout: 10_000 });
  const local = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  expect(local.runId).toBe("cloud-run");
  expect(local.currentCase).toBe("case04");
  expect(await readStorage(page, TEST_STORAGE_KEYS.cloudCode)).toBe("ABCDEFGHJKLM");
  expect(await readJsonStorage(page, TEST_STORAGE_KEYS.settledWindows)).toContain("seed-a");
});
