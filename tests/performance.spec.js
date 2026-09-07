import { expect, test } from "@playwright/test";

test("intro should become usable within the navigation budget", async ({ page }) => {
  const startedAt = Date.now();
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".intro-shell")).toBeVisible();
  expect(Date.now() - startedAt).toBeLessThan(2500);
});

test("result route should become usable within the render budget", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
  });
  await page.goto("/?debug=1");
  const startedAt = Date.now();
  await page.getByTestId("debug-case-select").selectOption("case01");
  await page.getByTestId("debug-node-select").selectOption("c1_aftershock");
  await page.getByTestId("debug-start-node").click();
  await expect(page.locator(".game-shell")).toBeVisible();
  expect(Date.now() - startedAt).toBeLessThan(3000);
});
