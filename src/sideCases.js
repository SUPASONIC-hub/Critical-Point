/**
 * E-11 번외 사건: what the start screen needs to know about the side cases, in
 * the entry chunk and small. The side run itself -- the table, the record
 * writes -- is state/sideRun.js, in the runtime's chunk, and the screen that
 * plays it is screens/SideCaseScreen.jsx, a chunk of its own.
 *
 * What a side case never touches (E11-번외사건-설계안 4절): the season save,
 * NEW GAME+ and its memory, the season record, the past picks, the local
 * ranking, the settled-window log, the telemetry queue and the online save. It
 * keeps one key of its own, `SIDE_CASES_KEY`, on this device only:
 *
 *   { "side01": { "closedAt": "2026-12-..", "outcomeChoiceId": "s1_after_warm", "inProgress": null } }
 *
 * `inProgress` is the run under way (`{ nodeId, resources, log, run }`), or null.
 */
import { readStoredValue, SIDE_CASES_KEY } from "./appConfig.js";
import { SIDE_CASES } from "./nodes/sidePacks.js";

export { SIDE_CASES, SIDE_CASES_KEY };

/** A side case's id: `side` and two digits. Never `caseNN`, which the server reads as a season case. */
export const SIDE_CASE_ID_PATTERN = /^side\d{2}$/;

export function isSideCaseId(caseId) {
  return typeof caseId === "string" && SIDE_CASE_ID_PATTERN.test(caseId);
}

/**
 * Whether this device has closed a finale: the condition NEW GAME+ opens on
 * (useNewGamePlus), and the one the side slot opens on (설계안 질문 2 (1)).
 */
export function isSideSlotOpen({ newGamePlusUnlocked = false, caseResults = null } = {}) {
  return newGamePlusUnlocked === true || Boolean(caseResults?.final);
}

const isRecord = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);

/** The record as this build reads it: side ids only, each with its three fields. */
export function normalizeSideRecord(value) {
  if (!isRecord(value)) return {};
  return Object.fromEntries(
    Object.entries(value)
      .filter(([caseId, entry]) => isSideCaseId(caseId) && isRecord(entry))
      .map(([caseId, entry]) => [
        caseId,
        {
          closedAt: typeof entry.closedAt === "string" && entry.closedAt ? entry.closedAt : null,
          outcomeChoiceId: typeof entry.outcomeChoiceId === "string" && entry.outcomeChoiceId ? entry.outcomeChoiceId : null,
          inProgress: isRecord(entry.inProgress) ? entry.inProgress : null,
        },
      ]),
  );
}

export function readSideRecord() {
  try {
    return normalizeSideRecord(JSON.parse(readStoredValue(SIDE_CASES_KEY, "null")));
  } catch {
    return {};
  }
}

/**
 * The start screen's slot, or null when there is none to show: the device has
 * not closed a finale, or no side case is written yet. Each case says whether
 * it was closed and whether a run of it is under way, and `book` is the line
 * the 결말 도감 keeps for side cases apart from the season's (설계안 질문 5 (1)).
 */
export function getSideSlot({ newGamePlusUnlocked = false, caseResults = null, cases = SIDE_CASES, record = null } = {}) {
  if (!cases.length || !isSideSlotOpen({ newGamePlusUnlocked, caseResults })) return null;
  const marks = record ?? readSideRecord();
  const rows = cases.map(({ id, label, title }) => ({
    id,
    label,
    title,
    closed: Boolean(marks[id]?.closedAt),
    resumable: Boolean(marks[id]?.inProgress),
  }));
  return { cases: rows, book: `번외 ${rows.filter((row) => row.closed).length}/${rows.length}` };
}
