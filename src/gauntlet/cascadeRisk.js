import { isResourceGain } from "../gameConstants.js";
import { weekRuleHasDevice } from "./weeklyRules.js";
import cascadeCopy from "../copy/cascade.js";
import { fill } from "../locale.js";

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
 * - one CASCADE a board; a link due on a BLACKOUT board waits one more
 *   (decision 5);
 * - the links a case leaves when it closes are carried to the next case's
 *   first boards with the boards they had left (decision 6, changed by the
 *   user on 2026-10-20: they used to lapse, 68% of those made). At most
 *   `LINK_CARRY_MAX` go, the newest; the rest lapse, and so do the season's
 *   last case's and those a story case opens on.
 *
 * Where it lives (decision 9): the case's decision log holds every window's
 * outcome, the effect its card had and the rules the next board was dealt
 * (`environmentMode`), and it is fresh when a case opens, so
 * `walkLinks(log, runId, run.linksIn)` is the state. What crosses a case's
 * close cannot be read off a log that is gone, so the table carries it:
 * `linksOut`, written by the closing commit (`carryLinksOut`), and `linksIn`,
 * what the case opened with (`openCaseRun`). SAVE_SCHEMA_VERSION 4.
 *
 * On in a season whose week's rule is `cascade` (weeklyRules.js,
 * `weekRuleHasDevice`), which no week of the calendar is; a development
 * build forces it with `?week=cascade` (weeklyCalendar.js). The measurements
 * stamp it on their runs (CASCADE_WEEK=1, season-bot.mjs) and play the value
 * sets through scripts/sim/cascade-values.mjs.
 * At the rule switch (RULES_MARK 3, one PR with B3) the numbers move to
 * tableRules.js.
 *
 * The file is a chunk of its own (CASCADE_RISK in vite.config.js), as the
 * table's sound is: the engine's chunk and the table's import it, and it
 * imports nothing from either (only the week's rules, a chunk of their own,
 * as auditRisk.js does), so neither budget carries it. That is why the
 * draw below is written out and not `seededUnit` (a unit test holds the two
 * equal).
 */

/** A cash whose card burned this much of one resource makes a link (B: FRACTURE_MIN_BURN). */
export const LINK_BURN = 8;
/** The boards after the one that made it, of which one is the link's. */
export const LINK_SPAN_MIN = 2;
export const LINK_SPAN_MAX = 4;
/** How much closer CASCADE pulls the board's wall band (B: BLACKOUT_WALL_SHIFT). */
export const LINK_WALL = 6;
/**
 * How many links a closed case hands the next one; the older beyond it lapse
 * (decision 6 (2)). 1 since 2026-10-21: with 3, collapse rose to 23.0% and a
 * look lost 29.8% to CASCADE; with 1, 21.0% and 24.2%, and 20.6% of the links
 * made lapse. Pulling a carried link's wall 4 instead of 6 kept collapse at
 * 20.7% but a look still lost 28.3% (B2-측정-20261021.md).
 */
export const LINK_CARRY_MAX = 1;

/**
 * The next-board rule a link deals. 초안; the briefing and the reveal print it.
 * Its words are src/copy/cascade.js's, read when the board is described, so
 * another language laid over them is the one printed.
 */
export const CASCADE_MUTATION = Object.freeze({
  penalty: true,
  label: "CASCADE",
  get title() {
    return cascadeCopy.mutation.title;
  },
  get text() {
    return fill(cascadeCopy.mutation.text, { wall: LINK_WALL });
  },
});

/** Whether this table counts links: a `cascade` week's season, never in story mode or a practice case (decision 13). */
export function isCascadeOn(run) {
  return Boolean(run) && run.story !== true && !run.practice && weekRuleHasDevice(run.weekRule, "cascade");
}

/**
 * A saved list of links (`linksIn`, `linksOut`): each `{ from, due }` in the
 * boards of the case that receives it, `from` at most 0 (made before it
 * opened), `due` from 1 (never the REBOOT board) to `LINK_SPAN_MAX`; at most
 * `LINK_CARRY_MAX`, the newest. Anything else is dropped.
 */
export function normalizeLinks(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((link) => link && Number.isInteger(link.from) && Number.isInteger(link.due) && link.from <= 0 && link.due >= 1 && link.due <= LINK_SPAN_MAX)
    .map(({ from, due }) => ({ from: Math.max(from, -99), due }))
    .slice(-LINK_CARRY_MAX);
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
 * `p` was dealt by entry `p - 1`'s `environmentMode`. `linksIn` is what the
 * case opened with (`run.linksIn`), already in its boards. Returns the board
 * the table is on now (`board`), the links still out (`pending`, each with the
 * board it was made on and the one it is due), what came back (`landed`, of
 * which `landedIn` were carried in) and, once the case has closed, what it
 * hands on (`carried`, in the next case's boards, before the cap). A link
 * due on a board that did not carry CASCADE -- a BLACKOUT one, or one that
 * already carried another -- waits a board.
 */
export function walkLinks(log = [], runId = "", linksIn = []) {
  let pending = normalizeLinks(linksIn);
  let made = 0;
  let landed = 0;
  let landedIn = 0;
  let carried = [];
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
      // The closed case's board count is the next case's board 0, its REBOOT
      // board, which carries no CASCADE: what is due there waits for board 1.
      carried = pending.map((link) => ({ from: link.from - board, due: Math.max(1, link.due - board) }));
      pending = [];
      continue;
    }
    if (dealtBy.includes("cascade")) {
      const first = pending.reduce((best, link, index) => (link.due <= board && (best < 0 || link.due < pending[best].due) ? index : best), -1);
      if (first >= 0) {
        if (pending[first].from < 0) landedIn += 1;
        pending = pending.filter((_, index) => index !== first);
        landed += 1;
      }
    }
    pending = pending.map((link) => (link.due <= board ? { ...link, due: board + 1 } : link));
  }
  return { board, pending, made, landed, landedIn, carried };
}

/**
 * What a closed case hands the next one: the newest `LINK_CARRY_MAX` of the
 * walk's `carried`, and how many older ones lapsed under the cap.
 */
export function carryLinks({ carried = [] } = {}) {
  const newest = [...carried].sort((a, b) => a.from - b.from || a.due - b.due).slice(-LINK_CARRY_MAX);
  return { links: normalizeLinks(newest), capped: carried.length - newest.length };
}

/**
 * The closing commit's table (useChoiceCommit; the bots do the same): on a
 * table that counts links, `linksOut` is what the case hands on, read off the
 * case's whole log with its closing entry. The season's last case hands
 * nothing on (`last`). Any other commit, or a table without links, is left as
 * the engine settled it.
 */
export function carryLinksOut(nextRun, { run, log, runId, caseClosed, last = false }) {
  if (!caseClosed || !isCascadeOn(run)) return nextRun;
  return { ...nextRun, linksOut: last ? [] : carryLinks(walkLinks(log, runId, run.linksIn)).links };
}

/**
 * For `resolveWindow`: whether the board the window on the table deals is a
 * link's. False on a table without links. The engine adds what this cannot
 * know before the window settles: not on a BLACKOUT board, not on REBOOT.
 */
export const isLinkDue = (run, log, runId) => isCascadeOn(run) && isDueNext(walkLinks(log, runId, run.linksIn));

/** Whether a walk's next board is a link's. */
export const isDueNext = ({ board, pending }) => pending.some((link) => link.due === board + 1);

/**
 * The table's reading, or null on a table without links: how many are out
 * and the nearest range, in boards from the one on the table ("1" is the
 * next board). The range is what the player was told -- `LINK_SPAN_MIN`..
 * `LINK_SPAN_MAX` after the board that made it, narrowing as boards pass --
 * not the drawn board, which is never shown.
 */
export const readLinks = (run, log, runId) => (isCascadeOn(run) ? readWalk(walkLinks(log, runId, run.linksIn)) : null);

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
    ? fill(cascadeCopy.linkMade, { min: LINK_SPAN_MIN, max: LINK_SPAN_MAX, wall: LINK_WALL })
    : null;

/** "다음 판" or "2~4판 안", for a range in boards from the one on the table. */
export const describeRange = ([low, high]) => {
  const { next, after, within } = cascadeCopy.range;
  return high === 1 ? next : fill(low === high ? after : within, { low, high });
};

/** What the voice says of the links (B2 2-8). 초안. */
const describeLinks = ({ live, nearest }) => fill(cascadeCopy.links, { live, range: describeRange(nearest), wall: LINK_WALL });
