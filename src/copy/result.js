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
  anonymousAnalyst: "익명 분석관",
  storyRunMark: " · 스토리 모드 · 공개 랭킹 제외",
  finalHeadline: "이제 당신은 자신의 조건을 어떻게 쓸지 선택해야 합니다.",
  // After the condition's name, drawn in <em>.
  caseHeadlineTail: " 조건에서 생각이 가장 오래 유지됐습니다.",
  judgmentProfileLabel: "판단 프로필",
  costliestAlternative: "가장 무거운 대안: {label}",
  rankCarryNote: "다음 사건은 이 랭크에 따라 믿음과 공정함을 조금 얹거나, 피로를 안고 시작합니다. ",
  rankNote: "랭크는 정답 여부보다 생각이 정밀하게 솟은 조건을 비교하는 플레이 지표입니다.",
  // E-11: the finale's one line, once a side case is written (SIDE_CASES).
  sideSlotOpened: { label: "번외 사건", text: "번외 사건 칸이 열렸습니다. 시작 화면에서 열 수 있고, 랭킹 밖입니다." },
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
