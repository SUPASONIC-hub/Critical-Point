export const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value));

export function applyEffect(resources, effect = {}) {
  const next = { ...resources };
  Object.entries(effect).forEach(([key, value]) => {
    const max = key === "time" ? 72 : 100;
    next[key] = clamp((next[key] ?? 0) + value, 0, max);
  });
  return next;
}

function hashSeed(seed = "") {
  let hash = 2166136261;
  for (const character of String(seed)) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function applySeededEffectVariation(effect = {}, seed = "", variation = 0.15) {
  const safeVariation = Math.min(1, Math.max(0, Number(variation) || 0));
  if (!seed || safeVariation === 0) return { ...effect };
  let state = hashSeed(seed) || 1;
  const nextRandom = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };

  return Object.fromEntries(
    Object.entries(effect).map(([key, value]) => {
      const numericValue = Number(value);
      if (!Number.isFinite(numericValue) || numericValue === 0) return [key, value];
      const multiplier = 1 - safeVariation + nextRandom() * safeVariation * 2;
      const variedValue = Math.round(numericValue * multiplier);
      return [key, variedValue === 0 ? Math.sign(numericValue) : variedValue];
    }),
  );
}

const riskDefaults = {
  time: 72,
  capital: 100,
  humanCost: 0,
  fatigue: 0,
};

export function getRiskPressure(resources = {}) {
  const nextResources = { ...riskDefaults, ...resources };
  return Math.round(
    Math.max(0, 72 - nextResources.time) * 0.3 +
      (100 - nextResources.capital) * 0.25 +
      nextResources.humanCost * 0.25 +
      nextResources.fatigue * 0.2,
  );
}

export function getRiskPressureDrivers(resources = {}) {
  const nextResources = { ...riskDefaults, ...resources };
  const drivers = [
    {
      id: "time",
      label: "시간 부족",
      value: Math.max(0, 72 - nextResources.time),
      pressure: Math.max(0, 72 - nextResources.time) * 0.3,
    },
    {
      id: "capital",
      label: "현금 압박",
      value: Math.max(0, 100 - nextResources.capital),
      pressure: Math.max(0, 100 - nextResources.capital) * 0.25,
    },
    {
      id: "humanCost",
      label: "인적 비용",
      value: nextResources.humanCost,
      pressure: nextResources.humanCost * 0.25,
    },
    {
      id: "fatigue",
      label: "판단 피로",
      value: nextResources.fatigue,
      pressure: nextResources.fatigue * 0.2,
    },
  ];

  return drivers
    .map((driver) => ({ ...driver, pressure: Math.round(driver.pressure) }))
    .sort((a, b) => b.pressure - a.pressure);
}

export function getSuspenseState({ riskPressure = 0, decisionSeconds = 45, log = [], currentCase = "case01" } = {}) {
  const urgency = Math.round(clamp((45 - decisionSeconds) * 0.7, 0, 32));
  const accumulated = Math.min(20, log.length * 4);
  const score = clamp(Math.round(riskPressure + urgency + accumulated), 0, 100);
  const tier = score >= 78 ? "REDLINE" : score >= 52 ? "UNSTABLE" : score >= 28 ? "WATCH" : "QUIET";
  const signals = {
    QUIET: {
      label: "SIGNAL QUIET",
      title: "아직 아무도 먼저 움직이지 않았습니다.",
      text: "조용한 장면은 안전한 장면이 아닙니다. 누군가는 이미 다음 기록을 열고 있습니다.",
      cue: "마지막으로 확인할 수 있는 전제",
    },
    WATCH: {
      label: "SIGNAL WATCH",
      title: "방 안의 숫자와 방 밖의 움직임이 어긋납니다.",
      text: "당신이 고르는 순간, 공개되지 않은 이해관계자가 다음 장면의 조건을 바꿀 수 있습니다.",
      cue: "누가 아직 말하지 않았는가",
    },
    UNSTABLE: {
      label: "SIGNAL UNSTABLE",
      title: "사건이 당신의 결정을 기다리지 않고 진행됩니다.",
      text: "한 번의 선택이 비용을 옮기는 동시에, 누군가에게 당신의 기준을 알려줍니다.",
      cue: "기록되는 것은 결과가 아니라 허용선",
    },
    REDLINE: {
      label: "SIGNAL REDLINE",
      title: "숨겨진 프로토콜이 깨어났습니다.",
      text: "이제 선택은 사건을 해결하는 명령이 아니라, 당신을 시험하는 신호로 읽힙니다.",
      cue: "다음 화면을 믿기 전에 기록을 의심할 것",
    },
  }[tier];
  const caseCode = currentCase === "final" ? "F" : currentCase.replace("case", "");
  return { score, tier, caseCode, ...signals };
}

export function getSuspenseEvent({ riskBefore = 0, riskAfter = 0, currentCase = "case01", logLength = 0 } = {}) {
  if (riskBefore < 70 && riskAfter >= 70) {
    return {
      id: "protocol-awake",
      label: "HIDDEN PROTOCOL",
      title: "당신이 임계선을 넘긴 순간, 다른 화면이 켜졌습니다.",
      text: "트리거랩은 이제 사건의 결과보다 당신이 어디까지 감수하는지를 측정합니다.",
      tone: "redline",
    };
  }
  if (riskBefore < 50 && riskAfter >= 50) {
    return {
      id: "observer-awake",
      label: "OBSERVER ONLINE",
      title: "누군가 당신의 판단을 실시간으로 읽기 시작했습니다.",
      text: "다음 장면부터는 선택지의 비용뿐 아니라, 당신이 비용을 부르는 방식까지 기록됩니다.",
      tone: "unstable",
    };
  }
  if (logLength >= 3 && riskAfter >= 42 && currentCase !== "case01") {
    return {
      id: "pattern-lock",
      label: "PATTERN LOCK",
      title: "당신의 반복 패턴이 사건의 다음 조건으로 고정됐습니다.",
      text: "방금 선택은 새 사건을 연 것이 아니라, 이미 관찰된 당신의 반응을 다시 호출했습니다.",
      tone: "watch",
    };
  }
  return null;
}
