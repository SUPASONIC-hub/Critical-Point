import assert from "node:assert/strict";
import { test } from "node:test";

import { COLLAPSED_SEASON_MARK, getCollapseToll } from "../../src/featurePack.js";
import { seasonCasesBase } from "../../src/gameCases.js";
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
});

test("a collapse on the table's harm alone names no case", () => {
  const toll = getCollapseToll({ caseResults: {}, resources: { humanCost: 90 }, cases: seasonCasesBase });
  assert.doesNotMatch(toll, /「/);
  assert.equal(toll.split(". ").length, 2);
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
