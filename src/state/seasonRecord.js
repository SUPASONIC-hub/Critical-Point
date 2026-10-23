/**
 * The season record (NEW GAME+): how many seasons this device finished, how
 * the last two ended, and which endings and rulings it has seen (E-3 결말 도감,
 * endingBook.js), in a device key of its own outside the save, made safe to
 * read. The start screen reads only the season number, the last ending and the
 * book's stored lines (appConfig.js, advancedSystems.getPastRunMemory), so this
 * reader stays out of the entry chunk; newGamePlusCarry.js writes the record.
 */
import { getSeasonRound, readStoredSeasonRecord, SEASON_RECORD_KEY } from "../appConfig.js";

// The key and the season number are appConfig's, where the start screen reads them.
export { getSeasonRound, SEASON_RECORD_KEY };

/**
 * How many runs the record remembers having counted. A finale is closed again
 * whenever it is replayed (`onSeasonFinal`), and only the run it belongs to
 * can replay it, so a handful is plenty.
 */
const COUNTED_RUNS_KEPT = 8;

/**
 * The ruling's short name, which the intro shows. Written into the record so
 * the entry chunk never needs the verdict table to read it.
 */
export const VERDICT_NAMES = Object.freeze({
  ending_seal: "봉인",
  ending_reform: "개혁",
  ending_expose: "폭로",
  collapse: "붕괴",
  open: "열린 판결",
});

const EMPTY_RECORD = Object.freeze({
  seasons: 0,
  countedRuns: Object.freeze([]),
  last: null,
  previous: null,
  endingsSeen: Object.freeze([]),
  verdictsSeen: Object.freeze([]),
  endingBook: null,
});

/** How many ids a seen list keeps: the book has nine endings and five verdict keys. */
const SEEN_KEPT = 16;
const BOOK_HINTS_KEPT = 16;

export function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/** One season's ending as the record keeps it, or null for anything that is not one. */
export function normalizeLast(value) {
  if (!isPlainObject(value) || typeof value.endingId !== "string" || !value.endingId) return null;
  const verdict = Object.hasOwn(VERDICT_NAMES, value.verdict ?? "") ? value.verdict : null;
  return {
    runId: typeof value.runId === "string" ? value.runId : null,
    endingId: value.endingId,
    endingLabel: typeof value.endingLabel === "string" ? value.endingLabel : "",
    verdict,
    verdictName: verdict ? VERDICT_NAMES[verdict] : null,
    tableRules: Number.isInteger(value.tableRules) ? value.tableRules : null,
    // The start screen's sentence for this season (newGamePlusCarry.getMemoryLine).
    line: typeof value.line === "string" ? value.line : null,
  };
}

/**
 * A seen list (E-3 결말 도감) made safe to read, with the endings `last` and
 * `previous` name added: a record written before the lists existed has seen
 * at least those two (endingBook.js).
 */
function normalizeSeen(value, also) {
  const listed = Array.isArray(value) ? value.filter((id) => typeof id === "string" && id) : [];
  return [...new Set([...listed, ...also.filter(Boolean)])].slice(0, SEEN_KEPT);
}

/** The book's stored lines (endingBook.getEndingBook), or null for anything that is not them. */
export function normalizeEndingBook(value) {
  if (!isPlainObject(value) || typeof value.head !== "string" || !value.head) return null;
  const hints = Array.isArray(value.hints) ? value.hints.filter((line) => typeof line === "string" && line).slice(0, BOOK_HINTS_KEPT) : [];
  return { head: value.head, hints };
}

/**
 * The record as stored, or as a string read from storage, made safe to read:
 * an unreadable or missing record is an empty one.
 */
export function normalizeSeasonRecord(value) {
  let record = value;
  if (typeof record === "string") {
    try {
      record = JSON.parse(record);
    } catch {
      record = null;
    }
  }
  if (!isPlainObject(record)) return EMPTY_RECORD;
  const seasons = Number.isInteger(record.seasons) && record.seasons > 0 ? record.seasons : 0;
  const countedRuns = Array.isArray(record.countedRuns)
    ? record.countedRuns.filter((runId) => typeof runId === "string" && runId).slice(-COUNTED_RUNS_KEPT)
    : [];
  const last = normalizeLast(record.last);
  const previous = normalizeLast(record.previous);
  return {
    seasons,
    countedRuns,
    last,
    previous,
    endingsSeen: normalizeSeen(record.endingsSeen, [last?.endingId, previous?.endingId]),
    verdictsSeen: normalizeSeen(record.verdictsSeen, [last?.verdict, previous?.verdict]).filter((verdict) => Object.hasOwn(VERDICT_NAMES, verdict)),
    endingBook: normalizeEndingBook(record.endingBook),
  };
}

/** Appends a run to the counted list, keeping the last few. */
export function countRun(countedRuns, runId) {
  return [...countedRuns, runId].slice(-COUNTED_RUNS_KEPT);
}

/** The record as this device has it. */
export function readSeasonRecord() {
  return normalizeSeasonRecord(readStoredSeasonRecord());
}
