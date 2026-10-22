import { useEffect, useRef, useState } from "react";
import { ChevronRight, Skull, Sparkles, Vault } from "lucide-react";
import { playDecisionRevealCue } from "./AdaptiveMusic.jsx";
import { byEffectWeight, formatNumber, isResourceGain } from "../gameConstants.js";
import { objectParticle, topicParticle } from "../playerLanguage.js";
import { RELICS } from "../gauntlet/relics.js";
import { RelicIcon } from "../gauntlet/RelicDraft.jsx";
import { Prose } from "./Prose.jsx";
import { SceneMinutes } from "./SceneMinutes.jsx";
// formatMultiplier is the table's: this file had a copy that rounded to nearest,
// so a ×1.75 the table printed as "×1.7" was "×1.8" in the heat record a moment later.
import { describeLogicMove, describeNextTable, describeVerdictCause, formatMultiplier } from "../gauntlet/tableReadout.js";
import { isPenaltyMutation } from "../gauntlet/gauntletEngine.js";

function createConsequenceLines({ verdict, busted, nextMutations }) {
  if (!verdict) return [];
  const cause = describeVerdictCause(verdict);
  // The particle agrees with the number as it is read aloud (priority 10).
  const lostPot = formatNumber(verdict.lostPot);
  const wall = String(verdict.wall);
  const heatLine = busted
    ? `열기 ${verdict.gauge} / 벽 ${wall}. 판돈 ${lostPot}${objectParticle(lostPot)} 잃었다.`
    : `열기 ${verdict.gauge}에서 ${formatMultiplier(verdict.multiplier)} 확정. 벽 ${wall}${topicParticle(wall)} 넘기지 않았다.`;
  const nextRule = nextMutations.length > 0
    ? nextMutations.map((mutation) => mutation.label).join(" / ")
    : "기본 규칙으로 복귀";
  const tableLine = describeNextTable(nextMutations, busted);
  // What the card did to the logic streak; nothing where the streak is not in play.
  const logicLine = describeLogicMove(verdict.logic);
  return [
    ["판정 원인", cause],
    ["열기 기록", heatLine],
    ...(logicLine ? [["논리 콤보", logicLine]] : []),
    // B2: this cash made a link (cascadeRisk.js), when the table counts them.
    ...(verdict.link ? [["연결", verdict.link]] : []),
    ...(verdict.relicProcs?.length
      ? [["도구 발동", verdict.relicProcs.map((id) => `${RELICS[id]?.name ?? id}: ${RELICS[id]?.proc ?? ""}`).join(" · ")]]
      : []),
    ["다음 판", tableLine ? `${nextRule}. ${tableLine}` : `${nextRule}.`],
  ];
}

/**
 * Whether 자세히 is open. A season is some 300 reveals, and once every rule of
 * the table has been introduced (`decisionReveal.short`, set by the commit from
 * `isTableTaught`) the same whole sheet each time is the table, the slam and
 * then a page of rows the player has read. So the sheet is short from there:
 * the verdict, the card the room played if it was not the player's, what was
 * received and paid, a scene lost, the next rules, the card's own line, a clue
 * -- and whatever happens once (a relic unlocked, the draft, an overclock). The
 * ledger, the pot's sum, the words of the choice and the closing sentence made
 * from the effect are behind the button, which opens the sheet as it was.
 *
 * It lives here and not in the save or the settings: it is this visit's, like
 * the reveal itself (`runState.js`, never saved). A module variable because the
 * play screen and the report each mount a reveal of their own, and the choice
 * made on one holds on the other.
 */
let detailsOpen = false;
const flipDetails = () => {
  detailsOpen = !detailsOpen;
};

/**
 * The verdict, then the bill, then what broke.
 *
 * This modal used to stack up to seven lime "SURGE" cards over every commit --
 * including a bust -- and never once said the word. It says one thing first
 * now: BUST, or the multiplier that was cashed. Under it, what the pot did,
 * what the card paid and cost, and the rules the next board is dealt with. The
 * last part is the point: the reveal is where the player reads the consequence
 * before they walk into it.
 *
 * Each block is a named group: an `aria-label` on a bare `div` names nothing,
 * because an element with no role has no name to give.
 *
 * The dialog's own name is 판정 결과, not its headline. The table's slam
 * (`VerdictSlam`, TableNotices.jsx) is an alert that has already said the
 * headline -- BUST, or the multiplier -- with the wall and the pot, and a
 * dialog named by the same word had a screen reader say it a second time as
 * focus arrived. The headline is still the sheet's heading, on screen and to
 * a reader that walks the sheet.
 *
 * Focus goes to the way out, which is the sheet's last element, without
 * scrolling to it. `autoFocus` scrolled: on a screen wider than a phone and
 * shorter than the sheet -- a phone on its side -- the reveal opened at its
 * foot, with the verdict it exists to show above the fold.
 */
export function DecisionReveal({ view }) {
  const { decisionReveal, decisionRevealRef, trapDecisionRevealFocus, renderSceneLines, setDecisionReveal, resourceMeta } = view;
  const verdict = decisionReveal?.verdict ?? null;
  const busted = verdict?.outcome === "bust";
  const overclocked = !busted && Boolean(verdict?.nextMutations?.some((mutation) => mutation.id === "overclock"));
  const nextRef = useRef(null);
  const [, redraw] = useState(0);
  useEffect(() => {
    if (decisionReveal) nextRef.current?.focus({ preventScroll: true });
  }, [decisionReveal]);
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
  // The whole sheet: while the case is still introducing rules, and once 자세히 is open.
  const full = !decisionReveal.short || detailsOpen;
  const toggleDetails = () => {
    flipDetails();
    redraw((count) => count + 1);
  };
  const consequenceLines = full ? createConsequenceLines({ verdict, busted, nextMutations }) : [];
  const headline = !verdict
    ? "DECISION"
    : busted
      ? "BUST"
      : `×${verdict.multiplier >= 10 ? Math.floor(verdict.multiplier) : verdict.multiplier}`;
  const subline = !verdict
    ? ""
    : busted
      ? verdict.cause === "timeout"
        ? "시간이 먼저 끝났다. 망설임도 벽이다."
        : verdict.cause === "abandon"
          ? "걸어 둔 판을 두고 테이블을 떠났다. 떠난 판은 벽에 닿은 판으로 친다."
          : `열기 ${verdict.gauge} — 벽은 ${verdict.wall}에 있었다.`
      : `열기 ${verdict.gauge}에서 확정. 벽은 ${verdict.wall}에 있었다.`;

  return (
    <div className={`decision-reveal-backdrop${busted ? " is-bust" : ""}`} role="presentation">
      <section
        ref={decisionRevealRef}
        className={`decision-reveal gx-reveal${busted ? " is-bust" : " is-cashed"}${overclocked ? " is-overdrive" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="판정 결과"
        onKeyDown={trapDecisionRevealFocus}
      >
        <div className="gx-reveal-verdict">
          {busted && <Skull size={34} aria-hidden="true" />}
          <h2>{headline}</h2>
          <p>{subline}</p>
          {/* What the seed still says about this window, and on the close the
              case against a hand that sees the wall (tableAfterword.js). Plain
              text in the sheet, nothing that moves and no voice of its own:
              the slam is the one announcement. */}
          {decisionReveal.afterword && <p data-testid="reveal-afterword">{decisionReveal.afterword}</p>}
          {decisionReveal.caseRead && <p data-testid="reveal-case-read">{decisionReveal.caseRead}</p>}
        </div>

        {decisionReveal.short && (
          <button type="button" className="gx-reveal-more" data-testid="reveal-details" aria-expanded={detailsOpen} onClick={toggleDetails}>
            자세히
          </button>
        )}

        {consequenceLines.length > 0 && (
          <div className="gx-reveal-consequence" data-testid="consequence-ledger" role="group" aria-label="판정 후폭풍">
            {consequenceLines.map(([label, text]) => (
              <article key={label}>
                <span>{label}</span>
                <b>{text}</b>
              </article>
            ))}
          </div>
        )}

        {full && verdict && (
          <div className="gx-reveal-pot" role="group" aria-label="판돈">
            {busted ? (
              <p className="gx-reveal-loss">
                판돈 <b>{formatNumber((verdict.lostPot ?? 0) + (verdict.insuredPot ?? 0))}</b> → <b>{formatNumber(verdict.insuredPot ?? 0)}</b>
              </p>
            ) : (
              <p className="gx-reveal-gain">
                {verdict.chips} × {verdict.multiplier}
                {verdict.logic?.pot > 0 && <span> × 콤보 {verdict.logic.bonus.toFixed(2)}</span>} ={" "}
                <b>+{formatNumber(verdict.pot)}</b>
              </p>
            )}
            <p className="gx-reveal-bank">
              {decisionReveal.caseClosed && verdict.audit?.caught ? (
                // AUDIT (B3): the line says what the audit took of the case's share, in the system's words (no 반재욱 line: user, 2026-10-20).
                <>
                  <Vault size={14} aria-hidden="true" /> 감사 적발: 금고로 갈 <b>{formatNumber(verdict.secured + verdict.audit.lost)}</b> 중{" "}
                  <b>{formatNumber(verdict.audit.lost)}</b> 환수 · 금고 <b>{formatNumber(decisionReveal.vault)}</b>
                </>
              ) : decisionReveal.caseClosed ? (
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

        {decisionReveal.unlockedRelics?.length > 0 && (
          <div className="gx-reveal-unlock" data-testid="relic-unlocked" role="group" aria-label="새로 해금한 도구">
            <span>새 도구 해금</span>
            {decisionReveal.unlockedRelics.map((id) => (
              <b key={id}>
                <RelicIcon id={id} size={16} /> {RELICS[id].label} · {RELICS[id].name}
              </b>
            ))}
            <p>도감에 들어갔다. 이제 사건이 닫힐 때마다 드래프트에 나올 수 있다.</p>
          </div>
        )}

        {verdict?.relicOffer?.length > 0 && (
          <p className="gx-reveal-draft" data-testid="relic-draft-notice">
            사건이 닫혔다. 다음 사건의 첫 테이블에서 도구 {verdict.relicOffer.length}개 중 하나를 고른다.
          </p>
        )}

        {overclockMutation && !busted && (
          <div className="gx-reveal-overdrive" data-testid="overdrive-payout" role="group" aria-label="오버클럭 발동">
            <span>오버클럭 발동</span>
            <b>{overclockMutation.title}</b>
            <p>다음 판은 칩 2배로 시작하지만, 밀기 폭도 커진다. 이 보상은 더 큰 벽을 데려온다.</p>
          </div>
        )}

        {(full || decisionReveal.forced) && (
          <p className="decision-reveal-choice">
            {decisionReveal.forced ? "회의실이 대신 골랐다: " : ""}"{decisionReveal.spokenChoice}"
          </p>
        )}

        <div className="decision-reveal-stakes" role="group" aria-label="선택으로 열린 것과 닫힌 것">
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
          <>
            <p className="gx-reveal-skip" data-testid="blackout-skip">
              <b lang="en">LOST SCENE</b> 회의실은 당신 없이 「{decisionReveal.skippedTitle}」을 넘겼다.
            </p>
            <SceneMinutes nodeId={decisionReveal.skippedNodeId} />
          </>
        )}

        {nextMutations.length > 0 && (
          <div className="gx-reveal-mutations" data-testid="next-mutations" role="group" aria-label="다음 판의 규칙 변화">
            <span>{nextMutations.some(isPenaltyMutation) ? "다음 판이 이렇게 부서진다" : "다음 판의 규칙"}</span>
            <ul>
              {nextMutations.map((mutation) => (
                <li key={mutation.id} className={`gx-mutation mut-${mutation.id}${isPenaltyMutation(mutation) ? "" : " gx-carry"}`}>
                  <b lang="en">{mutation.label}</b>
                  <small>
                    {mutation.title}
                    {mutation.axis ? ` · ${resourceMeta?.[mutation.axis]?.label ?? mutation.axis}` : ""}
                  </small>
                </li>
              ))}
            </ul>
          </div>
        )}

        {(full || decisionReveal.echo) && (
          <div className="decision-reveal-beat">
            {renderSceneLines(decisionReveal.echo || String(decisionReveal.beat ?? "").split("\n").slice(-1).join("\n"))}
          </div>
        )}

        {decisionReveal.clue && (
          <div className="cinematic-clue-card">
            <Sparkles size={18} />
            <div>
              <span>숨은 단서 발견</span>
              <strong>{decisionReveal.clue.title}</strong>
              <p><Prose text={decisionReveal.clue.text} /></p>
            </div>
          </div>
        )}

        <div className="decision-reveal-footer">
          <span>다음 · {decisionReveal.nextTitle}</span>
          <button ref={nextRef} type="button" data-testid="decision-next" onClick={() => setDecisionReveal(null)}>
            {decisionReveal.caseClosed ? "사건 결과" : "다음 판"}
            <ChevronRight size={17} />
          </button>
        </div>
      </section>
    </div>
  );
}
