import { localizeTables } from "../locale.js";

/**
 * A case's result page (ResultScreen.jsx, the judgment sheet): the words it
 * prints, read by key so another language can be laid over them (src/locale.js,
 * 다국어 틀). The Korean is the screen's own, moved here unchanged. The ending
 * sequence's words (the three twists, the witness records) stay with the
 * endings; the archive under the page is src/copy/report.js.
 */
const resultCopy = {
  replayCase: "이 사건 다시 도전",
  ranking: "랭킹",
  seasonRoadmap: "시즌 로드맵",
  replayLink: "리플레이 링크",
  shareSummary: "공유 요약",
  reset: "초기화",
  outcomeLabel: "내가 만든 결말",
  interludeLabel: "막간",
  endingVariantLabel: "결말 변형",
  endingVariantNote: "이 결말은 단서, 관계, 자원 조합에 따라 달라집니다.",
  epilogueLabel: "엔딩 에필로그",
  failureRecoveryLabel: "실패 복구 경로",
  // Whose record this is: "사건 03 · 한서윤 분석관의 생각 활성 프로필".
  profileLine: "{caseLabel} · {analyst}의 생각 활성 프로필",
  namedAnalyst: "{name} 분석관",
  // The line for a save that kept the default name (appConfig.js
  // DEFAULT_PLAYER_NAME), or a name that is this word itself: said once, not
  // 「분석관 분석관」 as `namedAnalyst` made of it until 11-02.
  defaultAnalyst: "분석관",
  anonymousAnalyst: "익명 분석관",
  storyRunMark: " · 스토리 모드 · 공개 랭킹 제외",
  finalHeadline: "이제 당신은 자신의 조건을 어떻게 쓸지 선택해야 합니다.",
  // After the condition's name, drawn in <em>.
  caseHeadlineTail: " 조건에서 생각이 가장 오래 유지됐습니다.",
  judgmentProfileLabel: "판단 프로필",
  costliestAlternative: "가장 무거운 대안: {label}",
  rankCarryNote: "다음 사건은 이 랭크에 따라 믿음과 공정함을 조금 얹거나, 피로를 안고 시작합니다. ",
  rankNote: "랭크는 정답 여부보다 생각이 정밀하게 솟은 조건을 비교하는 플레이 지표입니다.",
  // C1-1 (2026-11-12): the line under the outcome when this case raised the record
  // title (analystTitle.js getAnalystTitleRise). Every title ends in 관, so 이.
  titleRise: "기록 칭호가 {title}이 되었습니다.",
  // N23: where the report of 사건 01~17 stands in its act, and how far the next 중간 결산 is (actProgress.js).
  actProgress: "{act}막 · {pos}/{size} · 중간 결산까지 {left}사건",
  actProgressHere: "{act}막 · {pos}/{size} · 중간 결산은 아래에",
  // N42, 11-18: the foot of 프롤로그 05, 사건 03 and 사건 07 (LeaveLine.jsx).
  leaveLine: {
    label: "쉬어 가기",
    text: "쉬어도 저장됩니다 · 다음: {next} (약 {minutes}분)",
  },
  // E-11, 11-18: the line on the report of the case a side case follows in the
  // story (sideCases.sideCasesOpenedBy), and its button into the start screen's slot.
  sideOpened: {
    label: "번외 사건",
    text: "번외 사건이 열렸습니다: {names}. 시작 화면의 번외 사건 칸에서 열 수 있고, 랭킹 밖입니다.",
    name: "{label} 「{title}」",
    open: "{name} 열기",
  },
  why: {
    title: "왜 이렇게 됐나",
    subtitle: "이번 판을 결정한 세 가지",
    axis: "결말을 정한 축",
    habit: "당신이 반복한 방식",
    doors: "열지 않은 문",
    doorCount: "{count}개",
    untakenRoad: "가지 않은 길: {label}",
    doorsLeft: "단서 {clues}개와 분기 {branches}개가 아직 기록에 없습니다.",
  },
};
export default resultCopy;

localizeTables("screens", { result: resultCopy });
