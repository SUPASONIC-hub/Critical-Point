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

import { nodes, choiceVoiceLines } from "../src/gameData.js";

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

const generated = Object.entries(nodes).filter(
  ([, node]) => node.phase === "CONNECTIVE SCENE" || node.phase === "REACTION",
);
assert.ok(generated.length === 36, `expected 36 generated scenes, found ${generated.length}`);

const failures = [];
let checked = 0;

for (const [nodeId, node] of generated) {
  const authored = (node.choices ?? []).filter((choice) => choice.type !== "free");
  // Only the voice line is checked. It is the sentence the player is quoted as
  // saying, so it has to restate the button they pressed. The echo is the reply
  // that pushes back on it, and a good one argues from what the choice gave up
  // -- often the sibling choice's own subject -- so overlap proves nothing
  // there. Both arrays live in the same table entry, so a voice list that is
  // still in order is an echo list that is still in order too.
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

assert.deepEqual(failures, [], `\n${failures.join("\n")}\n`);
console.log(`Dialogue alignment check passed (${checked} authored lines across ${generated.length} generated scenes).`);
