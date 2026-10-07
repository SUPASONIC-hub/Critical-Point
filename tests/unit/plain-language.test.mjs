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
  assert.deepEqual(findBannedWords("이 상품의 뒷장을 먼저 읽는다"), []);
  assert.deepEqual(findBannedWords("촛불입니다. 순이익일 뿐입니다."), []);
});

test("a banned bank word is refused inside the compounds a bank writes", () => {
  for (const [sentence, word] of [
    ["전자결재 시스템에 올립니다.", "결재"],
    ["최종결재만 남았습니다.", "결재"],
    ["신규여신 한도를 봅니다.", "여신"],
    ["재기안 요청이 옵니다.", "기안"],
    ["주택융자 서류입니다.", "융자"],
    ["사전품의 없이 나갔습니다.", "품의"],
  ]) {
    assert.deepEqual(findBannedWords(sentence).map((entry) => entry.word), [word], sentence);
  }
});

/**
 * `check-plain-language.mjs` reads the season when it is imported, so the route
 * rule is proved on the season: take a gloss away from where every route passes
 * it, import the check again, and it has to name the case and the term.
 */
test("a term is explained on every route to the scene that says it, not just somewhere in the case", async () => {
  const { CASE_RESULT_NODES, nodes, reframeRouteNodes } = await import("../../src/gameData.js");
  const check = (probe) => import(`../../scripts/check-plain-language.mjs?probe=${probe}`).then(() => "", (error) => String(error.message));
  assert.equal(await check("clean"), "");

  // The audit's case: the only gloss sits on the hidden route, which is listed
  // right after the start but which no ordinary card leads to, and a closing
  // scene every run reaches says the word bare.
  const hidden = nodes[reframeRouteNodes.case13];
  const closing = Object.values(nodes).find((node) => node.caseId === "case13" && node.choices.some((choice) => choice.type !== "reframe" && choice.next === CASE_RESULT_NODES.case13));
  assert.ok(!Object.values(nodes).some((node) => node.caseId === "case13" && `${node.lead ?? ""} ${node.text}`.includes("엠바고")), "사건 13 says 엠바고 now; pick another word for this probe");
  const [hiddenText, closingText] = [hidden.text, closing.text];
  hidden.text = `${hiddenText} 엠바고(보도를 미루기로 한 약속)가 걸려 있습니다.`;
  closing.text = `${closingText} 엠바고는 내일 풀립니다.`;
  try {
    assert.match(await check("hidden-gloss"), /case13\/엠바고: needs a \(plain explanation\) in \S*, where a route reaches it unexplained/);
  } finally {
    hidden.text = hiddenText;
    closing.text = closingText;
  }

  // 사건 23 explains 주주총회 on its opening scenes; say it bare on one of them
  // and a route now reads it unexplained.
  const opening = Object.values(nodes).find((node) => node.caseId === "case23" && /주주총회\(/.test(`${node.lead ?? ""} ${node.text}`));
  assert.ok(opening, "사건 23 no longer explains 주주총회 where this probe expects it");
  const field = /주주총회\(/.test(opening.text) ? "text" : "lead";
  const written = opening[field];
  opening[field] = written.replace(/주주총회\([^)]*\)/, "주주총회");
  try {
    const said = await check("bare");
    assert.match(said, /case23\/주주총회: needs a \(plain explanation\)/);
    assert.match(said, /case\/term pairs are read unexplained on some route, over the \d+ allowed/);
  } finally {
    opening[field] = written;
  }
});
