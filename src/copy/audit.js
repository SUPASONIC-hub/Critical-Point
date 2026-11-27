import { localizeTables } from "../locale.js";

/**
 * 감사 위험 (gauntlet/auditRisk.js): what the cash button's description, the
 * table's voice and the table record say about the audit, read by key so
 * another language can be laid over them (src/locale.js, 다국어 틀). The
 * Korean is auditRisk.js's, moved here unchanged.
 */
const auditCopy = {
  ifCashUp: "지금 확정하면 감사 +1, {after}/{limit}",
  ifCashDown: "지금 확정하면 감사 −{relief}, {after}/{limit}",
  ifCashSame: "지금 확정해도 감사 {after}/{limit} 그대로",
  spoken: "감사 위험 {count}/{limit}. {limit}칸이 차면 사건이 닫힐 때 금고로 갈 몫의 {share}분의 1을 잃는다",
  ledger: "감사 {count}/{limit}칸으로 닫혔다.",
  caught: " 적발.",
  // G35 (RULES_MARK 9): 너무 매끈한 장부, the cashes of a case within ±{span} heat of one another.
  smoothWarn: "같은 자리면 감사",
  smoothUp: "지금 확정하면 같은 자리 확정 {after}/{limit}",
  smoothSame: "지금 확정해도 같은 자리 확정 {after}/{limit} 그대로",
  smoothSpoken: "장부 매끈함 {count}/{limit}. 한 사건에서 열기 ±{span} 안의 같은 자리에서 {limit}번 확정하면 사건이 닫힐 때 금고로 갈 몫의 {share}분의 1을 잃는다",
};
export default auditCopy;

localizeTables("screens", { audit: auditCopy });
