import assert from "node:assert/strict";
import { test } from "node:test";

import { COLLAPSED_SEASON_MARK, getCollapseToll } from "../../src/featurePack.js";
import { CASE_SEQUENCE, seasonCasesBase } from "../../src/gameCases.js";
import { buildLeaderboard } from "../../src/ranking.js";
import { buildResultCardModel } from "../../src/resultCardModel.js";

/**
 * What a collapse leaves (improvement notes C4 and C6): the collapse panel
 * says what it cost from the season's own summaries, and a season that
 * collapsed is marked on the board and on its card, without a field the save
 * did not already carry.
 */

test("a collapse names the case that closed on the most harm, with that harm", () => {
  const toll = getCollapseToll({
    caseResults: { prologue01: { finalHumanCost: 31 }, case05: { finalHumanCost: 34 }, case02: { finalHumanCost: 0 } },
    cases: seasonCasesBase,
  });
  const case05 = seasonCasesBase.find((caseItem) => caseItem.id === "case05");
  assert.match(toll, new RegExp(`${case05.label} 「${case05.title}」`));
  assert.match(toll, /사람 피해 34를 남겼습니다/);
  assert.doesNotMatch(toll, /프롤로그 01/);
  // Nothing about the next season: story-promises-true took those promises out.
  assert.doesNotMatch(toll, /다음 (시즌|플레이|분석관)/);
  // C4 (2026-11-05 draft): the favours taken back, on the season's own harm --
  // 65 over three closed cases, cut to a tenth -- and no number of people laid
  // off, which the engine does not count.
  assert.match(toll, /휴가비와 학자금이 그 값 앞에서 가장 먼저 거둬집니다\. 당신이 밀어붙여 쌓인 사람 피해가 모두 65, 사건마다 평균 21\.6입니다\./);
  assert.doesNotMatch(toll, /실직|명/);
});

test("a collapse on the table's harm alone names no case, and its favours read the table's harm over the season", () => {
  const toll = getCollapseToll({ caseResults: {}, resources: { humanCost: 90 }, cases: seasonCasesBase });
  assert.doesNotMatch(toll, /「/);
  // Over the line, the favours (two sentences), and who paid.
  assert.equal(toll.split(". ").length, 4);
  assert.match(toll, new RegExp(`모두 90, 사건마다 평균 ${Math.floor(900 / CASE_SEQUENCE.length) / 10}입니다`));
});

test("only a season row that ended in the collapse is marked, local or remote", () => {
  const rows = buildLeaderboard([
    { local: true, run_id: "run-local", case_id: "season-final", score: 50, summary: { rank: "B", endingVariant: { id: "collapse", failure: true } } },
    { run_id: "run-remote", case_id: "season-final", score: 40, summary: { rank: "B", endingVariant: "collapse" } },
    { run_id: "run-case", case_id: "case05", score: 40, summary: { rank: "B", endingVariant: "collapse" } },
    { run_id: "run-quiet", case_id: "season-final", score: 30, summary: { rank: "B", endingVariant: "quiet-cover" } },
  ]);
  const collapsed = Object.fromEntries(rows.map((row) => [row.runId, row.collapsed]));
  assert.deepEqual(collapsed, { "run-local": true, "run-remote": true, "run-case": false, "run-quiet": false });
});

test("the card prints the mark on the ending's label it is handed", () => {
  const model = buildResultCardModel({ endingVariant: { label: `SYSTEM COLLAPSE · ${COLLAPSED_SEASON_MARK}`, failure: true } });
  assert.equal(model.endingLabel, "SYSTEM COLLAPSE · 붕괴한 시즌");
  assert.equal(model.failure, true);
});
