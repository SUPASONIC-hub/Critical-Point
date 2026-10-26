import { localizeTables } from "../locale.js";

/**
 * The report's archive, act three of the result page (ReportArchive.jsx): the
 * words it prints, read by key so another language can be laid over them
 * (src/locale.js, 다국어 틀). The Korean is the screen's own, moved here
 * unchanged. The headings already in English stay in the screen; the finale's
 * framing (`endingProfile`) stays with the endings. The lines the runtime
 * writes for this page (the score's parts, the badges) are
 * src/copy/reportLines.js.
 */
const reportCopy = {
  summary: {
    title: "전체 기록",
    contents: "랭크 근거, 판단 DNA, 경로 지도, 관찰 장부, 선택 로그",
  },
  operatorRevealLabel: "주인공 정체 공개",
  achievementLabel: "업적 진행",
  unlocked: "해금",
  observation: {
    title: "관찰 장부",
    subtitle: "마지막 사건에서 처음 공개되는 네 가지 반응",
  },
  endingSceneLabel: "엔딩 장면 프로필",
  nextSceneAction: "다음 장면의 핵심 행동: {choice}",
  endingDirectionLabel: "현재 엔딩 방향",
  endingRationale: "엔딩 근거: {rationale}",
  authorityLabel: "권한 심사",
  failureObjectivesLabel: "실패 재도전 목표",
  playReport: {
    label: "플레이 리포트",
    decisions: "결정",
    clues: "검증 신호",
    style: "행동 성향",
    route: "최근 지나온 장면: {route}",
    noRoute: "기록 없음",
  },
  aftermathLabel: "엔딩 이후 변화",
  delayedLabel: "챕터 지연 결과",
  comparisonLabel: "기록 비교",
  seasonGoalsLabel: "시즌 목표",
  balance: {
    label: "플레이 밸런스 리포트",
    text: "{signals} 선택 편중이 감지되었습니다. 다음 기록에서 다른 선택을 시험해 보세요.",
  },
  endingAxis: {
    label: "엔딩 결정 축",
    subtitle: "이번 선택이 남긴 세 가지 방향",
  },
  fingerprintLabel: "판단 DNA",
  motive: "생각이 깨어나는 조건 · {label}",
  risk: {
    rising: "압박 누적",
    falling: "압박 회수",
    moves: "{drops}회 하락 · {rises}회 상승",
    // "위험 +3": a change in risk, on the lab's lenses and the log's challenges.
    delta: "위험 {delta}",
    recorded: "기록",
    // A forecast that moves the risk by nothing (GameRuntime's formatRiskDelta says "").
    held: "유지",
  },
  counterfactual: {
    subtitle: "실제 선택과 선택하지 않은 관점의 압박 차이",
    safest: "압박을 낮춘 관점",
    differs: "다른 관점과 차이 발생",
    empty: "선택 로그가 쌓이면 지나간 장면의 다른 경로가 열립니다.",
  },
  session: {
    text: "기록 삭제를 요청할 때 쓰는 짧은 세션 코드입니다.",
    noRemote: "원격 랭킹 설정이 없어 이 브라우저에만 저장됩니다.",
    noConsent: "데이터 제공 동의가 없어 원격 랭킹에 기록하지 않았습니다.",
    pending: "원격 저장 대기 {count}건",
    retrying: "재전송 중",
    retry: "원격 저장 재시도",
    waiting: "연결 대기 중",
    copyCode: "코드 복사",
  },
  badges: {
    title: "획득 배지",
    subtitle: "이번 사건의 플레이 스타일입니다.",
  },
  sections: {
    primary: "{title}에서 가장 오래 남은 압박입니다.",
    thisCase: "이번 사건",
    secondary: "첫 번째 조건을 보조한 압박입니다. 같은 선택 안에서도 명분과 비용이 이 방향으로 다시 흔들렸습니다.",
    cognition: "로그상 가장 자주 사용된 생각 방식입니다. 선택을 빠르게 닫기보다 이 방식으로 한 번 더 버티거나 뒤집었습니다.",
    reframeCount: "{count}회",
    reframe: "준비된 선택지를 고르는 대신 판을 다시 연 횟수입니다.",
    seconds: "{seconds}초",
    averageTime: "각 국면에서 결정을 내리기까지 걸린 평균 시간입니다. 짧을수록 선택지가 명확했거나 압박이 약했을 수 있습니다.",
    none: "없음",
    longest: "가장 오래 머문 국면입니다. 이 장면의 메모, 에코 반론, 선택지 비용이 실제 고민을 만들었는지 인터뷰에서 우선 확인합니다.",
  },
  route: {
    title: "내가 지나온 경로",
    count: "{count}개 판단 · 마지막 선택이 이번 결말을 만들었습니다.",
    trackLabel: "이번 플레이 선택 경로",
    hit: "목표 달성",
    miss: "목표 미달",
    streakBreak: "연속 끊김",
    clue: "단서 발견",
  },
  postmortem: {
    label: "관찰자 회고",
    basis: "이번 보고서의 해석 기준: {label}",
  },
  feedback: {
    title: "플레이테스트 피드백",
    subtitle: "이 사건이 얼마나 고민됐는지 남겨 주세요.",
    prompts: "이번 사건에서 확인할 질문",
    clarity: "이해도",
    difficulty: "고민 강도",
    choose: "선택",
    clarityOptions: ["1 · 거의 이해되지 않음", "2 · 일부만 이해됨", "3 · 보통", "4 · 대체로 명확함", "5 · 매우 명확함"],
    difficultyOptions: ["1 · 바로 결정함", "2 · 조금 고민함", "3 · 보통", "4 · 꽤 오래 고민함", "5 · 매우 결정하기 어려움"],
    placeholder: "막힌 장면, 이해되지 않은 용어, 다시 보고 싶은 선택지를 짧게 남겨주세요.",
    commentLabel: "플레이테스트 피드백 자유 의견",
    note: "실명, 연락처, 회사명, 실제 사건 관계자 이름은 적지 마세요. {count}/{max}",
    privacyTitle: "피드백에 식별 정보로 보일 수 있는 표현이 있습니다.",
    privacyText: "감지 항목: {signals}. 저장하려면 인터뷰 기록과 원격 저장 기록에 남기기 전에 익명 표현으로 바꿔주세요.",
    anonymize: "피드백 익명화",
    saving: "저장 중...",
    save: "피드백 저장",
  },
  history: {
    grade: "등급 {grade} · {text}",
    challengeHit: "챌린지 달성",
    challengeMiss: "챌린지 미달",
    replayScene: "장면 다시 보기",
    seconds: "{seconds}초 · {echo}",
  },
  caseChange: "사건 전 → 후",
  finale: {
    aftermath: "마지막 후폭풍에서 고른 길: \"{choice}\".",
    clues: "{clueCount}/{clueTotal} 숨은 단서 발견",
    reached: "실험의 바깥쪽까지 도달했습니다. 마지막 기록이 당신의 선택을 기다립니다.",
    more: "다른 장면에서 위험한 성공을 만들면 더 많은 기록을 찾을 수 있습니다.",
  },
  nextCase: {
    title: "다음 사건의 첫 장면은 이번 사건을 어떻게 닫았는지에 따라 달라집니다.",
    text: "트리거랩은 사건 해결 능력만 보지 않습니다. 어떤 압박이 들어왔을 때 당신이 더 오래 생각하고, 더 쉽게 원칙을 바꾸며, 더 많은 손실을 감수하는지 기록합니다.",
  },
};
export default reportCopy;

localizeTables("screens", { report: reportCopy });
