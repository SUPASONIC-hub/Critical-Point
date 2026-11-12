import { fill } from "../locale.js";
import { ENDING_NAMES } from "../runtimeSystems.js";
import tabTitlesCopy from "../copy/tabTitles.js";

/**
 * The tab on a result (state/tabTitle.js; 개선 포인트 A3, user decision 11-05,
 * and A3-1 (1) on 11-12: the season's ending screen names its ending). The
 * season's last result says the ending by the name a sentence calls it in the
 * page's language (`ENDING_NAMES`, src/copy/seasonEnd.js) --
 * 「[공개와 개입] 시즌 판정 · <the page's title>」 -- and a collapse 「[붕괴]」;
 * a case's result, the ending it closed on. The ending's English label is the
 * fallback for an ending with no name. Nothing here moves: the title is
 * written once, when the result opens.
 */
export function readResultTabTitle({ currentCase, endingVariant, caseTag }) {
  const words = tabTitlesCopy.result;
  if (currentCase !== "final") return fill(words.case, { tag: caseTag });
  if (endingVariant?.id === "collapse") return words.collapse;
  return fill(words.season, { ending: ENDING_NAMES[endingVariant?.id] ?? endingVariant?.label ?? ENDING_NAMES["open-question"] });
}
