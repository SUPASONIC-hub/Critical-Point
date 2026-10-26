import { expect, test } from "./helpers/network.js";
import { LOCALE_KEY } from "../src/appConfig.js";

/**
 * The language choice on the intro (LanguagePicker.jsx, 다국어 틀): a
 * button per language, each named in its own language. Choosing English
 * keeps the choice on the device and opens the page again in English -- the
 * case list in English and the preview's one line -- a reload stays there,
 * and choosing 한국어 brings the Korean page back as it was.
 */
test("the intro's language choice opens English, keeps it through a reload and returns to Korean", async ({ page }) => {
  await page.goto("/");
  const picker = page.getByRole("navigation", { name: "언어 · Language" });
  await expect(picker.getByRole("button", { name: "한국어" })).toHaveAttribute("aria-pressed", "true");
  await expect(picker.getByRole("button", { name: "English" })).toHaveAttribute("lang", "en");
  await expect(page.locator(".case-card", { hasText: "프롤로그 01" }).first()).toBeVisible();

  await picker.getByRole("button", { name: "English" }).click();
  await expect(page).toHaveURL(/[?&]lang=en\b/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByTestId("language-preview-note")).toHaveText(/English is a preview/);
  await expect(page.locator(".case-card", { hasText: "Prologue 01" }).first()).toBeVisible();
  expect(await page.evaluate((key) => localStorage.getItem(key), LOCALE_KEY)).toBe("en");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("navigation", { name: "언어 · Language" }).getByRole("button", { name: "English" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".case-card", { hasText: "Prologue 01" }).first()).toBeVisible();

  await page.getByRole("navigation", { name: "언어 · Language" }).getByRole("button", { name: "한국어" }).click();
  await expect(page).not.toHaveURL(/lang=/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ko");
  await expect(page.getByTestId("language-preview-note")).toHaveCount(0);
  await expect(page.locator(".case-card", { hasText: "프롤로그 01" }).first()).toBeVisible();
});
