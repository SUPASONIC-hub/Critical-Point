export function getCharacterState(speaker = "", log = []) {
  const entries = log.filter((entry) => entry?.speaker === speaker && !entry.isSystemEvent);
  const pressure = Math.min(100, entries.length * 14 + entries.filter((entry) => Object.values(entry.effect ?? {}).some((value) => value < 0)).length * 9);
  const trust = Math.max(0, Math.min(100, 50 + entries.reduce((total, entry) => total + Number(entry.effect?.trust ?? 0), 0) * 3));
  return { speaker, pressure, trust, stance: pressure >= 60 ? "DEFENSIVE" : trust >= 65 ? "OPENING" : "WATCHING" };
}

export function getRivalResponse(caseId = "case01", log = [], resources = {}) {
  const pressure = Number(resources.fatigue ?? 0) + Math.max(0, 50 - Number(resources.trust ?? 50));
  const response = pressure >= 45
    ? "RIVAL MOVE: 상대가 피로와 불신을 이용해 기록 공개 순서를 선점합니다."
    : log.length >= 3
      ? "RIVAL MOVE: 상대가 다음 선택의 비용을 먼저 공개해 판단을 흔듭니다."
      : "RIVAL MOVE: 상대는 아직 관찰 단계에 머물며 다음 증거를 기다립니다.";
  return { caseId, pressure, response };
}
