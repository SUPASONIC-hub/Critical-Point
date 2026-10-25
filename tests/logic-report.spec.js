import { mkdirSync } from "node:fs";
import path from "node:path";
import { BACKEND_ORIGIN, expect, test } from "./helpers/network.js";
import { bustStakedCard, clickElement, completeCurrentCase, expectSceneMinutes, findSkippedSceneWalk, resumeSavedRun, startDebugNode, TRANSITION_TIMEOUT_MS } from "./helpers/gameFlow.js";
import { readJsonStorage, TEST_STORAGE_KEYS } from "./helpers/storage.js";
import { savedRunAt, seedSave } from "./helpers/seededSave.js";
import { seasonCasesBase } from "../src/gameCases.js";
import { nodes } from "../src/gameData.js";
import { createCaseSummary } from "../src/gameLogic.js";
import { createLogicReport, getRankedLogicHold, LOGIC_REPORT_COPY, readStanding } from "../src/logicReport.js";

/**
 * The season's logic panel on the closing report (src/logicReport.js).
 *
 * The unit tests (tests/unit/logic-report.test.mjs) hold every sentence. These
 * are the panel in a browser: a returning player's save, with the season's
 * cases already closed and their logic records in it, plays the finale's last
 * scene and opens the record.
 *
 * The rank beside the score is read from the server's cut points
 * (`logic_hold_cutoffs()`, src/state/useLogicStanding.js). The stub backend
 * answers them here, as a ranking short of its records, as one with cuts, and
 * as a server that has not got the function yet.
 *
 * `LOGIC_REPORT_OUT=<directory>` keeps a screenshot of the panel at a laptop's
 * width and at a phone's, for a person to look at. Nothing is written without it.
 */
const KEEP = process.env.LOGIC_REPORT_OUT;
const HOT_CASE = seasonCasesBase.find((caseItem) => caseItem.id === "case03");
const CUTOFFS_URL = `${BACKEND_ORIGIN}/rest/v1/rpc/logic_hold_cutoffs`;
const json = (body, status = 200) => ({ status, contentType: "application/json", body: JSON.stringify(body) });
// What PostgREST answers for a function the database has not got.
const NO_FUNCTION = json({ code: "PGRST202", message: "Could not find the function public.logic_hold_cutoffs without parameters in the schema cache", details: null, hint: null }, 404);

/** Answers the ranking's cut points with `answer`; returns the bodies the page asked with. */
async function answerCutoffs(page, answer) {
  const asked = [];
  await page.route(CUTOFFS_URL, async (route) => {
    asked.push(route.request().postData());
    await route.fulfill(answer);
  });
  return asked;
}

test.beforeEach(async ({ page }) => {
  // Reduced motion drops the ending's eight-second hold.
  await page.emulateMedia({ reducedMotion: "reduce" });
});

/**
 * A closed case's summary as the game writes one, with the logic record given.
 * A case with a record was closed at the logic table, so it carries that
 * table's mark too: the streak in its run summary (`hasBeatTableCase`,
 * src/logicReport.js). One with no record is a summary from before the table.
 */
function closedCase(caseId, logicRecord, extra = {}) {
  const summary = createCaseSummary({}, {}, [{ caseId }], { resources: { time: 72, capital: 100, trust: 50, legitimacy: 50, humanCost: 0, fatigue: 10 }, schemaVersion: 2 });
  const atLogicTable = { gauntlet: { logicStreak: 0, tableRules: 2 }, logicRecord: { windows: 6, heat: 3, peak: 1, top: ["inference", 2], grows: 0, switches: 0, breaks: 0, busts: 0, keeps: 0, best: 0, ...logicRecord } };
  return { ...summary, ...(logicRecord ? atLogicTable : {}), ...extra };
}

const SESSIONS_URL = `${BACKEND_ORIGIN}/rest/v1/playtest_sessions**`;
// What PostgREST answers when the insert trigger raises a plain exception.
const refusal = (message) => json({ code: "P0001", message, details: null, hint: null }, 400);

/** Answers each row the page posts with `answerFor(row)`, or as created; returns the case ids posted. */
async function collectPostedRows(page, answerFor = () => null) {
  const posted = [];
  await page.route(SESSIONS_URL, async (route) => {
    if (route.request().method() !== "POST") return route.fallback();
    const [row] = [route.request().postDataJSON()].flat();
    posted.push(row.case_id);
    await route.fulfill(answerFor(row) ?? { status: 201, contentType: "application/json", body: "" });
  });
  return posted;
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
async function openTheRecord(page, caseResults, { backend = true, save = {} } = {}) {
  await seedSave(page, savedRunAt("final", "f_aftershock", { caseResults, ...save }));
  // After the seed, which clears storage. A build is given its server; these point the page at the stub.
  if (backend) {
    await page.addInitScript(
      ({ urlKey, keyKey, url }) => {
        localStorage.setItem(urlKey, url);
        localStorage.setItem(keyKey, "anon");
      },
      { urlKey: TEST_STORAGE_KEYS.telemetryUrl, keyKey: TEST_STORAGE_KEYS.telemetryKey, url: BACKEND_ORIGIN },
    );
  }
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

/**
 * The lines the module writes for the season the page saved, the finale's own
 * record included, with the standing read from `cutoffs` (the server's answer;
 * none is no standing).
 */
async function expectedLines(page, cutoffs = null) {
  await expect.poll(async () => Boolean((await readJsonStorage(page, TEST_STORAGE_KEYS.save))?.caseResults?.final), "the finale is in the save").toBe(true);
  const { caseResults } = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  return createLogicReport({ caseResults, cases: seasonCasesBase, standing: readStanding(cutoffs, getRankedLogicHold(caseResults)) }).lines;
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
  // A ranking with twelve seasons in it, and a player who ticked the research box.
  const asked = await answerCutoffs(page, json({ n: 12 }));
  await openTheRecord(page, recordedSeason(), { save: { dataConsent: true } });

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
  await expect(lines).toHaveText(await expectedLines(page, { n: 12 }));
  await expect(panel).not.toContainText("압박");
  // Asked once, and with nothing of the season in the question.
  expect(asked).toEqual(["{}"]);

  // It is the panel after the epilogue, in the epilogue's own frame. Between
  // the two, once a side case is written, the finale says the side slot opened
  // (E-11, ResultScreen's side-slot-opened line).
  const framed = page.locator(".result-page > section.ending-epilogue-panel:not([data-testid='side-slot-opened'])");
  await expect(framed).toHaveCount(2);
  await expect(framed.nth(1)).toHaveAttribute("data-testid", "logic-report");
  await expect(page.locator("section[aria-label='엔딩 에필로그'] + section[data-testid='side-slot-opened'] + section")).toHaveAttribute("data-testid", "logic-report");
  const overflow = await page.evaluate(() => ({ clientWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth }));
  expect(overflow.scrollWidth, "the panel does not widen the page").toBeLessThanOrEqual(overflow.clientWidth + 1);
  expect(pageErrors).toEqual([]);
  await keepScreenshots(page, testInfo, "season");
});

test("a story-mode season's panel prints the sentence and the score, and no rank", async ({ page }, testInfo) => {
  test.setTimeout(120_000);
  // The server would place any score in the top tenth; a story season does not ask it.
  const asked = await answerCutoffs(page, json({ n: 64, cuts: { 50: 0, 25: 0, 10: 0 } }));
  await openTheRecord(page, recordedSeason({ assistStory: true }));

  await expect(page.locator(".result-hero-copy > p")).toContainText("스토리 모드");
  const lines = page.getByTestId("logic-report").locator("p");
  await expect(lines).toHaveCount(3);
  await expect(lines.nth(0)).toContainText(`열기가 가장 높았던 사건은 사건 03 「${HOT_CASE.title}」입니다.`);
  await expect(lines.nth(1)).toHaveText(/^논리 유지력 \d{1,3}점 · 최고 논리 콤보 9$/);
  await expect(lines).toHaveText(await expectedLines(page));
  await expect(page.getByTestId("logic-report")).not.toContainText(/순위|상위/);
  expect(asked).toEqual([]);
  await keepScreenshots(page, testInfo, "story");
});

// A season begun before the table paid the logic streak is on no ranking (the
// server refuses its row, 20261011010000): the panel treats it as it treats a
// story season, and the ranking row is not posted to be refused.
test("a season with a case from before the logic table prints the score and no rank, and posts no ranking row", async ({ page }, testInfo) => {
  test.setTimeout(120_000);
  // The server would place any score in the top tenth; this season does not ask it.
  const asked = await answerCutoffs(page, json({ n: 64, cuts: { 50: 0, 25: 0, 10: 0 } }));
  const posted = await collectPostedRows(page);
  // 사건 07 closed at the beat table: a summary with no streak in it. The research box is ticked.
  await openTheRecord(page, { ...recordedSeason(), case07: closedCase("case07") }, { save: { dataConsent: true } });

  const lines = page.getByTestId("logic-report").locator("p");
  await expect(lines).toHaveCount(3);
  await expect(lines.nth(0)).toContainText(`열기가 가장 높았던 사건은 사건 03 「${HOT_CASE.title}」입니다.`);
  await expect(lines.nth(1)).toHaveText(/^논리 유지력 \d{1,3}점 · 최고 논리 콤보 9$/);
  await expect(lines).toHaveText(await expectedLines(page));
  await expect(page.getByTestId("logic-report")).not.toContainText(/순위|상위/);
  expect(asked).toEqual([]);

  // The finale's own row went out and the queue is empty: no ranking row was held back to send later.
  await expect.poll(() => posted, { timeout: 20_000 }).toContain("final");
  await expect.poll(async () => (await readJsonStorage(page, TEST_STORAGE_KEYS.save)).pendingTelemetry, { timeout: 20_000 }).toEqual([]);
  expect(posted, "no ranking row was posted").not.toContain("season-final");
  // This device's own ranking keeps the season.
  const local = await readJsonStorage(page, TEST_STORAGE_KEYS.localRanking, []);
  expect(local.map((row) => row.case_id)).toContain("season-final");
  await keepScreenshots(page, testInfo, "beat-table");
});

// A season the device takes for a logic-table one can still be refused: a case
// closed at the beat table and played again keeps the replay's summary here,
// and the server keeps the first close's row. The record's status line says why.
test("a ranking row refused for a case from the beat table is said on the record's status line", async ({ page }) => {
  test.setTimeout(120_000);
  const posted = await collectPostedRows(page, (row) => (row.case_id === "season-final" ? refusal("beat-table runs are not ranked") : null));
  await answerCutoffs(page, json({ n: 12 }));
  await openTheRecord(page, recordedSeason(), { save: { dataConsent: true } });

  await expect.poll(() => posted, { timeout: 20_000 }).toEqual(["final", "season-final"]);
  // The status line is in the report's third act, which is drawn once it is opened.
  await page.locator("details.report-archive > summary").click();
  await expect(page.locator(".report-archive-body")).toBeVisible();
  const status = page.locator(".session-panel .remote-status");
  await expect(status).toHaveText(
    "지금 판 규칙이 생기기 전에 마친 사건이 있어, 이 회차는 온라인 시즌 랭킹에 오르지 않습니다. 이 기기의 순위 기록과 JSON 내보내기에는 남아 있습니다.",
    { timeout: 20_000 },
  );
  await expect(status).toHaveClass(/error/);
  await expect(status).not.toContainText("서버가 받지 않은 기록");
  // Let go, not kept to be asked again: nothing waits, and it was asked once.
  await expect.poll(async () => (await readJsonStorage(page, TEST_STORAGE_KEYS.save)).pendingTelemetry).toEqual([]);
  await expect(page.locator(".retry-telemetry")).toHaveCount(0);
  expect(posted.filter((caseId) => caseId === "season-final")).toHaveLength(1);
  await status.scrollIntoViewIfNeeded();
  await expect(status).toBeVisible();
});

// The season scores in the 80s (the seeded cases' 100 x 37 / 42, and the finale's own window).
for (const [title, answer, cutoffs, rank, label] of [
  ["a score over the top tenth's cut is told 상위 10% 안", json({ n: 64, cuts: { 50: 10, 25: 20, 10: 30 } }), { n: 64, cuts: { 50: 10, 25: 20, 10: 30 } }, " · 상위 10% 안", "band"],
  ["a score under the median is told no rank", json({ n: 64, cuts: { 50: 98, 25: 99, 10: 100 } }), { n: 64, cuts: { 50: 98, 25: 99, 10: 100 } }, "", "under-median"],
  ["a server without the ranking's function leaves the score with no rank, and nothing is said of it", NO_FUNCTION, null, "", "no-function"],
]) {
  test(title, async ({ page }, testInfo) => {
    test.setTimeout(120_000);
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(String(error)));
    // What the app would print of the refusal (the browser's own line for a 404 names no function).
    const warnings = [];
    page.on("console", (message) => {
      if (message.text().includes("logic_hold_cutoffs")) warnings.push(message.text());
    });
    const asked = await answerCutoffs(page, answer);
    await openTheRecord(page, recordedSeason());

    await expect.poll(() => asked.length, "the ranking was asked").toBe(1);
    const panel = page.getByTestId("logic-report");
    const lines = panel.locator("p");
    await expect(lines).toHaveCount(3);
    await expect(lines.nth(1)).toHaveText(new RegExp(`^논리 유지력 \\d{1,3}점 · 최고 논리 콤보 9${rank}$`));
    await expect(lines).toHaveText(await expectedLines(page, cutoffs));
    if (!rank) await expect(panel).not.toContainText(/순위|상위/);
    expect(asked, "asked once").toHaveLength(1);
    expect(warnings).toEqual([]);
    expect(pageErrors).toEqual([]);
    await keepScreenshots(page, testInfo, label);
  });
}

test("a season whose earlier cases have no logic record names no case", async ({ page }, testInfo) => {
  test.setTimeout(120_000);
  // A save from before the streak: summaries with no record. The finale just played has one.
  // And a build with no server: nothing to ask, so the score stands with no rank.
  await openTheRecord(page, { case01: closedCase("case01"), case02: closedCase("case02") }, { backend: false });

  const lines = page.getByTestId("logic-report").locator("p");
  await expect(lines).toHaveCount(3);
  await expect(lines.nth(0)).toHaveText("논리 콤보 기록이 있는 사건이 아직 적어, 열기가 가장 높았던 사건을 짚지 않습니다.");
  await expect(lines.nth(1)).toContainText(/최고 논리 콤보 \d+/);
  await expect(lines).toHaveText(await expectedLines(page));
  await expect(page.getByTestId("logic-report")).not.toContainText(/순위|상위/);
  await keepScreenshots(page, testInfo, "few-records");
});

/**
 * The record's decision log (전체 기록), for a case with one bust in it. The
 * bust played a scene without the analyst, and its row in the log holds that
 * scene's minutes in the same closed fold the reveal showed -- read from the
 * id the log entry already carries (`skippedNodeId`), so a case closed and
 * reopened later still has them.
 *
 * Reached by the debug jump, on the dev server: the walk is read off the graph
 * (`findSkippedSceneWalk`, the card of 사건 01 nearest its result whose bust
 * skips a scene), busted once, and the case is cashed to its report.
 */
test("the record's decision log holds the skipped scene minutes under the bust's entry, and under no other", async ({ page }) => {
  test.setTimeout(240_000);
  const walk = findSkippedSceneWalk("case01");
  expect(walk, "사건 01 still has a card whose bust skips a scene").not.toBeNull();
  const skipped = nodes[walk.skippedId];
  await startDebugNode(page, walk.caseId, walk.fromId);
  // The debug overlay is harness chrome; on a phone it sits over the action bar.
  await page.addStyleTag({ content: ".debug-overlay { display: none !important; }" });
  // By its words, whole: the hand is dealt shuffled.
  const words = new RegExp(`^${walk.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);
  const card = page.locator(".choices .choice").filter({ has: page.getByTestId("card-label").filter({ hasText: words }) });
  await clickElement(card, `stake ${walk.label}`);
  await bustStakedCard(page);
  await expect(page.locator(".decision-reveal").getByTestId("scene-minutes")).toHaveCount(1);
  await clickElement(page.getByTestId("decision-next"), "next after the bust");
  await expect(page.locator(".decision-reveal-backdrop")).toHaveCount(0, { timeout: TRANSITION_TIMEOUT_MS });
  await completeCurrentCase(page);
  await expect(page.locator(".result-page")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });

  // One bust in the case, and it is the entry that names the skipped scene.
  const { log } = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  const skips = log.flatMap((entry, index) => (entry.skippedNodeId ? [index] : []));
  expect(skips, "the case holds one decision that skipped a scene").toHaveLength(1);
  expect(log[skips[0]].skippedNodeId).toBe(walk.skippedId);
  expect(log.filter((entry) => entry.threshold?.busted), "the case holds one bust").toHaveLength(1);

  await page.locator("details.report-archive > summary").click();
  await expect(page.locator(".report-archive-body")).toBeVisible();
  const rows = page.locator(".report-archive-body section.history > article");
  await expect(rows).toHaveCount(log.length);
  const row = rows.nth(skips[0]);
  await expect(row.locator("div > b").first()).toHaveText(log[skips[0]].title);
  const fold = row.getByTestId("scene-minutes");
  await expect(fold).toHaveCount(1);
  await expect(page.locator(".report-archive-body section.history").getByTestId("scene-minutes"), "no other row has minutes").toHaveCount(1);
  await expect(fold).toHaveJSProperty("open", false);
  await expectSceneMinutes(fold, skipped);
  await clickElement(fold.locator("summary"), "open the minutes in the record");
  await expect(fold).toHaveJSProperty("open", true);
  await expect(fold.locator("div > p").first()).toBeVisible();
  await expect(fold.locator("div > p.spoken-line")).toBeVisible();
});

// B-12(2) 「당신의 세 장면」 (src/threeScenes.js): 프롤로그 01 and 사건 48 off their
// summaries, the finale's card off its own log, as a list under a heading in
// the ending's last step.
test("the closing report lists the season's three scenes under a heading", async ({ page }) => {
  test.setTimeout(120_000);
  const cardOf = (sceneId, choiceId) => nodes[sceneId].choices.find((choice) => choice.id === choiceId).label;
  const finaleCard = { caseId: "final", nodeId: "f_choice", choiceId: "ending_reform", choice: cardOf("f_choice", "ending_reform") };
  await openTheRecord(page, {
    ...recordedSeason(),
    prologue01: closedCase("prologue01", null, { outcomeChoiceId: "p1_after_credit", outcomeNodeId: "p1_aftershock" }),
    case48: closedCase("case48", null, { outcomeChoiceId: "c48_after_warm", outcomeNodeId: "c48_aftershock", finalChoiceId: "c48_final_condition" }),
  }, { backend: false, save: { log: [finaleCard] } });

  const panel = page.getByTestId("three-scenes");
  await expect(panel).toBeVisible();
  await expect(panel.getByRole("heading", { level: 2 })).toHaveText("당신의 세 장면");
  await expect(panel).toHaveAccessibleName("당신의 세 장면");
  // In the ending's last step, under 「당신이 남긴 것」.
  await expect(page.locator(".ending-step-3 .ending-coda + .three-scenes")).toBeVisible();
  const items = panel.getByRole("listitem");
  await expect(items.locator("span")).toHaveText([
    `프롤로그 01 · ${nodes.p1_aftershock.title}`,
    `사건 48 · ${nodes.c48_final.title}`,
    `마지막 사건 · ${nodes.f_choice.title}`,
  ]);
  await expect(items.locator("p")).toHaveText([cardOf("p1_aftershock", "p1_after_credit"), cardOf("c48_final", "c48_final_condition"), finaleCard.choice]);
  const overflow = await page.evaluate(() => ({ clientWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth }));
  expect(overflow.scrollWidth, "the list does not widen the page").toBeLessThanOrEqual(overflow.clientWidth + 1);
});
