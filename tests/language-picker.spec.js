import { expect, test } from "./helpers/network.js";
import { LOCALE_KEY } from "../src/appConfig.js";
import introCopy from "../src/copy/intro.js";
import enIntro from "../src/locales/en/screens/intro.js";
import jaIntro from "../src/locales/ja/screens/intro.js";
import { bustStakedCard, dismissProtocolBreach, startFirstRun, TRANSITION_TIMEOUT_MS } from "./helpers/gameFlow.js";
import { openBrokenBoard } from "./helpers/layout.js";

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

/**
 * The English start screen carries no Korean (2026-11-04): the case cards went
 * through simplifyPlayerText, whose Korean UI words matched the English copy --
 * "Injustice / 믿음 / Helplessness", "This 시간 the agenda is liquidation".
 * Every text on the page and every tooltip is read, all the case cards with
 * it. Korean belongs in one place, the picker's 한국어 button, marked
 * lang="ko"; the brand's reading under the wordmark and on the case chip is
 * the page's own (Trigger Lab, the user's choice 2026-11-04). The <noscript>
 * page is not drawn.
 */
test("the English start screen prints no Korean, case cards and tooltips included", async ({ page }) => {
  await page.goto("/?lang=en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator(".case-card", { hasText: "Prologue 03" }).first()).toBeAttached();
  await expect(page.locator(".game-wordmark .wordmark-reading b")).toHaveText("Trigger Lab");
  const korean = await page.evaluate(() => {
    const hangul = /[가-힣]/;
    const found = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.parentElement.closest("[lang='ko'], script, style, noscript")) continue;
      if (hangul.test(node.textContent)) found.push(node.textContent.trim().slice(0, 80));
    }
    for (const element of document.body.querySelectorAll("[title]")) {
      if (!element.closest("[lang='ko']") && hangul.test(element.title)) found.push(`title: ${element.title.slice(0, 80)}`);
    }
    return found;
  });
  expect(korean).toEqual([]);
});

/**
 * A 320px phone (10-29): the third pill wrapped to a second row and covered
 * the brand row's chip. The three stay on one row, clear of the music
 * controls and above the brand row, in each language.
 */
for (const lang of ["ko", "en", "ja"]) {
  test(`the language pills stay one row above the brand row on a 320px phone (${lang})`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto(lang === "ko" ? "/" : `/?lang=${lang}`);
    const buttons = page.getByTestId("language-picker").getByRole("button");
    await expect(buttons).toHaveCount(3);
    const boxes = await buttons.evaluateAll((els) => els.map((el) => el.getBoundingClientRect().toJSON()));
    expect(new Set(boxes.map((box) => Math.round(box.top))).size).toBe(1);
    const brandTop = await page.locator(".intro .brand-row").evaluate((el) => el.getBoundingClientRect().top);
    const musicLeft = await page.locator(".music-controls").evaluate((el) => el.getBoundingClientRect().left);
    expect(Math.max(...boxes.map((box) => box.bottom))).toBeLessThanOrEqual(brandTop);
    expect(Math.max(...boxes.map((box) => box.right))).toBeLessThanOrEqual(musicLeft);
  });
}

// The browser tab (2026-11-04, en/ja scan before W47): /?lang=en kept
// index.html's Korean <title>, and the tab fell back to it whenever no screen
// held a title of its own (state/tabTitle.js). Each language's tab now reads
// the start screen's pageTitle, the start page's <title> in its folder too.
for (const [lang, title] of [["en", enIntro.pageTitle], ["ja", jaIntro.pageTitle]]) {
  test(`the tab carries the ${lang} title on the start screen, and again after a table (${lang}) @prod`, async ({ page }) => {
    test.setTimeout(90_000);
    await page.goto(`/?lang=${lang}`);
    await expect(page.locator("html")).toHaveAttribute("lang", lang);
    await expect(page).toHaveTitle(title);
    await startFirstRun(page);
    await dismissProtocolBreach(page);
    await expect(page.locator(".choices .choice").first()).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
    await expect(page).not.toHaveTitle(introCopy.pageTitle);
    // Save and leave for the start screen: the table's own title lets go.
    await page.locator('.compact-actions button[aria-keyshortcuts="Shift+P"]').click();
    await expect(page.locator(".intro")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
    await expect(page).toHaveTitle(title);
  });
}

test("the Korean tab is index.html's title, as it was @prod", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".intro")).toBeVisible();
  await expect(page).toHaveTitle(introCopy.pageTitle);
});

// The tab while a table runs (gauntlet/tableTabTitle.js; 개선 포인트 A3, user
// decision 11-05): a board dealt 8 short of the wall band's low edge, the most
// a board can start with, so the first push can already reach it -- the tab
// counts to the band before the page's title. A bust is 징계 회부, held through
// the reveal and the next window's briefing, and the next table lets it go.
// No creep, so the count holds at 8 until a push; the cards are staked from
// the keyboard, as a card on a hot table beats and never holds still for a
// click (the creep busted the table while a click waited, 11-05).
test("the tab counts to the wall band on a hot table, says 징계 회부 after a bust, and lets it go on the next table", async ({ page }) => {
  test.setTimeout(90_000);
  await openBrokenBoard(page, "case01", "start", { schema: { startGauge: 48, creep: 0 } });
  await expect(page).toHaveTitle(`⚠ 벽까지 8 · ${introCopy.pageTitle}`, { timeout: TRANSITION_TIMEOUT_MS });
  await page.locator("body").click({ position: { x: 2, y: 2 } });
  await page.keyboard.press("1");
  await expect(page.locator(".gx-card.selected")).toHaveCount(1);
  await bustStakedCard(page);
  const referral = `[징계 회부] ${introCopy.pageTitle}`;
  await expect(page).toHaveTitle(referral);
  await page.getByTestId("decision-next").click();
  // The next window's briefing: the referral stays until that table opens.
  await expect(page).toHaveTitle(referral);
  await dismissProtocolBreach(page);
  await page.locator(".choices .choice").first().click({ force: true });
  await expect(page).not.toHaveTitle(/징계 회부/, { timeout: TRANSITION_TIMEOUT_MS });
});

/**
 * N3 (2026-11-12): a visit from a shared card's address (`/?from=card&h=<id>`,
 * src/shareLink.js) reads 「친구의 결과: …」 on the start screen, the habit's
 * name in the page's own language. An id that is not a habit's, or anything
 * that is not an id, prints nothing, and a plain visit has no line.
 */
test("a shared card's address names the friend's habit on the start screen, and nothing else does", async ({ page }) => {
  const line = page.getByTestId("friend-result-line");
  await page.goto("/?from=card&h=moth");
  await expect(line).toHaveText("친구의 결과: 하이리스크 불나방형");
  await expect(page.getByTestId("start-first-case")).toBeVisible();

  await page.goto("/?from=card&h=moth&lang=en");
  await expect(line).toHaveText("Your friend's result: High-Risk Moth");
  await page.goto("/?from=card&h=moth&lang=ja");
  await expect(line).toHaveText("友だちの結果：ハイリスク夏の虫型");

  for (const address of ["/?from=card&h=nobody", "/?from=card&h=%3Cimg%20src%3Dx%3E", "/?h=moth", "/?from=card", "/"]) {
    await page.goto(address);
    await expect(page.getByTestId("start-first-case")).toBeVisible();
    // Past the habits table's fetch, which an id-shaped address makes.
    await page.waitForLoadState("networkidle");
    await expect(line, address).toHaveCount(0);
  }
});
