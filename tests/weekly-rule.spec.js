import { BACKEND_ORIGIN, expect, test } from "./helpers/network.js";

import { NEAR_WALL_SHIFT, weekStartMs, WEEKLY_RULES } from "../src/gauntlet/weeklyRules.js";
import { NEW_GAME_PLUS_KEY } from "../src/appConfig.js";
import { WEEK_RULE_OFF_STORAGE_KEY, WEEK_RULE_ON_STORAGE_KEY } from "../src/state/weeklyRuleChoice.js";
import { clickElement, dismissProtocolBreach, TRANSITION_TIMEOUT_MS } from "./helpers/gameFlow.js";
import { readJsonStorage, TEST_STORAGE_KEYS } from "./helpers/storage.js";

/**
 * 이번 주의 규칙 in an event week. Every other test plays on a weekly clock
 * held on a week without a rule (src/state/weeklyClock.js), so this is the one
 * place the start screen's line, the briefing's panel, the near wall at the
 * table and the ranking's two boards are seen. The clock is moved the way the
 * pinned build allows: `__weeklyRuleClock`, set before the page's scripts run.
 * Only the week's rule reads it; the table's own clock is the page's.
 */

const EVENT = WEEKLY_RULES[0];
const DAY = 24 * 60 * 60 * 1000;
/** Tuesday noon of the event week, and of the week before it (the notice). */
const IN_EVENT_WEEK = weekStartMs(EVENT.week) + DAY + 3 * 60 * 60 * 1000;
const WEEK_BEFORE = IN_EVENT_WEEK - 7 * DAY;

async function setWeeklyClock(page, ms) {
  await page.addInitScript((at) => {
    globalThis.__weeklyRuleClock = at;
  }, ms);
}

/**
 * A device that has finished a season (NEW GAME+ open): the week's rule is on
 * by default there. A fresh device's first season starts without it (E-8).
 */
async function markReturning(page) {
  await page.addInitScript((key) => {
    localStorage.setItem(key, "true");
  }, NEW_GAME_PLUS_KEY);
}

/** From the intro to the first case's briefing page, and what it says about the week. */
async function openFirstBriefing(page) {
  await clickElement(page.getByTestId("start-first-case"), "start first case");
  await expect(page.locator(".game-shell")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  await expect(page.getByTestId("open-table")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
}

/**
 * 저장 후 나가기: the season is written with its table (`dynamics`) and the
 * intro comes back. Opening "/" over a save would walk straight back into it.
 */
async function saveAndLeave(page) {
  await page.getByRole("button", { name: "저장 후 나가기" }).click();
  await expect(page.getByTestId("start-first-case").or(page.getByTestId("resume-save")).first()).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  return (await readJsonStorage(page, TEST_STORAGE_KEYS.save))?.dynamics ?? null;
}

/** The wall band the first table prints under 현재 위험 ("벽 56–92 · 심박 …"). */
async function readFirstBand(page) {
  await dismissProtocolBreach(page);
  const risk = page.locator(".gx-situation-risk small");
  await expect(risk).toContainText("벽 ");
  const [, low, high] = /벽 (\d+)–(\d+)/.exec(await risk.innerText()) ?? [];
  return [Number(low), Number(high)];
}

test("weekly rule: the start line, the briefing panel and the near wall, against an ordinary week", async ({ page }) => {
  test.setTimeout(120_000);
  // An ordinary week first: no line, no panel, and the board's own wall.
  await page.goto("/");
  await expect(page.getByTestId("start-first-case")).toBeVisible();
  await expect(page.getByTestId("weekly-rule-line")).toHaveCount(0);
  await openFirstBriefing(page);
  await expect(page.getByTestId("week-rule-panel")).toHaveCount(0);
  const ordinary = await readFirstBand(page);
  const plain = await saveAndLeave(page);
  expect(plain, "the season was saved with its table").not.toBeNull();
  expect(plain.weekRule).toBeNull();

  // The event week, on a device that finished a season: the save is gone, so "/" is the intro.
  await setWeeklyClock(page, IN_EVENT_WEEK);
  await markReturning(page);
  await page.evaluate(() => localStorage.clear());
  await page.goto("/");
  const line = page.getByTestId("weekly-rule-line");
  await expect(line).toBeVisible();
  await expect(line).toContainText("이번 주의 규칙");
  await expect(line).toContainText("NEAR WALL");
  const off = page.getByTestId("weekly-rule-off");
  await expect(off).not.toBeChecked();
  await expect(page.getByLabel("이번 주의 규칙 없이 시작(평소 순위로)")).toBeVisible();
  await openFirstBriefing(page);
  const panel = page.getByTestId("week-rule-panel");
  await expect(panel).toBeVisible();
  await expect(panel).toContainText("이번 주의 규칙 · 이 시즌이 끝날 때까지");
  await expect(panel).toContainText("NEAR WALL");
  const near = await readFirstBand(page);
  expect(near, `the wall stands ${NEAR_WALL_SHIFT} nearer under the week's rule`).toEqual([ordinary[0] - NEAR_WALL_SHIFT, ordinary[1] - NEAR_WALL_SHIFT]);
  expect((await saveAndLeave(page))?.weekRule, "the season is stamped with the week's rule").toBe(EVENT.id);
});

test("weekly rule turned down on the start screen: an ordinary season in an event week", async ({ page }) => {
  test.setTimeout(90_000);
  await setWeeklyClock(page, IN_EVENT_WEEK);
  await markReturning(page);
  await page.goto("/");
  const off = page.getByTestId("weekly-rule-off");
  await off.check();
  await expect(off).toBeChecked();
  expect(await page.evaluate((key) => localStorage.getItem(key), WEEK_RULE_OFF_STORAGE_KEY)).toBe("1");
  await openFirstBriefing(page);
  await expect(page.getByTestId("week-rule-panel")).toHaveCount(0);
  await dismissProtocolBreach(page);
  expect((await saveAndLeave(page))?.weekRule).toBeNull();

  // The box is a preference of the device: the intro drawn again still has it ticked.
  await expect(page.getByTestId("weekly-rule-off")).toBeChecked();
});

test("weekly rule on a first season (E-8): off by default in the near-wall week, taken up by the box", async ({ page }) => {
  test.setTimeout(120_000);
  // A fresh device in W46: the line says whom the week is for, the box is the other one, and the season is ordinary.
  await setWeeklyClock(page, IN_EVENT_WEEK);
  await page.goto("/");
  const line = page.getByTestId("weekly-rule-line");
  await expect(line).toContainText("돌아온 분석관을 위한 이번 주의 규칙");
  await expect(line).toContainText("NEAR WALL");
  await expect(page.getByTestId("weekly-rule-off")).toHaveCount(0);
  const on = page.getByTestId("weekly-rule-on");
  await expect(on).not.toBeChecked();
  await expect(page.getByLabel("이번 주의 규칙으로 시작(이번 주 순위로)")).toBeVisible();
  await openFirstBriefing(page);
  await expect(page.getByTestId("week-rule-panel")).toHaveCount(0);
  await dismissProtocolBreach(page);
  expect((await saveAndLeave(page))?.weekRule, "a first season starts without the week's rule").toBeNull();

  // The same week on a fresh device again, with the box ticked: the season takes the rule.
  await page.evaluate(() => localStorage.clear());
  await page.goto("/");
  await page.getByTestId("weekly-rule-on").check();
  expect(await page.evaluate((key) => localStorage.getItem(key), WEEK_RULE_ON_STORAGE_KEY)).toBe("1");
  await openFirstBriefing(page);
  await expect(page.getByTestId("week-rule-panel")).toContainText("NEAR WALL");
  await dismissProtocolBreach(page);
  expect((await saveAndLeave(page))?.weekRule, "taken up, the season is stamped").toBe(EVENT.id);
  await expect(page.getByTestId("weekly-rule-on")).toBeChecked();
});

test("weekly rule notice: the week before says what is coming, and deals nothing yet", async ({ page }) => {
  test.setTimeout(90_000);
  await setWeeklyClock(page, WEEK_BEFORE);
  await page.goto("/");
  const line = page.getByTestId("weekly-rule-line");
  await expect(line).toContainText("다음 주의 규칙");
  await expect(line).toContainText("월요일 0시부터");
  await expect(page.getByTestId("weekly-rule-off")).toHaveCount(0);
  await openFirstBriefing(page);
  await expect(page.getByTestId("week-rule-panel")).toHaveCount(0);
  await dismissProtocolBreach(page);
  expect((await saveAndLeave(page))?.weekRule).toBeNull();
});

test("weekly rule moved (10-22): W44 is an ordinary week, and W46 tells of W47 on its own line", async ({ page }) => {
  test.setTimeout(60_000);
  // Wednesday of W44 (2026-10-28): no rule, and no notice either (W45 has none).
  await setWeeklyClock(page, weekStartMs("2026-W44") + 2 * DAY + 3 * 60 * 60 * 1000);
  await page.goto("/");
  await expect(page.getByTestId("start-first-case")).toBeVisible();
  await expect(page.getByTestId("weekly-rule-line")).toHaveCount(0);
  await expect(page.getByTestId("weekly-rule-off")).toHaveCount(0);

  // The event week, W46: its own rule, and the test week after it.
  await page.evaluate(() => localStorage.clear());
  await setWeeklyClock(page, IN_EVENT_WEEK);
  await page.goto("/");
  const line = page.getByTestId("weekly-rule-line");
  await expect(line).toContainText("NEAR WALL");
  await expect(line).toContainText("다음 주의 규칙은 AUDIT & CASCADE");
});

test("weekly rule ranking: two boards in an event week, each asked of the server by its week", async ({ page }) => {
  const asked = [];
  const row = (tag, score, week) => ({
    run_tag: tag,
    player_name: tag,
    case_id: "season-final",
    case_title: "SEASON 01 COMPLETE",
    completed_at: "2026-11-10T09:00:00Z",
    score,
    week,
    summary: { burstScore: score, rank: "B", primary: ["curiosity", 90], seasonComplete: true, averageResponseTime: 14, reframeCount: 2 },
  });
  await page.route(`${BACKEND_ORIGIN}/**`, (route) => route.fulfill({ status: 200, contentType: "application/json", body: "[]" }));
  await page.route(`${BACKEND_ORIGIN}/rest/v1/public_rankings**`, (route) => {
    const week = new URL(route.request().url()).searchParams.get("week");
    asked.push(week);
    const rows = week === "is.null" ? [row("PLAIN001", 71, null)] : [row("WEEKLY01", 66, EVENT.week), row("WEEKLY02", 60, EVENT.week)];
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(rows) });
  });
  await page.addInitScript((url) => {
    localStorage.setItem("critical-point-telemetry-url", url);
    localStorage.setItem("critical-point-telemetry-key", "anon");
  }, BACKEND_ORIGIN);
  await setWeeklyClock(page, IN_EVENT_WEEK);
  await page.goto("/");
  await page.getByRole("button", { name: "랭킹" }).first().click();
  await expect(page.locator(".ranking-page")).toBeVisible();

  const tabs = page.getByTestId("ranking-week-tabs");
  await expect(tabs).toBeVisible();
  const ordinary = tabs.getByRole("button", { name: "평소 순위" });
  const weekly = tabs.getByRole("button", { name: /이번 주의 규칙 · NEAR WALL/ });
  await expect(ordinary).toHaveAttribute("aria-pressed", "true");
  await expect(weekly).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator(".ranking-row")).toHaveCount(1);
  await expect(page.locator(".ranking-row").first()).toContainText("PLAIN001");
  expect(asked.at(-1), "the ordinary board asks for the rows with no week").toBe("is.null");

  await weekly.click();
  await expect(weekly).toHaveAttribute("aria-pressed", "true");
  await expect(ordinary).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator(".ranking-row")).toHaveCount(2);
  await expect(page.locator(".ranking-row").first()).toContainText("WEEKLY01");
  expect(asked.at(-1), "the week's board asks for that week's rows").toBe(`eq.${EVENT.week}`);

  await ordinary.click();
  await expect(page.locator(".ranking-row")).toHaveCount(1);
  expect(asked.at(-1)).toBe("is.null");
});
