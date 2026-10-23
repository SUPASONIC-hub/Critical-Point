/**
 * Which briefing balloons to read by eye (A-2 = D-2, 2026-10-23).
 *
 * The balloon beside the portrait is the first speech the narration hands to
 * the scene's speaker (src/gauntlet/speakerLine.js: a speech is given to the
 * speaker the narration last named before it). Nothing in the data says who
 * speaks a line, so this lists the scenes where that guess is weakest:
 *
 *   far     the speaker was last named two sentences or more before the speech;
 *           a "그가" or another person in between may have taken the line.
 *   lead    no speech of theirs: the balloon shows the lead, as a caption.
 *   none    neither: no balloon, only 「당신의 판단」.
 *
 * It reports and never fails. `--all` prints every row of each list.
 */
import { nodes } from "../src/gameData.js";
import { captionSentences, getSpeakerLine } from "../src/gauntlet/speakerLine.js";
import { SPEAKER_NAMES } from "../src/speakerPortraits.js";

const all = process.argv.includes("--all");
const scenes = Object.entries(nodes).filter(([, node]) => node.speaker && node.text);
const lists = { far: [], lead: [], none: [] };

for (const [id, node] of scenes) {
  const { line, fromLead } = getSpeakerLine(node, SPEAKER_NAMES);
  if (fromLead) lists.lead.push(`${id} (${node.speaker})`);
  else if (!line) lists.none.push(`${id} (${node.speaker})`);
  else {
    const at = node.text.indexOf(line);
    const named = node.text.lastIndexOf(node.speaker, at);
    // The sentence that names them, then the speech: one break is the usual "오진우가 말합니다. '…'".
    if (captionSentences(node.text.slice(named, at)).length > 2) lists.far.push(`${id} (${node.speaker}): ${line.slice(0, 40)}`);
  }
}

const total = scenes.length;
console.log(`speaker lines: ${total} scenes, balloon from speech ${total - lists.lead.length - lists.none.length}, from lead ${lists.lead.length}, none ${lists.none.length}`);
for (const [name, rows] of Object.entries(lists)) {
  console.log(`\n${name}: ${rows.length}`);
  for (const row of all ? rows : rows.slice(0, 20)) console.log(`  ${row}`);
  if (!all && rows.length > 20) console.log(`  … ${rows.length - 20} more (--all)`);
}
