import { useState } from "react";
import { Copy, MessageSquareText, Sparkles } from "lucide-react";
import { GuardedButton } from "../components/GuardedButton.jsx";
import { GauntletLedger } from "../gauntlet/GauntletLedger.jsx";
import * as gameConstants from "../gameConstants.js";

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
    common: { currentCase, renderSceneLines },
    ending: { finalAftermathEntry, endingProfile, endingPreview, endingSceneProfile, unopenedClueCount },
    score: {
      decisionFingerprint, observationLedger, observerPattern, triggerLabels, triggers, result, clamp,
      easyCognitionLabels, formatRiskDelta, counterfactualReport, achievementBadges,
      routeTimeline, resourceMeta, explainResourceTradeoff, log, clueCount, caseResults,
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
        <span>전체 기록</span>
        <b>랭크 근거, 판단 DNA, 경로 지도, 관찰 장부, 선택 로그</b>
      </summary>
      {open && (
      <div className="report-archive-body">
    <GauntletLedger log={log} summary={caseResults?.[currentCase]?.gauntlet} />
    {/* Most panels below are drawn without asking whether their record is
        there: the runtime derives each one for every run, three goals and
        three comparisons included (useCaseSystems.js, useResultReport.js and
        the functions they call). The ones that still ask can be empty. */}
    {currentCase === "final" && (
      <section className="operator-reveal-panel" aria-label="주인공 정체 공개">
        <span>{view.operatorReveal.title}</span>
        <p>{view.operatorReveal.text}</p>
      </section>
    )}
    {currentCase === "final" && (
      <section className="achievement-panel ending-achievement-panel" aria-label="업적 진행">
        <span lang="en">ACHIEVEMENT TRACKER</span>
        <div>{view.achievementProgress.map((item) => <article key={item.id}><b>{item.label}</b><small>{item.unlocked ? "UNLOCKED" : `${item.value} / ${item.goal}`}</small></article>)}</div>
      </section>
    )}
    {currentCase === "final" && (
      <section className="operations-snapshot" aria-label="운영 진단">
        <span lang="en">OPERATIONS</span>
        <strong>{view.operationsSnapshot.state}</strong>
        <small>errors {view.operationsSnapshot.errorCount} / pending {view.operationsSnapshot.pendingCount} / rankings {view.operationsSnapshot.rankingCount}</small>
      </section>
    )}
    {currentCase === "final" && (
      <section className="observation-panel" aria-label="관찰 장부">
        <div className="panel-title-row">
          <h2>관찰 장부</h2>
          <span>마지막 사건에서 처음 공개되는 네 가지 반응</span>
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
    <section className="ending-scene-profile" aria-label="엔딩 장면 프로필">
      <span>{endingSceneProfile.location}</span>
      <strong>{endingSceneProfile.cue}</strong>
      <p>다음 장면의 핵심 행동: {endingSceneProfile.choice}</p>
    </section>
    <section className="ending-preview-panel" aria-label="현재 엔딩 방향">
      <span lang="en">ENDING DIRECTION</span>
      <strong>{endingPreview.label}</strong>
      <p>{endingPreview.text}</p>
    </section>
    <p className="ending-rationale">엔딩 근거: {endingPreview.rationale.join(" · ")}</p>
    <section className="authority-review-panel" aria-label="권한 심사">
      <span>{view.authorityReview.title}</span>
      <strong>{view.authorityReview.text}</strong>
      <p>{view.authorityReview.next}</p>
    </section>
    <p className="origin-ending-note"><strong>{view.originEndingVariant.label}</strong> {view.originEndingVariant.text}</p>
    {view.failureObjectives?.length > 0 && (
      <section className="failure-objectives" aria-label="실패 재도전 목표">
        <strong lang="en">RETRY OBJECTIVES</strong>
        {view.failureObjectives.map((objective) => <span key={objective}>□ {objective}</span>)}
        <button type="button" onClick={view.startRecoveryRoute}>복구 루트 시작</button>
        {/* A run with objectives is a collapse, and a collapse has a cause (getFailureCause, advancedSystems.js). */}
        <p className="failure-cause"><b lang="en">PRIMARY CAUSE</b> {view.endingCause.text} {view.endingCause.recovery}</p>
      </section>
    )}
    <section className="play-report-panel" aria-label="플레이 리포트">
      <span lang="en">PLAYER REPORT</span>
      <div><article><b>{view.playReport.decisions}</b><small>결정</small></article><article><b>{view.playReport.clues}</b><small>검증 신호</small></article><article><b>{view.playReport.dominantStyle}</b><small>행동 성향</small></article></div>
      <p>최근 지나온 장면: {view.playReport.route.join(" → ") || "기록 없음"}</p>
    </section>
    <section className="telemetry-dashboard-panel" aria-label="플레이테스트 상태">
      <span lang="en">PLAYTEST HEALTH</span>
      <div><b>{view.telemetryDashboard.completed}</b><small>완료 케이스</small><b>{view.telemetryDashboard.pending}</b><small>재전송 대기</small><b>{view.telemetryDashboard.errors}</b><small>로컬 오류</small><b>{view.telemetryDashboard.runs}</b><small>분리된 런</small></div>
    </section>
    {__CP_DEBUG_BUILD__ && debugToolsEnabled && telemetryStats && <p className="telemetry-stats">TELEMETRY: {telemetryStats.saved} saved / {telemetryStats.failed} failed / {telemetryStats.attempted} attempted</p>}
    <p className={`ranking-integrity ${view.rankingIntegrity.valid ? "valid" : "invalid"}`}><strong>{view.rankingIntegrity.label}</strong> {view.rankingIntegrity.text}</p>
    <section className="aftermath-panel" aria-label="엔딩 이후 변화"><span>{view.aftermath.title}</span><p>{view.aftermath.text}</p></section>
    {__CP_DEBUG_BUILD__ && debugToolsEnabled && view.replayDiagnostics && <details className="replay-diagnostics"><summary lang="en">REPLAY DIAGNOSTICS</summary><p>{view.replayDiagnostics.text}</p></details>}
    {view.delayedConsequences?.length > 0 && (
      <section className="delayed-consequence-strip" aria-label="챕터 지연 결과">
        <span lang="en">CONSEQUENCE CHAIN</span>
        <p>{view.delayedConsequences.map((item) => item.text).join(" ")}</p>
      </section>
    )}
    <section className="ranking-comparison" aria-label="기록 비교">
      <span lang="en">RUN COMPARISON</span>
      {view.rankingComparison.map((item) => <div key={item.label}><b>{item.label}</b><i><em style={{ width: `${item.value}%` }} /></i><small>{item.value}</small></div>)}
    </section>
    <section className="season-goal-strip result-goals" aria-label="시즌 목표">
      <span lang="en">SEASON GOALS</span>
      {view.seasonGoals.map((goal) => <article key={goal.id}><b>{goal.label}</b><small>{goal.text}</small></article>)}
    </section>
    {view.balanceSignals?.length > 0 && (
      <section className="balance-report" aria-label="플레이 밸런스 리포트">
        <span lang="en">BALANCE SIGNAL</span>
        <p>{view.balanceSignals.map((signal) => `“${signal.label}” ${signal.share}%`).join(" · ")} 선택 편중이 감지되었습니다. 다음 기록에서 다른 선택을 시험해 보세요.</p>
      </section>
    )}
    <section className="ending-axis-panel" aria-label="엔딩 결정 축">
      <div className="panel-title-row">
        <h2 lang="en">ENDING AXIS</h2>
        <span>이번 선택이 남긴 세 가지 방향</span>
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
    <section className="fingerprint-panel" aria-label="판단 DNA">
      <div className="fingerprint-heading">
        <div>
          <span lang="en">DECISION DNA</span>
          <h2>{decisionFingerprint.modeTitle}</h2>
          <p>{decisionFingerprint.modeText}</p>
          {/* Every run has one: 복합형 when no family led (getThinkingMotive, gameLogic.js). */}
          <p>
            <b>
              생각이 깨어나는 조건 · {decisionFingerprint.motive.label}
            </b>{" "}
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
          <b>{decisionFingerprint.ledger.netRiskDelta > 0 ? "압박 누적" : "압박 회수"}</b>
          <small>
            {decisionFingerprint.ledger.riskDrops}회 하락 · {decisionFingerprint.ledger.riskRises}회 상승
          </small>
        </article>
      </div>
    </section>
    <section className="counterfactual-panel" aria-label="Counterfactual Lab">
      <div className="panel-title-row">
        <h2 lang="en">COUNTERFACTUAL LAB</h2>
        <span>실제 선택과 선택하지 않은 관점의 압박 차이</span>
      </div>
      {counterfactualReport.length > 0 ? (
        <div className="counterfactual-list">
          {counterfactualReport.map((report) => (
            <article key={report.nodeId}>
              <div className="counterfactual-scene">
                <span>{report.title}</span>
                <small>{report.actualWasSafest ? "압박을 낮춘 관점" : "다른 관점과 차이 발생"}</small>
              </div>
              <div className="counterfactual-path actual-path">
                <b lang="en">ACTUAL</b>
                <strong>{report.actual.label}</strong>
                <small>
                  위험 {report.actualForecast ? formatRiskDelta(report.actualForecast.riskDelta) : "기록"}
                </small>
              </div>
              <div className="counterfactual-path safest-path">
                <b lang="en">LOW PRESSURE LENS</b>
                <strong>{report.safest.label}</strong>
                <small>위험 {formatRiskDelta(report.safestForecast.riskDelta)}</small>
              </div>
              <div className="counterfactual-path costliest-path">
                <b lang="en">HIGH PRESSURE LENS</b>
                <strong>{report.costliest.label}</strong>
                <small>위험 {formatRiskDelta(report.costliestForecast.riskDelta)}</small>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="counterfactual-empty">선택 로그가 쌓이면 지나간 장면의 다른 경로가 열립니다.</p>
      )}
    </section>
    <section className="session-panel">
      <div>
        <span lang="en">PLAYTEST SESSION</span>
        <strong data-testid="session-code">{sessionCode}</strong>
        <p>테스터 인터뷰, JSON 로그, 원격 저장 기록을 맞출 때 쓰는 짧은 세션 코드입니다.</p>
        <small
          className={`remote-status ${telemetryStatus.tone}`}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {telemetryStatus.text}
        </small>
        {!telemetryEnabled && (
          <p className="telemetry-explanation">원격 랭킹 설정이 없어 이 브라우저에만 저장됩니다.</p>
        )}
        {telemetryEnabled && !dataConsent && (
          <p className="telemetry-explanation">데이터 제공 동의가 없어 원격 랭킹에 기록하지 않았습니다.</p>
        )}
        {pendingTelemetry.length > 0 && (
          <div className="retry-telemetry">
            <b>원격 저장 대기 {pendingTelemetry.length}건</b>
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
              {isRetryingTelemetry ? "재전송 중" : isOnline ? "원격 저장 재시도" : "연결 대기 중"}
            </GuardedButton>
          </div>
        )}
      </div>
      {/* What the copy came to is drawn on the button and said by the region
          beside it. The button's own text used to be the live region. */}
      <button type="button" onClick={copySessionCode}>
        <Copy size={16} />
        <span>{copyStatus || "코드 복사"}</span>
      </button>
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">{copyStatus}</span>
    </section>
    <section className="achievement-panel">
      <div className="panel-title-row">
        <h2>
          <Sparkles size={17} />
          획득 배지
        </h2>
        <span>이번 케이스의 플레이 스타일입니다.</span>
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
        <p>{result.longestDecision?.title ?? "이번 케이스"}에서 가장 오래 남은 압박입니다. 이후 선택 로그는 이 조건을 중심으로 다음 사건에 반영됩니다.</p>
      </section>
      <section className="report-section">
        <h2 lang="en">Secondary Trigger</h2>
        <strong>{triggerLabels[result.secondary[0]]}</strong>
        <p>첫 번째 조건을 보조한 압박입니다. 같은 선택 안에서도 명분과 비용이 이 방향으로 다시 흔들렸습니다.</p>
      </section>
      <section className="report-section">
        <h2 lang="en">Cognitive Acceleration</h2>
        <strong>{easyCognitionLabels[result.thinking[0]]}</strong>
        <p>로그상 가장 자주 사용된 생각 방식입니다. 선택을 빠르게 닫기보다 이 방식으로 한 번 더 버티거나 뒤집었습니다.</p>
      </section>
      <section className="report-section">
        <h2 lang="en">Reframe</h2>
        <strong>{result.reframeCount}회</strong>
        <p>준비된 선택지를 고르는 대신 판을 다시 연 횟수입니다. 0회라면 다음 테스트에서는 구조 재설계 유도가 충분했는지 확인해야 합니다.</p>
      </section>
      <section className="report-section">
        <h2 lang="en">Avg Time</h2>
        <strong>{result.averageResponseTime}s</strong>
        <p>각 국면에서 결정을 내리기까지 걸린 평균 시간입니다. 짧을수록 선택지가 명확했거나 압박이 약했을 수 있습니다.</p>
      </section>
      <section className="report-section wide-report">
        <h2 lang="en">Longest Decision</h2>
        <strong>{result.longestDecision?.title ?? "없음"}</strong>
        <p>가장 오래 머문 국면입니다. 이 장면의 메모, 에코 반론, 선택지 비용이 실제 고민을 만들었는지 인터뷰에서 우선 확인합니다.</p>
      </section>
    </div>
    <section className="route-atlas">
      <div className="panel-title-row">
        <h2>
          <Sparkles size={17} />
          내가 지나온 경로
        </h2>
        <span>{routeTimeline.length}개 판단 · 마지막 선택이 이번 결말을 만들었습니다.</span>
      </div>
      <div className="route-atlas-track" role="group" aria-label="이번 플레이 선택 경로" tabIndex={0}>
        {routeTimeline.map((entry) => (
          <article className={`route-atlas-node ${entry.marker.tone}`} key={`${entry.nodeId}-${entry.index}`}>
            <div className="route-atlas-dot" aria-hidden="true">{String(entry.index + 1).padStart(2, "0")}</div>
            <div className="route-atlas-copy">
              <div className="route-atlas-meta">
                <span>{entry.marker.label}</span>
                {entry.challenge && (
                  <b className={entry.challenge.matched ? "route-hit" : "route-miss"}>
                    {entry.challenge.matched ? "목표 달성" : "목표 미달"}
                  </b>
                )}
                {entry.streakBreak && <b className="route-break">연속 끊김</b>}
                {entry.clue && <b className="route-clue">단서 발견</b>}
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
      <section className="observer-postmortem" aria-label="관찰자 회고">
        <div className="panel-title-row">
          <h2>
            <Sparkles size={17} />
            OBSERVER POSTMORTEM
          </h2>
          <span>이번 보고서의 해석 기준: {observerEndingRecord.label}</span>
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
          플레이테스트 피드백
        </h2>
        <span>이 케이스가 실제로 고민을 만들었는지 확인합니다.</span>
      </div>
      <div className="feedback-prompts">
        <span>이번 케이스에서 확인할 질문</span>
        <ul>
          {feedbackPrompts.map((prompt) => (
            <li key={prompt}>{prompt}</li>
          ))}
        </ul>
      </div>
      <div className="feedback-controls">
        <label>
          <span>이해도</span>
          <select
            value={currentFeedback.clarity}
            onChange={(event) => updateCurrentFeedback({ clarity: event.target.value })}
          >
            <option value="">선택</option>
            <option value="1">1 · 거의 이해되지 않음</option>
            <option value="2">2 · 일부만 이해됨</option>
            <option value="3">3 · 보통</option>
            <option value="4">4 · 대체로 명확함</option>
            <option value="5">5 · 매우 명확함</option>
          </select>
        </label>
        <label>
          <span>고민 강도</span>
          <select
            value={currentFeedback.difficulty}
            onChange={(event) => updateCurrentFeedback({ difficulty: event.target.value })}
          >
            <option value="">선택</option>
            <option value="1">1 · 바로 결정함</option>
            <option value="2">2 · 조금 고민함</option>
            <option value="3">3 · 보통</option>
            <option value="4">4 · 꽤 오래 고민함</option>
            <option value="5">5 · 매우 결정하기 어려움</option>
          </select>
        </label>
      </div>
      <textarea
        value={currentFeedback.comment}
        onChange={(event) => updateCurrentFeedback({ comment: event.target.value })}
        maxLength={FEEDBACK_COMMENT_MAX_LENGTH}
        placeholder="막힌 장면, 이해되지 않은 용어, 다시 보고 싶은 선택지를 짧게 남겨주세요."
        aria-label="플레이테스트 피드백 자유 의견"
        aria-describedby={
          activeFeedbackPrivacySignals.length > 0
            ? "feedback-input-note feedback-privacy-warning"
            : "feedback-input-note"
        }
      />
      <p className="input-note" id="feedback-input-note">
        실명, 연락처, 회사명, 실제 사건 관계자 이름은 적지 마세요. {currentFeedback.comment.length}/
        {FEEDBACK_COMMENT_MAX_LENGTH}
      </p>
      {activeFeedbackPrivacySignals.length > 0 && (
        <div className="privacy-warning" id="feedback-privacy-warning" role="alert">
          <strong>피드백에 식별 정보로 보일 수 있는 표현이 있습니다.</strong>
          <p>
            감지 항목: {activeFeedbackPrivacySignals.map((signal) => signal.label).join(" / ")}.
            저장하려면 인터뷰 기록과 원격 저장 기록에 남기기 전에 익명 표현으로 바꿔주세요.
          </p>
          <button type="button" onClick={anonymizeFeedbackComment}>
            피드백 익명화
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
          {isSubmittingFeedback ? "저장 중..." : "피드백 저장"}
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
                    등급 {entry.tactical.grade} · {entry.tactical.gradeText}
                  </small>
                )}
                <small className={entry.challenge.matched ? "challenge-success" : "challenge-miss"}>
                  {entry.challenge.matched ? "챌린지 달성" : "챌린지 미달"} · {entry.challenge.title}
                </small>
                <small>
                  위험 {entry.challenge.riskDelta > 0 ? "+" : ""}
                  {entry.challenge.riskDelta}
                </small>
                {entry.flowSurge && (
                  <small className="surge-success">
                    {entry.flowSurge.label} · {entry.flowSurge.text}
                  </small>
                )}
                {/* An entry logged before 2026-10-11 holds the line as `tempoBonus`. */}
                {[entry.handLine ?? entry.tempoBonus].map((line) => line && <small key="hand" className="tempo-bonus-log">{line.label} · {line.text}</small>)}
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
                <summary>장면 다시 보기</summary>
                <div>{renderSceneLines(entry.sceneBeat)}</div>
              </details>
            )}
            <small>{entry.responseTimeSec}s · {entry.echo}</small>
          </div>
        </article>
      ))}
    </section>
    <section className="resource-delta-panel">
      <h2 lang="en">Resource Change</h2>
      <div className="delta-table">
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
        <p>{endingProfile.text} {finalAftermathEntry ? `마지막 후폭풍에서 고른 길: "${finalAftermathEntry.choice}".` : ""}</p>
        <div className="ending-clue-summary">
          {/* Out of every clue the season holds, and the bar is the one the
              record endings ask for. It read "30/6", against a bar of four. */}
          <strong>{clueCount}/{clueTotal} 숨은 단서 발견</strong>
          <span>
            {clueCount >= clueTotal * gameConstants.ENDING_GATES.clueRate
              ? "실험의 바깥쪽까지 도달했습니다. 마지막 기록이 당신의 선택을 기다립니다."
              : "다른 장면에서 위험한 성공을 만들면 더 많은 기록을 찾을 수 있습니다."}
          </span>
        </div>
      </section>
    ) : (
      <section className="story-reveal">
        <span lang="en">NEXT CASE SIGNAL</span>
        <h2>다음 사건은 당신이 가장 강하게 반응한 조건을 중심으로 재구성됩니다.</h2>
        <p>트리거랩은 사건 해결 능력만 보지 않습니다. 어떤 압박이 들어왔을 때 당신이 더 오래 생각하고, 더 쉽게 원칙을 바꾸며, 더 많은 손실을 감수하는지 기록합니다.</p>
      </section>
    )}
      </div>
      )}
    </details>
  );
}
