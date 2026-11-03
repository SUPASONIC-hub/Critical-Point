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

const empty = () => ({ caseId: null, seconds: [], auto: 0, held: 0, details: 0 });
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
 * E-11: a side case is read on the same briefing pages, and its pages are not
 * the season case's. The side screen takes the tally as it stands when it
 * opens and puts it back when it closes, so the next season case row carries
 * only the season's reading (screens/SideCaseScreen.jsx).
 */
export function keepReadingTally() {
  let kept = null;
  try {
    kept = globalThis.sessionStorage?.getItem(READING_TALLY_KEY) ?? null;
  } catch {
    // No storage: there is nothing to keep, and the side case's pages are not counted either.
  }
  return () => {
    try {
      if (kept === null) globalThis.sessionStorage?.removeItem(READING_TALLY_KEY);
      else globalThis.sessionStorage?.setItem(READING_TALLY_KEY, kept);
    } catch {
      // As above.
    }
  };
}

/** One briefing page closed: how long it was up (visible seconds), whether the clock opened it, whether it was held. */
export function noteBriefing({ caseId = null, seconds, byClock = false, held = false }) {
  let tally = read();
  // A page of another case than the tally's: what was left is a case that never closed.
  if (caseId && tally.caseId && tally.caseId !== caseId) tally = empty();
  tally.caseId = caseId ?? tally.caseId;
  tally.seconds = [...tally.seconds, Math.round(Math.max(0, Number(seconds) || 0) * 10) / 10].slice(-SECONDS_KEPT);
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
