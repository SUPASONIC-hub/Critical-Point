import { costWhenRising } from "../gameData.js";

export function isChoiceEffectGain(key, value) {
  return costWhenRising.has(key) ? value < 0 : value > 0;
}

export function formatChoiceEffectChip([key, value], resourceMeta) {
  const steps = Math.abs(value) >= 8 ? 3 : Math.abs(value) >= 4 ? 2 : 1;
  const mark = (isChoiceEffectGain(key, value) ? "▲" : "▼").repeat(steps);
  return `${resourceMeta[key]?.label ?? key} ${value > 0 ? "상승" : "소모"} ${mark}`;
}

export function getChoiceAuthorityImpact(choice) {
  const choiceText = `${choice.id} ${choice.label}`;
  if (/protect|people|witness|person|사람|보호|증언/.test(choiceText)) {
    return "권한 영향: 보호 절차를 열고 현장의 발언권을 넓힙니다.";
  }
  if (/expose|public|report|disclosure|공개|폭로|보고/.test(choiceText)) {
    return "권한 영향: 기록 공개 범위를 넓히지만 조직의 반발을 부릅니다.";
  }
  if (/isolate|stop|seal|destroy|차단|중단|폐기|잠금/.test(choiceText)) {
    return "권한 영향: 접근을 줄여 피해를 막지만 확인되지 않은 목소리도 닫힙니다.";
  }
  if (/system|redesign|reform|구조|개편|재설계/.test(choiceText)) {
    return "권한 영향: 당장의 결론보다 다음 운영 기준에 개입합니다.";
  }
  return "권한 영향: 이 선택의 흔적이 다음 챕터의 조사 기준으로 남습니다.";
}

export function getChoiceRouteBadge(choice) {
  if (choice.continuityMemory) {
    return { label: "MEMORY ROUTE", text: "이전 사건의 선택 로그가 만든 추가 선택지" };
  }
  if (String(choice.id ?? "").includes("evidence_turn")) {
    return { label: "EVIDENCE TURN", text: "발견한 증거가 질문의 전제를 바꾸는 선택지" };
  }
  if (choice.requiredAuthority === "OVERSIGHT") {
    return { label: "OVERSIGHT", text: "감독 권한으로만 열리는 선택지" };
  }
  if (choice.requiredAuthority === "FIELD ACCESS") {
    return { label: "FIELD ACCESS", text: "증거 또는 신뢰가 충분해야 열리는 선택지" };
  }
  if (choice.adaptive) {
    return { label: "ADAPTIVE", text: "자유응답 기록이 만든 추가 선택지" };
  }
  if (choice.routeSplit || choice.branchId) {
    return { label: "ROUTE SPLIT", text: "다른 질문 경로로 갈라지는 선택지" };
  }
  return null;
}
