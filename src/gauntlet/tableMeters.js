import { drawStep, GAUGE_MAX, getCardChips, getFocusBonus, getFocusModeProfile, getHeartbeatBpm, getMultiplier, getRemainingSeconds, getWindowBand } from "./gauntletEngine.js";
import { readAudit } from "./auditRisk.js";
import { HEAT_DEBT_GAUGE } from "./tableRules.js";
import { AUDIT_HEAT } from "./weeklyRules.js";

/**
 * 안전선까지 (improvement notes 2026-10-22, C-5): the pushes in a row that
 * cannot reach the wall whatever it is -- each one starts with the largest
 * step still under the band's low edge -- and the heat they leave. The steps
 * are the ones `PUSH` deals from the seed, so pressing them one by one lands
 * on the same window (tests/unit/table-readouts.test.mjs). No rule moves.
 */
export function readSafeLine(win, wallMin) {
  let gauge = win.gauge;
  let pushes = 0;
  while (win.status === "live" && gauge + win.schema.stepMax < wallMin) {
    pushes += 1;
    gauge += drawStep(win.schema, win.seed, win.pushes + pushes);
  }
  return { pushes, gauge };
}

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
 * `band` is the wall band the window draws: the board's, or the narrower one
 * SCOUT bought (`getWindowBand`); the danger line reads its low edge.
 *
 * `audit` is the case's audit off its log; on a week that counts it the
 * reading says where it stands and what a cash now would make it (B3:
 * the heat and the pushes, never the wall), and is null on every other table.
 */
export function readTableMeters({ win, schema, selectedCard, run = null, audit = 0 }) {
  const nextLow = Math.min(GAUGE_MAX, win.gauge + schema.stepMin);
  const nextHigh = Math.min(GAUGE_MAX, win.gauge + schema.stepMax);
  const band = getWindowBand(win);
  const reading = readAudit(run, audit, win);
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
    dangerLine: describeDanger({ gauge: win.gauge, nextHigh, wallMin: band.wallMin }),
    belowRelief: win.gauge < getFocusModeProfile(win.focusMode).relief,
    band,
    audit: reading,
    safe: readSafeLine(win, band.wallMin),
    // C-9: on a table that counts the audit, its line (40) and the band a cash
    // moves it neither way in, up to HEAT DEBT's 60.
    auditBand: reading ? [AUDIT_HEAT, HEAT_DEBT_GAUGE] : null,
  };
}
