import { expect, test } from "./helpers/network.js";

/**
 * The privacy policy and the terms of use (scripts/legal-pages.mjs) open from
 * the start screen -- its foot and the data drawer's note -- and lead to each
 * other, to the other language and back to the game. The dev server answers
 * them from the same source the build writes them from (`legalPages()` in
 * vite.config.js); the @prod test reads the six files off the build.
 */
const PAGES = [
  ["/privacy.html", "개인정보처리방침"],
  ["/terms.html", "이용약관"],
  ["/en/privacy.html", "Privacy Policy"],
  ["/en/terms.html", "Terms of Use"],
  ["/ja/privacy.html", "プライバシーポリシー"],
  ["/ja/terms.html", "利用規約"],
];

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

test("the build writes the six pages as plain files", { tag: "@prod" }, async ({ request }) => {
  test.skip(process.env.E2E_SERVER !== "preview", "this reads the production build: npm run test:e2e:preview");
  for (const [path, heading] of PAGES) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect(response.headers()["content-type"], path).toMatch(/text\/html/);
    const html = await response.text();
    expect(html, path).toContain(`<h1>${heading}</h1>`);
    expect(html, path).not.toMatch(/<script\b/i);
  }
});
