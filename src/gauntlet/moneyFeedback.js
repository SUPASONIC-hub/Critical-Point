import { formatNumber } from "../gameConstants.js";
import tableCopy from "../copy/table.js";
import { fill } from "../locale.js";

/**
 * The money, where the eye goes (11-02 money-feedback): a player who had just
 * cashed or hit the wall could not tell how much the hand had moved, nor how
 * much the season had gathered, because every number in the bank rail was the
 * same small pill and the cash's +N was a line under the slam.
 *
 * Two readings, both pure, for the stage to draw:
 *
 * - `readPurse`: the KD은행 계좌 pinned over the window -- what the run holds (the case pot and
 *   the vault together), what the last hand did to it, signed and with an
 *   arrow, and the season's won and lost columns. While the window is live it
 *   is the run as it was dealt (`lastChange` is the hand before this one); the
 *   moment the window closes it is the run as the settle will leave it, from
 *   the same two numbers the slam prints (`livePot`, `bustKeeps`).
 * - `readBurst`: the amount the slam throws at the middle of the screen and
 *   flies into the purse, or null when the hand moved nothing.
 *
 * Neither is said aloud. The slam is the verdict's one alert and already says
 * the cash's +N and the pot the wall left (bust-read-once); the purse is plain
 * text a reader finds when they look, with the arrow out of the reading.
 */

// U+2212, the minus sign: a hyphen is narrower than the digits beside it.
const MINUS = "−";

/** A signed amount: "+12,400", "−12,400", or "0". */
export function formatChange(amount) {
  const value = Math.round(Number(amount) || 0);
  if (value > 0) return `+${formatNumber(value)}`;
  if (value < 0) return `${MINUS}${formatNumber(-value)}`;
  return "0";
}

/** The arrow and the class for a change: up for a gain, down for a loss, none for nothing. */
const direction = (amount) => (amount > 0 ? { dir: "up", arrow: "▲" } : amount < 0 ? { dir: "down", arrow: "▼" } : null);

/**
 * What the hand that just closed did to the money: the cash's pot, or what
 * the wall took (the case pot less what INSURANCE left). `null` while the
 * window is live or was never this tab's to settle.
 */
export function readSettledChange({ win, settling, livePot = 0, runPot = 0, bustKeeps = 0 }) {
  if (!settling || win?.status === "live") return null;
  if (win?.status === "cashed") return Math.max(0, Math.round(livePot));
  return -Math.max(0, Math.round(runPot - bustKeeps));
}

/**
 * The KD은행 계좌. `run` is the run the table was dealt; `settling` is a
 * closed window this tab is settling (the stage's `claimed`), whose change is
 * counted in at once so the purse shows where the money lands.
 */
export function readPurse({ run, win, settling = false, livePot = 0, bustKeeps = 0 }) {
  const say = tableCopy.stage;
  const runPot = Math.max(0, Math.round(Number(run?.runPot) || 0));
  const vault = Math.max(0, Math.round(Number(run?.vault) || 0));
  const settled = readSettledChange({ win, settling, livePot, runPot, bustKeeps });
  const change = settled ?? Math.round(Number(run?.lastChange) || 0);
  // A replay's hands are shown and never counted into the season (gauntletEngine `resolveWindow`).
  const counted = settled !== null && !run?.practice;
  const gained = Math.max(0, Math.round(Number(run?.seasonGained) || 0)) + (counted && settled > 0 ? settled : 0);
  const lost = Math.max(0, Math.round(Number(run?.seasonLost) || 0)) + (counted && settled < 0 ? -settled : 0);
  const total = runPot + vault + (settled ?? 0);
  const arrow = direction(change);
  return {
    total,
    totalText: formatNumber(total),
    change: arrow ? { amount: change, text: formatChange(change), ...arrow, spoken: fill(say.purseChange, { change: formatChange(change) }) } : null,
    season: { gained, lost, text: fill(say.purseSeason, { gained: formatChange(gained), lost: formatChange(-lost) }) },
    // The slam's amount lands here: the purse pops as it arrives.
    landing: settled !== null && settled !== 0 ? (settled > 0 ? "up" : "down") : null,
  };
}

/**
 * The amount the slam throws, or null: a cash's +N in green, a bust's −N in
 * red. A bust that cost nothing -- an empty pot, or one INSURANCE kept whole --
 * throws nothing; the slam's sentence still says the pot.
 */
export function readBurst({ win, livePot = 0, runPot = 0, bustKeeps = 0 }) {
  const amount = readSettledChange({ win, settling: true, livePot, runPot, bustKeeps });
  if (!amount) return null;
  return { amount, text: formatChange(amount), dir: amount > 0 ? "up" : "down" };
}
