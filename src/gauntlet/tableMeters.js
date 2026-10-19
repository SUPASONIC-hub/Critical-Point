import { GAUGE_MAX, getCardChips, getFocusBonus, getHeartbeatBpm, getMultiplier, getRemainingSeconds } from "./gauntletEngine.js";

/**
 * The numbers the table's HUD prints for this window, read off the window and
 * its board: the staked card's chips, the multiplier now and at both ends of
 * the next push's range, LOCK's charge, the clock and the heartbeat. Pure, and
 * read on every render while the clock runs, as GauntletStage read them inline
 * until 2026-10-16.
 *
 * The heartbeat hears the window's tell wall -- the real wall plus its seeded
 * error -- never the wall itself (`getHeartbeatBpm`). The clock reads the
 * window's own board (`win.schema`), as `getRemainingSeconds` always has.
 */
export function readTableMeters({ win, schema, selectedCard }) {
  const nextLow = Math.min(GAUGE_MAX, win.gauge + schema.stepMin);
  const nextHigh = Math.min(GAUGE_MAX, win.gauge + schema.stepMax);
  return {
    selectedChips: selectedCard ? getCardChips(selectedCard, schema) : 0,
    multiplier: getMultiplier(win.gauge),
    focusBonus: getFocusBonus(win.focus, win.focusMode),
    remaining: getRemainingSeconds(win),
    bpm: getHeartbeatBpm(win.gauge, win.wall + (win.tellOffset ?? 0), schema.sedated, win.elapsed / schema.seconds),
    nextLow,
    nextHigh,
    nextMultiplierLow: getMultiplier(nextLow),
    nextMultiplierHigh: getMultiplier(nextHigh),
  };
}
