import { expect, test } from "./helpers/network.js";
import { cashStakedCard, resumeSavedRun } from "./helpers/gameFlow.js";
import { savedAtLastScene, seedSave } from "./helpers/seededSave.js";

/**
 * The budgets are measured on the production build (`--preview`), which is
 * the one a player loads: on the dev server they timed Vite compiling modules.
 * They are budgets for a desktop running the suite, not for a phone on a
 * network -- `check:bundle` holds what a phone downloads.
 */
test("intro should become usable within the navigation budget", { tag: "@prod" }, async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".intro-shell")).toBeVisible();
  await expect(page.getByTestId("start-first-case")).toBeEnabled();
  // From the browser's own navigation start, not from a mark an init script
  // set: that mark was made after the document had arrived, so the request,
  // the response and the parse before the first script were never on the clock.
  const ready = await page.evaluate(() => performance.now());
  expect(ready).toBeLessThan(2500);
});

// Was "result route should become usable", which timed the way to a play scene
// on the dev server. Two tests now, each measuring what it is called: the first
// scene from the click that asks for it -- the scene graph fetched, parsed and
// built -- and the report from the click that closes a case.
test("the first scene opens within the render budget", { tag: "@prod" }, async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const start = page.getByTestId("start-first-case");
  await expect(start).toBeEnabled();
  const clickedAt = await page.evaluate(() => performance.now());
  await start.click();
  await expect(page.getByTestId("scene-briefing").or(page.locator(".choices .choice")).first()).toBeVisible();
  const duration = (await page.evaluate(() => performance.now())) - clickedAt;
  expect(duration).toBeLessThan(3000);
});

test("a finished case opens its report within the render budget", { tag: "@prod" }, async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await seedSave(page, savedAtLastScene());
  await page.goto("/");
  await resumeSavedRun(page);
  await page.locator(".choices .choice:not([aria-disabled='true'])").first().click();
  await cashStakedCard(page);
  const next = page.getByTestId("decision-next");
  await expect(next).toBeVisible();
  const clickedAt = await page.evaluate(() => performance.now());
  await next.click();
  await expect(page.locator(".result-page")).toBeVisible();
  const duration = (await page.evaluate(() => performance.now())) - clickedAt;
  // The report is a lazy chunk (ResultScreen): fetched, parsed and rendered.
  expect(duration).toBeLessThan(2000);
});
