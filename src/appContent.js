import {
  AlertTriangle,
  BarChart3,
  BriefcaseBusiness,
  Clock3,
  Shield,
  Users,
} from "lucide-react";
import { easyResourceLabels } from "./playerLanguage.js";

/**
 * Presentation copy and per-case content tables.
 * Data only — no state, no behaviour — so screens can import it directly.
 */

export const resourceMeta = {
  time: { label: easyResourceLabels.time, suffix: "시간", icon: Clock3 },
  capital: { label: easyResourceLabels.capital, suffix: "", icon: BriefcaseBusiness },
  trust: { label: easyResourceLabels.trust, suffix: "", icon: Users },
  legitimacy: { label: easyResourceLabels.legitimacy, suffix: "", icon: Shield },
  humanCost: { label: easyResourceLabels.humanCost, suffix: "", icon: AlertTriangle },
  fatigue: { label: easyResourceLabels.fatigue, suffix: "", icon: BarChart3 },
};

export const playStyleOptions = [
  {
    id: "instinct",
    label: "감각형",
    title: "첫 반응을 믿는다",
    text: "전술 정보를 덜 보고 장면의 온도와 사람의 반응으로 결정합니다.",
    payoff: "직관 챌린지 보너스 강화",
  },
  {
    id: "auditor",
    label: "감사형",
    title: "근거를 끝까지 확인한다",
    text: "비용과 위험을 펼쳐 본 뒤, 설명 가능한 선택을 밀어붙입니다.",
    payoff: "전술 챌린지 보너스 강화",
  },
  {
    id: "mediator",
    label: "중재형",
    title: "대화로 압박을 낮춘다",
    text: "에코의 힌트와 관계의 맥락을 활용해 손실을 분산합니다.",
    payoff: "에코 힌트 비용 절감",
  },
];


export const sceneVisuals = {
  case01: "/scene-case01.png",
  case02: "/scene-case02.png",
  case03: "/scene-case03.png",
  case04: "/scene-case04.png",
  case05: "/scene-case05.png",
  final: "/scene-final.png",
};

export const legacyProfiles = {
  S: {
    label: "CLEAR SIGNAL",
    title: "이전 판단의 신뢰가 다음 사건을 받칩니다.",
    text: "직전 케이스에서 기준을 끝까지 설명해 냈습니다. 다음 사건은 작은 신뢰와 정당성을 품고 시작합니다.",
    effect: { trust: 4, legitimacy: 3 },
  },
  A: {
    label: "STABLE HAND",
    title: "이전 판단의 균형이 남아 있습니다.",
    text: "대부분의 압박을 통제했습니다. 다음 사건은 약간의 신뢰와 정당성을 가진 채 열립니다.",
    effect: { trust: 2, legitimacy: 1 },
  },
  B: {
    label: "UNFINISHED COST",
    title: "해결되지 않은 비용이 다음 사건으로 넘어왔습니다.",
    text: "사건은 통과했지만 설명되지 않은 손실이 남았습니다. 다음 사건은 피로를 안고 시작합니다.",
    effect: { fatigue: 2 },
  },
  C: {
    label: "OPEN WOUND",
    title: "지난 판단의 균열이 아직 닫히지 않았습니다.",
    text: "압박을 낮추지 못한 흔적이 다음 사건의 첫 질문이 됩니다. 정당성과 피로가 불리하게 출발합니다.",
    effect: { legitimacy: -2, fatigue: 4 },
  },
};

export const nextCaseSignals = {
  case01: {
    eyebrow: "NEXT CASE UNLOCKED",
    caseId: "case02",
    title: "사건 02 - 가짜 신호",
    button: "사건 02 시작",
    premise:
      "동료가 내부 정보 유출자로 지목됩니다. 증거는 명확하지만, 사람의 맥락은 다른 이야기를 합니다.",
    hook:
      "트리거랩은 방금 당신이 손실을 누구에게 먼저 배분했는지 기록했습니다. 다음 사건에서는 그 기준이 사람을 믿을지, 기록을 믿을지의 압박으로 바뀝니다.",
  },
  case02: {
    eyebrow: "NEXT CASE UNLOCKED",
    caseId: "case03",
    title: "사건 03 - 경쟁자의 반격",
    button: "사건 03 시작",
    premise:
      "오진우와 같은 자료를 받고 동시에 해결안을 냅니다. 이번에는 경쟁심이 판단을 빠르게 만드는지, 얕게 만드는지 확인합니다.",
    hook:
      "당신이 증거와 신뢰 사이에서 망설인 시간은 다음 테스트의 난이도가 됩니다. 오진우는 그 망설임을 점수판으로 바꿔 보여줄 것입니다.",
  },
  case03: {
    eyebrow: "NEXT CASE UNLOCKED",
    caseId: "case04",
    title: "사건 04 - 치러야 할 대가",
    button: "사건 04 시작",
    premise:
      "작은 규칙 위반이 수천 명을 살릴 수 있습니다. 이번에는 좋은 결과가 절차 훼손을 어디까지 정당화하는지 묻습니다.",
    hook:
      "경쟁 압박 속에서 당신이 줄인 검증과 남긴 근거가 분리됩니다. 다음 사건은 좋은 결과를 얻기 위해 어느 선까지 넘을 수 있는지 묻습니다.",
  },
  case04: {
    eyebrow: "NEXT CASE UNLOCKED",
    caseId: "case05",
    title: "사건 05 - 범인은 없었다",
    button: "사건 05 시작",
    premise:
      "명백한 악인은 없습니다. 모두가 합리적으로 움직였지만 시스템은 가장 조용한 사람들을 밀어냈습니다.",
    hook:
      "명분 있는 예외를 허용한 기록은 사라지지 않습니다. 다음 사건에서는 누구도 규칙을 어기지 않았는데도 피해가 생깁니다.",
  },
  case05: {
    eyebrow: "FINAL CASE UNLOCKED",
    caseId: "final",
    title: "마지막 사건 - 트리거랩의 진실",
    button: "마지막 사건 시작",
    premise:
      "모든 사건의 로그가 하나의 폴더로 연결됩니다. 이제 트리거랩이 당신의 사고 조건을 어떻게 사용했는지 마주합니다.",
    hook:
      "악인이 없는 실패까지 통과한 뒤, 남는 것은 사건이 아니라 당신의 반응 패턴입니다. 마지막 폴더에는 그 패턴이 사건 설계에 쓰인 흔적이 있습니다.",
  },
};

export const playGuideItems = [
  {
    title: "에코",
    text: "정답을 주는 사람이 아니라, 방금 선택에서 빠진 점을 알려주는 도우미입니다.",
  },
  {
    title: "판 바꾸기",
    text: "보기 중 마음에 드는 답이 없을 때 사람, 조건, 순서를 직접 새로 정합니다.",
  },
  {
    title: "상태 변화",
    text: "선택 뒤에 달라지는 시간, 현금, 믿음, 공정함, 사람 피해, 지침을 보여줍니다.",
  },
  {
    title: "반응 버튼",
    text: "당신이 특히 오래 고민하거나 쉽게 움직이는 마음의 지점입니다. 다음 사건에도 영향을 줍니다.",
  },
];

export const triggerLabSignals = {
  case01: "관찰 항목: 손실 배분 순서, 보호 대상, 공개 지연 허용선",
  case02: "관찰 항목: 로그 신뢰도, 관계 신뢰도, 절차 밖 확인 허용선",
  case03: "관찰 항목: 경쟁 상황의 검증 생략, 속도 보상 반응, 점수판 민감도",
  case04: "관찰 항목: 좋은 결과를 위한 예외 허용선, 기록 은폐 저항, 공개 감사 선호",
  case05: "관찰 항목: 단일 책임 욕구, 구조 실패 인내, 조용한 피해자 감지",
  final: "관찰 항목: 자기 조건 인식, 프로필 공개 범위, 시스템 존치 허용선",
};
