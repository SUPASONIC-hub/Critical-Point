import { readFileSync } from "node:fs";
import { expect, test } from "./helpers/network.js";
import { ACCESSIBILITY_SETTINGS_KEY, NEW_GAME_PLUS_KEY, NEW_GAME_PLUS_MEMORY_KEY } from "../src/appConfig.js";
import { CASE_START_NODES } from "../src/gameCases.js";
import { nodes } from "../src/gameData.js";
import { getReadingSeconds } from "../src/gauntlet/gauntletEngine.js";
import { MUTATION_RULES, UNLOCK_LADDER } from "../src/gauntlet/tableUnlocks.js";
import { easyResourceLabels } from "../src/playerLanguage.js";
import {
  cashStakedCard,
  clickElement,
  clickThroughMotion,
  completeCurrentCase,
  dismissProtocolBreach,
  startDebugNode,
  TRANSITION_TIMEOUT_MS,
  waitForEntrance,
} from "./helpers/gameFlow.js";
import { FIVE_RELICS, openBrokenBoard } from "./helpers/layout.js";
import { seedSave } from "./helpers/seededSave.js";
import { readJsonStorage, TEST_STORAGE_KEYS, writeJsonStorage } from "./helpers/storage.js";

/**
 * The table's keys (priority 83), and the two ways a window could be left
 * that the table now refuses: a card the run has no authority for, staked by
 * its number, and a bust reloaded while the slam still showed the wall.
 *
 * Until this file the only keys any test pressed were 1 and Escape on the
 * draft and Tab on the intro.
 */

/** A scene whose fourth card needs FIELD ACCESS, which a fresh run does not hold. */
const GATED = { caseId: "prologue01", nodeId: "p1_counter" };
const gatedCards = nodes[GATED.nodeId].choices.filter((choice) => choice.type !== "reframe");
const lockedIndex = gatedCards.findIndex((choice) => choice.requiredAuthority);

async function openTable(page, caseId = "case01", nodeId = "start") {
  await startDebugNode(page, caseId, nodeId);
  await page.addStyleTag({ content: ".debug-overlay { display: none !important; }" });
}

const stageOf = (page) => page.getByTestId("gauntlet-stage");
const gaugeOf = async (page) => Number(await stageOf(page).getAttribute("data-gauge"));
const selectedLabel = (page) => page.locator(".gx-card.selected").getByTestId("card-label");

/** A key as the keyboard sends it: the character the layout types, and the key it was typed on. */
async function sendKey(page, init) {
  await page.evaluate((options) => {
    (document.activeElement ?? document.body).dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, cancelable: true, ...options }));
  }, init);
}

// @once, here and below: the desktop project only (playwright.config.js). A
// key has no place on the screen, and the table takes one whatever the pointer
// is (useTableKeys.js), so a test that presses keys and reads the table's state
// or the save is tagged. Not tagged: the tests that put focus where a pointer
// or Tab leaves it, the ones that measure, and the staged steps, whose key line
// is drawn by the pointer -- and those still press 1, 2, Space, W, Enter, E and
// Q on the phone.
test("number keys stake, Space and W push, Enter cashes", { tag: "@once" }, async ({ page }) => {
  // A scene that deals 판을 다시 짠다, so the hand's last number is the wild card.
  await openTable(page, "case02", "c2_logs");
  const labels = await page.locator(".choices .choice").getByTestId("card-label").allTextContents();
  await expect(page.locator(".gx-card-wild")).toHaveCount(1);

  await page.keyboard.press("2");
  await expect(selectedLabel(page)).toHaveText(labels[1]);
  await page.keyboard.press("1");
  await expect(selectedLabel(page)).toHaveText(labels[0]);
  await page.keyboard.press("1");
  await expect(page.locator(".gx-card.selected")).toHaveCount(0);
  await page.keyboard.press("9");
  await expect(page.locator(".gx-card.selected"), "a number past the hand stakes nothing").toHaveCount(0);
  await page.keyboard.press(String(labels.length));
  await expect(page.locator(".gx-card-wild.selected"), "the last number is 판을 다시 짠다").toHaveCount(1);
  await page.keyboard.press("1");

  await page.keyboard.press("Space");
  await expect.poll(() => gaugeOf(page)).toBeGreaterThanOrEqual(7);
  const afterSpace = await gaugeOf(page);
  await page.keyboard.press("w");
  await expect.poll(() => gaugeOf(page)).toBeGreaterThanOrEqual(afterSpace + 7);

  await page.keyboard.press("Enter");
  await expect(stageOf(page)).toHaveAttribute("data-status", "cashed");
  await expect(page.getByTestId("decision-next")).toBeVisible();
  const saved = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  expect(saved.log.at(-1).threshold.pushes).toBe(2);
  expect(saved.log.at(-1).threshold.forced).toBe(false);
});

/** The seconds the table's clock shows it has left. */
const clockOf = async (page) => Number(await page.locator(".gx-clock b").textContent());

test("E locks: a press charges and costs the clock, Q changes the stance and the charge goes with it", { tag: "@once" }, async ({ page }) => {
  await openTable(page);
  await page.keyboard.press("1");
  const focus = page.getByTestId("gauntlet-focus");
  await expect(focus).toContainText("STRIKE 0");
  // The button says what a press costs, to the eye and to a screen reader.
  const lock = page.getByTestId("commit-focus");
  await expect(lock.locator("small")).toHaveText("0 · −1.5초");
  await expect(lock).toHaveAccessibleDescription(/누를 때마다 자원 배율이 오르고 시간이 1\.5초 줄어든다\. 칩 배율은 LOCK으로 1\.5배까지만 오른다\. 70 이상 충전해 확정하면 다음 판에서 치른다$/);
  await expect(page.locator(".gx-focus-reticle, .gx-beat-ring"), "no ring to time a press against").toHaveCount(0);

  // Any moment is as good as another: the press is not timed.
  const before = await clockOf(page);
  await page.keyboard.press("e");
  await expect(focus).toContainText("STRIKE 17");
  await page.keyboard.press("e");
  await expect(focus).toContainText("STRIKE 37");
  await expect(lock.locator("small")).toHaveText("37 · −1.5초");
  expect(await clockOf(page), "two presses cost three seconds of the table's clock").toBeLessThanOrEqual(before - 3);
  await expect(focus.locator("small"), "below the cap the signal names the multiplier").toHaveText(/^배율 ×1\.\d · 자원 ×/);
  // At the cap the word comes first, so a line cut short by its ellipsis still says it.
  await page.keyboard.press("e");
  await expect(focus).toContainText("STRIKE 59");
  await expect(focus.locator("small")).toHaveText(/^상한 ×1\.5 · 자원 ×/);
  await expect(lock).toHaveAccessibleDescription(/칩 배율이 1\.5배에 닿아 이번 판에는 더하지 않는다\. 70 이상 충전해 확정하면 다음 판에서 치른다$/);
  await expect(page.locator(".gx-grade"), "and nothing grades them").toHaveCount(0);
  await expect(stageOf(page)).toHaveAttribute("data-status", "live");

  await page.keyboard.press("q");
  await expect(page.locator(".gx-focus-modes button.mode-steady")).toHaveAttribute("aria-pressed", "true");
  await expect(focus, "a charge belongs to the stance that built it").toContainText("STEADY 0");
  await page.keyboard.press("q");
  await page.keyboard.press("q");
  await expect(page.locator(".gx-focus-modes button.mode-strike")).toHaveAttribute("aria-pressed", "true");
});

/**
 * SCOUT (B1), pressed as a player presses it: R, with the focus on the band
 * button the way a pointer or Tab leaves it. The look is spent once a window,
 * and the spent button stays where it was, aria-disabled, so the focus is not
 * dropped to the page (decision 11).
 */
test("R scouts the wall once: the band narrows to 20, the clock pays 3 seconds, and the spent button keeps the focus", async ({ page }) => {
  await openTable(page);
  await page.keyboard.press("1");
  const scout = page.getByTestId("commit-scout");
  // The name starts with what the pill shows (axe 4.14 label-in-name) and adds the price.
  await expect(scout).toHaveAccessibleName(/^벽 \d+–\d+ · 조회, 시간 3초$/);
  await expect(scout).toHaveAttribute("aria-disabled", "false");
  const bandOf = async () => (await scout.textContent()).match(/벽 (\d+)–(\d+)/).slice(1).map(Number);
  const [low, high] = await bandOf();
  await scout.focus();
  const before = await clockOf(page);
  await page.keyboard.press("r");
  await expect(scout).toContainText("조회함");
  await expect(scout).toHaveAttribute("aria-disabled", "true");
  await expect(scout, "the spent button keeps the focus it had").toBeFocused();
  const [min, max] = await bandOf();
  expect(max - min, "the look narrows the band to 2 x SCOUT_REACH").toBeLessThanOrEqual(20);
  expect(min).toBeGreaterThanOrEqual(low);
  expect(max).toBeLessThanOrEqual(high);
  expect(await clockOf(page), "the look costs three seconds of the table's clock").toBeLessThanOrEqual(before - 3);

  // Once a window: neither R nor the button spends it again.
  const after = await clockOf(page);
  await page.keyboard.press("r");
  // force: Playwright counts aria-disabled as not enabled, and the click is the point here.
  await scout.click({ force: true });
  expect(await clockOf(page), "a spent look costs nothing").toBeGreaterThan(after - 3);
  expect(await bandOf()).toEqual([min, max]);
  await expect(scout).toBeFocused();
  await expect(stageOf(page)).toHaveAttribute("data-status", "live");
});

test("the letters work on a Hangul layout", { tag: "@once" }, async ({ page }) => {
  await openTable(page);
  await page.keyboard.press("1");
  await sendKey(page, { key: "ㅈ", code: "KeyW" });
  await expect.poll(() => gaugeOf(page), "ㅈ is the W key").toBeGreaterThanOrEqual(7);
  await sendKey(page, { key: "ㅂ", code: "KeyQ" });
  await expect(page.locator(".gx-focus-modes button.mode-steady")).toHaveAttribute("aria-pressed", "true");
});

test("a key held with Ctrl, Cmd or Alt is the browser's, and a repeat is not a press", { tag: "@once" }, async ({ page }) => {
  await openTable(page);
  for (const modifier of ["ctrlKey", "metaKey", "altKey"]) {
    await sendKey(page, { key: "1", code: "Digit1", [modifier]: true });
    await sendKey(page, { key: " ", code: "Space", [modifier]: true });
    await sendKey(page, { key: "w", code: "KeyW", [modifier]: true });
  }
  await sendKey(page, { key: " ", code: "Space", repeat: true });
  await expect(page.locator(".gx-card.selected")).toHaveCount(0);
  expect(await gaugeOf(page)).toBe(0);
  const saved = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  expect(saved.dynamics?.openSeed ?? null, "nothing touched the window").toBeNull();

  await page.keyboard.press("1");
  await sendKey(page, { key: "Enter", code: "Enter", ctrlKey: true });
  await expect(stageOf(page)).toHaveAttribute("data-status", "live");
});

// The pointer pushed, so focus is on 밀어붙인다 and the hand goes back to the
// keys. Space held there used to push twice: once from the table on the first
// keydown, and once more from the button itself, which took the repeats the
// table had let through as a key press of its own. A second push can be the wall.
test("Space held down pushes once, with the pointer's focus left on the push button", async ({ page }) => {
  await openTable(page);
  await page.keyboard.press("1");
  const push = page.getByTestId("commit-push");
  await push.click();
  await expect(push).toBeFocused();
  await expect.poll(() => gaugeOf(page)).toBeGreaterThanOrEqual(7);
  const afterClick = await gaugeOf(page);

  await page.keyboard.down("Space");
  // Playwright sends a key that is already down as a repeat, as a keyboard does.
  for (let repeat = 0; repeat < 6; repeat += 1) await page.keyboard.down("Space");
  await expect.poll(() => gaugeOf(page)).toBeGreaterThanOrEqual(afterClick + 7);
  const afterHold = await gaugeOf(page);
  await page.keyboard.up("Space");
  // Two frames on, so a click the button made of the key coming up would have landed.
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  expect(await gaugeOf(page), "the key coming up pushes nothing").toBe(afterHold);
  await expect(stageOf(page)).toHaveAttribute("data-status", "live");

  await page.keyboard.press("Enter");
  await expect(stageOf(page)).toHaveAttribute("data-status", "cashed");
  await expect(page.getByTestId("decision-next")).toBeVisible();
  const saved = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  expect(saved.log.at(-1).threshold.pushes, "one push from the pointer and one from the held key").toBe(2);
});

test("keys do not reach the table under the reveal", { tag: "@once" }, async ({ page }) => {
  await openTable(page);
  await page.keyboard.press("1");
  await page.keyboard.press("Enter");
  await expect(page.locator(".decision-reveal-backdrop")).toBeVisible();
  const before = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  await sendKey(page, { key: "1", code: "Digit1" });
  await sendKey(page, { key: " ", code: "Space" });
  await sendKey(page, { key: "w", code: "KeyW" });
  await expect(page.getByTestId("scene-briefing")).toHaveCount(0);
  const after = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  expect(after.dynamics.windowIndex).toBe(before.dynamics.windowIndex);
  expect(after.dynamics.openSeed ?? null).toBeNull();
  await expect(page.locator(".decision-reveal-backdrop")).toBeVisible();
});

test("a locked card refuses its number key as it refuses a click", { tag: "@once" }, async ({ page }) => {
  expect(lockedIndex, "the scene still deals a gated card").toBeGreaterThan(0);
  await openTable(page, GATED.caseId, GATED.nodeId);
  const locked = page.locator(".choices .choice").nth(lockedIndex);
  await expect(locked).toHaveAttribute("aria-disabled", "true");
  await expect(locked).toContainText("잠김");

  await page.keyboard.press(String(lockedIndex + 1));
  await expect(page.locator(".gx-card.selected")).toHaveCount(0);
  await expect(page.getByTestId("commit-confirm")).toBeDisabled();
  await page.keyboard.press("Enter");
  await expect(stageOf(page)).toHaveAttribute("data-status", "live");
  expect((await readJsonStorage(page, TEST_STORAGE_KEYS.save)).dynamics?.openCardId ?? null).toBeNull();

  // On the briefing page too: the key opens nothing and stakes nothing.
  await startDebugNode(page, GATED.caseId, GATED.nodeId, { openTable: false });
  await expect(page.getByTestId("scene-briefing")).toBeVisible();
  await page.keyboard.press(String(lockedIndex + 1));
  await expect(page.getByTestId("scene-briefing")).toBeVisible();
});

// The folded 사건 파일 opens on the run's six numbers and its clue count
// (`describeStanding`, src/gauntlet/tableReadout.js). A locked card states its
// condition in two of them and the table printed neither.
const standingLine = (page) => page.getByTestId("brief-standing");

/** Opens the folded briefing, or shuts it; a fold already there is left alone. */
async function setBriefFold(page, open) {
  const fold = page.locator(".gx-brief");
  if ((await fold.evaluate((element) => element.open)) !== open) {
    await clickElement(fold.locator(":scope > summary"), `${open ? "open" : "shut"} 사건 파일`);
  }
  await expect(fold).toHaveJSProperty("open", open);
}

/** The number a text prints after each of the six names, and the clues it counts; null for one it does not print. */
function readStanding(text) {
  const after = (pattern) => {
    const found = text.match(pattern);
    return found ? Number(found[1]) : null;
  };
  return {
    ...Object.fromEntries(Object.entries(easyResourceLabels).map(([key, label]) => [key, after(new RegExp(`${label} (-?\\d+)`))])),
    clues: after(/단서 (\d+)개/),
  };
}

/** The same seven as the save holds them. */
function heldStanding(save) {
  return {
    ...Object.fromEntries(Object.keys(easyResourceLabels).map((key) => [key, Number(save?.resources?.[key]) || 0])),
    clues: (save?.discoveredClues ?? []).length,
  };
}

/** Waits until the line and the save agree, and returns what both hold. */
async function expectLinePrintsTheSave(page, where) {
  await expect
    .poll(
      async () => {
        const printed = JSON.stringify(readStanding((await standingLine(page).textContent()) ?? ""));
        const held = JSON.stringify(heldStanding(await readJsonStorage(page, TEST_STORAGE_KEYS.save)));
        return printed === held ? "same" : `the line prints ${printed}, the save holds ${held}`;
      },
      { message: `the briefing's standing line ${where}`, timeout: 10_000 },
    )
    .toBe("same");
  return heldStanding(await readJsonStorage(page, TEST_STORAGE_KEYS.save));
}

test("the folded briefing prints the six numbers and the clue count the save holds, a locked card quotes the same two, and the next table prints the new ones", async ({ page }) => {
  test.setTimeout(120_000);
  expect(lockedIndex, "the scene still deals a gated card").toBeGreaterThan(0);
  await openTable(page, GATED.caseId, GATED.nodeId);
  await expect(stageOf(page)).toHaveAttribute("data-status", "live");

  await setBriefFold(page, true);
  await expect(standingLine(page)).toBeVisible();
  expect(await standingLine(page).evaluate((line) => line.previousElementSibling?.tagName), "the line is the fold's first").toBe("SUMMARY");
  const before = await expectLinePrintsTheSave(page, "on the table the run opened");

  // The scene's challenge leads the table's own list.
  const challenge = page.getByTestId("brief-challenge");
  await expect(challenge).toHaveCount(1);
  await expect(challenge).toHaveText(/\S+: \S/);
  expect(await challenge.evaluate((item) => item === item.parentElement.firstElementChild), "the challenge is its list's first item").toBe(true);

  // The locked card's sentence ends "지금 믿음 N, 단서 N개." (`getAuthorityGate`).
  const locked = page.locator(".choices .choice").nth(lockedIndex);
  await expect(locked).toHaveAttribute("aria-disabled", "true");
  const quoted = ((await locked.textContent()) ?? "").match(/지금 믿음 (-?\d+), 단서 (\d+)개/);
  expect(quoted, "the locked card says what the run holds now").not.toBeNull();
  expect({ trust: Number(quoted[1]), clues: Number(quoted[2]) }, "the card and the line quote the same trust and clues").toEqual({ trust: before.trust, clues: before.clues });

  // Shut again before the bet: the open fold takes the room the cards stand in.
  await setBriefFold(page, false);
  await clickElement(page.locator(".choices .choice:not([aria-disabled='true'])").first(), "stake the first open card");
  await cashStakedCard(page);
  await expect(page.getByTestId("decision-next")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  await clickElement(page.getByTestId("decision-next"), "next after the reveal");
  await expect(page.locator(".decision-reveal-backdrop")).toHaveCount(0, { timeout: TRANSITION_TIMEOUT_MS });
  await expect
    .poll(async () => (await readJsonStorage(page, TEST_STORAGE_KEYS.save))?.nodeId, { message: "the run moved on to the next scene", timeout: TRANSITION_TIMEOUT_MS })
    .not.toBe(GATED.nodeId);
  // The next table by its 판 열기, not by waiting out the briefing's reading clock.
  await dismissProtocolBreach(page);
  await expect(stageOf(page)).toHaveAttribute("data-status", "live");

  await setBriefFold(page, true);
  await expect(standingLine(page)).toBeVisible();
  const after = await expectLinePrintsTheSave(page, "on the table after the cash");
  expect(after, "the cashed card moved the numbers").not.toEqual(before);

  // At a small phone's width the line wraps: nothing of it is cut, sideways or by a clamp, and it can be brought on screen.
  await page.setViewportSize({ width: 360, height: 740 });
  await setBriefFold(page, true);
  const fit = await page.locator(".gx-brief").evaluate((fold) => {
    const line = fold.querySelector("[data-testid='brief-standing']");
    line.scrollIntoView({ block: "nearest", inline: "nearest" });
    const box = line.getBoundingClientRect();
    return {
      cutSideways: line.scrollWidth > line.clientWidth + 1,
      clamped: line.scrollHeight > line.clientHeight + 1,
      left: Math.round(box.left),
      right: Math.round(box.right),
      screen: document.documentElement.clientWidth,
      itemsCut: Array.from(fold.querySelectorAll("li")).filter((item) => item.scrollWidth > item.clientWidth + 1).length,
    };
  });
  expect(fit.cutSideways, "the line is not cut at 360px").toBe(false);
  expect(fit.clamped, "the line is not clamped to fewer lines than it has").toBe(false);
  expect(fit.left, "the line starts on the screen").toBeGreaterThanOrEqual(0);
  expect(fit.right, "the line ends on the screen").toBeLessThanOrEqual(fit.screen + 1);
  expect(fit.itemsCut, "nothing in the fold's lists is cut, the challenge included").toBe(0);
  await expect(standingLine(page)).toBeInViewport();
  expect(readStanding((await standingLine(page).textContent()) ?? ""), "the line still prints all seven at that width").toEqual(after);
});

// A save written while the key could still stake a locked card holds that card
// as the open bet. The runtime refuses it, so the window used to stay closed and
// unsettled through every reload.
test("a save that holds a locked card as its bet still settles", { tag: "@once" }, async ({ page }) => {
  await openTable(page, GATED.caseId, GATED.nodeId);
  await page.keyboard.press("1");
  await expect.poll(async () => (await readJsonStorage(page, TEST_STORAGE_KEYS.save)).dynamics?.openSeed ?? null).not.toBeNull();
  const save = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  await page.goto("/profile.jpg");
  save.dynamics.openCardId = gatedCards[lockedIndex].id;
  save.dynamics.suspended = null;
  await writeJsonStorage(page, TEST_STORAGE_KEYS.save, save);
  await page.goto("/?debug=1");

  await expect(page.locator(".game-shell")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  await expect(page.getByTestId("decision-next")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  const settled = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  expect(settled.dynamics.busts).toBe(1);
  expect(settled.dynamics.windowIndex).toBe(save.dynamics.windowIndex + 1);
  expect(settled.log.at(-1).threshold.forced, "the room played its own card").toBe(true);
  expect(settled.log.at(-1).choiceId).not.toBe(gatedCards[lockedIndex].id);
});

test("an untouched window that runs out cannot be replayed by reloading under the slam", { tag: "@once" }, async ({ page }) => {
  test.setTimeout(120_000);
  // The shortest clock a board can carry, so the test waits twelve seconds, not forty-five.
  await openBrokenBoard(page, "case01", "start", { schema: { seconds: 12 } });
  const fresh = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  expect(fresh.dynamics?.openSeed ?? null, "reading alone is not a touch").toBeNull();

  // Read from inside the page on the frame the bust renders: the slam lasts
  // 1.35s and the runner's own polling would spend a good part of it.
  const closed = await page.evaluate(
    (key) =>
      new Promise((resolve) => {
        const started = performance.now();
        const check = () => {
          const status = document.querySelector("[data-testid='gauntlet-stage']")?.getAttribute("data-status");
          if (status === "bust") {
            resolve({ wallDrawn: Boolean(document.querySelector(".gx-gauge-wall")), dynamics: JSON.parse(localStorage.getItem(key)).dynamics });
          } else if (performance.now() - started > 40_000) resolve(null);
          else requestAnimationFrame(check);
        };
        requestAnimationFrame(check);
      }),
    TEST_STORAGE_KEYS.save,
  );
  expect(closed, "the clock ran out").not.toBeNull();
  expect(closed.wallDrawn, "the wall is on screen").toBe(true);
  expect(closed.dynamics.openSeed, "and the save already says the window closed, and how").toMatch(/~timeout$/);
  expect(closed.dynamics.busts ?? 0, "before the verdict is committed").toBe(0);

  await page.reload();
  await expect(page.locator(".game-shell")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  await expect(page.getByTestId("decision-next").or(page.getByTestId("scene-briefing")).first()).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  const after = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  expect(after.dynamics.busts, "the bust stands").toBe(1);
  expect(after.dynamics.windowIndex).toBe((fresh.dynamics?.windowIndex ?? 0) + 1);
  expect(after.dynamics.schema.mutations, "and it is still the clock that ran out").toContain("silence");
  expect(after.nodeId, "the same scene is not dealt again").not.toBe(fresh.nodeId);
});

test("Space and Enter belong to the control the keyboard walked to", async ({ page }) => {
  await openTable(page);
  const cards = page.locator(".choices .choice");
  const labels = await page.locator(".choices .choice").getByTestId("card-label").allTextContents();

  // Walked to with Tab: the card answers, the table does not.
  await cards.nth(0).focus();
  await page.keyboard.press("Tab");
  await expect(cards.nth(1)).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(selectedLabel(page), "Tab and Enter stake a card").toHaveText(labels[1]);
  await expect(stageOf(page), "and do not cash it").toHaveAttribute("data-status", "live");
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Space");
  await expect(selectedLabel(page)).toHaveText(labels[0]);
  expect(await gaugeOf(page), "Space on a focused card does not push").toBe(0);

  await page.getByRole("button", { name: "저장", exact: true }).focus();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "저장", exact: true })).toBeFocused();
  await page.keyboard.press("Space");
  expect(await gaugeOf(page), "Space on 저장 saves").toBe(0);
  await expect(stageOf(page)).toHaveAttribute("data-status", "live");

  // Left there by the pointer: the hand is back on the keys, and they are the table's.
  await cards.nth(0).click();
  await cards.nth(0).click();
  await expect(selectedLabel(page)).toHaveText(labels[0]);
  await page.keyboard.press("Space");
  await expect.poll(() => gaugeOf(page)).toBeGreaterThanOrEqual(7);
  await expect(selectedLabel(page), "the card the pointer left focused is still staked").toHaveText(labels[0]);
  await page.keyboard.press("Enter");
  await expect(stageOf(page)).toHaveAttribute("data-status", "cashed");
});

test("the briefing page keeps focus and Tab inside it, and the keys open the table", async ({ page }) => {
  await startDebugNode(page, "case01", "start", { openTable: false });
  const briefing = page.getByTestId("scene-briefing");
  await expect(briefing).toBeVisible();
  const inside = () => page.evaluate(() => Boolean(document.activeElement?.closest("[data-testid='scene-briefing']")));
  // The runtime focuses the scene title a frame after the page mounts.
  await expect.poll(inside).toBe(true);
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(resolve)))));
  expect(await inside(), "focus stays on the page once the scene has settled").toBe(true);

  for (let press = 0; press < 12; press += 1) {
    await page.keyboard.press(press % 4 === 3 ? "Shift+Tab" : "Tab");
    expect(await inside(), `Tab ${press + 1} left the page`).toBe(true);
  }

  // A focused control on the page answers Enter itself: the clock is held, the table stays shut.
  await page.getByTestId("reading-timer").focus();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("reading-timer")).toHaveAttribute("aria-checked", "true");
  await expect(briefing).toBeVisible();

  await page.keyboard.press("2");
  await expect(briefing).toHaveCount(0);
  await expect(page.locator(".gx-card.selected")).toHaveCount(1);
  await page.keyboard.press("Space");
  await expect.poll(() => gaugeOf(page), "the table has the keys once the page is gone").toBeGreaterThanOrEqual(7);
});

test("the relic draft keeps focus inside it, and Enter takes the focused relic", async ({ page }) => {
  await openTable(page, "case01", "c1_aftershock");
  await page.locator(".choices .choice:not([aria-disabled='true'])").first().click();
  await page.getByTestId("commit-push").click();
  await page.getByTestId("commit-confirm").click();
  await page.getByTestId("decision-next").click();
  await page.locator(".next-case-panel button").click();
  const draft = page.getByTestId("relic-draft");
  await expect(draft).toBeVisible();
  const inside = () => page.evaluate(() => Boolean(document.activeElement?.closest("[data-testid='relic-draft']")));
  await expect.poll(inside).toBe(true);
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(resolve)))));
  expect(await inside()).toBe(true);
  for (let press = 0; press < 8; press += 1) {
    await page.keyboard.press(press % 3 === 2 ? "Shift+Tab" : "Tab");
    expect(await inside(), `Tab ${press + 1} left the draft`).toBe(true);
  }

  // Keys for the table do nothing behind the draft.
  await page.keyboard.press("w");
  await expect(draft).toBeVisible();

  const options = draft.getByTestId("relic-option");
  await options.nth(1).focus();
  const focused = await options.nth(1).getAttribute("data-relic");
  await page.keyboard.press("Enter");
  await expect(draft).toHaveCount(0);
  expect((await readJsonStorage(page, TEST_STORAGE_KEYS.save)).dynamics.relics).toEqual([focused]);
  // The page that follows the draft takes the focus the draft gave up.
  await expect.poll(() => page.evaluate(() => Boolean(document.activeElement?.closest("[data-testid='scene-briefing']")))).toBe(true);
  await dismissProtocolBreach(page);
  await page.keyboard.press("1");
  await expect(page.locator(".gx-card.selected")).toHaveCount(1);
});

/**
 * The relic slots: with five tools held, taking one is a swap. The pick opens
 * the swap step and takes nothing, Escape goes back to the offer, a number
 * picks again, and the tool clicked there is the one that leaves the save.
 */
test("with five tools held, a draft pick asks which to put down, Escape goes back, and the tool put down leaves the save", async ({ page }) => {
  await openBrokenBoard(page, "case01", "c1_aftershock", { relics: [...FIVE_RELICS] });
  await page.locator(".choices .choice:not([aria-disabled='true'])").first().click();
  await page.getByTestId("commit-push").click();
  await page.getByTestId("commit-confirm").click();
  await page.getByTestId("decision-next").click();
  await page.locator(".next-case-panel button").click();
  const draft = page.getByTestId("relic-draft");
  await expect(draft).toBeVisible();
  const options = draft.getByTestId("relic-option");
  const drops = draft.getByTestId("relic-drop");
  const taken = await options.first().getAttribute("data-relic");
  expect(FIVE_RELICS, "the offer holds no tool already carried").not.toContain(taken);

  await options.first().click();
  await expect(drops).toHaveCount(FIVE_RELICS.length);
  await expect(drops.first(), "the swap step takes the focus").toBeFocused();
  await expect(draft.locator(".gx-draft-kicker")).toContainText("도구 칸 가득");
  expect((await readJsonStorage(page, TEST_STORAGE_KEYS.save)).dynamics.relics, "nothing is taken before a tool is put down").toEqual([...FIVE_RELICS]);

  await page.keyboard.press("Escape");
  await expect(drops).toHaveCount(0);
  await expect(options.first()).toHaveAttribute("data-relic", taken);
  await page.keyboard.press("1");
  await expect(drops).toHaveCount(FIVE_RELICS.length);
  const dropped = await drops.nth(1).getAttribute("data-relic");
  await drops.nth(1).click();
  await expect(draft).toHaveCount(0);
  const kept = (await readJsonStorage(page, TEST_STORAGE_KEYS.save)).dynamics.relics;
  expect([...kept].sort()).toEqual([...FIVE_RELICS.filter((id) => id !== dropped), taken].sort());
});

/**
 * The staged table (src/gauntlet/tableUnlocks.js): the five prologues turn the
 * rules on in steps, and a rule that is not on yet is not drawn and its key is
 * not the table's. Each step is opened by the debug jump, on a plain run. What
 * each step holds is written out here rather than read from the module the
 * stage reads.
 */
const WHOLE = { logic: true, lock: true, stance: true, chain: true };
const NO_LOCK = { logic: true, lock: false, stance: false, chain: false };
/** The line over an introduction. 프롤로그 01 has its own: nothing was added to the first table. */
const FIRST_TABLE = "FIRST TABLE · 이 판은 이렇게 합니다";
const NEW_PROTOCOL = "NEW PROTOCOL · 이번 사건부터 규칙이 늘어납니다";
const STAGED_STEPS = [
  { caseId: "prologue01", on: { logic: false, lock: false, stance: false, chain: false }, lines: 2, kicker: FIRST_TABLE },
  { caseId: "prologue02", on: NO_LOCK, lines: 2, kicker: NEW_PROTOCOL },
  { caseId: "prologue03", on: NO_LOCK, lines: 3, kicker: NEW_PROTOCOL },
  // Four lines since RULES_MARK 3: the audit and the links open here with FRACTURE, told in one.
  { caseId: "prologue04", on: { logic: true, lock: true, stance: false, chain: true }, lines: 4, kicker: NEW_PROTOCOL },
  { caseId: "prologue05", on: WHOLE, lines: 3, kicker: NEW_PROTOCOL },
  { caseId: "case01", on: WHOLE, lines: 0 },
];

/** A scene's briefing page, with the table behind it still shut. */
async function openBriefing(page, caseId, nodeId = CASE_START_NODES[caseId]) {
  await startDebugNode(page, caseId, nodeId, { openTable: false });
  await page.addStyleTag({ content: ".debug-overlay { display: none !important; }" });
  await expect(page.getByTestId("scene-briefing")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
}

/** Whether the table took the key. One it has no use for is left to the page, not prevented. */
async function keyTaken(page, init) {
  return page.evaluate(
    (options) => !document.body.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, cancelable: true, ...options })),
    init,
  );
}

/** What of the staged rules the open table draws and keys, against what the step has turned on. */
async function expectTableDraws(page, on) {
  const count = (drawn) => (drawn ? 1 : 0);
  await expect(page.getByTestId("scene-briefing")).toHaveCount(0);
  await expect(page.getByTestId("commit-push")).toBeEnabled();
  await expect(page.getByTestId("commit-confirm")).toHaveCount(1);
  await expect(page.getByTestId("gauntlet-bpm"), "the heartbeat is the table itself").toHaveCount(1);
  // The beat is gone from every step: nothing marks a moment to press on.
  await expect(page.locator(".gx-beat-ring, .gx-focus-reticle, .gx-grade, [data-testid='gauntlet-combo']")).toHaveCount(0);
  // A card says its type wherever cards are shown; the streak they earn is drawn from the step that has it.
  const cards = page.locator(".choices .choice");
  await expect(cards.getByTestId("card-type")).toHaveCount(await cards.count());
  await expect(page.getByTestId("gauntlet-logic")).toHaveCount(count(on.logic));
  if (on.logic) await expect(page.getByTestId("gauntlet-logic")).toContainText("콤보 0");
  await expect(page.getByTestId("commit-push")).toHaveAccessibleDescription(on.logic ? /다음 열기 \d+에서 \d+ 논리 콤보 0, 배율 1\.00배/ : /다음 열기 \d+에서 \d+$/);
  await expect(page.getByTestId("commit-focus")).toHaveCount(count(on.lock));
  await expect(page.getByTestId("gauntlet-focus")).toHaveCount(count(on.lock));
  await expect(page.getByTestId("gauntlet-overdrive")).toHaveCount(count(on.chain));
  // The run's line counts the chain only where there is one to count.
  await expect(page.getByTestId("gauntlet-run-signal")).toHaveText(on.chain ? /^연속 \d+ BUST \d+ 최고 / : /^BUST \d+ 최고 /);
  await expect(page.locator(".gx-signals"), "no padded row over nothing").toHaveCount(count(on.lock || on.chain || on.logic));
  await expect(page.getByTestId("gauntlet-stance-mastery")).toHaveCount(count(on.stance));
  // The dock has a column for each button it holds.
  const columns = await page.locator(".gx-actions").evaluate((dock) => getComputedStyle(dock).gridTemplateColumns.split(" ").length);
  expect(columns).toBe(on.lock ? 3 : 2);
  // The key line names a key only while it is the table's, and is written
  // only where a mouse or a trackpad says there may be keys to press: a touch
  // context (mobile-chromium, webkit) gets an empty line, and the keys below
  // are taken all the same. The page is asked, not the project, because the
  // production walks run this on WebKit too.
  const hint = (await page.locator(".gx-hand-head small").textContent()) ?? "";
  const keysDrawn = await page.evaluate(() => matchMedia("(any-pointer: fine)").matches);
  expect(hint.includes("E LOCK"), `the key line reads "${hint}"`).toBe(keysDrawn && on.lock);
  expect(hint.includes("Q 자세"), `the key line reads "${hint}"`).toBe(keysDrawn && on.stance);
  if (keysDrawn) expect(hint).toContain("W 밀기");
  else expect(hint, "no key is drawn on a touch screen").toBe("");

  expect(await keyTaken(page, { key: "e", code: "KeyE" }), "E").toBe(on.lock);
  expect(await keyTaken(page, { key: "q", code: "KeyQ" }), "Q").toBe(on.stance);
  if (on.stance) await expect(page.locator(".gx-focus-modes button.mode-steady")).toHaveAttribute("aria-pressed", "true");

  // A push is a push at every step: the heat goes up and nothing judges when it landed.
  const before = await gaugeOf(page);
  await page.keyboard.press("w");
  await expect.poll(() => gaugeOf(page)).toBeGreaterThanOrEqual(before + 7);
  await expect(page.locator(".gx-grade")).toHaveCount(0);
}

for (const step of STAGED_STEPS) {
  test(`staged: ${step.caseId} introduces, draws and keys only what it has turned on`, async ({ page }) => {
    await openBriefing(page, step.caseId);
    const intro = page.getByTestId("unlock-intro");
    if (step.lines > 0) {
      const lines = UNLOCK_LADDER.find((rung) => rung.caseId === step.caseId).intro;
      expect(lines).toHaveLength(step.lines);
      await expect(intro.locator(".gx-breach-kicker")).toHaveText(step.kicker);
      await expect(intro.locator("li")).toHaveText([...lines]);
    } else {
      await expect(intro).toHaveCount(0);
    }
    await dismissProtocolBreach(page);
    await expectTableDraws(page, step.on);
  });
}

test("staged: the introduction is on a case's first briefing alone, and on that page's reading clock", { tag: "@once" }, async ({ page }) => {
  // The clock starts held, so the number it shows is the whole reading time.
  await page.addInitScript(
    ({ key, value }) => localStorage.setItem(key, value),
    { key: ACCESSIBILITY_SETTINGS_KEY, value: JSON.stringify({ holdReadingClock: true }) },
  );
  await openBriefing(page, "prologue02");
  const briefing = page.getByTestId("scene-briefing");
  await expect(page.getByTestId("unlock-intro")).toBeVisible();
  await expect(page.getByTestId("protocol-breach")).toHaveCount(0);
  await expect(page.getByTestId("reading-timer")).toContainText("멈춤");
  // Read off the page: what it prints is what its clock is sized to.
  const printed = await briefing.evaluate((root) => {
    const text = (selector) => [...root.querySelectorAll(selector)].map((element) => element.textContent).join("");
    return {
      // A lead with no speech after it is told beside the portrait (speakerLine.js).
      text: text(".gx-panel-story .gx-caption, .gx-balloon.is-lead"),
      question: text(".gx-judgment p"),
      memo: [text(".gx-panel-file li")],
      intro: text("[data-testid='unlock-intro'] li"),
      // The line from the scene before (D-7), when the page has one.
      bridge: text("[data-testid='scene-bridge']"),
    };
  });
  const withIntro = getReadingSeconds(printed, [{ text: printed.intro }, { text: printed.bridge }]);
  expect(withIntro, "the lines add reading time on this page").toBeGreaterThan(getReadingSeconds(printed));
  await expect(page.getByTestId("reading-timer").locator("b")).toHaveText(String(withIntro));

  await openBriefing(page, "prologue02", "p2_site");
  await expect(page.getByTestId("unlock-intro"), "a later scene of the case has nothing new to say").toHaveCount(0);
});

/**
 * Where the introduction sits. It was the last panel of the page until
 * 2026-10-09, then the panel straight after the speaker, so the first sentence
 * of the game was a rule and not the story (improvement notes D-6). Since
 * 2026-10-22 it is the last panel again, under the story, the case file and
 * the breach, and straight above the cards and 판 열기: read in front of the
 * button it is about, and whole above what is docked once scrolled to.
 */
const measureIntro = (page) =>
  page.evaluate(() => {
    const box = (selector) => {
      const rect = document.querySelector(selector)?.getBoundingClientRect();
      return rect ? { top: Math.round(rect.top), bottom: Math.round(rect.bottom), left: Math.round(rect.left), right: Math.round(rect.right) } : null;
    };
    const open = document.querySelector("[data-testid='open-table']");
    const openBox = open.getBoundingClientRect();
    const hit = document.elementFromPoint(openBox.left + openBox.width / 2, openBox.top + openBox.height / 2);
    const dock = box(".gx-comic-actions");
    return {
      intro: box("[data-testid='unlock-intro']"),
      question: box(".gx-judgment"),
      speaker: box(".gx-panel-speaker"),
      story: box(".gx-panel-story"),
      picture: box(".gx-panel-splash"),
      breach: box("[data-testid='protocol-breach']"),
      open: box("[data-testid='open-table']"),
      // On a short screen the footer is not a box of its own and only 판 열기 is docked.
      dockTop: dock && dock.bottom > dock.top ? dock.top : Math.round(openBox.top),
      openTakesThePointer: Boolean(hit && (hit === open || open.contains(hit))),
      panels: [...document.querySelectorAll(".gx-comic-page .gx-panel")].map((panel) => panel.dataset.testid ?? panel.className.replace("gx-panel ", "")),
      pageWidth: document.documentElement.scrollWidth,
    };
  });

/**
 * The reading clock starts held, so it does not open the table under a
 * measurement. Asked for as a setting, not by pressing the clock: the page is
 * measured as it lands, with nothing on it pressed or scrolled.
 */
const holdReadingClock = (page) =>
  page.addInitScript(
    ({ key, value }) => localStorage.setItem(key, value),
    { key: ACCESSIBILITY_SETTINGS_KEY, value: JSON.stringify({ holdReadingClock: true }) },
  );

/** A prologue's opening page at `size`, once its panels have landed. */
async function openIntroPage(page, caseId, size, { broken = false, rootFontSize = null } = {}) {
  await page.setViewportSize(size);
  await openBriefing(page, caseId);
  if (broken) {
    // As a run that broke its last board meets it. REBOOT stood here until the
    // breach panel was kept for penalties: a closed case no longer draws one.
    const save = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
    await page.goto("/profile.jpg");
    save.dynamics = { ...(save.dynamics ?? {}), schema: { ...(save.dynamics?.schema ?? {}), mutations: ["aftershock"] }, openSeed: null };
    await writeJsonStorage(page, TEST_STORAGE_KEYS.save, save);
    await page.goto("/?debug=1");
    await expect(page.getByTestId("protocol-breach")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  }
  await page.addStyleTag({ content: `.debug-overlay { display: none !important; }${rootFontSize ? ` :root { font-size: ${rootFontSize} !important; }` : ""}` });
  await expect(page.getByTestId("reading-timer")).toHaveAttribute("aria-checked", "true");
  await waitForEntrance(page.getByTestId("scene-briefing"));
}

for (const size of [{ width: 390, height: 844 }, { width: 1366, height: 768 }]) {
  test(`staged: the story comes first and the introduction sits above the cards at ${size.width}x${size.height}`, async ({ page }) => {
    test.setTimeout(240_000);
    await holdReadingClock(page);
    const phone = size.width < 700;
    for (const step of STAGED_STEPS.filter((rung) => rung.lines > 0)) {
      await openIntroPage(page, step.caseId, size, { broken: step.caseId === "prologue02" });
      const at = await measureIntro(page);
      const where = `${step.caseId} @ ${size.width}x${size.height}`;

      expect(at.question.top >= 0 && at.question.bottom <= at.dockTop, `${where}: the question is on the first screen`).toBe(true);
      expect(at.story.top, `${where}: the story follows the speaker, with no panel between`).toBeLessThan(at.dockTop);
      expect(at.intro.top, `${where}: the panel comes after the story`).toBeGreaterThanOrEqual(at.story.bottom);
      expect(at.intro.left >= 0 && at.intro.right <= size.width, `${where}: no wider than the screen`).toBe(true);
      // On a phone the header and the picture band come first; on a laptop the picture is beside the speaker.
      if (phone) expect(at.picture.bottom, `${where}: the picture is above the speaker`).toBeLessThanOrEqual(at.speaker.top);
      else expect(at.picture.top, `${where}: the picture is beside the speaker`).toBe(at.speaker.top);
      expect(at.openTakesThePointer, `${where}: 판 열기 is not covered`).toBe(true);
      expect(at.open.bottom, `${where}: 판 열기 is docked on screen`).toBeLessThanOrEqual(size.height);
      expect(at.pageWidth, `${where}: nothing is wider than the screen`).toBeLessThanOrEqual(size.width + 1);
      // Written in the order they are seen, which is the order they are read aloud.
      expect(at.panels.slice(0, 3)).toEqual(["gx-panel-splash", "gx-panel-speaker", "gx-panel-story"]);
      expect(at.panels.at(-1), `${where}: the introduction is the last panel, above the cards`).toBe("unlock-intro");
      if (step.caseId === "prologue02") {
        expect(at.breach.top, `${where}: the breach is under the story`).toBeGreaterThan(at.story.bottom - 1);
        expect(at.intro.top, `${where}: and the introduction under the breach`).toBeGreaterThanOrEqual(at.breach.bottom);
      }
      // Scrolled to, the panel is whole above whatever is docked.
      await page.getByTestId("unlock-intro").evaluate((panel) => panel.scrollIntoView({ block: "center" }));
      const scrolled = await measureIntro(page);
      expect(scrolled.intro.top >= 0 && scrolled.intro.bottom <= scrolled.dockTop, `${where}: the panel is whole above what is docked`).toBe(true);
    }
  });
}

/**
 * How the introduction is drawn. It had the breach panel's red border and
 * hatching: the first page of the game, and of every prologue after it, opened
 * on a panel that looked like the one a bust leaves. It is drawn as a rule the
 * board carries now (`gx-carry`). Two panels are compared as the browser
 * computed them -- 프롤로그 01's introduction, and the breach panel of a board
 * that carries AFTERSHOCK -- so no colour is written here.
 */
test("staged: the introduction is drawn as a carried rule, with a border that is not the breach panel's", async ({ page }) => {
  test.setTimeout(120_000);
  await holdReadingClock(page);
  const size = page.viewportSize();
  const drawn = (testId) =>
    page.getByTestId(testId).evaluate((panel) => {
      const style = getComputedStyle(panel);
      return {
        classes: [...panel.classList],
        border: [style.borderTopColor, style.borderRightColor, style.borderBottomColor, style.borderLeftColor].join(" | "),
        borderWidth: Number.parseFloat(style.borderTopWidth),
      };
    });

  await openIntroPage(page, "prologue01", size);
  await expect(page.getByTestId("protocol-breach")).toHaveCount(0);
  const first = await drawn("unlock-intro");
  expect(first.classes, "프롤로그 01's introduction is a carried-rule panel").toEqual(expect.arrayContaining(["gx-panel", "gx-carry"]));
  expect(first.borderWidth, "the panel has a border to colour").toBeGreaterThan(0);

  // 프롤로그 02's first page on a board the last decision broke: both panels on one page.
  await openIntroPage(page, "prologue02", size, { broken: true });
  const intro = await drawn("unlock-intro");
  const breach = await drawn("protocol-breach");
  expect(intro.classes).toContain("gx-carry");
  expect(breach.classes, "the breach panel is not a carried-rule panel").not.toContain("gx-carry");
  expect(breach.borderWidth).toBeGreaterThan(0);
  expect(first.border, "프롤로그 01's introduction has the breach panel's border").not.toBe(breach.border);
  expect(intro.border, "on one page, the introduction has the breach panel's border").not.toBe(breach.border);
  expect(intro.border, "every introduction is drawn alike").toBe(first.border);
});

test("staged: 판 열기 stays docked and pressable over the introduction on a small phone, a short one, a phone on its side and at a large type size", async ({ page }) => {
  test.setTimeout(420_000);
  await holdReadingClock(page);
  const SCREENS = [
    // Every phone docks 판 열기 alone since 2026-10-22 (D-3), so a 740px one
    // has the panel and the question on its first screen too.
    { name: "360x740", size: { width: 360, height: 740 }, firstScreen: true },
    // What Safari leaves of an iPhone 14 with its bars drawn. The docked cards
    // were 217 to 265px of it, the introduction showed 12 to 36px above them
    // and the story began under them. Only 판 열기 is docked there now
    // (briefing.css), so the panel and the question are on the first screen.
    { name: "390x664", size: { width: 390, height: 664 }, firstScreen: true },
    { name: "844x390", size: { width: 844, height: 390 } },
    // The reader's own type size, a quarter larger: the sheets' em breakpoints follow it.
    { name: "390x844, 20px type", size: { width: 390, height: 844 }, rootFontSize: "20px" },
  ];
  for (const screen of SCREENS) {
    for (const step of STAGED_STEPS.filter((rung) => rung.lines > 0)) {
      await openIntroPage(page, step.caseId, screen.size, { broken: step.caseId === "prologue02", rootFontSize: screen.rootFontSize });
      const where = `${step.caseId} @ ${screen.name}`;
      const at = await measureIntro(page);
      expect(at.intro, `${where}: the page carries the introduction`).not.toBeNull();
      expect(at.open.top >= 0 && at.open.bottom <= screen.size.height, `${where}: 판 열기 is on screen before any scrolling`).toBe(true);
      expect(at.openTakesThePointer, `${where}: 판 열기 is not covered`).toBe(true);
      expect(at.pageWidth, `${where}: nothing is wider than the screen`).toBeLessThanOrEqual(screen.size.width + 1);
      if (screen.firstScreen) {
        expect(at.story.top, `${where}: the story starts on the first screen, under the speaker`).toBeLessThan(at.dockTop);
        expect(at.intro.top, `${where}: the panel follows the story`).toBeGreaterThanOrEqual(at.story.bottom);
        expect(at.question.top >= 0 && at.question.bottom <= at.dockTop, `${where}: the question is whole above what is docked`).toBe(true);
        expect(at.open.bottom - at.dockTop, `${where}: what is docked is 판 열기 alone, not the cards with it`).toBeLessThanOrEqual(at.open.bottom - at.open.top + 1);
      }
      // Scrolled to the panel, it is whole above whatever is docked.
      await page.getByTestId("unlock-intro").evaluate((panel) => panel.scrollIntoView({ block: "center" }));
      const scrolled = await measureIntro(page);
      expect(scrolled.intro.top >= 0 && scrolled.intro.bottom <= scrolled.dockTop, `${where}: the panel is whole above what is docked`).toBe(true);
      expect(scrolled.openTakesThePointer, `${where}: 판 열기 is still pressable with the panel at the top`).toBe(true);
      expect(scrolled.open.bottom, `${where}: and still docked`).toBeLessThanOrEqual(screen.size.height);
    }
    // And it opens the table.
    await clickThroughMotion(page.getByTestId("open-table"), `판 열기 @ ${screen.name}`);
    await expect(page.getByTestId("scene-briefing")).toHaveCount(0);
  }
});

// The draft a case shows was offered as the case before it closed, so the
// first one a plain run meets is the offer made at the close of 프롤로그 04.
test("staged: 프롤로그 03 closes without a draft, and 프롤로그 04 closes onto the first one", async ({ page }) => {
  test.setTimeout(180_000);
  /** Plays the scene every way through the case closes on, up to its reveal. */
  const closeCase = async (caseId) => {
    await openTable(page, caseId, `p${caseId.at(-1)}_aftershock`);
    await clickElement(page.locator(".choices .choice:not([aria-disabled='true'])").first(), "stake a card");
    await page.getByTestId("commit-push").click();
    await cashStakedCard(page);
    await expect(page.getByTestId("decision-next")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
    await expect.poll(async () => (await savedRun(page)).completedCases).toContain(caseId);
  };
  const openNextCase = async (caseId) => {
    await clickElement(page.getByTestId("decision-next"), "close the reveal");
    await clickElement(page.locator(".next-case-panel button"), "next case");
    await expect.poll(async () => (await savedRun(page)).currentCase, { timeout: TRANSITION_TIMEOUT_MS }).toBe(caseId);
  };

  await closeCase("prologue03");
  await expect(page.getByTestId("relic-draft-notice")).toHaveCount(0);
  expect((await savedRun(page)).dynamics.relicOffer).toEqual([]);
  await openNextCase("prologue04");
  await expectBriefing(page);
  await expect(page.getByTestId("relic-draft")).toHaveCount(0);

  await closeCase("prologue04");
  await expect(page.getByTestId("relic-draft-notice")).toContainText("도구 3개");
  await openNextCase("prologue05");
  const draft = page.getByTestId("relic-draft");
  await expect(draft).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  await expect(draft.getByTestId("relic-option")).toHaveCount(3);
  await clickThroughMotion(draft.getByTestId("relic-option").first(), "the first relic");
  await expect(draft).toHaveCount(0);
  await expectBriefing(page);
  // The page behind the draft is the one that introduces the stances.
  await expect(page.getByTestId("unlock-intro").locator("li")).toHaveText([...UNLOCK_LADDER[4].intro]);
  await dismissProtocolBreach(page);
  await expect(page.getByTestId("gauntlet-relics").locator(".gx-relic-chip")).toHaveCount(1);
  await expectTableDraws(page, WHOLE);
});

/**
 * The same steps met the way a player meets them, with no debug jump: from
 * the intro's start button, by NEW GAME+, and by resuming a save written
 * before there were steps. These run against the production build too.
 */
const savedRun = (page) => readJsonStorage(page, TEST_STORAGE_KEYS.save);

/** The page a scene opens on, once the reveal or the report before it has gone. */
async function expectBriefing(page) {
  await expect(page.locator(".decision-reveal-backdrop")).toHaveCount(0, { timeout: TRANSITION_TIMEOUT_MS });
  await expect(page.getByTestId("scene-briefing")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
}

test("a new run meets the table in steps: 프롤로그 01 has no logic streak and breaks no board, 프롤로그 02 has both", { tag: "@prod" }, async ({ page }) => {
  test.setTimeout(300_000);
  await page.addInitScript(() => {
    // Once a tab, so a reload would find what the run has saved since.
    if (sessionStorage.getItem("e2e-seeded")) return;
    sessionStorage.setItem("e2e-seeded", "1");
    localStorage.clear();
  });
  await page.goto("/");
  await clickElement(page.getByTestId("start-first-case"), "start first case");
  await expectBriefing(page);
  expect((await savedRun(page)).currentCase).toBe("prologue01");

  // The first page says what the table is, and its start button can be pressed
  // with the panel on the page (the gate is pressed where the pointer lands).
  const intro = page.getByTestId("unlock-intro");
  await expect(intro.locator(".gx-breach-kicker")).toHaveText(FIRST_TABLE);
  await expect(intro.locator("li")).toHaveText([...UNLOCK_LADDER[0].intro]);
  await expect(page.getByTestId("protocol-breach")).toHaveCount(0);
  await dismissProtocolBreach(page);
  await expectTableDraws(page, STAGED_STEPS[0].on);

  // Push and cash are the whole table here, and they work.
  await clickElement(page.locator(".choices .choice:not([aria-disabled='true'])").first(), "stake a card");
  await cashStakedCard(page);
  await expect(page.getByTestId("decision-next")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  await expect.poll(async () => (await savedRun(page)).dynamics.cashes).toBe(1);
  let run = (await savedRun(page)).dynamics;
  expect(run.veteran, "a plain run").toBe(false);
  expect(run.runPot, "the cash banked a pot").toBeGreaterThan(0);
  expect([run.logic.streak, run.logic.type, run.streak, run.focusHits], "no streak and no type held, no chain, no LOCK").toEqual([0, null, 0, 0]);
  expect(run.schema.mutations).toEqual([]);

  // The second scene has nothing new to say. A bust there takes the pot and
  // the next scene, as the wall always does, and deals the plain board next:
  // BLACKOUT and AFTERSHOCK are 프롤로그 02's.
  await clickElement(page.getByTestId("decision-next"), "next scene");
  await expectBriefing(page);
  await expect(intro, "only the page the case opens on introduces").toHaveCount(0);
  await dismissProtocolBreach(page);
  await clickElement(page.locator(".choices .choice:not([aria-disabled='true'])").first(), "stake a card");
  const stage = stageOf(page);
  for (let press = 0; press < 20 && (await stage.getAttribute("data-status")) === "live"; press += 1) {
    await page.getByTestId("commit-push").click({ timeout: 2_000 }).catch(() => {});
  }
  await expect(stage).toHaveAttribute("data-status", "bust");
  await expect(page.getByTestId("decision-next")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  await expect.poll(async () => (await savedRun(page)).dynamics.busts).toBe(1);
  run = (await savedRun(page)).dynamics;
  expect(run.runPot, "the wall took the pot").toBe(0);
  expect(run.schema.mutations, "and broke nothing").toEqual([]);
  expect([run.schema.faceDown, run.schema.startGauge]).toEqual([false, 0]);
  await clickElement(page.getByTestId("decision-next"), "next scene");
  await expectBriefing(page);
  await expect(page.getByTestId("protocol-breach"), "no changed rules after a bust").toHaveCount(0);

  // On to the report. 프롤로그 01 closes without a draft.
  await completeCurrentCase(page);
  await expect(page.locator(".result-page")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  expect((await savedRun(page)).dynamics.relicOffer).toEqual([]);
  await clickElement(page.locator(".next-case-panel button"), "next case");
  await expect.poll(async () => (await savedRun(page)).currentCase, { timeout: TRANSITION_TIMEOUT_MS }).toBe("prologue02");
  await expect(page.getByTestId("scene-briefing")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  await expect(page.getByTestId("relic-draft")).toHaveCount(0);

  // 프롤로그 02 opens on the scene the close of 프롤로그 01 picked, not on its
  // written first scene, and introduces the logic streak and the broken board there.
  // The REBOOT a closed case leaves is not a breach, and the page draws no panel for it.
  expect((await savedRun(page)).nodeId, "a played run enters on an opening route").not.toBe(CASE_START_NODES.prologue02);
  await expect(intro.locator("li")).toHaveText([...UNLOCK_LADDER[1].intro]);
  await expect(page.getByTestId("protocol-breach")).toHaveCount(0);
  await expect(page.getByTestId("carried-rules")).toHaveCount(0);
  await expect(page.getByTestId("scene-briefing")).not.toContainText("REBOOT");
  await dismissProtocolBreach(page);
  await expectTableDraws(page, STAGED_STEPS[1].on);
});

test("a NEW GAME+ run is introduced to nothing and has the whole table on 프롤로그 01", { tag: "@prod" }, async ({ page }) => {
  await page.addInitScript(
    ({ unlockedKey, memoryKey }) => {
      if (sessionStorage.getItem("e2e-seeded")) return;
      sessionStorage.setItem("e2e-seeded", "1");
      localStorage.clear();
      localStorage.setItem(unlockedKey, "true");
      localStorage.setItem(memoryKey, JSON.stringify({ final: { outcomeChoiceId: "f_archive_seal" } }));
    },
    { unlockedKey: NEW_GAME_PLUS_KEY, memoryKey: NEW_GAME_PLUS_MEMORY_KEY },
  );
  await page.goto("/");
  await clickElement(page.getByRole("button", { name: "NEW GAME+ 시작" }), "NEW GAME+");
  await expectBriefing(page);
  await expect.poll(async () => (await savedRun(page))?.dynamics?.veteran, { timeout: TRANSITION_TIMEOUT_MS }).toBe(true);
  expect((await savedRun(page)).currentCase).toBe("prologue01");
  await expect(page.getByTestId("unlock-intro")).toHaveCount(0);
  await dismissProtocolBreach(page);
  await expectTableDraws(page, WHOLE);
});

// tests/unit/fixtures/saves/v2-pre-unlocks.json: a run left on the page that
// opens 프롤로그 03 by the last build with every rule on from 프롤로그 01,
// holding a relic, a mastered STRIKE, a chain and an unanswered draft.
test("a save from before the steps resumes with what it held and plays on under the step", { tag: "@prod" }, async ({ page }) => {
  const { save } = JSON.parse(readFileSync("tests/unit/fixtures/saves/v2-pre-unlocks.json", "utf8"));
  await seedSave(page, save);
  await page.goto("/");
  await expect(page.getByTestId("resume-save")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  await expect(page.locator(".recovery-notice"), "nothing was repaired, so nothing says 복구됨").toHaveCount(0);
  await clickElement(page.getByTestId("resume-save"), "resume saved run");
  await expect(page.locator(".game-shell")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  await expect(page.locator(".recovery-notice")).toHaveCount(0);

  // The draft it had not answered is still its to answer, though 프롤로그 03 offers none.
  const draft = page.getByTestId("relic-draft");
  await expect(draft).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  await expect(draft.getByTestId("relic-option")).toHaveCount(save.dynamics.relicOffer.length);
  await clickThroughMotion(draft.getByTestId("relic-option").first(), "the first relic");
  await expect(draft).toHaveCount(0);
  const held = [...save.dynamics.relics, save.dynamics.relicOffer[0]];
  await expect.poll(async () => (await savedRun(page)).dynamics.relics).toEqual(held);

  // The board it was dealt is the board it plays, and the page still
  // introduces the step: this is the scene 프롤로그 03 opens on.
  await expectBriefing(page);
  await expect(page.getByTestId("protocol-breach")).toHaveCount(0);
  await expect(page.getByTestId("unlock-intro").locator("li")).toHaveText([...UNLOCK_LADDER[2].intro]);
  await dismissProtocolBreach(page);
  await expect(page.getByTestId("gauntlet-relics").locator(".gx-relic-chip")).toHaveCount(held.length);
  await expect(page.getByTestId("active-mutations")).toBeVisible();
  await expectTableDraws(page, STAGED_STEPS[2].on);

  // One table, played to its verdict: the run keeps what it held, and the
  // board dealt next follows the step.
  await clickElement(page.locator(".choices .choice:not([aria-disabled='true'])").first(), "stake a card");
  await cashStakedCard(page);
  await expect(page.getByTestId("decision-next")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  await expect.poll(async () => (await savedRun(page)).dynamics.windowIndex).toBe(save.dynamics.windowIndex + 1);
  const after = await savedRun(page);
  expect(after.lastError ?? null).toBeNull();
  expect(after.dynamics.relics).toEqual(held);
  expect(after.dynamics.vault).toBe(save.dynamics.vault);
  expect(after.dynamics.stanceMastery).toEqual(save.dynamics.stanceMastery);
  expect(after.dynamics.streak, "the chain it held is not counted before OVERCLOCK").toBe(0);
  const stepRules = UNLOCK_LADDER[2].rules;
  expect(after.dynamics.schema.mutations.filter((id) => !stepRules.has(MUTATION_RULES[id])), "nothing dealt from a rule 프롤로그 03 does not have").toEqual([]);
});

// The case's last choice is held, not clicked (src/gauntlet/holdConfirm.js,
// improvement notes A4): a pointer or Enter held for 0.8s, Space held on the
// focused button, or -- for a player who cannot hold -- a second press within
// three seconds. Every other table still cashes on one press.
test.describe("the case's last choice is held", () => {
  const CLOSING = { caseId: "prologue01", nodeId: "p1_final" };

  async function stakeClosing(page) {
    await openTable(page, CLOSING.caseId, CLOSING.nodeId);
    await clickElement(page.locator(".choices .choice:not([aria-disabled='true'])").first(), "stake a card");
    const cash = page.getByTestId("commit-confirm");
    for (let press = 0; press < 8 && !(await cash.isEnabled()); press += 1) await page.getByTestId("commit-push").click();
    await expect(cash).toBeEnabled();
    await expect(cash).toHaveAttribute("data-hold", "idle");
    return cash;
  }

  test("a click arms 확정, says so, and a second press confirms", async ({ page }) => {
    const cash = await stakeClosing(page);
    await expect(cash).toContainText("꾹 눌러 확정");
    await expect(cash).toHaveAccessibleDescription(/길게 눌러 확정/);
    await cash.click();
    await expect(cash).toHaveAttribute("data-hold", "armed");
    await expect(cash).toContainText("한 번 더");
    await expect(page.getByText("한 번 더 누르면 확정된다")).toHaveCount(1);
    await expect(stageOf(page), "one click does not close the case").toHaveAttribute("data-status", "live");
    await cash.click();
    await expect(stageOf(page)).toHaveAttribute("data-status", "cashed");
  });

  test("a press held for 0.8s confirms before it is let go; one slid off confirms nothing", async ({ page }) => {
    const cash = await stakeClosing(page);
    const box = await cash.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await expect(cash).toHaveClass(/is-holding/);
    await page.mouse.move(box.x + box.width / 2, box.y - 120);
    await expect(cash).toHaveAttribute("data-hold", "idle");
    await page.mouse.up();
    await page.waitForTimeout(1_000);
    await expect(stageOf(page), "a hold that slid off is dropped").toHaveAttribute("data-status", "live");

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await expect(stageOf(page)).toHaveAttribute("data-status", "cashed", { timeout: 3_000 });
    await page.mouse.up();
  });

  test("a click with no pointer behind it, as a screen reader sends, arms and confirms the same way", async ({ page }) => {
    const cash = await stakeClosing(page);
    const tap = () => cash.evaluate((button) => button.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true })));
    await tap();
    await expect(cash).toHaveAttribute("data-hold", "armed");
    await tap();
    await expect(stageOf(page)).toHaveAttribute("data-status", "cashed");
  });

  test("Enter held confirms, a short Enter arms, and Space holds on the button the keyboard walked to", async ({ page }) => {
    // Three tables opened from the debug menu: about 30s alone, past 60s beside a second worker.
    test.setTimeout(120_000);
    let cash = await stakeClosing(page);
    // The card was staked with the pointer, so Enter is the table's.
    await page.keyboard.press("Enter");
    await expect(cash).toHaveAttribute("data-hold", "armed");
    await page.keyboard.press("Enter");
    await expect(stageOf(page)).toHaveAttribute("data-status", "cashed");

    await stakeClosing(page);
    await page.keyboard.down("Enter");
    await expect(stageOf(page)).toHaveAttribute("data-status", "cashed", { timeout: 3_000 });
    await page.keyboard.up("Enter");

    cash = await stakeClosing(page);
    await cash.focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await expect(cash).toBeFocused();
    await page.keyboard.down(" ");
    await expect(stageOf(page)).toHaveAttribute("data-status", "cashed", { timeout: 3_000 });
    await page.keyboard.up(" ");
  });

  test("reduced motion draws the line at once and still asks for the hold", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const cash = await stakeClosing(page);
    await page.keyboard.down("Enter");
    await expect(cash).toHaveClass(/is-holding/);
    expect(await cash.evaluate((button) => getComputedStyle(button, "::after").animationName)).toBe("none");
    await expect(stageOf(page)).toHaveAttribute("data-status", "cashed", { timeout: 3_000 });
    await page.keyboard.up("Enter");
  });

  test("an ordinary scene cashes on one press", async ({ page }) => {
    await openTable(page);
    await clickElement(page.locator(".choices .choice").first(), "stake a card");
    await expect(page.getByTestId("commit-confirm")).not.toHaveAttribute("data-hold");
  });
});
