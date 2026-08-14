import { characterProfiles, choiceSubtexts, choiceVoiceLines, echoReplies } from "./gameData.js";

export const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value));

export function applyEffect(resources, effect = {}) {
  const next = { ...resources };
  Object.entries(effect).forEach(([key, value]) => {
    const max = key === "time" ? 72 : 100;
    next[key] = clamp((next[key] ?? 0) + value, 0, max);
  });
  return next;
}

export function getEcho(choiceId, freeText) {
  if (freeText) {
    const text = freeText.toLowerCase();
    if (text.includes("협상") || text.includes("분할") || text.includes("조건")) {
      return "조건을 나누는 방식은 유효합니다. 다만 각 이해관계자가 왜 그 조건을 받아들여야 하는지까지 설계해야 합니다.";
    }
    if (text.includes("직원") || text.includes("급여") || text.includes("보호")) {
      return "보호 대상을 명확히 본 점은 좋습니다. 같은 기준을 협력사 직원에게도 적용하면 비용은 어디로 이동합니까?";
    }
    if (text.includes("공개") || text.includes("책임") || text.includes("회계")) {
      return "책임을 전면에 세우면 정당성은 올라갑니다. 그러나 당장 회사가 무너지면 책임 규명의 실익도 줄어들 수 있습니다.";
    }
    return "선택지 밖의 제안은 판을 넓힙니다. 이제 그 방법의 비용, 반대자, 실패 조건을 구체화해야 합니다.";
  }
  return echoReplies[choiceId] ?? echoReplies.default;
}

export function getDramaticChoiceLabel(choice) {
  if (choice.type === "free") return choice.label;
  return choiceVoiceLines[choice.id] ?? choice.label;
}

export function getChoiceSubtext(choice) {
  const strongestCognition = Object.entries(choice.cognition ?? {}).sort((a, b) => b[1] - a[1])[0]?.[0];
  return choiceSubtexts[strongestCognition] ?? choiceSubtexts.default;
}

function getStrongestDelta(effect = {}) {
  return Object.entries(effect).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))[0] ?? null;
}

function describeDelta(delta) {
  if (!delta) return "상황판의 숫자는 크게 움직이지 않지만, 회의실의 침묵은 조금 길어진다.";
  const [key, value] = delta;
  const labels = {
    time: "남은 시간",
    capital: "현금 여력",
    trust: "신뢰",
    legitimacy: "정당성",
    humanCost: "사람에게 옮겨간 비용",
    fatigue: "피로",
  };
  const label = labels[key] ?? key;
  if (value > 0) return `${label}이 올라간다. 하지만 그 숫자가 공짜로 생긴 것은 아니다.`;
  return `${label}이 줄어든다. 누군가는 그 감소분을 자기 몫으로 떠안게 된다.`;
}

export function buildSceneBeat(node, choice, freeText, effect = {}) {
  const profile = characterProfiles[node?.speaker] ?? {
    appearance: "정돈되지 않은 자료 더미 앞에 사건 관계자가 앉아 있다.",
    thought: "이 선택은 아직 끝나지 않았다.",
    gesture: "상대는 잠시 말을 고른다.",
    voice: "상황을 확인하는 말투로 반응한다.",
    line: "그 판단을 계속 밀고 갈 수 있습니까?",
  };
  const said = choice.type === "free"
    ? `"${freeText.trim()}"`
    : `"${getDramaticChoiceLabel(choice)}"`;
  const deltaLine = describeDelta(getStrongestDelta(effect));

  return [
    `${profile.appearance} ${profile.gesture}`,
    `'${profile.thought}'`,
    `당신은 준비된 대응안의 이름 대신 이렇게 말한다. ${said}`,
    `${node?.speaker ?? "상대"}가 시선을 든다. ${profile.voice}`,
    `"${profile.line}"`,
    deltaLine,
  ].join("\n");
}

export function scoreFreeText(value) {
  const text = value.trim();
  if (!text) return { effect: {}, cognition: {}, note: "" };
  const hasStakeholder = /(직원|협력사|투자자|경쟁사|고객|CFO|임원)/i.test(text);
  const hasTradeoff = /(대신|하지만|조건|분할|우선|동시에|단계|교환|협상)/i.test(text);
  const hasInfo = /(확인|조사|자료|공시|계약|근거|회의록|숫자)/i.test(text);
  const hasRisk = /(위험|손실|비용|실패|법적|평판|시간)/i.test(text);
  const depth = Math.min(3, Math.floor(text.length / 45));

  return {
    effect: {
      time: hasInfo ? -4 : -2,
      trust: hasStakeholder ? 4 : 1,
      legitimacy: hasRisk ? 4 : 1,
      capital: hasTradeoff ? 5 : 0,
      fatigue: 5,
    },
    cognition: {
      reframing: 1 + (hasTradeoff ? 2 : 0),
      inference: (hasInfo ? 2 : 0) + (hasStakeholder ? 1 : 0),
      risk: hasRisk ? 2 : 0,
      persistence: depth,
    },
    note:
      "자유입력은 새로운 이해관계자, 조건 재구성, 추가 정보 요청, 위험 명시 여부를 기준으로 반영했습니다.",
  };
}

export function makeEmptyScores(labels) {
  return Object.fromEntries(Object.keys(labels).map((key) => [key, 0]));
}
