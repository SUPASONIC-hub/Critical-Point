import { expect, test } from "@playwright/test";
import { dismissProtocolBreach, startDebugNode } from "./helpers/gameFlow.js";
import { readJsonStorage, TEST_STORAGE_KEYS } from "./helpers/storage.js";
import { FIVE_RELICS, LAYOUT_VIEWPORTS, measureTable, OVERCLOCKED_BOARD, openBrokenBoard, SEALED_BOARD } from "./helpers/layout.js";

/**
 * The gauntlet's promises, in a browser.
 *
 * Each test is one thing the table says it does: the decision fits on the
 * screen, a push visibly compounds the pot, a bust takes the pot and says so,
 * the next board is broken in a way the player can see, and none of it goes
 * silent for a player who asked for less motion.
 */

/** The debug overlay is harness chrome; on a phone it sits over the action bar. */
async function openTable(page, caseId, nodeId) {
  await startDebugNode(page, caseId, nodeId);
  await page.addStyleTag({ content: ".debug-overlay { display: none !important; }" });
}

async function readNumber(locator) {
  return Number((await locator.textContent()).replace(/[^\d.]/g, ""));
}

async function pushUntilBust(page) {
  const stage = page.getByTestId("gauntlet-stage");
  for (let press = 0; press < 20; press += 1) {
    if ((await stage.getAttribute("data-status")) !== "live") break;
    await page.getByTestId("commit-push").click();
  }
  await expect(stage).toHaveAttribute("data-status", "bust");
}

/**
 * Presses push from inside the page at a chosen point of the beat the frame
 * loop is drawing: "on" the frame a beat lands, "off" halfway to the next one.
 * Reading the phase and clicking in the same frame is what makes the grade
 * deterministic; a click sent from the test runner lands whenever it lands.
 */
async function pushAtBeat(page, where) {
  return page.evaluate(
    (mode) =>
      new Promise((resolve) => {
        const root = document.documentElement;
        const button = document.querySelector("[data-testid='commit-push']");
        const started = performance.now();
        // The FX loop has to be observably running before any of its variables
        // can be trusted: `--gx-beat-live` is written each frame and left
        // standing when the loop stops, so a single read of "1" is also what a
        // stopped heartbeat looks like. Two differing phases prove it is ticking.
        let framesSeen = 0;
        let lastPhase = Number.NaN;
        const check = () => {
          const style = getComputedStyle(root);
          const beating = style.getPropertyValue("--gx-beat-live").trim() === "1";
          const phase = Number(style.getPropertyValue("--gx-beat-phase"));
          const inZone = style.getPropertyValue("--gx-beat-zone").trim() === "1";
          if (phase !== lastPhase) {
            framesSeen += 1;
            lastPhase = phase;
          }
          const live = beating && framesSeen >= 2;
          // `--gx-beat-zone` is the app's own answer to "would a press land in
          // the GOOD window right now", computed from the clock it grades with.
          // This used to aim at `phase <= 0.02` instead, which is not the same
          // target: phase clamps at 1 rather than wrapping, so it only sits
          // that low for the first 2% of a period -- about 12ms of a 600ms beat,
          // which is shorter than the 16.7ms frame this callback runs on. The
          // window was therefore routinely stepped straight over on a loaded
          // runner, and the reading that did catch it could already be a frame
          // stale by the time the click was dispatched. The GOOD window is
          // +/-18% of the period with a 60ms floor, so a frame of drift stays
          // inside it.
          const ready = live && (mode === "on" ? inZone : !inZone && phase >= 0.45 && phase <= 0.55);
          if (ready) {
            button.click();
            resolve(true);
          } else if (performance.now() - started > 8000) {
            resolve(false);
          } else {
            requestAnimationFrame(check);
          }
        };
        requestAnimationFrame(check);
      }),
    where,
  );
}

test("a push on the heartbeat builds a combo the pot pays for, and a slip breaks it", async ({ page }) => {
  await openTable(page, "case01", "start");
  await page.locator(".choices .choice").first().click();
  const stage = page.getByTestId("gauntlet-stage");

  expect(await pushAtBeat(page, "on")).toBe(true);
  await expect(stage).toHaveAttribute("data-last-grade", /^(perfect|good)$/);
  await expect(stage).toHaveAttribute("data-combo", "1");
  expect(await pushAtBeat(page, "on")).toBe(true);
  await expect(stage).toHaveAttribute("data-combo", "2");
  await expect(page.getByTestId("gauntlet-combo")).toContainText("2");
  await expect(page.getByTestId("gauntlet-groove")).toContainText("GROOVE");

  expect(await pushAtBeat(page, "off")).toBe(true);
  await expect(stage).toHaveAttribute("data-last-grade", "miss");
  await expect(stage).toHaveAttribute("data-combo", "0");
  await expect(stage).not.toHaveAttribute("data-groove", "0");
  await expect(page.locator(".gx-grade-miss")).toContainText("SLIP");

  await page.getByTestId("commit-confirm").click();
  await expect(page.locator(".gx-reveal-groove")).toContainText("GROOVE");
  await expect(page.getByTestId("consequence-ledger")).toContainText("박자 기록");
  await page.getByTestId("decision-next").click();
  const saved = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  expect(saved.dynamics.beatCombo).toBe(0);
  expect(saved.dynamics.bestCombo).toBe(2);
  expect(saved.log.at(-1).threshold.tempo.hits).toBe(2);
  expect(saved.log.at(-1).threshold.tempo.groovePot).toBeGreaterThan(0);
});

/** Closes case01 from its last scene with one push and a cash, and opens case02's first table. */
async function closeCaseOneIntoDraft(page) {
  await openTable(page, "case01", "c1_aftershock");
  await page.locator(".choices .choice:not([aria-disabled='true'])").first().click();
  await page.getByTestId("commit-push").click();
  await page.getByTestId("commit-confirm").click();
  await expect(page.getByTestId("relic-draft-notice")).toContainText("도구 3개");
  await page.getByTestId("decision-next").click();
  await page.locator(".next-case-panel button").click();
  await expect(page.getByTestId("relic-draft")).toBeVisible();
}

test("a closed case deals a relic draft that holds the clock and re-deals the table", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await closeCaseOneIntoDraft(page);
  const draft = page.getByTestId("relic-draft");
  await expect(draft.getByTestId("relic-option")).toHaveCount(3);
  await expect(page.getByTestId("protocol-breach")).toHaveCount(0);
  const offered = await draft.getByTestId("relic-option").first().getAttribute("data-relic");
  const saved = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  expect(saved.dynamics.relicOffer).toHaveLength(3);
  expect(saved.dynamics.relicOffer[0]).toBe(offered);

  // The clock does not start behind the draft.
  const before = await page.locator(".gx-clock b").textContent();
  await page.waitForTimeout(1200);
  await expect(page.locator(".gx-clock b")).toHaveText(before);

  await page.keyboard.press("1");
  await expect(draft).toHaveCount(0);
  await expect(page.getByTestId("relic-equipped")).toBeVisible();
  await expect(page.getByTestId("gauntlet-relics")).toBeVisible();
  const equipped = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  expect(equipped.dynamics.relics).toEqual([offered]);
  expect(equipped.dynamics.relicOffer).toEqual([]);
  expect(equipped.dynamics.schema.relics).toEqual([offered]);

  // The relics cost the phone one line of the bank row, and the REBOOT board no
  // longer spends a rules panel saying the rules reset -- so a case's first table
  // with a relic is shorter than it was before relics existed. Measured on the
  // table, so the briefing page the pick re-deals into is closed first.
  await dismissProtocolBreach(page);
  await expect(page.getByTestId("active-mutations")).toHaveCount(0);
  const layout = await page.evaluate(() => ({
    relicRow: document.querySelector("[data-testid='gauntlet-relics']").getBoundingClientRect().height,
    widest: Math.max(...[...document.querySelectorAll("body *")].map((element) => element.getBoundingClientRect().right)),
    innerWidth,
  }));
  expect(layout.relicRow).toBeLessThanOrEqual(26);
  expect(layout.widest).toBeLessThanOrEqual(layout.innerWidth + 1);

  // A reload after the pick does not deal the draft again.
  await page.reload();
  await page.locator(".intro button, .game-shell").first().waitFor();
  expect((await readJsonStorage(page, TEST_STORAGE_KEYS.save)).dynamics.relics).toEqual([offered]);
});

test("passing on the draft carries nothing and the table plays on", async ({ page }) => {
  await closeCaseOneIntoDraft(page);
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("relic-draft")).toHaveCount(0);
  await expect(page.getByTestId("gauntlet-relics")).toHaveCount(0);
  const saved = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  expect(saved.dynamics.relics).toEqual([]);
  expect(saved.dynamics.relicOffer).toEqual([]);
  await dismissProtocolBreach(page);
  await page.locator(".choices .choice:not([aria-disabled='true'])").first().click();
  await page.getByTestId("commit-push").click();
  await expect(page.getByTestId("gauntlet-stage")).not.toHaveAttribute("data-gauge", "0");
});

/**
 * One decision, one screen -- measured against the top of the action bar, on the
 * densest scenes the game has, on the boards that make a card tallest.
 *
 * This test used to open case01's first scene on one phone and compare the last
 * card to the bottom of the viewport, under the fixed bar. It stayed green while
 * 42 of 149 scenes hid a card on that phone. `layout-sweep.spec.js` walks every
 * scene in the weekly full pass; this holds the tightest ones on every push:
 * the five-card scenes a sweep found tightest, a fresh board, a sealed board
 * and an overclocked board carrying five relics, with the last card staked so
 * its detail is open. The project's own screen (1280x720 desktop, Pixel 7) and
 * a 390x844 phone must fit all of it.
 */
const DENSEST_SCENES = [["final", "f_start_owner"], ["case02", "c2_start_people"]];
const BOARD_STATES = [
  ["fresh board", null],
  ["sealed board", { schema: SEALED_BOARD }],
  ["overclocked board with five relics", { schema: OVERCLOCKED_BOARD, streak: 2, runPot: 4200, relics: FIVE_RELICS }],
];

async function expectHandAboveActionBar(page, label) {
  await page.addStyleTag({ content: ".debug-overlay { display: none !important; }" });
  await page.locator(".choices .choice:not(.gx-card-wild)").last().evaluate((card) => card.click());
  const table = await measureTable(page);
  expect(table.cards, label).toBeGreaterThan(3);
  expect(table.lastCard, `${label}: last card ${table.lastCard - table.actionsTop}px under the action bar`).toBeLessThanOrEqual(table.actionsTop);
  expect(table.widest, `${label}: wider than the screen`).toBeLessThanOrEqual(table.innerWidth + 1);
  for (const control of ["commit-push", "commit-confirm", "gauntlet-pot"]) {
    const box = await page.getByTestId(control).boundingBox();
    expect(box.y + box.height, `${label}: ${control} on screen`).toBeLessThanOrEqual(page.viewportSize().height);
  }
}

test("the densest decisions fit above the action bar on every board", async ({ page }) => {
  test.setTimeout(240_000);
  for (const size of [page.viewportSize(), LAYOUT_VIEWPORTS.phone]) {
    await page.setViewportSize(size);
    for (const [caseId, nodeId] of DENSEST_SCENES) {
      for (const [board, state] of BOARD_STATES) {
        if (state) await openBrokenBoard(page, caseId, nodeId, state);
        else await startDebugNode(page, caseId, nodeId);
        await expectHandAboveActionBar(page, `${caseId}/${nodeId} on a ${board} at ${size.width}x${size.height}`);
      }
    }
  }
});

test("a small phone fits every fresh board's decision", async ({ page }) => {
  // 360x740 holds a fresh board with the last card staked; a board carrying
  // rules can still push the wild card under the bar there. See priority 27.
  await page.setViewportSize(LAYOUT_VIEWPORTS["small phone"]);
  await startDebugNode(page, "case01", "c1_final_system");
  await expectHandAboveActionBar(page, "case01/c1_final_system on a fresh board at 360x740");
});

test("every push visibly compounds the pot, and the odds are never printed", async ({ page }) => {
  await openTable(page, "case01", "start");
  await expect(page.getByTestId("gauntlet-overdrive")).toContainText("DORMANT");
  await page.locator(".choices .choice").first().click();
  const pot = page.getByTestId("gauntlet-pot");
  let previous = await readNumber(pot);
  expect(previous).toBeGreaterThan(0);
  for (let press = 0; press < 3; press += 1) {
    await page.getByTestId("commit-push").click();
    await expect.poll(() => readNumber(pot)).toBeGreaterThanOrEqual(Math.floor(previous * 1.5));
    previous = await readNumber(pot);
  }
  await expect(page.getByTestId("gauntlet-overdrive")).toContainText("IGNITION");
  await expect(page.getByTestId("gauntlet-stage")).not.toContainText(/%/);
});

test("a bust takes the pot, says BUST, and deals a broken board", async ({ page }) => {
  await openTable(page, "case01", "start");
  await expect(page.getByTestId("gauntlet-run-signal")).toContainText("BUST 0");
  // Bank something first, so there is a pot for the wall to take.
  await page.locator(".choices .choice").first().click();
  await page.getByTestId("commit-push").click();
  await page.getByTestId("commit-confirm").click();
  await expect(page.getByTestId("consequence-ledger")).toContainText("판정 원인");
  await expect(page.getByTestId("consequence-ledger")).toContainText("다음 판");
  await page.getByTestId("decision-next").click();
  const banked = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  expect(banked.dynamics.runPot).toBeGreaterThan(0);

  await dismissProtocolBreach(page);
  await page.locator(".choices .choice").first().click();
  await pushUntilBust(page);
  await expect(page.locator(".gx-slam-bust")).toContainText("BUST");
  await expect(page.getByTestId("gauntlet-run-pot")).toHaveText("0");

  const reveal = page.locator(".decision-reveal");
  await expect(reveal.locator("h2")).toHaveText("BUST");
  await expect(page.getByTestId("consequence-ledger")).toContainText("판돈");
  await expect(reveal.locator(".decision-bonus")).toHaveCount(0);
  await expect(page.getByTestId("next-mutations")).toContainText("BLACKOUT");

  const saved = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  expect(saved.dynamics.runPot).toBe(0);
  expect(saved.dynamics.busts).toBe(1);
  expect(saved.dynamics.schema.faceDown).toBe(true);

  await page.getByTestId("decision-next").click();
  await expect(page.getByTestId("protocol-breach")).toContainText("BLACKOUT");
  await expect(page.getByTestId("active-mutations")).toContainText("BLACKOUT");
  await expect(page.getByTestId("active-rule-objective")).toContainText("사건 결과까지 살아남아");
  await expect(page.getByTestId("gauntlet-stage")).toHaveClass(/is-face-down/);
  await expect(page.getByTestId("gauntlet-run-signal")).toContainText("BUST 1");
  await expect(page.getByTestId("gauntlet-gauge")).toHaveText("22");
  await expect(page.locator(".gx-card-chips").first()).toHaveText("▒▒");
});

test("cashing without a single push seals the best card on the next board", async ({ page }) => {
  await openTable(page, "case01", "start");
  await page.locator(".choices .choice").first().click();
  await page.getByTestId("commit-confirm").click();
  await expect(page.getByTestId("next-mutations")).toContainText("COLD FEET");
  await expect(page.getByTestId("next-mutations")).toContainText("FRACTURE");
  await page.getByTestId("decision-next").click();
  await expect(page.getByTestId("active-mutations")).toContainText("COLD FEET");
  await expect(page.getByTestId("active-rule-objective")).toContainText("금고로 넘겨라");
  await expect(page.getByTestId("fracture-tax").first()).toContainText("1.5x");
  const sealed = page.locator(".gx-card.is-sealed");
  await expect(sealed).toHaveCount(1);
  await expect(page.getByTestId("sealed-card-lock")).toContainText("최고 칩 봉인");
  await expect(page.getByTestId("sealed-card-lock")).toContainText("30");
  await dismissProtocolBreach(page);
  await sealed.click();
  await expect(page.getByTestId("commit-confirm")).toBeDisabled();
  for (let press = 0; press < 6 && (await page.getByTestId("commit-confirm").isDisabled()); press += 1) {
    await page.getByTestId("commit-push").click();
  }
  await expect(page.getByTestId("commit-confirm")).toBeEnabled();
});

test("two hot cashouts trigger an overclock payout banner", async ({ page }) => {
  await openTable(page, "case01", "start");
  await page.locator(".choices .choice").first().click();
  for (let press = 0; press < 3; press += 1) await page.getByTestId("commit-push").click();
  await expect(page.getByTestId("gauntlet-overdrive")).toContainText("IGNITION");
  await page.getByTestId("commit-confirm").click();
  await page.getByTestId("decision-next").click();

  await dismissProtocolBreach(page);
  await page.locator(".choices .choice").first().click();
  for (let press = 0; press < 3; press += 1) await page.getByTestId("commit-push").click();
  await expect(page.getByTestId("gauntlet-overdrive")).toContainText("OVERCLOCK READY");
  await page.getByTestId("commit-confirm").click();
  await expect(page.locator(".decision-reveal")).toHaveClass(/is-overdrive/);
  await expect(page.getByTestId("overdrive-payout")).toContainText("OVERCLOCK TRIGGERED");
  await expect(page.getByTestId("next-mutations")).toContainText("OVERCLOCK");
  await page.getByTestId("decision-next").click();
  await expect(page.getByTestId("active-mutations")).toContainText("OVERCLOCK");
  await expect(page.getByTestId("overclock-card-boost").first()).toContainText("x2");
});

test("a second tab asks before it busts a bet another tab is holding", async ({ page, context }) => {
  await openTable(page, "case01", "start");
  await page.locator(".choices .choice").first().click();
  await page.getByTestId("commit-push").click();

  // A tab that only looks: it is asked, leaves the bet alone, and the first tab
  // plays on without being locked.
  const looker = await context.newPage();
  await looker.goto("/?debug=1");
  await looker.waitForSelector(".game-shell");
  await expect(looker.getByTestId("table-held-elsewhere")).toBeVisible();
  await looker.getByTestId("leave-held-window").click();
  await looker.close();
  await expect(page.getByTestId("table-lost-to-tab")).toHaveCount(0);
  await page.getByTestId("commit-confirm").click();
  await page.getByTestId("decision-next").click();
  expect((await readJsonStorage(page, TEST_STORAGE_KEYS.save)).dynamics.busts).toBe(0);

  // A tab that takes over: the held bet settles as a bust and the first tab locks.
  // The next board opens on its briefing page, which may carry a breach panel.
  await dismissProtocolBreach(page);
  await page.locator(".choices .choice").first().click();
  const taker = await context.newPage();
  await taker.goto("/?debug=1");
  await taker.waitForSelector(".game-shell");
  await taker.getByTestId("claim-held-window").click();
  await expect(taker.getByTestId("decision-next")).toBeVisible();
  await expect(page.getByTestId("table-lost-to-tab")).toBeVisible();
  expect((await readJsonStorage(taker, TEST_STORAGE_KEYS.save)).dynamics.busts).toBe(1);
  await taker.close();
});

test("reduced motion keeps the bust and the heat, and loses only the shake", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openTable(page, "case01", "start");
  await page.locator(".choices .choice").first().click();
  for (let press = 0; press < 3; press += 1) await page.getByTestId("commit-push").click();
  await expect.poll(() => page.evaluate(() => Number(getComputedStyle(document.documentElement).getPropertyValue("--gx-heat")))).toBeGreaterThan(0);
  const shake = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--gx-shake-x").trim());
  expect(["", "0.00px", "-0.00px"]).toContain(shake);
  await pushUntilBust(page);
  await expect(page.getByTestId("gauntlet-stage")).toHaveClass(/is-bust/);
  await expect(page.locator(".gx-slam-bust")).toBeVisible();
  await expect(page.locator(".gx-fx-bust")).toHaveCount(1);
});

test("the briefing page holds the clock, stakes a card from the page, and opens the table when it runs out", async ({ page }) => {
  await startDebugNode(page, "case01", "start", { openTable: false });
  const briefing = page.getByTestId("scene-briefing");
  await expect(briefing).toBeVisible();
  await expect(briefing.getByRole("dialog")).toBeVisible();
  await expect(briefing.locator(".gx-balloon")).not.toBeEmpty();
  await expect(briefing.locator(".gx-panel-file li")).toHaveCount(4);
  const timer = page.getByTestId("reading-timer");
  const first = Number(await timer.locator("b").textContent());
  expect(first).toBeGreaterThanOrEqual(12);
  await expect.poll(async () => Number(await timer.locator("b").textContent())).toBeLessThan(first);
  // The table's own clock has not moved while the page was up.
  await expect(page.locator(".gx-clock b")).toHaveText("45");

  // A card picked on the page opens the table with that card on it.
  const label = await briefing.getByTestId("briefing-card").nth(1).locator("span").textContent();
  await briefing.getByTestId("briefing-card").nth(1).click();
  await expect(briefing).toHaveCount(0);
  await expect(page.locator(".choices .choice.selected .gx-card-label")).toHaveText(label);
  await expect(page.getByTestId("commit-push")).toBeEnabled();

  // Left alone, a page runs out and the table opens with nothing staked.
  await startDebugNode(page, "case01", "c1_branch_people", { openTable: false });
  await expect(page.getByTestId("scene-briefing")).toBeVisible();
  await expect(page.getByTestId("scene-briefing")).toHaveCount(0, { timeout: 20_000 });
  await expect(page.getByTestId("commit-push")).toBeEnabled();
  await expect(page.locator(".choices .choice.selected")).toHaveCount(0);
});
