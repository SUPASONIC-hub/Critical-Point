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

// The report queue (admin_board_queue): one post the reports hid, one still on the board.
const queue = [
  { ...posts[1], writer_count: 3, reasons: ["abuse", "spam"], first_report_at: "2026-11-14T00:30:00Z" },
  { id: 9, nickname: "손님", body: "신고 하나 받은 글", created_at: "2026-11-13T00:00:00Z", hidden: false, auto_hidden_at: null, kept_at: null, report_count: 1, same_writer_count: 1, writer_count: 1, reasons: ["privacy"], first_report_at: "2026-11-15T00:00:00Z" },
];
const adminLog = [
  { id: 2, at: "2026-11-16T02:00:00Z", admin_email: "goeun.nam@gmail.com", action: "restore", post_id: 7, detail: {} },
  { id: 1, at: "2026-11-16T01:00:00Z", admin_email: "from.logic.to.magic@gmail.com", action: "delete", post_id: 6, detail: {} },
];
const adminSession = (email = "goeun.nam@gmail.com") => ({
  access_token: accessToken(email),
  refresh_token: "r1",
  token_type: "bearer",
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  user: { email },
});

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
  const decided = new Set();
  await page.route(`${SUPABASE}/**`, (route) => route.fulfill(json([])));
  await page.route(`${SUPABASE}/rest/v1/rpc/admin_board_*`, async (route) => {
    const name = new URL(route.request().url()).pathname.split("/").pop();
    calls.push({ name, body: route.request().postDataJSON(), auth: route.request().headers().authorization });
    if (name === "admin_board_me") return route.fulfill(json(me));
    if (name === "admin_board_search" || name === "admin_board_same_writer") return route.fulfill(json(posts));
    if (name === "admin_board_queue") return route.fulfill(json(queue.filter((row) => !decided.has(row.id))));
    if (name === "admin_board_queue_count") return route.fulfill(json(queue.filter((row) => !decided.has(row.id)).length));
    if (name === "admin_board_log") return route.fulfill(json(adminLog));
    if (name === "admin_board_set_hidden") decided.add(route.request().postDataJSON().p_post_id);
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
  await useMockSupabase(page, { session: adminSession() });
  const calls = await routeAdmin(page, { me: false });
  await page.goto("/?admin");
  await expect(page.getByTestId("board-admin-status")).toContainText("goeun.nam@gmail.com 계정은 게시판 관리자가 아닙니다");
  await page.getByRole("button", { name: "닫기" }).click();
  await page.getByRole("button", { name: "게시판" }).first().click();
  await expect(page.locator(".board-page")).toBeVisible();
  await expect(page.getByTestId("board-admin-bar")).toHaveCount(0);
  expect(calls.map((call) => call.name)).toEqual(["admin_board_me"]);
});

test("the admin bar counts the waiting posts, decides them, and reads the admin log", async ({ page }) => {
  await useMockSupabase(page, { session: adminSession() });
  const calls = await routeAdmin(page);
  await page.goto("/");
  await page.getByRole("button", { name: "게시판" }).first().click();
  const bar = page.getByTestId("board-admin-bar");
  await expect(bar).toBeVisible();
  await expect(bar.getByTestId("board-admin-waiting")).toHaveText("신고 대기 2건");

  await bar.getByRole("tab", { name: "신고 대기" }).click();
  await expect(bar.getByRole("tab", { name: "신고 대기" })).toHaveAttribute("aria-selected", "true");
  const rows = bar.getByTestId("board-admin-queue-post");
  await expect(rows).toHaveCount(2);
  await expect(page.getByTestId("board-admin-message")).toContainText("기다리는 글 2개");
  expect(calls.find((call) => call.name === "admin_board_queue")?.body).toEqual({ p_limit: 50 });
  await expect(rows.first()).toContainText("신고로 자동 숨김");
  await expect(rows.first()).toContainText("신고한 사람 3");
  await expect(rows.first()).toContainText("욕설·괴롭힘 · 광고·도배");
  await expect(rows.nth(1)).toContainText("보이는 중");
  await expect(rows.nth(1)).toContainText("개인정보 노출");
  await expect(rows.first().getByRole("button", { name: "되살리기" })).toBeVisible();
  await expect(rows.nth(1).getByRole("button", { name: "그대로 두기" })).toBeVisible();

  await rows.first().getByRole("button", { name: "숨기기 확정" }).click();
  await expect(page.getByTestId("board-admin-message")).toContainText("#11을 숨겼습니다");
  expect(calls.filter((call) => call.name === "admin_board_set_hidden").at(-1)?.body).toEqual({ p_post_id: 11, p_hidden: true });
  await expect(rows).toHaveCount(1);
  await expect(bar.getByTestId("board-admin-waiting")).toHaveText("신고 대기 1건");

  await rows.first().getByRole("button", { name: "그대로 두기" }).click();
  await expect(page.getByTestId("board-admin-message")).toContainText("#9을 그대로 두었습니다");
  expect(calls.filter((call) => call.name === "admin_board_set_hidden").at(-1)?.body).toEqual({ p_post_id: 9, p_hidden: false });
  await expect(rows).toHaveCount(0);
  await expect(bar.getByTestId("board-admin-waiting")).toHaveCount(0);

  await bar.getByRole("tab", { name: "관리 기록" }).click();
  const log = bar.getByTestId("board-admin-log-row");
  await expect(log).toHaveCount(2);
  await expect(log.first()).toContainText("되살림");
  await expect(log.first()).toContainText("#7");
  await expect(log.first()).toContainText("goeun.nam@gmail.com");
  await expect(log.nth(1)).toContainText("영구 삭제");
  expect(calls.find((call) => call.name === "admin_board_log")?.body).toEqual({ p_limit: 50 });

  await bar.getByRole("tab", { name: "글 검색" }).click();
  await expect(bar.getByTestId("board-admin-post")).toHaveCount(2);
});
