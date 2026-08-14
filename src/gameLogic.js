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

export function explainResourceTradeoff(effect = {}) {
  const entries = Object.entries(effect).filter(([, value]) => value !== 0);
  if (entries.length === 0) return "숫자는 거의 움직이지 않았지만, 이 선택은 판단의 기준을 남겼습니다.";

  const gains = entries.filter(([, value]) => value > 0).sort((a, b) => b[1] - a[1]);
  const losses = entries.filter(([, value]) => value < 0).sort((a, b) => a[1] - b[1]);
  const labels = {
    time: "시간",
    capital: "현금",
    trust: "신뢰",
    legitimacy: "정당성",
    humanCost: "사람에게 옮겨간 비용",
    fatigue: "피로",
  };
  const format = ([key, value]) => `${labels[key] ?? key} ${value > 0 ? "+" : ""}${value}`;
  const gainText = gains.length > 0 ? gains.slice(0, 2).map(format).join(", ") : "즉시 얻은 것은 적고";
  const lossText = losses.length > 0 ? losses.slice(0, 2).map(format).join(", ") : "눈에 보이는 손실은 작습니다";

  if (gains.length > 0 && losses.length > 0) {
    return `${gainText}을 얻는 대신 ${lossText}을 감수했습니다.`;
  }
  if (gains.length > 0) return `${gainText}이 올라갔지만, 그 이득이 다음 장면의 압박으로 남습니다.`;
  return `${lossText}이 줄었습니다. 선택의 명분은 남았지만 여력이 깎였습니다.`;
}

function getSubjectParticle(name = "상대") {
  const lastChar = name.at(-1);
  if (!lastChar) return "가";
  const code = lastChar.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return "가";
  return (code - 0xac00) % 28 === 0 ? "가" : "이";
}

function speechifyChoice(choice) {
  const label = choice.label ?? "그 판단을 밀고 가겠습니다";
  const endings = [
    ["제안한다", "제안하겠습니다."],
    ["선택한다", "선택하겠습니다."],
    ["검토한다", "검토하겠습니다."],
    ["집중한다", "집중하겠습니다."],
    ["요청한다", "요청하겠습니다."],
    ["공식화한다", "공식화하겠습니다."],
    ["공개한다", "공개하겠습니다."],
    ["조사한다", "조사하겠습니다."],
    ["전환한다", "전환하겠습니다."],
    ["발표한다", "발표하겠습니다."],
    ["추적한다", "추적하겠습니다."],
    ["준비한다", "준비하겠습니다."],
    ["요구한다", "요구하겠습니다."],
    ["설계한다", "설계하겠습니다."],
    ["봉인한다", "봉인하겠습니다."],
    ["폭로한다", "폭로하겠습니다."],
    ["알린다", "알리겠습니다."],
    ["미룬다", "미루겠습니다."],
    ["올린다", "올리겠습니다."],
    ["넘긴다", "넘기겠습니다."],
    ["높인다", "높이겠습니다."],
    ["찾는다", "찾겠습니다."],
    ["묻는다", "묻겠습니다."],
    ["바꾼다", "바꾸겠습니다."],
    ["묶는다", "묶겠습니다."],
    ["연다", "열겠습니다."],
    ["둔다", "두겠습니다."],
  ];
  const matchedEnding = endings.find(([ending]) => label.endsWith(ending));
  if (matchedEnding) return `${label.slice(0, -matchedEnding[0].length)}${matchedEnding[1]}`;
  if (label.endsWith("한다")) return `${label.slice(0, -2)}하겠습니다.`;
  return `${label}. 이 방향으로 가겠습니다.`;
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
    : `"${speechifyChoice(choice)}"`;
  const deltaLine = describeDelta(getStrongestDelta(effect));
  const speakerName = node?.speaker ?? "상대";

  return [
    `${profile.appearance} ${profile.gesture}`,
    `'${profile.thought}'`,
    `당신은 준비된 대응안의 이름 대신, 결론만 남겨 이렇게 말한다. ${said}`,
    `${speakerName}${getSubjectParticle(speakerName)} 시선을 든다. ${profile.voice}`,
    `"${profile.line}"`,
    deltaLine,
  ].join("\n");
}

export function scoreFreeText(value) {
  const text = value.trim();
  if (!text) return { effect: {}, cognition: {}, note: "" };
  const signals = getFreeTextSignals(text);
  const hasStakeholder = signals.some((signal) => signal.id === "stakeholder" && signal.active);
  const hasTradeoff = signals.some((signal) => signal.id === "tradeoff" && signal.active);
  const hasInfo = signals.some((signal) => signal.id === "info" && signal.active);
  const hasRisk = signals.some((signal) => signal.id === "risk" && signal.active);
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

export function getFreeTextSignals(value) {
  const text = value.trim();
  return [
    {
      id: "stakeholder",
      label: "이해관계자",
      active: /(직원|협력사|투자자|경쟁사|고객|CFO|임원|피해자|기자|보안팀|현장)/i.test(text),
      hint: "누가 영향을 받는지",
    },
    {
      id: "tradeoff",
      label: "교환 조건",
      active: /(대신|하지만|조건|분할|우선|동시에|단계|교환|협상|묶어|연기|승계)/i.test(text),
      hint: "무엇을 얻고 잃는지",
    },
    {
      id: "info",
      label: "근거 확인",
      active: /(확인|조사|자료|공시|계약|근거|회의록|숫자|로그|원본|검증)/i.test(text),
      hint: "무엇을 더 확인할지",
    },
    {
      id: "risk",
      label: "위험 명시",
      active: /(위험|손실|비용|실패|법적|평판|시간|유출|무고|중단|이탈)/i.test(text),
      hint: "실패하면 어디가 무너지는지",
    },
  ];
}

export function makeEmptyScores(labels) {
  return Object.fromEntries(Object.keys(labels).map((key) => [key, 0]));
}
