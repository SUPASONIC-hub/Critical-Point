import { localizeTables } from "../locale.js";

/**
 * 판 변형 (gauntlet/gauntletEngine.js MUTATIONS, LIFTED_MUTATIONS): the
 * next-board rules as the briefing, the table's rule row and the reveal print
 * them, read by key so another language can be laid over them (src/locale.js,
 * 다국어 틀; 영어판 4단계). The Korean is the engine's, moved here unchanged.
 * A rule's numbers are tableRules.js's constants, filled into its `{blank}`s;
 * `{particle}` is the Korean particle the number before it takes, which
 * another language leaves out. Each rule keeps its English `label` in the
 * engine: it is already English. CASCADE's words are src/copy/cascade.js's.
 */
const mutationsCopy = {
  rules: {
    blackout: {
      title: "카드가 뒤집혔다",
      text: "임계점을 넘긴 대가. 다음 판은 카드의 칩과 소모가 가려지고, 벽이 {wall} 가까워진다.",
    },
    aftershock: {
      title: "여진이 남았다",
      text: "열기가 {start}에서 시작한다. 방금 벽에 닿은 열기가 아직 식지 않았다.",
    },
    silence: {
      title: "심장이 거짓말을 한다",
      text: "시간을 흘려보낸 대가. 다음 판은 심박이 벽을 알려주지 않고, 결정 시간이 {seconds}초다.",
    },
    heatDebt: {
      title: "탐욕은 열기를 남긴다",
      text: "높은 배율로 확정한 대가. 이번 열기의 {share}분의 1을 안고 시작하고, {seconds}초를 잃는다.",
    },
    overclock: {
      title: "칩이 두 배로 뛴다",
      text: "연속으로 ×{multiplier} 이상을 챙겼다. 칩이 {chips}배지만, 한 번 밀 때 오르는 열기도 커진다.",
    },
    coldFeet: {
      title: "가장 좋은 카드가 봉인됐다",
      text: "밀지 않고 확정한 대가. 가장 비싼 카드는 열기 {seal}{particle} 넘겨야 열리고, 칩이 줄어든다.",
    },
    fracture: {
      title: "균열이 난 자원",
      text: "방금 가장 크게 태운 자원. 다음 판에서 그 자원을 태우는 카드는 {rate}배로 청구된다.",
    },
    reboot: {
      title: "사건이 닫혔다",
      text: "판돈은 금고로 옮겨졌고, 규칙이 초기화됐다. 이제 잃을 수 없다.",
    },
    strikeWake: {
      title: "다음 판이 더 두껍게 깨어난다",
      text: "STRIKE로 충전한 LOCK. 다음 판은 칩이 {chips}배지만, 한 번 밀 때 오르는 열기도 커진다.",
    },
    steadyLine: {
      title: "다음 판이 식은 채 열린다",
      text: "STEADY로 충전한 LOCK. 다음 판은 열기 {cool} 낮게 시작하고 시간이 {seconds}초 늘며, 벽이 {wall} 멀어진다.",
    },
    exposedHand: {
      title: "다음 판은 패를 숨기지 못한다",
      text: "EXPOSE로 충전한 LOCK. 다음 판은 카드가 뒤집히지 않고, COLD FEET 봉인도 풀린다.",
    },
    strikeMastery: {
      title: "시즌이 먼저 치는 법을 익혔다",
      text: "STRIKE LOCK을 거듭 충전한 결과. 새 판마다 칩이 두꺼워지고, 밀 때 오르는 열기가 1 늘어난다.",
    },
    steadyMastery: {
      title: "시즌이 버티는 법을 익혔다",
      text: "STEADY LOCK을 거듭 충전한 결과. 새 판마다 식은 채 시작하고, 시간이 조금 늘어난다.",
    },
    exposeMastery: {
      title: "시즌이 판을 읽는 법을 익혔다",
      text: "EXPOSE LOCK을 거듭 충전한 결과. 봉인이 더 일찍 열리고, 더 쌓이면 가려진 판도 숨지 못한다.",
    },
  },
  // What BLACKOUT and COLD FEET say once EXPOSE mastery has taken half of the rule back.
  lifted: {
    blackout: {
      title: "벽이 다가왔다",
      text: "임계점을 넘긴 대가. 벽이 {wall} 가까워진다. 카드는 EXPOSE 숙련이 뒤집히지 않게 막았다.",
    },
    coldFeet: {
      title: "칩이 줄었다",
      text: "밀지 않고 확정한 대가. 칩이 줄어든다. 봉인은 EXPOSE 숙련이 풀었다.",
    },
  },
};
export default mutationsCopy;

localizeTables("screens", { mutations: mutationsCopy });
