import { getSeasonLogic } from "./gameLogic.js";
import { RULES_MARK, RULES_MARK_KEY } from "./gauntlet/gauntletEngine.js";
import { directionParticle, easyCognitionLabels } from "./playerLanguage.js";
import { fill } from "./locale.js";
import W from "./copy/logicReport.js";

/**
 * The season's logic report: one panel on the closing report that names the
 * case the table ran hottest in and what the hand did with its directions
 * there (사람 or 자리, the axis the streak is held on since C-3),
 * and prints the season's hold rate beside its longest streak.
 *
 * It reads the cases' stored summaries and nothing else. The log is cleared
 * when a case opens, so by the ending the only thing left of a case's windows
 * is its `logicRecord` (`createLogicRecord`, gameLogic.js); and the summary
 * `useResultReport` builds from the live log is not the stored one -- it is
 * made without `replayOf`, so on a case played again it would read the replay
 * where the season keeps the first close.
 *
 * This report says 열기, never 압박: the report's own "압박 대응" is the risk
 * to the resources, and the heat of the table is another thing.
 *
 * Every sentence the panel can print is in this file, the rank lines
 * included. The standing they are chosen by is read here too (`readStanding`)
 * from what the server answers; asking the server is `useLogicStanding`'s.
 */

/** Season records the ranking needs before it places anyone. */
export const LOGIC_RANK_FLOOR = 50;
/** The bands a standing can name, best first: "상위 N% 안". */
export const LOGIC_RANK_BANDS = [10, 25, 50];
/** Cases with a record a season needs before one of them is named. */
export const LOGIC_REPORT_MIN_CASES = 5;
/** Windows a case needs before its heat is an average worth comparing. */
const LOGIC_REPORT_MIN_WINDOWS = 3;

// The words are src/copy/logicReport.js's, read when a line is made, so they are the page's language.
export const LOGIC_REPORT_COPY = {
  get label() { return W.label; },
  mark: "LOGIC HOLD",
  lead: (caseName) => fill(W.lead, { caseName }),
  held: (windows, count, type) => fill(W.held, { windows, count, type, particle: directionParticle(type) }),
  heldAll: (windows, type) => fill(W.heldAll, { windows, type, particle: directionParticle(type) }),
  switched: (count) => fill(W.switched, { count }),
  broken: (count) => fill(W.broken, { count }),
  get unbroken() { return W.unbroken; },
  get tooFew() { return W.tooFew; },
  hold: (score) => fill(W.hold, { score }),
  best: (streak) => fill(W.best, { streak }),
  get caption() { return W.caption; },
};

/**
 * What the score's line says of the season's place among the others.
 * `pending` is the ranking with fewer than the floor of records, and `band` a
 * place inside one of `LOGIC_RANK_BANDS`. `none` is nothing, and the score
 * stands alone: a season placed under the median is told no rank, and neither
 * is one whose ranking could not be read -- no answer, an error, a server
 * without the function.
 */
export const LOGIC_RANK_COPY = {
  get pending() { return fill(W.rank.pending, { floor: LOGIC_RANK_FLOOR }); },
  band: (percent) => fill(W.rank.band, { percent }),
  none: "",
};

/** The standing of a season in a ranking still short of the floor. */
export const LOGIC_STANDING_PENDING = Object.freeze({ pending: true });

/**
 * A season's standing, from the server's answer (`logic_hold_cutoffs()`) and
 * the season's own score. The answer is `{ n }` under the floor, and over it
 * `{ n, cuts: { 10, 25, 50 } }`: the lowest score still inside each band.
 * Nothing about the season is sent; the place is worked out here.
 *
 * Null is no standing, and the panel prints no rank for it: a score under the
 * median, and any answer that is not that shape -- a count that is no count, a
 * cut that is missing, not a score, or above the cut of a better band.
 */
export function readStanding(data, value) {
  const records = data?.n;
  if (!Number.isInteger(records) || records < 0 || !Number.isFinite(value)) return null;
  if (records < LOGIC_RANK_FLOOR) return LOGIC_STANDING_PENDING;
  const cuts = LOGIC_RANK_BANDS.map((band) => data.cuts?.[band]);
  if (!cuts.every((cut, index) => typeof cut === "number" && cut >= 0 && cut <= (index ? cuts[index - 1] : 100))) return null;
  const place = cuts.findIndex((cut) => value >= cut);
  return place < 0 ? null : { band: LOGIC_RANK_BANDS[place] };
}

/**
 * Whether the season has a case closed at an older table: before the table
 * paid the logic streak, or before the table of 2026-10-20 (the day-ten table),
 * whose mark is `RULES_MARK_KEY` in the same run summary (20261020010000).
 * The name stays `hasBeatTableCase` so its callers and `beatSeason` keep theirs.
 *
 * Whether the season has a case closed before the table paid the logic streak.
 * The mark is the server's own (20261011010000): a numeric `logicStreak` in
 * the run summary a closed case keeps as `gauntlet`, which is what its row was
 * sent with as `dynamics` (`createRunSummary`, written by every build since
 * the streak pays and by none before). A summary with no `gauntlet` is from
 * before the table. Not `logicRecord`: a case with no window has none.
 *
 * One thing it cannot see: a case closed at the beat table and played again at
 * this one. The device keeps the replay's summary and the server the first
 * close's row, so that season is told only when the server refuses it.
 */
export function hasBeatTableCase(caseResults = {}) {
  return Object.values(caseResults ?? {}).some((result) => {
    const summary = result?.gauntlet;
    const mark = summary?.[RULES_MARK_KEY];
    return typeof summary?.logicStreak !== "number" || !(typeof mark === "number" && mark >= RULES_MARK);
  });
}

/**
 * The score a season is ranked on, or null when it is on no ranking: a season
 * with no score, and one kept off the public ranking (`recordClosedCase`) for
 * a story-mode case in it or a case from the beat table.
 */
export function getRankedLogicHold(caseResults = {}) {
  const { logicHold } = getSeasonLogic(caseResults);
  return logicHold === undefined || hasBeatTableCase(caseResults) || Object.values(caseResults).some((result) => result?.assistStory === true) ? null : logicHold;
}

/**
 * The rank line for a standing: `{ pending: true }` or `{ band: 10 }`. Any
 * other standing -- under the median, or a ranking that could not be read --
 * has no line.
 */
export function getLogicRankLine(standing) {
  if (LOGIC_RANK_BANDS.includes(standing?.band)) return LOGIC_RANK_COPY.band(standing.band);
  return standing?.pending === true ? LOGIC_RANK_COPY.pending : LOGIC_RANK_COPY.none;
}

const count = (record, key) => Math.max(0, Math.trunc(Number(record?.[key]) || 0));

/**
 * The case the table ran hottest in: the highest mean closing tier
 * (`heat / windows`) among the cases with enough windows to average. On a tie
 * the case with more busts, and then the later one. `cases` is the season in
 * order, each with its `id`; the answer is that entry with its `record`.
 */
export function getHottestCase(caseResults = {}, cases = []) {
  let hottest = null;
  for (const caseItem of cases) {
    const record = caseResults?.[caseItem.id]?.logicRecord;
    const windows = count(record, "windows");
    if (windows < LOGIC_REPORT_MIN_WINDOWS) continue;
    // Means compared as cross products, so no two equal ones differ by a rounding.
    const lead = hottest ? count(record, "heat") * count(hottest.record, "windows") - count(hottest.record, "heat") * windows : 1;
    if (lead > 0 || (lead === 0 && count(record, "busts") >= count(hottest.record, "busts"))) hottest = { ...caseItem, record };
  }
  return hottest;
}

/**
 * What the hand did with its directions in one case. Held: at least half of
 * the case's windows were closed on one direction. Switched: not that, but
 * every change of direction answered a rise in the heat, and nothing ended the
 * streak. Otherwise the hand did not stay on a direction, and the line counts
 * how often the streak ended (a break or a bust; `getSeasonLogic` counts the
 * same two).
 */
export function describeLogicCase(record) {
  const windows = count(record, "windows");
  const [type, picked] = Array.isArray(record?.top) ? record.top : [];
  // What the record's `top` calls a direction (C-3, in the page's words); a record from before it holds a thinking type.
  const label = Object.hasOwn(W.directions, type ?? "") ? W.directions[type] : easyCognitionLabels[type];
  const held = Math.min(windows, Math.max(0, Math.trunc(Number(picked) || 0)));
  if (label && held * 2 >= windows) return held === windows ? LOGIC_REPORT_COPY.heldAll(windows, label) : LOGIC_REPORT_COPY.held(windows, held, label);
  const ended = count(record, "breaks") + count(record, "busts");
  if (ended > 0) return LOGIC_REPORT_COPY.broken(ended);
  return count(record, "switches") > 0 ? LOGIC_REPORT_COPY.switched(count(record, "switches")) : LOGIC_REPORT_COPY.unbroken;
}

/**
 * The panel: its name, its mark and its lines in order -- the case and what
 * the hand did there, the score with the longest streak and the rank beside
 * it, and what the score measures. Null for a season with no record at all (a
 * save from before the streak), which prints no panel.
 *
 * A season on no ranking (`getRankedLogicHold`) carries no rank line whatever
 * the standing is.
 */
export function createLogicReport({ caseResults = {}, cases = [], standing = LOGIC_STANDING_PENDING } = {}) {
  const season = getSeasonLogic(caseResults);
  if (!("bestLogic" in season)) return null;
  const recorded = cases.filter((caseItem) => count(caseResults[caseItem.id]?.logicRecord, "windows") > 0);
  const hottest = recorded.length >= LOGIC_REPORT_MIN_CASES ? getHottestCase(caseResults, cases) : null;
  const ranked = getRankedLogicHold(caseResults) !== null;
  const scored = "logicHold" in season;
  return {
    label: LOGIC_REPORT_COPY.label,
    mark: LOGIC_REPORT_COPY.mark,
    lines: [
      hottest ? `${LOGIC_REPORT_COPY.lead(fill(W.caseName, { label: hottest.label, title: hottest.title }))} ${describeLogicCase(hottest.record)}` : LOGIC_REPORT_COPY.tooFew,
      [scored && LOGIC_REPORT_COPY.hold(season.logicHold), LOGIC_REPORT_COPY.best(season.bestLogic), ranked && getLogicRankLine(standing)].filter(Boolean).join(" · "),
      LOGIC_REPORT_COPY.caption,
    ],
  };
}
