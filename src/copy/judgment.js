import { localizeTables } from "../locale.js";

/**
 * gameLogic.js's words, read by key so another language can be laid over
 * them (src/locale.js, 다국어 틀): the 판단 DNA's three modes, which the result
 * card prints when a season has no 판단 습관 and the report prints above its
 * motive (`getDecisionFingerprint`), the motive families
 * (`getThinkingMotive`), what a case with no aftermath for a choice closes on
 * (`getCaseOutcome`), the report's sentence on what a choice traded
 * (`explainResourceTradeoff`) and the question a scene without one asks
 * (`buildNarrativeSpine`). The Korean is gameLogic.js's, moved here
 * unchanged, its blanks named; `{particle}` is a Korean particle another
 * language may leave out.
 */
const judgmentCopy = {
  modes: {
    GUARDIAN: {
      title: "피해의 이동을 먼저 막는 사람",
      text: "결과의 크기보다 누가 비용을 떠안는지 확인하며 판단을 오래 유지합니다.",
    },
    "RE-FRAMER": {
      title: "판 자체를 다시 짜는 사람",
      text: "주어진 선택지의 균형을 따르기보다 이해관계자와 조건을 다시 배치합니다.",
    },
    "PRESSURE PILOT": {
      title: "압박 안에서 방향을 조정하는 사람",
      text: "위험이 커져도 결정을 멈추지 않고, 다음 장면으로 넘길 비용을 선택합니다.",
    },
  },
  motives: {
    affection: { label: "애정형", when: "살리고 싶은 사람이 보일 때", path: "애정 → 집념 → 끝까지 생각 → 구제" },
    revenge: { label: "복수형", when: "되갚고 싶은 부당함이 보일 때", path: "분노 → 집념 → 약점 추적 → 교정" },
    responsibility: { label: "책임형", when: "떠맡은 것이 무너질 것 같을 때", path: "책임 → 집념 → 손익 계산 → 회생" },
    curiosity: { label: "탐구형", when: "아직 모르는 것이 남았을 때", path: "호기심 → 집념 → 구조 파악 → 발견" },
    mixed: { label: "복합형", when: "한 가지 감정이 혼자 생각을 깨우지 않았을 때", path: "여러 감정 → 집념 → 끝까지 생각 → 다시 읽기" },
  },
  unrecordedOutcome: { tag: "기록되지 않은 결말", title: "아직 닫히지 않은 결과", text: "이번 선택의 파장은 다음 기록에 남아 있습니다." },
  tradeoff: {
    still: "숫자는 거의 움직이지 않았지만, 이 선택은 판단의 기준을 남겼습니다.",
    noGain: "즉시 얻은 것은 적고",
    noLoss: "눈에 보이는 손실은 작습니다",
    both: "{gains}{gainParticle} 얻는 대신 {losses}{lossParticle} 감수했습니다.",
    gainsOnly: "{gains}{gainParticle} 열렸지만, 그 이득이 다음 장면의 압박으로 남습니다.",
    lossesOnly: "{losses}{lossParticle} 감수했습니다. 선택의 명분은 남았지만 여력이 깎였습니다.",
  },
  question: "지금 무엇을 먼저 지킬지 결정해야 합니다.",
  titledQuestion: "{title}: 지금 무엇을 먼저 지킬지 결정해야 합니다.",
};
export default judgmentCopy;

localizeTables("screens", { judgment: judgmentCopy });
