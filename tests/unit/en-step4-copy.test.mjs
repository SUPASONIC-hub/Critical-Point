import assert from "node:assert/strict";
import { test } from "node:test";

import { overlayModule } from "../../src/locales/overlay.js";
import enScreens from "../../src/locales/en/screens/index.js";
import mutationsCopy from "../../src/copy/mutations.js";
import tableCopy from "../../src/copy/table.js";
import seasonEndCopy from "../../src/copy/seasonEnd.js";
import { describeMutations, MUTATIONS } from "../../src/gauntlet/gauntletEngine.js";
import { BLACKOUT_WALL_SHIFT, SEAL_BREAK_GAUGE } from "../../src/gauntlet/tableRules.js";
import { describeBank, describeScout, describeStanceCarry, getHoldArmedCall } from "../../src/gauntlet/tableVoice.js";
import { getAuthorityProfile } from "../../src/runtimeSystems.js";
import { describeAfterword, getTableReaction } from "../../src/gauntlet/tableAfterword.js";

/**
 * 영어판 4단계 (2026-10-26): the next-board rules, the table's voice and the
 * authority levels' actions read their words by key (src/copy/mutations.js,
 * table.js `voice`, seasonEnd.js `authority.permissions`), when they are
 * printed. On a Korean page they print what they printed; an English
 * dictionary laid over the same tables is the one printed. The Korean tests
 * run first: the last test lays English over the module's own tables.
 */
test("the rules print their Korean with the numbers filled in, and a lifted rule its own line", () => {
  assert.equal(MUTATIONS.blackout.text, `임계점을 넘긴 대가. 다음 판은 카드의 칩과 소모가 가려지고, 벽이 ${BLACKOUT_WALL_SHIFT} 가까워진다.`);
  assert.equal(MUTATIONS.coldFeet.text, `밀지 않고 확정한 대가. 가장 비싼 카드는 열기 ${SEAL_BREAK_GAUGE}을 넘겨야 열리고, 칩이 줄어든다.`);
  assert.equal(MUTATIONS.blackout.label, "BLACKOUT");
  assert.ok(Object.isFrozen(MUTATIONS.blackout), "a rule stays frozen");
  const [lifted] = describeMutations({ mutations: ["blackout"], faceDown: false });
  assert.equal(lifted.title, "벽이 다가왔다");
  assert.equal(lifted.lifted, true);
});

test("the voice and the authority levels say their Korean", () => {
  assert.equal(getHoldArmedCall(), "한 번 더 누르면 확정된다");
  assert.equal(describeScout({ wallMin: 70, wallMax: 90 }), "조회했다. 벽은 70에서 90 사이 어딘가");
  assert.deepEqual(getAuthorityProfile("courier", "OVERSIGHT").permissions, ["기록 공개", "현장 개입", "실험 종료"]);
  assert.deepEqual(getAuthorityProfile("courier", "nowhere").permissions, ["제한 열람", "질문 요청", "관찰 기록"]);
  assert.equal(getTableReaction([{ threshold: { busted: true, cause: "push", pushes: 3, wall: 70 } }], "n1").recap, "직전 판 · 3번째 밀기에서 BUST (벽 70)");
  assert.equal(describeAfterword({ status: "bust", cause: "push", wall: 70, tellOffset: -5, schema: {} }), "심박은 벽을 65쯤으로 들었다(실제 70).");
});

test("the English dictionary is printed once it is laid over the tables", () => {
  overlayModule({ screens: enScreens }, "screens", { mutations: mutationsCopy, table: tableCopy, seasonEnd: seasonEndCopy });
  assert.equal(MUTATIONS.blackout.title, "The cards went face down");
  assert.equal(MUTATIONS.coldFeet.text, `The price of committing without a push. The most expensive card opens only once Heat passes ${SEAL_BREAK_GAUGE}, and chips shrink.`);
  const described = describeMutations({ mutations: Object.keys(MUTATIONS) });
  for (const rule of described) {
    assert.doesNotMatch(`${rule.title} ${rule.text}`, /[가-힣]/, `${rule.id} is English`);
    assert.doesNotMatch(rule.text, /\{\w+\}/, `${rule.id} has no blank left`);
  }
  const [coldFeet] = describeMutations({ mutations: ["coldFeet"], sealHighest: false });
  assert.equal(coldFeet.title, "Chips shrank");
  assert.equal(getHoldArmedCall(), "Press once more to Commit");
  assert.equal(describeBank({ runPot: 1200, vault: 0 }), "Stake 1,200 · Vault 0");
  assert.equal(describeStanceCarry({ focus: 12.4, carry: MUTATIONS.steadyLine }), "Charge 12 · Commit for STEADY LINE next hand · The next hand opens cool");
  assert.equal(getTableReaction([{ threshold: { pushes: 2, gauge: 41.5, wall: 66 } }], "n1").recap, "Last hand · pushed 2×, Committed at Heat 41 (Wall 66)");
  assert.equal(describeAfterword({ status: "bust", cause: "push", wall: 70, tellOffset: 4, schema: {} }), "The heartbeat heard the Wall around 74 (it was 70).");
  assert.deepEqual(getAuthorityProfile("courier", "FIELD ACCESS").permissions, ["Cross-check records", "Question the people involved", "Propose standards"]);
});
