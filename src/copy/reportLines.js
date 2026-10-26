import { localizeTables } from "../locale.js";

/**
 * The report's lines the runtime writes before the result screen draws them
 * (state/useResultReport.js and viewModels/reportViewModels.js): the rank's
 * line, the score's parts, the badges, the season's standing, the decision
 * pace, the feedback questions and the tab's title, read by key so another
 * language can be laid over them (src/locale.js, 다국어 틀). The Korean is the
 * modules' own, moved here unchanged. A table of its own rather than the
 * screen's (src/copy/result.js, src/copy/report.js): these are read in the
 * runtime's chunk, the screen's words only in the result screen's.
 * `createEndingProfile`'s three framings are the finale's and stay with it.
 */
const reportLinesCopy = {
  rankLines: {
    S: "생각 리듬, 관점 전환, 압박 회복이 동시에 솟았습니다.",
    A: "정답을 고른 것이 아니라, 압박 속에서 판단 패턴이 선명하게 드러났습니다.",
    B: "사건은 통과했습니다. 다음 플레이에서는 다른 생각 방식으로 흔들어볼 여지가 있습니다.",
  },
  rankLineFallback: "사건은 통과했지만 버스트 신호는 아직 약합니다. 즉답보다 근거, 비용, 회복 경로를 더 남겨보세요.",
  bridge: {
    longest: "{trigger} 압박이 가장 오래 남았고, \"{title}\"에서 판단 시간이 길어졌습니다.",
    plain: "{trigger} 압박이 가장 오래 남았습니다.",
  },
  feedback: {
    longest: "{title}에서 실제로 멈칫한 이유가 있었나요?",
    longestFallback: "가장 오래 머문 장면",
    reframed: "판을 다시 짜서 열린 경로가 보기에 없던 길처럼 느껴졌나요?",
    notReframed: "구조 재설계를 쓰지 않았다면, 기존 선택지가 충분히 답처럼 보였나요?",
    nextCase: "다음 사건 「{title}」까지 이어서 보고 싶은 이유가 생겼나요?",
    finale: "최종 선택이 트리거랩의 실험 구조와 자연스럽게 연결됐나요?",
  },
  tabTitle: {
    collapse: "[SYSTEM COLLAPSE] 시즌 붕괴",
    season: "[{ending}] 시즌 판정",
    case: "[사건 종료] {tag}",
  },
  rationaleClues: "단서 {count}",
  standing: {
    clear: "붕괴선 아래",
    near: "붕괴선 가까움",
    over: "붕괴선 넘음",
    harm: "시즌 평균 {harmLabel} {perCase} / {gate} · 터진 판 {bustPercent}%",
    overreach: "시즌 평균 {harmLabel} {perCase} / {gate} · 터진 판 {bustPercent}% / {bustGate}%",
    harmCase: "{caseLabel} 다시 도전 · {harmLabel} {harm}",
  },
  score: {
    points: "{score}점",
    penalty: "-{score}점",
    none: "없음",
    consistency: { label: "기준 유지", note: "열기가 올라간 장면에서도 같은 방향을 지켰는지 봅니다. 버스트 점수에서 가장 큰 몫입니다." },
    rhythm: { label: "생각 리듬", note: "즉답이나 방치가 아니라, 압박을 읽고 결론까지 밀어낸 시간대입니다. 점수 비중은 가장 작습니다." },
    cognition: { label: "관점 전환", note: "같은 방식만 반복하지 않고 추론, 위험, 재구성, 버티기 사이를 오간 흔적입니다." },
    pressureAdapt: { label: "압박 대응", note: "위험을 무조건 피한 점수가 아니라, 상승한 압박을 다시 회수한 능력입니다." },
    reflection: { label: "구조 재설계", note: "판을 다시 짜 숨은 경로를 열고, 장면 챌린지를 맞히고, 숨은 기록을 찾아낸 정도입니다." },
    exploit: { label: "즉답 패널티", note: "표시된 정보만 따라 빠르게 누르는 플레이가 반복될 때만 감점됩니다." },
  },
  // The badges' texts; their titles are English already and are the list's keys.
  badges: {
    burst: "생각 버스트 {score}점을 기록했습니다.",
    boardBreaker: "선택지 밖에서 판을 다시 짰습니다.",
    routeFollower: "주어진 선택지 안에서 비용을 비교했습니다.",
    slowThinker: "한 장면 이상에서 판단을 오래 붙잡았습니다.",
    fastCloser: "빠르게 결론을 닫는 플레이를 보였습니다.",
    riskCutter: "{count}번 위험 압력을 낮췄습니다.",
    heatTaker: "위험을 낮추기보다 다른 목표를 우선했습니다.",
    challengeClear: "{count}개 장면 도전을 달성했습니다.",
    openQuest: "장면 도전은 남았고, 선택 로그만 기록됐습니다.",
    perfectRun: "{count}연속 장면 목표를 맞혀 최고 보상을 열었습니다.",
    streak: "{count}연속 장면 목표를 맞혀 추가 보상을 열었습니다.",
    chainStarter: "장면 목표를 연속으로 맞히면 추가 보상이 열립니다.",
    flowSurge: "{count}번 보너스 자원 회복을 만들었습니다.",
    noSurge: "챌린지와 위험 제어가 아직 보너스로 이어지지 않았습니다.",
    crisisRunner: "높은 압력 상태로 사건을 통과했습니다.",
    pressureKeeper: "위험 압력을 통제 가능한 범위에 묶었습니다.",
  },
  pace: {
    same: "앞의 {count}번도 뒤의 {count}번도 평균 {last}초 만에 골랐습니다.",
    faster: "뒤의 {count}번은 평균 {last}초 만에 골랐습니다. 앞의 {count}번은 {first}초였습니다.",
    slower: "뒤의 {count}번은 평균 {last}초를 들여 골랐습니다. 앞의 {count}번은 {first}초였습니다.",
  },
};
export default reportLinesCopy;

localizeTables("screens", { reportLines: reportLinesCopy });
