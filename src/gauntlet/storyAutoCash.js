import { CASE_RESULT_NODES } from "../gameCases.js";
import { reduceWindow } from "./gauntletEngine.js";

/**
 * G43 (게임성 개선점 5차, the user's 「전부 1」 of 2026-11-26, Q7 (1)): in story
 * mode a case's tables are played by hand only on its 결재 판; every other one
 * is cashed at heat 70 the moment its card is picked.
 *
 * Story mode's wall stands at 88-98 (STORY_WALL_MIN, gauntletEngine.js), so a
 * hand that pushes to 70 and stops does not bust (check:pressure's story rows):
 * some 390 tables a season whose result was settled before they were played.
 * The 결재 판 is G6's (settleChoice.js `isSignScene`): the board dealt on the
 * case's last decision, the scene every card of which (the wild one aside)
 * closes the case. Every case closes through one, so a season is played by
 * hand once a case. The player still picks every card, so the story's choices
 * are the player's as before; 「판 모두 직접 치기」 (`playAllTables`, a comfort
 * setting) plays every table by hand again.
 *
 * The auto table is played through the table's own reducer, press by press, so
 * its window, its replay trail and its decision log entry are the ones a hand
 * that did the same would leave (windowTrail.js, rankingRecheck.js): nothing on
 * the row says it was played for the player. Story seasons are not ranked
 * (useChoiceCommit's recordClosedCase), and board mode never comes here.
 */

/** The heat the auto table stops pushing at: the story hand check:pressure measures (STORY_SAFE_HEAT). */
export const STORY_AUTO_HEAT = 70;
/** The table clock the hand spends reading the board before its first push, and between pushes. */
export const AUTO_READ_SECONDS = 1;
export const AUTO_PUSH_SECONDS = 0.5;
/** A cap on pushes, past any board's reach to 70 (the smallest step is 1). */
const MAX_AUTO_PUSHES = 30;

/** Whether `node` is its case's last decision: every card on it (the wild one aside) closes the case (G6's 결재 판). */
export function isSignNode(caseId, node) {
  const result = CASE_RESULT_NODES[caseId];
  const choices = (node?.choices ?? []).filter((choice) => choice?.type !== "reframe");
  return Boolean(result) && choices.length > 0 && choices.every((choice) => choice.next === result);
}

/**
 * Whether the table on `node` is cashed for the player: a story run's, other
 * than the case's 결재 판, unless the player plays every table (`playAll`).
 * A practice replay of a story case is a story run too.
 */
export function isAutoCashTable({ run, caseId, node, playAll = false }) {
  return run?.story === true && !playAll && !isSignNode(caseId, node);
}

/**
 * The presses that cash `cardId` on `window` at heat STORY_AUTO_HEAT, and the
 * window they close on, under `rules` (tableUnlocks.js). The card is staked,
 * the board read for AUTO_READ_SECONDS, then pushed -- AUTO_PUSH_SECONDS of
 * clock after each -- while the heat is under STORY_AUTO_HEAT and the largest
 * step still lands short of the band's near end, so no push can reach the
 * wall; then cashed. A sealed card (`sealedId`) is pushed on until its seal
 * breaks, as the 확정 button asks. The same events, dispatched to the stage's
 * reducer from the same window, close it the same way: the reducer is seeded.
 */
export function planAutoCash(window, cardId, { rules, sealedId = null } = {}) {
  const events = [];
  let current = window;
  const press = (event) => {
    events.push(event);
    current = reduceWindow(current, event, rules);
  };
  if (!current || current.status !== "live") return { events, window: current };
  press({ type: "SELECT", id: cardId });
  if (current.elapsed < AUTO_READ_SECONDS) press({ type: "TICK", delta: AUTO_READ_SECONDS - current.elapsed });
  const sealed = sealedId !== null && sealedId === cardId;
  const wantsPush = () => {
    const schema = current.schema;
    const safe = current.gauge + schema.stepMax < schema.wallMin;
    return safe && (current.gauge < STORY_AUTO_HEAT || (sealed && current.gauge < schema.sealBreak));
  };
  for (let push = 0; push < MAX_AUTO_PUSHES && current.status === "live" && wantsPush(); push += 1) {
    press({ type: "PUSH" });
    if (current.status === "live") press({ type: "TICK", delta: AUTO_PUSH_SECONDS });
  }
  if (current.status === "live") press({ type: "CASH", locked: sealed && current.gauge < current.schema.sealBreak });
  return { events, window: current };
}
