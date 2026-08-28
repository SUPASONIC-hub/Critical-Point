import React from "react";
import { ChevronRight, Sparkles } from "lucide-react";

export function DecisionReveal({ view }) {
  const { decisionReveal, decisionRevealRef, trapDecisionRevealFocus, renderSceneLines, simplifyPlayerText, setDecisionReveal } = view;
  if (!decisionReveal) return null;
  const revealTone = decisionReveal.clue
    ? "clue-found"
    : decisionReveal.suspenseEvent
      ? "system-alert"
      : decisionReveal.cascade
        ? "chain-reaction"
        : decisionReveal.streakBreak
          ? "streak-break"
        : "decision-locked";
  return (
    <div className="decision-reveal-backdrop" role="presentation">
      <div className={`cinematic-burst ${revealTone}`} aria-hidden="true">
        <div className="cinematic-vignette" />
        <div className="impact-ring" />
        <div className="impact-lines">
          {Array.from({ length: 12 }, (_, index) => <i key={index} style={{ "--line-index": index }} />)}
        </div>
      </div>
      <section
        ref={decisionRevealRef}
        className={`decision-reveal ${revealTone}${decisionReveal.cascade ? " cascade" : ""}${decisionReveal.suspenseEvent ? " suspense-twist" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="decision-reveal-title"
        onKeyDown={trapDecisionRevealFocus}
      >
        <div className="cinematic-status">
          <span className="cinematic-status-dot" />
          <b>{decisionReveal.clue ? "NEW EVIDENCE" : decisionReveal.suspenseEvent ? "SYSTEM ALERT" : decisionReveal.cascade ? "CHAIN REACTION" : decisionReveal.streakBreak ? "STREAK BROKEN" : "DECISION LOCKED"}</b>
          <span>{decisionReveal.clue ? "새 단서가 기록되었습니다" : "선택의 영향이 번지는 중"}</span>
        </div>
        <div className="decision-reveal-kicker">
          <span>{decisionReveal.label}</span>
          {decisionReveal.cascade && <strong>압박 연쇄</strong>}
          {decisionReveal.suspenseEvent && <strong>반전 신호</strong>}
        </div>
        <h2 id="decision-reveal-title">{simplifyPlayerText(decisionReveal.title)}</h2>
        <p className="decision-reveal-choice">"{decisionReveal.spokenChoice}"</p>
        <div className="decision-reveal-beat">
          {renderSceneLines(decisionReveal.beat.split("\n").slice(-3).join("\n"))}
        </div>
        <p className="decision-reveal-consequence">{decisionReveal.consequence}</p>
        {decisionReveal.bonuses?.length > 0 && (
          <div className="decision-bonus-stack" aria-label="이번 선택의 추가 신호와 보너스">
            {decisionReveal.bonuses.map((bonus) => (
              <div className={`decision-bonus ${bonus.tone ?? ""}`} key={bonus.label}>
                <strong>{bonus.label}</strong>
                <span>{bonus.text}</span>
              </div>
            ))}
          </div>
        )}
        {decisionReveal.clue && (
          <div className="cinematic-clue-card">
            <Sparkles size={18} />
            <div>
              <span>숨은 단서 발견</span>
              <strong>{decisionReveal.clue.title}</strong>
              <p>{decisionReveal.clue.text}</p>
            </div>
          </div>
        )}
        <div className="decision-reveal-footer">
          <span>다음 장면 · {decisionReveal.nextTitle}</span>
          <button type="button" data-testid="decision-next" onClick={() => setDecisionReveal(null)} autoFocus>
            다음 장면으로
            <ChevronRight size={17} />
          </button>
        </div>
      </section>
    </div>
  );

}
