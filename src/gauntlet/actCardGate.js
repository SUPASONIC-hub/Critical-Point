import { readStoredValue, writeStoredValue } from "../appConfig.js";
import { opensCase } from "./tableStaging.js";

/**
 * B-11(1), the act title card (막 표지): whether the page a case opens on is
 * first covered by its act's card. The card itself is a chunk of its own
 * (ActCardFold.jsx fetches ActCard.jsx): its copy is not the PlayScreen chunk's.
 *
 * Display only. Nothing here is in the save, the log, the table or the
 * ranking: what a device has been shown is one storage key of its own, the
 * run's id and the acts it has seen, and a reset or a new season is a new run
 * id, so a NEW GAME+ season is shown its acts again.
 *
 * Shown on the case's opening page, before the relic draft and the briefing
 * (the briefing's reading clock starts when the briefing mounts, so it waits),
 * only to a run that played its way there: a debug jump or a replay link opens
 * a fresh table (`windowIndex` 0), and a table put down mid-bet comes back as
 * it stood. A case whose card was shown -- dismissed or run out -- is not
 * shown it again in the same run, after a reload or a resume either.
 */
export const ACT_CARD_KEY = "critical-point-act-cards-v1";
export const ACT_START_CASES = Object.freeze(["case01", "case08", "case13", "case19", "case25", "case31", "case37", "case43"]);

function readShown(runId) {
  try {
    const kept = JSON.parse(readStoredValue(ACT_CARD_KEY, "null"));
    return kept?.run === runId && Array.isArray(kept.acts) ? kept.acts : [];
  } catch {
    return [];
  }
}

/** The run id a window's seed was dealt under (`${runId}:${windowIndex}:${nodeId}`, useRunReadout). */
export const runOfSeed = (seed) => String(seed ?? "").split(":")[0];

/** The case whose act card this window opens on, or null. */
export function getActCard({ node, nodeId, windowIndex = 0, resumed = false, runId }) {
  const caseId = node?.caseId;
  if (resumed || !(windowIndex > 0) || !runId || !ACT_START_CASES.includes(caseId) || !opensCase(node, nodeId)) return null;
  return readShown(runId).includes(caseId) ? null : caseId;
}

export function markActCardShown(runId, caseId) {
  writeStoredValue(ACT_CARD_KEY, JSON.stringify({ run: runId, acts: [...new Set([...readShown(runId), caseId])] }));
}
