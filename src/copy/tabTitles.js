import { localizeTables } from "../locale.js";

/**
 * The browser tab's titles (state/tabTitle.js; 개선 포인트 A3, user decision
 * 11-05): what the table writes there while the wall is within a push's reach
 * and after a bust (gauntlet/tableTabTitle.js), and what a result writes
 * (state/useResultReport.js), read by key so another language can be laid
 * over them (src/locale.js, 다국어 틀). `{title}` is the page's own title in
 * its language, `{distance}` the heat to the wall band's low edge.
 *
 * The tab is drawn by the browser's own interface, never by the page's font,
 * so these strings are not cut into the Pretendard subset
 * (scripts/font-charset.mjs SKIPPED_FILES): the ⚠ here costs no glyph.
 */
const tabTitlesCopy = {
  table: {
    wall: "⚠ 벽까지 {distance} · {title}",
    bust: "[징계 회부] {title}",
  },
  result: {
    collapse: "[SYSTEM COLLAPSE] 시즌 붕괴 · {title}",
    season: "[{ending}] 시즌 판정 · {title}",
    case: "[사건 종료] {tag} · {title}",
  },
};
export default tabTitlesCopy;

localizeTables("screens", { tabTitles: tabTitlesCopy });
