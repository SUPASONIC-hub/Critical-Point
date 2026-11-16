import { expect, test } from "./helpers/network.js";

/**
 * 개선 포인트 E2: with JavaScript off the start page is not a black screen.
 * Each of the three start pages shows, from HTML and inline CSS alone, a line
 * in the game's world, the plain fact, and each browser's official help page
 * in the page's language (scripts/site-pages.mjs `startNoscript`; the words
 * themselves are held by tests/unit/start-pages.test.mjs). This is the one
 * place a real browser with scripts off reads them.
 */
const PAGES = {
  ko: { path: "/", world: "분석관 단말이 실행 승인을 받지 못했습니다", fact: "자바스크립트를 켠 뒤 다시 열어 주세요", samsung: "삼성 인터넷" },
  en: { path: "/en/", world: "The analyst's terminal was not cleared to run", fact: "Turn JavaScript on in your browser settings", samsung: "Samsung Internet" },
  ja: { path: "/ja/", world: "分析官の端末が実行の承認を得られませんでした", fact: "JavaScriptをオンにしてから", samsung: "Samsung Internet" },
};
const HELP = {
  Chrome: "support.google.com",
  "Safari (iPhone)": "support.apple.com",
  Firefox: "support.mozilla.org",
  Edge: "support.microsoft.com",
};

test.use({ javaScriptEnabled: false });

for (const [language, copy] of Object.entries(PAGES)) {
  test(`with JavaScript off, ${copy.path} says why in its own words and links each browser's help (${language})`, { tag: "@once" }, async ({ page }) => {
    await page.goto(copy.path);
    // Playwright's text engine skips what sits inside <noscript>, so the block
    // is found by place and its words read with toContainText; links by role.
    const block = page.locator("body > noscript > div");
    await expect(block).toBeVisible();
    await expect(block).toContainText(copy.world);
    await expect(block).toContainText(copy.fact);
    for (const [name, host] of Object.entries(HELP)) {
      const link = page.getByRole("link", { name, exact: true });
      await expect(link).toBeVisible();
      expect(new URL(await link.getAttribute("href")).hostname).toBe(host);
    }
    await expect(page.getByRole("link", { name: copy.samsung, exact: true })).toBeVisible();
  });
}
