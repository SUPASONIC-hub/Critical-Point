import { clamp } from "../gameConstants.js";
import { HEAT_DEBT_GAUGE, LOGIC_CAP, LOGIC_HOLD, LOGIC_RATE, SEAL_BREAK_GAUGE } from "./tableRules.js";

/**
 * The logic streak: a combo earned by the type of card a hand picks from one
 * scene to the next, where the beat's was earned by when it pushed.
 *
 * The run carries six things (`run.logic`). `type` is the type being held and
 * `held` how many windows in a row it has been picked; `streak` is the combo
 * and `best` the longest it has been; `heat` is the tier the last window
 * closed in and `rose` whether that was higher than the window before it --
 * which is what "the pressure rose" means to the window about to be played.
 *
 * Holding a type grows the streak from the third window (`LOGIC_HOLD`).
 * Changing type when the pressure rose is an answer to it, and grows the
 * streak too; changing because the held type was not on the table keeps the
 * streak; changing for no reason the table gave ends it, and so does a bust.
 *
 * A module of its own, beside the engine that settles it: the engine is kept
 * whole in the chunk the start screen loads (cloudSave.js imports it
 * dynamically), so every name it exports is paid for there, and these are
 * asked for by the tests and the balance scripts far more than by the game.
 */
export function normalizeLogic(value) {
  const count = (key, most = 9999) => clamp(Math.trunc(Number(value?.[key]) || 0), 0, most);
  return {
    streak: count("streak"),
    best: count("best"),
    type: typeof value?.type === "string" ? value.type.slice(0, 40) : null,
    held: count("held"),
    heat: count("heat", 3),
    rose: value?.rose === true,
  };
}

/** A streak not yet begun: what a new run holds, and what a save from before the streak reads as. */
export const LOGIC_INITIAL = Object.freeze(normalizeLogic());

/**
 * A card's type: the largest key of its `cognition`, the read the score takes
 * (gameLogic's `getGameplayStats`), the earlier key on a tie. The wild card
 * carries no map of its own -- the commit prices it with `REFRAME_COGNITION`,
 * which the engine cannot import -- and it is 판 바꾸기.
 */
export function getLogicType(card) {
  if (card?.type === "reframe") return "reframing";
  return Object.entries(card?.cognition ?? {}).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

/** The heat a window closed in, as a tier: 0 cold, 1 past the seal's heat, 2 past HEAT DEBT's, 3 a bust. */
export function getHeatTier(outcome, gauge) {
  return outcome === "bust" ? 3 : gauge >= HEAT_DEBT_GAUGE ? 2 : gauge >= SEAL_BREAK_GAUGE ? 1 : 0;
}

/** What a streak pays: x1 with none, x1.5 from a streak of 8. */
export function getLogicBonus(streak) {
  return 1 + Math.min(LOGIC_CAP, Math.max(0, Number(streak) || 0) * LOGIC_RATE);
}

/**
 * One settled window against the streak. `type` is the card's, and null when
 * the streak is not in play: the room played the card, there was no card, or
 * the case does not have the rule yet -- the streak is neither added to nor
 * taken there. `tier` is what the window closed in, and `offered` the types
 * the scene had on the table, when the caller knows them.
 *
 * `bustHolds` is the seam for 앙코르. That relic is given its new meaning with
 * the switch (day 6: a bust takes the pot and leaves the streak), and the
 * settlement will pass whether the run holds it; until then nothing passes it
 * and a bust always ends the streak.
 *
 * The move is what happened to the streak: "build" (a first card, or a held
 * type not yet held long enough), "grow", "switch", "keep", "break", "bust",
 * and "none" when it was not in play. The tier and whether it rose are kept on
 * every window whatever the move: they are the table's, not the hand's, and
 * the next window reads them under any rules.
 */
export function advanceLogic(logic, { type = null, tier = 0, offered = null, bustHolds = false } = {}) {
  const next = { ...logic, heat: tier, rose: tier > logic.heat };
  if (!type) return { logic: next, move: "none" };
  const same = type === logic.type;
  next.type = type;
  next.held = same ? logic.held + 1 : 1;
  const held = same ? (next.held < LOGIC_HOLD ? "build" : "grow") : !logic.type ? "build" : null;
  const left = logic.rose ? "switch" : offered && !offered.includes(logic.type) ? "keep" : "break";
  const move = tier === 3 ? "bust" : held ?? left;
  if (move === "grow" || move === "switch") next.streak += 1;
  if (move === "break" || (move === "bust" && !bustHolds)) next.streak = 0;
  next.best = Math.max(next.best, next.streak);
  return { logic: next, move };
}
