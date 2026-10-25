/**
 * E-11 번외 사건 in the online save (설계안 질문 5 (1)): the completion marks
 * of `SIDE_CASES_KEY` ride beside the season's device records (cloudSave.js
 * `readDeviceRecords`, E-12), and a restored copy's marks meet this device's
 * record here (state/cloudDeviceRecords.js). Apart from src/sideCases.js so
 * the start screen's chunk does not carry them: only the online save's
 * chunks do.
 */
import { normalizeSideRecord } from "../sideCases.js";

/**
 * The completion marks the online save carries: each closed case, when and
 * with which ending. A case not yet closed, and every run in progress, is left
 * out -- a side run is fifteen minutes on one device, and its table is not
 * the season's to carry. Null when nothing is closed.
 */
export function sideCaseMarks(value) {
  const marks = Object.entries(normalizeSideRecord(value))
    .filter(([, entry]) => entry.closedAt)
    .map(([caseId, { closedAt, outcomeChoiceId }]) => [caseId, { closedAt, outcomeChoiceId }]);
  return marks.length ? Object.fromEntries(marks) : null;
}

const closedTime = (entry) => {
  const time = Date.parse(entry?.closedAt ?? "");
  return Number.isFinite(time) ? time : -Infinity;
};

/**
 * A restored copy's marks merged into this device's record. A closed case
 * stays closed; when both copies closed it, the later close is kept (the
 * ending the player last chose), the copy being loaded on a tie. This
 * device's runs in progress are kept as they are.
 */
export function mergeSideMarks(localValue, remoteValue) {
  const local = normalizeSideRecord(localValue);
  const merged = { ...local };
  for (const [caseId, mark] of Object.entries(sideCaseMarks(remoteValue) ?? {})) {
    const own = local[caseId];
    if (own?.closedAt && closedTime(own) > closedTime(mark)) continue;
    merged[caseId] = { ...mark, inProgress: own?.inProgress ?? null };
  }
  return merged;
}
