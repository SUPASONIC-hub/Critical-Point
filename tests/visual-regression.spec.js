import { expect, test } from "@playwright/test";
import { completeCurrentCase, startDebugNode } from "./helpers/gameFlow.js";

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

// The densest screen in the app, and the one the layout work was aimed at.
test("case play mobile visual baseline @visual", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
  });
  await startDebugNode(page, "case05", "c5_voice");
  await expect(page.locator(".game-shell")).toBeVisible();
  await stabilizeVisualPage(page);
  await expect(page.locator(".game-shell")).toHaveScreenshot("case-play-mobile.png", {
    animations: "disabled",
    caret: "hide",
  });
});

test("case result desktop visual baseline @visual", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.addInitScript(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
  });
  await startDebugNode(page, "case01", "c1_aftershock");
  await completeCurrentCase(page);
  await expect(page.locator(".result-page")).toBeVisible();
  await stabilizeVisualPage(page);
  // The report prints numbers derived from real response times, so a few
  // hundred glyph pixels differ every run. The budget is wide enough to ignore
  // those and narrow enough that a moved block still fails.
  await expect(page.locator(".result-page")).toHaveScreenshot("case-result-desktop.png", {
    animations: "disabled",
    caret: "hide",
    maxDiffPixels: 4000,
  });
});

// U-1: one decision used to be seven screens of scrolling on a phone, with the
// resource board below the choices. Both are budgets, not pixel comparisons, so
// they fail on a layout regression rather than on a font hint.
test("mobile play screen keeps the decision reachable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
  });
  await startDebugNode(page, "case05", "c5_voice");
  await expect(page.locator(".game-shell")).toBeVisible();
  // The debug overlay only exists in this harness, so it is not part of the budget.
  await page.addStyleTag({ content: ".debug-overlay { display: none !important; }" });
  const rail = page.locator(".resource-rail");
  await expect(rail).toBeVisible();
  const choicePanelTop = await page.locator("#choice-panel").evaluate((element) => element.getBoundingClientRect().top + window.scrollY);
  // Budgets, not measurements: ratchet them down, never up. The screen was
  // 5,775px with the choices starting around y=2,600 before the layout pass.
  expect(choicePanelTop).toBeLessThan(844 * 2);
  const pageHeight = await page.evaluate(() => document.body.scrollHeight);
  expect(pageHeight).toBeLessThan(844 * 5.5);
  await page.locator("#choice-panel").scrollIntoViewIfNeeded();
  await expect(rail).toBeInViewport();
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
