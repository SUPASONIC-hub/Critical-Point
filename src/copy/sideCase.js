import { localizeTables } from "../locale.js";

/**
 * E-11 번외 사건: the side screen (SideCaseScreen.jsx) around the season's
 * table -- its header, its ending and the two panels while the case arrives
 * or cannot. Read by key so another language can be laid over them
 * (src/locale.js, 다국어 틀); the Korean is the screen's own, moved here
 * unchanged. A side case's own words (its label, title, scenes and endings)
 * are its pack's (src/nodes/sidePacks.js).
 */
const sideCaseCopy = {
  name: "번외 사건",
  leave: "시작 화면으로",
  // The ending says it (설계안 8절), so a score on the table is not read as one that ranks.
  outOfRanking: "번외 사건은 랭킹 밖입니다. 끝낸 표시는 이 기기에만 남고, 시즌 저장과 기록은 그대로입니다.",
  failed: {
    title: "번외 사건을 불러오지 못했습니다.",
    text: "연결을 확인한 뒤 다시 열어 주세요. 시즌 저장은 그대로입니다.",
  },
  loading: "번외 사건을 여는 중입니다.",
  // The ending's chip, after the case's label ("번외 1 · 결말").
  endingChip: "{label} · 결말",
  exit: "나가기",
  exitTitle: "저장 후 나가기",
  statusLabel: "번외 사건 진행 상태",
  outOfRankingMark: "랭킹 밖",
};
export default sideCaseCopy;

localizeTables("screens", { sideCase: sideCaseCopy });
