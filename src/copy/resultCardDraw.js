import { localizeTables } from "../locale.js";

/**
 * What the result card prints and the line copied beside it
 * (resultCardModel.js, resultCard.js), read by key so another language can
 * be laid over them (src/locale.js, 다국어 틀). The Korean is
 * resultCardModel.js's, moved here unchanged.
 */
const resultCardDrawCopy = {
  // The words the card prints that are the same for every season.
  labels: {
    game: "TRIGGERLAB: CRITICAL POINT",
    season: "SEASON 01 · FINAL RECORD",
    dna: "판단 DNA",
    ending: "결말",
    burst: "최고 버스트",
    rank: "랭크",
    league: "리그",
    logic: "논리 유지력",
    points: "점",
    story: "스토리 모드",
    byline: "익명 분석관의 기록",
  },
  // What a card with a piece missing prints in its place.
  unreadMode: "기록되지 않은 판단",
  unreadEnding: "미확정 경로",
  shareLine: "트리거랩에서 한 시즌을 끝냈습니다. 판단 DNA는 '{mode}', 결말은 '{ending}'. 최고 버스트 {burst}{points}, {rank} 랭크.{share}",
};
export default resultCardDrawCopy;

localizeTables("screens", { resultCardDraw: resultCardDrawCopy });
