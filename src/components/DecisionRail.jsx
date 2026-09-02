
export function DecisionRail({ pendingChoice }) {
  return (
    <div className="decision-rail" aria-label="판단 단계">
      <span className="done">상황 읽기</span>
      <i aria-hidden="true" />
      <span className="active">말 고르기</span>
      <i aria-hidden="true" />
      <span className={pendingChoice ? "active" : "muted"}>기록 확정</span>
    </div>
  );
}
