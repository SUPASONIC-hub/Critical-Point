/**
 * `npm run check:mood`: the generated scene moods (src/sceneMoods.js, from
 * scripts/tag-mood.mjs) held to the graph.
 *
 *   - every id in SCENE_MOODS is a scene the graph has;
 *   - every value is one of MOODS, and never "neutral" (neutral is omitted, so
 *     a written one is a hand edit the generator would drop);
 *   - no case has more than 70% of its scenes in one non-neutral mood -- the
 *     smell of a word list that fired on the whole case (CASE_SHARE_CAP in
 *     tag-mood.mjs; a case a reviewer read as one colour gets its own share
 *     in CASE_CAP_OVERRIDES there, which both read through caseShareCap).
 *
 * Exports `findMoodFailures` for the unit test; exits 1 on any failure.
 */
import { pathToFileURL } from "node:url";
import { CASE_SEQUENCE, nodeOrders, nodes } from "../src/gameData.js";
import { MOODS, SCENE_MOODS } from "../src/sceneMoods.js";
import { MOODS as GENERATOR_MOODS, caseShareCap } from "./tag-mood.mjs";

const KNOWN = ["neutral", "bright", "tense", "dread", "sorrow"];

export function findMoodFailures({ moods = SCENE_MOODS, graph = nodes, orders = nodeOrders, cap = caseShareCap } = {}) {
  const failures = [];
  if (JSON.stringify(MOODS) !== JSON.stringify(KNOWN)) failures.push(`MOODS is ${JSON.stringify(MOODS)}; expected ${JSON.stringify(KNOWN)}`);
  if (JSON.stringify(GENERATOR_MOODS) !== JSON.stringify(KNOWN)) failures.push(`tag-mood.mjs MOODS is ${JSON.stringify(GENERATOR_MOODS)}; expected ${JSON.stringify(KNOWN)}`);
  for (const [id, mood] of Object.entries(moods)) {
    if (!graph[id]) failures.push(`${id}: not a scene in the graph`);
    if (!KNOWN.includes(mood)) failures.push(`${id}: unknown mood "${mood}"`);
    else if (mood === "neutral") failures.push(`${id}: neutral is omitted from SCENE_MOODS, not written`);
  }
  for (const caseId of CASE_SEQUENCE) {
    const order = orders[caseId] ?? [];
    if (!order.length) continue;
    const counts = {};
    for (const id of order) {
      const mood = moods[id];
      if (mood && mood !== "neutral") counts[mood] = (counts[mood] ?? 0) + 1;
    }
    for (const [mood, count] of Object.entries(counts)) {
      const share = typeof cap === "function" ? cap(caseId) : cap;
      if (count / order.length > share) failures.push(`${caseId}: ${count} of ${order.length} scenes are ${mood} (over ${Math.round(share * 100)}%)`);
    }
  }
  return failures;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const failures = findMoodFailures();
  const tagged = Object.keys(SCENE_MOODS).length;
  const total = Object.values(nodeOrders).flat().length;
  if (failures.length) {
    console.error(`check:mood: ${failures.length} failure(s)\n  ${failures.join("\n  ")}`);
    process.exit(1);
  }
  const counts = {};
  for (const mood of Object.values(SCENE_MOODS)) counts[mood] = (counts[mood] ?? 0) + 1;
  console.log(
    `check:mood OK -- ${tagged} of ${total} scenes tagged (${Object.entries(counts)
      .map(([mood, count]) => `${mood} ${count}`)
      .join(", ")}), ${total - tagged} neutral`,
  );
}
