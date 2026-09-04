import { LockKeyhole } from "lucide-react";

import { isChoiceEffectGain } from "../viewModels/playChoiceViewModel.js";

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
  if (!pendingChoice || !pendingChoiceRead || !pendingChoiceForecast) return null;
  const observerPreview = getObserverPreviewForChoice(pendingChoice.id);

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
      <details className="commit-console-detail">
        <summary>
          <span>관찰자 반응과 예상 자원</span>
        </summary>
        {observerPreview && (
          <div className="commit-observer-preview">
            <span>{observerPreview.tag.label}</span>
            <p>{observerPreview.text}</p>
          </div>
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
