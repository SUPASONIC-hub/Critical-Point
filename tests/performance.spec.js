import { expect, test } from "@playwright/test";

test("intro should become usable within the navigation budget", async ({ page }) => {
  await page.addInitScript(() => performance.mark("navigation-start"));
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".intro-shell")).toBeVisible();
  const duration = await page.evaluate(() => {
    performance.mark("intro-ready");
    return performance.measure("intro-ready-duration", "navigation-start", "intro-ready").duration;
  });
  expect(duration).toBeLessThan(2500);
});

test("result route should become usable within the render budget", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
  });
  await page.goto("/?debug=1");
  await page.evaluate(() => performance.mark("result-start"));
  await page.getByTestId("debug-case-select").selectOption("case01");
  await page.getByTestId("debug-node-select").selectOption("c1_aftershock");
  await page.getByTestId("debug-start-node").click();
  await expect(page.locator(".game-shell")).toBeVisible();
  const duration = await page.evaluate(() => {
    performance.mark("result-ready");
    return performance.measure("result-ready-duration", "result-start", "result-ready").duration;
  });
  expect(duration).toBeLessThan(3000);
});
