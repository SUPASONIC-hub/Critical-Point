import { expect, test } from "./helpers/network.js";

/**
 * The start screen's own storage line (src/shellNotices.js): a device that
 * cannot keep the save is told so in the page's language. It used to be
 * written in Korean in AppContent.jsx, on every page.
 */
const LINES = {
  ko: "브라우저 저장소를 사용할 수 없어 현재 상태만 진행합니다.",
  en: "Browser storage isn’t available, so only the current session continues.",
  ja: "ブラウザのストレージを使えないため、現在の状態だけで進めます。",
};

for (const [lang, line] of Object.entries(LINES)) {
  test(`the start screen says storage is unavailable in ${lang}`, async ({ page }) => {
    await page.addInitScript(() => {
      const setItem = Storage.prototype.setItem;
      Storage.prototype.setItem = function guardedSetItem(key, value) {
        if (key === "trigger-prototype-v2") throw new DOMException("Storage full", "QuotaExceededError");
        return setItem.call(this, key, value);
      };
    });
    await page.goto(lang === "ko" ? "/" : `/?lang=${lang}`);
    await expect(page.locator("html")).toHaveAttribute("lang", lang);
    await expect(page.locator(".intro")).toBeVisible();
    await page.locator("details.intro-drawer:has(.play-style-panel)").evaluate((drawer) => {
      drawer.open = true;
    });
    await page.locator(".play-style-panel .play-style").nth(1).click();
    await expect(page.locator(".intro-shell .save-status")).toHaveText(line);
  });
}
