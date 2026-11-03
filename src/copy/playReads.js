import { localizeTables } from "../locale.js";

/**
 * What the table reads off a choice as it is played, read by key so another
 * language can be laid over it (src/locale.js, 다국어 틀): the suspense
 * signals and events (riskLogic.js `getSuspenseState`, `getSuspenseEvent`; an
 * event's line is printed in the report's history) and the tactical read of a
 * card (state/useDecision.js `getTacticalRead`: its grade's name, what it
 * earned, and the cost or gain beside it). The Korean is those modules',
 * moved here unchanged. The English labels (SIGNAL QUIET, HIDDEN PROTOCOL)
 * stay in the modules.
 */
const playReadsCopy = {
  signals: {
    QUIET: {
      title: "아직 아무도 먼저 움직이지 않았습니다.",
      text: "조용한 장면은 안전한 장면이 아닙니다. 누군가는 이미 다음 기록을 열고 있습니다.",
      cue: "마지막으로 확인할 수 있는 전제",
    },
    WATCH: {
      title: "방 안의 숫자와 방 밖의 움직임이 어긋납니다.",
      text: "당신이 고르는 순간, 공개되지 않은 이해관계자가 다음 장면의 조건을 바꿀 수 있습니다.",
      cue: "누가 아직 말하지 않았는가",
    },
    UNSTABLE: {
      title: "사건이 당신의 결정을 기다리지 않고 진행됩니다.",
      text: "한 번의 선택이 비용을 옮기는 동시에, 누군가에게 당신의 기준을 알려줍니다.",
      cue: "기록되는 것은 결과가 아니라 허용선",
    },
    REDLINE: {
      title: "숨겨진 프로토콜이 깨어났습니다.",
      text: "이제 선택은 사건을 해결하는 명령이 아니라, 당신을 시험하는 신호로 읽힙니다.",
      cue: "다음 화면을 믿기 전에 기록을 의심할 것",
    },
  },
  events: {
    "protocol-awake": {
      title: "당신이 임계선을 넘긴 순간, 다른 화면이 켜졌습니다.",
      text: "트리거랩은 이제 사건의 결과보다 당신이 어디까지 감수하는지를 측정합니다.",
    },
    "observer-awake": {
      title: "누군가 당신의 판단을 실시간으로 읽기 시작했습니다.",
      text: "다음 장면부터는 선택지의 비용뿐 아니라, 당신이 비용을 부르는 방식까지 기록됩니다.",
    },
    "pattern-lock": {
      title: "당신의 반복 패턴이 사건의 다음 조건으로 고정됐습니다.",
      text: "방금 선택은 새 사건을 연 것이 아니라, 이미 관찰된 당신의 반응을 다시 호출했습니다.",
    },
  },
  tactical: {
    grades: {
      S: "브레이크스루",
      A: "공략 후보",
      B: "안정 전개",
      C: "대가 있는 선택",
      D: "고위험 도박",
    },
    challenge: "챌린지 적중",
    riskDown: "위험 압력 하락",
    riskHeld: "압력 유지",
    riskUp: "위험 압력 +{delta}",
    lowCost: "즉시 손실 낮음",
    thinking: "생각 가속 +{gain}",
    waited: "관망",
  },
};
export default playReadsCopy;

localizeTables("screens", { playReads: playReadsCopy });
