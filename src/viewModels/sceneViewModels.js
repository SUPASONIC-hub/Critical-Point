import { getCharacterProfile } from "../gameDialogue.js";
import { getAuthorityProfile } from "../runtimeSystems.js";
import { AUTHORITY_THRESHOLDS, getAuthorityClueThresholds, getAuthorityLevel } from "../gameLogic.js";
import { easyResourceLabels, subjectParticle } from "../playerLanguage.js";
import { fill, roleName } from "../locale.js";
import briefingCopy from "../copy/briefing.js";

const { authority: authorityCopy, bonus: bonusCopy, inherited: inheritedCopy, challenge: challengeCopy } = briefingCopy.scene;

/**
 * Derived scene state. Each of these reads a handful of run values and returns
 * the copy the play screen shows; none of them touch component state, so they
 * live here rather than in the middle of AppContent's render.
 */

// The scene knows its case (the graph build stamps it), and who someone is
// depends on the case: see `getCharacterProfile`.
export function createSpeakerProfile({ node }) {
  const profile = getCharacterProfile(node?.speaker, node?.caseId) ?? { ...briefingCopy.scene.stockProfile };
  // The role in the page's language; the same object on a Korean page.
  const role = roleName(profile.role);
  return role === profile.role ? profile : { ...profile, role };
}

export function createAuthorityState({ casesOpened = 0, evidence, legitimacy, operatorOrigin, trust }) {
  const level = getAuthorityLevel({ clueCount: evidence, legitimacy, trust, casesOpened });
  const authorityProfile = getAuthorityProfile(operatorOrigin, level);
  // The clue counts the gate asks for grow with the cases opened; quote those.
  const { oversightLegitimacy, fieldTrust } = AUTHORITY_THRESHOLDS;
  const { oversightClues, fieldClues } = getAuthorityClueThresholds(casesOpened);
  return {
    level,
    evidence,
    permissions: authorityProfile.permissions,
    origin: authorityProfile,
    locked: level === "OBSERVER"
      ? fill(authorityCopy.observer, { clues: fieldClues, trust: easyResourceLabels.trust, value: fieldTrust, particle: subjectParticle(String(fieldTrust)) })
      : level === "FIELD ACCESS"
        ? fill(authorityCopy.field, { legitimacy: easyResourceLabels.legitimacy, value: oversightLegitimacy, clues: oversightClues })
        : authorityCopy.oversight,
  };
}

export function createActiveBonus({ currentAverageResponseTime, currentChallengeStreak, reframeCombo, log }) {
  // The entry's title "CRISIS PROTOCOL", `streakReward`, `instinctSurge` and
  // `auditSurge` were read here first. No commit writes any of them, so those
  // four branches never ran.
  // The hand's line; an entry logged before 2026-10-11 holds it as `tempoBonus`.
  return (log.at(-1)?.handLine ?? log.at(-1)?.tempoBonus)
    ? "QUICK READ"
    : reframeCombo >= 2
      ? bonusCopy.reframe
      : currentChallengeStreak >= 2
        ? bonusCopy.challenge
        : currentAverageResponseTime >= 20
          ? bonusCopy.deliberate
          : log.length >= 3
            ? bonusCopy.run
            : bonusCopy.waiting;
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
        ...(openingLegacy.label === "CLEAR SIGNAL"
          ? inheritedCopy.clearSignal
          : openingLegacy.label === "OPEN WOUND"
            ? inheritedCopy.openWound
            : openingLegacy.label === "UNFINISHED COST"
              ? inheritedCopy.unfinishedCost
              : inheritedCopy.other),
      })
    : null;
}

export function createSceneChallenge({ reframeChoice, reframeCombo, inheritedChallenge, node, riskPressure }) {
  return inheritedChallenge ??
  (riskPressure >= 35
    ? {
        id: "lower-risk",
        ...challengeCopy.lowerRisk,
      }
    : reframeCombo === 0 && reframeChoice
      ? {
          id: "use-reframe",
          ...challengeCopy.useReframe,
        }
      : (node?.triggers ?? []).includes("competition")
        ? {
            id: "avoid-risk",
            ...challengeCopy.avoidRisk,
          }
        : {
            id: "find-cost",
            ...challengeCopy.findCost,
          });
}
