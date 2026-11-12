import AxeBuilder from "@axe-core/playwright";
import { BACKEND_ORIGIN, expect, test } from "./helpers/network.js";
import { NEW_GAME_PLUS_KEY, NEW_GAME_PLUS_MEMORY_KEY, SEASON_RECORD_KEY } from "../src/appConfig.js";
import { CASE_START_NODES } from "../src/gameCases.js";
import { weekStartMs, WEEKLY_RULES } from "../src/gauntlet/weeklyRules.js";
import { cashStakedCard, clickElement, completeCurrentCase, dismissProtocolBreach, startDebugNode, TRANSITION_TIMEOUT_MS, waitForEntrance } from "./helpers/gameFlow.js";
import { savedRunAt, seedSave } from "./helpers/seededSave.js";
import { TEST_STORAGE_KEYS } from "./helpers/storage.js";

/**
 * The structural audit (accessibility.spec.js) in the other two languages and
 * at the smallest phone the layout is held to, and on the screens it did not
 * reach: the comfort settings opened over the table, the table with a card
 * staged, the start screen's 결말 도감, and the ranking of an event week with
 * its 이번 주의 규칙 board (the 2026-11-03 audit, items 3 to 5). Since E3's
 * 상황 듣기 (2026-11-12) also the open table with a push made, an act's title
 * card, the finale's ending report and a 번외 사건 (E-11) on its table.
 *
 * Every test sets its own viewport, so the phone project would run the same
 * page again with touch on: they are @once, and run in `chromium` only. The
 * Korean audits at the projects' own sizes stay in accessibility.spec.js.
 */

const LANGS = ["ko", "en", "ja"];
const SIZES = [
  { name: "360x740", viewport: { width: 360, height: 740 } },
  { name: "1280x720", viewport: { width: 1280, height: 720 } },
];

const withLang = (path, lang) => (lang === "ko" ? path : `${path}${path.includes("?") ? "&" : "?"}lang=${lang}`);

async function expectNoA11yViolations(page, label) {
  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.map((violation) => `${violation.id}: ${violation.nodes.map((node) => node.target.join(" ")).join(", ")}`),
    label,
  ).toEqual([]);
}

/** A side case (E-11) on a device that closed a finale: the season paused at 사건 12. */
async function seedSideCaseDevice(page) {
  await page.addInitScript(
    ({ saveKey, save, newGamePlusKey }) => {
      if (sessionStorage.getItem("a11y-side-seeded")) return;
      sessionStorage.setItem("a11y-side-seeded", "1");
      localStorage.clear();
      localStorage.setItem(saveKey, JSON.stringify(save));
      localStorage.setItem(newGamePlusKey, "true");
    },
    { saveKey: TEST_STORAGE_KEYS.save, save: savedRunAt("case12", "c12_start"), newGamePlusKey: NEW_GAME_PLUS_KEY },
  );
}

/** Tuesday of the first event week, the way weekly-rule.spec.js moves the rule's clock. */
async function holdEventWeek(page) {
  const at = weekStartMs(WEEKLY_RULES[0].week) + 27 * 60 * 60 * 1000;
  await page.addInitScript((ms) => {
    globalThis.__weeklyRuleClock = ms;
  }, at);
}

/** A device that finished a season: NEW GAME+ open, and a season record with its 결말 도감. */
async function seedFinishedSeason(page) {
  await page.addInitScript(
    ({ unlocked, memoryKey, recordKey, record }) => {
      if (sessionStorage.getItem("a11y-seeded")) return;
      sessionStorage.setItem("a11y-seeded", "1");
      localStorage.setItem(unlocked, "true");
      localStorage.setItem(memoryKey, JSON.stringify({ case05: { outcomeChoiceId: "c5_axe" } }));
      localStorage.setItem(recordKey, record);
    },
    {
      unlocked: NEW_GAME_PLUS_KEY,
      memoryKey: NEW_GAME_PLUS_MEMORY_KEY,
      recordKey: SEASON_RECORD_KEY,
      record: JSON.stringify({
        seasons: 1,
        countedRuns: ["axe-first-season"],
        previous: null,
        last: { runId: "axe-first-season", endingId: "quiet-cover", endingLabel: "QUIET COVER", verdict: "ending_seal", verdictName: "봉인", tableRules: 1, line: "지난 시즌: 봉인 · QUIET COVER." },
        endingBook: { head: "결말 1/9 · 판결 1/3", hints: ["아직 보지 못한 결말 하나는 감사가 높게 끝난 시즌에 닫힙니다."] },
      }),
    },
  );
}

/** Two finished seasons on the board, served by the stub backend. */
async function stubRanking(page) {
  const row = (tag, score) => ({
    run_tag: tag,
    player_name: "익명 분석관",
    case_id: "season-final",
    case_title: "SEASON 01 COMPLETE",
    completed_at: "2026-09-27T09:00:00Z",
    score,
    summary: { burstScore: score, rank: "B", primary: ["curiosity", 90], seasonComplete: true, averageResponseTime: 14, reframeCount: 2 },
  });
  const rows = (body) => (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(body) });
  await page.route(`${BACKEND_ORIGIN}/**`, rows([]));
  await page.route(`${BACKEND_ORIGIN}/rest/v1/public_rankings**`, rows([row("AXEROW01", 82), row("AXEROW02", 71)]));
  await page.addInitScript(
    ({ urlKey, keyKey, url }) => {
      localStorage.setItem(urlKey, url);
      localStorage.setItem(keyKey, "anon");
    },
    { urlKey: TEST_STORAGE_KEYS.telemetryUrl, keyKey: TEST_STORAGE_KEYS.telemetryKey, url: BACKEND_ORIGIN },
  );
}

for (const lang of LANGS) {
  for (const size of SIZES) {
    test.describe(`${lang} at ${size.name}`, () => {
      test.use({ viewport: size.viewport });

      test(`the intro with its drawers and 결말 도감, and both boards of an event week's ranking, have no structural accessibility violations (${lang}, ${size.name})`, { tag: "@once" }, async ({ page }) => {
        await holdEventWeek(page);
        await seedFinishedSeason(page);
        await stubRanking(page);
        await page.goto(withLang("/", lang));
        await expect(page.locator(".intro")).toBeVisible();
        await expect(page.locator("html")).toHaveAttribute("lang", lang);
        await waitForEntrance(page.locator(".intro"));
        await expectNoA11yViolations(page, "intro");

        // Every drawer open, the 결말 도감 among them: axe does not read a closed <details>.
        const book = page.locator(".past-run-memory details");
        await expect(book).toHaveCount(1);
        await page.locator("details").evaluateAll((all) => all.forEach((details) => (details.open = true)));
        await waitForEntrance(page.locator(".intro"));
        await expectNoA11yViolations(page, "intro, every drawer and the 결말 도감 open");

        await page.locator(".intro-ranking-button:not(.intro-board-button)").first().click();
        await expect(page.locator(".ranking-row")).toHaveCount(2);
        await expectNoA11yViolations(page, "ranking, ordinary board");
        const tabs = page.getByTestId("ranking-week-tabs");
        await tabs.getByRole("button").nth(1).click();
        await expect(tabs.getByRole("button").nth(1)).toHaveAttribute("aria-pressed", "true");
        await expectNoA11yViolations(page, "ranking, the week's board");
      });

      test(`the briefing, a table with a card staged, the comfort settings over it and the reveal have no structural accessibility violations (${lang}, ${size.name})`, { tag: "@once" }, async ({ page }) => {
        // Four audits and a cash on one page; the language's chunks load first.
        test.setTimeout(120_000);
        await page.goto(withLang("/?debug=1", lang));
        await startDebugNode(page, "case05", "c5_voice", { navigate: false, openTable: false });
        await expect(page.locator("html")).toHaveAttribute("lang", lang);
        const briefing = page.getByTestId("scene-briefing");
        await expect(briefing.getByRole("dialog")).toBeVisible();
        await waitForEntrance(briefing);
        await expectNoA11yViolations(page, "briefing");

        await page.getByTestId("open-table").click();
        await page.locator(".choices .choice:not([aria-disabled='true'])").first().click();
        await expect(page.locator(".gx-card.selected")).toHaveCount(1);
        await waitForEntrance(page.getByTestId("gauntlet-stage"));
        await expectNoA11yViolations(page, "table, a card staged");

        await page.getByTestId("open-comfort-settings").click();
        const comfort = page.getByTestId("comfort-dialog");
        await expect(comfort).toBeVisible();
        await waitForEntrance(comfort);
        await expectNoA11yViolations(page, "comfort settings over the table");
        await page.getByTestId("comfort-dialog-close").click();
        await expect(comfort).toHaveCount(0);

        await cashStakedCard(page);
        await expect(page.getByTestId("decision-next")).toBeVisible();
        await waitForEntrance(page.locator(".decision-reveal-backdrop"));
        await expectNoA11yViolations(page, "decision reveal");
      });

      test(`the open table after a push, with its 지금 상황 듣기 button, and an act's title card have no structural accessibility violations (${lang}, ${size.name})`, { tag: "@once" }, async ({ page }) => {
        test.setTimeout(120_000);
        await page.goto(withLang("/?debug=1", lang));
        // 사건 01's first table has the whole table on it: the stances, SCOUT and the heart's button.
        await startDebugNode(page, "case01", "start", { navigate: false });
        await expect(page.locator("html")).toHaveAttribute("lang", lang);
        const stage = page.getByTestId("gauntlet-stage");
        await page.locator(".choices .choice:not([aria-disabled='true'])").first().click();
        await page.getByTestId("commit-push").click();
        await expect(stage).toHaveAttribute("data-status", "live");
        await expect(page.getByTestId("table-listen")).toBeVisible();
        await waitForEntrance(stage);
        await expectNoA11yViolations(page, "the open table, a push made");

        // B-11(1): a run that reached 사건 08's first page opens on 2막's title card.
        await seedSave(page, savedRunAt("case08", CASE_START_NODES.case08, { dynamics: { windowIndex: 40 } }));
        await page.goto(withLang("/", lang));
        await page.getByTestId("resume-save").click();
        const card = page.getByTestId("act-card");
        await expect(card).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
        await expect(page.locator("html")).toHaveAttribute("lang", lang);
        await expectNoA11yViolations(page, "the act's title card");
      });

      test(`the finale's ending report and a side case's table have no structural accessibility violations (${lang}, ${size.name})`, { tag: "@once" }, async ({ page }) => {
        test.setTimeout(180_000);
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto(withLang("/?debug=1", lang));
        await startDebugNode(page, "final", "f_start", { navigate: false });
        await completeCurrentCase(page);
        await expect(page.locator(".ending-sequence")).toBeVisible();
        await expect(page.locator("html")).toHaveAttribute("lang", lang);
        await expectNoA11yViolations(page, "the finale's ending report");

        // E-11: the release's 번외 1 on its first table, the season left where it was.
        await seedSideCaseDevice(page);
        await page.goto(withLang("/", lang));
        await clickElement(page.getByTestId("side-case-open-side01"), "open side01");
        const screen = page.getByTestId("side-case-screen");
        await expect(screen).toHaveAttribute("data-side-node", "s1_start", { timeout: TRANSITION_TIMEOUT_MS });
        await dismissProtocolBreach(page);
        await expect(page.getByTestId("gauntlet-stage")).toHaveAttribute("data-status", "live");
        await waitForEntrance(screen);
        await expectNoA11yViolations(page, "a side case's table");
      });
    });
  }
}
