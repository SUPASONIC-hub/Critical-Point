/**
 * How the case was read (D-11 + E-4(b)): a tally the briefing page and the
 * reveal add to, and the case row takes when the case closes
 * (useChoiceCommit, into `dynamics` beside `responseTimeSec`).
 *
 *   readBriefings        briefing pages closed in the case (the denominator)
 *   readAutoOpened       of them, the ones the reading clock opened by itself
 *   readHeld             of them, the ones the clock was held on (멈춤)
 *   readSecMedian        the median seconds a page stayed up, visible
 *   revealDetailsOpened  times 자세히 was opened on a reveal
 *
 * Beside the tally, the last page closed (`page`: its visible seconds and the
 * reading clock it had), which the decision made on the table it opened takes
 * onto its log entry (takeBriefingRead, as `readSec` and `readClock`): a
 * quick pick after a page read through is not scored as a snap (gameLogic's
 * readThrough, 2026-11-03).
 *
 * The reveal of the decision that closes a case opens after its row is
 * written, so a 자세히 there counts toward the next case's row. (E-1's
 * `unfolded` joins here when folded scenes exist.)
 *
 * In sessionStorage, so a reload in the middle of a case keeps what was read
 * before it and a closed tab leaves nothing behind. A new season and a reset
 * clear it (runLifecycle.startGame, runStorageReset.clearRunStorage). Numbers
 * only: nothing the player typed or is called.
 */
export const READING_TALLY_KEY = "critical-point-reading-v1";
/** Pages kept for the median: a case has fewer scenes than this. */
const SECONDS_KEPT = 64;

const empty = () => ({ caseId: null, seconds: [], auto: 0, held: 0, details: 0, page: null });
const tenths = (value) => Math.round(Math.max(0, Number(value) || 0) * 10) / 10;
/** The last page as kept: both numbers, the clock above zero, or nothing. */
function readPage(page) {
  if (!page || typeof page !== "object") return null;
  const { seconds, clock } = page;
  return Number.isFinite(seconds) && seconds >= 0 && Number.isFinite(clock) && clock > 0 ? { seconds, clock } : null;
}
const count = (value) => (Number.isInteger(value) && value > 0 ? value : 0);

function read() {
  try {
    const tally = JSON.parse(globalThis.sessionStorage?.getItem(READING_TALLY_KEY) ?? "null");
    if (!tally || typeof tally !== "object" || Array.isArray(tally)) return empty();
    return {
      caseId: typeof tally.caseId === "string" ? tally.caseId : null,
      seconds: Array.isArray(tally.seconds) ? tally.seconds.filter((value) => Number.isFinite(value) && value >= 0).slice(-SECONDS_KEPT) : [],
      auto: count(tally.auto),
      held: count(tally.held),
      details: count(tally.details),
      page: readPage(tally.page),
    };
  } catch {
    return empty();
  }
}

function write(tally) {
  try {
    globalThis.sessionStorage?.setItem(READING_TALLY_KEY, JSON.stringify(tally));
  } catch {
    // No storage (a private window that refuses it): this page goes uncounted.
  }
}

export function clearReadingTally() {
  try {
    globalThis.sessionStorage?.removeItem(READING_TALLY_KEY);
  } catch {
    // Nothing to clear.
  }
}

/**
 * One briefing page closed: how long it was up (visible seconds), whether the
 * clock opened it, whether it was held, and the reading clock it had (`clock`,
 * seconds; left out by a page that reports none, which then keeps no `page`).
 */
export function noteBriefing({ caseId = null, seconds, byClock = false, held = false, clock = null }) {
  let tally = read();
  // A page of another case than the tally's: what was left is a case that never closed.
  if (caseId && tally.caseId && tally.caseId !== caseId) tally = empty();
  tally.caseId = caseId ?? tally.caseId;
  tally.seconds = [...tally.seconds, tenths(seconds)].slice(-SECONDS_KEPT);
  tally.page = readPage({ seconds: tenths(seconds), clock: Number(clock) > 0 ? tenths(clock) : null });
  if (byClock) tally.auto += 1;
  if (held) tally.held += 1;
  write(tally);
}

/** 자세히 opened on a reveal. */
export function noteRevealDetails() {
  const tally = read();
  tally.details += 1;
  write(tally);
}

export function median(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : Math.round(((sorted[middle - 1] + sorted[middle]) / 2) * 10) / 10;
}

/**
 * The last page closed, for the decision made on the table it opened, and
 * taken off the tally so a later decision with no page of its own cannot
 * carry it: `{ readSec, readClock }`, or null when no page was noted since.
 */
export function takeBriefingRead() {
  const tally = read();
  if (!tally.page) return null;
  write({ ...tally, page: null });
  return { readSec: tally.page.seconds, readClock: tally.page.clock };
}

/** The case's reading, as the case row carries it, and the tally emptied for the next case. */
export function takeReadingTally() {
  const tally = read();
  clearReadingTally();
  return {
    readBriefings: tally.seconds.length,
    readAutoOpened: tally.auto,
    readHeld: tally.held,
    readSecMedian: median(tally.seconds),
    revealDetailsOpened: tally.details,
  };
}
