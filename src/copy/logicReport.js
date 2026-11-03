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
  switched: "그 사건에서 열기가 오른 뒤 유형을 {count}번 바꿨고, 논리 콤보는 끊기지 않았습니다.",
  broken: "그 사건에서는 한 유형에 머물지 않았고, 논리 콤보가 {count}번 끊겼습니다.",
  unbroken: "그 사건에서는 한 유형에 머물지 않았지만, 논리 콤보는 끊기지 않았습니다.",
  tooFew: "논리 콤보 기록이 있는 사건이 아직 적어, 열기가 가장 높았던 사건을 짚지 않습니다.",
  hold: "논리 유지력 {score}점",
  best: "최고 논리 콤보 {streak}",
  caption: "논리 유지력은 콤보가 끊길 수 있던 판 가운데 끊기지 않은 판의 비율입니다. 관점 전환 점수와는 반대로 움직일 수 있습니다.",
  rank: {
    pending: "순위는 시즌 기록이 {floor}건 모이면 나옵니다.",
    band: "상위 {percent}% 안",
  },
};
export default logicReportCopy;

localizeTables("screens", { logicReport: logicReportCopy });
