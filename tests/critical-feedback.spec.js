import { expect, test } from "@playwright/test";
import { startDebugNode } from "./helpers/gameFlow.js";
import { readJsonStorage, TEST_STORAGE_KEYS } from "./helpers/storage.js";

test("critical feedback emits particles, stays mobile-safe, and persists dynamics", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await startDebugNode(page, "case05", "c5_voice");

  await page.locator(".choices .choice").first().click();
  const console = page.locator(".commit-console");
  await expect(console).toBeVisible();
  const consoleBox = await console.boundingBox();
  expect(consoleBox).not.toBeNull();
  expect(consoleBox.y + consoleBox.height).toBeLessThanOrEqual(844 + 2);

  await page.getByTestId("commit-push").click();
  await expect(page.locator(".decision-particle")).not.toHaveCount(0);
  await expect(page.locator(".decision-feedback-layer")).toBeVisible();

  await page.getByRole("button", { name: "저장", exact: true }).click();
  const savedAfterPush = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  expect(typeof savedAfterPush.dynamics.hiddenChoice).toBe("string");
  expect(typeof savedAfterPush.dynamics.thresholdState).toBe("string");
  expect(typeof savedAfterPush.dynamics.environmentMode).toBe("string");
  expect(savedAfterPush.dynamics.stressLevel).toBeGreaterThan(0);
  expect(savedAfterPush.dynamics.rewardMultiplier).toBeGreaterThanOrEqual(1);

  await page.reload();
  await expect(page.locator(".game-shell")).toBeVisible();
  const stressText = await page.locator(".decision-stress").innerText();
  const restoredStress = Number(stressText.match(/STRESS (\d+)%/)?.[1] ?? 0);
  expect(restoredStress).toBeGreaterThan(0);
  expect(restoredStress).toBeLessThanOrEqual(savedAfterPush.dynamics.stressLevel);

  const feedbackBox = await page.locator(".decision-feedback-layer").boundingBox();
  expect(feedbackBox).not.toBeNull();
  expect(feedbackBox.y).toBeGreaterThanOrEqual(50);
});
