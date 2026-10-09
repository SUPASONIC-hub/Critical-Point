import { readFileSync } from "node:fs";
import { expect, test } from "./helpers/network.js";
import { ACCESSIBILITY_SETTINGS_KEY, NEW_GAME_PLUS_KEY, NEW_GAME_PLUS_MEMORY_KEY } from "../src/appConfig.js";
import { CASE_START_NODES } from "../src/gameCases.js";
import { nodes } from "../src/gameData.js";
import { getReadingSeconds } from "../src/gauntlet/gauntletEngine.js";
import { MUTATION_RULES, UNLOCK_LADDER } from "../src/gauntlet/tableUnlocks.js";
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
import { openBrokenBoard } from "./helpers/layout.js";
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

/**
 * The staged table (src/gauntlet/tableUnlocks.js): the five prologues turn the
 * rules on in steps, and a rule that is not on yet is not drawn and its key is
 * not the table's. Each step is opened by the debug jump, on a plain run. What
 * each step holds is written out here rather than read from the module the
 * stage reads.
 */
const WHOLE = { beat: true, lock: true, stance: true, chain: true };
const NO_LOCK = { beat: true, lock: false, stance: false, chain: false };
/** The line over an introduction. 프롤로그 01 has its own: nothing was added to the first table. */
const FIRST_TABLE = "FIRST TABLE · 이 판은 이렇게 합니다";
const NEW_PROTOCOL = "NEW PROTOCOL · 이번 사건부터 규칙이 늘어납니다";
const STAGED_STEPS = [
  { caseId: "prologue01", on: { beat: false, lock: false, stance: false, chain: false }, lines: 1, kicker: FIRST_TABLE },
  { caseId: "prologue02", on: NO_LOCK, lines: 2, kicker: NEW_PROTOCOL },
  { caseId: "prologue03", on: NO_LOCK, lines: 2, kicker: NEW_PROTOCOL },
  { caseId: "prologue04", on: { beat: true, lock: true, stance: false, chain: true }, lines: 3, kicker: NEW_PROTOCOL },
  { caseId: "prologue05", on: WHOLE, lines: 1, kicker: NEW_PROTOCOL },
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
  await expect(page.locator(".gx-beat-ring")).toHaveCount(count(on.beat));
  await expect(page.getByTestId("commit-focus")).toHaveCount(count(on.lock));
  await expect(page.getByTestId("gauntlet-focus")).toHaveCount(count(on.lock));
  await expect(page.getByTestId("gauntlet-overdrive")).toHaveCount(count(on.chain));
  // The run's line counts the chain only where there is one to count.
  await expect(page.getByTestId("gauntlet-run-signal")).toHaveText(on.chain ? /^연승 \d+ BUST \d+ 최고 / : /^BUST \d+ 최고 /);
  await expect(page.locator(".gx-signals"), "no padded row over nothing").toHaveCount(count(on.lock || on.chain));
  await expect(page.getByTestId("gauntlet-stance-mastery")).toHaveCount(count(on.stance));
  // The dock has a column for each button it holds.
  const columns = await page.locator(".gx-actions").evaluate((dock) => getComputedStyle(dock).gridTemplateColumns.split(" ").length);
  expect(columns).toBe(on.lock ? 3 : 2);
  // The key line names a key only while it is the table's (hidden on a phone, written either way).
  const hint = (await page.locator(".gx-hand-head small").textContent()) ?? "";
  expect(hint.includes("E 락"), `the key line reads "${hint}"`).toBe(on.lock);
  expect(hint.includes("Q 자세"), `the key line reads "${hint}"`).toBe(on.stance);
  expect(hint).toContain("W 밀기");

  expect(await keyTaken(page, { key: "e", code: "KeyE" }), "E").toBe(on.lock);
  expect(await keyTaken(page, { key: "q", code: "KeyQ" }), "Q").toBe(on.stance);
  if (on.stance) await expect(page.locator(".gx-focus-modes button.mode-steady")).toHaveAttribute("aria-pressed", "true");

  // Three seconds in, the heart has been heard more than once: a push now is
  // graded against it where the beat is on, and comes back ungraded where it
  // is not -- no grade on the button, no combo in the pot.
  await expect.poll(async () => Number(await page.locator(".gx-clock b").textContent()), { timeout: 20_000 }).toBeLessThanOrEqual(42);
  const before = await gaugeOf(page);
  await page.keyboard.press("w");
  await expect.poll(() => gaugeOf(page)).toBeGreaterThanOrEqual(before + 7);
  if (on.beat) {
    await expect(stageOf(page)).toHaveAttribute("data-last-grade", /^(perfect|good|miss)$/);
    await expect(page.locator(".gx-push .gx-grade")).toHaveCount(1);
  } else {
    await expect(stageOf(page)).toHaveAttribute("data-last-grade", "");
    await expect(stageOf(page)).toHaveAttribute("data-combo", "0");
    await expect(page.locator(".gx-push .gx-grade")).toHaveCount(0);
    await expect(page.getByTestId("gauntlet-combo")).toHaveCount(0);
  }
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

test("staged: the introduction is on a case's first briefing alone, and on that page's reading clock", async ({ page }) => {
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
      text: text(".gx-panel-story .gx-caption"),
      question: text(".gx-balloon"),
      memo: [text(".gx-panel-file li")],
      intro: text("[data-testid='unlock-intro'] li"),
    };
  });
  const withIntro = getReadingSeconds(printed, [{ text: printed.intro }]);
  expect(withIntro, "the lines add reading time on this page").toBeGreaterThan(getReadingSeconds(printed));
  await expect(page.getByTestId("reading-timer").locator("b")).toHaveText(String(withIntro));

  await openBriefing(page, "prologue02", "p2_site");
  await expect(page.getByTestId("unlock-intro"), "a later scene of the case has nothing new to say").toHaveCount(0);
});

/**
 * Where the introduction sits. It was the last panel of the page, under the
 * story and the case file -- 500 to 700px below the first screen of a phone --
 * so a player who pressed 판 열기 without scrolling never saw it. It is now the
 * panel straight after the speaker: on the first screen with the question, on
 * a phone and on a laptop, with the breach panel left at the end of the page.
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
      question: box(".gx-balloon"),
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
async function openIntroPage(page, caseId, size, { reboot = false, rootFontSize = null } = {}) {
  await page.setViewportSize(size);
  await openBriefing(page, caseId);
  if (reboot) {
    // As a played run meets it: the case before closed, and left its REBOOT.
    const save = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
    await page.goto("/profile.jpg");
    save.dynamics = { ...(save.dynamics ?? {}), schema: { ...(save.dynamics?.schema ?? {}), mutations: ["reboot"] }, openSeed: null };
    await writeJsonStorage(page, TEST_STORAGE_KEYS.save, save);
    await page.goto("/?debug=1");
    await expect(page.getByTestId("protocol-breach")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  }
  await page.addStyleTag({ content: `.debug-overlay { display: none !important; }${rootFontSize ? ` :root { font-size: ${rootFontSize} !important; }` : ""}` });
  await expect(page.getByTestId("reading-timer")).toHaveAttribute("aria-pressed", "true");
  await waitForEntrance(page.getByTestId("scene-briefing"));
}

for (const size of [{ width: 390, height: 844 }, { width: 1366, height: 768 }]) {
  test(`staged: the introduction is on the first screen with the question at ${size.width}x${size.height}`, async ({ page }) => {
    test.setTimeout(240_000);
    await holdReadingClock(page);
    const phone = size.width < 700;
    for (const step of STAGED_STEPS.filter((rung) => rung.lines > 0)) {
      await openIntroPage(page, step.caseId, size, { reboot: step.caseId === "prologue02" });
      const at = await measureIntro(page);
      const where = `${step.caseId} @ ${size.width}x${size.height}`;

      expect(at.intro.top, `${where}: the panel starts under the speaker`).toBeGreaterThanOrEqual(at.speaker.bottom);
      expect(at.intro.bottom, `${where}: and ends above the docked footer`).toBeLessThanOrEqual(at.dockTop);
      expect(at.intro.bottom, `${where}: inside the screen`).toBeLessThanOrEqual(size.height);
      expect(at.intro.left >= 0 && at.intro.right <= size.width, `${where}: no wider than the screen`).toBe(true);
      expect(at.question.top >= 0 && at.question.bottom <= at.dockTop, `${where}: the question is on the first screen too`).toBe(true);
      expect(at.story.top, `${where}: the story follows the panel`).toBeGreaterThanOrEqual(at.intro.bottom);
      // On a phone the header and the picture band come first; on a laptop the picture is beside the speaker.
      if (phone) expect(at.picture.bottom, `${where}: the picture is above the speaker`).toBeLessThanOrEqual(at.speaker.top);
      else expect(at.picture.top, `${where}: the picture is beside the speaker`).toBe(at.speaker.top);
      expect(at.openTakesThePointer, `${where}: 판 열기 is not covered`).toBe(true);
      expect(at.open.bottom, `${where}: 판 열기 is docked on screen`).toBeLessThanOrEqual(size.height);
      expect(at.pageWidth, `${where}: nothing is wider than the screen`).toBeLessThanOrEqual(size.width + 1);
      // Written in the order they are seen, which is the order they are read aloud.
      expect(at.panels.slice(0, 4)).toEqual(["gx-panel-splash", "gx-panel-speaker", "unlock-intro", "gx-panel-story"]);
      if (step.caseId === "prologue02") {
        expect(at.panels.at(-1), `${where}: the breach panel is still the last one`).toBe("protocol-breach");
        expect(at.breach.top, `${where}: under everything else`).toBeGreaterThan(at.story.bottom - 1);
      }
    }
  });
}

test("staged: 판 열기 stays docked and pressable over the introduction on a small phone, a phone on its side and at a large type size", async ({ page }) => {
  test.setTimeout(300_000);
  await holdReadingClock(page);
  const SCREENS = [
    { name: "360x740", size: { width: 360, height: 740 } },
    { name: "844x390", size: { width: 844, height: 390 } },
    // The reader's own type size, a quarter larger: the sheets' em breakpoints follow it.
    { name: "390x844, 20px type", size: { width: 390, height: 844 }, rootFontSize: "20px" },
  ];
  for (const screen of SCREENS) {
    for (const step of STAGED_STEPS.filter((rung) => rung.lines > 0)) {
      await openIntroPage(page, step.caseId, screen.size, { reboot: step.caseId === "prologue02", rootFontSize: screen.rootFontSize });
      const where = `${step.caseId} @ ${screen.name}`;
      const at = await measureIntro(page);
      expect(at.intro, `${where}: the page carries the introduction`).not.toBeNull();
      expect(at.open.top >= 0 && at.open.bottom <= screen.size.height, `${where}: 판 열기 is on screen before any scrolling`).toBe(true);
      expect(at.openTakesThePointer, `${where}: 판 열기 is not covered`).toBe(true);
      expect(at.pageWidth, `${where}: nothing is wider than the screen`).toBeLessThanOrEqual(screen.size.width + 1);
      // Scrolled to the panel, it is whole above whatever is docked.
      await page.getByTestId("unlock-intro").evaluate((panel) => panel.scrollIntoView({ block: "start" }));
      const scrolled = await measureIntro(page);
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

test("a new run meets the table in steps: 프롤로그 01 has no beat and breaks no board, 프롤로그 02 has both", { tag: "@prod" }, async ({ page }) => {
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
  expect([run.beatCombo, run.streak, run.focusHits], "no combo, no chain, no LOCK").toEqual([0, 0, 0]);
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
  // written first scene, and introduces the beat and the broken board there --
  // beside the REBOOT panel every closed case leaves.
  expect((await savedRun(page)).nodeId, "a played run enters on an opening route").not.toBe(CASE_START_NODES.prologue02);
  await expect(intro.locator("li")).toHaveText([...UNLOCK_LADDER[1].intro]);
  await expect(page.getByTestId("protocol-breach")).toContainText("REBOOT");
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
  await expect(page.getByTestId("protocol-breach")).toContainText("REBOOT");
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
