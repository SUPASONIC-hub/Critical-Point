import { BACKEND_ORIGIN, expect, test } from "./helpers/network.js";

import { BOARD_WRITER_ID_KEY } from "../src/appConfig.js";

/**
 * The two screens that show what other players sent: the 참가자 게시판 and the
 * ranking. Neither had a browser test of its own -- the board none at all.
 */

const SUPABASE = BACKEND_ORIGIN;

async function useMockSupabase(page) {
  await page.addInitScript((url) => {
    localStorage.setItem("critical-point-telemetry-url", url);
    localStorage.setItem("critical-point-telemetry-key", "anon");
  }, SUPABASE);
}

const json = (body, status = 200) => ({ status, contentType: "application/json", body: JSON.stringify(body) });

/**
 * The board counts seconds -- three before a first post, thirty between two.
 * The page's clock is moved past each wait by hand and never held still: the
 * screens do not mount on a stopped clock, and a wait that is only ever
 * lengthened cannot be lost to a busy machine.
 */
async function openBoard(page) {
  await page.goto("/");
  await page.getByRole("button", { name: "게시판" }).first().click();
  await expect(page.locator(".board-page")).toBeVisible();
}

/**
 * 글 남기기 while a press cannot do anything: blocked, not disabled. It stays in
 * the tab order and is described by the line that says why, where a `disabled`
 * button was skipped by Tab with the reason left unsaid.
 */
async function expectBlockedAndExplained(page, reason) {
  const submit = page.getByRole("button", { name: "글 남기기" });
  await expect(submit).toHaveAttribute("aria-disabled", "true");
  await expect(submit).toHaveJSProperty("disabled", false);
  await expect(submit).toHaveAttribute("aria-describedby", "board-post-status");
  await submit.focus();
  await expect(submit, "a keyboard can still reach it").toBeFocused();
  await expect(page.locator("#board-post-status")).toContainText(reason);
}

test("the board takes a post, says so aloud, and files it under its own id", async ({ page }) => {
  const posts = [{ id: 1, nickname: "먼저 온 사람", body: "끝까지 가 보세요.", created_at: "2026-09-27T09:00:00Z" }];
  const written = [];
  // Playwright tries the most recently added route first, so the catch-all goes in first.
  await page.route(`${SUPABASE}/**`, (route) => route.fulfill(json([])));
  await page.route(`${SUPABASE}/rest/v1/board_posts**`, async (route) => {
    if (route.request().method() === "POST") {
      const body = route.request().postDataJSON();
      written.push(body);
      posts.unshift({ id: posts.length + 1, nickname: body.nickname, body: body.body, created_at: new Date().toISOString() });
      await route.fulfill({ status: 201, body: "" });
      return;
    }
    await route.fulfill(json(posts));
  });
  await useMockSupabase(page);
  await page.clock.install();
  await openBoard(page);

  await expect(page.getByRole("heading", { level: 1, name: "남겨두고 가는 말" })).toBeFocused();
  await expect(page.locator(".board-post")).toHaveCount(1);
  const status = page.getByTestId("board-post-status");
  await expect(status).toHaveAttribute("role", "status");

  await page.getByPlaceholder("게시판에 보일 이름").fill("분석관 김");
  await page.getByPlaceholder(/사건을 지나며/).fill("310억이 아직도 생각납니다.");
  await page.clock.runFor(4_000);
  await page.getByRole("button", { name: "글 남기기" }).click();
  await expect(status).toHaveText("글을 올렸습니다.");
  await expect(page.locator(".board-post")).toHaveCount(2);
  expect(written).toHaveLength(1);
  expect(written[0].body).toBe("310억이 아직도 생각납니다.");

  // The board publishes a name, so it is filed under the board's own id and
  // not the one telemetry and the ranking use.
  const boardWriter = await page.evaluate((key) => localStorage.getItem(key), BOARD_WRITER_ID_KEY);
  expect(boardWriter).toMatch(/^.{8,128}$/);
  expect(written[0].session_id).toBe(boardWriter);

  // A link is refused before it reaches the network, particle attached or not.
  await page.clock.runFor(31_000);
  await page.getByPlaceholder(/사건을 지나며/).fill("후기는 spam.com으로 오세요");
  await page.getByRole("button", { name: "글 남기기" }).click();
  await expect(status).toContainText("링크가 들어간 글은 올릴 수 없습니다");
  expect(written).toHaveLength(1);
});

// The server takes the same words from the same device again for six hours and
// stores nothing. The page remembered its posts only until it was reloaded.
test("the same words posted again after a reload are not sent, and the person is told", async ({ page }) => {
  const written = [];
  await page.route(`${SUPABASE}/**`, (route) => route.fulfill(json([])));
  await page.route(`${SUPABASE}/rest/v1/board_posts**`, async (route) => {
    if (route.request().method() !== "POST") return route.fulfill(json([]));
    written.push(route.request().postDataJSON());
    return route.fulfill({ status: 201, body: "" });
  });
  await useMockSupabase(page);
  await page.clock.install();
  await openBoard(page);
  const status = page.getByTestId("board-post-status");
  await page.getByPlaceholder("게시판에 보일 이름").fill("분석관 김");
  await page.getByPlaceholder(/사건을 지나며/).fill("끝까지 왔습니다.");
  await page.clock.runFor(4_000);
  await page.getByRole("button", { name: "글 남기기" }).click();
  await expect(status).toHaveText("글을 올렸습니다.");
  expect(written).toHaveLength(1);

  await page.reload();
  await page.getByRole("button", { name: "게시판" }).first().click();
  await expect(page.locator(".board-page")).toBeVisible();
  await expect(page.getByPlaceholder("게시판에 보일 이름")).toHaveValue("분석관 김");
  await page.getByPlaceholder(/사건을 지나며/).fill("끝까지 왔습니다.");
  await page.clock.runFor(4_000);
  await page.getByRole("button", { name: "글 남기기" }).click();
  await expect(page.getByTestId("board-post-status")).toContainText("같은 글을 이미 올렸습니다");
  await expect(page.getByPlaceholder(/사건을 지나며/), "the words are still in the box").toHaveValue("끝까지 왔습니다.");
  expect(written, "nothing was sent to be dropped").toHaveLength(1);

  // Other words from the same device go up.
  await page.getByPlaceholder(/사건을 지나며/).fill("다른 말도 남깁니다.");
  await page.clock.runFor(31_000);
  await page.getByRole("button", { name: "글 남기기" }).click();
  await expect(page.getByTestId("board-post-status")).toHaveText("글을 올렸습니다.");
  expect(written).toHaveLength(2);
});

test("a second person's identical post is told it did not go up", async ({ page }) => {
  await page.route(`${SUPABASE}/**`, (route) => route.fulfill(json([])));
  await page.route(`${SUPABASE}/rest/v1/board_posts**`, async (route) => {
    if (route.request().method() !== "POST") return route.fulfill(json([]));
    return route.fulfill(json({ code: "P0001", message: "board post repeats a recent post", details: null, hint: null }, 400));
  });
  await useMockSupabase(page);
  await page.clock.install();
  await openBoard(page);
  await page.getByPlaceholder("게시판에 보일 이름").fill("교실 둘");
  await page.getByPlaceholder(/사건을 지나며/).fill("재밌어요");
  await page.clock.runFor(4_000);
  await page.getByRole("button", { name: "글 남기기" }).click();
  await expect(page.getByTestId("board-post-status")).toContainText("같은 글이 조금 전에 올라와 있습니다");
  await expect(page.getByPlaceholder(/사건을 지나며/)).toHaveValue("재밌어요");
});

test("a board that cannot be reached says so, closes the composer, and can be tried again", async ({ page }) => {
  let reachable = false;
  await page.route(`${SUPABASE}/**`, (route) => route.fulfill(json([])));
  await page.route(`${SUPABASE}/rest/v1/board_posts**`, (route) =>
    reachable
      ? route.fulfill(json([{ id: 7, nickname: "돌아온 사람", body: "다시 열렸네요.", created_at: "2026-09-27T09:00:00Z" }]))
      : route.fulfill(json({ message: "upstream unavailable" }, 503)),
  );
  await useMockSupabase(page);
  await openBoard(page);

  await expect(page.locator(".board-status-bar")).toContainText("BOARD OFFLINE");
  await expect(page.getByTestId("board-list-state")).toHaveText("글을 불러오지 못했습니다.");
  await expect(page.getByTestId("board-list-state")).not.toContainText("첫 글을 남겨보세요");
  await expect(page.getByPlaceholder("게시판에 보일 이름")).toBeDisabled();
  await expect(page.getByPlaceholder(/사건을 지나며/)).toBeDisabled();
  await expectBlockedAndExplained(page, "연결된 뒤에");
  // Pressed anyway, it sends nothing and says nothing new.
  await page.getByRole("button", { name: "글 남기기" }).click({ force: true });
  await expect(page.getByTestId("board-post-status")).toContainText("연결된 뒤에");

  reachable = true;
  await page.getByTestId("board-retry").click();
  await expect(page.locator(".board-post")).toHaveCount(1);
  await expect(page.locator(".board-status-bar")).toContainText("REMOTE BOARD");
  await expect(page.getByPlaceholder(/사건을 지나며/)).toBeEnabled();
  await expect(page.getByRole("button", { name: "글 남기기" }), "a board that answered takes a press").not.toHaveAttribute("aria-disabled");
  await expect(page.getByTestId("board-retry")).toHaveCount(0);
});

test("a deployment with no server says the board is not connected", async ({ page }) => {
  await openBoard(page);
  await expect(page.getByTestId("board-list-state")).toHaveText("지금은 게시판에 연결되어 있지 않습니다.");
  await expectBlockedAndExplained(page, "연결된 뒤에");
});

test("no ranking row can take the ranking screen down", async ({ page }) => {
  const honest = {
    run_tag: "HONEST01",
    player_name: "익명 분석관",
    case_id: "season-final",
    case_title: "SEASON 01 COMPLETE",
    completed_at: "2026-09-27T09:00:00Z",
    score: 71,
    summary: { burstScore: 71, rank: "B", primary: ["curiosity", 90], seasonComplete: true, averageResponseTime: 14, reframeCount: 2 },
  };
  const rows = [
    honest,
    // Each of these put an object where the screen prints text.
    { ...honest, run_tag: "FORGED01", score: 99, summary: { ...honest.summary, burstScore: 99, primary: [{ nested: true }, 1] } },
    { ...honest, run_tag: "FORGED02", score: 98, case_title: { a: 1 }, completed_at: { b: 2 } },
    { ...honest, run_tag: "FORGED03", score: 97, summary: { ...honest.summary, burstScore: 97, averageResponseTime: { c: 3 }, reframeCount: [4], rank: { S: 1 } } },
    { ...honest, run_tag: "FORGED04", score: 96, summary: "[1,2,3]" },
  ];
  await page.route(`${SUPABASE}/**`, (route) => route.fulfill(json([])));
  await page.route(`${SUPABASE}/rest/v1/public_rankings**`, (route) => route.fulfill(json(rows)));
  await useMockSupabase(page);
  await page.goto("/");
  await page.getByRole("button", { name: "랭킹" }).first().click();
  await expect(page.locator(".ranking-page")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  await expect(page.locator(".ranking-row")).toHaveCount(rows.length);
  // The rows are a list, and each says its place in words: the drawn "01" is
  // hidden from a screen reader, which used to hear a bare number or nothing.
  const list = page.getByRole("list").filter({ has: page.locator(".ranking-row") });
  await expect(list.getByRole("listitem")).toHaveCount(rows.length);
  for (const [index, row] of (await page.locator(".ranking-row").all()).entries()) {
    await expect(row).toHaveAttribute("role", "listitem");
    await expect(row.locator(".sr-only")).toHaveText(`${index + 1}위`);
    await expect(row.locator(".ranking-position")).toHaveAttribute("aria-hidden", "true");
  }
  await expect(page.locator(".ranking-row").first()).toContainText("주요 압박 책임");
  await expect(page.locator(".ranking-row").last()).toContainText("주요 압박 호기심");
  await expect(page.locator(".error-screen")).toHaveCount(0);
  await expect(page.locator(".ranking-page")).not.toContainText("[object Object]");
});
