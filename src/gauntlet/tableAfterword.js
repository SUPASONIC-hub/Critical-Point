import { drawStep, GAUGE_MAX, getMultiplier } from "./gauntletEngine.js";
import { tableReactions } from "../caseCopy.js";
import { formatNumber } from "../gameConstants.js";
import tableCopy from "../copy/table.js";
import { fill } from "../locale.js";

/**
 * What a closed window can still say about itself (improvement notes
 * 2026-10-22, 3-4: C-11, C-12, C-13). Display only: nothing here is read by
 * the settlement, the score or the ranking, and every number is dealt from
 * the window's own seed, as the table deals it.
 *
 * It is the runtime's (the reveal, the commit, the run readout), never the
 * table's: the PlayScreen chunk has no bytes left, and none of this is drawn
 * while a window is live.
 *
 * Its words are src/copy/table.js's `afterword` (영어판 4단계), read as each
 * line is made, so another language laid over them is the one printed.
 */
const words = () => tableCopy.afterword;

/**
 * C-11, after a cash: the push the player did not make. The step is the one
 * `PUSH` would have dealt (`drawStep` at the next push index), the clock's
 * creep left out: one more press, at once. The heat is floored, so the number
 * printed is below the wall exactly when the push would have stayed under it.
 */
export function readNextPush(win) {
  if (!win?.schema || win.status !== "cashed") return null;
  const step = drawStep(win.schema, win.seed, (Number(win.pushes) || 0) + 1);
  const next = Math.min(GAUGE_MAX, (Number(win.gauge) || 0) + step);
  return { step, gauge: Math.floor(next), wall: Number(win.wall) || 0, safe: next < win.wall };
}

/**
 * C-11, after a bust: where the heartbeat heard the wall -- the window's tell
 * wall, the real one plus its seeded error (`getHeartbeatBpm`). Not on a
 * window that was left (it was never played to the wall) or a sedated board,
 * whose pulse was jammed.
 */
export function readTellWall(win) {
  if (!win || win.status !== "bust" || win.cause === "abandon" || win.schema?.sedated) return null;
  const wall = Number(win.wall) || 0;
  return { heard: Math.max(0, Math.min(GAUGE_MAX, wall + (Number(win.tellOffset) || 0))), wall };
}

/** The reveal's one line for a closed window, or null. */
export function describeAfterword(win) {
  // A window closed without a single push (heat 0 straight to the close) has
  // nothing to weigh "one more" against: no line (user, 2026-10-23 Q34 (1)).
  if (win?.status === "cashed" && !(Number(win.pushes) > 0)) return null;
  const next = readNextPush(win);
  if (next) return fill(words().nextPush, { step: next.step, gauge: next.gauge, wall: next.wall, outcome: next.safe ? words().nextSafe : words().nextBust });
  const tell = readTellWall(win);
  return tell ? fill(words().tell, { heard: tell.heard, wall: tell.wall }) : null;
}

/**
 * 안전선까지 (improvement notes 2026-10-22, C-5): the pushes in a row that
 * cannot reach the wall whatever it is -- each one starts with the largest
 * step still under the band's low edge -- and the heat they leave. The steps
 * are the ones `PUSH` deals from the seed, so pressing them one by one lands
 * on the same window (tests/unit/table-readouts.test.mjs). No rule moves.
 * Here, in the runtime's chunk, because the table's has no bytes left; the
 * meters (tableMeters.js) hand it to the stage.
 */
export function readSafeLine(win, wallMin) {
  let gauge = win.gauge;
  let pushes = 0;
  while (win.status === "live" && gauge + win.schema.stepMax < wallMin) {
    pushes += 1;
    gauge += drawStep(win.schema, win.seed, win.pushes + pushes);
  }
  return { pushes, gauge };
}

/**
 * C-12: one window, played twice on the same board -- the bare hand the
 * player had (the card's chips at the heat it closed on, 0 on a bust) and a
 * hand that sees the wall: `check:pressure`'s ceiling ("sees the wall"), which
 * pushes while the largest step still stays under the wall and then cashes.
 * Both bare: no LOCK, no streak, no relic, no clock. `[bare, seer]`, as the
 * log keeps it (`threshold.read`).
 */
export function readWindowAgainstSeer(win, chips = 0) {
  if (!win?.schema) return null;
  // A window's board is the normalized one (`createWindow`).
  const { schema } = win;
  let gauge = schema.startGauge;
  for (let push = 1; push < 40 && gauge + schema.stepMax < win.wall; push += 1) gauge += drawStep(schema, win.seed, push);
  const bare = win.status === "cashed" ? Math.round(chips * getMultiplier(win.gauge)) : 0;
  return [bare, Math.round(chips * getMultiplier(gauge))];
}

/**
 * C-12, when a case closes: what the bare hand kept against the seer's, over
 * the case's log. A bust wipes what the bare hand had in the pot, as the
 * table does without INSURANCE; the seer never pushes into the wall. A whole
 * percent, or null for a case with nothing to compare (an older log).
 */
export function readCaseRead(log = []) {
  let mine = 0;
  let seer = 0;
  for (const entry of log) {
    const read = entry?.threshold?.read;
    if (!Array.isArray(read)) continue;
    mine = entry.threshold.busted ? 0 : mine + (Number(read[0]) || 0);
    seer += Number(read[1]) || 0;
  }
  return seer > 0 ? Math.round((mine / seer) * 100) : null;
}

export function describeCaseRead(log) {
  const percent = readCaseRead(log);
  return percent === null ? null : fill(words().caseRead, { share: `${percent}%` });
}

/**
 * C-13: the heat the last window closed on, as the next scene's speaker
 * hears it -- BUST, 60 and over (HEAT DEBT's), 40 to 59 (the audit's band)
 * and under 40.
 */
export function getHeatStage(threshold) {
  if (!threshold) return null;
  if (threshold.busted) return "bust";
  const gauge = Number(threshold.gauge) || 0;
  return gauge >= 60 ? "hot" : gauge >= 40 ? "mid" : "low";
}

/**
 * What the reaction is about, above it (2026-10-23 evening, fix 4): the line
 * alone was read as said of this scene, not of the table before it. The
 * pushes, the heat and the wall the window closed on, as the reveal printed.
 */
function describeLastTable(threshold) {
  const pushes = Number(threshold?.pushes) || 0;
  const gauge = Math.floor(Number(threshold?.gauge) || 0);
  const wall = Number(threshold?.wall) || 0;
  const tail = wall ? fill(words().wallTail, { wall }) : "";
  // A bust the clock made (its creep, or the time running out) is no push's.
  if (threshold?.busted) return fill(threshold.cause === "push" ? words().bustOnPush : words().bustAfter, { pushes, tail });
  return fill(pushes ? words().cashed : words().cashedNoPush, { pushes, gauge, tail });
}

/**
 * The line at the head of the next scene with what it is about
 * ({ recap, line }), or null on a case's first scene (the log is fresh when
 * a case opens). Picked by the scene, so a reload reads the same line.
 */
export function getTableReaction(log = [], nodeId = "") {
  const threshold = log.at(-1)?.threshold;
  const lines = tableReactions[getHeatStage(threshold)];
  if (!lines) return null;
  let hash = 0;
  for (const char of String(nodeId)) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return { recap: describeLastTable(threshold), line: lines[hash % lines.length] };
}

/**
 * C-1 (3), 사건당 금고: the season's vault over the cases it closed. The
 * ranking row works it out the same way from its summary (RankingScreen.jsx,
 * a chunk that loads without this one); a unit test holds the two equal.
 * Never sorted on, never scored; null without both numbers.
 */
export function perCaseVault(vault, cases) {
  const total = Number(vault);
  const count = Number(cases);
  return total >= 0 && count > 0 ? Math.round(total / count) : null;
}

/**
 * C-1 (3): the result card's 사건당 금고 line, made here and handed to the card
 * whole (its chunk has no bytes for the words): the finale's vault over the
 * cases the season closed, as the ranking row reads it. Empty without one.
 */
export function describeVaultPerCase(caseResults = {}) {
  const results = caseResults && typeof caseResults === "object" ? caseResults : {};
  const perCase = perCaseVault(results.final?.gauntlet?.vault, Object.keys(results).length);
  return perCase === null ? "" : fill(words().vaultPerCase, { vault: formatNumber(perCase) });
}
