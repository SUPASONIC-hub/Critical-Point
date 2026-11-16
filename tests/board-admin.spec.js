import { BACKEND_ORIGIN, expect, test } from "./helpers/network.js";

/**
 * The board's admin tools (src/boardAdmin.js, components/BoardAdmin.jsx), on
 * a backend that is all routes: Google's round trip is a redirect this spec
 * answers itself, and every RPC is a stub that records what it was sent. The
 * server's own gate is held by check:grants.
 */
const SUPABASE = BACKEND_ORIGIN;
const AUTH_KEY = "sb-e2e-auth-token";
const json = (body, status = 200) => ({ status, contentType: "application/json", body: JSON.stringify(body) });

const b64url = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
const accessToken = (email) =>
  `${b64url({ alg: "HS256" })}.${b64url({ sub: "u1", email, exp: Math.floor(Date.now() / 1000) + 3600, app_metadata: { provider: "google", providers: ["google"] } })}.sig`;

const posts = [
  { id: 12, nickname: "도배꾼", body: "광고 글", created_at: "2026-11-15T00:00:00Z", hidden: false, auto_hidden_at: null, kept_at: null, report_count: 3, same_writer_count: 2 },
  { id: 11, nickname: "도배꾼", body: "숨긴 글", created_at: "2026-11-14T00:00:00Z", hidden: true, auto_hidden_at: "2026-11-14T01:00:00Z", kept_at: null, report_count: 3, same_writer_count: 2 },
];

async function useMockSupabase(page, { session = null } = {}) {
  await page.addInitScript(
    ({ url, key, stored }) => {
      localStorage.setItem("critical-point-telemetry-url", url);
      localStorage.setItem("critical-point-telemetry-key", "anon");
      if (stored && !sessionStorage.getItem("seeded")) {
        localStorage.setItem(key, JSON.stringify(stored));
        sessionStorage.setItem("seeded", "1");
      }
    },
    { url: SUPABASE, key: AUTH_KEY, stored: session },
  );
}

/** Records each admin RPC's body; `me` is what admin_board_me answers. */
async function routeAdmin(page, { me = true } = {}) {
  const calls = [];
  await page.route(`${SUPABASE}/**`, (route) => route.fulfill(json([])));
  await page.route(`${SUPABASE}/rest/v1/rpc/admin_board_*`, async (route) => {
    const name = new URL(route.request().url()).pathname.split("/").pop();
    calls.push({ name, body: route.request().postDataJSON(), auth: route.request().headers().authorization });
    if (name === "admin_board_me") return route.fulfill(json(me));
    if (name === "admin_board_search" || name === "admin_board_same_writer") return route.fulfill(json(posts));
    return route.fulfill(json(true));
  });
  return calls;
}

test("a player's page fetches no admin code and the board has no admin bar", async ({ page }) => {
  await useMockSupabase(page);
  await routeAdmin(page);
  const adminRequests = [];
  page.on("request", (request) => {
    if (/BoardAdmin|boardAdmin\.js/.test(request.url())) adminRequests.push(request.url());
  });
  await page.goto("/");
  await expect(page.getByTestId("board-admin-sheet")).toHaveCount(0);
  await page.getByRole("button", { name: "게시판" }).first().click();
  await expect(page.locator(".board-page")).toBeVisible();
  await expect(page.getByTestId("board-admin-bar")).toHaveCount(0);
  expect(adminRequests).toEqual([]);
});

test("?admin signs in with Google, and the admin bar hides, restores and deletes", async ({ page, baseURL }) => {
  await useMockSupabase(page);
  const calls = await routeAdmin(page);
  const access = accessToken("goeun.nam@gmail.com");
  let redirectTo = "";
  await page.route(`${SUPABASE}/auth/v1/authorize**`, (route) => {
    const url = new URL(route.request().url());
    expect(url.searchParams.get("provider")).toBe("google");
    redirectTo = url.searchParams.get("redirect_to");
    return route.fulfill({ status: 302, headers: { location: `${redirectTo}#access_token=${access}&refresh_token=r1&expires_in=3600&token_type=bearer` } });
  });

  await page.goto("/?admin");
  const sheet = page.getByTestId("board-admin-sheet");
  await expect(sheet).toBeVisible();
  await sheet.getByTestId("board-admin-google").click();

  await expect(page.getByTestId("board-admin-status")).toContainText("goeun.nam@gmail.com 관리자 모드가 켜졌습니다");
  expect(redirectTo).toBe(`${new URL(baseURL).origin}/?admin`);
  await expect(page, "the tokens leave the address").toHaveURL(/\?admin$/);
  expect(await page.evaluate((key) => JSON.parse(localStorage.getItem(key)).refresh_token, AUTH_KEY)).toBe("r1");
  expect(calls.find((call) => call.name === "admin_board_me")?.auth).toBe(`Bearer ${access}`);

  await page.getByRole("button", { name: "게시판 열기" }).click();
  const bar = page.getByTestId("board-admin-bar");
  await expect(bar).toBeVisible();
  const rows = bar.getByTestId("board-admin-post");
  await expect(rows).toHaveCount(2);
  await expect(rows.first()).toContainText("신고 3");
  await expect(rows.nth(1)).toHaveClass(/is-hidden/);
  await expect(rows.nth(1)).toContainText("신고로 자동 숨김");

  await bar.getByRole("searchbox").fill("도배");
  await bar.getByRole("checkbox", { name: "숨긴 글 포함" }).uncheck();
  await bar.getByRole("button", { name: "검색", exact: true }).click();
  await expect.poll(() => calls.filter((call) => call.name === "admin_board_search").at(-1)?.body).toEqual({ p_query: "도배", p_include_hidden: false, p_limit: 30, p_before_id: null });

  await rows.first().getByRole("button", { name: "숨기기" }).click();
  await expect(page.getByTestId("board-admin-message")).toContainText("#12을 숨겼습니다");
  expect(calls.find((call) => call.name === "admin_board_set_hidden")?.body).toEqual({ p_post_id: 12, p_hidden: true });

  await rows.nth(1).getByRole("button", { name: "되살리기" }).click();
  await expect(page.getByTestId("board-admin-message")).toContainText("#11을 되살렸습니다");
  expect(calls.filter((call) => call.name === "admin_board_set_hidden").at(-1)?.body).toEqual({ p_post_id: 11, p_hidden: false });

  page.once("dialog", (dialog) => dialog.dismiss());
  await rows.first().getByRole("button", { name: "영구 삭제" }).click();
  expect(calls.some((call) => call.name === "admin_board_delete"), "a dismissed confirm deletes nothing").toBe(false);
  page.once("dialog", (dialog) => {
    expect(dialog.message()).toContain("#12 글을 영구 삭제합니다");
    return dialog.accept();
  });
  await rows.first().getByRole("button", { name: "영구 삭제" }).click();
  await expect(page.getByTestId("board-admin-message")).toContainText("#12을 영구 삭제했습니다");
  expect(calls.find((call) => call.name === "admin_board_delete")?.body).toEqual({ p_post_id: 12 });

  await rows.first().getByRole("button", { name: "같은 사람 글 2" }).click();
  await expect(page.getByTestId("board-admin-message")).toContainText("#12을 쓴 사람의 글 2개");
  expect(calls.find((call) => call.name === "admin_board_same_writer")?.body).toEqual({ p_post_id: 12 });

  await bar.getByRole("button", { name: "로그아웃" }).click();
  await expect(bar).toHaveCount(0);
  expect(await page.evaluate((key) => localStorage.getItem(key), AUTH_KEY)).toBeNull();
});

test("a signed-in account the server does not name gets no admin bar", async ({ page }) => {
  await useMockSupabase(page, {
    session: { access_token: accessToken("goeun.nam@gmail.com"), refresh_token: "r1", token_type: "bearer", expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, user: { email: "goeun.nam@gmail.com" } },
  });
  const calls = await routeAdmin(page, { me: false });
  await page.goto("/?admin");
  await expect(page.getByTestId("board-admin-status")).toContainText("goeun.nam@gmail.com 계정은 게시판 관리자가 아닙니다");
  await page.getByRole("button", { name: "닫기" }).click();
  await page.getByRole("button", { name: "게시판" }).first().click();
  await expect(page.locator(".board-page")).toBeVisible();
  await expect(page.getByTestId("board-admin-bar")).toHaveCount(0);
  expect(calls.map((call) => call.name)).toEqual(["admin_board_me"]);
});
