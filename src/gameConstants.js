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
