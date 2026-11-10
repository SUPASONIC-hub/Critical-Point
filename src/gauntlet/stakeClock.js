import { stakeLayerCount } from "./stakeLayers.js";
import { STAKE_CLOCK_CUT, STAKE_CLOCK_FLOOR, WINDOW_SECONDS } from "./tableRules.js";

/**
 * The stake clock (개선 포인트 B5, 2026-11-05): the decision window's clock
 * shortens with the stake, in the open. The stake is the gauge the table
 * shows, read in the three tiers the score plays it in (`STAKE_LAYER_GAUGES`,
 * stakeLayers.js): below the second layer the window has its board's whole
 * clock (45 seconds on a plain board), from the second layer (45, a pot worth
 * losing) it has `STAKE_CLOCK_CUT` fewer (40), and from the third (65, a pot
 * inside the band) twice that fewer (35). The HUD prints the clock that
 * stands, so a push that lifts the stake visibly takes seconds off it, and a
 * STEADY press that cools the heat below a tier gives them back.
 *
 * Pure, and read on every tick (gauntletEngine.js's `advanceClock`), by the
 * HUD (`getRemainingSeconds`), by the window replay the ranking checker runs
 * (windowReplay.js, through the same reducer) and by the bots
 * (scripts/sim/season-bot.mjs, through the same `createWindow`). A board from
 * before this clock -- a run saved or a window recorded on an older build --
 * has no `stakeClock` on it and keeps its flat clock (`normalizeSchema`), so
 * an old run replays as it was played.
 */

export { stakeLayerCount } from "./stakeLayers.js";

/** The stake's tier as the clock reads it: 0 under the second layer, 1 from it, 2 from the third. */
export function stakeTier(gauge) {
  return Math.max(0, stakeLayerCount(gauge) - 1);
}

/**
 * The clock a window has at this stake, in seconds: the board's `seconds`,
 * less `STAKE_CLOCK_CUT` a tier on a board that has the stake clock
 * (`stakeClock`, true on every board dealt since 2026-11-05), never under
 * `STAKE_CLOCK_FLOOR`. Called with the stake alone it reads a plain board.
 */
export function decisionWindowSeconds(gauge, board = {}) {
  const seconds = board.seconds === null || board.seconds === undefined ? WINDOW_SECONDS : Number(board.seconds);
  if (board.stakeClock === false) return seconds;
  return Math.max(STAKE_CLOCK_FLOOR, seconds - STAKE_CLOCK_CUT * stakeTier(gauge));
}
