import { useEffect } from "react";
import { ChevronRight, Skull, Sparkles, Vault } from "lucide-react";
import { playDecisionRevealCue } from "./AdaptiveMusic.jsx";
import { byEffectWeight, isResourceGain } from "../gameConstants.js";

function formatNumber(value) {
  return Math.round(Number(value) || 0).toLocaleString("en-US");
}

/**
 * The verdict, then the bill, then what broke.
 *
 * This modal used to stack up to seven lime "SURGE" cards over every commit --
 * including a bust -- and never once said the word. It says one thing first
 * now: BUST, or the multiplier that was cashed. Under it, what the pot did,
 * what the card paid and cost, and the rules the next board is dealt with. The
 * last part is the point: the reveal is where the player reads the consequence
 * before they walk into it.
 */
export function DecisionReveal({ view }) {
  const { decisionReveal, decisionRevealRef, trapDecisionRevealFocus, renderSceneLines, setDecisionReveal, resourceMeta } = view;
  const verdict = decisionReveal?.verdict ?? null;
  const busted = verdict?.outcome === "bust";
  useEffect(() => {
    if (!decisionReveal) return;
    playDecisionRevealCue(busted ? "system-alert" : decisionReveal.clue ? "clue-found" : "decision-locked");
  }, [busted, decisionReveal]);
  if (!decisionReveal) return null;
  const effectEntries = Object.entries(decisionReveal.effect ?? {}).filter(([, value]) => value !== 0);
  const gains = effectEntries.filter(([key, value]) => isResourceGain(key, value)).sort(byEffectWeight).slice(0, 3);
  const costs = effectEntries.filter(([key, value]) => !isResourceGain(key, value)).sort(byEffectWeight).slice(0, 3);
  const formatEffect = ([key, value]) => `${resourceMeta?.[key]?.label ?? key} ${value > 0 ? "+" : ""}${value}`;
  const nextMutations = verdict?.nextMutations ?? [];
  const headline = !verdict
    ? "DECISION"
    : busted
      ? "BUST"
      : `×${verdict.multiplier >= 10 ? Math.round(verdict.multiplier) : verdict.multiplier}`;
  const subline = !verdict
    ? ""
    : busted
      ? verdict.cause === "timeout"
        ? "시간이 먼저 끝났다. 망설임도 벽이다."
        : verdict.cause === "abandon"
          ? "걸어 둔 판을 두고 테이블을 떠났다. 떠난 판은 터진 판이다."
          : `열기 ${verdict.gauge} — 벽은 ${verdict.wall}에 있었다.`
      : `열기 ${verdict.gauge}에서 확정. 벽은 ${verdict.wall}에 있었다.`;

  return (
    <div className={`decision-reveal-backdrop${busted ? " is-bust" : ""}`} role="presentation">
      <section
        ref={decisionRevealRef}
        className={`decision-reveal gx-reveal${busted ? " is-bust" : " is-cashed"}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="decision-reveal-title"
        onKeyDown={trapDecisionRevealFocus}
      >
        <div className="gx-reveal-verdict">
          {busted && <Skull size={34} aria-hidden="true" />}
          <h2 id="decision-reveal-title">{headline}</h2>
          <p>{subline}</p>
        </div>

        {verdict && (
          <div className="gx-reveal-pot" aria-label="판돈">
            {busted ? (
              <p className="gx-reveal-loss">
                판돈 <b>{formatNumber(verdict.lostPot)}</b> → <b>0</b>
              </p>
            ) : (
              <p className="gx-reveal-gain">
                {verdict.chips} × {verdict.multiplier} = <b>+{formatNumber(verdict.pot)}</b>
              </p>
            )}
            <p className="gx-reveal-bank">
              {decisionReveal.caseClosed ? (
                <>
                  <Vault size={14} aria-hidden="true" /> 금고로 이동 <b>{formatNumber(verdict.secured)}</b> · 금고{" "}
                  <b>{formatNumber(decisionReveal.vault)}</b>
                </>
              ) : (
                <>
                  걸려 있는 판돈 <b>{formatNumber(decisionReveal.runPot)}</b> · 금고 <b>{formatNumber(decisionReveal.vault)}</b>
                </>
              )}
            </p>
          </div>
        )}

        <p className="decision-reveal-choice">
          {decisionReveal.forced ? "회의실이 대신 골랐다: " : ""}"{decisionReveal.spokenChoice}"
        </p>

        <div className="decision-reveal-stakes" aria-label="선택으로 열린 것과 닫힌 것">
          <article>
            <span>받은 것</span>
            {gains.length > 0 ? gains.map((entry) => <b key={entry[0]}>{formatEffect(entry)}</b>) : <b>{busted ? "없음 — 벽이 가져갔다" : "없음"}</b>}
          </article>
          <article>
            <span>치른 것</span>
            {costs.length > 0 ? costs.map((entry) => <b key={entry[0]}>{formatEffect(entry)}</b>) : <b>없음</b>}
          </article>
        </div>

        {decisionReveal.skippedTitle && (
          <p className="gx-reveal-skip" data-testid="blackout-skip">
            <b>LOST SCENE</b> 회의실은 당신 없이 「{decisionReveal.skippedTitle}」을 넘겼다.
          </p>
        )}

        {nextMutations.length > 0 && (
          <div className="gx-reveal-mutations" data-testid="next-mutations" aria-label="다음 판의 규칙 변화">
            <span>다음 판이 이렇게 부서진다</span>
            <ul>
              {nextMutations.map((mutation) => (
                <li key={mutation.id} className={`gx-mutation mut-${mutation.id}`}>
                  <b>{mutation.label}</b>
                  <small>
                    {mutation.title}
                    {mutation.axis ? ` · ${resourceMeta?.[mutation.axis]?.label ?? mutation.axis}` : ""}
                  </small>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="decision-reveal-beat">
          {renderSceneLines(String(decisionReveal.beat ?? "").split("\n").slice(-1).join("\n"))}
        </div>

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
          <span>다음 · {decisionReveal.nextTitle}</span>
          <button type="button" data-testid="decision-next" onClick={() => setDecisionReveal(null)} autoFocus>
            {decisionReveal.caseClosed ? "사건 결과" : "다음 판"}
            <ChevronRight size={17} />
          </button>
        </div>
      </section>
    </div>
  );
}
