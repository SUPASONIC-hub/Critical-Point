import { ChevronRight, Download, FileText, Link2, RefreshCcw, TriangleAlert, Trophy } from "lucide-react";
import { EndingSequence } from "../components/EndingSequence.jsx";
import { ReportArchive } from "./ReportArchive.jsx";
import * as endingCopy from "../endingCopy.js";
import resultCopy from "../copy/result.js";
import { fill } from "../locale.js";

export function ResultScreen({ view, renderers, sceneTitleRef: titleRef, shortcuts }) {
  const {
    common: { AdaptiveMusic, musicModeKey, screenReaderStatus, currentCase, GAME_TITLE, playerName, activeCaseMeta },
    ending: {
      endingStep, endingTwistIndex, finalAftermathEntry, finalEndingEntry, endingVariant,
      advanceEndingStep, endingQuietReady, nextParticipantMessage, setNextParticipantMessage,
      saveNextParticipantMessage, unopenedRecordCount, unopenedClueCount, unopenedBranchCount, endingQuietLine,
      skipEndingQuietHold, endingSceneProfile,
    },
    score: {
      decisionFingerprint, decisionFingerprint: fingerprint, observationLedger, observerPattern, triggerLabels, result,
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
  // Read without fallbacks: a run always has a pattern with its record and its
  // arc, a ledger of four reactions, an ending and that ending's scene
  // (getObserverPattern, getObservationLedger, getEndingVariant in gameLogic.js;
  // getEndingSceneProfile in runtimeSystems.js). tests/unit/report-copy.test.mjs.
  const observerEndingRecord = observerPattern.endingRecord;
  const judgmentProfile = { label: observerEndingRecord.label.replace(" 표본", "형"), text: observerPattern.arc.text };
  const seasonRecordNotice = endingCopy.getSeasonRecordNotice({ nextCaseId: nextCaseSignal?.caseId, ...view.telemetry });
  const finalVerdict = endingCopy.getFinalVerdict({ endingVariant, finalChoiceId: finalEndingEntry?.choiceId, endingSceneChoice: endingSceneProfile.choice });
  const endingTwists = [
    {
      label: "판정",
      title: finalVerdict.title,
      evidence: endingVariant.label,
      copy: finalVerdict.ruling,
    },
    {
      label: "집행",
      title: endingCopy.endingTwistTitles.execution,
      evidence: finalEndingEntry?.choice || finalChoiceText,
      copy: finalVerdict.execution,
    },
    {
      label: "대가",
      title: endingCopy.endingTwistTitles.cost,
      evidence: endingSceneProfile.location,
      copy: finalVerdict.cost,
    },
  ];
  // The index stops at the last of the three (TWIST_COUNT, useEndingSequence.js).
  const currentEndingTwist = endingTwists[endingTwistIndex]; const endingTwistCount = endingTwists.length;
  const isFinalEndingTwist = endingTwistIndex >= endingTwistCount - 1;
  const endingAxes = [
    { ...endingCopy.endingAxisCopy[0], value: Math.min(100, Math.round((result.pressureAdaptScore ?? 0) * 0.7 + (result.reducedRiskCount ?? 0) * 10)) },
    { ...endingCopy.endingAxisCopy[1], value: Math.min(100, Math.round((result.reflectionScore ?? 0) * 0.8 + (result.reframeCount ?? 0) * 8)) },
    { ...endingCopy.endingAxisCopy[2], value: Math.min(100, Math.round((result.cognitionScore ?? 0) * 0.7 + (observerPattern.turningPoint ? 24 : 0))) },
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
      label: fill(resultCopy.why.untakenRoad, { label: report.costliest.label }),
    }));
  const witnessRecords = [
    firstRouteEntry && { id: "first", label: "처음 내린 판단", tag: firstRouteEntry.observerTag?.label, text: firstRouteEntry.spokenChoice || firstRouteEntry.choice },
    longestRouteEntry && { id: "longest", label: "가장 오래 붙잡은 판단", tag: longestRouteEntry.observerTag?.label, text: longestRouteEntry.spokenChoice || longestRouteEntry.choice },
    branchRouteEntry && { id: "branch", label: "판을 흔든 판단", tag: branchRouteEntry.observerTag?.label, text: branchRouteEntry.spokenChoice || branchRouteEntry.choice },
  ].filter(Boolean);
  const endingAfterglow = endingCopy.getEndingAfterglow(observationLedger);
  const analystName = playerName?.trim() ? fill(resultCopy.namedAnalyst, { name: playerName.trim() }) : resultCopy.anonymousAnalyst;
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
            endingImage={endingSceneProfile.image}
            reportTitleRef={titleRef} seasonRecord={{ caseResults: view.score.caseResults, log: view.score.log }}
            // The four things a card is made from, and nothing that says who played.
            card={{ fingerprint, endingVariant: view.endingCause?.cardEnding ?? endingVariant, endingName: view.endingPreview?.label, caseResults: view.score.caseResults, vaultLine: view.score.vaultLine, season: view.seasonCard.season, share: view.seasonCard.share }}
          />
        )}
        <section className={`result-page ${currentCase === "final" && endingStep < 3 ? "final-report-locked" : ""}`}>
          <div className="topbar">
            <span className="brand-mark">{GAME_TITLE}</span>
            <div className="top-actions">
              <button type="button" className="ghost replay-case-button" onClick={() => startCase(currentCase)} aria-keyshortcuts={keys("R")}>
                <RefreshCcw size={16} />
                {letterKeys && <kbd className="shortcut-hint" aria-hidden="true">R</kbd>}
                {resultCopy.replayCase}
              </button>
              <button type="button" className="ghost" onClick={() => { setStarted(false); setShowRanking(true); }}>
                <Trophy size={16} />
                {resultCopy.ranking}
              </button>
              <button type="button" className="ghost" onClick={showSeasonMap}>
                <FileText size={16} />
                {resultCopy.seasonRoadmap}
              </button>
              <button className="ghost" type="button" onClick={copyReplayLink}>
                <Link2 size={16} />
                {resultCopy.replayLink}
              </button>
              {__CP_DEBUG_BUILD__ && debugToolsEnabled && (
                <button
                  type="button"
                  className="ghost"
                  aria-expanded={showErrorLog}
                  aria-controls={showErrorLog ? "error-log-panel" : undefined}
                  onClick={() => setShowErrorLog(true)}
                >
                  <TriangleAlert size={16} />
                  에러 로그
                </button>
              )}
              <button className="ghost" type="button" data-testid="export-play-log" onClick={() => exportPlaytestLog()}>
                <Download size={16} />
                {resultCopy.shareSummary}
              </button>
              {__CP_DEBUG_BUILD__ && debugToolsEnabled && (
                <button
                  className="ghost"
                  type="button"
                  data-testid="export-diagnostic-log"
                  onClick={() => {
                    if (typeof globalThis.confirm === "function" && !globalThis.confirm("진단 로그에는 원문 선택 로그, 피드백 원문, 에러 stack, DOM 스냅샷, 복구 슬롯이 포함됩니다. 내보낼까요?")) return;
                    exportPlaytestLog({ includeDiagnostics: true });
                  }}
                >
                  <Download size={16} />
                  진단 로그
                </button>
              )}
              {/* 초기화, the name the play header gives the same season wipe; not
                  "다시 플레이", which beside 이 사건 다시 도전 (this page's one name
                  for a retry) read as another way to retry. */}
              <button type="button" className="ghost season-reset-button" onClick={reset}>
                <RefreshCcw size={16} />
                {resultCopy.reset}
              </button>
            </div>
          </div>
          <section className="outcome-panel" aria-label={resultCopy.outcomeLabel}>
            <div className="outcome-panel-mark">
              <span lang="en">YOUR CONSEQUENCE</span>
              <strong>{caseOutcome.tag}</strong>
            </div>
            <div>
              <h2 ref={titleRef} tabIndex={-1}>{caseOutcome.title}</h2>
              <p>{caseOutcome.text}</p>{caseOutcome.past && <p data-testid="case-past">{caseOutcome.past}</p>}
              <p className={`season-standing ${view.seasonStanding.level}`} data-testid="season-standing"><b>{view.seasonStanding.mark} {view.seasonStanding.label}</b> {view.seasonStanding.text}</p>
            </div>
          </section>
          {/* The pause. No bet, no clock, no choice -- six cases of crisis in one
              register is a hard read, and this is the one beat where the analyst
              is a person rather than a decision. */}
          {nextCaseSignal?.interlude && (
            <section className={`interlude-panel mood-${nextCaseSignal.interlude.mood}`} aria-label={resultCopy.interludeLabel}>
              <span>{nextCaseSignal.interlude.label}</span>
              <h2>{nextCaseSignal.interlude.title}</h2>
              {[nextCaseSignal.interlude.text].flat().map((line) => <p key={line}>{line}</p>)}
            </section>
          )}
          {nextCaseSignal && (
            <section className="next-case-panel">
              <div>
                <span>{nextCaseSignal.eyebrow} · <span lang="en">CONTAMINATED BY YOUR LAST STANDARD</span></span>
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
          {currentCase === "final" && (
            <section className={`ending-variant-panel ${endingVariant.failure ? "failure" : ""}`} aria-label={resultCopy.endingVariantLabel}>
              <span>{endingVariant.label}</span>
              <h2>{endingVariant.title}</h2>
              <p>{endingVariant.text}</p>
              <small>{endingVariant.failure ? view.endingCause.toll : resultCopy.endingVariantNote}</small>{view.seasonCard.comparison && <small data-testid="season-comparison">{view.seasonCard.comparison}</small>}
            </section>
          )}
          {currentCase === "final" && (
            <section className="ending-epilogue-panel" aria-label={resultCopy.epilogueLabel}>
              <span lang="en">AFTER THE RECORD</span>
              <p>{view.endingEpilogue}</p>
            </section>
          )}
          {currentCase === "final" && view.logicReport && (
            <section className="ending-epilogue-panel" aria-label={view.logicReport.label} data-testid="logic-report">
              <span lang="en">{view.logicReport.mark}</span>{view.logicReport.lines.map((line) => <p key={line}>{line}</p>)}
            </section>
          )}
          {currentCase === "final" && view.failureRecovery && (
            <section className="failure-recovery-panel" aria-label={resultCopy.failureRecoveryLabel}>
              <strong>{view.failureRecovery.title}</strong>
              <p>{view.failureRecovery.text}</p>
            </section>
          )}
          {/* One composed header: whose record this is, its grade and profile.
              After the story since 2026-10-22 (D-10): the ending, the interlude
              and the next case first, then who the player was, then the score. */}
          <div className={`result-hero rank-${resultRank.toLowerCase()}`}>
            <div className="result-hero-copy">
              <p>{fill(resultCopy.profileLine, { caseLabel: activeCaseMeta?.label ?? "", analyst: analystName })}{view.score.caseResults[currentCase]?.assistStory && resultCopy.storyRunMark}</p>
              <h1>
                {currentCase === "final" ? resultCopy.finalHeadline : <><em>{triggerLabels[result.primary[0]]}</em>{resultCopy.caseHeadlineTail}</>}
              </h1>
              <section className="outcome-panel judgment-profile-panel" aria-label={resultCopy.judgmentProfileLabel}>
                <div><span lang="en">JUDGMENT PROFILE</span><strong>{judgmentProfile.label}</strong></div>
                <p>{judgmentProfile.text}</p>
                <small>{view.delayedConsequences?.at(-1)?.text ?? (costliestAlternative ? fill(resultCopy.costliestAlternative, { label: costliestAlternative }) : observerEndingRecord.title)}</small>
              </section>
            </div>
            <div className="rank-mark" style={{ "--rank-score": `${clamp(momentumScore, 0, 100)}%` }}>
              <span lang="en">CASE RANK</span>
              <strong>{resultRank}</strong>
              <small lang="en">{momentumTier} · {momentumScore} POINTS</small>
            </div>
          </div>
          <section className={`rank-panel rank-${resultRank.toLowerCase()}`}>
            <div className="rank-copy">
              <span lang="en">SCORE BREAKDOWN · {momentumScore} POINTS</span>
              <h2>{rankLine}</h2>
              <p>{currentCase !== "final" && resultCopy.rankCarryNote}{resultCopy.rankNote}</p>
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
          <section className="result-why" aria-label={resultCopy.why.title}>
            <div className="panel-title-row">
              <h2>{resultCopy.why.title}</h2>
              <span>{resultCopy.why.subtitle}</span>
            </div>
            <div className="result-why-grid">
              <article>
                <span>{resultCopy.why.axis}</span>
                <strong>{endingAxes[0].label}</strong>
                <p>{endingAxes[0].text}</p>
              </article>
              <article>
                <span>{resultCopy.why.habit}</span>
                <strong>{decisionFingerprint.habit?.title || decisionFingerprint.modeTitle}</strong>{decisionFingerprint.habit ? <p>{decisionFingerprint.habit.line}</p> : null}
                <p>{view.endingCause ? view.endingCause.text : decisionFingerprint.modeText}</p>
              </article>
              <article className="result-why-doors">
                <span>{resultCopy.why.doors}</span>
                <strong>{fill(resultCopy.why.doorCount, { count: unopenedRecordCount })}</strong>
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
                  <p>{fill(resultCopy.why.doorsLeft, { clues: unopenedRecordCount - unopenedBranchCount, branches: unopenedBranchCount })}</p>
                )}
                <button type="button" className="ghost" onClick={() => startCase(currentCase)}>
                  {resultCopy.replayCase}
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
