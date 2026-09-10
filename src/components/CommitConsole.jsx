import { useEffect, useRef } from "react";
import { LockKeyhole } from "lucide-react";

import { playChoicePreviewCue, playTargetLockCue } from "./AdaptiveMusic.jsx";
import { getChoiceTemptation, isChoiceEffectGain } from "../viewModels/playChoiceViewModel.js";

export function CommitConsole({
  suspenseTier,
  commitConsoleRef,
  commitConfirmRef,
  pendingChoice,
  pendingChoiceRead,
  pendingChoiceForecast,
  speechifyChoice,
  formatForecastRisk,
  getObserverPreviewForChoice,
  evidenceCount,
  resourceMeta,
  setPendingChoice,
  choose,
}) {
  // The cue belongs to the console rather than to the runtime: it marks this
  // panel opening, and it has to re-fire when the player stages another choice
  // without closing it first.
  const stagedChoiceId = pendingChoice?.id ?? null;
  const pendingRiskDelta = pendingChoiceForecast?.riskDelta ?? 0;
  const previousStagedChoiceId = useRef(null);
  useEffect(() => {
    if (!stagedChoiceId) {
      previousStagedChoiceId.current = null;
      return;
    }
    if (previousStagedChoiceId.current === null) playTargetLockCue();
    else playChoicePreviewCue(pendingRiskDelta);
    previousStagedChoiceId.current = stagedChoiceId;
  }, [pendingRiskDelta, stagedChoiceId]);

  if (!pendingChoice || !pendingChoiceRead || !pendingChoiceForecast) return null;
  const observerPreview = getObserverPreviewForChoice(pendingChoice.id);
  const targetLock = pendingChoiceRead.targetLock;
  const temptation = getChoiceTemptation(pendingChoice);

  return (
    <section
      ref={commitConsoleRef}
      className={`commit-console ${suspenseTier.toLowerCase()}`}
      aria-label="선택 확정 콘솔"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="commit-console-heading">
        <span>선택 확인</span>
        <strong>이 말을 실제로 남기겠습니까?</strong>
      </div>
      <p className="commit-console-choice">“{speechifyChoice(pendingChoice)}”</p>
      <div className="commit-console-readout">
        <span>
          예상 위험 <b>{formatForecastRisk(pendingChoiceForecast)}</b>
        </span>
        <span>
          압력 <b>{pendingChoiceForecast.afterRisk}</b>
        </span>
      </div>
      <div className="commit-observer-preview">
        <span>CHOICE TEMPTATION · {temptation.label}</span>
        <p>{temptation.text}</p>
      </div>
      {observerPreview && (
        <div className="commit-observer-preview">
          <span>OBSERVER PREVIEW · {observerPreview.tag.label}</span>
          <p>{observerPreview.text}</p>
        </div>
      )}
      {targetLock && (
        <div className="commit-console-readout commit-target-lock" data-testid="commit-target-lock" aria-label="결정 목표 잠금">
          {Object.entries(targetLock).map(([key, item]) => (
            <span key={key} className={`commit-target-lock-row ${item.tone}`}>
              {item.label} <b>{item.value}</b>
            </span>
          ))}
        </div>
      )}
      <details className="commit-console-detail">
        <summary>
          <span>목표 잠금 설명과 관찰자 반응</span>
        </summary>
        {targetLock && (
          <dl className="commit-target-lock-notes">
            {Object.entries(targetLock).map(([key, item]) => (
              <div key={key}>
                <dt>{item.label}</dt>
                <dd>{item.text}</dd>
              </div>
            ))}
          </dl>
        )}
        <div className={`commit-console-effects${evidenceCount < 3 ? " is-hidden" : ""}`} aria-label="예상 자원 변화">
          <span>예상 자원</span>
          {evidenceCount >= 3 &&
            Object.entries(pendingChoiceRead.finalEffect)
              .filter(([, value]) => value !== 0)
              .map(([key, value]) => (
                <b key={key} className={isChoiceEffectGain(key, value) ? "positive" : "negative"}>
                  {resourceMeta[key]?.label ?? key} {value > 0 ? "+" : ""}
                  {value}
                </b>
              ))}
        </div>
      </details>
      <div className="commit-console-actions">
        <button type="button" className="commit-cancel" onClick={() => setPendingChoice(null)}>
          다시 고르기
        </button>
        <button
          ref={commitConfirmRef}
          type="button"
          data-testid="commit-confirm"
          className="commit-confirm"
          onClick={() => choose(pendingChoice)}
        >
          <LockKeyhole size={16} />
          이 선택을 기록한다
        </button>
      </div>
    </section>
  );
}
