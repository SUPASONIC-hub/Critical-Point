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
};
export default auditCopy;

localizeTables("screens", { audit: auditCopy });
