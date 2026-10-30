import { localizeTables } from "../locale.js";

/**
 * The ranking screen (RankingScreen.jsx): the words it prints, read by key so
 * another language can be laid over them (src/locale.js, 다국어 틀). The
 * Korean is the screen's own, moved here unchanged. The status card's lines
 * and the rows' names (ranking.js, in the entry chunk) are
 * src/copy/leaderboard.js.
 */
const rankingCopy = {
  back: "브리핑으로 돌아가기",
  title: "어디서 생각이 가장 크게 확장됐는가",
  intro: "버스트 점수와 랭크를 비교합니다. 시즌 기록은 사건 평균 점수입니다. 점수가 높다는 것은 정답을 맞혔다는 뜻이 아니라, 압박 속에서 생각 리듬, 관점 전환, 회복 판단, 구조 재설계가 함께 솟았다는 뜻입니다.",
  retry: "다시 불러오기",
  makeRecord: "내 기록 만들기",
  tableLabel: "플레이어 랭킹",
  baseline: "현재 기준선",
  loadingCount: "불러오는 중",
  count: "{count}명의 기록",
  loaded: "{count}명의 기록을 불러왔습니다.",
  loading: "기록을 불러오는 중입니다.",
  empty: "아직 완료된 기록이 없습니다. 첫 시즌을 끝내고 기준선을 세워보세요.",
  position: "{position}위",
  mine: ", 내 기록",
  seasonCompleteLabel: "시즌 완료 기록",
  seasonComplete: "시즌 완료",
  meta: "{case} · {run} · 주요 압박 {trigger}",
  noTime: "기록 시각 없음",
  average: "평균 {seconds}초",
  reframes: "판 다시 짜기 {count}",
  vault: "사건당 금고 {value}",
  tableTime: "테이블 시간 ×{value}",
  story: "스토리 모드",
  collapsed: "붕괴한 시즌",
  // This device's best of the table before (src/personalBests.js), its own line under the table.
  pastBest: "지난 판(v{version})의 내 최고 {score}점 · {rank}",
  footnote: "다른 참가자는 이름 대신 판단 유형과 실행 번호로 구분됩니다. 이름은 이 브라우저의 기록에만 표시되며, 원격 연결이 없으면 로컬 기록만 집계합니다.",
  // D2 hall of fame (src/hallOfFameBadges.js): the footnote's second sentence and a row's badge.
  hallFootnote: "검사를 통과한 판별 1~3위는 실행 번호로 명예의 전당에 남습니다.",
  hallBadge: "명예의 전당 · {board} {place}위",
  hallMainBoard: "본 판",
  hallProvisional: " (잠정)",
};
export default rankingCopy;

localizeTables("screens", { ranking: rankingCopy });
