import assert from "node:assert/strict";
import { test } from "node:test";

import { overlayModule } from "../../src/locales/overlay.js";
import enScreens from "../../src/locales/en/screens/index.js";
import endingCopy from "../../src/copy/ending.js";
import boardPostCopy from "../../src/copy/boardPost.js";
import { getCollapseToll, getEndingEpilogue, getFailureRecovery } from "../../src/featurePack.js";
import { checkBoardSubmit } from "../../src/state/useBoard.js";
import { ENDING_GATES } from "../../src/gameConstants.js";

/**
 * 영어판 3단계 (2026-10-26): the endings, the board, the ranking and the lines
 * around them read their words by key (src/copy/*.js). On a Korean page they
 * print what they printed; an English dictionary is laid over the same tables.
 */
test("a collapsed season's way back and toll are worded from the gate, a name's particle filled in", () => {
  const harm = getFailureRecovery({ failure: true, cause: { id: "harm" } }, {});
  assert.equal(harm.text, `다음 시즌에는 사건마다 사람 피해를 평균 ${ENDING_GATES.collapseHarmPerCase} 아래로 닫으면 무너지지 않습니다.`);
  const overreach = getFailureRecovery({ failure: true, cause: { id: "overreach" } }, {});
  assert.match(overreach.text, new RegExp(`전체의 ${Math.round(ENDING_GATES.collapseBustRate * 100)}% 아래로`));
  assert.equal(getFailureRecovery({ failure: false }), null);
  const toll = getCollapseToll({ caseResults: {}, resources: {}, cases: [] });
  assert.ok(toll.startsWith("사람 피해가 감당할 수 있는 선을 넘은 것으로 기록되었습니다."));
  assert.match(getEndingEpilogue("collapse"), /^\d+개 사건 가운데/, "the collapse counts the season's cases");
  assert.equal(getEndingEpilogue("nowhere"), getEndingEpilogue("open-question"));
});

test("the board's stops are its copy table's sentences, the wait filled in", () => {
  const base = { nickname: "분석관", body: "남길 말입니다", sinceOpenedMs: 60_000 };
  assert.equal(checkBoardSubmit({ ...base, honeypot: "x" }).message, boardPostCopy.honeypot);
  assert.equal(checkBoardSubmit({ ...base, sinceOpenedMs: 0 }).message, boardPostCopy.dwell);
  assert.equal(checkBoardSubmit({ ...base, privacySignalCount: 1 }).message, boardPostCopy.privacy);
  assert.equal(checkBoardSubmit({ ...base, nickname: "a" }).message, boardPostCopy.refusals["nickname-characters"]);
  assert.equal(checkBoardSubmit({ ...base, sinceLastPostMs: 10_000 }).message, "글은 30초에 한 번만 올릴 수 있습니다. 20초 뒤에 다시 눌러 주세요.");
  assert.equal(checkBoardSubmit(base), null);
});

test("the English dictionary lays the ending's words over the Korean table, keeping what is not Korean", () => {
  const table = structuredClone(endingCopy);
  overlayModule({ screens: enScreens }, "screens", { ending: table });
  assert.equal(table.twists.ruling, "Verdict");
  assert.equal(table.verdicts.ending_seal.title, "The B2 folder is sealed.");
  assert.equal(table.axes[0].label, "PROTECT", "an English label stays");
  assert.equal(table.axes[0].text, "How much harm to people and the front line you reduced");
  assert.equal(table.threeScenes.counts[0], "", "the empty word stays");
  assert.equal(table.threeScenes.counts[3], "three scenes");
});

test("the board's hook starts with nothing said, before the board is opened", async () => {
  const { createElement } = await import("react");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const { useBoard } = await import("../../src/state/useBoard.js");
  let board = null;
  const Probe = () => {
    board = useBoard({ showBoard: false, isOnline: true });
    return null;
  };
  renderToStaticMarkup(createElement(Probe));
  assert.equal(board.boardPostStatus, "");
  assert.equal(board.boardError, "");
  assert.deepEqual(board.boardPosts, []);
});
