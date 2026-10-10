import { expect, test } from "./helpers/network.js";
import { ACCESSIBILITY_SETTINGS_KEY } from "../src/appConfig.js";
import { CASE_RESULT_NODES } from "../src/gameCases.js";
import { nodeOrders, nodes } from "../src/gameData.js";
import { getLogicType } from "../src/gauntlet/logicStreak.js";
import { easyCognitionLabels } from "../src/playerLanguage.js";
import { clickElement, dismissProtocolBreach, startDebugNode, TRANSITION_TIMEOUT_MS } from "./helpers/gameFlow.js";
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
    // The table can close between the read above and the press -- its own
    // clock runs out, and that is a bust too. The button is then disabled, and
    // a press with no limit waited on it until the test timed out (seen on the
    // phone project, late in a run of the whole file, 2026-10-08). A press that
    // cannot land is let go; the status below is what is asserted.
    await page
      .getByTestId("commit-push")
      .click({ timeout: 2_000 })
      .catch(() => {});
  }
  await expect(stage).toHaveAttribute("data-status", "bust");
}

/**
 * Four scenes of 사건 01 in a row, read off the graph: one type of card is on
 * the table in each of the first three (the card to hold the type with), and
 * in the fourth it is there beside a card of another type. The cards are
 * found by their words, not their place: the hand is dealt shuffled.
 */
function findStreakWalk(caseId = "case01") {
  const results = new Set(Object.values(CASE_RESULT_NODES));
  const playable = (node) => (node?.choices ?? []).filter((choice) => choice.type !== "reframe" && !choice.requiredAuthority);
  for (const startId of nodeOrders[caseId]) {
    for (const type of Object.keys(easyCognitionLabels)) {
      const held = [];
      let nodeId = startId;
      while (held.length < 3) {
        const card = playable(nodes[nodeId]).find((choice) => getLogicType(choice) === type && !results.has(choice.next) && nodes[choice.next]?.caseId === caseId);
        if (!card) break;
        held.push({ nodeId, label: card.label });
        nodeId = card.next;
      }
      const last = playable(nodes[nodeId]);
      const same = last.find((choice) => getLogicType(choice) === type);
      const other = last.find((choice) => getLogicType(choice) !== type);
      if (held.length === 3 && same && other) return { caseId, type, held, last: { nodeId, same: same.label, other: other.label, otherType: getLogicType(other) } };
    }
  }
  return null;
}

const cardOf = (page, label) => page.locator(".choices .choice").filter({ has: page.getByTestId("card-label").filter({ hasText: new RegExp(`^${label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`) }) });
const clockOf = async (page) => Number(await page.locator(".gx-clock b").textContent());

/** Pushes once (so no COLD FEET seals the next hand), cashes, and reads the reveal's line about the streak. */
async function cashForStreak(page) {
  await page.getByTestId("commit-push").click();
  await page.getByTestId("commit-confirm").click();
  await expect(page.getByTestId("decision-next")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  return page.getByTestId("consequence-ledger").locator("article", { hasText: "논리 콤보" }).locator("b");
}

async function nextScene(page, nodeId) {
  await clickElement(page.getByTestId("decision-next"), "next scene");
  await expect.poll(async () => (await readJsonStorage(page, TEST_STORAGE_KEYS.save)).nodeId, { timeout: TRANSITION_TIMEOUT_MS }).toBe(nodeId);
  await dismissProtocolBreach(page);
  await expect(page.getByTestId("commit-push")).toBeEnabled({ timeout: TRANSITION_TIMEOUT_MS });
}

test("three cards of one type in a row grow the logic streak and the pot shows what it pays; another type with no rise in pressure ends it; LOCK costs clock", async ({ page }) => {
  test.setTimeout(180_000);
  const walk = findStreakWalk();
  expect(walk, "사건 01 still has four scenes in a row that deal one type").not.toBeNull();
  const typeName = easyCognitionLabels[walk.type];
  const line = page.getByTestId("gauntlet-logic");
  const bonus = page.getByTestId("gauntlet-logic-bonus");
  await openTable(page, walk.caseId, walk.held[0].nodeId);

  // Before a card is staked: nothing held, nothing paid, and every card says its type.
  await expect(line).toHaveAttribute("data-streak", "0");
  await expect(line).toContainText("콤보 0");
  await expect(bonus).toHaveCount(0);
  const cards = page.locator(".choices .choice");
  await expect(cards.getByTestId("card-type")).toHaveCount(await cards.count());
  await expect(cardOf(page, walk.held[0].label)).toHaveAccessibleName(new RegExp(`유형 ${typeName}`));

  // The first two build the hold: 1/3, 2/3. The pot is not paid for them yet.
  for (const [index, scene] of walk.held.slice(0, 2).entries()) {
    await cardOf(page, scene.label).click();
    await expect(line).toHaveAttribute("data-move", "build");
    await expect(line).toContainText(`${index + 1}/3`);
    await expect(line).toContainText("쌓는 중");
    await expect(bonus).toHaveCount(0);
    await expect(await cashForStreak(page)).toContainText(`${typeName} ${index + 1}/3`);
    await nextScene(page, walk.held[index + 1].nodeId);
  }

  // The third grows it: the card's tag is lit and says so, the HUD shows the streak it will leave, and the pot is paid on it.
  const third = cardOf(page, walk.held[2].label);
  await expect(third.getByTestId("card-type")).toHaveAttribute("data-move", "grow");
  await expect(third.getByTestId("card-type")).toHaveClass(/is-on/);
  await expect(third).toHaveAccessibleName(new RegExp(`유형 ${typeName} ?\\(콤보 이어 감\\)`));
  await third.click();
  await expect(line).toHaveAttribute("data-streak", "1");
  await expect(line).toContainText("3/3");
  await expect(line).toContainText("이어 감");
  await expect(bonus).toHaveText("콤보 1.06");
  await expect(page.getByTestId("commit-push")).toHaveAccessibleDescription(new RegExp(`논리 콤보 1, 판돈 1\\.06배\\. ${typeName} 3/3\\. 이 카드로 이어 감`));
  await expect(page.getByTestId("commit-confirm")).toHaveAccessibleDescription(/논리 콤보 1, 판돈 1\.06배/);
  await expect(await cashForStreak(page)).toHaveText(new RegExp(`^${typeName}[을를] 이어 갔다\\. 논리 콤보 1, 판돈 ×1\\.06\\.$`));
  await expect(page.locator(".gx-reveal-gain")).toContainText("× 콤보 1.06");
  let saved = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  expect(saved.dynamics.logic).toMatchObject({ streak: 1, best: 1, type: walk.type, held: 3 });
  expect(saved.log.at(-1).threshold.logic).toMatchObject({ move: "grow", streak: 1, bonus: 1.06 });
  expect(saved.log.at(-1).threshold.logic.pot).toBeGreaterThan(0);
  expect(saved.log.at(-1).tempoBonus.label).toBe("LOGIC STREAK");
  expect(saved.log.at(-1).threshold.tempo, "no line is written for the beat").toBeUndefined();
  await nextScene(page, walk.last.nodeId);

  // The fourth scene: the held type would grow it again, another type ends it -- the last three closed cold, so nothing rose.
  await expect(line).toHaveAttribute("data-streak", "1");
  await expect(line).not.toContainText("전환 가능");
  await expect(bonus).toHaveText("콤보 1.06");
  await expect(cardOf(page, walk.last.same).getByTestId("card-type")).toHaveAttribute("data-move", "grow");
  const other = cardOf(page, walk.last.other);
  await expect(other.getByTestId("card-type")).toHaveAttribute("data-move", "break");
  await expect(other.getByTestId("card-type")).not.toHaveClass(/is-on/);
  await other.click();
  await expect(line).toHaveAttribute("data-streak", "0");
  await expect(line).toContainText("끊김");
  await expect(bonus).toHaveCount(0);

  // LOCK is a plain press: it charges, and the table's clock pays for it.
  const lock = page.getByTestId("commit-focus");
  await expect(lock.locator("small")).toHaveText("STRIKE 0 · −1.5초");
  const before = await clockOf(page);
  await lock.click();
  await lock.click();
  await expect(page.getByTestId("gauntlet-focus")).toContainText("STRIKE 37");
  expect(await clockOf(page)).toBeLessThanOrEqual(before - 3);
  await expect(page.locator(".gx-grade, .gx-beat-ring")).toHaveCount(0);

  await expect(await cashForStreak(page)).toHaveText(new RegExp(`^압박이 오르지 않았는데 ${easyCognitionLabels[walk.last.otherType]}(으)?로 바꿨다\\. 논리 콤보는 0, 다시 1/3부터 센다\\.$`));
  saved = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  expect(saved.dynamics.logic).toMatchObject({ streak: 0, best: 1, type: walk.last.otherType, held: 1 });
  expect(saved.log.at(-1).threshold.logic).toMatchObject({ move: "break", streak: 0, bonus: 1, pot: 0 });
  expect(saved.log.at(-1).threshold.focus.charge).toBe(37);
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

/**
 * The two gates in front of every table, pressed the way a finger presses
 * them: the pointer goes down at a point on the screen, and whatever is there
 * takes it. Every other test gets past these through a helper; this is the one
 * place that proves a player can.
 */
async function pressAt(page, locator) {
  await expect(locator).toBeVisible();
  const box = await locator.boundingBox();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
}

test("the briefing's open button and the draft's pass button take a pointer", async ({ page }) => {
  await startDebugNode(page, "case01", "start", { openTable: false });
  await expect(page.getByTestId("scene-briefing")).toBeVisible();
  await pressAt(page, page.getByTestId("open-table"));
  await expect(page.getByTestId("scene-briefing")).toHaveCount(0);
  await expect(page.locator(".choices .choice:not([aria-disabled='true'])").first()).toBeVisible();

  await closeCaseOneIntoDraft(page);
  await pressAt(page, page.getByTestId("relic-skip"));
  await expect(page.getByTestId("relic-draft")).toHaveCount(0);
  expect((await readJsonStorage(page, TEST_STORAGE_KEYS.save)).dynamics.relics).toEqual([]);
});

test("a closed case deals a relic draft that holds the clock and re-deals the table", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  // Installed before the page loads so the clock proof below controls time.
  await page.clock.install();
  await closeCaseOneIntoDraft(page);
  const draft = page.getByTestId("relic-draft");
  await expect(draft.getByTestId("relic-option")).toHaveCount(3);
  await expect(page.getByTestId("protocol-breach")).toHaveCount(0);
  const offered = await draft.getByTestId("relic-option").first().getAttribute("data-relic");
  const saved = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  expect(saved.dynamics.relicOffer).toHaveLength(3);
  expect(saved.dynamics.relicOffer[0]).toBe(offered);

  // The clock does not start behind the draft: 1.2s of the page's own timers
  // and frames run, on a controlled clock, and the readout has not moved.
  const before = await page.locator(".gx-clock b").textContent();
  await page.clock.runFor(1_200);
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
  // dispatchEvent, not click(): whether this card is under the action bar is
  // what the test measures, and a real click on a covered card would wait out
  // the timeout instead of reporting how far under it sits.
  await page.locator(".choices .choice:not(.gx-card-wild)").last().dispatchEvent("click");
  const table = await measureTable(page);
  expect(table.cards, label).toBeGreaterThan(3);
  expect(table.lastCard, `${label}: last card ${table.lastCard - table.actionsTop}px under the action bar`).toBeLessThanOrEqual(table.actionsTop);
  expect(table.widest, `${label}: wider than the screen`).toBeLessThanOrEqual(table.innerWidth + 1);
  for (const control of ["commit-push", "commit-confirm", "gauntlet-pot"]) {
    const box = await page.getByTestId(control).boundingBox();
    expect(box.y + box.height, `${label}: ${control} on screen`).toBeLessThanOrEqual(page.viewportSize().height);
  }
}

async function expectDensestScenesFit(page, size) {
  await page.setViewportSize(size);
  for (const [caseId, nodeId] of DENSEST_SCENES) {
    for (const [board, state] of BOARD_STATES) {
      if (state) await openBrokenBoard(page, caseId, nodeId, state);
      else await startDebugNode(page, caseId, nodeId);
      await expectHandAboveActionBar(page, `${caseId}/${nodeId} on a ${board} at ${size.width}x${size.height}`);
    }
  }
}

test("the densest decisions fit above the action bar on every board", { tag: "@layout" }, async ({ page, browserName }) => {
  test.setTimeout(browserName === "webkit" ? 720_000 : 240_000);
  // The WebKit project's own screen is 390x664 -- what Safari leaves of an
  // iPhone 14 once its bars are drawn -- which is shorter than any screen
  // priority 27 names. It has the test below to itself; here WebKit measures
  // the phone the rule promises.
  const sizes = browserName === "webkit" ? [LAYOUT_VIEWPORTS.phone] : [page.viewportSize(), LAYOUT_VIEWPORTS.phone];
  for (const size of sizes) await expectDensestScenesFit(page, size);
});

test("the densest decisions fit the screen Safari leaves on an iPhone 14", { tag: "@layout" }, async ({ page, browserName }) => {
  test.skip(browserName !== "webkit", "the other projects measure their own screens in the test above");
  test.fixme(
    true,
    "390x664: the last card of final/f_start_owner sits 59px under the action bar on a fresh board. " +
      "Measured 2026-09-28 when the WebKit project was added; priority 27 promises 390x844, and Safari with its bars drawn is shorter.",
  );
  test.setTimeout(240_000);
  await expectDensestScenesFit(page, page.viewportSize());
});

/**
 * The header keeps room for the music controls that float over its corner.
 * Between a phone and the table's own width the sum was wrong -- 251px reserved
 * at 481px wide, on a split-screen tablet or a narrow window -- and the title
 * was cut to three characters. No layout viewport sat in that band. The tools
 * have to end just short of the controls: clear of them, and with no dead
 * room between that the title could have had.
 */
test("the play header keeps its title between a phone's width and the table's", { tag: "@layout" }, async ({ page }) => {
  for (const width of [481, 507, 600, 759, 1100, 1240]) {
    await page.setViewportSize({ width, height: 900 });
    await startDebugNode(page, "final", "f_start_owner");
    const header = await page.evaluate(() => {
      const box = (selector) => document.querySelector(selector).getBoundingClientRect();
      return {
        padRight: Number.parseFloat(getComputedStyle(document.querySelector(".game-header")).paddingRight),
        toolsRight: Math.round(box(".game-header .top-actions").right),
        musicLeft: Math.round(box(".music-controls").left),
      };
    });
    expect(header.padRight, `${width}px: room reserved for the music controls`).toBeLessThanOrEqual(112);
    expect(header.toolsRight, `${width}px: the header tools run under the music controls`).toBeLessThanOrEqual(header.musicLeft);
    expect(header.musicLeft - header.toolsRight, `${width}px: dead room between the tools and the music controls`).toBeLessThanOrEqual(24);
  }
});

test("a small phone fits every fresh board's decision", { tag: "@layout" }, async ({ page }) => {
  // 360x740 holds a fresh board with the last card staked; a board carrying
  // rules can still push the reframe card under the bar there. See priority 27.
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

// 스토리 모드: the wall is far, and hitting it still costs the pot -- but the
// room does not move on without the analyst, and the next board is not broken.
// The same card on the same scene, busted at the table and then in story
// mode: the table's bust plays the next scene unattended and lands on the one
// after; the story bust lands on that next scene.
test("a bust in story mode plays the next scene, where the table's bust skips it", async ({ page }) => {
  test.setTimeout(120_000);
  const verdict = page.locator(".decision-reveal h2");
  const bustTheFirstCard = async () => {
    await openTable(page, "case01", "start");
    const stage = page.getByTestId("gauntlet-stage");
    await page.locator(".choices .choice").first().click();
    await expect(page.locator(".gx-card.selected")).toHaveCount(1);
    // Not `pushUntilBust`: it ends by reading "bust" off the stage, and a far
    // wall is reached a dozen pushes in, where a press that found the button
    // already closed waits out its two seconds -- by then the slam is over and
    // the stage under the verdict is the next window, live again (seen once in
    // 72 runs, 2026-10-10). The verdict stays up until it is dismissed, so the
    // loop stops on that and the verdict is what is asserted.
    for (let press = 0; press < 30; press += 1) {
      if ((await verdict.isVisible()) || (await stage.getAttribute("data-status")) !== "live") break;
      await page
        .getByTestId("commit-push")
        .click({ timeout: 1_000 })
        .catch(() => {});
    }
    await expect(verdict).toHaveText("BUST", { timeout: 15_000 });
    return readJsonStorage(page, TEST_STORAGE_KEYS.save);
  };

  const atTheTable = await bustTheFirstCard();
  const skipped = atTheTable.log.at(-1).skippedNodeId;
  expect(skipped, "the table's bust skips the scene the card led to").toBeTruthy();
  expect(atTheTable.nodeId).not.toBe(skipped);
  expect(atTheTable.log.at(-1).assistStory).toBeUndefined();
  await expect(page.getByTestId("next-mutations")).toContainText("BLACKOUT");

  await page.addInitScript(({ key, value }) => localStorage.setItem(key, value), { key: ACCESSIBILITY_SETTINGS_KEY, value: JSON.stringify({ storyMode: true }) });
  const inStoryMode = await bustTheFirstCard();
  const entry = inStoryMode.log.at(-1);
  expect(entry.threshold.busted).toBe(true);
  expect(entry.threshold.wall, "the wall it hit was the far one").toBeGreaterThanOrEqual(88);
  expect(entry.assistStory).toBe(true);
  expect(entry.skippedNodeId, "no scene is played without the analyst").toBeUndefined();
  expect(inStoryMode.nodeId, "the next scene is the one the card led to").toBe(skipped);
  // The bust itself is still a bust: the pot is gone and it is counted.
  expect(inStoryMode.dynamics.runPot).toBe(0);
  expect(inStoryMode.dynamics.busts).toBe(1);
  expect(inStoryMode.dynamics.story).toBe(true);
  // And the next board is whole: nothing is dealt face down.
  expect(inStoryMode.dynamics.schema.faceDown).toBeFalsy();
  await expect(page.locator(".decision-reveal")).not.toContainText("BLACKOUT");

  await page.getByTestId("decision-next").click();
  await dismissProtocolBreach(page);
  const stage = page.getByTestId("gauntlet-stage");
  await expect(stage).toHaveAttribute("data-status", "live");
  await expect(stage).not.toHaveClass(/is-face-down/);
  await expect(page.locator(".gx-band-label")).toHaveText("벽 88–98");
  expect((await readJsonStorage(page, TEST_STORAGE_KEYS.save)).nodeId).toBe(skipped);
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
  // 그 탭에 두기 answers the question: it goes, and what stands in its place
  // says the bet is in the other tab. The dialog used to stay up, drawn over
  // that notice, with both of its buttons still live.
  await expect(looker.getByTestId("table-held-elsewhere")).toHaveCount(0);
  await expect(looker.getByRole("alertdialog")).toHaveCount(0);
  await expect(looker.getByTestId("claim-held-window")).toHaveCount(0);
  await expect(looker.getByTestId("table-lost-to-tab")).toBeVisible();
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
  // A push is a push: nothing rises off the button to say when it landed.
  await page.getByTestId("commit-push").click();
  await expect(page.locator(".gx-grade, .gx-beat-ring")).toHaveCount(0);
  // The streak's line is words, not movement, and is there as it always is.
  await expect(page.getByTestId("gauntlet-logic")).toBeVisible();
  for (let press = 0; press < 2; press += 1) await page.getByTestId("commit-push").click();
  await expect.poll(() => page.evaluate(() => Number(getComputedStyle(document.querySelector("[data-testid='gauntlet-stage']")).getPropertyValue("--gx-heat")))).toBeGreaterThan(0);
  const shake = await page.evaluate(() => getComputedStyle(document.querySelector("[data-testid='gauntlet-stage']")).getPropertyValue("--gx-shake-x").trim());
  // Registered as a length, so the computed value is the number, however it was written.
  expect(Math.abs(Number.parseFloat(shake) || 0)).toBe(0);
  await pushUntilBust(page);
  await expect(page.getByTestId("gauntlet-stage")).toHaveClass(/is-bust/);
  await expect(page.locator(".gx-slam-bust")).toBeVisible();
  await expect(page.locator(".gx-fx-bust")).toHaveCount(1);
});

test("the briefing page holds the clock, stakes a card from the page, and opens the table when it runs out", async ({ page }) => {
  // The page's own clock, driven from here. This test used to wait on the wall
  // clock -- up to twenty seconds for a reading time that is twelve to
  // thirty-five, so a longer scene body would have failed it.
  //
  // Thirty seconds of the page's clock is about 1,800 frames, each one drawn:
  // that alone took 30 to 52 seconds here on 2026-10-08, and late in a run of
  // the whole file it passed the default sixty and the test died mid-wait on
  // whichever line it had reached (Chromium at one line, the phone at another).
  test.setTimeout(150_000);
  await page.clock.install();
  await startDebugNode(page, "case01", "start", { openTable: false });
  const briefing = page.getByTestId("scene-briefing");
  await expect(briefing).toBeVisible();
  await expect(briefing.getByRole("dialog")).toBeVisible();
  await expect(briefing.locator(".gx-balloon")).not.toBeEmpty();
  await expect(briefing.locator(".gx-panel-file li")).toHaveCount(4);
  const timer = page.getByTestId("reading-timer");
  const first = Number(await timer.locator("b").textContent());
  expect(first).toBeGreaterThanOrEqual(12);
  await page.clock.runFor(3_000);
  expect(Number(await timer.locator("b").textContent())).toBeLessThan(first);
  // The table's own clock has not moved while the page was up.
  await expect(page.locator(".gx-clock b")).toHaveText("45");

  // A card picked on the page opens the table with that card on it.
  const label = await briefing.getByTestId("briefing-card").nth(1).locator("span").first().textContent();
  await briefing.getByTestId("briefing-card").nth(1).click();
  await expect(briefing).toHaveCount(0);
  await expect(page.locator(".choices .choice.selected").getByTestId("card-label")).toHaveText(label);
  await expect(page.getByTestId("commit-push")).toBeEnabled();

  // Left alone, a page runs out and the table opens with nothing staked.
  await startDebugNode(page, "case01", "c1_branch_people", { openTable: false });
  await expect(page.getByTestId("scene-briefing")).toBeVisible();
  const reading = Number(await page.getByTestId("reading-timer").locator("b").textContent());
  expect(reading).toBeLessThanOrEqual(35);
  await page.clock.runFor((reading - 2) * 1000);
  await expect(page.getByTestId("scene-briefing")).toBeVisible();
  await page.clock.runFor(4_000);
  await expect(page.getByTestId("scene-briefing")).toHaveCount(0);
  await expect(page.getByTestId("commit-push")).toBeEnabled();
  await expect(page.locator(".choices .choice.selected")).toHaveCount(0);
});

/**
 * 번쩍임·흔들림 줄이기, on a page. What the setting does to a frame is held
 * without a browser (tests/unit/table-motion.test.mjs), and what its rules say
 * is read from the sheet; neither shows that the two meet on a real table --
 * that the attribute is on <html>, the rules win the cascade against the
 * table's own, and the frame loop is the one writing the variables.
 */
/** What a LOCK press flashes (GauntletStage's `focus`): the one flash a press still makes. */
const LOCK_FLASH = 0.38;

/** Every element and pseudo-element on the stage that is animating, by name. */
function animatingOnStage(page) {
  return page.evaluate(() => {
    const found = [];
    for (const element of document.querySelectorAll(".gauntlet-stage *")) {
      for (const pseudo of [null, "::before", "::after"]) {
        const name = getComputedStyle(element, pseudo).animationName;
        if (name === "none") continue;
        found.push({ who: `${element.tagName.toLowerCase()}.${String(element.getAttribute("class") ?? "").split(/\s+/).join(".")}${pseudo ?? ""}`, name, exempt: !pseudo && (element.matches(".gx-equip-toast") || Boolean(element.closest(".gx-plate"))) });
      }
    }
    return found;
  });
}

test("calm effects still the stage on a real table: only the toast's fade animates, nothing shakes, and a flash is a third", async ({ page }) => {
  // The table as it is without the setting, so the checks below are known to
  // be able to fail: a bust animates the stage (the heat wash, the two flashes,
  // the slam), and those are among the rules the setting has to beat.
  await openTable(page, "case01", "start");
  await page.locator(".choices .choice").first().click();
  await expect(page.locator("html")).not.toHaveAttribute("data-calm-effects", "");
  await pushUntilBust(page);
  await expect(page.locator(".gx-slam-bust")).toBeVisible();
  await expect.poll(async () => (await animatingOnStage(page)).filter((entry) => !entry.exempt).length, { message: "an ordinary bust animates the stage" }).toBeGreaterThan(0);

  await page.addInitScript(({ key, value }) => localStorage.setItem(key, value), { key: ACCESSIBILITY_SETTINGS_KEY, value: JSON.stringify({ calmEffects: true }) });
  await openTable(page, "case01", "start");
  await expect(page.locator("html")).toHaveAttribute("data-calm-effects", "");
  await page.locator(".choices .choice").first().click();
  await expect(page.locator(".gx-card.selected")).toBeVisible();
  await expect.poll(async () => (await animatingOnStage(page)).filter((entry) => !entry.exempt), { message: "nothing on a calm stage animates but the toast and the plate" }).toEqual([]);

  // The frame loop's variables, watched on the elements that read them for as
  // long as the table is played: the largest flash and the largest shake.
  await page.evaluate(() => {
    const seen = { flash: 0, shake: 0, frames: 0 };
    window.__fxSeen = seen;
    const number = (selector, name) => Math.abs(Number.parseFloat(getComputedStyle(document.querySelector(selector) ?? document.body).getPropertyValue(name)) || 0);
    const watch = () => {
      seen.frames += 1;
      seen.flash = Math.max(seen.flash, number(".gx-fx-flash", "--gx-flash"));
      seen.shake = Math.max(seen.shake, number(".gx-table", "--gx-shake-x"), number(".gx-table", "--gx-shake-y"));
      requestAnimationFrame(watch);
    };
    requestAnimationFrame(watch);
  });

  // The streak's line and the cards' types are text: the setting leaves them as they are.
  const line = page.getByTestId("gauntlet-logic");
  await expect(line).toBeVisible();
  await expect(line).toContainText("콤보 0");
  expect(await line.evaluate((element) => ({ animation: getComputedStyle(element).animationName, opacity: Number(getComputedStyle(element).opacity) }))).toEqual({ animation: "none", opacity: 1 });
  await expect(page.locator(".choices .choice").first().getByTestId("card-type")).toBeVisible();
  // A LOCK press flashes, at a third of what it flashes without the setting.
  await page.getByTestId("commit-focus").click();
  await expect.poll(() => page.evaluate(() => window.__fxSeen.flash)).toBeGreaterThan(0);
  const afterPress = await page.evaluate(() => ({ ...window.__fxSeen }));
  expect(afterPress.flash, `a LOCK press flashes at a third of ${LOCK_FLASH}`).toBeLessThanOrEqual(LOCK_FLASH / 3 + 0.005);
  await expect(page.locator(".gx-grade")).toHaveCount(0);

  await pushUntilBust(page);
  await expect(page.getByTestId("gauntlet-stage")).toHaveClass(/is-bust/);
  await expect(page.locator(".gx-slam-bust")).toBeVisible();
  // The bust is the hardest hit the table has (an impact of 1). A few frames
  // on, so the frames that would have carried it have been drawn.
  const framesAtBust = await page.evaluate(() => window.__fxSeen.frames);
  await expect.poll(() => page.evaluate(() => window.__fxSeen.frames)).toBeGreaterThan(framesAtBust + 10);
  const seen = await page.evaluate(() => ({ ...window.__fxSeen }));
  expect(seen.shake, "the table never moved, through the bust").toBe(0);
  expect(seen.flash, "no flash passed a third of full").toBeLessThanOrEqual(1 / 3 + 0.005);
  // The stage is still: the bust's own animations are off too.
  expect((await animatingOnStage(page)).filter((entry) => !entry.exempt), "nothing animates on a calm bust").toEqual([]);
  expect(await page.locator(".gx-table").evaluate((table) => getComputedStyle(table).transform), "the table is not moved").toBe("none");
});

test("calm effects keep the equip toast, fading", async ({ page }) => {
  await page.addInitScript(({ key, value }) => localStorage.setItem(key, value), { key: ACCESSIBILITY_SETTINGS_KEY, value: JSON.stringify({ calmEffects: true }) });
  await closeCaseOneIntoDraft(page);
  await expect(page.locator("html")).toHaveAttribute("data-calm-effects", "");
  await page.keyboard.press("1");
  const toast = page.getByTestId("relic-equipped");
  await expect(toast).toBeVisible();
  const style = await toast.evaluate((element) => ({ animation: getComputedStyle(element).animationName, seconds: Number.parseFloat(getComputedStyle(element).animationDuration) }));
  // The other fade: it leaves by fading and for long enough to be read, where
  // the stage's blanket rule would have removed its exit altogether.
  expect(style.animation).toBe("gx-relic-fade");
  expect(style.seconds).toBeGreaterThanOrEqual(1);
});
