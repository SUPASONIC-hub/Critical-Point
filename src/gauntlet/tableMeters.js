import { canBreathe, getCaseTwist, getLockPressSeconds, getPaidChips, LOCK_CAP } from "./gauntletEngine.js";
import { isMarkSevenOn, isNextOn, narrowTrustAt, scoutTrustAt, STRIKE_HOT_CAP, STRIKE_HOT_GAUGE } from "./nextTableRules.js";
import { getTableRules } from "./tableUnlocks.js";
import { decisionWindowSeconds, GAUGE_MAX, getFocusBonus, getFocusModeProfile, getHeartbeatBpm, getMultiplier, getRemainingSeconds, getWindowBand, getWindowSeconds } from "./gauntletEngine.js";
import { AUDIT_HEAT, readAudit } from "./auditRisk.js";
import { HEAT_DEBT_GAUGE, SCOUT_NARROW_TRUST, SCOUT_TRUST } from "./tableRules.js";
import { readSafeLine } from "./tableAfterword.js";
import { getStoryTilt } from "./storyTilt.js";
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
 * B5's next step (2026-11-18): the seconds the stake clock (stakeClock.js)
 * takes if the next push lands at the top of its range, said before the push
 * in the push's description and the folded briefing -- the clock is never
 * faster than it reads, and now not later than it was told either. "" when no
 * push can cross a tier, or on a board from before the stake clock.
 */
export function describeNextClock(win, nextHigh) {
  if (win.schema?.stakeClock !== true) return "";
  const cut = decisionWindowSeconds(win.gauge, win.schema) - decisionWindowSeconds(nextHigh, win.schema);
  return cut > 0 ? fill(tableCopy.stage.nextClock, { cut }) : "";
}

/**
 * B5 seen (N43 step 3, decided 「전부 1」 11-18): the seconds the stake clock just
 * took, as the mark beside the HUD's clock shows them for `CLOCK_CUT_MS`.
 * `before` and `after` are the window's whole clock at two renders
 * (tableVoice.js `readWindowSeconds`, the same reading the voice's stake-clock
 * line is made from), so a push that crosses a tier and the clock's creep
 * that crosses one are shown alike -- the creep's cut had no word on screen
 * (N43 measurement: about 6% of a season's windows). "" when the clock did
 * not shorten, gave seconds back, or either reading is not a stake clock's.
 * Only what the clock itself already shows; the rules are not touched.
 */
export function describeClockCut(before, after) {
  if (typeof before !== "number" || typeof after !== "number") return "";
  const cut = before - after;
  return cut > 0 ? fill(tableCopy.stage.clockCut, { cut }) : "";
}

/** How long the clock's cut mark stays beside the clock (N43 step 3: 0.8 seconds). */
export const CLOCK_CUT_MS = 800;

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
export function readTableMeters({ win, schema, selectedCard, run = null, audit, resources = null, caseId = null, narrowCount = 0, scoutCount = 0 }) {
  // G1~G7 (nextTableRules.js): whether the case plays the next rules, and what they change on this table.
  const next = isNextOn(getTableRules(caseId, run));
  const narrowPrice = next ? narrowTrustAt(narrowCount) : SCOUT_NARROW_TRUST;
  // G13 (RULES_MARK 7): the first look's price climbs with the case's first looks (`scoutTrustAt`).
  const scoutPrice = isMarkSevenOn(getTableRules(caseId, run)) ? scoutTrustAt(scoutCount) : SCOUT_TRUST;
  const lockShut = next && schema.lockShut === true;
  const nextLow = Math.min(GAUGE_MAX, win.gauge + schema.stepMin);
  const nextHigh = Math.min(GAUGE_MAX, win.gauge + schema.stepMax);
  const band = getWindowBand(win);
  // G31 (RULES_MARK 9): the case's 정당성 moves the audit's limit (storyTilt.js).
  const reading = readAudit(run, audit, win, getStoryTilt(run, getTableRules(caseId, run))?.audit ?? 0);
  return {
    // G5 2막: the chips a cash at this heat pays (getPaidChips), which the case's twist may thin at 60 and over.
    selectedChips: selectedCard ? getPaidChips(selectedCard, schema, win.gauge, getCaseTwist(run, getTableRules(caseId, run)), getTableRules(caseId, run)) : 0,
    multiplier: getMultiplier(win.gauge),
    // `note` is what the LOCK button's description adds under the next rules (G3): the reason when shut, STRIKE's hotter cap otherwise.
    focusBonus: { ...getFocusBonus(win.focus, win.focusMode, next), note: !next ? "" : lockShut ? ` ${fill(tableCopy.stage.lockShutReason, { cap: LOCK_CAP })}` : fill(tableCopy.stage.lockStrikeHot, { heat: STRIKE_HOT_GAUGE, cap: STRIKE_HOT_CAP }) },
    remaining: getRemainingSeconds(win),
    // A bust stops the heart (A2): the pulse reads "—" and the tick light is dark (fxVariables.js).
    // The urgency is read against the clock the stake leaves (`getWindowSeconds`), the one `remaining` counts down.
    bpm: win.status === "bust" ? "—" : getHeartbeatBpm(win.gauge, win.wall + (win.tellOffset ?? 0), schema.sedated, win.elapsed / getWindowSeconds(win)),
    nextLow,
    nextHigh,
    nextMultiplierLow: getMultiplier(nextLow),
    nextMultiplierHigh: getMultiplier(nextHigh),
    dangerLine: describeDanger({ gauge: win.gauge, nextHigh, wallMin: band.wallMin }),
    belowRelief: win.gauge < getFocusModeProfile(win.focusMode, next).relief,
    band,
    // B1: whether the run can pay for the look (SCOUT_TRUST of 믿음); the stage opens SCOUT on it, as the bots do.
    canPayScout: (Number(resources?.trust) || 0) >= scoutPrice,
    // The second look (11-18): both looks' 믿음, since both are billed when the window settles.
    // G2 (the next rules): the price climbs with the case's second looks (`narrowPrice`, nextTableRules.js narrowTrustAt).
    canPayNarrow: (Number(resources?.trust) || 0) >= scoutPrice + narrowPrice,
    next,
    narrowPrice,
    scoutPrice,
    // G18 (RULES_MARK 7): what a LOCK press takes of this board's clock, as the button says it (one decimal).
    lockSeconds: Math.round(getLockPressSeconds(win, getTableRules(caseId, run)) * 10) / 10,
    // G3: LOCK shut on this board (its carried streak fills LOCK's cap). G7: whether 숨 고르기 can still be pressed.
    lockShut,
    breathable: canBreathe(win, next ? undefined : getTableRules(caseId, run)),
    nextClock: describeNextClock(win, nextHigh),
    audit: reading,
    safe: readSafeLine(win, band.wallMin),
    // C-9: on a table that counts the audit, its line (40) and the band a cash
    // moves it neither way in, up to HEAT DEBT's 60.
    // G35 (RULES_MARK 9): the heats where a cash would make the ledger smoother instead.
    auditBand: reading ? (reading.smooth === undefined ? [AUDIT_HEAT, HEAT_DEBT_GAUGE] : reading.band) : null,
  };
}
