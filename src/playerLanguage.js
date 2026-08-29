const phraseReplacements = [
  [/\bPLAYABLE\b/gi, "시작 가능"],
  [/\bLOCKED\b/gi, "잠김"],
  [/\bOPEN\b/gi, "열림"],
  [/\bCOMPLETE\b/gi, "완료"],
  [/\bPLAYING\b/gi, "진행 중"],
  [/\bRISK\b/gi, "위험"],
  [/\bMOMENTUM\b/gi, "흐름"],
  [/\bBURST\b/gi, "버스트"],
  [/\bPOINTS\b/gi, "점수"],
  [/\bRANK\b/gi, "등급"],
  [/\bACTIVE BONUS\b/gi, "지금 받는 보너스"],
  [/\bOBJECTIVE\b/gi, "현재 목표"],
  [/\bDECISION WINDOW\b/gi, "남은 결정 시간"],
  [/\bLIVE LEDGER\b/gi, "선택 기록"],
  [/\bSCENE CHALLENGE\b/gi, "이번 장면 목표"],
  [/\bEMERGENCY OPTION\b/gi, "긴급 선택"],
  [/\bQUESTS\b/gi, "작은 목표"],
  [/\bSTORY THREAD\b/gi, "이야기 흐름"],
  [/\bCOMMIT SEQUENCE\b/gi, "선택 확인"],
  [/\bCOUNTERFACTUAL LAB\b/gi, "다른 선택과 비교"],
  [/\bDECISION DNA\b/gi, "나의 선택 습관"],
  [/\bPUBLIC SIGNAL BOARD\b/gi, "참가자 순위"],
  [/\bTRIGGERLAB TRACE\b/gi, "트리거랩 관찰 기록"],
  [/\bHIDDEN PROTOCOL\b/gi, "숨은 긴급 절차"],
  [/\bOBSERVER ONLINE\b/gi, "관찰 시작"],
  [/\bPATTERN LOCK\b/gi, "반복 습관 고정"],
  [/\bPRESSURE CASCADE\b/gi, "압박이 이어짐"],
  [/\bAFTERSHOCK\b/gi, "뒤늦은 영향"],
  [/\bLOW SIGNAL\b/gi, "아직 조용함"],
  [/\bSIGNAL QUIET\b/gi, "아직 조용함"],
  [/\bSIGNAL WATCH\b/gi, "주의해서 보기"],
  [/\bSIGNAL UNSTABLE\b/gi, "흔들리는 상태"],
  [/\bSIGNAL REDLINE\b/gi, "위험선 도달"],
  [/\bINSTINCT SURGE\b/gi, "직감 보너스"],
  [/\bAUDIT SURGE\b/gi, "확인 보너스"],
  [/\bQUICK READ\b/gi, "빠른 판단 보너스"],
  [/\bFLOW\b/gi, "좋은 흐름"],
  [/\bREADY\b/gi, "준비된 흐름"],
  [/\bBUILDING\b/gi, "흐름을 만드는 중"],
  [/\bTIME\b/gi, "시간"],
  [/\bCAPITAL\b/gi, "현금"],
  [/\bTRUST\b/gi, "믿음"],
  [/\bLEGITIMACY\b/gi, "공정함"],
  [/\bHUMAN COST\b/gi, "사람 피해"],
  [/\bFATIGUE\b/gi, "지침"],
];

export function simplifyPlayerText(value = "") {
  if (value === null || value === undefined) return "";
  const text = String(value);
  // Authored Korean copy may contain English product terms; never rewrite prose globally.
  if (/[\uAC00-\uD7A3]/.test(text)) return text;
  return phraseReplacements.reduce((current, [pattern, replacement]) => current.replace(pattern, replacement), text);
}

export const easyResourceLabels = {
  time: "남은 시간",
  capital: "현금",
  trust: "믿음",
  legitimacy: "공정함",
  humanCost: "사람 피해",
  fatigue: "지침",
};

export const easyCognitionLabels = {
  persistence: "끝까지 버티기",
  inference: "꼼꼼히 확인하기",
  reframing: "판 바꾸기",
  risk: "위험 다루기",
};

export const easyRiskLabels = {
  CONTROLLED: "관리 가능",
  UNSTABLE: "불안정",
  CRITICAL: "매우 위험",
};
