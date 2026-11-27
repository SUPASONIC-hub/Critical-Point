/**
 * What the 「지난번 이후」 card (N24, SinceLastCard.jsx) says, as data: one
 * line each for the case to pick up, this week's rule, the side cases that
 * came out since the last visit and the board's posts since then. A line
 * with nothing to say is left out, and a card with no line is not drawn.
 *
 * Nothing here reads the page or the network, so the unit test reads every
 * line; the card hands in what it found.
 */
import { fill } from "./locale.js";

/** The posts a board read returned that were written after `since` (ms). */
export function countPostsSince(rows, since) {
  if (!Array.isArray(rows)) return 0;
  return rows.filter((row) => {
    const at = Date.parse(row?.created_at ?? "");
    return Number.isFinite(at) && at > since;
  }).length;
}

/** The side slot's cases (sideCases.getSideSlot) not in the ids listed at the last visit. */
export function newSideCases(slot, seen = []) {
  if (!slot?.cases?.length) return [];
  const known = new Set(seen);
  return slot.cases.filter((sideCase) => !known.has(sideCase.id));
}

/**
 * The card's lines in `words` (copy/sinceLast.js). `resume` is the case a
 * save is in (its label and title) or null, `rule` this week's rule or null,
 * `sides` the new side cases, `posts` the new posts counted out of a read of
 * `postLimit` (a full read says 「… 이상」), or null when the board was not read.
 */
export function sinceLastLines(words, { resume = null, rule = null, sides = [], posts = null, postLimit = 50 } = {}) {
  const lines = [];
  const caseName = [resume?.label, resume?.title].filter(Boolean).join(" ");
  if (caseName) lines.push({ key: "resume", text: fill(words.resume, { case: caseName }) });
  if (rule?.title) lines.push({ key: "rule", text: fill(words.rule, { title: rule.title }) });
  if (sides.length) lines.push({ key: "sides", text: fill(words.sides, { names: sides.map((side) => [side.label, side.title].filter(Boolean).join(" ")).join(", ") }) });
  if (Number.isInteger(posts) && posts > 0) lines.push({ key: "posts", text: fill(posts >= postLimit ? words.postsMany : words.posts, { count: posts }) });
  return lines;
}
