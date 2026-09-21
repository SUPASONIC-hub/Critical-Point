/**
 * Plain-language check.
 *
 * The season is a bank story told to people who do not work in a bank, so it
 * keeps two promises about its words, and both used to be kept by hand:
 *
 * 1. It speaks the Korean a bank speaks today. The Japanese-era terms a loan
 *    file used to be written in -- 여신, 융자, 품의, 기안, 결재 and their kin --
 *    were replaced once (대출, 승인, 작성) and crept back in a later case
 *    ("개정을 기안한 부서"). They are banned from every file that holds player
 *    copy.
 *
 * 2. A hard word is explained, in parentheses, the first time a player can read
 *    it in a case. Every case can be entered on its own (the debug jump, a
 *    resumed save, a route split), so "first" is per case, not per season. A
 *    case can open on its default scene or on one of the opening variants the
 *    previous case's aftermath picks, so each opening scene that uses a term
 *    has to explain it itself, and the rest of the case has to explain it at
 *    its first use unless every opening already did.
 *
 * Only narration is checked -- a scene's lead and body -- because that is where
 * a sentence has room for a parenthesis. Choice labels and memo lines are short
 * by design and lean on the narration above them.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { CASE_SEQUENCE, CASE_START_NODES, caseOpeningRoutes, nodeOrders, nodes } from "../src/gameData.js";

const COPY_FILES = [
  "src/nodes/case01.js",
  "src/nodes/case02.js",
  "src/nodes/case03.js",
  "src/nodes/case04.js",
  "src/nodes/case05.js",
  "src/nodes/case06.js",
  "src/nodes/case07.js",
  "src/nodes/case08.js",
  "src/nodes/case09.js",
  "src/nodes/case10.js",
  "src/nodes/case11.js",
  "src/nodes/finalCase.js",
  "src/nodes/sceneContext.js",
  "src/gameData.js",
  "src/gameDialogue.js",
  "src/appCopy.js",
  "src/gameCases.js",
  "src/gameLogic.js",
  "src/featurePack.js",
  "src/advancedSystems.js",
];

/** Japanese-era banking words, with what the season says instead. */
const BANNED = {
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
 * Words a player outside a bank has to be told. Everyday words that happen to
 * be official -- 감사, 징계, 결의, 고용 -- are left alone on purpose: the list is
 * the words a reader would actually stop at.
 */
const GLOSSARY = [
  "유동성",
  "선순위",
  "청산",
  "배임",
  "횡령",
  "분식회계",
  "채권단",
  "감정평가",
  "휴면 계좌",
  "보전 신청",
  "고용 승계",
  "회수율",
  "산업재해",
  "보존연한",
  "출자전환",
  "부채비율",
  "엠바고",
  "정기검사",
  "시효",
  "국정감사",
  "참고인",
  "불출석 사유서",
  "속기록",
  "정정보도",
  "공익신고",
];

const failures = [];

for (const file of COPY_FILES) {
  const text = readFileSync(file, "utf8");
  for (const [word, instead] of Object.entries(BANNED)) {
    // A Hangul neighbour on the left means the letters are part of another
    // word (정당해 is not 당해), so only a word start counts.
    const pattern = new RegExp(`(^|[^가-힣])${word}`, "g");
    for (const match of text.matchAll(pattern)) {
      const line = text.slice(0, match.index).split("\n").length;
      failures.push(`${file}:${line} uses "${word}" -- write "${instead}"`);
    }
  }
}

const CASE_PREFIX = { case01: /^(start$|c1_|payday$|competitor$)/, final: /^f_/ };
for (const caseId of CASE_SEQUENCE) {
  if (CASE_PREFIX[caseId]) continue;
  const number = Number(caseId.slice(4));
  CASE_PREFIX[caseId] = new RegExp(`^c${number}_`);
}

function narration(node = {}) {
  return [node.lead, node.text].filter(Boolean).join(" ");
}

/** Right after the term, or after one short word that finishes it: 유동성 위기(…). */
function explainedAt(text, index, term) {
  return /^(\s?[가-힣]{1,3})?\s?\(/.test(text.slice(index + term.length, index + term.length + 6));
}

function firstUse(ids, term) {
  for (const id of ids) {
    const text = narration(nodes[id]);
    // A word start only: 우선순위 is not 선순위.
    const match = new RegExp(`(^|[^가-힣])${term}`).exec(text);
    if (match) {
      const index = match.index + match[1].length;
      return { id, explained: explainedAt(text, index, term) };
    }
  }
  return null;
}

for (const caseId of CASE_SEQUENCE) {
  const prefix = CASE_PREFIX[caseId];
  const openings = [...new Set([CASE_START_NODES[caseId], ...Object.values(caseOpeningRoutes[caseId] ?? {})])].filter((id) => nodes[id]);
  const authored = (nodeOrders[caseId] ?? []).filter((id) => nodes[id] && !openings.includes(id));
  const rest = Object.keys(nodes)
    .filter((id) => prefix.test(id) && !openings.includes(id) && !authored.includes(id))
    .sort();
  const body = [...authored, ...rest];
  for (const term of GLOSSARY) {
    let everyOpeningExplains = openings.length > 0;
    for (const opening of openings) {
      const use = firstUse([opening], term);
      if (use && !use.explained) failures.push(`${caseId}/${opening}: "${term}" needs a (plain explanation) at its first use`);
      if (!use?.explained) everyOpeningExplains = false;
    }
    const use = firstUse(body, term);
    if (use && !use.explained && !everyOpeningExplains) {
      failures.push(`${caseId}/${use.id}: "${term}" needs a (plain explanation) at its first use in the case`);
    }
  }
}

assert.deepEqual(failures, [], failures.join("\n"));
console.log(`Plain-language check passed (${Object.keys(BANNED).length} banned words, ${GLOSSARY.length} glossary terms across ${CASE_SEQUENCE.length} cases).`);
