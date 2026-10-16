import { readFile } from "node:fs/promises";
import { expect, expectNoStrayRequests, guardNetwork, test } from "./helpers/network.js";
import { acceptConfirms, dismissConfirms } from "./helpers/dialogs.js";
import { CASE_SEQUENCE, CASE_START_NODES, nodes, seasonCasesBase } from "../src/gameData.js";
import { ENDING_GATES } from "../src/gameConstants.js";
import { SEASON_STANDING_NEAR } from "../src/seasonStanding.js";
import { nextCaseSignals } from "../src/caseCopy.js";
import { NEW_GAME_PLUS_KEY, NEW_GAME_PLUS_MEMORY_KEY } from "../src/appConfig.js";
import { createCaseSummary } from "../src/gameLogic.js";
import { getLogicType } from "../src/gauntlet/logicStreak.js";
import { easyCognitionLabels, easyResourceLabels } from "../src/playerLanguage.js";
import { encodeReplaySeed, REPLAY_QUERY_KEY } from "../src/state/trace.js";
import {
  chooseFirstAvailableChoice,
  clickThroughMotion,
  completeCurrentCase,
  openIntroDrawer,
  resumeSavedRun,
  startFirstRun,
  startDebugNode as startDebugNodeFromHelper,
  cashStakedCard,
  dismissProtocolBreach,
  TRANSITION_TIMEOUT_MS,
  waitForEntrance,
} from "./helpers/gameFlow.js";
import { measureTable } from "./helpers/layout.js";
import { savedRunAt, seedSave } from "./helpers/seededSave.js";
import { readJsonStorage, TEST_STORAGE_KEYS } from "./helpers/storage.js";

async function startDebugNode(page, caseId, nodeId) {
  await startDebugNodeFromHelper(page, caseId, nodeId, {
    navigate: false,
    resetStorage: false,
    expectGameShell: false,
  });
}

test("the last case before the finale can unlock and open it", async ({ page }) => {
  test.setTimeout(180_000);
  const dialogMessages = await acceptConfirms(page);
  await page.goto("/?debug=1");
  await startDebugNode(page, "case49", "c49_aftershock");
  await completeCurrentCase(page);
  await expect(page.locator(".result-page")).toBeVisible();
  const decisionNext = page.getByTestId("decision-next");
  if (await decisionNext.isVisible()) await decisionNext.click();
  await expect(page.locator(".decision-reveal-backdrop")).toBeHidden();
  const playDownloadPromise = page.waitForEvent("download");
  await page.getByTestId("export-play-log").click();
  const playDownload = await playDownloadPromise;
  const playPayload = JSON.parse(await readFile(await playDownload.path(), "utf8"));
  expect(playPayload.exportMode).toBe("summary");
  expect(playPayload.playerName).toBeUndefined();
  expect(playPayload.playtestFeedback).toBeUndefined();
  expect(playPayload.log).toBeUndefined();
  expect(playPayload.sessionId).toBeUndefined();
  expect(playPayload.pendingTelemetry).toBeUndefined();
  expect(playPayload.errorLog).toBeUndefined();
  expect(playPayload.saveSlots).toBeUndefined();
  const diagnosticDownloadPromise = page.waitForEvent("download");
  await page.getByTestId("export-diagnostic-log").click();
  expect(dialogMessages.at(-1)).toContain("피드백 원문");
  const diagnosticDownload = await diagnosticDownloadPromise;
  const diagnosticPayload = JSON.parse(await readFile(await diagnosticDownload.path(), "utf8"));
  expect(diagnosticPayload.exportMode).toBe("diagnostic");
  expect(diagnosticPayload.log).toBeDefined();
  expect(diagnosticPayload.sessionId).toBeDefined();
  expect(Array.isArray(diagnosticPayload.pendingTelemetry)).toBe(true);
  expect(Array.isArray(diagnosticPayload.errorLog)).toBe(true);
  expect(Array.isArray(diagnosticPayload.saveSlots)).toBe(true);
  await page.getByRole("button", { name: /마지막 사건 시작/ }).click();
  await expect(page.getByRole("heading", { name: /끝까지 남은 사람의 마지막 밤|모든 기록을 묶은 사람의 마지막 밤|곧장 올라간 사람의 마지막 밤|인사평가 보조지표/ })).toBeVisible();
});

// Closing the finale sends the season's row to the online ranking. The page
// that opens the finale is the last one before that, and it used to say
// nothing: the first the player heard was the status line after the send.
test("the page that opens the finale says the season record will be sent", async ({ page }) => {
  test.setTimeout(180_000);
  await page.addInitScript(() => {
    localStorage.setItem("critical-point-telemetry-url", "https://e2e.supabase.co");
    localStorage.setItem("critical-point-telemetry-key", "anon");
  });
  await page.goto("/?debug=1");
  await startDebugNode(page, "case49", "c49_aftershock");
  await completeCurrentCase(page);
  await expect(page.locator(".result-page")).toBeVisible();
  const decisionNext = page.getByTestId("decision-next");
  if (await decisionNext.isVisible()) await decisionNext.click();
  await expect(page.locator(".decision-reveal-backdrop")).toBeHidden();
  // The next-case panel is drawn with the report; the notice is inside it.
  await expect(page.locator(".next-case-panel")).toBeVisible();
  const notice = page.locator(".next-case-panel").getByTestId("season-record-notice");
  await expect(notice).toBeVisible();
  await expect(notice).toContainText("피날레를 마치면 이 회차의 시즌 기록이 이름 없이 온라인 랭킹으로 전송됩니다");
  await expect(page.getByRole("button", { name: /마지막 사건 시작/ })).toBeVisible();
});

// A season begun before the table paid the logic streak is refused by the
// ranking (20261011010000), and its row is not sent. The page used to tell it,
// like any other, that the record would go to the online ranking.
test("the page that opens the finale tells a season with a case from before the logic table that it will not rank", async ({ page }) => {
  test.setTimeout(180_000);
  // A returning player's save, one scene from the end of 사건 49, the research box ticked. 사건 48 was closed
  // at the beat table: its summary has no run summary with a streak in it (`hasBeatTableCase`, src/logicReport.js).
  const resources = { time: 72, capital: 100, trust: 50, legitimacy: 50, humanCost: 0, fatigue: 10 };
  const beatCase = createCaseSummary({}, {}, [{ caseId: "case48" }], { resources, schemaVersion: 2 });
  await seedSave(page, savedRunAt("case49", "c49_aftershock", { caseResults: { case48: beatCase }, dataConsent: true }));
  // After the seed, which clears storage.
  await page.addInitScript(() => {
    localStorage.setItem("critical-point-telemetry-url", "https://e2e.supabase.co");
    localStorage.setItem("critical-point-telemetry-key", "anon");
  });
  await page.goto("/");
  await resumeSavedRun(page);
  await completeCurrentCase(page);
  await expect(page.locator(".result-page")).toBeVisible();
  const decisionNext = page.getByTestId("decision-next");
  if (await decisionNext.isVisible()) await decisionNext.click();
  await expect(page.locator(".decision-reveal-backdrop")).toBeHidden();
  const notice = page.locator(".next-case-panel").getByTestId("season-record-notice");
  await expect(notice).toBeVisible();
  await expect(notice).toHaveText("논리 콤보 규칙이 생기기 전에 마친 사건이 있어, 피날레를 마쳐도 이 회차의 시즌 기록은 온라인 랭킹에 오르지 않습니다. 이 기기의 순위 기록에는 남습니다.");
  await expect(notice).not.toContainText("전송됩니다");
  await expect(page.getByRole("button", { name: /마지막 사건 시작/ })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow, "the notice does not widen the page").toBeLessThanOrEqual(1);
});

test("a page that opens an ordinary case says nothing about the season record", async ({ page }) => {
  test.setTimeout(180_000);
  await page.addInitScript(() => {
    localStorage.setItem("critical-point-telemetry-url", "https://e2e.supabase.co");
    localStorage.setItem("critical-point-telemetry-key", "anon");
  });
  await page.goto("/?debug=1");
  await startDebugNode(page, "case01", "c1_aftershock");
  await completeCurrentCase(page);
  await expect(page.locator(".result-page")).toBeVisible();
  const decisionNext = page.getByTestId("decision-next");
  if (await decisionNext.isVisible()) await decisionNext.click();
  await expect(page.locator(".next-case-panel")).toBeVisible();
  await expect(page.getByTestId("season-record-notice")).toHaveCount(0);
});

test("case flow has no unhandled browser runtime errors", async ({ page }) => {
  const runtimeErrors = [];
  page.on("pageerror", (error) => runtimeErrors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(`console: ${message.text()}`);
  });
  await page.goto("/?debug=1");
  await startDebugNode(page, "case05", "c5_voice");
  await chooseFirstAvailableChoice(page);
  await expect(page.getByRole("heading", { name: /말할 수 있는 조건|선의의 실패|책임의 모양/ })).toBeVisible();
  expect(runtimeErrors).toEqual([]);
});

test("the table shows the bet on every card and never a forecast of the next push", async ({ page }) => {
  await page.goto("/?debug=1");
  await startDebugNode(page, "case05", "c5_voice");

  await expect(page.locator(".game-shell")).toBeVisible();
  await expect(page.locator(".decision-forecast, .commit-console, .record-room, .tactical-toggle")).toHaveCount(0);

  // A card says what it pays and what it burns, and nothing else. The chips and
  // the burn are the bet; a temptation, an observer preview or a risk grade on
  // top of them is the board this table replaced.
  const cards = page.locator(".choices .choice:not(.gx-card-wild)");
  const count = await cards.count();
  expect(count).toBeGreaterThan(1);
  for (let index = 0; index < count; index += 1) {
    await expect(cards.nth(index).locator(".gx-card-chips")).toHaveText(/^\+\d+$/);
    await expect(cards.nth(index).locator(".gx-card-burn")).not.toBeEmpty();
  }

  // The odds of the next push are the one number the table must not print: the
  // band is drawn, the wall is not, and the heartbeat is the only instrument.
  const tableText = await page.getByTestId("gauntlet-stage").innerText();
  expect(tableText).not.toMatch(/%/);
  expect(tableText).toMatch(/벽 \d+–\d+/);

  const transparentText = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".game-shell, .gauntlet-stage, .gx-hud, .choices, .choice, .gx-actions button"))
      .filter((element) => {
        const text = element.textContent?.trim();
        if (!text) return false;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden" &&
          (style.color === "transparent" || style.color === "rgba(0, 0, 0, 0)");
      })
      .map((element) => element.className || element.tagName)
      .slice(0, 5),
  );
  expect(transparentText).toEqual([]);
});

/**
 * Walk CASE_SEQUENCE[from..to) case by case from a fresh save, and prove the
 * last case hands over to the next one -- or, at the end of the season, to the
 * ending. Seconds per case: ~25 on CI.
 */
async function walkSeason(page, from, to) {
  await page.goto("/?debug=1");
  await page.getByTestId("unlock-all-cases").click();
  await startDebugNode(page, CASE_SEQUENCE[from], CASE_START_NODES[CASE_SEQUENCE[from]]);

  for (let caseIndex = from; caseIndex < to; caseIndex += 1) {
    await completeCurrentCase(page);
    if (caseIndex < CASE_SEQUENCE.length - 1) {
      const nextCaseButton = page.locator(".next-case-panel button");
      await expect(nextCaseButton).toBeVisible();
      await nextCaseButton.click();
      await expect(page.locator(".game-shell")).toBeVisible();
      await expect
        .poll(async () => (await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2"))))?.currentCase)
        .toBe(CASE_SEQUENCE[caseIndex + 1]);
    }
  }

  if (to === CASE_SEQUENCE.length) {
    await expect(page.locator(".ending-sequence")).toBeVisible();
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")));
    expect(saved.currentCase).toBe("final");
    expect(saved.completedCases).toContain("final");
  }
}

/**
 * The season in segments, each started from a fresh save at its first case.
 * One test for the whole season took ~22 minutes for fifty cases, on one
 * worker, and gated every deploy; a segment is a few minutes, and the
 * parallel mode below lets Playwright hand segments to different workers and
 * different CI shards. Together they play every case and every hand-over.
 * What they cannot show -- resources and flags carried across the whole run --
 * is the uninterrupted walk below, which runs weekly.
 */
const WALK_SEGMENT_CASES = 7;
test.describe("season walk in segments", () => {
  test.describe.configure({ mode: "parallel" });
  // The walk proves the season's flow, which does not depend on the viewport;
  // the phone layouts are held by their own tests. Walking it twice doubled
  // the longest part of the suite.
  test.skip(({ isMobile }) => isMobile, "the season flow is walked once, on desktop");
  for (let from = 0; from < CASE_SEQUENCE.length; from += WALK_SEGMENT_CASES) {
    const to = Math.min(from + WALK_SEGMENT_CASES, CASE_SEQUENCE.length);
    const last = to === CASE_SEQUENCE.length ? "the ending" : CASE_SEQUENCE[to];
    test(`${CASE_SEQUENCE[from]} through ${CASE_SEQUENCE[to - 1]} hands over to ${last}`, { tag: "@season-segment" }, async ({ page }) => {
      test.setTimeout((to - from) * 90_000);
      await walkSeason(page, from, to);
    });
  }
});

test("the complete season can progress from case 01 to the final ending", { tag: "@season-full" }, async ({ page }) => {
  // The whole season in one run: `npm run test:e2e:season`, weekly in Full
  // Coverage. Each case adds roughly 25 seconds; fifty-five take ~24 minutes.
  // The walk opens on the season's own door, CASE_SEQUENCE[0] -- it once
  // entered at 사건 01 after the 프롤로그 moved in front of it, and ran off the
  // end of the sequence.
  test.setTimeout(3_000_000);
  await walkSeason(page, 0, CASE_SEQUENCE.length);
});

// Was "hero entry guides to setup without starting a fresh run" until 2026-09-09.
// The old contract said the first-viewport button must NOT start the game; it
// scrolled to a form instead. This pair replaces it with the opposite contract
// and keeps the guarantee the old assertion stood in for: the second test seeds
// an actual resumable run and proves the hero leaves it byte-identical, which
// the old test could not do because it ran with empty storage.
test("hero entry opens the first scene in one click", { tag: "@prod" }, async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
  await page.goto("/");
  await expect(page.locator(".intro")).toBeVisible();
  await expect(page.locator(".choices .choice")).toHaveCount(0);

  // The burst is on screen for 860ms, and on a CI runner the click itself can
  // take most of that: hovering the button starts parsing the runtime chunk.
  // Polling for it after the click raced it (and lost on every run of
  // 2026-09-29), so the page records whether it was ever drawn.
  await page.evaluate(() => {
    window.__openingBurstSeen = false;
    const observer = new MutationObserver(() => {
      if (document.querySelector("[data-testid='opening-burst']")) {
        window.__openingBurstSeen = true;
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
  await page.getByTestId("start-first-case").click();
  await expect.poll(() => page.evaluate(() => window.__openingBurstSeen), { message: "the opening burst was never drawn" }).toBe(true);
  // The wait every other entry into a run is given (gameFlow.js). This one had
  // eight seconds of its own, and the first request for the season on a cold
  // dev server builds the whole of it before anything is served.
  await expect(page.locator(".game-shell")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  await expect(page.locator(".choices .choice").first()).toBeVisible();

  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")));
  expect(saved.started).toBe(true);
  // The season opens on the 프롤로그, and nothing here names it: the door is
  // whatever CASE_SEQUENCE puts first.
  expect(saved.currentCase).toBe(CASE_SEQUENCE[0]);
  expect(saved.nodeId).toBe(CASE_START_NODES[CASE_SEQUENCE[0]]);
  // No form was filled: the run carries the default call sign, which is what
  // makes the one-click open possible.
  expect(saved.playerName).toBe("분석관");
});

test("hero entry resumes a saved run without clobbering it", { tag: "@prod" }, async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "trigger-prototype-v2",
      JSON.stringify({
        saveSchemaVersion: 2,
        runId: "e2e-resume-guard",
        playerName: "E2E",
        started: false,
        paused: true,
        currentCase: "case05",
        nodeId: "c5_voice",
        completedCases: ["case01", "case02", "case03", "case04"],
        discoveredClues: [],
        log: [{ nodeId: "c5_start", choiceId: "seed" }],
        pendingTelemetry: [],
        caseResults: {},
        playtestFeedback: {},
        resources: { time: 72, capital: 100, trust: 50, legitimacy: 50, humanCost: 0, fatigue: 10 },
        triggers: {},
        cognition: {},
      }),
    );
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  // With a save present the first-viewport action is resume, and the
  // fresh-start control is not in the first viewport at all.
  const resume = page.getByTestId("resume-save");
  await expect(resume).toBeVisible();
  const resumeBox = await resume.boundingBox();
  expect(resumeBox.y + resumeBox.height).toBeLessThanOrEqual(844);
  const freshBox = await page.getByTestId("start-first-case").boundingBox();
  expect(freshBox.y).toBeGreaterThan(844);

  // One click, from a plain "/" load: the shell has to write the resume itself
  // or the runtime mounts on a paused save and renders the intro again.
  await resumeSavedRun(page);

  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")));
  expect(saved.runId).toBe("e2e-resume-guard");
  expect(saved.currentCase).toBe("case05");
  expect(saved.nodeId).toBe("c5_voice");
  expect(saved.log).toHaveLength(1);
  expect(saved.completedCases).toHaveLength(4);
});

/**
 * NEW GAME+. A finished season leaves two things on the device: the button,
 * and the season's record, which the intro shows. Pressed on the pre-start
 * shell, the press is handed to the runtime (queueRuntimeStartAction), which
 * starts the season again from its first scene. Nothing pressed that button in
 * a browser: the shell once answered it with a plain new game, and only a unit
 * test of the reducer would have noticed.
 */
const FINISHED_SEASON = { case01: { outcomeChoiceId: "c1_public" }, final: { outcomeChoiceId: "f_archive_seal" } };

async function seedFinishedSeason(page, save = null) {
  await page.addInitScript(
    ({ unlockedKey, memoryKey, memory, saveText }) => {
      // Once a tab: the reloads below have to find what the page itself wrote.
      if (sessionStorage.getItem("e2e-seeded")) return;
      sessionStorage.setItem("e2e-seeded", "1");
      localStorage.clear();
      localStorage.setItem(unlockedKey, "true");
      localStorage.setItem(memoryKey, memory);
      if (saveText) localStorage.setItem("trigger-prototype-v2", saveText);
    },
    { unlockedKey: NEW_GAME_PLUS_KEY, memoryKey: NEW_GAME_PLUS_MEMORY_KEY, memory: JSON.stringify(FINISHED_SEASON), saveText: save ? JSON.stringify(save) : null },
  );
}

test("NEW GAME+ starts the season again and keeps the finished one on the intro", { tag: "@prod" }, async ({ page }) => {
  const asked = await acceptConfirms(page);
  await seedFinishedSeason(page);
  await page.goto("/");
  const memory = page.locator(".past-run-memory");
  await expect(memory).toContainText("PAST RUN MEMORY");
  await expect(memory).toContainText("이전 기록에서");
  const button = page.getByRole("button", { name: "NEW GAME+ 시작" });
  await expect(button).toBeVisible();

  await button.click();
  await expect(page.locator(".game-shell")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  // No run was there to lose, so nothing was asked.
  expect(asked).toEqual([]);
  // The table is on the screen a moment before its save is: waited for, not read once.
  const readSave = () => page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2") || "null"));
  await expect.poll(async () => (await readSave())?.started, { timeout: TRANSITION_TIMEOUT_MS }).toBe(true);
  const saved = await readSave();
  expect(saved.started).toBe(true);
  expect(saved.currentCase).toBe(CASE_SEQUENCE[0]);
  expect(saved.nodeId).toBe(CASE_START_NODES[CASE_SEQUENCE[0]]);
  expect(saved.completedCases).toEqual([]);
  expect(saved.log).toEqual([]);
  // The season it came from is still on the device, whole.
  expect(await page.evaluate((key) => localStorage.getItem(key), NEW_GAME_PLUS_KEY)).toBe("true");
  expect(JSON.parse(await page.evaluate((key) => localStorage.getItem(key), NEW_GAME_PLUS_MEMORY_KEY))).toEqual(FINISHED_SEASON);
});

test("NEW GAME+ over a run that can be resumed asks first, and a no leaves the run alone", { tag: "@prod" }, async ({ page }) => {
  const run = {
    saveSchemaVersion: 2,
    runId: "e2e-ngplus-guard",
    playerName: "E2E",
    started: false,
    paused: true,
    currentCase: "case05",
    nodeId: "c5_voice",
    completedCases: ["case01", "case02", "case03", "case04"],
    discoveredClues: [],
    log: [{ nodeId: "c5_start", choiceId: "seed" }],
    pendingTelemetry: [],
    caseResults: {},
    playtestFeedback: {},
    resources: { time: 72, capital: 100, trust: 50, legitimacy: 50, humanCost: 0, fatigue: 10 },
    triggers: {},
    cognition: {},
  };
  await seedFinishedSeason(page, run);
  const asked = await dismissConfirms(page);
  await page.goto("/");
  await expect(page.getByTestId("resume-save")).toBeVisible();
  const button = page.getByRole("button", { name: "NEW GAME+ 시작" });

  await button.click();
  await expect.poll(() => asked.length).toBe(1);
  expect(asked[0]).toContain("NEW GAME+로 새로 시작할까요");
  // Answered no: the intro is still up and the run is as it was.
  await expect(page.getByTestId("resume-save")).toBeVisible();
  await expect(page.getByTestId("opening-burst")).toHaveCount(0);
  let saved = await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")));
  expect(saved.runId).toBe("e2e-ngplus-guard");
  expect(saved.currentCase).toBe("case05");
  expect(saved.completedCases).toHaveLength(4);

  await acceptConfirms(page);
  await button.click();
  await expect(page.locator(".game-shell")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  expect(asked).toHaveLength(2);
  // The new run's save lands a moment after its table does.
  await expect
    .poll(async () => (await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2") || "null")))?.currentCase, { timeout: TRANSITION_TIMEOUT_MS })
    .toBe(CASE_SEQUENCE[0]);
  saved = await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")));
  expect(saved.runId).not.toBe("e2e-ngplus-guard");
  expect(saved.currentCase).toBe(CASE_SEQUENCE[0]);
  expect(saved.completedCases).toEqual([]);
});

// A preference write goes through persist(), which materialises a full save
// when none exists. That save must not turn the hero into a resume button for
// a run that never happened.
test("a consent tick does not turn the hero into a resume button", { tag: "@prod" }, async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
  await page.goto("/");
  await openIntroDrawer(page, ".data-info-panel");
  const consentCheckbox = page.locator(".consent-box input");
  // The box starts ticked, so check() first was a press that pressed nothing
  // (and `force` hid that): the two writes are an untick and a tick.
  await expect(consentCheckbox).toBeChecked();
  await consentCheckbox.uncheck();
  await expect(consentCheckbox).not.toBeChecked();
  await consentCheckbox.check();
  await expect(consentCheckbox).toBeChecked();
  // The preference was written: there is a save, and it is not a run.
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2") || "null")?.dataConsent)).toBe(true);

  await page.reload();
  await expect(page.getByTestId("start-first-case")).toBeVisible();
  await expect(page.getByTestId("resume-save")).toHaveCount(0);
});

// The box is ticked on a first visit and lives in a closed drawer. The line by
// the start button is the only thing a person who never opens the drawer is
// told, so it has to be there exactly while records would be sent.
test("the start button says play records are sent, for as long as they are", { tag: "@prod" }, async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("critical-point-telemetry-url", "https://e2e.supabase.co");
    localStorage.setItem("critical-point-telemetry-key", "anon");
  });
  await page.goto("/");
  const line = page.locator(".intro-launch").getByTestId("consent-line");
  await expect(line).toBeVisible();
  await expect(line).toContainText("익명 전송");
  await expect(line).toContainText("데이터 저장 안내");
  // Said without opening anything.
  await expect(page.locator(".data-info-panel")).toBeHidden();

  // The drawer's name in the line opens the drawer and brings the box to the screen.
  const consentCheckbox = page.locator(".consent-box input");
  await line.getByRole("link", { name: "데이터 저장 안내" }).click();
  await expect(page.locator(".data-info-panel")).toBeVisible();
  await expect(consentCheckbox).toBeInViewport();
  await expect(consentCheckbox).toBeChecked();
  await consentCheckbox.uncheck();
  await expect(page.getByTestId("consent-line")).toHaveCount(0);
  await consentCheckbox.check();
  await expect(line).toBeVisible();
});

test("a build with no backend does not say records are sent", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("start-first-case")).toBeVisible();
  await expect(page.getByTestId("consent-line")).toHaveCount(0);
});

test("representative branch choices advance without browser runtime errors", async ({ page }) => {
  // 23 to 40 seconds alone on the desktop this is written on and about 30 in
  // CI, against the 60-second default: it timed out whenever another run
  // shared the machine (three times on 2026-10-11, once on 2026-10-12).
  test.setTimeout(120_000);
  const runtimeErrors = [];
  page.on("pageerror", (error) => runtimeErrors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(`console: ${message.text()}`);
  });
  await page.addInitScript(() => localStorage.clear());

  const samples = [
    { caseId: "case01", nodeId: "accounting", choiceIndex: 3 },
    { caseId: "case02", nodeId: "c2_trace", choiceIndex: 1 },
    { caseId: "case03", nodeId: "c3_signal", choiceIndex: 2 },
    { caseId: "case04", nodeId: "c4_aftershock", choiceIndex: 0 },
    { caseId: "case05", nodeId: "c5_voice", choiceIndex: 0 },
    { caseId: "final", nodeId: "f_aftershock", choiceIndex: 2 },
  ];

  for (const { caseId, nodeId, choiceIndex } of samples) {
    const scene = nodes[nodeId];
    const choice = scene.choices[choiceIndex];
    await page.goto("/?debug=1");
    await startDebugNode(page, caseId, nodeId);
    await expect(page.locator(".game-shell")).toBeVisible();

    await dismissProtocolBreach(page);
    if (choice.type === "reframe") {
      await page.locator(".gx-card-wild").click();
      await cashStakedCard(page);
    } else {
      const fixedChoiceIndex = scene.choices
        .slice(0, choiceIndex + 1)
        .filter((candidate) => candidate.type !== "reframe").length - 1;
      await page.locator(".choices .choice").nth(fixedChoiceIndex).click();
      await expect(page.locator(".gx-card.selected")).toBeVisible();
      await cashStakedCard(page);
    }

    await expect(page.getByTestId("decision-next")).toBeVisible();
    await page.getByTestId("decision-next").click();
    await expect(page.locator(".game-shell, .result-page, .ending-reveal").first()).toBeVisible();
  }

  expect(runtimeErrors).toEqual([]);
});

test("debug jump opens case 05 scenes directly", async ({ page }) => {
  await page.goto("/?debug=1");
  await startDebugNode(page, "case05", "c5_voice");

  await expect(page.getByRole("heading", { name: "이름 없는 증언" })).toBeVisible();
  await chooseFirstAvailableChoice(page);
  await expect(page.getByRole("heading", { name: /말할 수 있는 조건|선의의 실패|책임의 모양/ })).toBeVisible();
});

/**
 * Whether a pointer at the middle of the control lands on the control. The
 * action bar is `position: fixed`, so its buttons are "inside the viewport"
 * whatever the page under them does; what can go wrong is something drawn over
 * them.
 */
const pointerLandsOn = (locator) =>
  locator.evaluate((element) => {
    const box = element.getBoundingClientRect();
    const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
    return Boolean(hit && (hit === element || element.contains(hit)));
  });

test("mobile decision actions stay reachable without manual page scrolling", async ({ page }) => {
  await page.goto("/?debug=1");
  await startDebugNode(page, "case05", "c5_voice");
  await page.addStyleTag({ content: ".debug-overlay { display: none !important; }" });
  await page.locator(".choices .choice").first().click();
  await expect(page.locator(".gx-card.selected")).toBeVisible();

  // The bar's own position proves nothing: it is fixed. The hand is what has
  // to be on the screen with it -- every card above the bar, nothing scrolled.
  const table = await measureTable(page);
  expect(table.lastCard, `last card ${table.lastCard - table.actionsTop}px under the action bar`).toBeLessThanOrEqual(table.actionsTop);
  expect(await page.evaluate(() => window.scrollY), "nothing was scrolled to get there").toBe(0);
  expect(await pointerLandsOn(page.getByTestId("commit-push")), "밀어붙인다 is not covered").toBe(true);
  expect(await pointerLandsOn(page.getByTestId("commit-confirm")), "확정 is not covered").toBe(true);

  const pushButton = page.getByTestId("commit-push");
  const pushBox = await pushButton.boundingBox();
  expect(pushBox).not.toBeNull();
  expect(pushBox.y + pushBox.height).toBeLessThanOrEqual(page.viewportSize().height + 2);

  const commitButton = page.getByTestId("commit-confirm");
  await expect(commitButton).toBeVisible();
  const commitBox = await commitButton.boundingBox();
  const viewport = page.viewportSize();
  expect(commitBox).not.toBeNull();
  expect(commitBox.y + commitBox.height).toBeLessThanOrEqual(viewport.height + 2);

  await commitButton.click();
  const nextButton = page.getByTestId("decision-next");
  await expect(nextButton).toBeVisible();
  const nextBox = await nextButton.boundingBox();
  expect(nextBox).not.toBeNull();
  expect(nextBox.y + nextBox.height).toBeLessThanOrEqual(viewport.height + 2);
  expect(await pointerLandsOn(nextButton), "the reveal's next button is not covered").toBe(true);
  const overflow = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
});

// 판을 다시 짠다 buys a scene nobody else sees: the case's hidden route. It used
// to land on the shared branch detour, which the fixed choices could also reach,
// so the reward was invisible -- and it used to be gated on a typed sentence
// scoring three of four keyword buckets, which the player could not see either.
test("판을 다시 짠다 enters the case's hidden route", async ({ page }) => {
  await page.goto("/?debug=1");
  await startDebugNodeFromHelper(page, "case01", "payday", { navigate: false, resetStorage: false, expectGameShell: false, openTable: false });
  // The guide sends the player to "'판을 다시 짠다' 카드", and this scene's card
  // is labelled 다른 방법을 제안한다: the name is on it, in the briefing's list
  // and on the table, and the English "WILD" that stood for it is gone.
  const listed = page.getByTestId("scene-briefing").getByTestId("briefing-card").last();
  await expect(listed.getByTestId("wild-name")).toHaveText("판을 다시 짠다");
  await expect(listed.locator("span").first(), "the card's own label is still the first thing on it").toHaveText(nodes.payday.choices.find((choice) => choice.type === "reframe").label);
  await dismissProtocolBreach(page);
  const wild = page.locator(".gx-card-wild");
  await expect(wild.getByTestId("wild-name")).toBeVisible();
  await expect(wild.getByTestId("wild-name")).toHaveText("판을 다시 짠다");
  await expect(wild.getByTestId("card-type")).toHaveCount(1);
  await expect(wild.locator(".gx-card-burn")).toHaveText("이 판을 다시 연다");
  await expect(wild.locator(".gx-card-chips")).toHaveText(/^\+\d+$/);
  await expect(wild).not.toContainText("WILD");
  await wild.click();
  await page.getByTestId("commit-confirm").click();
  await expect(page.getByTestId("decision-next")).toBeVisible();
  await page.getByTestId("decision-next").click();
  await expect
    .poll(async () => page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2") || "null")?.nodeId))
    .toBe("c1_route_system");
});

// 사건 16's interlude is a dated record of five lines, and the fourth is the
// player's: the label of the card picked at the committee, as the run's log
// holds it. A run that never sat in that scene (here, one opened on the
// aftermath) is shown a line that is true of every route instead.
test("사건 16's interlude prints the card picked at the committee, or its fallback line", async ({ page }) => {
  test.setTimeout(180_000);
  const { text, fallback } = nextCaseSignals.case16.interlude;
  const cardAt = text.findIndex((line) => line.includes("{card}"));
  const picked = nodes.c16_final.choices[1].label;
  const lines = page.locator(".result-page .interlude-panel p");

  await page.goto("/?debug=1");
  await startDebugNode(page, "case16", "c16_final");
  // By its label: the hand is dealt shuffled, so a position is not a card.
  await page.locator(".choices .choice", { hasText: picked }).click();
  await cashStakedCard(page);
  await page.getByTestId("decision-next").click({ timeout: TRANSITION_TIMEOUT_MS });
  await expect(page.locator(".decision-reveal-backdrop")).toHaveCount(0, { timeout: TRANSITION_TIMEOUT_MS });
  await completeCurrentCase(page);
  await expect(page.locator(".result-page")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  await expect(lines).toHaveText(text.map((line) => line.replace("{card}", picked)));
  await expect(lines).toHaveCount(5);
  // The label of the entry the report's decision log prints for that scene.
  const logged = await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2") || "null")?.log?.find((entry) => entry.nodeId === "c16_final")?.choice);
  expect(logged).toBe(picked);
  await expect(lines.nth(cardAt)).toHaveText(`12월 3일 — 당신이 고른 것: ${logged}.`);

  await startDebugNodeFromHelper(page, "case16", "c16_aftershock");
  await completeCurrentCase(page);
  await expect(page.locator(".result-page")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  await expect(lines).toHaveText(text.map((line) => (line.includes("{card}") ? fallback : line)));
  await expect(page.locator(".result-page .interlude-panel")).not.toContainText("당신이 고른 것");
});

// The action bar is `position: fixed`, so "the confirm button is inside the
// viewport" was true of any layout at all: this passed while the hand sat a
// screen and a half below the bar. What a phone on its side has to show is the
// last card above the bar with nothing scrolled, the rule priority 27 holds an
// upright phone to. 667x375 is an iPhone SE or 8; 844x390 an iPhone 14.
//
// The layout is for phones: it is behind `(pointer: coarse)`, because a laptop
// zoomed to 200% is this short too and is not a phone. So the phone tests run
// in a touch context on both projects, and say so before they measure.
const isPhoneOnItsSide = (page) =>
  page.evaluate(() => matchMedia("(max-height: 480px) and (orientation: landscape) and (pointer: coarse)").matches);

test.describe("a phone on its side", () => {
  test.use({ hasTouch: true, isMobile: true });

  for (const size of [{ width: 667, height: 375 }, { width: 844, height: 390 }]) {
    test(`a phone on its side keeps the whole decision on one screen at ${size.width}x${size.height}`, async ({ page }) => {
      await page.setViewportSize(size);
      await page.goto("/?debug=1");
      await startDebugNode(page, "final", "f_start_owner");
      expect(await isPhoneOnItsSide(page), "the context is a touch screen on its side").toBe(true);
      await page.addStyleTag({ content: ".debug-overlay { display: none !important; }" });
      await page.locator(".choices .choice:not(.gx-card-wild)").last().dispatchEvent("click");
      const layout = await page.evaluate(() => {
        const cards = [...document.querySelectorAll(".choices .choice")].map((card) => card.getBoundingClientRect().bottom);
        return {
          cards: cards.length,
          lastCard: Math.round(Math.max(...cards)),
          actionsTop: Math.round(document.querySelector(".gx-actions").getBoundingClientRect().top),
          pageHeight: document.documentElement.scrollHeight,
          pageWidth: document.documentElement.scrollWidth,
        };
      });
      expect(layout.cards).toBeGreaterThan(3);
      expect(layout.lastCard, `last card ${layout.lastCard - layout.actionsTop}px under the action bar`).toBeLessThanOrEqual(layout.actionsTop);
      expect(layout.pageHeight, "the table scrolls").toBeLessThanOrEqual(size.height + 2);
      expect(layout.pageWidth).toBeLessThanOrEqual(size.width + 1);
    });
  }

  // The table cuts the question and each card to two lines here, and the fold
  // that prints them whole was hidden with the lines the briefing already
  // said. It is on the speaker's line, and beside the question on a screen too
  // short to have one, so it costs no height: the table still does not scroll.
  for (const size of [{ width: 667, height: 375 }, { width: 640, height: 360 }]) {
    test(`a phone on its side can read the question and the cards whole at ${size.width}x${size.height}`, async ({ page }) => {
      await page.setViewportSize(size);
      await page.goto("/?debug=1");
      await startDebugNode(page, "case02", "c2_trace");
      expect(await isPhoneOnItsSide(page), "the context is a touch screen on its side").toBe(true);
      await page.addStyleTag({ content: ".debug-overlay { display: none !important; }" });
      const question = nodes.c2_trace.question ?? (await page.locator(".gx-question").textContent());
      const cut = await page.locator(".gx-question").evaluate((element) => element.scrollHeight > element.clientHeight + 1);
      expect(cut, "the longest question in the season does not fit two lines here").toBe(true);
      const fold = page.locator(".gx-brief summary");
      await expect(fold).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollHeight), "the fold costs the table no height").toBeLessThanOrEqual(size.height + 2);
      expect(await pointerLandsOn(fold), "the fold is not covered").toBe(true);
      await fold.click();
      // The fold draws the question and the cards only once it is open, and it
      // learns that from the toggle event: read at the click, the list still
      // holds the case facts alone (main's Verify of 2026-10-08, both sizes).
      await expect.poll(() => page.locator(".gx-brief li").allTextContents()).toContain(question);
      const lines = await page.locator(".gx-brief li").allTextContents();
      // Each card is printed whole with its type's full name after it: the
      // card's own tag is one word of that name on a screen this narrow.
      const dealt = nodes.c2_trace.choices.filter((choice) => choice.type !== "reframe");
      for (const choice of dealt) {
        const printed = `: ${choice.label} (${easyCognitionLabels[getLogicType(choice)]})`;
        expect(lines.some((line) => line.endsWith(printed)), `the fold prints "${printed}"`).toBe(true);
      }
      const widest = await page.locator(".gx-brief li").evaluateAll((items) => items.filter((item) => item.scrollWidth > item.clientWidth + 1).length);
      expect(widest, "nothing in the fold is cut").toBe(0);
    });
  }
  test("landscape mobile keeps decision actions within the viewport", async ({ page }) => {
    await page.setViewportSize({ width: 667, height: 375 });
    await page.goto("/?debug=1");
    await startDebugNode(page, "case05", "c5_voice");
    expect(await isPhoneOnItsSide(page), "the context is a touch screen on its side").toBe(true);
    await page.addStyleTag({ content: ".debug-overlay { display: none !important; }" });
    await page.locator(".choices .choice").first().click();
    // "Within the viewport" is true of a fixed bar on any layout. The hand has
    // to be above it, and the buttons have to be what a finger lands on.
    const table = await measureTable(page);
    expect(table.lastCard, `last card ${table.lastCard - table.actionsTop}px under the action bar`).toBeLessThanOrEqual(table.actionsTop);
    const commitButton = page.getByTestId("commit-confirm");
    await expect(commitButton).toBeVisible();
    const commitBox = await commitButton.boundingBox();
    expect(commitBox).not.toBeNull();
    expect(commitBox.y + commitBox.height).toBeLessThanOrEqual(375 + 2);
    expect(await pointerLandsOn(commitButton), "확정 is not covered").toBe(true);
    expect(await pointerLandsOn(page.getByTestId("commit-push")), "밀어붙인다 is not covered").toBe(true);
    await commitButton.click();
    const nextButton = page.getByTestId("decision-next");
    await expect(nextButton).toBeVisible();
    const nextBox = await nextButton.boundingBox();
    expect(nextBox).not.toBeNull();
    expect(nextBox.y + nextBox.height).toBeLessThanOrEqual(375 + 2);
    expect(await pointerLandsOn(nextButton), "the reveal's next button is not covered").toBe(true);
  });

  // The briefing's footer -- the hint, every card and 판 열기 -- was docked to
  // the bottom of the page at every size: 231px of a 375px screen here, which
  // left the story a strip to scroll through. On a short screen only 판 열기
  // stays docked, and the cards are where the page ends.
  test("a phone on its side reads the briefing above one docked button", async ({ page }) => {
    await page.setViewportSize({ width: 667, height: 375 });
    await startDebugNodeFromHelper(page, "final", "f_start_owner", { openTable: false });
    await page.addStyleTag({ content: ".debug-overlay { display: none !important; }" });
    // Held first, so the reading clock does not open the table under the measurement.
    await page.getByTestId("reading-timer").click();
    await expect(page.getByTestId("reading-timer")).toHaveAttribute("aria-pressed", "true");
    expect(await isPhoneOnItsSide(page), "the context is a touch screen on its side").toBe(true);
    const openButton = page.getByTestId("open-table");
    await expect(openButton).toBeVisible();
    const measure = () =>
      page.evaluate(() => {
        const sheet = document.querySelector(".gx-comic-page");
        const open = document.querySelector("[data-testid='open-table']").getBoundingClientRect();
        const cards = [...document.querySelectorAll("[data-testid='briefing-card']")].map((card) => card.getBoundingClientRect());
        return {
          pageHeight: sheet.clientHeight,
          openTop: Math.round(open.top),
          openBottom: Math.round(open.bottom),
          lastCardBottom: Math.round(Math.max(...cards.map((card) => card.bottom))),
          firstCardTop: Math.round(Math.min(...cards.map((card) => card.top))),
          atEnd: sheet.scrollTop + sheet.clientHeight >= sheet.scrollHeight - 1,
        };
      });
    const atTop = await measure();
    expect(atTop.openBottom, "판 열기 is on screen before any scrolling").toBeLessThanOrEqual(375);
    expect(atTop.openTop, "and what is docked leaves three quarters of the page to read").toBeGreaterThanOrEqual(atTop.pageHeight * 0.75);
    expect(atTop.firstCardTop, "the cards are not docked with it").toBeGreaterThan(375);
    expect(await pointerLandsOn(openButton), "판 열기 is not covered").toBe(true);
    await page.locator(".gx-comic-page").evaluate((sheet) => sheet.scrollTo(0, sheet.scrollHeight));
    const atEnd = await measure();
    expect(atEnd.atEnd).toBe(true);
    expect(atEnd.lastCardBottom, "the last card is above the docked button").toBeLessThanOrEqual(atEnd.openTop);
    expect(await pointerLandsOn(page.getByTestId("briefing-card").last()), "the last card can be pressed").toBe(true);
  });
});

// The briefing on a phone held upright. Its page is longer than the screen on
// every scene, and the room's drawing used to keep its whole height at the top
// of it: on a 360x740 phone the story began under the docked footer, so the
// first screen was a picture and no words. The picture is what gives way now
// (briefing.css): cropped to a band while the page is longer than the screen,
// whole when it is not.
const measureBriefing = (page) =>
  page.evaluate(() => {
    const box = (selector) => document.querySelector(selector).getBoundingClientRect();
    const sheet = document.querySelector(".gx-comic-page");
    const panels = [...document.querySelectorAll(".gx-comic-page .gx-panel")].map((panel) => panel.getBoundingClientRect().bottom);
    return {
      pictureHeight: Math.round(box(".gx-panel-splash").height),
      drawingHeight: Math.round(box(".gx-panel-splash .gx-plate").height),
      storyTop: Math.round(box(".gx-panel-story .gx-caption").top),
      lastPanelBottom: Math.round(Math.max(...panels)),
      dockTop: Math.round(box(".gx-comic-actions").top),
      openBottom: Math.round(box("[data-testid='open-table']").bottom),
      scrollTop: Math.round(sheet.scrollTop),
      scrolls: sheet.scrollHeight > sheet.clientHeight + 1,
      pageWidth: document.documentElement.scrollWidth,
      focusInside: Boolean(document.activeElement?.closest(".gx-comic-page")),
    };
  });

async function openHeldBriefing(page, caseId, nodeId) {
  await startDebugNodeFromHelper(page, caseId, nodeId, { openTable: false });
  await page.addStyleTag({ content: ".debug-overlay { display: none !important; }" });
  // Held first, so the reading clock does not open the table under the measurement.
  await page.getByTestId("reading-timer").click();
  await expect(page.getByTestId("reading-timer")).toHaveAttribute("aria-pressed", "true");
  // The panels pop in one after another; measured before they land, a box is
  // read mid-scale.
  await waitForEntrance(page.getByTestId("scene-briefing"));
}

test.describe("a phone held upright", () => {
  test.use({ hasTouch: true, isMobile: true });

  for (const size of [{ width: 390, height: 844 }, { width: 360, height: 740 }]) {
    test(`a long briefing gives up the picture's height and keeps 판 열기 on screen at ${size.width}x${size.height}`, async ({ page }) => {
      await page.setViewportSize(size);
      // The longest story in the season.
      await openHeldBriefing(page, "case45", "c45_stories");
      const openButton = page.getByTestId("open-table");
      const atTop = await measureBriefing(page);
      expect(atTop.scrolls, "the page is longer than the screen, and scrolls").toBe(true);
      expect(atTop.pictureHeight, "the picture is cropped to a band").toBeLessThanOrEqual(atTop.drawingHeight - 30);
      expect(atTop.pictureHeight, "and is still a picture").toBeGreaterThanOrEqual(80);
      expect(atTop.storyTop, "the story begins above the docked footer").toBeLessThan(atTop.dockTop);
      expect(atTop.openBottom, "판 열기 is on screen before any scrolling").toBeLessThanOrEqual(size.height);
      expect(await pointerLandsOn(openButton), "판 열기 is not covered").toBe(true);
      expect(atTop.pageWidth, "nothing is wider than the screen").toBeLessThanOrEqual(size.width + 1);

      // The page is what scrolls, and it is the dialog that holds focus: a
      // keyboard moves it without a pointer.
      expect(atTop.focusInside, "focus is inside the page").toBe(true);
      await page.keyboard.press("PageDown");
      await expect.poll(async () => (await measureBriefing(page)).scrollTop, "PageDown scrolls the story").toBeGreaterThan(100);
      expect((await measureBriefing(page)).openBottom, "판 열기 stays docked while the story scrolls").toBeLessThanOrEqual(size.height);

      await page.locator(".gx-comic-page").evaluate((sheet) => sheet.scrollTo(0, sheet.scrollHeight));
      await expect.poll(async () => (await measureBriefing(page)).lastPanelBottom, "the last panel ends above the docked footer").toBeLessThanOrEqual((await measureBriefing(page)).dockTop);
      await clickThroughMotion(openButton, "판 열기 at the end of the page");
      await expect(page.getByTestId("scene-briefing")).toHaveCount(0);
    });
  }

  test("a briefing that fits its screen keeps the whole picture", async ({ page }) => {
    // The shortest story in the season, on a narrow window tall enough for it.
    await page.setViewportSize({ width: 700, height: 1400 });
    await openHeldBriefing(page, "case08", "c8_clerks_reaction");
    const fits = await measureBriefing(page);
    expect(fits.scrolls, "the page fits the screen").toBe(false);
    expect(fits.pictureHeight, "the drawing is shown whole").toBeGreaterThanOrEqual(fits.drawingHeight);
    expect(fits.openBottom, "판 열기 is on screen").toBeLessThanOrEqual(1400);
  });

  // The band holds two things pinned in it: the room's name and clock in a
  // caption at the top left, and the scene's sound at the bottom right. Neither
  // knows where the other ends. The sound was drawn last and 38px tall, so over
  // a caption that runs long it sat on the clock's line: 12 of the season's
  // 1,129 scenes at 390px and 87 at 360px, the worst by 32px (the three below
  // are among them). The caption is drawn over the sound now, and the sound is
  // smaller on a phone.
  const measureBand = (page) =>
    page.evaluate(() => {
      const caption = document.querySelector(".gx-caption-place");
      const sound = document.querySelector(".gx-sfx");
      const word = sound.getBoundingClientRect();
      const band = document.querySelector(".gx-panel-splash").getBoundingClientRect();
      // The lines as they are printed, not the caption's box: a text node's
      // own rectangles, one to a line.
      const lines = [...caption.querySelectorAll("b, span")].flatMap((part) => {
        const range = document.createRange();
        range.selectNodeContents(part.firstChild);
        return [...range.getClientRects()];
      });
      const under = lines.map((line) => Math.min(Math.min(line.right, word.right) - Math.max(line.left, word.left), Math.min(line.bottom, word.bottom) - Math.max(line.top, word.top)));
      return {
        word: sound.textContent,
        lines: lines.length,
        // Positive when a line of the caption and the sound share pixels.
        shared: Math.round(Math.max(...under) * 10) / 10,
        captionOnTop: Number(getComputedStyle(caption).zIndex) > Number(getComputedStyle(sound).zIndex),
        lastLineBelowBand: Math.round((Math.max(...lines.map((line) => line.bottom)) - band.bottom) * 10) / 10,
        bandHeight: Math.round(band.height),
      };
    });

  for (const size of [{ width: 360, height: 740 }, { width: 390, height: 844 }]) {
    test(`the sound in the picture band stays off the caption's lines at ${size.width}x${size.height}`, async ({ page }) => {
      test.setTimeout(180_000);
      await page.setViewportSize(size);
      const expectClear = async (where) => {
        const band = await measureBand(page);
        expect(band.lines, `${where}: the caption prints the room and the clock`).toBeGreaterThanOrEqual(2);
        expect(band.bandHeight, `${where}: the picture is the cropped band`).toBeLessThanOrEqual(100);
        expect(band.shared, `${where}: "${band.word}" shares ${band.shared}px with a line of the caption`).toBeLessThanOrEqual(0.5);
        expect(band.captionOnTop, `${where}: where their boxes meet, the caption is the one drawn on top`).toBe(true);
        expect(band.lastLineBelowBand, `${where}: the caption's last line is inside the band`).toBeLessThanOrEqual(0);
        return band;
      };
      // The longest calm sound over the longest captions.
      for (const [caseId, nodeId] of [["case46", "c46_cage"], ["case24", "c24_final"], ["case18", "c18_evidence_turn"]]) {
        await openHeldBriefing(page, caseId, nodeId);
        const band = await expectClear(`${nodeId} @ ${size.width}x${size.height}`);
        expect(band.word, `${nodeId} makes the three-letter sound`).toBe("지이잉");
      }
      await openHeldBriefing(page, "prologue05", "p5_basement");
      const dealBoard = async (mutations) => {
        const save = await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")));
        // Written from a static page: leaving the table saves its live state on the way out.
        await page.goto("/profile.jpg");
        save.dynamics = { ...(save.dynamics ?? {}), schema: { ...(save.dynamics?.schema ?? {}), mutations }, openSeed: null };
        await page.evaluate((value) => localStorage.setItem("trigger-prototype-v2", JSON.stringify(value)), save);
        await page.goto("/?debug=1");
      };
      // A board that carries a reward is not a broken one. OVERCLOCK used to
      // draw the red panel and the slam; it is told as a rule in force.
      await dealBoard(["overclock"]);
      await expect(page.getByTestId("carried-rules")).toContainText("OVERCLOCK", { timeout: TRANSITION_TIMEOUT_MS });
      await expect(page.getByTestId("protocol-breach")).toHaveCount(0);
      await expect(page.locator(".gx-comic-page")).not.toHaveClass(/is-broken/);
      await expect(page.locator(".gx-sfx")).not.toHaveText(/!$/);
      // A board the last decision broke slams instead, with a mark after it.
      await dealBoard(["aftershock"]);
      await expect(page.getByTestId("protocol-breach")).toContainText("AFTERSHOCK", { timeout: TRANSITION_TIMEOUT_MS });
      await expect(page.getByTestId("carried-rules")).toHaveCount(0);
      await page.addStyleTag({ content: ".debug-overlay { display: none !important; }" });
      await page.getByTestId("reading-timer").click();
      await expect(page.getByTestId("reading-timer")).toHaveAttribute("aria-pressed", "true");
      await waitForEntrance(page.getByTestId("scene-briefing"));
      const broken = await expectClear(`p5_basement on a broken board @ ${size.width}x${size.height}`);
      expect(broken.word, "a broken board slams").toMatch(/!$/);
    });
  }

  // The two music buttons are fixed to the top right of every screen, and each
  // screen keeps that corner clear for them. With their labels they were up to
  // 195px wide on a phone -- more than half of a 360px screen -- and the
  // ending's header ran under them. On a phone they are icons now, 80px.
  //
  // Read as the screen lands and again with the page at its top: the ending
  // arrives a little way down its page. A line of text counts where it is
  // printed, so a line cut short by its box counts only up to the cut.
  const textUnderMusic = (page) =>
    page.evaluate(() => {
      const buttons = [...document.querySelectorAll(".music-controls button")]
        .map((button) => ({ button, box: button.getBoundingClientRect() }))
        .filter(({ button, box }) => {
          if (box.width === 0) return false;
          // A layer over the controls (the briefing page) hides them; nothing is under a button nobody sees.
          const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
          return Boolean(hit && button.contains(hit));
        });
      const found = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        if (!node.textContent.trim() || node.parentElement.closest(".music-controls, .debug-overlay, .sr-only")) continue;
        const range = document.createRange();
        range.selectNodeContents(node);
        for (const line of range.getClientRects()) {
          for (const { box } of buttons) {
            if (Math.min(line.right, box.right) - Math.max(line.left, box.left) <= 0.5 || Math.min(line.bottom, box.bottom) - Math.max(line.top, box.top) <= 0.5) continue;
            // What is left of the line once every box that clips it has, and whether anything shows it.
            const shown = { left: line.left, right: line.right, top: line.top, bottom: line.bottom };
            let seen = true;
            for (let element = node.parentElement; element && element !== document.documentElement; element = element.parentElement) {
              const style = getComputedStyle(element);
              if (style.visibility === "hidden" || Number(style.opacity) === 0) seen = false;
              if (style.overflowX === "visible" && style.overflowY === "visible") continue;
              const clip = element.getBoundingClientRect();
              shown.left = Math.max(shown.left, clip.left);
              shown.right = Math.min(shown.right, clip.right);
              shown.top = Math.max(shown.top, clip.top);
              shown.bottom = Math.min(shown.bottom, clip.bottom);
            }
            const across = Math.min(shown.right, box.right) - Math.max(shown.left, box.left);
            const down = Math.min(shown.bottom, box.bottom) - Math.max(shown.top, box.top);
            if (seen && across > 0.5 && down > 0.5) found.push(`"${node.textContent.trim().slice(0, 24)}" by ${Math.round(across)}x${Math.round(down)}px`);
          }
        }
      }
      return { buttons: buttons.length, found: [...new Set(found)] };
    });

  test("the music buttons stand on no line of text on a phone, on any screen", async ({ page }) => {
    test.setTimeout(240_000);
    const SIZES = [{ width: 360, height: 740 }, { width: 390, height: 844 }];
    const covered = [];
    const read = async (screen, { asLanded = false } = {}) => {
      for (const size of SIZES) {
        await page.setViewportSize(size);
        for (const top of asLanded ? [false, true] : [true]) {
          if (top) await page.evaluate(() => window.scrollTo(0, 0));
          const under = await textUnderMusic(page);
          expect(under.buttons, `${screen} @ ${size.width}x${size.height}: a music button is on the screen`).toBeGreaterThan(0);
          covered.push(...under.found.map((line) => `${screen} @ ${size.width}x${size.height}${top ? "" : ", as it lands"}: ${line}`));
        }
      }
    };

    await page.setViewportSize(SIZES[0]);
    await page.goto("/");
    await expect(page.getByTestId("start-first-case")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
    await read("intro");
    await page.getByRole("button", { name: "랭킹" }).first().click();
    await expect(page.locator(".ranking-page")).toBeVisible();
    await read("ranking");
    await page.goto("/");
    await page.getByRole("button", { name: "게시판" }).first().click();
    await expect(page.locator(".board-page")).toBeVisible();
    await read("board");

    await startDebugNodeFromHelper(page, "case01", "c1_aftershock");
    await page.addStyleTag({ content: ".debug-overlay { display: none !important; }" });
    await expect(page.getByTestId("commit-push")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
    await read("table");
    await completeCurrentCase(page);
    await expect(page.locator(".result-page")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
    await page.addStyleTag({ content: ".debug-overlay { display: none !important; }" });
    await read("사건 01 result");

    await startDebugNodeFromHelper(page, "final", "f_aftershock");
    await completeCurrentCase(page);
    const ending = page.locator(".ending-sequence");
    await expect(ending).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
    await page.addStyleTag({ content: ".debug-overlay { display: none !important; }" });
    // Every twist of the first step, then the quiet line, the message and the opened record.
    for (let press = 0; press < 8 && (await ending.evaluate((section) => section.classList.contains("ending-step-0"))); press += 1) {
      const said = await ending.innerText();
      await read("ending step 0", { asLanded: true });
      await ending.locator("button").first().click();
      // The next twist, or the next step, is a new screen of words.
      await expect.poll(() => ending.innerText(), { timeout: TRANSITION_TIMEOUT_MS }).not.toBe(said);
    }
    await expect(page.locator(".ending-step-1")).toBeVisible();
    await read("ending step 1", { asLanded: true });
    // The way on is there once the quiet line has been held.
    await page.getByTestId("ending-next").click({ timeout: TRANSITION_TIMEOUT_MS });
    await expect(page.locator(".ending-step-2")).toBeVisible();
    await read("ending step 2", { asLanded: true });
    await page.locator(".ending-step-2 button").click();
    await expect(page.locator(".ending-step-3")).toBeVisible();
    await expect(page.locator(".ending-step-3 .ending-coda")).toBeVisible();
    await read("ending step 3", { asLanded: true });

    expect(covered, covered.join("\n")).toEqual([]);
  });
});

// A summary cut at three lines is carried whole by the card's tooltip, and a
// touch screen never shows one. 390px fits about sixty of a summary's 55 to
// 185 characters in three lines.
test.describe("a touch screen", () => {
  test.use({ hasTouch: true, isMobile: true });

  test("every roadmap card prints its whole summary where nothing hovers", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expect(page.locator(".case-roadmap .case-card").first()).toBeAttached();
    expect(await page.evaluate(() => matchMedia("(hover: none)").matches), "the context cannot hover").toBe(true);
    const summaries = await page.locator(".case-roadmap .case-card").evaluateAll((cards) =>
      cards.map((card) => {
        const summary = card.querySelector("p");
        return { state: card.className, cut: summary.scrollHeight > summary.clientHeight + 1 };
      }),
    );
    expect(summaries.length).toBeGreaterThan(50);
    expect(summaries.some((summary) => summary.state.includes("locked-case")), "the roadmap has locked cards").toBe(true);
    expect(summaries.filter((summary) => summary.cut)).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth), "the rail does not widen the page").toBeLessThanOrEqual(391);
  });
});

// The same short, wide window with a mouse: a laptop at 1366x660 zoomed to
// 200% reports 683x330. It used to be given the phone's table, laid out for a
// thumb.
test.describe("a laptop zoomed to 200%", () => {
  test.use({ hasTouch: false, isMobile: false });

  test("a short wide window with a mouse keeps the desktop table", async ({ page }) => {
    await page.setViewportSize({ width: 683, height: 330 });
    await page.goto("/?debug=1");
    await startDebugNode(page, "final", "f_start_owner");
    await page.addStyleTag({ content: ".debug-overlay { display: none !important; }" });
    const seen = await page.evaluate(() => {
      return {
        short: matchMedia("(max-height: 480px) and (orientation: landscape)").matches,
        coarse: matchMedia("(pointer: coarse)").matches,
        shellMaxWidth: getComputedStyle(document.querySelector(".game-shell")).getPropertyValue("--gx-maxw").trim(),
      };
    });
    expect(seen.short, "the window is as short as a phone on its side").toBe(true);
    expect(seen.coarse, "and is not a touch screen").toBe(false);
    // What the phone's layout does to the shell has not been done.
    expect(seen.shellMaxWidth, "the shell is not stretched to the phone's full width").not.toBe("100vw");
  });
});

// @once, here and below: the test runs in the desktop project only
// (playwright.config.js, the phone project's grepInvert). The tag is for a
// test that reads a save, a request or what the page says, and presses nothing
// that an untagged test does not press on the phone on the same screen. A test
// that is the only one to press a control stays in both projects.
test("leaving an active scene marks the saved run as paused", { tag: "@once" }, async ({ page }) => {
  await page.goto("/?debug=1");
  await startDebugNode(page, "case05", "c5_voice");
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pagehide")));
  await expect
    .poll(async () => page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")).paused))
    .toBe(true);
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")));
  expect(saved.started).toBe(true);
  expect(saved.currentCase).toBe("case05");
  expect(saved.nodeId).toBe("c5_voice");
});

test("bfcache return resumes an active scene without losing its route", { tag: "@once" }, async ({ page }) => {
  await page.goto("/?debug=1");
  await startDebugNode(page, "case05", "c5_voice");
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pagehide")));
  await expect
    .poll(async () => page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")).paused))
    .toBe(true);
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pageshow", { persisted: true })));
  await expect
    .poll(async () => page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")).paused))
    .toBe(false);
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")));
  expect(saved.started).toBe(true);
  expect(saved.currentCase).toBe("case05");
  expect(saved.nodeId).toBe("c5_voice");
});

test("recovery notice and local error log are visible from saved error metadata", async ({ page }) => {
  await page.goto("/?debug=1");
  await page.evaluate(() => {
    localStorage.setItem(
      "trigger-prototype-v2",
      JSON.stringify({
        saveSchemaVersion: 2,
        playerName: "E2E",
        started: false,
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
        lastError: {
          id: "error-e2e",
          occurredAt: new Date().toISOString(),
          source: "react-render",
          message: "Synthetic recovery check",
          currentCase: "case05",
          nodeId: "c5_voice",
        },
      }),
    );
    localStorage.setItem(
      "trigger-prototype-error-log-v1",
      JSON.stringify({
        saveSchemaVersion: 1,
        entries: [
          {
            id: "error-e2e",
            occurredAt: new Date().toISOString(),
            error: { message: "Synthetic recovery check" },
            context: {
              source: "react-render",
              currentCase: "case05",
              nodeId: "c5_voice",
              logLength: 0,
              lastChoiceId: "",
            },
          },
        ],
      }),
    );
  });
  await page.reload();

  await expect(page.getByText("복구됨")).toBeVisible();
  await page.getByTestId("open-error-log-from-notice").click();
  await expect(page.getByTestId("error-log-panel").getByText("Synthetic recovery check")).toBeVisible();
});

test("Escape closes the recovery error panel", async ({ page }) => {
  await page.goto("/?debug=1");
  await page.getByTestId("open-error-log-from-header").click();
  await expect(page.getByTestId("error-log-panel")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("error-log-panel")).toHaveCount(0);
});

test("recovery center is reachable for normal players after an error", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "trigger-prototype-v2",
      JSON.stringify({
        saveSchemaVersion: 2,
        playerName: "E2E",
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
        lastError: {
          id: "normal-recovery-center",
          occurredAt: new Date().toISOString(),
          source: "react-render",
          message: "Recovery center access check",
          currentCase: "case05",
          nodeId: "c5_voice",
        },
      }),
    );
  });
  await page.goto("/");
  await page.getByTestId("open-error-log-from-notice").click();
  await expect(page.getByTestId("error-log-panel")).toBeVisible();
  await expect(page.getByTestId("save-slot-panel")).toBeVisible();
});

test("starting a fresh game clears stale recovery guidance", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "trigger-prototype-v2",
      JSON.stringify({
        saveSchemaVersion: 2,
        playerName: "E2E",
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
        resources: { time: 72, capital: 100, trust: 50, legitimacy: 50, humanCost: 0, fatigue: 10 },
        triggers: {},
        cognition: {},
        lastError: {
          id: "stale-recovery-guidance",
          occurredAt: new Date().toISOString(),
          source: "react-render",
          message: "Stale error should disappear after a fresh start",
          currentCase: "case05",
          nodeId: "c5_voice",
        },
      }),
    );
  });
  await page.goto("/");
  await expect(page.getByText("복구됨")).toBeVisible();
  // The save is a run that can be resumed, so starting over asks first.
  const asked = await acceptConfirms(page);
  await startFirstRun(page);
  expect(asked.at(-1)).toContain("첫 사건부터 새로 시작");
  await expect(page.locator(".recovery-notice")).toHaveCount(0);
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")));
  expect(saved.lastError).toBeNull();
  expect(saved.currentCase).toBe(CASE_SEQUENCE[0]);
});

test("error log replay jumps to the captured scene", async ({ page }) => {
  await page.goto("/?debug=1");
  await page.evaluate(() => {
    localStorage.setItem(
      "trigger-prototype-v2",
      JSON.stringify({
        saveSchemaVersion: 2,
        playerName: "E2E",
        started: false,
        currentCase: "case02",
        nodeId: "c2_start",
        completedCases: ["case01"],
        discoveredClues: [],
        log: [],
        pendingTelemetry: [],
        caseResults: {},
        playtestFeedback: {},
        resources: {},
        triggers: {},
        cognition: {},
        lastError: {
          id: "error-replay-e2e",
          occurredAt: new Date().toISOString(),
          source: "react-render",
          message: "Replay recovery check",
          currentCase: "case05",
          nodeId: "c5_voice",
        },
      }),
    );
    localStorage.setItem(
      "trigger-prototype-error-log-v1",
      JSON.stringify({
        saveSchemaVersion: 1,
        entries: [
          {
            id: "error-replay-e2e",
            occurredAt: new Date().toISOString(),
            error: { message: "Replay recovery check" },
            context: {
              source: "react-render",
              currentCase: "case05",
              nodeId: "c5_voice",
              logLength: 0,
              lastChoiceId: "",
            },
          },
        ],
      }),
    );
  });
  await page.reload();
  await page.getByTestId("open-error-log-from-notice").click();
  await page.locator(".error-replay-button").first().click();
  await expect(page.locator(".game-shell")).toBeVisible();
  await expect(page.getByRole("heading", { name: "이름 없는 증언" })).toBeVisible();
  const savedAfterReplay = await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")));
  expect(savedAfterReplay.currentCase).toBe("case02");
  expect(savedAfterReplay.nodeId).toBe("c2_start");
});

test("corrupt saved route is repaired before resume", async ({ page }) => {
  await page.goto("/?debug=1");
  await page.evaluate(() => {
    localStorage.setItem(
      "trigger-prototype-v2",
      JSON.stringify({
        saveSchemaVersion: 2,
        playerName: "E2E",
        started: false,
        currentCase: "case05",
        nodeId: "c3_start",
        completedCases: ["case01", "case02", "case03", "case04"],
        discoveredClues: [],
        log: [],
        pendingTelemetry: [],
        caseResults: {},
        playtestFeedback: {},
        resources: {},
        triggers: {},
        cognition: {},
        paused: true,
      }),
    );
  });
  await page.reload();
  // The runtime is the one place a save is repaired (the shell cannot see the
  // scene graph), and it does so once its chunk has loaded -- wait for that.
  await expect
    .poll(async () => (await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")))).nodeId, {
      timeout: 30_000,
    })
    .toBe("c5_start");
  const repaired = await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")));
  expect(repaired.currentCase).toBe("case05");
  expect(repaired.nodeId).toBe("c5_start");
  expect(repaired.lastError.source).toBe("save-integrity");
  await page.getByTestId("resume-save").click();
  await expect(page.getByRole("heading", { name: "NO ONE TO BLAME" })).toBeVisible();
});

test("corrupt saved nested gameplay data is repaired before render", { tag: "@once" }, async ({ page }) => {
  await page.goto("/?debug=1");
  await page.evaluate(() => {
    localStorage.setItem(
      "trigger-prototype-v2",
      JSON.stringify({
        saveSchemaVersion: 2,
        playerName: "E2E",
        started: true,
        currentCase: "case05",
        nodeId: "c5_voice",
        completedCases: ["case01", "missing-case", null],
        discoveredClues: [null, { id: "clue-e2e" }],
        log: [
          null,
          { nodeId: null, choiceId: "broken" },
          {
            nodeId: "c5_voice",
            title: "이름 없는 증언",
            choiceId: "c5_voice_reaction_choice_1",
            choice: "증언자를 보호하고 기록을 복원한다",
            effect: { trust: "bad", legitimacy: 4 },
            triggers: [null, "system"],
            responseTimeSec: Number.NaN,
          },
        ],
        pendingTelemetry: [],
        caseResults: {
          case01: { primary: null, rank: null },
          missing: { primary: ["responsibility", 1] },
        },
        playtestFeedback: {
          case01: { comment: 42 },
          missing: { comment: "drop" },
        },
        resources: {},
        triggers: {},
        cognition: {},
      }),
    );
  });
  await page.reload();

  await expect(page.locator(".game-shell")).toBeVisible();
  await expect(page.getByRole("heading", { name: "이름 없는 증언" })).toBeVisible();
  const repaired = await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")));
  expect(repaired.lastError.source).toBe("save-integrity");
  expect(repaired.completedCases).toEqual(["case01"]);
  expect(repaired.discoveredClues).toEqual([{ id: "clue-e2e", title: "clue-e2e", text: "" }]);
  expect(repaired.log).toHaveLength(1);
  expect(repaired.log[0].effect).toEqual({ legitimacy: 4 });
  expect(repaired.log[0].triggers).toEqual(["system"]);
  expect(repaired.caseResults.case01.primary).toEqual(["responsibility", 0]);
  expect(repaired.caseResults.missing).toBeUndefined();
  expect(repaired.playtestFeedback.case01.comment).toBe("");
  expect(repaired.playtestFeedback.missing).toBeUndefined();
});

test("corrupt error log entries are filtered before the diagnostics panel renders", { tag: "@once" }, async ({ page }) => {
  await page.goto("/?debug=1");
  await page.evaluate(() => {
    localStorage.setItem(
      "trigger-prototype-v2",
      JSON.stringify({
        saveSchemaVersion: 2,
        playerName: "E2E",
        started: false,
        currentCase: "case01",
        nodeId: "start",
        completedCases: [],
        discoveredClues: [],
        log: [],
        pendingTelemetry: [],
        caseResults: {},
        playtestFeedback: {},
        resources: {},
        triggers: {},
        cognition: {},
      }),
    );
    localStorage.setItem(
      "trigger-prototype-error-log-v1",
      JSON.stringify({
        saveSchemaVersion: 1,
        entries: [
          null,
          { id: "broken-null-context", context: null, error: null },
          {
            id: "valid-error",
            occurredAt: "2026-08-21T10:00:00.000Z",
            error: { name: "TypeError", message: "Recovered diagnostic entry", stack: 42 },
            context: { source: "runtime", currentCase: "case01", nodeId: "start", logLength: 0 },
          },
        ],
      }),
    );
  });
  await page.reload();
  await page.getByTestId("open-error-log-from-header").click();

  await expect(page.getByTestId("error-log-panel").getByText("Recovered diagnostic entry")).toBeVisible();
  const entries = await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-error-log-v1")).entries);
  expect(entries).toHaveLength(2);
  expect(entries[0].context.currentCase).toBe("unknown");
  expect(entries[0].error.message).toBe("Unknown error");
  expect(entries[1].error.stack).toBe("");
});

test("restoring a corrupt recovery slot repairs nested data before resume", { tag: "@once" }, async ({ page }) => {
  await acceptConfirms(page);
  await page.goto("/?debug=1");
  await page.evaluate(() => {
    const snapshot = {
      saveSchemaVersion: 2,
      playerName: "E2E",
      started: false,
      paused: true,
      currentCase: "case05",
      nodeId: "c5_voice",
      completedCases: ["case01", "bad-case"],
      discoveredClues: [null],
      log: [null],
      pendingTelemetry: [{ id: "bad", type: "unknown", payload: {} }],
      caseResults: { case05: { primary: null } },
      playtestFeedback: { case05: { comment: 42 } },
      resources: {},
      triggers: {},
      cognition: {},
    };
    localStorage.setItem(
      "trigger-prototype-save-slots-v1",
      JSON.stringify({
        recoverySlotSchemaVersion: 1,
        slots: [{
          id: "slot-corrupt",
          savedAt: "2026-08-21T10:00:00.000Z",
          currentCase: "case05",
          nodeId: "c5_voice",
          completedCases: ["case01"],
          snapshot,
        }],
      }),
    );
  });
  await page.reload();
  await page.getByTestId("open-error-log-from-header").click();
  await page.getByTestId("restore-save-slot-slot-corrupt").click();
  await page.waitForLoadState("domcontentloaded");

  const restored = await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")));
  expect(restored.currentCase).toBe("case05");
  expect(restored.nodeId).toBe("c5_voice");
  expect(restored.completedCases).toEqual(["case01"]);
  expect(restored.pendingTelemetry).toEqual([]);
  expect(restored.caseResults.case05.primary).toEqual(["responsibility", 0]);
  expect(restored.playtestFeedback).toEqual({});
});

test("storage write failure does not block scene start", async ({ page }) => {
  await page.addInitScript(() => {
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function setItem(key, value) {
      if (key === "trigger-prototype-v2" || key === "trigger-prototype-save-slots-v1") {
        throw new DOMException("Quota exceeded", "QuotaExceededError");
      }
      return originalSetItem.call(this, key, value);
    };
  });
  await page.goto("/");
  await startFirstRun(page);
  await expect(page.locator(".choices .choice").first()).toBeVisible();
});

test("recovery slot can be restored and deleted from debug panel", async ({ page }) => {
  await acceptConfirms(page);
  await page.goto("/?debug=1");
  await page.evaluate(() => {
    localStorage.setItem(
      "trigger-prototype-save-slots-v1",
      JSON.stringify({
        recoverySlotSchemaVersion: 1,
        slots: [
          {
            id: "slot-restore-e2e",
            savedAt: new Date().toISOString(),
            currentCase: "case05",
            nodeId: "c5_voice",
            completedCases: ["case01", "case02", "case03", "case04"],
            snapshot: {
              recoverySlotSchemaVersion: 1,
              saveSchemaVersion: 2,
              playerName: "E2E",
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
  await page.reload();
  await page.getByTestId("open-error-log-from-header").click();
  await expect(page.getByTestId("save-slot-panel").getByText("case05 / c5_voice")).toBeVisible();
  await page.getByTestId("save-slot-panel").getByRole("button", { name: /삭제/ }).click();
  expect(await page.getByTestId("save-slot-panel").getByText("case05 / c5_voice").count()).toBe(0);
  await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem("trigger-prototype-save-slots-v1"));
    state.slots = [
      {
        id: "slot-restore-e2e",
        savedAt: new Date().toISOString(),
        currentCase: "case05",
        nodeId: "c5_voice",
        completedCases: ["case01", "case02", "case03", "case04"],
        snapshot: {
          recoverySlotSchemaVersion: 1,
          saveSchemaVersion: 2,
          playerName: "E2E",
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
    ];
    localStorage.setItem("trigger-prototype-save-slots-v1", JSON.stringify(state));
  });
  await page.reload();
  await page.getByTestId("open-error-log-from-header").click();
  await page.getByTestId("save-slot-panel").getByRole("button", { name: /복원/ }).click();
  await page.waitForLoadState("domcontentloaded");
  const restored = await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")));
  expect(restored.currentCase).toBe("case05");
  expect(restored.nodeId).toBe("c5_voice");
  expect(restored.resources).toEqual({ time: 72, capital: 100, trust: 50, legitimacy: 50, humanCost: 0, fatigue: 10 });
  expect(Object.values(restored.triggers).every((value) => value === 0)).toBe(true);
  expect(Object.values(restored.cognition).every((value) => value === 0)).toBe(true);
  await resumeSavedRun(page);
  await expect(page.locator(".choices .choice").first()).toBeVisible();
  await page.locator(".choices .choice").first().click();
  await expect(page.locator(".choices .choice").first()).toBeVisible();
});

test("recovery slot delete failure keeps the slot visible", { tag: "@once" }, async ({ page }) => {
  await acceptConfirms(page);
  await page.goto("/?debug=1");
  await page.evaluate(() => {
    localStorage.setItem(
      "trigger-prototype-save-slots-v1",
      JSON.stringify({
        recoverySlotSchemaVersion: 1,
        slots: [
          {
            id: "slot-delete-failure-e2e",
            savedAt: new Date().toISOString(),
            currentCase: "case05",
            nodeId: "c5_voice",
            completedCases: ["case01", "case02", "case03", "case04"],
            snapshot: {
              recoverySlotSchemaVersion: 1,
              saveSchemaVersion: 2,
              playerName: "E2E",
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
  await page.reload();
  await page.getByTestId("open-error-log-from-header").click();
  await expect(page.getByTestId("save-slot-panel").getByText("case05 / c5_voice")).toBeVisible();
  await page.evaluate(() => {
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function setItem(key, value) {
      if (key === "trigger-prototype-save-slots-v1") {
        throw new DOMException("Quota exceeded", "QuotaExceededError");
      }
      return originalSetItem.call(this, key, value);
    };
  });
  await page.getByTestId("save-slot-panel").getByRole("button", { name: /삭제/ }).click();
  await expect(page.getByTestId("save-slot-panel").getByText("case05 / c5_voice")).toBeVisible();
});

test("recovery slot restore repairs invalid saved route before writing", { tag: "@once" }, async ({ page }) => {
  await acceptConfirms(page);
  await page.goto("/?debug=1");
  await page.evaluate(() => {
    localStorage.setItem(
      "trigger-prototype-save-slots-v1",
      JSON.stringify({
        recoverySlotSchemaVersion: 1,
        slots: [
          {
            id: "slot-invalid-route-e2e",
            savedAt: new Date().toISOString(),
            currentCase: "case05",
            nodeId: "missing-node",
            completedCases: ["case01", "case02", "case03", "case04"],
            snapshot: {
              recoverySlotSchemaVersion: 1,
              saveSchemaVersion: 2,
              playerName: "E2E",
              started: false,
              paused: true,
              currentCase: "case05",
              nodeId: "missing-node",
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
  await page.reload();
  await page.getByTestId("open-error-log-from-header").click();
  await page.getByTestId("save-slot-panel").getByRole("button", { name: /복원/ }).click();
  await page.waitForLoadState("domcontentloaded");
  const restored = await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")));
  expect(restored.currentCase).toBe("case05");
  expect(restored.nodeId).toBe("c5_start");
  expect(restored.lastError.source).toBe("save-integrity");
});

test("error log clear failure keeps the log visible", async ({ page }) => {
  await acceptConfirms(page);
  await page.goto("/?debug=1");
  await page.evaluate(() => {
    localStorage.setItem(
      "trigger-prototype-error-log-v1",
      JSON.stringify({
        saveSchemaVersion: 1,
        entries: [
          {
            id: "error-clear-failure-e2e",
            occurredAt: new Date().toISOString(),
            error: { message: "Clear failure check" },
            context: { source: "e2e", currentCase: "case05", nodeId: "c5_voice", logLength: 0, lastChoiceId: "" },
          },
        ],
      }),
    );
  });
  await page.reload();
  await page.getByTestId("open-error-log-from-header").click();
  await expect(page.getByTestId("error-log-panel").getByText("Clear failure check")).toBeVisible();
  await page.evaluate(() => {
    const originalRemoveItem = Storage.prototype.removeItem;
    Storage.prototype.removeItem = function removeItem(key) {
      if (key === "trigger-prototype-error-log-v1") {
        throw new DOMException("Remove failed", "QuotaExceededError");
      }
      return originalRemoveItem.call(this, key);
    };
  });
  await page.getByTestId("error-log-panel").getByRole("button", { name: /로그 비우기/ }).click();
  await expect(page.getByTestId("error-log-panel").getByText("Clear failure check")).toBeVisible();
  await expect(
    page.getByTestId("error-log-panel").getByText("Error log clear failed because local storage could not be written.", { exact: true }),
  ).toBeVisible();
});

test("reset clears progress, error logs, and recovery slots", async ({ page }) => {
  await acceptConfirms(page);
  await page.goto("/?debug=1");
  await page.evaluate(() => {
    localStorage.setItem(
      "trigger-prototype-v2",
      JSON.stringify({
        saveSchemaVersion: 2,
        playerName: "E2E",
        started: true,
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
      }),
    );
    localStorage.setItem(
      "trigger-prototype-error-log-v1",
      JSON.stringify({
        saveSchemaVersion: 1,
        entries: [{ id: "reset-error", occurredAt: new Date().toISOString(), error: { message: "reset" }, context: {} }],
      }),
    );
    localStorage.setItem(
      "trigger-prototype-save-slots-v1",
      JSON.stringify({
        recoverySlotSchemaVersion: 1,
        slots: [{ id: "reset-slot", savedAt: new Date().toISOString(), currentCase: "case05", nodeId: "c5_voice", completedCases: [], snapshot: {} }],
      }),
    );
  });
  await page.reload();
  await expect(page.locator(".game-shell")).toBeVisible();
  // The briefing page covers 초기화, and the click used to wait out its reading clock.
  await dismissProtocolBreach(page);
  await page.getByRole("button", { name: /초기화/ }).click();
  const storedKeys = await page.evaluate(() => ({
    save: localStorage.getItem("trigger-prototype-v2"),
    errors: localStorage.getItem("trigger-prototype-error-log-v1"),
    slots: localStorage.getItem("trigger-prototype-save-slots-v1"),
  }));
  expect(storedKeys).toEqual({ save: null, errors: null, slots: null });
  await expect(page.locator(".intro")).toBeVisible();
});

test("reset failure records failed storage keys", async ({ page }) => {
  await acceptConfirms(page);
  await page.goto("/?debug=1");
  await startDebugNode(page, "case05", "c5_voice");
  await expect(page.locator(".game-shell")).toBeVisible();
  await page.evaluate(() => {
    const originalRemoveItem = Storage.prototype.removeItem;
    Storage.prototype.removeItem = function removeItem(key) {
      if (key === "trigger-prototype-save-slots-v1") {
        throw new DOMException("Remove failed", "QuotaExceededError");
      }
      return originalRemoveItem.call(this, key);
    };
  });
  await page.getByRole("button", { name: /초기화/ }).click();
  await expect(page.locator(".intro")).toBeVisible();
  await expect(page.getByTestId("retry-storage-cleanup")).toBeVisible();
  await page.getByTestId("retry-storage-cleanup").click();
  await expect(page.getByText(/저장소 정리 재시도 실패/)).toBeVisible();
  const errorLog = await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-error-log-v1")));
  expect(errorLog.entries[0].context.failedStorageKeys).toContain("trigger-prototype-save-slots-v1");
  expect(["StorageResetError", "StorageResetRetryError"]).toContain(errorLog.entries[0].error.name);
});

test("repeated render errors block the retry loop and preserve recovery choices", { tag: "@once" }, async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "trigger-prototype-v2",
      JSON.stringify({
        saveSchemaVersion: 2,
        playerName: "E2E",
        started: true,
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
        lastError: {
          id: "repeat-render-error",
          occurredAt: new Date().toISOString(),
          source: "react-render",
          message: "Repeated render failure",
          currentCase: "case05",
          nodeId: "c5_voice",
          retryCount: 2,
        },
      }),
    );
    localStorage.setItem("critical-point-force-render-error", "1");
  });
  await page.goto("/?debug=1");
  await expect(page.getByTestId("error-retry")).toBeDisabled();
  await expect(page.getByText("같은 저장 지점에서 오류가 반복되어 재시도를 중단했습니다.")).toBeVisible();
  await expect(page.getByTestId("error-start-fresh")).toBeVisible();
});

test("error boundary can clear the current saved state", async ({ page }) => {
  await acceptConfirms(page);
  await page.goto("/?debug=1");
  await page.evaluate(() => {
    localStorage.setItem(
      "trigger-prototype-v2",
      JSON.stringify({
        saveSchemaVersion: 2,
        playerName: "E2E",
        started: true,
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
      }),
    );
    localStorage.setItem("critical-point-force-render-error", "1");
  });
  await page.reload();
  await expect(page.getByRole("heading", { name: "장면을 불러오지 못했습니다." })).toBeVisible();
  await page.getByRole("button", { name: "저장본을 초기화하고 새 게임" }).click();
  await expect(page.locator(".intro")).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("trigger-prototype-v2"))).toBeNull();
});

test("error boundary clear save failure does not reload", { tag: "@once" }, async ({ page }) => {
  await acceptConfirms(page);
  await page.addInitScript(() => {
    localStorage.setItem(
      "trigger-prototype-v2",
      JSON.stringify({
        saveSchemaVersion: 2,
        playerName: "E2E",
        started: true,
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
      }),
    );
    localStorage.setItem("critical-point-force-render-error", "1");
    const originalRemoveItem = Storage.prototype.removeItem;
    Storage.prototype.removeItem = function removeItem(key) {
      if (key === "trigger-prototype-v2") {
        throw new DOMException("Remove failed", "QuotaExceededError");
      }
      return originalRemoveItem.call(this, key);
    };
  });
  await page.goto("/?debug=1");
  await expect(page.getByRole("heading", { name: "장면을 불러오지 못했습니다." })).toBeVisible();
  await page.getByRole("button", { name: "저장본을 초기화하고 새 게임" }).click();
  await expect(page.getByText("현재 저장본을 삭제하지 못했습니다. 브라우저 저장소 권한을 확인한 뒤 다시 시도하세요.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "장면을 불러오지 못했습니다." })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("trigger-prototype-v2"))).not.toBeNull();
});

test("pending telemetry retries after a failed Supabase response", { tag: "@once" }, async ({ page }) => {
  let requestCount = 0;
  const postBodies = [];
  // Only table writes are telemetry. The cloud-save RPC fires a few seconds
  // after load on the same host, and when it landed between the two telemetry
  // attempts it took slot [1] -- or took the scripted 500 -- and the test
  // failed about one run in six without the retry being wrong.
  await page.route("https://e2e.supabase.co/**", async (route) => {
    const telemetryWrite = route.request().method() === "POST" && !route.request().url().includes("/rpc/");
    if (telemetryWrite) {
      requestCount += 1;
      postBodies.push(route.request().postDataJSON());
    }
    await route.fulfill({
      status: telemetryWrite && postBodies.length === 1 ? 500 : 201,
      contentType: "application/json",
      body: "{}",
    });
  });
  await page.addInitScript(() => {
    localStorage.setItem("critical-point-telemetry-url", "https://e2e.supabase.co");
    localStorage.setItem("critical-point-telemetry-key", "anon");
    localStorage.setItem(
      "trigger-prototype-v2",
      JSON.stringify({
        saveSchemaVersion: 2,
        playerName: "E2E",
        started: false,
        currentCase: "case05",
        nodeId: "c5_voice",
        completedCases: ["case01", "case02", "case03", "case04"],
        discoveredClues: [],
        log: [],
        pendingTelemetry: [
          {
            id: "telemetry-retry-e2e",
            type: "error",
            label: "retry check",
            payload: { occurred_at: new Date().toISOString(), source: "e2e", current_case: "case05", node_id: "c5_voice" },
          },
        ],
        caseResults: {},
        playtestFeedback: {},
        resources: {},
        triggers: {},
        cognition: {},
        dataConsent: true,
      }),
    );
  });
  await page.goto("/");
  await expect
    .poll(
      async () =>
        page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")).pendingTelemetry.length),
      { timeout: 10_000 },
    )
    .toBe(0);
  expect(requestCount).toBeGreaterThanOrEqual(2);
  expect(postBodies.length).toBeGreaterThanOrEqual(2);
  expect(postBodies[0].event_id).toBe("telemetry-retry-e2e");
  expect(postBodies[1].event_id).toBe("telemetry-retry-e2e");
});

test("telemetry retry keeps the queue when storage commit fails", { tag: "@once" }, async ({ page }) => {
  let posts = 0;
  await page.route("https://e2e.supabase.co/**", async (route) => {
    if (route.request().method() === "POST") posts += 1;
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: "{}",
    });
  });
  await page.addInitScript(() => {
    localStorage.setItem("critical-point-telemetry-url", "https://e2e.supabase.co");
    localStorage.setItem("critical-point-telemetry-key", "anon");
    localStorage.setItem(
      "trigger-prototype-v2",
      JSON.stringify({
        saveSchemaVersion: 2,
        playerName: "E2E",
        started: false,
        currentCase: "case05",
        nodeId: "c5_voice",
        completedCases: ["case01", "case02", "case03", "case04"],
        discoveredClues: [],
        log: [],
        pendingTelemetry: [
          {
            id: "telemetry-commit-failure-e2e",
            type: "error",
            label: "commit failure check",
            payload: { occurred_at: new Date().toISOString(), source: "e2e", current_case: "case05", node_id: "c5_voice" },
          },
        ],
        caseResults: {},
        playtestFeedback: {},
        resources: {},
        triggers: {},
        cognition: {},
        dataConsent: true,
      }),
    );
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function setItem(key, value) {
      if (key === "trigger-prototype-v2") {
        throw new DOMException("Quota exceeded", "QuotaExceededError");
      }
      return originalSetItem.call(this, key, value);
    };
  });
  await page.goto("/");
  await expect(page.getByText(/원격 저장 대기열 변경을 반영하지 못했습니다/)).toBeVisible({ timeout: 10_000 });
  // The row was sent, and the save could not be told so. Reading the save back
  // proved nothing -- this test is what stops it being written -- so what is
  // held is what the kept row means: the next load sends it again.
  expect(posts).toBe(1);
  await page.reload();
  await expect.poll(() => posts, { timeout: 10_000 }).toBe(2);
});

test("consent opt-out failure keeps consent and pending telemetry intact", { tag: "@once" }, async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "trigger-prototype-v2",
      JSON.stringify({
        saveSchemaVersion: 2,
        playerName: "E2E",
        started: false,
        currentCase: "case05",
        nodeId: "c5_voice",
        completedCases: ["case01", "case02", "case03", "case04"],
        discoveredClues: [],
        log: [],
        pendingTelemetry: [
          {
            id: "consent-queue-e2e",
            type: "error",
            label: "consent queue check",
            payload: { source: "e2e" },
          },
        ],
        caseResults: {},
        playtestFeedback: {},
        resources: {},
        triggers: {},
        cognition: {},
        dataConsent: true,
      }),
    );
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function setItem(key, value) {
      if (key === "trigger-prototype-v2") {
        throw new DOMException("Quota exceeded", "QuotaExceededError");
      }
      return originalSetItem.call(this, key, value);
    };
  });
  await page.goto("/");
  await openIntroDrawer(page, ".data-info-panel");
  const consentCheckbox = page.locator(".consent-box input");
  await expect(consentCheckbox).toBeChecked();
  await consentCheckbox.click();
  await expect(consentCheckbox).toBeChecked();
  await expect(page.getByText(/동의 해제 내용을 브라우저 저장본에 반영하지 못했습니다/)).toBeVisible();
  // The save itself cannot have changed (this test refuses every write to it),
  // so it is not read back. What the page holds is what counts: the box is
  // still ticked above, and after a reload it is the same page -- ticked, with
  // the row still waiting to be sent.
  await page.reload();
  await openIntroDrawer(page, ".data-info-panel");
  await expect(page.locator(".consent-box input")).toBeChecked();
});

test("delayed telemetry failure does not overwrite newer saved progress", async ({ page }) => {
  let releaseTelemetryFailure;
  let playtestRequestSeen;
  const playtestRequestSeenPromise = new Promise((resolve) => {
    playtestRequestSeen = resolve;
  });
  await page.route("https://e2e.supabase.co/**", async (route) => {
    const request = route.request();
    if (request.method() === "POST" && request.url().includes("/playtest_sessions") && !releaseTelemetryFailure) {
      playtestRequestSeen();
      await new Promise((resolve) => {
        releaseTelemetryFailure = () =>
          resolve(
            route.fulfill({
              status: 500,
              contentType: "application/json",
              body: "{}",
            }),
          );
      });
      return;
    }
    await route.fulfill({
      status: request.method() === "GET" ? 200 : 201,
      contentType: "application/json",
      body: "{}",
    });
  });
  await page.addInitScript(() => {
    localStorage.setItem("critical-point-telemetry-url", "https://e2e.supabase.co");
    localStorage.setItem("critical-point-telemetry-key", "anon");
  });

  await page.goto("/?debug=1");
  await openIntroDrawer(page, ".data-info-panel");
  // Ticked from the first visit; check() on it was a press that could not fail.
  await expect(page.locator(".consent-box input")).toBeChecked();
  await startDebugNode(page, "case49", "c49_aftershock");
  await completeCurrentCase(page);
  await playtestRequestSeenPromise;
  await page.getByRole("button", { name: /마지막 사건 시작/ }).click();
  await expect(page.getByRole("heading", { name: /끝까지 남은 사람의 마지막 밤|모든 기록을 묶은 사람의 마지막 밤|곧장 올라간 사람의 마지막 밤|인사평가 보조지표/ })).toBeVisible();

  const savedBeforeFailureCallback = await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem("trigger-prototype-v2"));
    return {
      currentCase: saved.currentCase,
      nodeId: saved.nodeId,
      logLength: saved.log.length,
      savedAt: saved.savedAt,
    };
  });
  // The poll that stood here read the save the moment the failure was let go,
  // found it unchanged -- nothing had answered yet -- and passed. What has to
  // be read is the save the failure's own write leaves: the page gets its 500,
  // rewrites the queue into the save (a new `savedAt`), and only then is the
  // run compared.
  const failureAnswered = page.waitForResponse((response) => response.url().includes("/playtest_sessions") && response.status() === 500);
  releaseTelemetryFailure();
  await failureAnswered;
  await expect
    .poll(async () => page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")).savedAt), {
      message: "the failed send never wrote the queue back into the save",
      timeout: 10_000,
    })
    .not.toBe(savedBeforeFailureCallback.savedAt);
  const savedAfterFailureCallback = await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem("trigger-prototype-v2"));
    return {
      currentCase: saved.currentCase,
      nodeId: saved.nodeId,
      logLength: saved.log.length,
      queued: saved.pendingTelemetry.length,
    };
  });
  expect(savedAfterFailureCallback).toMatchObject({
    currentCase: savedBeforeFailureCallback.currentCase,
    nodeId: savedBeforeFailureCallback.nodeId,
    logLength: savedBeforeFailureCallback.logLength,
  });
  expect(savedAfterFailureCallback.queued, "the row that failed is still waiting").toBeGreaterThan(0);
  expect(savedBeforeFailureCallback.currentCase).toBe("final");
});

test("final ending sequence reveals twists, accepts a handoff note, and unlocks the report", async ({ page }) => {
  test.setTimeout(60_000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?debug=1");
  await startDebugNode(page, "final", "f_aftershock");
  await completeCurrentCase(page);

  await expect(page.locator(".ending-sequence")).toBeVisible();
  await expect(page.locator(".result-page.final-report-locked")).toBeVisible();
  // Each step takes the pressed button away with the block it was in. Focus
  // goes to where the next one starts, never to <body>.
  await expect(page.locator(".ending-sequence h1")).toBeFocused();
  for (let index = 0; index < 3; index += 1) {
    await page.locator(".ending-sequence button").click();
  }

  await expect(page.locator(".ending-step-1")).toBeVisible();
  await expect(page.locator(".ending-quiet-line")).toBeVisible();
  await expect(page.locator(".ending-quiet-beat button")).toBeFocused();
  // Reduced motion drops the eight-second hold, so there is no skip control
  // here: the button under the quiet line is already the way on. The hold and
  // its skip are played in the ranking test below, which runs with motion.
  await expect(page.locator(".ending-quiet-skip")).toHaveCount(0);
  await expect(page.getByTestId("ending-next")).toBeVisible();
  await page.getByTestId("ending-next").click();
  await expect(page.locator(".ending-step-2 textarea")).toBeVisible();
  await expect(page.locator(".ending-step-2 textarea")).toBeFocused();
  await page.locator(".ending-step-2 textarea").fill("다음 사람은 기록보다 먼저 조건을 확인하세요.");
  await page.locator(".ending-step-2 button").click();

  await expect(page.locator(".ending-step-3")).toBeVisible();
  await expect(page.locator(".result-page.final-report-locked")).toHaveCount(0);
  await expect(page.locator(".result-hero h1")).toBeFocused();
  // The sequence's own region: the result card's buttons bring a second one.
  await expect(page.locator(".ending-sequence > [role='status']")).toContainText("기록이 열렸습니다");
  await expect
    .poll(async () => page.evaluate(() => localStorage.getItem("critical-point-next-participant-message")))
    .toBe("다음 사람은 기록보다 먼저 조건을 확인하세요.");
});

/**
 * Where the season stands against SYSTEM COLLAPSE, on every case's report
 * (`createSeasonStandingReadout`, src/viewModels/reportViewModels.js), and the
 * cases a collapse offers to play again. The unit tests hold the sentences;
 * these are a returning player's save, with cases already closed on a known
 * harm, played to its report.
 */
const HARM_GATE = ENDING_GATES.collapseHarmPerCase;
const STANDING_MARKS = { clear: "○", near: "▲", over: "■" };
const SEED_RESOURCES = { time: 72, capital: 100, trust: 50, legitimacy: 50, humanCost: 0, fatigue: 10 };
// Windows a seeded case cashed, so one bust on the scene played here is a few percent of the season and not all of it.
const SEED_CASHES = 8;

/** A closed case's summary as the game writes one, closed on `harm` with no window busted. */
function closedOnHarm(caseId, harm) {
  const summary = createCaseSummary({}, {}, [{ caseId }], { resources: { ...SEED_RESOURCES, humanCost: harm }, schemaVersion: 2 });
  return { ...summary, pushRecord: { ...summary.pushRecord, busts: 0, cashes: SEED_CASHES } };
}

/** One decimal, cut and not rounded: 19.96 a case is 19.9. */
const cutToTenth = (total, cases) => Math.floor((total * 10) / cases) / 10;
const roundToTenth = (total, cases) => Math.round((total * 10) / cases) / 10;

/** A season's harm over `cases` whose mean is inside the band and reads differently cut than rounded. */
function harmTotalFor({ low, high }, cases) {
  for (let total = Math.ceil(low * cases) + 1; total < high * cases - 1; total += 1) {
    if (cutToTenth(total, cases) !== roundToTenth(total, cases)) return total;
  }
  throw new Error(`no season total between ${low} and ${high} a case over ${cases} cases tells a cut from a rounding`);
}

/** What the save a report was drawn from says the line prints: the gate's own sums, read off the summaries. */
function standingOf(save) {
  const summaries = Object.values(save?.caseResults ?? {}).filter(Boolean);
  const sumOf = (read) => summaries.reduce((sum, summary) => sum + (Number(read(summary)) || 0), 0);
  const cases = Math.max(1, summaries.length);
  const total = Math.max(sumOf((summary) => summary.finalHumanCost), Number(save?.resources?.humanCost) || 0);
  const busts = sumOf((summary) => summary.pushRecord?.busts);
  const windows = busts + sumOf((summary) => summary.pushRecord?.cashes);
  const mean = total / cases;
  return {
    cases,
    mean,
    perCase: cutToTenth(total, cases),
    rounded: roundToTenth(total, cases),
    bustRate: windows > 0 ? busts / windows : 0,
    bustPercent: windows > 0 ? Math.floor((busts * 100) / windows) : 0,
    // The harm route's level. The seeds keep busts far under their own gate, so it is the season's.
    level: mean >= HARM_GATE ? "over" : mean >= HARM_GATE * SEASON_STANDING_NEAR - 1e-9 ? "near" : "clear",
  };
}

/** The save once the case that just closed is in it. */
async function readClosedSave(page, caseId) {
  await expect
    .poll(async () => Boolean((await readJsonStorage(page, TEST_STORAGE_KEYS.save))?.caseResults?.[caseId]), { message: `${caseId} is in the save` })
    .toBe(true);
  return readJsonStorage(page, TEST_STORAGE_KEYS.save);
}

for (const band of [
  { level: "clear", low: 12, high: HARM_GATE * SEASON_STANDING_NEAR },
  { level: "near", low: HARM_GATE * SEASON_STANDING_NEAR + 1, high: HARM_GATE },
  { level: "over", low: HARM_GATE + 1, high: HARM_GATE + 10 },
]) {
  test(`the report of a case says where the season stands against collapse: ${band.level}`, async ({ page }) => {
    test.setTimeout(120_000);
    // 사건 01's last scene: none of its cards moves the harm, so the case closes on what the seed gave it, none.
    const closing = "case01";
    const closedBefore = CASE_SEQUENCE.slice(0, CASE_SEQUENCE.indexOf(closing));
    const cases = closedBefore.length + 1;
    const total = harmTotalFor(band, cases);
    const share = Math.floor(total / closedBefore.length);
    const caseResults = Object.fromEntries(
      closedBefore.map((caseId, index) => [caseId, closedOnHarm(caseId, share + (index < total % closedBefore.length ? 1 : 0))]),
    );
    await seedSave(page, savedRunAt(closing, "c1_aftershock", { caseResults }));
    await page.goto("/");
    await resumeSavedRun(page);
    await completeCurrentCase(page);
    const decisionNext = page.getByTestId("decision-next");
    if (await decisionNext.isVisible()) await decisionNext.click();
    await expect(page.locator(".decision-reveal-backdrop")).toHaveCount(0, { timeout: TRANSITION_TIMEOUT_MS });
    await expect(page.locator(".result-page")).toBeVisible();

    // The numbers are read off the save the report was drawn from, the case played here included.
    const standing = standingOf(await readClosedSave(page, closing));
    expect(standing.cases, "the seeded cases and the one that closed").toBe(cases);
    expect(standing.level, `the seed still stands ${band.level}: ${standing.mean} a case against ${HARM_GATE}`).toBe(band.level);
    expect(standing.bustRate, "busts are far from their own gate, so the level is the harm's").toBeLessThan(ENDING_GATES.collapseBustRate * SEASON_STANDING_NEAR);

    const line = page.locator(".outcome-panel").getByTestId("season-standing");
    await expect(line).toHaveCount(1);
    await expect(line).toBeVisible();
    // The level without its colour: a class, a shape and a word.
    await expect(line).toHaveClass(new RegExp(`(^|\\s)${band.level}(\\s|$)`));
    await expect(line.locator("b")).toContainText(STANDING_MARKS[band.level]);
    await expect(line.locator("b")).toContainText("붕괴선");

    const text = (await line.textContent()) ?? "";
    const numbers = text.match(/\d+(?:\.\d+)?/g) ?? [];
    expect(numbers, `the mean, cut to one decimal, in "${text}"`).toContain(String(standing.perCase));
    expect(numbers, `the gate in "${text}"`).toContain(String(HARM_GATE));
    expect(text, "the share of windows that bust, cut to a whole percent").toMatch(new RegExp(`(?<![\\d.])${standing.bustPercent}%`));
    if (standing.rounded !== standing.perCase) {
      expect(numbers, `the mean is cut, not rounded up to ${standing.rounded}`).not.toContain(String(standing.rounded));
    }
  });
}

/** From a seeded save on the finale's last scene to its open record, with 전체 기록 unfolded. */
async function openSeededFinaleArchive(page, overrides) {
  // Reduced motion drops the ending's eight-second hold.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await seedSave(page, savedRunAt("final", "f_aftershock", overrides));
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
  await expect(page.locator(".ending-step-2")).toBeVisible();
  await page.locator(".ending-step-2 button").click();
  await expect(page.locator(".ending-step-3")).toBeVisible();
  await page.locator("details.report-archive > summary").click();
  await expect(page.locator(".report-archive-body")).toBeVisible();
}

/** The closed cases a collapse lists, read off the save: most harm first, ties in season order, three at most, none that closed on no harm. */
function worstHarmCases(save) {
  const seasonOrder = (caseId) => (CASE_SEQUENCE.includes(caseId) ? CASE_SEQUENCE.indexOf(caseId) : CASE_SEQUENCE.length);
  return Object.entries(save?.caseResults ?? {})
    .filter(([, summary]) => Boolean(summary))
    .map(([caseId, summary]) => ({ caseId, harm: Number(summary.finalHumanCost) || 0 }))
    .filter((entry) => entry.harm > 0)
    .sort((a, b) => b.harm - a.harm || seasonOrder(a.caseId) - seasonOrder(b.caseId))
    .slice(0, 3)
    .map((entry) => ({ ...entry, label: seasonCasesBase.find((caseItem) => caseItem.id === entry.caseId)?.label }))
    .filter((entry) => entry.label);
}

// Five closed cases, written out of order: two tie on the most harm, and 사건 04 and 사건 02 are left off the list.
const HARM_SEED = { case07: 60, case05: 90, case02: 40, case03: 90, case04: 10 };
const harmSeededCases = () => Object.fromEntries(Object.entries(HARM_SEED).map(([caseId, harm]) => [caseId, closedOnHarm(caseId, harm)]));

for (const season of [
  // The finale closes on next to no harm: the three are other cases, and opening one of them throws nothing away.
  { title: "three earlier cases, opened without a question", overrides: {}, listed: ["case03", "case05", "case07"], replay: "case03", asks: false },
  // The finale closes on the most harm of all: it is on the list, and opening the case that just closed asks first.
  { title: "the finale among them, opened after a question", overrides: { resources: { ...SEED_RESOURCES, humanCost: 96 } }, replay: "final", asks: true },
]) {
  test(`a collapse offers its most harmful cases to play again: ${season.title}`, async ({ page }) => {
    test.setTimeout(120_000);
    const asked = await acceptConfirms(page);
    await openSeededFinaleArchive(page, { caseResults: harmSeededCases(), ...season.overrides });
    await expect(page.locator(".ending-variant-panel.failure"), "the season collapsed").toHaveCount(1);
    await expect(page.locator(".outcome-panel").getByTestId("season-standing")).toHaveClass(/(^|\s)over(\s|$)/);

    const save = await readClosedSave(page, "final");
    const worst = worstHarmCases(save);
    expect(worst.length, "three cases are listed").toBe(3);
    if (season.listed) expect(worst.map((entry) => entry.caseId), "the seeded worst three, the tie in season order").toEqual(season.listed);
    expect(worst.map((entry) => entry.caseId), `${season.replay} is on the list`).toContain(season.replay);

    const panel = page.locator(".failure-objectives");
    await expect(panel).toBeVisible();
    // 복구 루트 시작 reopened the finale whatever had gone wrong; it is gone from the page.
    await expect(page.getByRole("button", { name: "복구 루트 시작" })).toHaveCount(0);
    await expect(panel).not.toContainText("복구 루트");
    // Every button of the panel is one of the listed cases, in the list's order, by its name and the harm it closed on.
    const buttons = panel.locator("button");
    await expect(buttons).toHaveCount(worst.length);
    for (const [index, entry] of worst.entries()) {
      await expect(buttons.nth(index)).toContainText(entry.label);
      await expect(buttons.nth(index)).toHaveText(new RegExp(`(?<!\\d)${entry.harm}(?!\\d)`));
    }

    expect(asked, "nothing has been asked before the press").toEqual([]);
    await buttons.nth(worst.findIndex((entry) => entry.caseId === season.replay)).click();
    // Only the case that just closed has a record to throw away (`openCase`, src/GameRuntime.jsx).
    // The in-game question reports what it asked through an exposed function, a turn after the click.
    await expect.poll(() => asked.length, season.asks ? "reopening the case that just closed asks first" : "another case opens without a question").toBe(season.asks ? 1 : 0);
    if (season.asks) expect(asked[0]).toContain("다시 시작");

    // The case's first scene: its summary is still the season's until the new play closes.
    await expect
      .poll(
        async () => {
          const now = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
          return `${now?.currentCase}/${now?.nodeId}`;
        },
        { message: `${season.replay} opened on its first scene`, timeout: TRANSITION_TIMEOUT_MS },
      )
      .toBe(`${season.replay}/${CASE_START_NODES[season.replay]}`);
    await expect(page.locator(".game-shell")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
    // A relic draft, when the closed case left one, stands in front of the briefing page.
    const briefing = page.getByTestId("scene-briefing");
    const draftSkip = page.getByTestId("relic-skip");
    await expect(briefing.or(draftSkip).first()).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
    if (await draftSkip.isVisible()) await clickThroughMotion(draftSkip, "skip the relic draft");
    // Read at once: the page's reading clock opens the table by itself after 12 to 95 seconds.
    await expect(briefing).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
    await expect(page.getByTestId("open-table")).toBeVisible();
    const reopened = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
    expect(reopened.caseResults[season.replay]?.finalHumanCost, "the case keeps its summary until it is closed again").toBe(worst.find((entry) => entry.caseId === season.replay).harm);
  });
}

test("leaving the table for the intro puts focus on the intro's heading", async ({ page }) => {
  await page.goto("/?debug=1");
  await startDebugNode(page, "case05", "c5_voice");
  await page.getByRole("button", { name: "저장 후 나가기" }).click();
  await expect(page.locator(".intro")).toBeVisible();
  // The pressed button went with the table. Nothing took focus, so a keyboard
  // or screen-reader player was back at the top of the document, unannounced.
  await expect(page.locator(".intro h1")).toBeFocused();
});

test("시즌 로드맵 from a report lands on the roadmap, at the case the season has reached", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?debug=1");
  await startDebugNode(page, "case05", "c5_aftershock");
  await completeCurrentCase(page);
  const decisionNext = page.getByTestId("decision-next");
  if (await decisionNext.isVisible()) await decisionNext.click();
  await expect(page.locator(".result-page")).toBeVisible();
  await page.getByRole("button", { name: "시즌 로드맵" }).click();

  const heading = page.locator("#season-roadmap");
  await expect(heading).toBeFocused();
  await expect(heading).toBeInViewport();
  // On a phone the roadmap is a rail of every case, and it opened on the first.
  const rail = await page.evaluate(() => {
    const track = document.querySelector(".case-roadmap");
    const card = track.querySelector(".active-case");
    const trackBox = track.getBoundingClientRect();
    const cardBox = card.getBoundingClientRect();
    return { scrolled: track.scrollLeft, cardLeft: cardBox.left - trackBox.left, cardRight: cardBox.right - trackBox.left, width: trackBox.width };
  });
  expect(rail.scrolled).toBeGreaterThan(0);
  expect(rail.cardLeft).toBeGreaterThanOrEqual(-1);
  expect(rail.cardRight).toBeLessThanOrEqual(rail.width + 1);
});

// The archive's resource panel listed each decision's change and never the
// case's: its first row is now the six numbers from where the case's first
// logged decision started to where its last one left them (`describeCaseChange`,
// src/gauntlet/tableReadout.js).
test("the resource panel of 전체 기록 opens on the six numbers of the case, from the start of its first decision to the end of its last", async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto("/?debug=1");
  // Two scenes from the report, so the case's first decision and its last are two entries.
  await startDebugNode(page, "case01", "c1_final_system");
  await completeCurrentCase(page);
  const decisionNext = page.getByTestId("decision-next");
  if (await decisionNext.isVisible()) await decisionNext.click();
  await expect(page.locator(".decision-reveal-backdrop")).toHaveCount(0, { timeout: TRANSITION_TIMEOUT_MS });
  await expect(page.locator(".result-page")).toBeVisible();
  await expect
    .poll(async () => Boolean((await readJsonStorage(page, TEST_STORAGE_KEYS.save))?.caseResults?.case01), { message: "the closed case is in the save" })
    .toBe(true);

  const { log } = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  expect(log.length, "the case closed on more than one decision").toBeGreaterThanOrEqual(2);
  // Each end is the nearest entry that holds numbers, as the row reads them; played here, that is the first and the last.
  const held = (value) => Boolean(value) && Object.keys(value).length > 0;
  const first = log.find((entry) => held(entry?.resourcesBefore));
  const last = log.findLast((entry) => held(entry?.resourcesAfter));
  expect(log.indexOf(first), "the first decision holds what it started from").toBe(0);
  expect(log.indexOf(last), "the last decision holds what it left").toBe(log.length - 1);
  const expected = Object.entries(easyResourceLabels).map(([key, label]) => ({ label, before: first.resourcesBefore[key], after: last.resourcesAfter[key] }));
  expect(expected.every((row) => Number.isFinite(row.before) && Number.isFinite(row.after)), "the save holds all six at both ends").toBe(true);
  expect(expected.some((row) => row.before !== row.after), "the case moved at least one of the six").toBe(true);

  await page.locator("details.report-archive > summary").click();
  await expect(page.locator(".report-archive-body")).toBeVisible();
  const row = page.getByTestId("case-resource-change");
  await expect(row).toHaveCount(1);
  await expect(row).toBeVisible();
  expect(await row.evaluate((element) => element === element.parentElement.firstElementChild), "the case's row is ahead of its decisions'").toBe(true);

  // Each resource is "{name} {before} → {after}"; the names and the two numbers are read, not the mark between them.
  const printed = await row.locator("span").evaluateAll((spans) => spans.map((span) => ({ text: span.textContent ?? "", mark: span.className })));
  const read = printed.map(({ text }) => {
    const parts = text.match(/^(.+?) (-?\d+)\D+?(-?\d+)$/);
    return parts ? { label: parts[1], before: Number(parts[2]), after: Number(parts[3]) } : { unread: text };
  });
  expect(read).toEqual(expected);
  // A value that did not move is marked neither as a gain nor as a loss; one that moved is marked as one of them.
  printed.forEach(({ mark }, index) => {
    const moved = expected[index].before !== expected[index].after;
    expect(mark, `${expected[index].label} ${moved ? "moved" : "did not move"}`).toMatch(moved ? /^delta-(up|down)$/ : /^$/);
  });
});

test("completed case is retained in the local ranking after leaving the ending", async ({ page }) => {
  // With motion, so the quiet line holds: both ending tests used to ask for
  // reduced motion and then press the skip only `if` it was there, which it
  // never was, so the control had not been pressed by any test.
  await page.goto("/?debug=1");
  await startDebugNode(page, "final", "f_aftershock");
  await completeCurrentCase(page);

  for (let index = 0; index < 3; index += 1) {
    await page.locator(".ending-sequence button").click();
  }
  const quietSkip = page.locator(".ending-quiet-skip");
  await expect(quietSkip, "the hold is running, and can be skipped").toBeVisible();
  await expect(page.getByTestId("ending-next")).toHaveCount(0);
  await quietSkip.click();
  await expect(quietSkip).toHaveCount(0);
  await page.getByTestId("ending-next").click();
  await page.locator(".ending-step-2 textarea").fill("랭킹 저장 확인");
  await page.locator(".ending-step-2 button").click();

  await page.locator(".result-page .top-actions button").nth(1).click();
  await expect(page.locator(".ranking-list .ranking-row")).toHaveCount(1);
  await expect(page.locator(".ranking-list .ranking-row")).toContainText("SEASON 01 COMPLETE");
  await expect
    .poll(async () => page.evaluate(() => JSON.parse(localStorage.getItem("critical-point-local-ranking-v8") || "[]").length))
    .toBeGreaterThan(0);
});

test("a replay link restores the captured scene in a fresh context", async ({ page, browser, baseURL }) => {
  await page.goto("/?debug=1");
  await startDebugNode(page, "case04", "c4_vote");
  await chooseFirstAvailableChoice(page);
  await page.waitForSelector(".game-shell");

  const before = await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem("trigger-prototype-v2"));
    return {
      nodeId: saved.nodeId,
      currentCase: saved.currentCase,
      resources: saved.resources,
      log: (saved.log ?? []).map((entry) => ({ nodeId: entry.nodeId, choiceId: entry.choiceId })),
    };
  });

  // The player copies this link from the debug panel; build it with the same
  // encoder so the test does not depend on a headless clipboard.
  await expect(page.getByTestId("copy-replay-link")).toBeVisible();
  const replayUrl = `/?debug=1&${REPLAY_QUERY_KEY}=${encodeReplaySeed({
    currentCase: before.currentCase,
    nodeId: before.nodeId,
    resources: before.resources,
    log: before.log,
  })}`;

  // Someone else's browser: its own storage, with nothing in it. This used to
  // be a second page of the same context, which shares storage with the first
  // -- and a replay never writes the save, so what the test read back as the
  // replay's state was the save of the run that made the link. A link that
  // decoded to nothing still opened that run and passed.
  const viewer = await browser.newContext({ baseURL });
  const strays = await guardNetwork(viewer);
  try {
    const fresh = await viewer.newPage();
    await fresh.goto(replayUrl);
    await expect(fresh.locator(".game-shell")).toBeVisible();

    // What is on screen is the scene the link names, with the resources it carries.
    await expect(fresh.locator(".game-header h1")).toHaveText(nodes[before.nodeId].title);
    const overlay = fresh.getByTestId("debug-overlay");
    await expect(overlay).toContainText(`${before.currentCase} / ${before.nodeId}`);
    for (const [key, value] of Object.entries(before.resources)) {
      await expect(overlay).toContainText(`${key}:${value}`);
    }

    // And opening it saved nothing: the viewer has no run of their own now.
    const stored = await fresh.evaluate(() => ({
      save: localStorage.getItem("trigger-prototype-v2"),
      slots: localStorage.getItem("trigger-prototype-save-slots-v1"),
    }));
    expect(stored).toEqual({ save: null, slots: null });
    expectNoStrayRequests(strays);
  } finally {
    await viewer.close();
  }
});

test("a replay link that decodes to nothing opens no scene", async ({ browser, baseURL }) => {
  const viewer = await browser.newContext({ baseURL });
  await guardNetwork(viewer);
  try {
    const fresh = await viewer.newPage();
    await fresh.goto(`/?${REPLAY_QUERY_KEY}=not-a-seed`);
    await expect(fresh.locator(".intro")).toBeVisible();
    await expect(fresh.locator(".game-shell")).toHaveCount(0);
    expect(await fresh.evaluate(() => localStorage.getItem("trigger-prototype-v2"))).toBeNull();
  } finally {
    await viewer.close();
  }
});
