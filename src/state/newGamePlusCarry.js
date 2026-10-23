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
 * the run's `echo` and the screens read it; the record's own shape and the
 * season number, which the entry chunk's intro reads, are in seasonRecord.js.
 */
import { OPENING_ECHO } from "./openingState.js";
import { countRun, isPlainObject, normalizeLast, normalizeSeasonRecord, VERDICT_NAMES } from "./seasonRecord.js";
import { getVerdictKey } from "../verdictBranch.js";

export { getSeasonRound, normalizeSeasonRecord, SEASON_RECORD_KEY, VERDICT_NAMES } from "./seasonRecord.js";

/**
 * The line each ruling's season is followed by (NEWGAMEPLUS 문구 질문 1-7,
 * user's answer of 2026-10-21: all (1)). Two sentences each, as
 * `OPENING_ECHO` is: what became of the last season's record, then what this
 * one will watch. "지난 시즌", the name every other NEW GAME+ line uses, not
 * "세션", which the screen already spends on the session code. No "이 방":
 * the line stands over 프롤로그 01, a bank office in 2022, before the lab
 * existed (docs/canon.md). The seal's season came back under another name,
 * which is the cost its verdict names (endingCopy.js); the collapse is said in
 * its ending's own words, true through either of its two doors
 * (seasonStanding.js). The open verdict, and a device that cannot know its
 * verdict, keep `OPENING_ECHO`.
 */
const OPENING_ECHOES = Object.freeze({
  ending_seal: "지난 시즌의 기록은 봉인되었지만 실험은 다른 이름으로 돌아왔습니다. 이번에는 무엇을 닫을지 먼저 보겠습니다.",
  ending_reform: "지난 시즌의 기록은 사용 규칙의 기준표가 되었습니다. 이번에는 그 감시가 얼마나 버티는지 보겠습니다.",
  ending_expose: "지난 시즌의 기록은 이미 바깥에 나가 있습니다. 이번에는 무엇을 먼저 지킬지 보겠습니다.",
  collapse: "지난 시즌은 사람이 치른 값을 감당하지 못하고 멈췄습니다. 보존된 그 기록이 이번 첫 질문 옆에 놓여 있습니다.",
});

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
 *
 * `previous` is how the season before this run's ended: the `last` a new run
 * finds, kept through its replayed finales. The finale's comparison line
 * reads it -- the record is written before the result is drawn, so `last` is
 * already this season's by then, and compared with itself every ending was
 * "the same ending" (#220 review, 10-21).
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
    line: getMemoryLine({ endingLabel: endingVariant.label, verdict }),
  });
  const counted = current.countedRuns.includes(runId);
  return {
    seasons: counted ? current.seasons : current.seasons + 1,
    countedRuns: counted ? current.countedRuns : countRun(current.countedRuns, runId),
    last,
    previous: counted ? current.previous : current.last,
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

/**
 * How the start screen's NEW GAME+ panel names a finished season
 * (NEWGAMEPLUS 문구 질문 10, all (1)), written into the record when the season
 * is counted (advancedSystems.getPastRunMemory reads it). The verdict is
 * named only for the three the result screen names (봉인·개혁·폭로); a
 * collapse is its ending's own name, and an open verdict the ending alone,
 * with no promise of a line, since that season opens on the plain one. The
 * second sentence is conditional because the plain start, on the same screen,
 * carries nothing. NEW GAME+ is held together (a no-break space): with
 * `keep-all` the phone broke the line between NEW and GAME+.
 */
export function getMemoryLine({ endingLabel, verdict }) {
  const named = verdict && verdict !== "collapse" && verdict !== "open" ? `${VERDICT_NAMES[verdict]} · ` : "";
  return `지난 시즌: ${named}${endingLabel}.${verdict && verdict !== "open" ? " NEW\u00a0GAME+로 시작하면 첫 장면에 이 기록이 돌아옵니다." : ""}`;
}

/**
 * The finale's comparison line (NEWGAMEPLUS 문구 질문 13, all (1)), or null:
 * only on the run whose finale the record last counted, and only when there
 * is a season before it (`previous`). A different ending names both; the same
 * one says it was reached again; a season under other table rules than the
 * one before (`tableRules`, both known) says it is the first since they
 * changed, at the end of the same line.
 */
export function getSeasonComparison(record, runId) {
  const { last, previous } = normalizeSeasonRecord(record);
  if (!last || !previous || typeof runId !== "string" || last.runId !== runId) return null;
  const line =
    last.endingId === previous.endingId ? `지난 시즌과 같은 결말 ${last.endingLabel}에 다시 닿았습니다` : `지난 시즌 ${previous.endingLabel} · 이번 시즌 ${last.endingLabel}`;
  const rulesChanged = last.tableRules !== null && previous.tableRules !== null && last.tableRules !== previous.tableRules;
  if (rulesChanged) return `${line} · 판 규칙이 바뀐 뒤의 첫 시즌`;
  return last.endingId === previous.endingId ? `${line}.` : line;
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

/**
 * The line a NEW GAME+ season opens on, on the season's
 * first page only: a run begun with NEW GAME+, in 프롤로그 01, with nothing
 * answered and no case closed. The run's `echo` moves on with the first
 * answer, and a replayed 프롤로그 01 opens on its own line, so neither is
 * shown under the NEW GAME+ kicker. Null everywhere else. useRunReadout puts
 * it on the play spine; it lives here so its test does not load the hook.
 */
export function getSeasonOpening({ gauntletRun, currentCase, log, caseResults, echo }) {
  const first = gauntletRun?.veteran === true && currentCase === "prologue01" && (log?.length ?? 0) === 0 && Object.keys(caseResults ?? {}).length === 0;
  return first && typeof echo === "string" && echo.trim() ? echo : null;
}
