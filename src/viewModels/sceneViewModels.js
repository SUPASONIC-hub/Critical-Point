import { characterProfiles } from "../gameDialogue.js";
import { getAuthorityProfile } from "../advancedSystems.js";

/**
 * Derived scene state. Each of these reads a handful of run values and returns
 * the copy the play screen shows; none of them touch component state, so they
 * live here rather than in the middle of AppContent's render.
 */

export function createSpeakerProfile({ node }) {
  return characterProfiles[node?.speaker] ?? {
  role: "사건 관계자",
  stance: "상황 설명",
  job: "현재 국면의 핵심 정보를 전달한다.",
  appearance: "정돈되지 않은 자료 더미 앞에 사건 관계자가 앉아 있다.",
  thought: "이 장면에서 놓친 전제가 있는지 다시 확인한다.",
  gesture: "사건 관계자는 잠깐 말을 멈추고, 테이블 위 자료를 다시 바라본다.",
  voice: "상황을 과장하지 않고 필요한 정보만 전달한다.",
  line: "지금 결정하면, 무엇이 다음 장면으로 넘어갑니까?",
  };
}

export function createPressureCascade({ log, resources, riskPressure }) {
  const latest = log.at(-1);
  const humanCost = resources.humanCost ?? 0;
  const fatigue = resources.fatigue ?? 0;
  const pressure = riskPressure;
  if (pressure >= 72 || humanCost >= 28) {
    return {
      tone: "critical",
      label: "PRESSURE CASCADE",
      title: "숫자로 막던 문제가 사람의 반응으로 새고 있습니다.",
      text: "다음 선택은 자원 하나만 움직이지 않습니다. 침묵한 사람, 떠날 사람, 기록을 들고 있는 사람이 동시에 반응합니다.",
      cue: "가장 큰 성과보다 피해가 어디로 이동하는지 먼저 말해야 합니다.",
    };
  }
  if (pressure >= 48 || fatigue >= 32) {
    return {
      tone: "unstable",
      label: "AFTERSHOCK",
      title: "직전 판단의 비용이 아직 회의실에 남아 있습니다.",
      text: "다음 결론을 서두르면 방금 줄인 비용이 다른 이해관계자에게 옮겨갈 수 있습니다.",
      cue: latest?.challenge?.matched
        ? "챌린지를 맞혔어도, 남겨둔 비용까지 사라진 것은 아닙니다."
        : "이번 장면은 정답보다 비용의 이동 경로를 확인해야 합니다.",
    };
  }
  return {
    tone: "stable",
    label: "LOW SIGNAL",
    title: "아직 방향을 바꿀 여지가 있습니다.",
    text: "압박이 낮을 때는 빠른 결론보다 다음 사건에 남길 기준을 설계할 수 있습니다.",
    cue: "지금 남기는 문장이 다음 장면의 출발점이 됩니다.",
  };
}

export function createAuthorityState({ evidence, legitimacy, operatorOrigin, trust }) {
  const level = evidence >= 5 && legitimacy >= 55 ? "OVERSIGHT" : evidence >= 2 || trust >= 55 ? "FIELD ACCESS" : "OBSERVER";
  const authorityProfile = getAuthorityProfile(operatorOrigin, level);
  return {
    level,
    evidence,
    permissions: authorityProfile.permissions,
    origin: authorityProfile,
    locked: level === "OBSERVER" ? "단서 2개 또는 신뢰 55가 필요합니다." : level === "FIELD ACCESS" ? "정당성 55와 단서 5개를 모으면 감독 권한이 열립니다." : "감독 권한이 열려 최종 종료 조건을 제안할 수 있습니다.",
  };
}

export function createActiveBonus({ currentAverageResponseTime, currentChallengeStreak, freeTextCombo, log }) {
  return log.at(-1)?.title === "CRISIS PROTOCOL"
    ? "구조 개입"
    : log.at(-1)?.instinctSurge
      ? "INSTINCT SURGE"
      : log.at(-1)?.auditSurge
        ? "AUDIT SURGE"
      : log.at(-1)?.tempoBonus
        ? "QUICK READ"
        : freeTextCombo >= 2
          ? "판 바꾸기 보너스"
          : currentChallengeStreak >= 2
            ? "연속 챌린지 보너스"
            : currentAverageResponseTime >= 20
              ? "숙고 보너스"
              : log.length >= 3
                ? "연속 판단 보너스"
                : "보너스 대기";
}

export function createInheritedChallenge({ isOpeningNode, openingLegacy }) {
  return openingLegacy && isOpeningNode
    ? (openingLegacy.continuityChallenge ?? {
        id:
          openingLegacy.label === "CLEAR SIGNAL"
            ? "protect-trust"
            : openingLegacy.label === "OPEN WOUND"
              ? "repair-legitimacy"
              : openingLegacy.label === "UNFINISHED COST"
                ? "lower-risk"
                : "find-cost",
        title:
          openingLegacy.label === "CLEAR SIGNAL"
            ? "신뢰를 다음 장면에 넘기기"
            : openingLegacy.label === "OPEN WOUND"
              ? "정당성 균열 봉합하기"
              : openingLegacy.label === "UNFINISHED COST"
                ? "남은 비용 줄이기"
                : "이전 판단의 비용 확인하기",
        text:
          openingLegacy.label === "CLEAR SIGNAL"
            ? "이전 케이스에서 얻은 신뢰를 잃지 않는 선택이 다음 압박의 문을 엽니다."
            : openingLegacy.label === "OPEN WOUND"
              ? "정당성을 회복하는 선택으로 지난 사건의 균열을 먼저 봉합해야 합니다."
              : openingLegacy.label === "UNFINISHED COST"
                ? "지난 사건에서 넘어온 비용을 줄이면 이번 장면의 회복 보너스가 붙습니다."
                : "이전 판단이 남긴 숨은 비용을 찾아야 다음 사건의 기준을 다시 세울 수 있습니다.",
      })
    : null;
}

export function createSceneChallenge({ freeChoice, freeTextCombo, inheritedChallenge, node, riskPressure }) {
  return inheritedChallenge ??
  (riskPressure >= 35
    ? {
        id: "lower-risk",
        title: "위험 압력 낮추기",
        text: "예상 위험이 내려가는 선택을 찾으면 압박 관리 보너스가 붙습니다.",
      }
    : freeTextCombo === 0 && freeChoice
      ? {
          id: "use-reframe",
          title: "판 바꾸기 시도",
          text: "구조 재설계에서 반영 기준 2개 이상을 채우면 보너스 조건이 열립니다.",
        }
      : (node?.triggers ?? []).includes("competition")
        ? {
            id: "avoid-risk",
            title: "속도에 말리지 않기",
            text: "위험 상승을 감수하지 않고 경쟁 압박을 통과하는 선택을 찾습니다.",
          }
        : {
            id: "find-cost",
            title: "숨은 비용 찾기",
            text: "가장 좋아 보이는 선택의 반대 비용을 확인하고 고릅니다.",
          });
}

export function createQuestSteps({ challengeClearCount, currentChallengeStreak, freeTextCombo, log, reducedRiskCount }) {
  return [
  {
    title: "장면 챌린지",
    value: `${challengeClearCount}/${Math.max(1, log.length)}`,
    text: currentChallengeStreak > 0 ? `${currentChallengeStreak}연속 유지 중` : "이번 장면에서 다시 시작",
    complete: currentChallengeStreak > 0,
  },
  {
    title: "위험 압력 제어",
    value: `${reducedRiskCount}`,
    text: reducedRiskCount > 0 ? "하락 선택 기록됨" : "위험 하락 선택을 찾아야 함",
    complete: reducedRiskCount > 0,
  },
  {
    title: "판 바꾸기",
    value: `${freeTextCombo}`,
    text: freeTextCombo > 0 ? "선택지 밖 계획이 남음" : "구조 재설계 미사용",
    complete: freeTextCombo > 0,
  },
  ];
}
