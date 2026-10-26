import { localizeTables } from "../locale.js";

/**
 * The words of 이번 주의 규칙's catalogue (gauntlet/weeklyRules.js): each
 * rule's title, its text and its line in the story, and the audit's and the
 * links' lines the test weeks share, read by key so another language can be
 * laid over them (src/locale.js, 다국어 틀). The Korean is the catalogue's,
 * moved here unchanged; its numbers are the catalogue's constants, filled in
 * as `{blanks}` (`ruleWords` there), so a tuned number is still one edit.
 */
const weekRulesCopy = {
  auditLine: "한 번 이상 밀고 열기 {heat} 미만에서 확정하면 감사 +1. {limit}칸이 찬 채 사건이 닫히면 금고로 갈 몫의 {share}분의 1을 잃는다.",
  cascadeLine: "한 자원을 8 이상 태운 카드를 확정하면 2~4판 안에 한 판의 벽이 6 가까워진다. 사건이 닫힐 때 남은 연결은 다음 사건으로 넘어간다.",
  rules: {
    "near-wall": {
      title: "벽이 가깝다",
      text: "이번 주는 벽 띠가 열기 {shift}만큼 앞당겨 선다. 같은 열기로 더 빨리 벽에 닿는다.",
      world: "이번 주 그룹은 감사를 앞당겼다.",
    },
    "heavy-fracture": {
      title: "균열이 깊다",
      text: "이번 주는 FRACTURE가 금 간 자원을 {rate}배로 청구한다.",
      world: "이번 주 회계팀은 금 간 장부를 한 번 더 넘겨 본다.",
    },
    "short-clock": {
      title: "시간이 짧다",
      text: "이번 주는 판마다 시간이 {seconds}초 짧고, 모든 카드의 칩이 {chips}배다.",
      world: "이번 주 이사회는 보고 시간을 줄이고 보고서 값을 올렸다.",
    },
    audit: { title: "감사 주간", text: "{audit}" },
    cascade: { title: "연쇄 주간", text: "{cascade}" },
    "audit-cascade": {
      title: "감사와 연쇄",
      text: "이번 주는 감사와 연쇄가 함께 선다. {audit} {cascade} CASCADE 판의 확정은 감사에 세지 않는다.",
    },
  },
};
export default weekRulesCopy;

localizeTables("screens", { weekRules: weekRulesCopy });
