import { useEffect } from "react";
import { ChevronRight, Skull, Sparkles, Vault } from "lucide-react";
import { playDecisionRevealCue } from "./AdaptiveMusic.jsx";
import { byEffectWeight, isResourceGain } from "../gameConstants.js";
import { subjectParticle } from "../playerLanguage.js";

function formatNumber(value) {
  return Math.round(Number(value) || 0).toLocaleString("en-US");
}

function formatMultiplier(value) {
  return value >= 10 ? `×${Math.round(value)}` : `×${Number(value || 1).toFixed(1)}`;
}

function createConsequenceLines({ verdict, busted, nextMutations }) {
  if (!verdict) return [];
  const cause =
    verdict.cause === "timeout"
      ? "시계를 방치했다"
      : verdict.cause === "abandon"
        ? "걸어 둔 판을 떠났다"
        : verdict.cause === "push"
          ? "한 번 더 밀었다"
          : "직접 확정했다";
  const heatLine = busted
    ? `열기 ${verdict.gauge} / 벽 ${verdict.wall}. 판돈 ${formatNumber(verdict.lostPot)}을 잃었다.`
    : `열기 ${verdict.gauge}에서 ${formatMultiplier(verdict.multiplier)} 확정. 벽 ${verdict.wall}은 넘기지 않았다.`;
  const nextRule = nextMutations.length > 0
    ? nextMutations.map((mutation) => mutation.label).join(" / ")
    : "기본 규칙으로 복귀";
  const tableLine = busted
    ? "다음 판은 회의실이 깨뜨린 규칙으로 시작한다."
    : verdict.pushes === 0
      ? "너무 일찍 멈춘 대가로 다음 판의 큰 카드가 잠길 수 있다."
      : "이번 열기와 소모가 다음 판의 환경을 다시 계산한다.";
  const tempo = verdict.tempo;
  const beatLine = !tempo || tempo.hits + tempo.slips === 0
    ? null
    : busted
      ? `박자 ${tempo.hits}회 · 헛박자 ${tempo.slips}회. 벽이 콤보 ${tempo.lostCombo}도 가져갔다.`
      : `박자 ${tempo.hits}회(PERFECT ${tempo.perfects}) · 헛박자 ${tempo.slips}회. 콤보 ${tempo.combo}${subjectParticle(String(tempo.combo))} 다음 판으로 이어진다.`;
  return [
    ["판정 원인", cause],
    ["열기 기록", heatLine],
    ...(beatLine ? [["박자 기록", beatLine]] : []),
    ["다음 판", `${nextRule}. ${tableLine}`],
  ];
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
  const overclocked = !busted && Boolean(verdict?.nextMutations?.some((mutation) => mutation.id === "overclock"));
  useEffect(() => {
    if (!decisionReveal) return;
    playDecisionRevealCue(busted ? "system-alert" : overclocked ? "chain-reaction" : decisionReveal.clue ? "clue-found" : "decision-locked");
  }, [busted, decisionReveal, overclocked]);
  if (!decisionReveal) return null;
  const effectEntries = Object.entries(decisionReveal.effect ?? {}).filter(([, value]) => value !== 0);
  const gains = effectEntries.filter(([key, value]) => isResourceGain(key, value)).sort(byEffectWeight).slice(0, 3);
  const costs = effectEntries.filter(([key, value]) => !isResourceGain(key, value)).sort(byEffectWeight).slice(0, 3);
  const formatEffect = ([key, value]) => `${resourceMeta?.[key]?.label ?? key} ${value > 0 ? "+" : ""}${value}`;
  const nextMutations = verdict?.nextMutations ?? [];
  const overclockMutation = nextMutations.find((mutation) => mutation.id === "overclock");
  const consequenceLines = createConsequenceLines({ verdict, busted, nextMutations });
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
        className={`decision-reveal gx-reveal${busted ? " is-bust" : " is-cashed"}${overclocked ? " is-overdrive" : ""}`}
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

        {consequenceLines.length > 0 && (
          <div className="gx-reveal-consequence" data-testid="consequence-ledger" aria-label="판정 후폭풍">
            {consequenceLines.map(([label, text]) => (
              <article key={label}>
                <span>{label}</span>
                <b>{text}</b>
              </article>
            ))}
          </div>
        )}

        {verdict && (
          <div className="gx-reveal-pot" aria-label="판돈">
            {busted ? (
              <p className="gx-reveal-loss">
                판돈 <b>{formatNumber(verdict.lostPot)}</b> → <b>0</b>
              </p>
            ) : (
              <p className="gx-reveal-gain">
                {verdict.chips} × {verdict.multiplier}
                {verdict.tempo?.groovePot > 0 && <span className="gx-reveal-groove"> × GROOVE {verdict.tempo.bonus.toFixed(2)}</span>} ={" "}
                <b>+{formatNumber(verdict.pot)}</b>
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

        {overclockMutation && !busted && (
          <div className="gx-reveal-overdrive" data-testid="overdrive-payout" aria-label="오버클럭 발동">
            <span>OVERCLOCK TRIGGERED</span>
            <b>{overclockMutation.title}</b>
            <p>다음 판은 칩 2배로 시작하지만, 푸시 폭도 커진다. 이 보상은 더 큰 벽을 데려온다.</p>
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
