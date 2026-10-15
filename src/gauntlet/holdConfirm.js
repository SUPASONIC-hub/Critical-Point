import { nodes } from "../gameData.js";

/**
 * 확정 on the scene that closes a case is held, not clicked (improvement notes
 * A4: a deliberate bit of friction, kept to the big decisions so it does not
 * turn into a chore over a season). The finale's 봉인 / 규칙 / 폭로 is one of
 * them; a run meets about one per case.
 *
 * The case's last choice is the scene a card of which leads into the case's
 * aftermath (`kind: "aftermath"`, the scene its pack names last in
 * `aftermathRoute`, after which only the report is left). That is the closing
 * decision each pack names (`kind: "decision"`: the prologues, 사건 06-49 and
 * the finale's `f_choice`), each route's own final in 사건 01-05
 * (`kind: "routeFinal"`), and the evidence turn (`kind: "evidence"`), which
 * skips the closing decision and goes straight to the aftermath. The kinds
 * alone do not say it: the finale's four route finals are `routeFinal` and
 * lead on to `f_confront`, and the aftermath scene itself is a click.
 *
 * Nobody who cannot hold is shut out: a second press within
 * `SECOND_PRESS_MS` of the first confirms too. That is the path for a screen
 * reader's virtual click (it sends a click with no press before it), a switch,
 * or a hand that cannot keep still for most of a second. Reduced motion
 * changes the ring, never the rule.
 */
export const HOLD_MS = 800;
export const SECOND_PRESS_MS = 3000;

/** Whether a scene's 확정 is held: one of its cards closes the case. */
export function isClosingScene(node, graph = nodes) {
  return Boolean(node?.choices?.some((choice) => graph[choice.next]?.kind === "aftermath"));
}

/** Nothing pressed, nothing armed. */
export const HOLD_IDLE = Object.freeze({ phase: "idle", since: 0 });

const stay = (state) => ({ state, confirmed: false });
const done = { state: HOLD_IDLE, confirmed: true };

/**
 * One step of the hold. `state` is `{ phase, since }`: idle; `holding` since
 * the press began; `armed` since a short press ended (or a bare tap landed),
 * waiting for the second. `event` is `{ type, at }`, `at` in milliseconds on
 * any clock that only goes forward:
 *
 * - `press`   a pointer went down or Enter/Space went down on the button
 * - `release` that pointer or key came back up
 * - `tap`     a click with no press before it (a screen reader's, a switch's)
 * - `tick`    time passed; the caller sends one when a hold or an arm is due
 * - `cancel`  the pointer slid off or was taken by the browser: a hold in
 *             progress is dropped, an armed first press is kept (moving the
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
      return stay({ phase: "armed", since: at });
    case "tap":
      if (armed) return done;
      if (state.phase === "holding") return stay(state);
      return stay({ phase: "armed", since: at });
    case "tick":
      if (heldLongEnough) return done;
      if (state.phase === "armed" && !armed) return stay(HOLD_IDLE);
      return stay(state);
    case "cancel":
      return stay(state.phase === "holding" ? HOLD_IDLE : state);
    default:
      return stay(state);
  }
}
