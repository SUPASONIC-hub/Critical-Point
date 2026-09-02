import { expect, test } from "@playwright/test";
import { startDebugNode } from "./helpers/gameFlow.js";

test.use({ colorScheme: "light" });

async function stabilizeVisualPage(page) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
        caret-color: transparent !important;
      }
      .debug-overlay,
      .music-controls,
      .music-toggle,
      .status-bar-timer,
      .timer-card {
        visibility: hidden !important;
      }
    `,
  });
}

test("intro desktop visual baseline @visual", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.goto("/");
  await expect(page.locator(".intro")).toBeVisible();
  await stabilizeVisualPage(page);
  await expect(page).toHaveScreenshot("intro-desktop.png", {
    fullPage: true,
    animations: "disabled",
    caret: "hide",
    maxDiffPixels: 500,
  });
});

test("case play desktop visual baseline @visual", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.addInitScript(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
  });
  await startDebugNode(page, "case05", "c5_voice");
  await expect(page.locator(".game-shell")).toBeVisible();
  await stabilizeVisualPage(page);
  await expect(page.locator(".game-shell")).toHaveScreenshot("case-play-desktop.png", {
    animations: "disabled",
    caret: "hide",
  });
});

test("intro mobile visual baseline @visual", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".intro")).toBeVisible();
  await stabilizeVisualPage(page);
  await expect(page).toHaveScreenshot("intro-mobile.png", {
    fullPage: true,
    animations: "disabled",
    caret: "hide",
    maxDiffPixels: 500,
  });
});

for (const viewport of [
  { name: "desktop", width: 1366, height: 768 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test(`intro start controls stay above the fold on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/");
    const startButton = page.locator(".start-input-row button");
    await expect(startButton).toBeVisible();
    const box = await startButton.boundingBox();
    expect(box?.y ?? Number.POSITIVE_INFINITY).toBeGreaterThanOrEqual(0);
    expect((box?.y ?? 0) + (box?.height ?? Number.POSITIVE_INFINITY)).toBeLessThanOrEqual(viewport.height);
  });
}
