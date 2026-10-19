import { GAUGE_MAX, getCardChips, getFocusBonus, getFocusModeProfile, getHeartbeatBpm, getMultiplier, getRemainingSeconds } from "./gauntletEngine.js";

/**
 * The 현재 위험 cell's line, and the voice's after the heat (`describePush`).
 * It reads only what the meter draws -- the heat, the next push's reach and
 * the band's low edge -- never the wall inside the band. Once the heat is in
 * the band it says so, as the tab does (`열기 67 · 벽 구간 안`); it used to
 * keep saying the next push could reach a band the heat was already in.
 * Each line fits the cell on a 360px phone without the ellipsis.
 */
export function describeDanger({ gauge, nextHigh, wallMin }) {
  if (gauge >= wallMin) return "벽 구간 안";
  if (nextHigh >= wallMin) return "밀면 벽 사정권";
  return `벽까지 최소 ${Math.max(0, Math.ceil(wallMin - nextHigh))}`;
}

/**
 * The numbers the table's HUD prints for this window, read off the window and
 * its board: the staked card's chips, the multiplier now and at both ends of
 * the next push's range, LOCK's charge, the clock, the heartbeat and the
 * 현재 위험 line. Pure, and
 * read on every render while the clock runs, as GauntletStage read them inline
 * until 2026-10-16.
 *
 * The heartbeat hears the window's tell wall -- the real wall plus its seeded
 * error -- never the wall itself (`getHeartbeatBpm`). The clock reads the
 * window's own board (`win.schema`), as `getRemainingSeconds` always has.
 * `belowRelief` is whether one press of the stance would cool less than its
 * relief: STEADY's relief comes off the heat there is (`FOCUS` clamps at 0).
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
    dangerLine: describeDanger({ gauge: win.gauge, nextHigh, wallMin: schema.wallMin }),
    belowRelief: win.gauge < getFocusModeProfile(win.focusMode).relief,
  };
}
