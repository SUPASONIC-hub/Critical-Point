/**
 * The stake's layers, as the gauge the table shows (0-100). The pot doubles
 * every 11 points (`getMultiplier`), so these are x4.8, x17 and x60: a pot
 * worth looking at, a pot worth losing, and a pot inside the band. The wall
 * never moves them -- only what is drawn does -- so the score tells the ear
 * nothing the eye has not been told.
 *
 * The score (components/musicScore.js) brings one voice in at each, and since
 * 2026-11-05 the clock reads the same three (stakeClock.js): what the ear
 * hears quicken, the eye sees shorten. A leaf of its own, and the smallest
 * one: the score is in the entry chunk and the table's numbers (tableRules.js)
 * are not, so this is all the entry carries of them.
 */
export const STAKE_LAYER_GAUGES = [25, 45, 65];

/** How many of the stake's layers are in at this gauge: 0 to 3. */
export function stakeLayerCount(gauge) {
  const value = Number(gauge) || 0;
  return STAKE_LAYER_GAUGES.filter((threshold) => value >= threshold).length;
}
