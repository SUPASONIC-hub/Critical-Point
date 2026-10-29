import { localizeTables } from "../locale.js";

/**
 * What the ending screen says around the result card (resultCardCopy.js,
 * ResultCardShare.jsx), read by key so another language can be laid over it
 * (src/locale.js, 다국어 틀). The Korean is resultCardCopy.js's, moved here
 * unchanged. What the card itself prints is src/copy/resultCardDraw.js, in
 * the card's own chunk.
 */
const resultCardCopy = {
  shareLabel: "결과 카드 공유",
  saveLabel: "결과 카드 저장",
  making: "카드를 만드는 중입니다.",
  saved: "결과 카드를 저장하고 소개 문구를 복사했습니다.",
  savedUncopied: "결과 카드를 저장했습니다. 문구는 복사하지 못했습니다.",
  shared: "결과 카드를 공유했습니다.",
  failed: "카드를 만들지 못했습니다. 다시 눌러 주세요.",
  note: "카드에는 이름이 들어가지 않습니다.",
};
export default resultCardCopy;

localizeTables("screens", { resultCard: resultCardCopy });
