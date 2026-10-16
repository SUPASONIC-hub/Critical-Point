/**
 * Card-label length check.
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
 * The ceiling is a ratchet. `MAX_LABEL` is the length a label may reach, and
 * `OVER_CEILING` is how many were already longer on the day the check was
 * written (2026-10-13). Those are story to shorten by its author, not a script
 * to fix, so the count is held as a ceiling that only comes down: the check
 * fails when the count rises -- a new label over `MAX_LABEL`, or an old one
 * grown past it -- and prints every label over it, longest first.
 * `LONGEST_LABEL` holds the longest of them the same way, so one of the
 * allowed ones cannot grow either. A count cannot tell a new long label from
 * an old one when another was shortened in the same change; `--list` prints
 * them all to read.
 *
 *   node scripts/check-card-labels.mjs          the check
 *   node scripts/check-card-labels.mjs --list   every label over MAX_LABEL
 */
import { readdirSync, readFileSync } from "node:fs";
import { CASE_SEQUENCE, continuityMemoryChoicePlans, nodes } from "../src/gameData.js";

const MAX_LABEL = 30;
const OVER_CEILING = 727;
const LONGEST_LABEL = 40;

// The lengths the distribution is reported at; MAX_LABEL is one of them.
const MARKS = [24, 28, 30, 32, 36];

export const labelLength = (label) => [...String(label ?? "").trim().replace(/\s+/g, " ")].length;

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

// --- the distribution --------------------------------------------------------

const lengths = cards.map((card) => card.length).sort((a, b) => a - b);
const at = (share) => lengths[Math.min(lengths.length - 1, Math.max(0, Math.ceil(lengths.length * share) - 1))];
const overMark = (mark) => lengths.filter((length) => length > mark).length;
const distribution =
  `min ${lengths[0]}, median ${at(0.5)}, p90 ${at(0.9)}, p99 ${at(0.99)}, max ${lengths.at(-1)}; ` +
  MARKS.map((mark) => `${overMark(mark)} over ${mark}`).join(", ");

const over = cards.filter((card) => card.length > MAX_LABEL).sort((a, b) => b.length - a.length || a.where.localeCompare(b.where));
const describe = (card) => `${writtenAt(card)}: ${card.length} characters, ${card.length - MAX_LABEL} over ${MAX_LABEL} (${card.caseId}, ${card.kind} card ${card.where}): "${card.label}"`;

if (process.argv.includes("--list")) {
  for (const card of over) console.log(describe(card));
  const tally = (key) => {
    const counts = new Map();
    for (const card of over) counts.set(card[key], (counts.get(card[key]) ?? 0) + 1);
    return counts;
  };
  const byKind = tally("kind");
  const byCase = tally("caseId");
  const dealt = (key, value) => cards.filter((card) => card[key] === value).length;
  console.log(`\nOver ${MAX_LABEL} by kind: ${[...byKind].map(([kind, count]) => `${kind} ${count} of ${dealt("kind", kind)}`).join(", ")}`);
  console.log(`Over ${MAX_LABEL} by case: ${CASE_SEQUENCE.map((caseId) => `${caseId} ${byCase.get(caseId) ?? 0}/${dealt("caseId", caseId)}`).join(", ")}`);
}

if (over.length > OVER_CEILING) {
  for (const card of over) failures.push(describe(card));
  failures.push(`${over.length} card labels are longer than ${MAX_LABEL} characters, over the ${OVER_CEILING} allowed: shorten the new one (the list above is longest first; \`git diff\` says which is new)`);
}
if (lengths.at(-1) > LONGEST_LABEL) {
  for (const card of over.filter((entry) => entry.length > LONGEST_LABEL)) failures.push(`${writtenAt(card)}: ${card.length} characters, longer than the longest label allowed (${LONGEST_LABEL}): "${card.label}"`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  console.error(`\nCard-label check failed (${cards.length} labels: ${distribution}).`);
  process.exitCode = 1;
} else {
  console.log(
    `Card-label check passed (${cards.length.toLocaleString("en-US")} labels across ${CASE_SEQUENCE.length} cases: ${distribution}; ` +
      `${over.length} of the ${OVER_CEILING} allowed are longer than ${MAX_LABEL}, the longest ${lengths.at(-1)} of the ${LONGEST_LABEL} allowed).`,
  );
  if (over.length < OVER_CEILING) console.log(`Fewer labels are over ${MAX_LABEL} now; take OVER_CEILING down to ${over.length}.`);
  if (lengths.at(-1) < LONGEST_LABEL) console.log(`The longest label is shorter now; take LONGEST_LABEL down to ${lengths.at(-1)}.`);
}
