import { mkdirSync } from "node:fs";
import path from "node:path";
import { expect, test } from "./helpers/network.js";
import { completeCurrentCase, resumeSavedRun, TRANSITION_TIMEOUT_MS } from "./helpers/gameFlow.js";
import { readJsonStorage, TEST_STORAGE_KEYS } from "./helpers/storage.js";
import { savedRunAt, seedSave } from "./helpers/seededSave.js";
import { seasonCasesBase } from "../src/gameCases.js";
import { createCaseSummary } from "../src/gameLogic.js";
import { createLogicReport, LOGIC_REPORT_COPY } from "../src/logicReport.js";

/**
 * The season's logic panel on the closing report (src/logicReport.js).
 *
 * The unit tests (tests/unit/logic-report.test.mjs) hold every sentence. These
 * are the panel in a browser: a returning player's save, with the season's
 * cases already closed and their logic records in it, plays the finale's last
 * scene and opens the record.
 *
 * `LOGIC_REPORT_OUT=<directory>` keeps a screenshot of the panel at a laptop's
 * width and at a phone's, for a person to look at. Nothing is written without it.
 */
const KEEP = process.env.LOGIC_REPORT_OUT;
const HOT_CASE = seasonCasesBase.find((caseItem) => caseItem.id === "case03");

test.beforeEach(async ({ page }) => {
  // Reduced motion drops the ending's eight-second hold.
  await page.emulateMedia({ reducedMotion: "reduce" });
});

/** A closed case's summary as the game writes one, with the logic record given. */
function closedCase(caseId, logicRecord, extra = {}) {
  const summary = createCaseSummary({}, {}, [{ caseId }], { resources: { time: 72, capital: 100, trust: 50, legitimacy: 50, humanCost: 0, fatigue: 10 }, schemaVersion: 2 });
  return { ...summary, ...(logicRecord ? { logicRecord: { windows: 6, heat: 3, peak: 1, top: ["inference", 2], grows: 0, switches: 0, breaks: 0, busts: 0, keeps: 0, best: 0, ...logicRecord } } : {}), ...extra };
}

/**
 * Six cases with a record: 사건 03 the hottest by far (a mean tier of 2.5, which
 * the finale played here by cashing at once cannot reach), five of its eight
 * windows on 위험 다루기.
 */
function recordedSeason(extra = {}) {
  return {
    case01: closedCase("case01", {}),
    case02: closedCase("case02", { breaks: 1 }),
    case03: closedCase("case03", { windows: 8, heat: 20, peak: 3, top: ["risk", 5], grows: 3, switches: 1, breaks: 0, busts: 4, best: 9 }),
    case04: closedCase("case04", {}, extra),
    case05: closedCase("case05", { keeps: 2 }),
    case06: closedCase("case06", { best: 4 }),
  };
}

/** From the season's last scene to the open record (the ending's step 3). */
async function openTheRecord(page, caseResults) {
  await seedSave(page, savedRunAt("final", "f_aftershock", { caseResults }));
  await page.goto("/");
  await resumeSavedRun(page);
  await completeCurrentCase(page);
  const ending = page.locator(".ending-sequence");
  await expect(ending).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  for (let twist = 0; twist < 3; twist += 1) {
    await expect(ending).toHaveClass(/ending-step-0/);
    await ending.locator("button").click();
  }
  await expect(page.locator(".ending-step-1")).toBeVisible();
  await page.getByTestId("ending-next").click();
  // The report is behind the ending until the last press, and the panel with it.
  await expect(page.locator(".ending-step-2")).toBeVisible();
  await expect(page.getByTestId("logic-report")).toBeHidden();
  await page.locator(".ending-step-2 button").click();
  await expect(page.locator(".ending-step-3")).toBeVisible();
}

/** The lines the module writes for the season the page saved, the finale's own record included. */
async function expectedLines(page) {
  await expect.poll(async () => Boolean((await readJsonStorage(page, TEST_STORAGE_KEYS.save))?.caseResults?.final), "the finale is in the save").toBe(true);
  const saved = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  return createLogicReport({ caseResults: saved.caseResults, cases: seasonCasesBase }).lines;
}

async function keepScreenshots(page, testInfo, label) {
  if (!KEEP) return;
  const panel = page.getByTestId("logic-report");
  const before = page.viewportSize();
  mkdirSync(KEEP, { recursive: true });
  for (const [width, height] of [[1366, 768], [390, 844]]) {
    await page.setViewportSize({ width, height });
    await panel.scrollIntoViewIfNeeded();
    await panel.screenshot({ path: path.join(KEEP, `${label}-panel-${width}x${height}-${testInfo.project.name}.png`) });
    // And the panel where it sits: the epilogue above it, the score rows below.
    await panel.evaluate((element) => element.scrollIntoView({ block: "center" }));
    await page.screenshot({ path: path.join(KEEP, `${label}-page-${width}x${height}-${testInfo.project.name}.png`) });
  }
  await page.setViewportSize(before);
}

test("the closing report names the hottest case, the score and the rank still to come", async ({ page }, testInfo) => {
  test.setTimeout(120_000);
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(String(error)));
  await openTheRecord(page, recordedSeason());

  const panel = page.getByTestId("logic-report");
  await expect(panel).toBeVisible();
  await expect(panel).toHaveAttribute("aria-label", "논리 유지력");
  await expect(panel.locator("span[lang='en']")).toHaveText("LOGIC HOLD");
  const lines = panel.locator("p");
  await expect(lines).toHaveCount(3);
  await expect(lines.nth(0)).toHaveText(`열기가 가장 높았던 사건은 사건 03 「${HOT_CASE.title}」입니다. 그 사건의 8판 가운데 5판을 '위험 다루기'로 닫았습니다.`);
  // The finale's own window is in the score, so the number is the page's; its shape is fixed.
  await expect(lines.nth(1)).toHaveText(/^논리 유지력 \d{1,3}점 · 최고 논리 콤보 9 · 순위는 시즌 기록이 50건 모이면 나옵니다\.$/);
  await expect(lines.nth(2)).toHaveText(LOGIC_REPORT_COPY.caption);
  await expect(lines).toHaveText(await expectedLines(page));
  await expect(panel).not.toContainText("압박");

  // It is the panel after the epilogue, in the epilogue's own frame.
  await expect(page.locator(".result-page > section.ending-epilogue-panel")).toHaveCount(2);
  await expect(page.locator(".result-page > section.ending-epilogue-panel").nth(1)).toHaveAttribute("data-testid", "logic-report");
  await expect(page.locator("section[aria-label='엔딩 에필로그'] + section")).toHaveAttribute("data-testid", "logic-report");
  const overflow = await page.evaluate(() => ({ clientWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth }));
  expect(overflow.scrollWidth, "the panel does not widen the page").toBeLessThanOrEqual(overflow.clientWidth + 1);
  expect(pageErrors).toEqual([]);
  await keepScreenshots(page, testInfo, "season");
});

test("a story-mode season's panel prints the sentence and the score, and no rank", async ({ page }, testInfo) => {
  test.setTimeout(120_000);
  await openTheRecord(page, recordedSeason({ assistStory: true }));

  await expect(page.locator(".result-hero-copy > p")).toContainText("스토리 모드");
  const lines = page.getByTestId("logic-report").locator("p");
  await expect(lines).toHaveCount(3);
  await expect(lines.nth(0)).toContainText(`열기가 가장 높았던 사건은 사건 03 「${HOT_CASE.title}」입니다.`);
  await expect(lines.nth(1)).toHaveText(/^논리 유지력 \d{1,3}점 · 최고 논리 콤보 9$/);
  await expect(lines).toHaveText(await expectedLines(page));
  await expect(page.getByTestId("logic-report")).not.toContainText("순위");
  await keepScreenshots(page, testInfo, "story");
});

test("a season whose earlier cases have no logic record names no case", async ({ page }, testInfo) => {
  test.setTimeout(120_000);
  // A save from before the streak: summaries with no record. The finale just played has one.
  await openTheRecord(page, { case01: closedCase("case01"), case02: closedCase("case02") });

  const lines = page.getByTestId("logic-report").locator("p");
  await expect(lines).toHaveCount(3);
  await expect(lines.nth(0)).toHaveText("논리 콤보 기록이 있는 사건이 아직 적어, 열기가 가장 높았던 사건을 짚지 않습니다.");
  await expect(lines.nth(1)).toContainText(/최고 논리 콤보 \d+/);
  await expect(lines).toHaveText(await expectedLines(page));
  await keepScreenshots(page, testInfo, "few-records");
});
