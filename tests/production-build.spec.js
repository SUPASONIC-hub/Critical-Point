import { BACKEND_ORIGIN, expect, test } from "./helpers/network.js";
import { CHUNK_RELOAD_SESSION_KEY } from "../src/appConfig.js";
import { cashStakedCard, collectRuntimeErrors, dismissProtocolBreach, resumeSavedRun } from "./helpers/gameFlow.js";
import { readJsonStorage, TEST_STORAGE_KEYS } from "./helpers/storage.js";
import { savedAtLastScene, seedSave } from "./helpers/seededSave.js";

/**
 * The build that ships, played past its first screen.
 *
 * Everything here runs against `dist/` served by `vite preview`
 * (`npm run test:e2e:preview`): minified, split into its lazy chunks, under
 * the Content-Security-Policy render.yaml declares, with the backend switched
 * on. The rest of the suite enters through the debug jump, which exists only
 * on the dev server, so until this file no test of the production build got
 * further than the first scene -- the report, the hand-over to the next case,
 * the ranking, the board and every telemetry call shipped unexercised.
 *
 * The way in is a save and the 이어하기 button, as for a returning player.
 */
test.skip(process.env.E2E_SERVER !== "preview", "these are tests of the production build: npm run test:e2e:preview");

const REST = `${BACKEND_ORIGIN}/rest/v1`;

/** Policy violations the browser reports, which is how a blocked script or request shows itself. */
function collectPolicyViolations(page) {
  const violations = [];
  page.on("console", (message) => {
    if (/Content Security Policy|Refused to (load|connect|execute|apply)/i.test(message.text())) violations.push(message.text());
  });
  return violations;
}

test("the release is served under the policy render.yaml declares", { tag: "@prod" }, async ({ page }) => {
  const violations = collectPolicyViolations(page);
  const response = await page.goto("/");
  const headers = response.headers();
  expect(headers["content-security-policy"]).toContain("script-src 'self'");
  expect(headers["content-security-policy"]).toContain("object-src 'none'");
  expect(headers["content-security-policy"]).toContain(`connect-src 'self' ${BACKEND_ORIGIN}`);
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["cache-control"]).toBe("no-cache");
  const asset = await page.evaluate(() => document.querySelector("script[src^='/assets/']").getAttribute("src"));
  const assetResponse = await page.request.get(asset);
  expect(assetResponse.headers()["cache-control"]).toContain("immutable");
  await expect(page.locator(".intro")).toBeVisible();
  expect(violations).toEqual([]);
});

test("the release has no debug console, asked for or not", { tag: "@prod" }, async ({ page }) => {
  await seedSave(page, savedAtLastScene());
  await page.goto("/?debug=1");
  await expect(page.locator(".intro")).toBeVisible();
  for (const id of ["debug-case-select", "debug-node-select", "debug-start-node", "unlock-all-cases", "open-error-log-from-header"]) {
    await expect(page.getByTestId(id), id).toHaveCount(0);
  }
  await resumeSavedRun(page);
  await expect(page.locator(".choices .choice").first()).toBeVisible();
  await expect(page.getByTestId("debug-overlay")).toHaveCount(0);
  // A key in storage does not turn it on either.
  await page.evaluate(() => localStorage.setItem("critical-point-force-render-error", "1"));
  await page.reload();
  await expect(page.locator(".game-shell")).toBeVisible();
  await expect(page.locator(".error-screen")).toHaveCount(0);
});

test("a saved run plays to its report, reports it, and hands over to the next case", { tag: "@prod" }, async ({ page }) => {
  test.setTimeout(120_000);
  const errors = [];
  collectRuntimeErrors(page, errors);
  const violations = collectPolicyViolations(page);
  const rows = [];
  await page.route(`${REST}/playtest_sessions*`, async (route) => {
    if (route.request().method() === "POST") rows.push(route.request().postDataJSON());
    await route.fulfill({ status: 201, contentType: "application/json", body: "" });
  });

  await seedSave(page, savedAtLastScene({ dataConsent: true }));
  await page.goto("/");
  await resumeSavedRun(page);
  await page.locator(".choices .choice:not([aria-disabled='true'])").first().click();
  await cashStakedCard(page);
  await page.getByTestId("decision-next").click();

  // The report: a lazy chunk, rendered from the case that just closed.
  const report = page.locator(".result-page");
  await expect(report).toBeVisible();
  await expect(report.getByRole("heading").first()).not.toBeEmpty();
  await expect(report.getByTestId("export-play-log")).toBeVisible();
  const closed = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  expect(closed.completedCases).toContain("case01");
  expect(closed.caseResults.case01?.outcomeChoiceId).toBeTruthy();
  expect(closed.caseResults.case01?.rank).toMatch(/^[SABC]$/);

  // Its third act opens, and carries the session the rows are filed under.
  await report.locator("details.report-archive > summary").click();
  await expect(report.locator(".report-archive-body")).toBeVisible();
  await expect(report.getByTestId("session-code")).not.toBeEmpty();

  // The backend is switched on in this build, and the player consented: the
  // case row went out, anonymous, under the run's id.
  await expect.poll(() => rows.length).toBeGreaterThan(0);
  const row = rows.find((candidate) => candidate.case_id === "case01");
  expect(row, "a playtest_sessions row for case01").toBeTruthy();
  expect(row.run_id).toBe("e2e-seeded-run");
  expect(typeof row.event_id).toBe("string");
  expect(JSON.stringify(row)).not.toContain("E2E");

  // The hand-over: the next case opens on a table that can be played.
  await page.locator(".next-case-panel button").click();
  await expect(page.locator(".game-shell")).toBeVisible();
  await expect.poll(async () => (await readJsonStorage(page, TEST_STORAGE_KEYS.save)).currentCase).toBe("case02");
  await dismissProtocolBreach(page);
  await expect(page.locator(".choices .choice:not([aria-disabled='true'])").first()).toBeVisible();

  expect(errors).toEqual([]);
  expect(violations).toEqual([]);
});

test("the ranking and the board read from the backend in the release", { tag: "@prod" }, async ({ page }) => {
  const errors = [];
  collectRuntimeErrors(page, errors);
  const asked = [];
  await page.route(`${REST}/public_rankings*`, async (route) => {
    asked.push("public_rankings");
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          run_tag: "E2ERUN01",
          player_name: "익명 분석관",
          case_id: "season-final",
          case_title: "시즌 완주",
          completed_at: "2026-09-28T00:00:00Z",
          score: 77,
          summary: { rank: "A", burstScore: 77, primary: ["responsibility"], seasonComplete: true },
        },
      ]),
    });
  });
  await page.route(`${REST}/board_posts*`, async (route) => {
    asked.push("board_posts");
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([{ id: 1, nickname: "분석관E", body: "프로덕션 빌드에서 읽은 글", created_at: "2026-09-28T00:00:00Z" }]),
    });
  });

  await page.goto("/");
  await page.getByRole("button", { name: "랭킹" }).first().click();
  await expect(page.locator(".ranking-page")).toBeVisible();
  await expect(page.locator(".ranking-page")).toContainText("RUN E2ERUN01");
  await expect(page.locator(".ranking-page")).toContainText("77");

  await page.goto("/");
  await page.getByRole("button", { name: "게시판" }).first().click();
  await expect(page.locator(".board-page")).toBeVisible();
  await expect(page.locator(".board-post")).toHaveCount(1);
  await expect(page.locator(".board-post")).toContainText("프로덕션 빌드에서 읽은 글");

  expect(asked).toContain("public_rankings");
  expect(asked).toContain("board_posts");
  expect(errors).toEqual([]);
});

/**
 * A tab left open across a deploy asks for chunks the new release no longer
 * has. The scene graph (the GameRuntime chunk) is the first one: the intro
 * prefetches it on idle, and 이어하기 mounts it.
 *
 * What the release does about it (src/state/chunkReload.js, LazyScreen.jsx):
 *   1. the first failed import raises `vite:preloadError`, and the tab reloads
 *      itself once, leaving a marker in sessionStorage;
 *   2. a second failure inside a minute is not reloaded again: it reaches the
 *      LazyScreen around the runtime, which shows `chunk-reload-panel` with a
 *      새로고침 button (`chunk-reload`) instead of handing it to the root
 *      boundary, so nothing is written to the save.
 */
test("a scene graph that cannot be fetched reloads once, then offers 새로고침 and leaves the save alone", { tag: "@prod" }, async ({ page, browserName }) => {
  const save = savedAtLastScene();
  await seedSave(page, save);
  let refuse = true;
  let refusals = 0;
  await page.route("**/assets/GameRuntime-*.js", (route) => {
    if (!refuse) return route.continue();
    refusals += 1;
    return route.abort("failed");
  });
  let loads = 0;
  page.on("load", () => {
    loads += 1;
  });
  await page.goto("/");

  // The idle prefetch is refused and the tab reloads itself; the reloaded
  // intro's prefetch fails too, this time without a reload. Waiting for the
  // second load keeps the 이어하기 press off the page that is about to go away.
  // It is the load that is counted, not the refusals: Chromium asks for the
  // chunk again after the reload, WebKit remembers that the import failed and
  // fails it again without a request, and the tab does the same thing in both.
  await expect.poll(() => loads, { message: "the tab reloaded itself once", timeout: 20_000 }).toBeGreaterThanOrEqual(2);
  expect(refusals, "the runtime chunk was asked for and refused").toBeGreaterThanOrEqual(1);
  await expect(page.locator(".intro")).toBeVisible();
  expect(
    await page.evaluate((key) => sessionStorage.getItem(key), CHUNK_RELOAD_SESSION_KEY),
    "the automatic reload left its marker",
  ).not.toBeNull();

  await page.getByTestId("resume-save").click();

  // The player is told, and offered a reload: not left on a blank screen, and
  // not on the root error screen that charges the failure to the run.
  const panel = page.getByTestId("chunk-reload-panel");
  await expect(panel).toBeVisible({ timeout: 15_000 });
  await expect(panel.getByRole("heading")).toHaveText("화면을 다시 받아야 합니다.");
  const reload = panel.getByRole("button", { name: "새로고침", exact: true });
  await expect(reload).toHaveAttribute("data-testid", "chunk-reload");
  await expect(page.getByTestId("error-start-fresh")).toHaveCount(0);

  // The save is the run, untouched: no error charged to it, no retry counted,
  // still resumable.
  const kept = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  expect(kept.runId).toBe(save.runId);
  expect(kept.nodeId).toBe(save.nodeId);
  expect(kept.lastError ?? null).toBeNull();
  expect(loads, "the second failure did not reload the tab again").toBe(2);

  // And the way back works once the chunk can be had. 새로고침 reloads the tab
  // in every engine. Whether the reloaded tab then gets the chunk is asked of
  // Chromium only: WebKit goes on failing an import it has seen fail, across
  // reloads and without asking the server, for a length of time that differed
  // from run to run (2026-10-05). A deploy gives the chunk a new name, so a
  // player's Safari does not meet that; a test that brings the same file back
  // under the same name does.
  refuse = false;
  await reload.click();
  await expect.poll(() => loads, { message: "새로고침 reloaded the tab" }).toBeGreaterThanOrEqual(3);
  if (browserName === "webkit") return;
  await expect(page.locator(".intro, .game-shell").first()).toBeVisible();
  if (await page.getByTestId("resume-save").isVisible()) await resumeSavedRun(page);
  await expect(page.locator(".game-shell")).toBeVisible();
  expect((await readJsonStorage(page, TEST_STORAGE_KEYS.save)).nodeId).toBe(save.nodeId);
});
