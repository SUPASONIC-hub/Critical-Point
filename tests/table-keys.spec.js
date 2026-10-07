import { expect, test } from "./helpers/network.js";
import { nodes } from "../src/gameData.js";
import { dismissProtocolBreach, startDebugNode, TRANSITION_TIMEOUT_MS } from "./helpers/gameFlow.js";
import { openBrokenBoard } from "./helpers/layout.js";
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
const selectedLabel = (page) => page.locator(".gx-card.selected .gx-card-label");

/** A key as the keyboard sends it: the character the layout types, and the key it was typed on. */
async function sendKey(page, init) {
  await page.evaluate((options) => {
    (document.activeElement ?? document.body).dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, cancelable: true, ...options }));
  }, init);
}

/** Waits for the frame loop's GOOD window and sends the key inside it, so the press is graded a hit. */
async function sendKeyOnBeat(page, init) {
  return page.evaluate(
    (options) =>
      new Promise((resolve) => {
        const stage = document.querySelector("[data-testid='gauntlet-stage']");
        const started = performance.now();
        let seen = 0;
        let lastPhase = Number.NaN;
        const check = () => {
          const style = getComputedStyle(stage);
          const phase = Number(style.getPropertyValue("--gx-beat-phase"));
          if (phase !== lastPhase) {
            seen += 1;
            lastPhase = phase;
          }
          const ready = seen >= 2 && style.getPropertyValue("--gx-beat-live").trim() === "1" && style.getPropertyValue("--gx-beat-zone").trim() === "1";
          if (ready) {
            document.body.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, cancelable: true, ...options }));
            resolve(true);
          } else if (performance.now() - started > 8000) resolve(false);
          else requestAnimationFrame(check);
        };
        requestAnimationFrame(check);
      }),
    init,
  );
}

test("number keys stake, Space and W push, Enter cashes", async ({ page }) => {
  // A scene that deals 판을 다시 짠다, so the hand's last number is the wild card.
  await openTable(page, "case02", "c2_logs");
  const labels = await page.locator(".choices .choice .gx-card-label").allTextContents();
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

test("E locks on the beat, Q changes the stance and the charge goes with it", async ({ page }) => {
  await openTable(page);
  await page.keyboard.press("1");
  const focus = page.getByTestId("gauntlet-focus");
  await expect(focus).toContainText("STRIKE 0");

  expect(await sendKeyOnBeat(page, { key: "e", code: "KeyE" })).toBe(true);
  await expect(focus).not.toContainText("STRIKE 0");
  await expect(page.locator(".gx-focus .gx-grade")).toContainText("LOCK");

  await page.keyboard.press("q");
  await expect(page.locator(".gx-focus-modes button.mode-steady")).toHaveAttribute("aria-pressed", "true");
  await expect(focus, "a charge belongs to the stance that built it").toContainText("STEADY 0");
  await page.keyboard.press("q");
  await page.keyboard.press("q");
  await expect(page.locator(".gx-focus-modes button.mode-strike")).toHaveAttribute("aria-pressed", "true");
});

test("the letters work on a Hangul layout", async ({ page }) => {
  await openTable(page);
  await page.keyboard.press("1");
  await sendKey(page, { key: "ㅈ", code: "KeyW" });
  await expect.poll(() => gaugeOf(page), "ㅈ is the W key").toBeGreaterThanOrEqual(7);
  await sendKey(page, { key: "ㅂ", code: "KeyQ" });
  await expect(page.locator(".gx-focus-modes button.mode-steady")).toHaveAttribute("aria-pressed", "true");
});

test("a key held with Ctrl, Cmd or Alt is the browser's, and a repeat is not a press", async ({ page }) => {
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

test("keys do not reach the table under the reveal", async ({ page }) => {
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

test("a locked card refuses its number key as it refuses a click", async ({ page }) => {
  expect(lockedIndex, "the scene still deals a gated card").toBeGreaterThan(0);
  await openTable(page, GATED.caseId, GATED.nodeId);
  const locked = page.locator(".choices .choice").nth(lockedIndex);
  await expect(locked).toHaveAttribute("aria-disabled", "true");
  await expect(locked).toContainText("LOCKED");

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

// A save written while the key could still stake a locked card holds that card
// as the open bet. The runtime refuses it, so the window used to stay closed and
// unsettled through every reload.
test("a save that holds a locked card as its bet still settles", async ({ page }) => {
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

test("an untouched window that runs out cannot be replayed by reloading under the slam", async ({ page }) => {
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
  const labels = await page.locator(".choices .choice .gx-card-label").allTextContents();

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
  await expect(page.getByTestId("reading-timer")).toHaveAttribute("aria-pressed", "true");
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
