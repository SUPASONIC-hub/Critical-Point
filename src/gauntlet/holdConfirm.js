import { nodes } from "../gameData.js";

/**
 * The big decisions' 확정 is held, not clicked (improvement notes A4, the
 * 2026-11-05 decision: a deliberate bit of friction, kept to the two
 * moments it is worth, so it does not turn into a chore over a season).
 * They are:
 *
 * - the case's last choice (`isClosingScene`): the scene a card of which
 *   leads into the case's aftermath (`kind: "aftermath"`, the scene its pack
 *   names last in `aftermathRoute`, after which only the report is left).
 *   That is the closing decision each pack names (`kind: "decision"`: the
 *   prologues, 사건 06-49 and the finale's `f_choice`), each route's own
 *   final in 사건 01-05 (`kind: "routeFinal"`), and the evidence turn
 *   (`kind: "evidence"`), which skips the closing decision. The kinds alone
 *   do not say it: the finale's four route finals are `routeFinal` and lead
 *   on to `f_confront`, and the aftermath scene itself is a click;
 * - the confirm right before a collapse (`isDangerZone`): the heat is inside
 *   the band the table draws (the 현재 위험 cell's 「벽 구간 안」,
 *   tableMeters.js), so this 확정 is the one that stops short of the wall.
 *   The band is the shown one -- SCOUT's narrower one once it is bought --
 *   never the wall this window drew.
 *
 * A hold is `HOLD_MS` with the pointer, or with Enter or Space, and fills a
 * gauge on the button as it goes (HoldGauge.jsx). Let go early and nothing
 * happens but a hint: the button says 길게 눌러야 확정 for `HINT_MS` and the
 * table's voice says it too, so a plain click is never silently ignored. A
 * click with no press before it -- a screen reader's virtual click, a
 * switch -- cannot hold, so for it alone a second press within
 * `SECOND_PRESS_MS` confirms, and the voice says so (한 번 더 누르면 확정된다).
 * Reduced motion and the calm setting change the gauge's flourish, never the
 * rule. Every other table cashes on one press.
 */
export const HOLD_MS = 600;
export const SECOND_PRESS_MS = 3000;
export const HINT_MS = 1500;

/** Whether a scene's 확정 is held: one of its cards closes the case. */
export function isClosingScene(node, graph = nodes) {
  return Boolean(node?.choices?.some((choice) => graph[choice.next]?.kind === "aftermath"));
}

/** Whether the heat stands inside the band the table draws: the 확정 right before a collapse. */
export const isDangerZone = (gauge, wallMin) => Number.isFinite(gauge) && Number.isFinite(wallMin) && gauge >= wallMin;

/** Whether this table's 확정 is held: the case's last choice, or a table in the danger zone. */
export function holdsConfirm({ node, gauge, wallMin }, graph = nodes) {
  return isClosingScene(node, graph) || isDangerZone(gauge, wallMin);
}

/** Nothing pressed, nothing armed. */
export const HOLD_IDLE = Object.freeze({ phase: "idle", since: 0 });

/** How long each phase lasts before the machine wants a tick: a hold fills, a hint and an arm run out. */
export const PHASE_MS = Object.freeze({ holding: HOLD_MS, hinted: HINT_MS, armed: SECOND_PRESS_MS });

const stay = (state) => ({ state, confirmed: false });
const done = { state: HOLD_IDLE, confirmed: true };

/**
 * One step of the hold. `state` is `{ phase, since }`: idle; `holding` since
 * the press began; `hinted` since a short press let go, showing the hint;
 * `armed` since a bare tap landed, waiting for the second. `event` is
 * `{ type, at }`, `at` in milliseconds on any clock that only goes forward:
 *
 * - `press`   a pointer went down or Enter/Space went down on the button
 * - `release` that pointer or key came back up
 * - `tap`     a click with no press before it (a screen reader's, a switch's)
 * - `tick`    time passed; the caller sends one when the phase is due to end
 * - `cancel`  the pointer slid off or was taken by the browser: a hold in
 *             progress is dropped, a hint or an armed tap is kept (moving the
 *             mouse away between two clicks is not changing your mind)
 *
 * Returns the next state and whether this step confirmed. A confirm always
 * leaves the machine idle, so one gesture never confirms twice.
 */
export function stepHold(state, { type, at }) {
  const armed = state.phase === "armed" && at - state.since <= SECOND_PRESS_MS;
  const heldLongEnough = state.phase === "holding" && at - state.since >= HOLD_MS;
  switch (type) {
    case "press":
      if (armed) return done;
      if (state.phase === "holding") return stay(state);
      return stay({ phase: "holding", since: at });
    case "release":
      if (state.phase !== "holding") return stay(state);
      if (heldLongEnough) return done;
      return stay({ phase: "hinted", since: at });
    case "tap":
      if (armed) return done;
      if (state.phase === "holding") return stay(state);
      return stay({ phase: "armed", since: at });
    case "tick":
      if (heldLongEnough) return done;
      if (state.phase === "armed" && !armed) return stay(HOLD_IDLE);
      if (state.phase === "hinted" && at - state.since >= HINT_MS) return stay(HOLD_IDLE);
      return stay(state);
    case "cancel":
      return stay(state.phase === "holding" ? HOLD_IDLE : state);
    default:
      return stay(state);
  }
}
