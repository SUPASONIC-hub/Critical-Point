import { expect, test } from "./helpers/network.js";
import { ACCESSIBILITY_SETTINGS_KEY, PLAYER_NAME_MAX_LENGTH } from "../src/appConfig.js";
import { seasonCasesBase } from "../src/gameCases.js";
import { completeCurrentCase, dismissProtocolBreach, startDebugNode } from "./helpers/gameFlow.js";
import { TEST_STORAGE_KEYS } from "./helpers/storage.js";

/**
 * The comfort settings (maintenance priority 87): set on the intro, stored on
 * the device, and read where they apply. The logic is unit-tested
 * (tests/unit/accessibility.test.mjs); this is the part only a page shows --
 * the drawer, the attributes on <html> before the first paint, and the table
 * and the briefing page answering to them.
 */

/** Stores settings before any script of the page runs, on every navigation. */
async function withSettings(page, settings) {
  await page.addInitScript(
    ({ key, value }) => localStorage.setItem(key, value),
    { key: ACCESSIBILITY_SETTINGS_KEY, value: JSON.stringify(settings) },
  );
}

test("the intro's drawer stores a setting and the page answers before its first paint", async ({ page }) => {
  await page.goto("/");
  await page.locator(".intro-drawer > summary", { hasText: "편의 설정" }).click();
  const panel = page.getByRole("region", { name: "편의 설정" });
  await panel.getByRole("radio", { name: "2배", exact: true }).check();
  await panel.getByLabel(/첫 화면 움직임 멈추기/).check();
  await panel.getByLabel(/번쩍임·흔들림 줄이기/).check();

  const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), ACCESSIBILITY_SETTINGS_KEY);
  expect(stored).toMatchObject({ tableTime: 2, stillIntro: true, calmEffects: true, letterKeys: true });
  await expect(page.locator("html")).toHaveAttribute("data-still-intro", "");
  await expect(page.locator("html")).toHaveAttribute("data-calm-effects", "");

  await page.reload();
  // Set by main.jsx before React renders, so the intro never starts moving.
  await expect(page.locator("html")).toHaveAttribute("data-still-intro", "");
  const ticker = page.locator(".intro-ticker-track");
  await expect(ticker).toHaveCSS("animation-name", "none");

  await page.locator(".intro-drawer > summary", { hasText: "편의 설정" }).click();
  await expect(page.getByRole("region", { name: "편의 설정" }).getByRole("radio", { name: "2배", exact: true })).toBeChecked();
});

test("with single-key shortcuts off, a number stakes nothing and the save button names no key", async ({ page }) => {
  await withSettings(page, { letterKeys: false });
  await startDebugNode(page, "case01", "start");
  await page.addStyleTag({ content: ".debug-overlay { display: none !important; }" });
  await page.locator("body").click({ position: { x: 2, y: 2 } });

  await page.keyboard.press("1");
  await page.keyboard.press("KeyW");
  await expect(page.locator(".gx-card.selected")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "저장", exact: true })).not.toHaveAttribute("aria-keyshortcuts");

  // The pointer still does everything the keys did.
  await page.locator(".choices .choice").first().click();
  await expect(page.locator(".gx-card.selected")).toHaveCount(1);
});

/**
 * Turning the keys off used to change one button. Everything else went on
 * naming them: the digit on each card, the R and N chips on the report, the
 * hint line over the hand, and `aria-keyshortcuts` on eleven controls.
 */
test("with single-key shortcuts off, no control names or draws a key that does nothing", async ({ page, hasTouch }) => {
  await withSettings(page, { letterKeys: false });
  await page.setViewportSize({ width: 1366, height: 768 });
  await startDebugNode(page, "case01", "start", { openTable: false });

  const briefing = page.getByTestId("scene-briefing");
  await expect(briefing).toBeVisible();
  await expect(briefing.locator("kbd")).toHaveCount(0);
  await expect(briefing.getByTestId("briefing-card").first()).not.toHaveAttribute("aria-keyshortcuts");
  // Space and Enter are not single-character keys, and stay named.
  await expect(page.getByTestId("open-table")).toHaveAttribute("aria-keyshortcuts", "Space Enter");
  await page.getByTestId("open-table").click();

  await page.addStyleTag({ content: ".debug-overlay { display: none !important; }" });
  await expect(page.locator(".gx-card-key")).toHaveCount(0);
  await expect(page.locator(".choices .choice").first()).not.toHaveAttribute("aria-keyshortcuts");
  await expect(page.getByTestId("commit-push")).toHaveAttribute("aria-keyshortcuts", "Space");
  await expect(page.getByTestId("commit-focus")).not.toHaveAttribute("aria-keyshortcuts");
  // Space and Enter are drawn where there may be a keyboard; a touch screen
  // (mobile-chromium) is drawn no key at all, whatever the setting.
  await expect(page.locator(".gx-hand-head small")).toHaveText(hasTouch ? "" : "Space 밀기 · Enter 확정");
});

test("with single-key shortcuts off, the report does not offer R or N", async ({ page }) => {
  await withSettings(page, { letterKeys: false });
  await startDebugNode(page, "case01", "c1_aftershock");
  await completeCurrentCase(page);
  const decisionNext = page.getByTestId("decision-next");
  if (await decisionNext.isVisible()) await decisionNext.click();
  await expect(page.locator(".result-page")).toBeVisible();
  await expect(page.locator(".result-page .shortcut-hint")).toHaveCount(0);
  await expect(page.locator(".replay-case-button")).not.toHaveAttribute("aria-keyshortcuts");
  await expect(page.locator(".next-case-panel button")).not.toHaveAttribute("aria-keyshortcuts");
});

test("with the shortcuts on, the same controls name their keys", async ({ page, hasTouch }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await startDebugNode(page, "case01", "start");
  // Named to a screen reader on every device; drawn only where there is a
  // mouse or a trackpad (see "a key is drawn only where..." below).
  if (hasTouch) await expect(page.locator(".gx-card-key")).toHaveCount(0);
  else await expect(page.locator(".gx-card-key").first()).toHaveText("1");
  await expect(page.locator(".choices .choice").first()).toHaveAttribute("aria-keyshortcuts", "1");
  await expect(page.getByTestId("commit-push")).toHaveAttribute("aria-keyshortcuts", "Space W");
  await expect(page.getByTestId("commit-focus")).toHaveAttribute("aria-keyshortcuts", "E");
  if (hasTouch) await expect(page.locator(".gx-hand-head small")).toHaveText("");
  else await expect(page.locator(".gx-hand-head small")).toContainText("W 밀기");
});

/**
 * The setting was all a hint asked about, so a phone drew a digit on every
 * card of the table, the briefing page and the relic draft, and R and N on the
 * report's buttons: keys it does not have. A hint is drawn where a mouse or a
 * trackpad says a keyboard may be there (`any-pointer: fine`, asked once, in
 * `useShortcutHints`). What a screen reader is told and what a key does are
 * the same on both: both contexts run on both projects.
 */
for (const { name, touch, viewport } of [
  { name: "a touch screen with no mouse", touch: true, viewport: { width: 390, height: 844 } },
  { name: "a screen with a mouse", touch: false, viewport: { width: 1366, height: 768 } },
]) {
  test.describe(name, () => {
    test.use({ hasTouch: touch, isMobile: touch });

    test(`a key is drawn only where there may be one to press: the briefing page and the table on ${name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await startDebugNode(page, "case01", "start", { openTable: false });
      await page.addStyleTag({ content: ".debug-overlay { display: none !important; }" });
      expect(await page.evaluate(() => matchMedia("(any-pointer: fine)").matches), "the context is what the test says it is").toBe(!touch);

      const briefing = page.getByTestId("scene-briefing");
      await expect(briefing).toBeVisible();
      const cards = briefing.getByTestId("briefing-card");
      if (touch) {
        await expect(briefing.locator("kbd")).toHaveCount(0);
        await expect(briefing.locator(".gx-comic-hint")).toHaveText("카드를 고르면 그 카드를 건 채로 판이 열린다");
      } else {
        await expect(cards.first().locator("kbd")).toHaveText("1");
        await expect(briefing.locator(".gx-comic-hint kbd")).toHaveCount(2);
      }
      await expect(cards.first()).toHaveAttribute("aria-keyshortcuts", "1");
      await expect(page.getByTestId("open-table")).toHaveAttribute("aria-keyshortcuts", "Space Enter W");

      // The key is taken whether or not it was drawn: a keyboard paired with a
      // phone is not something the page can see.
      await page.keyboard.press("2");
      await expect(briefing).toHaveCount(0);
      await expect(page.locator(".gx-card.selected")).toHaveCount(1);

      const hand = page.locator(".choices .choice");
      if (touch) {
        await expect(page.locator(".gx-card-key")).toHaveCount(0);
        await expect(page.locator(".gx-hand-head kbd")).toHaveCount(0);
      } else {
        await expect(page.locator(".gx-card-key")).toHaveCount(await hand.count());
        await expect(page.locator(".gx-card-key").first()).toHaveText("1");
        await expect(page.locator(".gx-hand-head small")).toContainText("W 밀기");
      }
      await expect(hand.first()).toHaveAttribute("aria-keyshortcuts", "1");
      await expect(page.getByTestId("commit-push")).toHaveAttribute("aria-keyshortcuts", "Space W");
    });

    test(`a key is drawn only where there may be one to press: the report and the relic draft on ${name}`, async ({ page }) => {
      test.setTimeout(120_000);
      await page.setViewportSize(viewport);
      await startDebugNode(page, "case01", "c1_aftershock");
      await page.addStyleTag({ content: ".debug-overlay { display: none !important; }" });
      await closeCaseToReport(page);

      const replay = page.locator(".replay-case-button");
      const next = page.locator(".next-case-panel button");
      if (touch) {
        await expect(page.locator(".result-page .shortcut-hint")).toHaveCount(0);
      } else {
        await expect(replay.locator(".shortcut-hint")).toHaveText("R");
        await expect(next.locator(".shortcut-hint")).toHaveText("N");
      }
      await expect(replay).toHaveAttribute("aria-keyshortcuts", "R");
      await expect(next).toHaveAttribute("aria-keyshortcuts", "N");

      // N opens the next case on both, and case 01 closes onto the first draft.
      await page.keyboard.press("KeyN");
      const draft = page.getByTestId("relic-draft");
      await expect(draft).toBeVisible({ timeout: 30_000 });
      const options = draft.getByTestId("relic-option");
      if (touch) {
        await expect(draft.locator(".gx-relic-key")).toHaveCount(0);
      } else {
        await expect(draft.locator(".gx-relic-key")).toHaveCount(await options.count());
        await expect(draft.locator(".gx-relic-key").first()).toHaveText("1");
      }
      await expect(options.first()).toHaveAttribute("aria-keyshortcuts", "1");
    });
  });
}

test("the reading clock can start held, and waits", async ({ page }) => {
  await page.clock.install();
  await withSettings(page, { holdReadingClock: true });
  await startDebugNode(page, "case01", "start", { openTable: false });
  const timer = page.getByTestId("reading-timer");
  await expect(timer).toContainText("멈춤");
  const before = await timer.textContent();
  // The page's own clock, moved by hand and past this page's reading time
  // (52 seconds): two and a half seconds of the wall clock proved a held
  // clock no better than a slow one.
  await page.clock.runFor(60_000);
  await expect(timer).toHaveText(before ?? "");
  await expect(page.getByTestId("scene-briefing")).toBeVisible();
});

/** The seconds the table's clock shows, and how many it loses over ten seconds of the page's time. */
async function clockLossOverTenSeconds(page) {
  const clock = page.locator(".gx-clock b");
  await expect(page.getByTestId("gauntlet-stage")).toHaveAttribute("data-status", "live");
  const before = Number(await clock.textContent());
  await page.clock.runFor(10_000);
  return before - Number(await clock.textContent());
}

// The setting was only ever read back out of storage. What it is for is the
// table: forty-five seconds that take ninety.
test("at 2배 the table's clock runs at half speed", async ({ page }) => {
  await page.clock.install();
  await startDebugNode(page, "case01", "start");
  const plain = await clockLossOverTenSeconds(page);
  expect(plain, "an unassisted clock loses a second a second").toBeGreaterThanOrEqual(9);

  await withSettings(page, { tableTime: 2 });
  await startDebugNode(page, "case01", "start");
  const assisted = await clockLossOverTenSeconds(page);
  expect(assisted, "ten seconds cost about five").toBeGreaterThanOrEqual(4);
  expect(assisted).toBeLessThanOrEqual(6);
});

/**
 * The panel opened from the intro alone: a player who found the clock too
 * fast in the middle of a case had to save, leave the table, change it and
 * come back. The play header opens it in a dialog (ComfortDialog.jsx). The
 * table's clock is held for as long as the dialog is up, a key pressed in it
 * is not the table's, and 테이블 시간 is read on every tick, so the window
 * already on the table runs at the new speed.
 */
test("the play header opens the comfort settings over a held clock, and 2배 reaches the table already open", async ({ page }) => {
  await page.clock.install();
  await startDebugNode(page, "case01", "start");
  await page.addStyleTag({ content: ".debug-overlay { display: none !important; }" });
  const stage = page.getByTestId("gauntlet-stage");
  const clock = page.locator(".gx-clock b");
  await expect(stage).toHaveAttribute("data-status", "live");

  const opener = page.getByRole("button", { name: "편의 설정", exact: true });
  await opener.click();
  const dialog = page.getByRole("dialog", { name: "편의 설정" });
  await expect(dialog).toBeVisible();
  await expect(page.getByTestId("comfort-dialog-close")).toBeFocused();

  // A minute of the page's time, and a card key: the table has neither.
  const held = await clock.textContent();
  await page.clock.runFor(60_000);
  await page.keyboard.press("1");
  await expect(clock).toHaveText(held ?? "");
  await expect(stage).toHaveAttribute("data-status", "live");
  await expect(page.locator(".gx-card.selected")).toHaveCount(0);

  await dialog.getByRole("radio", { name: "2배", exact: true }).check();
  expect((await storedSettings(page)).tableTime).toBe(2);

  // Escape closes it and hands focus back to the button that opened it.
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(opener).toBeFocused();

  const assisted = await clockLossOverTenSeconds(page);
  expect(assisted, "ten seconds cost about five on the window that was already open").toBeGreaterThanOrEqual(4);
  expect(assisted).toBeLessThanOrEqual(6);
});

/**
 * The heartbeat for a player who cannot hear it. The pulse and the red edge
 * are what the comfort setting turns down (and, until the beat went, the ring
 * a press was timed against), so with the sound off and
 * 번쩍임·흔들림 줄이기 on there was no instrument left at all. Two things stay
 * whatever is turned down: the number beside the gauge, and the gauge's ticks,
 * lit by how fast the pulse is.
 */
const HEART_READOUTS = [
  { name: "by default", settings: null, muted: false, reducedMotion: false },
  { name: "with 번쩍임·흔들림 줄이기 on", settings: { calmEffects: true }, muted: false, reducedMotion: false },
  { name: "with the sound off", settings: null, muted: true, reducedMotion: false },
  { name: "with the sound off, 번쩍임·흔들림 줄이기 on and reduced motion", settings: { calmEffects: true }, muted: true, reducedMotion: true },
];

/** The pulse as the table prints it, and the light the frame loop gives the ticks. */
function readHeart(page) {
  return page.evaluate(() => {
    const readout = document.querySelector("[data-testid='gauntlet-bpm']");
    const ticks = document.querySelector(".gx-gauge-ticks");
    const style = ticks ? getComputedStyle(ticks) : null;
    return {
      text: readout?.textContent ?? "",
      bpm: Number(readout?.querySelector("b")?.textContent ?? Number.NaN),
      rate: style ? Number(style.getPropertyValue("--gx-rate")) : Number.NaN,
      light: style ? Number(style.opacity) : Number.NaN,
    };
  });
}

for (const { name, settings, muted, reducedMotion } of HEART_READOUTS) {
  test(`the heartbeat is a number and a tick light beside the gauge ${name}`, async ({ page }) => {
    if (settings) await withSettings(page, settings);
    if (muted) await page.addInitScript((key) => localStorage.setItem(key, "false"), TEST_STORAGE_KEYS.musicEnabled);
    if (reducedMotion) await page.emulateMedia({ reducedMotion: "reduce" });
    await startDebugNode(page, "case01", "start");
    await page.addStyleTag({ content: ".debug-overlay { display: none !important; }" });
    const stage = page.getByTestId("gauntlet-stage");
    await expect(stage).toHaveAttribute("data-status", "live");
    if (settings?.calmEffects) await expect(page.locator("html")).toHaveAttribute("data-calm-effects", "");
    else await expect(page.locator("html")).not.toHaveAttribute("data-calm-effects", "");
    if (muted) await expect(page.getByRole("button", { name: "배경음 켜기", exact: true })).toBeVisible();

    // The number: on screen, named, and a pulse a heart can have.
    const readout = page.getByTestId("gauntlet-bpm");
    await expect(readout).toBeVisible();
    await expect(readout).toHaveText(/^심박\s*\d{2,3}$/);
    const ticks = page.locator(".gx-gauge-ticks");
    await expect(ticks).toHaveCount(1);
    // The frame loop has written the light once it reads as a number.
    await expect.poll(async () => (await readHeart(page)).rate, { message: "the frame loop writes the tick light" }).toBeGreaterThanOrEqual(0);
    const resting = await readHeart(page);
    expect(resting.bpm).toBeGreaterThanOrEqual(60);
    expect(resting.bpm).toBeLessThanOrEqual(190);

    // Three pushes heat the gauge without reaching the lowest wall (45 against
    // 56), and a hot gauge always races: the number rises and the ticks light.
    const gauge = page.getByTestId("gauntlet-gauge");
    for (let press = 0; press < 3; press += 1) {
      const before = Number(await gauge.textContent());
      await page.getByTestId("commit-push").click();
      await expect.poll(async () => Number(await gauge.textContent()), { message: `push ${press + 1} heated the gauge` }).toBeGreaterThan(before);
    }
    await expect(stage).toHaveAttribute("data-status", "live");
    await expect.poll(async () => (await readHeart(page)).bpm, { message: "the number follows the heat" }).toBeGreaterThan(60);
    await expect.poll(async () => (await readHeart(page)).rate, { message: "the tick light follows the number" }).toBeGreaterThan(0);
    await expect.poll(async () => (await readHeart(page)).light, { message: "and is drawn" }).toBeGreaterThan(0);
    const heated = await readHeart(page);
    expect(heated.bpm).toBeGreaterThanOrEqual(resting.bpm);
    expect(heated.rate).toBeLessThanOrEqual(1);
    expect(heated.light, "a faint light, not a lamp").toBeLessThanOrEqual(0.5);
    await expect(ticks).toHaveCSS("animation-name", "none");
    await expect(readout).toBeVisible();

    if (settings?.calmEffects) {
      // What the setting did turn down: the heart beside the number no longer pulses.
      const beat = await page.locator(".gx-bpm svg").evaluate((icon) => Number(getComputedStyle(icon).getPropertyValue("--gx-beat")));
      expect(beat).toBe(0);
    }
  });
}

test("the heartbeat number is read out by name, and is not announced as it changes", async ({ page }) => {
  await startDebugNode(page, "case01", "start");
  const readout = page.getByTestId("gauntlet-bpm");
  await expect(readout).toBeVisible();
  const facts = await readout.evaluate((element) => ({
    // A meter's children are not read out; the number sits beside it.
    insideMeter: Boolean(element.closest("[role='meter']")),
    hidden: Boolean(element.closest("[aria-hidden='true']")),
    // An ancestor that announces changes would read the pulse on every beat.
    announced: Boolean(element.closest("[aria-live]:not([aria-live='off']), [role='status'], [role='alert'], [role='timer'], [role='log'], output")),
    iconHidden: element.querySelector("svg")?.getAttribute("aria-hidden"),
  }));
  expect(facts).toEqual({ insideMeter: false, hidden: false, announced: false, iconHidden: "true" });
  // The gauge is still a meter with its own name and value.
  const meter = page.getByRole("meter", { name: "열기 게이지" });
  await expect(meter).toHaveAttribute("aria-valuenow", /^\d+$/);
  await expect(meter).toHaveAttribute("aria-valuetext", /^열기 \d+, 벽은 \d+에서 \d+ 사이 어딘가$/);
  await expect(meter.locator(".gx-gauge-ticks")).toHaveAttribute("aria-hidden", "true");
});

// The row under the gauge is one line on every phone the table promises to
// fit, upright and on its side, at the fastest pulse there is, with the
// clock's heat rate a push puts in it.
test("the heartbeat number fits beside the gauge on a small phone and a phone on its side", { tag: "@layout" }, async ({ page }) => {
  for (const [width, height] of [[360, 740], [390, 844], [740, 360], [844, 390]]) {
    await page.setViewportSize({ width, height });
    await startDebugNode(page, "case05", "c5_voice");
    await page.addStyleTag({ content: ".debug-overlay { display: none !important; }" });
    const readout = page.getByTestId("gauntlet-bpm");
    await expect(readout).toBeVisible();
    await page.keyboard.press("1");
    await page.keyboard.press("w");
    await expect(page.getByTestId("gauntlet-clock-heat"), "one push puts the clock's rate in the row").toBeAttached();
    const row = await page.evaluate(() => {
      const read = document.querySelector(".gx-gauge-read");
      // The widest the row can be: a full gauge, three figures of pulse and a clock ten pushes in.
      read.querySelector("[data-testid='gauntlet-gauge']").textContent = "100";
      read.querySelector("[data-testid='gauntlet-bpm'] b").textContent = "190";
      read.querySelector("[data-testid='gauntlet-clock-heat'] b").textContent = "×2.20";
      const box = (element) => element.getBoundingClientRect();
      const bpm = read.querySelector("[data-testid='gauntlet-bpm']");
      // What stands before the pulse: the clock's rate.
      const band = bpm.previousElementSibling;
      return {
        overflow: read.scrollWidth - read.clientWidth,
        // One line is every part on one middle: the band is SCOUT's 24px pill
        // from 프롤로그 03 on, so the row is no longer one font size tall.
        lines: [...read.children]
          .map((part) => (box(part).top + box(part).bottom) / 2)
          .sort((a, b) => a - b)
          .filter((middle, index, middles) => index === 0 || middle - middles[index - 1] > 4).length,
        gap: Math.round(box(bpm).left - box(band).right),
        right: Math.round(box(bpm).right),
        innerWidth,
      };
    });
    expect(row.overflow, `${width}x${height}: the row is not wider than the gauge`).toBeLessThanOrEqual(0);
    expect(row.lines, `${width}x${height}: the row is one line`).toBe(1);
    expect(row.gap, `${width}x${height}: the number does not touch the clock's rate`).toBeGreaterThanOrEqual(8);
    expect(row.right, `${width}x${height}: the number is on the screen`).toBeLessThanOrEqual(row.innerWidth);
  }
});

/* ------------------------------------------------------------- story mode */

/**
 * 스토리 모드 (ROADMAP, day 3): the comfort setting that moves the wall away
 * so the story can be read. The engine is unit-tested
 * (tests/unit/story-mode.test.mjs); these are the two controls that turn it
 * on, and the table, the report and the next case answering to it.
 */

const WALL_BAND = ".gx-band-label";
// The band label is SCOUT's button from 프롤로그 03 on, its text followed by " · 조회" (or " · 조회함").
const FAR_WALL = /^벽 88–98(?: · |$)/;
const LONGEST_CASE_LABEL = seasonCasesBase.map((caseItem) => caseItem.label).sort((a, b) => b.length - a.length)[0];

const storedSettings = (page) => page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "null"), ACCESSIBILITY_SETTINGS_KEY);
const savedRun = (page) => page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "null"), TEST_STORAGE_KEYS.save);

/** The comfort drawer and the play-style drawer, opened the way a player opens them. */
async function openStoryControls(page) {
  for (const title of ["어떤 방식으로 판단할까요?", "편의 설정"]) {
    const drawer = page.locator("details.intro-drawer", { has: page.locator("summary", { hasText: title }) });
    if (!(await drawer.evaluate((element) => element.open))) await drawer.locator("summary").click();
  }
  const styles = page.getByRole("region", { name: "플레이 스타일 선택" });
  return {
    toggle: page.getByRole("region", { name: "편의 설정" }).getByLabel(/스토리 모드/),
    styles,
    pledge: (label) => styles.getByRole("button", { name: new RegExp(label) }),
  };
}

// Story mode is chosen in one place, the comfort panel. The play-style drawer
// holds a pick-one pledge and says where the switch is; a fourth card there
// read as two of four picked.
test("story mode is the comfort panel's first switch, kept across a reload, and no pledge moves with it", async ({ page }) => {
  await page.goto("/");
  let { toggle, styles, pledge } = await openStoryControls(page);
  await expect(toggle).not.toBeChecked();
  await expect(page.getByRole("region", { name: "편의 설정" }).getByRole("checkbox").first()).toHaveAccessibleName(/^스토리 모드/);
  await expect(page.locator(".accessibility-toggle").first().locator("small")).toHaveText(
    "벽이 멀어지고, 벽에 닿은 판이 다음 판으로 넘어오지 않습니다. 벽에 닿아도 장면을 건너뛰지 않습니다. 시계는 2배 느립니다. 다음 사건부터 적용되고, 공개 랭킹에는 오르지 않습니다.",
  );
  // The drawer of pledges: three cards, and a sentence that points to the switch.
  await expect(styles.getByRole("button")).toHaveCount(3);
  await expect(styles.getByRole("button", { name: /스토리 모드/ })).toHaveCount(0);
  await expect(page.locator(".play-style-panel .panel-title-row small")).toHaveText("고른 방식은 내 다짐으로 기록됩니다. 판의 규칙을 바꾸는 스토리 모드는 편의 설정에 있습니다.");

  // A pledge is chosen first, so there is one to keep.
  await pledge("감사형").click();
  await expect(pledge("감사형")).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".play-style-note")).toHaveText("현재 선택: 감사형 · 근거를 끝까지 확인한다");

  await toggle.check();
  expect((await storedSettings(page)).storyMode).toBe(true);
  // Three pledges, one of them chosen, whatever the switch says.
  for (const [label, pressed] of [["감각형", "false"], ["감사형", "true"], ["중재형", "false"]]) {
    await expect(pledge(label)).toHaveAttribute("aria-pressed", pressed);
  }
  await expect(page.locator(".play-style-note")).toHaveText("현재 선택: 감사형 · 근거를 끝까지 확인한다");
  expect((await savedRun(page)).playStyle).toBe("auditor");
  // Off and on again; and choosing another pledge leaves the switch where it was.
  await toggle.uncheck();
  expect((await storedSettings(page)).storyMode).toBe(false);
  await toggle.check();
  await pledge("중재형").click();
  await expect(pledge("중재형")).toHaveAttribute("aria-pressed", "true");
  await expect(toggle).toBeChecked();
  expect(await storedSettings(page)).toMatchObject({ storyMode: true, tableTime: 1, calmEffects: false });

  await page.reload();
  ({ toggle, pledge } = await openStoryControls(page));
  await expect(toggle).toBeChecked();
  await expect(pledge("중재형")).toHaveAttribute("aria-pressed", "true");
});

test("the story switch is reached and flipped from the keyboard", async ({ page }) => {
  await page.goto("/");
  const { toggle } = await openStoryControls(page);
  // It is the next stop after the table-time choice: the first switch.
  await page.getByRole("region", { name: "편의 설정" }).getByRole("radio", { checked: true }).focus();
  await page.keyboard.press("Tab");
  await expect(toggle).toBeFocused();
  await page.keyboard.press("Space");
  await expect(toggle).toBeChecked();
  expect((await storedSettings(page)).storyMode).toBe(true);
  await page.keyboard.press("Space");
  await expect(toggle).not.toBeChecked();
  expect((await storedSettings(page)).storyMode).toBe(false);
});

test("a case opened in story mode stands its wall at 88 to 98 and runs its clock at half speed", async ({ page }) => {
  await page.clock.install();
  // Table time is left at 1배: the half speed is the mode's own.
  await withSettings(page, { storyMode: true, tableTime: 1 });
  await startDebugNode(page, "case01", "start");
  const stage = page.getByTestId("gauntlet-stage");
  await expect(stage).toHaveAttribute("data-status", "live");
  await expect(page.locator(WALL_BAND)).toHaveText(FAR_WALL);
  await expect(page.getByRole("meter", { name: "열기 게이지" })).toHaveAttribute("aria-valuetext", /^열기 \d+, 벽은 88에서 98 사이 어딘가$/);
  expect((await savedRun(page)).dynamics.story, "the case is stamped, whatever the setting says later").toBe(true);

  const slowed = await clockLossOverTenSeconds(page);
  expect(slowed, "ten seconds cost about five").toBeGreaterThanOrEqual(4);
  expect(slowed).toBeLessThanOrEqual(6);
});

test("a table opened without story mode keeps the wall it was dealt", async ({ page }) => {
  await startDebugNode(page, "case01", "start");
  await expect(page.getByTestId("gauntlet-stage")).toHaveAttribute("data-status", "live");
  await expect(page.locator(WALL_BAND)).toHaveText(/^벽 \d+–\d+(?: · |$)/);
  await expect(page.locator(WALL_BAND)).not.toHaveText(FAR_WALL);
  expect((await savedRun(page)).dynamics.story).toBe(false);
});

/** Plays the scene on the table to its end and stops on the case's report. */
async function closeCaseToReport(page) {
  await completeCurrentCase(page);
  const decisionNext = page.getByTestId("decision-next");
  if (await decisionNext.isVisible()) await decisionNext.click();
  await expect(page.locator(".result-page")).toBeVisible({ timeout: 30_000 });
}

test("the report of a story case says so on its first line, and the line fits a phone", async ({ page }) => {
  test.setTimeout(120_000);
  await withSettings(page, { storyMode: true });
  await startDebugNode(page, "case01", "c1_aftershock");
  await expect(page.locator(WALL_BAND)).toHaveText(FAR_WALL);
  await closeCaseToReport(page);
  const eyebrow = page.locator(".result-hero-copy > p");
  await expect(eyebrow).toHaveText(/^사건 01 · .+의 생각 활성 프로필 · 스토리 모드 · 공개 랭킹 제외$/);
  // The rank badge is as it is at the table: the tier and the score.
  await expect(page.locator(".rank-mark small")).toHaveText(/^.+ · \d+ POINTS$/);
  await expect(page.locator(".result-page").getByText("스토리 모드")).toHaveCount(1);
  const saved = await savedRun(page);
  expect(saved.caseResults.case01.assistStory).toBe(true);
  expect(saved.caseResults.case01.assistTime, "a story case's clock is recorded with it").toBe(2);

  // The longest the line can be: the longest case label there is and a name
  // of the full twenty-four characters, on two phones and a desktop.
  const longest = `${LONGEST_CASE_LABEL} · ${"가".repeat(PLAYER_NAME_MAX_LENGTH)} 분석관의 생각 활성 프로필 · 스토리 모드 · 공개 랭킹 제외`;
  for (const [width, height] of [[360, 740], [390, 844], [1366, 768]]) {
    await page.setViewportSize({ width, height });
    const fit = await eyebrow.evaluate((line, text) => {
      line.textContent = text;
      const box = line.getBoundingClientRect();
      const hero = line.closest(".result-hero").getBoundingClientRect();
      return {
        clipped: line.scrollWidth - line.clientWidth,
        left: Math.round(box.left - hero.left),
        right: Math.round(hero.right - box.right),
        pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    }, longest);
    expect(fit.clipped, `${width}x${height}: none of the line is cut off`).toBeLessThanOrEqual(0);
    expect(fit.left, `${width}x${height}: the line is inside the header`).toBeGreaterThanOrEqual(0);
    expect(fit.right, `${width}x${height}: the line is inside the header`).toBeGreaterThanOrEqual(0);
    expect(fit.pageOverflow, `${width}x${height}: the page is no wider for it`).toBeLessThanOrEqual(1);
  }
});

// The setting is the device's; the case is the run's. Turned on with a case
// under way it changes nothing on the table -- the case finishes on the wall
// it was dealt and its report carries no mark -- and the next case opens far.
test("story mode turned on in the middle of a case starts with the next case", async ({ page }) => {
  test.setTimeout(150_000);
  await startDebugNode(page, "case01", "c1_aftershock");
  await page.addStyleTag({ content: ".debug-overlay { display: none !important; }" });
  const band = page.locator(WALL_BAND);
  await expect(page.getByTestId("gauntlet-stage")).toHaveAttribute("data-status", "live");
  const dealt = await band.textContent();
  expect(dealt).not.toMatch(FAR_WALL);

  // The intro's copy of the switch, by way of 저장 후 나가기 (the play header
  // opens the same panel; the rule it sets is the same from either).
  await page.getByRole("button", { name: "저장 후 나가기" }).click();
  await expect(page.locator(".intro")).toBeVisible();
  const { toggle } = await openStoryControls(page);
  await toggle.check();
  expect((await storedSettings(page)).storyMode).toBe(true);
  expect((await savedRun(page)).dynamics.story, "the case under way is not restamped").toBe(false);

  await page.getByTestId("resume-save").click();
  await expect(page.locator(".game-shell")).toBeVisible({ timeout: 30_000 });
  await dismissProtocolBreach(page);
  await expect(page.getByTestId("gauntlet-stage")).toHaveAttribute("data-status", "live");
  await expect(band).toHaveText(dealt ?? "");
  expect((await savedRun(page)).dynamics.story).toBe(false);

  await closeCaseToReport(page);
  await expect(page.locator(".result-hero-copy > p")).toHaveText(/의 생각 활성 프로필$/);
  await expect(page.locator(".result-page")).not.toContainText("스토리 모드");
  expect("assistStory" in (await savedRun(page)).caseResults.case01).toBe(false);

  // The next case is opened with the setting on, and is a story case throughout.
  await page.locator(".next-case-panel button").click();
  await expect(page.locator(".game-shell")).toBeVisible({ timeout: 30_000 });
  await dismissProtocolBreach(page);
  await expect(page.getByTestId("gauntlet-stage")).toHaveAttribute("data-status", "live");
  await expect(band).toHaveText(FAR_WALL);
  const next = await savedRun(page);
  expect(next.currentCase).toBe("case02");
  expect(next.dynamics.story).toBe(true);
});
