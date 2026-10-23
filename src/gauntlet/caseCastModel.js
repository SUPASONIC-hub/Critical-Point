import { CASE_SEQUENCE, nodeOrders, nodes, seasonCasesBase } from "../gameData.js";
import { getCharacterProfile } from "../gameDialogue.js";
import { getSpeakerPortrait } from "../speakerPortraits.js";

/**
 * Who is in the case file's cast (CaseCast.jsx, improvement notes D-8 and
 * B-6(2)). A module of its own so the unit tests can read it without JSX; only
 * CaseCast imports it, so the bundler writes it into that chunk.
 *
 * Only the people already met: the speakers of the scenes in the case's log
 * (`trail`) and of the scene on the table, never the case's later ones, which
 * would name who is coming. Those who speak in the most cases come first --
 * the season's fixed cast ahead of a case's own people -- and the rest in the
 * order they were met.
 */

/** Every case each speaker speaks in, in season order, over the cases that have arrived. */
function readSpeakerCases() {
  const cases = new Map();
  for (const caseId of CASE_SEQUENCE) {
    for (const nodeId of nodeOrders[caseId] ?? []) {
      const speaker = nodes[nodeId]?.speaker;
      if (!speaker) continue;
      const seen = cases.get(speaker) ?? [];
      if (seen.at(-1) !== caseId) seen.push(caseId);
      cases.set(speaker, seen);
    }
  }
  return cases;
}

const caseLabel = (caseId) => seasonCasesBase.find((caseItem) => caseItem.id === caseId)?.label ?? caseId;

/**
 * The cards: a name, the portrait's path (null draws the silhouette), the post
 * held in this case (`characterRoleSpans`), the one line of what they think,
 * the label of the case they first spoke in, and whether they speak now.
 */
export function getCaseCast({ node = {}, trail = [] } = {}) {
  const speakerCases = readSpeakerCases();
  const met = [...new Set([...trail.map((entry) => entry.speaker), node.speaker].filter(Boolean))];
  return met
    .map((name, order) => ({ name, order, cases: speakerCases.get(name) ?? [node.caseId] }))
    .sort((a, b) => b.cases.length - a.cases.length || a.order - b.order)
    .map(({ name, cases }) => {
      const profile = getCharacterProfile(name, node.caseId);
      return {
        name,
        portrait: getSpeakerPortrait(name),
        role: profile?.role ?? "",
        thought: profile?.thought ?? "",
        firstCase: caseLabel(cases[0]),
        speaking: name === node.speaker,
      };
    });
}
