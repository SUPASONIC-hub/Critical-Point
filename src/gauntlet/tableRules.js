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
/** INSURANCE leaves one part in this many of the pot. */
export const INSURANCE_SHARE = 3;
export const KINETIC_GRIP_CHIPS = 1.08;
/**
 * The five tools of C-7 (2026-10-25), in the place of LOCKPICK, SPLINT, HIGH
 * ROLLER, STEADY ANCHOR and GLASS LENS, which check:pressure measured lifting
 * the best heartbeat play by -1.8% to +0.1%. CARBON COPY takes this much of
 * BLACKOUT's pull back; FRONT PAGE takes this much of OVERCLOCK's wider push
 * back (`stepMin`, `stepMax`). FIELD NOTES holds a type one window shorter
 * (`LOGIC_HOLD - 1`), TESTIMONY leaves one part in this many of the pot when
 * the clock runs a window out, and AUDIT CONTACT's slack is the audit's own
 * (auditRisk.js).
 */
export const CARBON_COPY_HOLD = 3;
export const TESTIMONY_SHARE = 2;
export const FRONT_PAGE_STEP = Object.freeze([2, 3]);

/**
 * 「숨 고르기」 (C-7): passing on a draft that offered something. The case's
 * first board -- the one the draft holds the clock of -- is dealt again with
 * this much more clock and its wall's band this much further. Once a draft,
 * and only on that board: the board after it is dealt from what happened on it.
 */
export const BREATHER_SECONDS = 10;
export const BREATHER_WALL = 3;

/**
 * 「고점 판」 (C-10, 2026-10-25): every board of an act's last case
 * (`PEAK_CASES`, tableUnlocks.js) is dealt with the wall's band this much
 * closer and the chips this many times thicker.
 */
export const PEAK_WALL = 5;
export const PEAK_CHIPS = 1.25;
/**
 * The cases it is dealt in: the last of each of B-11's eight acts, 41 for act
 * 7 (whose last, 42, is a rest). Here, with its numbers, so the debug jump and
 * a replay link (state/runState.js `jumpToNode`) can lay a peak case's first
 * board without the ladder's copy (tableUnlocks.js, which reads it from here).
 */
export const PEAK_CASES = Object.freeze(["case07", "case12", "case18", "case24", "case30", "case36", "case41", "final"]);

/*
 * AUDIT's and CASCADE's numbers (B3 and B2, rules of the table since
 * RULES_MARK 3) are not here but in auditRisk.js and cascadeRisk.js, each in
 * its own chunk: imported from this module, the build split this one into a
 * chunk of its own beside the engine's and every budget around it went over
 * (check:bundle, 2026-10-21; the rule switch's question 5 measured). The
 * engine, the ladder's lines (tableUnlocks.js) and the bots read them there.
 */
