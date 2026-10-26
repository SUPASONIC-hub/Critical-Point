import { localizeTables } from "../locale.js";

/**
 * The play header (GameHeader.jsx): the words it prints and the names its
 * icon buttons announce, read by key so another language can be laid over
 * them (src/locale.js, 다국어 틀). The Korean is the header's own, moved here
 * unchanged. StudioCredit.jsx prints only English and is not here.
 */
const headerCopy = {
  save: "저장",
  saveAndExit: "저장 후 나가기",
  comfort: "편의 설정",
  reset: "초기화",
  statusLabel: "현재 진행 상태",
  // {number} is drawn in bold, in an element of its own.
  caseNumber: "사건 {number}",
  progressLabel: "현재 사건 진행률",
};
export default headerCopy;

localizeTables("screens", { header: headerCopy });
