/**
 * The table's numbers, written down once.
 *
 * Every one of these was a literal in `buildNextSchema` or `applyRelics` and
 * the same literal again in the sentence that tells the player about it
 * (`MUTATIONS`, `RELICS`). Tuning a rule meant editing the rule and then
 * remembering which copy quoted it. The rule and its sentence read from here.
 *
 * A leaf module: the engine and the relic catalogue both import it, and the
 * engine imports the catalogue.
 */

/** The heat at which a COLD FEET seal opens, before LOCKPICK. */
export const SEAL_BREAK_GAUGE = 30;
/** What FRACTURE bills the cracked axis, before SPLINT. */
export const FRACTURE_RATE = 1.5;

/** BLACKOUT: how much closer a bust pulls the wall's band. */
export const BLACKOUT_WALL_SHIFT = 6;
/** AFTERSHOCK: the heat a board opens on after a bust. */
export const AFTERSHOCK_START = 22;
/** SILENCE: the clock a timed-out window leaves the next one. */
export const SILENCE_SECONDS = 30;
/** HEAT DEBT: the heat a cash has to reach, the share of it carried in, and the clock it costs. */
export const HEAT_DEBT_GAUGE = 60;
export const HEAT_DEBT_SHARE = 3;
export const HEAT_DEBT_SECONDS = 12;
/** The two heats the rules read, marked on the gauge: a seal breaks at 30, HEAT DEBT starts at 60. */
export const GAUGE_MARKS = [SEAL_BREAK_GAUGE, HEAT_DEBT_GAUGE];
/** A cash at this multiplier or better builds the chain; this many in a row OVERCLOCK the board. */
export const HOT_CASH_MULTIPLIER = 4;
export const OVERCLOCK_STREAK = 2;
export const OVERCLOCK_CHIPS = 2;
export const COLD_FEET_CHIPS = 0.6;
/** What a charged stance carries into the next board. */
export const STRIKE_WAKE_CHIPS = 1.25;
export const STEADY_LINE_COOL = 8;
export const STEADY_LINE_SECONDS = 4;
export const STEADY_LINE_WALL = 3;

/**
 * What each step of the streak adds to the pot, and where that stops: x1.6 at
 * a streak of 10. Until 2026-10-16 it stopped at x1.5 (a streak of 8), 6.4
 * points of heat where the smallest push is 7.
 */
export const LOGIC_RATE = 0.0625;
export const LOGIC_CAP = 0.6;
/** A type held this many windows in a row starts to grow the streak. */
export const LOGIC_HOLD = 3;
/** The table clock one LOCK press costs. */
export const LOCK_PRESS_SECONDS = 1.5;
/**
 * SCOUT (B1, 11일차 초안): what one look at the wall costs on the table clock,
 * once a window, and how far the band it draws reaches -- a band
 * `2 * SCOUT_REACH` wide that holds the wall at a seeded place inside it, cut
 * to the board's own band. Measured in check:pressure ("scout" rows).
 */
export const SCOUT_SECONDS = 3;
export const SCOUT_REACH = 10;

/** METRONOME: how many windows after the pressure rose a change of type still counts as a switch. */
export const METRONOME_REACH = 2;
export const COLD_BLOOD_START = 11;
export const HEAT_SINK_SHARE = 6;
export const HEAT_SINK_SECONDS = 6;
export const LOCKPICK_SEAL = 15;
export const SPLINT_RATE = 1.25;
/** INSURANCE leaves one part in this many of the pot. */
export const INSURANCE_SHARE = 3;
export const HIGH_ROLLER_CHIPS = 1.3;
export const HIGH_ROLLER_WALL = 4;
export const KINETIC_GRIP_CHIPS = 1.08;
export const STEADY_ANCHOR_COOL = 4;
export const STEADY_ANCHOR_SECONDS = 2;
export const GLASS_LENS_SEAL = 8;

/**
 * AUDIT (B3, a week's device for now, `weeklyRules.js`): a cash pushed at
 * least once and closed below `AUDIT_HEAT` adds one to the case's audit, a
 * cash at `HEAT_DEBT_GAUGE` or more takes `AUDIT_RELIEF` off it. When the case
 * closes with `AUDIT_LIMIT` or more, one part in `AUDIT_SHARE` of what it
 * moves to the vault is lost (auditRisk.js). B, the design's starting values.
 */
export const AUDIT_HEAT = 40;
export const AUDIT_LIMIT = 4;
export const AUDIT_RELIEF = 2;
export const AUDIT_SHARE = 4;
