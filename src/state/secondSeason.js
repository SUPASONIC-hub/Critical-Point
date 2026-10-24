/**
 * The second season's reading (개선 포인트 3-5절, 미반영 계획 2-1 순서 16):
 * what a season begun with NEW GAME+ shows of the one before it, beside the
 * story and never on the table.
 *
 * - E-2: on the page that opens a case, a grey line saying how the last
 *   season closed it (`getCaseRecall`), and on the case's result
 *   「지난 시즌 ○○ · 이번 시즌 ○○」 (`getCaseComparison`). Read only from the NEW
 *   GAME+ memory's case summaries (`outcomeChoiceId`) and the case's own
 *   aftermath tag and title, so a device without the memory -- a season
 *   carried in by the cloud save -- shows neither.
 * - B-14(2): on 프롤로그 02, 사건 01, 사건 48 and the finale, the line the
 *   last ruling leaves (`CASE_ECHOES`), as 프롤로그 01 already has one.
 *
 * Everything here is a pure function of what it is handed; useNewGamePlus
 * reads storage and hands the result out as `secondSeason`.
 */
import { getSeasonRound } from "../appConfig.js";
import { getCaseOutcome } from "../gameLogic.js";
import { isPlainObject, normalizeSeasonRecord } from "./seasonRecord.js";

// What getCaseOutcome answers for a choice its case has no aftermath for.
const UNRECORDED_TAG = getCaseOutcome({ caseId: "", choiceId: "" }).tag;

/**
 * The lines the last ruling leaves on four cases' first pages (B-14(2)).
 * As the user settled them on 2026-10-23 (문구 질문 4~19, all (1)): two sentences each,
 * as the season's opening line is -- what became of the last season's record,
 * then what this one will watch. A season whose verdict is open, or unknown,
 * has none.
 */
export const CASE_ECHOES = Object.freeze({
  prologue02: Object.freeze({
    ending_seal: "지난 시즌의 기록은 봉인된 채 끝났습니다. 이번 의견서가 누구의 서랍에 들어가는지 보겠습니다.",
    ending_reform: "지난 시즌의 기록은 기준표로 남았습니다. 이번 의견서가 그 기준의 첫 줄이 되는지 보겠습니다.",
    ending_expose: "지난 시즌의 기록은 바깥으로 나갔습니다. 이번 의견서에 누구의 이름이 함께 실리는지 보겠습니다.",
    collapse: "지난 시즌은 사람이 치른 값 앞에서 멈췄습니다. 이번 의견서가 그 값을 먼저 적는지 보겠습니다.",
  }),
  case01: Object.freeze({
    ending_seal: "지난 시즌의 기록은 봉인되었지만 이 서류철은 다시 열렸습니다. 이번 72시간에는 무엇을 닫을지 보겠습니다.",
    ending_reform: "지난 시즌에 남긴 기준표는 이 분석관실에 아직 닿지 않았습니다. 이번 72시간에 그 기준을 다시 세우는지 보겠습니다.",
    ending_expose: "지난 시즌에 내보낸 기록은 보호받아야 할 이름 가까이까지 번졌습니다. 이번 72시간에는 누구를 먼저 지킬지 보겠습니다.",
    collapse: "지난 시즌의 운영은 사람 피해를 감당하지 못하고 무너졌습니다. 이번 72시간에는 그 값이 누구에게 가는지 먼저 보겠습니다.",
  }),
  case48: Object.freeze({
    ending_seal: "지난 시즌의 기록은 봉인되었지만 같은 조항은 다른 이름으로 돌아왔습니다. 이번에는 그 조항 옆에 누가 이름을 적는지 보겠습니다.",
    ending_reform: "지난 시즌의 기록은 사용 규칙의 기준표가 되었습니다. 이번에는 그 감시가 제7조까지 닿는지 보겠습니다.",
    ending_expose: "지난 시즌의 기록은 바깥에서 읽혔습니다. 이번에는 제7조를 쓴 사람들의 이름이 어디까지 번지는지 보겠습니다.",
    collapse: "지난 시즌은 사람이 치른 값을 감당하지 못하고 멈췄습니다. 이번에는 이 조항에 걸린 사람들 앞에 끝까지 서 있는지 보겠습니다.",
  }),
  final: Object.freeze({
    ending_seal: "지난 시즌의 당신은 이 기록을 봉인했습니다. 이번에도 같은 문을 닫을지 보겠습니다.",
    ending_reform: "지난 시즌의 당신은 이 기록을 사용 규칙으로 바꿨습니다. 이번에도 같은 규칙을 고를지 보겠습니다.",
    ending_expose: "지난 시즌의 당신은 이 기록을 바깥에 내보냈습니다. 이번에도 같은 문을 열지 보겠습니다.",
    collapse: "지난 시즌은 이 자리까지 왔지만 사람이 치른 값을 감당하지 못했습니다. 이번에는 무엇을 먼저 셀지 보겠습니다.",
  }),
});

/** The line the last ruling leaves on this case's first page, or null. */
export function getCaseEcho(caseId, verdict) {
  const lines = Object.hasOwn(CASE_ECHOES, caseId ?? "") ? CASE_ECHOES[caseId] : null;
  return lines && Object.hasOwn(lines, verdict ?? "") ? lines[verdict] : null;
}

/**
 * The NEW GAME+ memory when it is a season before this run: the memory is
 * written again when this run's own finale closes (useNewGamePlus.unlock),
 * and compared with itself every case would read "the same".
 */
export function pastSeasonResults(memory, runId) {
  if (!isPlainObject(memory) || !isPlainObject(memory.final)) return null;
  return typeof runId === "string" && memory.final.runId === runId ? null : memory;
}

/**
 * How the season before this run ended, as the record keeps it: `last`, or
 * `previous` once this run's finale has been counted. A device with only the
 * memory knows a collapse and nothing else.
 */
export function pastSeasonEnding(record, runId, memory = null) {
  const { last, previous } = normalizeSeasonRecord(record);
  const ending = last && typeof runId === "string" && last.runId === runId ? previous : last;
  if (ending) return ending;
  return pastSeasonResults(memory, runId)?.final?.endingVariant?.failure === true ? { verdict: "collapse" } : null;
}

/** The aftermath a stored case summary closed on, or null when its case has none for it. */
function closedOutcome(results, caseId) {
  const choiceId = results?.[caseId]?.outcomeChoiceId;
  if (typeof choiceId !== "string" || !choiceId) return null;
  const outcome = getCaseOutcome({ caseId, choiceId });
  return outcome.tag === UNRECORDED_TAG ? null : outcome;
}

/**
 * 「지난 시즌 이 사건은 ‘{tag}’로 닫혔습니다.」 for a case the last season closed,
 * by the tag the result's comparison line names it by (문구 질문 1, (1)), or null.
 */
export function getCaseRecall(results, caseId) {
  const outcome = closedOutcome(results, caseId);
  // Every tag ends on 결말 (tests/unit/second-season.test.mjs), so the particle is always 로.
  return outcome ? `지난 시즌 이 사건은 ‘${outcome.tag}’로 닫혔습니다.` : null;
}

/**
 * The case result's 「지난 시즌 ○○ · 이번 시즌 ○○」, by the two aftermaths' tags --
 * the season comparison's shape (newGamePlusCarry.js) -- or null when either is
 * unknown. The same aftermath twice reads 「지난 시즌에도 ○○」 (문구 질문 2·3, (1)).
 */
export function getCaseComparison(results, caseId, outcome) {
  const past = closedOutcome(results, caseId);
  if (!past || !outcome?.tag || outcome.tag === UNRECORDED_TAG) return null;
  return past.tag === outcome.tag ? `지난 시즌에도 ${outcome.tag}` : `지난 시즌 ${past.tag} · 이번 시즌 ${outcome.tag}`;
}

/**
 * Whether the scene up is the first page of its case: nothing answered in the
 * case yet. The log runs the whole season, so it is its last entry with a
 * case that says; a case replayed straight after it closed reads as not.
 */
export function isCaseFirstPage(log, currentCase) {
  const last = [...(Array.isArray(log) ? log : [])].reverse().find((entry) => typeof entry?.caseId === "string");
  return !last || last.caseId !== currentCase;
}

/**
 * What the second season knows, read once per change of the record, the
 * memory or the run (useNewGamePlus): the season number, and for a run begun
 * with NEW GAME+ (`veteran`) the season before it.
 */
export function createSecondSeason({ record = null, memory = null, runId = null, veteran = false, seen = null, picks = null } = {}) {
  const round = getSeasonRound(normalizeSeasonRecord(record), runId, memory);
  // How the season before ended, for any run's card (E-5); the story lines read it only on NEW GAME+.
  const before = pastSeasonEnding(record, runId, memory);
  // The season's row title (seasonViewModels.js, whose chunk is the entry's).
  const rowTitle = `${seasonLabel(round)} COMPLETE`;
  if (veteran !== true) return { round, rowTitle, before, veteran: false, results: null, past: null, seen: null, picks: null };
  // `seen`: the scenes the seasons before read (seenScenes.pastSeenScenes, E-1), a Set or null.
  // `picks`: the card the season before picked in each scene (pastPicks.pastPicks, B-14(1)), a Map or null.
  return {
    round,
    rowTitle,
    before,
    veteran: true,
    results: pastSeasonResults(memory, runId),
    past: before,
    seen: seen instanceof Set ? seen : null,
    picks: picks instanceof Map && picks.size > 0 ? picks : null,
  };
}

/**
 * B-14(1) 「지난 시즌의 당신」: the id of the card the season before picked
 * in this scene, or null -- not a NEW GAME+ run, nothing kept, or no pick
 * there. A mark on the board only: the page carries it (`getSeasonPage`),
 * never the log, the commit or the reading clock.
 */
export function getScenePick(secondSeason, nodeId) {
  const picked = secondSeason?.veteran === true && secondSeason.picks instanceof Map ? secondSeason.picks.get(nodeId) : null;
  return typeof picked === "string" && picked ? picked : null;
}

/** 「SEASON 02」: the season's number as the card and the telemetry label print it. */
export function seasonLabel(round) {
  return `SEASON ${String(Number.isInteger(round) && round > 0 ? round : 1).padStart(2, "0")}`;
}

/**
 * E-5: what the result card and its shared line say of the season's number,
 * made here so the card's chunk prints strings it is handed (it had about 40
 * gzip bytes left). `season` is the card's corner, `share` what follows the
 * shared line: 「2회차 · 지난 시즌 결말 ‘X’ · 이번 주의 규칙 NAME.」, each
 * part only when it is known, or an empty string. X is the season before's
 * ending by its Korean name (`pastEndingName`, runtimeSystems.getEndingPreview's label),
 * the name the line before it gives this season's ending, which is not said
 * again (문구 질문 20, (1)). The week's rule rides on a first season's line too. It starts on a space,
 * so the card's chunk appends it as it is.
 */
export function getSeasonCard({ secondSeason, pastEndingName = "", weekRuleLabel = "" } = {}) {
  const round = secondSeason?.round ?? 1;
  const parts = [
    round > 1 ? `${round}회차` : "",
    round > 1 && pastEndingName ? `지난 시즌 결말 ‘${pastEndingName}’` : "",
    weekRuleLabel ? `이번 주의 규칙 ${weekRuleLabel}` : "",
  ].filter(Boolean);
  return { season: `${seasonLabel(round)} · FINAL RECORD`, share: parts.length ? ` ${parts.join(" · ")}.` : "" };
}

/**
 * The first page's two NEW GAME+ lines, or null: `echo` under the NEW GAME+
 * kicker -- 프롤로그 01's season line (`opening`, useRunReadout) or the case's
 * B-14(2) line -- and `recall`, the grey line of E-2. `firstPage` is
 * `isCaseFirstPage`'s answer.
 */
function getSeasonLines({ secondSeason, currentCase, firstPage, opening }) {
  if (!secondSeason?.veteran || !firstPage) return opening ? { echo: opening, recall: null } : null;
  const echo = opening ?? getCaseEcho(currentCase, secondSeason.past?.verdict);
  const recall = getCaseRecall(secondSeason.results, currentCase);
  return echo || recall ? { echo, recall } : null;
}

/**
 * What a NEW GAME+ season's page carries: the first page's lines, and on any
 * page `read` (E-1, seenScenes.getSceneRead) -- true for a scene a season
 * before read, which the briefing folds, false for one none did, which it
 * marks NEW -- and `picked` (B-14(1), `getScenePick`), the id of the card
 * the season before picked here. Each only when known; null when there is
 * nothing at all.
 */
export function getSeasonPage({ secondSeason, currentCase, firstPage, opening = null, read = null, picked = null }) {
  const lines = getSeasonLines({ secondSeason, currentCase, firstPage, opening });
  const hasRead = typeof read === "boolean";
  const hasPick = typeof picked === "string" && picked !== "";
  if ((!hasRead && !hasPick) || !secondSeason?.veteran) return lines;
  return { echo: null, recall: null, ...lines, ...(hasRead ? { read } : null), ...(hasPick ? { picked } : null) };
}
