import { localizeTables } from "../locale.js";

/**
 * The ad box (src/ads/AdSlot.jsx, 출시 로드맵 2단계, draft): the words it
 * prints, read by key so another language can be laid over them (src/locale.js,
 * 다국어 틀). The Korean is the box's own, moved here unchanged. Only a build
 * with ADSENSE_ADS=on and a unit for a placement imports the box, and so this
 * table; every other build carries none of it.
 */
const adSlotCopy = {
  label: "광고",
  note: "광고 · 점수와 순위에는 영향이 없습니다",
};
export default adSlotCopy;

localizeTables("screens", { adSlot: adSlotCopy });
