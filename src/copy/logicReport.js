import { localizeTables } from "../locale.js";

/**
 * The closing report's 논리 유지력 panel (logicReport.js), read by key so
 * another language can be laid over it (src/locale.js, 다국어 틀). The
 * Korean is logicReport.js's, moved here unchanged, its blanks named:
 * `{particle}` is the Korean direction particle after a type ('…'로), which
 * another language may leave out. `rank` is the ranking's line beside the
 * score.
 */
const logicReportCopy = {
  label: "논리 유지력",
  caseName: "{label} 「{title}」",
  lead: "열기가 가장 높았던 사건은 {caseName}입니다.",
  held: "그 사건의 {windows}판 가운데 {count}판을 '{type}'{particle} 닫았습니다.",
  heldAll: "그 사건의 {windows}판을 모두 '{type}'{particle} 닫았습니다.",
  switched: "그 사건에서 열기가 오른 뒤 방향을 {count}번 바꿨고, 논리 콤보는 끊기지 않았습니다.",
  broken: "그 사건에서는 한 방향에 머물지 않았고, 논리 콤보가 {count}번 끊겼습니다.",
  unbroken: "그 사건에서는 한 방향에 머물지 않았지만, 논리 콤보는 끊기지 않았습니다.",
  tooFew: "논리 콤보 기록이 있는 사건이 아직 적어, 열기가 가장 높았던 사건을 짚지 않습니다.",
  hold: "논리 유지력 {score}점",
  best: "최고 논리 콤보 {streak}",
  // Until C-3 (2026-10-25) the streak was held on a thinking type, and this
  // said the score could move against 관점 전환's. Held on a direction, the
  // two can rise together.
  caption: "논리 유지력은 콤보가 끊길 수 있던 판 가운데 끊기지 않은 판의 비율입니다. 같은 방향을 지키는 힘이라, 생각 유형을 고르게 쓰는 관점 전환 점수와 함께 오를 수 있습니다.",
  // What the record's `top` calls a direction (C-3).
  directions: { people: "사람 쪽", position: "자리 쪽" },
  rank: {
    pending: "순위는 시즌 기록이 {floor}건 모이면 나옵니다.",
    band: "상위 {percent}% 안",
  },
};
export default logicReportCopy;

localizeTables("screens", { logicReport: logicReportCopy });
