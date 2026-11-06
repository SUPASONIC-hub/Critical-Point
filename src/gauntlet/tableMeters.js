import { GAUGE_MAX, getCardChips, getFocusBonus, getFocusModeProfile, getHeartbeatBpm, getMultiplier, getRemainingSeconds, getWindowBand, getWindowSeconds } from "./gauntletEngine.js";
import { AUDIT_HEAT, readAudit } from "./auditRisk.js";
import { HEAT_DEBT_GAUGE, SCOUT_TRUST } from "./tableRules.js";
import { readSafeLine } from "./tableAfterword.js";
import { fill } from "../locale.js";
import tableCopy from "../copy/table.js";

/**
 * The 현재 위험 cell's line, and the voice's after the heat (`describePush`).
 * It reads only what the meter draws -- the heat, the next push's reach and
 * the band's low edge -- never the wall inside the band. Once the heat is in
 * the band it says so (the tab counts to the band, tableTabTitle.js); it used to
 * keep saying the next push could reach a band the heat was already in.
 * Each line fits the cell on a 360px phone without the ellipsis.
 *
 * `readDangerZone` is which of the three the line stands in -- the cell's
 * only threshold -- and `dangerZoneOf` reads it back off a line the stage
 * already hands over, for the voice, which says the clock's creep once it
 * has crossed a step and never the number it moves on every tick
 * (tableVoice.js). The line and the words are read off the same table, so
 * another language laid over them is read back the same.
 */
export function readDangerZone({ gauge, nextHigh, wallMin }) {
  if (gauge >= wallMin) return "inBand";
  if (nextHigh >= wallMin) return "inReach";
  return "distance";
}

export function dangerZoneOf(line) {
  if (!line) return "";
  if (line === tableCopy.danger.inBand) return "inBand";
  return line === tableCopy.danger.inReach ? "inReach" : "distance";
}

export function describeDanger({ gauge, nextHigh, wallMin }) {
  const zone = readDangerZone({ gauge, nextHigh, wallMin });
  if (zone !== "distance") return tableCopy.danger[zone];
  return fill(tableCopy.danger.distance, { distance: Math.max(0, Math.ceil(wallMin - nextHigh)) });
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
 * `resources` is the run's (the stage's `resources`): `canPayScout` is whether
 * they hold the look's price, read on the table so a hand with no 믿음 left
 * is not sold a look it cannot pay for.
 *
 * `audit` is the case's audit off its log, or null in a case whose rules do
 * not count it (useRunReadout asks); the reading says where it stands and
 * what a cash now would make it (B3: the heat and the pushes, never the
 * wall), and is null on every other table.
 */
export function readTableMeters({ win, schema, selectedCard, run = null, audit, resources = null }) {
  const nextLow = Math.min(GAUGE_MAX, win.gauge + schema.stepMin);
  const nextHigh = Math.min(GAUGE_MAX, win.gauge + schema.stepMax);
  const band = getWindowBand(win);
  const reading = readAudit(run, audit, win);
  return {
    selectedChips: selectedCard ? getCardChips(selectedCard, schema) : 0,
    multiplier: getMultiplier(win.gauge),
    focusBonus: getFocusBonus(win.focus, win.focusMode),
    remaining: getRemainingSeconds(win),
    // A bust stops the heart (A2): the pulse reads "—" and the tick light is dark (fxVariables.js).
    // The urgency is read against the clock the stake leaves (`getWindowSeconds`), the one `remaining` counts down.
    bpm: win.status === "bust" ? "—" : getHeartbeatBpm(win.gauge, win.wall + (win.tellOffset ?? 0), schema.sedated, win.elapsed / getWindowSeconds(win)),
    nextLow,
    nextHigh,
    nextMultiplierLow: getMultiplier(nextLow),
    nextMultiplierHigh: getMultiplier(nextHigh),
    dangerLine: describeDanger({ gauge: win.gauge, nextHigh, wallMin: band.wallMin }),
    belowRelief: win.gauge < getFocusModeProfile(win.focusMode).relief,
    band,
    // B1: whether the run can pay for the look (SCOUT_TRUST of 믿음); the stage opens SCOUT on it, as the bots do.
    canPayScout: (Number(resources?.trust) || 0) >= SCOUT_TRUST,
    audit: reading,
    safe: readSafeLine(win, band.wallMin),
    // C-9: on a table that counts the audit, its line (40) and the band a cash
    // moves it neither way in, up to HEAT DEBT's 60.
    auditBand: reading ? [AUDIT_HEAT, HEAT_DEBT_GAUGE] : null,
  };
}
