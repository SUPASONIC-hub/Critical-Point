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
 *    The same files are read for what the game said while 판을 다시 짠다 was
 *    a text box (`RETIRED_PHRASES`): nothing is typed any more, so no scene
 *    may describe a sentence the player wrote.
 *
 * 2. A hard word is explained, in parentheses, the first time a player can read
 *    it in a case. Every case can be entered on its own (the debug jump, a
 *    resumed save, a route split), so "first" is per case, not per season. A
 *    case can open on its default scene or on one of the opening variants the
 *    previous case's aftermath picks, so each opening scene that uses a term
 *    has to explain it itself, and any later scene may say it bare only when
 *    every route from every opening has explained it by then
 *    (`unexplainedUses`). What that rule found on its first day is held as a
 *    ceiling that only comes down (`BARE_ON_A_ROUTE`).
 *
 * Only narration is checked -- a scene's lead and body -- because that is where
 * a sentence has room for a parenthesis. Choice labels and memo lines are short
 * by design and lean on the narration above them.
 */
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { CASE_SEQUENCE, CASE_START_NODES, caseOpeningRoutes, nodeOrders, nodes } from "../src/gameData.js";
import { BANNED, RETIRED_PHRASES, findBannedWords, findRetiredPhrases } from "./plain-language-rules.mjs";

// Every case file is copy, so the list reads the folder rather than naming each
// case: a new case was once added and its file left off this list.
const COPY_FILES = [
  ...readdirSync("src/nodes")
    .filter((name) => name.endsWith(".js"))
    .sort()
    .map((name) => `src/nodes/${name}`),
  "src/gameData.js",
  "src/gameDialogue.js",
  "src/appCopy.js",
  "src/caseCopy.js",
  "src/gameCases.js",
  "src/gameLogic.js",
  "src/featurePack.js",
  "src/advancedSystems.js",
];

// Copy a screen prints about the game itself. It never held a bank word, so
// the banned list does not read it; it did describe the text box.
const SCREEN_COPY_FILES = [
  "src/viewModels/sceneViewModels.js",
  "src/viewModels/reportViewModels.js",
  "src/state/useResultReport.js",
];

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
  "분쟁조정",
  "부제소 합의",
  "집단소송",
  "협동조합",
  "상환",
  "담보 순위",
  "부도",
  "자문료",
  "계열사",
  "풀필먼트",
  "인사위원회",
  "발령",
  "크로마키",
  "카메오",
  "프롬프터",
  "포커스 그룹",
  "인이어",
  "회계 원장",
  "불완전판매",
  "부실채권",
  "ESG",
  "미스터리 쇼퍼",
  "환매",
  "후순위",
  "녹취",
  "기준가",
  "PB",
  "청약 철회",
  "시재",
  "리스",
  "풀필먼트센터",
  "피킹",
  "선행 조건",
  "관제",
  "지분",
  "내용증명",
  "문서제출명령",
  "실사",
  "마니또",
  "시행사",
  "공정표",
  "이관",
  "심사 엔진",
  "학습 데이터",
  "가명 처리",
  "설명 가능성",
  "알고리즘",
  "조직 적합도",
  "사후 동의서",
  "정보 주체",
  "열람 청구",
  "영농자금",
  "비상품과",
  "수매",
  "가중치",
  "유사도",
  "시설자금",
  "예외 승인",
  "특수관계인",
  "5축 가공기",
  "출자금",
  "주주총회",
  "사내이사",
  "의결권",
  "위임장",
  "의결권 자문사",
  "기관투자자",
  "소액주주",
  "의사록",
  "전자투표",
  "지배구조",
  "인사평가 보조지표",
  "수신 기록",
  "영전",
  "대기발령",
  "PF",
  "하도급",
  "유치권",
  "중도금",
  "공정률",
  "공매",
  "뱅크런",
  "예금자 보호",
  "약관",
  "부지급",
  "후유장해",
  "손해사정사",
  "손해율",
  "통지 의무",
  "파견",
  "통매각",
  "부속서",
  "자문역",
  "추심",
  "채무조정",
  "페이퍼컴퍼니",
  "사모펀드",
  "호커센터",
  "비밀유지 서약서",
  "신기술투자조합",
  "검사역",
  "충당금",
  "만기 연장",
  "압수수색",
  "피의자",
  "영장",
  "진술조서",
  "포렌식",
  "기소",
  "영업비밀",
  "보호조치",
  "구조금",
  "필적 감정",
  "임의제출",
  "손해사정",
  "특약",
  "면책",
  "방청유",
  "차주",
  "준법감시인",
  "꼬리 자르기",
  "상호신용금고",
  "미러 사이트",
  "디지털 장의사",
  "증거능력",
  "메타데이터",
  "변론",
  "준비서면",
  "반대신문",
  "원고 적격",
  "분리 심리",
  "결방",
  "가처분",
  "주조정실",
  "심의",
  "타임코드",
  "반론",
  "역량검사",
  "청문회",
  "위증",
  "대질신문",
  "경매",
  "조기 회수",
  "사외이사",
  "해임안",
  "준비 기일",
  "공시",
  "구형",
  "양형",
  "집행유예",
  "추징",
  "처벌불원서",
  "항소",
  "법정구속",
  "상주",
  "발인",
  "설계 로그",
  "인우보증",
  "재원",
  "위로금",
  "대출 확약",
  "조건부 승인",
  "이면 합의",
  "다크스토어",
];

const failures = [];

for (const file of COPY_FILES) {
  const text = readFileSync(file, "utf8");
  for (const { word, instead, line } of findBannedWords(text)) {
    failures.push(`${file}:${line} uses "${word}" -- write "${instead}"`);
  }
}
for (const file of [...COPY_FILES, ...SCREEN_COPY_FILES]) {
  const text = readFileSync(file, "utf8");
  for (const { word, instead, line } of findRetiredPhrases(text)) {
    failures.push(`${file}:${line} still describes the text box ("${word}") -- the card is staked, not typed: "${instead}"`);
  }
}

// Which nodes belong to a case: the graph stamps every scene with its case
// (`finishSceneGraph`). This used to be read off the id -- digits first, which
// left the 프롤로그 unchecked, then a prefix per case with its own regex for
// 사건 01 -- and a third copy of that mapping could only drift.

function narration(node = {}) {
  return [node.lead, node.text].filter(Boolean).join(" ");
}

/** Right after the term, or after one short word that finishes it: 유동성 위기(…). */
function explainedAt(text, index, term) {
  return /^(\s?[가-힣]{1,3})?\s?\(/.test(text.slice(index + term.length, index + term.length + 6));
}

/**
 * How one scene uses one term: whether the first time it says it is explained,
 * and whether it explains it anywhere. Null when the scene never says it.
 */
function useIn(id, term) {
  const text = narration(nodes[id]);
  if (!text.includes(term)) return null;
  // A word start only: 우선순위 is not 선순위.
  const uses = [...text.matchAll(new RegExp(`(^|[^가-힣])${term}`, "g"))].map((match) => explainedAt(text, match.index + match[1].length, term));
  return uses.length ? { firstExplained: uses[0], explains: uses.includes(true) } : null;
}

/**
 * "First use" is the first time a player reads the word, and a player reads a
 * case along a route, not down `nodeOrders`. The order puts a case's hidden
 * route right after its start and its side door after the scene it hangs on,
 * so a gloss in a scene most runs never enter used to pass the whole case:
 * 사건 11 explained 참고인 on the hidden route, and one ordinary card from the
 * start read it bare (audit of 2026-10-07, finding 2).
 *
 * So a scene may say a term bare only if every route into it has already
 * explained it. Routes start on each scene the case can open on and follow the
 * cards a scene deals; 판을 다시 짠다 is not followed, because it can jump from
 * anywhere and would leave nothing explained before the hidden route. The
 * scenes only that jump reaches are walked second, from their own first scene.
 */
function unexplainedUses(caseId, term, sceneIds, starts) {
  const use = new Map(sceneIds.map((id) => [id, useIn(id, term)]));
  if (![...use.values()].some(Boolean)) return [];
  const walk = (roots, within) => {
    const reached = new Set();
    const pending = [...roots];
    while (pending.length > 0) {
      const id = pending.pop();
      if (reached.has(id) || !within.has(id)) continue;
      reached.add(id);
      for (const choice of nodes[id].choices ?? []) if (choice.type !== "reframe") pending.push(choice.next);
    }
    // explainedBefore(scene) holds when every card into it comes from a scene
    // that explains the term or already had it explained. Start from "yes" and
    // take it away until nothing changes; a root has no card into it.
    const explainedBefore = new Map([...reached].map((id) => [id, !roots.includes(id)]));
    for (let changed = true; changed; ) {
      changed = false;
      for (const id of reached) {
        if (explainedBefore.get(id) || use.get(id)?.explains) continue;
        for (const choice of nodes[id].choices ?? []) {
          if (choice.type === "reframe" || !explainedBefore.get(choice.next)) continue;
          explainedBefore.set(choice.next, false);
          changed = true;
        }
      }
    }
    return [...reached].filter((id) => use.get(id) && !use.get(id).firstExplained && !explainedBefore.get(id));
  };
  const all = new Set(sceneIds);
  const onRoutes = walk(starts, all);
  const played = new Set();
  for (const pending = [...starts]; pending.length > 0; ) {
    const id = pending.pop();
    if (played.has(id) || !all.has(id)) continue;
    played.add(id);
    for (const choice of nodes[id].choices ?? []) if (choice.type !== "reframe") pending.push(choice.next);
  }
  const offRoute = sceneIds.filter((id) => !played.has(id));
  const entered = new Set(offRoute.flatMap((id) => (nodes[id].choices ?? []).filter((choice) => choice.type !== "reframe").map((choice) => choice.next)));
  const hiddenRoots = offRoute.filter((id) => !entered.has(id));
  const offRoutes = walk([...starts, ...hiddenRoots], all).filter((id) => !played.has(id));
  return [...onRoutes, ...offRoutes];
}

/**
 * The terms a case still says bare on some route, as `case/term`. The rule
 * above found these the day it was written (2026-10-07) and they are story to
 * rewrite, not a script to fix, so they are held as a ceiling: the check fails
 * when a case/term pair is added, and names the ones not on this list. The last
 * 28 were explained on 2026-10-08, so the list is empty and any pair fails.
 */
const BARE_ON_A_ROUTE = new Set([]);
const bareOnARoute = new Map();
for (const caseId of CASE_SEQUENCE) {
  const starts = [...new Set([CASE_START_NODES[caseId], ...Object.values(caseOpeningRoutes[caseId] ?? {})])].filter((id) => nodes[id]);
  const sceneIds = [...new Set([...(nodeOrders[caseId] ?? []), ...Object.keys(nodes).filter((id) => nodes[id].caseId === caseId).sort()])].filter((id) => nodes[id]);
  for (const term of GLOSSARY) {
    const scenes = unexplainedUses(caseId, term, sceneIds, starts);
    if (scenes.length) bareOnARoute.set(`${caseId}/${term}`, scenes);
  }
}
const describeBare = (pair) => `${pair}: needs a (plain explanation) in ${bareOnARoute.get(pair).join(", ")}, where a route reaches it unexplained`;
if (bareOnARoute.size > BARE_ON_A_ROUTE.size) {
  const added = [...bareOnARoute.keys()].filter((pair) => !BARE_ON_A_ROUTE.has(pair));
  for (const pair of added) failures.push(describeBare(pair));
  failures.push(`${bareOnARoute.size} case/term pairs are read unexplained on some route, over the ${BARE_ON_A_ROUTE.size} allowed`);
}
if (process.argv.includes("--list")) for (const pair of bareOnARoute.keys()) console.log(describeBare(pair));

assert.deepEqual(failures, [], failures.join("\n"));
console.log(
  `Plain-language check passed (${Object.keys(BANNED).length} banned words, ${Object.keys(RETIRED_PHRASES).length} retired phrases, ${GLOSSARY.length} glossary terms across ${CASE_SEQUENCE.length} cases; ` +
    `${bareOnARoute.size} of the ${BARE_ON_A_ROUTE.size} allowed case/term pairs are still read unexplained on some route).`,
);
const settled = [...BARE_ON_A_ROUTE].filter((pair) => !bareOnARoute.has(pair));
if (settled.length) console.log(`Explained on every route now; take them off BARE_ON_A_ROUTE: ${settled.join(", ")}.`);
