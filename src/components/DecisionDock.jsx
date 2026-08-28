import React from "react";
import { LockKeyhole } from "lucide-react";

export function DecisionDock({
  pendingChoice,
  pendingChoiceForecast,
  suspenseTier,
  onCancel,
  onConfirm,
  isAdvancing,
  simplify,
  speechify,
  formatRiskDelta,
}) {
  if (!pendingChoice || !pendingChoiceForecast) return null;

  return (
    <section
      className={`decision-dock ${suspenseTier.toLowerCase()}`}
      aria-label="선택 확정 빠른 실행"
      aria-live="polite"
    >
      <div>
        <span>선택 대기</span>
        <strong>{simplify(speechify(pendingChoice))}</strong>
        <small>
          위험 {formatRiskDelta(pendingChoiceForecast.riskDelta)} · 압력 {pendingChoiceForecast.afterRisk}
        </small>
      </div>
      <div className="decision-dock-actions">
        <button type="button" className="commit-cancel" onClick={onCancel}>
          다시 고르기
        </button>
        <button type="button" className="commit-confirm" onClick={onConfirm} disabled={isAdvancing}>
          <LockKeyhole size={16} />
          기록
        </button>
      </div>
    </section>
  );
}
