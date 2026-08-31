import React from "react";
import { ChevronRight, Sparkles } from "lucide-react";

export function DecisionReveal({ view }) {
  const { decisionReveal, decisionRevealRef, trapDecisionRevealFocus, renderSceneLines, simplifyPlayerText, setDecisionReveal, resourceMeta } = view;
  if (!decisionReveal) return null;
  const effectEntries = Object.entries(decisionReveal.effect ?? {}).filter(([, value]) => value !== 0);
  const gains = effectEntries.filter(([, value]) => value > 0).slice(0, 3);
  const costs = effectEntries.filter(([, value]) => value < 0).slice(0, 3);
  const formatEffect = ([key, value]) => `${resourceMeta?.[key]?.label ?? key} ${value > 0 ? "+" : ""}${value}`;
  const archiveLine = decisionReveal.cascade
    ? "이 선택은 사건 해결 로그가 아니라 허용선 표본으로 보관됩니다."
    : decisionReveal.clue
      ? "단서가 열린 순간, 이전 참가자의 기록과 같은 폴더에 묶였습니다."
      : decisionReveal.streakBreak
        ? "끊긴 연속 기록은 실패가 아니라 다음 압박을 조정하는 근거가 됩니다."
        : "트리거랩은 결과보다 이 말을 고른 순서를 먼저 저장합니다.";
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
        <p className="decision-reveal-archive">{archiveLine}</p>
        {decisionReveal.observerTag && (
          <div className={`decision-observer-tag tag-${decisionReveal.observerTag.id}`}>
            <span>{decisionReveal.observerTag.label}</span>
            <p>{decisionReveal.observerTag.text}</p>
          </div>
        )}
        <div className="decision-reveal-beat">
          {renderSceneLines(decisionReveal.beat.split("\n").slice(-3).join("\n"))}
        </div>
        <div className="decision-reveal-stakes" aria-label="선택으로 열린 것과 닫힌 것">
          <article>
            <span>열린 것</span>
            {gains.length > 0 ? gains.map((entry) => <b key={entry[0]}>{formatEffect(entry)}</b>) : <b>판단 기준이 기록됨</b>}
          </article>
          <article>
            <span>닫힌 것</span>
            {costs.length > 0 ? costs.map((entry) => <b key={entry[0]}>{formatEffect(entry)}</b>) : <b>즉시 닫힌 자원 없음</b>}
          </article>
          <article>
            <span>다음 잔향</span>
            <b>{decisionReveal.nextTitle}</b>
          </article>
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
