import React from "react";

export function DecisionRail({ pendingChoice }) {
  return (
    <div className="decision-rail" aria-label="판단 단계">
      <span className="done"><b>01</b> 상황 읽기</span>
      <i aria-hidden="true" />
      <span className="active"><b>02</b> 말 고르기</span>
      <i aria-hidden="true" />
      <span className={pendingChoice ? "active" : "muted"}><b>03</b> 기록 확정</span>
    </div>
  );
}
