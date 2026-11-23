/**
 * E-11 번외 사건: what the start screen needs to know about the side cases, in
 * the entry chunk and small. The side run itself -- the table, the record
 * writes -- is state/sideRun.js, in the runtime's chunk, and the screen that
 * plays it is screens/SideCaseScreen.jsx, a chunk of its own.
 *
 * What a side case never touches (E11-번외사건-설계안 4절): the season save,
 * NEW GAME+ and its memory, the season record, the past picks, the local
 * ranking, the settled-window log and the telemetry queue. It keeps one key of
 * its own, `SIDE_CASES_KEY`:
 *
 *   { "side01": { "closedAt": "2026-12-..", "outcomeChoiceId": "s1_after_warm", "inProgress": null } }
 *
 * `inProgress` is the run under way (`{ nodeId, resources, log, run }`), or null.
 *
 * The online save (cloudSave.js) carries the completion marks of that key and
 * no more (설계안 질문 5 (1), the PR after the framework; state/sideMarks.js).
 * A run in progress stays on the device it was played on.
 */
import { readStoredValue, SIDE_CASES_KEY } from "./appConfig.js";
import introCopy from "./copy/intro.js";
import { fill } from "./locale.js";
import { NEXT_SEASON, SIDE_CASES } from "./nodes/sidePacks.js";
import { weeklyRuleNow } from "./state/weeklyClock.js";

export { NEXT_SEASON, SIDE_CASES, SIDE_CASES_KEY };

/** A side case's id: `side` and two digits. Never `caseNN`, which the server reads as a season case. */
export const SIDE_CASE_ID_PATTERN = /^side\d{2}$/;

export function isSideCaseId(caseId) {
  return typeof caseId === "string" && SIDE_CASE_ID_PATTERN.test(caseId);
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * The side cases a release has opened by `ms` (the weekly clock): every entry
 * without `opensAt`, and those whose Season has begun (NEXT_SEASON,
 * src/nodes/sidePacks.js). The start screen's slot, the report's 「번외 사건이
 * 열렸습니다」 line and 「지난번 이후」 read this list; SIDE_CASES itself stays
 * whole for check:case and report:season-ready.
 */
export function releasedSides(cases = SIDE_CASES, ms = weeklyRuleNow()) {
  return cases.filter((sideCase) => !Number.isFinite(sideCase?.opensAt) || Number(ms) >= sideCase.opensAt);
}

/**
 * The start screen's Season line at `ms`, or null: from `noticeDays` before
 * the Season opens to the end of its first day, and only while some side case
 * names it. `{ count, today }` -- `today` once it has opened.
 */
export function seasonNoticeAt(ms = weeklyRuleNow(), { season = NEXT_SEASON, cases = SIDE_CASES } = {}) {
  const at = Number(ms);
  const count = cases.filter((sideCase) => sideCase?.opensAt === season.opensAt).length;
  if (!count || !Number.isFinite(at)) return null;
  if (at < season.opensAt - season.noticeDays * DAY_MS || at >= season.opensAt + DAY_MS) return null;
  return { count, today: at >= season.opensAt };
}

/**
 * Whether this device has closed a finale: the condition NEW GAME+ opens on
 * (useNewGamePlus). A device that has opens every side case, as it always did.
 */
export function isSideSlotOpen({ newGamePlusUnlocked = false, caseResults = null } = {}) {
  return newGamePlusUnlocked === true || Boolean(caseResults?.final);
}

/**
 * Whether one side case is open (2026-11-18 「현재 준비된 번외 스토리 전부
 * 공개, 스토리 흐름 순서에 맞게」): once the season case it follows in the
 * story (`unlockAfter`, src/nodes/sidePacks.js) is closed in this run, once a
 * finale is closed on this device (NEW GAME+), or once the side case itself is
 * in this device's side record (played in an earlier run).
 */
export function isSideCaseOpen(sideCase, { newGamePlusUnlocked = false, caseResults = null, record = {} } = {}) {
  if (!sideCase) return false;
  if (isSideSlotOpen({ newGamePlusUnlocked, caseResults })) return true;
  if (record?.[sideCase.id]) return true;
  return Boolean(sideCase.unlockAfter) && Boolean(caseResults?.[sideCase.unlockAfter]);
}

// A side case asked for from a case report: the start screen opens it when it
// mounts (IntroScreen reads it with peekRequestedSideCase, a pure read for its
// state's first value, and clears it with requestSideCase(null) after mounting).
let requestedSideCase = null;
export function requestSideCase(caseId) {
  requestedSideCase = isSideCaseId(caseId) ? caseId : null;
}
export function peekRequestedSideCase() {
  return requestedSideCase;
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
 * The start screen's slot, or null when there is none to show: no side case
 * is open on this device yet (isSideCaseOpen), or none is written. Each open
 * case says whether it was closed and whether a run of it is under way, and
 * `book` is the line the 결말 도감 keeps for side cases apart from the
 * season's (설계안 질문 5 (1)): the cases closed, of all those written.
 */
export function getSideSlot({ newGamePlusUnlocked = false, caseResults = null, cases = releasedSides(), record = null } = {}) {
  if (!cases.length) return null;
  const marks = record ?? readSideRecord();
  const rows = cases
    .filter((sideCase) => isSideCaseOpen(sideCase, { newGamePlusUnlocked, caseResults, record: marks }))
    .map(({ id, label, title }) => ({
      id,
      label,
      title,
      closed: Boolean(marks[id]?.closedAt),
      resumable: Boolean(marks[id]?.inProgress),
    }));
  if (!rows.length) return null;
  const closed = cases.filter(({ id }) => marks[id]?.closedAt).length;
  return { cases: rows, book: fill(introCopy.sideSlot.book, { closed, total: cases.length }) };
}
