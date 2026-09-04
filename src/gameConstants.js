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
