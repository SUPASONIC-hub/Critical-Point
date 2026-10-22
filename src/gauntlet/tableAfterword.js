import { drawStep, GAUGE_MAX, getMultiplier, normalizeSchema } from "./gauntletEngine.js";
import { tableReactions } from "../caseCopy.js";
import { formatNumber } from "../gameConstants.js";
import { perCaseVault } from "../ranking.js";

/**
 * What a closed window can still say about itself (improvement notes
 * 2026-10-22, 3-4: C-11, C-12, C-13). Display only: nothing here is read by
 * the settlement, the score or the ranking, and every number is dealt from
 * the window's own seed, as the table deals it.
 *
 * It is the runtime's (the reveal, the commit, the run readout), never the
 * table's: the PlayScreen chunk has no bytes left, and none of this is drawn
 * while a window is live.
 */

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
  const next = readNextPush(win);
  if (next) return `한 번 더 밀었다면 +${next.step} → ${next.gauge}, 벽 ${next.wall}: ${next.safe ? "갈 수 있었다" : "BUST였다"}.`;
  const tell = readTellWall(win);
  return tell ? `심박은 벽을 ${tell.heard}쯤으로 들었다(실제 ${tell.wall}).` : null;
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
  const schema = normalizeSchema(win.schema);
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
  return percent === null ? null : `이번 사건: 벽을 본 사람의 ${percent}%만큼 벌었습니다.`;
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
 * The line at the head of the next scene, or null on a case's first scene
 * (the log is fresh when a case opens). Picked by the scene, so a reload
 * reads the same line.
 */
export function getTableReaction(log = [], nodeId = "") {
  const lines = tableReactions[getHeatStage(log.at(-1)?.threshold)];
  if (!lines) return null;
  let hash = 0;
  for (const char of String(nodeId)) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return lines[hash % lines.length];
}

/**
 * C-1 (3): the result card's 사건당 금고 line, made here and handed to the card
 * whole (its chunk has no bytes for the words): the finale's vault over the
 * cases the season closed, as the ranking row reads it. Empty without one.
 */
export function describeVaultPerCase(caseResults = {}) {
  const results = caseResults && typeof caseResults === "object" ? caseResults : {};
  const perCase = perCaseVault({ gauntlet: results.final?.gauntlet, completedCaseCount: Object.keys(results).length });
  return perCase === null ? "" : `사건당 금고 ${formatNumber(perCase)}`;
}
