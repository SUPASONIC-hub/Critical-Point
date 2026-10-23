/**
 * The second season's reading (개선 포인트 3-5절, 미반영 계획 2-1 순서 16):
 * what a season begun with NEW GAME+ shows of the one before it, beside the
 * story and never on the table.
 *
 * - E-2: on the page that opens a case, a grey line saying how the last
 *   season closed it (`getCaseRecall`), and on the case's result
 *   「지난 시즌 ○○ → 이번 ○○」 (`getCaseComparison`). Read only from the NEW
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

/**
 * 로 or 으로 after a title, as playerLanguage.directionParticle picks it for
 * Korean text (a title ends on a syllable). Not imported: that module is the
 * entry chunk's, and handing one more of its functions to the runtime took
 * 9 bytes of an entry with none to spare (scripts/check-bundle-size.mjs).
 */
function directionParticle(word) {
  const code = String(word).trim().charCodeAt(String(word).trim().length - 1) - 0xac00;
  return code >= 0 && code <= 11171 && code % 28 !== 0 && code % 28 !== 8 ? "으로" : "로";
}

// What getCaseOutcome answers for a choice its case has no aftermath for.
const UNRECORDED_TAG = getCaseOutcome({ caseId: "", choiceId: "" }).tag;

/**
 * The lines the last ruling leaves on four cases' first pages (B-14(2)).
 * Drafts for the user to decide (문구 질문 후보, PR 본문): two sentences each,
 * as the season's opening line is -- what became of the last season's record,
 * then what this one will watch. A season whose verdict is open, or unknown,
 * has none.
 */
export const CASE_ECHOES = Object.freeze({
  prologue02: Object.freeze({
    ending_seal: "지난 시즌의 기록은 봉인된 채 끝났습니다. 이번 의견서가 누구의 서랍에 들어가는지 보겠습니다.",
    ending_reform: "지난 시즌의 기록은 사용 규칙의 기준표가 되었습니다. 이번 의견서가 그 기준의 첫 줄이 되는지 보겠습니다.",
    ending_expose: "지난 시즌의 기록은 바깥으로 나갔습니다. 이번 의견서에 누구의 이름이 함께 실리는지 보겠습니다.",
    collapse: "지난 시즌은 사람이 치른 값을 감당하지 못하고 멈췄습니다. 이번 의견서가 그 값을 먼저 적는지 보겠습니다.",
  }),
  case01: Object.freeze({
    ending_seal: "지난 시즌에 닫아 둔 기록은 이 회의실에서 열리지 않습니다. 이번 72시간에는 무엇을 닫을지 보겠습니다.",
    ending_reform: "지난 시즌에 남긴 기준표는 이 회의실에 아직 닿지 않았습니다. 이번 72시간에 그 기준을 다시 세우는지 보겠습니다.",
    ending_expose: "지난 시즌에 내보낸 기록은 이 회사의 이름 가까이까지 번졌습니다. 이번 72시간에는 누구를 먼저 지킬지 보겠습니다.",
    collapse: "지난 시즌은 사람이 치른 값을 감당하지 못하고 멈췄습니다. 이번 72시간에는 그 값이 누구에게 가는지 먼저 보겠습니다.",
  }),
  case48: Object.freeze({
    ending_seal: "지난 시즌에 제7조의 기록은 봉인된 서랍에 남았습니다. 이번에는 그 조항을 누가 꺼내는지 보겠습니다.",
    ending_reform: "지난 시즌의 기록은 이런 조항을 감시하는 기준이 되었습니다. 이번에는 그 감시가 제7조까지 닿는지 보겠습니다.",
    ending_expose: "지난 시즌에 제7조는 바깥에서 읽혔습니다. 이번에는 그 조항을 쓴 사람들의 이름이 어디까지 번지는지 보겠습니다.",
    collapse: "지난 시즌은 이 조항에 걸린 사람들을 지키지 못하고 멈췄습니다. 이번에는 끝까지 서 있는지 보겠습니다.",
  }),
  final: Object.freeze({
    ending_seal: "지난 시즌의 당신은 이 기록을 봉인했습니다. 이번에도 같은 문을 닫을지 보겠습니다.",
    ending_reform: "지난 시즌의 당신은 이 기록을 사용 규칙으로 바꿨습니다. 이번에도 같은 규칙을 고를지 보겠습니다.",
    ending_expose: "지난 시즌의 당신은 이 기록을 바깥에 내보냈습니다. 이번에도 같은 문을 열지 보겠습니다.",
    collapse: "지난 시즌은 이 자리에 닿기 전에 사람이 치른 값을 감당하지 못했습니다. 이번에는 무엇을 먼저 셀지 보겠습니다.",
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

/** 「지난 시즌 이 사건은 ‘…’로 닫혔습니다.」 for a case the last season closed, or null. */
export function getCaseRecall(results, caseId) {
  const outcome = closedOutcome(results, caseId);
  return outcome ? `지난 시즌 이 사건은 ‘${outcome.title}’${directionParticle(outcome.title)} 닫혔습니다.` : null;
}

/**
 * The case result's 「지난 시즌 ○○ → 이번 ○○」, by the two aftermaths' tags,
 * or null when either is unknown. The same aftermath twice says so.
 */
export function getCaseComparison(results, caseId, outcome) {
  const past = closedOutcome(results, caseId);
  if (!past || !outcome?.tag || outcome.tag === UNRECORDED_TAG) return null;
  return past.tag === outcome.tag ? `지난 시즌과 같은 ${outcome.tag}` : `지난 시즌 ${past.tag} → 이번 ${outcome.tag}`;
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
export function createSecondSeason({ record = null, memory = null, runId = null, veteran = false, seen = null } = {}) {
  const round = getSeasonRound(normalizeSeasonRecord(record), runId, memory);
  // How the season before ended, for any run's card (E-5); the story lines read it only on NEW GAME+.
  const before = pastSeasonEnding(record, runId, memory);
  // The season's row title (seasonViewModels.js, whose chunk is the entry's).
  const rowTitle = `${seasonLabel(round)} COMPLETE`;
  if (veteran !== true) return { round, rowTitle, before, veteran: false, results: null, past: null, seen: null };
  // `seen`: the scenes the seasons before read (seenScenes.pastSeenScenes, E-1), a Set or null.
  return { round, rowTitle, before, veteran: true, results: pastSeasonResults(memory, runId), past: before, seen: seen instanceof Set ? seen : null };
}

/** 「SEASON 02」: the season's number as the card and the telemetry label print it. */
export function seasonLabel(round) {
  return `SEASON ${String(Number.isInteger(round) && round > 0 ? round : 1).padStart(2, "0")}`;
}

/**
 * E-5: what the result card and its shared line say of the season's number,
 * made here so the card's chunk prints strings it is handed (it had about 40
 * gzip bytes left). `season` is the card's corner, `share` what follows the
 * shared line: 「2회차 · 지난 시즌 X → 이번 Y · 이번 주의 규칙 NAME.」, each
 * part only when it is known, or an empty string. It starts on a space,
 * so the card's chunk appends it as it is.
 */
export function getSeasonCard({ secondSeason, endingLabel = "", weekRuleLabel = "" } = {}) {
  const round = secondSeason?.round ?? 1;
  const pastLabel = secondSeason?.before?.endingLabel;
  const parts = [
    round > 1 ? `${round}회차` : "",
    round > 1 && pastLabel && endingLabel ? `지난 시즌 ${pastLabel} → 이번 ${endingLabel}` : "",
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
 * marks NEW. Null when there is neither.
 */
export function getSeasonPage({ secondSeason, currentCase, firstPage, opening = null, read = null }) {
  const lines = getSeasonLines({ secondSeason, currentCase, firstPage, opening });
  if (typeof read !== "boolean" || !secondSeason?.veteran) return lines;
  return { echo: null, recall: null, ...lines, read };
}
