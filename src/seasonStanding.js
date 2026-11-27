import { CASE_SEQUENCE } from "./gameCases.js";
import { ENDING_GATES, initialResources } from "./gameConstants.js";
import { cashOpensClue, CLUE_CASH_MULTIPLIER, getUpkeep, isMarkEightOn, isMarkElevenOn, isMarkTenOn, isMarkThirteenOn, readSoft, SOFT_KEYS, BURN_COVER_QUIET } from "./gauntlet/nextTableRules.js";

/**
 * Where a season stands against SYSTEM COLLAPSE, read the one way the ending
 * reads it. `getSeasonStrain` takes its cases, harm, busts and windows from
 * here and `getEndingVariant` asks `readCollapseGate` whether the season has
 * collapsed (both in gameLogic.js), so a readout built on `getSeasonStanding`
 * cannot say anything the closing ruling does not. Keep this module free of
 * the scene graph: it reads case summaries and two constants.
 */

const { collapseHarmPerCase: HARM_PER_CASE, collapseBustRate: BUST_RATE, collapseOverreachHarm: OVERREACH_HARM } = ENDING_GATES;

// G26 (RULES_MARK 8): the slack door opens further: the record bar 0.5, and OPEN OVERSIGHT's legitimacy and trust this much lower (6.1% of open doors change the ending).
const CLUE_RATE_SLACK_EIGHT = 0.5;
const OVERSIGHT_SLACK_EIGHT = 9;
const OVERSIGHT_TRUST_SLACK_EIGHT = 8;
/** What an open slack door lowers, for the ruling (gameLogic.js) and the finale's line (nearestEnding.js); `bar` is the record bar before 8. */
export const getSlackGates = (bar) => (isMarkEightOn() ? { clueRate: CLUE_RATE_SLACK_EIGHT, oversight: OVERSIGHT_SLACK_EIGHT, trust: OVERSIGHT_TRUST_SLACK_EIGHT } : { clueRate: bar, oversight: 0, trust: 0 });

// G39 (RULES_MARK 11): a scene's record opens only on a table cashed at ×32 or more, and HUMAN RECORD asks this share of the records, not every one.
const RECORD_CLUE_RATE_ELEVEN = 0.85;
// G39 (RULES_MARK 11): with the records tied to the cash, a season under half of them is no longer rare (20% of
// 600): QUIET COVER's record door moves 0.5 -> 0.2 (11.7%), and the finale's answer moves 77.3% of standing endings again (G40, 72.7%).
const QUIET_CLUE_RATE_ELEVEN = 0.2;
/** QUIET COVER's record door; `bar` is the door before 11. */
export const getQuietClueRate = (bar) => (isMarkElevenOn() ? QUIET_CLUE_RATE_ELEVEN : bar);
/** HUMAN RECORD's record bar, for the ruling and the finale's line; `bar` is the bar before 11. */
export const getRecordClueRate = (bar) => (isMarkElevenOn() ? RECORD_CLUE_RATE_ELEVEN : bar);
/** The cash a record opens at, or null before 11 (the case file's line). */
export const getRecordCashBar = () => (isMarkElevenOn() ? CLUE_CASH_MULTIPLIER : null);
/** Whether a decision whose table cashed at `multiplier` can open its scene's record (null: no table read, as the previews ask). */
export const clueCashed = (multiplier) => multiplier === null || multiplier === undefined || !isMarkElevenOn() || cashOpensClue(multiplier);

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
 * G34 (RULES_MARK 9, 보상금): a case whose harm was paid off at its close
 * (`covered`, src/gauntlet/settlementPay.js) counts what is left of it, and
 * the cover is kept: each one takes COVER_LEGITIMACY off the season's mean
 * 공정함 (gameLogic.js `getSeasonStrain`), and the ruling leans to the endings
 * made of silence -- PROFITABLE SILENCE's trust bar COVER_SILENCE_TRUST
 * higher a cover, QUIET COVER from COVER_QUIET covers on.
 */
export const caseHarm = (summary) => Math.max(0, (Number(summary?.finalHumanCost) || 0) - (Number(summary?.covered?.harm) || 0));
export const COVER_LEGITIMACY = 1;
export const COVER_SILENCE_TRUST = 3;
export const COVER_QUIET = 6;

/**
 * G40 (RULES_MARK 10, 마지막 답의 무게): the finale's answer weighs once more on
 * the season's mean standing the ruling reads -- 증언 (witness) the people's
 * 믿음, 개혁 (control) the system's 공정함, FINALE_WEIGHT each, up to 100; 소각
 * (burn) nothing. Only the mean (`getSeasonStrain().seasonResources`): a caller
 * that hands the last case's resources alone is read as it was. Measured
 * (게임성 5차 G40, with G41): the answer moves the ending in 75.8% of standing
 * seasons (63.3% before); +8 took COLD JUSTICE under 3%.
 */
export const FINALE_WEIGHT = 5;
const FINALE_KEYS = Object.freeze({ witness: "trust", control: "legitimacy" });
/** The season's mean standing with the finale's answer on it, as the ruling (gameLogic.js) and the finale's line (nearestEnding.js) read it. */
export function weighFinale(seasonResources, finale) {
  const standing = weighUpkeep(seasonResources);
  const key = FINALE_KEYS[finale];
  if (!standing || !key || !isMarkTenOn()) return standing;
  return { ...standing, [key]: Math.min(100, (Number(standing[key]) || 0) + FINALE_WEIGHT) };
}
/**
 * G38 (RULES_MARK 11): the ending gates the means' 유지비 moved, as the ruling
 * (gameLogic.js) reads them: `gates` before 11, with `moved` (index: gate) laid
 * over them from 11. PROFITABLE SILENCE's 돈 97 -> 91 and COLD JUSTICE's 공정함
 * 88 -> 85 (the old bars after the 유지비), story mode's cold gap 10 -> 9 (story
 * COLD JUSTICE 2.2% -> 3.2% of 600). Read once, as the module loads.
 */
export function withUpkeepGates(gates, moved) {
  return isMarkElevenOn() ? gates.map((gate, index) => moved[index] ?? gate) : gates;
}
/**
 * G38 유지비 on the ending (RULES_MARK 11, the user's (1) of 2026-11-26): the
 * season's mean 믿음·공정함·돈 count a third less of what stands over 80 (100
 * reads as 93), as a case opens on them (nextTableRules.js `getUpkeep`). Before
 * the finale's weight (G40) goes on.
 */
export function weighUpkeep(seasonResources) {
  if (!seasonResources || !isMarkElevenOn()) return seasonResources;
  const plain = readSoftMeans(seasonResources);
  const cut = getUpkeep(plain);
  return { ...plain, ...Object.fromEntries(Object.entries(cut).map(([key, value]) => [key, (Number(plain[key]) || 0) + value])) };
}
/**
 * G44 (RULES_MARK 13, the user's (1) of 2026-11-27): the season's mean 돈·믿음·
 * 공정함 read back through the softer gains' curve (nextTableRules.js
 * `readSoft`), rounded, before the 유지비 and the finale's weight: the ending's
 * gates moved by the same curve, so none of them had to be set again.
 */
export function readSoftMeans(seasonResources) {
  if (!seasonResources || !isMarkThirteenOn()) return seasonResources;
  return { ...seasonResources, ...Object.fromEntries(SOFT_KEYS.map((key) => [key, Math.round(readSoft(Number(seasonResources[key]) || 0))])) };
}
/**
 * G44 (RULES_MARK 13): what an entry moved, as the ledger sums it -- 돈·믿음·
 * 공정함's gains as they landed (resourcesAfter less resourcesBefore: softer
 * near the top), every other key as the effect says. Before 13, the effect.
 */
export function readPaidEffect(entry) {
  const effect = entry?.effect ?? {};
  const { resourcesBefore: before, resourcesAfter: after } = entry ?? {};
  if (!isMarkThirteenOn() || !before || !after) return effect;
  return Object.fromEntries(Object.entries(effect).map(([key, value]) => (SOFT_KEYS.includes(key) && Number(value) > 0 && Number.isFinite(Number(after[key]) - Number(before[key])) ? [key, Number(after[key]) - Number(before[key])] : [key, value])));
}
/**
 * G41 (RULES_MARK 10): a season that paid COVER_QUIET cases off or more and did
 * not burn its records closes on QUIET COVER where it would have closed on
 * PROFITABLE SILENCE: it kept the records and bought the quiet (게임성 5차 G41).
 */
export const coversBeforeSilence = (seasonCovers) => isMarkTenOn() && seasonCovers >= COVER_QUIET;
/**
 * G45 (RULES_MARK 13): a season that burned its records and paid the whole
 * ladder of covers (BURN_COVER_QUIET, ten) closes on QUIET COVER where it would
 * have closed on PROFITABLE SILENCE: it bought the quiet twice over (게임성 6차
 * G45: spend-people 3 endings, collapse 60.0 / silence 21.3 / quiet cover 18.7).
 */
export const coversBurnedSilence = (seasonCovers) => isMarkThirteenOn() && seasonCovers >= BURN_COVER_QUIET;

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
    seasonHumanCost: summaries.reduce((sum, summary) => sum + caseHarm(summary), 0),
    seasonCovers: summaries.filter((summary) => summary?.covered).length,
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

/**
 * Harm a case as a line prints it: cut to a tenth, never rounded, so 19.96 a
 * case prints 19.9 and not the 20 the season has not reached. The standing
 * line and the collapse's toll read the same cut.
 */
export const cutPerCase = (total, cases) => Math.floor((total * 10) / Math.max(1, cases)) / 10;

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
      .map(([caseId, summary]) => ({ caseId: caseId ?? null, harm: caseHarm(summary) }))
      .filter((entry) => entry.harm > 0)
      .sort((a, b) => b.harm - a.harm || seasonOrder(a.caseId) - seasonOrder(b.caseId))
      .slice(0, HARM_CASES_LISTED),
  };
}

/**
 * How far under the start the season's mean cash must have closed for the
 * season to have lost money (개선 포인트 C3, 2026-11-05 draft): under this
 * share of `initialResources.capital`, so under 80 of the 100 a season
 * starts with. The one number the held line hangs on; where it sits is the
 * owner's (감수자's) call.
 */
export const HELD_LINE_CAPITAL_SHARE = 0.8;

/**
 * Whether the season lost money and kept people: its standing is clear of
 * both collapse routes and the cash its cases closed on, on average, is
 * under `HELD_LINE_CAPITAL_SHARE` of the start. `closing` is the mean
 * closing resources (`getSeasonStrain().seasonResources`), or null before a
 * case has closed -- and then nothing is held.
 *
 * @param {{ level?: string, closing?: Record<string, any> | null }} [input]
 */
export function readHeldLine({ level, closing } = {}) {
  const capital = Number(closing?.capital);
  return level === "clear" && Number.isFinite(capital) && capital < initialResources.capital * HELD_LINE_CAPITAL_SHARE ? { capital } : null;
}

/** The values a season-final row's `seasonStanding` takes (`readSeasonStandingMark`; payloadSchemas.js checks it). */
export const SEASON_STANDING_MARKS = Object.freeze(["held", "clear", "near", "over"]);

/**
 * The season's standing as its finale's report reads it, for the season-final
 * row's summary (`seasonStanding`, decision T3): "held" where `readHeldLine`
 * prints the held sentence -- clear of both collapse routes, cash lost -- else
 * the level of `getSeasonStanding`. Given what the report is given: the
 * season's case summaries with the finale's, the resources on the table, and
 * the mean closing resources (`getSeasonStrain().seasonResources`). A record
 * only: nothing ranks or scores on it.
 *
 * @param {{ caseResults?: Record<string, any>, resources?: Record<string, any>, closing?: Record<string, any> | null }} [input]
 */
export function readSeasonStandingMark({ caseResults = {}, resources = {}, closing = null } = {}) {
  const { level } = getSeasonStanding({ caseResults, resources });
  return readHeldLine({ level, closing }) ? "held" : level;
}
