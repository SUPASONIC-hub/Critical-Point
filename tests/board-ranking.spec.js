import { BACKEND_ORIGIN, expect, test } from "./helpers/network.js";

import { ACCESSIBILITY_SETTINGS_KEY, BOARD_POST_MAX_LENGTH, BOARD_WRITER_ID_KEY, PLAYER_NAME_MAX_LENGTH } from "../src/appConfig.js";
import { TEST_STORAGE_KEYS } from "./helpers/storage.js";
import { completeCurrentCase, startDebugNode } from "./helpers/gameFlow.js";

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

/** A board that takes every post and keeps what it was sent. */
async function boardThatTakesPosts(page) {
  const written = [];
  await page.route(`${SUPABASE}/**`, (route) => route.fulfill(json([])));
  await page.route(`${SUPABASE}/rest/v1/board_posts**`, async (route) => {
    if (route.request().method() !== "POST") return route.fulfill(json([]));
    written.push(route.request().postDataJSON());
    return route.fulfill({ status: 201, body: "" });
  });
  await useMockSupabase(page);
  return written;
}

// The server takes one post per thirty seconds from a device. A second post
// inside them is stopped on the page, with the seconds left, and keeps its words.
test("a second post inside thirty seconds is refused with the wait, and goes up after it", async ({ page }) => {
  const written = await boardThatTakesPosts(page);
  await page.clock.install();
  await openBoard(page);
  const status = page.getByTestId("board-post-status");
  const body = page.getByPlaceholder(/사건을 지나며/);
  const submit = page.getByRole("button", { name: "글 남기기" });
  await page.getByPlaceholder("게시판에 보일 이름").fill("분석관 김");
  await body.fill("첫 번째 글입니다.");
  await page.clock.runFor(4_000);
  await submit.click();
  await expect(status).toHaveText("글을 올렸습니다.");
  expect(written).toHaveLength(1);

  await body.fill("두 번째 글입니다.");
  await page.clock.runFor(10_000);
  await submit.click();
  await expect(status).toContainText("글은 30초에 한 번만 올릴 수 있습니다");
  // Ten of the thirty seconds have gone, so about twenty are named.
  const waitSeconds = Number((await status.textContent()).match(/(\d+)초 뒤에/)?.[1]);
  expect(waitSeconds).toBeGreaterThanOrEqual(15);
  expect(waitSeconds).toBeLessThanOrEqual(20);
  await expect(body, "the refused words stay in the box").toHaveValue("두 번째 글입니다.");
  expect(written, "nothing was sent inside the wait").toHaveLength(1);

  await page.clock.runFor(21_000);
  await submit.click();
  await expect(status).toHaveText("글을 올렸습니다.");
  expect(written).toHaveLength(2);
  expect(written[1].body).toBe("두 번째 글입니다.");
});

// The limits the trigger holds: a name of 24, a post of 300. The fields stop
// there, the counters say so, and what is sent is inside both.
test("the name stops at 24 characters and the post at 300, and that is what is sent", async ({ page }) => {
  const written = await boardThatTakesPosts(page);
  await page.clock.install();
  await openBoard(page);
  const name = page.getByPlaceholder("게시판에 보일 이름");
  const body = page.getByPlaceholder(/사건을 지나며/);
  await expect(name).toHaveAttribute("maxlength", String(PLAYER_NAME_MAX_LENGTH));
  await expect(body).toHaveAttribute("maxlength", String(BOARD_POST_MAX_LENGTH));

  // fill() sets the value without the browser's own maxlength, which only
  // stops typing: what holds a pasted or scripted value is the page's code.
  await name.fill("가".repeat(PLAYER_NAME_MAX_LENGTH + 10));
  await body.fill("나".repeat(BOARD_POST_MAX_LENGTH + 50));
  await expect(name).toHaveValue("가".repeat(PLAYER_NAME_MAX_LENGTH));
  await expect(body).toHaveValue("나".repeat(BOARD_POST_MAX_LENGTH));
  await expect(page.locator("#board-nickname-count")).toContainText(`${PLAYER_NAME_MAX_LENGTH}/${PLAYER_NAME_MAX_LENGTH}자`);
  await expect(page.locator("#board-body-count")).toHaveText(`${BOARD_POST_MAX_LENGTH}/${BOARD_POST_MAX_LENGTH}자`);

  await page.clock.runFor(4_000);
  await page.getByRole("button", { name: "글 남기기" }).click();
  await expect(page.getByTestId("board-post-status")).toHaveText("글을 올렸습니다.");
  expect(written).toHaveLength(1);
  expect(written[0].nickname).toHaveLength(PLAYER_NAME_MAX_LENGTH);
  expect(written[0].body).toHaveLength(BOARD_POST_MAX_LENGTH);
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

/* ------------------------------------------------------------- story mode */

/** A season this device finished, as its own ranking holds it (useChoiceCommit's season row). */
const localSeasonRow = (runId, score, summary = {}) => ({
  local: true,
  run_id: runId,
  session_code: "LOCAL001",
  player_name: runId,
  case_id: "season-final",
  case_title: "SEASON 01 COMPLETE",
  completed_at: "2026-10-10T09:00:00Z",
  score,
  summary: { burstScore: score, rank: "A", primary: ["curiosity", 90], seasonComplete: true, averageResponseTime: 14, reframeCount: 2, ...summary },
});

// A story season is kept on this device's ranking, and says what it was: its
// wall stood far off, so its score is not one to read against the others.
test("this device's story season is on its ranking with the mark, and no other row has it", async ({ page }) => {
  const rows = [
    localSeasonRow("STORYRUN", 88, { assistStory: true, assistTime: 2 }),
    localSeasonRow("SLOWRUN", 77, { assistTime: 1.5 }),
    localSeasonRow("PLAINRUN", 66),
  ];
  await page.addInitScript(({ key, value }) => localStorage.setItem(key, value), { key: TEST_STORAGE_KEYS.localRanking, value: JSON.stringify(rows) });
  // The device's setting is on, and marks nothing: the mark is the row's.
  await page.addInitScript(({ key, value }) => localStorage.setItem(key, value), { key: ACCESSIBILITY_SETTINGS_KEY, value: JSON.stringify({ storyMode: true }) });
  await page.goto("/");
  await page.getByRole("button", { name: "랭킹" }).first().click();
  await expect(page.locator(".ranking-row")).toHaveCount(rows.length);
  const row = (name) => page.locator(".ranking-row", { hasText: name });
  await expect(row("STORYRUN").locator(".ranking-assist")).toHaveText(["테이블 시간 ×2", "스토리 모드"]);
  await expect(row("SLOWRUN").locator(".ranking-assist")).toHaveText(["테이블 시간 ×1.5"]);
  await expect(row("PLAINRUN").locator(".ranking-assist")).toHaveCount(0);
  await expect(page.locator(".ranking-page").getByText("스토리 모드", { exact: true })).toHaveCount(1);
  // The mark is on the screen, inside its row, on a desktop and on a phone.
  const mark = row("STORYRUN").locator(".ranking-assist").last();
  await mark.scrollIntoViewIfNeeded();
  await expect(mark).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

/**
 * Closes the finale of a season from its last scene, with the backend on and
 * the consent box as it starts (ticked), and returns the rows the page posted.
 * The debug jump to the finale counts every case before it as closed, so this
 * close is the season's.
 */
async function closeSeasonAndCollectRows(page) {
  const posted = [];
  await page.route(`${SUPABASE}/**`, (route) => route.fulfill(json([])));
  await page.route(`${SUPABASE}/rest/v1/playtest_sessions**`, async (route) => {
    if (route.request().method() === "POST") posted.push(...[route.request().postDataJSON()].flat());
    await route.fulfill({ status: 201, contentType: "application/json", body: "" });
  });
  await useMockSupabase(page);
  await startDebugNode(page, "final", "f_aftershock");
  await completeCurrentCase(page);
  await expect(page.locator(".ending-sequence")).toBeVisible();
  return posted;
}

const readLocalRanking = (page) => page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "[]"), TEST_STORAGE_KEYS.localRanking);
const readQueue = (page) => page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "null")?.pendingTelemetry ?? [], TEST_STORAGE_KEYS.save);

test("a season closed at the table is sent to the public ranking", async ({ page }) => {
  test.setTimeout(120_000);
  const posted = await closeSeasonAndCollectRows(page);
  await expect.poll(() => posted.map((row) => row.case_id), { timeout: 20_000 }).toEqual(expect.arrayContaining(["final", "season-final"]));
  expect(posted.find((row) => row.case_id === "season-final").summary.assistStory).toBeUndefined();
  const local = await readLocalRanking(page);
  expect(local.find((row) => row.case_id === "season-final").summary.assistStory).toBeUndefined();
});

// The client is what withholds the row until the server refuses it too (the
// migration that follows): a story season is never queued and never posted.
test("a season with a story case is not sent to the public ranking, and this device keeps it with the mark", async ({ page }) => {
  test.setTimeout(120_000);
  await page.addInitScript(({ key, value }) => localStorage.setItem(key, value), { key: ACCESSIBILITY_SETTINGS_KEY, value: JSON.stringify({ storyMode: true }) });
  const posted = await closeSeasonAndCollectRows(page);
  // The finale's own row goes out, marked: the queue has nothing left to send.
  await expect.poll(() => posted.map((row) => row.case_id), { timeout: 20_000 }).toContain("final");
  await expect.poll(() => readQueue(page), { timeout: 20_000 }).toEqual([]);
  expect(posted.find((row) => row.case_id === "final").summary.assistStory).toBe(true);
  expect(posted.map((row) => row.case_id), "no ranking row was posted").not.toContain("season-final");

  // This device's ranking has the season, marked.
  const local = await readLocalRanking(page);
  const season = local.find((row) => row.case_id === "season-final");
  expect(season, "the season is on this device's ranking").toBeTruthy();
  expect(season.summary.assistStory).toBe(true);

  expect(season.summary.assistTime).toBe(2);
  // (How that row is drawn is the test of the seeded ranking above: a page
  // loaded on this save opens on its ending, not on the intro's 랭킹 button.)
});
