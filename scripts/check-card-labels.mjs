/**
 * Card-label and scene-text length check.
 *
 * A card's label is read on a phone in a card about 165px wide, where
 * `play.css` gives it three lines of 13px type before it is cut
 * (`.gx-card-label`, `-webkit-line-clamp: 3` under 720px). A label has no
 * other limit: the scenes are written in `src/nodes/*.js` with nothing
 * counting them, and a hand whose labels wrap a line or two more than the rest
 * is what ends under the action bar on a 360x740 phone (issue #100).
 *
 * How a label is counted: the characters a reader sees, one each. The label is
 * trimmed and a run of white space is one space; then every character counts
 * one, Hangul, digit, Latin letter, space and punctuation alike. A space or a
 * comma is narrower than a syllable, but with `word-break: keep-all` a line
 * breaks only at a space and its ragged end costs about what the narrow
 * characters save, so the plain count is the one that can be checked by eye
 * and by `"…".length` in an editor.
 *
 * What is measured: every label a scene deals (`nodes[*].choices`), 판을 다시
 * 짠다 among them, and the three memory cards each case's pack writes for an
 * opening (`memoryPlan`), which the runtime deals under a written label. Not
 * measured: the two labels `GameRuntime.jsx` writes itself (관계의 증언,
 * 판 공개 기준), which are 15 and 22 characters and are not story.
 *
 * `MAX_LABEL` is the length a label may reach, and any label longer fails the
 * check, printed with where it is written. It began as a ratchet: 725 labels
 * were longer on the day the check was written (2026-10-13), held as a ceiling
 * that only came down (626 on 2026-10-22, when every prologue label went to
 * 22-28), until A-3 brought every one to 30 or under on 2026-10-25 and the
 * ceiling, its longest-label twin and the `--list` tally went with it.
 *
 * A scene's body (`text`) is the narration a phone reads in the briefing
 * boxes, and the reading clock grows with every character of it. It is counted
 * like a label, `MAX_TEXT` is 420 characters, and any body longer fails the
 * check, printed with where it is written. It too began as a ratchet (A-13 of
 * the 2026-10-22 review): 133 bodies were longer that day, the longest case
 * 45's `c45_stories` at 702, a count and a longest length that only came down
 * (114 on 2026-10-23, 74 and 476 after the first A-13 bundle on 2026-10-25)
 * until the second A-13 bundle brought the last 73 to 420 or under the same
 * day, and the ceiling, its longest-body twin and `--texts` went with them.
 * The `lead` above the body is not counted: it is one line, written to be
 * read first. The check lives here, not in a script of its own, because it is
 * the same count over the same graph.
 *
 *   node scripts/check-card-labels.mjs
 */
import { readdirSync, readFileSync } from "node:fs";
import { CASE_SEQUENCE, continuityMemoryChoicePlans, nodes } from "../src/gameData.js";

const MAX_LABEL = 30;

const MAX_TEXT = 420;

// The lengths the distribution is reported at; MAX_LABEL is one of them.
const MARKS = [24, 28, 30, 32, 36];

const labelLength = (label) => [...String(label ?? "").trim().replace(/\s+/g, " ")].length;

/** What kind of card carries the label, by how it reaches the hand. */
function kindOf(scene, choice) {
  if (choice.type === "reframe") return "wild";
  if (choice.id.endsWith("_evidence_turn")) return "evidence entry";
  if (scene.kind === "connective" || scene.kind === "reaction") return scene.kind;
  return "written";
}

const cards = [];
for (const [sceneId, scene] of Object.entries(nodes)) {
  for (const choice of scene.choices ?? []) {
    cards.push({ caseId: scene.caseId, where: `${sceneId}/${choice.id}`, kind: kindOf(scene, choice), label: choice.label });
  }
}
for (const [caseId, plan] of Object.entries(continuityMemoryChoicePlans)) {
  for (const key of ["evidenceLabel", "systemLabel", "routeLabel"]) {
    if (plan[key]) cards.push({ caseId, where: `${caseId}/memoryPlan.${key}`, kind: "memory", label: plan[key] });
  }
}

const failures = [];
if (cards.length === 0) failures.push("the scene graph deals no card; no label was measured");
for (const card of cards) {
  if (typeof card.label !== "string" || !card.label.trim()) failures.push(`${card.where} has no label`);
  card.length = labelLength(card.label);
}

// --- where a label is written ------------------------------------------------

const sources = readdirSync("src/nodes")
  .filter((name) => name.endsWith(".js"))
  .sort()
  .map((name) => ({ file: `src/nodes/${name}`, text: readFileSync(`src/nodes/${name}`, "utf8") }));

/** `file:line` of the label's text, or the card's id when no case file writes it whole. */
function writtenAt(card) {
  for (const { file, text } of sources) {
    const index = text.indexOf(`"${card.label}"`);
    if (index >= 0) return `${file}:${text.slice(0, index).split("\n").length}`;
  }
  return card.where;
}

// --- scene bodies ------------------------------------------------------------

const texts = Object.entries(nodes)
  .map(([sceneId, scene]) => ({ sceneId, caseId: scene.caseId, kind: scene.kind, text: scene.text, length: labelLength(scene.text) }))
  .sort((a, b) => b.length - a.length || a.sceneId.localeCompare(b.sceneId));
if (texts.length === 0) failures.push("the scene graph has no scene; no body was measured");
const longTexts = texts.filter((entry) => entry.length > MAX_TEXT);

/** `file:line` where the body is written, found by its opening words. */
function textWrittenAt(entry) {
  const opening = String(entry.text ?? "").slice(0, 24);
  for (const { file, text } of sources) {
    const index = opening ? text.indexOf(opening) : -1;
    if (index >= 0) return `${file}:${text.slice(0, index).split("\n").length}`;
  }
  return entry.sceneId;
}
const describeText = (entry) => `${textWrittenAt(entry)}: ${entry.length} characters, ${entry.length - MAX_TEXT} over ${MAX_TEXT} (${entry.caseId}, ${entry.kind} ${entry.sceneId})`;
for (const entry of longTexts) failures.push(describeText(entry));
if (longTexts.length) failures.push(`${longTexts.length} scene bod${longTexts.length === 1 ? "y is" : "ies are"} longer than ${MAX_TEXT} characters: split the scene or move a line to its memo (the list above is longest first)`);

// --- the distribution --------------------------------------------------------

const lengths = cards.map((card) => card.length).sort((a, b) => a - b);
const at = (share) => lengths[Math.min(lengths.length - 1, Math.max(0, Math.ceil(lengths.length * share) - 1))];
const overMark = (mark) => lengths.filter((length) => length > mark).length;
const distribution =
  `min ${lengths[0]}, median ${at(0.5)}, p90 ${at(0.9)}, p99 ${at(0.99)}, max ${lengths.at(-1)}; ` +
  MARKS.map((mark) => `${overMark(mark)} over ${mark}`).join(", ");

const over = cards.filter((card) => card.length > MAX_LABEL).sort((a, b) => b.length - a.length || a.where.localeCompare(b.where));
const describe = (card) => `${writtenAt(card)}: ${card.length} characters, ${card.length - MAX_LABEL} over ${MAX_LABEL} (${card.caseId}, ${card.kind} card ${card.where}): "${card.label}"`;

for (const card of over) failures.push(describe(card));
if (over.length) failures.push(`${over.length} card label${over.length === 1 ? " is" : "s are"} longer than ${MAX_LABEL} characters: shorten ${over.length === 1 ? "it" : "them"} (move the reason to the card's voice)`);

if (failures.length) {
  console.error(failures.join("\n"));
  console.error(`\nCard-label check failed (${cards.length} labels: ${distribution}).`);
  process.exitCode = 1;
} else {
  console.log(
    `Card-label check passed (${cards.length.toLocaleString("en-US")} labels across ${CASE_SEQUENCE.length} cases: ${distribution}; ` +
      `none longer than ${MAX_LABEL}).`,
  );
  console.log(`Scene bodies: ${texts.length.toLocaleString("en-US")}, none longer than ${MAX_TEXT} characters (the longest ${texts[0]?.length}).`);
}
