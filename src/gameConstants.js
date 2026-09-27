export const initialResources = {
  time: 72,
  capital: 100,
  trust: 50,
  legitimacy: 50,
  humanCost: 0,
  fatigue: 10,
};

/**
 * The two resources where a rising number is the loss. Colour, arrows and the
 * balance guardrail all read direction from here rather than from the sign.
 */
export const costWhenRising = new Set(["humanCost", "fatigue"]);

/**
 * Every surface that summarises an effect has to answer the same question:
 * was this good for the player? Reading the sign gets it backwards on the two
 * resources above, so the four places that print an effect -- the choice chips,
 * the trade-off line above them, the reveal's opened/closed columns and the
 * result ledger -- all ask here instead of comparing to zero themselves.
 */
export function isResourceGain(key, value) {
  return costWhenRising.has(key) ? value < 0 : value > 0;
}

/**
 * Effect objects are written in whatever order the author typed them, so the
 * first entry is not the one worth naming. Sorting by size lets a sentence name
 * the resource that actually moved.
 */
export function byEffectWeight([, a], [, b]) {
  return Math.abs(b) - Math.abs(a);
}

export const triggerLabels = {
  protection: "보호",
  injustice: "부당함",
  // The grudge. 사건 08 runs on it the way 사건 09 runs on affection: the season's
  // claim is that both wake the same obsessive thinking and aim it differently.
  revenge: "복수",
  responsibility: "책임",
  competition: "경쟁",
  reward: "보상",
  curiosity: "호기심",
  order: "질서",
  trust: "신뢰",
  affection: "애정",
  recognition: "인정",
  fear: "공포",
  system: "시스템",
  helplessness: "무력감",
  selfAwareness: "자기 인식",
  manipulation: "조종",
  choice: "선택",
};

export const cognitionLabels = {
  persistence: "끝까지 버티기",
  inference: "꼼꼼히 확인하기",
  reframing: "판 바꾸기",
  risk: "위험 다루기",
};

/**
 * The closing ruling's gates, read by `getEndingVariant` and by every surface
 * that tells a player what would have changed it -- the failure objectives quote
 * these numbers rather than their own. Each is placed against the season as
 * `npm run report:endings` replays it (55 cases, about 490 windows), and the
 * comment says where.
 */
export const ENDING_GATES = Object.freeze({
  // Collapse is harm: the mean human cost a case closed on. Season p50 is about
  // 6; a player who spends people for position closes near 25, one who puts
  // people first at 0.
  collapseHarmPerCase: 20,
  // Or overreach that people paid for: this share of windows busted (about the
  // season's p85) while the cases still closed on half that harm.
  collapseBustRate: 0.2,
  collapseOverreachHarm: 10,
  // The record endings ask for nine in ten of the cases' records, or eight in
  // ten with slack earned at the table. The season's p10 is about 0.93, so the
  // bar bites on a run that let whole cases go by unread.
  clueRate: 0.9,
  clueRateWithSlack: 0.8,
  // Under half the records, the truth is still asleep (QUIET COVER), as it is
  // in a season whose cases typically peaked under 12 (season p25 about 13).
  quietClueRate: 0.5,
  quietSustainedPressure: 12,
  // HUMAN RECORD: a reframed route in seven cases of ten (season p75 about 0.75).
  humanRecordReframeRate: 0.7,
  // Standing, on the season's mean closing values. Season p50s: trust 77,
  // legitimacy 78, capital 93; legitimacy stays above 95 only for a run that
  // chases procedure, capital at 100 only for one that chases money.
  oversightTrust: 85,
  oversightLegitimacy: 82,
  reformLegitimacy: 86,
  recordTrust: 75,
  silenceCapital: 97,
  silenceTrust: 45,
  coldLegitimacy: 88,
  // Legitimacy this far ahead of trust is procedure that left its people behind;
  // trust this far ahead of legitimacy is a pact made outside the procedure.
  coldGap: 12,
  pactGap: 15,
  // Slack at the table buys the lower record bar. A season that never busted
  // and cashed at x16 (heat 44 at `DOUBLING_HEAT` 11 -- two pushes from the
  // lowest wall a fresh board draws), a combo of 12 (a random press lands about
  // a third of the beats), or a vault of 19,500 a case: between the best blind
  // (about 15.4k) and best heartbeat (about 24.6k) policies `check:pressure`
  // measures at nine windows a case. It was 16,000 when that was measured at 7.
  heldLineMultiplier: 16,
  beatSlackCombo: 12,
  vaultSlackPerCase: 19500,
});
