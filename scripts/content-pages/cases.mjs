import { CASE_SEQUENCE, seasonCasesBase } from "../../src/gameCases.js";
import { chapterRules } from "../../src/caseCopy.js";
import * as enIndex from "../../src/locales/en/index.js";
import * as enCases11 from "../../src/locales/en/between/case11-20.js";
import * as enCases21 from "../../src/locales/en/between/case21-30.js";
import * as enCases31 from "../../src/locales/en/between/case31-40.js";
import * as enCases41 from "../../src/locales/en/between/case41-49.js";
import * as jaIndex from "../../src/locales/ja/index.js";
import * as jaCases11 from "../../src/locales/ja/between/case11-20.js";
import * as jaCases21 from "../../src/locales/ja/between/case21-30.js";
import * as jaCases31 from "../../src/locales/ja/between/case31-40.js";
import * as jaCases41 from "../../src/locales/ja/between/case41-49.js";
import textP1to04 from "./cases/text-p1-04.mjs";
import text05to13 from "./cases/text-05-13.mjs";
import text14to22 from "./cases/text-14-22.mjs";
import text23to31 from "./cases/text-23-31.mjs";
import text32to40 from "./cases/text-32-40.mjs";
import text41toFinal from "./cases/text-41-final.mjs";

/**
 * The case files: an index of the season's fifty-five cases and one page for
 * each, in Korean, English and Japanese.
 *
 *   /cases/index.html     /en/cases/index.html     /ja/cases/index.html
 *   /cases/prologue01.html ... /cases/case01.html ... /cases/final.html
 *
 * A case's name is the game's own (`seasonCasesBase` in src/gameCases.js and
 * the two dictionaries laid over it), and so is its chapter rule
 * (`chapterRules`, src/caseCopy.js), which the game prints as the case opens.
 * The rest -- when and where, the premise, who is in the room, the question
 * the case asks -- was written for these pages from each case's first two
 * scenes (`./cases/text-*.mjs`), and goes no further: no choice's outcome,
 * no reveal and none of the season's endings
 * (tests/unit/content-pages.test.mjs holds the last).
 *
 * The listing's own summaries are left out on purpose: the game shows a
 * locked case's line only once it is reached, and a few of them name what
 * the cases before found out.
 */

/** Every case's text, by id. */
export const CASE_TEXT = { ...textP1to04, ...text05to13, ...text14to22, ...text23to31, ...text32to40, ...text41toFinal };

const tablesOf = (modules) => modules.map((module) => module.copy);
const OVERLAYS = {
  en: tablesOf([enIndex, enCases11, enCases21, enCases31, enCases41]),
  ja: tablesOf([jaIndex, jaCases11, jaCases21, jaCases31, jaCases41]),
};

/** One case's entry of a table, in a language: the Korean with each dictionary's words for it laid over. */
function localized(group, table, caseId, base, language) {
  if (language === "ko") return base;
  const words = OVERLAYS[language].map((copy) => copy?.[group]?.[table]?.[caseId]).filter(Boolean);
  return Object.assign({}, base, ...words);
}

const SEASON = Object.fromEntries(seasonCasesBase.map((entry) => [entry.id, entry]));

/** A case's label and title as the game prints them: `사건 01`, `72시간`. */
export function caseName(caseId, language) {
  const { label, title } = localized("gameCases", "seasonCasesBase", caseId, SEASON[caseId], language);
  return { label, title };
}

/** The rule a case opens with, in a language: `{ label, rule }`. */
export function caseRule(caseId, language) {
  const base = chapterRules[caseId];
  if (!base) return null;
  const { label, rule } = localized("caseCopy", "chapterRules", caseId, base, language);
  return { label, rule };
}

/** The cases that have a page, in the season's order. */
export const CASE_PAGES = CASE_SEQUENCE.filter((caseId) => CASE_TEXT[caseId]);

/** A case's page kind: `cases/case01`. */
export const caseKind = (caseId) => `cases/${caseId}`;

export const CASE_WORDS = {
  ko: {
    index: "사건 파일",
    earlier: "앞 사건의 전개가 나옵니다",
    back: "사건 파일 목록으로",
    reveal: "때와 곳, 질문 펼치기 (앞 사건의 전개가 나옵니다)",
    setting: "때와 곳",
    premise: "사건 개요",
    rule: "이 장의 규칙",
    cast: "등장인물",
    question: "이 사건이 묻는 질문",
    fiction: "이 페이지는 사건의 첫 두 장면까지만 다룹니다. 선택의 결과와 이야기의 반전은 게임에서 직접 확인하세요. 게임에 나오는 인물, 회사, 기관과 사건은 모두 허구입니다.",
    previous: "← 이전 사건",
    next: "다음 사건 →",
    all: "사건 파일 전체",
    play: "게임 시작하기",
    prologue: "프롤로그 · 3년 전 (2022–2023)",
    main: "본편 · 사건 01–49",
    final: "마지막 사건",
  },
  en: {
    index: "Case Files",
    earlier: "This page shows how the earlier cases unfolded",
    back: "Back to the case files",
    reveal: "Show the setting and the question (shows how the earlier cases unfolded)",
    setting: "When and where",
    premise: "The case",
    rule: "This chapter's rule",
    cast: "Who is in the room",
    question: "The question this case asks",
    fiction: "This page covers only a case's first two scenes. The outcomes of your choices and the story's turns are for you to find in the game. All people, companies, institutions and events in the game are fictional.",
    previous: "← Previous case",
    next: "Next case →",
    all: "All case files",
    play: "Play the game",
    prologue: "Prologue · three years earlier (2022–2023)",
    main: "Main story · Cases 01–49",
    final: "The last case",
  },
  ja: {
    index: "事件ファイル",
    earlier: "前の事件の展開が出てきます",
    back: "事件ファイル一覧へ",
    reveal: "時と場所、問いを開く(前の事件の展開が出てきます)",
    setting: "時と場所",
    premise: "事件の概要",
    rule: "この章のルール",
    cast: "登場人物",
    question: "この事件が問うこと",
    fiction: "このページは事件の最初の二つの場面までを扱います。選択の結果と物語の転換は、ゲームの中で確かめてください。ゲームに登場する人物、会社、機関、事件はすべて架空のものです。",
    previous: "← 前の事件",
    next: "次の事件 →",
    all: "事件ファイル一覧",
    play: "ゲームを始める",
    prologue: "プロローグ · 3年前(2022〜2023年)",
    main: "本編 · 事件01〜49",
    final: "最後の事件",
  },
};

export const CASE_INDEX_INTRO = {
  ko: [
    "「임계점: CRITICAL POINT」의 시즌은 55개의 사건이 하나의 사슬로 이어진 이야기입니다. 2023년 KD은행이 물류 플랫폼 플로우온에 내준 310억 원짜리 대출 한 건이 모든 사건의 밑바닥에 깔려 있고, 사건 하나를 닫을 때 남긴 판단이 다음 사건의 첫 장면과 테이블의 규칙을 바꿉니다.",
    "처음 다섯 사건은 3년 전으로 돌아가는 프롤로그입니다. 당신은 은행의 수습 심사역으로 그 대출을 처음 만나고, 반대 의견서를 쓰고, 지하의 연구소로 발령을 받습니다. 본편 마흔아홉 사건은 그로부터 3년 뒤, 트리거랩의 분석관이 된 당신이 같은 대출번호를 다시 만나는 데서 시작합니다. 시즌은 마지막 사건 하나로 닫힙니다.",
    "아래 파일은 각 사건이 어디서, 누구와, 무엇을 묻는지만 적었습니다. 사건마다 첫 두 장면까지의 이야기만 다루고, 선택의 결과나 반전은 적지 않았습니다. 사건은 순서대로 열리며, 하나에 10분 안팎이 걸립니다.",
  ],
  en: [
    "A season of Critical Point is one story told in 55 cases, linked like a chain. Underneath every one of them lies a single loan: the ₩31 billion KD Bank lent to the logistics platform FlowOn in 2023. The call you leave behind as you close one case changes the first scene and the table rules of the next.",
    "The first five cases are the prologue, set three years earlier. As a trainee credit analyst at the bank, you meet that loan for the first time, write a dissent against it and are transferred to a lab in the basement. The 49 cases of the main story begin three years later, when you, now an analyst at Trigger Lab, meet the same loan number again. The season closes with one last case.",
    "Each file below says only where a case takes place, who is in it and what it asks. It covers the story up to the case's second scene and leaves out the outcomes of choices and every turn of the plot. Cases open in order, and each takes about ten minutes.",
  ],
  ja: [
    "『臨界点: CRITICAL POINT』のシーズンは、55の事件が一本の鎖のようにつながった物語です。2023年にKD銀行が物流プラットフォームのフロウオンに貸し出した310億ウォンの融資一件が、すべての事件の底にあります。一つの事件を閉じるときに残した判断が、次の事件の最初の場面とテーブルのルールを変えます。",
    "最初の五つの事件は、3年前にさかのぼるプロローグです。あなたは銀行の見習い審査役としてその融資に初めて出会い、反対意見書を書き、地下の研究所へ異動を命じられます。本編の49の事件は、その3年後、トリガーラボの分析官になったあなたが同じ融資番号に再び出会うところから始まります。シーズンは最後の事件で閉じます。",
    "下のファイルには、それぞれの事件がどこで起き、誰が登場し、何を問うのかだけを書きました。各事件の最初の二つの場面までの物語だけを扱い、選択の結果や物語の転換は書いていません。事件は順番に開き、一つにつき10分前後かかります。",
  ],
};

export const CASE_INDEX_DESCRIPTION = {
  ko: "「임계점: CRITICAL POINT」의 55개 사건 파일. 프롤로그부터 마지막 사건까지, 각 사건의 배경과 등장인물과 질문을 스포일러 없이 소개합니다.",
  en: "The 55 case files of Critical Point, from the prologue to the last case: each case's setting, people and question, without spoilers.",
  ja: "『臨界点: CRITICAL POINT』の55の事件ファイル。プロローグから最後の事件まで、各事件の舞台、登場人物、問いをネタバレなしで紹介します。",
};

/**
 * From 사건 10 on, a case's own setup tells how the cases before it went
 * (user's decision 11-09, option 1): its page says so at the top, and the
 * index keeps its lines folded (`<details>`, in the HTML for a crawler).
 */
export const FIRST_LATE_CASE = "case10";
export const tellsEarlierCases = (caseId) => CASE_SEQUENCE.indexOf(caseId) >= CASE_SEQUENCE.indexOf(FIRST_LATE_CASE);

export const caseGroup = (caseId) => (caseId.startsWith("prologue") ? "prologue" : caseId === "final" ? "final" : "main");
