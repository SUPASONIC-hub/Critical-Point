import { isResourceGain } from "../gameConstants.js";

/**
 * CASCADE (B2, B2-연쇄위험-설계안.md): a heavy card comes back.
 *
 * The next-board rules all land on the very next board. B2 adds a late one:
 *
 * - a cash whose card burned one resource by `LINK_BURN` or more makes a link
 *   (the burn FRACTURE reads, the card's largest cost as the log holds it);
 *   a bust makes none, and neither does a BLACKOUT board, whose costs were
 *   face down (decisions 1 and 2);
 * - the link comes back on one board `LINK_SPAN_MIN`..`LINK_SPAN_MAX` boards
 *   later, drawn from the run, the scene and the card -- never the window's
 *   seed, the wall, the clock, SCOUT, LOCK or the heartbeat (decision 3; B6
 *   and B7 stay out). The range is shown and narrows as boards pass;
 * - that board is dealt CASCADE: its wall band `LINK_WALL` closer, told
 *   before it opens like every next-board rule (decision 4);
 * - one CASCADE a board; a link due on a BLACKOUT board waits one more, and
 *   the links a case leaves when it closes lapse (decisions 5 and 6).
 *
 * Where it lives (decision 9): nowhere new. The case's decision log holds
 * every window's outcome, the effect its card had and the rules the next
 * board was dealt (`environmentMode`), and it is fresh when a case opens, so
 * `walkLinks(log, runId)` is the state and the save keeps its shape.
 *
 * Off by default. `CASCADE_ON` is the switch the measurements turn (with the
 * values, scripts/sim/cascade-values.mjs); the game ships it false.
 * TODO after #199 (weekly rules): replace `CASCADE_ON` in `isCascadeOn` with
 * `weekRuleHasDevice(run.weekRule, "cascade")`, add the catalogue's
 * `cascade` week (decision 11) and the dev switch `?week=cascade`.
 * At the rule switch (RULES_MARK 3, one PR with B3) the four numbers move to
 * tableRules.js.
 *
 * The file is a chunk of its own (CASCADE_RISK in vite.config.js), as the
 * table's sound is: the engine's chunk and the table's import it, and it
 * imports nothing from either, so neither budget carries it. That is why the
 * draw below is written out and not `seededUnit` (a unit test holds the two
 * equal).
 */

/** The measurements' switch; false in the game until the week's rule carries it. */
export const CASCADE_ON = false;
/** A cash whose card burned this much of one resource makes a link (B: FRACTURE_MIN_BURN). */
export const LINK_BURN = 8;
/** The boards after the one that made it, of which one is the link's. */
export const LINK_SPAN_MIN = 2;
export const LINK_SPAN_MAX = 4;
/** How much closer CASCADE pulls the board's wall band (B: BLACKOUT_WALL_SHIFT). */
export const LINK_WALL = 6;

/** The next-board rule a link deals. 초안; the briefing and the reveal print it. */
export const CASCADE_MUTATION = Object.freeze({
  penalty: true,
  label: "CASCADE",
  title: "그때의 결재가 돌아왔다",
  text: `몇 판 전 크게 태운 카드의 연결. 이번 판은 벽이 ${LINK_WALL} 가까워진다.`,
});

/** Whether this table counts links. Never in story mode or a practice case (decision 13). */
export function isCascadeOn(run) {
  return CASCADE_ON && Boolean(run) && run.story !== true && !run.practice;
}

/** `seededUnit` (gauntletEngine.js), written out so this chunk does not import the engine's. */
function unit(seed) {
  let value = 2166136261;
  for (const character of String(seed)) value = Math.imul(value ^ character.charCodeAt(0), 16777619);
  value = (Math.imul(value >>> 0 || 1, 1664525) + 1013904223) >>> 0;
  value ^= value >>> 15;
  value = Math.imul(value, 2246822519) >>> 0;
  value ^= value >>> 13;
  return (value >>> 0) / 4294967296;
}

/** How many boards after the one that made it a link comes back: from the run, the scene and the card only. */
export function linkDelay(runId, nodeId, choiceId) {
  return LINK_SPAN_MIN + Math.floor(unit(`link:${runId}:${nodeId}:${choiceId}`) * (LINK_SPAN_MAX - LINK_SPAN_MIN + 1));
}

/** The largest cost in an effect, as a positive number: what FRACTURE and a link read. */
export function getEffectBurn(effect = {}) {
  let burn = 0;
  for (const [key, value] of Object.entries(effect ?? {})) {
    if (value && !isResourceGain(key, value)) burn = Math.max(burn, Math.abs(value));
  }
  return burn;
}

const modesOf = (entry) => String(entry?.environmentMode ?? "").split("+");

/**
 * The case's links off its log. Each entry with a window is one board; board
 * `p` was dealt by entry `p - 1`'s `environmentMode`. Returns the board the
 * table is on now (`board`), the links still out (`pending`, each with the
 * board it was made on and the one it is due), and what came back (`landed`)
 * and lapsed. A link due on a board that did not carry CASCADE -- a BLACKOUT
 * one, or one that already carried another -- waits a board.
 */
export function walkLinks(log = [], runId = "") {
  let pending = [];
  let made = 0;
  let landed = 0;
  let lapsed = 0;
  let board = 0;
  let dealtBy = [];
  for (const entry of log) {
    const threshold = entry?.threshold;
    if (!threshold) continue;
    const busted = threshold.busted === true || threshold.state === "bust";
    if (!busted && !dealtBy.includes("blackout") && getEffectBurn(entry.riskRewardEffect) >= LINK_BURN) {
      pending.push({ from: board, due: board + linkDelay(runId, entry.nodeId, entry.choiceId) });
      made += 1;
    }
    dealtBy = modesOf(entry);
    board += 1;
    if (dealtBy.includes("reboot")) {
      lapsed += pending.length;
      pending = [];
      continue;
    }
    if (dealtBy.includes("cascade")) {
      const first = pending.reduce((best, link, index) => (link.due <= board && (best < 0 || link.due < pending[best].due) ? index : best), -1);
      if (first >= 0) {
        pending = pending.filter((_, index) => index !== first);
        landed += 1;
      }
    }
    pending = pending.map((link) => (link.due <= board ? { ...link, due: board + 1 } : link));
  }
  return { board, pending, made, landed, lapsed };
}

/**
 * For `resolveWindow`: whether the board the window on the table deals is a
 * link's. False on a table without links. The engine adds what this cannot
 * know before the window settles: not on a BLACKOUT board, not on REBOOT.
 */
export const isLinkDue = (run, log, runId) => isCascadeOn(run) && isDueNext(walkLinks(log, runId));

/** Whether a walk's next board is a link's. */
export const isDueNext = ({ board, pending }) => pending.some((link) => link.due === board + 1);

/**
 * The table's reading, or null on a table without links: how many are out
 * and the nearest range, in boards from the one on the table ("1" is the
 * next board). The range is what the player was told -- `LINK_SPAN_MIN`..
 * `LINK_SPAN_MAX` after the board that made it, narrowing as boards pass --
 * not the drawn board, which is never shown.
 */
export const readLinks = (run, log, runId) => (isCascadeOn(run) ? readWalk(walkLinks(log, runId)) : null);

/** `readLinks` on any table: a walk's reading. */
export function readWalk({ board, pending }) {
  const ranges = pending.map((link) => {
    const low = Math.max(1, link.from + LINK_SPAN_MIN - board);
    return [low, Math.max(low, link.from + LINK_SPAN_MAX - board)];
  }).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const nearest = ranges[0] ?? null;
  const reading = { live: pending.length, nearest, atRisk: nearest?.[1] === 1, burn: LINK_BURN };
  // What the voice says as this board opens, once: a link the last board
  // made, or the nearest one now due next (B2 2-8). Else nothing.
  const fresh = pending.some((link) => link.from === board - 1);
  return { ...reading, said: fresh || reading.atRisk ? describeLinks(reading) : "" };
}

/**
 * The reveal's line on a window whose cash makes a link (the engine's
 * `verdict.link`), or null: a card that burned `LINK_BURN` or more, cashed on
 * a board BLACKOUT did not deal, on a table that counts links. `burn` is the
 * card's (`getCardBurn`), which is what the card showed. 초안.
 */
export const describeLinkMade = (run, { cashed, burn }) =>
  isCascadeOn(run) && cashed && !run.schema?.mutations?.includes("blackout") && Math.abs(burn?.value ?? 0) >= LINK_BURN
    ? `${LINK_SPAN_MIN}~${LINK_SPAN_MAX}판 안에 한 판의 벽이 ${LINK_WALL} 가까워진다.`
    : null;

/** "다음 판" or "2~4판 안", for a range in boards from the one on the table. */
export const describeRange = ([low, high]) => (high === 1 ? "다음 판" : low === high ? `${low}판 뒤` : `${low}~${high}판 안`);

/** What the voice says of the links (B2 2-8). 초안. */
export const describeLinks = ({ live, nearest }) => `연결 ${live}. 가장 이른 것은 ${describeRange(nearest)}, 그 판의 벽이 ${LINK_WALL} 가까워진다`;
