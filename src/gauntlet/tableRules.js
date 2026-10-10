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

/** What each step of the streak adds to the pot, and where that stops: x1.5 at a streak of 8. */
export const LOGIC_RATE = 0.0625;
export const LOGIC_CAP = 0.5;
/** A type held this many windows in a row starts to grow the streak. */
export const LOGIC_HOLD = 3;
/** The table clock one LOCK press costs. */
export const LOCK_PRESS_SECONDS = 1.5;

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
