import { clamp, getEffectLean } from "../gameConstants.js";
import { HEAT_DEBT_GAUGE, LOGIC_CAP, LOGIC_HOLD, LOGIC_RATE, METRONOME_REACH, SEAL_BREAK_GAUGE } from "./tableRules.js";

/**
 * The logic streak: a combo earned by the direction of the card a hand picks
 * from one scene to the next. When a press lands earns nothing.
 *
 * The direction is the story's own axis (C-3, the user's answer of
 * 2026-10-25, (1)): a card leans toward the people in the scene (사람) or
 * toward the position being held (자리), read off its effect the way the
 * report's 일관성 score reads every decision (`getEffectLean`). Until then the
 * streak was held on the card's thinking type, and 위험 다루기 -- on the table
 * in 96% of scenes -- paid the most whatever the scene was about, while the
 * report's 관점 전환 score paid for spreading the picks over the four types.
 * Held on the direction, the streak and 일관성 ask for the same thing and the
 * types are free to spread.
 *
 * The run carries seven things (`run.logic`). `type` is the direction being
 * held (the key kept its name, so a save keeps its shape) and `held` how many
 * windows in a row it has been picked; `streak` is the combo and `best` the
 * longest it has been; `heat` is the tier the last window closed in and `rose`
 * whether that was higher than the window before it -- which is what "the
 * pressure rose" means to the window about to be played. `reach` is how many
 * more windows that rise is good for in a hand that holds METRONOME
 * (`METRONOME_REACH` as it rises, one fewer each window after).
 *
 * Holding a direction grows the streak from the third window (`LOGIC_HOLD`).
 * Changing direction when the pressure rose is an answer to it, and grows the
 * streak too; changing because the held direction was not on the table keeps
 * the streak, and so does a card that leans neither way (`LOGIC_EVEN`);
 * changing for no reason the table gave ends it, and so does a bust.
 *
 * A module of its own, beside the engine that settles it: the engine is kept
 * whole in the chunk the start screen loads (cloudSave.js imports it
 * dynamically), so every name it exports is paid for there, and these are
 * asked for by the tests and the balance scripts far more than by the game.
 */
/** The two directions a streak can be held on: toward the people, toward the position. */
export const LOGIC_DIRECTIONS = Object.freeze(["people", "position"]);
/** A card that leans neither way: it neither adds to the hold nor ends it. */
export const LOGIC_EVEN = "even";

export function normalizeLogic(value) {
  const count = (key, most = 9999) => clamp(Math.trunc(Number(value?.[key]) || 0), 0, most);
  const held = LOGIC_DIRECTIONS.includes(value?.type);
  return {
    streak: count("streak"),
    best: count("best"),
    // A save from before C-3 holds a thinking type here: the hold starts over
    // and the streak it built is kept. No direction held, no hold.
    type: held ? value.type : null,
    held: held ? count("held") : 0,
    heat: count("heat", 3),
    rose: value?.rose === true,
    reach: count("reach", METRONOME_REACH),
  };
}

/** A streak not yet begun: what a new run holds, and what a save from before the streak reads as. */
export const LOGIC_INITIAL = Object.freeze(normalizeLogic());

/**
 * A card's thinking type: the largest key of its `cognition`, the read the
 * score takes (gameLogic's `getGameplayStats`), the earlier key on a tie. The
 * wild card carries no map of its own -- the commit prices it with
 * `REFRAME_COGNITION`, which the engine cannot import -- and it is 판 바꾸기.
 * The streak no longer reads it (C-3); the card's tag prints it beside the
 * direction, because the report's 관점 전환 score still does.
 */
export function getLogicType(card) {
  if (card?.type === "reframe") return "reframing";
  return Object.entries(card?.cognition ?? {}).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

/**
 * A card's direction for the streak: "people", "position", or `LOGIC_EVEN`
 * for a card whose effect leans neither way; null for no card. The wild card
 * carries no effect of its own -- the commit prices it with `REFRAME_EFFECT`
 * (gameLogic.js: time -6, trust +3), which the engine cannot import -- and
 * that leans toward the people; a unit test holds the two together.
 */
export function getLogicDirection(card) {
  if (!card) return null;
  if (card.type === "reframe") return "people";
  const lean = getEffectLean(card.effect ?? {});
  return lean > 0 ? "people" : lean < 0 ? "position" : LOGIC_EVEN;
}

/**
 * The directions a scene has on the table: its cards' (the wild one among
 * them), less any that cannot be played -- a card the hand cannot pick is not
 * an offer -- and less the even ones, which are no direction to hold. The
 * table and the settlement both ask here, so the streak a card is shown to
 * leave is the one it is paid on.
 */
export function listOfferedDirections(cards = [], isOpen = () => true) {
  return [...new Set(cards.filter(isOpen).map(getLogicDirection).filter((direction) => LOGIC_DIRECTIONS.includes(direction)))];
}

/** The heat a window closed in, as a tier: 0 cold, 1 past the seal's heat, 2 past HEAT DEBT's, 3 a bust. */
export function getHeatTier(outcome, gauge) {
  return outcome === "bust" ? 3 : gauge >= HEAT_DEBT_GAUGE ? 2 : gauge >= SEAL_BREAK_GAUGE ? 1 : 0;
}

/** What a streak pays: x1 with none, x1.6 from a streak of 10. */
export function getLogicBonus(streak) {
  return 1 + Math.min(LOGIC_CAP, Math.max(0, Number(streak) || 0) * LOGIC_RATE);
}

/**
 * One settled window against the streak. `type` is the direction of the card
 * the hand picked (`getLogicDirection`), `LOGIC_EVEN` for one that leans
 * neither way; null when it picked none (the room played the card, or there was none); and
 * false when the streak is not in play at all -- a case that does not have the
 * rule yet, where it is neither added to nor taken. `tier` is what the window
 * closed in, and `offered` the directions the scene had on the table, when
 * the caller knows them.
 *
 * A bust ends the streak whoever played the card. A window run out with
 * nothing staked is a bust like any other -- it used to be read as no move at
 * all, which made letting the clock run out the one bust that spared the
 * streak -- but the room's card is not the hand's pick, so what the hand was
 * holding (`type`, `held`) is left as it was. In the game the room only ever
 * plays a card on a bust; a window that closed without one and without a pick
 * is nothing the hand did, and moves nothing.
 *
 * Three relics bend it, and the settlement passes whether the run holds them.
 * `bustHolds` is 앙코르: a bust takes the pot and leaves the streak. `reach`
 * is 메트로놈: a change of direction counts as a switch not only on the window the
 * pressure rose into but on the one after it as well. `hold` is how many
 * windows a direction is held before it grows the streak: `LOGIC_HOLD`, one fewer
 * with 도윤하의 현장 메모 (FIELD NOTES, C-7).
 *
 * The move is what happened to the streak: "build" (a first card, or a held
 * direction not yet held long enough), "grow", "switch", "keep" (the held
 * direction was not on the table, or the card leaned neither way), "break",
 * "bust", and "none" when it was not in play. The tier and whether it rose are kept on
 * every window whatever the move: they are the table's, not the hand's, and
 * the next window reads them under any rules.
 */
export function advanceLogic(logic, { type, tier, offered, bustHolds, reach, hold = LOGIC_HOLD }) {
  const rose = tier > logic.heat;
  const next = { ...logic, heat: tier, rose, reach: rose ? METRONOME_REACH : Math.max(0, (logic.reach || 0) - 1) };
  const bust = tier === 3;
  if (!(type ?? bust)) return { logic: next, move: "none" };
  // A card that leans neither way steps aside: the hold is neither added to
  // nor ended, and only a bust moves the streak.
  if (type === LOGIC_EVEN) type = null;
  if (!type && !bust) return { logic: next, move: "keep" };
  const same = type === logic.type;
  if (type) {
    next.type = type;
    next.held = same ? logic.held + 1 : 1;
  }
  const held = same ? (next.held < hold ? "build" : "grow") : !logic.type ? "build" : null;
  const left = logic.rose || (reach && logic.reach > 0) ? "switch" : offered && !offered.includes(logic.type) ? "keep" : "break";
  const move = bust ? "bust" : held ?? left;
  if (move === "grow" || move === "switch") next.streak += 1;
  if (move === "break" || (move === "bust" && !bustHolds)) next.streak = 0;
  next.best = Math.max(next.best, next.streak);
  return { logic: next, move };
}
