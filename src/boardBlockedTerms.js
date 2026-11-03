/**
 * The 참가자 게시판's blocked words, and the folding both copies of the check
 * read a post through.
 *
 * Why the list is here, in a public repository. The server's copy is a table
 * (`public.board_blocked_terms`, supabase/migrations/20261103000000_*), filled
 * by the migration from this list, and the trigger on `board_posts` refuses a
 * post or a name that holds one. The browser checks the same list first, so a
 * person is told before the round trip (src/state/useBoard.js, loaded only
 * when 글 남기기 is pressed). tests/unit/board-blocked-terms.test.mjs holds the
 * migration's rows to this list, and scripts/check-grants.mjs holds the
 * server's folding to `foldBoardText` on tests/fixtures/board-filter-cases.json.
 * A word added here needs a migration that adds its row.
 *
 * What is on it, and what is not (2026-11-03, the owner's choice after the
 * security review's M1). Profanity and slurs aimed at people, in Korean,
 * English and Japanese: the words a moderation queue sees first. Not mild
 * words (바보, 미친, damn, バカ), not words with an ordinary meaning beside the
 * insult (새끼 is a young animal, 씹다 is to chew, しね is in シネマ, がいじ in
 * ガイジン, dick in Dickens), and not names of groups by themselves. A word
 * goes on only when, folded, it is rare inside ordinary text in these three
 * languages: a match is a substring of the folded text, so a short or common
 * string would refuse ordinary posts. It is a floor, not a filter that catches
 * everything: the report button and the automatic hiding at three writers
 * (the same migration) are what deal with the rest.
 *
 * Sources: the entries were picked by hand from the common lists of Korean
 * online profanity (the jamo abbreviations included) and the slurs that
 * public moderation guides for English and Japanese name first. Nothing here
 * is a quote of any one list.
 *
 * Each entry is written already folded (`foldBoardText(term) === term`).
 */

// The conjoining jamo NFKC turns the compatibility jamo into, and back.
const CHOSEONG = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
const JONGSEONG = "ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ";
// The final each initial becomes when it closes the syllable before it (0: none).
const CHOSEONG_AS_FINAL = [1, 2, 4, 7, 0, 8, 16, 17, 0, 19, 20, 21, 22, 0, 23, 24, 25, 26, 27];

const isOpenSyllable = (code) => code >= 0xac00 && code <= 0xd7a3 && (code - 0xac00) % 28 === 0;
const isChoseong = (code) => code >= 0x1100 && code <= 0x1112;
const isJungseong = (code) => code >= 0x1161 && code <= 0x1175;
const isJongseong = (code) => code >= 0x11a8 && code <= 0x11c2;

// Kept after folding: Latin letters, Hangul syllables and compatibility jamo,
// hiragana, and the common kanji. Digits, spaces, punctuation and symbols go.
const DROP = /[^a-z가-힣ㄱ-ㆎぁ-ゖ一-鿿]/g;

/**
 * What a post is matched as:
 *   1. NFKC: full and half width to one form (Ｆ→F, ｼ→シ), and jamo typed
 *      apart joined where Unicode joins them (ㅅㅣ→시).
 *   2. Lower case; katakana as hiragana.
 *   3. A lone initial after an open syllable, not followed by a vowel, becomes
 *      its final (시바ㄹ→시발): the one jamo-splitting trick NFKC leaves.
 *   4. Any jamo still left as the compatibility jamo it was typed as, so
 *      abbreviations (ㅅㅂ) are matched.
 *   5. Everything but letters out: spaces, digits, dots and symbols put
 *      between the letters do not split a word.
 * `public.board_fold_text` takes the same five steps.
 */
export function foldBoardText(value) {
  const text = String(value ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[ァ-ヶ]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0x60))
    // ㅄ typed alone: NFKC makes it the old initial ᄡ, which no table above holds.
    .replace(/ᄡ/g, "ᄇᄉ");
  const chars = [...text];
  let out = "";
  for (let index = 0; index < chars.length; index += 1) {
    const code = chars[index].codePointAt(0);
    const next = chars[index + 1]?.codePointAt(0) ?? 0;
    const last = out.length ? out.charCodeAt(out.length - 1) : 0;
    if (isChoseong(code) && isOpenSyllable(last) && !isJungseong(next) && CHOSEONG_AS_FINAL[code - 0x1100]) {
      out = out.slice(0, -1) + String.fromCharCode(last + CHOSEONG_AS_FINAL[code - 0x1100]);
    } else if (isChoseong(code)) out += CHOSEONG[code - 0x1100];
    else if (isJungseong(code)) out += String.fromCharCode(0x314f + code - 0x1161);
    else if (isJongseong(code)) out += JONGSEONG[code - 0x11a8];
    else out += chars[index];
  }
  return out.replace(DROP, "");
}

export const BOARD_BLOCKED_TERMS = [
  // Korean profanity
  "씨발", "시발", "씨바", "씨팔", "시팔", "씨빨", "씨부랄", "시부랄", "십새", "씹새", "씹할",
  "병신", "븅신", "빙신", "개새끼", "개새기", "개색기", "개색끼", "개세끼",
  "좆", "지랄", "엠창", "니미럴", "느금마", "느개비", "애미뒤진", "애비뒤진",
  // Korean, typed as jamo (ㅄ folds to ㅂㅅ)
  "ㅅㅂ", "ㅆㅂ", "ㅂㅅ", "ㅈㄹ", "ㅈ같", "ㄱㅅㄲ", "ㄴㄱㅁ",
  // Korean slurs
  "한남충", "김치녀", "된장녀", "맘충", "틀딱", "급식충", "짱깨", "짱개", "쪽바리", "똥남아", "깜둥이", "똥꼬충",
  // English
  "fuck", "fuk", "fuq", "shit", "bitch", "bastard", "asshole", "cunt", "whore", "slut",
  "nigger", "nigga", "faggot", "retard", "chink", "wetback", "tranny", "killyourself",
  // Japanese (folded: katakana are written as hiragana)
  "死ね", "氏ね", "殺すぞ", "ころすぞ", "きちがい", "基地外", "くたばれ", "ちゃんころ", "支那人",
];

/** The first blocked word `value` holds, folded, or null. */
export function findBlockedTerm(value, terms = BOARD_BLOCKED_TERMS) {
  const folded = foldBoardText(value);
  if (!folded) return null;
  return terms.find((term) => folded.includes(term)) ?? null;
}
