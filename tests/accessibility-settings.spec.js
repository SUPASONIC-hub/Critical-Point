import { expect, test } from "./helpers/network.js";
import { ACCESSIBILITY_SETTINGS_KEY } from "../src/appConfig.js";
import { startDebugNode } from "./helpers/gameFlow.js";

/**
 * The comfort settings (maintenance priority 87): set on the intro, stored on
 * the device, and read where they apply. The logic is unit-tested
 * (tests/unit/accessibility.test.mjs); this is the part only a page shows --
 * the drawer, the attributes on <html> before the first paint, and the table
 * and the briefing page answering to them.
 */

/** Stores settings before any script of the page runs, on every navigation. */
async function withSettings(page, settings) {
  await page.addInitScript(
    ({ key, value }) => localStorage.setItem(key, value),
    { key: ACCESSIBILITY_SETTINGS_KEY, value: JSON.stringify(settings) },
  );
}

test("the intro's drawer stores a setting and the page answers before its first paint", async ({ page }) => {
  await page.goto("/");
  await page.locator(".intro-drawer > summary", { hasText: "편의 설정" }).click();
  const panel = page.getByRole("region", { name: "편의 설정" });
  await panel.getByLabel("2배").check();
  await panel.getByLabel(/첫 화면 움직임 멈추기/).check();
  await panel.getByLabel(/번쩍임·흔들림 줄이기/).check();

  const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), ACCESSIBILITY_SETTINGS_KEY);
  expect(stored).toMatchObject({ tableTime: 2, stillIntro: true, calmEffects: true, letterKeys: true });
  await expect(page.locator("html")).toHaveAttribute("data-still-intro", "");
  await expect(page.locator("html")).toHaveAttribute("data-calm-effects", "");

  await page.reload();
  // Set by main.jsx before React renders, so the intro never starts moving.
  await expect(page.locator("html")).toHaveAttribute("data-still-intro", "");
  const ticker = page.locator(".intro-ticker-track");
  await expect(ticker).toHaveCSS("animation-name", "none");

  await page.locator(".intro-drawer > summary", { hasText: "편의 설정" }).click();
  await expect(page.getByRole("region", { name: "편의 설정" }).getByLabel("2배")).toBeChecked();
});

test("with single-key shortcuts off, a number stakes nothing and the save button names no key", async ({ page }) => {
  await withSettings(page, { letterKeys: false });
  await startDebugNode(page, "case01", "start");
  await page.addStyleTag({ content: ".debug-overlay { display: none !important; }" });
  await page.locator("body").click({ position: { x: 2, y: 2 } });

  await page.keyboard.press("1");
  await page.keyboard.press("KeyW");
  await expect(page.locator(".gx-card.selected")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "저장", exact: true })).not.toHaveAttribute("aria-keyshortcuts");

  // The pointer still does everything the keys did.
  await page.locator(".choices .choice").first().click();
  await expect(page.locator(".gx-card.selected")).toHaveCount(1);
});

test("the reading clock can start held, and waits", async ({ page }) => {
  await withSettings(page, { holdReadingClock: true });
  await startDebugNode(page, "case01", "start", { openTable: false });
  const timer = page.getByTestId("reading-timer");
  await expect(timer).toContainText("멈춤");
  const before = await timer.textContent();
  await page.waitForTimeout(2500);
  await expect(timer).toHaveText(before ?? "");
  await expect(page.getByTestId("scene-briefing")).toBeVisible();
});
