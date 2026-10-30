import { expect, test } from "./helpers/network.js";

/**
 * The plain pages beside the build -- the privacy policy and the terms of use
 * (scripts/legal-pages.mjs), the about, FAQ and contact pages
 * (scripts/site-pages.mjs) -- open from the start screen, its foot and the
 * data drawer's note, in the screen's language, and lead to each other, to
 * the other languages and back to the game. The dev server answers them from
 * the same source the build writes them from (`staticPages()` in
 * vite.config.js); the @prod test reads the fifteen files, robots.txt and the
 * sitemap off the build.
 */
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

  await page.getByRole("navigation").getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en\/privacy\.html$/);
  await expect(page.getByRole("heading", { level: 1, name: "Privacy Policy" })).toBeVisible();

  await page.getByRole("navigation").getByRole("link", { name: "Terms of Use" }).click();
  await expect(page).toHaveURL(/\/en\/terms\.html$/);
  await expect(page.getByRole("heading", { level: 1, name: "Terms of Use" })).toBeVisible();

  await page.getByRole("navigation").getByRole("link", { name: "한국어" }).click();
  await expect(page).toHaveURL(/\/terms\.html$/);
  await expect(page.getByRole("heading", { level: 1, name: "이용약관" })).toBeVisible();

  await page.getByRole("navigation").getByRole("link", { name: "게임으로 돌아가기" }).click();
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
    await expect(page.locator("footer").getByRole("link", { name: "from.logic.to.magic@gmail.com" })).toBeVisible();
    await page.getByRole("navigation").getByRole("link", { name: "게임으로 돌아가기" }).click();
    await expect(page.locator(".intro")).toBeVisible();
  }

  // English: the FAQ, its header to the contact page, the Japanese contact page, and back to the game in Japanese.
  await page.goto("/?lang=en");
  await page.locator(".intro-legal").getByRole("link", { name: "FAQ", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/faq\.html$/);
  await expect(page.getByRole("heading", { level: 1, name: "FAQ" })).toBeVisible();
  await page.getByRole("navigation").getByRole("link", { name: "Contact", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/contact\.html$/);
  await page.getByRole("navigation").getByRole("link", { name: "日本語" }).click();
  await expect(page).toHaveURL(/\/ja\/contact\.html$/);
  await expect(page.getByRole("heading", { level: 1, name: "お問い合わせ" })).toBeVisible();
  await page.getByRole("navigation").getByRole("link", { name: "ゲームに戻る" }).click();
  await expect(page).toHaveURL(/\/\?lang=ja$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
});

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
  expect(xml.match(/<url>/g)).toHaveLength(PAGES.length + 1);
  for (const [path] of PAGES) expect(xml, path).toContain(`<loc>${path}</loc>`);
});
