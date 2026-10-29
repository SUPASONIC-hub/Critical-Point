import { localizeTables } from "../locale.js";

/**
 * 연쇄 위험 (gauntlet/cascadeRisk.js): the CASCADE board's rule as the
 * briefing and the reveal print it, the reveal's line on a link made, and what
 * the table's voice says of the links, read by key so another language can be
 * laid over them (src/locale.js, 다국어 틀). The Korean is cascadeRisk.js's,
 * moved here unchanged; its numbers are that module's constants, filled in.
 */
const cascadeCopy = {
  mutation: {
    title: "그때의 결재가 돌아왔다",
    text: "몇 판 전 크게 태운 카드의 연결. 이번 판은 벽이 {wall} 가까워진다.",
  },
  linkMade: "{min}~{max}판 안에 한 판의 벽이 {wall} 가까워진다.",
  range: { next: "다음 판", after: "{low}판 뒤", within: "{low}~{high}판 안" },
  links: "연결 {live}. 가장 이른 것은 {range}, 그 판의 벽이 {wall} 가까워진다",
};
export default cascadeCopy;

localizeTables("screens", { cascade: cascadeCopy });
