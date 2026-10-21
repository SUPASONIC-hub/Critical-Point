/**
 * What NEW GAME+ carries from a finished season into the next one: the record
 * and the story, never the table (NEWGAMEPLUS 설계안 3절, 결정 1 (1)).
 *
 * - the season count and how the last season ended, kept in a device key of
 *   its own (`SEASON_RECORD_KEY`), counted once per run;
 * - a line under the next season's first scene that answers the last ruling
 *   (`getOpeningEcho`);
 * - a mark on every case summary of a season begun with NEW GAME+
 *   (`newGamePlusMark`), which the ranking does not read and the server's
 *   scene bust rates will.
 *
 * Tools, resources, caps and skipped cases are not carried: the finale is
 * played under the same table as a first season's, so the season is ranked
 * with every other.
 *
 * Everything here is a pure function of what it is handed. Writing the key,
 * the run's `echo` and the screens are the next pieces; until then nothing in
 * the game imports this file.
 */
import { OPENING_ECHO } from "./openingState.js";
import { getVerdictKey } from "../verdictBranch.js";

/** The device key: outside the save, kept by a reset, like the NEW GAME+ memory. */
export const SEASON_RECORD_KEY = "critical-point-season-record-v1";

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

/**
 * DRAFT (결정 13 (1)): the four lines are to be chosen by numbered question
 * and run through check:canon, check:dialogue and check:plain-language before
 * they are shown. Seal and collapse are the design's drafts; reform and expose
 * are written in the same voice -- the TriggerLab experiment's record speaking
 * to the next session, not time wound back (the season opens three years
 * earlier, docs/canon.md). The open verdict keeps `OPENING_ECHO`.
 */
const OPENING_ECHOES = Object.freeze({
  ending_seal: "지난 세션의 기록은 봉인된 채 이 방에 들어왔습니다. 이번에는 무엇을 닫을지 먼저 보겠습니다.",
  ending_reform: "지난 세션의 기록은 사용 규칙이 되어 이 방에 남았습니다. 이번에는 그 규칙이 버티는지 보겠습니다.",
  ending_expose: "지난 세션의 기록은 이미 바깥에 나가 있습니다. 이번에는 무엇을 먼저 지킬지 보겠습니다.",
  collapse: "지난 세션은 사람 피해의 선을 넘고 닫혔습니다. 그 기록이 이번 첫 질문 옆에 놓여 있습니다.",
});

const EMPTY_RECORD = Object.freeze({ seasons: 0, countedRuns: Object.freeze([]), last: null });

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeLast(value) {
  if (!isPlainObject(value) || typeof value.endingId !== "string" || !value.endingId) return null;
  const verdict = Object.hasOwn(VERDICT_NAMES, value.verdict ?? "") ? value.verdict : null;
  return {
    runId: typeof value.runId === "string" ? value.runId : null,
    endingId: value.endingId,
    endingLabel: typeof value.endingLabel === "string" ? value.endingLabel : "",
    verdict,
    verdictName: verdict ? VERDICT_NAMES[verdict] : null,
    tableRules: Number.isInteger(value.tableRules) ? value.tableRules : null,
  };
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
  return { seasons, countedRuns, last: normalizeLast(record.last) };
}

/**
 * The record after a finale has closed. `finalSummary` is the finale's case
 * summary (`caseResults.final`, with `endingVariant` and `gauntlet`), and
 * `finalChoiceId` the choice made at the finale's last question
 * (`findFinalChoiceEntry(log)?.choiceId`, verdictBranch.js) -- the summary
 * keeps only the card the finale closed on, which is not the verdict.
 *
 * A run is counted once: a replayed finale changes how the last season ended
 * but is not another season. Anything that is not a closed finale returns the
 * record as it was.
 */
export function recordFinishedSeason(record, { runId, finalSummary, finalChoiceId } = {}) {
  const current = normalizeSeasonRecord(record);
  const endingVariant = finalSummary?.endingVariant;
  if (typeof runId !== "string" || !runId || !isPlainObject(endingVariant) || typeof endingVariant.id !== "string") return current;
  const verdict = getVerdictKey({ endingVariant, finalChoiceId });
  const last = normalizeLast({
    runId,
    endingId: endingVariant.id,
    endingLabel: endingVariant.label,
    verdict,
    tableRules: finalSummary?.gauntlet?.tableRules,
  });
  const counted = current.countedRuns.includes(runId);
  return {
    seasons: counted ? current.seasons : current.seasons + 1,
    countedRuns: counted ? current.countedRuns : [...current.countedRuns, runId].slice(-COUNTED_RUNS_KEPT),
    last,
  };
}

/**
 * What the next season is handed, or null before any season has finished.
 * `round` is the number of the season about to start (2 after the first).
 *
 * `memory` is the NEW GAME+ memory (`readNewGamePlusMemory`): a device that
 * finished a season before the record existed has the memory and no record.
 * Its ending is read from there; its verdict is not, because the memory keeps
 * no finale choice, so that season opens on `OPENING_ECHO` unless it collapsed.
 */
export function getSeasonCarry(record, memory = null) {
  const current = normalizeSeasonRecord(record);
  if (current.seasons > 0 && current.last) return { round: current.seasons + 1, ...current.last, echo: getOpeningEcho(current.last.verdict) };
  const finalSummary = isPlainObject(memory) ? memory.final : null;
  const endingVariant = finalSummary?.endingVariant;
  if (!isPlainObject(endingVariant) || typeof endingVariant.id !== "string") return null;
  const last = normalizeLast({
    runId: finalSummary.runId,
    endingId: endingVariant.id,
    endingLabel: endingVariant.label,
    verdict: endingVariant.failure === true ? "collapse" : null,
    tableRules: finalSummary.gauntlet?.tableRules,
  });
  return { round: Math.max(current.seasons, 1) + 1, ...last, echo: getOpeningEcho(last.verdict) };
}

/** The line under a NEW GAME+ season's first scene: the last ruling's, or the opening line. */
export function getOpeningEcho(verdict) {
  return Object.hasOwn(OPENING_ECHOES, verdict ?? "") ? OPENING_ECHOES[verdict] : OPENING_ECHO;
}

/**
 * The mark a case summary of a NEW GAME+ season carries, spread into it like
 * `assistStory` (useChoiceCommit): `{ newGamePlus: true }` on every case of a
 * run begun with NEW GAME+, nothing otherwise. `run` is the gauntlet's run
 * (the save's `dynamics`), whose `veteran` the run was opened with.
 *
 * Every case, not only the prologues that play differently
 * (`VETERAN_TABLE_CASES`, tableUnlocks.js): the server picks those by
 * `case_id`, and a later server check that replays a season's tables needs to
 * know which ladder every case of it was on.
 */
export function newGamePlusMark(run) {
  return run?.veteran === true ? { newGamePlus: true } : {};
}
