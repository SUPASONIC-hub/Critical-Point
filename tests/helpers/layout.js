import { startDebugNode } from "./gameFlow.js";
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
    const bottom = Math.max(...cards.map((card) => card.getBoundingClientRect().bottom));
    return {
      cards: cards.length,
      lastCard: Math.round(bottom),
      actionsTop: Math.round(document.querySelector(".gx-actions").getBoundingClientRect().top),
      widest: Math.round(Math.max(...[...document.querySelectorAll(".game-shell *")].map((element) => element.getBoundingClientRect().right))),
      innerWidth,
    };
  });
}

/**
 * Opens a scene on a board the player has broken, with the rules and relics
 * given. The save is written from a static page on the same origin: leaving the
 * table persists its live state on the way out, which would overwrite a save
 * written while it was still open. The breach banner is dismissed so the table
 * is read, not the banner.
 */
export async function openBrokenBoard(page, caseId, nodeId, { schema = {}, relics = [], runPot = 0, streak = 0 } = {}) {
  await startDebugNode(page, caseId, nodeId);
  const save = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  await page.goto("/profile.jpg");
  save.dynamics = { ...(save.dynamics ?? {}), schema: { ...(save.dynamics?.schema ?? {}), ...schema }, relics, relicOffer: [], runPot, streak, openSeed: null };
  await writeJsonStorage(page, TEST_STORAGE_KEYS.save, save);
  await page.goto("/");
  await page.locator(".choices .choice").first().waitFor();
  await page.evaluate(() => document.querySelector("[data-testid='protocol-breach']")?.click());
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
