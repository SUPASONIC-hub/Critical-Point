import { CASE_SEQUENCE } from "./gameCases.js";
import { ENDING_GATES } from "./gameConstants.js";

/**
 * Where a season stands against SYSTEM COLLAPSE, read the one way the ending
 * reads it. `getSeasonStrain` takes its cases, harm, busts and windows from
 * here and `getEndingVariant` asks `readCollapseGate` whether the season has
 * collapsed (both in gameLogic.js), so a readout built on `getSeasonStanding`
 * cannot say anything the closing ruling does not. Keep this module free of
 * the scene graph: it reads case summaries and two constants.
 */

const { collapseHarmPerCase: HARM_PER_CASE, collapseBustRate: BUST_RATE, collapseOverreachHarm: OVERREACH_HARM } = ENDING_GATES;

/**
 * How much of a gate counts as close to it. The one number the readout's
 * warning state hangs on; where it sits is the owner's call.
 */
export const SEASON_STANDING_NEAR = 0.8;
// 0.8 of 0.2 is 0.16000000000000003 in floating point: a season at 16 busts
// in 100 windows is at the line, not under it.
const NEAR_TOLERANCE = 1e-9;
const HARM_CASES_LISTED = 3;

/**
 * The season's closed cases as `[caseId, summary]`, the case that is closing
 * now (`pending`) included. A replayed case is in both -- the summary it is
 * about to replace, and the one pending -- and counts once, as the new one.
 */
export function readClosedCases(caseResults = {}, pending = null) {
  const closed = Object.entries(caseResults ?? {}).filter(([caseId]) => caseId !== pending?.caseId);
  return [...closed, [pending?.caseId, pending]].filter(([, summary]) => Boolean(summary));
}

/** What the collapse gate reads off those summaries: cases, windows, busts and the harm each case closed on. */
export function readCollapseTally(summaries = []) {
  return {
    casesPlayed: summaries.length,
    seasonWindows: summaries.reduce((sum, summary) => sum + (Number(summary.pushRecord?.busts) || 0) + (Number(summary.pushRecord?.cashes) || 0), 0),
    seasonHumanCost: summaries.reduce((sum, summary) => sum + (Number(summary.finalHumanCost) || 0), 0),
    seasonBusts: summaries.reduce((sum, summary) => sum + (Number(summary.pushRecord?.busts) || 0), 0),
  };
}

/**
 * The collapse gate itself. `cases` is what the season's means are taken
 * over: the cases closed, or the whole season for a caller that names none.
 * Harm is the larger of the season's sum and the harm on the table now, per
 * case. `cause` is the door the collapse came through -- harm before
 * overreach -- or null while the season stands.
 *
 * @param {object} [input]
 * @param {number} [input.seasonHumanCost]
 * @param {Record<string, any>} [input.resources]
 * @param {number} [input.casesPlayed]
 * @param {number} [input.seasonBusts]
 * @param {number} [input.seasonWindows]
 */
export function readCollapseGate({ seasonHumanCost = 0, resources = {}, casesPlayed = 0, seasonBusts = 0, seasonWindows = 0 } = {}) {
  const cases = Math.max(1, Number(casesPlayed) || CASE_SEQUENCE.length);
  const harmTotal = Math.max(Number(seasonHumanCost) || 0, Number(resources.humanCost) || 0);
  const harm = harmTotal / cases;
  const bustRate = seasonWindows > 0 ? seasonBusts / seasonWindows : 0;
  const over = { harm: harm >= HARM_PER_CASE, overreachHarm: harm >= OVERREACH_HARM, bustRate: bustRate >= BUST_RATE };
  const cause = over.harm ? "harm" : over.overreachHarm && over.bustRate ? "overreach" : null;
  return { cases, harmTotal, harm, bustRate, over, cause };
}

const levelOf = (over, value, gate) => (over ? "over" : value >= gate * SEASON_STANDING_NEAR - NEAR_TOLERANCE ? "near" : "clear");
const LEVELS = ["clear", "near", "over"];
const seasonOrder = (caseId) => {
  const index = CASE_SEQUENCE.indexOf(caseId);
  return index < 0 ? CASE_SEQUENCE.length : index;
};

/**
 * The season so far against both collapse routes, for a readout. Takes what
 * the ending takes -- the case summaries, the case closing now if there is
 * one, and the resources on the table -- and returns the gate's own values
 * with a level beside each: "over" where the gate says so, "near" from
 * `SEASON_STANDING_NEAR` of the gate, "clear" under that.
 *
 * Overreach needs both of its halves, so its level is the lower of the two:
 * "near" only when harm and bust rate are each at `SEASON_STANDING_NEAR` of
 * their own gate or past it and at least one is still under its gate. One
 * half over beside the other between the share and the gate is "near"; one
 * half over beside the other under the share is "clear" -- a fifth of the
 * windows busted beside almost no harm is not on the way to collapse.
 * `level` is the worse of the two routes, and "over" exactly when
 * `getEndingVariant` given the same season returns the collapse.
 *
 * `harm.total` is what the gate reads, and it has two sources. `harm.closed`
 * is what the closed cases sum to; while a table is open and already holds
 * more than that, the table's harm is the total and `harm.source` is "table"
 * rather than "closed". `harmCases` accounts for `harm.closed` and nothing
 * else: the closed cases that contributed the most harm, most first, ties in
 * season order, three at most, a case that closed on none not listed. So a
 * season that is over on an empty or short list says why: its `harm.source`
 * is "table". A case closing now that came without an id is still a closed
 * case the gate counts, and is listed under `caseId: null`, never undefined.
 */
export function getSeasonStanding({ caseResults = {}, pending = null, resources = {} } = {}) {
  const closed = readClosedCases(caseResults, pending);
  const tally = readCollapseTally(closed.map(([, summary]) => summary));
  const { cases, harmTotal, harm, bustRate, over, cause } = readCollapseGate({ ...tally, resources });
  const harmLevel = levelOf(over.harm, harm, HARM_PER_CASE);
  const overreachHarmLevel = levelOf(over.overreachHarm, harm, OVERREACH_HARM);
  const bustLevel = levelOf(over.bustRate, bustRate, BUST_RATE);
  const overreachLevel = LEVELS[Math.min(LEVELS.indexOf(overreachHarmLevel), LEVELS.indexOf(bustLevel))];
  return {
    casesClosed: tally.casesPlayed,
    casesCounted: cases,
    nearShare: SEASON_STANDING_NEAR,
    level: LEVELS[Math.max(LEVELS.indexOf(harmLevel), LEVELS.indexOf(overreachLevel))],
    cause,
    harm: { total: harmTotal, closed: tally.seasonHumanCost, source: harmTotal > tally.seasonHumanCost ? "table" : "closed", perCase: harm, gate: HARM_PER_CASE, level: harmLevel },
    overreach: {
      busts: tally.seasonBusts,
      windows: tally.seasonWindows,
      bustRate,
      bustGate: BUST_RATE,
      bustLevel,
      harmGate: OVERREACH_HARM,
      harmLevel: overreachHarmLevel,
      level: overreachLevel,
    },
    harmCases: closed
      .map(([caseId, summary]) => ({ caseId: caseId ?? null, harm: Number(summary.finalHumanCost) || 0 }))
      .filter((entry) => entry.harm > 0)
      .sort((a, b) => b.harm - a.harm || seasonOrder(a.caseId) - seasonOrder(b.caseId))
      .slice(0, HARM_CASES_LISTED),
  };
}
