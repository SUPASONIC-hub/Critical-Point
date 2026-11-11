/**
 * E-3 결말 도감: which of the season's endings and rulings this device has
 * seen, said on the start screen's NEW GAME+ panel as 「결말 3/9 · 판결 2/3」,
 * a line naming an ending the next season can still reach, and one hint of
 * fact per ending not yet seen.
 *
 * The panel is the entry chunk's, which has no room for this copy, so the
 * lines are written here, on the runtime's side, into the season record
 * (`endingBook`) when a season is counted or the record is read by the
 * runtime (newGamePlusCarry.js), and the panel prints what it finds
 * (advancedSystems.getPastRunMemory), as it does the record's `last.line`.
 *
 * The endings are the nine the ruling resolves (`ENDING_NAMES`,
 * runtimeSystems.js, named as the season preview names them), the rulings the
 * three the final choice can make (`VERDICT_ENDINGS`, verdictBranch.js). No
 * ending is made here. Every line is as the user decided it on 2026-10-23
 * (PR 「문구 질문 후보」, all (1)).
 */
import { ENDING_GATES } from "../gameConstants.js";
import { ENDING_NAMES } from "../runtimeSystems.js";
import { VERDICT_ENDINGS } from "../verdictBranch.js";
import { appliedLocale, fill } from "../locale.js";
import introPanels from "../copy/introPanels.js";
import seasonLines from "../copy/seasonLines.js";

// The book's words (src/copy/seasonLines.js `book`), read when the book is written so they are the page's language.
const W = seasonLines.book;

/** Every ending the ruling resolves, in the order the book lists them. */
export const BOOK_ENDINGS = Object.freeze(Object.keys(ENDING_NAMES));

/** The three rulings the finale's 「그 칸을 닫는 방법」 can make. */
export const BOOK_VERDICTS = Object.freeze(Object.keys(VERDICT_ENDINGS));

/**
 * One fact per ending: what the season it closes on held, read from the
 * gates `getEndingVariant` (gameLogic.js) closes on. Season means, said
 * without the numbers the screen does not show elsewhere.
 */
const hintOf = (id) =>
  fill(W.hints[id], {
    clue: Math.round(ENDING_GATES.clueRate * 100),
    harm: ENDING_GATES.collapseHarmPerCase,
    bust: Math.round(ENDING_GATES.collapseBustRate * 100),
    overreach: ENDING_GATES.collapseOverreachHarm,
  });

/** The rulings by the short name the panel already uses (VERDICT_NAMES, seasonRecord.js), in the page's language. */
const verdictLabel = (verdict) => introPanels.verdicts[verdict];

const verdictWhen = (verdict) =>
  fill(W.verdictWhen, { path: W.paths[verdict], endings: VERDICT_ENDINGS[verdict].map((id) => ENDING_NAMES[id]).join(" · ") });

/**
 * The book's lines for a record's lists, or null before any season counted.
 * `endingsSeen` and `verdictsSeen` are the record's (normalizeSeasonRecord);
 * ids the book does not know are not counted.
 *
 * - `head`: the count, 「결말 3/9 · 판결 2/3.」, then the next season's aim:
 *   the first ending not yet seen a season can aim for (never the collapse),
 *   or, with every such ending seen, the first ruling not yet made. The panel
 *   shows it as the head of a fold.
 * - `hints`: one line per other ending and ruling not yet seen, in the fold.
 *
 * The panel prints both as they are: whatever is joined is joined here.
 * `lang` is the page's language they are in.
 */
export function getEndingBook({ seasons = 0, endingsSeen = [], verdictsSeen = [] } = {}) {
  if (!(seasons > 0)) return null;
  const missingEndings = BOOK_ENDINGS.filter((id) => !endingsSeen.includes(id));
  const missingVerdicts = BOOK_VERDICTS.filter((id) => !verdictsSeen.includes(id));
  const aim = missingEndings.find((id) => id !== "collapse");
  const count = fill(W.count, { endings: BOOK_ENDINGS.length - missingEndings.length, endingsTotal: BOOK_ENDINGS.length, verdicts: BOOK_VERDICTS.length - missingVerdicts.length, verdictsTotal: BOOK_VERDICTS.length });
  let next = "";
  if (aim) next = fill(W.aimEnding, { ending: ENDING_NAMES[aim], hint: hintOf(aim) });
  else if (missingVerdicts.length) next = fill(W.aimVerdict, { verdict: verdictLabel(missingVerdicts[0]), when: verdictWhen(missingVerdicts[0]) });
  return {
    head: count + next,
    // The language the lines were written in: the shell has them written again in another (advancedSystems.isStaleBook).
    lang: appliedLocale(),
    hints: [
      ...missingEndings.filter((id) => id !== aim).map((id) => `${ENDING_NAMES[id]}: ${hintOf(id)}`),
      ...missingVerdicts.filter((verdict) => aim || verdict !== missingVerdicts[0]).map((verdict) => fill(W.hintVerdict, { verdict: verdictLabel(verdict), when: verdictWhen(verdict) })),
    ],
  };
}
