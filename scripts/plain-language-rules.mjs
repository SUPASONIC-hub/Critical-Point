/**
 * The words the plain-language check refuses, and the two readers that find
 * them. They live apart from `check-plain-language.mjs` because that script
 * runs the whole season when it is imported, and a rule that cannot be called
 * on one sentence cannot be tested on one.
 */

/** Japanese-era banking words, with what the season says instead. */
export const BANNED = {
  여신: "대출",
  융자: "대출",
  품의: "승인 요청",
  기안: "작성",
  결재: "승인",
  금번: "이번",
  익일: "다음 날",
  불입: "납입",
  수순: "순서",
};

/**
 * What the game said while 판을 다시 짠다 was a text box. It is a card now
 * (maintenance priority 77): the player stakes it, nothing is typed, and no
 * sentence of theirs exists for a scene to quote. These phrases survived the
 * change in 54 memory cards and 52 hidden routes, telling a player who had
 * staked a card about a sentence they wrote.
 *
 * Matched anywhere, not at a word start like `BANNED`: each is long enough to
 * be unmistakable, and the ones that open mid-phrase (밖의 문장을) have a
 * Hangul neighbour on the left by construction.
 */
export const RETIRED_PHRASES = {
  자유응답: "다시 짠 판",
  "자유 응답": "다시 짠 판",
  "자유 입력": "판을 다시 짠다",
  "자유로운 제안": "다시 짠 판",
  "밖의 문장을": "판을 다시 짜자",
  "문장을 쓰자": "판을 다시 짜자",
  "문장을 입력": "판을 다시 짜자",
  "입력하신 문장": "다시 짠 판",
  "입력한 문장": "다시 짠 판",
  "직접 쓴 제안": "다시 짠 판",
  "제안 문장": "다시 짠 판",
  "반영 기준": "숨은 경로",
};

const lineOf = (text, index) => text.slice(0, index).split("\n").length;

/**
 * Bank words are mostly met in compounds -- 전자결재, 신규여신, 주택융자, 재기안
 * -- and a word-start rule let every one of them through. Three of the words
 * are found inside no ordinary Korean word, so they are refused wherever they
 * stand. The rest do turn up inside other words (상품의 holds 품의, 정기안내
 * holds 기안), so they are refused at a word start, or behind one of the
 * prefixes a bank puts in front of them.
 */
const REFUSED_ANYWHERE = new Set(["여신", "융자", "결재"]);
const COMPOUND_PREFIXES = ["재", "사전", "최종", "전자", "신규", "공동"];

/** `[{ word, instead, line }]` for every banned word in `text`, alone or in a compound. */
export function findBannedWords(text) {
  const found = [];
  for (const [word, instead] of Object.entries(BANNED)) {
    // A Hangul neighbour on the left means the letters are part of another
    // word (정당해 is not 당해), so only a word start or a known compound counts.
    const pattern = REFUSED_ANYWHERE.has(word) ? new RegExp(word, "g") : new RegExp(`(?:^|[^가-힣]|${COMPOUND_PREFIXES.join("|")})${word}`, "g");
    for (const match of text.matchAll(pattern)) found.push({ word, instead, line: lineOf(text, match.index) });
  }
  return found;
}

/** `[{ word, instead, line }]` for every retired free-text phrase in `text`. */
export function findRetiredPhrases(text) {
  const found = [];
  for (const [word, instead] of Object.entries(RETIRED_PHRASES)) {
    let index = text.indexOf(word);
    while (index >= 0) {
      found.push({ word, instead, line: lineOf(text, index) });
      index = text.indexOf(word, index + word.length);
    }
  }
  return found;
}
