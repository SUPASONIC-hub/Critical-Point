import { ACTION_TIMEOUT_MS, clickElement, dismissProtocolBreach, startDebugNode } from "./gameFlow.js";
import { readJsonStorage, TEST_STORAGE_KEYS, writeJsonStorage } from "./storage.js";

/**
 * The screens the table promises to fit one decision on: a common phone, a
 * small Android phone and a laptop. The Playwright projects add their own
 * desktop and Pixel 7 sizes on top of these.
 */
export const LAYOUT_VIEWPORTS = Object.freeze({
  phone: { width: 390, height: 844 },
  "small phone": { width: 360, height: 740 },
  laptop: { width: 1366, height: 768 },
});

/** Where the hand ends against the top of the fixed action bar, and whether anything is wider than the screen. */
export async function measureTable(page) {
  return page.evaluate(() => {
    const cards = [...document.querySelectorAll(".choices .choice")];
    // No hand is not a hand that fits: Math.max() of nothing is -Infinity, which
    // sits above any action bar, so an empty table used to pass every row.
    if (!cards.length) throw new Error("the table has no cards to measure");
    if (!document.querySelector(".gx-actions")) throw new Error("the table has no action bar to measure against");
    const bottom = Math.max(...cards.map((card) => card.getBoundingClientRect().bottom));
    return {
      cards: cards.length,
      lastCard: Math.round(bottom),
      actionsTop: Math.round(document.querySelector(".gx-actions").getBoundingClientRect().top),
      // What is drawn inside an <svg> is clipped to the svg's own box, so a
      // shape that runs past it is not on the screen: the svg is measured, not
      // its shapes. The scene plates of nine cases draw past their frame, and
      // the sweep had been reporting every scene of those cases as too wide.
      // The page's own scroll width is read as well, which is what a player
      // would meet as a sideways scroll.
      widest: Math.round(
        Math.max(
          document.documentElement.scrollWidth,
          ...[...document.querySelectorAll(".game-shell *")].filter((element) => !element.ownerSVGElement).map((element) => element.getBoundingClientRect().right),
        ),
      ),
      innerWidth,
    };
  });
}

/**
 * The same measurement with a card staked: once for each card of the hand that
 * opens a detail line when it is chosen. The wild card opens none, and a locked
 * card cannot be chosen, so both are passed over.
 *
 * The staked card grows by its detail line and takes its row with it, so which
 * card pushes the hand furthest down is a matter of which was already the
 * taller of its row: in 사건 01's first scene that is the first card, not the
 * last. Every card is staked in turn on the one visit, and the caller reads
 * the worst.
 *
 * A staked card is still on its way when the click returns: the detail mounts
 * on the next render, and the card lifts 3px over a transition while the one
 * staked before it settles back. A box read then is a different number on each
 * run. The wait is for the detail to be in the page, for the hand's
 * transitions to end, and for one frame after that.
 *
 * The table is held still for it. The frame loop shakes `.gx-table` on every
 * heartbeat, harder the nearer the wall, and the wall is drawn anew on each
 * visit: on a board that drew a near one the cards never came to rest, a click
 * waited out its timeout for a card to stop moving (the finale, in two of its
 * three runs on 2026-10-09), and a box read mid-shake is up to a few pixels off. The
 * shake is a transform, so stilling it moves nothing in the layout.
 */
export async function measureStakedTable(page) {
  await page.addStyleTag({ content: ".gx-table { transform: none !important; }" });
  const cards = page.locator(".choices .choice:not(.gx-card-wild):not([aria-disabled='true'])");
  const count = await cards.count();
  const rows = [];
  for (let index = 0; index < count; index += 1) {
    const card = cards.nth(index);
    await clickElement(card, `stake card ${index + 1}`);
    await card.locator(".gx-card-preview").waitFor({ timeout: ACTION_TIMEOUT_MS });
    await page.locator(".gx-hand").evaluate(async (hand) => {
      const ending = hand.getAnimations({ subtree: true }).filter((animation) => Number.isFinite(animation.effect?.getComputedTiming().endTime));
      await Promise.all(ending.map((animation) => animation.finished.catch(() => {})));
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    });
    rows.push({ staked: index + 1, ...(await measureTable(page)) });
  }
  return rows;
}

/**
 * Opens a scene on a board the player has broken, with the rules and relics
 * given. The save is written from a static page on the same origin: leaving the
 * table persists its live state on the way out, which would overwrite a save
 * written while it was still open. The briefing page is closed so the table
 * is read, not the page.
 */
export async function openBrokenBoard(page, caseId, nodeId, { schema = {}, relics = [], runPot = 0, streak = 0 } = {}) {
  await startDebugNode(page, caseId, nodeId);
  const save = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  await page.goto("/profile.jpg");
  save.dynamics = { ...(save.dynamics ?? {}), schema: { ...(save.dynamics?.schema ?? {}), ...schema }, relics, relicOffer: [], runPot, streak, openSeed: null };
  await writeJsonStorage(page, TEST_STORAGE_KEYS.save, save);
  await page.goto("/");
  await page.locator(".choices .choice").first().waitFor();
  await dismissProtocolBreach(page);
}

/** The heaviest board a card can be read on: every per-card rule chip at once. */
export const OVERCLOCKED_BOARD = Object.freeze({
  mutations: ["heatDebt", "overclock", "fracture"],
  fracturedAxis: "trust",
  chipsScale: 2,
  stepMin: 11,
  stepMax: 21,
  startGauge: 20,
  seconds: 33,
});

export const SEALED_BOARD = Object.freeze({
  mutations: ["coldFeet", "fracture"],
  fracturedAxis: "trust",
  sealHighest: true,
  chipsScale: 0.6,
});

export const FIVE_RELICS = Object.freeze(["metronome", "coldBlood", "heatSink", "insurance", "stethoscope"]);
