import { useState } from "react";
import { Copy, MessageSquareText, Sparkles } from "lucide-react";
import { GuardedButton } from "../components/GuardedButton.jsx";
import { GauntletLedger } from "../gauntlet/GauntletLedger.jsx";
import * as gameConstants from "../gameConstants.js";
import reportCopy from "../copy/report.js";
import { fill } from "../locale.js";

/**
 * Act three of the report: everything it used to open with, folded.
 *
 * The report is three acts (maintenance priority 28) and this is the third --
 * the rank's evidence, the decision DNA, the route map, the observer ledger,
 * the logs and the feedback form. It was 570 lines inside `ResultScreen`, the
 * bulk of that file, while the first two acts are what the player reads.
 *
 * It reads the same `view` the result screen does; `check:view-contracts`
 * reads this file as part of the result screen. The two values the first acts
 * also print are passed in rather than derived twice.
 *
 * The body is drawn only while the archive is open. It is most of the result
 * page's DOM -- the ledger, every log row, the route map -- and a closed
 * `<details>` still built all of it on every render for a player who never
 * opens it. Nothing in it keeps state of its own: the feedback form is
 * controlled from `view`, so closing and reopening loses nothing.
 */
export function ReportArchive({ view, observerEndingRecord, endingAxes, observationLabels }) {
  const [open, setOpen] = useState(false);
  const {
    common: { currentCase, renderSceneLines, renderSceneMinutes },
    ending: { finalAftermathEntry, endingProfile, endingPreview, endingSceneProfile, unopenedClueCount },
    score: {
      decisionFingerprint, observationLedger, observerPattern, triggerLabels, triggers, result, clamp,
      easyCognitionLabels, formatRiskDelta, counterfactualReport, achievementBadges,
      routeTimeline, resourceMeta, explainResourceTradeoff, log, clueCount, caseResults, caseChange,
    },
    telemetry: {
      sessionCode, telemetryStatus, pendingTelemetry, retryPendingTelemetry, scheduleTelemetryRetry,
      telemetryEnabled, dataConsent, isOnline, isRetryingTelemetry, copySessionCode, copyStatus, telemetryStats,
    },
    feedback: {
      feedbackPrompts, currentFeedback, updateCurrentFeedback, FEEDBACK_COMMENT_MAX_LENGTH,
      activeFeedbackPrivacySignals, anonymizeFeedbackComment, submitCurrentFeedback, isSubmittingFeedback,
      feedbackStatus,
    },
    debug: { debugToolsEnabled },
  } = view;
  // A forecast that moves the risk by nothing is 「유지」 in the page's words (src/copy/report.js).
  const riskDelta = (value) => formatRiskDelta(value) || reportCopy.risk.held;
  const observerRouteRecords = routeTimeline
    .filter((entry) => entry.observerTag)
    .slice(-4)
    .map((entry) => ({
      id: `${entry.nodeId}-${entry.index}`,
      label: entry.observerTag.label,
      title: entry.title,
      text: entry.observerTag.text,
    }));
  const observerTurningPoint = observerPattern.turningPoint;
  const clueTotal = clueCount + unopenedClueCount;
  return (
    <details className="report-archive" onToggle={(event) => setOpen(event.currentTarget.open)}>
      <summary>
        <span>{reportCopy.summary.title}</span>
        <b>{reportCopy.summary.contents}</b>
      </summary>
      {open && (
      <div className="report-archive-body">
    <GauntletLedger log={log} summary={caseResults?.[currentCase]?.gauntlet} caseId={currentCase} />
    {/* Most panels below are drawn without asking whether their record is
        there: the runtime derives each one for every run, three goals and
        three comparisons included (useCaseSystems.js, useResultReport.js and
        the functions they call). The ones that still ask can be empty. */}
    {currentCase === "final" && (
      <section className="operator-reveal-panel" aria-label={reportCopy.operatorRevealLabel}>
        <span>{view.operatorReveal.title}</span>
        <p>{view.operatorReveal.text}</p>
      </section>
    )}
    {currentCase === "final" && (
      <section className="achievement-panel ending-achievement-panel" aria-label={reportCopy.achievementLabel}>
        <span lang="en">ACHIEVEMENT TRACKER</span>
        <div>{view.achievementProgress.map((item) => <article key={item.id}><b>{item.label}</b><small>{item.unlocked ? reportCopy.unlocked : `${item.value} / ${item.goal}`}</small></article>)}</div>
      </section>
    )}
    {__CP_DEBUG_BUILD__ && debugToolsEnabled && currentCase === "final" && (
      <section className="operations-snapshot" aria-label="운영 진단">
        <span lang="en">OPERATIONS</span>
        <strong>{view.operationsSnapshot.state}</strong>
        <small>errors {view.operationsSnapshot.errorCount} / pending {view.operationsSnapshot.pendingCount} / rankings {view.operationsSnapshot.rankingCount}</small>
      </section>
    )}
    {currentCase === "final" && (
      <section className="observation-panel" aria-label={reportCopy.observation.title}>
        <div className="panel-title-row">
          <h2>{reportCopy.observation.title}</h2>
          <span>{reportCopy.observation.subtitle}</span>
        </div>
        <div className="observer-pattern-card">
          <span>{observerEndingRecord.label}</span>
          <strong>{observerEndingRecord.title}</strong>
          <p>{observerEndingRecord.text}</p>
        </div>
        <div className="observation-grid">
          {Object.entries(observationLedger).map(([key, value]) => (
            <article key={key}>
              <span>{observationLabels[key]}</span>
              <b>{value}</b>
            </article>
          ))}
        </div>
      </section>
    )}
    <section className="ending-scene-profile" aria-label={reportCopy.endingSceneLabel}>
      <span>{endingSceneProfile.location}</span>
      <strong>{endingSceneProfile.cue}</strong>
      <p>{fill(reportCopy.nextSceneAction, { choice: endingSceneProfile.choice })}</p>
    </section>
    <section className="ending-preview-panel" aria-label={reportCopy.endingDirectionLabel}>
      <span lang="en">ENDING DIRECTION</span>
      <strong>{endingPreview.label}</strong>
      <p>{endingPreview.text}</p>
    </section>
    <p className="ending-rationale">{fill(reportCopy.endingRationale, { rationale: endingPreview.rationale.join(" · ") })}</p>
    <section className="authority-review-panel" aria-label={reportCopy.authorityLabel}>
      <span>{view.authorityReview.title}</span>
      <strong>{view.authorityReview.text}</strong>
      <p>{view.authorityReview.next}</p>
    </section>
    <p className="origin-ending-note"><strong>{view.originEndingVariant.label}</strong> {view.originEndingVariant.text}</p>
    {view.failureObjectives?.length > 0 && (
      <section className="failure-objectives" aria-label={reportCopy.failureObjectivesLabel}>
        <strong lang="en">RETRY OBJECTIVES</strong>
        {view.failureObjectives.map((objective) => <span key={objective}>□ {objective}</span>)}
        {view.seasonStanding.harmCases.map((item) => <button type="button" key={item.caseId} onClick={() => view.startCase(item.caseId)}>{item.text}</button>)}
        {/* A run with objectives is a collapse, and a collapse has a cause (getFailureCause, runtimeSystems.js). */}
        <p className="failure-cause"><b lang="en">PRIMARY CAUSE</b> {view.endingCause.text} {view.endingCause.recovery}</p>
      </section>
    )}
    <section className="play-report-panel" aria-label={reportCopy.playReport.label}>
      <span lang="en">PLAYER REPORT</span>
      <div>
        <article><b>{view.playReport.decisions}</b><small>{reportCopy.playReport.decisions}</small></article>
        <article><b>{view.playReport.clues}</b><small>{reportCopy.playReport.clues}</small></article>
        <article><b>{view.playReport.dominantStyle}</b><small>{reportCopy.playReport.style}</small></article>
      </div>
      <p>{fill(reportCopy.playReport.route, { route: view.playReport.route.join(" → ") || reportCopy.playReport.noRoute })}</p>
    </section>
    {__CP_DEBUG_BUILD__ && debugToolsEnabled && <section className="telemetry-dashboard-panel" aria-label="플레이테스트 상태">
      <span lang="en">PLAYTEST HEALTH</span>
      <div><b>{view.telemetryDashboard.completed}</b><small>완료 사건</small><b>{view.telemetryDashboard.pending}</b><small>재전송 대기</small><b>{view.telemetryDashboard.errors}</b><small>로컬 오류</small><b>{view.telemetryDashboard.runs}</b><small>분리된 런</small></div>
    </section>}
    {__CP_DEBUG_BUILD__ && debugToolsEnabled && telemetryStats && <p className="telemetry-stats">TELEMETRY: {telemetryStats.saved} saved / {telemetryStats.failed} failed / {telemetryStats.attempted} attempted</p>}
    <p className={`ranking-integrity ${view.rankingIntegrity.valid ? "valid" : "invalid"}`}><strong>{view.rankingIntegrity.label}</strong> {view.rankingIntegrity.text}</p>
    <section className="aftermath-panel" aria-label={reportCopy.aftermathLabel}><span>{view.aftermath.title}</span><p>{view.aftermath.text}</p></section>
    {__CP_DEBUG_BUILD__ && debugToolsEnabled && view.replayDiagnostics && <details className="replay-diagnostics"><summary lang="en">REPLAY DIAGNOSTICS</summary><p>{view.replayDiagnostics.text}</p></details>}
    {view.delayedConsequences?.length > 0 && (
      <section className="delayed-consequence-strip" aria-label={reportCopy.delayedLabel}>
        <span lang="en">CONSEQUENCE CHAIN</span>
        <p>{view.delayedConsequences.map((item) => item.text).join(" ")}</p>
      </section>
    )}
    <section className="ranking-comparison" aria-label={reportCopy.comparisonLabel}>
      <span lang="en">RUN COMPARISON</span>
      {view.rankingComparison.map((item) => <div key={item.label}><b>{item.label}</b><i><em style={{ width: `${item.value}%` }} /></i><small>{item.value}</small></div>)}
    </section>
    <section className="season-goal-strip result-goals" aria-label={reportCopy.seasonGoalsLabel}>
      <span lang="en">SEASON GOALS</span>
      {view.seasonGoals.map((goal) => <article key={goal.id}><b>{goal.label}</b><small>{goal.text}</small></article>)}
    </section>
    {view.balanceSignals?.length > 0 && (
      <section className="balance-report" aria-label={reportCopy.balance.label}>
        <span lang="en">BALANCE SIGNAL</span>
        <p>{fill(reportCopy.balance.text, { signals: view.balanceSignals.map((signal) => `“${signal.label}” ${signal.share}%`).join(" · ") })}</p>
      </section>
    )}
    <section className="ending-axis-panel" aria-label={reportCopy.endingAxis.label}>
      <div className="panel-title-row">
        <h2 lang="en">ENDING AXIS</h2>
        <span>{reportCopy.endingAxis.subtitle}</span>
      </div>
      <div className="ending-axis-grid">
        {endingAxes.map((axis) => (
          <article key={axis.label}>
            <div><span>{axis.label}</span><b>{axis.value}</b></div>
            <i><em style={{ width: `${axis.value}%` }} /></i>
            <p>{axis.text}</p>
          </article>
        ))}
      </div>
    </section>
    <section className="fingerprint-panel" aria-label={reportCopy.fingerprintLabel}>
      <div className="fingerprint-heading">
        <div>
          <span lang="en">DECISION DNA</span>
          <h2>{decisionFingerprint.modeTitle}</h2>
          <p>{decisionFingerprint.modeText}</p>
          {/* Every run has one: 복합형 when no family led (getThinkingMotive, gameLogic.js). */}
          <p>
            <b>{fill(reportCopy.motive, { label: decisionFingerprint.motive.label })}</b>{" "}
            {decisionFingerprint.motive.when}. {decisionFingerprint.motive.path}
          </p>
        </div>
        <strong>{decisionFingerprint.mode}</strong>
      </div>
      <div className="fingerprint-grid">
        <article>
          <span lang="en">PRIMARY PRESSURE</span>
          <b>{triggerLabels[decisionFingerprint.primaryTrigger[0]]}</b>
          <small>{decisionFingerprint.pressureShare}% of recorded pressure</small>
        </article>
        <article>
          <span lang="en">THINKING ENGINE</span>
          {/* One table: the second it fell back on names the same four ways of
              thinking in the same words (cognitionLabels, gameConstants.js). */}
          <b>{easyCognitionLabels[decisionFingerprint.primaryCognition[0]]}</b>
          <small>{decisionFingerprint.signature.join(" / ")}</small>
        </article>
        <article>
          <span lang="en">RISK TRAJECTORY</span>
          <b>{decisionFingerprint.ledger.netRiskDelta > 0 ? reportCopy.risk.rising : reportCopy.risk.falling}</b>
          <small>{fill(reportCopy.risk.moves, { drops: decisionFingerprint.ledger.riskDrops, rises: decisionFingerprint.ledger.riskRises })}</small>
        </article>
      </div>
    </section>
    <section className="counterfactual-panel" aria-label="Counterfactual Lab">
      <div className="panel-title-row">
        <h2 lang="en">COUNTERFACTUAL LAB</h2>
        <span>{reportCopy.counterfactual.subtitle}</span>
      </div>
      {counterfactualReport.length > 0 ? (
        <div className="counterfactual-list">
          {counterfactualReport.map((report) => (
            <article key={report.nodeId}>
              <div className="counterfactual-scene">
                <span>{report.title}</span>
                <small>{report.actualWasSafest ? reportCopy.counterfactual.safest : reportCopy.counterfactual.differs}</small>
              </div>
              <div className="counterfactual-path actual-path">
                <b lang="en">ACTUAL</b>
                <strong>{report.actual.label}</strong>
                <small>{fill(reportCopy.risk.delta, { delta: report.actualForecast ? riskDelta(report.actualForecast.riskDelta) : reportCopy.risk.recorded })}</small>
              </div>
              <div className="counterfactual-path safest-path">
                <b lang="en">LOW PRESSURE LENS</b>
                <strong>{report.safest.label}</strong>
                <small>{fill(reportCopy.risk.delta, { delta: riskDelta(report.safestForecast.riskDelta) })}</small>
              </div>
              <div className="counterfactual-path costliest-path">
                <b lang="en">HIGH PRESSURE LENS</b>
                <strong>{report.costliest.label}</strong>
                <small>{fill(reportCopy.risk.delta, { delta: riskDelta(report.costliestForecast.riskDelta) })}</small>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="counterfactual-empty">{reportCopy.counterfactual.empty}</p>
      )}
    </section>
    <section className="session-panel">
      <div>
        <span lang="en">PLAYTEST SESSION</span>
        <strong data-testid="session-code">{sessionCode}</strong>
        <p>{reportCopy.session.text}</p>
        <small
          className={`remote-status ${telemetryStatus.tone}`}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {telemetryStatus.text}
        </small>
        {!telemetryEnabled && (
          <p className="telemetry-explanation">{reportCopy.session.noRemote}</p>
        )}
        {telemetryEnabled && !dataConsent && (
          <p className="telemetry-explanation">{reportCopy.session.noConsent}</p>
        )}
        {pendingTelemetry.length > 0 && (
          <div className="retry-telemetry">
            <b>{fill(reportCopy.session.pending, { count: pendingTelemetry.length })}</b>
            <p>
              {pendingTelemetry.map((item) => item.label).join(" · ")}
            </p>
            <GuardedButton
              type="button"
              onClick={async () => {
                const result = await retryPendingTelemetry();
                if (result?.failedCount > 0) {
                  scheduleTelemetryRetry();
                }
              }}
              // Blocked, not disabled: its own words say why (연결 대기 중,
              // 재전송 중), and a disabled button is skipped before they are heard.
              blocked={!telemetryEnabled || !dataConsent || !isOnline || isRetryingTelemetry}
            >
              {isRetryingTelemetry ? reportCopy.session.retrying : isOnline ? reportCopy.session.retry : reportCopy.session.waiting}
            </GuardedButton>
          </div>
        )}
      </div>
      {/* What the copy came to is drawn on the button and said by the region
          beside it. The button's own text used to be the live region. */}
      <button type="button" onClick={copySessionCode}>
        <Copy size={16} />
        <span>{copyStatus || reportCopy.session.copyCode}</span>
      </button>
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">{copyStatus}</span>
    </section>
    <section className="achievement-panel">
      <div className="panel-title-row">
        <h2>
          <Sparkles size={17} />
          {reportCopy.badges.title}
        </h2>
        <span>{reportCopy.badges.subtitle}</span>
      </div>
      <div>
        {achievementBadges.map((badge) => (
          <article key={badge.title}>
            <b>{badge.title}</b>
            <p>{badge.text}</p>
          </article>
        ))}
      </div>
    </section>
    <div className="result-grid">
      <section className="report-section">
        <h2 lang="en">Primary Trigger</h2>
        <strong>{triggerLabels[result.primary[0]]}</strong>
        <p>{fill(reportCopy.sections.primary, { title: result.longestDecision?.title ?? reportCopy.sections.thisCase })}</p>
      </section>
      <section className="report-section">
        <h2 lang="en">Secondary Trigger</h2>
        <strong>{triggerLabels[result.secondary[0]]}</strong>
        <p>{reportCopy.sections.secondary}</p>
      </section>
      <section className="report-section">
        <h2 lang="en">Cognitive Acceleration</h2>
        <strong>{easyCognitionLabels[result.thinking[0]]}</strong>
        <p>{reportCopy.sections.cognition}</p>
      </section>
      <section className="report-section">
        <h2 lang="en">Reframe</h2>
        <strong>{fill(reportCopy.sections.reframeCount, { count: result.reframeCount })}</strong>
        <p>{reportCopy.sections.reframe}</p>
      </section>
      <section className="report-section">
        <h2 lang="en">Avg Time</h2>
        <strong>{fill(reportCopy.sections.seconds, { seconds: result.averageResponseTime })}</strong>
        <p>{reportCopy.sections.averageTime}</p>
        {result.decisionPaceLine && <p>{result.decisionPaceLine}</p>}
      </section>
      <section className="report-section wide-report">
        <h2 lang="en">Longest Decision</h2>
        <strong>{result.longestDecision?.title ?? reportCopy.sections.none}</strong>
        <p>{reportCopy.sections.longest}</p>
      </section>
    </div>
    <section className="route-atlas">
      <div className="panel-title-row">
        <h2>
          <Sparkles size={17} />
          {reportCopy.route.title}
        </h2>
        <span>{fill(reportCopy.route.count, { count: routeTimeline.length })}</span>
      </div>
      <div className="route-atlas-track" role="group" aria-label={reportCopy.route.trackLabel} tabIndex={0}>
        {routeTimeline.map((entry) => (
          <article className={`route-atlas-node ${entry.marker.tone}`} key={`${entry.nodeId}-${entry.index}`}>
            <div className="route-atlas-dot" aria-hidden="true">{String(entry.index + 1).padStart(2, "0")}</div>
            <div className="route-atlas-copy">
              <div className="route-atlas-meta">
                <span>{entry.marker.label}</span>
                {entry.challenge && (
                  <b className={entry.challenge.matched ? "route-hit" : "route-miss"}>
                    {entry.challenge.matched ? reportCopy.route.hit : reportCopy.route.miss}
                  </b>
                )}
                {entry.streakBreak && <b className="route-break">{reportCopy.route.streakBreak}</b>}
                {entry.clue && <b className="route-clue">{reportCopy.route.clue}</b>}
                {entry.routeChangeKind === "memory" && <b className="route-memory" lang="en">MEMORY</b>}
                {entry.routeChangeKind === "evidence-turn" && <b className="route-turnaround" lang="en">EVIDENCE TURN</b>}
                {entry.routeChangeKind === "reframe" && <b className="route-system" lang="en">REFRAME</b>}
                {entry.observerTag && <b className="route-observer">{entry.observerTag.label}</b>}
              </div>
              <strong>{entry.title}</strong>
              <p>{entry.spokenChoice || entry.choice}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
    {observerRouteRecords.length > 0 && (
      <section className="observer-postmortem" aria-label={reportCopy.postmortem.label}>
        <div className="panel-title-row">
          <h2 lang="en">
            <Sparkles size={17} />
            OBSERVER POSTMORTEM
          </h2>
          <span>{fill(reportCopy.postmortem.basis, { label: observerEndingRecord.label })}</span>
        </div>
        <div className="observer-postmortem-grid">
          {observerTurningPoint && (
            <article className="observer-turning-record">
              <span>{observerTurningPoint.label}</span>
              <strong>{observerTurningPoint.title}</strong>
              <p>{observerTurningPoint.text}</p>
            </article>
          )}
          {observerRouteRecords.map((record) => (
            <article key={record.id}>
              <span>{record.label}</span>
              <strong>{record.title}</strong>
              <p>{record.text}</p>
            </article>
          ))}
        </div>
      </section>
    )}
    <section className="feedback-panel">
      <div className="panel-title-row">
        <h2>
          <MessageSquareText size={17} />
          {reportCopy.feedback.title}
        </h2>
        <span>{reportCopy.feedback.subtitle}</span>
      </div>
      <div className="feedback-prompts">
        <span>{reportCopy.feedback.prompts}</span>
        <ul>
          {feedbackPrompts.map((prompt) => (
            <li key={prompt}>{prompt}</li>
          ))}
        </ul>
      </div>
      <div className="feedback-controls">
        <label>
          <span>{reportCopy.feedback.clarity}</span>
          <select
            value={currentFeedback.clarity}
            onChange={(event) => updateCurrentFeedback({ clarity: event.target.value })}
          >
            <option value="">{reportCopy.feedback.choose}</option>
            <option value="1">{reportCopy.feedback.clarityOptions[0]}</option>
            <option value="2">{reportCopy.feedback.clarityOptions[1]}</option>
            <option value="3">{reportCopy.feedback.clarityOptions[2]}</option>
            <option value="4">{reportCopy.feedback.clarityOptions[3]}</option>
            <option value="5">{reportCopy.feedback.clarityOptions[4]}</option>
          </select>
        </label>
        <label>
          <span>{reportCopy.feedback.difficulty}</span>
          <select
            value={currentFeedback.difficulty}
            onChange={(event) => updateCurrentFeedback({ difficulty: event.target.value })}
          >
            <option value="">{reportCopy.feedback.choose}</option>
            <option value="1">{reportCopy.feedback.difficultyOptions[0]}</option>
            <option value="2">{reportCopy.feedback.difficultyOptions[1]}</option>
            <option value="3">{reportCopy.feedback.difficultyOptions[2]}</option>
            <option value="4">{reportCopy.feedback.difficultyOptions[3]}</option>
            <option value="5">{reportCopy.feedback.difficultyOptions[4]}</option>
          </select>
        </label>
      </div>
      <textarea
        value={currentFeedback.comment}
        onChange={(event) => updateCurrentFeedback({ comment: event.target.value })}
        maxLength={FEEDBACK_COMMENT_MAX_LENGTH}
        placeholder={reportCopy.feedback.placeholder}
        aria-label={reportCopy.feedback.commentLabel}
        aria-describedby={
          activeFeedbackPrivacySignals.length > 0
            ? "feedback-input-note feedback-privacy-warning"
            : "feedback-input-note"
        }
      />
      <p className="input-note" id="feedback-input-note">
        {fill(reportCopy.feedback.note, { count: currentFeedback.comment.length, max: FEEDBACK_COMMENT_MAX_LENGTH })}
      </p>
      {activeFeedbackPrivacySignals.length > 0 && (
        <div className="privacy-warning" id="feedback-privacy-warning" role="alert">
          <strong>{reportCopy.feedback.privacyTitle}</strong>
          <p>{fill(reportCopy.feedback.privacyText, { signals: activeFeedbackPrivacySignals.map((signal) => signal.label).join(" / ") })}</p>
          <button type="button" onClick={anonymizeFeedbackComment}>
            {reportCopy.feedback.anonymize}
          </button>
        </div>
      )}
      <div className="feedback-actions">
        <GuardedButton
          type="button"
          onClick={submitCurrentFeedback}
          // Blocked, not disabled, so the reason can be reached (priority 4);
          // and the reason is the warning above, which describes the button
          // instead of replacing the name its own text gives it.
          blocked={activeFeedbackPrivacySignals.length > 0 || isSubmittingFeedback}
          aria-busy={isSubmittingFeedback}
          aria-describedby={activeFeedbackPrivacySignals.length > 0 ? "feedback-privacy-warning" : undefined}
        >
          {isSubmittingFeedback ? reportCopy.feedback.saving : reportCopy.feedback.save}
        </GuardedButton>
        <span role="status" aria-live="polite">{feedbackStatus}</span>
      </div>
    </section>
    <section className="bars-panel">
      <h2 lang="en">Trigger Map</h2>
      {Object.entries(triggerLabels).map(([key, label]) => (
        <div className="bar-row" key={key}>
          <span>{label}</span>
          <div className="bar-track">
            <div style={{ width: `${clamp(triggers[key] * 5, 4, 100)}%` }} />
          </div>
          <b>{triggers[key]}</b>
        </div>
      ))}
    </section>
    <section className="history">
      <h2 lang="en">Decision Log</h2>
      {log.map((entry, index) => (
        <article key={`${entry.nodeId}-${index}`}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <div>
            <b>{entry.title}</b>
            <p>{entry.spokenChoice || entry.choice}</p>
            {entry.challenge && (
              <div className="history-challenge">
                {entry.tactical && (
                  <small className={`challenge-grade grade-${entry.tactical.grade.toLowerCase()}`}>
                    {fill(reportCopy.history.grade, { grade: entry.tactical.grade, text: entry.tactical.gradeText })}
                  </small>
                )}
                <small className={entry.challenge.matched ? "challenge-success" : "challenge-miss"}>
                  {entry.challenge.matched ? reportCopy.history.challengeHit : reportCopy.history.challengeMiss} · {entry.challenge.title}
                </small>
                <small>{fill(reportCopy.risk.delta, { delta: `${entry.challenge.riskDelta > 0 ? "+" : ""}${entry.challenge.riskDelta}` })}</small>
                {entry.flowSurge && (
                  <small className="surge-success">
                    {entry.flowSurge.label} · {entry.flowSurge.text}
                  </small>
                )}
                {/* An entry logged before 2026-10-11 holds the line as `tempoBonus`. */}
                {[entry.handLine ?? entry.tempoBonus].map((line) => line && <small key="hand" className="hand-line-log">{line.label} · {line.text}</small>)}
                {entry.suspenseEvent && (
                  <small className="suspense-event-log">
                    {entry.suspenseEvent.label} · {entry.suspenseEvent.text}
                  </small>
                )}
                {entry.streakBreak && (
                  <small className="streak-break-log">
                    {entry.streakBreak.label} · {entry.streakBreak.text}
                  </small>
                )}
              </div>
            )}
            {entry.observerTag && (
              <div className="history-observer">
                <span>{entry.observerTag.label}</span>
                <p>{entry.observerTag.text}</p>
              </div>
            )}
            {entry.sceneBeat && (
              <details className="decision-scene">
                <summary>{reportCopy.history.replayScene}</summary>
                <div>{renderSceneLines(entry.sceneBeat)}</div>
              </details>
            )}
            {entry.skippedNodeId && renderSceneMinutes(entry.skippedNodeId)}
            <small>{fill(reportCopy.history.seconds, { seconds: entry.responseTimeSec, echo: entry.echo })}</small>
          </div>
        </article>
      ))}
    </section>
    <section className="resource-delta-panel">
      <h2 lang="en">Resource Change</h2>
      <div className="delta-table">
        {/* The case as a whole, ahead of its decisions: where the six stood when it opened and where it left them. */}
        {caseChange.length > 0 && (
          <article data-testid="case-resource-change">
            <b>{reportCopy.caseChange}</b>
            <div>{caseChange.map((row) => <span key={row.key} className={row.gain === null ? undefined : row.gain ? "delta-up" : "delta-down"}>{row.text}</span>)}</div>
          </article>
        )}
        {log.map((entry, index) => (
          <article key={`${entry.nodeId}-delta-${index}`}>
            <b>{String(index + 1).padStart(2, "0")} · {entry.title}</b>
            <div>
              {/* Green marks what the run gained, so 사람 피해 +11 is a
                  loss here even though the number went up. */}
              {Object.entries(entry.effect ?? {}).map(([key, value]) => (
                <span key={key} className={gameConstants.isResourceGain(key, value) ? "delta-up" : "delta-down"}>
                  {resourceMeta[key]?.label ?? key} {value > 0 ? "+" : ""}
                  {value}
                </span>
              ))}
            </div>
            <p>{explainResourceTradeoff(entry.effect)}</p>
          </article>
        ))}
      </div>
    </section>
    {currentCase === "final" ? (
      <section className="story-reveal ending-reveal">
        <span>SEASON 1 COMPLETE · {endingProfile.tag}</span>
        <h2>{endingProfile.title}</h2>
        <p>{endingProfile.text} {finalAftermathEntry ? fill(reportCopy.finale.aftermath, { choice: finalAftermathEntry.choice }) : ""}</p>
        <div className="ending-clue-summary">
          {/* Out of every clue the season holds, and the bar is the one the
              record endings ask for. It read "30/6", against a bar of four. */}
          <strong>{fill(reportCopy.finale.clues, { clueCount, clueTotal })}</strong>
          <span>
            {clueCount >= clueTotal * gameConstants.ENDING_GATES.clueRate
              ? reportCopy.finale.reached
              : reportCopy.finale.more}
          </span>
        </div>
      </section>
    ) : (
      <section className="story-reveal">
        <span lang="en">NEXT CASE SIGNAL</span>
        <h2>{reportCopy.nextCase.title}</h2>
        <p>{reportCopy.nextCase.text}</p>
      </section>
    )}
      </div>
      )}
    </details>
  );
}
