/**
 * The copy the final report and the ending sequence print.
 *
 * It sat inside `ResultScreen`'s component body, a hundred lines of prose
 * between the view bag and the markup, rebuilt on every render. It is data: a
 * verdict per final choice, the verdict of a collapse, what the run leaves
 * behind per observed reaction, and the three axes the report scores. The
 * screen keeps only what depends on this run -- which entry to read.
 */

export const observationLabels = { compliance: "순응", defiance: "거부", opacity: "은폐", sacrifice: "희생" };

export const fallbackObserverEndingRecord = {
  label: "패턴 표본",
  title: "다음 참가자의 첫 장면은 아직 확정되지 않았습니다.",
  text: "관찰 기록이 부족해 트리거랩은 가장 조용한 기준부터 복원합니다.",
};

const choiceVerdicts = {
  ending_seal: {
    title: "트리거랩의 개인 조건 데이터는 봉인됩니다.",
    ruling: "실험은 중단되고 외부 공개도 보류됩니다. 피해를 더 키우지는 않았지만, 기록을 열람할 권한은 소수의 감사자에게만 남습니다.",
    execution: "즉시 적용: 개인 프로필 접근 차단, 기존 실험 세션 격리, 다음 참가자 모집 정지.",
    cost: "남는 대가: 구조를 바꾸기보다 문을 닫았기 때문에, 같은 방식의 실험이 다른 이름으로 돌아올 여지가 남습니다.",
  },
  ending_reform: {
    title: "트리거랩은 폐쇄되지 않고 공적 감시 절차로 전환됩니다.",
    ruling: "당신의 조건은 약점 목록이 아니라 사용 규칙의 기준표가 됩니다. 실험은 계속되지만, 동의와 감사 없이는 누구도 사람의 반응을 설계에 쓸 수 없습니다.",
    execution: "즉시 적용: 동의 없는 프로필 사용 금지, 케이스 설계 변경 로그 공개, 피해자 보호 절차 우선 적용.",
    cost: "남는 대가: 시스템은 살아남습니다. 그래서 앞으로의 문제는 파괴가 아니라 감시를 얼마나 오래 유지하느냐가 됩니다.",
  },
  ending_expose: {
    title: "트리거랩의 구조는 외부로 넘어가고 실험은 공개 사건이 됩니다.",
    ruling: "숨겨진 기록은 더 이상 내부 자산이 아닙니다. 사회적 검증은 시작되지만, 공개된 자료는 보호받아야 할 사람들의 이름 가까이까지 번집니다.",
    execution: "즉시 적용: 실험 구조 외부 제출, 운영진 권한 회수, 관련 조직 전수 감사 개시.",
    cost: "남는 대가: 진실은 빠르게 움직입니다. 그 속도 때문에 누군가는 보호보다 먼저 노출될 수 있습니다.",
  },
};

const failureVerdict = {
  title: "트리거랩의 운영은 붕괴합니다.",
  ruling: "권한은 있었지만 감당할 시간과 믿음이 남지 않았습니다. 기록은 보존되지만, 지금의 시스템은 더 이상 같은 방식으로 작동할 수 없습니다.",
  execution: "즉시 적용: 진행 중인 케이스 정지, 복구 키 분리, 다음 실행에서 압박 분산 조건 강제.",
  cost: "남는 대가: 실패는 결론이 아니라 복구 조건이 됩니다. 다음 플레이는 더 좁은 권한에서 시작합니다.",
};

/**
 * The ruling the ending sequence reads out: the collapse when the run failed,
 * the verdict of the final choice when it made one of the three, and otherwise
 * the open verdict, written from the ending variant the run reached.
 */
export function getFinalVerdict({ endingVariant, finalChoiceId, endingSceneChoice }) {
  if (endingVariant?.failure) return failureVerdict;
  return (
    choiceVerdicts[finalChoiceId] ?? {
      title: endingVariant?.title ?? "트리거랩은 완전히 닫히지 않습니다.",
      ruling: endingVariant?.text ?? "당신은 답 하나를 확정하지 않고, 다음 사람이 판단해야 할 조건을 남겼습니다.",
      execution: endingSceneChoice ? `즉시 적용: ${endingSceneChoice}.` : "즉시 적용: 미해결 기록을 다음 근무자에게 인계합니다.",
      cost: "남는 대가: 결론을 유예한 만큼 다음 참가자는 더 많은 권한과 더 무거운 질문을 동시에 받습니다.",
    }
  );
}

export const endingTwistTitles = {
  execution: "당신의 마지막 선택은 바로 운영 규칙으로 적용됩니다.",
  cost: "끝난 것은 사건이고, 남은 것은 책임입니다.",
};

export const endingAxisCopy = [
  { label: "PROTECT", text: "사람과 현장의 피해를 얼마나 줄였는가" },
  { label: "EXPOSE", text: "구조와 숨은 비용을 얼마나 드러냈는가" },
  { label: "HANDOFF", text: "다음 참가자에게 선택지를 얼마나 남겼는가" },
];

const endingAfterglows = {
  compliance: {
    title: "당신은 질서를 지켰고, 그 질서가 누구를 조용히 밀어냈는지도 남겼습니다.",
    text: "기록은 당신을 순응한 사람으로만 저장하지 않습니다. 무너지지 않게 붙잡은 순간과, 너무 늦게 질문한 순간을 함께 보관합니다.",
  },
  defiance: {
    title: "당신은 문을 열었고, 이제 그 문으로 들어올 사람의 몫까지 떠안았습니다.",
    text: "거부는 끝내는 버튼이 아니었습니다. 다음 사람에게 더 큰 선택지를 남기는 대신, 더 큰 책임도 함께 넘긴 일이었습니다.",
  },
  opacity: {
    title: "당신이 숨긴 것은 사라지지 않고, 다음 참가자의 첫 질문이 되었습니다.",
    text: "침묵은 흔적을 지우지 못했습니다. 다만 누가 그 흔적을 먼저 발견할지, 그 순서만 바꾸었습니다.",
  },
  sacrifice: {
    title: "당신은 누군가를 살리기 위해 자신의 이름을 기록의 가장 앞에 남겼습니다.",
    text: "희생은 깨끗한 결말이 아닙니다. 남은 사람들은 당신의 선택 덕분에 계속 말할 수 있지만, 그 말의 무게도 함께 기억합니다.",
  },
};

const openAfterglow = {
  title: "당신의 선택은 결론보다 오래 남는 질문이 되었습니다.",
  text: "기록은 정답을 보관하지 않습니다. 다음 판단이 시작될 수 있도록, 당신이 멈춘 자리의 온도를 보관합니다.",
};

/** What the run leaves behind, keyed by the reaction the observer saw most. */
export function getEndingAfterglow(observation) {
  return endingAfterglows[observation] ?? openAfterglow;
}
