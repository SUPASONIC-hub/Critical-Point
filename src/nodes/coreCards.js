/**
 * The card copy of the finale: the close of its hidden route, the label of its
 * evidence card, and what its memory cards answer.
 *
 * Every other case carries these on its own pack (`routePlan.system`,
 * `evidencePlan`, `memoryPlan`). The finale has no pack -- its plans are
 * tables in `gameData.js`, which is held to a line budget -- so its copy lives
 * here and is laid onto those tables before the scenes are generated.
 */

/** Laid onto `dramaticRoutePlans[caseId].system`. */
const closings = {
  final: {
    finalTitle: "다음 사람의 화면",
    finalText: "새벽의 보관소 단말에는 전송 대기열 두 줄이 나란히 깜빡입니다. 하나는 삭제, 하나는 공개입니다. 그 위에 다음 참가자의 첫 화면이 미리 그려져 있고, 선택지 하나는 당신이 다시 짠 판과 글자 하나 다르지 않습니다. 에코가 마지막으로 묻습니다. '이 사람은 아직 아무것도 고르지 않았습니다. 무엇을 고르게 두겠습니까?'",
    finalMemo: ["삭제 전송과 공개 전송: 둘 다 대기 중", "다음 참가자의 첫 화면에 당신이 다시 짠 판이 있음", "종료 권한: 아직 당신에게"],
  },
};

/** Laid onto `evidenceTurnaroundPlans[caseId]`. */
const entryLabels = {
  final: { entryLabel: "선택지들이 만들어진 원본 폴더를 연다" },
};

/** Laid onto `continuityMemoryChoicePlans[caseId]`. */
const memoryEchoes = {
  final: {
    systemEcho: "비춰 보면 다음 참가자의 선택지 셋 중 하나에서 어제 당신이 다시 짠 판의 조건이 빠짐없이 읽힙니다.",
    evidenceEcho: "작성자를 따라가면 설계 로그의 잠금이 풀립니다. 매번 다르던 질문들이 같은 원본에서 갈라져 나온 것이 보입니다.",
  },
};

/**
 * One name, because `gameData.js` is also held to a count of imported names.
 */
export const coreCards = {
  closings,
  entryLabels,
  memoryEchoes,
  /** Lays one table of card copy onto the plans it belongs to. */
  lay(cards, planOf) {
    Object.entries(cards).forEach(([caseId, copy]) => Object.assign(planOf(caseId), copy));
  },
  /**
   * Files what each memory card answers under the id the card is dealt with
   * (`caseNN_memory_route`, `_system`, `_evidence`). The card is dealt at run
   * time, so it is no scene's choice and the authored echo table -- which is
   * checked against the graph -- cannot hold its reply; the plan carries it.
   */
  fileMemoryEchoes(memoryPlans, echoReplies) {
    Object.entries(memoryPlans).forEach(([caseId, plan]) => {
      for (const kind of ["route", "system", "evidence"]) {
        if (plan?.[`${kind}Echo`]) echoReplies[`${caseId}_memory_${kind}`] = plan[`${kind}Echo`];
      }
    });
  },
};
