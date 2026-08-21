import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

async function expectNoA11yViolations(page) {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
}

async function startDebugNode(page, caseId, nodeId) {
  await page.getByTestId("debug-case-select").selectOption(caseId);
  await page.getByTestId("debug-node-select").selectOption(nodeId);
  await page.getByTestId("debug-start-node").click();
}

async function completeCurrentCase(page) {
  for (let step = 0; step < 24; step += 1) {
    if (await page.locator(".result-page").isVisible().catch(() => false)) return;
    const choice = page.locator(".choices .choice").first();
    await expect(choice).toBeVisible();
    await choice.evaluate((button) => button.click());
    const commitButton = page.getByTestId("commit-confirm");
    if (await commitButton.isVisible().catch(() => false)) {
      await commitButton.evaluate((button) => button.click());
    }
    const nextButton = page.getByTestId("decision-next");
    if (await nextButton.isVisible().catch(() => false)) {
      await nextButton.evaluate((button) => button.click());
    }
  }
  throw new Error("Case did not reach result page");
}

test("intro screen has no structural accessibility violations", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".intro")).toBeVisible();
  await expectNoA11yViolations(page);
});

test("case 05 scene has no structural accessibility violations", async ({ page }) => {
  await page.goto("/?debug=1");
  await startDebugNode(page, "case05", "c5_voice");
  await expect(page.getByRole("heading", { name: "이름 없는 증언" })).toBeVisible();
  await expectNoA11yViolations(page);
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

test("final ending report has no structural accessibility violations", async ({ page }) => {
  await page.goto("/?debug=1");
  await startDebugNode(page, "final", "f_start");
  await completeCurrentCase(page);
  await expect(page.locator(".ending-reveal")).toBeVisible();
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
        schemaVersion: 1,
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
