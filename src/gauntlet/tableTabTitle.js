import { useTabTitle } from "../state/tabTitle.js";
import { fill } from "../locale.js";
import tabTitlesCopy from "../copy/tabTitles.js";

/**
 * The table's claim on the browser tab (state/tabTitle.js; 개선 포인트 A3,
 * user decision 11-05: the tab alone, the score untouched). While the wall is
 * within one push's reach -- the HUD's 밀면 벽 사정권 and 벽 구간 안 stages
 * (tableMeters.js describeDanger) -- the tab counts to the band's low edge:
 * 「(warning sign) 벽까지 3 · <the page's title>」, 0 once the heat is in the band. The
 * count is a whole number, so the title changes when the count does, on a
 * push or a cool, and not on every tick of the creep. It reads the band the
 * table draws, never the wall inside it.
 *
 * A bust is 「[징계 회부] <the page's title>」, held past the table through
 * the reveal and the next window's briefing, until the next table opens or
 * the player leaves the table (useScreenTabTitle drops it off the play
 * screen). A table that is cold, closed by a cash or not yet open leaves the
 * tab to the page.
 */
export function readTableTabTitle({ win, band, schema, tableOpen, live }) {
  const words = tabTitlesCopy.table;
  if (win.status === "bust" && win.cause !== "abandon") return words.bust;
  if (!tableOpen) return undefined;
  if (!live) return null;
  const distance = Math.max(0, Math.ceil(band.wallMin - win.gauge));
  return distance > schema.stepMax ? null : fill(words.wall, { distance });
}

/** The stage's hook: the claim above in the `table` slot, a bust kept. */
export function useTableTabTitle(table) {
  const text = readTableTabTitle(table);
  useTabTitle("table", text, { rank: 1, keep: text === tabTitlesCopy.table.bust });
}
