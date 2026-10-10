import assert from "node:assert/strict";
import { test } from "node:test";

import { getNextCaseSignal, nextCaseSignals, resolveInterludeLines } from "../../src/caseCopy.js";
import { nodeOrders, nodes } from "../../src/gameData.js";

/**
 * The interlude on a case's report (src/caseCopy.js). Most are one fixed
 * paragraph. The ones for cases in which someone leaves are dated records, and
 * one line of each is the label of a card the player picked, read off the run's
 * log -- so what is tested here is which log entry that line may print, and
 * what the records are not allowed to say.
 */
const interludes = Object.entries(nextCaseSignals)
  .filter(([, signal]) => signal.interlude)
  .map(([caseId, signal]) => [caseId, signal.interlude]);
const records = interludes.filter(([, interlude]) => interlude.cardOf);
const MOODS = ["warm", "quiet", "wry", "grief", "still"];

const record = {
  cardOf: "c16_final",
  text: ["첫 줄.", "12월 3일 — 당신이 고른 것: {card}.", "끝 줄."],
  fallback: "12월 3일 — 대신 보이는 줄.",
};
const card = (nodeId, choice, extra = {}) => ({ nodeId, choiceId: `${nodeId}_x`, choice, reframe: false, ...extra });
const cardLine = (log) => resolveInterludeLines(record, log)[1];

test("the card line prints the label the log holds for the named scene", () => {
  const log = [card("c16_start", "오늘 밤 야간조 대기실로 간다"), card("c16_final", "승인을 막는다"), card("c16_aftershock", "대기실에 남는다")];
  assert.deepEqual(resolveInterludeLines(record, log), ["첫 줄.", "12월 3일 — 당신이 고른 것: 승인을 막는다.", "끝 줄."]);
  // The table's own lines are not written into: the next run reads them again.
  assert.equal(record.text[1], "12월 3일 — 당신이 고른 것: {card}.");
});

test("a scene the run never met shows the fallback line, never another scene's card", () => {
  assert.equal(cardLine([]), record.fallback);
  assert.equal(cardLine(undefined), record.fallback);
  // A bust on the scene before skips the final: the log goes from 잔류 명단 to the aftermath.
  assert.equal(cardLine([card("c16_list_reaction", "4%의 근거부터 따진다"), card("c16_aftershock", "대기실에 남는다")]), record.fallback);
  // The hidden route closes on a final of its own, and the evidence turn on its own scene.
  const hidden = [
    card("c16_start", "다른 방법을 제안한다", { reframe: true, reframeOpenedRoute: true, reframeBranchId: "c16_route_system" }),
    card("c16_route_system", "이 통계를 최서진과 승인위원회에 동시에 보여 준다"),
    card("c16_final_system_route", "조건은 두지 않고 위로금만 올린다"),
    card("c16_aftershock", "대기실에 남는다"),
  ];
  assert.equal(cardLine(hidden), record.fallback);
  assert.equal(cardLine([card("c16_evidence_turn", "요청 메모를 승인위원회에 낸다")]), record.fallback);
});

test("a reframe, a card the room played and a table record are not the player's card", () => {
  const reframed = card("c16_final", "마지막으로 판을 바꿔 제안한다", { reframe: true });
  assert.equal(cardLine([reframed]), record.fallback);
  assert.equal(cardLine([card("c16_final", "승인을 막는다", { threshold: { forced: true } })]), record.fallback);
  assert.equal(cardLine([card("c16_final", "복구 전에 난 BUST", { isSystemEvent: true })]), record.fallback);
  assert.equal(cardLine([card("c16_final", "")]), record.fallback);
  // A card the player staked counts whether or not the table then bust.
  assert.match(cardLine([card("c16_final", "승인을 막는다", { threshold: { busted: true, forced: false } })]), /승인을 막는다\.$/);
  // The scene met twice: the later card is the one that stood.
  assert.match(cardLine([card("c16_final", "승인을 막는다"), reframed, card("c16_final", "조건을 넣어 승인한다")]), /조건을 넣어 승인한다\.$/);
});

test("an interlude of one paragraph resolves to that paragraph, whatever the log holds", () => {
  const log = [card("c16_final", "승인을 막는다"), card("c1_aftershock", "기록한다")];
  const fixed = interludes.filter(([, interlude]) => !interlude.cardOf);
  assert.ok(fixed.length >= 50);
  for (const [caseId, interlude] of fixed) {
    assert.equal(typeof interlude.text, "string", caseId);
    assert.deepEqual(resolveInterludeLines(interlude, log), [interlude.text], caseId);
    assert.ok(!interlude.text.includes("{card}"), caseId);
    // The same object the table holds: nothing the runtime memoises on moves.
    assert.equal(getNextCaseSignal(caseId, log), nextCaseSignals[caseId], caseId);
  }
  assert.deepEqual(resolveInterludeLines(null, log), []);
  assert.equal(getNextCaseSignal("final", log), undefined);
});

test("every interlude has one of the five moods, a 막간 label and a title", () => {
  assert.ok(interludes.length >= 54);
  for (const [caseId, interlude] of interludes) {
    assert.ok(MOODS.includes(interlude.mood), `${caseId}: ${interlude.mood}`);
    assert.ok(interlude.label.startsWith("막간 · "), `${caseId}: ${interlude.label}`);
    assert.ok(interlude.title.length > 0, caseId);
  }
});

test("a dated record names a scene of its own case, one card line and a fallback", () => {
  assert.deepEqual(records.map(([caseId]) => caseId).sort(), ["case06", "case16", "case18", "case40"]);
  for (const [caseId, interlude] of records) {
    const scene = nodes[interlude.cardOf];
    assert.ok(scene, `${caseId}: ${interlude.cardOf} is not a scene`);
    assert.ok(nodeOrders[caseId].includes(interlude.cardOf), `${caseId}: ${interlude.cardOf} is another case's scene`);
    assert.ok(Array.isArray(interlude.text), caseId);
    assert.equal(interlude.text.filter((line) => line.includes("{card}")).length, 1, caseId);
    assert.ok(interlude.fallback && !interlude.fallback.includes("{card}"), caseId);
    // Every card that scene deals makes a line; the label is printed whole.
    for (const choice of scene.choices.filter((candidate) => candidate.type !== "reframe")) {
      const lines = resolveInterludeLines(interlude, [card(interlude.cardOf, choice.label)]);
      assert.equal(lines.length, interlude.text.length, caseId);
      assert.equal(lines.filter((line) => line.includes(`당신이 고른 것: ${choice.label}.`)).length, 1, `${caseId}: ${choice.id}`);
    }
    const fallen = resolveInterludeLines(interlude, []);
    assert.equal(fallen.length, interlude.text.length, caseId);
    assert.ok(fallen.includes(interlude.fallback), caseId);
    assert.ok(!fallen.join("\n").includes("{card}"), caseId);
    // Each line is a paragraph on the report, keyed by its text.
    assert.equal(new Set(fallen).size, fallen.length, caseId);
  }
});

test("the runtime gets one signal object per resolved text", () => {
  const [caseId, interlude] = records[0];
  const label = nodes[interlude.cardOf].choices[0].label;
  const picked = getNextCaseSignal(caseId, [card(interlude.cardOf, label)]);
  assert.equal(picked, getNextCaseSignal(caseId, [card(interlude.cardOf, label)]));
  assert.notEqual(picked, getNextCaseSignal(caseId, []));
  assert.deepEqual(picked.interlude.text, resolveInterludeLines(interlude, [card(interlude.cardOf, label)]));
  assert.equal(picked.caseId, nextCaseSignals[caseId].caseId);
  assert.equal(picked.interlude.mood, interlude.mood);
  // The table keeps its template.
  assert.ok(nextCaseSignals[caseId].interlude.text.some((line) => line.includes("{card}")));
});

/**
 * Canon has never decided what became of 플로우온's night shift after 12월 31일:
 * 사건 17 has contracts ending, 사건 23 has eighty people on shift, 사건 48 has a
 * former 막내 somewhere else. A record that stops on its own date cannot settle
 * it, and neither may the two records written beside it. 사건 40 is the same
 * shape: one card of three stops 핏스코어 that night and its 42 people have no
 * Monday, the other two do not, and the record stops the day before.
 */
test("no dated record says how the night shift ended", () => {
  const OUTCOME = /나갔|나간다|떠났|떠난|해고|퇴사|퇴직|짐을 쌌|복직|돌아왔|남았습니다|전원|정리됐|정리되었|취소됐|취소되었|철회|연장|재계약|가동됐|가동 시작|대기실이 비|출근할|멈췄|중단|폐업|문을 닫/;
  for (const [caseId, interlude] of records) {
    const fixed = [...interlude.text.filter((line) => !line.includes("{card}")), interlude.fallback, interlude.title];
    for (const line of fixed) assert.doesNotMatch(line, OUTCOME, `${caseId}: ${line}`);
  }
  const case16 = nextCaseSignals.case16.interlude;
  const last = case16.text.at(-1);
  // It stops on the interlude's own date, with the end date still ahead of it.
  assert.match(last, /^12월 10일 — /);
  assert.ok(case16.text.every((line) => !/^(12월 (1[1-9]|[23]\d)일|1월)/.test(line)));
});
