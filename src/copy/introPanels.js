import { localizeTables } from "../locale.js";

/**
 * The start screen's panels that advancedSystems.js and analystTitle.js
 * word, the season's first echo (state/openingState.js) and the tab title's
 * tail (state/tabTitle.js), read by key so another language can be laid over
 * them (src/locale.js, 다국어 틀). The Korean is those modules', moved here
 * unchanged, its blanks named. A page in another language lays its words over
 * this table before the first paint, so every reader asks for a line when it
 * prints it, never at load.
 */
const introPanelsCopy = {
  // The record title by how far the record reached (analystTitle.js ANALYST_TITLE_STEPS,
  // the five steps and their milestones). 수습 holds for 프롤로그 01 only: the
  // traineeship ends with it (docs/canon.md).
  analystTitles: {
    prologue01: "수습 분석관",
    prologue02: "분석관",
    case01: "선임 분석관",
    case25: "책임 분석관",
    finished: "수석 분석관",
  },
  // The line under the play-style picker (getPlayStyleUnlocks).
  playStyles: {
    instinct: "첫 반응으로 정하겠다는 다짐",
    auditor: "근거를 확인하고 정하겠다는 다짐",
    mediator: "대화로 압박을 낮추겠다는 다짐",
  },
  newGamePlusOpen: "지난 시즌의 결말을 이 화면에서 다시 볼 수 있습니다",
  newGamePlusLocked: "최종 기록을 완료하면 NEW GAME+ 해금",
  // How a hand is played (getTutorialSteps).
  tutorial: {
    read: { label: "장면 읽기", text: "상황과 화자, 질문을 읽습니다. 읽는 시간은 점수에 들어가지 않습니다." },
    weigh: { label: "카드 걸기", text: "카드 한 장을 골라 겁니다. 카드마다 얻는 것과 치르는 것이 다릅니다." },
    commit: { label: "밀기와 확정", text: "밀수록 열기와 배율이 오릅니다. 보이지 않는 벽에 닿기 전에 확정하면 판돈이 쌓이고, 사건을 닫으면 금고로 갑니다." },
    replay: { label: "다시 보기", text: "다른 기록은 다른 권한과 엔딩을 엽니다." },
  },
  // The season's goals (getSeasonGoals). `{particle}` is the Korean object particle after the label.
  goals: {
    protect: "사건마다 {harm}{particle} 평균 {gate} 아래로 닫고 시즌 완료",
    evidence: "사건 기록의 {percent}% 이상 열기",
    trust: "{trust}{particle} 사건마다 평균 {gate} 이상으로 지키기",
  },
  // The start screen's NEW GAME+ panel (getPastRunMemory).
  veteranTable: "NEW GAME+는 프롤로그 01부터 모든 규칙이 켜지고, 도구도 더 일찍 받습니다.",
  pastCase: "이전 기록에서 CASE {code}의 마지막 선택을 남겼습니다. 이번에는 그 결과를 바꿀 수 있습니다.",
  // What a ranking row's link to its run says (getRankingIntegrity).
  integrity: {
    linked: "한 플레이로 묶인 기록입니다. 공개 랭킹은 모든 사건 기록이 15분 이상에 걸쳐 서버에 도착한 시즌만 받고, 점수·등급·시간이 맞지 않는 기록은 서버에 따로 표시해 둡니다.",
    missing: "플레이 식별자가 없어 임시 로컬 기록으로 처리됩니다.",
  },
  // The line under a season's first scene, before any choice (openingState.js OPENING_ECHO).
  openingEcho: "얼마나 똑똑한지는 묻지 않겠습니다. 대신 언제 생각을 멈추지 못하는지 보겠습니다.",
  // What follows a situation in the browser tab's title (tabTitle.js).
  tabSuffix: " · 임계점",
  // The storage banner the intro and the report print (appViewModels.js createTelemetrySummary).
  storageBanner: {
    offline: { title: "오프라인", text: "연결이 복구되면 원격 저장을 다시 사용할 수 있습니다. 현재 기록은 브라우저에 저장됩니다." },
    ready: { title: "원격 저장 준비됨", text: "사건 완료와 피드백 제출 시 동의한 기록만 원격 저장합니다." },
    pending: { title: "원격 저장 준비됨 · 동의 대기", text: "체크박스에 동의하면 이 세션의 완료 로그와 피드백을 원격 저장합니다." },
    local: { title: "로컬 저장", text: "원격 저장 설정이 없어 브라우저 저장과 JSON 내보내기만 사용합니다." },
  },
  // The name a save starts with when none is typed (appConfig.js
  // DEFAULT_PLAYER_NAME), as a page prints it. The save keeps the Korean name;
  // this is only how it is shown (playerNameShown).
  defaultName: "분석관",
};
export default introPanelsCopy;

localizeTables("screens", { introPanels: introPanelsCopy });
