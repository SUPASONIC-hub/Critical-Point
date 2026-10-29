import { localizeTables } from "../locale.js";
import { triggerLabels } from "../gameConstants.js";

/**
 * The ranking's rows and status card as the entry chunk words them
 * (ranking.js, state/useLeaderboard.js), and the pressures a row names, read
 * by key so another language can be laid over them (src/locale.js, 다국어
 * 틀). The Korean is the modules' own, moved here unchanged; a name followed
 * by its particle is a `{particle}` blank. The pressures stay in
 * gameConstants.js, where every screen reads them by key, and are named here
 * so their words are laid over in place.
 */
const leaderboardCopy = {
  localName: "현재 분석관",
  anonymousName: "익명 분석관",
  anonymousHandle: "{run} · 익명",
  loading: "기록을 불러오는 중입니다.",
  emptyTitle: "아직 공개된 기록이 없습니다.",
  emptyText: "첫 번째 완주 기록이 이 테이블의 기준선을 만듭니다.",
  leaderTitle: "{leader}{particle} 현재 기준선을 세웠습니다.",
  leaderText: "{case}에서 {score}점과 {rank} 랭크를 기록했습니다.",
  remoteFailed: "원격 기록을 불러오지 못해 이 브라우저의 완료 기록만 표시합니다.",
  offline: "오프라인이라 이 브라우저의 완료 기록만 표시합니다.",
  triggers: triggerLabels,
};
export default leaderboardCopy;

localizeTables("screens", { leaderboard: leaderboardCopy });
