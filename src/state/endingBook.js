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

/** Every ending the ruling resolves, in the order the book lists them. */
export const BOOK_ENDINGS = Object.freeze(Object.keys(ENDING_NAMES));

/** The three rulings the finale's 「그 칸을 닫는 방법」 can make. */
export const BOOK_VERDICTS = Object.freeze(Object.keys(VERDICT_ENDINGS));

const clues = `사건 기록의 ${Math.round(ENDING_GATES.clueRate * 100)}% 이상을`;

/**
 * One fact per ending: what the season it closes on held, read from the
 * gates `getEndingVariant` (gameLogic.js) closes on. Season means, said
 * without the numbers the screen does not show elsewhere.
 */
const ENDING_HINTS = Object.freeze({
  "open-oversight": `${clues} 열고 믿음과 공정함을 함께 높게 지킨 시즌이 닿습니다.`,
  "evidence-reform": `${clues} 열고 공정함을 높게 지킨 시즌이 닿습니다.`,
  "human-record": "모든 사건의 기록을 열고, 열 사건 가운데 일곱 번 이상 판을 다시 짜고, 믿음도 지킨 시즌이 닿습니다.",
  "profitable-silence": "현금은 끝까지 지켰지만 믿음이 크게 떨어진 시즌이 닿습니다.",
  "cold-justice": "공정함은 아주 높은데 믿음이 그만큼 따라오지 못한 시즌이 닿습니다.",
  "field-pact": "믿음이 공정함보다 크게 앞선 시즌이 닿습니다.",
  "quiet-cover": "기록을 절반도 열지 않았거나, 큰 위험 없이 사건을 닫아 온 시즌이 닿습니다. 피날레에서 모든 데이터를 태운 시즌도 닿습니다.",
  collapse: `사건마다 남긴 사람 피해가 평균 ${ENDING_GATES.collapseHarmPerCase} 이상이거나, 벽에 닿은 판이 전체의 ${Math.round(ENDING_GATES.collapseBustRate * 100)}% 이상인 채 피해가 평균 ${ENDING_GATES.collapseOverreachHarm} 이상이면 시즌이 무너집니다.`,
  "open-question": "어느 쪽으로도 크게 기울지 않은 시즌이 닿습니다.",
});

/** The rulings by the short name the panel already uses (VERDICT_NAMES, seasonRecord.js). */
const VERDICT_LABELS = Object.freeze({ ending_seal: "봉인", ending_reform: "개혁", ending_expose: "폭로" });

/** Each ruling's way, in the words of the finale scene's memo (f_choice, finalCase.js), with its particle. */
const VERDICT_PATHS = Object.freeze({ ending_seal: "봉인하는 길을", ending_reform: "규칙을 붙이는 길을", ending_expose: "밖으로 넘기는 길을" });

const verdictWhen = (verdict) =>
  `피날레 「그 칸을 닫는 방법」에서 ${VERDICT_PATHS[verdict]} 고르고, 결말이 ${VERDICT_ENDINGS[verdict].map((id) => ENDING_NAMES[id]).join(" · ")} 가운데 하나일 때 내려집니다.`;

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
 */
export function getEndingBook({ seasons = 0, endingsSeen = [], verdictsSeen = [] } = {}) {
  if (!(seasons > 0)) return null;
  const missingEndings = BOOK_ENDINGS.filter((id) => !endingsSeen.includes(id));
  const missingVerdicts = BOOK_VERDICTS.filter((id) => !verdictsSeen.includes(id));
  const aim = missingEndings.find((id) => id !== "collapse");
  const count = `결말 ${BOOK_ENDINGS.length - missingEndings.length}/${BOOK_ENDINGS.length} · 판결 ${BOOK_VERDICTS.length - missingVerdicts.length}/${BOOK_VERDICTS.length}.`;
  let next = "";
  if (aim) next = ` 다음 시즌에 노려 볼 결말은 ${ENDING_NAMES[aim]}입니다. ${ENDING_HINTS[aim]}`;
  else if (missingVerdicts.length) next = ` 다음 시즌에 노려 볼 판결은 ${VERDICT_LABELS[missingVerdicts[0]]}입니다. ${verdictWhen(missingVerdicts[0])}`;
  return {
    head: count + next,
    hints: [
      ...missingEndings.filter((id) => id !== aim).map((id) => `${ENDING_NAMES[id]}: ${ENDING_HINTS[id]}`),
      ...missingVerdicts.filter((verdict) => aim || verdict !== missingVerdicts[0]).map((verdict) => `판결 ${VERDICT_LABELS[verdict]}: ${verdictWhen(verdict)}`),
    ],
  };
}
