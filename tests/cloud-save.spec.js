import { BACKEND_ORIGIN, expect, test } from "./helpers/network.js";
import { cashStakedCard, dismissProtocolBreach, resumeSavedRun } from "./helpers/gameFlow.js";
import { readJsonStorage, TEST_STORAGE_KEYS } from "./helpers/storage.js";

/**
 * Two devices and one continuation code, as the player sees it. The rules
 * themselves are in tests/unit/cloud-save.test.mjs; this is the panel, which
 * loads when its fold is opened, and the two ways out of a conflict.
 */

const SUPABASE = BACKEND_ORIGIN;
const CODE = "ABCDEFGH2345";

const json = (body, status = 200) => ({ status, contentType: "application/json", body: JSON.stringify(body) });

const localSave = {
  saveSchemaVersion: 2,
  runId: "run-this-device",
  playerName: "이 기기",
  started: false,
  paused: true,
  currentCase: "case02",
  nodeId: "c2_logs",
  completedCases: ["case01"],
  discoveredClues: [],
  log: [{ nodeId: "c2_start", choiceId: "c2_start_trust", caseId: "case02" }],
  caseResults: {},
  playtestFeedback: {},
  resources: { time: 60, capital: 70, trust: 55, legitimacy: 52, humanCost: 8, fatigue: 20 },
  triggers: {},
  cognition: {},
  pendingTelemetry: [],
  savedAt: "2026-09-28T12:00:00.000Z",
};

/** A device that opted in, last synced revision 1, and has played since. */
async function seedDevice(page, { enabled = true } = {}) {
  await page.addInitScript(
    ({ url, keys, save, code, enabled: on }) => {
      if (sessionStorage.getItem("cloud-spec-seeded")) return;
      sessionStorage.setItem("cloud-spec-seeded", "1");
      localStorage.setItem(keys.telemetryUrl, url);
      localStorage.setItem(keys.telemetryKey, "anon");
      localStorage.setItem(keys.save, JSON.stringify(save));
      localStorage.setItem(keys.cloudEnabled, on ? "1" : "0");
      localStorage.setItem(keys.cloudCode, code);
      localStorage.setItem(keys.cloudSync, JSON.stringify({ pending: save.savedAt, synced: "2026-09-28T09:00:00.000Z", revision: 1 }));
    },
    { url: SUPABASE, keys: TEST_STORAGE_KEYS, save: localSave, code: CODE, enabled },
  );
}

async function openPanel(page) {
  const panel = page.getByTestId("cloud-save-panel");
  await panel.locator("summary").click();
  await expect(panel.getByTestId("cloud-save-toggle")).toBeVisible();
  return panel;
}

test("a device that fell behind is stopped, and the player chooses which progress stays", async ({ page }) => {
  const server = { saved_at: "2026-09-28T11:00:00.000Z", revision: 3 };
  const puts = [];
  await page.route(`${SUPABASE}/**`, (route) => route.fulfill(json([])));
  await page.route(`${SUPABASE}/rest/v1/rpc/peek_cloud_save`, (route) => route.fulfill(json(server)));
  await page.route(`${SUPABASE}/rest/v1/rpc/put_cloud_save`, async (route) => {
    const body = route.request().postDataJSON();
    puts.push(body);
    if (body.p_expected_revision !== server.revision) {
      await route.fulfill(json({ accepted: false, reason: "revision", ...server }));
      return;
    }
    server.revision += 1;
    server.saved_at = body.p_saved_at;
    await route.fulfill(json({ accepted: true, ...server }));
  });
  await seedDevice(page);
  await page.goto("/");

  const panel = await openPanel(page);
  await expect(panel.getByTestId("cloud-save-status")).toContainText("올리기를 멈췄습니다");
  await expect(panel.getByTestId("cloud-save-conflict")).toBeVisible();
  expect(puts, "nothing was uploaded over the newer copy").toHaveLength(0);
  expect((await readJsonStorage(page, TEST_STORAGE_KEYS.cloudSync)).conflict).toEqual({ savedAt: server.saved_at, revision: 3 });

  // It is still a conflict after a reload: nothing re-arms the upload.
  await page.reload();
  const reopened = await openPanel(page);
  await expect(reopened.getByTestId("cloud-save-conflict")).toBeVisible();
  expect(puts).toHaveLength(0);

  // Declining the question changes nothing.
  page.once("dialog", (dialog) => dialog.dismiss());
  await reopened.getByRole("button", { name: "이 기기의 진행으로 덮어쓰기" }).click();
  expect(puts).toHaveLength(0);

  page.once("dialog", (dialog) => dialog.accept());
  await reopened.getByRole("button", { name: "이 기기의 진행으로 덮어쓰기" }).click();
  await expect(reopened.getByTestId("cloud-save-status")).toContainText("모두 최신입니다");
  expect(puts).toHaveLength(1);
  expect(puts[0].p_expected_revision).toBe(3);
  expect(puts[0].p_payload.save.runId).toBe("run-this-device");
  expect(puts[0].p_payload.save.playerName, "the name stays on the device").toBeUndefined();
  const sync = await readJsonStorage(page, TEST_STORAGE_KEYS.cloudSync);
  expect(sync.conflict).toBeNull();
  expect(sync.revision).toBe(4);
});

test("a conflict is said during play, where the save speaks", async ({ page }) => {
  await page.route(`${SUPABASE}/**`, (route) => route.fulfill(json([])));
  await page.route(`${SUPABASE}/rest/v1/rpc/peek_cloud_save`, (route) => route.fulfill(json({ saved_at: "2026-09-28T11:00:00.000Z", revision: 3 })));
  let uploads = 0;
  await page.route(`${SUPABASE}/rest/v1/rpc/put_cloud_save`, (route) => {
    uploads += 1;
    return route.fulfill(json({ accepted: true, revision: 9 }));
  });
  await seedDevice(page);
  await page.goto("/");
  await expect.poll(async () => (await readJsonStorage(page, TEST_STORAGE_KEYS.cloudSync)).conflict?.revision, { timeout: 15_000 }).toBe(3);

  await resumeSavedRun(page);
  await expect(page.getByTestId("gauntlet-stage")).toBeVisible({ timeout: 30_000 });
  await dismissProtocolBreach(page);
  await page.locator(".choices .choice:not([aria-disabled='true'])").first().click();
  await cashStakedCard(page);
  await expect(page.locator(".save-status")).toContainText("온라인 저장이 멈췄습니다", { timeout: 15_000 });
  expect(uploads, "a decision made during a conflict is not uploaded").toBe(0);
  expect((await readJsonStorage(page, TEST_STORAGE_KEYS.cloudSync)).conflict?.revision).toBe(3);
});

test("turning online save off offers to take the online copy back", async ({ page }) => {
  const deleted = [];
  await page.route(`${SUPABASE}/**`, (route) => route.fulfill(json([])));
  await page.route(`${SUPABASE}/rest/v1/rpc/peek_cloud_save`, (route) => route.fulfill(json({ saved_at: "2026-09-28T09:00:00.000Z", revision: 1 })));
  await page.route(`${SUPABASE}/rest/v1/rpc/put_cloud_save`, (route) => route.fulfill(json({ accepted: true, revision: 2 })));
  await page.route(`${SUPABASE}/rest/v1/rpc/delete_cloud_save`, (route) => {
    deleted.push(route.request().postDataJSON());
    return route.fulfill(json(true));
  });
  await seedDevice(page);
  await page.goto("/");
  const panel = await openPanel(page);
  await expect(panel).toContainText("180일");
  await expect(panel.getByTestId("cloud-save-delete")).toHaveCount(0);

  await panel.getByTestId("cloud-save-toggle").uncheck();
  await expect(panel.getByTestId("cloud-save-status")).toContainText("꺼져 있습니다");
  page.once("dialog", (dialog) => dialog.accept());
  await panel.getByTestId("cloud-save-delete").click();
  await expect(panel.getByTestId("cloud-save-done")).toContainText("지웠습니다");
  expect(deleted).toEqual([{ p_code: CODE }]);
  expect((await readJsonStorage(page, TEST_STORAGE_KEYS.save)).runId, "the device keeps its own save").toBe("run-this-device");
});

test("against a database from before the migration the panel still uploads, and says what it cannot do", async ({ page }) => {
  const missing = (name) => json({ code: "PGRST202", message: `Could not find the function public.${name} in the schema cache`, details: null, hint: null }, 404);
  const puts = [];
  await page.route(`${SUPABASE}/**`, (route) => route.fulfill(json([])));
  await page.route(`${SUPABASE}/rest/v1/rpc/peek_cloud_save`, (route) => route.fulfill(missing("peek_cloud_save")));
  await page.route(`${SUPABASE}/rest/v1/rpc/delete_cloud_save`, (route) => route.fulfill(missing("delete_cloud_save")));
  await page.route(`${SUPABASE}/rest/v1/rpc/put_cloud_save`, (route) => {
    const body = route.request().postDataJSON();
    puts.push(body);
    return route.fulfill("p_expected_revision" in body ? missing("put_cloud_save") : json({ accepted: true, saved_at: body.p_saved_at }));
  });
  await seedDevice(page);
  await page.goto("/");
  const panel = await openPanel(page);
  await expect(panel.getByTestId("cloud-save-status")).toContainText("모두 최신입니다", { timeout: 15_000 });
  expect(puts.at(-1)).not.toHaveProperty("p_expected_revision");

  await panel.getByTestId("cloud-save-toggle").uncheck();
  page.once("dialog", (dialog) => dialog.accept());
  await panel.getByTestId("cloud-save-delete").click();
  await expect(panel.getByTestId("cloud-save-failed")).toContainText("180일 뒤에 자동으로 지워집니다");
  await expect(panel.getByTestId("cloud-save-failed")).not.toContainText("PGRST");
});
