import { Check } from "lucide-react";

import { describeChoiceDilemma, getAuthorityGate } from "../gameLogic.js";
import {
  formatChoiceEffectChip,
  getChoiceAuthorityImpact,
  getChoiceRouteBadge,
  isChoiceEffectGain,
} from "../viewModels/playChoiceViewModel.js";
import { GuardedButton } from "./GuardedButton.jsx";

export function ChoiceList({
  fixedChoices,
  clueCount,
  resources,
  getEffectiveChoiceRead,
  getObserverPreviewForChoice,
  getChallengeMatch,
  pendingChoice,
  choiceButtonsRef,
  handleChoiceClick,
  beginChoiceHold,
  endChoiceHold,
  isAdvancing,
  choose,
  speechifyChoice,
  getChoiceSubtext,
  showTacticalDetails,
  getDramaticChoiceLabel,
  simplifyPlayerText,
  resourceMeta,
}) {
  return (
    <div className="choices">
      {fixedChoices.map((choice, choiceIndex) => {
        const authorityGate = getAuthorityGate(choice, {
          clueCount,
          trust: resources.trust,
          legitimacy: resources.legitimacy,
        });
        const choiceRead = getEffectiveChoiceRead(choice, choice.effect, choice.cognition);
        const observerPreview = getObserverPreviewForChoice(choice.id);
        const riskDelta = choiceRead.finalRiskDelta;
        const riskLabel = riskDelta > 0 ? `위험 +${riskDelta}` : riskDelta < 0 ? `위험 ${riskDelta}` : "위험 유지";
        const challengeMatch = getChallengeMatch(choice, choiceRead.baseRiskDelta);
        const routeBadge = getChoiceRouteBadge(choice);
        const pressureHint =
          riskDelta > 0
            ? "압박이 커질 수 있습니다."
            : riskDelta < 0
              ? "압박을 낮출 수 있습니다."
              : "압박은 크게 움직이지 않습니다.";

        return (
          <GuardedButton
            type="button"
            key={choice.id}
            ref={(button) => {
              if (button) choiceButtonsRef.current.set(choice.id, button);
              else choiceButtonsRef.current.delete(choice.id);
            }}
            className={`${pendingChoice?.id === choice.id ? "choice selected" : "choice"} ${authorityGate.unlocked ? "" : "locked-choice"}`.trim()}
            data-adaptive={choice.adaptive ? "true" : undefined}
            data-continuity-memory={choice.continuityMemory ? "true" : undefined}
            data-evidence-turn={String(choice.id ?? "").includes("evidence_turn") ? "true" : undefined}
            onClick={() => handleChoiceClick(choice)}
            onPointerDown={() => beginChoiceHold(choice)}
            onPointerUp={endChoiceHold}
            onPointerCancel={endChoiceHold}
            onPointerLeave={endChoiceHold}
            onKeyDown={(event) => {
              if (event.key === "Enter" && pendingChoice?.id === choice.id) {
                event.preventDefault();
                choose(choice);
              }
            }}
            disabled={isAdvancing}
            blocked={!authorityGate.unlocked}
            aria-pressed={pendingChoice?.id === choice.id}
            aria-keyshortcuts={`${choiceIndex + 1} Enter Space`}
            title={`${choiceIndex + 1}번 키로 선택 미리보기`}
            aria-label={`${speechifyChoice(choice)} ${riskLabel}. ${getChoiceSubtext(choice)}`}
          >
            <span className="choice-main">
              <Check size={16} />
              <small>{pendingChoice?.id === choice.id ? "검토 중" : "선택"}</small>
            </span>
            {routeBadge && (
              <span className="choice-route-badge" title={routeBadge.text}>
                {routeBadge.label}
              </span>
            )}
            <span className="choice-speech">"{speechifyChoice(choice)}"</span>
            <span className="choice-dilemma">{describeChoiceDilemma(choice.effect)}</span>
            {showTacticalDetails && observerPreview && (
              <span className={`choice-observer-preview ${observerPreview.repeatsCurrentPattern ? "is-repeat" : "is-break"}`}>
                <b>{observerPreview.tag.label}</b>
                <small>{observerPreview.repeatsCurrentPattern ? "패턴 고정" : "패턴 교란"}</small>
              </span>
            )}
            <span className="choice-stakes">
              {Object.entries(choice.effect ?? {})
                .filter(([, value]) => value !== 0)
                .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
                .slice(0, 4)
                .map((entry) => (
                  <b key={entry[0]} className={isChoiceEffectGain(entry[0], entry[1]) ? "positive" : "negative"}>
                    {formatChoiceEffectChip(entry, resourceMeta)}
                  </b>
                ))}
            </span>
            {showTacticalDetails && <span className="choice-action">{getDramaticChoiceLabel(choice)}</span>}
            {showTacticalDetails && <span className="choice-authority-impact">{getChoiceAuthorityImpact(choice)}</span>}
            {!authorityGate.unlocked && <span className="choice-lock">LOCKED: {authorityGate.reason}</span>}
            {!showTacticalDetails && <span className="choice-effect choice-effect-compact">{getChoiceSubtext(choice)}</span>}
            {challengeMatch && <span className="challenge-match">{simplifyPlayerText(challengeMatch)}</span>}
            {showTacticalDetails && (
              <>
                <span className="choice-tactical">
                  <span>
                    <strong>방향 힌트</strong>
                    <small>{pressureHint}</small>
                  </span>
                </span>
                {choiceRead.flowSurge && (
                  <span className="choice-surge">
                    {simplifyPlayerText(choiceRead.flowSurge.label)} · 추가 보정이 붙습니다. 정확한 폭은 선택 후 기록에서 확인합니다.
                  </span>
                )}
                <span className="choice-subtext">{getChoiceSubtext(choice)}</span>
              </>
            )}
            {!showTacticalDetails && (
              <span className="choice-intuition-hint">바로 선택 · 장면 목표를 맞히면 직감 보너스</span>
            )}
          </GuardedButton>
        );
      })}
    </div>
  );
}
