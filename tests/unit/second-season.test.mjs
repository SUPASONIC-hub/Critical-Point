import assert from "node:assert/strict";
import { test } from "node:test";

import { CASE_SEQUENCE } from "../../src/gameCases.js";
import { getCaseOutcome } from "../../src/gameLogic.js";
import { VERDICT_ENDINGS } from "../../src/verdictBranch.js";
import {
  CASE_ECHOES,
  createSecondSeason,
  getCaseComparison,
  getCaseEcho,
  getCaseRecall,
  getSeasonPage,
  isCaseFirstPage,
  pastSeasonEnding,
  pastSeasonResults,
} from "../../src/state/secondSeason.js";

/**
 * The second season (개선 포인트 3-5절): what a NEW GAME+ season shows of the
 * one before it. E-2 and B-14(2) first.
 */

const MEMORY = {
  prologue01: { outcomeChoiceId: "p1_after_credit", outcomeNodeId: "p1_aftershock" },
  case10: { outcomeChoiceId: "c10_after_record", outcomeNodeId: "c10_aftershock" },
  case11: { outcomeChoiceId: "c11_not_an_aftermath" },
  final: { runId: "first-run", outcomeChoiceId: "f_after_witness", endingVariant: { id: "quiet-cover", label: "QUIET COVER", failure: false } },
};
const RECORD = {
  seasons: 1,
  countedRuns: ["first-run"],
  previous: null,
  last: { runId: "first-run", endingId: "quiet-cover", endingLabel: "QUIET COVER", verdict: "ending_seal", tableRules: 2, line: "x" },
};

test("the first page of a case says how the last season closed it, by the aftermath's own title", () => {
  assert.equal(getCaseRecall(MEMORY, "case10"), "지난 시즌 이 사건은 ‘분담표가 담당자 이름 없이도 도는 문서가 되었다’로 닫혔습니다.");
  // 으로 after a consonant that is not ㄹ.
  assert.match(getCaseRecall({ x: 1, prologue01: { outcomeChoiceId: "p1_after_record" } }, "prologue01"), /적었다’로 닫혔습니다\.$/);
  // A case the last season did not close, or closed on no aftermath this build knows, says nothing.
  assert.equal(getCaseRecall(MEMORY, "case12"), null);
  assert.equal(getCaseRecall(MEMORY, "case11"), null);
  assert.equal(getCaseRecall(null, "case10"), null);
});

test("the case result compares the two aftermaths by their tags", () => {
  const record = getCaseOutcome({ caseId: "case10", choiceId: "c10_after_record" });
  const rest = getCaseOutcome({ caseId: "case10", choiceId: "c10_after_rest" });
  assert.equal(getCaseComparison(MEMORY, "case10", rest), "지난 시즌 제도로 남긴 결말 → 이번 불을 끈 결말");
  assert.equal(getCaseComparison(MEMORY, "case10", record), "지난 시즌과 같은 제도로 남긴 결말");
  assert.equal(getCaseComparison(MEMORY, "case12", rest), null);
  assert.equal(getCaseComparison(MEMORY, "case10", getCaseOutcome({ caseId: "case10", choiceId: "nothing" })), null);
});

test("the memory is the season before only while this run's finale has not written over it", () => {
  assert.equal(pastSeasonResults(MEMORY, "second-run"), MEMORY);
  assert.equal(pastSeasonResults(MEMORY, "first-run"), null);
  assert.equal(pastSeasonResults({ case01: {} }, "second-run"), null);
  // The record: `last` until this run is counted, then `previous`.
  assert.equal(pastSeasonEnding(RECORD, "second-run").verdict, "ending_seal");
  const counted = { ...RECORD, seasons: 2, countedRuns: ["first-run", "second-run"], previous: RECORD.last, last: { ...RECORD.last, runId: "second-run", verdict: "ending_expose" } };
  assert.equal(pastSeasonEnding(counted, "second-run").verdict, "ending_seal");
  // A device with only the memory knows a collapse and nothing else.
  assert.equal(pastSeasonEnding(null, "r", MEMORY), null);
  assert.deepEqual(pastSeasonEnding(null, "r", { final: { runId: "a", endingVariant: { id: "collapse", failure: true } } }), { verdict: "collapse" });
});

test("only a NEW GAME+ run is handed the season before; every run is handed its number", () => {
  const plain = createSecondSeason({ record: RECORD, memory: MEMORY, runId: "second-run", veteran: false });
  assert.deepEqual({ ...plain, before: plain.before.verdict }, { round: 2, rowTitle: "SEASON 02 COMPLETE", before: "ending_seal", veteran: false, results: null, past: null, seen: null });
  const carried = createSecondSeason({ record: RECORD, memory: MEMORY, runId: "second-run", veteran: true });
  assert.equal(carried.round, 2);
  assert.equal(carried.results, MEMORY);
  assert.equal(carried.past.verdict, "ending_seal");
  // The cloud brought the season, not the memory: nothing to compare.
  const cloud = createSecondSeason({ record: RECORD, memory: null, runId: "second-run", veteran: true });
  assert.equal(getSeasonPage({ secondSeason: cloud, currentCase: "case10", firstPage: true }), null);
  assert.equal(createSecondSeason().round, 1);
});

test("a case's first page is the one before anything in it is answered", () => {
  assert.equal(isCaseFirstPage([], "prologue01"), true);
  const log = [{ caseId: "case09", nodeId: "c9_aftershock" }, { isSystemEvent: true }];
  assert.equal(isCaseFirstPage(log, "case10"), true);
  assert.equal(isCaseFirstPage([...log, { caseId: "case10", nodeId: "c10_start" }], "case10"), false);
});

test("the page carries the ruling's line on its four cases and the recall wherever the last season closed the case", () => {
  const secondSeason = createSecondSeason({ record: RECORD, memory: MEMORY, runId: "second-run", veteran: true });
  assert.deepEqual(getSeasonPage({ secondSeason, currentCase: "case10", firstPage: true }), { echo: null, recall: getCaseRecall(MEMORY, "case10") });
  assert.equal(getSeasonPage({ secondSeason, currentCase: "case10", firstPage: false }), null);
  assert.deepEqual(getSeasonPage({ secondSeason, currentCase: "case48", firstPage: true }), { echo: CASE_ECHOES.case48.ending_seal, recall: null });
  // 프롤로그 01 keeps the season's own line, with the recall under it.
  const first = getSeasonPage({ secondSeason, currentCase: "prologue01", firstPage: true, opening: "season line" });
  assert.equal(first.echo, "season line");
  assert.match(first.recall, /^지난 시즌 이 사건은 ‘의견은 사수의 이름으로 올라갔다’로/);
  // A plain run keeps only what useRunReadout gave it.
  const plain = createSecondSeason({ record: RECORD, memory: MEMORY, runId: "second-run" });
  assert.equal(getSeasonPage({ secondSeason: plain, currentCase: "case48", firstPage: true }), null);
});

test("the ruling's lines are on real cases, one for each ruling that carries a line", () => {
  for (const [caseId, lines] of Object.entries(CASE_ECHOES)) {
    assert.ok(CASE_SEQUENCE.includes(caseId), caseId);
    assert.deepEqual(Object.keys(lines).sort(), [...Object.keys(VERDICT_ENDINGS), "collapse"].sort(), caseId);
    for (const line of Object.values(lines)) {
      assert.match(line, /^지난 시즌/);
      assert.ok(!line.includes("세션"), "지난 시즌, never 세션 (문구 질문 2)");
    }
  }
  assert.equal(getCaseEcho("case48", "open"), null);
  assert.equal(getCaseEcho("case47", "ending_seal"), null);
});

test("E-5: the card and its shared line carry the season's number, the ending before and the week's rule", async () => {
  const { buildResultCardModel, buildShareText, RESULT_CARD_LABELS } = await import("../../src/resultCardModel.js");
  const { seasonLabel, getSeasonCard } = await import("../../src/state/secondSeason.js");
  assert.equal(seasonLabel(2), "SEASON 02");
  assert.equal(seasonLabel(undefined), "SEASON 01");
  assert.equal(seasonLabel(12), "SEASON 12");
  const second = createSecondSeason({ record: RECORD, memory: null, runId: "second-run" });
  assert.deepEqual(getSeasonCard({ secondSeason: second, endingLabel: "HUMAN RECORD", weekRuleLabel: "NEAR WALL" }), {
    season: "SEASON 02 · FINAL RECORD",
    share: " 2회차 · 지난 시즌 QUIET COVER → 이번 HUMAN RECORD · 이번 주의 규칙 NEAR WALL.",
  });
  assert.deepEqual(getSeasonCard({ secondSeason: createSecondSeason(), endingLabel: "HUMAN RECORD" }), { season: RESULT_CARD_LABELS.season, share: "" });
  const card = getSeasonCard({ secondSeason: second, endingLabel: "HUMAN RECORD" });
  const model = buildResultCardModel({ ...card, endingName: "x" });
  assert.equal(model.season, "SEASON 02 · FINAL RECORD");
  assert.match(buildShareText(model, "https://a.example"), /랭크\. 2회차 · 지난 시즌 QUIET COVER → 이번 HUMAN RECORD\. https:\/\/a\.example\/$/);
  // A card handed nothing keeps the first season's words.
  assert.equal(buildResultCardModel({}).season, RESULT_CARD_LABELS.season);
  assert.ok(!buildShareText(buildResultCardModel({})).includes("회차"));
});

test("E-5: the season's row is titled by its number", async () => {
  const { createSeasonLeaderboardRow, createSeasonTelemetryPayload } = await import("../../src/viewModels/seasonViewModels.js");
  assert.equal(createSeasonLeaderboardRow({ caseSummary: {}, title: createSecondSeason({ record: { ...RECORD, seasons: 2 } }).rowTitle }).case_title, "SEASON 03 COMPLETE");
  assert.equal(createSeasonLeaderboardRow({ caseSummary: {} }).case_title, "SEASON 01 COMPLETE");
  assert.equal(createSeasonTelemetryPayload({ caseSummary: {}, title: "SEASON 02 COMPLETE" }).case_title, "SEASON 02 COMPLETE");
});

test("E-1: a NEW GAME+ page says whether a season before read its scene", () => {
  const seen = new Set(["c10_open"]);
  const veteran = createSecondSeason({ record: RECORD, memory: MEMORY, runId: "second-run", veteran: true, seen });
  assert.equal(veteran.seen, seen);
  assert.equal(createSecondSeason({ veteran: true, seen: ["c10_open"] }).seen, null, "only a Set is carried");
  assert.equal(createSecondSeason({ veteran: false, seen }).seen, null, "a plain season folds nothing");
  // Any page: the scene's read alone, the first page's lines beside it.
  assert.deepEqual(getSeasonPage({ secondSeason: veteran, currentCase: "case10", firstPage: false, read: true }), { echo: null, recall: null, read: true });
  assert.deepEqual(getSeasonPage({ secondSeason: veteran, currentCase: "case10", firstPage: true, read: false }), {
    echo: null,
    recall: getCaseRecall(MEMORY, "case10"),
    read: false,
  });
  assert.equal(getSeasonPage({ secondSeason: veteran, currentCase: "case10", firstPage: false, read: null }), null);
  const plain = createSecondSeason({ record: RECORD, memory: MEMORY, runId: "second-run", veteran: false });
  assert.equal(getSeasonPage({ secondSeason: plain, currentCase: "case10", firstPage: false, read: true }), null);
});
