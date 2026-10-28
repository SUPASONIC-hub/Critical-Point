import { expect, test } from "./helpers/network.js";
import { LOCALE_KEY } from "../src/appConfig.js";

/**
 * The language choice on the intro (LanguagePicker.jsx, 다국어 틀): a
 * button per language, each named in its own language. Choosing English
 * keeps the choice on the device and opens the page again in English -- the
 * start button, the header and the case list in English (open to the end of
 * the season since 10-28, so no preview line) -- a reload stays there,
 * and choosing 한국어 brings the Korean page back as it was.
 */
test("the intro's language choice opens English, keeps it through a reload and returns to Korean", async ({ page }) => {
  await page.goto("/");
  const picker = page.getByRole("navigation", { name: "언어 · Language" });
  await expect(picker.getByRole("button", { name: "한국어" })).toHaveAttribute("aria-pressed", "true");
  await expect(picker.getByRole("button", { name: "English" })).toHaveAttribute("lang", "en");
  await expect(picker.getByRole("button", { name: "日本語" })).toHaveAttribute("lang", "ja");
  await expect(page.locator(".case-card", { hasText: "프롤로그 01" }).first()).toBeVisible();
  await expect(page.getByTestId("start-first-case")).toContainText("프롤로그 시작");

  await picker.getByRole("button", { name: "English" }).click();
  await expect(page).toHaveURL(/[?&]lang=en\b/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByTestId("language-preview-note")).toHaveCount(0);
  await expect(page.locator(".case-card", { hasText: "Prologue 01" }).first()).toBeVisible();
  // The screen's own words too (src/copy/intro.js under the English dictionary).
  await expect(page.getByTestId("start-first-case")).toContainText("Start the prologue");
  await expect(page.locator(".intro .top-actions").getByRole("button", { name: "Ranking" })).toBeVisible();
  // Polled: the choice reloads the page, and a read that lands mid-navigation is asked again.
  await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), LOCALE_KEY)).toBe("en");

  // The policy links open the English pages (scripts/legal-pages.mjs, /en/).
  await expect(page.locator('a[href="/en/privacy.html"]').first()).toBeAttached();
  await expect(page.locator('a[href="/privacy.html"]')).toHaveCount(0);

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("navigation", { name: "언어 · Language" }).getByRole("button", { name: "English" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".case-card", { hasText: "Prologue 01" }).first()).toBeVisible();
  // The ranking screen's words too (src/copy/ranking.js, 영어판 3단계).
  await page.locator(".intro .top-actions").getByRole("button", { name: "Ranking" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Where did thinking stretch the furthest?" })).toBeVisible();
  await page.getByRole("button", { name: "Back to the briefing" }).click();

  await page.getByRole("navigation", { name: "언어 · Language" }).getByRole("button", { name: "한국어" }).click();
  await expect(page).not.toHaveURL(/lang=/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ko");
  await expect(page.getByTestId("language-preview-note")).toHaveCount(0);
  await expect(page.locator(".case-card", { hasText: "프롤로그 01" }).first()).toBeVisible();
  await expect(page.getByTestId("start-first-case")).toContainText("프롤로그 시작");
});
