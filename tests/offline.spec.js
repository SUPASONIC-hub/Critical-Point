import { expect, test } from "./helpers/network.js";
import { resumeSavedRun } from "./helpers/gameFlow.js";
import { savedAtLastScene, seedSave } from "./helpers/seededSave.js";
import { OFFLINE_READY_ATTRIBUTE } from "../src/serviceWorker/register.js";

/**
 * The release, opened again with no connection.
 *
 * The manifest says the game installs, and a save needs no server; this is the
 * test that an installed copy is then a game and not the browser's error page.
 * It runs against `dist/` under `vite preview`, like the rest of the @prod
 * tier, and it is the one spec that turns the service worker on: the e2e build
 * registers it only for a page opened with `?sw=1`
 * (src/serviceWorker/register.js), so every other spec plays the build with
 * nothing between it and the routes it stubs.
 *
 * WebKit is skipped, not passed: on this project's Playwright WebKit a worker
 * and an offline context were never run together, and a harness that cannot
 * show the thing is not a test of it. Safari on a phone is unverified.
 */
test.skip(process.env.E2E_SERVER !== "preview", "this is a test of the production build: npm run test:e2e:preview");

test("a copy opened once opens again with no connection, and resumes its run", { tag: "@prod" }, async ({ page, context, browserName }) => {
  test.skip(browserName === "webkit", "the worker under an offline context is unverified on Playwright WebKit");
  test.setTimeout(180_000);
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(String(error)));

  // Online, once: the worker installs, takes the page, and -- with a table
  // up -- is asked for the rest of the release.
  await seedSave(page, savedAtLastScene());
  await page.goto("/?sw=1");
  await expect(page.locator(".intro")).toBeVisible();
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null, null, { timeout: 30_000 });
  await resumeSavedRun(page);
  await expect(page.locator("html")).toHaveAttribute(OFFLINE_READY_ATTRIBUTE, "ready", { timeout: 90_000 });
  const release = await page.evaluate(async () => (await caches.keys()).filter((name) => name.startsWith("critical-point-")));
  expect(release, "one release, one cache").toHaveLength(1);

  // The connection goes. The page is asked for again and comes from the worker.
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator(".game-shell")).toBeVisible({ timeout: 30_000 });
  await expect(page.locator(".choices .choice").first()).toBeVisible();

  // Back to the intro, still offline: it is drawn, with its art.
  await page.getByRole("button", { name: "저장 후 나가기" }).click();
  await expect(page.locator(".intro")).toBeVisible();
  await expect(page.getByTestId("resume-save")).toBeVisible();
  expect(await page.evaluate(() => [...document.querySelectorAll(".intro img")].filter((image) => image.complete && image.naturalWidth === 0).length), "no broken image on the intro").toBe(0);

  // A screen this device never kept: its file is taken out of the cache, as if
  // the warm-up had been cut short. The offline panel, and no reload -- the
  // marker on the window is still there after the retry.
  const removed = await page.evaluate(async (cacheName) => {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    const ranking = requests.find((request) => /\/assets\/RankingScreen-/.test(request.url));
    return ranking ? cache.delete(ranking) : false;
  }, release[0]);
  expect(removed, "the ranking screen's chunk was in the cache to take out").toBe(true);
  // Playwright's offline switch cuts the network and, on a page a worker
  // controls, leaves `navigator.onLine` saying true (measured). A browser
  // that is really offline says so, and the app reads it to choose between a
  // reload and a retry, so the page is told what a real one would be.
  await page.evaluate(() => {
    Object.defineProperty(navigator, "onLine", { configurable: true, get: () => false });
    globalThis.__sameDocument = true;
  });
  await page.getByRole("button", { name: "랭킹" }).first().click();
  await expect(page.getByTestId("chunk-offline-panel")).toBeVisible();
  await expect(page.getByTestId("chunk-reload-panel")).toHaveCount(0);
  await page.getByTestId("chunk-retry").click();
  await expect(page.getByTestId("chunk-offline-panel")).toBeVisible();
  expect(await page.evaluate(() => globalThis.__sameDocument), "the page did not reload for a chunk it could not fetch").toBe(true);

  // The connection comes back, and the screen can be had again. Chromium
  // remembers a module it failed to fetch for as long as the document lives
  // (measured here: the retry fails again with the network back), so the same
  // button now ends in the one reload the missing-chunk path allows
  // (state/chunkReload.js) and the screen opens from the intro. A browser that
  // asks again opens it straight away; both are the game working.
  await context.setOffline(false);
  await page.evaluate(() => delete navigator.onLine);
  await page.getByTestId("chunk-retry").click();
  await expect(page.getByTestId("chunk-offline-panel")).toHaveCount(0);
  await expect(page.locator(".ranking-page, .intro").first()).toBeVisible();
  if (!(await page.locator(".ranking-page").isVisible())) await page.getByRole("button", { name: "랭킹" }).first().click();
  await expect(page.locator(".ranking-page")).toBeVisible();
  await expect(page.getByTestId("chunk-reload-panel")).toHaveCount(0);
  expect(pageErrors).toEqual([]);
});
