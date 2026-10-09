import { buildLeaderboard } from "./ranking.js";

/**
 * The result card as data: every string and number the season's card shows,
 * and the line that is copied next to it. Nothing here touches the page, so
 * the tests can read the whole card without a canvas.
 *
 * The card is public the moment it is saved, so it is built from four things
 * only -- the 판단 DNA, the ending, the case summaries and the site's host --
 * and nothing that says who played. `buildResultCardModel` reads the fields it
 * lists and no others, whatever else the object it is handed carries.
 */

/** The words the card prints that are the same for every season. */
export const RESULT_CARD_LABELS = Object.freeze({
  game: "TRIGGERLAB: CRITICAL POINT",
  season: "SEASON 01 · FINAL RECORD",
  dna: "판단 DNA",
  ending: "결말",
  burst: "최고 버스트",
  rank: "랭크",
  league: "리그",
  points: "점",
  story: "스토리 모드",
  byline: "익명 분석관의 기록",
});

// What a card with a piece missing prints in its place. A season that reached
// its ending has all of them; these keep an older save drawable.
const UNREAD_MODE_TITLE = "기록되지 않은 판단";
const UNREAD_ENDING_NAME = "미확정 경로";

const RANK_WEIGHT = { S: 4, A: 3, B: 2, C: 1 };

const toText = (value, fallback = "") => (typeof value === "string" && value.trim() ? value.trim() : fallback);
const toCount = (value) => (Number.isFinite(Number(value)) && Number(value) > 0 ? Number(value) : 0);
const toRank = (value) => (typeof value === "string" && Object.hasOwn(RANK_WEIGHT, value) ? value : "C");
const toBurst = (summary) => Math.min(100, Math.round(toCount(summary?.burstScore ?? summary?.momentumScore)));

/**
 * The season's best table: the highest burst score any case closed on, with
 * the rank that case was given. Two cases on the same score show the better
 * rank. A season with no closed case reads 0 and C, as a stored summary with
 * those fields missing does everywhere else.
 */
function readBestCase(summaries) {
  return summaries.reduce(
    (best, summary) => {
      const burst = toBurst(summary);
      const rank = toRank(summary?.rank);
      const better = burst > best.burst || (burst === best.burst && RANK_WEIGHT[rank] > RANK_WEIGHT[best.rank]);
      return better ? { burst, rank } : best;
    },
    { burst: 0, rank: "C" },
  );
}

/**
 * The league the ranking's season row is filed under, asked of the ranking
 * itself so the card and the table cannot disagree. Only the three numbers the
 * ranking reads a style from are handed over. The row's own score is given as
 * 0 because the ranking drops a row whose score it cannot read, and the league
 * does not depend on it.
 */
function readSeasonLeague(finalSummary) {
  const summary = {
    reframeCount: toCount(finalSummary?.reframeCount),
    reflectionScore: toCount(finalSummary?.reflectionScore),
    pressureAdaptScore: toCount(finalSummary?.pressureAdaptScore),
  };
  return buildLeaderboard([{ local: true, case_id: "season-final", score: 0, summary }], 1)[0]?.league ?? "";
}

/**
 * @param {object} [input]
 * @param {{ mode?: string, modeTitle?: string, motive?: { label?: string } }} [input.fingerprint] The 판단 DNA.
 * @param {{ label?: string, title?: string, failure?: boolean }} [input.endingVariant] The ending the season reached.
 * @param {string} [input.endingName] The ending as a sentence calls it, in Korean.
 * @param {Record<string, any>} [input.caseResults] The season's case summaries, by case id.
 * @param {string} [input.host] The site's host, printed at the foot of the card.
 */
export function buildResultCardModel(input = {}) {
  const { fingerprint, endingVariant, endingName, caseResults, host } = input ?? {};
  const results = caseResults && typeof caseResults === "object" ? caseResults : {};
  const summaries = Object.values(results).filter((summary) => summary && typeof summary === "object");
  const best = readBestCase(summaries);
  return {
    modeTitle: toText(fingerprint?.modeTitle, UNREAD_MODE_TITLE),
    mode: toText(fingerprint?.mode),
    motiveLabel: toText(fingerprint?.motive?.label),
    endingName: toText(endingName, UNREAD_ENDING_NAME),
    endingLabel: toText(endingVariant?.label),
    endingTitle: toText(endingVariant?.title),
    // The one ending that is a failure is drawn in the wall's colour.
    failure: endingVariant?.failure === true,
    bestBurst: best.burst,
    bestRank: best.rank,
    league: readSeasonLeague(Array.isArray(results) ? null : results.final),
    // A season with any case played in story mode says so on the card.
    story: summaries.some((summary) => Boolean(summary.assistStory)),
    host: toText(host),
  };
}

/**
 * The line copied with the card. `origin` is the site's address; without one
 * the line ends at the rank.
 */
export function buildShareText(model, origin = "") {
  const card = model ?? buildResultCardModel();
  const address = toText(origin).replace(/\/+$/, "");
  const line =
    `트리거랩에서 한 시즌을 끝냈습니다. 판단 DNA는 '${card.modeTitle}', 결말은 '${card.endingName}'. ` +
    `최고 버스트 ${card.bestBurst}${RESULT_CARD_LABELS.points}, ${card.bestRank} 랭크.`;
  return address ? `${line} ${address}/` : line;
}

/**
 * Text cut into lines no wider than `maxWidth`, the way `word-break: keep-all`
 * lays Korean out: a line ends at a space, and a word is only cut -- between
 * syllables -- when it is wider than a whole line on its own. `measure` gives a
 * string's width, so the canvas supplies it when drawing and a test supplies
 * its own.
 */
export function wrapLines(measure, text, maxWidth) {
  const lines = [];
  let line = "";
  for (const word of String(text ?? "").split(/\s+/).filter(Boolean)) {
    const joined = line ? `${line} ${word}` : word;
    if (measure(joined) <= maxWidth) {
      line = joined;
      continue;
    }
    if (line) lines.push(line);
    line = "";
    if (measure(word) <= maxWidth) {
      line = word;
      continue;
    }
    for (const syllable of word) {
      if (line && measure(line + syllable) > maxWidth) {
        lines.push(line);
        line = syllable;
      } else {
        line += syllable;
      }
    }
  }
  if (line) lines.push(line);
  return lines;
}
