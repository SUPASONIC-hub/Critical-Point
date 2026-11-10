import { expect, test } from "./helpers/network.js";
import { COLD_OPENING_SEEN_KEY } from "../src/appConfig.js";
import { clickElement, TRANSITION_TIMEOUT_MS } from "./helpers/gameFlow.js";
import { clearGameStorage, readJsonStorage, readStorage, TEST_STORAGE_KEYS } from "./helpers/storage.js";

/**
 * B-3(1) 냉정한 오프닝, behind COLD_OPENING_ENABLED (src/coldOpeningSwitch.js),
 * on since 2026-11-10. Every other spec starts as a device that has seen the
 * page (the fixture's `coldOpeningSeen`, tests/helpers/network.js); these start
 * as one that has not. `?coldOpening=1`, the dev and e2e builds' way to play
 * the page while the switch is off, is used where a test means the page
 * whatever the switch says (the timed walk).
 */
test.use({ coldOpeningSeen: false });

async function freshIntro(page, search, { seen = false } = {}) {
  await page.goto(`/${search}`);
  await clearGameStorage(page);
  if (seen) await page.evaluate((key) => localStorage.setItem(key, "1"), COLD_OPENING_SEEN_KEY);
  await page.reload();
  await expect(page.getByTestId("start-first-case")).toBeEnabled({ timeout: TRANSITION_TIMEOUT_MS });
}

async function expectFirstScene(page) {
  await expect(page.locator(".game-shell")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  await expect(page.getByTestId("open-table")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  const save = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  expect(save?.nodeId).toBe("p1_start");
}

test("a device that has seen the page goes straight to the prologue's first scene", async ({ page }) => {
  await freshIntro(page, "?debug=1", { seen: true });
  await clickElement(page.getByTestId("start-first-case"), "start first case");
  await expectFirstScene(page);
  await expect(page.getByTestId("cold-opening")).toHaveCount(0);
});

test("a first season reads four panels, then 「3년 전」 opens the same first scene", async ({ page }) => {
  await freshIntro(page, "?debug=1");
  await clickElement(page.getByTestId("start-first-case"), "start first case");
  const opening = page.getByTestId("cold-opening");
  await expect(opening).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  await expect(opening.locator("#cold-opening-caption")).toHaveText("72시간");
  for (let panel = 1; panel < 4; panel += 1) {
    await clickElement(page.getByTestId("cold-opening-next"), `cold opening panel ${panel}`);
    await expect(opening).toHaveAttribute("data-panel", String(panel));
  }
  await expect(opening.locator("#cold-opening-caption")).toHaveText("3년 전");
  await expect(page.getByTestId("cold-opening-skip")).toHaveCount(0);
  // No run before the last press: the page is in front of the start, not part of it.
  expect((await readJsonStorage(page, TEST_STORAGE_KEYS.save))?.started ?? false).toBe(false);
  await clickElement(page.getByTestId("cold-opening-start"), "cold opening start");
  await expect(opening).toHaveCount(0);
  await expectFirstScene(page);
  expect(await readStorage(page, COLD_OPENING_SEEN_KEY)).toBe("1");
});

test("건너뛰기 goes straight on, and a device that has seen the page is not shown it again", async ({ page }) => {
  await freshIntro(page, "?debug=1");
  await clickElement(page.getByTestId("start-first-case"), "start first case");
  await clickElement(page.getByTestId("cold-opening-skip"), "cold opening skip");
  await expectFirstScene(page);
  expect(await readStorage(page, COLD_OPENING_SEEN_KEY)).toBe("1");

  // The same device, its run cleared: the page is not played twice.
  await page.evaluate((key) => {
    const seen = localStorage.getItem(key);
    localStorage.clear();
    localStorage.setItem(key, seen);
  }, COLD_OPENING_SEEN_KEY);
  await page.reload();
  await clickElement(page.getByTestId("start-first-case"), "start first case again");
  await expectFirstScene(page);
  await expect(page.getByTestId("cold-opening")).toHaveCount(0);
});

/**
 * The timed walk B-3(1) is judged by: the first screen to the first live
 * table, played by a reader who never hurries the page -- each cold-opening
 * panel held for its reading time (`panelReadingSeconds`, the table's 10
 * characters a second plus a press), and the first scene's page read for the
 * seconds its reading clock gives it before 판 열기. Run on purpose, never in a suite (about two and a
 * half minutes): `COLD_OPENING_TIMING=1 npm run test:e2e -- tests/cold-opening.spec.js --project=chromium --grep timed`.
 */
const LIVE_TABLE = ".choices .choice:not([aria-disabled='true'])";

async function timeToLiveTable(page, { coldOpening, patient }) {
  await freshIntro(page, coldOpening ? "?debug=1&coldOpening=1" : "?debug=1", { seen: !coldOpening });
  await page.addStyleTag({ content: ".debug-overlay { display: none !important; }" });
  await page.evaluate((gates) => {
    const times = { clickedAt: null, liveAt: null };
    window.__coldOpeningTimes = times;
    document.querySelector("[data-testid='start-first-case']").addEventListener("click", () => {
      times.clickedAt ??= performance.now();
    }, { capture: true });
    const observer = new MutationObserver(() => {
      if (document.querySelector(gates.held) || !document.querySelector(gates.live)) return;
      times.liveAt = performance.now();
      observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
  }, { held: "[data-testid='open-table'], [data-testid='act-card-continue'], [data-testid='relic-skip'], [data-testid='cold-opening']", live: LIVE_TABLE });
  await page.getByTestId("start-first-case").click();
  if (coldOpening) {
    const { COLD_OPENING_COPY } = await import("../src/components/coldOpeningCopy.js");
    const { panelReadingSeconds } = await import("../src/state/coldOpening.js");
    for (const [index, panel] of COLD_OPENING_COPY.ko.panels.entries()) {
      await expect(page.getByTestId("cold-opening")).toHaveAttribute("data-panel", String(index));
      if (patient) await page.waitForTimeout(panelReadingSeconds(panel) * 1000);
      const last = index === COLD_OPENING_COPY.ko.panels.length - 1;
      await page.getByTestId(last ? "cold-opening-start" : "cold-opening-next").click();
    }
  }
  await expect(page.getByTestId("open-table")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  // 프롤로그 01 opens with its reading clock held (ReadingClockAsk.jsx), so the
  // table opens on 판 열기: the patient reader presses it when the clock's
  // own reading time has passed.
  if (patient) {
    const clock = Number((await page.getByTestId("reading-timer").locator("b").textContent()).replace(/\D/g, ""));
    await page.waitForTimeout(clock * 1000);
  }
  await page.getByTestId("open-table").click();
  await expect(page.locator(LIVE_TABLE).first()).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  const times = await page.evaluate(() => window.__coldOpeningTimes);
  return (times.liveAt - times.clickedAt) / 1000;
}

test("timed: the first screen to the first live table, before and after", async ({ page }, testInfo) => {
  test.skip(!process.env.COLD_OPENING_TIMING, "a measurement, run on purpose");
  test.setTimeout(600_000);
  const rows = [];
  for (const patient of [true, false]) {
    for (const coldOpening of [false, true]) {
      const seconds = await timeToLiveTable(page, { coldOpening, patient });
      rows.push({ reader: patient ? "patient" : "fast", coldOpening, seconds: Math.round(seconds * 10) / 10 });
    }
  }
  console.log(`cold-opening timing ${testInfo.project.name}: ${JSON.stringify(rows)}`);
});
