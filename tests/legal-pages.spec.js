import { expect, test } from "./helpers/network.js";
import { CONTENT_KINDS } from "../scripts/content-pages/pages.mjs";

/**
 * The plain pages beside the build -- the privacy policy and the terms of use
 * (scripts/legal-pages.mjs), the about, FAQ and contact pages
 * (scripts/site-pages.mjs) -- open from the start screen, its foot and the
 * data drawer's note, in the screen's language, and lead to each other, to
 * the other languages and back to the game. The dev server answers them from
 * the same source the build writes them from (`staticPages()` in
 * vite.config.js); the @prod test reads the fifteen files, robots.txt and the
 * sitemap off the build. Since 11-09 every plain page carries the site menu
 * at its head and its foot (scripts/content-pages/site-nav.mjs): the head's
 * is the first `nav` and is named 사이트 메뉴 / Site menu / サイトメニュー.
 */
const MENU = { ko: "사이트 메뉴", en: "Site menu", ja: "サイトメニュー" };
const menu = (page, language) => page.getByRole("navigation", { name: MENU[language], exact: true });
const HEADINGS = {
  ko: { about: "게임 소개", faq: "자주 묻는 질문", contact: "문의", privacy: "개인정보처리방침", terms: "이용약관" },
  en: { about: "About", faq: "FAQ", contact: "Contact", privacy: "Privacy Policy", terms: "Terms of Use" },
  ja: { about: "ゲーム紹介", faq: "よくある質問", contact: "お問い合わせ", privacy: "プライバシーポリシー", terms: "利用規約" },
};
const FOLDER = { ko: "", en: "/en", ja: "/ja" };
const PAGES = Object.entries(HEADINGS).flatMap(([language, pages]) =>
  Object.entries(pages).map(([kind, heading]) => [`${FOLDER[language]}/${kind}.html`, heading]),
);

test("the policy pages open from the start screen and lead to each other and back", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".intro")).toBeVisible();

  await page.locator(".intro-legal").getByRole("link", { name: "개인정보처리방침" }).click();
  await expect(page).toHaveURL(/\/privacy\.html$/);
  await expect(page.getByRole("heading", { level: 1, name: "개인정보처리방침" })).toBeVisible();
  await expect(page.getByRole("link", { name: "from.logic.to.magic@gmail.com" }).first()).toBeVisible();

  await menu(page, "ko").getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en\/privacy\.html$/);
  await expect(page.getByRole("heading", { level: 1, name: "Privacy Policy" })).toBeVisible();

  await menu(page, "en").getByRole("link", { name: "Terms", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/terms\.html$/);
  await expect(page.getByRole("heading", { level: 1, name: "Terms of Use" })).toBeVisible();

  await menu(page, "en").getByRole("link", { name: "한국어" }).click();
  await expect(page).toHaveURL(/\/terms\.html$/);
  await expect(page.getByRole("heading", { level: 1, name: "이용약관" })).toBeVisible();

  await menu(page, "ko").getByRole("link", { name: "게임 시작" }).click();
  await expect(page.locator(".intro")).toBeVisible();

  // The data drawer's note links the same two pages.
  await page.locator("#data-info > summary").click();
  await page.locator(".privacy-note").getByRole("link", { name: "이용약관" }).click();
  await expect(page).toHaveURL(/\/terms\.html$/);
  await expect(page.getByRole("heading", { level: 1, name: "이용약관" })).toBeVisible();
});

test("the start screen's foot opens the five pages in the screen's language, and each leads back", async ({ page }) => {
  for (const language of ["ko", "en", "ja"]) {
    await page.goto(language === "ko" ? "/" : `/?lang=${language}`);
    await expect(page.locator("html")).toHaveAttribute("lang", language);
    const foot = page.locator(".intro-legal");
    await expect(foot.getByRole("link")).toHaveCount(5);
    for (const [kind, heading] of Object.entries(HEADINGS[language])) {
      await expect(foot.getByRole("link", { name: heading, exact: true })).toHaveAttribute("href", `${FOLDER[language]}/${kind}.html`);
    }
  }

  // Korean: the three pages about the game open from the foot, one after another.
  await page.goto("/");
  for (const kind of ["about", "faq", "contact"]) {
    await page.locator(".intro-legal").getByRole("link", { name: HEADINGS.ko[kind], exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/${kind}\\.html$`));
    await expect(page.getByRole("heading", { level: 1, name: HEADINGS.ko[kind] })).toBeVisible();
    // exact: the credit under it names each creator's address for its owner ("SUPASONIC: from.logic...").
    await expect(page.locator("footer").getByRole("link", { name: "from.logic.to.magic@gmail.com", exact: true })).toBeVisible();
    await menu(page, "ko").getByRole("link", { name: "게임 시작" }).click();
    await expect(page.locator(".intro")).toBeVisible();
  }

  // English: the FAQ, its header to the contact page, the Japanese contact page, and back to the game in Japanese.
  await page.goto("/?lang=en");
  await page.locator(".intro-legal").getByRole("link", { name: "FAQ", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/faq\.html$/);
  await expect(page.getByRole("heading", { level: 1, name: "FAQ" })).toBeVisible();
  await menu(page, "en").getByRole("link", { name: "Contact", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/contact\.html$/);
  await menu(page, "en").getByRole("link", { name: "日本語" }).click();
  await expect(page).toHaveURL(/\/ja\/contact\.html$/);
  await expect(page.getByRole("heading", { level: 1, name: "お問い合わせ" })).toBeVisible();
  await menu(page, "ja").getByRole("link", { name: "ゲームを始める" }).click();
  await expect(page).toHaveURL(/\/ja\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
});

// The credit (2026-11-04, the studio's three names 2026-11-05): SUPASONIC & ALICE, and each one's
// address as a link named for its owner, on the start screen and at the foot
// of the plain pages, inside a 360px phone in every language.
const CREATOR_MAILS = [
  ["SUPASONIC", "from.logic.to.magic@gmail.com"],
  ["ALICE", "goeun.nam@gmail.com"],
];

const STUDIO_NAMES = { ko: "찹쌀떡 스튜디오", en: "Mochi Verse Studio", ja: "STUDIOもちぷよ" };

async function expectCredit(credit, page, language = "ko") {
  await expect(credit.locator("dt")).toHaveText(["STUDIO", "CREATOR", "CONTACT"]);
  await expect(credit.locator("dd").nth(0)).toHaveText(STUDIO_NAMES[language]);
  await expect(credit.locator("dd").nth(1)).toHaveText("SUPASONIC & ALICE");
  for (const [name, email] of CREATOR_MAILS) {
    await expect(credit.getByRole("link", { name: `${name}: ${email}`, exact: true })).toHaveAttribute("href", `mailto:${email}`);
  }
  await credit.scrollIntoViewIfNeeded();
  const box = await credit.boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(360);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
}

for (const language of ["ko", "en", "ja"]) {
  test(`the credit names both creators with their mail links, inside a 360px phone (${language})`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto(language === "ko" ? "/" : `/?lang=${language}`);
    await expect(page.locator("html")).toHaveAttribute("lang", language);
    await expectCredit(page.locator(".intro .studio-credit"), page, language);
    await page.goto(`${FOLDER[language]}/about.html`);
    await expectCredit(page.locator("footer .credit"), page, language);
  });
}

test("the build writes the fifteen pages, robots.txt and the sitemap as plain files", { tag: "@prod" }, async ({ request }) => {
  test.skip(process.env.E2E_SERVER !== "preview", "this reads the production build: npm run test:e2e:preview");
  for (const [path, heading] of PAGES) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect(response.headers()["content-type"], path).toMatch(/text\/html/);
    const html = await response.text();
    expect(html, path).toContain(`<h1>${heading}</h1>`);
    expect(html, path).not.toMatch(/<script\b/i);
  }
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toMatch(/^User-agent: \*\nAllow: \/\n/);
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  // The fifteen, the start page in three languages and the content pages (scripts/content-pages).
  expect(xml.match(/<url>/g)).toHaveLength(PAGES.length + 3 + CONTENT_KINDS.length * 3);
  for (const [path] of PAGES) expect(xml, path).toContain(`<loc>${path}</loc>`);
  for (const path of ["/", "/en/", "/ja/"]) expect(xml, path).toContain(`<loc>${path}</loc>`);
  // The content pages are plain files too, at their own addresses, and in the sitemap.
  for (const [path, heading] of [
    ["/guide.html", "게임 방법"],
    ["/en/cases/index.html", "Case Files"],
    ["/ja/characters.html", "登場人物"],
    ["/cases/case01.html", "사건 01 · 72시간"],
    ["/en/making.html", "How We Made It"],
  ]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect(response.headers()["content-type"], path).toMatch(/text\/html/);
    expect(await response.text(), path).toContain(`<h1>${heading}</h1>`);
    expect(xml, path).toContain(`<loc>${path}</loc>`);
  }
});

// The start page in English and Japanese (11-03): its own file at its folder,
// read with no script as a crawler reads it, and the game in that language
// once the script runs.
for (const [language, start, title] of [
  ["en", "Start the prologue", "Critical Point - Every 45 seconds, your judgment goes on the record"],
  ["ja", "プロローグを始める", "臨界点: CRITICAL POINT - 45秒ごとに、あなたの判断基準が記録される"],
]) {
  test(`/${language}/ is the start page in its language, to a crawler and to a player`, async ({ page, request }) => {
    const response = await request.get(`/${language}/`);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toMatch(new RegExp(`<html lang="${language}">`));
    expect(html).toContain(`<title>${title}</title>`);
    expect(html).toMatch(new RegExp(`<link rel="canonical" href="[^"]*/${language}/"`));
    await page.goto(`/${language}/`);
    await expect(page.locator("html")).toHaveAttribute("lang", language);
    await expect(page.getByTestId("start-first-case")).toContainText(start);
    await expect(page.locator(".intro-legal").getByRole("link").first()).toHaveAttribute("href", `/${language}/about.html`);
  });
}
