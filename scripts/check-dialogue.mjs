/**
 * Does each authored line answer the button it is printed under?
 *
 * The generated scenes take their copy from a table that is a plain array,
 * matched to the labels by position. Nothing tied the two together, so when a
 * connective scene's labels were rewritten the table stayed behind: picking
 * "살아남을 돈을 먼저 확보한다" spoke "근거와 책임자를 같은 문서에 공개하겠습니다",
 * and every existing check passed because a line was present and unique.
 *
 * The drift always has the same shape -- the lines are the right lines for the
 * scene, sitting on the wrong buttons -- so this walks every generated scene and
 * fails when one of its own other lines is a clearly better answer to a label
 * than the line actually assigned to it.
 */
import assert from "node:assert/strict";

import { nodes, choiceVoiceLines, echoReplies } from "../src/gameData.js";

// Korean marks its grammar with endings, so comparing whole words finds nothing.
// Stripping the common particles and verb endings leaves stems that two ways of
// saying the same decision do share.
const ENDINGS = /(습니다|합니다|하겠습니다|한다|된다|는다|이다|에서|에게|으로|로|를|을|은|는|이|가|와|과|의|도|만|부터|까지|고|며)$/u;
const TOO_COMMON = /^(것|수|때|더|먼저|다시|모두|함께|그|이|저|하나|사람들)$/u;

function stems(text = "") {
  return [
    ...new Set(
      String(text)
        .replace(/["'`·…?!,.]/g, " ")
        .split(/\s+/)
        .map((word) => word.replace(ENDINGS, ""))
        .filter((word) => word.length >= 2 && !TOO_COMMON.test(word)),
    ),
  ];
}

function shareOfStems(label, line) {
  const left = stems(label);
  const right = stems(line);
  if (!left.length || !right.length) return 0;
  const hits = left.filter((word) => right.some((other) => word === other || word.includes(other) || other.includes(word)));
  return hits.length / Math.min(left.length, right.length);
}

// A line that shares a third of a label's stems is answering that label. Below
// that the two are merely adjacent, which is normal: an authored line restates a
// decision rather than echoing its words, and five correct pairs in this graph
// share no surface word at all.
const CLEARLY_BETTER = 0.34;

// The two generated families. Their chips read "OFF THE RECORD" and "THE ROOM
// AFTER", which is player copy and free to change; the graph build marks what
// they are.
const generated = Object.entries(nodes).filter(([, node]) => node.kind === "connective" || node.kind === "reaction");
assert.ok(generated.length === 330, `expected 330 generated scenes, found ${generated.length}`);

const failures = [];
let checked = 0;

/**
 * The reply is a second list, and it can slip on its own.
 *
 * It was left unchecked on the grounds that the voice and the echo live in one
 * table entry, so a voice list in order meant an echo list in order. They are
 * two arrays, and editing one does not move the other. A reply argues from
 * what the choice gave up, so its words prove little -- but it nearly always
 * opens by taking the choice up ("사유를 물으면 ...", "열쇠를 받으면 ..."), and
 * that first sentence is what is read here, for the scene as a whole: the
 * replies fail when some other order of them answers the scene's labels
 * clearly better than the order they are in. Measured by swapping every pair
 * of replies in every scene, this catches a little over half of the swaps;
 * the rest are replies that do not repeat a word of their card.
 */
const REPLY_MARGIN = 0.5;
// Scenes whose replies are in order and read otherwise by their words.
// Reviewed by hand; an entry that stops being needed fails.
const REPLIES_READ_IN_ORDER = new Set([]);
const firstSentence = (text = "") => String(text).split(/(?<=[.!?])\s/)[0];
const orders = (count) => (count <= 1 ? [[0]] : orders(count - 1).flatMap((order) => Array.from({ length: count }, (_, at) => [...order.slice(0, at), count - 1, ...order.slice(at)])));
function shareOfWholeStems(label, line) {
  const left = stems(label);
  const right = stems(line);
  if (!left.length || !right.length) return 0;
  return left.filter((word) => right.some((other) => word.startsWith(other) || other.startsWith(word))).length / Math.min(left.length, right.length);
}
let repliesChecked = 0;
const repliesOutOfOrder = new Set();

for (const [nodeId, node] of generated) {
  const authored = (node.choices ?? []).filter((choice) => choice.type !== "reframe");
  {
    const asked = authored.map((choice) => `${choice.label} ${choiceVoiceLines[choice.id] ?? ""}`);
    const replies = authored.map((choice) => firstSentence(echoReplies[choice.id]));
    const score = (order) => asked.reduce((sum, label, index) => sum + shareOfWholeStems(label, replies[order[index]]), 0);
    const written = score(asked.map((_, index) => index));
    const better = orders(asked.length).find((order) => score(order) > written + REPLY_MARGIN);
    repliesChecked += replies.length;
    if (better) {
      repliesOutOfOrder.add(nodeId);
      if (!REPLIES_READ_IN_ORDER.has(nodeId)) {
        failures.push(
          `${nodeId}: the replies answer the labels better in the order [${better.map((index) => index + 1).join(", ")}] ` +
            `(${score(better).toFixed(2)} against ${written.toFixed(2)} as written). The echo list is matched to the labels by position -- ` +
            `check that it is still in the same order, and add the scene to REPLIES_READ_IN_ORDER if it is.`,
        );
      }
    }
  }
  // The voice line is the sentence the player is quoted as saying, so it has
  // to restate the button they pressed.
  {
    const kind = "voice";
    const lines = authored.map((choice) => choiceVoiceLines[choice.id] ?? "");
    authored.forEach((choice, index) => {
      checked += 1;
      const mine = shareOfStems(choice.label, lines[index]);
      if (mine >= CLEARLY_BETTER) return;
      lines.forEach((line, other) => {
        if (other === index) return;
        const theirs = shareOfStems(choice.label, line);
        if (theirs < CLEARLY_BETTER) return;
        failures.push(
          `${nodeId}[${index}] "${choice.label}" is answered by ${kind} "${lines[index]}" ` +
            `(${mine.toFixed(2)}), but the ${kind} on [${other}] answers it better: "${line}" (${theirs.toFixed(2)}). ` +
            `The copy table is matched to the labels by position -- check that the two lists are still in the same order.`,
        );
      });
    });
  }
}

for (const nodeId of REPLIES_READ_IN_ORDER) {
  if (!repliesOutOfOrder.has(nodeId)) failures.push(`${nodeId} reads in order now; take it off REPLIES_READ_IN_ORDER`);
}

assert.deepEqual(failures, [], `\n${failures.join("\n")}\n`);
console.log(`Dialogue alignment check passed (${checked} authored lines and ${repliesChecked} replies across ${generated.length} generated scenes).`);
