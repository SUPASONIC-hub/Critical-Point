import { BACKEND_ORIGIN, expect, test } from "./helpers/network.js";
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
 * has. The scene graph is the first one a player asks for, on the click that
 * starts the game.
 */
test("a scene graph that cannot be fetched offers a way back and leaves the save alone", { tag: "@prod" }, async ({ page }) => {
  // Measured 2026-09-28 at 52b8f1f plus this branch: the failed import lands on
  // the root error boundary, which writes `lastError` (source react-render,
  // retryCount 1) into the save -- a missing file is charged to the run. The
  // recovery is the runtime stream's work; remove this line when it has landed
  // and the test passes. If the button it adds is worded differently, the
  // name pattern below is the one line to change.
  test.fixme(true, "a chunk that fails to load is recorded against the save (lastError, retryCount 1) and no reload is offered");
  const save = savedAtLastScene();
  await seedSave(page, save);
  let refuse = true;
  await page.route("**/assets/GameRuntime-*.js", (route) => (refuse ? route.abort("failed") : route.continue()));
  await page.goto("/");
  await page.getByTestId("resume-save").click();

  // The player is told, and offered a reload: not left on a blank screen.
  const reload = page.getByRole("button", { name: /다시 불러오기|새로고침|다시 시도/ });
  await expect(reload.first()).toBeVisible({ timeout: 15_000 });

  // The save is the run, untouched: no error charged to it, no retry counted,
  // still resumable.
  const kept = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  expect(kept.runId).toBe(save.runId);
  expect(kept.nodeId).toBe(save.nodeId);
  expect(kept.lastError ?? null).toBeNull();

  // And the way back works once the chunk can be had.
  refuse = false;
  await reload.first().click();
  await expect(page.locator(".intro, .game-shell").first()).toBeVisible();
  if (await page.getByTestId("resume-save").isVisible()) await resumeSavedRun(page);
  await expect(page.locator(".game-shell")).toBeVisible();
  expect((await readJsonStorage(page, TEST_STORAGE_KEYS.save)).nodeId).toBe(save.nodeId);
});
