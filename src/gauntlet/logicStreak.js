import { clamp } from "../gameConstants.js";
import { HEAT_DEBT_GAUGE, LOGIC_CAP, LOGIC_HOLD, LOGIC_RATE, METRONOME_REACH, SEAL_BREAK_GAUGE } from "./tableRules.js";

/**
 * The logic streak: a combo earned by the type of card a hand picks from one
 * scene to the next. When a press lands earns nothing.
 *
 * The run carries seven things (`run.logic`). `type` is the type being held
 * and `held` how many windows in a row it has been picked; `streak` is the
 * combo and `best` the longest it has been; `heat` is the tier the last window
 * closed in and `rose` whether that was higher than the window before it --
 * which is what "the pressure rose" means to the window about to be played.
 * `reach` is how many more windows that rise is good for in a hand that holds
 * METRONOME (`METRONOME_REACH` as it rises, one fewer each window after).
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
    type: typeof value?.type === "string" ? value.type : null,
    held: count("held"),
    heat: count("heat", 3),
    rose: value?.rose === true,
    reach: count("reach", METRONOME_REACH),
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

/**
 * The types a scene has on the table: its cards' (the wild one among them),
 * less any that cannot be played -- a card the hand cannot pick is not an
 * offer. The table and the settlement both ask here, so the streak a card is
 * shown to leave is the one it is paid on.
 */
export function listOfferedTypes(cards = [], isOpen = () => true) {
  return [...new Set(cards.filter(isOpen).map(getLogicType).filter(Boolean))];
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
 * One settled window against the streak. `type` is the card the hand picked;
 * null when it picked none (the room played the card, or there was none); and
 * false when the streak is not in play at all -- a case that does not have the
 * rule yet, where it is neither added to nor taken. `tier` is what the window
 * closed in, and `offered` the types the scene had on the table, when the
 * caller knows them.
 *
 * A bust ends the streak whoever played the card. A window run out with
 * nothing staked is a bust like any other -- it used to be read as no move at
 * all, which made letting the clock run out the one bust that spared the
 * streak -- but the room's card is not the hand's pick, so what the hand was
 * holding (`type`, `held`) is left as it was. In the game the room only ever
 * plays a card on a bust; a window that closed without one and without a pick
 * is nothing the hand did, and moves nothing.
 *
 * Two relics bend it, and the settlement passes whether the run holds them.
 * `bustHolds` is 앙코르: a bust takes the pot and leaves the streak. `reach`
 * is 메트로놈: a change of type counts as a switch not only on the window the
 * pressure rose into but on the one after it as well.
 *
 * The move is what happened to the streak: "build" (a first card, or a held
 * type not yet held long enough), "grow", "switch", "keep", "break", "bust",
 * and "none" when it was not in play. The tier and whether it rose are kept on
 * every window whatever the move: they are the table's, not the hand's, and
 * the next window reads them under any rules.
 */
export function advanceLogic(logic, { type, tier, offered, bustHolds, reach }) {
  const rose = tier > logic.heat;
  const next = { ...logic, heat: tier, rose, reach: rose ? METRONOME_REACH : Math.max(0, (logic.reach || 0) - 1) };
  const bust = tier === 3;
  if (!(type ?? bust)) return { logic: next, move: "none" };
  const same = type === logic.type;
  if (type) {
    next.type = type;
    next.held = same ? logic.held + 1 : 1;
  }
  const held = same ? (next.held < LOGIC_HOLD ? "build" : "grow") : !logic.type ? "build" : null;
  const left = logic.rose || (reach && logic.reach > 0) ? "switch" : offered && !offered.includes(logic.type) ? "keep" : "break";
  const move = bust ? "bust" : held ?? left;
  if (move === "grow" || move === "switch") next.streak += 1;
  if (move === "break" || (move === "bust" && !bustHolds)) next.streak = 0;
  next.best = Math.max(next.best, next.streak);
  return { logic: next, move };
}
