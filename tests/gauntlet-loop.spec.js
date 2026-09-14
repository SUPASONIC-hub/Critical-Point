import { expect, test } from "@playwright/test";
import { startDebugNode } from "./helpers/gameFlow.js";
import { readJsonStorage, TEST_STORAGE_KEYS } from "./helpers/storage.js";

/**
 * The gauntlet's promises, in a browser.
 *
 * Each test is one thing the table says it does: the decision fits on the
 * screen, a push visibly compounds the pot, a bust takes the pot and says so,
 * the next board is broken in a way the player can see, and none of it goes
 * silent for a player who asked for less motion.
 */

/** The debug overlay is harness chrome; on a phone it sits over the action bar. */
async function openTable(page, caseId, nodeId) {
  await startDebugNode(page, caseId, nodeId);
  await page.addStyleTag({ content: ".debug-overlay { display: none !important; }" });
}

async function readNumber(locator) {
  return Number((await locator.textContent()).replace(/[^\d.]/g, ""));
}

async function pushUntilBust(page) {
  const stage = page.getByTestId("gauntlet-stage");
  for (let press = 0; press < 20; press += 1) {
    if ((await stage.getAttribute("data-status")) !== "live") break;
    await page.getByTestId("commit-push").click();
  }
  await expect(stage).toHaveAttribute("data-status", "bust");
}

test("the whole decision is on one screen before anything is scrolled", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openTable(page, "case01", "start");
  const layout = await page.evaluate(() => {
    const bottom = (selector) => document.querySelector(selector)?.getBoundingClientRect().bottom ?? Infinity;
    const cards = [...document.querySelectorAll(".choices .choice")];
    return {
      cards: cards.length,
      lastCard: Math.max(...cards.map((card) => card.getBoundingClientRect().bottom)),
      pot: bottom("[data-testid='gauntlet-pot']"),
      push: bottom("[data-testid='commit-push']"),
      cash: bottom("[data-testid='commit-confirm']"),
      widest: Math.max(...[...document.querySelectorAll("body *")].map((element) => element.getBoundingClientRect().right)),
      innerHeight,
      innerWidth,
    };
  });
  expect(layout.cards).toBeGreaterThan(1);
  for (const key of ["lastCard", "pot", "push", "cash"]) expect(layout[key], key).toBeLessThanOrEqual(layout.innerHeight);
  expect(layout.widest).toBeLessThanOrEqual(layout.innerWidth + 1);
});

test("every push visibly compounds the pot, and the odds are never printed", async ({ page }) => {
  await openTable(page, "case01", "start");
  await page.locator(".choices .choice").first().click();
  const pot = page.getByTestId("gauntlet-pot");
  let previous = await readNumber(pot);
  expect(previous).toBeGreaterThan(0);
  for (let press = 0; press < 3; press += 1) {
    await page.getByTestId("commit-push").click();
    await expect.poll(() => readNumber(pot)).toBeGreaterThanOrEqual(Math.floor(previous * 1.5));
    previous = await readNumber(pot);
  }
  await expect(page.getByTestId("gauntlet-stage")).not.toContainText(/%/);
});

test("a bust takes the pot, says BUST, and deals a broken board", async ({ page }) => {
  await openTable(page, "case01", "start");
  // Bank something first, so there is a pot for the wall to take.
  await page.locator(".choices .choice").first().click();
  await page.getByTestId("commit-push").click();
  await page.getByTestId("commit-confirm").click();
  await page.getByTestId("decision-next").click();
  const banked = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  expect(banked.dynamics.runPot).toBeGreaterThan(0);

  await page.getByTestId("protocol-breach").click();
  await page.locator(".choices .choice").first().click();
  await pushUntilBust(page);
  await expect(page.locator(".gx-slam-bust")).toContainText("BUST");
  await expect(page.getByTestId("gauntlet-run-pot")).toHaveText("0");

  const reveal = page.locator(".decision-reveal");
  await expect(reveal.locator("h2")).toHaveText("BUST");
  await expect(reveal.locator(".decision-bonus")).toHaveCount(0);
  await expect(page.getByTestId("next-mutations")).toContainText("BLACKOUT");

  const saved = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  expect(saved.dynamics.runPot).toBe(0);
  expect(saved.dynamics.busts).toBe(1);
  expect(saved.dynamics.schema.faceDown).toBe(true);

  await page.getByTestId("decision-next").click();
  await expect(page.getByTestId("protocol-breach")).toContainText("BLACKOUT");
  await expect(page.getByTestId("gauntlet-stage")).toHaveClass(/is-face-down/);
  await expect(page.getByTestId("gauntlet-gauge")).toHaveText("22");
  await expect(page.locator(".gx-card-chips").first()).toHaveText("▒▒");
});

test("cashing without a single push seals the best card on the next board", async ({ page }) => {
  await openTable(page, "case01", "start");
  await page.locator(".choices .choice").first().click();
  await page.getByTestId("commit-confirm").click();
  await expect(page.getByTestId("next-mutations")).toContainText("COLD FEET");
  await page.getByTestId("decision-next").click();
  const sealed = page.locator(".gx-card.is-sealed");
  await expect(sealed).toHaveCount(1);
  await page.getByTestId("protocol-breach").click();
  await sealed.click();
  await expect(page.getByTestId("commit-confirm")).toBeDisabled();
  for (let press = 0; press < 6 && (await page.getByTestId("commit-confirm").isDisabled()); press += 1) {
    await page.getByTestId("commit-push").click();
  }
  await expect(page.getByTestId("commit-confirm")).toBeEnabled();
});

test("reduced motion keeps the bust and the heat, and loses only the shake", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openTable(page, "case01", "start");
  await page.locator(".choices .choice").first().click();
  for (let press = 0; press < 3; press += 1) await page.getByTestId("commit-push").click();
  await expect.poll(() => page.evaluate(() => Number(getComputedStyle(document.documentElement).getPropertyValue("--gx-heat")))).toBeGreaterThan(0);
  const shake = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--gx-shake-x").trim());
  expect(["", "0.00px", "-0.00px"]).toContain(shake);
  await pushUntilBust(page);
  await expect(page.getByTestId("gauntlet-stage")).toHaveClass(/is-bust/);
  await expect(page.locator(".gx-slam-bust")).toBeVisible();
  await expect(page.locator(".gx-fx-bust")).toHaveCount(1);
});
