import assert from "node:assert/strict";
import { test } from "node:test";

import { BANNED, RETIRED_PHRASES, findBannedWords, findRetiredPhrases } from "../../scripts/plain-language-rules.mjs";

test("every retired free-text phrase is refused wherever it sits in a sentence", () => {
  for (const phrase of Object.keys(RETIRED_PHRASES)) {
    for (const sentence of [`${phrase} 뒤에 화면이 바뀝니다.`, `준비된 보기 ${phrase} 화면이 바뀝니다.`, `첫 줄\n둘째 줄의${phrase}`]) {
      const found = findRetiredPhrases(sentence);
      assert.ok(found.some((entry) => entry.word === phrase), `${phrase} was not refused in: ${sentence}`);
    }
  }
});

test("a refusal names the line and what to write instead", () => {
  assert.deepEqual(findRetiredPhrases("첫 줄\n직전 자유응답 문장이 점수판에 반영됐는지 본다"), [
    { word: "자유응답", instead: "다시 짠 판", line: 2 },
  ]);
});

test("the sentences the season says now are not refused", () => {
  for (const sentence of [
    "직전 사건에서 다시 짠 판이 점수판에 반영됐는지 본다",
    "'판을 다시 짠다' 카드를 걸고 벽에 닿기 전에 확정하면 이 사건의 숨은 경로가 열립니다.",
    // A character's own writing is not the player's: these are story, not the box.
    "제가 쓴 문장이에요. 혁신위원회 광고 대본도 제가 썼고요.",
    "속보 화면에 당신이 쓴 문장 하나가 인용돼 있습니다.",
    "당신의 선택 문장이 다음 테스트의 선택지로 복제됨",
    "이름을 입력하세요",
  ]) {
    assert.deepEqual(findRetiredPhrases(sentence), [], sentence);
  }
});

test("a banned bank word is refused at a word start only", () => {
  for (const word of Object.keys(BANNED)) {
    assert.ok(findBannedWords(`오늘 ${word} 서류를 봅니다.`).some((entry) => entry.word === word), word);
  }
  // 우선순위 holds 수순 only across a syllable boundary of another word.
  assert.deepEqual(findBannedWords("우선순위를 정한다"), []);
  assert.deepEqual(findBannedWords("정기안내를 받는다"), []);
});
