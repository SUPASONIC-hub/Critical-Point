import AxeBuilder from "@axe-core/playwright";
import { BACKEND_ORIGIN, expect, test } from "./helpers/network.js";
import { cashStakedCard, completeCurrentCase, startDebugNode, waitForEntrance } from "./helpers/gameFlow.js";
import { TEST_STORAGE_KEYS } from "./helpers/storage.js";

async function expectNoA11yViolations(page) {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
}

test("intro screen has no structural accessibility violations", { tag: "@prod" }, async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".intro")).toBeVisible();
  await expectNoA11yViolations(page);
});

// The intro's audit above is of closed drawers, and axe does not read what a
// closed <details> holds. These two are opened: the play-style drawer with its
// story card, and the comfort panel with its story switch, off and then on.
test("the play-style drawer and the comfort panel, open, have no structural accessibility violations", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".intro")).toBeVisible();
  for (const selector of [".play-style-panel", ".accessibility-panel"]) {
    await page.locator(`details.intro-drawer:has(${selector})`).evaluate((drawer) => {
      drawer.open = true;
    });
  }
  const card = page.getByRole("region", { name: "플레이 스타일 선택" }).getByRole("button", { name: /스토리 모드/ });
  const toggle = page.getByRole("region", { name: "편의 설정" }).getByLabel(/스토리 모드/);
  await expect(card).toBeVisible();
  await expect(toggle).toBeVisible();
  await expect(card).toHaveAttribute("aria-pressed", "false");
  await expectNoA11yViolations(page);

  await card.click();
  await expect(card).toHaveAttribute("aria-pressed", "true");
  await expect(toggle).toBeChecked();
  // The selected card's own transition has to land before its colours are read.
  await waitForEntrance(card);
  await expectNoA11yViolations(page);
  // Four cards, one row of four or two of two, and none wider than the page.
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("case 05 scene has no structural accessibility violations", async ({ page }) => {
  await page.goto("/?debug=1");
  await startDebugNode(page, "case05", "c5_voice");
  await expect(page.getByRole("heading", { name: "이름 없는 증언" })).toBeVisible();
  await expectNoA11yViolations(page);
});

/**
 * The four dialogs the table opens. Every scene test above audits the table
 * after `startDebugNode` has closed the briefing page, and none ever stopped on
 * the reveal, the draft or the question a second tab is asked -- so the
 * surfaces a player is held on until they answer were the ones never read
 * (the 2026-10-07 audit, B4 finding 3).
 */
test("the briefing page has no structural accessibility violations", async ({ page }) => {
  await page.goto("/?debug=1");
  await startDebugNode(page, "case05", "c5_voice", { openTable: false });
  const briefing = page.getByTestId("scene-briefing");
  await expect(briefing.getByRole("dialog")).toBeVisible();
  // The page fades in and its panels pop one after another for about a second.
  // Read before they land, the contrast rule measures text half faded into
  // the paper and fails a page that passes once it has arrived.
  await waitForEntrance(briefing);
  await expectNoA11yViolations(page);
});

test("the decision reveal has no structural accessibility violations", async ({ page }) => {
  await page.goto("/?debug=1");
  await startDebugNode(page, "case05", "c5_voice");
  await page.locator(".choices .choice:not([aria-disabled='true'])").first().click();
  await cashStakedCard(page);
  await expect(page.getByTestId("decision-next")).toBeVisible();
  await expect(page.locator(".decision-reveal-backdrop").getByRole("dialog")).toBeVisible();
  // The backdrop fades in and the window rises; the same race as the briefing.
  await waitForEntrance(page.locator(".decision-reveal-backdrop"));
  await expectNoA11yViolations(page);
});

test("the relic draft has no structural accessibility violations", async ({ page }) => {
  await page.goto("/?debug=1");
  await startDebugNode(page, "case01", "c1_aftershock");
  await completeCurrentCase(page);
  const decisionNext = page.getByTestId("decision-next");
  if (await decisionNext.isVisible()) await decisionNext.click();
  await page.locator(".next-case-panel button").click();
  await expect(page.getByTestId("relic-draft")).toBeVisible();
  await expect(page.getByTestId("relic-option").first()).toBeVisible();
  // The draft and each of its cards are dealt in.
  await waitForEntrance(page.getByTestId("relic-draft"));
  await expectNoA11yViolations(page);
});

test("the question a second tab is asked has no structural accessibility violations", async ({ page, context }) => {
  await page.goto("/?debug=1");
  await startDebugNode(page, "case01", "start");
  await page.locator(".choices .choice").first().click();
  await page.getByTestId("commit-push").click();
  const second = await context.newPage();
  await second.goto("/?debug=1");
  await expect(second.getByRole("alertdialog")).toBeVisible();
  await expect(second.getByTestId("table-held-elsewhere")).toBeVisible();
  await waitForEntrance(second.getByTestId("table-held-elsewhere"));
  await expectNoA11yViolations(second);
  await second.close();
});

test("final case scene has no structural accessibility violations", async ({ page }) => {
  await page.goto("/?debug=1");
  await startDebugNode(page, "final", "f_start");
  await expect(page.locator(".game-shell")).toBeVisible();
  await expectNoA11yViolations(page);
});

test("case result report has no structural accessibility violations", async ({ page }) => {
  await page.goto("/?debug=1");
  await startDebugNode(page, "case05", "c5_voice");
  await completeCurrentCase(page);
  await expect(page.locator(".result-page")).toBeVisible();
  await expectNoA11yViolations(page);
  const overflow = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
});

test("case result report keeps keyboard focus on an actionable control", async ({ page }) => {
  await page.goto("/?debug=1");
  await startDebugNode(page, "case05", "c5_voice");
  await completeCurrentCase(page);
  const firstButton = page.locator(".result-page button").first();
  await firstButton.focus();
  await expect(firstButton).toBeFocused();
  await page.keyboard.press("Tab");
  // Focus moved, and to something a key can act on. `:focus` being visible
  // was all this asked, which the button it started on satisfied too.
  const focused = await page.evaluate(() => {
    const element = document.activeElement;
    const first = document.querySelector(".result-page button");
    return {
      inReport: Boolean(element?.closest(".result-page")),
      moved: element !== first,
      actionable: Boolean(element?.matches("button, a[href], input, select, textarea, summary, [tabindex]:not([tabindex='-1'])")),
      disabled: Boolean(element?.disabled),
      visible: Boolean(element?.getClientRects().length),
    };
  });
  expect(focused).toEqual({ inReport: true, moved: true, actionable: true, disabled: false, visible: true });
});

test("final ending report has no structural accessibility violations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?debug=1");
  await startDebugNode(page, "final", "f_start");
  await completeCurrentCase(page);
  await expect(page.locator(".ending-sequence")).toBeVisible();
  await expect(page.locator(".ending-sequence")).toHaveClass(/ending-step-0/);
  await expectNoA11yViolations(page);
  const overflow = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
});

test("error log and save slot panels have no structural accessibility violations", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "trigger-prototype-error-log-v1",
      JSON.stringify({
        // The key the app reads. It was `schemaVersion` here, so the log parsed
        // to nothing and the audit below was of an empty panel.
        saveSchemaVersion: 1,
        entries: [
          {
            id: "a11y-error",
            occurredAt: new Date().toISOString(),
            error: { message: "A11y panel check", stack: "" },
            context: { source: "a11y", currentCase: "case05", nodeId: "c5_voice", logLength: 0 },
            viewport: { width: 1280, height: 720 },
            domSnapshot: "",
          },
        ],
      }),
    );
    localStorage.setItem(
      "trigger-prototype-save-slots-v1",
      JSON.stringify({
        recoverySlotSchemaVersion: 1,
        slots: [
          {
            id: "a11y-slot",
            savedAt: new Date().toISOString(),
            currentCase: "case05",
            nodeId: "c5_voice",
            completedCases: ["case01", "case02", "case03", "case04"],
            snapshot: {
              recoverySlotSchemaVersion: 1,
              saveSchemaVersion: 2,
              playerName: "A11y",
              started: false,
              paused: true,
              currentCase: "case05",
              nodeId: "c5_voice",
              completedCases: ["case01", "case02", "case03", "case04"],
              discoveredClues: [],
              log: [],
              pendingTelemetry: [],
              caseResults: {},
              playtestFeedback: {},
              resources: {},
              triggers: {},
              cognition: {},
            },
          },
        ],
      }),
    );
  });
  await page.goto("/?debug=1");
  await page.getByTestId("open-error-log-from-header").click();
  await expect(page.getByTestId("error-log-panel")).toBeVisible();
  await expect(page.getByTestId("save-slot-panel")).toBeVisible();
  // The panels have something in them: the seeded error and the seeded slot.
  await expect(page.getByTestId("error-log-panel")).toContainText("A11y panel check");
  await expect(page.getByTestId("save-slot-panel").getByRole("button").first()).toBeVisible();
  await expectNoA11yViolations(page);
});

test("error recovery screen has no structural accessibility violations", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("critical-point-force-render-error", "1");
    localStorage.setItem(
      "trigger-prototype-v2",
      JSON.stringify({
        saveSchemaVersion: 2,
        playerName: "A11y",
        started: true,
        currentCase: "case05",
        nodeId: "c5_voice",
        completedCases: ["case01", "case02", "case03", "case04"],
        log: [],
        pendingTelemetry: [],
        caseResults: {},
        playtestFeedback: {},
        resources: {},
        triggers: {},
        cognition: {},
      }),
    );
  });
  await page.goto("/?debug=1");
  await expect(page.getByRole("heading", { name: "장면을 불러오지 못했습니다." })).toBeVisible();
  await expectNoA11yViolations(page);
  const overflow = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
});

/** Points the page at the stub backend, as board-ranking.spec.js does. */
async function useStubBackend(page) {
  await page.addInitScript(
    ({ urlKey, keyKey, url }) => {
      localStorage.setItem(urlKey, url);
      localStorage.setItem(keyKey, "anon");
    },
    { urlKey: TEST_STORAGE_KEYS.telemetryUrl, keyKey: TEST_STORAGE_KEYS.telemetryKey, url: BACKEND_ORIGIN },
  );
}

const stubRows = (rows) => (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(rows) });

// The board had no audit at all, and the ranking's was of an empty list: the
// guard answers every read with no rows, so no row had ever been on the page.
test("the board, with posts on it, has no structural accessibility violations", async ({ page }) => {
  await page.route(`${BACKEND_ORIGIN}/**`, stubRows([]));
  await page.route(
    `${BACKEND_ORIGIN}/rest/v1/board_posts**`,
    stubRows([
      { id: 2, nickname: "나중에 온 사람", body: "두 번째 글입니다.", created_at: "2026-09-28T09:00:00Z" },
      { id: 1, nickname: "먼저 온 사람", body: "끝까지 가 보세요.", created_at: "2026-09-27T09:00:00Z" },
    ]),
  );
  await useStubBackend(page);
  await page.goto("/");
  await page.getByRole("button", { name: "게시판" }).first().click();
  await expect(page.locator(".board-post")).toHaveCount(2);
  // With something typed that the board will not take as it is: the privacy
  // notice is an alert, and the button it blocks is described by it.
  await page.getByPlaceholder("게시판에 보일 이름").fill("분석관 김");
  await page.getByPlaceholder(/사건을 지나며/).fill("연락은 tester@example.com 으로 주세요");
  await expect(page.locator("#board-privacy-notice")).toBeVisible();
  await expectNoA11yViolations(page);
});

test("ranking screen, with rows on it, has no structural accessibility violations", async ({ page }) => {
  const row = (tag, score) => ({
    run_tag: tag,
    player_name: "익명 분석관",
    case_id: "season-final",
    case_title: "SEASON 01 COMPLETE",
    completed_at: "2026-09-27T09:00:00Z",
    score,
    summary: { burstScore: score, rank: "B", primary: ["curiosity", 90], seasonComplete: true, averageResponseTime: 14, reframeCount: 2 },
  });
  await page.route(`${BACKEND_ORIGIN}/**`, stubRows([]));
  await page.route(`${BACKEND_ORIGIN}/rest/v1/public_rankings**`, stubRows([row("AXEROW01", 82), row("AXEROW02", 71)]));
  await useStubBackend(page);
  await page.goto("/");
  await page.getByRole("button", { name: "랭킹" }).first().click();
  await expect(page.locator(".ranking-row")).toHaveCount(2);
  await expectNoA11yViolations(page);
});

test("ranking screen has no structural accessibility violations", async ({ page }) => {
  await page.goto("/?debug=1");
  await page.getByRole("button", { name: "랭킹" }).first().click();
  await expect(page.locator(".ranking-page")).toBeVisible();
  await expectNoA11yViolations(page);
  const overflow = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
});
