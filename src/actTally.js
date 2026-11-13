import { formatNumber } from "./gameConstants.js";
import { ACT_TALLY_CASES } from "./gauntlet/actCardCopy.js";
import { caseDisplayCode } from "./gameCases.js";
import { getEndingVariant, getSeasonLogic, getSeasonStrain } from "./gameLogic.js";
import { getJudgementHabit, habitCardLine } from "./judgementHabit.js";
import { nearestEnding } from "./nearestEnding.js";
import { easyResourceLabels, subjectParticle } from "./playerLanguage.js";
import { buildResultCardModel } from "./resultCardModel.js";
import { readClosedCases } from "./seasonStanding.js";
import actTallyCopy from "./copy/actTally.js";
import reportLinesCopy from "./copy/reportLines.js";
import seasonEndCopy from "./copy/seasonEnd.js";
import { fill } from "./locale.js";

/**
 * N1 막 끝 중간 결산 (owner's answer Q2 (1), 2026-11-12): at the end of 프롤로그,
 * 사건 18 and 사건 36 -- the act cards of 사건 01, 19 and 37 -- the season so
 * far on one card: 지금까지의 판단 유형, 가장 큰 판돈 and 가까운 결말, with the
 * finale's share path (ResultCardShare.jsx, resultCard.js).
 *
 * Display only. It reads the case summaries the season has already stored,
 * through the same functions the finale reads them with -- the 판단 습관
 * (judgementHabit.js), the ruling (`getEndingVariant` over `getSeasonStrain`)
 * and the nearest other ending (nearestEnding.js) -- and writes nothing: no
 * rule, score, ending or ranking moves. Like the finale's card it prints
 * nothing that says who played.
 */

/** The act cards that carry the tally (actCardCopy.js). */
export { ACT_TALLY_CASES };

const toCount = (value) => (Number.isFinite(Number(value)) && Number(value) > 0 ? Number(value) : 0);

/** 「사건 12」 or 「프롤로그 3」, as a row of the card names a case. */
export function tallyCaseLabel(caseId) {
  const code = caseDisplayCode(caseId);
  return /^P\d+$/.test(code) ? fill(actTallyCopy.prologueNo, { n: code.slice(1) }) : fill(actTallyCopy.caseNo, { code });
}

/**
 * The season's largest pot, case by case: what one case put in the vault or
 * lost at the wall (its table record, `pushRecord`). The kept one wins a tie;
 * an earlier case wins a tie of the same kind. Null when no case moved a pot.
 */
export function readLargestStake(caseResults = {}) {
  let best = null;
  for (const [caseId, summary] of readClosedCases(caseResults)) {
    if (!summary || typeof summary !== "object" || caseId === "final") continue;
    const kept = toCount(summary.pushRecord?.potBanked);
    const lost = toCount(summary.pushRecord?.potLost);
    const pot = Math.max(kept, lost);
    if (pot > 0 && (!best || pot > best.pot)) best = { caseId, pot, kept: kept >= lost };
  }
  return best;
}

/** The nearest other ending as one line, in the report's own words for each gap. */
export function describeNearLine(nearest) {
  if (!nearest?.gaps?.length) return "";
  const { trust, legitimacy } = easyResourceLabels;
  const words = reportLinesCopy.nearest.gaps;
  const gaps = nearest.gaps.map(({ key, value }) => Object.hasOwn(words, key) && fill(words[key], {
    value,
    label: easyResourceLabels[key === "trustOver" ? "trust" : key] ?? "",
    trust,
    legitimacy,
    particle: subjectParticle(key === "pactGap" ? trust : legitimacy),
  })).filter(Boolean);
  return fill(actTallyCopy.nearLine, { ending: nearest.label, gaps: gaps.join(" · ") });
}

/**
 * The tally as data, or null for an act card that carries none or a season
 * with no closed case. `season` is the stored run: its case summaries, the
 * clues found, the log and the standing.
 *
 * @param {string} caseId The case the act card opens.
 * @param {{ caseResults?: object, discoveredClues?: any[], log?: any[], resources?: object }} [season]
 */
export function buildActTallyModel(caseId, season = {}) {
  if (!ACT_TALLY_CASES.includes(caseId)) return null;
  const caseResults = season?.caseResults && typeof season.caseResults === "object" ? season.caseResults : {};
  if (!readClosedCases(caseResults).length) return null;
  const input = {
    resources: season?.resources ?? {},
    discoveredClues: Array.isArray(season?.discoveredClues) ? season.discoveredClues : [],
    log: Array.isArray(season?.log) ? season.log : [],
    ...getSeasonStrain(caseResults),
  };
  const ending = getEndingVariant(input);
  const nearest = nearestEnding({ ...input, endingId: ending.id });
  const habit = getJudgementHabit(caseResults);
  const stake = readLargestStake(caseResults);
  const end = actTallyCopy.ends[caseId];
  return {
    caseId,
    end,
    heading: fill(actTallyCopy.heading, { end }),
    habitTitle: habit?.title ?? actTallyCopy.habitPending,
    habitLine: habit?.line ?? "",
    habitCard: habit ? habitCardLine(habit) : "",
    stakeLine: stake
      ? fill(stake.kept ? actTallyCopy.stakeKept : actTallyCopy.stakeLost, { pot: formatNumber(stake.pot), where: tallyCaseLabel(stake.caseId) })
      : actTallyCopy.stakeNone,
    stakePot: stake?.pot ?? 0,
    endingId: ending.id,
    endingName: seasonEndCopy.names[ending.id] ?? ending.label,
    endingLabel: ending.label,
    failure: ending.failure === true,
    nearLine: nearest?.burn ? "" : describeNearLine(nearest),
    logicHold: getSeasonLogic(caseResults).logicHold,
    caseResults,
  };
}

/** The line copied with the picture, ending at the site's address when there is one. */
export function buildActTallyShareText(model, origin = "") {
  if (!model) return "";
  const address = String(origin ?? "").trim().replace(/\/+$/, "");
  const line = fill(actTallyCopy.shareLine, { end: model.end, habit: model.habitTitle, ending: model.endingName });
  return [line, address && `${address}/`].filter(Boolean).join(" ");
}

/**
 * The tally as the finale's picture draws it (resultCard.js `drawResultCard`):
 * the habit in the large line, 가까운 결말 where the ending is, the nearest
 * other ending as its line, and the largest pot beside the 논리 유지력. The
 * three cells are the season's best table so far, as the finale's are.
 */
export function toResultCardModel(model, host = "") {
  const card = buildResultCardModel({
    fingerprint: { modeTitle: model.habitTitle, habit: model.habitCard ? { title: model.habitTitle, card: model.habitCard } : null },
    endingVariant: { label: model.endingLabel, title: model.nearLine, failure: model.failure },
    endingName: model.endingName,
    caseResults: model.caseResults,
    logicHold: model.logicHold,
    host,
    season: actTallyCopy.corners[model.caseId],
    vaultLine: model.stakePot > 0 ? fill(actTallyCopy.stakeShort, { pot: formatNumber(model.stakePot) }) : "",
  });
  return { ...card, endingHeading: actTallyCopy.ending };
}
