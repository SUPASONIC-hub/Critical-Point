import { AlertTriangle, ChevronRight, Download, FileText, Link2, RefreshCcw, Trophy } from "lucide-react";
import { EndingSequence } from "../components/EndingSequence.jsx";
import { ReportArchive } from "./ReportArchive.jsx";
import * as endingCopy from "../endingCopy.js";

export function ResultScreen({ view, renderers, sceneTitleRef: titleRef, shortcuts }) {
  const {
    common: { AdaptiveMusic, musicModeKey, screenReaderStatus, currentCase, GAME_TITLE, playerName, activeCaseMeta },
    ending: {
      endingStep, endingTwistIndex, finalAftermathEntry, finalEndingEntry, endingProfile, endingVariant,
      advanceEndingStep, endingQuietReady, nextParticipantMessage, setNextParticipantMessage,
      saveNextParticipantMessage, unopenedRecordCount, unopenedClueCount, unopenedBranchCount, endingQuietLine,
      skipEndingQuietHold, endingSceneProfile,
    },
    score: {
      decisionFingerprint, observationLedger, observerPattern, triggerLabels, result,
      caseOutcome, resultRank, momentumTier, momentumScore, rankLine, scoreBreakdown, clamp,
      counterfactualReport, routeTimeline,
    },
    actions: { startCase, setStarted, setShowRanking, showSeasonMap, exportPlaytestLog, copyReplayLink, reset, nextCaseSignal, resultBridge },
    debug: { debugToolsEnabled, showErrorLog, setShowErrorLog },
  } = view;
  const { renderDecisionReveal, renderRecoveryNotice, renderErrorLogPanel } = renderers;
  // R and N are the runtime's keys (useRuntimeChoiceShortcuts), and it says
  // whether the page may name them: not when the player turned them off.
  const { letterKeys, keys } = shortcuts;
  const finalChoiceText = finalAftermathEntry?.choice || finalEndingEntry?.choice || "당신이 남긴 마지막 판단";
  const firstRouteEntry = routeTimeline[0]; const longestRouteEntry = [...routeTimeline].sort((a, b) => (b.responseTimeSec ?? 0) - (a.responseTimeSec ?? 0))[0]; const costliestAlternative = counterfactualReport.find((report) => !report.actualWasSafest)?.costliest?.label;
  const branchRouteEntry = [...routeTimeline].reverse().find((entry) => entry.reframeOpenedRoute || entry.reframeBranchId);
  const dominantObservation = Object.entries(observationLedger).sort((a, b) => b[1] - a[1])[0] ?? ["compliance", 0];
  const observerEndingRecord = observerPattern?.endingRecord ?? endingCopy.fallbackObserverEndingRecord;
  const judgmentProfile = { label: observerEndingRecord.label.replace(" 표본", "형"), text: observerPattern?.arc?.text ?? observerEndingRecord.text };
  const seasonRecordNotice = endingCopy.getSeasonRecordNotice({ nextCaseId: nextCaseSignal?.caseId, ...view.telemetry });
  const finalVerdict = endingCopy.getFinalVerdict({ endingVariant, finalChoiceId: finalEndingEntry?.choiceId, endingSceneChoice: endingSceneProfile?.choice });
  const endingTwists = [
    {
      label: "판정",
      title: finalVerdict.title,
      evidence: endingVariant?.label ?? endingProfile.tag,
      copy: finalVerdict.ruling,
    },
    {
      label: "집행",
      title: endingCopy.endingTwistTitles.execution,
      evidence: finalChoiceText,
      copy: finalVerdict.execution,
    },
    {
      label: "대가",
      title: endingCopy.endingTwistTitles.cost,
      evidence: endingSceneProfile?.location ?? `${endingCopy.observationLabels[dominantObservation[0]]} 관찰값이 가장 크게 남았다`,
      copy: finalVerdict.cost,
    },
  ];
  const currentEndingTwist = endingTwists[endingTwistIndex] ?? endingTwists[0];
  const endingTwistCount = endingTwists.length;
  const isFinalEndingTwist = endingTwistIndex >= endingTwistCount - 1;
  const endingAxes = [
    { ...endingCopy.endingAxisCopy[0], value: Math.min(100, Math.round((result.pressureAdaptScore ?? 0) * 0.7 + (result.reducedRiskCount ?? 0) * 10)) },
    { ...endingCopy.endingAxisCopy[1], value: Math.min(100, Math.round((result.reflectionScore ?? 0) * 0.8 + (result.reframeCount ?? 0) * 8)) },
    { ...endingCopy.endingAxisCopy[2], value: Math.min(100, Math.round((result.cognitionScore ?? 0) * 0.7 + (observerPattern?.turningPoint ? 24 : 0))) },
  ];
  // The doors this run walked past, named. The counts alone ("기록 3개 미열람")
  // are not a reason to play again; a scene title and the lens that was not
  // taken is. Sorted by the report's own order, which is the route's order.
  const unopenedDoors = counterfactualReport
    .filter((report) => !report.actualWasSafest)
    .slice(0, 3)
    .map((report) => ({
      nodeId: report.nodeId,
      title: report.title,
      label: `가지 않은 길: ${report.costliest.label}`,
    }));
  const witnessRecords = [
    firstRouteEntry && { id: "first", label: "처음 남긴 말", tag: firstRouteEntry.observerTag?.label, text: firstRouteEntry.spokenChoice || firstRouteEntry.choice },
    longestRouteEntry && { id: "longest", label: "가장 오래 붙잡은 말", tag: longestRouteEntry.observerTag?.label, text: longestRouteEntry.spokenChoice || longestRouteEntry.choice },
    branchRouteEntry && { id: "branch", label: "판을 흔든 말", tag: branchRouteEntry.observerTag?.label, text: branchRouteEntry.spokenChoice || branchRouteEntry.choice },
  ].filter(Boolean);
  const endingAfterglow = endingCopy.getEndingAfterglow(dominantObservation[0]);
  return (
      <main className={`shell ${currentCase === "final" ? "ending-shell" : ""}`}>
        <AdaptiveMusic modeKey={musicModeKey} />
        {renderDecisionReveal()}
        {renderRecoveryNotice()}
        {renderErrorLogPanel()}
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {screenReaderStatus}
        </p>
        {currentCase === "final" && (
          <EndingSequence
            endingStep={endingStep}
            endingTwistIndex={endingTwistIndex}
            endingTwistCount={endingTwistCount}
            currentEndingTwist={currentEndingTwist}
            finalChoiceText={finalChoiceText}
            isFinalEndingTwist={isFinalEndingTwist}
            witnessRecords={witnessRecords}
            observerEndingRecord={observerEndingRecord}
            advanceEndingStep={advanceEndingStep}
            endingQuietLine={endingQuietLine}
            endingQuietReady={endingQuietReady}
            skipEndingQuietHold={skipEndingQuietHold}
            nextParticipantMessage={nextParticipantMessage}
            setNextParticipantMessage={setNextParticipantMessage}
            saveNextParticipantMessage={saveNextParticipantMessage}
            endingAfterglow={endingAfterglow}
            unopenedRecordCount={unopenedRecordCount}
            unopenedClueCount={unopenedClueCount}
            unopenedBranchCount={unopenedBranchCount}
            endingAtmosphere={view.endingAtmosphere}
            endingVisualClass={view.endingVisualClass}
            endingImage={endingSceneProfile?.image ?? "/ending-final-archive.webp"}
            reportTitleRef={titleRef}
          />
        )}
        <section className={`result-page ${currentCase === "final" && endingStep < 3 ? "final-report-locked" : ""}`}>
          <div className="topbar">
            <span className="brand-mark">{GAME_TITLE}</span>
            <div className="top-actions">
              <button type="button" className="ghost replay-case-button" onClick={() => startCase(currentCase)} aria-keyshortcuts={keys("R")}>
                <RefreshCcw size={16} />
                {letterKeys && <kbd className="shortcut-hint" aria-hidden="true">R</kbd>}
                이 사건 다시 도전
              </button>
              <button type="button" className="ghost" onClick={() => { setStarted(false); setShowRanking(true); }}>
                <Trophy size={16} />
                랭킹
              </button>
              <button type="button" className="ghost" onClick={showSeasonMap}>
                <FileText size={16} />
                시즌 로드맵
              </button>
              <button className="ghost" type="button" onClick={copyReplayLink}>
                <Link2 size={16} />
                리플레이 링크
              </button>
              {__CP_DEBUG_BUILD__ && debugToolsEnabled && (
                <button
                  type="button"
                  className="ghost"
                  aria-expanded={showErrorLog}
                  aria-controls={showErrorLog ? "error-log-panel" : undefined}
                  onClick={() => setShowErrorLog(true)}
                >
                  <AlertTriangle size={16} />
                  에러 로그
                </button>
              )}
              <button className="ghost" type="button" data-testid="export-play-log" onClick={() => exportPlaytestLog()}>
                <Download size={16} />
                공유 요약
              </button>
              {__CP_DEBUG_BUILD__ && debugToolsEnabled && (
                <button
                  className="ghost"
                  type="button"
                  data-testid="export-diagnostic-log"
                  onClick={() => {
                    if (
                      typeof globalThis.confirm === "function" &&
                      !globalThis.confirm("진단 로그에는 원문 선택 로그, 피드백 원문, 에러 stack, DOM 스냅샷, 복구 슬롯이 포함됩니다. 내보낼까요?")
                    ) {
                      return;
                    }
                    exportPlaytestLog({ includeDiagnostics: true });
                  }}
                >
                  <Download size={16} />
                  진단 로그
                </button>
              )}
              {/* Not "다시 플레이": beside 이 사건 다시 도전 and 이 사건을 다시 열기
                  that read as a third way to retry a case, and it is the one
                  that throws the whole season away. */}
              <button type="button" className="ghost season-reset-button" onClick={reset}>
                <RefreshCcw size={16} />
                시즌 처음부터 다시
              </button>
            </div>
          </div>
          {/* One composed header: whose record this is, what it found, the
              grade it earned and the profile it files the player under. The
              eyebrow used to open on a bare possessive when no name was set. */}
          <div className={`result-hero rank-${resultRank.toLowerCase()}`}>
            <div className="result-hero-copy">
              <p>{activeCaseMeta?.label} · {playerName?.trim() ? `${playerName.trim()} 분석관` : "익명 분석관"}의 생각 활성 프로필</p>
              <h1 ref={titleRef} tabIndex={-1}>
                {currentCase === "final" ? "이제 당신은 자신의 조건을 어떻게 쓸지 선택해야 합니다." : <><em>{triggerLabels[result.primary[0]]}</em> 조건에서 생각이 가장 오래 유지됐습니다.</>}
              </h1>
              <section className="outcome-panel judgment-profile-panel" aria-label="판단 프로필">
                <div><span lang="en">JUDGMENT PROFILE</span><strong>{judgmentProfile.label}</strong></div>
                <p>{judgmentProfile.text}</p>
                <small>{view.delayedConsequences?.at(-1)?.text ?? (costliestAlternative ? `가장 무거운 대안: ${costliestAlternative}` : observerEndingRecord.title)}</small>
              </section>
            </div>
            <div className="rank-mark" style={{ "--rank-score": `${clamp(momentumScore, 0, 100)}%` }}>
              <span lang="en">CASE RANK</span>
              <strong>{resultRank}</strong>
              <small>{momentumTier} · {momentumScore} POINTS</small>
            </div>
          </div>
          <section className="outcome-panel" aria-label="내가 만든 결말">
            <div className="outcome-panel-mark">
              <span lang="en">YOUR CONSEQUENCE</span>
              <strong>{caseOutcome.tag}</strong>
            </div>
            <div>
              <h2>{caseOutcome.title}</h2>
              <p>{caseOutcome.text}</p>
            </div>
          </section>
          {/* The pause. No bet, no clock, no choice -- six cases of crisis in one
              register is a hard read, and this is the one beat where the analyst
              is a person rather than a decision. */}
          {nextCaseSignal?.interlude && (
            <section className={`interlude-panel mood-${nextCaseSignal.interlude.mood}`} aria-label="막간">
              <span>{nextCaseSignal.interlude.label}</span>
              <h2>{nextCaseSignal.interlude.title}</h2>
              {[nextCaseSignal.interlude.text].flat().map((line) => <p key={line}>{line}</p>)}
            </section>
          )}
          {nextCaseSignal && (
            <section className="next-case-panel">
              <div>
                <span>{nextCaseSignal.eyebrow} · CONTAMINATED BY YOUR LAST STANDARD</span>
                <h2>{nextCaseSignal.title}</h2>
                {nextCaseSignal.movement && (
                  <p className="next-case-movement">
                    <b>{nextCaseSignal.movement}</b>
                    <span>{nextCaseSignal.reason}</span>
                  </p>
                )}
                <p>{nextCaseSignal.premise}</p>
                <p className="next-case-hook">{nextCaseSignal.hook}</p>
                {seasonRecordNotice && <p data-testid="season-record-notice">{seasonRecordNotice}</p>}
                <small>{resultBridge}</small>
              </div>
              <button type="button" onClick={() => startCase(nextCaseSignal.caseId)} aria-keyshortcuts={keys("N")}>
                <ChevronRight size={18} />{letterKeys && <kbd className="shortcut-hint" aria-hidden="true">N</kbd>}
                {nextCaseSignal.button}
              </button>
            </section>
          )}
          {currentCase === "final" && endingVariant && (
            <section className={`ending-variant-panel ${endingVariant.failure ? "failure" : ""}`} aria-label="결말 변형">
              <span>{endingVariant.label}</span>
              <h2>{endingVariant.title}</h2>
              <p>{endingVariant.text}</p>
              <small>{endingVariant.failure ? "자원 관리 실패가 기록되었습니다. 다음 플레이에서는 압박을 분산하십시오." : "이 결말은 단서, 관계, 자원 조합에 따라 달라집니다."}</small>
            </section>
          )}
          {currentCase === "final" && view.endingEpilogue && (
            <section className="ending-epilogue-panel" aria-label="엔딩 에필로그">
              <span lang="en">AFTER THE RECORD</span>
              <p>{view.endingEpilogue}</p>
            </section>
          )}
          {currentCase === "final" && view.failureRecovery && (
            <section className="failure-recovery-panel" aria-label="실패 복구 경로">
              <strong>{view.failureRecovery.title}</strong>
              <p>{view.failureRecovery.text}</p>
            </section>
          )}
          <section className={`rank-panel rank-${resultRank.toLowerCase()}`}>
            <div className="rank-copy">
              <span>SCORE BREAKDOWN · {momentumScore} POINTS</span>
              <h2>{rankLine}</h2>
              <p>다음 케이스는 이 랭크보다 트리거 분포를 더 중요하게 사용합니다. 랭크는 정답 여부보다 생각이 정밀하게 솟은 조건을 비교하는 플레이 지표입니다.</p>
            </div>
            <div className="score-breakdown">
              {scoreBreakdown.map((item) => (
                <article key={item.label}>
                  <span>{item.label}</span>
                  <b>{item.text}</b>
                  <small>{item.note}</small>
                  <div>
                    <i style={{ width: `${clamp(item.value, item.value > 0 ? 14 : 4, 100)}%` }} />
                  </div>
                </article>
              ))}
            </div>
          </section>
          {/* Act two. The report used to answer "why" in twenty-five named
              regions spread over 10,616px; these are the three answers a player
              actually leaves with, and the archive below keeps the rest. */}
          <section className="result-why" aria-label="왜 이렇게 됐나">
            <div className="panel-title-row">
              <h2>왜 이렇게 됐나</h2>
              <span>이번 판을 결정한 세 가지</span>
            </div>
            <div className="result-why-grid">
              <article>
                <span>결말을 정한 축</span>
                <strong>{endingAxes[0]?.label ?? "기록 부족"}</strong>
                <p>{endingAxes[0]?.text ?? "선택이 더 쌓이면 축이 갈립니다."}</p>
              </article>
              <article>
                <span>당신이 반복한 방식</span>
                <strong>{decisionFingerprint.modeTitle}</strong>
                <p>{view.endingCause ? view.endingCause.text : decisionFingerprint.modeText}</p>
              </article>
              <article className="result-why-doors">
                <span>열지 않은 문</span>
                <strong>{unopenedRecordCount}개</strong>
                {unopenedDoors.length > 0 ? (
                  <ul>
                    {unopenedDoors.map((door) => (
                      <li key={door.nodeId}>
                        <b>{door.title}</b>
                        <small>{door.label}</small>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>단서 {unopenedClueCount}개와 분기 {unopenedBranchCount}개가 아직 기록에 없습니다.</p>
                )}
                <button type="button" className="ghost" onClick={() => startCase(currentCase)}>
                  이 사건을 다시 열기
                </button>
              </article>
            </div>
          </section>
          {/* Act three. Everything the report used to open with. */}
          <ReportArchive view={view} observerEndingRecord={observerEndingRecord} endingAxes={endingAxes} observationLabels={endingCopy.observationLabels} />
        </section>
      </main>
);
}
