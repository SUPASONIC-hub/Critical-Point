import { localizeTables } from "../locale.js";

/**
 * The other players' lines on a scene, read by key so another language can
 * be laid over them (src/locale.js, 다국어 틀): how many staked the same card
 * (sceneChoices.js, under the decision reveal, with 「드문 선택」 for the
 * minority's) and how many hit the wall here (sceneTraces.js, under the
 * scene's 사건 파일). The Korean is those modules', moved here unchanged.
 */
const sceneRatesCopy = {
  choice: "같은 카드를 고른 분석관 {percent}%",
  rare: " · 드문 선택",
  trace: "이 장면에서 다른 분석관의 {percent}%가 벽에 닿았습니다.",
};
export default sceneRatesCopy;

localizeTables("screens", { sceneRates: sceneRatesCopy });
